const express = require('express');
const router = express.Router();
const { assignKPI } = require('../controllers/kpi.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// POST /api/kpis/assign
router.post('/assign', authenticate, authorizeRoles('commander'), assignKPI);

module.exports = router;
