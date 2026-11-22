import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Check, Download, FileText, Layers, ShieldCheck, Sprout, Thermometer } from 'lucide-react';
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
  FORECAST_YEARS_6,
  ZONAL_DEFINITIONS,
  type RegionalBlocZoneId,
} from '../utils/zonalEnsoAnalysis';
import {
  buildComparativeVisualReportData,
  exportComparativeZonalDashboardCsv,
  exportComparativeZonalDashboardPdf,
  ZONAL_COMPARISON_PRESETS,
} from '../utils/zonalImpactComparison';

interface DashboardCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  presetsLabel: string;
  selectAllBtn: string;
  selectedCountLabel: string;
  yearLbl: string;
  scenarioLbl: string;
  currencyLbl: string;
  exportPdfBtn: string;
  reportCoopNote: string;
  exportCsvBtn: string;
  exportedMsg: string;
  cardIntensity: string;
  cardAgriRisk: string;
  cardResilience: string;
  cardFootprint: string;
  chart1Title: string;
  chart1Sub: string;
  chart2Title: string;
  chart2Sub: string;
  chart3Title: string;
  chart3Sub: string;
  tableTitle: string;
  colZone: string;
  colIntensity: string;
  colDroughtFlood: string;
  colCpi: string;
  colAgriRisk: string;
  colCommodities: string;
  colLossGdp: string;
  colRecovery: string;
  colResilience: string;
  legendIntensity: string;
  legendDrought: string;
  legendFlood: string;
  legendDisplacement: string;
  legendAgri: string;
  legendResilience: string;
}

