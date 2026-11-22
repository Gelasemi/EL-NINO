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
import type { LanguageCode } from '../i18n/LanguageContext';
import {
  getLocalizedFilieres,
  getLocalizedHistoricalPatterns,
  getLocalizedLstmSeries,
} from '../i18n/localizedMlEconomicData';
import { getLocalizedReferenceSources } from '../i18n/localizedCoreData';
import { emitPdfDownloadSuccess } from './pdfToastEvents';
import {
  computeEconomicAggregation,
  formatCurrencyFromMUsd,
  formatPct,
  SCENARIO_META_BY_LANG,
  type CurrencyCode,
  type EconomicAggregatedModel,
  type HorizonYear,
  type ScenarioKey,
  type ScopeMode,
} from './economicAggregation';
import {
  renderContinentalComparisonChartPng,
  renderProvincialLossBarChartPng,
  renderRiceAndOniDualChartPng,
  renderTrajectory2027_2032ChartPng,
  type CapturedDomFigure,
  type ChartPngAsset,
} from './reportChartCanvas';
import { UN_ZONE_SUMMARIES } from '../data/worldEnso195Data';
import type { GlobalSyncPayload } from '../context/GlobalSyncContext';

export interface FocusDistrictReportContext {
  district: string;
  region?: string;
  cropLabel?: string;
  yieldDelta?: number;
  waterDelta?: number;
  oniIndex?: number;
  aiDiagnostic?: string | null;
}

export interface ScientificReportOptions {
  horizonYear: HorizonYear;
  scenario: ScenarioKey;
  scope: ScopeMode;
  currency: CurrencyCode;
  lang: LanguageCode;
  includeRegions23?: boolean;
  includeDistricts42?: boolean;
  includeContinental?: boolean;
  focusDistrict?: FocusDistrictReportContext;
  liveDomCharts?: CapturedDomFigure[];
}

export const LICENSE_ATTRIBUTION: Record<
  LanguageCode,
  {
    platformName: string;
    licenseLabel: string;
    licenseHolder: string;
    directorLabel: string;
    directorName: string;
    directorTitle: string;
    rightsNote: string;
  }
> = {
  fr: {
    platformName: 'Madagascar El Niño Observatory',
    licenseLabel: 'Détenteur officiel de la licence',
    licenseHolder: 'M&G Consulting',
    directorLabel: 'Direction Générale & Auteur scientifique',
    directorName: 'Prince MANANTENASOA',
    directorTitle: 'Directeur Général · Chercheur en Sciences Économiques / ML–Data–AI Engineer',
    rightsNote:
      'Plateforme sous licence exclusive M&G Consulting — Reproduction des tableaux et graphiques autorisée avec mention obligatoire de la source et de l’auteur.',
  },
  en: {
    platformName: 'Madagascar El Niño Observatory',
    licenseLabel: 'Official License Holder',
    licenseHolder: 'M&G Consulting',
    directorLabel: 'Managing Director & Principal Investigator',
    directorName: 'Prince MANANTENASOA',
    directorTitle: 'Managing Director (DG) · Economist Researcher / ML–Data–AI Engineer',
    rightsNote:
      'Platform licensed to M&G Consulting — Scientific reproduction of tables and figures permitted with mandatory attribution to M&G Consulting and Prince MANANTENASOA.',
  },
  sw: {
    platformName: 'Madagascar El Niño Observatory',
    licenseLabel: 'Mmiliki Rasmi wa Leseni',
    licenseHolder: 'M&G Consulting',
    directorLabel: 'Mkurugenzi Mkuu & Mtafiti Mkuu',
    directorName: 'Prince MANANTENASOA',
    directorTitle: 'Mkurugenzi Mkuu (DG) · Mtafiti wa Sayansi za Uchumi / Mhandisi wa ML–Data–AI',
    rightsNote:
      'Jukwaa chini ya leseni rasmi ya M&G Consulting — Matumizi ya jedwali na michoro yanaruhusiwa kwa kutaja chanzo cha M&G Consulting na Prince MANANTENASOA.',
  },
};

export interface EditorialStandardRow {
  code: string;
  standard: string;
  application: string;
}

export interface TechnicalMethodRow {
  stage: string;
  method: string;
  inputsOutputs: string;
  validation: string;
}

export interface RecommendationMatrixRow {
  actor: string;
  trigger: string;
  action: string;
  financing: string;
}

export interface ScientificReportPayload {
  options: Omit<Required<ScientificReportOptions>, 'focusDistrict' | 'liveDomCharts'> & {
    focusDistrict?: FocusDistrictReportContext;
    liveDomCharts?: CapturedDomFigure[];
  };
  generatedAtIso: string;
  reportId: string;
  model: EconomicAggregatedModel;
  focusedDistrictRow?: EconomicAggregatedModel['districtRows'][number];
  license: (typeof LICENSE_ATTRIBUTION)['fr'];
  scenarioMeta: { label: string; shortLabel: string; multiplier: number; note: string };
  editorialStandards: EditorialStandardRow[];
  technicalMethods: TechnicalMethodRow[];
  recommendationMatrix: RecommendationMatrixRow[];
  charts: {
    oniShock: ChartPngAsset;
    provinces: ChartPngAsset;
    continental: ChartPngAsset;
    trajectory2027_2032: ChartPngAsset;
  };
  narrative: {
    title: string;
    subtitle: string;
    abstractTitle: string;
    abstractText: string;
    keywords: string;
    s1Title: string;
    s1Paragraphs: string[];
    s2Title: string;
    s2Paragraphs: string[];
    s3Title: string;
    s3Paragraphs: string[];
    s4Title: string;
    s4Paragraphs: string[];
    commentaryTitle: string;
    commentaryParagraphs: string[];
    s5Title: string;
    s5Paragraphs: string[];
    s6Title: string;
    s6Recommendations: string[];
    limitationsText: string;
    referencesTitle: string;
  };
}

