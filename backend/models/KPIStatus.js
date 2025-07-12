const mongoose = require('mongoose');

const kpiStatusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kpi: { type: mongoose.Schema.Types.ObjectId, ref: 'KPI', required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'done'],
    default: 'pending',
  },
  markedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('KPIStatus', kpiStatusSchema);
