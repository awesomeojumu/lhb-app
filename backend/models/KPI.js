const mongoose = require('mongoose');

/**
 * KPI (Key Performance Indicator) Schema
 *
 * This schema defines the structure for KPI documents in the database.
 * Each KPI can be assigned to all users, a specific role, or a specific list of users.
 *
 * Fields:
 * - title:        The title of the KPI (required).
 * - description:  A brief description of the KPI.
 * - assignedTo:   Who the KPI is assigned to. Can be 'all', a specific role, or 'commander', etc.
 * - specificUsers: An array of User ObjectIds for KPIs assigned to specific users.
 * - createdBy:    The User ObjectId of the creator of the KPI.
 * - deadline:     The deadline for completing the KPI.
 * - createdAt:    Timestamp for when the KPI was created (defaults to now).
 */
const kpiSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the KPI (must be provided)
  description: { type: String }, // Optional description of the KPI
  assignedTo: {
    type: String,
    enum: ['all', 'commander', 'commando', 'special_force', 'soldier'], // Who the KPI is for
    default: 'all',
  },
  specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of specific users (if any)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created the KPI
  deadline: Date, // Optional deadline for the KPI
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

module.exports = mongoose.model('KPI', kpiSchema);
