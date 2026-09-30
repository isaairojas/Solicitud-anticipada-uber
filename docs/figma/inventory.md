# Inventario F0 — RB_Handheld_Mejoras-de-procesos

- Archivo: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/RB_Handheld_Mejoras-de-procesos
- `FILE_KEY`: `zZBoCtJor0tdJ91umiqb7l`
- Fecha: 2026-09-29 · Fuente: MCP remoto de Figma (`get_metadata`, `get_screenshot`, `get_variable_defs`, `get_libraries`, `search_design_system` y `use_figma` en modo **solo lectura**)
- Caché: `docs/figma/cache/` (Configuraciones HH) y `docs/figma/cache/revision/` (Revisión); `variable-defs.json` con variables y estilos
- **Estado: v2 (2026-09-29).** Incorpora las respuestas del usuario a P1–P5. Pendiente de aprobación para iniciar F1.

## Decisiones de alcance (respuestas del usuario, 2026-09-29)

| # | Pregunta | Respuesta | Aplicación |
|---|---|---|---|
| P1 | Páginas a replicar | Principalmente el flujo de **"🔎 Revisión - Durante el surtido"**; "⚙️ Configuraciones HH" es la última | Alcance: **Revisión (prioridad 1)** + **Configuraciones HH (prioridad 2)**. Las demás páginas se ignoran |
| P2 | Componentes sin original | Si no está, generar uno nuevo buscando uno parecido | Se localizaron todos los originales (ver §3.3), así que no hace falta generar ninguno por ahora. La regla queda vigente para F3 |
| P3 | Borradores | Ignorar | Se ignoran `Container`, `Frame 336` y los frames sueltos de Revisión (ver §1.9) |
| P4 | Temas | Solo claro | Confirmado: las 4 colecciones de variables tienen un único modo (`Mode 1`) |
| P5 | Menú completo | Sí | La pantalla Menú se replica completa (4 tarjetas, contador "+5", "Salir") |

## Páginas del archivo

`get_metadata` sin nodo solo lista `✨ Cover`. El listado real se obtuvo con `use_figma` (`figma.root.children`, solo lectura):

| Página | nodeId | Decisión |
|---|---|---|
| ✨ Cover | 16:16 | Ignorar (portada) |
| ✏️ Sketch | 0:1 | Ignorar |
| 📲 Surtido - Un pedido x ronda | 24:16 | Ignorar como flujo. **Contiene la sección `NO TOCAR` (237:3050) con componentes maestros usados en el alcance** |
| 📲 Surtido - Multi. pedido x ronda | 2888:9537 | Ignorar |
| **🔎 Revisión - Durante el surtido** | **3048:10012** | **Incluir — prioridad 1** |
| 🔎 Revisión - Independiente | 2888:9538 | Ignorar |
| 🧾 Facturación | 3287:5564 | Ignorar |
| 🚚 Embarque | 6157:1119 | Ignorar |
| **⚙️ Configuraciones HH** | **5170:10163** | **Incluir — prioridad 2** |
| (separadores `-----`) | 2888:9540, 2888:9539, 3287:5565, 6157:1120, 5170:10164 | Ignorar |

## Resumen

| Concepto | Revisión | Configuraciones HH | Total |
|---|---|---|---|
| Secciones de flujo | 7 | 4 | 11 |
| Frames de pantalla (430×932) | 67 | 27 | **94** |
| Toasts sueltos | 8 | 4 | 12 |
| Puntos de inicio de flujo (prototipo) | 7 | 3 | 10 |
| Interacciones de prototipo (`reactions`) | 374 | 158 | 532 |
| Componentes usados | 5 (1 local + 3 de `NO TOCAR` en 24:16 + 1 remoto) | 10 locales + 3 externos | ver §3 |

Tamaño de frame base: **430×932** en todas las pantallas. No hay frames de escritorio.

---

## 1. Página 🔎 Revisión - Durante el surtido — `3048:10012` — **Incluir (prioridad 1)**

Todas las pantallas son **Móvil**. Muchos frames son estados u overlays de la misma pantalla lógica (F5.4). La columna "Pantalla lógica" propone cómo se agruparán en F4/F5.

Pantallas lógicas propuestas:
- **Menú**
- **Asignación de tareas**
- **Surtido de órdenes**, con estos overlays: *Revisión de mercancía* (modo escaneo con progreso `x / n` y modo simplificado), *Ingresar cantidad*, *Menú contextual*, *Finalizar surtido*, *Finalizar surtido y revisión*, *Promoción incompleta*, *Escanear promoción* y *Promoción negada*.
- **Detalle del producto**, con botón dinámico. Encima puede abrirse el overlay *Revisión de mercancía*.

Los rombos de decisión, las imágenes de documentación y las flechas son **anotaciones del lienzo**: no son UI.

