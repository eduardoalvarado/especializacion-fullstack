import { nextTick } from 'vue'
import { START_LOCATION, type Router } from 'vue-router'

/**
 * View Transitions en TODA navegación (también el botón «atrás»).
 *
 * El orden importa: el navegador toma la foto «vieja» cuando se llama a startViewTransition. Si el
 * router ya cambió la vista antes de ese momento, la foto vieja es igual a la nueva y no se ve nada.
 * Por eso la navegación espera en `beforeResolve` hasta que el navegador tomó la foto, y solo
 * entonces cambia la vista; la transición termina cuando Vue ya pintó la vista nueva.
 */
export function instalarTransiciones(router: Router) {
  let terminar: (() => void) | undefined

  router.beforeResolve((to, from) => {
    const sinAnimacion =
      from === START_LOCATION ||
      !('startViewTransition' in document) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    if (sinAnimacion) return

    return new Promise<void>((foto) => {
      document.startViewTransition(() => {
        foto() // ya hay foto vieja: la navegación puede cambiar la vista
        return new Promise<void>((resolver) => (terminar = resolver))
      })
    })
  })

  // Corre al final de cada navegación, también si falló o se canceló
  router.afterEach(() => {
    nextTick(() => {
      terminar?.()
      terminar = undefined
    })
  })
}
