import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Cpu,
  Database,
  Droplets,
  Flame,
  Globe,
  Layers,
  Loader2,
  MapPin,
  Radio,
  RotateCcw,
  Search,
  ShieldAlert,
  Users,
  Wind,
} from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import {
  DUPLICATED_195_COUNTRIES,
  UN_ZONE_META,
  type ForecastYear,
} from '../data/worldEnso195Data';
import { DISTRICT_CHOROPLETH_DATA } from '../data/ensoData';
import {
  CONTINENT_MAP_CENTERS,
  INDIAN_OCEAN_NODES,
  WORLD_COORDS_BY_ISO2,
} from '../data/worldCoordinates195';

interface GeoJsonFeature {
  type: 'Feature';
  properties?: {
    name?: string;
    iso2?: string;
    iso3?: string;
  };
  geometry?: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  } | null;
}

interface GeoJsonCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

interface DistrictPredictionResult {
  model: string;
  district: string;
  region: string;
  year: number;
  waterDeltaPct: number;
  riceDeltaPct: number;
  maizeDeltaPct: number;
  exportCropDeltaPct: number;
  droughtIndex: number;
  floodIndex: number;
}

export type MapViewportScope =
  | 'world'
  | 'continents'
  | 'africa'
  | 'madagascar'
  | 'indian-ocean';

export type RiskLayerType =
  | 'composite'
  | 'drought'
  | 'flood'
  | 'heat'
  | 'displacement';

export interface ClimateMapNode {
  id: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  compositeScore: number;
  droughtScore: number;
  floodScore: number;
  heatScore: number;
  displacementScore: number;
  gdpOrYieldDelta: number;
  metricBadge: string;
  hazardSummary: string;
  extraMeta: string;
}

interface WeatherPointAlert {
  id: string;
  title: string;
  eventType: string;
  areaName: string;
  severity: string;
  urgency: string;
  description: string;
  startTime: string | null;
  expirationTime: string | null;
  dataSource: {
    publisher: string;
    name: string;
    authorityUri: string;
  };
}

interface WeatherPointResponse {
  available: boolean;
  quotaExceeded?: boolean;
  reason?: string;
  regionCode?: string | null;
  current?: {
    currentTime: string | null;
    conditionText: string | null;
    conditionType: string | null;
    iconUri: string | null;
    tempC: number | null;
    feelsLikeC: number | null;
    humidityPct: number | null;
    uvIndex: number | null;
    precipProbPct: number | null;
    precipMm: number | null;
    windKmh: number | null;
    windCardinal: string | null;
  } | null;
  alerts?: WeatherPointAlert[];
}

const FORECAST_YEARS: ForecastYear[] = [2027, 2028, 2029, 2030, 2031, 2032];

interface ViewportCameraConfig {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  circleMinRadiusM: number;
  circleMaxRadiusM: number;
}

const VIEWPORT_CONFIGS: Record<MapViewportScope, ViewportCameraConfig> = {
  world: {
    center: { lat: 16, lng: 16 },
    zoom: 2.1,
    bounds: { minLat: -56, maxLat: 72, minLng: -180, maxLng: 180 },
    circleMinRadiusM: 140000,
    circleMaxRadiusM: 520000,
  },
  continents: {
    center: { lat: 8, lng: 18 },
    zoom: 1.9,
    bounds: { minLat: -82, maxLat: 72, minLng: -180, maxLng: 180 },
    circleMinRadiusM: 750000,
    circleMaxRadiusM: 1850000,
  },
  africa: {
    center: { lat: 2.5, lng: 20.0 },
    zoom: 3.3,
    bounds: { minLat: -37, maxLat: 39, minLng: -25, maxLng: 60 },
    circleMinRadiusM: 130000,
    circleMaxRadiusM: 440000,
  },
  madagascar: {
    center: { lat: -18.85, lng: 46.85 },
    zoom: 5.5,
    bounds: { minLat: -26.2, maxLat: -11.4, minLng: 42.6, maxLng: 51.2 },
    circleMinRadiusM: 18000,
    circleMaxRadiusM: 64000,
  },
  'indian-ocean': {
    center: { lat: -14.8, lng: 50.2 },
    zoom: 4.3,
    bounds: { minLat: -28, maxLat: 2, minLng: 37, maxLng: 64 },
    circleMinRadiusM: 110000,
    circleMaxRadiusM: 340000,
  },
};

function getLayerScore(node: ClimateMapNode, layer: RiskLayerType): number {
  switch (layer) {
    case 'drought':
      return node.droughtScore;
    case 'flood':
      return node.floodScore;
    case 'heat':
      return node.heatScore;
    case 'displacement':
      return node.displacementScore;
    default:
      return node.compositeScore;
  }
}

interface RiskTierColor {
  fill: string;
  stroke: string;
  badgeBg: string;
  badgeText: string;
  tierKey: 'critical' | 'high' | 'moderate' | 'low';
}

function getScoreStyle(score: number): RiskTierColor {
  if (score >= 80) {
    return {
      fill: '#BE123C',
      stroke: '#881337',
      badgeBg: '#FFE4E6',
      badgeText: '#9F1239',
      tierKey: 'critical',
    };
  }
  if (score >= 60) {
    return {
      fill: '#D97706',
      stroke: '#92400E',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
      tierKey: 'high',
    };
  }
  if (score >= 35) {
    return {
      fill: '#0284C7',
      stroke: '#075985',
      badgeBg: '#E0F2FE',
      badgeText: '#075985',
      tierKey: 'moderate',
    };
  }
  return {
    fill: '#059669',
    stroke: '#065F46',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    tierKey: 'low',
  };
}

interface CopyBundle {
  eyebrow: string;
  title: string;
  lead: string;
  scopeLabel: string;
  scopes: Record<MapViewportScope, string>;
  layerLabel: string;
  layers: Record<RiskLayerType, string>;
  yearLabel: string;
  madagascarYearNote: string;
  searchPlaceholder: string;
  allOption: string;
  mapTypes: { terrain: string; roadmap: string; hybrid: string };
  recenter: string;
  legendTitle: string;
  legendShow: string;
  legendHide: string;
  legendRadiusNote: string;
  tiers: { critical: string; high: string; moderate: string; low: string };
  unitsActive: string;
  topExposureTitle: string;
  selectedTitle: string;
  gdpOrYieldLabel: string;
  droughtLabel: string;
  floodLabel: string;
  heatLabel: string;
  displacementLabel: string;
  fetchWeatherBtn: string;
  fetchingWeather: string;
  weatherTitle: string;
  weatherAlertsTitle: string;
  noAlerts: string;
  sourceLabel: string;
  fallbackBannerTitle: string;
  fallbackBannerBody: string;
  fallbackCanvasBadge: string;
  mlPredictBtn: string;
  mlPredicting: string;
}

