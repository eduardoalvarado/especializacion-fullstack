export function leer<T>(clave: string, porDefecto: T): T {
    
    try {
        const datoStorage = localStorage.getItem(clave)
        return datoStorage ? (JSON.parse(datoStorage) as T) : porDefecto
    } catch {
        return porDefecto
    }
    
}

export function guardar(clave: string, valor: unknown) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
        // no va nada
    }
}

export function borrar (clave: string) {
    try {
        localStorage.removeItem(clave)
    } catch {
        // nada que hacer
    }
}