/**
 * Figma: Configuraciones — menú principal (Impresión / Sonidos)
 * nodeId: 5917:1679
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=5917-1679
 * Última sincronización: 2026-09-29
 */
import { useNavigate } from 'react-router-dom';
import printIcon from '@assets/icons/print-36.svg';
import notifIcon from '@assets/icons/notifications-36.svg';
import { ConfigHeader } from '@ds/components/organisms/ConfigHeader/ConfigHeader';
import { ConfigPanel } from '@ds/components/organisms/ConfigPanel/ConfigPanel';
import styles from './Configuraciones.module.css';

export function Configuraciones() {
  const navigate = useNavigate();
  return (
    <div className={styles.screen}>
      <ConfigHeader onBack={() => navigate('/menu')} />
      <ConfigPanel title="Configuraciones" gap={6} align="center">
        <div className={styles.cards}>
          <Card icono={printIcon} titulo="Impresión" descripcion="Procesos de impresión y gestión de impresoras" onClick={() => navigate('/configuraciones/impresion')} />
          <div className={styles.line} />
          <Card icono={notifIcon} titulo="Sonidos" descripcion="Sonidos de alerta y dictado por voz" onClick={() => navigate('/configuraciones/sonido')} />
        </div>
      </ConfigPanel>
    </div>
  );
}

/** Card configuraciones handheld — 5405:1085 (5917:1688 sin fondo, 90 × 366) */
function Card({ icono, titulo, descripcion, onClick }: { icono: string; titulo: string; descripcion: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <img src={icono} alt="" width={36} height={36} />
      <div className={styles.cardText}>
        <p className={styles.cardTitle}>{titulo}</p>
        <p className={styles.cardDesc}>{descripcion}</p>
      </div>
    </button>
  );
}
