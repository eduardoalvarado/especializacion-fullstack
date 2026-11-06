import { useQuery } from '@pinia/colada'
import { listarCuentas } from '@/api/cuentas'

export function useCuentas() {
  return useQuery({
    key: ['cuentas'],
    query: listarCuentas,
    staleTime: 30_000,
  })
}
