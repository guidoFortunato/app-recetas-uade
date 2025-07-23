import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/store/authStore";
import useProductsStore from "@/store/productsStore";
import type { LoginRequestDTO } from "@/utils/api/usuarios";
import { login as loginApi } from "@/utils/api/usuarios"; // login API
import { isValidEmail } from "@/utils/emailValidator";

const AuthScreen = () => {
  const { login, setIsGuest } = useAuth(); // login del store para guardar usuario y setIsGuest para guardar si es invitado
  const { clearFavorites, clearUserRecipes, handleClearSearchRecipes, handleClearExploreRecipes } = useProductsStore();
  const [aliasOEmail, setAliasOEmail] = useState("");
  const [contrasena, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!aliasOEmail.trim()) {
      alert("Ingrese su correo electrónico para continuar");
      return;
    }

    if (!isValidEmail(aliasOEmail)) {
      alert("Ingrese un correo electrónico válido");
      return;
    }

    if (!contrasena.trim()) {
      alert("Ingrese su contraseña para continuar");
      return;
    }

    try {
      setLoading(true);

      const dto: LoginRequestDTO = { aliasOEmail, contrasena };
      const response = await loginApi(dto); // llamada a la API

      login(response); // guarda el usuario en el store
      setIsGuest(false);
      router.replace("/tabs/(stack)/home"); // redirige a la home
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Correo o contraseña incorrectos");
      } else {
        alert("Error al iniciar sesión. Intente nuevamente.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    handleClearSearchRecipes();
    handleClearExploreRecipes();
    clearFavorites();
    clearUserRecipes();
    setIsGuest(true);
    router.replace("/tabs/(stack)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-10">
      {/* Ya no mostramos botón atrás porque no hay steps */}

      <Text className="text-4xl font-bold mb-6 text-center pt-20">Yummly</Text>
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-lg font-bold mb-1">Iniciar sesión</Text>
        <Text className="text-base text-neutral-700 mb-4">
          Ingresa tu correo electrónico y contraseña
        </Text>

        <TextInput
          className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
          placeholder="mail@dominio.com"
          placeholderTextColor="#aaa"
          value={aliasOEmail}
          onChangeText={setAliasOEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={contrasena}
          onChangeText={setContraseña}
          secureTextEntry={true}
        />

        <TouchableOpacity
          className="w-full bg-primary py-3 rounded-lg items-center"
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-base font-bold">
            {loading ? "Cargando..." : "Ingresar"}
          </Text>
        </TouchableOpacity>

        <View className="flex flex-row justify-center">
          <Text
            className="text-sm text-neutral-500 underline"
            onPress={() => router.push("/auth/pass-recovery")}
          >
            Olvidaste tu contraseña?
          </Text>
        </View>
        <View className="flex flex-row justify-center">
          <Text className="text-sm text-neutral-500">No tenés cuenta?</Text>
          <Text
            className="text-sm text-primary underline font-semibold ml-1"
            onPress={() => router.push("/auth/register")}
          >
            Regístrate
          </Text>
        </View>
        <View className="flex flex-row justify-center">
          <Text
            className="text-sm text-primary underline font-semibold ml-1"
            onPress={handleGuestLogin}
          >
            Ingresar como invitado
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
