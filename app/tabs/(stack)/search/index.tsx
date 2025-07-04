import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBar } from "@/components/searchBar";
import useProductsStore from "@/store/productsStore";
import {
  obtenerRecetasPorAliasUsuario,
  obtenerRecetasPorIngrediente,
  obtenerRecetasPorNoIngrediente,
  obtenerRecetasPorTitulo,
  RecetaRespuestaDTO,
} from "@/utils/api/recetas";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const ProfileSearchScreen = () => {
  const { searchRecipes, handleSearchRecipes } = useProductsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string>("receta");
  const [inputFiltro, setInputFiltro] = useState("");
  const [loadingFiltro, setLoadingFiltro] = useState(false);
  const [errorFiltro, setErrorFiltro] = useState<string | null>(null);

  // Leer parámetro de búsqueda del SearchBar (query en la URL)
  const { query } = useLocalSearchParams<{ query: string }>();

  const aplicarFiltroHandler = async () => {
    setLoadingFiltro(true);
    setErrorFiltro(null);

    try {
      let recetas: RecetaRespuestaDTO[] = [];

      // Usar parámetro del SearchBar como búsqueda principal para receta o usuario
      const valorBusqueda = query?.trim() || "";

      if (filtroSeleccionado === "receta") {
        recetas = await obtenerRecetasPorTitulo(valorBusqueda);
      } else if (filtroSeleccionado === "alias") {
        recetas = await obtenerRecetasPorAliasUsuario(valorBusqueda);
      } else if (filtroSeleccionado === "ingrediente_si") {
        if (!inputFiltro.trim()) {
          setErrorFiltro("Por favor ingresa el ingrediente.");
          setLoadingFiltro(false);
          return;
        }
        recetas = await obtenerRecetasPorIngrediente(inputFiltro.trim());
      } else if (filtroSeleccionado === "ingrediente_no") {
        if (!inputFiltro.trim()) {
          setErrorFiltro("Por favor ingresa el ingrediente.");
          setLoadingFiltro(false);
          return;
        }
        recetas = await obtenerRecetasPorNoIngrediente(inputFiltro.trim());
      }

      handleSearchRecipes(recetas);
      setModalVisible(false);
      setInputFiltro(""); // Limpiar input tras aplicar filtro
    } catch (error) {
      console.error(error);
      setErrorFiltro("Hubo un error al aplicar el filtro.");
    } finally {
      setLoadingFiltro(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {/* Header */}
        <View className="px-4 pt-2">
          <SearchBar />

          <Text className="text-xl font-bold text-gray-800 mb-4">Recetas</Text>

          {/* Filtrar */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row">
              <TouchableOpacity
                className="flex-row items-center mr-4"
                onPress={() => {
                  setModalVisible(true);
                  setErrorFiltro(null);
                }}
              >
                <Text className="text-gray-700 mr-1">Filtrar</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-500">
              {searchRecipes.length}{" "}
              {searchRecipes.length === 1 ? "resultado" : "resultados"}
            </Text>
          </View>
        </View>

        {/* Lista de recetas */}
        <View className="flex-row flex-wrap justify-between mb-24 px-4">
          {searchRecipes.length === 0 ? (
            <Text className="text-gray-500">No hay recetas encontradas.</Text>
          ) : (
            searchRecipes.map((recipe) => (
              <Link
                href={`/tabs/(stack)/recipes/${recipe.idReceta}`}
                key={recipe.idReceta}
                className="mb-4 w-[48%]"
              >
                <RecipeCard icon="open-outline" iconFill="open" {...recipe} />
              </Link>
            ))
          )}
        </View>

        {/* Modal de filtros */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setInputFiltro("");
            setErrorFiltro(null);
          }}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-4 w-72">
              <Text className="text-lg font-bold mb-3 text-center">Filtrar por:</Text>

              {/* Opciones de filtro */}
              <TouchableOpacity
                className="py-2"
                onPress={() => setFiltroSeleccionado("receta")}
              >
                <Text className={filtroSeleccionado === "receta" ? "font-bold text-black" : "text-gray-700"}>
                  Nombre de Receta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={() => setFiltroSeleccionado("alias")}
              >
                <Text className={filtroSeleccionado === "alias" ? "font-bold text-black" : "text-gray-700"}>
                  Recetas de Usuario
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={() => setFiltroSeleccionado("ingrediente_si")}
              >
                <Text className={filtroSeleccionado === "ingrediente_si" ? "font-bold text-black" : "text-gray-700"}>
                  Con Ingrediente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={() => setFiltroSeleccionado("ingrediente_no")}
              >
                <Text className={filtroSeleccionado === "ingrediente_no" ? "font-bold text-black" : "text-gray-700"}>
                  Sin Ingrediente
                </Text>
              </TouchableOpacity>

              {/* Input solo para ingredientes */}
              {(filtroSeleccionado === "ingrediente_si" || filtroSeleccionado === "ingrediente_no") && (
                <TextInput
                  placeholder="Nombre del ingrediente..."
                  value={inputFiltro}
                  onChangeText={setInputFiltro}
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-4"
                />
              )}

              {/* Error */}
              {errorFiltro && (
                <Text className="text-red-600 text-center mt-2">{errorFiltro}</Text>
              )}

              {/* Botones */}
              {loadingFiltro ? (
                <ActivityIndicator size="small" color="#000" className="mt-4" />
              ) : (
                <TouchableOpacity
                  onPress={aplicarFiltroHandler}
                  className="bg-black rounded-lg py-3 mt-4"
                >
                  <Text className="text-white font-semibold text-center">Aplicar filtro</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setInputFiltro("");
                  setErrorFiltro(null);
                }}
                className="mt-2"
              >
                <Text className="text-center text-gray-500">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default ProfileSearchScreen;
