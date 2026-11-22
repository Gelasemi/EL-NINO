import { useCallback, useEffect, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileDown,
  Globe,
  HardDriveDownload,
  Radio,
  RefreshCw,
  Rss,
  ShieldAlert,
  Thermometer,
  Wind,
  X,
} from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { exportClimateSummaryPdf } from '../utils/scientificReportGenerator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  getOfflineCacheStatus,
  warmCriticalDatasetsCache,
  type OfflineCacheStatus,
} from '../utils/offlineDatasetCache';
import {
  getBaselineAgencyBulletins,
  type RssAgencyCategory,
  type RssBulletinsPayload,
} from '../utils/rssBulletins';

interface ClimateAlertItem {
  id: string;
  agency: string;
  severity: 'critical' | 'high' | 'watch';
  headline: string;
  summary: string;
  regionTag: string;
  timestamp: string;
  targetSectionId: string;
  externalUrl?: string;
  isLiveRss?: boolean;
}

interface AlertLocaleBundle {
  bannerBadge: string;
  restoreLabel: string;
  detailsBtn: string;
  hideDetailsBtn: string;
  jumpActionLabel: string;
  closeBannerAria: string;
  items: ClimateAlertItem[];
}

interface RssUiCopy {
  rssBtnLabel: string;
  panelTitle: string;
  streamLive: string;
  streamConnecting: string;
  streamOffline: string;
  syncNowBtn: string;
  syncingBtn: string;
  feedsLiveLabel: string;
  lastPolledLabel: string;
  filterAll: string;
  filterWmo: string;
  filterNational: string;
  filterNoaa: string;
  filterGdacs: string;
  liveXmlLabel: string;
  baselineLabel: string;
  readBulletinLabel: string;
  emptyFilterLabel: string;
}

const RSS_UI_COPY: Record<WorldLanguageCode, RssUiCopy> = {
  fr: {
    rssBtnLabel: 'Flux RSS OMM & Agences',
    panelTitle: 'Écouteur RSS Météo en Temps Réel (OMM · DGM · NOAA · GDACS)',
    streamLive: '● Flux SSE en direct',
    streamConnecting: '○ Reconnexion SSE…',
    streamOffline: '✖ Hors ligne (cache local)',
    syncNowBtn: 'Actualiser RSS',
    syncingBtn: 'Sync RSS…',
    feedsLiveLabel: 'flux XML actifs',
    lastPolledLabel: 'Dernière écoute',
    filterAll: 'Toutes agences',
    filterWmo: 'OMM / WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'GDACS ONU',
    liveXmlLabel: 'XML temps réel',
    baselineLabel: 'Bulletin vérifié',
    readBulletinLabel: 'Source officielle',
    emptyFilterLabel: 'Aucun bulletin pour ce filtre d’agence.',
  },
  en: {
    rssBtnLabel: 'WMO & Agency RSS Feed',
    panelTitle: 'Real-Time Meteorological RSS Listener (WMO · DGM · NOAA · GDACS)',
    streamLive: '● Live SSE Stream',
    streamConnecting: '○ Reconnecting SSE…',
    streamOffline: '✖ Offline (local cache)',
    syncNowBtn: 'Sync RSS Now',
    syncingBtn: 'Syncing RSS…',
    feedsLiveLabel: 'live XML feeds',
    lastPolledLabel: 'Last polled',
    filterAll: 'All Agencies',
    filterWmo: 'WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'UN GDACS',
    liveXmlLabel: 'Live XML',
    baselineLabel: 'Verified bulletin',
    readBulletinLabel: 'Official bulletin',
    emptyFilterLabel: 'No bulletins matching this agency filter.',
  },
  sw: {
    rssBtnLabel: 'Mlisho wa RSS (WMO & Taifa)',
    panelTitle: 'Kusikiliza RSS ya Hali ya Hewa Mubashara (WMO · DGM · NOAA · GDACS)',
    streamLive: '● Mtiririko Hai wa SSE',
    streamConnecting: '○ Inaunganisha tena…',
    streamOffline: '✖ Nje ya mtandao',
    syncNowBtn: 'Sasisha RSS',
    syncingBtn: 'Inasawazisha…',
    feedsLiveLabel: 'milisho hai ya XML',
    lastPolledLabel: 'Ilisasishwa',
    filterAll: 'Mashirika Yote',
    filterWmo: 'WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'GDACS UN',
    liveXmlLabel: 'XML Mubashara',
    baselineLabel: 'Taarifa iliyothibitishwa',
    readBulletinLabel: 'Chanzo rasmi',
    emptyFilterLabel: 'Hakuna taarifa kwa kichujio hiki.',
  },
  es: {
    rssBtnLabel: 'RSS OMM y Agencias',
    panelTitle: 'Escucha RSS Meteorológica en Tiempo Real (OMM · DGM · NOAA · GDACS)',
    streamLive: '● Flujo SSE en vivo',
    streamConnecting: '○ Reconectando SSE…',
    streamOffline: '✖ Sin conexión (caché)',
    syncNowBtn: 'Sincronizar RSS',
    syncingBtn: 'Sincronizando…',
    feedsLiveLabel: 'fuentes XML en vivo',
    lastPolledLabel: 'Última consulta',
    filterAll: 'Todas',
    filterWmo: 'OMM / WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'GDACS ONU',
    liveXmlLabel: 'XML en vivo',
    baselineLabel: 'Boletín verificado',
    readBulletinLabel: 'Fuente oficial',
    emptyFilterLabel: 'No hay boletines para este filtro.',
  },
  ar: {
    rssBtnLabel: 'بث RSS للأرصاد (WMO)',
    panelTitle: 'مستمع نشرات الأرصاد RSS الفوري (WMO · DGM · NOAA · GDACS)',
    streamLive: '● بث SSE مباشر',
    streamConnecting: '○ إعادة الاتصال…',
    streamOffline: '✖ غير متصل (الذاكرة المحلية)',
    syncNowBtn: 'تحديث RSS',
    syncingBtn: 'جارٍ التحديث…',
    feedsLiveLabel: 'خلاصات XML نشطة',
    lastPolledLabel: 'آخر تحديث',
    filterAll: 'جميع الوكالات',
    filterWmo: 'WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'GDACS الأمم المتحدة',
    liveXmlLabel: 'XML مباشر',
    baselineLabel: 'نشرة موثقة',
    readBulletinLabel: 'المصدر الرسمي',
    emptyFilterLabel: 'لا توجد نشرات مطابقة لهذا الفلتر.',
  },
  zh: {
    rssBtnLabel: 'WMO 与气象局 RSS',
    panelTitle: '实时气象公报 RSS 监听器（WMO · DGM · NOAA · GDACS）',
    streamLive: '● SSE 实时流',
    streamConnecting: '○ 正在重连…',
    streamOffline: '✖ 离线（本地缓存）',
    syncNowBtn: '立即同步 RSS',
    syncingBtn: '同步中…',
    feedsLiveLabel: '个实时 XML 源',
    lastPolledLabel: '最近轮询',
    filterAll: '全部机构',
    filterWmo: 'WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: '联合国 GDACS',
    liveXmlLabel: '实时 XML',
    baselineLabel: '已核实公报',
    readBulletinLabel: '查看官方原文',
    emptyFilterLabel: '当前机构筛选下暂无公报。',
  },
  pt: {
    rssBtnLabel: 'Feed RSS OMM & Agências',
    panelTitle: 'Monitor RSS Meteorológico em Tempo Real (OMM · DGM · NOAA · GDACS)',
    streamLive: '● Fluxo SSE ao vivo',
    streamConnecting: '○ Reconectando SSE…',
    streamOffline: '✖ Offline (cache local)',
    syncNowBtn: 'Atualizar RSS',
    syncingBtn: 'Sincronizando…',
    feedsLiveLabel: 'feeds XML ativos',
    lastPolledLabel: 'Última verificação',
    filterAll: 'Todas agências',
    filterWmo: 'OMM / WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'GDACS ONU',
    liveXmlLabel: 'XML ao vivo',
    baselineLabel: 'Boletim verificado',
    readBulletinLabel: 'Fonte oficial',
    emptyFilterLabel: 'Nenhum boletim encontrado para este filtro.',
  },
  hi: {
    rssBtnLabel: 'WMO व एजेंसी RSS फ़ीड',
    panelTitle: 'रीयल-टाइम मौसम विज्ञान RSS श्रोता (WMO · DGM · NOAA · GDACS)',
    streamLive: '● लाइव SSE स्ट्रीम',
    streamConnecting: '○ पुनः कनेक्ट हो रहा है…',
    streamOffline: '✖ ऑफ़लाइन (स्थानीय कैश)',
    syncNowBtn: 'RSS सिंक करें',
    syncingBtn: 'सिंक जारी…',
    feedsLiveLabel: 'लाइव XML फ़ीड',
    lastPolledLabel: 'अंतिम जाँच',
    filterAll: 'सभी एजेंसियाँ',
    filterWmo: 'WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'UN GDACS',
    liveXmlLabel: 'लाइव XML',
    baselineLabel: 'सत्यापित बुलेटिन',
    readBulletinLabel: 'आधिकारिक स्रोत',
    emptyFilterLabel: 'इस फ़िल्टर के लिए कोई बुलेटिन नहीं।',
  },
  ru: {
    rssBtnLabel: 'RSS-лента ВМО и агентств',
    panelTitle: 'Мониторинг метео-RSS в реальном времени (ВМО · DGM · NOAA · GDACS)',
    streamLive: '● Поток SSE активен',
    streamConnecting: '○ Переподключение SSE…',
    streamOffline: '✖ Офлайн (локальный кэш)',
    syncNowBtn: 'Обновить RSS',
    syncingBtn: 'Синхронизация…',
    feedsLiveLabel: 'активных XML-лент',
    lastPolledLabel: 'Последний опрос',
    filterAll: 'Все агентства',
    filterWmo: 'ВМО / WMO',
    filterNational: 'DGM / SWIO',
    filterNoaa: 'NOAA CPC',
    filterGdacs: 'GDACS ООН',
    liveXmlLabel: 'Живой XML',
    baselineLabel: 'Проверенный бюллетень',
    readBulletinLabel: 'Официальный источник',
    emptyFilterLabel: 'Нет бюллетеней для выбранного фильтра.',
  },
};

