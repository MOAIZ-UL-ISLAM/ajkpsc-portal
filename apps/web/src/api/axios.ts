import axios, { AxiosInstance, AxiosError, AxiosHeaders } from "axios";

export interface ApiError {
    error: string;
}

export class ApiClient {
    private static instance: AxiosInstance;

    private constructor() { }

    static getInstance(): AxiosInstance {
        if (!ApiClient.instance) {
            ApiClient.instance = axios.create({
                baseURL: "http://localhost:8000/api",
                headers: new AxiosHeaders({ "Content-Type": "application/json" }),
                withCredentials: true,
            });

            // Request interceptor
            ApiClient.instance.interceptors.request.use((config) => {
                const token = localStorage.getItem("accessToken");
                if (token && config.headers) {
                    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
                }
                return config;
            });


            // Response interceptor
            ApiClient.instance.interceptors.response.use(
                (response) => response,
                (error: AxiosError) => {
                    if (error.response?.status === 401) {
                        console.error("Unauthorized, please login");
                    }
                    return Promise.reject(error);
                }
            );
        }
        return ApiClient.instance;
    }
}

// Usage: ApiClient.getInstance()
