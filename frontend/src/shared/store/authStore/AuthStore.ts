import { makeAutoObservable, runInAction, toJS } from "mobx";
import { User, UserFullType } from "../../../types";
import { AppRootStore } from "../store";
import APIs from "../../api/api";

export class AuthStore {
    private readonly rootStore: AppRootStore;
    user: UserFullType = {} as UserFullType;
    isLoginLoading = false;
    loginError: string | null = null;

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
                    accessToken: response.data.token || "",
                    refreshToken: response.data.refreshToken || "",
                });
                
                await this.rootStore.localStore.setUser(response.data.user);
                
                runInAction(() => {
                    this.user = response.data.user;
                    this.isLoginLoading = false;
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

    logout = async () => {
        try {
            await this.rootStore.localStore.removeToken();
            await this.rootStore.localStore.removeUser();
            runInAction(() => {
                this.user = {} as UserFullType;
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
}
