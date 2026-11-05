<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePreferenciasStore } from '../stores/preferencias'
import { useSesionStore } from '../stores/sesion'
import { useTareasStore } from '../stores/tareas'
import { useFirebaseApp } from 'vuefire'


const tareas = useTareasStore()
const preferencias = usePreferenciasStore()
const sesion = useSesionStore()

// usamos firebase
const proyecto = useFirebaseApp().options.projectId

// Con la caché persistente la app sigue funcionando sin red: avisamos al usuario
const enLinea = ref(navigator.onLine)
const actualizar = () => (enLinea.value = navigator.onLine)
onMounted(() => {
  window.addEventListener('online', actualizar)
  window.addEventListener('offline', actualizar)
})
onUnmounted(() => {
  window.removeEventListener('online', actualizar)
  window.removeEventListener('offline', actualizar)
})

//storeToRefs mantiene la reactivdada al sacar una copia del state y los getters del store
const { usuario } = storeToRefs(sesion)

const salir = () => sesion.salir()
</script>

<template>
  <header class="bg-sky-600 py-4 text-white shadow dark:bg-sky-900">
    <div class="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-6">
      <div class="flex items-baseline gap-3">
        <h1 class="text-xl font-bold">TaskFlow</h1>
        <span class="text-sm">{{ tareas.pendientes }} por hacer</span>
        <span class="rounded bg-white/15 px-1.5 text-sm" >{{ proyecto }}</span>
        <span v-if="!enLinea" class="rounded bg-amber-400 px-1.5 text-xs text-slate-900">
          Sin conexión
        </span>
      </div>
      <nav>
        <RouterLink
          :to="{ name: 'proyectos' }"
          class="rounded px-2 py-1 hover:bg-white/10"
          active-class="bg-white/20 font-semibold"
        >
          Proyectos
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
            @click="salir"
          >
            Salir
          </button>
        </template>
        <template v-else>
          <RouterLink
            :to="{ name: 'login' }"
            class="rounded bg-white px-2 py-1 text-sky-700 hover:bg-sky-50"
          >
            Entrar
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
