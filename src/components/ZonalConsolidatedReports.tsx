import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Check,
  Compass,
  Download,
  FileSpreadsheet,
  FileText,
  Globe2,
  Loader2,
  Search,
} from 'lucide-react';
import type { ForecastYear } from '../data/worldEnso195Data';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import {
  EUR_PER_USD,
  MGA_PER_USD,
  type CurrencyCode,
  type ScenarioKey,
} from '../utils/economicAggregation';
import { emitIndriActivity } from '../utils/indriEvents';
import {
  computeAll13ZonesConsolidated,
  computeZoneConsolidatedAnalysis,
  FORECAST_YEARS_6,
  type RegionalBlocZoneId,
} from '../utils/zonalEnsoAnalysis';
import {
  exportZonalReportCsv,
  exportZonalReportExcel,
  exportZonalReportPdf,
  exportZonalReportWord,
  type ZonalReportScope,
} from '../utils/zonalReportGenerator';

interface ZonalUiCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  yearLbl: string;
  scenarioLbl: string;
  currencyLbl: string;
  reportScopeZone: string;
  reportScopeAll: string;
  exportPdf: string;
  exportWord: string;
  exportExcel: string;
  exportCsv: string;
  exportedMsg: string;
  kpiLoss: string;
  kpiGdpPct: string;
  kpiCum: string;
  kpiInflation: string;
  kpiAtRisk: string;
  statesLabel: string;
  popLabel: string;
  droughtLabel: string;
  floodLabel: string;
  dispLabel: string;
  pillarTeleconnection: string;
  pillarAgriEnergy: string;
  pillarMacroDisp: string;
  pillarRecs: string;
  trajectoryTitle: string;
  tableTitle: string;
  searchCountry: string;
  colCountry: string;
  colPop: string;
  colGdpDelta: string;
  colLoss: string;
  colCum: string;
  colInflation: string;
  colIndices: string;
  colRisk: string;
}

