import { useEffect, useState } from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getOfflineCacheStatus, type OfflineCacheStatus } from '../utils/offlineDatasetCache';

const OFFLINE_COPY: Record<
  WorldLanguageCode,
  {
    title: string;
    detail: string;
  }
> = {
  fr: {
    title: 'Mode Hors Ligne — Service Worker actif',
    detail: '195 pays ONU, 119 districts Madagascar, GeoJSON & indicateurs économiques servis depuis le cache.',
  },
  en: {
    title: 'Offline Mode — Service Worker Active',
    detail: '195 UN countries, 119 Madagascar districts, GeoJSON & economic datasets served from local cache.',
  },
  sw: {
    title: 'Hali ya Nje ya Mtandao — Service Worker Hai',
    detail: 'Nchi 195 za UN, wilaya 119 za Madagaska na data za kiuchumi zinapatikana kutoka akiba.',
  },
  es: {
    title: 'Modo Sin Conexión — Service Worker Activo',
    detail: '195 países ONU, 119 distritos de Madagascar y datos económicos servidos desde caché.',
  },
  ar: {
    title: 'وضع عدم الاتصال — مشغل الخدمة نشط',
    detail: 'بيانات 195 دولة و119 مقاطعة في مدغشقر والخرائط والنماذج الاقتصادية متاحة من الذاكرة المحلية.',
  },
  zh: {
    title: '离线模式 — Service Worker 已启用',
    detail: '195个联合国国家、马达加斯加119个区及经济气候数据集正从本地缓存提供访问。',
  },
  pt: {
    title: 'Modo Offline — Service Worker Ativo',
    detail: '195 países ONU, 119 distritos de Madagáscar e dados econômicos servidos via cache local.',
  },
  hi: {
    title: 'ऑफ़लाइन मोड — सर्विस वर्कर सक्रिय',
    detail: '195 देश, 119 मेडागास्कर जिले और आर्थिक-जलवायु डेटा स्थानीय कैश से उपलब्ध हैं।',
  },
  ru: {
    title: 'Автономный режим — Service Worker активен',
    detail: '195 стран ООН, 119 округов Мадагаскара и экономические наборы данных доступны из кэша.',
  },
};

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { worldLang } = useLanguage();
  const [cacheInfo, setCacheInfo] = useState<OfflineCacheStatus | null>(null);
  const copy = OFFLINE_COPY[worldLang];

  useEffect(() => {
    let active = true;
    const load = async () => {
      const status = await getOfflineCacheStatus();
      if (active) setCacheInfo(status);
    };
    void load();
    window.addEventListener('enso-offline-cache-updated', load);
    return () => {
      active = false;
      window.removeEventListener('enso-offline-cache-updated', load);
    };
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-amber-600 bg-amber-950 px-3.5 py-2.5 text-xs text-amber-50 shadow-xl"
    >
      <div className="flex items-center gap-2 font-semibold">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <WifiOff className="h-3.5 w-3.5 text-amber-300 shrink-0" aria-hidden="true" />
        <span>{copy.title}</span>
      </div>
      <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-snug text-amber-100/90">
        <Database className="mt-0.5 h-3 w-3 shrink-0 text-amber-300" aria-hidden="true" />
        <span>
          {copy.detail}
          {cacheInfo && cacheInfo.cachedEndpointsCount > 0
            ? ` (${cacheInfo.cachedEndpointsCount}/${cacheInfo.totalCriticalEndpoints} bundles)`
            : ''}
        </span>
      </p>
    </div>
  );
}
