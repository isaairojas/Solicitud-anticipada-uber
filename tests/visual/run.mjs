// Verificación visual (FIGMA_REPLICA.md §9): renderiza cada caso a 430×932 @1x y lo compara con la captura de Figma.
// Uso: node tests/visual/run.mjs [filtro]   (requiere `npm run dev` en http://localhost:5173)
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { CASOS } from './casos.mjs';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const filtro = process.argv[2];
mkdirSync('tests/visual/__actual__', { recursive: true });
mkdirSync('tests/visual/__diff__', { recursive: true });

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const resultados = [];

for (const caso of CASOS.filter((c) => !filtro || c.id.includes(filtro))) {
  const ref = `docs/figma/cache/frames/${caso.figma.replace(':', '-')}.png`;
  if (!existsSync(ref)) {
    resultados.push({ id: caso.id, figma: caso.figma, estado: 'SIN REFERENCIA' });
    continue;
  }
  await page.goto(`${BASE}${caso.url}`);
  await page.evaluate(() => document.fonts.ready);
  if (caso.acciones) await caso.acciones(page);
  await page.waitForTimeout(caso.espera ?? 1200); // animaciones de entrada (spring 744–1022 ms)
  const actualBuf = await page.screenshot();
  writeFileSync(`tests/visual/__actual__/${caso.id}.png`, actualBuf);

  const a = PNG.sync.read(actualBuf);
  const e = PNG.sync.read(readFileSync(ref));
  const w = Math.min(a.width, e.width);
  const h = Math.min(a.height, e.height);
  const crop = (img) => {
    const out = new PNG({ width: w, height: h });
    PNG.bitblt(img, out, 0, 0, w, h, 0, 0);
    return out;
  };
  const A = crop(a);
  const E = crop(e);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(A.data, E.data, diff.data, w, h, { threshold: 0.1, includeAA: false });
  writeFileSync(`tests/visual/__diff__/${caso.id}.png`, PNG.sync.write(diff));
  const pct = (n / (w * h)) * 100;
  resultados.push({ id: caso.id, figma: caso.figma, pct: pct.toFixed(2), estado: pct <= 1 ? 'OK' : 'REVISAR', tam: `${e.width}x${e.height}` });
}

await browser.close();
console.table(resultados);
writeFileSync('tests/visual/resultados.json', JSON.stringify({ fecha: new Date().toISOString(), resultados }, null, 2));
