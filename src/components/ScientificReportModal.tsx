import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Cpu,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  Loader2,
  X,
} from 'lucide-react';
import {
  useLanguage,
  type LanguageCode,
  type WorldLanguageCode,
} from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getLocalizedDistrictChoroplethData } from '../i18n/localizedMlEconomicData';
import {
  formatCurrencyFromMUsd,
  formatPct,
  SCENARIO_META_BY_LANG,
  type CurrencyCode,
  type HorizonYear,
  type ScenarioKey,
  type ScopeMode,
} from '../utils/economicAggregation';
import { captureLiveChartsFromDom } from '../utils/reportChartCanvas';
import {
  buildScientificReportPayload,
  exportScientificExcel,
  exportScientificPdf,
  exportScientificWord,
  type FocusDistrictReportContext,
} from '../utils/scientificReportGenerator';
import {
  computeZoneConsolidatedAnalysis,
  ZONAL_DEFINITIONS,
  type RegionalBlocZoneId,
} from '../utils/zonalEnsoAnalysis';
import {
  exportZonalReportExcel,
  exportZonalReportPdf,
  exportZonalReportWord,
} from '../utils/zonalReportGenerator';

type ModalTab = 'overview' | 'narrative' | 'norms' | 'techniques';

interface ModalLabels {
  headerTag: string;
  title: string;
  subtitle: string;
  paramsTitle: string;
  horizonLbl: string;
  scenarioLbl: string;
  scopeLbl: string;
  currencyLbl: string;
  districtLbl: string;
  allDistrictsOption: string;
  annexLbl: string;
  annexRegions: string;
  annexDistricts: string;
  annexContinental: string;
  tabs: Record<ModalTab, string>;
  exportPdfBtn: string;
  exportWordBtn: string;
  exportExcelBtn: string;
  exportedMsg: string;
  closeAria: string;
}

