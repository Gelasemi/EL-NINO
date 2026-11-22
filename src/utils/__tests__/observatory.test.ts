import { describe, expect, it } from 'vitest';
import {
  CONTINENT_COMPARISON_6,
  DUPLICATED_195_COUNTRIES,
  UN_ZONE_SUMMARIES,
  WORLD_CLIMATE_ZONES,
  WORLD_LANGUAGES_STATS,
} from '../../data/worldEnso195Data';
import { WORLD_COORDS_BY_ISO2 } from '../../data/worldCoordinates195';
import {
  computeEconomicAggregation,
  formatCurrencyFromMUsd,
  SCENARIO_META_BY_LANG,
} from '../economicAggregation';
import { computeZoneAnalysis } from '../../data/observatoryCalculator';
import { LICENSE_ATTRIBUTION } from '../scientificReportGenerator';
import {
  toCoreLanguage,
  WORLD_ACTION_LABELS,
  WORLD_LANGUAGE_OPTIONS,
  type WorldLanguageCode,
} from '../../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../../i18n/uiTranslations';
import { CORE_LANGUAGE_TOGGLE_OPTIONS } from '../../components/LanguageSwitcher';
import {
  CLIMATIC_ECONOMIC_CACHE_NAME,
  CRITICAL_API_DATASETS,
  CRITICAL_GEO_DATASETS,
  GEO_BOUNDARIES_CACHE_NAME,
  getOfflineCacheStatus,
} from '../offlineDatasetCache';
import { emitPdfDownloadSuccess } from '../pdfToastEvents';
import {
  computeStressMultiplier,
  INTENSITY_PRESETS,
  simulateClimateScenario,
} from '../climateScenarioSimulator';
import { MADAGASCAR_23_REGION_CALENDARS } from '../../data/madagascarCropCalendars';
import { REGION_23_ECONOMIC_BASELINES } from '../../data/ensoData';
import {
  buildEconomicSimulationCsv,
  convertMUsdToCurrencyValue,
  escapeCsvCell,
} from '../economicCsvExport';
import {
  computeAll13ZonesConsolidated,
  computeZoneConsolidatedAnalysis,
  ZONAL_DEFINITIONS,
} from '../zonalEnsoAnalysis';
import { WORLD_195_COUNTRIES } from '../../data/worldEnso195Data';
import {
  buildComparativeVisualReportData,
  buildCooperativeZonalReportPayload,
} from '../zonalImpactComparison';
import {
  CLIMATE_ALERT_ZONES,
  CLIMATE_ALERTS_TIMELINE_EVENTS,
  filterClimateAlertEvents,
  summarizeFilteredTimeline,
  type AlertGeoZoneId,
} from '../climateAlertsTimeline';
import {
  MADAGASCAR_23_REGION_SPECIALIZATIONS,
  MADAGASCAR_6_PROVINCE_SPECIALIZATIONS,
  YEAR_PERIOD_OPTIONS,
} from '../../data/adamSmithAgroData';
import {
  buildAll195CountryAgroSpecializations,
  FORTNIGHT_INTERVAL_DAYS,
  getTopEngineeringPillar,
  inferEnsoPhaseFromOni,
} from '../adamSmithAgroEngine';
import {
  classifyBulletinSeverity,
  getBaselineAgencyBulletins,
  inferBulletinRegion,
  mergeAndSortRssBulletins,
  METEO_RSS_SOURCES,
  parseRssOrAtomXml,
} from '../rssBulletins';
import {
  computeQuizOutcome,
  CROP_RESILIENCE_QUESTIONS,
  filterQuizQuestions,
  QUIZ_TRACK_OPTIONS,
} from '../cropResilienceQuiz';
import { buildExecutivePitchDeckData } from '../pitchDeckSlides';

