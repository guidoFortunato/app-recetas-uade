
import { CategoriaReceta } from "@/utils/api/categoriaRecetas";

const API_URL  = "http://10.0.2.2:8080/recetas";

//const categorias: CategoriaReceta[] = await obtenerCategorias()
// cada categoría es: { nombre: string }

export enum TipoMultimedia {
    imagen = "imagen",
    video = "video"
}

  export enum EstadoReceta {
    aprobada = "aprobada",
    pendiente = "pendiente",
    rechazada = "rechazada"
  }
  
  export enum EstadoValoracion {
    aprobada = "aprobada",
    pendiente = "pendiente",
    rechazada = "rechazada"
  }
  
  // DTOs
  export interface UsuarioBasicoDTO {
    idUsuario: number
    alias: string
  }
  
  export interface IngredienteRecetaDTO {
    nombre: string
    cantidad: number
    unidadMedida: string
  }
  
  export interface IngredienteDTO {
    idIngrediente: number
    cantidad: number
    unidadMedida: string
  }
  
  export interface MultimediaPasoDTO {
    url: string
    tipo: TipoMultimedia
  }
  
  export interface MultimediaRecetaDTO {
    url: string
    tipo: TipoMultimedia
  }
  
  export interface PasoRecetaDTO {
    numeroPaso: number
    descripcion: string
    multimedia: MultimediaPasoDTO[]
  }
  
  export interface CrearRecetaDTO {
    idUsuario: number
    titulo: string
    descripcion: string
    cantidadPersonas: number
    publico: boolean
    categoria: string
    ingredientes: IngredienteRecetaDTO[]
    pasos: PasoRecetaDTO[]
    multimediaReceta: MultimediaRecetaDTO[]
  }
  
  export interface ModificarRecetaDTO {
    titulo: string
    descripcion: string
    cantidadPersonas: number
    publico: boolean
    categoria: string
    ingredientes: IngredienteDTO[]
    pasos: PasoRecetaDTO[]
    multimediaReceta: MultimediaRecetaDTO[]
  }
  
  export interface RecetaRespuestaDTO {
    idReceta: number
    titulo: string
    descripcion: string
    cantidadPersonas: number
    publico: boolean
    categoria: CategoriaReceta
    fechaCreacion: string // se serializa como ISO 8601
    usuario: UsuarioBasicoDTO
    ingredientes: IngredienteRecetaDTO[]
    pasos: PasoRecetaDTO[]
    multimedia: MultimediaRecetaDTO[]
  }
  
  export interface ValoracionRecetaDTO {
    usuario: UsuarioBasicoDTO
    puntaje: number
    comentario: string
    estado: EstadoValoracion
    fechaValoracion: string
  }
  
  export interface EnviarValoracionRecetaDTO {
    idUsuario: number
    puntaje: number
    comentario: string
  }
  
  
  // Funciones principales
  export async function crearReceta(dto: CrearRecetaDTO) {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error(await res.text())
    return res.text()
  }
  
  export async function obtenerRecetas(): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}`)
    if (!res.ok) throw new Error("Error obteniendo recetas")
    return res.json()
  }
  
  export async function obtenerRecetaPorId(id: number): Promise<RecetaRespuestaDTO> {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error("Receta no encontrada")
    return res.json()
  }
  
  export async function actualizarReceta(id: number, dto: ModificarRecetaDTO) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error(await res.text())
    return res.text()
  }
  
  export async function eliminarReceta(id: number) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error eliminando receta")
  }
  
  export async function cambiarVisibilidad(id: number) {
    const res = await fetch(`${API_URL}/${id}/visibilidad`, { method: "PUT" })
    if (!res.ok) throw new Error(await res.text())
    return res.text()
  }
  
  export async function valorarReceta(id: number, dto: EnviarValoracionRecetaDTO) {
    const res = await fetch(`${API_URL}/${id}/valorar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error(await res.text())
    return res.text()
  }
  
  export async function obtenerRecetasPorIngrediente(idIngrediente: number): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/ingrediente/${idIngrediente}`)
    if (!res.ok) throw new Error("Error al obtener recetas por ingrediente")
    return res.json()
  }
  
  export async function obtenerRecetasPorNoIngrediente(idIngrediente: number): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/ingrediente/${idIngrediente}/sin`)
    if (!res.ok) throw new Error("Error al obtener recetas sin ingrediente")
    return res.json()
  }
  
  export async function obtenerRecetasIntentarPorUsuario(idUsuario: number): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/lista-recetas-intentar/${idUsuario}`)
    if (!res.ok) throw new Error("Error al obtener recetas guardadas")
    const data = await res.json()
    return data
  }
  
  export async function obtenerRecetasPorUsuario(idUsuario: number): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/usuario/${idUsuario}`)
    if (!res.ok) throw new Error("Error al obtener recetas del usuario")
    const data = await res.json()
    return data
  }
  
  export async function obtenerRecetasPorAliasUsuario(alias: string): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/usuario/alias/${encodeURIComponent(alias)}`)
    if (!res.ok) throw new Error("Error al obtener recetas por alias")
    return res.json()
  }
  
  export async function obtenerRecetasPorTitulo(titulo: string): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/buscar?titulo=${encodeURIComponent(titulo)}`)
    if (!res.ok) throw new Error("Error al buscar recetas por título")
    const data = await res.json()
    return data
  }
  
  export async function obtenerRecetasPorCategoria(categoria: CategoriaReceta): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/categoria/${categoria}`)
    if (!res.ok) throw new Error("Error al obtener recetas por categoría")
    return res.json()
  }
  
  export async function obtenerPorEstadoYVisibilidad(estado: EstadoReceta, publico: boolean): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/estado-visibilidad/${estado}/${publico}`)
    if (!res.ok) throw new Error("Error al obtener recetas por estado y visibilidad")
    return res.json()
  }
  
  export async function obtenerPorEstado(estado: EstadoReceta): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/estado/${estado}`)
    if (!res.ok) throw new Error("Error al obtener recetas por estado")
    return res.json()
  }
  
  export async function obtenerPorVisibilidad(publico: boolean): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/visibilidad/${publico}`)
    if (!res.ok) throw new Error("Error al obtener recetas por visibilidad")
    return res.json()
  }
  
  export async function obtenerValoracionesRecetaEstado(idReceta: number, estado: EstadoValoracion): Promise<ValoracionRecetaDTO[]> {
    const res = await fetch(`${API_URL}/${idReceta}/valoraciones/estado/${estado}`)
    if (!res.ok) throw new Error("Error al obtener valoraciones de la receta por estado")
    return res.json()
  }
  
  export async function obtenerRecetasOrdenadas(
    estado: EstadoReceta,
    publico: boolean,
    criterio: string = "fecha"
  ): Promise<RecetaRespuestaDTO[]> {
    const res = await fetch(`${API_URL}/ordenadas?estado=${estado}&publico=${publico}&criterio=${encodeURIComponent(criterio)}`)
    if (!res.ok) throw new Error("Error al obtener recetas ordenadas")
    return res.json()
  }
  
  export async function existeRecetaUsuario(idUsuario: number, titulo: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/existe?idUsuario=${idUsuario}&titulo=${encodeURIComponent(titulo)}`)
    if (!res.ok) throw new Error("Error al verificar existencia de receta")
    return res.json()
  }
  
  export async function obtenerValoracionesAprobadasPorReceta(idReceta: number): Promise<ValoracionRecetaDTO[]> {
    const res = await fetch(`${API_URL}/${idReceta}/valoraciones`)
    if (!res.ok) throw new Error("Error al obtener valoraciones aprobadas")
    return res.json()
  }
  
  
  