export type translationType = {
    language: string;
    value: string;
    _id: string;
};

export type CategoriesType = {
    _id: string;
    jobCount: number;
    title: [translationType];
    icon: string;
    subcategories: [
        {
            title: [translationType];
            icon: String;
        }
    ];
    timestamps: true;
};

export type CategoriesStatsType = {
    icon: string;
    id: string; // Kategoriyaning IDsi (categoryStatdagi ID)
    jobCount: number; // Kategoriyadagi ish o‘rinlari soni
    title: [translationType]; // Kategoriyaning nomi
};

export type CreatorType = {
    _id: string;
    firstName: string;
    lastName: string;
};

export type SalaryType = {
    min: number;
    max: number;
    currency: string;
};

export type VacancyType = {
    _id: string;
    title: string;
    creator: CreatorType;
    company: string;
    category: {
        title: translationType[];
    };
    subcategory: string;
    description: string;
    salary: SalaryType;
    employmentType: string;
    workType: string;
    isFeatured: boolean;
    views: number;
    timestamps: boolean;
    createdAt: string;
};

export type VacanciesType = {
    currentPage: number;
    pages: number;
    total: number;
    vacancies: VacancyType[];
};
