// models/EmailLog.js
const mongoose = require('mongoose')

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  success: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  error: { type: String, default: null },
  sentAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('EmailLog', emailLogSchema)

// services/email.service.js
const transporter = require('../config/email')
const EmailLog = require('../models/EmailLog')
const { welcomeEmailTemplate } = require('../utils/emailTemplates')

const sendEmailWithRetry = async ({ to, subject, html }, maxRetries = 3) => {
  let attempts = 0
  let lastError = null

  while (attempts < maxRetries) {
    try {
      await transporter.sendMail({ from: `LHB App <${process.env.EMAIL_USER}>`, to, subject, html })
      await EmailLog.create({ to, subject, success: true, attempts: attempts + 1 })
      console.log(`✅ Email sent to ${to}`)
      return
    } catch (err) {
      attempts++
      lastError = err.message
      console.error(`❌ Attempt ${attempts} failed for ${to}: ${err.message}`)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)))
    }
  }

  await EmailLog.create({ to, subject, success: false, attempts, error: lastError })
}

const sendWelcomeEmail = async (to, name) => {
  await sendEmailWithRetry({
    to,
    subject: `Welcome to LHB App, ${name}`,
    html: welcomeEmailTemplate(name)
  })
}

const sendKPINotification = async (to, name, kpiTitle, deadline) => {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>You’ve been assigned a new KPI:</p>
      <p><strong>${kpiTitle}</strong></p>
      <p>Deadline: ${new Date(deadline).toLocaleString()}</p>
      <p>Please log in to your dashboard to respond.</p>
      <p>– LHB Command</p>
    </div>
  `

  await sendEmailWithRetry({
    to,
    subject: `New KPI Assigned: ${kpiTitle}`,
    html
  })
}

module.exports = {
  sendWelcomeEmail,
  sendKPINotification
}
