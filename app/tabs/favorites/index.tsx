import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBar } from "@/components/searchBar";
import useAuthStore from "@/store/authStore";

import useProductsStore from "@/store/productsStore";

import { Link, Redirect } from "expo-router";

import {
  SafeAreaView,
  StatusBar,
  Text,
  View
} from "react-native";

const FavoritesScreen = () => {
  const { favoritesRecipes } = useProductsStore();
  const { isGuest } = useAuthStore();

  if (isGuest) {
    return <Redirect href="/" />; // o a donde quieras mandarlo
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 mt-10">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {/* Header */}
        <View className="px-4 pt-2">
          <SearchBar />

          {/* titulo */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Recetas Favoritas
          </Text>

          {/* Filtrar y ordenar */}
          {/* <View className="flex-row items-center justify-between mb-4">
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
          </View> */}
        </View>

        {/* Lista de recetas */}
        <View className="flex-row flex-wrap justify-between mb-24 px-5">
          {favoritesRecipes.length > 0 ? (
            favoritesRecipes.map((recipe) => (
              <Link
                href={`/tabs/(stack)/recipes/${recipe.idReceta}`}
                key={recipe.idReceta}
                className="mb-5"
              >
                <RecipeCard {...recipe} />
              </Link>
            ))
          ) : (
            <Text className="text-gray-500">No tienes recetas favoritas</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FavoritesScreen;
