import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

interface Recipe {
  id: number;
  name: string;
  author?: string;
  rating: number;
  image: string;
  bookmarked?: boolean;
  icon?: "bookmark-outline" | "open-outline";
  iconFill?: "bookmark" | "open";
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const RecipeCard = ({
  id,
  name,
  author,
  rating,
  image,
  bookmarked,
  icon = "bookmark-outline",
  iconFill = "bookmark",
}: Recipe) => {
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked || false);

  return (
    <View
      className="mb-4 bg-white rounded-xl shadow-sm"
      style={{ width: cardWidth }}
    >
      <View className="relative">
        {!imageError ? (
          <Image
            source={{ uri: image }}
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
            name={isBookmarked ? iconFill : icon}
            size={16}
            color={isBookmarked ? "#000" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-xs text-gray-500 mb-1">{author}</Text>
        <Text className="text-sm font-semibold text-gray-800 mb-2">
          {name}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text className="text-sm font-medium text-gray-700 ml-1">
            {rating}
          </Text>
        </View>
      </View>
    </View>
  );
};
