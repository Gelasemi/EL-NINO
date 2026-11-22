import { useMemo, useState } from 'react';
import {
  CheckSquare,
  Download,
  ExternalLink,
  MapPin,
  Search,
  Square,
  CalendarClock,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  DISTRICT_CHOROPLETH_DATA,
  type AtlasGroupId,
  type AtlasRegionEntry,
} from '../data/ensoData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedAtlas23Regions,
  getLocalizedAtlas7Domains,
  getLocalizedAtlas9Sectors,
  getLocalizedAtlasDeliverables,
  getLocalizedAtlasExternalSources,
  getLocalizedMonthlyIndicators,
  getLocalizedPreparedness5Axes,
  getLocalizedTemporalOutlook,
} from '../i18n/localizedAtlasPlanData';

type AtlasTab = 'regions-districts' | 'temporal-sectors' | 'plan-indicators' | 'deliverables';
type GroupFilter = 'all' | AtlasGroupId;

const GROUP_FILTERS: { id: GroupFilter; count: number }[] = [
  { id: 'all', count: 23 },
  { id: 'grand-sud', count: 6 },
  { id: 'sud-est-est', count: 5 },
  { id: 'nord-nord-ouest', count: 6 },
  { id: 'hautes-terres', count: 6 },
];

const MAPPED_DISTRICT_LOOKUP = new Set(
  DISTRICT_CHOROPLETH_DATA.flatMap((d) => [
    d.district.toLowerCase(),
    d.geoBoundariesName.toLowerCase(),
  ]),
);

function getRiskVisual(
  category: AtlasRegionEntry['riskCategory'],
  labels: { drought: string; mixed: string; flood: string },
) {
  if (category === 'drought') {
    return {
      colorClass: 'text-[#DC2626]',
      dotClass: 'bg-[#DC2626]',
      shortLabel: labels.drought,
    };
  }
  if (category === 'mixed') {
    return {
      colorClass: 'text-[#D97706]',
      dotClass: 'bg-[#D97706]',
      shortLabel: labels.mixed,
    };
  }
  return {
    colorClass: 'text-[#2563EB]',
    dotClass: 'bg-[#2563EB]',
    shortLabel: labels.flood,
  };
}

