import { useMutation, useQueryCache } from '@pinia/colada'
import { crearBeneficiario, eliminarBeneficiario } from '@/api/beneficiarios'
import { reportar } from '@/lib/errores'
import type { Beneficiario } from '@/types'

const CLAVE = ['beneficiarios']

export function useCrearBeneficiario() {
  const cache = useQueryCache()
  return useMutation({
    mutation: crearBeneficiario,
    onSettled: () => cache.invalidateQueries({ key: CLAVE }),
  })
}

export function useEliminarBeneficiario() {
  const cache = useQueryCache()
  return useMutation({
    onMutate(id: string) {
      cache.cancelQueries({ key: CLAVE })
      const anterior = cache.getQueryData<Beneficiario[]>(CLAVE)
      cache.setQueryData<Beneficiario[]>(CLAVE, (lista = []) => lista.filter((x) => x.id !== id))
      return { anterior }
    },
    mutation: eliminarBeneficiario,
    onError(e, _id, { anterior }) {
      cache.setQueryData(CLAVE, anterior)
      reportar(e)
    },
    onSettled: () => cache.invalidateQueries({ key: CLAVE }),
  })
}
