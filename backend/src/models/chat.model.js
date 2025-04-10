import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['system', 'assistant', 'user'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume.applications'
  },
  vacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy'
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['screening', 'completed', 'rejected'],
    default: 'screening'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  messages: [messageSchema]
}, {
  timestamps: true
});

export const Chat = mongoose.model('Chat', chatSchema);