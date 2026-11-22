/**
 * High-DPI Canvas2D chart renderer for embedding crisp statistical graphs
 * inside PDF (jsPDF) and Word (.docx ImageRun) scientific reports.
 */

export interface ChartPngAsset {
  dataUrl: string;
  bytes: Uint8Array;
  width: number;
  height: number;
}

const NODE_STUB_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return Uint8Array.from(Buffer.from(base64, 'base64'));
}

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] | null {
  if (typeof document === 'undefined') return null;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  return [canvas, ctx];
}

export function renderProvincialLossBarChartPng(params: {
  title: string;
  subtitle: string;
  directLabel: string;
  indirectLabel: string;
  rows: { province: string; direct: number; indirect: number }[];
}): ChartPngAsset {
  const width = 760;
  const height = 380;
  const created = createCanvas(width, height);
  if (!created) {
    return { dataUrl: NODE_STUB_PNG_DATA_URL, bytes: dataUrlToBytes(NODE_STUB_PNG_DATA_URL), width, height };
  }
  const [canvas, ctx] = created;

  // Header
  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText(params.title, 24, 30);
  ctx.fillStyle = '#52525B';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.subtitle, 24, 48);

  // Legend
  ctx.fillStyle = '#B45309';
  ctx.fillRect(24, 62, 12, 12);
  ctx.fillStyle = '#27272A';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.directLabel, 42, 72);

  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(210, 62, 12, 12);
  ctx.fillStyle = '#27272A';
  ctx.fillText(params.indirectLabel, 228, 72);

  const chartLeft = 135;
  const chartRight = width - 80;
  const chartTop = 94;
  const chartHeight = 250;
  const maxVal = Math.max(
    1,
    ...params.rows.map((r) => Math.max(0, r.direct + r.indirect)),
  );

  // Gridlines
  ctx.strokeStyle = '#E4E4E7';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const x = chartLeft + ((chartRight - chartLeft) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, chartTop + chartHeight);
    ctx.stroke();
    ctx.fillStyle = '#71717A';
    ctx.font = '10px monospace';
    const tick = ((maxVal * i) / 4).toFixed(0);
    ctx.fillText(`${tick} M$`, x - 12, chartTop + chartHeight + 16);
  }

  const rowStep = chartHeight / Math.max(1, params.rows.length);
  const barH = Math.min(22, rowStep * 0.58);

  params.rows.forEach((row, idx) => {
    const y = chartTop + idx * rowStep + (rowStep - barH) / 2;
    const directW = (Math.max(0, row.direct) / maxVal) * (chartRight - chartLeft);
    const indirectW = (Math.max(0, row.indirect) / maxVal) * (chartRight - chartLeft);

    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 11.5px sans-serif';
    ctx.fillText(row.province, 24, y + barH * 0.68);

    ctx.fillStyle = '#B45309';
    ctx.fillRect(chartLeft, y, directW, barH);
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(chartLeft + directW, y, indirectW, barH);

    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(
      `${(row.direct + row.indirect).toFixed(1)} M$`,
      chartLeft + directW + indirectW + 8,
      y + barH * 0.68,
    );
  });

  // Border frame
  ctx.strokeStyle = '#D4D4D8';
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const dataUrl = canvas.toDataURL('image/png');
  return { dataUrl, bytes: dataUrlToBytes(dataUrl), width, height };
}

