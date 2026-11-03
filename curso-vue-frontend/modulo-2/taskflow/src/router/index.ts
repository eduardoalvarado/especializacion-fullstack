import {createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useSesionStore } from '@/stores/sesion.ts'
import { instalarTransiciones } from './transiciones.ts'



const idDe = (route: RouteLocationNormalized) => Number((route.params as { id: string}).id)

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'inicio',
            redirect: { name: 'proyectos'}
        },
        {
            path: '/proyectos',
            name: 'proyectos',
            component: () => import('../views/ProyectosView.vue'),
            meta: { requiereAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/proyectos/:id',
            component: () => import('../views/ProyectoView.vue'),
            props: (route) => ({ id:idDe(route)}),
            children: [
                {
                    path: '',
                    name: 'proyectos-tareas',
                    component: () => import('../views/TareasView.vue'),
                    props: (route) => ({ proyectoId: idDe(route) })
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'no-encontrada',
            component: () => import('../views/NoEncontrada.vue')
        }
    ]
})

//guards globales: corre antes de cada navegacion
router.beforeEach((to) => {
    const sesion = useSesionStore()

    if(to.meta.requireAuth && !sesion.autenticado) {
        return { name: 'login', query: { redirect: to.fullPath}}
    }
    if (to.meta.soloAdmin && !sesion.esAdmin) {
        return { name: 'proyectos' }
      }

    if(to.name === 'login' && sesion.autenticado) {
        return { name: 'proyectos'}
    }
})

//se usa el metodo instalarTransiciones ddesde transiciones.ts
instalarTransiciones(router)