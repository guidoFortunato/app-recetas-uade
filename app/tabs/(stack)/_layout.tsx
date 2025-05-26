import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#fff",
        }
      }}
    >
      <Stack.Screen
        name="home/index"
        options={{
          title: "Home Stack",
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="categories/index"
        options={{
          title: "Categorías de productos",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="recipes/index"
        options={{
          title: "Recetas sugeridas",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};
export default StackLayout;
