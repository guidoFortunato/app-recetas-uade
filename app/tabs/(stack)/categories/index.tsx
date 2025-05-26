import { SearchBar } from "@/components/searchBar";
import useProductsStore from "@/store/productsStore";
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


// Función para dividir el array en grupos
const chunkArray = (array: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const FoodCategoriesScreen = () => {
  const { productCategories } = useProductsStore();

  const categoryRows = chunkArray(productCategories, 3);

  const CategoryItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        className="items-center flex-1 mx-2"
        activeOpacity={0.7}
      >
        <View
          className="mb-2 items-center justify-center"
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
