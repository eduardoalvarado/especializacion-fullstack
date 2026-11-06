import { http } from './http'
import type { Cuenta } from '@/types'

export const listarCuentas = () => http.get<Cuenta[]>('/cuentas').then((response) => response.data)
