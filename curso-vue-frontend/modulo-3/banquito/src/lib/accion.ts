import { ref } from 'vue'
import { version } from './cargar'
import { reportar } from './errores'

// La forma «ingenua» de modificar datos: llama al servidor y manda recargar todo
export function useAccion<V, R>(ejecutar: (valor: V) => Promise<R>) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function mutateAsync(valor: V) {
    isLoading.value = true
    error.value = null
    try {
      const resultado = await ejecutar(valor)
      version.value++
      return resultado
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function mutate(valor: V) {
    mutateAsync(valor).catch(reportar)
  }

  return { mutate, mutateAsync, isLoading, error }
}
