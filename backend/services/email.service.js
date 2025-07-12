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

module.exports = {
  sendWelcomeEmail,
};
