import { useMutation } from "@tanstack/react-query";
import { RegisterFormData } from "@/types/registerform.types";
import { userService } from "../services/authService";
import { AxiosError } from "axios";
import { ApiError } from "@/api/axios";

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterFormData) => userService.register(data),
        onSuccess: (data) => {
            console.log("User registered:", data);
        },
        onError: (error) => {
            const err = error as AxiosError<ApiError>;
            console.error("Registration failed:", err.response?.data?.error || "Unknown error");
        },
    });
};
