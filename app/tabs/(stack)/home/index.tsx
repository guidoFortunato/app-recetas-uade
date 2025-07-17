import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SearchBar } from "@/components/searchBar";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useAuth } from "@/store/authStore";
import { CategoriaReceta as CategoriaRecetaDTO, obtenerCategorias } from "@/utils/api/categoriaRecetas";
import { EstadoReceta, obtenerPorEstadoYVisibilidad, RecetaRespuestaDTO } from "@/utils/api/recetas";

const HomeScreen = () => {
  const router = useRouter();

  const [recetasSugeridas, setRecetasSugeridas] = useState<RecetaRespuestaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  console.log({user});

  const [categories, setCategories] = useState<{ name: string, image: string }[]>([]);

  useEffect(() => {
    const cargarRecetasSugeridas = async () => {
      try {
        setLoading(true);
        const data = await obtenerPorEstadoYVisibilidad(EstadoReceta.aprobada, true);
        setRecetasSugeridas(data);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    cargarRecetasSugeridas();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data: CategoriaRecetaDTO[] = await obtenerCategorias();
        const imagenesPorCategoria: Record<string, string> = {
          "ENTRADAS": "https://resizer.glanacion.com/resizer/v2/los-mejores-secretos-para-obtener-unas-papas-T2RCSI4O3ZFUXEU2VGYMOC5SWI.jpg?auth=9051497b24a625d80f7b7c19b26829cd19eaf11ca4e6707991a75d6d3f04fe45&width=1280&height=854&quality=70&smart=true",
          "PLATOS_PRINCIPALES": "https://www.recetasnestle.cl/sites/default/files/styles/cropped_recipe_card_new/public/srh_recipes/57d2453074b608263f3a814302cc7864.jpg.webp?itok=ZTNS93BL",
          "PASTAS": "https://cdn.colombia.com/sdi/2019/03/05/recetas-con-pasta-716227.jpg",
          "PIZZAS": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thehealthymaven.com%2Fwp-content%2Fuploads%2F2023%2F05%2Ftortilla-pizza-13.jpg&f=1&nofb=1&ipt=4ea270db2ddc09ccfb70962062ce70391d72869b5958f2de6609914562091786",
          "CARNES": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.sabornamesa.com.br%2Fmedia%2Fk2%2Fitems%2Fcache%2F7b98703f48b0025160f2b9b5aad2a874_XL.jpg&f=1&nofb=1&ipt=5100fa413886201797407a57906a217ccf497ad1320cad107b9de2ae2fba95e1",
          "PESCADOS_Y_MARISCOS": "https://esenciadelmar.es/wp-content/uploads/2023/08/formas-cocinar-pescado.jpg",
          "ENSALADAS": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.comedera.com%2Fwp-content%2Fuploads%2F2021%2F12%2Fensalada-de-lechuga1.jpg&f=1&nofb=1&ipt=18c5e635ceece539149575f262ee1e4849a1bd66655fbea023ebf0b2ef1500c9",
          "GUARNICIONES": "https://mccormick-cms.ext-sites-prd.cloudherdez.com/assets/63a8d442-eb21-48b7-b45e-5d6acb5a769f",
          "EMPANADAS": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fs.13.cl%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Flarge_body%2Fpublic%2Finline-images%2F2024-04%2FEMPANADAS%252520PORTADA%252520Getty%252520Images.jpg.jpeg%3Fitok%3DV86xYH_O&f=1&nofb=1&ipt=5a70fe7e229ee608a12fd882b890af12cb1beb042d62016c0fa1e14b7a65fe5e",
          "SOPAS": "https://comedera.com/wp-content/uploads/sites/9/2013/05/sopa-de-verduras-1.jpg",
          "POSTRES": "https://i.blogs.es/e90432/vasitos/450_1000.jpg",
          "VEGANO": "https://recetasveganas.net/wp-content/uploads/2019/04/bowl-vegano-recetas-vegetarianas-alubias-setas.jpg",
          "VEGETARIANO": "https://i.pinimg.com/236x/2a/23/a1/2a23a10d141bbc2b677ed4bb607ea17c.jpg",
          "SIN_GLUTEN": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsp-ao.shortpixel.ai%2Fclient%2Fto_auto%2Cq_glossy%2Cret_img%2Fhttps%3A%2F%2Fbabycocina.com%2Fwp-content%2Fuploads%2F2020%2F06%2Frecetas-sin-gluten.jpg&f=1&nofb=1&ipt=4df94cf130d10ea8b607a8cde15708973153264cc26f522b49a3651aae877c27",
          "SIN_LACTOSA": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fquesotresoscos.com%2Fwp-content%2Fuploads%2F2023%2F11%2FOscos-Barra-Sin-Lactosa-mit-scaled.webp&f=1&nofb=1&ipt=4aab7160d96a4a1ed488c2264f5e7991f438d504bec9fd2dccfd85cf4c23d497",
          "TARTAS": "https://i.ytimg.com/vi/DLQa2ApEV7I/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLA20hXm9P2sjxX3_YcddXegTct87A",
          "TORTAS": "https://acdn-us.mitiendanube.com/stores/528/608/products/f6246d66-4e24-4804-ab74-5821d1b7c5c3_nube-7c4a008150fb7d846c16106361598496-640-0.jpg",
          "HAMBURGUESAS": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsmartremo.es%2Fwp-content%2Fuploads%2F2020%2F04%2Fhamburguesa-scaled.jpg&f=1&nofb=1&ipt=66f35aae71c8407e8bc97947127c210730376df76a9f3c493c9b36356695f5a6",
          "OTROS": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft2.uc.ltmcdn.com%2Fes%2Fposts%2F5%2F3%2F4%2Fcomida_tipica_de_andalucia_cuales_son_los_platos_tradicionales_andaluces_53435_orig.jpg&f=1&nofb=1&ipt=f3be772fe27395c51705b59926417693c44c9cf94af22ef34691c4f3c38d9c0a"
        };

        const formatted = data.map((cat) => {
          const nombreFormateado = cat.nombre.replace(/_/g, " ");
          const key = cat.nombre.toUpperCase();
          const imagen = imagenesPorCategoria[key] || "https://i.imgur.com/SmMtt1x.png";

          return {
            name: nombreFormateado,
            image: imagen,
          };
        });

        setCategories(formatted);
      } catch (error) {
        console.error("Error cargando categorías en Home:", error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white mt-10">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="px-4 pt-2">
        <SearchBar />

        <View className="flex-row items-center mb-6 gap-4">
          <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
            <Ionicons name="heart-outline" size={20} color="#374151" />
            <Text className="ml-1 text-gray-800 font-medium">Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
            <Ionicons name="time-outline" size={20} color="#374151" />
            <Text className="ml-1 text-gray-800 font-medium">Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
            <Ionicons name="people-outline" size={20} color="#374151" />
            <Text className="ml-1 text-gray-800 font-medium">Seguidos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mb-10">
          <TouchableOpacity className="bg-gray-100 rounded-2xl p-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800 mb-1">
                Recetas con
              </Text>
              <Text className="text-xl font-bold text-gray-800">perejil</Text>
            </View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=120&h=120&fit=crop&crop=center",
              }}
              className="w-24 h-24 rounded-xl"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <View className="mb-10">
          <View className="flex-row items-center px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Platos de Comida
            </Text>
            <Link href="/tabs/(stack)/categories" className="ml-2">
              <Ionicons
                name="chevron-forward-circle-outline"
                size={20}
                color="#9CA3AF"
              />
            </Link>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                className="items-center mr-6"
                onPress={() => {
                  const categoryParam = category.name.toUpperCase().replace(/ /g, "_");
                  router.push(`/tabs/(stack)/categories/busquedacategoria?categoryName=${encodeURIComponent(categoryParam)}`);
                }}
              >
                <Image
                  source={{ uri: category.image }}
                  className="w-16 h-16 rounded-full mb-2"
                  resizeMode="cover"
                />
                <Text className="text-sm text-gray-700 font-medium">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Recetas Sugeridas
            </Text>
            <Link href="/tabs/(stack)/recipes" className="ml-2">
              <Ionicons
                className="ml-2"
                name="chevron-forward-circle-outline"
                size={20}
                color="#9CA3AF"
              />
            </Link>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {loading && <Text className="px-4">Cargando recetas...</Text>}
            {error && <Text className="px-4 text-red-600">{error}</Text>}
            {!loading && !error && recetasSugeridas.map((recipe) => (
              <Link
                href={`/tabs/(stack)/recipes/${recipe.idReceta}`} 
                key={recipe.idReceta}
                className="mr-2"
              >
                <RecipeCard {...recipe} />
              </Link>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;