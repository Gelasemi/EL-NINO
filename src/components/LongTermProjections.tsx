import { useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowUpDown,
  Check,
  Database,
  Download,
  Globe,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import {
  CONTINENT_COMPARISON_6,
  DUPLICATED_195_COUNTRIES,
  UN_ZONE_SUMMARIES,
  WORLD_CLIMATE_ZONES,
} from '../data/worldEnso195Data';
import { emitIndriActivity } from '../utils/indriEvents';

type ScopeMode = 'zones' | 'continents' | 'climate-zones';
type ScenarioMode = 'baseline' | 'severe' | 'adaptation';
type FocusDomain = 'all' | 'economic' | 'social' | 'climate';
type SortField =
  | 'regionName'
  | 'cumulativeLoss2028_2032BUsd'
  | 'foodInflationPeakPct'
  | 'socialDisplacementScore'
  | 'climateSeverityScore';

export interface ComparativeTrajectoryRow {
  id: string;
  regionName: string;
  economic2028Pct: number;
  economic2030Pct: number;
  economic2032Pct: number;
  cumulativeLoss2028_2032BUsd: number;
  economicOutlook: string;
  foodInflationPeakPct: number;
  socialDisplacementScore: number;
  socialOutlook: string;
  climateRegime: string;
  climateSeverityScore: number;
  climateOutlook: string;
  priorityAction: string;
}

interface GeminiProjectionPayload {
  model: string;
  scopeMode: ScopeMode;
  scenario: ScenarioMode;
  focusDomain: FocusDomain;
  executiveSummary: string;
  methodologyNote: string;
  strategicTakeaways: string[];
  comparativeRows: ComparativeTrajectoryRow[];
}

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (val: string | number) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildBaselineRows(
  scopeMode: ScopeMode,
  scenario: ScenarioMode,
  isFr: boolean,
): ComparativeTrajectoryRow[] {
  const scenarioScale =
    scenario === 'severe' ? 1.24 : scenario === 'adaptation' ? 0.68 : 1.0;

  if (scopeMode === 'zones') {
    return UN_ZONE_SUMMARIES.map((z) => {
      const countries = DUPLICATED_195_COUNTRIES.filter((c) => c.unZone === z.id);
      const count = Math.max(1, countries.length);
      const avg28 = Number(
        ((countries.reduce((s, c) => s + c.projections[2028].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
      );
      const avg30 = Number(
        ((countries.reduce((s, c) => s + c.projections[2030].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
      );
      const avg32 = Number(
        ((countries.reduce((s, c) => s + c.projections[2032].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
      );
      const cumLoss = Number(
        (
          (z.yearlyLossBUsd[2028] +
            z.yearlyLossBUsd[2029] +
            z.yearlyLossBUsd[2030] +
            z.yearlyLossBUsd[2031] +
            z.yearlyLossBUsd[2032]) *
          scenarioScale
        ).toFixed(1),
      );
      const avgDisp = Math.min(
        98,
        Math.round(
          (countries.reduce((s, c) => s + c.projections[2031].displacementIdx, 0) / count) *
            (scenario === 'severe' ? 1.15 : scenario === 'adaptation' ? 0.78 : 1.0),
        ),
      );
      const avgHazard = Math.min(
        98,
        Math.round(
          (countries.reduce(
            (s, c) => s + Math.max(c.projections[2028].droughtIdx, c.projections[2031].floodIdx, c.projections[2031].droughtIdx),
            0,
          ) /
            count) *
            (scenario === 'severe' ? 1.12 : scenario === 'adaptation' ? 0.82 : 1.0),
        ),
      );
      const peakInfl = Number(
        (Math.max(z.avgInflationAdd[2028], z.avgInflationAdd[2031]) * scenarioScale).toFixed(1),
      );

      return {
        id: z.id,
        regionName: isFr ? z.nameFr : z.nameEn,
        economic2028Pct: avg28,
        economic2030Pct: avg30,
        economic2032Pct: avg32,
        cumulativeLoss2028_2032BUsd: cumLoss,
        economicOutlook: isFr
          ? `${z.countryCount} États · Érosion cumulée sous transition La Niña et lag PIB 2031.`
          : `${z.countryCount} UN states · Cumulative drag through La Niña shift & 2031 lag peak.`,
        foodInflationPeakPct: peakInfl,
        socialDisplacementScore: avgDisp,
        socialOutlook: isFr
          ? `${z.popM.toFixed(0)} M hab. · Pression migration rurale, santé hydrique & pouvoir d’achat.`
          : `${z.popM.toFixed(0)}M pop. · Rural mobility, waterborne risk & staple affordability pressure.`,
        climateRegime: isFr
          ? 'La Niña (2028) → +1,5 °C (2030–2031)'
          : 'La Niña (2028) → +1.5°C (2030–2031)',
        climateSeverityScore: avgHazard,
        climateOutlook: isFr
          ? 'Alternance anomalies thermiques, stress hydrique et événements extrêmes.'
          : 'Alternating thermal extremes, hydrological deficits & convective storms.',
        priorityAction: isFr
          ? 'PNA, stockage stratégique & filets sociaux adaptatifs'
          : 'National Adaptation Plans, grain reserves & shock-responsive safety nets',
      };
    });
  }

  if (scopeMode === 'continents') {
    const continentZoneMap: Record<string, string[]> = {
      Asie: ['asie'],
      Afrique: ['afrique'],
      Europe: ['europe'],
      Océanie: ['oceanie'],
      'Amérique (Nord + Latine/Caraïbes)': ['amerique-du-nord', 'amerique-latine-caraibes'],
      Antarctique: [],
    };
    return CONTINENT_COMPARISON_6.map((cont) => {
      const zoneIds = continentZoneMap[cont.nameFr] ?? [];
      const countries = DUPLICATED_195_COUNTRIES.filter((c) => zoneIds.includes(c.unZone));
      const count = countries.length;
      if (count === 0) {
        return {
          id: 'antarctica',
          regionName: isFr ? cont.nameFr : cont.nameEn,
          economic2028Pct: 0,
          economic2030Pct: 0,
          economic2032Pct: 0,
          cumulativeLoss2028_2032BUsd: 0,
          economicOutlook: isFr
            ? 'Aucune économie permanente ; coût logistique des stations scientifiques.'
            : 'No permanent economy; scientific station & Southern Ocean monitoring costs.',
          foodInflationPeakPct: 0,
          socialDisplacementScore: 2,
          socialOutlook: isFr
            ? 'Population saisonnière uniquement (0 État ONU).'
            : 'Seasonal research population only (0 UN states).',
          climateRegime: isFr
            ? 'Albédo polaire & fonte banquise australe'
            : 'Polar albedo & Southern Ocean heat uptake',
          climateSeverityScore: scenario === 'severe' ? 78 : 66,
          climateOutlook: isFr
            ? 'Rôle régulateur critique sur le niveau marin mondial 2028–2032.'
            : 'Critical global sea-level and thermohaline driver over 2028–2032.',
          priorityAction: isFr
            ? 'Observation cryosphérique & réduction émissions'
            : 'Cryosphere telemetry & global emissions mitigation',
        };
      }

      const avg28 = Number(
        ((countries.reduce((s, c) => s + c.projections[2028].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
      );
      const avg30 = Number(
        ((countries.reduce((s, c) => s + c.projections[2030].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
      );
      const avg32 = Number(
        ((countries.reduce((s, c) => s + c.projections[2032].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
      );
      const cumLoss = Number(
        (
          countries.reduce(
            (s, c) =>
              s +
              c.projections[2028].lossBUsd +
              c.projections[2029].lossBUsd +
              c.projections[2030].lossBUsd +
              c.projections[2031].lossBUsd +
              c.projections[2032].lossBUsd,
            0,
          ) * scenarioScale
        ).toFixed(1),
      );
      const peakInfl = Number(
        ((countries.reduce((s, c) => s + Math.max(c.projections[2028].inflationAddPct, c.projections[2031].inflationAddPct), 0) /
          count) *
          scenarioScale).toFixed(1),
      );
      const dispScore = Math.min(
        98,
        Math.round(
          (countries.reduce((s, c) => s + c.projections[2031].displacementIdx, 0) / count) *
            (scenario === 'severe' ? 1.14 : scenario === 'adaptation' ? 0.76 : 1.0),
        ),
      );
      const climScore = Math.min(
        98,
        Math.round(
          (countries.reduce(
            (s, c) => s + Math.max(c.projections[2028].droughtIdx, c.projections[2031].floodIdx, c.projections[2031].droughtIdx),
            0,
          ) /
            count) *
            (scenario === 'severe' ? 1.12 : scenario === 'adaptation' ? 0.80 : 1.0),
        ),
      );

      return {
        id: cont.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        regionName: isFr ? cont.nameFr : cont.nameEn,
        economic2028Pct: avg28,
        economic2030Pct: avg30,
        economic2032Pct: avg32,
        cumulativeLoss2028_2032BUsd: cumLoss,
        economicOutlook: isFr ? cont.noteFr : cont.noteEn,
        foodInflationPeakPct: peakInfl,
        socialDisplacementScore: dispScore,
        socialOutlook: isFr
          ? `${cont.popB.toFixed(2)} Md hab. · ${cont.unStates} États ONU exposés.`
          : `${cont.popB.toFixed(2)}B pop. · ${cont.unStates} UN states exposed.`,
        climateRegime: isFr
          ? 'Cycle ENSO 2028–2032 + réchauffement régional'
          : '2028–2032 ENSO swing + regional warming',
        climateSeverityScore: climScore,
        climateOutlook: isFr
          ? `Superficie ${cont.areaMKm2} M km² sous stress hydrique/thermique différencié.`
          : `${cont.areaMKm2}M km² experiencing differentiated hydrological/thermal stress.`,
        priorityAction: isFr
          ? 'Infrastructures résilientes & diversification agricole'
          : 'Resilient infrastructure & climate-smart agriculture',
      };
    });
  }

  // Climate zones (12)
  return WORLD_CLIMATE_ZONES.map((z) => {
    const countries = DUPLICATED_195_COUNTRIES.filter((c) => c.climateZone === z.id);
    const count = Math.max(1, countries.length);
    const avg28 = Number(
      ((countries.reduce((s, c) => s + c.projections[2028].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
    );
    const avg30 = Number(
      ((countries.reduce((s, c) => s + c.projections[2030].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
    );
    const avg32 = Number(
      ((countries.reduce((s, c) => s + c.projections[2032].gdpDeltaPct, 0) / count) * scenarioScale).toFixed(2),
    );
    const cumLoss = Number(
      (
        countries.reduce(
          (s, c) =>
            s +
            c.projections[2028].lossBUsd +
            c.projections[2029].lossBUsd +
            c.projections[2030].lossBUsd +
            c.projections[2031].lossBUsd +
            c.projections[2032].lossBUsd,
          0,
        ) * scenarioScale
      ).toFixed(1),
    );
    const s28 = z.yearlySignal[2028];
    const s31 = z.yearlySignal[2031];
    const peakInfl = Number((Math.max(s28.inflationAddPct, s31.inflationAddPct) * scenarioScale).toFixed(1));
    const dispScore = Math.min(
      98,
      Math.round(Math.max(s28.displacementScore, s31.displacementScore) * (scenario === 'severe' ? 1.12 : scenario === 'adaptation' ? 0.78 : 1.0)),
    );
    const climScore = Math.min(
      98,
      Math.round(Math.max(s28.droughtIndex, s28.floodIndex, s31.droughtIndex, s31.floodIndex) * (scenario === 'severe' ? 1.1 : scenario === 'adaptation' ? 0.8 : 1.0)),
    );

    return {
      id: z.id,
      regionName: isFr ? z.nameFr : z.nameEn,
      economic2028Pct: avg28,
      economic2030Pct: avg30,
      economic2032Pct: avg32,
      cumulativeLoss2028_2032BUsd: cumLoss,
      economicOutlook: isFr ? z.agriEnergyFr : z.agriEnergyEn,
      foodInflationPeakPct: peakInfl,
      socialDisplacementScore: dispScore,
      socialOutlook: isFr ? z.healthDisplacementFr : z.healthDisplacementEn,
      climateRegime: isFr ? s31.regimeFr : s31.regimeEn,
      climateSeverityScore: climScore,
      climateOutlook: isFr ? z.weather2027Fr : z.weather2027En,
      priorityAction: isFr
        ? 'Assurance paramétrique, SCV/Zaï & alerte précoce'
        : 'Parametric insurance, SCV/Zaï & early warning',
    };
  });
}

interface LtpLocaleCopy {
  eyebrow: string;
  title: string;
  lead: string;
  scopeLabel: string;
  scopeZones: string;
  scopeContinents: string;
  scopeClimate: string;
  scenarioLabel: string;
  scenBaseline: string;
  scenSevere: string;
  scenAdapt: string;
  focusLabel: string;
  focusAll: string;
  focusEco: string;
  focusSoc: string;
  focusClim: string;
  promptPlaceholder: string;
  analyzeBtn: string;
  analyzingBtn: string;
  resetAiBtn: string;
  exportCsv: string;
  sourceAi: string;
  sourceBase: string;
  chartTitle: string;
  tableTitle: string;
  cumLossKpi: string;
  socialKpi: string;
  climateKpi: string;
  entitiesCompared: string;
  retryBtn: string;
}

const LTP_COPY: Record<WorldLanguageCode, LtpLocaleCopy> = {
  fr: {
    eyebrow: '12 · Prospective IA · Analyse Comparée Multi-Dimensionnelle 2028–2032',
    title: 'Trajectoires Économiques, Sociales et Climatiques 2028–2032 (Analyse Gemini)',
    lead: 'Comparez les zones mondiales, les continents et les 12 zones climatiques à l’horizon 2028–2032. Lancez l’analyse structurée Gemini pour synthétiser les chocs PIB, les tensions sociales (inflation alimentaire, migrations) et les régimes climatiques.',
    scopeLabel: 'Découpage géographique',
    scopeZones: '6 Zones ONU',
    scopeContinents: '6 Continents',
    scopeClimate: '12 Zones Climatiques',
    scenarioLabel: 'Scénario 2028–2032',
    scenBaseline: 'Transition de base (La Niña → Lag 2031)',
    scenSevere: 'Choc extrême non atténué (Oxford ~$4T)',
    scenAdapt: 'Adaptation accélérée (PNA · SCV · Assurance)',
    focusLabel: 'Axe prioritaire',
    focusAll: 'Économie + Social + Climat',
    focusEco: 'Économique (PIB & Commerce)',
    focusSoc: 'Social (Faim & Migrations)',
    focusClim: 'Climatique (Aléas & Régimes)',
    promptPlaceholder: 'Question analytique optionnelle pour Gemini (ex. comparer Afrique vs Asie du Sud en 2031)...',
    analyzeBtn: 'Analyser 2028–2032 avec Gemini',
    analyzingBtn: 'Analyse Gemini en cours...',
    resetAiBtn: 'Revenir à la base observatoire',
    exportCsv: 'Exporter CSV',
    sourceAi: 'Synthèse structurée Gemini (gemini-4-hydrogen) · Calibrée Dartmouth & Oxford Economics',
    sourceBase: 'Base quantitative Observatoire (195 États ONU) · Cliquez sur « Analyser avec Gemini »',
    chartTitle: 'Comparaison Visuelle : Pertes Cumulées 2028–2032 (Md USD) vs Scores Social & Climat (0–100)',
    tableTitle: 'Tableau Comparatif Multi-Dimensionnel 2028–2032',
    cumLossKpi: 'Pertes cumulées modélisées (2028–2032)',
    socialKpi: 'Indice moyen pression sociale & déplacements',
    climateKpi: 'Indice moyen sévérité climatique 2028–2032',
    entitiesCompared: 'entités comparées',
    retryBtn: 'Réessayer',
  },
  en: {
    eyebrow: '12 · AI Foresight · Multi-Dimensional Comparative Analysis 2028–2032',
    title: 'Economic, Social & Climate Trajectories 2028–2032 (Gemini Analysis)',
    lead: 'Compare UN global zones, geographic continents, and 12 climate zones across 2028–2032. Run structured Gemini synthesis to assess GDP trajectories, social disruption (food inflation, displacement), and climate regime shifts.',
    scopeLabel: 'Geographic Scope',
    scopeZones: '6 UN Global Zones',
    scopeContinents: '6 Continents',
    scopeClimate: '12 Climate Zones',
    scenarioLabel: '2028–2032 Scenario',
    scenBaseline: 'Observatory Baseline (La Niña → 2031 Lag)',
    scenSevere: 'Severe Unmitigated (Oxford ~$4T)',
    scenAdapt: 'Accelerated Adaptation (NAP · SCV · Insurance)',
    focusLabel: 'Analytical Focus',
    focusAll: 'Economic + Social + Climate',
    focusEco: 'Economic (GDP & Trade)',
    focusSoc: 'Social (Food & Displacement)',
    focusClim: 'Climate (Hazards & Regimes)',
    promptPlaceholder: 'Optional focus question for Gemini (e.g. compare Africa vs South Asia debt & food inflation by 2031)...',
    analyzeBtn: 'Analyze 2028–2032 with Gemini',
    analyzingBtn: 'Running Gemini Analysis...',
    resetAiBtn: 'Revert to baseline',
    exportCsv: 'Export CSV',
    sourceAi: 'Structured Gemini Synthesis (gemini-4-hydrogen) · Calibrated to Dartmouth & Oxford Economics',
    sourceBase: 'Observatory Quantitative Baseline (195 UN Countries) · Click "Analyze with Gemini"',
    chartTitle: 'Visual Comparison: Cumulative Loss 2028–2032 ($B USD) vs Social & Climate Indices (0–100)',
    tableTitle: 'Comparative Trajectory Matrix 2028–2032',
    cumLossKpi: 'Cumulative Modeled Drag (2028–2032)',
    socialKpi: 'Mean Social & Displacement Index',
    climateKpi: 'Mean Climate Severity Index 2028–2032',
    entitiesCompared: 'entities compared',
    retryBtn: 'Retry',
  },
  sw: {
    eyebrow: '12 · Mtazamo wa AI · Uchambuzi Linganishi 2028–2032',
    title: 'Mienendo ya Kiuchumi, Kijamii na Tabianchi 2028–2032 (Uchambuzi wa Gemini)',
    lead: 'Linganisha kanda za dunia na mabara kwa kipindi cha 2028–2032. Tumia Gemini kuchambua athari za Pato la Taifa, mfumuko wa bei ya chakula, uhamaji na hatari za tabianchi.',
    scopeLabel: 'Mgawanyo wa Kijiografia',
    scopeZones: 'Kanda 6 za UN',
    scopeContinents: 'Mabara 6',
    scopeClimate: 'Kanda 12 za Tabianchi',
    scenarioLabel: 'Mwelekeo 2028–2032',
    scenBaseline: 'Msingi (Mpito wa La Niña → 2031)',
    scenSevere: 'Mshtuko Mkali (Oxford ~$4T)',
    scenAdapt: 'Uhimilivu wa Haraka (NAP · SCV)',
    focusLabel: 'Lengo kuu',
    focusAll: 'Uchumi + Jamii + Tabianchi',
    focusEco: 'Uchumi (GDP)',
    focusSoc: 'Jamii (Chakula & Uhamaji)',
    focusClim: 'Tabianchi',
    promptPlaceholder: 'Swali la hiari kwa Gemini kuhusu 2028–2032...',
    analyzeBtn: 'Chambua 2028–2032 na Gemini',
    analyzingBtn: 'Gemini inachambua...',
    resetAiBtn: 'Rudi kwenye msingi',
    exportCsv: 'Pakua CSV',
    sourceAi: 'Uchambuzi wa Gemini (gemini-4-hydrogen)',
    sourceBase: 'Takwimu za Msingi za Kituo (Nchi 195 za UN)',
    chartTitle: 'Taswira Linganishi: Hasara 2028–2032 (Md USD) dhidi ya Jamii na Tabianchi (0–100)',
    tableTitle: 'Jedwali Linganishi la 2028–2032',
    cumLossKpi: 'Hasara Jumuishi Zilizokadiriwa (2028–2032)',
    socialKpi: 'Wastani wa Shinikizo la Kijamii na Uhamaji',
    climateKpi: 'Wastani wa Ukali wa Tabianchi 2028–2032',
    entitiesCompared: 'maeneo yaliyochambuliwa',
    retryBtn: 'Jaribu tena',
  },
  es: {
    eyebrow: '12 · Prospectiva IA · Análisis Comparativo 2028–2032',
    title: 'Trayectorias Económicas, Sociales y Climáticas 2028–2032 (Análisis Gemini)',
    lead: 'Compare zonas globales ONU, continentes y 12 zonas climáticas para 2028–2032. Ejecute Gemini para sintetizar impactos del PIB, inflación alimentaria, desplazamientos y regímenes ENSO.',
    scopeLabel: 'Ámbito geográfico',
    scopeZones: '6 Zonas ONU',
    scopeContinents: '6 Continentes',
    scopeClimate: '12 Zonas Climáticas',
    scenarioLabel: 'Escenario 2028–2032',
    scenBaseline: 'Línea base (La Niña → Rezago 2031)',
    scenSevere: 'Choque severo sin mitigación (Oxford ~$4T)',
    scenAdapt: 'Adaptación acelerada (PNA · SCV · Seguro)',
    focusLabel: 'Enfoque prioritario',
    focusAll: 'Economía + Social + Clima',
    focusEco: 'Económico (PIB y Comercio)',
    focusSoc: 'Social (Hambre y Migración)',
    focusClim: 'Climático (Riesgos y Regímenes)',
    promptPlaceholder: 'Pregunta opcional para Gemini (ej. comparar África vs Asia del Sur en 2031)...',
    analyzeBtn: 'Analizar 2028–2032 con Gemini',
    analyzingBtn: 'Analizando con Gemini...',
    resetAiBtn: 'Volver a línea base',
    exportCsv: 'Exportar CSV',
    sourceAi: 'Síntesis Estructurada Gemini (gemini-4-hydrogen) · Calibrada Dartmouth y Oxford',
    sourceBase: 'Base Cuantitativa (195 Países ONU)',
    chartTitle: 'Comparación Visual: Pérdidas Acumuladas 2028–2032 ($B USD) vs Índices Social y Clima',
    tableTitle: 'Matriz Comparativa de Trayectorias 2028–2032',
    cumLossKpi: 'Pérdida Acumulada Modelada (2028–2032)',
    socialKpi: 'Índice Medio Social y Desplazamiento',
    climateKpi: 'Índice Medio de Severidad Climática',
    entitiesCompared: 'entidades comparadas',
    retryBtn: 'Reintentar',
  },
  ar: {
    eyebrow: '12 · الاستشراف الذكي · التحليل المقارن متعدد الأبعاد 2028–2032',
    title: 'المسارات الاقتصادية والاجتماعية والمناخية 2028–2032 (تحليل Gemini)',
    lead: 'قارن بين المناطق الأممية والقارات والمناطق المناخية الاثنتي عشرة حتى عام 2032. شغّل Gemini لتوليف صدمات الناتج المحلي وتضخم الغذاء والنزوح.',
    scopeLabel: 'النطاق الجغرافي',
    scopeZones: '6 مناطق أممية',
    scopeContinents: '6 قارات',
    scopeClimate: '12 منطقة مناخية',
    scenarioLabel: 'سيناريو 2028–2032',
    scenBaseline: 'خط الأساس (لانينيا ← ذروة 2031)',
    scenSevere: 'صدمة شديدة دون تخفيف (Oxford ~$4T)',
    scenAdapt: 'تكيف متسارع (خطط التكيف والتأمين)',
    focusLabel: 'محور التركيز',
    focusAll: 'الاقتصاد + المجتمع + المناخ',
    focusEco: 'الاقتصادي (الناتج والتجارة)',
    focusSoc: 'الاجتماعي (الغذاء والنزوح)',
    focusClim: 'المناخي (المخاطر والأنظمة)',
    promptPlaceholder: 'سؤال تحليلي اختياري لـ Gemini (مثال: مقارنة أفريقيا وجنوب آسيا في 2031)...',
    analyzeBtn: 'تحليل 2028–2032 عبر Gemini',
    analyzingBtn: 'جارٍ التحليل عبر Gemini...',
    resetAiBtn: 'العودة لخط الأساس',
    exportCsv: 'تصدير CSV',
    sourceAi: 'ملخص Gemini المهيكل (gemini-4-hydrogen)',
    sourceBase: 'القاعدة الكمية للمرصد (195 دولة)',
    chartTitle: 'مقارنة بصرية: الخسائر التراكمية 2028–2032 (مليار $) مقابل المؤشرات الاجتماعية والمناخية',
    tableTitle: 'جدول المسارات المقارن 2028–2032',
    cumLossKpi: 'الخسائر التراكمية المنمذجة (2028–2032)',
    socialKpi: 'متوسط مؤشر الضغط الاجتماعي والنزوح',
    climateKpi: 'متوسط مؤشر الشدة المناخية',
    entitiesCompared: 'كياناً تمت مقارنته',
    retryBtn: 'إعادة المحاولة',
  },
  zh: {
    eyebrow: '12 · AI 远景预测 · 2028–2032 多维比较分析',
    title: '2028–2032 年全球经济、社会与气候轨迹（Gemini 智能分析）',
    lead: '对比联合国6大区域、6大洲及12个气候带在2028–2032年的演变轨迹。调用 Gemini 生成关于 GDP 冲击、粮食通胀与人口迁移的结构化综合评估。',
    scopeLabel: '地理范围划分',
    scopeZones: '6大联合国区域',
    scopeContinents: '6大洲',
    scopeClimate: '12个气候带',
    scenarioLabel: '2028–2032 情景设定',
    scenBaseline: '基准过渡情景（拉尼娜 → 2031滞后峰）',
    scenSevere: '极端未缓解情景（Oxford ~$4T）',
    scenAdapt: '加速适应情景（国家适应计划 · 农业保险）',
    focusLabel: '分析重点',
    focusAll: '经济 + 社会 + 气候',
    focusEco: '宏观经济与贸易',
    focusSoc: '粮食安全与迁移',
    focusClim: '气候灾害与模态',
    promptPlaceholder: '可选 Gemini 聚焦问题（如对比2031年非洲与南亚的粮食通胀风险）...',
    analyzeBtn: '使用 Gemini 分析 2028–2032',
    analyzingBtn: 'Gemini 正在分析...',
    resetAiBtn: '恢复观测站基准',
    exportCsv: '导出 CSV',
    sourceAi: 'Gemini 结构化综合分析 (gemini-4-hydrogen)',
    sourceBase: '观测站定量基准 (195个联合国国家)',
    chartTitle: '可视化对比：2028–2032 累计损失（十亿美元）vs 社会与气候指数（0–100）',
    tableTitle: '2028–2032 多维比较轨迹矩阵',
    cumLossKpi: '模型累计经济拖累 (2028–2032)',
    socialKpi: '平均社会压力与迁移指数',
    climateKpi: '平均气候严重程度指数',
    entitiesCompared: '个区域已对比',
    retryBtn: '重试',
  },
  pt: {
    eyebrow: '12 · Prospetiva IA · Análise Comparativa 2028–2032',
    title: 'Trajetórias Económicas, Sociais e Climáticas 2028–2032 (Análise Gemini)',
    lead: 'Compare zonas ONU, continentes e 12 zonas climáticas em 2028–2032. Execute o Gemini para sintetizar choques no PIB, inflação alimentar, deslocações e regimes ENSO.',
    scopeLabel: 'Âmbito geográfico',
    scopeZones: '6 Zonas ONU',
    scopeContinents: '6 Continentes',
    scopeClimate: '12 Zonas Climáticas',
    scenarioLabel: 'Cenário 2028–2032',
    scenBaseline: 'Base do Observatório (La Niña → Pico 2031)',
    scenSevere: 'Choque Severo sem Mitigação (Oxford ~$4T)',
    scenAdapt: 'Adaptação Acelerada (PNA · SCV · Seguro)',
    focusLabel: 'Foco Analítico',
    focusAll: 'Economia + Social + Clima',
    focusEco: 'Económico (PIB e Comércio)',
    focusSoc: 'Social (Fome e Migração)',
    focusClim: 'Climático (Riscos e Regimes)',
    promptPlaceholder: 'Pergunta opcional para o Gemini (ex. comparar África vs Ásia do Sul em 2031)...',
    analyzeBtn: 'Analisar 2028–2032 com Gemini',
    analyzingBtn: 'A analisar com Gemini...',
    resetAiBtn: 'Repor linha de base',
    exportCsv: 'Exportar CSV',
    sourceAi: 'Síntese Estruturada Gemini (gemini-4-hydrogen)',
    sourceBase: 'Base Quantitativa do Observatório (195 Países ONU)',
    chartTitle: 'Comparação Visual: Perdas Acumuladas 2028–2032 ($B USD) vs Índices Social e Clima',
    tableTitle: 'Matriz Comparativa de Trajetórias 2028–2032',
    cumLossKpi: 'Perda Acumulada Modelada (2028–2032)',
    socialKpi: 'Índice Médio Social e Deslocação',
    climateKpi: 'Índice Médio de Severidade Climática',
    entitiesCompared: 'entidades comparadas',
    retryBtn: 'Tentar novamente',
  },
  hi: {
    eyebrow: '12 · AI पूर्वदृष्टि · बहु-आयामी तुलनात्मक विश्लेषण 2028–2032',
    title: 'आर्थिक, सामाजिक और जलवायु प्रक्षेपवक्र 2028–2032 (Gemini विश्लेषण)',
    lead: '2028–2032 में UN क्षेत्रों, महाद्वीपों और 12 जलवायु क्षेत्रों की तुलना करें। GDP प्रभाव, खाद्य मुद्रास्फीति और विस्थापन के लिए Gemini विश्लेषण चलाएँ।',
    scopeLabel: 'भौगोलिक दायरा',
    scopeZones: '6 UN क्षेत्र',
    scopeContinents: '6 महाद्वीप',
    scopeClimate: '12 जलवायु क्षेत्र',
    scenarioLabel: '2028–2032 परिदृश्य',
    scenBaseline: 'आधारभूत संक्रमण (ला नीना → 2031 शिखर)',
    scenSevere: 'गंभीर झटका (Oxford ~$4T)',
    scenAdapt: 'त्वरित अनुकूलन (NAP · SCV · बीमा)',
    focusLabel: 'प्रमुख केंद्र',
    focusAll: 'अर्थव्यवस्था + समाज + जलवायु',
    focusEco: 'आर्थिक (GDP व व्यापार)',
    focusSoc: 'सामाजिक (खाद्य व विस्थापन)',
    focusClim: 'जलवायु (खतरे व तंत्र)',
    promptPlaceholder: 'Gemini के लिए वैकल्पिक प्रश्न (जैसे 2031 में अफ्रीका बनाम दक्षिण एशिया)...',
    analyzeBtn: 'Gemini से 2028–2032 विश्लेषण करें',
    analyzingBtn: 'Gemini विश्लेषण चल रहा है...',
    resetAiBtn: 'आधारभूत डेटा पर लौटें',
    exportCsv: 'CSV निर्यात करें',
    sourceAi: 'संरचित Gemini संश्लेषण (gemini-4-hydrogen)',
    sourceBase: 'वेधशाला आधारभूत डेटा (195 UN देश)',
    chartTitle: 'दृश्य तुलना: संचयी हानि 2028–2032 ($B USD) बनाम सामाजिक एवं जलवायु सूचकांक',
    tableTitle: 'तुलनात्मक प्रक्षेपवक्र मैट्रिक्स 2028–2032',
    cumLossKpi: 'मॉडल की गई संचयी आर्थिक हानि (2028–2032)',
    socialKpi: 'औसत सामाजिक दबाव और विस्थापन सूचकांक',
    climateKpi: 'औसत जलवायु गंभीरता सूचकांक',
    entitiesCompared: 'इकाइयों की तुलना',
    retryBtn: 'पुनः प्रयास करें',
  },
  ru: {
    eyebrow: '12 · Прогноз ИИ · Многомерный сравнительный анализ 2028–2032',
    title: 'Экономические, социальные и климатические траектории 2028–2032 (Gemini)',
    lead: 'Сравните 6 зон ООН, континенты и 12 климатических поясов на горизонте 2028–2032 гг. Запустите Gemini для синтеза шоков ВВП, продовольственной инфляции и миграции.',
    scopeLabel: 'Географический охват',
    scopeZones: '6 зон ООН',
    scopeContinents: '6 континентов',
    scopeClimate: '12 климатических зон',
    scenarioLabel: 'Сценарий 2028–2032',
    scenBaseline: 'Базовый переход (Ла-Нинья → лаг 2031)',
    scenSevere: 'Тяжёлый шок (Oxford ~$4T)',
    scenAdapt: 'Ускоренная адаптация (ПНА · SCV · Страхование)',
    focusLabel: 'Приоритет анализа',
    focusAll: 'Экономика + Социум + Климат',
    focusEco: 'Экономика (ВВП и торговля)',
    focusSoc: 'Социум (Голод и миграция)',
    focusClim: 'Климат (Опасности и режимы)',
    promptPlaceholder: 'Дополнительный вопрос для Gemini (напр., сравнить Африку и Южную Азию в 2031 г.)...',
    analyzeBtn: 'Анализировать 2028–2032 через Gemini',
    analyzingBtn: 'Выполняется анализ Gemini...',
    resetAiBtn: 'Вернуться к базовой модели',
    exportCsv: 'Экспорт CSV',
    sourceAi: 'Структурированный синтез Gemini (gemini-4-hydrogen)',
    sourceBase: 'Количественная база Обсерватории (195 стран ООН)',
    chartTitle: 'Сравнение: накопленные потери 2028–2032 (млрд $) и индексы социума/климата',
    tableTitle: 'Сравнительная матрица траекторий 2028–2032',
    cumLossKpi: 'Накопленные модельные потери (2028–2032)',
    socialKpi: 'Средний индекс социального давления и миграции',
    climateKpi: 'Средний индекс климатической суровости',
    entitiesCompared: 'объектов в сравнении',
    retryBtn: 'Повторить',
  },
};

export function LongTermProjections() {
  const { lang, worldLang, actions } = useLanguage();
  const { user, saveAnalysisSnapshot } = useAuth();
  const { syncState, hasLiveScrape, getZoneFactor } = useGlobalSync();
  const isFr = lang === 'fr';
  const isSw = lang === 'sw';
  const copy = LTP_COPY[worldLang];

  const [scopeMode, setScopeMode] = useState<ScopeMode>('zones');
  const [scenario, setScenario] = useState<ScenarioMode>('baseline');
  const [focusDomain, setFocusDomain] = useState<FocusDomain>('all');
  const [customPrompt, setCustomPrompt] = useState('');
  const [sortField, setSortField] = useState<SortField>('cumulativeLoss2028_2032BUsd');
  const [sortAsc, setSortAsc] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geminiResult, setGeminiResult] = useState<GeminiProjectionPayload | null>(null);
  const [savingSnap, setSavingSnap] = useState(false);
  const [snapSavedMsg, setSnapSavedMsg] = useState(false);

  const baselineRows = useMemo(() => {
    const base = buildBaselineRows(scopeMode, scenario, isFr);
    if (!hasLiveScrape) return base;
    if (scopeMode === 'zones') {
      return base.map((r) => {
        const zf = getZoneFactor(r.id as Parameters<typeof getZoneFactor>[0]);
        const mult = zf?.gdpLossFactor ?? 1;
        return {
          ...r,
          economic2028Pct: Number((r.economic2028Pct * mult).toFixed(2)),
          economic2030Pct: Number((r.economic2030Pct * mult).toFixed(2)),
          economic2032Pct: Number((r.economic2032Pct * mult).toFixed(2)),
          cumulativeLoss2028_2032BUsd: Number((r.cumulativeLoss2028_2032BUsd * mult).toFixed(1)),
          foodInflationPeakPct: Math.max(0.2, Number((r.foodInflationPeakPct + (zf?.foodInflationAddPct ?? 0)).toFixed(1))),
          socialDisplacementScore: Math.min(98, Math.round(r.socialDisplacementScore * (zf?.displacementFactor ?? 1))),
          climateSeverityScore: Math.min(98, Math.max(10, Math.round(r.climateSeverityScore + Math.max(zf?.droughtDelta ?? 0, zf?.floodDelta ?? 0)))),
        };
      });
    }
    const avgGlobalMult = syncState.madagascarFactors.overallLossFactor;
    return base.map((r) => ({
      ...r,
      cumulativeLoss2028_2032BUsd: Number((r.cumulativeLoss2028_2032BUsd * avgGlobalMult).toFixed(1)),
    }));
  }, [scopeMode, scenario, isFr, hasLiveScrape, getZoneFactor, syncState.madagascarFactors.overallLossFactor]);

  // Use Gemini rows only when they match the current scopeMode & scenario; otherwise show synchronized deterministic baseline
  const activeRows = useMemo(() => {
    const useAi =
      geminiResult &&
      geminiResult.scopeMode === scopeMode &&
      geminiResult.scenario === scenario &&
      geminiResult.comparativeRows.length > 0;
    const base = useAi ? geminiResult.comparativeRows : baselineRows;

    return [...base].sort((a, b) => {
      if (sortField === 'regionName') {
        return sortAsc
          ? a.regionName.localeCompare(b.regionName)
          : b.regionName.localeCompare(a.regionName);
      }
      const va = Number(a[sortField] ?? 0);
      const vb = Number(b[sortField] ?? 0);
      return sortAsc ? va - vb : vb - va;
    });
  }, [geminiResult, scopeMode, scenario, baselineRows, sortField, sortAsc]);

  const isGeminiActive = Boolean(
    geminiResult &&
      geminiResult.scopeMode === scopeMode &&
      geminiResult.scenario === scenario &&
      geminiResult.comparativeRows.length > 0,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === 'regionName');
    }
  };

  const runGeminiAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    emitIndriActivity({
      state: 'processing',
      label: isFr
        ? 'Analyse Gemini 2028–2032 en cours'
        : isSw
          ? 'Uchambuzi wa Gemini 2028–2032 unaendelea'
          : 'Gemini 2028–2032 trajectory analysis running',
      detail: `${scopeMode} · ${scenario}`,
    });

    try {
      const res = await fetch('/api/gemini/long-term-projections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scopeMode,
          scenario,
          focusDomain,
          customPrompt: customPrompt.trim(),
          lang: worldLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate Gemini 2028–2032 analysis.');
      }
      setGeminiResult(data as GeminiProjectionPayload);
      emitIndriActivity({
        state: 'speaking',
        label: isFr
          ? 'Synthèse Gemini 2028–2032 prête'
          : 'Gemini 2028–2032 synthesis ready',
        detail: String(data.executiveSummary ?? '').slice(0, 90),
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error calling Gemini.');
      emitIndriActivity({ state: 'idle' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Region / Continent',
      '2028 GDP %',
      '2030 GDP %',
      '2032 GDP %',
      'Cumulative Loss 2028-2032 (B USD)',
      'Food Inflation Peak (+%)',
      'Social Displacement Score (0-100)',
      'Climate Severity Score (0-100)',
      'Climate Regime',
      'Economic Outlook',
      'Social Outlook',
      'Priority Action',
    ];
    const rows = activeRows.map((r) => [
      r.regionName,
      r.economic2028Pct,
      r.economic2030Pct,
      r.economic2032Pct,
      r.cumulativeLoss2028_2032BUsd,
      r.foodInflationPeakPct,
      r.socialDisplacementScore,
      r.climateSeverityScore,
      r.climateRegime,
      r.economicOutlook,
      r.socialOutlook,
      r.priorityAction,
    ]);
    downloadCsv(`trajectoires_2028_2032_${scopeMode}_${scenario}.csv`, headers, rows);
  };

  const totalLossSum = useMemo(
    () => activeRows.reduce((s, r) => s + Number(r.cumulativeLoss2028_2032BUsd || 0), 0).toFixed(1),
    [activeRows],
  );

  const avgSocialScore = useMemo(() => {
    if (activeRows.length === 0) return 0;
    return Math.round(
      activeRows.reduce((s, r) => s + Number(r.socialDisplacementScore || 0), 0) / activeRows.length,
    );
  }, [activeRows]);

  const avgClimateScore = useMemo(() => {
    if (activeRows.length === 0) return 0;
    return Math.round(
      activeRows.reduce((s, r) => s + Number(r.climateSeverityScore || 0), 0) / activeRows.length,
    );
  }, [activeRows]);

  const chartData = useMemo(
    () =>
      activeRows.map((r) => ({
        name:
          r.regionName.length > 22
            ? `${r.regionName.slice(0, 20)}…`
            : r.regionName,
        cumulativeLoss: r.cumulativeLoss2028_2032BUsd,
        socialScore: r.socialDisplacementScore,
        climateScore: r.climateSeverityScore,
      })),
    [activeRows],
  );

  const handleSaveSnapshot = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-workspace-modal'));
      return;
    }
    setSavingSnap(true);
    try {
      const summaryBase =
        isGeminiActive && geminiResult ? geminiResult.executiveSummary : copy.sourceBase;
      await saveAnalysisSnapshot({
        scope: `2028-2032:${scopeMode}`,
        regionName: `${focusDomain} (${activeRows.length} zones)`,
        year: 2032,
        scenario,
        summary: `${summaryBase} | Pertes cumulées: $${totalLossSum} Md · Social ${avgSocialScore}/100 · Climat ${avgClimateScore}/100`,
      });
      setSnapSavedMsg(true);
      window.setTimeout(() => setSnapSavedMsg(false), 3200);
    } finally {
      setSavingSnap(false);
    }
  };

  return (
    <section
      id="trajectoires-2028-2032"
      className="border-t border-zinc-200 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#1E3A8A]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">{copy.lead}</p>
          </div>
          <div className="border border-zinc-200 bg-[#F9F8F4] px-4 py-3 text-xs text-zinc-700 shrink-0">
            <div className="font-semibold text-zinc-900">M&amp;G Consulting · Prince MANANTENASOA</div>
            <div className="mt-0.5 font-mono text-[11px] text-[#1E3A8A]">
              {isGeminiActive ? copy.sourceAi : copy.sourceBase}
            </div>
          </div>
        </div>

        {/* Interactive Controls Panel */}
        <div className="mt-8 border border-zinc-200 bg-[#F9F8F4] p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Geographic Scope */}
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-zinc-600">
                {copy.scopeLabel}
              </label>
              <div className="mt-1.5 grid grid-cols-3 border border-zinc-300 bg-white p-0.5">
                {(
                  [
                    { id: 'zones', label: copy.scopeZones },
                    { id: 'continents', label: copy.scopeContinents },
                    { id: 'climate-zones', label: copy.scopeClimate },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScopeMode(opt.id)}
                    className={`px-2 py-2 text-[11px] font-semibold transition-colors ${
                      scopeMode === opt.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario */}
            <div>
              <label
                htmlFor="ltp-scenario"
                className="block font-mono text-[11px] font-semibold uppercase text-zinc-600"
              >
                {copy.scenarioLabel}
              </label>
              <select
                id="ltp-scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioMode)}
                className="mt-1.5 w-full border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="baseline">{copy.scenBaseline}</option>
                <option value="severe">{copy.scenSevere}</option>
                <option value="adaptation">{copy.scenAdapt}</option>
              </select>
            </div>

            {/* Focus Domain */}
            <div>
              <label
                htmlFor="ltp-focus"
                className="block font-mono text-[11px] font-semibold uppercase text-zinc-600"
              >
                {copy.focusLabel}
              </label>
              <select
                id="ltp-focus"
                value={focusDomain}
                onChange={(e) => setFocusDomain(e.target.value as FocusDomain)}
                className="mt-1.5 w-full border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="all">{copy.focusAll}</option>
                <option value="economic">{copy.focusEco}</option>
                <option value="social">{copy.focusSoc}</option>
                <option value="climate">{copy.focusClim}</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={copy.promptPlaceholder}
              className="flex-1 border border-zinc-300 bg-white px-3 py-2.5 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
            />
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={runGeminiAnalysis}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{loading ? copy.analyzingBtn : copy.analyzeBtn}</span>
              </button>

              {isGeminiActive && (
                <button
                  type="button"
                  onClick={() => setGeminiResult(null)}
                  className="inline-flex items-center gap-1.5 border border-zinc-300 bg-white px-3 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.resetAiBtn}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 border border-[#1E3A8A] bg-white px-3 py-2.5 text-xs font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{copy.exportCsv}</span>
              </button>

              <button
                type="button"
                onClick={() => void handleSaveSnapshot()}
                disabled={savingSnap}
                className="inline-flex items-center gap-1.5 border border-emerald-700 bg-white px-3 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-60"
              >
                {savingSnap ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : snapSavedMsg ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Database className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{snapSavedMsg ? actions.savedOk : actions.saveSnapshot}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mt-4 flex flex-col gap-2 border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={runGeminiAnalysis}
                className="border border-red-700 bg-white px-3 py-1 font-semibold text-red-800 hover:bg-red-100 shrink-0"
              >
                {copy.retryBtn}
              </button>
            </div>
          )}
        </div>

        {/* Gemini Synthesis Banner (when Gemini analysis is active) */}
        {isGeminiActive && geminiResult && (
          <div className="mt-6 border border-[#1E3A8A] bg-[#F9F8F4] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-[#1E3A8A]">
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span>{geminiResult.model} · 2028–2032</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                {geminiResult.methodologyNote}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-900">
              {geminiResult.executiveSummary}
            </p>
            {geminiResult.strategicTakeaways.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {geminiResult.strategicTakeaways.map((point, idx) => (
                  <div key={idx} className="border border-zinc-200 bg-white p-3.5 text-xs text-zinc-700">
                    <span className="font-mono font-semibold text-[#1E3A8A]">
                      0{idx + 1}.
                    </span>{' '}
                    {point}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* KPI Summary Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="font-mono text-[11px] uppercase text-zinc-500">
              {copy.cumLossKpi}
            </div>
            <div className="mt-1 font-serif text-2xl font-semibold text-[#B91C1C] tabular-nums">
              {Number(totalLossSum).toLocaleString()} Md USD
            </div>
          </div>
          <div className="border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="font-mono text-[11px] uppercase text-zinc-500">
              {copy.socialKpi}
            </div>
            <div className="mt-1 font-serif text-2xl font-semibold text-amber-800 tabular-nums">
              {avgSocialScore} / 100
            </div>
          </div>
          <div className="border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="font-mono text-[11px] uppercase text-zinc-500">
              {copy.climateKpi}
            </div>
            <div className="mt-1 font-serif text-2xl font-semibold text-[#1E3A8A] tabular-nums">
              {avgClimateScore} / 100
            </div>
          </div>
        </div>

        {/* Multi-Dimension Recharts Comparative Visualization */}
        <div className="mt-6 border border-zinc-200 bg-[#F9F8F4] p-6">
          <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-zinc-900">
            <TrendingDown className="h-5 w-5 text-[#1E3A8A]" aria-hidden="true" />
            <span>{copy.chartTitle}</span>
          </h3>
          <div className="mt-4 h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#3F3F46' }}
                  interval={0}
                  angle={scopeMode === 'climate-zones' ? -18 : 0}
                  textAnchor={scopeMode === 'climate-zones' ? 'end' : 'middle'}
                  height={scopeMode === 'climate-zones' ? 60 : 35}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#B91C1C' }}
                  unit=" Md$"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#1E3A8A' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D4D4D8',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="cumulativeLoss"
                  name={isFr ? 'Pertes cumulées 2028–2032 (Md USD)' : '2028–2032 Cum. Loss ($B)'}
                  fill="#1E3A8A"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="socialScore"
                  name={isFr ? 'Pression sociale / déplacements (/100)' : 'Social Displacement (/100)'}
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="climateScore"
                  name={isFr ? 'Sévérité climatique (/100)' : 'Climate Severity (/100)'}
                  stroke="#B91C1C"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparative Table */}
        <div className="mt-6 border border-zinc-200 bg-white">
          <div className="flex flex-col gap-2 border-b border-zinc-200 bg-[#F9F8F4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.tableTitle}</h3>
            <span className="font-mono text-[11px] text-zinc-500">
              {activeRows.length} {copy.entitiesCompared} · 2028 → 2032
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-[#F9F8F4] font-mono text-[11px] uppercase text-zinc-600">
                  <th className="px-3.5 py-3">
                    <button
                      type="button"
                      onClick={() => handleSort('regionName')}
                      className="inline-flex items-center gap-1 font-semibold hover:text-[#1E3A8A]"
                    >
                      <span>{isFr ? 'Zone / Continent' : 'Zone / Continent'}</span>
                      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-3.5 py-3 text-right">2028 / 2030 / 2032 PIB</th>
                  <th className="px-3.5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('cumulativeLoss2028_2032BUsd')}
                      className="inline-flex items-center justify-end gap-1 font-semibold hover:text-[#1E3A8A]"
                    >
                      <span>{isFr ? 'Pertes 28–32' : 'Loss 28–32'}</span>
                      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-3.5 py-3">{isFr ? 'Trajectoire Économique' : 'Economic Trajectory'}</th>
                  <th className="px-3.5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('socialDisplacementScore')}
                      className="inline-flex items-center justify-end gap-1 font-semibold hover:text-[#1E3A8A]"
                    >
                      <span>{isFr ? 'Social / Infl.' : 'Social / Infl.'}</span>
                      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-3.5 py-3">{isFr ? 'Trajectoire Sociale' : 'Social Trajectory'}</th>
                  <th className="px-3.5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('climateSeverityScore')}
                      className="inline-flex items-center justify-end gap-1 font-semibold hover:text-[#1E3A8A]"
                    >
                      <span>{isFr ? 'Climat' : 'Climate'}</span>
                      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-3.5 py-3">{isFr ? 'Régime Climatique & Action' : 'Climate Regime & Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {activeRows.map((row) => (
                  <tr key={row.id} className="align-top hover:bg-[#F9F8F4]/70">
                    <td className="px-3.5 py-3 font-semibold text-zinc-900">
                      {row.regionName}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono tabular-nums text-[#B91C1C] whitespace-nowrap">
                      {row.economic2028Pct.toFixed(1)}% / {row.economic2030Pct.toFixed(1)}% /{' '}
                      {row.economic2032Pct.toFixed(1)}%
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono font-semibold tabular-nums text-zinc-900 whitespace-nowrap">
                      {row.cumulativeLoss2028_2032BUsd.toLocaleString()} Md$
                    </td>
                    <td className="px-3.5 py-3 text-zinc-600 max-w-[230px]">
                      {row.economicOutlook}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                      <div className="font-semibold text-amber-800">
                        {row.socialDisplacementScore}/100
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        +{row.foodInflationPeakPct.toFixed(1)}% alim.
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-zinc-600 max-w-[230px]">
                      {row.socialOutlook}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono font-semibold tabular-nums text-[#1E3A8A] whitespace-nowrap">
                      {row.climateSeverityScore}/100
                    </td>
                    <td className="px-3.5 py-3 text-zinc-700 max-w-[260px]">
                      <div className="font-medium text-zinc-900">{row.climateRegime}</div>
                      <p className="mt-0.5 text-zinc-600">{row.climateOutlook}</p>
                      <p className="mt-1 font-mono text-[11px] text-[#1E3A8A]">
                        {row.priorityAction}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
