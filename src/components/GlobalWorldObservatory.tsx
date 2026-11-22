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
  CalendarClock,
  Download,
  FileDown,
  Globe,
  Languages,
  MapPin,
  Search,
  TrendingDown,
} from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { exportClimateSummaryPdf } from '../utils/scientificReportGenerator';
import {
  CONTINENT_COMPARISON_6,
  DUPLICATED_195_COUNTRIES,
  GLOBAL_MACRO_BENCHMARKS,
  UN_COUNT_VARIANTS,
  UN_ZONE_META,
  UN_ZONE_SUMMARIES,
  WORLD_CLIMATE_ZONES,
  WORLD_LANGUAGES_STATS,
  getClimateZoneSummaries,
  getGlobalTimelineSeries,
  type ClimateZoneId,
  type DuplicatedWorldCountry,
  type ForecastYear,
  type SpokenLangTag,
  type UnZoneId,
} from '../data/worldEnso195Data';

type ObservatoryTab = 'world-models' | 'duplication' | 'forecast-2028-2032';
type ContinentModel = '6' | '7' | '5';

const FORECAST_YEARS: ForecastYear[] = [2027, 2028, 2029, 2030, 2031, 2032];

const UN_ZONE_COLORS: Record<UnZoneId, string> = {
  afrique: '#B91C1C',
  asie: '#1E3A8A',
  'amerique-latine-caraibes': '#D97706',
  'amerique-du-nord': '#475569',
  europe: '#0F766E',
  oceanie: '#0284C7',
};

