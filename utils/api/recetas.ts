import { CategoriaReceta } from "@/utils/api/categoriaRecetas";
import axios from "axios";

//const API_URL = "https://api-recetas-render.onrender.com/recetas";
//const INGREDIENTES_API_URL = "https://api-recetas-render.onrender.com/ingredientes";
const API_URL = "http://10.0.2.2:8080/recetas";
const INGREDIENTES_API_URL = "http://10.0.2.2:8080/ingredientes";

export enum TipoMultimedia {
  imagen = "foto",
  video = "video",
}

export enum EstadoReceta {
  aprobada = "aprobada",
  pendiente = "pendiente",
  rechazada = "rechazada",
}

export enum EstadoValoracion {
  aprobada = "aprobada",
  pendiente = "pendiente",
  rechazada = "rechazada",
}

// DTOs
export interface UsuarioBasicoDTO {
  idUsuario: number;
  alias: string;
}

export interface IngredienteRecetaDTO {
  nombre: string;
  cantidad: number;
  unidadMedida: string;
}

export interface IngredienteDTO {
  idIngrediente: number;
  nombre: string;
}

export interface MultimediaPasoDTO {
  url: string;
  tipo: TipoMultimedia;
}

export interface MultimediaRecetaDTO {
  url: string;
  tipo: TipoMultimedia;
}

export interface PasoRecetaDTO {
  numeroPaso: number;
  descripcion: string;
  multimedia: MultimediaPasoDTO[];
}

export interface CrearRecetaDTO {
  idUsuario: number;
  titulo: string;
  descripcion: string;
  cantidadPersonas: number;
  publico: boolean;
  categoria: string;
  ingredientes: IngredienteRecetaDTO[];
  pasos: PasoRecetaDTO[];
  multimediaReceta: MultimediaRecetaDTO[];
}

export interface ModificarRecetaDTO {
  titulo: string;
  descripcion: string;
  cantidadPersonas: number;
  publico: boolean;
  categoria: string;
  ingredientes: IngredienteRecetaDTO[];
  pasos: PasoRecetaDTO[];
  multimediaReceta: MultimediaRecetaDTO[];
}

export interface RecetaRespuestaDTO {
  idReceta: number;
  titulo: string;
  promedioValoracion: number;
  descripcion: string;
  cantidadPersonas: number;
  publico: boolean;
  categoria: CategoriaReceta;
  fechaCreacion: string;
  usuario: UsuarioBasicoDTO;
  ingredientes: IngredienteRecetaDTO[];
  pasos: PasoRecetaDTO[];
  multimedia: MultimediaRecetaDTO[];
}

export interface ValoracionRecetaDTO {
  usuario: UsuarioBasicoDTO;
  puntaje: number;
  comentario: string;
  estado: EstadoValoracion;
  fechaValoracion: string;
}

export interface EnviarValoracionRecetaDTO {
  idUsuario: number;
  puntaje: number;
  comentario: string;
}

// Funciones principales usando axios y manejo de errores estilo Promise

