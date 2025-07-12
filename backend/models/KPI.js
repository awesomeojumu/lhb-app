const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: {
    type: String,
    enum: ['all', 'commander', 'commando', 'special_force', 'soldier'],
    default: 'all',
  },
  specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('KPI', kpiSchema);
