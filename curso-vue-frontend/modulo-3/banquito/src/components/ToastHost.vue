<script setup lang="ts">
import { toasts } from '@/lib/toasts'
</script>

<template>
  <div
    class="fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    aria-live="polite"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      class="rounded-xl px-4 py-3 text-sm text-white shadow-lg"
      :class="t.tipo === 'error' ? 'bg-rose-600' : 'bg-teal-700'"
      :data-tipo="t.tipo"
    >
      {{ t.texto }}
    </div>
  </div>
</template>
