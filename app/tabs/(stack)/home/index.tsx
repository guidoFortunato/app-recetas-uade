import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const foodCategories = [
  {
    id: 1,
    name: "Empanadas",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Arroz",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Pastas",
    image:
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center",
  },
];
const suggestedRecipes = [
  {
    id: 1,
    title: "Arroz con Curry",
    author: "Guido Fortunato",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Pastel de Papa",
    author: "Guido Fortunato",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=150&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Ravioli",
    author: "Nicolás",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=200&h=150&fit=crop&crop=center",
  },
];

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 pt-2">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            className="flex-1 ml-2 text-gray-600"
            placeholderTextColor="#9CA3AF"
          />
        </View>

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
          <TouchableOpacity className="bg-gray-50 rounded-2xl p-4 flex-row items-center">
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
            <Ionicons
              className="ml-2"
              name="chevron-forward-circle-outline"
              size={20}
              color="#9CA3AF"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {foodCategories.map((category) => (
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
            <Ionicons
              className="ml-2"
              name="chevron-forward-circle-outline"
              size={20}
              color="#9CA3AF"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {suggestedRecipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} className="mr-4 w-48">
                <Image
                  source={{ uri: recipe.image }}
                  className="w-full h-32 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <Text className="text-xs text-gray-500 mb-1">
                  {recipe.author}
                </Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {recipe.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
