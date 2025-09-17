const express = require('express')
const router = express.Router()
const {
  assignKPI,
  getAllKPIs,
  getMyKPIs,
  getKPISummary,
  getUserKPIs,
  getKPIDetails,
  createKPI,
  updateKPI,
  deleteKPI,
  updateKPIStatus,
  getBattalionKPIData,
  getMembersWithIncompleteKPIs,
  getKPIManagementData,
  getOverdueKPIs
} = require('../controllers/kpi.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorizeRoles } = require('../middleware/role.middleware')

// GET /api/kpis - Get all KPIs (All authenticated users)
router.get('/', authenticate, getAllKPIs)

// GET /api/kpis/my - Get my KPIs (Self)
router.get('/my', authenticate, getMyKPIs)

// GET /api/kpis/summary - Get KPI summary (Self)
router.get('/summary', authenticate, getKPISummary)

// GET /api/kpis/user/:userId - Get KPIs for specific user (Commander/Commando only)
router.get('/user/:userId', authenticate, authorizeRoles('commander', 'commando'), getUserKPIs)

// GET /api/kpis/details/:kpiId - Get KPI details
router.get('/details/:kpiId', authenticate, getKPIDetails)

// POST /api/kpis - Create new KPI (Commander/Commando only)
router.post('/', authenticate, authorizeRoles('commander', 'commando'), createKPI)

// PUT /api/kpis/:kpiId - Update KPI (Commander/Commando only)
router.put('/:kpiId', authenticate, authorizeRoles('commander', 'commando'), updateKPI)

// DELETE /api/kpis/:kpiId - Delete KPI (Commander/Commando only)
router.delete('/:kpiId', authenticate, authorizeRoles('commander', 'commando'), deleteKPI)

// PUT /api/kpis/status/:kpiStatusId - Update KPI status (Self)
router.put('/status/:kpiStatusId', authenticate, updateKPIStatus)

// POST /api/kpis/assign - Assign KPI (Commander only) - Legacy endpoint
router.post('/assign', authenticate, authorizeRoles('commander'), assignKPI)

// GET /api/kpis/battalion/:battalion - Get aggregated KPI data for a battalion
router.get('/battalion/:battalion', authenticate, getBattalionKPIData)

// GET /api/kpis/members/incomplete - Get members with incomplete KPIs (Commander/Commando only)
router.get('/members/incomplete', authenticate, authorizeRoles('commander', 'commando'), getMembersWithIncompleteKPIs)

// GET /api/kpis/management - Get comprehensive KPI management dashboard data (Commander/Commando only)
router.get('/management', authenticate, authorizeRoles('commander', 'commando'), getKPIManagementData)

// GET /api/kpis/overdue - Get overdue KPIs (Commander/Commando only)
router.get('/overdue', authenticate, authorizeRoles('commander', 'commando'), getOverdueKPIs)

module.exports = router