const COPY_BY_LANG: Record<WorldLanguageCode, CopyBundle> = {
  fr: {
    eyebrow: 'Section 05B · Cartographie Géospatiale Multi-Échelles',
    title: 'Carte des Risques Climatiques : 195 Pays, Continents, Afrique, Madagascar & Océan Indien',
    lead: 'Visualisation géospatiale choroplèthe et multicouche (sécheresse, crues & cyclones, stress thermique et déplacements) sur les 195 États ONU, les 6 continents, l’Afrique, les 42 districts de Madagascar (2027–2032) et le bassin COI/SWIO.',
    scopeLabel: 'Échelle géographique',
    scopes: {
      world: 'Monde (195 ONU)',
      continents: 'Continents (6)',
      africa: 'Afrique (54)',
      madagascar: 'Madagascar (42)',
      'indian-ocean': 'Océan Indien (COI)',
    },
    layerLabel: 'Couche de risque',
    layers: {
      composite: 'Risque Composite',
      drought: 'Sévérité Sécheresse',
      flood: 'Crues & Cyclones',
      heat: 'Stress Thermique / ONI',
      displacement: 'Déplacements Climatiques',
    },
    yearLabel: 'Horizon',
    madagascarYearNote: 'Les 42 districts malgaches couvrent désormais 2027–2032 (XGBoost 2027–2028 + extrapolation multi-horizons).',
    searchPlaceholder: 'Filtrer un pays, continent ou district...',
    allOption: 'Toutes les zones',
    mapTypes: { terrain: 'Relief', roadmap: 'Plan', hybrid: 'Satellite' },
    recenter: 'Recentrer',
    legendTitle: 'Légende des Risques',
    legendShow: 'Afficher',
    legendHide: 'Masquer',
    legendRadiusNote: 'Polygones frontaliers + cercles proportionnels',
    tiers: {
      critical: 'Critique (80–100)',
      high: 'Élevé (60–79)',
      moderate: 'Modéré (35–59)',
      low: 'Faible (0–34)',
    },
    unitsActive: 'entités actives',
    topExposureTitle: 'Zones les Plus Exposées',
    selectedTitle: 'Fiche Risque du Point Sélectionné',
    gdpOrYieldLabel: 'Impact Projeté',
    droughtLabel: 'Sécheresse',
    floodLabel: 'Crues / Cyclones',
    heatLabel: 'Stress Thermique',
    displacementLabel: 'Déplacements',
    fetchWeatherBtn: 'Météo & Alertes en Temps Réel',
    fetchingWeather: 'Interrogation Weather API...',
    weatherTitle: 'Conditions Météo Actuelles',
    weatherAlertsTitle: 'Alertes Météorologiques Officielles',
    noAlerts: 'Aucune alerte météo officielle active signalée à ces coordonnées.',
    sourceLabel: 'Source',
    fallbackBannerTitle: 'Clé client Google Maps non activée côté navigateur',
    fallbackBannerBody:
      'La couche frontalière GeoJSON et toutes les projections 2027–2032 restent entièrement interactives sur la carte choroplèthe ci-dessous ; les requêtes Météo & Alertes en direct passent par le proxy sécurisé du serveur.',
    fallbackCanvasBadge: 'Choroplèthe GeoJSON · Observatoire',
    mlPredictBtn: 'Exécuter Prédiction ML Serveur (2027–2032)',
    mlPredicting: 'Calcul XGBoost-LSTM en cours...',
  },
  en: {
    eyebrow: 'Section 05B · Multi-Scale Geospatial Risk Map',
    title: 'Climate Risk Map: 195 Countries, Continents, Africa, Madagascar & Indian Ocean',
    lead: 'Choropleth and multi-layer geospatial visualization of drought severity, flood and cyclone exposure, thermal stress, and climate displacement across 195 UN countries, 6 continents, Africa, 42 Madagascar districts (2027–2032), and the Indian Ocean.',
    scopeLabel: 'Geographic Viewport',
    scopes: {
      world: 'World (195 UN)',
      continents: 'Continents (6)',
      africa: 'Africa (54)',
      madagascar: 'Madagascar (42)',
      'indian-ocean': 'Indian Ocean (COI)',
    },
    layerLabel: 'Risk Data Layer',
    layers: {
      composite: 'Composite Risk',
      drought: 'Drought Severity',
      flood: 'Flood & Cyclone',
      heat: 'Thermal / ONI Stress',
      displacement: 'Displacement',
    },
    yearLabel: 'Horizon',
    madagascarYearNote: 'Madagascar district layer now covers full 2027–2032 horizons (XGBoost 2027–2028 + statistical extrapolation).',
    searchPlaceholder: 'Filter country, continent, or district...',
    allOption: 'All nodes',
    mapTypes: { terrain: 'Terrain', roadmap: 'Map', hybrid: 'Satellite' },
    recenter: 'Reset view',
    legendTitle: 'Risk Layer Legend',
    legendShow: 'Show',
    legendHide: 'Hide',
    legendRadiusNote: 'GeoJSON borders + proportional circle intensity',
    tiers: {
      critical: 'Critical (80–100)',
      high: 'High (60–79)',
      moderate: 'Moderate (35–59)',
      low: 'Low (0–34)',
    },
    unitsActive: 'active nodes',
    topExposureTitle: 'Highest Exposure Ranking',
    selectedTitle: 'Selected Location Risk Profile',
    gdpOrYieldLabel: 'Projected Impact',
    droughtLabel: 'Drought',
    floodLabel: 'Flood / Cyclone',
    heatLabel: 'Thermal Stress',
    displacementLabel: 'Displacement',
    fetchWeatherBtn: 'Fetch Live Weather & Alerts',
    fetchingWeather: 'Querying Weather API...',
    weatherTitle: 'Live Weather Conditions',
    weatherAlertsTitle: 'Official Public Weather Alerts',
    noAlerts: 'No active official weather alert reported at these coordinates.',
    sourceLabel: 'Source',
    fallbackBannerTitle: 'Client-side Google Maps tile key not enabled',
    fallbackBannerBody:
      'Country GeoJSON borders and 2027–2032 climate layers remain fully interactive on the choropleth projection below; live Weather & Alerts lookups run securely via the backend proxy.',
    fallbackCanvasBadge: 'GeoJSON Choropleth · Observatory',
    mlPredictBtn: 'Run Server ML Prediction (2027–2032)',
    mlPredicting: 'Computing XGBoost-LSTM...',
  },
  sw: {
    eyebrow: 'Sehemu 05B · Ramani ya Hatari za Tabianchi',
    title: 'Ramani ya Hatari: Nchi 195, Mabara, Afrika, Madagaska na Bahari ya Hindi',
    lead: 'Taswira ya kijiografia yenye mipaka halisi ya nchi za ukame, hatari ya mafuriko na vimbunga, joto kali na uhamaji wa tabianchi kwa nchi 195 za UN, mabara 6, Afrika na Madagaska (2027–2032).',
    scopeLabel: 'Eneo la Ramani',
    scopes: {
      world: 'Dunia (Nchi 195)',
      continents: 'Mabara (6)',
      africa: 'Afrika (54)',
      madagascar: 'Madagaska (42)',
      'indian-ocean': 'Bahari ya Hindi (COI)',
    },
    layerLabel: 'Tabaka la Hatari',
    layers: {
      composite: 'Hatari Jumla',
      drought: 'Ukali wa Ukame',
      flood: 'Mafuriko na Kimbunga',
      heat: 'Msongo wa Joto / ONI',
      displacement: 'Uhamaji wa Watu',
    },
    yearLabel: 'Mwaka',
    madagascarYearNote: 'Wilaya 42 za Madagaska sasa zinaonyesha makadirio ya 2027–2032 kikamilifu.',
    searchPlaceholder: 'Tafuta nchi, bara au wilaya...',
    allOption: 'Maeneo yote',
    mapTypes: { terrain: 'Mandhari', roadmap: 'Ramani', hybrid: 'Setilaiti' },
    recenter: 'Weka upya',
    legendTitle: 'Ufunguo wa Hatari',
    legendShow: 'Onyesha',
    legendHide: 'Ficha',
    legendRadiusNote: 'Mipaka ya GeoJSON + ukubwa wa duara',
    tiers: {
      critical: 'Hatari Kuu (80–100)',
      high: 'Juu (60–79)',
      moderate: 'Wastani (35–59)',
      low: 'Chini (0–34)',
    },
    unitsActive: 'maeneo hai',
    topExposureTitle: 'Maeneo Yenye Hatari Kubwa',
    selectedTitle: 'Wasifu wa Eneo Lililochaguliwa',
    gdpOrYieldLabel: 'Athari Inayokadiriwa',
    droughtLabel: 'Ukame',
    floodLabel: 'Mafuriko',
    heatLabel: 'Joto Kali',
    displacementLabel: 'Uhamaji',
    fetchWeatherBtn: 'Pata Hali ya Hewa & Tahadhari',
    fetchingWeather: 'Inatafuta Weather API...',
    weatherTitle: 'Hali ya Hewa ya Sasa',
    weatherAlertsTitle: 'Tahadhari Rasmi za Hali ya Hewa',
    noAlerts: 'Hakuna tahadhari rasmi ya hali ya hewa katika kuratibu hizi.',
    sourceLabel: 'Chanzo',
    fallbackBannerTitle: 'Ufunguo wa Google Maps wa kivinjari haujaamilishwa',
    fallbackBannerBody:
      'Mipaka ya nchi za GeoJSON na makadirio ya 2027–2032 yanafanya kazi kikamilifu kwenye ramani iliyo hapa chini; maombi ya Weather API hupitia seva salama.',
    fallbackCanvasBadge: 'Ramani ya GeoJSON · Kituo',
    mlPredictBtn: 'Endesha Utabiri wa ML Seva (2027–2032)',
    mlPredicting: 'Inakokotoa XGBoost-LSTM...',
  },
  es: {
    eyebrow: 'Sección 05B · Cartografía Geoespacial Multiescala',
    title: 'Mapa de Riesgos Climáticos: 195 Países, Continentes, África, Madagascar y Océano Índico',
    lead: 'Visualización coroplética y multicapa (sequía, crecidas y ciclones, estrés térmico y desplazamientos) sobre 195 Estados de la ONU, 6 continentes, África, 42 distritos de Madagascar (2027–2032) y la cuenca COI/SWIO.',
    scopeLabel: 'Escala geográfica',
    scopes: {
      world: 'Mundo (195 ONU)',
      continents: 'Continentes (6)',
      africa: 'África (54)',
      madagascar: 'Madagascar (42)',
      'indian-ocean': 'Océano Índico (COI)',
    },
    layerLabel: 'Capa de riesgo',
    layers: {
      composite: 'Riesgo Compuesto',
      drought: 'Severidad de Sequía',
      flood: 'Inundaciones y Ciclones',
      heat: 'Estrés Térmico / ONI',
      displacement: 'Desplazamientos',
    },
    yearLabel: 'Horizonte',
    madagascarYearNote: 'Los 42 distritos de Madagascar ahora cubren todo el horizonte 2027–2032 (XGBoost + extrapolación estadística).',
    searchPlaceholder: 'Filtrar país, continente o distrito...',
    allOption: 'Todas las zonas',
    mapTypes: { terrain: 'Relieve', roadmap: 'Mapa', hybrid: 'Satélite' },
    recenter: 'Centrar vista',
    legendTitle: 'Leyenda de Riesgos',
    legendShow: 'Mostrar',
    legendHide: 'Ocultar',
    legendRadiusNote: 'Fronteras GeoJSON + círculos proporcionales',
    tiers: {
      critical: 'Crítico (80–100)',
      high: 'Alto (60–79)',
      moderate: 'Moderado (35–59)',
      low: 'Bajo (0–34)',
    },
    unitsActive: 'nodos activos',
    topExposureTitle: 'Mayor Exposición',
    selectedTitle: 'Perfil de Riesgo Seleccionado',
    gdpOrYieldLabel: 'Impacto Proyectado',
    droughtLabel: 'Sequía',
    floodLabel: 'Crecidas / Ciclones',
    heatLabel: 'Estrés Térmico',
    displacementLabel: 'Desplazamiento',
    fetchWeatherBtn: 'Clima y Alertas en Tiempo Real',
    fetchingWeather: 'Consultando Weather API...',
    weatherTitle: 'Condiciones Meteorológicas Actuales',
    weatherAlertsTitle: 'Alertas Meteorológicas Oficiales',
    noAlerts: 'No hay alertas meteorológicas oficiales activas en estas coordenadas.',
    sourceLabel: 'Fuente',
    fallbackBannerTitle: 'Clave de mosaicos Google Maps no habilitada en navegador',
    fallbackBannerBody:
      'Los polígonos GeoJSON y las capas 2027–2032 permanecen interactivos en el mapa coroplético inferior; las consultas climáticas pasan por el proxy del servidor.',
    fallbackCanvasBadge: 'Coropleta GeoJSON · Observatorio',
    mlPredictBtn: 'Ejecutar Predicción ML en Servidor (2027–2032)',
    mlPredicting: 'Calculando XGBoost-LSTM...',
  },
  ar: {
    eyebrow: 'القسم 05B · الخرائط الجيومكانية متعددة المقاييس',
    title: 'خريطة المخاطر المناخية: 195 دولة، القارات، أفريقيا، مدغشقر والمحيط الهندي',
    lead: 'تصوير جغرافي بطبقات متعددة (شدة الجفاف، الفيضانات والأعاصير، الإجهاد الحراري والنزوح المناخي) لـ 195 دولة بالأمم المتحدة و6 قارات و42 مقاطعة في مدغشقر (2027–2032).',
    scopeLabel: 'النطاق الجغرافي',
    scopes: {
      world: 'العالم (195 دولة)',
      continents: 'القارات (6)',
      africa: 'أفريقيا (54)',
      madagascar: 'مدغشقر (42)',
      'indian-ocean': 'المحيط الهندي (COI)',
    },
    layerLabel: 'طبقة الخطر',
    layers: {
      composite: 'الخطر المركب',
      drought: 'شدة الجفاف',
      flood: 'الفيضانات والأعاصير',
      heat: 'الإجهاد الحراري / ONI',
      displacement: 'النزوح المناخي',
    },
    yearLabel: 'الأفق الزمني',
    madagascarYearNote: 'تغطي طبقة مقاطعات مدغشقر الآن كامل الفترة 2027–2032.',
    searchPlaceholder: 'تصفية دولة أو قارة أو مقاطعة...',
    allOption: 'جميع النقاط',
    mapTypes: { terrain: 'تضاريس', roadmap: 'خريطة', hybrid: 'أقمار صناعية' },
    recenter: 'إعادة ضبط العرض',
    legendTitle: 'مفتاح المخاطر',
    legendShow: 'إظهار',
    legendHide: 'إخفاء',
    legendRadiusNote: 'حدود GeoJSON + دوائر متناسبة مع الشدة',
    tiers: {
      critical: 'حرج (80–100)',
      high: 'مرتفع (60–79)',
      moderate: 'متوسط (35–59)',
      low: 'منخفض (0–34)',
    },
    unitsActive: 'نقطة نشطة',
    topExposureTitle: 'الأكثر تعرضاً للمخاطر',
    selectedTitle: 'ملف المخاطر للموقع المحدد',
    gdpOrYieldLabel: 'الأثر المتوقع',
    droughtLabel: 'الجفاف',
    floodLabel: 'الفيضانات / الأعاصير',
    heatLabel: 'الإجهاد الحراري',
    displacementLabel: 'النزوح',
    fetchWeatherBtn: 'جلب الطقس والتنبيهات المباشرة',
    fetchingWeather: 'جاري الاستعلام من Weather API...',
    weatherTitle: 'الأحوال الجوية الحالية',
    weatherAlertsTitle: 'التنبيهات الجوية الرسمية',
    noAlerts: 'لا توجد تنبيهات جوية رسمية نشطة في هذه الإحداثيات.',
    sourceLabel: 'المصدر',
    fallbackBannerTitle: 'مفتاح خرائط Google في المتصفح غير مفعل',
    fallbackBannerBody:
      'تظل حدود GeoJSON وطبقات 2027–2032 تفاعلية بالكامل على الخريطة أدناه؛ وتعمل طلبات الطقس المباشرة عبر وكيل الخادم الآمن.',
    fallbackCanvasBadge: 'خريطة GeoJSON · المرصد',
    mlPredictBtn: 'تشغيل التنبؤ الإحصائي بالخادم (2027–2032)',
    mlPredicting: 'جاري حساب XGBoost-LSTM...',
  },
  zh: {
    eyebrow: '第 05B 节 · 多尺度地理空间风险地图',
    title: '气候风险地图：195个国家、各大洲、非洲、马达加斯加与印度洋',
    lead: '针对联合国195个国家、6大洲、非洲、马达加斯加42个区（2027–2032）及印度洋流域的干旱强度、洪水气旋、热应激与气候迁移多图层空间可视化。',
    scopeLabel: '地理视角',
    scopes: {
      world: '全球 (195 联合国)',
      continents: '各大洲 (6)',
      africa: '非洲 (54)',
      madagascar: '马达加斯加 (42)',
      'indian-ocean': '印度洋 (COI)',
    },
    layerLabel: '风险图层',
    layers: {
      composite: '综合风险',
      drought: '干旱强度',
      flood: '洪水与气旋',
      heat: '热应激 / ONI',
      displacement: '气候迁移',
    },
    yearLabel: '预测年份',
    madagascarYearNote: '马达加斯加县区图层现已完整支持 2027–2032 年（XGBoost + 多期统计外推）。',
    searchPlaceholder: '搜索国家、大洲或县区...',
    allOption: '所有节点',
    mapTypes: { terrain: '地形', roadmap: '地图', hybrid: '卫星' },
    recenter: '重置视图',
    legendTitle: '风险图例',
    legendShow: '显示',
    legendHide: '隐藏',
    legendRadiusNote: 'GeoJSON 国界边界 + 风险比例圆圈',
    tiers: {
      critical: '极高风险 (80–100)',
      high: '高风险 (60–79)',
      moderate: '中等风险 (35–59)',
      low: '低风险 (0–34)',
    },
    unitsActive: '活跃节点',
    topExposureTitle: '最高风险暴露排名',
    selectedTitle: '所选位置风险档案',
    gdpOrYieldLabel: '预计影响',
    droughtLabel: '干旱',
    floodLabel: '洪水 / 气旋',
    heatLabel: '热应激',
    displacementLabel: '人口迁移',
    fetchWeatherBtn: '获取实时天气与警报',
    fetchingWeather: '正在查询 Weather API...',
    weatherTitle: '当前气象实况',
    weatherAlertsTitle: '官方公共气象预警',
    noAlerts: '该坐标暂无活跃的官方气象预警。',
    sourceLabel: '来源',
    fallbackBannerTitle: '浏览器端 Google Maps 瓦片密钥未启用',
    fallbackBannerBody:
      '下方 GeoJSON 分级统计地图与 2027–2032 数据图层保持完整交互；实时天气查询通过服务端安全代理执行。',
    fallbackCanvasBadge: 'GeoJSON 分级地图 · 观测站',
    mlPredictBtn: '运行服务端机器学习预测 (2027–2032)',
    mlPredicting: '正在计算 XGBoost-LSTM...',
  },
  pt: {
    eyebrow: 'Seção 05B · Cartografia Geoespacial Multiescala',
    title: 'Mapa de Riscos Climáticos: 195 Países, Continentes, África, Madagáscar e Oceano Índico',
    lead: 'Visualização coroplética e multicamadas (seca, cheias & ciclones, estresse térmico e deslocamentos) para os 195 Estados da ONU, 6 continentes, África, 42 distritos de Madagáscar (2027–2032) e bacia COI.',
    scopeLabel: 'Escala geográfica',
    scopes: {
      world: 'Mundo (195 ONU)',
      continents: 'Continentes (6)',
      africa: 'África (54)',
      madagascar: 'Madagáscar (42)',
      'indian-ocean': 'Oceano Índico (COI)',
    },
    layerLabel: 'Camada de risco',
    layers: {
      composite: 'Risco Composto',
      drought: 'Severidade da Seca',
      flood: 'Cheias & Ciclones',
      heat: 'Estresse Térmico / ONI',
      displacement: 'Deslocamento',
    },
    yearLabel: 'Horizonte',
    madagascarYearNote: 'Os 42 distritos de Madagáscar cobrem agora o horizonte completo 2027–2032.',
    searchPlaceholder: 'Filtrar país, continente ou distrito...',
    allOption: 'Todos os nós',
    mapTypes: { terrain: 'Relevo', roadmap: 'Mapa', hybrid: 'Satélite' },
    recenter: 'Recentrar',
    legendTitle: 'Legenda de Riscos',
    legendShow: 'Mostrar',
    legendHide: 'Ocultar',
    legendRadiusNote: 'Fronteiras GeoJSON + círculos proporcionais',
    tiers: {
      critical: 'Crítico (80–100)',
      high: 'Elevado (60–79)',
      moderate: 'Moderado (35–59)',
      low: 'Baixo (0–34)',
    },
    unitsActive: 'nós ativos',
    topExposureTitle: 'Maior Exposição',
    selectedTitle: 'Perfil de Risco Selecionado',
    gdpOrYieldLabel: 'Impacto Projetado',
    droughtLabel: 'Seca',
    floodLabel: 'Cheias / Ciclones',
    heatLabel: 'Estresse Térmico',
    displacementLabel: 'Deslocamento',
    fetchWeatherBtn: 'Clima e Alertas em Tempo Real',
    fetchingWeather: 'Consultando Weather API...',
    weatherTitle: 'Condições Meteorológicas Atuais',
    weatherAlertsTitle: 'Alertas Meteorológicos Oficiais',
    noAlerts: 'Nenhum alerta meteorológico oficial ativo nestas coordenadas.',
    sourceLabel: 'Fonte',
    fallbackBannerTitle: 'Chave cliente Google Maps não ativada no navegador',
    fallbackBannerBody:
      'As fronteiras GeoJSON e as camadas 2027–2032 permanecem interativas no mapa coroplético abaixo; as consultas meteorológicas passam pelo proxy do servidor.',
    fallbackCanvasBadge: 'Coroplético GeoJSON · Observatório',
    mlPredictBtn: 'Executar Previsão ML no Servidor (2027–2032)',
    mlPredicting: 'Calculando XGBoost-LSTM...',
  },
  hi: {
    eyebrow: 'अनुभाग 05B · बहु-स्तरीय भू-स्थानिक जोखिम मानचित्र',
    title: 'जलवायु जोखिम मानचित्र: 195 देश, महाद्वीप, अफ्रीका, मेडागास्कर और हिंद महासागर',
    lead: '195 संयुक्त राष्ट्र देशों, 6 महाद्वीपों, अफ्रीका, मेडागास्कर के 42 जिलों (2027–2032) और हिंद महासागर बेसिन के सूखा, बाढ़/चक्रवात, ताप तनाव व विस्थापन का कोरोप्लेथ भू-स्थानिक विश्लेषण।',
    scopeLabel: 'भौगोलिक दृश्य',
    scopes: {
      world: 'विश्व (195 UN)',
      continents: 'महाद्वीप (6)',
      africa: 'अफ्रीका (54)',
      madagascar: 'मेडागास्कर (42)',
      'indian-ocean': 'हिंद महासागर (COI)',
    },
    layerLabel: 'जोखिम परत',
    layers: {
      composite: 'समग्र जोखिम',
      drought: 'सूखा तीव्रता',
      flood: 'बाढ़ एवं चक्रवात',
      heat: 'तापीय तनाव / ONI',
      displacement: 'जलवायु विस्थापन',
    },
    yearLabel: 'क्षितिज वर्ष',
    madagascarYearNote: 'मेडागास्कर जिला परत अब 2027–2032 के सभी वर्षों को कवर करती है।',
    searchPlaceholder: 'देश, महाद्वीप या जिला खोजें...',
    allOption: 'सभी बिंदु',
    mapTypes: { terrain: 'भू-भाग', roadmap: 'मानचित्र', hybrid: 'सैटेलाइट' },
    recenter: 'रीसेट करें',
    legendTitle: 'जोखिम संकेतिका',
    legendShow: 'दिखाएँ',
    legendHide: 'छिपाएँ',
    legendRadiusNote: 'GeoJSON सीमाएँ + आनुपातिक वृत्त आकार',
    tiers: {
      critical: 'गंभीर (80–100)',
      high: 'उच्च (60–79)',
      moderate: 'मध्यम (35–59)',
      low: 'निम्न (0–34)',
    },
    unitsActive: 'सक्रिय बिंदु',
    topExposureTitle: 'सर्वाधिक जोखिम वाले क्षेत्र',
    selectedTitle: 'चयनित स्थान का जोखिम विवरण',
    gdpOrYieldLabel: 'अनुमानित प्रभाव',
    droughtLabel: 'सूखा',
    floodLabel: 'बाढ़ / चक्रवात',
    heatLabel: 'तापीय तनाव',
    displacementLabel: 'विस्थापन',
    fetchWeatherBtn: 'लाइव मौसम और अलर्ट प्राप्त करें',
    fetchingWeather: 'Weather API पूछताछ...',
    weatherTitle: 'वर्तमान मौसम स्थिति',
    weatherAlertsTitle: 'आधिकारिक मौसम चेतावनियाँ',
    noAlerts: 'इन निर्देशांकों पर कोई सक्रिय आधिकारिक मौसम चेतावनी नहीं है।',
    sourceLabel: 'स्रोत',
    fallbackBannerTitle: 'ब्राउज़र Google Maps टाइल कुंजी सक्रिय नहीं है',
    fallbackBannerBody:
      'नीचे दिए गए कोरोप्लेथ मानचित्र पर GeoJSON देश सीमाएँ और 2027–2032 परतें पूरी तरह सक्रिय हैं; लाइव मौसम अनुरोध सर्वर प्रॉक्सी से चलते हैं।',
    fallbackCanvasBadge: 'GeoJSON कोरोप्लेथ · वेधशाला',
    mlPredictBtn: 'सर्वर ML पूर्वानुमान चलाएँ (2027–2032)',
    mlPredicting: 'XGBoost-LSTM गणना जारी...',
  },
  ru: {
    eyebrow: 'Раздел 05B · Многоуровневая геопространственная карта рисков',
    title: 'Карта климатических рисков: 195 стран, континенты, Африка, Мадагаскар и Индийский океан',
    lead: 'Хороплетная и многослойная визуализация (засуха, наводнения и циклоны, тепловой стресс и миграция) по 195 государствам ООН, 6 континентам, Африке, 42 районам Мадагаскара (2027–2032) и Индийскому океану.',
    scopeLabel: 'Географический охват',
    scopes: {
      world: 'Мир (195 ООН)',
      continents: 'Континенты (6)',
      africa: 'Африка (54)',
      madagascar: 'Мадагаскар (42)',
      'indian-ocean': 'Индийский океан (COI)',
    },
    layerLabel: 'Слой риска',
    layers: {
      composite: 'Совокупный риск',
      drought: 'Интенсивность засухи',
      flood: 'Наводнения и циклоны',
      heat: 'Тепловой стресс / ONI',
      displacement: 'Климатическая миграция',
    },
    yearLabel: 'Горизонт',
    madagascarYearNote: 'Районный слой Мадагаскара теперь охватывает весь период 2027–2032.',
    searchPlaceholder: 'Фильтр страны, континента или района...',
    allOption: 'Все узлы',
    mapTypes: { terrain: 'Рельеф', roadmap: 'Схема', hybrid: 'Спутник' },
    recenter: 'Сбросить вид',
    legendTitle: 'Легенда рисков',
    legendShow: 'Показать',
    legendHide: 'Скрыть',
    legendRadiusNote: 'Границы GeoJSON + пропорциональные круги',
    tiers: {
      critical: 'Критический (80–100)',
      high: 'Высокий (60–79)',
      moderate: 'Умеренный (35–59)',
      low: 'Низкий (0–34)',
    },
    unitsActive: 'активных узлов',
    topExposureTitle: 'Наиболее уязвимые зоны',
    selectedTitle: 'Профиль риска выбранной точки',
    gdpOrYieldLabel: 'Прогнозируемый эффект',
    droughtLabel: 'Засуха',
    floodLabel: 'Наводнения / Циклоны',
    heatLabel: 'Тепловой стресс',
    displacementLabel: 'Миграция',
    fetchWeatherBtn: 'Текущая погода и оповещения',
    fetchingWeather: 'Запрос Weather API...',
    weatherTitle: 'Текущие метеоусловия',
    weatherAlertsTitle: 'Официальные метеопредупреждения',
    noAlerts: 'По этим координатам активных официальных оповещений не зафиксировано.',
    sourceLabel: 'Источник',
    fallbackBannerTitle: 'Клиентский ключ тайлов Google Maps не активирован',
    fallbackBannerBody:
      'Границы стран GeoJSON и слои 2027–2032 полностью интерактивны на карте ниже; метеозапросы выполняются через защищённый серверный прокси.',
    fallbackCanvasBadge: 'Хороплета GeoJSON · Обсерватория',
    mlPredictBtn: 'Запустить ML-прогноз сервера (2027–2032)',
    mlPredicting: 'Расчёт XGBoost-LSTM...',
  },
};

