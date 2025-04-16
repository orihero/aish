import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Company } from '../models/company.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import Skill from '../models/skill.model.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    title: [
      { language: 'en', value: 'Software Development' },
      { language: 'ru', value: 'Разработка программного обеспечения' },
      { language: 'uk', value: 'Розробка програмного забезпечення' },
      { language: 'uz', value: 'Dasturiy ta\'minot ishlab chiqish' }
    ],
    icon: 'Code',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Frontend Development' },
          { language: 'ru', value: 'Фронтенд разработка' },
          { language: 'uk', value: 'Фронтенд розробка' },
          { language: 'uz', value: 'Frontend dasturlash' }
        ],
        icon: 'Layout'
      },
      {
        title: [
          { language: 'en', value: 'Backend Development' },
          { language: 'ru', value: 'Бэкенд разработка' },
          { language: 'uk', value: 'Бекенд розробка' },
          { language: 'uz', value: 'Backend dasturlash' }
        ],
        icon: 'Database'
      },
      {
        title: [
          { language: 'en', value: 'Mobile Development' },
          { language: 'ru', value: 'Мобильная разработка' },
          { language: 'uk', value: 'Мобільна розробка' },
          { language: 'uz', value: 'Mobil dasturlash' }
        ],
        icon: 'Smartphone'
      },
      {
        title: [
          { language: 'en', value: 'DevOps Engineering' },
          { language: 'ru', value: 'DevOps инженерия' },
          { language: 'uk', value: 'DevOps інженерія' },
          { language: 'uz', value: 'DevOps muhandisligi' }
        ],
        icon: 'Settings'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Design' },
      { language: 'ru', value: 'Дизайн' },
      { language: 'uk', value: 'Дизайн' },
      { language: 'uz', value: 'Dizayn' }
    ],
    icon: 'Palette',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'UI/UX Design' },
          { language: 'ru', value: 'UI/UX Дизайн' },
          { language: 'uk', value: 'UI/UX Дизайн' },
          { language: 'uz', value: 'UI/UX Dizayn' }
        ],
        icon: 'Figma'
      },
      {
        title: [
          { language: 'en', value: 'Graphic Design' },
          { language: 'ru', value: 'Графический дизайн' },
          { language: 'uk', value: 'Графічний дизайн' },
          { language: 'uz', value: 'Grafik dizayn' }
        ],
        icon: 'Image'
      },
      {
        title: [
          { language: 'en', value: 'Motion Design' },
          { language: 'ru', value: 'Моушн дизайн' },
          { language: 'uk', value: 'Моушн дизайн' },
          { language: 'uz', value: 'Motion dizayn' }
        ],
        icon: 'Video'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Marketing' },
      { language: 'ru', value: 'Маркетинг' },
      { language: 'uk', value: 'Маркетинг' },
      { language: 'uz', value: 'Marketing' }
    ],
    icon: 'TrendingUp',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Digital Marketing' },
          { language: 'ru', value: 'Цифровой маркетинг' },
          { language: 'uk', value: 'Цифровий маркетинг' },
          { language: 'uz', value: 'Raqamli marketing' }
        ],
        icon: 'Globe'
      },
      {
        title: [
          { language: 'en', value: 'Content Marketing' },
          { language: 'ru', value: 'Контент-маркетинг' },
          { language: 'uk', value: 'Контент-маркетинг' },
          { language: 'uz', value: 'Kontent marketing' }
        ],
        icon: 'FileText'
      },
      {
        title: [
          { language: 'en', value: 'Social Media Marketing' },
          { language: 'ru', value: 'Маркетинг в социальных сетях' },
          { language: 'uk', value: 'Маркетинг у соціальних мережах' },
          { language: 'uz', value: 'Ijtimoiy media marketing' }
        ],
        icon: 'Share2'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Data Science & Analytics' },
      { language: 'ru', value: 'Наука о данных и аналитика' },
      { language: 'uk', value: 'Наука про дані та аналітика' },
      { language: 'uz', value: 'Data fanlari va tahlil' }
    ],
    icon: 'BarChart2',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Data Science' },
          { language: 'ru', value: 'Наука о данных' },
          { language: 'uk', value: 'Наука про дані' },
          { language: 'uz', value: 'Data fanlari' }
        ],
        icon: 'Brain'
      },
      {
        title: [
          { language: 'en', value: 'Data Engineering' },
          { language: 'ru', value: 'Инженерия данных' },
          { language: 'uk', value: 'Інженерія даних' },
          { language: 'uz', value: 'Data muhandisligi' }
        ],
        icon: 'Database'
      },
      {
        title: [
          { language: 'en', value: 'Business Intelligence' },
          { language: 'ru', value: 'Бизнес-аналитика' },
          { language: 'uk', value: 'Бізнес-аналітика' },
          { language: 'uz', value: 'Biznes tahlili' }
        ],
        icon: 'PieChart'
      },
      {
        title: [
          { language: 'en', value: 'Machine Learning' },
          { language: 'ru', value: 'Машинное обучение' },
          { language: 'uk', value: 'Машинне навчання' },
          { language: 'uz', value: 'Mashinali o\'rganish' }
        ],
        icon: 'Network'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Product Management' },
      { language: 'ru', value: 'Управление продуктом' },
      { language: 'uk', value: 'Управління продуктом' },
      { language: 'uz', value: 'Mahsulot boshqaruvi' }
    ],
    icon: 'Box',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Product Strategy' },
          { language: 'ru', value: 'Продуктовая стратегия' },
          { language: 'uk', value: 'Продуктова стратегія' },
          { language: 'uz', value: 'Mahsulot strategiyasi' }
        ],
        icon: 'Target'
      },
      {
        title: [
          { language: 'en', value: 'Product Analytics' },
          { language: 'ru', value: 'Продуктовая аналитика' },
          { language: 'uk', value: 'Продуктова аналітика' },
          { language: 'uz', value: 'Mahsulot tahlili' }
        ],
        icon: 'LineChart'
      },
      {
        title: [
          { language: 'en', value: 'Product Marketing' },
          { language: 'ru', value: 'Продуктовый маркетинг' },
          { language: 'uk', value: 'Продуктовий маркетинг' },
          { language: 'uz', value: 'Mahsulot marketingi' }
        ],
        icon: 'Megaphone'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Quality Assurance' },
      { language: 'ru', value: 'Контроль качества' },
      { language: 'uk', value: 'Контроль якості' },
      { language: 'uz', value: 'Sifat nazorati' }
    ],
    icon: 'CheckCircle',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Manual Testing' },
          { language: 'ru', value: 'Ручное тестирование' },
          { language: 'uk', value: 'Ручне тестування' },
          { language: 'uz', value: 'Qo\'lda testlash' }
        ],
        icon: 'ClipboardCheck'
      },
      {
        title: [
          { language: 'en', value: 'Automation Testing' },
          { language: 'ru', value: 'Автоматизированное тестирование' },
          { language: 'uk', value: 'Автоматизоване тестування' },
          { language: 'uz', value: 'Avtomatik testlash' }
        ],
        icon: 'Terminal'
      },
      {
        title: [
          { language: 'en', value: 'Performance Testing' },
          { language: 'ru', value: 'Нагрузочное тестирование' },
          { language: 'uk', value: 'Навантажувальне тестування' },
          { language: 'uz', value: 'Samaradorlik testlash' }
        ],
        icon: 'Activity'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Security' },
      { language: 'ru', value: 'Безопасность' },
      { language: 'uk', value: 'Безпека' },
      { language: 'uz', value: 'Xavfsizlik' }
    ],
    icon: 'Shield',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Security Engineering' },
          { language: 'ru', value: 'Инженерия безопасности' },
          { language: 'uk', value: 'Інженерія безпеки' },
          { language: 'uz', value: 'Xavfsizlik muhandisligi' }
        ],
        icon: 'Lock'
      },
      {
        title: [
          { language: 'en', value: 'Security Analysis' },
          { language: 'ru', value: 'Анализ безопасности' },
          { language: 'uk', value: 'Аналіз безпеки' },
          { language: 'uz', value: 'Xavfsizlik tahlili' }
        ],
        icon: 'Search'
      },
      {
        title: [
          { language: 'en', value: 'Penetration Testing' },
          { language: 'ru', value: 'Тестирование на проникновение' },
          { language: 'uk', value: 'Тестування на проникнення' },
          { language: 'uz', value: 'Penetratsion testlash' }
        ],
        icon: 'Key'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Project Management' },
      { language: 'ru', value: 'Управление проектами' },
      { language: 'uk', value: 'Управління проектами' },
      { language: 'uz', value: 'Loyiha boshqaruvi' }
    ],
    icon: 'Trello',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Agile Project Management' },
          { language: 'ru', value: 'Agile управление проектами' },
          { language: 'uk', value: 'Agile управління проектами' },
          { language: 'uz', value: 'Agile loyiha boshqaruvi' }
        ],
        icon: 'GitBranch'
      },
      {
        title: [
          { language: 'en', value: 'Scrum Master' },
          { language: 'ru', value: 'Скрам-мастер' },
          { language: 'uk', value: 'Скрам-майстер' },
          { language: 'uz', value: 'Scrum ustasi' }
        ],
        icon: 'Users'
      },
      {
        title: [
          { language: 'en', value: 'Project Coordination' },
          { language: 'ru', value: 'Координация проектов' },
          { language: 'uk', value: 'Координація проектів' },
          { language: 'uz', value: 'Loyiha muvofiqlashtirish' }
        ],
        icon: 'GitMerge'
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Business Analysis' },
      { language: 'ru', value: 'Бизнес-анализ' },
      { language: 'uk', value: 'Бізнес-аналіз' },
      { language: 'uz', value: 'Biznes tahlil' }
    ],
    icon: 'Briefcase',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Business Process Analysis' },
          { language: 'ru', value: 'Анализ бизнес-процессов' },
          { language: 'uk', value: 'Аналіз бізнес-процесів' },
          { language: 'uz', value: 'Biznes jarayonlarini tahlil qilish' }
        ],
        icon: 'GitPullRequest'
      },
      {
        title: [
          { language: 'en', value: 'Requirements Analysis' },
          { language: 'ru', value: 'Анализ требований' },
          { language: 'uk', value: 'Аналіз вимог' },
          { language: 'uz', value: 'Talablarni tahlil qilish' }
        ],
        icon: 'FileText'
      },
      {
        title: [
          { language: 'en', value: 'Data Analysis' },
          { language: 'ru', value: 'Анализ данных' },
          { language: 'uk', value: 'Аналіз даних' },
          { language: 'uz', value: 'Ma\'lumotlarni tahlil qilish' }
        ],
        icon: 'BarChart'
      }
    ]
  }
];

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

