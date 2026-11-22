import {
  PROVINCE_6_BASELINES,
  REGION_23_ECONOMIC_BASELINES,
  type ContinentalCountryLossProfile,
  type DistrictPredictionPoint,
  type ExProvinceName,
  type RegionEconomicMeta,
} from '../data/ensoData.ts';
import type { LanguageCode } from '../i18n/LanguageContext.tsx';
import {
  getLocalizedContinentalProjections,
  getLocalizedDistrictChoroplethData,
  getLocalizedProvinceBaselines,
} from '../i18n/localizedMlEconomicData.ts';

export type HorizonYear = 2027 | 2028;
export type ScenarioKey = 's1' | 's2' | 's3';
export type ScopeMode = 'consolidated119' | 'pilot42';
export type CurrencyCode = 'USD' | 'MGA' | 'EUR';

export const MGA_PER_USD = 4550;
export const EUR_PER_USD = 0.925;

export const SCENARIO_META_BY_LANG: Record<
  LanguageCode,
  Record<ScenarioKey, { label: string; shortLabel: string; multiplier: number; note: string }>
> = {
  fr: {
    s1: {
      label: 'Scénario 1 · Déficit limité (×0,55)',
      shortLabel: 'S1 · Limité (×0,55)',
      multiplier: 0.55,
      note: 'Rupture partielle des pluies, déficit hydrique modéré et réponse précoce efficace.',
    },
    s2: {
      label: 'Scénario 2 · Base ML / Prolongé (×1,00)',
      shortLabel: 'S2 · Base ML (×1,00)',
      multiplier: 1.0,
      note: 'Trajectoire centrale du modèle ML (super El Niño 2026–2027, décalage 3–6 mois).',
    },
    s3: {
      label: 'Scénario 3 · Choc sévère (×1,45)',
      shortLabel: 'S3 · Sévère (×1,45)',
      multiplier: 1.45,
      note: 'Choc cumulé sécheresse Grand Sud + étiage RIA + aléa cyclonique/crues littoral Est.',
    },
  },
  en: {
    s1: {
      label: 'Scenario 1 · Mild Deficit (×0.55)',
      shortLabel: 'S1 · Mild (×0.55)',
      multiplier: 0.55,
      note: 'Partial rainfall break, moderate water deficit, and effective early response.',
    },
    s2: {
      label: 'Scenario 2 · ML Baseline / Extended (×1.00)',
      shortLabel: 'S2 · ML Base (×1.00)',
      multiplier: 1.0,
      note: 'Central ML trajectory (2026–2027 Super El Niño, 3–6 month hydro-agricultural lag).',
    },
    s3: {
      label: 'Scenario 3 · Severe Shock (×1.45)',
      shortLabel: 'S3 · Severe (×1.45)',
      multiplier: 1.45,
      note: 'Compounded Grand Sud drought + RIA hydropower drawdown + East Coast flood/cyclone shock.',
    },
  },
  sw: {
    s1: {
      label: 'Hali 1 · Upungufu Mdogo (×0.55)',
      shortLabel: 'S1 · Mdogo (×0.55)',
      multiplier: 0.55,
      note: 'Upungufu wa wastani wa mvua na mwitikio wa mapema wenye mafanikio.',
    },
    s2: {
      label: 'Hali 2 · Msingi wa ML / Uliopanuliwa (×1.00)',
      shortLabel: 'S2 · Msingi ML (×1.00)',
      multiplier: 1.0,
      note: 'Mwelekeo mkuu wa muundo wa ML (El Niño Kuu 2026–2027, uchelewesho miezi 3–6).',
    },
    s3: {
      label: 'Hali 3 · Mshtuko Mkali (×1.45)',
      shortLabel: 'S3 · Mkali (×1.45)',
      multiplier: 1.45,
      note: 'Ukame mkali Kusini Kuu + upungufu wa umeme RIA + mafuriko ya pwani ya Mashariki.',
    },
  },
};

const REGION_ALIAS_MAP: Record<string, string> = {
  sava: 'SAVA',
  ambatosoa: 'Analanjirofo',
};

