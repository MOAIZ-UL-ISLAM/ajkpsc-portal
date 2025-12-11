import { create } from 'zustand';
import { User } from '@/types/loginform.types';

interface UserState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User, access: string, refresh: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    setUser: (user, access, refresh) => set({ user, accessToken: access, refreshToken: refresh }),
    logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
