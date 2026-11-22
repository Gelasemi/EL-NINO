import { useState } from 'react';
import { Compass, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { MadagascarProvinceZone } from '../data/ensoData';
import { ResilientImage } from './ResilientImage';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedMadagascarProvinces } from '../i18n/localizedCoreData';

export function IndianOceanMadagascar() {
  const { lang, t, ui } = useLanguage();
  const [selectedId, setSelectedId] = useState<MadagascarProvinceZone['id']>('toliara');

  const provinces = getLocalizedMadagascarProvinces(lang);
  const activeZone = provinces.find((z) => z.id === selectedId) ?? provinces[0];

  return (
    <section id="madagascar" className="border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">
            {t.sections.s02Eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {t.sections.s02Title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-zinc-600">
            {t.sections.s02Lead}
          </p>
        </div>

        {/* Interactive Madagascar Map + Ex-Province Detail Panel */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Interactive SVG Map */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 lg:col-span-5">
            <div className="flex items-center justify-between gap-2 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  {ui.madagascar.mapHeading}
                </h3>
                <p className="text-xs text-zinc-500">
                  {ui.madagascar.mapSubtitle}
                </p>
              </div>
              <Compass className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            </div>

            <div className="relative overflow-hidden rounded-md border border-zinc-200 bg-[#F4F7FA] p-4">
              <svg
                viewBox="0 0 340 460"
                role="img"
                aria-label={ui.madagascar.mapAria}
                className="mx-auto h-auto max-h-[420px] w-full"
              >
                {/* Ocean Grid Lines */}
                <line x1="0" y1="120" x2="340" y2="120" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="3 3" />
                <line x1="0" y1="240" x2="340" y2="240" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="3 3" />
                <line x1="0" y1="360" x2="340" y2="360" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="3 3" />
                <line x1="170" y1="0" x2="170" y2="460" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="3 3" />

                {/* Antsiranana (Nord) */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={ui.madagascar.zoneNames.nord}
                  onClick={() => setSelectedId('antsiranana')}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId('antsiranana')}
                  className="cursor-pointer focus:outline-none"
                >
                  <path
                    d="M198,28 L216,42 L222,74 L224,104 L182,110 L166,85 L180,55 Z"
                    fill={selectedId === 'antsiranana' ? '#1E3A8A' : '#93C5FD'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors duration-150 hover:opacity-90"
                  />
                  <text
                    x="198"
                    y="78"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={selectedId === 'antsiranana' ? '#FFFFFF' : '#0F172A'}
                  >
                    {ui.madagascar.zoneNames.nord}
                  </text>
                </g>

                {/* Mahajanga (Nord-Ouest) */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={ui.madagascar.zoneNames.nordOuest}
                  onClick={() => setSelectedId('mahajanga')}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId('mahajanga')}
                  className="cursor-pointer focus:outline-none"
                >
                  <path
                    d="M166,85 L182,110 L176,160 L152,205 L112,216 L98,175 L125,130 Z"
                    fill={selectedId === 'mahajanga' ? '#D97706' : '#FDE68A'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors duration-150 hover:opacity-90"
                  />
                  <text
                    x="140"
                    y="165"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={selectedId === 'mahajanga' ? '#FFFFFF' : '#451A03'}
                  >
                    {ui.madagascar.zoneNames.nordOuest}
                  </text>
                </g>

                {/* Antananarivo & Toamasina (Centre et Est) */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={ui.madagascar.zoneNames.centreEst}
                  onClick={() => setSelectedId('centre-est')}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId('centre-est')}
                  className="cursor-pointer focus:outline-none"
                >
                  <path
                    d="M182,110 L224,104 L214,172 L198,248 L150,256 L112,216 L152,205 L176,160 Z"
                    fill={selectedId === 'centre-est' ? '#B45309' : '#FCD34D'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors duration-150 hover:opacity-90"
                  />
                  <text
                    x="173"
                    y="204"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={selectedId === 'centre-est' ? '#FFFFFF' : '#451A03'}
                  >
                    {ui.madagascar.zoneNames.centreEst}
                  </text>
                </g>

                {/* Fianarantsoa (Grand Sud-Est et Hautes Terres Sud) */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={ui.madagascar.zoneNames.sudEst}
                  onClick={() => setSelectedId('fianarantsoa')}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId('fianarantsoa')}
                  className="cursor-pointer focus:outline-none"
                >
                  <path
                    d="M150,256 L198,248 L184,322 L152,338 L130,302 L126,270 Z"
                    fill={selectedId === 'fianarantsoa' ? '#C2410C' : '#FDBA74'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors duration-150 hover:opacity-90"
                  />
                  <text
                    x="162"
                    y="296"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={selectedId === 'fianarantsoa' ? '#FFFFFF' : '#431407'}
                  >
                    {ui.madagascar.zoneNames.sudEst}
                  </text>
                </g>

                {/* Toliara (Grand Sud et Sud-Ouest) */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={ui.madagascar.zoneNames.grandSud}
                  onClick={() => setSelectedId('toliara')}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId('toliara')}
                  className="cursor-pointer focus:outline-none"
                >
                  <path
                    d="M112,216 L150,256 L126,270 L130,302 L152,338 L164,376 L132,414 L92,402 L72,340 L84,268 Z"
                    fill={selectedId === 'toliara' ? '#9F1239' : '#FDA4AF'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors duration-150 hover:opacity-90"
                  />
                  <text
                    x="112"
                    y="336"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill={selectedId === 'toliara' ? '#FFFFFF' : '#4C0519'}
                  >
                    {ui.madagascar.zoneNames.grandSud}
                  </text>
                  <text
                    x="112"
                    y="350"
                    textAnchor="middle"
                    fontSize="9"
                    fill={selectedId === 'toliara' ? '#FFE4E6' : '#881337'}
                  >
                    (Androy / Toliara)
                  </text>
                </g>

                {/* Cyclone Shift Annotation */}
                <g transform="translate(220, 175)">
                  <path
                    d="M8,18 C32,8 55,14 75,36"
                    fill="none"
                    stroke="#1E3A8A"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                  <polygon points="71,38 79,41 77,32" fill="#1E3A8A" />
                  <text x="8" y="6" fontSize="8.5" fontWeight="600" fill="#1E3A8A">
                    SWIOCOF-15
                  </text>
                  <text x="2" y="54" fontSize="8.5" fill="#334155">
                    {ui.madagascar.eastShiftNote}
                  </text>
                </g>
              </svg>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span>{ui.madagascar.legendCritical} · {ui.madagascar.legendWatch}</span>
              <span className="font-mono">SWIOCOF-15</span>
            </div>
          </div>

          {/* Zone Tabs + Detail Panel */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            {/* Segmented Zone Selector */}
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 bg-white p-1.5">
              {provinces.map((zone) => {
                const active = zone.id === selectedId;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedId(zone.id)}
                    className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    {zone.zoneLabel}
                  </button>
                );
              })}
            </div>

            {/* Active Province Card */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500">
                    {activeZone.exProvince}
                    <span aria-hidden="true" className="mx-2 text-zinc-300">·</span>
                    {activeZone.keyPrograms}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-zinc-900">
                    {activeZone.zoneLabel}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold ${
                    activeZone.severityLevel === 'Critique'
                      ? 'text-rose-700'
                      : activeZone.severityLevel === 'Élevé'
                        ? 'text-amber-700'
                        : 'text-[#1E3A8A]'
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  {ui.madagascar.severityLabels[activeZone.severityLevel]}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-1 gap-4 border-b border-zinc-100 pb-5 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-medium text-zinc-500">{ui.madagascar.regionsConcerned}</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900">
                    {activeZone.regions.join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">{ui.madagascar.rainfallSignal}</dt>
                  <dd className="mt-1 text-sm font-medium text-zinc-800">
                    {activeZone.rainfallAnomaly}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-zinc-500">{ui.madagascar.thermalAnomaly}</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-amber-700 tabular-nums">
                    {activeZone.tempAnomaly}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <h4 className="text-xs font-semibold text-zinc-500">
                  {ui.madagascar.majorRisk}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">
                  {activeZone.riskSummary}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  {ui.madagascar.emergencyMeasures}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {activeZone.measures.map((measure) => (
                    <li
                      key={measure}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-700"
                    >
                      <span className="mt-1.5 font-mono text-xs text-zinc-400" aria-hidden="true">
                        —
                      </span>
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cyclone Bulletin Summary */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h4 className="text-sm font-semibold text-zinc-900">
                {ui.madagascar.cycloneTag}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {ui.madagascar.cycloneText}
              </p>
            </div>
          </div>
        </div>

        {/* Documentary Field Photography Pair */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <ResilientImage
            src="/src/assets/images/madagascar_grand_sud_1794612906612.jpg"
            alt={ui.madagascar.fig2Alt}
            caption={ui.madagascar.fig2Caption}
          />
          <ResilientImage
            src="/src/assets/images/madagascar_rice_terraces_1794612905190.jpg"
            alt={ui.madagascar.fig3Alt}
            caption={ui.madagascar.fig3Caption}
          />
        </div>
      </div>
    </section>
  );
}
