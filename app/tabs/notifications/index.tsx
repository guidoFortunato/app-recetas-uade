import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBarWithFilter } from "@/components/searchBar";
import { UserCard } from "@/components/users/UserCard";
import useProductsStore from "@/store/productsStore";
import {
  obtenerRecetasPorIngrediente,
  obtenerRecetasPorNoIngrediente,
  obtenerRecetasPorTitulo,
} from "@/utils/api/recetas";
import { obtenerUsuarioPorAlias } from "@/utils/api/usuarios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

const NotificationsScreen = () => {
  const {
    searchRecipes,
    handleSearchRecipes,
    handleUsers,
    clearUsers,
    userSearch,
  } = useProductsStore();
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentQuery, setCurrentQuery] = useState<string>("");

  const handleSearch = async (query: string, filterType: string) => {
    setLoading(true);
    setCurrentFilter(filterType);
    setCurrentQuery(query);

    try {
      if (filterType === "receta") {
        const recetas = await obtenerRecetasPorTitulo(query);
        handleSearchRecipes(recetas);
        clearUsers();
      } else if (filterType === "alias") {
        const usuarios = await obtenerUsuarioPorAlias(query);
        console.log({usuarios});
        
        // Usuarios encontrados (puede ser array vacío si no se encuentra)
        handleUsers(usuarios);
        handleSearchRecipes([]);
      } else if (
        filterType === "ingrediente_si" ||
        filterType === "ingrediente_no"
      ) {
        // Para ingredientes, primero obtenemos recetas por título y luego filtramos
        const recetasBase = await obtenerRecetasPorTitulo(query);

        const recetasFiltradas =
          filterType === "ingrediente_si"
            ? await obtenerRecetasPorIngrediente(query)
            : await obtenerRecetasPorNoIngrediente(query);

        const idsFiltradas = new Set(recetasFiltradas.map((r) => r.idReceta));
        const recetas = recetasBase.filter((r) => idsFiltradas.has(r.idReceta));

        handleSearchRecipes(recetas);
        clearUsers();
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      // Limpiar todos los datos cuando hay error
      handleSearchRecipes([]);
      clearUsers();
      setCurrentQuery("");
      setCurrentFilter("");
      
      // Mostrar mensaje específico según el tipo de error
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Hubo un error al realizar la búsqueda");
      }
    } finally {
      setLoading(false);
    }
  };

  // Determinar qué tipo de contenido mostrar
  const mostrarUsuarios = currentFilter === "alias" && userSearch.length >= 0;
  const mostrarRecetas = !mostrarUsuarios && searchRecipes.length > 0;
  const noHayResultados =
    !mostrarUsuarios && !mostrarRecetas && currentQuery !== "";

  // const getFilterLabel = (filterType: string) => {
  //   switch (filterType) {
  //     case "receta":
  //       return "Nombre de Receta";
  //     case "alias":
  //       return "Usuarios";
  //     case "ingrediente_si":
  //       return "Con Ingrediente";
  //     case "ingrediente_no":
  //       return "Sin Ingrediente";
  //     default:
  //       return "";
  //   }
  // };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 pt-4">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View className="px-4 mt-8">
          <SearchBarWithFilter onSearch={handleSearch} />

          {/* Título dinámico */}
          {currentQuery && (
            <Text className="text-xl font-bold text-gray-800 mb-4">
              {currentFilter === "alias"
                ? `Usuario: ${currentQuery}`
                : `Resultados para "${currentQuery}"`}
            </Text>
          )}

          {/* Contador de resultados */}
          {currentQuery && (
            <Text className="text-sm text-gray-500 mb-4">
              {mostrarUsuarios
                ? `${userSearch.length} ${
                    userSearch.length === 1 ? "usuario" : "usuarios"
                  } encontrado${userSearch.length === 1 ? "" : "s"}`
                : `${searchRecipes.length} ${
                    searchRecipes.length === 1 ? "resultado" : "resultados"
                  } encontrado${searchRecipes.length === 1 ? "" : "s"}`}
              {/* {currentFilter &&
                ` por ${getFilterLabel(currentFilter).toLowerCase()}`} */}
            </Text>
          )}
        </View>

        {/* Loading indicator */}
        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
            <Text className="text-gray-600 mt-2">Buscando...</Text>
          </View>
        )}

        {/* Contenido */}
        {!loading && (
          <ScrollView className="flex-1 px-4 mb-4">
            {mostrarUsuarios ? (
              // Mostrar usuarios (puede estar vacío)
              <View>
                {userSearch.length > 0 ? (
                  userSearch.map((user) => (
                    <UserCard key={user.idUsuario} user={user} />
                  ))
                ) : currentQuery ? (
                  // No hay usuarios encontrados
                  <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-gray-500 text-center text-lg">
                      No se encontraron usuarios para &quot;{currentQuery}&quot;
                    </Text>
                    <Text className="text-gray-400 text-center mt-2">
                      Intenta con otro alias
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : mostrarRecetas ? (
              // Mostrar recetas
              <View className="flex-row flex-wrap justify-between">
                {searchRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idReceta} {...recipe} />
                ))}
              </View>
            ) : noHayResultados ? (
              // No hay resultados
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-center text-lg">
                  No se encontraron resultados para &quot;{currentQuery}&quot;
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Intenta con otros términos de búsqueda
                </Text>
              </View>
            ) : (
              // Estado inicial
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-center text-lg">
                  Selecciona un filtro y busca algo
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Encuentra recetas, usuarios o ingredientes
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

export default NotificationsScreen;
