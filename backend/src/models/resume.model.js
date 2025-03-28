import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cvFile: {
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
  applications: [{
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vacancy'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

export const Resume = mongoose.model('Resume', resumeSchema);