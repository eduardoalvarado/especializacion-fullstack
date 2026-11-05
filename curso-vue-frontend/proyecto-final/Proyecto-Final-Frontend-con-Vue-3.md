# Proyecto Final – Frontend con Vue 3 + TypeScript

## Presentación

Cada estudiante construirá, de forma **individual**, una SPA en producción con Vue 3 y TypeScript que aplique todo el curso: componentes, Vue Router, Pinia, Firebase, consumo de APIs REST, autorización por roles, validaciones, seguridad, sesiones, optimización y despliegue.

El salón votará entre dos opciones y **la más votada será el proyecto de todos**:

| Opción | Dominio | Frase |
| --- | --- | --- |
| **VueBank** | Banca / fintech | Construye la banca por internet de tu propio banco: saldos, movimientos, transferencias y tipo de cambio en tiempo real. |
| **VueEats** | Delivery | Tu propia app de delivery: el cliente pide, el restaurante prepara y ves el pedido avanzar en vivo. |

Ambas opciones tienen la misma base técnica, el mismo esfuerzo estimado y dos niveles: **Normal** (mínimo para aprobar) y **Avanzado** (para demostrar dominio técnico superior).

## Base común

Las dos opciones comparten stack, arquitectura y reglas; solo cambia el dominio y la API externa.

**Stack obligatorio:** Vite, Vue 3, TypeScript, Vue Router, Pinia, Firebase (Auth, Firestore y Hosting), Axios, VeeValidate + Zod y Vue Devtools.

**Arquitectura**

- **Firebase Auth** para registro y login. El rol viaja como *custom claim* dentro del ID token (JWT). Un usuario sin claim es cliente.
- **Firestore** como base de datos, protegida con reglas de seguridad que validan el rol.
- **Una API REST externa** por proyecto, consumida con Axios e interceptores.
- **Firebase Hosting** para el despliegue en producción.

**Reglas del proyecto**

- El proyecto es individual.
- El **Nivel Normal** es el mínimo para aprobar. El **Nivel Avanzado** se obtiene implementando **al menos 3 ítems** de su lista.
- No se suben imágenes a Firebase: Cloud Storage no está incluido en el plan gratuito.
- La service account de Firebase nunca se sube al repositorio.
- Las reglas de Firestore nunca quedan en "modo de prueba" (abiertas).

**Definición de terminado (Nivel Normal)**

- [ ] Desplegado en Firebase Hosting y funciona al recargar cualquier ruta
- [ ] Sin errores en la consola del navegador
- [ ] Login funcional con los usuarios de prueba de cada rol
- [ ] README con setup, usuarios de prueba, captura de Vue Devtools con el estado de Pinia y la sección "Uso de IA"

## Opción 1: VueBank, banca por internet

VueBank es la banca por internet de un banco ficticio: el cliente consulta saldos y movimientos, transfiere dinero y ve el tipo de cambio; un analista aprueba las transferencias grandes.

**Roles**

| Rol | Claim | Puede |
| --- | --- | --- |
| Cliente | (sin claim) | Ver sus cuentas, movimientos y tipo de cambio; hacer transferencias |
| Analista | `analyst` | Todo lo anterior + aprobar o rechazar transferencias pendientes |
| Admin | `admin` | Solo Nivel Avanzado: bloquear cuentas y fijar límites |

**API REST externa:** ExchangeRate-API, endpoint abierto `https://open.er-api.com/v6/latest/USD` (sin API key).

**Reglas de negocio (obligatorias)**

- Los montos se guardan **en céntimos (enteros)** y se muestran con el helper `money.ts`.
- Una transferencia mayor a **S/ 5,000 o US$ 1,500** queda en estado `pending`.
- El saldo **se descuenta solo al aprobar**; en ese momento se vuelve a validar el saldo. Si no alcanza, se rechaza automáticamente.
- Tipo de cambio: compra = tasa × 0.985, venta = tasa × 1.015.
- Sesión: aviso por inactividad a los **4 minutos** y cierre automático a los **5 minutos**.

### Nivel Normal

**Autenticación y acceso** (M2 · S3–S4)

- Registro, login y logout con Firebase Auth.
- Rol leído del claim con `getIdTokenResult()` y guardado en `useAuthStore`.
- Guards con `meta: { requiresAuth, roles }`: `/approvals` solo para el Analista; vista 403 para el resto.
- Menú y acciones condicionados por rol.

**Funcionalidad** (M1, M2 · S1–S2)

