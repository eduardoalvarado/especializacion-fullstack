import { listarCuentas } from '@/api/cuentas'
import { useCargar } from '@/lib/cargar'

export function useCuentas() {
  return useCargar(listarCuentas)
}
