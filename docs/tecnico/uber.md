# Solicitud anticipada de Uber (ERB-53024)

Fuente: `Downloads/ERB-53024.doc` (Historia de Usuario, 2026-09-29) + capturas del sistema legado adjuntas por el usuario. Reemplaza el flujo anterior de Exodus Sucursales por un ofrecimiento anticipado desde la HH.

## Cuándo dispara

Al **finalizar la creación del embarque** (después de "Continuar a embarque" → "Nuevo embarque" / "Embarque creado" en el flujo de Facturación). No aplica desde surtido ni revisión: solo en documentación/embarque, según el criterio funcional "Puntos de disparo".

## Reglas de candidatura (todas deben cumplirse)

| Regla | Valor | Fuente en código |
|---|---|---|
| Distancia sucursal → destino | ≤ 24 km | `esCandidato()` en `src/domain/uber.ts` |
| Monto (crédito) | ≤ $15,000 MXN | ídem |
| Monto (Uber Cash) | ≤ $1,700 MXN | ídem |
| Sucursal habilitada para Uber | true en BD | mock en `src/mocks/uber.ts` |
| Sucursal habilitada para Uber Cash | true en BD (solo si aplica) | ídem |

Si alguna falla → no se muestra el ofrecimiento; el flujo de embarque continúa sin interrupción (criterio "El sistema no deberá presentar el ofrecimiento").

## Flujo

```
Embarque creado / Factura agregada
 └─ ¿candidato para Uber?
     ├─ NO → continúa a "Regresar a tareas"
     └─ SI → ofrecimiento
              ├─ Rechazar → continúa a "Regresar a tareas" (reaparece en el siguiente disparo)
              └─ Generar solicitud
                   ├─ ¿hay solicitud/embarque activo con mismo cliente + dirección?
                   │   ├─ SI → aviso "Consolida en Exodus Sucursales" con opciones "Generar individual" / "Cancelar"
                   │   └─ NO → formulario
                   └─ Formulario
                        ├─ Dirección de entrega (solo lectura, de EPICO)
                        ├─ Nombre de quién recibe (precargado, editable)
                        ├─ Teléfono (precargado, editable)
                        ├─ Referencias (opcional)
                        ├─ Dpto/Oficina/Piso (opcional)
                        ├─ Descripción del paquete (opcional)
                        └─ Tipo de vehículo: Moto | Coche
                             └─ Aceptar → Solicitud creada + toast + "Regresar a tareas"
```

## Precarga de contacto

Al abrir el formulario, se buscan solicitudes previas del mismo cliente + dirección. Si existen → precarga nombre, teléfono, referencias y dpto/oficina de la más reciente. Si no → campos vacíos.

**La descripción del paquete SIEMPRE inicia vacía** (criterio del usuario), aun con precarga: la debe capturar el operador para el envío actual.

## Ofrecimiento (candidatura confirmada)

Además de la copia del ofrecimiento, muestra en un panel gris:

| Campo | Fuente |
|---|---|
| Cliente | `FACTURACION.cliente` (`FRANCISCO JAVIER HERNANDEZ MELENDREZ`) |
| Total de artículos | `totalArticulos(pedido)` — suma de piezas surtidas no negadas |
| Distancia | `SUCURSAL_ACTUAL.distanciaKm` |
| Total | `FACTURACION.total` |

## Tipos de vehículo (mock; ajustar a las restricciones reales de Uber Direct)

| Tipo | Peso máximo | Uso típico |
|---|---|---|
| Moto | 22 kg | Paquetes pequeños, cajas menores |
| Coche | 100 kg | Cajas grandes, piezas voluminosas |

El usuario elige visualmente por tipo. Solo se muestra el **peso máximo**; las dimensiones no se exponen en la UI (criterio del usuario). La solicitud enviada a Uber Direct usa el tipo de vehículo elegido; Uber Direct impone sus propias volumetrías.

## Solicitud creada (pantalla final)

| Campo | Fuente |
|---|---|
| No. de solicitud | Mock 5 dígitos (`nuevoNumeroSolicitud()`). En producción viene de Uber Direct. |
| No. de pedido | `PEDIDO_ID` (mocks/pedido) |
| Embarque | `factura.embarque.numero` |
| Factura | `factura.folio` |
| Vehículo | Tipo seleccionado en el formulario |

## Modalidad Uber Cash

- Concepto de pago 55.
- Monto máximo $1,700 MXN.
- Sucursal debe estar habilitada específicamente para Uber Cash.
- Si no cumple → no se muestra el ofrecimiento.

## Estado y cancelación

- La solicitud queda **asociada al embarque + pedido** origen.
- La cancelación manual se hace **fuera de la HH**, desde el módulo de seguimiento en Exodus Embarques. **No implementada en la HH** (criterio informativo).
