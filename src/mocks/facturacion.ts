/**
 * Datos simulados de facturación y embarque.
 * Textos y valores tomados literalmente de Figma (🧾 Facturación 3287:5564 y 🚚 Embarque 6157:1119).
 */
export const FACTURACION = {
  /** Total nominal del pedido (10×$30 + 5×$40 + 2×$175 + 2×$50 + 1×$25 + 2×$12.50 = $1,000). */
  total: 1_000.0,
  empleado: '200655 | MONTSERRAT PENICHE VILLANUEVA',
  pedido: '#123456 | Mostrador',
  formaPago: 'Factura | Venta a crédito',
  cliente: '536983 | FRANCISCO JAVIER HERNADEZ  MELENDREZ', // doble espacio como Figma
  metodoEntrega: 'Envío a domicilio',
  direccionFiscal: 'Huerto 221 Int. 0, Colonos de Tesistán, 45200 Zapopan, Jalisco.',
  direccionesEntrega: [
    { id: 1, texto: 'Huerto 209 Int. 0, Tesistán, 45200 Zapopan, Jalisco.' },
    { id: 2, texto: 'Huerto 221 Int. 0, Colonos de Tesistán, 45200 Zapopan, Jalisco.' },
  ],
  folioFactura: '1099204',
};

export const EMBARQUES_ACTIVOS = [
  { numero: '147707', facturas: 1, fecha: '2026-09-17 15:48' },
  { numero: '147708', facturas: 3, fecha: '2026-09-17 09:22' },
];
