import { useState } from 'react';
import { ArrowLeftRight, Wind, Waves, CloudRain } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedMechanismSteps,
  getLocalizedEnsoComparison,
  getLocalizedGlobalEffects,
} from '../i18n/localizedCoreData';

type EnsoPhase = 'el-nino' | 'la-nina';

export function MechanismAndComparison() {
  const { lang, t, ui } = useLanguage();
  const [phase, setPhase] = useState<EnsoPhase>('el-nino');
  const [activeTable, setActiveTable] = useState<'comparison' | 'global'>('comparison');

  const isElNino = phase === 'el-nino';
  const steps = getLocalizedMechanismSteps(lang);
  const comparisonRows = getLocalizedEnsoComparison(lang);
  const globalEffects = getLocalizedGlobalEffects(lang);

  const formatRiskLabel = (risk: string) => {
    if (risk === 'Inondations') return ui.mechanism.riskLabels.flood;
    if (risk === 'Sécheresse') return ui.mechanism.riskLabels.drought;
    if (risk === 'Contraste thermique') return ui.mechanism.riskLabels.thermal;
    return risk;
  };

  return (
    <section id="mecanisme" className="border-b border-zinc-200 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-wider text-zinc-500">
              {t.sections.s01Eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {t.sections.s01Title}
            </h2>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-zinc-600">
              {t.sections.s01Lead}
            </p>
          </div>

          {/* Interactive Phase Selector */}
          <div
            role="group"
            aria-label={ui.mechanism.phaseSelectorAria}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-1 self-start lg:self-auto"
          >
            <button
              type="button"
              onClick={() => setPhase('el-nino')}
              aria-pressed={isElNino}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 ${
                isElNino
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              {ui.mechanism.elNinoTab}
            </button>
            <button
              type="button"
              onClick={() => setPhase('la-nina')}
              aria-pressed={!isElNino}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 ${
                !isElNino
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              {ui.mechanism.laNinaTab}
            </button>
          </div>
        </div>

        {/* Interactive Ocean-Atmosphere Cross Section + 3 Mechanism Steps */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* SVG Cross Section */}
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  {ui.mechanism.svgTitle}{' '}
                  <span className={isElNino ? 'text-amber-700' : 'text-[#1E3A8A]'}>
                    {isElNino ? ui.mechanism.elNinoStatusLabel : ui.mechanism.laNinaStatusLabel}
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  {isElNino ? ui.mechanism.svgSubtitleElNino : ui.mechanism.svgSubtitleLaNina}
                </p>
              </div>
              <span className="font-mono text-xs text-zinc-500 tabular-nums">
                120°E → 80°W
              </span>
            </div>

            <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
              <svg
                viewBox="0 0 720 340"
                role="img"
                aria-label={isElNino ? ui.mechanism.svgAriaElNino : ui.mechanism.svgAriaLaNina}
                className="h-auto w-full"
              >
                <defs>
                  <linearGradient id="warmPoolElNino" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.65" />
                    <stop offset="55%" stopColor="#D97706" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#B45309" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="warmPoolLaNina" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D97706" stopOpacity="0.88" />
                    <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="deepOcean" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>

                {/* Atmosphere Sky */}
                <rect x="0" y="0" width="720" height="175" fill="#F8FAFC" />

                {/* Convection / Storm Clouds */}
                <g
                  transform={`translate(${isElNino ? 360 : 120}, 34)`}
                  className="transition-transform duration-300"
                >
                  <path
                    d="M25,45 C12,45 5,35 12,24 C14,10 34,4 48,14 C58,4 82,8 88,22 C102,22 110,36 100,45 Z"
                    fill={isElNino ? '#475569' : '#334155'}
                  />
                  <line x1="35" y1="52" x2="29" y2="74" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="55" y1="52" x2="49" y2="78" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="75" y1="52" x2="69" y2="74" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="54" y="-6" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E293B">
                    {isElNino ? ui.mechanism.elNinoConvection : ui.mechanism.laNinaConvection}
                  </text>
                </g>

                {/* Trade Winds Arrows */}
                {isElNino ? (
                  <g>
                    <line x1="185" y1="125" x2="285" y2="125" stroke="#B45309" strokeWidth="2.5" strokeDasharray="6 4" />
                    <polygon points="285,120 297,125 285,130" fill="#B45309" />
                    <line x1="540" y1="125" x2="480" y2="125" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
                    <polygon points="480,121 470,125 480,129" fill="#64748B" />
                    <text x="360" y="148" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9A3412">
                      {ui.mechanism.elNinoTradeWinds}
                    </text>
                  </g>
                ) : (
                  <g>
                    <line x1="560" y1="120" x2="290" y2="120" stroke="#1E3A8A" strokeWidth="3.5" />
                    <polygon points="290,113 274,120 290,127" fill="#1E3A8A" />
                    <line x1="520" y1="138" x2="340" y2="138" stroke="#1D4ED8" strokeWidth="2.5" />
                    <polygon points="340,132 326,138 340,144" fill="#1D4ED8" />
                    <text x="425" y="106" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E3A8A">
                      {ui.mechanism.laNinaTradeWinds}
                    </text>
                  </g>
                )}

                {/* Deep Ocean Base */}
                <rect x="65" y="175" width="590" height="135" fill="url(#deepOcean)" />

                {/* Warm Surface Layer */}
                {isElNino ? (
                  <path
                    d="M65,175 L655,175 L655,232 C520,235 280,224 65,205 Z"
                    fill="url(#warmPoolElNino)"
                  />
                ) : (
                  <path
                    d="M65,175 L655,175 L655,186 C480,194 260,232 65,250 Z"
                    fill="url(#warmPoolLaNina)"
                  />
                )}

                {/* Thermocline Line */}
                {isElNino ? (
                  <path
                    d="M65,205 C280,224 520,235 655,232"
                    fill="none"
                    stroke="#FDE68A"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                ) : (
                  <path
                    d="M65,250 C260,232 480,194 655,186"
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                )}

                {/* Upwelling Arrows off Peru/Ecuador */}
                {isElNino ? (
                  <g>
                    <path d="M615,285 L615,248" stroke="#93C5FD" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="595" y1="238" x2="635" y2="238" stroke="#FEF3C7" strokeWidth="2" />
                    <text x="530" y="274" textAnchor="middle" fontSize="10.5" fontWeight="500" fill="#E2E8F0">
                      {ui.mechanism.elNinoUpwelling}
                    </text>
                  </g>
                ) : (
                  <g>
                    <path d="M615,290 C615,250 615,220 605,195" fill="none" stroke="#60A5FA" strokeWidth="3" />
                    <polygon points="600,198 605,184 612,196" fill="#60A5FA" />
                    <text x="520" y="274" textAnchor="middle" fontSize="10.5" fontWeight="500" fill="#BFDBFE">
                      {ui.mechanism.laNinaUpwelling}
                    </text>
                  </g>
                )}

                {/* West Landmass (Indonesia / Australia) */}
                <path d="M0,155 L65,165 L65,310 L0,310 Z" fill="#D6D3D1" />
                <text x="32" y="216" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#1C1917">
                  {ui.mechanism.westAsiaLabel}
                </text>

                {/* East Landmass (Peru / Ecuador) */}
                <path d="M655,152 L720,145 L720,310 L655,310 Z" fill="#D6D3D1" />
                <text x="688" y="216" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#1C1917">
                  {ui.mechanism.eastPeruLabel}
                </text>

                {/* Bottom Coordinates */}
                <rect x="0" y="310" width="720" height="30" fill="#F1F5F9" />
                <text x="72" y="329" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#475569">
                  {ui.mechanism.lonWest}
                </text>
                <text x="360" y="329" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#475569">
                  {ui.mechanism.lonCenter}
                </text>
                <text x="648" y="329" textAnchor="end" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#475569">
                  {ui.mechanism.lonEast}
                </text>
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-2.5 rounded-md border border-zinc-200 bg-white p-3">
                <Wind className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{ui.mechanism.summaryTradeWinds}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {isElNino ? ui.mechanism.elNinoTradeWinds : ui.mechanism.laNinaTradeWinds}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-md border border-zinc-200 bg-white p-3">
                <Waves className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{ui.mechanism.summarySurfaceWater}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {isElNino ? ui.mechanism.elNinoWarmWater : ui.mechanism.laNinaColdWater}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-md border border-zinc-200 bg-white p-3">
                <CloudRain className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{ui.mechanism.summaryRainStorms}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {isElNino ? ui.mechanism.elNinoConvection : ui.mechanism.laNinaConvection}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Mechanism Steps */}
          <div className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white lg:col-span-5">
            {steps.map((step) => (
              <div key={step.index} className="p-5 sm:p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-zinc-400 tabular-nums">
                    {step.index}.
                  </span>
                  <h3 className="text-base font-semibold text-zinc-900">{step.title}</h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
                  {isElNino ? step.elNinoDetail : step.laNinaDetail}
                </p>
              </div>
            ))}

            <div className="bg-[#F9F8F4] p-5 sm:p-6">
              <p className="text-xs font-semibold text-zinc-900">
                {ui.mechanism.natureMedTag}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {ui.mechanism.natureMedText}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison & Global Regional Consequences Table */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              <h3 className="font-serif text-xl font-semibold text-zinc-900">
                {ui.mechanism.tableTitle}
              </h3>
            </div>

            <div
              role="tablist"
              aria-label={ui.mechanism.tableTitle}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTable === 'comparison'}
                onClick={() => setActiveTable('comparison')}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTable === 'comparison'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {ui.mechanism.tabCompare}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTable === 'global'}
                onClick={() => setActiveTable('global')}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTable === 'global'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {ui.mechanism.tabGlobal}
              </button>
            </div>
          </div>

          {activeTable === 'comparison' ? (
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="border-b border-zinc-200 bg-[#F9F8F4] text-xs font-semibold text-zinc-700">
                  <tr>
                    <th className="w-1/4 px-5 py-3.5">{ui.mechanism.criterionCol}</th>
                    <th className="w-[37.5%] px-5 py-3.5 text-amber-800">{ui.mechanism.elNinoCol}</th>
                    <th className="w-[37.5%] px-5 py-3.5 text-[#1E3A8A]">{ui.mechanism.laNinaCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {comparisonRows.map((row) => (
                    <tr key={row.criterion} className="align-top hover:bg-zinc-50/70">
                      <td className="px-5 py-4 font-semibold text-zinc-900">{row.criterion}</td>
                      <td className="px-5 py-4 leading-relaxed text-zinc-700">{row.elNino}</td>
                      <td className="px-5 py-4 leading-relaxed text-zinc-700">{row.laNina}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="border-b border-zinc-200 bg-[#F9F8F4] text-xs font-semibold text-zinc-700">
                  <tr>
                    <th className="w-1/4 px-5 py-3.5">{ui.mechanism.regionCol}</th>
                    <th className="w-1/6 px-5 py-3.5">{ui.mechanism.dominantRiskCol}</th>
                    <th className="px-5 py-3.5">{ui.mechanism.effectsCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {globalEffects.map((item) => (
                    <tr key={item.region} className="align-top hover:bg-zinc-50/70">
                      <td className="px-5 py-4 font-semibold text-zinc-900">{item.region}</td>
                      <td className="px-5 py-4 font-mono text-xs font-medium text-zinc-700">
                        {formatRiskLabel(item.dominantRisk)}
                      </td>
                      <td className="px-5 py-4 leading-relaxed text-zinc-700">{item.effects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
