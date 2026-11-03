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
  login: RouteRecordInfo<'login', '/login'>
  'no-encontrada': RouteRecordInfo<
    'no-encontrada',
    '/:pathMatch(.*)*',
    { pathMatch: string | string[] },
    { pathMatch: string[] }
  >
}

declare module 'vue-router' {
  interface RouteMeta {
    requireAuth?: boolean
    soloAdmin?: boolean
  }

  interface TypesConfig {
    RouteNamedMap: RutasTaskFlow
  }
}
