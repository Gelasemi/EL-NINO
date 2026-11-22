import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  Mic,
  Navigation,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { DISTRICT_CHOROPLETH_DATA } from '../data/ensoData';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { IndriLiveVoicePanel } from './IndriLiveVoicePanel';
import { emitIndriActivity } from '../utils/indriEvents';

type AssistantTab = 'chat' | 'search' | 'maps' | 'live';
type ChatRoleId = 'agronome' | 'economiste' | 'humanitaire';
type GroundingToolMode = 'none' | 'googleSearch' | 'googleMaps';
type SpeedMode = 'hydrogen' | 'fast';

interface WebSource {
  title: string;
  uri: string;
}

interface MapReviewSnippet {
  title?: string;
  uri?: string;
  review?: string;
}

interface MapPlace {
  title: string;
  uri: string;
  text?: string;
  placeId?: string;
  reviewSnippets: MapReviewSnippet[];
}

interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  model?: string;
  toolMode?: GroundingToolMode;
  webSources?: WebSource[];
  mapPlaces?: MapPlace[];
  searchQueries?: string[];
}

interface AnchorOption {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

const BASE_ANCHOR_COORDS: Array<{ id: string; lat: number; lng: number }> = [
  { id: 'ambovombe', lat: -25.18, lng: 46.09 },
  { id: 'ambatondrazaka', lat: -17.83, lng: 48.42 },
  { id: 'marovoay', lat: -16.11, lng: 46.64 },
  { id: 'antananarivo', lat: -18.88, lng: 47.51 },
  { id: 'sambava', lat: -14.27, lng: 50.17 },
  { id: 'manakara', lat: -22.14, lng: 48.01 },
];

function renderFormattedText(raw: string) {
  const lines = raw.split('\n');
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Simple bold parsing (**text**)
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        const formatted = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-zinc-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        });

        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1E3A8A]" aria-hidden="true" />
              <span>{formatted.map((el, i) => (i === 0 ? <span key={i}>{trimmed.slice(2).split(/(\*\*[^*]+\*\*)/g).map((seg, sIdx) => seg.startsWith('**') && seg.endsWith('**') ? <strong key={sIdx} className="font-semibold text-zinc-900">{seg.slice(2, -2)}</strong> : seg)}</span> : null))}</span>
            </div>
          );
        }

        if (/^#{1,3}\s+/.test(trimmed)) {
          return (
            <p key={idx} className="pt-1 font-serif text-base font-semibold text-zinc-900">
              {trimmed.replace(/^#{1,3}\s+/, '')}
            </p>
          );
        }

        return <p key={idx}>{formatted}</p>;
      })}
    </div>
  );
}

