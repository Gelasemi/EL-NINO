import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { emitIndriActivity } from '../utils/indriEvents';
import { warmCriticalDatasetsCache } from '../utils/offlineDatasetCache';
import type { UnZoneId } from '../data/worldEnso195Data';

const GLOBAL_SYNC_STORAGE_KEY = 'mg_enso_global_sync_v1';

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
  zoneId: UnZoneId;
  countryName: string;
  lat: number;
  lng: number;
  tempC: number | null;
  precipMm7d: number | null;
  windKmh: number | null;
  rainfallAnomalyPct: number;
}

export interface ZoneRecalibrationFactor {
  zoneId: UnZoneId;
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
  zoneFactors: Record<UnZoneId, ZoneRecalibrationFactor>;
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

const DEFAULT_ZONE_FACTORS: Record<UnZoneId, ZoneRecalibrationFactor> = {
  afrique: { zoneId: 'afrique', gdpLossFactor: 1, agriLossFactor: 1, displacementFactor: 1, foodInflationAddPct: 0, rainfallAnomalyPct: 0, droughtDelta: 0, floodDelta: 0, avgTempC: null },
  asie: { zoneId: 'asie', gdpLossFactor: 1, agriLossFactor: 1, displacementFactor: 1, foodInflationAddPct: 0, rainfallAnomalyPct: 0, droughtDelta: 0, floodDelta: 0, avgTempC: null },
  europe: { zoneId: 'europe', gdpLossFactor: 1, agriLossFactor: 1, displacementFactor: 1, foodInflationAddPct: 0, rainfallAnomalyPct: 0, droughtDelta: 0, floodDelta: 0, avgTempC: null },
  'amerique-latine-caraibes': { zoneId: 'amerique-latine-caraibes', gdpLossFactor: 1, agriLossFactor: 1, displacementFactor: 1, foodInflationAddPct: 0, rainfallAnomalyPct: 0, droughtDelta: 0, floodDelta: 0, avgTempC: null },
  oceanie: { zoneId: 'oceanie', gdpLossFactor: 1, agriLossFactor: 1, displacementFactor: 1, foodInflationAddPct: 0, rainfallAnomalyPct: 0, droughtDelta: 0, floodDelta: 0, avgTempC: null },
  'amerique-du-nord': { zoneId: 'amerique-du-nord', gdpLossFactor: 1, agriLossFactor: 1, displacementFactor: 1, foodInflationAddPct: 0, rainfallAnomalyPct: 0, droughtDelta: 0, floodDelta: 0, avgTempC: null },
};

const DEFAULT_SYNC_STATE: GlobalSyncPayload = {
  midnightAutoUpdateEnabled: true,
  isSyncing: false,
  triggeredBy: 'startup-baseline',
  lastSyncedAtIso: null,
  nextMidnightIso: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
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
  zoneFactors: DEFAULT_ZONE_FACTORS,
  madagascarFactors: {
    overallLossFactor: 1,
    agriLossFactor: 1,
    gdpLossFactor: 1,
    displacementFactor: 1,
    foodInflationDeltaPct: 0,
    rainfallAnomalyPct: 0,
    droughtDelta: 0,
    floodDelta: 0,
    profileMultipliers: {
      southDrought: 1,
      highlands: 1,
      eastCoast: 1,
      northWest: 1,
    },
  },
  webScrapeSummary: 'Observatory baseline active.',
};

interface GlobalSyncContextValue {
  syncState: GlobalSyncPayload;
  syncing: boolean;
  countdownLabel: string;
  hasLiveScrape: boolean;
  toggleMidnightAutoUpdate: () => Promise<void>;
  runGlobalScrapeNow: () => Promise<void>;
  getZoneFactor: (zoneId: UnZoneId) => ZoneRecalibrationFactor;
}

const GlobalSyncContext = createContext<GlobalSyncContextValue | null>(null);

function formatCountdown(targetIso: string): string {
  const diffMs = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSec = Math.floor(diffMs / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2, '0')}h:${String(mins).padStart(2, '0')}m:${String(secs).padStart(2, '0')}s`;
}

function loadPersistedSyncState(): GlobalSyncPayload {
  try {
    const raw = localStorage.getItem(GLOBAL_SYNC_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GlobalSyncPayload;
      if (parsed && parsed.zoneFactors && parsed.madagascarFactors) {
        return parsed;
      }
    }
  } catch {
    // Ignore invalid cached payload
  }
  return DEFAULT_SYNC_STATE;
}

function persistSyncState(payload: GlobalSyncPayload): void {
  try {
    localStorage.setItem(GLOBAL_SYNC_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota exceptions
  }
}

export function GlobalSyncProvider({ children }: { children: ReactNode }) {
  const { user, saveSyncSnapshot } = useAuth();
  const [syncState, setSyncState] = useState<GlobalSyncPayload>(loadPersistedSyncState);
  const [syncing, setSyncing] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState(() =>
    formatCountdown(DEFAULT_SYNC_STATE.nextMidnightIso),
  );

  const fetchStatus = useCallback(async () => {
    try {
      const resp = await fetch('/api/climate/global-sync/status');
      if (resp.ok) {
        const data = (await resp.json()) as GlobalSyncPayload;
        setSyncState(data);
        persistSyncState(data);
      }
    } catch {
      // Offline mode seamlessly falls back to persisted localStorage / Service Worker state
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdownLabel(formatCountdown(syncState.nextMidnightIso));
    }, 1000);
    return () => window.clearInterval(id);
  }, [syncState.nextMidnightIso]);

  const runGlobalScrapeNow = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    emitIndriActivity({
      state: 'processing',
      label: 'Scraping Web & Recalibrage 195 pays',
      detail: 'Open-Meteo · NOAA CPC · GDACS · Madagascar (119 districts)',
    });
    try {
      const resp = await fetch('/api/climate/global-sync/run-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (resp.ok) {
        const data = (await resp.json()) as GlobalSyncPayload;
        setSyncState(data);
        persistSyncState(data);
        void warmCriticalDatasetsCache();
        emitIndriActivity({
          state: 'speaking',
          label: '195 pays & Madagascar recalibrés',
          detail: data.webScrapeSummary,
        });
        if (user) {
          void saveSyncSnapshot({
            triggeredBy: data.triggeredBy === 'midnight-cron' ? 'midnight-cron' : 'manual',
            midnightEnabled: data.midnightAutoUpdateEnabled,
            oniIndex: data.oniIndexObserved,
            countriesUpdated: data.countriesRecalibratedCount,
            scrapedSourcesCount: data.scrapedSources.length,
            summary: data.webScrapeSummary,
          }).catch(() => undefined);
        }
      }
    } catch {
      emitIndriActivity({ state: 'idle' });
    } finally {
      setSyncing(false);
    }
  }, [syncing, user, saveSyncSnapshot]);

  const toggleMidnightAutoUpdate = useCallback(async () => {
    try {
      const nextEnabled = !syncState.midnightAutoUpdateEnabled;
      const resp = await fetch('/api/climate/global-sync/toggle-midnight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextEnabled }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as GlobalSyncPayload;
        setSyncState(data);
        persistSyncState(data);
      }
    } catch {
      setSyncState((prev) => {
        const updated = {
          ...prev,
          midnightAutoUpdateEnabled: !prev.midnightAutoUpdateEnabled,
        };
        persistSyncState(updated);
        return updated;
      });
    }
  }, [syncState.midnightAutoUpdateEnabled]);

  const getZoneFactor = useCallback(
    (zoneId: UnZoneId) => syncState.zoneFactors[zoneId] ?? DEFAULT_ZONE_FACTORS[zoneId],
    [syncState.zoneFactors],
  );

  const value = useMemo<GlobalSyncContextValue>(
    () => ({
      syncState,
      syncing,
      countdownLabel,
      hasLiveScrape: Boolean(syncState.lastSyncedAtIso),
      toggleMidnightAutoUpdate,
      runGlobalScrapeNow,
      getZoneFactor,
    }),
    [
      syncState,
      syncing,
      countdownLabel,
      toggleMidnightAutoUpdate,
      runGlobalScrapeNow,
      getZoneFactor,
    ],
  );

  return <GlobalSyncContext.Provider value={value}>{children}</GlobalSyncContext.Provider>;
}

export function useGlobalSync(): GlobalSyncContextValue {
  const ctx = useContext(GlobalSyncContext);
  if (!ctx) {
    throw new Error('useGlobalSync must be used inside GlobalSyncProvider');
  }
  return ctx;
}
