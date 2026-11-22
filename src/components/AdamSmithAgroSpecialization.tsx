import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Droplets,
  Globe,
  HelpCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sprout,
  ThermometerSun,
  Trees,
  Warehouse,
  Waves,
} from 'lucide-react';
import { CropResilienceQuiz } from './CropResilienceQuiz';
import {
  MADAGASCAR_23_REGION_SPECIALIZATIONS,
  MADAGASCAR_6_PROVINCE_SPECIALIZATIONS,
  YEAR_PERIOD_OPTIONS,
  type EngineeringSuitability,
  type EnsoTrajectoryPhase,
  type SeasonalQuarterId,
  type YearPeriodId,
} from '../data/adamSmithAgroData';
import type { ExProvinceName } from '../data/ensoData';
import { UN_ZONE_SUMMARIES, type UnZoneId } from '../data/worldEnso195Data';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  buildAll195CountryAgroSpecializations,
  formatBiweeklyCountdown,
  FORTNIGHT_INTERVAL_DAYS,
  FORTNIGHT_INTERVAL_MS,
  getTopEngineeringPillar,
  inferEnsoPhaseFromOni,
  type BiweeklyAgroSyncState,
} from '../utils/adamSmithAgroEngine';
import { escapeCsvCell } from '../utils/economicCsvExport';

type ScopeTab = 'mg-provinces' | 'mg-regions' | 'africa-54' | 'world-195';
type TrajectoryMode = 'auto-15d' | 'el-nino' | 'la-nina';

const BIWEEKLY_STORAGE_KEY = 'mg_enso_biweekly_agro_v1';

const INITIAL_BIWEEKLY_STATE: BiweeklyAgroSyncState = {
  enabled: true,
  intervalDays: FORTNIGHT_INTERVAL_DAYS,
  cycleNumber: 22,
  lastUpdatedAtIso: new Date().toISOString(),
  nextUpdateAtIso: new Date(Date.now() + FORTNIGHT_INTERVAL_MS).toISOString(),
  activePhase: 'el-nino',
  oniObservedC: 3.5,
  rainAnomPct: -18,
  trajectoryNoteFr:
    'Quinzaine active (Nov. 2026) : El Niño +3,5 °C — bascule prioritaire vers irrigation goutte-à-goutte, serres ombrières & sorgho 90 j au Sud/SADC.',
  trajectoryNoteEn:
    'Active Fortnight (Nov 2026): El Niño +3.5 °C — prioritizing solar drip irrigation, shade greenhouses & 90d sorghum in Southern Africa/Grand Sud.',
  source: 'client-baseline',
};

function loadBiweeklyState(): BiweeklyAgroSyncState {
  try {
    const raw = localStorage.getItem(BIWEEKLY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BiweeklyAgroSyncState;
      if (parsed && parsed.nextUpdateAtIso) return parsed;
    }
  } catch {
    // Ignore storage issues
  }
  return INITIAL_BIWEEKLY_STATE;
}

