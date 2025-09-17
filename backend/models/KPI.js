const mongoose = require('mongoose')

// ✅ Extendable enums - move to constants for easy maintenance
const ROLES = ['commander', 'commando', 'specialForce', 'globalSoldier']
const BATTALIONS = ['Alpha', 'Bravo', 'Charlie', 'Delta']
const CATEGORIES = ['spiritual', 'ministry', 'leadership', 'personal', 'community', 'other']
const PRIORITIES = ['low', 'medium', 'high', 'critical']
const STATUSES = ['draft', 'active', 'paused', 'completed', 'cancelled']

/**
 * KPI (Key Performance Indicator) Schema
 *
 * Enterprise-ready schema with optimized performance, comprehensive validation,
 * and production safeguards. Supports global KPI management with multiple target types.
 *
 * Key Features:
 * - Multiple target types (allUsers, roles, battalions, specificUsers)
 * - Pre-aggregated stats for fast dashboard loading
 * - Comprehensive audit trail and versioning
 * - Optimistic concurrency control
 * - Soft delete with recovery support
 * - Extendable enums for easy maintenance
 */
const kpiSchema = new mongoose.Schema({
  // Core KPI Information
  title: {
    type: String,
    required: [true, 'KPI title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },

  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  // KPI Category and Priority
  category: {
    type: String,
    enum: {
      values: CATEGORIES,
      message: 'Invalid category specified'
    },
    default: 'other',
    index: true
  },

  priority: {
    type: String,
    enum: {
      values: PRIORITIES,
      message: 'Invalid priority level specified'
    },
    default: 'medium',
    index: true
  },

  // Creator and Timeline
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    index: true
  },

  deadline: {
    type: Date,
    validate: {
      validator (value) {
        return !value || value > new Date()
      },
      message: 'Deadline must be in the future'
    },
    index: true
  },

  // Target Configuration - supports multiple target types
  targets: {
    allUsers: {
      type: Boolean,
      default: false,
      index: true
    },

    roles: [{
      type: String,
      enum: {
        values: ROLES,
        message: 'Invalid role specified'
      }
    }],

    battalions: [{
      type: String,
      enum: {
        values: BATTALIONS,
        message: 'Invalid battalion specified'
      }
    }],

    specificUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },

  // Pre-aggregated stats for fast loading (updated on KPIStatus changes)
  stats: {
    totalMembers: {
      type: Number,
      default: 0,
      min: [0, 'Total members cannot be negative']
    },
    notStarted: {
      type: Number,
      default: 0,
      min: [0, 'Not started count cannot be negative']
    },
    inProgress: {
      type: Number,
      default: 0,
      min: [0, 'In progress count cannot be negative']
    },
    completed: {
      type: Number,
      default: 0,
      min: [0, 'Completed count cannot be negative']
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true
    },
    // Calculated progress percentage - only updated via updateStats method
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true
    }
  },

  // KPI Status and Lifecycle
  status: {
    type: String,
    enum: {
      values: STATUSES,
      message: 'Invalid status specified'
    },
    default: 'active',
    index: true
  },

  // Visibility and Access Control
  isPublic: {
    type: Boolean,
    default: true,
    index: true
  },

  // Audit and Versioning
  version: {
    type: Number,
    default: 1,
    min: 1
  },

  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Soft delete support
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },

  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // @deprecated Remove after migration (planned Q1 2026)
  // Legacy fields for backward compatibility
  assignedTo: {
    type: String,
    enum: ['all', 'commander', 'commando', 'specialForce', 'globalSoldier'],
    default: 'all'
  },
  specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  battalion: {
    type: String,
    enum: ['Alpha', 'Bravo', 'Charlie', 'Delta']
  }
}, {
  timestamps: true,
  // Enable versioning for optimistic concurrency control
  optimisticConcurrency: true
})

// Custom validation to ensure at least one target is specified
kpiSchema.pre('validate', function (next) {
  const targets = this.targets
  const hasTargets = targets.allUsers ||
                    (targets.roles && targets.roles.length > 0) ||
                    (targets.battalions && targets.battalions.length > 0) ||
                    (targets.specificUsers && targets.specificUsers.length > 0)

  if (!hasTargets) {
    return next(new Error('At least one target must be specified (allUsers, roles, battalions, or specificUsers)'))
  }

  next()
})

// ✅ Removed pre-save hook to avoid race conditions with updateStats
// Progress percentage is now only calculated in updateStats method

// Compound indexes for optimized queries
kpiSchema.index({
  status: 1,
  isDeleted: 1,
  createdAt: -1
})

