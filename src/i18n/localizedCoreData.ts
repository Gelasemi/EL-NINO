import type { LanguageCode } from './LanguageContext';
import {
  HERO_METRICS,
  MECHANISM_STEPS,
  ENSO_COMPARISON,
  GLOBAL_REGIONAL_EFFECTS,
  MADAGASCAR_PROVINCES,
  AFRICA_BLOCS,
  RICE_PRICE_TRAJECTORY,
  COMMODITY_IMPACTS,
  AGRICULTURAL_ZONES,
  COOPERATIVE_AGENCIES,
  REFERENCE_SOURCES,
  type HeroMetric,
  type MechanismStep,
  type EnsoComparisonRow,
  type GlobalRegionEffect,
  type MadagascarProvinceZone,
  type AfricaBlocImpact,
  type RicePricePoint,
  type CommodityImpact,
  type AgriculturalZoneTechnique,
  type CooperativeAgency,
  type ReferenceSource,
} from '../data/ensoData';

const HERO_METRICS_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<string, Partial<HeroMetric>>
> = {
  en: {
    'sst-current': {
      label: 'Central Pacific Anomaly',
      value: '+3.5',
      unit: '°C (Nov 2026)',
      context: 'Current equatorial Pacific sea-surface temperature anomaly',
    },
    'sst-peak': {
      label: 'Projected Record Peak',
      value: '+4.1',
      unit: '°C (Jan 2027)',
      context: 'Upper WMO forecast envelope for the 2026–2027 Super El Niño',
    },
    'madagascar-food': {
      label: 'Food Insecurity (Madagascar)',
      value: '3.72M',
      unit: 'people',
      context: 'Exposed population Oct 2026 – Feb 2027 (FAO), peaking in Androy',
    },
    'rice-peak': {
      label: 'Local Rice Antananarivo',
      value: '3,200',
      unit: 'MGA / kg',
      context: 'Projected seasonal peak in Jan–Feb 2027 (FEWS NET)',
    },
  },
  sw: {
    'sst-current': {
      label: 'Joto la Pasifiki ya Kati',
      value: '+3.5',
      unit: '°C (Nov 2026)',
      context: 'Kiwango cha sasa cha joto la juu la bahari katika Pasifiki ya ikweta',
    },
    'sst-peak': {
      label: 'Kilele Kinachotarajiwa',
      value: '+4.1',
      unit: '°C (Jan 2027)',
      context: 'Makadirio ya juu ya WMO kwa tukio la El Niño Kuu',
    },
    'madagascar-food': {
      label: 'Uhaba wa Chakula (Madagaska)',
      value: '3.72M',
      unit: 'watu',
      context: 'Watu walio hatarini Okt 2026 – Feb 2027 (FAO), kilele Androy',
    },
    'rice-peak': {
      label: 'Mchele Antananarivo',
      value: '3,200',
      unit: 'MGA / kg',
      context: 'Kilele cha bei Jan–Feb 2027 (FEWS NET)',
    },
  },
};

export function getLocalizedHeroMetrics(lang: LanguageCode): HeroMetric[] {
  if (lang === 'fr') return HERO_METRICS;
  const dict = HERO_METRICS_TRANSLATIONS[lang];
  return HERO_METRICS.map((m) => ({ ...m, ...(dict[m.id] ?? {}) }));
}

const MECHANISM_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, MechanismStep[]> = {
  en: [
    {
      index: '01',
      title: 'Trade-Wind Dynamics',
      elNinoDetail:
        'Normally, trade winds push warm surface waters toward the western Pacific. During El Niño, those winds weaken sharply or reverse.',
      laNinaDetail:
        'During La Niña, east-to-west trade winds intensify strongly, piling up even warmer surface water toward Indonesia and Australia.',
    },
    {
      index: '02',
      title: 'Water Mass Shift & Upwelling',
      elNinoDetail:
        'Without wind push, a huge warm water mass surges back toward South America, blocking cold, nutrient-rich upwelling off Peru and Ecuador.',
      laNinaDetail:
        'Stronger westward transport intensifies deep cold-water upwelling along Peruvian and Ecuadorian coasts, cooling sea-surface temperatures.',
    },
    {
      index: '03',
      title: 'Shift of Convection & Rainfall',
      elNinoDetail:
        'Intense evaporation above abnormally warm waters shifts cloud bands and storms toward the central and eastern Pacific, inverting global rainfall patterns.',
      laNinaDetail:
        'Storm convection concentrates over the far western Pacific and Southeast Asia, boosting rains in Southern Africa & Madagascar while drying East Africa.',
    },
  ],
  sw: [
    {
      index: '01',
      title: 'Mwenendo wa Pepo za Biashara',
      elNinoDetail:
        'Kwa kawaida pepo za biashara husukuma maji ya joto magharibi mwa Pasifiki. Wakati wa El Niño, pepo hizo hudhoofika au kugeuka.',
      laNinaDetail:
        'Wakati wa La Niña, pepo za mashariki kwenda magharibi huongezeka kwa nguvu na kusukuma maji ya joto zaidi kuelekea Indonesia na Australia.',
    },
    {
      index: '02',
      title: 'Kuhama kwa Maji na Upwelling',
      elNinoDetail:
        'Bila msukumo wa pepo, maji ya joto hurudi kuelekea pwani ya Amerika Kusini na kuzuia kupanda kwa maji baridi yenye virutubisho karibu na Peru.',
      laNinaDetail:
        'Msukumo mkali kuelekea magharibi huongeza kupanda kwa maji baridi kutoka vilindini karibu na Peru na Ecuador, na kupunguza joto la bahari.',
    },
    {
      index: '03',
      title: 'Mabadiliko ya Mawingu na Mvua',
      elNinoDetail:
        'Uvukizi mwingi juu ya maji ya joto huhamishia ukanda wa mvua na dhoruba katikati na mashariki mwa Pasifiki, ukigeuza mifumo ya mvua duniani.',
      laNinaDetail:
        'Mvua za dhoruba hukusanyika magharibi mwa Pasifiki na Asia Kusini-Mashariki, zikiongeza mvua Kusini mwa Afrika na Madagaska na kuleta ukame Afrika Mashariki.',
    },
  ],
};

export function getLocalizedMechanismSteps(lang: LanguageCode): MechanismStep[] {
  return lang === 'fr' ? MECHANISM_STEPS : MECHANISM_TRANSLATIONS[lang];
}

