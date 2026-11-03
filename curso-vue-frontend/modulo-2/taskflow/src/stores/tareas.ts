import { defineStore } from 'pinia'
import type { Tarea, Filtro, Estado } from '../types'
import { ref, computed } from 'vue'



import { useSesionStore } from './sesion'

const SIGUIENTE: Record<Estado, Estado> = {
  pendiente: 'en-curso',
  'en-curso': 'hecha',
  hecha: 'hecha',
}

export const useTareasStore = defineStore('tareas', () => {
  const sesion = useSesionStore()
  const filtro = ref<Filtro>('todas')

  //state
  
  
  
  const tareas = computed(() => [...data.value].sort((a,b) => a.creada - b.creada))

  //getters
  const visibles = computed(() =>
    filtro.value === 'todas'
      ? tareas.value
      : tareas.value.filter((tarea) => tarea.estado === filtro.value),
  )

  const pendientes = computed(() => 
    tareas.value.filter((tarea) => tarea.estado !== 'hecha').length
  )

  // actions
  

  

  return {
    tareas,
    filtro,
    visibles,
    pendientes,
    agregar,
    avanzar,
    eliminar,
    cargando,
    error
  }
})
