import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Check, Database, RotateCcw, SlidersHorizontal } from 'lucide-react';
import {
  useLanguage,
  type WorldLanguageCode,
} from '../i18n/LanguageContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { useAuth } from '../context/AuthContext';
import {
  formatCurrencyFromMUsd,
  type CurrencyCode,
  type HorizonYear,
  type ScopeMode,
} from '../utils/economicAggregation';
import {
  INTENSITY_PRESETS,
  simulateClimateScenario,
  type ElNinoIntensity,
} from '../utils/climateScenarioSimulator';

interface SimulatorCopy {
  kicker: string;
  title: string;
  subtitle: string;
  intensityLabel: string;
  moderateBtn: string;
  moderateDesc: string;
  extremeBtn: string;
  extremeDesc: string;
  oniSliderLabel: string;
  iodSliderLabel: string;
  horizonLabel: string;
  scopeLabel: string;
  scope119: string;
  scope42: string;
  currencyLabel: string;
  resetBtn: string;
  saveBtn: string;
  savedBtn: string;
  yieldSectionTitle: string;
  yieldSectionNote: string;
  cropNames: Record<'rice' | 'maize' | 'cassava' | 'export', string>;
  baselineYieldCol: string;
  simulatedYieldCol: string;
  deltaCol: string;
  tonnageRiskCol: string;
  gdpSectionTitle: string;
  gdpSectionNote: string;
  kpiTotalLoss: string;
  kpiDirectIndirect: string;
  kpiDeltaVsMod: string;
  kpiRicePrice: string;
  kpiExposedPop: string;
  kpiWorldYear: string;
  chartTitle: string;
  chartModerateLegend: string;
  chartActiveLegend: string;
  chartExtremeLegend: string;
  districtsTableTitle: string;
  districtCol: string;
  rainCol: string;
  riceCol: string;
  maizeCol: string;
  lossCol: string;
  worldBlocsTitle: string;
  zoneCol: string;
  countriesCol: string;
  activeLossCol: string;
  inflationCol: string;
  blocsFooter: string;
}

