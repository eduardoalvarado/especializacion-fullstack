import { ref, watch, type Ref } from 'vue'

// Devuelve una copia de `origen` que solo cambia cuando el usuario deja de teclear
export function useDebounced<T>(origen: Ref<T>, ms = 300) {
  const valor = ref(origen.value) as Ref<T>
  let id: ReturnType<typeof setTimeout>
  watch(origen, (nuevo) => {
    clearTimeout(id)
    id = setTimeout(() => (valor.value = nuevo), ms)
  })
  return valor
}
