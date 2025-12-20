// src/store/userStore.ts
import { create } from 'zustand';
import { User } from "@supabase/supabase-js";
import { UserProfile } from '@/services/auth.service';

interface UserState {
    user: UserProfile | null;
    isLoggedIn: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    login: (userData: UserProfile) =>
        set({
            user: userData,
            isLoggedIn: true,
        }),
    logout: () =>
        set({
            user: null,
            isLoggedIn: false,
        }),
}));