import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Company } from '../models/company.model.js';
import { Vacancy } from '../models/vacancy.model.js';

dotenv.config();

const categories = [
  {
    title: [{ language: 'en', value: 'Software Development' }],
    icon: 'Code',
    subcategories: [
      { title: [{ language: 'en', value: 'Frontend Development' }], icon: 'Layout' },
      { title: [{ language: 'en', value: 'Backend Development' }], icon: 'Database' },
      { title: [{ language: 'en', value: 'Mobile Development' }], icon: 'Smartphone' },
      { title: [{ language: 'en', value: 'DevOps' }], icon: 'Settings' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Design' }],
    icon: 'Palette',
    subcategories: [
      { title: [{ language: 'en', value: 'UI/UX Design' }], icon: 'Figma' },
      { title: [{ language: 'en', value: 'Graphic Design' }], icon: 'Image' },
      { title: [{ language: 'en', value: 'Motion Design' }], icon: 'Video' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Marketing' }],
    icon: 'TrendingUp',
    subcategories: [
      { title: [{ language: 'en', value: 'Digital Marketing' }], icon: 'Globe' },
      { title: [{ language: 'en', value: 'Content Marketing' }], icon: 'FileText' },
      { title: [{ language: 'en', value: 'Social Media' }], icon: 'Share2' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Sales' }],
    icon: 'DollarSign',
    subcategories: [
      { title: [{ language: 'en', value: 'Business Development' }], icon: 'Briefcase' },
      { title: [{ language: 'en', value: 'Account Management' }], icon: 'Users' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Customer Service' }],
    icon: 'Headphones',
    subcategories: [
      { title: [{ language: 'en', value: 'Customer Support' }], icon: 'MessageCircle' },
      { title: [{ language: 'en', value: 'Technical Support' }], icon: 'Tool' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Data' }],
    icon: 'BarChart2',
    subcategories: [
      { title: [{ language: 'en', value: 'Data Analysis' }], icon: 'PieChart' },
      { title: [{ language: 'en', value: 'Data Science' }], icon: 'Activity' },
      { title: [{ language: 'en', value: 'Machine Learning' }], icon: 'Brain' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Human Resources' }],
    icon: 'Users',
    subcategories: [
      { title: [{ language: 'en', value: 'Recruitment' }], icon: 'UserPlus' },
      { title: [{ language: 'en', value: 'HR Management' }], icon: 'ClipboardList' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Project Management' }],
    icon: 'Target',
    subcategories: [
      { title: [{ language: 'en', value: 'Agile' }], icon: 'GitBranch' },
      { title: [{ language: 'en', value: 'Scrum Master' }], icon: 'Clock' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Finance' }],
    icon: 'DollarSign',
    subcategories: [
      { title: [{ language: 'en', value: 'Accounting' }], icon: 'Calculator' },
      { title: [{ language: 'en', value: 'Financial Analysis' }], icon: 'TrendingUp' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Legal' }],
    icon: 'Scale',
    subcategories: [
      { title: [{ language: 'en', value: 'Corporate Law' }], icon: 'Building' },
      { title: [{ language: 'en', value: 'Legal Counsel' }], icon: 'FileText' }
    ]
  }
];

const workTypes = ['remote', 'hybrid', 'onsite'];
const employmentTypes = ['full-time', 'part-time', 'contract'];
const currencies = ['USD', 'EUR', 'GBP'];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Company.deleteMany({});
    await Vacancy.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      email: 'admin@admin.com',
      password: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    console.log('Created admin user');

    // Create employer user
    const employer = await User.create({
      email: 'employer@test.com',
      password: 'employer123',
      firstName: 'Employer',
      lastName: 'User',
      role: 'employer'
    });
    console.log('Created employer user');

    // Create test company
    const company = await Company.create({
      name: 'Tech Solutions Inc',
      description: 'Leading technology solutions provider',
      industry: 'Technology',
      size: '201-1000',
      location: {
        country: 'United States',
        city: 'San Francisco'
      },
      contact: {
        email: 'contact@techsolutions.com',
        phone: '+1 (555) 123-4567'
      },
      creator: employer._id
    });
    console.log('Created test company');

    // Create categories and vacancies
    for (const categoryData of categories) {
      const category = await Category.create(categoryData);
      console.log(`Created category: ${categoryData.title[0].value}`);

      // Create vacancies for each subcategory
      for (const subcategory of category.subcategories) {
        // Create 5-10 vacancies for each subcategory
        const numVacancies = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < numVacancies; i++) {
          const minSalary = 50000 + (i * 10000);
          const maxSalary = minSalary + 30000;

          await Vacancy.create({
            title: `${subcategory.title[0].value} Specialist - Level ${i + 1}`,
            creator: employer._id,
            company: company._id,
            category: category._id,
            subcategory: subcategory._id,
            description: `We are looking for a ${subcategory.title[0].value} specialist with ${i + 2} years of experience. The ideal candidate will have strong skills in ${categoryData.title[0].value} and a passion for ${subcategory.title[0].value}.`,
            salary: {
              min: minSalary,
              max: maxSalary,
              currency: currencies[Math.floor(Math.random() * currencies.length)]
            },
            employmentType: employmentTypes[i % employmentTypes.length],
            workType: workTypes[i % workTypes.length]
          });
        }

        console.log(`Created ${numVacancies} vacancies for ${subcategory.title[0].value}`);
      }
    }

    // Print summary
    const categoriesCount = await Category.countDocuments();
    const vacanciesCount = await Vacancy.countDocuments();
    
    console.log('\nSeeding completed successfully!');
    console.log('----------------------------');
    console.log(`Categories created: ${categoriesCount}`);
    console.log(`Total vacancies created: ${vacanciesCount}`);
    console.log('\nYou can now log in with:');
    console.log('Admin: admin@admin.com / admin');
    console.log('Employer: employer@test.com / employer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();