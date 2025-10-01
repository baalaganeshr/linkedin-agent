const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  linkedinId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  fullName: { type: String, required: true },
  profilePicture: String,
  subscriptionStatus: { type: String, enum: ['free', 'premium'], default: 'free' },
  linkedinProfile: {
    headline: String,
    summary: String,
    experience: [{ title: String, company: String, duration: String }],
    education: [{ institution: String, degree: String, field: String }],
    skills: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);