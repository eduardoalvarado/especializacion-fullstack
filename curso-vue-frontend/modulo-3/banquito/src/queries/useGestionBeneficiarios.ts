import { crearBeneficiario, eliminarBeneficiario } from '@/api/beneficiarios'
import { useAccion } from '@/lib/accion'

export function useCrearBeneficiario() {
  return useAccion(crearBeneficiario)
}

export function useEliminarBeneficiario() {
  return useAccion((id: string) => eliminarBeneficiario(id))
}
