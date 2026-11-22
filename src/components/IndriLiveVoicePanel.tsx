import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Calculator,
  Compass,
  MapPin,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Send,
  Sparkles,
  TrendingDown,
  Volume2,
} from 'lucide-react';
import { useLanguage, type LanguageCode } from '../i18n/LanguageContext';
import {
  getLocalizedObservatoryZones,
  compareZonesCalculation,
  computeZoneAnalysis,
  getCurrentSituationSnapshot,
  type HorizonYear,
  type ScenarioKey,
  type ZoneCalculationResult,
} from '../data/observatoryCalculator';
import { emitIndriActivity } from '../utils/indriEvents';

type LiveAvatarMode = 'indri-photo' | 'indri-svg' | 'analyst';
type LiveVoiceName = 'Zephyr' | 'Puck' | 'Kore' | 'Fenrir' | 'Charon';
type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';
type KineticState = 'idle' | 'listening' | 'calculating' | 'speaking';
type PhotoPoseKey =
  | 'auto'
  | 'studio'
  | 'portrait'
  | 'curious'
  | 'reaching'
  | 'canopy'
  | 'branch'
  | 'singing'
  | 'family';

interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'model';
  text: string;
  tag?: string;
}

const INDRI_GALLERY: {
  key: Exclude<PhotoPoseKey, 'auto'>;
  src: string;
  labelKey: 'studio' | 'attentive' | 'singing' | 'alert' | 'curious' | 'branch' | 'portrait' | 'mother';
  studioBlend?: boolean;
}[] = [
  {
    key: 'studio',
    src: '/assets/aistudio/image_3099989e.png',
    labelKey: 'studio',
    studioBlend: true,
  },
  {
    key: 'portrait',
    src: '/assets/aistudio/image_893e18b0.png',
    labelKey: 'attentive',
  },
  {
    key: 'singing',
    src: '/assets/aistudio/image_c0603431.png',
    labelKey: 'singing',
  },
  {
    key: 'reaching',
    src: '/assets/aistudio/image_5c7d5950.png',
    labelKey: 'alert',
  },
  {
    key: 'curious',
    src: '/assets/aistudio/image_29c06e31.png',
    labelKey: 'curious',
  },
  {
    key: 'canopy',
    src: '/assets/aistudio/image_ee2ef782.png',
    labelKey: 'branch',
  },
  {
    key: 'branch',
    src: '/assets/aistudio/image_81fe2452.png',
    labelKey: 'portrait',
  },
  {
    key: 'family',
    src: '/assets/aistudio/image_f18a88c6.png',
    labelKey: 'mother',
  },
];

const VOICE_OPTIONS: { id: LiveVoiceName; label: string }[] = [
  { id: 'Zephyr', label: 'Zephyr' },
  { id: 'Kore', label: 'Kore' },
  { id: 'Puck', label: 'Puck' },
  { id: 'Charon', label: 'Charon' },
  { id: 'Fenrir', label: 'Fenrir' },
];

const UI_TEXT: Record<
  LanguageCode,
  {
    title: string;
    subtitle: string;
    avatarLabel: string;
    avatarPhoto: string;
    avatarSvg: string;
    avatarAnalyst: string;
    poseLabel: string;
    poseAuto: string;
    voiceLabel: string;
    startBtn: string;
    stopBtn: string;
    connectingBtn: string;
    muteBtn: string;
    unmuteBtn: string;
    statusIdle: string;
    statusConnecting: string;
    statusListening: string;
    statusCalculating: string;
    statusSpeaking: string;
    statusMuted: string;
    zoneLabel: string;
    horizonLabel: string;
    scenarioLabel: string;
    quickSituation: string;
    quickZoneCalc: string;
    quickCompare: string;
    quickCalendar: string;
    calcCardTitle: string;
    recommendationsLabel: string;
    transcriptTitle: string;
    transcriptEmpty: string;
    youLabel: string;
    indriSpeaker: string;
    analystSpeaker: string;
    cuePlaceholder: string;
    cuePlaceholderVoice: string;
    micPermissionError: string;
  }
