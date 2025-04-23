import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AppRootStore } from "../store";
import { ApplicationType, FullResumeType, VacancyType } from "../../../types";
import APIs from "../../api/api";
import { message } from "antd";

export class ApplicationStore {
    private readonly rootStore: AppRootStore;

    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
    }
    selectedResume: FullResumeType = {} as FullResumeType;
    respondVacancy: VacancyType = {} as VacancyType;

    myApplications: ApplicationType[] = [] as ApplicationType[];

    loadings: {
        isGettingMyApplicationsLoading: boolean;
        isApplyingLoading: boolean;
    } = {
        isGettingMyApplicationsLoading: false,
        isApplyingLoading: false,
    };

    setLoading = (key: keyof ApplicationStore["loadings"]) => {
        this.loadings[key] = !this.loadings[key];
    };

    respondHandle = (vacancy: VacancyType) => {
        runInAction(() => {
            this.respondVacancy = vacancy;
        });
    };

    applyToVacancy = async (callback?: () => void) => {
        try {
            this.setLoading("isApplyingLoading");
            const apply = await APIs.applications.applyToVacancy(
                this.selectedResume._id,
                this.respondVacancy._id
            );
            message.warning(apply.request.response);
            callback && callback();
        } catch (error: any) {
            message.error(error.response.data.message);
            console.log("error", error);
        } finally {
            this.setLoading("isApplyingLoading");
            this.rootStore.visibleStore.hide("applyModal");
        }
    };

    getMyApplications = async () => {
        try {
            this.setLoading("isGettingMyApplicationsLoading");
            const apps = await APIs.applications.getMyApplications();
            runInAction(() => {
                this.myApplications = apps.data;
            });
        } catch (error) {
            console.log("error", error);
        } finally {
            this.setLoading("isGettingMyApplicationsLoading");
        }
    };

    setSelectedResume = (resume: FullResumeType) => {
        runInAction(() => {
            this.selectedResume = resume;
        });
    };
}
