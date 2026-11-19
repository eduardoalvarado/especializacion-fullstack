import { z } from 'zod'

export const transferenciaSchema = z.object({
  cuentaOrigenId: z.string().min(1, 'Elige una cuenta de origen'),
  beneficiarioId: z.string().min(1, 'Elige un beneficiario'),
  monto: z
    .number({ error: 'Escribe un monto' })
    .positive('El monto debe ser mayor que 0')
    .multipleOf(0.01, 'Máximo 2 decimales')
    .max(3000, 'Superas el límite diario de S/ 3000'),
  concepto: z.string().max(80, 'Máximo 80 caracteres').optional(),
})

export type DatosTransferencia = z.infer<typeof transferenciaSchema>
