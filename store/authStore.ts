import React from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LoginResponseDTO } from "@/utils/api/usuarios";

// Extender LoginResponseDTO para incluir expires_in
interface AuthUser extends LoginResponseDTO {
  expires_in?: number; // Timestamp de expiración
}

interface SearchUser {
  id: number;
  name: string;
  rating: number;
  avatar: string;
  featuredImage: string;
  avatarBg: string;
}

// Datos de prueba
const user: AuthUser = {
  idUsuario: 1,
  alias: "test",
  email: "test@test.com",
  tipoUsuario: "USUARIO",
  estadoRegistro: "COMPLETADO",
  nombre: "Nicolas",
  apellido: "Alvarez",
  contrasena: "123456",
  expires_in: Date.now() + (24 * 60 * 60 * 1000), // 24 horas desde ahora
};
const searchUsers: SearchUser[] = [
  {
    id: 1,
    name: "Nicolas Alvarez",
    rating: 5.1,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    featuredImage:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=80&h=80&fit=crop&crop=center",
    avatarBg: "#E0E7FF",
  },
  {
    id: 2,
    name: "Federico Blanco",
    rating: 7.9,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    featuredImage:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&h=80&fit=crop&crop=center",
    avatarBg: "#FEF3C7",
  },
  {
    id: 3,
    name: "Rodrigo Campos",
    rating: 6.2,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
    featuredImage:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=80&h=80&fit=crop&crop=center",
    avatarBg: "#DBEAFE",
  },
];

interface AuthState {
  // state
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPassRecovery: boolean;
  searchUsers: SearchUser[];
  isGuest: boolean;

  // actions
  setUser: (user: AuthUser) => void;
  login: (userData: LoginResponseDTO, expiresIn?: number) => void;
  register: (userData: LoginResponseDTO, expiresIn?: number) => void;
  passRecovery: (email: string) => void;
  updatePassword: (newPassword: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuthExpiration: () => boolean;
  setIsGuest: (isGuest: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // state
      user: null,
      searchUsers,
      isAuthenticated: false,
      isLoading: false,
      isPassRecovery: false,
      isGuest: false,

      // actions
      setIsGuest: (isGuest: boolean) => set({ isGuest }),
      setUser: (user: AuthUser) => set({ user }),
      login: (userData: LoginResponseDTO, expiresIn: number = 24 * 60 * 60 * 1000) => {
        const authUser: AuthUser = {
          ...userData,
          expires_in: Date.now() + expiresIn, // expiresIn en milisegundos
        };
        
        set({
          user: authUser,
          isAuthenticated: true,
        });
      },
      
      register: (userData: LoginResponseDTO, expiresIn: number = 24 * 60 * 60 * 1000) => {
        const authUser: AuthUser = {
          ...userData,
          expires_in: Date.now() + expiresIn,
        };
        
        set({
          user: authUser,
          isAuthenticated: true,
        });
      },
      
      passRecovery: (email: string) =>
        set({
          isPassRecovery: true,
        }),
      
      updatePassword: (newPassword: string) =>
        set((state) => {
          if (!state.user) return state;
          
          const updatedUser = { ...state.user, contrasena: newPassword };
          return {
            user: updatedUser,
          };
        }),
      
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
        }),
      
      setLoading: (loading: boolean) =>
        set({
          isLoading: loading,
        }),
      
      checkAuthExpiration: () => {
        const state = get();
        if (!state.user || !state.user.expires_in) {
          return false;
        }
        
        const isExpired = Date.now() > state.user.expires_in;
        
        if (isExpired) {
          // Auto logout si el token expiró
          set({
            user: null,
            isAuthenticated: false,
          });
        }
        
        return !isExpired;
      },
    }),
    {
      name: "auth-storage", // nombre de la clave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Solo persistir estos campos
        // user: state.user,
        idUsuario: state.user?.idUsuario,
        isAuthenticated: state.isAuthenticated,
        expires_in: state.user?.expires_in,
      }),
      onRehydrateStorage: () => (state) => {
        // Verificar expiración al cargar desde localStorage
        if (state) {
          state.checkAuthExpiration();
        }
      },
    }
  )
);

export default useAuthStore;

// Hook personalizado para usar la autenticación con verificación automática
export const useAuth = () => {
  const auth = useAuthStore();
  
  // Verificar expiración cada vez que se accede al hook
  React.useEffect(() => {
    auth.checkAuthExpiration();
  }, [auth]);
  
  return auth;
};
