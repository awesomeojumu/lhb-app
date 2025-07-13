const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/email.service');

/**
 * Register a new user (public or admin-created).
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, battalion, phone, sex } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      battalion,
      phone,
      sex,
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

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      sex,
      role,
      battalion,
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

module.exports = {
  registerUser,
  deleteUser,
  createUserByCommander,
  getMe,
  updateMyProfile,
};
