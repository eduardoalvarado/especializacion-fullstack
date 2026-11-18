<script setup lang="ts">
import { reactive } from 'vue'
import { useForm } from 'vee-validate'
import { ApiError } from '@/api/http'
import { conEsquema } from '@/lib/esquema'
import { reportar } from '@/lib/errores'
import { avisar } from '@/lib/toasts'
import { useCrearBeneficiario } from '@/queries/useGestionBeneficiarios'
import { BANCOS } from '@/types'
import { beneficiarioSchema } from '@/schemas'

const { mutateAsync: crear, isLoading } = useCrearBeneficiario()

const { defineField, errors, handleSubmit, setErrors, resetForm } = useForm({
  validationSchema: conEsquema(beneficiarioSchema),
  initialValues: { nombre: '', alias: '', banco: BANCOS[0], cuenta: '' },
})

const [nombre] = defineField('nombre')
const [alias] = defineField('alias')
const [banco] = defineField('banco')
const [cuenta] = defineField('cuenta')

const enviar = handleSubmit(async (datos) => {
  try {
    await crear(datos)
    avisar('Beneficiario agregado')
    resetForm()
  } catch (e) {
    if (e instanceof ApiError && e.status === 422 && e.fields) setErrors(e.fields)
    else if (e instanceof ApiError && e.status === 409) setErrors({ cuenta: e.message })
    else reportar(e)
  }
})
</script>

<template>
  <form
    class="grid gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2"
    novalidate
    @submit="enviar"
  >
    <h2 class="font-semibold sm:col-span-2">Nuevo beneficiario</h2>
    <label class="flex flex-col gap-1 text-sm">
      <input
        v-model="nombre"
        name="nombre"
        placeholder="Nombre completo"
        class="rounded-lg border px-3 py-2"
        :class="errors.nombre ? 'border-rose-400' : 'border-slate-300'"
      />
      <span v-if="errors.nombre" class="text-xs text-rose-600">{{ errors.nombre }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <input
        v-model="alias"
        name="alias"
        placeholder="Alias (opcional)"
        class="rounded-lg border px-3 py-2"
        :class="errors.alias ? 'border-rose-400' : 'border-slate-300'"
      />
      <span v-if="errors.alias" class="text-xs text-rose-600">{{ errors.alias }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <select v-model="banco" name="banco" class="rounded-lg border border-slate-300 px-3 py-2">
        <option v-for="b in BANCOS" :key="b">{{ b }}</option>
      </select>
      <span v-if="errors.banco" class="text-xs text-rose-600">{{ errors.banco }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <input
        v-model="cuenta"
        name="cuenta"
        inputmode="numeric"
        placeholder="CCI (20 dígitos)"
        class="rounded-lg border px-3 py-2"
        :class="errors.cuenta ? 'border-rose-400' : 'border-slate-300'"
      />
      <span v-if="errors.cuenta" class="text-xs text-rose-600">{{ errors.cuenta }}</span>
    </label>
    <button
      class="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 sm:col-span-2"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Guardando…' : 'Agregar' }}
    </button>
  </form>
</template>
