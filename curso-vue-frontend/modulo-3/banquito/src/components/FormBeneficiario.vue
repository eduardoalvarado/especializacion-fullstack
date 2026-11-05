<script setup lang="ts">
import { reactive } from 'vue'
import { reportar } from '@/lib/errores'
import { avisar } from '@/lib/toasts'
import { useCrearBeneficiario } from '@/queries/useGestionBeneficiarios'
import { BANCOS } from '@/types'

const { mutateAsync: crear, isLoading } = useCrearBeneficiario()
// TODO(s3): validación con esquema y errores por campo
const form = reactive({ nombre: '', alias: '', banco: BANCOS[0] as string, cuenta: '' })

async function enviar() {
  try {
    await crear({ ...form })
    avisar('Beneficiario agregado')
    Object.assign(form, { nombre: '', alias: '', cuenta: '' })
  } catch (e) {
    reportar(e)
  }
}
</script>

<template>
  <form
    class="grid gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2"
    @submit.prevent="enviar"
  >
    <h2 class="font-semibold sm:col-span-2">Nuevo beneficiario</h2>
    <input
      v-model="form.nombre"
      name="nombre"
      placeholder="Nombre completo"
      class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
    <input
      v-model="form.alias"
      name="alias"
      placeholder="Alias (opcional)"
      class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
    <select
      v-model="form.banco"
      name="banco"
      class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
    >
      <option v-for="b in BANCOS" :key="b">{{ b }}</option>
    </select>
    <input
      v-model="form.cuenta"
      name="cuenta"
      placeholder="CCI (20 dígitos)"
      class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
    <button
      class="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 sm:col-span-2"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Guardando…' : 'Agregar' }}
    </button>
  </form>
</template>
