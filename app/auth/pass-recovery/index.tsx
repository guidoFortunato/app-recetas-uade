import { isValidEmail } from "@/utils/emailValidator";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  actualizarContrasena,
  solicitarCodigo,
  verificarCodigo,
} from "@/utils/api/RecuperacionClave";

const PassRecoveryScreen = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step !== 1 || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handlePassRecovery = async () => {
    try {
      if (!email.trim()) {
        alert("Ingrese su correo electrónico para continuar");
        return;
      }

      if (step === 0) {
        if (!isValidEmail(email)) {
          alert("Ingrese un correo electrónico válido");
          return;
        }

        setLoading(true);
        await solicitarCodigo(email);
        alert("Código enviado al correo");
        setStep(1);
        setTimeLeft(120); // 2 minutos
        setCanResend(false);
        return;
      }

      if (step === 1) {
        if (!code.trim()) {
          alert("Ingrese el código recibido por email");
          return;
        }

        setLoading(true);
        await verificarCodigo(email, code);
        alert("Código verificado correctamente");
        setStep(2);
        return;
      }

      // step === 2
      if (!password.trim()) {
        alert("Ingrese su nueva contraseña para continuar");
        return;
      }

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      setLoading(true);
      await actualizarContrasena(email, code, password);
      alert("Contraseña actualizada correctamente");
      router.replace("/auth/login");
    } catch (error: any) {
      alert(error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      await solicitarCodigo(email);
      alert("Nuevo código enviado al correo");
      setTimeLeft(120);
      setCanResend(false);
    } catch (error: any) {
      alert("Error al reenviar el código");
    } finally {
      setLoading(false);
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
          <>
            <TextInput
              className="w-full border border-neutral-200 rounded-lg p-3 mb-4 text-base bg-neutral-50"
              placeholder="123456"
              placeholderTextColor="#aaa"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />
            <View className="w-full items-center mt-2">
              {canResend ? (
                <Text
                  className="text-sm text-primary underline"
                  onPress={handleResendCode}
                >
                  Reenviar código
                </Text>
              ) : (
                <Text className="text-sm text-neutral-500">
                  Espera {timeLeft}s para reenviar
                </Text>
              )}
            </View>
          </>
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
          disabled={loading}
        >
          <Text className="text-white text-base font-bold">
            {loading
              ? "Cargando..."
              : step < 2
              ? "Continuar"
              : "Cambiar contraseña"}
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
