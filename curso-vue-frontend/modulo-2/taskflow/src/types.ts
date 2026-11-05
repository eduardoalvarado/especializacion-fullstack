export type Rol = 'admin' | 'miembro' | 'lector'
export type Estado = 'pendiente' | 'en-curso' | 'hecha'
export type Filtro = Estado | 'todas'

export interface Proyecto {
  id: number
  nombre: string
}

export interface Tarea {
  id: string
  proyectoId: number
  titulo: string
  estado: Estado
  uid: string
  creada: number
}

export interface Usuario {
  id: string
  nombre: string
  rol: Rol
}