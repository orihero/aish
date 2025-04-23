import { Logos } from "../assets";
import {
    FiBarChart2,
    FiMonitor,
    FiCode,
    FiBriefcase,
    FiUsers,
} from "react-icons/fi";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { MdCampaign, MdOutlineDesignServices } from "react-icons/md";
import { ResumeType } from "../../types";

export const CategoriesData = [
    {
        icon: <MdOutlineDesignServices />, // Design
        title: "Design",
        vacancies: "235 jobs available",
    },
    {
        icon: <FiBarChart2 />, // Sales
        title: "Sales",
        vacancies: "756 jobs available",
    },
    {
        icon: <MdCampaign />, // Marketing
        title: "Marketing",
        vacancies: "140 jobs available",
    },
    {
        icon: <RiMoneyDollarBoxFill />, // Finance
        title: "Finance",
        vacancies: "325 jobs available",
    },
    {
        icon: <FiMonitor />, // Technology
        title: "Technology",
        vacancies: "500 jobs available",
    },
    {
        icon: <FiCode />, // Engineering
        title: "Engineering",
        vacancies: "410 jobs available",
    },
    {
        icon: <FiBriefcase />, // Business
        title: "Business",
        vacancies: "600 jobs available",
    },
    {
        icon: <FiUsers />, // Human Resource
        title: "Human Resource",
        vacancies: "300 jobs available",
    },
];

export const jobListings = [
    {
        id: 1,
        company: "Revolut",
        location: "Madrid, Spain",
        position: "Email Marketing",
        jobType: "Full Time",
        categories: ["Marketing", "Design"],
        logo: Logos.canva, // Revolut logosi
        description:
            "Revolut is looking for an Email Marketing Specialist to help the team manage campaigns and customer engagement.",
    },
    {
        id: 2,
        company: "Dropbox",
        location: "San Francisco, US",
        position: "Brand Designer",
        jobType: "Full Time",
        categories: ["Design", "Business"],
        logo: Logos.canva, // Dropbox logosi
        description:
            "Dropbox is looking for a Brand Designer to help create visually compelling content and maintain brand identity.",
    },
    {
        id: 3,
        company: "Pitch",
        location: "Berlin, Germany",
        position: "Email Marketing",
        jobType: "Full Time",
        categories: ["Marketing"],
        logo: Logos.canva, // Pitch logosi
        description:
            "Pitch is looking for a Customer Manager to join the marketing team and develop email outreach strategies.",
    },
    {
        id: 4,
        company: "Blinklist",
        location: "Granada, Spain",
        position: "Visual Designer",
        jobType: "Full Time",
        categories: ["Design"],
        logo: Logos.canva, // Blinklist logosi
        description:
            "Blinklist is looking for a Visual Designer to help the team design engaging user experiences.",
    },
    {
        id: 5,
        company: "ClassPass",
        location: "Manchester, UK",
        position: "Product Designer",
        jobType: "Full Time",
        categories: ["Marketing", "Design"],
        logo: Logos.canva, // ClassPass logosi
        description:
            "ClassPass is looking for a Product Designer to create innovative UI/UX solutions for their platform.",
    },
    {
        id: 6,
        company: "Canva",
        location: "Ontario, Canada",
        position: "Lead Designer",
        jobType: "Full Time",
        categories: ["Design", "Business"],
        logo: Logos.canva, // Canva logosi
        description:
            "Canva is looking for a Lead Designer to help develop new features and improve design workflows.",
    },
    {
        id: 7,
        company: "GoDaddy",
        location: "Marseille, France",
        position: "Brand Strategist",
        jobType: "Full Time",
        categories: ["Marketing"],
        logo: Logos.canva, // GoDaddy logosi
        description:
            "GoDaddy is looking for a Brand Strategist to join the team and develop marketing and branding strategies.",
    },
    {
        id: 8,
        company: "Twitter",
        location: "San Diego, US",
        position: "Data Analyst",
        jobType: "Full Time",
        categories: ["Technology"],
        logo: Logos.canva, // Twitter logosi
        description:
            "Twitter is looking for a Data Analyst to help the team analyze trends and improve platform engagement.",
    },
];

// export const exampleResume: ResumeType = {
//     _id: "res1234567890",
//     user: "user12345",
//     name: "Ali Valiyev",
//     phone: "+998901234567",
//     fileUrl: "https://example.com/cv/ali-valiyev.pdf",
//     fileName: "ali-valiyev.pdf",