interface LiveStationReading {
  id: string;
  label: string;
  lat: number;
  lng: number;
  tempC: number | null;
  precipMm24h: number | null;
  windKmh: number | null;
  weatherCode: number | null;
}

interface LiveFeedPayload {
  source: string;
  fetchedAtIso: string;
  stations: LiveStationReading[];
}

const ALERTS_BY_LANG: Record<WorldLanguageCode, AlertLocaleBundle> = {
  fr: {
    bannerBadge: 'VEILLE URGENTE · SWIOCOF-15 / DGM / OMM',
    restoreLabel: 'Alertes SWIOCOF-15 & DGM actives (4)',
    detailsBtn: 'Détails bulletin',
    hideDetailsBtn: 'Masquer',
    jumpActionLabel: 'Voir analyse & mesures →',
    closeBannerAria: 'Réduire la bannière d’alertes climatiques',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · COI / CycloneOI',
        severity: 'high',
        headline:
          'Bassin Sud-Ouest Océan Indien : décalage des trajectoires cycloniques vers l’Est (Rodrigues) & excès pluvieux Nord-Est',
        summary:
          'Sous l’effet combiné El Niño (+3,5 °C) et IOD+, SWIOCOF-15 signale un nombre global de cyclones inférieur à la normale mais des précipitations intenses précoces (Nov. 2026 – Janv. 2027) sur SAVA, Analanjirofo et Diana avec risques de crues et glissements de terrain.',
        regionTag: 'Nord-Est Madagascar & Mascareignes',
        timestamp: 'Bulletin actif · Nov. 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'Alerte Rouge Grand Sud : déficit hydrique de −30 % à −50 % et +2 à +4 °C (3,72 M de personnes exposées)',
        summary:
          'Les districts d’Ambovombe, Tsihombe, Beloha, Bekily, Ampanihy et Amboasary-Atsimo enregistrent un stress hydrique critique avant la soudure 2027. Activation prioritaire des transferts Cash+ et semis sorgho/mil 90 jours.',
        regionTag: 'Androy · Anosy · Atsimo-Andrefana',
        timestamp: 'Bulletin décadal · Oct.–Nov. 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'OMM / WMO · NOAA CPC',
        severity: 'critical',
        headline:
          'Super El Niño actif : indice ONI à +3,5 °C en novembre 2026, pic projeté à +4,1 °C en janvier 2027 (IOD+ couplé)',
        summary:
          'Le réchauffement record du Pacifique équatorial se couple à un dipôle positif de l’océan Indien (IOD+), déclenchant une asymétrie extrême : sécheresse australe (SADC/Sud Madagascar) vs crues diluviennes en Afrique de l’Est (COMESA).',
        regionTag: 'Indo-Pacifique · SADC · COMESA',
        timestamp: 'Mise à jour OMM · Nov. 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'Tension marchés & énergie : riz local Antananarivo projeté à 3 200 MGA/kg (+25,5 %) & vigilance étiage RIA',
        summary:
          'La hausse du fret et le recul des précipitations sur les Hautes Terres et le lac Alaotra tendent les prix alimentaires d’ici janv.–fév. 2027, parallèlement à un risque d’étiage sur le bassin hydroélectrique d’Andekaleka.',
        regionTag: 'Analamanga · Alaotra · RIA',
        timestamp: 'Alerte Prix · T4 2026–T1 2027',
        targetSectionId: 'afrique',
      },
    ],
  },
  en: {
    bannerBadge: 'URGENT ADVISORY · SWIOCOF-15 / DGM / WMO',
    restoreLabel: 'Active SWIOCOF-15 & WMO Climate Alerts (4)',
    detailsBtn: 'Bulletin details',
    hideDetailsBtn: 'Hide',
    jumpActionLabel: 'Open analysis & action plan →',
    closeBannerAria: 'Collapse climate alerts banner',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · IOC / CycloneOI',
        severity: 'high',
        headline:
          'Southwest Indian Ocean: cyclone tracks shifted east toward Rodrigues & excess Nov–Jan rainfall in NE Madagascar',
        summary:
          'Under coupled El Niño (+3.5 °C) and positive IOD+, SWIOCOF-15 forecasts below-normal basin cyclone counts overall but intense early rains (Nov 2026 – Jan 2027) in SAVA, Analanjirofo, and Diana with localized flood & landslide hazards.',
        regionTag: 'NE Madagascar & Mascarenes',
        timestamp: 'Active Bulletin · Nov 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'Grand Sud Red Alert: −30% to −50% rainfall deficit and +2 to +4 °C heatwave (3.72M people exposed)',
        summary:
          'Ambovombe, Tsihombe, Beloha, Bekily, Ampanihy, and Amboasary-Atsimo face severe drought stress ahead of the 2027 lean season. Priority Cash+ transfers and 90-day sorghum/millet sowing triggers activated.',
        regionTag: 'Androy · Anosy · Atsimo-Andrefana',
        timestamp: 'Decadal Bulletin · Nov 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'WMO · NOAA CPC',
        severity: 'critical',
        headline:
          'Active Super El Niño: ONI anomaly at +3.5 °C (Nov 2026), projected peak +4.1 °C in Jan 2027 with coupled IOD+',
        summary:
          'Record equatorial Pacific warming coupled with a positive Indian Ocean Dipole drives extreme continental divergence: Southern African/SADC drought vs. East African/COMESA torrential floods.',
        regionTag: 'Indo-Pacific · SADC · COMESA',
        timestamp: 'WMO Update · Nov 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'Food & Power Alert: Antananarivo local rice projected at 3,200 MGA/kg (+25.5%) & RIA hydro drawdown watch',
        summary:
          'Imported freight pressures and erratic Highland/Alaotra rains are pushing local rice upward through Jan–Feb 2027 alongside heightened dry-season flow strain on the Andekaleka hydropower grid.',
        regionTag: 'Analamanga · Alaotra · RIA Grid',
        timestamp: 'Market Alert · Q4 2026–Q1 2027',
        targetSectionId: 'afrique',
      },
    ],
  },
  sw: {
    bannerBadge: 'TAHADHARI YA HARAKA · SWIOCOF-15 / DGM / WMO',
    restoreLabel: 'Tahadhari Hai za SWIOCOF-15 na WMO (4)',
    detailsBtn: 'Maelezo zaidi',
    hideDetailsBtn: 'Ficha',
    jumpActionLabel: 'Fungua uchambuzi na hatua →',
    closeBannerAria: 'Funga bango la tahadhari',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · COI / CycloneOI',
        severity: 'high',
        headline:
          'Bahari ya Hindi Magharibi: njia za vimbunga zimegeuzwa mashariki kwenda Rodrigues & mvua nyingi Kaskazini-Mashariki',
        summary:
          'Chini ya El Niño (+3.5 °C) na IOD+, SWIOCOF-15 inatabiri vimbunga vichache lakini mvua kubwa za mapema (Nov 2026 – Jan 2027) katika SAVA, Analanjirofo na Diana zenye hatari ya mafuriko.',
        regionTag: 'KM Madagaska & Mascarenes',
        timestamp: 'Taarifa Hai · Nov 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'Tahadhari Nyekundu Kusini Kuu: upungufu wa mvua −30% hadi −50% na joto +2 hadi +4 °C (watu 3.72M hatarini)',
        summary:
          'Wilaya za Ambovombe, Tsihombe, Beloha, Bekily, Ampanihy na Amboasary-Atsimo zinakabiliwa na ukame mkali kabla ya kipindi cha uhaba 2027. Misaada ya Cash+ na mbegu za mtama siku 90 zinaendelea.',
        regionTag: 'Androy · Anosy · Atsimo-Andrefana',
        timestamp: 'Taarifa ya Siku 10 · Nov 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'WMO · NOAA CPC',
        severity: 'critical',
        headline:
          'El Niño Kuu inaendelea: kielelezo ONI +3.5 °C (Nov 2026), kilele +4.1 °C Jan 2027 pamoja na IOD+',
        summary:
          'Ongezeko la joto la Pasifiki likichanganyika na IOD+ linasababisha ukame Kusini mwa Afrika (SADC) dhidi ya mafuriko makubwa Afrika Mashariki (COMESA).',
        regionTag: 'Indo-Pasifiki · SADC · COMESA',
        timestamp: 'Taarifa ya WMO · Nov 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'Tahadhari ya Soko na Nishati: bei ya mchele Antananarivo kuelekea MGA 3,200/kg (+25.5%) & upungufu wa maji RIA',
        summary:
          'Bei ya chakula na usafirishaji zinapanda kuelekea Jan–Feb 2027 huku bwawa la umeme la Andekaleka likihitaji uangalizi wa karibu.',
        regionTag: 'Analamanga · Alaotra · RIA',
        timestamp: 'Tahadhari ya Bei · Q4 2026',
        targetSectionId: 'afrique',
      },
    ],
  },
  es: {
    bannerBadge: 'ALERTA URGENTE · SWIOCOF-15 / DGM / OMM',
    restoreLabel: 'Alertas Activas SWIOCOF-15 y OMM (4)',
    detailsBtn: 'Detalles del boletín',
    hideDetailsBtn: 'Ocultar',
    jumpActionLabel: 'Ver análisis y medidas →',
    closeBannerAria: 'Contraer banner de alertas climáticas',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · COI / CycloneOI',
        severity: 'high',
        headline:
          'Océano Índico Suroccidental: trayectorias ciclónicas hacia el Este (Rodrigues) y exceso de lluvias en el Noreste',
        summary:
          'Bajo El Niño (+3,5 °C) e IOD+, SWIOCOF-15 prevé menos ciclones totales pero lluvias intensas tempranas (Nov 2026 – Ene 2027) en SAVA, Analanjirofo y Diana.',
        regionTag: 'Noreste de Madagascar y Mascareñas',
        timestamp: 'Boletín activo · Nov 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'Alerta Roja Gran Sur: déficit hídrico de −30 % a −50 % y ola de calor +2 a +4 °C (3,72 M expuestos)',
        summary:
          'Ambovombe, Tsihombe, Beloha, Bekily, Ampanihy y Amboasary-Atsimo sufren estrés hídrico extremo. Activación prioritaria de Cash+ y semillas de ciclo corto.',
        regionTag: 'Androy · Anosy · Atsimo-Andrefana',
        timestamp: 'Boletín decadal · Nov 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'OMM / WMO · NOAA CPC',
        severity: 'critical',
        headline:
          'Súper El Niño activo: índice ONI en +3,5 °C (Nov 2026), pico proyectado de +4,1 °C en Ene 2027 con IOD+',
        summary:
          'El calentamiento récord del Pacífico junto al IOD+ provoca sequía austral (SADC) frente a inundaciones severas en África Oriental (COMESA).',
        regionTag: 'Indo-Pacífico · SADC · COMESA',
        timestamp: 'Actualización OMM · Nov 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'Alerta Alimentaria y Eléctrica: arroz local proyectado a 3.200 MGA/kg (+25,5 %) y vigilancia hidroeléctrica RIA',
        summary:
          'Las tensiones logísticas y la irregularidad pluvial impulsan los precios agrícolas rumbo a ene–feb 2027 y exigen vigilancia en Andekaleka.',
        regionTag: 'Analamanga · Alaotra · Red RIA',
        timestamp: 'Alerta Precios · T4 2026',
        targetSectionId: 'afrique',
      },
    ],
  },
  ar: {
    bannerBadge: 'إنذار مناخي عاجل · SWIOCOF-15 / DGM / WMO',
    restoreLabel: 'تنبيهات SWIOCOF-15 والمنظمة العالمية للأرصاد (4)',
    detailsBtn: 'تفاصيل النشرة',
    hideDetailsBtn: 'إخفاء',
    jumpActionLabel: 'عرض التحليل والإجراءات ←',
    closeBannerAria: 'طي شريط التنبيهات المناخية',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · COI / CycloneOI',
        severity: 'high',
        headline:
          'جنوب غرب المحيط الهندي: انحراف مسار الأعاصير شرقاً نحو رودريغيز وأمطار غزيرة شمال شرق مدغشقر',
        summary:
          'تحت تأثير النينيو (+3.5 °م) وقطبية المحيط الهندي الموجبة IOD+، يتوقع المنتدى أمطاراً مبكرة غزيرة في سافا وأنالانجيروفو وديانا مع مخاطر فيضانات.',
        regionTag: 'شمال شرق مدغشقر وماسكارين',
        timestamp: 'نشرة نشطة · نوفمبر 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'أرصاد مدغشقر (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'إنذار أحمر للجنوب الكبير: عجز مائي −30% إلى −50% وارتفاع حراري +2 إلى +4 °م (3.72 مليون متأثر)',
        summary:
          'تواجه مقاطعات أمبوفومبي وتسيومبي وبلوها وبكيلي إجهاداً جفافياً حاداً، مع تفعيل التحويلات النقدية Cash+ وبذور الذرة السريعة (90 يوماً).',
        regionTag: 'أندروي · أنوسي · أتسيمو أندريفانا',
        timestamp: 'نشرة عشرية · نوفمبر 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'المنظمة العالمية للأرصاد WMO · NOAA',
        severity: 'critical',
        headline:
          'نينيو فائق نشط: مؤشر ONI عند +3.5 °م في نوفمبر 2026 وذروة متوقعة +4.1 °م في يناير 2027',
        summary:
          'اقتران احترار المحيط الهادئ القياسي مع IOD+ يؤدي إلى جفاف قاسي في جنوب أفريقيا مقابل فيضانات في شرق أفريقيا.',
        regionTag: 'المحيط الهندي والهادئ · SADC · COMESA',
        timestamp: 'تحديث WMO · نوفمبر 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'تنبيه الأسواق والطاقة: توقع وصول الأرز المحلي إلى 3,200 أرياري/كغ (+25.5%) ومراقبة السدود',
        summary:
          'ضغوط الشحن وتذبذب الأمطار ترفع أسعار الغذاء مطلع 2027 مع مراقبة التدفق الكهرومائي لشبكة أنديكاليكا.',
        regionTag: 'أنانالامانغا · ألاوترا · شبكة RIA',
        timestamp: 'تنبيه الأسعار · الربع الرابع 2026',
        targetSectionId: 'afrique',
      },
    ],
  },
  zh: {
    bannerBadge: '紧急气象预警 · SWIOCOF-15 / DGM / WMO',
    restoreLabel: 'SWIOCOF-15 与 WMO 活跃预警 (4)',
    detailsBtn: '公报详情',
    hideDetailsBtn: '收起',
    jumpActionLabel: '查看分析与应对 →',
    closeBannerAria: '折叠气候预警横幅',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · 印度洋委员会',
        severity: 'high',
        headline: '西南印度洋：气旋路径东移至罗德里格斯岛，马达加斯加东北部强降水超常',
        summary:
          '受超强厄尔尼诺（+3.5 °C）与正印度洋偶极子（IOD+）叠加影响，SAVA、阿纳兰吉罗福和迪亚纳地区 2026年11月至2027年1月存在洪涝及滑坡风险。',
        regionTag: '马达加斯加东北部与马斯克林群岛',
        timestamp: '活跃公报 · 2026年11月',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: '马达加斯加气象局 · BNGRC · FAO',
        severity: 'critical',
        headline: '大南部红色警报：降水亏缺 −30% 至 −50%，升温 +2 至 +4 °C（372万人面临暴露）',
        summary:
          '安博翁贝、齐翁贝、贝洛哈等南部地区面临严重干旱压力，已启动 Cash+ 现金救助及90天耐旱高粱/粟米播种方案。',
        regionTag: '安德罗伊 · 阿诺西 · 阿齐莫-安德雷法纳',
        timestamp: '旬报 · 2026年11月',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: '世界气象组织 WMO · NOAA CPC',
        severity: 'critical',
        headline: '超强厄尔尼诺持续：2026年11月 ONI 达 +3.5 °C，2027年1月峰值预计 +4.1 °C',
        summary:
          '赤道太平洋创纪录增温配合 IOD+ 正位相，触发南部非洲干旱与东非暴雨洪涝的极端分化。',
        regionTag: '印太海域 · SADC · COMESA',
        timestamp: 'WMO 更新 · 2026年11月',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline: '粮食与电力警报：塔那那利佛本地大米预计涨至 3,200 MGA/kg（+25.5%）',
        summary:
          '运费上涨及高原/阿劳特拉降雨异常推高2027年初粮价，同时水电主网 RIA 面临枯水流量压力。',
        regionTag: '阿纳拉芒加 · 阿劳特拉 · RIA电网',
        timestamp: '市场预警 · 2026 Q4',
        targetSectionId: 'afrique',
      },
    ],
  },
  pt: {
    bannerBadge: 'ALERTA URGENTE · SWIOCOF-15 / DGM / OMM',
    restoreLabel: 'Alertas Ativos SWIOCOF-15 e OMM (4)',
    detailsBtn: 'Detalhes do boletim',
    hideDetailsBtn: 'Ocultar',
    jumpActionLabel: 'Ver análise e medidas →',
    closeBannerAria: 'Recolher faixa de alertas climáticos',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · COI / CycloneOI',
        severity: 'high',
        headline:
          'Índico Sudoeste: trajetórias ciclônicas deslocadas para Leste (Rodrigues) e excesso de chuvas no Nordeste',
        summary:
          'Com El Niño (+3,5 °C) e IOD+ acoplados, prevê-se chuvas intensas precoces (Nov 2026 – Jan 2027) em SAVA, Analanjirofo e Diana com risco de cheias.',
        regionTag: 'Nordeste de Madagáscar e Mascarenhas',
        timestamp: 'Boletim ativo · Nov 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'Alerta Vermelho Grande Sul: déficit hídrico de −30% a −50% e calor de +2 a +4 °C (3,72 M expostos)',
        summary:
          'Ambovombe, Tsihombe, Beloha e Bekily enfrentam estresse severo. Ativação prioritária de Cash+ e sementes de sorgo de ciclo curto.',
        regionTag: 'Androy · Anosy · Atsimo-Andrefana',
        timestamp: 'Boletim decadal · Nov 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'OMM / WMO · NOAA CPC',
        severity: 'critical',
        headline:
          'Super El Niño ativo: índice ONI a +3,5 °C (Nov 2026), pico previsto de +4,1 °C em Jan 2027 com IOD+',
        summary:
          'O aquecimento recorde do Pacífico acoplado ao IOD+ provoca seca austral (SADC) contra cheias intensas na África Oriental (COMESA).',
        regionTag: 'Indo-Pacífico · SADC · COMESA',
        timestamp: 'Atualização OMM · Nov 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'Alerta Alimentar e Energético: arroz local projetado a 3.200 MGA/kg (+25,5%) e vigilância hídrica RIA',
        summary:
          'Pressões logísticas e chuvas irregulares pressionam os preços alimentares até fev 2027 e exigem cautela na rede hidroelétrica de Andekaleka.',
        regionTag: 'Analamanga · Alaotra · Rede RIA',
        timestamp: 'Alerta Preços · T4 2026',
        targetSectionId: 'afrique',
      },
    ],
  },
  hi: {
    bannerBadge: 'आपातकालीन चेतावनी · SWIOCOF-15 / DGM / WMO',
    restoreLabel: 'सक्रिय SWIOCOF-15 और WMO जलवायु अलर्ट (4)',
    detailsBtn: 'बुलेटिन विवरण',
    hideDetailsBtn: 'छिपाएँ',
    jumpActionLabel: 'विश्लेषण और उपाय देखें →',
    closeBannerAria: 'जलवायु चेतावनी बैनर बंद करें',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · IOC / CycloneOI',
        severity: 'high',
        headline:
          'दक्षिण-पश्चिम हिंद महासागर: चक्रवात पथ पूर्व (रॉड्रिग्स) की ओर खिसका और उत्तर-पूर्व में भारी बारिश',
        summary:
          'अल नीनो (+3.5 °C) और IOD+ के संयुक्त प्रभाव से SAVA, अनालांजिरोफो और डायना में बाढ़ और भूस्खलन का खतरा बढ़ा है।',
        regionTag: 'उत्तर-पूर्व मेडागास्कर और मास्कारेन',
        timestamp: 'सक्रिय बुलेटिन · नवंबर 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'ग्रैंड सुड रेड अलर्ट: −30% से −50% वर्षा कमी और +2 से +4 °C तापमान वृद्धि (3.72M लोग प्रभावित)',
        summary:
          'अम्बोवोम्बे, त्सिहोम्बे और बेलोहा जिलों में गंभीर सूखे का दबाव। Cash+ नकद सहायता और 90-दिवसीय ज्वार/बाजरा बुवाई सक्रिय।',
        regionTag: 'एंड्रॉय · अनोसी · अत्सिमो-एंद्रेफाना',
        timestamp: 'दशकीय बुलेटिन · नवंबर 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'WMO · NOAA CPC',
        severity: 'critical',
        headline:
          'सक्रिय सुपर अल नीनो: ONI सूचकांक +3.5 °C (नवंबर 2026), जनवरी 2027 में +4.1 °C शिखर अनुमानित',
        summary:
          'प्रशांत महासागर की रिकॉर्ड गर्मी और सकारात्मक IOD+ दक्षिणी अफ्रीका में सूखा तथा पूर्वी अफ्रीका (COMESA) में बाढ़ ला रही है।',
        regionTag: 'इंडो-पैसिफिक · SADC · COMESA',
        timestamp: 'WMO अपडेट · नवंबर 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'खाद्य एवं ऊर्जा चेतावनी: अंतानानारिवो में स्थानीय चावल 3,200 MGA/kg (+25.5%) व RIA जलविद्युत निगरानी',
        summary:
          'माल ढुलाई दबाव और अनियमित वर्षा 2027 की शुरुआत तक खाद्य कीमतों को बढ़ा रही है; अंदेकालेका बांध स्तर की सतत निगरानी।',
        regionTag: 'अनालामांगा · अलाओत्रा · RIA ग्रिड',
        timestamp: 'बाज़ार अलर्ट · Q4 2026',
        targetSectionId: 'afrique',
      },
    ],
  },
  ru: {
    bannerBadge: 'ЭКСТРЕННОЕ ПРЕДУПРЕЖДЕНИЕ · SWIOCOF-15 / DGM / WMO',
    restoreLabel: 'Активные оповещения SWIOCOF-15 и ВМО (4)',
    detailsBtn: 'Детали бюллетеня',
    hideDetailsBtn: 'Скрыть',
    jumpActionLabel: 'Открыть анализ и меры →',
    closeBannerAria: 'Свернуть панель оповещений',
    items: [
      {
        id: 'swiocof-cyclone',
        agency: 'SWIOCOF-15 · IOC / CycloneOI',
        severity: 'high',
        headline:
          'Юго-Запад Индийского океана: смещение траекторий циклонов на восток (Родригес) и ливни на северо-востоке',
        summary:
          'Под действием Эль-Ниньо (+3,5 °C) и IOD+ в регионах SAVA, Аналанджируфу и Диана ожидаются ранние интенсивные осадки (нояб. 2026 – янв. 2027).',
        regionTag: 'СВ Мадагаскар и Маскаренские о-ва',
        timestamp: 'Активный бюллетень · Ноябрь 2026',
        targetSectionId: 'madagascar',
      },
      {
        id: 'dgm-grand-sud',
        agency: 'Météo Madagascar (DGM) · BNGRC · FAO',
        severity: 'critical',
        headline:
          'Красный уровень Большой Юг: дефицит осадков −30%…−50% и жара +2…+4 °C (3,72 млн человек под угрозой)',
        summary:
          'Амбовомбе, Цихомбе, Белуха и Бекили испытывают острый водный дефицит. Задействованы выплаты Cash+ и сев скороспелого сорго (90 дней).',
        regionTag: 'Андрой · Аноси · Ациму-Андрефана',
        timestamp: 'Декадный бюллетень · Ноябрь 2026',
        targetSectionId: 'pertes-economiques',
      },
      {
        id: 'wmo-oni',
        agency: 'ВМО (WMO) · NOAA CPC',
        severity: 'critical',
        headline:
          'Супер Эль-Ниньо активен: индекс ONI +3,5 °C (нояб. 2026), прогнозируемый пик +4,1 °C в янв. 2027 при IOD+',
        summary:
          'Рекордное потепление Тихого океана в сочетании с IOD+ вызывает засуху на юге Африки (SADC) и наводнения в Восточной Африке (COMESA).',
        regionTag: 'Индо-Тихоокеанский регион · SADC · COMESA',
        timestamp: 'Обновление ВМО · Ноябрь 2026',
        targetSectionId: 'visualisations-recharts',
      },
      {
        id: 'fews-rice',
        agency: 'FEWS NET · OdR · ANMCC',
        severity: 'high',
        headline:
          'Продовольственный и энерго-сигнал: прогноз цен на рис в Антананариву 3 200 MGA/кг (+25,5%) и контроль ГЭС RIA',
        summary:
          'Логистические издержки и дефицит осадков на нагорье толкают цены вверх в начале 2027 года при повышенном контроле стока Андекалеки.',
        regionTag: 'Аналаманга · Алаотра · Сеть RIA',
        timestamp: 'Ценовой сигнал · IV кв. 2026',
        targetSectionId: 'afrique',
      },
    ],
  },
};

