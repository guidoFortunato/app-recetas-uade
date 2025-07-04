import axios from "axios";

const API = "https://api-recetas-render.onrender.com/ingredientes";

// Tipo que representa un ingrediente
export interface Ingrediente {
  idIngrediente: number;
  nombre: string;
}

// 1. Obtener todos los ingredientes
export const obtenerIngredientes = (): Promise<Ingrediente[]> =>
  axios.get(API).then(res => res.data).catch(err => console.log(err));

// 2. Obtener ingrediente por ID
export const obtenerIngredientePorId = (id: number): Promise<Ingrediente> =>
  axios.get(`${API}/${id}`).then(res => res.data).catch(err => console.log(err));

// 3. Obtener ingrediente por nombre
export const obtenerIngredientePorNombre = (nombre: string): Promise<Ingrediente> =>
  axios.get(`${API}/nombre/${encodeURIComponent(nombre)}`)
    .then(res => res.data)
    .catch(err => console.log(err));

// 4. Crear nuevo ingrediente
export const crearIngrediente = (nombre: string): Promise<Ingrediente> =>
  axios.post(API, { nombre })
    .then(res => res.data)
    .catch(err => console.log(err));

// 5. Actualizar un ingrediente
export const actualizarIngrediente = (id: number, nuevoNombre: string): Promise<Ingrediente> =>
  axios.put(`${API}/${id}`, { idIngrediente: id, nombre: nuevoNombre })
    .then(res => res.data)
    .catch(err => console.log(err));

// 6. Eliminar un ingrediente
export const eliminarIngrediente = (id: number): Promise<void> =>
  axios.delete(`${API}/${id}`).then(() => {}).catch(err => console.log(err));
