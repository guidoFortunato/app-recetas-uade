import useProductsStore from "@/store/productsStore";
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { recipes } = useProductsStore();
  const recipe = recipes.find((recipe) => recipe.id === Number(id));

  // console.log({ recipe });

  if (!recipe) {
    console.log("Receta no encontrada")
  }

  useEffect(() => {
    navigation.setOptions({
      title: recipe?.name,
    });
  }, [recipe, id, navigation])

  const ingredients = [
    "250 g de masa para pizza básica",
    "100 ml de salsa de tomate",
    "150 g de queso mozzarella fresco",
    "2 tomates cherry",
    "Hojas de albahaca fresca",
    "Aceite de oliva virgen extra de primera presión",
    "Sal y pimienta al gusto",
  ];

  const steps = [
    {
      step: 1,
      title: "Paso 1",
      description:
        "Para la masa, colocar todos los ingredientes en la batidora, hacer un volcán con la harina y agregar la levadura disuelta en agua tibia.",
    },
    {
      step: 2,
      title: "Paso 2",
      description:
        "Colocar en un recipiente y dejar leudar durante la madrugada a temperatura ambiente. Formar la masa, estirar con las manos hasta que quede bien fina.",
    },
    {
      step: 3,
      title: "Paso 3",
      description:
        "Agregar la salsa de tomate, el queso mozzarella cortado en cubos de 2 centímetros, salar, agregar aceite de oliva, hornear a fuego fuerte hasta que la masa esté dorada y el queso derretido.",
    },
    {
      step: 4,
      title: "Paso 4",
      description:
        "Retirar del horno y agregar las hojas de albahaca fresca para decorar y dar sabor. Servir.",
    },
    {
      step: 5,
      title: "Paso 5",
      description:
        "Combinar todos los ingredientes secos en un tazón grande. Hacer un volcán en el centro y agregar los ingredientes húmedos. Mezclar hasta formar una masa homogénea. Amasar durante 10 minutos, dejar reposar 1 hora hasta que duplique su tamaño. La masa debe quedar suave y elástica.",
    },
    {
      step: 6,
      title: "Paso 6",
      description:
        "Estirar la masa hasta conseguir y distribuirla sobre la bandeja de horno previamente engrasada. Agregar todos los ingredientes en el orden indicado. Llevar al horno precalentado fuerte hasta que la masa esté dorada y el queso derretido. Decorar con hojas de albahaca fresca.",
    },
  ];

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

        {/* Content */}

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Recipe Image */}
          <View className="relative">
            {!imageError ? (
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=250&fit=crop&crop=center",
                }}
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
              <Text className="text-xs text-gray-500">Matías Castillo</Text>
              <TouchableOpacity
                onPress={() => setIsBookmarked(!isBookmarked)}
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
              Pizza Margarita
            </Text>

            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                8.5
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5">
              Una pizza clásica italiana que se dice que fue creada en honor a
              la reina Margarita de Saboya. Sus ingredientes representan los
              colores de la bandera italiana: el rojo del tomate, el blanco de
              la mozzarella y el verde de la albahaca. Es una receta simple pero
              deliciosa que resalta la calidad de sus ingredientes.
            </Text>
          </View>

          {/* Ingredients */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Ingredientes:
            </Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-gray-600 mr-2">•</Text>
                <Text className="text-sm text-gray-600 flex-1">
                  {ingredient}
                </Text>
              </View>
            ))}
          </View>

          {/* Preparation Steps */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Preparación
            </Text>
            {steps.map((step, index) => (
              <View key={step.step} className="mb-4">
                <Text className="text-sm font-semibold text-gray-800 mb-2">
                  {step.title}
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {step.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Reviews Section */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Reseñas
            </Text>
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
              <Text className="text-gray-800 font-medium mb-2">
                Descripción
              </Text>
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
              <Text className="text-gray-800 font-medium mb-2">
                Calificación
              </Text>
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
