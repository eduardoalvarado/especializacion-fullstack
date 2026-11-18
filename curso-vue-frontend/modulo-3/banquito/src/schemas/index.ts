// TODO(s3): esquemas de validación (Zod/Valibot) de los formularios
import { z } from 'zod'
import { BANCOS } from '@/types'

export const beneficiarioSchema = z.object({
  nombre: z.string().trim().min(2, 'Escribe al menos 2 letras').max(60, 'Maximo 60 caracteres'),
  alias: z.string().trim().max(40, 'Maximo 40 caracteres'),
  banco: z.enum(BANCOS, 'Elije un banco de la lista'),
  cuenta: z.string().regex(/^\d{20}$/, 'El CCI tiene 20 digitos, sin espacios'),
})

export type DatosBeneficiario = z.infer<typeof beneficiarioSchema>
