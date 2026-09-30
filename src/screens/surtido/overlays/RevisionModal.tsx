/**
 * Figma: Modal Revisión aleatoria (escaneo forzoso, 3060:12583 / 3081:1928) · Modal Revisión aleatoria dos (simplificada, 3308:17290)
 * nodeId: 3060:12583
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=3060-12583
 * Última sincronización: 2026-09-29
 */
import iconoRevision from '@assets/icons/modal-icono-revision.svg';
import grupo45 from '@assets/icons/grupo-45-cancelar.svg';
import { ModalHeader, ModalIcon, ModalSheet } from '@ds/components/organisms/ModalSheet/ModalSheet';
import { ProgressBar } from '@ds/components/atoms/ProgressBar/ProgressBar';
import { ProductSummary } from '@ds/components/molecules/ProductSummary/ProductSummary';
import { ScanInput } from '@ds/components/molecules/ScanInput/ScanInput';
import { Button } from '@ds/components/atoms/Button/Button';
import type { ProductoPedido, TipoRevision } from '../../../mocks/pedido';
import styles from './overlays.module.css';

type Props = {
  producto: ProductoPedido;
  tipo: TipoRevision;
  revisado: number;
  total: number;
  onScan: (code: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const icon = <ModalIcon src={iconoRevision} inset="-2.84% -3.98% -0.56% -2.84%" offsetX={-1} />;

export function RevisionModal({ producto, tipo, revisado, total, onScan, onCancel, onConfirm }: Props) {
  if (tipo === 'simplificada') {
    return (
      <ModalSheet icon={icon} gap={30}>
        <div className={styles.col} style={{ gap: 16 }}>
          <ModalHeader title="Revisión de mercancía" />
          <div className={styles.col} style={{ gap: 30 }}>
            <div className={styles.col} style={{ gap: 10 }}>
              <div className={styles.count}>
                <span className={styles.countBlue}>{total}</span>
              </div>
              <p className={styles.countLabel}>Piezas surtidas por revisar</p>
            </div>
            <ProductSummary foto={producto.foto ?? ''} codigo={producto.codigo} descripcion={producto.descripcion} descriptionHeight={86} />
          </div>
          <div className={styles.buttons}>
            <Button asset={grupo45} label="Cancelar" className={styles.flex1} onClick={onCancel} />
            <Button variant="success" icon="check" label="Aceptar" className={styles.flex1} onClick={onConfirm} />
          </div>
        </div>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet icon={icon} gap={30}>
      <div className={styles.col} style={{ gap: 16 }}>
        <ModalHeader title="Revisión de mercancía" />
        <div className={styles.col} style={{ gap: 30, height: 359 }}>
          <div className={styles.col} style={{ gap: 10 }}>
            <div className={styles.count}>
              <span className={styles.countBlue}>{revisado}</span>
              <span className={styles.countGray}>/</span>
              <span className={styles.countBlue}>{total}</span>
            </div>
            <p className={styles.countLabel}>Piezas surtidas por revisar</p>
            <ProgressBar value={total ? revisado / total : 0} />
          </div>
          <ProductSummary foto={producto.foto ?? ''} codigo={producto.codigo} descripcion={producto.descripcion} />
          <div className={styles.scanRow}>
            <ScanInput onScan={onScan} />
          </div>
        </div>
        <Button variant="error" icon="cross" label="Cancelar" className={styles.full} onClick={onCancel} />
      </div>
    </ModalSheet>
  );
}
