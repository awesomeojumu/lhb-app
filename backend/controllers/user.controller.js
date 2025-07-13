const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/email.service');

/**
 * Controller to handle user registration.
 * This function performs the following steps:
 * 1. Extracts user details from the request body.
 * 2. Checks if a user with the provided email already exists in the database.
 * 3. Hashes the user's password for secure storage.
 * 4. Creates and saves a new user record in the database.
 * 5. Sends a welcome email to the new user.
 * 6. Generates a JWT token for authentication.
 * 7. Responds with the new user's info (excluding password) and the token.
 * If any error occurs, it logs the error and responds with a server error message.
 */
const registerUser = async (req, res) => {
  try {
    // 1. Extract user details from the request body
    const { firstName, lastName, email, password, role, battalion } = req.body;

    // 2. Check if a user with the provided email already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 3. Hash the password using bcrypt for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user instance with the provided and hashed details
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role, // e.g., 'commando', 'soldier', etc.
      battalion, // e.g., 'Alpha', 'Bravo', etc.
    });

    // Save the new user to the database
    await user.save();

    // 5. Send a welcome email to the new user's email address
    await sendWelcomeEmail(user.email, user.firstName);

    // 6. Generate a JWT token containing the user's id and role, valid for 1 day
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 7. Respond with the new user's info (excluding sensitive data) and the token
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
    // Log the error and respond with a generic server error message
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
};