function GroundingSourcesBlock({
  webSources,
  mapPlaces,
  searchQueries,
}: {
  webSources?: WebSource[];
  mapPlaces?: MapPlace[];
  searchQueries?: string[];
}) {
  const { t } = useLanguage();
  const hasWeb = webSources && webSources.length > 0;
  const hasMaps = mapPlaces && mapPlaces.length > 0;
  if (!hasWeb && !hasMaps) return null;

  return (
    <div className="mt-3 space-y-3 border-t border-zinc-200 pt-3">
      {hasWeb && (
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            <Globe className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
            <span>{t.assistant.webSourcesTitle}</span>
          </div>
          {searchQueries && searchQueries.length > 0 && (
            <p className="mt-1 text-[11px] text-zinc-500">
              {searchQueries.join(' · ')}
            </p>
          )}
          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {webSources.map((src) => (
              <a
                key={src.uri}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-xs text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                <span className="truncate font-medium">{src.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}

      {hasMaps && (
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            <MapPin className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
            <span>{t.assistant.mapPlacesTitle}</span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {mapPlaces.map((place, idx) => (
              <div
                key={`${place.uri}-${idx}`}
                className="rounded border border-zinc-200 bg-[#F9F8F4] p-2.5 text-xs"
              >
                <a
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#1E3A8A] hover:underline"
                >
                  <span>{place.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                </a>
                {place.text && (
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">{place.text}</p>
                )}
                {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                  <div className="mt-2 space-y-1 border-t border-zinc-200/80 pt-1.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {t.assistant.mapReviewsTitle}
                    </span>
                    {place.reviewSnippets.map((rev, rIdx) => (
                      <div key={rIdx} className="text-[11px] text-zinc-600">
                        {rev.review && <p className="italic">« {rev.review} »</p>}
                        {rev.uri && (
                          <a
                            href={rev.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E3A8A] hover:underline"
                          >
                            <span>{rev.title || t.assistant.openInMaps}</span>
                            <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function GeminiObservatoryAssistant() {
  const { worldLang, t, ui } = useLanguage();
  const { user, saveChatInteraction } = useAuth();
  const [activeTab, setActiveTab] = useState<AssistantTab>('live');

  // Shared Multi-Turn Chat State
  const [roleId, setRoleId] = useState<ChatRoleId>('agronome');
  const [toolMode, setToolMode] = useState<GroundingToolMode>('none');
  const [speedMode, setSpeedMode] = useState<SpeedMode>('hydrogen');
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Anchor location (for Google Maps Grounding in both Chat & Maps Tab)
  const anchorOptions: AnchorOption[] = useMemo(() => {
    const regional: AnchorOption[] = BASE_ANCHOR_COORDS.map((coord, idx) => ({
      id: coord.id,
      label: ui.assistantExtra.anchors[idx]?.label ?? coord.id,
      lat: ui.assistantExtra.anchors[idx]?.lat ?? coord.lat,
      lng: ui.assistantExtra.anchors[idx]?.lon ?? coord.lng,
    }));
    const districts: AnchorOption[] = DISTRICT_CHOROPLETH_DATA.map((d) => ({
      id: `dist-${d.district}`,
      label: `${d.district} (${d.region})`,
      lat: d.lat,
      lng: d.lon,
    }));
    return [...regional, ...districts];
  }, [ui.assistantExtra.anchors]);

  const [selectedAnchorId, setSelectedAnchorId] = useState<string>('antananarivo');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null);

  const selectedAnchor = useMemo(() => {
    if (gpsCoords) {
      return {
        id: 'gps',
        label: t.assistant.gpsActive,
        lat: gpsCoords.lat,
        lng: gpsCoords.lng,
      };
    }
    return anchorOptions.find((a) => a.id === selectedAnchorId) ?? anchorOptions[0];
  }, [anchorOptions, selectedAnchorId, gpsCoords, t.assistant.gpsActive]);

  // Dedicated Search Grounding Tab State
  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<{
    query: string;
    answer: string;
    webSources: WebSource[];
    searchQueries: string[];
  } | null>(null);

  // Dedicated Maps Grounding Tab State
  const [mapsInput, setMapsInput] = useState('');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [mapsResult, setMapsResult] = useState<{
    query: string;
    answer: string;
    mapPlaces: MapPlace[];
    placeLabel: string;
  } | null>(null);

  const sectionThreadRef = useRef<HTMLDivElement | null>(null);
  const drawerThreadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sectionThreadRef.current) {
      sectionThreadRef.current.scrollTop = sectionThreadRef.current.scrollHeight;
    }
    if (drawerThreadRef.current) {
      drawerThreadRef.current.scrollTop = drawerThreadRef.current.scrollHeight;
    }
  }, [messages, chatLoading, drawerOpen]);

  // Allow Hero button or other triggers to open drawer or jump to Indri Live Voice
  useEffect(() => {
    const openDrawerHandler = () => setDrawerOpen(true);
    const openLiveHandler = () => {
      setActiveTab('live');
      setDrawerOpen(false);
      document.getElementById('assistant-gemini')?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('open-gemini-drawer', openDrawerHandler);
    window.addEventListener('open-indri-live', openLiveHandler);
    return () => {
      window.removeEventListener('open-gemini-drawer', openDrawerHandler);
      window.removeEventListener('open-indri-live', openLiveHandler);
    };
  }, []);

  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsStatusMsg(t.assistant.gpsError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatusMsg(
          `${t.assistant.gpsActive} (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`,
        );
      },
      () => {
        setGpsCoords(null);
        setGpsStatusMsg(t.assistant.gpsError);
      },
      { timeout: 6000 },
    );
  };

  const sendChatMessage = async (overrideText?: string) => {
    const prompt = (overrideText ?? chatInput).trim();
    if (!prompt || chatLoading) return;

    const userMsg: ChatMessageItem = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: prompt,
    };

    const historyForApi = messages.map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setChatInput('');
    setChatLoading(true);
    setChatError(null);
    emitIndriActivity({
      state: 'processing',
      label: ui.assistantExtra.indriChatStarting,
      detail: prompt,
    });

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: historyForApi,
          roleId,
          toolMode,
          speedMode,
          lang: worldLang,
          location: {
            lat: selectedAnchor.lat,
            lng: selectedAnchor.lng,
            label: selectedAnchor.label,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || ui.assistantExtra.responseError);
      }

      const modelMsg: ChatMessageItem = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply,
        model: data.model,
        toolMode: data.toolMode,
        webSources: data.webSources ?? [],
        mapPlaces: data.mapPlaces ?? [],
        searchQueries: data.searchQueries ?? [],
      };
      setMessages((prev) => [...prev, modelMsg]);
      if (user) {
        void saveChatInteraction({
          roleId,
          zoneName: selectedAnchor.label,
          prompt,
          reply: String(data.reply ?? ''),
        }).catch(() => {});
      }
      emitIndriActivity({
        state: 'speaking',
        label: ui.assistantExtra.indriChatDone,
        detail: data.reply.slice(0, 95),
      });
    } catch (err: unknown) {
      setChatError(err instanceof Error ? err.message : ui.assistantExtra.networkError);
      emitIndriActivity({ state: 'idle' });
    } finally {
      setChatLoading(false);
    }
  };

  const runSearchGrounding = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? searchInput).trim();
    if (!q || searchLoading) return;
    if (overrideQuery) setSearchInput(q);
    setSearchLoading(true);
    setSearchError(null);
    emitIndriActivity({
      state: 'processing',
      label: ui.assistantExtra.indriSearchStarting,
      detail: q,
    });

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, lang: worldLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ui.assistantExtra.searchError);
      setSearchResult({
        query: q,
        answer: data.answer,
        webSources: data.webSources ?? [],
        searchQueries: data.searchQueries ?? [],
      });
      emitIndriActivity({
        state: 'speaking',
        label: ui.assistantExtra.indriSearchDone,
        detail: `${(data.webSources ?? []).length} · ${q.slice(0, 48)}`,
      });
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : ui.assistantExtra.searchError);
      emitIndriActivity({ state: 'idle' });
    } finally {
      setSearchLoading(false);
    }
  };

  const runMapsGrounding = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? mapsInput).trim();
    if (!q || mapsLoading) return;
    if (overrideQuery) setMapsInput(q);
    setMapsLoading(true);
    setMapsError(null);
    emitIndriActivity({
      state: 'processing',
      label: ui.assistantExtra.indriMapsStarting,
      detail: q,
    });

    try {
      const res = await fetch('/api/gemini/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          lang: worldLang,
          lat: selectedAnchor.lat,
          lng: selectedAnchor.lng,
          placeLabel: selectedAnchor.label,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ui.assistantExtra.mapsError);
      setMapsResult({
        query: q,
        answer: data.answer,
        mapPlaces: data.mapPlaces ?? [],
        placeLabel: selectedAnchor.label,
      });
      emitIndriActivity({
        state: 'speaking',
        label: ui.assistantExtra.indriMapsDone,
        detail: `${(data.mapPlaces ?? []).length} · ${selectedAnchor.label.split(' · ')[0]}`,
      });
    } catch (err: unknown) {
      setMapsError(err instanceof Error ? err.message : ui.assistantExtra.mapsError);
      emitIndriActivity({ state: 'idle' });
    } finally {
      setMapsLoading(false);
    }
  };

  const renderChatThread = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    heightClass: string,
  ) => (
    <div
      ref={containerRef}
      className={`${heightClass} overflow-y-auto rounded-md border border-zinc-200 bg-[#F9F8F4] p-4 space-y-4`}
    >
      {messages.length === 0 && (
        <div className="space-y-3 py-4">
          <p className="text-xs font-medium text-zinc-600">
            {t.assistant.roles[roleId].label} — {t.assistant.roles[roleId].desc}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {t.assistant.chatStarters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => sendChatMessage(starter)}
                className="rounded-md border border-zinc-200 bg-white px-3.5 py-2.5 text-left text-xs font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`max-w-[92%] rounded-lg border px-4 py-3 ${
              msg.role === 'user'
                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                : 'border-zinc-200 bg-white text-zinc-800'
            }`}
          >
            {msg.role === 'model' && (
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="font-semibold text-[#1E3A8A]">
                  {t.assistant.roles[roleId].label}
                </span>
                <span>·</span>
                <span>{msg.model || 'gemini-4-hydrogen'}</span>
                {msg.toolMode && msg.toolMode !== 'none' && (
                  <>
                    <span>·</span>
                    <span className="text-zinc-700">{msg.toolMode}</span>
                  </>
                )}
              </div>
            )}

            {msg.role === 'user' ? (
              <p className="text-sm leading-relaxed">{msg.text}</p>
            ) : (
              renderFormattedText(msg.text)
            )}

            {msg.role === 'model' && (
              <GroundingSourcesBlock
                webSources={msg.webSources}
                mapPlaces={msg.mapPlaces}
                searchQueries={msg.searchQueries}
              />
            )}
          </div>
        </div>
      ))}

      {chatLoading && (
        <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
          <Loader2 className="h-4 w-4 animate-spin text-[#1E3A8A]" aria-hidden="true" />
          <span>{t.assistant.loadingText}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <section id="assistant-gemini" className="border-b border-zinc-200 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="border-b border-zinc-200 pb-8">
            <p className="text-xs font-medium tracking-wider text-zinc-500">
              {t.sections.s09Eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {t.sections.s09Title}
            </h2>
            <p className="mt-3 max-w-[74ch] text-base leading-relaxed text-zinc-600">
              {t.sections.s09Lead}
            </p>
          </div>

          {/* Main Mode Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Gemini Grounding & Chat Modes"
            className="mt-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-3"
          >
            {[
              { id: 'live' as const, label: t.assistant.tabLive, icon: Mic },
              { id: 'chat' as const, label: t.assistant.tabChat, icon: MessageSquare },
              { id: 'search' as const, label: t.assistant.tabSearch, icon: Search },
              { id: 'maps' as const, label: t.assistant.tabMaps, icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-300 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: MULTI-TURN GEMINI CHATBOT */}
          {activeTab === 'chat' && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Configuration Column */}
              <div className="space-y-4 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 lg:col-span-4">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {t.assistant.roleLabel}
                  </span>
                  <div className="mt-2 space-y-2">
                    {(['agronome', 'economiste', 'humanitaire'] as ChatRoleId[]).map((rKey) => (
                      <button
                        key={rKey}
                        type="button"
                        onClick={() => setRoleId(rKey)}
                        className={`w-full rounded-md border p-3 text-left transition-colors ${
                          roleId === rKey
                            ? 'border-[#1E3A8A] bg-white'
                            : 'border-zinc-200 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <span
                          className={`block text-xs font-semibold ${
                            roleId === rKey ? 'text-[#1E3A8A]' : 'text-zinc-900'
                          }`}
                        >
                          {t.assistant.roles[rKey].label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-zinc-500">
                          {t.assistant.roles[rKey].desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <label
                    htmlFor="chat-grounding-mode"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                  >
                    {t.assistant.groundingModeLabel}
                  </label>
                  <select
                    id="chat-grounding-mode"
                    value={toolMode}
                    onChange={(e) => setToolMode(e.target.value as GroundingToolMode)}
                    className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                  >
                    <option value="none">{t.assistant.groundingModes.none}</option>
                    <option value="googleSearch">{t.assistant.groundingModes.googleSearch}</option>
                    <option value="googleMaps">{t.assistant.groundingModes.googleMaps}</option>
                  </select>
                </div>

                {toolMode === 'googleMaps' && (
                  <div className="border-t border-zinc-200 pt-4 space-y-2">
                    <label
                      htmlFor="chat-maps-anchor"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      {t.assistant.anchorLocationLabel}
                    </label>
                    <select
                      id="chat-maps-anchor"
                      value={selectedAnchorId}
                      onChange={(e) => {
                        setGpsCoords(null);
                        setSelectedAnchorId(e.target.value);
                      }}
                      className="w-full rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-xs font-medium text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                    >
                      {anchorOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleRequestGps}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                    >
                      <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.assistant.useMyGps}</span>
                    </button>
                    {gpsStatusMsg && (
                      <p className="text-[11px] text-zinc-500">{gpsStatusMsg}</p>
                    )}
                  </div>
                )}

                {toolMode === 'none' && (
                  <div className="border-t border-zinc-200 pt-4">
                    <label
                      htmlFor="chat-speed-mode"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      {t.assistant.speedLabel}
                    </label>
                    <select
                      id="chat-speed-mode"
                      value={speedMode}
                      onChange={(e) => setSpeedMode(e.target.value as SpeedMode)}
                      className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                    >
                      <option value="hydrogen">{t.assistant.speedStandard}</option>
                      <option value="fast">{t.assistant.speedFast}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Right Multi-Turn Conversation Thread */}
              <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-5 lg:col-span-8">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                    <Sparkles className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <span>{t.brandName} · Gemini Multi-Turn</span>
                    <span className="font-mono text-[11px] font-normal text-zinc-500 tabular-nums">
                      ({messages.length} {ui.assistantExtra.msgUnit})
                    </span>
                  </div>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMessages([]);
                        setChatError(null);
                      }}
                      className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      <span>{t.assistant.resetChat}</span>
                    </button>
                  )}
                </div>

                {renderChatThread(sectionThreadRef, 'h-[420px]')}

                {chatError && (
                  <p className="mt-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                    {chatError}
                  </p>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage();
                  }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t.assistant.inputPlaceholderChat}
                    className="flex-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="inline-flex items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.assistant.sendBtn}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SEARCH GROUNDING */}
          {activeTab === 'search' && (
            <div className="mt-8 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-zinc-900">
                    {t.assistant.tabSearch}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {ui.assistantExtra.modelBadgePrefix}{' '}
                    <span className="font-mono font-semibold">gemini-4-hydrogen</span> ·{' '}
                    {ui.assistantExtra.toolBadgePrefix}{' '}
                    <span className="font-mono font-semibold">googleSearch</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {t.assistant.searchPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => runSearchGrounding(preset)}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearchGrounding();
                }}
                className="mt-4 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.assistant.inputPlaceholderSearch}
                  className="flex-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={searchLoading || !searchInput.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Search className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{t.assistant.searchingBtn}</span>
                </button>
              </form>

              {searchError && (
                <p className="mt-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {searchError}
                </p>
              )}

              {searchResult && (
                <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {searchResult.query}
                  </p>
                  {renderFormattedText(searchResult.answer)}
                  <GroundingSourcesBlock
                    webSources={searchResult.webSources}
                    searchQueries={searchResult.searchQueries}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE MAPS GROUNDING */}
          {activeTab === 'maps' && (
            <div className="mt-8 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6">
              <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-zinc-900">
                    {t.assistant.tabMaps}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {ui.assistantExtra.modelBadgePrefix}{' '}
                    <span className="font-mono font-semibold">gemini-4-hydrogen</span> ·{' '}
                    {ui.assistantExtra.toolBadgePrefix}{' '}
                    <span className="font-mono font-semibold">googleMaps</span> · Lat/Lng :{' '}
                    <span className="font-mono tabular-nums">
                      {selectedAnchor.lat.toFixed(4)}, {selectedAnchor.lng.toFixed(4)}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label={t.assistant.anchorLocationLabel}
                    value={selectedAnchorId}
                    onChange={(e) => {
                      setGpsCoords(null);
                      setSelectedAnchorId(e.target.value);
                    }}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                  >
                    {anchorOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleRequestGps}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A] whitespace-nowrap"
                  >
                    <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.assistant.useMyGps}</span>
                  </button>
                </div>
              </div>

              {gpsStatusMsg && (
                <p className="mt-2 text-xs text-zinc-600">{gpsStatusMsg}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {t.assistant.mapsPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => runMapsGrounding(preset)}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runMapsGrounding();
                }}
                className="mt-4 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="text"
                  value={mapsInput}
                  onChange={(e) => setMapsInput(e.target.value)}
                  placeholder={t.assistant.inputPlaceholderMaps}
                  className="flex-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={mapsLoading || !mapsInput.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  {mapsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{t.assistant.searchingBtn}</span>
                </button>
              </form>

              {mapsError && (
                <p className="mt-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {mapsError}
                </p>
              )}

              {mapsResult && (
                <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {mapsResult.placeLabel} · {mapsResult.query}
                  </p>
                  {renderFormattedText(mapsResult.answer)}
                  <GroundingSourcesBlock mapPlaces={mapsResult.mapPlaces} />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GEMINI 3.8 LIVE VOICE & INDRI INDRI AVATAR */}
          {activeTab === 'live' && <IndriLiveVoicePanel />}
        </div>
      </section>

      {/* FLOATING QUICK-OPEN CHAT LAUNCHER + SLIDE-OVER DRAWER */}
      {!drawerOpen && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={t.assistant.floatingLabel}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-md border border-[#1E3A8A] bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-[#172554]"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          <span>{t.assistant.floatingLabel}</span>
        </button>
      )}

      {drawerOpen && (
        <aside
          aria-label={t.assistant.drawerTitle}
          className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[440px] flex-col rounded-lg border border-zinc-300 bg-white shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-[#1E3A8A] px-4 py-3 text-white rounded-t-lg">
            <div>
              <h3 className="font-serif text-sm font-semibold">{t.assistant.drawerTitle}</h3>
              <p className="text-[11px] text-white/80">{t.assistant.drawerSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={ui.assistantExtra.closeAria}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-[#F9F8F4] px-3 py-2 text-[11px]">
            <select
              aria-label={t.assistant.roleLabel}
              value={roleId}
              onChange={(e) => setRoleId(e.target.value as ChatRoleId)}
              className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 font-medium text-zinc-900 focus:outline-none"
            >
              <option value="agronome">{t.assistant.roles.agronome.label}</option>
              <option value="economiste">{t.assistant.roles.economiste.label}</option>
              <option value="humanitaire">{t.assistant.roles.humanitaire.label}</option>
            </select>

            <select
              aria-label={t.assistant.groundingModeLabel}
              value={toolMode}
              onChange={(e) => setToolMode(e.target.value as GroundingToolMode)}
              className="rounded border border-zinc-300 bg-white px-2 py-1 font-medium text-zinc-900 focus:outline-none"
            >
              <option value="none">{t.assistant.groundingModes.none}</option>
              <option value="googleSearch">{t.assistant.groundingModes.googleSearch}</option>
              <option value="googleMaps">{t.assistant.groundingModes.googleMaps}</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                setDrawerOpen(false);
                document.getElementById('assistant-gemini')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-[#1E3A8A]/30 bg-white px-2.5 py-1.5 font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A] hover:text-white"
            >
              <Mic className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.assistant.openIndriVoiceBtn}</span>
            </button>
          </div>

          <div className="p-3">
            {renderChatThread(drawerThreadRef, 'h-[320px]')}

            {chatError && (
              <p className="mt-2 rounded border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] text-rose-800">
                {chatError}
              </p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChatMessage();
              }}
              className="mt-2.5 flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.assistant.inputPlaceholderChat}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="inline-flex items-center justify-center rounded-md bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#172554] disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </aside>
      )}
    </>
  );
}
