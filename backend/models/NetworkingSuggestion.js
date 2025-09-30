// Networking suggestions model for AI-powered LinkedIn networking
const mongoose = require('mongoose');

const networkingSuggestionSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Suggestion metadata
  type: {
    type: String,
    enum: [
      'connection_request',
      'message_template',
      'content_engagement',
      'industry_expert',
      'alumni_connection',
      'recruiter_outreach',
      'company_follow',
      'skill_endorsement'
    ],
    required: true,
    index: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'acted_upon', 'expired'],
    default: 'pending',
    index: true
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  
  // Target person/company information
  target: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: String,
    company: String,
    industry: String,
    location: String,
    linkedinUrl: String,
    profilePicture: String,
    mutualConnections: Number,
    connectionDegree: {
      type: String,
      enum: ['1st', '2nd', '3rd', '3rd+'],
      default: '2nd'
    }
  },
  
  // AI-generated suggestion content
  suggestion: {
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    reasoning: {
      type: String,
      maxlength: 500
    },
    actionItems: [String],
    expectedOutcome: String
  },
  
  // Message templates (for connection requests, etc.)
  messageTemplate: {
    subject: String,
    body: {
      type: String,
      maxlength: 2000
    },
    tone: {
      type: String,
      enum: ['professional', 'friendly', 'casual', 'formal'],
      default: 'professional'
    },
    personalization: [String], // Array of personalization points
    callToAction: String
  },
  
  // Timing and scheduling
  timing: {
    suggestedTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'weekend'],
      default: 'afternoon'
    },
    bestDayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    scheduledFor: Date,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  },
  
  // Relevance scoring
  relevanceScore: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    factors: {
      industryMatch: {
        type: Number,
        min: 0,
        max: 100
      },
      skillsMatch: {
        type: Number,
        min: 0,
        max: 100
      },
      locationProximity: {
        type: Number,
        min: 0,
        max: 100
      },
      careerLevel: {
        type: Number,
        min: 0,
        max: 100
      },
      mutualConnections: {
        type: Number,
        min: 0,
        max: 100
      },
      activityLevel: {
        type: Number,
        min: 0,
        max: 100
      }
    }
  },
  
  // AI generation metadata
  aiMetadata: {
    model: {
      type: String,
      default: 'gemini-pro'
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    prompt: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    version: {
      type: String,
      default: '1.0'
    }
  },
  
  // User interaction tracking
  userInteraction: {
    viewedAt: Date,
    viewCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    actionTaken: {
      type: String,
      enum: ['sent_request', 'sent_message', 'followed', 'endorsed', 'none'],
      default: 'none'
    },
    actionTakenAt: Date,
    success: Boolean // Whether the action was successful
  },
  
  // Related suggestions (for batch suggestions)
  relatedSuggestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NetworkingSuggestion'
  }],
  
  // Tags for categorization
  tags: [String],
  
  // Success metrics
  outcomes: {
    connectionAccepted: Boolean,
    messageReplied: Boolean,
    profileViewed: Boolean,
    followedBack: Boolean,
    endorsementReceived: Boolean,
    opportunityCreated: Boolean
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
networkingSuggestionSchema.index({ userId: 1, status: 1 });
networkingSuggestionSchema.index({ userId: 1, type: 1 });
networkingSuggestionSchema.index({ userId: 1, priority: 1 });
networkingSuggestionSchema.index({ 'relevanceScore.overall': -1 });
networkingSuggestionSchema.index({ createdAt: -1 });
networkingSuggestionSchema.index({ 'timing.expiresAt': 1 });
networkingSuggestionSchema.index({ status: 1, 'timing.expiresAt': 1 });

// Virtual for days until expiry
networkingSuggestionSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.timing.expiresAt) return null;
  const now = new Date();
  const expiry = new Date(this.timing.expiresAt);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for success rate calculation
networkingSuggestionSchema.virtual('successScore').get(function() {
  if (!this.outcomes) return 0;
  
  const outcomes = this.outcomes;
  let score = 0;
  let total = 0;
  
  if (outcomes.connectionAccepted) { score += 30; total += 30; }
  if (outcomes.messageReplied) { score += 25; total += 25; }
  if (outcomes.profileViewed) { score += 10; total += 10; }
  if (outcomes.followedBack) { score += 15; total += 15; }
  if (outcomes.endorsementReceived) { score += 10; total += 10; }
  if (outcomes.opportunityCreated) { score += 10; total += 10; }
  
  return total > 0 ? Math.round((score / 100) * 100) : 0;
});

// Pre-save middleware to handle expiry
networkingSuggestionSchema.pre('save', function(next) {
  // Auto-expire old suggestions
  if (this.timing.expiresAt && new Date() > new Date(this.timing.expiresAt)) {
    this.status = 'expired';
  }
  next();
});

// Instance methods
networkingSuggestionSchema.methods.markAsViewed = function() {
  this.userInteraction.viewedAt = new Date();
  this.userInteraction.viewCount++;
  return this.save();
};

networkingSuggestionSchema.methods.recordAction = function(actionType, success = false) {
  this.userInteraction.actionTaken = actionType;
  this.userInteraction.actionTakenAt = new Date();
  this.userInteraction.success = success;
  this.status = 'acted_upon';
  return this.save();
};

networkingSuggestionSchema.methods.rateSuggestion = function(rating, feedback = '') {
  this.userInteraction.rating = rating;
  this.userInteraction.feedback = feedback;
  return this.save();
};

networkingSuggestionSchema.methods.updateOutcome = function(outcomeType, value) {
  if (this.outcomes.hasOwnProperty(outcomeType)) {
    this.outcomes[outcomeType] = value;
    return this.save();
  }
  return Promise.resolve(this);
};

// Static methods
networkingSuggestionSchema.statics.findActiveByUser = function(userId, limit = 10) {
  return this.find({
    userId,
    status: { $in: ['pending', 'accepted'] },
    'timing.expiresAt': { $gt: new Date() }
  })
  .sort({ 'relevanceScore.overall': -1, priority: -1, createdAt: -1 })
  .limit(limit);
};

networkingSuggestionSchema.statics.findByType = function(userId, type, limit = 5) {
  return this.find({
    userId,
    type,
    status: { $in: ['pending', 'accepted'] },
    'timing.expiresAt': { $gt: new Date() }
  })
  .sort({ 'relevanceScore.overall': -1 })
  .limit(limit);
};

networkingSuggestionSchema.statics.getSuccessStats = function(userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: 1 },
        acted: { $sum: { $cond: [{ $eq: ['$status', 'acted_upon'] }, 1, 0] } },
        successful: { $sum: { $cond: ['$userInteraction.success', 1, 0] } },
        avgRating: { $avg: '$userInteraction.rating' },
        avgRelevance: { $avg: '$relevanceScore.overall' }
      }
    },
    {
      $addFields: {
        actionRate: { $divide: ['$acted', '$total'] },
        successRate: { $divide: ['$successful', '$acted'] }
      }
    }
  ]);
};

networkingSuggestionSchema.statics.cleanupExpired = function() {
  return this.updateMany(
    {
      status: { $ne: 'expired' },
      'timing.expiresAt': { $lt: new Date() }
    },
    {
      $set: { status: 'expired' }
    }
  );
};

module.exports = mongoose.model('NetworkingSuggestion', networkingSuggestionSchema);