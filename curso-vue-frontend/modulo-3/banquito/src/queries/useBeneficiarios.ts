import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { actualizarBeneficiario, listarBeneficiarios } from '@/api/beneficiarios'
import type { Beneficiario } from '@/types'
import { reportar } from '@/lib/errores'

const CLAVE = ['beneficiario']

export function useBeneficiarios() {
  return useQuery({ key: CLAVE, query: listarBeneficiarios })
}

export function useAlternarFavorito() {
  const cache = useQueryCache()

  return useMutation({
    onMutate(b: Beneficiario) {
      cache.cancelQueries({ key: CLAVE })
      const anterior = cache.getQueryData<Beneficiario[]>(CLAVE)
      cache.setQueryData<Beneficiario[]>(CLAVE, (lista = []) =>
        lista.map((dato) => (dato.id === b.id ? { ...dato, favorito: !dato.favorito } : dato)),
      )
      return { anterior }
    },
    mutation: ({ id, creadoEn, ...resto }: Beneficiario) =>
      actualizarBeneficiario(id, { ...resto, favorito: !resto.favorito }),
    onError(e, _b, { anterior }) {
      cache.setQueryData(CLAVE, anterior)
      reportar(e)
    },
    onSettled: () => cache.invalidateQueries({ key: CLAVE }),
  })
}
