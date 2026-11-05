import { avisar } from './toasts'

// Punto único para informar de un error al usuario y al equipo.
// TODO(s3): aquí se conectan el manejo global de errores y la observabilidad.
export function reportar(e: unknown) {
  console.error(e)
  avisar(e instanceof Error ? e.message : 'Ocurrió un error inesperado', 'error')
}
