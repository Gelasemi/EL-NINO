export type IndriAvatarActivityState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface IndriActivityPayload {
  state: IndriAvatarActivityState;
  label?: string;
  detail?: string;
}

export function emitIndriActivity(payload: IndriActivityPayload): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<IndriActivityPayload>('indri-ai-activity', { detail: payload }),
    );
  }
}
