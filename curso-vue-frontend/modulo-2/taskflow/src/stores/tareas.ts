import { defineStore } from 'pinia'
import type { Tarea, Filtro } from '../types'
import { ref, computed } from 'vue'
import { crearTareas, fetchTareas } from '@/services/tareasApi'

export const useTareasStore = defineStore('tareas', () => {
  
    //state
  const tareas = ref<Tarea[]>([])
  const filtro = ref<Filtro>('todas')
  const cargando = ref(false)
  const error = ref<string | null>(null)

  //getters
  const visibles = computed(() => 
    filtro.value === 'todas'
      ? tareas.value
      : tareas.value.filter((tarea) => tarea.estado === filtro.value)
)
   
  const pendientes = computed(()=> {
    tareas.value.filter((tarea) => tarea.estado !== 'hecha').length
  })

  // actions
  async function agregar (titulo: string, proyectId = 1) {
    try {
      tareas.value.push(await crearTareas(titulo, proyectId))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido'
    }
  }

  function avanzar(id: number) {
    const tarea = tareas.value.find((tarea) => tarea.id === id)
    if (tarea) tarea.estado = 'en-curso'
  }

  function eliminar (id: number) {
    tareas.value = tareas.value.filter((tarea) => tarea.id !== id)
  }

  async function cargar() {
    cargando.value = true
    error.value = null

    try {
      tareas.value = await fetchTareas()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido'
    } finally {
      cargando.value = false
    }

  }


  return { tareas, filtro, visibles, pendientes, agregar, avanzar, eliminar, cargando, error, cargar}

})
