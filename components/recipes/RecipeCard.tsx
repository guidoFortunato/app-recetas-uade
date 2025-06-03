import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Recipe {
  id: number;
  name: string;
  author: string;
  rating: number;
  image: string;
  isBookmarked?: boolean;
}

export const RecipeCard = ({ recipe, cardWidth }: { recipe: Recipe, cardWidth: number }) => {
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(recipe.isBookmarked || false);

  return (
    <View
      className="mb-4 bg-white rounded-xl shadow-sm"
      style={{ width: cardWidth }}
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
    </View>
  );
};