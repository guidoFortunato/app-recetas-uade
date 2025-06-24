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

const RegisterScreen = () => {
  const { register, user } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 0) {
      if (!firstName.trim()) {
        alert("Ingrese su nombre para continuar");
        return;
      }
      if (!lastName.trim()) {
        alert("Ingrese su apellido para continuar");
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!email.trim()) {
        alert("Ingrese su correo electrónico para continuar");
        return;
      }
      if (!isValidEmail(email)) {
        alert("Ingrese un correo electrónico válido");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!confirmEmail.trim()) {
        alert("Confirme su correo electrónico para continuar");
        return;
      }
      if (email !== confirmEmail) {
        alert("Los correos electrónicos no coinciden");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!password.trim()) {
        alert("Ingrese su contraseña para continuar");
        return;
      }
      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!confirmPassword.trim()) {
        alert("Confirme su contraseña para continuar");
        return;
      }
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      // Registrar usuario
      const newUser = {
        ...user,
        firstName,
        lastName,
        email,
        password,
      };
      
      register(newUser);
      router.replace("/tabs/(stack)/home");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "Nombre y Apellido";
      case 1:
        return "Correo Electrónico";
      case 2:
        return "Confirmar Correo";
      case 3:
        return "Contraseña";
      case 4:
        return "Confirmar Contraseña";
      default:
        return "Registro";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 0:
        return "Ingresa tu nombre y apellido";
      case 1:
        return "Ingresa tu correo electrónico";
      case 2:
        return "Confirma tu correo electrónico";
      case 3:
        return "Crea una contraseña segura";
      case 4:
        return "Confirma tu contraseña";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-3 text-base bg-neutral-50"
              placeholder="Nombre"
              placeholderTextColor="#aaa"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="Apellido"
              placeholderTextColor="#aaa"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </>
        );
      case 1:
        return (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="mail@dominio.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        );
      case 2:
        return (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="mail@dominio.com"
            placeholderTextColor="#aaa"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        );
      case 3:
        return (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        );
      case 4:
        return (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="Repite tu contraseña"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-10">
      {step > 0 && (
        <View className="absolute top-10 left-4 z-10">
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="#374151"
            onPress={() => setStep(step - 1)}
          />
        </View>
      )}

      <Text className="text-4xl font-bold mb-6 text-center pt-20">Yummly</Text>
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-lg font-bold mb-1">Crear cuenta</Text>
        <Text className="text-base text-neutral-700 mb-4 text-center">
          {getStepDescription()}
        </Text>

        {renderStepContent()}

        <TouchableOpacity
          className="w-full bg-primary py-3 rounded-lg items-center"
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text className="text-white text-base font-bold">
            {step === 4 ? "Crear cuenta" : "Continuar"}
          </Text>
        </TouchableOpacity>

        <View className="flex flex-row justify-center mt-4">
          <Text className="text-sm text-neutral-500">
            ¿Ya tienes cuenta?{" "}
          </Text>
          <Text
            className="text-sm text-primary underline font-semibold"
            onPress={() => router.push("/auth/login")}
          >
            Inicia sesión
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
