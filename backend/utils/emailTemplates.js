// File: backend/utils/emailTemplates.js

/**
 * Generates the HTML content for the welcome email sent to new users.
 *
 * @param {string} name - The recipient's first name for personalization.
 * @returns {string} - HTML string for the welcome email body.
 *
 * The enhanced template includes:
 * - Professional responsive design with Lighthouse Barracks branding
 * - Personalized greeting using the user's first name
 * - Mission and vision statements from the organization
 * - Core values displayed as colorful badges
 * - Clear next steps for new users
 * - Call-to-action button to access dashboard
 * - The 4 Kingdom Mandate visual representation
 * - Inspirational testimonial from community member
 * - Professional footer with organization tagline
 * - Mobile-responsive design with inline CSS
 */
const welcomeEmailTemplate = (name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Lighthouse Barracks</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          Welcome to Lighthouse Barracks, ${name}!
        </h1>
        <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
          Empowering Future Leaders • Raising the Total Kingdom Soldier & Leader
        </p>
        <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px; font-style: italic;">
          ~Be Light Be Salt
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px;">
        
        <!-- Welcome Message -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
            You're Now Part of the Mission!
          </h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
            We're thrilled to have you join our community of purpose-driven leaders and soldiers for Christ. 
            You've been successfully added to the LHB system and can now access your dashboard to begin your journey.
          </p>
        </div>

        <!-- Mission & Vision -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2a5298;">
          <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            Our Mission
          </h3>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
            Equip young leaders globally with all they need physically and spiritually to be 10 times better for God's Glory and Kingdom.
          </p>
          <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            Our Vision
          </h3>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">
            To raise an army of 300 purpose-driven leaders and soldiers for Christ in each of the 195 countries of the world bringing God's will to pass as Salts and Light.
          </p>
        </div>

        <!-- Core Values -->
        <div style="margin: 25px 0;">
          <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center;">
            Our Core Values
          </h3>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            <span style="background-color: #e3f2fd; color: #1e3c72; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Excellence</span>
            <span style="background-color: #e8f5e8; color: #2e7d32; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Discipline</span>
            <span style="background-color: #fff3e0; color: #f57c00; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">For the Kingdom</span>
            <span style="background-color: #f3e5f5; color: #7b1fa2; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Ubuntu</span>
            <span style="background-color: #e0f2f1; color: #00695c; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Purpose Driven</span>
            <span style="background-color: #fce4ec; color: #c2185b; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total Reliance</span>
            <span style="background-color: #e1f5fe; color: #0277bd; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Courage</span>
          </div>
        </div>

        <!-- Next Steps -->
        <div style="background-color: #fff8e1; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
          <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            🚀 Your Next Steps
          </h3>
          <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Access your personalized dashboard to view assignments and KPIs</li>
            <li style="margin-bottom: 8px;">Complete your profile setup to connect with your battalion</li>
            <li style="margin-bottom: 8px;">Explore the Purpose Bootcamp resources and community</li>
            <li style="margin-bottom: 8px;">Engage with fellow soldiers in your global network</li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="display: inline-block; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);">
            Access Your Dashboard
          </a>
        </div>

        <!-- Kingdom Mandate -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
          <h3 style="color: #1e3c72; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
            The 4 Kingdom Mandate
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
            <div style="text-align: center;">
              <div style="background-color: #e3f2fd; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🙏</div>
              <p style="color: #555; font-size: 12px; font-weight: 600; margin: 0; text-transform: uppercase;">Intimacy</p>
              <p style="color: #777; font-size: 10px; margin: 5px 0 0 0;">(With God)</p>
            </div>
            <div style="text-align: center;">
              <div style="background-color: #e8f5e8; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">👨‍👩‍👧‍👦</div>
              <p style="color: #555; font-size: 12px; font-weight: 600; margin: 0; text-transform: uppercase;">Family</p>
              <p style="color: #777; font-size: 10px; margin: 5px 0 0 0;">(Biological & Spiritual)</p>
            </div>
            <div style="text-align: center;">
              <div style="background-color: #fff3e0; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">💡</div>
              <p style="color: #555; font-size: 12px; font-weight: 600; margin: 0; text-transform: uppercase;">Ministry</p>
              <p style="color: #777; font-size: 10px; margin: 5px 0 0 0;">(Be Light)</p>
            </div>
            <div style="text-align: center;">
              <div style="background-color: #f3e5f5; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🌍</div>
              <p style="color: #555; font-size: 12px; font-weight: 600; margin: 0; text-transform: uppercase;">Mission</p>
              <p style="color: #777; font-size: 10px; margin: 5px 0 0 0;">(Be Salt)</p>
            </div>
          </div>
        </div>

        <!-- Closing Message -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; font-style: italic;">
            "Transformative! I could write an epistle but I find that it is the truly dauntingly great experiences that leave you speechless. So I will say I have been transformed."
          </p>
          <p style="color: #1e3c72; font-size: 14px; font-weight: 600; margin: 0;">
            — Joan Bello, Dubai
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e9ecef;">
          <p style="color: #1e3c72; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
            Stay Faithful. Stay Ready.
          </p>
          <p style="color: #555; font-size: 14px; margin: 0;">
            — The LHB Command
          </p>
          <div style="margin-top: 20px;">
            <p style="color: #777; font-size: 12px; margin: 0;">
              Lighthouse Barracks • Empowering Future Leaders
            </p>
            <p style="color: #777; font-size: 12px; margin: 5px 0 0 0;">
              Raising the Total Kingdom Soldier & Leader • Be Light Be Salt
            </p>
          </div>
        </div>

      </div>
  </div>
  </body>
  </html>
` // Enhanced email template for welcome email

/**
 * Enhanced KPI Assignment Email Template
 * @param {string} name - Recipient's first name
 * @param {string} kpiTitle - Title of the assigned KPI
 * @param {string} kpiDescription - Description of the KPI
 * @param {Date} deadline - KPI deadline
 * @param {string} priority - KPI priority level
 * @param {string} category - KPI category
 * @returns {string} - HTML email template
 */
const kpiAssignmentTemplate = (name, kpiTitle, kpiDescription, deadline, priority, category) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New KPI Assignment - Lighthouse Barracks</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
          📋 New KPI Assignment
        </h1>
        <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px;">
          Lighthouse Barracks • Mission Briefing
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 20px;">
            Hello ${name},
          </h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
            You have been assigned a new Key Performance Indicator (KPI) that aligns with our mission and your growth as a Kingdom soldier.
          </p>
        </div>

        <!-- KPI Details Card -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2a5298;">
          <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            📋 KPI Details
          </h3>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333; font-size: 16px;">${kpiTitle}</strong>
          </div>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
            ${kpiDescription}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
            <div style="background-color: #e3f2fd; padding: 8px 12px; border-radius: 20px;">
              <span style="color: #1e3c72; font-size: 12px; font-weight: 600;">📅 Deadline: ${new Date(deadline).toLocaleDateString()}</span>
            </div>
            <div style="background-color: #fff3e0; padding: 8px 12px; border-radius: 20px;">
              <span style="color: #f57c00; font-size: 12px; font-weight: 600;">⚡ Priority: ${priority.toUpperCase()}</span>
            </div>
            <div style="background-color: #e8f5e8; padding: 8px 12px; border-radius: 20px;">
              <span style="color: #2e7d32; font-size: 12px; font-weight: 600;">🏷️ Category: ${category.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <!-- Action Required -->
        <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
          <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            ⚡ Action Required
          </h3>
          <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Log in to your dashboard to view full KPI details</li>
            <li style="margin-bottom: 8px;">Review the requirements and success criteria</li>
            <li style="margin-bottom: 8px;">Update your progress regularly as you work on this KPI</li>
            <li style="margin-bottom: 8px;">Mark as complete when finished or update status as needed</li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="display: inline-block; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);">
            View KPI in Dashboard
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
          <p style="color: #1e3c72; font-size: 16px; font-weight: 700; margin: 0 0 10px 0;">
            Stay Faithful. Stay Ready.
          </p>
          <p style="color: #555; font-size: 14px; margin: 0;">
            — The LHB Command
          </p>
        </div>

      </div>
    </div>
  </body>
  </html>
`

/**
 * KPI Deadline Reminder Email Template
 * @param {string} name - Recipient's first name
 * @param {string} kpiTitle - Title of the KPI
 * @param {Date} deadline - KPI deadline
 * @param {number} daysLeft - Days remaining until deadline
 * @returns {string} - HTML email template
 */
const kpiDeadlineReminderTemplate = (name, kpiTitle, deadline, daysLeft) => {
  const urgencyColor = daysLeft <= 1 ? '#d32f2f' : daysLeft <= 3 ? '#f57c00' : '#2e7d32'
  const urgencyIcon = daysLeft <= 1 ? '🚨' : daysLeft <= 3 ? '⚠️' : '⏰'
  const urgencyText = daysLeft <= 1 ? 'URGENT' : daysLeft <= 3 ? 'DUE SOON' : 'REMINDER'

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KPI Deadline Reminder - Lighthouse Barracks</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${urgencyColor} 0%, ${urgencyColor}dd 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
            ${urgencyIcon} KPI Deadline ${urgencyText}
          </h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Lighthouse Barracks • Mission Update
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px;">
          
          <!-- Greeting -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 20px;">
              Hello ${name},
            </h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
              This is a friendly reminder about your assigned KPI that is approaching its deadline.
            </p>
          </div>

          <!-- KPI Details Card -->
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${urgencyColor};">
            <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
              📋 KPI Details
            </h3>
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; font-size: 16px;">${kpiTitle}</strong>
            </div>
            <div style="background-color: ${urgencyColor}20; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${urgencyIcon}</span>
                <div>
                  <p style="color: ${urgencyColor}; font-size: 18px; font-weight: 700; margin: 0;">
                    ${daysLeft === 0 ? 'Due Today!' : daysLeft === 1 ? 'Due Tomorrow!' : `${daysLeft} Days Remaining`}
                  </p>
                  <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">
                    Deadline: ${new Date(deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Required -->
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
            <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
              ⚡ Action Required
            </h3>
            <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Review your progress on this KPI</li>
              <li style="margin-bottom: 8px;">Complete any remaining tasks</li>
              <li style="margin-bottom: 8px;">Update your status in the dashboard</li>
              <li style="margin-bottom: 8px;">Contact your commander if you need assistance</li>
            </ul>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, ${urgencyColor} 0%, ${urgencyColor}dd 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
              Update KPI Status
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <p style="color: #1e3c72; font-size: 16px; font-weight: 700; margin: 0 0 10px 0;">
              Stay Faithful. Stay Ready.
            </p>
            <p style="color: #555; font-size: 14px; margin: 0;">
              — The LHB Command
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Role Change Notification Email Template
 * @param {string} name - Recipient's first name
 * @param {string} oldRole - Previous role
 * @param {string} newRole - New role
 * @param {string} changedBy - Name of person who made the change
 * @returns {string} - HTML email template
 */
const roleChangeTemplate = (name, oldRole, newRole, changedBy) => {
  const roleLabels = {
    globalSoldier: 'Global Soldier',
    specialForce: 'Special Force',
    commando: 'Commando',
    commander: 'Commander'
  }

  const isPromotion = ['globalSoldier', 'specialForce', 'commando', 'commander'].indexOf(newRole) >
                     ['globalSoldier', 'specialForce', 'commando', 'commander'].indexOf(oldRole)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Role Change Notification - Lighthouse Barracks</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
            ${isPromotion ? '🎖️ Role Promotion' : '🔄 Role Update'}
          </h1>
          <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px;">
            Lighthouse Barracks • Command Update
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px;">
          
          <!-- Greeting -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 20px;">
              Hello ${name},
            </h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
              Your role within the Lighthouse Barracks organization has been updated. ${isPromotion ? 'Congratulations on your promotion!' : 'Please review the changes below.'}
            </p>
          </div>

          <!-- Role Change Details -->
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2a5298;">
            <h3 style="color: #1e3c72; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
              🎖️ Role Change Details
            </h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <div style="text-align: center; flex: 1;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Previous Role</p>
                <div style="background-color: #e9ecef; padding: 10px; border-radius: 8px;">
                  <span style="color: #555; font-size: 16px; font-weight: 600;">${roleLabels[oldRole]}</span>
                </div>
              </div>
              <div style="text-align: center; margin: 0 20px;">
                <span style="font-size: 24px;">→</span>
              </div>
              <div style="text-align: center; flex: 1;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">New Role</p>
                <div style="background-color: ${isPromotion ? '#e8f5e8' : '#fff3e0'}; padding: 10px; border-radius: 8px; border: 2px solid ${isPromotion ? '#2e7d32' : '#f57c00'};">
                  <span style="color: ${isPromotion ? '#2e7d32' : '#f57c00'}; font-size: 16px; font-weight: 600;">${roleLabels[newRole]}</span>
                </div>
              </div>
            </div>
            <p style="color: #666; font-size: 14px; margin: 0; text-align: center;">
              Changed by: <strong>${changedBy}</strong>
            </p>
          </div>

          <!-- New Responsibilities -->
          <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
            <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
              ${isPromotion ? '🎯 New Responsibilities' : '📋 Updated Responsibilities'}
            </h3>
            <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Access your updated dashboard permissions</li>
              <li style="margin-bottom: 8px;">Review your new role-specific KPIs and assignments</li>
              <li style="margin-bottom: 8px;">${isPromotion ? 'Take on additional leadership responsibilities' : 'Continue fulfilling your duties with updated scope'}</li>
              <li style="margin-bottom: 8px;">Contact your commander if you have any questions</li>
            </ul>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);">
              Access Your Dashboard
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <p style="color: #1e3c72; font-size: 16px; font-weight: 700; margin: 0 0 10px 0;">
              Stay Faithful. Stay Ready.
            </p>
            <p style="color: #555; font-size: 14px; margin: 0;">
              — The LHB Command
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Password Reset Email Template
 * @param {string} name - Recipient's first name
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 * @returns {string} - HTML email template
 */
const passwordResetTemplate = (name, resetToken, resetUrl) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Lighthouse Barracks</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
          🔐 Password Reset Request
        </h1>
        <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px;">
          Lighthouse Barracks • Security Update
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 20px;">
            Hello ${name},
          </h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
            We received a request to reset your password for your Lighthouse Barracks account. If you made this request, please use the button below to reset your password.
          </p>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
          <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            ⚠️ Security Notice
          </h3>
          <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">This link will expire in 1 hour for security reasons</li>
            <li style="margin-bottom: 8px;">If you didn't request this reset, please ignore this email</li>
            <li style="margin-bottom: 8px;">Never share your password with anyone</li>
            <li style="margin-bottom: 8px;">Contact support if you have any concerns</li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);">
            Reset My Password
          </a>
        </div>

        <!-- Alternative Method -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            🔗 Alternative Method
          </h3>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #1e3c72; font-size: 12px; word-break: break-all; margin: 0; background-color: #e3f2fd; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
          <p style="color: #1e3c72; font-size: 16px; font-weight: 700; margin: 0 0 10px 0;">
            Stay Faithful. Stay Ready.
          </p>
          <p style="color: #555; font-size: 14px; margin: 0;">
            — The LHB Command
          </p>
        </div>

      </div>
    </div>
  </body>
  </html>
`

/**
 * KPI Completion Notification Template (for commanders)
 * @param {string} commanderName - Commander's first name
 * @param {string} soldierName - Soldier's name who completed the KPI
 * @param {string} kpiTitle - Title of the completed KPI
 * @param {Date} completedAt - When the KPI was completed
 * @returns {string} - HTML email template
 */
const kpiCompletionTemplate = (commanderName, soldierName, kpiTitle, completedAt) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KPI Completion Notification - Lighthouse Barracks</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
          ✅ KPI Completed
        </h1>
        <p style="color: #e8f5e8; margin: 10px 0 0 0; font-size: 16px;">
          Lighthouse Barracks • Mission Update
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 20px;">
            Hello ${commanderName},
          </h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
            Great news! One of your soldiers has successfully completed their assigned KPI.
          </p>
        </div>

        <!-- Completion Details -->
        <div style="background-color: #e8f5e8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2e7d32;">
          <h3 style="color: #1e3c72; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
            🎯 Completion Details
          </h3>
          <div style="margin-bottom: 15px;">
            <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Soldier</p>
            <p style="color: #2e7d32; font-size: 18px; font-weight: 600; margin: 0;">${soldierName}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">KPI Title</p>
            <p style="color: #333; font-size: 16px; font-weight: 600; margin: 0;">${kpiTitle}</p>
          </div>
          <div style="margin-bottom: 0;">
            <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Completed On</p>
            <p style="color: #2e7d32; font-size: 16px; font-weight: 600; margin: 0;">${new Date(completedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Next Steps -->
        <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
          <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            📋 Next Steps
          </h3>
          <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Review the completed KPI in your dashboard</li>
            <li style="margin-bottom: 8px;">Consider providing feedback to the soldier</li>
            <li style="margin-bottom: 8px;">Assign new KPIs if appropriate</li>
            <li style="margin-bottom: 8px;">Update your team's progress tracking</li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="display: inline-block; background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(46, 125, 50, 0.3);">
            View Dashboard
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
          <p style="color: #1e3c72; font-size: 16px; font-weight: 700; margin: 0 0 10px 0;">
            Stay Faithful. Stay Ready.
          </p>
          <p style="color: #555; font-size: 14px; margin: 0;">
            — The LHB Command
          </p>
        </div>

      </div>
    </div>
  </body>
  </html>
`

/**
 * Account Status Change Template
 * @param {string} name - Recipient's first name
 * @param {string} status - New account status (active/inactive)
 * @param {string} reason - Reason for status change
 * @returns {string} - HTML email template
 */
const accountStatusChangeTemplate = (name, status, reason) => {
  const isActivation = status === 'active'
  const statusColor = isActivation ? '#2e7d32' : '#d32f2f'
  const statusIcon = isActivation ? '✅' : '⚠️'
  const statusText = isActivation ? 'ACTIVATED' : 'DEACTIVATED'

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Status Change - Lighthouse Barracks</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
            ${statusIcon} Account ${statusText}
          </h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Lighthouse Barracks • Account Update
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px;">
          
          <!-- Greeting -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 20px;">
              Hello ${name},
            </h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
              Your Lighthouse Barracks account status has been updated. ${isActivation ? 'Welcome back! Your account is now active and you can access all features.' : 'Your account has been deactivated. Please contact support if you believe this is an error.'}
            </p>
          </div>

          <!-- Status Details -->
          <div style="background-color: ${isActivation ? '#e8f5e8' : '#ffebee'}; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${statusColor};">
            <h3 style="color: #1e3c72; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
              ${statusIcon} Account Status
            </h3>
            <div style="margin-bottom: 15px;">
              <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Status</p>
              <p style="color: ${statusColor}; font-size: 18px; font-weight: 600; margin: 0; text-transform: uppercase;">${status}</p>
            </div>
            <div style="margin-bottom: 0;">
              <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Reason</p>
              <p style="color: #333; font-size: 16px; margin: 0;">${reason}</p>
            </div>
          </div>

          ${isActivation
? `
          <!-- Next Steps for Activation -->
          <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffc107;">
            <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
              🚀 Next Steps
            </h3>
            <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Log in to your dashboard to access all features</li>
              <li style="margin-bottom: 8px;">Review any new KPIs or assignments</li>
              <li style="margin-bottom: 8px;">Update your profile if needed</li>
              <li style="margin-bottom: 8px;">Contact your commander if you have questions</li>
            </ul>
          </div>
          `
: `
          <!-- Deactivation Notice -->
          <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f44336;">
            <h3 style="color: #d32f2f; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
              ⚠️ Important Notice
            </h3>
            <ul style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">You will not be able to access your dashboard</li>
              <li style="margin-bottom: 8px;">All KPI assignments are paused</li>
              <li style="margin-bottom: 8px;">Contact support to reactivate your account</li>
              <li style="margin-bottom: 8px;">Your data remains secure and will be restored upon reactivation</li>
            </ul>
          </div>
          `}

          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
              ${isActivation ? 'Access Dashboard' : 'Contact Support'}
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <p style="color: #1e3c72; font-size: 16px; font-weight: 700; margin: 0 0 10px 0;">
              Stay Faithful. Stay Ready.
            </p>
            <p style="color: #555; font-size: 14px; margin: 0;">
              — The LHB Command
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `
}

module.exports = {
  welcomeEmailTemplate,
  kpiAssignmentTemplate,
  kpiDeadlineReminderTemplate,
  roleChangeTemplate,
  passwordResetTemplate,
  kpiCompletionTemplate,
  accountStatusChangeTemplate
}
