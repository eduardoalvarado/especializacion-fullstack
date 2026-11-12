import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

import App from './App.vue'
import { router } from './router'
import { renovar } from './auth/sesion.ts'
import './assets/main.css'

renovar()
  .catch(() => {})
  .finally(() => createApp(App).use(createPinia()).use(PiniaColada).use(router).mount('#app'))
