<script setup lang="ts">
import { computed } from 'vue'
import { useBeneficiarios } from '@/queries/useBeneficiarios'

const { data } = useBeneficiarios()
const favoritos = computed(() => (data.value ?? []).filter((b) => b.favorito))
</script>

<template>
  <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-sm font-semibold text-slate-600">Favoritos</h2>
    <p v-if="!data" class="mt-2 text-sm text-slate-400">Cargando…</p>
    <ul v-else class="mt-3 flex flex-wrap gap-2">
      <li
        v-for="b in favoritos"
        :key="b.id"
        class="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800"
      >
        ★ {{ b.alias || b.nombre }}
      </li>
      <li v-if="!favoritos.length" class="text-sm text-slate-400">
        Marca una estrella en Beneficiarios
      </li>
    </ul>
  </section>
</template>
