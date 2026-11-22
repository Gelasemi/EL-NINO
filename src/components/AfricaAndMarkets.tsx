import { useState } from 'react';
import { TrendingUp, Globe2 } from 'lucide-react';
import type { AfricaBlocImpact } from '../data/ensoData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedAfricaBlocs,
  getLocalizedRicePrices,
  getLocalizedCommodities,
} from '../i18n/localizedCoreData';

type BlocFilter = 'all' | AfricaBlocImpact['category'];

export function AfricaAndMarkets() {
  const { lang, t, ui } = useLanguage();
  const [filter, setFilter] = useState<BlocFilter>('all');
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number>(6);

  const blocs = getLocalizedAfricaBlocs(lang);
  const riceTrajectory = getLocalizedRicePrices(lang);
  const commodities = getLocalizedCommodities(lang);

  const filterOptions: { id: BlocFilter; label: string }[] = [
    { id: 'all', label: ui.africa.filters.all },
    { id: 'sadc', label: ui.africa.filters.sadc },
    { id: 'comesa', label: ui.africa.filters.comesa },
    { id: 'sahel', label: ui.africa.filters.sahel },
    { id: 'nord-centrale', label: ui.africa.filters['nord-centrale'] },
  ];

  const visibleBlocs =
    filter === 'all' ? blocs : blocs.filter((b) => b.category === filter);

  const minPrice = 2400;
  const maxPrice = 3350;
  const chartLeft = 56;
  const chartRight = 612;
  const chartTop = 24;
  const chartBottom = 184;

  const getX = (idx: number) =>
    chartLeft + (idx / (riceTrajectory.length - 1)) * (chartRight - chartLeft);
  const getY = (price: number) =>
    chartBottom - ((price - minPrice) / (maxPrice - minPrice)) * (chartBottom - chartTop);

  const polylinePoints = riceTrajectory.map((pt, idx) => `${getX(idx)},${getY(pt.priceMGA)}`).join(' ');
  const areaPoints = `${chartLeft},${chartBottom} ${polylinePoints} ${chartRight},${chartBottom}`;
  const activePoint = riceTrajectory[hoveredMonthIdx] ?? riceTrajectory[6];

  const localeTag = lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-US' : 'sw-KE';

  return (
    <section id="afrique" className="border-b border-zinc-200 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading + Filter Controls */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-wider text-zinc-500">
              {t.sections.s03Eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {t.sections.s03Title}
            </h2>
            <p className="mt-3 max-w-[66ch] text-base leading-relaxed text-zinc-600">
              {t.sections.s03Lead}
            </p>
          </div>

          <div
            role="group"
            aria-label={ui.africa.filters.all}
            className="flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-1 self-start lg:self-auto"
          >
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                aria-pressed={filter === opt.id}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  filter === opt.id
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Africa Blocs Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {visibleBlocs.map((bloc) => (
            <article
              key={bloc.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6"
            >
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {bloc.regionOrBloc}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-medium text-amber-800">
                    {bloc.severityLabel}
                  </span>
                </div>

                <p className="mt-2.5 text-xs font-medium text-zinc-500">
                  {ui.africa.perimeterLabel} {bloc.countries}
                </p>

                <div className="mt-4 space-y-3 text-sm leading-relaxed">
                  <div>
                    <span className="font-semibold text-zinc-900">{ui.africa.climateSignalLabel} </span>
                    <span className="text-zinc-700">{bloc.climateSignal}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">{ui.africa.agriEnergyLabel} </span>
                    <span className="text-zinc-700">{bloc.economicAndFoodImpact}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-zinc-200/80 pt-3 text-sm leading-relaxed">
                <span className="font-semibold text-[#1E3A8A]">{ui.africa.emergencyMeasuresLabel} </span>
                <span className="text-zinc-700">{bloc.emergencyResponse}</span>
              </div>
            </article>
          ))}
        </div>

        {/* FEWS NET Rice Price Chart & Global Commodity Stress */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Interactive SVG Price Chart */}
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 lg:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold text-zinc-900">
                    {ui.africa.riceTitle}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {ui.africa.riceSubtitle}
                </p>
              </div>

              <div className="text-right">
                <div className="font-mono text-2xl font-semibold text-amber-800 tabular-nums">
                  {activePoint.priceMGA.toLocaleString(localeTag)} MGA/kg
                </div>
                <div className="font-mono text-xs text-zinc-500">
                  {activePoint.month}
                  {activePoint.note ? ` · ${activePoint.note}` : ''}
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-md border border-zinc-200 bg-white p-3">
              <svg
                viewBox="0 0 640 220"
                role="img"
                aria-label={ui.africa.riceChartAria}
                className="h-auto w-full"
              >
                <defs>
                  <linearGradient id="riceArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[2500, 2750, 3000, 3200].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={chartLeft}
                        y1={y}
                        x2={chartRight}
                        y2={y}
                        stroke={val === 3200 ? '#F59E0B' : '#E4E4E7'}
                        strokeWidth={val === 3200 ? '1.2' : '1'}
                        strokeDasharray={val === 3200 ? '4 3' : undefined}
                      />
                      <text
                        x={chartLeft - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                        fill={val === 3200 ? '#92400E' : '#71717A'}
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                <polygon points={areaPoints} fill="url(#riceArea)" />
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                <line
                  x1={getX(hoveredMonthIdx)}
                  y1={chartTop}
                  x2={getX(hoveredMonthIdx)}
                  y2={chartBottom}
                  stroke="#1E3A8A"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {riceTrajectory.map((pt, idx) => {
                  const cx = getX(idx);
                  const cy = getY(pt.priceMGA);
                  const isActive = idx === hoveredMonthIdx;
                  return (
                    <g
                      key={pt.month}
                      role="button"
                      tabIndex={0}
                      aria-label={`${pt.month} : ${pt.priceMGA} MGA/kg`}
                      onMouseEnter={() => setHoveredMonthIdx(idx)}
                      onFocus={() => setHoveredMonthIdx(idx)}
                      onClick={() => setHoveredMonthIdx(idx)}
                      className="cursor-pointer focus:outline-none"
                    >
                      <circle cx={cx} cy={cy} r={16} fill="transparent" />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? 6 : 4}
                        fill={isActive ? '#1E3A8A' : '#B45309'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={cx}
                        y={204}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={isActive ? '600' : '400'}
                        fill={isActive ? '#1E3A8A' : '#52525B'}
                      >
                        {pt.month.replace('202', '2')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="mt-2.5 text-xs text-zinc-500">{ui.africa.riceBaselineNote}</p>
          </div>

          {/* Global Commodity & Energy Stress List */}
          <div className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white lg:col-span-5">
            <div className="bg-[#F9F8F4] px-5 py-4">
              <h3 className="font-serif text-lg font-semibold text-zinc-900">
                {ui.africa.commoditiesTitle}
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                {ui.africa.commodityCol} · {ui.africa.pressureCol}
              </p>
            </div>
            {commodities.map((item) => (
              <div key={item.commodity} className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold text-zinc-900">{item.commodity}</h4>
                  <span className="font-mono text-xs text-zinc-500">{item.region}</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">{item.mechanism}</p>
                <p className="mt-2 text-xs font-medium text-amber-800">{item.marketPressure}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
