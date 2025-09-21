import { makeAutoObservable, runInAction } from "mobx";
import { UserFullType, UpdateProfileType } from "../../../types";
import { AppRootStore } from "../store";
import APIs from "../../api/api";

export class AuthStore {
    private readonly rootStore: AppRootStore;
    user: UserFullType = {} as UserFullType;
    isLoginLoading = false;
    loginError: string | null = null;
    loginMessage: string | null = null; // For informational messages

    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
    }
    isGetMeLoading = false;

    isAuthorized: boolean = false;

    getMe = async () => {
        runInAction(() => {
            this.isGetMeLoading = true;
        });
        try {
            if (!this.rootStore.localStore.session.accessToken) return;
            const myData = await APIs.auth.getMyAccount();

            if (myData.data) {
                runInAction(() => {
                    this.user = myData.data;
                    this.isAuthorized = true;
                });
            }
            runInAction(() => {
                this.isGetMeLoading = false;
            });
        } catch (error) {
            console.log("error", error);
            runInAction(() => {
                this.isAuthorized = false;
                this.isGetMeLoading = false;
            });
        }
    };

    login = async (email: string, password: string) => {
        runInAction(() => {
            this.isLoginLoading = true;
            this.loginError = null;
        });

        try {
            const response = await APIs.auth.login({ email, password });
            
            if (response.data) {
                // Store tokens and user data
                await this.rootStore.localStore.setToken({
                    accessToken: (response.data as any).accessToken || (response.data as any).token || "",
                    refreshToken: (response.data as any).refreshToken || "",
                });
                
                await this.rootStore.localStore.setUser((response.data as any).user || response.data);
                
                runInAction(() => {
                    this.user = (response.data as any).user || response.data as UserFullType;
                    this.isLoginLoading = false;
                    this.isAuthorized = true;
                });
                
                return response.data;
            }
        } catch (error: any) {
            runInAction(() => {
                this.loginError = error.response?.data?.message || "Login failed. Please try again.";
                this.isLoginLoading = false;
            });
            throw error;
        }
    };

    updateProfile = async (data: UpdateProfileType) => {
        try {
            // Filter out empty phone values
            const cleanData = {
                firstName: data.firstName,
                lastName: data.lastName,
                ...(data.phone && data.phone.trim() && { phone: data.phone.trim() })
            };
            
            const response = await APIs.auth.updateProfile(cleanData);
            if (response.data) {
                runInAction(() => {
                    this.user = { ...this.user, ...response.data };
                });
                return response.data;
            }
        } catch (error: any) {
            console.error("Profile update error:", error);
            throw error;
        }
    };

    logout = async () => {
        try {
            await this.rootStore.localStore.removeToken();
            await this.rootStore.localStore.removeUser();
            runInAction(() => {
                this.user = {} as UserFullType;
                this.isAuthorized = false;
            });
        } catch (error) {
            console.log("Logout error", error);
        }
    };

    setUserResume = (resume: any) => {
        runInAction(() => {
            this.user.resume = resume;
        });
    };

    clearLoginError = () => {
        runInAction(() => {
            this.loginError = null;
        });
    };

    setLoginMessage = (message: string | null) => {
        runInAction(() => {
            this.loginMessage = message;
        });
    };

    clearLoginMessage = () => {
        runInAction(() => {
            this.loginMessage = null;
        });
    };
}
