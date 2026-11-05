import { listarMovimientos } from '@/api/movimientos'
import { useCargar } from '@/lib/cargar'
import type { FiltroMovimientos } from '@/types'

export function useMovimientos(filtro: () => FiltroMovimientos) {
  return useCargar(() => listarMovimientos(filtro()), filtro)
}
