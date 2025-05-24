import useAuthStore from "@/store/store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  return (
    <View>
      <Text>HomeScreen</Text>
      <TouchableOpacity
        className="w-full bg-secondary py-3 rounded-lg items-center mt-4"
        onPress={() => {
          logout();
          router.replace("/auth/login");
        }}
      >
        <Text className="text-white text-base font-bold">Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;
