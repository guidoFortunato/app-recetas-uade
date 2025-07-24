import axios from "axios";

const API = "https://api-recetas-yummly-app.onrender.com/usuarios";
//const API = "http://10.0.2.2:8080/usuarios";


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
  apellido: string;
  contrasena?: string;
  email: string;
  estadoRegistro: string;
  nombre: string;
  tipoUsuario: string;
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
  axios
    .post(`${API}/login`, dto)
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en login:", error);
      throw error;
    });

// 2. Registro inicial
export const registrarUsuarioInicial = (
  dto: RegistroInicialDTO
): Promise<Usuario> =>
  axios
    .post(`${API}/registro-inicial`, dto)
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en registro inicial:", error);
      throw error;
    });

// 3. Completar registro
export const completarRegistro = (
  id: number,
  dto: CompletarRegistroDTO
): Promise<Usuario> =>
  axios
    .put(`${API}/completar-registro/${id}`, dto)
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en completar registro:", error);
      throw error;
    });

// 4. Obtener todos los usuarios
export const obtenerUsuarios = (): Promise<Usuario[]> =>
  axios
    .get(`${API}`)
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en obtener usuarios:", error);
      throw error;
    });

// 5. Obtener usuario por ID
export const obtenerUsuarioPorId = (id: number): Promise<Usuario> =>
  axios
    .get(`${API}/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en obtener usuario por ID:", error);
      throw error;
    });

// 6. Obtener usuario por alias
export const obtenerUsuarioPorAlias = async (alias: string): Promise<Usuario[]> => {
  try {
    const respuesta = await fetch(`${API}/alias/${alias}`);
    
    // Si la respuesta no es exitosa
    if (!respuesta.ok) {
      // Si es un error 404 (usuario no encontrado), devolver array vacío
      if (respuesta.status === 404) {
        console.log(`Usuario con alias "${alias}" no encontrado`);
        return [];
      }
      
      // Para otros errores HTTP, lanzar un error con información detallada
      throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
    }
    
    // Si la respuesta es exitosa, parsear los datos y devolver en array
    const datosUsuario = await respuesta.json();
    console.log('Usuario encontrado:', datosUsuario);
    return [datosUsuario];
    
  } catch (error) {
    // Manejo de errores de red, parsing, etc.
    if (error instanceof Error) {
      console.error(`Error al obtener usuario por alias "${alias}":`, error.message);
    } else {
      console.error(`Error inesperado al obtener usuario por alias "${alias}":`, error);
    }
    
    // Re-lanzar el error para que el código que llama a esta función pueda manejarlo
    throw error;
  }
};

// export const obtenerUsuarioPorAlias = (alias: string): Promise<Usuario[]> =>
//   axios
//     .get(`${API}/alias/${alias}`)
//     .then((res) => {
    
//       console.log({ res });
//       return [res.data];
//     })
//     .catch((error) => {
//       console.error("Error en obtener usuario por alias:", error);
 
//       if (error.response && error.response.status === 404) {
//         return [];
//       }
    
//       return [];
//     });

// 7. Obtener usuario por email (query param)
export const obtenerUsuarioPorEmail = (email: string): Promise<Usuario> =>
  axios
    .get(`${API}/email`, { params: { email } })
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en obtener usuario por email:", error);
      throw error;
    });

// 8. Actualizar datos del usuario
export const actualizarUsuario = (
  id: number,
  usuarioActualizado: Partial<Usuario>
): Promise<Usuario> =>
  axios
    .put(`${API}/${id}`, usuarioActualizado)
    .then((res) => res.data)
    .catch((error) => {
      //console.error("Error en actualizar usuario:", error);
      throw error;
    });

// 9. Eliminar usuario
export const eliminarUsuario = (id: number): Promise<void> =>
  axios.delete(`${API}/${id}`).then(() => {}).catch(error => {
    //console.error("Error en eliminar usuario:", error);
    throw error;
  });

/*
  // Agregar receta a la lista de intentar
export const agregarRecetasFavoritas = (
  dto: RecetaListaIntentarDTO
): Promise<string> =>
  axios
    .post(`${API}/agregar-a-lista-intentar`, dto)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
*/

// 10. Obtener recetas favoritas de un usuario
export const agregarRecetasFavoritas = async (
  idUsuario: number,
  idReceta: number
): Promise<string> => {
  try {
    const response = await axios.post(`${API}/agregar-a-lista-intentar`, {
      idUsuario,
      idReceta,
    });
    // console.log({ response: response.data });
    return response.data;
  } catch (error) {
    console.error("Error en obtener recetas favoritas:", error);
    throw error;
  }
};

// export const agregarRecetaAListaIntentar = (
//   dto: RecetaListaIntentarDTO
// ): Promise<string> =>
//   axios
//     .post(${API}/agregar-a-lista-intentar, dto)
//     .then((res) => res.data)
//     .catch((error) => {
//       throw error;
//     });

// Quitar receta de la lista de intentar
export const quitarRecetaDeFavoritos = (
  idUsuario: number,
  idReceta: number
): Promise<string> =>
  axios
    .delete(`${API}/quitar-de-lista-intentar`, { data: { idUsuario, idReceta } }) // el body va en data en DELETE
    .then((res) => res.data)  
    .catch((error) => {
      throw error;
    });