const jobDescriptions = {
  'Frontend Development': {
    junior: `We are seeking a passionate Junior Frontend Developer to join our dynamic team and contribute to building exceptional user interfaces. As a Junior Frontend Developer, you will have the opportunity to work on exciting projects while learning from experienced developers.

Key Responsibilities:
• Implement responsive web designs using HTML5, CSS3, and modern JavaScript
• Collaborate with designers to translate UI/UX designs into functional code
• Write clean, maintainable, and reusable code following best practices
• Participate in code reviews and team discussions
• Debug and fix frontend-related issues
• Learn and adapt to new technologies and frameworks

Required Skills:
• Solid understanding of HTML5, CSS3, and JavaScript fundamentals
• Basic knowledge of modern frontend frameworks (React, Vue, or Angular)
• Familiarity with responsive design principles
• Understanding of cross-browser compatibility issues
• Basic knowledge of version control systems (Git)
• Good problem-solving skills and attention to detail

Nice to Have:
• Experience with CSS preprocessors (Sass/Less)
• Basic understanding of build tools (Webpack, Vite)
• Knowledge of TypeScript
• Experience with UI component libraries
• Understanding of web accessibility standards

What We Offer:
• Mentorship from experienced developers
• Regular training and learning opportunities
• Modern tech stack and tools
• Friendly and collaborative team environment
• Flexible working hours
• Competitive salary and benefits package`,

    middle: `We are looking for a skilled Middle Frontend Developer to join our team and help create outstanding web applications. The ideal candidate will have strong experience with modern JavaScript frameworks and a passion for creating exceptional user experiences.

Key Responsibilities:
• Develop and maintain complex frontend applications using React/Vue.js
• Architect scalable and maintainable frontend solutions
• Optimize application performance and loading times
• Implement complex UI components and interactive features
• Write unit tests and maintain test coverage
• Mentor junior developers and participate in code reviews
• Collaborate with backend developers for API integration

Required Skills:
• 3+ years of frontend development experience
• Strong proficiency in React or Vue.js ecosystem
• Deep understanding of JavaScript/TypeScript
• Experience with state management solutions (Redux, Vuex)
• Solid knowledge of modern frontend build tools
• Experience with responsive and mobile-first development
• Strong understanding of web performance optimization

Nice to Have:
• Experience with Next.js or similar SSR frameworks
• Knowledge of GraphQL and Apollo
• Experience with micro-frontend architecture
• Familiarity with CI/CD pipelines
• Understanding of containerization (Docker)

What We Offer:
• Challenging projects with modern tech stack
• Professional development opportunities
• Remote work options
• Health insurance and wellness programs
• Regular team building events
• Competitive salary and bonuses`,

    senior: `We are seeking an experienced Senior Frontend Developer to lead our frontend development efforts and drive technical excellence. The ideal candidate will have extensive experience in building large-scale web applications and a proven track record of technical leadership.

Key Responsibilities:
• Lead the architecture and development of complex frontend applications
• Establish frontend development standards and best practices
• Make high-level technical decisions and technology choices
• Mentor and guide the development team
• Review and approve technical designs
• Drive innovation and adoption of new technologies
• Collaborate with product managers and stakeholders

Required Skills:
• 5+ years of frontend development experience
• Expert knowledge of React/Vue.js and their ecosystems
• Strong understanding of frontend architecture patterns
• Experience with micro-frontend architecture
• Deep knowledge of performance optimization techniques
• Experience with build tools and deployment processes
• Strong leadership and communication skills

Nice to Have:
• Experience with multiple frontend frameworks
• Knowledge of backend development
• Understanding of cloud services (AWS/GCP)
• Experience with WebAssembly
• Contributions to open-source projects

What We Offer:
• Leadership role in technical decisions
• Opportunity to shape product architecture
• Competitive salary package
• Stock options
• Premium health insurance
• Professional development budget
• Flexible work arrangements`
  },
  'UI/UX Design': {
    junior: `Join our creative team as a Junior UI/UX Designer and help create beautiful, user-friendly digital experiences. This is an excellent opportunity to grow your design skills while working on meaningful projects.

Key Responsibilities:
• Create wireframes, mockups, and prototypes
• Assist in user research and usability testing
• Design responsive interfaces for web and mobile applications
• Collaborate with developers to ensure design feasibility
• Maintain design system consistency

Required Skills:
• Basic knowledge of design tools (Figma, Sketch)
• Understanding of UI/UX principles
• Basic prototyping skills
• Good eye for typography and color
• Ability to take feedback constructively

What We Offer:
• Mentorship from senior designers
• Creative freedom
• Modern design tools
• Collaborative environment
• Learning opportunities`,

    senior: `Lead our design team as a Senior UI/UX Designer, shaping the future of our digital products. We're looking for someone who can combine creativity with strategic thinking.

Key Responsibilities:
• Lead the design strategy for major projects
• Mentor junior designers
• Conduct user research and testing
• Create and maintain design systems
• Collaborate with stakeholders

Required Skills:
• 5+ years of UI/UX design experience
• Expert in design tools and prototyping
• Strong portfolio of web/mobile projects
• Experience with design systems
• Team leadership experience

What We Offer:
• Creative leadership role
• Top-tier design tools
• Competitive compensation
• Remote work options
• Professional development`
  }
};