// Separate indexes for targets to avoid parallel array indexing issues
kpiSchema.index({ 'targets.allUsers': 1 })
kpiSchema.index({ 'targets.roles': 1 })
kpiSchema.index({ 'targets.battalions': 1 })
kpiSchema.index({ 'targets.specificUsers': 1 })

kpiSchema.index({
  category: 1,
  priority: 1,
  status: 1
})

kpiSchema.index({
  deadline: 1,
  status: 1
})

// ✅ Additional index for dashboard freshness queries
kpiSchema.index({
  status: 1,
  'stats.lastUpdated': -1
})

kpiSchema.index({
  'stats.progressPercentage': -1,
  status: 1
})

// Text search index for title and description
kpiSchema.index({
  title: 'text',
  description: 'text'
})

// Instance methods
kpiSchema.methods.updateStats = async function () {
  const KPIStatus = mongoose.model('KPIStatus')
  const statuses = await KPIStatus.find({ kpi: this._id })

  this.stats.totalMembers = statuses.length
  this.stats.notStarted = statuses.filter(s => s.status === 'pending').length
  this.stats.inProgress = statuses.filter(s => s.status === 'in_progress').length
  this.stats.completed = statuses.filter(s => s.status === 'done').length
  this.stats.lastUpdated = new Date()

  // ✅ Single source of truth for progress calculation
  if (this.stats.totalMembers > 0) {
    this.stats.progressPercentage = Math.round(
      ((this.stats.inProgress + this.stats.completed) / this.stats.totalMembers) * 100
    )
  } else {
    this.stats.progressPercentage = 0
  }

  return this.save()
}

kpiSchema.methods.getTargetDescription = function () {
  const targets = this.targets
  const descriptions = []

  if (targets.allUsers) { descriptions.push('All Users') }
  if (targets.roles && targets.roles.length > 0) {
    descriptions.push(`Roles: ${targets.roles.join(', ')}`)
  }
  if (targets.battalions && targets.battalions.length > 0) {
    descriptions.push(`Battalions: ${targets.battalions.join(', ')}`)
  }
  if (targets.specificUsers && targets.specificUsers.length > 0) {
    descriptions.push(`Specific Users: ${targets.specificUsers.length}`)
  }

  return descriptions.join(' | ')
}

kpiSchema.methods.softDelete = function (deletedBy) {
  this.isDeleted = true
  this.deletedAt = new Date()
  this.deletedBy = deletedBy
  this.status = 'cancelled'
  return this.save()
}

// Static methods
kpiSchema.statics.findActive = function () {
  return this.find({
    status: 'active',
    isDeleted: false
  })
}

kpiSchema.statics.findByTarget = function (targetType, targetValue) {
  const query = { status: 'active', isDeleted: false }

  switch (targetType) {
    case 'allUsers':
      query['targets.allUsers'] = true
      break
    case 'role':
      query['targets.roles'] = targetValue
      break
    case 'battalion':
      query['targets.battalions'] = targetValue
      break
    case 'user':
      query['targets.specificUsers'] = targetValue
      break
  }

  return this.find(query)
}

kpiSchema.statics.getOverdueKPIs = function () {
  return this.find({
    deadline: { $lt: new Date() },
    status: { $in: ['active', 'paused'] },
    isDeleted: false
  })
}

// ✅ Additional static method for dashboard freshness
kpiSchema.statics.findRecentlyUpdated = function (hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
  return this.find({
    status: 'active',
    isDeleted: false,
    'stats.lastUpdated': { $gte: cutoff }
  }).sort({ 'stats.lastUpdated': -1 })
}

// Virtual for formatted deadline
kpiSchema.virtual('formattedDeadline').get(function () {
  return this.deadline ? this.deadline.toLocaleDateString() : 'No deadline'
})

// Virtual for days until deadline
kpiSchema.virtual('daysUntilDeadline').get(function () {
  if (!this.deadline) { return null }
  const now = new Date()
  const diffTime = this.deadline - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for target summary
kpiSchema.virtual('targetSummary').get(function () {
  return this.getTargetDescription()
})

// Ensure virtual fields are included in JSON output
kpiSchema.set('toJSON', { virtuals: true })
kpiSchema.set('toObject', { virtuals: true })

// Export constants for use in other files
module.exports = mongoose.model('KPI', kpiSchema)
module.exports.ROLES = ROLES
module.exports.BATTALIONS = BATTALIONS
module.exports.CATEGORIES = CATEGORIES
module.exports.PRIORITIES = PRIORITIES
module.exports.STATUSES = STATUSES