const ENSO_COMPARISON_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, EnsoComparisonRow[]> = {
  en: [
    {
      criterion: 'Pacific Sea Surface Temp.',
      elNino: 'Abnormal surface warming in central & eastern Pacific (+3.5 °C to +4.1 °C in 2026–2027).',
      laNina: 'Abnormal cooling across the same equatorial Pacific surface belt.',
    },
    {
      criterion: 'Trade Winds',
      elNino: 'Weakening or reversal of east-to-west winds.',
      laNina: 'Marked strengthening of east-to-west trade winds.',
    },
    {
      criterion: 'Global Temperature',
      elNino: 'Temporarily boosts global mean temperature (100,000+ excess tropical heat deaths/yr).',
      laNina: 'Slightly dampens global average surface warmth.',
    },
    {
      criterion: 'Southern Africa & Madagascar',
      elNino: 'Severe drought in the South, extreme heat (+2 to +4 °C), fewer basin cyclones overall.',
      laNina: 'Abundant rains, flood risk, and more active Southwest Indian Ocean cyclone season.',
    },
    {
      criterion: 'East Africa',
      elNino: 'Torrential rains and major river flooding between October and December.',
      laNina: 'Severe droughts and prolonged rainy season delays.',
    },
  ],
  sw: [
    {
      criterion: 'Joto la Bahari ya Pasifiki',
      elNino: 'Ongezeko lisilo la kawaida la joto katikati na mashariki mwa Pasifiki (+3.5 °C hadi +4.1 °C mwaka 2026–2027).',
      laNina: 'Kupoa kwa kiwango kisicho cha kawaida katika ukanda huo wa ikweta.',
    },
    {
      criterion: 'Pepo za Biashara',
      elNino: 'Kudhoofika au kugeuka kwa pepo za mashariki kwenda magharibi.',
      laNina: 'Kuimarika kwa nguvu kwa pepo za mashariki kwenda magharibi.',
    },
    {
      criterion: 'Joto la Dunia',
      elNino: 'Huongeza kwa muda wastani wa joto la dunia (vifo 100,000+ kutokana na joto kali kila mwaka).',
      laNina: 'Hupunguza kidogo wastani wa joto duniani.',
    },
    {
      criterion: 'Kusini mwa Afrika & Madagaska',
      elNino: 'Ukame Kusini, joto kali (+2 hadi +4 °C), na kupungua kwa idadi ya vimbunga kwa ujumla.',
      laNina: 'Mvua nyingi, hatari ya mafuriko na msimu wenye vimbunga vingi zaidi.',
    },
    {
      criterion: 'Afrika Mashariki',
      elNino: 'Mvua kubwa na mafuriko makubwa kati ya Oktoba na Desemba.',
      laNina: 'Ukame mkali na kuchelewa kwa muda mrefu kwa mvua.',
    },
  ],
};

export function getLocalizedEnsoComparison(lang: LanguageCode): EnsoComparisonRow[] {
  return lang === 'fr' ? ENSO_COMPARISON : ENSO_COMPARISON_TRANSLATIONS[lang];
}

const GLOBAL_EFFECTS_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, GlobalRegionEffect[]> = {
  en: [
    {
      region: 'South America (West Coast)',
      effects: 'Heavy rains and flooding in Peru and Ecuador; anchovy & coastal fishery collapse as upwelling stalls.',
      dominantRisk: 'Inondations',
    },
    {
      region: 'Oceania & Southeast Asia',
      effects: 'Severe droughts, heatwaves, weakened monsoon rains, and elevated wildfire hazard across Australia and Indonesia.',
      dominantRisk: 'Sécheresse',
    },
    {
      region: 'Southern Africa & Madagascar',
      effects: 'Sharp rainfall deficit and drought risk during the austral summer (Nov–Mar), amplified by positive IOD.',
      dominantRisk: 'Sécheresse',
    },
    {
      region: 'Horn of Africa',
      effects: 'Above-average rainfall and riverine flood emergencies between October and December.',
      dominantRisk: 'Inondations',
    },
    {
      region: 'North America',
      effects: 'Milder winters across northern latitudes and wetter storm tracks across California and the US South.',
      dominantRisk: 'Contraste thermique',
    },
  ],
  sw: [
    {
      region: 'Amerika Kusini (Pwani ya Magharibi)',
      effects: 'Mvua kubwa na mafuriko Peru na Ecuador; kuporomoka kwa uvuvi kutokana na kuzuiwa kwa maji baridi.',
      dominantRisk: 'Inondations',
    },
    {
      region: 'Oceania na Asia Kusini-Mashariki',
      effects: 'Ukame mkali, mawimbi ya joto, monsuni dhaifu na hatari kubwa ya moto Australia na Indonesia.',
      dominantRisk: 'Sécheresse',
    },
    {
      region: 'Kusini mwa Afrika na Madagaska',
      effects: 'Upungufu mkubwa wa mvua na ukame wakati wa kiangazi cha kusini (Nov–Mac), ikichochewa na IOD chanya.',
      dominantRisk: 'Sécheresse',
    },
    {
      region: 'Pembe ya Afrika',
      effects: 'Mvua nyingi kuliko kawaida na hatari ya mafuriko ya mito kati ya Oktoba na Desemba.',
      dominantRisk: 'Inondations',
    },
    {
      region: 'Amerika Kaskazini',
      effects: 'Baridi nafuu zaidi kaskazini na mvua nyingi kusini mwa Marekani na California.',
      dominantRisk: 'Contraste thermique',
    },
  ],
};

export function getLocalizedGlobalEffects(lang: LanguageCode): GlobalRegionEffect[] {
  return lang === 'fr' ? GLOBAL_REGIONAL_EFFECTS : GLOBAL_EFFECTS_TRANSLATIONS[lang];
}

