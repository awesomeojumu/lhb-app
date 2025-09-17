const KPI = require('../models/KPI')
const KPIStatus = require('../models/KPIStatus')

/**
 * KPI Stats Service
 *
 * Ensures KPI stats remain accurate by updating them whenever:
 * - A KPIStatus is created, updated, or deleted
 * - A user is added/removed from a targeted group
 * - A KPI's targets are modified
 */
class KPIStatsService {
  /**
   * Update stats for a specific KPI
   * @param {String} kpiId - The KPI ID to update
   */
  static async updateKPIStats (kpiId) {
    try {
      const kpi = await KPI.findById(kpiId)
      if (!kpi) { return }

      await kpi.updateStats()
    } catch (error) {
      console.error(`Failed to update stats for KPI ${kpiId}:`, error)
    }
  }

  /**
   * Update stats for multiple KPIs
   * @param {Array} kpiIds - Array of KPI IDs to update
   */
  static async updateMultipleKPIStats (kpiIds) {
    const promises = kpiIds.map(id => this.updateKPIStats(id))
    await Promise.allSettled(promises)
  }

  /**
   * Update stats when a KPIStatus changes
   * @param {String} kpiStatusId - The KPIStatus ID that changed
   */
  static async onKPIStatusChange (kpiStatusId) {
    try {
      const kpiStatus = await KPIStatus.findById(kpiStatusId)
      if (!kpiStatus) { return }

      await this.updateKPIStats(kpiStatus.kpi)
    } catch (error) {
      console.error(`Failed to update stats after KPIStatus change ${kpiStatusId}:`, error)
    }
  }

  /**
   * Update stats when a user is added/removed from targets
   * @param {String} userId - The user ID that was affected
   */
  static async onUserTargetChange (userId) {
    try {
      // Find all KPIs that might be affected by this user
      const user = await require('../models/User').findById(userId)
      if (!user) { return }

      const kpiIds = new Set()

      // Find KPIs targeting all users
      const allUserKPIs = await KPI.find({
        'targets.allUsers': true,
        status: 'active',
        isDeleted: false
      })
      allUserKPIs.forEach(kpi => kpiIds.add(kpi._id.toString()))

      // Find KPIs targeting user's role
      if (user.role) {
        const roleKPIs = await KPI.find({
          'targets.roles': user.role,
          status: 'active',
          isDeleted: false
        })
        roleKPIs.forEach(kpi => kpiIds.add(kpi._id.toString()))
      }

      // Find KPIs targeting user's battalion
      if (user.battalion) {
        const battalionKPIs = await KPI.find({
          'targets.battalions': user.battalion,
          status: 'active',
          isDeleted: false
        })
        battalionKPIs.forEach(kpi => kpiIds.add(kpi._id.toString()))
      }

      // Find KPIs targeting this specific user
      const specificUserKPIs = await KPI.find({
        'targets.specificUsers': userId,
        status: 'active',
        isDeleted: false
      })
      specificUserKPIs.forEach(kpi => kpiIds.add(kpi._id.toString()))

      // Update stats for all affected KPIs
      await this.updateMultipleKPIStats(Array.from(kpiIds))
    } catch (error) {
      console.error(`Failed to update stats after user target change ${userId}:`, error)
    }
  }

  /**
   * Recalculate all KPI stats (for maintenance/repair)
   */
  static async recalculateAllStats () {
    try {
      const activeKPIs = await KPI.find({
        status: 'active',
        isDeleted: false
      })

      const promises = activeKPIs.map(kpi => kpi.updateStats())
      await Promise.allSettled(promises)

      console.log(`Recalculated stats for ${activeKPIs.length} KPIs`)
    } catch (error) {
      console.error('Failed to recalculate all KPI stats:', error)
    }
  }
}

module.exports = KPIStatsService
