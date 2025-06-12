import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import useAuthStore from "@/store/authStore";
import { isValidEmail } from "@/utils/emailValidator";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AuthScreen = () => {
 
  const { login, user } = useAuthStore();
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [step, setStep] = useState(0);

  const handleLogin = () => {
    if (!email.trim()) {
      alert("Ingrese su correo electrónico para continuar");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Ingrese un correo electrónico válido");
      return;
    }

    if (step === 0) {
      setStep(1);
      return;
    }

    if (!password.trim()) {
      alert("Ingrese su contraseña para continuar");
      return;
    }

    if (email !== user.email || password !== user.password) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    login(user);
    router.replace("/tabs/(stack)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-10">
      {step === 1 && (
        <View className="absolute top-10 left-4 z-10">
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="#374151"
            onPress={() => setStep(0)}
          />
        </View>
      )}

      <Text className="text-4xl font-bold mb-6 text-center pt-20">Yummly</Text>
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-lg font-bold mb-1">Iniciar sesión</Text>
        <Text className="text-base text-neutral-700 mb-4">
          {step === 0
            ? "Ingresa tu correo electrónico"
            : "Ingresa tu contraseña"}
        </Text>

        {step === 0 ? (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="mail@dominio.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        ) : (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="12345678"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        )}
        <TouchableOpacity
          className="w-full bg-primary py-3 rounded-lg items-center"
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          <Text className="text-white text-base font-bold">
            {step === 0 ? "Continuar" : "Ingresar"}
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
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
