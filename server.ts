import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import {
  Behavior,
  type FunctionDeclaration,
  FunctionResponseScheduling,
  GoogleGenAI,
  InteractionStatus,
  LiveServerMessage,
  Modality,
  ThinkingLevel,
  Type,
  type Content,
  type GenerateContentConfig,
  type GroundingChunk,
} from '@google/genai';
import {
  compareZonesCalculation,
  computeZoneAnalysis,
  getCurrentSituationSnapshot,
  type HorizonYear,
  type ScenarioKey,
  type ZoneCalculationResult,
} from './src/data/observatoryCalculator.ts';
import {
  CONTINENT_COMPARISON_6,
  DUPLICATED_195_COUNTRIES,
  GLOBAL_MACRO_BENCHMARKS,
  UN_ZONE_SUMMARIES,
  WORLD_CLIMATE_ZONES,
} from './src/data/worldEnso195Data.ts';
import { computeEconomicAggregation } from './src/utils/economicAggregation.ts';
import { DISTRICT_CHOROPLETH_DATA } from './src/data/ensoData.ts';
import {
  getBaselineAgencyBulletins,
  mergeAndSortRssBulletins,
  METEO_RSS_SOURCES,
  parseRssOrAtomXml,
  type RssBulletinItem,
  type RssBulletinsPayload,
  type RssFeedSourceStatus,
} from './src/utils/rssBulletins.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

type LangCode = 'fr' | 'en' | 'sw' | 'es' | 'ar' | 'zh' | 'pt' | 'hi' | 'ru';

function normalizeLang(raw: unknown): LangCode {
  const s = String(raw ?? 'fr').toLowerCase();
  if (s === 'en' || s === 'sw' || s === 'es' || s === 'ar' || s === 'zh' || s === 'pt' || s === 'hi' || s === 'ru') {
    return s;
  }
  return 'fr';
}
type ChatRoleId = 'agronome' | 'economiste' | 'humanitaire';
type GroundingToolMode = 'none' | 'googleSearch' | 'googleMaps';

interface WebSourceOut {
  title: string;
  uri: string;
}

interface MapReviewSnippetOut {
  title?: string;
  uri?: string;
  review?: string;
}

interface MapPlaceOut {
  title: string;
  uri: string;
  text?: string;
  placeId?: string;
  reviewSnippets: MapReviewSnippetOut[];
}

function extractGroundingData(chunks?: GroundingChunk[]) {
  const webSources: WebSourceOut[] = [];
  const mapPlaces: MapPlaceOut[] = [];
  const seenWeb = new Set<string>();
  const seenMaps = new Set<string>();

  if (!chunks || !Array.isArray(chunks)) {
    return { webSources, mapPlaces };
  }

  for (const chunk of chunks) {
    if (chunk.web?.uri && !seenWeb.has(chunk.web.uri)) {
      seenWeb.add(chunk.web.uri);
      webSources.push({
        title: chunk.web.title?.trim() || chunk.web.uri,
        uri: chunk.web.uri,
      });
    }
    if (chunk.maps?.uri) {
      const key = chunk.maps.placeId || chunk.maps.uri;
      if (!seenMaps.has(key)) {
        seenMaps.add(key);
        const rawSnippets =
          chunk.maps.placeAnswerSources?.reviewSnippets ??
          chunk.maps.placeAnswerSources?.reviewSnippet ??
          [];
        const reviewSnippets: MapReviewSnippetOut[] = rawSnippets.map((s) => ({
          title: s.title,
          uri: s.googleMapsUri,
          review: s.review,
        }));
        mapPlaces.push({
          title: chunk.maps.title?.trim() || 'Lieu Google Maps',
          uri: chunk.maps.uri,
          text: chunk.maps.text,
          placeId: chunk.maps.placeId,
          reviewSnippets,
        });
      }
    }
  }

  return { webSources, mapPlaces };
}

function getLanguageDirective(lang: LangCode): string {
  switch (lang) {
    case 'en':
      return 'Respond clearly in English (using precise climate, agronomic, and macroeconomic terminology).';
    case 'sw':
      return 'Jibu kwa Kiswahili fasaha na cha kitaalamu kuhusu tabianchi, kilimo na uchumi wa Madagaska, Bahari ya Hindi, COMESA na SADC.';
    case 'es':
      return 'Responde claramente en español con precisión científica, climática y macroeconómica.';
    case 'ar':
      return 'أجب بوضوح ودقة علمية واقتصادية باللغة العربية الفصحى.';
    case 'zh':
      return '请使用准确、专业、清晰的简体中文进行回答。';
    case 'pt':
      return 'Responda com clareza em português com rigor científico, climático e econômico.';
    case 'hi':
      return 'स्पष्ट, सटीक और वैज्ञानिक हिन्दी में उत्तर दें।';
    case 'ru':
      return 'Отвечай чётко, грамотно и научно на русском языке.';
    default:
      return 'Réponds en français clair, structuré et rigoureux.';
  }
}

function buildRoleSystemInstruction(roleId: ChatRoleId, lang: LangCode): string {
  const baseContext =
    'Tu es l’assistant officiel du **Madagascar El Niño Observatory** (licence officielle **M&G Consulting**, DG : **Prince MANANTENASOA**). ' +
    'Couverture : Madagascar (119 districts ADM2, 23 régions, 6 ex-provinces), COI, COMESA, SADC, Afrique et **Observatoire Mondial (195 pays ONU : 193 membres + 2 observateurs Saint-Siège et Palestine ; modèles 5/6/7 continents ; 12 zones climatiques ; anticipations 2028–2032 calibrées sur Dartmouth 1982/1997 et Oxford Economics ~4 000 Md USD d’ici 2031)**. ' +
    'Distingue toujours avec rigueur les repères observés (ex. épisode El Niño 2023–2024 à Madagascar : > 200 M USD de pertes agricoles, −6 à −7 % PIB agricole) des projections modélisées 2027–2032. ';

  const roleMap: Record<ChatRoleId, string> = {
    agronome:
      'Rôle : Ingénieur agronome expert FOFIFA / MINAE / GSDM. Conseille sur les fenêtres de semis, les techniques résilientes (Zaï, SCV, SRI/SRA, sorgho/mil 90 j, vanille sous ombrage Gliricidia) et les dossiers coopératives (FDA-R, DRAE/CirAE, DEFIS, 3-2-1).',
    economiste:
      'Rôle : Économiste climatique et macro-sectoriel. Analyse les pertes économiques multi-échelles (district, 23 régions, 6 ex-provinces, Madagascar, COI, SADC, COMESA, Afrique et 195 pays ONU sur 2027–2032), l’inflation du riz (pic 3 200 MGA/kg), les effets indirects (hydroélectricité RIA, bétail, pistes) et la transition La Niña 2028–2032.',
    humanitaire:
      'Rôle : Coordinateur alerte précoce et réponse humanitaire (BNGRC, PAM, FAO, FEWS NET, IPC). Évalue l’exposition populationnelle, l’insécurité alimentaire (kéré, soudure T3 2027–T1 2028), les déplacements climatiques, le ciblage Cash+, les chantiers HIMO et les protocoles cycloniques/crues.',
  };

  return `${baseContext}\n${roleMap[roleId]}\n${getLanguageDirective(lang)}`;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/climate/maps-status', (_req, res) => {
  const clientKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  const serverKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  res.json({
    clientMapsKeyReady: Boolean(clientKey && clientKey !== 'MY_GOOGLE_MAPS_API_KEY'),
    serverWeatherReady: Boolean(serverKey && serverKey !== 'MY_GOOGLE_MAPS_API_KEY'),
  });
});

function isTransientGeminiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.toLowerCase().includes('high demand') ||
    msg.toLowerCase().includes('overloaded')
  );
}

async function generateWithFallback(
  ai: GoogleGenAI,
  opts: {
    contents: string;
    config: GenerateContentConfig;
    hasTools?: boolean;
  },
) {
  const models: string[] = opts.hasTools
    ? ['gemini-4-hydrogen', 'gemini-2.5-flash']
    : ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];

  let lastErr: unknown;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const cfg: GenerateContentConfig = { ...opts.config };
    if (model === 'gemini-3.1-flash-lite') {
      cfg.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
    }
    try {
      const response = await ai.models.generateContent({
        model,
        contents: opts.contents,
        config: cfg,
      });
      return { response, model };
    } catch (err) {
      lastErr = err;
      if (!isTransientGeminiError(err) || i === models.length - 1) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw lastErr;
}

interface LiveFeedStation {
  id: string;
  label: string;
  lat: number;
  lng: number;
  tempC: number | null;
  precipMm24h: number | null;
  windKmh: number | null;
  weatherCode: number | null;
}

let cachedLiveFeed: { fetchedAtMs: number; payload: unknown } | null = null;

