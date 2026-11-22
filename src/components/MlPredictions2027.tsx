import { useEffect, useMemo, useState } from 'react';
import {
  Cpu,
  Check,
  ClipboardCopy,
  SlidersHorizontal,
  Layers,
  Droplets,
  Download,
  Database,
  GitBranch,
  ShieldAlert,
} from 'lucide-react';
import {
  PYTHON_DISTRICT_NORMALIZER_SCRIPT,
  PYTHON_FOLIUM_MAP_SCRIPT,
  PYTHON_GEOBOUNDARIES_XGBOOST_SCRIPT,
  PYTHON_ML_SCRIPT,
  PYTHON_QLORA_JSONL_SCRIPT,
  PYTHON_RAG_FAISS_SCRIPT,
  PYTHON_XGBOOST_SCRIPT,
  type DistrictHydroProfile,
} from '../data/ensoData';
import { DistrictStudioPanel } from './DistrictStudioPanel';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedAfrica2027,
  getLocalizedEtlSources,
  getLocalizedFilieres,
  getLocalizedHistoricalPatterns,
  getLocalizedHybridArchitecture,
  getLocalizedHybridDemos,
  getLocalizedHydroProfiles,
  getLocalizedLstmSeries,
  getLocalizedMadagascar2027,
  getLocalizedXgboostGuards,
} from '../i18n/localizedMlEconomicData';

type MlTab =
  | 'district-studio'
  | 'filieres-27-28'
  | 'hydro-districts'
  | 'madagascar-2027'
  | 'africa-2027'
  | 'patterns-etl'
  | 'hybrid-rag'
  | 'python';

type PythonScriptKey =
  | 'qlora-jsonl'
  | 'folium-map'
  | 'normalizer'
  | 'geo-xgb'
  | 'rag-faiss'
  | 'xgb'
  | 'rf';

