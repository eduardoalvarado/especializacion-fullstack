<script setup lang="ts">
import { reactive } from 'vue'
import { dinero } from '@/lib/formato'
import { avisar } from '@/lib/toasts'
import { reportar } from '@/lib/errores'
import { useBeneficiarios } from '@/queries/useBeneficiarios'
import { useCuentas } from '@/queries/useCuentas'
import { useTransferir } from '@/queries/useTransferir'
import { watch } from 'vue'
import { guardar, leer } from '@/storage'
import { conEsquema } from '@/lib/esquema'
import { useForm } from 'vee-validate'
import { transferenciaSchema } from '@/schemas/transferencia'
import { ApiError } from '@/api/http'

const cuentas = useCuentas()
const beneficiarios = useBeneficiarios()
const { mutateAsync: transferir, isLoading } = useTransferir()

const vacio = { cuentaOringenId: '', beneficiarioId: '', concepto: '' }

const { defineField, errors, handleSubmit, setErrors, resetField, values } = useForm({
  validationSchema: conEsquema(transferenciaSchema),
  initialValues: leer('borrador-transferencia', vacio, sessionStorage),
})

watch(values, (v) => guardar('borrador-transferencia', v, sessionStorage))

const [cuentaOrigenId] = defineField('cuentaOrigenId')
const [beneficiarioId] = defineField('beneficiarioId')
const [monto] = defineField('monto')
const [concepto] = defineField('concepto')

const enviar = handleSubmit(async (datos) => {
  try {
    const r = transferir({ ...datos, concepto: datos.concepto || undefined })
    avisar(`Transferencia enviada. Saldo: ${dinero((await r).saldo)}`)
    resetField('monto', { value: undefined })
    resetField('concepto', { value: '' })
  } catch (e) {
    if (e instanceof ApiError && e.fields) setErrors(e.fields)
    else reportar(e)
  }
})
</script>

<template>
  <form
    class="flex max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    @submit="enviar"
  >
    <label class="flex flex-col gap-1 text-sm">
      Cuenta de origen
      <select
        v-model="cuentaOrigenId"
        name="cuentaOrigenId"
        class="rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value="" disabled>Elige una cuenta</option>
        <option v-for="c in cuentas.data.value" :key="c.id" :value="c.id">
          {{ c.nombre }} · {{ dinero(c.saldo, c.moneda) }}
        </option>
      </select>
      <span v-if="errors.cuentaOrigenId" class="text-sm text-rose-600">
        {{ errors.cuentaOrigenId }}
      </span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Beneficiario
      <select
        v-model="beneficiarioId"
        name="beneficiarioId"
        class="rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value="" disabled>Elige un beneficiario</option>
        <option v-for="b in beneficiarios.data.value" :key="b.id" :value="b.id">
          {{ b.favorito ? '★ ' : '' }}{{ b.nombre }}
        </option>
      </select>
      <span v-if="errors.beneficiarioId" class="text-sm text-rose-600">
        {{ errors.beneficiarioId }}
      </span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Monto
      <input
        v-model.number="monto"
        name="monto"
        type="number"
        step="0.01"
        class="rounded-lg border border-slate-300 px-3 py-2"
        :class="errors.monto ? 'border-rose-400' : 'border-slate-300'"
      />
      <span v-if="errors.monto" class="text-sm text-rose-600">
        {{ errors.monto }}
      </span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Concepto (opcional)
      <input
        v-model="concepto"
        name="concepto"
        class="rounded-lg border border-slate-300 px-3 py-2"
        :class="errors.concepto ? 'border-rose-400' : 'border-slate-300'"
      />
      <span v-if="errors.concepto" class="text-sm text-rose-600">
        {{ errors.concepto }}
      </span>
    </label>
    <button
      class="rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Enviando…' : 'Transferir' }}
    </button>
  </form>
</template>
