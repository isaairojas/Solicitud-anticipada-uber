/**
 * Datos simulados del pedido. Textos y cantidades tomados literalmente de Figma
 * (🔎 Revisión - Durante el surtido, frames 3048:10138, 3091:14568, 3316:18734, 3126:14858, 3062:12611).
 * Nombres de campos alineados al modelo legado (docs/tecnico/referencias.md §3).
 */
import foto1394000 from '@assets/images/producto-1394000.jpg';
import foto1964000 from '@assets/images/producto-1964000.png';
import foto2546000 from '@assets/images/producto-2546000.jpg';
import foto4105000 from '@assets/images/producto-4105000.jpg';

export type TipoRevision = 'forzosa' | 'simplificada';

export type ProductoPedido = {
  codigo: string;
  descripcion: string;
  foto?: string;
  /** Ubicación mostrada en la fila: Planta | Pasillo | Torre | Nivel */
  ubicacion: [string, string, string, string];
  /** Valores del bloque de Detalle de producto */
  planta: string;
  pasillo: string;
  torre: string;
  nivel: string;
  existencia: number;
  solicitado: number;
  /**
   * Reglas de revisión (rombos de 3048:10013): misceláneo, múltiplo de empaque > cantidad por evento
   * o costo unitario < $100 → revisión simplificada; si no, escaneo forzoso.
   */
  esMiscelaneo: boolean;
  multiploMayorQueEvento: boolean;
  costoUnitario: number;
  /** Precio unitario de venta (para calcular el monto del pedido en el ofrecimiento de Uber). */
  precioUnitario: number;
};

const ubicacion: ProductoPedido['ubicacion'] = ['Planta baja', 'Pasillo 18', 'Torre 5', 'Nivel 1'];
const base = { ubicacion, planta: 'Planta baja', pasillo: '18', torre: '5', nivel: '1' };

export const PEDIDO_ID = '123456';

/**
 * Precios y cantidades pensados para que el total del pedido sume exactamente $1,000 MXN
 * (base del ofrecimiento de Uber). Si el operador niega todos los productos y deja solo uno,
 * la mayoría cae bajo el mínimo de $150 y el pedido deja de ser candidato — pensado para
 * demostrar la regla `montoMinimo` de `REGLAS_UBER` en la demo.
 */
export const PRODUCTOS: ProductoPedido[] = [
  {
    ...base,
    codigo: '1394000',
    descripcion: 'CINTA AISLANTE NEGRO 60 PLASTICA VERZE 20 U/L',
    foto: foto1394000,
    existencia: 8, // PENDIENTE: Figma no muestra la existencia de 1394000
    solicitado: 10,
    esMiscelaneo: true, // revisión simplificada en 3316:18734
    multiploMayorQueEvento: false,
    costoUnitario: 0,
    precioUnitario: 30, // 10 × $30 = $300
  },
  {
    ...base,
    codigo: '2546000',
    descripcion: 'INTERRUPTOR LLAVE 11 TIPO UNIVERSAL CAMIONES 60-79 POLLAK 31',
    foto: foto2546000,
    existencia: 8,
    solicitado: 5,
    esMiscelaneo: false, // escaneo forzoso en 3091:15591
    multiploMayorQueEvento: false,
    costoUnitario: 100,
    precioUnitario: 40, // 5 × $40 = $200
  },
  {
    ...base,
    codigo: '3658201',
    descripcion: 'SOLENOIDE MARCHA DELCO 29MT 12V (10515838) BRASIL',
    existencia: 4,
    solicitado: 2,
    esMiscelaneo: false, // escaneo forzoso (Normal)
    multiploMayorQueEvento: false,
    costoUnitario: 100,
    precioUnitario: 175, // 2 × $175 = $350
  },
  {
    ...base,
    codigo: '1964000',
    descripcion: 'FOCO HALOGENO H4/9003 TRANSPARENTE 12V 100/90 1 P43',
    foto: foto1964000,
    existencia: 8,
    solicitado: 2,
    esMiscelaneo: false, // escaneo forzoso en 3058:12380
    multiploMayorQueEvento: false,
    costoUnitario: 100,
    precioUnitario: 50, // 2 × $50 = $100 → por debajo del mínimo si es el único surtido
  },
  {
    ...base,
    codigo: '2655000',
    // PENDIENTE: Figma no muestra descripción ni foto de 2655000; texto del proyecto de referencia Revision-HH
    descripcion: 'LIMPIADOR CARBURADOR Y CUERPO DE ACELERACION EN AEROSOL',
    existencia: 4,
    solicitado: 1,
    esMiscelaneo: true,
    multiploMayorQueEvento: false,
    costoUnitario: 0,
    precioUnitario: 25, // 1 × $25 = $25 → NO candidato si es el único
  },
  {
    ...base,
    codigo: '4105000',
    descripcion: 'TERMINAL INSTALACION REDONDA ZINC ROJO 5/32 IMPORTADO R-5/32"',
    foto: foto4105000,
    existencia: 4,
    solicitado: 2,
    esMiscelaneo: true, // revisión simplificada en 3126:14858
    multiploMayorQueEvento: false,
    costoUnitario: 0,
    precioUnitario: 12.5, // 2 × $12.50 = $25 → NO candidato si es el único
  },
];

/** Promoción AxB (sección 4582:20083). Códigos de la promoción mostrados en 4582:23615. */
export const PROMOCIONES: { codigos: string[] }[] = [{ codigos: ['1394000', '1964000'] }];

export const EMPLEADO = { id: '9029', nombre: 'JUAN ANTONIO GUERRERO MEDINA' };

export const TAREAS = {
  surtido: {
    actividad: 'SURTIDO Y REVISIÓN PEDIDO CLIENTE', // 3048:10064
    documentoLabel: 'DocumentoID',
    documento: 'SURTIR PEDIDO CLIENTE', // 3048:10091
  },
  /** ERB-47987: Surtido + revisión unificados (variante 6004:2304 en Figma). El operador surte y revisa
      en un solo paso; termina con el botón "Finalizar" que salta a la facturación. */
  surtidoUnificado: {
    actividad: 'SURTIDO Y REVISIÓN UNIFICADA',
    documentoLabel: 'DocumentoID',
    documento: 'SURTIR Y REVISAR PEDIDO CLIENTE',
  },
  facturacion: {
    actividad: 'FACTURAR Y EMBARCAR PEDIDO', // Facturación 6004:1813
    documentoLabel: 'PedidoID',
    documento: PEDIDO_ID,
  },
  fecha: '31/08/2023',
  hora: '11:30 a.m.',
};
