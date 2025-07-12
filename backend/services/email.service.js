const transporter = require('../config/email'); // Email configuration
const { welcomeEmailTemplate } = require('../utils/emailTemplates'); // Import email template

const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"Lighthouse Barracks" <${process.env.EMAIL_USER}>`, // Sender address
    to,
    subject: `Welcome to LHB App, ${name}`, // Subject line
    html: welcomeEmailTemplate(name), // HTML body content
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email
    console.log(`Email sent to ${to}`); // Log success message
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err); // Log error if sending fails
  }
};

const sendKPINotification = async (to, name, kpiTitle, deadline) => {
    const mailOptions = {
      from: `"LHB App" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New KPI Assigned: ${kpiTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${name},</h2>
          <p>You’ve been assigned a new KPI:</p>
          <p><strong>${kpiTitle}</strong></p>
          <p>Deadline: ${new Date(deadline).toLocaleString()}</p>
          <p>Please log in to your dashboard to respond.</p>
          <p>– LHB Command</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ KPI email sent to ${to}`);
    } catch (err) {
      console.error(`❌ Failed to send KPI email to ${to}:`, err.message);
    }
  };

  module.exports = {
    sendWelcomeEmail,
    sendKPINotification,
  };