### 1.1 Sección `3199:4225` — "Botón dinámico en detalle de producto" (7889×1720) · inicio de flujo `3199:5738`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R1 | Menú | 3199:4315 | Menú (queda **tapado** por R2 en la misma posición) | Menú |
| R2 | Menú | 6048:7053 | Menú (capa superior) | Menú |
| R3 | Asignación de tareas | 3199:4226 | Actividad "SURTIDO Y REVISIÓN PEDIDO CLIENTE" | Asignación de tareas |
| R4 | Interfaz principal - NO INICIADO | 3199:4349 | Surtido de órdenes, todo en 0, 5 pendientes | Surtido de órdenes |
| R5 | Interfaz principal - COMPLETADO | 3199:5738 | Surtido con avance; 1964000 con insignia "R" 5 de 5 | Surtido de órdenes |
| R6 | Detalle de producto | 3199:6362 | 1964000, cantidad 5; "Aceptar" / "Revisar producto" deshabilitado | Detalle del producto |
| R7 | Detalle de producto | 3236:4114 | Cantidad 0; "Aceptar" / "Negar producto" | Detalle del producto |
| R8 | Detalle de producto | 3236:4640 | Cantidad 1; "Revisar producto" habilitado | Detalle del producto |
| R9 | Detalle de producto | 3199:6170 | Cantidad 0; "Negar producto" | Detalle del producto |
| R10 | Detalle de producto | 3232:3951 | Cantidad 3; "Negar producto" deshabilitado | Detalle del producto |

Anotaciones: rombos "¿Bandera de revisión activa?", "¿Producto ya revisado?", "¿Cantidad surtida = 0?" (×2); `image 4` (3232:3913) es una **tabla de reglas del botón dinámico** (7 casos: bandera de revisión × cantidad surtida → leyenda, estado y acción). Es documentación funcional y se transcribirá en F5.

### 1.2 Sección `3048:10013` — "Revisión de producto escaneado en su totalidad" (7784×1720) · inicio `3048:10103`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R11 | Menú | 3048:10103 | Menú | Menú |
| R12 | Asignación de tareas | 3048:10014 | "SURTIDO Y REVISIÓN PEDIDO CLIENTE" | Asignación de tareas |
| R13 | Interfaz principal - NO INICIADO | 3048:10138 | Surtido inicial | Surtido de órdenes |
| R14 | Interfaz principal - SURTIDO COMPLETO | 3056:11810 | 1964000 5 de 5 | Surtido de órdenes |
| R15 | Interfaz principal - SURTIDO COMPLETO | 3058:12380 | Overlay "Revisión de mercancía" **0 / 5** (escaneo forzoso) | Surtido › Revisión |
| R16 | Interfaz principal - NO INICIADO | 3081:1891 | Overlay 5 / 5 | Surtido › Revisión |
| R17 | Interfaz principal - NO INICIADO | 3308:17237 | Overlay simplificado "5 Piezas surtidas por revisar" ✕/✓ | Surtido › Revisión |
| R18 | Interfaz principal - NO INICIADO | 3086:11303 | Surtido con 1964000 "R" al final | Surtido de órdenes |
| — | Toast revisión completada | 3085:11302 | "Revisión completa" | Toast |

Anotaciones: 3 rombos (¿Es misceláneo?, ¿Múltiplo de empaque…?, ¿Costo unitario < $100?) y `image 5` (3232:3916), un diagrama del proceso de revisión.

### 1.3 Sección `3236:4916` — "Revisión de producto ingresando cantidad manual en su totalidad" (10349×1720) · inicio `3236:5006`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R19 | Menú | 3236:5006 | Menú | Menú |
| R20 | Asignación de tareas | 3236:4917 | "SURTIR PEDIDO CLIENTE" | Asignación de tareas |
| R21 | Interfaz principal - NO INICIADO | 3236:5041 | Surtido inicial | Surtido de órdenes |
| R22 | Interfaz principal - NO INICIADO | 3236:15669 | Teclado del sistema abierto | Surtido de órdenes |
| R23 | Interfaz principal - NO INICIADO | 3236:15851 | Código "2546000" capturado | Surtido de órdenes |
| R24 | Interfaz principal - NO INICIADO | 3236:16031 | Overlay "Ingresa la cantidad surtida en contenedor" | Surtido › Ingresar cantidad |
| R25 | Interfaz principal - SURTIDO COMPLETO | 3236:5092 | 2546000 5 de 5 | Surtido de órdenes |
| R26 | Interfaz principal - SURTIDO COMPLETO | 3236:5261 | Revisión 0 / 5 | Surtido › Revisión |
| R27 | Interfaz principal - NO INICIADO | 3236:5348 | Revisión 5 / 5 | Surtido › Revisión |
| R28 | Interfaz principal - NO INICIADO | 3316:17799 | Revisión simplificada "5" | Surtido › Revisión |
| R29 | Interfaz principal - NO INICIADO | 3236:5433 | Surtido con "R" | Surtido de órdenes |
| — | Toast revisión completada | 3236:5644 | "Revisión completa" | Toast |

