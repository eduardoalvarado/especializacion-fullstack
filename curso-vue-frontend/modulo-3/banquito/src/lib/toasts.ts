import { reactive } from 'vue'

export interface Toast {
  id: number
  texto: string
  tipo: 'ok' | 'error'
}

export const toasts = reactive<Toast[]>([])
let siguiente = 1

export function avisar(texto: string, tipo: Toast['tipo'] = 'ok') {
  const id = siguiente++
  toasts.push({ id, texto, tipo })
  setTimeout(() => {
    const i = toasts.findIndex((t) => t.id === id)
    if (i >= 0) toasts.splice(i, 1)
  }, 4000)
}
