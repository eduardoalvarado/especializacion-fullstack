<script setup lang="ts">
import { cuentaOculta } from '@/lib/formato'
import type { Beneficiario } from '@/types'

defineProps<{ beneficiario: Beneficiario }>()
defineEmits<{ favorito: []; eliminar: [] }>()
</script>

<template>
  <li class="flex items-center gap-3 px-4 py-3">
    <button
      class="text-xl leading-none"
      :class="beneficiario.favorito ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'"
      :aria-pressed="beneficiario.favorito"
      :aria-label="`Marcar a ${beneficiario.nombre} como favorito`"
      @click="$emit('favorito')"
    >
      ★
    </button>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium">{{ beneficiario.nombre }}</p>
      <p class="truncate text-xs text-slate-400">
        {{ beneficiario.alias }} · {{ beneficiario.banco }} ·
        {{ cuentaOculta(beneficiario.cuenta) }}
      </p>
    </div>
    <button
      class="rounded-lg px-2 py-1 text-sm text-rose-600 hover:bg-rose-50"
      @click="$emit('eliminar')"
    >
      Eliminar
    </button>
  </li>
</template>
