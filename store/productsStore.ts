import { create } from "zustand";

interface ProductCategory {
  id: number;
  name: string;
  image: string;
}

interface Recipe {
  id: number;
  name: string;
  author: string;
  rating: number;
  image: string;
}
interface ProductsState {
  productCategories: ProductCategory[];
  recipes: Recipe[];
  searchQuery: string;
  handleSearchQuery: (query: string) => void;
}

const useProductsStore = create<ProductsState>((set) => ({
  searchQuery: "",  
  productCategories: [
    {
      id: 1,
      name: "Empanadas",
      backgroundColor: "#FFB84D",
      icon: "restaurant-outline",
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "Arroz",
      backgroundColor: "#FF6B6B",
      icon: "nutrition-outline",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Pastas",
      backgroundColor: "#4ECDC4",
      icon: "restaurant-outline",
      image:
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 4,
      name: "Pizzas",
      backgroundColor: "#45B7D1",
      icon: "cafe-outline",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 5,
      name: "Ensaladas",
      backgroundColor: "#96CEB4",
      icon: "leaf-outline",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 6,
      name: "Carnes",
      backgroundColor: "#FFEAA7",
      icon: "restaurant-outline",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 7,
      name: "Mariscos",
      backgroundColor: "#DDA0DD",
      icon: "fish-outline",
      image:
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 8,
      name: "Postres",
      backgroundColor: "#F8BBD0",
      icon: "ice-cream-outline",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 9,
      name: "Bebidas",
      backgroundColor: "#B39DDB",
      icon: "wine-outline",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 10,
      name: "Panadería",
      backgroundColor: "#FFCC02",
      icon: "storefront-outline",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 11,
      name: "Sushi",
      backgroundColor: "#FF8A65",
      icon: "fish-outline",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 12,
      name: "Tacos",
      backgroundColor: "#A5D6A7",
      icon: "fast-food-outline",
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&h=100&fit=crop&crop=center",
    },
  ],
  recipes: [
    {
      id: 1,
      name: "Margarita",
      author: "Matías Castillo",
      rating: 8.6,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200&h=200&fit=crop&crop=center",
      isBookmarked: false,
    },
    {
      id: 2,
      name: "Pepperoni",
      author: "Nicolás Morel",
      rating: 9.8,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop&crop=center",
      isBookmarked: false,
    },
    {
      id: 3,
      name: "Hawaiana",
      author: "Nicolás Morel",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center",
      isBookmarked: false,
    },
    {
      id: 4,
      name: "4 quesos",
      author: "Ana García",
      rating: 7.8,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center",
      isBookmarked: false,
    },
    {
      id: 5,
      name: "Napolitana",
      author: "Carlos Rodríguez",
      rating: 8.9,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop&crop=center",
      isBookmarked: false,
    },
    {
      id: 6,
      name: "Vegetariana",
      author: "Laura Martínez",
      rating: 9.2,
      image:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&h=200&fit=crop&crop=center",
      isBookmarked: false,
    },
  ],

  handleSearchQuery: (query: string) => set({ searchQuery: query }),
}));

export default useProductsStore;
