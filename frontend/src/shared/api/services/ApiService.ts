import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { combineConfig, combineUrls } from "../../helper/api";
import { Env } from "../../../env";

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
    }

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
