<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {red} from '../services/tareasApi'
import { useSesionStore } from '../stores/sesion'
import { useTareasStore } from '../stores/tareas'
import TareaCard from '../components/TareaCard.vue'
import NuevaTarea from '../components/NuevaTarea.vue'
import FiltroTareas from '../components/FiltroTareas.vue'


const sesion = useSesionStore()
const tareas = useTareasStore()
const { visibles, cargando, error } = storeToRefs(tareas)

</script>
<template>
     <label class="flex items-center gap-2 text-sm text-slate-500">
        <input v-model="red.falla" type="checkbox" />
        Simular error de red
      </label>

      <NuevaTarea />
      <FiltroTareas />

      <p v-if="cargando" class="animate-pulse text-center text-slate-500">Cargando tareas…</p>
      <div
        v-else-if="error"
        class="flex items-center justify-between gap-3 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
      >
        <span>{{ error }}</span>
        <button
          type="button"
          class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          @click="tareas.cargar()"
        >
          Reintentar
        </button>
      </div>
      <template v-else>
        <ul class="flex flex-col gap-3">
          <TareaCard
            v-for="t in visibles"
            :key="t.id"
            :tarea="t"
            :puede-eliminar="sesion.esAdmin"
            @avanzar="tareas.avanzar"
            @eliminar="tareas.eliminar"
          />
        </ul>
        <p v-if="visibles.length === 0" class="text-center text-slate-500">
          No hay tareas en esta vista.
        </p>
      </template>

</template>