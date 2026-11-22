import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  FileDown,
  Globe,
  Layers,
  Maximize2,
  MessageSquare,
  Minimize2,
  Presentation,
  Radio,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  buildExecutivePitchDeckData,
  exportExecutivePitchDeckPdf,
  type PitchSlideSpec,
} from '../utils/pitchDeckSlides';

export function ExecutivePitchDeck() {
  const { lang } = useLanguage();
  const { syncState } = useGlobalSync();
  const [deckLang, setDeckLang] = useState<'fr' | 'en'>(lang === 'en' ? 'en' : 'fr');
  const [slideIdx, setSlideIdx] = useState(0);
  const [theaterMode, setTheaterMode] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [exportedFile, setExportedFile] = useState<string | null>(null);

  useEffect(() => {
    setDeckLang(lang === 'en' ? 'en' : 'fr');
  }, [lang]);

  useEffect(() => {
    const onLaunchPitch = () => {
      const el = document.getElementById('pitch-ministeriel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTheaterMode(true);
    };
    window.addEventListener('open-executive-pitch-deck', onLaunchPitch);
    return () => window.removeEventListener('open-executive-pitch-deck', onLaunchPitch);
  }, []);

  const isFr = deckLang === 'fr';

  const pitchData = useMemo(
    () =>
      buildExecutivePitchDeckData({
        oniObservedC: syncState.oniIndexObserved,
        liveFeedsCount: Math.max(2, syncState.scrapedSources.filter((s) => s.status === 'ok').length),
      }),
    [syncState.oniIndexObserved, syncState.scrapedSources],
  );

  const slides = pitchData.slides;
  const activeSlide: PitchSlideSpec = slides[slideIdx] ?? slides[0];

  const nextSlide = useCallback(() => {
    setSlideIdx((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!theaterMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setTheaterMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [theaterMode, nextSlide, prevSlide]);

  const handleExportPitchPdf = () => {
    const fn = exportExecutivePitchDeckPdf({ data: pitchData, lang: deckLang });
    setExportedFile(fn);
    window.setTimeout(() => setExportedFile(null), 4000);
  };

  const renderRightVisualStage = (slide: PitchSlideSpec) => {
    if (slide.visualKind === 'mlops-provinces') {
      return (
        <div className="flex h-full flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4">
          <div>
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isFr
                ? 'PERTES ÉCONOMIQUES 2027 PAR EX-PROVINCE (M USD)'
                : '2027 ECONOMIC LOSSES BY PROVINCE (M USD)'}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {isFr ? 'Comparaison S2 Base ML vs. S3 Choc Extrême' : 'S2 Baseline ML vs. S3 Extreme Shock'}
            </p>
          </div>
          <div className="mt-3 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pitchData.provinceLossChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10.5px' }} />
                <Bar
                  dataKey="primary"
                  name={isFr ? 'S2 Base ML (M$)' : 'S2 Baseline (M$)'}
                  fill="#1E3A8A"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="secondary"
                  name={isFr ? 'S3 Extrême (M$)' : 'S3 Extreme (M$)'}
                  fill="#BE123C"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (slide.visualKind === 'zonal-blocs') {
      return (
        <div className="flex h-full flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4">
          <div>
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800">
              {isFr
                ? 'INDICES COMPARÉS COI · SADC · COMESA · UA · ASEAN · UE (0–100)'
                : 'BLOC BENCHMARK: IOC · SADC · COMESA · AU · ASEAN · EU (0–100)'}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {isFr
                ? 'Intensité ENSO, Risque Agricole & Résilience Économique'
                : 'ENSO Intensity, Agricultural Risk & Economic Resilience'}
            </p>
          </div>
          <div className="mt-3 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pitchData.blocComparisonChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis dataKey="code" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10.5px' }} />
                <Bar dataKey="intensity" name={isFr ? 'Intensité' : 'Intensity'} fill="#1E3A8A" />
                <Bar dataKey="agriRisk" name={isFr ? 'Risque Agri' : 'Agri Risk'} fill="#BE123C" />
                <Bar dataKey="resilience" name={isFr ? 'Résilience' : 'Resilience'} fill="#047857" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (slide.visualKind === 'dataops') {
      const feeds = [
        {
          org: 'WMO / OMM',
          roleFr: 'Bulletins climatiques saisonniers mondiaux & ONI',
          roleEn: 'Global seasonal climate outlooks & ONI monitoring',
          cadence: 'SSE / RSS Live',
        },
        {
          org: 'NOAA CPC',
          roleFr: 'Série Niño 3.4 & discussions diagnostiques ENSO',
          roleEn: 'Niño 3.4 index & ENSO diagnostic discussions',
          cadence: 'Scrape 00:00 + RSS',
        },
        {
          org: 'UN GDACS',
          roleFr: 'Événements sécheresse, crues & cyclones Rouge/Orange',
          roleEn: 'Red/Orange drought, flood & tropical cyclone events',
          cadence: 'RSS XML + API',
        },
        {
          org: 'DGM / SWIOCOF-15',
          roleFr: 'Vigilance Grand Sud Madagascar, SAVA & Mascareignes',
          roleEn: 'Grand Sud Madagascar, SAVA & Mascarenes advisories',
          cadence: 'SSE Broadcast',
        },
        {
          org: 'Open-Meteo (15 Hubs)',
          roleFr: 'Anomalies pluie 7j & température sur 6 continents',
          roleEn: '7d rain anomaly & temperature across 6 continents',
          cadence: '15d + 00:00 Sync',
        },
      ];
      return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase text-[#1E3A8A]">
              <Radio className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
              <span>{isFr ? 'PIPELINE D’INGESTION TEMPS RÉEL' : 'LIVE INGESTION PIPELINE'}</span>
            </span>
            <span className="font-mono text-[10.5px] text-emerald-800">● SSE ACTIVE</span>
          </div>
          <ul className="mt-2 divide-y divide-zinc-100 text-xs">
            {feeds.map((f) => (
              <li key={f.org} className="flex items-start justify-between gap-3 py-2">
                <div>
                  <p className="font-semibold text-zinc-900">{f.org}</p>
                  <p className="text-[11px] text-zinc-600">{isFr ? f.roleFr : f.roleEn}</p>
                </div>
                <span className="shrink-0 font-mono text-[10.5px] font-semibold text-[#1E3A8A]">
                  {f.cadence}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (slide.visualKind === 'adam-smith') {
      const zones = [
        {
          zone: 'Grand Sud (Androy · Anosy)',
          cropFr: 'Sorgho/mil 90 j en Zaï (≥ 25 mm/3j)',
          cropEn: '90d sorghum/millet in Zaï (≥ 25 mm/3d)',
          infraFr: 'Goutte-à-goutte solaire + Sand dams',
          infraEn: 'Solar drip + Subsurface sand dams',
        },
        {
          zone: 'Alaotra-Mangoro · Bas-Mangoky',
          cropFr: 'Riz 110 j en irrigation intermittente AWD',
          cropEn: '110d rice under AWD rotation (−30% water)',
          infraFr: 'Barrages régulateurs & curage canaux',
          infraEn: 'Regulating dams & canal rehabilitation',
        },
        {
          zone: 'Hautes Terres (Analamanga · Vakinankaratra)',
          cropFr: 'Pomme de terre, blé/orge, maraîchage intensif',
          cropEn: 'Potato, highland wheat/barley, horticulture',
          infraFr: 'Serres ventilées & retenues collinaires',
          infraEn: 'Ventilated greenhouses & hillside ponds',
        },
        {
          zone: 'SAVA · Côte Est / Sud-Est',
          cropFr: 'Vanille ombrage Gliricidia 50 %, cacao, riz submergible',
          cropEn: '50% Gliricidia vanilla, cacao, flood-tolerant rice',
          infraFr: 'Serres solaires séchage & digues anti-crues',
          infraEn: 'Solar curing greenhouses & flood levees',
        },
      ];
      return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-2.5 font-mono text-[10.5px] font-semibold uppercase text-emerald-800">
            <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {isFr
                ? 'EXEMPLES DE SPÉCIALISATION TERRITORIALE (ADAM SMITH)'
                : 'REGIONAL SPECIALIZATION MATRIX (ADAM SMITH)'}
            </span>
          </div>
          <div className="mt-2.5 space-y-2.5">
            {zones.map((z) => (
              <div key={z.zone} className="rounded-md border border-zinc-100 bg-[#F9F8F4] p-2.5 text-xs">
                <p className="font-semibold text-zinc-900">{z.zone}</p>
                <p className="mt-0.5 text-[11px] text-zinc-700">{isFr ? z.cropFr : z.cropEn}</p>
                <p className="mt-0.5 font-mono text-[10.5px] font-semibold text-[#1E3A8A]">
                  {isFr ? z.infraFr : z.infraEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (slide.visualKind === 'roadmap') {
      const phases = [
        {
          step: '01',
          term: isFr ? 'J+30 à J+60 · Pilote National' : 'D+30 to D+60 · National Pilot',
          partners: 'FAO Madagascar · MINAE · MEDD · BNGRC',
          descFr: 'Calibration seuils DGM, formation DRAE & diffusion cahiers PDF hors ligne.',
          descEn: 'Calibrate DGM thresholds, train DRAE teams & roll out offline PDF briefs.',
        },
        {
          step: '02',
          term: isFr ? 'M+3 à M+6 · Blocs Régionaux' : 'M+3 to M+6 · Regional Blocs',
          partners: 'COI · SADC · COMESA · Instituts Nationaux',
          descFr: 'Interconnexion API mercuriales agricoles & modélisation XGBoost par bassin.',
          descEn: 'API hookups to national market price feeds & basin XGBoost calibration.',
        },
        {
          step: '03',
          term: isFr ? 'M+6 à M+12 · Échelle Continentale' : 'M+6 to M+12 · Continental Scale',
          partners: 'Union Africaine (UA / ARC) · OIF / Francophonie',
          descFr: 'Gouvernance 54 États UA, déclencheurs assurance paramétrique & hub francophone.',
          descEn: '54 AU country rollout, ARC parametric triggers & Francophone knowledge hub.',
        },
      ];
      return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-2.5 font-mono text-[10.5px] font-semibold uppercase text-[#1E3A8A]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isFr ? 'ARCHITECTURE DE PARTENARIAT' : 'PARTNERSHIP DEPLOYMENT PHASES'}</span>
          </div>
          <div className="mt-3 space-y-2.5">
            {phases.map((ph) => (
              <div key={ph.step} className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3 text-xs">
                <div className="flex items-center justify-between font-mono text-[10.5px] font-bold text-[#1E3A8A]">
                  <span>PHASE {ph.step}</span>
                  <span>{ph.term}</span>
                </div>
                <p className="mt-1 font-semibold text-zinc-900">{ph.partners}</p>
                <p className="mt-0.5 text-[11px] text-zinc-600">{isFr ? ph.descFr : ph.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default institutional stack diagram for Mandate & Last-Mile slides
    const layers =
      slide.visualKind === 'mandate'
        ? [
            {
              icon: Database,
              title: isFr ? 'DataOps Temps Réel' : 'Real-Time DataOps',
              sub: isFr
                ? 'WMO · NOAA · GDACS · DGM · 15 stations mondiales'
                : 'WMO · NOAA · GDACS · DGM · 15 global hubs',
            },
            {
              icon: Cpu,
              title: isFr ? 'MLOps & Économétrie' : 'MLOps & Econometrics',
              sub: isFr
                ? 'XGBoost–LSTM 2027–2032 · 119 districts · 195 États'
                : 'XGBoost–LSTM 2027–2032 · 119 districts · 195 states',
            },
            {
              icon: Sprout,
              title: isFr ? 'Économie d’Adam Smith' : 'Adam Smith Economics',
              sub: isFr
                ? 'Cultures T1–T4 & ouvrages hydro-agricoles (MàJ 15j)'
                : '4-quarter crop niches & hydro-engineering (15d sync)',
            },
            {
              icon: Globe,
              title: isFr ? 'IA Générative & Last-Mile' : 'GenAI & Offline Last-Mile',
              sub: isFr
                ? 'RAG FOFIFA · Voix Babakoto · PWA Hors Ligne · PDF/CSV'
                : 'FOFIFA RAG · Live Voice · Offline PWA · PDF/CSV',
            },
          ]
        : [
            {
              icon: Layers,
              title: isFr ? 'Service Worker PWA Hors Ligne' : 'Offline PWA Service Worker',
              sub: isFr
                ? 'Données 195 pays & 119 districts en cache local rural'
                : '195-country & 119-district datasets cached locally',
            },
            {
              icon: FileDown,
              title: isFr ? 'Exports PDF · DOCX · CSV' : 'PDF · DOCX · CSV Exports',
              sub: isFr
                ? 'Cahiers A4 coopératives & notes ministérielles'
                : 'Printable A4 cooperative briefs & policy notes',
            },
            {
              icon: Globe,
              title: isFr ? '9 Langues & Multilingue FR/EN' : '9 Languages & FR/EN Toggle',
              sub: isFr
                ? 'Couverture OIF, Union Africaine, SADC, COMESA & ONU'
                : 'OIF, African Union, SADC, COMESA & UN readiness',
            },
            {
              icon: Award,
              title: isFr ? 'Crop Resilience Quiz' : 'Crop Resilience Quiz',
              sub: isFr
                ? 'Évaluation interactive des gérants de coopératives'
                : 'Interactive drought-cycle training for cooperatives',
            },
          ];

    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="border-b border-zinc-100 pb-2.5 font-mono text-[10.5px] font-semibold uppercase text-[#1E3A8A]">
          {slide.visualKind === 'mandate'
            ? isFr
              ? 'ARCHITECTURE SOUVERAINE EN 4 COUCHES'
              : '4-LAYER SOVEREIGN ARCHITECTURE'
            : isFr
              ? 'DISPOSITIF TERRAIN & FRANCOPHONIE'
              : 'FIELD READINESS & MULTILINGUAL STACK'}
        </div>
        <div className="mt-3 space-y-2.5">
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.title}
                className="flex items-start gap-3 rounded-md border border-zinc-100 bg-[#F9F8F4] p-3"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{layer.title}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-600">{layer.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const wrapperClass = theaterMode
    ? 'fixed inset-0 z-50 overflow-y-auto bg-zinc-950/95 p-4 sm:p-8 flex flex-col justify-center'
    : 'border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-16';

  return (
    <section id="pitch-ministeriel" className={wrapperClass} aria-label="Ministerial Pitch Deck">
      <div className={`mx-auto w-full ${theaterMode ? 'max-w-[1240px]' : 'max-w-[1200px] px-4 sm:px-6 lg:px-8'}`}>
        {/* Top Deck Control Ribbon */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className={`font-mono text-xs font-semibold uppercase tracking-wider ${
                theaterMode ? 'text-emerald-400' : 'text-[#1E3A8A]'
              }`}
            >
              {isFr
                ? 'DOSSIER DE PRÉSENTATION OFFICIEL · FAO · UNION AFRICAINE · COI · SADC · COMESA · OIF'
                : 'EXECUTIVE BRIEFING DECK · FAO · AFRICAN UNION · IOC · SADC · COMESA · OIF'}
            </p>
            <h2
              className={`mt-1 font-serif text-2xl font-semibold tracking-tight sm:text-3xl ${
                theaterMode ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {isFr
                ? 'Pitch Stratégique : Observatoire ENSO 2026–2027 (M&G Consulting)'
                : 'Strategic Decision-Support Pitch: ENSO Observatory 2026–2027'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Inline FR/EN Presentation Toggle */}
            <div className="inline-flex rounded-md border border-zinc-300 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setDeckLang('fr')}
                className={`rounded px-2.5 py-1 font-semibold transition-colors ${
                  deckLang === 'fr' ? 'bg-[#1E3A8A] text-white' : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setDeckLang('en')}
                className={`rounded px-2.5 py-1 font-semibold transition-colors ${
                  deckLang === 'en' ? 'bg-[#1E3A8A] text-white' : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSpeakerNotes((prev) => !prev)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A] whitespace-nowrap"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span>
                {showSpeakerNotes
                  ? isFr
                    ? 'Masquer notes orateur'
                    : 'Hide Speaker Notes'
                  : isFr
                    ? 'Notes orateur'
                    : 'Speaker Notes'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportPitchPdf}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-rose-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-800 whitespace-nowrap"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isFr ? 'Exporter Pitch PDF (7 slides)' : 'Export Pitch PDF (7 slides)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTheaterMode((prev) => !prev)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#172554] whitespace-nowrap"
            >
              {theaterMode ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isFr ? 'Quitter plein écran' : 'Exit Full View'}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isFr ? 'Mode Conférence' : 'Presentation Mode'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {exportedFile && (
          <p className="mb-3 font-mono text-xs font-semibold text-emerald-700">
            ✓ {isFr ? 'Support PDF exporté :' : 'Pitch PDF exported:'} {exportedFile}
          </p>
        )}

        {/* Main Slide Canvas */}
        <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {/* Curatorial Slide Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-[#1E3A8A] px-5 py-3 text-white">
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider">
              <Presentation className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              <span>{isFr ? activeSlide.kickerFr : activeSlide.kickerEn}</span>
            </div>
            <span className="font-mono text-xs font-semibold tabular-nums">
              {activeSlide.slideNumber} / 0{slides.length}
            </span>
          </div>

          {/* Slide Body Grid */}
          <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-12">
            {/* Left Content Deck */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <h3 className="font-serif text-2xl font-semibold leading-snug text-zinc-900 sm:text-[28px]">
                  {isFr ? activeSlide.titleFr : activeSlide.titleEn}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
                  {isFr ? activeSlide.subtitleFr : activeSlide.subtitleEn}
                </p>

                {/* 3 Highlight Metrics */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {activeSlide.metrics.map((m) => (
                    <div
                      key={m.labelEn}
                      className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-3.5"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        {isFr ? m.labelFr : m.labelEn}
                      </p>
                      <p className="mt-1.5 font-mono text-2xl font-bold text-[#1E3A8A] tabular-nums">
                        {m.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-zinc-600">
                        {isFr ? m.contextFr : m.contextEn}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Strategic Takeaways */}
                <ul className="mt-5 space-y-2.5 border-t border-zinc-100 pt-4 text-xs sm:text-[13px] text-zinc-800">
                  {(isFr ? activeSlide.bulletsFr : activeSlide.bulletsEn).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="mt-1 font-mono text-[11px] font-bold text-emerald-700">
                        0{idx + 1}.
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Institutional Audience Line */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
                <span>
                  <strong className="text-zinc-700">
                    {isFr ? 'Interlocuteurs cibles : ' : 'Target delegates: '}
                  </strong>
                  {isFr ? activeSlide.audienceTagsFr : activeSlide.audienceTagsEn}
                </span>
                <span className="font-mono text-zinc-500">M&G Consulting · DG P. MANANTENASOA</span>
              </div>
            </div>

            {/* Right Visual Stage */}
            <div className="lg:col-span-5 bg-[#F9F8F4] rounded-lg p-1">{renderRightVisualStage(activeSlide)}</div>
          </div>

          {/* Speaker Notes Strip */}
          {showSpeakerNotes && (
            <div className="border-t border-amber-200/70 bg-amber-50/70 px-5 py-3 text-xs text-amber-950 sm:px-7">
              <span className="font-mono font-bold uppercase tracking-wider text-amber-900">
                {isFr ? 'Note de présentation (DG) : ' : 'Presenter Talking Point: '}
              </span>
              <span>{isFr ? activeSlide.speakerNoteFr : activeSlide.speakerNoteEn}</span>
            </div>
          )}

          {/* Slide Navigation Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-[#F9F8F4] px-5 py-3 sm:px-7">
            <div className="flex flex-wrap items-center gap-1.5">
              {slides.map((s, idx) => {
                const isCurrent = idx === slideIdx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Slide ${s.slideNumber}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => setSlideIdx(idx)}
                    className={`min-h-8 rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-[#1E3A8A] text-white'
                        : 'border border-zinc-300 bg-white text-zinc-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                    }`}
                  >
                    {s.slideNumber}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="inline-flex min-h-9 items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 whitespace-nowrap"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isFr ? 'Précédent' : 'Prev Slide'}</span>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="inline-flex min-h-9 items-center gap-1 rounded-md bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#172554] whitespace-nowrap"
              >
                <span>{isFr ? 'Suivant' : 'Next Slide'}</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
