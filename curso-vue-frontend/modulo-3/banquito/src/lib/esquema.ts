import type { TypedSchema } from 'vee-validate'
import type { StandardSchemaV1 } from '@standard-schema/spec'

export function conEsquema<S extends StandardSchemaV1>(
  esquema: S,
): TypedSchema<StandardSchemaV1.InferInput<S>, StandardSchemaV1.InferOutput<S>> {
  return {
    __type: 'VVTypedSchema',
    async parse(valores) {
      const r = await esquema['~standard'].validate(valores)
      if (!r.issues) return { value: r.value, errors: [] }
      // Agrupa los problemas por campo: { path: 'cuenta', errors: ['El CCI tiene 20 dígitos'] }
      const porCampo = new Map<string, string[]>()
      for (const problema of r.issues) {
        const ruta = (problema.path ?? []).map((p) => (typeof p === 'object' ? p.key : p)).join('.')
        porCampo.set(ruta, [...(porCampo.get(ruta) ?? []), problema.message])
      }
      return { errors: [...porCampo].map(([path, errors]) => ({ path, errors })) }
    },
  }
}
