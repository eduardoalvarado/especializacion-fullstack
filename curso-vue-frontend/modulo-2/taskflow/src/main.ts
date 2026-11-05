import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

import './assets/main.css'
import { firebaseApp } from './services/firebase.ts'
import { enReposo, precargar } from './router/precargar.ts'
import { VueFire, VueFireAuth } from 'vuefire'

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(VueFire, { firebaseApp, modules: [VueFireAuth()] })
  .use(router)
  .mount('#app')

router.isReady().then(() => enReposo(() => precargar({ name: 'proyectos' })))
