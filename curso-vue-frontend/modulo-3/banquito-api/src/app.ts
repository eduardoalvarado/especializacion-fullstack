import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { BANCOS, LIMITE_DIARIO, PERFIL } from './datos.ts'
import { error } from './errores.ts'
import { config, db, reiniciar, sembrarXss } from './estado.ts'
import { reiniciarIdentidad, rutasIdentidad } from './identidad.ts'
import { verificar } from './jwt.ts'
import type { Beneficiario, Movimiento } from './tipos.ts'

export interface Opciones {
  auth?: boolean
  origen?: string
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function crearApp({ auth = process.env.AUTH === 'on', origen = process.env.CORS_ORIGIN ?? 'http://localhost:5174' }: Opciones = {}) {
  const app = new Hono()

  app.use(
    '*',
    cors({
      origin: origen,
      credentials: true,
      allowHeaders: ['Authorization', 'Content-Type', 'Idempotency-Key', 'X-CSRF-Token'],
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['X-Total-Count', 'Idempotent-Replayed'],
    }),
  )

  app.get('/health', (c) => c.json({ ok: true, auth }))

  // ── Perillas de clase ────────────────────────────────────────────────
  app.get('/__admin/config', (c) => c.json(config))
  app.post('/__admin/config', async (c) => {
    Object.assign(config, await c.req.json())
    if (config.xss) sembrarXss()
    return c.json(config)
  })
  app.post('/__admin/reset', (c) => {
    reiniciar()
    reiniciarIdentidad()
    return c.json({ ok: true })
  })

  if (auth) app.route('/', rutasIdentidad())

  // ── Middleware de /api: latencia, fallos y (si AUTH=on) token ─────────
  app.use('/api/*', async (c, next) => {
    if (config.latenciaMs > 0) await esperar(config.latenciaMs)
    if (config.fallarProximas > 0 || Math.random() < config.tasaFallo) {
      if (config.fallarProximas > 0) config.fallarProximas--
      return error(c, 500, 'INTERNAL', 'Error interno simulado')
    }
    if (auth && c.req.method !== 'OPTIONS') {
      const cabecera = c.req.header('authorization') ?? ''
      const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : ''
      const r = token ? verificar(token) : null
      if (!r || !r.ok) {
        c.header('WWW-Authenticate', 'Bearer')
        const caducado = r && !r.ok && r.motivo === 'expirado'
        return error(c, 401, caducado ? 'TOKEN_EXPIRED' : 'UNAUTHENTICATED', caducado ? 'El token expiró' : 'Falta un token válido')
      }
    }
    await next()
  })

  // ── Lectura ──────────────────────────────────────────────────────────
  app.get('/api/perfil', (c) => c.json(PERFIL))
  app.get('/api/cuentas', (c) => c.json(db.cuentas))
  app.get('/api/cuentas/:id', (c) => {
    const cuenta = db.cuentas.find((x) => x.id === c.req.param('id'))
    return cuenta ? c.json(cuenta) : error(c, 404, 'NOT_FOUND', 'La cuenta no existe')
  })

  app.get('/api/movimientos', (c) => {
    const { cuentaId, q = '', tipo, page = '1', limit = '10' } = c.req.query()
    const pagina = Math.max(1, Number(page) || 1)
    const tam = Math.min(50, Math.max(1, Number(limit) || 10))
    const texto = q.trim().toLowerCase()
    const lista = db.movimientos
      .filter((m) => !cuentaId || m.cuentaId === cuentaId)
      .filter((m) => !tipo || m.tipo === tipo)
      .filter((m) => !texto || m.concepto.toLowerCase().includes(texto))
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
    c.header('X-Total-Count', String(lista.length))
    return c.json({
      items: lista.slice((pagina - 1) * tam, pagina * tam),
      total: lista.length,
      page: pagina,
      limit: tam,
    })
  })

  // ── Beneficiarios (CRUD completo) ────────────────────────────────────
  const validarBeneficiario = (b: Partial<Beneficiario>, idActual?: string) => {
    const campos: Record<string, string> = {}
    if (typeof b.nombre !== 'string' || b.nombre.trim().length < 2 || b.nombre.length > 60)
      campos.nombre = 'El nombre debe tener entre 2 y 60 caracteres'
    if (typeof b.cuenta !== 'string' || !/^\d{20}$/.test(b.cuenta))
      campos.cuenta = 'La cuenta (CCI) debe tener 20 dígitos'
    if (typeof b.banco !== 'string' || !BANCOS.includes(b.banco)) campos.banco = 'Elige un banco de la lista'
    if (b.alias !== undefined && (typeof b.alias !== 'string' || b.alias.length > 30))
      campos.alias = 'El alias admite hasta 30 caracteres'
    const duplicada = db.beneficiarios.some((x) => x.cuenta === b.cuenta && x.id !== idActual)
    return { campos, duplicada }
  }

  app.get('/api/beneficiarios', (c) => c.json(db.beneficiarios))
  app.get('/api/beneficiarios/:id', (c) => {
    const b = db.beneficiarios.find((x) => x.id === c.req.param('id'))
    return b ? c.json(b) : error(c, 404, 'NOT_FOUND', 'El beneficiario no existe')
  })
  app.post('/api/beneficiarios', async (c) => {
    const cuerpo = (await c.req.json().catch(() => ({}))) as Partial<Beneficiario>
    const { campos, duplicada } = validarBeneficiario(cuerpo)
    if (Object.keys(campos).length) return error(c, 422, 'VALIDATION', 'Hay datos inválidos', campos)
    if (duplicada) return error(c, 409, 'DUPLICATE', 'Ya tienes un beneficiario con esa cuenta')
    const nuevo: Beneficiario = {
      id: `b${++db.contador.beneficiario}`,
      nombre: cuerpo.nombre!.trim(),
      alias: cuerpo.alias?.trim() ?? '',
      banco: cuerpo.banco!,
      cuenta: cuerpo.cuenta!,
      favorito: false,
      creadoEn: new Date().toISOString(),
    }
    db.beneficiarios.push(nuevo)
    return c.json(nuevo, 201, { Location: `/api/beneficiarios/${nuevo.id}` })
  })
  // PUT reemplaza el recurso completo (idempotente): se envían todos los campos editables
  app.put('/api/beneficiarios/:id', async (c) => {
    const actual = db.beneficiarios.find((x) => x.id === c.req.param('id'))
    if (!actual) return error(c, 404, 'NOT_FOUND', 'El beneficiario no existe')
    const cuerpo = (await c.req.json().catch(() => ({}))) as Partial<Beneficiario>
    const { campos, duplicada } = validarBeneficiario(cuerpo, actual.id)
    if (Object.keys(campos).length) return error(c, 422, 'VALIDATION', 'Hay datos inválidos', campos)
    if (duplicada) return error(c, 409, 'DUPLICATE', 'Ya tienes un beneficiario con esa cuenta')
    if (typeof cuerpo.favorito !== 'boolean')
      return error(c, 422, 'VALIDATION', 'Hay datos inválidos', { favorito: 'Debe ser verdadero o falso' })
    Object.assign(actual, {
      nombre: cuerpo.nombre!.trim(),
      alias: cuerpo.alias?.trim() ?? '',
      banco: cuerpo.banco!,
      cuenta: cuerpo.cuenta!,
      favorito: cuerpo.favorito,
    })
    return c.json(actual)
  })
  app.delete('/api/beneficiarios/:id', (c) => {
    const i = db.beneficiarios.findIndex((x) => x.id === c.req.param('id'))
    if (i < 0) return error(c, 404, 'NOT_FOUND', 'El beneficiario no existe')
    db.beneficiarios.splice(i, 1)
    return c.body(null, 204)
  })

  // ── Transferencias (con Idempotency-Key) ─────────────────────────────
  app.post('/api/transferencias', async (c) => {
    const clave = c.req.header('idempotency-key')
    if (clave && db.idempotencia.has(clave)) {
      const previo = db.idempotencia.get(clave)!
      c.header('Idempotent-Replayed', 'true')
      return c.json(previo.cuerpo as object, previo.estado as 201)
    }
    const cuerpo = (await c.req.json().catch(() => ({}))) as {
      cuentaOrigenId?: string
      beneficiarioId?: string
      monto?: number
      concepto?: string
    }
    const campos: Record<string, string> = {}
    const origen = db.cuentas.find((x) => x.id === cuerpo.cuentaOrigenId)
    const destino = db.beneficiarios.find((x) => x.id === cuerpo.beneficiarioId)
    if (!origen) campos.cuentaOrigenId = 'Elige una cuenta de origen'
    if (!destino) campos.beneficiarioId = 'Elige un beneficiario'
    if (typeof cuerpo.monto !== 'number' || !(cuerpo.monto > 0)) campos.monto = 'El monto debe ser mayor que 0'
    if (cuerpo.concepto !== undefined && cuerpo.concepto.length > 80) campos.concepto = 'Máximo 80 caracteres'
    if (Object.keys(campos).length) return error(c, 422, 'VALIDATION', 'Hay datos inválidos', campos)
    const monto = Math.round(cuerpo.monto! * 100) / 100
    if (monto > origen!.saldo) return error(c, 422, 'INSUFFICIENT_FUNDS', 'Saldo insuficiente', { monto: 'Supera tu saldo disponible' })
    if (db.transferenciasHoy + monto > LIMITE_DIARIO)
      return error(c, 422, 'DAILY_LIMIT', `Superas el límite diario de S/ ${LIMITE_DIARIO}`, { monto: 'Supera el límite diario' })

    origen!.saldo = Math.round((origen!.saldo - monto) * 100) / 100
    db.transferenciasHoy += monto
    const mov: Movimiento = {
      id: `${origen!.id}-m${++db.contador.movimiento}`,
      cuentaId: origen!.id,
      fecha: new Date().toISOString(),
      concepto: cuerpo.concepto?.trim() || `Transferencia a ${destino!.alias || destino!.nombre}`,
      monto: -monto,
      tipo: 'egreso',
      categoria: 'Transferencias',
    }
    db.movimientos.push(mov)
    const respuesta = { id: `t${db.contador.movimiento}`, estado: 'completada', movimiento: mov, saldo: origen!.saldo }
    if (clave) db.idempotencia.set(clave, { estado: 201, cuerpo: respuesta })
    return c.json(respuesta, 201)
  })

  app.notFound((c) => error(c, 404, 'NOT_FOUND', 'Ruta no encontrada'))
  app.onError((e, c) => {
    console.error(e)
    return error(c, 500, 'INTERNAL', 'Error interno')
  })
  return app
}