- **Dashboard:** cuentas en PEN y USD con saldo y número enmascarado (`****4521`).
- **Movimientos:** filtros por cuenta, tipo (cargo o abono) y periodo (7, 30 o 90 días); detalle; paginación con `limit` + `startAfter`.
- **Transferencia en 3 pasos:** formulario, confirmación y voucher.
  - Solo entre cuentas de la **misma moneda**, propias o de terceros.
  - La cuenta de un tercero se valida contra `accountDirectory`.
  - Se ejecuta con `runTransaction`: debita, acredita y registra los movimientos de forma atómica.
- **Bandeja del Analista:** transferencias pendientes con Aprobar o Rechazar.
- **Tipo de cambio:** widget de compra y venta y conversor PEN ↔ USD informativo.

**API REST** (M3 · S1)

- Instancia de Axios con interceptor de errores.
- Tasa en caché en Pinia, con la hora de última actualización visible.

**Seguridad** (M3 · S2)

- Números de cuenta enmascarados, cero uso de `v-html`, configuración en `.env`.
- Nada sensible en `localStorage`.
- Reglas de Firestore: cada usuario solo lee sus cuentas y movimientos.

**Validaciones y errores** (M3 · S3)

- VeeValidate + Zod en la transferencia: monto mayor a 0, máximo 2 decimales, saldo suficiente, cuenta destino existente y distinta a la de origen.
- `app.config.errorHandler` con toast; estados de carga, vacío y error en todas las vistas.

**Sesión** (M3 · S4)

- `browserSessionPersistence`: la sesión termina al cerrar la pestaña.
- Composable `useIdleTimeout` con aviso y cierre automático.

**Optimización y build** (M4 · S1–S2)

- Lazy loading de rutas, `.env.development` y `.env.production`, build y despliegue en Firebase Hosting.

### Nivel Avanzado (elegir al menos 3)

1. Transferencias entre monedas usando el tipo de cambio de compra o venta.
2. Clave dinámica (OTP) simulada antes de confirmar una transferencia.
3. Rol Admin: bloqueo y desbloqueo de cuentas y límite diario de transferencias.
4. Gráfico de gastos del mes por categoría y exportación de movimientos a CSV.
5. Filtro de movimientos por rango de fechas libre.
6. Inspector del JWT: claims, expiración y renovación con `getIdToken(true)`.
7. Directiva `v-can` con una matriz de permisos centralizada.
8. Headers de seguridad (CSP, X-Frame-Options) en `firebase.json`.
9. Análisis del bundle y chunk separado para Firebase.
10. IA en el producto: resumen de gastos del mes en lenguaje natural, sin exponer una API key en el frontend.

## Opción 2: VueEats, delivery lite

VueEats es una app de delivery: el cliente elige un restaurante, arma su carrito y sigue su pedido en tiempo real; el restaurante recibe los pedidos y actualiza su estado.

**Roles**

| Rol | Claim | Puede |
| --- | --- | --- |
| Cliente | (sin claim) | Explorar restaurantes, armar el carrito, pedir y seguir sus pedidos |
| Restaurante | `restaurant` | Recibir pedidos, aceptarlos o rechazarlos y actualizar su estado |
| Repartidor | `rider` | Solo Nivel Avanzado: tomar pedidos listos y entregarlos |

**API REST externa:** DummyJSON `https://dummyjson.com/recipes/:id` (detalle, imagen e ingredientes de cada plato, sin API key).

**Reglas de negocio (obligatorias)**

- **Un restaurante por carrito.** Si el cliente agrega un plato de otro restaurante, se le pregunta si desea vaciar el carrito.
- El precio de cada plato viene del seed (`restaurants.menu`); el detalle viene de DummyJSON.
- Estados del pedido: `recibido` → `preparando` → `listo` → `en_camino` → `entregado`. El estado `rechazado` solo es posible desde `recibido`.
- En el Nivel Normal, **el restaurante controla todos los estados** (hace su propio delivery).
- El cliente solo puede cancelar mientras el pedido está en `recibido`.
- Pago: "Efectivo" o "Yape (simulado)". **No hay campos de tarjeta.**

### Nivel Normal

**Autenticación y acceso** (M2 · S3–S4)

- Registro, login y logout con Firebase Auth.
- Rol leído del claim y guardado en `useAuthStore`.
- Guards: `/kitchen` solo para Restaurante; vista 403 para el resto.
- Menú distinto para cliente y restaurante.

**Funcionalidad** (M1, M2 · S1–S2)

