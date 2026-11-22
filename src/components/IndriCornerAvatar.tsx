import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mic,
  MicOff,
  Radio,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import type { IndriActivityPayload, IndriAvatarActivityState } from '../utils/indriEvents';

interface CornerAudioLabels {
  name: string;
  idleTitle: string;
  idleDetail: string;
  listeningTitle: string;
  processingTitle: string;
  speakingTitle: string;
  askPlaceholder: string;
  speakBtn: string;
  stopListeningBtn: string;
  liveStudioBtn: string;
  muteAudio: string;
  unmuteAudio: string;
  replayAudio: string;
  hideBubble: string;
  showBubble: string;
  bcp47: string;
}

const CORNER_COPY: Record<WorldLanguageCode, CornerAudioLabels> = {
  fr: {
    name: 'Babakoto Audio AI · Live',
    idleTitle: 'Compagnon Vocal Actif',
    idleDetail: 'Posez n’importe quelle question par micro ou texte — réponse audio immédiate.',
    listeningTitle: 'Écoute vocale active…',
    processingTitle: 'Réflexion Gemini en cours…',
    speakingTitle: 'Réponse audio en cours',
    askPlaceholder: 'Demandez n’importe quoi (climat, pays, science…)',
    speakBtn: 'Parler (Micro)',
    stopListeningBtn: 'Arrêter',
    liveStudioBtn: 'Studio Live 3.8',
    muteAudio: 'Couper la voix',
    unmuteAudio: 'Activer la voix',
    replayAudio: 'Réécouter',
    hideBubble: 'Réduire',
    showBubble: 'Ouvrir Audio AI',
    bcp47: 'fr-FR',
  },
  en: {
    name: 'Babakoto Audio AI · Live',
    idleTitle: 'Permanent Audio Companion',
    idleDetail: 'Ask anything via mic or text — instant spoken audio answer.',
    listeningTitle: 'Voice listening active…',
    processingTitle: 'Gemini processing…',
    speakingTitle: 'Speaking response',
    askPlaceholder: 'Ask anything (climate, any country, general…)',
    speakBtn: 'Speak (Mic)',
    stopListeningBtn: 'Stop',
    liveStudioBtn: 'Live Studio 3.8',
    muteAudio: 'Mute voice',
    unmuteAudio: 'Enable voice',
    replayAudio: 'Replay',
    hideBubble: 'Minimize',
    showBubble: 'Open Audio AI',
    bcp47: 'en-US',
  },
  sw: {
    name: 'Babakoto Audio AI · Hai',
    idleTitle: 'Msaidizi wa Sauti wa Kudumu',
    idleDetail: 'Uliza chochote kwa sauti au maandishi — jibu la sauti papo hapo.',
    listeningTitle: 'Inasikiliza sauti…',
    processingTitle: 'Gemini inafikiria…',
    speakingTitle: 'Inazungumza sasa',
    askPlaceholder: 'Uliza swali lolote hapa…',
    speakBtn: 'Ongea (Maiki)',
    stopListeningBtn: 'Simamisha',
    liveStudioBtn: 'Studio Live',
    muteAudio: 'Nyamazisha',
    unmuteAudio: 'Washa sauti',
    replayAudio: 'Sikiliza tena',
    hideBubble: 'Punguza',
    showBubble: 'Fungua Audio',
    bcp47: 'sw-KE',
  },
  es: {
    name: 'Babakoto Audio AI · Vivo',
    idleTitle: 'Asistente de Audio Activo',
    idleDetail: 'Pregunta cualquier tema por voz o texto — respuesta hablada instantánea.',
    listeningTitle: 'Escuchando tu voz…',
    processingTitle: 'Gemini calculando…',
    speakingTitle: 'Reproduciendo voz',
    askPlaceholder: 'Pregunta lo que quieras…',
    speakBtn: 'Hablar (Mic)',
    stopListeningBtn: 'Parar',
    liveStudioBtn: 'Estudio Live',
    muteAudio: 'Silenciar',
    unmuteAudio: 'Activar voz',
    replayAudio: 'Repetir',
    hideBubble: 'Minimizar',
    showBubble: 'Abrir Audio',
    bcp47: 'es-ES',
  },
  ar: {
    name: 'باباكوتو الصوتي الذكي · مباشر',
    idleTitle: 'المساعد الصوتي الدائم',
    idleDetail: 'اسأل أي سؤال بالصوت أو الكتابة للحصول على رد صوتي فوري.',
    listeningTitle: 'جاري الاستماع لصوتك…',
    processingTitle: 'جاري التحليل عبر Gemini…',
    speakingTitle: 'يتحدث الآن',
    askPlaceholder: 'اسأل عن أي موضوع هنا…',
    speakBtn: 'تحدث (ميكروفون)',
    stopListeningBtn: 'إيقاف',
    liveStudioBtn: 'استوديو Live',
    muteAudio: 'كتم الصوت',
    unmuteAudio: 'تفعيل الصوت',
    replayAudio: 'إعادة الاستماع',
    hideBubble: 'تصغير',
    showBubble: 'فتح الصوت',
    bcp47: 'ar-SA',
  },
  zh: {
    name: 'Babakoto 语音 AI · 实时',
    idleTitle: '常驻动态语音助手',
    idleDetail: '随时通过麦克风或文字提问任何问题，立即获得语音播报回复。',
    listeningTitle: '正在聆听语音…',
    processingTitle: 'Gemini 思考计算中…',
    speakingTitle: '正在语音播报',
    askPlaceholder: '输入任意问题（气候、国家、百科…）',
    speakBtn: '语音提问',
    stopListeningBtn: '停止',
    liveStudioBtn: 'Live 语音室',
    muteAudio: '静音',
    unmuteAudio: '开启语音',
    replayAudio: '重播语音',
    hideBubble: '收起',
    showBubble: '打开语音',
    bcp47: 'zh-CN',
  },
  pt: {
    name: 'Babakoto Áudio AI · Ao Vivo',
    idleTitle: 'Assistente de Áudio Ativo',
    idleDetail: 'Pergunte qualquer assunto por voz ou texto — resposta falada imediata.',
    listeningTitle: 'A ouvir a sua voz…',
    processingTitle: 'Gemini a processar…',
    speakingTitle: 'A falar resposta',
    askPlaceholder: 'Pergunte qualquer coisa…',
    speakBtn: 'Falar (Mic)',
    stopListeningBtn: 'Parar',
    liveStudioBtn: 'Estúdio Live',
    muteAudio: 'Silenciar',
    unmuteAudio: 'Ativar voz',
    replayAudio: 'Ouvir de novo',
    hideBubble: 'Minimizar',
    showBubble: 'Abrir Áudio',
    bcp47: 'pt-PT',
  },
  hi: {
    name: 'Babakoto ऑडियो AI · लाइव',
    idleTitle: 'स्थायी ध्वनि सहायक',
    idleDetail: 'माइक या टेक्स्ट से कोई भी प्रश्न पूछें — तुरंत ऑडियो उत्तर सुनें।',
    listeningTitle: 'आवाज़ सुन रहा है…',
    processingTitle: 'Gemini विचार कर रहा है…',
    speakingTitle: 'ऑडियो उत्तर जारी',
    askPlaceholder: 'कुछ भी पूछें…',
    speakBtn: 'बोलें (माइक)',
    stopListeningBtn: 'रोकें',
    liveStudioBtn: 'लाइव स्टूडियो',
    muteAudio: 'आवाज़ बंद करें',
    unmuteAudio: 'आवाज़ चालू करें',
    replayAudio: 'फिर सुनें',
    hideBubble: 'छोटा करें',
    showBubble: 'ऑडियो खोलें',
    bcp47: 'hi-IN',
  },
  ru: {
    name: 'Babakoto Аудио ИИ · Живой',
    idleTitle: 'Постоянный голосовой помощник',
    idleDetail: 'Задайте любой вопрос голосом или текстом — мгновенный аудио-ответ.',
    listeningTitle: 'Слушаю голос…',
    processingTitle: 'Gemini обрабатывает…',
    speakingTitle: 'Озвучивание ответа',
    askPlaceholder: 'Спросите о чём угодно…',
    speakBtn: 'Говорить (Мик.)',
    stopListeningBtn: 'Стоп',
    liveStudioBtn: 'Студия Live',
    muteAudio: 'Без звука',
    unmuteAudio: 'Включить голос',
    replayAudio: 'Повторить',
    hideBubble: 'Свернуть',
    showBubble: 'Открыть аудио',
    bcp47: 'ru-RU',
  },
};

