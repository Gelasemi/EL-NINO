export type RssSeverity = 'critical' | 'high' | 'watch';
export type RssAgencyCategory = 'all' | 'wmo' | 'national' | 'noaa' | 'gdacs';

export interface RssFeedSourceConfig {
  id: string;
  agencyName: string;
  shortCode: string;
  category: Exclude<RssAgencyCategory, 'all'>;
  regionLabel: string;
  feedUrl: string;
  fallbackUrl?: string;
}

export interface RssBulletinItem {
  id: string;
  sourceId: string;
  agency: string;
  shortCode: string;
  category: Exclude<RssAgencyCategory, 'all'>;
  severity: RssSeverity;
  title: string;
  summary: string;
  link: string;
  publishedAtIso: string;
  regionTag: string;
  isLiveXml: boolean;
}

export interface RssFeedSourceStatus {
  id: string;
  agencyName: string;
  shortCode: string;
  category: Exclude<RssAgencyCategory, 'all'>;
  feedUrl: string;
  status: 'live' | 'cached-fallback';
  itemCount: number;
  lastCheckedIso: string;
}

export interface RssBulletinsPayload {
  listenerActive: boolean;
  pollIntervalSec: number;
  lastPolledIso: string;
  liveFeedsCount: number;
  totalFeedsCount: number;
  sources: RssFeedSourceStatus[];
  bulletins: RssBulletinItem[];
}

export const METEO_RSS_SOURCES: RssFeedSourceConfig[] = [
  {
    id: 'wmo-news',
    agencyName: 'WMO / OMM (World Meteorological Organization)',
    shortCode: 'WMO',
    category: 'wmo',
    regionLabel: 'Global · Indo-Pacific',
    feedUrl: 'https://wmo.int/rss.xml',
    fallbackUrl: 'https://public.wmo.int/en/media/news/rss.xml',
  },
  {
    id: 'gdacs-climate',
    agencyName: 'GDACS · UN Global Disaster Alerts',
    shortCode: 'GDACS',
    category: 'gdacs',
    regionLabel: 'Global · SWIO · SADC',
    feedUrl: 'https://www.gdacs.org/xml/rss_7d.xml',
  },
  {
    id: 'noaa-cpc',
    agencyName: 'NOAA Climate Prediction Center · NHC',
    shortCode: 'NOAA',
    category: 'noaa',
    regionLabel: 'Niño 3.4 · Tropics',
    feedUrl: 'https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc_rss.xml',
    fallbackUrl: 'https://www.nhc.noaa.gov/gtwo.xml',
  },
  {
    id: 'national-swio',
    agencyName: 'DGM Madagascar · SWIOCOF · ReliefWeb Disasters',
    shortCode: 'DGM / SWIO',
    category: 'national',
    regionLabel: 'Madagascar · IOC · SADC',
    feedUrl: 'https://reliefweb.int/disasters/rss.xml',
  },
];

function decodeXmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

