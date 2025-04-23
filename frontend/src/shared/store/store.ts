import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { VisibleStore } from "./visible/VisibleStore";
import { CategoriesStore } from "./categories/CategoriesStore";
import { VacanciesStore } from "./Vacancies/VacanciesStore";
import { CompaniesStore } from "./companies/CompaniesStore";
import { ResumeStore } from "./resume/ResumeStore";
import LocalStore from "./localStore/LocalStore";
import { AuthStore } from "./authStore/AuthStore";
import { ApplicationStore } from "./applicationStore/ApplicationStore";
import { ChatStore } from "./chatStore/ChatStore";

export class AppRootStore {
    visibleStore: VisibleStore;
    categoriesStore: CategoriesStore;
    vacanciesStore: VacanciesStore;
    companiesStore: CompaniesStore;
    resumeStore: ResumeStore;
    localStore: LocalStore;
    authStore: AuthStore;
    applicationStore: ApplicationStore;
    chatStore: ChatStore;

    constructor() {
        makeAutoObservable(this);
        this.visibleStore = new VisibleStore();
        this.categoriesStore = new CategoriesStore();
        this.vacanciesStore = new VacanciesStore(this);
        this.companiesStore = new CompaniesStore(this);
        this.resumeStore = new ResumeStore(this);
        this.localStore = new LocalStore(this);
        this.authStore = new AuthStore(this);
        this.applicationStore = new ApplicationStore(this);
        this.chatStore = new ChatStore(this);
        this.run();
    }

    runFunctionsWithLogin = () => {
        this.authStore.getMe();
    };

    runHasToken = () => {
        if (!this.localStore.session.accessToken) return;
        this.authStore.getMe();
        console.log("All requests are done!");
    };

    private run = () => {
        runInAction(() => {
            const list = [this.localStore.getToken()];

            Promise.all(list)
                .then(() => this.runHasToken())
                .catch(() => console.log("Requests failed!"));
        });
    };
}

const rootStore = new AppRootStore();
export default createContext(rootStore);
