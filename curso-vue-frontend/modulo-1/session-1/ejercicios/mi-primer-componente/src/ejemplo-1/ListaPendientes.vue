<script lang="ts" setup>
import { ref, computed } from 'vue'

interface Tarea {
  id: number
  nombre: string
  completado: boolean
}
const tareas = ref<Tarea[]>([
  { id: 1, nombre: 'Tarea 1', completado: false },
  { id: 2, nombre: 'Tarea 2', completado: false },
  { id: 3, nombre: 'Tarea 3', completado: true },
])

const pendientes = computed(() => tareas.value.filter((t) => !t.completado).length)
</script>

<template>
  <div>
    <p>Tareas pendientes: {{ pendientes }}</p>
  </div>
</template>

<style scoped lang="css"></style>
