/**
 * Notification Routes
 *
 * Routes for managing the notification service and sending manual notifications
 */

const express = require('express')
const router = express.Router()
const notificationService = require('../services/notificationService')
const { authenticate } = require('../middleware/auth.middleware')
const { authorizeRoles } = require('../middleware/role.middleware')

/**
 * Get notification service status
 * GET /api/notifications/status
 */
router.get('/status', authenticate, authorizeRoles('commander', 'commando'), async (req, res) => {
  try {
    const status = notificationService.getStatus()
    res.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error getting notification status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get notification status'
    })
  }
})

/**
 * Start notification service
 * POST /api/notifications/start
 */
router.post('/start', authenticate, authorizeRoles('commander'), async (req, res) => {
  try {
    notificationService.start()
    res.json({
      success: true,
      message: 'Notification service started successfully'
    })
  } catch (error) {
    console.error('Error starting notification service:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start notification service'
    })
  }
})

/**
 * Stop notification service
 * POST /api/notifications/stop
 */
router.post('/stop', authenticate, authorizeRoles('commander'), async (req, res) => {
  try {
    notificationService.stop()
    res.json({
      success: true,
      message: 'Notification service stopped successfully'
    })
  } catch (error) {
    console.error('Error stopping notification service:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to stop notification service'
    })
  }
})

/**
 * Send manual KPI deadline reminders
 * POST /api/notifications/send-kpi-reminders
 */
router.post('/send-kpi-reminders', authenticate, authorizeRoles('commander', 'commando'), async (req, res) => {
  try {
    await notificationService.sendKPIDeadlineReminders()
    res.json({
      success: true,
      message: 'KPI deadline reminders sent successfully'
    })
  } catch (error) {
    console.error('Error sending KPI reminders:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send KPI reminders'
    })
  }
})

/**
 * Send manual overdue KPI notifications
 * POST /api/notifications/send-overdue-alerts
 */
router.post('/send-overdue-alerts', authenticate, authorizeRoles('commander', 'commando'), async (req, res) => {
  try {
    await notificationService.sendOverdueKPINotifications()
    res.json({
      success: true,
      message: 'Overdue KPI notifications sent successfully'
    })
  } catch (error) {
    console.error('Error sending overdue alerts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send overdue alerts'
    })
  }
})

/**
 * Send weekly KPI reports
 * POST /api/notifications/send-weekly-reports
 */
router.post('/send-weekly-reports', authenticate, authorizeRoles('commander'), async (req, res) => {
  try {
    await notificationService.sendWeeklyKPIReports()
    res.json({
      success: true,
      message: 'Weekly KPI reports sent successfully'
    })
  } catch (error) {
    console.error('Error sending weekly reports:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send weekly reports'
    })
  }
})

module.exports = router
