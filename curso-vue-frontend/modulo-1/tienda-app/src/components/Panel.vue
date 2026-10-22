<script setup lang="ts">
defineProps<{titulo: string}>()

</script>

<template>
<section class="panel">
    <header class="header">
        <h2>{{ titulo }}</h2>
        <slot name="acciones" />
    </header>

    <slot />
</section>
</template>

<style scoped>
.panel {
    border: 1px solid #d0d7de;
    border-radius: 8px;
    padding: 10px 12px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
</style>