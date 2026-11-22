/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalSyncProvider } from './context/GlobalSyncContext';
import { Header } from './components/Header';
import { ClimateAlerts } from './components/ClimateAlerts';
import { HeroSection } from './components/HeroSection';
import { MechanismAndComparison } from './components/MechanismAndComparison';
import { IndianOceanMadagascar } from './components/IndianOceanMadagascar';
import { AfricaAndMarkets } from './components/AfricaAndMarkets';
import { GlobalWorldObservatory } from './components/GlobalWorldObservatory';
import { LongTermProjections } from './components/LongTermProjections';
import { ZonalConsolidatedReports } from './components/ZonalConsolidatedReports';
import { ZonalImpactDashboard } from './components/ZonalImpactDashboard';
import { ExecutivePitchDeck } from './components/ExecutivePitchDeck';
import { ClimateAlertsTimeline } from './components/ClimateAlertsTimeline';
import { ClimateRiskMap } from './components/ClimateRiskMap';
import { MlPredictions2027 } from './components/MlPredictions2027';
import { AgricultureAndCalendars } from './components/AgricultureAndCalendars';
import { AdamSmithAgroSpecialization } from './components/AdamSmithAgroSpecialization';
import { AtlasMadagascar } from './components/AtlasMadagascar';
import { NationalResiliencePlan } from './components/NationalResiliencePlan';
import { ClimateScenarioSimulator } from './components/ClimateScenarioSimulator';
import { EconomicLossEvaluator } from './components/EconomicLossEvaluator';
import { ClimateEconomicRecharts } from './components/ClimateEconomicRecharts';
import { GeminiObservatoryAssistant } from './components/GeminiObservatoryAssistant';
import { CooperativeAdvisor } from './components/CooperativeAdvisor';
import { SourcesFooter } from './components/SourcesFooter';
import { IndriCornerAvatar } from './components/IndriCornerAvatar';
import { ScientificReportModal } from './components/ScientificReportModal';
import { ObservatoryWorkspaceModal } from './components/ObservatoryWorkspaceModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PdfDownloadToast } from './components/PdfDownloadToast';

function ObservatoryShell() {
  const { isRtl } = useLanguage();
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    const handleOpenWorkspace = () => setWorkspaceOpen(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    window.addEventListener('open-workspace-modal', handleOpenWorkspace);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
      window.removeEventListener('open-workspace-modal', handleOpenWorkspace);
    };
  }, []);

  const scrollToAdvisor = () => {
    const el = document.getElementById('cooperatives');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F9F8F4] text-[#18181B]">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Header onOpenAdvisor={scrollToAdvisor} />
      <main>
        <ClimateAlerts />
        <HeroSection onOpenAdvisor={scrollToAdvisor} />
        <MechanismAndComparison />
        <IndianOceanMadagascar />
        <AfricaAndMarkets />
        <GlobalWorldObservatory />
        <LongTermProjections />
        <ZonalConsolidatedReports />
        <ZonalImpactDashboard />
        <ExecutivePitchDeck />
        <ClimateAlertsTimeline />
        <ClimateRiskMap />
        <MlPredictions2027 />
        <AgricultureAndCalendars />
        <AdamSmithAgroSpecialization />
        <AtlasMadagascar />
        <NationalResiliencePlan />
        <ClimateScenarioSimulator />
        <EconomicLossEvaluator />
        <ClimateEconomicRecharts />
        <GeminiObservatoryAssistant />
        <CooperativeAdvisor />
      </main>
      <SourcesFooter />
      <IndriCornerAvatar />
      <ScientificReportModal />
      <ObservatoryWorkspaceModal
        open={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
      />
      <OfflineIndicator />
      <PdfDownloadToast />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <GlobalSyncProvider>
          <ObservatoryShell />
        </GlobalSyncProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
