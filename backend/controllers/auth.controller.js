const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Helper function to generate a JWT token for a user.
 * The token contains the user's id and role, and is signed with the secret from environment variables.
 * Token expires in 1 day.
 * @param {Object} user - The user object from the database
 * @returns {string} - Signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/**
 * Controller for registering a new user.
 * Steps:
 * 1. Check if a user with the provided email already exists.
 * 2. Hash the user's password for security.
 * 3. Create a new user record in the database.
 * 4. Generate a JWT token for the new user.
 * 5. Respond with the user info (excluding password) and the token.
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, sex, role, battalion } = req.body;

    // 1. Check if user already exists by email
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // 2. Hash the password using bcrypt for security
    const hashed = await bcrypt.hash(password, 10);

    // 3. Create the user in the database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      phone,
      sex,
      role,
      battalion,
    });

    // 4. Generate a JWT token for the new user
    const token = generateToken(user);

    // 5. Respond with user info (excluding sensitive data) and token
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
    // Log and respond with a server error if registration fails
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Controller for logging in a user.
 * Steps:
 * 1. Find the user by email.
 * 2. Compare the provided password with the hashed password in the database.
 * 3. If valid, generate a JWT token.
 * 4. Respond with the user info (excluding password) and the token.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Username or Passsword is incorrect' });

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Username or Passsword is incorrect' });

    // 3. Generate a JWT token for the user
    const token = generateToken(user);

    // 4. Respond with user info (excluding sensitive data) and token
    res.status(200).json({
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
    // Log and respond with a server error if login fails
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
