<script setup lang="ts">
import { ref } from 'vue'
import { useTareasStore } from '../stores/tareas'

const props = defineProps<{proyectoId: number}>()
const tareas = useTareasStore()
const titulo = ref('')

function enviar() {
  const limpio = titulo.value.trim()
  if (!limpio) return
  tareas.agregar(limpio, props.proyectoId)
  titulo.value = ''
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="enviar">
    <input
      v-model="titulo"
      type="text"
      placeholder="Nueva tarea…"
      class="min-w-0 flex-1 rounded border border-slate-300 bg-white px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
    />
    <button type="submit" class="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
      Agregar
    </button>
  </form>
</template>