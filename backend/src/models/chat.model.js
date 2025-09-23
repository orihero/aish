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
  messageType: {
    type: String,
    enum: ['normal', 'apply', 'vacancy_ready', 'vacancy_creation_start', 'vacancy_creation_progress', 'vacancy_creation_complete'],
    default: 'normal'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  vacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy'
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  chatType: {
    type: String,
    enum: ['application_screening', 'vacancy_creation'],
    default: 'application_screening'
  },
  status: {
    type: String,
    enum: ['screening', 'completed', 'rejected', 'ai-rejected', 'ai-reviewed', 'vacancy_creation_in_progress', 'vacancy_creation_completed'],
    default: 'screening'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  vacancyData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  messages: [messageSchema]
}, {
  timestamps: true
});

export const Chat = mongoose.model('Chat', chatSchema);