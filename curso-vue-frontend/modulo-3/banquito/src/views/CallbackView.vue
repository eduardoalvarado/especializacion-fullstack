<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { completarLogin } from '@/auth/oidc'

const router = useRouter()
const error = ref('')

onMounted(async () => {
  try {
    await router.replace(await completarLogin(new URLSearchParams(location.search)))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo iniciar sesión'
  }
})
</script>

<template>
  <p v-if="!error" class="text-sm text-slate-500">Completando el inicio de sesión…</p>
  <div v-else class="rounded-xl bg-red-50 p-4 text-sm text-red-700">
    {{ error }}. <RouterLink to="/" class="underline">Volver a intentar</RouterLink>
  </div>
</template>
