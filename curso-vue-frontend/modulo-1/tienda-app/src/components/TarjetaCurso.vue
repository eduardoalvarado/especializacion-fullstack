<script setup lang="ts">
import { ref } from 'vue'
import type {Curso} from '@/cursos'

const abierto = ref(false)

const { curso } = defineProps<{curso:Curso}>()
const emit = defineEmits<{
    agregar: [curso:Curso]
}>()

</script>

<template>
    <article>
        <button @click="abierto = !abierto">{{ curso.titulo }}</button>
        <button @click="emit('agregar', curso)" >Agregar</button>
        <p v-show="abierto">{{ curso.categoria }} - {{ curso.precio }}</p>
    </article>
</template>

<style>
</style>