import { create } from 'zustand';

export type TranslationKey =
  | 'common.welcome'
  | 'common.email'
  | 'common.password'
  | 'common.login'
  | 'common.register'
  | 'common.loading'
  | 'common.or'
  | 'common.rememberMe'
  | 'common.forgotPassword'
  | 'common.search'
  | 'common.cancel'
  | 'common.save'
  | 'common.delete'
  | 'common.edit'
  | 'common.view'
  | 'common.export'
  | 'common.add'
  | 'common.filters'
  | 'common.clearAll'
  | 'dashboard.welcome'
  | 'dashboard.businessOverview'
  | 'dashboard.orders'
  | 'dashboard.sales'
  | 'dashboard.totalProfit'
  | 'dashboard.totalSales'
  | 'dashboard.earningReports'
  | 'dashboard.yearlyOverview'
  | 'dashboard.revenueGrowth'
  | 'dashboard.weeklyReport'
  | 'users.title'
  | 'users.manage'
  | 'users.addNew'
  | 'users.editUser'
  | 'users.firstName'
  | 'users.lastName'
  | 'users.role'
  | 'users.status'
  | 'users.createdAt'
  | 'users.actions'
  | 'users.noUsersFound'
  | 'jobs.title'
  | 'jobs.manage'
  | 'jobs.postNew'
  | 'jobs.searchPlaceholder'
  | 'jobs.noJobsFound'
  | 'jobs.matchingOpportunities'
  | 'jobs.filters'
  | 'jobs.employmentType.full-time'
  | 'jobs.employmentType.part-time'
  | 'jobs.employmentType.contract'
  | 'jobs.workType.remote'
  | 'jobs.workType.hybrid'
  | 'jobs.workType.onsite'
  | 'jobs.filters.categories'
  | 'jobs.filters.employmentType'
  | 'jobs.filters.workType'
  | 'jobs.filters.salaryRange'
  | 'jobs.status.active'
  | 'jobs.status.closed'
  | 'jobs.status.draft'
  | 'companies.title'
  | 'companies.manage'
  | 'companies.addNew'
  | 'companies.editCompany'
  | 'companies.name'
  | 'companies.industry'
  | 'companies.size'
  | 'companies.location'
  | 'companies.contact'
  | 'companies.noCompaniesFound'
  | 'categories.title'
  | 'categories.manage'
  | 'categories.addNew'
  | 'categories.editCategory'
  | 'categories.name'
  | 'categories.icon'
  | 'categories.subcategories'
  | 'categories.noCategoriesFound'
  | 'resume.uploadedOn'
  | 'resume.applications'
  | 'resume.status.pending'
  | 'resume.status.reviewed'
  | 'resume.status.accepted'
  | 'resume.status.rejected';

type Translations = {
  [key in TranslationKey]: string;
};

interface TranslationsState {
  t: (key: TranslationKey) => string;
}

