/**
 * KPI Constants
 *
 * Centralized constants for KPI-related enums and configurations.
 * Update these when adding new roles, battalions, categories, etc.
 */

// User Roles
const ROLES = [
  'commander',
  'commando',
  'specialForce',
  'globalSoldier'
]

// Battalions
const BATTALIONS = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta'
  // Add new battalions here: 'Echo', 'Foxtrot', etc.
]

// KPI Categories
const CATEGORIES = [
  'spiritual',
  'ministry',
  'leadership',
  'personal',
  'community',
  'other'
]

// Priority Levels
const PRIORITIES = [
  'low',
  'medium',
  'high',
  'critical'
]

// KPI Statuses
const STATUSES = [
  'draft',
  'active',
  'paused',
  'completed',
  'cancelled'
]

// KPI Status Values (for KPIStatus model)
const KPI_STATUS_VALUES = [
  'pending',
  'in_progress',
  'done'
]

// Validation Rules
const VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  MIN_DEADLINE_DAYS: 1, // Minimum days in future for deadline
  MAX_DEADLINE_DAYS: 365 // Maximum days in future for deadline
}

// Index Configuration
const INDEX_CONFIG = {
  TEXT_SEARCH_WEIGHTS: {
    title: 10,
    description: 5
  }
}

module.exports = {
  ROLES,
  BATTALIONS,
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  KPI_STATUS_VALUES,
  VALIDATION_RULES,
  INDEX_CONFIG
}
