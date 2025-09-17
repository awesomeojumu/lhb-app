const KPI = require('../models/KPI')
const User = require('../models/User')
const KPIStatus = require('../models/KPIStatus')
const { sendKPINotification } = require('../services/email.service')
const KPIStatsService = require('../services/kpiStatsService')
const notificationService = require('../services/notificationService')
const websocketService = require('../services/websocketService')

/**
 * Controller to assign a KPI to users and notify them via email.
 * Steps:
 * 1. Create a new KPI record in the database.
 * 2. Determine the target users based on assignment type (all, by role, or specific users).
 * 3. Create a KPIStatus entry for each user to track their progress.
 * 4. Send notification emails to all assigned users (does not block on failures).
 * 5. Respond with success or error.
 */
const assignKPI = async (req, res) => {
  try {
    // Extract KPI details and creator from request
    const { title, description, assignedTo, specificUsers, deadline } = req.body
    const createdBy = req.user.id

    // 1. Create the KPI record in the database
    const kpi = await KPI.create({
      title,
      description,
      assignedTo,
      specificUsers,
      deadline,
      createdBy
    })

    // 2. Determine which users should receive this KPI
    let targetUsers = []

    if (assignedTo === 'all') {
      // Assign to all users
      targetUsers = await User.find({})
    } else if (['commander', 'commando', 'specialForce', 'globalSoldier'].includes(assignedTo)) {
      // Assign to users with a specific role
      targetUsers = await User.find({ role: assignedTo })
    } else if (
      assignedTo === 'specific' &&
      Array.isArray(specificUsers) &&
      specificUsers.length > 0
    ) {
      // Assign to a specific list of user IDs
      targetUsers = await User.find({ _id: { $in: specificUsers } })
    }

    // If no users are found, return an error response
    if (!targetUsers.length) {
      return res.status(400).json({ message: 'No eligible users found for this KPI assignment.' })
    }

    // 3. For each user, create a KPIStatus entry to track their progress on this KPI
    const statusEntries = targetUsers.map((user) => ({
      user: user._id,
      kpi: kpi._id
    }))

    await KPIStatus.insertMany(statusEntries)

    // 4. Send enhanced notification emails to all assigned users
    // Use Promise.allSettled to ensure all emails are attempted, but don't block on failures
    const sendAllEmails = targetUsers.map((user) =>
      sendKPINotification(
        user.email,
        user.firstName,
        kpi.title,
        kpi.description,
        kpi.deadline,
        kpi.priority,
        kpi.category
      )
    )

    await Promise.allSettled(sendAllEmails)

    // 5. Respond with success, including number of recipients and KPI details
    res.status(201).json({
      message: 'KPI assigned successfully',
      recipients: targetUsers.length,
      kpi
    })
  } catch (err) {
    // Log and respond with a server error if anything goes wrong
    console.error('KPI Assignment Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get all KPIs (for commanders and commandos)
 */
const getAllKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find()
      .populate('createdBy', 'firstName lastName email')
      .populate('specificUsers', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json(kpis)
  } catch (err) {
    console.error('Get All KPIs Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get KPIs assigned to the current user
 */
const getMyKPIs = async (req, res) => {
  try {
    const userId = req.user.id

    const kpiStatuses = await KPIStatus.find({ user: userId })
      .populate('kpi', 'title description deadline createdAt')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json(kpiStatuses)
  } catch (err) {
    console.error('Get My KPIs Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get KPI summary for the current user
 */
const getKPISummary = async (req, res) => {
  try {
    const userId = req.user.id

    const summary = await KPIStatus.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const total = await KPIStatus.countDocuments({ user: userId })

    const summaryObj = {
      total,
      pending: 0,
      in_progress: 0,
      done: 0
    }

    summary.forEach(item => {
      summaryObj[item._id] = item.count
    })

    res.json(summaryObj)
  } catch (err) {
    console.error('Get KPI Summary Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get KPIs for a specific user (for commanders/commandos)
 */
const getUserKPIs = async (req, res) => {
  try {
    const { userId } = req.params

    const kpiStatuses = await KPIStatus.find({ user: userId })
      .populate('kpi', 'title description deadline createdAt')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json(kpiStatuses)
  } catch (err) {
    console.error('Get User KPIs Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get KPI details
 */
const getKPIDetails = async (req, res) => {
  try {
    const { kpiId } = req.params

    const kpi = await KPI.findById(kpiId)
      .populate('createdBy', 'firstName lastName email')
      .populate('specificUsers', 'firstName lastName email')

    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' })
    }

    res.json(kpi)
  } catch (err) {
    console.error('Get KPI Details Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Create a new KPI
 */
const createKPI = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      targets = {},
      category = 'other',
      priority = 'medium',
      // Legacy support
      assignmentType,
      userIds,
      role
    } = req.body
    const createdBy = req.user.id

    // Build KPI data with new targets structure
    const kpiData = {
      title,
      description,
      deadline,
      createdBy,
      category,
      priority,
      targets: {
        allUsers: targets.allUsers || false,
        roles: targets.roles || [],
        battalions: targets.battalions || [],
        specificUsers: targets.specificUsers || []
      }
    }

    // Legacy support - convert old format to new format
    if (assignmentType) {
      if (assignmentType === 'all') {
        kpiData.targets.allUsers = true
      } else if (assignmentType === 'role' && role) {
        kpiData.targets.roles = [role]
      } else if (assignmentType === 'specific' && userIds) {
        kpiData.targets.specificUsers = userIds
      }
    }

    // Validate that at least one target is specified
    const hasTargets = kpiData.targets.allUsers ||
                      kpiData.targets.roles.length > 0 ||
                      kpiData.targets.battalions.length > 0 ||
                      kpiData.targets.specificUsers.length > 0

    if (!hasTargets) {
      return res.status(400).json({
        message: 'At least one target must be specified (allUsers, roles, battalions, or specificUsers)'
      })
    }

    // Create the KPI
    const kpi = await KPI.create(kpiData)

    // Determine target users based on the new targets structure
    let targetUsers = []

    if (kpiData.targets.allUsers) {
      // Get all users
      targetUsers = await User.find({})
    } else {
      // Build query for specific targets
      const userQuery = { $or: [] }

      if (kpiData.targets.roles.length > 0) {
        userQuery.$or.push({ role: { $in: kpiData.targets.roles } })
      }

      if (kpiData.targets.battalions.length > 0) {
        userQuery.$or.push({ battalion: { $in: kpiData.targets.battalions } })
      }

      if (kpiData.targets.specificUsers.length > 0) {
        userQuery.$or.push({ _id: { $in: kpiData.targets.specificUsers } })
      }

      if (userQuery.$or.length > 0) {
        targetUsers = await User.find(userQuery)
      }
    }

    // Create KPIStatus entries for all target users
    if (targetUsers.length > 0) {
      const statusEntries = targetUsers.map((user) => ({
        user: user._id,
        kpi: kpi._id,
        status: 'pending'
      }))

      await KPIStatus.insertMany(statusEntries)

      // Update KPI stats
      await kpi.updateStats()
    }

    // Broadcast KPI created event via WebSocket
    websocketService.broadcastKPICreated({
      id: kpi._id,
      title: kpi.title,
      createdBy: kpi.createdBy,
      targetCount: targetUsers.length
    })

    res.status(201).json({
      message: 'KPI created successfully',
      kpi,
      targetCount: targetUsers.length
    })
  } catch (err) {
    console.error('Create KPI Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Update a KPI
 */
const updateKPI = async (req, res) => {
  try {
    const { kpiId } = req.params
    const updateData = req.body

    const kpi = await KPI.findByIdAndUpdate(kpiId, updateData, { new: true })
      .populate('createdBy', 'firstName lastName email')
      .populate('specificUsers', 'firstName lastName email')

    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' })
    }

    res.json(kpi)
  } catch (err) {
    console.error('Update KPI Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Delete a KPI
 */
const deleteKPI = async (req, res) => {
  try {
    const { kpiId } = req.params
    const deletedBy = req.user.id

    // Use soft delete instead of hard delete
    const kpi = await KPI.findById(kpiId)
    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' })
    }

    // Soft delete the KPI
    await kpi.softDelete(deletedBy)

    // Delete all related KPIStatus entries
    await KPIStatus.deleteMany({ kpi: kpiId })

    res.json({ message: 'KPI deleted successfully' })
  } catch (err) {
    console.error('Delete KPI Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Update KPI status
 */
const updateKPIStatus = async (req, res) => {
  try {
    const { kpiStatusId } = req.params
    const { status, progress } = req.body

    console.log('Update KPI Status Request:', {
      kpiStatusId,
      status,
      progress,
      userId: req.user?.id
    })

    const updateData = {
      status,
      markedAt: new Date()
    }

    // Include progress if provided
    if (progress !== undefined) {
      updateData.progress = progress
    }

    console.log('Update data:', updateData)

    const kpiStatus = await KPIStatus.findByIdAndUpdate(
      kpiStatusId,
      updateData,
      { new: true }
    ).populate('kpi', 'title description deadline')
      .populate('user', 'firstName lastName email')

    if (!kpiStatus) {
      console.log('KPI status not found for ID:', kpiStatusId)
      return res.status(404).json({ message: 'KPI status not found' })
    }

    console.log('KPI status updated successfully:', kpiStatus._id)

    // Update KPI stats after status change
    await KPIStatsService.onKPIStatusChange(kpiStatusId)

    // Send completion notification to commanders if KPI is marked as done
    if (status === 'done') {
      await notificationService.sendKPICompletionNotificationToCommanders(kpiStatusId)
    }

    // Broadcast KPI status change event via WebSocket
    websocketService.broadcastKPIStatusChange(kpiStatus.user._id, {
      kpiStatusId: kpiStatus._id,
      kpiId: kpiStatus.kpi._id,
      userId: kpiStatus.user._id,
      status: kpiStatus.status,
      progress: kpiStatus.progress
    })

    res.json(kpiStatus)
  } catch (err) {
    console.error('Update KPI Status Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get aggregated KPI data for a battalion
 * This aggregates individual KPI assignments for all members in the battalion
 */
const getBattalionKPIData = async (req, res) => {
  try {
    const { battalion } = req.params

    // Get all users in the battalion
    const battalionUsers = await User.find({ battalion }).select('_id firstName lastName role')

    if (!battalionUsers.length) {
      return res.json({
        totalKPIs: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        uniqueKPIs: [],
        memberAssignments: []
      })
    }

    const userIds = battalionUsers.map(user => user._id)

    // Get all KPI statuses for users in this battalion
    const kpiStatuses = await KPIStatus.find({ user: { $in: userIds } })
      .populate('kpi', 'title description deadline assignedTo')
      .populate('user', 'firstName lastName role')

    // Get unique KPIs assigned to this battalion
    const uniqueKPIs = [...new Set(kpiStatuses.map(status => status.kpi._id.toString()))]

    // Aggregate status counts
    const statusCounts = kpiStatuses.reduce((acc, status) => {
      if (status.status === 'done') {
        acc.completed++
      } else if (status.status === 'in_progress') {
        acc.inProgress++
      } else {
        acc.notStarted++
      }
      return acc
    }, { completed: 0, inProgress: 0, notStarted: 0 })

    // Group assignments by KPI for detailed view
    const kpiGroups = {}
    kpiStatuses.forEach(status => {
      const kpiId = status.kpi._id.toString()
      if (!kpiGroups[kpiId]) {
        kpiGroups[kpiId] = {
          kpi: status.kpi,
          assignments: []
        }
      }
      kpiGroups[kpiId].assignments.push({
        user: status.user,
        status: status.status,
        markedAt: status.markedAt
      })
    })

    res.json({
      totalKPIs: kpiStatuses.length, // Total individual assignments
      completed: statusCounts.completed,
      inProgress: statusCounts.inProgress,
      notStarted: statusCounts.notStarted,
      uniqueKPIs: uniqueKPIs.length, // Number of distinct KPI tasks
      memberAssignments: Object.values(kpiGroups),
      battalionUsers: battalionUsers.length
    })
  } catch (err) {
    console.error('Get Battalion KPI Data Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get members with incomplete KPIs across all battalions
 * This provides a comprehensive view for management to track progress
 */
const getMembersWithIncompleteKPIs = async (req, res) => {
  try {
    const { status = 'notStarted' } = req.query

    // Get all users
    const allUsers = await User.find({})
      .select('_id firstName lastName email role battalion phone sex ageBracket')
      .sort({ battalion: 1, role: 1, firstName: 1 })

    // Get all KPI statuses
    const allKpiStatuses = await KPIStatus.find({})
      .populate('kpi', 'title description deadline assignedTo')
      .populate('user', 'firstName lastName role battalion')

    // Group by user and filter by status
    const userKpiMap = {}
    allKpiStatuses.forEach(status => {
      const userId = status.user._id.toString()
      if (!userKpiMap[userId]) {
        userKpiMap[userId] = {
          user: status.user,
          kpis: []
        }
      }
      userKpiMap[userId].kpis.push({
        kpi: status.kpi,
        status: status.status,
        markedAt: status.markedAt
      })
    })

    // Filter users based on status
    const filteredUsers = allUsers.filter(user => {
      const userId = user._id.toString()
      const userKpis = userKpiMap[userId] || { kpis: [] }

      if (status === 'notStarted') {
        // Users with no KPIs or all KPIs not started
        return userKpis.kpis.length === 0 || userKpis.kpis.every(kpi => kpi.status === 'pending')
      } else if (status === 'inProgress') {
        // Users with at least one in-progress KPI
        return userKpis.kpis.some(kpi => kpi.status === 'in_progress')
      } else if (status === 'completed') {
        // Users with all KPIs completed
        return userKpis.kpis.length > 0 && userKpis.kpis.every(kpi => kpi.status === 'done')
      }
      return false
    })

    // Group by battalion
    const battalionGroups = {}
    filteredUsers.forEach(user => {
      const battalion = user.battalion || 'Unassigned'
      if (!battalionGroups[battalion]) {
        battalionGroups[battalion] = []
      }
      battalionGroups[battalion].push({
        ...user.toObject(),
        kpiDetails: userKpiMap[user._id.toString()]?.kpis || []
      })
    })

    // Calculate summary statistics
    const summary = {
      totalMembers: filteredUsers.length,
      byBattalion: Object.keys(battalionGroups).map(battalion => ({
        battalion,
        count: battalionGroups[battalion].length
      })),
      byRole: filteredUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {})
    }

    res.json({
      summary,
      members: battalionGroups,
      status
    })
  } catch (err) {
    console.error('Get Members with Incomplete KPIs Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get comprehensive KPI management dashboard data
 * This provides all the data needed for the KPI Management page
 */
const getKPIManagementData = async (req, res) => {
  try {
    // Get all users and KPI statuses in parallel
    const [allUsers, allKpiStatuses, allKpis] = await Promise.all([
      User.find({})
        .select('_id firstName lastName email role battalion phone sex ageBracket')
        .sort({ battalion: 1, role: 1, firstName: 1 }),
      KPIStatus.find({})
        .populate('kpi', 'title description deadline targets createdBy')
        .populate('user', 'firstName lastName role battalion'),
      KPI.find({ status: 'active', isDeleted: false })
        .populate('createdBy', 'firstName lastName email')
        .populate('targets.specificUsers', 'firstName lastName email')
        .sort({ createdAt: -1 })
    ])

    // Calculate total members
    const totalMembers = allUsers.length

    // Calculate members who have started at least one KPI
    const membersWithStartedKPIs = new Set(
      allKpiStatuses
        .filter(status => status.user && (status.status === 'in_progress' || status.status === 'done'))
        .map(status => status.user._id.toString())
    ).size

    // Calculate progress percentage
    const progressPercentage = totalMembers > 0 ? Math.round((membersWithStartedKPIs / totalMembers) * 100) : 0

    // Aggregate KPI status counts
    const statusCounts = allKpiStatuses.reduce((acc, status) => {
      // Skip if user or kpi is null
      if (!status.user || !status.kpi) { return acc }

      if (status.status === 'done') {
        acc.completed++
      } else if (status.status === 'in_progress') {
        acc.inProgress++
      } else {
        acc.notStarted++
      }
      return acc
    }, { completed: 0, inProgress: 0, notStarted: 0 })

    // Get unique KPI count (distinct KPI tasks)
    const uniqueKPIs = [...new Set(allKpiStatuses.filter(status => status.kpi).map(status => status.kpi._id.toString()))].length

    // Group members by their KPI progress status
    const memberKpiMap = {}
    allKpiStatuses.forEach(status => {
      // Skip if user or kpi is null
      if (!status.user || !status.kpi) { return }

      const userId = status.user._id.toString()
      if (!memberKpiMap[userId]) {
        memberKpiMap[userId] = {
          user: status.user,
          kpis: [],
          hasStarted: false,
          allCompleted: false
        }
      }
      memberKpiMap[userId].kpis.push({
        kpi: status.kpi,
        status: status.status,
        markedAt: status.markedAt
      })

      // Update flags
      if (status.status === 'in_progress' || status.status === 'done') {
        memberKpiMap[userId].hasStarted = true
      }
    })

    // Calculate member completion flags
    Object.values(memberKpiMap).forEach(member => {
      if (member.kpis.length > 0) {
        member.allCompleted = member.kpis.every(kpi => kpi.status === 'done')
      }
    })

    // Group members by battalion with their KPI status
    const battalionGroups = {}
    allUsers.forEach(user => {
      const battalion = user.battalion || 'Unassigned'
      if (!battalionGroups[battalion]) {
        battalionGroups[battalion] = {
          members: [],
          totalMembers: 0,
          membersStarted: 0,
          membersCompleted: 0
        }
      }

      const userKpiData = memberKpiMap[user._id.toString()] || { kpis: [], hasStarted: false, allCompleted: false }

      battalionGroups[battalion].members.push({
        ...user.toObject(),
        kpiDetails: userKpiData.kpis,
        hasStarted: userKpiData.hasStarted,
        allCompleted: userKpiData.allCompleted
      })

      battalionGroups[battalion].totalMembers++
      if (userKpiData.hasStarted) {
        battalionGroups[battalion].membersStarted++
      }
      if (userKpiData.allCompleted) {
        battalionGroups[battalion].membersCompleted++
      }
    })

    // Calculate battalion-level progress
    Object.keys(battalionGroups).forEach(battalion => {
      const group = battalionGroups[battalion]
      group.progressPercentage = group.totalMembers > 0
        ? Math.round((group.membersStarted / group.totalMembers) * 100)
        : 0
    })

    res.json({
      // Overall statistics
      totalMembers,
      membersStarted: membersWithStartedKPIs,
      membersCompleted: Object.values(memberKpiMap).filter(m => m.allCompleted).length,
      progressPercentage,

      // KPI counts
      totalKPIs: allKpis.length,
      uniqueKPIs,
      kpiStatusCounts: statusCounts,

      // Member data grouped by battalion
      battalionGroups,

      // Raw data for detailed views with per-KPI progress
      allKpis: allKpis.map(kpi => {
        const kpiObj = kpi.toObject()
        return {
          ...kpiObj,
          // Add per-KPI progress data from stats
          membersNotStarted: kpi.stats?.notStarted || 0,
          membersInProgress: kpi.stats?.inProgress || 0,
          membersCompleted: kpi.stats?.completed || 0,
          totalTargetedMembers: kpi.stats?.totalMembers || 0,
          progressPercentage: kpi.stats?.progressPercentage || 0,
          targetDescription: kpi.getTargetDescription ? kpi.getTargetDescription() : 'Not specified',
          formattedDeadline: kpi.formattedDeadline || 'No deadline',
          daysUntilDeadline: kpi.daysUntilDeadline || null
        }
      }),
      allUsers
    })
  } catch (err) {
    console.error('Get KPI Management Data Error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Get overdue KPIs
 * Returns all KPIs that have passed their deadline and are still active or paused
 */
const getOverdueKPIs = async (req, res) => {
  try {
    const overdueKPIs = await KPI.getOverdueKPIs()
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email')
      .sort({ deadline: 1 }) // Sort by deadline (oldest first)

    // Transform the data to include additional useful information
    const transformedKPIs = overdueKPIs.map(kpi => {
      const kpiObj = kpi.toObject()
      const now = new Date()
      const daysOverdue = kpi.deadline ? Math.ceil((now - kpi.deadline) / (1000 * 60 * 60 * 24)) : 0

      return {
        ...kpiObj,
        daysOverdue,
        targetDescription: kpi.getTargetDescription ? kpi.getTargetDescription() : 'Not specified',
        formattedDeadline: kpi.formattedDeadline || 'No deadline',
        // Add severity level based on how overdue
        severity: daysOverdue <= 7 ? 'low' : daysOverdue <= 30 ? 'medium' : 'high'
      }
    })

    res.json({
      success: true,
      count: transformedKPIs.length,
      overdueKPIs: transformedKPIs
    })
  } catch (err) {
    console.error('Get Overdue KPIs Error:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue KPIs',
      error: err.message
    })
  }
}

// Export all controller functions
module.exports = {
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
}
