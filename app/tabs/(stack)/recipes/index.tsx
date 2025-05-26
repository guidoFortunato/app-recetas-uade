import { SearchBar } from "@/components/searchBar";
import useProductsStore from "@/store/productsStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with padding

const RecipesScreen = () => {
  const { recipes } = useProductsStore();

  const RecipeCard = ({ recipe }: { recipe: any }) => {
    const [imageError, setImageError] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(recipe.isBookmarked);

    return (
      <TouchableOpacity
        className="mb-4 bg-white rounded-xl shadow-sm"
        style={{ width: cardWidth }}
        activeOpacity={0.7}
      >
        <View className="relative">
          {!imageError ? (
            <Image
              source={{ uri: recipe.image }}
              className="w-full h-32 rounded-t-xl"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            // Fallback con icono de pizza
            <View className="w-full h-32 rounded-t-xl bg-orange-100 items-center justify-center">
              <Ionicons name="pizza-outline" size={40} color="#FB923C" />
            </View>
          )}

          {/* Bookmark button */}
          <TouchableOpacity
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
            onPress={() => setIsBookmarked(!isBookmarked)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color={isBookmarked ? "#000" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <View className="p-3">
          <Text className="text-xs text-gray-500 mb-1">{recipe.author}</Text>
          <Text className="text-sm font-semibold text-gray-800 mb-2">
            {recipe.name}
          </Text>

          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-sm font-medium text-gray-700 ml-1">
              {recipe.rating}
            </Text>
          </View>
        </View>
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
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Recetas de Pizza
        </Text>

        {/* Filter and Sort Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row">
            <TouchableOpacity className="flex-row items-center mr-4">
              <Text className="text-gray-700 mr-1">Filtrar</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-700 mr-1">Ordenar</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-500">99 resultados</Text>
        </View>
      </View>

      {/* Recipe Cards Grid */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipesScreen;
