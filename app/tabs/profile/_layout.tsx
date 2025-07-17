import { Stack } from 'expo-router';

export default function ProfileInnerStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,          // deja visible el header
      }}
    />
  );
}
