import { SearchBar } from "@/components/searchBar";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Item {
  id: number;
  name: string;
  backgroundColor: string;
  icon: string;
  image: string;
}

const foodCategories: Item[] = [
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
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=100&h=100&fit=crop&crop=center",
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
];

// Función para dividir el array en grupos
const chunkArray = (array: Item[], size: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const FoodCategoriesScreen = () => {
  const categoryRows = chunkArray(foodCategories, 3);
  console.log(categoryRows);

  const CategoryItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        className="items-center flex-1 mx-2"
        activeOpacity={0.7}
      >
        <View
          className="mb-2 items-center justify-center "
          // style={{
          //   backgroundColor: item.backgroundColor,
          //   elevation: 3, // Sombra para Android
          //   shadowColor: "#000", // Sombra para iOS
          //   shadowOffset: { width: 0, height: 2 },
          //   shadowOpacity: 0.1,
          //   shadowRadius: 3,
          // }}
        >
          {/* <Ionicons name={item.icon as any} size={32} color="white" /> */}
          <Image
            source={{ uri: item.image }}
            className="w-20 h-20 rounded-full mb-2"
            resizeMode="cover"
          />
        </View>
        <Text className="text-sm text-gray-800 font-medium text-center">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 pt-2">
        {/* Search Bar */}
        <SearchBar />

        {/* Title */}
        <Text className="text-xl font-bold text-gray-800 mb-6">
          Platos de Comida
        </Text>
      </View>

      {/* Food Categories Grid */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 100 }}
      >
        {categoryRows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between mb-6">
            {row.map((item: any) => (
              <CategoryItem key={item.id} item={item} />
            ))}
            {/* Rellenar con elementos vacíos si la fila no está completa
            {row.length < 3 && 
              Array.from({ length: 3 - row.length }).map((_, index) => (
                <View key={`empty-${index}`} className="flex-1 mx-2" />
              ))
            } */}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FoodCategoriesScreen;
