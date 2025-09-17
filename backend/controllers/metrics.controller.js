const LiveMetricsService = require('../services/liveMetricsService');
const { asyncHandler } = require('../utils/errors');

/**
 * Metrics Controller
 *
 * Handles live performance metrics calculations and API endpoints
 */
class MetricsController {
  /**
   * Get live performance metrics for dashboard
   * GET /api/metrics/live
   */
  static getLiveMetrics = asyncHandler(async (req, res) => {
    try {
      const userId = req.user?.id; // Get user ID from auth middleware
      const metrics = await LiveMetricsService.getAllLiveMetrics(userId);

      res.status(200).json({
        success: true,
        data: metrics,
        message: 'Live metrics retrieved successfully',
      });
    } catch (error) {
      console.error('Error getting live metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve live metrics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * Get specific metric by type
   * GET /api/metrics/:type
   */
  static getMetricByType = asyncHandler(async (req, res) => {
    try {
      const { type } = req.params;
      const userId = req.user?.id;

      let metric;

      switch (type) {
        case 'completion-rate':
          metric = await LiveMetricsService.getCompletionRate(userId);
          break;
        case 'performance-score':
          metric = await LiveMetricsService.getPerformanceScore(userId);
          break;
        case 'on-time-delivery':
          metric = await LiveMetricsService.getOnTimeDelivery(userId);
          break;
        case 'efficiency':
          metric = await LiveMetricsService.getEfficiency(userId);
          break;
        default:
          return res.status(400).json({
            success: false,
            message:
              'Invalid metric type. Valid types: completion-rate, performance-score, on-time-delivery, efficiency',
          });
      }

      res.status(200).json({
        success: true,
        data: metric,
        message: `${type} metric retrieved successfully`,
      });
    } catch (error) {
      console.error(`Error getting ${req.params.type} metric:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to retrieve ${req.params.type} metric`,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * Get metrics for a specific user (admin only)
   * GET /api/metrics/user/:userId
   */
  static getUserMetrics = asyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const metrics = await LiveMetricsService.getAllLiveMetrics(userId);

      res.status(200).json({
        success: true,
        data: metrics,
        message: `Live metrics for user ${userId} retrieved successfully`,
      });
    } catch (error) {
      console.error(`Error getting metrics for user ${req.params.userId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to retrieve metrics for user ${req.params.userId}`,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * Get metrics summary for all users (admin only)
   * GET /api/metrics/summary
   */
  static getMetricsSummary = asyncHandler(async (req, res) => {
    try {
      // Get overall metrics (no user filter)
      const overallMetrics = await LiveMetricsService.getAllLiveMetrics();

      // Get user count and other summary data
      const User = require('../models/User');
      const totalUsers = await User.countDocuments({ isDeleted: false });
      const activeUsers = await User.countDocuments({
        isDeleted: false,
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Active in last 30 days
      });

      res.status(200).json({
        success: true,
        data: {
          ...overallMetrics,
          summary: {
            totalUsers,
            activeUsers,
            lastUpdated: new Date(),
          },
        },
        message: 'Metrics summary retrieved successfully',
      });
    } catch (error) {
      console.error('Error getting metrics summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve metrics summary',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });
}

module.exports = MetricsController;
