<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSesionStore } from '../stores/sesion'
import { FirebaseError } from 'firebase/app'

const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()

// `redirect` viene de la guardia. Solo aceptamos rutas internas ("/algo"), nunca "//otro-sitio"
const redirect = route.query.redirect
const destino =
  typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/proyectos'

const correo = ref('')
const clave = ref('')
const creando = ref(false)
const error = ref<string | null>(null)

const MENSAJES: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/network-request-failed': 'No hay conexión con Firebase.',
}

async function intentar(accion: () => Promise<unknown>) {
  error.value = null

  try {
    await accion()
    router.push(destino)
  } catch (e) {
    error.value =
      e instanceof FirebaseError
        ? (MENSAJES[e.code] ?? `Error de Firebase (${e.code})`)
        : 'Error desconocido'
  }
}

const enviar = () => {
  intentar(() =>
    creando.value
      ? sesion.registrar(correo.value, clave.value)
      : sesion.entrar(correo.value, clave.value),
  )
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-sm flex-col gap-4 py-8">
    <h2 class="text-2xl font-bold">{{ creando ? 'Crear cuenta' : 'Entrar a TaskFlow' }}</h2>
    <p v-if="route.query.redirect" class="text-sm text-slate-500">
      Para ver <code>{{ route.query.redirect }}</code> primero inicia sesión.
    </p>
    <form @submit.prevent="enviar" class="flex flex-col gap-3">
      <input
        v-model="correo"
        type="email"
        required
        autocomplete="email"
        placeholder="correo@ejemplo.com"
        class="rounded border border-slate-300 bg-white px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
      />
      <input
        v-model="clave"
        type="password"
        required
        :autocomplete="creando ? 'new-password' : 'current-password'"
        placeholder="Contraseña"
        class="rounded border border-slate-300 bg-white px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
      />
      <button type="submit" class="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
        {{ creando ? 'Crear cuenta' : 'Entrar' }}
      </button>
    </form>
    <button
      type="button"
      class="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      @click="intentar(sesion.entrarConGoogle)"
    >
      Continuar con Google
    </button>

    <p
      v-if="error"
      class="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
      role="alert"
    >
      {{ error }}
    </p>

    <button
      type="button"
      class="text-sm text-sky-700 underline dark:text-sky-300"
      @click="creando = !creando"
    >
      {{ creando ? 'Ya tengo cuenta' : 'No tengo cuenta: crear una' }}
    </button>
  </section>
</template>
