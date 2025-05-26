import useAuthStore from "@/store/authStore";
import { Redirect } from "expo-router";

const RecetasApp = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Redirect href="/tabs/(stack)/home" /> : <Redirect href="/auth/login" />;
};
export default RecetasApp;
