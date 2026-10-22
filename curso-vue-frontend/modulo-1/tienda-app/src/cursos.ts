export interface Curso {
    id: number
    titulo: string
    precio: number
    categoria: 'frontend' | 'backend' | 'datos'
}
  
export const CURSOS: Curso[] = [
    { id: 1, titulo: 'Vue desde cero', precio: 120, categoria: 'frontend' },
    { id: 2, titulo: 'TypeScript práctico', precio: 90, categoria: 'frontend' },
    { id: 3, titulo: 'Node y Express', precio: 110, categoria: 'backend' },
    { id: 4, titulo: 'Bases de datos SQL', precio: 100, categoria: 'datos' },
    { id: 5, titulo: 'APIs con NestJS', precio: 150, categoria: 'backend' },
    { id: 6, titulo: 'Python para datos', precio: 130, categoria: 'datos' },
]