### 1.4 Sección `3089:13312` — "Revisión producto surtido parcial" (9977×1720) · inicio `3089:13437`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R30 | Interfaz principal - NO INICIADO | 3089:13437 | Surtido inicial | Surtido de órdenes |
| R31 | Interfaz principal - NO INICIADO | 3089:13509 | 2546000 3 de 5 (parcial) | Surtido de órdenes |
| R32 | Detalle de producto | 3091:14568 | 2546000 cant. 3; "Regresar" / "Revisar producto" | Detalle del producto |
| R33 | Detalle de producto | 3091:15591 | Revisión 0 / 3 | Detalle › Revisión |
| R34 | Detalle de producto | 3107:16864 | Revisión 3 / 3 | Detalle › Revisión |
| R35 | Detalle de producto | 3107:18312 | "Aceptar" / "Revisar producto" deshabilitado | Detalle del producto |
| R36 | Interfaz principal - NO INICIADO | 3095:16325 | 2546000 "R" 3 de 5 | Surtido de órdenes |
| R37 | Detalle de producto | 3103:16777 | Cant. 3, revisar deshabilitado | Detalle del producto |
| R38 | Detalle de producto | 3321:22945 | Cant. 4, "Revisar producto" habilitado | Detalle del producto |
| R39 | Interfaz principal - NO INICIADO | 3158:15620 | 3 de 5 sin "R" (revisión restablecida) | Surtido de órdenes |
| R40 | Detalle de producto | 3115:2192 | Revisión 0 / 4 | Detalle › Revisión |
| R41 | Detalle de producto | 3120:11941 | Revisión 4 / 4 | Detalle › Revisión |
| R42 | Detalle de producto | 3321:23101 | Cant. 3, revisar deshabilitado | Detalle del producto |
| — | Toast revisión completada | 3107:19053, 3321:23228 | "Revisión completa" | Toast |

### 1.5 Sección `3168:15884` — "Cantidad de surtido modificada (Revisión restablecida)" (4861×1720) · inicio `3168:15983`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R43 | Interfaz principal - NO INICIADO | 3168:15983 | 2546000 "R" 3 de 5 | Surtido de órdenes |
| R44 | Interfaz principal - NO INICIADO | 3316:18538 | 4 de 5, sin "R" | Surtido de órdenes |
| R45 | Interfaz principal - NO INICIADO | 3168:17476 | 5 de 5 | Surtido de órdenes |
| R46 | Detalle de producto | 3168:16333 | Revisión 0 / 5 (overlay sobre Surtido) | Surtido › Revisión |
| R47 | Detalle de producto | 3168:16454 | Revisión 5 / 5 | Surtido › Revisión |
| R48 | Interfaz principal - NO INICIADO | 3168:17858 | "R" 5 de 5 | Surtido de órdenes |
| — | Toast revisión completada | 3168:16944 | "Revisión completa" | Toast |

### 1.6 Sección `3126:12245` — "Finalización de surtido manual" (10325×1720) · inicio `3126:12419`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R49 | Interfaz principal - NO INICIADO | 3126:12419 | Surtido: 3 completados, 2 parciales | Surtido de órdenes |
| R50 | Interfaz principal - NO INICIADO | 3126:14004 | Overlay "Menú": "Repetir audio", "Finalizar surtido", ✕ | Surtido › Menú contextual |
| R51 | Interfaz principal - NO INICIADO | 3126:14208 | Overlay "Finalizar surtido" (códigos parciales + existencia) | Surtido › Finalizar surtido |
| R52 | Interfaz principal - NO INICIADO | 3316:18734 | Revisión simplificada "10" (1394000) | Surtido › Revisión |
| R53 | Interfaz principal - NO INICIADO | 3126:14493 | Revisión 0 / 3 | Surtido › Revisión |
| R54 | Interfaz principal - NO INICIADO | 3321:19232 | Surtido con "R" | Surtido de órdenes |
| R55 | Interfaz principal - NO INICIADO | 3321:19728 | Overlay "Menú" | Surtido › Menú contextual |
| R56 | Interfaz principal - NO INICIADO | 3321:19839 | Overlay "Finalizar surtido" | Surtido › Finalizar surtido |
| R57 | Interfaz principal - NO INICIADO | 3321:20948 | Revisión 0 / 3 | Surtido › Revisión |
| R58 | Interfaz principal - NO INICIADO | 3168:18167 | Revisión 3 / 3 | Surtido › Revisión |
| R59 | Interfaz principal - NO INICIADO | 3126:14858 | Revisión simplificada "56" (4105000) | Surtido › Revisión |
| R60 | Interfaz principal - NO INICIADO | 4582:25038 | Overlay "Finalizar surtido y revisión" | Surtido › Finalizar surtido y revisión |
| R61 | Asignación de tareas | 3236:17517 | "FACTURAR PEDIDO CLIENTE **(PROXIMAMENTE)**" | Asignación de tareas |
| — | Surtido completado TOAST | 3236:17501 | "Surtido y revisión finalizados" | Toast |

