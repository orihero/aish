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
  requirements: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    min: {
      type: Number,
      required: true,
      default: 0
    },
    max: {
      type: Number
    }
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
    },
    isNegotiable: {
      type: Boolean,
      default: false
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
  location: {
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: String
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'expired'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date
  },
  benefits: {
    type: [String],
    default: []
  },
  languages: [{
    language: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['basic', 'intermediate', 'fluent', 'native'],
      required: true
    }
  }]
}, {
  timestamps: true
});

// Add index for better search performance
vacancySchema.index({ 
  title: 'text', 
  description: 'text',
  skills: 'text'
});

export const Vacancy = mongoose.model('Vacancy', vacancySchema);