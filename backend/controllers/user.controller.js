const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/email.service');
const { generateLhbCode } = require('../utils/lhbCodeGenerator');

/**
 * Register a new user (public or admin-created).
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, battalion, phone, sex } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate LHB code
    const lhbCode = await generateLhbCode();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      battalion,
      phone,
      sex,
      lhbCode,
    });

    await user.save();

    await sendWelcomeEmail(user.email, user.firstName);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        battalion: user.battalion,
        lhbCode: user.lhbCode,
      },
      token,
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Commander or Commando deletes a user.
 * Commander can delete anyone; Commando can't delete Commander.
 */
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const requestingUser = req.user;

    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (requestingUser.role === 'commando' && userToDelete.role === 'commander') {
      return res.status(403).json({ message: 'Access denied: Cannot delete Commander' });
    }

    await User.findByIdAndDelete(userIdToDelete);

    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: userToDelete._id,
        name: `${userToDelete.firstName} ${userToDelete.lastName}`,
        role: userToDelete.role,
      },
    });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Commander or Commando creates a user manually.
 */
const createUserByCommander = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, sex, role, battalion } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate LHB code
    const lhbCode = await generateLhbCode();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      sex,
      role,
      battalion,
      lhbCode,
    });

    await sendWelcomeEmail(user.email, user.firstName);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        battalion: user.battalion,
        email: user.email,
        lhbCode: user.lhbCode,
      },
    });
  } catch (err) {
    console.error('Create User Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get authenticated user profile (for frontend).
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
    });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get comprehensive dashboard data for the authenticated user
 * This includes all data needed for the dashboard pages to load instantly
 */