interface BrowserSpeechRecognitionEvent extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

export function IndriCornerAvatar() {
  const { worldLang } = useLanguage();
  const { user, saveChatInteraction } = useAuth();
  const { syncState } = useGlobalSync();
  const copy = CORNER_COPY[worldLang];

  const [activityState, setActivityState] = useState<IndriAvatarActivityState>('idle');
  const [activityLabel, setActivityLabel] = useState<string>('');
  const [activityDetail, setActivityDetail] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(true);
  const [questionInput, setQuestionInput] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [lastAnswer, setLastAnswer] = useState<string>('');

  const autoIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const speakTextAloud = useCallback(
    (text: string) => {
      if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const cleaned = text.replace(/\*\*|__|#|`/g, '').trim();
        if (!cleaned) return;
        const utter = new SpeechSynthesisUtterance(cleaned);
        utter.lang = copy.bcp47;
        utter.rate = 1.02;
        utter.pitch = 1.0;

        utter.onstart = () => {
          setIsSpeakingAudio(true);
          setActivityState('speaking');
        };
        utter.onend = () => {
          setIsSpeakingAudio(false);
          setActivityState('idle');
        };
        utter.onerror = () => {
          setIsSpeakingAudio(false);
          setActivityState('idle');
        };
        window.speechSynthesis.speak(utter);
      } catch {
        setIsSpeakingAudio(false);
      }
    },
    [audioEnabled, copy.bcp47],
  );

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAudio(false);
    setActivityState('idle');
  }, []);

  useEffect(() => {
    const handleActivity = (event: Event) => {
      const custom = event as CustomEvent<IndriActivityPayload>;
      const payload = custom.detail;
      if (!payload) return;

      if (autoIdleTimerRef.current) {
        clearTimeout(autoIdleTimerRef.current);
        autoIdleTimerRef.current = null;
      }

      setActivityState(payload.state);
      setActivityLabel(payload.label ?? '');
      setActivityDetail(payload.detail ?? '');

      if (payload.state === 'speaking' && !isSpeakingAudio) {
        autoIdleTimerRef.current = setTimeout(() => {
          setActivityState('idle');
          setActivityLabel('');
          setActivityDetail('');
        }, 4200);
      }
    };

    window.addEventListener('indri-ai-activity', handleActivity);
    return () => {
      window.removeEventListener('indri-ai-activity', handleActivity);
      if (autoIdleTimerRef.current) {
        clearTimeout(autoIdleTimerRef.current);
      }
    };
  }, [isSpeakingAudio]);

  const askIndriAnything = useCallback(
    async (rawQuestion: string) => {
      const q = rawQuestion.trim();
      if (!q) return;

      setQuestionInput('');
      setActivityState('processing');
      setActivityLabel(copy.processingTitle);
      setActivityDetail(q);

      try {
        const res = await fetch('/api/indri/interact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: q,
            lang: worldLang,
            contextSummary: `ONI +${syncState.oniIndexObserved}°C; Auto-00:00=${syncState.midnightAutoUpdateEnabled}; ${syncState.webScrapeSummary}`,
          }),
        });
        const data = (await res.json()) as { answer?: string; error?: string };
        const answerText =
          data.answer?.trim() ||
          data.error ||
          'Réponse prête depuis Madagascar El Niño Observatory.';

        setLastAnswer(answerText);
        setActivityState('speaking');
        setActivityLabel(copy.speakingTitle);
        setActivityDetail(answerText);

        speakTextAloud(answerText);

        if (user) {
          void saveChatInteraction({
            roleId: 'agronome',
            zoneName: `Babakoto Audio (${worldLang.toUpperCase()})`,
            prompt: q,
            reply: answerText,
          }).catch(() => undefined);
        }
      } catch {
        setActivityState('idle');
        setActivityLabel(copy.idleTitle);
        setActivityDetail('Network error reaching Indri AI.');
      }
    },
    [
      copy.idleTitle,
      copy.processingTitle,
      copy.speakingTitle,
      saveChatInteraction,
      speakTextAloud,
      syncState.midnightAutoUpdateEnabled,
      syncState.oniIndexObserved,
      syncState.webScrapeSummary,
      user,
      worldLang,
    ],
  );

  const toggleVoiceMic = () => {
    if (isListeningMic && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
      setActivityState('idle');
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRecCtor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecCtor) {
      // Fallback: open full Gemini 3.8 Live Studio if browser lacks SpeechRecognition API
      window.dispatchEvent(new CustomEvent('open-indri-live'));
      return;
    }

    try {
      stopSpeech();
      const rec = new SpeechRecCtor();
      rec.lang = copy.bcp47;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      recognitionRef.current = rec;

      setIsListeningMic(true);
      setActivityState('listening');
      setActivityLabel(copy.listeningTitle);
      setActivityDetail(copy.idleDetail);

      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? '';
        setIsListeningMic(false);
        if (transcript.trim()) {
          void askIndriAnything(transcript);
        } else {
          setActivityState('idle');
        }
      };

      rec.onerror = () => {
        setIsListeningMic(false);
        setActivityState('idle');
      };

      rec.onend = () => {
        setIsListeningMic(false);
      };

      rec.start();
    } catch {
      setIsListeningMic(false);
      window.dispatchEvent(new CustomEvent('open-indri-live'));
    }
  };

  const avatarSrc =
    activityState === 'processing'
      ? '/assets/aistudio/image_29c06e31.png'
      : activityState === 'speaking' || isSpeakingAudio
        ? '/assets/aistudio/image_c0603431.png'
        : '/assets/aistudio/image_3099989e.png';

  const isStudioCutout =
    activityState === 'idle' || activityState === 'listening';

  const motionClass =
    activityState === 'processing'
      ? 'indri-state-processing'
      : activityState === 'speaking' || isSpeakingAudio
        ? 'indri-state-speaking'
        : activityState === 'listening'
          ? 'indri-state-listening'
          : 'indri-state-idle';

  const displayTitle =
    activityLabel ||
    (activityState === 'processing'
      ? copy.processingTitle
      : activityState === 'speaking' || isSpeakingAudio
        ? copy.speakingTitle
        : activityState === 'listening'
          ? copy.listeningTitle
          : copy.idleTitle);

  const displayDetail = activityDetail || copy.idleDetail;

  const handleOpenIndriHub = () => {
    window.dispatchEvent(new CustomEvent('open-indri-live'));
  };

  return (
    <aside
      aria-label="Babakoto Permanent Animated Audio Assistant"
      className="fixed bottom-4 left-4 z-40 flex items-end gap-2.5 max-w-[calc(100vw-2rem)]"
    >
      {/* Permanently Moving Interactive Photographic Indri-Indri Medallion */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        title={expanded ? copy.hideBubble : copy.showBubble}
        aria-label={copy.name}
        className={`group relative flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[#F9F8F4] shadow-xl transition-colors focus:outline-none ${
          activityState === 'processing'
            ? 'border-amber-500 ring-2 ring-amber-400/50'
            : activityState === 'speaking' || isSpeakingAudio
              ? 'border-emerald-600 ring-2 ring-emerald-500/50'
              : activityState === 'listening'
                ? 'border-[#1E3A8A] ring-2 ring-[#1E3A8A]/40'
                : 'border-[#1E3A8A]/40 hover:border-[#1E3A8A]'
        }`}
      >
        {/* Continuous Subtle Ambient Orbiting Frame even in standby */}
        <span
          aria-hidden="true"
          className={`indri-ring-spin pointer-events-none absolute inset-1 rounded-lg border border-dashed ${
            activityState === 'processing'
              ? 'border-2 border-amber-600/80'
              : 'border-[#1E3A8A]/25'
          }`}
        />

        {/* Continuous Pulsing Acoustic Halo */}
        <span
          aria-hidden="true"
          className={`indri-halo-pulse pointer-events-none absolute inset-1 rounded-lg border ${
            activityState === 'speaking' || isSpeakingAudio
              ? 'border-2 border-emerald-600/80'
              : activityState === 'listening'
                ? 'border-2 border-[#1E3A8A]/70'
                : 'border-emerald-600/20'
          }`}
        />

        <img
          src={avatarSrc}
          alt="Indri-Indri (Babakoto) de Madagascar"
          className={`${motionClass} ${
            isStudioCutout
              ? 'h-[68px] w-[68px] object-contain mix-blend-multiply select-none'
              : 'h-[68px] w-[68px] rounded-lg object-cover select-none'
          }`}
        />

        {/* Live Acoustic Waveform Indicator */}
        <span
          aria-hidden="true"
          className={`absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-sm border border-white ${
            activityState === 'processing'
              ? 'bg-amber-500'
              : activityState === 'speaking' || isSpeakingAudio
                ? 'bg-emerald-600 animate-ping'
                : activityState === 'listening'
                  ? 'bg-[#1E3A8A] animate-pulse'
                  : 'bg-emerald-600'
          }`}
        />
      </button>

      {/* Compact Permanent Audio & Open-Topic Q&A Console */}
      {expanded && (
        <div className="flex w-[290px] sm:w-[320px] flex-col rounded-lg border border-zinc-300 bg-white/95 p-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-1.5">
            <div className="flex items-center gap-1.5">
              {activityState === 'processing' ? (
                <Calculator className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
              ) : isSpeakingAudio || activityState === 'speaking' ? (
                <Volume2 className="h-3.5 w-3.5 text-emerald-700 animate-pulse" aria-hidden="true" />
              ) : activityState === 'listening' ? (
                <Mic className="h-3.5 w-3.5 text-[#1E3A8A] animate-pulse" aria-hidden="true" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              )}
              <span className="font-serif text-xs font-semibold text-zinc-900">{copy.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isSpeakingAudio) stopSpeech();
                  setAudioEnabled((prev) => !prev);
                }}
                title={audioEnabled ? copy.muteAudio : copy.unmuteAudio}
                aria-label={audioEnabled ? copy.muteAudio : copy.unmuteAudio}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {audioEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-emerald-700" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label={copy.hideBubble}
                className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p
            className={`mt-1.5 text-[11px] font-semibold ${
              activityState === 'processing'
                ? 'text-amber-800'
                : activityState === 'speaking' || isSpeakingAudio
                  ? 'text-emerald-800'
                  : activityState === 'listening'
                    ? 'text-[#1E3A8A]'
                    : 'text-zinc-800'
            }`}
          >
            {displayTitle}
          </p>
          <p className="mt-0.5 max-h-[76px] overflow-y-auto text-[11px] leading-snug text-zinc-600">
            {displayDetail}
          </p>

          {/* Direct Ask-Anything Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void askIndriAnything(questionInput);
            }}
            className="mt-2 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder={copy.askPlaceholder}
              className="min-w-0 flex-1 rounded border border-zinc-300 bg-[#F9F8F4] px-2 py-1 text-[11px] text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!questionInput.trim() || activityState === 'processing'}
              aria-label="Send question to Babakoto"
              className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded bg-[#1E3A8A] text-white hover:bg-[#172554] disabled:opacity-50"
            >
              {activityState === 'processing' ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </button>
          </form>

          {/* Voice Mic + Replay Audio + Gemini 3.8 Full Duplex Live */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoiceMic}
              className={`inline-flex flex-1 items-center justify-center gap-1 rounded border px-2 py-1 text-[10.5px] font-semibold transition-colors ${
                isListeningMic
                  ? 'border-rose-700 bg-rose-700 text-white hover:bg-rose-800'
                  : 'border-[#1E3A8A]/30 bg-[#F9F8F4] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white'
              }`}
            >
              {isListeningMic ? (
                <MicOff className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Mic className="h-3 w-3" aria-hidden="true" />
              )}
              <span>{isListeningMic ? copy.stopListeningBtn : copy.speakBtn}</span>
            </button>

            {lastAnswer && (
              <button
                type="button"
                onClick={() => speakTextAloud(lastAnswer)}
                className="inline-flex items-center gap-1 rounded border border-emerald-700/30 bg-emerald-50 px-2 py-1 text-[10.5px] font-semibold text-emerald-800 hover:bg-emerald-700 hover:text-white"
              >
                <Volume2 className="h-3 w-3" aria-hidden="true" />
                <span>{copy.replayAudio}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenIndriHub}
              className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-1 text-[10.5px] font-semibold text-zinc-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            >
              <Radio className="h-3 w-3 text-emerald-700" aria-hidden="true" />
              <span>{copy.liveStudioBtn}</span>
            </button>
          </div>
        </div>
      )}

      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={copy.showBubble}
          className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold text-zinc-800 shadow-sm hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
        >
          <ChevronUp className="h-3 w-3" />
          <span>{activityState === 'processing' ? copy.processingTitle : copy.showBubble}</span>
        </button>
      )}
    </aside>
  );
}
