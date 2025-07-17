import { useAuth } from "@/store/authStore";
import { obtenerCategorias } from "@/utils/api/categoriaRecetas";
import { obtenerIngredientes } from "@/utils/api/ingredientes";
import {
  crearReceta,
  CrearRecetaDTO,
  TipoMultimedia,
} from "@/utils/api/recetas";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
  multimediaUrls: string[]; // URLs de imágenes para este paso
}

const CLOUD_NAME = "dr0h4tk9q";
const UPLOAD_PRESET = "recetas_unsigned";

const UNIDADES = ["unidad/es", "grs", "cucharada/s", "cucharadita", "ml"];

const CreateRecipeScreen = () => {
  const { user } = useAuth();
  const [cantidadPersonas, setCantidadPersonas] = useState("1");

  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: Date.now().toString(), quantity: "", unit: "unidad/es", name: "" },
  ]);
  const [steps, setSteps] = useState<Step[]>([{ id: "1", description: "", multimediaUrls: [] }]);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoImagenPasoId, setSubiendoImagenPasoId] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");

  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<string[]>([]);

  const [esPublica, setEsPublica] = useState(true);

  useEffect(() => {
    obtenerCategorias().then((res) => {
      if (res && res.length > 0) {
        const nombres = res.map((c) => c.nombre);
        setCategorias(nombres);
        setCategoriaSeleccionada(nombres[0]);
      }
    });

    obtenerIngredientes().then((res) => {
      if (res && res.length > 0) {
        setIngredientesDisponibles(res.map((i) => i.nombre));
      }
    });
  }, []);

  const seleccionarImagenReceta = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageAsset = result.assets[0];
        await subirImagenACloudinary(imageAsset.uri, null);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };
  

  const seleccionarImagenPaso = async (stepId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageAsset = result.assets[0];
        await subirImagenACloudinary(imageAsset.uri, stepId);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen para paso:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen para el paso.");
    }
  };
  
  const subirImagenACloudinary = async (uri: string, pasoId: string | null) => {
    try {
      if (pasoId) {
        setSubiendoImagenPasoId(pasoId);
      } else {
        setSubiendoImagen(true);
      }
  
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const result = await response.json();
      console.log("Cloudinary result:", result); // 👈 útil para depurar
  
      if (result.secure_url) {
        if (pasoId) {
          setSteps((prev) =>
            prev.map((step) =>
              step.id === pasoId
                ? {
                    ...step,
                    multimediaUrls: [...step.multimediaUrls, result.secure_url],
                  }
                : step
            )
          );
        } else {
          setImagenUrl(result.secure_url);
        }
      } else {
        console.error("Cloudinary error (sin secure_url):", result);
        Alert.alert("Error", "No se pudo subir la imagen.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Hubo un problema al subir la imagen.");
    } finally {
      setSubiendoImagen(false);
      setSubiendoImagenPasoId(null);
    }
  };
  

  const eliminarImagenPaso = (stepId: string, url: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              multimediaUrls: step.multimediaUrls.filter((imgUrl) => imgUrl !== url),
            }
          : step
      )
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now().toString(), quantity: "", unit: "unidad/es", name: "" },
    ]);
  };

  const removeIngredientById = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const updateStep = (id: string, value: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, description: value } : step))
    );
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: Date.now().toString(), description: "", multimediaUrls: [] }]);
  };

  const removeStep = () => {
    setSteps((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const resetForm = () => {
    setRecipeName("");
    setDescription("");
    setCantidadPersonas("1");
    setCategoriaSeleccionada(categorias[0] || "");
    setImagenUrl(null);
    setIngredients([
      { id: Date.now().toString(), quantity: "", unit: "unidad/es", name: "" },
    ]);
    setSteps([{ id: "1", description: "", multimediaUrls: [] }]);
  };


  const handleCrearReceta = async () => {
    if (!recipeName || !description || !imagenUrl) {
      Alert.alert("Campos incompletos", "Completá todos los campos e imagen.");
      return;
    }
    if (!categoriaSeleccionada) {
      Alert.alert("Categoría requerida", "Seleccioná una categoría.");
      return;
    }
    if (!cantidadPersonas || isNaN(Number(cantidadPersonas)) || Number(cantidadPersonas) <= 0) {
       Alert.alert("Cantidad de personas inválida", "Ingresá un número válido de personas.");
      return;
    }

    for (const ing of ingredients) {
      if (!ing.name || !ing.quantity || !ing.unit) {
        Alert.alert(
          "Ingrediente incompleto",
          "Seleccioná un ingrediente, cantidad y unidad para todos."
        );
        return;
      }
      if (isNaN(Number(ing.quantity)) || Number(ing.quantity) <= 0) {
        Alert.alert("Cantidad inválida", "La cantidad debe ser un número positivo.");
        return;
      }
    }

    for (const step of steps) {
      if (!step.description.trim()) {
        Alert.alert("Paso incompleto", "Completá la descripción de todos los pasos.");
        return;
      }
    }

    try {
      const dto: CrearRecetaDTO = {
        idUsuario: user!.idUsuario,
        titulo: recipeName,
        descripcion: description,
        cantidadPersonas: parseInt(cantidadPersonas),
        publico: esPublica,
        categoria: categoriaSeleccionada,
        ingredientes: ingredients.map((ing) => ({
          nombre: ing.name,
          cantidad: parseFloat(ing.quantity),
          unidadMedida: ing.unit,
        })),
        pasos: steps.map((step, index) => ({
          numeroPaso: index + 1,
          descripcion: step.description,
          multimedia: step.multimediaUrls.map((url) => ({
            url,
            tipo: "foto" as TipoMultimedia,
          })),
        })),
        multimediaReceta: [
          {
            url: imagenUrl,
            tipo: "foto" as TipoMultimedia,
          },
        ],
      };

      await crearReceta(dto);
      resetForm();
      Alert.alert("Éxito", "Receta creada con éxito");
    } catch (error) {
      console.error("Error al crear receta:", error);
      Alert.alert("Error", "Ocurrió un error al crear la receta.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800 text-center">Crear Receta</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Imagen principal receta */}
        <TouchableOpacity
          className="mx-4 mt-6 mb-6 h-48 bg-gray-200 rounded-lg items-center justify-center"
          activeOpacity={0.7}
          onPress={seleccionarImagenReceta}
        >
          {imagenUrl ? (
            <Image
              source={{ uri: imagenUrl }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          ) : subiendoImagen ? (
            <Text className="text-gray-500 font-medium">Subiendo imagen...</Text>
          ) : (
            <>
              <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 font-medium">Subir imagen</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Formulario */}
        <View className="px-4">
          {/* Nombre */}
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

          {/* Descripción */}
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

          {/* Visibilidad */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">Visibilidad</Text>
            <TouchableOpacity
              onPress={() => setEsPublica((prev) => !prev)}
              className={`px-4 py-2 rounded-lg ${
                esPublica ? "bg-green-100" : "bg-gray-200"
              }`}
            >
              <Text className="text-gray-800 font-medium">
                {esPublica ? "Pública" : "Privada"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cantidad de personas */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">Cantidad de personas</Text>
            <TextInput
              value={cantidadPersonas}
              onChangeText={setCantidadPersonas}
              placeholder="Ej: 4"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Categoría */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">Categoría</Text>
            <View className="border border-gray-300 rounded-lg">
              <Picker
                selectedValue={categoriaSeleccionada}
                onValueChange={(val) => setCategoriaSeleccionada(val)}
              >
                {categorias.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Ingredientes */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-4">Ingredientes</Text>
            {ingredients.map((ingredient) => (
              <View
                key={ingredient.id}
                className="mb-4 border border-gray-300 rounded-lg px-3 py-3"
              >
                {!ingredient.name ? (
                  <>
                    <Picker
                      selectedValue={ingredient.name}
                      onValueChange={(value) =>
                        updateIngredient(ingredient.id, "name", value)
                      }
                    >
                      <Picker.Item label="Agregar ingrediente" value="" />
                      {ingredientesDisponibles.map((nombre) => (
                        <Picker.Item key={nombre} label={nombre} value={nombre} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      onPress={() => removeIngredientById(ingredient.id)}
                      className="mt-2 bg-red-500 rounded-md px-3 py-1 self-start"
                    >
                      <Text className="text-white font-semibold">Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-semibold text-gray-800">
                        {ingredient.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeIngredientById(ingredient.id)}
                        className="p-1"
                        accessibilityLabel={`Eliminar ingrediente ${ingredient.name}`}
                      >
                        <Ionicons name="close-circle" size={24} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <TextInput
                        value={ingredient.quantity}
                        onChangeText={(value) =>
                          updateIngredient(ingredient.id, "quantity", value)
                        }
                        placeholder="Cantidad"
                        keyboardType="numeric"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        placeholderTextColor="#9CA3AF"
                      />
                      <View className="flex-1 border border-gray-300 rounded-lg">
                        <Picker
                          selectedValue={ingredient.unit}
                          onValueChange={(value) =>
                            updateIngredient(ingredient.id, "unit", value)
                          }
                        >
                          {UNIDADES.map((unidad) => (
                            <Picker.Item key={unidad} label={unidad} value={unidad} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </>
                )}
              </View>
            ))}

            {/* Botón agregar ingrediente */}
            <TouchableOpacity
              onPress={addIngredient}
              className="flex-row items-center justify-center border border-gray-300 rounded-lg py-3"
              activeOpacity={0.7}
              accessibilityLabel="Agregar nuevo ingrediente"
            >
              <Ionicons name="add" size={20} color="#374151" />
              <Text className="text-gray-700 font-semibold ml-2">Agregar ingrediente</Text>
            </TouchableOpacity>
          </View>

          {/* Pasos */}
          <View className="mb-6">
            {steps.map((step, index) => (
              <View key={step.id} className="mb-6 border border-gray-300 rounded-lg p-3">
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

                {/* Imagenes del paso */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mt-3"
                >
                  {step.multimediaUrls.map((url, i) => (
                    <View key={i} className="relative mr-2">
                      <Image
                        source={{ uri: url }}
                        className="w-24 h-24 rounded-lg"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => eliminarImagenPaso(step.id, url)}
                        className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-1"
                        accessibilityLabel={`Eliminar imagen del paso ${index + 1}`}
                      >
                        <Ionicons name="close-circle" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => seleccionarImagenPaso(step.id)}
                    className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center"
                    activeOpacity={0.7}
                    accessibilityLabel={`Agregar imagen paso ${index + 1}`}
                  >
                    {subiendoImagenPasoId === step.id ? (
                      <Text className="text-gray-500 font-medium">Subiendo...</Text>
                    ) : (
                      <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ))}

            {/* Botones agregar / quitar paso */}
            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={addStep}
                className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center mr-2"
                activeOpacity={0.7}
                accessibilityLabel="Agregar paso"
              >
                <Ionicons name="add" size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={removeStep}
                className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center"
                activeOpacity={0.7}
                accessibilityLabel="Eliminar paso"
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón crear */}
          <View className="px-4 flex justify-end items-end">
            <TouchableOpacity
              className="bg-primary rounded-lg px-4 py-2"
              activeOpacity={0.7}
              onPress={handleCrearReceta}
              accessibilityLabel="Crear receta"
            >
              <Text className="text-white text-center font-medium">Crear Receta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRecipeScreen;
