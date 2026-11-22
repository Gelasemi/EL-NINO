import { Globe } from 'lucide-react';
import {
  useLanguage,
  WORLD_LANGUAGE_OPTIONS,
  type WorldLanguageCode,
} from '../i18n/LanguageContext';

export interface CoreToggleOption {
  code: 'fr' | 'en';
  shortLabel: 'FR' | 'EN';
  fullLabel: string;
  ariaLabel: string;
}

export const CORE_LANGUAGE_TOGGLE_OPTIONS: CoreToggleOption[] = [
  {
    code: 'fr',
    shortLabel: 'FR',
    fullLabel: 'Français',
    ariaLabel: 'Basculer l’application en français',
  },
  {
    code: 'en',
    shortLabel: 'EN',
    fullLabel: 'English',
    ariaLabel: 'Switch application to English',
  },
];

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
}

export function LanguageSwitcher({ variant = 'compact' }: LanguageSwitcherProps) {
  const { worldLang, setLang, ui } = useLanguage();
  const isFull = variant === 'full';

  const isFrActive = worldLang === 'fr';
  const isEnActive = worldLang === 'en';

  return (
    <div
      className={
        isFull
          ? 'flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3'
          : 'inline-flex items-center gap-1.5 shrink-0'
      }
      data-testid={`language-switcher-${variant}`}
    >
      {isFull && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {ui.header.langSwitcherAria}
        </span>
      )}

      <div className={isFull ? 'flex items-center gap-2' : 'inline-flex items-center gap-1'}>
        {/* Primary French / English Segmented Switcher */}
        <div
          role="group"
          aria-label={ui.header.langSwitcherAria}
          className={
            isFull
              ? 'grid flex-1 grid-cols-2 gap-1 rounded-md border border-zinc-300 bg-white p-1'
              : 'inline-flex items-center rounded-md border border-zinc-300 bg-white p-0.5'
          }
        >
          {CORE_LANGUAGE_TOGGLE_OPTIONS.map((option) => {
            const active = option.code === 'fr' ? isFrActive : isEnActive;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setLang(option.code)}
                aria-pressed={active}
                aria-label={option.ariaLabel}
                title={option.fullLabel}
                className={
                  isFull
                    ? `inline-flex min-h-11 items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                        active
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                      }`
                    : `inline-flex h-7 items-center justify-center rounded px-2 text-[11px] font-mono font-bold tracking-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1E3A8A] ${
                        active
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                      }`
                }
              >
                <span>{option.shortLabel}</span>
                {isFull && <span className="font-sans font-medium">· {option.fullLabel}</span>}
              </button>
            );
          })}
        </div>

        {/* Preserved 9-Language World Selector (FR / EN / ES / AR / ZH / HI / PT / RU / SW) */}
        <div
          className={
            isFull
              ? 'inline-flex min-h-11 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-2'
              : 'inline-flex h-8 items-center gap-1 rounded-md border border-zinc-300 bg-white px-1.5'
          }
          title={
            WORLD_LANGUAGE_OPTIONS.find((o) => o.code === worldLang)?.nativeName ?? 'Français'
          }
        >
          <Globe className="h-3.5 w-3.5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
          <select
            aria-label={`${ui.header.langSwitcherAria} (9)`}
            value={worldLang}
            onChange={(e) => setLang(e.target.value as WorldLanguageCode)}
            className={
              isFull
                ? 'bg-transparent text-xs font-mono font-semibold text-zinc-800 focus:outline-none cursor-pointer'
                : 'w-[44px] bg-transparent text-[11px] font-mono font-semibold text-zinc-800 focus:outline-none cursor-pointer'
            }
          >
            {WORLD_LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.shortLabel} · {opt.nativeName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
