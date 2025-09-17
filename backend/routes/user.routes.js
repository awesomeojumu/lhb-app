const express = require('express');
const router = express.Router();

const {
  createUserByCommander,
  deleteUser,
  getMe,
  getDashboardData,
  updateMyProfile,
  listUsers,
  getBattalionUsers,
  updateUserRole,
  updateUserStatus,
} = require('../controllers/user.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// GET: List all users (Commander/Commando only)
router.get('/', authenticate, authorizeRoles('commander', 'commando'), listUsers);

// GET: Battalion users (All authenticated users can see their battalion)
router.get('/battalion', authenticate, getBattalionUsers);

// GET: Authenticated user profile
router.get('/me', authenticate, getMe);

// GET: Comprehensive dashboard data
router.get('/dashboard', authenticate, getDashboardData);

// PUT: Update own profile
router.put('/me', authenticate, updateMyProfile);

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

// PUT: Update user role (Commander/Commando only)
router.put(
  '/:id/role',
  authenticate,
  authorizeRoles('commander', 'commando'),
  updateUserRole
);

// PUT: Update user status (Commander/Commando only)
router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('commander', 'commando'),
  updateUserStatus
);

module.exports = router;
