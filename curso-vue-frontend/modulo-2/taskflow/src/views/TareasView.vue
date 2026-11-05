<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTareasStore } from '../stores/tareas'
import TareaCard from '../components/TareaCard.vue'
import NuevaTarea from '../components/NuevaTarea.vue'
import FiltroTareas from '../components/FiltroTareas.vue'
import { computed } from 'vue'
import Puede from '@/components/Puede.vue'

const props = defineProps<{ proyectoId: number }>()

const tareas = useTareasStore()

const { visibles, cargando, error } = storeToRefs(tareas)
const proyectoSeleccionado = computed(() =>
  visibles.value.filter((t) => t.proyectoId === props.proyectoId),
)
</script>
<template>
  <!-- <label class="flex items-center gap-2 text-sm text-slate-500">
        <input v-model="red.falla" type="checkbox" />
        Simular error de red
      </label> -->

  <NuevaTarea :proyecto-id="proyectoId" />
  <FiltroTareas />

  <p v-if="cargando" class="animate-pulse text-center text-slate-500">Cargando tareas…</p>
  <div
    v-else-if="error"
    class="flex items-center justify-between gap-3 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
  >
    <span>{{ error.message }}</span>
  </div>
  <template v-else>
    <ul class="flex flex-col gap-3">
      <Puede permiso="tarea:crear">
        <TareaCard
          v-for="t in proyectoSeleccionado"
          :key="t.id"
          :tarea="t"
          @avanzar="tareas.avanzar"
          @eliminar="tareas.eliminar"
        />
      </Puede>
    </ul>
    <p v-if="visibles.length === 0" class="text-center text-slate-500">
      No hay tareas en esta vista.
    </p>
  </template>
</template>
