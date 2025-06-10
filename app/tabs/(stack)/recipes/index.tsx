import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBar } from "@/components/searchBar";
import useProductsStore from "@/store/productsStore";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with padding

const RecipesScreen = () => {
  const { recipes } = useProductsStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 pt-2">
        {/* Search Bar */}
        <SearchBar />

        {/* Title */}
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Recetas de Pizza
        </Text>

        {/* Filter and Sort Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row">
            <TouchableOpacity className="flex-row items-center mr-4">
              <Text className="text-gray-700 mr-1">Filtrar</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-700 mr-1">Ordenar</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-500">99 resultados</Text>
        </View>
      </View>

      {/* Recipe Cards Grid */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {recipes.map((recipe) => (
            <Link
              href={`/tabs/(stack)/recipes/${recipe.id}`}
              key={recipe.id}
            >
              <RecipeCard key={recipe.id} {...recipe} />
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipesScreen;