const MODAL_LABELS: Record<WorldLanguageCode, ModalLabels> = {
  fr: {
    headerTag: 'STUDIO ÉDITORIAL SCIENTIFIQUE · RAPPORT À LA DEMANDE',
    title: 'Générateur de Rapport Statistique & Narratif (PDF · Word · Excel)',
    subtitle:
      'Générez instantanément une revue scientifique structurée aux normes IMRAD / OMM / FAO avec graphiques intégrés, commentaires analytiques, matrice d’action et agrégation multi-échelles.',
    paramsTitle: 'Paramètres actifs du rapport',
    horizonLbl: 'Horizon',
    scenarioLbl: 'Scénario',
    scopeLbl: 'Périmètre',
    currencyLbl: 'Devise',
    districtLbl: 'Focus District (optionnel)',
    allDistrictsOption: 'Rapport national & continental global (sans focus unique)',
    annexLbl: 'Annexes statistiques :',
    annexRegions: '23 Régions',
    annexDistricts: '42 Districts',
    annexContinental: 'COI / COMESA / SADC / Afrique',
    tabs: {
      overview: 'Synthèse & 4 Graphes',
      narrative: 'Commentaires & Recommandations (IMRAD)',
      norms: 'Normes de rédaction',
      techniques: 'Techniques & Architecture ML',
    },
    exportPdfBtn: 'Exporter PDF (.pdf)',
    exportWordBtn: 'Exporter Word (.docx)',
    exportExcelBtn: 'Exporter Excel (.xlsx)',
    exportedMsg: 'Fichier généré et téléchargé',
    closeAria: 'Fermer le studio de rapport scientifique',
  },
  en: {
    headerTag: 'SCIENTIFIC EDITORIAL STUDIO · ON-DEMAND REPORTING',
    title: 'Statistical & Narrative Scientific Report Studio (PDF · Word · Excel)',
    subtitle:
      'Generate a structured peer-review report complying with IMRAD / WMO / FAO editorial standards, with embedded charts, expert commentary, action matrix, and multi-scale tables.',
    paramsTitle: 'Active Report Parameters',
    horizonLbl: 'Horizon',
    scenarioLbl: 'Scenario',
    scopeLbl: 'Scope',
    currencyLbl: 'Currency',
    districtLbl: 'Focus District (optional)',
    allDistrictsOption: 'Full national & continental brief (no single district focus)',
    annexLbl: 'Statistical Annexes:',
    annexRegions: '23 Regions',
    annexDistricts: '42 Districts',
    annexContinental: 'IOC / COMESA / SADC / Africa',
    tabs: {
      overview: 'Summary & 4 Charts',
      narrative: 'Commentary & Recommendations (IMRAD)',
      norms: 'Editorial Standards',
      techniques: 'ML & Analytical Pipeline',
    },
    exportPdfBtn: 'Export PDF (.pdf)',
    exportWordBtn: 'Export Word (.docx)',
    exportExcelBtn: 'Export Excel (.xlsx)',
    exportedMsg: 'Report generated and downloaded',
    closeAria: 'Close scientific report modal',
  },
  sw: {
    headerTag: 'STUDIO YA UHARIRI WA KISAYANSI · RIPOTI KWA MAHITAJI',
    title: 'Kiundaji cha Ripoti ya Kisayansi na Takwimu (PDF · Word · Excel)',
    subtitle:
      'Tengeneza ripoti ya kisayansi inayofuata viwango vya IMRAD / WMO / FAO ikiwa na michoro, uchambuzi, mapendekezo na jedwali za ngazi zote.',
    paramsTitle: 'Vigezo vya Ripoti',
    horizonLbl: 'Mwaka',
    scenarioLbl: 'Hali',
    scopeLbl: 'Upeo',
    currencyLbl: 'Sarafu',
    districtLbl: 'Wilaya Maalumu (hiari)',
    allDistrictsOption: 'Ripoti ya kitaifa na kikanda kwa ujumla',
    annexLbl: 'Viambatisho vya takwimu:',
    annexRegions: 'Mikoa 23',
    annexDistricts: 'Wilaya 42',
    annexContinental: 'COI / COMESA / SADC / Afrika',
    tabs: {
      overview: 'Muhtasari & Chati 4',
      narrative: 'Uchambuzi & Mapendekezo (IMRAD)',
      norms: 'Viwango vya Uandishi',
      techniques: 'Mbinu za ML',
    },
    exportPdfBtn: 'Pakua PDF (.pdf)',
    exportWordBtn: 'Pakua Word (.docx)',
    exportExcelBtn: 'Pakua Excel (.xlsx)',
    exportedMsg: 'Faili imeundwa na kupakuliwa',
    closeAria: 'Funga dirisha la ripoti',
  },
  es: {
    headerTag: 'ESTUDIO EDITORIAL CIENTÍFICO · INFORME A LA CARTA',
    title: 'Estudio de Informes Científicos y Estadísticos (PDF · Word · Excel)',
    subtitle:
      'Genere informes estructurados IMRAD / OMM / FAO con gráficos de trayectoria 2027–2032, comentarios analíticos y matriz de recomendaciones.',
    paramsTitle: 'Parámetros activos',
    horizonLbl: 'Horizonte',
    scenarioLbl: 'Escenario',
    scopeLbl: 'Alcance',
    currencyLbl: 'Moneda',
    districtLbl: 'Distrito prioritario',
    allDistrictsOption: 'Informe nacional y continental completo',
    annexLbl: 'Anexos estadísticos:',
    annexRegions: '23 Regiones',
    annexDistricts: '42 Distritos',
    annexContinental: 'COI / COMESA / SADC / África',
    tabs: {
      overview: 'Resumen y 4 Gráficos',
      narrative: 'Comentarios y Recomendaciones',
      norms: 'Normas editoriales',
      techniques: 'Técnicas ML',
    },
    exportPdfBtn: 'Exportar PDF (.pdf)',
    exportWordBtn: 'Exportar Word (.docx)',
    exportExcelBtn: 'Exportar Excel (.xlsx)',
    exportedMsg: 'Archivo generado y descargado',
    closeAria: 'Cerrar modal de informe',
  },
  ar: {
    headerTag: 'الاستوديو العلمي · تقارير إحصائية وتحليلية فورية',
    title: 'مولد التقارير العلمية والإحصائية (PDF · Word · Excel)',
    subtitle:
      'إنشاء تقارير علمية متكاملة وفق معايير IMRAD و WMO و FAO متضمنة الرسوم البيانية، التعليق التحليلي، ومصفوفة التوصيات.',
    paramsTitle: 'معايير التقرير النشطة',
    horizonLbl: 'الأفق الزمني',
    scenarioLbl: 'السيناريو',
    scopeLbl: 'النطاق',
    currencyLbl: 'العملة',
    districtLbl: 'التركيز الإقليمي',
    allDistrictsOption: 'تقرير وطني وقاري شامل',
    annexLbl: 'الملاحق الإحصائية:',
    annexRegions: '23 إقليماً',
    annexDistricts: '42 مقاطعة',
    annexContinental: 'أفريقيا والمحيط الهندي',
    tabs: {
      overview: 'الملخص والرسوم الأربعة',
      narrative: 'التعليق التحليلي والتوصيات',
      norms: 'المعايير العلمية',
      techniques: 'هندسة التعلم الآلي',
    },
    exportPdfBtn: 'تصدير PDF',
    exportWordBtn: 'تصدير Word (.docx)',
    exportExcelBtn: 'تصدير Excel (.xlsx)',
    exportedMsg: 'تم إنشاء وتنزيل الملف',
    closeAria: 'إغلاق نافذة التقرير',
  },
  zh: {
    headerTag: '科学出版工作室 · 按需统计与分析报告',
    title: '科学统计与叙事报告生成器 (PDF · Word · Excel)',
    subtitle:
      '即时生成符合 IMRAD / WMO / FAO 标准的专业报告，内含 2027–2032 轨迹图表、专家评论与行动建议矩阵。',
    paramsTitle: '当前报告参数',
    horizonLbl: '预测年份',
    scenarioLbl: '气候情景',
    scopeLbl: '覆盖范围',
    currencyLbl: '货币单位',
    districtLbl: '重点区县（可选）',
    allDistrictsOption: '全国与非洲大陆综合报告',
    annexLbl: '统计附表：',
    annexRegions: '23 大区',
    annexDistricts: '42 试点区县',
    annexContinental: '印度洋 / SADC / COMESA / 非洲',
    tabs: {
      overview: '概览与 4 幅图表',
      narrative: '深度评论与行动建议',
      norms: '编辑与科学标准',
      techniques: '机器学习流程',
    },
    exportPdfBtn: '导出 PDF (.pdf)',
    exportWordBtn: '导出 Word (.docx)',
    exportExcelBtn: '导出 Excel (.xlsx)',
    exportedMsg: '报告已生成并下载',
    closeAria: '关闭科学报告窗口',
  },
  pt: {
    headerTag: 'ESTÚDIO EDITORIAL CIENTÍFICO · RELATÓRIO SOB DEMANDA',
    title: 'Gerador de Relatório Científico e Estatístico (PDF · Word · Excel)',
    subtitle:
      'Gere relatórios estruturados IMRAD / OMM / FAO com gráficos incorporados, comentários analíticos e matriz de recomendações.',
    paramsTitle: 'Parâmetros ativos',
    horizonLbl: 'Horizonte',
    scenarioLbl: 'Cenário',
    scopeLbl: 'Escopo',
    currencyLbl: 'Moeda',
    districtLbl: 'Distrito em foco',
    allDistrictsOption: 'Relatório nacional e continental completo',
    annexLbl: 'Anexos estatísticos:',
    annexRegions: '23 Regiões',
    annexDistricts: '42 Distritos',
    annexContinental: 'COI / COMESA / SADC / África',
    tabs: {
      overview: 'Resumo e 4 Gráficos',
      narrative: 'Comentários e Recomendações',
      norms: 'Normas editoriais',
      techniques: 'Técnicas ML',
    },
    exportPdfBtn: 'Exportar PDF (.pdf)',
    exportWordBtn: 'Exportar Word (.docx)',
    exportExcelBtn: 'Exportar Excel (.xlsx)',
    exportedMsg: 'Arquivo gerado e baixado',
    closeAria: 'Fechar estúdio de relatório',
  },
  hi: {
    headerTag: 'वैज्ञानिक संपादकीय स्टूडियो · ऑन-डिमांड रिपोर्ट',
    title: 'सांख्यिकीय व वैज्ञानिक रिपोर्ट स्टूडियो (PDF · Word · Excel)',
    subtitle:
      'एम्बेडेड चार्ट, विशेषज्ञ टिप्पणी और कार्य योजना मैट्रिक्स के साथ IMRAD / WMO / FAO मानक रिपोर्ट तैयार करें।',
    paramsTitle: 'सक्रिय रिपोर्ट पैरामीटर',
    horizonLbl: 'वर्ष',
    scenarioLbl: 'परिदृश्य',
    scopeLbl: 'दायरा',
    currencyLbl: 'मुद्रा',
    districtLbl: 'विशेष जिला (वैकल्पिक)',
    allDistrictsOption: 'पूर्ण राष्ट्रीय व महाद्वीपीय रिपोर्ट',
    annexLbl: 'सांख्यिकीय अनुलग्नक:',
    annexRegions: '23 क्षेत्र',
    annexDistricts: '42 जिले',
    annexContinental: 'हिंद महासागर / SADC / अफ्रीका',
    tabs: {
      overview: 'सारांश और 4 चार्ट',
      narrative: 'विश्लेषण व सिफारिशें',
      norms: 'वैज्ञानिक मानक',
      techniques: 'ML मॉडलिंग',
    },
    exportPdfBtn: 'PDF निर्यात (.pdf)',
    exportWordBtn: 'Word निर्यात (.docx)',
    exportExcelBtn: 'Excel निर्यात (.xlsx)',
    exportedMsg: 'फ़ाइल डाउनलोड हो गई',
    closeAria: 'रिपोर्ट विंडो बंद करें',
  },
  ru: {
    headerTag: 'НАУЧНАЯ СТУДИЯ · СТАТИСТИЧЕСКИЕ И АНАЛИТИЧЕСКИЕ ОТЧЁТЫ',
    title: 'Генератор научных отчётов (PDF · Word · Excel)',
    subtitle:
      'Создавайте отчёты по стандартам IMRAD / ВМО / ФАО со встроенными графиками 2027–2032, аналитическими комментариями и матрицей мер.',
    paramsTitle: 'Активные параметры отчёта',
    horizonLbl: 'Горизонт',
    scenarioLbl: 'Сценарий',
    scopeLbl: 'Охват',
    currencyLbl: 'Валюта',
    districtLbl: 'Фокус-район',
    allDistrictsOption: 'Полный национальный и континентальный отчёт',
    annexLbl: 'Статистические приложения:',
    annexRegions: '23 региона',
    annexDistricts: '42 района',
    annexContinental: 'COI / COMESA / SADC / Африка',
    tabs: {
      overview: 'Сводка и 4 графика',
      narrative: 'Комментарии и рекомендации',
      norms: 'Научные стандарты',
      techniques: 'ML-архитектура',
    },
    exportPdfBtn: 'Экспорт PDF (.pdf)',
    exportWordBtn: 'Экспорт Word (.docx)',
    exportExcelBtn: 'Экспорт Excel (.xlsx)',
    exportedMsg: 'Файл сформирован и скачан',
    closeAria: 'Закрыть окно отчёта',
  },
};

