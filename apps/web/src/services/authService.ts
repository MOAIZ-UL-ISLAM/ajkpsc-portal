import { RegisterFormData, UserResponse } from "../types/registerform.types";
import { ApiClient } from "../api/axios";
import { AxiosError } from "axios";
import { LoginFormData } from "@/zod/loginform";
import { LoginResponse } from "@/types/loginform.types";

export class UserService {
    private api = ApiClient.getInstance();

    async register(data: RegisterFormData): Promise<UserResponse> {
        try {
            const res = await this.api.post<UserResponse>("/accounts/register/", data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError<UserResponse>;
            throw err.response?.data || { error: "Something went wrong" };
        }
    }

    async login(data: LoginFormData): Promise<LoginResponse> {
        try {
            const res = await this.api.post<LoginResponse>('/accounts/login/', data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError<LoginResponse>;
            throw err.response?.data || { error: 'Login failed' };
        }
    }
}


export const userService = new UserService();