const MADAGASCAR_PROVINCES_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<MadagascarProvinceZone['id'], Partial<MadagascarProvinceZone>>
> = {
  en: {
    toliara: {
      exProvince: 'Former Toliara Province',
      zoneLabel: 'Grand Sud & South-West',
      riskSummary:
        'Severe drought, early lean season, and maize yield collapse. Critical child nutrition emergency in Androy.',
      rainfallAnomaly: 'Severe rainfall deficit',
      tempAnomaly: '+2 to +4 °C above normal',
      measures: [
        'WFP emergency food distributions and Cash+ mobile transfers',
        'Drought-resilient millet & sorghum seed distribution to 32,000 farmers',
        'Deployment of mobile clinics for acute childhood malnutrition',
      ],
    },
    fianarantsoa: {
      exProvince: 'Former Fianarantsoa Province',
      zoneLabel: 'Grand South-East & Southern Highlands',
      riskSummary: 'Cumulative watershed water deficit and high nutritional vulnerability during the lean season.',
      rainfallAnomaly: 'Cumulative water deficit',
      tempAnomaly: '+1.5 to +3 °C',
      measures: [
        'Cash-for-Work (HIMO) programs to rehabilitate irrigation perimeters',
        'Expansion of rural school feeding canteens',
        'Preventive community nutrition screening',
      ],
    },
    'centre-est': {
      exProvince: 'Antananarivo & Toamasina',
      zoneLabel: 'Central Plateau & East Coast',
      riskSummary:
        'Irregular rainfall across key rice bowls, input cost stress, and seasonal urban local rice price spikes.',
      rainfallAnomaly: 'Erratic onset · Fewer East Coast cyclones',
      tempAnomaly: '+1.5 to +2.5 °C',
      measures: [
        'State buffer rice imports to contain the 3,200 MGA/kg price peak',
        'ANMCC price audits protecting farmers and urban consumers',
        'Stock monitoring against speculative hoarding',
      ],
    },
    mahajanga: {
      exProvince: 'Former Mahajanga Province',
      zoneLabel: 'North-West',
      riskSummary: 'Delayed monsoon and high heat across major rice plains (Marovoay, Sofia), elevating locust swarm risk.',
      rainfallAnomaly: 'Delayed rain onset (December shift)',
      tempAnomaly: '+2 to +3 °C',
      measures: [
        'Priority desilting of irrigation canals ahead of low river flow',
        'Subsidized fertilizer vouchers via DRAE / FDA desks',
        'Preventive locust surveillance and early control',
      ],
    },
    antsiranana: {
      exProvince: 'Former Antsiranana Province',
      zoneLabel: 'Far North',
      riskSummary:
        'Opposite anomaly to the South: excess Nov–Jan rains causing localized floods and heat stress on vanilla flowering.',
      rainfallAnomaly: 'Excess rainfall (Nov – Jan)',
      tempAnomaly: 'Daytime heat spikes',
      measures: [
        'Pre-positioning of BNGRC food stocks and shelter kits',
        'Clearing urban storm drains prior to January downpours',
        'Reinforcing Gliricidia shade trees over vanilla vines',
      ],
    },
  },
  sw: {
    toliara: {
      exProvince: 'Jimbo la Zamani la Toliara',
      zoneLabel: 'Kusini Kuu na Kusini-Magharibi',
      riskSummary:
        'Ukame mkali, kipindi cha uhaba wa mapema na kuporomoka kwa mavuno ya mahindi. Hali hatari ya utapiamlo katika Androy.',
      rainfallAnomaly: 'Upungufu mkubwa wa mvua',
      tempAnomaly: '+2 hadi +4 °C juu ya kawaida',
      measures: [
        'Usambazaji wa chakula cha dharura cha WFP na msaada wa fedha (Cash+)',
        'Ugawaji wa mbegu zinazostahimili ukame za uwele na mtama kwa wakulima 32,000',
        'Kliniki tembezi za kutibu utapiamlo mkali kwa watoto',
      ],
    },
    fianarantsoa: {
      exProvince: 'Jimbo la Zamani la Fianarantsoa',
      zoneLabel: 'Kusini-Mashariki na Nyanda za Juu Kusini',
      riskSummary: 'Upungufu wa maji katika mabonde na hatari kubwa ya uhaba wa chakula.',
      rainfallAnomaly: 'Upungufu wa maji uliokusanyika',
      tempAnomaly: '+1.5 hadi +3 °C',
      measures: [
        'Miradi ya ajira ya muda (HIMO) kukarabati mifereji ya umwagiliaji',
        'Upanuzi wa programu za chakula shuleni vijijini',
        'Ufuatiliaji wa mapema wa lishe katika jamii',
      ],
    },
    'centre-est': {
      exProvince: 'Antananarivo & Toamasina',
      zoneLabel: 'Kati na Pwani ya Mashariki',
      riskSummary:
        'Mvua zisizo za kawaida katika mabonde ya mpunga na kupanda kwa bei ya mchele mijini.',
      rainfallAnomaly: 'Mwanzo usio imara · Kupungua kwa vimbunga Mashariki',
      tempAnomaly: '+1.5 hadi +2.5 °C',
      measures: [
        'Uagizaji wa mchele wa akiba wa serikali kudhibiti kilele cha MGA 3,200/kg',
        'Ukaguzi wa ANMCC kulinda wakulima na walaji',
        'Ufuatiliaji wa maghala kuzuia ulanguzi wa chakula',
      ],
    },
    mahajanga: {
      exProvince: 'Jimbo la Zamani la Mahajanga',
      zoneLabel: 'Kaskazini-Magharibi',
      riskSummary: 'Kuchelewa kwa mvua na joto kali katika mabonde ya Marovoay na Sofia, kukiongeza hatari ya nzige.',
      rainfallAnomaly: 'Kuchelewa kwa mvua za mwanzo (hadi Desemba)',
      tempAnomaly: '+2 hadi +3 °C',
      measures: [
        'Kusafisha mifereji ya umwagiliaji mapema',
        'Msaada wa mbolea ya ruzuku kupitia DRAE / FDA',
        'Ufuatiliaji wa mapema wa makundi ya nzige',
      ],
    },
    antsiranana: {
      exProvince: 'Jimbo la Zamani la Antsiranana',
      zoneLabel: 'Kaskazini ya Mbali',
      riskSummary:
        'Kinyume cha Kusini: mvua nyingi Novemba–Januari zinazosababisha mafuriko na joto kali linaloathiri maua ya vanilla.',
      rainfallAnomaly: 'Mvua za ziada (Nov – Jan)',
      tempAnomaly: 'Joto kali la mchana',
      measures: [
        'Kuhifadhi mapema chakula na mahema ya dharura kupitia BNGRC',
        'Kusafisha mitaro ya maji ya miji kabla ya mvua za Januari',
        'Kuongeza miti ya kivuli (Gliricidia) kulinda mimea ya vanilla',
      ],
    },
  },
};

export function getLocalizedMadagascarProvinces(lang: LanguageCode): MadagascarProvinceZone[] {
  if (lang === 'fr') return MADAGASCAR_PROVINCES;
  const dict = MADAGASCAR_PROVINCES_TRANSLATIONS[lang];
  return MADAGASCAR_PROVINCES.map((p) => ({ ...p, ...(dict[p.id] ?? {}) }));
}

