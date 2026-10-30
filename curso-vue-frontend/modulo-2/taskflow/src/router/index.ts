import {createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import ProyectosView from '../views/ProyectosView.vue'
import NoEncontrada from '../views/NoEncontrada.vue'
import TareasView from '@/views/TareasView.vue'
import ProyectoView from '@/views/ProyectoView.vue'


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
            component: ProyectosView
        },
        {
            path: '/proyectos/:id',
            component: ProyectoView,
            props: (route) => ({ id:idDe(route)}),
            children: [
                {
                    path: '',
                    name: 'proyectos-tareas',
                    component: TareasView,
                    props: (route) => ({ proyectoId: idDe(route) })
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'no-encontrada',
            component: NoEncontrada
        }
    ]
})