export type Moneda = 'PEN' | 'USD'

export interface Cuenta {
  id: string
  nombre: string
  numero: string
  moneda: Moneda
  saldo: number
}

export interface Movimiento {
  id: string
  cuentaId: string
  fecha: string
  concepto: string
  monto: number // negativo = egreso
  tipo: 'ingreso' | 'egreso'
  categoria: string
}

export interface Pagina<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface FiltroMovimientos {
  cuentaId: string
  q: string
  tipo: '' | 'ingreso' | 'egreso'
  page: number
  limit: number
}

export const BANCOS = ['Banco Andino', 'Banco del Sur', 'Banco Pacífico', 'Banco Central'] as const

export interface Beneficiario {
  id: string
  nombre: string
  alias: string
  banco: string
  cuenta: string // CCI de 20 dígitos
  favorito: boolean
  creadoEn: string
}

export interface Perfil {
  id: string
  usuario: string
  nombre: string
  correo: string
}

export interface NuevaTransferencia {
  cuentaOrigenId: string
  beneficiarioId: string
  monto: number
  concepto?: string
}

export interface Transferencia {
  id: string
  estado: 'completada'
  movimiento: Movimiento
  saldo: number
}
