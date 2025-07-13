const mongoose = require('mongoose');

/**
 * KPIStatus Schema
 *
 * This schema tracks the progress of each user on each assigned KPI.
 * Each document represents the status of a single user for a specific KPI.
 *
 * Fields:
 * - user:      Reference to the User who is assigned the KPI (required).
 * - kpi:       Reference to the KPI being tracked (required).
 * - status:    The current status of the KPI for this user.
 *              Can be 'pending' (default), 'in_progress', or 'done'.
 * - markedAt:  The date/time when the KPI was marked as completed or updated.
 * - timestamps: Automatically adds createdAt and updatedAt fields.
 */
const kpiStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Reference to the user assigned this KPI
    kpi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KPI',
      required: true,
    }, // Reference to the KPI being tracked
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'done'], // Allowed status values
      default: 'pending', // Default status is 'pending'
    },
    markedAt: Date, // Timestamp when the status was last updated/marked
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

module.exports = mongoose.model('KPIStatus', kpiStatusSchema); // Export the model for use in other parts of the application
