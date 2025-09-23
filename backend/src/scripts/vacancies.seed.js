import mongoose from 'mongoose';
import { Vacancy } from '../models/vacancy.model.js';
import { Category } from '../models/category.model.js';
import { Company } from '../models/company.model.js';
import dotenv from 'dotenv';

dotenv.config();

const workTypes = ['remote', 'hybrid', 'on-site'];
const employmentTypes = ['full-time', 'part-time', 'contract'];
const currencies = ['USD', 'EUR', 'GBP', 'UZS', 'RUB', 'UAH'];
const levels = ['junior', 'middle', 'senior'];

const salaryRanges = {
  junior: { min: 30000, max: 50000 },
  middle: { min: 50000, max: 80000 },
  senior: { min: 80000, max: 150000 }
};

const commonSkills = {
  'Frontend Development': [
    'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
    'Responsive Design', 'Web Performance', 'Git', 'Webpack', 'Jest'
  ],
  'Backend Development': [
    'Node.js', 'Python', 'Java', 'SQL', 'NoSQL', 'RESTful APIs', 'GraphQL',
    'Docker', 'Kubernetes', 'AWS', 'Microservices', 'System Design'
  ],
  'UI/UX Design': [
    'Figma', 'Sketch', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping',
    'Design Systems', 'Visual Design', 'Interaction Design', 'Usability Testing'
  ],
  'Data Science': [
    'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'Data Visualization',
    'Statistical Analysis', 'TensorFlow', 'PyTorch', 'Big Data'
  ]
};

const levelRequirements = {
  junior: [
    'Basic understanding of core concepts',
    'Eagerness to learn and grow',
    'Good problem-solving skills',
    'Ability to work in a team',
    'Strong communication skills'
  ],
  middle: [
    'Solid understanding of best practices',
    'Ability to mentor junior developers',
    'Strong problem-solving skills',
    'Experience with agile methodologies',
    'Excellent communication skills'
  ],
  senior: [
    'Expert-level knowledge',
    'Proven leadership experience',
    'Architecture and system design expertise',
    'Strong mentoring abilities',
    'Strategic thinking and planning'
  ]
};

const responsibilities = {
  junior: [
    'Assist in development and maintenance tasks',
    'Write clean and maintainable code',
    'Participate in code reviews',
    'Help with testing and debugging',
    'Document code and processes',
    'Learn from senior team members'
  ],
  middle: [
    'Develop and maintain complex features',
    'Write high-quality, scalable code',
    'Conduct code reviews',
    'Mentor junior team members',
    'Contribute to technical decisions',
    'Improve development processes'
  ],
  senior: [
    'Lead technical initiatives and projects',
    'Make architectural decisions',
    'Define coding standards and best practices',
    'Mentor and guide the team',
    'Drive innovation and improvements',
    'Collaborate with stakeholders'
  ]
};

const languageLevels = {
  junior: [
    { language: 'English', level: 'intermediate' }
  ],
  middle: [
    { language: 'English', level: 'fluent' }
  ],
  senior: [
    { language: 'English', level: 'fluent' },
    { language: 'Local Language', level: 'intermediate' }
  ]
};

const experienceYears = {
  junior: { min: 0, max: 2 },
  middle: { min: 2, max: 5 },
  senior: { min: 5 }
};

const benefits = [
  '🏥 Comprehensive Health Insurance',
  '💻 Latest Equipment',
  '📚 Learning & Development Budget',
  '🏖️ Flexible PTO',
  '🏋️‍♂️ Gym Membership',
  '🎯 Performance Bonuses',
  '🚀 Stock Options',
  '🍕 Free Meals',
  '🚗 Transportation Allowance',
  '🏠 Remote Work Stipend',
  '🎓 Conference Attendance',
  '👶 Parental Leave',
  '🌴 Remote Work Options',
  '🎓 Professional Certifications',
  '🍎 Healthy Snacks',
  '🎪 Team Building Events'
];

