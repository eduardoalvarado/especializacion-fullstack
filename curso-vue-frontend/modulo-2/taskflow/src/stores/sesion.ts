import { computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario, Rol } from '../types'

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth, useDocument } from 'vuefire'
import { doc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { PERMISOS, type Permiso } from '@/lib/permisos'

export type EstadoSesion = 'cargando' | 'anonimo' | 'autenticado'

export const useSesionStore = defineStore('sesion', () => {
  //state
  const auth = useFirebaseAuth()!
  const actual = useCurrentUser()

  const { data: perfil, error } = useDocument<{ rol: Rol }>(
    () => (actual.value ? doc(db, 'usuarios', actual.value.uid) : null),
    { reset: () => undefined },
  )

  const rol = computed<Rol>(() => {
    const actual = perfil.value?.rol
    return actual && actual in PERMISOS ? actual : 'lector'
  })

  const estado = computed<EstadoSesion>(() => {
    if (actual.value === undefined && !error.value) return 'cargando'
    return actual.value ? 'autenticado' : 'anonimo'
  })

  const usuario = computed<Usuario | null>(() =>
    actual.value && estado.value === 'autenticado'
      ? {
          id: actual.value.uid,
          nombre: actual.value.displayName ?? actual.value.email ?? 'Tú',
          rol: rol.value,
        }
      : null,
  )

  //getters
  const autenticado = computed(() => usuario.value !== null)

  const puede = (permiso: Permiso) => PERMISOS[rol.value]?.includes(permiso) ?? false

  const lista = () =>
    estado.value !== 'cargando'
      ? Promise.resolve()
      : new Promise<void>((ok) => watch(estado, () => ok(), { once: true }))

  //actions
  const registrar = (correo: string, clave: string) =>
    createUserWithEmailAndPassword(auth, correo, clave)

  const entrar = (correo: string, clave: string) => signInWithEmailAndPassword(auth, correo, clave)

  const entrarConGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())

  const salir = () => signOut(auth)

  return {
    usuario,
    autenticado,
    entrar,
    salir,
    entrarConGoogle,
    registrar,
    estado,
    lista,
    rol,
    puede,
  }
})
