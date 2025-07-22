import useAuthStore from "@/store/authStore";
import useProductsStore from "@/store/productsStore";
import { eliminarReceta, type RecetaRespuestaDTO } from "@/utils/api/recetas";
import {
  agregarRecetasFavoritas,
  quitarRecetaDeFavoritos,
} from "@/utils/api/usuarios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;
const cardHeight = 220; // Altura fija para las cards

interface Props extends RecetaRespuestaDTO {
  icon?: "bookmark-outline" | "open-outline";
  iconFill?: "bookmark" | "open";
  isInProfile?: boolean;
}

export const RecipeCard = ({
  idReceta,
  titulo,
  promedioValoracion,
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
  isInProfile = false,
}: Props) => {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    removeFromFavorites,
    addToFavorites,
    favoritesRecipes,
    deleteUserRecipe,
  } = useProductsStore();
  const { user, isGuest } = useAuthStore();

  useEffect(() => {
    const isInFavorites = favoritesRecipes.some(
      (recipe) => recipe.idReceta === idReceta
    );
    setIsBookmarked(isInFavorites);
  }, [favoritesRecipes, idReceta]);

  const imageUrl =
    multimedia?.find((m) => m.tipo === "foto")?.url ??
    "https://i.imgur.com/SmMtt1x.png";

  const handleBookmark = async () => {
    if (!user?.idUsuario) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      if (isBookmarked) {
        await quitarRecetaDeFavoritos(user.idUsuario, idReceta);
        removeFromFavorites(idReceta);
      } else {
        await agregarRecetasFavoritas(user.idUsuario, idReceta);
        addToFavorites({
          idReceta,
          titulo,
          promedioValoracion,
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
      }
    } catch (error) {
      console.error("Error al agregar receta a favoritos:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert("¿Estás seguro de que quieres eliminar esta receta?", "", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: () => {
          eliminarReceta(idReceta);
          deleteUserRecipe(idReceta);
        },
      },
    ]);
  };

  return (
    <View
      className="mb-4 bg-white rounded-xl border border-gray-200 overflow-hidden"
      style={{ width: cardWidth, height: cardHeight }}
    >
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-32 rounded-t-xl"
          resizeMode="cover"
        />

        {!isGuest ? (
          !isInProfile ? (
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
          ) : (
            <View className="absolute top-2 right-2 flex-row gap-1">
              <TouchableOpacity
                className="w-8 h-8 bg-white rounded-full items-center justify-center"
                onPress={() =>
                  router.push(
                    `/tabs/profile/(stack)/recipes/${idReceta}/modificar`
                  )
                }
                activeOpacity={0.7}
              >
                <Ionicons name="open-outline" size={16} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-8 h-8 bg-white rounded-full items-center justify-center"
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          )
        ) : null}
      </View>

      <View className="p-3 flex-1 justify-between">
        <View>
          <Text
            className="text-xs text-gray-500 mb-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {usuario?.alias ?? "Desconocido"}
          </Text>
          <Text
            className="text-sm font-semibold text-gray-800 mb-2"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {titulo}
          </Text>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text className="text-sm font-medium text-gray-700 ml-1">
            {typeof promedioValoracion === "number"
              ? promedioValoracion.toFixed(1)
              : "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};
