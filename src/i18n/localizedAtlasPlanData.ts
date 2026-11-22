import type { LanguageCode } from './LanguageContext.tsx';
import {
  ATLAS_7_DOMAINS,
  ATLAS_23_REGIONS,
  TEMPORAL_OUTLOOK_2027_2028,
  ATLAS_9_SECTORS,
  PREPAREDNESS_5_AXES,
  MONTHLY_INDICATORS_9,
  ATLAS_DELIVERABLES,
  ATLAS_EXTERNAL_SOURCES,
  NATIONAL_BASELINE_INDICATORS,
  STRATEGIC_SIX_QUESTIONS,
  PROGRAM_8_COMPONENTS,
  PROGRAM_8_OBJECTIVES,
  DISTRICT_DB_SCHEMA_20,
  RISK_SCORING_DIMENSIONS,
  RISK_ANALYTICAL_CLASSES,
  TERRITORIAL_GROUPS_ABCD,
  PILOT_DISTRICTS_12,
  EIGHT_VALUE_CHAINS,
  THREE_SCENARIOS,
  AMBOVOMBE_FICHE_TEMPLATE,
  BUDGET_8_COMPONENTS,
  BUDGET_UNIT_LINES,
  FINANCIAL_INDICATORS_7,
  DONOR_PARTNERS_5,
  GOVERNANCE_PYRAMID,
  GOVERNANCE_13_ACTORS,
  IMPLEMENTATION_PHASES_6,
  NATIONAL_KPI_10,
  DASHBOARD_TECH_STACK,
  INSTITUTIONAL_DATA_GAPS_12,
  FINAL_DELIVERABLES_6,
  BUILD_SEQUENCE_8,
  INITIAL_NGO_REGISTRY_SAMPLE,
  type AtlasRegionEntry,
  type TemporalWindowEntry,
  type AtlasSectorImpact,
  type PreparednessAxis,
  type MonthlyIndicatorEntry,
  type PilotDistrictPreset,
  type BudgetUnitLine,
  type NgoInterventionEntry,
} from '../data/ensoData.ts';

const ATLAS_7_DOMAINS_TR: Record<Exclude<LanguageCode, 'fr'>, { domain: string; consequences: string }[]> = {
  en: [
    { domain: 'Rainfall', consequences: 'Regional rainfall deficits or erratic storm bursts' },
    { domain: 'Agriculture', consequences: 'Delayed sowing, yield declines, and harvest losses' },
    { domain: 'Water', consequences: 'Falling reservoir reserves and seasonal river drying' },
    { domain: 'Livestock', consequences: 'Degraded pastures and water shortages for cattle' },
    { domain: 'Health', consequences: 'Malnutrition, waterborne disease, and heat-stress hazards' },
    { domain: 'Economy', consequences: 'Rising staple food prices and falling rural farm incomes' },
    { domain: 'Infrastructure', consequences: 'Flood hazards, soil erosion, and feeder road washouts' },
  ],
  sw: [
    { domain: 'Mvua', consequences: 'Upungufu wa mvua au mvua zisizotabirika kikanda' },
    { domain: 'Kilimo', consequences: 'Kuchelewa kupanda, kushuka kwa mavuno na hasara' },
    { domain: 'Maji', consequences: 'Kupungua kwa akiba na kukauka kwa mito' },
    { domain: 'Mifugo', consequences: 'Uharibifu wa malisho na uhaba wa maji kwa mifugo' },
    { domain: 'Afya', consequences: 'Utapiamlo, magonjwa ya maji na msongo wa joto' },
    { domain: 'Uchumi', consequences: 'Kupanda kwa bei ya chakula na kupungua kwa kipato' },
    { domain: 'Miundombinu', consequences: 'Mafuriko, mmomonyoko na uharibifu wa barabara' },
  ],
};

export function getLocalizedAtlas7Domains(lang: LanguageCode) {
  return lang === 'fr' ? ATLAS_7_DOMAINS : ATLAS_7_DOMAINS_TR[lang];
}

