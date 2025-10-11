// User model for LinkedInScholar platform
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // LinkedIn OAuth data
  linkedinId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Basic profile information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  profilePicture: {
    type: String,
    default: null
  },
  
  // LinkedIn profile data
  linkedinProfile: {
    headline: String,
    summary: String,
    location: String,
    industry: String,
    connections: Number,
    publicProfileUrl: String
  },
  
  // Student-specific information
  studentInfo: {
    college: {
      type: String,
      trim: true,
      maxlength: 100
    },
    graduationYear: {
      type: Number,
      min: 2020,
      max: 2030
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: 100
    },
    currentYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Graduate'],
      default: '1st Year'
    }
  },
  
  // Subscription information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    paymentId: String
  },
  
  // Usage analytics
  usage: {
    resumesGenerated: {
      type: Number,
      default: 0,
      max: 1000 // Reasonable limit
    },
    profileOptimizations: {
      type: Number,
      default: 0,
      max: 1000
    },
    networkingSuggestions: {
      type: Number,
      default: 0,
      max: 1000
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  
  // Settings and preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    weeklyTips: {
      type: Boolean,
      default: true
    },
    networkingReminders: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'auto'],
      default: 'dark'
    }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Security
  lastLoginIP: String,
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  
  // OAuth tokens (encrypted)
  tokens: {
    accessToken: String,
    refreshToken: String,
    tokenExpiry: Date
  }
  
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive data from JSON output
      delete ret.tokens;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
userSchema.index({ linkedinId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'usage.lastActive': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for subscription days remaining
userSchema.virtual('subscriptionDaysRemaining').get(function() {
  if (this.subscription.plan === 'free') return null;
  const now = new Date();
  const endDate = new Date(this.subscription.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Pre-save middleware to update lastActive
userSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.usage.lastActive = new Date();
  }
  next();
});

// Instance method to check if user is premium
userSchema.methods.isPremium = function() {
  return this.subscription.plan === 'premium' && 
         this.subscription.status === 'active' &&
         new Date() < new Date(this.subscription.endDate);
};

// Instance method to check usage limits for free users
userSchema.methods.canUseFeature = function(featureType) {
  if (this.isPremium()) return true;
  
  const limits = {
    resumesGenerated: 3,
    profileOptimizations: 5,
    networkingSuggestions: 10
  };
  
  return this.usage[featureType] < (limits[featureType] || 0);
};

// Instance method to increment usage
userSchema.methods.incrementUsage = function(featureType) {
  if (this.usage[featureType] !== undefined) {
    this.usage[featureType]++;
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to find active premium users
userSchema.statics.findActivePremiumUsers = function() {
  return this.find({
    'subscription.plan': 'premium',
    'subscription.status': 'active',
    'subscription.endDate': { $gt: new Date() }
  });
};

// Static method to find users needing subscription renewal
userSchema.statics.findUsersNeedingRenewal = function(daysBeforeExpiry = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysBeforeExpiry);
  
  return this.find({
    'subscription.plan': 'premium',
    'subscription.status': 'active',
    'subscription.endDate': { 
      $gte: new Date(),
      $lte: futureDate
    }
  });
};

module.exports = mongoose.model('User', userSchema);