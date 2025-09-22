import {
    ApplicationType,
    CategoriesType,
    ChatType,
    CompanyType,
    FullResumeType,
    ResumeType,
    UpdateProfileType,
    User,
    UserFullType,
    VacanciesType,
    VacancyType,
} from "../../types";
import ApiService from "./services/ApiService";

const apiService = new ApiService();

const APIs = {
    auth: {
        register: (data: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
        }) =>
            apiService.methods.post<{ user: User; token: string }>(
                `api/auth/register`,
                data
            ),

        registerWithResume: (data: User) =>
            apiService.methods.post<{ user: User; token: string }>(
                `api/auth/register-with-resume`,
                data
            ),

        getMyAccount: () =>
            apiService.methods.get<UserFullType>(`api/auth/profile`),

        login: (data:{email:string,password:string}) =>
            apiService.methods.post<UserFullType>(
                `api/auth/login`,
                data
            ),

        updateProfile: (data: {
            firstName: string;
            lastName: string;
            phone?: string;
        }) =>
            apiService.methods.put<UpdateProfileType>(
                `api/auth/profile`,
                data
            ),

        // Forgot password
        forgotPassword: (email: string) =>
            apiService.methods.post<{ message: string }>(
                `api/auth/forgot-password`,
                { email }
            ),

        // Reset password
        resetPassword: (data: { token: string; password: string }) =>
            apiService.methods.post<{ message: string }>(
                `api/auth/reset-password`,
                data
            ),
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

        updateResumeData: (resumeId: string, parsedData: any) =>
            apiService.methods.put<ResumeType>(
                `api/resumes/${resumeId}/parsed-data`,
                parsedData
            ),

        downloadResume: (resumeId: string) =>
            apiService.methods.get<Blob>(
                `api/resumes/${resumeId}/download-pdf`,
                { responseType: 'blob' }
            ),
    },

    applications: {
        applyToVacancy: (resumeId: string, vacancyId: string) =>
            apiService.methods.post<ApplicationType>(
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
