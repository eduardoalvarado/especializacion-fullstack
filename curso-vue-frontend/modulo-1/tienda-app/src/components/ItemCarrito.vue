<script setup lang="ts">
import { watch } from 'vue'

const {titulo, precio = 1} = defineProps<{
    titulo: string
    precio: number
}>()

const cantidad = defineModel<number>('cantidad', { required:true })

const emit = defineEmits<{ quitar: [] }>()

watch(()=> cantidad, (nuevo, anterior) => {
    console.log(`${titulo}: ${anterior} -> ${nuevo}`)
})
</script>
<template>
    <button :disabled="cantidad <= 1" @click="cantidad--">-</button>
    <input v-model.number="cantidad" size="2">
    <button @click="cantidad++">+</button>
    <span>{{ titulo }} x {{ cantidad }} = s/ {{ (precio * cantidad).toFixed(2) }}</span>
    <button @click="emit('quitar')">Quitar</button>
</template>