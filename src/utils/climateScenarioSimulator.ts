import type { LanguageCode } from '../i18n/LanguageContext';
import type { GlobalSyncPayload } from '../context/GlobalSyncContext';
import {
  computeEconomicAggregation,
  type HorizonYear,
  type ScopeMode,
} from './economicAggregation';
import { UN_ZONE_SUMMARIES, type UnZoneId } from '../data/worldEnso195Data';

export type ElNinoIntensity = 'moderate' | 'extreme';

export interface ScenarioSimulationInput {
  intensity: ElNinoIntensity;
  oniC: number;
  iodC: number;
  horizonYear: HorizonYear;
  scope: ScopeMode;
  lang: LanguageCode;
  syncState?: GlobalSyncPayload;
}

export interface CropYieldPrediction {
  id: 'rice' | 'maize' | 'cassava' | 'export';
  baselineYieldTHa: number;
  simulatedYieldTHa: number;
  deltaPct: number;
  tonnageAtRiskKt: number;
}

export interface ProvinceScenarioRow {
  province: string;
  moderateLossMUsd: number;
  activeLossMUsd: number;
  extremeLossMUsd: number;
  gdpPct: number;
  agriPct: number;
}

export interface DistrictScenarioRow {
  district: string;
  region: string;
  province: string;
  waterDeltaPct: number;
  riceDeltaPct: number;
  maizeDeltaPct: number;
  exportDeltaPct: number;
  lossMUsd: number;
}

export interface UnZoneScenarioRow {
  id: UnZoneId;
  nameFr: string;
  nameEn: string;
  countryCount: number;
  activeLossBUsd: number;
  moderateLossBUsd: number;
  extremeLossBUsd: number;
  inflationAddPct: number;
}

export interface ScenarioSimulationResult {
  intensity: ElNinoIntensity;
  oniC: number;
  iodC: number;
  stressMultiplier: number;
  horizonYear: HorizonYear;
  scope: ScopeMode;
  crops: CropYieldPrediction[];
  gdpModel: {
    madagascarTotalMUsd: number;
    madagascarDirectMUsd: number;
    madagascarIndirectMUsd: number;
    madagascarGdpPct: number;
    madagascarAgriGdpPct: number;
    moderateTotalMUsd: number;
    extremeTotalMUsd: number;
    deltaVsModerateMUsd: number;
    projectedRicePriceMga: number;
    riceInflationPct: number;
    exposedPopulationM: number;
    rainfallDeficitSouthPct: number;
    coiTotalMUsd: number;
    sadcTotalMUsd: number;
    comesaTotalMUsd: number;
    africaTotalMUsd: number;
    worldYearlyLossBUsd: number;
    worldCumulative2027_2031BUsd: number;
  };
  provinceComparisons: ProvinceScenarioRow[];
  topImpactedDistricts: DistrictScenarioRow[];
  unZoneImpacts: UnZoneScenarioRow[];
}

export const INTENSITY_PRESETS: Record<
  ElNinoIntensity,
  { oniC: number; iodC: number }
> = {
  moderate: { oniC: 1.5, iodC: 0.4 },
  extreme: { oniC: 3.8, iodC: 1.05 },
};

export function computeStressMultiplier(oniC: number, iodC: number): number {
  const oniTerm = (oniC - 1.5) / (3.8 - 1.5);
  const iodTerm = (iodC - 0.4) / (1.05 - 0.4);
  const u = oniTerm * 0.78 + iodTerm * 0.22;
  const raw = 0.55 + u * (1.45 - 0.55);
  return Number(Math.max(0.38, Math.min(1.7, raw)).toFixed(3));
}

