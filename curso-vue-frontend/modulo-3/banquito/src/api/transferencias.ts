import { http } from './http'
import type { NuevaTransferencia, Transferencia } from '@/types'

export const transferir = (datos: NuevaTransferencia) =>
  http
    .post<Transferencia>('/transferencias', datos, {
      headers: { 'Idempotency-Key': crypto.randomUUID() },
    })
    .then((response) => response.data)