### 1.7 Sección `4582:20083` — "Finalización de surtido automático" (5700×1720) · inicio `4582:20084`

| # | Frame | nodeId | Contenido observado | Pantalla lógica |
|---|---|---|---|---|
| R62 | Interfaz principal - FINALIZACIÓN COMPLETO | 4582:20084 | Surtido: 4 completados, 1 negado (chip "Negado") | Surtido de órdenes |
| R63 | Interfaz principal - FINALIZACIÓN COMPLETO | 4582:20287 | Overlay "Finalizar surtido y revisión" | Surtido › Finalizar surtido y revisión |
| R64 | Modal  Menú | 4582:23551 | Overlay "Finalizar surtido": promoción incompleta, "Eliminar productos" | Surtido › Promoción incompleta |
| R65 | Modal  Menú | 4582:23773 | Overlay "Escanea un producto de la promoción" | Surtido › Escanear promoción |
| R66 | Modal  Menú | 4582:24045 | Overlay "Promoción negada" | Surtido › Promoción negada |
| R67 | Menú 3 | 4582:20369 | Asignación de tareas ("SURTIR PEDIDO CLIENTE") | Asignación de tareas |
| — | Error | 4582:24273 | Toast rojo "Código inválido" | Toast |
| — | Surtido completado TOAST | 4582:20453 | "Surtido y revisión finalizados" | Toast |

Anotaciones: rombos "¿Existen promociones AxB incompletas?" y "¿Se escaneó el código correcto?".

### 1.8 Sección `3373:15277` — "NO TOCAR" (referencia, no es flujo)

Contiene el **component set `Card revisión aleatoria`** (3086:11540) y frames de referencia: Detalle de producto (3142:15295, 3236:5516, 3368:15501, 3368:16159, 3368:15803; uno con botón "Surtir parcialmente"), Surtido (3236:5177), Modal Revisión aleatoria (3142:15246), rectángulo "Multimedia 1" (3236:15847) y toast (3368:15933). **No se replican como pantallas.** Sirven de referencia para componentes y variantes, por ejemplo el botón "Surtir parcialmente".

### 1.9 Nodos sueltos de la página (fuera de secciones)

| Nombre | nodeId | Tamaño | Decisión |
|---|---|---|---|
| Interfaz principal - NO INICIADO | 6653:8000 | 430×932 | Borrador (duplicado del overlay "Finalizar surtido y revisión") → **Ignorar** (P3) |
| Interfaz principal - NO INICIADO | 6653:8624 | 430×932 | Ídem → **Ignorar** (P3) |
| Scanner Input Container | 4213:6937 | 366×50 | Referencia de la barra de escaneo (botón de teclado + campo), presente en casi todas las pantallas → candidato a componente en F3 |

---

## 2. Página ⚙️ Configuraciones HH — `5170:10163` — **Incluir (prioridad 2)**

Inicios de flujo del prototipo: `5917:1642` "Ventana de config.", `5170:12983` "Config. de sonidos y dictado", `5487:3070` "Config. de impresoras". Tiene 158 interacciones (94 CHANGE_TO, 34 NAVIGATE, 1 OVERLAY).

### Sección `5917:1641` — "ERB-51053 Ventana de configuración de operación"

| # | Frame | nodeId | Contenido | Flujo |
|---|---|---|---|---|
| C1 | Menú | 5917:1642 | Menú principal + engrane de configuración | Configuración |
| C2 | Interfaz principal - NO INICIADO | 5917:1679 | "Configuraciones": Impresión / Sonidos | Configuración |

### Sección `5170:11189` — "ERB-51054 Módulo de alertas sonoras y dictado de voz por tarea"

| # | Frame | nodeId | Contenido | Flujo |
|---|---|---|---|---|
| C3 | Interfaz principal - NO INICIADO | 5170:12983 | "Configuraciones > Sonido", 4 switches activos | Sonidos |
| C4 | Interfaz principal - NO INICIADO | 5342:4089 | Estado de C3: "Lectura de elementos" (surtido) desactivado | Sonidos |

### Sección `5342:843` — "ERB-51055 Módulo de configuración de impresoras por proceso"

