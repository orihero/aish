import { makeAutoObservable, runInAction } from "mobx";
import { CategoriesStatsType, CategoriesType } from "../../../types";
import APIs from "../../api/api";

export class CategoriesStore {
    constructor() {
        makeAutoObservable(this);
        this.getCategories();
        this.getCategoryStats();
    }

    categories: CategoriesType[] = [] as CategoriesType[];

    categoriesStats: CategoriesStatsType[] = [] as CategoriesStatsType[];

    currentCategory: CategoriesType | null = null;

    get enrichedCategories() {
        return this.categories.map((category) => {
            const stat = this.categoriesStats.find(
                (s) => s.id === category._id
            );
            return {
                ...category,
                jobCount: stat?.jobCount || 0,
            };
        });
    }

    getCategories = async () => {
        try {
            const response = await APIs.categories.getCategories();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            // console.log("response", response.data);
            runInAction(() => {
                this.categories = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    getCategoryStats = async () => {
        try {
            const response = await APIs.categories.getCategoryStats();
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            // console.log("response", response.data);
            runInAction(() => {
                this.categoriesStats = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch category stats:", error);
        }
    };

    getCategoryById = async (id: string) => {
        try {
            const response = await APIs.categories.getCategoryById(id);
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            // console.log("response", response.data);
            runInAction(() => {
                this.currentCategory = response.data as never;
            });
        } catch (error) {
            console.error("Failed to fetch category:", error);
        }
    };
}
