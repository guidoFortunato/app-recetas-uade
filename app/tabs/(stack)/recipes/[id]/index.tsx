import useProductsStore from "@/store/productsStore";
import { obtenerRecetaPorId, RecetaRespuestaDTO } from "@/utils/api/recetas";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
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

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  // Estados para la receta, loading y error
  const [recipe, setRecipe] = useState<RecetaRespuestaDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para bookmark e imagen error
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Store para favoritos
  const { removeFromFavorites, addToFavorites, favoritesRecipes } = useProductsStore();

  // Estados para reseñas (se mantienen igual)
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      title: "Mejor Pizza del mundo",
      rating: 5,
      description:
        "Esta receta de pizza Margarita es fácil y deliciosa. La masa crujiente, la salsa de tomate bien sazonada y la mozzarella cremosa crean un sabor clásico que siempre encanta.",
      author: "Miranda Di Felice",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      timeAgo: "2 días",
    },
    {
      id: 2,
      title: "Esperaba Más",
      rating: 2,
      description:
        "La receta de pizza Margarita tiene buena base, pero la masa quedó algo seca y la salsa le faltó sabor. Tal vez necesite más condimentos.",
      author: "Agustín Pérez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      timeAgo: "3 días",
    },
  ]);

  // Sincronizar el estado local con el estado global de favoritos
  useEffect(() => {
    if (recipe) {
      const isInFavorites = favoritesRecipes.some(favRecipe => favRecipe.idReceta === recipe.idReceta);
      setIsBookmarked(isInFavorites);
    }
  }, [favoritesRecipes, recipe]);

  // Carga la receta desde la API según el id
  useEffect(() => {
    if (!id) return;

    const cargarReceta = async () => {
      setLoading(true);
      try {
        const receta = await obtenerRecetaPorId(Number(id));
        setRecipe(receta);
        setError(null);
        setImageError(false); // reset imagen error
      } catch (e) {
        setError("No se pudo cargar la receta");
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    cargarReceta();
  }, [id]);

  // Actualizar título de la pantalla
  useEffect(() => {
    navigation.setOptions({
      title: recipe?.titulo ?? "Detalle de receta",
    });
  }, [recipe, navigation]);

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

  // Buscar URL imagen principal
  const imagenReceta = recipe.multimedia.find((m) => m.tipo === "imagen")?.url;

  // Función para renderizar estrellas (igual que antes)
  const renderStars = (
    rating: number,
    size: number = 16,
    onPress?: (rating: number) => void
  ) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
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
  };

  // Componente para mostrar cada reseña (igual que antes)
  const ReviewCard = ({ review }: { review: any }) => {
    const [avatarError, setAvatarError] = useState(false);

    return (
      <View className="mb-6 p-4 bg-gray-50 rounded-lg">
        {renderStars(review.rating)}
        <Text className="text-lg font-bold text-gray-800 mt-2 mb-2">
          {review.title}
        </Text>
        <Text className="text-sm text-gray-600 leading-5 mb-3">
          {review.description}
        </Text>
        <View className="flex-row items-center">
          {!avatarError ? (
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
            <Text className="text-sm font-medium text-gray-800">
              {review.author}
            </Text>
            <Text className="text-xs text-gray-500">{review.timeAgo}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Maneja envío de reseña (igual)
  const handleSubmitReview = () => {
    if (!reviewTitle || !reviewDescription || userRating === 0) {
      alert("Por favor completa todos los campos");
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      title: reviewTitle,
      rating: userRating,
      description: reviewDescription,
      author: "Tu nombre",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      timeAgo: "Ahora",
    };

    setReviews([...reviews, newReview]);
    alert("Reseña enviada");
    setReviewTitle("");
    setReviewDescription("");
    setUserRating(0);
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
          {/* Recipe Image */}
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

          {/* Recipe Info */}
          <View className="px-4 py-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs text-gray-500">{recipe.usuario.alias}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (isBookmarked) {
                    removeFromFavorites(recipe.idReceta);
                  } else {
                    addToFavorites(recipe);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? "#000" : "#666"}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-gray-800 mb-2">
              {recipe.titulo}
            </Text>

            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                {/* acá podés calcular rating promedio real */}
                8.5
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              {recipe.descripcion}
            </Text>
          </View>

          {/* Ingredients */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Ingredientes:
            </Text>
            {recipe.ingredientes.map((ingrediente, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-gray-600 mr-2">•</Text>
                <Text className="text-sm text-gray-600 flex-1">
                  {ingrediente.cantidad} {ingrediente.unidadMedida} de{" "}
                  {ingrediente.nombre}
                </Text>
              </View>
            ))}
          </View>

          {/* Preparation Steps */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Preparación
            </Text>
            {recipe.pasos.map((paso) => (
              <View key={paso.numeroPaso} className="mb-4">
                <Text className="text-sm font-semibold text-gray-800 mb-2">
                  Paso {paso.numeroPaso}
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {paso.descripcion}
                </Text>
              </View>
            ))}
          </View>

          {/* Reviews Section */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Reseñas</Text>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>

          {/* Add Review Form */}
          <View className="px-4 mb-32">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Agregar Reseña
            </Text>

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-gray-800 font-medium mb-2">Título</Text>
              <TextInput
                value={reviewTitle}
                onChangeText={setReviewTitle}
                placeholder="Título de tu reseña..."
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-gray-800 font-medium mb-2">Descripción</Text>
              <TextInput
                value={reviewDescription}
                onChangeText={setReviewDescription}
                placeholder="Describe tu experiencia con esta receta..."
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700 h-24"
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
            </View>

            {/* Rating */}
            <View className="mb-4">
              <Text className="text-gray-800 font-medium mb-2">Calificación</Text>
              {renderStars(userRating, 24, setUserRating)}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitReview}
              className="bg-black rounded-lg py-3 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Enviar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default RecipeDetailScreen;