function getLocalizedCopy(lang: WorldLanguageCode): CopyBundle {
  return COPY_BY_LANG[lang] ?? COPY_BY_LANG.fr;
}

function geoRingsToSvgPath(
  rings: number[][][],
  project: (lat: number, lng: number) => { x: number; y: number },
): string {
  const parts: string[] = [];
  for (const ring of rings) {
    if (!ring || ring.length < 3) continue;
    let prevLng: number | null = null;
    for (let i = 0; i < ring.length; i++) {
      const [lng, lat] = ring[i];
      const { x, y } = project(lat, lng);
      const jump = prevLng !== null && Math.abs(lng - prevLng) > 150;
      if (i === 0 || jump) {
        parts.push(`M${x.toFixed(1)},${y.toFixed(1)}`);
      } else {
        parts.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
      }
      prevLng = lng;
    }
  }
  return parts.join(' ');
}

type MarkerElement = ReturnType<typeof useAdvancedMarkerRef>[1];

interface RiskPinMarkerProps {
  node: ClimateMapNode;
  score: number;
  style: RiskTierColor;
  isSelected: boolean;
  isHovered: boolean;
  baseZIndex: number;
  onHoverChange: (id: string | null) => void;
  onMarkerClick: (id: string, marker: MarkerElement) => void;
  onActiveAnchorReady: (marker: MarkerElement) => void;
}

