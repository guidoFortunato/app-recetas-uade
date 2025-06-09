import { user } from "@/utils/test/data";
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
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with padding

const UserProfileScreen = () => {
  const [avatarError, setAvatarError] = useState(false);
  const [pizzaImageError, setPizzaImageError] = useState(false);

  const RecipeCard = ({ recipe }: { recipe: any }) => {
    const [imageError, setImageError] = useState(false);

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
              className="w-full h-24 rounded-t-xl"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View className="w-full h-24 rounded-t-xl bg-orange-100 items-center justify-center">
              <Ionicons name="restaurant-outline" size={30} color="#FB923C" />
            </View>
          )}

          {/* External Link Icon */}
          {recipe.hasExternalLink && (
            <View className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm">
              <Ionicons name="open-outline" size={12} color="#666" />
            </View>
          )}
        </View>

        <View className="p-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1">
            {recipe.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text className="text-xs font-medium text-gray-700 ml-1">
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
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800 text-center">
          Perfil del usuario
        </Text>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View className="relative mb-8">
          {/* Rectangulo gris del usuario */}
          <View className="bg-gray-200 h-32 mx-4 rounded-2xl flex-row items-center justify-end relative mt-4">
           {/* //Todo Imagen de fondo del perfil */}
          </View>

          {/* User Avatar - Positioned below y sobre el rectángulo gris */}
          <View className="absolute left-8 top-24">
            {!avatarError ? (
              <View className="flex-row items-center justify-center">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                  }}
                  className="w-20 h-20 rounded-full"
                  onError={() => setAvatarError(true)}
                />
                <TouchableOpacity className="ml-2" activeOpacity={0.7}>
                  <Ionicons name="pencil-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-16 h-16 rounded-full bg-purple-200 items-center justify-center">
                <Ionicons name="person" size={32} color="#8B5CF6" />
              </View>
            )}
          </View>
        </View>

        {/* User Info */}
        <View className="px-4 mb-6 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-800">
              {user.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text className="text-lg font-semibold text-gray-800 ml-1">
                9.0
              </Text>
            </View>
          </View>
        </View>

        {/* Recipes Section */}
        <View className="px-4">
          {/* Section Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">Tus Recetas</Text>
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
          </View>

          {/* Recipes Grid */}
          <View className="flex-row flex-wrap justify-between mb-24">
            {user.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
