/**
 * Panel lateral (derecho) con los escenarios de verificación del flujo completo:
 * Tareas → Surtido → Facturación → Embarque → Uber. Cada tarjeta salta directamente a la pantalla
 * correspondiente con un seed de estado (query `?escenario=<id>`) y opcionalmente un `?paso=` o
 * `?overlay=` para preabrir un sub-estado. Se muestra en `/tareas`, `/surtido`, `/facturacion` y `/uber`.
 * Fuera del handheld (queda a la derecha del app-frame de 430 px) y oculto bajo 900 px de viewport.
 */
import styles from './EscenariosPanel.module.css';

type Escenario = {
  id: string;
  titulo: string;
  descripcion: string;
  ruta: '/tareas' | '/surtido' | '/facturacion' | '/uber';
  paso?: string;
  overlay?: string;
  generar?: 'error';
  /** Reglas o notas clave que aplican a esta pantalla. Se muestran como bullets debajo de la descripción. */
  reglas: string[];
};

type Grupo = { titulo: string; escenarios: Escenario[] };

const GRUPOS: Grupo[] = [
  {
    titulo: 'Tareas',
    escenarios: [
      {
        id: 'tareas-surtido',
        titulo: 'Asignación — Surtido',
        descripcion: 'Empleado con tarea "SURTIDO Y REVISIÓN PEDIDO CLIENTE" asignada. Al aceptar entra al surtido pieza por pieza.',
        ruta: '/tareas',
        reglas: [
          'Solo el operador asignado puede aceptar la tarea.',
          'Al aceptar, se registra la hora de inicio.',
          'El "Cancelar" regresa al menú sin cambios.',
        ],
      },
      {
        id: 'tareas-facturacion',
        titulo: 'Asignación — Facturación',
        descripcion: 'Tarea "FACTURAR Y EMBARCAR PEDIDO" (Facturación 6004:1813). Al aceptar entra a la pantalla de datos de la factura.',
        ruta: '/tareas',
        reglas: [
          'Requiere que el pedido esté totalmente surtido y revisado.',
          'Aceptar navega a /facturacion en estado formulario.',
        ],
      },
    ],
  },
  {
    titulo: 'Facturación',
    escenarios: [
      {
        id: 'facturacion',
        titulo: 'Datos de la factura',
        descripcion: 'Formulario inicial con datos precargados: empleado, pedido, forma de pago, cliente, direcciones y copias de impresión.',
        ruta: '/facturacion',
        reglas: [
          'Empleado, pedido y cliente vienen de EPICO — solo lectura.',
          'Dirección de entrega es seleccionable de un dropdown.',
          'Copias entre 1 y 9.',
          '"Generar factura" muestra spinner ~2.5 s y crea el folio.',
        ],
      },
      {
        id: 'factura-facturada',
        titulo: 'Factura generada',
        descripcion: 'Factura ya timbrada — aparece el folio y los botones "Reimprimir factura" / "Continuar a embarque".',
        ruta: '/facturacion',
        reglas: [
          'Folio recibido de EPICO (mock 1099204).',
          'Al continuar a embarque, si hay embarques activos aparece "Agregar embarque" (elegir nuevo o existente); si no, va directo a "Nuevo embarque".',
          'Reimprimir muestra toast de "Imprimiendo factura".',
        ],
      },
      {
        id: 'factura-embarcada',
        titulo: 'Factura + embarque final',
        descripcion: 'Pantalla final tras crear el embarque y cerrar (o rechazar) Uber. Muestra folio y No. de embarque; botones "Regresar a tareas" / "Reimprimir factura".',
        ruta: '/facturacion',
        reglas: [
          'Regresar a tareas cambia la etapa a surtido y va a /tareas.',
          'Reimprimir no reabre el flujo — solo dispara el toast.',
          'Este es el punto final normal del flujo de facturación.',
        ],
      },
      {
        id: 'factura-error',
        titulo: 'Error al generar',
        descripcion: 'Fuerza el fallo del timbrado (usa ?generar=error). El toast rojo indica revisar Wi-Fi de la sucursal.',
        ruta: '/facturacion',
        generar: 'error',
        reglas: [
          'La barra de progreso se completa pero termina en estado error.',
          'El formulario queda intacto para reintentar.',
        ],
      },
    ],
  },
  {
    titulo: 'Embarque (modales)',
    escenarios: [
      {
        id: 'embarque-nuevo',
        titulo: 'Modal — Nuevo embarque',
        descripcion: 'Aviso "No existe un embarque activo para este cliente" con opción de crear uno nuevo.',
        ruta: '/facturacion',
        overlay: 'nuevoEmbarque',
        reglas: [
          'X cierra el modal sin crear nada — regresa a la factura.',
          '✓ crea el embarque (mock 147707) y abre "Embarque creado".',
        ],
      },
      {
        id: 'embarque-creado',
        titulo: 'Modal — Embarque creado',
        descripcion: 'Confirmación con el No. de embarque generado. Al aceptar dispara el ofrecimiento de Uber.',
        ruta: '/facturacion',
        overlay: 'embarqueCreado',
        reglas: [
          'El No. de embarque queda guardado en el store.',
          'Aceptar navega a /uber para evaluar la candidatura ERB-53024.',
          'Si el usuario luego rechaza Uber ("Ahora no"), regresa aquí con folio + embarque visibles.',
        ],
      },
      {
        id: 'embarque-agregar',
        titulo: 'Modal — Agregar embarque',
        descripcion: 'Cuando ya hay N embarques activos del cliente, muestra la elección entre agregar la factura a uno existente o crear uno nuevo.',
        ruta: '/facturacion',
        overlay: 'agregarEleccion',
        reglas: [
          'Se dispara cuando EMBARQUES_ACTIVOS del mock no está vacío.',
          '"Agregar" abre un selector con los embarques activos.',
          '"Nuevo" salta al modal "Nuevo embarque".',
        ],
      },
    ],
  },
  {
    titulo: 'Uber (ERB-53024)',
    escenarios: [
      {
        id: 'uber-embarcado',
        titulo: 'Ofrecimiento',
        descripcion: 'Pantalla inicial de Uber: "Este embarque es candidato para envío por Uber". Muestra cliente, No. de embarque, estado del embarque, total de artículos, distancia y total.',
        ruta: '/uber',
        reglas: [
          'Sucursal habilitada + distancia ≤ 24 km.',
          'Monto ≥ $150 y ≤ $15,000 (crédito) o ≤ $1,700 (Uber Cash). Si se niegan productos y el monto cae bajo $150 deja de ser candidato.',
          'Embarque en Monitor 1: estado "Creado — sin documentar, sin paquetería asignada". Si el embarque ya se documentó o se le asignó paquetería, deja de ser candidato.',
          '"Ahora no" regresa a /facturacion; "Generar solicitud" abre el formulario.',
        ],
      },
      {
        id: 'uber-con-historial',
        titulo: 'Ofrecimiento con historial',
        descripcion: 'Dirección Huerto 221 — el cliente tiene una solicitud entregada previa. Al generar la solicitud precarga nombre, teléfono, referencias y dpto.',
        ruta: '/uber',
        reglas: [
          'Precarga desde HISTORIAL_UBER (más reciente por cliente + dirección).',
          'La descripción del paquete SIEMPRE inicia vacía.',
        ],
      },
      {
        id: 'uber-consolidacion',
        titulo: 'Solicitud existente',
        descripcion: 'El cliente ya tiene una solicitud creada para la misma dirección. Se abre un aviso inferior para continuar y generar una solicitud independiente o cancelar y regresar al ofrecimiento.',
        ruta: '/uber',
        paso: 'consolidacion',
        reglas: [
          'Se dispara cuando ACTIVOS_POR_CLIENTE_DIRECCION tiene una entrada para cliente+dirección.',
          '"Cancelar" cierra el modal y regresa al ofrecimiento.',
          '"Continuar" genera una solicitud independiente para este pedido.',
        ],
      },
      {
        id: 'uber-formulario-vacio',
        titulo: 'Formulario vacío',
        descripcion: 'Formulario "Solicitud de Uber - Embarque N" para un cliente sin historial: todos los campos vacíos.',
        ruta: '/uber',
        paso: 'formulario',
        reglas: [
          'Dirección de entrega solo lectura.',
          'Nombre, teléfono, referencias, dpto y descripción obligatorios.',
          'Selector de vehículo: Moto (paquetes pequeños) / Coche (paquetes grandes/pesados).',
        ],
      },
      {
        id: 'uber-formulario-lleno',
        titulo: 'Formulario precargado',
        descripcion: 'Formulario con nombre, teléfono, referencias y dpto/oficina precargados desde el historial. La descripción siempre inicia vacía.',
        ruta: '/uber',
        paso: 'formulario',
        reglas: [
          'Precarga: nombre, teléfono, referencias, dpto/oficina, tipo de vehículo.',
          'Descripción del paquete la debe capturar el operador.',
        ],
      },
      {
        id: 'uber-monto-bajo',
        titulo: 'Monto por debajo del mínimo',
        descripcion: 'Se negaron todos los productos excepto el limpiador (1 pz = $25). El monto cae bajo $150 y aparece la pantalla "Este embarque no aplica" con el motivo explicado.',
        ruta: '/uber',
        reglas: [
          'evaluarCandidatura devuelve motivo "monto-minimo".',
          'La pantalla de No-candidato muestra el motivo y un solo botón "Regresar a tareas".',
        ],
      },
      {
        id: 'uber-confirmada',
        titulo: 'Solicitud creada',
        descripcion: 'Pantalla final tras enviar la solicitud. Muestra No. de solicitud, No. de pedido, embarque, factura y vehículo.',
        ruta: '/uber',
        paso: 'confirmada',
        reglas: [
          'No. de solicitud generado localmente (mock 5 dígitos).',
          'No. de pedido = PEDIDO_ID (123456).',
          '"Regresar a tareas" cierra el flujo y vuelve a /tareas.',
        ],
      },
    ],
  },
];

