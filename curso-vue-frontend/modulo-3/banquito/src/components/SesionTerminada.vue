<script setup lang="ts">
import { useRoute } from 'vue-router'
import { iniciarLogin } from '@/auth/oidc'
import { finDeSesion, type Motivo } from '@/auth/sesion'
// Una sola pantalla para todas las formas en que una sesión termina sin pulsar «Salir»
const textos: Record<Motivo, string> = {
  expirada: 'Tu sesión expiró.',
  inactividad: 'Cerramos tu sesión por inactividad.',
  'otra-tab': 'Cerraste sesión en otra pestaña.',
}
const route = useRoute()
</script>

<template>
  <div
    v-if="finDeSesion"
    class="fixed inset-0 z-40 grid place-items-center bg-slate-900/60 p-4"
    role="alertdialog"
    aria-labelledby="fin-sesion"
  >
    <div class="flex max-w-sm flex-col gap-3 rounded-2xl bg-white p-6 text-center shadow-xl">
      <p id="fin-sesion" class="text-lg font-semibold" :data-motivo="finDeSesion">
        {{ textos[finDeSesion] }}
      </p>
      <p class="text-sm text-slate-500">Por seguridad, vuelve a iniciar sesión para continuar.</p>
      <button
        class="rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white hover:bg-teal-700"
        @click="iniciarLogin(route.fullPath)"
      >
        Iniciar sesión
      </button>
    </div>
  </div>
</template>
