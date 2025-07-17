import useAuthStore from "@/store/authStore";
import useProductsStore from "@/store/productsStore";
import { obtenerRecetasIntentarPorUsuario } from "@/utils/api/recetas";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";


const TabsLayout = () => {
  const { user } = useAuthStore();
  const { handleFavoritesRecipes } = useProductsStore();

  useEffect(() => {
    if (!user?.idUsuario) return;
    const cargarRecetas = async () => {
      try {
        const recetasUsuario = await obtenerRecetasIntentarPorUsuario(
          user.idUsuario
        );
        
        handleFavoritesRecipes(recetasUsuario);
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    };
    cargarRecetas();
  }, [user?.idUsuario, handleFavoritesRecipes]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "purple",
        tabBarShowLabel: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(stack)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="compass-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Crear receta",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="add-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="bookmark-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
