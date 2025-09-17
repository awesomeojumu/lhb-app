/**
 * Comprehensive Notification Service for LHB App
 *
 * This service handles all email notifications and scheduling for the Lighthouse Barracks application.
 * It includes automated reminders, status change notifications, and system alerts.
 */

const cron = require('node-cron')
const KPI = require('../models/KPI')
const KPIStatus = require('../models/KPIStatus')
const User = require('../models/User')
const {
  sendKPIDeadlineReminder,
  sendKPICompletionNotification,
  sendRoleChangeNotification,
  sendAccountStatusChangeNotification,
  sendPasswordResetEmail
} = require('./email.service')

class NotificationService {
  constructor () {
    this.isRunning = false
    this.scheduledJobs = new Map()
  }

  /**
   * Start the notification service
   */
  start () {
    if (this.isRunning) {
      console.log('Notification service is already running')
      return
    }

    console.log('🚀 Starting LHB Notification Service...')

    // Schedule daily KPI deadline reminders at 9 AM
    this.scheduleJob('kpi-reminders', '0 9 * * *', () => {
      this.sendKPIDeadlineReminders()
    })

    // Schedule overdue KPI alerts at 6 PM
    this.scheduleJob('overdue-alerts', '0 18 * * *', () => {
      this.sendOverdueKPINotifications()
    })

    // Schedule weekly KPI completion reports on Mondays at 8 AM
    this.scheduleJob('weekly-reports', '0 8 * * 1', () => {
      this.sendWeeklyKPIReports()
    })

    this.isRunning = true
    console.log('✅ Notification service started successfully')
  }

  /**
   * Stop the notification service
   */
  stop () {
    if (!this.isRunning) {
      console.log('Notification service is not running')
      return
    }

    console.log('🛑 Stopping LHB Notification Service...')

    this.scheduledJobs.forEach((job, name) => {
      job.destroy()
      console.log(`Stopped job: ${name}`)
    })

    this.scheduledJobs.clear()
    this.isRunning = false
    console.log('✅ Notification service stopped')
  }

  /**
   * Schedule a cron job
   */
  scheduleJob (name, cronExpression, task) {
    const job = cron.schedule(cronExpression, task, {
      scheduled: false,
      timezone: 'UTC'
    })

    this.scheduledJobs.set(name, job)
    job.start()
    console.log(`📅 Scheduled job: ${name} (${cronExpression})`)
  }

