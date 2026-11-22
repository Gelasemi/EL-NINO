import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, FileSpreadsheet, FileText } from 'lucide-react';
import { useLanguage, type LanguageCode } from '../i18n/LanguageContext';
import { getLocalizedRicePrices } from '../i18n/localizedCoreData';
import { getLocalizedLstmSeries } from '../i18n/localizedMlEconomicData';
import {
  computeEconomicAggregation,
  formatCurrencyFromMUsd,
  SCENARIO_META_BY_LANG,
  type CurrencyCode,
  type ScenarioKey,
} from '../utils/economicAggregation';

const SECTION_TEXT: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    lead: string;
    scenarioLabel: string;
    currencyLabel: string;
    exportBtn: string;
    chart1Title: string;
    chart1Subtitle: string;
    oniLegend: string;
    shockLegend: string;
    chart2Title: string;
    chart2Subtitle: string;
    directLegend: string;
    indirectLegend: string;
    chart3Title: string;
    chart3Subtitle: string;
    riceLegend: string;
    chart4Title: string;
    chart4Subtitle: string;
    footerCredit: string;
  }
> = {
  fr: {
    eyebrow: '08B · Visualisations Analytiques Recharts · Données Climatiques & Pertes 2026–2027',
    title: 'Observatoire graphique 2026–2027 : anomalies ONI, prix du riz et pertes économiques',
    lead: 'Graphiques interactifs Recharts couplant le forçage thermique du Pacifique (ONI °C), l’indice de choc récoltes LSTM (décalage +4 à +6 mois), l’inflation du riz à Antananarivo et la répartition des pertes directes/indirectes par province et bloc africain.',
    scenarioLabel: 'Scénario actif :',
    currencyLabel: 'Devise :',
    exportBtn: 'Exporter Rapport (PDF · Word · Excel)',
    chart1Title: '1. Forçage ONI (°C) vs Choc Récoltes LSTM (/100) — 2026–2027',
    chart1Subtitle: 'Pic océanique fin 2026 (+3,8 °C) précédant le pic agricole avril–août 2027.',
    oniLegend: 'Anomalie ONI (°C)',
    shockLegend: 'Indice Choc Récoltes (/100)',
    chart2Title: '2. Pertes projetées 2027 par Ex-Province de Madagascar',
    chart2Subtitle: 'Décomposition entre pertes agricoles directes et chocs indirects (eau, RIA, voirie).',
    directLegend: 'Direct agricole',
    indirectLegend: 'Indirect (Eau / Énergie / Infra)',
    chart3Title: '3. Trajectoire du riz local à Antananarivo (FEWS NET 2026–2027)',
    chart3Subtitle: 'Hausse estimée de 2 550 MGA/kg jusqu’au pic saisonnier de 3 200 MGA/kg.',
    riceLegend: 'Prix riz local (MGA / kg)',
    chart4Title: '4. Projection comparative des blocs COI, SADC, COMESA & Top 6 Pays (2027)',
    chart4Subtitle: 'Volume total des pertes directes et indirectes ajusté selon le scénario choisi.',
    footerCredit:
      'Licence officielle M&G Consulting · Direction Générale : Prince MANANTENASOA (Chercheur en Sciences Économiques / ML–Data–AI Engineer)',
  },
  en: {
    eyebrow: '08B · Recharts Interactive Analytics · 2026–2027 Climate & Economic Loss Visuals',
    title: '2026–2027 Visual Observatory: ONI Anomalies, Rice Inflation & Projected Economic Losses',
    lead: 'Interactive Recharts dashboards pairing equatorial Pacific ONI thermal forcing (°C), 4–6 month lagged LSTM crop shocks (/100), Antananarivo rice price trajectories, and projected direct vs. indirect losses across Madagascar provinces and African regional blocs.',
    scenarioLabel: 'Active scenario:',
    currencyLabel: 'Currency:',
    exportBtn: 'Export Report (PDF · Word · Excel)',
    chart1Title: '1. ONI Forcing (°C) vs. Lagged LSTM Crop Shock (/100) — 2026–2027',
    chart1Subtitle: 'Late-2026 ocean peak (+3.8 °C) leading the Apr–Aug 2027 harvest shock.',
    oniLegend: 'ONI Anomaly (°C)',
    shockLegend: 'Harvest Shock Index (/100)',
    chart2Title: '2. Projected 2027 Losses by Ex-Province (Madagascar)',
    chart2Subtitle: 'Split between direct crop value losses and indirect shocks (water, RIA power, roads).',
    directLegend: 'Direct Agriculture',
    indirectLegend: 'Indirect (Water / Energy / Roads)',
    chart3Title: '3. Antananarivo Local Rice Trajectory (FEWS NET 2026–2027)',
    chart3Subtitle: 'Projected climb from 2,550 MGA/kg baseline to 3,200 MGA/kg seasonal peak.',
    riceLegend: 'Local Rice Price (MGA / kg)',
    chart4Title: '4. Comparative 2027 Losses: Top 6 Countries in IOC, SADC & COMESA',
    chart4Subtitle: 'Direct and indirect economic burden dynamically scaled by selected scenario.',
    footerCredit:
      'Official License Holder: M&G Consulting · Managing Director: Prince MANANTENASOA (Economist Researcher / ML–Data–AI Engineer)',
  },
  sw: {
    eyebrow: '08B · Chati za Recharts · Takwimu za Tabianchi na Hasara za Kiuchumi 2026–2027',
    title: 'Kituo cha Chati 2026–2027: Kielelezo cha ONI, Bei ya Mchele na Hasara za Kiuchumi',
    lead: 'Chati shirikishi za Recharts zinazoonyesha joto la bahari ONI (°C), athari ya mavuno ya LSTM (miezi +4–6), mwenendo wa bei ya mchele Antananarivo, na mgawanyo wa hasara za moja kwa moja na zisizo za moja kwa moja kwa majimbo ya Madagaska na kanda za Afrika.',
    scenarioLabel: 'Hali inayotumika:',
    currencyLabel: 'Sarafu:',
    exportBtn: 'Pakua Ripoti (PDF · Word · Excel)',
    chart1Title: '1. Kielelezo ONI (°C) dhidi ya Mshtuko wa Mavuno LSTM (/100) — 2026–2027',
    chart1Subtitle: 'Kilele cha bahari mwisho wa 2026 (+3.8 °C) kikifuatiwa na mshtuko Apr–Ago 2027.',
    oniLegend: 'Kielelezo ONI (°C)',
    shockLegend: 'Kielelezo cha Mshtuko (/100)',
    chart2Title: '2. Makadirio ya Hasara 2027 kwa Majimbo 6 ya Madagaska',
    chart2Subtitle: 'Mgawanyo wa hasara za kilimo na gharama za maji, nishati ya RIA na barabara.',
    directLegend: 'Kilimo Moja kwa Moja',
    indirectLegend: 'Zisizo za Moja kwa Moja',
    chart3Title: '3. Mwelekeo wa Bei ya Mchele Antananarivo (FEWS NET 2026–2027)',
    chart3Subtitle: 'Ongezeko kutoka MGA 2,550/kg hadi kilele cha MGA 3,200/kg.',
    riceLegend: 'Bei ya Mchele (MGA / kg)',
    chart4Title: '4. Ulinganisho wa Hasara 2027: Nchi 6 Kuu za COI, SADC na COMESA',
    chart4Subtitle: 'Jumla ya hasara za kiuchumi kulingana na hali iliyochaguliwa.',
    footerCredit:
      'Mmiliki wa Leseni: M&G Consulting · Mkurugenzi Mkuu: Prince MANANTENASOA (Mtafiti wa Uchumi / Mhandisi wa ML–Data–AI)',
  },
};

