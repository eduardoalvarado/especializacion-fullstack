import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { guardar } from '@/lib/almacenamiento'


export type Tema = 'claro' | 'oscuro'

const CLAVE = 'taskflow:tema'

export const usePreferenciasStore = defineStore('preferencias', () => {

  const tema = ref<Tema>('claro')

  function alternarTema() {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro'
  }

  watch(tema, (valor)=> {
    guardar(CLAVE, valor)
    document.documentElement.classList.toggle('dark', valor === 'oscuro')
  },
  {immediate: true}
)



  return { tema, alternarTema }
})