// src/store/userStore.ts
import { create } from 'zustand';
import { UserProfile } from '@/services/auth.service';
import { IMovementRequest } from '@/models/MovementRequest';

interface UserState {
    user: UserProfile | null;
    isLoggedIn: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
    pendingRequests: IMovementRequest[]
    setPendingRequests: (requests: IMovementRequest[]) => void;
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
    pendingRequests: [],
    setPendingRequests: (requests: IMovementRequest[]) =>
        set({
            pendingRequests: requests,
        }),
}));