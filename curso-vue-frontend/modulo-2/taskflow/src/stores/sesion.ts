import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario } from '../types'
import { borrar, guardar, leer } from '@/lib/almacenamiento'

const CLAVE = 'taskflow:sesion'

export const USUARIOS_DEMO: Usuario[] = [
  { id: 1, nombre: 'Ana', rol: 'admin' },
  { id: 2, nombre: 'Luis', rol: 'miembro' },
]

export const useSesionStore = defineStore('sesion', () => {

  const usuario = ref<Usuario | null>(leer<Usuario | null >(CLAVE, null))

  const autenticado = computed(() => usuario.value !== null)

  const esAdmin = computed(() => usuario.value?.rol === 'admin')

  watch(usuario, (valor) => (valor ? guardar(CLAVE, valor) : borrar(CLAVE)))

  function entrar(id: number) {
    usuario.value = USUARIOS_DEMO.find((u) => u.id === id) ?? null
  }

  function salir() {
    usuario.value = null
  }


  return { usuario, autenticado, esAdmin, entrar, salir }
})