export function simulateClimateScenario(
  input: ScenarioSimulationInput,
): ScenarioSimulationResult {
  const { intensity, oniC, iodC, horizonYear, scope, lang, syncState } = input;
  const stressMultiplier = computeStressMultiplier(oniC, iodC);
  const hasLiveScrape = Boolean(syncState?.lastSyncedAtIso);
  const madaLiveMult =
    hasLiveScrape && syncState ? syncState.madagascarFactors.overallLossFactor : 1;
  const africaLiveMult =
    hasLiveScrape && syncState ? syncState.zoneFactors.afrique.gdpLossFactor : 1;

  // Base ML trajectory (s2 has multiplier = 1.00) and bracket endpoints (s1=0.55, s3=1.45)
  const baseS2 = computeEconomicAggregation({
    horizonYear,
    scenario: 's2',
    scope,
    lang,
  });
  const baseS1 = computeEconomicAggregation({
    horizonYear,
    scenario: 's1',
    scope,
    lang,
  });
  const baseS3 = computeEconomicAggregation({
    horizonYear,
    scenario: 's3',
    scope,
    lang,
  });

  const activeScale = stressMultiplier * madaLiveMult;
  const modScale = 0.55 * madaLiveMult;
  const extScale = 1.45 * madaLiveMult;

  const is2027 = horizonYear === 2027;
  const districts = baseS2.districtRows;
  const avgDistrictRiceDelta =
    districts.reduce((s, d) => s + (is2027 ? d.point.rice2027 : d.point.rice2028), 0) /
    Math.max(1, districts.length);
  const avgDistrictMaizeDelta =
    districts.reduce((s, d) => s + (is2027 ? d.point.maize2027 : d.point.maize2028), 0) /
    Math.max(1, districts.length);
  const avgDistrictExportDelta =
    districts.reduce(
      (s, d) => s + (is2027 ? d.point.exportCrop2027 : d.point.exportCrop2028),
      0,
    ) / Math.max(1, districts.length);

  // Calibrated yield sensitivity (2027 stress vs 2028 partial La Niña recovery)
  const riceDeltaPct = Number(
    (avgDistrictRiceDelta * stressMultiplier * (is2027 ? 1 : 0.65)).toFixed(1),
  );
  const maizeDeltaPct = Number(
    (avgDistrictMaizeDelta * stressMultiplier * (is2027 ? 1 : 0.72)).toFixed(1),
  );
  const cassavaDeltaPct = Number(
    ((avgDistrictMaizeDelta * 0.42) * stressMultiplier * (is2027 ? 1 : 0.6)).toFixed(1),
  );
  const exportDeltaPct = Number(
    (avgDistrictExportDelta * stressMultiplier * (is2027 ? 1 : 0.68)).toFixed(1),
  );

  // National production baselines (FOFIFA / FAO Madagascar averages):
  // Rice: 2.45 t/ha (~4,900 kt), Maize: 1.48 t/ha (~420 kt), Cassava: 6.20 t/ha (~2,700 kt), Export: 0.92 t/ha (~185 kt)
  const makeCrop = (
    id: CropYieldPrediction['id'],
    baseYield: number,
    deltaPct: number,
    baseTonnageKt: number,
  ): CropYieldPrediction => {
    const clampedPct = Math.max(-68, Math.min(24, deltaPct));
    const simYield = Number((baseYield * (1 + clampedPct / 100)).toFixed(2));
    const tonnageAtRiskKt = Math.max(
      0,
      Math.round(baseTonnageKt * Math.max(0, -clampedPct / 100)),
    );
    return {
      id,
      baselineYieldTHa: baseYield,
      simulatedYieldTHa: simYield,
      deltaPct: clampedPct,
      tonnageAtRiskKt,
    };
  };

  const crops: CropYieldPrediction[] = [
    makeCrop('rice', 2.45, riceDeltaPct, 4900),
    makeCrop('maize', 1.48, maizeDeltaPct, 420),
    makeCrop('cassava', 6.2, cassavaDeltaPct, 2700),
    makeCrop('export', 0.92, exportDeltaPct, 185),
  ];

  const madagascarDirectMUsd = Number((baseS2.madagascar.directMUsd * activeScale).toFixed(1));
  const madagascarIndirectMUsd = Number(
    (baseS2.madagascar.indirectMUsd * activeScale).toFixed(1),
  );
  const madagascarTotalMUsd = Number((madagascarDirectMUsd + madagascarIndirectMUsd).toFixed(1));
  const moderateTotalMUsd = Number((baseS1.madagascar.totalLossMUsd * madaLiveMult).toFixed(1));
  const extremeTotalMUsd = Number((baseS3.madagascar.totalLossMUsd * madaLiveMult).toFixed(1));

  // Rice price benchmark: 2,550 MGA/kg normal baseline -> 3,200 MGA/kg at S2 (1.0x), ~3,540 MGA/kg at S3 (1.45x)
  const baseRiceMga = 2550;
  const riceInflationPct = Number((25.5 * stressMultiplier * (is2027 ? 1 : 0.45)).toFixed(1));
  const projectedRicePriceMga = Math.round(baseRiceMga * (1 + riceInflationPct / 100));

  // Exposed population benchmark: 3.72M at S2 base -> scales sub-linearly with stressMultiplier
  const exposedPopulationM = Number(
    Math.min(5.8, Math.max(1.6, 3.72 * Math.pow(stressMultiplier, 0.72) * (is2027 ? 1 : 0.74))).toFixed(2),
  );

  const rainfallDeficitSouthPct = Math.round(
    Math.max(-68, Math.min(28, (is2027 ? -34 : 18) * stressMultiplier)),
  );

  const provinceComparisons: ProvinceScenarioRow[] = baseS2.provinceRows.map((p2, idx) => {
    const p1 = baseS1.provinceRows[idx];
    const p3 = baseS3.provinceRows[idx];
    return {
      province: p2.province,
      moderateLossMUsd: Number(((p1?.totalLossMUsd ?? p2.totalLossMUsd * 0.55) * madaLiveMult).toFixed(1)),
      activeLossMUsd: Number((p2.totalLossMUsd * activeScale).toFixed(1)),
      extremeLossMUsd: Number(((p3?.totalLossMUsd ?? p2.totalLossMUsd * 1.45) * madaLiveMult).toFixed(1)),
      gdpPct: Number((p2.gdpImpactPct * activeScale).toFixed(2)),
      agriPct: Number((p2.agriImpactPct * activeScale).toFixed(2)),
    };
  });

  const topImpactedDistricts: DistrictScenarioRow[] = [...districts]
    .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
    .slice(0, 6)
    .map((d) => ({
      district: d.point.district,
      region: d.displayRegion,
      province: d.province,
      waterDeltaPct: Math.round((is2027 ? d.point.water2027 : d.point.water2028) * stressMultiplier),
      riceDeltaPct: Math.round((is2027 ? d.point.rice2027 : d.point.rice2028) * stressMultiplier),
      maizeDeltaPct: Math.round((is2027 ? d.point.maize2027 : d.point.maize2028) * stressMultiplier),
      exportDeltaPct: Math.round(
        (is2027 ? d.point.exportCrop2027 : d.point.exportCrop2028) * stressMultiplier,
      ),
      lossMUsd: Number((d.totalLossMUsd * activeScale).toFixed(2)),
    }));

  const forecastYear = is2027 ? 2027 : 2028;
  const unZoneImpacts: UnZoneScenarioRow[] = UN_ZONE_SUMMARIES.map((z) => {
    const zLive =
      hasLiveScrape && syncState ? syncState.zoneFactors[z.id]?.gdpLossFactor ?? 1 : 1;
    const baseYearLoss = z.yearlyLossBUsd[forecastYear];
    const inflAdd = z.avgInflationAdd[forecastYear];
    return {
      id: z.id,
      nameFr: z.nameFr,
      nameEn: z.nameEn,
      countryCount: z.countryCount,
      activeLossBUsd: Number((baseYearLoss * stressMultiplier * zLive).toFixed(1)),
      moderateLossBUsd: Number((baseYearLoss * 0.55 * zLive).toFixed(1)),
      extremeLossBUsd: Number((baseYearLoss * 1.45 * zLive).toFixed(1)),
      inflationAddPct: Number((inflAdd * (0.55 + stressMultiplier * 0.45)).toFixed(1)),
    };
  });

  const worldYearlyLossBUsd = Number(
    unZoneImpacts.reduce((s, z) => s + z.activeLossBUsd, 0).toFixed(1),
  );
  const worldCumulative2027_2031BUsd = Number(
    (
      UN_ZONE_SUMMARIES.reduce((s, z) => s + z.cumulative2027_2031BUsd, 0) * stressMultiplier
    ).toFixed(0),
  );

  return {
    intensity,
    oniC,
    iodC,
    stressMultiplier,
    horizonYear,
    scope,
    crops,
    gdpModel: {
      madagascarTotalMUsd,
      madagascarDirectMUsd,
      madagascarIndirectMUsd,
      madagascarGdpPct: Number((baseS2.madagascar.gdpPct * activeScale).toFixed(2)),
      madagascarAgriGdpPct: Number((baseS2.madagascar.agriPct * activeScale).toFixed(2)),
      moderateTotalMUsd,
      extremeTotalMUsd,
      deltaVsModerateMUsd: Number((madagascarTotalMUsd - moderateTotalMUsd).toFixed(1)),
      projectedRicePriceMga,
      riceInflationPct,
      exposedPopulationM,
      rainfallDeficitSouthPct,
      coiTotalMUsd: Number((baseS2.blocs.coiTotalMUsd * stressMultiplier * africaLiveMult).toFixed(1)),
      sadcTotalMUsd: Number((baseS2.blocs.sadcTotalMUsd * stressMultiplier * africaLiveMult).toFixed(1)),
      comesaTotalMUsd: Number(
        (baseS2.blocs.comesaTotalMUsd * stressMultiplier * africaLiveMult).toFixed(1),
      ),
      africaTotalMUsd: Number(
        (baseS2.blocs.africaTotalMUsd * stressMultiplier * africaLiveMult).toFixed(1),
      ),
      worldYearlyLossBUsd,
      worldCumulative2027_2031BUsd,
    },
    provinceComparisons,
    topImpactedDistricts,
    unZoneImpacts,
  };
}