const AFRICA_BLOCS_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<string, Partial<AfricaBlocImpact>>
> = {
  en: {
    'zambie-zimbabwe': {
      regionOrBloc: 'Zambia & Zimbabwe (SADC Region)',
      countries: 'Zambia, Zimbabwe, Zambezi Basin',
      climateSignal: 'Severe rain delay and prolonged drought across the austral summer.',
      economicAndFoodImpact:
        'White maize collapse alongside critical drawdown at Kariba Dam, forcing power rationing and costly thermal generation.',
      emergencyResponse:
        'National drought plans: large-scale white maize imports, free drought-tolerant seeds, and scheduled load shedding.',
      severityLabel: 'Drought & Power Alert',
    },
    'malawi-mozambique': {
      regionOrBloc: 'Malawi, Mozambique & Western SADC',
      countries: 'Malawi, Mozambique, Botswana, Namibia',
      climateSignal: 'Widespread rainfall deficit and thermal stress on rainfed staples.',
      economicAndFoodImpact: 'Depletion of rural household food reserves and steep main-season maize losses.',
      emergencyResponse:
        'Emergency cash transfers via national social registries and subsidized winter/wetland off-season crop inputs.',
      severityLabel: 'Social & Off-Season Response',
    },
    'afrique-sud': {
      regionOrBloc: 'South Africa (Maize Belt)',
      countries: 'South Africa and SADC logistics corridors',
      climateSignal: 'Intense heatwaves and soil drying across the central grain belt.',
      economicAndFoodImpact:
        'Lower maize and grain output, raising import logistics pressure for neighboring landlocked nations.',
      emergencyResponse:
        'Release of national grain carry-over stocks, livestock fodder subsidies, and regional port coordination.',
      severityLabel: 'Grain & Logistics Strain',
    },
    'comesa-corne': {
      regionOrBloc: 'COMESA & Horn of Africa',
      countries: 'Kenya, Uganda, Ethiopia, Somalia (North COMESA) vs Zambia/Malawi/Madagascar (South)',
      climateSignal: 'The COMESA common market splits in two: torrential flooding in the North (Oct–Dec) vs drought in the South.',
      economicAndFoodImpact:
        'Washouts of key roads, bridges, and trade corridors across East Africa (Tana, Shabelle river basins).',
      emergencyResponse:
        'Pre-emptive riverine evacuations, anti-cholera WASH kits, and livestock vaccination against flood-borne disease.',
      severityLabel: 'Floods & Corridor Disruption',
    },
    'sahel-ouest': {
      regionOrBloc: 'West Africa & Sahel Belt',
      countries: 'Burkina Faso, Mali, Niger and coastal cocoa belt',
      climateSignal: 'Indirect teleconnection: disrupted monsoon, stronger Harmattan winds, and Sahel dry spells.',
      economicAndFoodImpact:
        'Stress on millet, sorghum, and pasturelands paired with cocoa and coffee yield drops along the humid coast.',
      emergencyResponse:
        'Price caps on local staples (rice, millet), market inspections, and subsidized release of national buffer stocks.',
      severityLabel: 'Price Controls & Stocks',
    },
    'nord-centrale': {
      regionOrBloc: 'North & Central Africa',
      countries: 'Morocco, Maghreb · Congo Basin and savanna belt',
      climateSignal:
        'Highly erratic rains and warming in Central Africa; persistent winter drought risk in the Maghreb.',
      economicAndFoodImpact:
        'Disrupted planting calendars across Central Africa and fresh produce supply pressure in Morocco.',
      emergencyResponse:
        'Temporary suspension of selected vegetable exports in Morocco alongside continued wheat and irrigation subsidies.',
      severityLabel: 'Agri & Water Regulation',
    },
  },
  sw: {
    'zambie-zimbabwe': {
      regionOrBloc: 'Zambia na Zimbabwe (Jumuiya ya SADC)',
      countries: 'Zambia, Zimbabwe, Bonde la Zambezi',
      climateSignal: 'Kuchelewa sana kwa mvua na ukame mrefu wakati wa kiangazi cha kusini.',
      economicAndFoodImpact:
        'Kuporomoka kwa mavuno ya mahindi meupe na kushuka kwa maji ya Bwawa la Kariba, kulikosababisha mgao wa umeme.',
      emergencyResponse:
        'Mipango ya taifa ya ukame: uagizaji mkubwa wa mahindi, mbegu zinazostahimili ukame na mgao wa umeme.',
      severityLabel: 'Tahadhari ya Ukame & Nishati',
    },
    'malawi-mozambique': {
      regionOrBloc: 'Malawi, Msumbiji na SADC Magharibi',
      countries: 'Malawi, Msumbiji, Botswana, Namibia',
      climateSignal: 'Upungufu wa mvua na joto kali kwa mazao yanayotegemea mvua.',
      economicAndFoodImpact: 'Kudhoofika kwa akiba ya chakula vijijini na hasara kubwa ya mahindi.',
      emergencyResponse:
        'Misaada ya fedha taslimu kwa kaya maskini na ruzuku ya pembejeo za kilimo cha mabondeni.',
      severityLabel: 'Msaada wa Jamii',
    },
    'afrique-sud': {
      regionOrBloc: 'Afrika Kusini (Ukanda wa Nafaka)',
      countries: 'Afrika Kusini na njia za usafirishaji za SADC',
      climateSignal: 'Joto kali na ukavu wa udongo katika ukanda wa kati wa kilimo.',
      economicAndFoodImpact:
        'Kupungua kwa uzalishaji wa mahindi na kuongezeka kwa gharama za uagizaji chakula kwa nchi jirani.',
      emergencyResponse:
        'Kufungua akiba ya kitaifa ya nafaka, ruzuku ya malisho ya mifugo na uratibu wa bandari.',
      severityLabel: 'Shinikizo la Nafaka & Bandari',
    },
    'comesa-corne': {
      regionOrBloc: 'COMESA na Pembe ya Afrika',
      countries: 'Kenya, Uganda, Ethiopia, Somalia (Kaskazini) dhidi ya Zambia/Malawi/Madagaska (Kusini)',
      climateSignal: 'Soko la COMESA limegawanyika: mvua kubwa kaskazini (Okt–Des) na ukame kusini.',
      economicAndFoodImpact:
        'Kuharibika kwa barabara na madaraja pamoja na kukatika kwa usafirishaji Afrika Mashariki.',
      emergencyResponse:
        'Kuhamisha wakazi kando ya mito, vifaa vya usafi kuzuia kipindupindu na chanjo ya mifugo.',
      severityLabel: 'Mafuriko na Kukatika kwa Njia',
    },
    'sahel-ouest': {
      regionOrBloc: 'Afrika Magharibi na Ukanda wa Sahel',
      countries: 'Burkina Faso, Mali, Niger na ukanda wa pwani',
      climateSignal: 'Athari zisizo za moja kwa moja: kuvurugika kwa monsuni na upepo mkavu wa Harmattan.',
      economicAndFoodImpact:
        'Kuathirika kwa mtama, uwele na malisho pamoja na upungufu wa kakao na kahawa pwani.',
      emergencyResponse:
        'Kudhibiti bei za nafaka za ndani na kutoa akiba ya taifa kwa bei nafuu.',
      severityLabel: 'Udhibiti wa Bei na Akiba',
    },
    'nord-centrale': {
      regionOrBloc: 'Afrika Kaskazini na Afrika ya Kati',
      countries: 'Moroko, Maghreb · Bonde la Kongo',
      climateSignal: 'Mvua zisizoaminika Afrika ya Kati na hatari ya ukame wa baridi katika Maghreb.',
      economicAndFoodImpact: 'Kuvurugika kwa kalenda za kilimo Afrika ya Kati na uhaba wa mbogamboga Moroko.',
      emergencyResponse: 'Kusimamisha baadhi ya mauzo ya mboga nje na kuendeleza ruzuku ya ngano na umwagiliaji.',
      severityLabel: 'Udhibiti wa Kilimo na Maji',
    },
  },
};

