<script setup lang="ts">
import BarraSuperior from './components/BarraSuperior.vue'

</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
    <BarraSuperior />

    <main class="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <RouterView />
    </main>
  </div>
</template>