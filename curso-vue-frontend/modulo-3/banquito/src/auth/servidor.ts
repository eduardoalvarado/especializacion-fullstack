import axios from 'axios'

export const EMISOR = import.meta.env.VITE_API_URL // el servidor de identidad
export const CLIENTE = 'banquito-web'
export const REDIRECCION = `${location.origin}/callback`

// POST al servidor de identidad. withCredentials: el navegador guarda y envía la cookie de refresh
export const pedirTokens = (cuerpo: Record<string, string>, headers = {}) =>
  axios
    .post(`${EMISOR}/oauth/token`, new URLSearchParams(cuerpo), { withCredentials: true, headers })
    .then((r) => r.data)
