import type { Beneficiario, Cuenta, Movimiento, Perfil } from './tipos.ts'

// Todo es determinista: mismas cuentas, mismos movimientos y mismas fechas en cada arranque.
const HOY = Date.UTC(2026, 10, 1, 12, 0, 0)
const DIA = 86_400_000

function prng(semilla: number) {
  let a = semilla
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const EGRESOS: [string, string][] = [
  ['Supermercado Plaza', 'Compras'],
  ['Netflix', 'Suscripciones'],
  ['Taxi a la oficina', 'Transporte'],
  ['Farmacia Salud', 'Salud'],
  ['Recibo de luz', 'Servicios'],
  ['Recibo de agua', 'Servicios'],
  ['Cena con amigos', 'Salidas'],
  ['Gimnasio', 'Salud'],
  ['Recarga de celular', 'Servicios'],
  ['Librería Central', 'Compras'],
]
const INGRESOS: [string, string][] = [
  ['Abono de sueldo', 'Ingresos'],
  ['Transferencia recibida', 'Ingresos'],
  ['Devolución de compra', 'Ingresos'],
]

function generarMovimientos(cuentaId: string, cantidad: number, semilla: number, escala: number) {
  const azar = prng(semilla)
  const lista: Movimiento[] = []
  for (let i = 0; i < cantidad; i++) {
    const esIngreso = i % 9 === 0
    const [concepto, categoria] = esIngreso
      ? INGRESOS[Math.floor(azar() * INGRESOS.length)]!
      : EGRESOS[Math.floor(azar() * EGRESOS.length)]!
    const base = esIngreso ? 800 + azar() * 1800 : 8 + azar() * 190
    const monto = Math.round(base * escala * 100) / 100
    lista.push({
      id: `${cuentaId}-m${String(i + 1).padStart(3, '0')}`,
      cuentaId,
      fecha: new Date(HOY - i * 1.7 * DIA).toISOString(),
      concepto,
      monto: esIngreso ? monto : -monto,
      tipo: esIngreso ? 'ingreso' : 'egreso',
      categoria,
    })
  }
  return lista
}

export function semilla() {
  const cuentas: Cuenta[] = [
    { id: 'c1', nombre: 'Cuenta de ahorros', numero: '191-2345678-0-12', moneda: 'PEN', saldo: 4820.5 },
    { id: 'c2', nombre: 'Cuenta corriente', numero: '191-8765432-0-34', moneda: 'PEN', saldo: 1250 },
    { id: 'c3', nombre: 'Ahorro en dólares', numero: '191-5550001-1-56', moneda: 'USD', saldo: 600 },
  ]
  const movimientos: Movimiento[] = [
    ...generarMovimientos('c1', 48, 11, 1),
    ...generarMovimientos('c2', 30, 22, 0.8),
    ...generarMovimientos('c3', 20, 33, 0.3),
  ]
  const beneficiarios: Beneficiario[] = [
    ['b1', 'Lucía Fernández', 'Lucía', 'Banco Andino', '00219100123456789012', true],
    ['b2', 'Carlos Medina', 'Carlos (alquiler)', 'Banco del Sur', '00319100987654321098', false],
    ['b3', 'Marta Rojas', 'Mamá', 'Banco Andino', '00219100555566667777', true],
    ['b4', 'Inmobiliaria Tres Cruces', 'Alquiler oficina', 'Banco Pacífico', '00519100111122223333', false],
    ['b5', 'Diego Paredes', 'Diego', 'Banco del Sur', '00319100444455556666', false],
  ].map(([id, nombre, alias, banco, cuenta, favorito], i) => ({
    id: id as string,
    nombre: nombre as string,
    alias: alias as string,
    banco: banco as string,
    cuenta: cuenta as string,
    favorito: favorito as boolean,
    creadoEn: new Date(HOY - (30 - i) * DIA).toISOString(),
  }))
  return { cuentas, movimientos, beneficiarios }
}

export const BANCOS = ['Banco Andino', 'Banco del Sur', 'Banco Pacífico', 'Banco Central']

// Usuario único de demostración (sin base de datos de usuarios: es una API de clase)
export const USUARIO = { usuario: 'ana', clave: 'banquito123' }
export const PERFIL: Perfil = {
  id: 'u1',
  usuario: 'ana',
  nombre: 'Ana Quispe',
  correo: 'ana.quispe@example.com',
}
export const LIMITE_DIARIO = 3000
export const FECHA_BASE = HOY
