/**
 * Solicitud anticipada de Uber (ERB-53024).
 * Se dispara desde el flujo de facturación después de crear/agregar el embarque.
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handPackage from '@assets/icons/hand-package.svg';
import personIcon from '@assets/icons/person.svg';
import locationOn from '@assets/icons/location-on.svg';
import iconoPregunta from '@assets/icons/modal-icono-pregunta.svg';
import grupo45 from '@assets/icons/grupo-45-cancelar.svg';
import { AppHeader } from '@ds/components/organisms/AppHeader/AppHeader';
import { ContentPanel } from '@ds/components/organisms/ContentPanel/ContentPanel';
import { BottomBar } from '@ds/components/organisms/BottomBar/BottomBar';
import { Button } from '@ds/components/atoms/Button/Button';
import { Divider } from '@ds/components/atoms/Divider/Divider';
import { ModalHeader, ModalIcon, ModalSheet } from '@ds/components/organisms/ModalSheet/ModalSheet';
import { evaluarCandidatura, RESTRICCIONES_VEHICULO, type TipoVehiculo } from '../../domain/uber';
import { totalArticulos } from '../../domain/pedido';
import { FACTURACION } from '../../mocks/facturacion';
import { precargar, SUCURSAL_ACTUAL, tieneActivoParaCliente, TIPO_PAGO_ACTUAL } from '../../mocks/uber';
import { PEDIDO_ID } from '../../mocks/pedido';
import { useStore } from '../../store/AppStore';
import styles from './SolicitudUber.module.css';

type Estado = 'ofrecimiento' | 'formulario' | 'confirmada';

const TOAST_SOLICITUD_CREADA = {
  kind: 'success' as const,
  title: 'Solicitud creada',
  message: 'Uber recibirá la solicitud. El repartidor se desplazará a la sucursal.',
};

/** Genera un número de solicitud de 5 dígitos (mock; en producción vendría de Uber Direct). */
function nuevoNumeroSolicitud() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

/**
 * Permite forzar el paso inicial vía `?paso=formulario|confirmada|consolidacion|ofrecimiento`.
 * `consolidacion` muestra el ofrecimiento con el modal inferior abierto.
 */
type PasoInicial = Estado | 'consolidacion';
function pasoInicialDesdeUrl(): PasoInicial | null {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get('paso');
  return v === 'formulario' || v === 'confirmada' || v === 'consolidacion' || v === 'ofrecimiento' ? v : null;
}

const iconPregunta = <ModalIcon src={iconoPregunta} inset="-2.84% -2.27% -0.56% -1.14%" />;

