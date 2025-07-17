import {
  IngredienteRecetaDTO,
  ModificarRecetaDTO,
  PasoRecetaDTO,
  TipoMultimedia,
  actualizarReceta,
  obtenerRecetaPorId,
} from "@/utils/api/recetas";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CLOUD_NAME = "dr0h4tk9q";
const UPLOAD_PRESET = "recetas_unsigned";

export default function ModificarRecetaScreen() {
  const { id } = useLocalSearchParams();
  const idReceta = Number(id);

  // ─── Estados del formulario ─────────────────────────────
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState("1");
  const [publico, setPublico] = useState(true);
  const [categoria, setCategoria] = useState("");

  const [ingredientes, setIngredientes] = useState<IngredienteRecetaDTO[]>([]);
  const [pasos, setPasos] = useState<PasoRecetaDTO[]>([]);
  const [multimediaReceta, setMultimediaReceta] = useState<string[]>([]);

  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoImagenPasoId, setSubiendoImagenPasoId] = useState<
    string | null
  >(null);
  // ──────────────────────────────────────────────────────────

  // ─── Handlers Ingredientes ───────────────────────────────
  const addIngredient = () => {
    setIngredientes([
      ...ingredientes,
      { nombre: "", cantidad: 0, unidadMedida: "" },
    ]);
  };

  const updateIngredientNombre = (idx: number, nombre: string) => {
    const copy = [...ingredientes];
    copy[idx].nombre = nombre;
    setIngredientes(copy);
  };

  const updateIngredientCantidad = (idx: number, cantidadStr: string) => {
    const copy = [...ingredientes];
    copy[idx].cantidad = Number(cantidadStr) || 0;
    setIngredientes(copy);
  };

  const updateIngredientUnidad = (idx: number, unidad: string) => {
    const copy = [...ingredientes];
    copy[idx].unidadMedida = unidad;
    setIngredientes(copy);
  };

  const removeIngredient = (idx: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== idx));
  };
  // ──────────────────────────────────────────────────────────

  // ─── Handlers Pasos ──────────────────────────────────────
  const addStep = () => {
    setPasos([
      ...pasos,
      {
        numeroPaso: pasos.length + 1,
        descripcion: "",
        multimedia: [], // aquí inicializas multimedia
      },
    ]);
  };

  const updateStep = (idx: number, descripcion: string) => {
    const copy = [...pasos];
    copy[idx].descripcion = descripcion;
    setPasos(copy);
  };

  const removeStep = (idx: number) => {
    const copy = pasos
      .filter((_, i) => i !== idx)
      .map((p, i) => ({ ...p, numeroPaso: i + 1 }));
    setPasos(copy);
  };
  // ──────────────────────────────────────────────────────────

  // ─── Selección y subida de imagen principal ──────────────
  const seleccionarImagenReceta = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await subirImagenACloudinary(uri, null);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const subirImagenACloudinary = async (uri: string, pasoId: string | null) => {
    try {
      if (pasoId) setSubiendoImagenPasoId(pasoId);
      else setSubiendoImagen(true);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const result = await response.json();
      console.log("Cloudinary result:", result);

      if (result.secure_url) {
        if (pasoId) {
          setPasos((prev) =>
            prev.map((step) =>
              step.numeroPaso.toString() === pasoId
                ? {
                    ...step,
                    multimedia: [
                      ...(step.multimedia || []),
                      { url: result.secure_url, tipo: TipoMultimedia.imagen },
                    ],
                  }
                : step
            )
          );
        } else {
          setImagenUrl(result.secure_url);
        }
      } else {
        console.error("Cloudinary error:", result);
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
  // ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!idReceta) return;

    obtenerRecetaPorId(idReceta)
      .then((receta) => {
        setTitulo(receta.titulo);
        setDescripcion(receta.descripcion);
        setCantidadPersonas(String(receta.cantidadPersonas));
        setPublico(receta.publico);
        setCategoria(receta.categoria.nombre);

        setIngredientes(
          receta.ingredientes.map((i) => ({
            nombre: i.nombre,
            cantidad: i.cantidad,
            unidadMedida: i.unidadMedida,
          }))
        );

        setPasos(receta.pasos);
        setMultimediaReceta(receta.multimedia.map((m) => m.url));

        const urlMain = receta.multimedia[0]?.url ?? null;
        setImagenUrl(urlMain);
      })
      .catch(() => Alert.alert("Error", "No se pudo cargar la receta."));
  }, [idReceta]);

  const handleModificar = async () => {
    if (
      !titulo ||
      !descripcion ||
      ingredientes.length === 0 ||
      pasos.length === 0
    ) {
      Alert.alert(
        "Campos incompletos",
        "Completá todos los campos obligatorios."
      );
      return;
    }

    const dto: ModificarRecetaDTO = {
      titulo,
      descripcion,
      cantidadPersonas: parseInt(cantidadPersonas, 10),
      publico,
      categoria,
      ingredientes: ingredientes.map((i, index) => ({
        idIngrediente: index,
        nombre: i.nombre,
      })),
      pasos,
      multimediaReceta: imagenUrl
        ? [{ url: imagenUrl, tipo: TipoMultimedia.imagen }]
        : [],
    };

    try {
      await actualizarReceta(idReceta, dto);
      Alert.alert("Éxito", "Receta modificada correctamente.");
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo modificar la receta.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between mt-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 text-center flex-1">
          Modificar receta
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
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
            <Text className="text-gray-500 font-medium">
              Subiendo imagen...
            </Text>
          ) : (
            <>
              <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 font-medium">
                Subir imagen
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Título */}
        <Text>Título</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        {/* Descripción */}
        <Text>Descripción</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            height: 80,
            padding: 8,
            marginBottom: 12,
          }}
        />

        {/* Cantidad de personas */}
        <Text>Cantidad de personas</Text>
        <TextInput
          value={cantidadPersonas}
          onChangeText={setCantidadPersonas}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        {/* Público */}
        <Text>Pública</Text>
        <Switch value={publico} onValueChange={setPublico} />

        {/* Categoría */}
        <Text style={{ marginTop: 12 }}>Categoría</Text>
        <TextInput
          value={categoria}
          onChangeText={setCategoria}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        {/* Ingredientes editables */}
        <Text className="text-lg font-bold text-gray-800 mt-4">
          Ingredientes
        </Text>
        {ingredientes.map((ing, idx) => (
          <View
            key={idx}
            className="flex-row items-center mb-2"
            style={{ gap: 8 }}
          >
            <TextInput
              className="flex-1 border border-gray-300 rounded p-2"
              placeholder="Ingrediente"
              value={ing.nombre}
              onChangeText={(t) => updateIngredientNombre(idx, t)}
            />
            <TextInput
              className="w-20 border border-gray-300 rounded p-2"
              placeholder="cant."
              keyboardType="numeric"
              value={String(ing.cantidad)}
              onChangeText={(t) => updateIngredientCantidad(idx, t)}
            />
            <View className="w-24 border border-gray-300 rounded">
              <Picker
                selectedValue={ing.unidadMedida}
                onValueChange={(v) => updateIngredientUnidad(idx, v)}
              >
                <Picker.Item label="unidad..." value="" />
                <Picker.Item label="g" value="g" />
                <Picker.Item label="ml" value="ml" />
                <Picker.Item label="l" value="l" />
                <Picker.Item label="cda" value="cda" />
                <Picker.Item label="cdta" value="cdta" />
              </Picker>
            </View>
            <TouchableOpacity
              className="p-2 bg-red-100 rounded"
              onPress={() => removeIngredient(idx)}
            >
              <Ionicons name="close-outline" size={20} color="#e11d48" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          className="mt-2 mb-4 px-4 py-2 bg-green-100 rounded items-center"
          onPress={addIngredient}
        >
          <Text className="text-green-700">+ Agregar ingrediente</Text>
        </TouchableOpacity>

        {/* Pasos editables */}
        <Text className="text-lg font-bold text-gray-800 mt-4">Pasos</Text>
        {pasos.map((paso, idx) => (
          <View key={idx} className="mb-3">
            <View className="flex-row items-center mb-1">
              <Text className="font-bold mr-2">{paso.numeroPaso}.</Text>
              <TouchableOpacity
                className="ml-auto p-2 bg-red-100 rounded"
                onPress={() => removeStep(idx)}
              >
                <Ionicons name="trash-outline" size={20} color="#e11d48" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="border border-gray-300 rounded p-2"
              placeholder="Descripción del paso"
              multiline
              value={paso.descripcion}
              onChangeText={(t) => updateStep(idx, t)}
            />
          </View>
        ))}
        <TouchableOpacity
          className="mt-2 mb-6 px-4 py-2 bg-green-100 rounded items-center"
          onPress={addStep}
        >
          <Text className="text-green-700">+ Agregar paso</Text>
        </TouchableOpacity>

        {/* Botón Modificar */}
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity onPress={handleModificar}>
            <View className="bg-purple-600 rounded-lg p-4 items-center">
              <Text className="text-white font-bold">Modificar receta</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
