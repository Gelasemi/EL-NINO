import { Award, ExternalLink, FileText } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedReferenceSources } from '../i18n/localizedCoreData';
import { LICENSE_ATTRIBUTION } from '../utils/scientificReportGenerator';

export function SourcesFooter() {
  const { lang, t, actions } = useLanguage();
  const sources = getLocalizedReferenceSources(lang);
  const lic = LICENSE_ATTRIBUTION[lang];

  return (
    <footer className="bg-white py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Official M&G Consulting License Plaque */}
        <div className="mb-8 flex flex-col gap-4 rounded-lg border border-[#1E3A8A]/25 bg-[#F9F8F4] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#1E3A8A] text-white">
              <Award className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1E3A8A]">
                {lic.platformName} · {lic.licenseLabel} : {lic.licenseHolder}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {lic.directorLabel} : <span className="text-[#1E3A8A]">DG : {lic.directorName}</span>
              </p>
              <p className="text-xs text-zinc-600">{lic.directorTitle}</p>
              <p className="mt-1 text-[11px] text-zinc-500">{lic.rightsNote}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-scientific-report'))}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172554] whitespace-nowrap"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>{actions.reportFullCta}</span>
          </button>
        </div>

        <div className="border-b border-zinc-200 pb-8">
          <h2 className="font-serif text-lg font-semibold text-zinc-900">
            {t.footer.sourcesTitle}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {t.footer.sourcesSubtitle}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 rounded-md border border-zinc-200 bg-[#F9F8F4] p-3.5 text-xs transition-colors hover:border-zinc-300"
              >
                <div>
                  <span className="block font-semibold text-zinc-900 group-hover:text-[#1E3A8A]">
                    {source.publisher}
                  </span>
                  <span className="mt-0.5 block text-zinc-600">{source.label}</span>
                </div>
                <ExternalLink
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-[#1E3A8A]"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
          <span>
            {t.footer.copyright} · © {lic.licenseHolder} (DG : {lic.directorName})
          </span>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#mecanisme" className="hover:text-zinc-900">
              {t.nav.mechanism}
            </a>
            <a href="#madagascar" className="hover:text-zinc-900">
              {t.nav.indianOcean}
            </a>
            <a href="#calendriers" className="hover:text-zinc-900">
              FOFIFA
            </a>
            <a href="#atlas-madagascar" className="hover:text-zinc-900">
              {t.nav.atlas}
            </a>
            <a href="#plan-national" className="hover:text-zinc-900">
              {t.nav.nationalPlan}
            </a>
            <a href="#pertes-economiques" className="hover:text-zinc-900">
              {t.nav.economicLoss}
            </a>
            <a href="#visualisations-recharts" className="hover:text-zinc-900">
              {actions.charts2627}
            </a>
            <a href="#assistant-gemini" className="hover:text-zinc-900">
              {t.nav.geminiHub}
            </a>
            <a href="#cooperatives" className="hover:text-zinc-900">
              {t.nav.cooperatives}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
