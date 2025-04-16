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
    company: CompanyType;
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

export type CompanyType = {
    _id?: string; // Agar kerak bo‘lsa
    name: string;
    logo?: string;
    description: string;
    industry: string;
    size: "1-50" | "51-200" | "201-1000" | "1000-5000" | "5000+";
    founded?: number;
    website?: string;
    location: {
        country: string;
        city: string;
        address?: string;
    };
    contact: {
        email: string;
        phone?: string;
    };
    social?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    benefits?: string[];
    creator: string; // User ID (ObjectId)
    status?: "active" | "inactive" | "pending";
    createdAt?: string;
    updatedAt?: string;
};

export type WorkType = {
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
    location: string;
};

export const defaultWork: WorkType[] = [];

export interface ResumeType {
    _id: string;
    user: string; // userId
    name: string;
    phone: string;
    cvFile: {
        url: string;
        filename: string;
    };

    basics: {
        name: string;
        label: string;
        image: string;
        email: string;
        phone: string;
        url: string;
        summary: string;
        location: {
            address: string;
            postalCode: string;
            city: string;
            region: string;
            countryCode: string;
        };
        profiles: ProfileType[];
    };
    work: WorkType[];
    volunteer: VolunteerType[];
    education: EducationType[];
    certifications: CertificationType[];
    awards: AwardType[];
    publications: PublicationType[];
    skills: SkillType[];
    languages: LanguageType[];
    interests: InterestType[];
    projects: ProjectType[];
    references: ReferenceType[];
    applications: ApplicationType[];
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
}

export type ProfileType = {
    network: string;
    username: string;
    url: string;
};

export const defaultProfiles: ProfileType[] = [];

export type VolunteerType = {
    organization: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
};

export const defaultVolunteer: VolunteerType[] = [];

export type EducationType = {
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    gpa: string;
    courses: string[];
};

export const defaultEducation: EducationType[] = [];

export type CertificationType = {
    name: string;
    issuer: string;
    date: string;
    url: string;
};

export const defaultCertifications: CertificationType[] = [];

export type AwardType = {
    title: string;
    date: string;
    awarder: string;
    summary: string;
};

export const defaultAwards: AwardType[] = [];

export type PublicationType = {
    name: string;
    publisher: string;
    releaseDate: string;
    url: string;
    summary: string;
};

export const defaultPublications: PublicationType[] = [];

export type SkillType = {
    name: string;
    level: string;
    keywords: string[];
};

export const defaultSkills: SkillType[] = [];

export type InterestType = {
    name: string;
    keywords: string[];
};

export const defaultInterests: InterestType[] = [];

export type ProjectType = {
    name: string;
    description: string;
    highlights: string[];
    keywords: string[];
    startDate: string;
    url: string;
};

export const defaultProjects: ProjectType[] = [];

export type ReferenceType = {
    name: string;
    reference: string;
};

export const defaultReferences: ReferenceType[] = [];

export type ApplicationType = {
    vacancy: string;
    appliedAt: string;
    status: "pending" | "reviewed" | "accepted" | "rejected";
};

export const defaultApplications: ApplicationType[] = [];

export type LanguageType = {
    language: string;
    fluency: string;
};

export const defaultLanguages: LanguageType[] = [];

export const defaultResumeState: ResumeType = {
    _id: "",
    user: "",
    name: "",
    phone: "",
    cvFile: {
        url: "",
        filename: "",
    },
    basics: {
        name: "",
        label: "",
        image: "",
        email: "",
        phone: "",
        url: "",
        summary: "",
        location: {
            address: "",
            postalCode: "",
            city: "",
            region: "",
            countryCode: "",
        },
        profiles: [],
    },
    work: [],
    volunteer: [],
    education: [],
    certifications: [],
    awards: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    projects: [],
    references: [],
    applications: [],
    createdAt: "",
    updatedAt: "",
};
