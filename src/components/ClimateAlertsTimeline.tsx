import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  AlertOctagon,
  ArrowUpDown,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Compass,
  Filter,
  History,
  Radio,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  CLIMATE_ALERT_INTENSITIES,
  CLIMATE_ALERT_ZONES,
  CLIMATE_ALERTS_TIMELINE_EVENTS,
  filterClimateAlertEvents,
  summarizeFilteredTimeline,
  type AlertGeoZoneId,
  type AlertIntensity,
  type AlertPhaseStatus,
  type ClimateAlertTimelineEvent,
  type TimelineSortOrder,
} from '../utils/climateAlertsTimeline';

const INTENSITY_COLOR: Record<AlertIntensity, string> = {
  moderate: '#1E3A8A',
  strong: '#D97706',
  super: '#BE123C',
};

export function ClimateAlertsTimeline() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const [intensityFilter, setIntensityFilter] = useState<'all' | AlertIntensity>('all');
  const [zoneFilter, setZoneFilter] = useState<AlertGeoZoneId>('all');
  const [phaseFilter, setPhaseFilter] = useState<'all' | AlertPhaseStatus>('all');
  const [sortOrder, setSortOrder] = useState<TimelineSortOrder>('asc');
  const [expandedAll, setExpandedAll] = useState<boolean>(false);
  const [focusedEventId, setFocusedEventId] = useState<string>('enso-2026-11');

  const filteredEvents = useMemo(
    () =>
      filterClimateAlertEvents({
        events: CLIMATE_ALERTS_TIMELINE_EVENTS,
        intensity: intensityFilter,
        zone: zoneFilter,
        phase: phaseFilter,
        sortOrder,
      }),
    [intensityFilter, zoneFilter, phaseFilter, sortOrder],
  );

  const stats = useMemo(() => summarizeFilteredTimeline(filteredEvents), [filteredEvents]);

  const chartData = useMemo(
    () =>
      filteredEvents.map((ev) => ({
        id: ev.id,
        label: ev.shortAxisLabel,
        period: isFr ? ev.periodLabelFr : ev.periodLabelEn,
        oni: ev.oniPeakC,
        intensity: ev.intensity,
        phase: ev.phase,
        title: isFr ? ev.titleFr : ev.titleEn,
      })),
    [filteredEvents, isFr],
  );

  const resetFilters = () => {
    setIntensityFilter('all');
    setZoneFilter('all');
    setPhaseFilter('all');
    setSortOrder('asc');
  };

  const hasActiveFilters =
    intensityFilter !== 'all' || zoneFilter !== 'all' || phaseFilter !== 'all';

  const handleSelectChartPoint = (eventId: string) => {
    setFocusedEventId(eventId);
    const el = document.getElementById(`timeline-node-${eventId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getIntensityBadge = (intensity: AlertIntensity) => {
    if (intensity === 'super') {
      return {
        label: isFr ? 'Super El Niño' : 'Super El Niño',
        cls: 'border-rose-300 bg-rose-50 text-rose-800',
      };
    }
    if (intensity === 'strong') {
      return {
        label: isFr ? 'Fort' : 'Strong',
        cls: 'border-amber-300 bg-amber-50 text-amber-800',
      };
    }
    return {
      label: isFr ? 'Modéré' : 'Moderate',
      cls: 'border-[#1E3A8A]/30 bg-[#1E3A8A]/5 text-[#1E3A8A]',
    };
  };

  const getPhaseBadge = (phase: AlertPhaseStatus) => {
    if (phase === 'active') {
      return {
        label: isFr ? 'ALERTE ACTIVE' : 'ACTIVE ALERT',
        cls: 'bg-rose-700 text-white',
      };
    }
    if (phase === 'upcoming') {
      return {
        label: isFr ? 'PRÉVISION À VENIR' : 'UPCOMING FORECAST',
        cls: 'bg-[#1E3A8A] text-white',
      };
    }
    return {
      label: isFr ? 'HISTORIQUE VÉRIFIÉ' : 'HISTORICAL VERIFIED',
      cls: 'bg-zinc-700 text-white',
    };
  };

  const isExpanded = (ev: ClimateAlertTimelineEvent) =>
    expandedAll || ev.phase === 'active' || ev.id === focusedEventId;

  return (
    <section
      id="chronologie-alertes"
      className="border-b border-zinc-200 bg-white py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isFr
                ? '05D · CHRONOLOGIE DES ALERTES CLIMATIQUES (1982–2032)'
                : '05D · CLIMATE ALERTS TIMELINE (1982–2032)'}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {isFr
                ? 'Flux chronologique des épisodes & alertes El Niño'
                : 'Chronological El Niño Alerts & Forecast Stream'}
            </h2>
            <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-zinc-600">
              {isFr
                ? 'Explorez dans l’ordre chronologique les grands épisodes historiques vérifiés (1982–2024), les bulletins rouges actifs de fin 2026 et les seuils critiques projetés (2027–2032), filtrables par niveau d’intensité ONI et par zone géographique.'
                : 'Explore verified historical ENSO benchmarks (1982–2024), active late-2026 advisories, and upcoming projected triggers (2027–2032) in a single chronological stream filtered by ONI intensity and geographic zone.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span>
                {sortOrder === 'asc'
                  ? isFr
                    ? 'Ordre : 1982 → 2032'
                    : 'Order: 1982 → 2032'
                  : isFr
                    ? 'Ordre : 2032 → 1982'
                    : 'Order: 2032 → 1982'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setExpandedAll((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:border-zinc-400"
            >
              {expandedAll ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>
                {expandedAll
                  ? isFr
                    ? 'Vue compacte'
                    : 'Compact view'
                  : isFr
                    ? 'Tout déplier'
                    : 'Expand all'}
              </span>
            </button>
          </div>
        </div>

        {/* Multi-Axis Filters Container */}
        <div className="mt-7 rounded-xl border border-zinc-200 bg-[#F9F8F4] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-700">
              <Filter className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span>
                {isFr
                  ? 'Filtres d’intensité, de zone géographique et d’horizon'
                  : 'Intensity, Geographic Zone & Horizon Filters'}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>{isFr ? 'Réinitialiser' : 'Reset filters'}</span>
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Intensity Filter */}
            <div className="lg:col-span-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {isFr ? '1. Intensité El Niño (Indice ONI)' : '1. El Niño Intensity (ONI)'}
              </p>
              <div
                role="group"
                aria-label={isFr ? 'Filtrer par intensité El Niño' : 'Filter by El Niño intensity'}
                className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2"
              >
                {CLIMATE_ALERT_INTENSITIES.map((opt) => {
                  const selected = intensityFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setIntensityFilter(opt.id)}
                      className={`flex flex-col items-start rounded-md border px-2.5 py-2 text-left transition-colors ${
                        selected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight">
                        {isFr ? opt.labelFr : opt.labelEn}
                      </span>
                      <span
                        className={`mt-0.5 font-mono text-[10px] ${
                          selected ? 'text-blue-100' : 'text-zinc-500'
                        }`}
                      >
                        {isFr ? opt.oniRangeFr : opt.oniRangeEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Phase / Temporal Filter */}
              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {isFr ? '2. Statut temporel' : '2. Temporal Horizon'}
              </p>
              <div
                role="group"
                aria-label={isFr ? 'Filtrer par horizon temporel' : 'Filter by temporal horizon'}
                className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
              >
                {(
                  [
                    { id: 'all', fr: 'Tout (82–32)', en: 'All (82–32)' },
                    { id: 'historical', fr: 'Historique', en: 'Historical' },
                    { id: 'active', fr: 'Actif (2026)', en: 'Active (2026)' },
                    { id: 'upcoming', fr: 'À venir (27–32)', en: 'Upcoming' },
                  ] as const
                ).map((ph) => {
                  const selected = phaseFilter === ph.id;
                  return (
                    <button
                      key={ph.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPhaseFilter(ph.id)}
                      className={`rounded-md border px-2.5 py-2 text-center text-[11px] font-semibold transition-colors ${
                        selected
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      {isFr ? ph.fr : ph.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geographic Zone Filter */}
            <div className="lg:col-span-7">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <Compass className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>
                  {isFr ? '3. Zone géographique ou bloc régional' : '3. Geographic Zone / Regional Bloc'}
                </span>
              </p>
              <div
                role="group"
                aria-label={isFr ? 'Filtrer par zone géographique' : 'Filter by geographic zone'}
                className="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
              >
                {CLIMATE_ALERT_ZONES.map((z) => {
                  const selected = zoneFilter === z.id;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setZoneFilter(z.id)}
                      className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors ${
                        selected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white font-semibold'
                          : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <span>{isFr ? z.labelFr : z.labelEn}</span>
                      <span
                        className={`ml-2 font-mono text-[10px] tabular-nums ${
                          selected ? 'text-blue-100' : 'text-zinc-500'
                        }`}
                      >
                        {z.id === 'all'
                          ? CLIMATE_ALERTS_TIMELINE_EVENTS.length
                          : CLIMATE_ALERTS_TIMELINE_EVENTS.filter((e) =>
                              e.zones.includes(z.id as Exclude<AlertGeoZoneId, 'all'>),
                            ).length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Summary KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <Activity className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span>{isFr ? 'Événements affichés' : 'Matching Alerts'}</span>
            </div>
            <p className="mt-1.5 font-mono text-2xl font-bold text-zinc-900 tabular-nums">
              {stats.total}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600">
              {stats.superCount} Super · {stats.strongCount} {isFr ? 'Fort' : 'Strong'} ·{' '}
              {stats.moderateCount} {isFr ? 'Modéré' : 'Mod.'}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <AlertOctagon className="h-3.5 w-3.5 text-rose-700" aria-hidden="true" />
              <span>{isFr ? 'Pic ONI de la sélection' : 'Peak ONI in Filter'}</span>
            </div>
            <p className="mt-1.5 font-mono text-2xl font-bold text-rose-800 tabular-nums">
              {stats.total > 0 ? `+${stats.maxOniC.toFixed(1)} °C` : '—'}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600">
              {isFr ? 'Anomalie Niño 3.4 maximale' : 'Max Niño 3.4 thermal anomaly'}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <CalendarClock className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span>{isFr ? 'Actifs & Prévisions' : 'Active & Upcoming'}</span>
            </div>
            <p className="mt-1.5 font-mono text-2xl font-bold text-[#1E3A8A] tabular-nums">
              {stats.activeCount + stats.upcomingCount}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600">
              {stats.activeCount} {isFr ? 'actifs' : 'active'} · {stats.upcomingCount}{' '}
              {isFr ? 'jalons 2027–32' : '2027–32 milestones'}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <History className="h-3.5 w-3.5 text-zinc-700" aria-hidden="true" />
              <span>{isFr ? 'Références historiques' : 'Historical Benchmarks'}</span>
            </div>
            <p className="mt-1.5 font-mono text-2xl font-bold text-zinc-900 tabular-nums">
              {stats.historicalCount}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600">
              {isFr ? 'Épisodes vérifiés 1982–2026' : 'Verified 1982–2026 episodes'}
            </p>
          </div>
        </div>

        {/* Chronological ONI Signal Overview Chart */}
        {chartData.length > 0 && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  {isFr
                    ? 'Profil chronologique de l’indice ONI (°C) — cliquez sur une barre pour cibler l’alerte'
                    : 'Chronological ONI Anomaly Stream (°C) — click any bar to focus alert'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {isFr
                    ? 'Seuils critiques : +1,5 °C (Fort) et +2,0 °C (Super El Niño)'
                    : 'Thresholds: +1.5 °C (Strong) and +2.0 °C (Super El Niño)'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#1E3A8A]" />
                  {isFr ? 'Modéré' : 'Moderate'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#D97706]" />
                  {isFr ? 'Fort' : 'Strong'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#BE123C]" />
                  Super El Niño
                </span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#52525B' }}
                    axisLine={{ stroke: '#D4D4D8' }}
                  />
                  <YAxis
                    domain={[0, 4.5]}
                    tickFormatter={(v) => `+${v}°`}
                    tick={{ fontSize: 11, fill: '#52525B' }}
                    axisLine={{ stroke: '#D4D4D8' }}
                  />
                  <Tooltip
                    formatter={(val) => [`+${Number(val ?? 0).toFixed(1)} °C`, 'ONI Peak']}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.period
                        ? `${payload[0].payload.period} — ${payload[0].payload.title}`
                        : ''
                    }
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '8px',
                      borderColor: '#E4E4E7',
                    }}
                  />
                  <ReferenceLine
                    y={1.5}
                    stroke="#D97706"
                    strokeDasharray="4 4"
                    label={{
                      value: '+1.5°C',
                      position: 'right',
                      fill: '#B45309',
                      fontSize: 10,
                    }}
                  />
                  <ReferenceLine
                    y={2.0}
                    stroke="#BE123C"
                    strokeDasharray="4 4"
                    label={{
                      value: '+2.0°C',
                      position: 'right',
                      fill: '#BE123C',
                      fontSize: 10,
                    }}
                  />
                  <Bar
                    dataKey="oni"
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={(data: unknown) => {
                      const entry = data as { id?: string; payload?: { id?: string } } | null;
                      const id = entry?.id ?? entry?.payload?.id;
                      if (typeof id === 'string') {
                        handleSelectChartPoint(id);
                      }
                    }}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={INTENSITY_COLOR[entry.intensity]}
                        stroke={entry.id === focusedEventId ? '#18181B' : 'none'}
                        strokeWidth={entry.id === focusedEventId ? 2 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chronological Stream List */}
        {filteredEvents.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-[#F9F8F4] p-8 text-center">
            <p className="text-sm font-semibold text-zinc-900">
              {isFr
                ? 'Aucune alerte ne correspond à cette combinaison de filtres.'
                : 'No climate alert events match the selected intensity, zone, and horizon filters.'}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              {isFr
                ? 'Réinitialisez ou élargissez un critère pour réafficher le flux chronologique.'
                : 'Reset or broaden one filter to view the chronological El Niño alert stream.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172554]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isFr ? 'Afficher toute la chronologie' : 'Show full timeline'}</span>
            </button>
          </div>
        ) : (
          <ol
            aria-label={isFr ? 'Chronologie des alertes El Niño' : 'El Niño Alerts Timeline'}
            className="relative mt-8 space-y-5 border-l-2 border-zinc-200 pl-6 sm:pl-8"
          >
            {filteredEvents.map((ev) => {
              const intensityBadge = getIntensityBadge(ev.intensity);
              const phaseBadge = getPhaseBadge(ev.phase);
              const open = isExpanded(ev);
              const focused = focusedEventId === ev.id;

              return (
                <li
                  key={ev.id}
                  id={`timeline-node-${ev.id}`}
                  className="relative"
                >
                  {/* Geometric Timeline Node Indicator */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[31px] sm:-left-[39px] top-5 flex h-4 w-4 items-center justify-center rounded-xs border-2 border-white shadow-xs ${
                      ev.phase === 'active'
                        ? 'bg-rose-700 ring-2 ring-rose-300'
                        : ev.phase === 'upcoming'
                          ? 'bg-[#1E3A8A]'
                          : 'bg-zinc-600'
                    }`}
                  />

                  <article
                    className={`rounded-xl border transition-colors ${
                      ev.phase === 'active'
                        ? 'border-rose-300 bg-[#FFF8F8]'
                        : focused
                          ? 'border-[#1E3A8A] bg-[#F9FAFE]'
                          : 'border-zinc-200 bg-[#F9F8F4]'
                    } p-4 sm:p-5`}
                  >
                    {/* Header Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900 tabular-nums">
                          {isFr ? ev.periodLabelFr : ev.periodLabelEn}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${phaseBadge.cls}`}
                        >
                          {ev.phase === 'active' && (
                            <Radio className="h-3 w-3 animate-pulse" aria-hidden="true" />
                          )}
                          <span>{phaseBadge.label}</span>
                        </span>
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10.5px] font-semibold ${intensityBadge.cls}`}
                        >
                          {intensityBadge.label} · ONI +{ev.oniPeakC.toFixed(1)} °C
                        </span>
                        <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[10.5px] font-medium text-zinc-700">
                          {ev.iodState}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-medium text-zinc-500">
                          {ev.agency}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFocusedEventId((prev) => (prev === ev.id ? '' : ev.id))
                          }
                          aria-expanded={open}
                          className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                        >
                          <span>
                            {open
                              ? isFr
                                ? 'Réduire'
                                : 'Collapse'
                              : isFr
                                ? 'Détails'
                                : 'Details'}
                          </span>
                          {open ? (
                            <ChevronUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-3 w-3" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Event Title & Geographic Tag */}
                    <h3 className="mt-2.5 font-serif text-lg font-semibold leading-snug text-zinc-900">
                      {isFr ? ev.titleFr : ev.titleEn}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] font-medium text-[#1E3A8A]">
                      {isFr ? ev.zoneTagFr : ev.zoneTagEn}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      {isFr ? ev.summaryFr : ev.summaryEn}
                    </p>

                    {/* Expandable Impact Metrics & Early Action Trigger */}
                    {open && (
                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-zinc-200/80 pt-3.5 md:grid-cols-12">
                        <div className="md:col-span-7">
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                            {isFr
                              ? 'Indicateurs d’impact & anomalies clés'
                              : 'Key Impact Indicators & Anomalies'}
                          </p>
                          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                            {(isFr ? ev.impactMetricsFr : ev.impactMetricsEn).map((metric) => (
                              <li
                                key={metric}
                                className="rounded-md border border-zinc-200 bg-white px-2.5 py-2 font-mono text-[11px] font-medium text-zinc-800"
                              >
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:col-span-5">
                          <div className="flex h-full flex-col justify-between rounded-md border border-[#1E3A8A]/20 bg-white p-3">
                            <div>
                              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1E3A8A]">
                                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>
                                  {isFr
                                    ? 'Protocole & déclencheur d’action'
                                    : 'Action Protocol & Trigger'}
                                </span>
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-zinc-700">
                                {isFr ? ev.actionTriggerFr : ev.actionTriggerEn}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
