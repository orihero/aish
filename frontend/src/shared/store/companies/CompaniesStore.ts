import { makeAutoObservable } from "mobx";
import { CompanyType } from "../../../types";
import APIs from "../../api/api";
import { AppRootStore } from "../store";

export class CompaniesStore {
    private readonly rootStore: AppRootStore;
    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
    }

    company: CompanyType = {} as CompanyType;

    companies: CompanyType[] = [];

    isLoading = false;

    getCompanyById = async (id: string) => {
        this.isLoading = true;
        try {
            const { data } = await APIs.companies.getCompanyById(id);
            this.company = data;
            return data;
        } catch (error) {
            console.error("Error fetching company:", error);
        } finally {
            this.isLoading = false;
        }
    };
}
