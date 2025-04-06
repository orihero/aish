import { makeAutoObservable, runInAction } from "mobx";
import APIs from "../../api/api";
import { VacanciesType, VacancyType } from "../../../types";

export class VacanciesStore {
    constructor() {
        makeAutoObservable(this);
        this.getVacancies();
    }

    featuredjobs: VacanciesType = {} as VacanciesType;
    vacancies: VacanciesType = {} as VacanciesType;
    previewVacancy: VacancyType = {} as VacancyType;

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

    getVacancyById = async (id: string, callback?: () => void) => {
        try {
            const response = await APIs.jobs.getVacancyById(id);
            if (response.statusText !== "OK") {
                throw new Error("Network response was not ok");
            }
            runInAction(() => {
                this.previewVacancy = response.data as never;
                if (callback) {
                    callback();
                }
            });
        } catch (error) {
            console.error("Failed to fetch featured jobs:", error);
        }
    };
}