const ZONAL_UI_COPY: Record<WorldLanguageCode, ZonalUiCopy> = {
  fr: {
    eyebrow: '05B · CONSOLIDATION GÉOPOLITIQUE & RAPPORTS COMPLETS PAR ZONE (13 BLOCS & RÉGIONS)',
    title: 'Analyse détaillée & Rapports El Niño consolidés par zone',
    subtitle:
      'Explorez et exportez en PDF, Word, Excel ou CSV le rapport complet El Niño (2027–2032) pour chacune des 13 zones clés : Océan Indien & COI, COMESA, SADC, ASEAN, Union Européenne, Afrique, Océanie, Amérique latine, Caraïbes, Amérique du Nord, Europe de l’Est, Moyen-Orient et Asie.',
    yearLbl: 'Année horizon',
    scenarioLbl: 'Intensité ENSO',
    currencyLbl: 'Devise rapport',
    reportScopeZone: 'Rapport complet : Zone sélectionnée',
    reportScopeAll: 'Rapport consolidé : Toutes les 13 zones',
    exportPdf: 'PDF Complet',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'Rapport zonal généré',
    kpiLoss: 'Perte PIB zonale',
    kpiGdpPct: 'Intensité (% PIB)',
    kpiCum: 'Cumul 2027–2031',
    kpiInflation: 'Choc inflation (+CPI)',
    kpiAtRisk: 'Pop. risque élevé/critique',
    statesLabel: 'États',
    popLabel: 'M hab.',
    droughtLabel: 'Séch.',
    floodLabel: 'Inond.',
    dispLabel: 'Dépl.',
    pillarTeleconnection: 'Mécanisme physique ENSO & Téléconnexion',
    pillarAgriEnergy: 'Agriculture, alimentation, eau & énergie',
    pillarMacroDisp: 'Impact macroéconomique, inflation & déplacements',
    pillarRecs: 'Recommandations stratégiques consolidées',
    trajectoryTitle: 'Trajectoire pluriannuelle des pertes (2027–2032 · Md USD)',
    tableTitle: 'Détail pays par pays de la zone active',
    searchCountry: 'Filtrer un pays de la zone…',
    colCountry: 'Pays / ISO',
    colPop: 'Pop. (M)',
    colGdpDelta: 'PIB Δ%',
    colLoss: 'Perte annuelle',
    colCum: 'Cumul 2027–31',
    colInflation: '+CPI %',
    colIndices: 'Séch. / Inond. / Dépl.',
    colRisk: 'Risque alim.',
  },
  en: {
    eyebrow: '05B · GEOPOLITICAL CONSOLIDATION & FULL ZONAL REPORTS (13 BLOCS & REGIONS)',
    title: 'Detailed Analysis & Consolidated El Niño Reports by Zone',
    subtitle:
      'Inspect and export full 2027–2032 El Niño reports (PDF, Word, Excel, CSV) across all 13 strategic zones: Indian Ocean & IOC, COMESA, SADC, ASEAN, European Union, Africa, Oceania, Latin America, Caribbean, North America, Eastern Europe, Middle East, and Asia.',
    yearLbl: 'Forecast year',
    scenarioLbl: 'ENSO severity',
    currencyLbl: 'Report currency',
    reportScopeZone: 'Full report: Selected zone',
    reportScopeAll: 'Consolidated report: All 13 zones',
    exportPdf: 'Full PDF',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'Zonal report exported',
    kpiLoss: 'Zonal GDP loss',
    kpiGdpPct: 'Intensity (% GDP)',
    kpiCum: 'Cumulative 2027–2031',
    kpiInflation: 'Inflation shock (+CPI)',
    kpiAtRisk: 'High/critical risk pop.',
    statesLabel: 'States',
    popLabel: 'M people',
    droughtLabel: 'Drought',
    floodLabel: 'Flood',
    dispLabel: 'Disp.',
    pillarTeleconnection: 'Physical ENSO & Teleconnection Mechanism',
    pillarAgriEnergy: 'Agriculture, Food, Water & Energy',
    pillarMacroDisp: 'Macroeconomics, Inflation & Climate Displacement',
    pillarRecs: 'Consolidated Strategic Recommendations',
    trajectoryTitle: 'Multi-Year Zonal Loss Trajectory (2027–2032 · Billion USD)',
    tableTitle: 'Country-by-Country Breakdown for Active Zone',
    searchCountry: 'Filter member country…',
    colCountry: 'Country / ISO',
    colPop: 'Pop. (M)',
    colGdpDelta: 'GDP Δ%',
    colLoss: 'Annual loss',
    colCum: 'Cum. 2027–31',
    colInflation: '+CPI %',
    colIndices: 'Drought / Flood / Disp.',
    colRisk: 'Food risk',
  },
  sw: {
    eyebrow: '05B · UCHUNGUZI WA KANDA NA RIPOTI KAMILI ZA EL NIÑO (KANDA 13)',
    title: 'Uchambuzi wa Kina na Ripoti Zilizounganishwa kwa Kila Kanda',
    subtitle:
      'Chunguza na upakue ripoti kamili (PDF, Word, Excel, CSV) kwa kanda zote 13: Bahari ya Hindi & COI, COMESA, SADC, ASEAN, EU, Afrika, Oceania, Amerika ya Kusini, Karibi, Amerika Kaskazini, Ulaya Mashariki, Mashariki ya Kati na Asia.',
    yearLbl: 'Mwaka',
    scenarioLbl: 'Ukali wa ENSO',
    currencyLbl: 'Sarafu',
    reportScopeZone: 'Ripoti kamili: Kanda iliyochaguliwa',
    reportScopeAll: 'Ripoti kuu: Kanda zote 13',
    exportPdf: 'PDF Kamili',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'Ripoti imeundwa',
    kpiLoss: 'Hasara ya GDP',
    kpiGdpPct: 'Uzito (% GDP)',
    kpiCum: 'Jumla 2027–2031',
    kpiInflation: 'Mfumuko wa bei (+CPI)',
    kpiAtRisk: 'Watu hatarini',
    statesLabel: 'Nchi',
    popLabel: 'M watu',
    droughtLabel: 'Ukame',
    floodLabel: 'Mafuriko',
    dispLabel: 'Uhamisho',
    pillarTeleconnection: 'Mekaniki ya ENSO',
    pillarAgriEnergy: 'Kilimo, Maji & Nishati',
    pillarMacroDisp: 'Uchumi Mkuu & Uhamisho',
    pillarRecs: 'Mapendekezo ya Kimkakati',
    trajectoryTitle: 'Mwelekeo wa Hasara 2027–2032 (Bilioni USD)',
    tableTitle: 'Orodha ya Nchi Wanachama',
    searchCountry: 'Tafuta nchi…',
    colCountry: 'Nchi / ISO',
    colPop: 'Watu (M)',
    colGdpDelta: 'GDP Δ%',
    colLoss: 'Hasara',
    colCum: 'Jumla 27–31',
    colInflation: '+CPI %',
    colIndices: 'Ukame / Mafuriko / Uhamisho',
    colRisk: 'Hatari chakula',
  },
  es: {
    eyebrow: '05B · CONSOLIDACIÓN REGIONAL E INFORMES COMPLETOS POR ZONA (13 ZONAS)',
    title: 'Análisis detallado e informes El Niño consolidados por zona',
    subtitle:
      'Consulta y exporta informes completos (PDF, Word, Excel, CSV) de las 13 zonas: Océano Índico/COI, COMESA, SADC, ASEAN, UE, África, Oceanía, América Latina, Caribe, Norteamérica, Europa del Este, Oriente Medio y Asia.',
    yearLbl: 'Año horizonte',
    scenarioLbl: 'Severidad ENSO',
    currencyLbl: 'Moneda',
    reportScopeZone: 'Informe completo: Zona seleccionada',
    reportScopeAll: 'Informe consolidado: Las 13 zonas',
    exportPdf: 'PDF Completo',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'Informe exportado',
    kpiLoss: 'Pérdida PIB zonal',
    kpiGdpPct: 'Intensidad (% PIB)',
    kpiCum: 'Acumulado 2027–2031',
    kpiInflation: 'Inflación (+CPI)',
    kpiAtRisk: 'Pob. riesgo alto/crítico',
    statesLabel: 'Estados',
    popLabel: 'M hab.',
    droughtLabel: 'Sequía',
    floodLabel: 'Inund.',
    dispLabel: 'Despl.',
    pillarTeleconnection: 'Mecanismo físico ENSO y teleconexión',
    pillarAgriEnergy: 'Agricultura, alimentación, agua y energía',
    pillarMacroDisp: 'Macroeconomía, inflación y desplazamientos',
    pillarRecs: 'Recomendaciones estratégicas consolidadas',
    trajectoryTitle: 'Trayectoria 2027–2032 de pérdidas zonales (Miles de millones USD)',
    tableTitle: 'Desglose país por país de la zona activa',
    searchCountry: 'Filtrar país…',
    colCountry: 'País / ISO',
    colPop: 'Pob. (M)',
    colGdpDelta: 'PIB Δ%',
    colLoss: 'Pérdida anual',
    colCum: 'Acum. 27–31',
    colInflation: '+CPI %',
    colIndices: 'Sequía / Inund. / Despl.',
    colRisk: 'Riesgo alim.',
  },
  ar: {
    eyebrow: '05B · التوحيد الجيوسياسي والتقارير الشاملة حسب المنطقة (13 إقليماً وتكتلاً)',
    title: 'تحليل مفصل وتقارير النينيو المجمعة حسب المنطقة',
    subtitle:
      'استعرض وصدّر تقارير شاملة (PDF, Word, Excel, CSV) لجميع المناطق الـ 13: المحيط الهندي وCOI، الكوميسا، السادك، الآسيان، الاتحاد الأوروبي، أفريقيا، أوقيانوسيا، أمريكا اللاتينية، الكاريبي، أمريكا الشمالية، أوروبا الشرقية، الشرق الأوسط وآسيا.',
    yearLbl: 'السنة',
    scenarioLbl: 'شدة النينيو',
    currencyLbl: 'العملة',
    reportScopeZone: 'تقرير كامل: المنطقة المحددة',
    reportScopeAll: 'تقرير موحد: المناطق الـ 13 كافة',
    exportPdf: 'PDF كامل',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'تم إنشاء التقرير',
    kpiLoss: 'خسارة الناتج المحلي',
    kpiGdpPct: 'النسبة من الناتج',
    kpiCum: 'التراكمي 2027–2031',
    kpiInflation: 'التضخم الإضافي',
    kpiAtRisk: 'السكان المعرضون للخطر',
    statesLabel: 'دولة',
    popLabel: 'مليون نسمة',
    droughtLabel: 'جفاف',
    floodLabel: 'فيضانات',
    dispLabel: 'نزوح',
    pillarTeleconnection: 'آلية النينيو والربط المناخي',
    pillarAgriEnergy: 'الزراعة والغذاء والمياه والطاقة',
    pillarMacroDisp: 'الاقتصاد الكلي والتضخم والنزوح',
    pillarRecs: 'التوصيات الاستراتيجية الموحدة',
    trajectoryTitle: 'مسار الخسائر 2027–2032 (مليار دولار)',
    tableTitle: 'تفصيل الدول الأعضاء في المنطقة',
    searchCountry: 'ابحث عن دولة…',
    colCountry: 'الدولة / الرمز',
    colPop: 'السكان (م)',
    colGdpDelta: 'تغير الناتج',
    colLoss: 'الخسارة السنوية',
    colCum: 'التراكمي 27–31',
    colInflation: 'التضخم +%',
    colIndices: 'جفاف / فيضان / نزوح',
    colRisk: 'خطر الغذاء',
  },
  zh: {
    eyebrow: '05B · 13 大区域与国际组织厄尔尼诺深度分析与汇总报告',
    title: '按地理区域与组织划分的厄尔尼诺详尽分析与完整报告',
    subtitle:
      '支持印度洋与COI、COMESA、SADC、东盟(ASEAN)、欧盟(EU)、非洲、大洋洲、拉丁美洲、加勒比、北美、东欧、中东和亚洲 13 大区域的完整分析及 PDF/Word/Excel/CSV 报告导出。',
    yearLbl: '预测年份',
    scenarioLbl: 'ENSO 强度',
    currencyLbl: '货币单位',
    reportScopeZone: '完整报告：当前选定区域',
    reportScopeAll: '汇总报告：全部 13 个区域',
    exportPdf: '完整 PDF',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: '区域报告已生成',
    kpiLoss: '区域 GDP 损失',
    kpiGdpPct: '占区域 GDP 比重',
    kpiCum: '2027–2031 累计',
    kpiInflation: '通胀附加 (+CPI)',
    kpiAtRisk: '高风险人口',
    statesLabel: '个国家',
    popLabel: '百万人口',
    droughtLabel: '干旱',
    floodLabel: '洪涝',
    dispLabel: '迁徙',
    pillarTeleconnection: 'ENSO 物理机制与遥相关',
    pillarAgriEnergy: '农业、粮食、水资源与能源',
    pillarMacroDisp: '宏观经济、通胀与气候人口迁徙',
    pillarRecs: '汇总战略建议',
    trajectoryTitle: '2027–2032 年区域损失轨迹（十亿美元）',
    tableTitle: '选定区域成员国逐国明细',
    searchCountry: '筛选成员国…',
    colCountry: '国家 / ISO',
    colPop: '人口 (M)',
    colGdpDelta: 'GDP Δ%',
    colLoss: '年度损失',
    colCum: '27–31 累计',
    colInflation: '+CPI %',
    colIndices: '干旱 / 洪涝 / 迁徙',
    colRisk: '粮食风险',
  },
  pt: {
    eyebrow: '05B · CONSOLIDAÇÃO REGIONAL E RELATÓRIOS COMPLETOS POR ZONA (13 BLOCOS)',
    title: 'Análise detalhada e relatórios El Niño consolidados por zona',
    subtitle:
      'Consulte e exporte relatórios completos (PDF, Word, Excel, CSV) para todas as 13 zonas: Oceano Índico/COI, COMESA, SADC, ASEAN, UE, África, Oceania, América Latina, Caribe, América do Norte, Leste Europeu, Oriente Médio e Ásia.',
    yearLbl: 'Ano horizonte',
    scenarioLbl: 'Severidade ENSO',
    currencyLbl: 'Moeda',
    reportScopeZone: 'Relatório completo: Zona selecionada',
    reportScopeAll: 'Relatório consolidado: Todas as 13 zonas',
    exportPdf: 'PDF Completo',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'Relatório gerado',
    kpiLoss: 'Perda PIB zonal',
    kpiGdpPct: 'Intensidade (% PIB)',
    kpiCum: 'Acumulado 2027–2031',
    kpiInflation: 'Choque inflação (+CPI)',
    kpiAtRisk: 'Pop. alto risco',
    statesLabel: 'Estados',
    popLabel: 'M hab.',
    droughtLabel: 'Seca',
    floodLabel: 'Cheias',
    dispLabel: 'Desloc.',
    pillarTeleconnection: 'Mecanismo físico ENSO e teleconexão',
    pillarAgriEnergy: 'Agricultura, alimentação, água e energia',
    pillarMacroDisp: 'Macroeconomia, inflação e deslocamentos',
    pillarRecs: 'Recomendações estratégicas consolidadas',
    trajectoryTitle: 'Trajetória 2027–2032 de perdas (Bilhões USD)',
    tableTitle: 'Detalhe por país da zona ativa',
    searchCountry: 'Filtrar país…',
    colCountry: 'País / ISO',
    colPop: 'Pop. (M)',
    colGdpDelta: 'PIB Δ%',
    colLoss: 'Perda anual',
    colCum: 'Acum. 27–31',
    colInflation: '+CPI %',
    colIndices: 'Seca / Cheias / Desloc.',
    colRisk: 'Risco alim.',
  },
  hi: {
    eyebrow: '05B · 13 वैश्विक क्षेत्रों और समूहों की समेकित एल नीनो रिपोर्ट',
    title: 'प्रत्येक क्षेत्र के अनुसार विस्तृत विश्लेषण और समेकित एल नीनो रिपोर्ट',
    subtitle:
      'हिंद महासागर/COI, COMESA, SADC, ASEAN, यूरोपीय संघ, अफ्रीका, ओशिनिया, लैटिन अमेरिका, कैरेबियन, उत्तरी अमेरिका, पूर्वी यूरोप, मध्य पूर्व और एशिया की पूर्ण रिपोर्ट (PDF, Word, Excel, CSV) देखें और निर्यात करें।',
    yearLbl: 'वर्ष',
    scenarioLbl: 'ENSO तीव्रता',
    currencyLbl: 'मुद्रा',
    reportScopeZone: 'पूर्ण रिपोर्ट: चयनित क्षेत्र',
    reportScopeAll: 'समेकित रिपोर्ट: सभी 13 क्षेत्र',
    exportPdf: 'पूर्ण PDF',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'रिपोर्ट तैयार',
    kpiLoss: 'क्षेत्रीय GDP हानि',
    kpiGdpPct: 'तीव्रता (% GDP)',
    kpiCum: '2027–2031 संचयी',
    kpiInflation: 'मुद्रास्फीति (+CPI)',
    kpiAtRisk: 'उच्च जोखिम जनसंख्या',
    statesLabel: 'देश',
    popLabel: 'M लोग',
    droughtLabel: 'सूखा',
    floodLabel: 'बाढ़',
    dispLabel: 'विस्थापन',
    pillarTeleconnection: 'ENSO भौतिकी एवं टेलीकनेक्शन',
    pillarAgriEnergy: 'कृषि, खाद्य, जल एवं ऊर्जा',
    pillarMacroDisp: 'मैक्रोइकॉनॉमिक्स, मुद्रास्फीति एवं विस्थापन',
    pillarRecs: 'समेकित रणनीतिक सिफारिशें',
    trajectoryTitle: '2027–2032 क्षेत्रीय हानि प्रक्षेपवक्र (अरब USD)',
    tableTitle: 'सक्रिय क्षेत्र के सदस्य देशों का विवरण',
    searchCountry: 'देश खोजें…',
    colCountry: 'देश / ISO',
    colPop: 'जनसंख्या (M)',
    colGdpDelta: 'GDP Δ%',
    colLoss: 'वार्षिक हानि',
    colCum: 'संचयी 27–31',
    colInflation: '+CPI %',
    colIndices: 'सूखा / बाढ़ / विस्थापन',
    colRisk: 'खाद्य जोखिम',
  },
  ru: {
    eyebrow: '05B · КОНСОЛИДИРОВАННЫЙ АНАЛИЗ И ПОЛНЫЕ ОТЧЁТЫ ПО 13 ЗОНАМ И БЛОКАМ',
    title: 'Детальный анализ и сводные отчёты Эль-Ниньо по региональным зонам',
    subtitle:
      'Изучайте и экспортируйте полные отчёты (PDF, Word, Excel, CSV) по всем 13 зонам: Индийский океан/COI, COMESA, SADC, ASEAN, ЕС, Африка, Океания, Латинская Америка, Карибы, Северная Америка, Восточная Европа, Ближний Восток и Азия.',
    yearLbl: 'Горизонт',
    scenarioLbl: 'Сценарий ENSO',
    currencyLbl: 'Валюта',
    reportScopeZone: 'Полный отчёт: Выбранная зона',
    reportScopeAll: 'Сводный отчёт: Все 13 зон',
    exportPdf: 'Полный PDF',
    exportWord: 'Word (.docx)',
    exportExcel: 'Excel (.xlsx)',
    exportCsv: 'CSV',
    exportedMsg: 'Отчёт экспортирован',
    kpiLoss: 'Потери ВВП зоны',
    kpiGdpPct: 'Доля ВВП (%)',
    kpiCum: 'Сумма 2027–2031',
    kpiInflation: 'Инфляция (+CPI)',
    kpiAtRisk: 'Население в зоне риска',
    statesLabel: 'стран',
    popLabel: 'млн чел.',
    droughtLabel: 'Засуха',
    floodLabel: 'Паводки',
    dispLabel: 'Мигр.',
    pillarTeleconnection: 'Физика ENSO и телесвязи',
    pillarAgriEnergy: 'Сельское хозяйство, вода и энергетика',
    pillarMacroDisp: 'Макроэкономика, инфляция и миграция',
    pillarRecs: 'Сводные стратегические рекомендации',
    trajectoryTitle: 'Траектория потерь зоны на 2027–2032 гг. (млрд USD)',
    tableTitle: 'Детализация по странам выбранной зоны',
    searchCountry: 'Фильтр по стране…',
    colCountry: 'Страна / ISO',
    colPop: 'Нас. (M)',
    colGdpDelta: 'ВВП Δ%',
    colLoss: 'Годовые потери',
    colCum: 'Сумма 27–31',
    colInflation: '+CPI %',
    colIndices: 'Засуха / Паводки / Мигр.',
    colRisk: 'Прод. риск',
  },
};