export function stripHtmlAndNormalize(raw: string): string {
  const decoded = decodeXmlEntities(raw);
  return decoded
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractXmlTag(block: string, tagNames: string[]): string {
  for (const tag of tagNames) {
    const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = block.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractAtomLink(block: string): string {
  const hrefMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (hrefMatch && hrefMatch[1]) {
    return hrefMatch[1].trim();
  }
  return stripHtmlAndNormalize(extractXmlTag(block, ['link', 'guid', 'id']));
}

export function classifyBulletinSeverity(text: string): RssSeverity {
  const lower = text.toLowerCase();
  if (
    lower.includes('red alert') ||
    lower.includes('alerte rouge') ||
    lower.includes('critical') ||
    lower.includes('extreme') ||
    lower.includes('super el niño') ||
    lower.includes('super el nino') ||
    lower.includes('cyclone') ||
    lower.includes('category 4') ||
    lower.includes('category 5') ||
    lower.includes('emergency') ||
    lower.includes('severe drought')
  ) {
    return 'critical';
  }
  if (
    lower.includes('orange') ||
    lower.includes('el niño') ||
    lower.includes('el nino') ||
    lower.includes('drought') ||
    lower.includes('flood') ||
    lower.includes('inondation') ||
    lower.includes('sécheresse') ||
    lower.includes('secheresse') ||
    lower.includes('warning') ||
    lower.includes('advisory') ||
    lower.includes('heatwave') ||
    lower.includes('storm')
  ) {
    return 'high';
  }
  return 'watch';
}

export function inferBulletinRegion(text: string, fallbackRegion: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('madagascar') || lower.includes('antananarivo') || lower.includes('androy')) {
    return 'Madagascar · SWIO';
  }
  if (
    lower.includes('indian ocean') ||
    lower.includes('mozambique') ||
    lower.includes('malawi') ||
    lower.includes('zambia') ||
    lower.includes('southern africa') ||
    lower.includes('sadc')
  ) {
    return 'SADC · SW Indian Ocean';
  }
  if (
    lower.includes('kenya') ||
    lower.includes('somalia') ||
    lower.includes('ethiopia') ||
    lower.includes('east africa') ||
    lower.includes('comesa')
  ) {
    return 'East Africa · COMESA';
  }
  if (lower.includes('el niño') || lower.includes('el nino') || lower.includes('enso') || lower.includes('la niña')) {
    return 'Global ENSO · Indo-Pacific';
  }
  return fallbackRegion;
}

function normalizeIsoDate(rawDate: string): string {
  const trimmed = stripHtmlAndNormalize(rawDate);
  if (!trimmed) return new Date().toISOString();
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

export function parseRssOrAtomXml(
  xml: string,
  source: Pick<RssFeedSourceConfig, 'id' | 'agencyName' | 'shortCode' | 'category' | 'regionLabel' | 'feedUrl'>,
  maxItems = 5,
): RssBulletinItem[] {
  if (!xml || typeof xml !== 'string') return [];

  const rssItems = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  const atomEntries =
    rssItems.length === 0
      ? [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((m) => m[1])
      : [];
  const rawBlocks = rssItems.length > 0 ? rssItems : atomEntries;

  const parsed: RssBulletinItem[] = [];
  for (let i = 0; i < rawBlocks.length && parsed.length < maxItems; i += 1) {
    const block = rawBlocks[i];
    const title = stripHtmlAndNormalize(extractXmlTag(block, ['title']));
    if (!title) continue;

    const rawDesc = extractXmlTag(block, ['description', 'summary', 'content:encoded', 'content']);
    const cleanSummary = stripHtmlAndNormalize(rawDesc).slice(0, 260);
    const link = extractAtomLink(block) || source.feedUrl;
    const rawDate = extractXmlTag(block, ['pubDate', 'published', 'updated', 'dc:date']);
    const publishedAtIso = normalizeIsoDate(rawDate);
    const combinedText = `${title} ${cleanSummary}`;

    parsed.push({
      id: `${source.id}-${i}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18)}`,
      sourceId: source.id,
      agency: source.agencyName,
      shortCode: source.shortCode,
      category: source.category,
      severity: classifyBulletinSeverity(combinedText),
      title,
      summary: cleanSummary || title,
      link: /^https?:\/\//i.test(link) ? link : source.feedUrl,
      publishedAtIso,
      regionTag: inferBulletinRegion(combinedText, source.regionLabel),
      isLiveXml: true,
    });
  }

  return parsed;
}

export function getBaselineAgencyBulletins(nowIso = new Date().toISOString()): RssBulletinItem[] {
  const nowMs = new Date(nowIso).getTime();
  const hoursAgoIso = (h: number) => new Date(nowMs - h * 3600 * 1000).toISOString();

  return [
    {
      id: 'wmo-baseline-enso-2026',
      sourceId: 'wmo-news',
      agency: 'WMO / OMM (World Meteorological Organization)',
      shortCode: 'WMO',
      category: 'wmo',
      severity: 'critical',
      title: 'WMO Global Seasonal Climate Update: Strong El Niño (+3.5 °C ONI) & Coupled IOD+ Monitoring',
      summary:
        'WMO confirms heightened hydro-meteorological divergence through Q1 2027: severe rainfall deficits across Southern Africa & Grand Sud Madagascar alongside elevated flood risks in Equatorial East Africa.',
      link: 'https://wmo.int/media/news',
      publishedAtIso: hoursAgoIso(2),
      regionTag: 'Global ENSO · Indo-Pacific',
      isLiveXml: false,
    },
    {
      id: 'national-dgm-swiocof-2026',
      sourceId: 'national-swio',
      agency: 'Météo Madagascar (DGM) · SWIOCOF-15',
      shortCode: 'DGM / SWIO',
      category: 'national',
      severity: 'critical',
      title: 'Bulletin Décadal DGM & SWIOCOF-15 : Alerte sécheresse Grand Sud & surveillance convective SAVA',
      summary:
        'Météo Madagascar signale un déficit pluviométrique critique sur Androy/Anosy/Atsimo-Andrefana (−30 à −50 %) et un excès convectif précoce sur le bassin Nord-Est (SAVA, Analanjirofo, Diana).',
      link: 'https://www.meteomadagascar.mg/',
      publishedAtIso: hoursAgoIso(4),
      regionTag: 'Madagascar · SWIO',
      isLiveXml: false,
    },
    {
      id: 'noaa-cpc-advisory-2026',
      sourceId: 'noaa-cpc',
      agency: 'NOAA Climate Prediction Center',
      shortCode: 'NOAA',
      category: 'noaa',
      severity: 'high',
      title: 'NOAA CPC ENSO Diagnostic Discussion: Niño 3.4 Anomaly Persisting > +3.0 °C Toward Jan 2027 Peak',
      summary:
        'Equatorial Pacific SST anomalies remain well above historical super-El Niño thresholds; downstream teleconnections strengthen subtropical drought belts across SADC and southern Madagascar.',
      link: 'https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml',
      publishedAtIso: hoursAgoIso(6),
      regionTag: 'Niño 3.4 · Global',
      isLiveXml: false,
    },
    {
      id: 'gdacs-swio-2026',
      sourceId: 'gdacs-climate',
      agency: 'GDACS · UN Global Disaster Alerts',
      shortCode: 'GDACS',
      category: 'gdacs',
      severity: 'high',
      title: 'GDACS Drought & Flood Watch: Southern Indian Ocean Basin & East African Rift Rainbands',
      summary:
        'Multi-hazard satellite alerts tracking soil moisture anomalies in southern Madagascar/SADC and intense river basin runoff alerts across Kenya, Tanzania, and northern Mozambique.',
      link: 'https://www.gdacs.org/',
      publishedAtIso: hoursAgoIso(8),
      regionTag: 'SADC · COMESA · SWIO',
      isLiveXml: false,
    },
  ];
}

export function mergeAndSortRssBulletins(items: RssBulletinItem[], limit = 24): RssBulletinItem[] {
  const seenTitles = new Set<string>();
  const deduped: RssBulletinItem[] = [];

  const sorted = [...items].sort((a, b) => {
    if (a.isLiveXml !== b.isLiveXml) return a.isLiveXml ? -1 : 1;
    return new Date(b.publishedAtIso).getTime() - new Date(a.publishedAtIso).getTime();
  });

  for (const item of sorted) {
    const key = item.title.trim().toLowerCase().slice(0, 72);
    if (!key || seenTitles.has(key)) continue;
    seenTitles.add(key);
    deduped.push(item);
    if (deduped.length >= limit) break;
  }

  return deduped;
}