- **Home:** 6 restaurantes con buscador de platos y filtro por tipo de cocina.
- **Carta** en `/restaurants/:id` y detalle del plato.
- **Carrito en Pinia:** cantidades, subtotal, costo de envío fijo por restaurante y total con `computed`.
- **Checkout:** dirección, referencia, teléfono y método de pago.
- **Seguimiento** en `/orders/:id`: línea de tiempo de estados en tiempo real con `onSnapshot`.
- **Historial** de pedidos del cliente.
- **Panel del Restaurante:** pedidos entrantes en tiempo real con Aceptar, Rechazar, Preparando, Listo, En camino y Entregado. Cada cambio se registra en `statusHistory`.

**API REST** (M3 · S1)

- Instancia de Axios con interceptor de errores.
- Recetas en caché en Pinia para no repetir peticiones.

**Seguridad** (M3 · S2)

- Reglas de Firestore: el cliente solo lee y crea sus propios pedidos; solo el rol `restaurant` cambia el estado.
- Cero uso de `v-html`; los campos de texto libre se muestran escapados.

**Validaciones y errores** (M3 · S3)

- VeeValidate + Zod en el checkout: dirección requerida, teléfono de 9 dígitos que empiece con 9, carrito no vacío.
- `app.config.errorHandler` con toast; estados de carga, vacío y error en todas las vistas.

**Sesión** (M3 · S4)

- `browserLocalPersistence`: la sesión se mantiene al cerrar el navegador.
- Carrito persistente en `localStorage`.

**Optimización y build** (M4 · S1–S2)

- Imágenes con `loading="lazy"`, búsqueda con debounce y listeners de `onSnapshot` cerrados en `onUnmounted`.
- Lazy loading de rutas, variables por entorno y despliegue en Firebase Hosting.

### Nivel Avanzado (elegir al menos 3)

1. Rol Repartidor: toma los pedidos en `listo` y los marca En camino y Entregado (el restaurante deja de hacerlo).
2. Cada restaurante ve solo sus propios pedidos (`ownerId`).
3. Mapa con Leaflet + OpenStreetMap con coordenadas fijas y ruta simulada.
4. Costo de envío y tiempo estimado según la distancia.
5. Cupones con validación de vigencia y monto mínimo.
6. Calificación del pedido entregado.
7. Inspector del JWT: claims, expiración y renovación con `getIdToken(true)`.
8. Directiva `v-can` con una matriz de permisos centralizada.
9. Headers de seguridad en `firebase.json` y análisis del bundle.
10. IA en el producto: recomendador ("¿qué se te antoja?" → platos sugeridos), sin exponer una API key en el frontend.

**Datos de prueba**

|  | VueBank | VueEats |
| --- | --- | --- |
| Usuarios | `cliente1@vuebank.pe`, `cliente2@vuebank.pe`, `analista@vuebank.pe` (`analyst`), `admin@vuebank.pe` (`admin`) | `cliente@vueeats.pe`, `restaurante@vueeats.pe` (`restaurant`), un dueño por restaurante, `repartidor@vueeats.pe` (`rider`) |
| Colecciones | `accounts`, `accountDirectory`, `transactions`, `transfers` | `restaurants`, `orders` |
| Datos iniciales | Cada cliente con una cuenta PEN y una USD y unos 30 movimientos de los últimos 90 días | 6 restaurantes con nombre, logo, costo de envío, dueño, coordenadas y carta (`recipeId` + precio) |

Las contraseñas de los usuarios de prueba vienen en el README del starter.

## Hitos y entregables

El proyecto se revisa en dos hitos, cada uno al cierre de un módulo, para aplicar solo lo que ya se vio en clase.

**Entregables finales (Hito 2)**

- [ ] Enlace al repositorio en GitHub (público o con acceso para el docente)
- [ ] URL de producción en Firebase Hosting
- [ ] README con: setup, usuarios de prueba por rol, ítems del Nivel Avanzado implementados, captura de Vue Devtools y sección "Uso de IA"
- [ ] Demo en vivo de 5 minutos: login con cada rol, flujo principal y un ítem del Avanzado (si aplica)

## Uso de IA e integridad

Se permite usar IA como copiloto (M4 · S3), siempre que el estudiante entienda y pueda defender cada línea que entrega.

El README debe incluir una sección **"Uso de IA"** con:

- Qué herramientas se usaron (Copilot, Claude, ChatGPT u otras) y para qué partes.
- Al menos **un ejemplo concreto** de código generado que se tuvo que corregir: qué estaba mal y por qué(opcional).
- Qué partes se escribieron sin ayuda.

**Reglas de integridad**

- El proyecto es individual: dos repositorios con la misma solución se evalúan como copia.
- El historial de commits debe mostrar avance progresivo; un único commit final no es válido.
