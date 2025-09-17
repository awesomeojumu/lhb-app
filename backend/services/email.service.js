const transporter = require('../config/email')
const EmailLog = require('../models/EmailLog')
const {
  welcomeEmailTemplate,
  kpiAssignmentTemplate,
  kpiDeadlineReminderTemplate,
  roleChangeTemplate,
  passwordResetTemplate,
  kpiCompletionTemplate,
  accountStatusChangeTemplate
} = require('../utils/emailTemplates')

/**
 * Send an email with retry and logging support.
 * @param {Object} param0 - Email payload
 * @param {string} param0.to - Recipient email
 * @param {string} param0.subject - Email subject
 * @param {string} param0.html - HTML content
 * @param {number} maxRetries - Number of retry attempts (default: 3)
 */
const sendEmailWithRetry = async ({ to, subject, html }, maxRetries = 3) => {
  let attempts = 0
  let lastError = null

  while (attempts < maxRetries) {
    try {
      await transporter.sendMail({
        from: `LHB App <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      })

      await EmailLog.create({
        to,
        subject,
        success: true,
        attempts: attempts + 1
      })

      console.log(`✅ Email sent to ${to}`)
      return
    } catch (err) {
      attempts++
      lastError = err.message
      console.error(`❌ Attempt ${attempts} failed for ${to}: ${err.message}`)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempts - 1))
      )
    }
  }

  await EmailLog.create({
    to,
    subject,
    success: false,
    attempts,
    error: lastError
  })
}

/**
 * Sends a welcome email to new users
 */
const sendWelcomeEmail = async (to, name) => {
  const subject = `Welcome to LHB App, ${name}`
  const html = welcomeEmailTemplate(name)

  await sendEmailWithRetry({ to, subject, html })
}

/**
 * Sends enhanced KPI assignment email
 */
const sendKPINotification = async (to, name, kpiTitle, kpiDescription, deadline, priority = 'medium', category = 'other') => {
  const subject = `New KPI Assigned: ${kpiTitle}`
  const html = kpiAssignmentTemplate(name, kpiTitle, kpiDescription, deadline, priority, category)

  await sendEmailWithRetry({ to, subject, html })
}

/**
 * Sends KPI deadline reminder email
 */
const sendKPIDeadlineReminder = async (to, name, kpiTitle, deadline, daysLeft) => {
  const urgencyText = daysLeft <= 1 ? 'URGENT' : daysLeft <= 3 ? 'DUE SOON' : 'REMINDER'
  const subject = `KPI Deadline ${urgencyText}: ${kpiTitle}`
  const html = kpiDeadlineReminderTemplate(name, kpiTitle, deadline, daysLeft)

  await sendEmailWithRetry({ to, subject, html })
}

/**
 * Sends role change notification email
 */
const sendRoleChangeNotification = async (to, name, oldRole, newRole, changedBy) => {
  const subject = `Role Update: ${oldRole} → ${newRole}`
  const html = roleChangeTemplate(name, oldRole, newRole, changedBy)

  await sendEmailWithRetry({ to, subject, html })
}

/**
 * Sends password reset email
 */
const sendPasswordResetEmail = async (to, name, resetToken, resetUrl) => {
  const subject = 'Password Reset Request - Lighthouse Barracks'
  const html = passwordResetTemplate(name, resetToken, resetUrl)

  await sendEmailWithRetry({ to, subject, html })
}

/**
 * Sends KPI completion notification to commanders
 */
const sendKPICompletionNotification = async (to, commanderName, soldierName, kpiTitle, completedAt) => {
  const subject = `KPI Completed: ${kpiTitle} by ${soldierName}`
  const html = kpiCompletionTemplate(commanderName, soldierName, kpiTitle, completedAt)

  await sendEmailWithRetry({ to, subject, html })
}

/**
 * Sends account status change notification
 */
const sendAccountStatusChangeNotification = async (to, name, status, reason) => {
  const statusText = status === 'active' ? 'ACTIVATED' : 'DEACTIVATED'
  const subject = `Account ${statusText} - Lighthouse Barracks`
  const html = accountStatusChangeTemplate(name, status, reason)

  await sendEmailWithRetry({ to, subject, html })
}

module.exports = {
  sendWelcomeEmail,
  sendKPINotification,
  sendKPIDeadlineReminder,
  sendRoleChangeNotification,
  sendPasswordResetEmail,
  sendKPICompletionNotification,
  sendAccountStatusChangeNotification
}
