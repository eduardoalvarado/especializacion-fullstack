<script setup lang="ts">
import type { Permiso } from '../lib/permisos'
import { useSesionStore } from '@/stores/sesion';

defineProps<{ permiso: Permiso}>()
const sesion = useSesionStore()

</script>

<template>
    <slot v-if="sesion.puede(permiso)" />
</template>