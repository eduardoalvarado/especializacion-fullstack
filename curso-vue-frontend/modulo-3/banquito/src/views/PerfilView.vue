<script setup lang="ts">
import EstadoCarga from '@/components/EstadoCarga.vue'
import { usePerfil } from '@/queries/usePerfil'

const { data, isPending, error, refetch } = usePerfil()
</script>

<template>
  <h1 class="text-2xl font-semibold">Mi perfil</h1>
  <EstadoCarga :cargando="isPending && !data" :error="error" @reintentar="refetch">
    <dl
      v-if="data"
      class="grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl bg-white p-6 text-sm shadow-sm ring-1 ring-slate-200"
    >
      <dt class="text-slate-400">Nombre</dt>
      <dd>{{ data.nombre }}</dd>
      <dt class="text-slate-400">Usuario</dt>
      <dd>{{ data.usuario }}</dd>
      <dt class="text-slate-400">Correo</dt>
      <dd>{{ data.correo }}</dd>
    </dl>
    <!-- TODO(s2): estado de la sesión y botón de cerrar sesión -->
  </EstadoCarga>
</template>
