<script setup lang="ts"></script>

<template>
    <div class="flex flex-col item-center gap-3 py-12 text-center">
        <p class="text-5xl font-bold">404</p>
        <p class="text-slate-500">Esta pagina no existe</p>
        <RouterLink :to="{ name: 'proyectos'}" class="text-sky-600 underline dark:text-sky-400">
            Volver a los proyectos
        </RouterLink>
    </div>
</template>