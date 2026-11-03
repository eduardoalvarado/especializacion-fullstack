import { reactive } from 'vue'
import type { Tarea, Proyecto } from '../types'


export const red = reactive({ falla: false})

const LATENCIA_MS = 800

const proyectos: Proyecto[] = [
    {id: 1, nombre: 'Sitio web'},
    {id: 2, nombre: 'App movil'},
    {id: 3, nombre: 'App Lanzamiento'}
]

const baseDeDatos: Tarea[] = [
  { id: 1, proyectoId: 1, titulo: 'Definir el alcance del proyecto', estado: 'hecha' },
  { id: 2, proyectoId: 1, titulo: 'Diseñar la pantalla principal', estado: 'en-curso' },
  { id: 3, proyectoId: 1, titulo: 'Crear el store de tareas', estado: 'pendiente' },
  { id: 4, proyectoId: 1, titulo: 'Probar la app en el móvil', estado: 'pendiente' },
]

let siguienteId = baseDeDatos.length + 1

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

async function conectar() {
    await esperar(LATENCIA_MS)
    if(red.falla) throw new Error('No se pudo conectar al servidor') 
}

export async function fetchProyectos(): Promise<Proyecto[]> {
    await conectar()
    return proyectos.map((p) => ({...p}))
}

export async function fetchTareas(): Promise<Tarea[]> {
    await conectar()
    return baseDeDatos.map((tarea) => ({...tarea}))
}

export async function crearTareas(titulo: string, proyectoId = 1): Promise<Tarea> {
    await conectar()
    const nueva:Tarea = { id: siguienteId++, proyectoId, titulo, estado: 'pendiente' }
    baseDeDatos.push(nueva)
    return {...nueva}
}