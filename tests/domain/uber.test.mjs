// Pruebas unitarias mínimas de la lógica de candidatura (ERB-53024).
// Uso: node tests/domain/uber.test.mjs
import assert from 'node:assert/strict';
import { evaluarCandidatura, REGLAS_UBER } from '../../src/domain/uber.ts';

// Node no ejecuta TypeScript directamente; este archivo es solo referencia del cubrimiento esperado.
// Los assertions van en formato leído por humanos.

const casos = [
  {
    n: '1. Escenario 1 ERB-53024: crédito 9,000 a 18 km → candidato',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: false, distanciaKm: 18 }, monto: 9000, tipoPago: 'credito' },
    esperado: { candidato: true },
  },
  {
    n: '2. Escenario 3: Uber Cash 2,300 → NO candidato',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: true, distanciaKm: 5 }, monto: 2300, tipoPago: 'uber-cash' },
    esperado: { candidato: false, motivo: 'monto-cash' },
  },
  {
    n: '3. Distancia 25 km → NO candidato',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: false, distanciaKm: 25 }, monto: 5000, tipoPago: 'credito' },
    esperado: { candidato: false, motivo: 'distancia' },
  },
  {
    n: '4. Sucursal deshabilitada → NO candidato',
    entrada: { sucursal: { habilitadaUber: false, habilitadaUberCash: false, distanciaKm: 5 }, monto: 5000, tipoPago: 'credito' },
    esperado: { candidato: false, motivo: 'sucursal' },
  },
  {
    n: '5. Crédito exactamente 15,000 → candidato (límite inclusivo)',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: false, distanciaKm: 5 }, monto: REGLAS_UBER.montoMaxCredito, tipoPago: 'credito' },
    esperado: { candidato: true },
  },
  {
    n: '6. Uber Cash en sucursal sin habilitar Cash → NO candidato',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: false, distanciaKm: 5 }, monto: 1000, tipoPago: 'uber-cash' },
    esperado: { candidato: false, motivo: 'sucursal-cash' },
  },
  {
    n: '7. Monto por debajo del mínimo ($200 < $300) → NO candidato',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: false, distanciaKm: 5 }, monto: 200, tipoPago: 'credito' },
    esperado: { candidato: false, motivo: 'monto-minimo' },
  },
  {
    n: '8. Monto exactamente en el mínimo ($300) → candidato (límite inclusivo)',
    entrada: { sucursal: { habilitadaUber: true, habilitadaUberCash: false, distanciaKm: 5 }, monto: REGLAS_UBER.montoMinimo, tipoPago: 'credito' },
    esperado: { candidato: true },
  },
];

for (const c of casos) {
  const r = evaluarCandidatura(c.entrada);
  assert.deepEqual(r, c.esperado, c.n);
  console.log('OK', c.n);
}
console.log('\n%d casos verificados', casos.length);
