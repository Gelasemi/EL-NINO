import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { warmCriticalDatasetsCache } from './utils/offlineDatasetCache';

// Tier 1 Google Maps Platform quota & auth failure detection
(window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  origConsoleError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

// Register Service Worker & pre-warm critical climatic & economic dataset caches
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW() {
      void warmCriticalDatasetsCache();
    },
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent('enso-offline-cache-updated'));
    },
  });
}

window.addEventListener(
  'load',
  () => {
    window.setTimeout(() => {
      void warmCriticalDatasetsCache();
    }, 1500);
  },
  { once: true },
);

createRoot(document.getElementById('root')!).render(<App />);

