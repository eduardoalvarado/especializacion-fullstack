import { initializeApp } from 'firebase/app'
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
  } from 'firebase/firestore'

// Estas claves no son secretas: solo identifican tu proyecto. La seguridad la dan las reglas.
export const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
})

// La caché en el dispositivo (IndexedDB) deja leer y escribir sin red; al volver, se sincroniza
export const db = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  })