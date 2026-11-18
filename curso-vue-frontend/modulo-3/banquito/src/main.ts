import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

import App from './App.vue'
import { router } from './router'
import { renovar } from './auth/sesion.ts'
import { reportar } from './lib/errores.ts'
import './assets/main.css'

window.addEventListener('unhandledrejection', (ev) => reportar(ev.reason, 'promesa'))

renovar()
  .catch(() => {})
  .finally(() => {
    const app = createApp(App)
    app.config.errorHandler = (e, _instancia, info) => reportar(e, `vue: ${info}`)
    app.use(createPinia()).use(PiniaColada).use(router).mount('#app')
  })
