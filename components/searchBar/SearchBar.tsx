import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  const handleSubmit = () => {
    if (searchQuery.trim() === "") {
      alert("Por favor, ingrese un texto")
      return 
    }

    router.push(`/tabs/search?query=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      <TextInput
        placeholder="Buscar..."
        className="flex-1 ml-2 text-gray-600"
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
    </View>
  );
};
