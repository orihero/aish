import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { combineConfig, combineUrls } from "../../helper/api";
import { Env } from "../../../env";
import { TOKENS } from "../../store/localStore/LocalStore";

export default class ApiService {
    private readonly axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: Env.ApiUrl,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        this.axios.interceptors.request.use(
            (config: any) => {
                const token = window.localStorage.getItem(TOKENS);
                if (!token) {
                    return config;
                }
                const { accessToken } = JSON.parse(token);
                if (accessToken) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${accessToken}`,
                    };
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    public setAccessToken = (accessToken: string) => {
        this.axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    };

    public clearAccessToken = () => {
        delete this.axios.defaults.headers.common.Authorization;
    };

    public hasAuthorizationHeader = () =>
        !!this.axios.defaults.headers.common.Authorization;

    methods = {
        get: <R>(url: string, config?: AxiosRequestConfig) =>
            this.axios.get<R>(combineUrls(url), combineConfig(config)),

        post: <R, D = unknown>(
            url: string,
            data?: D,
            config?: AxiosRequestConfig
        ) => this.axios.post<R>(combineUrls(url), data, combineConfig(config)),

        put: <R, D = unknown>(
            url: string,
            data?: D,
            config?: AxiosRequestConfig
        ) => this.axios.put<R>(combineUrls(url), data, combineConfig(config)),

        patch: <R, D = unknown>(
            url: string,
            data?: D,
            config?: AxiosRequestConfig
        ) => this.axios.patch<R>(combineUrls(url), data, combineConfig(config)),

        delete: <R>(url: string, config?: AxiosRequestConfig) =>
            this.axios.delete<R>(combineUrls(url), combineConfig(config)),
    };
}
