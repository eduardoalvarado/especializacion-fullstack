import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { beforeEach, describe, it } from 'node:test'
import { crearApp } from '../src/app.ts'
import { reiniciar } from '../src/estado.ts'
import { reiniciarIdentidad } from '../src/identidad.ts'

const json = (cuerpo: unknown) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(cuerpo),
})

describe('núcleo (AUTH=off)', () => {
  const app = crearApp({ auth: false })
  beforeEach(() => reiniciar())

  it('lista cuentas y pagina movimientos', async () => {
    const cuentas = await (await app.request('/api/cuentas')).json()
    assert.equal(cuentas.length, 3)
    const r = await app.request('/api/movimientos?cuentaId=c1&limit=5&page=2')
    const cuerpo = await r.json()
    assert.equal(cuerpo.items.length, 5)
    assert.equal(cuerpo.page, 2)
    assert.equal(r.headers.get('x-total-count'), '48')
  })

  it('CRUD de beneficiarios con códigos correctos', async () => {
    const nuevo = { nombre: 'Rosa Vega', alias: 'Rosa', banco: 'Banco Andino', cuenta: '00219100000000000001' }
    const creado = await app.request('/api/beneficiarios', json(nuevo))
    assert.equal(creado.status, 201)
    const b = await creado.json()
    assert.equal(b.favorito, false)
    const put = await app.request(`/api/beneficiarios/${b.id}`, { ...json({ ...nuevo, favorito: true }), method: 'PUT' })
    assert.equal((await put.json()).favorito, true)
    assert.equal((await app.request(`/api/beneficiarios/${b.id}`, { method: 'DELETE' })).status, 204)
    assert.equal((await app.request(`/api/beneficiarios/${b.id}`)).status, 404)
  })

  it('valida con 422 + campos y detecta duplicados con 409', async () => {
    const mal = await app.request('/api/beneficiarios', json({ nombre: 'X', cuenta: '123', banco: 'Nadie' }))
    assert.equal(mal.status, 422)
    const e = await mal.json()
    assert.equal(e.code, 'VALIDATION')
    assert.deepEqual(Object.keys(e.fields).sort(), ['banco', 'cuenta', 'nombre'])
    const dup = await app.request('/api/beneficiarios', json({ nombre: 'Otra', banco: 'Banco Andino', cuenta: '00219100123456789012' }))
    assert.equal(dup.status, 409)
  })

  it('transferencia: saldo, límite e idempotencia', async () => {
    const base = { cuentaOrigenId: 'c1', beneficiarioId: 'b1', monto: 100 }
    const headers = { 'content-type': 'application/json', 'idempotency-key': 'k1' }
    const a = await app.request('/api/transferencias', { method: 'POST', headers, body: JSON.stringify(base) })
    assert.equal(a.status, 201)
    const b = await app.request('/api/transferencias', { method: 'POST', headers, body: JSON.stringify(base) })
    assert.equal(b.headers.get('idempotent-replayed'), 'true')
    assert.equal((await app.request('/api/cuentas/c1').then((r) => r.json())).saldo, 4720.5) // una sola vez
    const sinSaldo = await app.request('/api/transferencias', json({ ...base, monto: 99999 }))
    assert.equal((await sinSaldo.json()).code, 'INSUFFICIENT_FUNDS')
    await app.request('/api/transferencias', json({ ...base, monto: 2900 }))
    const limite = await app.request('/api/transferencias', json({ ...base, monto: 100 }))
    assert.equal((await limite.json()).code, 'DAILY_LIMIT')
  })

  it('perillas: fallarProximas y latencia', async () => {
    await app.request('/__admin/config', json({ fallarProximas: 2 }))
    assert.equal((await app.request('/api/cuentas')).status, 500)
    assert.equal((await app.request('/api/cuentas')).status, 500)
    assert.equal((await app.request('/api/cuentas')).status, 200)
    await app.request('/__admin/config', json({ latenciaMs: 80 }))
    const t = Date.now()
    await app.request('/api/cuentas')
    assert.ok(Date.now() - t >= 70)
  })

  it('xss=true añade el movimiento con HTML', async () => {
    await app.request('/__admin/config', json({ xss: true }))
    const m = await (await app.request('/api/movimientos?cuentaId=c1&limit=1')).json()
    assert.match(m.items[0].concepto, /<img/)
  })
})

