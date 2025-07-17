import { Redirect } from "expo-router";

import useAuthStore from "@/store/authStore";
import { obtenerUsuarioPorId } from "@/utils/api/usuarios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const RecetasApp = () => {
  const { setUser, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // console.log({user});

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth-storage");
        if (!stored) {
          setLoading(false);
          return;
        }
        const parsed = JSON.parse(stored);
        const data = parsed?.state;
        const expiresIn = data?.expires_in;
        const isExpired = Date.now() > expiresIn;
        const idUsuario = data?.idUsuario;
        const isAuthenticated = data?.isAuthenticated;
        // console.log({isExpired, idUsuario, isAuthenticated});
        if (!isAuthenticated || !idUsuario || isExpired) {
          setLoading(false);
          return;
        }

        const dataUser = await obtenerUsuarioPorId(data.idUsuario);
        setUser(dataUser); // guardo en el store de zustand
      } catch (err) {
        console.error("Error leyendo auth-storage", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, [setUser]);

  if (loading) {
    // Aún está cargando el estado desde AsyncStorage
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return user ? (
    <Redirect href="/tabs/(stack)/home" />
  ) : (
    <Redirect href="/auth/login" />
  );
};
export default RecetasApp;