const ATLAS_REGIONS_TR: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<number, Partial<AtlasRegionEntry>>
> = {
  en: {
    1: { groupLabel: 'Grand Sud', priorityRank: 'Priority 1', dominantRisk: 'Very High – Drought', vigilanceLevel: 'Très élevé', possibleEffects: 'Water shortage, crop failures, pasture degradation' },
    2: { groupLabel: 'Grand Sud', priorityRank: 'Priority 1', dominantRisk: 'Very High in South & West', vigilanceLevel: 'Très élevé', possibleEffects: 'Agricultural drought, harvest drop, water stress' },
    3: { groupLabel: 'Grand Sud', priorityRank: 'Priority 1', dominantRisk: 'Very High', vigilanceLevel: 'Très élevé', possibleEffects: 'Rainfall deficit, lower crop output, drinking water access strain' },
    4: { groupLabel: 'Grand Sud', priorityRank: 'Priority 1', dominantRisk: 'High in South', vigilanceLevel: 'Élevé', possibleEffects: 'Crop disruption, alternating dry spells and excess rains' },
    5: { groupLabel: 'Grand Sud', priorityRank: 'Priority 1', dominantRisk: 'High', vigilanceLevel: 'Élevé', possibleEffects: 'Pasture degradation, water stress, yield declines' },
    6: { groupLabel: 'Grand Sud', priorityRank: 'Priority 1', dominantRisk: 'High to Moderate', vigilanceLevel: 'Élevé', possibleEffects: 'Agricultural drought, reduced water availability, extreme heatwaves' },
    7: { groupLabel: 'South-East & East', priorityRank: 'Priority 2', dominantRisk: 'High – Localized heavy rains', vigilanceLevel: 'Élevé', possibleEffects: 'Flooding, landslides, lowland rice disruption' },
    8: { groupLabel: 'South-East & East', priorityRank: 'Priority 2', dominantRisk: 'High', vigilanceLevel: 'Élevé', possibleEffects: 'Excess rainfall, river floods, soil erosion' },
    9: { groupLabel: 'South-East & East', priorityRank: 'Priority 2', dominantRisk: 'High', vigilanceLevel: 'Élevé', possibleEffects: 'Flooding, road/port damage and crop losses' },
    10: { groupLabel: 'South-East & East', priorityRank: 'Priority 2', dominantRisk: 'High', vigilanceLevel: 'Élevé', possibleEffects: 'Excess moisture, cash crop disruption, valley flooding' },
    11: { groupLabel: 'South-East & East', priorityRank: 'Priority 2', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Dry/wet swings creating irrigation risks for Lake Alaotra rice' },
    12: { groupLabel: 'North & North-West', priorityRank: 'Priority 2', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Heavy localized rains, coastal flooding, daytime heat' },
    13: { groupLabel: 'North & North-West', priorityRank: 'Priority 2', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Vanilla, coffee and rice flowering/curing disruption' },
    14: { groupLabel: 'North & North-West', priorityRank: 'Priority 2', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Rainfall variability, flash floods and farm disruption' },
    15: { groupLabel: 'North & North-West', priorityRank: 'Priority 2', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Heat stress, localized drought and seasonal inundation' },
    16: { groupLabel: 'North & North-West', priorityRank: 'Priority 2', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'River floods, erosion and crop calendar delays' },
    17: { groupLabel: 'North & North-West', priorityRank: 'Priority 2', dominantRisk: 'High', vigilanceLevel: 'Élevé', possibleEffects: 'Potential rainfall deficit, water stress and extreme heat' },
    18: { groupLabel: 'Central Highlands', priorityRank: 'Priority 3', dominantRisk: 'Moderate', vigilanceLevel: 'Modéré', possibleEffects: 'Erratic rains, surface runoff and urban stormwater flooding' },
    19: { groupLabel: 'Central Highlands', priorityRank: 'Priority 3', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Sowing disruption, water stress and slope erosion' },
    20: { groupLabel: 'Central Highlands', priorityRank: 'Priority 3', dominantRisk: 'Moderate', vigilanceLevel: 'Modéré', possibleEffects: 'Rainfall variability and moderate yield declines' },
    21: { groupLabel: 'Central Highlands', priorityRank: 'Priority 3', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Localized dry spells, erosion and intense storm bursts' },
    22: { groupLabel: 'Central Highlands', priorityRank: 'Priority 3', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Precipitation irregularity and terraced rice disruption' },
    23: { groupLabel: 'Central Highlands', priorityRank: 'Priority 3', dominantRisk: 'Moderate to High', vigilanceLevel: 'Modéré à élevé', possibleEffects: 'Delayed planting, water stress and pasture degradation' },
  },
  sw: {
    1: { groupLabel: 'Kusini Kuu', priorityRank: 'Kipaumbele 1', dominantRisk: 'Juu Sana – Ukame', possibleEffects: 'Uhaba wa maji, hasara ya mazao, uharibifu wa malisho' },
    2: { groupLabel: 'Kusini Kuu', priorityRank: 'Kipaumbele 1', dominantRisk: 'Juu Sana Kusini & Magharibi', possibleEffects: 'Ukame wa kilimo, kupungua kwa mavuno, uhaba wa maji' },
    3: { groupLabel: 'Kusini Kuu', priorityRank: 'Kipaumbele 1', dominantRisk: 'Juu Sana', possibleEffects: 'Upungufu wa mvua, kupungua kwa uzalishaji, shida ya maji safi' },
    4: { groupLabel: 'Kusini Kuu', priorityRank: 'Kipaumbele 1', dominantRisk: 'Juu Kusini', possibleEffects: 'Kuvurugika kwa mazao, ukame na mafuriko ya msimu' },
    5: { groupLabel: 'Kusini Kuu', priorityRank: 'Kipaumbele 1', dominantRisk: 'Juu', possibleEffects: 'Uharibifu wa malisho, uhaba wa maji, kushuka kwa mavuno' },
    6: { groupLabel: 'Kusini Kuu', priorityRank: 'Kipaumbele 1', dominantRisk: 'Juu hadi Wastani', possibleEffects: 'Ukame wa kilimo, kupungua kwa maji, joto kali' },
    7: { groupLabel: 'Kusini-Mashariki & Mash.', priorityRank: 'Kipaumbele 2', dominantRisk: 'Juu – Mvua kali za muda', possibleEffects: 'Mafuriko, maporomoko ya ardhi, athari kwa mpunga' },
    8: { groupLabel: 'Kusini-Mashariki & Mash.', priorityRank: 'Kipaumbele 2', dominantRisk: 'Juu', possibleEffects: 'Mvua za ziada, mafuriko ya mito, mmomonyoko' },
    9: { groupLabel: 'Kusini-Mashariki & Mash.', priorityRank: 'Kipaumbele 2', dominantRisk: 'Juu', possibleEffects: 'Mafuriko, uharibifu wa barabara na mazao' },
    10: { groupLabel: 'Kusini-Mashariki & Mash.', priorityRank: 'Kipaumbele 2', dominantRisk: 'Juu', possibleEffects: 'Mvua nyingi, athari kwa mazao ya biashara, mafuriko' },
    11: { groupLabel: 'Kusini-Mashariki & Mash.', priorityRank: 'Kipaumbele 2', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Vipindi vya ukame na mvua nyingi vinavyohatarisha mpunga' },
    12: { groupLabel: 'Kaskazini & KM', priorityRank: 'Kipaumbele 2', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Mvua kubwa za muda, mafuriko, joto kali' },
    13: { groupLabel: 'Kaskazini & KM', priorityRank: 'Kipaumbele 2', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Kuvurugika kwa kilimo cha vanilla, kahawa na mpunga' },
    14: { groupLabel: 'Kaskazini & KM', priorityRank: 'Kipaumbele 2', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Mabadiliko ya mvua, mafuriko na hatari za kilimo' },
    15: { groupLabel: 'Kaskazini & KM', priorityRank: 'Kipaumbele 2', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Joto kali, ukame wa muda na mafuriko' },
    16: { groupLabel: 'Kaskazini & KM', priorityRank: 'Kipaumbele 2', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Mafuriko, mmomonyoko na ucheleweshaji wa mazao' },
    17: { groupLabel: 'Kaskazini & KM', priorityRank: 'Kipaumbele 2', dominantRisk: 'Juu', possibleEffects: 'Upungufu wa mvua, uhaba wa maji na joto kali' },
    18: { groupLabel: 'Nyanda za Juu za Kati', priorityRank: 'Kipaumbele 3', dominantRisk: 'Wastani', possibleEffects: 'Mvua zisizo za kawaida na mafuriko ya mijini' },
    19: { groupLabel: 'Nyanda za Juu za Kati', priorityRank: 'Kipaumbele 3', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Kuchelewa kupanda, uhaba wa maji na mmomonyoko' },
    20: { groupLabel: 'Nyanda za Juu za Kati', priorityRank: 'Kipaumbele 3', dominantRisk: 'Wastani', possibleEffects: 'Kubadilika kwa mvua na kupungua kwa mavuno' },
    21: { groupLabel: 'Nyanda za Juu za Kati', priorityRank: 'Kipaumbele 3', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Ukame wa eneo, mmomonyoko na mvua kali' },
    22: { groupLabel: 'Nyanda za Juu za Kati', priorityRank: 'Kipaumbele 3', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Mvua zisizotabirika na kuathirika kwa mpunga' },
    23: { groupLabel: 'Nyanda za Juu za Kati', priorityRank: 'Kipaumbele 3', dominantRisk: 'Wastani hadi Juu', possibleEffects: 'Kuchelewa kupanda, uhaba wa maji na malisho' },
  },
};

export function getLocalizedAtlas23Regions(lang: LanguageCode): AtlasRegionEntry[] {
  if (lang === 'fr') return ATLAS_23_REGIONS;
  const dict = ATLAS_REGIONS_TR[lang];
  return ATLAS_23_REGIONS.map((r) => ({ ...r, ...(dict[r.number] ?? {}) }));
}

const TEMPORAL_TR: Record<Exclude<LanguageCode, 'fr'>, Partial<TemporalWindowEntry>[]> = {
  en: [
    { period: 'January – March 2027', phaseLabel: 'Initial shock & high heat', summary: 'Water deficit risk in the South, extreme temperatures and agricultural disruption. Localized flood risks elsewhere.' },
    { period: 'April – June 2027', phaseLabel: 'Harvest check & stock strain', summary: 'Post-harvest assessments, dwindling household reserves, and difficulty recovering farm incomes.' },
    { period: 'July – September 2027', phaseLabel: 'Early Grand Sud lean season', summary: 'Difficult early lean season in the Grand Sud with severe pressure on food and water supplies.' },
    { period: 'October – December 2027', phaseLabel: 'New agricultural season onset', summary: 'Next planting season: onset timing and vigor depend on evolving 2027 ocean-atmosphere conditions.' },
    { period: 'January – March 2028', phaseLabel: '2027–2028 Lean Season (FEWS NET Peak)', summary: 'If 2027–2028 rains fall short, agricultural and food hardship could persist and hit a critical peak.' },
    { period: 'April – June 2028', phaseLabel: 'Recovery window', summary: 'Potential harvest rebound if rainfall normalizes and surface water reserves replenish.' },
    { period: 'July – December 2028', phaseLabel: 'Consolidation & market watch', summary: 'Ongoing monitoring of the 2028–2029 season, water tables, staple prices, and ENSO phase.' },
  ],
  sw: [
    { period: 'Januari – Machi 2027', phaseLabel: 'Mshtuko wa awali & joto kali', summary: 'Hatari ya upungufu wa maji Kusini, joto kali na athari za kilimo. Mafuriko ya muda maeneo mengine.' },
    { period: 'Aprili – Juni 2027', phaseLabel: 'Tathmini ya mavuno & akiba', summary: 'Tathmini ya mavuno, kupungua kwa akiba ya chakula na ugumu wa kurejesha kipato cha wakulima.' },
    { period: 'Julai – Septemba 2027', phaseLabel: 'Uhaba wa mapema Kusini Kuu', summary: 'Kipindi kigumu cha uhaba wa mapema Kusini Kuu pamoja na shinikizo kwa chakula na maji.' },
    { period: 'Oktoba – Desemba 2027', phaseLabel: 'Mwanzo wa msimu mpya', summary: 'Msimu mpya wa kilimo: ubora wake utategemea mabadiliko ya bahari na hali ya hewa ya 2027.' },
    { period: 'Januari – Machi 2028', phaseLabel: 'Kilele cha Uhaba 2027–2028', summary: 'Iwapo mvua za 2027–2028 zitapungua, uhaba wa chakula unaweza kufikia kilele hatari.' },
    { period: 'Aprili – Juni 2028', phaseLabel: 'Dirisha la ahueni', summary: 'Uwezekano wa mavuno kurejea iwapo mvua zitakuwa nzuri na vyanzo vya maji vitajaa.' },
    { period: 'Julai – Desemba 2028', phaseLabel: 'Uimarishaji & ufuatiliaji wa soko', summary: 'Ufuatiliaji endelevu wa msimu mpya, rasilimali za maji na bei za vyakula.' },
  ],
};

export function getLocalizedTemporalOutlook(lang: LanguageCode): TemporalWindowEntry[] {
  if (lang === 'fr') return TEMPORAL_OUTLOOK_2027_2028;
  const tr = TEMPORAL_TR[lang];
  return TEMPORAL_OUTLOOK_2027_2028.map((w, i) => ({ ...w, ...(tr[i] ?? {}) }));
}

const ATLAS_SECTORS_TR: Record<Exclude<LanguageCode, 'fr'>, AtlasSectorImpact[]> = {
  en: [
    { sector: 'Agriculture', consequences: 'Yield drops, delayed sowing, harvest failure', priorityZones: 'Grand Sud, Highlands' },
    { sector: 'Livestock', consequences: 'Pasture degradation, water shortages, declining fodder', priorityZones: 'Androy, Anosy, Ihorombe, Atsimo-Andrefana' },
    { sector: 'Rice Cultivation', consequences: 'Calendar disruption, water deficit or flash flooding', priorityZones: 'Alaotra-Mangoro, Sofia, East Coast' },
    { sector: 'Drinking Water', consequences: 'Aquifer drawdown and urban/rural supply strain', priorityZones: 'Androy, Anosy, Atsimo-Andrefana' },
    { sector: 'Health', consequences: 'Child malnutrition, waterborne illness & heat stress', priorityZones: 'Grand Sud and floodplains' },
    { sector: 'Transport', consequences: 'Washed-out roads, damaged bridges, rural isolation', priorityZones: 'East, South-East, North' },
    { sector: 'Energy', consequences: 'Strain on hydropower reservoirs and grid output', priorityZones: 'Highlands & hydro-dependent corridors' },
    { sector: 'Commerce', consequences: 'Rising food prices and logistics disruptions', priorityZones: 'Nationwide' },
    { sector: 'Fisheries', consequences: 'Marine ecosystem shifts and reef/tuna variability', priorityZones: 'South, West & East seaboards' },
  ],
  sw: [
    { sector: 'Kilimo', consequences: 'Kushuka kwa mavuno, kuchelewa kupanda, kupotea kwa mazao', priorityZones: 'Kusini Kuu, Nyanda za Juu' },
    { sector: 'Mifugo', consequences: 'Uharibifu wa malisho, uhaba wa maji na chakula cha mifugo', priorityZones: 'Androy, Anosy, Ihorombe, Atsimo-Andrefana' },
    { sector: 'Kilimo cha Mpunga', consequences: 'Kuvurugika kwa kalenda, uhaba au ziada ya maji', priorityZones: 'Alaotra-Mangoro, Sofia, Mashariki' },
    { sector: 'Maji Safi', consequences: 'Kupungua kwa akiba za maji na shida ya usambazaji', priorityZones: 'Androy, Anosy, Atsimo-Andrefana' },
    { sector: 'Afya', consequences: 'Utapiamlo, magonjwa ya maji na msongo wa joto', priorityZones: 'Kusini Kuu na maeneo ya mafuriko' },
    { sector: 'Usafiri', consequences: 'Barabara kukatika, kuharibika kwa madaraja', priorityZones: 'Mashariki, Kusini-Mashariki, Kaskazini' },
    { sector: 'Nishati', consequences: 'Shinikizo kwa mabwawa ya umeme wa maji', priorityZones: 'Nyanda za Juu na miji mikubwa' },
    { sector: 'Biashara', consequences: 'Kupanda kwa bei za chakula na vikwazo vya usafirishaji', priorityZones: 'Nchi nzima' },
    { sector: 'Uvuvi', consequences: 'Mabadiliko ya mifumo ya bahari na samaki', priorityZones: 'Pwani ya Kusini, Magharibi & Mashariki' },
  ],
};

export function getLocalizedAtlas9Sectors(lang: LanguageCode): AtlasSectorImpact[] {
  return lang === 'fr' ? ATLAS_9_SECTORS : ATLAS_SECTORS_TR[lang];
}

const PREPAREDNESS_TR: Record<Exclude<LanguageCode, 'fr'>, Partial<PreparednessAxis>[]> = {
  en: [
    {
      axisNumber: 'Axis 1',
      title: 'Food Security',
      actions: [
        'Build strategic food grain reserves',
        'Support drought-resilient seed multipliers',
        'Diversify household food crops',
        'Monitor rice, maize, and cassava market prices',
      ],
    },
    {
      axisNumber: 'Axis 2',
      title: 'Water Management',
      actions: [
        'Rehabilitate rural hydraulic schemes and boreholes',
        'Protect springs and upper catchment watersheds',
        'Expand community water storage tanks',
        'Monitor groundwater levels and river reserves',
      ],
    },
    {
      axisNumber: 'Axis 3',
      title: 'Livestock Protection',
      actions: [
        'Monitor seasonal pasture condition',
        'Promote sustainable fodder and crop-residue banking',
        'Secure dedicated livestock watering points',
      ],
    },
    {
      axisNumber: 'Axis 4',
      title: 'Social Protection & Health',
      actions: [
        'Expand nutritional screening for vulnerable households',
        'Strengthen community primary health clinics',
        'Pre-position food and WASH emergency response kits',
      ],
    },
    {
      axisNumber: 'Axis 5',
      title: 'Early Warning System',
      actions: [
        'Monthly rainfall anomaly tracking',
        'Satellite vegetation (NDVI) anomaly analysis',
        'Root-zone soil moisture monitoring',
        'Early identification of high-risk districts',
      ],
    },
  ],
  sw: [
    {
      axisNumber: 'Mhimili 1',
      title: 'Usalama wa Chakula',
      actions: [
        'Kuunda akiba ya kimkakati ya chakula',
        'Kusaidia wazalishaji wa mbegu zinazostahimili ukame',
        'Mseto wa mazao ya chakula',
        'Ufuatiliaji wa bei za mchele, mahindi na muhogo',
      ],
    },
    {
      axisNumber: 'Mhimili 2',
      title: 'Usimamizi wa Maji',
      actions: [
        'Ukarabati wa miundombinu ya maji na visima',
        'Kulinda vyanzo vya maji na mabonde',
        'Kujenga matangi ya kuhifadhi maji',
        'Kufuatilia kina cha maji ya ardhini',
      ],
    },
    {
      axisNumber: 'Mhimili 3',
      title: 'Ulinzi wa Mifugo',
      actions: [
        'Ufuatiliaji wa hali ya malisho',
        'Usimamizi endelevu wa lishe ya mifugo',
        'Kuhakikisha vituo vya kunywesha mifugo',
      ],
    },
    {
      axisNumber: 'Mhimili 4',
      title: 'Hifadhi ya Jamii & Afya',
      actions: [
        'Uchunguzi wa lishe kwa jamii zilizo hatarini',
        'Kuimarisha huduma za afya za msingi',
        'Maandalizi ya vifaa vya msaada wa chakula na maji',
      ],
    },
    {
      axisNumber: 'Mhimili 5',
      title: 'Mfumo wa Tahadhari ya Mapema',
      actions: [
        'Ufuatiliaji wa mvua wa kila mwezi',
        'Uchambuzi wa uoto kupitia satelaiti (NDVI)',
        'Ufuatiliaji wa unyevu wa udongo',
        'Utambuzi wa mapema wa wilaya zilizo hatarini',
      ],
    },
  ],
};

export function getLocalizedPreparedness5Axes(lang: LanguageCode): PreparednessAxis[] {
  if (lang === 'fr') return PREPAREDNESS_5_AXES;
  const tr = PREPAREDNESS_TR[lang];
  return PREPAREDNESS_5_AXES.map((a, i) => ({ ...a, ...(tr[i] ?? {}) }));
}

const MONTHLY_IND_TR: Record<Exclude<LanguageCode, 'fr'>, Partial<MonthlyIndicatorEntry>[]> = {
  en: [
    { indicator: 'Rainfall (mm)', utility: 'Detect regional precipitation deficits and excesses', cadence: '10-day / Monthly' },
    { indicator: 'Mean Temperature', utility: 'Spot abnormal heatwave episodes', cadence: 'Monthly' },
    { indicator: 'SPI-1, SPI-3, SPI-6', utility: 'Measure standardized meteorological drought severity', cadence: 'Monthly' },
    { indicator: 'NDVI', utility: 'Track cropland vigor and pasture greenness', cadence: 'Bi-weekly (16d)' },
    { indicator: 'Soil Moisture', utility: 'Detect root-zone agricultural drought stress', cadence: 'Weekly / Monthly' },
    { indicator: 'River Discharge', utility: 'Track low-flow (hydropower) and flood hazards', cadence: 'Weekly' },
    { indicator: 'Crop Production', utility: 'Estimate seasonal yield losses by value chain', cadence: 'Seasonal' },
    { indicator: 'Food Prices', utility: 'Spot local market spikes (rice, maize, cassava)', cadence: 'Monthly' },
    { indicator: 'IPC 3+ Population', utility: 'Track acute food insecurity levels by district', cadence: 'Quarterly' },
  ],
  sw: [
    { indicator: 'Mvua (mm)', utility: 'Kubaini upungufu na ziada ya mvua', cadence: 'Kila siku 10 / Mwezi' },
    { indicator: 'Wastani wa Joto', utility: 'Kugundua vipindi vya joto kali lisilo la kawaida', cadence: 'Kila mwezi' },
    { indicator: 'SPI-1, SPI-3, SPI-6', utility: 'Kupima kiwango sanifu cha ukame', cadence: 'Kila mwezi' },
    { indicator: 'NDVI', utility: 'Kufuatilia hali ya mimea na malisho', cadence: 'Kila wiki mbili' },
    { indicator: 'Unyevu wa Udongo', utility: 'Kugundua ukame kwenye mizizi ya mazao', cadence: 'Wiki / Mwezi' },
    { indicator: 'Kina cha Mito', utility: 'Kufuatilia hatari za mafuriko na ukame', cadence: 'Kila wiki' },
    { indicator: 'Uzalishaji wa Kilimo', utility: 'Kupima hasara za mavuno kwa kila zao', cadence: 'Kila msimu' },
    { indicator: 'Bei za Chakula', utility: 'Kugundua kupanda kwa bei (mchele, mahindi, muhogo)', cadence: 'Kila mwezi' },
    { indicator: 'Watu Katika IPC 3+', utility: 'Kufuatilia uhaba mkubwa wa chakula kwa wilaya', cadence: 'Kila robo mwaka' },
  ],
};

export function getLocalizedMonthlyIndicators(lang: LanguageCode): MonthlyIndicatorEntry[] {
  if (lang === 'fr') return MONTHLY_INDICATORS_9;
  const tr = MONTHLY_IND_TR[lang];
  return MONTHLY_INDICATORS_9.map((m, i) => ({ ...m, ...(tr[i] ?? {}) }));
}

const ATLAS_DELIV_TR: Record<Exclude<LanguageCode, 'fr'>, { title: string; detail: string }[]> = {
  en: [
    { title: '119-District Reference Database', detail: 'geoBoundaries ADM2 centroids, climate baselines and crop portfolios.' },
    { title: 'District Risk Matrix', detail: 'Scoring drought, floods, heat stress and structural vulnerability.' },
    { title: 'Hazard & Agricultural Risk Mapping', detail: 'Interactive Google Maps layers and GeoJSON / Folium export.' },
    { title: '2027 & 2028 Scenario Projections', detail: 'Contrast between the 2027 El Niño shock and 2028 lean / La Niña transition.' },
    { title: 'Exposed Population & Economic Activity Estimates', detail: 'IPC 3+ targeting across key rice and staple production basins.' },
    { title: 'Decision Support Dashboard (Web / Python)', detail: '9 monthly indicators (SPI, NDVI, prices, flows) plus QLoRA generator.' },
    { title: 'Regional Response Plan & Costed Budget', detail: 'State, NGO & donor alignment (FDA, DEFIS, WFP, FAO, World Bank).' },
  ],
  sw: [
    { title: 'Hifadhidata ya Wilaya 119', detail: 'Kuratibu za ADM2, historia ya tabianchi na mazao.' },
    { title: 'Jedwali la Hatari kwa Kila Wilaya', detail: 'Alama za ukame, mafuriko, joto na udhaifu wa kijamii.' },
    { title: 'Ramani za Ukame, Mafuriko na Hatari za Kilimo', detail: 'Ramani shirikishi za Google Maps na GeoJSON / Folium.' },
    { title: 'Makadirio ya 2027 na 2028', detail: 'Tofauti kati ya mshtuko wa El Niño 2027 na mpito wa 2028.' },
    { title: 'Ukadiriaji wa Watu na Uchumi Ulio Hatarini', detail: 'Ulengaji wa IPC 3+ katika mabonde ya mpunga na mahindi.' },
    { title: 'Dashibodi ya Maamuzi (Web / Python)', detail: 'Viashiria 9 vya kila mwezi (SPI, NDVI, bei, mito) na QLoRA.' },
    { title: 'Mpango wa Msaada & Bajeti kwa Mkoa', detail: 'Uratibu wa Serikali, NGO na wafadhili (FDA, DEFIS, WFP, FAO, Benki ya Dunia).' },
  ],
};

export function getLocalizedAtlasDeliverables(lang: LanguageCode) {
  if (lang === 'fr') return ATLAS_DELIVERABLES;
  const tr = ATLAS_DELIV_TR[lang];
  return ATLAS_DELIVERABLES.map((d, i) => ({ ...d, ...(tr[i] ?? {}) }));
}

const ATLAS_EXT_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: [
    'Seasonal outlooks and weather bulletins',
    'Food security monitoring & 2027–2028 lean season briefs',
    'Agriculture & global food security portal',
    'SWIOCOF seasonal forecasts & climate watch',
    'Historical climate series & Madagascar projections',
  ],
  sw: [
    'Utabiri wa msimu na taarifa za hali ya hewa',
    'Ufuatiliaji wa usalama wa chakula 2027–2028',
    'Tovuti ya kilimo na usalama wa chakula duniani',
    'Utabiri wa kikanda wa SWIOCOF & hali ya hewa',
    'Takwimu za kihistoria za tabianchi na Madagaska',
  ],
};

export function getLocalizedAtlasExternalSources(lang: LanguageCode) {
  if (lang === 'fr') return ATLAS_EXTERNAL_SOURCES;
  const tr = ATLAS_EXT_TR[lang];
  return ATLAS_EXTERNAL_SOURCES.map((s, i) => ({ ...s, desc: tr[i] ?? s.desc }));
}

// --- NATIONAL PLAN LOCALIZATION ---

const NAT_BASELINES_TR: Record<Exclude<LanguageCode, 'fr'>, { value?: string; label: string; source: string }[]> = {
  en: [
    { value: '25.67M', label: 'Census Population (2018)', source: 'INSTAT – RGPH-3 · 6.08M households' },
    { label: 'Administrative Districts', source: '23 official regions (Torolalana)' },
    { value: '80.7%', label: 'Rural Population Share', source: 'RGPH-3 · > 75% farm-dependent' },
    { value: '3.01%', label: 'Mean Annual Growth Rate', source: '1993–2018 · Disaggregated by district' },
    { value: '40%', label: 'National Food Insecurity', source: 'June 2026 baseline (70% Grand Sud)' },
  ],
  sw: [
    { value: '25.67M', label: 'Idadi ya Watu (Sensa 2018)', source: 'INSTAT – RGPH-3 · Kaya 6.08M' },
    { label: 'Wilaya za Kiutawala', source: 'Mikoa 23 rasmi (Torolalana)' },
    { value: '80.7%', label: 'Watu wa Vijijini', source: 'RGPH-3 · > 75% wategemea kilimo' },
    { value: '3.01%', label: 'Kasi ya Ukuaji kwa Mwaka', source: '1993–2018 · Kwa kila wilaya' },
    { value: '40%', label: 'Uhaba wa Chakula Kitaifa', source: 'Tathmini Juni 2026 (70% Kusini Kuu)' },
  ],
};

export function getLocalizedNationalBaselines(lang: LanguageCode) {
  if (lang === 'fr') return NATIONAL_BASELINE_INDICATORS;
  const tr = NAT_BASELINES_TR[lang];
  return NATIONAL_BASELINE_INDICATORS.map((b, i) => ({ ...b, ...(tr[i] ?? {}) }));
}

const STRATEGIC_6Q_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: [
    'Which territories face the highest climate exposure?',
    'How many people could be exposed or need assistance?',
    'Which crops and economic sectors are threatened?',
    'Which water assets and critical infrastructure must be shielded?',
    'How much financing must be mobilized (MGA / USD / EUR)?',
    'Who intervenes, where, when, and with which resources?',
  ],
  sw: [
    'Ni maeneo yapi yaliyo hatarini zaidi kuathirika?',
    'Ni watu wangapi wanaweza kuathirika au kuhitaji msaada?',
    'Ni mazao yapi na shughuli zipi za kiuchumi ziko hatarini?',
    'Ni miundombinu ipi na vyanzo vipi vya maji vinapaswa kulindwa?',
    'Ni kiasi gani cha fedha kinachohitajika (MGA / USD / EUR)?',
    'Nani anapaswa kuchukua hatua, wapi, lini na kwa rasilimali zipi?',
  ],
};

export function getLocalizedStrategicQuestions(lang: LanguageCode) {
  return lang === 'fr' ? STRATEGIC_SIX_QUESTIONS : STRATEGIC_6Q_TR[lang];
}

const PROGRAM_8_COMP_TR: Record<Exclude<LanguageCode, 'fr'>, { title: string; desc: string }[]> = {
  en: [
    { title: 'Component 1 – Territorial Risk Atlas', desc: 'Risk profiling across 23 regions and 119 districts: drought, floods, heat, cyclones & vulnerability.' },
    { title: 'Component 2 – Population & Social Vulnerability', desc: 'Exposed people, farm households, children, elderly, water access & food security.' },
    { title: 'Component 3 – Agriculture & Livestock', desc: 'Rice, maize, cassava, sweet potato, export crops, cattle & fisheries.' },
    { title: 'Component 4 – Economic Impacts', desc: 'Crop losses, household income, food price inflation, infrastructure & macro output.' },
    { title: 'Component 5 – Financing & Costing', desc: 'Intervention unit costing, domestic budget, climate funds & international donors.' },
    { title: 'Component 6 – National Coordination', desc: 'Central government, regions, districts, communes, NGOs, UN agencies & donors.' },
    { title: 'Component 7 – Early Warning', desc: 'Weather stations, satellites, crop vigor, market prices & vulnerability tracking.' },
    { title: 'Component 8 – 2028–2030 Resilience', desc: 'Sustainable water governance, agricultural works, adaptation & risk reduction.' },
  ],
  sw: [
    { title: 'Kipengele 1 – Atlasi ya Hatari', desc: 'Uchambuzi wa mikoa 23 na wilaya 119: ukame, mafuriko, joto, vimbunga na udhaifu.' },
    { title: 'Kipengele 2 – Watu na Udhaifu wa Kijamii', desc: 'Watu walio hatarini, kaya za wakulima, watoto, maji na usalama wa chakula.' },
    { title: 'Kipengele 3 – Kilimo na Mifugo', desc: 'Mpunga, mahindi, muhogo, viazi vitamu, mazao ya biashara, mifugo na uvuvi.' },
    { title: 'Kipengele 4 – Athari za Kiuchumi', desc: 'Hasara za kilimo, kipato, bei za vyakula, miundombinu na uchumi.' },
    { title: 'Kipengele 5 – Ufadhili na Bajeti', desc: 'Gharama za miradi, bajeti ya umma, mifuko ya tabianchi na wafadhili.' },
    { title: 'Kipengele 6 – Uratibu wa Taifa', desc: 'Serikali, mikoa, wilaya, kata, mashirika ya NGO, UN na wafadhili.' },
    { title: 'Kipengele 7 – Tahadhari ya Mapema', desc: 'Data ya hali ya hewa, satelaiti, ufuatiliaji wa mazao na bei za soko.' },
    { title: 'Kipengele 8 – Ustahimilivu 2028–2030', desc: 'Usimamizi endelevu wa maji, miundombinu ya kilimo na kupunguza hatari.' },
  ],
};

export function getLocalizedProgram8Components(lang: LanguageCode) {
  if (lang === 'fr') return PROGRAM_8_COMPONENTS;
  const tr = PROGRAM_8_COMP_TR[lang];
  return PROGRAM_8_COMPONENTS.map((c, i) => ({ ...c, ...(tr[i] ?? {}) }));
}

const PROGRAM_8_OBJ_TR: Record<Exclude<LanguageCode, 'fr'>, { objective: string; result: string }[]> = {
  en: [
    { objective: 'Territorial diagnostic', result: 'Climate risk profiles for all 119 districts' },
    { objective: 'Human impact assessment', result: 'Exposed & aid-requiring population estimates' },
    { objective: 'Agricultural assessment', result: 'Cropland area & tonnage at risk' },
    { objective: 'Economic analysis', result: 'Estimated potential macro/sector losses' },
    { objective: 'Financial planning', result: 'National and subnational response budgets' },
    { objective: 'Coordination', result: 'Clear division of institutional responsibilities' },
    { objective: 'Anticipation', result: 'Operational early warning dashboard' },
    { objective: 'Resilience', result: 'Medium- and long-term adaptation investments' },
  ],
  sw: [
    { objective: 'Uchambuzi wa Maeneo', result: 'Wasifu wa tabianchi wa wilaya zote 119' },
    { objective: 'Tathmini ya Watu', result: 'Makadirio ya watu walio hatarini kuathirika' },
    { objective: 'Tathmini ya Kilimo', result: 'Makadirio ya mashamba na mazao hatarini' },
    { objective: 'Uchambuzi wa Uchumi', result: 'Makadirio ya hasara za kiuchumi' },
    { objective: 'Mipango ya Kifedha', result: 'Bajeti ya taifa na bajeti za maeneo' },
    { objective: 'Uratibu', result: 'Mgawanyo wa majukumu kwa wahusika wote' },
    { objective: 'Utabiri wa Mapema', result: 'Mfumo wa tahadhari na dashibodi ya ufuatiliaji' },
    { objective: 'Ustahimilivu', result: 'Uwekezaji wa muda wa kati na mrefu' },
  ],
};

export function getLocalizedProgram8Objectives(lang: LanguageCode) {
  return lang === 'fr' ? PROGRAM_8_OBJECTIVES : PROGRAM_8_OBJ_TR[lang];
}

const DB_SCHEMA_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: [
    'Unique administrative identifier (Torolalana)',
    'Official region name (23 regions)',
    'Official district name (119 districts)',
    'Census population RGPH-3 (2018)',
    'Projected population using local growth rate',
    'Projected 2028 population',
    'Number of households in district',
    'Estimated rural population',
    'Number of agricultural households',
    'Drought exposure score (0–100)',
    'Flood exposure score (0–100)',
    'Heatwave exposure score (0–100)',
    'Cyclone exposure score (0–100)',
    'Potentially exposed population',
    'Cultivated agricultural area (ha)',
    'Estimated crop losses (t & MGA)',
    'Estimated water deficit (%)',
    'Consolidated financing need (MGA / USD)',
    'Selected priority intervention',
    'Active actors (Government, UN, NGOs)',
  ],
  sw: [
    'Kitambulisho rasmi cha utawala (Torolalana)',
    'Jina rasmi la mkoa (mikoa 23)',
    'Jina rasmi la wilaya (wilaya 119)',
    'Idadi ya watu RGPH-3 (2018)',
    'Makadirio ya watu 2027 kwa kasi ya eneo',
    'Makadirio ya watu 2028',
    'Idadi ya kaya katika wilaya',
    'Makadirio ya wakazi wa vijijini',
    'Idadi ya kaya za wakulima',
    'Alama ya hatari ya ukame (0–100)',
    'Alama ya hatari ya mafuriko (0–100)',
    'Alama ya hatari ya joto kali (0–100)',
    'Alama ya hatari ya vimbunga (0–100)',
    'Idadi ya watu wanaoweza kuathirika',
    'Eneo linalolimwa (hektari)',
    'Makadirio ya hasara za mazao (tani & MGA)',
    'Upungufu wa maji unaokadiriwa (%)',
    'Mahitaji ya kifedha yaliyojumlishwa (MGA / USD)',
    'Hatua ya kipaumbele iliyochaguliwa',
    'Wahusika watekelezaji (Serikali, UN, NGO)',
  ],
};

export function getLocalizedDbSchema20(lang: LanguageCode) {
  if (lang === 'fr') return DISTRICT_DB_SCHEMA_20;
  const tr = DB_SCHEMA_TR[lang];
  return DISTRICT_DB_SCHEMA_20.map((row, i) => ({ ...row, content: tr[i] ?? row.content }));
}

const RISK_DIM_TR: Record<Exclude<LanguageCode, 'fr'>, { label: string; desc: string }[]> = {
  en: [
    { label: 'Climate Exposure', desc: 'Combined hazards (drought, floods, heat, cyclones) from Météo Madagascar / CHIRPS series.' },
    { label: 'Population Vulnerability', desc: 'Baseline food insecurity, poverty rate, share of children and elderly.' },
    { label: 'Agri & Economic Dependence', desc: 'Share of households relying on rainfed staples and livestock.' },
    { label: 'Water Resource Fragility', desc: 'Shallow aquifer depletion, river drying and clean water access.' },
    { label: 'Local Response Capacity Deficit', desc: 'Transport isolation, clinic coverage, grain reserves and community networks.' },
  ],
  sw: [
    { label: 'Athari za Tabianchi', desc: 'Mchanganyiko wa hatari (ukame, mafuriko, joto, vimbunga) kutoka Météo Madagascar / CHIRPS.' },
    { label: 'Udhaifu wa Idadi ya Watu', desc: 'Uhaba wa awali wa chakula, umaskini, uwiano wa watoto na wazee.' },
    { label: 'Utegemezi wa Kilimo na Uchumi', desc: 'Sehemu ya kaya zinazotegemea mazao ya mvua na mifugo.' },
    { label: 'Udhaifu wa Rasilimali za Maji', desc: 'Kupungua kwa maji ya ardhini, kukauka kwa mito na vyanzo vya maji.' },
    { label: 'Upungufu wa Uwezo wa Kukabiliana', desc: 'Ugumu wa usafiri, upatikanaji wa kliniki, akiba ya chakula na mitandao ya jamii.' },
  ],
};

export function getLocalizedRiskDimensions(lang: LanguageCode) {
  if (lang === 'fr') return RISK_SCORING_DIMENSIONS;
  const tr = RISK_DIM_TR[lang];
  return RISK_SCORING_DIMENSIONS.map((d, i) => ({ ...d, ...(tr[i] ?? {}) }));
}

const RISK_CLASSES_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: ['Low', 'Moderate', 'Significant', 'High', 'Very high'],
  sw: ['Chini', 'Wastani', 'Muhimu', 'Juu', 'Juu Sana'],
};

export function getLocalizedRiskClasses(lang: LanguageCode) {
  if (lang === 'fr') return RISK_ANALYTICAL_CLASSES;
  const tr = RISK_CLASSES_TR[lang];
  return RISK_ANALYTICAL_CLASSES.map((c, i) => ({ ...c, label: tr[i] ?? c.label }));
}

const ABCD_GROUPS_TR: Record<Exclude<LanguageCode, 'fr'>, { code: string; title: string; interventions: string }[]> = {
  en: [
    { code: 'Group A', title: 'Drought & Food Security', interventions: 'Water, drought-tolerant seeds, food security, livestock & social safety nets.' },
    { code: 'Group B', title: 'Intense Rains & Flooding', interventions: 'Drainage, crop protection, early warning, road access & shelters.' },
    { code: 'Group C', title: 'Agriculture & Rainfall Variability', interventions: 'Agricultural water control, quality seeds, yield monitoring & soil conservation.' },
    { code: 'Group D', title: 'Mixed Hazards & Infrastructure', interventions: 'Infrastructure shielding, drainage, service continuity & multi-hazard prevention.' },
  ],
  sw: [
    { code: 'Kundi A', title: 'Ukame na Usalama wa Chakula', interventions: 'Maji, mbegu stahimilivu, chakula, mifugo na hifadhi ya jamii.' },
    { code: 'Kundi B', title: 'Mvua Nyingi na Mafuriko', interventions: 'Mifereji ya maji, ulinzi wa mazao, tahadhari, barabara na makazi.' },
    { code: 'Kundi C', title: 'Kilimo na Kubadilika kwa Mvua', interventions: 'Usimamizi wa maji shambani, mbegu bora na hifadhi ya udongo.' },
    { code: 'Kundi D', title: 'Hatari Mchanganyiko & Miundombinu', interventions: 'Kulinda miundombinu, mifereji na mwendelezo wa huduma muhimu.' },
  ],
};

export function getLocalizedTerritorialGroups(lang: LanguageCode) {
  if (lang === 'fr') return TERRITORIAL_GROUPS_ABCD;
  const tr = ABCD_GROUPS_TR[lang];
  return TERRITORIAL_GROUPS_ABCD.map((g, i) => ({ ...g, ...(tr[i] ?? {}) }));
}

const PILOT_TAGS_TR: Record<Exclude<LanguageCode, 'fr'>, Record<string, { groupCode: string; profileTag: string }>> = {
  en: {
    'Ambovombe-Androy': { groupCode: 'Group A', profileTag: 'Critical drought' },
    Bekily: { groupCode: 'Group A', profileTag: 'Critical drought' },
    Tsihombe: { groupCode: 'Group A', profileTag: 'Critical drought' },
    'Amboasary-Sud': { groupCode: 'Group A', profileTag: 'Critical drought' },
    'Ampanihy-Ouest': { groupCode: 'Group A', profileTag: 'Critical drought' },
    Ihosy: { groupCode: 'Group A / C', profileTag: 'Pastures & staples' },
    Miandrivazo: { groupCode: 'Group A', profileTag: 'Heat & rain deficit' },
    Ambatondrazaka: { groupCode: 'Group C', profileTag: 'Rice bowl & low flow' },
    Mananjary: { groupCode: 'Group B', profileTag: 'Floods & cash crops' },
    Brickaville: { groupCode: 'Group B', profileTag: 'Floods & road network' },
    Maroantsetra: { groupCode: 'Group B', profileTag: 'Heavy rains & cyclones' },
    Sambava: { groupCode: 'Group B', profileTag: 'Vanilla & excess moisture' },
  },
  sw: {
    'Ambovombe-Androy': { groupCode: 'Kundi A', profileTag: 'Ukame mkali' },
    Bekily: { groupCode: 'Kundi A', profileTag: 'Ukame mkali' },
    Tsihombe: { groupCode: 'Kundi A', profileTag: 'Ukame mkali' },
    'Amboasary-Sud': { groupCode: 'Kundi A', profileTag: 'Ukame mkali' },
    'Ampanihy-Ouest': { groupCode: 'Kundi A', profileTag: 'Ukame mkali' },
    Ihosy: { groupCode: 'Kundi A / C', profileTag: 'Malisho & chakula' },
    Miandrivazo: { groupCode: 'Kundi A', profileTag: 'Joto & upungufu wa mvua' },
    Ambatondrazaka: { groupCode: 'Kundi C', profileTag: 'Bonde la mpunga' },
    Mananjary: { groupCode: 'Kundi B', profileTag: 'Mafuriko & mazao ya biashara' },
    Brickaville: { groupCode: 'Kundi B', profileTag: 'Mafuriko & barabara' },
    Maroantsetra: { groupCode: 'Kundi B', profileTag: 'Mvua nyingi & vimbunga' },
    Sambava: { groupCode: 'Kundi B', profileTag: 'Vanilla & unyevu mwingi' },
  },
};

export function getLocalizedPilotDistricts12(lang: LanguageCode): PilotDistrictPreset[] {
  if (lang === 'fr') return PILOT_DISTRICTS_12;
  const tr = PILOT_TAGS_TR[lang];
  return PILOT_DISTRICTS_12.map((p) => ({ ...p, ...(tr[p.district] ?? {}) }));
}

const VALUE_CHAINS_TR: Record<Exclude<LanguageCode, 'fr'>, { name: string; focus: string }[]> = {
  en: [
    { name: 'Rice', focus: 'Yield, planted acreage, sowing calendars and irrigation (moderate national impact per FAO but acute locally).' },
    { name: 'Maize', focus: 'Drought sensitivity, harvest yield and food security (severe exposure in the South).' },
    { name: 'Cassava', focus: 'Household food resilience and tuber availability during lean months.' },
    { name: 'Sweet Potato', focus: 'Clean vine cuttings availability and staple food output.' },
    { name: 'Vanilla', focus: 'Green/cured volume, bean quality and grower incomes (SAVA / Ambatosoa).' },
    { name: 'Coffee & Cloves', focus: 'Water stress, flowering, yield and export grade (East Coast).' },
    { name: 'Livestock', focus: 'Pastures, livestock watering points, fodder & animal health.' },
    { name: 'Fisheries', focus: 'Marine sea-surface conditions, pelagic stocks and coastal livelihoods.' },
  ],
  sw: [
    { name: 'Mpunga', focus: 'Mavuno, eneo, kalenda na umwagiliaji (muhimu sana katika ngazi ya wilaya).' },
    { name: 'Mahindi', focus: 'Ukame, mavuno na usalama wa chakula (athari kubwa zaidi Kusini).' },
    { name: 'Muhogo', focus: 'Ustahimilivu wa chakula na upatikanaji wakati wa kipindi cha uhaba.' },
    { name: 'Viazi Vitamu', focus: 'Upatikanaji wa mbegu na uzalishaji wa chakula cha familia.' },
    { name: 'Vanilla', focus: 'Uzalishaji, ubora wa maganda na kipato cha wakulima (SAVA / Ambatosoa).' },
    { name: 'Kahawa & Karafuu', focus: 'Msongo wa maji, kutoa maua, mavuno na ubora wa soko la nje (Pwani ya Mashariki).' },
    { name: 'Mifugo', focus: 'Malisho, vituo vya maji, chakula cha mifugo na afya.' },
    { name: 'Uvuvi', focus: 'Hali ya bahari, rasilimali za samaki na maisha ya pwani.' },
  ],
};

export function getLocalizedEightValueChains(lang: LanguageCode) {
  return lang === 'fr' ? EIGHT_VALUE_CHAINS : VALUE_CHAINS_TR[lang];
}

const THREE_SCEN_TR: Record<Exclude<LanguageCode, 'fr'>, { parameter: string; s1: string; s2: string; s3: string }[]> = {
  en: [
    { parameter: 'Climate', s1: 'Limited deficit', s2: 'Prolonged deficit', s3: 'Severe climate shock' },
    { parameter: 'Rainfall', s1: 'Return toward normal', s2: 'Persistent irregularity', s3: 'Acute deficit in vulnerable zones' },
    { parameter: 'Agriculture', s1: 'Partial recovery', s2: 'Yield decline', s3: 'Severe agricultural losses' },
    { parameter: 'Water', s1: 'Resources under pressure', s2: 'Low reserves', s3: 'Localized shortages' },
    { parameter: 'Food Security', s1: 'Seasonal tension', s2: 'Localized worsening', s3: 'Heightened humanitarian needs' },
  ],
  sw: [
    { parameter: 'Tabianchi', s1: 'Upungufu mdogo', s2: 'Upungufu wa muda mrefu', s3: 'Mshtuko mkali wa tabianchi' },
    { parameter: 'Mvua', s1: 'Kurejea karibu na kawaida', s2: 'Kuyumba kunakoendelea', s3: 'Upungufu mkubwa maeneo hatari' },
    { parameter: 'Kilimo', s1: 'Ahueni ya kiasi', s2: 'Kupungua kwa mavuno', s3: 'Hasara kubwa za kilimo' },
    { parameter: 'Maji', s1: 'Vyanzo chini ya shinikizo', s2: 'Akiba ndogo', s3: 'Uhaba wa maji maeneo mengi' },
    { parameter: 'Usalama wa Chakula', s1: 'Shinikizo la msimu', s2: 'Kuzorota maeneo kadhaa', s3: 'Mahitaji makubwa ya kibinadamu' },
  ],
};

export function getLocalizedThreeScenarios(lang: LanguageCode) {
  return lang === 'fr' ? THREE_SCENARIOS : THREE_SCEN_TR[lang];
}

const AMBOVOMBE_FICHE_TR: Record<Exclude<LanguageCode, 'fr'>, { indicator: string; status: string; domain: string }[]> = {
  en: [
    { indicator: 'Baseline Population', status: 'Extract RGPH-3 (INSTAT)', domain: 'Demography' },
    { indicator: 'Agricultural Households', status: 'Consolidate (MINAE / INSTAT)', domain: 'Demography' },
    { indicator: 'Planted Acreage', status: 'Collect by crop value chain', domain: 'Agriculture' },
    { indicator: 'Maize Output', status: 'Collect (2020–2026 baseline)', domain: 'Agriculture' },
    { indicator: 'Cassava Output', status: 'Collect (2020–2026 baseline)', domain: 'Agriculture' },
    { indicator: 'Sweet Potato Output', status: 'Collect (2020–2026 baseline)', domain: 'Agriculture' },
    { indicator: 'Baseline Yield', status: 'Compute (Q_baseline)', domain: 'Modeling' },
    { indicator: 'Scenario Yield', status: 'Model under (S1 / S2 / S3)', domain: 'Modeling' },
    { indicator: 'Crop Losses (MGA)', status: 'Compute (Loss × Local Price)', domain: 'Economy' },
    { indicator: 'Seed Kit Needs', status: 'Compute (Farmers × kit)', domain: 'Planning' },
    { indicator: 'Water Requirements', status: 'Compute (m³ / boreholes)', domain: 'Water' },
    { indicator: 'Intervention Budget', status: 'Cost using unit rates', domain: 'Finance' },
  ],
  sw: [
    { indicator: 'Idadi ya Watu (Msingi)', status: 'Kutoka RGPH-3 (INSTAT)', domain: 'Idadi ya Watu' },
    { indicator: 'Kaya za Wakulima', status: 'Jumuisha (MINAE / INSTAT)', domain: 'Idadi ya Watu' },
    { indicator: 'Eneo Lililolimwa', status: 'Kusanya kwa kila zao', domain: 'Kilimo' },
    { indicator: 'Uzalishaji wa Mahindi', status: 'Kusanya (2020–2026)', domain: 'Kilimo' },
    { indicator: 'Uzalishaji wa Muhogo', status: 'Kusanya (2020–2026)', domain: 'Kilimo' },
    { indicator: 'Uzalishaji wa Viazi Vitamu', status: 'Kusanya (2020–2026)', domain: 'Kilimo' },
    { indicator: 'Mavuno ya Msingi', status: 'Kokotoa (Q_msingi)', domain: 'Utabiri' },
    { indicator: 'Mavuno Chini ya Hali', status: 'Kadiria (S1 / S2 / S3)', domain: 'Utabiri' },
    { indicator: 'Hasara za Mazao (MGA)', status: 'Kokotoa (Hasara × Bei)', domain: 'Uchumi' },
    { indicator: 'Mahitaji ya Mbegu', status: 'Kokotoa (Wakulima × vifaa)', domain: 'Mipango' },
    { indicator: 'Mahitaji ya Maji', status: 'Kokotoa (m³ / visima)', domain: 'Maji' },
    { indicator: 'Bajeti ya Utekelezaji', status: 'Piga hesabu kwa gharama za vitengo', domain: 'Fedha' },
  ],
};

export function getLocalizedAmbovombeFiche(lang: LanguageCode) {
  return lang === 'fr' ? AMBOVOMBE_FICHE_TEMPLATE : AMBOVOMBE_FICHE_TR[lang];
}

const BUDGET_8_TR: Record<Exclude<LanguageCode, 'fr'>, { component: string; items: string }[]> = {
  en: [
    { component: 'Food Security', items: 'Cash transfers, food assistance, emergency nutrition' },
    { component: 'Agriculture', items: 'Resilient seeds, inputs, small irrigation, farm tools' },
    { component: 'Water', items: 'Boreholes, storage tanks, rural water network rehab' },
    { component: 'Livestock', items: 'Animal feed, pastoral water points, veterinary care' },
    { component: 'Health', items: 'Nutritional monitoring, community health, vector control' },
    { component: 'Infrastructure', items: 'Rural feeder roads, drainage, flood protection dikes' },
    { component: 'Early Warning', items: 'Automatic weather stations, satellite imagery, telecoms' },
    { component: 'Coordination', items: 'Territorial teams, M&E, audits, fiduciary control' },
  ],
  sw: [
    { component: 'Usalama wa Chakula', items: 'Misaada ya fedha, chakula cha dharura na lishe' },
    { component: 'Kilimo', items: 'Mbegu stahimilivu, mbolea, umwagiliaji mdogo na zana' },
    { component: 'Maji', items: 'Visima virefu, matangi ya kuhifadhi na ukarabati wa mifumo' },
    { component: 'Mifugo', items: 'Chakula cha mifugo, vituo vya maji na chanjo' },
    { component: 'Afya', items: 'Ufuatiliaji wa lishe, afya ya jamii na kudhibiti magonjwa' },
    { component: 'Miundombinu', items: 'Barabara za vijijini, mitaro na kingo za kuzuia mafuriko' },
    { component: 'Tahadhari ya Mapema', items: 'Vituo vya hali ya hewa, picha za satelaiti na mawasiliano' },
    { component: 'Uratibu', items: 'Timu za maeneo, ufuatiliaji na ukaguzi wa fedha' },
  ],
};

export function getLocalizedBudget8Components(lang: LanguageCode) {
  return lang === 'fr' ? BUDGET_8_COMPONENTS : BUDGET_8_TR[lang];
}

const BUDGET_LINES_TR: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<string, Partial<BudgetUnitLine>>
> = {
  en: {
    'food-assist': { label: 'Food assistance', unitLabel: 'Beneficiary × month' },
    'cash-transfer': { label: 'Cash transfers (Cash+)', unitLabel: 'Household × cycle' },
    'seed-kits': { label: 'Resilient seed kits', unitLabel: 'Farmer × kit' },
    'borehole-rehab': { label: 'Borehole rehabilitation', unitLabel: 'Unit × cost' },
    'water-tank': { label: 'Community water reservoir', unitLabel: 'Asset × capacity' },
    'farmer-training': { label: 'Agroecology training (SCV/SRI)', unitLabel: 'Farmer × session' },
    'weather-station': { label: 'Automatic weather station', unitLabel: 'Station × install' },
    'rural-road': { label: 'Feeder road rehabilitation', unitLabel: 'Kilometer × unit rate' },
  },
  sw: {
    'food-assist': { label: 'Msaada wa chakula', unitLabel: 'Mnufaika × mwezi' },
    'cash-transfer': { label: 'Misaada ya fedha (Cash+)', unitLabel: 'Kaya × mzunguko' },
    'seed-kits': { label: 'Vifaa vya mbegu bora', unitLabel: 'Mkulima × kifurushi' },
    'borehole-rehab': { label: 'Ukarabati wa visima', unitLabel: 'Kisima × gharama' },
    'water-tank': { label: 'Tangi la maji la jamii', unitLabel: 'Tangi × uwezo' },
    'farmer-training': { label: 'Mafunzo ya kilimo (SCV/SRI)', unitLabel: 'Mkulima × kipindi' },
    'weather-station': { label: 'Kituo cha hali ya hewa', unitLabel: 'Kituo × ufungaji' },
    'rural-road': { label: 'Ukarabati wa barabara ya kijiji', unitLabel: 'Kilomita × gharama' },
  },
};

export function getLocalizedBudgetUnitLines(lang: LanguageCode): BudgetUnitLine[] {
  if (lang === 'fr') return BUDGET_UNIT_LINES;
  const tr = BUDGET_LINES_TR[lang];
  return BUDGET_UNIT_LINES.map((l) => ({ ...l, ...(tr[l.id] ?? {}) }));
}

export function getLocalizedBudgetHorizon(h: BudgetUnitLine['horizon'], lang: LanguageCode): string {
  if (lang === 'fr') return h;
  if (lang === 'en') {
    return h === 'Urgence 2026–2028' ? 'Emergency 2026–2028' : 'Resilience 2028–2030';
  }
  return h === 'Urgence 2026–2028' ? 'Dharura 2026–2028' : 'Ustahimilivu 2028–2030';
}

const FIN_IND_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: [
    'Cost per assisted person',
    'Cost per protected household',
    'Cost per secured agricultural hectare',
    'Cost per rehabilitated water asset',
    'Funding mobilization rate (%)',
    'Financing gap (MGA / USD / EUR)',
    'Budget execution rate (%)',
  ],
  sw: [
    'Gharama kwa kila mtu aliyesaidiwa',
    'Gharama kwa kila kaya iliyolindwa',
    'Gharama kwa hektari ya kilimo iliyolindwa',
    'Gharama kwa miundombinu iliyokarabatiwa',
    'Kiwango cha fedha zilizokusanywa (%)',
    'Pengo la ufadhili (MGA / USD / EUR)',
    'Kiwango cha matumizi ya bajeti (%)',
  ],
};

export function getLocalizedFinancialIndicators7(lang: LanguageCode) {
  return lang === 'fr' ? FINANCIAL_INDICATORS_7 : FIN_IND_TR[lang];
}

const DONORS_TR: Record<Exclude<LanguageCode, 'fr'>, { name: string; focus: string }[]> = {
  en: [
    { name: 'World Bank', focus: 'Resilient infrastructure, agriculture, water, social safety nets and data systems.' },
    { name: 'African Development Bank (AfDB)', focus: 'Rural development, hydro-agricultural works and economic resilience.' },
    { name: 'Green Climate Fund (GCF)', focus: 'Large-scale climate adaptation and resilience projects (subject to accreditation).' },
    { name: 'European Union (EU)', focus: 'Territorial development, food security and climate change adaptation.' },
    { name: 'Adaptation Fund', focus: 'Community-led adaptation projects and local watershed resilience.' },
  ],
  sw: [
    { name: 'Benki ya Dunia (World Bank)', focus: 'Miundombinu stahimilivu, kilimo, maji, hifadhi ya jamii na mifumo ya data.' },
    { name: 'Benki ya Maendeleo ya Afrika (AfDB)', focus: 'Maendeleo ya vijijini, umwagiliaji na ustahimilivu wa kiuchumi.' },
    { name: 'Mfuko wa Hali ya Hewa (GCF)', focus: 'Miradi mikubwa ya kukabiliana na mabadiliko ya tabianchi.' },
    { name: 'Umoja wa Ulaya (EU)', focus: 'Maendeleo ya maeneo, usalama wa chakula na kukabiliana na tabianchi.' },
    { name: 'Adaptation Fund', focus: 'Miradi ya kijamii ya uhifadhi wa mazingira na rasilimali za maji.' },
  ],
};

export function getLocalizedDonorPartners5(lang: LanguageCode) {
  if (lang === 'fr') return DONOR_PARTNERS_5;
  const tr = DONORS_TR[lang];
  return DONOR_PARTNERS_5.map((d, i) => ({ ...d, ...(tr[i] ?? {}) }));
}

const GOV_PYRAMID_TR: Record<Exclude<LanguageCode, 'fr'>, { level: string; role: string }[]> = {
  en: [
    { level: 'Government of Madagascar', role: 'Strategic direction & inter-ministerial arbitration' },
    { level: 'National Steering Committee', role: 'Policy, budget and partner coordination' },
    { level: 'BNGRC & Météo Madagascar', role: 'Operational risk management, seasonal outlooks & early warning' },
    { level: 'Technical Unit & Finance Unit', role: 'Data, 119-district modeling, budgeting & resource mobilization' },
    { level: 'Regional Coordination (23 Regions)', role: 'Line directorates, governors and regional response planning' },
    { level: 'Territorial Coordination (119 Districts)', role: 'Communes, fokontany, NGOs, cooperatives & communities' },
  ],
  sw: [
    { level: 'Serikali ya Madagaska', role: 'Mwelekeo wa kimkakati na maamuzi ya kisekta' },
    { level: 'Kamati ya Kitaifa ya Uongozi', role: 'Uratibu wa kisera, bajeti na washirika' },
    { level: 'BNGRC & Météo Madagascar', role: 'Udhibiti wa maafa, utabiri na tahadhari za mapema' },
    { level: 'Kitengo cha Ufundi & Fedha', role: 'Takwimu, uchambuzi wa wilaya 119, bajeti na utafutaji fedha' },
    { level: 'Uratibu wa Mikoa (Mikoa 23)', role: 'Ofisi za mikoa, wakuu wa mikoa na mipango ya kikanda' },
    { level: 'Uratibu wa Wilaya (Wilaya 119)', role: 'Kata, fokontany, mashirika ya NGO, vyama vya ushirika na jamii' },
  ],
};

export function getLocalizedGovernancePyramid(lang: LanguageCode) {
  return lang === 'fr' ? GOVERNANCE_PYRAMID : GOV_PYRAMID_TR[lang];
}

const GOV_13_TR: Record<Exclude<LanguageCode, 'fr'>, { actor: string; role: string }[]> = {
  en: [
    { actor: 'Prime Minister’s Office', role: 'Inter-ministerial direction and arbitration' },
    { actor: 'Ministry of Environment', role: 'Climate policy and adaptation (NAP)' },
    { actor: 'Ministry of Agriculture (MINAE)', role: 'Crop protection, certified seeds & farm production' },
    { actor: 'Ministry of Water (MEAH)', role: 'Water resources, boreholes & dams' },
    { actor: 'BNGRC', role: 'Disaster risk management & emergency coordination' },
    { actor: 'Météo Madagascar', role: 'Seasonal weather forecasts & early warning' },
    { actor: 'INSTAT', role: 'Census demography (RGPH-3) & 114/119 district tables' },
    { actor: 'Ministry of Health (MSANP)', role: 'Nutrition, public health & epidemiology' },
    { actor: 'Ministry of Finance (MEF)', role: 'Budget consolidation (MGA/USD/EUR) & treasury' },
    { actor: 'Regions & Districts (23 / 119)', role: 'Territorial planning & local field tracking' },
    { actor: 'National & International NGOs', role: 'Field execution & community assistance' },
    { actor: 'WFP, FAO, UNICEF, UNDP, WHO, IOM', role: 'Technical, operational & humanitarian support' },
    { actor: 'International Donors', role: 'Concessional financing & technical assistance' },
  ],
  sw: [
    { actor: 'Ofisi ya Waziri Mkuu', role: 'Uongozi mkuu na maamuzi ya kisekta' },
    { actor: 'Wizara ya Mazingira', role: 'Sera za tabianchi na mipango ya kukabiliana' },
    { actor: 'Wizara ya Kilimo (MINAE)', role: 'Ulinzi wa mazao, mbegu na uzalishaji' },
    { actor: 'Wizara ya Maji (MEAH)', role: 'Rasilimali za maji, visima na mabwawa' },
    { actor: 'BNGRC', role: 'Usimamizi na uratibu wa maafa' },
    { actor: 'Météo Madagascar', role: 'Utabiri wa msimu na tahadhari za mapema' },
    { actor: 'INSTAT', role: 'Takwimu za watu (RGPH-3) na wilaya 114/119' },
    { actor: 'Wizara ya Afya (MSANP)', role: 'Lishe, afya ya jamii na magonjwa' },
    { actor: 'Wizara ya Fedha (MEF)', role: 'Bajeti (MGA/USD/EUR) na usimamizi wa fedha' },
    { actor: 'Mikoa na Wilaya (23 / 119)', role: 'Mipango ya maeneo na ufuatiliaji wa karibu' },
    { actor: 'NGO za Kitaifa na Kimataifa', role: 'Utekelezaji uwandani na misaada kwa jamii' },
    { actor: 'WFP, FAO, UNICEF, UNDP, WHO, IOM', role: 'Msaada wa kiufundi na kibinadamu' },
    { actor: 'Wafadhili wa Kimataifa', role: 'Ufadhili na ushauri wa kitaalamu' },
  ],
};

export function getLocalizedGovernance13Actors(lang: LanguageCode) {
  return lang === 'fr' ? GOVERNANCE_13_ACTORS : GOV_13_TR[lang];
}

const PHASES_6_TR: Record<Exclude<LanguageCode, 'fr'>, { phase: string; title: string; tasks: string[] }[]> = {
  en: [
    {
      phase: '1 · November – December 2026',
      title: 'Diagnostics & Preparedness',
      tasks: [
        'Build the 119-district database (Torolalana / INSTAT nomenclature)',
        'Collect INSTAT, Météo Madagascar & crop production baselines',
        'Identify vulnerable households and baseline hazard mapping',
        'Prepare territorial response budgets',
      ],
    },
    {
      phase: '2 · January – March 2027',
      title: 'Anticipation & Early Action',
      tasks: [
        'Monthly climate tracking (Météo Madagascar / CHIRPS)',
        'Agricultural production support & drought seed kit distribution',
        'Grain stock pre-positioning & water asset protection',
        'Operational partner coordination across corridors',
      ],
    },
    {
      phase: '3 · April – June 2027',
      title: 'Impact Assessment',
      tasks: [
        'Crop harvest assessment (CFSAM / MINAE) & loss measurement',
        'District-level IPC food security update',
        'Identify uncovered financing gaps',
      ],
    },
    {
      phase: '4 · July – September 2027',
      title: 'Lean Season Readiness',
      tasks: [
        'Targeted assistance to vulnerable households & livelihoods',
        'Supply pre-positioning ahead of peak lean months',
        'Preparation of the 2027–2028 agricultural season',
      ],
    },
    {
      phase: '5 · October – December 2027',
      title: 'Second Preparedness Cycle',
      tasks: [
        'Update seasonal forecasts and revise 2028 scenarios',
        'Adjust budgets and reinforce hydraulic infrastructure',
      ],
    },
    {
      phase: '6 · January – December 2028',
      title: 'Consolidation & Resilience',
      tasks: [
        'Evaluate interventions and rehabilitate damaged infrastructure',
        'Scale climate-resilient farming systems & final financial audit',
        'Prepare the 2029–2030 structural resilience program',
      ],
    },
  ],
  sw: [
    {
      phase: '1 · Novemba – Desemba 2026',
      title: 'Uchambuzi na Maandalizi',
      tasks: [
        'Kuunda hifadhidata ya wilaya 119 (Torolalana / INSTAT)',
        'Kukusanya takwimu za INSTAT, Météo Madagascar na kilimo',
        'Kutambua kaya zilizo hatarini na kuchora ramani za awali',
        'Kuandaa bajeti za mikoa na wilaya',
      ],
    },
    {
      phase: '2 · Januari – Machi 2027',
      title: 'Hatua za Mapema & Utekelezaji',
      tasks: [
        'Ufuatiliaji wa hali ya hewa kila mwezi (Météo Madagascar / CHIRPS)',
        'Msaada kwa kilimo na ugawaji wa mbegu bora',
        'Hifadhi ya chakula na ulinzi wa vyanzo vya maji',
        'Uratibu wa washirika uwandani',
      ],
    },
    {
      phase: '3 · Aprili – Juni 2027',
      title: 'Tathmini ya Athari',
      tasks: [
        'Tathmini ya mavuno (CFSAM / MINAE) na hasara za kilimo',
        'Kuhuisha uchambuzi wa IPC kwa kila wilaya',
        'Kutambua upungufu wa fedha unaohitaji kuzibwa',
      ],
    },
    {
      phase: '4 · Julai – Septemba 2027',
      title: 'Maandalizi ya Kipindi cha Uhaba',
      tasks: [
        'Misaada lengwa kwa kaya maskini',
        'Kusogeza akiba ya chakula karibu na walengwa',
        'Maandalizi ya msimu wa kilimo 2027–2028',
      ],
    },
    {
      phase: '5 · Oktoba – Desemba 2027',
      title: 'Mzunguko wa Pili wa Maandalizi',
      tasks: [
        'Kuhuisha utabiri wa msimu na hali za 2028',
        'Kurekebisha bajeti na kuimarisha miundombinu ya maji',
      ],
    },
    {
      phase: '6 · Januari – Desemba 2028',
      title: 'Uimarishaji na Ustahimilivu',
      tasks: [
        'Tathmini ya miradi na ukarabati wa miundombinu',
        'Kupanua kilimo himilivu na ripoti ya fedha',
        'Kuandaa mpango wa muda mrefu 2029–2030',
      ],
    },
  ],
};

export function getLocalizedPhases6(lang: LanguageCode) {
  return lang === 'fr' ? IMPLEMENTATION_PHASES_6 : PHASES_6_TR[lang];
}

const KPI_10_TR: Record<Exclude<LanguageCode, 'fr'>, { domain: string; kpi: string }[]> = {
  en: [
    { domain: 'Territorial coverage', kpi: '% of the 119 districts assessed and updated monthly' },
    { domain: 'Population', kpi: 'Number of exposed people requiring humanitarian aid' },
    { domain: 'Agriculture', kpi: 'Cropland hectares at risk by crop value chain' },
    { domain: 'Agriculture', kpi: 'Estimated production losses (tonnes and MGA)' },
    { domain: 'Water', kpi: 'Number of localities in severe water stress' },
    { domain: 'Humanitarian', kpi: 'People actually receiving food or cash assistance' },
    { domain: 'Finance', kpi: 'Funds mobilized vs total need (financing gap)' },
    { domain: 'Execution', kpi: 'Budget execution rate (committed vs disbursed)' },
    { domain: 'Coordination', kpi: 'Geolocated partner projects with zero territorial overlap' },
    { domain: 'Prevention', kpi: 'Average lead time between climate alert and field deployment' },
  ],
  sw: [
    { domain: 'Ufikiaji wa Maeneo', kpi: '% ya wilaya 119 zilizotathminiwa kila mwezi' },
    { domain: 'Idadi ya Watu', kpi: 'Idadi ya watu walio hatarini wanaohitaji msaada' },
    { domain: 'Kilimo', kpi: 'Hektari za mashamba zilizo hatarini kwa kila zao' },
    { domain: 'Kilimo', kpi: 'Makadirio ya hasara za uzalishaji (tani na MGA)' },
    { domain: 'Maji', kpi: 'Idadi ya vijiji vyenye uhaba mkubwa wa maji' },
    { domain: 'Kibinadamu', kpi: 'Watu waliopokea msaada wa chakula au fedha' },
    { domain: 'Fedha', kpi: 'Fedha zilizokusanywa dhidi ya mahitaji (pengo la fedha)' },
    { domain: 'Utekelezaji', kpi: 'Kiwango cha matumizi ya bajeti iliyotengwa' },
    { domain: 'Uratibu', kpi: 'Idadi ya miradi iliyoandikishwa bila kurudiana' },
    { domain: 'Kinga', kpi: 'Muda kati ya tahadhari ya hali ya hewa na hatua uwandani' },
  ],
};

export function getLocalizedNationalKpi10(lang: LanguageCode) {
  return lang === 'fr' ? NATIONAL_KPI_10 : KPI_10_TR[lang];
}

const STACK_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: [
    'Python (climate, demographic and scenario modeling)',
    'PostgreSQL / PostGIS (official 119-district spatial database)',
    'QGIS (thematic mapping of hazards and water points)',
    'Power BI (institutional reporting & financial consolidation)',
    'Sentinel-2 & satellite feeds (NDVI crop health tracking)',
    'Météo Madagascar & partner APIs (monthly updates)',
  ],
  sw: [
    'Python (uchambuzi wa tabianchi, idadi ya watu na mazingira)',
    'PostgreSQL / PostGIS (hifadhidata rasmi ya wilaya 119)',
    'QGIS (ramani za hatari na vyanzo vya maji)',
    'Power BI (ripoti za kitaasisi na bajeti)',
    'Sentinel-2 & data ya satelaiti (ufuatiliaji wa NDVI)',
    'Météo Madagascar & API za washirika (kila mwezi)',
  ],
};

export function getLocalizedDashboardStack(lang: LanguageCode) {
  return lang === 'fr' ? DASHBOARD_TECH_STACK : STACK_TR[lang];
}

const DATA_GAPS_TR: Record<Exclude<LanguageCode, 'fr'>, string[]> = {
  en: [
    'Disaggregated population by district & commune (114 / 119 crosswalk)',
    'District-level demographic growth projections',
    'Agricultural households registered per district',
    'Planted area broken down by crop',
    'Historical crop yields (2020–2026)',
    'Historical station / district rainfall time series',
    'Geolocated rural water-point inventory',
    'High-resolution floodplain delineation maps',
    'Local agricultural market prices (MGA)',
    'Declared historical crop loss registries',
    'Geolocated NGO & donor-funded ongoing projects',
    'Validated intervention unit costs by agro-zone',
  ],
  sw: [
    'Idadi ya watu kwa kila wilaya na kata (uhusiano 114 / 119)',
    'Makadirio ya ukuaji wa watu kwa wilaya',
    'Kaya za wakulima zilizosajiliwa kwa wilaya',
    'Eneo linalolimwa kwa kila aina ya zao',
    'Historia ya mavuno ya kilimo (2020–2026)',
    'Takwimu za mvua za kihistoria kwa kila kituo',
    'Ramani ya vyanzo vyote vya maji vijijini',
    'Ramani ya kina ya maeneo yanayokumbwa na mafuriko',
    'Bei za mazao katika masoko ya ndani (MGA)',
    'Historia ya hasara za kilimo zilizoripotiwa',
    'Miradi ya NGO na wafadhili iliyofadhiliwa tayari',
    'Gharama halisi zilizothibitishwa kwa kila kanda',
  ],
};

export function getLocalizedDataGaps12(lang: LanguageCode) {
  return lang === 'fr' ? INSTITUTIONAL_DATA_GAPS_12 : DATA_GAPS_TR[lang];
}

const FINAL_DELIV_TR: Record<Exclude<LanguageCode, 'fr'>, { code: string; title: string; desc: string }[]> = {
  en: [
    { code: 'Deliverable 01', title: 'National Strategic Report', desc: 'Context, diagnostics, methodology, scenarios, objectives & institutional recommendations.' },
    { code: 'Deliverable 02', title: '119-District Risk Atlas', desc: 'Complete territorial briefs, hazard maps, population exposure & priorities.' },
    { code: 'Deliverable 03', title: 'Projected Financial Model', desc: 'National, regional and district budgets (MGA/USD/EUR), crop losses & funding gap.' },
    { code: 'Deliverable 04', title: 'Partner Coordination Plan', desc: 'Responsibility matrix, NGO/project mapping, donor alignment & disbursements.' },
    { code: 'Deliverable 05', title: 'Digital Decision Dashboard', desc: 'Interactive maps, monthly climate tracking, exposed population & financial ledger.' },
    { code: 'Deliverable 06', title: 'M&E Results Framework', desc: 'KPI targets, owners, milestones and accountability audits.' },
  ],
  sw: [
    { code: 'Matokeo 01', title: 'Ripoti Mkakati ya Taifa', desc: 'Muktadha, uchambuzi, mbinu, malengo na mapendekezo ya kitaasisi.' },
    { code: 'Matokeo 02', title: 'Atlasi ya Wilaya 119', desc: 'Kadi kamili za wilaya, ramani za hatari, watu na vipaumbele.' },
    { code: 'Matokeo 03', title: 'Mfumo wa Bajeti ya Makadirio', desc: 'Bajeti ya taifa, mkoa na wilaya (MGA/USD/EUR) na pengo la ufadhili.' },
    { code: 'Matokeo 04', title: 'Mpango wa Uratibu wa Washirika', desc: 'Mgawanyo wa majukumu, ramani ya NGO, wafadhili na miradi.' },
    { code: 'Matokeo 05', title: 'Dashibodi ya Kidijitali', desc: 'Ramani shirikishi, hali ya hewa ya kila mwezi, watu na fedha.' },
    { code: 'Matokeo 06', title: 'Mfumo wa Ufuatiliaji na Tathmini', desc: 'Viashiria KPI, malengo, wahusika na ukaguzi.' },
  ],
};

export function getLocalizedFinalDeliverables6(lang: LanguageCode) {
  return lang === 'fr' ? FINAL_DELIVERABLES_6 : FINAL_DELIV_TR[lang];
}

const BUILD_SEQ_TR: Record<Exclude<LanguageCode, 'fr'>, { work: string; output: string }[]> = {
  en: [
    { work: '119-district reference layer', output: 'Validated administrative table (114 / 119)' },
    { work: 'Demographic database', output: 'District population & households (RGPH-3)' },
    { work: 'Climate risk diagnostic', output: 'Weighted risk scores & hazards per district' },
    { work: 'Agricultural assessment', output: 'Production & losses across 8 value chains' },
    { work: 'Social vulnerability assessment', output: 'Exposed & aid-requiring population' },
    { work: 'Financial costing', output: 'Consolidated needs in MGA, USD & EUR' },
    { work: 'Partner coordination', output: 'NGO, UN & donor coordination matrix' },
    { work: 'Consolidation', output: 'National report & monthly executive dashboard' },
  ],
  sw: [
    { work: 'Msingi wa wilaya 119', output: 'Jedwali rasmi la utawala (114 / 119)' },
    { work: 'Takwimu za idadi ya watu', output: 'Idadi ya watu na kaya kwa wilaya (RGPH-3)' },
    { work: 'Uchambuzi wa tabianchi', output: 'Alama za hatari za kila wilaya' },
    { work: 'Tathmini ya kilimo', output: 'Hasara na uzalishaji katika mazao 8' },
    { work: 'Tathmini ya kijamii', output: 'Watu walio hatarini wanaohitaji msaada' },
    { work: 'Upigaji bajeti', output: 'Mahitaji yote katika MGA, USD na EUR' },
    { work: 'Uratibu', output: 'Mpango wa pamoja wa NGO, UN na wafadhili' },
    { work: 'Uunganishaji', output: 'Ripoti ya taifa na dashibodi ya kila mwezi' },
  ],
};

export function getLocalizedBuildSequence8(lang: LanguageCode) {
  if (lang === 'fr') return BUILD_SEQUENCE_8;
  const tr = BUILD_SEQ_TR[lang];
  return BUILD_SEQUENCE_8.map((s, i) => ({ ...s, ...(tr[i] ?? {}) }));
}

const NGO_SAMPLE_TR: Record<Exclude<LanguageCode, 'fr'>, Record<string, Partial<NgoInterventionEntry>>> = {
  en: {
    'pam-sud-2026': {
      organization: 'WFP (World Food Programme)',
      commune: 'Ambovombe & 12 surrounding communes',
      sector: 'Food security & resilience',
      targetPopulation: 'IPC Phase 3–4 households and school canteens',
      duration: 'Aug 2026 – Jan 2027 ($44.1M national appeal)',
      unmetNeeds: '2027–2028 lean season extension and deep boreholes',
    },
    'fao-cashplus-anosy': {
      commune: 'Behara, Tranomaro, Sampona',
      sector: 'Agriculture & drought seeds',
      targetPopulation: 'Smallholder farmers and agro-pastoralists',
      duration: 'Oct 2026 – Sep 2027',
      unmetNeeds: 'Additional 90-day sorghum & drip-irrigation coverage',
    },
    'defis-vatovavy': {
      organization: 'MINAE / DEFIS Project (IFAD)',
      commune: 'Fitovinany lowland rice perimeters',
      sector: 'Rice, drainage & rural infrastructure',
      targetPopulation: 'Rice cooperatives and export growers',
      duration: 'Nov 2026 – Dec 2027',
      unmetNeeds: 'Coastal flood embankment rehab before cyclone season',
    },
  },
  sw: {
    'pam-sud-2026': {
      organization: 'WFP (Shirika la Chakula Duniani)',
      commune: 'Ambovombe & kata 12 jirani',
      sector: 'Usalama wa chakula & ustahimilivu',
      targetPopulation: 'Kaya za IPC 3–4 na programu za chakula shuleni',
      duration: 'Ago 2026 – Jan 2027 (ombi la kitaifa $44.1M)',
      unmetNeeds: 'Upanuzi wa msaada 2027–2028 na visima virefu',
    },
    'fao-cashplus-anosy': {
      commune: 'Behara, Tranomaro, Sampona',
      sector: 'Kilimo & mbegu stahimilivu',
      targetPopulation: 'Wakulima wadogo na wafugaji',
      duration: 'Okt 2026 – Sep 2027',
      unmetNeeds: 'Nyongeza ya mtama wa siku 90 na umwagiliaji wa matone',
    },
    'defis-vatovavy': {
      organization: 'MINAE / Mradi wa DEFIS (IFAD)',
      commune: 'Mabonde ya mpunga ya Fitovinany',
      sector: 'Mpunga, mifereji & miundombinu',
      targetPopulation: 'Vyama vya wakulima wa mpunga na mazao ya biashara',
      duration: 'Nov 2026 – Des 2027',
      unmetNeeds: 'Ukarabati wa kingo za kuzuia mafuriko ya pwani',
    },
  },
};

export function getLocalizedInitialNgoSample(lang: LanguageCode): NgoInterventionEntry[] {
  if (lang === 'fr') return INITIAL_NGO_REGISTRY_SAMPLE;
  const tr = NGO_SAMPLE_TR[lang];
  return INITIAL_NGO_REGISTRY_SAMPLE.map((e) => ({ ...e, ...(tr[e.id] ?? {}) }));
}
