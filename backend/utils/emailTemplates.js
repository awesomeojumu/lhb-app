// File: backend/utils/emailTemplates.js
const welcomeEmailTemplate = (name) => `
  <div style="font-family: Arial; color: #333;">
    <h2>Welcome to LHB, ${name}!</h2>
    <p>We’re excited to have you in the mission. You’ve been added to the system and can now begin engaging with your dashboard and assignments.</p>
    <p>Stay faithful. Stay ready.</p>
    <p>— The LHB Command</p>
  </div>
`; // Email template for welcome email

module.exports = {
  welcomeEmailTemplate, // Export the welcome email template
};
