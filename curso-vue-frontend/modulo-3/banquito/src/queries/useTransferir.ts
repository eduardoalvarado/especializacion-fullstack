import { useMutation, useQueryCache } from '@pinia/colada'
import { transferir } from '@/api/transferencias'
import { guardarComprobante } from '@/storage/comprobantes'
import type { NuevaTransferencia } from '@/types'

export function useTransferir() {
  const cache = useQueryCache()
  return useMutation({
    mutation: async (datos: NuevaTransferencia) => {
      const r = await transferir(datos)
      const { fecha, concepto, monto } = r.movimiento
      await guardarComprobante({ id: r.id, fecha, concepto, monto, saldo: r.saldo })
    },
    onSettled: () =>
      cache
        .invalidateQueries({ key: ['cuentas'] })
        .then(() => cache.invalidateQueries({ key: ['movimientos'] }))
        .then(() => cache.invalidateQueries({ key: ['comprobantes'] })),
  })
}
