<script setup lang="ts">
import { useProyectosStore } from '../stores/proyectos'

const proyectos = useProyectosStore()

//const cantidad = (proyectoId: number) =>
</script>
<template>
  <h2 class="text-2xl font-bold">Proyectos de vue</h2>

  <p v-if="proyectos">Cargando proyectos...</p>

  <ul class="flex flex-col gap-3">
    <li
      v-for="p in proyectos.proyectos"
      :key="p.id"
      class="flex item-baseline justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
        <RouterLink :to = "{ name: 'proyectos-tareas', params: {id: p.id}}" >
            <span class="text-lg font-medium">{{ p.nombre }}</span>
        </RouterLink>
     
    </li>
  </ul>
</template>
