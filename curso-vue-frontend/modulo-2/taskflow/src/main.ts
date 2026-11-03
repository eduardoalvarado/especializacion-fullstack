import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

import './assets/main.css'
import { enReposo, precargar } from './router/precargar.ts'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')

router.isReady().then(() => enReposo(() => precargar({ name: 'proyectos' })))
