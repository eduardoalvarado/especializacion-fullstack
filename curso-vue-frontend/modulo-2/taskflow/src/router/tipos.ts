import type { RouteRecordInfo } from "vue-router"

export interface RutasTaskFlow {
    inicio: RouteRecordInfo<'inicio', '/'>
    proyectos: RouteRecordInfo<'proyectos', '/proyectos'>
    'proyectos-tareas': RouteRecordInfo<
        'proyectos-tareas', '/proyectos/:id',
        {id: number | string},
        {id: string}
    >
    tareas: RouteRecordInfo<'tareas', '/tareas'>
    'no-encontrada': RouteRecordInfo<'no-encontrada', '/:pathMatch(.*)*', {pathMatch: string | string[]}, {pathMatch: string[]}>
}

declare module 'vue-router' {
    interface TypesConfig {
        RouteNamedMap: RutasTaskFlow
    }
}
