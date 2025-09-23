import mongoose from 'mongoose';
import { Category } from '../models/category.model.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    title: [
      { language: 'en', value: 'Information Technology' },
      { language: 'ru', value: 'Информационные технологии' },
      { language: 'uz', value: 'Axborot texnologiyalari' }
    ],
    icon: 'Monitor',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Frontend Development' },
          { language: 'ru', value: 'Фронтенд разработка' },
          { language: 'uz', value: 'Frontend dasturlash' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Backend Development' },
          { language: 'ru', value: 'Бэкенд разработка' },
          { language: 'uz', value: 'Backend dasturlash' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Full Stack Development' },
          { language: 'ru', value: 'Фуллстек разработка' },
          { language: 'uz', value: 'Full Stack dasturlash' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Mobile Development' },
          { language: 'ru', value: 'Мобильная разработка' },
          { language: 'uz', value: 'Mobil dasturlash' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'DevOps' },
          { language: 'ru', value: 'DevOps' },
          { language: 'uz', value: 'DevOps' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Data Science' },
          { language: 'ru', value: 'Наука о данных' },
          { language: 'uz', value: 'Ma\'lumotlar fanlari' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'UI/UX Design' },
          { language: 'ru', value: 'UI/UX дизайн' },
          { language: 'uz', value: 'UI/UX dizayn' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'QA Testing' },
          { language: 'ru', value: 'QA тестирование' },
          { language: 'uz', value: 'QA testlash' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Marketing' },
      { language: 'ru', value: 'Маркетинг' },
      { language: 'uz', value: 'Marketing' }
    ],
    icon: 'TrendingUp',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Digital Marketing' },
          { language: 'ru', value: 'Цифровой маркетинг' },
          { language: 'uz', value: 'Raqamli marketing' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Content Marketing' },
          { language: 'ru', value: 'Контент-маркетинг' },
          { language: 'uz', value: 'Kontent marketing' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Social Media Marketing' },
          { language: 'ru', value: 'Маркетинг в социальных сетях' },
          { language: 'uz', value: 'Ijtimoiy tarmoqlar marketingi' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'SEO/SEM' },
          { language: 'ru', value: 'SEO/SEM' },
          { language: 'uz', value: 'SEO/SEM' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Email Marketing' },
          { language: 'ru', value: 'Email маркетинг' },
          { language: 'uz', value: 'Email marketing' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Finance' },
      { language: 'ru', value: 'Финансы' },
      { language: 'uz', value: 'Moliya' }
    ],
    icon: 'DollarSign',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Accounting' },
          { language: 'ru', value: 'Бухгалтерия' },
          { language: 'uz', value: 'Buxgalteriya' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Banking' },
          { language: 'ru', value: 'Банковское дело' },
          { language: 'uz', value: 'Bank ishi' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Investment' },
          { language: 'ru', value: 'Инвестиции' },
          { language: 'uz', value: 'Investitsiya' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Insurance' },
          { language: 'ru', value: 'Страхование' },
          { language: 'uz', value: 'Sug\'urta' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Healthcare' },
      { language: 'ru', value: 'Здравоохранение' },
      { language: 'uz', value: 'Sog\'liqni saqlash' }
    ],
    icon: 'Heart',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Medicine' },
          { language: 'ru', value: 'Медицина' },
          { language: 'uz', value: 'Tibbiyot' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Nursing' },
          { language: 'ru', value: 'Сестринское дело' },
          { language: 'uz', value: 'Hamshiralik ishi' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Pharmacy' },
          { language: 'ru', value: 'Фармация' },
          { language: 'uz', value: 'Farmatsiya' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Mental Health' },
          { language: 'ru', value: 'Психическое здоровье' },
          { language: 'uz', value: 'Ruhiy salomatlik' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Education' },
      { language: 'ru', value: 'Образование' },
      { language: 'uz', value: 'Ta\'lim' }
    ],
    icon: 'GraduationCap',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Teaching' },
          { language: 'ru', value: 'Преподавание' },
          { language: 'uz', value: 'O\'qitish' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Administration' },
          { language: 'ru', value: 'Администрация' },
          { language: 'uz', value: 'Ma\'muriyat' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Research' },
          { language: 'ru', value: 'Исследования' },
          { language: 'uz', value: 'Tadqiqot' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Training' },
          { language: 'ru', value: 'Обучение' },
          { language: 'uz', value: 'Trening' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Sales' },
      { language: 'ru', value: 'Продажи' },
      { language: 'uz', value: 'Sotish' }
    ],
    icon: 'ShoppingCart',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Retail Sales' },
          { language: 'ru', value: 'Розничные продажи' },
          { language: 'uz', value: 'Chakana sotish' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'B2B Sales' },
          { language: 'ru', value: 'B2B продажи' },
          { language: 'uz', value: 'B2B sotish' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Account Management' },
          { language: 'ru', value: 'Управление счетами' },
          { language: 'uz', value: 'Hisob boshqaruvi' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Business Development' },
          { language: 'ru', value: 'Развитие бизнеса' },
          { language: 'uz', value: 'Biznes rivojlantirish' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Human Resources' },
      { language: 'ru', value: 'Человеческие ресурсы' },
      { language: 'uz', value: 'Inson resurslari' }
    ],
    icon: 'Users',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Recruitment' },
          { language: 'ru', value: 'Рекрутинг' },
          { language: 'uz', value: 'Rekrutment' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Training & Development' },
          { language: 'ru', value: 'Обучение и развитие' },
          { language: 'uz', value: 'O\'qitish va rivojlantirish' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Compensation & Benefits' },
          { language: 'ru', value: 'Компенсации и льготы' },
          { language: 'uz', value: 'Kompensatsiya va imtiyozlar' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Employee Relations' },
          { language: 'ru', value: 'Отношения с сотрудниками' },
          { language: 'uz', value: 'Xodimlar bilan munosabatlar' }
        ]
      }
    ]
  },
  {
    title: [
      { language: 'en', value: 'Operations' },
      { language: 'ru', value: 'Операции' },
      { language: 'uz', value: 'Operatsiyalar' }
    ],
    icon: 'Settings',
    subcategories: [
      {
        title: [
          { language: 'en', value: 'Supply Chain' },
          { language: 'ru', value: 'Цепочка поставок' },
          { language: 'uz', value: 'Ta\'minot zanjiri' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Logistics' },
          { language: 'ru', value: 'Логистика' },
          { language: 'uz', value: 'Logistika' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Quality Control' },
          { language: 'ru', value: 'Контроль качества' },
          { language: 'uz', value: 'Sifat nazorati' }
        ]
      },
      {
        title: [
          { language: 'en', value: 'Project Management' },
          { language: 'ru', value: 'Управление проектами' },
          { language: 'uz', value: 'Loyiha boshqaruvi' }
        ]
      }
    ]
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear categories collection
    await Category.deleteMany({});
    console.log('Cleared categories collection');

    // Create categories
    const createdCategories = await Category.create(categories);
    console.log(`Created ${createdCategories.length} categories`);

    console.log('Categories seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Categories seed failed:', error);
    process.exit(1);
  }
}

seedCategories();
