<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cerrarSesion } from '@/auth/sesion'
import { usuario } from '@/auth/token'

const router = useRouter()
async function salir() {
  await cerrarSesion()
  router.push('/')
}

const enlaces = [
  { to: '/', texto: 'Resumen' },
  { to: '/movimientos', texto: 'Movimientos' },
  { to: '/transferir', texto: 'Transferir' },
  { to: '/beneficiarios', texto: 'Beneficiarios' },
]
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-bold text-teal-700">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-white">B</span>
        Banquito
      </RouterLink>
      <nav class="flex flex-1 flex-wrap gap-1 text-sm">
        <RouterLink
          v-for="e in enlaces"
          :key="e.to"
          :to="e.to"
          class="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100"
          active-class="!bg-teal-50 !text-teal-700 font-medium"
          exact-active-class="!bg-teal-50 !text-teal-700 font-medium"
        >
          {{ e.texto }}
        </RouterLink>
      </nav>
      <template v-if="usuario">
        <span class="text-sm text-slate-500"> Hola, {{ usuario.nombre }}</span>
        <button @click="salir" class="text-sm text-slate-500 hover:text-teal-700">Salir</button>
      </template>
      <!-- TODO(s2): aquí van el nombre de la persona con sesión y el botón «Salir» -->
      <RouterLink to="/perfil" class="text-sm text-slate-500 hover:text-teal-700"
        >Mi perfil</RouterLink
      >
    </div>
  </header>
</template>
