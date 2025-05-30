import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['1-50', '51-200', '201-1000', '1000-5000', '5000+'],
    required: true
  },
  founded: {
    type: Number
  },
  website: {
    type: String
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
  contact: {
    email: {
      type: String,
      required: true
    },
    phone: String
  },
  social: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  benefits: [{
    type: String
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Company = mongoose.model('Company', companySchema);