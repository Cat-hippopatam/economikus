import { create } from 'zustand';
// Используем 'import type' для типов
import type { User } from '../shared/types'; 

interface AppState {
  users: User[];
  isLoading: boolean;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  fetchUsers: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  users: [],
  isLoading: false,
  
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      set({ users: data, isLoading: false });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ isLoading: false });
    }
  },
}));
