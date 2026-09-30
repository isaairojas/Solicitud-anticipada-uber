/**
 * Panel lateral (izquierdo) con la tabla de productos del pedido — ayuda de demo para copiar SKU
 * durante el surtido. Vive fuera del `.app-frame` (mismo tratamiento que EscenariosPanel a la derecha),
 * se oculta bajo 900 px de viewport, y no altera la lógica de negocio. Se muestra solo en `/surtido`.
 *
 * Los datos vienen del mismo mock que alimenta la app (PRODUCTOS, mocks/pedido.ts) para que la tabla
 * siempre refleje el estado real del pedido; los precios se suman al total y se validan contra el
 * mínimo de Uber (`REGLAS_UBER.montoMinimo`).
 */
import { useState } from 'react';
import { PRODUCTOS } from '../mocks/pedido';
import styles from './ProductosCheatsheet.module.css';

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

function tipoDe(p: (typeof PRODUCTOS)[number]) {
  return p.esMiscelaneo ? 'Misceláneo' : 'Normal';
}

export function ProductosCheatsheet() {
  const [copiado, setCopiado] = useState<string | null>(null);
  const total = PRODUCTOS.reduce((n, p) => n + p.precioUnitario * p.solicitado, 0);
  const piezas = PRODUCTOS.reduce((n, p) => n + p.solicitado, 0);

  const copiar = async (sku: string) => {
    try {
      await navigator.clipboard.writeText(sku);
      setCopiado(sku);
      window.setTimeout(() => setCopiado((c) => (c === sku ? null : c)), 1400);
    } catch {
      /* clipboard bloqueado — la fila queda igual */
    }
  };

  return (
    <aside className={styles.panel} aria-label="Productos del pedido">
      <header className={styles.header}>
        <span className={styles.badge}>Pedido</span>
        <h2 className={styles.title}>Productos</h2>
        <p className={styles.subtitle}>
          Ayuda de demo: click en el SKU para copiarlo y pegarlo en el input de escaneo.
        </p>
      </header>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thNum}>#</th>
              <th className={styles.thSku}>SKU</th>
              <th>Descripción</th>
              <th className={styles.thPz}>Pzs</th>
              <th className={styles.thPr}>Precio</th>
              <th className={styles.thTipo}>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTOS.map((p, i) => (
              <tr key={p.codigo}>
                <td className={styles.tdNum}>{i + 1}</td>
                <td>
                  <button
                    type="button"
                    className={`${styles.sku} ${copiado === p.codigo ? styles.skuCopiado : ''}`}
                    onClick={() => copiar(p.codigo)}
                    title="Click para copiar"
                  >
                    {copiado === p.codigo ? '¡Copiado!' : p.codigo}
                  </button>
                </td>
                <td className={styles.tdDesc}>{p.descripcion}</td>
                <td className={styles.tdPz}>{p.solicitado}</td>
                <td className={styles.tdPr}>{currency.format(p.precioUnitario * p.solicitado)}</td>
                <td className={styles.tdTipo}>
                  <span className={p.esMiscelaneo ? styles.tipoMisc : styles.tipoNormal}>{tipoDe(p)}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className={styles.footLabel}>
                Total
              </td>
              <td className={styles.tdPz}>{piezas}</td>
              <td className={styles.tdPr}>
                <b>{currency.format(total)}</b>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className={styles.hint}>
        Si niegas todo y dejas solo <b>Foco H4</b>, <b>Limpiador</b> o <b>Terminal</b>, el monto cae bajo el
        mínimo de <b>$150</b> y el pedido deja de ser candidato para Uber.
      </p>
    </aside>
  );
}
