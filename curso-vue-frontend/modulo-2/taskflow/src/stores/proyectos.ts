import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProyectos } from '../services/tareasApi'
import type { Proyecto } from '../types'


export const useProyectosStore = defineStore('proyectos', () => {
    const proyectos = ref<Proyecto[]>([])
    const cargando = ref(false)

    async function cargar() {
        cargando.value = true
        try {
            proyectos.value = await fetchProyectos()
        } finally {
            cargando.value = false
        }
    }

    function porId(id: number) {
        return proyectos.value.find((p) => p.id === id)
    }

    return { proyectos, porId, cargar, cargando}
})