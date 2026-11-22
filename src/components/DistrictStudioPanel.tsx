import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download,
  Loader2,
  MapPin,
  Cpu,
  AlertCircle,
  Check,
  ClipboardCopy,
  FileJson,
  FileText,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { type DistrictPredictionPoint } from '../data/ensoData';
import { MadagascarGoogleMap } from './MadagascarGoogleMap';
import { useLanguage, type LanguageCode } from '../i18n/LanguageContext';
import {
  getLocalizedDistrictChoroplethData,
  getLocalizedDistrictProfileLabel,
  getLocalizedQloraHyperparams,
} from '../i18n/localizedMlEconomicData';
import {
  computeEconomicAggregation,
  formatCurrencyFromMUsd,
  formatPct,
} from '../utils/economicAggregation';
import {
  exportScientificExcel,
  exportScientificPdf,
  exportScientificWord,
  LICENSE_ATTRIBUTION,
} from '../utils/scientificReportGenerator';
import { emitIndriActivity } from '../utils/indriEvents';

type CropMetricKey = 'rice' | 'maize' | 'exportCrop';

const REPORT_WIDGET_COPY: Record<
  LanguageCode,
  {
    title: string;
    subtitle: string;
    ecoLossLbl: string;
    pdfBtn: string;
    wordBtn: string;
    excelBtn: string;
    studioBtn: string;
    exportedOk: string;
    selectDistrictAria: string;
  }
> = {
  fr: {
    title: 'Génération de Rapport du District',
    subtitle: 'Export structuré IMRAD avec graphes, diagnostic & pertes économiques de ce district.',
    ecoLossLbl: 'Impact éco unitaire estimé :',
    pdfBtn: 'PDF (.pdf)',
    wordBtn: 'Word (.docx)',
    excelBtn: 'Excel (.xlsx)',
    studioBtn: 'Rapport Studio',
    exportedOk: 'Rapport téléchargé',
    selectDistrictAria: 'Choisir un district directement',
  },
  en: {
    title: 'District Report Generation',
    subtitle: 'Structured IMRAD export with charts, diagnostics & economic losses for this district.',
    ecoLossLbl: 'Estimated unit economic impact:',
    pdfBtn: 'PDF (.pdf)',
    wordBtn: 'Word (.docx)',
    excelBtn: 'Excel (.xlsx)',
    studioBtn: 'Report Studio',
    exportedOk: 'Report downloaded',
    selectDistrictAria: 'Select a district directly',
  },
  sw: {
    title: 'Uundaji wa Ripoti ya Wilaya',
    subtitle: 'Pakua ripoti ya kisayansi ya IMRAD yenye michoro na hasara za kiuchumi za wilaya hii.',
    ecoLossLbl: 'Makadirio ya hasara ya wilaya:',
    pdfBtn: 'PDF (.pdf)',
    wordBtn: 'Word (.docx)',
    excelBtn: 'Excel (.xlsx)',
    studioBtn: 'Studio ya Ripoti',
    exportedOk: 'Ripoti imepakuliwa',
    selectDistrictAria: 'Chagua wilaya moja kwa moja',
  },
};

function normalizeDistrictName(name: string): string {
  const aliases: Record<string, string> = {
    'toliara-ii': 'toliara ii',
    'toliary ii': 'toliara ii',
    'ambovombe-androy': 'ambovombe',
    'boriziny (port-berge)': 'port-berge',
    'belo sur tsiribihina': 'belo-sur-tsiribihina',
    'antananarivo atsimondrano': 'antananarivo-atsimondrano',
    'ambato boeny': 'ambato-boeny',
    'ampanihy ouest': 'ampanihy',
    'betioky atsimo': 'betioky',
    'manakara atsimo': 'manakara',
  };
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return aliases[clean] ?? clean;
}

