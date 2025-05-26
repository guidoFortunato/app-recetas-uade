import { SearchBar } from "@/components/searchBar";
import useProductsStore from "@/store/productsStore";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with padding

const HomeScreen = () => {
  const { productCategories, recipes } = useProductsStore();

  const RecipeCard = ({ recipe }: { recipe: any }) => {
    const [imageError, setImageError] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(recipe.isBookmarked);

    return (
      <TouchableOpacity
        className="mb-4 bg-white rounded-xl shadow-sm mr-3"
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
    <SafeAreaView className="flex-1 bg-white mt-10">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 pt-2">
        {/* Search Bar */}
        <SearchBar />

        {/* Navigation Tabs */}
        <View className="flex-row items-center mb-6 gap-4">
          <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
            <Ionicons name="heart-outline" size={20} color="#374151" />
            <Text className="ml-1 text-gray-800 font-medium">Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
            <Ionicons name="time-outline" size={20} color="#374151" />
            <Text className="ml-1 text-gray-800 font-medium">Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
            <Ionicons name="people-outline" size={20} color="#374151" />
            <Text className="ml-1 text-gray-800 font-medium">Seguidos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Featured Recipe Card */}
        <View className="mx-4 mb-10">
          <TouchableOpacity className="bg-gray-100 rounded-2xl p-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800 mb-1">
                Recetas con
              </Text>
              <Text className="text-xl font-bold text-gray-800">perejil</Text>
            </View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=120&h=120&fit=crop&crop=center",
              }}
              className="w-24 h-24 rounded-xl"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Food Categories */}
        <View className="mb-10">
          <View className="flex-row items-center px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Platos de Comida
            </Text>
            <Link href="/tabs/(stack)/categories" className="ml-2">
              <Ionicons
                name="chevron-forward-circle-outline"
                size={20}
                color="#9CA3AF"
              />
            </Link>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {productCategories.map((category) => (
              <TouchableOpacity key={category.id} className="items-center mr-6">
                <Image
                  source={{ uri: category.image }}
                  className="w-16 h-16 rounded-full mb-2"
                  resizeMode="cover"
                />
                <Text className="text-sm text-gray-700 font-medium">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Suggested Recipes */}
        <View className="mb-6">
          <View className="flex-row items-center px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Recetas Sugeridas
            </Text>
            <Link href="/tabs/(stack)/recipes" className="ml-2">
              <Ionicons
                className="ml-2"
                name="chevron-forward-circle-outline"
                size={20}
                color="#9CA3AF"
              />
            </Link>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
