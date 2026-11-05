<script setup lang="ts">
import { computed } from 'vue'
import { useProyectosStore } from '../stores/proyectos'
import Puede from '@/components/Puede.vue'

const props = defineProps<{ id: number }>()

const proyectos = useProyectosStore()
const proyecto = computed(() => proyectos.porId(props.id))
</script>

<template>
  <RouterLink :to="{ name: 'proyectos' }" class="text-sm text-sky-600 dark:text-sky-400">
    ← Proyectos
  </RouterLink>

  <p v-if="!proyecto" class="text-center text-slate-500">Este proyecto no existe.</p>
  <template v-else>
    <h2 class="text-2xl font-bold" :style="{ viewTransitionName: `proyecto-${id}` }">
      {{ proyecto.nombre }}
    </h2>

    <nav class="flex gap-2 border-b border-slate-200 text-sm dark:border-slate-700">
      <RouterLink
        :to="{ name: 'proyectos-tareas', params: { id } }"
        class="-mb-px border-b-2 border-transparent px-3 py-2 hover:text-sky-600"
        active-class="border-sky-600 font-semibold text-sky-600"
      >
        Tareas
      </RouterLink>
      <Puede permiso="proyecto:ajustes">
        <RouterLink
          :to="{ name: 'proyecto-ajustes', params: { id } }"
          class="-mb-px border-b-2 border-transparent px-3 py-2 hover:text-sky-600"
          active-class="border-sky-600 font-semibold text-sky-600"
        >
          Ajustes
        </RouterLink>
      </Puede>
    </nav>
    <RouterView />
  </template>
</template>
