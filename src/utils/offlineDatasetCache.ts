export const CLIMATIC_ECONOMIC_CACHE_NAME = 'climatic-economic-datasets-v1';
export const GEO_BOUNDARIES_CACHE_NAME = 'geo-boundaries-cache-v1';
const OFFLINE_CACHE_META_KEY = 'mg_enso_offline_cache_meta_v1';

export const CRITICAL_API_DATASETS = [
  '/api/offline/datasets',
  '/api/climate/live-feed',
  '/api/climate/global-sync/status',
  '/api/climate/maps-status',
  '/api/climate/rss-bulletins',
] as const;

export const CRITICAL_GEO_DATASETS = ['/geo/world-110m.geojson'] as const;

export interface OfflineCacheStatus {
  swSupported: boolean;
  swActive: boolean;
  cachedEndpointsCount: number;
  totalCriticalEndpoints: number;
  lastCachedIso: string | null;
  estimatedUsageKb: number | null;
}

interface StoredCacheMeta {
  lastCachedIso: string;
  cachedEndpointsCount: number;
}

function readMeta(): StoredCacheMeta | null {
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCacheMeta;
  } catch {
    return null;
  }
}

function writeMeta(meta: StoredCacheMeta): void {
  try {
    localStorage.setItem(OFFLINE_CACHE_META_KEY, JSON.stringify(meta));
  } catch {
    // Ignore storage quota exceptions
  }
}

export async function warmCriticalDatasetsCache(): Promise<OfflineCacheStatus> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return getOfflineCacheStatus();
  }

  let cachedCount = 0;

  if (navigator.onLine) {
    try {
      const apiCache = await caches.open(CLIMATIC_ECONOMIC_CACHE_NAME);
      await Promise.all(
        CRITICAL_API_DATASETS.map(async (endpoint) => {
          try {
            const resp = await fetch(endpoint, { cache: 'no-cache' });
            if (resp.ok) {
              await apiCache.put(endpoint, resp.clone());
              cachedCount += 1;
            }
          } catch {
            // Keep existing cached response if fetch fails
          }
        }),
      );

      const geoCache = await caches.open(GEO_BOUNDARIES_CACHE_NAME);
      await Promise.all(
        CRITICAL_GEO_DATASETS.map(async (geoUrl) => {
          try {
            const resp = await fetch(geoUrl, { cache: 'no-cache' });
            if (resp.ok) {
              await geoCache.put(geoUrl, resp.clone());
              cachedCount += 1;
            }
          } catch {
            // Ignore transient fetch failure
          }
        }),
      );

      if (cachedCount > 0) {
        writeMeta({
          lastCachedIso: new Date().toISOString(),
          cachedEndpointsCount: cachedCount,
        });
        window.dispatchEvent(new CustomEvent('enso-offline-cache-updated'));
      }
    } catch {
      // Cache API unavailable in restricted contexts
    }
  }

  return getOfflineCacheStatus();
}

export async function getOfflineCacheStatus(): Promise<OfflineCacheStatus> {
  const swSupported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  let swActive = false;

  if (swSupported) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      swActive = Boolean(reg?.active || navigator.serviceWorker.controller);
    } catch {
      swActive = false;
    }
  }

  const allCritical = [...CRITICAL_API_DATASETS, ...CRITICAL_GEO_DATASETS];
  let matchedCount = 0;

  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const apiCache = await caches.open(CLIMATIC_ECONOMIC_CACHE_NAME);
      const geoCache = await caches.open(GEO_BOUNDARIES_CACHE_NAME);
      for (const url of CRITICAL_API_DATASETS) {
        if (await apiCache.match(url)) matchedCount += 1;
      }
      for (const url of CRITICAL_GEO_DATASETS) {
        if (await geoCache.match(url)) matchedCount += 1;
      }
    } catch {
      // Fall back to stored metadata count if CacheStorage cannot be inspected
    }
  }

  const meta = readMeta();
  if (matchedCount === 0 && meta?.cachedEndpointsCount) {
    matchedCount = meta.cachedEndpointsCount;
  }

  let estimatedUsageKb: number | null = null;
  if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
    try {
      const est = await navigator.storage.estimate();
      if (typeof est.usage === 'number') {
        estimatedUsageKb = Math.round(est.usage / 1024);
      }
    } catch {
      estimatedUsageKb = null;
    }
  }

  return {
    swSupported,
    swActive,
    cachedEndpointsCount: matchedCount,
    totalCriticalEndpoints: allCritical.length,
    lastCachedIso: meta?.lastCachedIso ?? null,
    estimatedUsageKb,
  };
}
