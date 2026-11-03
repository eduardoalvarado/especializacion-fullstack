import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario } from '../types'




export const useSesionStore = defineStore('sesion', () => {

  //state

  

  const usuario = computed<Usuario | null>(() =>
    actual.value
      ? {
          id: actual.value.uid,
          nombre: actual.value.displayName ?? actual.value.email ?? 'Tú',
          rol: 'admin',
        }
      : null,
  )

  //getters
  const autenticado = computed(() => usuario.value !== null)
  const esAdmin = computed(() => usuario.value?.rol === 'admin')

  //actions



  return { usuario, autenticado, esAdmin, entrar, salir, entrarConGoogle, registrar }
})
