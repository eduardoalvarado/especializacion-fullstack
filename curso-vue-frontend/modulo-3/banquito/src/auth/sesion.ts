import axios from 'axios'
import { ref } from 'vue'
import { EMISOR, pedirTokens } from './servidor'
import { setToken } from './token'

// La cookie «csrf» sí es legible (a diferencia de la de refresh): se devuelve en una cabecera
const csrf = () => document.cookie.match(/(?:^|; )csrf=([^;]+)/)?.[1] ?? ''
const cabecera = () => ({ 'X-CSRF-Token': csrf() })

export type Motivo = 'expirada' | 'inactividad' | 'otra-tab'
export const finDeSesion = ref<Motivo | null>(null)

let renovando: Promise<void> | null = null
let temporizador: ReturnType<typeof setTimeout> | undefined

export function guardarTokens(data: {
  access_token: string
  id_token: string
  expires_in: number
}) {
  setToken(data.access_token, data.id_token)
  finDeSesion.value = null
  clearTimeout(temporizador)

  temporizador = setTimeout(() => {
    renovar().catch(() => terminarSesion('expirada'))
  }, data.expires_in * 800)
}

// El navegador adjunta solo la cookie de refresh. Una sola renovación a la vez: reusar un refresh viejo revoca la sesión
export function renovar() {
  renovando ??= pedirTokens({ grant_type: 'refresh_token' }, cabecera())
    .then((data) => setToken(data.access_token, data.id_token))
    .finally(() => (renovando = null))
  return renovando
}

export function terminarSesion(motivo: Motivo) {
  clearTimeout(temporizador)
  setToken(null)
  finDeSesion.value = motivo
}

export async function cerrarSesion() {
  await axios
    .post(`${EMISOR}/oauth/logout`, null, { withCredentials: true, headers: cabecera() })
    .catch(() => {})
  setToken(null)
}
