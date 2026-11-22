import { useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Sprout,
  XCircle,
} from 'lucide-react';
import {
  computeQuizOutcome,
  filterQuizQuestions,
  QUIZ_TRACK_OPTIONS,
  type QuizRegionTrack,
} from '../utils/cropResilienceQuiz';

export function CropResilienceQuiz({ isFr }: { isFr: boolean }) {
  const [track, setTrack] = useState<QuizRegionTrack>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showSummary, setShowSummary] = useState(false);

  const questions = useMemo(() => filterQuizQuestions(track), [track]);
  const safeIndex = Math.min(currentIdx, Math.max(0, questions.length - 1));
  const currentQuestion = questions[safeIndex];

  const outcome = useMemo(
    () => computeQuizOutcome(questions, answers),
    [questions, answers],
  );

  const pickedIndex = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = typeof pickedIndex === 'number';
  const isCorrect = isAnswered && pickedIndex === currentQuestion.correctIndex;

  const handleSelectTrack = (nextTrack: QuizRegionTrack) => {
    setTrack(nextTrack);
    setCurrentIdx(0);
    setShowSummary(false);
  };

  const handlePickOption = (idx: number) => {
    if (!currentQuestion || isAnswered) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowSummary(false);
  };

  if (!currentQuestion) return null;

  const tierLabel =
    outcome.tier === 'master'
      ? isFr
        ? '● MAÎTRISE COOPÉRATIVE VALIDÉE'
        : '● COOPERATIVE RESILIENCE CERTIFIED'
      : outcome.tier === 'practitioner'
        ? isFr
          ? '▲ NIVEAU INTERMÉDIAIRE — À CONSOLIDER'
          : '▲ PRACTITIONER — REVIEW RECOMMENDED'
        : isFr
          ? '✖ RENFORCEMENT PRIORITAIRE REQUIS'
          : '✖ PRIORITY TRAINING NEEDED';

  const tierColor =
    outcome.tier === 'master'
      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
      : outcome.tier === 'practitioner'
        ? 'text-amber-800 bg-amber-50 border-amber-200'
        : 'text-rose-800 bg-rose-50 border-rose-200';

  return (
    <div
      id="crop-resilience-quiz"
      className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      {/* Quiz Header & Region Track Selector */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
            {isFr
              ? 'ÉVALUATION INTERACTIVE DES COOPÉRATIVES · CYCLES RÉSISTANTS À LA SÉCHERESSE'
              : 'INTERACTIVE COOPERATIVE ASSESSMENT · DROUGHT-RESILIENT PLANTING CYCLES'}
          </p>
          <h3 className="mt-1 flex items-center gap-2 font-serif text-xl font-semibold text-zinc-900">
            <HelpCircle className="h-5 w-5 text-[#1E3A8A]" aria-hidden="true" />
            <span>
              {isFr
                ? 'Crop Resilience Quiz — Testez vos réflexes culturaux par région'
                : 'Crop Resilience Quiz — Test Regional Drought Planting Decisions'}
            </span>
          </h3>
          <p className="mt-1 max-w-[74ch] text-xs leading-relaxed text-zinc-600">
            {isFr
              ? 'Vérifiez la préparation de votre coopérative sur le déclenchement des semis (≥ 25 mm/3j), les variétés 90 j, l’AWD au Lac Alaotra, la décrue baiboho, les sand dams et le stockage hermétique PICS.'
              : 'Test cooperative readiness on rainfall sowing triggers (≥ 25 mm/3d), 90-day drought seeds, Lake Alaotra AWD water rotation, baiboho recession cropping, sand dams, and PICS hermetic storage.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums">
          <span className="font-semibold text-[#1E3A8A]">
            {isFr ? 'Score' : 'Score'}: {outcome.correctCount}/{outcome.totalCount} ({outcome.scorePct}%)
          </span>
          <span aria-hidden="true" className="text-zinc-300">
            ·
          </span>
          <span className="text-zinc-600">
            {isFr ? 'Répondues' : 'Answered'}: {outcome.answeredCount}/{outcome.totalCount}
          </span>
          <button
            type="button"
            onClick={handleResetQuiz}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3 py-1.5 font-sans text-xs font-semibold text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isFr ? 'Réinitialiser' : 'Reset Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Regional Track Filter Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {QUIZ_TRACK_OPTIONS.map((opt) => {
          const active = track === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => handleSelectTrack(opt.id)}
              className={`min-h-9 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#1E3A8A] text-white'
                  : 'border border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-400'
              }`}
            >
              {isFr ? opt.labelFr : opt.labelEn}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 tabular-nums">
          <span>
            {isFr ? 'Question' : 'Question'} {safeIndex + 1} / {questions.length}
          </span>
          <span>
            {Math.round((outcome.answeredCount / Math.max(1, outcome.totalCount)) * 100)}%{' '}
            {isFr ? 'complété' : 'completed'}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-xs bg-zinc-100">
          <div
            className="h-full bg-emerald-700 transition-all duration-200"
            style={{
              width: `${Math.round(((safeIndex + 1) / Math.max(1, questions.length)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {showSummary ? (
        /* Assessment Results Stage */
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
              <Award className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
              <span>
                {isFr ? 'Bilan de préparation coopérative' : 'Cooperative Readiness Score'}
              </span>
            </div>
            <p className="mt-3 font-mono text-4xl font-bold text-zinc-900 tabular-nums">
              {outcome.scorePct}%
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-600 tabular-nums">
              {outcome.correctCount} / {outcome.totalCount}{' '}
              {isFr ? 'décisions optimales validées' : 'optimal planting decisions verified'}
            </p>
            <div className={`mt-4 rounded-md border px-3 py-2 font-mono text-xs font-bold ${tierColor}`}>
              {tierLabel}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowSummary(false)}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                {isFr ? 'Revoir les questions' : 'Review Questions'}
              </button>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172554]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isFr ? 'Recommencer le quiz' : 'Retake Quiz'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-2.5">
            {questions.map((q, idx) => {
              const userChoice = answers[q.id];
              const qCorrect = userChoice === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="flex flex-col justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-500">
                      <span
                        className={`font-semibold ${
                          typeof userChoice !== 'number'
                            ? 'text-zinc-500'
                            : qCorrect
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                        }`}
                      >
                        {typeof userChoice !== 'number'
                          ? '○ PENDING'
                          : qCorrect
                            ? '✓ CORRECT'
                            : '✖ REVIEW'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{isFr ? q.regionLabelFr : q.regionLabelEn}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-zinc-900">
                      {idx + 1}. {isFr ? q.promptFr : q.promptEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIdx(idx);
                      setShowSummary(false);
                    }}
                    className="shrink-0 self-start rounded border border-zinc-300 bg-[#F9F8F4] px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] hover:border-[#1E3A8A] sm:self-center whitespace-nowrap"
                  >
                    {isFr ? 'Inspecter' : 'Inspect'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Interactive Two-Zone Sandbox Stage */
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Stage: Question & Options */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-500">
              <span className="font-semibold text-emerald-800">
                {isFr ? currentQuestion.regionLabelFr : currentQuestion.regionLabelEn}
              </span>
              <span aria-hidden="true">·</span>
              <span>{isFr ? currentQuestion.seasonWindowFr : currentQuestion.seasonWindowEn}</span>
            </div>

            <h4 className="mt-2 text-base font-semibold leading-snug text-zinc-900">
              {isFr ? currentQuestion.promptFr : currentQuestion.promptEn}
            </h4>

            <div className="mt-4 space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = pickedIndex === idx;
                const isRightOption = idx === currentQuestion.correctIndex;

                let btnStyle =
                  'border-zinc-200 bg-[#F9F8F4] text-zinc-800 hover:border-[#1E3A8A] hover:bg-white';
                if (isAnswered) {
                  if (isRightOption) {
                    btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold';
                  } else if (isSelected && !isRightOption) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                  } else {
                    btnStyle = 'border-zinc-200 bg-zinc-50 text-zinc-500 opacity-75';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handlePickOption(idx)}
                    className={`flex w-full min-h-11 items-start gap-3 rounded-lg border px-4 py-3 text-left text-xs leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${btnStyle}`}
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[11px] font-bold uppercase text-zinc-500">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1">{isFr ? opt.labelFr : opt.labelEn}</span>
                    {isAnswered && isRightOption && (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                        aria-hidden="true"
                      />
                    )}
                    {isAnswered && isSelected && !isRightOption && (
                      <XCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-rose-700"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step Navigation */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="inline-flex min-h-10 items-center gap-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isFr ? 'Précédent' : 'Previous'}</span>
              </button>

              <div className="flex items-center gap-2">
                {outcome.answeredCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowSummary(true)}
                    className="min-h-10 rounded-md border border-[#1E3A8A] bg-white px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
                  >
                    {isFr ? 'Voir mon bilan' : 'View Score Summary'}
                  </button>
                )}

                {safeIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                    className="inline-flex min-h-10 items-center gap-1 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172554]"
                  >
                    <span>{isFr ? 'Suivant' : 'Next Question'}</span>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSummary(true)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{isFr ? 'Terminer & Scorer' : 'Finish & Score'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Stage: Real-Time Agronomic Rationale & Cooperative Action Deck */}
          <div className="lg:col-span-5 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4 sm:p-5">
            {!isAnswered ? (
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {isFr ? 'GUIDE COOPÉRATIF' : 'COOPERATIVE BRIEFING'}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                    {isFr
                      ? 'Sélectionnez une réponse pour débloquer l’explication agronomique FOFIFA / Adam Smith et la mesure prioritaire à appliquer sur le terrain pour cette région.'
                      : 'Select an option to unlock the FOFIFA / Adam Smith agronomic rationale and the exact cooperative field action recommended for this region.'}
                  </p>
                </div>

                <div className="rounded-md border border-zinc-200 bg-white p-3.5 text-xs text-zinc-600">
                  <p className="font-mono text-[10.5px] font-semibold text-[#1E3A8A]">
                    {isFr ? 'PARAMÈTRE ACTIF' : 'ACTIVE PARAMETER'}
                  </p>
                  <p className="mt-1 font-medium text-zinc-900">
                    {isFr ? currentQuestion.regionLabelFr : currentQuestion.regionLabelEn}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {isFr ? currentQuestion.seasonWindowFr : currentQuestion.seasonWindowEn}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-xs font-bold ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-rose-200 bg-rose-50 text-rose-800'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>
                        {isFr
                          ? '✓ BONNE DÉCISION AGRONOMIQUE'
                          : '✓ OPTIMAL PLANTING DECISION'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>
                        {isFr
                          ? '✖ À CORRIGER — VOIR PROTOCOLE FOFIFA'
                          : '✖ REVIEW RECOMMENDED — FOFIFA PROTOCOL'}
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">
                    {isFr ? 'Justification scientifique' : 'Agronomic Rationale'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-800">
                    {isFr ? currentQuestion.explanationFr : currentQuestion.explanationEn}
                  </p>
                </div>

                <div className="rounded-md border border-emerald-200 bg-white p-3">
                  <p className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800">
                    <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {isFr ? 'Action prioritaire gérant' : 'Manager Field Action'}
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-900">
                    {isFr
                      ? currentQuestion.cooperativeActionFr
                      : currentQuestion.cooperativeActionEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