export function renderRiceAndOniDualChartPng(params: {
  title: string;
  subtitle: string;
  oniLabel: string;
  shockLabel: string;
  series: { month: string; oniAnomaly: number; harvestShockIdx: number }[];
}): ChartPngAsset {
  const width = 760;
  const height = 340;
  const created = createCanvas(width, height);
  if (!created) {
    return { dataUrl: NODE_STUB_PNG_DATA_URL, bytes: dataUrlToBytes(NODE_STUB_PNG_DATA_URL), width, height };
  }
  const [canvas, ctx] = created;

  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText(params.title, 24, 30);
  ctx.fillStyle = '#52525B';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.subtitle, 24, 48);

  // Legend
  ctx.fillStyle = '#B45309';
  ctx.fillRect(24, 62, 16, 4);
  ctx.fillStyle = '#27272A';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.oniLabel, 46, 68);

  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(260, 62, 16, 4);
  ctx.fillStyle = '#27272A';
  ctx.fillText(params.shockLabel, 282, 68);

  const left = 58;
  const right = width - 58;
  const top = 92;
  const bottom = 295;
  const plotW = right - left;
  const plotH = bottom - top;

  // Grid
  ctx.strokeStyle = '#E4E4E7';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = top + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();

    const shockTick = Math.round(100 - i * 25);
    ctx.fillStyle = '#1E3A8A';
    ctx.font = '10px monospace';
    ctx.fillText(`${shockTick}`, right + 8, y + 3);

    const oniTick = (4.0 - i * 1.1).toFixed(1);
    ctx.fillStyle = '#B45309';
    ctx.fillText(`${oniTick}°C`, 14, y + 3);
  }

  const pts = params.series;
  const xAt = (i: number) => left + (plotW * i) / Math.max(1, pts.length - 1);
  const yShock = (v: number) => bottom - (Math.max(0, Math.min(100, v)) / 100) * plotH;
  const yOni = (v: number) => bottom - ((v + 0.4) / 4.4) * plotH;

  // Shock bars/area
  ctx.fillStyle = 'rgba(30, 58, 138, 0.12)';
  ctx.beginPath();
  ctx.moveTo(xAt(0), bottom);
  pts.forEach((p, i) => ctx.lineTo(xAt(i), yShock(p.harvestShockIdx)));
  ctx.lineTo(xAt(pts.length - 1), bottom);
  ctx.closePath();
  ctx.fill();

  // Shock line
  ctx.strokeStyle = '#1E3A8A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yShock(p.harvestShockIdx));
    else ctx.lineTo(xAt(i), yShock(p.harvestShockIdx));
  });
  ctx.stroke();

  // ONI line
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yOni(p.oniAnomaly));
    else ctx.lineTo(xAt(i), yOni(p.oniAnomaly));
  });
  ctx.stroke();

  // Points + X labels
  pts.forEach((p, i) => {
    const x = xAt(i);
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(x, yOni(p.oniAnomaly), 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(x, yShock(p.harvestShockIdx), 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3F3F46';
    ctx.font = '10px sans-serif';
    ctx.fillText(p.month, x - 16, bottom + 18);
  });

  ctx.strokeStyle = '#D4D4D8';
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const dataUrl = canvas.toDataURL('image/png');
  return { dataUrl, bytes: dataUrlToBytes(dataUrl), width, height };
}

export function renderContinentalComparisonChartPng(params: {
  title: string;
  subtitle: string;
  directLabel: string;
  indirectLabel: string;
  rows: { country: string; direct: number; indirect: number }[];
}): ChartPngAsset {
  const topRows = [...params.rows]
    .sort((a, b) => b.direct + b.indirect - (a.direct + a.indirect))
    .slice(0, 10);

  const width = 760;
  const height = 400;
  const created = createCanvas(width, height);
  if (!created) {
    return { dataUrl: NODE_STUB_PNG_DATA_URL, bytes: dataUrlToBytes(NODE_STUB_PNG_DATA_URL), width, height };
  }
  const [canvas, ctx] = created;

  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText(params.title, 24, 30);
  ctx.fillStyle = '#52525B';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.subtitle, 24, 48);

  ctx.fillStyle = '#0F766E';
  ctx.fillRect(24, 62, 12, 12);
  ctx.fillStyle = '#27272A';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.directLabel, 42, 72);

  ctx.fillStyle = '#334155';
  ctx.fillRect(220, 62, 12, 12);
  ctx.fillStyle = '#27272A';
  ctx.fillText(params.indirectLabel, 238, 72);

  const chartLeft = 185;
  const chartRight = width - 85;
  const chartTop = 92;
  const chartH = 270;
  const maxVal = Math.max(1, ...topRows.map((r) => r.direct + r.indirect));

  ctx.strokeStyle = '#E4E4E7';
  for (let i = 0; i <= 4; i++) {
    const x = chartLeft + ((chartRight - chartLeft) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, chartTop + chartH);
    ctx.stroke();
    ctx.fillStyle = '#71717A';
    ctx.font = '10px monospace';
    ctx.fillText(`${Math.round((maxVal * i) / 4)} M$`, x - 14, chartTop + chartH + 16);
  }

  const step = chartH / Math.max(1, topRows.length);
  const barH = Math.min(18, step * 0.62);

  topRows.forEach((row, idx) => {
    const y = chartTop + idx * step + (step - barH) / 2;
    const dW = (row.direct / maxVal) * (chartRight - chartLeft);
    const iW = (row.indirect / maxVal) * (chartRight - chartLeft);

    ctx.fillStyle = '#18181B';
    ctx.font = '11px sans-serif';
    const label = row.country.length > 25 ? `${row.country.slice(0, 24)}…` : row.country;
    ctx.fillText(label, 24, y + barH * 0.72);

    ctx.fillStyle = '#0F766E';
    ctx.fillRect(chartLeft, y, dW, barH);
    ctx.fillStyle = '#334155';
    ctx.fillRect(chartLeft + dW, y, iW, barH);

    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 10.5px monospace';
    ctx.fillText(`${Math.round(row.direct + row.indirect)} M$`, chartLeft + dW + iW + 6, y + barH * 0.72);
  });

  ctx.strokeStyle = '#D4D4D8';
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const dataUrl = canvas.toDataURL('image/png');
  return { dataUrl, bytes: dataUrlToBytes(dataUrl), width, height };
}