function RiskPinMarker({
  node,
  score,
  style,
  isSelected,
  isHovered,
  baseZIndex,
  onHoverChange,
  onMarkerClick,
  onActiveAnchorReady,
}: RiskPinMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    if (isSelected && marker) {
      onActiveAnchorReady(marker);
    }
  }, [isSelected, marker, onActiveAnchorReady]);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: node.lat, lng: node.lng }}
      zIndex={isSelected ? 1200 : isHovered ? 1100 : baseZIndex}
      title={`${node.title} — ${score}/100 (${node.metricBadge})`}
      onClick={() => onMarkerClick(node.id, marker)}
      onMouseEnter={() => onHoverChange(node.id)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <Pin
        background={style.fill}
        borderColor={isSelected ? '#18181B' : style.stroke}
        glyphColor="#FFFFFF"
        scale={isSelected ? 1.25 : isHovered ? 1.1 : 0.78}
      />
    </AdvancedMarker>
  );
}

interface MapCircleHandle {
  setMap: (map: unknown | null) => void;
  addListener: (eventName: string, handler: () => void) => void;
}

function CircleOverlayController({
  nodes,
  layer,
  viewport,
  selectedId,
  onSelect,
}: {
  nodes: ClimateMapNode[];
  layer: RiskLayerType;
  viewport: MapViewportScope;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');

  useEffect(() => {
    if (!map || !mapsLib?.Circle) return;
    const cfg = VIEWPORT_CONFIGS[viewport];
    const circles: MapCircleHandle[] = [];
    const CircleCtor = mapsLib.Circle as unknown as new (opts: Record<string, unknown>) => MapCircleHandle;

    for (const node of nodes) {
      const score = getLayerScore(node, layer);
      const color = getScoreStyle(score);
      const isSelected = node.id === selectedId;
      const ratio = Math.max(0.12, Math.min(1, score / 100));
      const radius =
        cfg.circleMinRadiusM + ratio * (cfg.circleMaxRadiusM - cfg.circleMinRadiusM);

      const circle = new CircleCtor({
        map,
        center: { lat: node.lat, lng: node.lng },
        radius,
        fillColor: color.fill,
        fillOpacity: isSelected ? 0.34 : 0.18,
        strokeColor: isSelected ? '#18181B' : color.stroke,
        strokeOpacity: isSelected ? 0.9 : 0.45,
        strokeWeight: isSelected ? 2 : 1,
        clickable: true,
        zIndex: isSelected ? 90 : Math.round(score),
      });

      circle.addListener('click', () => {
        onSelect(node.id);
      });

      circles.push(circle);
    }

    return () => {
      for (const c of circles) {
        c.setMap(null);
      }
    };
  }, [map, mapsLib, nodes, layer, viewport, selectedId, onSelect]);

  return null;
}

function GeoJsonChoroplethController({
  geoJson,
  scoreByIso2,
  selectedId,
  onSelect,
}: {
  geoJson: GeoJsonCollection | null;
  scoreByIso2: globalThis.Map<string, number>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !geoJson) return;
    type MapDataFeature = { getProperty: (name: string) => unknown };
    map.data.forEach((f: MapDataFeature) => map.data.remove(f));
    map.data.addGeoJson(geoJson as unknown as object);

    const listener = map.data.addListener('click', (event: { feature?: { getProperty?: (name: string) => unknown } }) => {
      const iso = String(event.feature?.getProperty?.('iso2') ?? '');
      if (iso && scoreByIso2.has(iso)) {
        onSelect(iso);
      }
    });

    return () => {
      listener.remove();
      map.data.forEach((f: MapDataFeature) => map.data.remove(f));
    };
  }, [map, geoJson, scoreByIso2, onSelect]);

  useEffect(() => {
    if (!map) return;
    type MapDataFeature = { getProperty: (name: string) => unknown };
    map.data.setStyle((feature: MapDataFeature) => {
      const iso = String(feature.getProperty('iso2') ?? '');
      const score = scoreByIso2.get(iso);
      if (score === undefined) {
        return {
          fillColor: '#94A3B8',
          fillOpacity: 0.08,
          strokeColor: '#64748B',
          strokeWeight: 0.6,
        };
      }
      const st = getScoreStyle(score);
      const isSel = iso === selectedId;
      return {
        fillColor: st.fill,
        fillOpacity: isSel ? 0.42 : 0.22,
        strokeColor: isSel ? '#18181B' : st.stroke,
        strokeWeight: isSel ? 1.8 : 0.7,
      };
    });
  }, [map, scoreByIso2, selectedId]);

  return null;
}

function ViewportCameraController({
  viewport,
  resetNonce,
  selectedNode,
  panNonce,
}: {
  viewport: MapViewportScope;
  resetNonce: number;
  selectedNode: ClimateMapNode | undefined;
  panNonce: number;
}) {
  const map = useMap();
  const prevViewportRef = useRef<MapViewportScope>(viewport);

  useEffect(() => {
    if (!map) return;
    if (prevViewportRef.current !== viewport || resetNonce > 0) {
      prevViewportRef.current = viewport;
      const cfg = VIEWPORT_CONFIGS[viewport];
      map.panTo(cfg.center);
      map.setZoom(cfg.zoom);
    }
  }, [map, viewport, resetNonce]);

  useEffect(() => {
    if (!map || !selectedNode || panNonce === 0) return;
    map.panTo({ lat: selectedNode.lat, lng: selectedNode.lng });
  }, [map, selectedNode, panNonce]);

  return null;
}