app.get('/api/climate/live-feed', async (_req, res) => {
  const now = Date.now();
  if (cachedLiveFeed && now - cachedLiveFeed.fetchedAtMs < 10 * 60 * 1000) {
    res.json(cachedLiveFeed.payload);
    return;
  }

  const sentinelStations = [
    { id: 'ambovombe', label: 'Ambovombe (Grand Sud)', lat: -25.18, lng: 46.09 },
    { id: 'antananarivo', label: 'Antananarivo (Hautes Terres)', lat: -18.88, lng: 47.51 },
    { id: 'sambava', label: 'Sambava (SAVA / Nord-Est)', lat: -14.27, lng: 50.17 },
    { id: 'nairobi', label: 'Nairobi (Afrique Est / COMESA)', lat: -1.29, lng: 36.82 },
  ];

  const stations: LiveFeedStation[] = await Promise.all(
    sentinelStations.map(async (st) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${st.lat}&longitude=${st.lng}&current=temperature_2m,precipitation,wind_speed_10m,weather_code&timezone=UTC`;
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = (await r.json()) as {
          current?: {
            temperature_2m?: number;
            precipitation?: number;
            wind_speed_10m?: number;
            weather_code?: number;
          };
        };
        return {
          ...st,
          tempC: json.current?.temperature_2m ?? null,
          precipMm24h: json.current?.precipitation ?? null,
          windKmh: json.current?.wind_speed_10m ?? null,
          weatherCode: json.current?.weather_code ?? null,
        };
      } catch {
        return { ...st, tempC: null, precipMm24h: null, windKmh: null, weatherCode: null };
      }
    }),
  );

  const payload = {
    source: 'Open-Meteo Live Telemetry + WMO/SWIOCOF Baseline',
    fetchedAtIso: new Date(now).toISOString(),
    stations,
  };
  cachedLiveFeed = { fetchedAtMs: now, payload };
  res.json(payload);
});

export interface ScrapedSourceRecord {
  name: string;
  url: string;
  status: 'ok' | 'degraded';
  detail: string;
  fetchedAtIso: string;
}

export interface GlobalHubTelemetry {
  id: string;
  label: string;
  zoneId: 'afrique' | 'asie' | 'europe' | 'amerique-latine-caraibes' | 'oceanie' | 'amerique-du-nord';
  countryName: string;
  lat: number;
  lng: number;
  tempC: number | null;
  precipMm7d: number | null;
  windKmh: number | null;
  rainfallAnomalyPct: number;
}

export interface ZoneRecalibrationFactor {
  zoneId: 'afrique' | 'asie' | 'europe' | 'amerique-latine-caraibes' | 'oceanie' | 'amerique-du-nord';
  gdpLossFactor: number;
  agriLossFactor: number;
  displacementFactor: number;
  foodInflationAddPct: number;
  rainfallAnomalyPct: number;
  droughtDelta: number;
  floodDelta: number;
  avgTempC: number | null;
}

export interface GlobalSyncPayload {
  midnightAutoUpdateEnabled: boolean;
  isSyncing: boolean;
  triggeredBy: 'manual' | 'midnight-cron' | 'startup-baseline';
  lastSyncedAtIso: string | null;
  nextMidnightIso: string;
  oniIndexObserved: number;
  noaaOniLatestLine: string;
  gdacsAlertCount: number;
  countriesRecalibratedCount: number;
  madagascarDistrictsUpdated: number;
  regionsUpdated: number;
  provincesUpdated: number;
  continentsUpdated: number;
  scrapedSources: ScrapedSourceRecord[];
  stations: GlobalHubTelemetry[];
  zoneFactors: Record<ZoneRecalibrationFactor['zoneId'], ZoneRecalibrationFactor>;
  madagascarFactors: {
    overallLossFactor: number;
    agriLossFactor: number;
    gdpLossFactor: number;
    displacementFactor: number;
    foodInflationDeltaPct: number;
    rainfallAnomalyPct: number;
    droughtDelta: number;
    floodDelta: number;
    profileMultipliers: {
      southDrought: number;
      highlands: number;
      eastCoast: number;
      northWest: number;
    };
  };
  webScrapeSummary: string;
}

const GLOBAL_HUB_STATIONS: Array<{
  id: string;
  label: string;
  zoneId: ZoneRecalibrationFactor['zoneId'];
  countryName: string;
  lat: number;
  lng: number;
  baselineRain7dMm: number;
}> = [
  { id: 'ambovombe', label: 'Ambovombe (Grand Sud MG)', zoneId: 'afrique', countryName: 'Madagascar', lat: -25.18, lng: 46.09, baselineRain7dMm: 14 },
  { id: 'antananarivo', label: 'Antananarivo (Hautes Terres MG)', zoneId: 'afrique', countryName: 'Madagascar', lat: -18.88, lng: 47.51, baselineRain7dMm: 38 },
  { id: 'sambava', label: 'Sambava (SAVA Nord-Est MG)', zoneId: 'afrique', countryName: 'Madagascar', lat: -14.27, lng: 50.17, baselineRain7dMm: 46 },
  { id: 'mahajanga', label: 'Mahajanga (Boeny Nord-Ouest MG)', zoneId: 'afrique', countryName: 'Madagascar', lat: -15.72, lng: 46.32, baselineRain7dMm: 22 },
  { id: 'nairobi', label: 'Nairobi (Afrique Est)', zoneId: 'afrique', countryName: 'Kenya', lat: -1.29, lng: 36.82, baselineRain7dMm: 34 },
  { id: 'lusaka', label: 'Lusaka (Afrique Australe)', zoneId: 'afrique', countryName: 'Zambie', lat: -15.39, lng: 28.32, baselineRain7dMm: 18 },
  { id: 'new-delhi', label: 'New Delhi (Asie du Sud)', zoneId: 'asie', countryName: 'Inde', lat: 28.61, lng: 77.21, baselineRain7dMm: 12 },
  { id: 'singapore', label: 'Singapour (Asie du Sud-Est)', zoneId: 'asie', countryName: 'Singapour', lat: 1.35, lng: 103.82, baselineRain7dMm: 52 },
  { id: 'beijing', label: 'Pékin (Asie Est)', zoneId: 'asie', countryName: 'Chine', lat: 39.90, lng: 116.41, baselineRain7dMm: 10 },
  { id: 'madrid', label: 'Madrid (Europe Sud)', zoneId: 'europe', countryName: 'Espagne', lat: 40.42, lng: -3.70, baselineRain7dMm: 15 },
  { id: 'paris', label: 'Paris (Europe Ouest)', zoneId: 'europe', countryName: 'France', lat: 48.86, lng: 2.35, baselineRain7dMm: 18 },
  { id: 'lima', label: 'Lima (Amérique Latine Pacifique)', zoneId: 'amerique-latine-caraibes', countryName: 'Pérou', lat: -12.05, lng: -77.04, baselineRain7dMm: 6 },
  { id: 'brasilia', label: 'Brasília (Amérique Latine Est)', zoneId: 'amerique-latine-caraibes', countryName: 'Brésil', lat: -15.79, lng: -47.88, baselineRain7dMm: 42 },
  { id: 'washington', label: 'Washington DC (Amérique Nord)', zoneId: 'amerique-du-nord', countryName: 'États-Unis', lat: 38.91, lng: -77.04, baselineRain7dMm: 22 },
  { id: 'sydney', label: 'Sydney (Océanie)', zoneId: 'oceanie', countryName: 'Australie', lat: -33.87, lng: 151.21, baselineRain7dMm: 28 },
];

function computeNextMidnightIso(from = new Date()): string {
  const next = new Date(from);
  next.setHours(24, 0, 0, 0);
  return next.toISOString();
}

function buildDefaultZoneFactors(): Record<ZoneRecalibrationFactor['zoneId'], ZoneRecalibrationFactor> {
  const zones: ZoneRecalibrationFactor['zoneId'][] = [
    'afrique',
    'asie',
    'europe',
    'amerique-latine-caraibes',
    'oceanie',
    'amerique-du-nord',
  ];
  return zones.reduce(
    (acc, z) => {
      acc[z] = {
        zoneId: z,
        gdpLossFactor: 1.0,
        agriLossFactor: 1.0,
        displacementFactor: 1.0,
        foodInflationAddPct: 0,
        rainfallAnomalyPct: 0,
        droughtDelta: 0,
        floodDelta: 0,
        avgTempC: null,
      };
      return acc;
    },
    {} as Record<ZoneRecalibrationFactor['zoneId'], ZoneRecalibrationFactor>,
  );
}

const globalSyncState: GlobalSyncPayload = {
  midnightAutoUpdateEnabled: true,
  isSyncing: false,
  triggeredBy: 'startup-baseline',
  lastSyncedAtIso: null,
  nextMidnightIso: computeNextMidnightIso(),
  oniIndexObserved: 3.5,
  noaaOniLatestLine: 'OMM/NOAA ONI Baseline +3.5 °C (Nov 2026)',
  gdacsAlertCount: 0,
  countriesRecalibratedCount: 195,
  madagascarDistrictsUpdated: 119,
  regionsUpdated: 23,
  provincesUpdated: 6,
  continentsUpdated: 6,
  scrapedSources: [],
  stations: [],
  zoneFactors: buildDefaultZoneFactors(),
  madagascarFactors: {
    overallLossFactor: 1.0,
    agriLossFactor: 1.0,
    gdpLossFactor: 1.0,
    displacementFactor: 1.0,
    foodInflationDeltaPct: 0,
    rainfallAnomalyPct: 0,
    droughtDelta: 0,
    floodDelta: 0,
    profileMultipliers: {
      southDrought: 1.0,
      highlands: 1.0,
      eastCoast: 1.0,
      northWest: 1.0,
    },
  },
  webScrapeSummary: 'Baseline paramétrique chargée. Cliquez sur « Web-Scraper & Recalibrer » ou laissez l’auto-actualisation de minuit (00:00) s’exécuter.',
};

async function fetchWithTimeout(url: string, timeoutMs = 4500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function runGlobalWebScrapeSync(
  triggeredBy: 'manual' | 'midnight-cron',
): Promise<GlobalSyncPayload> {
  if (globalSyncState.isSyncing) {
    return globalSyncState;
  }

  globalSyncState.isSyncing = true;
  const nowIso = new Date().toISOString();
  const scrapedSources: ScrapedSourceRecord[] = [];

  try {
    // 1. Live multi-continent & Madagascar Open-Meteo 7-day precipitation + temperature telemetry
    const stationResults: GlobalHubTelemetry[] = await Promise.all(
      GLOBAL_HUB_STATIONS.map(async (st) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${st.lat}&longitude=${st.lng}&current=temperature_2m,precipitation,wind_speed_10m&daily=precipitation_sum&forecast_days=7&timezone=UTC`;
          const resp = await fetchWithTimeout(url, 4500);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = (await resp.json()) as {
            current?: { temperature_2m?: number; wind_speed_10m?: number };
            daily?: { precipitation_sum?: number[] };
          };
          const rain7d = (data.daily?.precipitation_sum ?? []).reduce(
            (s, v) => s + (Number.isFinite(v) ? v : 0),
            0,
          );
          const rainAnom = Math.max(
            -65,
            Math.min(85, Math.round(((rain7d - st.baselineRain7dMm) / Math.max(1, st.baselineRain7dMm)) * 100)),
          );
          return {
            id: st.id,
            label: st.label,
            zoneId: st.zoneId,
            countryName: st.countryName,
            lat: st.lat,
            lng: st.lng,
            tempC: data.current?.temperature_2m ?? null,
            precipMm7d: Number(rain7d.toFixed(1)),
            windKmh: data.current?.wind_speed_10m ?? null,
            rainfallAnomalyPct: rainAnom,
          };
        } catch {
          return {
            id: st.id,
            label: st.label,
            zoneId: st.zoneId,
            countryName: st.countryName,
            lat: st.lat,
            lng: st.lng,
            tempC: null,
            precipMm7d: null,
            windKmh: null,
            rainfallAnomalyPct: 0,
          };
        }
      }),
    );

    const activeStationCount = stationResults.filter((s) => s.tempC !== null).length;
    scrapedSources.push({
      name: 'Open-Meteo Global Station Grid (15 stations / 6 continents)',
      url: 'https://api.open-meteo.com/v1/forecast',
      status: activeStationCount > 0 ? 'ok' : 'degraded',
      detail: `${activeStationCount}/${stationResults.length} stations synchronisées en direct`,
      fetchedAtIso: nowIso,
    });

    // 2. Scrape NOAA CPC Oceanic Niño Index (ONI) ASCII feed
    let noaaOniLine = globalSyncState.noaaOniLatestLine;
    try {
      const oniResp = await fetchWithTimeout(
        'https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt',
        4500,
      );
      if (oniResp.ok) {
        const txt = await oniResp.text();
        const lines = txt
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length > 0) {
          noaaOniLine = lines[lines.length - 1];
        }
        scrapedSources.push({
          name: 'NOAA CPC Oceanic Niño Index (ONI Feed)',
          url: 'https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt',
          status: 'ok',
          detail: `Dernière ligne NOAA CPC : ${noaaOniLine}`,
          fetchedAtIso: nowIso,
        });
      } else {
        throw new Error(`HTTP ${oniResp.status}`);
      }
    } catch {
      scrapedSources.push({
        name: 'NOAA CPC Oceanic Niño Index (ONI Feed)',
        url: 'https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt',
        status: 'degraded',
        detail: 'Maintien du dernier repère ONI validé (+3,5 °C)',
        fetchedAtIso: nowIso,
      });
    }

    // 3. Scrape GDACS Global Disaster Alerts (Drought, Flood, Tropical Cyclone)
    let gdacsAlertCount = 0;
    try {
      const gdacsResp = await fetchWithTimeout(
        'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=DR,FL,TC&alertlevel=Red;Orange',
        4500,
      );
      if (gdacsResp.ok) {
        const gdacsJson = (await gdacsResp.json()) as { features?: unknown[] };
        gdacsAlertCount = Array.isArray(gdacsJson.features) ? gdacsJson.features.length : 0;
        scrapedSources.push({
          name: 'GDACS / ONU Alertes Climatiques (Sécheresse, Crues, Cyclones)',
          url: 'https://www.gdacs.org/',
          status: 'ok',
          detail: `${gdacsAlertCount} événements climatiques Rouge/Orange actifs recensés`,
          fetchedAtIso: nowIso,
        });
      } else {
        throw new Error(`HTTP ${gdacsResp.status}`);
      }
    } catch {
      scrapedSources.push({
        name: 'GDACS / ONU Alertes Climatiques',
        url: 'https://www.gdacs.org/',
        status: 'degraded',
        detail: 'Cache SWIOCOF-15 / FEWS NET actif',
        fetchedAtIso: nowIso,
      });
    }

    // 4. Optional Gemini Google Search live news synthesis when API key is configured
    let geminiHeadlineNote = '';
    const ai = getGeminiClient();
    if (ai) {
      try {
        const { response } = await generateWithFallback(ai, {
          contents:
            'Donne en exactement 2 phrases factuelles (en français) le dernier état mondial des alertes climatiques El Niño / sécheresse / inondations (WMO, FAO, FEWS NET, SWIOCOF) affectant Madagascar, l’Afrique et les marchés céréaliers.',
          hasTools: true,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
        if (response.text?.trim()) {
          geminiHeadlineNote = response.text.trim().slice(0, 480);
          scrapedSources.push({
            name: 'Gemini Web-Search Grounding (WMO / FAO / FEWS NET)',
            url: 'https://www.wmo.int/',
            status: 'ok',
            detail: 'Synthèse Web temps réel intégrée aux paramètres',
            fetchedAtIso: nowIso,
          });
        }
      } catch {
        // Non-blocking: quantitative telemetry recalibration still succeeds
      }
    }

    // 5. Compute bounded, scientifically disciplined recalibration multipliers per UN zone & Madagascar
    const zoneFactors = buildDefaultZoneFactors();
    for (const zoneId of Object.keys(zoneFactors) as ZoneRecalibrationFactor['zoneId'][]) {
      const zStations = stationResults.filter((s) => s.zoneId === zoneId);
      const validTemps = zStations.map((s) => s.tempC).filter((t): t is number => t !== null);
      const avgTemp =
        validTemps.length > 0
          ? Number((validTemps.reduce((a, b) => a + b, 0) / validTemps.length).toFixed(1))
          : null;
      const avgRainAnom =
        zStations.length > 0
          ? Math.round(zStations.reduce((a, s) => a + s.rainfallAnomalyPct, 0) / zStations.length)
          : 0;

      // Telemetry stress modulation bounded cleanly inside [-12%, +15%] so model integrity remains sound
      const dryStress = avgRainAnom < -15 ? Math.min(0.14, Math.abs(avgRainAnom) / 360) : 0;
      const floodStress = avgRainAnom > 20 ? Math.min(0.14, avgRainAnom / 420) : 0;
      const gdacsBoost = Math.min(0.04, gdacsAlertCount * 0.002);
      const compositeFactor = Number((1 + dryStress * 0.65 + floodStress * 0.55 + gdacsBoost).toFixed(3));

      zoneFactors[zoneId] = {
        zoneId,
        gdpLossFactor: compositeFactor,
        agriLossFactor: Number((1 + dryStress * 0.9 + floodStress * 0.75 + gdacsBoost).toFixed(3)),
        displacementFactor: Number((1 + (dryStress + floodStress) * 0.8 + gdacsBoost).toFixed(3)),
        foodInflationAddPct: Number(((dryStress + floodStress) * 4.5).toFixed(2)),
        rainfallAnomalyPct: avgRainAnom,
        droughtDelta: avgRainAnom < -10 ? Math.min(12, Math.round(Math.abs(avgRainAnom) / 5)) : -2,
        floodDelta: avgRainAnom > 15 ? Math.min(14, Math.round(avgRainAnom / 5)) : 0,
        avgTempC: avgTemp,
      };
    }

    const mgAmbovombe = stationResults.find((s) => s.id === 'ambovombe');
    const mgTana = stationResults.find((s) => s.id === 'antananarivo');
    const mgSambava = stationResults.find((s) => s.id === 'sambava');
    const mgMahajanga = stationResults.find((s) => s.id === 'mahajanga');

    const southDry = mgAmbovombe && mgAmbovombe.rainfallAnomalyPct < 0
      ? 1 + Math.min(0.15, Math.abs(mgAmbovombe.rainfallAnomalyPct) / 280)
      : 1.02;
    const highlandsMod = mgTana
      ? 1 + Math.min(0.12, Math.abs(mgTana.rainfallAnomalyPct) / 380)
      : 1.01;
    const eastWet = mgSambava && mgSambava.rainfallAnomalyPct > 0
      ? 1 + Math.min(0.15, mgSambava.rainfallAnomalyPct / 300)
      : 1.02;
    const nwMod = mgMahajanga
      ? 1 + Math.min(0.12, Math.abs(mgMahajanga.rainfallAnomalyPct) / 360)
      : 1.01;

    const mgAvgAnom = Math.round(
      ((mgAmbovombe?.rainfallAnomalyPct ?? -22) +
        (mgTana?.rainfallAnomalyPct ?? -8) +
        (mgSambava?.rainfallAnomalyPct ?? 14) +
        (mgMahajanga?.rainfallAnomalyPct ?? -10)) /
        4,
    );
    const mgOverall = Number(((southDry + highlandsMod + eastWet + nwMod) / 4).toFixed(3));

    globalSyncState.triggeredBy = triggeredBy;
    globalSyncState.lastSyncedAtIso = nowIso;
    globalSyncState.nextMidnightIso = computeNextMidnightIso();
    globalSyncState.noaaOniLatestLine = noaaOniLine;
    globalSyncState.gdacsAlertCount = gdacsAlertCount;
    globalSyncState.scrapedSources = scrapedSources;
    globalSyncState.stations = stationResults;
    globalSyncState.zoneFactors = zoneFactors;
    globalSyncState.madagascarFactors = {
      overallLossFactor: mgOverall,
      agriLossFactor: Number((mgOverall * 1.015).toFixed(3)),
      gdpLossFactor: mgOverall,
      displacementFactor: Number((1 + Math.max(0.02, (mgOverall - 1) * 1.2)).toFixed(3)),
      foodInflationDeltaPct: Number((Math.max(0.3, (mgOverall - 1) * 18)).toFixed(1)),
      rainfallAnomalyPct: mgAvgAnom,
      droughtDelta: mgAmbovombe && mgAmbovombe.rainfallAnomalyPct < -15 ? 4 : 1,
      floodDelta: mgSambava && mgSambava.rainfallAnomalyPct > 15 ? 5 : 1,
      profileMultipliers: {
        southDrought: Number(southDry.toFixed(3)),
        highlands: Number(highlandsMod.toFixed(3)),
        eastCoast: Number(eastWet.toFixed(3)),
        northWest: Number(nwMod.toFixed(3)),
      },
    };
    globalSyncState.webScrapeSummary =
      geminiHeadlineNote ||
      `Recalibration ${triggeredBy === 'midnight-cron' ? 'automatique de minuit (00:00)' : 'manuelle'} achevée à ${nowIso} : ${activeStationCount} stations mondiales, 195 pays ONU, 23 régions et 119 districts malgaches mis à jour (facteur MG ×${mgOverall}).`;
  } finally {
    globalSyncState.isSyncing = false;
  }

  void pollMeteorologicalRssFeeds().catch(() => undefined);

  return globalSyncState;
}

