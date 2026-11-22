import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Award,
  Check,
  Compass,
  Download,
  FileSpreadsheet,
  FileText,
  Globe2,
  Info,
  Landmark,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react';
import {
  PROVINCE_6_BASELINES,
  type ExProvinceName,
} from '../data/ensoData';
import { useLanguage, type LanguageCode, type WorldLanguageCode } from '../i18n/LanguageContext';
import { useGlobalSync } from '../context/GlobalSyncContext';
import { getLocalizedDistrictProfileLabel } from '../i18n/localizedMlEconomicData';
import {
  computeEconomicAggregation,
  formatCurrencyFromMUsd,
  formatPct,
  SCENARIO_META_BY_LANG,
  type CurrencyCode,
  type HorizonYear,
  type ScenarioKey,
  type ScopeMode,
} from '../utils/economicAggregation';
import {
  exportClimateSummaryPdf,
  exportScientificExcel,
  exportScientificPdf,
  exportScientificWord,
  LICENSE_ATTRIBUTION,
} from '../utils/scientificReportGenerator';
import { downloadEconomicSimulationCsv } from '../utils/economicCsvExport';
import { emitIndriActivity } from '../utils/indriEvents';

type EvaluatorTab = 'provinces' | 'regions' | 'districts' | 'continental';
type BlocFilter = 'ALL' | 'COI' | 'SADC' | 'COMESA' | 'OTHER_AFRICA';
type RiskFilter = 'all' | 'drought' | 'mixed' | 'flood';

const EXTRA_ECO_LABELS: Record<
  LanguageCode,
  {
    provincesTableTitle: string;
    regionsTitle: string;
    regionsSubtitle: string;
    districtsTitle: string;
    coiTitle: string;
    sadcTitle: string;
    comesaTitle: string;
    africaTitle: string;
    africaSub: string;
    coiSub: string;
    sadcSub: string;
    comesaSub: string;
    exportPdf: string;
    exportWord: string;
    exportExcel: string;
    exportStudio: string;
    exportedMsg: string;
    emptyDistricts: string;
    proxyLabel: string;
    note2027: string;
    note2028: string;
    totalMadagascar: string;
    reboundGrossLabel: string;
    residualLossLabel: string;
    netBalanceLabel: string;
    directBarLegend: string;
    gdpBarLegend: string;
    otherAfricaFilter: string;
  }
> = {
  fr: {
    provincesTableTitle: 'Tableau consolidé des 6 ex-provinces et bilan national',
    regionsTitle: 'Évaluation détaillée sur les 23 régions officielles de Madagascar',
    regionsSubtitle:
      'Le district pilote de Maroantsetra (Ambatosoa) est agrégé dans la base régionale Analanjirofo / ex-province de Toamasina.',
    districtsTitle: 'Pertes unitaires estimées sur les 42 districts pilotes (jeu ML ADM2)',
    coiTitle: 'Commission de l’Océan Indien (COI)',
    sadcTitle: 'SADC (Afrique australe + COI)',
    comesaTitle: 'COMESA (Axe Nord-Sud & Îles)',
    africaTitle: 'Total Afrique modélisée (21 zones)',
    africaSub: 'Intensité moyenne continentale :',
    coiSub: 'Madagascar, Comores, Maurice, Seychelles, La Réunion & Mayotte',
    sadcSub: 'Choc combiné ceinture maïs (Afrique du Sud, Zambie, Zimbabwe, Malawi…)',
    comesaSub: 'Double signal : inondations Afrique de l’Est vs sécheresse Sud & Nil',
    exportPdf: 'PDF',
    exportWord: 'Word',
    exportExcel: 'Excel',
    exportStudio: 'Rapport Studio',
    exportedMsg: 'Rapport généré',
    emptyDistricts: 'Aucun district ne correspond aux filtres sélectionnés.',
    proxyLabel: '(proxy provincial)',
    note2027: 'Taux de référence : 1 USD = 4 550 MGA = 0,925 EUR · Agrégation pertes agricoles directes + effets indirects.',
    note2028: 'Taux de référence : 1 USD = 4 550 MGA = 0,925 EUR · En 2028, coût résiduel soudure T1–T2 et aléas La Niña distinct du rebond brut.',
    totalMadagascar: 'Total Madagascar',
    reboundGrossLabel: 'Rebond agricole brut 2028 :',
    residualLossLabel: 'Pertes résiduelles :',
    netBalanceLabel: 'Solde net :',
    directBarLegend: 'Barre haute : Pertes absolues',
    gdpBarLegend: 'Barre basse : Intensité macroéconomique (% du PIB)',
    otherAfricaFilter: 'Autres blocs Afrique',
  },
  en: {
    provincesTableTitle: 'Consolidated 6 Ex-Provinces & National Balance',
    regionsTitle: 'Detailed Loss Breakdown Across Madagascar’s 23 Official Regions',
    regionsSubtitle:
      'Maroantsetra (Ambatosoa) pilot district is consolidated within the Analanjirofo regional baseline (Toamasina province).',
    districtsTitle: 'Estimated Unit Losses Across 42 Modeled Pilot Districts (ADM2 ML)',
    coiTitle: 'Indian Ocean Commission (IOC)',
    sadcTitle: 'SADC (Southern Africa + IOC)',
    comesaTitle: 'COMESA (North-South Corridor & Islands)',
    africaTitle: 'Total Modeled Africa (21 Zones)',
    africaSub: 'Continental mean GDP intensity:',
    coiSub: 'Madagascar, Comoros, Mauritius, Seychelles, Réunion & Mayotte',
    sadcSub: 'Combined maize belt shock (South Africa, Zambia, Zimbabwe, Malawi…)',
    comesaSub: 'Dual signal: East Africa floods vs Southern Africa & Nile heat/drought',
    exportPdf: 'PDF',
    exportWord: 'Word',
    exportExcel: 'Excel',
    exportStudio: 'Report Studio',
    exportedMsg: 'Report generated',
    emptyDistricts: 'No districts match the selected filters.',
    proxyLabel: '(provincial proxy)',
    note2027: 'FX reference: 1 USD = 4,550 MGA = 0.925 EUR · Aggregates direct crop losses and indirect water/energy/infrastructure shocks.',
    note2028: 'FX reference: 1 USD = 4,550 MGA = 0.925 EUR · 2028 displays residual Q1–Q2 lean season & flood losses separately from gross crop rebound.',
    totalMadagascar: 'Madagascar Total',
    reboundGrossLabel: '2028 Gross Agri Rebound:',
    residualLossLabel: 'Residual losses:',
    netBalanceLabel: 'Net balance:',
    directBarLegend: 'Top bar: Absolute losses',
    gdpBarLegend: 'Bottom bar: Macroeconomic intensity (% of GDP)',
    otherAfricaFilter: 'Other Africa Blocs',
  },
  sw: {
    provincesTableTitle: 'Jedwali la Majimbo 6 na Jumla ya Kitaifa Madagaska',
    regionsTitle: 'Tathmini ya Kina katika Mikoa 23 Rasmi ya Madagaska',
    regionsSubtitle:
      'Wilaya ya Maroantsetra (Ambatosoa) imejumuishwa katika msingi wa mkoa wa Analanjirofo / Toamasina.',
    districtsTitle: 'Hasara za Kila Wilaya kwenye Wilaya 42 za Majaribio (ADM2 ML)',
    coiTitle: 'Tume ya Bahari ya Hindi (COI)',
    sadcTitle: 'SADC (Kusini mwa Afrika + COI)',
    comesaTitle: 'COMESA (Ukanda wa Kaskazini-Kusini & Visiwa)',
    africaTitle: 'Jumla Afrika Iliyochambuliwa (Maeneo 21)',
    africaSub: 'Wastani wa athari za Pato la Taifa:',
    coiSub: 'Madagaska, Komoro, Morisi, Shelisheli, Réunion & Mayotte',
    sadcSub: 'Mshtuko wa mahindi (Afrika Kusini, Zambia, Zimbabwe, Malawi…)',
    comesaSub: 'Ishara pacha: mafuriko Afrika Mashariki vs ukame Kusini & Nile',
    exportPdf: 'PDF',
    exportWord: 'Word',
    exportExcel: 'Excel',
    exportStudio: 'Studio ya Ripoti',
    exportedMsg: 'Ripoti imeundwa',
    emptyDistricts: 'Hakuna wilaya inayolingana na vichujio.',
    proxyLabel: '(kadirio la jimbo)',
    note2027: 'Kiwango cha ubadilishaji: 1 USD = 4,550 MGA = 0.925 EUR · Hasara za kilimo na athari zisizo za moja kwa moja.',
    note2028: 'Kiwango cha ubadilishaji: 1 USD = 4,550 MGA = 0.925 EUR · 2028 huonyesha hasara za kipindi cha mpito kando na ahueni ya mazao.',
    totalMadagascar: 'Jumla Madagaska',
    reboundGrossLabel: 'Ahueni ya Kilimo 2028:',
    residualLossLabel: 'Hasara zilizobaki:',
    netBalanceLabel: 'Salio halisi:',
    directBarLegend: 'Mstari wa juu: Hasara halisi',
    gdpBarLegend: 'Mstari wa chini: Uzito wa kiuchumi (% Pato la Taifa)',
    otherAfricaFilter: 'Kanda Nyingine za Afrika',
  },
};

