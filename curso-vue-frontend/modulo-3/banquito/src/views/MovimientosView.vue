<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import EstadoCarga from '@/components/EstadoCarga.vue'
import TablaMovimientos from '@/components/TablaMovimientos.vue'
import { useDebounced } from '@/lib/debounce'
import { useCuentas } from '@/queries/useCuentas'
import { useMovimientos } from '@/queries/useMovimientos'
import type { FiltroMovimientos } from '@/types'

const cuentas = useCuentas()
const busqueda = ref('')
const q = useDebounced(busqueda)
const filtro = reactive({ cuentaId: '', tipo: '' as FiltroMovimientos['tipo'], page: 1 })
watch([() => filtro.cuentaId, () => filtro.tipo, q], () => (filtro.page = 1))

const { data, isPending, error, refetch } = useMovimientos(() => ({
  cuentaId: filtro.cuentaId,
  tipo: filtro.tipo,
  q: q.value,
  page: filtro.page,
  limit: 8,
}))
const paginas = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / 8)))
</script>

<template>
  <h1 class="text-2xl font-semibold">Movimientos</h1>

  <div class="flex flex-wrap gap-3 text-sm">
    <select v-model="filtro.cuentaId" class="rounded-lg border border-slate-300 bg-white px-3 py-2">
      <option value="">Todas las cuentas</option>
      <option v-for="c in cuentas.data.value" :key="c.id" :value="c.id">{{ c.nombre }}</option>
    </select>
    <select v-model="filtro.tipo" class="rounded-lg border border-slate-300 bg-white px-3 py-2">
      <option value="">Ingresos y egresos</option>
      <option value="ingreso">Ingresos</option>
      <option value="egreso">Egresos</option>
    </select>
    <input
      v-model="busqueda"
      type="search"
      placeholder="Buscar concepto…"
      class="min-w-48 flex-1 rounded-lg border border-slate-300 px-3 py-2"
    />
  </div>

  <EstadoCarga :cargando="isPending && !data" :error="error" :filas="6" @reintentar="refetch">
    <TablaMovimientos :movimientos="data?.items ?? []" />
    <div class="flex items-center justify-between text-sm text-slate-500">
      <span>{{ data?.total ?? 0 }} movimientos</span>
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          :disabled="filtro.page <= 1"
          @click="filtro.page--"
        >
          Anterior
        </button>
        <span>{{ filtro.page }} / {{ paginas }}</span>
        <button
          class="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
          :disabled="filtro.page >= paginas"
          @click="filtro.page++"
        >
          Siguiente
        </button>
      </div>
    </div>
  </EstadoCarga>
</template>
