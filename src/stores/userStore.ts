import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types/user';

interface UserStore {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (nickname: string, password: string) => boolean;
  register: (nickname: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  storedPassword: string;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      storedPassword: '',
      login: (nickname: string, password: string) => {
        const state = get();
        if (state.user?.nickname === nickname && state.storedPassword === password) {
          set({ isLoggedIn: true });
          return true;
        }
        return false;
      },
      register: (nickname: string, password: string) => {
        const user: UserProfile = {
          id: Date.now().toString(36),
          nickname,
          avatar: '🌟',
          createdAt: Date.now(),
        };
        set({ user, storedPassword: password, isLoggedIn: true });
        return true;
      },
      logout: () => set({ isLoggedIn: false }),
      updateProfile: (updates) => {
        const state = get();
        if (state.user) {
          set({ user: { ...state.user, ...updates } });
        }
      },
    }),
    { name: 'tarot-user' }
  )
);
