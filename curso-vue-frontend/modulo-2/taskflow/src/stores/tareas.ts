import { defineStore } from 'pinia'
import type { Tarea, Filtro, Estado } from '../types'
import { ref, computed } from 'vue'
import { db } from '../services/firebase'
import { useSesionStore } from './sesion'
import { addDoc, collection, deleteDoc, doc, query, updateDoc, where } from 'firebase/firestore'
import { useCollection } from 'vuefire'

const SIGUIENTE: Record<Estado, Estado> = {
  pendiente: 'en-curso',
  'en-curso': 'hecha',
  hecha: 'hecha',
}

export const useTareasStore = defineStore('tareas', () => {
  const sesion = useSesionStore()
  const filtro = ref<Filtro>('todas')

  //state
  const {
    data,
    pending: cargando,
    error,
  } = useCollection<Tarea>(() =>
    sesion.usuario ? query(collection(db, 'tareas'), where('uid', '==', sesion.usuario.id)) : null,
  )

  const tareas = computed(() => [...data.value].sort((a, b) => a.creada - b.creada))

  //getters
  const visibles = computed(() =>
    filtro.value === 'todas'
      ? tareas.value
      : tareas.value.filter((tarea) => tarea.estado === filtro.value),
  )

  const pendientes = computed(() => tareas.value.filter((tarea) => tarea.estado !== 'hecha').length)

  // actions
  const agregar = (titulo: string, proyectoId = 1) => addDoc(collection(db, 'tareas'), {
    titulo,
    proyectoId,
    estado: 'pendiente',
    uid: sesion.usuario?.id,
    creada: Date.now()
  })

  function avanzar(id: string) {
    const tarea = tareas.value.find((t) => t.id === id)
    if(tarea) updateDoc(doc(db, 'tareas', id), { estado: SIGUIENTE[tarea.estado]})
  }

  const eliminar = (id: string) => deleteDoc(doc(db, 'tareas', id)) 

  return {
    tareas,
    filtro,
    visibles,
    pendientes,
    agregar,
    avanzar,
    eliminar,
    cargando,
    error,
  }
})
