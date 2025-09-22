import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
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
    required: true
  },
  responsibilities: {
    type: [String],
    required: true
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
      required: true
    },
    isNegotiable: {
      type: Boolean,
      default: false
    }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true,
    index: true
  },
  workType: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site'],
    required: true,
    index: true
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
    address: String,
    type: {
      type: String,
      required: true,
      index: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'expired'],
    default: 'active',
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    index: true
  }],
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
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Add index for better search performance
vacancySchema.index({ 
  title: 'text', 
  description: 'text',
  skills: 'text'
});

// Add compound indexes for common query patterns
vacancySchema.index({ status: 1, createdAt: -1 });
vacancySchema.index({ title: 1, description: 1 });
vacancySchema.index({ 'location.country': 1, 'location.city': 1, employmentType: 1, workType: 1 });

export const Vacancy = mongoose.model('Vacancy', vacancySchema);