const YEAR_REGIME_BRIEF: Record<ForecastYear, { fr: string; en: string }> = {
  2027: {
    fr: 'Pic Super El Niño + IOD+ : choc hydrique aigu dans les tropiques, sécheresse en Afrique australe/Asie du Sud-Est, crues Corne de l’Afrique & Pérou.',
    en: 'Super El Niño + IOD+ peak: acute tropical drought in Southern Africa & SE Asia, torrential floods in Horn of Africa & coastal Peru.',
  },
  2028: {
    fr: 'Transition rapide La Niña : bascule vers des cyclones/ouragans intenses (Atlantique, Caraïbes, océan Indien Est), risque sécheresse Corne & Cône Sud.',
    en: 'Rapid La Niña transition: swing toward intense Atlantic/Caribbean hurricanes, Indian Ocean cyclones, and Horn/Southern Cone dryness.',
  },
  2029: {
    fr: 'Phase ENSO Neutre : accalmie relative permettant la reconstitution partielle des stocks céréaliers, barrages et cheptels sous tension budgétaire.',
    en: 'ENSO Neutral phase: partial respite allowing grain buffer, reservoir, and livestock rebuilding under elevated sovereign debt pressure.',
  },
  2030: {
    fr: 'Plancher thermique +1,5 °C : les vagues de chaleur estivales amplifient l’évapotranspiration même hors Super El Niño, préparant le cycle suivant.',
    en: '+1.5°C baseline warmth: summer heat domes amplify crop evapotranspiration even without a peak El Niño, priming the next cycle.',
  },
  2031: {
    fr: 'Pic cumulatif macroéconomique (Oxford Economics / Dartmouth) : jusqu’à ~4 000 Md USD d’érosion PIB cumulée (>10 % PIB/hab. dans les tropiques vs ~3 % USA).',
    en: 'Cumulative GDP lag peak (Oxford Economics / Dartmouth): ~USD 4T cumulative global GDP drag (>10% GDP/cap in tropics vs ~3% in US).',
  },
  2032: {
    fr: 'Bifurcation d’adaptation : les économies dotées de PNA, variétés tolérantes (SCV/Zaï/SRI) et assurances paramétriques réduisent de 35–45 % leurs pertes résiduelles.',
    en: 'Adaptation bifurcation: economies deploying NAPs, tolerant seeds (SCV/Zaï/SRI), and parametric insurance cut residual losses by 35–45%.',
  },
};

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (val: string | number) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const csvContent = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function GlobalWorldObservatory() {
  const { lang, worldLang, setLang, t, actions } = useLanguage();
  const { syncState, hasLiveScrape, getZoneFactor, runGlobalScrapeNow, syncing } = useGlobalSync();
  const isFr = lang === 'fr';

  const [activeTab, setActiveTab] = useState<ObservatoryTab>('world-models');
  const [continentModel, setContinentModel] = useState<ContinentModel>('6');

  // Directory & Duplication filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnZone, setSelectedUnZone] = useState<UnZoneId | 'all'>('all');
  const [selectedLangFilter, setSelectedLangFilter] = useState<SpokenLangTag | 'all'>('all');
  const [selectedHazard, setSelectedHazard] = useState<'all' | DuplicatedWorldCountry['hazard']>('all');
  const [selectedClimateZone, setSelectedClimateZone] = useState<ClimateZoneId | 'all'>('all');
  const [selectedCountryIso, setSelectedCountryIso] = useState<string>('MG');

  // 2028-2032 Forecast tab state
  const [selectedYear, setSelectedYear] = useState<ForecastYear>(2031);
  const [matrixZoneFilter, setMatrixZoneFilter] = useState<UnZoneId | 'all'>('all');

  const liveCountries = useMemo<DuplicatedWorldCountry[]>(() => {
    if (!hasLiveScrape) return DUPLICATED_195_COUNTRIES;
    return DUPLICATED_195_COUNTRIES.map((c) => {
      const zf = getZoneFactor(c.unZone);
      const isMada = c.iso2 === 'MG';
      const lossMult = isMada ? syncState.madagascarFactors.overallLossFactor : zf.gdpLossFactor;
      const inflAdd = isMada ? syncState.madagascarFactors.foodInflationDeltaPct : zf.foodInflationAddPct;
      const dDelta = isMada ? syncState.madagascarFactors.droughtDelta : zf.droughtDelta;
      const fDelta = isMada ? syncState.madagascarFactors.floodDelta : zf.floodDelta;
      const dispMult = isMada ? syncState.madagascarFactors.displacementFactor : zf.displacementFactor;

      const updatedProj = { ...c.projections };
      FORECAST_YEARS.forEach((yr) => {
        const base = c.projections[yr];
        updatedProj[yr] = {
          ...base,
          gdpDeltaPct: Number((base.gdpDeltaPct * lossMult).toFixed(2)),
          lossBUsd: Number((base.lossBUsd * lossMult).toFixed(3)),
          inflationAddPct: Math.max(0.2, Number((base.inflationAddPct + inflAdd).toFixed(1))),
          droughtIdx: Math.min(99, Math.max(5, Math.round(base.droughtIdx + dDelta))),
          floodIdx: Math.min(99, Math.max(5, Math.round(base.floodIdx + fDelta))),
          displacementIdx: Math.min(99, Math.max(5, Math.round(base.displacementIdx * dispMult))),
        };
      });

      const cum27_31 =
        updatedProj[2027].lossBUsd +
        updatedProj[2028].lossBUsd +
        updatedProj[2029].lossBUsd +
        updatedProj[2030].lossBUsd +
        updatedProj[2031].lossBUsd;

      return {
        ...c,
        cumulativeLoss2027_2031BUsd: Number(cum27_31.toFixed(1)),
        projections: updatedProj,
      };
    });
  }, [hasLiveScrape, getZoneFactor, syncState.madagascarFactors]);

  const liveZoneSummaries = useMemo(() => {
    if (!hasLiveScrape) return UN_ZONE_SUMMARIES;
    return UN_ZONE_SUMMARIES.map((z) => {
      const zf = getZoneFactor(z.id);
      const nextYearly = { ...z.yearlyLossBUsd };
      const nextInfl = { ...z.avgInflationAdd };
      FORECAST_YEARS.forEach((yr) => {
        nextYearly[yr] = Number((z.yearlyLossBUsd[yr] * zf.gdpLossFactor).toFixed(1));
        nextInfl[yr] = Math.max(0.2, Number((z.avgInflationAdd[yr] + zf.foodInflationAddPct).toFixed(1)));
      });
      return {
        ...z,
        yearlyLossBUsd: nextYearly,
        avgInflationAdd: nextInfl,
        cumulative2027_2031BUsd: Number((z.cumulative2027_2031BUsd * zf.gdpLossFactor).toFixed(1)),
      };
    });
  }, [hasLiveScrape, getZoneFactor]);

  const climateZoneSummaries = useMemo(() => getClimateZoneSummaries(), []);
  const timelineSeries = useMemo(() => {
    const baseSeries = getGlobalTimelineSeries();
    if (!hasLiveScrape) return baseSeries;
    return baseSeries.map((pt) => {
      const next: Record<string, string | number> = { year: pt.year };
      let total = 0;
      (Object.keys(UN_ZONE_META) as UnZoneId[]).forEach((zId) => {
        const mult = getZoneFactor(zId).gdpLossFactor;
        const val = Number((Number(pt[zId] ?? 0) * mult).toFixed(1));
        next[zId] = val;
        total += val;
      });
      next.globalTotal = Number(total.toFixed(1));
      return next;
    });
  }, [hasLiveScrape, getZoneFactor]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return liveCountries.filter((country) => {
      if (selectedUnZone !== 'all' && country.unZone !== selectedUnZone) return false;
      if (selectedLangFilter !== 'all' && !country.langs.includes(selectedLangFilter)) return false;
      if (selectedHazard !== 'all' && country.hazard !== selectedHazard) return false;
      if (selectedClimateZone !== 'all' && country.climateZone !== selectedClimateZone) return false;
      if (q) {
        const hay = `${country.iso2} ${country.nameFr} ${country.nameEn} ${country.langDisplay}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [liveCountries, searchQuery, selectedUnZone, selectedLangFilter, selectedHazard, selectedClimateZone]);

  const selectedCountry = useMemo(() => {
    return (
      liveCountries.find((c) => c.iso2 === selectedCountryIso) ??
      filteredCountries[0] ??
      liveCountries[0]
    );
  }, [liveCountries, selectedCountryIso, filteredCountries]);

  const matrixCountries = useMemo(() => {
    if (matrixZoneFilter === 'all') return liveCountries;
    return liveCountries.filter((c) => c.unZone === matrixZoneFilter);
  }, [liveCountries, matrixZoneFilter]);

  const totalGlobalCumulative2027_2031 = useMemo(() => {
    return liveZoneSummaries.reduce((sum, z) => sum + z.cumulative2027_2031BUsd, 0).toFixed(0);
  }, [liveZoneSummaries]);

  const handleExport195Csv = () => {
    const headers = [
      'ISO2',
      'Pays (FR)',
      'Country (EN)',
      'Statut ONU',
      'Zone ONU',
      'Continent (7)',
      'Zone Climatique',
      'Langues',
      'Pop (M)',
      'PIB (Md USD)',
      'Aléa dominant',
      'Perte cumulée 2027-2031 (Md USD)',
      '2027 PIB %',
      '2028 PIB %',
      '2029 PIB %',
      '2030 PIB %',
      '2031 PIB %',
      '2032 PIB %',
    ];
    const rows = filteredCountries.map((c) => [
      c.iso2,
      c.nameFr,
      c.nameEn,
      c.unStatus === 'member' ? 'Membre ONU (193)' : 'Observateur ONU (2)',
      UN_ZONE_META[c.unZone].nameFr,
      c.continent7,
      c.climateZoneMeta.nameFr,
      c.langDisplay,
      c.popM,
      c.gdpB,
      c.hazard,
      c.cumulativeLoss2027_2031BUsd,
      c.projections[2027].gdpDeltaPct,
      c.projections[2028].gdpDeltaPct,
      c.projections[2029].gdpDeltaPct,
      c.projections[2030].gdpDeltaPct,
      c.projections[2031].gdpDeltaPct,
      c.projections[2032].gdpDeltaPct,
    ]);
    downloadCsv('observatoire_mondial_195_pays_enso_2027_2032.csv', headers, rows);
  };

  const handleExportMatrixCsv = () => {
    const headers = [
      'ISO2',
      'Pays',
      'Zone ONU',
      `Année ${selectedYear} Régime`,
      `${selectedYear} PIB Δ (%)`,
      `${selectedYear} Perte (Md USD)`,
      `${selectedYear} Inflation alim. (+%)`,
      `${selectedYear} Indice Sécheresse`,
      `${selectedYear} Indice Crues`,
      `${selectedYear} Déplacements`,
      `${selectedYear} Risque Famine`,
    ];
    const rows = matrixCountries.map((c) => {
      const p = c.projections[selectedYear];
      return [
        c.iso2,
        isFr ? c.nameFr : c.nameEn,
        isFr ? UN_ZONE_META[c.unZone].nameFr : UN_ZONE_META[c.unZone].nameEn,
        isFr ? p.regimeFr : p.regimeEn,
        p.gdpDeltaPct,
        p.lossBUsd,
        p.inflationAddPct,
        p.droughtIdx,
        p.floodIdx,
        p.displacementIdx,
        p.famineRisk,
      ];
    });
    downloadCsv(`anticipations_${selectedYear}_195_pays.csv`, headers, rows);
  };

  const handleSelectWorldLanguage = (tag: SpokenLangTag) => {
    const supported: WorldLanguageCode[] = ['fr', 'en', 'sw', 'es', 'ar', 'zh', 'pt', 'hi', 'ru'];
    if (supported.includes(tag as WorldLanguageCode)) {
      setLang(tag as WorldLanguageCode);
    }
  };

  const hazardLabel = (h: DuplicatedWorldCountry['hazard']) => {
    if (isFr) {
      if (h === 'drought') return 'Sécheresse';
      if (h === 'flood') return 'Crues / Cyclones';
      if (h === 'heat') return 'Chaleur extrême';
      return 'Mixte (Sec + Crues)';
    }
    if (h === 'drought') return 'Drought';
    if (h === 'flood') return 'Floods / Cyclones';
    if (h === 'heat') return 'Extreme Heat';
    return 'Mixed Hazard';
  };

  return (
    <section
      id="observatoire-mondial"
      className="border-t border-zinc-200 bg-[#F9F8F4] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#1E3A8A]">
              {t.sections.s11Eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {t.sections.s11Title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">{t.sections.s11Lead}</p>
          </div>
          <div className="border border-zinc-300 bg-white px-4 py-3 text-xs text-zinc-700 shrink-0 space-y-2">
            <div>
              <div className="font-semibold text-zinc-900">
                {isFr ? 'Licence officielle : M&G Consulting' : 'Official License: M&G Consulting'}
              </div>
              <div className="mt-0.5 text-zinc-600">
                DG : <span className="font-medium text-zinc-900">Prince MANANTENASOA</span>
              </div>
              <div className="font-mono text-[11px] text-[#1E3A8A]">
                195 {isFr ? 'États ONU' : 'UN States'} · 12 {isFr ? 'Zones' : 'Zones'} · 9 {isFr ? 'Langues' : 'Languages'} · 2028–2032
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => void runGlobalScrapeNow()}
                disabled={syncing}
                className="inline-flex items-center gap-1 border border-[#1E3A8A] bg-white px-2 py-1 font-mono text-[10.5px] font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white disabled:opacity-60"
              >
                <Globe className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>{syncing ? actions.scrapingNow : actions.scrapeNowBtn}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  exportClimateSummaryPdf({
                    lang,
                    horizonYear: 2027,
                    scenario: 's2',
                    currency: 'USD',
                    syncState,
                  })
                }
                className="inline-flex items-center gap-1 border border-rose-700 bg-rose-700 px-2 py-1 font-mono text-[10.5px] font-semibold text-white hover:bg-rose-800"
              >
                <FileDown className="h-3 w-3" aria-hidden="true" />
                <span>{actions.pdfSummaryBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Summary Strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {liveZoneSummaries.map((zone) => (
            <div
              key={zone.id}
              className="border border-zinc-200 bg-white p-3.5"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{isFr ? zone.nameFr : zone.nameEn}</span>
                <span className="font-semibold text-[#1E3A8A]">{zone.countryCount}</span>
              </div>
              <div className="mt-1.5 font-serif text-xl font-semibold text-zinc-900">
                {zone.cumulative2027_2031BUsd.toLocaleString()} Md$
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-500">
                {isFr ? 'Cumul 2027–2031 · ' : '2027–2031 Cum. · '}
                {zone.popM.toFixed(0)} M hab.
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-3" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'world-models'}
            onClick={() => setActiveTab('world-models')}
            className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'world-models'
                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
            }`}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span>
              {isFr
                ? '1. Décompte ONU (195), Continents (5/6/7) & Langues Mondiales'
                : '1. UN Count (195), Continents (5/6/7) & World Languages'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'duplication'}
            onClick={() => setActiveTab('duplication')}
            className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'duplication'
                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
            }`}
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>
              {isFr
                ? '2. Duplication 195 Pays & 12 Zones Climatiques (Causes → Impacts)'
                : '2. 195-Country Duplication & 12 Climate Zones (Causes → Impacts)'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'forecast-2028-2032'}
            onClick={() => setActiveTab('forecast-2028-2032')}
            className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'forecast-2028-2032'
                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
            }`}
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            <span>
              {isFr
                ? '3. Anticipations Multi-Annuelles 2028 · 2029 · 2030 · 2031 · 2032'
                : '3. Multi-Year Projections 2028 · 2029 · 2030 · 2031 · 2032'}
            </span>
          </button>
        </div>

        {/* ==================== TAB 1: UN 195, CONTINENTS 5/6/7 & WORLD LANGUAGES ==================== */}
        {activeTab === 'world-models' && (
          <div className="mt-8 space-y-10">
            {/* UN Count Variants */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-zinc-900">
                {isFr
                  ? 'Combien de pays dans le monde ? Référentiel ONU (195) et variantes officielles'
                  : 'How many countries in the world? UN Official Reference (195) & Variants'}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {UN_COUNT_VARIANTS.map((v) => (
                  <div
                    key={v.count}
                    className={`border p-5 ${
                      v.count === '195'
                        ? 'border-[#1E3A8A] bg-white'
                        : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <div className="font-serif text-3xl font-semibold text-[#1E3A8A]">{v.count}</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900">
                      {isFr ? v.labelFr : v.labelEn}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                      {isFr ? v.detailFr : v.detailEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Continent Models (5, 6, 7) */}
            <div className="border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-zinc-900">
                    {isFr
                      ? 'Modèles géographiques des continents : 5, 6 ou 7 continents'
                      : 'Geographic Continent Models: 5, 6, or 7 Continents'}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {isFr
                      ? 'La définition varie selon les critères géographiques, historiques ou géologiques (Eurasie, Amériques, Antarctique, plaque Zealandia).'
                      : 'Definitions vary across geographic, historical, and geological models (Eurasia, Americas, Antarctica, submerged Zealandia).'}
                  </p>
                </div>
                <div className="inline-flex border border-zinc-300 bg-[#F9F8F4] p-0.5 shrink-0">
                  {(['6', '7', '5'] as ContinentModel[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setContinentModel(m)}
                      className={`px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        continentModel === m
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {m} {isFr ? 'Continents' : 'Continents'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 border border-zinc-200 bg-[#F9F8F4] p-4 text-xs leading-relaxed text-zinc-700">
                {continentModel === '6' && (
                  <p>
                    <strong className="text-zinc-900">
                      {isFr ? 'Modèle ONU / Francophone (6 continents) :' : 'UN / Francophone Model (6 Continents):'}
                    </strong>{' '}
                    {isFr
                      ? 'Afrique (54 États ONU), Asie (48), Europe (44), Amérique (35 États unifiés : 33 Amérique latine/Caraïbes + 2 Amérique du Nord), Océanie (14) et Antarctique (0 État). En géologie, Europe + Asie forment l’Eurasie (54,7 M km²).'
                      : 'Africa (54 UN states), Asia (48), Europe (44), unified Americas (35), Oceania (14), and Antarctica (0). Geologically, Europe + Asia form Eurasia.'}
                  </p>
                )}
                {continentModel === '7' && (
                  <p>
                    <strong className="text-zinc-900">
                      {isFr ? 'Modèle Anglophone / Standard mondial (7 continents) :' : 'Anglophone / Global 7-Continent Model:'}
                    </strong>{' '}
                    {isFr
                      ? 'Scinde l’Amérique en Amérique du Nord (23 États souverains incluant Caraïbes & Amérique centrale, ou 2 dans la statistique macro ONU Canada+USA) et Amérique du Sud (12 États : Brésil, Pérou, Colombie, Argentine, Chili...), aux côtés de l’Afrique, Asie, Europe, Océanie et Antarctique.'
                      : 'Splits the Americas into North America (23 sovereign states including Central America/Caribbean) and South America (12 states), alongside Africa, Asia, Europe, Oceania, and Antarctica.'}
                  </p>
                )}
                {continentModel === '5' && (
                  <p>
                    <strong className="text-zinc-900">
                      {isFr ? 'Modèle Olympique / Historique (5 continents habités) :' : 'Olympic 5-Continent Model (Inhabited):'}
                    </strong>{' '}
                    {isFr
                      ? 'Représente les 5 anneaux olympiques : Afrique, Amérique, Asie, Europe et Océanie (excluant l’Antarctique faute de population permanente). Mention géologique : le microcontinent Zealandia (Nouvelle-Zélande & Nouvelle-Calédonie) est immergé à ~94 %.'
                      : 'Corresponds to the 5 Olympic rings (Africa, Americas, Asia, Europe, Oceania), excluding uninhabited Antarctica. Geological note: Zealandia crust is ~94% submerged.'}
                  </p>
                )}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-[#F9F8F4] font-mono text-[11px] uppercase text-zinc-600">
                      <th className="px-3 py-2.5">{isFr ? 'Continent' : 'Continent'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Superficie (M km²)' : 'Area (M km²)'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Population (Md)' : 'Population (B)'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'États ONU' : 'UN States'}</th>
                      <th className="px-3 py-2.5">{isFr ? 'Particularités géographiques & ENSO' : 'Geographic & ENSO Notes'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {CONTINENT_COMPARISON_6.map((row) => (
                      <tr key={row.nameFr} className="hover:bg-zinc-50">
                        <td className="px-3 py-2.5 font-semibold text-zinc-900">
                          {isFr ? row.nameFr : row.nameEn}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono">{row.areaMKm2.toFixed(1)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">
                          {row.popB === 0 ? '~0 (Saisonnier)' : row.popB.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-[#1E3A8A]">
                          {row.unStates}
                        </td>
                        <td className="px-3 py-2.5 text-zinc-600">
                          {isFr ? row.noteFr : row.noteEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Most Spoken & Official World Languages */}
            <div className="border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-zinc-900">
                    <Languages className="h-5 w-5 text-[#1E3A8A]" aria-hidden="true" />
                    <span>
                      {isFr
                        ? 'Langues les plus parlées et officielles dans les 195 pays (6 langues ONU + grandes langues)'
                        : 'Most Spoken & Official World Languages Across 195 Countries'}
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {isFr
                      ? 'Cliquez sur une langue pour basculer immédiatement l’interface de l’Observatoire, Gemini AI et Babakoto dans cette langue.'
                      : 'Click any language card below to switch the Observatory interface, Gemini AI, and Babakoto live into that language.'}
                  </p>
                </div>
                <div className="font-mono text-xs text-[#1E3A8A]">
                  {isFr ? 'Langue active :' : 'Active:'} <strong className="uppercase">{worldLang}</strong>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {WORLD_LANGUAGES_STATS.map((lStat) => {
                  const isActive = worldLang === lStat.code;
                  return (
                    <button
                      key={lStat.code}
                      type="button"
                      onClick={() => handleSelectWorldLanguage(lStat.code)}
                      className={`flex flex-col justify-between border p-4 text-left transition-colors ${
                        isActive
                          ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                          : 'border-zinc-200 bg-[#F9F8F4] hover:border-[#1E3A8A]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif text-base font-semibold text-zinc-900">
                            {isFr ? lStat.nameFr : lStat.nameEn}{' '}
                            <span className="font-sans text-xs font-normal text-zinc-500">
                              · {lStat.nativeName}
                            </span>
                          </span>
                          <span className="border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#1E3A8A]">
                            {lStat.unOfficial ? 'ONU' : lStat.code.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-[10px] uppercase text-zinc-500">
                              {isFr ? 'Statut officiel' : 'Official status'}
                            </div>
                            <div className="font-semibold text-zinc-800">{lStat.officialCountries}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase text-zinc-500">
                              {isFr ? 'Locuteurs totaux' : 'Total speakers'}
                            </div>
                            <div className="font-semibold text-[#1E3A8A]">{lStat.totalSpeakers}</div>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-zinc-600">{lStat.regions}</p>
                      </div>
                      <div className="mt-3 border-t border-zinc-200 pt-2 font-mono text-[11px] font-semibold text-[#1E3A8A]">
                        {isActive
                          ? isFr
                            ? '✓ Langue active sur la plateforme'
                            : '✓ Active platform language'
                          : isFr
                            ? 'Activer cette langue →'
                            : 'Switch platform to this language →'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: 195-COUNTRY DUPLICATION & 12 CLIMATE ZONES ==================== */}
        {activeTab === 'duplication' && (
          <div className="mt-8 space-y-8">
            {/* Global Macro Loss Benchmarks */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GLOBAL_MACRO_BENCHMARKS.map((b) => (
                <div key={`${b.reference}-${b.period}`} className="border border-zinc-200 bg-white p-4">
                  <div className="font-mono text-[11px] font-semibold uppercase text-zinc-500">
                    {b.reference} · {b.period}
                  </div>
                  <div className="mt-1 font-serif text-2xl font-semibold text-[#B91C1C]">
                    {b.lossLabel}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                    {isFr ? b.scopeFr : b.scopeEn}
                  </p>
                </div>
              ))}
            </div>

            {/* 12 Climate & Economic Zones */}
            <div className="border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-zinc-900">
                    {isFr
                      ? 'Synthèse des 12 Zones Climatiques Mondiales (Téléconnexions & Impulsions)'
                      : '12 Global Climate & Economic Zones (Teleconnections & Multi-Sector Shocks)'}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {isFr
                      ? 'Cliquez sur une zone pour filtrer les pays correspondants dans l’annuaire des 195 États ci-dessous.'
                      : 'Click any climate zone card to filter the 195-country UN directory below.'}
                  </p>
                </div>
                {selectedClimateZone !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedClimateZone('all')}
                    className="border border-[#1E3A8A] px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
                  >
                    {isFr ? 'Afficher les 12 zones' : 'Show all 12 zones'}
                  </button>
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {climateZoneSummaries.map(({ zone, countryCount, cumulative2027_2031BUsd }) => {
                  const isSelected = selectedClimateZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() =>
                        setSelectedClimateZone(isSelected ? 'all' : zone.id)
                      }
                      className={`border p-4 text-left transition-colors ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                          : 'border-zinc-200 bg-[#F9F8F4] hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-sm font-semibold text-zinc-900">
                          {isFr ? zone.nameFr : zone.nameEn}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-[#1E3A8A] shrink-0">
                          {countryCount} {isFr ? 'pays' : 'states'} · {cumulative2027_2031BUsd} Md$
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-[11px] text-zinc-600">
                        <p>
                          <strong className="text-zinc-800">{isFr ? 'Météo :' : 'Weather:'}</strong>{' '}
                          {isFr ? zone.weather2027Fr : zone.weather2027En}
                        </p>
                        <p>
                          <strong className="text-zinc-800">{isFr ? 'Éco/Agri :' : 'Econ/Agri:'}</strong>{' '}
                          {isFr ? zone.agriEnergyFr : zone.agriEnergyEn}
                        </p>
                        <p>
                          <strong className="text-zinc-800">{isFr ? 'Santé/Dépl. :' : 'Health/Disp.:'}</strong>{' '}
                          {isFr ? zone.healthDisplacementFr : zone.healthDisplacementEn}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Country Duplication Detail Card */}
            {selectedCountry && (
              <div className="border border-[#1E3A8A] bg-white p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#1E3A8A] px-2 py-0.5 font-mono text-xs font-semibold text-white">
                        {selectedCountry.iso2}
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-zinc-900">
                        {isFr ? selectedCountry.nameFr : selectedCountry.nameEn}
                      </h3>
                      <span className="border border-zinc-300 bg-[#F9F8F4] px-2 py-0.5 font-mono text-[11px] text-zinc-700">
                        {selectedCountry.unStatus === 'member'
                          ? isFr
                            ? 'État membre ONU (1/193)'
                            : 'UN Member State (1/193)'
                          : isFr
                            ? 'État observateur non membre (1/2)'
                            : 'UN Non-Member Observer (1/2)'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-600">
                      {isFr ? UN_ZONE_META[selectedCountry.unZone].nameFr : UN_ZONE_META[selectedCountry.unZone].nameEn} ·{' '}
                      {selectedCountry.continent7} ·{' '}
                      {isFr ? selectedCountry.climateZoneMeta.nameFr : selectedCountry.climateZoneMeta.nameEn} ·{' '}
                      <strong>{isFr ? 'Langues :' : 'Languages:'}</strong> {selectedCountry.langDisplay}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[11px] uppercase text-zinc-500">
                      {isFr ? 'Cumul pertes modélisées 2027–2031' : 'Cumulative Modeled Drag 2027–2031'}
                    </div>
                    <div className="font-serif text-2xl font-semibold text-[#B91C1C]">
                      {selectedCountry.cumulativeLoss2027_2031BUsd.toLocaleString()} Md USD
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500">
                      Pop: {selectedCountry.popM} M · PIB: {selectedCountry.gdpB} Md USD
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
                  <div className="border border-zinc-200 bg-[#F9F8F4] p-3">
                    <div className="font-semibold text-zinc-900">
                      {isFr ? 'Mécanisme physique & météo' : 'Physical Mechanism & Weather'}
                    </div>
                    <p className="mt-1 text-zinc-600">
                      {isFr
                        ? selectedCountry.climateZoneMeta.weather2027Fr
                        : selectedCountry.climateZoneMeta.weather2027En}
                    </p>
                  </div>
                  <div className="border border-zinc-200 bg-[#F9F8F4] p-3">
                    <div className="font-semibold text-zinc-900">
                      {isFr ? 'Agriculture, pêche & énergie' : 'Agriculture, Fisheries & Energy'}
                    </div>
                    <p className="mt-1 text-zinc-600">
                      {isFr
                        ? selectedCountry.climateZoneMeta.agriEnergyFr
                        : selectedCountry.climateZoneMeta.agriEnergyEn}
                    </p>
                  </div>
                  <div className="border border-zinc-200 bg-[#F9F8F4] p-3">
                    <div className="font-semibold text-zinc-900">
                      {isFr ? 'Santé, famine & migrations' : 'Health, Famine & Displacement'}
                    </div>
                    <p className="mt-1 text-zinc-600">
                      {isFr
                        ? selectedCountry.climateZoneMeta.healthDisplacementFr
                        : selectedCountry.climateZoneMeta.healthDisplacementEn}
                    </p>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-[#F9F8F4] font-mono text-[11px] uppercase text-zinc-600">
                        <th className="px-2.5 py-2">{isFr ? 'Année' : 'Year'}</th>
                        <th className="px-2.5 py-2">{isFr ? 'Régime climatique' : 'Regime'}</th>
                        <th className="px-2.5 py-2 text-right">PIB Δ</th>
                        <th className="px-2.5 py-2 text-right">{isFr ? 'Perte (Md$)' : 'Loss ($B)'}</th>
                        <th className="px-2.5 py-2 text-right">{isFr ? 'Infl. alim.' : 'Food Infl.'}</th>
                        <th className="px-2.5 py-2 text-right">{isFr ? 'Séch. / Crues' : 'Drought/Flood'}</th>
                        <th className="px-2.5 py-2 text-right">{isFr ? 'Risque' : 'Risk'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {FORECAST_YEARS.map((y) => {
                        const p = selectedCountry.projections[y];
                        return (
                          <tr key={y} className={y >= 2028 ? 'bg-white' : 'bg-amber-50/40'}>
                            <td className="px-2.5 py-2 font-mono font-semibold text-[#1E3A8A]">{y}</td>
                            <td className="px-2.5 py-2 text-zinc-700">
                              {isFr ? p.regimeFr : p.regimeEn}
                            </td>
                            <td className="px-2.5 py-2 text-right font-mono font-semibold text-[#B91C1C]">
                              {p.gdpDeltaPct.toFixed(2)} %
                            </td>
                            <td className="px-2.5 py-2 text-right font-mono">
                              {p.lossBUsd.toFixed(3)}
                            </td>
                            <td className="px-2.5 py-2 text-right font-mono text-amber-800">
                              +{p.inflationAddPct.toFixed(1)} %
                            </td>
                            <td className="px-2.5 py-2 text-right font-mono">
                              {p.droughtIdx} / {p.floodIdx}
                            </td>
                            <td className="px-2.5 py-2 text-right font-semibold">{p.famineRisk}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 195-Country Filterable Directory */}
            <div className="border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-zinc-900">
                    {isFr
                      ? `Annuaire complet des 195 pays ONU (${filteredCountries.length} affichés)`
                      : `Complete 195 UN Countries Directory (${filteredCountries.length} shown)`}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {isFr
                      ? 'Filtrez par zone ONU, langue la plus parlée ou aléa climatique. Cliquez sur un pays pour afficher sa fiche de duplication 2027–2032.'
                      : 'Filter by UN region, dominant language, or climate hazard. Click any row to load its full 2027–2032 profile.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExport195Csv}
                  className="inline-flex items-center gap-2 border border-[#1E3A8A] bg-white px-3 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5 shrink-0"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{isFr ? 'Exporter CSV (195 pays)' : 'Export CSV (195 countries)'}</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isFr ? 'Rechercher un pays, ISO, langue...' : 'Search country, ISO, language...'}
                    className="w-full border border-zinc-300 bg-[#F9F8F4] py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <select
                  value={selectedUnZone}
                  onChange={(e) => setSelectedUnZone(e.target.value as UnZoneId | 'all')}
                  className="border border-zinc-300 bg-[#F9F8F4] px-3 py-2 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="all">{isFr ? 'Toutes les zones ONU (195 pays)' : 'All UN Regions (195)'}</option>
                  {(Object.keys(UN_ZONE_META) as UnZoneId[]).map((zId) => (
                    <option key={zId} value={zId}>
                      {isFr ? UN_ZONE_META[zId].nameFr : UN_ZONE_META[zId].nameEn} (
                      {UN_ZONE_SUMMARIES.find((s) => s.id === zId)?.countryCount})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLangFilter}
                  onChange={(e) => setSelectedLangFilter(e.target.value as SpokenLangTag | 'all')}
                  className="border border-zinc-300 bg-[#F9F8F4] px-3 py-2 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="all">{isFr ? 'Toutes les langues mondiales' : 'All World Languages'}</option>
                  {WORLD_LANGUAGES_STATS.map((ls) => (
                    <option key={ls.code} value={ls.code}>
                      {isFr ? ls.nameFr : ls.nameEn} ({ls.officialCountries})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedHazard}
                  onChange={(e) =>
                    setSelectedHazard(e.target.value as 'all' | DuplicatedWorldCountry['hazard'])
                  }
                  className="border border-zinc-300 bg-[#F9F8F4] px-3 py-2 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="all">{isFr ? 'Tous les aléas ENSO' : 'All ENSO Hazards'}</option>
                  <option value="drought">{hazardLabel('drought')}</option>
                  <option value="flood">{hazardLabel('flood')}</option>
                  <option value="heat">{hazardLabel('heat')}</option>
                  <option value="mixed">{hazardLabel('mixed')}</option>
                </select>
              </div>

              <div className="mt-4 max-h-[460px] overflow-auto border border-zinc-200">
                <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-[#F9F8F4] border-b border-zinc-200 font-mono text-[11px] uppercase text-zinc-600">
                    <tr>
                      <th className="px-3 py-2.5">ISO</th>
                      <th className="px-3 py-2.5">{isFr ? 'Pays (ONU)' : 'Country (UN)'}</th>
                      <th className="px-3 py-2.5">{isFr ? 'Zone ONU / Continent' : 'UN Zone / Continent'}</th>
                      <th className="px-3 py-2.5">{isFr ? 'Langues' : 'Languages'}</th>
                      <th className="px-3 py-2.5">{isFr ? 'Aléa dominant' : 'Hazard'}</th>
                      <th className="px-3 py-2.5 text-right">2027 PIB %</th>
                      <th className="px-3 py-2.5 text-right">2031 PIB %</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Cumul 27–31' : '27–31 Cum.'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredCountries.map((country) => {
                      const active = selectedCountry?.iso2 === country.iso2;
                      return (
                        <tr
                          key={country.iso2}
                          onClick={() => setSelectedCountryIso(country.iso2)}
                          className={`cursor-pointer transition-colors ${
                            active ? 'bg-[#1E3A8A]/10' : 'hover:bg-zinc-50'
                          }`}
                        >
                          <td className="px-3 py-2 font-mono font-semibold text-[#1E3A8A]">
                            {country.iso2}
                          </td>
                          <td className="px-3 py-2 font-semibold text-zinc-900">
                            {isFr ? country.nameFr : country.nameEn}
                            {country.unStatus === 'observer' && (
                              <span className="ml-1.5 font-mono text-[10px] text-amber-700">
                                ({isFr ? 'Obs. ONU' : 'Observer'})
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-zinc-600">
                            {isFr ? UN_ZONE_META[country.unZone].nameFr : UN_ZONE_META[country.unZone].nameEn}
                          </td>
                          <td className="px-3 py-2 text-zinc-600">{country.langDisplay}</td>
                          <td className="px-3 py-2 text-zinc-700">{hazardLabel(country.hazard)}</td>
                          <td className="px-3 py-2 text-right font-mono text-[#B91C1C]">
                            {country.projections[2027].gdpDeltaPct.toFixed(2)} %
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-[#B91C1C]">
                            {country.projections[2031].gdpDeltaPct.toFixed(2)} %
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-semibold text-zinc-900">
                            {country.cumulativeLoss2027_2031BUsd.toLocaleString()} Md$
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MULTI-YEAR FORECASTS 2028 - 2032 ==================== */}
        {activeTab === 'forecast-2028-2032' && (
          <div className="mt-8 space-y-8">
            {/* Recharts Global 2027-2032 Trajectory */}
            <div className="border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-zinc-900">
                    <TrendingDown className="h-5 w-5 text-[#1E3A8A]" aria-hidden="true" />
                    <span>
                      {isFr
                        ? 'Trajectoire mondiale des pertes PIB 2027–2032 par Zone ONU (Md USD / an)'
                        : 'Global GDP Loss Trajectory 2027–2032 by UN Region (USD Billions / yr)'}
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {isFr
                      ? `Total modélisé cumulé 2027–2031 : ~${totalGlobalCumulative2027_2031} Md USD (calibré sur Oxford Economics ~4 000 Md USD et Dartmouth 1982/1997).`
                      : `Cumulative 2027–2031 modeled drag: ~USD ${totalGlobalCumulative2027_2031}B (calibrated to Oxford Economics ~USD 4T & Dartmouth).`}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timelineSeries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#3F3F46' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#3F3F46' }} unit=" Md$" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D4D4D8',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    {(Object.keys(UN_ZONE_META) as UnZoneId[]).map((zId) => (
                      <Bar
                        key={zId}
                        dataKey={zId}
                        stackId="un"
                        name={isFr ? UN_ZONE_META[zId].nameFr : UN_ZONE_META[zId].nameEn}
                        fill={UN_ZONE_COLORS[zId]}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="globalTotal"
                      name={isFr ? 'Total Mondial (Md USD)' : 'Global Total ($B)'}
                      stroke="#18181B"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Year Selector & Annual UN Zone Cards */}
            <div className="border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-serif text-xl font-semibold text-zinc-900">
                  {isFr
                    ? `Anticipations détaillées pour l’année ${selectedYear} (195 pays)`
                    : `Detailed Multi-Year Outlook for ${selectedYear} (195 Countries)`}
                </h3>
                <div className="inline-flex flex-wrap border border-zinc-300 bg-[#F9F8F4] p-0.5">
                  {FORECAST_YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setSelectedYear(y)}
                      className={`px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        selectedYear === y
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 border border-[#1E3A8A]/30 bg-[#F9F8F4] p-4 text-xs leading-relaxed text-zinc-800">
                <strong className="font-mono text-[#1E3A8A]">{selectedYear} :</strong>{' '}
                {isFr ? YEAR_REGIME_BRIEF[selectedYear].fr : YEAR_REGIME_BRIEF[selectedYear].en}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {liveZoneSummaries.map((zone) => (
                  <div key={zone.id} className="border border-zinc-200 bg-[#F9F8F4] p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                      <span>{isFr ? zone.nameFr : zone.nameEn}</span>
                      <span className="font-mono text-[#1E3A8A]">{zone.countryCount} pays</span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-serif text-2xl font-semibold text-[#B91C1C]">
                        {zone.yearlyLossBUsd[selectedYear].toLocaleString()} Md USD
                      </span>
                      <span className="font-mono text-xs text-amber-800">
                        +{zone.avgInflationAdd[selectedYear]}% alim.
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 195-Country Matrix for Selected Year */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <select
                  value={matrixZoneFilter}
                  onChange={(e) => setMatrixZoneFilter(e.target.value as UnZoneId | 'all')}
                  className="border border-zinc-300 bg-[#F9F8F4] px-3 py-2 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="all">{isFr ? 'Toutes les zones ONU (195 pays)' : 'All UN Regions (195)'}</option>
                  {(Object.keys(UN_ZONE_META) as UnZoneId[]).map((zId) => (
                    <option key={zId} value={zId}>
                      {isFr ? UN_ZONE_META[zId].nameFr : UN_ZONE_META[zId].nameEn}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleExportMatrixCsv}
                  className="inline-flex items-center gap-2 border border-[#1E3A8A] bg-white px-3 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {isFr ? `Exporter CSV ${selectedYear}` : `Export ${selectedYear} CSV`}
                  </span>
                </button>
              </div>

              <div className="mt-4 max-h-[420px] overflow-auto border border-zinc-200">
                <table className="w-full min-w-[920px] border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-[#F9F8F4] border-b border-zinc-200 font-mono text-[11px] uppercase text-zinc-600">
                    <tr>
                      <th className="px-3 py-2.5">{isFr ? 'Pays' : 'Country'}</th>
                      <th className="px-3 py-2.5">{isFr ? `Régime ${selectedYear}` : `${selectedYear} Regime`}</th>
                      <th className="px-3 py-2.5 text-right">PIB Δ</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Perte (Md$)' : 'Loss ($B)'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Infl. alim.' : 'Food Infl.'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Séch.' : 'Drought'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Crues' : 'Flood'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Dépl.' : 'Displ.'}</th>
                      <th className="px-3 py-2.5 text-right">{isFr ? 'Risque' : 'Risk'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {matrixCountries.map((country) => {
                      const p = country.projections[selectedYear];
                      return (
                        <tr key={country.iso2} className="hover:bg-zinc-50">
                          <td className="px-3 py-2 font-semibold text-zinc-900">
                            <span className="mr-1.5 font-mono text-[#1E3A8A]">{country.iso2}</span>
                            {isFr ? country.nameFr : country.nameEn}
                          </td>
                          <td className="px-3 py-2 text-zinc-600">
                            {isFr ? p.regimeFr : p.regimeEn}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-semibold text-[#B91C1C]">
                            {p.gdpDeltaPct.toFixed(2)} %
                          </td>
                          <td className="px-3 py-2 text-right font-mono">{p.lossBUsd.toFixed(3)}</td>
                          <td className="px-3 py-2 text-right font-mono text-amber-800">
                            +{p.inflationAddPct.toFixed(1)} %
                          </td>
                          <td className="px-3 py-2 text-right font-mono">{p.droughtIdx}</td>
                          <td className="px-3 py-2 text-right font-mono">{p.floodIdx}</td>
                          <td className="px-3 py-2 text-right font-mono">{p.displacementIdx}</td>
                          <td className="px-3 py-2 text-right font-semibold">{p.famineRisk}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
