const express = require('express');
const router = express.Router();

const {
  createUserByCommander,
  deleteUser,
  getMe
} = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Authenticated user profile (needed by frontend)
router.get('/me', authenticate, getMe);

// Commander or Commando can create users
router.post(
  '/create',
  authenticate,
  authorizeRoles('commander', 'commando'),
  createUserByCommander
);

// Commander or Commando can delete users
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('commander', 'commando'),
  deleteUser
);

module.exports = router;