function LegendOverlayCard({
  copy,
  layer,
  nodeCount,
  displayYear,
  collapsed,
  onToggle,
}: {
  copy: CopyBundle;
  layer: RiskLayerType;
  nodeCount: number;
  displayYear: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="absolute bottom-3 left-3 z-10 w-[235px] max-w-[calc(100%-1.5rem)] rounded-md border border-zinc-200 bg-white/95 p-3 shadow-md backdrop-blur-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">
            {copy.legendTitle}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <span>{collapsed ? copy.legendShow : copy.legendHide}</span>
          {collapsed ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2.5 space-y-2 border-t border-zinc-100 pt-2 text-[11px]">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="font-semibold text-[#1E3A8A]">{copy.layers[layer]}</span>
            <span className="font-mono font-semibold tabular-nums text-zinc-800">{displayYear}</span>
          </div>

          <ul className="space-y-1">
            {[
              { color: '#BE123C', label: copy.tiers.critical },
              { color: '#D97706', label: copy.tiers.high },
              { color: '#0284C7', label: copy.tiers.moderate },
              { color: '#059669', label: copy.tiers.low },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-zinc-700">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-xs border border-black/15"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-zinc-100 pt-1.5 text-[10px] text-zinc-500">
            <p>{copy.legendRadiusNote}</p>
            <p className="mt-0.5 font-mono tabular-nums text-zinc-700">
              {nodeCount} {copy.unitsActive}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectionFallbackCanvas({
  nodes,
  geoJson,
  scoreByIso2,
  viewport,
  layer,
  selectedId,
  displayYear,
  copy,
  legendCollapsed,
  onToggleLegend,
  onSelectNode,
}: {
  nodes: ClimateMapNode[];
  geoJson: GeoJsonCollection | null;
  scoreByIso2: globalThis.Map<string, number>;
  viewport: MapViewportScope;
  layer: RiskLayerType;
  selectedId: string;
  displayYear: number;
  copy: CopyBundle;
  legendCollapsed: boolean;
  onToggleLegend: () => void;
  onSelectNode: (id: string) => void;
}) {
  const cfg = VIEWPORT_CONFIGS[viewport];
  const width = 920;
  const height = 520;
  const { minLat, maxLat, minLng, maxLng } = cfg.bounds;

  const project = useCallback(
    (lat: number, lng: number) => {
      const x = ((lng - minLng) / Math.max(1, maxLng - minLng)) * width;
      const y = ((maxLat - lat) / Math.max(1, maxLat - minLat)) * height;
      return { x, y };
    },
    [minLat, maxLat, minLng, maxLng],
  );

  const choroplethPaths = useMemo(() => {
    if (!geoJson?.features) return [];
    const out: Array<{
      key: string;
      iso2: string;
      d: string;
      fill: string;
      fillOpacity: number;
      stroke: string;
      strokeWidth: number;
      clickable: boolean;
    }> = [];

    geoJson.features.forEach((feat, idx) => {
      const geom = feat.geometry;
      if (!geom) return;
      const iso2 = String(feat.properties?.iso2 ?? '');
      let d = '';
      if (geom.type === 'Polygon') {
        d = geoRingsToSvgPath(geom.coordinates as number[][][], project);
      } else if (geom.type === 'MultiPolygon') {
        d = (geom.coordinates as number[][][][])
          .map((poly) => geoRingsToSvgPath(poly, project))
          .join(' ');
      }
      if (!d) return;

      const score = scoreByIso2.get(iso2);
      const isSelected = iso2 === selectedId;
      if (score !== undefined) {
        const st = getScoreStyle(score);
        out.push({
          key: `${iso2}-${idx}`,
          iso2,
          d,
          fill: st.fill,
          fillOpacity: isSelected ? 0.5 : 0.25,
          stroke: isSelected ? '#18181B' : st.stroke,
          strokeWidth: isSelected ? 1.5 : 0.65,
          clickable: true,
        });
      } else {
        out.push({
          key: `land-${iso2 || idx}-${idx}`,
          iso2,
          d,
          fill: '#CBD5E1',
          fillOpacity: 0.35,
          stroke: '#94A3B8',
          strokeWidth: 0.45,
          clickable: false,
        });
      }
    });
    return out;
  }, [geoJson, project, scoreByIso2, selectedId]);

  const latGridLines = useMemo(() => {
    const step = viewport === 'madagascar' ? 3 : viewport === 'indian-ocean' ? 5 : 30;
    const lines: number[] = [];
    for (let la = Math.ceil(minLat / step) * step; la <= maxLat; la += step) {
      lines.push(la);
    }
    return lines;
  }, [minLat, maxLat, viewport]);

  const lngGridLines = useMemo(() => {
    const step = viewport === 'madagascar' ? 3 : viewport === 'indian-ocean' ? 5 : 45;
    const lines: number[] = [];
    for (let ln = Math.ceil(minLng / step) * step; ln <= maxLng; ln += step) {
      lines.push(ln);
    }
    return lines;
  }, [minLng, maxLng, viewport]);

  return (
    <div
      className="relative h-[520px] w-full overflow-hidden rounded-md border border-zinc-200 bg-[#EAF0F6]"
    >
      <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded border border-zinc-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-xs">
        <Globe className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
        <span>{copy.fallbackCanvasBadge}</span>
      </div>

      <svg
        data-export-map="true"
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full select-none"
        role="img"
        aria-label={copy.title}
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#F5F8FC" />
            <stop offset="100%" stopColor="#DDE7F1" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height} fill="url(#oceanGlow)" />

        {/* Graticule lines */}
        {latGridLines.map((la) => {
          const { y } = project(la, minLng);
          return (
            <g key={`lat-${la}`}>
              <line
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke={la === 0 ? '#94A3B8' : '#CBD5E1'}
                strokeDasharray={la === 0 ? undefined : '4 4'}
                strokeWidth={la === 0 ? 1.1 : 0.7}
              />
              <text x={8} y={y - 4} fontSize={10} fill="#64748B" fontFamily="monospace">
                {la}°
              </text>
            </g>
          );
        })}

        {lngGridLines.map((ln) => {
          const { x } = project(maxLat, ln);
          return (
            <g key={`lng-${ln}`}>
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
                strokeWidth={0.7}
              />
              <text x={x + 4} y={14} fontSize={10} fill="#64748B" fontFamily="monospace">
                {ln}°
              </text>
            </g>
          );
        })}

        {/* GeoJSON Country Choropleth Polygons */}
        <g aria-label="GeoJSON Country Borders">
          {choroplethPaths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill={p.fill}
              fillOpacity={p.fillOpacity}
              stroke={p.stroke}
              strokeWidth={p.strokeWidth}
              className={p.clickable ? 'cursor-pointer transition-opacity hover:opacity-80' : undefined}
              onClick={() => {
                if (p.clickable && p.iso2) onSelectNode(p.iso2);
              }}
            />
          ))}
        </g>

        {/* Risk circles & clickable pins */}
        {nodes.map((node) => {
          const { x, y } = project(node.lat, node.lng);
          if (x < -30 || x > width + 30 || y < -30 || y > height + 30) return null;
          const score = getLayerScore(node, layer);
          const color = getScoreStyle(score);
          const isSelected = node.id === selectedId;
          const baseRadius =
            viewport === 'continents'
              ? 22 + (score / 100) * 32
              : viewport === 'indian-ocean'
                ? 18 + (score / 100) * 26
                : viewport === 'madagascar'
                  ? 10 + (score / 100) * 18
                  : viewport === 'africa'
                    ? 10 + (score / 100) * 18
                    : 5 + (score / 100) * 14;

          return (
            <g
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r={baseRadius}
                fill={color.fill}
                fillOpacity={isSelected ? 0.34 : 0.18}
                stroke={isSelected ? '#18181B' : color.stroke}
                strokeWidth={isSelected ? 2 : 0.9}
              />
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 6 : viewport === 'world' ? 3.5 : 4.5}
                fill={color.fill}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 2 : 1.2}
              />
              {(isSelected || viewport === 'continents' || viewport === 'indian-ocean') && (
                <text
                  x={x + 8}
                  y={y + 4}
                  fontSize={isSelected ? 11.5 : 10}
                  fontWeight={isSelected ? 700 : 600}
                  fill="#0F172A"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  paintOrder="stroke"
                >
                  {node.title.split('—')[0].trim()} ({score})
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <LegendOverlayCard
        copy={copy}
        layer={layer}
        nodeCount={nodes.length}
        displayYear={displayYear}
        collapsed={legendCollapsed}
        onToggle={onToggleLegend}
      />
    </div>
  );
}

function LiveGoogleMapCanvas({
  nodes,
  geoJson,
  scoreByIso2,
  viewport,
  layer,
  selectedNode,
  displayYear,
  copy,
  legendCollapsed,
  onToggleLegend,
  onSelectNode,
  onFallbackSwitch,
  weatherData,
  weatherLoading,
  onFetchWeather,
}: {
  nodes: ClimateMapNode[];
  geoJson: GeoJsonCollection | null;
  scoreByIso2: globalThis.Map<string, number>;
  viewport: MapViewportScope;
  layer: RiskLayerType;
  selectedNode: ClimateMapNode | undefined;
  displayYear: number;
  copy: CopyBundle;
  legendCollapsed: boolean;
  onToggleLegend: () => void;
  onSelectNode: (id: string) => void;
  onFallbackSwitch: () => void;
  weatherData: WeatherPointResponse | null;
  weatherLoading: boolean;
  onFetchWeather: (node: ClimateMapNode) => void;
}) {
  const loadingStatus = useApiLoadingStatus();
  const [mapTypeId, setMapTypeId] = useState<'terrain' | 'roadmap' | 'hybrid'>('terrain');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeAnchor, setActiveAnchor] = useState<MarkerElement>(null);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [resetNonce, setResetNonce] = useState<number>(0);
  const [panNonce, setPanNonce] = useState<number>(0);

  const sortedNodes = useMemo(
    () => [...nodes].sort((a, b) => b.lat - a.lat),
    [nodes],
  );

  const handleMarkerClick = useCallback(
    (id: string, marker: MarkerElement) => {
      onSelectNode(id);
      if (marker) {
        setActiveAnchor(marker);
        setInfoOpen(true);
      }
    },
    [onSelectNode],
  );

  const handleCircleSelect = useCallback(
    (id: string) => {
      onSelectNode(id);
      setPanNonce((n) => n + 1);
      setInfoOpen(true);
    },
    [onSelectNode],
  );

  if (loadingStatus === APILoadingStatus.AUTH_FAILURE || loadingStatus === APILoadingStatus.FAILED) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-950">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">{copy.fallbackBannerTitle}</p>
            <p className="mt-0.5 text-amber-900">{copy.fallbackBannerBody}</p>
          </div>
        </div>
        <ProjectionFallbackCanvas
          nodes={nodes}
          geoJson={geoJson}
          scoreByIso2={scoreByIso2}
          viewport={viewport}
          layer={layer}
          selectedId={selectedNode?.id ?? ''}
          displayYear={displayYear}
          copy={copy}
          legendCollapsed={legendCollapsed}
          onToggleLegend={onToggleLegend}
          onSelectNode={(id) => {
            onSelectNode(id);
            onFallbackSwitch();
          }}
        />
      </div>
    );
  }

  const camCfg = VIEWPORT_CONFIGS[viewport];
  const selectedScore = selectedNode ? getLayerScore(selectedNode, layer) : 0;
  const selectedStyle = getScoreStyle(selectedScore);

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-md border border-zinc-200 bg-[#EEF2F6]">
      {/* Top-Left Map Style & Reset Controls */}
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
        <div className="inline-flex rounded border border-zinc-200 bg-white/95 p-0.5 shadow-xs backdrop-blur-xs">
          {(
            [
              { id: 'terrain', label: copy.mapTypes.terrain },
              { id: 'roadmap', label: copy.mapTypes.roadmap },
              { id: 'hybrid', label: copy.mapTypes.hybrid },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setMapTypeId(mode.id)}
              className={`rounded px-2 py-1 text-[11px] font-semibold transition-colors ${
                mapTypeId === mode.id
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setResetNonce((n) => n + 1)}
          className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          <span>{copy.recenter}</span>
        </button>
      </div>

      {/* Required attribution ID + mapId="DEMO_MAP_ID" for AdvancedMarker */}
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={camCfg.center}
        defaultZoom={camCfg.zoom}
        mapTypeId={mapTypeId}
        gestureHandling="cooperative"
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={true}
        zoomControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <ViewportCameraController
          viewport={viewport}
          resetNonce={resetNonce}
          selectedNode={selectedNode}
          panNonce={panNonce}
        />

        <GeoJsonChoroplethController
          geoJson={geoJson}
          scoreByIso2={scoreByIso2}
          selectedId={selectedNode?.id ?? ''}
          onSelect={handleCircleSelect}
        />

        <CircleOverlayController
          nodes={nodes}
          layer={layer}
          viewport={viewport}
          selectedId={selectedNode?.id ?? ''}
          onSelect={handleCircleSelect}
        />

        {sortedNodes.map((node, idx) => {
          const score = getLayerScore(node, layer);
          const style = getScoreStyle(score);
          return (
            <RiskPinMarker
              key={node.id}
              node={node}
              score={score}
              style={style}
              isSelected={node.id === selectedNode?.id}
              isHovered={node.id === hoveredId}
              baseZIndex={idx + 1}
              onHoverChange={setHoveredId}
              onMarkerClick={handleMarkerClick}
              onActiveAnchorReady={setActiveAnchor}
            />
          );
        })}

        {infoOpen && activeAnchor && selectedNode && (
          <InfoWindow
            anchor={activeAnchor}
            maxWidth={290}
            pixelOffset={[0, -4]}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="space-y-2 p-0.5 font-sans text-zinc-900">
              <div className="border-b border-zinc-200 pb-1.5">
                <p className="text-[11px] font-medium text-zinc-500">
                  {selectedNode.subtitle} · {displayYear}
                </p>
                <h4 className="font-serif text-sm font-semibold text-zinc-900">
                  {selectedNode.title}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <span className="block text-[10px] text-zinc-500">{copy.layers[layer]}</span>
                  <span
                    className="font-mono font-bold tabular-nums"
                    style={{ color: selectedStyle.fill }}
                  >
                    {selectedScore} / 100
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500">{copy.gdpOrYieldLabel}</span>
                  <span className="font-mono font-semibold tabular-nums text-zinc-800">
                    {selectedNode.metricBadge}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500">{copy.droughtLabel}</span>
                  <span className="font-mono tabular-nums text-zinc-700">
                    {selectedNode.droughtScore}/100
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500">{copy.floodLabel}</span>
                  <span className="font-mono tabular-nums text-zinc-700">
                    {selectedNode.floodScore}/100
                  </span>
                </div>
              </div>

              <p className="text-[11px] leading-snug text-zinc-600">{selectedNode.hazardSummary}</p>

              <div className="border-t border-zinc-100 pt-1.5">
                <button
                  type="button"
                  disabled={weatherLoading}
                  onClick={() => onFetchWeather(selectedNode)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded bg-[#1E3A8A] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#172554] disabled:opacity-60"
                >
                  <Radio className="h-3 w-3" aria-hidden="true" />
                  <span>{weatherLoading ? copy.fetchingWeather : copy.fetchWeatherBtn}</span>
                </button>
                {weatherData?.available && weatherData.current && (
                  <p className="mt-1.5 font-mono text-[11px] text-zinc-700">
                    {weatherData.current.tempC !== null ? `${weatherData.current.tempC}°C · ` : ''}
                    {weatherData.current.conditionText ?? ''}
                    {weatherData.current.humidityPct !== null ? ` · RH ${weatherData.current.humidityPct}%` : ''}
                  </p>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <LegendOverlayCard
        copy={copy}
        layer={layer}
        nodeCount={nodes.length}
        displayYear={displayYear}
        collapsed={legendCollapsed}
        onToggle={onToggleLegend}
      />
    </div>
  );
}

export function ClimateRiskMap() {
  const { lang, worldLang, actions } = useLanguage();
  const { user, saveAnalysisSnapshot } = useAuth();
  const { syncState, hasLiveScrape, getZoneFactor } = useGlobalSync();
  const copy = useMemo(() => getLocalizedCopy(worldLang), [worldLang]);
  const isFr = lang === 'fr';
  const isSw = lang === 'sw';

  const [viewport, setViewport] = useState<MapViewportScope>('world');
  const [layer, setLayer] = useState<RiskLayerType>('composite');
  const [year, setYear] = useState<ForecastYear>(2027);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('MG');
  const [legendCollapsed, setLegendCollapsed] = useState(false);

  const [geoJsonData, setGeoJsonData] = useState<GeoJsonCollection | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherPointResponse | null>(null);
  const [weatherForId, setWeatherForId] = useState<string | null>(null);

  const [mlLoading, setMlLoading] = useState(false);
  const [mlResult, setMlResult] = useState<DistrictPredictionResult | null>(null);
  const [savingSnap, setSavingSnap] = useState(false);
  const [snapSavedMsg, setSnapSavedMsg] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/geo/world-110m.geojson')
      .then((r) => (r.ok ? r.json() : null))
      .then((json: GeoJsonCollection | null) => {
        if (active && json?.features) {
          setGeoJsonData(json);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const hasMapsKey = Boolean(apiKey && apiKey !== 'MY_GOOGLE_MAPS_API_KEY');

  const displayYear = year;

  // Build normalized geospatial risk nodes for active scope & horizon year
  const allScopeNodes = useMemo<ClimateMapNode[]>(() => {
    if (viewport === 'madagascar') {
      const madaScale: Record<ForecastYear, number> = {
        2027: 1.0,
        2028: 0.72,
        2029: 0.42,
        2030: 0.68,
        2031: 0.86,
        2032: 0.56,
      };
      const factor = madaScale[year] ?? 0.75;
      const isLaNina28 = year === 2028;

      const liveDroughtDelta = hasLiveScrape ? syncState.madagascarFactors.droughtDelta : 0;
      const liveFloodDelta = hasLiveScrape ? syncState.madagascarFactors.floodDelta : 0;
      const liveLossMult = hasLiveScrape ? syncState.madagascarFactors.overallLossFactor : 1;

      return DISTRICT_CHOROPLETH_DATA.map((d) => {
        const water = Number(((isLaNina28 ? d.water2028 : d.water2027 * factor) * liveLossMult).toFixed(1));
        const rice = Number(((isLaNina28 ? d.rice2028 : d.rice2027 * factor) * liveLossMult).toFixed(1));
        const maize = Number(((isLaNina28 ? d.maize2028 : d.maize2027 * factor) * liveLossMult).toFixed(1));
        const exp = Number(((isLaNina28 ? d.exportCrop2028 : d.exportCrop2027 * factor) * liveLossMult).toFixed(1));
        const droughtScore = Math.min(
          98,
          Math.max(12, Math.round((water < 0 ? 45 + Math.abs(water) * 0.95 : 22 + (d.riskTier === 'drought' ? 28 : 8)) * (isLaNina28 ? 0.68 : 1) + liveDroughtDelta)),
        );
        const floodScore = Math.min(
          98,
          Math.max(14, Math.round((water > 0 ? 40 + water * 1.45 : d.riskTier === 'flood' ? 68 : 26) + liveFloodDelta)),
        );
        const heatScore = Math.min(
          96,
          Math.max(25, Math.round((d.riskTier === 'drought' ? 76 : 62) * (0.72 + factor * 0.35))),
        );
        const displacementScore = Math.min(
          96,
          Math.max(20, Math.round((Math.abs(rice) + Math.abs(maize)) * 1.35 + (d.riskTier === 'drought' ? 16 : 8))),
        );
        const compositeScore = Math.round(
          droughtScore * 0.34 + floodScore * 0.24 + heatScore * 0.2 + displacementScore * 0.22,
        );
        const avgYield = Number(((rice + maize + exp) / 3).toFixed(1));
        return {
          id: d.district,
          title: d.district,
          subtitle: `${d.region} · ${d.profile}`,
          lat: d.lat,
          lng: d.lon,
          compositeScore,
          droughtScore,
          floodScore,
          heatScore,
          displacementScore,
          gdpOrYieldDelta: avgYield,
          metricBadge: `${avgYield >= 0 ? '+' : ''}${avgYield}% yield`,
          hazardSummary: d.ragNotes[0] ?? d.profile,
          extraMeta: `${isFr ? 'Bilan hydrique' : isSw ? 'Maji' : 'Water'} ${water >= 0 ? '+' : ''}${water}% · ${isFr ? 'Riz' : 'Rice'} ${rice >= 0 ? '+' : ''}${rice}%`,
        };
      });
    }

    if (viewport === 'continents') {
      const yearMult = year === 2027 ? 1.0 : year === 2028 ? 0.85 : year === 2029 ? 0.58 : year === 2031 ? 0.92 : 0.72;
      return CONTINENT_MAP_CENTERS.map((cont) => {
        if (cont.id === 'antarctica') {
          return {
            id: cont.id,
            title: isFr ? cont.nameFr : isSw ? cont.nameSw : cont.nameEn,
            subtitle: `14.0 M km² · Southern Ocean`,
            lat: cont.lat,
            lng: cont.lng,
            compositeScore: 34,
            droughtScore: 15,
            floodScore: 32,
            heatScore: Math.round(44 * yearMult + 12),
            displacementScore: 10,
            gdpOrYieldDelta: -0.2,
            metricBadge: `${cont.areaMKm2}M km²`,
            hazardSummary: isFr ? cont.summaryFr : cont.summaryEn,
            extraMeta: isFr ? 'Régulateur albédo / océan Austral' : 'Albedo & Southern Ocean sink',
          };
        }

        const memberCountries = DUPLICATED_195_COUNTRIES.filter((c) =>
          cont.unZones.includes(c.unZone),
        );
        const count = Math.max(1, memberCountries.length);
        const droughtScore = Math.round(
          memberCountries.reduce((s, c) => s + c.projections[year].droughtIdx, 0) / count,
        );
        const floodScore = Math.round(
          memberCountries.reduce((s, c) => s + c.projections[year].floodIdx, 0) / count,
        );
        const displacementScore = Math.round(
          memberCountries.reduce((s, c) => s + c.projections[year].displacementIdx, 0) / count,
        );
        const avgInfl =
          memberCountries.reduce((s, c) => s + c.projections[year].inflationAddPct, 0) / count;
        const heatScore = Math.min(96, Math.round(42 + avgInfl * 6.2 + droughtScore * 0.22));
        const totalLoss = memberCountries.reduce((s, c) => s + c.projections[year].lossBUsd, 0);
        const avgGdpDelta = Number(
          (memberCountries.reduce((s, c) => s + c.projections[year].gdpDeltaPct, 0) / count).toFixed(2),
        );
        const compositeScore = Math.round(
          droughtScore * 0.3 + floodScore * 0.25 + heatScore * 0.22 + displacementScore * 0.23,
        );

        return {
          id: cont.id,
          title: isFr ? cont.nameFr : isSw ? cont.nameSw : cont.nameEn,
          subtitle: `${cont.unStates} ${isFr ? 'États ONU' : isSw ? 'Nchi UN' : 'UN States'} · ${cont.popB}B pop.`,
          lat: cont.lat,
          lng: cont.lng,
          compositeScore,
          droughtScore,
          floodScore,
          heatScore,
          displacementScore,
          gdpOrYieldDelta: avgGdpDelta,
          metricBadge: `-$${totalLoss.toFixed(0)}B (${year})`,
          hazardSummary: isFr ? cont.summaryFr : cont.summaryEn,
          extraMeta: `${isFr ? 'Choc PIB moy.' : 'Avg GDP'} ${avgGdpDelta}% · ${isFr ? 'Inflation alim.' : 'Food infl.'} +${avgInfl.toFixed(1)}%`,
        };
      });
    }

    if (viewport === 'indian-ocean') {
      const yearAdj = year === 2027 ? 1.0 : year === 2028 ? 0.94 : year === 2029 ? 0.68 : year === 2031 ? 0.9 : 0.78;
      return INDIAN_OCEAN_NODES.map((n) => {
        // La Niña 2028 increases cyclone/flood weight and trims drought slightly
        const droughtScore = Math.min(
          98,
          Math.round(n.droughtIdx * (year === 2028 ? 0.72 : yearAdj)),
        );
        const floodScore = Math.min(
          98,
          Math.round(n.floodIdx * (year === 2028 ? 1.12 : yearAdj)),
        );
        const heatScore = Math.min(96, Math.round(n.heatIdx * (0.85 + yearAdj * 0.15)));
        const displacementScore = Math.min(96, Math.round(n.displacementIdx * yearAdj));
        const compositeScore = Math.round(
          droughtScore * 0.28 + floodScore * 0.32 + heatScore * 0.18 + displacementScore * 0.22,
        );
        const gdpDelta = Number((n.gdpDeltaPct * yearAdj).toFixed(1));
        return {
          id: n.id,
          title: isFr ? n.nameFr : n.nameEn,
          subtitle: `${n.territoryLabel} · ${year}`,
          lat: n.lat,
          lng: n.lng,
          compositeScore,
          droughtScore,
          floodScore,
          heatScore,
          displacementScore,
          gdpOrYieldDelta: gdpDelta,
          metricBadge: `${gdpDelta}% GDP`,
          hazardSummary: isFr ? n.hazardNoteFr : n.hazardNoteEn,
          extraMeta: `COI / SWIO Basin · ${year}`,
        };
      });
    }

    // 'world' (all 195 UN countries) or 'africa' (54 African countries)
    const pool =
      viewport === 'africa'
        ? DUPLICATED_195_COUNTRIES.filter((c) => c.unZone === 'afrique')
        : DUPLICATED_195_COUNTRIES;

    return pool.map((c) => {
      const coords = WORLD_COORDS_BY_ISO2[c.iso2] ?? { lat: 0, lng: 0 };
      const proj = c.projections[year];
      const zf = hasLiveScrape ? getZoneFactor(c.unZone) : null;
      const lossMult = hasLiveScrape
        ? c.iso2 === 'MG'
          ? syncState.madagascarFactors.overallLossFactor
          : (zf?.gdpLossFactor ?? 1)
        : 1;
      const dDelta = hasLiveScrape
        ? c.iso2 === 'MG'
          ? syncState.madagascarFactors.droughtDelta
          : (zf?.droughtDelta ?? 0)
        : 0;
      const fDelta = hasLiveScrape
        ? c.iso2 === 'MG'
          ? syncState.madagascarFactors.floodDelta
          : (zf?.floodDelta ?? 0)
        : 0;
      const inflAdd = hasLiveScrape
        ? c.iso2 === 'MG'
          ? syncState.madagascarFactors.foodInflationDeltaPct
          : (zf?.foodInflationAddPct ?? 0)
        : 0;
      const dispMult = hasLiveScrape
        ? c.iso2 === 'MG'
          ? syncState.madagascarFactors.displacementFactor
          : (zf?.displacementFactor ?? 1)
        : 1;

      const droughtScore = Math.min(98, Math.max(8, Math.round(proj.droughtIdx + dDelta)));
      const floodScore = Math.min(98, Math.max(8, Math.round(proj.floodIdx + fDelta)));
      const displacementScore = Math.min(98, Math.max(8, Math.round(proj.displacementIdx * dispMult)));
      const adjLoss = Number((proj.lossBUsd * lossMult).toFixed(3));
      const adjGdpDelta = Number((proj.gdpDeltaPct * lossMult).toFixed(2));
      const heatBase =
        c.hazard === 'heat'
          ? 74
          : c.hazard === 'drought'
            ? 64
            : c.hazard === 'mixed'
              ? 58
              : 46;
      const heatScore = Math.min(
        98,
        Math.round(heatBase * (0.65 + c.ensoSens * 0.24) + (proj.inflationAddPct + inflAdd) * 1.6),
      );
      const compositeScore = Math.min(
        98,
        Math.round(
          droughtScore * 0.3 +
            floodScore * 0.24 +
            heatScore * 0.22 +
            displacementScore * 0.24,
        ),
      );
      const zoneLabel = isFr
        ? UN_ZONE_META[c.unZone].nameFr
        : UN_ZONE_META[c.unZone].nameEn;

      return {
        id: c.iso2,
        title: isFr ? c.nameFr : c.nameEn,
        subtitle: `${zoneLabel} · ${c.iso2}`,
        lat: coords.lat,
        lng: coords.lng,
        compositeScore,
        droughtScore,
        floodScore,
        heatScore,
        displacementScore,
        gdpOrYieldDelta: adjGdpDelta,
        metricBadge: `-$${adjLoss}B (${adjGdpDelta}%)`,
        hazardSummary: isFr ? proj.regimeFr : proj.regimeEn,
        extraMeta: `${c.popM}M hab. · ${isFr ? 'Risque' : 'Risk'}: ${proj.famineRisk}`,
      };
    });
  }, [viewport, year, isFr, isSw, hasLiveScrape, syncState.madagascarFactors, getZoneFactor]);

  const filteredNodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allScopeNodes;
    return allScopeNodes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.subtitle.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q),
    );
  }, [allScopeNodes, searchQuery]);

  const scoreByIso2 = useMemo(() => {
    const map = new globalThis.Map<string, number>();
    for (const n of filteredNodes) {
      map.set(n.id, getLayerScore(n, layer));
    }
    return map;
  }, [filteredNodes, layer]);

  // Keep selectedId valid when scope or filter changes
  useEffect(() => {
    if (filteredNodes.length === 0) return;
    if (!filteredNodes.some((n) => n.id === selectedId)) {
      const preferred =
        viewport === 'world' || viewport === 'africa'
          ? filteredNodes.find((n) => n.id === 'MG') ?? filteredNodes[0]
          : viewport === 'indian-ocean'
            ? filteredNodes.find((n) => n.id === 'io-mg-south') ?? filteredNodes[0]
            : filteredNodes[0];
      setSelectedId(preferred.id);
    }
  }, [filteredNodes, selectedId, viewport]);

  const selectedNode = useMemo(
    () =>
      filteredNodes.find((n) => n.id === selectedId) ??
      allScopeNodes.find((n) => n.id === selectedId) ??
      filteredNodes[0],
    [filteredNodes, allScopeNodes, selectedId],
  );

  const rankedTopNodes = useMemo(() => {
    return [...filteredNodes]
      .sort((a, b) => getLayerScore(b, layer) - getLayerScore(a, layer))
      .slice(0, 8);
  }, [filteredNodes, layer]);

  const handleFetchWeather = useCallback(
    async (node: ClimateMapNode) => {
      setWeatherLoading(true);
      setWeatherForId(node.id);
      try {
        const res = await fetch(
          `/api/maps/weather-point?lat=${encodeURIComponent(node.lat)}&lng=${encodeURIComponent(node.lng)}&lang=${encodeURIComponent(lang)}`,
        );
        const json = (await res.json()) as WeatherPointResponse;
        setWeatherData(json);
        if (json.quotaExceeded) {
          window.dispatchEvent(new Event('gmp-quota-exceeded'));
        }
      } catch (err) {
        setWeatherData({
          available: false,
          reason: err instanceof Error ? err.message : 'Weather lookup failed.',
        });
      } finally {
        setWeatherLoading(false);
      }
    },
    [lang],
  );

  const handlePredictDistrict = useCallback(async () => {
    if (!selectedNode || viewport !== 'madagascar') return;
    setMlLoading(true);
    try {
      const res = await fetch('/api/model/predict-district', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: selectedNode.id,
          year: displayYear,
          scenario: 's2',
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as DistrictPredictionResult;
        setMlResult(json);
      }
    } catch {
      // ignore offline
    } finally {
      setMlLoading(false);
    }
  }, [selectedNode, viewport, displayYear]);

  const handleSaveSnapshot = async () => {
    if (!user || !selectedNode) return;
    setSavingSnap(true);
    try {
      const ok = await saveAnalysisSnapshot({
        scope: `map-${viewport}-${layer}`,
        regionName: selectedNode.title,
        year: displayYear,
        scenario: 'baseline',
        summary: `${copy.layers[layer]}: ${getLayerScore(selectedNode, layer)}/100 · ${selectedNode.metricBadge} · ${selectedNode.hazardSummary}`,
      });
      if (ok) {
        setSnapSavedMsg(true);
        setTimeout(() => setSnapSavedMsg(false), 3000);
      }
    } finally {
      setSavingSnap(false);
    }
  };

  const layerIcons: Record<RiskLayerType, typeof Layers> = {
    composite: ShieldAlert,
    drought: Droplets,
    flood: CloudRain,
    heat: Flame,
    displacement: Users,
  };

  const selectedLayerScore = selectedNode ? getLayerScore(selectedNode, layer) : 0;
  const selectedScoreStyle = getScoreStyle(selectedLayerScore);

  return (
    <section
      id="carte-risques-climatiques"
      className="border-t border-zinc-200 bg-white py-14 sm:py-18"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            {copy.lead}
          </p>
        </div>

        {/* Control Toolbar */}
        <div className="mt-8 rounded-md border border-zinc-200 bg-[#F9F8F4] p-4 space-y-4">
          {/* Viewport + Horizon row */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {copy.scopeLabel}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(Object.keys(copy.scopes) as MapViewportScope[]).map((scopeKey) => (
                  <button
                    key={scopeKey}
                    type="button"
                    onClick={() => setViewport(scopeKey)}
                    className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      viewport === scopeKey
                        ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                        : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {copy.scopes[scopeKey]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {copy.yearLabel}
              </span>
              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                {FORECAST_YEARS.map((yr) => {
                  const isActive = displayYear === yr;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setYear(yr)}
                      className={`rounded border px-2.5 py-1.5 font-mono text-xs font-semibold tabular-nums transition-colors ${
                        isActive
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Risk Layer + Search row */}
          <div className="flex flex-col gap-3 border-t border-zinc-200 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {copy.layerLabel}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(Object.keys(copy.layers) as RiskLayerType[]).map((layerKey) => {
                  const Icon = layerIcons[layerKey];
                  return (
                    <button
                      key={layerKey}
                      type="button"
                      onClick={() => setLayer(layerKey)}
                      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        layer === layerKey
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copy.layers[layerKey]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full lg:w-72">
              <label htmlFor="risk-map-search" className="sr-only">
                {copy.searchPlaceholder}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  id="risk-map-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full rounded border border-zinc-300 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#1E3A8A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {viewport === 'madagascar' && (
            <p className="text-[11px] font-medium text-zinc-600">{copy.madagascarYearNote}</p>
          )}
        </div>

        {/* Main Split Layout: Map Canvas (8 cols) + Risk Inspector & Top Exposure Ranking (4 cols) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {hasMapsKey ? (
              <APIProvider apiKey={apiKey!} libraries={['marker']} language={lang}>
                <LiveGoogleMapCanvas
                  nodes={filteredNodes}
                  geoJson={geoJsonData}
                  scoreByIso2={scoreByIso2}
                  viewport={viewport}
                  layer={layer}
                  selectedNode={selectedNode}
                  displayYear={displayYear}
                  copy={copy}
                  legendCollapsed={legendCollapsed}
                  onToggleLegend={() => setLegendCollapsed((prev) => !prev)}
                  onSelectNode={(id) => setSelectedId(id)}
                  onFallbackSwitch={() => undefined}
                  weatherData={weatherForId === selectedNode?.id ? weatherData : null}
                  weatherLoading={weatherLoading}
                  onFetchWeather={handleFetchWeather}
                />
              </APIProvider>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-950">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{copy.fallbackBannerTitle}</p>
                    <p className="mt-0.5 text-amber-900">{copy.fallbackBannerBody}</p>
                  </div>
                </div>
                <ProjectionFallbackCanvas
                  nodes={filteredNodes}
                  geoJson={geoJsonData}
                  scoreByIso2={scoreByIso2}
                  viewport={viewport}
                  layer={layer}
                  selectedId={selectedNode?.id ?? ''}
                  displayYear={displayYear}
                  copy={copy}
                  legendCollapsed={legendCollapsed}
                  onToggleLegend={() => setLegendCollapsed((prev) => !prev)}
                  onSelectNode={(id) => setSelectedId(id)}
                />
              </div>
            )}
          </div>

          {/* Right Column: Selected Location Inspector + Weather + Ranked Exposure List */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            {selectedNode && (
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                <div className="flex items-start justify-between gap-2 border-b border-zinc-200 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      {copy.selectedTitle}
                    </p>
                    <h3 className="mt-0.5 font-serif text-lg font-bold text-zinc-900">
                      {selectedNode.title}
                    </h3>
                    <p className="text-xs text-zinc-600">{selectedNode.subtitle}</p>
                  </div>
                  <span
                    className="rounded px-2 py-1 font-mono text-xs font-bold tabular-nums"
                    style={{
                      backgroundColor: selectedScoreStyle.badgeBg,
                      color: selectedScoreStyle.badgeText,
                    }}
                  >
                    {selectedLayerScore}/100
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded border border-zinc-200 bg-white p-2">
                    <span className="block text-[10px] text-zinc-500">{copy.droughtLabel}</span>
                    <span className="font-mono text-sm font-bold tabular-nums text-zinc-900">
                      {selectedNode.droughtScore}/100
                    </span>
                  </div>
                  <div className="rounded border border-zinc-200 bg-white p-2">
                    <span className="block text-[10px] text-zinc-500">{copy.floodLabel}</span>
                    <span className="font-mono text-sm font-bold tabular-nums text-zinc-900">
                      {selectedNode.floodScore}/100
                    </span>
                  </div>
                  <div className="rounded border border-zinc-200 bg-white p-2">
                    <span className="block text-[10px] text-zinc-500">{copy.heatLabel}</span>
                    <span className="font-mono text-sm font-bold tabular-nums text-zinc-900">
                      {selectedNode.heatScore}/100
                    </span>
                  </div>
                  <div className="rounded border border-zinc-200 bg-white p-2">
                    <span className="block text-[10px] text-zinc-500">{copy.displacementLabel}</span>
                    <span className="font-mono text-sm font-bold tabular-nums text-zinc-900">
                      {selectedNode.displacementScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded border border-zinc-200 bg-white p-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-zinc-600">{copy.gdpOrYieldLabel}</span>
                    <span className="font-mono font-bold tabular-nums text-[#1E3A8A]">
                      {selectedNode.metricBadge}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-zinc-700">{selectedNode.hazardSummary}</p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-500">
                    {selectedNode.extraMeta} · {selectedNode.lat.toFixed(2)}°, {selectedNode.lng.toFixed(2)}°
                  </p>
                </div>

                {/* Real-time Google Maps Weather API Button, ML Prediction & Firestore Save */}
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    disabled={weatherLoading}
                    onClick={() => handleFetchWeather(selectedNode)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60"
                  >
                    <Radio className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{weatherLoading ? copy.fetchingWeather : copy.fetchWeatherBtn}</span>
                  </button>

                  {viewport === 'madagascar' && (
                    <button
                      type="button"
                      disabled={mlLoading}
                      onClick={() => void handlePredictDistrict()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded border border-[#1E3A8A] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/5 disabled:opacity-60"
                    >
                      {mlLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{mlLoading ? copy.mlPredicting : copy.mlPredictBtn}</span>
                    </button>
                  )}

                  {viewport === 'madagascar' &&
                    mlResult &&
                    mlResult.district === selectedNode.id &&
                    mlResult.year === displayYear && (
                      <div className="rounded border border-[#1E3A8A]/30 bg-white p-2.5 text-[11px]">
                        <p className="font-mono font-semibold text-[#1E3A8A]">{mlResult.model}</p>
                        <div className="mt-1.5 grid grid-cols-2 gap-1.5 font-mono tabular-nums text-zinc-800">
                          <span>Water: {mlResult.waterDeltaPct >= 0 ? '+' : ''}{mlResult.waterDeltaPct}%</span>
                          <span>Rice: {mlResult.riceDeltaPct >= 0 ? '+' : ''}{mlResult.riceDeltaPct}%</span>
                          <span>Maize: {mlResult.maizeDeltaPct >= 0 ? '+' : ''}{mlResult.maizeDeltaPct}%</span>
                          <span>Export: {mlResult.exportCropDeltaPct >= 0 ? '+' : ''}{mlResult.exportCropDeltaPct}%</span>
                        </div>
                      </div>
                    )}

                  {user && (
                    <button
                      type="button"
                      disabled={savingSnap}
                      onClick={() => void handleSaveSnapshot()}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-60"
                    >
                      {snapSavedMsg ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                          <span className="text-emerald-800">{actions.savedOk}</span>
                        </>
                      ) : (
                        <>
                          <Database className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                          <span>{actions.saveSnapshot}</span>
                        </>
                      )}
                    </button>
                  )}

                  {weatherForId === selectedNode.id && weatherData && (
                    <div className="mt-2.5 rounded border border-zinc-200 bg-white p-3 text-xs">
                      {!weatherData.available ? (
                        <p className="text-zinc-600">{weatherData.reason}</p>
                      ) : (
                        <div className="space-y-2.5">
                          {weatherData.current && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                                {copy.weatherTitle}
                              </p>
                              <div className="mt-1 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {weatherData.current.iconUri && (
                                    <img
                                      src={weatherData.current.iconUri}
                                      alt={weatherData.current.conditionText ?? 'Weather'}
                                      className="h-6 w-6"
                                    />
                                  )}
                                  <span className="font-semibold text-zinc-900">
                                    {weatherData.current.conditionText ?? '—'}
                                  </span>
                                </div>
                                {weatherData.current.tempC !== null && (
                                  <span className="font-mono text-base font-bold tabular-nums text-zinc-900">
                                    {weatherData.current.tempC.toFixed(1)} °C
                                  </span>
                                )}
                              </div>
                              <div className="mt-1.5 flex flex-wrap gap-3 font-mono text-[11px] text-zinc-600">
                                {weatherData.current.humidityPct !== null && (
                                  <span>RH {weatherData.current.humidityPct}%</span>
                                )}
                                {weatherData.current.windKmh !== null && (
                                  <span className="inline-flex items-center gap-1">
                                    <Wind className="h-3 w-3" aria-hidden="true" />
                                    {weatherData.current.windKmh} km/h
                                  </span>
                                )}
                                {weatherData.current.precipProbPct !== null && (
                                  <span>Precip {weatherData.current.precipProbPct}%</span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-zinc-100 pt-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                              {copy.weatherAlertsTitle}
                            </p>
                            {weatherData.alerts && weatherData.alerts.length > 0 ? (
                              <ul className="mt-1.5 space-y-2">
                                {weatherData.alerts.map((al) => (
                                  <li
                                    key={al.id}
                                    className="rounded border border-rose-200 bg-rose-50/70 p-2 text-[11px]"
                                  >
                                    <p className="font-semibold text-rose-900">
                                      {al.title} ({al.severity})
                                    </p>
                                    {al.areaName && (
                                      <p className="mt-0.5 text-rose-800">{al.areaName}</p>
                                    )}
                                    {al.dataSource?.name && (
                                      <p className="mt-1 text-[10px] text-zinc-600">
                                        {copy.sourceLabel}:{' '}
                                        {al.dataSource.authorityUri ? (
                                          <a
                                            href={al.dataSource.authorityUri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-[#1E3A8A] underline"
                                          >
                                            {al.dataSource.name}
                                          </a>
                                        ) : (
                                          <span>{al.dataSource.name}</span>
                                        )}
                                      </p>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-1 text-[11px] text-zinc-500">{copy.noAlerts}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top Exposure Ranking List */}
            <div className="rounded-md border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
                  {copy.topExposureTitle}
                </h4>
                <span className="font-mono text-[11px] text-zinc-500">{copy.layers[layer]}</span>
              </div>
              <ul className="mt-2 divide-y divide-zinc-100">
                {rankedTopNodes.map((node) => {
                  const s = getLayerScore(node, layer);
                  const st = getScoreStyle(s);
                  const isSel = node.id === selectedNode?.id;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(node.id)}
                        className={`flex w-full items-center justify-between gap-2 px-2 py-2 text-left text-xs transition-colors ${
                          isSel ? 'bg-[#1E3A8A]/8 font-semibold text-zinc-950' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <MapPin
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: st.fill }}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-zinc-900">{node.title}</p>
                            <p className="truncate text-[10px] text-zinc-500">{node.metricBadge}</p>
                          </div>
                        </div>
                        <span
                          className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums"
                          style={{ backgroundColor: st.badgeBg, color: st.badgeText }}
                        >
                          {s}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
