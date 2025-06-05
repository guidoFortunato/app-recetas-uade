import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Ingredient {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}

interface Step {
  id: string;
  description: string;
}

const CreateRecipeScreen = () => {
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", quantity: "", unit: "Unidad", name: "" },
    { id: "2", quantity: "", unit: "Unidad", name: "" },
  ]);
  const [steps, setSteps] = useState<Step[]>([{ id: "1", description: "" }]);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      quantity: "",
      unit: "Unidad",
      name: "",
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = () => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.slice(0, -1));
    }
  };

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      description: "",
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = () => {
    if (steps.length > 1) {
      setSteps(steps.slice(0, -1));
    }
  };

  const updateStep = (id: string, value: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, description: value } : step
      )
    );
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800 text-center">
          Crear Receta
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Upload Image Section */}
        <TouchableOpacity
          className="mx-4 mt-6 mb-6 h-48 bg-gray-200 rounded-lg items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
          <Text className="text-gray-500 mt-2 font-medium">Subir imagen</Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <View className="px-4">
          {/* Recipe Name */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">Nombre</Text>
            <TextInput
              value={recipeName}
              onChangeText={setRecipeName}
              placeholder="Nombre..."
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">Descripción</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700 h-24"
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          {/* Ingredients */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-4">Ingredientes</Text>

            {ingredients.map((ingredient, index) => (
              <View key={ingredient.id} className="flex-row mb-3 space-x-2">
                {/* Quantity */}
                <TextInput
                  value={ingredient.quantity}
                  onChangeText={(value) =>
                    updateIngredient(ingredient.id, "quantity", value)
                  }
                  placeholder="Cantidad"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Unit */}
                <TouchableOpacity className="flex-1 border border-gray-300 rounded-lg px-3 py-2 flex-row items-center justify-between">
                  <Text className="text-gray-700">{ingredient.unit}</Text>
                  <Ionicons
                    name="chevron-down-outline"
                    size={16}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>

                {/* Ingredient Name */}
                <TextInput
                  value={ingredient.name}
                  onChangeText={(value) =>
                    updateIngredient(ingredient.id, "name", value)
                  }
                  placeholder="Ingrediente"
                  className="flex-2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  style={{ flex: 2 }}
                />
              </View>
            ))}

            {/* Add/Remove Buttons */}
            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={addIngredient}
                className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center mr-2"
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={removeIngredient}
                className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center"
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Paso a paso */}
          <View className="mb-6">
            {steps.map((step, index) => (
              <View key={step.id} className="mb-6">
                <Text className="text-gray-800 font-medium mb-2">
                  Paso {index + 1}
                </Text>
                <TextInput
                  value={step.description}
                  onChangeText={(value) => updateStep(step.id, value)}
                  placeholder={`Instrucciones Paso ${index + 1}`}
                  multiline
                  numberOfLines={4}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700 h-32"
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                />
              </View>
            ))}

            {/* Add/Remove Step Buttons */}
            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={addStep}
                className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center mr-2"
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={removeStep}
                className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center"
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="px-4 flex justify-end items-end">
            <TouchableOpacity
              className="bg-primary rounded-lg px-4 py-2"
              activeOpacity={0.7}
              onPress={() => alert("Receta creada")}
            >
              <Text className="text-white text-center font-medium">
                Crear Receta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRecipeScreen;
