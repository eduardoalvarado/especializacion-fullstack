import { useQuery } from '@pinia/colada'
import { listarMovimientos } from '@/api/movimientos'
import type { FiltroMovimientos } from '@/types'

export function useMovimientos(filtro: () => FiltroMovimientos) {
  return useQuery({
    key: () => ['movimientos', filtro()],
    query: () => listarMovimientos(filtro()),
    placeholderData: (anterior) => anterior,
  })
}