function resolveRegionMeta(rawRegion: string): RegionEconomicMeta {
  const mappedName = REGION_ALIAS_MAP[rawRegion.toLowerCase()] ?? rawRegion;
  const found = REGION_23_ECONOMIC_BASELINES.find(
    (r) => r.region.toLowerCase() === mappedName.toLowerCase(),
  );
  if (found) return found;
  return REGION_23_ECONOMIC_BASELINES[0];
}

export function formatCurrencyFromMUsd(
  mUsd: number,
  currency: CurrencyCode,
  signed = false,
  lang: LanguageCode = 'fr',
): string {
  const absMUsd = Math.abs(mUsd);
  const sign = signed ? (mUsd > 0.05 ? '+' : mUsd < -0.05 ? '−' : '') : mUsd < -0.05 ? '−' : '';
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const bnLabel = lang === 'fr' ? 'Md' : 'B';

  if (currency === 'USD') {
    if (absMUsd >= 1000) {
      const bn = absMUsd / 1000;
      return `${sign}${bn.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${bnLabel} $`;
    }
    return `${sign}${absMUsd.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M $`;
  }

  if (currency === 'EUR') {
    const mEur = absMUsd * EUR_PER_USD;
    if (mEur >= 1000) {
      const bn = mEur / 1000;
      return `${sign}${bn.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${bnLabel} €`;
    }
    return `${sign}${mEur.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M €`;
  }

  const mdMga = absMUsd * (MGA_PER_USD / 1000);
  if (mdMga >= 1000) {
    return `${sign}${Math.round(mdMga).toLocaleString(locale)} ${bnLabel} Ar`;
  }
  return `${sign}${mdMga.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${bnLabel} Ar`;
}

export function formatPct(val: number, digits = 2, lang: LanguageCode = 'fr'): string {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  return `${val.toLocaleString(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} %`;
}

export interface DistrictComputedLoss {
  point: DistrictPredictionPoint;
  canonicalRegion: string;
  displayRegion: string;
  province: ExProvinceName;
  agriBaseUnitMUsd: number;
  riceLossMUsd: number;
  maizeLossMUsd: number;
  exportLossMUsd: number;
  directAgriLossMUsd: number;
  indirectLossMUsd: number;
  totalLossMUsd: number;
  grossRebound2028MUsd: number;
  netBalance2028MUsd: number;
  agriShockPct: number;
}

export interface RegionComputedLoss {
  meta: RegionEconomicMeta;
  pilotDistrictCount: number;
  coveredByPilot: boolean;
  riceLossMUsd: number;
  maizeLossMUsd: number;
  exportLossMUsd: number;
  directAgriLossMUsd: number;
  indirectLossMUsd: number;
  totalLossMUsd: number;
  grossRebound2028MUsd: number;
  netBalance2028MUsd: number;
  gdpImpactPct: number;
  agriImpactPct: number;
}

export interface ProvinceComputedLoss {
  province: ExProvinceName;
  districtCount119: number;
  pilotDistrictCount: number;
  gdpMUsd: number;
  agriBaselineMUsd: number;
  indirectElasticity: number;
  dominantChannel: string;
  riceLossMUsd: number;
  maizeLossMUsd: number;
  exportLossMUsd: number;
  directAgriLossMUsd: number;
  indirectLossMUsd: number;
  totalLossMUsd: number;
  grossRebound2028MUsd: number;
  netBalance2028MUsd: number;
  gdpImpactPct: number;
  agriImpactPct: number;
}

export interface CountryComputedRow extends ContinentalCountryLossProfile {
  directLossMUsd: number;
  indirectLossMUsd: number;
  totalLossMUsd: number;
  gdpImpactPct: number;
  netBalanceAdj2028MUsd: number;
}

