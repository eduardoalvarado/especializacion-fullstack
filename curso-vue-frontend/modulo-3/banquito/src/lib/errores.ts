import { ApiError } from '@/api/http'
import { avisar } from './toasts'

function mensaje(e: unknown) {
  if (e instanceof ApiError) {
    if (e.code === 'NETWORK') return 'Sin conexion con el servidor. Revisa tu red.'
    if (e.status >= 500) return 'El servidor tuvo un problema. Ya lo registramos'
    return e.message //esto seria los errores esperados
  }
  return 'Algo salio mal en la aplicacion. Ya lo registramos'
}

export function reportar(e: unknown, donde = 'app') {
  avisar(mensaje(e), 'error')

  const esperado = e instanceof ApiError && e.status > 0 && e.status < 500
  if (esperado) return

  const evento = {
    mensaje: e instanceof Error ? e.message : String(e),
    codigo: e instanceof ApiError ? e.code : undefined,
    donde,
    ruta: location.pathname,
    cuando: new Date().toISOString(),
  }

  console.error('[reportar]', evento, e)

  navigator.sendBeacon(`${import.meta.env.VITE_API_URL}/telemetria`, JSON.stringify(evento))
}
