<script setup lang="ts">
import BarraSuperior from '@/components/BarraSuperior.vue'
import PanelClase from '@/components/PanelClase.vue'
import ToastHost from '@/components/ToastHost.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <BarraSuperior />
    <main class="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <RouterView />
    </main>
    <ToastHost />
    <PanelClase />
  </div>
</template>
