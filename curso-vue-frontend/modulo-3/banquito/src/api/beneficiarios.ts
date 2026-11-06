import { http } from './http'
import type { Beneficiario } from '@/types'

export type ActualizarBeneficiario = Omit<Beneficiario, 'id' | 'creadoEn'>
export type NuevoBeneficiario = Omit<ActualizarBeneficiario, 'favorito'>

export const listarBeneficiarios = () =>
  http.get<Beneficiario[]>('/beneficiarios').then((response) => response.data)

export const crearBeneficiario = (datos: NuevoBeneficiario) =>
  http.post<Beneficiario>('/beneficiarios', datos).then((response) => response.data)

export const actualizarBeneficiario = (id: string, datos: ActualizarBeneficiario) =>
  http.put<Beneficiario>(`/beneficiarios/${id}`, datos).then((response) => response.data)

export const eliminarBeneficiario = (id: string) =>
  http.delete(`/beneficiarios/${id}`).then(() => undefined)
