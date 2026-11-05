<template>
  <section class="flex flex-col items-center gap-3 py-10 text-center">
    <h2 class="text-2xl font-bold">🔒 Sin acceso</h2>
    <p>Tu rol no puede ver esta pantalla.</p>
    <RouterLink :to="{ name: 'proyectos' }" class="text-sky-600">Volver a los proyectos</RouterLink>
  </section>
</template>
