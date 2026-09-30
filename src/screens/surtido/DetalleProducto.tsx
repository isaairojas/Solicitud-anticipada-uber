/**
 * Figma: Detalle de producto (botón dinámico)
 * nodeId: 3199:6362 — variantes 3236:4114, 3236:4640, 3199:6170, 3232:3951, 3091:14568, 3107:18312
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=3199-6362
 * Última sincronización: 2026-09-29
 *
 * Reglas del segundo botón (tabla "image 4", 3232:3913):
 *   bandera activa · surtido = 0            → "Negar producto" habilitado
 *   bandera activa · surtido ≥ 1            → "Revisar producto" habilitado
 *   bandera activa · surtido ≥ 1 + revisado → "Revisar producto" deshabilitado (se reactiva si cambia la cantidad)
 *   bandera inactiva · surtido = 0 / ≥ 1    → "Negar mercancía" habilitado / deshabilitado
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@ds/components/organisms/AppHeader/AppHeader';
import { ContentPanel } from '@ds/components/organisms/ContentPanel/ContentPanel';
import { BottomBar } from '@ds/components/organisms/BottomBar/BottomBar';
import { Button } from '@ds/components/atoms/Button/Button';
import { Stepper } from '@ds/components/atoms/Stepper/Stepper';
import { LabeledField } from '@ds/components/molecules/LabeledField/LabeledField';
import { ProductSummary } from '@ds/components/molecules/ProductSummary/ProductSummary';
import { producto, tipoRevision } from '../../domain/pedido';
import { useStore } from '../../store/AppStore';
import { RevisionModal } from './overlays/RevisionModal';
import { useRevision } from './useRevision';
import styles from './DetalleProducto.module.css';

export function DetalleProducto({ revisando: revisandoInicial = false }: { revisando?: boolean }) {
  const { codigo = '' } = useParams();
  const navigate = useNavigate();
  const { pedido, dispatch } = useStore();
  const { escanearRevision, toastRevision } = useRevision();
  const item = pedido.items.find((i) => i.codigo === codigo);
  const p = producto(codigo);
  const [cantidad, setCantidad] = useState(item?.surtido ?? 0);
  const [revisando, setRevisando] = useState(revisandoInicial);
  if (!item || !p) return null;

  const cambio = cantidad !== item.surtido;
  const revisado = item.revisionCompleta && !cambio;

  const aceptar = () => {
    if (cambio) dispatch({ type: 'fijarSurtido', codigo, cantidad });
    navigate('/surtido');
  };

  let segundo: { label: string; enabled: boolean; onClick: () => void };
  if (!pedido.banderaRevision) {
    segundo = { label: 'Negar mercancía', enabled: cantidad === 0, onClick: () => negar() };
  } else if (cantidad === 0) {
    segundo = { label: 'Negar producto', enabled: true, onClick: () => negar() };
  } else {
    segundo = {
      label: 'Revisar producto',
      enabled: !revisado,
      onClick: () => {
        if (cambio) dispatch({ type: 'fijarSurtido', codigo, cantidad });
        setRevisando(true);
      },
    };
  }

  function negar() {
    dispatch({ type: 'negar', codigo });
    navigate('/surtido');
  }

  return (
    <div className={styles.screen}>
      <AppHeader onBack={() => navigate('/surtido')} />
      <ContentPanel title="Detalle del producto" bottom={0}>
        <div className={styles.body}>
          <div className={styles.datos}>
            <ProductSummary foto={p.foto ?? ''} codigo={p.codigo} descripcion={p.descripcion} photoStyle="framed" />
            <div className={styles.grid}>
              <div className={styles.pair}>
                <LabeledField label="Ubicación" value={p.planta} />
                <LabeledField label="Pasillo" value={p.pasillo} />
              </div>
              <div className={styles.pair}>
                <LabeledField label="Torre" value={p.torre} />
                <LabeledField label="Nivel" value={p.nivel} />
              </div>
              <div className={styles.pair}>
                <LabeledField label="Existencia" value={p.existencia} valueBold />
                <LabeledField label="Solicitado" value={p.solicitado} />
              </div>
            </div>
          </div>
          <div className={styles.cantidad}>
            <p className={styles.cantidadLabel}>Cantidad surtida:</p>
            <Stepper value={cantidad} min={0} max={p.solicitado} onChange={setCantidad} />
          </div>
        </div>
      </ContentPanel>
      <BottomBar variant="footer">
        <Button variant="default" label="Aceptar" className={styles.flex1} onClick={aceptar} />
        <Button variant="default" label={segundo.label} disabled={!segundo.enabled} className={styles.flex1} onClick={segundo.onClick} />
      </BottomBar>

      {revisando && (
        <RevisionModal
          producto={p}
          tipo={tipoRevision(p)}
          revisado={item.revisado}
          total={item.surtido}
          onScan={(v) => {
            if (escanearRevision(codigo, v)) {
              // 3120:11941 → 3107:18312: 800 ms y vuelve al Detalle con el aviso
              window.setTimeout(() => {
                setRevisando(false);
                toastRevision();
              }, 800);
            }
          }}
          onConfirm={() => {
            dispatch({ type: 'completarRevision', codigo });
            setRevisando(false);
            toastRevision();
          }}
          onCancel={() => {
            dispatch({ type: 'cancelarRevision', codigo });
            setRevisando(false);
          }}
        />
      )}
    </div>
  );
}