export function renderTrajectory2027_2032ChartPng(params: {
  title: string;
  subtitle: string;
  madaLabel: string;
  globalLabel: string;
  series: { year: number; madaLossMUsd: number; globalLossBUsd: number }[];
}): ChartPngAsset {
  const width = 760;
  const height = 350;
  const created = createCanvas(width, height);
  if (!created) {
    return { dataUrl: NODE_STUB_PNG_DATA_URL, bytes: dataUrlToBytes(NODE_STUB_PNG_DATA_URL), width, height };
  }
  const [canvas, ctx] = created;

  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText(params.title, 24, 30);
  ctx.fillStyle = '#52525B';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.subtitle, 24, 48);

  // Legend
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(24, 62, 14, 12);
  ctx.fillStyle = '#27272A';
  ctx.font = '11px sans-serif';
  ctx.fillText(params.madaLabel, 44, 72);

  ctx.fillStyle = '#B45309';
  ctx.fillRect(280, 62, 16, 4);
  ctx.fillStyle = '#27272A';
  ctx.fillText(params.globalLabel, 302, 72);

  const left = 64;
  const right = width - 64;
  const top = 96;
  const bottom = 300;
  const plotW = right - left;
  const plotH = bottom - top;

  const maxMada = Math.max(100, ...params.series.map((s) => s.madaLossMUsd)) * 1.15;
  const maxGlob = Math.max(100, ...params.series.map((s) => s.globalLossBUsd)) * 1.15;

  ctx.strokeStyle = '#E4E4E7';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = top + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();

    ctx.fillStyle = '#1E3A8A';
    ctx.font = '10px monospace';
    ctx.fillText(`${Math.round(maxMada * (1 - i / 4))} M$`, 10, y + 3);

    ctx.fillStyle = '#B45309';
    ctx.fillText(`${Math.round(maxGlob * (1 - i / 4))} B$`, right + 6, y + 3);
  }

  const count = Math.max(1, params.series.length);
  const colW = plotW / count;
  const barW = Math.min(44, colW * 0.45);

  params.series.forEach((pt, idx) => {
    const cx = left + colW * (idx + 0.5);
    const barH = (Math.max(0, pt.madaLossMUsd) / maxMada) * plotH;
    ctx.fillStyle = 'rgba(30, 58, 138, 0.85)';
    ctx.fillRect(cx - barW / 2, bottom - barH, barW, barH);

    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`${Math.round(pt.madaLossMUsd)}M`, cx - 14, bottom - barH - 6);

    ctx.fillStyle = '#27272A';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(String(pt.year), cx - 14, bottom + 18);
  });

  // Global line
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  params.series.forEach((pt, idx) => {
    const cx = left + colW * (idx + 0.5);
    const py = bottom - (Math.max(0, pt.globalLossBUsd) / maxGlob) * plotH;
    if (idx === 0) ctx.moveTo(cx, py);
    else ctx.lineTo(cx, py);
  });
  ctx.stroke();

  params.series.forEach((pt, idx) => {
    const cx = left + colW * (idx + 0.5);
    const py = bottom - (Math.max(0, pt.globalLossBUsd) / maxGlob) * plotH;
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(cx, py, 4.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`$${Math.round(pt.globalLossBUsd)}B`, cx - 16, py - 9);
  });

  ctx.strokeStyle = '#D4D4D8';
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const dataUrl = canvas.toDataURL('image/png');
  return { dataUrl, bytes: dataUrlToBytes(dataUrl), width, height };
}

