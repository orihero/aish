import { CategoriesType, VacancyType } from "../../types";
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
            apiService.methods.get<VacancyType>("api/vacancies"),

        getVacanciesFeatured: () =>
            apiService.methods.get<VacancyType>("api/vacancies/featured"),

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
};

export default APIs;
