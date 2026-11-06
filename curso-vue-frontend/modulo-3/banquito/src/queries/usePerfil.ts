import { useQuery } from '@pinia/colada'
import { obtenerPerfil } from '@/api/perfil'

export function usePerfil() {
  return useQuery({ key: ['perfil'], query: obtenerPerfil, staleTime: 60_000 })
}
