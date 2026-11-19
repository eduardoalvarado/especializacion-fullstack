import { ref, watch } from 'vue'
import { reportar } from '@/lib/errores'

export function leer<T>(clave: string, inicial: T, area: Storage = localStorage): T {
  try {
    const texto = area.getItem(clave)
    return texto === null ? inicial : JSON.parse(texto)
  } catch (e) {
    return inicial
  }
}

export function guardar(clave: string, valor: unknown, area: Storage = localStorage) {
  try {
    area.setItem(clave, JSON.stringify(valor))
  } catch (e) {
    reportar(e, 'almacenamiento')
  }
}

export const ocultarSaldos = ref(leer('ocultar-saldos', false))

watch(ocultarSaldos, (v) => guardar('ocultar-saldos', v))
