import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export const SearchBar = () => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      <TextInput
        placeholder="Search"
        className="flex-1 ml-2 text-gray-600"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};
