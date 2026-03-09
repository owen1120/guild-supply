import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from '../features/cart/store/useCartStore';
import { useProfileStore } from '../features/profile/store/useProfileStore';

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        
        localStorage.removeItem('token');

        useCartStore.getState().clearLocalCart();
        useProfileStore.getState().clearLocalProfile();
      },
    }),
    {
      name: 'guild-auth-storage', 
    }
  )
);