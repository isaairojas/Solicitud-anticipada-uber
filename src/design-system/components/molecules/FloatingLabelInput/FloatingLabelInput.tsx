/**
 * Figma: INPUT PRUEBA / SELECT PRUEBA con etiqueta flotante (Datos de la factura)
 * nodeId: 3872:16599
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=3872-16599
 * Última sincronización: 2026-09-29
 */
import type { ReactNode } from 'react';
import dropdown from '@assets/icons/dropdown.svg';
import styles from './FloatingLabelInput.module.css';

type Props = {
  label: string;
  icon?: string;
  value: ReactNode;
  /** 75 px cuando el valor ocupa dos líneas (Dirección fiscal/entrega); 50 px normal. */
  tall?: boolean;
  /** SELECT PRUEBA (ícono ▼ a la derecha). */
  isSelect?: boolean;
  /** Estilo del label del SELECT: el negro es más pequeño (13 px vs 13.2 px). */
  labelFont?: 'input' | 'select';
  onClick?: () => void;
};

export function FloatingLabelInput({ label, icon, value, tall, isSelect, labelFont = 'input', onClick }: Props) {
  const Cmp = onClick ? 'button' : 'div';
  return (
    <Cmp type={onClick ? 'button' : undefined} className={`${styles.input} ${tall ? styles.tall : ''}`} onClick={onClick}>
      {icon && <img src={icon} alt="" width={20} height={20} />}
      <div className={styles.value}>{value}</div>
      {isSelect && (
        <div className={styles.dropdown} aria-hidden>
          <img src={dropdown} alt="" />
        </div>
      )}
      <div className={`${styles.label} ${labelFont === 'select' ? styles.labelSelect : ''}`}>
        <span>{label}</span>
      </div>
    </Cmp>
  );
}