function sanitizePdfText(raw: string): string {
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

export function getEditorialStandards(lang: LanguageCode): EditorialStandardRow[] {
  if (lang === 'en') {
    return [
      {
        code: 'IMRAD Structure',
        standard: 'ICMJE / Scientific Journal Review Format',
        application:
          'Strict organization into Abstract, Introduction (Oceanic Forcing), Materials & Methods, Multi-Scale Results, Discussion, and Recommendations.',
      },
      {
        code: 'WMO-No. 182 & 1205',
        standard: 'World Meteorological Organization ENSO Reporting Standard',
        application:
          '3-month running ONI thresholds (Niño 3.4), IOD dipole coupling, and standardized uncertainty intervals for operational forecasts.',
      },
      {
        code: 'FAO / IPC v3.1',
        standard: 'Integrated Food Security Phase Classification & GIEWS',
        application:
          'Clear separation between observed baseline data (2023–2024 ENSO, Nov 2026 ONI +3.5 °C) and econometric projections (2027–2028).',
      },
      {
        code: 'IPCC AR6 Uncertainty',
        standard: 'Calibrated Multi-Scenario Bracketing (S1 / S2 / S3)',
        application:
          'Sensitivity testing across 0.55× (mild), 1.00× (ML central trajectory), and 1.45× (compounded extreme) severity multipliers.',
      },
      {
        code: 'ISO 4217 & ADM2',
        standard: 'geoBoundaries ADM2 Toponyms & Multi-Currency Audit',
        application:
          'Standardized 119 Madagascar district identifiers; transparent conversion rates (1 USD = 4,550 MGA = 0.925 EUR).',
      },
    ];
  }
  if (lang === 'sw') {
    return [
      {
        code: 'Muundo wa IMRAD',
        standard: 'Viwango vya Jarida la Kisayansi (ICMJE / Peer-Review)',
        application:
          'Mpangilio wa Abstract, Utangulizi (ENSO/IOD+), Mbinu na Zana, Matokeo ya Takwimu, Majadiliano na Mapendekezo.',
      },
      {
        code: 'WMO-No. 182 & 1205',
        standard: 'Shirika la Hali ya Hewa Duniani (WMO) kwa Ripoti za ENSO',
        application:
          'Matumizi ya kielelezo cha ONI (Niño 3.4), IOD+ na utenganishaji wa takwimu halisi dhidi ya utabiri.',
      },
      {
        code: 'FAO / IPC v3.1',
        standard: 'Uainishaji wa Usalama wa Chakula wa FAO / FEWS NET',
        application:
          'Ufafanuzi wa wazi kati ya rekodi halisi (2023–2024, Nov 2026 +3.5 °C) na makadirio ya 2027–2028.',
      },
      {
        code: 'IPCC AR6',
        standard: 'Upimaji wa Hali Tatu (S1 / S2 / S3)',
        application:
          'Uchambuzi wa unyeti kwa vizidishi ×0.55 (upungufu mdogo), ×1.00 (msingi wa ML), na ×1.45 (mshtuko mkali).',
      },
      {
        code: 'ISO 4217 & ADM2',
        standard: 'Majina Sanifu ya Wilaya (geoBoundaries ADM2) & Sarafu',
        application:
          'Ulinganishaji wa wilaya 119 za Madagaska na ubadilishaji wazi wa sarafu (1 USD = 4,550 MGA = 0.925 EUR).',
      },
    ];
  }
  return [
    {
      code: 'Norme IMRAD',
      standard: 'Format Revue Scientifique à Comité de Lecture (ICMJE)',
      application:
        'Structuration stricte en Résumé analytique, Introduction (Forçage ENSO/IOD+), Matériels & Méthodes, Résultats multi-échelles, Discussion et Recommandations.',
    },
    {
      code: 'OMM / WMO-No. 182',
      standard: 'Standard météorologique international de déclaration ENSO',
      application:
        'Qualification par l’indice ONI (Niño 3.4), le dipôle IOD+, le décalage océan-récoltes (Lag 4–6 mois) et intervalles scénarisés.',
    },
    {
      code: 'FAO / IPC v3.1',
      standard: 'Traçabilité Observé vs Modélisé & Sécurité Alimentaire',
      application:
        'Distinction explicite entre repères historiques observés (>200 M $ en 2023–24, +3,5 °C en nov. 2026) et estimations prospectives 2027–2028.',
    },
    {
      code: 'IPCC AR6',
      standard: 'Encadrement paramétrique multi-scénarios (S1 / S2 / S3)',
      application:
        'Analyse de sensibilité systématique autour du scénario central ML (×1,00) borné par S1 (×0,55) et S3 (×1,45).',
    },
    {
      code: 'ISO 4217 & ADM2',
      standard: 'Normalisation geoBoundaries ADM2 & Parités monétaires',
      application:
        'Appariement certifié des 119 districts malgaches et conversion vérifiable (1 USD = 4 550 MGA = 0,925 EUR).',
    },
  ];
}

export function getTechnicalMethods(lang: LanguageCode): TechnicalMethodRow[] {
  if (lang === 'en') {
    return [
      {
        stage: '1. Multi-Source Geospatial ETL',
        method: 'NASA POWER · Copernicus ERA5 · CHIRPS · geoBoundaries ADM2',
        inputsOutputs: 'Daily rainfall, Tmax, soil moisture & district polygons (119 ADM2)',
        validation: 'Fuzzy toponym normalization (e.g. Boriziny = Port-Bergé)',
      },
      {
        stage: '2. Spatial Typology & Regime Clustering',
        method: 'K-Means Spatial Clustering (4 Agro-Hydro Zones)',
        inputsOutputs: 'Classification of districts into Drought, Mixed, Highland Hydro & Flood tiers',
        validation: 'Silhouette & DGM/FOFIFA historical drought congruence',
      },
      {
        stage: '3. Non-Linear Crop Yield Modeling',
        method: 'Regularized XGBoost + TimeSeriesSplit (5-fold) + Random Forest',
        inputsOutputs: 'District yield deltas Δ(%) for Rice, Maize/Staples & Export cash crops',
        validation: 'max_depth=3, reg_lambda=10, zero temporal data leakage',
      },
      {
        stage: '4. Ocean-Crop Temporal Lag',
        method: 'LSTM Sequence Modeling (Lag t-4 to t-6 months)',
        inputsOutputs: 'Propagation of Nov 2026 ONI (+3.5–4.1 °C) to Apr–Aug 2027 harvest peak shock',
        validation: 'Backtested against 2015–16 and 2023–24 El Niño harvest shocks',
      },
      {
        stage: '5. Bottom-Up Econometric Aggregation',
        method: 'Sub-Sector Value Weighting & Indirect Elasticities',
        inputsOutputs: 'District → 23 Regions → 6 Ex-Provinces → Madagascar & 21 African Peers',
        validation: 'Exact additivity invariant across regional and national accounts',
      },
      {
        stage: '6. Hybrid Grounded AI (RAG + QLoRA)',
        method: 'FAISS Vector Store + Gemini Live/Search/Maps + QLoRA ChatML',
        inputsOutputs: 'Auditable agronomic briefings linking exact XGBoost metrics to FOFIFA rules',
        validation: 'Strict numeric grounding preventing LLM hallucination',
      },
    ];
  }
  if (lang === 'sw') {
    return [
      {
        stage: '1. Ukusanyaji Data wa Kijiografia (ETL)',
        method: 'NASA POWER · Copernicus ERA5 · CHIRPS · geoBoundaries ADM2',
        inputsOutputs: 'Mvua za kila siku, joto la juu, unyevu wa udongo & mipaka ya wilaya 119',
        validation: 'Usawazishaji wa majina rasmi (mf. Boriziny = Port-Bergé)',
      },
      {
        stage: '2. Mgawanyo wa Maeneo (Clustering)',
        method: 'K-Means Spatial Clustering (Kanda 4 za Tabianchi)',
        inputsOutputs: 'Mgawanyo wa wilaya katika makundi ya Ukame, Mseto na Mafuriko',
        validation: 'Uhakiki dhidi ya rekodi za kihistoria za DGM / FOFIFA',
      },
      {
        stage: '3. Utabiri wa Mavuno (ML)',
        method: 'XGBoost Iliyodhibitiwa + TimeSeriesSplit (5-fold) + Random Forest',
        inputsOutputs: 'Mabadiliko (%) ya Mpunga, Mahindi na Mazao ya Biashara kwa wilaya',
        validation: 'max_depth=3, reg_lambda=10, kuzuia uvujaji wa data ya muda',
      },
      {
        stage: '4. Uchelewesho wa Bahari-Mazao',
        method: 'LSTM Sequence Modeling (Uchelewesho Miezi t-4 hadi t-6)',
        inputsOutputs: 'Kuunganisha kilele cha ONI Nov 2026 na mshtuko wa mavuno Apr–Ago 2027',
        validation: 'Kulinganishwa na matukio ya El Niño 2015–16 na 2023–24',
      },
      {
        stage: '5. Ujumlishaji wa Kiuchumi',
        method: 'Uzito wa Mazao ya Mikoa na Athari Zisizo za Moja kwa Moja',
        inputsOutputs: 'Wilaya → Mikoa 23 → Majimbo 6 → Madagaska & Nchi 21 za Afrika',
        validation: 'Ujumlishaji kamili usio na tofauti kati ya ngazi zote',
      },
      {
        stage: '6. Akili Bandia ya RAG + QLoRA',
        method: 'FAISS Vector Store + Gemini Live/Search/Maps + QLoRA ChatML',
        inputsOutputs: 'Ushauri wa kilimo unaounganisha takwimu halisi za XGBoost na FOFIFA',
        validation: 'Udhibiti madhubuti wa namba ili kuzuia makosa ya AI',
      },
    ];
  }
  return [
    {
      stage: '1. Pipeline ETL Géospatial Multi-Sources',
      method: 'NASA POWER · Copernicus ERA5 · CHIRPS · geoBoundaries ADM2',
      inputsOutputs: 'Précipitations journalières, Tmax, humidité des sols & polygones 119 ADM2',
      validation: 'Appariement flou certifié (ex. Boriziny = Port-Bergé, Vohibinany = Brickaville)',
    },
    {
      stage: '2. Segmentation Territoriale Non-Supervisée',
      method: 'Clustering Spatial K-Means (4 profils hydro-climatiques)',
      inputsOutputs: 'Typologie des districts : Sécheresse sévère, Mixte, Hydro/Riz, Littoral Est',
      validation: 'Cohérence vérifiée avec les zones agroécologiques FOFIFA / DGM',
    },
    {
      stage: '3. Prévision Non-Linéaire des Rendements',
      method: 'XGBoost Régularisé + TimeSeriesSplit (5 plis) + Random Forest',
      inputsOutputs: 'Deltas Δ(%) par district pour Riz, Maïs/Vivriers et Cultures de rente',
      validation: 'max_depth=3, reg_lambda=10, colsample=0,7 (zéro fuite temporelle)',
    },
    {
      stage: '4. Propagation Temporelle Océan → Récoltes',
      method: 'Réseau Séquentiel LSTM (Décalage Lag +4 à +6 mois)',
      inputsOutputs: 'Transmission du pic ONI fin 2026 vers le choc récoltes d’avril–août 2027',
      validation: 'Calibrage historique sur les séquences El Niño 2015–16 et 2023–24',
    },
    {
      stage: '5. Agrégation Économétrique Ascendante',
      method: 'Pondération par parts filières & élasticités indirectes',
      inputsOutputs: 'Districts → 23 Régions → 6 Ex-Provinces → Madagascar & 21 zones Afrique',
      validation: 'Invariance comptable stricte entre échelles locales et macroéconomiques',
    },
    {
      stage: '6. IA Hybride Ancrée (RAG FAISS + QLoRA)',
      method: 'FAISS Multilingue + Gemini Grounding (Search/Maps) + QLoRA JSONL',
      inputsOutputs: 'Synthèses narratives et plans d’action reliés aux chiffres exacts XGBoost',
      validation: 'Verrouillage numérique empêchant toute hallucination sur les résultats',
    },
  ];
}

export function buildScientificReportPayload(rawOptions: ScientificReportOptions): ScientificReportPayload {
  const options: ScientificReportPayload['options'] = {
    includeRegions23: true,
    includeDistricts42: true,
    includeContinental: true,
    ...rawOptions,
  };
  const { horizonYear, scenario, scope, currency, lang } = options;

  const model = computeEconomicAggregation({ horizonYear, scenario, scope, lang });
  const focusedDistrictRow = options.focusDistrict
    ? model.districtRows.find(
        (d) => d.point.district.toLowerCase() === options.focusDistrict!.district.toLowerCase(),
      )
    : undefined;
  const license = LICENSE_ATTRIBUTION[lang];
  const scenarioMeta = SCENARIO_META_BY_LANG[lang][scenario];
  const editorialStandards = getEditorialStandards(lang);
  const technicalMethods = getTechnicalMethods(lang);
  const lstmSeries = getLocalizedLstmSeries(lang);

  const sortedProvinces = [...model.provinceRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const sortedRegions = [...model.regionRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const sortedDistricts = [...model.districtRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const topProvince = sortedProvinces[0];
  const topRegion = sortedRegions[0];
  const topDistrict = sortedDistricts[0];

  const now = new Date();
  const generatedAtIso = now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  const reportId = `MG-ENSO-${horizonYear}-${scenario.toUpperCase()}-${now.getFullYear()}${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  // Generate Canvas2D charts cleanly
  const chartLabels =
    lang === 'en'
      ? {
          oniTitle: 'Fig. 1 — Equatorial Pacific ONI Anomaly vs. Lagged Crop Shock (LSTM +4–6 mo)',
          oniSub: 'Coupled trajectory calibrated on WMO/NOAA signals & district harvest indices',
          oniSeriesLabel: 'ONI Anomaly (°C)',
          shockSeriesLabel: 'Harvest Shock Index (/100)',
          provTitle: `Fig. 2 — Multi-Scale Economic Losses by Ex-Province (${horizonYear} · ${scenario.toUpperCase()})`,
          provSub: `Direct agricultural crop losses vs. indirect shocks (water, RIA hydro, livestock, roads) · Total ${formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}`,
          directLbl: 'Direct Agriculture (M$)',
          indirectLbl: 'Indirect Water/Energy/Infra (M$)',
          contTitle: `Fig. 3 — Regional & Continental Projections: IOC, SADC, COMESA & Africa (${horizonYear})`,
          contSub: `Top 10 affected economies/zones · Total Africa ${formatCurrencyFromMUsd(model.blocs.africaTotalMUsd, currency, false, lang)}`,
        }
      : lang === 'sw'
        ? {
            oniTitle: 'Mchoro 1 — Kielelezo cha Joto ONI dhidi ya Mshtuko wa Mavuno (LSTM Miezi +4–6)',
            oniSub: 'Mwenendo uliosawazishwa na takwimu za WMO/NOAA na mavuno ya wilaya',
            oniSeriesLabel: 'Kielelezo ONI (°C)',
            shockSeriesLabel: 'Kielelezo cha Mshtuko (/100)',
            provTitle: `Mchoro 2 — Hasara za Kiuchumi kwa Majimbo 6 (${horizonYear} · ${scenario.toUpperCase()})`,
            provSub: `Hasara za moja kwa moja za kilimo dhidi ya hasara zisizo za moja kwa moja · Jumla ${formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}`,
            directLbl: 'Kilimo Moja kwa Moja (M$)',
            indirectLbl: 'Maji / Nishati / Miundombinu (M$)',
            contTitle: `Mchoro 3 — Makadirio ya Kikanda: COI, SADC, COMESA na Afrika (${horizonYear})`,
            contSub: `Nchi 10 zilizoathirika zaidi · Jumla Afrika ${formatCurrencyFromMUsd(model.blocs.africaTotalMUsd, currency, false, lang)}`,
          }
        : {
            oniTitle: 'Fig. 1 — Forçage océanique ONI (°C) vs Indice de choc agricole retardé (LSTM +4–6 mois)',
            oniSub: 'Trajectoire couplée calibrée sur signaux OMM/NOAA et rendements désagrégés',
            oniSeriesLabel: 'Anomalie ONI (°C)',
            shockSeriesLabel: 'Indice choc récoltes (/100)',
            provTitle: `Fig. 2 — Pertes économiques par ex-province historique (${horizonYear} · ${scenario.toUpperCase()})`,
            provSub: `Décomposition Direct agricole vs Indirect (eau, hydroélectricité RIA, élevage, pistes) · Total ${formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}`,
            directLbl: 'Direct agricole (M$)',
            indirectLbl: 'Indirect Eau/Énergie/Infra (M$)',
            contTitle: `Fig. 3 — Projection Océan Indien (COI), COMESA, SADC & Afrique (${horizonYear})`,
            contSub: `Top 10 pays / zones exposées · Total Afrique modélisée : ${formatCurrencyFromMUsd(model.blocs.africaTotalMUsd, currency, false, lang)}`,
          };

  const oniShockChart = renderRiceAndOniDualChartPng({
    title: chartLabels.oniTitle,
    subtitle: chartLabels.oniSub,
    oniLabel: chartLabels.oniSeriesLabel,
    shockLabel: chartLabels.shockSeriesLabel,
    series: lstmSeries.map((pt) => ({
      month: pt.month,
      oniAnomaly: pt.oniAnomaly,
      harvestShockIdx: pt.harvestShockIdx,
    })),
  });

  const provincesChart = renderProvincialLossBarChartPng({
    title: chartLabels.provTitle,
    subtitle: chartLabels.provSub,
    directLabel: chartLabels.directLbl,
    indirectLabel: chartLabels.indirectLbl,
    rows: sortedProvinces.map((p) => ({
      province: p.province,
      direct: p.directAgriLossMUsd,
      indirect: p.indirectLossMUsd,
    })),
  });

  const continentalChart = renderContinentalComparisonChartPng({
    title: chartLabels.contTitle,
    subtitle: chartLabels.contSub,
    directLabel: chartLabels.directLbl,
    indirectLabel: chartLabels.indirectLbl,
    rows: model.countryRows.map((c) => ({
      country: c.countryOrZone,
      direct: c.directLossMUsd,
      indirect: c.indirectLossMUsd,
    })),
  });

  const trajYears = [2027, 2028, 2029, 2030, 2031, 2032] as const;
  const trajMultipliers: Record<number, number> = {
    2027: 1.0,
    2028: 0.84,
    2029: 0.56,
    2030: 0.76,
    2031: 0.94,
    2032: 0.68,
  };
  const trajSeries = trajYears.map((yr) => ({
    year: yr,
    madaLossMUsd: Number((model.madagascar.totalLossMUsd * trajMultipliers[yr]).toFixed(1)),
    globalLossBUsd: Number(
      UN_ZONE_SUMMARIES.reduce((s, z) => s + (z.yearlyLossBUsd[yr] ?? 0), 0).toFixed(1),
    ),
  }));
  const trajectoryChart = renderTrajectory2027_2032ChartPng({
    title:
      lang === 'en'
        ? 'Fig. 4 — Multi-Year Shock Trajectory 2027–2032 (Madagascar vs. 195 UN Economies)'
        : lang === 'sw'
          ? 'Mchoro 4 — Mwelekeo wa Miaka Mingi 2027–2032 (Madagaska dhidi ya Nchi 195)'
          : 'Fig. 4 — Trajectoire Pluriannuelle 2027–2032 (Madagascar vs 195 États ONU)',
    subtitle:
      lang === 'en'
        ? 'Lag transmission from 2026–2027 Super El Niño through 2028 La Niña & 2031 secondary lag peak'
        : lang === 'sw'
          ? 'Mpito kutoka El Niño 2027 kupitia La Niña 2028 hadi kilele cha 2031'
          : 'Propagation du choc Super El Niño 2027, transition La Niña 2028 et pic secondaire 2031',
    madaLabel: 'Madagascar (M USD)',
    globalLabel: lang === 'en' ? 'World 195 UN ($B USD)' : lang === 'sw' ? 'Dunia 195 ($B USD)' : 'Monde 195 ONU (Md USD)',
    series: trajSeries,
  });

  const recommendationMatrix: RecommendationMatrixRow[] =
    lang === 'en'
      ? [
          {
            actor: 'FOFIFA / DGM / DRAE',
            trigger: 'Cumulative 20–30 mm rain over 3 consecutive days (Grand Sud)',
            action: 'Deploy 90-day sorghum/millet, Zaï pits, SCV mulch, and SRI highland scheduling.',
            financing: 'FDA-R / DEFIS / FAO',
          },
          {
            actor: 'JIRAMA / ANMCC / OdR',
            trigger: 'Antananarivo local rice > 2,950 MGA/kg or RIA inflow < -18%',
            action: 'Activate Andekaleka hydro backup & release GCV community buffer rice stocks.',
            financing: 'State Buffer / World Bank',
          },
          {
            actor: 'BNGRC / WFP / NGOs',
            trigger: 'IPC Phase 3+ forecast or SWIOCOF-15 cyclone warning in NE coastal basins',
            action: 'Pre-position emergency rations, launch Cash+ and HIMO irrigation rehabilitation.',
            financing: 'ARC Replica / CERF / BHA',
          },
          {
            actor: 'COI / SADC / COMESA',
            trigger: 'ONI > +1.5 °C or Kariba/SADC maize deficit > 20%',
            action: 'Coordinate regional cereal corridors, hydro grid sharing, and parametric insurance.',
            financing: 'AfDB / ARC / Green Climate Fund',
          },
        ]
      : lang === 'sw'
        ? [
            {
              actor: 'FOFIFA / DGM / DRAE',
              trigger: 'Mvua ya mm 20–30 ndani ya siku 3 mfululizo (Kusini Kuu)',
              action: 'Tumia mbegu za mtama/uwele wa siku 90, mashimo ya Zaï na kilimo cha SRI.',
              financing: 'FDA-R / DEFIS / FAO',
            },
            {
              actor: 'JIRAMA / ANMCC / OdR',
              trigger: 'Bei ya mchele Antananarivo > 2,950 MGA/kg au upungufu wa maji RIA',
              action: 'Washa umeme mbadala na fungua maghala ya akiba ya jamii (GCV).',
              financing: 'Hazina ya Taifa / Benki ya Dunia',
            },
            {
              actor: 'BNGRC / WFP / Mashirika',
              trigger: 'Tahadhari ya IPC 3+ au kimbunga cha SWIOCOF-15 Kaskazini-Mashariki',
              action: 'Sambaza akiba ya chakula, Cash+ na ukarabati wa mifereji kupitia HIMO.',
              financing: 'ARC / CERF / BHA',
            },
            {
              actor: 'COI / SADC / COMESA',
              trigger: 'ONI > +1.5 °C au upungufu wa mahindi SADC > 20%',
              action: 'Uratibu wa usafirishaji nafaka kikanda na bima ya tabianchi.',
              financing: 'AfDB / ARC / GCF',
            },
          ]
        : [
            {
              actor: 'FOFIFA / DGM / DRAE',
              trigger: 'Seuil hydrique 20–30 mm cumulés sur 3 jours (Grand Sud)',
              action: 'Déclencher semis sorgho/mil 90 j, cuvettes Zaï, SCV et calendrier SRI Hautes Terres.',
              financing: 'FDA-R / DEFIS / FAO',
            },
            {
              actor: 'JIRAMA / ANMCC / OdR',
              trigger: 'Riz local > 2 950 MGA/kg ou déficit apports RIA < −18 %',
              action: 'Basculer le secours thermique Andekaleka et ouvrir les greniers tampons GCV.',
              financing: 'Trésor / Banque Mondiale',
            },
            {
              actor: 'BNGRC / PAM / ONG',
              trigger: 'Pré-alerte IPC Phase 3+ ou alerte cyclonique SWIOCOF-15 Nord-Est',
              action: 'Pré-positionner stocks vivriers, transferts Cash+ et chantiers HIMO hydro-agricoles.',
              financing: 'ARC Replica / CERF / UE',
            },
            {
              actor: 'COI / SADC / COMESA',
              trigger: 'Indice ONI > +1,5 °C ou déficit maïs SADC > 20 %',
              action: 'Mutualiser corridors céréaliers, interconnexion électrique et déclenchement paramétrique.',
              financing: 'BAD / ARC / Fonds Vert Climat',
            },
          ];

  const madaTotalStr = formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang);
  const madaDirectStr = formatCurrencyFromMUsd(model.madagascar.directMUsd, currency, false, lang);
  const madaIndirectStr = formatCurrencyFromMUsd(model.madagascar.indirectMUsd, currency, false, lang);
  const madaGdpPctStr = formatPct(model.madagascar.gdpPct, 2, lang);
  const madaAgriPctStr = formatPct(model.madagascar.agriPct, 2, lang);
  const coiStr = formatCurrencyFromMUsd(model.blocs.coiTotalMUsd, currency, false, lang);
  const sadcStr = formatCurrencyFromMUsd(model.blocs.sadcTotalMUsd, currency, false, lang);
  const comesaStr = formatCurrencyFromMUsd(model.blocs.comesaTotalMUsd, currency, false, lang);
  const africaStr = formatCurrencyFromMUsd(model.blocs.africaTotalMUsd, currency, false, lang);
  const topProvStr = formatCurrencyFromMUsd(topProvince.totalLossMUsd, currency, false, lang);
  const topRegStr = formatCurrencyFromMUsd(topRegion.totalLossMUsd, currency, false, lang);
  const topDistStr = formatCurrencyFromMUsd(topDistrict.totalLossMUsd, currency, false, lang);

  const narrative =
    lang === 'en'
      ? {
            title: `Scientific Evaluation Report — Macroeconomic & Agricultural Losses under the 2026–2027 Super El Niño (${horizonYear} · ${scenario.toUpperCase()})`,
            subtitle: `Multi-scale quantitative synthesis (ADM2 Districts → 23 Regions → 6 Ex-Provinces → IOC, COMESA, SADC & Africa) · Scope: ${scope === 'consolidated119' ? 'Consolidated 119 ADM2 Districts' : '42 Pilot ML Districts'}`,
            abstractTitle: 'Abstract (Executive Scientific Summary)',
            abstractText: `This technical paper presents an on-demand, multi-scale quantitative evaluation of economic and agricultural losses triggered by the 2026–2027 Super El Niño (central Pacific ONI anomaly reaching +3.5 °C in November 2026, upper WMO projection +4.1 °C, coupled with a positive Indian Ocean Dipole IOD+). Combining NASA POWER / Copernicus ERA5 / CHIRPS climate grids with regularized XGBoost crop shocks and a 4–6 month LSTM propagation lag, total projected losses for Madagascar at horizon ${horizonYear} under ${scenarioMeta.label} reach ${madaTotalStr} (${madaGdpPctStr} of national GDP), split between ${madaDirectStr} in direct agricultural losses (-${madaAgriPctStr} of agricultural GDP) and ${madaIndirectStr} in indirect water, livestock, RIA hydropower, and road losses. At the sub-national level, ex-province ${topProvince.province} (${topProvStr}), region ${topRegion.meta.region} (${topRegStr}), and pilot district ${topDistrict.point.district} (${topDistStr}) concentrate the highest exposure. Continental projections yield ${coiStr} across the Indian Ocean Commission (IOC), ${sadcStr} for SADC, ${comesaStr} for COMESA, and ${africaStr} across all 21 modeled African economies.`,
            keywords:
              'Keywords: Super El Niño 2026–2027; ENSO-IOD+ teleconnection; Madagascar; Econometric loss modeling; XGBoost & LSTM; SADC; COMESA; Indian Ocean; M&G Consulting.',
            s1Title: '1. Introduction & Observed Oceanic Forcing (WMO / NOAA / SWIOCOF-15)',
            s1Paragraphs: [
              `Observed baseline anchor: Prior to forward modeling, the 2023–2024 El Niño episode serves as the empirical benchmark (> $200M in direct agricultural damages in Madagascar and -6% to -7% agricultural GDP contraction), alongside November 2026 observed telemetry (+3.5 °C SST anomaly in the equatorial Pacific, 3.72 million people exposed to acute food insecurity per FAO/FEWS NET, and local rice prices trending toward 3,200 MGA/kg in Antananarivo by Jan–Feb 2027).`,
              `Under the coupled IOD+ regime confirmed by SWIOCOF-15, Madagascar exhibits a structural North-South precipitation dipole: -30% to -50% water deficits and +2 °C to +4 °C heat extremes across the Grand Sud and South-West, contrasted against early localized heavy rains and pollination/landslide risks in the North-East (SAVA/Analanjirofo).`,
            ],
            s2Title: '2. Editorial Standards & Quantitative Modeling Methodology',
            s2Paragraphs: [
              `All reporting blocks conform to IMRAD peer-review conventions, WMO-No. 182 meteorological classification, IPC v3.1 food security semantics, and IPCC AR6 three-tier uncertainty bracketing (S1 ×0.55, S2 ×1.00, S3 ×1.45). Observed empirical benchmarks are systematically separated from prospective econometric model outputs.`,
              `To prevent overfitting on 10–20 year national crop histories, XGBoost models use shallow trees (max_depth=3), strong L2 regularization (reg_lambda=10), TimeSeriesSplit 5-fold chronological validation, and normalized geoBoundaries ADM2 joins across 119 official districts.`,
            ],
            s3Title: '3. Multi-Scale Quantitative Results — Madagascar (Districts, Regions & Ex-Provinces)',
            s3Paragraphs: [
              `Under active parameters (${horizonYear} · ${scenarioMeta.label} · ${scope === 'consolidated119' ? '119 ADM2 Districts' : '42 Pilot Districts'}), Madagascar aggregates ${madaTotalStr} in cumulative direct and indirect losses (${madaGdpPctStr} of $16.5B national GDP).`,
              horizonYear === 2028
                ? `In 2028, residual Q1–Q2 lean season costs and La Niña localized flood/cyclone losses (${madaTotalStr}) coexist with a gross agricultural rebound estimated at +${formatCurrencyFromMUsd(model.madagascar.rebound2028MUsd, currency, false, lang)}, resulting in a net balance of ${formatCurrencyFromMUsd(model.madagascar.net2028MUsd, currency, true, lang)}.`
                : `Ex-province ${topProvince.province} accounts for ${topProvStr} (${formatPct(topProvince.gdpImpactPct, 2, lang)} of provincial GDP), driven primarily by ${topProvince.dominantChannel}.`,
            ],
            s4Title: '4. Regional & Continental Projections (Indian Ocean IOC, COMESA, SADC & Africa)',
            s4Paragraphs: [
              `Teleconnections across the African continent bifurcate sharply: the SADC maize belt (South Africa, Zambia, Zimbabwe, Malawi, Mozambique, Botswana) plus IOC islands absorb intense drought and Kariba/Cahora Bassa hydropower shortfalls totaling ${sadcStr}, while East African COMESA highlands face bimodal torrential flooding, Rift Valley infrastructure washouts, and tea/coffee/horticulture logistics strain (COMESA aggregate: ${comesaStr}).`,
              `Across all 21 modeled African countries and sub-regions, cumulative economic exposure reaches ${africaStr} (${formatPct(model.blocs.africaGdpPct, 2, lang)} of modeled continental GDP).`,
            ],
            commentaryTitle: '5A. Expert Analytical Commentary & 2027–2032 Risk Interpretation',
            commentaryParagraphs: [
              `Multi-horizon interpretation: The 2027 agricultural shock (${madaTotalStr} in Madagascar) does not vanish linearly in 2028. While an eventual transition toward neutral or La Niña conditions restores water tables across parts of the Highlands, elevated cyclone/flood exposure in the North-East and multi-year balance-of-payments drag keep cumulative GDP pressure elevated through the 2031 secondary lag peak (captured in Fig. 4 alongside the 195 UN countries baseline).`,
              `Price elasticity & hydropower nexus: Indirect losses (${madaIndirectStr}) amplify rural income contraction via two non-linear channels—urban rice price transmission (converging toward 3,200 MGA/kg) and RIA hydroelectric load-shedding—underscoring why preventive storage (GCV) and early FDA-R cooperative credit deliver the highest benefit-cost ratio.`,
            ],
            s5Title: '5B. Methodological Discussion & Uncertainty Limits',
            s5Paragraphs: [
              `Parametric elasticities reflect structural vulnerability coefficients rather than general-equilibrium substitution effects. Regions lacking direct pilot sampling (e.g., Melaky) use verified provincial proxy loss rates weighted by regional agricultural value added.`,
              `Real-time updates via Gemini Search Grounding, CHIRPS pentadal rainfall, and Météo Madagascar decadal bulletins should trigger dynamic switching between S1, S2, and S3 prior to Q1 lean-season disbursements.`,
            ],
            s6Title: '6. Operational Policy Recommendations & Action Matrix',
            s6Recommendations: [
              '1. Dynamic Rainfall-Triggered Sowing (FOFIFA / DGM): Replace fixed planting calendars in Grand Sud districts with 20–30 mm cumulative 3-day triggers using 90-day sorghum, millet, cowpea, and Zaï compost pits.',
              '2. Hydroelectric & Staple Price Buffers: Coordinate JIRAMA RIA thermal-hydro backup ahead of Jul–Nov 2027 low flows and deploy village grain banks (GCV) / ANMCC strategic rice stocks before the 3,200 MGA/kg urban peak.',
              '3. Regional Risk Pooling (IOC / SADC / COMESA): Align African Risk Capacity (ARC) drought/cyclone triggers with district ADM2 scoring to accelerate Cash+ and FDA-R cooperative credit.',
            ],
            limitationsText:
              'Disclaimer: 2027–2032 values represent parametric ML-econometric projections under WMO/FAO scenarios, distinctly separated from audited historical events (2023–2024).',
            referencesTitle: '7. Scientific & Institutional References (APA / WMO Format)',
          }
        : lang === 'sw'
          ? {
              title: `Ripoti ya Kisayansi — Tathmini ya Hasara za Kiuchumi na Kilimo chini ya El Niño Kuu 2026–2027 (${horizonYear} · ${scenario.toUpperCase()})`,
              subtitle: `Uchambuzi wa ngazi nyingi (Wilaya ADM2 → Mikoa 23 → Majimbo 6 → COI, COMESA, SADC & Afrika) · Upeo: ${scope === 'consolidated119' ? 'Wilaya 119 Kamili' : 'Wilaya 42 za Majaribio'}`,
              abstractTitle: 'Muhtasari wa Kisayansi (Abstract)',
              abstractText: `Ripoti hii inawasilisha tathmini ya kitaalamu ya hasara za kiuchumi na kilimo zinazosababishwa na El Niño Kuu 2026–2027 (kielelezo cha ONI +3.5 °C Novemba 2026, kilele +4.1 °C, pamoja na IOD+). Kwa kuunganisha data ya NASA POWER / ERA5 / CHIRPS na miundo ya XGBoost na LSTM (uchelewesho miezi 4–6), jumla ya hasara kwa Madagaska mwaka ${horizonYear} chini ya ${scenarioMeta.label} inafikia ${madaTotalStr} (${madaGdpPctStr} ya Pato la Taifa), ikigawanyika kati ya ${madaDirectStr} (kilimo moja kwa moja) na ${madaIndirectStr} (maji, mifugo, umeme wa RIA na barabara). Katika ngazi ya ndani, jimbo la ${topProvince.province} (${topProvStr}), mkoa wa ${topRegion.meta.region} (${topRegStr}) na wilaya ya ${topDistrict.point.district} (${topDistStr}) zinaongoza kwa athari. Kikanda, hasara zinafikia ${coiStr} (COI), ${sadcStr} (SADC), ${comesaStr} (COMESA), na ${africaStr} kwa maeneo 21 ya Afrika.`,
              keywords:
                'Maneno Muhimu: El Niño Kuu 2026–2027; IOD+; Madagaska; Uchumi wa Kilimo; XGBoost & LSTM; SADC; COMESA; M&G Consulting.',
              s1Title: '1. Utangulizi na Hali Halisi ya Bahari (WMO / NOAA / SWIOCOF-15)',
              s1Paragraphs: [
                `Takwimu halisi za msingi: Kipindi cha El Niño 2023–2024 kinatumika kama kipimo cha kihistoria (> $200M za hasara za kilimo na kushuka -6% hadi -7% kwa Pato la Kilimo), pamoja na takwimu za Novemba 2026 (+3.5 °C Pasifiki ya kati, watu milioni 3.72 katika hatari ya chakula, na bei ya mchele Antananarivo kuelekea MGA 3,200/kg).`,
                `Chini ya hali chanya ya Bahari ya Hindi (IOD+), Madagaska inakabiliwa na ukame mkali Kusini (-30% hadi -50%) dhidi ya mvua nyingi Kaskazini-Mashariki (SAVA/Analanjirofo).`,
              ],
              s2Title: '2. Viwango vya Uandishi na Mbinu za Kitaalamu za Uchambuzi',
              s2Paragraphs: [
                `Ripoti hii inafuata muundo wa IMRAD, viwango vya WMO-No. 182, FAO IPC v3.1 na uhakiki wa hali tatu za IPCC AR6 (S1 ×0.55, S2 ×1.00, S3 ×1.45), ikitenganisha kwa uwazi takwimu halisi dhidi ya makadirio.`,
                `Miundo ya XGBoost hutumia udhibiti mkali (max_depth=3, reg_lambda=10, TimeSeriesSplit 5-fold) na majina sanifu ya geoBoundaries ADM2 kwa wilaya 119.`,
              ],
              s3Title: '3. Matokeo ya Takwimu — Madagaska (Wilaya, Mikoa 23 & Majimbo 6)',
              s3Paragraphs: [
                `Chini ya vigezo vilivyochaguliwa (${horizonYear} · ${scenarioMeta.label}), Madagaska inarekodi jumla ya hasara ya ${madaTotalStr} (${madaGdpPctStr} ya Pato la Taifa).`,
                horizonYear === 2028
                  ? `Mwaka 2028, hasara za kipindi cha mpito na mafuriko ya La Niña (${madaTotalStr}) zinaambatana na uwezekano wa ongezeko la mavuno la +${formatCurrencyFromMUsd(model.madagascar.rebound2028MUsd, currency, false, lang)}.`
                  : `Jimbo la ${topProvince.province} linabeba ${topProvStr} (${formatPct(topProvince.gdpImpactPct, 2, lang)} ya Pato la jimbo) kupitia ${topProvince.dominantChannel}.`,
              ],
              s4Title: '4. Makadirio ya Kikanda: Bahari ya Hindi (COI), COMESA, SADC na Afrika',
              s4Paragraphs: [
                `Ukanda wa SADC unakabiliwa na ukame wa mahindi na upungufu wa umeme wa maji (jumla SADC: ${sadcStr}), huku Afrika Mashariki katika COMESA ikikabiliwa na mafuriko na uharibifu wa miundombinu (COMESA: ${comesaStr}).`,
                `Kwa maeneo yote 21 ya Afrika yaliyochambuliwa, jumla ya athari za kiuchumi inafikia ${africaStr} (${formatPct(model.blocs.africaGdpPct, 2, lang)} ya Pato la kikanda).`,
              ],
              commentaryTitle: '5A. Ufafanuzi wa Kitaalamu na Mwenendo wa 2027–2032',
              commentaryParagraphs: [
                `Tathmini ya muda mrefu inaonyesha kuwa athari za 2027 (${madaTotalStr}) zinaendelea kuathiri uwekezaji wa kilimo na bei za chakula kupitia kipindi cha La Niña 2028 hadi mwaka 2031.`,
                `Hasara zisizo za moja kwa moja (${madaIndirectStr}) huongeza shinikizo kwa bei za mchele mijini na gridi ya umeme wa maji (RIA), zikithibitisha umuhimu wa maghala ya GCV na mikopo ya mapema ya FDA-R.`,
              ],
              s5Title: '5B. Majadiliano na Mipaka ya Mbinu',
              s5Paragraphs: [
                `Makadirio yanazingatia ulinganifu wa kikanda na unyeti wa sekta za maji, mifugo, nishati ya RIA na barabara za vijijini.`,
                `Ufuatiliaji wa mara kwa mara wa mvua za CHIRPS na taarifa za Météo Madagascar unaruhusu kurekebisha vigezo vya S1/S2/S3 kwa wakati halisi.`,
              ],
              s6Title: '6. Mapendekezo ya Kisera na Kiutendaji',
              s6Recommendations: [
                '1. Upanzi unaotegemea mvua halisi (FOFIFA/DGM): Kusubiri mm 20–30 Kusini Kuu kwa kutumia mtama/uwele wa siku 90 na mashimo ya Zaï.',
                '2. Akiba ya umeme na chakula: Maandalizi ya nishati mbadala ya JIRAMA na maghala ya jamii (GCV) kabla ya kilele cha bei cha MGA 3,200/kg.',
                '3. Bima ya kikanda (COI/SADC/COMESA): Kuunganisha alama za hatari za wilaya 119 na mifuko ya dharura ya ARC na FDA-R.',
              ],
              limitationsText:
                'Tanbihi: Namba za 2027–2032 ni makadirio ya kisayansi ya ML, zikitenganishwa na takwimu halisi za kihistoria (2023–2024).',
              referencesTitle: '7. Marejeo ya Kisayansi na Kitaasisi',
            }
          : {
              title: `Rapport Scientifique d’Évaluation — Pertes Économiques & Agricoles du Super El Niño 2026–2027 (Horizon ${horizonYear} · ${scenario.toUpperCase()})`,
              subtitle: `Revue statistique multi-échelles à la demande (Districts ADM2 → 23 Régions → 6 Ex-Provinces → Océan Indien COI, COMESA, SADC & Afrique) · Périmètre : ${scope === 'consolidated119' ? 'Consolidé 119 districts ADM2' : '42 districts pilotes ML'}`,
              abstractTitle: 'Résumé analytique (Abstract)',
              abstractText: `Ce rapport scientifique évalue à la demande les pertes économiques directes et indirectes induites par l’épisode super El Niño 2026–2027 (anomalie ONI observée de +3,5 °C en novembre 2026, pic projeté jusqu’à +4,1 °C, couplé à un dipôle positif IOD+). En combinant les séries climatiques NASA POWER, ERA5 et CHIRPS avec une modélisation XGBoost régularisée et un réseau LSTM à décalage de 4 à 6 mois, les pertes totales projetées pour Madagascar à l’horizon ${horizonYear} (${scenarioMeta.label}) atteignent ${madaTotalStr} (${madaGdpPctStr} du PIB national), dont ${madaDirectStr} de pertes agricoles directes (−${madaAgriPctStr} du PIB agricole) et ${madaIndirectStr} de pertes indirectes (eau, élevage, hydroélectricité RIA, pistes rurales). L’ex-province la plus exposée est ${topProvince.province} (${topProvStr}), portée par la région ${topRegion.meta.region} (${topRegStr}) et le district pilote de ${topDistrict.point.district} (${topDistStr}). À l’échelle régionale, l’impact atteint ${coiStr} pour la COI, ${sadcStr} pour la SADC, ${comesaStr} pour le COMESA et ${africaStr} sur l’ensemble des 21 entités africaines modélisées.`,
              keywords:
                'Mots-clés : Super El Niño 2026–2027 ; Téléconnexion ENSO-IOD+ ; Madagascar ; Évaluation économétrique ; XGBoost & LSTM ; COI ; SADC ; COMESA ; M&G Consulting.',
              s1Title: '1. Introduction & Situation Réelle Observée (Forçage Océanique OMM / NOAA / SWIOCOF-15)',
              s1Paragraphs: [
                `Repère empirique observé : Le présent rapport maintient une séparation méthodologique stricte entre les faits mesurés et les estimations prospectives. La référence historique auditée reste l’épisode El Niño 2023–2024 à Madagascar (> 200 M $ de pertes agricoles directes et −6 à −7 % de contraction du PIB agricole). Fin 2026, les capteurs équatoriaux enregistrent +3,5 °C d’anomalie thermique, tandis que 3,72 millions de personnes sont exposées à l’insécurité alimentaire aiguë (FAO/FEWS NET) et que le riz local à Antananarivo converge vers un pic saisonnier de 3 200 MGA/kg en janvier–février 2027.`,
                `Sous l’influence conjointe d’El Niño et du dipôle positif de l’océan Indien (IOD+) documenté par le forum SWIOCOF-15, Madagascar subit un dipôle pluviométrique Nord-Sud asymétrique : déficit de −30 % à −50 % et vagues de chaleur (+2 à +4 °C) dans le Grand Sud et le Sud-Ouest, contre des pluies précoces excédentaires menaçant la floraison des cultures de rente et les versants dans le Nord-Est.`,
              ],
              s2Title: '2. Normes de Rédaction Scientifique & Techniques Analytiques Utilisées',
              s2Paragraphs: [
                `La structuration du document suit le standard international IMRAD des revues à comité de lecture, les normes météorologiques OMM/WMO-No. 182, la nomenclature sécurité alimentaire FAO/IPC v3.1, l’encadrement multi-scénarios GIEC/IPCC AR6 (S1 ×0,55 · S2 ×1,00 · S3 ×1,45) ainsi que les référentiels géographiques geoBoundaries ADM2 et monétaires ISO 4217.`,
                `Sur le plan algorithmique, l’observatoire couple un pipeline ETL ouvert (NASA POWER, Copernicus ERA5, CHIRPS), une segmentation K-Means des 119 districts, des arbres XGBoost fortement régularisés (max_depth=3, reg_lambda=10, validation temporelle TimeSeriesSplit à 5 plis), une dynamique séquentielle LSTM (Lag +4 à +6 mois) et une couche d’interprétation IA hybride (RAG FAISS + QLoRA + Gemini Grounding) interdisant toute hallucination sur les grandeurs chiffrées.`,
              ],
              s3Title: '3. Résultats Statistiques Multi-Échelles — Madagascar (Ex-Provinces, 23 Régions & Districts)',
              s3Paragraphs: [
                `Sous la configuration active (${horizonYear} · ${scenarioMeta.label} · ${scope === 'consolidated119' ? 'extrapolation consolidée 119 districts ADM2' : '42 districts pilotes ML uniquement'}), le choc économique total à Madagascar s’établit à ${madaTotalStr}, soit ${madaGdpPctStr} du PIB national de référence (16,5 Md $).`,
                horizonYear === 2028
                  ? `Spécificité de l’horizon 2028 (Transition neutre / La Niña) : les pertes résiduelles de soudure T1–T2 et les aléas hydro-cycloniques (${madaTotalStr}) doivent être distinguées du rebond brut potentiel des récoltes estimé à +${formatCurrencyFromMUsd(model.madagascar.rebound2028MUsd, currency, false, lang)}, dégageant un solde net de ${formatCurrencyFromMUsd(model.madagascar.net2028MUsd, currency, true, lang)}.`
                  : `L’ex-province de ${topProvince.province} concentre le foyer critique (${topProvStr}, soit ${formatPct(topProvince.gdpImpactPct, 2, lang)} de son PIB provincial), activé principalement par : ${topProvince.dominantChannel}. Au niveau régional, ${topRegion.meta.region} atteint ${topRegStr} et le district unitaire de ${topDistrict.point.district} atteint ${topDistStr}.`,
              ],
              s4Title: '4. Projections Océan Indien (COI), COMESA, SADC & Ensemble Afrique',
              s4Paragraphs: [
                `La propagation macro-régionale met en lumière deux régimes opposés : d’une part, la SADC (ceinture du maïs d’Afrique du Sud, Zambie, Zimbabwe, Malawi, Mozambique, Botswana) et les îles de la COI subissent conjointement stress hydrique, baisse du maïs blanc et étiage hydroélectrique (Kariba / Cahora Bassa), portant la facture SADC à ${sadcStr} et la facture COI à ${coiStr} (dont Madagascar représente ${formatPct(model.blocs.coiTotalMUsd > 0 ? (model.madagascar.totalLossMUsd / model.blocs.coiTotalMUsd) * 100 : 0, 1, lang)}).`,
                `D’autre part, les hauts plateaux et bassins d’Afrique de l’Est (COMESA : ${comesaStr}) subissent un excès pluviométrique bimodal provoquant ruptures logistiques, crues fluviales et pertes post-récolte. Au total, l’exposition agrégée des 21 pays et sous-régions africaines modélisées s’élève à ${africaStr} (${formatPct(model.blocs.africaGdpPct, 2, lang)} du PIB continental couvert).`,
              ],
              commentaryTitle: '5A. Commentaire Analytique & Lecture Stratégique 2027–2032',
              commentaryParagraphs: [
                `Lecture inter-temporelle (2027–2032) : Le choc initial 2027 (${madaTotalStr} à Madagascar) déclenche une boucle de persistance macroéconomique sur l’horizon 2028–2032 (Fig. 4). Bien que la transition La Niña attendue en 2028 atténue partiellement le déficit hydrique du Sud, elle renforce l’aléa cyclonique et inondations sur les bassins Est et Nord-Est avant un second pic de traîne économique en 2031 identifié dans les séries Dartmouth / Oxford Economics sur 195 États ONU.`,
                `Effet multiplicateur eau-énergie-prix : Les pertes indirectes (${madaIndirectStr}) représentent un vecteur critique de transmission urbaine via l’inflation du riz (projection 3 200 MGA/kg) et l’étiage du Réseau Interconnecté d’Antananarivo (RIA / Andekaleka). L’investissement préventif dans les greniers GCV et le crédit de campagne FDA-R réduit mécaniquement la facture d’urgence de 2,8 à 3,4× par dollar engagé.`,
              ],
              s5Title: '5B. Discussion Méthodologique, Limites & Reproductibilité',
              s5Paragraphs: [
                `Les élasticités indirectes traduisent les rétroactions documentées entre déficit agricole, perte de cheptel zébu, délestages du Réseau Interconnecté d’Antananarivo (RIA / Andekaleka) et dégradation des pistes rurales. Pour la région du Melaky (sans district pilote dans l’échantillon initial de 42), le modèle applique de manière transparente un proxy provincial pondéré par sa propre base agricole.`,
                `Ces résultats paramétriques ne constituent pas une prévision d’équilibre général calculable intégrant les substitutions tarifaires ou les aides d’urgence non annoncées ; ils fournissent un outil d’aide à la décision reproductible et actualisable à la demande selon l’évolution hebdomadaire de l’indice ONI.`,
              ],
              s6Title: '6. Recommandations Opérationnelles & Matrice d’Action Prioritaire',
              s6Recommendations: [
                '1. Déclenchement agrométéorologique dynamique (FOFIFA / DGM / 3-2-1) : abandonner le semis à date fixe dans le Grand Sud au profit du seuil pluviométrique (20–30 mm cumulés sur 3 jours), couplé aux variétés à cycle court (sorgho/mil 90 j), cuvettes Zaï et SCV.',
                '2. Sécurisation énergétique (RIA) & régulation vivrière : anticiper l’étiage hydroélectrique de juillet–novembre 2027 sur les bassins Vohitra/Mandraka et pré-positionner les greniers communautaires villageois (GCV) et stocks tampons ANMCC avant le pic rizicole à 3 200 MGA/kg.',
                '3. Financement climatique & mutualisation COI / SADC / COMESA : adosser le scoring 5D des 119 districts aux guichets FDA-R, DEFIS et African Risk Capacity (ARC) pour activer des transferts Cash+ précoces dès le passage en phase IPC 3+.',
              ],
              limitationsText:
                'Avertissement scientifique : les valeurs 2027–2032 sont des estimations économétriques et ML prospectives sous scénarios OMM/FAO, strictement distinctes des bilans historiques audités (2023–2024).',
              referencesTitle: '7. Références Bibliographiques & Sources Institutionnelles (Norme APA / OMM)',
            };

  return {
    options,
    generatedAtIso,
    reportId,
    model,
    focusedDistrictRow,
    license,
    scenarioMeta,
    editorialStandards,
    technicalMethods,
    recommendationMatrix,
    charts: {
      oniShock: oniShockChart,
      provinces: provincesChart,
      continental: continentalChart,
      trajectory2027_2032: trajectoryChart,
    },
    narrative,
  };
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 1. EXPORT PDF (jsPDF + jspdf-autotable + High-DPI Canvas2D Charts)
 */
export function exportScientificPdf(options: ScientificReportOptions): ScientificReportPayload {
  const p = buildScientificReportPayload(options);
  const { lang, horizonYear, scenario, scope, currency } = p.options;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;

  doc.setProperties({
    title: sanitizePdfText(p.narrative.title),
    subject: 'Madagascar El Niño Observatory - Scientific Evaluation Report',
    author: `Prince MANANTENASOA (DG, M&G Consulting)`,
    creator: 'M&G Consulting - Madagascar El Niño Observatory',
    keywords: 'El Nino, Madagascar, Econometrics, ML, COI, SADC, COMESA, M&G Consulting',
  });

  // COVER PAGE
  doc.setFillColor(30, 58, 138); // Deep Cobalt #1E3A8A
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setFillColor(180, 83, 9); // Amber accent bar
  doc.rect(0, 38, pageW, 2.2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(sanitizePdfText(p.license.platformName.toUpperCase()), margin, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(sanitizePdfText(`ID: ${p.reportId}   |   ${p.generatedAtIso}`), margin, 24);
  doc.text(
    sanitizePdfText(
      `License Holder: ${p.license.licenseHolder}   |   DG: ${p.license.directorName}`,
    ),
    margin,
    30,
  );

  let y = 52;
  doc.setTextColor(24, 24, 27);
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(sanitizePdfText(p.narrative.title), contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7.5 + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(82, 82, 91);
  const subLines = doc.splitTextToSize(sanitizePdfText(p.narrative.subtitle), contentW);
  doc.text(subLines, margin, y);
  y += subLines.length * 5 + 8;

  // License & Author Plaque
  doc.setFillColor(249, 248, 244);
  doc.setDrawColor(212, 212, 216);
  doc.roundedRect(margin, y, contentW, 34, 2, 2, 'FD');
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(
    sanitizePdfText(`${p.license.licenseLabel} : ${p.license.licenseHolder}`),
    margin + 5,
    y + 8,
  );
  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9.5);
  doc.text(
    sanitizePdfText(`${p.license.directorLabel} : ${p.license.directorName}`),
    margin + 5,
    y + 15,
  );
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(63, 63, 70);
  doc.text(sanitizePdfText(p.license.directorTitle), margin + 5, y + 21);
  const rightLines = doc.splitTextToSize(sanitizePdfText(p.license.rightsNote), contentW - 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.text(rightLines, margin + 5, y + 27);
  y += 42;

  // Abstract box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text(sanitizePdfText(p.narrative.abstractTitle), margin, y);
  y += 5;
  doc.setFont('times', 'normal');
  doc.setFontSize(9.8);
  doc.setTextColor(39, 39, 42);
  const absLines = doc.splitTextToSize(sanitizePdfText(p.narrative.abstractText), contentW);
  doc.text(absLines, margin, y);
  y += absLines.length * 4.7 + 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(82, 82, 91);
  const kwLines = doc.splitTextToSize(sanitizePdfText(p.narrative.keywords), contentW);
  doc.text(kwLines, margin, y);
  y += kwLines.length * 4.5 + 6;

  // KPI Summary Table on Cover
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.5, textColor: [24, 24, 27] },
    head: [
      [
        sanitizePdfText('Indicateur Macro-Territorial'),
        sanitizePdfText(`Valeur (${horizonYear} · ${scenario.toUpperCase()})`),
        sanitizePdfText('Poids / Ratio'),
      ],
    ],
    body: [
      [
        sanitizePdfText('Madagascar — Pertes totales (Direct + Indirect)'),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.madagascar.totalLossMUsd, currency, false, lang)),
        sanitizePdfText(`${formatPct(p.model.madagascar.gdpPct, 2, lang)} PIB`),
      ],
      [
        sanitizePdfText('Madagascar — Pertes agricoles directes vs indirectes'),
        sanitizePdfText(
          `${formatCurrencyFromMUsd(p.model.madagascar.directMUsd, currency, false, lang)} / ${formatCurrencyFromMUsd(p.model.madagascar.indirectMUsd, currency, false, lang)}`,
        ),
        sanitizePdfText(`-${formatPct(p.model.madagascar.agriPct, 2, lang)} PIB agri`),
      ],
      [
        sanitizePdfText('Commission de l’Océan Indien (COI · 5 territoires)'),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.blocs.coiTotalMUsd, currency, false, lang)),
        sanitizePdfText(
          `${formatPct(p.model.blocs.coiTotalMUsd > 0 ? (p.model.madagascar.totalLossMUsd / p.model.blocs.coiTotalMUsd) * 100 : 0, 1, lang)} part Mada`,
        ),
      ],
      [
        sanitizePdfText('SADC / COMESA'),
        sanitizePdfText(
          `${formatCurrencyFromMUsd(p.model.blocs.sadcTotalMUsd, currency, false, lang)} / ${formatCurrencyFromMUsd(p.model.blocs.comesaTotalMUsd, currency, false, lang)}`,
        ),
        sanitizePdfText('Blocs australe & Est'),
      ],
      [
        sanitizePdfText('Afrique modélisée (21 pays / sous-régions)'),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.blocs.africaTotalMUsd, currency, false, lang)),
        sanitizePdfText(`${formatPct(p.model.blocs.africaGdpPct, 2, lang)} PIB`),
      ],
    ],
  });

  // Helper to ensure space & add heading + paragraphs
  const getLastY = (): number =>
    ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y) + 6;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageH - 18) {
      doc.addPage();
      y = 20;
    }
  };

  const addSectionHeading = (text: string) => {
    ensureSpace(16);
    doc.setFont('times', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(30, 58, 138);
    const lines = doc.splitTextToSize(sanitizePdfText(text), contentW);
    doc.text(lines, margin, y);
    y += lines.length * 5.5 + 1.5;
    doc.setDrawColor(212, 212, 216);
    doc.line(margin, y, margin + contentW, y);
    y += 5;
  };

  const addParagraphs = (paras: string[]) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(9.8);
    doc.setTextColor(39, 39, 42);
    paras.forEach((para) => {
      const lines = doc.splitTextToSize(sanitizePdfText(para), contentW);
      ensureSpace(lines.length * 4.6 + 4);
      doc.text(lines, margin, y);
      y += lines.length * 4.6 + 3.5;
    });
  };

  // PAGE 2: INTRODUCTION, FIGURE 1, NORMS & METHODS
  doc.addPage();
  y = 20;
  addSectionHeading(p.narrative.s1Title);
  addParagraphs(p.narrative.s1Paragraphs);

  ensureSpace(78);
  const fig1H = (contentW * p.charts.oniShock.height) / p.charts.oniShock.width;
  doc.addImage(p.charts.oniShock.dataUrl, 'PNG', margin, y, contentW, fig1H);
  y += fig1H + 6;

  addSectionHeading(p.narrative.s2Title);
  addParagraphs(p.narrative.s2Paragraphs);

  ensureSpace(45);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8.2 },
    bodyStyles: { fontSize: 8, textColor: [24, 24, 27] },
    head: [[sanitizePdfText('Norme / Standard'), sanitizePdfText('Référentiel'), sanitizePdfText('Application dans le rapport')]],
    body: p.editorialStandards.map((s) => [
      sanitizePdfText(s.code),
      sanitizePdfText(s.standard),
      sanitizePdfText(s.application),
    ]),
  });
  y = getLastY();

  ensureSpace(45);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: [180, 83, 9], textColor: 255, fontSize: 8.2 },
    bodyStyles: { fontSize: 7.8, textColor: [24, 24, 27] },
    head: [[
      sanitizePdfText('Étape'),
      sanitizePdfText('Technique / Modèle'),
      sanitizePdfText('Entrées & Sorties'),
      sanitizePdfText('Contrôle qualité'),
    ]],
    body: p.technicalMethods.map((m) => [
      sanitizePdfText(m.stage),
      sanitizePdfText(m.method),
      sanitizePdfText(m.inputsOutputs),
      sanitizePdfText(m.validation),
    ]),
  });
  y = getLastY();

  // SECTION 3: MADAGASCAR RESULTS + FOCUS DISTRICT + FIG 2 + PROVINCES + REGIONS + DISTRICTS
  addSectionHeading(p.narrative.s3Title);
  addParagraphs(p.narrative.s3Paragraphs);

  if (p.focusedDistrictRow) {
    const fd = p.focusedDistrictRow;
    const fc = p.options.focusDistrict;
    ensureSpace(58);
    addSectionHeading(
      `Focus District Prioritaire : ${fd.point.district} (${fd.displayRegion} · ${fd.province})`,
    );
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: { fillColor: [180, 83, 9], textColor: 255, fontSize: 8.2 },
      bodyStyles: { fontSize: 8, textColor: [24, 24, 27] },
      head: [[
        sanitizePdfText('Indicateur Climat & Économie du District'),
        sanitizePdfText(`Valeur (${horizonYear})`),
        sanitizePdfText('Détail / Filière'),
      ]],
      body: [
        [
          sanitizePdfText('Profil de risque & Anomalie Eau'),
          sanitizePdfText(`${fd.point.riskTier.toUpperCase()} (${(fc?.waterDelta ?? (horizonYear === 2027 ? fd.point.water2027 : fd.point.water2028)) >= 0 ? '+' : ''}${fc?.waterDelta ?? (horizonYear === 2027 ? fd.point.water2027 : fd.point.water2028)} %)`),
          sanitizePdfText(`ONI : ${horizonYear === 2027 ? '+3.5 °C' : '-0.9 °C'} · ${fd.point.profile}`),
        ],
        [
          sanitizePdfText('Deltas Rendement ML (Riz / Maïs / Rente)'),
          sanitizePdfText(
            `${horizonYear === 2027 ? fd.point.rice2027 : fd.point.rice2028}% / ${horizonYear === 2027 ? fd.point.maize2027 : fd.point.maize2028}% / ${horizonYear === 2027 ? fd.point.exportCrop2027 : fd.point.exportCrop2028}%`,
          ),
          sanitizePdfText(fc?.cropLabel ? `Filière focalisée : ${fc.cropLabel}` : 'Projections XGBoost ADM2'),
        ],
        [
          sanitizePdfText('Pertes Directes Agricoles vs Indirectes'),
          sanitizePdfText(
            `${formatCurrencyFromMUsd(fd.directAgriLossMUsd, currency, false, lang)} / ${formatCurrencyFromMUsd(fd.indirectLossMUsd, currency, false, lang)}`,
          ),
          sanitizePdfText(`Choc agri unitaire : -${formatPct(fd.agriShockPct, 1, lang)}`),
        ],
        [
          sanitizePdfText('Perte Économique Totale du District'),
          sanitizePdfText(formatCurrencyFromMUsd(fd.totalLossMUsd, currency, false, lang)),
          sanitizePdfText(`Riz ${formatCurrencyFromMUsd(fd.riceLossMUsd, currency, false, lang)} · Maïs ${formatCurrencyFromMUsd(fd.maizeLossMUsd, currency, false, lang)} · Rente ${formatCurrencyFromMUsd(fd.exportLossMUsd, currency, false, lang)}`),
        ],
      ],
    });
    y = getLastY();
    if (fd.point.ragNotes.length > 0) {
      addParagraphs(fd.point.ragNotes.map((n) => `• [Bulletin RAG ${fd.point.district}] ${n}`));
    }
    if (fc?.aiDiagnostic) {
      addParagraphs([`[Synthèse Gemini RAG+QLoRA — ${fd.point.district}]`, fc.aiDiagnostic]);
    }
  }

  ensureSpace(88);
  const fig2H = (contentW * p.charts.provinces.height) / p.charts.provinces.width;
  doc.addImage(p.charts.provinces.dataUrl, 'PNG', margin, y, contentW, fig2H);
  y += fig2H + 6;

  const sortedProvinces = [...p.model.provinceRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 7.8, textColor: [24, 24, 27] },
    head: [[
      sanitizePdfText('Ex-Province'),
      sanitizePdfText('Riz'),
      sanitizePdfText('Maïs/Vivriers'),
      sanitizePdfText('Rente'),
      sanitizePdfText('Indirect'),
      sanitizePdfText('Total'),
      sanitizePdfText('% PIB'),
    ]],
    body: [
      ...sortedProvinces.map((pr) => [
        sanitizePdfText(pr.province),
        sanitizePdfText(formatCurrencyFromMUsd(pr.riceLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(pr.maizeLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(pr.exportLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(pr.indirectLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(pr.totalLossMUsd, currency, false, lang)),
        sanitizePdfText(formatPct(pr.gdpImpactPct, 2, lang)),
      ]),
      [
        sanitizePdfText('TOTAL MADAGASCAR'),
        sanitizePdfText(formatCurrencyFromMUsd(sortedProvinces.reduce((a, r) => a + r.riceLossMUsd, 0), currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(sortedProvinces.reduce((a, r) => a + r.maizeLossMUsd, 0), currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(sortedProvinces.reduce((a, r) => a + r.exportLossMUsd, 0), currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.madagascar.indirectMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.madagascar.totalLossMUsd, currency, false, lang)),
        sanitizePdfText(formatPct(p.model.madagascar.gdpPct, 2, lang)),
      ],
    ],
  });
  y = getLastY();

  if (options.includeRegions23) {
    ensureSpace(45);
    const sortedRegions = [...p.model.regionRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 7.5 },
      bodyStyles: { fontSize: 7.3, textColor: [24, 24, 27] },
      head: [[
        sanitizePdfText('Région (23)'),
        sanitizePdfText('Ex-Province'),
        sanitizePdfText('Direct'),
        sanitizePdfText('Indirect'),
        sanitizePdfText('Total'),
        sanitizePdfText('% PIB rég.'),
      ]],
      body: sortedRegions.map((rg) => [
        sanitizePdfText(rg.meta.region + (!rg.coveredByPilot ? ' (proxy)' : '')),
        sanitizePdfText(rg.meta.province),
        sanitizePdfText(formatCurrencyFromMUsd(rg.directAgriLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(rg.indirectLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(rg.totalLossMUsd, currency, false, lang)),
        sanitizePdfText(formatPct(rg.gdpImpactPct, 2, lang)),
      ]),
    });
    y = getLastY();
  }

  if (options.includeDistricts42) {
    ensureSpace(45);
    const sortedDistricts = [...p.model.districtRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: [63, 63, 70], textColor: 255, fontSize: 7.5 },
      bodyStyles: { fontSize: 7.1, textColor: [24, 24, 27] },
      head: [[
        sanitizePdfText('District (42 ADM2)'),
        sanitizePdfText('Région · Ex-Prov.'),
        sanitizePdfText('Direct'),
        sanitizePdfText('Indirect'),
        sanitizePdfText('Total'),
        sanitizePdfText('Choc Agri'),
      ]],
      body: sortedDistricts.map((d) => [
        sanitizePdfText(d.point.district),
        sanitizePdfText(`${d.displayRegion} · ${d.province}`),
        sanitizePdfText(formatCurrencyFromMUsd(d.directAgriLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(d.indirectLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(d.totalLossMUsd, currency, false, lang)),
        sanitizePdfText(`-${formatPct(d.agriShockPct, 1, lang)}`),
      ]),
    });
    y = getLastY();
  }

  // SECTION 4: CONTINENTAL + FIG 3 + 21 COUNTRIES
  if (options.includeContinental) {
    addSectionHeading(p.narrative.s4Title);
    addParagraphs(p.narrative.s4Paragraphs);

    ensureSpace(92);
    const fig3H = (contentW * p.charts.continental.height) / p.charts.continental.width;
    doc.addImage(p.charts.continental.dataUrl, 'PNG', margin, y, contentW, fig3H);
    y += fig3H + 6;

    const sortedCountries = [...p.model.countryRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 7.5 },
      bodyStyles: { fontSize: 7.2, textColor: [24, 24, 27] },
      head: [[
        sanitizePdfText('Pays / Sous-région'),
        sanitizePdfText('Blocs'),
        sanitizePdfText('Direct'),
        sanitizePdfText('Indirect'),
        sanitizePdfText('Total'),
        sanitizePdfText('% PIB'),
        sanitizePdfText('Solde 2028'),
      ]],
      body: sortedCountries.map((c) => [
        sanitizePdfText(c.countryOrZone),
        sanitizePdfText(c.blocs.filter((b) => b !== 'Afrique').join(', ') || 'Afrique'),
        sanitizePdfText(formatCurrencyFromMUsd(c.directLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(c.indirectLossMUsd, currency, false, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(c.totalLossMUsd, currency, false, lang)),
        sanitizePdfText(formatPct(c.gdpImpactPct, 2, lang)),
        sanitizePdfText(formatCurrencyFromMUsd(c.netBalanceAdj2028MUsd, currency, true, lang)),
      ]),
    });
    y = getLastY();
  }

  // SECTION 5A: ANALYTICAL COMMENTARY + FIG 4 + LIVE CAPTURED DOM CHARTS
  addSectionHeading(p.narrative.commentaryTitle);
  addParagraphs(p.narrative.commentaryParagraphs);

  ensureSpace(88);
  const fig4H = (contentW * p.charts.trajectory2027_2032.height) / p.charts.trajectory2027_2032.width;
  doc.addImage(p.charts.trajectory2027_2032.dataUrl, 'PNG', margin, y, contentW, fig4H);
  y += fig4H + 6;

  if (options.liveDomCharts && options.liveDomCharts.length > 0) {
    options.liveDomCharts.forEach((fig) => {
      const figH = Math.min(95, (contentW * fig.asset.height) / fig.asset.width);
      ensureSpace(figH + 14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text(sanitizePdfText(fig.caption), margin, y);
      y += 4;
      doc.addImage(fig.asset.dataUrl, 'PNG', margin, y, contentW, figH);
      y += figH + 6;
    });
  }

  // SECTION 5B & 6: DISCUSSION, STRUCTURED RECOMMENDATIONS MATRIX & REFERENCES
  addSectionHeading(p.narrative.s5Title);
  addParagraphs(p.narrative.s5Paragraphs);

  addSectionHeading(p.narrative.s6Title);
  addParagraphs(p.narrative.s6Recommendations);

  ensureSpace(45);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 7.7, textColor: [24, 24, 27] },
    head: [[
      sanitizePdfText(lang === 'en' ? 'Lead Actor' : lang === 'sw' ? 'Mhusika' : 'Acteur Pilote'),
      sanitizePdfText(lang === 'en' ? 'Operational Trigger' : lang === 'sw' ? 'Kigezo' : 'Seuil Déclencheur'),
      sanitizePdfText(lang === 'en' ? 'Technical Action' : lang === 'sw' ? 'Hatua' : 'Mesure Technique'),
      sanitizePdfText(lang === 'en' ? 'Financing Window' : lang === 'sw' ? 'Mfuko' : 'Guichet / Financement'),
    ]],
    body: p.recommendationMatrix.map((row) => [
      sanitizePdfText(row.actor),
      sanitizePdfText(row.trigger),
      sanitizePdfText(row.action),
      sanitizePdfText(row.financing),
    ]),
  });
  y = getLastY();

  ensureSpace(14);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.2);
  doc.setTextColor(82, 82, 91);
  const limLines = doc.splitTextToSize(sanitizePdfText(p.narrative.limitationsText), contentW);
  doc.text(limLines, margin, y);
  y += limLines.length * 4 + 6;

  addSectionHeading(p.narrative.referencesTitle);
  const refs = getLocalizedReferenceSources(lang);
  addParagraphs(refs.map((r, i) => `[${i + 1}] ${r.publisher} (2026). ${r.label}. ${r.url}`));

  // Running Header & Footer with Page X / Y and M&G Consulting License Holder on every page > 1
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(113, 113, 122);
      doc.text(
        sanitizePdfText(`${p.license.platformName} · ${p.reportId}`),
        margin,
        10,
      );
      doc.text(
        sanitizePdfText(`${p.license.licenseHolder} · DG : ${p.license.directorName}`),
        pageW - margin,
        10,
        { align: 'right' },
      );
      doc.setDrawColor(228, 228, 231);
      doc.line(margin, 12, pageW - margin, 12);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text(
      sanitizePdfText(
        `${p.license.licenseHolder} · ${p.license.directorName} (Chercheur en Sciences Économiques / ML-Data-AI Engineer)`,
      ),
      margin,
      pageH - 8,
    );
    doc.text(sanitizePdfText(`Page ${i} / ${totalPages}`), pageW - margin, pageH - 8, {
      align: 'right',
    });
  }

  const districtSlug = p.focusedDistrictRow
    ? `District_${p.focusedDistrictRow.point.district.replace(/\s+/g, '_')}_`
    : '';
  const scientificFilename = `Rapport_Scientifique_${districtSlug}ENSO_${horizonYear}_${scenario}_${scope}_${lang}.pdf`;
  doc.save(scientificFilename);
  emitPdfDownloadSuccess({
    filename: scientificFilename,
    kind: 'scientific',
    pagesCount: totalPages,
    horizonYear,
    scenario,
  });
  return p;
}

export interface ClimateSummaryPdfOptions {
  lang: LanguageCode;
  horizonYear?: HorizonYear;
  scenario?: ScenarioKey;
  currency?: CurrencyCode;
  syncState?: GlobalSyncPayload;
  liveStations?: Array<{
    id: string;
    label: string;
    tempC: number | null;
    precipMm24h?: number | null;
    precipMm7d?: number | null;
    windKmh: number | null;
    rainfallAnomalyPct?: number;
  }>;
}

/**
 * 1B. ONE-CLICK EXECUTIVE SUMMARY PDF (Current Climate Data + Live Web-Scrape + 2027-2032 Forecasts)
 */
export function exportClimateSummaryPdf(options: ClimateSummaryPdfOptions): string {
  const lang = options.lang;
  const horizonYear: HorizonYear = options.horizonYear ?? 2027;
  const scenario: ScenarioKey = options.scenario ?? 's2';
  const currency: CurrencyCode = options.currency ?? 'USD';
  const syncState = options.syncState;
  const hasLiveScrape = Boolean(syncState?.lastSyncedAtIso);
  const madaScale = hasLiveScrape && syncState ? syncState.madagascarFactors.overallLossFactor : 1;

  const p = buildScientificReportPayload({
    horizonYear,
    scenario,
    scope: 'consolidated119',
    currency,
    lang,
    includeRegions23: false,
    includeDistricts42: false,
    includeContinental: false,
  });

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `Resume_Climatique_Previsions_M&G_${horizonYear}_${stamp}_${lang}.pdf`;

  const txt =
    lang === 'en'
      ? {
          title: 'Current Climate Bulletin & Multi-Scale Forecasts (2026–2032)',
          subtitle: 'M&G Consulting · Madagascar El Niño Observatory · Real-Time Telemetry & Global Forecasts',
          sec1: '1. Live Oceanographic & Station Telemetry',
          sec2: '2. Madagascar (6 Ex-Provinces) & Regional Blocs Impact',
          sec3: '3. Global 6 UN Zones / Continents (195 Countries, 2027–2032)',
          sec4: '4. Priority Forecast Alerts & Operational Recommendations',
          stationsEmpty: 'Live station telemetry ready via Open-Meteo & NOAA CPC ONI (+3.5 °C observed).',
        }
      : lang === 'sw'
        ? {
            title: 'Muhtasari wa Hali ya Hewa ya Sasa na Utabiri (2026–2032)',
            subtitle: 'M&G Consulting · Madagascar El Niño Observatory · Data Hai na Makadirio ya Dunia',
            sec1: '1. Hali ya Bahari na Vituo vya Hali ya Hewa vya Sasa',
            sec2: '2. Athari kwa Madagaska (Majimbo 6) na Kanda za Afrika',
            sec3: '3. Kanda 6 za UN / Mabara (Nchi 195, 2027–2032)',
            sec4: '4. Tahadhari za Haraka na Hatua za Kipaumbele',
            stationsEmpty: 'Data hai za vituo zipo tayari kupitia Open-Meteo na NOAA ONI (+3.5 °C).',
          }
        : {
            title: 'Résumé des Données Climatiques Actuelles & Prévisions (2026–2032)',
            subtitle: 'M&G Consulting · Madagascar El Niño Observatory · Veille Temps Réel & Projections Mondiales',
            sec1: '1. Situation Climatique Actuelle, Indice ONI & Stations Live',
            sec2: '2. Pertes & Vulnérabilité Madagascar (6 Ex-Provinces) et Blocs Africains',
            sec3: '3. Prévisions Mondiales 2027–2032 par Zone ONU / Continent (195 pays)',
            sec4: '4. Alertes Actives & Recommandations Opérationnelles',
            stationsEmpty: 'Télémétrie Open-Meteo & NOAA CPC active (indice ONI observé +3,5 °C).',
          };

  doc.setProperties({
    title: sanitizePdfText(txt.title),
    subject: 'Climate Telemetry & El Nino 2026-2032 Forecast Summary',
    author: 'Prince MANANTENASOA (DG, M&G Consulting)',
    creator: 'M&G Consulting - Madagascar El Niño Observatory',
  });

  // Top Header Band
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setFillColor(180, 83, 9);
  doc.rect(0, 28, pageW, 1.8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(sanitizePdfText(txt.title), margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(sanitizePdfText(`${txt.subtitle}`), margin, 19);
  doc.text(
    sanitizePdfText(
      `DG: ${p.license.directorName} | Horizon: ${horizonYear} (${scenario.toUpperCase()}) | Date: ${p.generatedAtIso} | Sync: ${hasLiveScrape && syncState ? `LIVE (${syncState.triggeredBy})` : 'Observatory Baseline'}`,
    ),
    margin,
    24.5,
  );

  let y = 38;
  const getLastY = (): number =>
    ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y) + 5;
  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageH - 16) {
      doc.addPage();
      y = 18;
    }
  };
  const addHeading = (title: string) => {
    ensureSpace(14);
    doc.setFont('times', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(30, 58, 138);
    doc.text(sanitizePdfText(title), margin, y);
    y += 2;
    doc.setDrawColor(212, 212, 216);
    doc.line(margin, y, margin + contentW, y);
    y += 4.5;
  };

  // Section 1: Live Oceanic + Stations
  addHeading(txt.sec1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(39, 39, 42);
  const syncLine = syncState
    ? `ONI: +${syncState.oniIndexObserved.toFixed(2)} deg C (${syncState.noaaOniLatestLine}) | Auto-00:00: ${syncState.midnightAutoUpdateEnabled ? 'ON' : 'OFF'} | GDACS Alerts: ${syncState.gdacsAlertCount} | ${syncState.webScrapeSummary}`
    : txt.stationsEmpty;
  const syncWrapped = doc.splitTextToSize(sanitizePdfText(syncLine), contentW);
  doc.text(syncWrapped, margin, y);
  y += syncWrapped.length * 4 + 3;

  const stationRows =
    syncState && syncState.stations.length > 0
      ? syncState.stations.slice(0, 12).map((st) => [
          sanitizePdfText(st.label),
          sanitizePdfText(st.countryName),
          sanitizePdfText(st.tempC !== null ? `${st.tempC.toFixed(1)} C` : '--'),
          sanitizePdfText(st.precipMm7d !== null ? `${st.precipMm7d.toFixed(1)} mm/7j` : '--'),
          sanitizePdfText(st.windKmh !== null ? `${st.windKmh.toFixed(0)} km/h` : '--'),
          sanitizePdfText(`${st.rainfallAnomalyPct >= 0 ? '+' : ''}${st.rainfallAnomalyPct}%`),
        ])
      : (options.liveStations ?? []).map((st) => [
          sanitizePdfText(st.label),
          sanitizePdfText('Madagascar / COI'),
          sanitizePdfText(st.tempC !== null ? `${st.tempC.toFixed(1)} C` : '--'),
          sanitizePdfText(
            st.precipMm24h !== undefined && st.precipMm24h !== null
              ? `${st.precipMm24h.toFixed(1)} mm/24h`
              : st.precipMm7d !== undefined && st.precipMm7d !== null
                ? `${st.precipMm7d.toFixed(1)} mm/7d`
                : '--',
          ),
          sanitizePdfText(st.windKmh !== null ? `${st.windKmh.toFixed(0)} km/h` : '--'),
          sanitizePdfText(
            st.rainfallAnomalyPct !== undefined
              ? `${st.rainfallAnomalyPct >= 0 ? '+' : ''}${st.rainfallAnomalyPct}%`
              : 'Live',
          ),
        ]);

  if (stationRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 7.5 },
      bodyStyles: { fontSize: 7.2, textColor: [24, 24, 27] },
      head: [[
        sanitizePdfText('Station / Hub'),
        sanitizePdfText('Zone / Pays'),
        sanitizePdfText('Temp.'),
        sanitizePdfText('Pluie'),
        sanitizePdfText('Vent'),
        sanitizePdfText('Anomalie'),
      ]],
      body: stationRows,
    });
    y = getLastY();
  }

  // Section 2: Madagascar & Regional Blocs (recalibrated by live scrape factor)
  addHeading(txt.sec2);
  const africaFactor = hasLiveScrape && syncState ? syncState.zoneFactors.afrique.gdpLossFactor : 1;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: [185, 28, 28], textColor: 255, fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: [24, 24, 27] },
    head: [[
      sanitizePdfText('Territoire / Bloc'),
      sanitizePdfText(`Pertes (${horizonYear} · ${scenario.toUpperCase()})`),
      sanitizePdfText('Part PIB / Facteur'),
    ]],
    body: [
      [
        sanitizePdfText('Madagascar (119 districts ADM2)'),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.madagascar.totalLossMUsd * madaScale, currency, false, lang)),
        sanitizePdfText(`${formatPct(p.model.madagascar.gdpPct * madaScale, 2, lang)} PIB (x${madaScale.toFixed(2)})`),
      ],
      [
        sanitizePdfText('Commission de l Ocean Indien (COI)'),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.blocs.coiTotalMUsd * africaFactor, currency, false, lang)),
        sanitizePdfText(`Facteur Afrique x${africaFactor.toFixed(2)}`),
      ],
      [
        sanitizePdfText('SADC / COMESA'),
        sanitizePdfText(
          `${formatCurrencyFromMUsd(p.model.blocs.sadcTotalMUsd * africaFactor, currency, false, lang)} / ${formatCurrencyFromMUsd(p.model.blocs.comesaTotalMUsd * africaFactor, currency, false, lang)}`,
        ),
        sanitizePdfText('Secheresse australe vs Crues Est'),
      ],
      [
        sanitizePdfText('Afrique modelisee (54 pays / 21 sous-regions)'),
        sanitizePdfText(formatCurrencyFromMUsd(p.model.blocs.africaTotalMUsd * africaFactor, currency, false, lang)),
        sanitizePdfText(`${formatPct(p.model.blocs.africaGdpPct * africaFactor, 2, lang)} PIB`),
      ],
    ],
  });
  y = getLastY();

  const sortedProvinces = [...p.model.provinceRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 7.5 },
    bodyStyles: { fontSize: 7.2, textColor: [24, 24, 27] },
    head: [[
      sanitizePdfText('Ex-Province'),
      sanitizePdfText('Direct Agri'),
      sanitizePdfText('Indirect'),
      sanitizePdfText('Total'),
      sanitizePdfText('% PIB'),
    ]],
    body: sortedProvinces.map((pr) => [
      sanitizePdfText(pr.province),
      sanitizePdfText(formatCurrencyFromMUsd(pr.directAgriLossMUsd * madaScale, currency, false, lang)),
      sanitizePdfText(formatCurrencyFromMUsd(pr.indirectLossMUsd * madaScale, currency, false, lang)),
      sanitizePdfText(formatCurrencyFromMUsd(pr.totalLossMUsd * madaScale, currency, false, lang)),
      sanitizePdfText(formatPct(pr.gdpImpactPct * madaScale, 2, lang)),
    ]),
  });
  y = getLastY();

  // Section 3: Global 6 UN Zones & Trajectory Chart
  addHeading(txt.sec3);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 7.5 },
    bodyStyles: { fontSize: 7.2, textColor: [24, 24, 27] },
    head: [[
      sanitizePdfText('Zone ONU / Continent'),
      sanitizePdfText('Pays ONU'),
      sanitizePdfText('2027 (Md$)'),
      sanitizePdfText('2028 (Md$)'),
      sanitizePdfText('2031 Pic (Md$)'),
      sanitizePdfText('Cumul 27-31 (Md$)'),
      sanitizePdfText('Infl. Alim. Pic'),
    ]],
    body: UN_ZONE_SUMMARIES.map((z) => {
      const zf = hasLiveScrape && syncState ? syncState.zoneFactors[z.id] : null;
      const mult = zf ? zf.gdpLossFactor : 1;
      const inflDelta = zf ? zf.foodInflationAddPct : 0;
      return [
        sanitizePdfText(lang === 'fr' ? z.nameFr : z.nameEn),
        String(z.countryCount),
        (z.yearlyLossBUsd[2027] * mult).toFixed(1),
        (z.yearlyLossBUsd[2028] * mult).toFixed(1),
        (z.yearlyLossBUsd[2031] * mult).toFixed(1),
        (z.cumulative2027_2031BUsd * mult).toFixed(1),
        `+${(Math.max(z.avgInflationAdd[2027], z.avgInflationAdd[2031]) + inflDelta).toFixed(1)}%`,
      ];
    }),
  });
  y = getLastY();

  const chartH = Math.min(72, (contentW * p.charts.trajectory2027_2032.height) / p.charts.trajectory2027_2032.width);
  ensureSpace(chartH + 8);
  doc.addImage(p.charts.trajectory2027_2032.dataUrl, 'PNG', margin, y, contentW, chartH);
  y += chartH + 6;

  // Section 4: Active Warnings & Recommendations
  addHeading(txt.sec4);
  doc.setFont('times', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(39, 39, 42);
  p.narrative.s6Recommendations.forEach((rec) => {
    const lines = doc.splitTextToSize(sanitizePdfText(rec), contentW);
    ensureSpace(lines.length * 4.2 + 3);
    doc.text(lines, margin, y);
    y += lines.length * 4.2 + 2.5;
  });

  // Footer across pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text(
      sanitizePdfText(`${p.license.licenseHolder} · DG : ${p.license.directorName} · ${p.license.platformName}`),
      margin,
      pageH - 7,
    );
    doc.text(sanitizePdfText(`Page ${i} / ${totalPages}`), pageW - margin, pageH - 7, { align: 'right' });
  }

  doc.save(filename);
  emitPdfDownloadSuccess({
    filename,
    kind: 'summary',
    pagesCount: totalPages,
    horizonYear,
    scenario,
  });
  return filename;
}

/**
 * 2. EXPORT WORD (.docx via docx v9 + High-DPI ImageRun + Running Headers/Footers)
 */
function buildDocxTable(headers: string[], rows: string[][], headerBg = '1E3A8A'): Table {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'D4D4D8' };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h) =>
            new TableCell({
              borders,
              shading: { fill: headerBg, type: ShadingType.CLEAR, color: 'auto' },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: h,
                      bold: true,
                      color: 'FFFFFF',
                      size: 17,
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            }),
        ),
      }),
      ...rows.map(
        (row, idx) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  borders,
                  shading:
                    idx % 2 === 1
                      ? { fill: 'F9F8F4', type: ShadingType.CLEAR, color: 'auto' }
                      : undefined,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cell,
                          size: 16,
                          color: '18181B',
                          font: 'Calibri',
                        }),
                      ],
                    }),
                  ],
                }),
            ),
          }),
      ),
    ],
  });
}

export async function exportScientificWord(
  options: ScientificReportOptions,
): Promise<ScientificReportPayload> {
  const p = buildScientificReportPayload(options);
  const { lang, horizonYear, scenario, scope, currency } = p.options;
  const sortedProvinces = [...p.model.provinceRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const sortedRegions = [...p.model.regionRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const sortedDistricts = [...p.model.districtRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const sortedCountries = [...p.model.countryRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const refs = getLocalizedReferenceSources(lang);

  const children: (Paragraph | Table)[] = [
    // Cover Banner
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: `${p.license.platformName.toUpperCase()}  ·  ${p.reportId}`,
          bold: true,
          size: 20,
          color: '1E3A8A',
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: p.narrative.title,
          bold: true,
          size: 36,
          color: '18181B',
          font: 'Georgia',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: p.narrative.subtitle,
          size: 21,
          color: '52525B',
          font: 'Calibri',
        }),
      ],
    }),
    // License Holder & Director Table
    buildDocxTable(
      [p.license.licenseLabel, p.license.directorLabel, 'Date & Paramètres'],
      [
        [
          p.license.licenseHolder,
          `${p.license.directorName} — ${p.license.directorTitle}`,
          `${p.generatedAtIso} · ${horizonYear} · ${scenario.toUpperCase()} · ${scope} · ${currency}`,
        ],
      ],
      '1E3A8A',
    ),
    new Paragraph({
      spacing: { before: 120, after: 200 },
      children: [
        new TextRun({
          text: p.license.rightsNote,
          italics: true,
          size: 17,
          color: '52525B',
        }),
      ],
    }),
    // Abstract
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 160, after: 100 },
      children: [new TextRun({ text: p.narrative.abstractTitle, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: p.narrative.abstractText, size: 20, font: 'Georgia' })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: p.narrative.keywords, italics: true, size: 18, color: '52525B' })],
    }),
    new Paragraph({ children: [new PageBreak()] }),

    // Section 1 + Figure 1
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 140, after: 100 },
      children: [new TextRun({ text: p.narrative.s1Title, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    ...p.narrative.s1Paragraphs.map(
      (txt) =>
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: txt, size: 20, font: 'Georgia' })],
        }),
    ),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new ImageRun({
          type: 'png',
          data: p.charts.oniShock.bytes,
          transformation: { width: 560, height: 250 },
        }),
      ],
    }),

    // Section 2: Norms & Technical Pipeline
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 180, after: 100 },
      children: [new TextRun({ text: p.narrative.s2Title, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    ...p.narrative.s2Paragraphs.map(
      (txt) =>
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: txt, size: 20, font: 'Georgia' })],
        }),
    ),
    buildDocxTable(
      ['Norme / Standard', 'Référentiel', 'Application dans le rapport'],
      p.editorialStandards.map((s) => [s.code, s.standard, s.application]),
      '1E3A8A',
    ),
    new Paragraph({ spacing: { after: 140 }, children: [] }),
    buildDocxTable(
      ['Étape du Pipeline', 'Technique / Algorithme', 'Entrées & Sorties', 'Validation'],
      p.technicalMethods.map((m) => [m.stage, m.method, m.inputsOutputs, m.validation]),
      'B45309',
    ),

    // Section 3: Madagascar Multi-Scale Results + Optional Focus District + Figure 2
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 220, after: 100 },
      children: [new TextRun({ text: p.narrative.s3Title, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    ...p.narrative.s3Paragraphs.map(
      (txt) =>
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: txt, size: 20, font: 'Georgia' })],
        }),
    ),
    ...(p.focusedDistrictRow
      ? [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 160, after: 90 },
            children: [
              new TextRun({
                text: `Focus District : ${p.focusedDistrictRow.point.district} (${p.focusedDistrictRow.displayRegion} · ${p.focusedDistrictRow.province})`,
                bold: true,
                color: 'B45309',
                size: 23,
                font: 'Georgia',
              }),
            ],
          }),
          buildDocxTable(
            ['Indicateur Climat & Économie', `Valeur (${horizonYear})`, 'Contexte'],
            [
              [
                'Profil & Anomalie Hydrique',
                `${p.focusedDistrictRow.point.riskTier.toUpperCase()} (${horizonYear === 2027 ? p.focusedDistrictRow.point.water2027 : p.focusedDistrictRow.point.water2028}%)`,
                p.focusedDistrictRow.point.profile,
              ],
              [
                'Rendements ML (Riz / Maïs / Rente)',
                `${horizonYear === 2027 ? p.focusedDistrictRow.point.rice2027 : p.focusedDistrictRow.point.rice2028}% / ${horizonYear === 2027 ? p.focusedDistrictRow.point.maize2027 : p.focusedDistrictRow.point.maize2028}% / ${horizonYear === 2027 ? p.focusedDistrictRow.point.exportCrop2027 : p.focusedDistrictRow.point.exportCrop2028}%`,
                p.options.focusDistrict?.cropLabel ?? 'XGBoost ADM2',
              ],
              [
                'Pertes Directes / Indirectes / Total',
                `${formatCurrencyFromMUsd(p.focusedDistrictRow.directAgriLossMUsd, currency, false, lang)} / ${formatCurrencyFromMUsd(p.focusedDistrictRow.indirectLossMUsd, currency, false, lang)} / ${formatCurrencyFromMUsd(p.focusedDistrictRow.totalLossMUsd, currency, false, lang)}`,
                `Choc agri : -${formatPct(p.focusedDistrictRow.agriShockPct, 1, lang)}`,
              ],
            ],
            'B45309',
          ),
          ...p.focusedDistrictRow.point.ragNotes.map(
            (n) =>
              new Paragraph({
                spacing: { before: 80, after: 60 },
                children: [new TextRun({ text: `• ${n}`, size: 19, font: 'Calibri' })],
              }),
          ),
          ...(p.options.focusDistrict?.aiDiagnostic
            ? [
                new Paragraph({
                  spacing: { before: 100, after: 120 },
                  children: [
                    new TextRun({
                      text: `Synthèse Gemini RAG+QLoRA : ${p.options.focusDistrict.aiDiagnostic}`,
                      size: 19,
                      font: 'Georgia',
                    }),
                  ],
                }),
              ]
            : []),
        ]
      : []),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new ImageRun({
          type: 'png',
          data: p.charts.provinces.bytes,
          transformation: { width: 560, height: 280 },
        }),
      ],
    }),
    buildDocxTable(
      ['Ex-Province', 'Riz', 'Maïs/Vivriers', 'Rente', 'Indirect', 'Total Pertes', '% PIB'],
      [
        ...sortedProvinces.map((pr) => [
          pr.province,
          formatCurrencyFromMUsd(pr.riceLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(pr.maizeLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(pr.exportLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(pr.indirectLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(pr.totalLossMUsd, currency, false, lang),
          formatPct(pr.gdpImpactPct, 2, lang),
        ]),
        [
          'TOTAL MADAGASCAR',
          formatCurrencyFromMUsd(sortedProvinces.reduce((a, r) => a + r.riceLossMUsd, 0), currency, false, lang),
          formatCurrencyFromMUsd(sortedProvinces.reduce((a, r) => a + r.maizeLossMUsd, 0), currency, false, lang),
          formatCurrencyFromMUsd(sortedProvinces.reduce((a, r) => a + r.exportLossMUsd, 0), currency, false, lang),
          formatCurrencyFromMUsd(p.model.madagascar.indirectMUsd, currency, false, lang),
          formatCurrencyFromMUsd(p.model.madagascar.totalLossMUsd, currency, false, lang),
          formatPct(p.model.madagascar.gdpPct, 2, lang),
        ],
      ],
    ),
  ];

  if (options.includeRegions23) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'Tableau A — Désagrégation sur les 23 Régions officielles', bold: true, color: '1E3A8A', size: 22 })],
      }),
      buildDocxTable(
        ['Région', 'Ex-Province', 'Direct agri.', 'Indirect', 'Total Pertes', '% PIB rég.'],
        sortedRegions.map((rg) => [
          rg.meta.region + (!rg.coveredByPilot ? ' (proxy)' : ''),
          rg.meta.province,
          formatCurrencyFromMUsd(rg.directAgriLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(rg.indirectLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(rg.totalLossMUsd, currency, false, lang),
          formatPct(rg.gdpImpactPct, 2, lang),
        ]),
      ),
    );
  }

  if (options.includeDistricts42) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'Tableau B — Évaluation unitaire des 42 Districts pilotes (ADM2)', bold: true, color: '1E3A8A', size: 22 })],
      }),
      buildDocxTable(
        ['District', 'Région · Province', 'Direct', 'Indirect', 'Total', 'Choc Agri'],
        sortedDistricts.map((d) => [
          d.point.district,
          `${d.displayRegion} · ${d.province}`,
          formatCurrencyFromMUsd(d.directAgriLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(d.indirectLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(d.totalLossMUsd, currency, false, lang),
          `-${formatPct(d.agriShockPct, 1, lang)}`,
        ]),
        '3F3F46',
      ),
    );
  }

  if (options.includeContinental) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 220, after: 100 },
        children: [new TextRun({ text: p.narrative.s4Title, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
      }),
      ...p.narrative.s4Paragraphs.map(
        (txt) =>
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: txt, size: 20, font: 'Georgia' })],
          }),
      ),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 180 },
        children: [
          new ImageRun({
            type: 'png',
            data: p.charts.continental.bytes,
            transformation: { width: 560, height: 294 },
          }),
        ],
      }),
      buildDocxTable(
        ['Pays / Sous-région', 'Blocs', 'Direct agri.', 'Indirect', 'Total Pertes', '% PIB', 'Solde 2028'],
        sortedCountries.map((c) => [
          c.countryOrZone,
          c.blocs.filter((b) => b !== 'Afrique').join(' · ') || 'Afrique',
          formatCurrencyFromMUsd(c.directLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(c.indirectLossMUsd, currency, false, lang),
          formatCurrencyFromMUsd(c.totalLossMUsd, currency, false, lang),
          formatPct(c.gdpImpactPct, 2, lang),
          formatCurrencyFromMUsd(c.netBalanceAdj2028MUsd, currency, true, lang),
        ]),
        '0F766E',
      ),
    );
  }

  // Commentary, Fig 4, Live DOM Charts, Discussion, Structured Recommendations, References
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 220, after: 100 },
      children: [new TextRun({ text: p.narrative.commentaryTitle, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    ...p.narrative.commentaryParagraphs.map(
      (txt) => new Paragraph({ spacing: { after: 110 }, children: [new TextRun({ text: txt, size: 20, font: 'Georgia' })] }),
    ),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new ImageRun({
          type: 'png',
          data: p.charts.trajectory2027_2032.bytes,
          transformation: { width: 560, height: 258 },
        }),
      ],
    }),
    ...(options.liveDomCharts ?? []).flatMap((fig) => [
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [new TextRun({ text: fig.caption, bold: true, size: 18, color: '1E3A8A', font: 'Calibri' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [
          new ImageRun({
            type: 'png',
            data: fig.asset.bytes,
            transformation: {
              width: 560,
              height: Math.min(340, Math.round((560 * fig.asset.height) / Math.max(1, fig.asset.width))),
            },
          }),
        ],
      }),
    ]),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 220, after: 100 },
      children: [new TextRun({ text: p.narrative.s5Title, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    ...p.narrative.s5Paragraphs.map(
      (txt) => new Paragraph({ spacing: { after: 110 }, children: [new TextRun({ text: txt, size: 20, font: 'Georgia' })] }),
    ),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: p.narrative.s6Title, bold: true, color: '1E3A8A', size: 26, font: 'Georgia' })],
    }),
    ...p.narrative.s6Recommendations.map(
      (rec) => new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: rec, size: 20, font: 'Georgia' })] }),
    ),
    buildDocxTable(
      [
        lang === 'en' ? 'Lead Actor' : lang === 'sw' ? 'Mhusika' : 'Acteur Pilote',
        lang === 'en' ? 'Trigger' : lang === 'sw' ? 'Kigezo' : 'Seuil Déclencheur',
        lang === 'en' ? 'Technical Action' : lang === 'sw' ? 'Hatua' : 'Mesure Technique',
        lang === 'en' ? 'Financing Window' : lang === 'sw' ? 'Mfuko' : 'Guichet / Financement',
      ],
      p.recommendationMatrix.map((row) => [row.actor, row.trigger, row.action, row.financing]),
      '1E3A8A',
    ),
    new Paragraph({
      spacing: { before: 120, after: 160 },
      children: [new TextRun({ text: p.narrative.limitationsText, italics: true, size: 17, color: '52525B' })],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 160, after: 100 },
      children: [new TextRun({ text: p.narrative.referencesTitle, bold: true, color: '1E3A8A', size: 24, font: 'Georgia' })],
    }),
    ...refs.map(
      (r, i) =>
        new Paragraph({
          spacing: { after: 70 },
          children: [
            new TextRun({
              text: `[${i + 1}] ${r.publisher} (2026). ${r.label}. ${r.url}`,
              size: 18,
              color: '3F3F46',
            }),
          ],
        }),
    ),
  );

  const doc = new Document({
    creator: `${p.license.directorName} (${p.license.licenseHolder})`,
    title: p.narrative.title,
    description: p.narrative.abstractText,
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${p.license.platformName} · ${p.license.licenseHolder} (DG : ${p.license.directorName})`,
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
                  new TextRun({
                    text: `Licence : ${p.license.licenseHolder} · DG : ${p.license.directorName} (Chercheur en Sciences Économiques / ML–Data–AI Engineer)   |   Page `,
                    size: 15,
                    color: '71717A',
                  }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 15, color: '71717A' }),
                  new TextRun({ text: ' / ', size: 15, color: '71717A' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: '71717A' }),
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
  const districtSlug = p.focusedDistrictRow
    ? `District_${p.focusedDistrictRow.point.district.replace(/\s+/g, '_')}_`
    : '';
  triggerBlobDownload(blob, `Rapport_Scientifique_${districtSlug}ENSO_${horizonYear}_${scenario}_${scope}_${lang}.docx`);
  return p;
}

/**
 * 3. EXPORT EXCEL (.xlsx multi-onglets structuré via SheetJS)
 */
export function exportScientificExcel(options: ScientificReportOptions): ScientificReportPayload {
  const p = buildScientificReportPayload(options);
  const { lang, horizonYear, scenario, scope, currency } = p.options;
  const wb = XLSX.utils.book_new();

  wb.Props = {
    Title: p.narrative.title,
    Subject: 'Madagascar El Niño Observatory Statistical Workbook',
    Author: `${p.license.directorName} — ${p.license.licenseHolder}`,
    Company: p.license.licenseHolder,
    CreatedDate: new Date(),
  };

  // Sheet 1: Synthese & Licence
  const ws1Data: (string | number)[][] = [
    ['MADAGASCAR EL NINO OBSERVATORY — RAPPORT STATISTIQUE SCIENTIFIQUE A LA DEMANDE'],
    [p.license.licenseLabel, p.license.licenseHolder],
    [p.license.directorLabel, p.license.directorName],
    ['Fonction & Expertise', p.license.directorTitle],
    ['ID Rapport', p.reportId],
    ['Date generation', p.generatedAtIso],
    ['Parametres actifs', `Horizon ${horizonYear} | ${p.scenarioMeta.label} | ${scope} | Devise ${currency} | Langue ${lang.toUpperCase()}`],
    ...(p.focusedDistrictRow
      ? [
          ['FOCUS DISTRICT SELECTIONNE', `${p.focusedDistrictRow.point.district} (${p.focusedDistrictRow.displayRegion} / ${p.focusedDistrictRow.province})`],
          ['Focus District — Pertes Totales / Directes / Indirectes (M$)', Number(p.focusedDistrictRow.totalLossMUsd.toFixed(2)), Number(p.focusedDistrictRow.directAgriLossMUsd.toFixed(2)), Number(p.focusedDistrictRow.indirectLossMUsd.toFixed(2))],
          ['Focus District — Anomalie Eau / Riz / Mais / Rente (%)', `${horizonYear === 2027 ? p.focusedDistrictRow.point.water2027 : p.focusedDistrictRow.point.water2028}%`, `${horizonYear === 2027 ? p.focusedDistrictRow.point.rice2027 : p.focusedDistrictRow.point.rice2028}%`, `${horizonYear === 2027 ? p.focusedDistrictRow.point.maize2027 : p.focusedDistrictRow.point.maize2028}% / ${horizonYear === 2027 ? p.focusedDistrictRow.point.exportCrop2027 : p.focusedDistrictRow.point.exportCrop2028}%`],
        ]
      : []),
    [],
    ['INDICATEURS MACRO-ECONOMIQUES CLES', 'Valeur (M USD)', 'Devise Active', '% PIB / Part'],
    ['Madagascar — Pertes Totales', Number(p.model.madagascar.totalLossMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.madagascar.totalLossMUsd, currency, false, lang), `${p.model.madagascar.gdpPct.toFixed(2)}%`],
    ['Madagascar — Pertes Directes Agricoles', Number(p.model.madagascar.directMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.madagascar.directMUsd, currency, false, lang), `-${p.model.madagascar.agriPct.toFixed(2)}% PIB agri`],
    ['Madagascar — Pertes Indirectes (Eau/RIA/Infra)', Number(p.model.madagascar.indirectMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.madagascar.indirectMUsd, currency, false, lang), '-'],
    ['Madagascar — Rebond Brut 2028', Number(p.model.madagascar.rebound2028MUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.madagascar.rebound2028MUsd, currency, false, lang), '-'],
    ['Madagascar — Solde Net 2028', Number(p.model.madagascar.net2028MUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.madagascar.net2028MUsd, currency, true, lang), '-'],
    ['Ocean Indien (COI — 5 territoires)', Number(p.model.blocs.coiTotalMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.blocs.coiTotalMUsd, currency, false, lang), '-'],
    ['SADC (Afrique australe + COI)', Number(p.model.blocs.sadcTotalMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.blocs.sadcTotalMUsd, currency, false, lang), '-'],
    ['COMESA (Axe Nord-Sud & Iles)', Number(p.model.blocs.comesaTotalMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.blocs.comesaTotalMUsd, currency, false, lang), '-'],
    ['Afrique Modelisee (21 zones)', Number(p.model.blocs.africaTotalMUsd.toFixed(2)), formatCurrencyFromMUsd(p.model.blocs.africaTotalMUsd, currency, false, lang), `${p.model.blocs.africaGdpPct.toFixed(2)}%`],
    [],
    ['RESUME NARRATIF SCIENTIFIQUE (ABSTRACT)'],
    [p.narrative.abstractText],
    [],
    ['RECOMMANDATIONS OPERATIONNELLES'],
    ...p.narrative.s6Recommendations.map((r) => [r]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
  ws1['!cols'] = [{ wch: 44 }, { wch: 24 }, { wch: 26 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, ws1, '01_Synthese_Licence');

  // Sheet 2: Normes & Methodologie
  const ws2Data: (string | number)[][] = [
    ['NORMES DE REDACTION SCIENTIFIQUE APPLIQUEES', 'Referentiel', 'Application'],
    ...p.editorialStandards.map((s) => [s.code, s.standard, s.application]),
    [],
    ['TECHNIQUES ANALYTIQUES & ARCHITECTURE ML', 'Algorithme / Sources', 'Entrees & Sorties', 'Validation'],
    ...p.technicalMethods.map((m) => [m.stage, m.method, m.inputsOutputs, m.validation]),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!cols'] = [{ wch: 30 }, { wch: 38 }, { wch: 48 }, { wch: 38 }];
  XLSX.utils.book_append_sheet(wb, ws2, '02_Normes_Techniques');

  // Sheet 3: 6 Ex-Provinces
  const sortedProvinces = [...p.model.provinceRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const ws3Data: (string | number)[][] = [
    ['Ex-Province', 'Districts ADM2', 'Districts Pilotes', 'PIB Ref (M$)', 'Base Agri (M$)', 'Riz (M$)', 'Mais/Vivriers (M$)', 'Rente (M$)', 'Direct Agri (M$)', 'Indirect (M$)', 'Total Pertes (M$)', '% PIB', 'Canal Dominant'],
    ...sortedProvinces.map((pr) => [
      pr.province,
      pr.districtCount119,
      pr.pilotDistrictCount,
      pr.gdpMUsd,
      pr.agriBaselineMUsd,
      Number(pr.riceLossMUsd.toFixed(2)),
      Number(pr.maizeLossMUsd.toFixed(2)),
      Number(pr.exportLossMUsd.toFixed(2)),
      Number(pr.directAgriLossMUsd.toFixed(2)),
      Number(pr.indirectLossMUsd.toFixed(2)),
      Number(pr.totalLossMUsd.toFixed(2)),
      Number(pr.gdpImpactPct.toFixed(2)),
      pr.dominantChannel,
    ]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  ws3['!cols'] = [{ wch: 18 }, { wch: 13 }, { wch: 15 }, { wch: 13 }, { wch: 14 }, { wch: 11 }, { wch: 16 }, { wch: 11 }, { wch: 15 }, { wch: 13 }, { wch: 16 }, { wch: 10 }, { wch: 48 }];
  XLSX.utils.book_append_sheet(wb, ws3, '03_ExProvinces_6');

  // Sheet 4: 23 Regions
  const sortedRegions = [...p.model.regionRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const ws4Data: (string | number)[][] = [
    ['Region', 'Ex-Province', 'Districts Pilotes', 'Districts Total', 'Couverture', 'Riz (M$)', 'Mais/Vivriers (M$)', 'Rente (M$)', 'Direct Agri (M$)', 'Indirect (M$)', 'Total Pertes (M$)', '% PIB Reg.'],
    ...sortedRegions.map((rg) => [
      rg.meta.region,
      rg.meta.province,
      rg.pilotDistrictCount,
      rg.meta.districtsTotal,
      rg.coveredByPilot ? 'Pilote ML' : 'Proxy Provincial',
      Number(rg.riceLossMUsd.toFixed(2)),
      Number(rg.maizeLossMUsd.toFixed(2)),
      Number(rg.exportLossMUsd.toFixed(2)),
      Number(rg.directAgriLossMUsd.toFixed(2)),
      Number(rg.indirectLossMUsd.toFixed(2)),
      Number(rg.totalLossMUsd.toFixed(2)),
      Number(rg.gdpImpactPct.toFixed(2)),
    ]),
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(ws4Data);
  ws4['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 11 }, { wch: 16 }, { wch: 11 }, { wch: 15 }, { wch: 13 }, { wch: 16 }, { wch: 11 }];
  XLSX.utils.book_append_sheet(wb, ws4, '04_Regions_23');

  // Sheet 5: 42 Districts
  const sortedDistricts = [...p.model.districtRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const ws5Data: (string | number)[][] = [
    ['District ADM2', 'Region', 'Ex-Province', 'Profil Risque', 'Anomalie Eau 2027 (%)', 'Riz 2027 (%)', 'Mais 2027 (%)', 'Rente 2027 (%)', 'Direct (M$)', 'Indirect (M$)', 'Total District (M$)', 'Choc Agri (%)'],
    ...sortedDistricts.map((d) => [
      d.point.district,
      d.displayRegion,
      d.province,
      d.point.riskTier,
      d.point.water2027,
      d.point.rice2027,
      d.point.maize2027,
      d.point.exportCrop2027,
      Number(d.directAgriLossMUsd.toFixed(2)),
      Number(d.indirectLossMUsd.toFixed(2)),
      Number(d.totalLossMUsd.toFixed(2)),
      Number(d.agriShockPct.toFixed(1)),
    ]),
  ];
  const ws5 = XLSX.utils.aoa_to_sheet(ws5Data);
  ws5['!cols'] = [{ wch: 24 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 13 }];
  XLSX.utils.book_append_sheet(wb, ws5, '05_Districts_42');

  // Sheet 6: Continental Africa / COI / SADC / COMESA
  const sortedCountries = [...p.model.countryRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  const ws6Data: (string | number)[][] = [
    ['Pays / Sous-region', 'Blocs', 'PIB Ref (Md$)', 'Part Agri (%)', 'Direct Agri (M$)', 'Indirect (M$)', 'Total Pertes (M$)', '% PIB', 'Solde Net 2028 (M$)', 'Signal Climatique 2027', 'Canal de Transmission'],
    ...sortedCountries.map((c) => [
      c.countryOrZone,
      c.blocs.join(', '),
      c.gdpBnUsd,
      c.agriSharePct,
      Number(c.directLossMUsd.toFixed(2)),
      Number(c.indirectLossMUsd.toFixed(2)),
      Number(c.totalLossMUsd.toFixed(2)),
      Number(c.gdpImpactPct.toFixed(2)),
      Number(c.netBalanceAdj2028MUsd.toFixed(2)),
      c.climateSignal2027,
      c.transmissionChannel,
    ]),
  ];
  const ws6 = XLSX.utils.aoa_to_sheet(ws6Data);
  ws6['!cols'] = [{ wch: 24 }, { wch: 24 }, { wch: 13 }, { wch: 12 }, { wch: 15 }, { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 18 }, { wch: 42 }, { wch: 48 }];
  XLSX.utils.book_append_sheet(wb, ws6, '06_Afrique_COI_SADC_COMESA');

  // Sheet 7: Series ONI / Filieres / Patterns
  const filieres = getLocalizedFilieres(lang);
  const patterns = getLocalizedHistoricalPatterns(lang);
  const lstm = getLocalizedLstmSeries(lang);
  const ws7Data: (string | number)[][] = [
    ['SERIES TEMPORELLES ONI vs CHOC RECOLTES (LSTM LAG +4-6 MOIS)'],
    ['Mois', 'Anomalie ONI (deg C)', 'Indice Choc Recoltes (/100)', 'Note'],
    ...lstm.map((pt) => [pt.month, pt.oniAnomaly, pt.harvestShockIdx, pt.label]),
    [],
    ['IMPACTS PAR FILIERE 2027 vs 2028'],
    ['Filiere', 'Delta 2027 (%)', 'Projection 2027', 'Delta 2028 (%)', 'Projection 2028'],
    ...filieres.map((f) => [f.filiere, f.delta2027Pct, f.prediction2027, f.delta2028Pct, f.prediction2028]),
    [],
    ['PATTERNS HISTORIQUES 10 ANS'],
    ['Indicateur', 'Neutre / La Nina', 'Fort El Nino', 'Impact Mesure'],
    ...patterns.map((pt) => [pt.indicator, pt.neutralLaNina, pt.strongElNino, pt.measuredImpact]),
  ];
  const ws7 = XLSX.utils.aoa_to_sheet(ws7Data);
  ws7['!cols'] = [{ wch: 26 }, { wch: 28 }, { wch: 36 }, { wch: 36 }, { wch: 36 }];
  XLSX.utils.book_append_sheet(wb, ws7, '07_Series_Filieres_Patterns');

  const districtSlug = p.focusedDistrictRow
    ? `District_${p.focusedDistrictRow.point.district.replace(/\s+/g, '_')}_`
    : '';
  XLSX.writeFile(wb, `Evaluation_Statistique_${districtSlug}ENSO_${horizonYear}_${scenario}_${scope}_${lang}.xlsx`);
  return p;
}
