import {
  IngredienteRecetaDTO,
  ModificarRecetaDTO,
  PasoRecetaDTO,
  TipoMultimedia,
  actualizarReceta,
  obtenerRecetaPorId,
} from "@/utils/api/recetas";
import { obtenerIngredientes } from "@/utils/api/ingredientes";
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
import {obtenerCategorias} from "@/utils/api/categoriaRecetas";
import { obtenerIngredientePorNombre } from "@/utils/api/ingredientes";



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

  // Estado para todas las categorías
    const [categorias, setCategorias] = useState<string[]>([]);

  // Estado para unidades y listado de ingredientes disponibles
    const UNIDADES = ["unidad/es", "grs", "cucharada/s", "cucharadita", "ml"];
    const [ingredientesDisponibles, setIngredientesDisponibles] = useState<string[]>([]);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [subiendoImagenPasoId, setSubiendoImagenPasoId] = useState<
    string | null
  >(null);
  // ──────────────────────────────────────────────────────────

  // ─── Handlers Ingredientes ───────────────────────────────
    const addIngredient = () => {
        setIngredientes(prev => [
            ...prev,
            { nombre: "", cantidad: 0, unidadMedida: "" }  // sin idIngrediente
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

    const updateStepMultimedia = (stepIdx: number, url: string) => {
        setPasos(prev =>
            prev.map((p, i) =>
                i === stepIdx
                    ? { ...p, multimedia: p.multimedia.filter(m => m.url !== url) }
                    : p
            )
        );
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

    const seleccionarImagenPaso = async (stepId: string) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                await subirImagenACloudinary(uri, stepId);
            }
        } catch {
            Alert.alert("Error", "No se pudo seleccionar la imagen para el paso.");
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

        // 1) Carga la receta
        obtenerRecetaPorId(idReceta)
            .then((receta) => {

                //log
                console.log("Ingredientes recibidos:", receta.ingredientes);
                //-------
                setTitulo(receta.titulo);
                setDescripcion(receta.descripcion);
                setCantidadPersonas(String(receta.cantidadPersonas));
                setPublico(receta.publico);
                setCategoria(receta.categoria.nombre);
                setIngredientes(
                    receta.ingredientes.map((i) => ({
                        nombre:       i.nombre,
                        cantidad:     i.cantidad,
                        unidadMedida: i.unidadMedida
                    }))
                );

                setPasos(receta.pasos);
                const urlMain = receta.multimedia[0]?.url ?? null;
                setImagenUrl(urlMain);
            })
            .catch(() =>
                Alert.alert("Error", "No se pudo cargar la receta.")
            );

        // 2) Carga todas las categorías
        obtenerCategorias()
            .then((res) => {
                if (res && res.length > 0) {
                    setCategorias(res.map((c) => c.nombre));
                }
            })
            .catch(() =>
                Alert.alert("Error", "No se pudieron cargar las categorías")
            );

        // 3) Carga todos los ingredientes disponibles
        obtenerIngredientes()
            .then((res) => {
                if (res && res.length > 0) {
                    setIngredientesDisponibles(res.map((i) => i.nombre));
                }
            })
            .catch(() =>
                Alert.alert("Error", "No se pudieron cargar los ingredientes")
            );
    }, [idReceta]);



    const handleModificar = async () => {
        // 1) Validaciones básicas…
        if (!titulo.trim() || !descripcion.trim()) {
            Alert.alert("Campos incompletos", "Título y descripción son obligatorios");
            return;
        }
        if (ingredientes.length === 0) {
            Alert.alert("Falta ingrediente", "Agregá al menos un ingrediente");
            return;
        }
        if (pasos.length === 0) {
            Alert.alert("Falta paso", "Agregá al menos un paso");
            return;
        }

        // 2) Armar el DTO con el nuevo tipo de ingredientes
        const dto: ModificarRecetaDTO = {
            titulo,
            descripcion,
            cantidadPersonas: parseInt(cantidadPersonas, 10),
            publico,
            categoria,

            // Envías directamente tu estado de IngredienteRecetaDTO
            ingredientes: ingredientes.map(i => ({
                nombre:       i.nombre,
                cantidad:     i.cantidad,
                unidadMedida: i.unidadMedida,
            })),

            pasos: pasos.map(p => ({
                numeroPaso:  p.numeroPaso,
                descripcion: p.descripcion,
                multimedia:  p.multimedia,
            })),

            multimediaReceta: imagenUrl
                ? [{ url: imagenUrl, tipo: TipoMultimedia.imagen }]
                : []
        };

        try {
            await actualizarReceta(idReceta, dto);
            Alert.alert("Éxito", "Receta modificada correctamente");
            router.back();
        } catch (err: any) {
            console.error("Error actualizando receta", err.response?.data || err.message);
            Alert.alert("Error", err.response?.data?.message || "No se pudo actualizar la receta");
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
        <View style={{ marginBottom: 16, width: '100%' }}>
          <Text style={{
            color: '#374151',
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 6
          }}>
            Título
          </Text>
          <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Escribí el título..."
              placeholderTextColor="#9CA3AF"
              style={{
                height: 48,
                paddingHorizontal: 12,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                // iOS shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                // Android shadow
                elevation: 2
              }}
          />
        </View>

        {/* Descripción */}
        <View style={{ marginBottom: 16, width: '100%' }}>
          <Text style={{
            color: '#374151',
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 6
          }}>
            Descripción
          </Text>
          <TextInput
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Escribí la descripción..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={{
                height: 100,
                paddingHorizontal: 12,
                paddingTop: 12,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
          />
        </View>

        {/* Cantidad de personas */}
        <View style={{ marginBottom: 16, width: '100%' }}>
          <Text style={{
            color: '#374151',
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 6
          }}>
            Cantidad de personas
          </Text>
          <TextInput
              value={cantidadPersonas}
              onChangeText={setCantidadPersonas}
              placeholder="Ej: 4"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={{
                height: 48,
                paddingHorizontal: 12,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
          />
        </View>


        {/* Visibilidad */}
        <Text style={{ marginTop: 12, marginBottom: 4, fontSize: 16, fontWeight: '500' }}>
          Visibilidad
        </Text>
        <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
              borderRadius: 6,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginBottom: 12,
              backgroundColor: publico ? '#d1fae5' : '#e5e7eb'
            }}
            onPress={() => setPublico(prev => !prev)}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
            {publico ? 'Pública' : 'Privada'}
          </Text>
        </TouchableOpacity>


        {/* Categoría */}
        <View style={{ marginBottom: 24, width: '100%' }}>
          <Text style={{
            color: "#374151",
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 8,
          }}>
            Categoría
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            overflow: "hidden",
            width: '100%',          // ancho completo
          }}>
            <Picker
                selectedValue={categoria}
                onValueChange={(val) => setCategoria(val)}
                dropdownIconColor="#6B7280"
                style={{
                  height: 50,          // un poco más alto
                  width: '100%'        // ancho completo
                }}
            >
              <Picker.Item label="-- Seleccioná una categoría --" value="" />
              {categorias.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>


          {/* Ingredientes */}
          <View className="mb-6">
              <Text className="text-gray-800 font-semibold text-xl mb-4">
                  Ingredientes
              </Text>

              {ingredientes.map((ing, idx) => (
                  <View
                      key={idx}
                      className="mb-4 border border-gray-300 rounded-lg px-3 py-3 bg-white"
                  >
                      {!ing.nombre ? (
                          <>
                              {/* Selector de nombre */}
                              <Picker
                                  selectedValue={ing.nombre}
                                  onValueChange={val => updateIngredientNombre(idx, val)}
                              >
                                  <Picker.Item label="Agregar ingrediente" value="" />
                                  {ingredientesDisponibles.map(nombre => (
                                      <Picker.Item key={nombre} label={nombre} value={nombre} />
                                  ))}
                              </Picker>
                              <TouchableOpacity
                                  onPress={() => removeIngredient(idx)}
                                  className="mt-2 bg-red-500 rounded-md px-3 py-1 self-start"
                              >
                                  <Text className="text-white font-semibold">Cancelar</Text>
                              </TouchableOpacity>
                          </>
                      ) : (
                          <>
                              {/* Nombre + botón eliminar */}
                              <View className="flex-row justify-between items-center mb-2">
                                  <Text className="font-semibold text-gray-800 text-lg">
                                      {ing.nombre}
                                  </Text>
                                  <TouchableOpacity onPress={() => removeIngredient(idx)}>
                                      <Ionicons name="close-circle" size={24} color="#dc2626" />
                                  </TouchableOpacity>
                              </View>
                              {/* Cantidad + Unidad */}
                              <View className="flex-row items-center px-2 py-2">
                                  {/* Caja de cantidad (alto fijo) */}
                                  <TextInput
                                      value={String(ing.cantidad)}
                                      onChangeText={t => updateIngredientCantidad(idx, t)}
                                      placeholder="Cantidad"
                                      keyboardType="numeric"
                                      placeholderTextColor="#9CA3AF"
                                      className="w-24 border border-gray-300 rounded-lg px-3"
                                      style={{ height: 55 }}
                                  />
                                  {/* Espacio fijo */}
                                  <View className="w-4" />
                                  {/* Selector de unidad (mismo alto) */}
                                  <View className="w-40 border border-gray-300 rounded-lg overflow-visible">
                                      <Picker
                                          selectedValue={ing.unidadMedida}
                                          onValueChange={v => updateIngredientUnidad(idx, v)}
                                          style={{ height: 55, width: '100%' }}
                                          itemStyle={{ fontSize: 12 }}
                                          dropdownIconColor="#6B7280"
                                      >
                                          {UNIDADES.map(unidad => (
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
              >
                  <Ionicons name="add" size={20} color="#374151" />
                  <Text className="text-gray-700 font-semibold ml-2">Agregar ingrediente</Text>
              </TouchableOpacity>
          </View>







          {/* Pasos */}
          <View className="mb-6 px-4" style={{ marginHorizontal: -16 }}>
              <Text className="text-lg font-bold text-gray-800 mb-4">Preparación</Text>

              {pasos.map((paso, idx) => (
                  <View
                       key={paso.numeroPaso}
                       className="mb-6 border border-gray-300 rounded-lg p-3 bg-white w-full"
                       style={{ alignSelf: 'stretch' }}
                     >
                      {/* Título del paso y botón Eliminar paso */}
                      <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-sm font-semibold text-gray-800">
                              Paso {paso.numeroPaso}
                          </Text>
                          <TouchableOpacity
                              onPress={() => removeStep(idx)}
                              className="p-1 bg-red-100 rounded"
                          >
                              <Ionicons name="trash-outline" size={20} color="#e11d48" />
                          </TouchableOpacity>
                      </View>

                      {/* Input de descripción */}
                      <TextInput
                          value={paso.descripcion}
                          onChangeText={t => updateStep(idx, t)}
                          placeholder={`Instrucciones Paso ${paso.numeroPaso}`}
                          multiline
                          numberOfLines={4}
                          className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700 h-32 mb-3"
                          placeholderTextColor="#9CA3AF"
                          textAlignVertical="top"
                      />

                      {/* Galería horizontal de imágenes existentes */}
                      <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          className="mb-3"
                      >
                          {paso.multimedia.map((media, i) =>
                              media.tipo === TipoMultimedia.imagen ? (
                                  <View key={i} className="relative mr-2">
                                      <Image
                                          source={{ uri: media.url }}
                                          className="w-24 h-24 rounded-lg"
                                          resizeMode="cover"
                                      />
                                      <TouchableOpacity
                                          onPress={() => updateStepMultimedia(idx, media.url)}
                                          className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-1"
                                      >
                                          <Ionicons name="close-circle" size={20} color="#fff" />
                                      </TouchableOpacity>
                                  </View>
                              ) : null
                          )}

                          {/* Botón para agregar nueva foto */}
                          <TouchableOpacity
                              onPress={() => seleccionarImagenPaso(paso.numeroPaso.toString())}
                              className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center"
                              activeOpacity={0.7}
                          >
                              {subiendoImagenPasoId === paso.numeroPaso.toString() ? (
                                  <Text className="text-gray-500 font-medium">Subiendo...</Text>
                              ) : (
                                  <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
                              )}
                          </TouchableOpacity>
                      </ScrollView>
                  </View>
              ))}

              {/* Botones agregar / quitar paso */}
              <View className="flex-row mt-2 space-x-2">
                  <TouchableOpacity
                      onPress={addStep}
                      className=" w-10 h-10 border border-gray-300 rounded-lg items-center justify-center mr-1"
                      activeOpacity={0.7}
                  >
                      <Ionicons name="add" size={20} color="#374151" />
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => removeStep(pasos.length - 1)}
                      className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center"
                      activeOpacity={0.7}
                  >
                      <Ionicons name="remove" size={20} color="#374151" />
                  </TouchableOpacity>
              </View>
          </View>



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
