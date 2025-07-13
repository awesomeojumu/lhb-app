const KPI = require('../models/KPI');
const User = require('../models/User');
const KPIStatus = require('../models/KPIStatus');
const { sendKPINotification } = require('../services/email.service');

/**
 * Controller to assign a KPI to users and notify them via email.
 * Steps:
 * 1. Create a new KPI record in the database.
 * 2. Determine the target users based on assignment type (all, by role, or specific users).
 * 3. Create a KPIStatus entry for each user to track their progress.
 * 4. Send notification emails to all assigned users (does not block on failures).
 * 5. Respond with success or error.
 */
const assignKPI = async (req, res) => {
  try {
    // Extract KPI details and creator from request
    const { title, description, assignedTo, specificUsers, deadline } = req.body;
    const createdBy = req.user.id;

    // 1. Create the KPI record in the database
    const kpi = await KPI.create({
      title,
      description,
      assignedTo,
      specificUsers,
      deadline,
      createdBy,
    });

    // 2. Determine which users should receive this KPI
    let targetUsers = [];

    if (assignedTo === 'all') {
      // Assign to all users except commanders
      targetUsers = await User.find({ role: { $ne: 'commander' } });
    } else if (['commando', 'special_force', 'soldier'].includes(assignedTo)) {
      // Assign to users with a specific role
      targetUsers = await User.find({ role: assignedTo });
    } else if (
      assignedTo === 'specific' &&
      Array.isArray(specificUsers) &&
      specificUsers.length > 0
    ) {
      // Assign to a specific list of user IDs
      targetUsers = await User.find({ _id: { $in: specificUsers } });
    }

    // If no users are found, return an error response
    if (!targetUsers.length) {
      return res.status(400).json({ message: 'No eligible users found for this KPI assignment.' });
    }

    // 3. For each user, create a KPIStatus entry to track their progress on this KPI
    const statusEntries = targetUsers.map((user) => ({
      user: user._id,
      kpi: kpi._id,
    }));

    await KPIStatus.insertMany(statusEntries);

    // 4. Send notification emails to all assigned users
    // Use Promise.allSettled to ensure all emails are attempted, but don't block on failures
    const sendAllEmails = targetUsers.map((user) =>
      sendKPINotification(user.email, user.firstName, kpi.title, kpi.deadline),
    );

    await Promise.allSettled(sendAllEmails);

    // 5. Respond with success, including number of recipients and KPI details
    res.status(201).json({
      message: 'KPI assigned successfully',
      recipients: targetUsers.length,
      kpi,
    });
  } catch (err) {
    // Log and respond with a server error if anything goes wrong
    console.error('KPI Assignment Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the controller function
module.exports = {
  assignKPI,
};
