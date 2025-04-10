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
  parsedData: {
    basics: {
      name: String,
      label: String,
      image: String,
      email: String,
      phone: String,
      url: String,
      summary: String,
      location: {
        address: String,
        postalCode: String,
        city: String,
        region: String,
        countryCode: String
      },
      profiles: [{
        network: String,
        username: String,
        url: String
      }]
    },
    work: [{
      name: String,
      position: String,
      url: String,
      startDate: String,
      endDate: String,
      summary: String,
      highlights: [String],
      location: String
    }],
    volunteer: [{
      organization: String,
      position: String,
      url: String,
      startDate: String,
      endDate: String,
      summary: String,
      highlights: [String]
    }],
    education: [{
      institution: String,
      url: String,
      area: String,
      studyType: String,
      startDate: String,
      endDate: String,
      gpa: String,
      courses: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      url: String
    }],
    awards: [{
      title: String,
      date: String,
      awarder: String,
      summary: String
    }],
    publications: [{
      name: String,
      publisher: String,
      releaseDate: String,
      url: String,
      summary: String
    }],
    skills: [{
      name: String,
      level: String,
      keywords: [String]
    }],
    languages: [{
      language: String,
      fluency: String
    }],
    interests: [{
      name: String,
      keywords: [String]
    }],
    projects: [{
      name: String,
      description: String,
      highlights: [String],
      keywords: [String],
      startDate: String,
      url: String
    }],
    references: [{
      name: String,
      reference: String
    }]
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