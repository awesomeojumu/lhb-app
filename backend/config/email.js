const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,     // e.g. smtp.sendgrid.net or smtp.gmail.com
  port: process.env.EMAIL_PORT,     // usually 587
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your email username
    pass: process.env.EMAIL_PASS, // Your email password or API key
  },
});

module.exports = transporter;