describe('Madagascar El Niño Observatory — Core Data & Models', () => {
  it('covers all 195 UN countries (193 members + 2 observers) with unique ISO2 and valid 195 coordinates', () => {
    expect(DUPLICATED_195_COUNTRIES).toHaveLength(195);

    const members = DUPLICATED_195_COUNTRIES.filter((c) => c.unStatus === 'member');
    const observers = DUPLICATED_195_COUNTRIES.filter((c) => c.unStatus === 'observer');
    expect(members).toHaveLength(193);
    expect(observers).toHaveLength(2);
    expect(observers.map((o) => o.iso2).sort()).toEqual(['PS', 'VA']);

    const isoSet = new Set(DUPLICATED_195_COUNTRIES.map((c) => c.iso2));
    expect(isoSet.size).toBe(195);

    for (const country of DUPLICATED_195_COUNTRIES) {
      const coord = WORLD_COORDS_BY_ISO2[country.iso2];
      expect(coord, `Missing coords for ${country.iso2}`).toBeDefined();
      expect(coord.lat).toBeGreaterThanOrEqual(-90);
      expect(coord.lat).toBeLessThanOrEqual(90);
      expect(coord.lng).toBeGreaterThanOrEqual(-180);
      expect(coord.lng).toBeLessThanOrEqual(180);
    }
  });

  it('matches UN continent/zone breakdown (54+48+44+33+14+2 = 195), 12 climate zones & 6 continent rows', () => {
    expect(UN_ZONE_SUMMARIES).toHaveLength(6);
    const zoneTotal = UN_ZONE_SUMMARIES.reduce((s, z) => s + z.countryCount, 0);
    expect(zoneTotal).toBe(195);

    const byId = Object.fromEntries(UN_ZONE_SUMMARIES.map((z) => [z.id, z.countryCount]));
    expect(byId.afrique).toBe(54);
    expect(byId.asie).toBe(48);
    expect(byId.europe).toBe(44);
    expect(byId['amerique-latine-caraibes']).toBe(33);
    expect(byId.oceanie).toBe(14);
    expect(byId['amerique-du-nord']).toBe(2);

    expect(WORLD_CLIMATE_ZONES).toHaveLength(12);
    expect(CONTINENT_COMPARISON_6).toHaveLength(6);
    expect(WORLD_LANGUAGES_STATS.length).toBeGreaterThanOrEqual(9);
  });

  it('supports all 9 world languages with complete WorldActionLabels and core fallback mapping', () => {
    expect(WORLD_LANGUAGE_OPTIONS).toHaveLength(9);
    const expectedCodes: WorldLanguageCode[] = ['fr', 'en', 'sw', 'es', 'ar', 'zh', 'pt', 'hi', 'ru'];
    for (const code of expectedCodes) {
      const lbl = WORLD_ACTION_LABELS[code];
      expect(lbl).toBeDefined();
      expect(lbl.pdfSummaryBtn.length).toBeGreaterThan(3);
      expect(lbl.midnightAutoOn.length).toBeGreaterThan(3);
      expect(lbl.scrapeNowBtn.length).toBeGreaterThan(3);
    }
    expect(toCoreLanguage('fr')).toBe('fr');
    expect(toCoreLanguage('sw')).toBe('sw');
    expect(toCoreLanguage('ar')).toBe('en');
    expect(toCoreLanguage('zh')).toBe('en');
  });

  it('computes strictly ordered scenario economic losses (S1 < S2 < S3) with Madagascar province accounting invariance', () => {
    const s1 = computeEconomicAggregation({ horizonYear: 2027, scenario: 's1', scope: 'consolidated119', lang: 'fr' });
    const s2 = computeEconomicAggregation({ horizonYear: 2027, scenario: 's2', scope: 'consolidated119', lang: 'fr' });
    const s3 = computeEconomicAggregation({ horizonYear: 2027, scenario: 's3', scope: 'consolidated119', lang: 'fr' });

    expect(SCENARIO_META_BY_LANG.fr.s1.multiplier).toBeLessThan(SCENARIO_META_BY_LANG.fr.s2.multiplier);
    expect(SCENARIO_META_BY_LANG.fr.s2.multiplier).toBeLessThan(SCENARIO_META_BY_LANG.fr.s3.multiplier);

    expect(s1.madagascar.totalLossMUsd).toBeLessThan(s2.madagascar.totalLossMUsd);
    expect(s2.madagascar.totalLossMUsd).toBeLessThan(s3.madagascar.totalLossMUsd);
    expect(s2.provinceRows).toHaveLength(6);
    expect(s2.regionRows).toHaveLength(23);
    expect(s2.districtRows).toHaveLength(42);

    const sumProv = s2.provinceRows.reduce((s, p) => s + p.totalLossMUsd, 0);
    expect(sumProv).toBeCloseTo(s2.madagascar.totalLossMUsd, 1);

    expect(formatCurrencyFromMUsd(450, 'USD', false, 'fr')).toContain('M $');
    expect(formatCurrencyFromMUsd(1250, 'MGA', false, 'fr')).toContain('Md Ar');
  });

  it('computes zone analyses across Madagascar districts, provinces, and African economies', () => {
    const ambovombe = computeZoneAnalysis({ zoneQuery: 'Ambovombe', year: 2027, scenario: 's2', lang: 'fr' });
    expect(ambovombe.kind).toBe('district');
    expect(ambovombe.zoneName).toContain('Ambovombe');
    expect(ambovombe.metrics.length).toBeGreaterThanOrEqual(4);

    const zambia = computeZoneAnalysis({ zoneQuery: 'Zambie', year: 2027, scenario: 's2', lang: 'en' });
    expect(zambia.kind).toBe('country');
    expect(zambia.metrics.length).toBeGreaterThanOrEqual(4);
  });

  it('preserves M&G Consulting and DG Prince MANANTENASOA attribution across core languages', () => {
    expect(LICENSE_ATTRIBUTION.fr.licenseHolder).toBe('M&G Consulting');
    expect(LICENSE_ATTRIBUTION.fr.directorName).toBe('Prince MANANTENASOA');
    expect(LICENSE_ATTRIBUTION.en.licenseHolder).toBe('M&G Consulting');
    expect(LICENSE_ATTRIBUTION.sw.directorName).toBe('Prince MANANTENASOA');
  });

  it('defines critical climatic, economic, and GeoJSON datasets for Service Worker offline caching', async () => {
    expect(CLIMATIC_ECONOMIC_CACHE_NAME).toBe('climatic-economic-datasets-v1');
    expect(GEO_BOUNDARIES_CACHE_NAME).toBe('geo-boundaries-cache-v1');
    expect(CRITICAL_API_DATASETS).toContain('/api/offline/datasets');
    expect(CRITICAL_API_DATASETS).toContain('/api/climate/live-feed');
    expect(CRITICAL_API_DATASETS).toContain('/api/climate/global-sync/status');
    expect(CRITICAL_API_DATASETS).toContain('/api/climate/rss-bulletins');
    expect(CRITICAL_GEO_DATASETS).toContain('/geo/world-110m.geojson');

    const status = await getOfflineCacheStatus();
    expect(status.totalCriticalEndpoints).toBe(
      CRITICAL_API_DATASETS.length + CRITICAL_GEO_DATASETS.length,
    );
  });

  it('builds structured completion payload when climate PDF download completes', () => {
    const payload = emitPdfDownloadSuccess({
      filename: 'Resume_Climatique_Previsions_M&G_2027_fr.pdf',
      kind: 'summary',
      pagesCount: 3,
      horizonYear: 2027,
      scenario: 's2',
    });

    expect(payload.id).toMatch(/^pdf-/);
    expect(payload.filename).toContain('Resume_Climatique');
    expect(payload.kind).toBe('summary');
    expect(payload.pagesCount).toBe(3);
    expect(payload.horizonYear).toBe(2027);
    expect(payload.scenario).toBe('s2');
    expect(new Date(payload.completedAtIso).getTime()).toBeGreaterThan(0);
  });

  it('simulates real-time Moderate vs Extreme El Niño impacts on agricultural yields and GDP loss models', () => {
    const modMult = computeStressMultiplier(
      INTENSITY_PRESETS.moderate.oniC,
      INTENSITY_PRESETS.moderate.iodC,
    );
    const extMult = computeStressMultiplier(
      INTENSITY_PRESETS.extreme.oniC,
      INTENSITY_PRESETS.extreme.iodC,
    );
    expect(modMult).toBeCloseTo(0.55, 2);
    expect(extMult).toBeCloseTo(1.45, 2);

    const mod = simulateClimateScenario({
      intensity: 'moderate',
      oniC: INTENSITY_PRESETS.moderate.oniC,
      iodC: INTENSITY_PRESETS.moderate.iodC,
      horizonYear: 2027,
      scope: 'consolidated119',
      lang: 'en',
    });
    const ext = simulateClimateScenario({
      intensity: 'extreme',
      oniC: INTENSITY_PRESETS.extreme.oniC,
      iodC: INTENSITY_PRESETS.extreme.iodC,
      horizonYear: 2027,
      scope: 'consolidated119',
      lang: 'en',
    });

    // Extreme El Niño inflicts strictly higher GDP losses & lower agricultural yields than Moderate
    expect(ext.gdpModel.madagascarTotalMUsd).toBeGreaterThan(mod.gdpModel.madagascarTotalMUsd);
    expect(ext.gdpModel.worldYearlyLossBUsd).toBeGreaterThan(mod.gdpModel.worldYearlyLossBUsd);
    expect(ext.gdpModel.projectedRicePriceMga).toBeGreaterThan(mod.gdpModel.projectedRicePriceMga);
    expect(ext.crops[0].simulatedYieldTHa).toBeLessThan(mod.crops[0].simulatedYieldTHa);
    expect(ext.crops[1].simulatedYieldTHa).toBeLessThan(mod.crops[1].simulatedYieldTHa);

    expect(ext.provinceComparisons).toHaveLength(6);
    expect(ext.topImpactedDistricts).toHaveLength(6);
    expect(ext.unZoneImpacts).toHaveLength(6);
    expect(ext.unZoneImpacts.reduce((s, z) => s + z.countryCount, 0)).toBe(195);
  });

  it('covers all 23 Madagascar regions with valid planting and harvest windows for rice, maize, and cassava', () => {
    expect(MADAGASCAR_23_REGION_CALENDARS).toHaveLength(23);
    const baselineRegions = REGION_23_ECONOMIC_BASELINES.map((r) => r.region).sort();
    const calendarRegions = MADAGASCAR_23_REGION_CALENDARS.map((r) => r.region).sort();
    expect(calendarRegions).toEqual(baselineRegions);

    for (const reg of MADAGASCAR_23_REGION_CALENDARS) {
      for (const cropKey of ['rice', 'maize', 'cassava'] as const) {
        const entry = reg.crops[cropKey];
        expect(entry.plantingStartIdx).toBeGreaterThanOrEqual(0);
        expect(entry.plantingEndIdx).toBeGreaterThan(entry.plantingStartIdx);
        expect(entry.harvestStartIdx).toBeGreaterThan(entry.plantingStartIdx);
        expect(entry.harvestEndIdx).toBeGreaterThan(entry.harvestStartIdx);
        expect(entry.harvestEndIdx).toBeLessThanOrEqual(12);
      }
    }
  });

  it('builds a spreadsheet-compatible UTF-8 CSV with national, bloc, province, region, district, and Africa simulated rows', () => {
    const model = computeEconomicAggregation({
      horizonYear: 2027,
      scenario: 's3',
      scope: 'consolidated119',
      lang: 'en',
    });

    const csv = buildEconomicSimulationCsv({
      model,
      currency: 'EUR',
      horizonYear: 2027,
      scenario: 's3',
      scope: 'consolidated119',
      hasLiveScrape: true,
      madagascarLiveFactor: 1.08,
      africaLiveFactor: 1.04,
    });

    expect(csv.content.startsWith('\uFEFF')).toBe(true);
    expect(csv.filename).toBe('madagascar_enso_economic_simulation_2027_s3_consolidated119_EUR.csv');
    // 1 national + 4 blocs + 6 provinces + 23 regions + 42 districts + 21 African zones = 97 rows
    expect(csv.rowCount).toBe(97);

    const lines = csv.content.slice(1).split('\r\n');
    expect(lines).toHaveLength(98);
    expect(lines[0]).toContain('level,entity,parent_or_bloc,horizon_year,scenario');
    expect(lines[1]).toContain('National_Summary');
    expect(lines[1]).toContain('EUR,M EUR');

    expect(convertMUsdToCurrencyValue(100, 'EUR')).toBeCloseTo(92.5, 2);
    expect(convertMUsdToCurrencyValue(100, 'MGA')).toBeCloseTo(455, 2);
    expect(escapeCsvCell('Androy, "Grand Sud"')).toBe('"Androy, ""Grand Sud"""');
    expect(escapeCsvCell('=SUM(A1:A2)')).toBe("'=SUM(A1:A2)");
  });

  it('consolidates all 13 requested geopolitical & geographic zones with 100% valid ISO2 mapping and ordered scenario shocks', () => {
    expect(ZONAL_DEFINITIONS).toHaveLength(13);

    const validIsoSet = new Set(WORLD_195_COUNTRIES.map((c) => c.iso2));
    for (const def of ZONAL_DEFINITIONS) {
      expect(def.memberIso2s.length).toBeGreaterThanOrEqual(2);
      for (const iso2 of def.memberIso2s) {
        expect(validIsoSet.has(iso2), `Invalid ISO2 ${iso2} in zone ${def.id}`).toBe(true);
      }
      expect(def.recommendationsFr.length).toBeGreaterThanOrEqual(4);
      expect(def.recommendationsEn.length).toBeGreaterThanOrEqual(4);
    }

    const zonesS1 = computeAll13ZonesConsolidated({ year: 2027, scenario: 's1' });
    const zonesS2 = computeAll13ZonesConsolidated({ year: 2027, scenario: 's2' });
    const zonesS3 = computeAll13ZonesConsolidated({ year: 2027, scenario: 's3' });
    expect(zonesS2).toHaveLength(13);

    const byId = Object.fromEntries(zonesS2.map((z) => [z.definition.id, z]));
    expect(byId['ocean-indien-coi'].countryCount).toBe(13);
    expect(byId.comesa.countryCount).toBe(21);
    expect(byId.sadc.countryCount).toBe(16);
    expect(byId.asean.countryCount).toBe(11);
    expect(byId.ue.countryCount).toBe(27);
    expect(byId.afrique.countryCount).toBe(54);
    expect(byId.oceanie.countryCount).toBe(14);
    expect(byId['amerique-latine'].countryCount).toBe(20);
    expect(byId.caraibes.countryCount).toBe(13);
    expect(byId['amerique-du-nord'].countryCount).toBe(2);
    expect(byId['europe-est'].countryCount).toBe(17);
    expect(byId['moyen-orient'].countryCount).toBe(16);
    expect(byId.asie.countryCount).toBe(48);

    zonesS2.forEach((z2, idx) => {
      expect(zonesS1[idx].activeLossBUsd).toBeLessThan(z2.activeLossBUsd);
      expect(z2.activeLossBUsd).toBeLessThan(zonesS3[idx].activeLossBUsd);
      expect(z2.trajectory2027_2032).toHaveLength(6);
    });

    const coiReport = computeZoneConsolidatedAnalysis({
      zoneId: 'ocean-indien-coi',
      year: 2027,
      scenario: 's2',
    });
    expect(coiReport.members[0].lossBUsd).toBeGreaterThan(0);
  });

  it('generates comparative visual report metrics comparing intensity, agricultural risk, and economic resilience across selected zones', () => {
    const res = buildComparativeVisualReportData({
      zoneIds: ['ocean-indien-coi', 'sadc', 'asean', 'ue'],
      year: 2027,
      scenario: 's2',
    });

    expect(res.items).toHaveLength(4);
    expect(res.radarMetrics).toHaveLength(5);

    const byId = Object.fromEntries(res.items.map((item) => [item.zoneId, item]));
    for (const item of res.items) {
      expect(item.ensoIntensityIndex).toBeGreaterThanOrEqual(0);
      expect(item.ensoIntensityIndex).toBeLessThanOrEqual(100);
      expect(item.agriRiskScore).toBeGreaterThanOrEqual(0);
      expect(item.agriRiskScore).toBeLessThanOrEqual(100);
      expect(item.economicResilienceScore).toBeGreaterThanOrEqual(0);
      expect(item.economicResilienceScore).toBeLessThanOrEqual(100);
    }

    // SADC faces higher agricultural risk and lower economic resilience than EU-27
    expect(byId.sadc.agriRiskScore).toBeGreaterThan(byId.ue.agriRiskScore);
    expect(byId.ue.economicResilienceScore).toBeGreaterThan(byId.sadc.economicResilienceScore);
    expect(res.mostResilient?.zoneId).toBe('ue');
  });

  it('exposes FR/EN header language switcher options with complete distinct French and English UI translations', () => {
    expect(CORE_LANGUAGE_TOGGLE_OPTIONS.map((o) => o.code)).toEqual(['fr', 'en']);
    expect(toCoreLanguage('fr')).toBe('fr');
    expect(toCoreLanguage('en')).toBe('en');

    expect(UI_TRANSLATIONS.fr.header.langSwitcherAria).not.toBe(
      UI_TRANSLATIONS.en.header.langSwitcherAria,
    );
    expect(WORLD_ACTION_LABELS.fr.reportShort).not.toBe(WORLD_ACTION_LABELS.en.reportShort);
    expect(WORLD_ACTION_LABELS.fr.simNav).not.toBe(WORLD_ACTION_LABELS.en.simNav);
  });

  it('orders El Niño climate alert events chronologically and filters accurately by intensity, zone, and horizon', () => {
    const asc = filterClimateAlertEvents({
      intensity: 'all',
      zone: 'all',
      phase: 'all',
      sortOrder: 'asc',
    });
    const desc = filterClimateAlertEvents({
      intensity: 'all',
      zone: 'all',
      phase: 'all',
      sortOrder: 'desc',
    });

    expect(asc.length).toBe(CLIMATE_ALERTS_TIMELINE_EVENTS.length);
    expect(asc.length).toBeGreaterThanOrEqual(15);
    for (let i = 1; i < asc.length; i += 1) {
      expect(asc[i].dateIso >= asc[i - 1].dateIso).toBe(true);
      expect(desc[i].dateIso <= desc[i - 1].dateIso).toBe(true);
    }

    // Super El Niño filter must return only events with intensity === 'super' & ONI >= 2.0
    const supers = filterClimateAlertEvents({
      intensity: 'super',
      zone: 'all',
      phase: 'all',
    });
    expect(supers.length).toBeGreaterThanOrEqual(6);
    for (const ev of supers) {
      expect(ev.intensity).toBe('super');
      expect(ev.oniPeakC).toBeGreaterThanOrEqual(2.0);
    }

    // Every defined geographic zone filter must yield multiple chronological alerts
    for (const z of CLIMATE_ALERT_ZONES) {
      if (z.id === 'all') continue;
      const byZone = filterClimateAlertEvents({
        intensity: 'all',
        zone: z.id as AlertGeoZoneId,
        phase: 'all',
      });
      expect(byZone.length, `Expected alerts for zone ${z.id}`).toBeGreaterThanOrEqual(4);
      for (const ev of byZone) {
        expect(ev.zones).toContain(z.id);
      }
    }

    // Combined filter + summary stats
    const madagascarUpcoming = filterClimateAlertEvents({
      intensity: 'super',
      zone: 'madagascar',
      phase: 'upcoming',
    });
    const stats = summarizeFilteredTimeline(madagascarUpcoming);
    expect(stats.total).toBeGreaterThanOrEqual(2);
    expect(stats.upcomingCount).toBe(stats.total);
    expect(stats.maxOniC).toBeCloseTo(4.1, 1);
  });

  it('provides Adam Smith year-round agricultural specialization & engineering prescriptions for 6 Madagascar provinces, 23 regions, 54 African countries, and 195 UN countries', () => {
    expect(FORTNIGHT_INTERVAL_DAYS).toBe(15);
    expect(YEAR_PERIOD_OPTIONS).toHaveLength(5);
    expect(MADAGASCAR_6_PROVINCE_SPECIALIZATIONS).toHaveLength(6);
    expect(MADAGASCAR_23_REGION_SPECIALIZATIONS).toHaveLength(23);

    const baselineRegions = REGION_23_ECONOMIC_BASELINES.map((r) => r.region).sort();
    const specRegions = MADAGASCAR_23_REGION_SPECIALIZATIONS.map((r) => r.region).sort();
    expect(specRegions).toEqual(baselineRegions);

    for (const reg of MADAGASCAR_23_REGION_SPECIALIZATIONS) {
      expect(reg.engineering.controlledIrrigation).toBeGreaterThan(0);
      expect(reg.engineering.greenhouses).toBeGreaterThan(0);
      expect(reg.engineering.damsAndReservoirs).toBeGreaterThan(0);
      expect(reg.quarters['q4-oct-dec'].elNinoCropsFr.length).toBeGreaterThan(5);
      expect(reg.quarters['q1-jan-mar'].laNinaCropsEn.length).toBeGreaterThan(5);
      expect(reg.quarters['q2-apr-jun'].practiceFr.length).toBeGreaterThan(5);
      expect(reg.quarters['q3-jul-sep'].practiceEn.length).toBeGreaterThan(5);
    }

    const all195 = buildAll195CountryAgroSpecializations({ afrique: -25 });
    expect(all195).toHaveLength(195);
    const africa54 = all195.filter((c) => c.country.unZone === 'afrique');
    expect(africa54).toHaveLength(54);

    for (const item of all195) {
      expect(item.adamSmithAdvantageFr.length).toBeGreaterThan(5);
      expect(item.primaryInfraEn.length).toBeGreaterThan(5);
      const top = getTopEngineeringPillar(item.engineering, 'fr');
      expect(top.score).toBeGreaterThanOrEqual(20);
      expect(top.score).toBeLessThanOrEqual(99);
    }

    expect(inferEnsoPhaseFromOni(3.5)).toBe('el-nino');
    expect(inferEnsoPhaseFromOni(-1.2)).toBe('la-nina');
    expect(inferEnsoPhaseFromOni(0.1)).toBe('neutral');
  });

  it('aggregates live ZonalImpactDashboard state into a printable offline PDF report payload for agricultural cooperatives', () => {
    const dashboard = buildComparativeVisualReportData({
      zoneIds: ['ocean-indien-coi', 'sadc', 'asean'],
      year: 2028,
      scenario: 's3',
      liveFactor: 1.07,
    });

    const enPayload = buildCooperativeZonalReportPayload({
      items: dashboard.items,
      year: 2028,
      scenario: 's3',
      currency: 'EUR',
      lang: 'en',
      oniObservedC: 3.7,
      liveFactor: 1.07,
      hasLiveScrape: true,
    });

    expect(enPayload.totalZones).toBe(3);
    expect(enPayload.totalStates).toBe(13 + 16 + 11);
    expect(enPayload.totalPopM).toBeGreaterThan(0);
    expect(enPayload.totalAtRiskPopM).toBeGreaterThan(0);
    expect(enPayload.oniObservedC).toBe(3.7);
    expect(enPayload.liveFactor).toBe(1.07);
    expect(enPayload.hasLiveScrape).toBe(true);
    expect(enPayload.totalActiveLossFormatted).toContain('B EUR');
    expect(enPayload.highestIntensityLabel).toContain('/100');
    expect(enPayload.highestAgriRiskLabel).toContain('/100');
    expect(enPayload.mostResilientLabel).toContain('/100');

    expect(enPayload.zoneBriefs).toHaveLength(3);
    for (const brief of enPayload.zoneBriefs) {
      expect(brief.commodities.length).toBeGreaterThan(5);
      expect(brief.agriSummary.length).toBeGreaterThan(15);
      expect(brief.actions.length).toBeGreaterThanOrEqual(3);
    }

    expect(enPayload.offlineChecklist).toHaveLength(4);
    enPayload.offlineChecklist.forEach((line) => expect(line.startsWith('[ ] ')).toBe(true));

    const frPayload = buildCooperativeZonalReportPayload({
      items: dashboard.items,
      year: 2028,
      scenario: 's3',
      currency: 'MGA',
      lang: 'fr',
    });
    expect(frPayload.totalActiveLossFormatted).toContain('T Ar');
    expect(frPayload.offlineChecklist).toHaveLength(4);
    frPayload.offlineChecklist.forEach((line) => expect(line.startsWith('[ ] ')).toBe(true));
    expect(frPayload.offlineChecklist[0]).toContain('Semences');
  });

  it('parses WMO RSS 2.0 and NOAA Atom meteorological bulletins, classifies severity, and merges real-time feeds', () => {
    const sampleRssXml = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0"><channel>
        <item>
          <title><![CDATA[WMO Red Alert: Super El Niño & Cyclone Watch in Madagascar SWIO]]></title>
          <description><![CDATA[<p>Severe drought deficit in Ambovombe &amp; heavy rainfall forecast in SAVA.</p>]]></description>
          <link>https://wmo.int/media/news/super-el-nino-2026</link>
          <pubDate>Sat, 21 Nov 2026 18:00:00 GMT</pubDate>
        </item>
        <item>
          <title>Seasonal rainfall advisory for East Africa COMESA</title>
          <description>Elevated flood risk warning along the Rift basin.</description>
          <link>https://wmo.int/media/news/comesa-flood-watch</link>
          <pubDate>Fri, 20 Nov 2026 12:00:00 GMT</pubDate>
        </item>
      </channel></rss>`;

    const wmoItems = parseRssOrAtomXml(sampleRssXml, METEO_RSS_SOURCES[0], 5);
    expect(wmoItems).toHaveLength(2);
    expect(wmoItems[0].isLiveXml).toBe(true);
    expect(wmoItems[0].severity).toBe('critical');
    expect(wmoItems[0].regionTag).toBe('Madagascar · SWIO');
    expect(wmoItems[0].summary).toContain('Ambovombe & heavy rainfall');
    expect(wmoItems[1].severity).toBe('high');
    expect(wmoItems[1].regionTag).toBe('East Africa · COMESA');

    const sampleAtomXml = `<?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <title>NOAA CPC Extreme El Niño SST Advisory</title>
          <summary>Niño 3.4 anomalies remain elevated across the equatorial Pacific.</summary>
          <link href="https://www.cpc.ncep.noaa.gov/enso-2026" rel="alternate" />
          <updated>2026-11-21T20:00:00Z</updated>
        </entry>
      </feed>`;

    const atomItems = parseRssOrAtomXml(sampleAtomXml, METEO_RSS_SOURCES[2], 5);
    expect(atomItems).toHaveLength(1);
    expect(atomItems[0].link).toBe('https://www.cpc.ncep.noaa.gov/enso-2026');
    expect(atomItems[0].severity).toBe('critical');

    const merged = mergeAndSortRssBulletins([
      ...getBaselineAgencyBulletins(),
      ...wmoItems,
      ...atomItems,
      ...wmoItems, // duplicate should be deduped
    ]);
    expect(merged.length).toBe(7);
    expect(merged[0].isLiveXml).toBe(true);
    expect(classifyBulletinSeverity('Routine solar irradiance monitoring')).toBe('watch');
    expect(inferBulletinRegion('SADC Southern Africa drought update', 'Global')).toBe(
      'SADC · SW Indian Ocean',
    );
  });

  it('scores cooperative manager Crop Resilience Quiz questions accurately across regional tracks', () => {
    expect(QUIZ_TRACK_OPTIONS).toHaveLength(4);
    expect(CROP_RESILIENCE_QUESTIONS).toHaveLength(8);

    for (const q of CROP_RESILIENCE_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
      expect(q.explanationFr.length).toBeGreaterThan(20);
      expect(q.explanationEn.length).toBeGreaterThan(20);
      expect(q.cooperativeActionFr.length).toBeGreaterThan(15);
      expect(q.cooperativeActionEn.length).toBeGreaterThan(15);
    }

    const grandSudQs = filterQuizQuestions('grand-sud-west');
    expect(grandSudQs.length).toBeGreaterThanOrEqual(3);

    const perfectAnswers: Record<string, number> = {};
    grandSudQs.forEach((q) => {
      perfectAnswers[q.id] = q.correctIndex;
    });
    const masterOutcome = computeQuizOutcome(grandSudQs, perfectAnswers);
    expect(masterOutcome.scorePct).toBe(100);
    expect(masterOutcome.tier).toBe('master');

    const partialAnswers: Record<string, number> = {};
    grandSudQs.forEach((q, idx) => {
      partialAnswers[q.id] = idx < 2 ? q.correctIndex : (q.correctIndex + 1) % 4;
    });
    const pracOutcome = computeQuizOutcome(grandSudQs, partialAnswers);
    expect(pracOutcome.tier).toBe('practitioner');

    const emptyOutcome = computeQuizOutcome(grandSudQs, {});
    expect(emptyOutcome.answeredCount).toBe(0);
    expect(emptyOutcome.scorePct).toBe(0);
    expect(emptyOutcome.tier).toBe('apprentice');
  });

  it('builds a 7-slide ministerial pitch deck backed by real provincial and zonal metrics', () => {
    const deck = buildExecutivePitchDeckData({ oniObservedC: 3.5, liveFeedsCount: 3 });

    expect(deck.slides).toHaveLength(7);
    expect(deck.slides.map((s) => s.slideNumber)).toEqual(['01', '02', '03', '04', '05', '06', '07']);

    for (const slide of deck.slides) {
      expect(slide.titleFr.length).toBeGreaterThan(10);
      expect(slide.titleEn.length).toBeGreaterThan(10);
      expect(slide.subtitleFr.length).toBeGreaterThan(15);
      expect(slide.subtitleEn.length).toBeGreaterThan(15);
      expect(slide.bulletsFr.length).toBeGreaterThanOrEqual(3);
      expect(slide.bulletsEn.length).toBeGreaterThanOrEqual(3);
      expect(slide.metrics).toHaveLength(3);
      expect(slide.speakerNoteFr.length).toBeGreaterThan(20);
      expect(slide.speakerNoteEn.length).toBeGreaterThan(20);
    }

    expect(deck.provinceLossChart).toHaveLength(6);
    for (const row of deck.provinceLossChart) {
      expect(row.secondary).toBeGreaterThan(row.primary);
    }

    expect(deck.blocComparisonChart.map((b) => b.code)).toEqual([
      'COI / IO',
      'SADC',
      'COMESA',
      'AFR-54',
      'ASEAN',
      'UE / EU-27',
    ]);
    for (const bloc of deck.blocComparisonChart) {
      expect(bloc.intensity).toBeGreaterThanOrEqual(0);
      expect(bloc.intensity).toBeLessThanOrEqual(100);
      expect(bloc.agriRisk).toBeGreaterThanOrEqual(0);
      expect(bloc.agriRisk).toBeLessThanOrEqual(100);
      expect(bloc.resilience).toBeGreaterThanOrEqual(0);
      expect(bloc.resilience).toBeLessThanOrEqual(100);
    }

    expect(deck.madagascarS3MUsd).toBeGreaterThan(deck.madagascarS2MUsd);
  });
});
