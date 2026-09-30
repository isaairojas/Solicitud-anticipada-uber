/**
 * Datos simulados para el flujo de Uber.
 * Se toman los ejemplos de las capturas del sistema legado que compartió el usuario
 * (Confirmar solicitud: Embarque 90055, ARRAYAN 1297, RAMIREZ CAMACHO ADRIAN).
 */
import type { SolicitudUber, SucursalConfig, TipoPago } from '../domain/uber';

export const SUCURSAL_ACTUAL: SucursalConfig = {
  habilitadaUber: true,
  habilitadaUberCash: true,
  distanciaKm: 18, // ejemplo ERB-53024 §Escenario 1
};

export const TIPO_PAGO_ACTUAL: TipoPago = 'credito';

/**
 * Historial de solicitudes previas (para la precarga por cliente + dirección).
 * Basado en la captura del sistema legado del usuario.
 */
export const HISTORIAL_UBER: SolicitudUber[] = [
  {
    id: 'uber-98453',
    clienteId: '536983',
    direccion: 'Huerto 221 Int. 0, Colonos de Tesistán, 45200 Zapopan, Jalisco.',
    embarque: '90054',
    factura: '499833',
    monto: 8500,
    tipoPago: 'credito',
    nombre: 'FRANCISCO JAVIER HERNANDEZ MELENDREZ',
    telefono: '33-1234-5678',
    referencias: 'Casa color blanco con portón negro',
    departamento: '',
    descripcion: 'Varios',
    tipoVehiculo: 'moto',
    creadaEn: '2026-09-28 14:22',
    estado: 'entregada',
  },
  // ejemplo de la captura del usuario (Embarque 90055)
  {
    id: 'uber-98454',
    clienteId: '812734',
    direccion: 'ARRAYAN 1297',
    embarque: '90055',
    factura: '499834',
    monto: 4200,
    tipoPago: 'credito',
    nombre: 'RAMIREZ CAMACHO ADRIAN',
    telefono: '33-5555-1234',
    referencias: '',
    departamento: 'Interior',
    descripcion: 'Varios',
    tipoVehiculo: 'moto',
    creadaEn: '2026-09-29 09:15',
    estado: 'entregada',
  },
];

/** Solicitudes o embarques activos para detectar consolidación (cliente + dirección → solicitud CREADA). */
export const ACTIVOS_POR_CLIENTE_DIRECCION: Record<string, { tipo: 'solicitud' | 'embarque'; id: string }> = {
  // Cliente 536983 ya tiene una solicitud CREADA (no enviada aún a Uber) para Huerto 221 →
  // dispara el modal de consolidación cuando se intenta generar otra solicitud a la misma dirección.
  '536983|Huerto 221 Int. 0, Colonos de Tesistán, 45200 Zapopan, Jalisco.': { tipo: 'solicitud', id: 'uber-98455' },
};

export function precargar(clienteId: string, direccion: string) {
  return HISTORIAL_UBER.filter((s) => s.clienteId === clienteId && s.direccion === direccion)
    .sort((a, b) => (a.creadaEn > b.creadaEn ? -1 : 1))[0];
}

export function tieneActivoParaCliente(clienteId: string, direccion: string) {
  return ACTIVOS_POR_CLIENTE_DIRECCION[`${clienteId}|${direccion}`];
}