> = {
  fr: {
    title: 'Babakoto · Interlocuteur Indri indri de Madagascar',
    subtitle:
      'Interagissez à la voix (Gemini 3.8 Live) ou par écrit avec Babakoto : il s’anime en direct, lance les calculs ML/économiques sur la zone demandée et affiche les prévisions 2027–2028.',
    avatarLabel: 'Mode graphique',
    avatarPhoto: 'Photo Réactive',
    avatarSvg: 'Vectoriel',
    avatarAnalyst: 'Console Audio',
    poseLabel: 'Posture Indri indri',
    poseAuto: 'Auto-Réactif',
    voiceLabel: 'Voix Live',
    startBtn: 'Parler au micro (Live)',
    stopBtn: 'Raccrocher',
    connectingBtn: 'Connexion Live...',
    muteBtn: 'Couper micro',
    unmuteBtn: 'Réactiver micro',
    statusIdle: 'En veille · Posez une question écrite ou démarrez l’appel vocal',
    statusConnecting: 'Connexion à Gemini 3.8 Live...',
    statusListening: 'À l’écoute · Babakoto capte votre voix',
    statusCalculating: 'Calcul des pertes et prévisions sur la zone en cours...',
    statusSpeaking: 'Babakoto répond et commente les résultats...',
    statusMuted: 'Microphone en sourdine',
    zoneLabel: 'Zone ciblée (District, Région, Province ou Pays)',
    horizonLabel: 'Horizon',
    scenarioLabel: 'Scénario',
    quickSituation: 'Situation actuelle (Nov. 2026)',
    quickZoneCalc: 'Calcul & prédiction sur la zone',
    quickCompare: 'Comparer avec SADC / COMESA',
    quickCalendar: 'Calendrier FOFIFA de la zone',
    calcCardTitle: 'Fiche Calcul & Prédiction en Direct',
    recommendationsLabel: 'Actions & repères terrain',
    transcriptTitle: 'Dialogue & Résultats avec Babakoto',
    transcriptEmpty:
      'Demandez la situation actuelle, un calcul de pertes ou une prédiction sur Ambovombe, Boeny, SAVA, Zambie, etc. (par écrit ou au micro).',
    youLabel: 'Vous',
    indriSpeaker: 'Indri indri (Babakoto)',
    analystSpeaker: 'Observatoire AI',
    cuePlaceholder: 'Demander une info, un calcul ou une prédiction sur une zone...',
    cuePlaceholderVoice: 'Envoyer aussi une précision écrite pendant l’appel vocal...',
    micPermissionError:
      'Accès au microphone refusé ou indisponible. Vous pouvez toutefois dialoguer par écrit avec Babakoto ci-contre.',
  },
  en: {
    title: 'Babakoto · Madagascar Indri indri Interactive Spokesperson',
    subtitle:
      'Interact by live voice (Gemini 3.8 Live) or text with Babakoto: the lemur moves reactively, runs zone loss & yield calculations, and presents 2027–2028 forecasts.',
    avatarLabel: 'Graphical Mode',
    avatarPhoto: 'Reactive Photo',
    avatarSvg: 'Vector Rig',
    avatarAnalyst: 'Audio Console',
    poseLabel: 'Indri indri Posture',
    poseAuto: 'Auto-Reactive',
    voiceLabel: 'Live Voice',
    startBtn: 'Start Voice Call',
    stopBtn: 'End Call',
    connectingBtn: 'Connecting Live...',
    muteBtn: 'Mute Mic',
    unmuteBtn: 'Unmute Mic',
    statusIdle: 'Ready · Ask a typed question or start a real-time voice call',
    statusConnecting: 'Connecting to Gemini 3.8 Live...',
    statusListening: 'Listening · Speak naturally into your microphone',
    statusCalculating: 'Computing zone yields and economic losses...',
    statusSpeaking: 'Babakoto is answering live...',
    statusMuted: 'Microphone muted',
    zoneLabel: 'Target Zone (District, Region, Province or Country)',
    horizonLabel: 'Horizon',
    scenarioLabel: 'Scenario',
    quickSituation: 'Current situation (Nov 2026)',
    quickZoneCalc: 'Compute zone loss & forecast',
    quickCompare: 'Compare with SADC / COMESA',
    quickCalendar: 'FOFIFA zone calendar',
    calcCardTitle: 'Live Calculation & Forecast Card',
    recommendationsLabel: 'Field advisories & benchmarks',
    transcriptTitle: 'Live Dialogue with Babakoto',
    transcriptEmpty:
      'Ask about the current El Niño situation, losses, or predictions for any district, region, or country (via mic or text).',
    youLabel: 'You',
    indriSpeaker: 'Indri indri (Babakoto)',
    analystSpeaker: 'Observatory AI',
    cuePlaceholder: 'Ask Babakoto for info, calculations, or zone predictions...',
    cuePlaceholderVoice: 'Send a text prompt during the active voice call...',
    micPermissionError:
      'Microphone access unavailable. You can still interact directly with Babakoto using text queries.',
  },
  sw: {
    title: 'Babakoto · Msemaji wa Indri indri wa Madagaska',
    subtitle:
      'Zungumza kwa sauti (Gemini 3.8 Live) au andika swali kwa Babakoto: anasogea moja kwa moja, anafanya mahesabu ya hasara na utabiri wa 2027–2028 kwa kila eneo.',
    avatarLabel: 'Mwonekano',
    avatarPhoto: 'Picha Hai',
    avatarSvg: 'Michoro',
    avatarAnalyst: 'Koni ya Sauti',
    poseLabel: 'Hali ya Indri indri',
    poseAuto: 'Otomatiki',
    voiceLabel: 'Sauti Live',
    startBtn: 'Anza Mazungumzo ya Sauti',
    stopBtn: 'Kata Simu',
    connectingBtn: 'Inaunganisha Live...',
    muteBtn: 'Zima Maikrofoni',
    unmuteBtn: 'Washa Maikrofoni',
    statusIdle: 'Tayari · Andika swali au anza simu ya sauti',
    statusConnecting: 'Inaunganisha Gemini 3.8 Live...',
    statusListening: 'Inasikiliza · Zungumza kwenye maikrofoni',
    statusCalculating: 'Inakokotoa hasara na utabiri wa eneo...',
    statusSpeaking: 'Babakoto anajibu moja kwa moja...',
    statusMuted: 'Maikrofoni imezimwa',
    zoneLabel: 'Eneo Lengwa (Wilaya, Mkoa, Jimbo au Nchi)',
    horizonLabel: 'Mwaka',
    scenarioLabel: 'Hali',
    quickSituation: 'Hali ya sasa (Nov 2026)',
    quickZoneCalc: 'Kokotoa hasara na utabiri wa eneo',
    quickCompare: 'Linganisha na SADC / COMESA',
    quickCalendar: 'Kalenda ya FOFIFA ya eneo',
    calcCardTitle: 'Matokeo ya Mahesabu na Utabiri',
    recommendationsLabel: 'Hatua za shambani',
    transcriptTitle: 'Mazungumzo na Babakoto',
    transcriptEmpty:
      'Uliza hali ya sasa, mahesabu ya hasara au utabiri kuhusu wilaya, mkoa au nchi yoyote.',
    youLabel: 'Wewe',
    indriSpeaker: 'Indri indri (Babakoto)',
    analystSpeaker: 'Observatory AI',
    cuePlaceholder: 'Uliza taarifa, mahesabu au utabiri wa eneo...',
    cuePlaceholderVoice: 'Tuma maandishi wakati wa simu ya sauti...',
    micPermissionError:
      'Ruhusa ya maikrofoni haipatikani. Bado unaweza kuwasiliana na Babakoto kwa maandishi.',
  },
};

function pcmFloat32ToBase64(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64Pcm24kToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768;
  }
  return float32;
}

