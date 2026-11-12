import { ref } from 'vue'

// El token de acceso vive SOLO en esta variable: no está en localStorage ni en ninguna cookie
// que el código de la página pueda leer. Al recargar la página se pierde (la sesión 2, bloque 2, lo recupera).
let token: string | null = null

export const usuario = ref<{ nombre: string; correo: string } | null>(null)

export const getToken = () => token
export const haySesion = () => token !== null

// Un JWT es «cabecera.datos.firma» en Base64: cualquiera puede leer los datos (no van cifrados)
export function leerJwt(jwt: string): Record<string, string> {
  const datos = jwt.split('.')[1] ?? ''
  const json = atob(datos.replace(/-/g, '+').replace(/_/g, '/'))
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(json, (c) => c.charCodeAt(0))))
}

export function setToken(acceso: string | null, idToken?: string) {
  token = acceso
  if (!acceso) usuario.value = null
  else if (idToken) {
    const { name, email } = leerJwt(idToken)
    usuario.value = { nombre: name ?? '', correo: email ?? '' }
  }
}
