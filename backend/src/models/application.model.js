import mongoose from 'mongoose';

const evaluationItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  scoreBase: {
    type: Number,
    required: true,
    default: 10
  }
}, { _id: false });

const evaluationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  scoreBase: {
    type: Number,
    required: true,
    default: 10
  },
  items: [evaluationItemSchema]
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected', 'invitation', 'ai-rejected', 'ai-reviewed'],
    default: 'pending'
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  // New evaluation fields
  evaluations: [evaluationSchema],
  evaluationSummary: {
    type: String,
    default: ''
  },
  totalEvaluationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ user: 1, job: 1 }, { unique: true });
applicationSchema.index({ totalEvaluationScore: -1 }); // For sorting by evaluation score

export const Application = mongoose.model('Application', applicationSchema); 