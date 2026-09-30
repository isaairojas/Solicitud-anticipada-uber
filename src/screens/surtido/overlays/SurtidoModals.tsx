/**
 * Figma: modales del Surtido de órdenes
 *   Modal ingresar cantidad de piezas 3236:16208 · Modal Menu 3126:14186 · Modal pendientes parciales 3126:14406
 *   Finalizar surtido y revisión 4582:25330 · Modal promocion parcial 4582:23615 · Modal escaneo promocion 4582:23837
 *   Modal retirar promocion 4582:24109
 * URL: https://www.figma.com/design/zZBoCtJor0tdJ91umiqb7l/?node-id=3236-16208
 * Última sincronización: 2026-09-29
 */
import { Fragment, useState } from 'react';
import iconoCantidad from '@assets/icons/modal-icono-cantidad.svg';
import iconoMenu from '@assets/icons/modal-icono-menu.svg';
import iconoPregunta from '@assets/icons/modal-icono-pregunta.svg';
import iconoNegado from '@assets/icons/modal-icono-negado.svg';
import elipse34 from '@assets/icons/modal-escaneo-elipse-34.svg';
import elipse33 from '@assets/icons/modal-escaneo-elipse-33.svg';
import barcode from '@assets/icons/barcode.svg';
import botonCancelar from '@assets/icons/boton-cancelar.svg';
import grupo45 from '@assets/icons/grupo-45-cancelar.svg';
import { ModalHeader, ModalIcon, ModalSheet } from '@ds/components/organisms/ModalSheet/ModalSheet';
import { Button } from '@ds/components/atoms/Button/Button';
import { Chip } from '@ds/components/atoms/Chip/Chip';
import { Divider } from '@ds/components/atoms/Divider/Divider';
import { ScanInput } from '@ds/components/molecules/ScanInput/ScanInput';
import styles from './overlays.module.css';

const iconPregunta = <ModalIcon src={iconoPregunta} inset="-2.84% -2.27% -0.56% -1.14%" />;