export const crearReceta = (dto: CrearRecetaDTO): Promise<string> =>
  axios
    .post(`${API_URL}`, dto)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerRecetas = (): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerRecetaPorId = (id: number): Promise<RecetaRespuestaDTO> =>
  axios
    .get(`${API_URL}/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const actualizarReceta = (
  id: number,
  dto: ModificarRecetaDTO
): Promise<string> =>
  axios
    .put(`${API_URL}/${id}`, dto)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const eliminarReceta = (id: number): Promise<void> =>
  axios
    .delete(`${API_URL}/${id}`)
    .then(() => {})
    .catch((error) => {
      throw error;
    });

export const cambiarVisibilidad = (id: number): Promise<string> =>
  axios
    .put(`${API_URL}/${id}/visibilidad`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const valorarReceta = (
  id: number,
  dto: EnviarValoracionRecetaDTO
): Promise<string> =>
  axios
    .post(`${API_URL}/${id}/valorar`, dto)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

// Ingredientes
export const obtenerIngredientePorNombre = async (
  nombre: string
): Promise<IngredienteDTO | null> => {
  try {
    const response = await fetch(`${INGREDIENTES_API_URL}/nombre/${encodeURIComponent(nombre)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No se encontró el ingrediente "${nombre}"`);
        return null;
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Recetas por ingrediente
export const obtenerRecetasPorIngrediente = async (
  nombreIngrediente: string
): Promise<RecetaRespuestaDTO[]> => {
  try {
    const ingrediente = await obtenerIngredientePorNombre(nombreIngrediente);
    
    if (!ingrediente) {
      console.log(`No se encontró el ingrediente "${nombreIngrediente}"`);
      return [];
    }
    
    console.log({ ingrediente });
    const response = await fetch(
      `${API_URL}/ingrediente/${ingrediente.idIngrediente}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No se encontraron recetas con el ingrediente "${nombreIngrediente}"`);
        return [];
      }
      throw new Error(`Error HTTP: ${response.status}`);  
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const obtenerRecetasPorNoIngrediente = async (
  nombreIngrediente: string
): Promise<RecetaRespuestaDTO[]> => {
  try {
    const ingrediente = await obtenerIngredientePorNombre(nombreIngrediente);
    
    if (!ingrediente) {
      console.log(`No se encontró el ingrediente "${nombreIngrediente}"`);
      return [];
    }
    
    const response = await fetch(`${API_URL}/ingrediente/${ingrediente.idIngrediente}/sin`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Recetas listas para intentar
export const obtenerRecetasIntentarPorUsuario = (
  idUsuario: number
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/lista-recetas-intentar/${idUsuario}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

// Recetas por usuario
export const obtenerRecetasPorUsuario = (
  idUsuario: number
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/usuario/${idUsuario}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerRecetasPorAliasUsuario = (
  alias: string
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/usuario/alias/${encodeURIComponent(alias)}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

// Recetas por título
export const obtenerRecetasPorTitulo = (
  titulo: string
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/buscar?titulo=${encodeURIComponent(titulo)}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

// Recetas por categoría
export const obtenerRecetasPorCategoria = (
  categoria: string | CategoriaReceta
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/categoria/${categoria}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

// Por estado y visibilidad
export const obtenerPorEstadoYVisibilidad = (
  estado: EstadoReceta,
  publico: boolean
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/estado-visibilidad/${estado}/${publico}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerPorEstado = (
  estado: EstadoReceta
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/estado/${estado}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerPorVisibilidad = (
  publico: boolean
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(`${API_URL}/visibilidad/${publico}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerValoracionesRecetaEstado = (
  idReceta: number,
  estado: EstadoValoracion
): Promise<ValoracionRecetaDTO[]> =>
  axios
    .get(`${API_URL}/${idReceta}/valoraciones/estado/${estado}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerRecetasOrdenadas = (
  estado: EstadoReceta,
  publico: boolean,
  criterio: string = "fecha"
): Promise<RecetaRespuestaDTO[]> =>
  axios
    .get(
      `${API_URL}/ordenadas?estado=${estado}&publico=${publico}&criterio=${encodeURIComponent(
        criterio
      )}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const existeRecetaUsuario = (
  idUsuario: number,
  titulo: string
): Promise<boolean> =>
  axios
    .get(
      `${API_URL}/existe?idUsuario=${idUsuario}&titulo=${encodeURIComponent(
        titulo
      )}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const obtenerValoracionesAprobadasPorReceta = (
  idReceta: number
): Promise<ValoracionRecetaDTO[]> =>
  axios
    .get(`${API_URL}/${idReceta}/valoraciones`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const multiplicarIngredientesReceta = (
  idReceta: number,
  cantPersonas: number
): Promise<IngredienteRecetaDTO[]> =>
  axios
    .get(`${API_URL}/${idReceta}/ingredientes/multiplicar`, {
      params: { cantPersonas },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
