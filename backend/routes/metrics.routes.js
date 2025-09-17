const express = require('express')
const router = express.Router()
const MetricsController = require('../controllers/metrics.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorizeRoles } = require('../middleware/role.middleware')

/**
 * Metrics Routes
 *
 * All routes require authentication
 */

// Get live metrics for authenticated user
router.get('/live', authenticate, MetricsController.getLiveMetrics)

// Get specific metric by type
router.get('/:type', authenticate, MetricsController.getMetricByType)

// Admin routes - require admin role
router.get('/user/:userId',
  authenticate,
  authorizeRoles('commander', 'commando'),
  MetricsController.getUserMetrics
)

router.get('/summary',
  authenticate,
  authorizeRoles('commander', 'commando'),
  MetricsController.getMetricsSummary
)

module.exports = router