const workTypes = ['remote', 'hybrid', 'onsite'];
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

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Company.deleteMany({}),
      Vacancy.deleteMany({})
    ]);
    console.log('Cleared all collections');

    // Create test users
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    const employerUsers = await Promise.all([
      User.create({
        email: 'employer1@example.com',
        password: 'employer123',
        firstName: 'John',
        lastName: 'Employer',
        role: 'employer'
      }),
      User.create({
        email: 'employer2@example.com',
        password: 'employer123',
        firstName: 'Jane',
        lastName: 'Employer',
        role: 'employer'
      })
    ]);

    console.log('Created test users');

    // Create categories
    const createdCategories = await Category.create(categories);
    console.log('Created categories');

    // Create companies
    const createdCompanies = await Promise.all(
      companies.map((company, index) => Company.create({
        ...company,
        creator: employerUsers[index % employerUsers.length]._id
      }))
    );
    console.log('Created companies');

    // Create vacancies
    const vacancies = [];
    for (const category of createdCategories) {
      // Create 5-7 vacancies for each subcategory
      for (const subcategory of category.subcategories) {
        const numVacancies = Math.floor(Math.random() * 3) + 5; // Random number between 5-7
        
        for (let i = 0; i < numVacancies; i++) {
          const level = levels[Math.floor(Math.random() * levels.length)];
          const salaryRange = salaryRanges[level];
          const company = createdCompanies[Math.floor(Math.random() * createdCompanies.length)];
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
    console.log('Created vacancies');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();