function saveBiweeklyState(state: BiweeklyAgroSyncState): void {
  try {
    localStorage.setItem(BIWEEKLY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage issues
  }
}

const QUARTER_IDS: SeasonalQuarterId[] = ['q4-oct-dec', 'q1-jan-mar', 'q2-apr-jun', 'q3-jul-sep'];

const EX_PROVINCES: ('all' | ExProvinceName)[] = [
  'all',
  'Antananarivo',
  'Fianarantsoa',
  'Toamasina',
  'Mahajanga',
  'Toliara',
  'Antsiranana',
];

function EngineeringBars({
  eng,
  isFr,
}: {
  eng: EngineeringSuitability;
  isFr: boolean;
}) {
  const rows: {
    key: keyof EngineeringSuitability;
    label: string;
    score: number;
    icon: typeof Droplets;
    barClass: string;
  }[] = [
    {
      key: 'controlledIrrigation',
      label: isFr ? 'Irrigation contrôlée (Goutte-à-goutte)' : 'Controlled Drip Irrigation',
      score: eng.controlledIrrigation,
      icon: Droplets,
      barClass: 'bg-[#1E3A8A]',
    },
    {
      key: 'greenhouses',
      label: isFr ? 'Serres climatiques & ombrières' : 'Climate Greenhouses & Shade Nets',
      score: eng.greenhouses,
      icon: Warehouse,
      barClass: 'bg-emerald-700',
    },
    {
      key: 'damsAndReservoirs',
      label: isFr ? 'Barrages & micro-retenues' : 'Dams & Micro-Reservoirs',
      score: eng.damsAndReservoirs,
      icon: Waves,
      barClass: 'bg-cyan-700',
    },
    {
      key: 'floodDrainage',
      label: isFr ? 'Digues anti-crues & drainage' : 'Flood Levees & Drainage',
      score: eng.floodDrainage,
      icon: ShieldCheck,
      barClass: 'bg-amber-600',
    },
    {
      key: 'agroforestrySoil',
      label: isFr ? 'Agroforesterie & Zaï / SCV' : 'Agroforestry & Zaï / SCV',
      score: eng.agroforestrySoil,
      icon: Trees,
      barClass: 'bg-teal-700',
    },
  ];

  return (
    <div className="space-y-2">
      {rows.map((r) => {
        const Icon = r.icon;
        return (
          <div key={r.key}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-medium text-zinc-700">
                <Icon className="h-3.5 w-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                <span>{r.label}</span>
              </span>
              <span className="font-mono font-bold text-zinc-900 tabular-nums">{r.score}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-xs bg-zinc-200">
              <div
                className={`h-full ${r.barClass} transition-all duration-300`}
                style={{ width: `${r.score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdamSmithAgroSpecialization() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { syncState, runGlobalScrapeNow } = useGlobalSync();

  const [scopeTab, setScopeTab] = useState<ScopeTab>('mg-provinces');
  const [periodId, setPeriodId] = useState<YearPeriodId>('all-year');
  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>('auto-15d');
  const [provinceFilter, setProvinceFilter] = useState<'all' | ExProvinceName>('all');
  const [unZoneFilter, setUnZoneFilter] = useState<'all' | UnZoneId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryIso, setSelectedCountryIso] = useState<string>('MG');
  const [highlightSection, setHighlightSection] = useState(false);

  const [biweeklyState, setBiweeklyState] = useState<BiweeklyAgroSyncState>(loadBiweeklyState);
  const [biweeklySyncing, setBiweeklySyncing] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState(() =>
    formatBiweeklyCountdown(loadBiweeklyState().nextUpdateAtIso),
  );

  const fetchBiweeklyStatus = useCallback(async () => {
    try {
      const resp = await fetch('/api/climate/agro-specialization/status');
      if (resp.ok) {
        const data = (await resp.json()) as BiweeklyAgroSyncState;
        setBiweeklyState(data);
        saveBiweeklyState(data);
      }
    } catch {
      // Offline mode keeps localStorage state cleanly
    }
  }, []);

  const runBiweeklySyncNow = useCallback(async () => {
    if (biweeklySyncing) return;
    setBiweeklySyncing(true);
    try {
      await runGlobalScrapeNow();
      const resp = await fetch('/api/climate/agro-specialization/run-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (resp.ok) {
        const data = (await resp.json()) as BiweeklyAgroSyncState;
        setBiweeklyState(data);
        saveBiweeklyState(data);
      } else {
        throw new Error('Fallback local biweekly');
      }
    } catch {
      setBiweeklyState((prev) => {
        const phase = inferEnsoPhaseFromOni(syncState.oniIndexObserved);
        const updated: BiweeklyAgroSyncState = {
          ...prev,
          cycleNumber: prev.cycleNumber + 1,
          lastUpdatedAtIso: new Date().toISOString(),
          nextUpdateAtIso: new Date(Date.now() + FORTNIGHT_INTERVAL_MS).toISOString(),
          activePhase: phase,
          oniObservedC: syncState.oniIndexObserved,
          rainAnomPct: syncState.madagascarFactors.rainfallAnomalyPct,
          source: 'manual-trajectory-sync',
        };
        saveBiweeklyState(updated);
        return updated;
      });
    } finally {
      setBiweeklySyncing(false);
    }
  }, [biweeklySyncing, runGlobalScrapeNow, syncState]);

  const toggleBiweeklyAuto = useCallback(async () => {
    const nextEnabled = !biweeklyState.enabled;
    try {
      const resp = await fetch('/api/climate/agro-specialization/toggle-biweekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextEnabled }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as BiweeklyAgroSyncState;
        setBiweeklyState(data);
        saveBiweeklyState(data);
        return;
      }
    } catch {
      // Offline fallback below
    }
    setBiweeklyState((prev) => {
      const updated = {
        ...prev,
        enabled: nextEnabled,
        nextUpdateAtIso:
          nextEnabled && new Date(prev.nextUpdateAtIso).getTime() <= Date.now()
            ? new Date(Date.now() + FORTNIGHT_INTERVAL_MS).toISOString()
            : prev.nextUpdateAtIso,
      };
      saveBiweeklyState(updated);
      return updated;
    });
  }, [biweeklyState.enabled]);

  useEffect(() => {
    void fetchBiweeklyStatus();
  }, [fetchBiweeklyStatus]);

  // Automatic 15-day due check + 1-second live countdown
  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdownLabel(formatBiweeklyCountdown(biweeklyState.nextUpdateAtIso));
      if (
        biweeklyState.enabled &&
        !biweeklySyncing &&
        Date.now() >= new Date(biweeklyState.nextUpdateAtIso).getTime()
      ) {
        void runBiweeklySyncNow();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [biweeklyState.enabled, biweeklyState.nextUpdateAtIso, biweeklySyncing, runBiweeklySyncNow]);

  useEffect(() => {
    const onFocusRubric = () => {
      setHighlightSection(true);
      window.setTimeout(() => setHighlightSection(false), 1800);
    };
    window.addEventListener('focus-adam-smith-agro', onFocusRubric);
    return () => window.removeEventListener('focus-adam-smith-agro', onFocusRubric);
  }, []);

  const effectivePhase: EnsoTrajectoryPhase =
    trajectoryMode === 'auto-15d'
      ? inferEnsoPhaseFromOni(biweeklyState.oniObservedC || syncState.oniIndexObserved)
      : trajectoryMode;

  const activeQuarters: SeasonalQuarterId[] =
    periodId === 'all-year' ? QUARTER_IDS : [periodId];

  const zoneRainMods = useMemo(() => {
    const out: Partial<Record<UnZoneId, number>> = {};
    for (const z of UN_ZONE_SUMMARIES) {
      out[z.id] = syncState.zoneFactors[z.id]?.rainfallAnomalyPct ?? 0;
    }
    return out;
  }, [syncState.zoneFactors]);

  const all195Countries = useMemo(
    () => buildAll195CountryAgroSpecializations(zoneRainMods),
    [zoneRainMods],
  );

  const filteredProvinces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MADAGASCAR_6_PROVINCE_SPECIALIZATIONS;
    return MADAGASCAR_6_PROVINCE_SPECIALIZATIONS.filter(
      (p) =>
        p.province.toLowerCase().includes(q) ||
        p.adamSmithNicheFr.toLowerCase().includes(q) ||
        p.adamSmithNicheEn.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredRegions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MADAGASCAR_23_REGION_SPECIALIZATIONS.filter((r) => {
      if (provinceFilter !== 'all' && r.province !== provinceFilter) return false;
      if (!q) return true;
      return (
        r.region.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        r.adamSmithAdvantageFr.toLowerCase().includes(q) ||
        r.adamSmithAdvantageEn.toLowerCase().includes(q)
      );
    });
  }, [provinceFilter, searchQuery]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return all195Countries.filter((item) => {
      if (scopeTab === 'africa-54' && item.country.unZone !== 'afrique') return false;
      if (scopeTab === 'world-195' && unZoneFilter !== 'all' && item.country.unZone !== unZoneFilter)
        return false;
      if (!q) return true;
      return (
        item.country.nameFr.toLowerCase().includes(q) ||
        item.country.nameEn.toLowerCase().includes(q) ||
        item.country.iso2.toLowerCase().includes(q) ||
        item.adamSmithAdvantageFr.toLowerCase().includes(q) ||
        item.adamSmithAdvantageEn.toLowerCase().includes(q)
      );
    });
  }, [all195Countries, scopeTab, unZoneFilter, searchQuery]);

  const selectedCountryDetail = useMemo(
    () =>
      filteredCountries.find((c) => c.country.iso2 === selectedCountryIso) ??
      filteredCountries[0] ??
      all195Countries[0],
    [filteredCountries, selectedCountryIso, all195Countries],
  );

  const handleExportCsv = () => {
    const headers = [
      'scope',
      'entity',
      'parent_or_zone',
      'period',
      'phase',
      'adam_smith_specialization',
      'recommended_crops_or_strategy',
      'primary_engineering',
      'drip_irrigation_score',
      'greenhouse_score',
      'dam_reservoir_score',
      'flood_drainage_score',
      'agroforestry_score',
    ];
    const rows: string[][] = [headers];
    const qKey: SeasonalQuarterId = periodId === 'all-year' ? 'q4-oct-dec' : periodId;

    if (scopeTab === 'mg-provinces') {
      for (const p of filteredProvinces) {
        const dir = p.quarters[qKey];
        rows.push([
          'Madagascar_Province',
          p.province,
          p.capital,
          periodId,
          effectivePhase,
          isFr ? p.adamSmithNicheFr : p.adamSmithNicheEn,
          effectivePhase === 'la-nina'
            ? isFr
              ? dir.laNinaCropsFr
              : dir.laNinaCropsEn
            : isFr
              ? dir.elNinoCropsFr
              : dir.elNinoCropsEn,
          isFr ? p.recommendedInfraHeadlineFr : p.recommendedInfraHeadlineEn,
          String(p.engineering.controlledIrrigation),
          String(p.engineering.greenhouses),
          String(p.engineering.damsAndReservoirs),
          String(p.engineering.floodDrainage),
          String(p.engineering.agroforestrySoil),
        ]);
      }
    } else if (scopeTab === 'mg-regions') {
      for (const r of filteredRegions) {
        const dir = r.quarters[qKey];
        rows.push([
          'Madagascar_Region',
          r.region,
          r.province,
          periodId,
          effectivePhase,
          isFr ? r.adamSmithAdvantageFr : r.adamSmithAdvantageEn,
          effectivePhase === 'la-nina'
            ? isFr
              ? dir.laNinaCropsFr
              : dir.laNinaCropsEn
            : isFr
              ? dir.elNinoCropsFr
              : dir.elNinoCropsEn,
          isFr ? r.primaryEngineeringFr : r.primaryEngineeringEn,
          String(r.engineering.controlledIrrigation),
          String(r.engineering.greenhouses),
          String(r.engineering.damsAndReservoirs),
          String(r.engineering.floodDrainage),
          String(r.engineering.agroforestrySoil),
        ]);
      }
    } else {
      for (const item of filteredCountries) {
        const dir = item.quarters[qKey];
        rows.push([
          scopeTab === 'africa-54' ? 'Africa_54' : 'World_195',
          isFr ? item.country.nameFr : item.country.nameEn,
          item.country.continent7,
          periodId,
          effectivePhase,
          isFr ? item.adamSmithAdvantageFr : item.adamSmithAdvantageEn,
          effectivePhase === 'la-nina'
            ? isFr
              ? dir.laNinaCropsFr
              : dir.laNinaCropsEn
            : isFr
              ? dir.elNinoCropsFr
              : dir.elNinoCropsEn,
          isFr ? item.primaryInfraFr : item.primaryInfraEn,
          String(item.engineering.controlledIrrigation),
          String(item.engineering.greenhouses),
          String(item.engineering.damsAndReservoirs),
          String(item.engineering.floodDrainage),
          String(item.engineering.agroforestrySoil),
        ]);
      }
    }

    const csv = '\uFEFF' + rows.map((r) => r.map(escapeCsvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adam_smith_agro_specialization_${scopeTab}_${periodId}_${effectivePhase}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quarterLabel = (qId: SeasonalQuarterId) => {
    const found = YEAR_PERIOD_OPTIONS.find((o) => o.id === qId);
    return found ? (isFr ? found.labelFr : found.labelEn) : qId;
  };

  return (
    <section
      id="specialisation-adam-smith"
      className={`border-b border-zinc-200 bg-[#F9F8F4] py-12 lg:py-16 transition-shadow duration-500 ${
        highlightSection ? 'ring-2 ring-inset ring-emerald-600' : ''
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header Block: Adam Smith Thesis & 15-Day Biweekly Auto-Update */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {isFr
                ? '08B · AVANTAGE COMPARATIF D’ADAM SMITH · SPÉCIALISATION AGRICOLE & INGÉNIERIE (AUTO-MÀJ 15J)'
                : '08B · ADAM SMITH COMPARATIVE ADVANTAGE · AGRO SPECIALIZATION & ENGINEERING (15-DAY AUTO-SYNC)'}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {isFr
                ? 'Que doit cultiver et construire chaque région face à El Niño & La Niña toute l’année ?'
                : 'What Every Province, Region & Nation Should Cultivate & Build Year-Round Under ENSO'}
            </h2>
            <p className="mt-2 max-w-[78ch] text-sm leading-relaxed text-zinc-600">
              {isFr
                ? 'Selon le principe d’avantage naturel et de spécialisation d’Adam Smith, chaque territoire (6 provinces & 23 régions de Madagascar, 54 pays d’Afrique, 195 pays ONU) doit concentrer ses facteurs sur les cultures et ouvrages hydrauliques (serres climatiques, goutte-à-goutte contrôlé, barrages, digues) adaptés à chaque saison et à la trajectoire ENSO actualisée automatiquement tous les 15 jours.'
                : 'Applying Adam Smith’s regional specialization principle, every territory (6 provinces & 23 regions of Madagascar, 54 African nations, 195 UN countries) aligns seasonal crops and hydro-engineering (climate greenhouses, controlled drip irrigation, dams, flood levees) with live 15-day ENSO trajectory updates.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                document.getElementById('crop-resilience-quiz')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-900 whitespace-nowrap"
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isFr ? 'Quiz Résilience Coopératives' : 'Crop Resilience Quiz'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isFr ? 'Exporter matrice CSV' : 'Export Matrix CSV'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated 15-Day Automatic Trajectory Update Control Bar */}
        <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => void toggleBiweeklyAuto()}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  biweeklyState.enabled
                    ? 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {biweeklyState.enabled
                    ? isFr
                      ? 'Auto-MàJ 15 jours : ACTIVE'
                      : '15-Day Auto-Update: ACTIVE'
                    : isFr
                      ? 'Auto-MàJ 15 jours : EN PAUSE'
                      : '15-Day Auto-Update: PAUSED'}
                </span>
                <span className="border-l border-current/30 pl-2 tabular-nums opacity-95">
                  {countdownLabel}
                </span>
              </button>

              <button
                type="button"
                onClick={() => void runBiweeklySyncNow()}
                disabled={biweeklySyncing}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#1E3A8A] bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A] hover:text-white disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${biweeklySyncing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>
                  {biweeklySyncing
                    ? isFr
                      ? 'Recalibrage trajectoire…'
                      : 'Syncing trajectory…'
                    : isFr
                      ? 'Actualiser trajectoire 15j'
                      : 'Sync 15-Day Trajectory Now'}
                </span>
              </button>

              <span className="rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-700">
                {isFr ? `Quinzaine #${biweeklyState.cycleNumber}` : `Cycle #${biweeklyState.cycleNumber}`} · ONI +
                {(biweeklyState.oniObservedC || syncState.oniIndexObserved).toFixed(1)} °C
              </span>
            </div>

            <div className="text-xs text-zinc-600">
              <span className="font-semibold text-zinc-900">
                {isFr ? 'Signal trajectoire : ' : 'Trajectory signal: '}
              </span>
              <span>{isFr ? biweeklyState.trajectoryNoteFr : biweeklyState.trajectoryNoteEn}</span>
            </div>
          </div>
        </div>

        {/* Navigation Scope Tabs + Year Period & Trajectory Selectors */}
        <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          {/* Geographic Level Tabs */}
          <div
            role="tablist"
            aria-label={isFr ? 'Échelle géographique agricole' : 'Agricultural geographic scope'}
            className="grid grid-cols-2 gap-2 border-b border-zinc-200 pb-4 lg:grid-cols-4"
          >
            {(
              [
                {
                  id: 'mg-provinces',
                  fr: 'Madagascar · 6 Provinces',
                  en: 'Madagascar · 6 Provinces',
                  count: '6',
                },
                {
                  id: 'mg-regions',
                  fr: 'Madagascar · 23 Régions',
                  en: 'Madagascar · 23 Regions',
                  count: '23',
                },
                {
                  id: 'africa-54',
                  fr: 'Afrique · 54 Pays',
                  en: 'Africa · 54 Countries',
                  count: '54',
                },
                {
                  id: 'world-195',
                  fr: 'Monde · 195 Pays ONU',
                  en: 'World · 195 UN Countries',
                  count: '195',
                },
              ] as const
            ).map((tab) => {
              const active = scopeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setScopeTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-zinc-300 bg-[#F9F8F4] text-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  <span>{isFr ? tab.fr : tab.en}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                      active ? 'bg-white/20 text-white' : 'bg-white text-zinc-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Year Period, ENSO Trajectory & Search Controls */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Period of the Year */}
            <div className="lg:col-span-6">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {isFr ? 'Période de l’année (Campagne agricole)' : 'Period of the Year (Cropping Season)'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {YEAR_PERIOD_OPTIONS.map((p) => {
                  const selected = periodId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPeriodId(p.id)}
                      className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        selected
                          ? 'border-emerald-800 bg-emerald-800 text-white'
                          : 'border-zinc-300 bg-[#F9F8F4] text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      {isFr ? p.shortFr : p.shortEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trajectory Phase Mode */}
            <div className="lg:col-span-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {isFr ? 'Phase ENSO active' : 'Active ENSO Phase'}
              </p>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { id: 'auto-15d', fr: 'Auto 15j', en: 'Auto 15d' },
                    { id: 'el-nino', fr: 'El Niño', en: 'El Niño' },
                    { id: 'la-nina', fr: 'La Niña', en: 'La Niña' },
                  ] as const
                ).map((m) => {
                  const selected = trajectoryMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setTrajectoryMode(m.id)}
                      className={`rounded-md border px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                        selected
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-300 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      {isFr ? m.fr : m.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search / Sub-Filter */}
            <div className="lg:col-span-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {isFr ? 'Recherche territoire / culture' : 'Search territory / crop'}
              </p>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isFr ? 'Ex: Androy, SAVA, Kenya, Riz…' : 'e.g. Androy, SAVA, Kenya, Rice…'
                  }
                  className="w-full rounded-md border border-zinc-300 bg-[#F9F8F4] py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#1E3A8A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sub-Filters for 23 Regions (Province) or 195 World (UN Zone) */}
          {scopeTab === 'mg-regions' && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3">
              <span className="mr-1 text-[11px] font-semibold text-zinc-500">
                {isFr ? 'Filtrer par province :' : 'Filter by province:'}
              </span>
              {EX_PROVINCES.map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setProvinceFilter(prov)}
                  className={`rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
                    provinceFilter === prov
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {prov === 'all' ? (isFr ? 'Toutes (23)' : 'All (23)') : prov}
                </button>
              ))}
            </div>
          )}

          {scopeTab === 'world-195' && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3">
              <span className="mr-1 text-[11px] font-semibold text-zinc-500">
                {isFr ? 'Continent / Zone ONU :' : 'UN Region:'}
              </span>
              <button
                type="button"
                onClick={() => setUnZoneFilter('all')}
                className={`rounded border px-2 py-1 text-[11px] font-medium ${
                  unZoneFilter === 'all'
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                    : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700'
                }`}
              >
                {isFr ? 'Monde (195)' : 'World (195)'}
              </button>
              {UN_ZONE_SUMMARIES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setUnZoneFilter(z.id)}
                  className={`rounded border px-2 py-1 text-[11px] font-medium ${
                    unZoneFilter === z.id
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700'
                  }`}
                >
                  {isFr ? z.nameFr : z.nameEn} ({z.countryCount})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT VIEW 1: MADAGASCAR 6 EX-PROVINCES */}
        {scopeTab === 'mg-provinces' && (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredProvinces.map((prov) => (
              <article
                key={prov.province}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div>
                      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800">
                        {isFr ? 'Ex-Province' : 'Province'} · {prov.capital}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-zinc-900">
                        {prov.province}
                      </h3>
                    </div>
                    <span
                      className={`rounded px-2 py-1 font-mono text-[10.5px] font-bold ${
                        effectivePhase === 'la-nina'
                          ? 'bg-sky-50 text-sky-900 border border-sky-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {effectivePhase === 'la-nina' ? 'La Niña Mode' : 'El Niño Mode'}
                    </span>
                  </div>

                  {/* Adam Smith Advantage */}
                  <div className="mt-3 rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-900">
                      <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {isFr
                          ? 'Spécialisation Adam Smith (Avantage naturel)'
                          : 'Adam Smith Specialization (Natural Advantage)'}
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-800">
                      {isFr ? prov.adamSmithNicheFr : prov.adamSmithNicheEn}
                    </p>
                  </div>

                  {/* Risk Context */}
                  <p className="mt-2.5 text-xs text-zinc-600">
                    <strong className="text-zinc-800">
                      {isFr ? 'Risque dominant : ' : 'Dominant risk: '}
                    </strong>
                    {effectivePhase === 'la-nina'
                      ? isFr
                        ? prov.laNinaDominantRiskFr
                        : prov.laNinaDominantRiskEn
                      : isFr
                        ? prov.elNinoDominantRiskFr
                        : prov.elNinoDominantRiskEn}
                  </p>

                  {/* Seasonal Prescription Grid */}
                  <div className="mt-3.5 space-y-2">
                    {activeQuarters.map((qId) => {
                      const d = prov.quarters[qId];
                      return (
                        <div
                          key={qId}
                          className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-2.5 text-xs"
                        >
                          <p className="font-mono text-[10.5px] font-bold text-[#1E3A8A]">
                            {quarterLabel(qId)}
                          </p>
                          <p className="mt-1 text-zinc-900">
                            <span className="font-semibold">
                              {effectivePhase === 'la-nina'
                                ? isFr
                                  ? 'Cultures La Niña : '
                                  : 'La Niña Crops: '
                                : isFr
                                  ? 'Cultures El Niño : '
                                  : 'El Niño Crops: '}
                            </span>
                            {effectivePhase === 'la-nina'
                              ? isFr
                                ? d.laNinaCropsFr
                                : d.laNinaCropsEn
                              : isFr
                                ? d.elNinoCropsFr
                                : d.elNinoCropsEn}
                          </p>
                          <p className="mt-0.5 text-[11px] text-zinc-600">
                            {isFr ? d.practiceFr : d.practiceEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Engineering Mix */}
                <div className="mt-4 border-t border-zinc-100 pt-3.5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {isFr
                      ? 'Recommandation Ingénierie (Serres · Irrigation · Barrages)'
                      : 'Engineering Prescription (Greenhouses · Drip · Dams)'}
                  </p>
                  <p className="mb-3 text-xs font-semibold text-[#1E3A8A]">
                    {isFr ? prov.recommendedInfraHeadlineFr : prov.recommendedInfraHeadlineEn}
                  </p>
                  <EngineeringBars eng={prov.engineering} isFr={isFr} />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CONTENT VIEW 2: MADAGASCAR 23 REGIONS */}
        {scopeTab === 'mg-regions' && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredRegions.map((reg) => {
              const topInfra = getTopEngineeringPillar(reg.engineering, isFr ? 'fr' : 'en');
              return (
                <article
                  key={reg.region}
                  className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 sm:p-5"
                >
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-100 pb-2.5">
                      <div>
                        <span className="font-mono text-[10.5px] font-semibold uppercase text-zinc-500">
                          {reg.province} · {isFr ? reg.agroZoneFr : reg.agroZoneEn}
                        </span>
                        <h3 className="font-serif text-lg font-semibold text-zinc-900">
                          {reg.region}
                        </h3>
                      </div>
                      <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-900">
                        {topInfra.label} ({topInfra.score}%)
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-zinc-800">
                      <strong className="text-emerald-900">
                        {isFr ? 'Spécialisation Adam Smith : ' : 'Adam Smith Niche: '}
                      </strong>
                      {isFr ? reg.adamSmithAdvantageFr : reg.adamSmithAdvantageEn}
                    </p>

                    <div className="mt-3 space-y-2">
                      {activeQuarters.map((qId) => {
                        const d = reg.quarters[qId];
                        return (
                          <div
                            key={qId}
                            className="rounded border border-zinc-200 bg-[#F9F8F4] p-2.5 text-xs"
                          >
                            <p className="font-mono text-[10px] font-bold text-[#1E3A8A]">
                              {quarterLabel(qId)}
                            </p>
                            <p className="mt-0.5 font-medium text-zinc-900">
                              {effectivePhase === 'la-nina'
                                ? isFr
                                  ? d.laNinaCropsFr
                                  : d.laNinaCropsEn
                                : isFr
                                  ? d.elNinoCropsFr
                                  : d.elNinoCropsEn}
                            </p>
                            <p className="mt-0.5 text-[11px] text-zinc-600">
                              {isFr ? d.practiceFr : d.practiceEn}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3.5 border-t border-zinc-100 pt-3">
                    <p className="mb-2 text-xs font-semibold text-[#1E3A8A]">
                      {isFr ? reg.primaryEngineeringFr : reg.primaryEngineeringEn}
                    </p>
                    <EngineeringBars eng={reg.engineering} isFr={isFr} />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* CONTENT VIEW 3 & 4: AFRICA 54 COUNTRIES & WORLD 195 UN COUNTRIES */}
        {(scopeTab === 'africa-54' || scopeTab === 'world-195') && (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left: Interactive Country Table (All 54 Africa / 195 UN Countries) */}
            <div className="lg:col-span-7 rounded-xl border border-zinc-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-[#F9F8F4] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {scopeTab === 'africa-54'
                      ? isFr
                        ? `54 Pays d’Afrique (${filteredCountries.length} affichés)`
                        : `54 African Countries (${filteredCountries.length} shown)`
                      : isFr
                        ? `195 Pays ONU — Spécialisation Mondiale (${filteredCountries.length} affichés)`
                        : `195 UN Countries — Global Specialization (${filteredCountries.length} shown)`}
                  </h3>
                </div>
                <span className="font-mono text-[10.5px] text-zinc-500">
                  {isFr ? 'Cliquez un pays →' : 'Select country →'}
                </span>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50 text-[10.5px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-3 py-2.5">{isFr ? 'Pays' : 'Country'}</th>
                      <th className="px-3 py-2.5">
                        {isFr ? 'Spécialisation Adam Smith' : 'Adam Smith Niche'}
                      </th>
                      <th className="px-3 py-2.5 text-right">
                        {isFr ? 'Ouvrage #1' : 'Top Infra'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredCountries.map((item) => {
                      const active = selectedCountryDetail?.country.iso2 === item.country.iso2;
                      const top = getTopEngineeringPillar(item.engineering, isFr ? 'fr' : 'en');
                      return (
                        <tr
                          key={item.country.iso2}
                          onClick={() => setSelectedCountryIso(item.country.iso2)}
                          className={`cursor-pointer transition-colors ${
                            active ? 'bg-[#1E3A8A]/8' : 'hover:bg-[#F9F8F4]'
                          }`}
                        >
                          <td className="px-3 py-2.5 align-top">
                            <p className="font-semibold text-zinc-900">
                              <span className="mr-1.5 font-mono text-[10px] text-zinc-500">
                                {item.country.iso2}
                              </span>
                              {isFr ? item.country.nameFr : item.country.nameEn}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
                              {item.country.continent7} · {item.country.hazard.toUpperCase()}
                            </p>
                          </td>
                          <td className="px-3 py-2.5 align-top text-zinc-700 leading-snug">
                            {isFr ? item.adamSmithAdvantageFr : item.adamSmithAdvantageEn}
                          </td>
                          <td className="px-3 py-2.5 align-top text-right whitespace-nowrap">
                            <span className="inline-block rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-900">
                              {top.label} · {top.score}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Selected Country Deep Prescription Card */}
            {selectedCountryDetail && (
              <div className="lg:col-span-5 space-y-4">
                <article className="rounded-xl border border-zinc-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div>
                      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#1E3A8A]">
                        {selectedCountryDetail.country.iso2} · {selectedCountryDetail.country.continent7}
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-zinc-900">
                        {isFr
                          ? selectedCountryDetail.country.nameFr
                          : selectedCountryDetail.country.nameEn}
                      </h3>
                    </div>
                    <span className="rounded border border-zinc-300 bg-[#F9F8F4] px-2 py-1 font-mono text-[10.5px] font-semibold text-zinc-800">
                      {isFr ? 'Sensibilité ENSO' : 'ENSO Sens.'} ×
                      {selectedCountryDetail.country.ensoSens.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-900">
                      <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {isFr ? 'Vocation Adam Smith du pays' : 'National Adam Smith Specialization'}
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-800">
                      {isFr
                        ? selectedCountryDetail.adamSmithAdvantageFr
                        : selectedCountryDetail.adamSmithAdvantageEn}
                    </p>
                  </div>

                  {/* Seasonal Calendar for Selected Country */}
                  <div className="mt-4 space-y-2">
                    {activeQuarters.map((qId) => {
                      const d = selectedCountryDetail.quarters[qId];
                      return (
                        <div
                          key={qId}
                          className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-2.5 text-xs"
                        >
                          <p className="font-mono text-[10px] font-bold text-[#1E3A8A]">
                            {quarterLabel(qId)}
                          </p>
                          <p className="mt-0.5 font-medium text-zinc-900">
                            {effectivePhase === 'la-nina'
                              ? isFr
                                ? d.laNinaCropsFr
                                : d.laNinaCropsEn
                              : isFr
                                ? d.elNinoCropsFr
                                : d.elNinoCropsEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 border-t border-zinc-100 pt-3.5">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      {isFr
                        ? 'Ouvrages & ingénierie recommandés'
                        : 'Recommended Hydro-Agricultural Engineering'}
                    </p>
                    <p className="mb-3 text-xs font-semibold text-[#1E3A8A]">
                      {isFr
                        ? selectedCountryDetail.primaryInfraFr
                        : selectedCountryDetail.primaryInfraEn}
                    </p>
                    <EngineeringBars eng={selectedCountryDetail.engineering} isFr={isFr} />
                  </div>
                </article>
              </div>
            )}
          </div>
        )}

        <CropResilienceQuiz isFr={isFr} />

        {/* Strategic Decision Guide: Greenhouses vs Controlled Irrigation vs Dams vs Levees */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">
              {isFr
                ? 'Matrice de décision d’ingénierie : Serres, Irrigation contrôlée, Barrages ou Digues ?'
                : 'Engineering Decision Matrix: Greenhouses, Controlled Drip, Dams, or Flood Levees?'}
            </h3>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isFr ? 'Calibré MàJ 15 jours' : '15-Day Calibrated'}</span>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
                <Droplets className="h-4 w-4" aria-hidden="true" />
                <span>{isFr ? 'Irrigation contrôlée (Goutte-à-goutte)' : 'Controlled Drip Irrigation'}</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                {isFr
                  ? 'Prioritaire dans le Grand Sud (Androy, Anosy, Atsimo-Andrefana), Menabe, SADC, Sahel et MENA : économise 45 à 65 % d’eau tout en maintenant les rendements sous déficit El Niño.'
                  : 'Top priority in Grand Sud, Menabe, SADC, Sahel & MENA: cuts water use 45–65% while protecting yields during El Niño dry spells.'}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Warehouse className="h-4 w-4" aria-hidden="true" />
                <span>{isFr ? 'Serres climatiques & ombrières' : 'Climate Greenhouses & Shade Nets'}</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                {isFr
                  ? 'Recommandées sur les Hautes Terres (Analamanga, Vakinankaratra — maraîchage & vitro-plants), Côte Est (abris anti-pluie) et en Afrique du Nord/Europe/Chine : protège contre chaleur extrême, grêle et séchage épices (SAVA).'
                  : 'Ideal for Highlands (Analamanga/Vakinankaratra), East Coast rain-shelters, and SAVA solar spice drying—shielding crops from heatwaves & storms.'}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-cyan-800">
                <Waves className="h-4 w-4" aria-hidden="true" />
                <span>{isFr ? 'Barrages & micro-retenues' : 'Dams & Micro-Reservoirs'}</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                {isFr
                  ? 'Indispensables pour Alaotra-Mangoro (PC15), Bas-Mangoky, Dabara, Marovoay et fleuves africains (Zambèze/Nil) + sand-dams souterrains en zone aride pour stocker les crues saisonnières.'
                  : 'Essential for Alaotra, Bas-Mangoky, Dabara, Marovoay & African river basins—plus subsurface sand dams in arid zones to bank seasonal rains.'}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <ThermometerSun className="h-4 w-4" aria-hidden="true" />
                <span>{isFr ? 'Digues, drainage & Zaï / SCV' : 'Flood Levees, Drainage & Zaï/SCV'}</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                {isFr
                  ? 'Critiques sur la côte Est/Sud-Est (Vatovavy, Fitovinany, SAVA), delta Betsiboka, Corne de l’Afrique (COMESA) et deltas ASEAN lors des pics pluvieux IOD+ ou inversions La Niña.'
                  : 'Critical along East/SE Madagascar, Betsiboka delta, Horn of Africa (COMESA) & ASEAN deltas during IOD+ rain surges and La Niña flood reversals.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