| # | Frame | nodeId | Contenido | Flujo |
|---|---|---|---|---|
| C5 | Prcoesos impresion | 5487:3070 | Procesos, estados cargando (amarillo) | Impresión › Procesos |
| C6 | Prcoesos impresion | 5918:1978 | Estados cargados | Impresión › Procesos |
| C7 | Prcoesos impresion | 5918:2085 | Hoja "Etiqueta única": ZPL M2000 "Sin conexión" | Impresión › Procesos |
| C8 | Prcoesos impresion | 5918:2262 | Zebra ZD620 "Conectando..." | Impresión › Procesos |
| C9 | Prcoesos impresion | 5918:2519 | Zebra ZD620 "Conectada" | Impresión › Procesos |
| C10 | Prcoesos impresion | 5918:2695 | 3 procesos (agrega "Bitácora traspasos") | Impresión › Procesos |
| C11 | Impresoras | 5487:3223 | "MIS IMPRESORAS" (4), "EDITAR", "Nueva conexión" | Impresión › Impresoras |
| C12 | Interfaz principal - NO INICIADO | 5381:890 | "Mis impresoras > Nueva conexión", buscando | Impresión › Nueva conexión |
| C13 | Interfaz principal - NO INICIADO | 5381:1068 | Lista de 9 impresoras en red | Impresión › Nueva conexión |
| C14 | Interfaz principal - NO INICIADO | 6420:21051 | Confirmar Canon Color imageCLASS MF644Cdw | Impresión › Nueva conexión |
| C15 | Interfaz principal - NO INICIADO | 5384:1262 | "Ingrese la IP de la impresora" | Impresión › Nueva conexión |
| C16 | Interfaz principal - NO INICIADO | 6398:20921 | Confirmar Zebra ZD620 | Impresión › Nueva conexión |
| C17 | Impresoras | 5918:2884 | Lista (4) | Impresión › Impresoras |
| C18 | Impresoras | 5918:2997 | Zebra ZD411 "Conectando..." | Impresión › Impresoras |
| C19 | Impresoras | 5918:3126 | Zebra ZD411 "Conectada" | Impresión › Impresoras |
| C20 | Impresoras | 5918:3251 | Modo edición ("LISTO") | Impresión › Impresoras |
| C21 | Impresoras | 5918:3573 | Hoja "Eliminar impresora" | Impresión › Impresoras |
| C22 | Impresoras | 5918:3754 | Lista tras eliminar | Impresión › Impresoras |

Toasts: 5918:5184 "Dirección IP inválida" · 6225:1813 → 5918:5169 "Conexión exitosa" · 5947:9760 "No fue posible conectarse" · 5918:5154 "Impresora eliminada".

### Sección `6353:1789` — "Empty State"

| # | Frame | nodeId | Contenido | Flujo |
|---|---|---|---|---|
| C23 | Procesos impresion | 6354:2147 | "Factura pedidos cliente — Sin asignar" | Impresión › Procesos |
| C24 | Detalle proceso de impresión | 6353:2006 | Imprimiendo desde "Sin asignar" | Impresión › Procesos |
| C25 | Prcoesos impresion | 6354:2244 | Sin impresoras, "Ir a Impresoras" | Impresión › Procesos |
| C26 | Impresoras | 6361:2559 | "Aún no tienes impresoras" | Impresión › Impresoras |
| C27 | Interfaz principal - NO INICIADO | 6362:20391 | "No encontramos impresoras", "Buscar de nuevo" | Impresión › Nueva conexión |

Se ignoran: `Container` (5411:2160) y `Frame 336` (5411:2103), por ser borradores (P3).

---

## 2B. Páginas 🧾 Facturación (`3287:5564`) y 🚚 Embarque (`6157:1119`) — **Incluir (v3, 2026-09-29)**

El usuario definió el flujo completo: **surtido y revisión → factura → embarque → solicitud anticipada de Uber** (esta última queda PENDIENTE de definición). Por eso se agregan estas dos páginas. Capturas en `cache/facturacion/` y `cache/embarque/`.

### Facturación — inicios de flujo: `6004:2304` "Facturación después de surtido-revisión 1", `6004:1658` "Facturación después de revisión 1" · 72 interacciones

