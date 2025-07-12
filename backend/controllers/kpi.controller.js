const KPI = require('../models/KPI');
const User = require('../models/User');
const KPIStatus = require('../models/KPIStatus');
const { sendKPINotification } = require('../services/email.service'); // ✅ Email notify

const assignKPI = async (req, res) => {
  try {
    const { title, description, assignedTo, specificUsers, deadline } = req.body;
    const createdBy = req.user.id;

    // 1. Create the KPI document
    const kpi = new KPI({
      title,
      description,
      assignedTo,
      specificUsers,
      deadline,
      createdBy,
    });

    await kpi.save();

    // 2. Resolve the list of users who should receive this KPI
    let targetUsers = [];

    if (assignedTo === 'all') {
      targetUsers = await User.find({ role: { $ne: 'commander' } });
    } else if (['commando', 'special_force', 'soldier'].includes(assignedTo)) {
      targetUsers = await User.find({ role: assignedTo });
    } else if (assignedTo === 'specific' && specificUsers?.length > 0) {
      targetUsers = await User.find({ _id: { $in: specificUsers } });
    }

    // 3. Generate KPIStatus entries for each user
    const statusEntries = targetUsers.map((user) => ({
      user: user._id,
      kpi: kpi._id,
    }));

    await KPIStatus.insertMany(statusEntries);

    // 4. Send notification email to each user
    for (const user of targetUsers) {
      await sendKPINotification(user.email, user.firstName, kpi.title, kpi.deadline);
    }

    res.status(201).json({
      message: 'KPI assigned successfully',
      kpi,
      recipients: targetUsers.length,
    });
  } catch (err) {
    console.error('KPI Assignment Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  assignKPI,
};
