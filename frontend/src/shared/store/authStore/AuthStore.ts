import { makeAutoObservable, runInAction, toJS } from "mobx";
import { User, UserFullType } from "../../../types";
import { AppRootStore } from "../store";
import APIs from "../../api/api";

export class AuthStore {
    private readonly rootStore: AppRootStore;
    user: UserFullType = {} as UserFullType;

    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
    }
    isGetMeLoading = false;

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
                });
            }
            runInAction(() => {
                this.isGetMeLoading = false;
            });
        } catch (error) {
            console.log("error", error);
        }
    };

    setUserResume = (resume: any) => {
        runInAction(() => {
            this.user.resume = resume;
        });
    };
}
