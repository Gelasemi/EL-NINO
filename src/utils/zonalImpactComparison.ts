import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ForecastYear } from '../data/worldEnso195Data';
import type { LanguageCode } from '../i18n/LanguageContext';
import type { CurrencyCode, ScenarioKey } from './economicAggregation';
import { EUR_PER_USD, MGA_PER_USD } from './economicAggregation';
import { escapeCsvCell } from './economicCsvExport';
import { emitPdfDownloadSuccess } from './pdfToastEvents';
import { LICENSE_ATTRIBUTION } from './scientificReportGenerator';
import {
  computeZoneConsolidatedAnalysis,
  type RegionalBlocZoneId,
  type ZonalAnalysisReport,
} from './zonalEnsoAnalysis';

export interface ZonalComparativeMetrics {
  zoneId: RegionalBlocZoneId;
  code: string;
  nameFr: string;
  nameEn: string;
  countryCount: number;
  totalPopM: number;
  totalGdpB: number;
  // El Niño Intensity Indices
  droughtIdx: number;
  floodIdx: number;
  displacementIdx: number;
  cpiInflationAddPct: number;
  ensoIntensityIndex: number; // 0..100 composite intensity
  // Agricultural Risks
  agriRiskScore: number; // 0..100
  criticalHighPopM: number;
  criticalHighPopSharePct: number;
  keyCommoditiesFr: string;
  keyCommoditiesEn: string;
  // Economic Resilience Metrics
  activeLossBUsd: number;
  activeGdpLossPct: number;
  cumulative2027_2031BUsd: number;
  recoveryRate2027to2032Pct: number; // % reduction from 2027 shock to 2032
  economicResilienceScore: number; // 0..100 (higher = more resilient)
  resilienceTierFr: 'Élevée' | 'Modérée' | 'Fragile' | 'Critique';
  resilienceTierEn: 'High' | 'Moderate' | 'Fragile' | 'Critical';
  rawReport: ZonalAnalysisReport;
}

const ZONE_COMMODITIES: Record<RegionalBlocZoneId, { fr: string; en: string }> = {
  'ocean-indien-coi': {
    fr: 'Riz, Maïs, Vanille, Girofle, Thon pélagique',
    en: 'Rice, Maize, Vanilla, Cloves, Pelagic tuna',
  },
  comesa: {
    fr: 'Maïs blanc, Blé importé, Thé, Café, Élevage',
    en: 'White maize, Imported wheat, Tea, Coffee, Livestock',
  },
  sadc: {
    fr: 'Maïs blanc, Sorgho, Manioc, Tabac, Cheptel bovin',
    en: 'White maize, Sorghum, Cassava, Tobacco, Cattle',
  },
  asean: {
    fr: 'Riz (Thaïlande/Viêt Nam), Huile de palme, Café Robusta, Caoutchouc',
    en: 'Rice (Thailand/Viet Nam), Palm oil, Robusta coffee, Rubber',
  },
  ue: {
    fr: 'Blé tendre, Huile d’olive, Viticulture, Importations cacao/café',
    en: 'Soft wheat, Olive oil, Vineyards, Imported cocoa/coffee',
  },
  afrique: {
    fr: 'Maïs, Mil, Sorgho, Riz, Cacao (Côte d’Ivoire/Ghana), Café',
    en: 'Maize, Millet, Sorghum, Rice, Cocoa (Côte d’Ivoire/Ghana), Coffee',
  },
  oceanie: {
    fr: 'Blé australien, Orge, Canne à sucre, Viande bovine, Taro/Igname',
    en: 'Australian wheat, Barley, Sugar cane, Beef, Taro/Yam',
  },
  'amerique-latine': {
    fr: 'Anchois (farine poisson), Café Arabica, Soja, Sucre, Maïs/Haricots',
    en: 'Anchovies (fishmeal), Arabica coffee, Soybeans, Sugar, Maize/Beans',
  },
  caraibes: {
    fr: 'Canne à sucre, Bananes, Maraîchage, Pêche récifale',
    en: 'Sugar cane, Bananas, Vegetables, Reef fisheries',
  },
  'amerique-du-nord': {
    fr: 'Maïs, Soja, Blé des prairies, Fruits/Légumes Californie',
    en: 'Corn, Soybeans, Prairie wheat, California specialty crops',
  },
  'europe-est': {
    fr: 'Blé d’hiver, Maïs danubien, Tournesol, Orge Mer Noire',
    en: 'Winter wheat, Danube maize, Sunflower, Black Sea barley',
  },
  'moyen-orient': {
    fr: 'Blé/Orge irrigués, Dattes, Cultures du Nil, Importations céréales',
    en: 'Irrigated wheat/barley, Dates, Nile crops, Grain imports',
  },
  asie: {
    fr: 'Riz irrigué/pluvial, Blé, Huile de palme, Thé, Sucre, Aquaculture',
    en: 'Irrigated/rainfed rice, Wheat, Palm oil, Tea, Sugar, Aquaculture',
  },
};

