import { mock } from '@/mock/db'
import type { FiltroMovimientos } from '@/types'

export const listarMovimientos = (filtro: FiltroMovimientos) => mock.movimientos(filtro)
