import useAuthStore from "@/store/authStore";
import useProductsStore from "@/store/productsStore";
import {
    IngredienteRecetaDTO,
    multiplicarIngredientesReceta,
    obtenerRecetaPorId,
    obtenerValoracionesAprobadasPorReceta,
    RecetaRespuestaDTO,
    ValoracionRecetaDTO
} from "@/utils/api/recetas";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const RecipeDetailScreenUsuario = () => {
  const { user } = useAuthStore();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [recipe, setRecipe] = useState<RecetaRespuestaDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Nuevo estado: cantidad de personas y lista ajustada de ingredientes
  const [cantPersonas, setCantPersonas] = useState<number>(0);
  const [ingredientesAjustados, setIngredientesAjustados] = useState<IngredienteRecetaDTO[]>([]);

  // Store para favoritos
  const { removeFromFavorites, addToFavorites, favoritesRecipes } = useProductsStore();

  const [valoraciones, setValoraciones] = useState<ValoracionRecetaDTO[]>([]);

  // Carga receta y setea estados iniciales
  useEffect(() => {
    if (!id) return;
    const cargarReceta = async () => {
      setLoading(true);
      try {
        const rec = await obtenerRecetaPorId(Number(id));
        setRecipe(rec);
        setError(null);
        setImageError(false);
        // Inicializar cantidad de personas e ingredientes
        setCantPersonas(rec.cantidadPersonas);
        setIngredientesAjustados(rec.ingredientes);
      } catch (e) {
        console.error("Error al cargar receta", e);
        setError("No se pudo cargar la receta");
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    cargarReceta();
  }, [id]);

  // Carga reseñas
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const vals = await obtenerValoracionesAprobadasPorReceta(Number(id));
        setValoraciones(vals);
      } catch (e) {
        console.error("Error al cargar valoraciones", e);
      }
    })();
  }, [id]);

  // Configura el título y botón "volver" en el header
  useEffect(() => {
    navigation.setOptions({
      title: recipe?.titulo ?? "Detalle de receta",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : router.push("/tabs/profile")
          }
          style={{ marginLeft: 16 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, recipe, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Cargando receta...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-600">{error}</Text>
      </View>
    );
  }
  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No se encontró la receta</Text>
      </View>
    );
  }

  const imagenReceta = recipe.multimedia.find(m => m.tipo === "foto")?.url;
  const calcularTiempo = (fechaISO: string) => {
    const diffDias = Math.floor((Date.now() - new Date(fechaISO).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias === 0) return "Hoy";
    if (diffDias === 1) return "Ayer";
    return `Hace ${diffDias} días`;
  };
  const renderStars = (rating: number, size = 16, onPress?: (r: number) => void) => (
    <View className="flex-row">
      {[1,2,3,4,5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => onPress && onPress(star)}
          disabled={!onPress}
          activeOpacity={onPress ? 0.7 : 1}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color={star <= rating ? "#FFD700" : "#D1D5DB"}
            style={{ marginRight: 2 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  // Ajusta ingredientes vía API
  const actualizarIngredientes = async () => {
    if (cantPersonas <= 0) {
      alert("Ingresá una cantidad válida");
      return;
    }
    try {
      const ajustados = await multiplicarIngredientesReceta(recipe.idReceta, cantPersonas);
      setIngredientesAjustados(ajustados);
    } catch (e) {
      console.error("Error al ajustar ingredientes", e);
      alert("No se pudo ajustar los ingredientes");
    }
  };

  const ReviewCard = ({ review }: { review: any }) => {
    const [avatarError, setAvatarError] = useState(false);
    return (
      <View className="mb-6 p-4 bg-gray-50 rounded-lg">
        {renderStars(review.rating)}
        <Text className="text-sm text-gray-600 leading-5 mb-3">{review.description}</Text>
        <View className="flex-row items-center">
          {!avatarError && review.avatar ? (
            <Image
              source={{ uri: review.avatar }}
              className="w-8 h-8 rounded-full mr-2"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View className="w-8 h-8 rounded-full mr-2 bg-gray-300 items-center justify-center">
              <Ionicons name="person" size={16} color="#9CA3AF" />
            </View>
          )}
          <View>
            <Text className="text-sm font-medium text-gray-800">{review.author}</Text>
            <Text className="text-xs text-gray-500">{review.timeAgo}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Imagen */}
          <View className="relative">
            {!imageError && imagenReceta ? (
              <Image
                source={{ uri: imagenReceta }}
                className="w-full h-48"
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View className="w-full h-48 bg-orange-100 items-center justify-center">
                <Ionicons name="pizza-outline" size={60} color="#FB923C" />
              </View>
            )}
          </View>

          {/* Header */}
          <View className="px-4 py-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs text-gray-500">{recipe.usuario.alias}</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">{recipe.titulo}</Text>
            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                {typeof recipe.promedioValoracion === "number"
                  ? recipe.promedioValoracion.toFixed(1)
                  : "N/A"}
              </Text>
            </View>
            <Text className="text-sm text-gray-600 leading-5">{recipe.descripcion}</Text>
          </View>

          {/* Cantidad de personas */}
          <View className="px-4 mb-4">
            <Text className="text-gray-800 font-medium mb-2">Personas</Text>
            <View className="flex-row items-center">
              <TextInput
                value={cantPersonas.toString()}
                onChangeText={text => setCantPersonas(Number(text))}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-3 py-2 w-24 mr-2"
                placeholder="Cant."
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={actualizarIngredientes}
                className="bg-orange-500 px-4 py-2 rounded-lg"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold">Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredientes ajustados */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Ingredientes:</Text>
            {ingredientesAjustados.map((ing, idx) => (
              <View key={idx} className="flex-row items-start mb-2">
                <Text className="text-gray-600 mr-2">•</Text>
                <Text className="text-sm text-gray-600 flex-1">
                  {ing.cantidad} {ing.unidadMedida} de {ing.nombre}
                </Text>
              </View>
            ))}
          </View>

          {/* Preparación */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Preparación</Text>
            {recipe.pasos.map(paso => (
              <View key={paso.numeroPaso} className="mb-4">
                <Text className="text-sm font-semibold text-gray-800 mb-2">Paso {paso.numeroPaso}</Text>
                <Text className="text-sm text-gray-600 leading-5">{paso.descripcion}</Text>
              </View>
            ))}
          </View>

          {/* Reseñas */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Reseñas</Text>
            {valoraciones.length ? (
              valoraciones.map((v, i) => (
                <ReviewCard
                  key={i}
                  review={{
                    id: i,
                    title: "",
                    rating: v.puntaje,
                    description: v.comentario,
                    author: v.usuario.alias,
                    avatar: undefined,
                    timeAgo: calcularTiempo(v.fechaValoracion),
                  }}
                />
              ))
            ) : (
              <Text className="text-gray-600">No hay reseñas todavía.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default RecipeDetailScreenUsuario;
