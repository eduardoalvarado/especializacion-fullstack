<script setup lang="ts">
import type { Estado, Tarea } from '../types'

defineProps<{ tarea: Tarea }>()
defineEmits<{ avanzar: [id: number]; eliminar: [id: number] }>()

const etiquetas: Record<Estado, string> = {
  pendiente: 'Pendiente',
  'en-curso': 'En curso',
  hecha: 'Hecha',
}

const colores: Record<Estado, string> = {
  pendiente: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  'en-curso': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  hecha: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
}
</script>

<template>
  <li
    class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="flex items-center gap-3">
      <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="colores[tarea.estado]">
        {{ etiquetas[tarea.estado] }}
      </span>

      <span :class="tarea.estado === 'hecha' && 'text-slate-400 line-through'">
        {{ tarea.titulo }}
      </span>
    </div>

    <div class="flex gap-2">
      <button
        v-if="tarea.estado !== 'hecha'"
        type="button"
        class="rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700"
        @click="$emit('avanzar', tarea.id)"
      >
        Avanzar
      </button>
      <button
        type="button"
        class="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        @click="$emit('eliminar', tarea.id)"
      >
        Eliminar
      </button>
    </div>
  </li>
</template>
