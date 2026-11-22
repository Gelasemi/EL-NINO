import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import * as XLSX from 'xlsx';
import type { ForecastYear } from '../data/worldEnso195Data';
import type { LanguageCode } from '../i18n/LanguageContext';
import type { CurrencyCode, ScenarioKey } from './economicAggregation';
import { EUR_PER_USD, MGA_PER_USD } from './economicAggregation';
import { escapeCsvCell } from './economicCsvExport';
import { emitPdfDownloadSuccess } from './pdfToastEvents';
import { LICENSE_ATTRIBUTION } from './scientificReportGenerator';
import {
  computeAll13ZonesConsolidated,
  computeZoneConsolidatedAnalysis,
  type RegionalBlocZoneId,
  type ZonalAnalysisReport,
} from './zonalEnsoAnalysis';

export type ZonalReportScope = 'single-zone' | 'consolidated-all-13';

export interface ZonalReportExportOptions {
  zoneId: RegionalBlocZoneId;
  reportScope: ZonalReportScope;
  year: ForecastYear;
  scenario: ScenarioKey;
  currency: CurrencyCode;
  lang: LanguageCode;
  liveFactor?: number;
}

function sanitizePdf(raw: string): string {
  return raw
    .replace(/[\u202F\u00A0]/g, ' ')
    .replace(/\u2212/g, '-')
    .replace(/[–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/→/g, '->')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/×/g, 'x')
    .replace(/÷/g, '/');
}

