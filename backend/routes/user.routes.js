const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const { createUserByCommander, deleteUser } = require('../controllers/user.controller');

// Commander or Commando can create users
router.post(
  '/create',
  authenticate,
  authorizeRoles('commander', 'commando'),
  createUserByCommander
);

// Commander or Commando can delete users
router.delete('/:id', authenticate, authorizeRoles('commander', 'commando'), deleteUser);

module.exports = router;
