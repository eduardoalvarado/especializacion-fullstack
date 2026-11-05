import { actualizarBeneficiario, listarBeneficiarios } from '@/api/beneficiarios'
import { useAccion } from '@/lib/accion'
import { useCargar } from '@/lib/cargar'
import type { Beneficiario } from '@/types'

export function useBeneficiarios() {
  return useCargar(listarBeneficiarios)
}

export function useAlternarFavorito() {
  return useAccion(({ id, creadoEn, ...resto }: Beneficiario) =>
    actualizarBeneficiario(id, { ...resto, favorito: !resto.favorito }),
  )
}
