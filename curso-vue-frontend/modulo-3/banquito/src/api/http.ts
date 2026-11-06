import axios, { type AxiosError } from 'axios'
import { getToken } from '@/auth/token'

export class ApiError extends Error {
  status: number
  code: string
  fields?: Record<string, string>

  constructor(message: string, status: number, code = 'UNKNOWN', fields?: Record<string, string>) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 8000,
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (respuesta) => respuesta,
  (e: AxiosError<{ code?: string; message?: string; fields?: Record<string, string> }>) => {
    if (!e.response) throw new ApiError('No hay conexion con el servidor', 0, 'NETWORK')

    const { status, data } = e.response

    throw new ApiError(data?.message ?? 'Error del servidor', status, data?.code, data?.fields)
  },
)
