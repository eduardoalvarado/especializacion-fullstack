import type { Rol } from '../types'

export type Permiso = 'tarea:crear' | 'tarea:avanzar' | 'tarea:eliminar' | 'proyecto:ajustes'

export const PERMISOS: Record<Rol, Permiso[]> = {
    admin: ['tarea:crear', 'tarea:avanzar', 'tarea:eliminar', 'proyecto:ajustes'],
    miembro: ['tarea:crear', 'tarea:avanzar'],
    lector: []
}