export function MlPredictions2027() {
  const { lang, t, ui } = useLanguage();
  const m = ui.ml;
  const [activeTab, setActiveTab] = useState<MlTab>('district-studio');
  const [hoveredLagIdx, setHoveredLagIdx] = useState<number>(6);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pythonModel, setPythonModel] = useState<PythonScriptKey>('qlora-jsonl');
  const [selectedHydroId, setSelectedHydroId] =
    useState<DistrictHydroProfile['id']>('grand-sud-eau');
  const [selectedDemoId, setSelectedDemoId] = useState<string>('ambatondrazaka');

  const lstmSeries = useMemo(() => getLocalizedLstmSeries(lang), [lang]);
  const filieres = useMemo(() => getLocalizedFilieres(lang), [lang]);
  const hydroProfiles = useMemo(() => getLocalizedHydroProfiles(lang), [lang]);
  const madagascar2027 = useMemo(() => getLocalizedMadagascar2027(lang), [lang]);
  const africa2027 = useMemo(() => getLocalizedAfrica2027(lang), [lang]);
  const historicalPatterns = useMemo(() => getLocalizedHistoricalPatterns(lang), [lang]);
  const etlSources = useMemo(() => getLocalizedEtlSources(lang), [lang]);
  const xgbGuards = useMemo(() => getLocalizedXgboostGuards(lang), [lang]);
  const hybridArch = useMemo(() => getLocalizedHybridArchitecture(lang), [lang]);
  const hybridDemos = useMemo(() => getLocalizedHybridDemos(lang), [lang]);

  useEffect(() => {
    const handleDistrictJump = () => {
      setActiveTab('district-studio');
    };
    window.addEventListener('select-madagascar-district', handleDistrictJump);
    return () => window.removeEventListener('select-madagascar-district', handleDistrictJump);
  }, []);

  // Interactive Simulator state (defaults match scenario_2027 in Python script)
  const [oniLag4, setOniLag4] = useState<number>(3.5);
  const [iodIndex, setIodIndex] = useState<number>(0.9);
  const [rainCumul3m, setRainCumul3m] = useState<number>(180);
  const [tempAnom, setTempAnom] = useState<number>(2.8);

  const applyPreset = (preset: 'script' | 'peak' | 'rebound2028') => {
    if (preset === 'script') {
      setOniLag4(3.5);
      setIodIndex(0.9);
      setRainCumul3m(180);
      setTempAnom(2.8);
    } else if (preset === 'peak') {
      setOniLag4(3.8);
      setIodIndex(1.1);
      setRainCumul3m(145);
      setTempAnom(3.6);
    } else {
      setOniLag4(-0.9);
      setIodIndex(-0.3);
      setRainCumul3m(385);
      setTempAnom(0.4);
    }
  };

  const simResult = useMemo(() => {
    const stressFactor =
      Math.max(0, oniLag4) * 0.24 +
      Math.max(0, iodIndex) * 0.18 +
      Math.max(0, tempAnom - 0.5) * 0.14 +
      Math.max(0, (320 - rainCumul3m) / 180) * 0.35;

    const baselineYield = 1.92;
    const predictedYield = Math.max(0.55, Math.min(2.35, baselineYield - stressFactor * 0.72));

    const isStrongElNino = oniLag4 >= 1.5 || (oniLag4 >= 1.0 && tempAnom >= 1.5);
    const regimeLabel = isStrongElNino
      ? m.regimeSuperElNino
      : oniLag4 <= -0.5
        ? m.regimeLaNina
        : m.regimeNormal;

    const gdpRange = isStrongElNino
      ? lang === 'fr'
        ? '-6 % à -7 %'
        : lang === 'en'
          ? '-6% to -7%'
          : '-6% hadi -7%'
      : lang === 'fr'
        ? '+2,5 % à +3,5 %'
        : lang === 'en'
          ? '+2.5% to +3.5%'
          : '+2.5% hadi +3.5%';
    const inflationRange = isStrongElNino
      ? lang === 'fr'
        ? '8,6 % – 9,9 %'
        : '8.6% – 9.9%'
      : lang === 'fr'
        ? '5,6 % – 8,2 %'
        : '5.6% – 8.2%';
    const rainDeviation =
      rainCumul3m < 230
        ? `${m.waterDeficit} (${Math.round(((rainCumul3m - 340) / 340) * 100)}%)`
        : m.waterRestored;

    return {
      predictedYield: predictedYield.toFixed(2),
      regimeLabel,
      isStrongElNino,
      gdpRange,
      inflationRange,
      rainDeviation,
    };
  }, [oniLag4, iodIndex, rainCumul3m, tempAnom, lang, m]);

  const activeScript =
    pythonModel === 'qlora-jsonl'
      ? PYTHON_QLORA_JSONL_SCRIPT
      : pythonModel === 'folium-map'
        ? PYTHON_FOLIUM_MAP_SCRIPT
        : pythonModel === 'normalizer'
          ? PYTHON_DISTRICT_NORMALIZER_SCRIPT
          : pythonModel === 'geo-xgb'
            ? PYTHON_GEOBOUNDARIES_XGBOOST_SCRIPT
            : pythonModel === 'rag-faiss'
              ? PYTHON_RAG_FAISS_SCRIPT
              : pythonModel === 'xgb'
                ? PYTHON_XGBOOST_SCRIPT
                : PYTHON_ML_SCRIPT;

  const activeDemo =
    hybridDemos.find((d) => d.id === selectedDemoId) ?? hybridDemos[0];

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(activeScript);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleDownloadCentroidsCsv = () => {
    const rows = ['profil_hydrologique,district,region,latitude,longitude'];
    hydroProfiles.forEach((profile) => {
      profile.sampleCentroids.forEach((c) => {
        rows.push(`"${profile.id}","${c.district}","${c.region}",${c.lat},${c.lon}`);
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'madagascar_districts_centroides_ml.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeHydroProfile =
    hydroProfiles.find((p) => p.id === selectedHydroId) ?? hydroProfiles[0];

  // Dual-axis SVG coordinates for LSTM Lag chart
  const chartLeft = 48;
  const chartRight = 596;
  const chartTop = 24;
  const chartBottom = 180;
  const getX = (idx: number) =>
    chartLeft + (idx / (lstmSeries.length - 1)) * (chartRight - chartLeft);
  const getYOni = (val: number) => chartBottom - ((val + 0.5) / 4.6) * (chartBottom - chartTop);
  const getYShock = (val: number) => chartBottom - (val / 100) * (chartBottom - chartTop);

  const oniPoints = lstmSeries.map((d, i) => `${getX(i)},${getYOni(d.oniAnomaly)}`).join(' ');
  const shockPoints = lstmSeries.map((d, i) => `${getX(i)},${getYShock(d.harvestShockIdx)}`).join(' ');
  const activeLagPoint = lstmSeries[hoveredLagIdx] ?? lstmSeries[6];

  return (
    <section id="modele-ml" className="border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">
            {t.sections.s04Eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {t.sections.s04Title}
          </h2>
          <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-zinc-600">
            {t.sections.s04Lead}
          </p>
        </div>

        {/* Architecture + LSTM Lag Chart + Interactive Simulator */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <h3 className="font-serif text-xl font-semibold text-zinc-900">
                      {m.chartTitle}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {m.chartSubtitle}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                    {activeLagPoint.month} · ONI{' '}
                    <span className="text-[#1E3A8A]">
                      {activeLagPoint.oniAnomaly >= 0 ? '+' : ''}
                      {activeLagPoint.oniAnomaly.toFixed(1)} °C
                    </span>
                  </div>
                  <div className="font-mono text-xs text-amber-800 tabular-nums">
                    {m.legendShock} : {activeLagPoint.harvestShockIdx}/100 ({activeLagPoint.label})
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-md border border-zinc-200 bg-[#F9F8F4] p-3">
                <svg
                  viewBox="0 0 640 215"
                  role="img"
                  aria-label={m.chartAria}
                  className="h-auto w-full"
                >
                  {[0, 25, 50, 75, 100].map((v) => {
                    const y = getYShock(v);
                    return (
                      <g key={v}>
                        <line
                          x1={chartLeft}
                          y1={y}
                          x2={chartRight}
                          y2={y}
                          stroke="#E4E4E7"
                          strokeWidth="1"
                        />
                        <text
                          x={chartRight + 8}
                          y={y + 4}
                          fontSize="9.5"
                          fontFamily="JetBrains Mono, monospace"
                          fill="#B45309"
                        >
                          {v}
                        </text>
                      </g>
                    );
                  })}

                  {[0, 1.5, 3.0, 3.8].map((val) => (
                    <text
                      key={val}
                      x={chartLeft - 8}
                      y={getYOni(val) + 4}
                      textAnchor="end"
                      fontSize="9.5"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#1E3A8A"
                    >
                      +{val.toFixed(1)}
                    </text>
                  ))}

                  <rect
                    x={getX(5)}
                    y={chartTop}
                    width={getX(9) - getX(5)}
                    height={chartBottom - chartTop}
                    fill="#D97706"
                    fillOpacity="0.08"
                  />
                  <text
                    x={(getX(5) + getX(9)) / 2}
                    y={chartTop + 13}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="600"
                    fill="#9A3412"
                  >
                    {lang === 'en'
                      ? 'Peak Shock Window (Apr–Aug 2027)'
                      : lang === 'sw'
                        ? 'Kipindi cha Mshtuko Mkubwa (Apr–Ago 2027)'
                        : 'Fenêtre de choc maximal (Avr.–Août 2027)'}
                  </text>

                  <polyline
                    points={oniPoints}
                    fill="none"
                    stroke="#1E3A8A"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                  <polyline
                    points={shockPoints}
                    fill="none"
                    stroke="#B45309"
                    strokeWidth="2.8"
                  />

                  <line
                    x1={getX(hoveredLagIdx)}
                    y1={chartTop}
                    x2={getX(hoveredLagIdx)}
                    y2={chartBottom}
                    stroke="#52525B"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />

                  {lstmSeries.map((d, i) => {
                    const cx = getX(i);
                    const isActive = i === hoveredLagIdx;
                    return (
                      <g
                        key={d.month}
                        role="button"
                        tabIndex={0}
                        aria-label={`${d.month} : ONI ${d.oniAnomaly} °C, ${d.harvestShockIdx}/100`}
                        onMouseEnter={() => setHoveredLagIdx(i)}
                        onFocus={() => setHoveredLagIdx(i)}
                        onClick={() => setHoveredLagIdx(i)}
                        className="cursor-pointer focus:outline-none"
                      >
                        <rect x={cx - 20} y={chartTop} width={40} height={chartBottom - chartTop} fill="transparent" />
                        <circle
                          cx={cx}
                          cy={getYOni(d.oniAnomaly)}
                          r={isActive ? 5 : 3.5}
                          fill="#1E3A8A"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={cx}
                          cy={getYShock(d.harvestShockIdx)}
                          r={isActive ? 5.5 : 3.5}
                          fill="#B45309"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        <text
                          x={cx}
                          y={199}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight={isActive ? '700' : '400'}
                          fill={isActive ? '#18181B' : '#71717A'}
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="font-mono text-[#1E3A8A]">— — {m.legendOni}</span>
                  <span className="font-mono text-amber-800">——— {m.legendShock}</span>
                </div>
                <span>{m.lagBadge}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {m.clusteringTitle}
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  {m.clusteringText}
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {m.xgboostTitle}
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  {m.xgboostText}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Simulator */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-5">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold text-zinc-900">
                  {m.simTitle}
                </h3>
              </div>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-zinc-600">
              {m.simSubtitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('script')}
                className="rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
              >
                {m.presets.sud}
              </button>
              <button
                type="button"
                onClick={() => applyPreset('peak')}
                className="rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
              >
                {lang === 'en' ? 'Peak Niño 3.4 (+3.8 °C)' : lang === 'sw' ? 'Kilele Niño 3.4 (+3.8 °C)' : 'Pic Niño 3.4 (+3,8 °C)'}
              </button>
              <button
                type="button"
                onClick={() => applyPreset('rebound2028')}
                className="rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1 text-xs font-medium text-[#1E3A8A] hover:border-zinc-300"
              >
                {m.presets.laNina}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-oni" className="font-mono font-medium text-zinc-700">
                    {m.oniLabel}
                  </label>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {oniLag4 >= 0 ? '+' : ''}
                    {oniLag4.toFixed(1)} °C
                  </span>
                </div>
                <input
                  id="slider-oni"
                  type="range"
                  min={-1.5}
                  max={4.1}
                  step={0.1}
                  value={oniLag4}
                  onChange={(e) => setOniLag4(parseFloat(e.target.value))}
                  className="mt-1.5 w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-iod" className="font-mono font-medium text-zinc-700">
                    {m.iodLabel}
                  </label>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {iodIndex >= 0 ? '+' : ''}
                    {iodIndex.toFixed(1)}
                  </span>
                </div>
                <input
                  id="slider-iod"
                  type="range"
                  min={-0.5}
                  max={1.2}
                  step={0.1}
                  value={iodIndex}
                  onChange={(e) => setIodIndex(parseFloat(e.target.value))}
                  className="mt-1.5 w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-rain" className="font-mono font-medium text-zinc-700">
                    {m.rainLabel}
                  </label>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {rainCumul3m} mm
                  </span>
                </div>
                <input
                  id="slider-rain"
                  type="range"
                  min={80}
                  max={450}
                  step={5}
                  value={rainCumul3m}
                  onChange={(e) => setRainCumul3m(parseInt(e.target.value, 10))}
                  className="mt-1.5 w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-temp" className="font-mono font-medium text-zinc-700">
                    {lang === 'en' ? 'Temp_Max_Anomaly' : lang === 'sw' ? 'Tofauti ya Joto la Juu' : 'Temp_Max_Anomalie'}
                  </label>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    +{tempAnom.toFixed(1)} °C
                  </span>
                </div>
                <input
                  id="slider-temp"
                  type="range"
                  min={0.2}
                  max={4.0}
                  step={0.1}
                  value={tempAnom}
                  onChange={(e) => setTempAnom(parseFloat(e.target.value))}
                  className="mt-1.5 w-full accent-amber-700"
                />
              </div>
            </div>

            <div className="mt-6 rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-3">
                <span className="text-xs font-semibold text-zinc-600">{m.regimeClassified}</span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    simResult.isStrongElNino ? 'text-amber-800' : 'text-[#1E3A8A]'
                  }`}
                >
                  {simResult.regimeLabel}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] text-zinc-500">{m.projectedMaize}</span>
                  <span className="mt-0.5 block font-mono text-2xl font-semibold text-zinc-900 tabular-nums">
                    {simResult.predictedYield}{' '}
                    <span className="text-xs font-normal text-zinc-500">t/ha</span>
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-500">{m.estimatedAgriGdp}</span>
                  <span
                    className={`mt-0.5 block font-mono text-lg font-semibold tabular-nums ${
                      simResult.isStrongElNino ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    {simResult.gdpRange}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-2.5 text-xs text-zinc-600">
                <span>
                  {m.inflationLabel} : <strong className="font-mono text-zinc-900">{simResult.inflationRange}</strong>
                </span>
                <span className="font-mono text-[11px]">{simResult.rainDeviation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Tabbed Deep-Dive */}
        <div className="mt-12">
          <div
            role="tablist"
            aria-label={t.sections.s04Title}
            className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 bg-white p-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'district-studio'}
              onClick={() => setActiveTab('district-studio')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'district-studio'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {lang === 'en'
                ? 'District Map, JSONL & Gemini RAG'
                : lang === 'sw'
                  ? 'Ramani ya Wilaya, JSONL & Gemini RAG'
                  : 'Carte Districts, JSONL & Gemini RAG'}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'filieres-27-28'}
              onClick={() => setActiveTab('filieres-27-28')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'filieres-27-28'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.filieres}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hydro-districts'}
              onClick={() => setActiveTab('hydro-districts')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'hydro-districts'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.hydroDistricts}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'madagascar-2027'}
              onClick={() => setActiveTab('madagascar-2027')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'madagascar-2027'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.madagascar2027}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'africa-2027'}
              onClick={() => setActiveTab('africa-2027')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'africa-2027'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.africa2027}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hybrid-rag'}
              onClick={() => setActiveTab('hybrid-rag')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'hybrid-rag'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.hybridRag}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'patterns-etl'}
              onClick={() => setActiveTab('patterns-etl')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'patterns-etl'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.patterns}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'python'}
              onClick={() => setActiveTab('python')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'python'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {m.tabs.python}
            </button>
          </div>

          {activeTab === 'district-studio' && <DistrictStudioPanel />}

          {/* Tab 1: Filières 2027 vs 2028 */}
          {activeTab === 'filieres-27-28' && (
            <div className="mt-6 space-y-6">
              {/* Diverging Bar Comparison Chart */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {m.tabs.filieres}
                    </h3>
                    <p className="mt-1 max-w-[78ch] text-xs text-zinc-500">
                      {m.filieresBanner}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-amber-800">■ {m.scenario2027Label}</span>
                    <span className="text-[#1E3A8A]">■ {m.scenario2028Label}</span>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-zinc-100">
                  {filieres.map((item) => {
                    const leftPct = Math.min(48, (Math.abs(item.delta2027Pct) / 40) * 48);
                    const rightPct = Math.min(48, (Math.abs(item.delta2028Pct) / 40) * 48);
                    return (
                      <div
                        key={item.filiere}
                        className="grid grid-cols-1 items-center gap-3 py-3.5 sm:grid-cols-12"
                      >
                        <div className="text-sm font-semibold text-zinc-900 sm:col-span-4">
                          {item.filiere}
                        </div>
                        <div className="relative flex h-7 items-center sm:col-span-6">
                          {/* Center zero axis */}
                          <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-300"
                          />
                          {/* Negative 2027 bar (left of center) */}
                          <div
                            style={{ right: '50%', width: `${leftPct}%` }}
                            className="absolute h-4 rounded-l bg-amber-700/85"
                          />
                          {/* Positive 2028 bar (right of center) */}
                          <div
                            style={{ left: '50%', width: `${rightPct}%` }}
                            className="absolute h-4 rounded-r bg-[#1E3A8A]/85"
                          />
                        </div>
                        <div className="flex justify-between font-mono text-xs tabular-nums sm:col-span-2 sm:justify-end sm:gap-3">
                          <span className="font-semibold text-amber-800">
                            {item.delta2027Pct} %
                          </span>
                          <span className="font-semibold text-[#1E3A8A]">
                            +{item.delta2028Pct} %
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <table className="w-full min-w-[740px] border-collapse text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
                    <tr>
                      <th className="w-1/4 px-5 py-3.5">
                        {lang === 'en' ? 'Economic Value Chain' : lang === 'sw' ? 'Sekta ya Uchumi' : 'Filière économique'}
                      </th>
                      <th className="w-[37.5%] px-5 py-3.5 text-amber-800">
                        {m.scenario2027Label}
                      </th>
                      <th className="w-[37.5%] px-5 py-3.5 text-[#1E3A8A]">
                        {m.scenario2028Label}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {filieres.map((row) => (
                      <tr key={row.filiere} className="align-top hover:bg-zinc-50/70">
                        <td className="px-5 py-4 font-semibold text-zinc-900">{row.filiere}</td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-700">
                          {row.prediction2027}
                        </td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-700">
                          {row.prediction2028}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Ressource en eau & 119 Districts */}
          {activeTab === 'hydro-districts' && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              {/* Left Profile Selector */}
              <div className="flex flex-col gap-2 lg:col-span-5">
                {hydroProfiles.map((profile) => {
                  const isActive = profile.id === selectedHydroId;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => setSelectedHydroId(profile.id)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        isActive
                          ? 'border-[#1E3A8A] bg-white'
                          : 'border-zinc-200 bg-white/70 hover:border-zinc-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{profile.title}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{profile.zoneSubtitle}</p>
                      <p className="mt-2 font-mono text-xs font-medium text-amber-800">
                        {profile.hydroSignal2027}
                      </p>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleDownloadCentroidsCsv}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
                >
                  <Download className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                  {ui.common.exportCsv} ({ui.common.district})
                </button>
              </div>

              {/* Right Detail & District Centroids */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-7">
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
                  <Droplets className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-zinc-900">
                      {activeHydroProfile.title}
                    </h3>
                    <p className="text-xs text-zinc-500">{activeHydroProfile.zoneSubtitle}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                    <h4 className="font-mono text-xs font-semibold text-amber-800">
                      {m.impact2027Label}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      {activeHydroProfile.prediction2027}
                    </p>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                    <h4 className="font-mono text-xs font-semibold text-[#1E3A8A]">
                      {m.impact2028Label}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      {activeHydroProfile.prediction2028}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-zinc-600">
                    {m.centroidsLabel}
                  </h4>
                  <div className="mt-2.5 overflow-x-auto rounded-md border border-zinc-200">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                        <tr>
                          <th className="px-3.5 py-2.5">{ui.common.district}</th>
                          <th className="px-3.5 py-2.5">{ui.common.region}</th>
                          <th className="px-3.5 py-2.5 text-right">Latitude</th>
                          <th className="px-3.5 py-2.5 text-right">Longitude</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 bg-white">
                        {activeHydroProfile.sampleCentroids.map((c) => (
                          <tr key={c.district}>
                            <td className="px-3.5 py-2 font-semibold text-zinc-900">{c.district}</td>
                            <td className="px-3.5 py-2 text-zinc-600">{c.region}</td>
                            <td className="px-3.5 py-2 text-right font-mono tabular-nums text-zinc-700">
                              {c.lat.toFixed(2)}
                            </td>
                            <td className="px-3.5 py-2 text-right font-mono tabular-nums text-zinc-700">
                              {c.lon.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Madagascar 2027 */}
          {activeTab === 'madagascar-2027' && (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {madagascar2027.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                      <h3 className="font-serif text-lg font-semibold text-zinc-900">
                        {item.region}
                      </h3>
                      <span className="font-mono text-xs text-zinc-500">{item.horizon}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-zinc-500">{item.subRegions}</p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">{item.forecast}</p>
                  </div>

                  <p className="mt-4 border-t border-zinc-100 pt-3 font-mono text-xs font-semibold text-amber-800">
                    {m.criticalSignalCol} {item.criticalMetric}
                  </p>
                </article>
              ))}
            </div>
          )}

          {/* Tab 4: Africa 2027 */}
          {activeTab === 'africa-2027' && (
            <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[740px] border-collapse text-left text-sm">
                <thead className="border-b border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
                  <tr>
                    <th className="w-1/4 px-5 py-3.5">{ui.common.regions}</th>
                    <th className="w-1/3 px-5 py-3.5">{m.africaWeatherLabel}</th>
                    <th className="px-5 py-3.5">{m.africaEcoLabel}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {africa2027.map((row) => (
                    <tr key={row.zone} className="align-top hover:bg-zinc-50/70">
                      <td className="px-5 py-4">
                        <span className="block font-semibold text-zinc-900">{row.zone}</span>
                        <span className="mt-1 block text-xs text-zinc-500">{row.countries}</span>
                      </td>
                      <td className="px-5 py-4 leading-relaxed text-zinc-700">{row.weather2027}</td>
                      <td className="px-5 py-4 leading-relaxed text-zinc-700">
                        {row.economicImpact2027}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 5: 10-Year Historical Patterns & Open ETL Sources */}
          {activeTab === 'patterns-etl' && (
            <div className="mt-6 space-y-8">
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
                    <tr>
                      <th className="w-1/5 px-5 py-3.5">{m.patternsCols.indicator}</th>
                      <th className="w-1/4 px-5 py-3.5 text-[#1E3A8A]">
                        {m.patternsCols.neutral}
                      </th>
                      <th className="w-1/4 px-5 py-3.5 text-amber-800">
                        {m.patternsCols.elNino}
                      </th>
                      <th className="px-5 py-3.5">{m.patternsCols.impact}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {historicalPatterns.map((row) => (
                      <tr key={row.indicator} className="align-top hover:bg-zinc-50/70">
                        <td className="px-5 py-4 font-semibold text-zinc-900">{row.indicator}</td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-700">{row.neutralLaNina}</td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-800">{row.strongElNino}</td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-600">{row.measuredImpact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <div className="border-b border-zinc-200 bg-white px-5 py-3.5 font-serif text-base font-semibold text-zinc-900">
                  {m.etlTitle}
                </div>
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
                    <tr>
                      <th className="w-1/6 px-5 py-3.5">{m.etlCols.source}</th>
                      <th className="w-1/4 px-5 py-3.5">{m.etlCols.access}</th>
                      <th className="w-1/3 px-5 py-3.5">{m.etlCols.variables}</th>
                      <th className="px-5 py-3.5">{m.etlCols.role}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {etlSources.map((src) => (
                      <tr key={src.source} className="align-top hover:bg-zinc-50/70">
                        <td className="px-5 py-4 font-semibold text-zinc-900">{src.source}</td>
                        <td className="px-5 py-4 text-xs leading-relaxed text-zinc-600">
                          {src.accessResolution}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs leading-relaxed text-zinc-700">
                          {src.variables}
                        </td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-700">{src.roleInMl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 6: Hybrid Architecture (XGBoost Anti-Overfit + Fine-Tuning + RAG) */}
          {activeTab === 'hybrid-rag' && (
            <div className="mt-6 space-y-8">
              {/* Anti-Overfitting XGBoost Hyperparameters */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-700" aria-hidden="true" />
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {m.antiOverfitTitle}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    geoBoundaries ADM2 (119) + TimeSeriesSplit
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{m.antiOverfitSubtitle}</p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                      <tr>
                        <th className="w-1/4 px-4 py-2.5">{m.antiOverfitCols.param}</th>
                        <th className="w-1/3 px-4 py-2.5">{m.antiOverfitCols.val}</th>
                        <th className="px-4 py-2.5">{m.antiOverfitCols.role}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {xgbGuards.map((g) => (
                        <tr key={g.param} className="align-top">
                          <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                            {g.param}
                          </td>
                          <td className="px-4 py-3 font-mono text-[#1E3A8A]">{g.value}</td>
                          <td className="px-4 py-3 text-sm leading-relaxed text-zinc-700">
                            {g.purpose}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3-Layer Hybrid AI Architecture Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <div className="border-b border-zinc-200 bg-white px-5 py-3.5 font-serif text-base font-semibold text-zinc-900">
                  {m.hybridStackTitle}
                </div>
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
                    <tr>
                      <th className="w-1/5 px-5 py-3.5">{m.hybridCols.layer}</th>
                      <th className="w-1/4 px-5 py-3.5">{m.hybridCols.role}</th>
                      <th className="w-1/4 px-5 py-3.5">{m.hybridCols.sources}</th>
                      <th className="px-5 py-3.5">{m.hybridCols.impl}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {hybridArch.map((row) => (
                      <tr key={row.component} className="align-top hover:bg-zinc-50/70">
                        <td className="px-5 py-4 font-semibold text-zinc-900">{row.component}</td>
                        <td className="px-5 py-4 leading-relaxed text-zinc-700">{row.role}</td>
                        <td className="px-5 py-4 text-xs leading-relaxed text-zinc-600">
                          {row.trainingSources}
                        </td>
                        <td className="px-5 py-4 text-xs leading-relaxed text-zinc-700">
                          {row.implementation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Interactive 4-Step Hybrid Orchestration Explorer */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-zinc-900">
                        {m.orchestrationTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="inline-flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-1">
                    {hybridDemos.map((demo) => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => setSelectedDemoId(demo.id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          selectedDemoId === demo.id
                            ? 'bg-white text-zinc-900 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {demo.district} ({demo.region})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
                  {/* Step 1 & 2: User Query + XGBoost JSON */}
                  <div className="space-y-4 lg:col-span-5">
                    <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                      <p className="font-mono text-[11px] font-semibold text-zinc-500">
                        {m.orchestrationQuestionLabel}
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-zinc-900">
                        « {activeDemo.query} »
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-md border border-zinc-200 bg-[#0F172A] p-4 text-slate-100">
                      <p className="font-mono text-[11px] font-semibold text-slate-400">
                        {m.step1Title}
                      </p>
                      <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300">
                        <code>{activeDemo.xgboostJson}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Step 3 & 4: RAG Vector Chunks + Fine-Tuned Synthesis */}
                  <div className="space-y-4 lg:col-span-7">
                    <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                      <p className="font-mono text-[11px] font-semibold text-[#1E3A8A]">
                        {m.step2Title}
                      </p>
                      <div className="mt-2.5 space-y-2.5">
                        {activeDemo.ragExcerpts.map((ex) => (
                          <div
                            key={ex.source}
                            className="rounded border border-zinc-200 bg-white p-3 text-xs"
                          >
                            <span className="block font-semibold text-zinc-900">{ex.source}</span>
                            <span className="mt-1 block leading-relaxed text-zinc-600">
                              {ex.snippet}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md border border-zinc-200 bg-white p-4">
                      <p className="font-mono text-[11px] font-semibold text-amber-800">
                        {m.step3Title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                        {activeDemo.synthesizedPlan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Python Scripts (7 pipelines) */}
          {activeTab === 'python' && (
            <div className="mt-6 space-y-4">
              <p className="text-xs leading-relaxed text-zinc-600">{m.codeIntro}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
                  {(
                    [
                      { id: 'qlora-jsonl', label: `1. ${m.scriptTabs.qloraJsonl}` },
                      { id: 'folium-map', label: `2. ${m.scriptTabs.folium}` },
                      { id: 'normalizer', label: `3. ${m.scriptTabs.normalizer}` },
                      { id: 'geo-xgb', label: `4. ${m.scriptTabs.geoXgboost}` },
                      { id: 'rag-faiss', label: `5. ${m.scriptTabs.rag}` },
                      { id: 'xgb', label: `6. ${m.scriptTabs.power}` },
                      { id: 'rf', label: `7. ${m.scriptTabs.rf}` },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPythonModel(item.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                        pythonModel === item.id
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-[#0F172A] text-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-3.5">
                  <div className="text-xs">
                    <span className="font-mono font-semibold text-slate-200">
                      {pythonModel === 'qlora-jsonl'
                        ? 'generer_dataset_qlora.py'
                        : pythonModel === 'folium-map'
                          ? 'carte_folium_119_districts.py'
                          : pythonModel === 'normalizer'
                            ? 'normalisation_districts_mdg.py'
                            : pythonModel === 'geo-xgb'
                              ? 'pipeline_119_districts_xgboost_reg.py'
                              : pythonModel === 'rag-faiss'
                                ? 'rag_langchain_faiss_madagascar.py'
                                : pythonModel === 'xgb'
                                  ? 'pipeline_xgboost_nasa_power.py'
                                  : 'pipeline_el_nino_2027.py'}
                    </span>
                    <span className="mx-2 text-slate-500">·</span>
                    <span className="text-slate-400">
                      {pythonModel === 'qlora-jsonl'
                        ? m.scriptTitles['qlora-jsonl']
                        : pythonModel === 'folium-map'
                          ? m.scriptTitles.folium
                          : pythonModel === 'normalizer'
                            ? m.scriptTitles.normalizer
                            : pythonModel === 'geo-xgb'
                              ? m.scriptTitles['geo-xgboost']
                              : pythonModel === 'rag-faiss'
                                ? m.scriptTitles.rag
                                : pythonModel === 'xgb'
                                  ? m.scriptTitles.power
                                  : m.scriptTitles.rf}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 whitespace-nowrap shrink-0"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        {m.copiedCode}
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                        {m.copyCode}
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-slate-200">
                  <code>{activeScript}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