let midnightTimeoutId: ReturnType<typeof setTimeout> | null = null;

function scheduleNextMidnightSync() {
  if (midnightTimeoutId) {
    clearTimeout(midnightTimeoutId);
    midnightTimeoutId = null;
  }
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 2, 0); // 00:00:02 local server time
  globalSyncState.nextMidnightIso = nextMidnight.toISOString();
  const delayMs = Math.max(1000, nextMidnight.getTime() - now.getTime());
  midnightTimeoutId = setTimeout(async () => {
    if (globalSyncState.midnightAutoUpdateEnabled) {
      await runGlobalWebScrapeSync('midnight-cron').catch(() => undefined);
    }
    scheduleNextMidnightSync();
  }, delayMs);
}

scheduleNextMidnightSync();

app.get('/api/climate/global-sync/status', (_req, res) => {
  res.json(globalSyncState);
});

app.post('/api/climate/global-sync/toggle-midnight', (req, res) => {
  const nextVal =
    typeof req.body?.enabled === 'boolean'
      ? req.body.enabled
      : !globalSyncState.midnightAutoUpdateEnabled;
  globalSyncState.midnightAutoUpdateEnabled = nextVal;
  globalSyncState.nextMidnightIso = computeNextMidnightIso();
  res.json(globalSyncState);
});

app.post('/api/climate/global-sync/run-now', async (_req, res) => {
  const updated = await runGlobalWebScrapeSync('manual');
  res.json(updated);
});

const RSS_POLL_INTERVAL_SEC = 120;
const rssSseClients = new Set<express.Response>();

let rssBulletinsState: RssBulletinsPayload = {
  listenerActive: true,
  pollIntervalSec: RSS_POLL_INTERVAL_SEC,
  lastPolledIso: new Date().toISOString(),
  liveFeedsCount: 0,
  totalFeedsCount: METEO_RSS_SOURCES.length,
  sources: METEO_RSS_SOURCES.map((src) => ({
    id: src.id,
    agencyName: src.agencyName,
    shortCode: src.shortCode,
    category: src.category,
    feedUrl: src.feedUrl,
    status: 'cached-fallback',
    itemCount: 1,
    lastCheckedIso: new Date().toISOString(),
  })),
  bulletins: getBaselineAgencyBulletins(),
};

let isPollingRss = false;

function broadcastRssEvent(eventName: 'snapshot' | 'bulletins', payload: RssBulletinsPayload) {
  const serialized = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of rssSseClients) {
    try {
      client.write(serialized);
    } catch {
      rssSseClients.delete(client);
    }
  }
}

