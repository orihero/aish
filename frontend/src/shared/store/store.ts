import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { VisibleStore } from "./visible/VisibleStore";
import { CategoriesStore } from "./categories/CategoriesStore";
import { VacanciesStore } from "./Vacancies/VacanciesStore";

export class AppRootStore {
    visibleStore: VisibleStore;
    categoriesStore: CategoriesStore;
    vacanciesStore: VacanciesStore;

    constructor() {
        makeAutoObservable(this);
        this.visibleStore = new VisibleStore();
        this.categoriesStore = new CategoriesStore();
        this.vacanciesStore = new VacanciesStore();
    }
}

const rootStore = new AppRootStore();
export default createContext(rootStore);
