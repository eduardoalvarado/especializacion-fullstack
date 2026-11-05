import { obtenerPerfil } from '@/api/perfil'
import { useCargar } from '@/lib/cargar'

export function usePerfil() {
  return useCargar(obtenerPerfil)
}
