<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { USUARIOS_DEMO, useSesionStore } from '../stores/sesion'

const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()

// `redirect` viene de la guardia. Solo aceptamos rutas internas ("/algo"), nunca "//otro-sitio"
const redirect = route.query.redirect
const destino =
  typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/proyectos'

function entrar(id: number) {
  sesion.entrar(id)
  router.push(destino)
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-sm flex-col gap-4 py-8">
    <h2 class="text-2xl font-bold">Entrar a TaskFlow</h2>
    <p v-if="route.query.redirect" class="text-sm text-slate-500">
      Para ver <code>{{ route.query.redirect }}</code> primero inicia sesión.
    </p>
    <button
      v-for="u in USUARIOS_DEMO"
      :key="u.id"
      type="button"
      class="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      @click="entrar(u.id)"
    >
      <span class="font-medium">Entrar como {{ u.nombre }}</span>
      <span class="ml-2 text-sm text-slate-500">{{ u.rol }}</span>
    </button>
  </section>
</template>