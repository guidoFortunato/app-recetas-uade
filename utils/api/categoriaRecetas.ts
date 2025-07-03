import axios from "axios";

const API = "http://10.0.2.2:8080/categoria-recetas";

// Tipo que representa la categoría
export interface CategoriaReceta {
  nombre: string;
}

// 1. Obtener todas las categorías
export const obtenerCategorias = (): Promise<CategoriaReceta[]> =>
  axios.get(API).then(res => res.data).catch(err => console.log(err));

// 2. Obtener una categoría por nombre
export const obtenerCategoriaPorNombre = (nombre: string): Promise<CategoriaReceta> =>
  axios.get(`${API}/${nombre}`).then(res => res.data).catch(err => console.log(err));

// 3. Verificar si existe una categoría por nombre
export const existeCategoria = (nombre: string): Promise<boolean> =>
  axios.get(`${API}/existe/${nombre}`).then(res => res.data).catch(err => console.log(err));

// 4. Crear nueva categoría
export const crearCategoria = (categoria: CategoriaReceta): Promise<CategoriaReceta> =>
  axios.post(API, categoria).then(res => res.data).catch(err => console.log(err));

// 5. Eliminar categoría por nombre
export const eliminarCategoria = (nombre: string): Promise<void> =>
  axios.delete(`${API}/${nombre}`).then(() => {}).catch(err => console.log(err));