export interface EconomicAggregatedModel {
  horizonYear: HorizonYear;
  scenario: ScenarioKey;
  scope: ScopeMode;
  scenarioMult: number;
  districtRows: DistrictComputedLoss[];
  regionRows: RegionComputedLoss[];
  provinceRows: ProvinceComputedLoss[];
  madagascar: {
    gdpMUsd: number;
    agriBaseMUsd: number;
    directMUsd: number;
    indirectMUsd: number;
    totalLossMUsd: number;
    gdpPct: number;
    agriPct: number;
    rebound2028MUsd: number;
    net2028MUsd: number;
  };
  countryRows: CountryComputedRow[];
  blocs: {
    coiTotalMUsd: number;
    sadcTotalMUsd: number;
    comesaTotalMUsd: number;
    africaTotalMUsd: number;
    africaGdpPct: number;
  };
}

export function computeEconomicAggregation(params: {
  horizonYear: HorizonYear;
  scenario: ScenarioKey;
  scope: ScopeMode;
  lang?: LanguageCode;
}): EconomicAggregatedModel {
  const { horizonYear, scenario, scope, lang = 'fr' } = params;
  const scenarioMult = SCENARIO_META_BY_LANG[lang][scenario].multiplier;
  const localizedProvinces = getLocalizedProvinceBaselines(lang);
  const localizedDistricts = getLocalizedDistrictChoroplethData(lang);
  const localizedCountries = getLocalizedContinentalProjections(lang);

  const provinceLookup = Object.fromEntries(
    localizedProvinces.map((p) => [p.province, p]),
  ) as Record<ExProvinceName, (typeof localizedProvinces)[number]>;

  const districtRows: DistrictComputedLoss[] = localizedDistricts.map((d) => {
    const regionMeta = resolveRegionMeta(d.region);
    const provMeta = provinceLookup[regionMeta.province];
    const unitAgriBase = regionMeta.agriBaseMUsd / Math.max(1, regionMeta.districtsTotal);

    const rice27 = Math.max(0, -d.rice2027 / 100) * unitAgriBase * regionMeta.riceShare * scenarioMult;
    const maize27 =
      Math.max(0, -d.maize2027 / 100) * unitAgriBase * regionMeta.maizeFoodShare * scenarioMult;
    const export27 =
      Math.max(0, -d.exportCrop2027 / 100) * unitAgriBase * regionMeta.exportShare * scenarioMult;
    const direct27 = rice27 + maize27 + export27;

    const hydricExtra27 = d.water2027 <= -35 ? 0.08 : d.water2027 >= 20 ? 0.12 : 0;
    const indirect27 = direct27 * (provMeta.indirectElasticity + hydricExtra27);
    const total27 = direct27 + indirect27;

    const carryOverFactor = 0.26;
    const rice28Loss = rice27 * carryOverFactor;
    const maize28Loss = maize27 * carryOverFactor;
    const export28Loss = export27 * carryOverFactor;
    const direct28Loss = rice28Loss + maize28Loss + export28Loss;

    const laNinaFloodRisk =
      d.water2028 >= 20
        ? unitAgriBase * 0.028 * (d.water2028 / 24) * scenarioMult
        : unitAgriBase * 0.012 * scenarioMult;
    const indirect28Loss = indirect27 * 0.24 + laNinaFloodRisk;
    const total28Loss = direct28Loss + indirect28Loss;

    const reboundHaircut = Math.max(0.55, 1.15 - scenarioMult * 0.35);
    const grossRebound2028 =
      ((Math.max(0, d.rice2028) / 100) * regionMeta.riceShare +
        (Math.max(0, d.maize2028) / 100) * regionMeta.maizeFoodShare +
        (Math.max(0, d.exportCrop2028) / 100) * regionMeta.exportShare) *
      unitAgriBase *
      reboundHaircut;

    const net2028 = grossRebound2028 - total28Loss;

    const is2027 = horizonYear === 2027;
    const activeDirect = is2027 ? direct27 : direct28Loss;
    const activeIndirect = is2027 ? indirect27 : indirect28Loss;
    const activeTotal = is2027 ? total27 : total28Loss;

    return {
      point: d,
      canonicalRegion: regionMeta.region,
      displayRegion:
        d.region.toLowerCase() === 'ambatosoa' ? 'Analanjirofo / Ambatosoa' : regionMeta.region,
      province: regionMeta.province,
      agriBaseUnitMUsd: unitAgriBase,
      riceLossMUsd: is2027 ? rice27 : rice28Loss,
      maizeLossMUsd: is2027 ? maize27 : maize28Loss,
      exportLossMUsd: is2027 ? export27 : export28Loss,
      directAgriLossMUsd: activeDirect,
      indirectLossMUsd: activeIndirect,
      totalLossMUsd: activeTotal,
      grossRebound2028MUsd: grossRebound2028,
      netBalance2028MUsd: net2028,
      agriShockPct: unitAgriBase > 0 ? (activeDirect / unitAgriBase) * 100 : 0,
    };
  });

  const provincePilotRates = {} as Record<
    ExProvinceName,
    {
      riceRate: number;
      maizeRate: number;
      exportRate: number;
      indirectRate: number;
      reboundRate: number;
    }
  >;
  PROVINCE_6_BASELINES.forEach((p) => {
    const inProv = districtRows.filter((dr) => dr.province === p.province);
    const sumBase = inProv.reduce((acc, r) => acc + r.agriBaseUnitMUsd, 0) || 1;
    provincePilotRates[p.province] = {
      riceRate: inProv.reduce((acc, r) => acc + r.riceLossMUsd, 0) / sumBase,
      maizeRate: inProv.reduce((acc, r) => acc + r.maizeLossMUsd, 0) / sumBase,
      exportRate: inProv.reduce((acc, r) => acc + r.exportLossMUsd, 0) / sumBase,
      indirectRate: inProv.reduce((acc, r) => acc + r.indirectLossMUsd, 0) / sumBase,
      reboundRate: inProv.reduce((acc, r) => acc + r.grossRebound2028MUsd, 0) / sumBase,
    };
  });

  const regionRows: RegionComputedLoss[] = REGION_23_ECONOMIC_BASELINES.map((reg) => {
    const inReg = districtRows.filter((dr) => dr.canonicalRegion === reg.region);
    const pilotCount = inReg.length;
    const covered = pilotCount > 0;

    if (scope === 'pilot42') {
      const rice = inReg.reduce((a, r) => a + r.riceLossMUsd, 0);
      const maize = inReg.reduce((a, r) => a + r.maizeLossMUsd, 0);
      const exp = inReg.reduce((a, r) => a + r.exportLossMUsd, 0);
      const direct = rice + maize + exp;
      const indirect = inReg.reduce((a, r) => a + r.indirectLossMUsd, 0);
      const total = direct + indirect;
      const rebound = inReg.reduce((a, r) => a + r.grossRebound2028MUsd, 0);
      const net = inReg.reduce((a, r) => a + r.netBalance2028MUsd, 0);
      return {
        meta: reg,
        pilotDistrictCount: pilotCount,
        coveredByPilot: covered,
        riceLossMUsd: rice,
        maizeLossMUsd: maize,
        exportLossMUsd: exp,
        directAgriLossMUsd: direct,
        indirectLossMUsd: indirect,
        totalLossMUsd: total,
        grossRebound2028MUsd: rebound,
        netBalance2028MUsd: net,
        gdpImpactPct: reg.gdpMUsd > 0 ? (total / reg.gdpMUsd) * 100 : 0,
        agriImpactPct: reg.agriBaseMUsd > 0 ? (direct / reg.agriBaseMUsd) * 100 : 0,
      };
    }

    if (covered) {
      const pilotBaseSum = inReg.reduce((a, r) => a + r.agriBaseUnitMUsd, 0) || 1;
      const scale = reg.agriBaseMUsd / pilotBaseSum;
      const rice = inReg.reduce((a, r) => a + r.riceLossMUsd, 0) * scale;
      const maize = inReg.reduce((a, r) => a + r.maizeLossMUsd, 0) * scale;
      const exp = inReg.reduce((a, r) => a + r.exportLossMUsd, 0) * scale;
      const direct = rice + maize + exp;
      const indirect = inReg.reduce((a, r) => a + r.indirectLossMUsd, 0) * scale;
      const total = direct + indirect;
      const rebound = inReg.reduce((a, r) => a + r.grossRebound2028MUsd, 0) * scale;
      const net = rebound - total;
      return {
        meta: reg,
        pilotDistrictCount: pilotCount,
        coveredByPilot: true,
        riceLossMUsd: rice,
        maizeLossMUsd: maize,
        exportLossMUsd: exp,
        directAgriLossMUsd: direct,
        indirectLossMUsd: indirect,
        totalLossMUsd: total,
        grossRebound2028MUsd: rebound,
        netBalance2028MUsd: net,
        gdpImpactPct: reg.gdpMUsd > 0 ? (total / reg.gdpMUsd) * 100 : 0,
        agriImpactPct: reg.agriBaseMUsd > 0 ? (direct / reg.agriBaseMUsd) * 100 : 0,
      };
    }

    const rates = provincePilotRates[reg.province];
    const rice = rates.riceRate * reg.agriBaseMUsd;
    const maize = rates.maizeRate * reg.agriBaseMUsd;
    const exp = rates.exportRate * reg.agriBaseMUsd;
    const direct = rice + maize + exp;
    const indirect = rates.indirectRate * reg.agriBaseMUsd;
    const total = direct + indirect;
    const rebound = rates.reboundRate * reg.agriBaseMUsd;
    return {
      meta: reg,
      pilotDistrictCount: 0,
      coveredByPilot: false,
      riceLossMUsd: rice,
      maizeLossMUsd: maize,
      exportLossMUsd: exp,
      directAgriLossMUsd: direct,
      indirectLossMUsd: indirect,
      totalLossMUsd: total,
      grossRebound2028MUsd: rebound,
      netBalance2028MUsd: rebound - total,
      gdpImpactPct: reg.gdpMUsd > 0 ? (total / reg.gdpMUsd) * 100 : 0,
      agriImpactPct: reg.agriBaseMUsd > 0 ? (direct / reg.agriBaseMUsd) * 100 : 0,
    };
  });

  const provinceRows: ProvinceComputedLoss[] = localizedProvinces.map((prov) => {
    const inProv = regionRows.filter((r) => r.meta.province === prov.province);
    const rice = inProv.reduce((a, r) => a + r.riceLossMUsd, 0);
    const maize = inProv.reduce((a, r) => a + r.maizeLossMUsd, 0);
    const exp = inProv.reduce((a, r) => a + r.exportLossMUsd, 0);
    const direct = rice + maize + exp;
    const indirect = inProv.reduce((a, r) => a + r.indirectLossMUsd, 0);
    const total = direct + indirect;
    const rebound = inProv.reduce((a, r) => a + r.grossRebound2028MUsd, 0);
    const net = inProv.reduce((a, r) => a + r.netBalance2028MUsd, 0);
    const pilotDistrictCount = inProv.reduce((a, r) => a + r.pilotDistrictCount, 0);

    return {
      ...prov,
      pilotDistrictCount,
      riceLossMUsd: rice,
      maizeLossMUsd: maize,
      exportLossMUsd: exp,
      directAgriLossMUsd: direct,
      indirectLossMUsd: indirect,
      totalLossMUsd: total,
      grossRebound2028MUsd: rebound,
      netBalance2028MUsd: net,
      gdpImpactPct: prov.gdpMUsd > 0 ? (total / prov.gdpMUsd) * 100 : 0,
      agriImpactPct: prov.agriBaselineMUsd > 0 ? (direct / prov.agriBaselineMUsd) * 100 : 0,
    };
  });

  const madagascarTotalGdpMUsd = provinceRows.reduce((a, p) => a + p.gdpMUsd, 0);
  const madagascarTotalAgriMUsd = provinceRows.reduce((a, p) => a + p.agriBaselineMUsd, 0);
  const madagascarDirectMUsd = provinceRows.reduce((a, p) => a + p.directAgriLossMUsd, 0);
  const madagascarIndirectMUsd = provinceRows.reduce((a, p) => a + p.indirectLossMUsd, 0);
  const madagascarTotalLossMUsd = madagascarDirectMUsd + madagascarIndirectMUsd;
  const madagascarRebound2028MUsd = provinceRows.reduce((a, p) => a + p.grossRebound2028MUsd, 0);
  const madagascarNet2028MUsd = madagascarRebound2028MUsd - madagascarTotalLossMUsd;

  const countryRows: CountryComputedRow[] = localizedCountries.map((c) => {
    if (c.isMadagascarDynamic) {
      const total = madagascarTotalLossMUsd;
      return {
        ...c,
        directLossMUsd: madagascarDirectMUsd,
        indirectLossMUsd: madagascarIndirectMUsd,
        totalLossMUsd: total,
        gdpImpactPct: (total / (c.gdpBnUsd * 1000)) * 100,
        netBalanceAdj2028MUsd: madagascarNet2028MUsd,
      };
    }

    if (horizonYear === 2027) {
      const direct = c.directAgriLoss2027MUsd * scenarioMult;
      const indirect = c.indirectInfraEnergyLoss2027MUsd * scenarioMult;
      const total = direct + indirect;
      return {
        ...c,
        directLossMUsd: direct,
        indirectLossMUsd: indirect,
        totalLossMUsd: total,
        gdpImpactPct: (total / (c.gdpBnUsd * 1000)) * 100,
        netBalanceAdj2028MUsd: c.netBalance2028MUsd * scenarioMult,
      };
    }

    const residualDirect = c.directAgriLoss2027MUsd * 0.24 * scenarioMult;
    const residualIndirect = c.indirectInfraEnergyLoss2027MUsd * 0.3 * scenarioMult;
    const total = residualDirect + residualIndirect;
    const netAdj =
      c.netBalance2028MUsd >= 0
        ? c.netBalance2028MUsd * Math.max(0.65, 1.15 - scenarioMult * 0.3)
        : c.netBalance2028MUsd * scenarioMult;
    return {
      ...c,
      directLossMUsd: residualDirect,
      indirectLossMUsd: residualIndirect,
      totalLossMUsd: total,
      gdpImpactPct: (total / (c.gdpBnUsd * 1000)) * 100,
      netBalanceAdj2028MUsd: netAdj,
    };
  });

  const coiTotalMUsd = countryRows
    .filter((c) => c.blocs.includes('COI'))
    .reduce((a, c) => a + c.totalLossMUsd, 0);
  const sadcTotalMUsd = countryRows
    .filter((c) => c.blocs.includes('SADC'))
    .reduce((a, c) => a + c.totalLossMUsd, 0);
  const comesaTotalMUsd = countryRows
    .filter((c) => c.blocs.includes('COMESA'))
    .reduce((a, c) => a + c.totalLossMUsd, 0);
  const africaTotalMUsd = countryRows.reduce((a, c) => a + c.totalLossMUsd, 0);
  const africaGdpBnUsd = countryRows.reduce((a, c) => a + c.gdpBnUsd, 0);

  return {
    horizonYear,
    scenario,
    scope,
    scenarioMult,
    districtRows,
    regionRows,
    provinceRows,
    madagascar: {
      gdpMUsd: madagascarTotalGdpMUsd,
      agriBaseMUsd: madagascarTotalAgriMUsd,
      directMUsd: madagascarDirectMUsd,
      indirectMUsd: madagascarIndirectMUsd,
      totalLossMUsd: madagascarTotalLossMUsd,
      gdpPct: (madagascarTotalLossMUsd / madagascarTotalGdpMUsd) * 100,
      agriPct: (madagascarDirectMUsd / madagascarTotalAgriMUsd) * 100,
      rebound2028MUsd: madagascarRebound2028MUsd,
      net2028MUsd: madagascarNet2028MUsd,
    },
    countryRows,
    blocs: {
      coiTotalMUsd,
      sadcTotalMUsd,
      comesaTotalMUsd,
      africaTotalMUsd,
      africaGdpPct: (africaTotalMUsd / (africaGdpBnUsd * 1000)) * 100,
    },
  };
}
