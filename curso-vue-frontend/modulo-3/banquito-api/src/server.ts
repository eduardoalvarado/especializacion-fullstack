import { serve } from '@hono/node-server'
import { crearApp } from './app.ts'

const puerto = Number(process.env.PORT ?? 4000)
const auth = process.env.AUTH === 'on'
serve({ fetch: crearApp({ auth }).fetch, port: puerto }, () => {
  console.log(`Banquito API en http://localhost:${puerto}  ·  identidad: ${auth ? 'ACTIVA' : 'apagada (AUTH=on para activarla)'}`)
})
