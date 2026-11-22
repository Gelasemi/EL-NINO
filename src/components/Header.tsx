import { useState } from 'react';
import { Database, FileText, Menu, Sprout, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenAdvisor: () => void;
}

export function Header({ onOpenAdvisor }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, t, ui, actions } = useLanguage();
  const { user } = useAuth();

  const openReportStudio = () => {
    window.dispatchEvent(new CustomEvent('open-scientific-report'));
  };

  const openWorkspace = () => {
    window.dispatchEvent(new CustomEvent('open-workspace-modal'));
  };

  const openAdamSmithAgro = () => {
    const el = document.getElementById('specialisation-adam-smith');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.dispatchEvent(new CustomEvent('focus-adam-smith-agro'));
    }
  };

  const navLinks = [
    { href: '#mecanisme', label: t.nav.mechanism },
    { href: '#madagascar', label: t.nav.indianOcean },
    { href: '#afrique', label: t.nav.africa },
    { href: '#observatoire-mondial', label: t.nav.worldObservatory },
    { href: '#trajectoires-2028-2032', label: actions.proj2832Nav },
    { href: '#rapports-zones', label: '13 Zones' },
    { href: '#carte-risques-climatiques', label: actions.riskMapNav },
    { href: '#modele-ml', label: t.nav.mlModel },
    { href: '#atlas-madagascar', label: t.nav.atlas },
    { href: '#plan-national', label: t.nav.nationalPlan },
    { href: '#simulateur-scenarios', label: actions.simNav },
    { href: '#pertes-economiques', label: t.nav.economicLoss },
    { href: '#visualisations-recharts', label: actions.chartsNav },
    { href: '#assistant-gemini', label: t.nav.geminiHub },
    { href: '#cooperatives', label: t.nav.cooperatives },
  ];

  return (
    <header className="border-b border-zinc-200 bg-[#F9F8F4]/95 backdrop-blur-sm md:sticky md:top-0 md:z-40">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-2.5 px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-serif text-sm sm:text-base font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          {t.brandName}
        </a>

        <nav
          aria-label={ui.header.navAria}
          className="hidden xl:flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] text-[11px] font-medium text-zinc-600"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-zinc-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher variant="compact" />

          <button
            type="button"
            onClick={openAdamSmithAgro}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-emerald-700 bg-emerald-700 px-2.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-emerald-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            title={
              lang === 'fr'
                ? 'Spécialisation Agricole Adam Smith & MàJ Auto 15 jours'
                : 'Adam Smith Agro Specialization & 15-Day Auto-Sync'
            }
          >
            <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{lang === 'fr' ? 'Agro Smith 15j' : 'Smith Agro 15d'}</span>
          </button>

          <button
            type="button"
            onClick={openWorkspace}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-xs font-semibold text-zinc-800 transition-colors duration-150 hover:border-[#1E3A8A] hover:text-[#1E3A8A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            title={user?.email || actions.workspaceShort}
          >
            <Database className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
            <span>{actions.workspaceShort}</span>
            {user && (
              <span
                className="h-2 w-2 rounded-xs bg-emerald-600"
                aria-label="Signed in"
              />
            )}
          </button>

          <button
            type="button"
            onClick={openReportStudio}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[#1E3A8A]/40 bg-white px-2.5 py-2 text-xs font-semibold text-[#1E3A8A] transition-colors duration-150 hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{actions.reportShort}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdvisor}
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#172554] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            {t.nav.ctaAdvisor}
          </button>

          <PWAInstallButton />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 xl:hidden focus-visible:outline-2 focus-visible:outline-[#1E3A8A]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 xl:hidden">
          <div className="mb-3">
            <LanguageSwitcher variant="full" />
          </div>
          <nav aria-label={ui.header.mobileMenuAria} className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openAdamSmithAgro();
              }}
              className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white sm:col-span-2"
            >
              <Sprout className="h-4 w-4" aria-hidden="true" />
              <span>
                {lang === 'fr'
                  ? 'Spécialisation Agro · Adam Smith (Auto-MàJ 15j)'
                  : 'Agro Specialization · Adam Smith (15-Day Sync)'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openWorkspace();
              }}
              className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
            >
              <Database className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
              <span>{actions.workspaceShort}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openReportStudio();
              }}
              className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#1E3A8A] bg-white px-4 py-2 text-sm font-semibold text-[#1E3A8A]"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>{actions.reportFullCta}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenAdvisor();
              }}
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white"
            >
              {t.nav.ctaAdvisor}
            </button>
            <div className="mt-2 flex justify-center">
              <PWAInstallButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
