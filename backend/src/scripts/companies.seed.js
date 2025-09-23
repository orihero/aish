import mongoose from 'mongoose';
import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const companies = [
  {
    name: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    description: 'Leading provider of innovative software solutions',
    industry: 'Technology',
    size: '201-1000',
    founded: 2010,
    website: 'https://techcorp.example.com',
    location: {
      country: 'United States',
      city: 'San Francisco',
      address: '123 Tech Street'
    },
    contact: {
      email: 'careers@techcorp.example.com',
      phone: '+1 (555) 123-4567'
    },
    social: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp'
    },
    benefits: [
      'Health Insurance',
      'Remote Work',
      'Professional Development',
      'Stock Options'
    ]
  },
  {
    name: 'Design Masters',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop',
    description: 'Creative design studio specializing in digital experiences',
    industry: 'Design',
    size: '51-200',
    founded: 2015,
    website: 'https://designmasters.example.com',
    location: {
      country: 'United Kingdom',
      city: 'London',
      address: '45 Creative Avenue'
    },
    contact: {
      email: 'jobs@designmasters.example.com',
      phone: '+44 20 7123 4567'
    },
    social: {
      linkedin: 'https://linkedin.com/company/designmasters',
      instagram: 'https://instagram.com/designmasters'
    },
    benefits: [
      'Flexible Hours',
      'Creative Workspace',
      'Learning Budget',
      'Health Benefits'
    ]
  },
  {
    name: 'Marketing Pro',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    description: 'Digital marketing agency driving growth for businesses',
    industry: 'Marketing',
    size: '51-200',
    founded: 2012,
    website: 'https://marketingpro.example.com',
    location: {
      country: 'Canada',
      city: 'Toronto',
      address: '789 Marketing Street'
    },
    contact: {
      email: 'careers@marketingpro.example.com',
      phone: '+1 (416) 555-7890'
    },
    social: {
      linkedin: 'https://linkedin.com/company/marketingpro',
      twitter: 'https://twitter.com/marketingpro'
    },
    benefits: [
      'Performance Bonuses',
      'Work from Home',
      'Training Programs',
      'Team Events'
    ]
  },
  {
    name: 'DataTech Analytics',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
    description: 'Leading data analytics and machine learning solutions provider',
    industry: 'Technology',
    size: '201-1000',
    founded: 2014,
    website: 'https://datatech.example.com',
    location: {
      country: 'United States',
      city: 'Boston',
      address: '456 Data Drive'
    },
    contact: {
      email: 'careers@datatech.example.com',
      phone: '+1 (617) 555-0123'
    },
    social: {
      linkedin: 'https://linkedin.com/company/datatech',
      twitter: 'https://twitter.com/datatech'
    },
    benefits: [
      'Competitive Salary',
      'Health Insurance',
      'Remote Work Options',
      'Professional Development',
      'Stock Options'
    ]
  },
  {
    name: 'HR Solutions',
    logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop',
    description: 'Innovative HR and recruitment solutions provider',
    industry: 'Human Resources',
    size: '51-200',
    founded: 2016,
    website: 'https://hrsolutions.example.com',
    location: {
      country: 'United Kingdom',
      city: 'Manchester',
      address: '789 HR Street'
    },
    contact: {
      email: 'jobs@hrsolutions.example.com',
      phone: '+44 161 555 0123'
    },
    social: {
      linkedin: 'https://linkedin.com/company/hrsolutions',
      twitter: 'https://twitter.com/hrsolutions'
    },
    benefits: [
      'Flexible Hours',
      'Health Benefits',
      'Professional Development',
      'Team Building Events'
    ]
  }
];

async function seedCompanies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear companies collection
    await Company.deleteMany({});
    console.log('Cleared companies collection');

    // Get employer users to assign as creators
    const employerUsers = await User.find({ role: 'employer' });
    
    if (employerUsers.length === 0) {
      console.log('No employer users found. Please run users seed first.');
      process.exit(1);
    }

    // Create companies
    const createdCompanies = await Promise.all(
      companies.map((company, index) => Company.create({
        ...company,
        creator: employerUsers[index % employerUsers.length]._id
      }))
    );

    console.log(`Created ${createdCompanies.length} companies`);
    createdCompanies.forEach(company => {
      console.log(`- ${company.name} (${company.industry})`);
    });

    console.log('Companies seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Companies seed failed:', error);
    process.exit(1);
  }
}

seedCompanies();
