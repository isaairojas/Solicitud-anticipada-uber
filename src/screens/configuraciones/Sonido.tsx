/**
 * Figma: Configuraciones › Sonido
 * nodeId: 5170:12983
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=5170-12983
 * Última sincronización: 2026-09-29
 */
import { useNavigate } from 'react-router-dom';
import recordVoiceOver from '@assets/icons/record-voice-over.svg';
import volumeUp from '@assets/icons/volume-up.svg';
import { ConfigHeader } from '@ds/components/organisms/ConfigHeader/ConfigHeader';
import { ConfigPanel } from '@ds/components/organisms/ConfigPanel/ConfigPanel';
import { Switch } from '@ds/components/atoms/Switch/Switch';
import { preferencias } from '../../domain/sonidos';
import { useState } from 'react';
import styles from './Sonido.module.css';

type Prefs = { surtidoLectura: boolean; surtidoAlertas: boolean; revisionLectura: boolean; revisionAlertas: boolean };

export function Sonido() {
  const navigate = useNavigate();
  // Valores iniciales de Figma (5170:12983): todos los switches activos
  const [prefs, setPrefs] = useState<Prefs>({ surtidoLectura: true, surtidoAlertas: true, revisionLectura: true, revisionAlertas: true });

  const set = (k: keyof Prefs) => (v: boolean) => {
    setPrefs((p) => {
      const next = { ...p, [k]: v };
      // Sincroniza con el dominio de sonidos (afecta a ambos módulos de tareas por igual, PENDIENTE: separar por tarea)
      preferencias.lectura = next.surtidoLectura || next.revisionLectura;
      preferencias.alertas = next.surtidoAlertas || next.revisionAlertas;
      return next;
    });
  };

  return (
    <div className={styles.screen}>
      <ConfigHeader onBack={() => navigate('/configuraciones')} />
      <ConfigPanel title="Configuraciones" subtitle="Sonido">
        <Seccion titulo="Tareas de surtido">
          <Fila
            icono={recordVoiceOver}
            titulo="Lectura de elementos"
            descripcion="Lee en voz alta los elementos de la pantalla como número de pedido, estatus de surtido, detalle de producto."
            valor={prefs.surtidoLectura}
            onChange={set('surtidoLectura')}
          />
          <div className={styles.divider} />
          <Fila
            icono={volumeUp}
            titulo="Alertas sonoras"
            descripcion="Sonidos cortos de confirmación o error"
            valor={prefs.surtidoAlertas}
            onChange={set('surtidoAlertas')}
          />
        </Seccion>
        <Seccion titulo="Tareas de revisión">
          <Fila
            icono={recordVoiceOver}
            titulo="Lectura de elementos"
            descripcion="Lee en voz alta los elementos de la pantalla como número de pedido, estatus de surtido, detalle de producto."
            valor={prefs.revisionLectura}
            onChange={set('revisionLectura')}
          />
          <div className={styles.divider} />
          <Fila
            icono={volumeUp}
            titulo="Alertas sonoras"
            descripcion="Sonidos cortos de confirmación o error"
            valor={prefs.revisionAlertas}
            onChange={set('revisionAlertas')}
          />
        </Seccion>
      </ConfigPanel>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>{titulo}</p>
      <div className={styles.card}>{children}</div>
    </div>
  );
}

function Fila({ icono, titulo, descripcion, valor, onChange }: { icono: string; titulo: string; descripcion: string; valor: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <div className={styles.rowHead}>
          <img src={icono} alt="" width={20} height={20} />
          <p className={styles.rowTitle}>{titulo}</p>
        </div>
        <p className={styles.rowDesc}>{descripcion}</p>
      </div>
      <Switch checked={valor} onChange={onChange} label={titulo} />
    </div>
  );
}
