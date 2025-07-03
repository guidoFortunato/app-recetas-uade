import { SearchBar } from "@/components/searchBar";
import { CategoriaReceta, obtenerCategorias } from "@/utils/api/categoriaRecetas"; // asumí que pusiste ahí la lógica del backend
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FoodCategoriesScreen = () => {
  const [categories, setCategories] = useState<{ name: string, image: string }[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data: CategoriaReceta[] = await obtenerCategorias();
        // Mapeá cada categoría del backend a tu estructura del front
        const formatted = data.map(cat => ({
          name: cat.nombre.replace(/_/g, " "), // ejemplo: "PESCADOS_Y_MARISCOS" → "PESCADOS Y MARISCOS"
          image: "https://via.placeholder.com/100", // reemplazá con imagen real si la tenés
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // La función para agrupar en filas de 3
  const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const categoryRows = chunkArray(categories, 3);

  const CategoryItem = ({ item }: { item: { name: string, image: string } }) => (
    <TouchableOpacity className="items-center flex-1 mx-2" activeOpacity={0.7}>
      <View className="mb-2 items-center justify-center">
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="px-4 pt-2">
        <SearchBar />
        <Text className="text-xl font-bold text-gray-800 mb-6">Platos de Comida</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {categoryRows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between mb-6">
            {row.map((item) => (
              <CategoryItem key={item.name} item={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FoodCategoriesScreen;
