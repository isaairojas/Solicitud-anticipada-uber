/**
 * Lógica compartida de la revisión (Surtido de órdenes y Detalle de producto).
 * Tiempos del prototipo de Figma: al completar el escaneo forzoso, 500 ms (3081:1891) / 800 ms (3120:11941)
 * antes de cerrar el modal y mostrar el aviso "Revisión completa".
 */
import { useCallback } from 'react';
import { leerCodigo } from '../../domain/codigos';
import { producto } from '../../domain/pedido';
import { sonar } from '../../domain/sonidos';
import { useStore } from '../../store/AppStore';

export const TOAST_REVISION = { kind: 'success' as const, title: 'Revisión completa', message: 'Las piezas fueron verificadas completamente.' };

export function useRevision() {
  const { pedido, dispatch, mostrarToast } = useStore();

  /** Procesa un escaneo dentro del modal de escaneo forzoso. Devuelve true si la revisión quedó completa. */
  const escanearRevision = useCallback(
    (codigoItem: string, valor: string): boolean => {
      const l = leerCodigo(valor);
      const item = pedido.items.find((i) => i.codigo === codigoItem)!;
      // En la revisión se exige la etiqueta de 18 dígitos (diagrama image 5, 3232:3916)
      if (l.tipo !== 'etiqueta' || l.codigo !== codigoItem) {
        sonar('error');
        return false;
      }
      sonar('ok');
      dispatch({ type: 'revisar', codigo: codigoItem, cantidad: l.cantidad });
      return item.revisado + l.cantidad >= item.surtido;
    },
    [pedido.items, dispatch],
  );

  const toastRevision = useCallback(() => mostrarToast(TOAST_REVISION), [mostrarToast]);

  return { escanearRevision, toastRevision, producto };
}
