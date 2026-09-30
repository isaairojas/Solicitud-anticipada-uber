/**
 * Reglas de negocio de Solicitud anticipada de Uber.
 * Fuente: docs/tecnico/uber.md (ERB-53024).
 */

export const REGLAS_UBER = {
  distanciaMaxKm: 24,
  montoMaxCredito: 15_000,
  montoMaxCash: 1_700,
  /** Monto mínimo del pedido para ofrecer envío por Uber (no vale la pena un envío pagado
      con un ticket muy pequeño). Se aplica al monto real del pedido (piezas × precio unitario). */
  montoMinimo: 300,
  /** Concepto de pago Uber Cash */
  conceptoUberCash: 55,
} as const;

/** Estados de embarque válidos como candidatos a Uber (Monitor 1 de embarque, Exodus Sucursales):
    el embarque debe estar recién creado, sin documentar y sin paquetería asignada — todavía no salió
    para reparto propio. En cuanto se documenta o se le asigna paquetería, deja de ser candidato. */
export const ESTADO_EMBARQUE_CANDIDATO = 'Creado — sin documentar, sin paquetería';

export type TipoPago = 'credito' | 'uber-cash';

export type TipoVehiculo = 'moto' | 'coche';

/**
 * Restricciones físicas por tipo de vehículo.
 * Los valores exactos deben coincidir con los de Uber Direct; estos son valores razonables como base.
 */
export const RESTRICCIONES_VEHICULO: Record<TipoVehiculo, { pesoMax: number; descripcion: string }> = {
  moto: { pesoMax: 22, descripcion: 'Paquetes pequeños' },
  coche: { pesoMax: 100, descripcion: 'Paquetes grandes / pesados' },
};

export type SucursalConfig = {
  habilitadaUber: boolean;
  habilitadaUberCash: boolean;
  /** Distancia al destino en km (calculada por el catálogo de geolocalización). */
  distanciaKm: number;
};

export type CandidaturaInput = {
  sucursal: SucursalConfig;
  monto: number;
  tipoPago: TipoPago;
};

export type CandidaturaResultado =
  | { candidato: true }
  | { candidato: false; motivo: 'sucursal' | 'distancia' | 'monto-credito' | 'monto-cash' | 'sucursal-cash' | 'monto-minimo' };

/**
 * Evalúa si un pedido es candidato para el ofrecimiento de solicitud anticipada.
 * Cumple todos los criterios de ERB-53024 § "Evaluación de candidatura del pedido".
 */
export function evaluarCandidatura({ sucursal, monto, tipoPago }: CandidaturaInput): CandidaturaResultado {
  if (!sucursal.habilitadaUber) return { candidato: false, motivo: 'sucursal' };
  if (sucursal.distanciaKm > REGLAS_UBER.distanciaMaxKm) return { candidato: false, motivo: 'distancia' };
  if (monto < REGLAS_UBER.montoMinimo) return { candidato: false, motivo: 'monto-minimo' };
  if (tipoPago === 'credito' && monto > REGLAS_UBER.montoMaxCredito) return { candidato: false, motivo: 'monto-credito' };
  if (tipoPago === 'uber-cash') {
    if (!sucursal.habilitadaUberCash) return { candidato: false, motivo: 'sucursal-cash' };
    if (monto > REGLAS_UBER.montoMaxCash) return { candidato: false, motivo: 'monto-cash' };
  }
  return { candidato: true };
}

export type DatosContactoUber = {
  nombre: string;
  telefono: string;
  referencias?: string;
  departamento?: string;
  descripcion?: string;
  tipoVehiculo: TipoVehiculo;
};

export type SolicitudUber = DatosContactoUber & {
  id: string;
  clienteId: string;
  direccion: string;
  embarque: string;
  factura: string;
  monto: number;
  tipoPago: TipoPago;
  creadaEn: string;
  estado: 'activa' | 'cancelada' | 'entregada';
};
