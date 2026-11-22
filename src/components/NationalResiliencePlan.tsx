import { useMemo, useState } from 'react';
import {
  Calculator,
  Download,
  ExternalLink,
  Landmark,
  MapPin,
  Plus,
  Shield,
  SlidersHorizontal,
  Users,
  Wallet,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  BUDGET_UNIT_LINES,
  INITIAL_NGO_REGISTRY_SAMPLE,
  type NgoInterventionEntry,
} from '../data/ensoData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedAmbovombeFiche,
  getLocalizedBudget8Components,
  getLocalizedBudgetHorizon,
  getLocalizedBudgetUnitLines,
  getLocalizedBuildSequence8,
  getLocalizedDashboardStack,
  getLocalizedDataGaps12,
  getLocalizedDbSchema20,
  getLocalizedDonorPartners5,
  getLocalizedEightValueChains,
  getLocalizedFinalDeliverables6,
  getLocalizedFinancialIndicators7,
  getLocalizedGovernance13Actors,
  getLocalizedGovernancePyramid,
  getLocalizedInitialNgoSample,
  getLocalizedNationalBaselines,
  getLocalizedNationalKpi10,
  getLocalizedPhases6,
  getLocalizedPilotDistricts12,
  getLocalizedProgram8Components,
  getLocalizedProgram8Objectives,
  getLocalizedRiskClasses,
  getLocalizedRiskDimensions,
  getLocalizedStrategicQuestions,
  getLocalizedTerritorialGroups,
  getLocalizedThreeScenarios,
} from '../i18n/localizedAtlasPlanData';

type PlanTab =
  | 'scoring-population'
  | 'agriculture-scenarios'
  | 'budget-donors'
  | 'governance-ngo'
  | 'roadmap-kpis';

function classifyRiskScore(
  score: number,
  levels: { low: string; moderate: string; important: string; high: string; veryHigh: string }
): { label: string; colorClass: string } {
  if (score >= 80) return { label: `${levels.veryHigh} (80–100)`, colorClass: 'text-rose-700' };
  if (score >= 60) return { label: `${levels.high} (60–79)`, colorClass: 'text-amber-800' };
  if (score >= 40) return { label: `${levels.important} (40–59)`, colorClass: 'text-amber-700' };
  if (score >= 20) return { label: `${levels.moderate} (20–39)`, colorClass: 'text-[#1E3A8A]' };
  return { label: `${levels.low} (0–19)`, colorClass: 'text-emerald-700' };
}

