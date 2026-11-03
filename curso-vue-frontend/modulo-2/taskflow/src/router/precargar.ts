import type { RouteLocationRaw } from "vue-router";
import {router} from '.'



export function precargar(to: RouteLocationRaw) {
    for(const registro of router.resolve(to).matched) {
        const cargador = registro.components?.default
        if(typeof cargador === 'function') (cargador as () => Promise<unknown>)()
    }
}

export function enReposo(tarea: () => void) {
    if('requestIdleCallback' in window) requestIdleCallback(tarea)
    else setTimeout(tarea, 1500)
}