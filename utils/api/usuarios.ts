import axios from "axios";

const API = "http://10.0.2.2:8080/usuarios";

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
  contrasena: string;
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

export interface RecetaListaIntentarDTO {
  idUsuario: number;
  idReceta: number;
}

// 1. Login
export const login = (dto: LoginRequestDTO): Promise<LoginResponseDTO> =>
  axios.post(`${API}/login`, dto)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en login:", error);
      throw error;
    });

// 2. Registro inicial
export const registrarUsuarioInicial = (dto: RegistroInicialDTO): Promise<Usuario> =>
  axios.post(`${API}/registro-inicial`, dto)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en registro inicial:", error);
      throw error;
    });

// 3. Completar registro
export const completarRegistro = (id: number, dto: CompletarRegistroDTO): Promise<Usuario> =>
  axios.put(`${API}/completar-registro/${id}`, dto)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en completar registro:", error);
      throw error;
    });

// 4. Obtener todos los usuarios
export const obtenerUsuarios = (): Promise<Usuario[]> =>
  axios.get(`${API}`)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en obtener usuarios:", error);
      throw error;
    });

// 5. Obtener usuario por ID
export const obtenerUsuarioPorId = (id: number): Promise<Usuario> =>
  axios.get(`${API}/${id}`)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en obtener usuario por ID:", error);
      throw error;
    });

// 6. Obtener usuario por alias
export const obtenerUsuarioPorAlias = (alias: string): Promise<Usuario> =>
  axios.get(`${API}/alias/${alias}`)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en obtener usuario por alias:", error);
      throw error;
    });

// 7. Obtener usuario por email (query param)
export const obtenerUsuarioPorEmail = (email: string): Promise<Usuario> =>
  axios.get(`${API}/email`, { params: { email } })
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en obtener usuario por email:", error);
      throw error;
    });

// 8. Actualizar datos del usuario
export const actualizarUsuario = (id: number, usuarioActualizado: Partial<Usuario>): Promise<Usuario> =>
  axios.put(`${API}/${id}`, usuarioActualizado)
    .then(res => res.data)
    .catch(error => {
      //console.error("Error en actualizar usuario:", error);
      throw error;
    });

// 9. Eliminar usuario
export const eliminarUsuario = (id: number): Promise<void> =>
  axios.delete(`${API}/${id}`).then(() => {}).catch(error => {
    //console.error("Error en eliminar usuario:", error);
    throw error;
  });

  // Agregar receta a la lista de intentar
export const agregarRecetaAListaIntentar = (
  dto: RecetaListaIntentarDTO
): Promise<string> =>
  axios
    .post(`${API}/agregar-a-lista-intentar`, dto)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

// Quitar receta de la lista de intentar
export const quitarRecetaDeListaIntentar = (
  dto: RecetaListaIntentarDTO
): Promise<string> =>
  axios
    .delete(`${API}/quitar-de-lista-intentar`, { data: dto }) // el body va en `data` en DELETE
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });