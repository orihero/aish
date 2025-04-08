import mongoose from 'mongoose';

const telegramSubscriptionSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  preferences: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    applicationUpdates: {
      type: Boolean,
      default: true
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }]
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const TelegramSubscription = mongoose.model('TelegramSubscription', telegramSubscriptionSchema);