export function NationalResiliencePlan() {
  const { lang, t, ui } = useLanguage();
  const p = ui.plan;
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const [activeTab, setActiveTab] = useState<PlanTab>('scoring-population');

  const nationalBaselines = useMemo(() => getLocalizedNationalBaselines(lang), [lang]);
  const strategicQuestions = useMemo(() => getLocalizedStrategicQuestions(lang), [lang]);
  const pilotDistricts = useMemo(() => getLocalizedPilotDistricts12(lang), [lang]);
  const riskDimensions = useMemo(() => getLocalizedRiskDimensions(lang), [lang]);
  const riskClasses = useMemo(() => getLocalizedRiskClasses(lang), [lang]);
  const territorialGroups = useMemo(() => getLocalizedTerritorialGroups(lang), [lang]);
  const dbSchema20 = useMemo(() => getLocalizedDbSchema20(lang), [lang]);
  const valueChains8 = useMemo(() => getLocalizedEightValueChains(lang), [lang]);
  const threeScenarios = useMemo(() => getLocalizedThreeScenarios(lang), [lang]);
  const ambovombeFiche = useMemo(() => getLocalizedAmbovombeFiche(lang), [lang]);
  const localizedBudgetLines = useMemo(() => getLocalizedBudgetUnitLines(lang), [lang]);
  const budget8Components = useMemo(() => getLocalizedBudget8Components(lang), [lang]);
  const financialIndicators7 = useMemo(() => getLocalizedFinancialIndicators7(lang), [lang]);
  const donorPartners5 = useMemo(() => getLocalizedDonorPartners5(lang), [lang]);
  const governancePyramid = useMemo(() => getLocalizedGovernancePyramid(lang), [lang]);
  const governance13Actors = useMemo(() => getLocalizedGovernance13Actors(lang), [lang]);
  const phases6 = useMemo(() => getLocalizedPhases6(lang), [lang]);
  const nationalKpi10 = useMemo(() => getLocalizedNationalKpi10(lang), [lang]);
  const dashboardStack = useMemo(() => getLocalizedDashboardStack(lang), [lang]);
  const dataGaps12 = useMemo(() => getLocalizedDataGaps12(lang), [lang]);
  const deliverables6 = useMemo(() => getLocalizedFinalDeliverables6(lang), [lang]);
  const buildSequence8 = useMemo(() => getLocalizedBuildSequence8(lang), [lang]);
  const program8Components = useMemo(() => getLocalizedProgram8Components(lang), [lang]);
  const program8Objectives = useMemo(() => getLocalizedProgram8Objectives(lang), [lang]);

  // --- Tab 1: Interactive 5D Risk Scoring & Exposed Population Simulator ---
  const [selectedPilotIdx, setSelectedPilotIdx] = useState<number>(0);
  const initialPilot = pilotDistricts[0];
  const [dimScores, setDimScores] = useState(initialPilot.defaultScores);
  const [popRef, setPopRef] = useState<number>(initialPilot.popRef);
  const [exposureRate, setExposureRate] = useState<number>(initialPilot.exposureRate);
  const [vulnRate, setVulnRate] = useState<number>(initialPilot.vulnRate);
  const [assistRate, setAssistRate] = useState<number>(initialPilot.assistRate);

  const applyPilotPreset = (index: number) => {
    const preset = pilotDistricts[index] ?? pilotDistricts[0];
    setSelectedPilotIdx(index);
    setDimScores(preset.defaultScores);
    setPopRef(preset.popRef);
    setExposureRate(preset.exposureRate);
    setVulnRate(preset.vulnRate);
    setAssistRate(preset.assistRate);
  };

  const activePilot = pilotDistricts[selectedPilotIdx] ?? pilotDistricts[0];

  const scoringResult = useMemo(() => {
    // Score_d = sum(Poids_i * Note_{d,i}) normalized on 0..100 (since each Note is 0..5 -> multiply weighted sum by 20)
    const weightedRaw =
      0.3 * dimScores.climate +
      0.25 * dimScores.pop +
      0.2 * dimScores.agri +
      0.15 * dimScores.water +
      0.1 * dimScores.capacity;
    const score100 = Math.round(weightedRaw * 20);
    const classification = classifyRiskScore(score100, p.riskLevels);
    const pExposed = Math.round(popRef * exposureRate);
    const pAssistance = Math.round(pExposed * vulnRate * assistRate);
    return { score100, classification, pExposed, pAssistance };
  }, [dimScores, popRef, exposureRate, vulnRate, assistRate, p.riskLevels]);

  // --- Tab 2: Agricultural Loss Calculator ---
  const [qRefTonnes, setQRefTonnes] = useState<number>(42000);
  const [lossPctScenario, setLossPctScenario] = useState<number>(32);
  const [producerPriceMgaKg, setProducerPriceMgaKg] = useState<number>(2100);

  const agriLossMetrics = useMemo(() => {
    const qScenario = Math.round(qRefTonnes * (1 - lossPctScenario / 100));
    const pertesTonnes = qRefTonnes - qScenario;
    const valeurMga = pertesTonnes * 1000 * producerPriceMgaKg;
    return { qScenario, pertesTonnes, valeurMga };
  }, [qRefTonnes, lossPctScenario, producerPriceMgaKg]);

  // --- Tab 3: Bottom-Up Financial Modeler (MGA / USD / EUR) ---
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(BUDGET_UNIT_LINES.map((l) => [l.id, l.defaultQty])),
  );
  const [unitCostsMga, setUnitCostsMga] = useState<Record<string, number>>(() =>
    Object.fromEntries(BUDGET_UNIT_LINES.map((l) => [l.id, l.defaultUnitCostMga])),
  );
  const [coordPct, setCoordPct] = useState<number>(6);
  const [suiviPct, setSuiviPct] = useState<number>(4);
  const [mgaPerUsd, setMgaPerUsd] = useState<number>(4550);
  const [mgaPerEur, setMgaPerEur] = useState<number>(4920);

  const budgetSummary = useMemo(() => {
    let directUrgencyMga = 0;
    let directResilienceMga = 0;
    BUDGET_UNIT_LINES.forEach((line) => {
      const subtotal = (quantities[line.id] ?? 0) * (unitCostsMga[line.id] ?? 0);
      if (line.horizon === 'Urgence 2026–2028') {
        directUrgencyMga += subtotal;
      } else {
        directResilienceMga += subtotal;
      }
    });
    const directTotalMga = directUrgencyMga + directResilienceMga;
    const coordMga = Math.round(directTotalMga * (coordPct / 100));
    const suiviMga = Math.round(directTotalMga * (suiviPct / 100));
    const grandTotalMga = directTotalMga + coordMga + suiviMga;
    const totalUsd = mgaPerUsd > 0 ? grandTotalMga / mgaPerUsd : 0;
    const totalEur = mgaPerEur > 0 ? grandTotalMga / mgaPerEur : 0;
    return {
      directUrgencyMga,
      directResilienceMga,
      coordMga,
      suiviMga,
      grandTotalMga,
      totalUsd,
      totalEur,
    };
  }, [quantities, unitCostsMga, coordPct, suiviPct, mgaPerUsd, mgaPerEur]);

  // --- Tab 4: NGO & Donor Coordination Registry ---
  const [ngoEntries, setNgoEntries] = useState<NgoInterventionEntry[]>(INITIAL_NGO_REGISTRY_SAMPLE);
  const [ngoRegionFilter, setNgoRegionFilter] = useState<string>('ALL');
  const [newOrg, setNewOrg] = useState<string>('');
  const [newRegion, setNewRegion] = useState<string>('Androy');
  const [newDistrict, setNewDistrict] = useState<string>('Tsihombe');
  const [newSector, setNewSector] = useState<string>('Eau potable & forages');
  const [newBeneficiaries] = useState<number>(15000);
  const [newBudgetUsd, setNewBudgetUsd] = useState<number>(480000);

  const localizedNgoEntries = useMemo(() => {
    const sampleMap = new Map(getLocalizedInitialNgoSample(lang).map((item) => [item.id, item]));
    return ngoEntries.map((item) => sampleMap.get(item.id) ?? item);
  }, [ngoEntries, lang]);

  const filteredNgoEntries = useMemo(
    () =>
      ngoRegionFilter === 'ALL'
        ? localizedNgoEntries
        : localizedNgoEntries.filter((e) => e.region === ngoRegionFilter),
    [localizedNgoEntries, ngoRegionFilter],
  );

  const ngoTotals = useMemo(() => {
    return filteredNgoEntries.reduce(
      (acc, e) => ({
        beneficiaries: acc.beneficiaries + e.beneficiaries,
        committed: acc.committed + e.budgetCommittedUsd,
        disbursed: acc.disbursed + e.disbursedUsd,
      }),
      { beneficiaries: 0, committed: 0, disbursed: 0 },
    );
  }, [filteredNgoEntries]);

  const handleAddNgoEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.trim()) return;
    const entry: NgoInterventionEntry = {
      id: `ngo-${Date.now()}`,
      organization: newOrg.trim(),
      region: newRegion,
      district: newDistrict.trim() || ui.common.district,
      commune: lang === 'en' ? 'Priority communes' : lang === 'sw' ? 'Kata za kipaumbele' : 'Communes prioritaires',
      sector: newSector,
      targetPopulation: lang === 'en' ? 'Exposed vulnerable households' : lang === 'sw' ? 'Kaya zilizo hatarini' : 'Ménages vulnérables exposés',
      beneficiaries: Math.max(0, newBeneficiaries),
      budgetCommittedUsd: Math.max(0, newBudgetUsd),
      disbursedUsd: 0,
      duration: '2027–2028',
      unmetNeeds: lang === 'en' ? 'To consolidate at quarterly review' : lang === 'sw' ? 'Kukaguliwa kila robo mwaka' : 'À consolider lors de la revue trimestrielle',
    };
    setNgoEntries((prev) => [entry, ...prev]);
    setNewOrg('');
  };

  // --- Tab 5: Institutional Data Gaps Checklist ---
  const [collectedDataGaps, setCollectedDataGaps] = useState<Record<number, boolean>>({
    0: true,
    5: true,
  });

  const collectedGapsCount = useMemo(
    () => Object.values(collectedDataGaps).filter(Boolean).length,
    [collectedDataGaps],
  );

  const handleJumpToPilotMap = (mapDistrictKey: string) => {
    window.dispatchEvent(
      new CustomEvent('select-madagascar-district', { detail: { district: mapDistrictKey } }),
    );
    const mlSection = document.getElementById('modele-ml');
    if (mlSection) {
      mlSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadSchemaTemplateJson = () => {
    const payload = {
      document: 'Plan National de Préparation et de Résilience Climatique de Madagascar 2027–2028 (v1.0)',
      date_reference: '2026-11-14',
      nomenclature_note:
        'Découpage officiel Torolalana (119 districts) avec table de correspondance INSTAT RGPH-3 (114 lignes regroupant les 6 arrondissements CUA).',
      schema_20_champs: dbSchema20,
      exemple_fiche_pilote_ambovombe: ambovombeFiche,
      ponderation_risque_5d: riskDimensions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'schema_119_districts_resilience_madagascar_2027_2028.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadNgoRegistryCsv = () => {
    const header =
      'organisation,region,district,commune,secteur,population_cible,beneficiaires,budget_engage_usd,decaisse_usd,duree,besoins_non_couverts';
    const rows = localizedNgoEntries.map((item) =>
      [
        `"${item.organization.replace(/"/g, '""')}"`,
        `"${item.region}"`,
        `"${item.district}"`,
        `"${item.commune.replace(/"/g, '""')}"`,
        `"${item.sector.replace(/"/g, '""')}"`,
        `"${item.targetPopulation.replace(/"/g, '""')}"`,
        item.beneficiaries,
        item.budgetCommittedUsd,
        item.disbursedUsd,
        `"${item.duration}"`,
        `"${item.unmetNeeds.replace(/"/g, '""')}"`,
      ].join(','),
    );
    const blob = new Blob([`\uFEFF${header}\n${rows.join('\n')}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'registre_coordination_ong_bailleurs_madagascar.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="plan-national" className="border-b border-zinc-200 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">
            {t.sections.s07Eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {t.sections.s07Title}
          </h2>
          <p className="mt-3 max-w-[74ch] text-base leading-relaxed text-zinc-600">
            {t.sections.s07Lead}
          </p>

          {/* 5 National Baseline Metrics */}
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {nationalBaselines.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4"
              >
                <span className="font-mono text-2xl font-semibold text-zinc-900 tabular-nums">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs font-semibold text-zinc-800">{stat.label}</span>
                <span className="mt-1 block text-[11px] text-zinc-500">{stat.source}</span>
              </div>
            ))}
          </div>

          {/* 6 Strategic Questions + Météo Nov 2026–Jan 2027 Official Callout */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 lg:col-span-7">
              <h3 className="font-serif text-base font-semibold text-zinc-900">
                {p.questionsTitle}
              </h3>
              <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {strategicQuestions.map((q, idx) => (
                  <li key={q} className="text-xs leading-relaxed text-zinc-700">
                    <span className="font-mono font-semibold text-[#1E3A8A]">{idx + 1}. </span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 lg:col-span-5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-base font-semibold text-zinc-900">
                  {p.meteoBulletinTitle}
                </h3>
                <a
                  href="https://www.meteomadagascar.mg/prevision/previsions-saisonnieres-hiver-meteo-madagascar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap"
                >
                  Source
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-700">
                {p.meteoBulletinBody}
              </p>
            </div>
          </div>
        </div>

        {/* 5 Interactive Workspace Tabs */}
        <div className="mt-8">
          <div
            role="tablist"
            aria-label={t.sections.s07Title}
            className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'scoring-population'}
              onClick={() => setActiveTab('scoring-population')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'scoring-population'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
              }`}
            >
              {p.tabs.scoring}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'agriculture-scenarios'}
              onClick={() => setActiveTab('agriculture-scenarios')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'agriculture-scenarios'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
              }`}
            >
              {p.tabs.agriculture}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'budget-donors'}
              onClick={() => setActiveTab('budget-donors')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'budget-donors'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
              }`}
            >
              {p.tabs.budget}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'governance-ngo'}
              onClick={() => setActiveTab('governance-ngo')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'governance-ngo'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
              }`}
            >
              {p.tabs.governance}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'roadmap-kpis'}
              onClick={() => setActiveTab('roadmap-kpis')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'roadmap-kpis'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
              }`}
            >
              {p.tabs.roadmap}
            </button>
          </div>

          {/* TAB 1: SCORING 5D, EXPOSED POPULATION & 119-DISTRICT DATABASE ARCHITECTURE */}
          {activeTab === 'scoring-population' && (
            <div className="mt-6 space-y-8">
              {/* Interactive 5D Weighted Risk Calculator & Exposed Population */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 lg:col-span-7">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-zinc-900">
                          {p.dims5Label}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Score_d = Σ (W_i × Note_d,i) · 0–100
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJumpToPilotMap(activePilot.mapDistrictKey)}
                      className="inline-flex items-center gap-1.5 rounded border border-[#1E3A8A]/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors whitespace-nowrap"
                    >
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {lang === 'en'
                        ? `View ${activePilot.district} on Google Maps`
                        : lang === 'sw'
                          ? `Ona ${activePilot.district} kwenye Google Maps`
                          : `Voir ${activePilot.district} sur Google Maps`}
                    </button>
                  </div>

                  {/* 12 Pilot District Selector */}
                  <div className="mt-4">
                    <label
                      htmlFor="pilot-district-select"
                      className="block text-xs font-semibold text-zinc-700"
                    >
                      {p.pilotSelectLabel}
                    </label>
                    <select
                      id="pilot-district-select"
                      value={selectedPilotIdx}
                      onChange={(e) => applyPilotPreset(parseInt(e.target.value, 10))}
                      className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                    >
                      {pilotDistricts.map((pilot, idx) => (
                        <option key={pilot.district} value={idx}>
                          {pilot.district} ({pilot.region} · {pilot.groupCode}) — {pilot.profileTag}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5 Dimension Sliders */}
                  <div className="mt-5 space-y-3.5">
                    {(
                      [
                        { key: 'climate', idx: 0, val: dimScores.climate },
                        { key: 'pop', idx: 1, val: dimScores.pop },
                        { key: 'agri', idx: 2, val: dimScores.agri },
                        { key: 'water', idx: 3, val: dimScores.water },
                        { key: 'capacity', idx: 4, val: dimScores.capacity },
                      ] as const
                    ).map((dim) => {
                      const meta = riskDimensions[dim.idx];
                      return (
                        <div key={dim.key}>
                          <div className="flex justify-between text-xs">
                            <label htmlFor={`dim-${dim.key}`} className="font-medium text-zinc-700">
                              {meta ? `${meta.label} (${meta.weight}%)` : dim.key}
                            </label>
                            <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                              {dim.val.toFixed(1)} / 5
                            </span>
                          </div>
                        <input
                          id={`dim-${dim.key}`}
                          type="range"
                          min={0}
                          max={5}
                          step={0.1}
                          value={dim.val}
                          onChange={(e) =>
                            setDimScores((prev) => ({
                              ...prev,
                              [dim.key]: parseFloat(e.target.value),
                            }))
                          }
                          className="mt-1 w-full accent-[#1E3A8A]"
                        />
                        </div>
                      );
                    })}
                  </div>

                  {/* Exposed & Assistance Population Equation Controls */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4 sm:grid-cols-4">
                    <div>
                      <label htmlFor="pop-ref" className="block text-[11px] font-medium text-zinc-600">
                        {p.popRefLabel}
                      </label>
                      <input
                        id="pop-ref"
                        type="number"
                        min={1000}
                        step={1000}
                        value={popRef}
                        onChange={(e) => setPopRef(Math.max(0, parseInt(e.target.value || '0', 10)))}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="exp-rate" className="block text-[11px] font-medium text-zinc-600">
                        {lang === 'en' ? 'Exposure (E_g)' : lang === 'sw' ? 'Kiwango (E_g)' : 'Facteur expos. (E_g)'}
                      </label>
                      <input
                        id="exp-rate"
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={exposureRate}
                        onChange={(e) => setExposureRate(Math.min(1, Math.max(0, parseFloat(e.target.value || '0'))))}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="vuln-rate" className="block text-[11px] font-medium text-zinc-600">
                        {lang === 'en' ? 'Vulnerability (V_d)' : lang === 'sw' ? 'Udhaifu (V_d)' : 'Vulnérabilité (V_d)'}
                      </label>
                      <input
                        id="vuln-rate"
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={vulnRate}
                        onChange={(e) => setVulnRate(Math.min(1, Math.max(0, parseFloat(e.target.value || '0'))))}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="assist-rate" className="block text-[11px] font-medium text-zinc-600">
                        {lang === 'en' ? 'Aid share (A_d)' : lang === 'sw' ? 'Hitaji msaada (A_d)' : 'Besoin d’aide (A_d)'}
                      </label>
                      <input
                        id="assist-rate"
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={assistRate}
                        onChange={(e) => setAssistRate(Math.min(1, Math.max(0, parseFloat(e.target.value || '0'))))}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Outputs Card */}
                <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                      <span className="font-mono text-xs font-semibold text-zinc-500">
                        {p.scoreWeightedLabel}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">{activePilot.groupCode}</span>
                    </div>

                    <div className="mt-4 rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                      <span className="block text-xs text-zinc-600">{p.scoreWeightedLabel}</span>
                      <div className="mt-1 flex items-baseline justify-between gap-2">
                        <span className="font-mono text-3xl font-semibold text-zinc-900 tabular-nums">
                          {scoringResult.score100} / 100
                        </span>
                        <span className={`text-sm font-semibold ${scoringResult.classification.colorClass}`}>
                          {p.riskClassPrefix} {scoringResult.classification.label}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                        {lang === 'en'
                          ? 'Note: drought, flood, heat and cyclone hazard scores are stored separately to avoid masking extreme hazards via averaging.'
                          : lang === 'sw'
                            ? 'Kumbuka: alama za ukame, mafuriko, joto na vimbunga huhifadhiwa kando ili kuzuia kuficha hatari kali kupitia wastani.'
                            : 'Note : les scores individuels sécheresse, crues, chaleur et cyclones restent conservés séparément pour éviter tout effet de masquage par la moyenne.'}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                          <Users className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                          {p.popExposedLabel}
                        </div>
                        <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                          {scoringResult.pExposed.toLocaleString(locale)}
                        </span>
                        <span className="text-[11px] text-zinc-500">{p.popExposedFormula}</span>
                      </div>

                      <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                          <Shield className="h-3.5 w-3.5 text-amber-800" aria-hidden="true" />
                          {p.assistNeededLabel}
                        </div>
                        <span className="mt-1 block font-mono text-xl font-semibold text-amber-800 tabular-nums">
                          {scoringResult.pAssistance.toLocaleString(locale)}
                        </span>
                        <span className="text-[11px] text-zinc-500">{p.assistFormula}</span>
                      </div>
                    </div>

                    {/* Analytical Classes Legend */}
                    <div className="mt-5">
                      <p className="text-xs font-semibold text-zinc-700">
                        {p.classes5Title}
                      </p>
                      <div className="mt-2 grid grid-cols-5 gap-1.5 text-center font-mono text-[11px]">
                        {riskClasses.map((cls) => (
                          <div
                            key={cls.label}
                            className="rounded border border-zinc-200 bg-[#F9F8F4] p-2"
                          >
                            <span className="block font-semibold" style={{ color: cls.color }}>
                              {cls.range}
                            </span>
                            <span className="block font-sans text-[10px] text-zinc-600">
                              {cls.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-zinc-100 pt-3 text-[11px] leading-relaxed text-zinc-500">
                    {lang === 'en'
                      ? 'Demographic rule: rather than applying the flat 3.01% national historical growth rate, each district uses its own INSTAT demographic projection.'
                      : lang === 'sw'
                        ? 'Kanuni ya idadi ya watu: badala ya kutumia kiwango cha kitaifa cha 3.01%, kila wilaya hutumia makadirio yake ya INSTAT.'
                        : 'La règle démographique du plan exclut l’application uniforme du taux historique national (3,01 %) : chaque district utilisera sa dynamique propre issue de l’INSTAT.'}
                  </p>
                </div>
              </div>

              {/* 4 Operational Groups A / B / C / D */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {territorialGroups.map((grp) => (
                  <div
                    key={grp.code}
                    className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4"
                  >
                    <span className="font-mono text-xs font-semibold text-[#1E3A8A]">
                      {grp.code}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-zinc-900">{grp.title}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                      <strong className="text-zinc-800">{ui.common.regions} :</strong> {grp.regions}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                      <strong className="text-zinc-900">Action :</strong> {grp.interventions}
                    </p>
                  </div>
                ))}
              </div>

              {/* 20-Field Schema & INSTAT 114 vs Torolalana 119 Note */}
              <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {p.schemaTitle}
                    </h3>
                    <p className="mt-1 max-w-[75ch] text-xs leading-relaxed text-zinc-600">
                      {lang === 'en'
                        ? 'Built-in crosswalk between the 119 Torolalana administrative districts and the 114 rows of INSTAT RGPH-3 tables (aggregating the 6 Antananarivo Urban Commune boroughs).'
                        : lang === 'sw'
                          ? 'Jedwali la uhusiano kati ya wilaya 119 za kiutawala za Torolalana na mistari 114 ya INSTAT RGPH-3 (ikijumuisha mitaa 6 ya Antananarivo).'
                          : 'Table de correspondance intégrée entre les 119 districts administratifs Torolalana et les 114 lignes des tableaux INSTAT RGPH-3 (regroupement des 6 arrondissements de la Commune urbaine d’Antananarivo).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadSchemaTemplateJson}
                    className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    {lang === 'en' ? 'Export 119-District Schema (.json)' : lang === 'sw' ? 'Hamisha Muundo (.json)' : 'Exporter Schéma 119 Districts (.json)'}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {dbSchema20.map((col) => (
                    <div
                      key={col.field}
                      className="rounded border border-zinc-200 bg-white px-3 py-2 text-xs"
                    >
                      <span className="block font-mono font-semibold text-[#1E3A8A]">
                        {col.field}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-zinc-600">{col.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 8 VALUE CHAINS, LOSS EQUATION, 3 SCENARIOS & AMBOVOMBE FICHE */}
          {activeTab === 'agriculture-scenarios' && (
            <div className="mt-6 space-y-8">
              {/* 8 Value Chains Grid */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">
                  {p.chainsTitle}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {valueChains8.map((vc) => (
                    <div
                      key={vc.name}
                      className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4"
                    >
                      <h4 className="text-sm font-semibold text-zinc-900">{vc.name}</h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">{vc.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loss Calculator + 3 Scenarios Table */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 lg:col-span-5">
                  <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                    <Calculator className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {p.lossCalcTitle}
                    </h3>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-zinc-600">
                    {p.lossCalcSubtitle}
                  </p>

                  <div className="mt-4 space-y-3.5">
                    <div>
                      <label htmlFor="q-ref" className="block text-xs font-semibold text-zinc-700">
                        {lang === 'en' ? 'Baseline output Q_ref (tonnes)' : lang === 'sw' ? 'Uzalishaji msingi Q_ref (tani)' : 'Production de référence Q_réf (tonnes)'}
                      </label>
                      <input
                        id="q-ref"
                        type="number"
                        min={100}
                        step={500}
                        value={qRefTonnes}
                        onChange={(e) => setQRefTonnes(Math.max(0, parseInt(e.target.value || '0', 10)))}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <label htmlFor="loss-pct" className="font-semibold text-zinc-700">
                          {p.scenarioShockLabel}
                        </label>
                        <span className="font-mono font-semibold text-rose-700 tabular-nums">
                          -{lossPctScenario} %
                        </span>
                      </div>
                      <input
                        id="loss-pct"
                        type="range"
                        min={0}
                        max={65}
                        step={1}
                        value={lossPctScenario}
                        onChange={(e) => setLossPctScenario(parseInt(e.target.value, 10))}
                        className="mt-1 w-full accent-amber-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="price-mga" className="block text-xs font-semibold text-zinc-700">
                        {p.priceMgaLabel}
                      </label>
                      <input
                        id="price-mga"
                        type="number"
                        min={100}
                        step={100}
                        value={producerPriceMgaKg}
                        onChange={(e) =>
                          setProducerPriceMgaKg(Math.max(0, parseInt(e.target.value || '0', 10)))
                        }
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-md border border-zinc-200 bg-white p-4">
                    <div>
                      <span className="block text-[11px] text-zinc-500">{p.tonnageLossLabel}</span>
                      <span className="mt-0.5 block font-mono text-lg font-semibold text-zinc-900 tabular-nums">
                        {agriLossMetrics.pertesTonnes.toLocaleString(locale)} t
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-zinc-500">{p.estLossLabel}</span>
                      <span className="mt-0.5 block font-mono text-lg font-semibold text-rose-700 tabular-nums">
                        {(agriLossMetrics.valeurMga / 1e9).toFixed(2)} {lang === 'fr' ? 'Md MGA' : 'B MGA'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white lg:col-span-7">
                  <div className="border-b border-zinc-200 px-5 py-4">
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {p.threeScenTitle}
                    </h3>
                  </div>
                  <table className="w-full min-w-[540px] border-collapse text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                      <tr>
                        <th className="px-4 py-3">{p.scenParamCol}</th>
                        <th className="px-4 py-3 text-[#1E3A8A]">{p.scen1Col}</th>
                        <th className="px-4 py-3 text-amber-800">{p.scen2Col}</th>
                        <th className="px-4 py-3 text-rose-700">{p.scen3Col}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {threeScenarios.map((row) => (
                        <tr key={row.parameter}>
                          <td className="px-4 py-3 font-semibold text-zinc-900">{row.parameter}</td>
                          <td className="px-4 py-3 text-zinc-700">{row.s1}</td>
                          <td className="px-4 py-3 text-zinc-700">{row.s2}</td>
                          <td className="px-4 py-3 text-zinc-700">{row.s3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ambovombe-Androy Diagnostic Fiche Template (12 Indicators) */}
              <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {p.ficheTitle}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {lang === 'en'
                        ? 'Methodological template replicated across all 119 districts once INSTAT / MINAE baselines are consolidated.'
                        : lang === 'sw'
                          ? 'Kiolezo cha mbinu cha kuigwa katika wilaya zote 119 baada ya kuunganisha takwimu za INSTAT / MINAE.'
                          : 'Fiche méthodologique à reproduire sur les 119 districts après consolidation des statistiques INSTAT / MINAE.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {ambovombeFiche.map((item) => (
                    <div
                      key={item.indicator}
                      className="flex items-center justify-between gap-2 rounded border border-zinc-200 bg-white px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <span className="block font-semibold text-zinc-900">{item.indicator}</span>
                        <span className="text-[11px] text-zinc-500">{item.domain}</span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-800 text-right">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOTTOM-UP BUDGET MODEL (MGA / USD / EUR) & DONORS */}
          {activeTab === 'budget-donors' && (
            <div className="mt-6 space-y-8">
              {/* Interactive Bottom-Up Budget Modeler */}
              <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4">
                  <div className="flex items-start gap-2.5">
                    <Wallet className="mt-1 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-zinc-900">
                        {p.budgetTitle}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                        {p.budgetSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 text-zinc-700">
                      1 USD =
                      <input
                        type="number"
                        min={1000}
                        step={50}
                        value={mgaPerUsd}
                        onChange={(e) => setMgaPerUsd(Math.max(1, parseInt(e.target.value || '4550', 10)))}
                        className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-zinc-900 tabular-nums"
                      />
                      MGA
                    </label>
                    <label className="flex items-center gap-1.5 text-zinc-700">
                      1 EUR =
                      <input
                        type="number"
                        min={1000}
                        step={50}
                        value={mgaPerEur}
                        onChange={(e) => setMgaPerEur(Math.max(1, parseInt(e.target.value || '4920', 10)))}
                        className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-zinc-900 tabular-nums"
                      />
                      MGA
                    </label>
                  </div>
                </div>

                {/* Consolidated Totals Strip (MGA / USD / EUR) */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-md border border-zinc-200 bg-white p-4">
                    <span className="block text-[11px] font-semibold text-zinc-500">
                      {p.totalPlanLabel} (MGA)
                    </span>
                    <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                      {(budgetSummary.grandTotalMga / 1e9).toFixed(2)} {lang === 'fr' ? 'Md MGA' : 'B MGA'}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {lang === 'en' ? 'Emergency + Resilience + Coord/M&E' : lang === 'sw' ? 'Dharura + Ustahimilivu + Uratibu' : 'Urgence + Résilience + Coord/Suivi'}
                    </span>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-4">
                    <span className="block text-[11px] font-semibold text-zinc-500">
                      USD ({lang === 'en' ? 'Donors' : lang === 'sw' ? 'Wafadhili' : 'Bailleurs'})
                    </span>
                    <span className="mt-1 block font-mono text-xl font-semibold text-[#1E3A8A] tabular-nums">
                      {(budgetSummary.totalUsd / 1e6).toFixed(2)} M USD
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      1 USD = {mgaPerUsd.toLocaleString(locale)} MGA
                    </span>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-4">
                    <span className="block text-[11px] font-semibold text-zinc-500">
                      EUR ({lang === 'en' ? 'EU Partners' : lang === 'sw' ? 'Washirika wa EU' : 'Partenaires UE'})
                    </span>
                    <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                      {(budgetSummary.totalEur / 1e6).toFixed(2)} M EUR
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      1 EUR = {mgaPerEur.toLocaleString(locale)} MGA
                    </span>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-4">
                    <span className="block text-[11px] font-semibold text-zinc-500">
                      {p.budgetHorizonCol}
                    </span>
                    <span className="mt-1 block font-mono text-xs font-semibold text-amber-800 tabular-nums">
                      {p.totalUrgencyLabel} : {(budgetSummary.directUrgencyMga / 1e9).toFixed(2)} {lang === 'fr' ? 'Md' : 'B'}
                    </span>
                    <span className="mt-1 block font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                      {p.totalResilienceLabel} : {(budgetSummary.directResilienceMga / 1e9).toFixed(2)} {lang === 'fr' ? 'Md' : 'B'}
                    </span>
                  </div>
                </div>

                {/* Editable 8 Budget Unit Lines Table */}
                <div className="mt-5 overflow-x-auto rounded-md border border-zinc-200 bg-white">
                  <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                      <tr>
                        <th className="px-4 py-3">{p.budgetLineCol}</th>
                        <th className="px-4 py-3">{lang === 'en' ? 'Unit' : lang === 'sw' ? 'Kipimo' : 'Unité de calcul'}</th>
                        <th className="px-4 py-3">{p.budgetHorizonCol}</th>
                        <th className="w-32 px-4 py-3 text-right">{p.budgetQtyCol}</th>
                        <th className="w-36 px-4 py-3 text-right">{p.budgetUnitCostCol}</th>
                        <th className="w-36 px-4 py-3 text-right">{p.budgetTotalCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {localizedBudgetLines.map((line) => {
                        const q = quantities[line.id] ?? 0;
                        const c = unitCostsMga[line.id] ?? 0;
                        const sub = q * c;
                        return (
                          <tr key={line.id}>
                            <td className="px-4 py-2.5 font-semibold text-zinc-900">{line.label}</td>
                            <td className="px-4 py-2.5 text-zinc-600">{line.unitLabel}</td>
                            <td className="px-4 py-2.5 font-mono text-[11px] text-zinc-600">
                              {getLocalizedBudgetHorizon(line.horizon, lang)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <input
                                aria-label={`Quantité ${line.label}`}
                                type="number"
                                min={0}
                                value={q}
                                onChange={(e) =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [line.id]: Math.max(0, parseInt(e.target.value || '0', 10)),
                                  }))
                                }
                                className="w-28 rounded border border-zinc-300 px-2 py-1 text-right font-mono tabular-nums"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <input
                                aria-label={`Coût unitaire MGA ${line.label}`}
                                type="number"
                                min={0}
                                step={5000}
                                value={c}
                                onChange={(e) =>
                                  setUnitCostsMga((prev) => ({
                                    ...prev,
                                    [line.id]: Math.max(0, parseInt(e.target.value || '0', 10)),
                                  }))
                                }
                                className="w-32 rounded border border-zinc-300 px-2 py-1 text-right font-mono tabular-nums"
                              />
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono font-semibold text-zinc-900 tabular-nums">
                              {sub.toLocaleString(locale)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Coordination & M&E Percentages */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-700">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-1.5">
                      C_coord (%) :
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={coordPct}
                        onChange={(e) => setCoordPct(Math.max(0, parseFloat(e.target.value || '0')))}
                        className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 font-mono tabular-nums"
                      />
                    </label>
                    <label className="flex items-center gap-1.5">
                      {lang === 'en' ? 'C_M&E (%) :' : lang === 'sw' ? 'C_ufuatiliaji (%) :' : 'C_suivi & évaluation (%) :'}
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={suiviPct}
                        onChange={(e) => setSuiviPct(Math.max(0, parseFloat(e.target.value || '0')))}
                        className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 font-mono tabular-nums"
                      />
                    </label>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-600 tabular-nums">
                    Coord : {(budgetSummary.coordMga / 1e6).toFixed(1)} M MGA · M&amp;E :{' '}
                    {(budgetSummary.suiviMga / 1e6).toFixed(1)} M MGA
                  </span>
                </div>
              </div>

              {/* 8 Budget Components & 7 Financial Indicators */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-7">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {p.budget8Title}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {budget8Components.map((b) => (
                      <div
                        key={b.component}
                        className="rounded border border-zinc-200 bg-[#F9F8F4] p-3 text-xs"
                      >
                        <span className="font-semibold text-zinc-900">{b.component}</span>
                        <p className="mt-1 text-zinc-600">{b.items}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-5">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {p.fin7Title}
                  </h3>
                  <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/60 p-3.5 text-xs leading-relaxed text-zinc-800">
                    <strong className="font-mono text-amber-900">
                      {lang === 'en'
                        ? 'WFP Actual Baseline: $44.1M'
                        : lang === 'sw'
                          ? 'Kipimo Halisi cha WFP: $44.1M'
                          : 'Référence réelle PAM : 44,1 M USD'}
                    </strong>{' '}
                    {lang === 'en'
                      ? 'required for WFP operations from August 2026 to January 2027 (distinct from the full multisectoral national plan envelope).'
                      : lang === 'sw'
                        ? 'zinahitajika kwa operesheni za WFP kuanzia Agosti 2026 hadi Januari 2027 (mbali na bajeti nzima ya mpango wa taifa).'
                        : 'requis pour ses opérations propres d’août 2026 à janvier 2027 (distinct de l’enveloppe globale du futur plan national multisectoriel).'}
                  </div>
                  <ul className="mt-4 space-y-1.5 text-xs text-zinc-700">
                    {financialIndicators7.map((ind) => (
                      <li key={ind} className="border-b border-zinc-100 pb-1.5 last:border-none">
                        · {ind}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5 Institutional Climate & Development Donors */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {donorPartners5.map((donor) => (
                  <a
                    key={donor.name}
                    href={donor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4 transition-colors hover:border-[#1E3A8A]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-900 group-hover:text-[#1E3A8A]">
                          {donor.name}
                        </span>
                        <ExternalLink
                          className="h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-[#1E3A8A]"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">{donor.focus}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INSTITUTIONAL GOVERNANCE & NGO/DONOR COORDINATION REGISTRY */}
          {activeTab === 'governance-ngo' && (
            <div className="mt-6 space-y-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Institutional Architecture Pyramid */}
                <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 lg:col-span-5">
                  <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                    <Landmark className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {p.govPyramidTitle}
                    </h3>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {governancePyramid.map((lvl, idx) => (
                      <div
                        key={lvl.level}
                        className="rounded border border-zinc-200 bg-white p-3 text-xs"
                      >
                        <span className="font-mono text-[11px] font-semibold text-[#1E3A8A]">
                          L{idx + 1} · {lvl.level}
                        </span>
                        <p className="mt-1 text-zinc-600">{lvl.role}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
                    {lang === 'en'
                      ? 'Extends the October 2026 workshop held by Météo Madagascar with WFP, FAO and BNGRC without creating parallel structures.'
                      : lang === 'sw'
                        ? 'Inaendeleza warsha ya Oktoba 2026 ya Météo Madagascar pamoja na WFP, FAO na BNGRC bila kuunda mifumo mbadala.'
                        : 'Prolonge la dynamique de l’atelier d’octobre 2026 organisé par Météo Madagascar avec le PAM, la FAO et le BNGRC sans créer de structures parallèles.'}
                  </p>
                </div>

                {/* 13 Actors Matrix */}
                <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white lg:col-span-7">
                  <div className="border-b border-zinc-200 px-5 py-4">
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {p.gov13Title}
                    </h3>
                  </div>
                  <table className="w-full min-w-[460px] border-collapse text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                      <tr>
                        <th className="w-60 px-4 py-2.5">{p.govActorCol}</th>
                        <th className="px-4 py-2.5">{p.govRoleCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {governance13Actors.map((row) => (
                        <tr key={row.actor}>
                          <td className="px-4 py-2.5 font-semibold text-zinc-900">{row.actor}</td>
                          <td className="px-4 py-2.5 text-zinc-600">{row.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive NGO & Donor Coordination Registry (10 fields) */}
              <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-zinc-900">
                      {p.ngoRegistryTitle}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600">
                      {p.ngoRegistrySubtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={p.ngoRegistryTitle}
                      value={ngoRegionFilter}
                      onChange={(e) => setNgoRegionFilter(e.target.value)}
                      className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
                    >
                      <option value="ALL">
                        {ui.common.all} ({localizedNgoEntries.length})
                      </option>
                      {Array.from(new Set(localizedNgoEntries.map((e) => e.region))).map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleDownloadNgoRegistryCsv}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 whitespace-nowrap"
                    >
                      <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                      {p.ngoExportBtn}
                    </button>
                  </div>
                </div>

                {/* Quick Add Intervention Form */}
                <form
                  onSubmit={handleAddNgoEntry}
                  className="mt-4 grid grid-cols-1 gap-2.5 rounded-md border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6"
                >
                  <input
                    type="text"
                    required
                    placeholder={p.ngoPlaceholders.org}
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder={p.ngoPlaceholders.region}
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder={p.ngoPlaceholders.district}
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder={p.ngoPlaceholders.sector}
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder={p.ngoPlaceholders.committedUsd}
                    value={newBudgetUsd}
                    onChange={(e) => setNewBudgetUsd(parseInt(e.target.value || '0', 10))}
                    className="rounded border border-zinc-300 px-2.5 py-1.5 font-mono text-xs text-zinc-900 tabular-nums"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1 rounded bg-[#1E3A8A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#172554]"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    {p.ngoAddBtn}
                  </button>
                </form>

                {/* Summary Readout */}
                <div className="mt-4 flex flex-wrap gap-6 text-xs text-zinc-700">
                  <span>
                    {p.ngoCols.beneficiaries} :{' '}
                    <strong className="font-mono text-zinc-900 tabular-nums">
                      {ngoTotals.beneficiaries.toLocaleString(locale)}
                    </strong>
                  </span>
                  <span>
                    {p.ngoCols.committed} :{' '}
                    <strong className="font-mono text-[#1E3A8A] tabular-nums">
                      {ngoTotals.committed.toLocaleString(locale)} USD
                    </strong>
                  </span>
                  <span>
                    {lang === 'en' ? 'Disbursed :' : lang === 'sw' ? 'Kilicholipwa :' : 'Décaissé :'}{' '}
                    <strong className="font-mono text-emerald-700 tabular-nums">
                      {ngoTotals.disbursed.toLocaleString(locale)} USD
                    </strong>
                  </span>
                </div>

                {/* Registry Table */}
                <div className="mt-3 overflow-x-auto rounded-md border border-zinc-200 bg-white">
                  <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                    <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                      <tr>
                        <th className="px-4 py-2.5">{p.ngoCols.org}</th>
                        <th className="px-4 py-2.5">{p.ngoCols.zone}</th>
                        <th className="px-4 py-2.5">{p.ngoCols.sector}</th>
                        <th className="px-4 py-2.5 text-right">{p.ngoCols.beneficiaries}</th>
                        <th className="px-4 py-2.5 text-right">{p.ngoCols.committed}</th>
                        <th className="px-4 py-2.5">{p.ngoCols.unmet}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {filteredNgoEntries.map((item) => (
                        <tr key={item.id} className="align-top">
                          <td className="px-4 py-3 font-semibold text-zinc-900">
                            {item.organization}
                            <span className="mt-0.5 block font-normal text-[11px] text-zinc-500">
                              {item.duration}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-zinc-900">{item.district}</span>
                            <span className="block text-[11px] text-zinc-500">
                              {item.region} · {item.commune}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-700">{item.sector}</td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-900">
                            {item.beneficiaries.toLocaleString(locale)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums">
                            <span className="block font-semibold text-[#1E3A8A]">
                              ${item.budgetCommittedUsd.toLocaleString(locale)}
                            </span>
                            <span className="block text-[11px] text-emerald-700">
                              {lang === 'en' ? 'Disbursed:' : lang === 'sw' ? 'Kilicholipwa:' : 'Décaissé :'}{' '}
                              ${item.disbursedUsd.toLocaleString(locale)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-600">{item.unmetNeeds}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 6 IMPLEMENTATION PHASES, 10 KPIS, 12 DATA GAPS, 6 DELIVERABLES & 8 STEPS */}
          {activeTab === 'roadmap-kpis' && (
            <div className="mt-6 space-y-8">
              {/* 6 Operational Implementation Phases */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">
                  {p.phasesTitle}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {phases6.map((ph) => (
                    <div
                      key={ph.phase}
                      className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-4"
                    >
                      <span className="font-mono text-xs font-semibold text-[#1E3A8A]">
                        {ph.phase}
                      </span>
                      <h4 className="mt-1 text-sm font-semibold text-zinc-900">{ph.title}</h4>
                      <ul className="mt-2.5 space-y-1 text-xs leading-relaxed text-zinc-600">
                        {ph.tasks.map((task) => (
                          <li key={task}>· {task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10 National KPIs + Dashboard Tech Stack & 12 Missing Institutional Datasets */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-6">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {p.kpi10Title}
                  </h3>
                  <div className="mt-3 divide-y divide-zinc-100 text-xs">
                    {nationalKpi10.map((item) => (
                      <div key={item.kpi} className="flex items-baseline justify-between gap-3 py-2">
                        <span className="font-mono text-[11px] font-semibold text-[#1E3A8A] shrink-0">
                          {item.domain}
                        </span>
                        <span className="text-right text-zinc-700">{item.kpi}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-zinc-200 pt-4">
                    <h4 className="text-xs font-semibold text-zinc-900">
                      {p.stackTitle}
                    </h4>
                    <ul className="mt-2 space-y-1 text-xs text-zinc-600">
                      {dashboardStack.map((tech) => (
                        <li key={tech}>· {tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 12 Priority Institutional Data Checklist */}
                <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 lg:col-span-6">
                  <div className="flex items-baseline justify-between gap-2 border-b border-zinc-200 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-zinc-900">
                        {p.gapsTitle}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {lang === 'en'
                          ? 'Required before locking a definitive national budget in billions MGA'
                          : lang === 'sw'
                            ? 'Zinahitajika kabla ya kuthibitisha bajeti ya taifa katika mabilioni ya MGA'
                            : 'Requises avant d’arrêter un budget national définitif en milliards MGA'}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#1E3A8A] tabular-nums">
                      {collectedGapsCount} / {dataGaps12.length}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {dataGaps12.map((gap, idx) => {
                      const checked = !!collectedDataGaps[idx];
                      return (
                        <li key={gap}>
                          <button
                            type="button"
                            onClick={() =>
                              setCollectedDataGaps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                            }
                            className="flex w-full items-start gap-2 rounded border border-zinc-200 bg-white px-3 py-2 text-left text-xs hover:border-zinc-300"
                          >
                            {checked ? (
                              <CheckSquare
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700"
                                aria-hidden="true"
                              />
                            ) : (
                              <Square
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400"
                                aria-hidden="true"
                              />
                            )}
                            <span className={checked ? 'text-zinc-500 line-through' : 'text-zinc-800'}>
                              {gap}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* 8 Program Components + 8 Objectives + 6 Final Deliverables + 8 Build Sequence */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 bg-white p-6">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {p.deliverablesTitle}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {deliverables6.map((del) => (
                      <div
                        key={del.code}
                        className="rounded border border-zinc-200 bg-[#F9F8F4] p-3 text-xs"
                      >
                        <span className="font-mono font-semibold text-[#1E3A8A]">{del.code}</span>
                        <span className="mt-0.5 block font-semibold text-zinc-900">{del.title}</span>
                        <p className="mt-1 text-zinc-600">{del.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-zinc-200 pt-3">
                    <p className="text-[11px] font-semibold text-zinc-700">
                      {p.components8Title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
                      {program8Components.map((c) => c.title).join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-6">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900">
                    {p.sequenceTitle} &amp; {p.objectives8Title}
                  </h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="border-b border-zinc-200 bg-[#F9F8F4] font-semibold text-zinc-700">
                        <tr>
                          <th className="w-14 px-3 py-2">#</th>
                          <th className="px-3 py-2">{lang === 'en' ? 'Workstream' : lang === 'sw' ? 'Kazi' : 'Chantier'}</th>
                          <th className="px-3 py-2">{lang === 'en' ? 'Expected output' : lang === 'sw' ? 'Matokeo' : 'Résultat attendu'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {buildSequence8.map((st, idx) => (
                          <tr key={st.step}>
                            <td className="px-3 py-2 font-mono font-semibold text-[#1E3A8A] tabular-nums">
                              0{st.step}
                            </td>
                            <td className="px-3 py-2 font-semibold text-zinc-900">
                              {st.work}
                              <span className="block font-normal text-[11px] text-zinc-500">
                                {program8Objectives[idx]?.objective}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-zinc-600">{st.output}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
