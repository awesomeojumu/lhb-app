const express = require('express');
const router = express.Router();

const {
  createUserByCommander,
  deleteUser,
  getMe,
  updateMyProfile,
} = require('../controllers/user.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// GET: Authenticated user profile
router.get('/me', authenticate, getMe);

// PUT: Update own profile
router.put('/profile', authenticate, updateMyProfile);

// POST: Commander or Commando can create users
router.post(
  '/create',
  authenticate,
  authorizeRoles('commander', 'commando'),
  createUserByCommander
);

// DELETE: Commander or Commando can delete users
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('commander', 'commando'),
  deleteUser
);

module.exports = router;
