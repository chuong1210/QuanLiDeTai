// user.ts (for zustand)

import { create } from 'zustand';
import { AuthType } from '../interface';

interface UserState {
  user: AuthType | null;
  hasGroup: boolean;
  setUser: (user: AuthType | null) => void;
  setHasGroup: (hasGroup: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,  // Load user from localStorage if available
  hasGroup: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('hasGroup') || 'false') : false,
  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
  },  setHasGroup: (hasGroup) => {
    set({ hasGroup });
    localStorage.setItem('hasGroup', JSON.stringify(hasGroup)); // Persist to localStorage
  },
}));
