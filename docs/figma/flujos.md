# Flujos de navegación

Fuente: interacciones reales del prototipo de Figma (`node.reactions`, `page.flowStartingPoints`), leídas con `use_figma` en solo lectura. Complementado con reglas técnicas de Revision-HH y EXODUS_HANDHELD (`docs/tecnico/referencias.md`).

## Flujo global

```
Menú
 └─ Tareas
     └─ Asignación de tareas (SURTIDO Y REVISIÓN PEDIDO CLIENTE)
         ✓ → Surtido de órdenes
              ├─ escanear código → suma cantidad al producto
              ├─ tap fila → Detalle del producto
              ├─ overlay Revisión (auto al completar surtido)
              ├─ ⋮ → Menú (Repetir audio / Finalizar surtido)
              │   └─ Finalizar surtido → Parciales / Finalizar
              └─ auto-finalización si todo revisado
                  └─ Toast "Surtido y revisión finalizados"
                      └─ Asignación de tareas (FACTURAR Y EMBARCAR PEDIDO)
                          ✓ → Datos de la factura
                               ├─ Generar factura → generando → facturada (+ toast)
                               │                       o error (+ toast)
                               ├─ Reimprimir factura → toast
                               └─ Continuar a embarque
                                    ├─ (sin activos) → Nuevo embarque → Embarque creado
                                    └─ (con activos) → Agregar embarque
                                         ├─ Nuevo embarque → Embarque creado
                                         └─ Agregar existente → Selector → Factura agregada
                                              └─ Regresar a tareas
                                                  └─ Uber (PENDIENTE de definir)

Configuraciones (accesible desde toast "Impresora no configurada")
 ├─ Impresión
 │   ├─ Procesos impresión → tap → detalle de proceso
 │   └─ Impresoras → Editar / Nueva conexión
 └─ Sonidos → 4 switches (Surtido/Revisión × Lectura/Alertas)
```

## Interacciones por página (fuente: `page.reactions`)

| Página | Inicios | Interacciones | Disparadores | Acciones |
|---|---|---|---|---|
| 🔎 Revisión - Durante el surtido | 7 | 374 | ON_CLICK 354 · AFTER_TIMEOUT 20 | NAVIGATE 339 · CONDITIONAL 30 · OVERLAY 16 · CHANGE_TO 9 · SET_VARIABLE 4 |
| 🧾 Facturación | 2 | 72 | — | NAVIGATE + OVERLAY |
| 🚚 Embarque | 2 | 43 | — | NAVIGATE + OVERLAY |
| ⚙️ Configuraciones HH | 3 | 158 | — | CHANGE_TO 94 · NAVIGATE 34 · OVERLAY 1 |

## Rutas en la app (`src/App.tsx`)

| Ruta | Componente | Escenario URL |
|---|---|---|
| `/menu` | `Menu` | — |
| `/tareas` | `AsignacionTareas` | `?escenario=inicial` |
| `/surtido` | `SurtidoOrdenes` | `?escenario=inicial` / `?escenario=parcial-2546000` / `?escenario=revisado-1964000` |
| `/surtido/producto/:codigo` | `DetalleProducto` | `?escenario=parcial-2546000` |
| `/facturacion` | `DatosFactura` | `?escenario=facturacion` (formulario) / `factura-facturada` / `factura-embarcada` |
| `/embarque` | `DatosFactura` | alias (los modales se abren desde el estado facturada) |
| `/configuraciones` | `Configuraciones` | — |
| `/configuraciones/sonido` | `Sonido` | — |
| `/configuraciones/impresion` | `Impresion` | — |

## Transiciones (motion tokens)

Extraídas de `node.reactions.transition`, agregadas en `src/design-system/tokens/tokens.css`:

- `--easing-spring-quick` — 744 ms (170 usos en Revisión, hoja inferior de modales)
- `--easing-spring-gentle` — 1022 ms (112 usos, cambios de pantalla suaves)
- `--easing-spring-slow` — 625 ms (7 usos, aparición de menú contextual)
- `--easing-ease-in`, `--easing-ease-out`, `--easing-ease-in-and-out` — para `CHANGE_TO` y `MOVE_IN`
- Duraciones directas: 200, 300, 600, 625, 744, 802, 992, 1022, 3000, 3500, 4000, 10000 ms

## Tiempos clave del flujo (AFTER_TIMEOUT)

| Origen | Tiempo | Destino | Regla en código |
|---|---|---|---|
| Surtido completo → Revisión | 400 ms | Modal Revisión aleatoria | `SurtidoOrdenes.revisarSiCompleta` |
| Revisión 5/5 → Detalle o pantalla siguiente | 500 ms | + toast "Revisión completa" | `SurtidoOrdenes.revisionCompletada` |
| Detalle Revisión 4/4 → pantalla anterior | 800 ms | + toast | `DetalleProducto` (línea `setTimeout(800)`) |
| Todo surtido y revisado → Finalizar | 3000 ms | Modal Finalizar surtido y revisión | `SurtidoOrdenes.useEffect(listo)` |
| Generando factura → facturada/error | 2500 ms | según `?generar=error` | `DatosFactura.generar` |

## Reglas de negocio (docs/tecnico/referencias.md)

- **Etiqueta APYMSA** (18 dígitos): 7 producto + 6 cantidad + 5 peso.
- **Código directo** (7 dígitos): abre captura manual de cantidad.
- **Códigos legado** `NEGAR` / `CAMBIAR CAJA`: en el prototipo del handheld nuevo los reemplazan la fila (tap) y el botón dinámico del Detalle.
- **Botón dinámico del Detalle** (tabla `image 4` = 3232:3913, 7 casos): `Aceptar` + `Revisar producto` / `Negar producto` según bandera de revisión y cantidad surtida.
- **Sonidos**: `beep-ok.mp3` (acierto), `beep-error.mp3` (código inválido o ajeno). Web Audio + fallback `<audio>`. Web Speech API para dictado (es-MX).
- **Promoción AxB incompleta**: si al finalizar hay un código negado con otros surtidos de la misma promoción → modal "Finalizar surtido" con opciones "Completar" / "Eliminar productos".

## PENDIENTES

- Detalle de proceso de impresión (frame 6353:2006): tap en un proceso desde `Impresion`. No implementado en esta pasada.
- Modales de "Nueva conexión" (5381:890, 5384:1262 IP manual) y "Eliminar impresora" (5918:3573).
- Dictado por voz (contenido exacto de los textos que se leen en cada pantalla) — no documentado en Figma; usa fallback genérico basado en códigos y ubicaciones.
- Solicitud anticipada de Uber — a definir por el usuario al terminar los pasos 1–3.