const DASHBOARD_COPY: Record<WorldLanguageCode, DashboardCopy> = {
  fr: {
    eyebrow: '05C · TABLEAU COMPARATIF MULTI-ZONES (INTENSITÉ · RISQUE AGRICOLE · RÉSILIENCE)',
    title: 'Zonal Impact Dashboard — Comparateur visuel interactif',
    subtitle:
      'Sélectionnez plusieurs zones géopolitiques ou économiques (COI, COMESA, SADC, ASEAN, UE, Amérique latine, etc.) pour générer un rapport visuel comparatif des indices d’intensité El Niño, des risques agricoles et de la résilience économique.',
    presetsLabel: 'Jeux comparatifs rapides :',
    selectAllBtn: 'Toutes les 13 zones',
    selectedCountLabel: 'zones comparées',
    yearLbl: 'Horizon',
    scenarioLbl: 'Scénario',
    currencyLbl: 'Devise',
    exportPdfBtn: 'Télécharger le Rapport (PDF)',
    reportCoopNote: 'PDF A4 multi-pages prêt à imprimer pour coopératives (hors ligne)',
    exportCsvBtn: 'Exporter Tableau CSV',
    exportedMsg: 'Rapport coopératif généré',
    cardIntensity: 'Intensité El Niño maximale',
    cardAgriRisk: 'Risque agricole le plus aigu',
    cardResilience: 'Meilleure résilience économique',
    cardFootprint: 'Empreinte comparée',
    chart1Title: '1. Indices d’intensité El Niño & chocs climatiques (0–100)',
    chart1Sub: 'Indice composite ENSO, sécheresse, inondations et pression de déplacement par zone sélectionnée.',
    chart2Title: '2. Profil radar multi-risques & résilience (jusqu’à 6 zones)',
    chart2Sub: 'Superposition comparative de la sécheresse, des crues, de l’inflation CPI, du risque agricole et de la résilience.',
    chart3Title: '3. Risque agricole vs. Indice de résilience économique (0–100)',
    chart3Sub: 'Écart structurel entre vulnérabilité alimentaire et capacité d’absorption macroéconomique.',
    tableTitle: 'Matrice comparative détaillée des zones sélectionnées',
    colZone: 'Zone / Bloc',
    colIntensity: 'Intensité ENSO',
    colDroughtFlood: 'Séch. / Inond.',
    colCpi: '+CPI %',
    colAgriRisk: 'Risque agri & pop.',
    colCommodities: 'Filières clés exposées',
    colLossGdp: 'Perte & % PIB',
    colRecovery: 'Reprise 27→32',
    colResilience: 'Résilience éco.',
    legendIntensity: 'Intensité ENSO',
    legendDrought: 'Sécheresse',
    legendFlood: 'Inondations',
    legendDisplacement: 'Déplacement',
    legendAgri: 'Risque Agricole',
    legendResilience: 'Résilience Éco.',
  },
  en: {
    eyebrow: '05C · MULTI-ZONE BENCHMARK (INTENSITY · AGRICULTURAL RISK · ECONOMIC RESILIENCE)',
    title: 'Zonal Impact Dashboard — Comparative Visual Report',
    subtitle:
      'Select two or more geopolitical or economic zones (IOC, COMESA, SADC, ASEAN, EU, Africa, Latin America, etc.) to dynamically generate a side-by-side visual report of El Niño intensity indices, agricultural risks, and economic resilience metrics.',
    presetsLabel: 'Quick comparison presets:',
    selectAllBtn: 'All 13 Zones',
    selectedCountLabel: 'zones compared',
    yearLbl: 'Year',
    scenarioLbl: 'Scenario',
    currencyLbl: 'Currency',
    exportPdfBtn: 'Download Report (PDF)',
    reportCoopNote: 'Printable multi-page A4 PDF brief for offline agricultural cooperatives',
    exportCsvBtn: 'Export Benchmark CSV',
    exportedMsg: 'Cooperative report downloaded',
    cardIntensity: 'Peak El Niño Intensity',
    cardAgriRisk: 'Highest Agricultural Risk',
    cardResilience: 'Strongest Economic Resilience',
    cardFootprint: 'Compared Footprint',
    chart1Title: '1. El Niño Intensity Indices & Hazard Comparison (0–100)',
    chart1Sub: 'Composite ENSO intensity, drought index, flood exposure, and displacement pressure across selected zones.',
    chart2Title: '2. Multi-Axis Hazard & Resilience Radar (Up to 6 Zones)',
    chart2Sub: 'Overlaid profile across drought, flood, food CPI inflation, agricultural risk, and resilience capacity.',
    chart3Title: '3. Agricultural Risk vs. Economic Resilience Index (0–100)',
    chart3Sub: 'Structural gap between farm/food supply vulnerability and macroeconomic shock absorption.',
    tableTitle: 'Comparative Benchmark Matrix Across Selected Regions',
    colZone: 'Zone / Bloc',
    colIntensity: 'ENSO Intensity',
    colDroughtFlood: 'Drought / Flood',
    colCpi: '+CPI %',
    colAgriRisk: 'Agri Risk & Exposed Pop.',
    colCommodities: 'Key Commodities at Risk',
    colLossGdp: 'Loss & % GDP',
    colRecovery: '27→32 Recovery',
    colResilience: 'Eco. Resilience',
    legendIntensity: 'ENSO Intensity',
    legendDrought: 'Drought',
    legendFlood: 'Floods',
    legendDisplacement: 'Displacement',
    legendAgri: 'Agri Risk',
    legendResilience: 'Eco. Resilience',
  },
  sw: {
    eyebrow: '05C · DASHIBODI YA ATHARI ZA KANDA (UKALI · HATARI YA KILIMO · USTAHIMILIVU)',
    title: 'Zonal Impact Dashboard — Ripoti Linganishi ya Taswira',
    subtitle:
      'Chagua kanda nyingi (COI, COMESA, SADC, ASEAN, EU, Afrika, n.k.) kuona ripoti linganishi ya fahirisi za ukali wa El Niño, hatari za kilimo na ustahimilivu wa kiuchumi.',
    presetsLabel: 'Mipangilio ya haraka:',
    selectAllBtn: 'Kanda zote 13',
    selectedCountLabel: 'kanda zimechaguliwa',
    yearLbl: 'Mwaka',
    scenarioLbl: 'Hali',
    currencyLbl: 'Sarafu',
    exportPdfBtn: 'Pakua Ripoti (PDF)',
    reportCoopNote: 'Ripoti ya PDF inayochapishwa kwa vyama vya ushirika (nje ya mtandao)',
    exportCsvBtn: 'Pakua CSV',
    exportedMsg: 'Ripoti imetengenezwa',
    cardIntensity: 'Ukali Mkuu wa El Niño',
    cardAgriRisk: 'Hatari Kubwa ya Kilimo',
    cardResilience: 'Ustahimilivu Bora wa Uchumi',
    cardFootprint: 'Upeo Uliochaguliwa',
    chart1Title: '1. Fahirisi za Ukali wa El Niño (0–100)',
    chart1Sub: 'Ukali wa ENSO, ukame, mafuriko na shinikizo la uhamisho kwa kila kanda.',
    chart2Title: '2. Rada ya Hatari na Ustahimilivu (hadi Kanda 6)',
    chart2Sub: 'Ulinganisho wa ukame, mafuriko, mfumuko wa bei, hatari ya kilimo na ustahimilivu.',
    chart3Title: '3. Hatari ya Kilimo vs. Ustahimilivu wa Uchumi (0–100)',
    chart3Sub: 'Pengo kati ya hatari ya chakula na uwezo wa kiuchumi kuhimili mshtuko.',
    tableTitle: 'Jedwali Linganishi la Kanda Zilizochaguliwa',
    colZone: 'Kanda',
    colIntensity: 'Ukali ENSO',
    colDroughtFlood: 'Ukame / Mafuriko',
    colCpi: '+CPI %',
    colAgriRisk: 'Hatari Kilimo',
    colCommodities: 'Mazao Hatarini',
    colLossGdp: 'Hasara & % GDP',
    colRecovery: 'Ahueni 27→32',
    colResilience: 'Ustahimilivu',
    legendIntensity: 'Ukali ENSO',
    legendDrought: 'Ukame',
    legendFlood: 'Mafuriko',
    legendDisplacement: 'Uhamisho',
    legendAgri: 'Hatari Kilimo',
    legendResilience: 'Ustahimilivu',
  },
  es: {
    eyebrow: '05C · PANEL COMPARATIVO MULTIZONA (INTENSIDAD · RIESGO AGRÍCOLA · RESILIENCIA)',
    title: 'Zonal Impact Dashboard — Informe Visual Comparativo',
    subtitle:
      'Selecciona múltiples zonas geopolíticas o económicas (COI, COMESA, SADC, ASEAN, UE, América Latina, etc.) para comparar índices de intensidad El Niño, riesgos agrícolas y resiliencia económica.',
    presetsLabel: 'Comparaciones rápidas:',
    selectAllBtn: 'Las 13 zonas',
    selectedCountLabel: 'zonas comparadas',
    yearLbl: 'Año',
    scenarioLbl: 'Escenario',
    currencyLbl: 'Moneda',
    exportPdfBtn: 'Descargar Informe (PDF)',
    reportCoopNote: 'PDF A4 imprimible para consulta sin conexión de cooperativas agrícolas',
    exportCsvBtn: 'Exportar CSV',
    exportedMsg: 'Informe comparativo generado',
    cardIntensity: 'Mayor intensidad El Niño',
    cardAgriRisk: 'Mayor riesgo agrícola',
    cardResilience: 'Mayor resiliencia económica',
    cardFootprint: 'Cobertura comparada',
    chart1Title: '1. Índices de intensidad El Niño (0–100)',
    chart1Sub: 'Índice compuesto ENSO, sequía, inundaciones y desplazamiento.',
    chart2Title: '2. Radar multiriesgo y resiliencia (hasta 6 zonas)',
    chart2Sub: 'Superposición de sequía, inundación, inflación, riesgo agrícola y resiliencia.',
    chart3Title: '3. Riesgo agrícola vs. Resiliencia económica (0–100)',
    chart3Sub: 'Brecha entre vulnerabilidad alimentaria y absorción macroeconómica.',
    tableTitle: 'Matriz comparativa de zonas seleccionadas',
    colZone: 'Zona / Bloque',
    colIntensity: 'Intensidad ENSO',
    colDroughtFlood: 'Sequía / Inund.',
    colCpi: '+CPI %',
    colAgriRisk: 'Riesgo agrícola',
    colCommodities: 'Cultivos clave',
    colLossGdp: 'Pérdida & % PIB',
    colRecovery: 'Recup. 27→32',
    colResilience: 'Resiliencia',
    legendIntensity: 'Intensidad ENSO',
    legendDrought: 'Sequía',
    legendFlood: 'Inundación',
    legendDisplacement: 'Desplazamiento',
    legendAgri: 'Riesgo Agrícola',
    legendResilience: 'Resiliencia Éco.',
  },
  ar: {
    eyebrow: '05C · لوحة التأثير المقارن للمناطق (الشدة · المخاطر الزراعية · المرونة الاقتصادية)',
    title: 'لوحة مقارنة الأثر الإقليمي — تقرير مرئي تفاعلي',
    subtitle:
      'اختر عدة مناطق جغرافية أو تكتلات اقتصادية (COI، الكوميسا، السادك، الآسيان، الاتحاد الأوروبي...) لتوليد مقارنة بصرية فورية لمؤشرات شدة النينيو والمخاطر الزراعية والمرونة الاقتصادية.',
    presetsLabel: 'مقارنات سريعة:',
    selectAllBtn: 'المناطق الـ 13 كافة',
    selectedCountLabel: 'مناطق مقارنة',
    yearLbl: 'السنة',
    scenarioLbl: 'السيناريو',
    currencyLbl: 'العملة',
    exportPdfBtn: 'تحميل التقرير (PDF)',
    reportCoopNote: 'تقرير PDF قابل للطباعة للتعاونيات الزراعية دون اتصال بالإنترنت',
    exportCsvBtn: 'تصدير CSV',
    exportedMsg: 'تم تصدير التقرير المقارن',
    cardIntensity: 'أعلى شدة للنينيو',
    cardAgriRisk: 'أعلى مخاطر زراعية',
    cardResilience: 'أقوى مرونة اقتصادية',
    cardFootprint: 'النطاق المقارن',
    chart1Title: '1. مؤشرات شدة النينيو والمخاطر المناخية (0–100)',
    chart1Sub: 'مؤشر الشدة المركب، الجفاف، الفيضانات وضغط النزوح.',
    chart2Title: '2. رادار المخاطر والمرونة متعدد المحاور',
    chart2Sub: 'مقارنة الجفاف والفيضانات والتضخم والمخاطر الزراعية والمرونة.',
    chart3Title: '3. المخاطر الزراعية مقابل المرونة الاقتصادية (0–100)',
    chart3Sub: 'الفجوة بين هشاشة الغذاء والقدرة على امتصاص الصدمات.',
    tableTitle: 'مصفوفة المقارنة للمناطق المحددة',
    colZone: 'المنطقة / التكتل',
    colIntensity: 'شدة النينيو',
    colDroughtFlood: 'جفاف / فيضان',
    colCpi: 'التضخم +%',
    colAgriRisk: 'المخاطر الزراعية',
    colCommodities: 'المحاصيل المعرضة',
    colLossGdp: 'الخسارة والناتج',
    colRecovery: 'التعافي 27←32',
    colResilience: 'المرونة الاقتصادية',
    legendIntensity: 'شدة النينيو',
    legendDrought: 'جفاف',
    legendFlood: 'فيضانات',
    legendDisplacement: 'نزوح',
    legendAgri: 'مخاطر زراعية',
    legendResilience: 'المرونة الاقتصادية',
  },
  zh: {
    eyebrow: '05C · 多区域对比仪表盘（厄尔尼诺强度 · 农业风险 · 经济韧性）',
    title: '区域影响对比仪表盘 — 交互式可视化报告',
    subtitle:
      '可多选地缘政治或经济区域（COI、COMESA、SADC、东盟、欧盟、拉美等），动态生成厄尔尼诺强度指数、农业风险与经济韧性对比图表。',
    presetsLabel: '快速对比组合：',
    selectAllBtn: '全部 13 个区域',
    selectedCountLabel: '个区域对比中',
    yearLbl: '年份',
    scenarioLbl: '情景',
    currencyLbl: '货币',
    exportPdfBtn: '下载对比报告 (PDF)',
    reportCoopNote: '可打印的多页 A4 PDF，供农业合作社离线查阅',
    exportCsvBtn: '导出对比 CSV',
    exportedMsg: '对比报告已生成',
    cardIntensity: '最高厄尔尼诺强度',
    cardAgriRisk: '最高农业风险',
    cardResilience: '最强经济韧性',
    cardFootprint: '对比覆盖范围',
    chart1Title: '1. 厄尔尼诺强度指数与灾害对比 (0–100)',
    chart1Sub: '所选区域的综合强度、干旱、洪涝与迁徙压力指数。',
    chart2Title: '2. 多维风险与韧性雷达图（最多 6 个区域）',
    chart2Sub: '干旱、洪涝、CPI 通胀、农业风险与经济韧性五维叠加。',
    chart3Title: '3. 农业风险 vs 经济韧性指数 (0–100)',
    chart3Sub: '粮食生产脆弱性与宏观经济缓冲能力之间的结构差距。',
    tableTitle: '所选区域详细对比矩阵',
    colZone: '区域 / 组织',
    colIntensity: 'ENSO 强度',
    colDroughtFlood: '干旱 / 洪涝',
    colCpi: '+CPI %',
    colAgriRisk: '农业风险与受影响人口',
    colCommodities: '重点受灾作物/商品',
    colLossGdp: '损失与 GDP 占比',
    colRecovery: '27→32 恢复率',
    colResilience: '经济韧性',
    legendIntensity: 'ENSO 强度',
    legendDrought: '干旱',
    legendFlood: '洪涝',
    legendDisplacement: '人口迁徙',
    legendAgri: '农业风险',
    legendResilience: '经济韧性',
  },
  pt: {
    eyebrow: '05C · PAINEL COMPARATIVO MULTIZONA (INTENSIDADE · RISCO AGRÍCOLA · RESILIÊNCIA)',
    title: 'Zonal Impact Dashboard — Relatório Visual Comparativo',
    subtitle:
      'Selecione múltiplas zonas geopolíticas ou económicas (COI, COMESA, SADC, ASEAN, UE, América Latina, etc.) para comparar índices de intensidade El Niño, riscos agrícolas e resiliência económica.',
    presetsLabel: 'Comparações rápidas:',
    selectAllBtn: 'Todas as 13 zonas',
    selectedCountLabel: 'zonas comparadas',
    yearLbl: 'Ano',
    scenarioLbl: 'Cenário',
    currencyLbl: 'Moeda',
    exportPdfBtn: 'Baixar Relatório (PDF)',
    reportCoopNote: 'PDF A4 imprimível para consulta offline de cooperativas agrícolas',
    exportCsvBtn: 'Exportar CSV',
    exportedMsg: 'Relatório comparativo exportado',
    cardIntensity: 'Maior intensidade El Niño',
    cardAgriRisk: 'Maior risco agrícola',
    cardResilience: 'Maior resiliência económica',
    cardFootprint: 'Cobertura comparada',
    chart1Title: '1. Índices de intensidade El Niño (0–100)',
    chart1Sub: 'Índice composto ENSO, seca, cheias e pressão de deslocamento.',
    chart2Title: '2. Radar multirrisco e resiliência (até 6 zonas)',
    chart2Sub: 'Sobreposição de seca, cheias, inflação, risco agrícola e resiliência.',
    chart3Title: '3. Risco agrícola vs. Resiliência económica (0–100)',
    chart3Sub: 'Diferença entre vulnerabilidade alimentar e absorção macroeconómica.',
    tableTitle: 'Matriz comparativa das zonas selecionadas',
    colZone: 'Zona / Bloco',
    colIntensity: 'Intensidade ENSO',
    colDroughtFlood: 'Seca / Cheias',
    colCpi: '+CPI %',
    colAgriRisk: 'Risco agrícola',
    colCommodities: 'Culturas-chave',
    colLossGdp: 'Perda & % PIB',
    colRecovery: 'Recup. 27→32',
    colResilience: 'Resiliência',
    legendIntensity: 'Intensidade ENSO',
    legendDrought: 'Seca',
    legendFlood: 'Cheias',
    legendDisplacement: 'Deslocamento',
    legendAgri: 'Risco Agrícola',
    legendResilience: 'Resiliência Éco.',
  },
  hi: {
    eyebrow: '05C · बहु-क्षेत्रीय तुलनात्मक डैशबोर्ड (तीव्रता · कृषि जोखिम · आर्थिक लचीलापन)',
    title: 'Zonal Impact Dashboard — तुलनात्मक विज़ुअल रिपोर्ट',
    subtitle:
      'एल नीनो तीव्रता सूचकांक, कृषि जोखिम और आर्थिक लचीलेपन की तुलना के लिए कई भू-राजनीतिक या आर्थिक क्षेत्र (COI, COMESA, SADC, ASEAN, EU आदि) चुनें।',
    presetsLabel: 'त्वरित तुलना प्रीसेट:',
    selectAllBtn: 'सभी 13 क्षेत्र',
    selectedCountLabel: 'क्षेत्रों की तुलना',
    yearLbl: 'वर्ष',
    scenarioLbl: 'परिदृश्य',
    currencyLbl: 'मुद्रा',
    exportPdfBtn: 'रिपोर्ट डाउनलोड करें (PDF)',
    reportCoopNote: 'कृषि सहकारी समितियों के ऑफ़लाइन उपयोग के लिए प्रिंट करने योग्य A4 PDF',
    exportCsvBtn: 'तुलना CSV डाउनलोड करें',
    exportedMsg: 'तुलनात्मक रिपोर्ट निर्यात हो गई',
    cardIntensity: 'उच्चतम एल नीनो तीव्रता',
    cardAgriRisk: 'उच्चतम कृषि जोखिम',
    cardResilience: 'मजबूत आर्थिक लचीलापन',
    cardFootprint: 'तुलनात्मक दायरा',
    chart1Title: '1. एल नीनो तीव्रता सूचकांक (0–100)',
    chart1Sub: 'चयनित क्षेत्रों में समग्र ENSO तीव्रता, सूखा, बाढ़ और विस्थापन।',
    chart2Title: '2. बहु-अक्षीय जोखिम एवं लचीलापन रडार',
    chart2Sub: 'सूखा, बाढ़, मुद्रास्फीति, कृषि जोखिम और आर्थिक लचीलेपन का तुलनात्मक रूप।',
    chart3Title: '3. कृषि जोखिम बनाम आर्थिक लचीलापन (0–100)',
    chart3Sub: 'खाद्य संवेदनशीलता और आर्थिक अवशोषण क्षमता के बीच का अंतर।',
    tableTitle: 'चयनित क्षेत्रों का विस्तृत तुलनात्मक मैट्रिक्स',
    colZone: 'क्षेत्र / समूह',
    colIntensity: 'ENSO तीव्रता',
    colDroughtFlood: 'सूखा / बाढ़',
    colCpi: '+CPI %',
    colAgriRisk: 'कृषि जोखिम',
    colCommodities: 'प्रमुख फसलें',
    colLossGdp: 'हानि व % GDP',
    colRecovery: 'सुधार 27→32',
    colResilience: 'आर्थिक लचीलापन',
    legendIntensity: 'ENSO तीव्रता',
    legendDrought: 'सूखा',
    legendFlood: 'बाढ़',
    legendDisplacement: 'विस्थापन',
    legendAgri: 'कृषि जोखिम',
    legendResilience: 'आर्थिक लचीलापन',
  },
  ru: {
    eyebrow: '05C · СРАВНИТЕЛЬНЫЙ ДАШБОРД ЗОН (ИНТЕНСИВНОСТЬ · АГРОРИСКИ · УСТОЙЧИВОСТЬ)',
    title: 'Zonal Impact Dashboard — Сравнительный визуальный отчёт',
    subtitle:
      'Выберите несколько геополитических или экономических зон (COI, COMESA, SADC, ASEAN, ЕС, Латинская Америка и др.) для сравнения индексов Эль-Ниньо, аграрных рисков и экономической устойчивости.',
    presetsLabel: 'Быстрые пресеты:',
    selectAllBtn: 'Все 13 зон',
    selectedCountLabel: 'зон сравнивается',
    yearLbl: 'Год',
    scenarioLbl: 'Сценарий',
    currencyLbl: 'Валюта',
    exportPdfBtn: 'Скачать отчёт (PDF)',
    reportCoopNote: 'Многостраничный PDF A4 для печати и офлайн-работы агрокооперативов',
    exportCsvBtn: 'Скачать CSV',
    exportedMsg: 'Сравнительный отчёт готов',
    cardIntensity: 'Макс. интенсивность Эль-Ниньо',
    cardAgriRisk: 'Макс. аграрный риск',
    cardResilience: 'Наибольшая устойчивость',
    cardFootprint: 'Охват сравнения',
    chart1Title: '1. Индексы интенсивности Эль-Ниньо (0–100)',
    chart1Sub: 'Совокупный индекс ENSO, засуха, паводки и давление миграции.',
    chart2Title: '2. Многомерный радар рисков и устойчивости',
    chart2Sub: 'Сравнение засухи, паводков, инфляции, агрорисков и устойчивости.',
    chart3Title: '3. Аграрный риск против экономической устойчивости (0–100)',
    chart3Sub: 'Разрыв между уязвимостью АПК и способностью экономики к восстановлению.',
    tableTitle: 'Сводная сравнительная матрица выбранных зон',
    colZone: 'Зона / Блок',
    colIntensity: 'Интенсивность',
    colDroughtFlood: 'Засуха / Паводки',
    colCpi: '+CPI %',
    colAgriRisk: 'Агрориск',
    colCommodities: 'Ключевые культуры',
    colLossGdp: 'Потери и % ВВП',
    colRecovery: 'Восст. 27→32',
    colResilience: 'Устойчивость',
    legendIntensity: 'Интенсивность',
    legendDrought: 'Засуха',
    legendFlood: 'Паводки',
    legendDisplacement: 'Миграция',
    legendAgri: 'Агрориск',
    legendResilience: 'Устойчивость',
  },
};

