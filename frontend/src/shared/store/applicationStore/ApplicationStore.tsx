import { makeAutoObservable, runInAction } from "mobx";
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

    // Cache management
    private applicationsLoaded: boolean = false;
    private lastApplicationsFetch: number = 0;
    
    // Cache TTL (Time To Live) in milliseconds
    private readonly APPLICATIONS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    applyToVacancy = async (callback?: (chatId?: string) => void) => {
        // Validate required data before making API call
        if (!this.selectedResume?._id) {
            message.error("Please select a resume");
            return;
        }
        
        if (!this.respondVacancy?._id) {
            message.error("No vacancy selected");
            return;
        }

        try {
            this.setLoading("isApplyingLoading");
            const response = await APIs.applications.applyToVacancy(
                this.selectedResume._id,
                this.respondVacancy._id
            );
            
            console.log("Application response:", response.data);
            message.success("Application submitted successfully!");
            
            // Refresh applications list to update UI
            this.getMyApplications();
            
            // Invalidate and refresh chat store cache to include new chat
            this.rootStore.chatStore.invalidateChatsCache();
            await this.rootStore.chatStore.refreshChats();
            
            // Hide modal before navigation to prevent interference
            this.rootStore.visibleStore.hide("applyModal");
            
            // Pass chat ID to callback for navigation
            const chatId = response.data.chat?._id;
            console.log("Chat ID for navigation:", chatId);
            
            if (callback && chatId) {
                callback(chatId);
            } else {
                console.error("No chat ID found in response or no callback provided");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to submit application";
            message.error(errorMessage);
            console.error("Apply error:", error);
            // Hide modal on error too
            this.rootStore.visibleStore.hide("applyModal");
        } finally {
            this.setLoading("isApplyingLoading");
        }
    };

    getMyApplications = async (forceRefresh: boolean = false) => {
        const now = Date.now();
        const isCacheValid = this.applicationsLoaded && 
            (now - this.lastApplicationsFetch) < this.APPLICATIONS_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            return;
        }

        try {
            this.setLoading("isGettingMyApplicationsLoading");
            const apps = await APIs.applications.getMyApplications();
            runInAction(() => {
                this.myApplications = apps.data;
                this.applicationsLoaded = true;
                this.lastApplicationsFetch = now;
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

    // Check if user has already applied to a specific vacancy
    hasAppliedToVacancy = (vacancyId: string): ApplicationType | null => {
        return this.myApplications.find(app => app.job._id === vacancyId) || null;
    };

    // Get chat ID for a specific vacancy if user has applied
    getChatIdForVacancy = (vacancyId: string): string | null => {
        const application = this.hasAppliedToVacancy(vacancyId);
        return application?.chat?._id || null;
    };

    // Cache management methods
    clearApplicationsCache = () => {
        this.applicationsLoaded = false;
        this.lastApplicationsFetch = 0;
    };

    invalidateApplicationsCache = () => {
        this.applicationsLoaded = false;
        this.lastApplicationsFetch = 0;
    };

    // Force refresh method for when user explicitly wants fresh data
    refreshApplications = () => this.getMyApplications(true);
}