export interface OpenReportEventDetail {
  horizonYear?: HorizonYear;
  scenario?: ScenarioKey;
  scope?: ScopeMode;
  currency?: CurrencyCode;
  focusDistrict?: FocusDistrictReportContext;
}

export type StudioZoneSelection = 'madagascar-global' | 'consolidated-all-13' | RegionalBlocZoneId;

export function ScientificReportModal() {
  const { lang, worldLang, actions } = useLanguage();
  const { user, saveAnalysisSnapshot } = useAuth();
  const labels = MODAL_LABELS[worldLang];
  const districts = useMemo(() => getLocalizedDistrictChoroplethData(lang as LanguageCode), [lang]);
  const [savedNotice, setSavedNotice] = useState(false);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [horizonYear, setHorizonYear] = useState<HorizonYear>(2027);
  const [scenario, setScenario] = useState<ScenarioKey>('s2');
  const [scope, setScope] = useState<ScopeMode>('consolidated119');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedZoneReport, setSelectedZoneReport] =
    useState<StudioZoneSelection>('madagascar-global');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('');
  const [customFocusContext, setCustomFocusContext] = useState<
    FocusDistrictReportContext | undefined
  >(undefined);

  const [includeRegions23, setIncludeRegions23] = useState(true);
  const [includeDistricts42, setIncludeDistricts42] = useState(true);
  const [includeContinental, setIncludeContinental] = useState(true);

  const [busyFormat, setBusyFormat] = useState<'pdf' | 'word' | 'excel' | null>(null);
  const [lastExported, setLastExported] = useState<'pdf' | 'word' | 'excel' | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<OpenReportEventDetail | undefined>).detail;
      if (detail?.horizonYear) setHorizonYear(detail.horizonYear);
      if (detail?.scenario) setScenario(detail.scenario);
      if (detail?.scope) setScope(detail.scope);
      if (detail?.currency) setCurrency(detail.currency);
      if (detail?.focusDistrict) {
        setSelectedDistrictName(detail.focusDistrict.district);
        setCustomFocusContext(detail.focusDistrict);
      }
      setOpen(true);
    };
    window.addEventListener('open-scientific-report', handler);
    return () => window.removeEventListener('open-scientific-report', handler);
  }, []);

  const effectiveFocusDistrict: FocusDistrictReportContext | undefined = useMemo(() => {
    if (!selectedDistrictName) return undefined;
    if (
      customFocusContext &&
      customFocusContext.district.toLowerCase() === selectedDistrictName.toLowerCase()
    ) {
      return customFocusContext;
    }
    return { district: selectedDistrictName };
  }, [selectedDistrictName, customFocusContext]);

  const payload = useMemo(() => {
    if (!open) return null;
    return buildScientificReportPayload({
      horizonYear,
      scenario,
      scope,
      currency,
      lang,
      includeRegions23,
      includeDistricts42,
      includeContinental,
      focusDistrict: effectiveFocusDistrict,
    });
  }, [
    open,
    horizonYear,
    scenario,
    scope,
    currency,
    lang,
    includeRegions23,
    includeDistricts42,
    includeContinental,
    effectiveFocusDistrict,
  ]);

  const activeZoneSummary = useMemo(() => {
    if (selectedZoneReport === 'madagascar-global' || selectedZoneReport === 'consolidated-all-13') {
      return null;
    }
    return computeZoneConsolidatedAnalysis({
      zoneId: selectedZoneReport,
      year: horizonYear,
      scenario,
    });
  }, [selectedZoneReport, horizonYear, scenario]);

  if (!open || !payload) return null;

  const runExport = async (fmt: 'pdf' | 'word' | 'excel') => {
    setBusyFormat(fmt);
    setLastExported(null);
    try {
      if (selectedZoneReport !== 'madagascar-global') {
        const zonalOpts = {
          zoneId:
            selectedZoneReport === 'consolidated-all-13'
              ? ('ocean-indien-coi' as RegionalBlocZoneId)
              : selectedZoneReport,
          reportScope:
            selectedZoneReport === 'consolidated-all-13'
              ? ('consolidated-all-13' as const)
              : ('single-zone' as const),
          year: horizonYear,
          scenario,
          currency,
          lang,
        };
        if (fmt === 'pdf') await exportZonalReportPdf(zonalOpts);
        else if (fmt === 'word') await exportZonalReportWord(zonalOpts);
        else exportZonalReportExcel(zonalOpts);
      } else {
        const liveDomCharts = fmt === 'excel' ? undefined : await captureLiveChartsFromDom();
        const opts = {
          horizonYear,
          scenario,
          scope,
          currency,
          lang,
          includeRegions23,
          includeDistricts42,
          includeContinental,
          focusDistrict: effectiveFocusDistrict,
          liveDomCharts,
        };
        if (fmt === 'pdf') exportScientificPdf(opts);
        else if (fmt === 'word') await exportScientificWord(opts);
        else exportScientificExcel(opts);
      }
      setLastExported(fmt);
      setTimeout(() => setLastExported(null), 3000);
    } finally {
      setBusyFormat(null);
    }
  };

  const handleSaveReportSnapshot = async () => {
    if (!user || !payload) return;
    const ok = await saveAnalysisSnapshot({
      scope: `report-${scope}`,
      regionName: effectiveFocusDistrict?.district ?? `Madagascar + Afrique (${currency})`,
      year: horizonYear,
      scenario,
      summary: `${payload.reportId}: ${payload.narrative.abstractText.slice(0, 600)}`,
    });
    if (ok) {
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 backdrop-blur-xs sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-[#F9F8F4] shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-wider text-[#1E3A8A]">
              {labels.headerTag} · {payload.reportId}
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-zinc-900 sm:text-2xl">
              {labels.title}
            </h2>
            <p className="mt-1 text-xs text-zinc-600">{labels.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={labels.closeAria}
            className="rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* License Holder Banner: M&G Consulting & DG Prince MANANTENASOA */}
        <div className="flex flex-col gap-2 border-b border-[#1E3A8A]/20 bg-[#1E3A8A] px-5 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5 text-xs">
            <Award className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            <div>
              <span className="font-semibold text-amber-200">
                {payload.license.licenseLabel} : {payload.license.licenseHolder}
              </span>
              <span className="mx-2 text-white/40">|</span>
              <span>
                {payload.license.directorLabel} :{' '}
                <strong className="font-semibold">{payload.license.directorName}</strong>
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-blue-100">
            {payload.license.directorTitle}
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Parameters & Annex Configuration */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {labels.horizonLbl}
                </label>
                <div className="mt-1 grid grid-cols-2 gap-1 rounded border border-zinc-200 bg-[#F9F8F4] p-0.5">
                  {([2027, 2028] as HorizonYear[]).map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setHorizonYear(y)}
                      className={`rounded py-1 text-xs font-semibold ${
                        horizonYear === y
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-700 hover:bg-white'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {labels.scenarioLbl}
                </label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as ScenarioKey)}
                  className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900"
                >
                  {(['s1', 's2', 's3'] as ScenarioKey[]).map((k) => (
                    <option key={k} value={k}>
                      {SCENARIO_META_BY_LANG[lang][k].shortLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {labels.scopeLbl}
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as ScopeMode)}
                  className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900"
                >
                  <option value="consolidated119">119 Districts (Full)</option>
                  <option value="pilot42">42 Districts Pilotes</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {labels.currencyLbl}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900"
                >
                  <option value="USD">USD ($)</option>
                  <option value="MGA">MGA (Ar)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {labels.districtLbl}
                </label>
                <select
                  value={selectedDistrictName}
                  onChange={(e) => setSelectedDistrictName(e.target.value)}
                  className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900"
                >
                  <option value="">{labels.allDistrictsOption}</option>
                  {districts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district} ({d.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-700">
              <div className="flex flex-wrap items-center gap-2">
                <label className="font-semibold text-zinc-600" htmlFor="studio-zone-select">
                  {lang === 'fr' ? 'Consolidation par zone (13 blocs) :' : 'Zone consolidation (13 blocs):'}
                </label>
                <select
                  id="studio-zone-select"
                  value={selectedZoneReport}
                  onChange={(e) => setSelectedZoneReport(e.target.value as StudioZoneSelection)}
                  className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1E3A8A]"
                >
                  <option value="madagascar-global">
                    {lang === 'fr'
                      ? 'Rapport IMRAD standard (Madagascar + Afrique COI/SADC/COMESA)'
                      : 'Standard IMRAD Report (Madagascar + Africa IOC/SADC/COMESA)'}
                  </option>
                  <option value="consolidated-all-13">
                    {lang === 'fr'
                      ? 'Rapport consolidé complet — Toutes les 13 zones mondiales'
                      : 'Consolidated Full Report — All 13 Global Zones'}
                  </option>
                  {ZONAL_DEFINITIONS.map((z) => (
                    <option key={z.id} value={z.id}>
                      {lang === 'fr' ? `Zone complète : ${z.nameFr}` : `Full Zone: ${z.nameEn}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="font-semibold text-zinc-500">{labels.annexLbl}</span>
                <label className="inline-flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={includeRegions23}
                    onChange={(e) => setIncludeRegions23(e.target.checked)}
                  />
                  <span>{labels.annexRegions}</span>
                </label>
                <label className="inline-flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={includeDistricts42}
                    onChange={(e) => setIncludeDistricts42(e.target.checked)}
                  />
                  <span>{labels.annexDistricts}</span>
                </label>
                <label className="inline-flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={includeContinental}
                    onChange={(e) => setIncludeContinental(e.target.checked)}
                  />
                  <span>{labels.annexContinental}</span>
                </label>
              </div>
            </div>

            {selectedZoneReport !== 'madagascar-global' && (
              <div className="mt-3 rounded-md border border-[#1E3A8A]/25 bg-[#F9F8F4] px-3.5 py-2.5 text-xs text-zinc-800">
                {activeZoneSummary ? (
                  <span>
                    <strong className="text-[#1E3A8A]">
                      {lang === 'fr' ? activeZoneSummary.definition.nameFr : activeZoneSummary.definition.nameEn}
                    </strong>{' '}
                    · {activeZoneSummary.countryCount}{' '}
                    {lang === 'fr' ? 'États' : 'States'} · {activeZoneSummary.activeLossBUsd.toFixed(2)} Md USD (
                    {activeZoneSummary.activeGdpLossPct.toFixed(2)}% PIB) ·{' '}
                    {lang === 'fr'
                      ? 'Export PDF/Word/Excel configuré en mode Rapport Complet Zonal.'
                      : 'PDF/Word/Excel export configured for Full Zonal Report.'}
                  </span>
                ) : (
                  <span>
                    <strong className="text-[#1E3A8A]">
                      {lang === 'fr' ? 'Consolidation 13 zones active' : '13-Zone Master Consolidation Active'}
                    </strong>{' '}
                    —{' '}
                    {lang === 'fr'
                      ? 'Export PDF/Word/Excel consolidant Océan Indien/COI, COMESA, SADC, ASEAN, UE, Afrique, Océanie, Amérique latine, Caraïbes, Amérique du Nord, Europe de l’Est, Moyen-Orient et Asie.'
                      : 'PDF/Word/Excel export consolidating Indian Ocean/IOC, COMESA, SADC, ASEAN, EU, Africa, Oceania, Latin America, Caribbean, North America, Eastern Europe, Middle East & Asia.'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Preview Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2.5">
            {(
              [
                { id: 'overview', icon: Layers },
                { id: 'narrative', icon: BookOpen },
                { id: 'norms', icon: FileText },
                { id: 'techniques', icon: Cpu },
              ] as const
            ).map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === id
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{labels.tabs[id]}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Overview & Live Embedded Charts */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {payload.focusedDistrictRow && (
                <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-4 text-xs">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    Focus District Actif : {payload.focusedDistrictRow.point.district} (
                    {payload.focusedDistrictRow.displayRegion} · {payload.focusedDistrictRow.province})
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <span className="block text-zinc-500">Perte unitaire totale</span>
                      <strong className="font-mono text-base text-zinc-900">
                        {formatCurrencyFromMUsd(
                          payload.focusedDistrictRow.totalLossMUsd,
                          currency,
                          false,
                          lang,
                        )}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Direct / Indirect</span>
                      <strong className="font-mono text-sm text-zinc-900">
                        {formatCurrencyFromMUsd(
                          payload.focusedDistrictRow.directAgriLossMUsd,
                          currency,
                          false,
                          lang,
                        )}{' '}
                        /{' '}
                        {formatCurrencyFromMUsd(
                          payload.focusedDistrictRow.indirectLossMUsd,
                          currency,
                          false,
                          lang,
                        )}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Choc agricole</span>
                      <strong className="font-mono text-base text-rose-700">
                        −{formatPct(payload.focusedDistrictRow.agriShockPct, 1, lang)}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Profil / Risque</span>
                      <strong className="font-mono text-sm text-[#1E3A8A]">
                        {payload.focusedDistrictRow.point.riskTier.toUpperCase()}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <span className="text-[11px] text-zinc-500">Madagascar Total</span>
                  <span className="mt-1 block font-mono text-lg font-semibold text-[#1E3A8A]">
                    {formatCurrencyFromMUsd(payload.model.madagascar.totalLossMUsd, currency, false, lang)}
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <span className="text-[11px] text-zinc-500">COI (Océan Indien)</span>
                  <span className="mt-1 block font-mono text-lg font-semibold text-zinc-900">
                    {formatCurrencyFromMUsd(payload.model.blocs.coiTotalMUsd, currency, false, lang)}
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <span className="text-[11px] text-zinc-500">SADC / COMESA</span>
                  <span className="mt-1 block font-mono text-sm font-semibold text-zinc-900">
                    {formatCurrencyFromMUsd(payload.model.blocs.sadcTotalMUsd, currency, false, lang)} /{' '}
                    {formatCurrencyFromMUsd(payload.model.blocs.comesaTotalMUsd, currency, false, lang)}
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <span className="text-[11px] text-zinc-500">Afrique (21 zones)</span>
                  <span className="mt-1 block font-mono text-lg font-semibold text-zinc-900">
                    {formatCurrencyFromMUsd(payload.model.blocs.africaTotalMUsd, currency, false, lang)}
                  </span>
                </div>
              </div>

              {/* Embedded Canvas2D Charts Preview (Exact images placed into PDF & Word) */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2">
                  <img
                    src={payload.charts.oniShock.dataUrl}
                    alt="ONI Anomaly vs Harvest Shock Chart"
                    className="h-auto w-full"
                  />
                </div>
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2">
                  <img
                    src={payload.charts.provinces.dataUrl}
                    alt="Provincial Economic Losses Chart"
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2">
                  <img
                    src={payload.charts.continental.dataUrl}
                    alt="Continental Projection Chart"
                    className="h-auto w-full"
                  />
                </div>
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2">
                  <img
                    src={payload.charts.trajectory2027_2032.dataUrl}
                    alt="2027-2032 Trajectory Chart"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: IMRAD Narrative Preview + Expert Commentary + Action Matrix */}
          {activeTab === 'narrative' && (
            <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 text-sm leading-relaxed text-zinc-800">
              <h3 className="font-serif text-xl font-semibold text-zinc-900">
                {payload.narrative.title}
              </h3>
              <p className="text-xs text-zinc-500">{payload.narrative.subtitle}</p>
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                <h4 className="font-semibold text-[#1E3A8A]">{payload.narrative.abstractTitle}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                  {payload.narrative.abstractText}
                </p>
                <p className="mt-2 text-[11px] italic text-zinc-500">{payload.narrative.keywords}</p>
              </div>
              {[
                { title: payload.narrative.s1Title, paras: payload.narrative.s1Paragraphs },
                { title: payload.narrative.s2Title, paras: payload.narrative.s2Paragraphs },
                { title: payload.narrative.s3Title, paras: payload.narrative.s3Paragraphs },
                { title: payload.narrative.s4Title, paras: payload.narrative.s4Paragraphs },
                { title: payload.narrative.commentaryTitle, paras: payload.narrative.commentaryParagraphs },
                { title: payload.narrative.s5Title, paras: payload.narrative.s5Paragraphs },
              ].map((sec) => (
                <div key={sec.title} className="border-t border-zinc-100 pt-3">
                  <h4 className="font-serif text-base font-semibold text-[#1E3A8A]">{sec.title}</h4>
                  {sec.paras.map((p, idx) => (
                    <p key={idx} className="mt-1.5 text-xs leading-relaxed text-zinc-700">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
              <div className="border-t border-zinc-100 pt-3">
                <h4 className="font-serif text-base font-semibold text-[#1E3A8A]">
                  {payload.narrative.s6Title}
                </h4>
                <ul className="mt-1.5 space-y-1.5 text-xs text-zinc-700">
                  {payload.narrative.s6Recommendations.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <div className="mt-3 overflow-x-auto rounded border border-zinc-200">
                  <table className="w-full border-collapse text-left text-[11px]">
                    <thead className="bg-[#1E3A8A] text-white">
                      <tr>
                        <th className="px-3 py-2">Actor</th>
                        <th className="px-3 py-2">Trigger</th>
                        <th className="px-3 py-2">Action</th>
                        <th className="px-3 py-2">Financing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {payload.recommendationMatrix.map((row) => (
                        <tr key={row.actor}>
                          <td className="px-3 py-2 font-semibold text-zinc-900">{row.actor}</td>
                          <td className="px-3 py-2 text-zinc-700">{row.trigger}</td>
                          <td className="px-3 py-2 text-zinc-700">{row.action}</td>
                          <td className="px-3 py-2 font-mono text-[#1E3A8A]">{row.financing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Editorial Norms */}
          {activeTab === 'norms' && (
            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                  <tr>
                    <th className="px-4 py-3">Norme / Code</th>
                    <th className="px-4 py-3">Référentiel scientifique</th>
                    <th className="px-4 py-3">Application dans ce rapport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {payload.editorialStandards.map((row) => (
                    <tr key={row.code}>
                      <td className="px-4 py-3 font-mono font-semibold text-[#1E3A8A]">
                        {row.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.standard}</td>
                      <td className="px-4 py-3 leading-relaxed text-zinc-600">{row.application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Technical Pipeline & ML */}
          {activeTab === 'techniques' && (
            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                  <tr>
                    <th className="px-4 py-3">Étape</th>
                    <th className="px-4 py-3">Technique / Modèle</th>
                    <th className="px-4 py-3">Entrées &amp; Sorties</th>
                    <th className="px-4 py-3">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {payload.technicalMethods.map((m) => (
                    <tr key={m.stage}>
                      <td className="px-4 py-3 font-semibold text-zinc-900">{m.stage}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#1E3A8A]">{m.method}</td>
                      <td className="px-4 py-3 text-zinc-600">{m.inputsOutputs}</td>
                      <td className="px-4 py-3 text-zinc-600">{m.validation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sticky Export Action Footer */}
        <div className="flex flex-col gap-3 border-t border-zinc-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-[11px] text-zinc-500">
            <strong className="text-zinc-800">{payload.license.licenseHolder}</strong> · DG :{' '}
            <strong className="text-zinc-800">{payload.license.directorName}</strong>
            {lastExported && (
              <span className="ml-3 inline-flex items-center gap-1 font-semibold text-emerald-700">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                {labels.exportedMsg} ({lastExported.toUpperCase()})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user && (
              <button
                type="button"
                onClick={handleSaveReportSnapshot}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3 py-2 text-xs font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>{savedNotice ? actions.savedOk : actions.saveSnapshot}</span>
              </button>
            )}
            <button
              type="button"
              disabled={busyFormat !== null}
              onClick={() => runExport('pdf')}
              className="inline-flex items-center gap-1.5 rounded-md bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
            >
              {busyFormat === 'pdf' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>{labels.exportPdfBtn}</span>
            </button>

            <button
              type="button"
              disabled={busyFormat !== null}
              onClick={() => runExport('word')}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#172554] disabled:opacity-60"
            >
              {busyFormat === 'word' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              <span>{labels.exportWordBtn}</span>
            </button>

            <button
              type="button"
              disabled={busyFormat !== null}
              onClick={() => runExport('excel')}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {busyFormat === 'excel' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-3.5 w-3.5" />
              )}
              <span>{labels.exportExcelBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