const RADAR_PALETTE = ['#1E3A8A', '#B45309', '#047857', '#BE123C', '#7C3AED', '#0F766E'];

function formatCurrencyCompact(bUsd: number, currency: CurrencyCode): string {
  if (currency === 'EUR') return `${(bUsd * EUR_PER_USD).toFixed(2)} Md €`;
  if (currency === 'MGA') return `${((bUsd * MGA_PER_USD) / 1000).toFixed(1)} T Ar`;
  return `${bUsd.toFixed(2)} Md $`;
}

export function ZonalImpactDashboard() {
  const { lang, worldLang } = useLanguage();
  const { syncState, hasLiveScrape } = useGlobalSync();
  const copy = DASHBOARD_COPY[worldLang];
  const isFr = worldLang === 'fr';

  const [selectedZones, setSelectedZones] = useState<RegionalBlocZoneId[]>([
    'ocean-indien-coi',
    'sadc',
    'comesa',
    'asean',
    'ue',
  ]);
  const [selectedYear, setSelectedYear] = useState<ForecastYear>(2027);
  const [scenario, setScenario] = useState<ScenarioKey>('s2');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [exportedBanner, setExportedBanner] = useState<string | null>(null);

  const liveFactor = hasLiveScrape ? syncState.zoneFactors.afrique.gdpLossFactor : 1;

  const toggleZone = (id: RegionalBlocZoneId) => {
    setSelectedZones((prev) => {
      if (prev.includes(id)) {
        // Keep at least 1 selected zone so charts always render meaningful metrics
        return prev.length > 1 ? prev.filter((z) => z !== id) : prev;
      }
      return [...prev, id];
    });
  };

  const dashboardData = useMemo(
    () =>
      buildComparativeVisualReportData({
        zoneIds: selectedZones,
        year: selectedYear,
        scenario,
        liveFactor,
      }),
    [selectedZones, selectedYear, scenario, liveFactor],
  );

  const intensityChartData = useMemo(
    () =>
      dashboardData.items.map((item) => ({
        name: item.code,
        fullName: isFr ? item.nameFr : item.nameEn,
        intensity: item.ensoIntensityIndex,
        drought: item.droughtIdx,
        flood: item.floodIdx,
        displacement: item.displacementIdx,
      })),
    [dashboardData.items, isFr],
  );

  const agriResilienceChartData = useMemo(
    () =>
      dashboardData.items.map((item) => ({
        name: item.code,
        fullName: isFr ? item.nameFr : item.nameEn,
        agriRisk: item.agriRiskScore,
        resilience: item.economicResilienceScore,
      })),
    [dashboardData.items, isFr],
  );

  const radarChartData = useMemo(
    () =>
      dashboardData.radarMetrics.map((row) => ({
        ...row,
        axis: isFr ? row.axisFr : row.axisEn,
      })),
    [dashboardData.radarMetrics, isFr],
  );

  const totalComparedStates = dashboardData.items.reduce((s, z) => s + z.countryCount, 0);
  const totalComparedLossBUsd = dashboardData.items.reduce((s, z) => s + z.activeLossBUsd, 0);

  const handleExportPdf = () => {
    const filename = exportComparativeZonalDashboardPdf({
      items: dashboardData.items,
      year: selectedYear,
      scenario,
      currency,
      lang,
      oniObservedC: syncState.oniIndexObserved,
      liveFactor,
      hasLiveScrape,
    });
    setExportedBanner(filename);
    emitIndriActivity({
      state: 'speaking',
      label: copy.exportedMsg,
      detail: `${filename} (${dashboardData.items.length} zones)`,
    });
    setTimeout(() => setExportedBanner(null), 4000);
  };

  const handleExportCsv = () => {
    const filename = exportComparativeZonalDashboardCsv({
      items: dashboardData.items,
      year: selectedYear,
      scenario,
      lang,
    });
    setExportedBanner(filename);
    emitIndriActivity({
      state: 'speaking',
      label: copy.exportedMsg,
      detail: filename,
    });
    setTimeout(() => setExportedBanner(null), 4000);
  };

  return (
    <section
      id="zonal-impact-dashboard"
      className="border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">{copy.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-[78ch] text-base leading-relaxed text-zinc-600">
            {copy.subtitle}
          </p>
        </div>

        {/* Multi-Zone Selector & Parameter Controls */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-col gap-4 border-b border-zinc-100 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700">{copy.presetsLabel}</span>
              {ZONAL_COMPARISON_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedZones(preset.zones)}
                  className="min-h-9 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                >
                  {isFr ? preset.labelFr : preset.labelEn}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedZones(ZONAL_DEFINITIONS.map((z) => z.id))}
                className="min-h-9 rounded-md border border-[#1E3A8A]/40 bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/5"
              >
                {copy.selectAllBtn}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                aria-label={copy.yearLbl}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value) as ForecastYear)}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                {FORECAST_YEARS_6.map((y) => (
                  <option key={y} value={y}>
                    {copy.yearLbl}: {y}
                  </option>
                ))}
              </select>

              <select
                aria-label={copy.scenarioLbl}
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioKey)}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="s1">S1 · {isFr ? 'Modéré' : 'Mild'}</option>
                <option value="s2">S2 · {isFr ? 'Base ML' : 'Baseline'}</option>
                <option value="s3">S3 · {isFr ? 'Extrême' : 'Extreme'}</option>
              </select>

              <select
                aria-label={copy.currencyLbl}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="MGA">MGA (Ar)</option>
              </select>
            </div>
          </div>

          {/* Interactive Multi-Select Zone Toggles */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {ZONAL_DEFINITIONS.map((def) => {
              const active = selectedZones.includes(def.id);
              return (
                <button
                  key={def.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleZone(def.id)}
                  className={`flex min-h-10 items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    active
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-400 hover:bg-white'
                  }`}
                >
                  <span className="truncate">{isFr ? def.nameFr : def.nameEn}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Export Comparative Visual Report Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
              <span className="font-mono font-semibold text-[#1E3A8A] tabular-nums">
                {dashboardData.items.length} {copy.selectedCountLabel}
              </span>
              <span className="text-zinc-500">· {copy.reportCoopNote}</span>
              {exportedBanner && (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {copy.exportedMsg}: {exportedBanner}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3.5 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>{copy.exportCsvBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-rose-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.exportPdfBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Comparative KPI Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Thermometer className="h-4 w-4 text-amber-700" aria-hidden="true" />
              <span>{copy.cardIntensity}</span>
            </div>
            <p className="mt-2 font-serif text-lg font-semibold text-zinc-900">
              {dashboardData.highestIntensity
                ? isFr
                  ? dashboardData.highestIntensity.nameFr
                  : dashboardData.highestIntensity.nameEn
                : '—'}
            </p>
            <p className="mt-1 font-mono text-xs font-semibold text-amber-800 tabular-nums">
              {dashboardData.highestIntensity
                ? `${dashboardData.highestIntensity.ensoIntensityIndex}/100 · +${dashboardData.highestIntensity.cpiInflationAddPct.toFixed(1)}% CPI`
                : '—'}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Sprout className="h-4 w-4 text-rose-700" aria-hidden="true" />
              <span>{copy.cardAgriRisk}</span>
            </div>
            <p className="mt-2 font-serif text-lg font-semibold text-zinc-900">
              {dashboardData.highestAgriRisk
                ? isFr
                  ? dashboardData.highestAgriRisk.nameFr
                  : dashboardData.highestAgriRisk.nameEn
                : '—'}
            </p>
            <p className="mt-1 font-mono text-xs font-semibold text-rose-700 tabular-nums">
              {dashboardData.highestAgriRisk
                ? `${dashboardData.highestAgriRisk.agriRiskScore}/100 · ${dashboardData.highestAgriRisk.criticalHighPopM.toFixed(1)} M (${dashboardData.highestAgriRisk.criticalHighPopSharePct}%)`
                : '—'}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <span>{copy.cardResilience}</span>
            </div>
            <p className="mt-2 font-serif text-lg font-semibold text-zinc-900">
              {dashboardData.mostResilient
                ? isFr
                  ? dashboardData.mostResilient.nameFr
                  : dashboardData.mostResilient.nameEn
                : '—'}
            </p>
            <p className="mt-1 font-mono text-xs font-semibold text-emerald-700 tabular-nums">
              {dashboardData.mostResilient
                ? `${dashboardData.mostResilient.economicResilienceScore}/100 (${
                    isFr
                      ? dashboardData.mostResilient.resilienceTierFr
                      : dashboardData.mostResilient.resilienceTierEn
                  })`
                : '—'}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Layers className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
              <span>{copy.cardFootprint}</span>
            </div>
            <p className="mt-2 font-mono text-xl font-semibold text-[#1E3A8A] tabular-nums">
              {formatCurrencyCompact(totalComparedLossBUsd, currency)}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-600 tabular-nums">
              {dashboardData.items.length} zones · {totalComparedStates} {isFr ? 'entrées pays-bloc' : 'country-bloc entries'}
            </p>
          </div>
        </div>

        {/* Comparative Charts Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Chart 1: El Niño Intensity Indices */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-7">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart1Title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{copy.chart1Sub}</p>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intensityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="intensity" name={copy.legendIntensity} fill="#1E3A8A" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="drought" name={copy.legendDrought} fill="#D97706" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="flood" name={copy.legendFlood} fill="#0284C7" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="displacement" name={copy.legendDisplacement} fill="#BE123C" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Multi-Axis Hazard & Resilience Radar */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-5">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart2Title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{copy.chart2Sub}</p>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#D4D4D8" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10.5 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {dashboardData.items.slice(0, 6).map((item, idx) => (
                    <Radar
                      key={item.zoneId}
                      name={item.code}
                      dataKey={item.zoneId}
                      stroke={RADAR_PALETTE[idx % RADAR_PALETTE.length]}
                      fill={RADAR_PALETTE[idx % RADAR_PALETTE.length]}
                      fillOpacity={0.14}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 3: Agricultural Risk vs. Economic Resilience */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart3Title}</h3>
          <p className="mt-1 text-xs text-zinc-500">{copy.chart3Sub}</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agriResilienceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="agriRisk" name={copy.legendAgri} fill="#BE123C" radius={[3, 3, 0, 0]} />
                <Bar dataKey="resilience" name={copy.legendResilience} fill="#047857" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Comparative Matrix Table */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h3 className="font-serif text-lg font-semibold text-zinc-900">
            {copy.tableTitle} ({dashboardData.items.length})
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="py-2.5 pr-3">{copy.colZone}</th>
                  <th className="py-2.5 px-2 text-right">{copy.colIntensity}</th>
                  <th className="py-2.5 px-2 text-right">{copy.colDroughtFlood}</th>
                  <th className="py-2.5 px-2 text-right">{copy.colCpi}</th>
                  <th className="py-2.5 px-2 text-right">{copy.colAgriRisk}</th>
                  <th className="py-2.5 px-3">{copy.colCommodities}</th>
                  <th className="py-2.5 px-2 text-right">{copy.colLossGdp}</th>
                  <th className="py-2.5 px-2 text-right">{copy.colRecovery}</th>
                  <th className="py-2.5 pl-2 text-right">{copy.colResilience}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {dashboardData.items.map((item) => (
                  <tr key={item.zoneId} className="hover:bg-[#F9F8F4]/70">
                    <td className="py-3 pr-3">
                      <span className="block font-semibold text-zinc-900">
                        {isFr ? item.nameFr : item.nameEn}
                      </span>
                      <span className="font-mono text-[10.5px] text-zinc-500">
                        {item.code} · {item.countryCount} {isFr ? 'États' : 'States'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-[#1E3A8A] tabular-nums">
                      {item.ensoIntensityIndex}/100
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                      {item.droughtIdx} / {item.floodIdx}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-amber-800 tabular-nums">
                      +{item.cpiInflationAddPct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-rose-700 tabular-nums">
                      <span className="block font-semibold">{item.agriRiskScore}/100</span>
                      <span className="text-[10.5px] text-zinc-500">
                        {item.criticalHighPopM.toFixed(1)}M ({item.criticalHighPopSharePct}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-zinc-600">
                      {isFr ? item.keyCommoditiesFr : item.keyCommoditiesEn}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-zinc-900 tabular-nums">
                      <span className="block font-semibold">
                        {formatCurrencyCompact(item.activeLossBUsd, currency)}
                      </span>
                      <span className="text-[10.5px] text-zinc-500">
                        {item.activeGdpLossPct.toFixed(2)}% PIB
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                      {item.recoveryRate2027to2032Pct.toFixed(1)}%
                    </td>
                    <td className="py-3 pl-2 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      <span className="block">{item.economicResilienceScore}/100</span>
                      <span className="text-[10.5px] font-sans text-zinc-600">
                        {isFr ? item.resilienceTierFr : item.resilienceTierEn}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
