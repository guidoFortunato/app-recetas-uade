import { create } from "zustand";

interface Recipe {
  id: number;
  name: string;
  rating: number;
  image: string;
  hasExternalLink: boolean;
}

interface User {
  id: number;
  email: string;
  password: string;
  code: string;
  name: string;
  avatar: string;
  pizzaImage: string;
  recipes: Recipe[];
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
const user: User = {
  id: 1,
  email: "test@test.com",
  password: "123456",
  code: "5",
  name: "Nicolas Alvarez",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  pizzaImage:
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=180&fit=crop&crop=center",
  recipes: [
    {
      id: 1,
      name: "Pizza Pepperoni",
      rating: 9.8,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=150&fit=crop&crop=center",
      hasExternalLink: true,
    },
    {
      id: 2,
      name: "Pasta Carbonara",
      rating: 9.6,
      image:
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=200&h=150&fit=crop&crop=center",
      hasExternalLink: true,
    },
    {
      id: 3,
      name: "Sopa de Calabaza",
      rating: 8.4,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=150&fit=crop&crop=center",
      hasExternalLink: true,
    },
    {
      id: 4,
      name: "Sushi Roll",
      rating: 9.2,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop&crop=center",
      hasExternalLink: true,
    },
  ],
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
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPassRecovery: boolean;
  searchUsers: SearchUser[];
  login: (userData: User) => void;
  passRecovery: (email: string) => void;
  updatePassword: (newPassword: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  user,
  searchUsers,
  isAuthenticated: false,
  isLoading: false,
  isPassRecovery: false,
  login: (userData: User) =>
    set({
      user: userData,
      isAuthenticated: true,
    }),
  passRecovery: (email: string) =>
    set({
      isPassRecovery: true,
    }),
  updatePassword: (newPassword: string) =>
    set((state) => {
      // Actualizar el usuario en el store
      const updatedUser = { ...state.user, password: newPassword };

      return {
        user: updatedUser,
      };
    }),
  logout: () =>
    set({
      isAuthenticated: false,
    }),
  setLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),
}));

export default useAuthStore;
