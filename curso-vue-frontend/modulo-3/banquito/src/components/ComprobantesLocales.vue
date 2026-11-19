<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { dinero, fecha } from '@/lib/formato'
import { leerComprobantes } from '@/storage/comprobantes'

// IndexedDB responde con promesas, como un servidor: se lee con una consulta más
const { data } = useQuery({
  key: ['comprobantes'],
  query: async () => (await leerComprobantes()).sort((a, b) => b.fecha.localeCompare(a.fecha)),
})
</script>

<template>
  <section class="flex max-w-lg flex-col gap-3">
    <h2 class="font-semibold">Comprobantes en este dispositivo</h2>
    <p v-if="!data?.length" class="text-sm text-slate-500">
      Aún no hay comprobantes guardados aquí.
    </p>
    <ul v-else class="flex flex-col gap-2" data-prueba="comprobantes">
      <li
        v-for="c in data"
        :key="c.id"
        class="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200"
      >
        <span>
          <span class="block font-medium">{{ c.concepto }}</span>
          <span class="text-xs text-slate-400">{{ fecha(c.fecha) }} · {{ c.id }}</span>
        </span>
        <span class="tabular-nums">{{ dinero(c.monto) }}</span>
      </li>
    </ul>
  </section>
</template>
