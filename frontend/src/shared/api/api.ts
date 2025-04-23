import { Session } from "react-router-dom";
import Companies from "../../components/Companies/Companies";
import {
    ApplicationType,
    CategoriesType,
    ChatType,
    CompanyType,
    FullResumeType,
    Message,
    ResumeType,
    User,
    UserFullType,
    VacanciesType,
    VacancyType,
} from "../../types";
import ApiService from "./services/ApiService";

const apiService = new ApiService();

const APIs = {
    auth: {
        registerWithResume: (data: User) =>
            apiService.methods.post<{ user: User; token: string }>(
                `api/auth/register-with-resume`,
                data
            ),

        getMyAccount: () =>
            apiService.methods.get<UserFullType>(`api/auth/profile`),
    },
    categories: {
        getCategories: () =>
            apiService.methods.get<CategoriesType>("api/categories"),

        getCategoryStats: () =>
            apiService.methods.get<CategoriesType>("api/categories/stats"),

        getCategoryById: (id: string) =>
            apiService.methods.get<CategoriesType>(`api/categories/${id}`),
    },
    jobs: {
        getVacancies: () =>
            apiService.methods.get<VacanciesType>("api/vacancies/employee"),

        getVacanciesByQuery: (query: string) =>
            apiService.methods.get<VacanciesType>(`api/vacancies?${query}`),

        getVacanciesFeatured: () =>
            apiService.methods.get<VacanciesType>("api/vacancies/featured"),

        getVacanciesLatest: () =>
            apiService.methods.get<VacanciesType>("api/vacancies/newest"),

        getVacancyById: (id: string) =>
            apiService.methods.get<VacancyType>(`api/vacancies/${id}`),

        getVacancyByCategoryId: (categoryId: string) =>
            apiService.methods.get<VacancyType>(
                `api/vacancies/category/${categoryId}`
            ),

        getVacancyByCompanyId: (companyId: string) =>
            apiService.methods.get<VacancyType>(
                `api/vacancies/company/${companyId}`
            ),
    },

    companies: {
        getCompanies: () =>
            apiService.methods.get<CompanyType[]>("api/companies"),

        getCompanyById: (id: string) =>
            apiService.methods.get<CompanyType>(`api/companies/${id}`),

        getCompanyByCategoryId: (categoryId: string) =>
            apiService.methods.get<CompanyType>(
                `api/companies/category/${categoryId}`
            ),

        getCompanyByVacancyId: (vacancyId: string) =>
            apiService.methods.get<CompanyType>(
                `api/companies/vacancy/${vacancyId}`
            ),
    },

    resumes: {
        createResume: (formData: FormData) =>
            apiService.methods.post<{
                success: Boolean;
                data: ResumeType;
                fileName: string;
                fileUrl: string;
            }>("api/resumes/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),

        getResumeById: (resumeId: string) =>
            apiService.methods.get<ResumeType>(
                `api/resumes/analyze/${resumeId}`
            ),

        getResumeMy: () =>
            apiService.methods.get<FullResumeType[]>(`api/resumes/my`),

        updateResume: (resumeId: string, formData: FormData) =>
            apiService.methods.put<ResumeType>(
                `api/resumes/analyze/${resumeId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            ),
    },

    applications: {
        applyToVacancy: (resumeId: string, vacancyId: string) =>
            apiService.methods.post<VacanciesType>(
                `api/applications/apply/${resumeId}/${vacancyId}`
            ),

        getMyApplications: () =>
            apiService.methods.get<ApplicationType[]>(`api/applications/me`),
    },

    chats: {
        getMyChats: () => apiService.methods.get<ChatType[]>(`api/chats`),

        getChatById: (chatId: string) =>
            apiService.methods.get<ChatType>(`api/chats/${chatId}`),

        sendMessage: (chatId: string, message: any) =>
            apiService.methods.post<ChatType>(`api/chats/${chatId}/messages`, {
                message: message,
            }),
    },
};

export default APIs;
