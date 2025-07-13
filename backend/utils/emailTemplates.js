// File: backend/utils/emailTemplates.js

/**
 * Generates the HTML content for the welcome email sent to new users.
 *
 * @param {string} name - The recipient's first name for personalization.
 * @returns {string} - HTML string for the welcome email body.
 *
 * The template includes:
 * - A personalized greeting using the user's first name.
 * - A welcome message introducing the user to LHB.
 * - Encouragement and a sign-off from the LHB Command.
 * - Basic inline styling for readability.
 */
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