import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Proyecto } from '../types'

const CATALOGO: Proyecto[] = [
    {id: 1, nombre: 'Sitio web'},
    {id: 2, nombre: 'App movil'},
    {id: 3, nombre: 'App Lanzamiento'}
]


export const useProyectosStore = defineStore('proyectos', () => {
    const proyectos = ref(CATALOGO)

    function porId(id: number) {
        return proyectos.value.find((p) => p.id === id)
    }

    return { proyectos, porId}
})