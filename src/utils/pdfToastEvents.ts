export interface PdfDownloadToastPayload {
  id: string;
  filename: string;
  kind: 'summary' | 'scientific';
  pagesCount: number;
  horizonYear: number;
  scenario: string;
  completedAtIso: string;
}

export const PDF_DOWNLOAD_EVENT = 'enso-pdf-downloaded';

export function emitPdfDownloadSuccess(
  input: Omit<PdfDownloadToastPayload, 'id' | 'completedAtIso'>,
): PdfDownloadToastPayload {
  const payload: PdfDownloadToastPayload = {
    ...input,
    id: `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    completedAtIso: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<PdfDownloadToastPayload>(PDF_DOWNLOAD_EVENT, { detail: payload }));
  }

  return payload;
}
