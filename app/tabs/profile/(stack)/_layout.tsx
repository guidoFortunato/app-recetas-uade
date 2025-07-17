import { Stack } from "expo-router";

export default function ProfileInnerGroup() {
  // ESTE layout es el *grupo* (carpeta con paréntesis)
  // Le ocultamos el header para que no aparezca “(stack)”
  return <Stack screenOptions={{ headerShown: true }} />;
}
