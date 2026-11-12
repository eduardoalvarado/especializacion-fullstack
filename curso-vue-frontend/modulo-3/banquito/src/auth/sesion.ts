import axios from 'axios'
import { EMISOR, pedirTokens } from './servidor'
import { setToken } from './token'

// La cookie «csrf» sí es legible (a diferencia de la de refresh): se devuelve en una cabecera
const csrf = () => document.cookie.match(/(?:^|; )csrf=([^;]+)/)?.[1] ?? ''
const cabecera = () => ({ 'X-CSRF-Token': csrf() })

let renovando: Promise<void> | null = null

// El navegador adjunta solo la cookie de refresh. Una sola renovación a la vez: reusar un refresh viejo revoca la sesión
export function renovar() {
  renovando ??= pedirTokens({ grant_type: 'refresh_token' }, cabecera())
    .then((data) => setToken(data.access_token, data.id_token))
    .finally(() => (renovando = null))
  return renovando
}

export async function cerrarSesion() {
  await axios
    .post(`${EMISOR}/oauth/logout`, null, { withCredentials: true, headers: cabecera() })
    .catch(() => {})
  setToken(null)
}
