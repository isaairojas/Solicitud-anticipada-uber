/**
 * Datos simulados de impresoras y procesos. Textos y estados tomados literalmente de Figma
 * (ERB-51055, sección 5342:843).
 */
import type { EstadoImpresora } from '@ds/components/atoms/StatusDot/StatusDot';

export type TipoImpresora = 'etiquetas' | 'documento';

export type Impresora = {
  id: string;
  nombre: string;
  estado: EstadoImpresora;
  tipo: TipoImpresora; // afecta el ícono (adf_scanner vs print)
};

export type Proceso = {
  id: string;
  nombre: string;
  /** Impresora asignada (id) o null si no hay asignación. */
  impresoraId: string | null;
};

/** Lista inicial (5487:3223, Figma "Impresoras"). */
export const IMPRESORAS_INICIALES: Impresora[] = [
  { id: 'zpl-m2000', nombre: 'ZPL M2000', estado: 'sin-conexion', tipo: 'etiquetas' }, // figma 5918:1978: rojo
  { id: 'zebra-zd620', nombre: 'Zebra ZD620', estado: 'conectada', tipo: 'etiquetas' },
  { id: 'hp-m1800', nombre: 'HP Color LaserJet Pro M1800', estado: 'conectada', tipo: 'documento' },
  { id: 'canon-mf644', nombre: 'Canon Color imageCLASS MF644Cdw', estado: 'sin-conexion', tipo: 'documento' },
  { id: 'dymo-450', nombre: 'Dymo LabelWriter 450', estado: 'conectada', tipo: 'documento' },
];

export const PROCESOS_INICIALES: Proceso[] = [
  { id: 'etiqueta-unica', nombre: 'Etiqueta única', impresoraId: 'zpl-m2000' },
  { id: 'factura-pedidos', nombre: 'Factura pedidos cliente', impresoraId: 'hp-m1800' },
];

/** Impresoras adicionales encontradas en la red (5381:1068). */
export const IMPRESORAS_RED = [
  { id: 'zpl-m2000', nombre: 'ZPL M2000' },
  { id: 'hp-m1800', nombre: 'HP Color LaserJet Pro M1800' },
  { id: 'canon-mf644', nombre: 'Canon Color imageCLASS MF644Cdw' },
  { id: 'dymo-450', nombre: 'Dymo LabelWriter 450' },
  { id: 'zebra-zd411', nombre: 'Zebra ZD411' },
  { id: 'zebra-zd411-4', nombre: 'Zebra ZD411-4' },
  { id: 'samsung-m2020w', nombre: 'Samsung Xpress M2020W' },
  { id: 'lexmark-mb2442', nombre: 'Lexmark MB2442adw' },
  { id: 'kyocera-p5026', nombre: 'Kyocera ECOSYS P5026cdw' },
];
