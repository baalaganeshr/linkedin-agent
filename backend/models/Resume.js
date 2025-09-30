// Resume model for AI-generated resumes
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Resume metadata
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  version: {
    type: Number,
    default: 1,
    min: 1
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String
  },
  
  // Professional Summary
  summary: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  
  // Education
  education: [{
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isCurrentlyEnrolled: {
      type: Boolean,
      default: false
    },
    gpa: {
      type: Number,
      min: 0,
      max: 10
    },
    achievements: [String],
    relevantCoursework: [String]
  }],
  
  // Work Experience
  experience: [{
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isCurrentPosition: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      maxlength: 1000
    },
    achievements: [String],
    technologies: [String]
  }],
  
  // Projects
  projects: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    technologies: [String],
    startDate: Date,
    endDate: Date,
    githubUrl: String,
    liveUrl: String,
    achievements: [String]
  }],
  
  // Skills
  skills: {
    technical: [String],
    soft: [String],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
      }
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiryDate: Date,
      credentialUrl: String
    }]
  },
  
  // Additional Sections
  volunteering: [{
    organization: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  
  awards: [{
    title: String,
    issuer: String,
    date: Date,
    description: String
  }],
  
  publications: [{
    title: String,
    publisher: String,
    date: Date,
    url: String,
    description: String
  }],
  
  // AI Generation Data
  aiData: {
    generationPrompt: String,
    targetRole: String,
    targetIndustry: String,
    keywordOptimization: [String],
    atsScore: {
      type: Number,
      min: 0,
      max: 100
    },
    improvements: [String],
    generatedAt: {
      type: Date,
      default: Date.now
    },
    modelUsed: {
      type: String,
      default: 'gemini-pro'
    }
  },
  
  // Template and Formatting
  template: {
    name: {
      type: String,
      default: 'modern'
    },
    colorScheme: {
      type: String,
      default: 'purple'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    }
  },
  
  // Export and Sharing
  exports: [{
    format: {
      type: String,
      enum: ['pdf', 'docx', 'txt'],
      default: 'pdf'
    },
    exportedAt: {
      type: Date,
      default: Date.now
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  }],
  
  shareSettings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareToken: String,
    sharedAt: Date,
    viewCount: {
      type: Number,
      default: 0
    }
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    lastModified: {
      type: Date,
      default: Date.now
    }
  }
  
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
resumeSchema.index({ userId: 1, isActive: 1 });
resumeSchema.index({ createdAt: -1 });
resumeSchema.index({ 'aiData.atsScore': -1 });
resumeSchema.index({ 'shareSettings.shareToken': 1 });

// Virtual for experience duration calculation
resumeSchema.virtual('totalExperienceMonths').get(function() {
  return this.experience.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + Math.max(0, months);
  }, 0);
});

// Virtual for skill count
resumeSchema.virtual('totalSkills').get(function() {
  return (this.skills.technical || []).length + (this.skills.soft || []).length;
});

// Pre-save middleware
resumeSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.analytics.lastModified = new Date();
  }
  next();
});

// Instance methods
resumeSchema.methods.incrementView = function() {
  this.analytics.views++;
  this.analytics.lastViewed = new Date();
  return this.save();
};

resumeSchema.methods.incrementDownload = function(format = 'pdf') {
  this.analytics.downloads++;
  
  // Add to exports array
  this.exports.push({
    format,
    exportedAt: new Date(),
    downloadCount: 1
  });
  
  return this.save();
};

resumeSchema.methods.generateShareToken = function() {
  const crypto = require('crypto');
  this.shareSettings.shareToken = crypto.randomBytes(32).toString('hex');
  this.shareSettings.sharedAt = new Date();
  return this.save();
};

// Static methods
resumeSchema.statics.findByShareToken = function(token) {
  return this.findOne({
    'shareSettings.shareToken': token,
    'shareSettings.isPublic': true,
    isActive: true
  });
};

resumeSchema.statics.findActiveByUser = function(userId) {
  return this.find({
    userId,
    isActive: true
  }).sort({ updatedAt: -1 });
};

resumeSchema.statics.getPopularTemplates = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { 
      _id: '$template.name',
      count: { $sum: 1 },
      avgAtsScore: { $avg: '$aiData.atsScore' }
    }},
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
};

module.exports = mongoose.model('Resume', resumeSchema);