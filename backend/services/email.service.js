const transporter = require('../config/email'); // Email configuration (nodemailer transporter)
const { welcomeEmailTemplate } = require('../utils/emailTemplates'); // Import reusable welcome email template

/**
 * Send a welcome email to a new user.
 * 
 * @param {string} to   - Recipient's email address
 * @param {string} name - Recipient's first name (for personalization)
 * 
 * Steps:
 * 1. Construct the email options, including sender, recipient, subject, and HTML body.
 * 2. Use the transporter to send the email.
 * 3. Log success or error for monitoring.
 */
const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"Lighthouse Barracks" <${process.env.EMAIL_USER}>`, // Sender address (from .env)
    to,                                                        // Recipient's email address
    subject: `Welcome to LHB App, ${name}`,                    // Personalized subject line
    html: welcomeEmailTemplate(name),                          // HTML body using template
  };

  try {
    await transporter.sendMail(mailOptions);                   // Attempt to send the email
    console.log(`Email sent to ${to}`);                        // Log success
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);    // Log error if sending fails
  }
};

/**
 * Send a KPI assignment notification email to a user.
 * 
 * @param {string} to        - Recipient's email address
 * @param {string} name      - Recipient's first name (for personalization)
 * @param {string} kpiTitle  - Title of the assigned KPI
 * @param {Date}   deadline  - Deadline for the KPI
 * 
 * Steps:
 * 1. Construct the email options, including sender, recipient, subject, and HTML body.
 *    The body includes KPI details and deadline.
 * 2. Use the transporter to send the email.
 * 3. Log success or error for monitoring.
 */
const sendKPINotification = async (to, name, kpiTitle, deadline) => {
  const mailOptions = {
    from: `"LHB App" <${process.env.EMAIL_USER}>`,             // Sender address (from .env)
    to,                                                        // Recipient's email address
    subject: `New KPI Assigned: ${kpiTitle}`,                  // Subject line with KPI title
    html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${name},</h2>
          <p>You’ve been assigned a new KPI:</p>
          <p><strong>${kpiTitle}</strong></p>
          <p>Deadline: ${new Date(deadline).toLocaleString()}</p>
          <p>Please log in to your dashboard to respond.</p>
          <p>– LHB Command</p>
        </div>
      `,                                                      // HTML body with KPI details
  };

  try {
    await transporter.sendMail(mailOptions);                   // Attempt to send the email
    console.log(`✅ KPI email sent to ${to}`);                 // Log success
  } catch (err) {
    console.error(`❌ Failed to send KPI email to ${to}:`, err.message); // Log error if sending fails
  }
};

module.exports = {
  sendWelcomeEmail,        // Export the function to send welcome emails
  sendKPINotification,     // Export the function to send KPI notification emails
};  