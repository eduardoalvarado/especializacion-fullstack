<script setup lang="ts">
import { computed, reactive, ref, toRefs, useTemplateRef, watch, watchEffect } from "vue";
import { CURSOS, type Curso } from "@/cursos";
import ItemCarrito from "./ItemCarrito.vue";
import TarjetaCurso from "./TarjetaCurso.vue";
import Panel from './Panel.vue'

interface Linea {
  curso: Curso;
  cantidad: number;
}

const carrito = ref<Linea[]>([]);
const cliente = reactive({ nombre: "", email: "" });
const { nombre } = toRefs(cliente);
const cupon = ref("");
const mensaje = ref("");
const descuento = ref(0);

const busqueda = ref("");

const cargando = ref(true);
const cursos = ref<Curso[]>([]);

const order = ref<"titulo" | "precio">("titulo");

setTimeout(() => {
  cursos.value = CURSOS;
  cargando.value = false;
}, 1500);

const visibles = computed(() => {
  const texto = busqueda.value.toLowerCase();
  return cursos.value
    .filter((c) => c.titulo.toLowerCase().includes(texto))
    .sort((a, b) =>
      order.value === "precio"
        ? a.precio - b.precio
        : a.titulo.localeCompare(b.titulo),
    );
});

const cantidadTotal = computed(() =>
  carrito.value.reduce((suma, l) => suma + l.cantidad, 0),
);

const subtotal = computed(() => {
  return carrito.value.reduce(
    (suma, l) => suma + l.curso.precio * l.cantidad,
    0,
  );
});
const igv = computed(() => subtotal.value * 0.18);
const total = computed(
  () => (subtotal.value + igv.value) * (1 - descuento.value),
);

function agregar(curso: Curso) {
  const linea = carrito.value.find((l) => l.curso.id === curso.id);
  if (linea) {
    linea.cantidad++;
  } else {
    carrito.value.push({ curso, cantidad: 1 });
  }
}

const CLAVE = "tienda-carrito";

watch(
  carrito,
  (nuevo) => {
    localStorage.setItem(CLAVE, JSON.stringify(nuevo));
  },
  {
    deep: true,
  },
);

watch(cupon, (nuevo, anterior) => {
  mensaje.value = "Validando...";
  setTimeout(() => {
    const validado = nuevo === "VUE2026";
    descuento.value = validado ? 0.1 : 0;
    mensaje.value = validado ? "10% de descuento" : "Cupon invalido";
  }, 800);
});

watchEffect(() => {
  document.title = `Tienda cursos: (${cantidadTotal.value})`;
});

function quitar(id:number) {
    carrito.value = carrito.value.filter((item) => item.curso.id !== id)
}

const buscador = useTemplateRef('buscador')

const vaciar = () => {
    carrito.value = []
    buscador.value?.focus()
}

</script>

<template>
  <h1>Tienda de cursos</h1>
  <p>Pedido de: {{ nombre }} - {{ cantidadTotal }} cursos</p>
  
  <!-- Alumno -->
    <Panel titulo="Alumno">
        <input v-model="cliente.nombre" placeholder="Nombre" />
        <input v-model="cliente.email" placeholder="Email" />
    </Panel>

  <!-- Catalogo -->
  <h2>Catalogo:</h2>
  <input ref="buscador" v-model="busqueda" placeholder="Buscar cursos..." />
  <select v-model="order">
    <option value="titulo">Por titulo</option>
    <option value="precio">Por precio</option>
  </select>
  <p v-if="cargando">Cargando cursos...</p>
  <p v-else-if="visibles.length === 0">No hay cursos con '{{ busqueda }}'</p>
  <ul v-else>
    <li v-for="curso in visibles" :key="curso.id">
      <TarjetaCurso :curso="curso" @agregar="agregar" />
    </li>
  </ul>

  <!-- Carrito -->
  <Panel titulo="Carrito">
    <template #acciones>
        <button @click="vaciar">Vaciar</button>
    </template>
    <ul>
      <li v-for="item in carrito" :key="item.curso.id">
        <ItemCarrito
            v-model:cantidad="item.cantidad"
            :titulo="item.curso.titulo"
            :precio="item.curso.precio"
            @quitar="quitar(item.curso.id)"
        />
      </li>
    </ul>
  </Panel>
  <input v-model="cupon" placeholder="Cupon de descuento" />
  <p>{{ mensaje }}</p>

  <p>Subtotal: s/ {{ subtotal.toFixed(2) }}</p>
  <p>IGV (18%): s/ {{ igv.toFixed(2) }}</p>
  <p>
    <strong>Total: s/ {{ total.toFixed(2) }}</strong>
  </p>
</template>

<style scoped></style>
