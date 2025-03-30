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