export function DistrictStudioPanel() {
  const { lang, ui } = useLanguage();
  const ds = ui.districtStudio;
  const rCopy = REPORT_WIDGET_COPY[lang];
  const lic = LICENSE_ATTRIBUTION[lang];
  const districts = useMemo(() => getLocalizedDistrictChoroplethData(lang), [lang]);
  const qloraParams = useMemo(() => getLocalizedQloraHyperparams(lang), [lang]);

  const [year, setYear] = useState<2027 | 2028>(2027);
  const [cropKey, setCropKey] = useState<CropMetricKey>('rice');
  const [mapMode, setMapMode] = useState<'google' | 'svg'>('google');
  const [colorMode, setColorMode] = useState<'yield' | 'risk'>('yield');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Ambatondrazaka');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDiagnostic, setAiDiagnostic] = useState<string | null>(null);
  const [copiedDiag, setCopiedDiag] = useState<boolean>(false);
  const [showJsonlPreview, setShowJsonlPreview] = useState<boolean>(false);
  const [exportBusy, setExportBusy] = useState<'pdf' | 'word' | 'excel' | null>(null);
  const [exportDone, setExportDone] = useState<'pdf' | 'word' | 'excel' | null>(null);

  const getYieldColor = useCallback(
    (pct: number): { fill: string; stroke: string; label: string } => {
      if (pct <= -25) return { fill: '#BE123C', stroke: '#881337', label: ds.yieldBadges.collapse };
      if (pct <= -12) return { fill: '#D97706', stroke: '#92400E', label: ds.yieldBadges.severeDrop };
      if (pct < 0) return { fill: '#F59E0B', stroke: '#B45309', label: ds.yieldBadges.decline };
      if (pct < 15) return { fill: '#10B981', stroke: '#047857', label: ds.yieldBadges.recovery };
      return { fill: '#15803D', stroke: '#14532D', label: ds.yieldBadges.recovery };
    },
    [ds.yieldBadges],
  );

  const getRiskTierStyle = useCallback(
    (tier: DistrictPredictionPoint['riskTier']): { fill: string; stroke: string; label: string } => {
      if (tier === 'drought') return { fill: '#DC2626', stroke: '#991B1B', label: ds.riskTiers.drought };
      if (tier === 'mixed') return { fill: '#D97706', stroke: '#92400E', label: ds.riskTiers.mixed };
      return { fill: '#2563EB', stroke: '#1E3A8A', label: ds.riskTiers.flood };
    },
    [ds.riskTiers],
  );

  useEffect(() => {
    const onExternalDistrictSelect = (event: Event) => {
      const customEvent = event as CustomEvent<{ district?: string }>;
      const targetName = customEvent.detail?.district;
      if (!targetName) return;
      const match = districts.find(
        (d) =>
          d.district.toLowerCase() === targetName.toLowerCase() ||
          d.geoBoundariesName.toLowerCase() === targetName.toLowerCase(),
      );
      if (match) {
        setSelectedDistrictName(match.district);
        setAiDiagnostic(null);
        setAiError(null);
      }
    };
    window.addEventListener('select-madagascar-district', onExternalDistrictSelect);
    return () => window.removeEventListener('select-madagascar-district', onExternalDistrictSelect);
  }, [districts]);

  const selectedDistrict = useMemo(
    () => districts.find((d) => d.district === selectedDistrictName) ?? districts[0],
    [districts, selectedDistrictName],
  );

  const getDistrictMetrics = useCallback(
    (d: DistrictPredictionPoint) => {
      const yieldDelta =
        year === 2027
          ? cropKey === 'rice'
            ? d.rice2027
            : cropKey === 'maize'
              ? d.maize2027
              : d.exportCrop2027
          : cropKey === 'rice'
            ? d.rice2028
            : cropKey === 'maize'
              ? d.maize2028
              : d.exportCrop2028;

      const waterDelta = year === 2027 ? d.water2027 : d.water2028;
      const oniIndex = year === 2027 ? 3.5 : -0.9;
      return { yieldDelta, waterDelta, oniIndex };
    },
    [year, cropKey],
  );

  const activeMetrics = getDistrictMetrics(selectedDistrict);

  const districtEcoModel = useMemo(
    () =>
      computeEconomicAggregation({
        horizonYear: year,
        scenario: 's2',
        scope: 'consolidated119',
        lang,
      }),
    [year, lang],
  );

  const selectedDistrictEco = useMemo(
    () =>
      districtEcoModel.districtRows.find(
        (r) => r.point.district.toLowerCase() === selectedDistrict.district.toLowerCase(),
      ) ?? districtEcoModel.districtRows[0],
    [districtEcoModel, selectedDistrict.district],
  );

  const handleDistrictReportExport = async (format: 'pdf' | 'word' | 'excel') => {
    setExportBusy(format);
    setExportDone(null);
    emitIndriActivity({
      state: 'processing',
      label: `${selectedDistrict.district} · ${format.toUpperCase()}`,
      detail: `${lic.licenseHolder} · DG ${lic.directorName}`,
    });
    try {
      const opts = {
        horizonYear: year as 2027 | 2028,
        scenario: 's2' as const,
        scope: 'consolidated119' as const,
        currency: 'USD' as const,
        lang,
        includeRegions23: true,
        includeDistricts42: true,
        includeContinental: true,
        focusDistrict: {
          district: selectedDistrict.district,
          region: selectedDistrict.region,
          cropLabel: ds.cropLabels[cropKey],
          yieldDelta: activeMetrics.yieldDelta,
          waterDelta: activeMetrics.waterDelta,
          oniIndex: activeMetrics.oniIndex,
          aiDiagnostic,
        },
      };

      if (format === 'pdf') {
        await exportScientificPdf(opts);
      } else if (format === 'word') {
        await exportScientificWord(opts);
      } else {
        exportScientificExcel(opts);
      }
      setExportDone(format);
      emitIndriActivity({
        state: 'speaking',
        label: `${rCopy.exportedOk} (${format.toUpperCase()})`,
        detail: `${selectedDistrict.district} · ${lic.licenseHolder}`,
      });
      setTimeout(() => setExportDone(null), 3500);
    } finally {
      setExportBusy(null);
    }
  };

  const handleOpenDistrictReportStudio = () => {
    window.dispatchEvent(
      new CustomEvent('open-scientific-report', {
        detail: {
          horizonYear: year,
          scenario: 's2',
          scope: 'consolidated119',
          currency: 'USD',
          focusDistrict: {
            district: selectedDistrict.district,
            region: selectedDistrict.region,
            cropLabel: ds.cropLabels[cropKey],
            yieldDelta: activeMetrics.yieldDelta,
            waterDelta: activeMetrics.waterDelta,
            oniIndex: activeMetrics.oniIndex,
            aiDiagnostic,
          },
        },
      }),
    );
  };

  // Geographic projection to SVG (width 360, height 480)
  const projectPoint = (lat: number, lon: number) => {
    const x = 35 + ((lon - 42.8) / (50.8 - 42.8)) * 290;
    const y = 22 + ((-11.5 - lat) / (-11.5 - -26.0)) * 436;
    return { x, y };
  };

  // Sample QLoRA JSONL record matching current district
  const sampleJsonlRecord = useMemo(() => {
    const { yieldDelta, waterDelta, oniIndex } = activeMetrics;
    const userMsg = `${ds.cropLabels[cropKey]} — ${selectedDistrict.district} (${selectedDistrict.region}, ${year}). ONI: ${oniIndex >= 0 ? '+' : ''}${oniIndex.toFixed(1)} °C, yield: ${yieldDelta >= 0 ? '+' : ''}${yieldDelta.toFixed(1)}%, water: ${waterDelta >= 0 ? '+' : ''}${waterDelta.toFixed(1)}%.`;
    const riskLabel =
      yieldDelta < -15
        ? ds.yieldBadges.collapse
        : yieldDelta < 0
          ? ds.yieldBadges.decline
          : ds.yieldBadges.recovery;
    const assistantMsg = `### ${selectedDistrict.district} (${year})\n- ${riskLabel}\n- ${selectedDistrict.ragNotes[0]}`;

    return JSON.stringify({
      messages: [
        { role: 'system', content: ds.systemPromptJsonl },
        { role: 'user', content: userMsg },
        { role: 'assistant', content: assistantMsg },
      ],
    });
  }, [selectedDistrict, activeMetrics, cropKey, year, ds]);

  const handleDownloadJsonl = () => {
    const lines: string[] = [];
    const crops: { key: CropMetricKey; label: string }[] = [
      { key: 'rice', label: ds.cropLabels.rice },
      { key: 'maize', label: ds.cropLabels.maize },
      { key: 'exportCrop', label: ds.cropLabels.exportCrop },
    ];

    for (const d of districts) {
      for (const yr of [2027, 2028] as const) {
        for (const c of crops) {
          const rendement =
            yr === 2027
              ? c.key === 'rice'
                ? d.rice2027
                : c.key === 'maize'
                  ? d.maize2027
                  : d.exportCrop2027
              : c.key === 'rice'
                ? d.rice2028
                : c.key === 'maize'
                  ? d.maize2028
                  : d.exportCrop2028;
          const eau = yr === 2027 ? d.water2027 : d.water2028;
          const oni = yr === 2027 ? 3.5 : -0.9;

          const userMsg = `${c.label} · ${d.district} (${d.region}) · ${yr}. ONI: ${oni >= 0 ? '+' : ''}${oni.toFixed(1)}, yield: ${rendement >= 0 ? '+' : ''}${rendement.toFixed(1)}%, water: ${eau >= 0 ? '+' : ''}${eau.toFixed(1)}%.`;
          const assistantMsg = `### ${d.district} (${yr}) · ${c.label}\n- Yield delta: ${rendement >= 0 ? '+' : ''}${rendement.toFixed(1)}%\n- Water anomaly: ${eau >= 0 ? '+' : ''}${eau.toFixed(1)}%\n- Action: ${d.ragNotes[0]}`;

          lines.push(
            JSON.stringify({
              messages: [
                { role: 'system', content: ds.systemPromptJsonl },
                { role: 'user', content: userMsg },
                { role: 'assistant', content: assistantMsg },
              ],
            }),
          );
        }
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'application/x-ndjson;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `madagascar_elnino_qlora_2027_2028_${lang}.jsonl`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunGeminiDiagnostic = async () => {
    setLoadingAi(true);
    setAiError(null);
    emitIndriActivity({
      state: 'processing',
      label: `${ds.indriStarting} · ${selectedDistrict.district}`,
      detail: `${year} (${ds.cropLabels[cropKey]})`,
    });
    try {
      const res = await fetch('/api/district-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: selectedDistrict.district,
          region: selectedDistrict.region,
          year,
          crop: ds.cropLabels[cropKey],
          yieldDeltaPct: activeMetrics.yieldDelta,
          waterDeltaPct: activeMetrics.waterDelta,
          oniIndex: activeMetrics.oniIndex,
          customQuestion: customQuestion.trim() || undefined,
          ragContext: selectedDistrict.ragNotes,
          lang,
        }),
      });

      const data = (await res.json()) as { diagnostic?: string; error?: string };
      if (!res.ok || !data.diagnostic) {
        setAiError(data.error ?? `${ds.errorDiagnosticPrefix} HTTP ${res.status}`);
        emitIndriActivity({ state: 'idle' });
        return;
      }
      setAiDiagnostic(data.diagnostic);
      emitIndriActivity({
        state: 'speaking',
        label: `${ds.indriDone} · ${selectedDistrict.district}`,
        detail: `${ds.cropLabels[cropKey]} (${year})`,
      });
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : ds.errorDiagnosticPrefix);
      emitIndriActivity({ state: 'idle' });
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyDiag = async () => {
    if (!aiDiagnostic) return;
    try {
      await navigator.clipboard.writeText(aiDiagnostic);
      setCopiedDiag(true);
      setTimeout(() => setCopiedDiag(false), 2000);
    } catch {
      setCopiedDiag(false);
    }
  };

  const handleSelectDistrict = useCallback((districtName: string) => {
    setSelectedDistrictName(districtName);
    setAiDiagnostic(null);
    setAiError(null);
  }, []);

  return (
    <div className="mt-6 space-y-6">
      {/* Control Toolbar: Year, Crop, QLoRA Dataset Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-md border border-zinc-200 bg-[#F9F8F4] p-0.5">
            <button
              type="button"
              onClick={() => {
                setYear(2027);
                setAiDiagnostic(null);
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                year === 2027 ? 'bg-amber-700 text-white' : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              {ds.year2027Btn}
            </button>
            <button
              type="button"
              onClick={() => {
                setYear(2028);
                setAiDiagnostic(null);
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                year === 2028 ? 'bg-[#1E3A8A] text-white' : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              {ds.year2028Btn}
            </button>
          </div>

          <div className="inline-flex flex-wrap rounded-md border border-zinc-200 bg-[#F9F8F4] p-0.5">
            {(['rice', 'maize', 'exportCrop'] as CropMetricKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCropKey(key);
                  setAiDiagnostic(null);
                }}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  cropKey === key
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {ds.cropLabels[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJsonlPreview((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <FileJson className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
            {ds.qloraBtn}
          </button>
          <button
            type="button"
            onClick={handleDownloadJsonl}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {ds.downloadJsonlBtn}
          </button>
        </div>
      </div>

      {/* Collapsible QLoRA JSONL Preview + Recommended Params */}
      {showJsonlPreview && (
        <div className="grid grid-cols-1 gap-6 rounded-lg border border-zinc-200 bg-white p-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold text-zinc-900">
              {ds.qloraPreviewLabel} ({districts.length * 6} lines)
            </p>
            <pre className="mt-2.5 overflow-x-auto rounded-md bg-[#0F172A] p-4 font-mono text-[11px] leading-relaxed text-emerald-300">
              <code>{JSON.stringify(JSON.parse(sampleJsonlRecord), null, 2)}</code>
            </pre>
          </div>
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold text-zinc-900">{ds.qloraHyperTitle}</p>
            <div className="mt-2.5 divide-y divide-zinc-100 rounded-md border border-zinc-200">
              {qloraParams.map((hp) => (
                <div key={hp.param} className="p-3 text-xs">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-zinc-900">{hp.param}</span>
                    <span className="font-mono text-[#1E3A8A]">{hp.value}</span>
                  </div>
                  <p className="mt-1 text-zinc-600">{hp.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Workspace: Interactive Map + Gemini RAG Diagnostic + Per-District Report Export */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Left: Interactive Madagascar 42-District Google Map + SVG Toggle */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">
                  {ds.mapCardTitle} ({year})
                </h3>
                <p className="text-xs text-zinc-500">{ds.mapCardSubtitle}</p>
              </div>

              <div className="inline-flex rounded-md border border-zinc-200 bg-[#F9F8F4] p-0.5">
                <button
                  type="button"
                  onClick={() => setMapMode('google')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    mapMode === 'google'
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {ds.googleMapsBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('svg')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    mapMode === 'svg'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {ds.svgSchemaBtn}
                </button>
              </div>
            </div>

            {/* Dual Color Mode Switcher */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-zinc-600">{ds.layerModeLabel}</span>
              <div className="inline-flex rounded-md border border-zinc-200 bg-[#F9F8F4] p-0.5">
                <button
                  type="button"
                  onClick={() => setColorMode('yield')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    colorMode === 'yield'
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {ds.layerYieldBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode('risk')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    colorMode === 'risk'
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {ds.layerRiskBtn}
                </button>
              </div>
            </div>

            {mapMode === 'google' ? (
              <div className="mt-3">
                <MadagascarGoogleMap
                  districts={districts}
                  selectedDistrict={selectedDistrict}
                  year={year}
                  cropLabel={ds.cropLabels[cropKey]}
                  colorMode={colorMode}
                  getDistrictMetrics={getDistrictMetrics}
                  getYieldColor={getYieldColor}
                  getRiskTierStyle={getRiskTierStyle}
                  onSelectDistrict={handleSelectDistrict}
                  onTriggerDiagnostic={handleRunGeminiDiagnostic}
                />
              </div>
            ) : (
              <div className="mt-3 overflow-hidden rounded-md border border-zinc-200 bg-[#F4F7FA] p-3">
                <svg
                  viewBox="0 0 360 480"
                  role="img"
                  aria-label={ds.mapCardTitle}
                  className="mx-auto h-auto max-h-[430px] w-full"
                >
                  <path
                    d="M236,28 L254,58 L266,95 L268,142 L252,188 L236,245 L220,310 L202,380 L176,435 L142,448 L96,434 L78,395 L82,340 L92,285 L112,235 L128,185 L155,142 L182,102 L212,55 Z"
                    fill="#FFFFFF"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                  />

                  {districts.map((pt) => {
                    const { x, y } = projectPoint(pt.lat, pt.lon);
                    const { yieldDelta } = getDistrictMetrics(pt);
                    const style =
                      colorMode === 'risk'
                        ? getRiskTierStyle(pt.riskTier)
                        : getYieldColor(yieldDelta);
                    const isSelected = pt.district === selectedDistrict.district;

                    return (
                      <g
                        key={pt.district}
                        role="button"
                        tabIndex={0}
                        aria-label={`${pt.district} (${pt.region}) : ${yieldDelta >= 0 ? '+' : ''}${yieldDelta}%`}
                        onClick={() => handleSelectDistrict(pt.district)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectDistrict(pt.district);
                          }
                        }}
                        className="cursor-pointer focus:outline-none"
                      >
                        {isSelected && (
                          <circle
                            cx={x}
                            cy={y}
                            r={12}
                            fill="none"
                            stroke="#18181B"
                            strokeWidth="2"
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 7.5 : 5.2}
                          fill={style.fill}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        {isSelected && (
                          <g transform={`translate(${x > 210 ? x - 10 : x + 10}, ${y - 8})`}>
                            <text
                              textAnchor={x > 210 ? 'end' : 'start'}
                              fontSize="10.5"
                              fontWeight="700"
                              fill="#18181B"
                            >
                              {pt.district} ({yieldDelta >= 0 ? '+' : ''}{yieldDelta}%)
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Color Scale Legend + District Normalization Check */}
          <div className="mt-4 space-y-2.5 border-t border-zinc-100 pt-3 text-xs">
            {colorMode === 'yield' ? (
              <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-600">
                <span>RdYlGn :</span>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                  <span className="text-rose-700">● {ds.legendSevere}</span>
                  <span className="text-amber-700">● {ds.legendMod}</span>
                  <span className="text-emerald-700">● {ds.legendRebound}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-600">
                <span>{ds.layerRiskBtn} :</span>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
                  <span className="text-[#DC2626]">● {ds.legendDrought}</span>
                  <span className="text-[#D97706]">● {ds.legendMixed}</span>
                  <span className="text-[#2563EB]">● {ds.legendFlood}</span>
                </div>
              </div>
            )}
            <div className="rounded bg-[#F9F8F4] px-3 py-2 font-mono text-[11px] text-zinc-600">
              {ds.geoNormTitle} : <strong className="text-zinc-900">{selectedDistrict.district}</strong> →{' '}
              <span className="text-[#1E3A8A]">{normalizeDistrictName(selectedDistrict.geoBoundariesName)}</span>{' '}
              (ADM2 : {selectedDistrict.geoBoundariesName})
            </div>
          </div>
        </div>

        {/* Right: District Metrics + Report Generation + RAG Excerpts + Live Gemini AI Synthesis */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                  <span>
                    {selectedDistrict.region} · {getLocalizedDistrictProfileLabel(selectedDistrict.profile, lang)}
                  </span>
                </div>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-zinc-900">
                  {selectedDistrict.district} ({year})
                </h3>
              </div>

              <select
                aria-label={rCopy.selectDistrictAria}
                value={selectedDistrict.district}
                onChange={(e) => {
                  setSelectedDistrictName(e.target.value);
                  setAiDiagnostic(null);
                  setAiError(null);
                }}
                className="rounded-md border border-zinc-300 bg-[#F9F8F4] px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
              >
                {districts.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            {/* 3 Tabular Quantitative Readouts */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3">
                <span className="block text-[11px] text-zinc-500">{ds.cropLabels[cropKey]}</span>
                <span
                  className={`mt-1 block font-mono text-xl font-semibold tabular-nums ${
                    activeMetrics.yieldDelta < 0 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {activeMetrics.yieldDelta >= 0 ? '+' : ''}
                  {activeMetrics.yieldDelta} %
                </span>
              </div>
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3">
                <span className="block text-[11px] text-zinc-500">{ds.waterAnomalyLabel}</span>
                <span
                  className={`mt-1 block font-mono text-xl font-semibold tabular-nums ${
                    activeMetrics.waterDelta < 0 ? 'text-amber-800' : 'text-[#1E3A8A]'
                  }`}
                >
                  {activeMetrics.waterDelta >= 0 ? '+' : ''}
                  {activeMetrics.waterDelta} %
                </span>
              </div>
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3">
                <span className="block text-[11px] text-zinc-500">{ds.oniIndexLabel}</span>
                <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                  {activeMetrics.oniIndex >= 0 ? '+' : ''}
                  {activeMetrics.oniIndex.toFixed(1)} °C
                </span>
              </div>
            </div>

            {/* District Report Generation Card (PDF / Word / Excel / Studio) */}
            <div className="mt-4 rounded-md border border-[#1E3A8A]/25 bg-[#F9F8F4] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A]">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{rCopy.title} · {selectedDistrict.district}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-600">{rCopy.subtitle}</p>
                </div>
                {selectedDistrictEco && (
                  <div className="text-right font-mono text-[11px]">
                    <span className="block text-zinc-500">{rCopy.ecoLossLbl}</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {formatCurrencyFromMUsd(selectedDistrictEco.totalLossMUsd, 'USD', false, lang)} (
                      −{formatPct(selectedDistrictEco.agriShockPct, 1, lang)})
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDistrictReportExport('pdf')}
                  disabled={exportBusy !== null}
                  className="inline-flex items-center gap-1.5 rounded bg-rose-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-rose-800 disabled:opacity-60"
                >
                  {exportBusy === 'pdf' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{rCopy.pdfBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDistrictReportExport('word')}
                  disabled={exportBusy !== null}
                  className="inline-flex items-center gap-1.5 rounded bg-[#1E3A8A] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60"
                >
                  {exportBusy === 'word' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{rCopy.wordBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDistrictReportExport('excel')}
                  disabled={exportBusy !== null}
                  className="inline-flex items-center gap-1.5 rounded bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                >
                  {exportBusy === 'excel' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{rCopy.excelBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenDistrictReportStudio}
                  className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                >
                  <span>{rCopy.studioBtn}</span>
                </button>

                {exportDone && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    {rCopy.exportedOk}
                  </span>
                )}
              </div>

              <p className="mt-2 border-t border-zinc-200/80 pt-1.5 text-[10.5px] text-zinc-500">
                {lic.licenseLabel} : <strong className="text-zinc-700">{lic.licenseHolder}</strong> · DG :{' '}
                <strong className="text-zinc-700">{lic.directorName}</strong>
              </p>
            </div>

            {/* RAG Context Chunks */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-700">{ds.ragNotesTitle}</p>
              <ul className="mt-2 space-y-2">
                {selectedDistrict.ragNotes.map((note) => (
                  <li
                    key={note}
                    className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3 text-xs leading-relaxed text-zinc-700"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Custom Question + Gemini Trigger */}
            <div className="mt-5">
              <label htmlFor="rag-question" className="block text-xs font-semibold text-zinc-700">
                {ds.customQuestionLabel}
              </label>
              <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  id="rag-question"
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={`${ds.customQuestionPlaceholder} (${selectedDistrict.district})`}
                  className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#1E3A8A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleRunGeminiDiagnostic}
                  disabled={loadingAi}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  {loadingAi ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      {ds.askGeminiLoading}
                    </>
                  ) : (
                    <>
                      <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                      {ds.askGeminiBtn}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Live AI Diagnostic Result or Error State */}
          <div className="mt-5 border-t border-zinc-100 pt-4">
            {aiError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-md border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{aiError}</span>
              </div>
            )}

            {aiDiagnostic ? (
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                  <span className="font-mono text-[11px] font-semibold text-[#1E3A8A]">
                    {ds.geminiDiagnosticTitle}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDiag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    {copiedDiag ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                        {ui.common.copied}
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-3 w-3" aria-hidden="true" />
                        {ds.copyDiagnostic}
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-2.5 whitespace-pre-wrap text-xs leading-relaxed text-zinc-800">
                  {aiDiagnostic}
                </div>
              </div>
            ) : !aiError ? (
              <p className="text-xs text-zinc-500">{ds.emptyDiagnosticText}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
