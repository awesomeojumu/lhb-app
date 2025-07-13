const nodemailer = require('nodemailer');

/**
 * Configure and create a reusable transporter object using SMTP transport.
 * This transporter will be used throughout the app to send emails.
 *
 * The configuration uses environment variables for flexibility and security:
 * - EMAIL_HOST: The SMTP server host (e.g., smtp.gmail.com for Gmail)
 * - EMAIL_PORT: The SMTP server port (587 is common for TLS)
 * - EMAIL_USER: The email address or username used for authentication
 * - EMAIL_PASS: The password or app-specific password for the email account
 *
 * Note:
 * - 'secure: false' means the connection will use STARTTLS (recommended for port 587).
 * - For Gmail, you must use an App Password if 2FA is enabled.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // SMTP server host (e.g., smtp.gmail.com)
  port: process.env.EMAIL_PORT, // SMTP server port (587 for TLS)
  secure: false, // Use TLS (STARTTLS), not SSL directly
  auth: {
    user: process.env.EMAIL_USER, // Email address or username for SMTP authentication
    pass: process.env.EMAIL_PASS, // Password or app password for SMTP authentication
  },
});

module.exports = transporter; // Export the transporter for use in