const getDashboardData = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userBattalion = user.battalion;

    // Import KPI models
    const KPI = require('../models/KPI');
    const KPIStatus = require('../models/KPIStatus');

    // Get battalion user IDs first (needed for the KPI status query)
    const battalionUserIds = userBattalion 
      ? await User.find({ battalion: userBattalion }).distinct('_id')
      : [];

    // Get all data in parallel for maximum speed
    const [
      // User's KPIs
      userKpiStatuses,
      // Battalion users
      battalionUsers,
      // All users (for management pages)
      allUsers,
      // Battalion KPI data
      battalionKpiStatuses
    ] = await Promise.all([
      // User's KPI statuses
      KPIStatus.find({ user: userId })
        .populate('kpi', 'title description deadline targets category priority')
        .sort({ createdAt: -1 }),
      
      // Battalion users
      User.find({ battalion: userBattalion })
        .select('_id firstName lastName email role battalion phone sex ageBracket')
        .sort({ role: 1, firstName: 1 }),
      
      // All users (for commanders/commandos)
      user.role === 'commander' || user.role === 'commando' 
        ? User.find({})
          .select('_id firstName lastName email role battalion phone sex ageBracket')
          .sort({ battalion: 1, role: 1, firstName: 1 })
        : [],
      
      // Battalion KPI statuses for aggregation
      userBattalion && battalionUserIds.length > 0
        ? KPIStatus.find({ 
            user: { $in: battalionUserIds }
          })
          .populate('kpi', 'title description deadline assignedTo')
          .populate('user', 'firstName lastName role')
        : []
    ]);

    // Process user's KPI data
    const myKpiStatus = {
      completed: userKpiStatuses.filter(s => s.status === 'done').length,
      inProgress: userKpiStatuses.filter(s => s.status === 'in_progress').length,
      notStarted: userKpiStatuses.filter(s => s.status === 'pending').length,
    };

    // Process battalion KPI data
    const uniqueKPIs = [...new Set(battalionKpiStatuses.map(s => s.kpi._id.toString()))];
    const battalionKpiStatus = {
      totalKPIs: battalionKpiStatuses.length,
      completed: battalionKpiStatuses.filter(s => s.status === 'done').length,
      inProgress: battalionKpiStatuses.filter(s => s.status === 'in_progress').length,
      notStarted: battalionKpiStatuses.filter(s => s.status === 'pending').length,
      uniqueKPIs: uniqueKPIs.length,
      battalionUsers: battalionUsers.length
    };

    // Process role counts for battalion
    const roleCounts = battalionUsers.reduce((acc, u) => {
      // Map backend role names to frontend expected names
      const roleMap = {
        'commander': 'commander',
        'commando': 'commando', 
        'special_force': 'specialForce',
        'soldier': 'globalSoldier'
      };
      const mappedRole = roleMap[u.role] || u.role;
      acc[mappedRole] = (acc[mappedRole] || 0) + 1;
      return acc;
    }, { commander: 0, commando: 0, specialForce: 0, globalSoldier: 0 });

    // Process user's KPIs for MyKPIs page
    const myKpis = userKpiStatuses.map(status => {
      const kpi = status.kpi;
      return {
        _id: status._id,
        status: status.status === 'done' ? 'Completed' : 
                status.status === 'in_progress' ? 'In Progress' : 'Pending',
        progress: status.progress || 0,
        markedAt: status.markedAt,
        createdAt: status.createdAt,
        updatedAt: status.updatedAt,
        kpi: {
          _id: kpi._id,
          title: kpi.title,
          description: kpi.description,
          deadline: kpi.deadline,
          category: kpi.category,
          priority: kpi.priority,
          // Legacy assignment fields for backward compatibility
          assignmentType: kpi.targets?.allUsers ? 'all' : 
                         kpi.targets?.roles?.length > 0 ? 'role' :
                         kpi.targets?.battalions?.length > 0 ? 'battalion' : 'specific',
          target: kpi.targets?.allUsers ? 'All Users' : 
                  kpi.targets?.roles?.length > 0 ? kpi.targets.roles.join(', ') :
                  kpi.targets?.battalions?.length > 0 ? kpi.targets.battalions.join(', ') : 'Specific Users',
          // Include role and battalion for assignment rendering
          role: kpi.targets?.roles?.[0],
          battalion: kpi.targets?.battalions?.[0]
        }
      };
    });

    res.json({
      // User profile
      user: {
        ...user.toObject(),
        name: `${user.firstName} ${user.lastName}`,
      },
      
      // Dashboard home data
      dashboard: {
        myKpiStatus,
        battalionCount: battalionUsers.length,
      },
      
      // Battalion page data
      battalion: {
        users: battalionUsers,
        kpiData: battalionKpiStatus,
        roleCounts,
      },
      
      // MyKPIs page data
      myKpis,
      
      // Management data (for commanders/commandos)
      management: {
        allUsers: user.role === 'commander' || user.role === 'commando' ? allUsers : [],
      },
      
      // Metadata
      meta: {
        lastUpdated: new Date(),
        userRole: user.role,
        userBattalion: userBattalion,
      }
    });

  } catch (err) {
    console.error('GetDashboardData error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * List all users (Commander/Commando only).
 */
const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.error('List Users Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get users from the same battalion (All authenticated users).
 */
const getBattalionUsers = async (req, res) => {
  try {
    const userBattalion = req.user.battalion;
    
    if (!userBattalion) {
      return res.status(400).json({ message: 'User does not belong to any battalion' });
    }

    const users = await User.find(
      { battalion: userBattalion }, 
      { password: 0 }
    ).sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.error('Get Battalion Users Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Authenticated user updates their profile.
 */
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };

    // ❗️OPTIONAL: Prevent update of protected fields
    delete updates.role;
    delete updates.password;
    delete updates.email; // if you don't want users changing their email

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
    });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user role (Commander/Commando only).
 * Role hierarchy: Commander > Commando > Special Force > Global Soldier > Email Community
 */
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const requestingUser = req.user;

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Define role hierarchy (matching User model enum values)
    const roleHierarchy = ['globalSoldier', 'specialForce', 'commando', 'commander'];
    
    // Validate role
    if (!roleHierarchy.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check permissions
    const requestingUserIndex = roleHierarchy.indexOf(requestingUser.role);
    const targetUserIndex = roleHierarchy.indexOf(userToUpdate.role);
    const newRoleIndex = roleHierarchy.indexOf(role);

    // Commander can update anyone, Commando can't update Commander
    if (requestingUser.role === 'commando' && userToUpdate.role === 'commander') {
      return res.status(403).json({ message: 'Access denied: Cannot modify Commander role' });
    }

    // Prevent demoting someone to a higher role than yourself
    if (newRoleIndex > requestingUserIndex) {
      return res.status(403).json({ message: 'Access denied: Cannot promote to higher role than your own' });
    }

    // Prevent promoting someone to a higher role than yourself
    if (newRoleIndex > requestingUserIndex) {
      return res.status(403).json({ message: 'Access denied: Cannot assign role higher than your own' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'User role updated successfully',
      user: {
        id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        role: updatedUser.role,
        battalion: updatedUser.battalion,
      },
    });
  } catch (err) {
    console.error('Update User Role Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user status (active/inactive) (Commander/Commando only).
 */
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    const requestingUser = req.user;

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "active" or "inactive"' });
    }

    // Check permissions - Commander can update anyone, Commando can't update Commander
    if (requestingUser.role === 'commando' && userToUpdate.role === 'commander') {
      return res.status(403).json({ message: 'Access denied: Cannot modify Commander status' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    );

    res.json({
      message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        role: updatedUser.role,
        status: updatedUser.status,
        battalion: updatedUser.battalion,
      },
    });
  } catch (err) {
    console.error('Update User Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  deleteUser,
  createUserByCommander,
  getMe,
  getDashboardData,
  updateMyProfile,
  listUsers,
  getBattalionUsers,
  updateUserRole,
  updateUserStatus,
};
