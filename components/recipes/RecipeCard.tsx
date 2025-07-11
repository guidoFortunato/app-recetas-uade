import useAuthStore from "@/store/authStore";
import useProductsStore from "@/store/productsStore";
import { type RecetaRespuestaDTO } from "@/utils/api/recetas";
import {
  agregarRecetasFavoritas,
  quitarRecetaDeFavoritos,
} from "@/utils/api/usuarios";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

interface Props extends RecetaRespuestaDTO {
  icon?: "bookmark-outline" | "open-outline";
  iconFill?: "bookmark" | "open";
}

export const RecipeCard = ({
  idReceta,
  titulo,
  usuario,
  descripcion,
  cantidadPersonas,
  multimedia,
  pasos,
  ingredientes,
  publico,
  categoria,
  fechaCreacion,
  icon = "bookmark-outline",
  iconFill = "bookmark",
}: Props) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { removeFromFavorites, addToFavorites, favoritesRecipes } =
    useProductsStore();
  const { user } = useAuthStore();

  // Sincronizar el estado local con el estado global de favoritos
  useEffect(() => {
    const isInFavorites = favoritesRecipes.some(
      (recipe) => recipe.idReceta === idReceta
    );
    setIsBookmarked(isInFavorites);
  }, [favoritesRecipes, idReceta]);

  const imageUrl =
    multimedia?.find((m) => m.tipo === "imagen")?.url ??
    "https://i.imgur.com/SmMtt1x.png"; // fallback por si no hay imagen

  const handleBookmark = async () => {
    if (!user?.idUsuario) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      if (isBookmarked) {
        await quitarRecetaDeFavoritos(user.idUsuario, idReceta);
        removeFromFavorites(idReceta);

        // TODO: mostrar un mensaje de que se desmarcó como favorita
      } else {
        await agregarRecetasFavoritas(user.idUsuario, idReceta);
        // todo: poner disabled en el boton
        addToFavorites({
          idReceta,
          titulo,
          usuario,
          descripcion,
          cantidadPersonas,
          multimedia,
          pasos,
          ingredientes,
          publico,
          categoria,
          fechaCreacion,
        });

        // TODO: mostrar un mensaje de que se marcó como favorita
      }
    } catch (error) {
      console.error("Error al agregar receta a favoritos:", error);
    }
  };

  return (
    <View
      className="mb-4 bg-white rounded-xl border border-gray-200"
      style={{ width: cardWidth }}
    >
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-32 rounded-t-xl"
          resizeMode="cover"
        />

        {/* Botón de guardar */}
        <TouchableOpacity
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center"
          onPress={handleBookmark}
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
        <Text className="text-xs text-gray-500 mb-1">
          {usuario?.alias ?? "Desconocido"}
        </Text>
        <Text className="text-sm font-semibold text-gray-800 mb-2">
          {titulo}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text className="text-sm font-medium text-gray-700 ml-1">9.0</Text>
        </View>
      </View>
    </View>
  );
};
