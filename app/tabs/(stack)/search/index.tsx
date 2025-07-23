import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBar } from "@/components/searchBar";
import useProductsStore from "@/store/productsStore";
import {
  obtenerRecetasPorTitulo,
  RecetaRespuestaDTO,
} from "@/utils/api/recetas";

import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

const SearchScreen = () => {
  const { searchRecipes, handleSearchRecipes } = useProductsStore();

  const [loading, setLoading] = useState(false);

  const { query } = useLocalSearchParams<{ query: string }>();

  useEffect(() => {
    handleRecetas();
  }, [query]);

  const handleRecetas = async () => {
    try {
      setLoading(true);

      const valorBusqueda = query?.trim() || "";
      let recetas: RecetaRespuestaDTO[] = await obtenerRecetasPorTitulo(
        valorBusqueda
      );
      handleSearchRecipes(recetas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View className="px-4 pt-2">
          <SearchBar />

          <View className="flex-row items-center justify-between mb-4 mt-2">
            <View className="flex-row">
              <Text>Resultados de la búsqueda: {query}</Text>
              {/* <TouchableOpacity
                className="flex-row items-center mr-4"
                onPress={() => {
                  setModalVisible(true);
                  setErrorFiltro(null);
                }}
              >
                <Text className="text-gray-700 mr-1">Filtrar</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </TouchableOpacity> */}
            </View>

            <Text className="text-sm text-gray-500">
              {searchRecipes.length}{" "}
              {searchRecipes.length === 1 ? "resultado" : "resultados"}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 mb-24">
          <View className="flex-row flex-wrap justify-between">
            {searchRecipes.length === 0 ? (
              <Text className="text-gray-500">No hay recetas encontradas.</Text>
            ) : (
              searchRecipes.map((recipe) => (
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

export default SearchScreen;