export function AtlasMadagascar() {
  const { lang, t, ui } = useLanguage();
  const [activeTab, setActiveTab] = useState<AtlasTab>('regions-districts');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions23 = useMemo(() => getLocalizedAtlas23Regions(lang), [lang]);
  const domains7 = useMemo(() => getLocalizedAtlas7Domains(lang), [lang]);
  const sectors9 = useMemo(() => getLocalizedAtlas9Sectors(lang), [lang]);
  const temporalOutlook = useMemo(() => getLocalizedTemporalOutlook(lang), [lang]);
  const preparedness5 = useMemo(() => getLocalizedPreparedness5Axes(lang), [lang]);
  const monthlyIndicators9 = useMemo(() => getLocalizedMonthlyIndicators(lang), [lang]);
  const deliverables7 = useMemo(() => getLocalizedAtlasDeliverables(lang), [lang]);
  const externalSources = useMemo(() => getLocalizedAtlasExternalSources(lang), [lang]);

  const totalPreparednessActions = useMemo(
    () => preparedness5.reduce((acc, axis) => acc + axis.actions.length, 0),
    [preparedness5],
  );

  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({
    'securite-alimentaire-0': true,
    'alerte-precoce-0': true,
  });

  const checkedActionCount = useMemo(
    () => Object.values(checkedActions).filter(Boolean).length,
    [checkedActions],
  );

  const filteredRegions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return regions23.filter((r) => {
      if (groupFilter !== 'all' && r.group !== groupFilter) return false;
      if (!q) return true;
      return (
        r.region.toLowerCase().includes(q) ||
        r.dominantRisk.toLowerCase().includes(q) ||
        r.possibleEffects.toLowerCase().includes(q) ||
        r.priorityDistricts.some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [regions23, groupFilter, searchQuery]);

  const handleJumpToMapDistrict = (districtName: string) => {
    window.dispatchEvent(
      new CustomEvent('select-madagascar-district', { detail: { district: districtName } }),
    );
    const mlSection = document.getElementById('modele-ml');
    if (mlSection) {
      mlSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownload23RegionsCsv = () => {
    const header = ui.atlas.csvHeaders.join(',');
    const rows = regions23.map((r) =>
      [
        r.number,
        `"${r.region.replace(/"/g, '""')}"`,
        `"${r.groupLabel.replace(/"/g, '""')}"`,
        `"${r.priorityRank.replace(/"/g, '""')}"`,
        `"${r.dominantRisk.replace(/"/g, '""')}"`,
        `"${r.vigilanceLevel.replace(/"/g, '""')}"`,
        `"${r.possibleEffects.replace(/"/g, '""')}"`,
        `"${r.priorityDistricts.join('; ')}"`,
      ].join(','),
    );
    const blob = new Blob([`\uFEFF${header}\n${rows.join('\n')}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `atlas_madagascar_23_regions_elnino_2027_2028_${lang}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullAtlasJson = () => {
    const payload = {
      title: t.sections.s06Title,
      language: lang,
      note: '23 official regions · 119 ADM2 districts',
      references: [
        'Météo Madagascar (14 November 2026)',
        'OMM / WMO / SWIOCOF-15 (1 October 2026)',
        'FEWS NET — Lean Season 2027–2028',
      ],
      impact_domains: domains7,
      matrix_23_regions: regions23,
      temporal_outlook_2027_2028: temporalOutlook,
      economic_sectors: sectors9,
      preparedness_5_axes: preparedness5,
      monthly_indicators_9: monthlyIndicators9,
      deliverables_119_districts: deliverables7,
      official_sources: externalSources,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `atlas_national_madagascar_elnino_2027_2028_${lang}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const togglePreparednessAction = (key: string) => {
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const outlook2027 = temporalOutlook.filter((w) => w.year === 2027);
  const outlook2028 = temporalOutlook.filter((w) => w.year === 2028);

  return (
    <section id="atlas-madagascar" className="border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">
            {t.sections.s06Eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {t.sections.s06Title}
          </h2>
          <p className="mt-3 max-w-[74ch] text-base leading-relaxed text-zinc-600">
            {t.sections.s06Lead}
          </p>

          {/* 3-Column Epistemological & Methodological Reference Strip */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="font-mono text-[11px] font-semibold text-[#1E3A8A]">
                1 · {ui.atlas.pillar1Eyebrow} · {ui.atlas.pillar1Title}
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                {ui.atlas.pillar1Body}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="font-mono text-[11px] font-semibold text-amber-800">
                2 · {ui.atlas.pillar2Eyebrow} · {ui.atlas.pillar2Title}
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                {ui.atlas.pillar2Body}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="font-mono text-[11px] font-semibold text-rose-700">
                3 · {ui.atlas.pillar3Eyebrow} · {ui.atlas.pillar3Title}
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                {ui.atlas.pillar3Body}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div
            role="tablist"
            aria-label={t.sections.s06Title}
            className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 bg-white p-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'regions-districts'}
              onClick={() => setActiveTab('regions-districts')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'regions-districts'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {ui.atlas.tabs.regions}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'temporal-sectors'}
              onClick={() => setActiveTab('temporal-sectors')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'temporal-sectors'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {ui.atlas.tabs.temporal} &amp; {ui.atlas.tabs.sectors}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'plan-indicators'}
              onClick={() => setActiveTab('plan-indicators')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'plan-indicators'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {ui.atlas.tabs.preparedness}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'deliverables'}
              onClick={() => setActiveTab('deliverables')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'deliverables'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {ui.atlas.deliverablesTitle}
            </button>
          </div>

          {/* TAB 1: 23 REGIONS & PRIORITY DISTRICTS */}
          {activeTab === 'regions-districts' && (
            <div className="mt-6 space-y-5">
              {/* Filter Bar + Search + CSV Export */}
              <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {GROUP_FILTERS.map((f) => {
                    const active = groupFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setGroupFilter(f.id)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          active
                            ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                            : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        {ui.atlas.groupFilters[f.id]}{' '}
                        <span className="font-mono opacity-80 tabular-nums">({f.count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-1 sm:w-60 sm:flex-none">
                    <Search
                      className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      aria-label={ui.atlas.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={ui.atlas.searchPlaceholder}
                      className="w-full rounded-md border border-zinc-300 bg-[#F9F8F4] py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload23RegionsCsv}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                    {ui.atlas.exportCsvBtn}
                  </button>
                </div>
              </div>

              {/* Instruction Hint for Interactive Google Maps Sync */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                <span>
                  <strong className="font-mono text-zinc-900 tabular-nums">{filteredRegions.length}</strong> / 23 {ui.common.regions}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                  {ui.districtStudio.mapCardSubtitle}
                </span>
              </div>

              {/* 23-Region Matrix Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
                <table className="w-full min-w-[880px] border-collapse text-left text-xs">
                  <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                    <tr>
                      <th className="w-12 px-3.5 py-3 text-center">{ui.atlas.tableHeaders.num}</th>
                      <th className="w-40 px-4 py-3">{ui.atlas.tableHeaders.regionGroup}</th>
                      <th className="w-44 px-4 py-3">{ui.atlas.vigilancePrefix}</th>
                      <th className="w-44 px-4 py-3">{ui.atlas.tableHeaders.dominantRisk}</th>
                      <th className="px-4 py-3">{ui.atlas.tableHeaders.effects}</th>
                      <th className="w-72 px-4 py-3">{ui.atlas.tableHeaders.priorityDistricts}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {filteredRegions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                          {searchQuery} — 0 / 23
                        </td>
                      </tr>
                    ) : (
                      filteredRegions.map((row) => {
                        const riskVis = getRiskVisual(row.riskCategory, ui.atlas.riskVisualLabels);
                        return (
                          <tr key={row.number} className="align-top hover:bg-zinc-50/70">
                            <td className="px-3.5 py-3.5 text-center font-mono font-semibold text-zinc-500 tabular-nums">
                              {String(row.number).padStart(2, '0')}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="block text-sm font-semibold text-zinc-900">
                                {row.region}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-zinc-500">
                                {row.groupLabel}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="block font-semibold text-zinc-900">
                                {row.priorityRank}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-zinc-600">
                                {ui.atlas.vigilancePrefix} {row.vigilanceLevel}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 font-semibold ${riskVis.colorClass}`}>
                                <span
                                  aria-hidden="true"
                                  className={`inline-block h-2 w-2 rounded-xs ${riskVis.dotClass}`}
                                />
                                {riskVis.shortLabel}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-zinc-600">
                                {row.dominantRisk}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 leading-relaxed text-zinc-700">
                              {row.possibleEffects}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex flex-wrap gap-1.5">
                                {row.priorityDistricts.map((dist) => {
                                  const isMapped = MAPPED_DISTRICT_LOOKUP.has(dist.toLowerCase());
                                  if (isMapped) {
                                    return (
                                      <button
                                        key={dist}
                                        type="button"
                                        onClick={() => handleJumpToMapDistrict(dist)}
                                        title={dist}
                                        className="inline-flex items-center gap-1 rounded border border-[#1E3A8A]/30 bg-[#F9F8F4] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1E3A8A] transition-colors hover:border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                                      >
                                        <MapPin className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                                        {dist}
                                      </button>
                                    );
                                  }
                                  return (
                                    <span
                                      key={dist}
                                      className="inline-block rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600"
                                    >
                                      {dist}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPORAL OUTLOOK 2027-2028 + 9 SECTORS + 7 DOMAINS */}
          {activeTab === 'temporal-sectors' && (
            <div className="mt-6 space-y-8">
              {/* 2027 vs 2028 Windows */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 bg-white p-6">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <CalendarClock className="h-4 w-4 text-amber-800" aria-hidden="true" />
                    <h3 className="font-serif text-xl font-semibold text-zinc-900">
                      {ui.atlas.temporal2027Header}
                    </h3>
                  </div>
                  <div className="mt-4 divide-y divide-zinc-100">
                    {outlook2027.map((item) => (
                      <div key={item.period} className="py-3.5 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-amber-800">
                            {item.period}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900">
                            {item.phaseLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                          {item.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-6">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <CalendarClock className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <h3 className="font-serif text-xl font-semibold text-zinc-900">
                      {ui.atlas.temporal2028Header}
                    </h3>
                  </div>
                  <div className="mt-4 divide-y divide-zinc-100">
                    {outlook2028.map((item, idx) => (
                      <div key={item.period} className="py-3.5 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span
                            className={`font-mono text-xs font-semibold ${
                              idx === 0 ? 'text-rose-700' : 'text-[#1E3A8A]'
                            }`}
                          >
                            {item.period}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900">
                            {item.phaseLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                          {item.summary}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 7 Core Climate Domains Compact Reference */}
                  <div className="mt-6 border-t border-zinc-200 pt-4">
                    <h4 className="text-xs font-semibold text-zinc-900">
                      {ui.atlas.domainsTitle}
                    </h4>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {domains7.map((dom) => (
                        <div
                          key={dom.domain}
                          className="rounded border border-zinc-200 bg-[#F9F8F4] px-3 py-2 text-xs"
                        >
                          <span className="font-semibold text-zinc-900">{dom.domain} : </span>
                          <span className="text-zinc-600">{dom.consequences}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 9 Economic & Social Sectors Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-5 py-4">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {ui.atlas.sectorsTitle}
                  </h3>
                </div>
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-[#F9F8F4] text-xs font-semibold text-zinc-700">
                    <tr>
                      <th className="w-44 px-5 py-3">{ui.atlas.sectorsColSector}</th>
                      <th className="px-5 py-3">{ui.atlas.sectorsColEffects}</th>
                      <th className="w-72 px-5 py-3">{ui.atlas.sectorsColZones}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {sectors9.map((row) => (
                      <tr key={row.sector} className="align-top hover:bg-zinc-50/70">
                        <td className="px-5 py-3.5 font-semibold text-zinc-900">{row.sector}</td>
                        <td className="px-5 py-3.5 leading-relaxed text-zinc-700">
                          {row.consequences}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#1E3A8A]">
                          {row.priorityZones}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 5 PREPAREDNESS AXES + 9 MONTHLY INDICATORS + SOURCES */}
          {activeTab === 'plan-indicators' && (
            <div className="mt-6 space-y-8">
              {/* 5 Axes Interactive Checklist */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-zinc-900">
                        {ui.atlas.checklistTitle}
                      </h3>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#1E3A8A] tabular-nums">
                    {checkedActionCount} / {totalPreparednessActions} {ui.atlas.checklistCounter}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {preparedness5.map((axis) => (
                    <div
                      key={axis.id}
                      className="flex flex-col justify-between rounded-md border border-zinc-200 bg-[#F9F8F4] p-4"
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
                          <span className="font-mono text-[11px] font-semibold text-[#1E3A8A]">
                            {axis.axisNumber}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {ui.atlas.leadPrefix} {axis.leadAgencies}
                          </span>
                        </div>
                        <h4 className="mt-2 font-serif text-base font-semibold text-zinc-900">
                          {axis.title}
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {axis.actions.map((act, idx) => {
                            const key = `${axis.id}-${idx}`;
                            const isChecked = !!checkedActions[key];
                            return (
                              <li key={key}>
                                <button
                                  type="button"
                                  onClick={() => togglePreparednessAction(key)}
                                  className="flex w-full items-start gap-2 rounded border border-zinc-200 bg-white px-2.5 py-2 text-left text-xs transition-colors hover:border-zinc-300"
                                >
                                  {isChecked ? (
                                    <CheckSquare
                                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <Square
                                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span
                                    className={
                                      isChecked ? 'text-zinc-500 line-through' : 'text-zinc-800'
                                    }
                                  >
                                    {act}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9 Monthly Indicators Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-5 py-4">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {ui.atlas.indicatorsTitle}
                  </h3>
                </div>
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-[#F9F8F4] text-xs font-semibold text-zinc-700">
                    <tr>
                      <th className="w-48 px-5 py-3">{ui.atlas.indicatorsColInd}</th>
                      <th className="px-5 py-3">{ui.atlas.indicatorsColRole}</th>
                      <th className="w-40 px-5 py-3">{ui.atlas.indicatorsColCadence}</th>
                      <th className="w-52 px-5 py-3">{ui.atlas.indicatorsColSource}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {monthlyIndicators9.map((ind) => (
                      <tr key={ind.indicator} className="align-top hover:bg-zinc-50/70">
                        <td className="px-5 py-3 font-mono text-xs font-semibold text-zinc-900">
                          {ind.indicator}
                        </td>
                        <td className="px-5 py-3 text-zinc-700">{ind.utility}</td>
                        <td className="px-5 py-3 text-xs text-zinc-600">{ind.cadence}</td>
                        <td className="px-5 py-3 font-mono text-xs text-[#1E3A8A]">
                          {ind.sourceRef}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 5 Official Surveillance Portals */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {ui.atlas.sourcesTitle}
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {externalSources.map((src) => (
                    <a
                      key={src.url}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-[#1E3A8A]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-zinc-900 group-hover:text-[#1E3A8A]">
                            {src.name}
                          </span>
                          <ExternalLink
                            className="h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-[#1E3A8A]"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">{src.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 7 ATLAS DELIVERABLES & FULL JSON EXPORT */}
          {activeTab === 'deliverables' && (
            <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5">
                <div className="flex items-start gap-2.5">
                  <Layers className="mt-1 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-zinc-900">
                      {ui.atlas.deliverablesTitle}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                      {ui.atlas.pillar2Title} · {ui.atlas.pillar2Body}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadFullAtlasJson}
                  className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 whitespace-nowrap shrink-0"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  JSON (Atlas)
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deliverables7.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4"
                  >
                    <span className="font-mono text-xs font-semibold text-[#1E3A8A]">
                      {item.step}
                    </span>
                    <h4 className="mt-1.5 text-sm font-semibold text-zinc-900">{item.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
