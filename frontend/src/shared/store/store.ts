import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { VisibleStore } from "./visible/VisibleStore";
import { CategoriesStore } from "./categories/CategoriesStore";
import { VacanciesStore } from "./Vacancies/VacanciesStore";
import { CompaniesStore } from "./companies/CompaniesStore";
import { ResumeStore } from "./resume/ResumeStore";

export class AppRootStore {
    visibleStore: VisibleStore;
    categoriesStore: CategoriesStore;
    vacanciesStore: VacanciesStore;
    companiesStore: CompaniesStore;
    resumeStore: ResumeStore;

    constructor() {
        makeAutoObservable(this);
        this.visibleStore = new VisibleStore();
        this.categoriesStore = new CategoriesStore();
        this.vacanciesStore = new VacanciesStore(this);
        this.companiesStore = new CompaniesStore(this);
        this.resumeStore = new ResumeStore();
    }
}

const rootStore = new AppRootStore();
export default createContext(rootStore);
