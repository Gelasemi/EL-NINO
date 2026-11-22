import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, X } from 'lucide-react';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import {
  PDF_DOWNLOAD_EVENT,
  type PdfDownloadToastPayload,
} from '../utils/pdfToastEvents';

interface ToastCopy {
  summaryTitle: string;
  scientificTitle: string;
  subtitle: string;
  pagesLabel: string;
  closeAria: string;
}

const TOAST_COPY: Record<WorldLanguageCode, ToastCopy> = {
  fr: {
    summaryTitle: 'PDF Résumé Climat & Prévisions téléchargé',
    scientificTitle: 'Rapport Scientifique PDF téléchargé',
    subtitle: 'Document généré et enregistré dans vos téléchargements.',
    pagesLabel: 'pages',
    closeAria: 'Fermer la notification de téléchargement PDF',
  },
  en: {
    summaryTitle: 'Climate Data & Forecast PDF Downloaded',
    scientificTitle: 'Scientific Report PDF Downloaded',
    subtitle: 'Document generated and saved to your downloads.',
    pagesLabel: 'pages',
    closeAria: 'Dismiss PDF download notification',
  },
  sw: {
    summaryTitle: 'Muhtasari wa Tabianchi (PDF) Umepakuliwa',
    scientificTitle: 'Ripoti ya Kisayansi (PDF) Imepakuliwa',
    subtitle: 'Hati imetengenezwa na kuhifadhiwa kwenye vipakuliwa vyako.',
    pagesLabel: 'kurasa',
    closeAria: 'Funga arifa ya upakuaji wa PDF',
  },
  es: {
    summaryTitle: 'PDF de Clima y Previsiones descargado',
    scientificTitle: 'Informe Científico PDF descargado',
    subtitle: 'Documento generado y guardado en tus descargas.',
    pagesLabel: 'páginas',
    closeAria: 'Cerrar notificación de descarga PDF',
  },
  ar: {
    summaryTitle: 'تم تنزيل ملف PDF لملخص المناخ والتوقعات',
    scientificTitle: 'تم تنزيل التقرير العلمي PDF بنجاح',
    subtitle: 'تم إنشاء المستند وحفظه في مجلد التنزيلات.',
    pagesLabel: 'صفحات',
    closeAria: 'إغلاق إشعار تنزيل PDF',
  },
  zh: {
    summaryTitle: '气候数据与预测摘要 PDF 已下载',
    scientificTitle: '科学评估报告 PDF 已下载',
    subtitle: '报告已生成并保存至您的下载文件夹。',
    pagesLabel: '页',
    closeAria: '关闭 PDF 下载通知',
  },
  pt: {
    summaryTitle: 'Resumo Climático e Previsões (PDF) baixado',
    scientificTitle: 'Relatório Científico PDF baixado',
    subtitle: 'Documento gerado e salvo na sua pasta de downloads.',
    pagesLabel: 'páginas',
    closeAria: 'Fechar notificação de download PDF',
  },
  hi: {
    summaryTitle: 'जलवायु डेटा और पूर्वानुमान PDF डाउनलोड हो गया',
    scientificTitle: 'वैज्ञानिक रिपोर्ट PDF डाउनलोड हो गई',
    subtitle: 'दस्तावेज़ तैयार होकर आपके डाउनलोड में सहेजा गया है।',
    pagesLabel: 'पृष्ठ',
    closeAria: 'PDF डाउनलोड सूचना बंद करें',
  },
  ru: {
    summaryTitle: 'Сводка климата и прогнозов (PDF) скачана',
    scientificTitle: 'Научный отчёт (PDF) скачан',
    subtitle: 'Документ сформирован и сохранён в загрузки.',
    pagesLabel: 'стр.',
    closeAria: 'Закрыть уведомление о скачивании PDF',
  },
};

const AUTO_DISMISS_MS = 5500;

export function PdfDownloadToast() {
  const { worldLang, isRtl } = useLanguage();
  const copy = TOAST_COPY[worldLang];
  const [toasts, setToasts] = useState<PdfDownloadToastPayload[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const existing = timersRef.current.get(id);
    if (existing !== undefined) {
      window.clearTimeout(existing);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const scheduleDismiss = useCallback(
    (id: string) => {
      const existing = timersRef.current.get(id);
      if (existing !== undefined) {
        window.clearTimeout(existing);
      }
      const tid = window.setTimeout(() => {
        dismiss(id);
      }, AUTO_DISMISS_MS);
      timersRef.current.set(id, tid);
    },
    [dismiss],
  );

  const pauseDismiss = useCallback((id: string) => {
    const existing = timersRef.current.get(id);
    if (existing !== undefined) {
      window.clearTimeout(existing);
      timersRef.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const handleEvent = (ev: Event) => {
      const customEv = ev as CustomEvent<PdfDownloadToastPayload>;
      const payload = customEv.detail;
      if (!payload?.filename) return;
      setToasts((prev) => [...prev.slice(-2), payload]);
      scheduleDismiss(payload.id);
    };

    window.addEventListener(PDF_DOWNLOAD_EVENT, handleEvent);
    return () => {
      window.removeEventListener(PDF_DOWNLOAD_EVENT, handleEvent);
      timersRef.current.forEach((tid) => window.clearTimeout(tid));
      timersRef.current.clear();
    };
  }, [scheduleDismiss]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed top-20 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5 ${
        isRtl ? 'left-4' : 'right-4'
      }`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          onMouseEnter={() => pauseDismiss(toast.id)}
          onMouseLeave={() => scheduleDismiss(toast.id)}
          className="overflow-hidden rounded-lg border border-emerald-300 bg-white shadow-xl ring-1 ring-emerald-900/10"
        >
          <div className="flex items-start gap-3 p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-snug text-zinc-900">
                {toast.kind === 'scientific' ? copy.scientificTitle : copy.summaryTitle}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-zinc-600">{copy.subtitle}</p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-zinc-700">
                <span className="inline-flex max-w-full items-center gap-1 truncate rounded border border-zinc-200 bg-[#F9F8F4] px-1.5 py-0.5 font-semibold text-[#1E3A8A]">
                  <FileText className="h-3 w-3 shrink-0 text-rose-700" aria-hidden="true" />
                  <span className="truncate">{toast.filename}</span>
                </span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-800 border border-emerald-200 tabular-nums">
                  {toast.pagesCount} {copy.pagesLabel} · {toast.horizonYear} ({toast.scenario.toUpperCase()})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label={copy.closeAria}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="h-1 w-full bg-emerald-100">
            <div className="h-full w-full origin-left bg-emerald-600 animate-[shrinkX_5.5s_linear_forwards]" />
          </div>
        </div>
      ))}
    </div>
  );
}