export function getLocalizedAfricaBlocs(lang: LanguageCode): AfricaBlocImpact[] {
  if (lang === 'fr') return AFRICA_BLOCS;
  const dict = AFRICA_BLOCS_TRANSLATIONS[lang];
  return AFRICA_BLOCS.map((b) => ({ ...b, ...(dict[b.id] ?? {}) }));
}

const RICE_PRICE_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, { month: string; note?: string }[]> = {
  en: [
    { month: 'Jul 2026' },
    { month: 'Aug 2026' },
    { month: 'Sep 2026' },
    { month: 'Oct 2026', note: 'FOFIFA sowing calendars published' },
    { month: 'Nov 2026', note: 'Active Super El Niño (+3.5 °C)' },
    { month: 'Dec 2026', note: 'Lean season & fuel cost pressure' },
    { month: 'Jan 2027', note: 'FEWS NET projected peak' },
    { month: 'Feb 2027', note: 'High plateau prior to harvest' },
  ],
  sw: [
    { month: 'Jul 2026' },
    { month: 'Ago 2026' },
    { month: 'Sep 2026' },
    { month: 'Okt 2026', note: 'Kalenda za FOFIFA zatolewa' },
    { month: 'Nov 2026', note: 'El Niño Kuu inaendelea (+3.5 °C)' },
    { month: 'Des 2026', note: 'Shinikizo la uhaba na mafuta' },
    { month: 'Jan 2027', note: 'Kilele cha FEWS NET' },
    { month: 'Feb 2027', note: 'Bei ya juu kabla ya mavuno' },
  ],
};

export function getLocalizedRicePrices(lang: LanguageCode): RicePricePoint[] {
  if (lang === 'fr') return RICE_PRICE_TRAJECTORY;
  const tr = RICE_PRICE_TRANSLATIONS[lang];
  return RICE_PRICE_TRAJECTORY.map((pt, i) => ({
    ...pt,
    month: tr[i]?.month ?? pt.month,
    note: tr[i]?.note ?? pt.note,
  }));
}

const COMMODITY_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, CommodityImpact[]> = {
  en: [
    {
      commodity: 'Rice (Asia & Madagascar)',
      region: 'India, Southeast Asia, Antananarivo',
      mechanism: 'Weakened Asian monsoon tightening export supply alongside higher local fuel transport costs.',
      marketPressure: 'Projected peak at 3,200 MGA/kg in Antananarivo (Jan–Feb 2027).',
    },
    {
      commodity: 'Maize, Cassava & Pulses',
      region: 'Southern Africa, Madagascar Grand Sud',
      mechanism: 'Collapse of rainfed maize yields under water deficit and +2 to +4 °C heat stress.',
      marketPressure: 'Demand substitution driving steep price inflation across cassava, pulses, and vegetable oil.',
    },
    {
      commodity: 'Cocoa, Coffee & Vanilla',
      region: 'West Africa, South America, SAVA',
      mechanism: 'Tropical thermal stress and daytime heat peaks requiring dense vine shading.',
      marketPressure: 'Heavy yield drops on cocoa/coffee; quality and Fusarium alert on Madagascar vanilla.',
    },
    {
      commodity: 'Hydroelectric Power',
      region: 'Kariba Dam (Zambia/Zimbabwe), South America',
      mechanism: 'Prolonged river inflow decline cutting output across major hydropower reservoirs.',
      marketPressure: 'Expensive switch to thermal diesel generation, widening fiscal deficits and slowing industry.',
    },
  ],
  sw: [
    {
      commodity: 'Mchele (Asia & Madagaska)',
      region: 'India, Asia Kusini-Mashariki, Antananarivo',
      mechanism: 'Monsuni dhaifu Asia inapunguza mauzo nje pamoja na gharama kubwa za mafuta na usafiri.',
      marketPressure: 'Kilele kinachotarajiwa MGA 3,200/kg Antananarivo (Jan–Feb 2027).',
    },
    {
      commodity: 'Mahindi, Muhogo na Kunde',
      region: 'Kusini mwa Afrika, Kusini Kuu ya Madagaska',
      mechanism: 'Kuporomoka kwa mahindi yanayotegemea mvua kutokana na ukame na joto (+2 hadi +4 °C).',
      marketPressure: 'Watu kuhamia muhogo na kunde kunapandisha bei za vyakula mbadala.',
    },
    {
      commodity: 'Kakao, Kahawa na Vanilla',
      region: 'Afrika Magharibi, Amerika Kusini, SAVA',
      mechanism: 'Joto kali katika ukanda wa tropiki linalohitaji miti ya kivuli kwa mimea.',
      marketPressure: 'Hasara kubwa kwenye kakao/kahawa; tahadhari kwa ubora wa vanilla ya Madagaska.',
    },
    {
      commodity: 'Umeme wa Maji',
      region: 'Bwawa la Kariba (Zambia/Zimbabwe), Amerika Kusini',
      mechanism: 'Kupungua kwa maji ya mito kunakopunguza uzalishaji wa umeme katika mabwawa makubwa.',
      marketPressure: 'Matumizi ghali ya jenereta za mafuta na kupungua kwa uzalishaji viwandani.',
    },
  ],
};

export function getLocalizedCommodities(lang: LanguageCode): CommodityImpact[] {
  return lang === 'fr' ? COMMODITY_IMPACTS : COMMODITY_TRANSLATIONS[lang];
}

