import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'UZS', 'RUB', 'UAH']
    }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    required: true
  },
  workType: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Vacancy = mongoose.model('Vacancy', vacancySchema);