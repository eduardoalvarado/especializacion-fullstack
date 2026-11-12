<script setup lang="ts">
import { dinero, fecha } from '@/lib/formato'
import type { Movimiento } from '@/types'

defineProps<{ movimientos: Movimiento[] }>()
</script>

<template>
  <ul class="divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
    <li
      v-for="m in movimientos"
      :key="m.id"
      class="flex items-center justify-between gap-4 px-4 py-3"
    >
      <div class="min-w-0">
        <!-- v-html a propósito: el concepto puede traer formato. En la sesión 2 se vuelve el hueco de XSS -->
        <p class="truncate text-sm font-medium" {{ m.concepto }}></p>
        <p class="text-xs text-slate-400">{{ fecha(m.fecha) }} · {{ m.categoria }}</p>
      </div>
      <p
        class="shrink-0 text-sm font-semibold tabular-nums"
        :class="m.monto < 0 ? 'text-slate-700' : 'text-emerald-600'"
      >
        {{ dinero(m.monto) }}
      </p>
    </li>
    <li v-if="!movimientos.length" class="px-4 py-6 text-center text-sm text-slate-400">
      Sin movimientos
    </li>
  </ul>
</template>
