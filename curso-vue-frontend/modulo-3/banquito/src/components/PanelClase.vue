<script setup lang="ts">
import { ref } from 'vue'

// Ayuda del instructor (solo desarrollo): cambia las perillas de la API local para provocar
// lentitud y errores. Es independiente de la app: usa su propio fetch.
const abierto = ref(false)
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
const visible = import.meta.env.DEV

async function perilla(cuerpo: object) {
  await fetch(`${BASE}/__admin/config`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(cuerpo),
  }).catch(() => {})
}
async function reiniciar() {
  await fetch(`${BASE}/__admin/reset`, { method: 'POST' }).catch(() => {})
  location.reload()
}
async function conHtml() {
  await perilla({ xss: true })
  location.reload()
}
</script>

<template>
  <div v-if="visible" class="fixed bottom-4 left-4 z-40 text-xs">
    <button
      class="rounded-full bg-slate-800 px-3 py-1.5 text-white shadow"
      @click="abierto = !abierto"
    >
      Panel de clase
    </button>
    <div
      v-if="abierto"
      class="mt-2 flex w-56 flex-col gap-1.5 rounded-xl bg-white p-3 shadow-lg ring-1 ring-slate-200"
    >
      <button
        class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200"
        @click="perilla({ latenciaMs: 1500 })"
      >
        Red lenta (1,5 s)
      </button>
      <button
        class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200"
        @click="perilla({ latenciaMs: 0 })"
      >
        Red normal
      </button>
      <button
        class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200"
        @click="perilla({ fallarProximas: 1 })"
      >
        Fallar la próxima petición
      </button>
      <button
        class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200"
        @click="reiniciar"
      >
        Reiniciar datos
      </button>
      <button
        class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200"
        @click="perilla({ ttlAccesoSeg: 10 })"
      >
        Token de acceso de 10s
      </button>
      <button
        class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200"
        @click="perilla({ ttlAccesoSeg: 300 })"
      >
        Token de acceso de 5 min
      </button>
      <button class="rounded bg-slate-100 px-2 py-1 text-left hover:bg-slate-200" @click="conHtml">
        Añadir movimiento con HTML
      </button>
    </div>
  </div>
</template>
