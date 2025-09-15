import { makeAutoObservable, runInAction } from "mobx";
import APIs from "../../api/api";
import { VacanciesType, VacancyType } from "../../../types";
import { AppRootStore } from "../store";

export class VacanciesStore {
    private readonly rootStore: AppRootStore;
    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
        // Initialize with cached data if available
        this.getVacanciesByQuery();
        this.getFeaturedVacancies();
        this.getLatesVacancies();
    }

    featuredVacancies: VacanciesType = {} as VacanciesType;
    latesVacancies: VacanciesType = {} as VacanciesType;
    vacancies: VacanciesType = {} as VacanciesType;
    previewVacancy: VacancyType = {} as VacancyType;

    // Cache management
    private cacheLoaded: {
        vacancies: boolean;
        featuredVacancies: boolean;
        latesVacancies: boolean;
    } = {
        vacancies: false,
        featuredVacancies: false,
        latesVacancies: false,
    };

    private lastFetch: {
        vacancies: number;
        featuredVacancies: number;
        latesVacancies: number;
    } = {
        vacancies: 0,
        featuredVacancies: 0,
        latesVacancies: 0,
    };

    private vacancyCache: Map<string, VacancyType> = new Map();
    private lastVacancyFetch: Map<string, number> = new Map();
    private lastQueryParams: string = "";

    // Cache TTL (Time To Live) in milliseconds
    private readonly VACANCIES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
    private readonly VACANCY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    loadings: {
        vacancies: boolean;
        featuredVacancies: boolean;
        latesVacancies: boolean;
        getVacanciesByQuery: boolean;
        getVacancyById: boolean;
    } = {
        vacancies: false,
        featuredVacancies: false,
        latesVacancies: false,
        getVacanciesByQuery: false,
        getVacancyById: false,
    };

    setLoading = (key: keyof VacanciesStore["loadings"]) => {
        this.loadings[key] = !this.loadings[key];
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

    getVacanciesByQuery = async (forceRefresh: boolean = false) => {
        const now = Date.now();
        const queryKey = this.queryParams;
        const isCacheValid = this.cacheLoaded.vacancies && 
            (now - this.lastFetch.vacancies) < this.VACANCIES_CACHE_TTL &&
            queryKey === this.lastQueryParams;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            return;
        }

        try {
            this.setLoading("getVacanciesByQuery");
            const response = await APIs.jobs.getVacanciesByQuery(queryKey);

            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.vacancies = response.data as VacanciesType;
                this.cacheLoaded.vacancies = true;
                this.lastFetch.vacancies = now;
                this.lastQueryParams = queryKey;
            });
        } catch (error) {
            console.error("Failed to fetch vacancies by query:", error);
        } finally {
            this.setLoading("getVacanciesByQuery");
        }
    };

    getVacancies = async (forceRefresh: boolean = false) => {
        const now = Date.now();
        const isCacheValid = this.cacheLoaded.vacancies && 
            (now - this.lastFetch.vacancies) < this.VACANCIES_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            return;
        }

        try {
            this.setLoading("vacancies");
            const response = await APIs.jobs.getVacancies();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.vacancies = response.data as VacanciesType;
                this.cacheLoaded.vacancies = true;
                this.lastFetch.vacancies = now;
            });
        } catch (error) {
            console.error("Failed to fetch all vacancies:", error);
        } finally {
            this.setLoading("vacancies");
        }
    };

    getFeaturedVacancies = async (forceRefresh: boolean = false) => {
        const now = Date.now();
        const isCacheValid = this.cacheLoaded.featuredVacancies && 
            (now - this.lastFetch.featuredVacancies) < this.VACANCIES_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            return;
        }

        try {
            this.setLoading("featuredVacancies");
            const response = await APIs.jobs.getVacanciesFeatured();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.featuredVacancies = response.data as VacanciesType;
                this.cacheLoaded.featuredVacancies = true;
                this.lastFetch.featuredVacancies = now;
            });
        } catch (error) {
            console.error("Failed to fetch featured vacancies:", error);
        } finally {
            this.setLoading("featuredVacancies");
        }
    };

    getLatesVacancies = async (forceRefresh: boolean = false) => {
        const now = Date.now();
        const isCacheValid = this.cacheLoaded.latesVacancies && 
            (now - this.lastFetch.latesVacancies) < this.VACANCIES_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            return;
        }

        try {
            this.setLoading("latesVacancies");
            const response = await APIs.jobs.getVacanciesLatest();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.latesVacancies = response.data as VacanciesType;
                this.cacheLoaded.latesVacancies = true;
                this.lastFetch.latesVacancies = now;
            });
        } catch (error) {
            console.error("Failed to fetch latest vacancies:", error);
        } finally {
            this.setLoading("latesVacancies");
        }
    };

    findVacancyById = (id: string, where?: string, callback?: () => void) => {
        runInAction(() => {
            if (where === "latest") {
                this.previewVacancy = this.latesVacancies.vacancies.find(
                    (vacancy: VacancyType) => vacancy._id === id
                ) as VacancyType;
            }
            if (where === "featured") {
                this.previewVacancy = this.featuredVacancies.vacancies.find(
                    (vacancy: VacancyType) => vacancy._id === id
                ) as VacancyType;
            }
            if (where === "findJobs") {
                this.previewVacancy = this.vacancies.vacancies.find(
                    (vacancy: VacancyType) => vacancy._id === id
                ) as VacancyType;
            }
        });
        if (callback) {
            callback();
        }
    };

    getVacancyById = async (id: string, forceRefresh: boolean = false) => {
        const now = Date.now();
        const lastFetch = this.lastVacancyFetch.get(id) || 0;
        const isCacheValid = this.vacancyCache.has(id) && 
            (now - lastFetch) < this.VACANCY_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            runInAction(() => {
                this.previewVacancy = this.vacancyCache.get(id)!;
            });
            return;
        }

        try {
            this.setLoading("getVacancyById");
            const response = await APIs.jobs.getVacancyById(id);
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.previewVacancy = response.data;
                this.vacancyCache.set(id, response.data);
                this.lastVacancyFetch.set(id, now);
            });
        } catch (error) {
            console.error("Failed to fetch vacancy by ID:", error);
        } finally {
            this.setLoading("getVacancyById");
        }
    };

    // Cache management methods
    clearCache = () => {
        this.vacancyCache.clear();
        this.lastVacancyFetch.clear();
        this.cacheLoaded = {
            vacancies: false,
            featuredVacancies: false,
            latesVacancies: false,
        };
        this.lastFetch = {
            vacancies: 0,
            featuredVacancies: 0,
            latesVacancies: 0,
        };
        this.lastQueryParams = "";
    };

    invalidateVacancyCache = (vacancyId: string) => {
        this.vacancyCache.delete(vacancyId);
        this.lastVacancyFetch.delete(vacancyId);
    };

    invalidateVacanciesCache = (type: 'vacancies' | 'featuredVacancies' | 'latesVacancies') => {
        this.cacheLoaded[type] = false;
        this.lastFetch[type] = 0;
    };

    // Force refresh methods for when user explicitly wants fresh data
    refreshVacancies = () => this.getVacancies(true);
    refreshFeaturedVacancies = () => this.getFeaturedVacancies(true);
    refreshLatestVacancies = () => this.getLatesVacancies(true);
    refreshVacancyById = (id: string) => this.getVacancyById(id, true);
    refreshVacanciesByQuery = () => this.getVacanciesByQuery(true);
}
