import {
  CONTINENTAL_COUNTRY_PROJECTIONS,
  DISTRICT_CHOROPLETH_DATA,
  HERO_METRICS,
  PROVINCE_6_BASELINES,
  REGION_23_ECONOMIC_BASELINES,
  RICE_PRICE_TRAJECTORY,
} from './ensoData.ts';
import type { LanguageCode } from '../i18n/LanguageContext.tsx';
import {
  getLocalizedDistrictChoroplethData,
  getLocalizedDistrictProfileLabel,
  getLocalizedProvinceBaselines,
  getLocalizedContinentalProjections,
  getLocalizedFilieres,
} from '../i18n/localizedMlEconomicData.ts';
import { getLocalizedAtlas23Regions } from '../i18n/localizedAtlasPlanData.ts';

export type HorizonYear = 2027 | 2028;
export type ScenarioKey = 's1' | 's2' | 's3';

export const SCENARIO_CONFIG: Record<
  ScenarioKey,
  { label: string; multiplier: number }
> = {
  s1: { label: 'S1 · Déficit limité (×0,55)', multiplier: 0.55 },
  s2: { label: 'S2 · Base ML Super El Niño (×1,00)', multiplier: 1.0 },
  s3: { label: 'S3 · Choc sévère cumulé (×1,45)', multiplier: 1.45 },
};

const SCENARIO_LABELS_BY_LANG: Record<LanguageCode, Record<ScenarioKey, string>> = {
  fr: {
    s1: 'S1 · Déficit limité (×0,55)',
    s2: 'S2 · Base ML Super El Niño (×1,00)',
    s3: 'S3 · Choc sévère cumulé (×1,45)',
  },
  en: {
    s1: 'S1 · Limited Deficit (×0.55)',
    s2: 'S2 · ML Super El Niño Baseline (×1.00)',
    s3: 'S3 · Cumulative Severe Shock (×1.45)',
  },
  sw: {
    s1: 'S1 · Upungufu Mdogo (×0.55)',
    s2: 'S2 · Msingi wa ML El Niño Kuu (×1.00)',
    s3: 'S3 · Mshtuko Mkali Zaidi (×1.45)',
  },
};

export function getLocalizedScenarioLabel(scenario: ScenarioKey, lang: LanguageCode = 'fr'): string {
  return SCENARIO_LABELS_BY_LANG[lang][scenario];
}

const MGA_PER_USD = 4550;
const EUR_PER_USD = 0.925;

const REGION_ALIAS_MAP: Record<string, string> = {
  sava: 'SAVA',
  ambatosoa: 'Analanjirofo',
};