function formatBillionsCurrency(bUsd: number, currency: CurrencyCode): string {
  if (currency === 'EUR') {
    return `${(bUsd * EUR_PER_USD).toFixed(2)} B EUR`;
  }
  if (currency === 'MGA') {
    const tMga = (bUsd * MGA_PER_USD) / 1000; // Trillion MGA
    return `${tMga.toFixed(1)} T Ar`;
  }
  return `${bUsd.toFixed(2)} B USD`;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function renderZonalComparisonChartPng(params: {
  title: string;
  items: { label: string; valueBUsd: number; highlight?: boolean }[];
}): string {
  const width = 920;
  const height = 430;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#E4E4E7';
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText(params.title, 28, 34);

  ctx.fillStyle = '#71717A';
  ctx.font = '12px sans-serif';
  ctx.fillText('M&G Consulting · Madagascar El Nino Observatory · Unit: Billion USD', 28, 54);

  const leftPad = 230;
  const rightPad = 90;
  const topPad = 76;
  const rowGap = 24;
  const maxVal = Math.max(0.1, ...params.items.map((i) => i.valueBUsd));
  const usableWidth = width - leftPad - rightPad;

  params.items.slice(0, 13).forEach((item, idx) => {
    const y = topPad + idx * rowGap;
    ctx.fillStyle = item.highlight ? '#1E3A8A' : '#27272A';
    ctx.font = item.highlight ? 'bold 12px sans-serif' : '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(item.label.slice(0, 32), leftPad - 14, y + 12);

    ctx.fillStyle = '#F4F4F5';
    ctx.fillRect(leftPad, y + 1, usableWidth, 14);

    const barW = Math.max(3, (item.valueBUsd / maxVal) * usableWidth);
    ctx.fillStyle = item.highlight ? '#B45309' : '#1E3A8A';
    ctx.fillRect(leftPad, y + 1, barW, 14);

    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.valueBUsd.toFixed(1)} B$`, leftPad + barW + 8, y + 12);
  });

  return canvas.toDataURL('image/png');
}

function renderZoneTrajectoryChartPng(report: ZonalAnalysisReport, isFr: boolean): string {
  const width = 920;
  const height = 360;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#E4E4E7';
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  const title = isFr
    ? `Trajectoire ENSO 2027-2032 : ${report.definition.nameFr}`
    : `2027-2032 ENSO Loss Trajectory: ${report.definition.nameEn}`;
  ctx.fillStyle = '#18181B';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText(title, 28, 34);

  ctx.fillStyle = '#71717A';
  ctx.font = '12px sans-serif';
  ctx.fillText(
    isFr
      ? `Pertes annuelles (Md USD) & Tension inflationniste (% CPI) · Scenario ${report.scenario.toUpperCase()}`
      : `Annual GDP Loss (B USD) & Food/CPI Pressure (% pts) · Scenario ${report.scenario.toUpperCase()}`,
    28,
    54,
  );

  const leftPad = 76;
  const rightPad = 56;
  const topPad = 82;
  const bottomPad = 54;
  const chartW = width - leftPad - rightPad;
  const chartH = height - topPad - bottomPad;
  const maxLoss = Math.max(0.1, ...report.trajectory2027_2032.map((t) => t.lossBUsd));

  // Horizontal grid
  for (let i = 0; i <= 4; i++) {
    const gy = topPad + (chartH / 4) * i;
    ctx.strokeStyle = '#E4E4E7';
    ctx.beginPath();
    ctx.moveTo(leftPad, gy);
    ctx.lineTo(width - rightPad, gy);
    ctx.stroke();

    const val = (maxLoss * (1 - i / 4)).toFixed(1);
    ctx.fillStyle = '#71717A';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${val} B$`, leftPad - 10, gy + 4);
  }

  const slotW = chartW / report.trajectory2027_2032.length;
  const barW = Math.min(64, slotW * 0.52);

  report.trajectory2027_2032.forEach((pt, idx) => {
    const cx = leftPad + slotW * idx + slotW / 2;
    const h = (pt.lossBUsd / maxLoss) * chartH;
    const bx = cx - barW / 2;
    const by = topPad + chartH - h;

    ctx.fillStyle = pt.year === report.selectedYear ? '#B45309' : '#1E3A8A';
    ctx.fillRect(bx, by, barW, h);

    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${pt.lossBUsd.toFixed(1)}`, cx, by - 6);

    ctx.fillStyle = '#3F3F46';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(String(pt.year), cx, topPad + chartH + 20);

    ctx.fillStyle = '#047857';
    ctx.font = '10px sans-serif';
    ctx.fillText(`+${pt.avgInflationAddPct}% CPI`, cx, topPad + chartH + 36);
  });

  return canvas.toDataURL('image/png');
}

export async function exportZonalReportPdf(opts: ZonalReportExportOptions): Promise<string> {
  const isFr = opts.lang === 'fr';
  const lic = LICENSE_ATTRIBUTION[opts.lang] ?? LICENSE_ATTRIBUTION.fr;
  const all13 = computeAll13ZonesConsolidated({
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });
  const activeZone = computeZoneConsolidatedAnalysis({
    zoneId: opts.zoneId,
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 16;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = 18;
    }
  };

  const addHeading = (text: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text(sanitizePdf(text), margin, y);
    y += 2;
    doc.setDrawColor(212, 212, 216);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const addParagraph = (text: string, boldPrefix?: string) => {
    const fullText = sanitizePdf(boldPrefix ? `${boldPrefix}: ${text}` : text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(39, 39, 42);
    const lines = doc.splitTextToSize(fullText, pageWidth - margin * 2);
    ensureSpace(lines.length * 4.5 + 3);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 2.5;
  };

  // Header Banner
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);

  const mainTitle =
    opts.reportScope === 'consolidated-all-13'
      ? isFr
        ? 'RAPPORT EL NINO CONSOLIDE DES 13 ZONES & BLOCS REGIONAUX'
        : 'CONSOLIDATED 13-ZONE & REGIONAL BLOC EL NINO REPORT'
      : isFr
        ? `RAPPORT COMPLET EL NINO — ${(activeZone.definition.nameFr).toUpperCase()}`
        : `FULL EL NINO REPORT — ${(activeZone.definition.nameEn).toUpperCase()}`;

  doc.text(sanitizePdf(mainTitle), margin, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    sanitizePdf(
      `${lic.platformName} · ${lic.licenseHolder} (DG ${lic.directorName}) · Horizon ${opts.year} · ${opts.scenario.toUpperCase()} · ${opts.currency}`,
    ),
    margin,
    21,
  );
  doc.text(
    sanitizePdf(
      isFr
        ? `Périmètre : COI / COMESA / SADC / ASEAN / UE / Afrique / Océanie / Amérique latine / Caraïbes / Amérique du Nord / Europe de l'Est / Moyen-Orient / Asie`
        : `Scope: IOC / COMESA / SADC / ASEAN / EU / Africa / Oceania / Latin America / Caribbean / North America / Eastern Europe / Middle East / Asia`,
    ),
    margin,
    27,
  );

  y = 40;

  if (opts.reportScope === 'consolidated-all-13') {
    addHeading(
      isFr
        ? `1. Matrice comparative consolidée des 13 zones géographiques et blocs (${opts.year})`
        : `1. Consolidated Comparative Matrix Across All 13 Zones & Blocs (${opts.year})`,
    );

    const chartPng = renderZonalComparisonChartPng({
      title: isFr
        ? `Pertes économiques El Niño par zone (${opts.year} · Scénario ${opts.scenario.toUpperCase()})`
        : `El Niño Economic Losses by Zone (${opts.year} · Scenario ${opts.scenario.toUpperCase()})`,
      items: [...all13]
        .sort((a, b) => b.activeLossBUsd - a.activeLossBUsd)
        .map((z) => ({
          label: isFr ? z.definition.nameFr : z.definition.nameEn,
          valueBUsd: z.activeLossBUsd,
          highlight: z.definition.id === opts.zoneId,
        })),
    });

    if (chartPng) {
      ensureSpace(78);
      doc.addImage(chartPng, 'PNG', margin, y, pageWidth - margin * 2, 74);
      y += 79;
    }

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      head: [
        [
          isFr ? 'Zone / Bloc' : 'Zone / Bloc',
          isFr ? 'États' : 'States',
          isFr ? 'Pop. (M)' : 'Pop. (M)',
          isFr ? `Perte ${opts.year}` : `${opts.year} Loss`,
          '% PIB',
          isFr ? 'Cumul 2027-31' : 'Cum. 2027-31',
          '+CPI %',
          isFr ? 'Séch. / Inond.' : 'Drought / Flood',
        ],
      ],
      body: all13.map((z) => [
        sanitizePdf(isFr ? z.definition.nameFr : z.definition.nameEn),
        String(z.countryCount),
        z.totalPopM.toFixed(0),
        formatBillionsCurrency(z.activeLossBUsd, opts.currency),
        `${z.activeGdpLossPct.toFixed(2)}%`,
        formatBillionsCurrency(z.cumulative2027_2031BUsd, opts.currency),
        `+${z.avgInflationAddPct.toFixed(1)}%`,
        `${z.avgDroughtIdx} / ${z.avgFloodIdx}`,
      ]),
    });

    y = ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? y) + 8;

    // Include detailed structured subsection for every one of the 13 zones
    all13.forEach((zoneRep, idx) => {
      addHeading(
        `${idx + 2}. ${isFr ? zoneRep.definition.nameFr : zoneRep.definition.nameEn} (${zoneRep.countryCount} ${isFr ? 'États' : 'States'})`,
      );
      addParagraph(
        isFr ? zoneRep.definition.perimeterNoteFr : zoneRep.definition.perimeterNoteEn,
        isFr ? 'Périmètre' : 'Perimeter',
      );
      addParagraph(
        `${isFr ? 'Perte estimée' : 'Estimated loss'} ${opts.year}: ${formatBillionsCurrency(zoneRep.activeLossBUsd, opts.currency)} (${zoneRep.activeGdpLossPct.toFixed(2)}% ${isFr ? 'du PIB zonal' : 'of zonal GDP'}) · ${isFr ? 'Cumul 2027–2031' : '2027–2031 Cumulative'}: ${formatBillionsCurrency(zoneRep.cumulative2027_2031BUsd, opts.currency)} · +${zoneRep.avgInflationAddPct.toFixed(1)} pp CPI · ${zoneRep.criticalHighPopM.toFixed(1)} M ${isFr ? 'hab. en risque alimentaire élevé/critique' : 'people at high/critical food risk'}.`,
        isFr ? 'Synthèse chiffrée' : 'Key Metrics',
      );
      addParagraph(
        isFr ? zoneRep.definition.teleconnectionFr : zoneRep.definition.teleconnectionEn,
        isFr ? 'Mécanisme physique' : 'Teleconnection Physics',
      );
      addParagraph(
        isFr ? zoneRep.definition.agricultureEnergyFr : zoneRep.definition.agricultureEnergyEn,
        isFr ? 'Agriculture & Énergie' : 'Agriculture & Energy',
      );
      addParagraph(
        (isFr ? zoneRep.definition.recommendationsFr : zoneRep.definition.recommendationsEn).join(' | '),
        isFr ? 'Recommandations prioritaires' : 'Priority Recommendations',
      );
    });
  } else {
    // Full single-zone deep-dive report
    addHeading(
      isFr
        ? `1. Synthèse exécutive & Indicateurs clés — ${activeZone.definition.nameFr}`
        : `1. Executive Summary & Key Metrics — ${activeZone.definition.nameEn}`,
    );
    addParagraph(
      isFr ? activeZone.definition.perimeterNoteFr : activeZone.definition.perimeterNoteEn,
      isFr ? 'Périmètre couvert' : 'Covered Scope',
    );
    addParagraph(
      `${isFr ? 'Perte annuelle' : 'Annual Loss'} (${opts.year}): ${formatBillionsCurrency(activeZone.activeLossBUsd, opts.currency)} (${activeZone.activeGdpLossPct.toFixed(2)}% PIB) | ${isFr ? 'Cumul 2027–2031' : '2027–2031 Cum.'}: ${formatBillionsCurrency(activeZone.cumulative2027_2031BUsd, opts.currency)} | ${isFr ? 'Inflation additionnelle' : 'Added Inflation'}: +${activeZone.avgInflationAddPct.toFixed(1)}% | ${isFr ? 'Indice sécheresse / inondation / déplacement' : 'Drought / Flood / Displacement'}: ${activeZone.avgDroughtIdx} / ${activeZone.avgFloodIdx} / ${activeZone.avgDisplacementIdx} | ${isFr ? 'Pop. exposée risque élevé/critique' : 'High/Critical Risk Pop.'}: ${activeZone.criticalHighPopM.toFixed(1)} M.`,
      isFr ? 'Bilan consolidé' : 'Consolidated KPIs',
    );

    const trajPng = renderZoneTrajectoryChartPng(activeZone, isFr);
    if (trajPng) {
      ensureSpace(68);
      doc.addImage(trajPng, 'PNG', margin, y, pageWidth - margin * 2, 64);
      y += 69;
    }

    addHeading(isFr ? '2. Mécanisme physique ENSO & Téléconnexion zonale' : '2. Physical ENSO & Zonal Teleconnection');
    addParagraph(isFr ? activeZone.definition.teleconnectionFr : activeZone.definition.teleconnectionEn);

    addHeading(isFr ? '3. Vulnérabilités agricoles, hydriques & énergétiques' : '3. Agricultural, Water & Energy Vulnerabilities');
    addParagraph(isFr ? activeZone.definition.agricultureEnergyFr : activeZone.definition.agricultureEnergyEn);

    addHeading(isFr ? '4. Risques macroéconomiques, inflation & déplacements humains' : '4. Macroeconomic, Inflation & Displacement Risks');
    addParagraph(isFr ? activeZone.definition.macroDisplacementFr : activeZone.definition.macroDisplacementEn);

    addHeading(isFr ? '5. Plan de recommandations stratégiques consolidées' : '5. Consolidated Strategic Recommendations');
    const recs = isFr ? activeZone.definition.recommendationsFr : activeZone.definition.recommendationsEn;
    recs.forEach((rec, i) => addParagraph(rec, `Action ${i + 1}`));

    addHeading(isFr ? '6. Trajectoire pluriannuelle 2027–2032 de la zone' : '6. 2027–2032 Multi-Year Zonal Trajectory');
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      head: [[
        isFr ? 'Année' : 'Year',
        isFr ? 'Perte zonale' : 'Zonal Loss',
        '% PIB',
        '+CPI %',
        isFr ? 'Sécheresse' : 'Drought',
        isFr ? 'Inondation' : 'Flood',
        isFr ? 'Déplacement' : 'Displacement',
      ]],
      body: activeZone.trajectory2027_2032.map((pt) => [
        String(pt.year),
        formatBillionsCurrency(pt.lossBUsd, opts.currency),
        `${pt.gdpLossPct.toFixed(2)}%`,
        `+${pt.avgInflationAddPct.toFixed(1)}%`,
        String(pt.avgDroughtIdx),
        String(pt.avgFloodIdx),
        String(pt.avgDisplacementIdx),
      ]),
    });
    y = ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? y) + 8;

    addHeading(
      isFr
        ? `7. Annexe exhaustive par État membre (${activeZone.countryCount} pays · ${opts.year})`
        : `7. Complete Member State Annex (${activeZone.countryCount} countries · ${opts.year})`,
    );
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7.5, cellPadding: 1.8 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      head: [[
        'ISO',
        isFr ? 'Pays' : 'Country',
        isFr ? 'Pop. (M)' : 'Pop. (M)',
        'PIB Δ%',
        isFr ? `Perte ${opts.year}` : `${opts.year} Loss`,
        isFr ? 'Cumul 27-31' : 'Cum. 27-31',
        '+CPI %',
        isFr ? 'Risque alim.' : 'Food Risk',
      ]],
      body: activeZone.members.map((m) => [
        m.country.iso2,
        sanitizePdf(isFr ? m.country.nameFr : m.country.nameEn),
        m.country.popM.toFixed(1),
        `${m.gdpDeltaPct.toFixed(2)}%`,
        formatBillionsCurrency(m.lossBUsd, opts.currency),
        formatBillionsCurrency(m.cumulative2027_2031BUsd, opts.currency),
        `+${m.inflationAddPct.toFixed(1)}%`,
        sanitizePdf(m.famineRisk),
      ]),
    });
  }

  // Page footer attribution on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text(
      sanitizePdf(`${lic.licenseHolder} · DG ${lic.directorName} · Madagascar El Nino Observatory`),
      margin,
      pageHeight - 8,
    );
    doc.text(`${i} / ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  const filename =
    opts.reportScope === 'consolidated-all-13'
      ? `Rapport_ElNino_Consolide_13_Zones_${opts.year}_${opts.scenario}.pdf`
      : `Rapport_ElNino_${opts.zoneId}_${opts.year}_${opts.scenario}.pdf`;

  doc.save(filename);
  emitPdfDownloadSuccess({
    filename,
    kind: 'scientific',
    pagesCount: totalPages,
    horizonYear: opts.year,
    scenario: opts.scenario,
  });

  return filename;
}

export async function exportZonalReportWord(opts: ZonalReportExportOptions): Promise<string> {
  const isFr = opts.lang === 'fr';
  const lic = LICENSE_ATTRIBUTION[opts.lang] ?? LICENSE_ATTRIBUTION.fr;
  const all13 = computeAll13ZonesConsolidated({
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });
  const activeZone = computeZoneConsolidatedAnalysis({
    zoneId: opts.zoneId,
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });

  const chartPng =
    opts.reportScope === 'consolidated-all-13'
      ? renderZonalComparisonChartPng({
          title: isFr
            ? `Pertes El Nino par zone (${opts.year})`
            : `El Nino Economic Losses by Zone (${opts.year})`,
          items: [...all13]
            .sort((a, b) => b.activeLossBUsd - a.activeLossBUsd)
            .map((z) => ({
              label: isFr ? z.definition.nameFr : z.definition.nameEn,
              valueBUsd: z.activeLossBUsd,
              highlight: z.definition.id === opts.zoneId,
            })),
        })
      : renderZoneTrajectoryChartPng(activeZone, isFr);

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'D4D4D8' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D4D4D8' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'D4D4D8' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'D4D4D8' },
  };

  const makeCell = (text: string, header = false) =>
    new TableCell({
      borders: cellBorder,
      shading: header ? { type: ShadingType.SOLID, color: '1E3A8A', fill: '1E3A8A' } : undefined,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: header,
              color: header ? 'FFFFFF' : '18181B',
              size: 18,
            }),
          ],
        }),
      ],
    });

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun({
          text:
            opts.reportScope === 'consolidated-all-13'
              ? isFr
                ? 'Rapport Consolidé El Niño — 13 Zones & Blocs Régionaux'
                : 'Consolidated El Niño Report — 13 Global Zones & Regional Blocs'
              : isFr
                ? `Rapport Complet El Niño — ${activeZone.definition.nameFr}`
                : `Full El Niño Report — ${activeZone.definition.nameEn}`,
          bold: true,
          color: '1E3A8A',
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${lic.platformName} · ${lic.licenseHolder} (DG ${lic.directorName}) · Horizon ${opts.year} · ${opts.scenario.toUpperCase()} · ${opts.currency}`,
          italics: true,
          color: '52525B',
          size: 20,
        }),
      ],
    }),
  ];

  if (chartPng) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            data: dataUrlToUint8Array(chartPng),
            transformation: { width: 580, height: opts.reportScope === 'consolidated-all-13' ? 270 : 225 },
            type: 'png',
          }),
        ],
      }),
    );
  }

  if (opts.reportScope === 'consolidated-all-13') {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: isFr ? 'Synthèse des 13 zones consolidées' : 'Consolidated 13-Zone Comparison Table',
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              makeCell(isFr ? 'Zone / Bloc' : 'Zone / Bloc', true),
              makeCell(isFr ? 'États' : 'States', true),
              makeCell(isFr ? `Perte ${opts.year}` : `${opts.year} Loss`, true),
              makeCell('% PIB', true),
              makeCell(isFr ? 'Cumul 2027-31' : 'Cum. 2027-31', true),
              makeCell('+CPI %', true),
            ],
          }),
          ...all13.map(
            (z) =>
              new TableRow({
                children: [
                  makeCell(isFr ? z.definition.nameFr : z.definition.nameEn),
                  makeCell(String(z.countryCount)),
                  makeCell(formatBillionsCurrency(z.activeLossBUsd, opts.currency)),
                  makeCell(`${z.activeGdpLossPct.toFixed(2)}%`),
                  makeCell(formatBillionsCurrency(z.cumulative2027_2031BUsd, opts.currency)),
                  makeCell(`+${z.avgInflationAddPct.toFixed(1)}%`),
                ],
              }),
          ),
        ],
      }),
    );

    all13.forEach((z) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240 },
          text: `${isFr ? z.definition.nameFr : z.definition.nameEn} (${z.countryCount} ${isFr ? 'États' : 'States'})`,
        }),
        new Paragraph({ text: isFr ? z.definition.perimeterNoteFr : z.definition.perimeterNoteEn }),
        new Paragraph({ text: isFr ? z.definition.teleconnectionFr : z.definition.teleconnectionEn }),
        new Paragraph({ text: isFr ? z.definition.agricultureEnergyFr : z.definition.agricultureEnergyEn }),
        new Paragraph({
          text: `${isFr ? 'Recommandations' : 'Recommendations'}: ${(isFr ? z.definition.recommendationsFr : z.definition.recommendationsEn).join(' · ')}`,
        }),
      );
    });
  } else {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: isFr ? 'Analyse détaillée par pilier' : 'Detailed Pillar Analysis',
      }),
      new Paragraph({ text: isFr ? activeZone.definition.perimeterNoteFr : activeZone.definition.perimeterNoteEn }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, text: isFr ? 'Téléconnexion ENSO' : 'ENSO Teleconnection' }),
      new Paragraph({ text: isFr ? activeZone.definition.teleconnectionFr : activeZone.definition.teleconnectionEn }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, text: isFr ? 'Agriculture & Énergie' : 'Agriculture & Energy' }),
      new Paragraph({ text: isFr ? activeZone.definition.agricultureEnergyFr : activeZone.definition.agricultureEnergyEn }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, text: isFr ? 'Macroéconomie & Déplacements' : 'Macro & Displacement' }),
      new Paragraph({ text: isFr ? activeZone.definition.macroDisplacementFr : activeZone.definition.macroDisplacementEn }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, text: isFr ? 'Recommandations stratégiques' : 'Strategic Recommendations' }),
      ...(isFr ? activeZone.definition.recommendationsFr : activeZone.definition.recommendationsEn).map(
        (rec, idx) => new Paragraph({ text: `${idx + 1}. ${rec}` }),
      ),
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: isFr
          ? `Annexe pays membres — ${activeZone.definition.nameFr}`
          : `Member States Annex — ${activeZone.definition.nameEn}`,
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              makeCell('ISO', true),
              makeCell(isFr ? 'Pays' : 'Country', true),
              makeCell(isFr ? `Perte ${opts.year}` : `${opts.year} Loss`, true),
              makeCell('PIB Δ%', true),
              makeCell(isFr ? 'Cumul 27-31' : 'Cum. 27-31', true),
              makeCell(isFr ? 'Risque' : 'Risk', true),
            ],
          }),
          ...activeZone.members.map(
            (m) =>
              new TableRow({
                children: [
                  makeCell(m.country.iso2),
                  makeCell(isFr ? m.country.nameFr : m.country.nameEn),
                  makeCell(formatBillionsCurrency(m.lossBUsd, opts.currency)),
                  makeCell(`${m.gdpDeltaPct.toFixed(2)}%`),
                  makeCell(formatBillionsCurrency(m.cumulative2027_2031BUsd, opts.currency)),
                  makeCell(m.famineRisk),
                ],
              }),
          ),
        ],
      }),
    );
  }

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${lic.licenseHolder} · Madagascar El Niño Observatory`,
                    size: 16,
                    color: '71717A',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `DG ${lic.directorName} · Page `, size: 16, color: '71717A' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '71717A' }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename =
    opts.reportScope === 'consolidated-all-13'
      ? `Rapport_ElNino_Consolide_13_Zones_${opts.year}_${opts.scenario}.docx`
      : `Rapport_ElNino_${opts.zoneId}_${opts.year}_${opts.scenario}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
}

