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
          title: "",
          // headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};
export default StackLayout;