export function SolicitudUber() {
  const navigate = useNavigate();
  const { factura, pedido, mostrarToast, setEtapa } = useStore();

  const clienteId = '536983'; // FACTURACION.cliente ("536983 | FRANCISCO JAVIER HERNADEZ MELENDREZ")
  const clienteNombre = FACTURACION.cliente.split(' | ')[1] ?? FACTURACION.cliente;
  const direccion =
    FACTURACION.direccionesEntrega.find((d) => d.id === factura.direccionEntrega)?.texto ?? FACTURACION.direccionesEntrega[0].texto;
  const articulos = totalArticulos(pedido);
  const embarqueNumero = factura.embarque?.numero ?? '—';
  const tituloEmbarque = `Solicitud de Uber - Embarque ${embarqueNumero}`;

  const candidatura = useMemo(
    () => evaluarCandidatura({ sucursal: SUCURSAL_ACTUAL, monto: FACTURACION.total, tipoPago: TIPO_PAGO_ACTUAL }),
    [],
  );
  const activo = tieneActivoParaCliente(clienteId, direccion);
  const previa = precargar(clienteId, direccion);

  const pasoInicial = pasoInicialDesdeUrl();
  const [estado, setEstado] = useState<Estado>(
    pasoInicial === 'formulario' || pasoInicial === 'confirmada'
      ? pasoInicial
      : candidatura.candidato
        ? 'ofrecimiento'
        : 'confirmada',
  );
  /** Modal inferior de consolidación: se muestra sobre el ofrecimiento cuando existe una solicitud CREADA
      para el mismo cliente + dirección (ACTIVOS_POR_CLIENTE_DIRECCION). */
  const [mostrarConsolidacion, setMostrarConsolidacion] = useState(pasoInicial === 'consolidacion');
  // Precarga: nombre, teléfono, referencias, dpto/oficina. La descripción del paquete siempre inicia VACÍA (criterio del usuario).
  const [nombre, setNombre] = useState(previa?.nombre ?? '');
  const [telefono, setTelefono] = useState(previa?.telefono ?? '');
  const [referencias, setReferencias] = useState(previa?.referencias ?? '');
  const [departamento, setDepartamento] = useState(previa?.departamento ?? '');
  const [descripcion, setDescripcion] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculo>(previa?.tipoVehiculo ?? 'moto');
  const [numeroSolicitud, setNumeroSolicitud] = useState<string | null>(() =>
    pasoInicial === 'confirmada' ? nuevoNumeroSolicitud() : null,
  );

  const puedeContinuar =
    nombre.trim() && telefono.trim() && referencias.trim() && departamento.trim() && descripcion.trim();

  const generar = () => {
    setNumeroSolicitud(nuevoNumeroSolicitud());
    mostrarToast(TOAST_SOLICITUD_CREADA);
    setEstado('confirmada');
  };

  const irACapturas = () => {
    setEtapa('surtido');
    navigate('/tareas');
  };

  /** "Ahora no" en el ofrecimiento: regresa a la pantalla de Datos de la factura (con folio + embarque),
      donde el operador puede reimprimir o regresar a tareas. */
  const rechazarUber = () => {
    setEtapa('facturacion');
    navigate('/facturacion');
  };

  /** Click en "Generar solicitud" del ofrecimiento:
      - si hay una solicitud/embarque activo con el mismo cliente + dirección → abre el modal inferior;
      - si no → va directo al formulario. */
  const iniciarSolicitud = () => {
    if (activo) setMostrarConsolidacion(true);
    else setEstado('formulario');
  };

  /** Desde el modal: cerrar y regresar al ofrecimiento; el operador confirma la creación (Generar solicitud)
      o rechaza el envío (Ahora no) desde ahí. */
  const cerrarConsolidacion = () => setMostrarConsolidacion(false);

  /** Desde el modal: continuar y generar una solicitud independiente para este pedido. */
  const generarIndependiente = () => {
    setMostrarConsolidacion(false);
    setEstado('formulario');
  };

  if (!candidatura.candidato) {
    if (typeof window !== 'undefined') window.setTimeout(irACapturas, 0);
    return null;
  }

  /* ---------------- Ofrecimiento (+ modal opcional de consolidación) ---------------- */
  if (estado === 'ofrecimiento') {
    return (
      <div className={styles.screen}>
        <AppHeader showBack={false} />
        <ContentPanel title="Solicitud de Uber" paddingBottom={45} bottom={0}>
          <div className={styles.center}>
            <div className={styles.uberBadge}>Uber</div>
            <p className={styles.h1}>Este embarque es candidato para envío por Uber</p>
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <b>Cliente</b>
                <span className={styles.infoRowValue}>{clienteNombre}</span>
              </div>
              <Divider variant="modal" />
              <div className={styles.infoRow}>
                <b>Embarque</b>
                <span>{embarqueNumero}</span>
              </div>
              <Divider variant="modal" />
              <div className={styles.infoRow}>
                <b>Dirección</b>
                <span className={styles.infoRowValue}>{direccion}</span>
              </div>
              <Divider variant="modal" />
              <div className={styles.infoRow}>
                <b>Total de artículos</b>
                <span>{articulos}</span>
              </div>
              <Divider variant="modal" />
              <div className={styles.infoRow}>
                <b>Distancia</b>
                <span>{SUCURSAL_ACTUAL.distanciaKm} km</span>
              </div>
              <Divider variant="modal" />
              <div className={styles.infoRow}>
                <b>Total</b>
                <span>${FACTURACION.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </ContentPanel>
        <BottomBar>
          <div className="row">
            <Button
              variant="error"
              label="Ahora no"
              className={styles.flex1}
              onClick={rechazarUber}
            />
            <Button
              variant="success"
              label="Generar solicitud"
              className={styles.flex1}
              onClick={iniciarSolicitud}
            />
          </div>
        </BottomBar>
        {mostrarConsolidacion && (
          <ConsolidacionModal
            onCancelar={cerrarConsolidacion}
            onContinuar={generarIndependiente}
          />
        )}
      </div>
    );
  }

  /* ---------------- Formulario ---------------- */
  if (estado === 'formulario') {
    return (
      <div className={styles.screen}>
        <AppHeader showBack={false} />
        <ContentPanel title={tituloEmbarque} paddingBottom={45} bottom={0}>
          <div className={styles.form}>
            <div className={styles.readonlyBox}>
              <div className={styles.readonlyLabel}>
                <img src={locationOn} alt="" width={20} height={20} />
                <b>Dirección de entrega</b>
                <span className={styles.readonlyTag}>Solo lectura</span>
              </div>
              <p className={styles.readonlyValue}>{direccion}</p>
            </div>
            <FieldFloating label="Nombre de quién recibe" icon={personIcon}>
              <input className={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" />
            </FieldFloating>
            <FieldFloating label="Teléfono" icon={personIcon}>
              <input className={styles.input} value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" placeholder="33-XXXX-XXXX" />
            </FieldFloating>
            <FieldFloating label="Referencias" icon={locationOn}>
              <input className={styles.input} value={referencias} onChange={(e) => setReferencias(e.target.value)} placeholder="Ej. Casa con portón negro" />
            </FieldFloating>
            <FieldFloating label="Dpto/Oficina/Piso" icon={locationOn}>
              <input className={styles.input} value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Ej. Interior" />
            </FieldFloating>
            <FieldFloating label="Descripción del paquete" icon={handPackage}>
              <input className={styles.input} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Varios" />
            </FieldFloating>
            <p className={styles.subtitle}>Tipo de vehículo</p>
            <div className={styles.vehiculos}>
              {(['moto', 'coche'] as const).map((tv) => {
                const r = RESTRICCIONES_VEHICULO[tv];
                return (
                  <button
                    type="button"
                    key={tv}
                    className={`${styles.vehiculo} ${tipoVehiculo === tv ? styles.vehiculoActivo : ''}`}
                    onClick={() => setTipoVehiculo(tv)}
                  >
                    <p className={styles.vehiculoTitulo}>{tv === 'moto' ? 'Moto' : 'Coche'}</p>
                    <p className={styles.vehiculoDesc}>{r.descripcion}</p>
                  </button>
                );
              })}
            </div>
            <div className={styles.gap40} />
          </div>
        </ContentPanel>
        <BottomBar>
          <div className="row">
            <Button variant="error" label="Cancelar" className={styles.flex1} onClick={() => setEstado('ofrecimiento')} />
            <Button
              variant="success"
              label="Solicitar Uber"
              disabled={!puedeContinuar}
              className={styles.flex1}
              onClick={generar}
            />
          </div>
        </BottomBar>
      </div>
    );
  }

  /* ---------------- Confirmada ---------------- */
  return (
    <div className={styles.screen}>
      <AppHeader showBack={false} />
      <ContentPanel title="Solicitud de Uber" paddingBottom={45} bottom={0}>
        <div className={styles.center}>
          <div className={styles.checkBadge}>✓</div>
          <p className={styles.h1}>Solicitud creada</p>
          <p className={styles.text}>Uber recibirá la solicitud. El repartidor se desplazará a la sucursal mientras el pedido termina de prepararse.</p>
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <b>No. de solicitud</b>
              <span className={styles.infoRowValueBig}>{numeroSolicitud ?? '—'}</span>
            </div>
            <Divider variant="modal" />
            <div className={styles.infoRow}>
              <b>No. de pedido</b>
              <span>{PEDIDO_ID}</span>
            </div>
            <Divider variant="modal" />
            <div className={styles.infoRow}>
              <b>Embarque</b>
              <span>{embarqueNumero}</span>
            </div>
            <Divider variant="modal" />
            <div className={styles.infoRow}>
              <b>Factura</b>
              <span>{factura.folio ?? '—'}</span>
            </div>
            <Divider variant="modal" />
            <div className={styles.infoRow}>
              <b>Vehículo</b>
              <span>{tipoVehiculo === 'moto' ? 'Moto' : 'Coche'}</span>
            </div>
          </div>
        </div>
      </ContentPanel>
      <BottomBar variant="exit">
        <Button variant="default" label="Regresar a tareas" className={styles.fullBtn} onClick={irACapturas} />
      </BottomBar>
    </div>
  );
}

/**
 * Campo con etiqueta flotante: dibuja el borde 1 px alrededor con la etiqueta
 * "cortando" el borde superior izquierdo (patrón Material). Diseñado para inputs editables,
 * a diferencia del FloatingLabelInput (que solo muestra un valor).
 */
function FieldFloating({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <img src={icon} alt="" width={20} height={20} className={styles.fieldIcon} />
      <div className={styles.fieldBody}>{children}</div>
      <span className={styles.fieldLabel}>{label}</span>
    </div>
  );
}

/**
 * Modal inferior de consolidación: se muestra sobre el ofrecimiento cuando existe una solicitud CREADA
 * para el mismo cliente + dirección. El operador decide entre generar una solicitud independiente para
 * este pedido o agregar la factura al embarque existente (opción por defecto, "Cancelar").
 */
function ConsolidacionModal({ onCancelar, onContinuar }: { onCancelar: () => void; onContinuar: () => void }) {
  return (
    <ModalSheet icon={iconPregunta} gap={10} doubleShadow>
      <div className={styles.modalCol}>
        <ModalHeader title="Cliente con solicitud existente" />
        <div className={styles.modalText}>
          <p>El cliente ya tiene una solicitud de reparto <b>creada</b> para la misma dirección.</p>
          <p>&#8203;</p>
          <p>
            En caso de <b>continuar</b>, se generará una solicitud independiente para este pedido.
          </p>
          <p>&#8203;</p>
        </div>
        <div className={styles.modalButtons}>
          <Button asset={grupo45} label="Cancelar" className={styles.flex1} onClick={onCancelar} />
          <Button variant="success" icon="check" label="Continuar" className={styles.flex1} onClick={onContinuar} />
        </div>
      </div>
    </ModalSheet>
  );
}
