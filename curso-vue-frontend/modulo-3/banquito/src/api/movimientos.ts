import { http } from './http'
import type { FiltroMovimientos, Movimiento, Pagina } from '@/types'

export const listarMovimientos = (filtro: FiltroMovimientos) =>
  http.get<Pagina<Movimiento>>('/movimientos', { params: filtro }).then((response) => response.data)
