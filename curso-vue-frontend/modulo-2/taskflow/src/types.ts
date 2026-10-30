export type Rol = 'admin' | 'miembro'
export type Estado = 'pendiente' | 'en-curso' | 'hecha'
export type Filtro = Estado | 'todas'

export interface Proyecto {
  id: number
  nombre: string
}

export interface Tarea {
  id: number
  proyectoId: number
  titulo: string
  estado: Estado
}

export interface Usuario {
  id: number
  nombre: string
  rol: Rol
}