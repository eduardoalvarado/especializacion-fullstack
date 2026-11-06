import { useMutation, useQueryCache } from '@pinia/colada'
import { transferir } from '@/api/transferencias'

export function useTransferir() {
  const cache = useQueryCache()
  return useMutation({
    mutation: transferir,
    onSettled: () =>
      cache
        .invalidateQueries({ key: ['cuentas'] })
        .then(() => cache.invalidateQueries({ key: ['movimientos'] })),
  })
}