export const ZONAL_COMPARISON_PRESETS: {
  id: string;
  labelFr: string;
  labelEn: string;
  zones: RegionalBlocZoneId[];
}[] = [
  {
    id: 'io-africa-blocs',
    labelFr: 'Océan Indien & Blocs Afrique (COI · COMESA · SADC · Afrique)',
    labelEn: 'Indian Ocean & Africa Blocs (IOC · COMESA · SADC · Africa)',
    zones: ['ocean-indien-coi', 'comesa', 'sadc', 'afrique'],
  },
  {
    id: 'global-south-vs-north',
    labelFr: 'Comparatif Nord / Sud (COI · SADC · ASEAN · Am. latine · UE · Am. Nord)',
    labelEn: 'North vs. South Benchmark (IOC · SADC · ASEAN · LATAM · EU · North America)',
    zones: ['ocean-indien-coi', 'sadc', 'asean', 'amerique-latine', 'ue', 'amerique-du-nord'],
  },
  {
    id: 'asia-pacific-mena',
    labelFr: 'Indo-Pacifique & Moyen-Orient (COI · ASEAN · Asie · Océanie · Moyen-Orient)',
    labelEn: 'Indo-Pacific & Middle East (IOC · ASEAN · Asia · Oceania · Middle East)',
    zones: ['ocean-indien-coi', 'asean', 'asie', 'oceanie', 'moyen-orient'],
  },
  {
    id: 'americas-europe',
    labelFr: 'Amériques & Europe (Am. latine · Caraïbes · Am. Nord · UE · Europe Est)',
    labelEn: 'Americas & Europe (LATAM · Caribbean · North America · EU · Eastern Europe)',
    zones: ['amerique-latine', 'caraibes', 'amerique-du-nord', 'ue', 'europe-est'],
  },
];

