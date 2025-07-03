import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBar } from "@/components/searchBar";
// import useAuthStore from "@/store/authStore";
import useProductsStore from "@/store/productsStore";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const ProfileSearchScreen = () => {
  // const { query } = useLocalSearchParams();

  // const { searchUsers } = useAuthStore();
  const { searchRecipes } = useProductsStore();

  // const filteredUsers = searchUsers.filter((user) =>
  //   user.name.toLowerCase().includes(query.toString().toLowerCase())
  // );

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {/* Header */}
        <View className="px-4 pt-2">
          <SearchBar />

          {/* titulo */}
          <Text className="text-xl font-bold text-gray-800 mb-4">Recetas</Text>

          {/* Filtrar y ordenar */}
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

            {/* <Text className="text-sm text-gray-500">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "resultado" : "resultados"}
            </Text> */}
          </View>
        </View>

        {/* Lista de recetas */}
        <View className="flex-row flex-wrap justify-between mb-24">
            {/* {loadingRecetas && <Text>Cargando recetas...</Text>} */}
            {/* {errorRecetas && (
              <Text className="text-red-600">{errorRecetas}</Text>
            )} */}
              {/* {!loadingRecetas && !errorRecetas && recetas.length === 0 && (
                <Text>No tienes recetas todavía.</Text>
              )} */}
              {
              searchRecipes.map((recipe) => (
                <Link
                  href={`/tabs/(stack)/recipes/${recipe.idReceta}`}
                  key={recipe.idReceta}
                  className="mr-2"
                >
                  <RecipeCard
                    icon="open-outline"
                    iconFill="open"
                    {...recipe}
                  />
                </Link>
            ))}
          </View>

        {/* {filteredUsers.length > 0 ? (
          <View className="flex-1">
            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              style={{ paddingBottom: 0 }}
            >
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No se encontraron resultados</Text>
          </View>
        )} */}
      </SafeAreaView>
    </View>
  );
};

export default ProfileSearchScreen;
