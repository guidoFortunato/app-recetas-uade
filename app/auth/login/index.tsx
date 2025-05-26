import { GoogleLogo } from "@/components/logos";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import useAuthStore from "@/store/authStore";
import { user } from "@/utils/test/data";
import { router } from "expo-router";

const AuthScreen = () => {
  // const [email, setEmail] = useState("");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  // const [password, setPassword] = useState("");
  const [step, setStep] = useState(0);

  const { login } = useAuthStore();

  const handleLogin = () => {
    if (!email.trim()) {
      alert("Ingrese su correo electrónico para continuar");
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-4xl font-bold mb-6 mt-6">Yummly</Text>
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
          <>
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="12345678"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity
              className="w-full bg-secondary py-3 rounded-lg items-center"
              onPress={() => {
                setStep(0);
                setPassword("");
              }}
            >
              <Text className="text-white text-base font-bold">Volver</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          className="w-full bg-primary py-3 rounded-lg items-center"
          activeOpacity={0.8}
          onPress={handleLogin}
        >
          <Text className="text-white text-base font-bold">Continuar</Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-4 w-full justify-center">
          <View className="flex-1 h-px bg-neutral-200" />
          <View className="w-4 h-4 rounded-full border border-neutral-200 mx-2 bg-white" />
          <View className="flex-1 h-px bg-neutral-200" />
        </View>
        <TouchableOpacity className="flex-row items-center bg-neutral-100 py-3 rounded-lg w-full mb-3 justify-center">
          <GoogleLogo />
          <Text className="text-base font-medium ml-2">
            Continuar con Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-neutral-100 py-3 rounded-lg w-full mb-3 justify-center">
          <FontAwesome
            name="apple"
            size={20}
            color="#000"
            style={{ marginRight: 8 }}
          />
          <Text className="text-base font-medium">Continuar con Apple</Text>
        </TouchableOpacity>
        <Text className="text-xs text-neutral-500 text-center mt-4">
          By clicking continue, you agree to our{" "}
          <Text
            className="text-black underline"
            onPress={() => Linking.openURL("https://www.yummly.com/terms")}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            className="text-black underline"
            onPress={() => Linking.openURL("https://www.yummly.com/privacy")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
