import { makeAutoObservable, runInAction, toJS } from "mobx";
import APIs from "../../api/api";
import { VacanciesType, VacancyType } from "../../../types";
import { AppRootStore } from "../store";

export class VacanciesStore {
    private readonly rootStore: AppRootStore;
    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
        this.getVacancies();
        this.getFeaturedVacancies();
        this.getLatesVacancies();
    }

    featuredVacancies: VacanciesType = {} as VacanciesType;
    latesVacancies: VacanciesType = {} as VacanciesType;
    vacancies: VacanciesType = {} as VacanciesType;
    previewVacancy: VacancyType = {} as VacancyType;

    filters = {
        search: "",
        category: "" as string | null,
        employmentType: [] as string[], // Massiv qilib o‘zgartirdik
        workType: [] as string[], // Massiv qilib o‘zgartirdik
        salaryMin: 0 as number | null,
        salaryMax: 2000 as number | null,
        featured: false as boolean | null,
        sort: "newest",
        page: 1,
        limit: 10,
    };

    setFilter<K extends keyof typeof this.filters>(
        key: K,
        value: (typeof this.filters)[K]
    ) {
        this.filters[key] = value;
    }

    get queryParams(): string {
        const params = new URLSearchParams();
        const { filters } = this;

        for (const key in filters) {
            const value = filters[key as keyof typeof filters];

            // Skip the 'salary' key
            if (key === "salaryMin" || key === "salaryMax") {
                continue;
            }

            // Check if the value is an array (for multiple selections like workType and employmentType)
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    // Only append the item if it's not null, not an empty string, and not NaN
                    if (
                        item !== null &&
                        item !== "" &&
                        !(typeof item === "number" && isNaN(item))
                    ) {
                        params.append(key, String(item));
                    }
                });
            } else {
                // Only add the key-value pair if the value is not null, not an empty string, and not NaN
                if (
                    value !== null &&
                    value !== "" &&
                    !(typeof value === "number" && isNaN(value))
                ) {
                    params.append(key, String(value));
                }
            }
        }

        return params.toString();
    }

    getVacanciesByQuery = async () => {
        try {
            const response = await APIs.jobs.getVacanciesByQuery(
                this.queryParams
            );

            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.vacancies = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch featured jobs:", error);
        }
    };

    getVacancies = async () => {
        try {
            const response = await APIs.jobs.getVacancies();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.vacancies = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch featured jobs:", error);
        }
    };

    getFeaturedVacancies = async () => {
        try {
            const response = await APIs.jobs.getVacanciesFeatured();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.featuredVacancies = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch featured jobs:", error);
        }
    };

    getLatesVacancies = async () => {
        try {
            const response = await APIs.jobs.getVacanciesLatest();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.latesVacancies = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch featured jobs:", error);
        }
    };

    getVacancyById = async (id: string, callback?: () => void) => {
        try {
            const response = await APIs.jobs.getVacancyById(id);
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            const companyData =
                await this.rootStore.companiesStore.getCompanyById(
                    response.data.company as never
                );

            runInAction(() => {
                this.previewVacancy = {
                    ...response.data,
                    company: companyData,
                } as never;

                if (callback) {
                    callback();
                }
            });
        } catch (error) {
            console.error("Failed to fetch featured jobs:", error);
        }
    };
}