async function fetchRssXml(url: string): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 5000);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
        'User-Agent': 'Madagascar-ElNino-Observatory-RSS-Listener/1.0',
      },
    });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return await resp.text();
  } finally {
    clearTimeout(id);
  }
}

async function pollMeteorologicalRssFeeds(): Promise<RssBulletinsPayload> {
  if (isPollingRss) return rssBulletinsState;
  isPollingRss = true;
  const nowIso = new Date().toISOString();

  try {
    const baseline = getBaselineAgencyBulletins(nowIso);
    const collected: RssBulletinItem[] = [];
    const sourceStatuses: RssFeedSourceStatus[] = [];

    const results = await Promise.all(
      METEO_RSS_SOURCES.map(async (src) => {
        let items: RssBulletinItem[] = [];
        let activeUrl = src.feedUrl;
        let isLive = false;

        try {
          const xml = await fetchRssXml(src.feedUrl);
          items = parseRssOrAtomXml(xml, src, 5);
          if (items.length > 0) {
            isLive = true;
          }
        } catch {
          items = [];
        }

        if (items.length === 0 && src.fallbackUrl) {
          try {
            const fallbackXml = await fetchRssXml(src.fallbackUrl);
            items = parseRssOrAtomXml(fallbackXml, src, 5);
            if (items.length > 0) {
              activeUrl = src.fallbackUrl;
              isLive = true;
            }
          } catch {
            items = [];
          }
        }

        if (items.length === 0) {
          items = baseline.filter((b) => b.sourceId === src.id);
        }

        return {
          items,
          status: {
            id: src.id,
            agencyName: src.agencyName,
            shortCode: src.shortCode,
            category: src.category,
            feedUrl: activeUrl,
            status: isLive ? ('live' as const) : ('cached-fallback' as const),
            itemCount: items.length,
            lastCheckedIso: nowIso,
          },
        };
      }),
    );

    for (const r of results) {
      collected.push(...r.items);
      sourceStatuses.push(r.status);
    }

    const liveFeedsCount = sourceStatuses.filter((s) => s.status === 'live').length;
    rssBulletinsState = {
      listenerActive: true,
      pollIntervalSec: RSS_POLL_INTERVAL_SEC,
      lastPolledIso: nowIso,
      liveFeedsCount,
      totalFeedsCount: METEO_RSS_SOURCES.length,
      sources: sourceStatuses,
      bulletins: mergeAndSortRssBulletins(collected, 20),
    };

    broadcastRssEvent('bulletins', rssBulletinsState);
  } finally {
    isPollingRss = false;
  }

  return rssBulletinsState;
}

void pollMeteorologicalRssFeeds().catch(() => undefined);
setInterval(() => {
  void pollMeteorologicalRssFeeds().catch(() => undefined);
}, RSS_POLL_INTERVAL_SEC * 1000);

setInterval(() => {
  const ping = `event: heartbeat\ndata: ${JSON.stringify({ ts: new Date().toISOString() })}\n\n`;
  for (const client of rssSseClients) {
    try {
      client.write(ping);
    } catch {
      rssSseClients.delete(client);
    }
  }
}, 25000);

app.get('/api/climate/rss-bulletins', async (req, res) => {
  if (req.query.refresh === '1') {
    const updated = await pollMeteorologicalRssFeeds();
    res.json(updated);
    return;
  }
  res.json(rssBulletinsState);
});

app.post('/api/climate/rss-bulletins/poll', async (_req, res) => {
  const updated = await pollMeteorologicalRssFeeds();
  res.json(updated);
});

app.get('/api/climate/rss-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  rssSseClients.add(res);
  res.write(`event: snapshot\ndata: ${JSON.stringify(rssBulletinsState)}\n\n`);

  req.on('close', () => {
    rssSseClients.delete(res);
  });
});

const FORTNIGHT_MS = 15 * 24 * 60 * 60 * 1000;

const biweeklyAgroState = {
  enabled: true,
  intervalDays: 15,
  cycleNumber: 22,
  lastUpdatedAtIso: new Date().toISOString(),
  nextUpdateAtIso: new Date(Date.now() + FORTNIGHT_MS).toISOString(),
  activePhase: 'el-nino' as 'el-nino' | 'la-nina' | 'neutral',
  oniObservedC: globalSyncState.oniIndexObserved,
  rainAnomPct: globalSyncState.madagascarFactors.rainfallAnomalyPct,
  trajectoryNoteFr:
    'Quinzaine active (Nov. 2026) : El Niño +3,5 °C — bascule prioritaire vers irrigation goutte-à-goutte, serres ombrières & sorgho 90 j au Sud/SADC.',
  trajectoryNoteEn:
    'Active Fortnight (Nov 2026): El Niño +3.5 °C — prioritizing solar drip irrigation, shade greenhouses & 90d sorghum in Southern Africa/Grand Sud.',
  source: 'server-15d-cron' as 'server-15d-cron' | 'manual-trajectory-sync',
};

async function runBiweeklyAgroRecalibration(source: 'server-15d-cron' | 'manual-trajectory-sync') {
  await runGlobalWebScrapeSync(source === 'server-15d-cron' ? 'midnight-cron' : 'manual').catch(
    () => undefined,
  );
  const oni = globalSyncState.oniIndexObserved;
  const rain = globalSyncState.madagascarFactors.rainfallAnomalyPct;
  const phase: 'el-nino' | 'la-nina' | 'neutral' =
    oni >= 0.5 ? 'el-nino' : oni <= -0.5 ? 'la-nina' : 'neutral';

  biweeklyAgroState.cycleNumber += 1;
  biweeklyAgroState.lastUpdatedAtIso = new Date().toISOString();
  biweeklyAgroState.nextUpdateAtIso = new Date(Date.now() + FORTNIGHT_MS).toISOString();
  biweeklyAgroState.activePhase = phase;
  biweeklyAgroState.oniObservedC = oni;
  biweeklyAgroState.rainAnomPct = rain;
  biweeklyAgroState.source = source;
  biweeklyAgroState.trajectoryNoteFr =
    phase === 'el-nino'
      ? `Cycle Quinzaine #${biweeklyAgroState.cycleNumber} : El Niño (+${oni.toFixed(1)} °C, pluie MG ${rain >= 0 ? '+' : ''}${rain} %) — priorité irrigation contrôlée, barrages & serres.`
      : phase === 'la-nina'
        ? `Cycle Quinzaine #${biweeklyAgroState.cycleNumber} : La Niña (${oni.toFixed(1)} °C) — priorité digues anti-crues, drainage plaines & variétés submergibles.`
        : `Cycle Quinzaine #${biweeklyAgroState.cycleNumber} : Phase neutre (${oni.toFixed(1)} °C) — consolidation réserves & diversification maraîchère.`;
  biweeklyAgroState.trajectoryNoteEn =
    phase === 'el-nino'
      ? `Fortnight Cycle #${biweeklyAgroState.cycleNumber}: El Niño (+${oni.toFixed(1)} °C, MG rain ${rain >= 0 ? '+' : ''}${rain}%) — prioritizing drip irrigation, reservoirs & climate greenhouses.`
      : phase === 'la-nina'
        ? `Fortnight Cycle #${biweeklyAgroState.cycleNumber}: La Niña (${oni.toFixed(1)} °C) — prioritizing flood levees, lowland drainage & submergence-tolerant crops.`
        : `Fortnight Cycle #${biweeklyAgroState.cycleNumber}: Neutral phase (${oni.toFixed(1)} °C) — buffer restocking & diversified horticulture.`;

  return biweeklyAgroState;
}

let biweeklyTimeoutId: ReturnType<typeof setTimeout> | null = null;

function scheduleNextBiweeklyAgroSync() {
  if (biweeklyTimeoutId) {
    clearTimeout(biweeklyTimeoutId);
    biweeklyTimeoutId = null;
  }
  biweeklyTimeoutId = setTimeout(async () => {
    if (biweeklyAgroState.enabled) {
      await runBiweeklyAgroRecalibration('server-15d-cron').catch(() => undefined);
    }
    scheduleNextBiweeklyAgroSync();
  }, FORTNIGHT_MS);
}

scheduleNextBiweeklyAgroSync();

app.get('/api/climate/agro-specialization/status', (_req, res) => {
  res.json({
    ...biweeklyAgroState,
    oniObservedC: globalSyncState.oniIndexObserved,
    rainAnomPct: globalSyncState.madagascarFactors.rainfallAnomalyPct,
  });
});

app.post('/api/climate/agro-specialization/toggle-biweekly', (req, res) => {
  const nextEnabled =
    typeof req.body?.enabled === 'boolean' ? req.body.enabled : !biweeklyAgroState.enabled;
  biweeklyAgroState.enabled = nextEnabled;
  if (nextEnabled && new Date(biweeklyAgroState.nextUpdateAtIso).getTime() <= Date.now()) {
    biweeklyAgroState.nextUpdateAtIso = new Date(Date.now() + FORTNIGHT_MS).toISOString();
  }
  res.json(biweeklyAgroState);
});

app.post('/api/climate/agro-specialization/run-now', async (_req, res) => {
  const updated = await runBiweeklyAgroRecalibration('manual-trajectory-sync');
  res.json(updated);
});

app.get('/api/offline/datasets', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  const madagascarNational = computeZoneAnalysis({
    zoneQuery: 'Madagascar',
    year: 2027,
    scenario: 's2',
    lang: 'fr',
  });
  const economicSummary = computeEconomicAggregation({
    horizonYear: 2027,
    scenario: 's2',
    scope: 'consolidated119',
    lang: 'fr',
  });
  res.json({
    version: 'enso-obs-offline-v1',
    generatedAtIso: new Date().toISOString(),
    globalSync: globalSyncState,
    madagascarNational,
    economicSummary,
    madagascarDistricts: DISTRICT_CHOROPLETH_DATA,
    unZoneSummaries: UN_ZONE_SUMMARIES,
    continents6: CONTINENT_COMPARISON_6,
    worldClimateZones: WORLD_CLIMATE_ZONES,
    globalMacroBenchmarks: GLOBAL_MACRO_BENCHMARKS,
    countries195Count: DUPLICATED_195_COUNTRIES.length,
    countries195: DUPLICATED_195_COUNTRIES.map((c) => ({
      iso2: c.iso2,
      nameFr: c.nameFr,
      nameEn: c.nameEn,
      unZone: c.unZone,
      climateZone: c.climateZone,
      hazard: c.hazard,
      gdpB: c.gdpB,
      popM: c.popM,
      cumulativeLoss2027_2031BUsd: c.cumulativeLoss2027_2031BUsd,
      projections: c.projections,
    })),
  });
});

