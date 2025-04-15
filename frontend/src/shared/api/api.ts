import Companies from "../../components/Companies/Companies";
import {
    CategoriesType,
    CompanyType,
    ResumeType,
    VacanciesType,
    VacancyType,
} from "../../types";
import ApiService from "./services/ApiService";

const apiService = new ApiService();

const APIs = {
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
            apiService.methods.get<VacanciesType>("api/vacancies"),

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
            apiService.methods.post<{ success: Boolean; data: ResumeType }>(
                "api/resumes/analyze",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            ),

        getResumeById: (resumeId: string) =>
            apiService.methods.get<ResumeType>(
                `api/resumes/analyze/${resumeId}`
            ),

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
};

export default APIs;
