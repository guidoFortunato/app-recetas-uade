import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RecipeCard } from "@/components/recipes/RecipeCard";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

import useProductsStore from "@/store/productsStore";
import { obtenerRecetasPorUsuario } from "@/utils/api/recetas";
import { useFocusEffect } from "@react-navigation/native";

const UserProfileScreen = () => {
  const { user, logout, isGuest } = useAuthStore();
  const router = useRouter();

  const [avatarError, setAvatarError] = useState(false);
  const { handleUserRecipes, userRecipes, handleClearExploreRecipes } = useProductsStore();
  const [loadingRecetas, setLoadingRecetas] = useState(false);
  const [errorRecetas, setErrorRecetas] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const cargarRecetasSiSonNuevas = async () => {
        if (!user?.idUsuario) return;

        try {
          const recetasServidor = await obtenerRecetasPorUsuario(
            user.idUsuario
          );

          const recetasActualesStr = JSON.stringify(userRecipes);
          const recetasServidorStr = JSON.stringify(recetasServidor);

          const hayDiferencias = recetasActualesStr !== recetasServidorStr;

          if (hayDiferencias) {
            handleUserRecipes(recetasServidor);
          }

          setErrorRecetas(null);
        } catch (error) {
          setErrorRecetas((error as Error).message || "Error cargando recetas");
        }
      };

      cargarRecetasSiSonNuevas();
    }, [user?.idUsuario, userRecipes])
  );

  const handleLogoutPress = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            handleClearExploreRecipes();
            logout();
            router.replace("/auth/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLoginPress = () => {
    handleClearExploreRecipes();
    logout();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {isGuest ? (
        <>
          {/* Header */}
          <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between mt-10">
            <Text className="text-xl font-bold text-gray-800 text-center flex-1">
              {isGuest ? "" : "Perfil del usuario"}
            </Text>
            <TouchableOpacity onPress={handleLogoutPress}>
              <Ionicons name="log-out-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Guest Profile Section */}
          <View className="flex-1 justify-center items-center px-6">
            {/* Icon Container */}
            <View className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="person-outline" size={48} color="#49129c" />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
              ¡Bienvenido!
            </Text>

            {/* Description */}
            <Text className="text-gray-600 text-center mb-8 leading-6">
              Inicia sesión para acceder a tu perfil personal, crear y guardar
              tus recetas favoritas, y disfrutar de todas las funcionalidades de
              la aplicación.
            </Text>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLoginPress}
              className="bg-primary px-8 py-4 rounded-full shadow-lg"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="log-in-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Iniciar Sesión
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Header */}
          <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between mt-5">
            <Text className="text-xl font-bold text-gray-800 text-center flex-1">
              Perfil del usuario
            </Text>
            <TouchableOpacity onPress={handleLogoutPress}>
              <Ionicons name="log-out-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Profile Header Section */}
            <View className="relative mb-8">
              <View className="bg-gray-200 h-32 mx-4 rounded-2xl flex-row items-center justify-end relative mt-4" />

              <View className="absolute left-8 top-24">
                {!avatarError ? (
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={{
                        uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.mos.cms.futurecdn.net%2FQiBMZTjEuDquSpLTJYvwxZ.jpg&f=1&nofb=1",
                      }}
                      className="w-20 h-20 rounded-full"
                      onError={() => setAvatarError(true)}
                    />
                    <TouchableOpacity className="ml-2" activeOpacity={0.7}>
                      <Ionicons
                        name="pencil-outline"
                        size={20}
                        color="#666"
                        onPress={() => alert("Editar perfil")}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="w-16 h-16 rounded-full bg-purple-200 items-center justify-center">
                    <Ionicons name="person" size={32} color="#8B5CF6" />
                  </View>
                )}
              </View>
            </View>

            {/* User Info */}
            <View className="px-4 mb-6 mt-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-800">
                  {user?.alias}
                </Text>
              </View>
            </View>

            {/* Sección recetas */}
            <View className="px-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Tus Recetas
                </Text>
              </View>

              {/* Recipes Grid */}
              <View className="flex-row flex-wrap justify-between mb-24">
                {loadingRecetas && <Text>Cargando recetas...</Text>}
                {errorRecetas && (
                  <Text className="text-red-600">{errorRecetas}</Text>
                )}
                {!loadingRecetas &&
                  !errorRecetas &&
                  userRecipes.length === 0 && (
                    <Text>No tienes recetas todavía.</Text>
                  )}
                {!loadingRecetas &&
                  !errorRecetas &&
                  userRecipes.map((recipe) => (
                    <Link
                      key={recipe.idReceta}
                      href={{
                        pathname: "/tabs/profile/(stack)/recipes/[id]/usuario",
                        params: { id: recipe.idReceta.toString() },
                      }}
                      className="mb-5"
                    >
                      <RecipeCard isInProfile {...recipe} />
                    </Link>
                  ))}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default UserProfileScreen;
