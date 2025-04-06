import { AxiosRequestConfig } from "axios";
import { Env } from "../../env";

const globalRequestConfig: AxiosRequestConfig = {
    headers: {
        Accept: "application/json",
        ContentType: "application/json",
    },
};

export const combineUrls = (url: string): string => {
    return `${Env.ApiUrl}${url}`;
};

export const combineConfig = (
    config: AxiosRequestConfig | undefined
): AxiosRequestConfig | undefined => {
    return { ...globalRequestConfig, ...config };
};
