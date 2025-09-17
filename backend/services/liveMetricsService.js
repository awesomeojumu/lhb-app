const KPI = require('../models/KPI')
const KPIStatus = require('../models/KPIStatus')
const User = require('../models/User')

/**
 * Live Metrics Service
 *
 * Calculates real-time performance metrics for the dashboard.
 * All calculations are based on actual data from the database.
 */
class LiveMetricsService {
  /**
   * Calculate completion rate for the current month
   * @param {String} userId - Optional user ID to filter by specific user
   * @returns {Object} Completion rate data with trends
   */
  static async getCompletionRate (userId = null) {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Build query for current month
      const currentMonthQuery = {
        status: 'done',
        markedAt: { $gte: startOfMonth }
      }

      // Build query for last month
      const lastMonthQuery = {
        status: 'done',
        markedAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      }

      // Add user filter if specified
      if (userId) {
        currentMonthQuery.user = userId
        lastMonthQuery.user = userId
      }

      // Get completion counts
      const [currentMonthCompleted, lastMonthCompleted, totalAssigned] = await Promise.all([
        KPIStatus.countDocuments(currentMonthQuery),
        KPIStatus.countDocuments(lastMonthQuery),
        this.getTotalAssignedKPIs(userId)
      ])

      // Calculate completion rate
      const completionRate = totalAssigned > 0 ? Math.round((currentMonthCompleted / totalAssigned) * 100) : 0
      const lastMonthRate = totalAssigned > 0 ? Math.round((lastMonthCompleted / totalAssigned) * 100) : 0
      const trend = completionRate - lastMonthRate

      return {
        value: completionRate,
        trend,
        currentMonthCompleted,
        lastMonthCompleted,
        totalAssigned
      }
    } catch (error) {
      console.error('Error calculating completion rate:', error)
      return { value: 0, trend: 0, currentMonthCompleted: 0, lastMonthCompleted: 0, totalAssigned: 0 }
    }
  }

  /**
   * Calculate overall performance score based on KPI completion and quality
   * @param {String} userId - Optional user ID to filter by specific user
   * @returns {Object} Performance score data with trends
   */
  static async getPerformanceScore (userId = null) {
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Build queries
      const currentPeriodQuery = {
        status: 'done',
        markedAt: { $gte: thirtyDaysAgo }
      }

      const previousPeriodQuery = {
        status: 'done',
        markedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
      }

      if (userId) {
        currentPeriodQuery.user = userId
        previousPeriodQuery.user = userId
      }

      // Get completion data
      const [currentPeriodData, previousPeriodData] = await Promise.all([
        KPIStatus.find(currentPeriodQuery).populate('kpi'),
        KPIStatus.find(previousPeriodQuery).populate('kpi')
      ])

      // Calculate weighted scores based on KPI priority
      const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 }

      const calculateWeightedScore = (kpiStatuses) => {
        if (kpiStatuses.length === 0) { return 0 }

        let totalWeight = 0
        let weightedScore = 0

        kpiStatuses.forEach(status => {
          const weight = priorityWeights[status.kpi?.priority] || 1
          const progress = status.progress || 100 // Use progress if available, otherwise assume 100% for completed
          weightedScore += (progress / 100) * weight
          totalWeight += weight
        })

        return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0
      }

      const currentScore = calculateWeightedScore(currentPeriodData)
      const previousScore = calculateWeightedScore(previousPeriodData)
      const trend = currentScore - previousScore

      return {
        value: currentScore,
        trend,
        currentPeriodData: currentPeriodData.length,
        previousPeriodData: previousPeriodData.length
      }
    } catch (error) {
      console.error('Error calculating performance score:', error)
      return { value: 0, trend: 0, currentPeriodData: 0, previousPeriodData: 0 }
    }
  }

  /**
   * Calculate on-time delivery rate
   * @param {String} userId - Optional user ID to filter by specific user
   * @returns {Object} On-time delivery data with trends
   */
  static async getOnTimeDelivery (userId = null) {
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Build queries for completed KPIs
      const currentPeriodQuery = {
        status: 'done',
        markedAt: { $gte: thirtyDaysAgo }
      }

      const previousPeriodQuery = {
        status: 'done',
        markedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
      }

      if (userId) {
        currentPeriodQuery.user = userId
        previousPeriodQuery.user = userId
      }

      // Get completed KPIs with their deadline info
      const [currentPeriodData, previousPeriodData] = await Promise.all([
        KPIStatus.find(currentPeriodQuery).populate('kpi'),
        KPIStatus.find(previousPeriodQuery).populate('kpi')
      ])

      // Calculate on-time delivery rates
      const calculateOnTimeRate = (kpiStatuses) => {
        if (kpiStatuses.length === 0) { return 0 }

        const onTimeCount = kpiStatuses.filter(status => {
          if (!status.kpi?.deadline) { return true } // No deadline = on time
          return status.markedAt <= status.kpi.deadline
        }).length

        return Math.round((onTimeCount / kpiStatuses.length) * 100)
      }

      const currentRate = calculateOnTimeRate(currentPeriodData)
      const previousRate = calculateOnTimeRate(previousPeriodData)
      const trend = currentRate - previousRate

      return {
        value: currentRate,
        trend,
        currentPeriodCompleted: currentPeriodData.length,
        previousPeriodCompleted: previousPeriodData.length
      }
    } catch (error) {
      console.error('Error calculating on-time delivery:', error)
      return { value: 0, trend: 0, currentPeriodCompleted: 0, previousPeriodCompleted: 0 }
    }
  }

  /**
   * Calculate resource utilization efficiency
   * @param {String} userId - Optional user ID to filter by specific user
   * @returns {Object} Efficiency data with trends
   */
  static async getEfficiency (userId = null) {
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Get all KPIs assigned to user(s)
      const assignedKPIs = await this.getAssignedKPIs(userId)

      // Get status data for current and previous periods
      const currentPeriodQuery = {
        kpi: { $in: assignedKPIs.map(kpi => kpi._id) },
        markedAt: { $gte: thirtyDaysAgo }
      }

      const previousPeriodQuery = {
        kpi: { $in: assignedKPIs.map(kpi => kpi._id) },
        markedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
      }

      if (userId) {
        currentPeriodQuery.user = userId
        previousPeriodQuery.user = userId
      }

      const [currentStatuses, previousStatuses] = await Promise.all([
        KPIStatus.find(currentPeriodQuery),
        KPIStatus.find(previousPeriodQuery)
      ])

      // Calculate efficiency based on progress made vs time available
      const calculateEfficiency = (statuses, kpis) => {
        if (statuses.length === 0) { return 0 }

        let totalEfficiency = 0
        let count = 0

        statuses.forEach(status => {
          const kpi = kpis.find(k => k._id.toString() === status.kpi.toString())
          if (!kpi) { return }

          // Calculate efficiency based on progress made in time available
          const timeAvailable = kpi.deadline
            ? Math.max(1, (kpi.deadline - new Date(kpi.createdAt)) / (1000 * 60 * 60 * 24))
            : 30 // Default 30 days
          const timeUsed = status.markedAt
            ? (status.markedAt - new Date(kpi.createdAt)) / (1000 * 60 * 60 * 24)
            : timeAvailable

          const progress = status.progress || (status.status === 'done' ? 100 : 0)
          const efficiency = Math.min(100, (progress / Math.max(1, timeUsed)) * timeAvailable)

          totalEfficiency += efficiency
          count++
        })

        return count > 0 ? Math.round(totalEfficiency / count) : 0
      }

      const currentEfficiency = calculateEfficiency(currentStatuses, assignedKPIs)
      const previousEfficiency = calculateEfficiency(previousStatuses, assignedKPIs)
      const trend = currentEfficiency - previousEfficiency

      return {
        value: currentEfficiency,
        trend,
        currentPeriodStatuses: currentStatuses.length,
        previousPeriodStatuses: previousStatuses.length
      }
    } catch (error) {
      console.error('Error calculating efficiency:', error)
      return { value: 0, trend: 0, currentPeriodStatuses: 0, previousPeriodStatuses: 0 }
    }
  }

  /**
   * Get all live metrics for dashboard
   * @param {String} userId - Optional user ID to filter by specific user
   * @returns {Object} Complete metrics object
   */
  static async getAllLiveMetrics (userId = null) {
    try {
      const [completionRate, performanceScore, onTimeDelivery, efficiency] = await Promise.all([
        this.getCompletionRate(userId),
        this.getPerformanceScore(userId),
        this.getOnTimeDelivery(userId),
        this.getEfficiency(userId)
      ])

      return {
        completionRate: {
          value: completionRate.value,
          trend: completionRate.trend,
          description: 'KPIs completed this month'
        },
        performanceScore: {
          value: performanceScore.value,
          trend: performanceScore.trend,
          description: 'Overall performance score'
        },
        onTimeDelivery: {
          value: onTimeDelivery.value,
          trend: onTimeDelivery.trend,
          description: 'Deadlines met on time'
        },
        efficiency: {
          value: efficiency.value,
          trend: efficiency.trend,
          description: 'Resource utilization'
        },
        lastUpdated: new Date(),
        isLive: true
      }
    } catch (error) {
      console.error('Error getting all live metrics:', error)
      throw error
    }
  }

  /**
   * Helper method to get total assigned KPIs for a user
   * @param {String} userId - User ID (optional)
   * @returns {Number} Total assigned KPIs
   */
  static async getTotalAssignedKPIs (userId = null) {
    try {
      if (userId) {
        // Get user and find KPIs assigned to them
        const user = await User.findById(userId)
        if (!user) { return 0 }

        const assignedKPIs = await KPI.find({
          $or: [
            { 'targets.allUsers': true },
            { 'targets.roles': user.role },
            { 'targets.battalions': user.battalion },
            { 'targets.specificUsers': userId }
          ],
          status: 'active',
          isDeleted: false
        })

        return assignedKPIs.length
      } else {
        // Get all active KPIs
        return await KPI.countDocuments({
          status: 'active',
          isDeleted: false
        })
      }
    } catch (error) {
      console.error('Error getting total assigned KPIs:', error)
      return 0
    }
  }

  /**
   * Helper method to get assigned KPIs for a user
   * @param {String} userId - User ID (optional)
   * @returns {Array} Array of assigned KPIs
   */
  static async getAssignedKPIs (userId = null) {
    try {
      if (userId) {
        const user = await User.findById(userId)
        if (!user) { return [] }

        return await KPI.find({
          $or: [
            { 'targets.allUsers': true },
            { 'targets.roles': user.role },
            { 'targets.battalions': user.battalion },
            { 'targets.specificUsers': userId }
          ],
          status: 'active',
          isDeleted: false
        })
      } else {
        return await KPI.find({
          status: 'active',
          isDeleted: false
        })
      }
    } catch (error) {
      console.error('Error getting assigned KPIs:', error)
      return []
    }
  }
}

module.exports = LiveMetricsService
