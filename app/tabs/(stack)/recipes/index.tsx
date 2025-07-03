import { RecipeCard } from "@/components/recipes/RecipeCard";
import { EstadoReceta, obtenerPorEstadoYVisibilidad, RecetaRespuestaDTO } from "@/utils/api/recetas";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const RecipesScreen = () => {
  const [recetas, setRecetas] = useState<RecetaRespuestaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        setLoading(true);
        const data = await obtenerPorEstadoYVisibilidad(EstadoReceta.aprobada, true);
        setRecetas(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    cargarRecetas();
  }, []);

  return (
    <ScrollView>
      {loading && <Text>Cargando recetas...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {!loading && !error && recetas.length === 0 && <Text>No hay recetas disponibles.</Text>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {recetas.map((recipe) => (
          <RecipeCard
            key={recipe.idReceta}
            {...recipe}
            icon="open-outline"
            iconFill="open"
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default RecipesScreen;
