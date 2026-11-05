import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

// Forma única de error: { code, message, fields? }. El cliente (sesión 1 y 3) se apoya en ella.
export interface CuerpoError {
  code: string
  message: string
  fields?: Record<string, string>
}

export function error(
  c: Context,
  status: ContentfulStatusCode,
  code: string,
  message: string,
  fields?: Record<string, string>,
) {
  const cuerpo: CuerpoError = fields ? { code, message, fields } : { code, message }
  return c.json(cuerpo, status)
}