function formatZoneLossCurrency(bUsd: number, currency: CurrencyCode): string {
  if (currency === 'EUR') return `${(bUsd * EUR_PER_USD).toFixed(2)} Md €`;
  if (currency === 'MGA') return `${((bUsd * MGA_PER_USD) / 1000).toFixed(1)} T Ar`;
  return `${bUsd.toFixed(2)} Md $`;
}

export function ZonalConsolidatedReports() {
  const { lang, worldLang } = useLanguage();
  const { syncState, hasLiveScrape } = useGlobalSync();
  const copy = ZONAL_UI_COPY[worldLang];
  const isFr = worldLang === 'fr';

  const [selectedZoneId, setSelectedZoneId] = useState<RegionalBlocZoneId>('ocean-indien-coi');
  const [selectedYear, setSelectedYear] = useState<ForecastYear>(2027);
  const [scenario, setScenario] = useState<ScenarioKey>('s2');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [reportScope, setReportScope] = useState<ZonalReportScope>('single-zone');
  const [countrySearch, setCountrySearch] = useState('');
  const [busyFormat, setBusyFormat] = useState<'pdf' | 'word' | 'excel' | 'csv' | null>(null);
  const [exportedFlag, setExportedFlag] = useState<string | null>(null);

  const liveFactor = hasLiveScrape ? syncState.zoneFactors.afrique.gdpLossFactor : 1;

  const all13Zones = useMemo(
    () =>
      computeAll13ZonesConsolidated({
        year: selectedYear,
        scenario,
        liveFactor,
      }),
    [selectedYear, scenario, liveFactor],
  );

  const activeZone = useMemo(
    () =>
      computeZoneConsolidatedAnalysis({
        zoneId: selectedZoneId,
        year: selectedYear,
        scenario,
        liveFactor,
      }),
    [selectedZoneId, selectedYear, scenario, liveFactor],
  );

  const filteredMembers = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return activeZone.members;
    return activeZone.members.filter((m) => {
      const n = `${m.country.nameFr} ${m.country.nameEn} ${m.country.iso2}`.toLowerCase();
      return n.includes(q);
    });
  }, [activeZone.members, countrySearch]);

  const handleExport = async (format: 'pdf' | 'word' | 'excel' | 'csv') => {
    setBusyFormat(format);
    setExportedFlag(null);
    const opts = {
      zoneId: selectedZoneId,
      reportScope,
      year: selectedYear,
      scenario,
      currency,
      lang,
      liveFactor,
    };

    try {
      let filename = '';
      if (format === 'pdf') filename = await exportZonalReportPdf(opts);
      else if (format === 'word') filename = await exportZonalReportWord(opts);
      else if (format === 'excel') filename = exportZonalReportExcel(opts);
      else filename = exportZonalReportCsv(opts);

      setExportedFlag(`${format.toUpperCase()} · ${filename}`);
      emitIndriActivity({
        state: 'speaking',
        label: copy.exportedMsg,
        detail: filename,
      });
      setTimeout(() => setExportedFlag(null), 4000);
    } finally {
      setBusyFormat(null);
    }
  };

  return (
    <section
      id="rapports-zones"
      className="border-b border-zinc-200 bg-white py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">{copy.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-[78ch] text-base leading-relaxed text-zinc-600">
            {copy.subtitle}
          </p>

          {/* Controls + Report Export Bar */}
          <div className="mt-6 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-3">
                <label
                  htmlFor="zonal-year-select"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                >
                  {copy.yearLbl}
                </label>
                <select
                  id="zonal-year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value) as ForecastYear)}
                  className="mt-1.5 min-h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  {FORECAST_YEARS_6.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <label
                  htmlFor="zonal-scenario-select"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                >
                  {copy.scenarioLbl}
                </label>
                <select
                  id="zonal-scenario-select"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as ScenarioKey)}
                  className="mt-1.5 min-h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="s1">S1 · {isFr ? 'Modéré (×0,55)' : 'Mild (×0.55)'}</option>
                  <option value="s2">S2 · {isFr ? 'Base ML (×1,00)' : 'Baseline (×1.00)'}</option>
                  <option value="s3">S3 · {isFr ? 'Extrême (×1,45)' : 'Severe (×1.45)'}</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="zonal-currency-select"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                >
                  {copy.currencyLbl}
                </label>
                <select
                  id="zonal-currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="mt-1.5 min-h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="MGA">MGA (Ar)</option>
                </select>
              </div>

              <div className="lg:col-span-4">
                <div
                  role="group"
                  aria-label="Report consolidation scope"
                  className="grid grid-cols-2 gap-1.5 rounded-md border border-zinc-200 bg-white p-1"
                >
                  <button
                    type="button"
                    onClick={() => setReportScope('single-zone')}
                    className={`min-h-9 rounded px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                      reportScope === 'single-zone'
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {copy.reportScopeZone}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportScope('consolidated-all-13')}
                    className={`min-h-9 rounded px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                      reportScope === 'consolidated-all-13'
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {copy.reportScopeAll}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-3.5">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Globe2 className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                <span className="font-semibold text-zinc-900">
                  {reportScope === 'consolidated-all-13'
                    ? copy.reportScopeAll
                    : isFr
                      ? activeZone.definition.nameFr
                      : activeZone.definition.nameEn}
                </span>
                {exportedFlag && (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    {exportedFlag}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={busyFormat !== null}
                  onClick={() => handleExport('pdf')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-800 disabled:opacity-60"
                >
                  {busyFormat === 'pdf' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{copy.exportPdf}</span>
                </button>

                <button
                  type="button"
                  disabled={busyFormat !== null}
                  onClick={() => handleExport('word')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60"
                >
                  {busyFormat === 'word' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{copy.exportWord}</span>
                </button>

                <button
                  type="button"
                  disabled={busyFormat !== null}
                  onClick={() => handleExport('excel')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                >
                  {busyFormat === 'excel' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{copy.exportExcel}</span>
                </button>

                <button
                  type="button"
                  disabled={busyFormat !== null}
                  onClick={() => handleExport('csv')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                  <span>{copy.exportCsv}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 13-Zone Consolidated Comparative Grid */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {all13Zones.map((zone) => {
            const isSelected = zone.definition.id === selectedZoneId;
            return (
              <button
                key={zone.definition.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedZoneId(zone.definition.id)}
                className={`flex flex-col justify-between rounded-lg border p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                    : 'border-zinc-200 bg-[#F9F8F4] text-zinc-900 hover:border-zinc-400 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className={isSelected ? 'text-blue-100' : 'text-[#1E3A8A] font-semibold'}>
                      {zone.definition.code}
                    </span>
                    <span className={isSelected ? 'text-blue-100' : 'text-zinc-500'}>
                      {zone.countryCount} {copy.statesLabel}
                    </span>
                  </div>
                  <p className="mt-1.5 font-serif text-sm font-semibold leading-snug">
                    {isFr ? zone.definition.nameFr : zone.definition.nameEn}
                  </p>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-current/15 pt-2 text-xs font-mono tabular-nums">
                  <span className="font-semibold">
                    {formatZoneLossCurrency(zone.activeLossBUsd, currency)}
                  </span>
                  <span className={isSelected ? 'text-blue-100' : 'text-zinc-600'}>
                    {zone.activeGdpLossPct.toFixed(2)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep-Dive Dossier for Active Zone */}
        <div className="mt-10 space-y-6 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Compass className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>{isFr ? activeZone.definition.groupLabelFr : activeZone.definition.groupLabelEn}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#1E3A8A]">
                  {isFr ? activeZone.dominantRegimeFr : activeZone.dominantRegimeEn}
                </span>
              </div>
              <h3 className="mt-1.5 font-serif text-2xl font-semibold text-zinc-900">
                {isFr ? activeZone.definition.nameFr : activeZone.definition.nameEn}
              </h3>
              <p className="mt-1.5 max-w-[82ch] text-xs leading-relaxed text-zinc-600">
                {isFr ? activeZone.definition.perimeterNoteFr : activeZone.definition.perimeterNoteEn}
              </p>
            </div>

            <div className="text-xs font-mono text-zinc-700 tabular-nums shrink-0">
              {activeZone.countryCount} {copy.statesLabel} · {activeZone.totalPopM.toFixed(1)}{' '}
              {copy.popLabel}
            </div>
          </div>

          {/* 5 Zonal KPI Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="block text-[11px] font-medium text-zinc-500">
                {copy.kpiLoss} ({selectedYear})
              </span>
              <span className="mt-1 block font-mono text-xl font-semibold text-[#1E3A8A] tabular-nums">
                {formatZoneLossCurrency(activeZone.activeLossBUsd, currency)}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="block text-[11px] font-medium text-zinc-500">{copy.kpiGdpPct}</span>
              <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                {activeZone.activeGdpLossPct.toFixed(2)}%
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="block text-[11px] font-medium text-zinc-500">{copy.kpiCum}</span>
              <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                {formatZoneLossCurrency(activeZone.cumulative2027_2031BUsd, currency)}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="block text-[11px] font-medium text-zinc-500">{copy.kpiInflation}</span>
              <span className="mt-1 block font-mono text-xl font-semibold text-amber-800 tabular-nums">
                +{activeZone.avgInflationAddPct.toFixed(1)}%
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <span className="block text-[11px] font-medium text-zinc-500">{copy.kpiAtRisk}</span>
              <span className="mt-1 block font-mono text-xl font-semibold text-rose-700 tabular-nums">
                {activeZone.criticalHighPopM.toFixed(1)} M
              </span>
            </div>
          </div>

          {/* 4 Analytical Pillars + 2027-2032 Trajectory Chart */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <h4 className="text-sm font-semibold text-[#1E3A8A]">
                  {copy.pillarTeleconnection}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                  {isFr ? activeZone.definition.teleconnectionFr : activeZone.definition.teleconnectionEn}
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <h4 className="text-sm font-semibold text-[#1E3A8A]">{copy.pillarAgriEnergy}</h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                  {isFr
                    ? activeZone.definition.agricultureEnergyFr
                    : activeZone.definition.agricultureEnergyEn}
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <h4 className="text-sm font-semibold text-[#1E3A8A]">{copy.pillarMacroDisp}</h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                  {isFr
                    ? activeZone.definition.macroDisplacementFr
                    : activeZone.definition.macroDisplacementEn}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <h4 className="text-sm font-semibold text-zinc-900">{copy.trajectoryTitle}</h4>
                <div className="mt-4 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeZone.trajectory2027_2032}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value: unknown) => [`${Number(value).toFixed(2)} Md $`, copy.kpiLoss]}
                      />
                      <Bar dataKey="lossBUsd" fill="#1E3A8A" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-zinc-100 pt-3 text-center text-xs font-mono tabular-nums">
                  <div>
                    <span className="block text-[10px] text-zinc-500">{copy.droughtLabel}</span>
                    <strong className="text-amber-800">{activeZone.avgDroughtIdx}/99</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500">{copy.floodLabel}</span>
                    <strong className="text-[#1E3A8A]">{activeZone.avgFloodIdx}/99</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500">{copy.dispLabel}</span>
                    <strong className="text-rose-700">{activeZone.avgDisplacementIdx}/99</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <h4 className="text-sm font-semibold text-emerald-800">{copy.pillarRecs}</h4>
                <ol className="mt-2.5 list-decimal space-y-2 pl-4 text-xs leading-relaxed text-zinc-700">
                  {(isFr
                    ? activeZone.definition.recommendationsFr
                    : activeZone.definition.recommendationsEn
                  ).map((rec) => (
                    <li key={rec}>{rec}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Complete Country Breakdown Table for Selected Zone */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-serif text-lg font-semibold text-zinc-900">
                {copy.tableTitle} ({filteredMembers.length})
              </h4>

              <div className="relative min-w-[240px]">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder={copy.searchCountry}
                  aria-label={copy.searchCountry}
                  className="min-h-10 w-full rounded-md border border-zinc-300 bg-white pr-3 pl-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#1E3A8A] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-2.5 pr-3">{copy.colCountry}</th>
                    <th className="py-2.5 px-2 text-right">{copy.colPop}</th>
                    <th className="py-2.5 px-2 text-right">{copy.colGdpDelta}</th>
                    <th className="py-2.5 px-2 text-right">{copy.colLoss}</th>
                    <th className="py-2.5 px-2 text-right">{copy.colCum}</th>
                    <th className="py-2.5 px-2 text-right">{copy.colInflation}</th>
                    <th className="py-2.5 px-2 text-right">{copy.colIndices}</th>
                    <th className="py-2.5 pl-2 text-right">{copy.colRisk}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.country.iso2} className="hover:bg-[#F9F8F4]/70">
                      <td className="py-2.5 pr-3 font-semibold text-zinc-900">
                        {isFr ? m.country.nameFr : m.country.nameEn}{' '}
                        <span className="font-mono text-[11px] font-normal text-zinc-500">
                          · {m.country.iso2}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {m.country.popM.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-rose-700 tabular-nums">
                        {m.gdpDeltaPct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-semibold text-zinc-900 tabular-nums">
                        {formatZoneLossCurrency(m.lossBUsd, currency)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatZoneLossCurrency(m.cumulative2027_2031BUsd, currency)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-amber-800 tabular-nums">
                        +{m.inflationAddPct.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-zinc-600 tabular-nums">
                        {m.droughtIdx} / {m.floodIdx} / {m.displacementIdx}
                      </td>
                      <td className="py-2.5 pl-2 text-right font-semibold text-zinc-800">
                        {m.famineRisk}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