| # | Sección | Frame | nodeId | Contenido | Pantalla lógica |
|---|---|---|---|---|---|
| F1 | ERB-47987 Habilitación de tarea de facturación | Finalización Surtido + revisión - Automática | 6004:2304 | Overlay "Finalizar surtido" sobre Surtido (texto verde "Haz surtido y revisado el total de productos solicitados.") | Surtido › Finalizar |
| F2 | ERB-47987 | Finalización Revisión indpendiente - Automática | 6004:1658 | Overlay "Finalizar revisión" (flujo de **revisión independiente**) | **Fuera de alcance** (pertenece a Revisión - Independiente) |
| F3 | ERB-47987 | Interfaz principal revisión | 6004:1813 | Asignación de tareas: "FACTURAR Y EMBARCAR PEDIDO", PedidoID 123456 | Asignación de tareas |
| F4 | ERB-47987 | Interfaz principal revisión | 6588:9874 | Igual que F3, con el caso "¿La tarea ya se finalizó?" → toast "Tarea finalizada" | Asignación de tareas |
| F5 | ERB-47986 Formulario de confirmación de datos del pedido | Interfaz principal - NO INICIADO | 3841:818 | "Datos de la factura": Total $580.00, campos de solo lectura, "Cancelar" / "Generar factura" | Datos de la factura |
| F6 | ERB-47986 | Interfaz principal - NO INICIADO | 6004:5275 | Igual que F5 con scroll: "Impresión" y "Copias" (−/+) | Datos de la factura |
| F7 | ERB-47985 Cambio de dirección de entrega | Interfaz principal - NO INICIADO | 6004:4347 | Lista desplegable "Dirección de entrega" abierta | Datos de la factura |
| F8 | ERB-47985 | Interfaz principal - NO INICIADO | 6004:4498 | Dirección seleccionada | Datos de la factura |
| F9 | ERB-47988 Timbrado y generación de factura | Interfaz principal - NO INICIADO | 6004:6726 | "Generando factura..." con barra de progreso; botones deshabilitados | Datos de la factura (cargando) |
| F10 | ERB-47988 | Interfaz principal - NO INICIADO | 6004:6594 | Formulario tras un error, con toast "Error al generar la factura" (6004:6776) | Datos de la factura (error) |
| F11 | ERB-47984 Impresión y reimpresión de factura | Interfaz principal - NO INICIADO | 6004:7618 | "Folio factura 1099204"; "Reimprimir factura" / "Continuar a embarque" | Datos de la factura (facturada) |

Toasts: 6004:2300 "Surtido y revisión finalizados" · 6004:2302 "Revisión finalizada" (fuera de alcance) · 6588:9846 "Tarea finalizada" · 6004:6776 "Error al generar la factura" · 6004:7878 "Imprimiendo factura" · 6004:8583 "Impresora no configurada" (toast **con botón** "Configurar impresora" → Configuraciones HH) · 6004:8584 "Impresora sin conexión". Rombos: "¿La tarea ya se finalizó?", "¿Se logró generar la factura?", "¿Se logró imprimir la factura?", "Mostrar Toast corrspondiente".

Componentes locales de la página: `INPUT PRUEBA` (3650:1374: Estado × Parpadeo × Lleno), `SELECT CEDIS` (3655:17354: Abierto × Lleno × Estado), `Opción select` (3758:992), `Print Original Container` (3858:1303). Instancias: `Header` **2888:9705** (10), `Botones` remoto (16), `Opción select` (4), toasts, `Alert`, remotos `Checkboxes`/`Radio buttons`. Nodos sueltos (imágenes 1–4, "Módulo de surtido", "Opciones", "Label", "Proceso de timbrado"): borradores o referencias → **Ignorar** salvo que un componente los necesite.

### Embarque — inicios de flujo: `6157:11771` "Nuevo embarque", `6166:14230` "Añadir a embarque" · 43 interacciones

| # | Sección | nodeId | Contenido | Pantalla lógica |
|---|---|---|---|---|
| E1 | Creación de un embarque | 6157:11771 | Datos de la factura (con scroll) → "Continuar a embarque" | Datos de la factura |
| E2 | Creación | 6157:11984 | Overlay "Nuevo embarque": "No existe un embarque activo para este cliente." ✕/✓ | Datos › Nuevo embarque |
| E3 | Creación | 6157:13886 | Overlay "Embarque creado", No. de embarque 147707 | Datos › Embarque creado |
| E4 | Creación | 6178:15585 | Datos de la factura con "No. de embarque 147707"; "Regresar a tareas" / "Reimprimir factura" | Datos de la factura (embarcada) |
| E5 | Añadir a un embarque ya creado | 6166:14230 | Datos de la factura; botones **invertidos** ("Continuar a embarque" / "Reimprimir factura") | Datos de la factura |
| E6 | Añadir | 6166:14379 | Overlay "Agregar embarque": "Existen 2 embarques activos…"; "Nuevo embarque" / "Agregar existente" / ✕ | Datos › Agregar embarque |
| E7 | Añadir | 6166:14971 | Selector "Embarque" vacío; ✓ deshabilitado | Datos › Seleccionar embarque |
| E8 | Añadir | 6166:15187 | Seleccionado "147707 · 1 factura(s) · 2026-09-17 15:48" | Datos › Seleccionar embarque |
| E9 | Añadir | 6178:15407 | Overlay "Factura agregada", 147707 "(2 facturas) 2026-09-17 15:48" | Datos › Factura agregada |
| E10 | Añadir | 6178:15959 | Datos de la factura con No. de embarque; "Regresar a tareas" / "Reimprimir factura" | Datos de la factura (embarcada) |

Instancias: `Header` 2888:9705 (10) y `Botones` remoto (20).

### Pantallas lógicas del flujo completo