export function ClimateAlerts() {
  const { lang, worldLang, actions } = useLanguage();
  const {
    syncState,
    syncing,
    countdownLabel,
    hasLiveScrape,
    toggleMidnightAutoUpdate,
    runGlobalScrapeNow,
  } = useGlobalSync();
  const bundle = ALERTS_BY_LANG[worldLang];
  const rssCopy = RSS_UI_COPY[worldLang];
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [liveFeed, setLiveFeed] = useState<LiveFeedPayload | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);
  const isOnline = useOnlineStatus();
  const [cacheStatus, setCacheStatus] = useState<OfflineCacheStatus | null>(null);
  const [warmingCache, setWarmingCache] = useState(false);

  // Real-time meteorological RSS feed listener state (WMO, DGM, NOAA CPC, GDACS)
  const [rssPayload, setRssPayload] = useState<RssBulletinsPayload | null>(null);
  const [rssStreamStatus, setRssStreamStatus] = useState<'connected' | 'reconnecting' | 'offline'>(
    'reconnecting',
  );
  const [rssSyncing, setRssSyncing] = useState(false);
  const [showRssFeed, setShowRssFeed] = useState(false);
  const [rssCategoryFilter, setRssCategoryFilter] = useState<RssAgencyCategory>('all');

  const refreshCacheStatus = useCallback(async () => {
    const status = await getOfflineCacheStatus();
    setCacheStatus(status);
  }, []);

  const handleWarmCache = useCallback(async () => {
    setWarmingCache(true);
    try {
      const next = await warmCriticalDatasetsCache();
      setCacheStatus(next);
    } finally {
      setWarmingCache(false);
    }
  }, []);

  const loadLiveFeed = useCallback(async () => {
    setFeedLoading(true);
    try {
      const res = await fetch('/api/climate/live-feed');
      if (res.ok) {
        const json = (await res.json()) as LiveFeedPayload;
        setLiveFeed(json);
      }
    } catch {
      // Non-blocking: advisory banner still works smoothly even offline
    } finally {
      setFeedLoading(false);
    }
  }, []);

  const loadRssBulletins = useCallback(async () => {
    try {
      const res = await fetch('/api/climate/rss-bulletins');
      if (res.ok) {
        const json = (await res.json()) as RssBulletinsPayload;
        setRssPayload(json);
      }
    } catch {
      // Fallback to local verified bulletins if offline
      setRssPayload((prev) =>
        prev ?? {
          listenerActive: false,
          pollIntervalSec: 120,
          lastPolledIso: new Date().toISOString(),
          liveFeedsCount: 0,
          totalFeedsCount: 4,
          sources: [],
          bulletins: getBaselineAgencyBulletins(),
        },
      );
    }
  }, []);

  const syncRssNow = useCallback(async () => {
    if (rssSyncing) return;
    setRssSyncing(true);
    try {
      const res = await fetch('/api/climate/rss-bulletins/poll', { method: 'POST' });
      if (res.ok) {
        const json = (await res.json()) as RssBulletinsPayload;
        setRssPayload(json);
      }
    } catch {
      // Preserve existing bulletins when offline
    } finally {
      setRssSyncing(false);
    }
  }, [rssSyncing]);

  useEffect(() => {
    void loadLiveFeed();
    void loadRssBulletins();
    void refreshCacheStatus();
    window.addEventListener('enso-offline-cache-updated', refreshCacheStatus);
    return () => {
      window.removeEventListener('enso-offline-cache-updated', refreshCacheStatus);
    };
  }, [loadLiveFeed, loadRssBulletins, refreshCacheStatus]);

  useEffect(() => {
    if (!isOnline) {
      setRssStreamStatus('offline');
      return;
    }
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return;
    }

    setRssStreamStatus('reconnecting');
    const es = new EventSource('/api/climate/rss-stream');

    const handlePayload = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as RssBulletinsPayload;
        if (data && Array.isArray(data.bulletins)) {
          setRssPayload(data);
          setRssStreamStatus('connected');
        }
      } catch {
        // Ignore malformed frame
      }
    };

    es.onopen = () => {
      setRssStreamStatus('connected');
    };
    es.addEventListener('snapshot', handlePayload as EventListener);
    es.addEventListener('bulletins', handlePayload as EventListener);
    es.addEventListener('heartbeat', () => {
      setRssStreamStatus('connected');
    });
    es.onerror = () => {
      setRssStreamStatus(navigator.onLine ? 'reconnecting' : 'offline');
    };

    return () => {
      es.close();
    };
  }, [isOnline]);

  // Synchronize live WMO / agency RSS bulletins into the active alert banner carousel
  const rssAlertsForCarousel: ClimateAlertItem[] = (rssPayload?.bulletins ?? [])
    .filter((b) => b.isLiveXml)
    .slice(0, 4)
    .map((b) => ({
      id: `rss-${b.id}`,
      agency: `${b.shortCode} RSS`,
      severity: b.severity,
      headline: b.title,
      summary: b.summary,
      regionTag: b.regionTag,
      timestamp: b.publishedAtIso.slice(0, 16).replace('T', ' ') + ' UTC',
      targetSectionId: 'chronologie-alertes',
      externalUrl: b.link,
      isLiveRss: true,
    }));

  const synchronizedItems: ClimateAlertItem[] = [
    ...rssAlertsForCarousel,
    ...bundle.items,
  ];

  useEffect(() => {
    if (collapsed || expanded || showRssFeed) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % synchronizedItems.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [synchronizedItems.length, collapsed, expanded, showRssFeed]);

  const active = synchronizedItems[activeIndex % synchronizedItems.length];
  const isCritical = active.severity === 'critical';

  const allRssBulletins = rssPayload?.bulletins ?? getBaselineAgencyBulletins();
  const filteredRssBulletins =
    rssCategoryFilter === 'all'
      ? allRssBulletins
      : allRssBulletins.filter((b) => b.category === rssCategoryFilter);

  const scrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (collapsed) {
    return (
      <div className="border-b border-amber-200 bg-amber-50/90 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="inline-flex items-center gap-2 font-semibold text-amber-950 hover:underline"
          >
            <Radio className="h-3.5 w-3.5 animate-pulse text-rose-700" aria-hidden="true" />
            <span>{bundle.restoreLabel}</span>
          </button>
          <span className="font-mono text-[11px] text-amber-900/80">{active.agency}</span>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label={bundle.bannerBadge}
      className={`border-b transition-colors ${
        isCritical
          ? 'border-rose-300 bg-[#FFF5F5] text-rose-950'
          : 'border-amber-300 bg-[#FFFBEB] text-amber-950'
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: High-Visibility Severity Signal + Headline */}
          <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded px-2 py-1 font-mono text-[10.5px] font-bold tracking-wider text-white ${
                isCritical ? 'bg-rose-700' : 'bg-amber-700'
              }`}
            >
              {isCritical ? (
                <AlertOctagon className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{bundle.bannerBadge}</span>
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs sm:text-[13px]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wide opacity-80">
                  [{active.agency}]
                </span>
                <p className="font-semibold leading-snug text-zinc-900">{active.headline}</p>
              </div>
            </div>
          </div>

          {/* Right: Stepper, Details Toggle, Dismiss */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 sm:justify-end">
            <div className="inline-flex items-center rounded border border-zinc-300/80 bg-white/80 p-0.5">
              <button
                type="button"
                aria-label="Previous alert"
                onClick={() =>
                  setActiveIndex(
                    (prev) => (prev - 1 + synchronizedItems.length) % synchronizedItems.length,
                  )
                }
                className="rounded p-1 text-zinc-700 hover:bg-zinc-100"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] font-semibold text-zinc-700 tabular-nums">
                {(activeIndex % synchronizedItems.length) + 1}/{synchronizedItems.length}
              </span>
              <button
                type="button"
                aria-label="Next alert"
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % synchronizedItems.length)
                }
                className="rounded p-1 text-zinc-700 hover:bg-zinc-100"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50 whitespace-nowrap"
            >
              {expanded ? bundle.hideDetailsBtn : bundle.detailsBtn}
            </button>

            <button
              type="button"
              onClick={() => scrollToTarget(active.targetSectionId)}
              className="inline-flex items-center gap-1 rounded bg-[#1E3A8A] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#172554] whitespace-nowrap"
            >
              <span>{bundle.jumpActionLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToTarget('chronologie-alertes')}
              className="inline-flex items-center gap-1 rounded border border-[#1E3A8A]/40 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5 whitespace-nowrap"
            >
              <span>{lang === 'fr' ? 'Chronologie 1982–2032 ↓' : 'Timeline 1982–2032 ↓'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label={bundle.closeBannerAria}
              className="rounded p-1 text-zinc-500 hover:bg-white/70 hover:text-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Open-Meteo Station Telemetry Strip */}
        {liveFeed && liveFeed.stations && liveFeed.stations.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#1E3A8A]">
                <Radio className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                <span>{actions.liveStationsLabel}:</span>
              </span>
              {liveFeed.stations.map((st) => (
                <div
                  key={st.id}
                  className="inline-flex items-center gap-1.5 rounded border border-zinc-200 bg-white/90 px-2 py-0.5 text-zinc-800"
                >
                  <span className="font-semibold">{st.label.split(' (')[0]}</span>
                  <span className="inline-flex items-center gap-0.5 font-mono tabular-nums text-rose-800">
                    <Thermometer className="h-3 w-3" aria-hidden="true" />
                    {st.tempC !== null ? `${st.tempC.toFixed(1)}°C` : '—'}
                  </span>
                  <span className="font-mono tabular-nums text-[#1E3A8A]">
                    {st.precipMm24h !== null ? `${st.precipMm24h.toFixed(1)}mm` : '—'}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-0.5 font-mono tabular-nums text-zinc-600">
                    <Wind className="h-3 w-3" aria-hidden="true" />
                    {st.windKmh !== null ? `${st.windKmh.toFixed(0)}km/h` : '—'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void loadLiveFeed()}
                disabled={feedLoading}
                className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-0.5 font-mono text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3 w-3 ${feedLoading ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{actions.refreshBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Midnight Auto-Update (00:00) + Live Web-Scrape Recalibration + 1-Click Climate Summary PDF Bar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleMidnightAutoUpdate()}
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10.5px] font-semibold transition-colors ${
                syncState.midnightAutoUpdateEnabled
                  ? 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>
                {syncState.midnightAutoUpdateEnabled ? actions.midnightAutoOn : actions.midnightAutoOff}
              </span>
              <span className="border-l border-current/30 pl-1.5 tabular-nums opacity-90">
                {countdownLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void runGlobalScrapeNow()}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 rounded border border-[#1E3A8A] bg-white px-2.5 py-1 font-mono text-[10.5px] font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A] hover:text-white disabled:opacity-60"
            >
              <Globe className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{syncing ? actions.scrapingNow : actions.scrapeNowBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const fn = exportClimateSummaryPdf({
                  lang,
                  horizonYear: 2027,
                  scenario: 's2',
                  currency: 'USD',
                  syncState,
                  liveStations: liveFeed?.stations,
                });
                setPdfNotice(fn);
                window.setTimeout(() => setPdfNotice(null), 4000);
              }}
              className="inline-flex items-center gap-1.5 rounded border border-rose-700 bg-rose-700 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-white transition-colors hover:bg-rose-800"
            >
              <FileDown className="h-3 w-3" aria-hidden="true" />
              <span>{actions.pdfSummaryBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => void handleWarmCache()}
              disabled={warmingCache || !isOnline}
              title="Service Worker Cache : 195 pays, 119 districts Madagascar, GeoJSON & télémétrie"
              className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-2.5 py-1 font-mono text-[10.5px] font-semibold text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-60"
            >
              <HardDriveDownload
                className={`h-3 w-3 ${warmingCache ? 'animate-pulse text-[#1E3A8A]' : 'text-emerald-700'}`}
                aria-hidden="true"
              />
              <span>
                {worldLang === 'fr'
                  ? `Cache Hors Ligne ${cacheStatus ? `${cacheStatus.cachedEndpointsCount}/${cacheStatus.totalCriticalEndpoints}` : '…'}`
                  : `Offline Cache ${cacheStatus ? `${cacheStatus.cachedEndpointsCount}/${cacheStatus.totalCriticalEndpoints}` : '…'}`}
              </span>
            </button>

            <button
              type="button"
              aria-expanded={showRssFeed}
              onClick={() => setShowRssFeed((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10.5px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                showRssFeed
                  ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                  : 'border-zinc-300 bg-white text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
              }`}
            >
              <Rss className="h-3 w-3" aria-hidden="true" />
              <span>
                {rssCopy.rssBtnLabel} ({allRssBulletins.length})
              </span>
            </button>

            {pdfNotice && (
              <span className="font-mono text-[10px] font-semibold text-emerald-800">
                ✓ {pdfNotice}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-zinc-700 tabular-nums">
            <span className="font-semibold text-[#1E3A8A]">
              ONI +{syncState.oniIndexObserved.toFixed(1)}°C
            </span>
            <span
              className={
                rssStreamStatus === 'connected'
                  ? 'text-emerald-700 font-semibold'
                  : rssStreamStatus === 'offline'
                    ? 'text-rose-700 font-semibold'
                    : 'text-amber-700 font-semibold'
              }
            >
              ·{' '}
              {rssStreamStatus === 'connected'
                ? rssCopy.streamLive
                : rssStreamStatus === 'offline'
                  ? rssCopy.streamOffline
                  : rssCopy.streamConnecting}
            </span>
            {syncState.gdacsAlertCount > 0 && (
              <span className="text-rose-800">· GDACS {syncState.gdacsAlertCount}</span>
            )}
            <span className="hidden md:inline text-zinc-600">
              · {hasLiveScrape ? actions.syncedCountriesLabel : syncState.webScrapeSummary}
            </span>
          </div>
        </div>

        {/* Expanded Real-Time Bulletin Card */}
        {expanded && (
          <div className="mt-2.5 rounded-md border border-zinc-200 bg-white p-3.5 text-xs text-zinc-700 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2">
              <div className="flex items-center gap-2 font-semibold text-zinc-900">
                <ShieldAlert
                  className={`h-4 w-4 ${isCritical ? 'text-rose-700' : 'text-amber-700'}`}
                  aria-hidden="true"
                />
                <span>{active.regionTag}</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 tabular-nums">{active.timestamp}</span>
            </div>
            <p className="mt-2 leading-relaxed">{active.summary}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {synchronizedItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded border px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                      idx === activeIndex % synchronizedItems.length
                        ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                        : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    {item.agency.split('·')[0].trim()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {active.externalUrl && (
                  <a
                    href={active.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
                  >
                    <span>{rssCopy.readBulletinLabel}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
                <a
                  href="#assistant-gemini"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget('assistant-gemini');
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-[#1E3A8A] hover:underline"
                >
                  <span>Google Search Live Grounding</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time WMO & National Agency RSS Bulletins Stream Drawer */}
        {showRssFeed && (
          <div className="mt-2.5 rounded-md border border-zinc-200 bg-white p-4 text-xs text-zinc-800">
            <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-serif text-sm font-semibold text-zinc-900">
                  <Rss className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                  <span>{rssCopy.panelTitle}</span>
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-600 tabular-nums">
                  <span
                    className={
                      rssStreamStatus === 'connected'
                        ? 'font-semibold text-emerald-700'
                        : rssStreamStatus === 'offline'
                          ? 'font-semibold text-rose-700'
                          : 'font-semibold text-amber-700'
                    }
                  >
                    {rssStreamStatus === 'connected'
                      ? rssCopy.streamLive
                      : rssStreamStatus === 'offline'
                        ? rssCopy.streamOffline
                        : rssCopy.streamConnecting}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {rssPayload?.liveFeedsCount ?? 0}/{rssPayload?.totalFeedsCount ?? 4}{' '}
                    {rssCopy.feedsLiveLabel}
                  </span>
                  {rssPayload?.lastPolledIso && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {rssCopy.lastPolledLabel}:{' '}
                        {rssPayload.lastPolledIso.slice(11, 19)} UTC
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: rssCopy.filterAll },
                    { id: 'wmo', label: rssCopy.filterWmo },
                    { id: 'national', label: rssCopy.filterNational },
                    { id: 'noaa', label: rssCopy.filterNoaa },
                    { id: 'gdacs', label: rssCopy.filterGdacs },
                  ] as Array<{ id: RssAgencyCategory; label: string }>
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRssCategoryFilter(tab.id)}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      rssCategoryFilter === tab.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => void syncRssNow()}
                  disabled={rssSyncing || !isOnline}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#1E3A8A] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A] hover:text-white disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${rssSyncing ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{rssSyncing ? rssCopy.syncingBtn : rssCopy.syncNowBtn}</span>
                </button>
              </div>
            </div>

            {filteredRssBulletins.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-500">{rssCopy.emptyFilterLabel}</p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {filteredRssBulletins.map((bulletin) => (
                  <li key={bulletin.id} className="py-3 first:pt-2.5 last:pb-0.5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-zinc-500 tabular-nums">
                          <span
                            className={`font-semibold ${
                              bulletin.severity === 'critical'
                                ? 'text-rose-700'
                                : bulletin.severity === 'high'
                                  ? 'text-amber-700'
                                  : 'text-[#1E3A8A]'
                            }`}
                          >
                            {bulletin.severity === 'critical'
                              ? '✖ CRITICAL'
                              : bulletin.severity === 'high'
                                ? '▲ HIGH'
                                : '● WATCH'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-zinc-800">{bulletin.shortCode}</span>
                          <span aria-hidden="true">·</span>
                          <span>{bulletin.regionTag}</span>
                          <span aria-hidden="true">·</span>
                          <span>{bulletin.publishedAtIso.slice(0, 16).replace('T', ' ')} UTC</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              bulletin.isLiveXml ? 'text-emerald-700 font-semibold' : 'text-zinc-500'
                            }
                          >
                            {bulletin.isLiveXml ? rssCopy.liveXmlLabel : rssCopy.baselineLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] font-semibold leading-snug text-zinc-900">
                          {bulletin.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                          {bulletin.summary}
                        </p>
                      </div>
                      <a
                        href={bulletin.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex shrink-0 items-center gap-1 self-start rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] hover:border-[#1E3A8A] sm:mt-0 whitespace-nowrap"
                      >
                        <span>{rssCopy.readBulletinLabel}</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
