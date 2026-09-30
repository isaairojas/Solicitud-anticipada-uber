# Referencias técnicas (lógica de negocio)

Fuente de verdad **visual**: Figma (FIGMA_REPLICA.md). Este documento recoge solo la **lógica técnica** tomada de los proyectos de referencia que indicó el usuario (2026-09-29). Si una regla de aquí contradice lo que muestra un frame de Figma, **manda Figma para la UI** y la regla se usa para el comportamiento no visible.

| Proyecto | Ubicación | Qué es |
|---|---|---|
| Revision-HH | `GIT SUCURSALES/Revision-HH` (copia local vacía; contenido en `github.com/isaairojas/Revision-HH`) | Prototipo HTML/JS de "Revisión de órdenes" (HU ERB-45802 / ERB-45803): escaneo, sonidos, discrepancias |
| EXODUS_HANDHELD | `GIT SUCURSALES/EXODUS_HANDHELD` | Simulador web de Exodus HandHeld v1.0.101 (VB.NET), extraído del ejecutable: pantallas, SP, tablas y flujos reales del surtido |

## Flujo objetivo de la app (definido por el usuario)

1. **Surtido y revisión** de un pedido (Figma: 🔎 Revisión - Durante el surtido)
2. **Generación de la factura** (Figma: 🧾 Facturación)
3. **Creación del embarque** (Figma: 🚚 Embarque)
4. **Solicitud anticipada de Uber**: **PENDIENTE**, el usuario la definirá al terminar los pasos 1–3.

## 1. Códigos y etiquetas (lector)

| Regla | Detalle | Fuente |
|---|---|---|
| Código de producto | **7 dígitos** numéricos (`^\d{7}$`), p. ej. `1964000`, `2546000` | Revision-HH `app.js` · EXODUS `PK_Productos.No_Producto` |
| Etiqueta APYMSA | **18 dígitos** (`^\d{18}$`): pos. 1–7 producto · 8–13 cantidad (6 díg.) · 14–18 peso (5 díg.) | Revision-HH `analisis_hu.md` · EXODUS `Surtido::Generar_Etiqueta_18digitos` |
| Cantidad por etiqueta | `parseInt(codigo.substring(7, 13)) \|\| 1` | Revision-HH `procesarScanRevision` |
| Formato inválido | Ni 18 ni 7 dígitos → sonido de error + mensaje de formato | Revision-HH |
| Código ajeno | Código válido que no pertenece al pedido → sonido de error | Revision-HH (sonido 2) |
| Misceláneo | Producto marcado como misceláneo: se acepta el código de 7 dígitos y se captura la cantidad manualmente | Revision-HH · Figma rombo "¿Es misceláneo?" |
| Producto normal con 7 dígitos | En revisión se pide escanear la etiqueta de 18 dígitos | Revision-HH |
| Lector | Lector HID (Zebra) que escribe como teclado. El campo usa `inputMode="none"` y el botón de teclado alterna a `inputMode="text"` para captura manual | Revision-HH `toggleKeyboard` · Figma botón ⌨ de la barra de escaneo |
| Antirrebote | 300 ms tras la última tecla antes de procesar | Revision-HH `debounceScanRevision` |
| Comandos del surtido legado | `NEGAR` (manda la partida a backorder) y `CAMBIAR CAJA` | EXODUS `flows.js` (solo referencia) |

## 2. Sonidos y voz

- `beep-ok.mp3` (acierto) y `beep-error.mp3` (error o sobrante). Se reproducen con Web Audio, con respaldo en `<audio>`, y el audio se desbloquea en cada gesto (necesario en Android/Zebra). Fuente: Revision-HH.
- La voz ("Repetir audio" del menú contextual de Surtido y "Lectura de elementos" de Configuraciones › Sonido) equivale a SAPI en el legado. En la PWA se usará `speechSynthesis` (es-MX). Los textos exactos del dictado siguen **PENDIENTES** (no están en Figma).
- Los switches de Configuraciones › Sonido ("Lectura de elementos" / "Alertas sonoras", por tipo de tarea) habilitan o deshabilitan voz y sonidos.

## 3. Modelo de datos (nombres reales del legado)

| Entidad | Tabla | Campos clave |
|---|---|---|
| Pedido | `PK_Pedidos_Encabezado` | `Id_Pedido`, `Id_Status` (**4** por surtir → **5** surtido), `Cliente`, `Salida` |
| Partida | `PK_Pedidos_Partidas` | `No_producto`, `Cantidad`, `Cantidad_Surtida`, `Id_Status` (**9** = negado/backorder), `Id_Caja` |
| Producto | `PK_Productos` | `No_Producto`, `Desc_Producto`, `Existencia`, `Multiplo` (múltiplo de empaque), `Peso`, ubicación (`Id_Rack`, `Id_Charola`) |
| Contenedor | `Contenedores`, `PK_RelPedido_Caja` | `Id_Caja`, `EnUso` |

SP de referencia: `PK_Siguiente_PedidoPaquete`, `Usp_Almacen_SurtirPedido`, `PK_Actualiza_Partidas_Surtidas`, `PK_Surtido_Pedido_Caja`, `Usp_Almacen_RevisionPedido`, `PK_Actualiza_Peso_contenedor`, `Surtido::AgregarMonitoreoPaquete` (monitoreo del paquete). La PWA trabajará con **datos simulados** (mocks) que respetan estos nombres; la integración real está fuera de alcance mientras no se defina.

## 4. Estados de la partida en Surtido/Revisión (Figma + referencias)

Variantes del componente `Card revisión aleatoria` (fila de producto): **No iniciado · Parcial · Completado · Revisado · Negado**. Contadores del encabezado "Avance del pedido": Completado · Negado · Parcial · Pendientes. La insignia **"R"** indica "revisado". Si cambia la cantidad surtida, la revisión se **restablece** y se quita la "R" (sección Figma "Revisión restablecida").

## 5. Reglas de la revisión durante el surtido (Figma)

Al completar el surtido de una partida se decide el tipo de revisión (rombos de la sección 3048:10013):

1. ¿Es misceláneo? → **Sí**: revisión simplificada (confirmar con ✓).
2. ¿El múltiplo de empaque es mayor que la cantidad por evento de venta? (p. ej. caja de 50 que se vende por pieza) → **Sí**: simplificada.
3. ¿El costo unitario es menor a $100? → **Sí**: simplificada.
4. En cualquier otro caso: **escaneo forzoso** de la etiqueta de 18 dígitos, con progreso `x / n`.

En el legado, el diagrama `image 5` (3232:3916) dice "Exigir el escaneo obligatorio de la etiqueta de 18 dígitos para completar la revisión".

La tabla del **botón dinámico** del Detalle de producto está en `image 4` (3232:3913): bandera de revisión × cantidad surtida → leyenda, estado y acción. Se transcribirá en `docs/figma/flujos.md` durante F5.

## 6. Dispositivo

- Handheld Android (Zebra) con lector integrado. Frame de diseño: **430×932**.
- PWA: sin barra de estado propia, pantalla completa y orientación vertical.
