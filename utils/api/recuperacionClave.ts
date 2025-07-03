import axios from "axios";

const API = "http://10.0.2.2:8080/recuperacion-clave";

// 1. Solicitar código de recuperación
export const solicitarCodigo = (email: string): Promise<string> =>
  axios.post(`${API}/solicitar`, null, {
    params: { email }
  }).then(res => res.data)
    .catch(err => {
      throw new Error(err.response?.data || "Error al solicitar código");
    });

// 2. Verificar código
export const verificarCodigo = (email: string, codigo: string): Promise<string> =>
  axios.post(`${API}/verificar`, null, {
    params: { email, codigo }
  }).then(res => res.data)
    .catch(err => {
      throw new Error(err.response?.data || "Error al verificar código");
    });

// 3. Actualizar contraseña
export const actualizarContrasena = (
  email: string,
  codigo: string,
  nuevaContrasena: string
): Promise<string> =>
  axios.post(`${API}/actualizar`, null, {
    params: { email, codigo, nuevaContrasena }
  }).then(res => res.data)
    .catch(err => {
      throw new Error(err.response?.data || "Error al actualizar contraseña");
    });
