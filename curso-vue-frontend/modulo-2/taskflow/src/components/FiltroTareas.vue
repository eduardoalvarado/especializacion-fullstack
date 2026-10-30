<script setup lang="ts">
import { useTareasStore } from '../stores/tareas'
import type { Filtro } from '../types'
const tareas = useTareasStore()
const opciones: { valor: Filtro; texto: string }[] = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'en-curso', texto: 'En curso' },
  { valor: 'hecha', texto: 'Hechas' },
]
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="o in opciones"
      :key="o.valor"
      type="button"
      class="rounded-full border px-3 py-1 text-sm transition"
      :class="
        tareas.filtro === o.valor
          ? 'border-sky-600 bg-sky-600 text-white'
          : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'
      "
      @click="tareas.filtro = o.valor"
    >
      {{ o.texto }}
    </button>
  </div>
</template>