describe('identidad (AUTH=on)', () => {
  const app = crearApp({ auth: true })
  beforeEach(() => {
    reiniciar()
    reiniciarIdentidad()
  })
  const verificador = 'v'.repeat(50)
  const desafio = createHash('sha256').update(verificador).digest('base64url')
  const REDIR = 'http://localhost:5173/callback'

  async function iniciarSesion(v = verificador) {
    const form = new URLSearchParams({
      client_id: 'banquito-web', redirect_uri: REDIR, response_type: 'code', state: 'xyz',
      code_challenge: desafio, code_challenge_method: 'S256', usuario: 'ana', clave: 'banquito123',
    })
    const r = await app.request('/oauth/authorize', { method: 'POST', body: form })
    assert.equal(r.status, 302)
    const code = new URL(r.headers.get('location')!).searchParams.get('code')!
    return app.request('/oauth/token', {
      method: 'POST',
      body: new URLSearchParams({ grant_type: 'authorization_code', code, code_verifier: v, redirect_uri: REDIR, client_id: 'banquito-web' }),
    })
  }
  const cookies = (r: Response) =>
    Object.fromEntries(r.headers.getSetCookie().map((c) => c.split(';')[0]!.split('=') as [string, string]))

  it('/api exige token y acepta uno válido', async () => {
    assert.equal((await app.request('/api/cuentas')).status, 401)
    const t = await (await iniciarSesion()).json()
    const ok = await app.request('/api/cuentas', { headers: { authorization: `Bearer ${t.access_token}` } })
    assert.equal(ok.status, 200)
    assert.equal((await app.request('/api/cuentas', { headers: { authorization: 'Bearer x.y.z' } })).status, 401)
  })

  it('PKCE: un verifier distinto falla; el refresh va en cookie httpOnly', async () => {
    assert.equal((await iniciarSesion('otro'.repeat(15))).status, 400)
    const r = await iniciarSesion()
    const raw = r.headers.getSetCookie().find((c) => c.startsWith('refresh='))!
    assert.match(raw, /HttpOnly/i)
    assert.match(raw, /Path=\/oauth/)
    assert.equal(JSON.stringify(await r.json()).includes('refresh_token'), false)
  })

  it('refresh exige CSRF, rota y detecta reutilización', async () => {
    const r1 = await iniciarSesion()
    const c1 = cookies(r1)
    const refrescar = (c: Record<string, string>, csrf?: string) =>
      app.request('/oauth/token', {
        method: 'POST',
        headers: { cookie: `refresh=${c.refresh}; csrf=${c.csrf}`, ...(csrf ? { 'x-csrf-token': csrf } : {}) },
        body: new URLSearchParams({ grant_type: 'refresh_token' }),
      })
    assert.equal((await refrescar(c1)).status, 403) // sin cabecera CSRF
    const r2 = await refrescar(c1, c1.csrf)
    assert.equal(r2.status, 200)
    const c2 = cookies(r2)
    assert.notEqual(c2.refresh, c1.refresh) // rotó
    assert.equal((await refrescar(c1, c1.csrf)).status, 401) // reutilizado: se revoca la familia
    assert.equal((await refrescar(c2, c2.csrf)).status, 401) // y el nuevo también
  })

  it('access token vencido => TOKEN_EXPIRED', async () => {
    await app.request('/__admin/config', json({ ttlAccesoSeg: -10 }))
    const t = await (await iniciarSesion()).json()
    const r = await app.request('/api/cuentas', { headers: { authorization: `Bearer ${t.access_token}` } })
    assert.equal((await r.json()).code, 'TOKEN_EXPIRED')
  })
})
