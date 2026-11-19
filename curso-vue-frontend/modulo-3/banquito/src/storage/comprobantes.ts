import { clear, createStore, set, values } from 'idb-keyval'
import type { Comprobante } from '@/types'

const almacen = createStore('banquito', 'comprobantes')

export const guardarComprobante = (c: Comprobante) => set(c.id, c, almacen)
export const leerComprobantes = () => values<Comprobante>(almacen)
export const borrarComprobantes = () => clear(almacen)
