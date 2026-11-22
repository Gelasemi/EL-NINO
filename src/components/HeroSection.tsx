import { ArrowDownRight, Award, FileDown, FileText, Presentation, Sparkles, Sprout } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { getLocalizedHeroMetrics } from '../i18n/localizedCoreData';
import { exportClimateSummaryPdf, LICENSE_ATTRIBUTION } from '../utils/scientificReportGenerator';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onOpenAdvisor: () => void;
}

export function HeroSection({ onOpenAdvisor }: HeroSectionProps) {
  const { lang, t, ui, actions } = useLanguage();
  const { syncState } = useGlobalSync();
  const metrics = getLocalizedHeroMetrics(lang);
  const lic = LICENSE_ATTRIBUTION[lang];

  const openGeminiDrawer = () => {
    window.dispatchEvent(new CustomEvent('open-gemini-drawer'));
  };

  const openReportStudio = () => {
    window.dispatchEvent(new CustomEvent('open-scientific-report'));
  };

  return (
    <section className="border-b border-zinc-200 bg-[#F9F8F4] py-10 lg:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Institutional License Bar */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-zinc-700">
            <Award className="h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
            <span>
              {lic.licenseLabel} :{' '}
              <strong className="font-semibold text-zinc-900">{lic.licenseHolder}</strong>
            </span>
            <span className="text-zinc-300" aria-hidden="true">|</span>
            <span>
              <strong className="font-semibold text-[#1E3A8A]">DG : {lic.directorName}</strong>{' '}
              <span className="text-zinc-500">({lic.directorTitle})</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                exportClimateSummaryPdf({
                  lang,
                  horizonYear: 2027,
                  scenario: 's2',
                  currency: 'USD',
                  syncState,
                })
              }
              className="inline-flex items-center gap-1.5 rounded border border-rose-700/30 bg-rose-700/5 px-2.5 py-1 text-[11px] font-semibold text-rose-800 transition-colors hover:bg-rose-700 hover:text-white whitespace-nowrap"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{actions.pdfSummaryBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-executive-pitch-deck'))}
              className="inline-flex items-center gap-1.5 rounded border border-emerald-700/30 bg-emerald-700/5 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 transition-colors hover:bg-emerald-700 hover:text-white whitespace-nowrap"
            >
              <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{lang === 'fr' ? 'Pitch FAO / UA' : 'Ministerial Pitch'}</span>
            </button>
            <button
              type="button"
              onClick={openReportStudio}
              className="inline-flex items-center gap-1.5 rounded border border-[#1E3A8A]/30 bg-[#1E3A8A]/5 px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A] hover:text-white whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{actions.reportFullCta}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-xs font-medium tracking-wider text-zinc-500">
                {t.hero.eyebrow}
              </p>

              <h1 className="mt-4 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-zinc-900 sm:text-4xl lg:text-[42px]">
                {t.hero.title}
              </h1>

              <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-zinc-600">
                {t.hero.lead}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#calendriers"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#172554] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                {t.hero.primaryCta}
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenAdvisor}
                className="inline-flex min-h-11 items-center rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors duration-150 hover:border-zinc-400 hover:bg-zinc-50 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                {t.hero.secondaryCta}
              </button>

              <button
                type="button"
                onClick={openGeminiDrawer}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#1E3A8A]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A8A] transition-colors duration-150 hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>{t.hero.aiCta}</span>
              </button>

              <a
                href="#specialisation-adam-smith"
                onClick={() => window.dispatchEvent(new CustomEvent('focus-adam-smith-agro'))}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-800 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <Sprout className="h-4 w-4" aria-hidden="true" />
                <span>
                  {lang === 'fr'
                    ? 'Spécialisation Agro (Smith) · MàJ 15j'
                    : 'Agro Specialization (Smith) · 15d Sync'}
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-6">
            <ResilientImage
              src="/src/assets/images/hero_enso_pacific_1794612904820.jpg"
              alt={ui.hero.fig1Alt}
              caption={ui.hero.fig1Caption}
              aspectClassName="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[340px]"
            />
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Telemetry Strip */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {metrics.map((metric) => {
            const accentClass =
              metric.tone === 'amber'
                ? 'text-amber-700'
                : metric.tone === 'crimson'
                  ? 'text-rose-700'
                  : metric.tone === 'cobalt'
                    ? 'text-[#1E3A8A]'
                    : 'text-zinc-900';

            return (
              <div
                key={metric.id}
                className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span className="font-medium">{metric.label}</span>
                    <span className={`font-mono text-[11px] font-medium ${accentClass}`}>
                      {t.hero.tones[metric.tone]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className={`font-mono text-3xl font-semibold tracking-tight tabular-nums ${accentClass}`}>
                      {metric.value}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">{metric.unit}</span>
                  </div>
                </div>
                <p className="mt-3 border-t border-zinc-100 pt-2.5 text-xs leading-relaxed text-zinc-600">
                  {metric.context}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
