/**
 * Figma: Configuraciones › Impresión (pestañas Procesos / Impresoras)
 * nodeId: 5487:3070 (Procesos) · 5487:3223 (Impresoras)
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=5487-3070
 * Última sincronización: 2026-09-29
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import printIcon20 from '@assets/icons/print-20.svg';
import adfScanner from '@assets/icons/adf-scanner.svg';
import arrowForward from '@assets/icons/arrow-forward-ios.svg';
import editIcon from '@assets/icons/edit.svg';
import printAdd from '@assets/icons/print-add.svg';
import { ConfigHeader } from '@ds/components/organisms/ConfigHeader/ConfigHeader';
import { ConfigPanel } from '@ds/components/organisms/ConfigPanel/ConfigPanel';
import { BottomBar } from '@ds/components/organisms/BottomBar/BottomBar';
import { StatusDot, type EstadoImpresora } from '@ds/components/atoms/StatusDot/StatusDot';
import { IMPRESORAS_INICIALES, PROCESOS_INICIALES, type Impresora } from '../../mocks/impresoras';
import styles from './Impresion.module.css';

type Tab = 'procesos' | 'impresoras';

export function Impresion() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('procesos');
  const [impresoras] = useState(IMPRESORAS_INICIALES);
  const [procesos] = useState(PROCESOS_INICIALES);

  return (
    <div className={styles.screen}>
      <ConfigHeader onBack={() => navigate('/configuraciones')} />
      <ConfigPanel title="Configuraciones" subtitle="Impresión" paddingX={20} gap={22}>
        <div className={styles.tabs}>
          <button type="button" className={`${styles.tab} ${tab === 'procesos' ? styles.tabActive : ''}`} onClick={() => setTab('procesos')}>
            Procesos impresión
          </button>
          <button type="button" className={`${styles.tab} ${tab === 'impresoras' ? styles.tabActive : ''}`} onClick={() => setTab('impresoras')}>
            Impresoras
          </button>
        </div>
        {tab === 'procesos' ? <ListaProcesos procesos={procesos} impresoras={impresoras} /> : <ListaImpresoras impresoras={impresoras} />}
      </ConfigPanel>
      {tab === 'impresoras' && (
        <BottomBar variant="actions">
          <button type="button" className={styles.nuevaConexion}>
            <span className={styles.nuevaConexionText}>Nueva conexión</span>
            <img src={printAdd} alt="" width={24} height={24} />
          </button>
        </BottomBar>
      )}
    </div>
  );
}

/* ---- Procesos impresión ---- */
function ListaProcesos({ procesos, impresoras }: { procesos: typeof PROCESOS_INICIALES; impresoras: Impresora[] }) {
  return (
    <div className={styles.lista}>
      {procesos.map((p, i) => {
        const impresora = impresoras.find((im) => im.id === p.impresoraId);
        const estado: EstadoImpresora | undefined = impresora?.estado ?? (p.impresoraId ? 'conectando' : undefined);
        return (
          <div key={p.id}>
            {i > 0 && <div className={styles.divider} />}
            <button type="button" className={styles.procesoRow}>
              <div className={styles.procesoText}>
                <p className={styles.procesoTitle}>{p.nombre}</p>
                <div className={styles.procesoDetalle}>
                  {estado ? <StatusDot estado={estado} /> : <StatusDot estado="no-disponible" />}
                  <img src={impresora?.tipo === 'etiquetas' ? adfScanner : printIcon20} alt="" width={20} height={20} />
                  <p className={styles.procesoImpresora}>{impresora?.nombre ?? 'Sin asignar'}</p>
                </div>
              </div>
              <img src={arrowForward} alt="" width={20} height={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Impresoras ---- */
function ListaImpresoras({ impresoras }: { impresoras: Impresora[] }) {
  return (
    <>
      <div className={styles.impresorasHeader}>
        <p className={styles.impresorasTitulo}>MIS IMPRESORAS</p>
        <button type="button" className={styles.editar}>
          <span>EDITAR</span>
          <img src={editIcon} alt="" width={20} height={20} />
        </button>
      </div>
      <div className={styles.impresorasCard}>
        <div className={styles.impresorasList}>
          {impresoras.map((im, i) => (
            <div key={im.id}>
              {i > 0 && <div className={styles.divider} />}
              <div className={styles.impresoraFila}>
                <div className={styles.impresoraHead}>
                  <img src={im.tipo === 'etiquetas' ? adfScanner : printIcon20} alt="" width={20} height={20} />
                  <p className={styles.impresoraNombre}>{im.nombre}</p>
                </div>
                <div className={styles.impresoraEstado}>
                  <StatusDot estado={im.estado} />
                  <p className={styles.impresoraEstadoTexto}>{estadoTexto(im.estado)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function estadoTexto(e: EstadoImpresora): string {
  switch (e) {
    case 'conectada':
      return 'Conectada';
    case 'sin-conexion':
      return 'Sin conexión';
    case 'conectando':
      return 'Conectando...';
    case 'no-disponible':
      return 'No disponible';
  }
}