const translations: Record<string, Translations> = {
  en: {
    'common.welcome': 'Welcome',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.loading': 'Loading...',
    'common.or': 'or',
    'common.rememberMe': 'Remember me',
    'common.forgotPassword': 'Forgot Password?',
    'common.search': 'Search',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.export': 'Export',
    'common.add': 'Add',
    'common.filters': 'Filters',
    'common.clearAll': 'Clear all',
    'dashboard.welcome': 'Welcome',
    'dashboard.businessOverview': 'Here\'s what\'s happening with your business today.',
    'dashboard.orders': 'Orders',
    'dashboard.sales': 'Sales',
    'dashboard.totalProfit': 'Total Profit',
    'dashboard.totalSales': 'Total Sales',
    'dashboard.earningReports': 'Earning Reports',
    'dashboard.yearlyOverview': 'Yearly Overview',
    'dashboard.revenueGrowth': 'Revenue Growth',
    'dashboard.weeklyReport': 'Weekly Report',
    'users.title': 'Users',
    'users.manage': 'Manage user accounts and permissions',
    'users.addNew': 'Add New User',
    'users.editUser': 'Edit User',
    'users.firstName': 'First Name',
    'users.lastName': 'Last Name',
    'users.role': 'Role',
    'users.status': 'Status',
    'users.createdAt': 'Created At',
    'users.actions': 'Actions',
    'users.noUsersFound': 'No users found',
    'jobs.title': 'Jobs',
    'jobs.manage': 'Manage job listings and applications',
    'jobs.postNew': 'Post New Job',
    'jobs.searchPlaceholder': 'Search jobs...',
    'jobs.noJobsFound': 'No jobs found',
    'jobs.matchingOpportunities': 'Here are some job opportunities that match your profile',
    'jobs.filters': 'Filters',
    'jobs.employmentType.full-time': 'Full Time',
    'jobs.employmentType.part-time': 'Part Time',
    'jobs.employmentType.contract': 'Contract',
    'jobs.workType.remote': 'Remote',
    'jobs.workType.hybrid': 'Hybrid',
    'jobs.workType.onsite': 'On-site',
    'jobs.filters.categories': 'Categories',
    'jobs.filters.employmentType': 'Employment Type',
    'jobs.filters.workType': 'Work Type',
    'jobs.filters.salaryRange': 'Salary Range',
    'jobs.status.active': 'Active',
    'jobs.status.closed': 'Closed',
    'jobs.status.draft': 'Draft',
    'companies.title': 'Companies',
    'companies.manage': 'Manage company profiles and information',
    'companies.addNew': 'Add New Company',
    'companies.editCompany': 'Edit Company',
    'companies.name': 'Company Name',
    'companies.industry': 'Industry',
    'companies.size': 'Company Size',
    'companies.location': 'Location',
    'companies.contact': 'Contact',
    'companies.noCompaniesFound': 'No companies found',
    'categories.title': 'Categories',
    'categories.manage': 'Manage job categories and subcategories',
    'categories.addNew': 'Add New Category',
    'categories.editCategory': 'Edit Category',
    'categories.name': 'Category Name',
    'categories.icon': 'Icon',
    'categories.subcategories': 'Subcategories',
    'categories.noCategoriesFound': 'No categories found',
    'resume.uploadedOn': 'Uploaded on',
    'resume.applications': 'Applications',
    'resume.status.pending': 'Pending',
    'resume.status.reviewed': 'Reviewed',
    'resume.status.accepted': 'Accepted',
    'resume.status.rejected': 'Rejected'
  },
  ru: {
    'common.welcome': 'Добро пожаловать',
    'common.email': 'Эл. почта',
    'common.password': 'Пароль',
    'common.login': 'Войти',
    'common.register': 'Регистрация',
    'common.loading': 'Загрузка...',
    'common.or': 'или',
    'common.rememberMe': 'Запомнить меня',
    'common.forgotPassword': 'Забыли пароль?',
    'common.search': 'Поиск',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.view': 'Просмотр',
    'common.export': 'Экспорт',
    'common.add': 'Добавить',
    'common.filters': 'Фильтры',
    'common.clearAll': 'Очистить все',
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.businessOverview': 'Вот что происходит с вашим бизнесом сегодня.',
    'dashboard.orders': 'Заказы',
    'dashboard.sales': 'Продажи',
    'dashboard.totalProfit': 'Общая прибыль',
    'dashboard.totalSales': 'Общие продажи',
    'dashboard.earningReports': 'Отчеты о доходах',
    'dashboard.yearlyOverview': 'Годовой обзор',
    'dashboard.revenueGrowth': 'Рост выручки',
    'dashboard.weeklyReport': 'Недельный отчет',
    'users.title': 'Пользователи',
    'users.manage': 'Управление учетными записями и правами доступа',
    'users.addNew': 'Добавить пользователя',
    'users.editUser': 'Редактировать пользователя',
    'users.firstName': 'Имя',
    'users.lastName': 'Фамилия',
    'users.role': 'Роль',
    'users.status': 'Статус',
    'users.createdAt': 'Дата создания',
    'users.actions': 'Действия',
    'users.noUsersFound': 'Пользователи не найдены',
    'jobs.title': 'Вакансии',
    'jobs.manage': 'Управление вакансиями и заявками',
    'jobs.postNew': 'Разместить вакансию',
    'jobs.searchPlaceholder': 'Поиск вакансий...',
    'jobs.noJobsFound': 'Вакансии не найдены',
    'jobs.matchingOpportunities': 'Вот несколько вакансий, которые соответствуют вашему профилю',
    'jobs.filters': 'Фильтры',
    'jobs.employmentType.full-time': 'Полный день',
    'jobs.employmentType.part-time': 'Частичная занятость',
    'jobs.employmentType.contract': 'Контракт',
    'jobs.workType.remote': 'Удаленно',
    'jobs.workType.hybrid': 'Гибрид',
    'jobs.workType.onsite': 'В офисе',
    'jobs.filters.categories': 'Категории',
    'jobs.filters.employmentType': 'Тип занятости',
    'jobs.filters.workType': 'Формат работы',
    'jobs.filters.salaryRange': 'Диапазон зарплаты',
    'jobs.status.active': 'Активно',
    'jobs.status.closed': 'Закрыто',
    'jobs.status.draft': 'Черновик',
    'companies.title': 'Компании',
    'companies.manage': 'Управление профилями компаний',
    'companies.addNew': 'Добавить компанию',
    'companies.editCompany': 'Редактировать компанию',
    'companies.name': 'Название компании',
    'companies.industry': 'Отрасль',
    'companies.size': 'Размер компании',
    'companies.location': 'Местоположение',
    'companies.contact': 'Контакты',
    'companies.noCompaniesFound': 'Компании не найдены',
    'categories.title': 'Категории',
    'categories.manage': 'Управление категориями вакансий',
    'categories.addNew': 'Добавить категорию',
    'categories.editCategory': 'Редактировать категорию',
    'categories.name': 'Название категории',
    'categories.icon': 'Иконка',
    'categories.subcategories': 'Подкатегории',
    'categories.noCategoriesFound': 'Категории не найдены',
    'resume.uploadedOn': 'Загружено',
    'resume.applications': 'Заявки',
    'resume.status.pending': 'На рассмотрении',
    'resume.status.reviewed': 'Просмотрено',
    'resume.status.accepted': 'Принято',
    'resume.status.rejected': 'Отклонено'
  },
  uk: {
    'common.welcome': 'Ласкаво просимо',
    'common.email': 'Ел. пошта',
    'common.password': 'Пароль',
    'common.login': 'Увійти',
    'common.register': 'Реєстрація',
    'common.loading': 'Завантаження...',
    'common.or': 'або',
    'common.rememberMe': 'Запам\'ятати мене',
    'common.forgotPassword': 'Забули пароль?',
    'common.search': 'Пошук',
    'common.cancel': 'Скасувати',
    'common.save': 'Зберегти',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.view': 'Переглянути',
    'common.export': 'Експорт',
    'common.add': 'Додати',
    'common.filters': 'Фільтри',
    'common.clearAll': 'Очистити все',
    'dashboard.welcome': 'Ласкаво просимо',
    'dashboard.businessOverview': 'Ось що відбувається з вашим бізнесом сьогодні.',
    'dashboard.orders': 'Замовлення',
    'dashboard.sales': 'Продажі',
    'dashboard.totalProfit': 'Загальний прибуток',
    'dashboard.totalSales': 'Загальні продажі',
    'dashboard.earningReports': 'Звіти про доходи',
    'dashboard.yearlyOverview': 'Річний огляд',
    'dashboard.revenueGrowth': 'Зростання виручки',
    'dashboard.weeklyReport': 'Тижневий звіт',
    'users.title': 'Користувачі',
    'users.manage': 'Управління обліковими записами та правами доступу',
    'users.addNew': 'Додати користувача',
    'users.editUser': 'Редагувати користувача',
    'users.firstName': 'Ім\'я',
    'users.lastName': 'Прізвище',
    'users.role': 'Роль',
    'users.status': 'Статус',
    'users.createdAt': 'Дата створення',
    'users.actions': 'Дії',
    'users.noUsersFound': 'Користувачів не знайдено',
    'jobs.title': 'Вакансії',
    'jobs.manage': 'Управління вакансіями та заявками',
    'jobs.postNew': 'Розмістити вакансію',
    'jobs.searchPlaceholder': 'Пошук вакансій...',
    'jobs.noJobsFound': 'Вакансії не знайдено',
    'jobs.matchingOpportunities': 'Ось кілька вакансій, які відповідають вашому профілю',
    'jobs.filters': 'Фільтри',
    'jobs.employmentType.full-time': 'Повний день',
    'jobs.employmentType.part-time': 'Часткова зайнятість',
    'jobs.employmentType.contract': 'Контракт',
    'jobs.workType.remote': 'Віддалено',
    'jobs.workType.hybrid': 'Гібрид',
    'jobs.workType.onsite': 'В офісі',
    'jobs.filters.categories': 'Категорії',
    'jobs.filters.employmentType': 'Тип зайнятості',
    'jobs.filters.workType': 'Формат роботи',
    'jobs.filters.salaryRange': 'Діапазон зарплати',
    'jobs.status.active': 'Активно',
    'jobs.status.closed': 'Закрыто',
    'jobs.status.draft': 'Черновик',
    'companies.title': 'Компанії',
    'companies.manage': 'Управління профілями компаній',
    'companies.addNew': 'Додати компанію',
    'companies.editCompany': 'Редагувати компанію',
    'companies.name': 'Назва компанії',
    'companies.industry': 'Галузь',
    'companies.size': 'Розмір компанії',
    'companies.location': 'Місцезнаходження',
    'companies.contact': 'Контакти',
    'companies.noCompaniesFound': 'Компанії не знайдено',
    'categories.title': 'Категорії',
    'categories.manage': 'Управління категоріями вакансій',
    'categories.addNew': 'Додати категорію',
    'categories.editCategory': 'Редагувати категорію',
    'categories.name': 'Назва категорії',
    'categories.icon': 'Іконка',
    'categories.subcategories': 'Підкатегорії',
    'categories.noCategoriesFound': 'Категорії не знайдено',
    'resume.uploadedOn': 'Завантажено',
    'resume.applications': 'Заявки',
    'resume.status.pending': 'На розгляді',
    'resume.status.reviewed': 'Переглянуто',
    'resume.status.accepted': 'Прийнято',
    'resume.status.rejected': 'Відхилено'
  },
  uz: {
    'common.welcome': 'Xush kelibsiz',
    'common.email': 'Elektron pochta',
    'common.password': 'Parol',
    'common.login': 'Kirish',
    'common.register': 'Ro\'yxatdan o\'tish',
    'common.loading': 'Yuklanmoqda...',
    'common.or': 'yoki',
    'common.rememberMe': 'Meni eslab qol',
    'common.forgotPassword': 'Parolni unutdingizmi?',
    'common.search': 'Qidirish',
    'common.cancel': 'Bekor qilish',
    'common.save': 'Saqlash',
    'common.delete': 'O\'chirish',
    'common.edit': 'Tahrirlash',
    'common.view': 'Ko\'rish',
    'common.export': 'Eksport',
    'common.add': 'Qo\'shish',
    'common.filters': 'Filtrlar',
    'common.clearAll': 'Tozalash',
    'dashboard.welcome': 'Xush kelibsiz',
    'dashboard.businessOverview': 'Bugun biznesingiz bilan bog\'liq yangiliklar.',
    'dashboard.orders': 'Buyurtmalar',
    'dashboard.sales': 'Sotuvlar',
    'dashboard.totalProfit': 'Umumiy foyda',
    'dashboard.totalSales': 'Umumiy sotuvlar',
    'dashboard.earningReports': 'Daromad hisobotlari',
    'dashboard.yearlyOverview': 'Yillik ko\'rsatkichlar',
    'dashboard.revenueGrowth': 'Daromad o\'sishi',
    'dashboard.weeklyReport': 'Haftalik hisobot',
    'users.title': 'Foydalanuvchilar',
    'users.manage': 'Foydalanuvchi hisoblarini boshqarish',
    'users.addNew': 'Yangi foydalanuvchi',
    'users.editUser': 'Foydalanuvchini tahrirlash',
    'users.firstName': 'Ism',
    'users.lastName': 'Familiya',
    'users.role': 'Rol',
    'users.status': 'Holat',
    'users.createdAt': 'Yaratilgan sana',
    'users.actions': 'Amallar',
    'users.noUsersFound': 'Foydalanuvchilar topilmadi',
    'jobs.title': 'Vakansiyalar',
    'jobs.manage': 'Vakansiyalar va arizalarni boshqarish',
    'jobs.postNew': 'Yangi vakansiya qo\'shish',
    'jobs.searchPlaceholder': 'Vakansiyalarni qidirish...',
    'jobs.noJobsFound': 'Vakansiyalar topilmadi',
    'jobs.matchingOpportunities': 'Profilingizga mos keluvchi vakansiyalar',
    'jobs.filters': 'Filtrlar',
    'jobs.employmentType.full-time': 'To\'liq stavka',
    'jobs.employmentType.part-time': 'Yarim stavka',
    'jobs.employmentType.contract': 'Kontrakt',
    'jobs.workType.remote': 'Masofaviy',
    'jobs.workType.hybrid': 'Gibrid',
    'jobs.workType.onsite': 'Ofisda',
    'jobs.filters.categories': 'Kategoriyalar',
    'jobs.filters.employmentType': 'Bandlik turi',
    'jobs.filters.workType': 'Ish formati',
    'jobs.filters.salaryRange': 'Maosh diapazoni',
    'jobs.status.active': 'Aktiv',
    'jobs.status.closed': 'Yopilgan',
    'jobs.status.draft': 'Chorak',
    'companies.title': 'Kompaniyalar',
    'companies.manage': 'Kompaniya profillarini boshqarish',
    'companies.addNew': 'Yangi kompaniya',
    'companies.editCompany': 'Kompaniyani tahrirlash',
    'companies.name': 'Kompaniya nomi',
    'companies.industry': 'Soha',
    'companies.size': 'Kompaniya hajmi',
    'companies.location': 'Manzil',
    'companies.contact': 'Kontakt',
    'companies.noCompaniesFound': 'Kompaniyalar topilmadi',
    'categories.title': 'Kategoriyalar',
    'categories.manage': 'Vakansiya kategoriyalarini boshqarish',
    'categories.addNew': 'Yangi kategoriya',
    'categories.editCategory': 'Kategoriyani tahrirlash',
    'categories.name': 'Kategoriya nomi',
    'categories.icon': 'Ikonka',
    'categories.subcategories': 'Subkategoriyalar',
    'categories.noCategoriesFound': 'Kategoriyalar topilmadi',
    'resume.uploadedOn': 'Yuklangan sana',
    'resume.applications': 'Arizalar',
    'resume.status.pending': 'Ko\'rib chiqilmoqda',
    'resume.status.reviewed': 'Ko\'rib chiqildi',
    'resume.status.accepted': 'Qabul qilindi',
    'resume.status.rejected': 'Rad etildi'
  }
};

export const useTranslationsStore = create<TranslationsState>((set) => ({
  t: (key: TranslationKey) => {
    const language = localStorage.getItem('language') || 'en';
    return translations[language]?.[key] || translations.en[key] || key;
  }
}));