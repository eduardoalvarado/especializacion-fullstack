import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { PERFIL, USUARIO } from './datos.ts'
import { error } from './errores.ts'
import { aleatorio, firmar, sha256Base64Url } from './jwt.ts'
import { config } from './estado.ts'

// Servidor de identidad mínimo (OIDC con código + PKCE). Se activa con AUTH=on. Lo usan las sesiones 2 y 4.
export const CLIENTE = 'banquito-web'
const REDIRECCIONES = /^http:\/\/localhost:\d+\//

interface Codigo {
  desafio: string
  redirect: string
  nonce?: string
  expira: number
}
interface Refresh {
  familia: string
  usado: boolean
  expira: number
}

const codigos = new Map<string, Codigo>()
const refrescos = new Map<string, Refresh>()
const familiasRevocadas = new Set<string>()

export function reiniciarIdentidad() {
  codigos.clear()
  refrescos.clear()
  familiasRevocadas.clear()
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

function paginaLogin(params: Record<string, string>, aviso = '') {
  const ocultos = Object.entries(params)
    .map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`)
    .join('')
  return `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Banquito · Iniciar sesión</title>
<style>body{font:16px system-ui;background:#f4f6f8;display:grid;place-items:center;min-height:100vh;margin:0}
form{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 4px 24px #0001;width:min(92vw,340px);display:grid;gap:.8rem}
h1{margin:0;font-size:1.3rem}input,button{font:inherit;padding:.6rem;border-radius:8px;border:1px solid #bbb}
button{background:#0f766e;color:#fff;border:0;cursor:pointer}.e{color:#b91c1c;margin:0}small{color:#555}</style>
<form method="post"><h1>Banquito · Identidad</h1>${aviso ? `<p class="e">${esc(aviso)}</p>` : ''}
${ocultos}<input name="usuario" placeholder="Usuario" autocomplete="username" required>
<input name="clave" type="password" placeholder="Contraseña" autocomplete="current-password" required>
<button>Entrar</button><small>Demo: ana / banquito123</small></form></html>`
}

function emitirTokens(c: import('hono').Context, familia: string, nonce?: string) {
  const refresh = aleatorio(32)
  refrescos.set(refresh, { familia, usado: false, expira: Date.now() + config.ttlRefreshSeg * 1000 })
  const csrf = aleatorio(16)
  // El refresh token nunca es legible por JS (HttpOnly); el CSRF sí, para devolverlo en una cabecera.
  setCookie(c, 'refresh', refresh, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/oauth',
    maxAge: config.ttlRefreshSeg,
  })
  setCookie(c, 'csrf', csrf, { sameSite: 'Lax', path: '/', maxAge: config.ttlRefreshSeg })
  const base = { sub: PERFIL.id, aud: CLIENTE }
  return {
    token_type: 'Bearer',
    access_token: firmar({ ...base, scope: 'cuentas transferencias', usuario: PERFIL.usuario }, config.ttlAccesoSeg),
    id_token: firmar({ ...base, name: PERFIL.nombre, email: PERFIL.correo, ...(nonce ? { nonce } : {}) }, config.ttlAccesoSeg),
    expires_in: config.ttlAccesoSeg,
    csrf_token: csrf,
  }
}

export function rutasIdentidad() {
  const r = new Hono()

  r.get('/.well-known/openid-configuration', (c) =>
    c.json({
      issuer: 'http://localhost:4000',
      authorization_endpoint: 'http://localhost:4000/oauth/authorize',
      token_endpoint: 'http://localhost:4000/oauth/token',
      userinfo_endpoint: 'http://localhost:4000/oauth/userinfo',
      response_types_supported: ['code'],
      code_challenge_methods_supported: ['S256'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
    }),
  )

  const validarPeticion = (q: Record<string, string>) => {
    if (q.client_id !== CLIENTE) return 'client_id desconocido'
    if (!q.redirect_uri || !REDIRECCIONES.test(q.redirect_uri)) return 'redirect_uri no permitido'
    if (q.response_type !== 'code') return 'response_type debe ser code'
    if (q.code_challenge_method !== 'S256' || !q.code_challenge)
      return 'PKCE obligatorio: code_challenge con método S256'
    return null
  }
  const PARAMS = ['client_id', 'redirect_uri', 'response_type', 'code_challenge', 'code_challenge_method', 'state', 'nonce', 'scope']

  r.get('/oauth/authorize', (c) => {
    const q = c.req.query()
    const problema = validarPeticion(q)
    if (problema) return c.json({ error: 'invalid_request', error_description: problema }, 400)
    return c.html(paginaLogin(Object.fromEntries(PARAMS.filter((k) => q[k]).map((k) => [k, q[k]!]))))
  })

  r.post('/oauth/authorize', async (c) => {
    const f = Object.fromEntries(
      [...(await c.req.formData()).entries()].map(([k, v]) => [k, String(v)]),
    )
    const problema = validarPeticion(f)
    if (problema) return c.json({ error: 'invalid_request', error_description: problema }, 400)
    if (f.usuario !== USUARIO.usuario || f.clave !== USUARIO.clave) {
      const ocultos = Object.fromEntries(PARAMS.filter((k) => f[k]).map((k) => [k, f[k]!]))
      return c.html(paginaLogin(ocultos, 'Usuario o contraseña incorrectos'), 401)
    }
    const codigo = aleatorio(16)
    codigos.set(codigo, {
      desafio: f.code_challenge!,
      redirect: f.redirect_uri!,
      nonce: f.nonce,
      expira: Date.now() + 60_000,
    })
    const destino = new URL(f.redirect_uri!)
    destino.searchParams.set('code', codigo)
    if (f.state) destino.searchParams.set('state', f.state)
    return c.redirect(destino.toString(), 302)
  })

  r.post('/oauth/token', async (c) => {
    const f = Object.fromEntries(
      [...(await c.req.formData()).entries()].map(([k, v]) => [k, String(v)]),
    )
    const malo = (descripcion: string, status: 400 | 401 = 400) =>
      c.json({ error: status === 401 ? 'invalid_token' : 'invalid_grant', error_description: descripcion }, status)

    if (f.grant_type === 'authorization_code') {
      const guardado = codigos.get(f.code ?? '')
      codigos.delete(f.code ?? '') // un código sirve una sola vez
      if (!guardado || guardado.expira < Date.now()) return malo('código inválido o vencido')
      if (f.redirect_uri !== guardado.redirect) return malo('redirect_uri no coincide')
      if (!f.code_verifier || sha256Base64Url(f.code_verifier) !== guardado.desafio)
        return malo('code_verifier no corresponde al code_challenge')
      return c.json(emitirTokens(c, aleatorio(8), guardado.nonce))
    }

    if (f.grant_type === 'refresh_token') {
      // Autenticación por cookie => exige CSRF (doble envío: cookie + cabecera)
      const csrfCookie = getCookie(c, 'csrf')
      if (!csrfCookie || c.req.header('x-csrf-token') !== csrfCookie)
        return error(c, 403, 'CSRF', 'Falta o no coincide el token CSRF')
      const actual = getCookie(c, 'refresh')
      const guardado = actual ? refrescos.get(actual) : undefined
      if (!actual || !guardado || guardado.expira < Date.now()) return malo('refresh token inválido o vencido', 401)
      if (familiasRevocadas.has(guardado.familia)) return malo('sesión revocada', 401)
      if (guardado.usado) {
        // Reutilizar un refresh ya rotado delata un robo: se revoca toda la familia
        familiasRevocadas.add(guardado.familia)
        return malo('refresh token reutilizado: sesión revocada', 401)
      }
      guardado.usado = true
      return c.json(emitirTokens(c, guardado.familia))
    }
    return c.json({ error: 'unsupported_grant_type' }, 400)
  })

  r.post('/oauth/logout', (c) => {
    const csrfCookie = getCookie(c, 'csrf')
    if (!csrfCookie || c.req.header('x-csrf-token') !== csrfCookie)
      return error(c, 403, 'CSRF', 'Falta o no coincide el token CSRF')
    const actual = getCookie(c, 'refresh')
    const guardado = actual ? refrescos.get(actual) : undefined
    if (guardado) familiasRevocadas.add(guardado.familia)
    deleteCookie(c, 'refresh', { path: '/oauth' })
    deleteCookie(c, 'csrf', { path: '/' })
    return c.body(null, 204)
  })

  return r
}