const AGRI_ZONE_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<AgriculturalZoneTechnique['id'], Partial<AgriculturalZoneTechnique>>
> = {
  en: {
    'grand-sud': {
      title: 'Grand Sud & South-West',
      sowingWindow: 'Mid-December 2026 to January 2027',
      triggerRule: 'Wait for at least 20 to 30 mm cumulative rainfall over 3 consecutive days before planting.',
      priorityCrops: ['Sorghum (90-day cycle)', 'Pearl Millet (90-day)', 'Pigeon Pea (Ambatry)', 'Cowpea / Lablab', 'Tolerant Cassava'],
      cropAssociation:
        'Intercrop sorghum or millet with spreading legumes (cowpea/lablab) to shade soil and cut evaporation, bordered by pigeon pea windbreaks and spineless cactus / sisal against sand drift.',
      waterAndSoilPractice:
        'Zaï pits: dig 20 cm planting basins filled with compost or manure prior to rains, combined with inter-row mulching and contour earth bunds.',
      calendarBars: [
        { crop: 'Sorghum & Millet (90d)', cycleDays: '90 days', startMonthIdx: 2.3, endMonthIdx: 5.2, note: 'Sow mid-Dec–Jan after 20–30 mm rain' },
        { crop: 'Cowpea / Lablab intercrop', cycleDays: '75–90 days', startMonthIdx: 2.3, endMonthIdx: 4.8, note: 'Anti-evaporation soil cover' },
        { crop: 'Pigeon Pea (Ambatry)', cycleDays: 'Perennial / Windbreak', startMonthIdx: 1.5, endMonthIdx: 5.5, note: 'Nitrogen fixation & wind shelter' },
        { crop: 'Resilient Cassava cuttings', cycleDays: '6–9 months', startMonthIdx: 1.8, endMonthIdx: 5.5, note: 'Planted inside Zaï basins' },
      ],
    },
    'hautes-terres': {
      title: 'Central Highlands',
      sowingWindow: 'Mid-November to Mid-December 2026',
      triggerRule: 'Select intermediate 110–120 day varieties on rainfed slopes (tanety) and young-seedling SRI in irrigated paddies.',
      priorityCrops: ['Irrigated Rice (SRI / SRA)', 'Upland Rice (tanety)', 'Maize (110–120d)', 'Climbing Bean / Soy'],
      cropAssociation:
        'Direct seeding under permanent mulch cover (SCV) pairing maize with climbing bean or soybean; plant Brachiaria or vetiver grass strips along slopes for runoff capture and fodder.',
      waterAndSoilPractice:
        'In irrigated rice systems, transplant young 8–12 day seedlings (SRI/SRA method) and desilt feeder canals through HIMO labor.',
      calendarBars: [
        { crop: 'Upland Rice & Maize (tanety)', cycleDays: '110–120 days', startMonthIdx: 1.4, endMonthIdx: 4.9, note: 'Sow mid-Nov to mid-Dec under SCV' },
        { crop: 'Irrigated Rice SRI/SRA', cycleDays: '120–135 days', startMonthIdx: 1.0, endMonthIdx: 4.8, note: 'Young seedlings 8–12 days' },
        { crop: 'Climbing Bean / Soybean', cycleDays: '90–105 days', startMonthIdx: 1.5, endMonthIdx: 4.5, note: 'Direct intercrop with maize' },
        { crop: 'Brachiaria / Vetiver strips', cycleDays: 'Permanent', startMonthIdx: 0.8, endMonthIdx: 5.5, note: 'Slope erosion control' },
      ],
    },
    'nord-ouest': {
      title: 'North & North-West',
      sowingWindow: 'November (drained Diana/Sava) · December (Boeny/Sofia)',
      triggerRule: 'Two opposite calendars: plant early on drained plots in the North (excess rain); delay to December in the North-West (late rain onset).',
      priorityCrops: ['Upland Rice', 'Groundnut', 'Shaded Vanilla', 'Plains Rice (Boeny)'],
      cropAssociation:
        'Alternate upland rice and groundnut strips; in Sava & Diana, thicken Gliricidia shade trees to shield vanilla vines from midday heat spikes.',
      waterAndSoilPractice:
        'Clear drainage ditches preventively in Diana/Sava before Dec–Jan downpours; desilt irrigation canals and run locust patrols in Boeny/Sofia.',
      calendarBars: [
        { crop: 'Upland Rice (Diana / Sava)', cycleDays: '110–120 days', startMonthIdx: 1.0, endMonthIdx: 4.3, note: 'Early Nov sowing on drained soil' },
        { crop: 'Rice & Groundnut (Boeny/Sofia)', cycleDays: '105–120 days', startMonthIdx: 2.0, endMonthIdx: 5.3, note: 'Shifted to Dec (delayed rains)' },
        { crop: 'Strip-cropped Groundnut', cycleDays: '95–110 days', startMonthIdx: 1.6, endMonthIdx: 4.9, note: 'Intercropped with upland rice' },
        { crop: 'Vanilla Shade (Gliricidia)', cycleDays: 'Continuous', startMonthIdx: 0.5, endMonthIdx: 5.5, note: 'Heat-stress canopy Nov–Jan' },
      ],
    },
  },
  sw: {
    'grand-sud': {
      title: 'Kusini Kuu na Kusini-Magharibi',
      sowingWindow: 'Katikati ya Desemba 2026 hadi Januari 2027',
      triggerRule: 'Subiri mvua za angalau mm 20 hadi 30 ndani ya siku 3 mfululizo kabla ya kupanda.',
      priorityCrops: ['Mtama (siku 90)', 'Uwele (siku 90)', 'Mbaazi (Ambatry)', 'Kunde', 'Muhogo unaostahimili'],
      cropAssociation:
        'Panda mtama au uwele pamoja na kunde zinazotambaa kufunika udongo dhidi ya mvuke, ukiweka mistari ya mbaazi na mkonge kuzuia upepo na mchanga.',
      waterAndSoilPractice:
        'Mbinu ya mashimo ya Zaï: chimba mashimo ya sentimita 20 yenye mbolea kabla ya mvua, ukijumuisha matandazo na matuta ya kuzuia mmomonyoko.',
      calendarBars: [
        { crop: 'Mtama & Uwele (siku 90)', cycleDays: 'siku 90', startMonthIdx: 2.3, endMonthIdx: 5.2, note: 'Panda kati ya Des–Jan baada ya mm 20–30' },
        { crop: 'Kunde mseto', cycleDays: 'siku 75–90', startMonthIdx: 2.3, endMonthIdx: 4.8, note: 'Kufunika udongo dhidi ya ukavu' },
        { crop: 'Mbaazi (Ambatry)', cycleDays: 'Kudumu / Kizuia upepo', startMonthIdx: 1.5, endMonthIdx: 5.5, note: 'Kuongeza naitrojeni na kivuli' },
        { crop: 'Vipandikizi vya Muhogo', cycleDays: 'miezi 6–9', startMonthIdx: 1.8, endMonthIdx: 5.5, note: 'Kupanda ndani ya mashimo ya Zaï' },
      ],
    },
    'hautes-terres': {
      title: 'Nyanda za Juu za Kati',
      sowingWindow: 'Katikati ya Novemba hadi Katikati ya Desemba 2026',
      triggerRule: 'Tumia mbegu za muda wa kati (siku 110–120) kwenye vilima (tanety) na kilimo cha SRI kwenye mabonde.',
      priorityCrops: ['Mpunga wa Umwagiliaji (SRI)', 'Mpunga wa Mvua (tanety)', 'Mahindi (siku 110–120)', 'Maharage / Soya'],
      cropAssociation:
        'Kilimo hifadhi (SCV) bila kulima udongo kikichanganya mahindi na maharage au soya; panda nyasi za Brachiaria/Vetiver kuzuia mmomonyoko.',
      waterAndSoilPractice:
        'Pandikiza miche michanga ya mpunga (siku 8–12) kwa mfumo wa SRI na safisha mifereji ya maji kupitia HIMO.',
      calendarBars: [
        { crop: 'Mpunga & Mahindi (tanety)', cycleDays: 'siku 110–120', startMonthIdx: 1.4, endMonthIdx: 4.9, note: 'Panda Nov–Des chini ya SCV' },
        { crop: 'Mpunga Umwagiliaji SRI/SRA', cycleDays: 'siku 120–135', startMonthIdx: 1.0, endMonthIdx: 4.8, note: 'Miche michanga siku 8–12' },
        { crop: 'Maharage / Soya', cycleDays: 'siku 90–105', startMonthIdx: 1.5, endMonthIdx: 4.5, note: 'Mseto pamoja na mahindi' },
        { crop: 'Ukanda wa Brachiaria / Vetiver', cycleDays: 'Kudumu', startMonthIdx: 0.8, endMonthIdx: 5.5, note: 'Kuzuia mmomonyoko wa udongo' },
      ],
    },
    'nord-ouest': {
      title: 'Kaskazini na Kaskazini-Magharibi',
      sowingWindow: 'Novemba (Diana/Sava) · Desemba (Boeny/Sofia)',
      triggerRule: 'Kalenda mbili tofauti: panda mapema Novemba Kaskazini penye mifereji; chelewesha hadi Desemba Kaskazini-Magharibi.',
      priorityCrops: ['Mpunga wa Mvua', 'Karanga', 'Vanilla chini ya kivuli', 'Mpunga wa Bonde (Boeny)'],
      cropAssociation:
        'Panda mpunga wa mvua na karanga kwa mistari mbadala; ongeza miti ya kivuli (Gliricidia) kulinda vanilla dhidi ya joto kali.',
      waterAndSoilPractice:
        'Safisha mitaro ya kutoa maji mapema Diana/Sava kabla ya Des–Jan; safisha mifereji ya umwagiliaji na dhibiti nzige Boeny/Sofia.',
      calendarBars: [
        { crop: 'Mpunga wa Mvua (Diana/Sava)', cycleDays: 'siku 110–120', startMonthIdx: 1.0, endMonthIdx: 4.3, note: 'Panda mapema Novemba' },
        { crop: 'Mpunga & Karanga (Boeny/Sofia)', cycleDays: 'siku 105–120', startMonthIdx: 2.0, endMonthIdx: 5.3, note: 'Sogeza hadi Desemba' },
        { crop: 'Karanga kwa Mistari', cycleDays: 'siku 95–110', startMonthIdx: 1.6, endMonthIdx: 4.9, note: 'Mseto na mpunga wa mvua' },
        { crop: 'Kivuli cha Vanilla (Gliricidia)', cycleDays: 'Endelevu', startMonthIdx: 0.5, endMonthIdx: 5.5, note: 'Kinga ya joto Nov–Jan' },
      ],
    },
  },
};

