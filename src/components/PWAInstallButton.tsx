import { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

const INSTALL_COPY: Record<
  WorldLanguageCode,
  {
    installBtn: string;
    iosBtn: string;
    iosTitle: string;
    iosStep1: string;
    iosStep2: string;
    closeBtn: string;
  }
> = {
  fr: {
    installBtn: 'Installer App',
    iosBtn: 'Installer iOS',
    iosTitle: 'Installer sur iPhone / iPad',
    iosStep1: '1. Appuyez sur le bouton Partager dans la barre Safari.',
    iosStep2: '2. Faites défiler et sélectionnez « Sur l’écran d’accueil ».',
    closeBtn: 'Fermer',
  },
  en: {
    installBtn: 'Install App',
    iosBtn: 'Install iOS',
    iosTitle: 'Install on iPhone / iPad',
    iosStep1: '1. Tap the Share button in the Safari toolbar.',
    iosStep2: '2. Scroll down and tap "Add to Home Screen".',
    closeBtn: 'Close',
  },
  sw: {
    installBtn: 'Sakinisha App',
    iosBtn: 'Sakinisha iOS',
    iosTitle: 'Sakinisha kwenye iPhone / iPad',
    iosStep1: '1. Gusa kitufe cha Shiriki kwenye upau wa Safari.',
    iosStep2: '2. Shuka chini na gusa "Add to Home Screen".',
    closeBtn: 'Funga',
  },
  es: {
    installBtn: 'Instalar App',
    iosBtn: 'Instalar iOS',
    iosTitle: 'Instalar en iPhone / iPad',
    iosStep1: '1. Pulsa el botón Compartir en la barra de Safari.',
    iosStep2: '2. Desplázate y selecciona «Añadir a pantalla de inicio».',
    closeBtn: 'Cerrar',
  },
  ar: {
    installBtn: 'تثبيت التطبيق',
    iosBtn: 'تثبيت iOS',
    iosTitle: 'التثبيت على iPhone / iPad',
    iosStep1: '1. اضغط على زر المشاركة في شريط متصفح Safari.',
    iosStep2: '2. مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية".',
    closeBtn: 'إغلاق',
  },
  zh: {
    installBtn: '安装应用',
    iosBtn: 'iOS 安装',
    iosTitle: '在 iPhone / iPad 上安装',
    iosStep1: '1. 点击 Safari 工具栏中的“共享”按钮。',
    iosStep2: '2. 向下滚动并选择“添加到主屏幕”。',
    closeBtn: '关闭',
  },
  pt: {
    installBtn: 'Instalar App',
    iosBtn: 'Instalar iOS',
    iosTitle: 'Instalar no iPhone / iPad',
    iosStep1: '1. Toque no botão Compartilhar na barra do Safari.',
    iosStep2: '2. Role para baixo e toque em "Adicionar à Tela de Início".',
    closeBtn: 'Fechar',
  },
  hi: {
    installBtn: 'ऐप इंस्टॉल करें',
    iosBtn: 'iOS इंस्टॉल',
    iosTitle: 'iPhone / iPad पर इंस्टॉल करें',
    iosStep1: '1. Safari टूलबार में शेयर बटन पर टैप करें।',
    iosStep2: '2. नीचे स्क्रॉल करें और "होम स्क्रीन में जोड़ें" चुनें।',
    closeBtn: 'बंद करें',
  },
  ru: {
    installBtn: 'Установить',
    iosBtn: 'Уст. на iOS',
    iosTitle: 'Установка на iPhone / iPad',
    iosStep1: '1. Нажмите кнопку «Поделиться» на панели Safari.',
    iosStep2: '2. Прокрутите вниз и выберите «На экран “Домой”».',
    closeBtn: 'Закрыть',
  },
};

export function PWAInstallButton() {
  const { worldLang } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const copy = INSTALL_COPY[worldLang];

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700 bg-emerald-700 px-2.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-emerald-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{copy.installBtn}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:border-[#1E3A8A] hover:text-[#1E3A8A] whitespace-nowrap shrink-0"
        >
          <Smartphone className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
          <span>{copy.iosBtn}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <h3 className="font-serif text-base font-semibold text-zinc-900">
                  {copy.iosTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={copy.closeBtn}
                  className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-700">
                <p>{copy.iosStep1}</p>
                <p>{copy.iosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-md bg-[#1E3A8A] py-2 text-xs font-semibold text-white hover:bg-[#172554]"
              >
                {copy.closeBtn}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