function IndriPhotorealInteractiveStage({
  kineticState,
  lockedPose,
  outputLevel,
  inputLevel,
  isConnected,
  activeZoneLabel,
}: {
  kineticState: KineticState;
  lockedPose: PhotoPoseKey;
  outputLevel: number;
  inputLevel: number;
  isConnected: boolean;
  activeZoneLabel: string;
}) {
  const { ui } = useLanguage();
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [blinkPulse, setBlinkPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkPulse(true);
      setTimeout(() => setBlinkPulse(false), 160);
    }, 4400);
    return () => clearInterval(interval);
  }, []);

  const resolvedPoseKey: Exclude<PhotoPoseKey, 'auto'> = useMemo(() => {
    if (lockedPose !== 'auto') return lockedPose;
    if (kineticState === 'calculating') return 'reaching';
    if (kineticState === 'speaking') {
      return outputLevel > 0.08 ? 'singing' : 'curious';
    }
    if (kineticState === 'listening') {
      return inputLevel > 0.04 ? 'portrait' : 'studio';
    }
    return 'studio';
  }, [lockedPose, kineticState, outputLevel, inputLevel]);

  const poseItem =
    INDRI_GALLERY.find((g) => g.key === resolvedPoseKey) ?? INDRI_GALLERY[0];

  const speakScale =
    kineticState === 'speaking' ? 1 + Math.min(0.065, outputLevel * 0.28) : 1;
  const speakTilt =
    kineticState === 'speaking'
      ? Math.sin(outputLevel * 18) * 2.2
      : kineticState === 'calculating'
        ? -2.5
        : kineticState === 'listening'
          ? 1.5
          : 0;

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setPointerOffset({ x: nx * 10, y: ny * 8 });
      }}
      onMouseLeave={() => setPointerOffset({ x: 0, y: 0 })}
      className="relative mx-auto flex h-[290px] w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-gradient-to-b from-[#F9F8F4] via-white to-[#F2F0E8]"
    >
      {/* Subtle Rainforest Acoustic Aura Rings */}
      <motion.div
        animate={{
          scale:
            kineticState === 'speaking'
              ? 1 + Math.min(0.18, outputLevel * 0.9)
              : kineticState === 'calculating'
                ? [1, 1.08, 1]
                : kineticState === 'listening'
                  ? 1 + Math.min(0.12, inputLevel * 0.8)
                  : 1,
          opacity:
            kineticState === 'speaking'
              ? 0.55
              : kineticState === 'calculating'
                ? 0.65
                : isConnected
                  ? 0.35
                  : 0.14,
        }}
        transition={
          kineticState === 'calculating'
            ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.12 }
        }
        className={`pointer-events-none absolute h-56 w-56 rounded-full border-2 border-dashed ${
          kineticState === 'speaking'
            ? 'border-emerald-600/60'
            : kineticState === 'calculating'
              ? 'border-amber-600/70'
              : 'border-[#1E3A8A]/45'
        }`}
      />

      <motion.div
        animate={{
          scale:
            kineticState === 'speaking'
              ? 1 + Math.min(0.28, outputLevel * 1.4)
              : 0.94,
          opacity: kineticState === 'speaking' ? 0.35 : 0.08,
        }}
        transition={{ duration: 0.1 }}
        className="pointer-events-none absolute h-64 w-64 rounded-full border border-emerald-700/35"
      />

      {/* Interactive Animated Photographic Indri indri */}
      <motion.div
        animate={{
          x: pointerOffset.x,
          y:
            kineticState === 'idle'
              ? [0, -4, 0]
              : kineticState === 'calculating'
                ? [-3, 3, -3]
                : kineticState === 'speaking'
                  ? -Math.min(7, outputLevel * 28)
                  : pointerOffset.y,
          rotate: speakTilt + pointerOffset.x * 0.25,
          scale: speakScale,
        }}
        transition={
          kineticState === 'idle'
            ? {
                y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
                x: { type: 'spring', stiffness: 120, damping: 16 },
                rotate: { type: 'spring', stiffness: 120, damping: 16 },
              }
            : kineticState === 'calculating'
              ? {
                  y: { duration: 0.75, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 0.25 },
                }
              : { type: 'spring', stiffness: 240, damping: 18 }
        }
        className="relative z-10 flex h-full w-full items-center justify-center p-2"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={poseItem.src}
            src={poseItem.src}
            alt={`Indri indri (Babakoto) — ${ui.indriVoice.galleryLabels[poseItem.labelKey] ?? poseItem.key}`}
            initial={{ opacity: 0.4, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.4, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            className={
              poseItem.studioBlend
                ? 'h-[262px] w-auto object-contain mix-blend-multiply select-none pointer-events-none'
                : 'h-[246px] w-[246px] rounded-xl object-cover shadow-md border-2 border-white select-none pointer-events-none'
            }
          />
        </AnimatePresence>

        {/* Subtle Eye-Attentive Highlight & Soundwave Overlay during active speech/calc */}
        {poseItem.studioBlend && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {blinkPulse && (
              <span className="sr-only">Blink</span>
            )}
          </div>
        )}
      </motion.div>

      {/* Top-Left Kinetic State Indicator */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded border border-zinc-200 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-zinc-800 shadow-xs">
        <span
          className={`h-2 w-2 rounded-sm ${
            kineticState === 'speaking'
              ? 'bg-emerald-600'
              : kineticState === 'calculating'
                ? 'bg-amber-600'
                : kineticState === 'listening'
                  ? 'bg-[#1E3A8A]'
                  : 'bg-zinc-400'
          }`}
        />
        <span>
          {kineticState === 'speaking'
            ? ui.indriVoice.stageBadgeSpeaking
            : kineticState === 'calculating'
              ? ui.indriVoice.stageBadgeComputing
              : kineticState === 'listening'
                ? ui.indriVoice.stageBadgeListening
                : 'Babakoto · Indri indri'}
        </span>
      </div>

      {/* Top-Right Active Target Zone Tag */}
      <div className="pointer-events-none absolute top-2.5 right-2.5 z-20 flex max-w-[155px] items-center gap-1 rounded border border-zinc-200 bg-white/95 px-2 py-1 text-[10px] font-medium text-[#1E3A8A] shadow-xs">
        <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{activeZoneLabel}</span>
      </div>

      {/* Bottom Live Audio Equalizer Bar Strip (Reacting to Voice/Speech) */}
      {(kineticState === 'speaking' || kineticState === 'listening' || kineticState === 'calculating') && (
        <div className="pointer-events-none absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-end gap-1 rounded border border-zinc-200 bg-white/95 px-3 py-1.5 shadow-xs">
          {Array.from({ length: 12 }).map((_, i) => {
            const amp =
              kineticState === 'speaking'
                ? Math.min(1, outputLevel * 3.8 * (0.5 + Math.sin(i * 0.6)))
                : kineticState === 'calculating'
                  ? 0.35 + ((i % 3) * 0.2)
                  : Math.min(0.85, inputLevel * 5 * (0.4 + Math.cos(i * 0.5)));
            return (
              <span
                key={i}
                className={`w-1 rounded-t transition-all duration-75 ${
                  kineticState === 'speaking'
                    ? 'bg-emerald-700'
                    : kineticState === 'calculating'
                      ? 'bg-amber-600'
                      : 'bg-[#1E3A8A]'
                }`}
                style={{ height: `${Math.max(4, Math.round(amp * 18))}px` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function IndriIndriSvgAvatar({
  outputLevel,
  inputLevel,
  isConnected,
  isSpeaking,
}: {
  outputLevel: number;
  inputLevel: number;
  isConnected: boolean;
  isSpeaking: boolean;
}) {
  const { ui } = useLanguage();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const mouthOpen = Math.min(1, outputLevel * 2.4);
  const earLift = Math.min(5, inputLevel * 28);
  const headTilt = isSpeaking ? Math.sin(outputLevel * 12) * 2.2 : inputLevel > 0.04 ? -2 : 0;

  return (
    <div className="relative mx-auto flex h-[290px] w-full items-center justify-center rounded-lg border border-zinc-200 bg-white">
      <svg
        viewBox="0 0 280 280"
        className="h-64 w-64 select-none"
        role="img"
        aria-label={ui.indriVoice.stageAriaLabel}
      >
        <circle cx="140" cy="140" r="132" fill="#F9F8F4" stroke="#D4D4D8" strokeWidth="1.5" />
        <circle
          cx="140"
          cy="140"
          r={112 + outputLevel * 14}
          fill="none"
          stroke={isConnected ? '#1E3A8A' : '#A1A1AA'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity={isSpeaking ? 0.6 : 0.14}
        />
        <path
          d="M66 254 C70 202, 96 178, 140 178 C184 178, 210 202, 214 254 Z"
          fill="#18181B"
        />
        <path d="M78 248 C82 214, 98 194, 114 190 C104 214, 98 236, 98 252 Z" fill="#F4F4F5" />
        <path d="M202 248 C198 214, 182 194, 166 190 C176 214, 182 236, 182 252 Z" fill="#F4F4F5" />
        <path d="M114 184 Q140 212 166 184 Q158 228 140 236 Q122 228 114 184 Z" fill="#FAFAFA" />
        <g transform={`rotate(${headTilt.toFixed(2)} 140 128)`}>
          <g transform={`translate(0, ${(-earLift).toFixed(2)})`}>
            <ellipse cx="76" cy="96" rx="22" ry="26" fill="#18181B" />
            <ellipse cx="204" cy="96" rx="22" ry="26" fill="#18181B" />
          </g>
          <ellipse cx="140" cy="126" rx="58" ry="56" fill="#18181B" />
          <path
            d="M92 126 C92 94, 114 82, 140 82 C166 82, 188 94, 188 126 C188 158, 166 176, 140 176 C114 176, 92 158, 92 126 Z"
            fill="#F4F4F5"
          />
          <ellipse cx="140" cy="130" rx="34" ry="30" fill="#27272A" />
          {blink ? (
            <>
              <path d="M114 118 Q123 122 132 118" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
              <path d="M148 118 Q157 122 166 118" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
            </>
          ) : (
            <>
              <circle cx="123" cy="118" r="9" fill="#F59E0B" />
              <circle cx="123" cy="118" r="4.2" fill="#09090B" />
              <circle cx="157" cy="118" r="9" fill="#F59E0B" />
              <circle cx="157" cy="118" r="4.2" fill="#09090B" />
            </>
          )}
          <ellipse cx="140" cy="134" rx="5.5" ry="3.8" fill="#09090B" />
          <ellipse
            cx="140"
            cy={148 + mouthOpen * 4}
            rx={8 + mouthOpen * 5.5}
            ry={1.8 + mouthOpen * 8.5}
            fill="#09090B"
            stroke="#52525B"
          />
        </g>
      </svg>
    </div>
  );
}

export function IndriLiveVoicePanel() {
  const { lang, worldLang, ui } = useLanguage();
  const copy = UI_TEXT[lang];
  const localizedZoneOptions = useMemo(() => getLocalizedObservatoryZones(lang), [lang]);
  const zoneGroups = useMemo(
    () => Array.from(new Set(localizedZoneOptions.map((o) => o.group))),
    [localizedZoneOptions],
  );

  const [avatarMode, setAvatarMode] = useState<LiveAvatarMode>('indri-photo');
  const [lockedPose, setLockedPose] = useState<PhotoPoseKey>('auto');
  const [voiceName, setVoiceName] = useState<LiveVoiceName>('Zephyr');
  const [connState, setConnState] = useState<ConnectionState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [textSpeakingPulse, setTextSpeakingPulse] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [cueInput, setCueInput] = useState('');

  // Zone / Horizon / Scenario Interactive Controls
  const [selectedZoneQuery, setSelectedZoneQuery] = useState<string>('Ambovombe');
  const [selectedYear, setSelectedYear] = useState<HorizonYear>(2027);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('s2');
  const [activeCard, setActiveCard] = useState<ZoneCalculationResult>(() =>
    computeZoneAnalysis({ zoneQuery: 'Ambovombe', year: 2027, scenario: 's2', lang }),
  );

  useEffect(() => {
    setActiveCard((prev) => {
      if (prev.kind === 'situation') return getCurrentSituationSnapshot(selectedScenario, lang);
      if (prev.kind === 'comparison') {
        return compareZonesCalculation({
          zoneA: selectedZoneQuery,
          zoneB: 'Zambie',
          year: selectedYear,
          scenario: selectedScenario,
          lang,
        });
      }
      return computeZoneAnalysis({
        zoneQuery: selectedZoneQuery,
        year: selectedYear,
        scenario: selectedScenario,
        lang,
      });
    });
  }, [lang, selectedZoneQuery, selectedYear, selectedScenario]);

  // Audio-reactive visualization state
  const [outputLevel, setOutputLevel] = useState(0);
  const [inputLevel, setInputLevel] = useState(0);

  // Refs to prevent stale closures in WebSocket / onaudioprocess / rAF
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const isMutedRef = useRef<boolean>(false);
  const inputRmsRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const transcriptBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [transcripts]);

  const stopAllPlayback = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {
        // Already stopped
      }
    });
    activeSourcesRef.current.clear();
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
  }, []);

  const cleanupSession = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    stopAllPlayback();

    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
      try {
        processorRef.current.disconnect();
      } catch {
        // Ignore
      }
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    analyserRef.current = null;

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // Ignore
      }
      wsRef.current = null;
    }

    inputRmsRef.current = 0;
    setInputLevel(0);
    setOutputLevel(0);
    setIsCalculating(false);
  }, [stopAllPlayback]);

  useEffect(() => {
    return () => {
      cleanupSession();
    };
  }, [cleanupSession]);

  const appendTranscriptFragment = useCallback(
    (speaker: 'user' | 'model', chunk: string, tag?: string) => {
      if (!chunk) return;
      setTranscripts((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.speaker === speaker && !tag) {
          return [...prev.slice(0, -1), { ...last, text: `${last.text}${chunk}` }];
        }
        return [
          ...prev,
          { id: `${speaker}-${Date.now()}-${Math.random()}`, speaker, text: chunk, tag },
        ];
      });
    },
    [],
  );

  const playPcm24kChunk = useCallback((base64Audio: string) => {
    const ctx = outputAudioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    const floatData = base64Pcm24kToFloat32(base64Audio);
    if (floatData.length === 0) return;

    const channelCopy = new Float32Array(floatData.length);
    channelCopy.set(floatData);

    const buffer = ctx.createBuffer(1, channelCopy.length, 24000);
    buffer.copyToChannel(channelCopy, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);

    const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
    source.start(startAt);
    nextStartTimeRef.current = startAt + buffer.duration;

    activeSourcesRef.current.add(source);
    source.onended = () => {
      activeSourcesRef.current.delete(source);
    };
  }, []);

  const startAnimationLoop = useCallback(() => {
    const dataArray = new Uint8Array(64);
    const tick = () => {
      let outRms = 0;
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
        let sumSq = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSq += norm * norm;
        }
        outRms = Math.sqrt(sumSq / dataArray.length);
      }
      setOutputLevel(outRms);
      setInputLevel(inputRmsRef.current);
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  const handleStartLive = async () => {
    if (connState === 'connecting' || connState === 'connected') return;
    setErrorMsg(null);
    setConnState('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (outputCtx.state === 'suspended') await outputCtx.resume();

      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const analyser = outputCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.connect(outputCtx.destination);
      analyserRef.current = analyser;

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const avatarQuery = avatarMode === 'analyst' ? 'analyst' : 'indri';
      const wsUrl = `${wsProtocol}//${window.location.host}/live?lang=${encodeURIComponent(worldLang)}&voice=${encodeURIComponent(voiceName)}&avatar=${encodeURIComponent(avatarQuery)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const silentGain = inputCtx.createGain();
      silentGain.gain.value = 0;
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(inputCtx.destination);

      processor.onaudioprocess = (event) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || isMutedRef.current) {
          inputRmsRef.current = 0;
          return;
        }
        const samples = event.inputBuffer.getChannelData(0);
        let sumSq = 0;
        for (let i = 0; i < samples.length; i++) {
          sumSq += samples[i] * samples[i];
        }
        inputRmsRef.current = Math.sqrt(sumSq / samples.length);
        const base64 = pcmFloat32ToBase64(samples);
        wsRef.current.send(JSON.stringify({ audio: base64 }));
      };

      ws.onmessage = (event) => {
        let msg: {
          status?: string;
          audio?: string;
          inputTranscript?: string;
          outputTranscript?: string;
          interrupted?: boolean;
          toolActivity?: { status: string; toolName?: string };
          calculationCard?: ZoneCalculationResult;
          interactionStatus?: 'IN_PROGRESS' | 'IDLE';
          error?: string;
        };
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        if (msg.error) {
          setErrorMsg(msg.error);
          setConnState('error');
          cleanupSession();
          return;
        }

        if (msg.status === 'ready') {
          setConnState('connected');
          startAnimationLoop();
        }
        if (msg.toolActivity?.status === 'calculating') {
          setIsCalculating(true);
        }
        if (msg.calculationCard) {
          setActiveCard(msg.calculationCard);
          setIsCalculating(false);
        }
        if (msg.interactionStatus === 'IDLE') {
          setIsCalculating(false);
        }
        if (msg.audio) {
          playPcm24kChunk(msg.audio);
        }
        if (msg.inputTranscript) {
          appendTranscriptFragment('user', msg.inputTranscript);
        }
        if (msg.outputTranscript) {
          appendTranscriptFragment('model', msg.outputTranscript);
        }
        if (msg.interrupted) {
          stopAllPlayback();
        }
      };

      ws.onerror = () => {
        setErrorMsg('WebSocket connection error with Gemini 3.8 Live.');
        setConnState('error');
        cleanupSession();
      };

      ws.onclose = () => {
        setConnState((prev) => (prev === 'error' ? 'error' : 'idle'));
        cleanupSession();
      };
    } catch {
      setErrorMsg(copy.micPermissionError);
      setConnState('error');
      cleanupSession();
    }
  };

  const handleStopLive = () => {
    cleanupSession();
    setConnState('idle');
    setIsMuted(false);
  };

  // Update card cleanly whenever the user adjusts zone/horizon/scenario manually
  const refreshZoneCalculation = (
    nextZone = selectedZoneQuery,
    nextYear = selectedYear,
    nextScenario = selectedScenario,
  ) => {
    setSelectedZoneQuery(nextZone);
    setSelectedYear(nextYear);
    setSelectedScenario(nextScenario);
    setIsCalculating(true);
    setTimeout(() => {
      setActiveCard(
        computeZoneAnalysis({
          zoneQuery: nextZone,
          year: nextYear,
          scenario: nextScenario,
          lang,
        }),
      );
      setIsCalculating(false);
    }, 220);
  };

  // Unified query sender: pipes over Live WebSocket if connected, or runs interactive /api/indri/interact!
  const handleAskBabakoto = async (overrideText?: string, forceMode?: 'situation' | 'compare') => {
    const clean = (overrideText ?? cueInput).trim();
    if (!clean || isCalculating) return;
    if (!overrideText) setCueInput('');
    setErrorMsg(null);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsCalculating(true);
      wsRef.current.send(JSON.stringify({ text: clean }));
      setTranscripts((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, speaker: 'user', text: clean },
      ]);
      return;
    }

    // Text-interactive mode (no active mic call required!)
    setTranscripts((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, speaker: 'user', text: clean },
    ]);
    setIsCalculating(true);

    // Pre-compute deterministic HUD immediately if triggered from situation/compare shortcuts
    if (forceMode === 'situation') {
      setActiveCard(getCurrentSituationSnapshot(selectedScenario, lang));
    } else if (forceMode === 'compare') {
      setActiveCard(
        compareZonesCalculation({
          zoneA: selectedZoneQuery,
          zoneB: 'Zambie',
          year: selectedYear,
          scenario: selectedScenario,
          lang,
        }),
      );
    }

    try {
      const res = await fetch('/api/indri/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          zoneQuery: selectedZoneQuery,
          year: selectedYear,
          scenario: selectedScenario,
          lang: worldLang,
          history: transcripts.slice(-6).map((tItem) => ({
            role: tItem.speaker === 'user' ? 'user' : 'model',
            text: tItem.text,
          })),
        }),
      });
      const data = await res.json();
      if (data.calculationCard) {
        setActiveCard(data.calculationCard);
      }
      const replyText: string =
        data.reply ||
        computeZoneAnalysis({
          zoneQuery: selectedZoneQuery,
          year: selectedYear,
          scenario: selectedScenario,
          lang,
        }).summaryText;

      setTranscripts((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          speaker: 'model',
          text: replyText,
          tag: data.calculationCard?.zoneName,
        },
      ]);

      // Trigger expressive speaking animation briefly after reply arrives
      setTextSpeakingPulse(true);
      setTimeout(() => setTextSpeakingPulse(false), 2400);
    } catch {
      const localCard = computeZoneAnalysis({
        zoneQuery: selectedZoneQuery,
        year: selectedYear,
        scenario: selectedScenario,
        lang,
      });
      setActiveCard(localCard);
      setTranscripts((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          speaker: 'model',
          text: localCard.summaryText,
          tag: localCard.zoneName,
        },
      ]);
    } finally {
      setIsCalculating(false);
    }
  };

  const isConnected = connState === 'connected';
  const isSpeaking = outputLevel > 0.025 || textSpeakingPulse;
  const kineticState: KineticState = isCalculating
    ? 'calculating'
    : isSpeaking
      ? 'speaking'
      : isConnected && !isMuted
        ? 'listening'
        : 'idle';

  useEffect(() => {
    if (kineticState === 'calculating') {
      emitIndriActivity({
        state: 'processing',
        label: ui.indriVoice.indriActivityLiveCalculating,
        detail: `${activeCard.zoneName.split(' (')[0]} · ${activeCard.year} · ${activeCard.scenario.toUpperCase()}`,
      });
    } else if (kineticState === 'speaking') {
      emitIndriActivity({
        state: 'speaking',
        label: ui.indriVoice.indriActivityLiveAnswering,
        detail: `${activeCard.zoneName.split(' (')[0]} · ${activeCard.riskBadge}`,
      });
    } else if (kineticState === 'listening') {
      emitIndriActivity({
        state: 'listening',
        label: ui.indriVoice.indriActivityLiveConnected,
        detail: copy.statusListening,
      });
    }
  }, [
    kineticState,
    activeCard.zoneName,
    activeCard.year,
    activeCard.scenario,
    activeCard.riskBadge,
    ui.indriVoice.indriActivityLiveCalculating,
    ui.indriVoice.indriActivityLiveAnswering,
    ui.indriVoice.indriActivityLiveConnected,
    copy.statusListening,
  ]);

  const statusText =
    connState === 'connecting'
      ? copy.statusConnecting
      : kineticState === 'calculating'
        ? copy.statusCalculating
        : kineticState === 'speaking'
          ? copy.statusSpeaking
          : isConnected && isMuted
            ? copy.statusMuted
            : isConnected
              ? copy.statusListening
              : copy.statusIdle;

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: ANIMATED INDRI INDRI GRAPHICAL INTERLOCUTOR + CALL & ZONE CONTROLS */}
      <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 lg:col-span-5">
        <div>
          <h3 className="font-serif text-xl font-semibold text-zinc-900">{copy.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">{copy.subtitle}</p>

          {/* Graphical Mode & Voice Selector */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
            <div className="sm:col-span-8">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {copy.avatarLabel}
              </span>
              <div className="mt-1 grid grid-cols-3 gap-1 rounded-md border border-zinc-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setAvatarMode('indri-photo')}
                  className={`rounded px-1.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    avatarMode === 'indri-photo'
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {copy.avatarPhoto}
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarMode('indri-svg')}
                  className={`rounded px-1.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    avatarMode === 'indri-svg'
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {copy.avatarSvg}
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarMode('analyst')}
                  className={`rounded px-1.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    avatarMode === 'analyst'
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {copy.avatarAnalyst}
                </button>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="live-voice-select"
                className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
              >
                {copy.voiceLabel}
              </label>
              <select
                id="live-voice-select"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value as LiveVoiceName)}
                disabled={isConnected}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-zinc-900 disabled:opacity-70 focus:border-[#1E3A8A] focus:outline-none"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {ui.indriVoice.voiceLabels[v.id] ?? v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Indri indri Graphical Stage */}
          <div className="mt-4">
            {avatarMode === 'indri-photo' ? (
              <IndriPhotorealInteractiveStage
                kineticState={kineticState}
                lockedPose={lockedPose}
                outputLevel={outputLevel}
                inputLevel={inputLevel}
                isConnected={isConnected}
                activeZoneLabel={activeCard.zoneName}
              />
            ) : avatarMode === 'indri-svg' ? (
              <IndriIndriSvgAvatar
                outputLevel={outputLevel}
                inputLevel={inputLevel}
                isConnected={isConnected}
                isSpeaking={isSpeaking}
              />
            ) : (
              <div className="flex h-[290px] flex-col items-center justify-center gap-5 rounded-lg border border-zinc-200 bg-white">
                <Activity
                  className={`h-10 w-10 ${
                    isSpeaking
                      ? 'text-emerald-700'
                      : isCalculating
                        ? 'text-amber-600'
                        : isConnected
                          ? 'text-[#1E3A8A]'
                          : 'text-zinc-400'
                  }`}
                  aria-hidden="true"
                />
                <div className="flex h-20 items-end justify-center gap-1.5">
                  {Array.from({ length: 18 }).map((_, idx) => {
                    const wave = Math.sin((idx / 18) * Math.PI);
                    const amp = isSpeaking
                      ? Math.min(1, (outputLevel || 0.28) * 3.2 * (0.5 + wave))
                      : isConnected
                        ? Math.min(0.6, inputLevel * 4.5 * (0.4 + wave))
                        : 0.08;
                    const heightPx = Math.max(6, Math.round(amp * 74));
                    return (
                      <div
                        key={idx}
                        className={`w-2 rounded-t transition-all duration-75 ${
                          isSpeaking
                            ? 'bg-emerald-700'
                            : isConnected
                              ? 'bg-[#1E3A8A]'
                              : 'bg-zinc-300'
                        }`}
                        style={{ height: `${heightPx}px` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8 Uploaded Reference Poses Thumbnail Strip (when Photo Mode active) */}
            {avatarMode === 'indri-photo' && (
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  <span>{copy.poseLabel}</span>
                  <button
                    type="button"
                    onClick={() => setLockedPose('auto')}
                    className={`rounded px-1.5 py-0.5 text-[10px] ${
                      lockedPose === 'auto'
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                    }`}
                  >
                    {copy.poseAuto}
                  </button>
                </div>
                <div className="mt-1.5 grid grid-cols-8 gap-1">
                  {INDRI_GALLERY.map((pose) => {
                    const poseLabel = ui.indriVoice.galleryLabels[pose.labelKey] ?? pose.key;
                    return (
                      <button
                        key={pose.key}
                        type="button"
                        title={poseLabel}
                        onClick={() => setLockedPose(pose.key)}
                        className={`overflow-hidden rounded border bg-white p-0.5 transition-all ${
                          lockedPose === pose.key
                            ? 'border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                            : 'border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <img
                          src={pose.src}
                          alt={poseLabel}
                          className="h-9 w-full object-cover rounded-[2px]"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="mt-2.5 text-center text-xs font-medium text-zinc-700">{statusText}</p>
          </div>
        </div>

        {/* Voice Call Controls + Target Zone Selector */}
        <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {!isConnected ? (
              <button
                type="button"
                onClick={handleStartLive}
                disabled={connState === 'connecting'}
                className="inline-flex flex-1 min-h-10 items-center justify-center gap-2 rounded-md bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                <span>
                  {connState === 'connecting' ? copy.connectingBtn : copy.startBtn}
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStopLive}
                  className="inline-flex flex-1 min-h-10 items-center justify-center gap-2 rounded-md bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-800"
                >
                  <PhoneOff className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.stopBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                    isMuted
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span>{isMuted ? copy.unmuteBtn : copy.muteBtn}</span>
                </button>
              </>
            )}
          </div>

          {errorMsg && (
            <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-800">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE COMPUTATION CARD + INTERACTIVE ZONE DIALOGUE */}
      <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 lg:col-span-7">
        {/* Top Interactive Zone, Horizon & Scenario Parameter Bar */}
        <div className="grid grid-cols-1 gap-2 rounded-md border border-zinc-200 bg-[#F9F8F4] p-3 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <label
              htmlFor="indri-zone-select"
              className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
            >
              {copy.zoneLabel}
            </label>
            <select
              id="indri-zone-select"
              value={selectedZoneQuery}
              onChange={(e) => refreshZoneCalculation(e.target.value, selectedYear, selectedScenario)}
              className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
            >
              {zoneGroups.map((grp) => (
                <optgroup key={grp} label={grp}>
                  {localizedZoneOptions
                    .filter((o) => o.group === grp)
                    .map((opt) => (
                      <option key={opt.id} value={opt.queryValue}>
                        {opt.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {copy.horizonLabel}
            </span>
            <div className="mt-1 grid grid-cols-2 gap-1 rounded border border-zinc-300 bg-white p-0.5">
              {([2027, 2028] as HorizonYear[]).map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => refreshZoneCalculation(selectedZoneQuery, yr, selectedScenario)}
                  className={`rounded py-1 text-[11px] font-semibold tabular-nums ${
                    selectedYear === yr
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="indri-scenario-select"
              className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
            >
              {copy.scenarioLabel}
            </label>
            <select
              id="indri-scenario-select"
              value={selectedScenario}
              onChange={(e) =>
                refreshZoneCalculation(
                  selectedZoneQuery,
                  selectedYear,
                  e.target.value as ScenarioKey,
                )
              }
              className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
            >
              <option value="s1">{ui.indriVoice.scenarioOptions.S1}</option>
              <option value="s2">{ui.indriVoice.scenarioOptions.S2}</option>
              <option value="s3">{ui.indriVoice.scenarioOptions.S3}</option>
            </select>
          </div>
        </div>

        {/* Live Telemetry & Calculation Result Card (Driven by User Queries OR Live Voice Tool Calls) */}
        <motion.div
          key={`${activeCard.zoneName}-${activeCard.year}-${activeCard.scenario}`}
          initial={{ opacity: 0.7, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3.5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-200 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#1E3A8A]">
                <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.calcCardTitle}</span>
              </div>
              <h4 className="mt-0.5 font-serif text-base font-semibold text-zinc-900">
                {activeCard.zoneName}
              </h4>
              <p className="text-[11px] text-zinc-600">{activeCard.subtitle}</p>
            </div>
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                activeCard.riskTone === 'danger'
                  ? 'border-rose-300 bg-rose-50 text-rose-800'
                  : activeCard.riskTone === 'warn'
                    ? 'border-amber-300 bg-amber-50 text-amber-900'
                    : activeCard.riskTone === 'good'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-zinc-300 bg-white text-zinc-800'
              }`}
            >
              {activeCard.riskBadge}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activeCard.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded border border-zinc-200 bg-white px-2.5 py-1.5"
              >
                <span className="block truncate text-[10px] text-zinc-500">{metric.label}</span>
                <span
                  className={`mt-0.5 block font-mono text-xs font-semibold tabular-nums ${
                    metric.tone === 'danger'
                      ? 'text-rose-700'
                      : metric.tone === 'warn'
                        ? 'text-amber-800'
                        : metric.tone === 'good'
                          ? 'text-emerald-700'
                          : 'text-zinc-900'
                  }`}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {activeCard.recommendations.length > 0 && (
            <div className="mt-2.5 border-t border-zinc-200/80 pt-2">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {copy.recommendationsLabel}
              </span>
              <ul className="mt-1 space-y-0.5 text-[11px] text-zinc-700">
                {activeCard.recommendations.slice(0, 2).map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#1E3A8A]" aria-hidden="true" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Dialogue Thread with Babakoto */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
            <h4 className="font-serif text-base font-semibold text-zinc-900">
              {copy.transcriptTitle}
            </h4>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">
            {isConnected ? 'gemini-3.8-live-extended-thinking' : `gemini-4-hydrogen · ${ui.indriVoice.liveCalcStatus}`}
          </span>
        </div>

        <div
          ref={transcriptBoxRef}
          className="h-[220px] overflow-y-auto rounded-md border border-zinc-200 bg-[#F9F8F4] p-3.5 space-y-2.5"
        >
          {transcripts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <Sparkles className="h-5 w-5 text-[#1E3A8A]/60" aria-hidden="true" />
              <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-600">
                {copy.transcriptEmpty}
              </p>
            </div>
          ) : (
            transcripts.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col ${
                  item.speaker === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[92%] rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                    item.speaker === 'user'
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-zinc-200 bg-white text-zinc-800'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 font-mono text-[10px] font-semibold">
                    <span className={item.speaker === 'user' ? 'text-white/85' : 'text-[#1E3A8A]'}>
                      {item.speaker === 'user'
                        ? copy.youLabel
                        : avatarMode === 'analyst'
                          ? copy.analystSpeaker
                          : copy.indriSpeaker}
                    </span>
                    {item.tag && (
                      <span className="text-zinc-400">· {item.tag}</span>
                    )}
                  </div>
                  <p className="whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* One-Click Interactive Situation / Prediction / Calculation Shortcuts */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            disabled={isCalculating}
            onClick={() =>
              handleAskBabakoto(ui.indriVoice.shortcutPrompts.currentSituation, 'situation')
            }
            className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-[11px] font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50"
          >
            <Compass className="h-3 w-3 text-[#1E3A8A]" aria-hidden="true" />
            <span>{copy.quickSituation}</span>
          </button>

          <button
            type="button"
            disabled={isCalculating}
            onClick={() =>
              handleAskBabakoto(
                lang === 'en'
                  ? `Calculate ${selectedYear} economic losses and forecasts for ${selectedZoneQuery} under ${selectedScenario.toUpperCase()}.`
                  : lang === 'sw'
                    ? `Kokotoa hasara za kiuchumi na utabiri wa ${selectedYear} kwa ${selectedZoneQuery} chini ya hali ${selectedScenario.toUpperCase()}.`
                    : `Calcule les pertes économiques et donne les prédictions ${selectedYear} pour ${selectedZoneQuery} sous le scénario ${selectedScenario.toUpperCase()}.`,
              )
            }
            className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-[11px] font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50"
          >
            <TrendingDown className="h-3 w-3 text-rose-700" aria-hidden="true" />
            <span>
              {copy.quickZoneCalc} ({selectedZoneQuery})
            </span>
          </button>

          <button
            type="button"
            disabled={isCalculating}
            onClick={() =>
              handleAskBabakoto(
                lang === 'en'
                  ? `Compare the ${selectedYear} outlook for ${selectedZoneQuery} against Zambia (SADC) and Kenya (COMESA).`
                  : lang === 'sw'
                    ? `Linganisha hali ya ${selectedYear} kwa ${selectedZoneQuery} na Zambia (SADC) na Kenya (COMESA).`
                    : `Compare la situation ${selectedYear} de ${selectedZoneQuery} avec la Zambie (SADC) et le Kenya (COMESA).`,
                'compare',
              )
            }
            className="rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-[11px] font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50"
          >
            {copy.quickCompare}
          </button>

          <button
            type="button"
            disabled={isCalculating}
            onClick={() =>
              handleAskBabakoto(
                lang === 'en'
                  ? `Which FOFIFA crop calendar (Zaï, conservation agriculture, sorghum, rice) do you recommend for ${selectedZoneQuery} in ${selectedYear}?`
                  : lang === 'sw'
                    ? `Je, ni kalenda gani ya kilimo ya FOFIFA (Zaï, SCV, mtama, mpunga) unayopendekeza kwa ${selectedZoneQuery} mwaka ${selectedYear}?`
                    : `Quel calendrier cultural FOFIFA (Zaï, SCV, sorgho, riz) recommandes-tu pour ${selectedZoneQuery} en ${selectedYear} ?`,
              )
            }
            className="rounded border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-[11px] font-medium text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50"
          >
            {copy.quickCalendar}
          </button>
        </div>

        {/* Direct Prompt Form (works in BOTH voice and text mode!) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskBabakoto();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={cueInput}
            onChange={(e) => setCueInput(e.target.value)}
            placeholder={isConnected ? copy.cuePlaceholderVoice : copy.cuePlaceholder}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isCalculating || !cueInput.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-40 whitespace-nowrap"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isCalculating ? '...' : 'OK'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
