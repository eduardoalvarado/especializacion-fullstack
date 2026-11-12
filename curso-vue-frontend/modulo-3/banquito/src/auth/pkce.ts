import { base64Url } from '@/lib/base64url'

export const aleatorio = (bytes = 32) => base64Url(crypto.getRandomValues(new Uint8Array(bytes)))

export async function huella(verifier: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64Url(new Uint8Array(hash))
}