function currentQuery() {
  if (typeof window === 'undefined') return { escenario: '', paso: '', overlay: '', generar: '' };
  const p = new URLSearchParams(window.location.search);
  return {
    escenario: p.get('escenario') ?? '',
    paso: p.get('paso') ?? '',
    overlay: p.get('overlay') ?? '',
    generar: p.get('generar') ?? '',
  };
}

function urlFor(e: Escenario) {
  const q = new URLSearchParams({ escenario: e.id });
  if (e.paso) q.set('paso', e.paso);
  if (e.overlay) q.set('overlay', e.overlay);
  if (e.generar) q.set('generar', e.generar);
  // Reload total: la semilla del store se lee en main.tsx; sin reload no se aplica el nuevo escenario.
  // BASE_URL es "/" en dev y "/Solicitud-anticipada-uber/" en GitHub Pages (vite base).
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${e.ruta}?${q.toString()}`;
}

export function EscenariosPanel() {
  const q = currentQuery();
  return (
    <aside className={styles.panel} aria-label="Escenarios del flujo">
      <header className={styles.header}>
        <span className={styles.badge}>Flujo</span>
        <h2 className={styles.title}>Escenarios</h2>
        <p className={styles.subtitle}>
          Surtido → Facturación → Embarque → Uber. Selecciona un escenario para saltar a esa pantalla con el estado ya sembrado.
        </p>
      </header>
      <div className={styles.grupos}>
        {GRUPOS.map((g) => (
          <section key={g.titulo} className={styles.grupo}>
            <h3 className={styles.grupoTitulo}>{g.titulo}</h3>
            <ol className={styles.list}>
              {g.escenarios.map((e, i) => {
                const activo =
                  q.escenario === e.id &&
                  (e.paso ? q.paso === e.paso : true) &&
                  (e.overlay ? q.overlay === e.overlay : true) &&
                  (e.generar ? q.generar === e.generar : true);
                return (
                  <li key={e.id}>
                    <a href={urlFor(e)} className={`${styles.item} ${activo ? styles.itemActivo : ''}`}>
                      <span className={styles.itemStep}>{i + 1}</span>
                      <span className={styles.itemBody}>
                        <span className={styles.itemTitulo}>{e.titulo}</span>
                        <span className={styles.itemDescripcion}>{e.descripcion}</span>
                        {e.reglas.length > 0 && (
                          <ul className={styles.reglas}>
                            {e.reglas.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </aside>
  );
}
