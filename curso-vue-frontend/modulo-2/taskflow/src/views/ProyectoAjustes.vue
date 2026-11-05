<script setup lang="ts">
import { useSesionStore } from '../stores/sesion'

const sesion = useSesionStore()
</script>

<template>
  <section class="flex flex-col gap-3">
    <h3 class="text-lg font-semibold">Miembros del proyecto</h3>
    <ul class="flex flex-col gap-2">
      <li
        v-if="sesion.usuario"
        class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800"
      >
        <span>{{ sesion.usuario.nombre }}</span>
        <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-700">
          {{ sesion.usuario.rol }}
        </span>
      </li>
    </ul>
  </section>
</template>
