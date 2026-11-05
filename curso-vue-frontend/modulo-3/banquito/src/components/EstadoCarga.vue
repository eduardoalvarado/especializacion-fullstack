<script setup lang="ts">
defineProps<{ cargando: boolean; error: Error | null; filas?: number }>()
defineEmits<{ reintentar: [] }>()
</script>

<template>
  <div
    v-if="error"
    role="alert"
    class="rounded-xl bg-rose-50 p-4 text-sm text-rose-800 ring-1 ring-rose-200"
  >
    <p class="font-medium">No pudimos cargar los datos</p>
    <p class="mt-1">{{ error.message }}</p>
    <button
      class="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
      @click="$emit('reintentar')"
    >
      Reintentar
    </button>
  </div>
  <div
    v-else-if="cargando"
    class="flex animate-pulse flex-col gap-2"
    aria-busy="true"
    data-estado="cargando"
  >
    <div v-for="n in filas ?? 3" :key="n" class="h-12 rounded-xl bg-slate-200"></div>
  </div>
  <slot v-else />
</template>
