import { ref, watch, type WatchSource } from 'vue'

// Cada pantalla pide sus datos por su cuenta: la forma «ingenua» de cargar datos del servidor.
// `version` sube con cada mutación y todas las cargas se repiten (no hay caché ni deduplicación).
export const version = ref(0)

export function useCargar<T>(pedir: () => Promise<T>, fuente?: WatchSource) {
  const data = ref<T>()
  const error = ref<Error | null>(null)
  const isPending = ref(true)

  async function refetch() {
    isPending.value = true
    error.value = null
    try {
      data.value = (await pedir()) as T
    } catch (e) {
      error.value = e as Error
    } finally {
      isPending.value = false
    }
  }

  watch(fuente ? [version, fuente] : [version], refetch, { immediate: true })
  return { data, isPending, error, refetch }
}