const generateJobDescription = (level, subcategory, company) => {
  const emojiMap = {
    requirements: '📋',
    responsibilities: '💼',
    skills: '🛠️',
    benefits: '🎁',
    experience: '⏳',
    languages: '🌐',
    location: '📍',
    salary: '💰',
    workType: '🏢',
    employmentType: '⌚'
  };

  const levelEmoji = {
    junior: '🌱',
    middle: '⭐',
    senior: '🌟'
  };

  const skills = (commonSkills[subcategory.title[0].value] || [])
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const description = `
${levelEmoji[level]} ${level.toUpperCase()} ${subcategory.title[0].value} POSITION

🏢 About ${company.name}:
${company.description}

${emojiMap.responsibilities} Key Responsibilities:
${responsibilities[level].map(r => `• ${r}`).join('\n')}

${emojiMap.requirements} Requirements:
${levelRequirements[level].map(r => `• ${r}`).join('\n')}

${emojiMap.skills} Technical Skills:
${skills.map(s => `• ${s}`).join('\n')}

${emojiMap.experience} Experience:
${experienceYears[level].min}${experienceYears[level].max ? '-' + experienceYears[level].max : '+'} years of experience in ${subcategory.title[0].value}

${emojiMap.languages} Required Languages:
${languageLevels[level].map(l => `• ${l.language}: ${l.level}`).join('\n')}

${emojiMap.location} Location:
• ${company.location.city}, ${company.location.country}
• ${workTypes[Math.floor(Math.random() * workTypes.length)]} position

${emojiMap.benefits} We Offer:
${benefits.sort(() => Math.random() - 0.5).slice(0, 6).join('\n')}

🤝 Join our team and be part of something extraordinary! We're looking for passionate individuals who want to grow with us and make a real impact.

📌 Important Note:
• Position Level: ${level.charAt(0).toUpperCase() + level.slice(1)}
• Department: ${subcategory.title[0].value}
• Reports to: Team Lead

🌟 Why Join Us:
• Innovation-driven environment
• Collaborative team culture
• Career growth opportunities
• Work-life balance
• Modern tech stack
• Regular feedback and support

📝 Selection Process:
1. Resume screening
2. Technical assessment
3. Team interview
4. Cultural fit interview
5. Final offer

We value diversity and believe in creating an inclusive environment for all employees. If you're passionate about ${subcategory.title[0].value} and want to work with cutting-edge technologies, we'd love to hear from you!

#${subcategory.title[0].value.replace(/\s+/g, '')} #${level} #${company.industry} #Career
`;

  return description;
};

async function seedVacancies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear vacancies collection
    await Vacancy.deleteMany({});
    console.log('Cleared vacancies collection');

    // Get categories and companies
    const categories = await Category.find({}).populate('subcategories');
    const companies = await Company.find({});

    if (categories.length === 0) {
      console.log('No categories found. Please run categories seed first.');
      process.exit(1);
    }

    if (companies.length === 0) {
      console.log('No companies found. Please run companies seed first.');
      process.exit(1);
    }

    // Create vacancies
    const vacancies = [];
    for (const category of categories) {
      // Create 5-7 vacancies for each subcategory
      for (const subcategory of category.subcategories) {
        const numVacancies = Math.floor(Math.random() * 3) + 5; // Random number between 5-7
        
        for (let i = 0; i < numVacancies; i++) {
          const level = levels[Math.floor(Math.random() * levels.length)];
          const salaryRange = salaryRanges[level];
          const company = companies[Math.floor(Math.random() * companies.length)];
          const currency = currencies[Math.floor(Math.random() * currencies.length)];
          const workType = workTypes[Math.floor(Math.random() * workTypes.length)];
          const employmentType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
          
          const description = generateJobDescription(level, subcategory, company);
          
          vacancies.push({
            title: `${level.charAt(0).toUpperCase() + level.slice(1)} ${subcategory.title[0].value}`,
            creator: company.creator,
            company: company._id,
            category: category._id,
            subcategory: subcategory._id,
            description,
            requirements: levelRequirements[level],
            responsibilities: responsibilities[level],
            skills: (commonSkills[subcategory.title[0].value] || [])
              .sort(() => Math.random() - 0.5)
              .slice(0, 6),
            experience: experienceYears[level],
            salary: {
              min: salaryRange.min,
              max: salaryRange.max,
              currency,
              isNegotiable: Math.random() > 0.5
            },
            employmentType,
            workType,
            location: {
              country: company.location.country,
              city: company.location.city,
              address: company.location.address
            },
            status: 'active',
            benefits: benefits.sort(() => Math.random() - 0.5).slice(0, 6),
            languages: languageLevels[level],
            deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within next 30 days
          });
        }
      }
    }

    await Vacancy.create(vacancies);
    console.log(`Created ${vacancies.length} vacancies`);

    console.log('Vacancies seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Vacancies seed failed:', error);
    process.exit(1);
  }
}

seedVacancies();
