import axios from "axios";

const API = "http://localhost:8080/usuarios"; // Cambiá por tu dominio real

export interface LoginRequestDTO {
  aliasOEmail: string;
  contrasena: string;
}

export interface RegistroInicialDTO {
  alias: string;
  email: string;
}

export interface CompletarRegistroDTO {
  nombre: string;
  apellido: string;
  contrasena: string;
}

export interface LoginResponseDTO {
  idUsuario: number;
  alias: string;
  email: string;
  tipoUsuario: string;
  estadoRegistro: string;
  nombre: string;
  apellido: string;
}

export interface Usuario {
  idUsuario: number;
  alias: string;
  email: string;
  tipoUsuario: string;
  estadoRegistro: string;
  fechaRegistro: string; // Puede ser string o Date según manejo
  nombre: string;
  apellido: string;
}

// 1. Login
export const login = (dto: LoginRequestDTO): Promise<LoginResponseDTO> =>
  axios.post(`${API}/login`, dto).then(res => res.data);

// 2. Registro inicial
export const registrarUsuarioInicial = (dto: RegistroInicialDTO): Promise<Usuario> =>
  axios.post(`${API}/registro-inicial`, dto).then(res => res.data);

// 3. Completar registro
export const completarRegistro = (id: number, dto: CompletarRegistroDTO): Promise<Usuario> =>
  axios.put(`${API}/completar-registro/${id}`, dto).then(res => res.data);

// 4. Obtener todos los usuarios
export const obtenerUsuarios = (): Promise<Usuario[]> =>
  axios.get(`${API}`).then(res => res.data);

// 5. Obtener usuario por ID
export const obtenerUsuarioPorId = (id: number): Promise<Usuario> =>
  axios.get(`${API}/${id}`).then(res => res.data);

// 6. Obtener usuario por alias
export const obtenerUsuarioPorAlias = (alias: string): Promise<Usuario> =>
  axios.get(`${API}/alias/${alias}`).then(res => res.data);

// 7. Obtener usuario por email (query param)
export const obtenerUsuarioPorEmail = (email: string): Promise<Usuario> =>
  axios.get(`${API}/email`, { params: { email } }).then(res => res.data);

// 8. Actualizar datos del usuario
export const actualizarUsuario = (id: number, usuarioActualizado: Partial<Usuario>): Promise<Usuario> =>
  axios.put(`${API}/${id}`, usuarioActualizado).then(res => res.data);

// 9. Eliminar usuario
export const eliminarUsuario = (id: number): Promise<void> =>
  axios.delete(`${API}/${id}`).then(() => {});