`Menú` → `Asignación de tareas` (SURTIDO Y REVISIÓN) → `Surtido de órdenes` (+ overlays de revisión y finalización) → `Asignación de tareas` (FACTURAR Y EMBARCAR PEDIDO) → `Datos de la factura` (+ estados cargando/error/facturada/embarcada y overlays de embarque) → *Solicitud anticipada Uber (PENDIENTE)*. Desde el toast "Impresora no configurada" se entra a `Configuraciones › Impresión`.

---

## 3. Componentes

### 3.1 Usados en Revisión

| Componente | nodeId | Tipo | Ubicación del maestro | Propiedades (valores) | Instancias |
|---|---|---|---|---|---|
| Card revisión aleatoria | 3086:11540 | COMPONENT_SET | Revisión › NO TOCAR | `Surtido` = No iniciado · Completado · Revisado · Parcial · Negado (3086:11541, 11559, 11992, 11577, 11595) | 235 |
| Avance del pedido | 1324:7100 | COMPONENT | Surtido - Un pedido x ronda › NO TOCAR | — | 47 |
| Botones | 9:92 | COMPONENT_SET (**remoto**, librería) | Librería externa | `Bttn Type` = 1/2 Button · Default · Cancel / Error · Accept / Success · Disabled | 32 |
| Notificaciones Toast Verde | 192:16685 | COMPONENT_SET | Surtido - Un pedido x ronda › NO TOCAR | `Toast` = Inicio · Fin | 8 |
| Notificaciones Toast Rojo | 131:6148 | COMPONENT_SET | Surtido - Un pedido x ronda › NO TOCAR | `Property 1` = Default · Variant2 | 1 |

La mayor parte de la UI de Revisión son **frames, no instancias**: Header, barra de escaneo, hojas inferiores, fila de detalle "etiqueta | valor", selector de cantidad −/+, chips "x de n", insignia "R" y tarjetas del Menú. Se construirán como componentes de código y se registrarán en `discrepancias.md` como candidatos, según F4.4.

### 3.2 Usados en Configuraciones HH

| Componente | nodeId | Tipo | Propiedades | Instancias |
|---|---|---|---|---|
| Header | 6640:1866 | COMPONENT | Por confirmar en F3: el maestro muestra "Menú" y ⋮, que las instancias ocultan | 25 |
| Switch | 5170:21980 | COMPONENT_SET | `Property 1` = Default · Variant2 | 8 |
| Estado | 5234:23533 | COMPONENT_SET | `Estado` = Conectada · Sin conexión · Conectando · No disponible | 40 |
| Card configuraciones handheld | 5405:1085 | COMPONENT_SET | `Pressed` = False · True | 2 |
| Card proceso impresión | 5405:1277 | COMPONENT_SET | `Pressed` = False · True | 27 |
| Card mis impresoras | 5411:2186 | COMPONENT_SET | `Pressed` = False · True | 24 |
| print 36×36 · notifications 36×36 · print 20×20 · adf_scanner 20×20 | 5405:1061 · 5405:1081 · 5431:2553 · 5431:2552 | COMPONENT | — | íconos |
| INPUT IP DE IMPRESORA | 5234:24179 | COMPONENT_SET (**remoto**) | `Estado` = Inactivo · Activo · Focus · Error; `Parpadeo` = False · True; `Lleno` = False · True (6 variantes) | 3 |
| Notificaciones Toast Verde / Rojo | 192:16685 / 131:6148 | ver 3.1 | | 2 / 2 |

### 3.3 Resolución de P2 (componentes "sin original")

Los tres componentes que el MCP no encontraba sí tienen original:
- `Notificaciones Toast Verde` y `Notificaciones Toast Rojo` están en la página "📲 Surtido - Un pedido x ronda", sección `NO TOCAR` (237:3050).
- `INPUT IP DE IMPRESORA` es un **componente remoto** de librería (set 5234:24179). `search_design_system` no lo indexa, pero su definición se puede leer con `use_figma`.

Por eso, por ahora, **no es necesario generar componentes nuevos**. La sección `NO TOCAR` de 24:16 tiene además componentes que no se usan en el alcance (`Card` 117:1442, Toast Azul/Amarillo/con Botón, íconos Info/Error/Success/Alert); solo se replicarán si algún componente usado los anida.

---

## 4. Assets (para F2)

- **Fotografías de producto (image fills)**: foco halógeno (1964000), interruptor de llave (2546000), cinta aislante (1394000), cincho plástico (4105000). Se exportarán como PNG @1x/@2x/@3x.
- **Ilustraciones**: fondos de las 4 tarjetas del Menú; marca de agua del Header (portapapeles).
- **Íconos** (Material Symbols como frames/instancias): flecha atrás, ⋮, persona, portapapeles, teclado, check/✕, prohibido, reloj parcial, alerta, `print`, `print_add`, `print_disabled`, `adf_scanner`, `delete`, `edit`, `arrow_forward_ios`, `progress_activity`, `record_voice_over`, `volume_up`, `replay`, `notifications`, `settings`, código de barras, signo "?", `Info`/`Error`/`Success`/`Alert` de los toasts. Se listarán nodo por nodo en `assets.md`.
- **Teclado del sistema** (R22, R23, Revisión › NO TOCAR): es un mock del teclado de Android ("Español (US)"). Por la regla F4.6 **no se renderiza como UI propia**: lo mostrará el teclado real del dispositivo. Se registra como decisión.