export function ClimateEconomicRecharts() {
  const { lang } = useLanguage();
  const copy = SECTION_TEXT[lang];
  const [scenario, setScenario] = useState<ScenarioKey>('s2');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const lstmData = useMemo(() => getLocalizedLstmSeries(lang), [lang]);
  const riceData = useMemo(() => getLocalizedRicePrices(lang), [lang]);
  const model = useMemo(
    () =>
      computeEconomicAggregation({
        horizonYear: 2027,
        scenario,
        scope: 'consolidated119',
        lang,
      }),
    [scenario, lang],
  );

  const provinceChartData = useMemo(
    () =>
      [...model.provinceRows]
        .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
        .map((p) => ({
          province: p.province,
          direct: Number(p.directAgriLossMUsd.toFixed(1)),
          indirect: Number(p.indirectLossMUsd.toFixed(1)),
          total: Number(p.totalLossMUsd.toFixed(1)),
        })),
    [model.provinceRows],
  );

  const continentalChartData = useMemo(
    () =>
      [...model.countryRows]
        .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
        .slice(0, 6)
        .map((c) => ({
          name: c.countryOrZone.replace(/\s*\(.*?\)/g, ''),
          direct: Number(c.directLossMUsd.toFixed(0)),
          indirect: Number(c.indirectLossMUsd.toFixed(0)),
          total: Number(c.totalLossMUsd.toFixed(0)),
        })),
    [model.countryRows],
  );

  const openReportStudio = () => {
    window.dispatchEvent(
      new CustomEvent('open-scientific-report', {
        detail: { horizonYear: 2027, scenario, scope: 'consolidated119', currency },
      }),
    );
  };

  return (
    <section
      id="visualisations-recharts"
      className="border-b border-zinc-200 bg-white py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header & Interactive Controls */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-wider text-zinc-500">{copy.eyebrow}</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-[74ch] text-base leading-relaxed text-zinc-600">
              {copy.lead}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-xs">
              <span className="font-semibold text-zinc-600">{copy.scenarioLabel}</span>
              <select
                aria-label={copy.scenarioLabel}
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioKey)}
                className="bg-transparent font-semibold text-zinc-900 focus:outline-none"
              >
                {(['s1', 's2', 's3'] as ScenarioKey[]).map((key) => (
                  <option key={key} value={key}>
                    {SCENARIO_META_BY_LANG[lang][key].shortLabel}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-[#F9F8F4] px-2.5 py-1.5 text-xs">
              <span className="font-semibold text-zinc-600">{copy.currencyLabel}</span>
              <select
                aria-label={copy.currencyLabel}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent font-mono font-semibold text-zinc-900 focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="MGA">MGA</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <button
              type="button"
              onClick={openReportStudio}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172554] whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.exportBtn}</span>
            </button>
          </div>
        </div>

        {/* 2x2 Recharts Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Chart 1: ONI Anomaly & Lagged LSTM Crop Shock */}
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2 pb-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart1Title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{copy.chart1Subtitle}</p>
              </div>
              <BarChart3 className="h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
            </div>
            <div className="h-[290px] w-full rounded-md border border-zinc-200 bg-white p-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={lstmData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#52525B' }} />
                  <YAxis
                    yAxisId="left"
                    domain={[0, 4.5]}
                    tick={{ fontSize: 11, fill: '#B45309' }}
                    unit="°C"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#1E3A8A' }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '6px',
                      borderColor: '#D4D4D8',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="harvestShockIndex"
                    name={copy.shockLegend}
                    fill="#1E3A8A"
                    fillOpacity={0.14}
                    stroke="#1E3A8A"
                    strokeWidth={2.2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="oniAnomaly"
                    name={copy.oniLegend}
                    stroke="#B45309"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#B45309' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Madagascar 6 Ex-Provinces Direct vs Indirect Economic Loss */}
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2 pb-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart2Title}</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {copy.chart2Subtitle} · Total :{' '}
                  <strong className="font-mono text-[#1E3A8A]">
                    {formatCurrencyFromMUsd(model.madagascar.totalLossMUsd, currency, false, lang)}
                  </strong>
                </p>
              </div>
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
            </div>
            <div className="h-[290px] w-full rounded-md border border-zinc-200 bg-white p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provinceChartData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 18, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#52525B' }} unit=" M$" />
                  <YAxis
                    dataKey="province"
                    type="category"
                    width={92}
                    tick={{ fontSize: 11, fill: '#18181B', fontWeight: 600 }}
                  />
                  <Tooltip
                    formatter={(val) => [`${val} M$`, '']}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '6px',
                      borderColor: '#D4D4D8',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar
                    dataKey="direct"
                    name={copy.directLegend}
                    stackId="a"
                    fill="#B45309"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="indirect"
                    name={copy.indirectLegend}
                    stackId="a"
                    fill="#1E3A8A"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Antananarivo Local Rice Trajectory */}
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 sm:p-6">
            <div className="pb-4">
              <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart3Title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{copy.chart3Subtitle}</p>
            </div>
            <div className="h-[280px] w-full rounded-md border border-zinc-200 bg-white p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riceData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#52525B' }} />
                  <YAxis domain={[2400, 3350]} tick={{ fontSize: 11, fill: '#52525B' }} />
                  <Tooltip
                    formatter={(val) => [`${val} MGA/kg`, copy.riceLegend]}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '6px',
                      borderColor: '#D4D4D8',
                    }}
                  />
                  <ReferenceLine
                    y={3200}
                    stroke="#BE123C"
                    strokeDasharray="4 4"
                    label={{ value: '3 200 MGA/kg', position: 'insideTopRight', fontSize: 10, fill: '#BE123C' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="priceMGA"
                    name={copy.riceLegend}
                    stroke="#B45309"
                    strokeWidth={2.5}
                    fill="#D97706"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Top 6 Continental Countries (COI / SADC / COMESA) */}
          <div className="rounded-lg border border-zinc-200 bg-[#F9F8F4] p-5 sm:p-6">
            <div className="pb-4">
              <h3 className="font-serif text-lg font-semibold text-zinc-900">{copy.chart4Title}</h3>
              <p className="mt-1 text-xs text-zinc-500">
                {copy.chart4Subtitle} · COI :{' '}
                <strong className="font-mono text-zinc-900">
                  {formatCurrencyFromMUsd(model.blocs.coiTotalMUsd, currency, false, lang)}
                </strong>{' '}
                · SADC :{' '}
                <strong className="font-mono text-zinc-900">
                  {formatCurrencyFromMUsd(model.blocs.sadcTotalMUsd, currency, false, lang)}
                </strong>
              </p>
            </div>
            <div className="h-[280px] w-full rounded-md border border-zinc-200 bg-white p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={continentalChartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: '#52525B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#52525B' }} unit=" M$" />
                  <Tooltip
                    formatter={(val) => [`${val} M$`, '']}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '6px',
                      borderColor: '#D4D4D8',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="direct" name={copy.directLegend} stackId="c" fill="#0F766E" />
                  <Bar
                    dataKey="indirect"
                    name={copy.indirectLegend}
                    stackId="c"
                    fill="#334155"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <p className="mt-6 text-right font-mono text-[11px] text-zinc-500">{copy.footerCredit}</p>
      </div>
    </section>
  );
}