function clampScore(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function buildComparativeVisualReportData(params: {
  zoneIds: RegionalBlocZoneId[];
  year: ForecastYear;
  scenario: ScenarioKey;
  liveFactor?: number;
}): {
  items: ZonalComparativeMetrics[];
  highestIntensity: ZonalComparativeMetrics | null;
  highestAgriRisk: ZonalComparativeMetrics | null;
  mostResilient: ZonalComparativeMetrics | null;
  radarMetrics: {
    axisFr: string;
    axisEn: string;
    [zoneKey: string]: string | number;
  }[];
} {
  const uniqueIds = Array.from(new Set(params.zoneIds));
  const targetIds: RegionalBlocZoneId[] =
    uniqueIds.length > 0 ? uniqueIds : ['ocean-indien-coi', 'sadc', 'asean', 'ue'];

  const items: ZonalComparativeMetrics[] = targetIds.map((zoneId) => {
    const raw = computeZoneConsolidatedAnalysis({
      zoneId,
      year: params.year,
      scenario: params.scenario,
      liveFactor: params.liveFactor,
    });

    const criticalHighPopSharePct =
      raw.totalPopM > 0 ? Number(((raw.criticalHighPopM / raw.totalPopM) * 100).toFixed(1)) : 0;

    // Composite El Niño Intensity Index (0..100): peak hazard balance + displacement + CPI pressure
    const peakHazard = Math.max(raw.avgDroughtIdx, raw.avgFloodIdx);
    const meanHazard = (raw.avgDroughtIdx + raw.avgFloodIdx) / 2;
    const ensoIntensityIndex = clampScore(
      peakHazard * 0.42 +
        meanHazard * 0.22 +
        raw.avgDisplacementIdx * 0.2 +
        Math.min(100, raw.avgInflationAddPct * 8.5) * 0.16,
    );

    // Weighted economic tier exposure (how concentrated GDP/pop is in climate-sensitive tiers)
    const developingShare =
      raw.members.reduce(
        (acc, m) =>
          acc +
          m.country.popM *
            (m.country.tier === 'tropical-developing' ? 1.0 : m.country.tier === 'emerging' ? 0.62 : 0.18),
        0,
      ) / Math.max(1, raw.totalPopM);

    const agriRiskScore = clampScore(
      developingShare * 36 +
        (criticalHighPopSharePct / 100) * 26 +
        Math.max(raw.avgDroughtIdx, raw.avgFloodIdx) * 0.24 +
        Math.min(100, raw.avgInflationAddPct * 7) * 0.14,
    );

    const loss2027 = raw.trajectory2027_2032.find((t) => t.year === 2027)?.lossBUsd ?? raw.activeLossBUsd;
    const loss2032 = raw.trajectory2027_2032.find((t) => t.year === 2032)?.lossBUsd ?? raw.activeLossBUsd;
    const recoveryRate2027to2032Pct =
      loss2027 > 0 ? Number((((loss2027 - loss2032) / loss2027) * 100).toFixed(1)) : 0;

    const advancedGdpShare =
      raw.members.reduce(
        (acc, m) =>
          acc +
          m.country.gdpB *
            (m.country.tier === 'advanced' ? 1.0 : m.country.tier === 'emerging' ? 0.55 : 0.18),
        0,
      ) / Math.max(1, raw.totalGdpB);

    // Economic Resilience Score (0..100, higher = stronger capacity to absorb & recover from ENSO shocks)
    const gdpLossPenalty = Math.min(48, raw.activeGdpLossPct * 11.5);
    const displacementPenalty = raw.avgDisplacementIdx * 0.24;
    const rawResilience =
      46 +
      advancedGdpShare * 38 +
      Math.max(-10, Math.min(16, recoveryRate2027to2032Pct * 0.3)) -
      gdpLossPenalty -
      displacementPenalty;
    const economicResilienceScore = clampScore(rawResilience);

    const resilienceTierFr: ZonalComparativeMetrics['resilienceTierFr'] =
      economicResilienceScore >= 72
        ? 'Élevée'
        : economicResilienceScore >= 52
          ? 'Modérée'
          : economicResilienceScore >= 34
            ? 'Fragile'
            : 'Critique';

    const resilienceTierEn: ZonalComparativeMetrics['resilienceTierEn'] =
      economicResilienceScore >= 72
        ? 'High'
        : economicResilienceScore >= 52
          ? 'Moderate'
          : economicResilienceScore >= 34
            ? 'Fragile'
            : 'Critical';

    const comm = ZONE_COMMODITIES[zoneId];

    return {
      zoneId,
      code: raw.definition.code,
      nameFr: raw.definition.nameFr,
      nameEn: raw.definition.nameEn,
      countryCount: raw.countryCount,
      totalPopM: raw.totalPopM,
      totalGdpB: raw.totalGdpB,
      droughtIdx: raw.avgDroughtIdx,
      floodIdx: raw.avgFloodIdx,
      displacementIdx: raw.avgDisplacementIdx,
      cpiInflationAddPct: raw.avgInflationAddPct,
      ensoIntensityIndex,
      agriRiskScore,
      criticalHighPopM: raw.criticalHighPopM,
      criticalHighPopSharePct,
      keyCommoditiesFr: comm.fr,
      keyCommoditiesEn: comm.en,
      activeLossBUsd: raw.activeLossBUsd,
      activeGdpLossPct: raw.activeGdpLossPct,
      cumulative2027_2031BUsd: raw.cumulative2027_2031BUsd,
      recoveryRate2027to2032Pct,
      economicResilienceScore,
      resilienceTierFr,
      resilienceTierEn,
      rawReport: raw,
    };
  });

  const highestIntensity =
    items.length > 0
      ? [...items].sort((a, b) => b.ensoIntensityIndex - a.ensoIntensityIndex)[0]
      : null;
  const highestAgriRisk =
    items.length > 0 ? [...items].sort((a, b) => b.agriRiskScore - a.agriRiskScore)[0] : null;
  const mostResilient =
    items.length > 0
      ? [...items].sort((a, b) => b.economicResilienceScore - a.economicResilienceScore)[0]
      : null;

  // Multi-axis Radar profile for up to 6 selected zones
  const radarZones = items.slice(0, 6);
  const axes = [
    { key: 'drought', axisFr: 'Sécheresse', axisEn: 'Drought', get: (m: ZonalComparativeMetrics) => m.droughtIdx },
    { key: 'flood', axisFr: 'Inondations', axisEn: 'Floods', get: (m: ZonalComparativeMetrics) => m.floodIdx },
    {
      key: 'inflation',
      axisFr: 'Inflation CPI',
      axisEn: 'CPI Inflation',
      get: (m: ZonalComparativeMetrics) => clampScore(m.cpiInflationAddPct * 9),
    },
    { key: 'agri', axisFr: 'Risque Agricole', axisEn: 'Agri Risk', get: (m: ZonalComparativeMetrics) => m.agriRiskScore },
    {
      key: 'resilience',
      axisFr: 'Résilience Éco.',
      axisEn: 'Eco. Resilience',
      get: (m: ZonalComparativeMetrics) => m.economicResilienceScore,
    },
  ];

  const radarMetrics = axes.map((ax) => {
    const row: { axisFr: string; axisEn: string; [zoneKey: string]: string | number } = {
      axisFr: ax.axisFr,
      axisEn: ax.axisEn,
    };
    radarZones.forEach((z) => {
      row[z.zoneId] = ax.get(z);
    });
    return row;
  });

  return {
    items,
    highestIntensity,
    highestAgriRisk,
    mostResilient,
    radarMetrics,
  };
}

function renderComparativeDashboardChartPng(
  items: ZonalComparativeMetrics[],
  year: ForecastYear,
  scenario: ScenarioKey,
  isFr: boolean,
): string {
  const width = 940;
  const height = Math.max(300, 100 + items.length * 36);
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
  ctx.fillText(
    isFr
      ? `Comparatif Zonal El Nino (${year} · ${scenario.toUpperCase()}) : Intensite, Risque Agricole & Resilience`
      : `Comparative Zonal El Nino Report (${year} · ${scenario.toUpperCase()}): Intensity, Agri Risk & Resilience`,
    24,
    34,
  );

  // Legend
  const legendItems = [
    { color: '#B45309', label: isFr ? 'Intensite ENSO (0-100)' : 'ENSO Intensity (0-100)' },
    { color: '#BE123C', label: isFr ? 'Risque Agricole (0-100)' : 'Agricultural Risk (0-100)' },
    { color: '#047857', label: isFr ? 'Resilience Eco. (0-100)' : 'Eco Resilience (0-100)' },
  ];
  let lx = 24;
  legendItems.forEach((leg) => {
    ctx.fillStyle = leg.color;
    ctx.fillRect(lx, 48, 12, 10);
    ctx.fillStyle = '#3F3F46';
    ctx.font = '11px sans-serif';
    ctx.fillText(leg.label, lx + 17, 57);
    lx += 195;
  });

  const leftPad = 215;
  const rightPad = 56;
  const topPad = 82;
  const barAreaW = width - leftPad - rightPad;

  items.forEach((item, idx) => {
    const y = topPad + idx * 36;
    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 11.5px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText((isFr ? item.nameFr : item.nameEn).slice(0, 28), leftPad - 12, y + 18);

    // Track lines
    ctx.fillStyle = '#F4F4F5';
    ctx.fillRect(leftPad, y + 2, barAreaW, 24);

    // 3 thin stacked metric bars
    const wInt = (item.ensoIntensityIndex / 100) * barAreaW;
    const wAgri = (item.agriRiskScore / 100) * barAreaW;
    const wRes = (item.economicResilienceScore / 100) * barAreaW;

    ctx.fillStyle = '#B45309';
    ctx.fillRect(leftPad, y + 3, wInt, 6);

    ctx.fillStyle = '#BE123C';
    ctx.fillRect(leftPad, y + 11, wAgri, 6);

    ctx.fillStyle = '#047857';
    ctx.fillRect(leftPad, y + 19, wRes, 6);

    ctx.fillStyle = '#27272A';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${item.ensoIntensityIndex} / ${item.agriRiskScore} / ${item.economicResilienceScore}`,
      leftPad + Math.max(wInt, wAgri, wRes) + 6,
      y + 18,
    );
  });

  return canvas.toDataURL('image/png');
}

function formatCur(bUsd: number, currency: CurrencyCode): string {
  if (currency === 'EUR') return `${(bUsd * EUR_PER_USD).toFixed(2)} B EUR`;
  if (currency === 'MGA') return `${((bUsd * MGA_PER_USD) / 1000).toFixed(1)} T Ar`;
  return `${bUsd.toFixed(2)} B USD`;
}

export interface CooperativeZoneBrief {
  zoneId: RegionalBlocZoneId;
  code: string;
  zoneName: string;
  countryCount: number;
  intensityIndex: number;
  agriRiskScore: number;
  resilienceScore: number;
  resilienceTier: string;
  commodities: string;
  agriSummary: string;
  actions: string[];
}

export interface CooperativeZonalReportPayload {
  generatedAtIso: string;
  year: ForecastYear;
  scenario: ScenarioKey;
  currency: CurrencyCode;
  oniObservedC: number;
  liveFactor: number;
  hasLiveScrape: boolean;
  totalZones: number;
  totalStates: number;
  totalPopM: number;
  totalAtRiskPopM: number;
  totalActiveLossFormatted: string;
  highestIntensityLabel: string;
  highestAgriRiskLabel: string;
  mostResilientLabel: string;
  zoneBriefs: CooperativeZoneBrief[];
  offlineChecklist: string[];
}

export function buildCooperativeZonalReportPayload(params: {
  items: ZonalComparativeMetrics[];
  year: ForecastYear;
  scenario: ScenarioKey;
  currency: CurrencyCode;
  lang: LanguageCode;
  oniObservedC?: number;
  liveFactor?: number;
  hasLiveScrape?: boolean;
}): CooperativeZonalReportPayload {
  const {
    items,
    year,
    scenario,
    currency,
    lang,
    oniObservedC = 3.5,
    liveFactor = 1,
    hasLiveScrape = false,
  } = params;
  const isFr = lang === 'fr';

  const totalStates = items.reduce((s, z) => s + z.countryCount, 0);
  const totalPopM = items.reduce((s, z) => s + z.totalPopM, 0);
  const totalAtRiskPopM = items.reduce((s, z) => s + z.criticalHighPopM, 0);
  const totalLossBUsd = items.reduce((s, z) => s + z.activeLossBUsd, 0);

  const highestIntensity =
    items.length > 0
      ? [...items].sort((a, b) => b.ensoIntensityIndex - a.ensoIntensityIndex)[0]
      : null;
  const highestAgriRisk =
    items.length > 0 ? [...items].sort((a, b) => b.agriRiskScore - a.agriRiskScore)[0] : null;
  const mostResilient =
    items.length > 0
      ? [...items].sort((a, b) => b.economicResilienceScore - a.economicResilienceScore)[0]
      : null;

  const zoneBriefs: CooperativeZoneBrief[] = items.map((z) => ({
    zoneId: z.zoneId,
    code: z.code,
    zoneName: isFr ? z.nameFr : z.nameEn,
    countryCount: z.countryCount,
    intensityIndex: z.ensoIntensityIndex,
    agriRiskScore: z.agriRiskScore,
    resilienceScore: z.economicResilienceScore,
    resilienceTier: isFr ? z.resilienceTierFr : z.resilienceTierEn,
    commodities: isFr ? z.keyCommoditiesFr : z.keyCommoditiesEn,
    agriSummary: isFr
      ? z.rawReport.definition.agricultureEnergyFr
      : z.rawReport.definition.agricultureEnergyEn,
    actions: isFr
      ? z.rawReport.definition.recommendationsFr
      : z.rawReport.definition.recommendationsEn,
  }));

  const offlineChecklist = isFr
    ? [
        '[ ] Semences : basculer 35-50 % des surfaces pluviales vers des varietes cycle court (90 j : sorgho, mil, niebe, riz tolerant).',
        '[ ] Eau & Sol : curer les canaux d’irrigation avant les pluies, activer les tours d’eau (AWD) et pailler en SCV / poquets Zai.',
        '[ ] Stockage hors ligne : securiser les recoltes en sacs hermetiques PICS / greniers sureleves avant la soudure.',
        '[ ] Financement & Alerte : verifier l’eligibilite assurance parametrique (ARC/CCRIF), fonds FDA-R / DEFIS et alertes SMS 3-2-1.',
      ]
    : [
        '[ ] Seeds: shift 35-50% of rainfed plots to short-cycle 90-day cultivars (sorghum, millet, cowpea, drought/flood rice).',
        '[ ] Water & Soil: clear irrigation canals ahead of rains, enforce AWD water rotation, and apply SCV mulch or Zai pits.',
        '[ ] Offline Storage: store buffer grain in PICS hermetic bags and elevated flood-safe community silos ahead of lean season.',
        '[ ] Finance & Early Warning: verify parametric insurance triggers (ARC/CCRIF), cooperative credit lines & 3-2-1 SMS alerts.',
      ];

  return {
    generatedAtIso: new Date().toISOString(),
    year,
    scenario,
    currency,
    oniObservedC,
    liveFactor,
    hasLiveScrape,
    totalZones: items.length,
    totalStates,
    totalPopM: Number(totalPopM.toFixed(1)),
    totalAtRiskPopM: Number(totalAtRiskPopM.toFixed(1)),
    totalActiveLossFormatted: formatCur(totalLossBUsd, currency),
    highestIntensityLabel: highestIntensity
      ? `${isFr ? highestIntensity.nameFr : highestIntensity.nameEn} (${highestIntensity.ensoIntensityIndex}/100)`
      : '-',
    highestAgriRiskLabel: highestAgriRisk
      ? `${isFr ? highestAgriRisk.nameFr : highestAgriRisk.nameEn} (${highestAgriRisk.agriRiskScore}/100)`
      : '-',
    mostResilientLabel: mostResilient
      ? `${isFr ? mostResilient.nameFr : mostResilient.nameEn} (${mostResilient.economicResilienceScore}/100)`
      : '-',
    zoneBriefs,
    offlineChecklist,
  };
}

export function exportComparativeZonalDashboardPdf(params: {
  items: ZonalComparativeMetrics[];
  year: ForecastYear;
  scenario: ScenarioKey;
  currency: CurrencyCode;
  lang: LanguageCode;
  oniObservedC?: number;
  liveFactor?: number;
  hasLiveScrape?: boolean;
}): string {
  const { items, year, scenario, currency, lang } = params;
  const isFr = lang === 'fr';
  const lic = LICENSE_ATTRIBUTION[lang] ?? LICENSE_ATTRIBUTION.fr;
  const payload = buildCooperativeZonalReportPayload(params);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageWidth - margin * 2;

  // Clean, ink-conscious header band suitable for printing & offline cooperative binders
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.text(
    isFr
      ? `RAPPORT ZONAL EL NINO POUR COOPERATIVES AGRICOLES (${payload.totalZones} ZONES · ${year})`
      : `ZONAL IMPACT REPORT FOR AGRICULTURAL COOPERATIVES (${payload.totalZones} ZONES · ${year})`,
    margin,
    11,
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `${lic.platformName} · ${lic.licenseHolder} (DG ${lic.directorName}) · ${scenario.toUpperCase()} · ${currency} · ONI +${payload.oniObservedC.toFixed(1)}C (${payload.hasLiveScrape ? `Live x${payload.liveFactor.toFixed(2)}` : 'Model Baseline'})`,
    margin,
    18.5,
  );

  // Executive State Summary Strip (4 clean bordered print boxes)
  let y = 30;
  const boxGap = 3;
  const boxW = (contentW - boxGap * 3) / 4;
  const kpiBoxes = [
    {
      label: isFr ? 'PERIMETRE COMPARE' : 'COMPARED FOOTPRINT',
      value: `${payload.totalZones} zones · ${payload.totalStates} ${isFr ? 'Etats' : 'States'}`,
      sub: `${payload.totalActiveLossFormatted} · ${payload.totalAtRiskPopM}M ${isFr ? 'exposes' : 'at risk'}`,
    },
    {
      label: isFr ? 'INTENSITE ENSO MAX' : 'PEAK ENSO INTENSITY',
      value: payload.highestIntensityLabel,
      sub: `Horizon ${year} · ${scenario.toUpperCase()}`,
    },
    {
      label: isFr ? 'RISQUE AGRICOLE AIGU' : 'HIGHEST AGRI RISK',
      value: payload.highestAgriRiskLabel,
      sub: isFr ? 'Alerte prioritaire semences/eau' : 'Priority seed & water action',
    },
    {
      label: isFr ? 'MEILLEURE RESILIENCE' : 'TOP ECO RESILIENCE',
      value: payload.mostResilientLabel,
      sub: isFr ? 'Referentiel adaptation 2027-32' : '2027-32 adaptation benchmark',
    },
  ];

  kpiBoxes.forEach((box, idx) => {
    const bx = margin + idx * (boxW + boxGap);
    doc.setFillColor(249, 248, 244);
    doc.setDrawColor(212, 212, 216);
    doc.roundedRect(bx, y, boxW, 17, 1.5, 1.5, 'FD');
    doc.setTextColor(113, 113, 122);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(box.label, bx + 3, y + 5);
    doc.setTextColor(24, 24, 27);
    doc.setFontSize(8.5);
    doc.text(box.value.slice(0, 36), bx + 3, y + 10.5);
    doc.setTextColor(82, 82, 91);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(box.sub.slice(0, 40), bx + 3, y + 14.8);
  });

  y += 21;
  const png = renderComparativeDashboardChartPng(items, year, scenario, isFr);
  if (png) {
    const imgH = Math.min(68, Math.max(44, 20 + items.length * 4.5));
    doc.addImage(png, 'PNG', margin, y, contentW, imgH);
    y += imgH + 4;
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    styles: { fontSize: 7.2, cellPadding: 1.8, textColor: [24, 24, 27] },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 248, 244] },
    head: [
      [
        isFr ? 'Zone / Bloc' : 'Zone / Bloc',
        isFr ? 'Etats' : 'States',
        isFr ? 'Intensite' : 'Intensity',
        isFr ? 'Sech./Inond.' : 'Drought/Flood',
        isFr ? 'Risque Agri' : 'Agri Risk',
        isFr ? 'Filieres agricoles exposees' : 'Exposed Commodities',
        isFr ? `Perte ${year}` : `${year} Loss`,
        '% PIB',
        isFr ? 'Resilience' : 'Resilience',
      ],
    ],
    body: items.map((z) => [
      isFr ? z.nameFr : z.nameEn,
      String(z.countryCount),
      `${z.ensoIntensityIndex}/100`,
      `${z.droughtIdx} / ${z.floodIdx}`,
      `${z.agriRiskScore}/100 (${z.criticalHighPopM.toFixed(1)}M)`,
      (isFr ? z.keyCommoditiesFr : z.keyCommoditiesEn).slice(0, 48),
      formatCur(z.activeLossBUsd, currency),
      `${z.activeGdpLossPct.toFixed(2)}%`,
      `${z.economicResilienceScore}/100 (${isFr ? z.resilienceTierFr : z.resilienceTierEn})`,
    ]),
  });

  // Page 2+: Printable Offline Field Advisory & Cooperative Readiness Checklist
  doc.addPage('a4', 'landscape');
  doc.setFillColor(4, 120, 87);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(
    isFr
      ? 'CAHIER HORS LIGNE POUR COOPERATIVES AGRICOLES — MESURES PAR ZONE & LISTE TERRAIN'
      : 'OFFLINE FIELD BRIEF FOR AGRICULTURAL COOPERATIVES — ZONAL ACTIONS & CHECKLIST',
    margin,
    12.5,
  );

  // Offline Cooperative Checklist Box
  let cy = 26;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, cy, contentW, 28, 1.5, 1.5, 'FD');
  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    isFr
      ? 'PROTOCOLE TERRAIN PRIORITAIRE DES COOPERATIVES (IMPRIMABLE POUR REUNIONS SANS CONNEXION)'
      : 'COOPERATIVE FIELD READINESS CHECKLIST (PRINTABLE FOR OFFLINE MEETINGS)',
    margin + 4,
    cy + 5.5,
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(24, 24, 27);
  payload.offlineChecklist.forEach((line, idx) => {
    doc.text(line, margin + 4, cy + 11 + idx * 4.5);
  });

  cy += 33;

  autoTable(doc, {
    startY: cy,
    margin: { left: margin, right: margin },
    styles: { fontSize: 7.4, cellPadding: 2.2, valign: 'top', textColor: [24, 24, 27] },
    headStyles: { fillColor: [4, 120, 87], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 46 },
      2: { cellWidth: 74 },
      3: { cellWidth: 'auto' },
    },
    head: [
      [
        isFr ? 'Zone selectionnee' : 'Selected Zone',
        isFr ? 'Cultures & Risque' : 'Crops & Risk Score',
        isFr ? 'Impact agricole & hydrique' : 'Agricultural & Water Impact',
        isFr ? 'Actions recommandees pour cooperatives agricoles' : 'Recommended Cooperative Field Actions',
      ],
    ],
    body: payload.zoneBriefs.map((zb) => [
      `${zb.zoneName} (${zb.countryCount})`,
      `${zb.commodities}\n[Agri ${zb.agriRiskScore}/100 · Res. ${zb.resilienceScore}/100]`,
      zb.agriSummary,
      zb.actions.slice(0, 3).map((a, i) => `${i + 1}. ${a}`).join('\n'),
    ]),
  });

  const totalPages = doc.getNumberOfPages();
  const dateTag = payload.generatedAtIso.slice(0, 10);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text(
      `${lic.licenseHolder} · DG ${lic.directorName} · ${isFr ? 'Consultation hors ligne cooperatives' : 'Offline cooperative reference'} · ${dateTag}`,
      margin,
      pageHeight - 7,
    );
    doc.text(`${i} / ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  const filename = `Cooperative_Zonal_Impact_Report_${items.length}zones_${year}_${scenario}.pdf`;
  doc.save(filename);
  emitPdfDownloadSuccess({
    filename,
    kind: 'scientific',
    pagesCount: totalPages,
    horizonYear: year,
    scenario,
  });
  return filename;
}

export function exportComparativeZonalDashboardCsv(params: {
  items: ZonalComparativeMetrics[];
  year: ForecastYear;
  scenario: ScenarioKey;
  lang: LanguageCode;
}): string {
  const { items, year, scenario, lang } = params;
  const isFr = lang === 'fr';
  const header = [
    'zone_id',
    'zone_code',
    'zone_name',
    'member_states',
    'population_m',
    'year',
    'scenario',
    'enso_intensity_index',
    'drought_idx',
    'flood_idx',
    'displacement_idx',
    'cpi_inflation_add_pct',
    'agri_risk_score',
    'at_risk_pop_m',
    'at_risk_pop_share_pct',
    'key_commodities',
    'annual_loss_busd',
    'gdp_loss_pct',
    'cumulative_2027_2031_busd',
    'recovery_2027_to_2032_pct',
    'economic_resilience_score',
    'resilience_tier',
  ];

  const rows = items.map((z) => [
    z.zoneId,
    z.code,
    isFr ? z.nameFr : z.nameEn,
    String(z.countryCount),
    z.totalPopM.toFixed(1),
    String(year),
    scenario.toUpperCase(),
    String(z.ensoIntensityIndex),
    String(z.droughtIdx),
    String(z.floodIdx),
    String(z.displacementIdx),
    z.cpiInflationAddPct.toFixed(1),
    String(z.agriRiskScore),
    z.criticalHighPopM.toFixed(1),
    z.criticalHighPopSharePct.toFixed(1),
    isFr ? z.keyCommoditiesFr : z.keyCommoditiesEn,
    z.activeLossBUsd.toFixed(2),
    z.activeGdpLossPct.toFixed(2),
    z.cumulative2027_2031BUsd.toFixed(1),
    z.recoveryRate2027to2032Pct.toFixed(1),
    String(z.economicResilienceScore),
    isFr ? z.resilienceTierFr : z.resilienceTierEn,
  ]);

  const content = `\uFEFF${[
    header.map(escapeCsvCell).join(','),
    ...rows.map((r) => r.map(escapeCsvCell).join(',')),
  ].join('\r\n')}`;

  const filename = `Zonal_Impact_Dashboard_${items.length}zones_${year}_${scenario}.csv`;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
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
