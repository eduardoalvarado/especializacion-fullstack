<script setup lang="ts">
import { useTareasStore } from '@/stores/tareas'
import { useProyectosStore } from '../stores/proyectos'
import { precargar } from '@/router/precargar'

const proyectos = useProyectosStore()
const tareas = useTareasStore()

const cantidad = (proyectoId: number) =>
  tareas.tareas.filter((t) => t.proyectoId === proyectoId && t.estado !== 'hecha').length
</script>
<template>
  <h2 class="text-2xl font-bold">Proyectos de vue</h2>

  <ul class="flex flex-col gap-3">
    <li v-for="p in proyectos.proyectos" :key="p.id">
      <RouterLink
        :to="{ name: 'proyectos-tareas', params: { id: p.id } }"
        class="flex items-baseline justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        @mouseenter="precargar({name: 'proyectos-tareas', params: {id: p.id}})"
        @focus="precargar({name: 'proyectos-tareas', params: {id: p.id}})"
      >
        <span class="text-lg font-medium" :style="{ viewTransitionName: `proyecto-${p.id}`}">{{ p.nombre }}</span>
        <span class="text-sm text-slate-500">{{ cantidad(p.id) }}</span>
      </RouterLink>
    </li>
  </ul>
</template>
