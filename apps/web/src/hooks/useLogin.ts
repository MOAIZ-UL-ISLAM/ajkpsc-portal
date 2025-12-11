import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { userService } from '../services/authService';
import { useUserStore } from '../store/userStore';
import { LoginFormData } from '@/zod/loginform';
import { AxiosError } from 'axios';
import { LoginResponse } from '@/types/loginform.types';

export const useLogin = (): UseMutationResult<
    LoginResponse,
    AxiosError<{ error: string }>,
    LoginFormData
> => {
    const setUser = useUserStore((state) => state.setUser);

    return useMutation({
        mutationFn: (data: LoginFormData) => userService.login(data),
        onSuccess: (data) => {
            setUser(data.user, data.access, data.refresh);
            console.log('Login successful', data);
        },
        onError: (error: AxiosError<{ error: string }>) => {
            console.error(error.response?.data?.error || 'Login failed');
            // do NOT return anything
        },
    });
};