export function getLocalizedAgriculturalZones(lang: LanguageCode): AgriculturalZoneTechnique[] {
  if (lang === 'fr') return AGRICULTURAL_ZONES;
  const dict = AGRI_ZONE_TRANSLATIONS[lang];
  return AGRICULTURAL_ZONES.map((z) => ({ ...z, ...(dict[z.id] ?? {}) }));
}

const AGENCY_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, Partial<CooperativeAgency>[]> = {
  en: [
    {
      name: 'Agricultural Development Fund (FDA)',
      role: 'Primary financing facility under MINAE. Funds certified seeds, fertilizer vouchers, small irrigation kits, and processing equipment.',
      address: 'Regional desks (FDA-R) in every regional capital',
      contact: 'MINAE / Regional FDA-R office',
      eligibilityOrAction: 'Legally registered cooperative submitting an agricultural or small irrigation micro-project.',
    },
    {
      name: 'DRAE & Agricultural Districts (CirAE)',
      role: 'Farmer registration and access to subsidized input kits (including emergency programs such as PURPA).',
      address: 'Regional Directorates of Agriculture & Livestock (district / regional capitals)',
      contact: 'Local district CirAE office',
      eligibilityOrAction: 'Register cooperative members to obtain the digital farmer ID card.',
    },
    {
      name: 'DEFIS Project (MINAE / IFAD)',
      role: 'Targeted support for Grand Sud and South-East cooperatives providing resilient seeds and community water assets.',
      address: 'Grand Sud & South-East regions',
      contact: 'Regional MINAE / DEFIS coordination desk',
      eligibilityOrAction: 'Priority eligibility for farmer organizations in Androy, Anosy, Atsimo-Andrefana & South-East.',
    },
    {
      name: 'FAO Madagascar',
      role: 'Distribution of drought-tolerant seeds, micro-irrigation kits, and Farmer Field Schools (CEP).',
      address: '159 Route Circulaire, Ankorahotra, BP 3971, Antananarivo 101',
      contact: 'Tel: +261 20 22 288 31 / +261 20 22 621 51 · FAO-MG@fao.org',
      eligibilityOrAction: 'Partnering via line ministries and structured agricultural cooperatives.',
    },
    {
      name: 'WFP Madagascar (PAM)',
      role: 'Local food procurement from farmer cooperatives and Food/Cash-for-Assets (canal and feeder-road rehab).',
      address: 'Lot VB 71 GB, Ambatoroka, BP 4199, Antananarivo 101',
      contact: 'wfp.org/countries/madagascar (Sub-offices: Ambovombe, Tolagnaro, Toliara, Manakara)',
      eligibilityOrAction: 'Emergency response and local commodity purchase contracts for structured cooperatives.',
    },
    {
      name: 'GSDM (Agroecology Professionals)',
      role: 'Technical training on conservation agriculture / direct seeding under cover crops (SCV), cover seeds, and field coaching.',
      address: 'Lot VA 26 Y Ambatoroka, Antananarivo 101',
      contact: 'Web: gsdm-mg.org',
      eligibilityOrAction: 'Methodological support for farmer groups practicing soil conservation and agroecology.',
    },
  ],
  sw: [
    {
      name: 'Mfuko wa Maendeleo ya Kilimo (FDA)',
      role: 'Mfuko mkuu chini ya MINAE unaofadhili mbegu bora, vocha za mbolea, vifaa vidogo vya umwagiliaji na usindikaji.',
      address: 'Madirisha ya mikoa (FDA-R) katika kila makao makuu ya mkoa',
      contact: 'MINAE / Ofisi ya FDA-R ya mkoa',
      eligibilityOrAction: 'Chama cha ushirika kilichosajiliwa kisheria chenye mradi mdogo wa kilimo au umwagiliaji.',
    },
    {
      name: 'DRAE na Wilaya za Kilimo (CirAE)',
      role: 'Usajili wa wakulima na upatikanaji wa pembejeo za ruzuku (ikiwemo mipango ya dharura kama PURPA).',
      address: 'Ofisi za Kilimo za Mikoa na Wilaya',
      contact: 'Ofisi ya CirAE ya wilaya yako',
      eligibilityOrAction: 'Sajili wanachama wa ushirika kupata kadi ya kidijitali ya mkulima.',
    },
    {
      name: 'Mradi wa DEFIS (MINAE / IFAD)',
      role: 'Msaada maalumu kwa vyama vya ushirika Kusini Kuu na Kusini-Mashariki kwa mbegu stahimilivu na miundombinu ya maji.',
      address: 'Mikoa ya Kusini Kuu na Kusini-Mashariki',
      contact: 'Uratibu wa mkoa MINAE / DEFIS',
      eligibilityOrAction: 'Kipaumbele kwa vyama vya wakulima katika Androy, Anosy, Atsimo-Andrefana na Kusini-Mashariki.',
    },
    {
      name: 'FAO Madagaska',
      role: 'Ugawaji wa mbegu zinazostahimili ukame, vifaa vya umwagiliaji wa matone na Shule za Shambani (CEP).',
      address: '159 Route Circulaire, Ankorahotra, BP 3971, Antananarivo 101',
      contact: 'Simu: +261 20 22 288 31 · FAO-MG@fao.org',
      eligibilityOrAction: 'Ushirikiano kupitia wizara na vyama vya ushirika vilivyo imara.',
    },
    {
      name: 'WFP Madagaska (PAM)',
      role: 'Ununuzi wa chakula cha ndani kutoka vyama vya ushirika na miradi ya ajira ya ukarabati wa mifereji.',
      address: 'Lot VB 71 GB, Ambatoroka, BP 4199, Antananarivo 101',
      contact: 'wfp.org/countries/madagascar (Ofisi ndogo: Ambovombe, Tolagnaro, Toliara, Manakara)',
      eligibilityOrAction: 'Msaada wa dharura na mikataba ya ununuzi wa mazao kwa vyama vilivyosajiliwa.',
    },
    {
      name: 'GSDM (Wataalamu wa Ikolojia ya Kilimo)',
      role: 'Mafunzo ya kilimo hifadhi (SCV), mbegu za kufunika udongo na ushauri wa shambani.',
      address: 'Lot VA 26 Y Ambatoroka, Antananarivo 101',
      contact: 'Tovuti: gsdm-mg.org',
      eligibilityOrAction: 'Msaada wa kiufundi kwa vikundi vya wakulima vinavyohifadhi udongo.',
    },
  ],
};