//     basics: {
//         name: "Ali Valiyev",
//         label: "Frontend Developer",
//         image: "https://example.com/images/ali.jpg",
//         email: "ali@example.com",
//         phone: "+998901234567",
//         url: "https://alivaliyev.dev",
//         summary:
//             "Tajribali frontend dasturchi, React va TypeScript bo‘yicha 3 yillik tajribaga ega.",
//         location: {
//             address: "Yunusobod tumani, 12-dah",
//             postalCode: "100123",
//             city: "Toshkent",
//             region: "Toshkent shahri",
//             countryCode: "UZ",
//         },
//         profiles: [
//             {
//                 network: "LinkedIn",
//                 username: "alivaliyev",
//                 url: "https://linkedin.com/in/alivaliyev",
//             },
//             {
//                 network: "GitHub",
//                 username: "alivaliyev",
//                 url: "https://github.com/alivaliyev",
//             },
//         ],
//     },
//     work: [
//         {
//             name: "TechSoft",
//             position: "Frontend Developer",
//             url: "https://techsoft.uz",
//             startDate: "2022-01-01",
//             endDate: "2024-01-01",
//             summary:
//                 "React asosida loyihalarni ishlab chiqish, UI/UX dizaynni amalga oshirish.",
//             highlights: ["React", "Redux", "TypeScript"],
//             location: "Toshkent, Uzbekistan",
//         },
//         {
//             name: "TechSoft",
//             position: "Frontend Developer",
//             url: "https://techsoft.uz",
//             startDate: "2022-01-01",
//             endDate: "2024-01-01",
//             summary:
//                 "React asosida loyihalarni ishlab chiqish, UI/UX dizaynni amalga oshirish.",
//             highlights: ["React", "Redux", "TypeScript"],
//             location: "Toshkent, Uzbekistan",
//         },
//     ],
//     education: [
//         {
//             institution: "TATU",
//             area: "Kompyuter Ilmlari",
//             studyType: "Bakalavr",
//             startDate: "2018-09-01",
//             endDate: "2022-06-30",
//             gpa: "3.8",
//             courses: ["Algoritmlar", "Ma’lumotlar tuzilmasi", "Veb dasturlash"],
//             url: "",
//         },
//     ],
//     certifications: [
//         {
//             name: "Frontend Development Certificate",
//             issuer: "Udemy",
//             date: "2023-05-10",
//             url: "https://udemy.com/certificate/123456",
//         },
//     ],
//     awards: [
//         {
//             title: "Yilning eng yaxshi yosh dasturchisi",
//             date: "2023-12-15",
//             awarder: "IT Park",
//             summary: "Innovatsion veb-yechimlar uchun mukofot.",
//         },
//     ],
//     skills: [
//         {
//             name: "Frontend",
//             level: "Expert",
//             keywords: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
//         },
//     ],
//     languages: [
//         {
//             language: "O'zbek",
//             fluency: "Ona tili",
//         },
//         {
//             language: "Ingliz",
//             fluency: "Yaxshi",
//         },
//     ],
//     interests: [
//         {
//             name: "Texnologiyalar",
//             keywords: ["AI", "Open Source", "Design"],
//         },
//     ],
//     projects: [
//         {
//             name: "Portfolio Website",
//             description: "Shaxsiy portfolioni namoyish qiluvchi sayt",
//             highlights: ["Responsive dizayn", "React bilan qurilgan"],
//             keywords: ["React", "CSS", "Hosting"],
//             startDate: "2023-02-01",
//             url: "https://alivaliyev.dev",
//         },
//     ],
//     references: [
//         {
//             name: "Javlon Nizamov",
//             reference:
//                 "Ali bilan birga 2 yil ishlaganmiz, juda mas'uliyatli dasturchi.",
//         },
//     ],
//     volunteer: [],
//     publications: [],
//     applications: [
//         {
//             vacancy: {
//                 _id: "",
//                 company: "",
//                 title: "",
//             },
//             appliedAt: "2024-10-10T09:30:00Z",
//             status: "pending",
//             _id: "",
//         },
//         {
//             vacancy: {
//                 _id: "",
//                 company: "",
//                 title: "",
//             },
//             appliedAt: "2024-10-05T14:20:00Z",
//             status: "reviewed",
//             _id: "",
//         },
//     ],
//     createdAt: "2024-09-30T12:00:00Z",
//     updatedAt: "2024-10-11T08:45:00Z",
// };