## 5. Variables y estilos

Hay estilos y variables locales en todo el archivo (leídos con `use_figma`). **Todas las colecciones tienen un único modo (`Mode 1`), así que solo hay tema claro.**

| Tipo | Cant. | Detalle |
|---|---|---|
| Estilos de color | 26 | Active, Active Text, Inactive Text, Inactive, Negro, Primary/Azul 0·50·100·150·200·250·300, Secondary/Gris, Secondary/Rojo 300, Botones/Amarillo, Botones/Chip negado, Botones/Default, Botones/Disabled, Botones/Error, Botones/Success, Estatus/Sin iniciar, Estatus/Parcialidad, Estatus/Completado, Estatus/Negado, Blanco, Divider |
| Estilos de texto | 11 | Text font/H1·H2·H3 Headline, S1·S2 Subtitle, B1·B2·B3·B4 Body (nombre con errata "Bodyy"), Label, Button font/Bttn. Medium — familia **Roboto** |
| Estilos de efecto | 2 | Modal shadow, Card shadow |
| Estilo remoto | 1 | `Handheld nueva/H3. Headline` (Roboto Bold 18), usado por `Header` |
| Colecciones de variables | 4 | "Un pedido x ronda" (8), **"Revisión en surtido" (7: 3 color, 4 número)**, "Revisión independiente" (26), "Facturación" (3) |

Las variables numéricas de Revisión (`Surtido inicial`, `Revisado inicial`, `Revisado`, `Largo barra 1`) son **variables de prototipo** (contadores y ancho de la barra de progreso) usadas por las interacciones `SET_VARIABLE`/`CONDITIONAL`. En código serán **estado**, no tokens visuales. Valores observados: ver `cache/variable-defs.json`.

## 6. Prototipo (fuente para F5)

A diferencia de lo que suponía FIGMA_REPLICA.md §F5.2, las conexiones de prototipo **sí se pueden leer** con `use_figma` (`node.reactions`, `page.flowStartingPoints`), en solo lectura.

| Página | Inicios de flujo | Interacciones | Disparadores | Acciones |
|---|---|---|---|---|
| Revisión | 7 (uno por sección) | 374 | ON_CLICK 354 · AFTER_TIMEOUT 20 | NAVIGATE 339 · CONDITIONAL 30 · OVERLAY 16 · CHANGE_TO 9 · SET_VARIABLE 4 |
| Configuraciones HH | 3 | 158 | — | CHANGE_TO 94 · NAVIGATE 34 · OVERLAY 1 |

Transiciones más usadas en Revisión: SMART_ANIMATE 744 ms QUICK (160), SMART_ANIMATE 1022 ms GENTLE (112), SMART_ANIMATE 300 ms EASE_IN (27), MOVE_IN 300/600/625/1022 ms. Se registrarán como tokens `motion`.

En F5, `flujos.md` se generará **desde estas interacciones** (fuente "Figma") y no se deducirá. Solo lo que no tenga interacción quedará como PENDIENTE.

## 7. Estimación de llamadas y lotes

Llamadas usadas en F0: ~75 (incluye la revisión de Revisión). Muchas lecturas se pueden agrupar en una sola llamada `use_figma` (varios nodos por script), lo que reduce el total.

| Lote | Alcance | Llamadas aprox. |
|---|---|---|
| 1 | F1 tokens (estilos y variables de todo el archivo en 1–2 `use_figma`) + F2 assets de Revisión | ~30 |
| 2 | F3 componentes de Revisión (5 + ~8 candidatos locales) | ~40 |
| 3 | F4 Revisión §1.1–1.3 (29 frames) | ~60 |
| 4 | F4 Revisión §1.4–1.7 (38 frames) | ~75 |
| 5 | F5 flujos de Revisión (lectura de `reactions` por sección) + F6 | ~15 |
| 6 | Configuraciones HH: F2–F6 (27 frames + 10 componentes) | ~90 |
| | **Total** | **~310** |

Los 67 frames de Revisión se reducen a unas 4 pantallas lógicas con sus overlays y estados. En F4 se pedirá `get_design_context` una vez por pantalla u overlay distinto, y los demás estados se verificarán con captura de pantalla.

## 8. Pendientes

Ninguna pregunta bloquea F1. Queda solo la **aprobación de este inventario (v2)**.
