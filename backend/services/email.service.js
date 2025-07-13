const transporter = require("../config/email");
const EmailLog = require("../models/EmailLog");
const { welcomeEmailTemplate } = require("../utils/emailTemplates");

/**
 * Send an email with retry and logging support.
 * @param {Object} param0 - Email payload
 * @param {string} param0.to - Recipient email
 * @param {string} param0.subject - Email subject
 * @param {string} param0.html - HTML content
 * @param {number} maxRetries - Number of retry attempts (default: 3)
 */
const sendEmailWithRetry = async ({ to, subject, html }, maxRetries = 3) => {
  let attempts = 0;
  let lastError = null;

  while (attempts < maxRetries) {
    try {
      await transporter.sendMail({
        from: `LHB App <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

      await EmailLog.create({
        to,
        subject,
        success: true,
        attempts: attempts + 1,
      });

      console.log(`✅ Email sent to ${to}`);
      return;
    } catch (err) {
      attempts++;
      lastError = err.message;
      console.error(`❌ Attempt ${attempts} failed for ${to}: ${err.message}`);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempts - 1))
      );
    }
  }

  await EmailLog.create({
    to,
    subject,
    success: false,
    attempts,
    error: lastError,
  });
};

/**
 * Sends a welcome email to new users
 */
const sendWelcomeEmail = async (to, name) => {
  const subject = `Welcome to LHB App, ${name}`;
  const html = welcomeEmailTemplate(name);

  await sendEmailWithRetry({ to, subject, html });
};

/**
 * Sends KPI assignment email
 */
const sendKPINotification = async (to, name, kpiTitle, deadline) => {
  const subject = `New KPI Assigned: ${kpiTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>You’ve been assigned a new KPI:</p>
      <p><strong>${kpiTitle}</strong></p>
      <p>Deadline: ${new Date(deadline).toLocaleString()}</p>
      <p>Please log in to your dashboard to respond.</p>
      <p>– LHB Command</p>
    </div>
  `;

  await sendEmailWithRetry({ to, subject, html });
};

module.exports = {
  sendWelcomeEmail,
  sendKPINotification,
};
