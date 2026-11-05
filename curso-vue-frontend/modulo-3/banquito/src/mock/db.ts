import type { Beneficiario, Cuenta, FiltroMovimientos, Movimiento, Pagina, Perfil } from '@/types'

// Servidor simulado en memoria
const esperar = (ms = 450) => new Promise((r) => setTimeout(r, ms))

const cuentas: Cuenta[] = [
  {
    id: 'c1',
    nombre: 'Cuenta de ahorros',
    numero: '191-2345678-0-12',
    moneda: 'PEN',
    saldo: 4820.5,
  },
  { id: 'c2', nombre: 'Cuenta corriente', numero: '191-8765432-0-34', moneda: 'PEN', saldo: 1250 },
  { id: 'c3', nombre: 'Ahorro en dólares', numero: '191-5550001-1-56', moneda: 'USD', saldo: 600 },
]
const conceptos = [
  'Supermercado Plaza',
  'Netflix',
  'Taxi a la oficina',
  'Farmacia Salud',
  'Recibo de luz',
  'Abono de sueldo',
]
const movimientos: Movimiento[] = Array.from({ length: 24 }, (_, i) => ({
  id: `c1-m${i}`,
  cuentaId: i % 5 === 4 ? 'c2' : 'c1',
  fecha: new Date(Date.UTC(2026, 10, 1) - i * 2 * 86_400_000).toISOString(),
  concepto: conceptos[i % conceptos.length]!,
  monto: i % 6 === 5 ? 1800 : -(20 + i * 7.5),
  tipo: i % 6 === 5 ? 'ingreso' : 'egreso',
  categoria: 'Varios',
}))
let beneficiarios: Beneficiario[] = [
  ['b1', 'Lucía Fernández', 'Lucía', 'Banco Andino', '00219100123456789012', true],
  ['b2', 'Carlos Medina', 'Carlos (alquiler)', 'Banco del Sur', '00319100987654321098', false],
  ['b3', 'Marta Rojas', 'Mamá', 'Banco Andino', '00219100555566667777', true],
].map(([id, nombre, alias, banco, cuenta, favorito]) => ({
  id,
  nombre,
  alias,
  banco,
  cuenta,
  favorito,
  creadoEn: '2026-10-05T12:00:00.000Z',
})) as Beneficiario[]
let siguiente = 4

export const mock = {
  async cuentas() {
    await esperar()
    return structuredClone(cuentas)
  },
  async movimientos(f: FiltroMovimientos): Promise<Pagina<Movimiento>> {
    await esperar()
    const lista = movimientos
      .filter((m) => !f.cuentaId || m.cuentaId === f.cuentaId)
      .filter((m) => !f.tipo || m.tipo === f.tipo)
      .filter((m) => m.concepto.toLowerCase().includes(f.q.toLowerCase()))
    return {
      items: lista.slice((f.page - 1) * f.limit, f.page * f.limit),
      total: lista.length,
      page: f.page,
      limit: f.limit,
    }
  },
  async beneficiarios() {
    await esperar()
    return structuredClone(beneficiarios)
  },
  async crearBeneficiario(d: Pick<Beneficiario, 'nombre' | 'alias' | 'banco' | 'cuenta'>) {
    await esperar()
    const nuevo = {
      ...d,
      id: `b${siguiente++}`,
      favorito: false,
      creadoEn: new Date().toISOString(),
    }
    beneficiarios.push(nuevo)
    return nuevo
  },
  async actualizarBeneficiario(id: string, d: Omit<Beneficiario, 'id' | 'creadoEn'>) {
    await esperar()
    const b = beneficiarios.find((x) => x.id === id)!
    Object.assign(b, d)
    return { ...b }
  },
  async eliminarBeneficiario(id: string) {
    await esperar()
    beneficiarios = beneficiarios.filter((b) => b.id !== id)
  },
  async perfil(): Promise<Perfil> {
    await esperar()
    return { id: 'u1', usuario: 'Luis', nombre: 'Luis Quispe', correo: 'luis.quispe@example.com' }
  },
}
