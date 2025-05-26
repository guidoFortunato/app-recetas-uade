import { create } from "zustand";

interface User {
  id: number;
  email: string;
  password: string;
}

interface AuthState {
  // user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  // user: null,
  isAuthenticated: true,
  isLoading: false,
  login: (userData: User) =>
    set({
      // user: userData,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      // user: null,
      isAuthenticated: false,
    }),
  setLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),
}));

export default useAuthStore;