const EXPORT_CSV_BY_WORLD_LANG: Record<
  WorldLanguageCode,
  { buttonLabel: string; exportedLabel: string }
> = {
  fr: { buttonLabel: 'Exporter en CSV', exportedLabel: 'CSV exporté' },
  en: { buttonLabel: 'Export to CSV', exportedLabel: 'CSV exported' },
  sw: { buttonLabel: 'Pakua CSV', exportedLabel: 'CSV imepakuliwa' },
  es: { buttonLabel: 'Exportar a CSV', exportedLabel: 'CSV exportado' },
  ar: { buttonLabel: 'تصدير إلى CSV', exportedLabel: 'تم تصدير CSV' },
  zh: { buttonLabel: '导出为 CSV', exportedLabel: '已导出 CSV' },
  pt: { buttonLabel: 'Exportar para CSV', exportedLabel: 'CSV exportado' },
  hi: { buttonLabel: 'CSV में निर्यात करें', exportedLabel: 'CSV निर्यात हो गया' },
  ru: { buttonLabel: 'Экспорт в CSV', exportedLabel: 'CSV экспортирован' },
};

export function EconomicLossEvaluator() {
  const { lang, worldLang, t, ui, actions } = useLanguage();
  const { syncState, hasLiveScrape } = useGlobalSync();
  const ecoUi = ui.economic;
  const ex = EXTRA_ECO_LABELS[lang];
  const csvCopy = EXPORT_CSV_BY_WORLD_LANG[worldLang];
  const lic = LICENSE_ATTRIBUTION[lang];
  const scenarioMap = SCENARIO_META_BY_LANG[lang];

  const [horizonYear, setHorizonYear] = useState<HorizonYear>(2027);
  const [scenario, setScenario] = useState<ScenarioKey>('s2');
  const [scope, setScope] = useState<ScopeMode>('consolidated119');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [activeTab, setActiveTab] = useState<EvaluatorTab>('provinces');

  const [regionProvinceFilter, setRegionProvinceFilter] = useState<ExProvinceName | 'ALL'>('ALL');
  const [regionSortBy, setRegionSortBy] = useState<'total' | 'gdpPct'>('total');

  const [districtSearch, setDistrictSearch] = useState('');
  const [districtProvinceFilter, setDistrictProvinceFilter] = useState<ExProvinceName | 'ALL'>('ALL');
  const [districtRiskFilter, setDistrictRiskFilter] = useState<RiskFilter>('all');

  const [blocFilter, setBlocFilter] = useState<BlocFilter>('ALL');
  const [countrySearch, setCountrySearch] = useState('');

  const [busyExport, setBusyExport] = useState<'pdf' | 'word' | 'excel' | null>(null);
  const [exportedFlag, setExportedFlag] = useState<'pdf' | 'word' | 'excel' | 'csv' | null>(null);

  const model = useMemo(() => {
    const base = computeEconomicAggregation({
      horizonYear,
      scenario,
      scope,
      lang,
    });
    if (!hasLiveScrape) return base;

    const mf = syncState.madagascarFactors.overallLossFactor;
    const af = syncState.zoneFactors.afrique.gdpLossFactor;

    return {
      ...base,
      districtRows: base.districtRows.map((d) => ({
        ...d,
        riceLossMUsd: d.riceLossMUsd * mf,
        maizeLossMUsd: d.maizeLossMUsd * mf,
        exportLossMUsd: d.exportLossMUsd * mf,
        directAgriLossMUsd: d.directAgriLossMUsd * mf,
        indirectLossMUsd: d.indirectLossMUsd * mf,
        totalLossMUsd: d.totalLossMUsd * mf,
        netBalance2028MUsd: d.grossRebound2028MUsd - d.totalLossMUsd * mf,
        agriShockPct: Number((d.agriShockPct * mf).toFixed(1)),
      })),
      regionRows: base.regionRows.map((r) => ({
        ...r,
        riceLossMUsd: r.riceLossMUsd * mf,
        maizeLossMUsd: r.maizeLossMUsd * mf,
        exportLossMUsd: r.exportLossMUsd * mf,
        directAgriLossMUsd: r.directAgriLossMUsd * mf,
        indirectLossMUsd: r.indirectLossMUsd * mf,
        totalLossMUsd: r.totalLossMUsd * mf,
        netBalance2028MUsd: r.grossRebound2028MUsd - r.totalLossMUsd * mf,
        gdpImpactPct: Number((r.gdpImpactPct * mf).toFixed(2)),
        agriImpactPct: Number((r.agriImpactPct * mf).toFixed(2)),
      })),
      provinceRows: base.provinceRows.map((pr) => ({
        ...pr,
        riceLossMUsd: pr.riceLossMUsd * mf,
        maizeLossMUsd: pr.maizeLossMUsd * mf,
        exportLossMUsd: pr.exportLossMUsd * mf,
        directAgriLossMUsd: pr.directAgriLossMUsd * mf,
        indirectLossMUsd: pr.indirectLossMUsd * mf,
        totalLossMUsd: pr.totalLossMUsd * mf,
        netBalance2028MUsd: pr.grossRebound2028MUsd - pr.totalLossMUsd * mf,
        gdpImpactPct: Number((pr.gdpImpactPct * mf).toFixed(2)),
        agriImpactPct: Number((pr.agriImpactPct * mf).toFixed(2)),
      })),
      madagascar: {
        ...base.madagascar,
        directMUsd: base.madagascar.directMUsd * mf,
        indirectMUsd: base.madagascar.indirectMUsd * mf,
        totalLossMUsd: base.madagascar.totalLossMUsd * mf,
        gdpPct: Number((base.madagascar.gdpPct * mf).toFixed(2)),
        agriPct: Number((base.madagascar.agriPct * mf).toFixed(2)),
        net2028MUsd: base.madagascar.rebound2028MUsd - base.madagascar.totalLossMUsd * mf,
      },
      countryRows: base.countryRows.map((c) => {
        const mult = c.countryOrZone.toLowerCase().includes('madagascar') ? mf : af;
        return {
          ...c,
          directLossMUsd: c.directLossMUsd * mult,
          indirectLossMUsd: c.indirectLossMUsd * mult,
          totalLossMUsd: c.totalLossMUsd * mult,
          gdpImpactPct: Number((c.gdpImpactPct * mult).toFixed(2)),
          netBalanceAdj2028MUsd: c.netBalanceAdj2028MUsd * mult,
        };
      }),
      blocs: {
        coiTotalMUsd: base.blocs.coiTotalMUsd * ((mf + af) / 2),
        sadcTotalMUsd: base.blocs.sadcTotalMUsd * af,
        comesaTotalMUsd: base.blocs.comesaTotalMUsd * af,
        africaTotalMUsd: base.blocs.africaTotalMUsd * af,
        africaGdpPct: Number((base.blocs.africaGdpPct * af).toFixed(2)),
      },
    };
  }, [horizonYear, scenario, scope, lang, hasLiveScrape, syncState.madagascarFactors.overallLossFactor, syncState.zoneFactors.afrique.gdpLossFactor]);

  const sortedProvinces = useMemo(
    () => [...model.provinceRows].sort((a, b) => b.totalLossMUsd - a.totalLossMUsd),
    [model.provinceRows],
  );

  const filteredRegions = useMemo(() => {
    const base =
      regionProvinceFilter === 'ALL'
        ? model.regionRows
        : model.regionRows.filter((r) => r.meta.province === regionProvinceFilter);
    return [...base].sort((a, b) =>
      regionSortBy === 'total'
        ? b.totalLossMUsd - a.totalLossMUsd
        : b.gdpImpactPct - a.gdpImpactPct,
    );
  }, [model.regionRows, regionProvinceFilter, regionSortBy]);

  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase();
    return [...model.districtRows]
      .filter((d) => {
        if (districtProvinceFilter !== 'ALL' && d.province !== districtProvinceFilter) return false;
        if (districtRiskFilter !== 'all' && d.point.riskTier !== districtRiskFilter) return false;
        if (
          q &&
          !d.point.district.toLowerCase().includes(q) &&
          !d.displayRegion.toLowerCase().includes(q) &&
          !d.province.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  }, [model.districtRows, districtSearch, districtProvinceFilter, districtRiskFilter]);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    return [...model.countryRows]
      .filter((c) => {
        if (blocFilter === 'COI' && !c.blocs.includes('COI')) return false;
        if (blocFilter === 'SADC' && !c.blocs.includes('SADC')) return false;
        if (blocFilter === 'COMESA' && !c.blocs.includes('COMESA')) return false;
        if (blocFilter === 'OTHER_AFRICA' && c.primaryGroup !== 'Autres blocs Afrique') return false;
        if (
          q &&
          !c.countryOrZone.toLowerCase().includes(q) &&
          !c.transmissionChannel.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd);
  }, [model.countryRows, blocFilter, countrySearch]);

  const handleJumpToDistrictOnMap = (districtName: string) => {
    window.dispatchEvent(
      new CustomEvent('select-madagascar-district', { detail: { district: districtName } }),
    );
    const mapSection = document.getElementById('modele-ml');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickReportExport = async (format: 'pdf' | 'word' | 'excel') => {
    setBusyExport(format);
    setExportedFlag(null);
    emitIndriActivity({
      state: 'processing',
      label: `${ex.exportStudio} · ${format.toUpperCase()}`,
      detail: `${lic.licenseHolder} · ${horizonYear} · ${scenario.toUpperCase()}`,
    });
    try {
      const opts = {
        horizonYear,
        scenario,
        scope,
        currency,
        lang,
        includeRegions23: true,
        includeDistricts42: true,
        includeContinental: true,
      };
      if (format === 'pdf') await exportScientificPdf(opts);
      else if (format === 'word') await exportScientificWord(opts);
      else exportScientificExcel(opts);

      setExportedFlag(format);
      emitIndriActivity({
        state: 'speaking',
        label: `${ex.exportedMsg} (${format.toUpperCase()})`,
        detail: `${lic.licenseHolder} · DG ${lic.directorName}`,
      });
      setTimeout(() => setExportedFlag(null), 3500);
    } finally {
      setBusyExport(null);
    }
  };

  const handleOpenStudioModal = () => {
    window.dispatchEvent(
      new CustomEvent('open-scientific-report', {
        detail: { horizonYear, scenario, scope, currency },
      }),
    );
  };

  const handleExportCsv = () => {
    const { filename, rowCount } = downloadEconomicSimulationCsv({
      model,
      currency,
      horizonYear,
      scenario,
      scope,
      hasLiveScrape,
      madagascarLiveFactor: syncState.madagascarFactors.overallLossFactor,
      africaLiveFactor: syncState.zoneFactors.afrique.gdpLossFactor,
    });
    setExportedFlag('csv');
    emitIndriActivity({
      state: 'speaking',
      label: csvCopy.exportedLabel,
      detail: `${filename} (${rowCount} rows · ${currency})`,
    });
    setTimeout(() => setExportedFlag(null), 3500);
  };

  const maxProvinceLoss = Math.max(1, ...sortedProvinces.map((p) => p.totalLossMUsd));
  const maxCountryLoss = Math.max(1, ...filteredCountries.map((c) => c.totalLossMUsd));
  const maxCountryGdpPct = Math.max(0.5, ...filteredCountries.map((c) => c.gdpImpactPct));

  return (
    <section id="pertes-economiques" className="border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">
            {t.sections.s08Eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {t.sections.s08Title}
          </h2>
          <p className="mt-3 max-w-[78ch] text-base leading-relaxed text-zinc-600">
            {t.sections.s08Lead}
          </p>

          {/* Rigorous Methodological Disclaimer */}
          <div className="mt-5 flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 text-xs text-zinc-700 sm:flex-row sm:items-start sm:gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-zinc-900">{t.economic.disclaimerTitle}</strong>{' '}
              {ecoUi.disclaimerBody}
            </p>
          </div>
        </div>

        {/* Interactive Parameter Toolbar + On-Demand Scientific Report Exports */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
            {/* Horizon */}
            <div className="lg:col-span-3">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {t.economic.horizonLabel}
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-md border border-zinc-200 bg-[#F9F8F4] p-1">
                <button
                  type="button"
                  onClick={() => setHorizonYear(2027)}
                  className={`rounded px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    horizonYear === 2027
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-700 hover:bg-white'
                  }`}
                >
                  {t.economic.year2027Btn}
                </button>
                <button
                  type="button"
                  onClick={() => setHorizonYear(2028)}
                  className={`rounded px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    horizonYear === 2028
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-zinc-700 hover:bg-white'
                  }`}
                >
                  {t.economic.year2028Btn}
                </button>
              </div>
            </div>

            {/* Scenario */}
            <div className="lg:col-span-4">
              <label
                htmlFor="eval-scenario"
                className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
              >
                {t.economic.scenarioLabel}
              </label>
              <select
                id="eval-scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioKey)}
                className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                {(['s1', 's2', 's3'] as ScenarioKey[]).map((key) => (
                  <option key={key} value={key}>
                    {scenarioMap[key].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scope */}
            <div className="lg:col-span-3">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {t.economic.scopeLabel}
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-md border border-zinc-200 bg-[#F9F8F4] p-1">
                <button
                  type="button"
                  onClick={() => setScope('consolidated119')}
                  className={`rounded px-2 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    scope === 'consolidated119'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-white'
                  }`}
                >
                  {t.economic.scope119}
                </button>
                <button
                  type="button"
                  onClick={() => setScope('pilot42')}
                  className={`rounded px-2 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    scope === 'pilot42'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-white'
                  }`}
                >
                  {t.economic.scope42}
                </button>
              </div>
            </div>

            {/* Currency */}
            <div className="lg:col-span-2">
              <label
                htmlFor="eval-currency"
                className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
              >
                {t.economic.currencyLabel}
              </label>
              <select
                id="eval-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="mt-1.5 min-h-10 w-full rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-xs font-semibold text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="MGA">MGA (Ar)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Direct Scientific Report Export Bar (PDF / Word / Excel / Studio + M&G Consulting Credit) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <Award className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span className="text-[11px] font-semibold text-zinc-700">
                {lic.licenseHolder} · DG : {lic.directorName}
              </span>
              <span className="text-zinc-300">|</span>
              <span className="text-[11px] text-zinc-500">
                {scenarioMap[scenario].note} · {horizonYear === 2028 ? ex.note2028 : ex.note2027}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3.5 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:border-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-[#1E3A8A] whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>{csvCopy.buttonLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickReportExport('pdf')}
                disabled={busyExport !== null}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-rose-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-800 disabled:opacity-60"
              >
                {busyExport === 'pdf' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{ex.exportPdf}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickReportExport('word')}
                disabled={busyExport !== null}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] disabled:opacity-60"
              >
                {busyExport === 'word' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{ex.exportWord}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickReportExport('excel')}
                disabled={busyExport !== null}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
              >
                {busyExport === 'excel' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{ex.exportExcel}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  exportClimateSummaryPdf({
                    lang,
                    horizonYear,
                    scenario,
                    currency,
                    syncState,
                  })
                }
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-rose-700/40 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition-colors hover:bg-rose-50"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{actions.pdfSummaryBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenStudioModal}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-[#1E3A8A]/40 bg-white px-3 py-2 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/5"
              >
                <span>{ex.exportStudio}</span>
              </button>

              {exportedFlag && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {exportedFlag === 'csv' ? csvCopy.exportedLabel : ex.exportedMsg}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <span className="block text-xs font-medium text-zinc-500">
              {t.economic.kpiMadagascarTotal} ({horizonYear})
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-semibold text-[#1E3A8A] tabular-nums">
              {formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}
            </span>
            <span className="mt-1.5 block text-xs text-zinc-600 tabular-nums">
              <strong className="font-mono font-semibold text-zinc-900">
                {formatPct(model.madagascar.gdpPct, 2, lang)}
              </strong>{' '}
              · {ecoUi.kpiMadagascarSub}
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <span className="block text-xs font-medium text-zinc-500">
              {t.economic.kpiDirectVsIndirect}
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                {formatCurrencyFromMUsd(model.madagascar.directMUsd, currency, false, lang)}
              </span>
              <span className="text-xs text-zinc-400">/</span>
              <span className="font-mono text-lg font-semibold text-amber-800 tabular-nums">
                {formatCurrencyFromMUsd(model.madagascar.indirectMUsd, currency, false, lang)}
              </span>
            </div>
            <span className="mt-1.5 block text-xs text-zinc-600 tabular-nums">
              {ecoUi.kpiDirectSub}{' '}
              <strong className="font-mono font-semibold text-zinc-900">
                −{formatPct(model.madagascar.agriPct, 2, lang)}
              </strong>
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <span className="block text-xs font-medium text-zinc-500">
              {t.economic.kpiCoi}
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-semibold text-zinc-900 tabular-nums">
              {formatCurrencyFromMUsd(model.blocs.coiTotalMUsd, currency, false, lang)}
            </span>
            <span className="mt-1.5 block text-xs text-zinc-600 tabular-nums">
              <strong className="font-mono font-semibold text-zinc-900">
                {formatPct(
                  model.blocs.coiTotalMUsd > 0
                    ? (model.madagascar.totalLossMUsd / model.blocs.coiTotalMUsd) * 100
                    : 0,
                  1,
                  lang,
                )}
              </strong>{' '}
              · {horizonYear === 2027 ? ecoUi.kpiCoiSub2027 : ecoUi.kpiCoiSub2028}
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <span className="block text-xs font-medium text-zinc-500">
              {t.economic.kpiAfrica}
            </span>
            <span className="mt-1.5 block font-mono text-2xl font-semibold text-zinc-900 tabular-nums">
              {formatCurrencyFromMUsd(model.blocs.africaTotalMUsd, currency, false, lang)}
            </span>
            <span className="mt-1.5 block text-xs text-zinc-600 tabular-nums">
              SADC :{' '}
              <strong className="font-mono font-medium text-zinc-900">
                {formatCurrencyFromMUsd(model.blocs.sadcTotalMUsd, currency, false, lang)}
              </strong>{' '}
              · COMESA :{' '}
              <strong className="font-mono font-medium text-zinc-900">
                {formatCurrencyFromMUsd(model.blocs.comesaTotalMUsd, currency, false, lang)}
              </strong>
            </span>
          </div>
        </div>

        {/* 4 Editorial Navigation Sub-Tabs */}
        <div
          role="tablist"
          aria-label={t.sections.s08Title}
          className="mt-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-3"
        >
          {[
            { id: 'provinces', label: t.economic.tabProvinces, icon: Landmark },
            { id: 'regions', label: t.economic.tabRegions, icon: Compass },
            { id: 'districts', label: t.economic.tabDistricts, icon: MapPin },
            { id: 'continental', label: t.economic.tabContinental, icon: Globe2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id as EvaluatorTab)}
                className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: 6 EX-PROVINCES (MADAGASCAR) */}
        {activeTab === 'provinces' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-5">
                <h3 className="font-serif text-lg font-semibold text-zinc-900">
                  {ecoUi.provincesChartTitle} ({horizonYear})
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{ecoUi.provincesChartSubtitle}</p>

                <div className="mt-4 flex items-center gap-4 text-[11px] font-medium text-zinc-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 bg-[#1E3A8A]" />
                    {ecoUi.legendDirect}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 bg-amber-600" />
                    {ecoUi.legendIndirect}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {sortedProvinces.map((prov) => {
                    const directWidthPct = (prov.directAgriLossMUsd / maxProvinceLoss) * 100;
                    const indirectWidthPct = (prov.indirectLossMUsd / maxProvinceLoss) * 100;
                    return (
                      <div key={prov.province}>
                        <div className="flex items-baseline justify-between gap-2 text-xs">
                          <span className="font-semibold text-zinc-900">
                            {prov.province}{' '}
                            <span className="font-normal text-zinc-500">
                              ({prov.districtCount119} ADM2)
                            </span>
                          </span>
                          <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                            {formatCurrencyFromMUsd(prov.totalLossMUsd, currency, false, lang)} ·{' '}
                            <span className="text-[#1E3A8A]">
                              {formatPct(prov.gdpImpactPct, 2, lang)}
                            </span>
                          </span>
                        </div>
                        <svg
                          viewBox="0 0 100 8"
                          className="mt-1.5 h-3 w-full overflow-hidden rounded bg-zinc-100"
                          role="img"
                          aria-label={`${prov.province} : ${formatCurrencyFromMUsd(prov.totalLossMUsd, currency, false, lang)}`}
                        >
                          <rect x="0" y="0" width={directWidthPct} height="8" fill="#1E3A8A" />
                          <rect
                            x={directWidthPct}
                            y="0"
                            width={indirectWidthPct}
                            height="8"
                            fill="#D97706"
                          />
                        </svg>
                        <p className="mt-1 text-[11px] text-zinc-500">{prov.dominantChannel}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-zinc-900">
                      {ex.provincesTableTitle}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {scope === 'consolidated119' ? t.economic.scope119 : t.economic.scope42}
                    </p>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        <th className="py-2.5 pr-3">{ecoUi.provincesTableHeaders.province}</th>
                        <th className="py-2.5 px-2 text-right">{ecoUi.provincesTableHeaders.rice}</th>
                        <th className="py-2.5 px-2 text-right">{ecoUi.provincesTableHeaders.maize}</th>
                        <th className="py-2.5 px-2 text-right">{ecoUi.provincesTableHeaders.exportCrop}</th>
                        <th className="py-2.5 px-2 text-right">{ecoUi.provincesTableHeaders.indirect}</th>
                        <th className="py-2.5 px-2 text-right">{ecoUi.provincesTableHeaders.total}</th>
                        <th className="py-2.5 pl-2 text-right">{ecoUi.provincesTableHeaders.gdpShare}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {sortedProvinces.map((p) => (
                        <tr key={p.province} className="hover:bg-[#F9F8F4]/70">
                          <td className="py-3 pr-3">
                            <button
                              type="button"
                              onClick={() => {
                                setRegionProvinceFilter(p.province);
                                setActiveTab('regions');
                              }}
                              className="font-semibold text-zinc-900 hover:text-[#1E3A8A] hover:underline text-left"
                            >
                              {p.province}
                            </button>
                            <span className="block text-[11px] text-zinc-500">
                              {p.pilotDistrictCount} / {p.districtCount119} ADM2
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                            {formatCurrencyFromMUsd(p.riceLossMUsd, currency, false, lang)}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                            {formatCurrencyFromMUsd(p.maizeLossMUsd, currency, false, lang)}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                            {formatCurrencyFromMUsd(p.exportLossMUsd, currency, false, lang)}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-amber-800 tabular-nums">
                            {formatCurrencyFromMUsd(p.indirectLossMUsd, currency, false, lang)}
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-semibold text-zinc-900 tabular-nums">
                            {formatCurrencyFromMUsd(p.totalLossMUsd, currency, false, lang)}
                          </td>
                          <td className="py-3 pl-2 text-right font-mono font-semibold text-[#1E3A8A] tabular-nums">
                            {formatPct(p.gdpImpactPct, 2, lang)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-300 bg-[#F9F8F4] font-semibold">
                        <td className="py-3 pr-3 text-zinc-900">{ex.totalMadagascar}</td>
                        <td className="py-3 px-2 text-right font-mono text-zinc-900 tabular-nums">
                          {formatCurrencyFromMUsd(
                            sortedProvinces.reduce((a, p) => a + p.riceLossMUsd, 0),
                            currency,
                            false,
                            lang,
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-zinc-900 tabular-nums">
                          {formatCurrencyFromMUsd(
                            sortedProvinces.reduce((a, p) => a + p.maizeLossMUsd, 0),
                            currency,
                            false,
                            lang,
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-zinc-900 tabular-nums">
                          {formatCurrencyFromMUsd(
                            sortedProvinces.reduce((a, p) => a + p.exportLossMUsd, 0),
                            currency,
                            false,
                            lang,
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-amber-800 tabular-nums">
                          {formatCurrencyFromMUsd(model.madagascar.indirectMUsd, currency, false, lang)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-[#1E3A8A] tabular-nums">
                          {formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}
                        </td>
                        <td className="py-3 pl-2 text-right font-mono text-[#1E3A8A] tabular-nums">
                          {formatPct(model.madagascar.gdpPct, 2, lang)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {horizonYear === 2028 && (
                  <div className="mt-5 rounded-md border border-zinc-200 bg-[#F9F8F4] p-3.5 text-xs text-zinc-700">
                    <span className="font-semibold text-zinc-900">{ex.reboundGrossLabel}</span>{' '}
                    <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                      +{formatCurrencyFromMUsd(model.madagascar.rebound2028MUsd, currency, false, lang)}
                    </span>{' '}
                    · {ex.residualLossLabel}{' '}
                    <span className="font-mono font-semibold text-amber-800 tabular-nums">
                      {formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}
                    </span>{' '}
                    · {ex.netBalanceLabel}{' '}
                    <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                      {formatCurrencyFromMUsd(model.madagascar.net2028MUsd, currency, true, lang)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 23 RÉGIONS OFFICIELLES */}
        {activeTab === 'regions' && (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">{ex.regionsTitle}</h3>
                <p className="mt-1 text-xs text-zinc-500">{ex.regionsSubtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label={ecoUi.regionsFilterAll}
                  value={regionProvinceFilter}
                  onChange={(e) =>
                    setRegionProvinceFilter(e.target.value as ExProvinceName | 'ALL')
                  }
                  className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="ALL">{ecoUi.regionsFilterAll}</option>
                  {PROVINCE_6_BASELINES.map((p) => (
                    <option key={p.province} value={p.province}>
                      {p.province}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    setRegionSortBy((prev) => (prev === 'total' ? 'gdpPct' : 'total'))
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 whitespace-nowrap"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {regionSortBy === 'total' ? ecoUi.regionsSortTotal : ecoUi.regionsSortGdp}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-2.5 pr-3">{ecoUi.regionsHeaders.regionProvince}</th>
                    <th className="py-2.5 px-2">{ecoUi.provincesTableHeaders.province}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.regionsHeaders.districts}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.regionsHeaders.rice}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.regionsHeaders.maize}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.regionsHeaders.exportCrop}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.regionsHeaders.indirect}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.regionsHeaders.total}</th>
                    <th className="py-2.5 pl-2 text-right">{ecoUi.regionsHeaders.gdpPct}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredRegions.map((r) => (
                    <tr key={r.meta.region} className="hover:bg-[#F9F8F4]/70">
                      <td className="py-3 pr-3 font-semibold text-zinc-900">
                        {r.meta.region}
                        {!r.coveredByPilot && (
                          <span className="ml-1.5 text-[10px] font-normal text-zinc-500">
                            {ex.proxyLabel}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-zinc-600">{r.meta.province}</td>
                      <td className="py-3 px-2 text-right font-mono text-zinc-500 tabular-nums">
                        {r.pilotDistrictCount}/{r.meta.districtsTotal}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatCurrencyFromMUsd(r.riceLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatCurrencyFromMUsd(r.maizeLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatCurrencyFromMUsd(r.exportLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-amber-800 tabular-nums">
                        {formatCurrencyFromMUsd(r.indirectLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-semibold text-zinc-900 tabular-nums">
                        {formatCurrencyFromMUsd(r.totalLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-3 pl-2 text-right font-mono font-semibold text-[#1E3A8A] tabular-nums">
                        {formatPct(r.gdpImpactPct, 2, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: 42 DISTRICTS MODÉLISÉS */}
        {activeTab === 'districts' && (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">{ex.districtsTitle}</h3>
                <p className="mt-1 text-xs text-zinc-500">{ecoUi.districtsTotalNote}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder={ecoUi.districtsSearchPlaceholder}
                    className="w-48 rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2.5 text-xs text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <select
                  aria-label={ecoUi.districtsAllRegions}
                  value={districtProvinceFilter}
                  onChange={(e) =>
                    setDistrictProvinceFilter(e.target.value as ExProvinceName | 'ALL')
                  }
                  className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="ALL">{ecoUi.districtsAllRegions}</option>
                  {PROVINCE_6_BASELINES.map((p) => (
                    <option key={p.province} value={p.province}>
                      {p.province}
                    </option>
                  ))}
                </select>

                <select
                  aria-label={ecoUi.districtsAllProfiles}
                  value={districtRiskFilter}
                  onChange={(e) => setDistrictRiskFilter(e.target.value as RiskFilter)}
                  className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 focus:border-[#1E3A8A] focus:outline-none"
                >
                  <option value="all">{ecoUi.districtsAllProfiles}</option>
                  <option value="drought">{ui.districtStudio.riskTiers.drought}</option>
                  <option value="mixed">{ui.districtStudio.riskTiers.mixed}</option>
                  <option value="flood">{ui.districtStudio.riskTiers.flood}</option>
                </select>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-2.5 pr-3">{ecoUi.districtsHeaders.district}</th>
                    <th className="py-2.5 px-2">{ecoUi.districtsHeaders.regionProv}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.districtsHeaders.rice}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.districtsHeaders.maize}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.districtsHeaders.exportCrop}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.provincesTableHeaders.indirect}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.districtsHeaders.total}</th>
                    <th className="py-2.5 px-2 text-right">{ecoUi.districtsHeaders.profile}</th>
                    <th className="py-2.5 pl-2 text-right">{ecoUi.districtsHeaders.mapAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredDistricts.map((d) => (
                    <tr key={d.point.district} className="hover:bg-[#F9F8F4]/70">
                      <td className="py-2.5 pr-3 font-semibold text-zinc-900">
                        {d.point.district}
                      </td>
                      <td className="py-2.5 px-2 text-zinc-600">
                        {d.displayRegion}{' '}
                        <span className="text-zinc-400">· {d.province}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatCurrencyFromMUsd(d.riceLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatCurrencyFromMUsd(d.maizeLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-zinc-700 tabular-nums">
                        {formatCurrencyFromMUsd(d.exportLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-amber-800 tabular-nums">
                        {formatCurrencyFromMUsd(d.indirectLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-semibold text-zinc-900 tabular-nums">
                        {formatCurrencyFromMUsd(d.totalLossMUsd, currency, false, lang)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-[11px] text-[#1E3A8A] tabular-nums">
                        {getLocalizedDistrictProfileLabel(d.point.profile, lang)} (−
                        {formatPct(d.agriShockPct, 1, lang)})
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleJumpToDistrictOnMap(d.point.district)}
                          className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-[#F9F8F4] px-2 py-1 text-[11px] font-semibold text-zinc-800 hover:border-[#1E3A8A] hover:text-[#1E3A8A] whitespace-nowrap"
                        >
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          <span>{ecoUi.viewOnMapBtn}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDistricts.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-xs text-zinc-500">
                        {ex.emptyDistricts}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: OCÉAN INDIEN, COMESA, SADC & ENSEMBLE AFRIQUE */}
        {activeTab === 'continental' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {ex.coiTitle}
                </span>
                <span className="mt-1 block font-mono text-xl font-semibold text-[#1E3A8A] tabular-nums">
                  {formatCurrencyFromMUsd(model.blocs.coiTotalMUsd, currency, false, lang)}
                </span>
                <span className="mt-1 block text-[11px] text-zinc-500">{ex.coiSub}</span>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {ex.sadcTitle}
                </span>
                <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                  {formatCurrencyFromMUsd(model.blocs.sadcTotalMUsd, currency, false, lang)}
                </span>
                <span className="mt-1 block text-[11px] text-zinc-500">{ex.sadcSub}</span>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {ex.comesaTitle}
                </span>
                <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                  {formatCurrencyFromMUsd(model.blocs.comesaTotalMUsd, currency, false, lang)}
                </span>
                <span className="mt-1 block text-[11px] text-zinc-500">{ex.comesaSub}</span>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {ex.africaTitle}
                </span>
                <span className="mt-1 block font-mono text-xl font-semibold text-zinc-900 tabular-nums">
                  {formatCurrencyFromMUsd(model.blocs.africaTotalMUsd, currency, false, lang)}
                </span>
                <span className="mt-1 block text-[11px] text-zinc-500 tabular-nums">
                  {ex.africaSub} {formatPct(model.blocs.africaGdpPct, 2, lang)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: ecoUi.continentalFilters.all },
                    { id: 'COI', label: ecoUi.continentalFilters.COI },
                    { id: 'SADC', label: ecoUi.continentalFilters.SADC },
                    { id: 'COMESA', label: ecoUi.continentalFilters.COMESA },
                    { id: 'OTHER_AFRICA', label: ex.otherAfricaFilter },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBlocFilter(f.id as BlocFilter)}
                      className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                        blocFilter === f.id
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : 'border-zinc-200 bg-[#F9F8F4] text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder={ui.common.searchPlaceholder}
                    className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-900 sm:w-60 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Comparative Dual-Metric Visual Bars */}
              <div className="mt-6 rounded-md border border-zinc-200 bg-[#F9F8F4] p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-serif text-base font-semibold text-zinc-900">
                    {ecoUi.continentalChartTitle}
                  </h4>
                  <span className="text-[11px] text-zinc-500">
                    {horizonYear === 2027 ? ecoUi.kpiAfricaSub2027 : ecoUi.kpiAfricaSub2028}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                  {filteredCountries.slice(0, 10).map((c) => {
                    const absPct = (c.totalLossMUsd / maxCountryLoss) * 100;
                    const relPct = (c.gdpImpactPct / maxCountryGdpPct) * 100;
                    return (
                      <div
                        key={c.id}
                        className={`rounded border p-2.5 ${
                          c.isMadagascarDynamic
                            ? 'border-[#1E3A8A]/40 bg-white'
                            : 'border-zinc-200/80 bg-white/70'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2 text-xs">
                          <span
                            className={`font-semibold ${
                              c.isMadagascarDynamic ? 'text-[#1E3A8A]' : 'text-zinc-900'
                            }`}
                          >
                            {c.countryOrZone}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-900 tabular-nums">
                            {formatCurrencyFromMUsd(c.totalLossMUsd, currency, false, lang)} ·{' '}
                            <span className="text-amber-800">
                              {formatPct(c.gdpImpactPct, 2, lang)}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <svg viewBox="0 0 100 4" className="h-1.5 w-full rounded bg-zinc-100">
                            <rect
                              x="0"
                              y="0"
                              width={absPct}
                              height="4"
                              fill={c.isMadagascarDynamic ? '#1E3A8A' : '#3F3F46'}
                            />
                          </svg>
                          <svg viewBox="0 0 100 4" className="h-1.5 w-full rounded bg-zinc-100">
                            <rect x="0" y="0" width={relPct} height="4" fill="#D97706" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-4 bg-zinc-700" />
                    {ex.directBarLegend} ({currency})
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-4 bg-amber-600" />
                    {ex.gdpBarLegend}
                  </span>
                </div>
              </div>

              {/* Full Country / Bloc Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      <th className="py-2.5 pr-3">{ecoUi.continentalTableHeaders.country}</th>
                      <th className="py-2.5 px-2">{ecoUi.continentalTableHeaders.blocs}</th>
                      <th className="py-2.5 px-2 text-right">{ecoUi.continentalTableHeaders.direct}</th>
                      <th className="py-2.5 px-2 text-right">{ecoUi.continentalTableHeaders.indirect}</th>
                      <th className="py-2.5 px-2 text-right">{ecoUi.continentalTableHeaders.total2027}</th>
                      <th className="py-2.5 px-2 text-right">{ecoUi.continentalTableHeaders.gdpShare}</th>
                      <th className="py-2.5 px-2 text-right">{ecoUi.continentalTableHeaders.bal2028}</th>
                      <th className="py-2.5 pl-3">{ecoUi.continentalTableHeaders.signal}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredCountries.map((c) => (
                      <tr
                        key={c.id}
                        className={
                          c.isMadagascarDynamic
                            ? 'bg-[#1E3A8A]/[0.04] font-medium'
                            : 'hover:bg-[#F9F8F4]/70'
                        }
                      >
                        <td className="py-3 pr-3 align-top">
                          <span
                            className={`font-semibold ${
                              c.isMadagascarDynamic ? 'text-[#1E3A8A]' : 'text-zinc-900'
                            }`}
                          >
                            {c.countryOrZone}
                          </span>
                          <span className="block text-[11px] text-zinc-500 tabular-nums">
                            {ecoUi.continentalTableHeaders.gdp}: {c.gdpBnUsd} · {c.agriSharePct}%
                          </span>
                        </td>
                        <td className="py-3 px-2 align-top text-[11px] font-mono text-zinc-600">
                          {c.blocs.filter((b) => b !== 'Afrique').join(' · ') || 'Afrique'}
                        </td>
                        <td className="py-3 px-2 align-top text-right font-mono text-zinc-700 tabular-nums">
                          {formatCurrencyFromMUsd(c.directLossMUsd, currency, false, lang)}
                        </td>
                        <td className="py-3 px-2 align-top text-right font-mono text-amber-800 tabular-nums">
                          {formatCurrencyFromMUsd(c.indirectLossMUsd, currency, false, lang)}
                        </td>
                        <td className="py-3 px-2 align-top text-right font-mono font-semibold text-zinc-900 tabular-nums">
                          {formatCurrencyFromMUsd(c.totalLossMUsd, currency, false, lang)}
                        </td>
                        <td className="py-3 px-2 align-top text-right font-mono font-semibold text-[#1E3A8A] tabular-nums">
                          {formatPct(c.gdpImpactPct, 2, lang)}
                        </td>
                        <td
                          className={`py-3 px-2 align-top text-right font-mono tabular-nums ${
                            c.netBalanceAdj2028MUsd >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {formatCurrencyFromMUsd(c.netBalanceAdj2028MUsd, currency, true, lang)}
                        </td>
                        <td className="py-3 pl-3 align-top text-[11px] leading-relaxed text-zinc-600">
                          <strong className="font-medium text-zinc-800">
                            {c.climateSignal2027}
                          </strong>{' '}
                          — {c.transmissionChannel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
