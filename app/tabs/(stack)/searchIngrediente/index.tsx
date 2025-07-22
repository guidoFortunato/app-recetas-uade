import { RecipeCard } from "@/components/recipes/RecipeCard";
import useProductsStore from "@/store/productsStore";
import { obtenerRecetasPorIngrediente } from "@/utils/api/recetas";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { SearchBar } from "react-native-screens";

const SearchIngredienteScreen = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const { searchRecipesByIngredient, handleSearchRecipesByIngredient } = useProductsStore();
  
  useEffect(() => {
    const fetchRecipesByIngredient = async () => {
      const recipes = await obtenerRecetasPorIngrediente(query);
      // console.log({ recipes });
      handleSearchRecipesByIngredient(recipes);
    };
    fetchRecipesByIngredient();
  }, [query, handleSearchRecipesByIngredient]);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View className="px-4 pt-2">
          <SearchBar />

          <Text className="text-xl font-bold text-gray-800 mb-4">
            Recetas que contienen &quot;{query?.trim()}&quot;
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-gray-500">
              {searchRecipesByIngredient.length}{" "}
              {searchRecipesByIngredient.length === 1
                ? "resultado"
                : "resultados"}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 mb-24">
          <View className="flex-row flex-wrap justify-between">
            {searchRecipesByIngredient.length === 0 ? (
              <Text className="text-gray-500">No hay recetas encontradas.</Text>
            ) : (
              searchRecipesByIngredient.map((recipe) => (
                <Link
                  href={`/tabs/(stack)/recipes/${recipe.idReceta}`}
                  key={recipe.idReceta}
                  className="mb-4 w-[48%]"
                >
                  <RecipeCard {...recipe} />
                </Link>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SearchIngredienteScreen;
