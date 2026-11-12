import { semilla } from './datos.ts'
import type { Beneficiario, Cuenta, Movimiento } from './tipos.ts'

// Perillas para mostrar en clase carga, error y reintento (se cambian en /__admin/config)
export interface Config {
  latenciaMs: number // espera artificial en cada petición /api
  tasaFallo: number // 0..1: probabilidad de responder 500
  fallarProximas: number // las próximas N peticiones /api responden 500
  xss: boolean // añade un movimiento con HTML en el concepto (demo de la sesión 2)
  ttlAccesoSeg: number // vida del access token (sesión 4: ponerlo en 15 para ver la renovación)
  ttlRefreshSeg: number
}

export const CONFIG_INICIAL: Config = {
  latenciaMs: 0,
  tasaFallo: 0,
  fallarProximas: 0,
  xss: false,
  ttlAccesoSeg: 300,
  ttlRefreshSeg: 3600,
}

export const config: Config = { ...CONFIG_INICIAL }

export const db = {
  cuentas: [] as Cuenta[],
  movimientos: [] as Movimiento[],
  beneficiarios: [] as Beneficiario[],
  transferenciasHoy: 0,
  idempotencia: new Map<string, { estado: number; cuerpo: unknown }>(),
  contador: { beneficiario: 5, movimiento: 1000 },
  telemetria: [] as Record<string, unknown>[], // errores que reporta el cliente (sesión 3)
}

export const PAYLOAD_XSS = `Pago <img src=x onerror="document.title='XSS ejecutado'"> promo`

export function reiniciar() {
  const s = semilla()
  db.cuentas = s.cuentas
  db.movimientos = s.movimientos
  db.beneficiarios = s.beneficiarios
  db.transferenciasHoy = 0
  db.idempotencia.clear()
  db.telemetria = []
  db.contador = { beneficiario: 5, movimiento: 1000 }
  Object.assign(config, CONFIG_INICIAL)
}

export function sembrarXss() {
  if (db.movimientos.some((m) => m.id === 'c1-xss')) return
  db.movimientos.unshift({
    id: 'c1-xss',
    cuentaId: 'c1',
    fecha: new Date().toISOString(),
    concepto: PAYLOAD_XSS,
    monto: -9.9,
    tipo: 'egreso',
    categoria: 'Compras',
  })
}

reiniciar()
