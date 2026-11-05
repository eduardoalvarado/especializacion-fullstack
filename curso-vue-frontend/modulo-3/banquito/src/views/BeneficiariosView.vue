<script setup lang="ts">
import { computed } from 'vue'
import EstadoCarga from '@/components/EstadoCarga.vue'
import FilaBeneficiario from '@/components/FilaBeneficiario.vue'
import FormBeneficiario from '@/components/FormBeneficiario.vue'
import { useAlternarFavorito, useBeneficiarios } from '@/queries/useBeneficiarios'
import { useEliminarBeneficiario } from '@/queries/useGestionBeneficiarios'

const { data, isPending, error, refetch } = useBeneficiarios()
const { mutate: alternar } = useAlternarFavorito()
const { mutate: eliminar } = useEliminarBeneficiario()
const favoritos = computed(() => (data.value ?? []).filter((b) => b.favorito).length)
</script>

<template>
  <div class="flex items-baseline justify-between">
    <h1 class="text-2xl font-semibold">Beneficiarios</h1>
    <span class="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700" data-testid="favoritos"
      >★ {{ favoritos }} favoritos</span
    >
  </div>

  <EstadoCarga :cargando="isPending && !data" :error="error" :filas="4" @reintentar="refetch">
    <ul class="divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
      <FilaBeneficiario
        v-for="b in data"
        :key="b.id"
        :beneficiario="b"
        @favorito="alternar(b)"
        @eliminar="eliminar(b.id)"
      />
      <li v-if="!data?.length" class="px-4 py-6 text-center text-sm text-slate-400">
        Aún no tienes beneficiarios
      </li>
    </ul>
  </EstadoCarga>

  <FormBeneficiario />
</template>
