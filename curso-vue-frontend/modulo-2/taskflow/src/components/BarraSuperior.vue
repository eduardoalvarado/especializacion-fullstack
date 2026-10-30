<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePreferenciasStore } from '../stores/preferencias'
import { USUARIOS_DEMO, useSesionStore } from '../stores/sesion'
import { useTareasStore } from '../stores/tareas'
const tareas = useTareasStore()
const preferencias = usePreferenciasStore()
const sesion = useSesionStore()
const { usuario } = storeToRefs(sesion)

const enlaces = [
  {
    name:'proyectos',
    texto: 'Proyectos'
  }
] as const


</script>

<template>
  <header class="bg-sky-600 py-4 text-white shadow dark:bg-sky-900">
    <div class="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-6">
      <div class="flex items-baseline gap-3">
        <h1 class="text-xl font-bold">TaskFlow</h1>
        <span class="text-sm">{{ tareas.pendientes }} por hacer</span>
      </div>
      <nav>
        <RouterLink 
        v-for="enlace in enlaces" 
        :key="enlace.name" 
        :to="{ name: enlace.name}"
        class="rounded px-2 py-1 hover:bg-white/10"
        active-class="bg-white/20 font-semibold"
        >
          {{ enlace.texto }}
        </RouterLink>
      </nav>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          class="rounded border border-white/40 px-2 py-1 hover:bg-white/10"
          @click="preferencias.alternarTema()"
        >
          {{ preferencias.tema === 'claro' ? 'Oscuro' : 'Claro' }}
        </button>
        <template v-if="usuario">
          <span class="rounded-full bg-white/20 px-2.5 py-0.5">
            {{ usuario.nombre }} · {{ usuario.rol }}
          </span>
          <button
            type="button"
            class="rounded border border-white/40 px-2 py-1 hover:bg-white/10"
            @click="sesion.salir()"
          >
            Salir
          </button>
        </template>
        <template v-else>
          <button
            v-for="u in USUARIOS_DEMO"
            :key="u.id"
            type="button"
            class="rounded bg-white px-2 py-1 text-sky-700 hover:bg-sky-50"
            @click="sesion.entrar(u.id)"
          >
            Entrar como {{ u.nombre }}
          </button>
        </template>
      </div>
    </div>
  </header>
</template>