  /**
   * Send KPI deadline reminders
   */
  async sendKPIDeadlineReminders () {
    try {
      console.log('🔔 Sending KPI deadline reminders...')

      const now = new Date()
      const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000))
      const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000))

      // Find KPIs due in 3 days, 1 day, or today
      const upcomingKPIs = await KPI.find({
        deadline: {
          $gte: now,
          $lte: threeDaysFromNow
        },
        status: 'active',
        isDeleted: false
      }).populate('createdBy', 'firstName lastName email')

      for (const kpi of upcomingKPIs) {
        const daysLeft = Math.ceil((kpi.deadline - now) / (24 * 60 * 60 * 1000))

        // Only send reminders for 3 days, 1 day, and today
        if ([3, 1, 0].includes(daysLeft)) {
          // Get all users assigned to this KPI
          const kpiStatuses = await KPIStatus.find({ kpi: kpi._id })
            .populate('user', 'firstName lastName email')

          for (const kpiStatus of kpiStatuses) {
            if (kpiStatus.status !== 'done') {
              await sendKPIDeadlineReminder(
                kpiStatus.user.email,
                kpiStatus.user.firstName,
                kpi.title,
                kpi.deadline,
                daysLeft
              )
            }
          }
        }
      }

      console.log(`✅ Sent ${upcomingKPIs.length} KPI deadline reminders`)
    } catch (error) {
      console.error('❌ Error sending KPI deadline reminders:', error)
    }
  }

  /**
   * Send overdue KPI notifications
   */
  async sendOverdueKPINotifications () {
    try {
      console.log('🚨 Sending overdue KPI notifications...')

      const now = new Date()
      const overdueKPIs = await KPI.find({
        deadline: { $lt: now },
        status: 'active',
        isDeleted: false
      })

      for (const kpi of overdueKPIs) {
        const kpiStatuses = await KPIStatus.find({ kpi: kpi._id })
          .populate('user', 'firstName lastName email')

        for (const kpiStatus of kpiStatuses) {
          if (kpiStatus.status !== 'done') {
            const daysOverdue = Math.ceil((now - kpi.deadline) / (24 * 60 * 60 * 1000))
            await sendKPIDeadlineReminder(
              kpiStatus.user.email,
              kpiStatus.user.firstName,
              kpi.title,
              kpi.deadline,
              -daysOverdue // Negative for overdue
            )
          }
        }
      }

      console.log(`✅ Sent ${overdueKPIs.length} overdue KPI notifications`)
    } catch (error) {
      console.error('❌ Error sending overdue KPI notifications:', error)
    }
  }

  /**
   * Send weekly KPI completion reports to commanders
   */
  async sendWeeklyKPIReports () {
    try {
      console.log('📊 Sending weekly KPI reports...')

      const commanders = await User.find({ role: 'commander' })
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      for (const commander of commanders) {
        // Get completed KPIs from the past week
        const completedKPIs = await KPIStatus.find({
          status: 'done',
          markedAt: { $gte: oneWeekAgo },
          user: { $ne: commander._id } // Exclude commander's own KPIs
        }).populate('kpi', 'title description').populate('user', 'firstName lastName')

        if (completedKPIs.length > 0) {
          // Group by user for better reporting
          const userCompletions = {}
          completedKPIs.forEach(kpiStatus => {
            const userId = kpiStatus.user._id.toString()
            if (!userCompletions[userId]) {
              userCompletions[userId] = {
                user: kpiStatus.user,
                completions: []
              }
            }
            userCompletions[userId].completions.push({
              title: kpiStatus.kpi.title,
              completedAt: kpiStatus.markedAt
            })
          })

          // Send individual completion notifications
          for (const [userId, data] of Object.entries(userCompletions)) {
            for (const completion of data.completions) {
              await sendKPICompletionNotification(
                commander.email,
                commander.firstName,
                `${data.user.firstName} ${data.user.lastName}`,
                completion.title,
                completion.completedAt
              )
            }
          }
        }
      }

      console.log(`✅ Sent weekly KPI reports to ${commanders.length} commanders`)
    } catch (error) {
      console.error('❌ Error sending weekly KPI reports:', error)
    }
  }

  /**
   * Send role change notification
   */
  async sendRoleChangeNotification (userId, oldRole, newRole, changedByUserId) {
    try {
      const user = await User.findById(userId)
      const changedBy = await User.findById(changedByUserId)

      if (user && changedBy) {
        await sendRoleChangeNotification(
          user.email,
          user.firstName,
          oldRole,
          newRole,
          `${changedBy.firstName} ${changedBy.lastName}`
        )
        console.log(`✅ Role change notification sent to ${user.email}`)
      }
    } catch (error) {
      console.error('❌ Error sending role change notification:', error)
    }
  }

  /**
   * Send account status change notification
   */
  async sendAccountStatusChangeNotification (userId, status, reason) {
    try {
      const user = await User.findById(userId)

      if (user) {
        await sendAccountStatusChangeNotification(
          user.email,
          user.firstName,
          status,
          reason
        )
        console.log(`✅ Account status change notification sent to ${user.email}`)
      }
    } catch (error) {
      console.error('❌ Error sending account status change notification:', error)
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail (userId, resetToken) {
    try {
      const user = await User.findById(userId)

      if (user) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        await sendPasswordResetEmail(
          user.email,
          user.firstName,
          resetToken,
          resetUrl
        )
        console.log(`✅ Password reset email sent to ${user.email}`)
      }
    } catch (error) {
      console.error('❌ Error sending password reset email:', error)
    }
  }

  /**
   * Send KPI completion notification to commanders
   */
  async sendKPICompletionNotificationToCommanders (kpiStatusId) {
    try {
      const kpiStatus = await KPIStatus.findById(kpiStatusId)
        .populate('kpi', 'title createdBy')
        .populate('user', 'firstName lastName')

      if (kpiStatus && kpiStatus.status === 'done') {
        // Find commanders who should be notified
        const commanders = await User.find({
          role: 'commander',
          _id: { $ne: kpiStatus.user._id } // Don't notify the user themselves
        })

        for (const commander of commanders) {
          await sendKPICompletionNotification(
            commander.email,
            commander.firstName,
            `${kpiStatus.user.firstName} ${kpiStatus.user.lastName}`,
            kpiStatus.kpi.title,
            kpiStatus.markedAt
          )
        }

        console.log(`✅ KPI completion notifications sent to ${commanders.length} commanders`)
      }
    } catch (error) {
      console.error('❌ Error sending KPI completion notifications:', error)
    }
  }

  /**
   * Get notification service status
   */
  getStatus () {
    return {
      isRunning: this.isRunning,
      scheduledJobs: Array.from(this.scheduledJobs.keys()),
      totalJobs: this.scheduledJobs.size
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService()

module.exports = notificationService
