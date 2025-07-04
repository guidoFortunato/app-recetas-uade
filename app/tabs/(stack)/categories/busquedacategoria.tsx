import { RecipeCard } from "@/components/recipes/RecipeCard";
import { obtenerRecetasPorCategoria, RecetaRespuestaDTO } from "@/utils/api/recetas";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const BusquedaCategoriaScreen = () => {
  const { categoryName } = useLocalSearchParams<{ categoryName: string }>();
  const navigation = useNavigation();
  const [recetas, setRecetas] = useState<RecetaRespuestaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryName) return;

    const cargarRecetasPorCategoria = async () => {
      try {
        setLoading(true);
        const data = await obtenerRecetasPorCategoria(categoryName);
        setRecetas(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    cargarRecetasPorCategoria();
  }, [categoryName]);

  useEffect(() => {
    if (!categoryName) return;

    const readableCategory = categoryName.replace(/_/g, " ").toLowerCase();
    const capitalized = readableCategory.charAt(0).toUpperCase() + readableCategory.slice(1);

    navigation.setOptions({
      title: "Categoria",
      headerTitleAlign: "center",
    });
  }, [categoryName, navigation]);

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        {categoryName?.replace(/_/g, " ") || "Categoría"}
      </Text>

      {loading && <Text className="text-gray-600">Cargando recetas...</Text>}
      {error && <Text className="text-red-600">{error}</Text>}
      {!loading && !error && recetas.length === 0 && (
        <Text className="text-gray-600">No hay recetas para esta categoría.</Text>
      )}

      <View className="flex-row flex-wrap justify-between">
        {recetas.map((recipe) => (
          <Link
            href={`/tabs/(stack)/recipes/${recipe.idReceta}`}
            key={recipe.idReceta}
            className="mb-4 w-[48%]"
          >
            <RecipeCard
              {...recipe}
              
            />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

export default BusquedaCategoriaScreen;
