import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useSesionStore } from '@/stores/sesion.ts'
import { instalarTransiciones } from './transiciones.ts'
import { getCurrentUser } from 'vuefire'

const idDe = (route: RouteLocationNormalized) => Number((route.params as { id: string }).id)

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'inicio',
      redirect: { name: 'proyectos' },
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
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/proyectos/:id',
      component: () => import('../views/ProyectoView.vue'),
      meta: { requiereAuth: true },
      props: (route) => ({ id: idDe(route) }),
      children: [
        {
          path: '',
          name: 'proyectos-tareas',
          component: () => import('../views/TareasView.vue'),
          props: (route) => ({ proyectoId: idDe(route) }),
        },
        {
          path: 'ajustes',
          name: 'proyecto-ajustes',
          component: () => import('../views/ProyectoAjustes.vue'),
          meta: { permiso: 'proyecto:ajustes' },
        },
      ],
    },
    {
        path: '/sin-acceso',
        name: 'sin-acceso',
        component: () => import('../views/SinAcceso.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'no-encontrada',
      component: () => import('../views/NoEncontrada.vue'),
    },
  ],
})

//guards globales: corre antes de cada navegacion
router.beforeEach(async (to) => {
   
  const sesion = useSesionStore()
  //espera a obtener la lista para saber que rol tiene el usuario
  await sesion.lista()

  if (to.meta.requiereAuth && !sesion.autenticado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.permiso && !sesion.puede(to.meta.permiso)) {
    return { name: 'sin-acceso' }
  }

  if (to.name === 'login' && sesion.autenticado) {
    return { name: 'proyectos' }
  }
})

//se usa el metodo instalarTransiciones ddesde transiciones.ts
instalarTransiciones(router)
