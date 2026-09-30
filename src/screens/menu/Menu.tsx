/**
 * Figma: Menú
 * nodeId: 3048:10103
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=3048-10103
 * Última sincronización: 2026-09-29
 */
import { useNavigate } from 'react-router-dom';
import pieChart from '@assets/illustrations/pie-chart.svg';
import bxsPackage from '@assets/illustrations/bxs-package.svg';
import weightscale from '@assets/illustrations/weightscale.svg';
import systemfolder from '@assets/illustrations/systemfolder.svg';
import { Button } from '@ds/components/atoms/Button/Button';
import { BottomBar } from '@ds/components/organisms/BottomBar/BottomBar';
import styles from './Menu.module.css';

export function Menu() {
  const navigate = useNavigate();
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Menú</p>
      </div>
      <div className={styles.cards}>
        <button type="button" className={`${styles.card} ${styles.c1}`} onClick={() => navigate('/tareas')}>
          <p className={styles.cardText}>Tareas</p>
          <img src={pieChart} alt="" width={215.101} height={207.135} />
        </button>
        <div className={`${styles.card} ${styles.c2}`}>
          <p className={styles.cardText}>
            Consulta de
            <br />
            tareas cargadas
          </p>
          <img src={bxsPackage} alt="" width={188.384} height={164.836} />
        </div>
        <div className={`${styles.card} ${styles.c3}`}>
          <p className={styles.cardText}>
            Descarga de
            <br />
            mercancía
          </p>
          <img src={weightscale} alt="" width={191.876} height={191.553} />
        </div>
        <div className={`${styles.card} ${styles.c4}`}>
          <div className={styles.c4Row}>
            <p className={styles.cardText}>
              Evidencias de
              <br />
              envíos
            </p>
            <div className={styles.badge}>
              <p>+5</p>
            </div>
          </div>
          <img src={systemfolder} alt="" width={198} height={180} />
        </div>
      </div>
      <BottomBar variant="exit">
        <Button variant="error" label="Salir" className={styles.salir} />
      </BottomBar>
    </div>
  );
}