/* ---------- Ingresa la cantidad surtida en contenedor — 3236:16208 ---------- */
export function CantidadModal({ codigo, sugerida, onCancel, onConfirm }: { codigo: string; sugerida: number; onCancel: () => void; onConfirm: (n: number) => void }) {
  const [valor, setValor] = useState(String(sugerida));
  return (
    <ModalSheet icon={<ModalIcon src={iconoCantidad} inset="-2.84% -3.98% -0.56% -2.84%" offsetX={-1} />} gap={10}>
      <div className={styles.col} style={{ gap: 16 }}>
        <ModalHeader title="Ingresa la cantidad surtida en contenedor">
          <div className={styles.codeRow}>
            <b>Código</b>
            <span>{codigo}</span>
          </div>
        </ModalHeader>
        <input
          className={styles.qtyInput}
          value={valor}
          inputMode="numeric"
          autoFocus
          aria-label="Cantidad"
          onChange={(e) => setValor(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && onConfirm(parseInt(valor, 10) || 0)}
        />
        <div className={styles.buttons}>
          <Button asset={botonCancelar} label="Cancelar" className={styles.half} onClick={onCancel} />
          <Button variant="success" icon="check" label="Aceptar" className={styles.half} onClick={() => onConfirm(parseInt(valor, 10) || 0)} />
        </div>
      </div>
    </ModalSheet>
  );
}

/* ---------- Menú (⋮) — 3126:14186 ---------- */
export function MenuModal({ onRepetirAudio, onFinalizar, onCancel }: { onRepetirAudio: () => void; onFinalizar: () => void; onCancel: () => void }) {
  return (
    <ModalSheet icon={<ModalIcon src={iconoMenu} inset="-2.75% -1.7% -0.66% -1.7%" />} gap={10}>
      <div className={styles.col} style={{ gap: 15 }}>
        <ModalHeader title="Menú" gap={17} dividerWidth={415.902} />
        <div className={styles.col} style={{ gap: 15, alignItems: 'center' }}>
          <Button variant="default" label="Repetir audio" className={styles.full} onClick={onRepetirAudio} />
          <Button variant="error" label="Finalizar surtido" className={styles.full} onClick={onFinalizar} />
        </div>
      </div>
      <Button variant="error" icon="cross" label="Cancelar" className={styles.full} onClick={onCancel} />
    </ModalSheet>
  );
}

/* ---------- Finalizar surtido (códigos parciales) — 3126:14406 ---------- */
export type ParcialRow = { codigo: string; surtido: number; solicitado: number; existencia: number };

export function ParcialesModal({ rows, onCancel, onConfirm }: { rows: ParcialRow[]; onCancel: () => void; onConfirm: () => void }) {
  return (
    <ModalSheet icon={iconPregunta} gap={10} doubleShadow>
      <div className={styles.col} style={{ gap: 18 }}>
        <p className={styles.subtitle} style={{ width: '100%', textAlign: 'center' }}>
          Finalizar surtido
        </p>
        <Divider variant="modal" />
        <div className={styles.text}>
          <p>
            Tienes códigos <b>surtidos</b> <b>parcialmente.</b> ¿Deseas continuar?
          </p>
          <p>Revisa con cuidado la información, las piezas solicitadas podrían estar en otro lado.</p>
          <p>&#8203;</p>
        </div>
        <div className={styles.partialList}>
          {rows.map((r, i) => (
            <Fragment key={r.codigo}>
              {i > 0 && <Divider variant="modal" />}
              <div className={styles.partialRow}>
                <span className={styles.code20}>{r.codigo}</span>
                <Chip status="parcial" value={r.surtido} total={r.solicitado} />
                <div className={styles.existencia}>
                  <b>Existencia:</b>
                  <span>{r.existencia}</span>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className={styles.buttons}>
          <Button asset={grupo45} label="Cancelar" className={styles.flex1} onClick={onCancel} />
          <Button variant="success" icon="check" label="Aceptar" className={styles.flex1} onClick={onConfirm} />
        </div>
      </div>
    </ModalSheet>
  );
}

/* ---------- Finalizar surtido y revisión — 4582:25330 ---------- */
export function FinalizarModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <ModalSheet icon={iconPregunta} gap={10} doubleShadow>
      <div className={styles.col} style={{ gap: 18 }}>
        <p className={styles.subtitle} style={{ width: '100%', textAlign: 'center' }}>
          Finalizar surtido y revisión
        </p>
        <Divider variant="modal" />
        <p className={styles.text}>
          Haz surtido y revisaado el total de productos solicitados ¿Deseas finalizar la ronda?
          <br />
          <br />
        </p>
        <div className={styles.buttons}>
          <Button asset={grupo45} label="Cancelar" className={styles.flex1} onClick={onCancel} />
          <Button variant="success" icon="check" label="Aceptar" className={styles.flex1} onClick={onConfirm} />
        </div>
      </div>
    </ModalSheet>
  );
}

/* ---------- Promoción ---------- */
export type PromoRow = { codigo: string; negado: boolean; surtido: number; solicitado: number };

function PromoList({ rows }: { rows: PromoRow[] }) {
  return (
    <div className={styles.promoList}>
      {rows.map((r) => (
        <div key={r.codigo} className={styles.promoRow}>
          <span className={styles.code20}>{r.codigo}</span>
          {r.negado ? <Chip status="negado-promocion" /> : <Chip status="completado" value={r.surtido} total={r.solicitado} />}
        </div>
      ))}
    </div>
  );
}

/** Finalizar surtido — promoción parcial (4582:23615) */
export function PromoParcialModal({ rows, onEliminar, onCancel }: { rows: PromoRow[]; onEliminar: () => void; onCancel: () => void }) {
  return (
    <ModalSheet icon={iconPregunta} gap={10} doubleShadow>
      <div className={styles.col} style={{ gap: 24 }}>
        <div className={styles.col} style={{ gap: 18 }}>
          <div className={styles.col} style={{ gap: 18 }}>
            <p className={styles.subtitle} style={{ width: '100%', textAlign: 'center' }}>
              Finalizar surtido
            </p>
            <Divider variant="modal" />
          </div>
          <div className={styles.text}>
            <p>La siguiente promoción no se surtió completamente.</p>
            <p>&#8203;</p>
            <p>
              Para continuar, <b>completa la promoción </b>o <b>elimina los productos del pedido.</b>
            </p>
          </div>
          <p className={styles.subtitle}>Códigos de la promoción</p>
          <PromoList rows={rows} />
        </div>
        <div className={styles.col} style={{ gap: 15, alignItems: 'center' }}>
          <Button variant="outline" label="Eliminar productos" className={styles.full} onClick={onEliminar} />
          <Button variant="error" icon="cross" label="Cancelar" className={styles.full} onClick={onCancel} />
        </div>
      </div>
    </ModalSheet>
  );
}

/** Escanea un producto de la promoción (4582:23837) */
export function PromoEscaneoModal({ rows, onScan, onCancel }: { rows: PromoRow[]; onScan: (c: string) => void; onCancel: () => void }) {
  const icon = (
    <div className={styles.scanIcon} aria-hidden>
      <img className={styles.e34} src={elipse34} alt="" />
      <div className={styles.e33}>
        <img src={elipse33} alt="" />
      </div>
      <img className={styles.barcode} src={barcode} alt="" />
    </div>
  );
  return (
    <ModalSheet icon={icon} gap={10} doubleShadow>
      <div className={styles.col} style={{ gap: 24 }}>
        <div className={styles.col} style={{ gap: 18 }}>
          <p className={styles.subtitle} style={{ width: '100%', textAlign: 'center', whiteSpace: 'normal' }}>
            Escanea un producto de la promoción
          </p>
          <Divider variant="modal" />
          <PromoList rows={rows} />
        </div>
        <div className={styles.col} style={{ gap: 18, alignItems: 'center' }}>
          <ScanInput onScan={onScan} />
        </div>
        <Button variant="error" icon="cross" label="Cancelar" className={styles.full} onClick={onCancel} />
      </div>
    </ModalSheet>
  );
}

/** Promoción negada (4582:24109) */
export function PromoNegadaModal({ rows, onConfirm }: { rows: PromoRow[]; onConfirm: () => void }) {
  return (
    <ModalSheet icon={<ModalIcon src={iconoNegado} inset="-2.84% -2.27% -0.56% -1.14%" />} gap={10} doubleShadow>
      <div className={styles.col} style={{ gap: 18 }}>
        <div className={styles.col} style={{ gap: 18 }}>
          <p className={styles.subtitle} style={{ width: '100%', textAlign: 'center' }}>
            Promoción negada
          </p>
          <Divider variant="modal" />
        </div>
        <p className={styles.text}>
          <b>Retira</b> los siguientes productos del contenedor:
        </p>
        <p className={styles.subtitle}>Códigos de la promoción</p>
        <PromoList rows={rows} />
        <div className={styles.col} style={{ gap: 15, alignItems: 'center' }}>
          <Button variant="success" icon="check" checkWidth={31.012} label="Aceptar" className={styles.full} onClick={onConfirm} />
        </div>
      </div>
    </ModalSheet>
  );
}
