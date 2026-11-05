import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// JWT HS256 mínimo, sin dependencias. Solo para clase: en producción firma el servidor de identidad.
const SECRETO = process.env.JWT_SECRET ?? 'secreto-de-clase-no-usar-en-produccion'

const b64 = (x: Buffer | string) => Buffer.from(x).toString('base64url')

export function firmar(carga: Record<string, unknown>, ttlSeg: number) {
  const ahora = Math.floor(Date.now() / 1000)
  const cuerpo = { iss: 'http://localhost:4000', ...carga, iat: ahora, exp: ahora + ttlSeg }
  const cabecera = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const datos = `${cabecera}.${b64(JSON.stringify(cuerpo))}`
  const firma = createHmac('sha256', SECRETO).update(datos).digest('base64url')
  return `${datos}.${firma}`
}

export type ResultadoJwt =
  | { ok: true; carga: Record<string, unknown> }
  | { ok: false; motivo: 'malformado' | 'firma' | 'expirado' }

export function verificar(token: string): ResultadoJwt {
  const partes = token.split('.')
  if (partes.length !== 3) return { ok: false, motivo: 'malformado' }
  const [cab, cuerpo, firma] = partes as [string, string, string]
  const esperada = createHmac('sha256', SECRETO).update(`${cab}.${cuerpo}`).digest()
  const recibida = Buffer.from(firma, 'base64url')
  if (recibida.length !== esperada.length || !timingSafeEqual(recibida, esperada))
    return { ok: false, motivo: 'firma' }
  try {
    const carga = JSON.parse(Buffer.from(cuerpo, 'base64url').toString()) as Record<string, unknown>
    if (typeof carga.exp === 'number' && carga.exp < Date.now() / 1000)
      return { ok: false, motivo: 'expirado' }
    return { ok: true, carga }
  } catch {
    return { ok: false, motivo: 'malformado' }
  }
}

export const aleatorio = (bytes = 24) => randomBytes(bytes).toString('base64url')
export const sha256Base64Url = (texto: string) =>
  createHash('sha256').update(texto).digest('base64url')
