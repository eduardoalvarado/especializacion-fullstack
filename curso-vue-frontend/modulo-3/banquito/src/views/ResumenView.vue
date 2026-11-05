<script setup lang="ts">
import { computed } from 'vue'
import EstadoCarga from '@/components/EstadoCarga.vue'
import FavoritosRapidos from '@/components/FavoritosRapidos.vue'
import TablaMovimientos from '@/components/TablaMovimientos.vue'
import TarjetaCuenta from '@/components/TarjetaCuenta.vue'
import { useCuentas } from '@/queries/useCuentas'
import { useMovimientos } from '@/queries/useMovimientos'

const cuentas = useCuentas()
const ultimos = useMovimientos(() => ({ cuentaId: '', q: '', tipo: '', page: 1, limit: 5 }))
const items = computed(() => ultimos.data.value?.items ?? [])
</script>

<template>
  <h1 class="text-2xl font-semibold">Hola, Luis</h1>

  <EstadoCarga
    :cargando="cuentas.isPending.value && !cuentas.data.value"
    :error="cuentas.error.value"
    @reintentar="cuentas.refetch"
  >
    <div class="grid gap-4 sm:grid-cols-3">
      <TarjetaCuenta v-for="c in cuentas.data.value" :key="c.id" :cuenta="c" />
    </div>
  </EstadoCarga>

  <section class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold">Últimos movimientos</h2>
      <RouterLink to="/movimientos" class="text-sm text-teal-700 hover:underline"
        >Ver todos</RouterLink
      >
    </div>
    <EstadoCarga
      :cargando="ultimos.isPending.value && !ultimos.data.value"
      :error="ultimos.error.value"
      :filas="5"
      @reintentar="ultimos.refetch"
    >
      <TablaMovimientos :movimientos="items" />
    </EstadoCarga>
  </section>

  <FavoritosRapidos />
</template>
