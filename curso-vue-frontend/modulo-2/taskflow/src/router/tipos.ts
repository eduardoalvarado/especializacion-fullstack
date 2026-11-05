import type { Permiso } from '@/lib/permisos'
import type { RouteRecordInfo } from 'vue-router'

export interface RutasTaskFlow {
  inicio: RouteRecordInfo<'inicio', '/'>
  proyectos: RouteRecordInfo<'proyectos', '/proyectos'>
  'proyectos-tareas': RouteRecordInfo<
    'proyectos-tareas',
    '/proyectos/:id',
    { id: number | string },
    { id: string }
  >
  'proyecto-ajustes': RouteRecordInfo<
    'proyecto-ajustes',
    '/proyectos/:id/ajustes',
    { id: number | string },
    { id: string }
  >
  login: RouteRecordInfo<'login', '/login'>
  'sin-acceso': RouteRecordInfo<'sin-acceso', '/sin-acceso'>
  'no-encontrada': RouteRecordInfo<
    'no-encontrada',
    '/:pathMatch(.*)*',
    { pathMatch: string | string[] },
    { pathMatch: string[] }
  >
}

declare module 'vue-router' {
  interface RouteMeta {
    requiereAuth?: boolean
    permiso?: Permiso
  }

  interface TypesConfig {
    RouteNamedMap: RutasTaskFlow
  }
}
