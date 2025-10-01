const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: {
    contact: { name: String, email: String, phone: String },
    summary: String,
    education: [mongoose.Schema.Types.Mixed],
    experience: [mongoose.Schema.Types.Mixed],
    skills: { technical: [String], soft: [String] },
    projects: [mongoose.Schema.Types.Mixed]
  },
  aiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);