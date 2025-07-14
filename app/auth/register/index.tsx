import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { isValidEmail } from "@/utils/emailValidator";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  completarRegistro,
  registrarUsuarioInicial,
} from "@/utils/api/usuarios";

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const handleNext = async () => {
    try {
      if (step === 0) {
        if (!firstName.trim()) {
          alert("Ingrese su nombre");
          return;
        }
        if (!lastName.trim()) {
          alert("Ingrese su apellido");
          return;
        }
        setStep(1);
        return;
      }

      if (step === 1) {
        if (!alias.trim()) {
          alert("Ingrese un alias");
          return;
        }
        if (alias.includes(" ")) {
          alert("El alias no puede contener espacios");
          return;
        }
        if (!email.trim() || !confirmEmail.trim()) {
          alert("Complete ambos campos de correo");
          return;
        }
        if (!isValidEmail(email)) {
          alert("Correo electrónico no válido");
          return;
        }
        if (email !== confirmEmail) {
          alert("Los correos no coinciden");
          return;
        }

        setLoading(true);
        const dto = { alias, email };
        const usuario = await registrarUsuarioInicial(dto);
        setIdUsuario(usuario.idUsuario);
        alert("Registro inicial exitoso. Ahora completa tu información.");
        setStep(2);
        return;
      }

      if (step === 2) {
        if (!password.trim()) {
          alert("Ingrese una contraseña");
          return;
        }
        if (password.length < 6) {
          alert("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        setStep(3);
        return;
      }

      if (step === 3) {
        if (!confirmPassword.trim()) {
          alert("Confirme su contraseña");
          return;
        }
        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden");
          return;
        }

        if (!idUsuario) {
          alert("Error interno: ID de usuario no encontrado");
          return;
        }

        setLoading(true);
        const dto = {
          nombre: firstName,
          apellido: lastName,
          contrasena: password,
        };
        await completarRegistro(idUsuario, dto);
        alert("Cuenta creada correctamente");
        router.replace("/auth/login");
      }
    } catch (error: any) {
      console.log({error});
      if (error.response?.status === 409 && error.response.data) {
        alert(error.response.data); // "El alias ya está en uso" o "El email ya está en uso"
      } else {
        alert("Ocurrió un error durante el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 0:
        return "Ingresa tu nombre y apellido";
      case 1:
        return "Alias y correo electrónico";
      case 2:
        return "Crea una contraseña segura";
      case 3:
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
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="Apellido"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </>
        );
      case 1:
        return (
          <>
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-3 text-base bg-neutral-50"
              placeholder="Alias"
              value={alias}
              onChangeText={setAlias}
              autoCapitalize="none"
            />
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-3 text-base bg-neutral-50"
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="Confirmar correo electrónico"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        );
      case 2:
        return (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        );
      case 3:
        return (
          <TextInput
            className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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
            onPress={() => setStep((prev) => prev - 1)}
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
          disabled={loading}
        >
          <Text className="text-white text-base font-bold">
            {loading
              ? "Cargando..."
              : step === 3
              ? "Crear cuenta"
              : "Continuar"}
          </Text>
        </TouchableOpacity>

        <View className="flex flex-row justify-center mt-4">
          <Text className="text-sm text-neutral-500">¿Ya tienes cuenta? </Text>
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