export function exportZonalReportExcel(opts: ZonalReportExportOptions): string {
  const isFr = opts.lang === 'fr';
  const all13 = computeAll13ZonesConsolidated({
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });
  const activeZone = computeZoneConsolidatedAnalysis({
    zoneId: opts.zoneId,
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });

  const wb = XLSX.utils.book_new();

  const summaryRows = all13.map((z) => ({
    Zone_ID: z.definition.id,
    Zone_Code: z.definition.code,
    Zone_Name: isFr ? z.definition.nameFr : z.definition.nameEn,
    Member_States: z.countryCount,
    Population_M: z.totalPopM,
    Baseline_GDP_BUsd: z.totalGdpB,
    Year: opts.year,
    Scenario: opts.scenario.toUpperCase(),
    Loss_BUsd: z.activeLossBUsd,
    GDP_Loss_Pct: z.activeGdpLossPct,
    Cumulative_2027_2031_BUsd: z.cumulative2027_2031BUsd,
    Mean_CPI_Inflation_Add_Pct: z.avgInflationAddPct,
    Drought_Idx: z.avgDroughtIdx,
    Flood_Idx: z.avgFloodIdx,
    Displacement_Idx: z.avgDisplacementIdx,
    High_Critical_Risk_Pop_M: z.criticalHighPopM,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'Consolidated_13_Zones');

  const countryRows = (opts.reportScope === 'consolidated-all-13' ? all13 : [activeZone]).flatMap((z) =>
    z.members.map((m) => ({
      Zone_ID: z.definition.id,
      Zone_Name: isFr ? z.definition.nameFr : z.definition.nameEn,
      ISO2: m.country.iso2,
      Country: isFr ? m.country.nameFr : m.country.nameEn,
      Population_M: m.country.popM,
      GDP_BUsd: m.country.gdpB,
      GDP_Delta_Pct: m.gdpDeltaPct,
      Loss_BUsd: m.lossBUsd,
      Cumulative_2027_2031_BUsd: m.cumulative2027_2031BUsd,
      Inflation_Add_Pct: m.inflationAddPct,
      Drought_Idx: m.droughtIdx,
      Flood_Idx: m.floodIdx,
      Displacement_Idx: m.displacementIdx,
      Food_Risk_Tier: m.famineRisk,
    })),
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(countryRows), 'Member_States_Detail');

  const trajectoryRows = activeZone.trajectory2027_2032.map((t) => ({
    Zone_Name: isFr ? activeZone.definition.nameFr : activeZone.definition.nameEn,
    Year: t.year,
    Loss_BUsd: t.lossBUsd,
    GDP_Loss_Pct: t.gdpLossPct,
    Mean_Inflation_Add_Pct: t.avgInflationAddPct,
    Mean_Drought_Idx: t.avgDroughtIdx,
    Mean_Flood_Idx: t.avgFloodIdx,
    Mean_Displacement_Idx: t.avgDisplacementIdx,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(trajectoryRows), 'Trajectory_2027_2032');

  const filename =
    opts.reportScope === 'consolidated-all-13'
      ? `Rapport_ElNino_Consolide_13_Zones_${opts.year}_${opts.scenario}.xlsx`
      : `Rapport_ElNino_${opts.zoneId}_${opts.year}_${opts.scenario}.xlsx`;

  XLSX.writeFile(wb, filename);
  return filename;
}

export function exportZonalReportCsv(opts: ZonalReportExportOptions): string {
  const isFr = opts.lang === 'fr';
  const all13 = computeAll13ZonesConsolidated({
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });
  const activeZone = computeZoneConsolidatedAnalysis({
    zoneId: opts.zoneId,
    year: opts.year,
    scenario: opts.scenario,
    liveFactor: opts.liveFactor,
  });

  const targetZones = opts.reportScope === 'consolidated-all-13' ? all13 : [activeZone];
  const header = [
    'record_type',
    'zone_id',
    'zone_name',
    'iso2',
    'country_name',
    'year',
    'scenario',
    'pop_m',
    'gdp_busd',
    'loss_busd',
    'gdp_impact_pct',
    'cumulative_2027_2031_busd',
    'inflation_add_pct',
    'drought_idx',
    'flood_idx',
    'displacement_idx',
    'food_risk',
  ];

  const rows: string[][] = [];
  targetZones.forEach((z) => {
    const zName = isFr ? z.definition.nameFr : z.definition.nameEn;
    rows.push([
      'ZONE_SUMMARY',
      z.definition.id,
      zName,
      'ALL',
      `${z.countryCount} states`,
      String(opts.year),
      opts.scenario.toUpperCase(),
      z.totalPopM.toFixed(1),
      z.totalGdpB.toFixed(1),
      z.activeLossBUsd.toFixed(2),
      z.activeGdpLossPct.toFixed(2),
      z.cumulative2027_2031BUsd.toFixed(1),
      z.avgInflationAddPct.toFixed(1),
      String(z.avgDroughtIdx),
      String(z.avgFloodIdx),
      String(z.avgDisplacementIdx),
      `${z.criticalHighPopM.toFixed(1)}M high/critical`,
    ]);
    z.members.forEach((m) => {
      rows.push([
        'MEMBER_COUNTRY',
        z.definition.id,
        zName,
        m.country.iso2,
        isFr ? m.country.nameFr : m.country.nameEn,
        String(opts.year),
        opts.scenario.toUpperCase(),
        m.country.popM.toFixed(1),
        m.country.gdpB.toFixed(1),
        m.lossBUsd.toFixed(3),
        m.gdpDeltaPct.toFixed(2),
        m.cumulative2027_2031BUsd.toFixed(2),
        m.inflationAddPct.toFixed(1),
        String(m.droughtIdx),
        String(m.floodIdx),
        String(m.displacementIdx),
        m.famineRisk,
      ]);
    });
  });

  const csvContent = `\uFEFF${[
    header.map(escapeCsvCell).join(','),
    ...rows.map((r) => r.map(escapeCsvCell).join(',')),
  ].join('\r\n')}`;

  const filename =
    opts.reportScope === 'consolidated-all-13'
      ? `Rapport_ElNino_Consolide_13_Zones_${opts.year}_${opts.scenario}.csv`
      : `Rapport_ElNino_${opts.zoneId}_${opts.year}_${opts.scenario}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
}
