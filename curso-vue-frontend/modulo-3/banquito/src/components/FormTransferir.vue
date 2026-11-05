<script setup lang="ts">
import { reactive } from 'vue'
import { dinero } from '@/lib/formato'
import { avisar } from '@/lib/toasts'
import { reportar } from '@/lib/errores'
import { useBeneficiarios } from '@/queries/useBeneficiarios'
import { useCuentas } from '@/queries/useCuentas'
import { useTransferir } from '@/queries/useTransferir'

const cuentas = useCuentas()
const beneficiarios = useBeneficiarios()
const { mutateAsync: transferir, isLoading } = useTransferir()

// TODO(s3): este formulario se valida con un esquema (Zod/Valibot) y VeeValidate
const form = reactive({ cuentaOrigenId: '', beneficiarioId: '', monto: 0, concepto: '' })

async function enviar() {
  try {
    const r = await transferir({ ...form, concepto: form.concepto || undefined })
    avisar(`Transferencia enviada. Saldo: ${dinero(r.saldo)}`)
    Object.assign(form, { monto: 0, concepto: '' })
  } catch (e) {
    reportar(e)
  }
}
</script>

<template>
  <form
    class="flex max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    @submit.prevent="enviar"
  >
    <label class="flex flex-col gap-1 text-sm">
      Cuenta de origen
      <select
        v-model="form.cuentaOrigenId"
        name="cuentaOrigenId"
        class="rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value="" disabled>Elige una cuenta</option>
        <option v-for="c in cuentas.data.value" :key="c.id" :value="c.id">
          {{ c.nombre }} · {{ dinero(c.saldo, c.moneda) }}
        </option>
      </select>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Beneficiario
      <select
        v-model="form.beneficiarioId"
        name="beneficiarioId"
        class="rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value="" disabled>Elige un beneficiario</option>
        <option v-for="b in beneficiarios.data.value" :key="b.id" :value="b.id">
          {{ b.favorito ? '★ ' : '' }}{{ b.nombre }}
        </option>
      </select>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Monto
      <input
        v-model.number="form.monto"
        name="monto"
        type="number"
        step="0.01"
        class="rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Concepto (opcional)
      <input
        v-model="form.concepto"
        name="concepto"
        class="rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
    <button
      class="rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Enviando…' : 'Transferir' }}
    </button>
  </form>
</template>
