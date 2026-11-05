<script setup lang="ts">
import { dinero } from '@/lib/formato'
import type { Cuenta } from '@/types'

defineProps<{ cuenta: Cuenta }>()
</script>

<template>
  <article class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <p class="text-sm text-slate-500">{{ cuenta.nombre }}</p>
    <p class="mt-1 text-2xl font-semibold tabular-nums">
      {{ dinero(cuenta.saldo, cuenta.moneda) }}
    </p>
    <p class="mt-2 text-xs text-slate-400">{{ cuenta.numero }} · {{ cuenta.moneda }}</p>
  </article>
</template>
