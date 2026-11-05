import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiereSesion?: boolean
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'resumen',
      component: () => import('@/views/ResumenView.vue'),
      meta: { requiereSesion: true },
    },
    {
      path: '/movimientos',
      name: 'movimientos',
      component: () => import('@/views/MovimientosView.vue'),
      meta: { requiereSesion: true },
    },
    {
      path: '/transferir',
      name: 'transferir',
      component: () => import('@/views/TransferirView.vue'),
      meta: { requiereSesion: true },
    },
    {
      path: '/beneficiarios',
      name: 'beneficiarios',
      component: () => import('@/views/BeneficiariosView.vue'),
      meta: { requiereSesion: true },
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiereSesion: true },
    },
    {
      path: '/:rest(.*)*',
      name: 'no-encontrada',
      component: () => import('@/views/NoEncontrada.vue'),
    },
  ],
})
