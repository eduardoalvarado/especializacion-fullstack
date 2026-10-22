<script setup lang="ts">
import { ref } from 'vue'

const nombre = ref('Juan')
const likes = ref(0)
</script>

<template>
  <div>
    <h1>Hola {{ nombre }}</h1>
    <button class="btn-1" type="button" @click="likes++">Me gusta {{ likes }}</button>
  </div>
</template>

<style scoped>
.btn-1 {
  background-color: blue;
  color: white;
}
</style>