const SIM_COPY: Record<WorldLanguageCode, SimulatorCopy> = {
  fr: {
    kicker: 'Modélisation interactive ENSO · Rendements agricoles & PIB',
    title: 'Simulateur de Scénarios Climatiques',
    subtitle:
      'Basculez instantanément entre un El Niño Modéré (+1,5 °C ONI) et un Super El Niño Extrême (+3,8 à +4,1 °C ONI) ou ajustez les indices océaniques pour observer l’impact en temps réel sur les rendements agricoles et les pertes de PIB.',
    intensityLabel: 'Intensité El Niño',
    moderateBtn: 'Modéré',
    moderateDesc: 'ONI +1,5 °C · IOD +0,40 °C (×0,55)',
    extremeBtn: 'Extrême',
    extremeDesc: 'ONI +3,8 °C · IOD +1,05 °C (×1,45)',
    oniSliderLabel: 'Anomalie Pacifique ONI (°C)',
    iodSliderLabel: 'Dipôle Océan Indien IOD+ (°C)',
    horizonLabel: 'Horizon',
    scopeLabel: 'Couverture',
    scope119: '119 districts (consolidé)',
    scope42: '42 districts pilotes ML',
    currencyLabel: 'Devise',
    resetBtn: 'Réinitialiser',
    saveBtn: 'Enregistrer simulation',
    savedBtn: 'Simulation enregistrée',
    yieldSectionTitle: 'Prédictions de rendements agricoles en temps réel',
    yieldSectionNote: 'Base agronomique FOFIFA / FAO Madagascar (tonnes/ha & volume exposé)',
    cropNames: {
      rice: 'Riz paddy (national)',
      maize: 'Maïs pluvial (Sud & Ouest)',
      cassava: 'Manioc & tubercules',
      export: 'Rente & export (Vanille, Girofle, Café)',
    },
    baselineYieldCol: 'Base t/ha',
    simulatedYieldCol: 'Simulé t/ha',
    deltaCol: 'Variation',
    tonnageRiskCol: 'Volume exposé',
    gdpSectionTitle: 'Impact sur les modèles de perte de PIB & prix alimentaires',
    gdpSectionNote: 'Agrégation économétrique directe + indirecte (hydroélectricité RIA, bétail, pistes)',
    kpiTotalLoss: 'Perte économique totale (Madagascar)',
    kpiDirectIndirect: 'Directe / Indirecte',
    kpiDeltaVsMod: 'Surcoût vs scénario Modéré',
    kpiRicePrice: 'Prix projeté riz Antananarivo',
    kpiExposedPop: 'Population exposée (insécurité)',
    kpiWorldYear: 'Perte annuelle mondiale (195 pays ONU)',
    chartTitle: 'Comparaison des pertes de PIB par ex-province (Modéré vs Simulé vs Extrême)',
    chartModerateLegend: 'Modéré (×0,55)',
    chartActiveLegend: 'Simulation active',
    chartExtremeLegend: 'Extrême (×1,45)',
    districtsTableTitle: 'Districts les plus exposés sous l’intensité active',
    districtCol: 'District / Ex-Province',
    rainCol: 'Pluie Δ%',
    riceCol: 'Riz Δ%',
    maizeCol: 'Maïs Δ%',
    lossCol: 'Perte PIB',
    worldBlocsTitle: 'Répercussion mondiale par zone ONU (195 pays)',
    zoneCol: 'Zone ONU / Continent',
    countriesCol: 'Pays',
    activeLossCol: 'Perte annuelle simulée',
    inflationCol: 'Surplus inflation alim.',
    blocsFooter: 'Blocs africains simulés',
  },
  en: {
    kicker: 'Interactive ENSO Modeling · Crop Yields & GDP Loss',
    title: 'Climate Scenario Simulator',
    subtitle:
      'Toggle immediately between a Moderate El Niño (+1.5 °C ONI) and an Extreme Super El Niño (+3.8 to +4.1 °C ONI) or fine-tune ocean forcing to observe live effects on crop yield predictions and GDP loss models.',
    intensityLabel: 'El Niño Intensity',
    moderateBtn: 'Moderate',
    moderateDesc: 'ONI +1.5 °C · IOD +0.40 °C (×0.55)',
    extremeBtn: 'Extreme',
    extremeDesc: 'ONI +3.8 °C · IOD +1.05 °C (×1.45)',
    oniSliderLabel: 'Pacific ONI Anomaly (°C)',
    iodSliderLabel: 'Indian Ocean Dipole IOD+ (°C)',
    horizonLabel: 'Horizon',
    scopeLabel: 'Scope',
    scope119: '119 districts (consolidated)',
    scope42: '42 pilot ML districts',
    currencyLabel: 'Currency',
    resetBtn: 'Reset',
    saveBtn: 'Save simulation',
    savedBtn: 'Saved to Firestore',
    yieldSectionTitle: 'Real-Time Agricultural Yield Predictions',
    yieldSectionNote: 'FOFIFA / FAO Madagascar agronomic baseline (tonnes/ha & volume at risk)',
    cropNames: {
      rice: 'Paddy Rice (National)',
      maize: 'Rainfed Maize (South & West)',
      cassava: 'Cassava & Tubers',
      export: 'Export Cash Crops (Vanilla, Cloves, Coffee)',
    },
    baselineYieldCol: 'Baseline t/ha',
    simulatedYieldCol: 'Simulated t/ha',
    deltaCol: 'Yield Delta',
    tonnageRiskCol: 'Volume at Risk',
    gdpSectionTitle: 'Real-Time GDP Loss & Food Price Impact Models',
    gdpSectionNote: 'Direct agricultural shock + indirect infrastructure, RIA hydro & livestock losses',
    kpiTotalLoss: 'Total Madagascar GDP Loss',
    kpiDirectIndirect: 'Direct / Indirect',
    kpiDeltaVsMod: 'Added Loss vs Moderate',
    kpiRicePrice: 'Antananarivo Projected Rice Price',
    kpiExposedPop: 'Exposed Population',
    kpiWorldYear: 'Annual Global Loss (195 UN Countries)',
    chartTitle: 'Ex-Province GDP Loss Comparison (Moderate vs Active vs Extreme)',
    chartModerateLegend: 'Moderate (×0.55)',
    chartActiveLegend: 'Active simulation',
    chartExtremeLegend: 'Extreme (×1.45)',
    districtsTableTitle: 'Highest-Exposure Districts under Active Intensity',
    districtCol: 'District / Ex-Province',
    rainCol: 'Rain Δ%',
    riceCol: 'Rice Δ%',
    maizeCol: 'Maize Δ%',
    lossCol: 'GDP Loss',
    worldBlocsTitle: 'Global Impact across 6 UN Zones (195 Countries)',
    zoneCol: 'UN Zone / Continent',
    countriesCol: 'Countries',
    activeLossCol: 'Simulated Annual Loss',
    inflationCol: 'Added Food Inflation',
    blocsFooter: 'Simulated African Blocs',
  },
  sw: {
    kicker: 'Uigaji wa Moja kwa Moja wa ENSO · Mavuno & Hasara za Pato la Taifa',
    title: 'Kiigaji cha Hali za Tabianchi',
    subtitle:
      'Badilisha moja kwa moja kati ya El Niño ya Wastani (+1.5 °C ONI) na El Niño Kuu Kali (+3.8 °C ONI) ili kuona athari papo hapo kwa mavuno ya kilimo na hasara za Pato la Taifa (GDP).',
    intensityLabel: 'Kiwango cha El Niño',
    moderateBtn: 'Wastani',
    moderateDesc: 'ONI +1.5 °C · IOD +0.40 °C (×0.55)',
    extremeBtn: 'Kali Sana',
    extremeDesc: 'ONI +3.8 °C · IOD +1.05 °C (×1.45)',
    oniSliderLabel: 'Joto la Pasifiki ONI (°C)',
    iodSliderLabel: 'Dipole ya Bahari ya Hindi IOD+ (°C)',
    horizonLabel: 'Mwaka',
    scopeLabel: 'Upeo',
    scope119: 'Wilaya 119 (zote)',
    scope42: 'Wilaya 42 za majaribio ML',
    currencyLabel: 'Sarafu',
    resetBtn: 'Weka upya',
    saveBtn: 'Hifadhi uigaji',
    savedBtn: 'Imehifadhiwa Firestore',
    yieldSectionTitle: 'Utabiri wa Mavuno ya Kilimo Wakati Halisi',
    yieldSectionNote: 'Msingi wa FOFIFA / FAO Madagaska (tani/hekta)',
    cropNames: {
      rice: 'Mpunga (Kitaifa)',
      maize: 'Mahindi (Kusini & Magharibi)',
      cassava: 'Muhogo na mizizi',
      export: 'Mazao ya biashara (Vanila, Karafuu)',
    },
    baselineYieldCol: 'Msingi t/ha',
    simulatedYieldCol: 'Utabiri t/ha',
    deltaCol: 'Mabadiliko',
    tonnageRiskCol: 'Kiasi hatarini',
    gdpSectionTitle: 'Athari kwa Hasara za Pato la Taifa (GDP) & Bei za Chakula',
    gdpSectionNote: 'Hasara za moja kwa moja za kilimo na zisizo za moja kwa moja',
    kpiTotalLoss: 'Hasara Jumla Madagaska',
    kpiDirectIndirect: 'Moja kwa moja / Zisizo',
    kpiDeltaVsMod: 'Ziada dhidi ya Wastani',
    kpiRicePrice: 'Bei tarajiwa ya mchele',
    kpiExposedPop: 'Watu walio hatarini',
    kpiWorldYear: 'Hasara ya Dunia kwa Mwaka (Nchi 195)',
    chartTitle: 'Ulinganisho wa Hasara za GDP kwa Majimbo 6',
    chartModerateLegend: 'Wastani (×0.55)',
    chartActiveLegend: 'Uigaji hai',
    chartExtremeLegend: 'Kali Sana (×1.45)',
    districtsTableTitle: 'Wilaya Zilizoathirika Zaidi',
    districtCol: 'Wilaya / Jimbo',
    rainCol: 'Mvua Δ%',
    riceCol: 'Mpunga Δ%',
    maizeCol: 'Mahindi Δ%',
    lossCol: 'Hasara GDP',
    worldBlocsTitle: 'Athari kwa Kanda 6 za UN (Nchi 195)',
    zoneCol: 'Kanda ya UN / Bara',
    countriesCol: 'Nchi',
    activeLossCol: 'Hasara ya Mwaka',
    inflationCol: 'Mfumuko wa Chakula',
    blocsFooter: 'Kanda za Afrika',
  },
  es: {
    kicker: 'Modelado interactivo ENSO · Rendimientos agrícolas y PIB',
    title: 'Simulador de Escenarios Climáticos',
    subtitle:
      'Alterna al instante entre un El Niño Moderado (+1,5 °C ONI) y un Súper El Niño Extremo (+3,8 °C ONI) y observa el impacto en tiempo real sobre las cosechas y las pérdidas del PIB.',
    intensityLabel: 'Intensidad de El Niño',
    moderateBtn: 'Moderado',
    moderateDesc: 'ONI +1,5 °C · IOD +0,40 °C (×0,55)',
    extremeBtn: 'Extremo',
    extremeDesc: 'ONI +3,8 °C · IOD +1,05 °C (×1,45)',
    oniSliderLabel: 'Anomalía Pacífico ONI (°C)',
    iodSliderLabel: 'Dipolo Índico IOD+ (°C)',
    horizonLabel: 'Horizonte',
    scopeLabel: 'Alcance',
    scope119: '119 distritos (consolidado)',
    scope42: '42 distritos piloto ML',
    currencyLabel: 'Moneda',
    resetBtn: 'Restablecer',
    saveBtn: 'Guardar simulación',
    savedBtn: 'Guardado en Firestore',
    yieldSectionTitle: 'Predicciones de rendimiento agrícola en tiempo real',
    yieldSectionNote: 'Base agronómica FOFIFA / FAO Madagascar (t/ha y volumen en riesgo)',
    cropNames: {
      rice: 'Arroz paddy (Nacional)',
      maize: 'Maíz de secano (Sur y Oeste)',
      cassava: 'Yuca y tubérculos',
      export: 'Cultivos exportación (Vainilla, Clavo, Café)',
    },
    baselineYieldCol: 'Base t/ha',
    simulatedYieldCol: 'Simulado t/ha',
    deltaCol: 'Variación',
    tonnageRiskCol: 'Volumen en riesgo',
    gdpSectionTitle: 'Impacto en pérdidas de PIB y precios alimentarios',
    gdpSectionNote: 'Choque agrícola directo más pérdidas indirectas hídricas y logísticas',
    kpiTotalLoss: 'Pérdida total en Madagascar',
    kpiDirectIndirect: 'Directa / Indirecta',
    kpiDeltaVsMod: 'Sobrecosto vs Moderado',
    kpiRicePrice: 'Precio proyectado arroz Antananarivo',
    kpiExposedPop: 'Población expuesta',
    kpiWorldYear: 'Pérdida anual mundial (195 países ONU)',
    chartTitle: 'Comparación de pérdidas del PIB por ex-provincia',
    chartModerateLegend: 'Moderado (×0,55)',
    chartActiveLegend: 'Simulación activa',
    chartExtremeLegend: 'Extremo (×1,45)',
    districtsTableTitle: 'Distritos más expuestos bajo intensidad activa',
    districtCol: 'Distrito / Ex-Provincia',
    rainCol: 'Lluvia Δ%',
    riceCol: 'Arroz Δ%',
    maizeCol: 'Maíz Δ%',
    lossCol: 'Pérdida PIB',
    worldBlocsTitle: 'Repercusión global en 6 zonas ONU (195 países)',
    zoneCol: 'Zona ONU / Continente',
    countriesCol: 'Países',
    activeLossCol: 'Pérdida anual simulada',
    inflationCol: 'Inflación alim. añadida',
    blocsFooter: 'Bloques africanos simulados',
  },
  ar: {
    kicker: 'نمذجة تفاعلية لظاهرة النينيو · المحاصيل الزراعية والناتج المحلي',
    title: 'محاكي السيناريوهات المناخية',
    subtitle:
      'بدّل فوراً بين شدة النينيو المعتدلة (+1.5 °م) والشديدة المتطرفة (+3.8 °م) وراقب التأثير الفوري على توقعات الغلال الزراعية ونماذج خسائر الناتج المحلي الإجمالي.',
    intensityLabel: 'شدة ظاهرة النينيو',
    moderateBtn: 'معتدل',
    moderateDesc: 'ONI +1.5 °م · IOD +0.40 °م (×0.55)',
    extremeBtn: 'متطرف',
    extremeDesc: 'ONI +3.8 °م · IOD +1.05 °م (×1.45)',
    oniSliderLabel: 'شذوذ المحيط الهادئ ONI (°م)',
    iodSliderLabel: 'قطبية المحيط الهندي IOD+ (°م)',
    horizonLabel: 'الأفق',
    scopeLabel: 'النطاق',
    scope119: '119 مقاطعة (مدمج)',
    scope42: '42 مقاطعة تجريبية ML',
    currencyLabel: 'العملة',
    resetBtn: 'إعادة ضبط',
    saveBtn: 'حفظ المحاكاة',
    savedBtn: 'تم الحفظ في Firestore',
    yieldSectionTitle: 'توقعات الغلال الزراعية بالزمن الحقيقي',
    yieldSectionNote: 'المرجع الزراعي FOFIFA / FAO (طن/هكتار والحجم المعرض للخطر)',
    cropNames: {
      rice: 'الأرز (وطني)',
      maize: 'الذرة المطرية (الجنوب والغرب)',
      cassava: 'الكسافا والدرنات',
      export: 'محاصيل التصدير (الفانيليا، القرنفل، البن)',
    },
    baselineYieldCol: 'الأساس طن/هـ',
    simulatedYieldCol: 'المحاكى طن/هـ',
    deltaCol: 'التغير',
    tonnageRiskCol: 'الحجم المعرض للخطر',
    gdpSectionTitle: 'التأثير على خسائر الناتج المحلي الإجمالي وأسعار الغذاء',
    gdpSectionNote: 'صدمة زراعية مباشرة + خسائر غير مباشرة في الطاقة والنقل',
    kpiTotalLoss: 'إجمالي خسائر مدغشقر',
    kpiDirectIndirect: 'مباشرة / غير مباشرة',
    kpiDeltaVsMod: 'العبء الإضافي مقابل المعتدل',
    kpiRicePrice: 'السعر المتوقع للأرز في أنتاناناريفو',
    kpiExposedPop: 'السكان المعرضون للخطر',
    kpiWorldYear: 'الخسارة العالمية السنوية (195 دولة)',
    chartTitle: 'مقارنة خسائر الناتج المحلي حسب المقاطعات الست',
    chartModerateLegend: 'معتدل (×0.55)',
    chartActiveLegend: 'المحاكاة النشطة',
    chartExtremeLegend: 'متطرف (×1.45)',
    districtsTableTitle: 'أكثر المقاطعات تضرراً في الوضع النشط',
    districtCol: 'المقاطعة / الإقليم',
    rainCol: 'الأمطار %',
    riceCol: 'الأرز %',
    maizeCol: 'الذرة %',
    lossCol: 'خسارة الناتج',
    worldBlocsTitle: 'التأثير العالمي عبر مناطق الأمم المتحدة الست (195 دولة)',
    zoneCol: 'المنطقة / القارة',
    countriesCol: 'الدول',
    activeLossCol: 'الخسارة السنوية المحاكاة',
    inflationCol: 'التضخم الغذائي الإضافي',
    blocsFooter: 'التكتلات الأفريقية المحاكاة',
  },
  zh: {
    kicker: '交互式 ENSO 建模 · 农业单产与 GDP 损失预测',
    title: '气候情景模拟器',
    subtitle:
      '在“中等强度”厄尔尼诺（ONI +1.5 °C）与“极端超强”厄尔尼诺（ONI +3.8 °C）之间即时切换，实时观测对农作物单产预测及宏观 GDP 损失模型的影响。',
    intensityLabel: '厄尔尼诺强度等级',
    moderateBtn: '中等强度 (Moderate)',
    moderateDesc: 'ONI +1.5 °C · IOD +0.40 °C (×0.55)',
    extremeBtn: '极端超强 (Extreme)',
    extremeDesc: 'ONI +3.8 °C · IOD +1.05 °C (×1.45)',
    oniSliderLabel: '太平洋 ONI 异常 (°C)',
    iodSliderLabel: '印度洋偶极子 IOD+ (°C)',
    horizonLabel: '年份',
    scopeLabel: '口径',
    scope119: '119区全覆盖',
    scope42: '42个 ML 试点区',
    currencyLabel: '货币',
    resetBtn: '重置',
    saveBtn: '保存模拟',
    savedBtn: '已存至 Firestore',
    yieldSectionTitle: '实时农业单产预测模型',
    yieldSectionNote: '基于 FOFIFA / FAO 马达加斯加农艺基准（吨/公顷与受险产量）',
    cropNames: {
      rice: '稻谷（全国主粮）',
      maize: '旱作玉米（南部与西部）',
      cassava: '木薯与块茎作物',
      export: '出口经济作物（香草、丁香、咖啡）',
    },
    baselineYieldCol: '基准 吨/公顷',
    simulatedYieldCol: '模拟 吨/公顷',
    deltaCol: '单产变化',
    tonnageRiskCol: '受险产量',
    gdpSectionTitle: 'GDP 损失模型与粮价实时影响',
    gdpSectionNote: '农业直接冲击 + 水电 RIA / 畜牧 / 道路间接传导损失',
    kpiTotalLoss: '马达加斯加总经济损失',
    kpiDirectIndirect: '直接 / 间接',
    kpiDeltaVsMod: '较中等情景额外增量损失',
    kpiRicePrice: '塔那那利佛大米预测价格',
    kpiExposedPop: '粮食安全脆弱人口',
    kpiWorldYear: '全球年度总损失（195联合国国家）',
    chartTitle: '马达加斯加6大前省 GDP 损失情景对比',
    chartModerateLegend: '中等 (×0.55)',
    chartActiveLegend: '当前模拟',
    chartExtremeLegend: '极端 (×1.45)',
    districtsTableTitle: '当前强度下高暴露风险区县',
    districtCol: '区县 / 省区',
    rainCol: '降水 Δ%',
    riceCol: '稻谷 Δ%',
    maizeCol: '玉米 Δ%',
    lossCol: 'GDP 损失',
    worldBlocsTitle: '联合国6大区域全球传导（195国）',
    zoneCol: '联合国区域 / 大洲',
    countriesCol: '国家数',
    activeLossCol: '模拟年度损失',
    inflationCol: '食品通胀增幅',
    blocsFooter: '非洲区域联盟模拟',
  },
  pt: {
    kicker: 'Modelagem Interativa ENSO · Produtividade Agrícola & PIB',
    title: 'Simulador de Cenários Climáticos',
    subtitle:
      'Alterne instantaneamente entre El Niño Moderado (+1,5 °C ONI) e Super El Niño Extremo (+3,8 °C ONI) e observe o impacto em tempo real nas previsões de colheita e perdas do PIB.',
    intensityLabel: 'Intensidade do El Niño',
    moderateBtn: 'Moderado',
    moderateDesc: 'ONI +1,5 °C · IOD +0,40 °C (×0,55)',
    extremeBtn: 'Extremo',
    extremeDesc: 'ONI +3,8 °C · IOD +1,05 °C (×1,45)',
    oniSliderLabel: 'Anomalia Pacífico ONI (°C)',
    iodSliderLabel: 'Dipolo Índico IOD+ (°C)',
    horizonLabel: 'Horizonte',
    scopeLabel: 'Escopo',
    scope119: '119 distritos (consolidado)',
    scope42: '42 distritos piloto ML',
    currencyLabel: 'Moeda',
    resetBtn: 'Redefinir',
    saveBtn: 'Salvar simulação',
    savedBtn: 'Salvo no Firestore',
    yieldSectionTitle: 'Previsões de Produtividade Agrícola em Tempo Real',
    yieldSectionNote: 'Base agronômica FOFIFA / FAO Madagáscar (t/ha e volume em risco)',
    cropNames: {
      rice: 'Arroz com casca (Nacional)',
      maize: 'Milho de sequeiro (Sul e Oeste)',
      cassava: 'Mandioca e tubérculos',
      export: 'Culturas de exportação (Baunilha, Cravo, Café)',
    },
    baselineYieldCol: 'Base t/ha',
    simulatedYieldCol: 'Simulado t/ha',
    deltaCol: 'Variação',
    tonnageRiskCol: 'Volume em risco',
    gdpSectionTitle: 'Impacto nos Modelos de Perda de PIB e Preços',
    gdpSectionNote: 'Choque agrícola direto mais perdas indiretas hídricas e de logística',
    kpiTotalLoss: 'Perda Total em Madagáscar',
    kpiDirectIndirect: 'Direta / Indireta',
    kpiDeltaVsMod: 'Custo extra vs Moderado',
    kpiRicePrice: 'Preço projetado arroz Antananarivo',
    kpiExposedPop: 'População exposta',
    kpiWorldYear: 'Perda Anual Global (195 países ONU)',
    chartTitle: 'Comparação de Perdas do PIB por Ex-Província',
    chartModerateLegend: 'Moderado (×0,55)',
    chartActiveLegend: 'Simulação ativa',
    chartExtremeLegend: 'Extremo (×1,45)',
    districtsTableTitle: 'Distritos Mais Expostos sob Intensidade Ativa',
    districtCol: 'Distrito / Ex-Província',
    rainCol: 'Chuva Δ%',
    riceCol: 'Arroz Δ%',
    maizeCol: 'Milho Δ%',
    lossCol: 'Perda PIB',
    worldBlocsTitle: 'Repercussão Global nas 6 Zonas ONU (195 Países)',
    zoneCol: 'Zona ONU / Continente',
    countriesCol: 'Países',
    activeLossCol: 'Perda Anual Simulada',
    inflationCol: 'Inflação Alim. Adicional',
    blocsFooter: 'Blocos africanos simulados',
  },
  hi: {
    kicker: 'इंटरैक्टिव ENSO मॉडलिंग · कृषि उपज एवं GDP हानि',
    title: 'जलवायु परिदृश्य सिम्युलेटर',
    subtitle:
      'मध्यम अल नीनो (+1.5 °C ONI) और चरम सुपर अल नीनो (+3.8 °C ONI) के बीच तुरंत स्विच करें और कृषि उपज पूर्वानुमान व GDP हानि मॉडल पर रीयल-टाइम प्रभाव देखें।',
    intensityLabel: 'अल नीनो तीव्रता',
    moderateBtn: 'मध्यम (Moderate)',
    moderateDesc: 'ONI +1.5 °C · IOD +0.40 °C (×0.55)',
    extremeBtn: 'चरम (Extreme)',
    extremeDesc: 'ONI +3.8 °C · IOD +1.05 °C (×1.45)',
    oniSliderLabel: 'प्रशांत ONI विसंगति (°C)',
    iodSliderLabel: 'हिंद महासागर द्विध्रुव IOD+ (°C)',
    horizonLabel: 'वर्ष',
    scopeLabel: 'दायरा',
    scope119: '119 जिले (समेकित)',
    scope42: '42 पायलट ML जिले',
    currencyLabel: 'मुद्रा',
    resetBtn: 'रीसेट',
    saveBtn: 'सिमुलेशन सहेजें',
    savedBtn: 'Firestore में सहेजा गया',
    yieldSectionTitle: 'रीयल-टाइम कृषि उपज पूर्वानुमान',
    yieldSectionNote: 'FOFIFA / FAO मेडागास्कर कृषि आधार (टन/हेक्टेयर)',
    cropNames: {
      rice: 'धान चावल (राष्ट्रीय)',
      maize: 'वर्षा आधारित मक्का (दक्षिण व पश्चिम)',
      cassava: 'कसावा एवं कंद',
      export: 'निर्यात फसलें (वनीला, लौंग, कॉफ़ी)',
    },
    baselineYieldCol: 'आधार t/ha',
    simulatedYieldCol: 'अनुमानित t/ha',
    deltaCol: 'परिवर्तन',
    tonnageRiskCol: 'जोखिम मात्रा',
    gdpSectionTitle: 'GDP हानि मॉडल और खाद्य मूल्य प्रभाव',
    gdpSectionNote: 'प्रत्यक्ष कृषि आघात + अप्रत्यक्ष जलविद्युत, पशुधन व सड़क हानि',
    kpiTotalLoss: 'मेडागास्कर कुल GDP हानि',
    kpiDirectIndirect: 'प्रत्यक्ष / अप्रत्यक्ष',
    kpiDeltaVsMod: 'मध्यम की तुलना में अतिरिक्त हानि',
    kpiRicePrice: 'अंतानानारिवो अनुमानित चावल मूल्य',
    kpiExposedPop: 'प्रभावित जनसंख्या',
    kpiWorldYear: 'वार्षिक वैश्विक हानि (195 UN देश)',
    chartTitle: 'पूर्व-प्रांत अनुसार GDP हानि तुलना',
    chartModerateLegend: 'मध्यम (×0.55)',
    chartActiveLegend: 'सक्रिय सिमुलेशन',
    chartExtremeLegend: 'चरम (×1.45)',
    districtsTableTitle: 'सक्रिय तीव्रता में सर्वाधिक संवेदनशील जिले',
    districtCol: 'जिला / प्रांत',
    rainCol: 'वर्षा Δ%',
    riceCol: 'चावल Δ%',
    maizeCol: 'मक्का Δ%',
    lossCol: 'GDP हानि',
    worldBlocsTitle: '6 UN क्षेत्रों में वैश्विक प्रभाव (195 देश)',
    zoneCol: 'UN क्षेत्र / महाद्वीप',
    countriesCol: 'देश',
    activeLossCol: 'अनुमानित वार्षिक हानि',
    inflationCol: 'अतिरिक्त खाद्य मुद्रास्फीति',
    blocsFooter: 'अफ्रीकी क्षेत्रीय ब्लॉक',
  },
  ru: {
    kicker: 'Интерактивное моделирование ЭНЮК · Урожайность и потери ВВП',
    title: 'Симулятор климатических сценариев',
    subtitle:
      'Мгновенно переключайтесь между умеренным Эль-Ниньо (+1,5 °C ONI) и экстремальным Супер Эль-Ниньо (+3,8 °C ONI) и отслеживайте влияние на урожайность и модели потерь ВВП в реальном времени.',
    intensityLabel: 'Интенсивность Эль-Ниньо',
    moderateBtn: 'Умеренный',
    moderateDesc: 'ONI +1,5 °C · IOD +0,40 °C (×0,55)',
    extremeBtn: 'Экстремальный',
    extremeDesc: 'ONI +3,8 °C · IOD +1,05 °C (×1,45)',
    oniSliderLabel: 'Аномалия Тихого океана ONI (°C)',
    iodSliderLabel: 'Диполь Индийского океана IOD+ (°C)',
    horizonLabel: 'Горизонт',
    scopeLabel: 'Охват',
    scope119: '119 округов (консолид.)',
    scope42: '42 пилотных округа ML',
    currencyLabel: 'Валюта',
    resetBtn: 'Сброс',
    saveBtn: 'Сохранить расчёт',
    savedBtn: 'Сохранено в Firestore',
    yieldSectionTitle: 'Прогноз урожайности в реальном времени',
    yieldSectionNote: 'Агрономическая база FOFIFA / ФАО (т/га и объём под риском)',
    cropNames: {
      rice: 'Рис-сырец (национальный)',
      maize: 'Богарная кукуруза (Юг и Запад)',
      cassava: 'Маниок и корнеплоды',
      export: 'Экспортные культуры (Ваниль, Гвоздика, Кофе)',
    },
    baselineYieldCol: 'База т/га',
    simulatedYieldCol: 'Прогноз т/га',
    deltaCol: 'Изменение',
    tonnageRiskCol: 'Объём под риском',
    gdpSectionTitle: 'Влияние на модели потерь ВВП и продовольственные цены',
    gdpSectionNote: 'Прямой аграрный шок + косвенные потери ГЭС RIA, скота и логистики',
    kpiTotalLoss: 'Совокупные потери Мадагаскара',
    kpiDirectIndirect: 'Прямые / Косвенные',
    kpiDeltaVsMod: 'Доп. потери к умеренному',
    kpiRicePrice: 'Прогноз цены риса (Антананариву)',
    kpiExposedPop: 'Уязвимое население',
    kpiWorldYear: 'Мировые годовые потери (195 стран)',
    chartTitle: 'Сравнение потерь ВВП по 6 экс-провинциям',
    chartModerateLegend: 'Умеренный (×0,55)',
    chartActiveLegend: 'Активный сценарий',
    chartExtremeLegend: 'Экстремальный (×1,45)',
    districtsTableTitle: 'Наиболее уязвимые округа при текущем уровне',
    districtCol: 'Округ / Провинция',
    rainCol: 'Осадки Δ%',
    riceCol: 'Рис Δ%',
    maizeCol: 'Кукуруза Δ%',
    lossCol: 'Потери ВВП',
    worldBlocsTitle: 'Глобальное влияние по 6 зонам ООН (195 стран)',
    zoneCol: 'Зона ООН / Континент',
    countriesCol: 'Страны',
    activeLossCol: 'Годовые потери',
    inflationCol: 'Доп. прод. инфляция',
    blocsFooter: 'Африканские экономические блоки',
  },
};

