import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PassRecoveryScreen = () => {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);

  const { passRecovery, updatePassword, user } = useAuthStore();

  const handlePassRecovery = () => {
    if (!email.trim()) {
      alert("Ingrese su correo electrónico para continuar");
      return;
    }

    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 1) {
      if (code !== user.code) {
        alert("El código de verificación es incorrecto");
        return;
      }
      setStep(2);
      return;
    }

    if (!password.trim()) {
      alert("Ingrese su nueva contraseña para continuar");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    passRecovery(email);
    updatePassword(password);
    alert("Contraseña cambiada correctamente");

    router.replace("/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-10">
      {step > 0 && (
        <View className="absolute top-10 left-4 z-10">
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="#374151"
            onPress={() => setStep((prev) => prev - 1)}
          />
        </View>
      )}

      <Text className="text-4xl font-bold mb-6 text-center pt-20">Yummly</Text>
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-lg font-bold mb-1">Cambio de contraseña</Text>
        <Text className="text-base text-neutral-700 mb-4">
          {step === 0
            ? "Ingresa tu correo electrónico"
            : step === 1
            ? "Ingresa el código de verificación que te enviamos a tu correo"
            : "Ingresa tu nueva contraseña"}
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
        ) : step === 1 ? (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="12345678"
            placeholderTextColor="#aaa"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
        ) : (
          <>
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="Nueva contraseña"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="Confirmar contraseña"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </>
        )}
        <TouchableOpacity
          className="w-full bg-primary py-3 rounded-lg items-center"
          activeOpacity={0.8}
          onPress={handlePassRecovery}
        >
          <Text className="text-white text-base font-bold">
            {step < 2 ? "Continuar" : "Cambiar contraseña"}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row justify-center">
          <Text
            className="text-sm text-neutral-500 underline"
            onPress={() => router.push("/auth/login")}
          >
            Volver
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PassRecoveryScreen;
