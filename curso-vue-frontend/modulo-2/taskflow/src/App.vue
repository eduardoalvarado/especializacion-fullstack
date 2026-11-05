<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter} from 'vue-router'
import BarraSuperior from './components/BarraSuperior.vue'
import { useSesionStore } from './stores/sesion.ts';

const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()


//Este watch evalua si la sesion termina en cualquier momento, incluso desde otra pestania, si esto pasa volvemos al login
watch(
  () => sesion.estado,
  (estado) => {
    if(estado === 'anonimo' && route.meta.requiereAuth)
      router.push({ name: 'login'})
  }
)

</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
    <BarraSuperior />

    <main class="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <RouterView />
    </main>
  </div>
</template>