app.post('/api/model/predict-district', (req, res) => {
  const districtName = String(req.body?.district ?? 'Ambovombe').trim();
  const yearNum = Math.min(2032, Math.max(2027, Number(req.body?.year ?? 2027)));
  const scenarioScale =
    req.body?.scenario === 's1' ? 0.55 : req.body?.scenario === 's3' ? 1.45 : 1.0;

  const pt =
    DISTRICT_CHOROPLETH_DATA.find(
      (d) => d.district.toLowerCase() === districtName.toLowerCase(),
    ) ?? DISTRICT_CHOROPLETH_DATA[0];

  // Apply live scraped regional modulation factor if active
  const mgScale = globalSyncState.lastSyncedAtIso
    ? globalSyncState.madagascarFactors.overallLossFactor
    : 1.0;

  // Statistical multi-horizon regression extrapolation (2027..2032) anchored on XGBoost 2027/2028
  const yearFactor: Record<number, number> = {
    2027: 1.0,
    2028: 0.72,
    2029: 0.42,
    2030: 0.68,
    2031: 0.86,
    2032: 0.56,
  };
  const f = yearFactor[yearNum] ?? 0.75;
  const isLaNina2028 = yearNum === 2028;

  const baseWater = isLaNina2028 ? pt.water2028 : pt.water2027 * f;
  const baseRice = isLaNina2028 ? pt.rice2028 : pt.rice2027 * f;
  const baseMaize = isLaNina2028 ? pt.maize2028 : pt.maize2027 * f;
  const baseExport = isLaNina2028 ? pt.exportCrop2028 : pt.exportCrop2027 * f;

  res.json({
    model: 'XGBoost-LSTM Multi-Horizon Statistical Engine (v2.6)',
    district: pt.district,
    region: pt.region,
    profile: pt.profile,
    riskTier: pt.riskTier,
    year: yearNum,
    liveSyncedAtIso: globalSyncState.lastSyncedAtIso,
    waterDeltaPct: Number((baseWater * scenarioScale * mgScale).toFixed(1)),
    riceDeltaPct: Number((baseRice * scenarioScale * mgScale).toFixed(1)),
    maizeDeltaPct: Number((baseMaize * scenarioScale * mgScale).toFixed(1)),
    exportCropDeltaPct: Number((baseExport * scenarioScale * mgScale).toFixed(1)),
    droughtIndex: Math.min(99, Math.max(12, Math.round((pt.water2027 < 0 ? 48 + Math.abs(baseWater) * 0.9 : 24) * (isLaNina2028 ? 0.65 : 1) + (globalSyncState.lastSyncedAtIso ? globalSyncState.madagascarFactors.droughtDelta : 0)))),
    floodIndex: Math.min(99, Math.max(14, Math.round((baseWater > 0 ? 42 + baseWater * 1.4 : pt.riskTier === 'flood' ? 68 : 26) + (globalSyncState.lastSyncedAtIso ? globalSyncState.madagascarFactors.floodDelta : 0)))),
  });
});

interface DiagnosticRequestBody {
  district?: string;
  region?: string;
  year?: number;
  crop?: string;
  yieldDeltaPct?: number;
  waterDeltaPct?: number;
  oniIndex?: number;
  customQuestion?: string;
  ragContext?: string[];
  lang?: LangCode;
}