function normalizeText(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface ZoneMetricRow {
  label: string;
  value: string;
  tone?: 'danger' | 'warn' | 'good' | 'neutral';
}

export interface ZoneCalculationResult {
  kind: 'situation' | 'district' | 'region' | 'province' | 'country' | 'comparison';
  zoneName: string;
  subtitle: string;
  year: HorizonYear;
  scenario: ScenarioKey;
  riskBadge: string;
  riskTone: 'danger' | 'warn' | 'good' | 'neutral';
  coordinates?: { lat: number; lon: number };
  metrics: ZoneMetricRow[];
  summaryText: string;
  recommendations: string[];
}

export interface ObservatoryZoneOption {
  id: string;
  label: string;
  group: string;
  queryValue: string;
}

const GROUP_LABELS: Record<
  LanguageCode,
  { district: string; region: string; province: string; africa: string; regionPrefix: string; provPrefix: string }
> = {
  fr: {
    district: 'District (Madagascar)',
    region: 'Région (Madagascar)',
    province: 'Ex-Province',
    africa: 'COI · SADC · COMESA · Afrique',
    regionPrefix: 'Région',
    provPrefix: 'Ex-Province de',
  },
  en: {
    district: 'District (Madagascar)',
    region: 'Region (Madagascar)',
    province: 'Ex-Province',
    africa: 'IOC · SADC · COMESA · Africa',
    regionPrefix: 'Region',
    provPrefix: 'Ex-Province of',
  },
  sw: {
    district: 'Wilaya (Madagaska)',
    region: 'Mkoa (Madagaska)',
    province: 'Jimbo la Zamani',
    africa: 'COI · SADC · COMESA · Afrika',
    regionPrefix: 'Mkoa wa',
    provPrefix: 'Jimbo la',
  },
};

export function getLocalizedObservatoryZones(lang: LanguageCode = 'fr'): ObservatoryZoneOption[] {
  const g = GROUP_LABELS[lang];
  const countries = getLocalizedContinentalProjections(lang);
  return [
    ...DISTRICT_CHOROPLETH_DATA.map((d) => ({
      id: `dist-${d.district}`,
      label: `${d.district} (${d.region})`,
      group: g.district,
      queryValue: d.district,
    })),
    ...REGION_23_ECONOMIC_BASELINES.map((r) => ({
      id: `reg-${r.region}`,
      label: `${g.regionPrefix} ${r.region} (${r.province})`,
      group: g.region,
      queryValue: r.region,
    })),
    ...PROVINCE_6_BASELINES.map((p) => ({
      id: `prov-${p.province}`,
      label: `${g.provPrefix} ${p.province}`,
      group: g.province,
      queryValue: p.province,
    })),
    ...countries.map((c) => ({
      id: `ctry-${c.id}`,
      label: `${c.countryOrZone} (${c.blocs.join('/')})`,
      group: g.africa,
      queryValue: c.countryOrZone,
    })),
  ];
}

export const OBSERVATORY_ZONE_OPTIONS: ObservatoryZoneOption[] = getLocalizedObservatoryZones('fr');

function fmtUsd(mUsd: number, lang: LanguageCode = 'fr'): string {
  const abs = Math.abs(mUsd);
  const sign = mUsd < -0.05 ? '−' : '';
  const bnUnit = lang === 'fr' ? 'Md $' : lang === 'en' ? 'B $' : 'Bil $';
  const mUnit = lang === 'fr' ? 'M $' : lang === 'en' ? 'M $' : 'Mil $';
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(2)} ${bnUnit}`;
  return `${sign}${abs.toFixed(1)} ${mUnit}`;
}

function fmtMga(mUsd: number, lang: LanguageCode = 'fr'): string {
  const mdAr = Math.abs(mUsd) * (MGA_PER_USD / 1000);
  const sign = mUsd < -0.05 ? '−' : '';
  const unit = lang === 'fr' ? 'Md Ar' : lang === 'en' ? 'B Ar' : 'Bil Ar';
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  if (mdAr >= 1000) return `${sign}${Math.round(mdAr).toLocaleString(locale)} ${unit}`;
  return `${sign}${mdAr.toFixed(1)} ${unit}`;
}

function fmtEur(mUsd: number, lang: LanguageCode = 'fr'): string {
  const mEur = Math.abs(mUsd) * EUR_PER_USD;
  const sign = mUsd < -0.05 ? '−' : '';
  const bnUnit = lang === 'fr' ? 'Md €' : lang === 'en' ? 'B €' : 'Bil €';
  const mUnit = lang === 'fr' ? 'M €' : lang === 'en' ? 'M €' : 'Mil €';
  if (mEur >= 1000) return `${sign}${(mEur / 1000).toFixed(2)} ${bnUnit}`;
  return `${sign}${mEur.toFixed(1)} ${mUnit}`;
}

function fmtPctSigned(val: number): string {
  const sign = val > 0 ? '+' : val < 0 ? '−' : '';
  return `${sign}${Math.abs(val).toFixed(1)}%`;
}

function resolveRegionMeta(rawRegion: string) {
  const mapped = REGION_ALIAS_MAP[rawRegion.toLowerCase()] ?? rawRegion;
  return (
    REGION_23_ECONOMIC_BASELINES.find(
      (r) => normalizeText(r.region) === normalizeText(mapped),
    ) ?? REGION_23_ECONOMIC_BASELINES[0]
  );
}

function computeDistrictLossMUsd(
  districtName: string,
  year: HorizonYear,
  scenario: ScenarioKey,
) {
  const mult = SCENARIO_CONFIG[scenario].multiplier;
  const point =
    DISTRICT_CHOROPLETH_DATA.find(
      (d) => normalizeText(d.district) === normalizeText(districtName),
    ) ?? DISTRICT_CHOROPLETH_DATA[0];

  const regMeta = resolveRegionMeta(point.region);
  const provMeta =
    PROVINCE_6_BASELINES.find((p) => p.province === regMeta.province) ?? PROVINCE_6_BASELINES[0];

  const agriUnit = regMeta.agriBaseMUsd / Math.max(1, regMeta.districtsTotal);

  const rawRice = year === 2027 ? point.rice2027 : point.rice2028;
  const rawMaize = year === 2027 ? point.maize2027 : point.maize2028;
  const rawExport = year === 2027 ? point.exportCrop2027 : point.exportCrop2028;
  const rawWater = year === 2027 ? point.water2027 : point.water2028;

  const lossRate = (deltaPct: number) => {
    if (year === 2027) {
      return Math.max(0, -deltaPct / 100) * mult;
    }
    return deltaPct < 0
      ? Math.max(0, -deltaPct / 100) * mult
      : -(deltaPct / 100) * 0.25 * (1 / Math.max(0.75, mult));
  };

  const riceLoss = agriUnit * regMeta.riceShare * lossRate(rawRice);
  const maizeLoss = agriUnit * regMeta.maizeFoodShare * lossRate(rawMaize);
  const exportLoss = agriUnit * regMeta.exportShare * lossRate(rawExport);
  const directAgriLoss = riceLoss + maizeLoss + exportLoss;
  const indirectLoss =
    directAgriLoss > 0 ? directAgriLoss * provMeta.indirectElasticity : directAgriLoss * 0.25;
  const totalLoss = directAgriLoss + indirectLoss;

  return {
    point,
    regMeta,
    provMeta,
    rawRice,
    rawMaize,
    rawExport,
    rawWater,
    directAgriLoss,
    indirectLoss,
    totalLoss,
    localGdpMUsd: regMeta.gdpMUsd / Math.max(1, regMeta.districtsTotal),
  };
}

export function getCurrentSituationSnapshot(
  scenario: ScenarioKey = 's2',
  lang: LanguageCode = 'fr',
): ZoneCalculationResult {
  const m = SCENARIO_CONFIG[scenario].multiplier;
  const madagascarBase2027 = 373 * m;
  const coiTotal = 610 * m;
  const peakRice = RICE_PRICE_TRAJECTORY[RICE_PRICE_TRAJECTORY.length - 1];
  const filieres = getLocalizedFilieres(lang);
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';

  if (lang === 'en') {
    return {
      kind: 'situation',
      zoneName: 'Current Situation · November 2026 (Super El Niño & IOD+)',
      subtitle: 'Climate & Economic Observatory · Madagascar, IOC, SADC & COMESA',
      year: 2027,
      scenario,
      riskBadge: 'CRITICAL ALERT · JAN 2027 PEAK (+4.1 °C)',
      riskTone: 'danger',
      metrics: [
        { label: 'Pacific Anomaly (Nov 2026)', value: '+3.5 °C', tone: 'warn' },
        { label: 'Projected Record Peak (Jan 2027)', value: '+4.1 °C', tone: 'danger' },
        { label: 'Madagascar Food Insecurity', value: '3.72M people', tone: 'danger' },
        {
          label: 'Antananarivo Rice Peak',
          value: `${peakRice ? peakRice.priceMGA.toLocaleString(locale) : '3,200'} MGA/kg`,
          tone: 'warn',
        },
        {
          label: `Madagascar 2027 Shock (${scenario.toUpperCase()})`,
          value: `${fmtUsd(madagascarBase2027, lang)} (${fmtMga(madagascarBase2027, lang)})`,
          tone: 'danger',
        },
        {
          label: `Indian Ocean IOC Total (${scenario.toUpperCase()})`,
          value: fmtUsd(coiTotal, lang),
          tone: 'warn',
        },
      ],
      summaryText:
        `In November 2026, equatorial Pacific SST reads +3.5 °C (projected Jan 2027 peak +4.1 °C) coupled with a positive Indian Ocean Dipole (IOD+). ` +
        `Across Madagascar, 3.72 million people face acute food insecurity (Oct 2026–Feb 2027), with -35% to -52% water deficits in Grand Sud and excess rainfall in the North-East. ` +
        `Consolidated 2027 economic losses reach ${fmtUsd(madagascarBase2027, lang)} (~${fmtMga(madagascarBase2027, lang)}) under scenario ${scenario.toUpperCase()}.`,
      recommendations: [
        filieres[0]?.prediction2027 ?? 'Rice: -8% to -14% in 2027; +10% to +15% rebound in 2028.',
        'FOFIFA/DGM: Delay Grand Sud planting to mid-Dec–Jan (after 20–30 mm over 3 days) using 90-day sorghum/millet and Zaï basins.',
        'Food Security & Energy: Pre-position Cash+ transfers (WFP/BNGRC) in Androy/Anosy and safeguard RIA hydropower deficits.',
      ],
    };
  }

  if (lang === 'sw') {
    return {
      kind: 'situation',
      zoneName: 'Hali ya Sasa · Novemba 2026 (El Niño Kuu & IOD+)',
      subtitle: 'Kituo cha Tabianchi na Uchumi · Madagaska, COI, SADC & COMESA',
      year: 2027,
      scenario,
      riskBadge: 'TAHADHARI KUU · KILELE JAN 2027 (+4.1 °C)',
      riskTone: 'danger',
      metrics: [
        { label: 'Joto la Pasifiki (Nov 2026)', value: '+3.5 °C', tone: 'warn' },
        { label: 'Kilele Kinachotarajiwa (Jan 2027)', value: '+4.1 °C', tone: 'danger' },
        { label: 'Uhaba wa Chakula Madagaska', value: 'Watu 3.72M', tone: 'danger' },
        {
          label: 'Kilele Bei ya Mchele Antananarivo',
          value: `${peakRice ? peakRice.priceMGA.toLocaleString(locale) : '3,200'} MGA/kg`,
          tone: 'warn',
        },
        {
          label: `Hasara Madagaska 2027 (${scenario.toUpperCase()})`,
          value: `${fmtUsd(madagascarBase2027, lang)} (${fmtMga(madagascarBase2027, lang)})`,
          tone: 'danger',
        },
        {
          label: `Jumla Bahari ya Hindi COI (${scenario.toUpperCase()})`,
          value: fmtUsd(coiTotal, lang),
          tone: 'warn',
        },
      ],
      summaryText:
        `Mnamo Novemba 2026, Bahari ya Pasifiki iko +3.5 °C (kilele Jan 2027 +4.1 °C) pamoja na hali chanya ya Bahari ya Hindi (IOD+). ` +
        `Nchini Madagaska, watu milioni 3.72 wako katika hatari ya uhaba wa chakula (Okt 2026–Feb 2027), huku Kusini Kuu ikiwa na ukame (-35% hadi -52%) na Kaskazini-Mashariki ikipata mvua nyingi. ` +
        `Hasara za kiuchumi za 2027 zinafikia ${fmtUsd(madagascarBase2027, lang)} (~${fmtMga(madagascarBase2027, lang)}) chini ya hali ${scenario.toUpperCase()}.`,
      recommendations: [
        filieres[0]?.prediction2027 ?? 'Mpunga: -8% hadi -14% mwaka 2027; ahueni +10% hadi +15% mwaka 2028.',
        'FOFIFA/DGM: Sogeza upanzi Kusini hadi Desemba–Januari (baada ya mvua mm 20–30) kwa mtama/uwele wa siku 90 na mashimo ya Zaï.',
        'Usalama wa Chakula & Nishati: Weka akiba ya Cash+ (WFP/BNGRC) katika Androy/Anosy na linda umeme wa gridi ya RIA.',
      ],
    };
  }

  return {
    kind: 'situation',
    zoneName: 'Situation Actuelle · Novembre 2026 (Super El Niño & IOD+)',
    subtitle: 'Observatoire Climatique & Économique · Madagascar, COI, SADC & COMESA',
    year: 2027,
    scenario,
    riskBadge: 'ALERTE CRITIQUE · PIC JANV. 2027 (+4,1 °C)',
    riskTone: 'danger',
    metrics: [
      {
        label: 'Anomalie Pacifique (Nov. 2026)',
        value: `${HERO_METRICS[0]?.value ?? '+3,5'} °C`,
        tone: 'warn',
      },
      {
        label: 'Pic record projeté (Janv. 2027)',
        value: `${HERO_METRICS[1]?.value ?? '+4,1'} °C`,
        tone: 'danger',
      },
      {
        label: 'Insécurité alimentaire Madagascar',
        value: '3,72 M pers.',
        tone: 'danger',
      },
      {
        label: 'Pic prix du riz Antananarivo',
        value: `${peakRice ? peakRice.priceMGA.toLocaleString('fr-FR') : '3 200'} MGA/kg`,
        tone: 'warn',
      },
      {
        label: `Choc éco. Madagascar 2027 (${scenario.toUpperCase()})`,
        value: `${fmtUsd(madagascarBase2027, lang)} (${fmtMga(madagascarBase2027, lang)})`,
        tone: 'danger',
      },
      {
        label: `Total Océan Indien COI (${scenario.toUpperCase()})`,
        value: fmtUsd(coiTotal, lang),
        tone: 'warn',
      },
    ],
    summaryText:
      'En novembre 2026, le Pacifique équatorial affiche +3,5 °C (pic attendu à +4,1 °C en janvier 2027) couplé à un dipôle positif de l’océan Indien (IOD+). ' +
      'À Madagascar, 3,72 millions de personnes sont exposées à l’insécurité alimentaire d’octobre 2026 à février 2027, avec un déficit hydrique sévère dans le Grand Sud (-35 % à -52 %) et des pluies excessives / risque cyclonique sur le Nord-Est. ' +
      `Les pertes économiques consolidées 2027 atteignent ${fmtUsd(madagascarBase2027, lang)} pour Madagascar (~${fmtMga(madagascarBase2027, lang)}) selon le scénario ${scenario.toUpperCase()}.`,
    recommendations: [
      filieres[0]?.prediction2027 ?? 'Riz : -8 % à -14 % en 2027 ; rebond +10 % à +15 % en 2028.',
      'FOFIFA/DGM : Décaler les semis pluviaux du Grand Sud à mi-décembre–janvier (seuil 20–30 mm sur 3 jours) et déployer sorgho/mil 90 j + Zaï.',
      'Sécurité alimentaire & énergie : Prépositionner les transferts Cash+ (PAM/BNGRC) en Androy/Anosy et sécuriser le délestage hydroélectrique RIA.',
    ],
  };
}

export function computeZoneAnalysis({
  zoneQuery,
  year = 2027,
  scenario = 's2',
  lang = 'fr',
}: {
  zoneQuery?: string;
  year?: HorizonYear;
  scenario?: ScenarioKey;
  lang?: LanguageCode;
}): ZoneCalculationResult {
  const qNorm = normalizeText(zoneQuery ?? '');
  if (
    !qNorm ||
    qNorm === 'situation actuelle' ||
    qNorm === 'current situation' ||
    qNorm === 'hali ya sasa' ||
    qNorm === 'actuel' ||
    qNorm === 'global' ||
    qNorm === 'resume'
  ) {
    return getCurrentSituationSnapshot(scenario, lang);
  }

  const locDistricts = getLocalizedDistrictChoroplethData(lang);
  const locProvinces = getLocalizedProvinceBaselines(lang);
  const locAtlas = getLocalizedAtlas23Regions(lang);
  const locCountries = getLocalizedContinentalProjections(lang);
  const scenLabel = getLocalizedScenarioLabel(scenario, lang);

  // 1. Check modeled districts
  const matchedDistrict =
    locDistricts.find((d) => normalizeText(d.district) === qNorm) ??
    locDistricts.find(
      (d) => qNorm.includes(normalizeText(d.district)) || normalizeText(d.district).includes(qNorm),
    );

  if (matchedDistrict) {
    const calc = computeDistrictLossMUsd(matchedDistrict.district, year, scenario);
    const gdpPct = (calc.totalLoss / Math.max(1, calc.localGdpMUsd)) * 100;
    const riskTone =
      matchedDistrict.riskTier === 'drought'
        ? 'danger'
        : matchedDistrict.riskTier === 'flood'
          ? 'warn'
          : 'neutral';
    const profileLabel = getLocalizedDistrictProfileLabel(matchedDistrict.profile, lang);

    if (lang === 'en') {
      return {
        kind: 'district',
        zoneName: `${matchedDistrict.district} (${matchedDistrict.region})`,
        subtitle: `Ex-Province of ${calc.provMeta.province} · Profile: ${profileLabel}`,
        year,
        scenario,
        coordinates: { lat: matchedDistrict.lat, lon: matchedDistrict.lon },
        riskBadge:
          matchedDistrict.riskTier === 'drought'
            ? 'CRITICAL DROUGHT'
            : matchedDistrict.riskTier === 'flood'
              ? 'FLOODS & EXCESS RAIN'
              : 'MIXED WATER STRESS',
        riskTone,
        metrics: [
          { label: `Water balance (${year})`, value: fmtPctSigned(calc.rawWater), tone: calc.rawWater < -20 ? 'danger' : calc.rawWater > 15 ? 'warn' : 'neutral' },
          { label: `Rice yield (${year})`, value: fmtPctSigned(calc.rawRice), tone: calc.rawRice < -10 ? 'danger' : calc.rawRice > 0 ? 'good' : 'warn' },
          { label: `Maize / Staples (${year})`, value: fmtPctSigned(calc.rawMaize), tone: calc.rawMaize < -15 ? 'danger' : calc.rawMaize > 0 ? 'good' : 'warn' },
          { label: `Cash / Export (${year})`, value: fmtPctSigned(calc.rawExport), tone: calc.rawExport < -10 ? 'warn' : calc.rawExport > 0 ? 'good' : 'neutral' },
          { label: `Total economic loss (${scenario.toUpperCase()})`, value: `${fmtUsd(calc.totalLoss, lang)} · ${fmtMga(calc.totalLoss, lang)}`, tone: calc.totalLoss > 5 ? 'danger' : 'neutral' },
          { label: 'Local GDP Share', value: `${gdpPct.toFixed(2)}% (${fmtEur(calc.totalLoss, lang)})`, tone: gdpPct > 8 ? 'danger' : 'warn' },
        ],
        summaryText:
          `For ${matchedDistrict.district} district (${matchedDistrict.region}) in ${year} under ${scenLabel}: ` +
          `water anomaly ${fmtPctSigned(calc.rawWater)}, rice ${fmtPctSigned(calc.rawRice)}, maize ${fmtPctSigned(calc.rawMaize)}, export crops ${fmtPctSigned(calc.rawExport)}. ` +
          `Estimated economic loss reaches ${fmtUsd(calc.totalLoss, lang)} (~${fmtMga(calc.totalLoss, lang)}: ${fmtUsd(calc.directAgriLoss, lang)} direct agri + ${fmtUsd(calc.indirectLoss, lang)} indirect), representing ${gdpPct.toFixed(2)}% of local GDP.`,
        recommendations: matchedDistrict.ragNotes,
      };
    }

    if (lang === 'sw') {
      return {
        kind: 'district',
        zoneName: `${matchedDistrict.district} (${matchedDistrict.region})`,
        subtitle: `Jimbo la ${calc.provMeta.province} · Wasifu: ${profileLabel}`,
        year,
        scenario,
        coordinates: { lat: matchedDistrict.lat, lon: matchedDistrict.lon },
        riskBadge:
          matchedDistrict.riskTier === 'drought'
            ? 'UKAME MKALI'
            : matchedDistrict.riskTier === 'flood'
              ? 'MAFURIKO & MVUA NYINGI'
              : 'MSONGO MCHANGANYIKO',
        riskTone,
        metrics: [
          { label: `Uwiano wa maji (${year})`, value: fmtPctSigned(calc.rawWater), tone: calc.rawWater < -20 ? 'danger' : calc.rawWater > 15 ? 'warn' : 'neutral' },
          { label: `Mavuno ya Mpunga (${year})`, value: fmtPctSigned(calc.rawRice), tone: calc.rawRice < -10 ? 'danger' : calc.rawRice > 0 ? 'good' : 'warn' },
          { label: `Mahindi & Chakula (${year})`, value: fmtPctSigned(calc.rawMaize), tone: calc.rawMaize < -15 ? 'danger' : calc.rawMaize > 0 ? 'good' : 'warn' },
          { label: `Mazao ya Biashara (${year})`, value: fmtPctSigned(calc.rawExport), tone: calc.rawExport < -10 ? 'warn' : calc.rawExport > 0 ? 'good' : 'neutral' },
          { label: `Hasara Jumla (${scenario.toUpperCase()})`, value: `${fmtUsd(calc.totalLoss, lang)} · ${fmtMga(calc.totalLoss, lang)}`, tone: calc.totalLoss > 5 ? 'danger' : 'neutral' },
          { label: 'Sehemu ya Pato la Wilaya', value: `${gdpPct.toFixed(2)}% (${fmtEur(calc.totalLoss, lang)})`, tone: gdpPct > 8 ? 'danger' : 'warn' },
        ],
        summaryText:
          `Kwa wilaya ya ${matchedDistrict.district} (${matchedDistrict.region}) mwaka ${year} chini ya ${scenLabel}: ` +
          `maji ${fmtPctSigned(calc.rawWater)}, mpunga ${fmtPctSigned(calc.rawRice)}, mahindi ${fmtPctSigned(calc.rawMaize)}, mazao ya biashara ${fmtPctSigned(calc.rawExport)}. ` +
          `Makadirio ya hasara ni ${fmtUsd(calc.totalLoss, lang)} (~${fmtMga(calc.totalLoss, lang)}: ${fmtUsd(calc.directAgriLoss, lang)} kilimo moja kwa moja + ${fmtUsd(calc.indirectLoss, lang)} zisizo za moja kwa moja), sawa na ${gdpPct.toFixed(2)}% ya Pato la wilaya.`,
        recommendations: matchedDistrict.ragNotes,
      };
    }

    return {
      kind: 'district',
      zoneName: `${matchedDistrict.district} (${matchedDistrict.region})`,
      subtitle: `Ex-Province de ${calc.provMeta.province} · Profil : ${matchedDistrict.profile}`,
      year,
      scenario,
      coordinates: { lat: matchedDistrict.lat, lon: matchedDistrict.lon },
      riskBadge:
        matchedDistrict.riskTier === 'drought'
          ? 'SÉCHERESSE CRITIQUE'
          : matchedDistrict.riskTier === 'flood'
            ? 'CRUES & EXCÈS PLUVIEUX'
            : 'STRESS HYDRIQUE MIXTE',
      riskTone,
      metrics: [
        { label: `Bilan hydrique (${year})`, value: fmtPctSigned(calc.rawWater), tone: calc.rawWater < -20 ? 'danger' : calc.rawWater > 15 ? 'warn' : 'neutral' },
        { label: `Rendement Riz (${year})`, value: fmtPctSigned(calc.rawRice), tone: calc.rawRice < -10 ? 'danger' : calc.rawRice > 0 ? 'good' : 'warn' },
        { label: `Rendement Maïs / Vivrier (${year})`, value: fmtPctSigned(calc.rawMaize), tone: calc.rawMaize < -15 ? 'danger' : calc.rawMaize > 0 ? 'good' : 'warn' },
        { label: `Rente / Export (${year})`, value: fmtPctSigned(calc.rawExport), tone: calc.rawExport < -10 ? 'warn' : calc.rawExport > 0 ? 'good' : 'neutral' },
        { label: `Perte économique totale (${scenario.toUpperCase()})`, value: `${fmtUsd(calc.totalLoss, lang)} · ${fmtMga(calc.totalLoss, lang)}`, tone: calc.totalLoss > 5 ? 'danger' : 'neutral' },
        { label: 'Impact PIB local estimé', value: `${gdpPct.toFixed(2)} % (${fmtEur(calc.totalLoss, lang)})`, tone: gdpPct > 8 ? 'danger' : 'warn' },
      ],
      summaryText:
        `Pour le district de ${matchedDistrict.district} (${matchedDistrict.region}) en ${year} sous ${scenLabel} : ` +
        `anomalie hydrique de ${fmtPctSigned(calc.rawWater)}, riz ${fmtPctSigned(calc.rawRice)}, maïs ${fmtPctSigned(calc.rawMaize)}, cultures d’export ${fmtPctSigned(calc.rawExport)}. ` +
        `Perte économique estimée à ${fmtUsd(calc.totalLoss, lang)} (soit ~${fmtMga(calc.totalLoss, lang)}, dont ${fmtUsd(calc.directAgriLoss, lang)} agricoles directes et ${fmtUsd(calc.indirectLoss, lang)} indirectes), représentant ${gdpPct.toFixed(2)} % du PIB local.`,
      recommendations: matchedDistrict.ragNotes,
    };
  }

  // 2. Check 23 official Regions
  const matchedRegion =
    REGION_23_ECONOMIC_BASELINES.find((r) => normalizeText(r.region) === qNorm) ??
    REGION_23_ECONOMIC_BASELINES.find(
      (r) => qNorm.includes(normalizeText(r.region)) || normalizeText(r.region).includes(qNorm),
    );

  if (matchedRegion) {
    const atlas = locAtlas.find(
      (a) => normalizeText(a.region) === normalizeText(matchedRegion.region),
    );
    const regionDistricts = DISTRICT_CHOROPLETH_DATA.filter(
      (d) => normalizeText(resolveRegionMeta(d.region).region) === normalizeText(matchedRegion.region),
    );
    const calcs = regionDistricts.map((d) => computeDistrictLossMUsd(d.district, year, scenario));
    const scaleFactor =
      calcs.length > 0 ? matchedRegion.districtsTotal / calcs.length : 1;

    const sumTotal =
      calcs.length > 0
        ? calcs.reduce((acc, c) => acc + c.totalLoss, 0) * scaleFactor
        : matchedRegion.agriBaseMUsd * (year === 2027 ? 0.14 : -0.04) * SCENARIO_CONFIG[scenario].multiplier;
    const sumDirect =
      calcs.length > 0
        ? calcs.reduce((acc, c) => acc + c.directAgriLoss, 0) * scaleFactor
        : sumTotal * 0.72;
    const gdpPct = (sumTotal / Math.max(1, matchedRegion.gdpMUsd)) * 100;

    if (lang === 'en') {
      return {
        kind: 'region',
        zoneName: `${matchedRegion.region} Region`,
        subtitle: `Ex-Province of ${matchedRegion.province} · ${matchedRegion.districtsTotal} districts · ${atlas?.groupLabel ?? ''}`,
        year,
        scenario,
        riskBadge: atlas?.dominantRisk.toUpperCase() ?? 'REGIONAL WATCH',
        riskTone: atlas?.riskCategory === 'drought' ? 'danger' : atlas?.riskCategory === 'flood' ? 'warn' : 'neutral',
        metrics: [
          { label: 'Baseline Regional GDP', value: `${matchedRegion.gdpMUsd.toFixed(0)} M $`, tone: 'neutral' },
          { label: 'Annual Agri Baseline', value: `${matchedRegion.agriBaseMUsd.toFixed(0)} M $`, tone: 'neutral' },
          { label: `Direct Agri Losses (${year})`, value: fmtUsd(sumDirect, lang), tone: 'warn' },
          { label: `Consolidated Losses (${year})`, value: `${fmtUsd(sumTotal, lang)} · ${fmtMga(sumTotal, lang)}`, tone: sumTotal > 15 ? 'danger' : 'neutral' },
          { label: 'Regional GDP Share', value: `${gdpPct.toFixed(2)}% (${fmtEur(sumTotal, lang)})`, tone: gdpPct > 5 ? 'danger' : 'warn' },
          { label: 'Priority Districts', value: atlas?.priorityDistricts.slice(0, 3).join(', ') || `${regionDistricts.length} tracked`, tone: 'neutral' },
        ],
        summaryText:
          `${matchedRegion.region} Region (${matchedRegion.districtsTotal} districts, GDP $${matchedRegion.gdpMUsd}M) records consolidated ${year} (${scenario.toUpperCase()}) losses of ${fmtUsd(sumTotal, lang)} (~${fmtMga(sumTotal, lang)}), equal to ${gdpPct.toFixed(2)}% of regional GDP. Dominant risk: ${atlas?.dominantRisk ?? 'ENSO hazards'}.`,
        recommendations: [
          atlas?.possibleEffects ?? 'Cumulative water, crop, and food security impacts.',
          `Key chains: Rice (${Math.round(matchedRegion.riceShare * 100)}%), Maize/Staples (${Math.round(matchedRegion.maizeFoodShare * 100)}%), Export (${Math.round(matchedRegion.exportShare * 100)}%).`,
        ],
      };
    }

    if (lang === 'sw') {
      return {
        kind: 'region',
        zoneName: `Mkoa wa ${matchedRegion.region}`,
        subtitle: `Jimbo la ${matchedRegion.province} · Wilaya ${matchedRegion.districtsTotal} · ${atlas?.groupLabel ?? ''}`,
        year,
        scenario,
        riskBadge: atlas?.dominantRisk.toUpperCase() ?? 'UANGALIZI WA MKOA',
        riskTone: atlas?.riskCategory === 'drought' ? 'danger' : atlas?.riskCategory === 'flood' ? 'warn' : 'neutral',
        metrics: [
          { label: 'Pato la Msingi la Mkoa', value: `${matchedRegion.gdpMUsd.toFixed(0)} Mil $`, tone: 'neutral' },
          { label: 'Msingi wa Kilimo kwa Mwaka', value: `${matchedRegion.agriBaseMUsd.toFixed(0)} Mil $`, tone: 'neutral' },
          { label: `Hasara za Kilimo (${year})`, value: fmtUsd(sumDirect, lang), tone: 'warn' },
          { label: `Jumla ya Hasara (${year})`, value: `${fmtUsd(sumTotal, lang)} · ${fmtMga(sumTotal, lang)}`, tone: sumTotal > 15 ? 'danger' : 'neutral' },
          { label: 'Sehemu ya Pato la Mkoa', value: `${gdpPct.toFixed(2)}% (${fmtEur(sumTotal, lang)})`, tone: gdpPct > 5 ? 'danger' : 'warn' },
          { label: 'Wilaya za Kipaumbele', value: atlas?.priorityDistricts.slice(0, 3).join(', ') || `${regionDistricts.length}`, tone: 'neutral' },
        ],
        summaryText:
          `Mkoa wa ${matchedRegion.region} (wilaya ${matchedRegion.districtsTotal}, Pato $${matchedRegion.gdpMUsd}M) unakadiria hasara ya ${fmtUsd(sumTotal, lang)} (~${fmtMga(sumTotal, lang)}) mwaka ${year} (${scenario.toUpperCase()}), sawa na ${gdpPct.toFixed(2)}% ya Pato la mkoa. Hatari kuu: ${atlas?.dominantRisk ?? 'ENSO'}.`,
        recommendations: [
          atlas?.possibleEffects ?? 'Athari za maji, kilimo na usalama wa chakula.',
          `Mazao makuu: Mpunga (${Math.round(matchedRegion.riceShare * 100)}%), Mahindi/Chakula (${Math.round(matchedRegion.maizeFoodShare * 100)}%), Biashara (${Math.round(matchedRegion.exportShare * 100)}%).`,
        ],
      };
    }

    return {
      kind: 'region',
      zoneName: `Région ${matchedRegion.region}`,
      subtitle: `Ex-Province de ${matchedRegion.province} · ${matchedRegion.districtsTotal} districts · ${atlas?.groupLabel ?? ''}`,
      year,
      scenario,
      riskBadge: atlas?.vigilanceLevel.toUpperCase() ?? 'SURVEILLANCE RÉGIONALE',
      riskTone: atlas?.riskCategory === 'drought' ? 'danger' : atlas?.riskCategory === 'flood' ? 'warn' : 'neutral',
      metrics: [
        { label: 'PIB régional de référence', value: `${matchedRegion.gdpMUsd.toFixed(0)} M $`, tone: 'neutral' },
        { label: 'Base agricole annuelle', value: `${matchedRegion.agriBaseMUsd.toFixed(0)} M $`, tone: 'neutral' },
        { label: `Pertes directes agricoles (${year})`, value: fmtUsd(sumDirect, lang), tone: 'warn' },
        { label: `Pertes totales consolidées (${year})`, value: `${fmtUsd(sumTotal, lang)} · ${fmtMga(sumTotal, lang)}`, tone: sumTotal > 15 ? 'danger' : 'neutral' },
        { label: 'Part du PIB régional', value: `${gdpPct.toFixed(2)} % (${fmtEur(sumTotal, lang)})`, tone: gdpPct > 5 ? 'danger' : 'warn' },
        { label: 'Districts prioritaires', value: atlas?.priorityDistricts.slice(0, 3).join(', ') || `${regionDistricts.length} suivis`, tone: 'neutral' },
      ],
      summaryText:
        `La région ${matchedRegion.region} (${matchedRegion.districtsTotal} districts, PIB ${matchedRegion.gdpMUsd} M $) enregistre en ${year} (${scenario.toUpperCase()}) une perte consolidée de ${fmtUsd(sumTotal, lang)} (~${fmtMga(sumTotal, lang)}), soit ${gdpPct.toFixed(2)} % de son PIB. ` +
        `Risque dominant : ${atlas?.dominantRisk ?? 'Aléas climatiques ENSO'}.`,
      recommendations: [
        atlas?.possibleEffects ?? 'Impacts hydriques, agricoles et alimentaires cumulés.',
        `Filières clés : Riz (${Math.round(matchedRegion.riceShare * 100)} %), Vivrier/Maïs (${Math.round(matchedRegion.maizeFoodShare * 100)} %), Rente/Export (${Math.round(matchedRegion.exportShare * 100)} %).`,
      ],
    };
  }

  // 3. Check 6 Ex-Provinces
  const matchedProvince =
    locProvinces.find((p) => normalizeText(p.province) === qNorm) ??
    locProvinces.find((p) => qNorm.includes(normalizeText(p.province)));

  if (matchedProvince) {
    const provRegions = REGION_23_ECONOMIC_BASELINES.filter(
      (r) => r.province === matchedProvince.province,
    );
    const totalLoss = provRegions.reduce((acc, r) => {
      const ds = DISTRICT_CHOROPLETH_DATA.filter(
        (d) => normalizeText(resolveRegionMeta(d.region).region) === normalizeText(r.region),
      );
      if (ds.length === 0) return acc + r.agriBaseMUsd * (year === 2027 ? 0.14 : -0.04) * SCENARIO_CONFIG[scenario].multiplier;
      const c = ds.reduce((s, d) => s + computeDistrictLossMUsd(d.district, year, scenario).totalLoss, 0);
      return acc + c * (r.districtsTotal / ds.length);
    }, 0);
    const gdpPct = (totalLoss / Math.max(1, matchedProvince.gdpMUsd)) * 100;

    if (lang === 'en') {
      return {
        kind: 'province',
        zoneName: `Ex-Province of ${matchedProvince.province}`,
        subtitle: `${matchedProvince.districtCount119} districts · ${provRegions.map((r) => r.region).join(', ')}`,
        year,
        scenario,
        riskBadge: gdpPct > 5 ? 'HIGH PROVINCIAL SHOCK' : 'PROVINCIAL WATCH',
        riskTone: gdpPct > 5 ? 'danger' : 'warn',
        metrics: [
          { label: 'Baseline Provincial GDP', value: `${matchedProvince.gdpMUsd.toLocaleString('en-US')} M $`, tone: 'neutral' },
          { label: 'Annual Agri Baseline', value: `${matchedProvince.agriBaselineMUsd} M $`, tone: 'neutral' },
          { label: `Total ${year} Losses (${scenario.toUpperCase()})`, value: `${fmtUsd(totalLoss, lang)} · ${fmtMga(totalLoss, lang)}`, tone: 'danger' },
          { label: 'Provincial GDP Share', value: `${gdpPct.toFixed(2)}% (${fmtEur(totalLoss, lang)})`, tone: 'warn' },
        ],
        summaryText:
          `Ex-Province of ${matchedProvince.province} (${matchedProvince.districtCount119} districts) totals ${fmtUsd(totalLoss, lang)} (~${fmtMga(totalLoss, lang)}) in ${year} losses (${gdpPct.toFixed(2)}% of provincial GDP). Dominant channel: ${matchedProvince.dominantChannel}.`,
        recommendations: [
          matchedProvince.dominantChannel,
          `Indirect elasticity (water, energy, livestock, roads): ×${matchedProvince.indirectElasticity.toFixed(2)} of direct farm losses.`,
        ],
      };
    }

    if (lang === 'sw') {
      return {
        kind: 'province',
        zoneName: `Jimbo la Zamani la ${matchedProvince.province}`,
        subtitle: `Wilaya ${matchedProvince.districtCount119} · ${provRegions.map((r) => r.region).join(', ')}`,
        year,
        scenario,
        riskBadge: gdpPct > 5 ? 'MSHTUKO MKUBWA WA JIMBO' : 'UANGALIZI WA JIMBO',
        riskTone: gdpPct > 5 ? 'danger' : 'warn',
        metrics: [
          { label: 'Pato la Msingi la Jimbo', value: `${matchedProvince.gdpMUsd.toLocaleString('en-US')} Mil $`, tone: 'neutral' },
          { label: 'Msingi wa Kilimo', value: `${matchedProvince.agriBaselineMUsd} Mil $`, tone: 'neutral' },
          { label: `Hasara Jumla ${year} (${scenario.toUpperCase()})`, value: `${fmtUsd(totalLoss, lang)} · ${fmtMga(totalLoss, lang)}`, tone: 'danger' },
          { label: 'Sehemu ya Pato la Jimbo', value: `${gdpPct.toFixed(2)}% (${fmtEur(totalLoss, lang)})`, tone: 'warn' },
        ],
        summaryText:
          `Jimbo la ${matchedProvince.province} (wilaya ${matchedProvince.districtCount119}) linapata hasara ya ${fmtUsd(totalLoss, lang)} (~${fmtMga(totalLoss, lang)}) mwaka ${year} (${gdpPct.toFixed(2)}% ya Pato). Njia kuu: ${matchedProvince.dominantChannel}.`,
        recommendations: [
          matchedProvince.dominantChannel,
          `Athari zisizo za moja kwa moja (maji, umeme, mifugo, barabara): ×${matchedProvince.indirectElasticity.toFixed(2)} ya hasara za kilimo.`,
        ],
      };
    }

    return {
      kind: 'province',
      zoneName: `Ex-Province de ${matchedProvince.province}`,
      subtitle: `${matchedProvince.districtCount119} districts · ${provRegions.map((r) => r.region).join(', ')}`,
      year,
      scenario,
      riskBadge: gdpPct > 5 ? 'CHOC PROVINCIAL ÉLEVÉ' : 'VIGILANCE PROVINCIALE',
      riskTone: gdpPct > 5 ? 'danger' : 'warn',
      metrics: [
        { label: 'PIB provincial de référence', value: `${matchedProvince.gdpMUsd.toLocaleString('fr-FR')} M $`, tone: 'neutral' },
        { label: 'Base agricole annuelle', value: `${matchedProvince.agriBaselineMUsd} M $`, tone: 'neutral' },
        { label: `Pertes totales ${year} (${scenario.toUpperCase()})`, value: `${fmtUsd(totalLoss, lang)} · ${fmtMga(totalLoss, lang)}`, tone: 'danger' },
        { label: 'Part du PIB provincial', value: `${gdpPct.toFixed(2)} % (${fmtEur(totalLoss, lang)})`, tone: 'warn' },
      ],
      summaryText:
        `L’ex-province de ${matchedProvince.province} (${matchedProvince.districtCount119} districts) totalise ${fmtUsd(totalLoss, lang)} (~${fmtMga(totalLoss, lang)}) de pertes économiques en ${year} (${gdpPct.toFixed(2)} % du PIB provincial). Canal dominant : ${matchedProvince.dominantChannel}.`,
      recommendations: [
        matchedProvince.dominantChannel,
        `Élasticité indirecte (eau, énergie, élevage, pistes) : ×${matchedProvince.indirectElasticity.toFixed(2)} par rapport aux pertes agricoles directes.`,
      ],
    };
  }

  // 4. Check COI / SADC / COMESA / African Countries
  const matchedCountry =
    locCountries.find((c) => normalizeText(c.countryOrZone) === qNorm) ??
    CONTINENTAL_COUNTRY_PROJECTIONS.find((c) => normalizeText(c.countryOrZone) === qNorm) ??
    locCountries.find(
      (c) =>
        qNorm.includes(normalizeText(c.id)) ||
        normalizeText(c.countryOrZone).includes(qNorm) ||
        qNorm.includes(normalizeText(c.countryOrZone)),
    );

  if (matchedCountry) {
    const locMatch = locCountries.find((c) => c.id === matchedCountry.id) ?? matchedCountry;
    const mult = SCENARIO_CONFIG[scenario].multiplier;
    const direct27 = locMatch.directAgriLoss2027MUsd * mult;
    const indirect27 = locMatch.indirectInfraEnergyLoss2027MUsd * mult;
    const total27 = direct27 + indirect27;
    const valYear = year === 2027 ? total27 : -locMatch.netBalance2028MUsd * mult;
    const gdpPct = (Math.abs(valYear) / Math.max(1, locMatch.gdpBnUsd * 1000)) * 100;

    if (lang === 'en') {
      return {
        kind: 'country',
        zoneName: locMatch.countryOrZone,
        subtitle: `${locMatch.primaryGroup} · Blocs: ${locMatch.blocs.join(', ')}`,
        year,
        scenario,
        riskBadge: valYear > 400 ? 'MAJOR MACRO IMPACT' : 'REGIONAL EXPOSURE',
        riskTone: valYear > 400 ? 'danger' : valYear > 0 ? 'warn' : 'good',
        metrics: [
          { label: 'National / Zone GDP', value: `${locMatch.gdpBnUsd.toFixed(1)} B $`, tone: 'neutral' },
          { label: 'Agriculture Share of GDP', value: `${locMatch.agriSharePct.toFixed(1)}%`, tone: 'neutral' },
          { label: '2027 Direct Agri Losses', value: fmtUsd(direct27, lang), tone: 'warn' },
          { label: '2027 Indirect Infra/Power', value: fmtUsd(indirect27, lang), tone: 'warn' },
          {
            label: year === 2027 ? `Total 2027 Losses (${scenario.toUpperCase()})` : `Net 2028 Balance (${scenario.toUpperCase()})`,
            value: year === 2027 ? `${fmtUsd(total27, lang)} (${fmtEur(total27, lang)})` : fmtUsd(-valYear, lang),
            tone: year === 2027 ? 'danger' : valYear < 0 ? 'good' : 'warn',
          },
          { label: 'Relative GDP Impact', value: `${gdpPct.toFixed(2)}%`, tone: gdpPct > 1.5 ? 'danger' : 'warn' },
        ],
        summaryText:
          `${locMatch.countryOrZone} (${locMatch.blocs.join(', ')}) faces a total 2027 shock of ${fmtUsd(total27, lang)} (${fmtUsd(direct27, lang)} direct farm + ${fmtUsd(indirect27, lang)} indirect, or ${((total27 / (locMatch.gdpBnUsd * 1000)) * 100).toFixed(2)}% of GDP). Signal: ${locMatch.climateSignal2027}.`,
        recommendations: [locMatch.climateSignal2027, locMatch.transmissionChannel],
      };
    }

    if (lang === 'sw') {
      return {
        kind: 'country',
        zoneName: locMatch.countryOrZone,
        subtitle: `${locMatch.primaryGroup} · Jumuiya: ${locMatch.blocs.join(', ')}`,
        year,
        scenario,
        riskBadge: valYear > 400 ? 'ATHARI KUBWA KIUCHUMI' : 'HATARI YA KIKANDA',
        riskTone: valYear > 400 ? 'danger' : valYear > 0 ? 'warn' : 'good',
        metrics: [
          { label: 'Pato la Taifa / Eneo', value: `${locMatch.gdpBnUsd.toFixed(1)} Bil $`, tone: 'neutral' },
          { label: 'Sehemu ya Kilimo Katika Pato', value: `${locMatch.agriSharePct.toFixed(1)}%`, tone: 'neutral' },
          { label: 'Hasara za Kilimo 2027', value: fmtUsd(direct27, lang), tone: 'warn' },
          { label: 'Hasara za Miundombinu/Nishati 2027', value: fmtUsd(indirect27, lang), tone: 'warn' },
          {
            label: year === 2027 ? `Hasara Jumla 2027 (${scenario.toUpperCase()})` : `Salio la 2028 (${scenario.toUpperCase()})`,
            value: year === 2027 ? `${fmtUsd(total27, lang)} (${fmtEur(total27, lang)})` : fmtUsd(-valYear, lang),
            tone: year === 2027 ? 'danger' : valYear < 0 ? 'good' : 'warn',
          },
          { label: 'Uwiano na Pato la Taifa', value: `${gdpPct.toFixed(2)}%`, tone: gdpPct > 1.5 ? 'danger' : 'warn' },
        ],
        summaryText:
          `${locMatch.countryOrZone} (${locMatch.blocs.join(', ')}) inapata mshtuko wa ${fmtUsd(total27, lang)} mwaka 2027 (${fmtUsd(direct27, lang)} kilimo + ${fmtUsd(indirect27, lang)} zisizo za moja kwa moja, sawa na ${((total27 / (locMatch.gdpBnUsd * 1000)) * 100).toFixed(2)}% ya Pato). Ishara: ${locMatch.climateSignal2027}.`,
        recommendations: [locMatch.climateSignal2027, locMatch.transmissionChannel],
      };
    }

    return {
      kind: 'country',
      zoneName: locMatch.countryOrZone,
      subtitle: `${locMatch.primaryGroup} · Blocs : ${locMatch.blocs.join(', ')}`,
      year,
      scenario,
      riskBadge: valYear > 400 ? 'IMPACT MACRO MAJEUR' : 'EXPOSITION RÉGIONALE',
      riskTone: valYear > 400 ? 'danger' : valYear > 0 ? 'warn' : 'good',
      metrics: [
        { label: 'PIB national / zone', value: `${locMatch.gdpBnUsd.toFixed(1)} Md $`, tone: 'neutral' },
        { label: 'Part agricole du PIB', value: `${locMatch.agriSharePct.toFixed(1)} %`, tone: 'neutral' },
        { label: 'Pertes agricoles directes 2027', value: fmtUsd(direct27, lang), tone: 'warn' },
        { label: 'Pertes infra/énergie indirectes 2027', value: fmtUsd(indirect27, lang), tone: 'warn' },
        {
          label: year === 2027 ? `Pertes totales 2027 (${scenario.toUpperCase()})` : `Solde net 2028 (${scenario.toUpperCase()})`,
          value: year === 2027 ? `${fmtUsd(total27, lang)} (${fmtEur(total27, lang)})` : fmtUsd(-valYear, lang),
          tone: year === 2027 ? 'danger' : valYear < 0 ? 'good' : 'warn',
        },
        { label: 'Poids relatif sur le PIB', value: `${gdpPct.toFixed(2)} %`, tone: gdpPct > 1.5 ? 'danger' : 'warn' },
      ],
      summaryText:
        `${locMatch.countryOrZone} (${locMatch.blocs.join(', ')}) subit en 2027 un choc total de ${fmtUsd(total27, lang)} (dont ${fmtUsd(direct27, lang)} agricoles directs et ${fmtUsd(indirect27, lang)} indirects, soit ${((total27 / (locMatch.gdpBnUsd * 1000)) * 100).toFixed(2)} % du PIB). Signal : ${locMatch.climateSignal2027}.`,
      recommendations: [locMatch.climateSignal2027, locMatch.transmissionChannel],
    };
  }

  return getCurrentSituationSnapshot(scenario, lang);
}

export function compareZonesCalculation({
  zoneA,
  zoneB,
  year = 2027,
  scenario = 's2',
  lang = 'fr',
}: {
  zoneA: string;
  zoneB: string;
  year?: HorizonYear;
  scenario?: ScenarioKey;
  lang?: LanguageCode;
}): ZoneCalculationResult {
  const resA = computeZoneAnalysis({ zoneQuery: zoneA, year, scenario, lang });
  const resB = computeZoneAnalysis({ zoneQuery: zoneB, year, scenario, lang });
  const scenLabel = getLocalizedScenarioLabel(scenario, lang);

  return {
    kind: 'comparison',
    zoneName:
      lang === 'en'
        ? `Comparison: ${resA.zoneName} vs ${resB.zoneName}`
        : lang === 'sw'
          ? `Ulinganisho: ${resA.zoneName} dhidi ya ${resB.zoneName}`
          : `Comparatif : ${resA.zoneName} vs ${resB.zoneName}`,
    subtitle: `${lang === 'sw' ? 'Mwaka' : 'Horizon'} ${year} · ${scenLabel}`,
    year,
    scenario,
    riskBadge:
      lang === 'en' ? 'COMPARATIVE ANALYSIS' : lang === 'sw' ? 'UCHAMBUZI WA ULINGANISHO' : 'ANALYSE COMPARATIVE',
    riskTone: 'neutral',
    metrics: [
      ...resA.metrics.slice(0, 3).map((m) => ({
        label: `${resA.zoneName.split(' (')[0]} · ${m.label}`,
        value: m.value,
        tone: m.tone,
      })),
      ...resB.metrics.slice(0, 3).map((m) => ({
        label: `${resB.zoneName.split(' (')[0]} · ${m.label}`,
        value: m.value,
        tone: m.tone,
      })),
    ],
    summaryText:
      lang === 'en'
        ? `${resA.summaryText} | Contrast: ${resB.summaryText}`
        : lang === 'sw'
          ? `${resA.summaryText} | Kinyume chake, ${resB.summaryText}`
          : `${resA.summaryText} | En face, ${resB.summaryText}`,
    recommendations: [
      `${resA.zoneName}: ${resA.recommendations[0] ?? ''}`,
      `${resB.zoneName}: ${resB.recommendations[0] ?? ''}`,
    ],
  };
}
