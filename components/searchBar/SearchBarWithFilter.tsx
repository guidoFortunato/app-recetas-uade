import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface SearchBarWithFilterProps {
  onSearch: (query: string, filterType: string) => void;
}

const filterOptions = [
  { id: "receta", label: "Nombre de Receta", icon: "restaurant-outline" },
  { id: "alias", label: "Usuarios", icon: "person-outline" },
  { id: "ingrediente_si", label: "Con Ingrediente", icon: "add-circle-outline" },
  { id: "ingrediente_no", label: "Sin Ingrediente", icon: "remove-circle-outline" },
];

export const SearchBarWithFilter = ({ onSearch }: SearchBarWithFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleSubmit = async () => {
    if (searchQuery.trim() === "") {
      alert("Por favor, ingrese un texto");
      return;
    }

    onSearch(searchQuery.trim(), selectedFilter.id);
    setSearchQuery("");
  };

  const handleFilterSelect = (filter: typeof filterOptions[0]) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  return (
    <View className="mb-4">
      {/* Filter Display */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="filter-outline" size={16} color="#666" />
        <Text className="text-sm text-gray-600 ml-1">
          Filtrando por: <Text className="font-semibold">{selectedFilter.label}</Text>
        </Text>
      </View>

      {/* Search Bar with Filter Dropdown */}
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        
        <TextInput
          placeholder={`Buscar ${selectedFilter.label.toLowerCase()}...`}
          className="flex-1 ml-2 text-gray-600"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />

        {/* Filter Dropdown Button */}
        <TouchableOpacity
          onPress={() => setShowFilterDropdown(true)}
          className="ml-2 p-1"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-down-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFilterDropdown}
        onRequestClose={() => setShowFilterDropdown(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-4 w-80 max-h-96">
            <Text className="text-lg font-bold mb-4 text-center">Seleccionar filtro</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  className={`flex-row items-center py-3 px-2 rounded-lg mb-1 ${
                    selectedFilter.id === filter.id ? "bg-gray-100" : ""
                  }`}
                  onPress={() => handleFilterSelect(filter)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={filter.icon as any} 
                    size={20} 
                    color={selectedFilter.id === filter.id ? "#000" : "#666"} 
                  />
                  <Text 
                    className={`ml-3 flex-1 ${
                      selectedFilter.id === filter.id ? "font-semibold text-black" : "text-gray-700"
                    }`}
                  >
                    {filter.label}
                  </Text>
                  {selectedFilter.id === filter.id && (
                    <Ionicons name="checkmark" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowFilterDropdown(false)}
              className="mt-4 bg-gray-200 rounded-lg py-3"
            >
              <Text className="text-center text-gray-700 font-medium">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}; 