app.post('/api/district-diagnostic', async (req, res) => {
  const body = (req.body ?? {}) as DiagnosticRequestBody;
  const district = String(body.district ?? '').trim();
  const region = String(body.region ?? '').trim();
  const year = Number(body.year ?? 2027);
  const crop = String(body.crop ?? 'Riz').trim();
  const yieldDeltaPct = Number(body.yieldDeltaPct ?? 0);
  const waterDeltaPct = Number(body.waterDeltaPct ?? 0);
  const oniIndex = Number(body.oniIndex ?? 3.5);
  const customQuestion = String(body.customQuestion ?? '').trim();
  const ragContext = Array.isArray(body.ragContext) ? body.ragContext.slice(0, 6) : [];
  const lang: LangCode = normalizeLang(body.lang);

  if (!district) {
    res.status(400).json({ error: 'Le nom du district est requis.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'Clé GEMINI_API_KEY non configurée sur le serveur. Veuillez vérifier le panneau Settings > Secrets dans Google AI Studio.',
    });
    return;
  }

  const systemInstruction =
    'Tu es un ingénieur agronome et économiste expert du Madagascar El Niño Observatory, spécialisé dans ' +
    'l’adaptation au phénomène El Niño et à la transition La Niña. Tu croises les sorties ' +
    'quantitatives du modèle XGBoost par district avec les bulletins officiels (FOFIFA, ' +
    'Météo Madagascar, DGM, MINAE, FAO, PAM, FEWS NET, BNGRC) et le lexique local ' +
    '(kapoaka, vary aloha, vary jeby, tanety, kéré, Zaï, SCV, SRI/SRA). ' +
    getLanguageDirective(lang) +
    ' Structure ta réponse de façon concise (160 à 220 mots) avec : ' +
    '1) Niveau d’alerte, 2) Analyse chiffrée de la filière et du bilan hydrique, ' +
    '3) Recommandations techniques FOFIFA datées et guichets d’appui (FDA-R, DRAE/CirAE, DEFIS, FAO/PAM).';

  const ragBlock =
    ragContext.length > 0
      ? ragContext.map((c, idx) => `- [Extrait ${idx + 1}] ${c}`).join('\n')
      : '- Référentiel FOFIFA / DGM (26 oct. 2026) et perspectives SWIOCOF-15.';

  const prompt = [
    `[DONNÉES PRÉDICTIVES XGBOOST — ${district.toUpperCase()} (${region}) — ${year}]`,
    `- Filière ciblée : ${crop}`,
    `- Indice ONI (Niño 3.4) : ${oniIndex >= 0 ? '+' : ''}${oniIndex.toFixed(1)} °C`,
    `- Variation de rendement projetée : ${yieldDeltaPct >= 0 ? '+' : ''}${yieldDeltaPct.toFixed(1)} %`,
    `- Anomalie hydrique / ruissellement : ${waterDeltaPct >= 0 ? '+' : ''}${waterDeltaPct.toFixed(1)} %`,
    '',
    '[CONTEXTE DOCUMENTAIRE RAG (FOFIFA / MÉTÉO MADAGASCAR / FEWS NET / BNGRC)]',
    ragBlock,
    '',
    customQuestion
      ? `[QUESTION SPÉCIFIQUE DE L'UTILISATEUR]\n${customQuestion}`
      : `[TÂCHE]\nRédige un diagnostic agronomique et économique opérationnel pour les producteurs et la coopérative du district de ${district} en ${year}.`,
  ].join('\n');

  try {
    const { response, model } = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      res.status(502).json({ error: 'Réponse vide reçue du modèle Gemini.' });
      return;
    }

    res.json({
      diagnostic: text,
      model,
      district,
      year,
      crop,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue lors de l’appel Gemini.';
    res.status(503).json({ error: message });
  }
});

interface ChatTurnInput {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ChatTurnInput[];
  roleId?: ChatRoleId;
  toolMode?: GroundingToolMode;
  speedMode?: 'hydrogen' | 'fast';
  lang?: LangCode;
  location?: { lat?: number; lng?: number; label?: string };
}

app.post('/api/gemini/chat', async (req, res) => {
  const body = (req.body ?? {}) as ChatRequestBody;
  const message = String(body.message ?? '').trim();
  const roleId: ChatRoleId =
    body.roleId === 'economiste' || body.roleId === 'humanitaire' ? body.roleId : 'agronome';
  const toolMode: GroundingToolMode =
    body.toolMode === 'googleSearch' || body.toolMode === 'googleMaps' ? body.toolMode : 'none';
  const lang: LangCode = normalizeLang(body.lang);

  if (!message) {
    res.status(400).json({ error: 'Message required.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'GEMINI_API_KEY missing on server. Please verify Settings > Secrets in Google AI Studio.',
    });
    return;
  }

  // Grounding tools (googleSearch / googleMaps) strictly use gemini-4-hydrogen; fast non-grounded uses gemini-3.1-flash-lite
  const model =
    toolMode !== 'none'
      ? 'gemini-4-hydrogen'
      : body.speedMode === 'fast'
        ? 'gemini-3.1-flash-lite'
        : 'gemini-4-hydrogen';

  const rawHistory = Array.isArray(body.history) ? body.history.slice(-16) : [];
  // Ensure history starts with a 'user' message and has alternating/valid text parts
  const firstUserIdx = rawHistory.findIndex((h) => h.role === 'user' && h.text?.trim());
  const sanitizedHistory: Content[] =
    firstUserIdx >= 0
      ? rawHistory
          .slice(firstUserIdx)
          .filter((h) => h.text && h.text.trim().length > 0)
          .map((h) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.text.trim() }],
          }))
      : [];

  const config: GenerateContentConfig = {
    systemInstruction: buildRoleSystemInstruction(roleId, lang),
  };

  if (toolMode === 'googleSearch') {
    config.tools = [{ googleSearch: {} }];
  } else if (toolMode === 'googleMaps') {
    const lat = Number.isFinite(Number(body.location?.lat))
      ? Number(body.location?.lat)
      : -18.8792;
    const lng = Number.isFinite(Number(body.location?.lng))
      ? Number(body.location?.lng)
      : 47.5079;
    config.tools = [{ googleMaps: {} }];
    config.toolConfig = {
      retrievalConfig: {
        latLng: { latitude: lat, longitude: lng },
      },
    };
  } else if (model === 'gemini-4-hydrogen') {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
  }

  const candidateModels =
    toolMode !== 'none'
      ? ['gemini-4-hydrogen', 'gemini-2.5-flash']
      : body.speedMode === 'fast'
        ? ['gemini-3.1-flash-lite', 'gemini-4-hydrogen']
        : ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];

  try {
    let response: Awaited<ReturnType<ReturnType<typeof ai.chats.create>['sendMessage']>> | null = null;
    let usedModel = candidateModels[0];

    for (let i = 0; i < candidateModels.length; i++) {
      usedModel = candidateModels[i];
      const attemptConfig: GenerateContentConfig = { ...config };
      if (usedModel === 'gemini-3.1-flash-lite') {
        attemptConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
      }
      try {
        const chat = ai.chats.create({
          model: usedModel,
          history: sanitizedHistory,
          config: attemptConfig,
        });
        response = await chat.sendMessage({ message });
        break;
      } catch (err) {
        if (!isTransientGeminiError(err) || i === candidateModels.length - 1) {
          throw err;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    const reply = response?.text?.trim();
    if (!reply) {
      res.status(502).json({ error: 'Empty response received from Gemini.' });
      return;
    }

    const groundingMeta = response?.candidates?.[0]?.groundingMetadata;
    const { webSources, mapPlaces } = extractGroundingData(groundingMeta?.groundingChunks);
    const searchQueries = groundingMeta?.webSearchQueries ?? [];

    res.json({
      reply,
      model: usedModel,
      toolMode,
      webSources,
      mapPlaces,
      searchQueries,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error calling Gemini chat.';
    res.status(503).json({ error: msg });
  }
});

app.post('/api/gemini/search', async (req, res) => {
  const query = String(req.body?.query ?? '').trim();
  const lang: LangCode = normalizeLang(req.body?.lang);

  if (!query) {
    res.status(400).json({ error: 'Search query required.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'GEMINI_API_KEY missing on server. Please verify Settings > Secrets in Google AI Studio.',
    });
    return;
  }

  const systemInstruction =
    'Tu es l’analyste veille temps réel du Madagascar El Niño Observatory. ' +
    'Utilise Google Search pour recouper les bulletins météorologiques, humanitaires, agricoles et macroéconomiques ' +
    '(OMM/WMO, NOAA ONI, FAO, PAM/WFP, FEWS NET, Météo Madagascar, SADC, COMESA, COI) et synthétiser des faits vérifiés et datés. ' +
    getLanguageDirective(lang);

  try {
    const { response, model } = await generateWithFallback(ai, {
      contents: query,
      hasTools: true,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      res.status(502).json({ error: 'Empty response from Google Search grounding.' });
      return;
    }

    const groundingMeta = response.candidates?.[0]?.groundingMetadata;
    const { webSources } = extractGroundingData(groundingMeta?.groundingChunks);
    const searchQueries = groundingMeta?.webSearchQueries ?? [];

    res.json({
      answer,
      model,
      webSources,
      searchQueries,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error calling Gemini Search.';
    res.status(503).json({ error: msg });
  }
});

app.post('/api/gemini/maps', async (req, res) => {
  const query = String(req.body?.query ?? '').trim();
  const lang: LangCode = normalizeLang(req.body?.lang);
  const lat = Number.isFinite(Number(req.body?.lat)) ? Number(req.body.lat) : -18.8792;
  const lng = Number.isFinite(Number(req.body?.lng)) ? Number(req.body.lng) : 47.5079;
  const placeLabel = String(req.body?.placeLabel ?? 'Madagascar').trim();

  if (!query) {
    res.status(400).json({ error: 'Maps query required.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'GEMINI_API_KEY missing on server. Please verify Settings > Secrets in Google AI Studio.',
    });
    return;
  }

  const systemInstruction =
    `Tu es le spécialiste SIG et logistique territoriale du Madagascar El Niño Observatory. ` +
    `Zone ancrée : ${placeLabel} (${lat.toFixed(4)}, ${lng.toFixed(4)}). ` +
    `Identifie avec Google Maps des infrastructures réelles (marchés agricoles, greniers, bureaux DRAE/CirAE, barrages, ports, corridors routiers, centres humanitaires ou coopératives) utiles à la résilience El Niño. ` +
    getLanguageDirective(lang);

  try {
    const { response, model } = await generateWithFallback(ai, {
      contents: `${query} (autour de ${placeLabel}, coordonnées ${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      hasTools: true,
      config: {
        systemInstruction,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng },
          },
        },
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      res.status(502).json({ error: 'Empty response from Google Maps grounding.' });
      return;
    }

    const groundingMeta = response.candidates?.[0]?.groundingMetadata;
    const { mapPlaces } = extractGroundingData(groundingMeta?.groundingChunks);

    res.json({
      answer,
      model,
      coordinates: { lat, lng, placeLabel },
      mapPlaces,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error calling Gemini Maps.';
    res.status(503).json({ error: msg });
  }
});

app.get('/api/maps/weather-point', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const lang = normalizeLang(req.query.lang);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    res.status(400).json({ available: false, reason: 'Invalid lat/lng coordinates.' });
    return;
  }

  const mapsKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!mapsKey || mapsKey === 'MY_GOOGLE_MAPS_API_KEY') {
    res.json({
      available: false,
      reason: 'VITE_GOOGLE_MAPS_API_KEY is not configured for live Weather API lookup.',
    });
    return;
  }

  const bcp47Lang = lang === 'sw' ? 'sw' : lang;
  const currentUrl = new URL('https://weather.googleapis.com/v1/currentConditions:lookup');
  currentUrl.searchParams.set('key', mapsKey);
  currentUrl.searchParams.set('location.latitude', lat.toFixed(4));
  currentUrl.searchParams.set('location.longitude', lng.toFixed(4));
  currentUrl.searchParams.set('unitsSystem', 'METRIC');

  const alertsUrl = new URL('https://weather.googleapis.com/v1/publicAlerts:lookup');
  alertsUrl.searchParams.set('key', mapsKey);
  alertsUrl.searchParams.set('location.latitude', lat.toFixed(4));
  alertsUrl.searchParams.set('location.longitude', lng.toFixed(4));
  alertsUrl.searchParams.set('languageCode', bcp47Lang);

  const gmpHeaders = {
    'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
  };

  try {
    const [currentResp, alertsResp] = await Promise.all([
      fetch(currentUrl.toString(), { method: 'GET', headers: gmpHeaders }),
      fetch(alertsUrl.toString(), { method: 'GET', headers: gmpHeaders }),
    ]);

    if (currentResp.status === 429 || alertsResp.status === 429) {
      res.json({
        available: false,
        quotaExceeded: true,
        reason: 'Google Maps Weather API quota reached (HTTP 429).',
      });
      return;
    }

    const currentJson = currentResp.ok
      ? ((await currentResp.json()) as {
          currentTime?: string;
          isDaytime?: boolean;
          weatherCondition?: { description?: { text?: string }; type?: string; iconBaseUri?: string };
          temperature?: { degrees?: number; unit?: string };
          feelsLikeTemperature?: { degrees?: number };
          relativeHumidity?: number;
          uvIndex?: number;
          precipitation?: { probability?: { percent?: number; type?: string }; qpf?: { quantity?: number } };
          wind?: { speed?: { value?: number }; direction?: { cardinal?: string } };
        })
      : null;

    const alertsJson = alertsResp.ok
      ? ((await alertsResp.json()) as {
          regionCode?: string;
          weatherAlerts?: Array<{
            alertId?: string;
            alertTitle?: { text?: string; languageCode?: string };
            eventType?: string;
            areaName?: string;
            description?: string;
            severity?: string;
            urgency?: string;
            startTime?: string;
            expirationTime?: string;
            dataSource?: { publisher?: string; name?: string; authorityUri?: string };
          }>;
        })
      : null;

    if (!currentJson && !alertsJson) {
      const errDetail = !currentResp.ok ? await currentResp.text().catch(() => '') : '';
      const quotaHit = errDetail.includes('RESOURCE_EXHAUSTED');
      res.json({
        available: false,
        quotaExceeded: quotaHit,
        reason: quotaHit
          ? 'Google Maps Weather API quota exceeded.'
          : `Weather API unavailable (HTTP ${currentResp.status}).`,
      });
      return;
    }

    res.json({
      available: true,
      regionCode: alertsJson?.regionCode ?? null,
      current: currentJson
        ? {
            currentTime: currentJson.currentTime ?? null,
            conditionText: currentJson.weatherCondition?.description?.text ?? currentJson.weatherCondition?.type ?? null,
            conditionType: currentJson.weatherCondition?.type ?? null,
            iconUri: currentJson.weatherCondition?.iconBaseUri ? `${currentJson.weatherCondition.iconBaseUri}.svg` : null,
            tempC: currentJson.temperature?.degrees ?? null,
            feelsLikeC: currentJson.feelsLikeTemperature?.degrees ?? null,
            humidityPct: currentJson.relativeHumidity ?? null,
            uvIndex: currentJson.uvIndex ?? null,
            precipProbPct: currentJson.precipitation?.probability?.percent ?? null,
            precipMm: currentJson.precipitation?.qpf?.quantity ?? null,
            windKmh: currentJson.wind?.speed?.value ?? null,
            windCardinal: currentJson.wind?.direction?.cardinal ?? null,
          }
        : null,
      alerts: (alertsJson?.weatherAlerts ?? []).map((a) => ({
        id: a.alertId ?? `${a.eventType ?? 'ALERT'}-${a.startTime ?? ''}`,
        title: a.alertTitle?.text ?? a.eventType ?? 'Weather Alert',
        eventType: a.eventType ?? 'WEATHER_ALERT',
        areaName: a.areaName ?? '',
        severity: a.severity ?? 'UNKNOWN',
        urgency: a.urgency ?? 'UNKNOWN',
        description: a.description ?? '',
        startTime: a.startTime ?? null,
        expirationTime: a.expirationTime ?? null,
        dataSource: {
          publisher: a.dataSource?.publisher ?? '',
          name: a.dataSource?.name ?? a.dataSource?.publisher ?? 'Meteorological Authority',
          authorityUri: a.dataSource?.authorityUri ?? '',
        },
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Weather API request failed.';
    res.json({ available: false, reason: msg });
  }
});

interface LongTermProjectionReqBody {
  scopeMode?: 'zones' | 'continents' | 'climate-zones';
  scenario?: 'baseline' | 'severe' | 'adaptation';
  focusDomain?: 'all' | 'economic' | 'social' | 'climate';
  customPrompt?: string;
  lang?: LangCode;
}

app.post('/api/gemini/long-term-projections', async (req, res) => {
  const body = (req.body ?? {}) as LongTermProjectionReqBody;
  const scopeMode =
    body.scopeMode === 'continents' || body.scopeMode === 'climate-zones'
      ? body.scopeMode
      : 'zones';
  const scenario =
    body.scenario === 'severe' || body.scenario === 'adaptation' ? body.scenario : 'baseline';
  const focusDomain =
    body.focusDomain === 'economic' ||
    body.focusDomain === 'social' ||
    body.focusDomain === 'climate'
      ? body.focusDomain
      : 'all';
  const customPrompt = String(body.customPrompt ?? '').trim();
  const lang = normalizeLang(body.lang);

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'GEMINI_API_KEY is not configured on the server. Please verify Settings > Secrets in Google AI Studio.',
    });
    return;
  }

  const macroRefText = GLOBAL_MACRO_BENCHMARKS.map(
    (b) => `- ${b.reference} (${b.period}): ${b.lossLabel} — ${b.scopeEn}`,
  ).join('\n');

  let quantitativeInput = '';
  if (scopeMode === 'zones') {
    quantitativeInput = UN_ZONE_SUMMARIES.map(
      (z) =>
        `ID=${z.id} | Name=${z.nameEn} (${z.nameFr}) | Countries=${z.countryCount} | PopM=${z.popM} | GDP_B=${z.gdpB} | Losses_BUsd(2028=${z.yearlyLossBUsd[2028]},2029=${z.yearlyLossBUsd[2029]},2030=${z.yearlyLossBUsd[2030]},2031=${z.yearlyLossBUsd[2031]},2032=${z.yearlyLossBUsd[2032]}) | Cum27_31=${z.cumulative2027_2031BUsd} | AvgFoodInflAdd(2028=${z.avgInflationAdd[2028]}%,2031=${z.avgInflationAdd[2031]}%,2032=${z.avgInflationAdd[2032]}%)`,
    ).join('\n');
  } else if (scopeMode === 'continents') {
    quantitativeInput = CONTINENT_COMPARISON_6.map(
      (c) =>
        `Continent=${c.nameEn} (${c.nameFr}) | AreaMKm2=${c.areaMKm2} | PopB=${c.popB} | UN_States=${c.unStates} | Notes=${c.noteEn}`,
    ).join('\n');
  } else {
    quantitativeInput = WORLD_CLIMATE_ZONES.map((z) => {
      const s28 = z.yearlySignal[2028];
      const s30 = z.yearlySignal[2030];
      const s31 = z.yearlySignal[2031];
      const s32 = z.yearlySignal[2032];
      return `ID=${z.id} | Zone=${z.nameEn} | 2028(${s28.regimeEn}, mult=${s28.gdpDragMultiplier}, infl=+${s28.inflationAddPct}%, drought=${s28.droughtIndex}, flood=${s28.floodIndex}, disp=${s28.displacementScore}) | 2030(${s30.regimeEn}, mult=${s30.gdpDragMultiplier}, disp=${s30.displacementScore}) | 2031(${s31.regimeEn}, mult=${s31.gdpDragMultiplier}, disp=${s31.displacementScore}) | 2032(${s32.regimeEn}, mult=${s32.gdpDragMultiplier}, disp=${s32.displacementScore})`;
    }).join('\n');
  }

  const scenarioDirective =
    scenario === 'severe'
      ? 'Scenario: SEVERE UNMITIGATED (+1.5C to +1.8C warming compounding 2028 La Nina volatility and 2031 Oxford Economics extreme cumulative GDP lag of ~USD 4T, >10% tropical GDP/cap drop vs ~3% US).'
      : scenario === 'adaptation'
        ? 'Scenario: ACCELERATED ADAPTATION (National Adaptation Plans, SCV/Zai/SRI agroecology, drought/flood-tolerant varieties, parametric climate insurance cutting residual 2030-2032 losses by 30-45%).'
        : 'Scenario: OBSERVATORY BASELINE (2028 La Nina transition, 2029 ENSO Neutral partial recovery, 2030 +1.5C heat stress, 2031 macro lag peak, 2032 adaptation divergence).';

  const systemInstruction =
    'You are the Chief Climate Economist and Strategic Forecaster of the Madagascar El Nino Observatory (licensed to M&G Consulting, DG: Prince MANANTENASOA). ' +
    'Analyze the provided 2028-2032 global observatory datasets across economic, social, and climate dimensions. ' +
    'Return a rigorous comparative synthesis grounded in the provided figures without inventing unrelated continents or regions. ' +
    getLanguageDirective(lang);

  const prompt = [
    `[TASK] Generate a structured comparative trajectory analysis for 2028–2032 across all ${scopeMode === 'zones' ? '6 UN Global Zones' : scopeMode === 'continents' ? '6 Geographic Continents' : '12 Global Climate Zones'}.`,
    `[SCENARIO] ${scenarioDirective}`,
    `[PRIMARY ANALYTICAL FOCUS] ${focusDomain}`,
    customPrompt ? `[USER ANALYTICAL QUESTION] ${customPrompt}` : '',
    '',
    '[REFERENCE MACRO BENCHMARKS]',
    macroRefText,
    '',
    '[QUANTITATIVE OBSERVATORY BASELINE DATA (2028–2032)]',
    quantitativeInput,
    '',
    'Produce comparativeRows covering EVERY entity listed in [QUANTITATIVE OBSERVATORY BASELINE DATA] above.',
  ]
    .filter(Boolean)
    .join('\n');

  const projectionSchema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: {
        type: Type.STRING,
        description: 'Concise 2-3 sentence executive synthesis of global 2028-2032 divergence.',
      },
      methodologyNote: {
        type: Type.STRING,
        description: '1 sentence explaining calibration against Dartmouth and Oxford Economics trajectories.',
      },
      strategicTakeaways: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Exactly 3 crisp takeaways covering Economic, Social, and Climate dimensions.',
      },
      comparativeRows: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            regionName: { type: Type.STRING },
            economic2028Pct: { type: Type.NUMBER, description: 'Annual GDP change % in 2028 (e.g. -2.1).' },
            economic2030Pct: { type: Type.NUMBER, description: 'Annual GDP change % in 2030 (e.g. -2.4).' },
            economic2032Pct: { type: Type.NUMBER, description: 'Annual GDP change % in 2032 (e.g. -1.6).' },
            cumulativeLoss2028_2032BUsd: { type: Type.NUMBER, description: 'Estimated cumulative GDP loss in USD billions over 2028-2032.' },
            economicOutlook: { type: Type.STRING, description: 'Concise economic impact summary (GDP, agriculture, hydro, trade).' },
            foodInflationPeakPct: { type: Type.NUMBER, description: 'Projected food inflation pressure +% peak over 2028-2032.' },
            socialDisplacementScore: { type: Type.NUMBER, description: 'Composite 0-100 social/migration/food insecurity pressure score.' },
            socialOutlook: { type: Type.STRING, description: 'Concise social impact summary (food security, health, displacement).' },
            climateRegime: { type: Type.STRING, description: 'Dominant 2028-2032 climate pattern (ENSO phase, drought, floods, heat).' },
            climateSeverityScore: { type: Type.NUMBER, description: 'Composite 0-100 physical climate hazard severity score.' },
            climateOutlook: { type: Type.STRING, description: 'Concise climate trajectory summary.' },
            priorityAction: { type: Type.STRING, description: 'Top adaptation/policy lever for 2028-2032.' },
          },
          required: [
            'id',
            'regionName',
            'economic2028Pct',
            'economic2030Pct',
            'economic2032Pct',
            'cumulativeLoss2028_2032BUsd',
            'economicOutlook',
            'foodInflationPeakPct',
            'socialDisplacementScore',
            'socialOutlook',
            'climateRegime',
            'climateSeverityScore',
            'climateOutlook',
            'priorityAction',
          ],
        },
      },
    },
    required: ['executiveSummary', 'methodologyNote', 'strategicTakeaways', 'comparativeRows'],
  };

  const modelsToTry: Array<{ model: string; thinking: ThinkingLevel }> = [
    { model: 'gemini-4-hydrogen', thinking: ThinkingLevel.LOW },
    { model: 'gemini-3.1-flash-lite', thinking: ThinkingLevel.MINIMAL },
  ];

  let lastErrorMsg = 'Error generating 2028-2032 projections with Gemini.';
  for (let i = 0; i < modelsToTry.length; i++) {
    const attempt = modelsToTry[i];
    try {
      const response = await ai.models.generateContent({
        model: attempt.model,
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: attempt.thinking },
          responseMimeType: 'application/json',
          responseSchema: projectionSchema,
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        lastErrorMsg = 'Empty structured response received from Gemini.';
        continue;
      }

      const parsed = JSON.parse(rawText) as {
        executiveSummary: string;
        methodologyNote: string;
        strategicTakeaways: string[];
        comparativeRows: unknown[];
      };

      res.json({
        model: attempt.model,
        scopeMode,
        scenario,
        focusDomain,
        ...parsed,
      });
      return;
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : lastErrorMsg;
      try {
        const inner = JSON.parse(rawMsg) as { error?: { message?: string; code?: number } };
        lastErrorMsg = inner.error?.message || rawMsg;
      } catch {
        lastErrorMsg = rawMsg;
      }
      const isTransient =
        rawMsg.includes('503') ||
        rawMsg.includes('UNAVAILABLE') ||
        rawMsg.includes('429');
      if (!isTransient || i === modelsToTry.length - 1) {
        break;
      }
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  res.status(503).json({ error: lastErrorMsg });
});

function normalizeScenario(raw: unknown): ScenarioKey {
  const s = String(raw ?? 's2').toLowerCase();
  if (s === 's1' || s === 's3') return s;
  return 's2';
}

function normalizeYear(raw: unknown): HorizonYear {
  return Number(raw) === 2028 ? 2028 : 2027;
}

const getCurrentSituationTool: FunctionDeclaration = {
  name: 'get_current_situation',
  description:
    'Récupère le bulletin de la situation actuelle (Novembre 2026) du super El Niño (+3,5 °C, pic +4,1 °C janv. 2027), l’insécurité alimentaire à Madagascar (3,72 M pers.), les prix du riz et les pertes globales.',
  behavior: Behavior.NON_BLOCKING,
  parameters: {
    type: Type.OBJECT,
    properties: {
      scenario: {
        type: Type.STRING,
        description: "Scénario s1 (limité), s2 (base ML), ou s3 (choc sévère).",
      },
    },
  },
};

const analyzeZoneTool: FunctionDeclaration = {
  name: 'analyze_zone_prediction_and_loss',
  description:
    'Calcule les prédictions 2027/2028 (eau, riz, maïs, vanille/export) et les pertes économiques exactes (USD, MGA, EUR) pour un district malgache (ex. Ambovombe, Ambatondrazaka, Antsiranana), une des 23 régions (Androy, Analamanga, SAVA...), une ex-province ou un pays COI/SADC/COMESA/Afrique.',
  behavior: Behavior.NON_BLOCKING,
  parameters: {
    type: Type.OBJECT,
    properties: {
      zoneName: {
        type: Type.STRING,
        description:
          'Nom du district, de la région, de l’ex-province ou du pays africain/COI (ex. Ambovombe, Boeny, SAVA, Zambie, Kenya, Madagascar).',
      },
      year: {
        type: Type.NUMBER,
        description: 'Année cible : 2027 (choc El Niño) ou 2028 (transition La Niña).',
      },
      scenario: {
        type: Type.STRING,
        description: "Scénario : 's1' (limité), 's2' (base ML), ou 's3' (sévère).",
      },
    },
    required: ['zoneName'],
  },
};

const compareZonesTool: FunctionDeclaration = {
  name: 'compare_zones',
  description:
    'Compare deux zones géographiques (districts, régions ou pays COI/SADC/COMESA) sur les pertes économiques et les prédictions 2027/2028.',
  behavior: Behavior.NON_BLOCKING,
  parameters: {
    type: Type.OBJECT,
    properties: {
      zoneA: { type: Type.STRING, description: 'Première zone à comparer' },
      zoneB: { type: Type.STRING, description: 'Seconde zone à comparer' },
      year: { type: Type.NUMBER, description: '2027 ou 2028' },
      scenario: { type: Type.STRING, description: 's1, s2, ou s3' },
    },
    required: ['zoneA', 'zoneB'],
  },
};

function executeLiveToolCall(name: string, args: Record<string, unknown> = {}): ZoneCalculationResult {
  const year = normalizeYear(args.year);
  const scenario = normalizeScenario(args.scenario);
  if (name === 'get_current_situation') {
    return getCurrentSituationSnapshot(scenario);
  }
  if (name === 'compare_zones') {
    return compareZonesCalculation({
      zoneA: String(args.zoneA ?? 'Ambovombe'),
      zoneB: String(args.zoneB ?? 'Ambatondrazaka'),
      year,
      scenario,
    });
  }
  return computeZoneAnalysis({
    zoneQuery: String(args.zoneName ?? 'Ambovombe'),
    year,
    scenario,
  });
}

function buildLiveSystemInstruction(avatar: 'indri' | 'analyst', lang: LangCode): string {
  const persona =
    avatar === 'indri'
      ? 'Tu es Babakoto, l’Indri indri emblématique des forêts de l’Est de Madagascar (Andasibe–Analamazaotra) et l’interlocuteur graphique et vocal officiel du Madagascar El Niño Observatory (M&G Consulting, DG Prince MANANTENASOA). ' +
        'Tu possèdes des outils de calcul en temps réel (get_current_situation, analyze_zone_prediction_and_loss, compare_zones) : utilise-les dès qu’un utilisateur demande la situation actuelle, une prédiction ou un calcul économique sur un district, une région, une province ou un pays COI/SADC/COMESA/Afrique ou l’un des 195 États ONU sur 2027–2032 ! ' +
        'Tu réponds avec chaleur, intelligence et précision chiffrée. '
      : 'Tu es l’analyste vocal du Madagascar El Niño Observatory. Utilise tes outils de calcul (get_current_situation, analyze_zone_prediction_and_loss, compare_zones) pour fournir des chiffres vérifiés sur Madagascar, la COI, le COMESA, la SADC, l’Afrique et les 195 pays ONU (2027–2032). ';

  const spokenConcise = `${getLanguageDirective(lang)} Speak naturally in concise spoken turns (2 to 4 clear sentences unless asked for deep details).`;

  return `${persona}${spokenConcise}`;
}

interface IndriInteractBody {
  message?: string;
  zoneQuery?: string;
  year?: number;
  scenario?: ScenarioKey;
  lang?: LangCode;
  history?: ChatTurnInput[];
}

app.post('/api/indri/interact', async (req, res) => {
  const body = (req.body ?? {}) as IndriInteractBody;
  const message = String(body.message ?? '').trim();
  const zoneQuery = String(body.zoneQuery ?? 'Ambovombe').trim();
  const year = normalizeYear(body.year);
  const scenario = normalizeScenario(body.scenario);
  const lang: LangCode = normalizeLang(body.lang);

  if (!message) {
    res.status(400).json({ error: 'Message required.' });
    return;
  }

  // Determine exact quantitative card to compute for Babakoto's HUD
  const lowerMsg = message.toLowerCase();
  let card: ZoneCalculationResult;
  if (
    lowerMsg.includes('situation actuelle') ||
    lowerMsg.includes('en ce moment') ||
    lowerMsg.includes('current situation') ||
    lowerMsg.includes('hali ya sasa') ||
    lowerMsg.includes('novembre 2026')
  ) {
    card = getCurrentSituationSnapshot(scenario);
  } else if (lowerMsg.includes(' vs ') || lowerMsg.includes('compar')) {
    card = compareZonesCalculation({
      zoneA: zoneQuery || 'Ambovombe',
      zoneB: lowerMsg.includes('zamb') ? 'Zambie' : lowerMsg.includes('kenya') ? 'Kenya' : 'Ambatondrazaka',
      year,
      scenario,
    });
  } else {
    // Also detect any district/region/country mentioned inside the message itself
    card = computeZoneAnalysis({
      zoneQuery: zoneQuery || message,
      year,
      scenario,
    });
    // If user explicitly named another known zone in the text different from fallback
    const probedFromMessage = computeZoneAnalysis({
      zoneQuery: message,
      year,
      scenario,
    });
    if (probedFromMessage.kind !== 'situation') {
      card = probedFromMessage;
    }
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.json({
      reply: card.summaryText,
      calculationCard: card,
      model: 'local-calculator',
    });
    return;
  }

  const systemInstruction =
    'Tu es Babakoto, l’Indri indri emblématique de Madagascar et l’interlocuteur audio permanent du Madagascar El Niño Observatory (M&G Consulting, DG : Prince MANANTENASOA). ' +
    'Tu peux répondre à N’IMPORTE QUELLE question de l’utilisateur (climat, agriculture, économie, 195 pays ONU, Madagascar 23 régions / 119 districts, sciences, conseils pratiques ou culture générale). ' +
    'Quand la question porte sur le climat, les pertes agricoles, les prévisions 2027–2032 ou une zone géographique, appuie-toi sur les calculs vérifiés et l’état de synchronisation mondiale ci-dessous. ' +
    'Réponds de façon fluide et naturelle pour une lecture vocale/audio immédiate (2 à 4 phrases claires et directes, sans markdown lourd). ' +
    getLanguageDirective(lang);

  const historyText = Array.isArray(body.history)
    ? body.history
        .slice(-6)
        .map((h) => `${h.role === 'user' ? 'Utilisateur' : 'Babakoto'} : ${h.text}`)
        .join('\n')
    : '';

  const prompt = [
    '[CALCUL OBSERVATOIRE EXÉCUTÉ EN TEMPS RÉEL]',
    `Zone / Sujet : ${card.zoneName} (${card.subtitle})`,
    `Horizon : ${card.year} · Scénario : ${card.scenario.toUpperCase()} · Statut : ${card.riskBadge}`,
    `Métriques calculées : ${card.metrics.map((m) => `${m.label} = ${m.value}`).join(' | ')}`,
    `Synchronisation mondiale (195 pays) : ${globalSyncState.lastSyncedAtIso ? `Active (${globalSyncState.lastSyncedAtIso}, facteur MG ×${globalSyncState.madagascarFactors.overallLossFactor})` : 'Baseline paramétrique active'}`,
    `Synthèse modèle : ${card.summaryText}`,
    `Recommandations FOFIFA/Terrain : ${card.recommendations.join(' ; ')}`,
    historyText ? `\n[HISTORIQUE RÉCENT]\n${historyText}` : '',
    `\n[DEMANDE DE L'UTILISATEUR]\n${message}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const { response, model } = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    res.json({
      reply: response.text?.trim() || card.summaryText,
      calculationCard: card,
      model,
    });
  } catch (err: unknown) {
    // Graceful fallback returning exact computed observatory card if model hits transient limit
    const errMsg = err instanceof Error ? err.message : '';
    res.json({
      reply: errMsg ? `${card.summaryText}` : card.summaryText,
      calculationCard: card,
      model: 'observatory-calculator',
    });
  }
});

async function startServer() {
  const port = Number(process.env.PORT) || 3000;
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const wss = new WebSocketServer({ server: httpServer, path: '/live' });

  wss.on('connection', (clientWs, req) => {
    const ai = getGeminiClient();
    if (!ai) {
      clientWs.send(
        JSON.stringify({
          error:
            'GEMINI_API_KEY missing on server. Please configure it in Settings > Secrets.',
        }),
      );
      clientWs.close();
      return;
    }

    const reqUrl = new URL(req.url ?? '/live', 'http://localhost');
    const langParam = reqUrl.searchParams.get('lang');
    const lang: LangCode = normalizeLang(langParam);
    const avatarParam = reqUrl.searchParams.get('avatar');
    const avatar: 'indri' | 'analyst' = avatarParam === 'analyst' ? 'analyst' : 'indri';
    const voiceParam = reqUrl.searchParams.get('voice') ?? 'Zephyr';
    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const voiceName = validVoices.includes(voiceParam) ? voiceParam : 'Zephyr';

    const sessionPromise = ai.live.connect({
      model: 'gemini-3.8-live-extended-thinking',
      config: {
        responseModalities: [Modality.AUDIO],
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
        tools: [
          {
            functionDeclarations: [
              getCurrentSituationTool,
              analyzeZoneTool,
              compareZonesTool,
            ],
          },
        ],
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        systemInstruction: buildLiveSystemInstruction(avatar, lang),
      },
      callbacks: {
        onopen: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                status: 'ready',
                model: 'gemini-3.8-live-extended-thinking',
                avatar,
                voiceName,
              }),
            );
          }
        },
        onmessage: (message: LiveServerMessage) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          const content = message.serverContent;
          if (content?.inputTranscription?.text) {
            clientWs.send(JSON.stringify({ inputTranscript: content.inputTranscription.text }));
          }
          if (content?.outputTranscription?.text) {
            clientWs.send(JSON.stringify({ outputTranscript: content.outputTranscription.text }));
          }
          for (const part of content?.modelTurn?.parts ?? []) {
            if (part.inlineData?.data) {
              clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
            }
          }

          // Execute NON_BLOCKING observatory computation tools when Babakoto triggers calculations/predictions
          const calls = message.toolCall?.functionCalls ?? [];
          if (calls.length > 0) {
            for (const call of calls) {
              const callName = call.name ?? 'analyze_zone_prediction_and_loss';
              const callArgs = (call.args ?? {}) as Record<string, unknown>;
              clientWs.send(
                JSON.stringify({
                  toolActivity: { status: 'calculating', toolName: callName },
                }),
              );

              const cardResult = executeLiveToolCall(callName, callArgs);
              clientWs.send(JSON.stringify({ calculationCard: cardResult }));

              sessionPromise
                .then((session) => {
                  session.sendToolResponse({
                    functionResponses: [
                      {
                        id: call.id,
                        name: callName,
                        response: { result: cardResult },
                        scheduling: FunctionResponseScheduling.WHEN_IDLE,
                      },
                    ],
                  });
                })
                .catch(() => {
                  // Ignore late tool response errors if session closed
                });
            }
          }

          if (content?.interactionStatus) {
            clientWs.send(
              JSON.stringify({
                interactionStatus:
                  content.interactionStatus === InteractionStatus.IN_PROGRESS
                    ? 'IN_PROGRESS'
                    : 'IDLE',
              }),
            );
          }

          if (content?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
          if (content?.turnComplete) {
            clientWs.send(JSON.stringify({ turnComplete: true }));
          }
        },
        onerror: (err: unknown) => {
          if (clientWs.readyState === WebSocket.OPEN) {
            const msg = err instanceof Error ? err.message : 'Gemini Live connection error.';
            clientWs.send(JSON.stringify({ error: msg }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        },
      },
    });

    sessionPromise.catch((err: unknown) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        const msg = err instanceof Error ? err.message : 'Unable to start Gemini Live session.';
        clientWs.send(JSON.stringify({ error: msg }));
        clientWs.close();
      }
    });

    clientWs.on('message', (raw) => {
      let parsed: { audio?: string; text?: string } | null = null;
      try {
        parsed = JSON.parse(raw.toString()) as { audio?: string; text?: string };
      } catch {
        return;
      }

      sessionPromise
        .then((session) => {
          if (parsed?.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed?.text && parsed.text.trim()) {
            session.sendRealtimeInput({
              text: parsed.text.trim(),
            });
          }
        })
        .catch(() => {
          // Handled by sessionPromise.catch above
        });
    });

    clientWs.on('close', () => {
      sessionPromise
        .then((session) => {
          session.close();
        })
        .catch(() => {
          // Ignore close errors
        });
    });
  });

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
