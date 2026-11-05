import type { NuevaTransferencia, Transferencia } from '@/types'

export async function transferir(datos: NuevaTransferencia): Promise<Transferencia> {
  await new Promise((r) => setTimeout(r, 450))
  return {
    id: 't1',
    estado: 'completada',
    saldo: 0,
    movimiento: {
      id: 'tmp',
      cuentaId: datos.cuentaOrigenId,
      fecha: new Date().toISOString(),
      concepto: datos.concepto || 'Transferencia',
      monto: -datos.monto,
      tipo: 'egreso',
      categoria: 'Transferencias',
    },
  }
}