export interface CapturedDomFigure {
  id: string;
  caption: string;
  asset: ChartPngAsset;
}

async function svgElementToPngAsset(svgEl: SVGSVGElement, maxW = 760, maxH = 380): Promise<ChartPngAsset | null> {
  if (typeof document === 'undefined' || typeof Image === 'undefined') return null;
  try {
    const rect = svgEl.getBoundingClientRect();
    const w = Math.max(320, Math.round(rect.width || Number(svgEl.getAttribute('width')) || maxW));
    const h = Math.max(180, Math.round(rect.height || Number(svgEl.getAttribute('height')) || maxH));
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));

    const xml = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      const timeout = window.setTimeout(() => reject(new Error('SVG timeout')), 1500);
      i.onload = () => {
        window.clearTimeout(timeout);
        resolve(i);
      };
      i.onerror = (err) => {
        window.clearTimeout(timeout);
        reject(err);
      };
      i.src = url;
    });

    const scale = 2;
    const outW = maxW;
    const outH = Math.round((h / w) * maxW);
    const canvas = document.createElement('canvas');
    canvas.width = outW * scale;
    canvas.height = outH * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(url);
      return null;
    }
    ctx.scale(scale, scale);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, 0, 0, outW, outH);
    URL.revokeObjectURL(url);

    const dataUrl = canvas.toDataURL('image/png');
    return { dataUrl, bytes: dataUrlToBytes(dataUrl), width: outW, height: outH };
  } catch {
    return null;
  }
}

/**
 * Captures live Recharts graphs & fallback Choropleth SVG from the active DOM when exporting PDF/Word.
 */
export async function captureLiveChartsFromDom(): Promise<CapturedDomFigure[]> {
  if (typeof document === 'undefined') return [];
  const targets: { selector: string; id: string; caption: string }[] = [
    {
      selector: '#carte-risques-climatiques svg[data-export-map="true"]',
      id: 'dom-risk-map',
      caption: 'Snapshot Carte Géospatiale Active des Risques Climatiques (Polygones ADM0 / Districts)',
    },
    {
      selector: '#visualisations-recharts svg.recharts-surface',
      id: 'dom-recharts-oni',
      caption: 'Graphique Recharts Actif — Dynamique ONI / Impacts & Séries Temporelles',
    },
    {
      selector: '#trajectoires-2028-2032 svg.recharts-surface',
      id: 'dom-recharts-2028-2032',
      caption: 'Graphique Recharts Actif — Comparaison Trajectoires 2028–2032 (Pertes vs Indices Social & Climat)',
    },
  ];

  const results: CapturedDomFigure[] = [];
  for (const t of targets) {
    const el = document.querySelector(t.selector) as SVGSVGElement | null;
    if (!el) continue;
    const asset = await svgElementToPngAsset(el);
    if (asset) {
      results.push({ id: t.id, caption: t.caption, asset });
    }
  }
  return results;
}