export function ClimateScenarioSimulator() {
  const { lang, worldLang } = useLanguage();
  const { syncState } = useGlobalSync();
  const { user, saveAnalysisSnapshot } = useAuth();
  const copy = SIM_COPY[worldLang];

  const [intensity, setIntensity] = useState<ElNinoIntensity>('extreme');
  const [oniC, setOniC] = useState<number>(INTENSITY_PRESETS.extreme.oniC);
  const [iodC, setIodC] = useState<number>(INTENSITY_PRESETS.extreme.iodC);
  const [horizonYear, setHorizonYear] = useState<HorizonYear>(2027);
  const [scope, setScope] = useState<ScopeMode>('consolidated119');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const selectIntensity = (next: ElNinoIntensity) => {
    setIntensity(next);
    setOniC(INTENSITY_PRESETS[next].oniC);
    setIodC(INTENSITY_PRESETS[next].iodC);
  };

  const handleOniChange = (val: number) => {
    setOniC(val);
    setIntensity(val >= 2.65 ? 'extreme' : 'moderate');
  };

  const handleIodChange = (val: number) => {
    setIodC(val);
    setIntensity(oniC >= 2.65 || val >= 0.75 ? 'extreme' : 'moderate');
  };

  const sim = useMemo(
    () =>
      simulateClimateScenario({
        intensity,
        oniC,
        iodC,
        horizonYear,
        scope,
        lang,
        syncState,
      }),
    [intensity, oniC, iodC, horizonYear, scope, lang, syncState],
  );

  const locale = worldLang === 'fr' ? 'fr-FR' : 'en-US';
  const isExtreme = intensity === 'extreme';

  const handleSave = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-workspace-modal'));
      return;
    }
    setSaving(true);
    try {
      const riceCrop = sim.crops[0];
      await saveAnalysisSnapshot({
        scope: `simulator-${intensity}`,
        regionName: `Madagascar (${scope === 'consolidated119' ? '119 ADM2' : '42 ML'}) · ONI +${oniC.toFixed(1)}°C`,
        year: horizonYear,
        scenario: isExtreme ? 's3' : 's1',
        summary: `Intensity=${intensity} (x${sim.stressMultiplier}) | GDP Loss=${formatCurrencyFromMUsd(sim.gdpModel.madagascarTotalMUsd, currency, false, lang)} (${sim.gdpModel.madagascarGdpPct}% GDP) | Rice Yield=${riceCrop.simulatedYieldTHa} t/ha (${riceCrop.deltaPct}%) | World=${sim.gdpModel.worldYearlyLossBUsd} B USD`,
      });
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 3200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="simulateur-scenarios"
      aria-labelledby="sim-title"
      className="border-t border-zinc-200 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-zinc-500">{copy.kicker}</p>
            <h2
              id="sim-title"
              className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
            >
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">{copy.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => selectIntensity('extreme')}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3.5 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.resetBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              {savedNotice ? (
                <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
              ) : (
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{savedNotice ? copy.savedBtn : copy.saveBtn}</span>
            </button>
          </div>
        </div>

        {/* Interactive Intensity & Ocean Forcing Control Bar */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            {/* Moderate vs Extreme Toggle */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>{copy.intensityLabel}</span>
                <span className="text-zinc-400" aria-hidden="true">
                  ·
                </span>
                <span className="font-mono tabular-nums text-[#1E3A8A]">
                  ×{sim.stressMultiplier.toFixed(2)}
                </span>
              </div>

              <div
                role="group"
                aria-label={copy.intensityLabel}
                className="mt-2.5 grid grid-cols-2 gap-2 rounded-lg border border-zinc-200 bg-white p-1.5"
              >
                <button
                  type="button"
                  aria-pressed={!isExtreme}
                  onClick={() => selectIntensity('moderate')}
                  className={`flex min-h-11 flex-col items-start justify-center rounded-md px-3.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                    !isExtreme
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-transparent text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-xs font-semibold sm:text-sm">{copy.moderateBtn}</span>
                  <span
                    className={`mt-0.5 font-mono text-[10.5px] tabular-nums ${
                      !isExtreme ? 'text-blue-100' : 'text-zinc-500'
                    }`}
                  >
                    {copy.moderateDesc}
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={isExtreme}
                  onClick={() => selectIntensity('extreme')}
                  className={`flex min-h-11 flex-col items-start justify-center rounded-md px-3.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                    isExtreme
                      ? 'bg-rose-800 text-white'
                      : 'bg-transparent text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-xs font-semibold sm:text-sm">{copy.extremeBtn}</span>
                  <span
                    className={`mt-0.5 font-mono text-[10.5px] tabular-nums ${
                      isExtreme ? 'text-rose-100' : 'text-zinc-500'
                    }`}
                  >
                    {copy.extremeDesc}
                  </span>
                </button>
              </div>
            </div>

            {/* Sliders: ONI & IOD+ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="sim-oni-range" className="font-medium text-zinc-700">
                    {copy.oniSliderLabel}
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-zinc-900">
                    +{oniC.toFixed(1)} °C
                  </span>
                </div>
                <input
                  id="sim-oni-range"
                  type="range"
                  min={1.0}
                  max={4.3}
                  step={0.1}
                  value={oniC}
                  onChange={(e) => handleOniChange(Number(e.target.value))}
                  className="mt-2.5 h-2 w-full cursor-pointer accent-[#1E3A8A]"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-500 tabular-nums">
                  <span>+1.0°C</span>
                  <span>+2.5°C</span>
                  <span>+4.3°C</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="sim-iod-range" className="font-medium text-zinc-700">
                    {copy.iodSliderLabel}
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-zinc-900">
                    +{iodC.toFixed(2)} °C
                  </span>
                </div>
                <input
                  id="sim-iod-range"
                  type="range"
                  min={0.1}
                  max={1.3}
                  step={0.05}
                  value={iodC}
                  onChange={(e) => handleIodChange(Number(e.target.value))}
                  className="mt-2.5 h-2 w-full cursor-pointer accent-[#B45309]"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-500 tabular-nums">
                  <span>+0.10°C</span>
                  <span>+0.70°C</span>
                  <span>+1.30°C</span>
                </div>
              </div>
            </div>

            {/* Horizon, Scope & Currency */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-600">{copy.horizonLabel}</span>
                <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
                  {([2027, 2028] as const).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setHorizonYear(yr)}
                      className={`rounded px-2.5 py-1 font-mono text-xs font-semibold tabular-nums transition-colors ${
                        horizonYear === yr
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-600">{copy.currencyLabel}</span>
                <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
                  {(['USD', 'MGA', 'EUR'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`rounded px-2 py-1 font-mono text-[11px] font-semibold transition-colors ${
                        currency === curr
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-600">{copy.scopeLabel}</span>
                <select
                  aria-label={copy.scopeLabel}
                  value={scope}
                  onChange={(e) => setScope(e.target.value as ScopeMode)}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 focus:outline-none"
                >
                  <option value="consolidated119">{copy.scope119}</option>
                  <option value="pilot42">{copy.scope42}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live KPI Strip — Real-Time Macroeconomic Impact */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <p className="text-xs text-zinc-600">{copy.kpiTotalLoss}</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-zinc-900">
              {formatCurrencyFromMUsd(sim.gdpModel.madagascarTotalMUsd, currency, false, lang)}
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-zinc-600">
              {sim.gdpModel.madagascarGdpPct.toFixed(2)}% GDP · -{sim.gdpModel.madagascarAgriGdpPct.toFixed(1)}% Agri
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <p className="text-xs text-zinc-600">{copy.kpiDirectIndirect}</p>
            <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums text-zinc-900">
              {formatCurrencyFromMUsd(sim.gdpModel.madagascarDirectMUsd, currency, false, lang)}
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-zinc-600">
              + {formatCurrencyFromMUsd(sim.gdpModel.madagascarIndirectMUsd, currency, false, lang)} indirect
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <p className="text-xs text-zinc-600">{copy.kpiDeltaVsMod}</p>
            <p
              className={`mt-1.5 font-mono text-2xl font-bold tabular-nums ${
                sim.gdpModel.deltaVsModerateMUsd > 50 ? 'text-rose-700' : 'text-zinc-900'
              }`}
            >
              {sim.gdpModel.deltaVsModerateMUsd >= 0 ? '+' : '−'}
              {formatCurrencyFromMUsd(
                Math.abs(sim.gdpModel.deltaVsModerateMUsd),
                currency,
                false,
                lang,
              )}
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-zinc-600">
              {copy.moderateBtn}: {formatCurrencyFromMUsd(sim.gdpModel.moderateTotalMUsd, currency, false, lang)}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <p className="text-xs text-zinc-600">{copy.kpiRicePrice}</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-zinc-900">
              {sim.gdpModel.projectedRicePriceMga.toLocaleString(locale)} MGA
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-amber-800">
              +{sim.gdpModel.riceInflationPct.toFixed(1)}% / kg · {sim.gdpModel.exposedPopulationM.toFixed(2)}M pop.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4">
            <p className="text-xs text-zinc-600">{copy.kpiWorldYear}</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-[#1E3A8A]">
              ${sim.gdpModel.worldYearlyLossBUsd.toLocaleString(locale)} B
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-zinc-600">
              2027–31: ${sim.gdpModel.worldCumulative2027_2031BUsd.toLocaleString(locale)} B USD
            </p>
          </div>
        </div>

        {/* Two-Column Core Comparison: Crop Yield Predictions & Ex-Province GDP Chart */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 5 cols: Real-Time Agricultural Yield Predictions */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 lg:col-span-5">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">
              {copy.yieldSectionTitle}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">{copy.yieldSectionNote}</p>

            <div className="mt-5 divide-y divide-zinc-100">
              {sim.crops.map((crop) => {
                const pctWidth = Math.max(
                  12,
                  Math.min(100, Math.round((crop.simulatedYieldTHa / crop.baselineYieldTHa) * 100)),
                );
                const isLoss = crop.deltaPct < 0;
                return (
                  <div key={crop.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-zinc-900">
                        {copy.cropNames[crop.id]}
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          isLoss ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {crop.deltaPct > 0 ? '+' : ''}
                        {crop.deltaPct.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-xs text-zinc-600 font-mono tabular-nums">
                      <span>
                        {copy.baselineYieldCol}: {crop.baselineYieldTHa.toFixed(2)} →{' '}
                        <strong className="text-zinc-900">
                          {crop.simulatedYieldTHa.toFixed(2)} t/ha
                        </strong>
                      </span>
                      <span>
                        {copy.tonnageRiskCol}: {crop.tonnageAtRiskKt.toLocaleString(locale)} kt
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-zinc-100">
                      <div
                        className={`h-full transition-all duration-300 ${
                          crop.deltaPct <= -20
                            ? 'bg-rose-700'
                            : crop.deltaPct < 0
                              ? 'bg-amber-600'
                              : 'bg-emerald-700'
                        }`}
                        style={{ width: `${pctWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 cols: Real-Time GDP Loss Models by Madagascar Ex-Province (Recharts) */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 lg:col-span-7">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">
              {copy.gdpSectionTitle}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">{copy.gdpSectionNote}</p>

            <div className="mt-4 h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sim.provinceComparisons}
                  margin={{ top: 10, right: 12, left: 0, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis
                    dataKey="province"
                    tick={{ fontSize: 11, fill: '#3F3F46' }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#3F3F46' }}
                    unit="M$"
                  />
                  <Tooltip
                    formatter={(val: unknown) => `${Number(val).toFixed(1)} M USD`}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '6px',
                      borderColor: '#E4E4E7',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar
                    dataKey="moderateLossMUsd"
                    name={copy.chartModerateLegend}
                    fill="#94A3B8"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="activeLossMUsd"
                    name={copy.chartActiveLegend}
                    fill={isExtreme ? '#B91C1C' : '#1E3A8A'}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="extremeLossMUsd"
                    name={copy.chartExtremeLegend}
                    fill="#F59E0B"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Comparative Tables: Top Impacted Districts & 6 UN World Zones */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Top 6 Districts */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 lg:col-span-6">
            <h3 className="font-serif text-base font-semibold text-zinc-900">
              {copy.districtsTableTitle}
            </h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 text-zinc-500">
                  <tr>
                    <th className="py-2 pr-2 font-medium">{copy.districtCol}</th>
                    <th className="px-2 py-2 text-right font-medium">{copy.rainCol}</th>
                    <th className="px-2 py-2 text-right font-medium">{copy.riceCol}</th>
                    <th className="px-2 py-2 text-right font-medium">{copy.maizeCol}</th>
                    <th className="py-2 pl-2 text-right font-medium">{copy.lossCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono tabular-nums">
                  {sim.topImpactedDistricts.map((row) => (
                    <tr key={row.district}>
                      <td className="py-2.5 pr-2 font-sans">
                        <span className="font-medium text-zinc-900">{row.district}</span>
                        <span className="ml-1.5 text-[11px] text-zinc-500">
                          · {row.province}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-right text-zinc-700">
                        {row.waterDeltaPct > 0 ? `+${row.waterDeltaPct}` : row.waterDeltaPct}%
                      </td>
                      <td className="px-2 py-2.5 text-right text-rose-700">
                        {row.riceDeltaPct > 0 ? `+${row.riceDeltaPct}` : row.riceDeltaPct}%
                      </td>
                      <td className="px-2 py-2.5 text-right text-amber-800">
                        {row.maizeDeltaPct > 0 ? `+${row.maizeDeltaPct}` : row.maizeDeltaPct}%
                      </td>
                      <td className="py-2.5 pl-2 text-right font-semibold text-zinc-900">
                        {formatCurrencyFromMUsd(row.lossMUsd, currency, false, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6 UN Zones (195 Countries) + African Blocs */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 lg:col-span-6">
            <h3 className="font-serif text-base font-semibold text-zinc-900">
              {copy.worldBlocsTitle}
            </h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 text-zinc-500">
                  <tr>
                    <th className="py-2 pr-2 font-medium">{copy.zoneCol}</th>
                    <th className="px-2 py-2 text-right font-medium">{copy.countriesCol}</th>
                    <th className="px-2 py-2 text-right font-medium">{copy.activeLossCol}</th>
                    <th className="py-2 pl-2 text-right font-medium">{copy.inflationCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono tabular-nums">
                  {sim.unZoneImpacts.map((z) => (
                    <tr key={z.id}>
                      <td className="py-2.5 pr-2 font-sans font-medium text-zinc-900">
                        {worldLang === 'fr' ? z.nameFr : z.nameEn}
                      </td>
                      <td className="px-2 py-2.5 text-right text-zinc-600">{z.countryCount}</td>
                      <td className="px-2 py-2.5 text-right font-semibold text-[#1E3A8A]">
                        ${z.activeLossBUsd.toLocaleString(locale)} B
                      </td>
                      <td className="py-2.5 pl-2 text-right text-amber-800">
                        +{z.inflationAddPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 border-t border-zinc-100 pt-3 text-[11px] text-zinc-600">
              <span>{copy.blocsFooter} · </span>
              <span className="font-mono tabular-nums text-zinc-800">
                COI {formatCurrencyFromMUsd(sim.gdpModel.coiTotalMUsd, currency, false, lang)} ·{' '}
                SADC {formatCurrencyFromMUsd(sim.gdpModel.sadcTotalMUsd, currency, false, lang)} ·{' '}
                COMESA {formatCurrencyFromMUsd(sim.gdpModel.comesaTotalMUsd, currency, false, lang)} ·{' '}
                Afrique {formatCurrencyFromMUsd(sim.gdpModel.africaTotalMUsd, currency, false, lang)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