export function getLocalizedCooperativeAgencies(lang: LanguageCode): CooperativeAgency[] {
  if (lang === 'fr') return COOPERATIVE_AGENCIES;
  const tr = AGENCY_TRANSLATIONS[lang];
  return COOPERATIVE_AGENCIES.map((a, idx) => ({ ...a, ...(tr[idx] ?? {}) }));
}

const REFERENCE_SOURCES_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, { label: string; publisher: string }[]> = {
  en: [
    { label: 'El Niño / La Niña Overview', publisher: 'World Meteorological Organization (WMO)' },
    { label: 'El Niño & Food Security Dossier', publisher: 'FAO' },
    { label: 'SWIOCOF-15 Communiqué (Indian Ocean 2026–2027)', publisher: 'Indian Ocean Commission (IOC)' },
    { label: 'Madagascar Climate Outlook 2026–2027', publisher: 'Météo Madagascar' },
    { label: 'Seasonal Weather Forecasts', publisher: 'Météo Madagascar' },
    { label: 'UN El Niño Focus & Global Projections', publisher: 'United Nations (UN)' },
    { label: 'Worsening Food Crisis in the Greater South', publisher: 'Action Against Hunger' },
    { label: 'El Niño 2026–2027 Alert in Madagascar (OCHA)', publisher: 'Moov.mg' },
    { label: 'Food Insecurity & Grand Sud (3.72M)', publisher: 'AllAfrica' },
    { label: 'Threat to Upcoming Maize Harvest in the South', publisher: 'Midi Madagasikara' },
    { label: 'Influence on the 2026–2027 Cyclone Season', publisher: 'CycloneOI' },
    { label: 'Threat to Agriculture and Food Staples', publisher: 'La Croix' },
    { label: 'Extreme Heat Excess Mortality (Nature Medicine)', publisher: 'Science & Vie' },
    { label: '2026–2027 El Niño Event Summary', publisher: 'Wikipedia' },
  ],
  sw: [
    { label: 'Mada ya El Niño / La Niña', publisher: 'Shirika la Hali ya Hewa Duniani (WMO)' },
    { label: 'Ripoti ya El Niño na Usalama wa Chakula', publisher: 'FAO' },
    { label: 'Taarifa ya SWIOCOF-15 (Bahari ya Hindi 2026–2027)', publisher: 'Tume ya Bahari ya Hindi (COI)' },
    { label: 'Mwelekeo wa Tabianchi Madagaska 2026–2027', publisher: 'Météo Madagascar' },
    { label: 'Utabiri wa Msimu wa Hali ya Hewa', publisher: 'Météo Madagascar' },
    { label: 'Mtazamo wa UN kuhusu El Niño Duniani', publisher: 'Umoja wa Mataifa (UN)' },
    { label: 'Kuongezeka kwa Mgogoro wa Chakula Kusini Kuu', publisher: 'Action Against Hunger' },
    { label: 'Tahadhari ya El Niño 2026–2027 Madagaska (OCHA)', publisher: 'Moov.mg' },
    { label: 'Uhaba wa Chakula Kusini Kuu (Watu 3.72M)', publisher: 'AllAfrica' },
    { label: 'Tishio kwa Mavuno ya Mahindi Kusini', publisher: 'Midi Madagasikara' },
    { label: 'Athari kwa Msimu wa Vimbunga 2026–2027', publisher: 'CycloneOI' },
    { label: 'Tishio kwa Kilimo na Bei za Chakula', publisher: 'La Croix' },
    { label: 'Vifo Vinavyohusiana na Joto Kali (Nature Medicine)', publisher: 'Science & Vie' },
    { label: 'Muhtasari wa Tukio la El Niño 2026–2027', publisher: 'Wikipedia' },
  ],
};

export function getLocalizedReferenceSources(lang: LanguageCode): ReferenceSource[] {
  if (lang === 'fr') return REFERENCE_SOURCES;
  const tr = REFERENCE_SOURCES_TRANSLATIONS[lang];
  return REFERENCE_SOURCES.map((s, idx) => ({ ...s, ...(tr[idx] ?? {}) }));
}
