import type { LanguageCode } from './LanguageContext.tsx';
import {
  HISTORICAL_PATTERNS_10Y,
  MADAGASCAR_2027_PREDICTIONS,
  AFRICA_2027_PREDICTIONS,
  LSTM_LAG_SERIES,
  ETL_OPEN_SOURCES,
  FILIERES_2027_VS_2028,
  HYDRO_DISTRICT_PROFILES,
  XGBOOST_ANTI_OVERFIT_PARAMS,
  HYBRID_AI_ARCHITECTURE,
  HYBRID_ORCHESTRATION_DEMOS,
  QLORA_HYPERPARAMS,
  DISTRICT_CHOROPLETH_DATA,
  PROVINCE_6_BASELINES,
  CONTINENTAL_COUNTRY_PROJECTIONS,
  type HistoricalPatternRow,
  type RegionalPrediction2027,
  type AfricaPrediction2027,
  type EtlSourceRow,
  type Filiere2027vs2028,
  type DistrictHydroProfile,
  type HyperparamGuard,
  type HybridAiComponent,
  type HybridOrchestrationDemo,
  type DistrictPredictionPoint,
  type ProvinceEconomicMeta,
  type ContinentalCountryLossProfile,
} from '../data/ensoData.ts';

const HISTORICAL_PATTERNS_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, HistoricalPatternRow[]> = {
  en: [
    {
      indicator: 'Rainfall (South & West)',
      neutralLaNina: 'Normal to above-normal (regular Nov–Mar rainy season).',
      strongElNino: 'Deficit of -30% to -50%; rain onset delayed by 3 to 5 weeks.',
      measuredImpact: 'Break in maize and pulse growing cycles.',
    },
    {
      indicator: 'Maximum Temperatures',
      neutralLaNina: 'Standard seasonal variance (+0.2 to +0.5 °C).',
      strongElNino: 'Thermal anomaly of +1.5 °C to +4.0 °C (Jan–Mar).',
      measuredImpact: 'Extreme evapotranspiration and rapid soil moisture loss.',
    },
    {
      indicator: 'Cyclone Activity',
      neutralLaNina: '2 to 4 direct landfalls on East & North-West coasts.',
      strongElNino: 'Statistical drop (0 to 2 direct hits); tracks deflected eastward.',
      measuredImpact: 'Less wind damage, but reduced beneficial seasonal rainfall.',
    },
    {
      indicator: 'Agricultural GDP & Losses',
      neutralLaNina: 'Steady agricultural growth (+2.5% to +3.5%/yr).',
      strongElNino: 'Sector contraction of -6% to -7% (e.g., > $200M losses in 2023–24).',
      measuredImpact: 'Falling rural incomes and distress livestock liquidation.',
    },
    {
      indicator: 'Inflation (Consumer Prices)',
      neutralLaNina: 'Average range between 5.6% and 8.2%.',
      strongElNino: 'Inflationary surge reaching 8.6% – 9.9% across harvest year.',
      measuredImpact: 'Steep price spikes for rice and staple substitutes.',
    },
  ],
  sw: [
    {
      indicator: 'Mvua (Kusini & Magharibi)',
      neutralLaNina: 'Ya kawaida hadi nyingi (msimu wa Nov–Mac).',
      strongElNino: 'Upungufu wa -30% hadi -50%; kuchelewa kwa mvua wiki 3 hadi 5.',
      measuredImpact: 'Kukatika kwa msimu wa mahindi na kunde.',
    },
    {
      indicator: 'Viwango vya Juu vya Joto',
      neutralLaNina: 'Mabadiliko ya kawaida (+0.2 hadi +0.5 °C).',
      strongElNino: 'Ongezeko la joto la +1.5 °C hadi +4.0 °C (Jan–Mac).',
      measuredImpact: 'Uvukizi mkubwa na ukaukaji wa haraka wa udongo.',
    },
    {
      indicator: 'Shughuli za Vimbunga',
      neutralLaNina: 'Vimbunga 2 hadi 4 huingia nchi kavu Mashariki na Kaskazini-Magharibi.',
      strongElNino: 'Kupungua (0 hadi 2), njia zikielekezwa mashariki baharini.',
      measuredImpact: 'Uharibifu mdogo wa upepo, lakini upungufu wa maji ya mvua.',
    },
    {
      indicator: 'Pato la Kilimo & Hasara',
      neutralLaNina: 'Ukuaji thabiti wa kilimo (+2.5% hadi +3.5%/mwaka).',
      strongElNino: 'Kushuka kwa sekta kwa -6% hadi -7% (mf. > $200M 2023–24).',
      measuredImpact: 'Kupungua kwa kipato vijijini na kuuza mifugo kwa dharura.',
    },
    {
      indicator: 'Mfumuko wa Bei (CPI)',
      neutralLaNina: 'Wastani kati ya 5.6% na 8.2%.',
      strongElNino: 'Ongezeko la mfumuko kufikia 8.6% – 9.9% katika mwaka wa mavuno.',
      measuredImpact: 'Kupanda kwa bei ya mchele na vyakula mbadala.',
    },
  ],
};

export function getLocalizedHistoricalPatterns(lang: LanguageCode): HistoricalPatternRow[] {
  return lang === 'fr' ? HISTORICAL_PATTERNS_10Y : HISTORICAL_PATTERNS_TRANSLATIONS[lang];
}

const MADAGASCAR_2027_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, Partial<RegionalPrediction2027>[]> = {
  en: [
    {
      region: 'Grand Sud',
      horizon: 'Apr – Q3 2027',
      forecast:
        'Critical worsening of food insecurity: April–June 2027 maize and cassava harvests will fail sharply, triggering an early lean season by Q3 2027.',
      criticalMetric: 'IPC Phase 4 to 5 nutritional emergency pockets',
    },
    {
      region: 'Central Highlands',
      horizon: 'Jan – Apr 2027',
      forecast:
        'Marked water deficit through January 2027 followed by concentrated late rains in Feb–Apr, keeping strong upward pressure on urban local rice prices.',
      criticalMetric: '-10% to -15% drop in rainfed rice output',
    },
    {
      region: 'West & North-West Coast',
      horizon: 'Mar – Jun 2027',
      forecast:
        'Prolonged monsoon delay paired with intense heatwaves. Irrigated plains (Marovoay) face low dam & river inflows.',
      criticalMetric: 'High locust outbreak hazard (Mar–Jun)',
    },
    {
      region: 'North & North-East',
      horizon: 'Nov 2026 – 2027 Season',
      forecast:
        'Excess rainfall between Nov 2026 and Jan 2027 triggering floods and landslides. Thermal stress and excess humidity threaten pollination.',
      criticalMetric: 'Vanilla and cocoa flowering & quality exposed',
    },
    {
      region: 'Grand South-East',
      horizon: 'Feb – Apr 2027',
      forecast:
        'After a dry start, an abrupt return of heavy rains in Feb–Apr 2027 exposes lowland valleys to flooding.',
      criticalMetric: 'Risk to export cash crops (coffee, cloves, pepper)',
    },
  ],
  sw: [
    {
      region: 'Kusini Kuu',
      horizon: 'Apr – Robo ya 3 2027',
      forecast:
        'Kuongezeka kwa uhaba wa chakula: mavuno ya mahindi na muhogo ya Aprili–Juni 2027 yatapungua sana na kusababisha uhaba wa mapema Q3 2027.',
      criticalMetric: 'Maeneo ya dharura ya lishe IPC Daraja la 4 hadi 5',
    },
    {
      region: 'Nyanda za Juu za Kati',
      horizon: 'Jan – Apr 2027',
      forecast:
        'Upungufu wa maji hadi Januari 2027 ukifuatiwa na mvua za kuchelewa Feb–Apr, ukiweka shinikizo kubwa kwa bei za mchele mijini.',
      criticalMetric: '-10% hadi -15% ya mpunga wa mvua',
    },
    {
      region: 'Pwani ya Magharibi & Kaskazini-Magharibi',
      horizon: 'Mac – Jun 2027',
      forecast:
        'Kuchelewa kwa monsuni na mawimbi ya joto kali. Mabonde ya umwagiliaji (Marovoay) yatakabiliwa na maji kidogo.',
      criticalMetric: 'Hatari kubwa ya uvamizi wa nzige (Mac–Jun)',
    },
    {
      region: 'Kaskazini & Kaskazini-Mashariki',
      horizon: 'Nov 2026 – Msimu 2027',
      forecast:
        'Mvua za ziada kati ya Nov 2026 na Jan 2027 zikisababisha mafuriko na maporomoko ya ardhi; joto linatishia maua.',
      criticalMetric: 'Ubora na uchavushaji wa vanilla na kakao hatarini',
    },
    {
      region: 'Kusini-Mashariki Kuu',
      horizon: 'Feb – Apr 2027',
      forecast:
        'Baada ya mwanzo mkavu, kurudi ghafla kwa mvua kati ya Feb na Apr 2027 kunahatarisha mabonde kwa mafuriko.',
      criticalMetric: 'Tishio kwa mazao ya biashara (kahawa, karafuu, pilipili)',
    },
  ],
};

export function getLocalizedMadagascar2027(lang: LanguageCode): RegionalPrediction2027[] {
  if (lang === 'fr') return MADAGASCAR_2027_PREDICTIONS;
  const tr = MADAGASCAR_2027_TRANSLATIONS[lang];
  return MADAGASCAR_2027_PREDICTIONS.map((r, i) => ({ ...r, ...(tr[i] ?? {}) }));
}

const AFRICA_2027_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, AfricaPrediction2027[]> = {
  en: [
    {
      zone: 'Southern Africa & SADC',
      countries: 'Zambia, Zimbabwe, Malawi, Mozambique',
      weather2027: 'Severe drought and heatwaves during the critical maize pollination window (Jan–Feb 2027).',
      economicImpact2027:
        '20% to 40% maize yield collapse. Acute power rationing (low Kariba Dam reservoir) slowing mining and manufacturing.',
    },
    {
      zone: 'South Africa',
      countries: 'Free State, North West (Maize Belt)',
      weather2027: 'Soil drying across the maize belt, cushioned early on by fair initial reservoir storage.',
      economicImpact2027:
        'Smaller summer grain harvest absorbed in Q1 by carry-over stocks, followed by rising food inflation from H2 2027.',
    },
    {
      zone: 'COMESA Corridor (North–South)',
      countries: 'Kenya, Uganda, Ethiopia vs Zambia, Malawi, Madagascar',
      weather2027: 'Sharp dipole split: heavy flooding in the North alongside drought in the South.',
      economicImpact2027:
        'Disruption of regional supply chains, East African road washouts, and wider trade deficits from emergency food imports.',
    },
    {
      zone: 'Central Africa',
      countries: 'Congo Basin, Cameroon, DRC',
      weather2027: 'Erratic rainfall regimes, higher mean temperatures, and lower river discharge.',
      economicImpact2027: 'River transport bottlenecks, lower cassava/cocoa yields, and higher inland logistics costs.',
    },
    {
      zone: 'West Africa',
      countries: 'Sahel & Gulf of Guinea (Côte d’Ivoire, Ghana)',
      weather2027: 'Persistent warming, stronger dry Harmattan winds, and irregular spring 2027 monsoon onset.',
      economicImpact2027:
        'Lower cocoa output sustaining elevated world prices; pasture/fodder deficit and millet/sorghum strain in the Sahel.',
    },
    {
      zone: 'North Africa',
      countries: 'Morocco, Algeria, Tunisia',
      weather2027: 'Indirect teleconnections favoring persistent high-pressure ridges and winter water deficits.',
      economicImpact2027:
        'Contraction in wheat and barley harvests across the Maghreb, raising state subsidy and cereal import bills.',
    },
  ],
  sw: [
    {
      zone: 'Kusini mwa Afrika & SADC',
      countries: 'Zambia, Zimbabwe, Malawi, Msumbiji',
      weather2027: 'Ukame mkali na mawimbi ya joto wakati muhimu wa mahindi kuchavusha (Jan–Feb 2027).',
      economicImpact2027:
        'Kupungua kwa 20% hadi 40% kwa mahindi. Mgao mkali wa umeme (Bwawa la Kariba) ukipunguza uchimbaji madini na viwanda.',
    },
    {
      zone: 'Afrika Kusini',
      countries: 'Free State, Kaskazini-Magharibi',
      weather2027: 'Ukavu wa udongo katika ukanda wa mahindi, ukipunguzwa kidogo na akiba ya maji ya awali.',
      economicImpact2027:
        'Mavuno madogo ya majira ya joto yanafidiwa robo ya kwanza na akiba iliyopo, kisha mfumuko wa bei kuanzia katikati ya 2027.',
    },
    {
      zone: 'Ukanda wa COMESA (Kaskazini–Kusini)',
      countries: 'Kenya, Uganda, Ethiopia dhidi ya Zambia, Malawi, Madagaska',
      weather2027: 'Tofauti kali: mafuriko kaskazini na ukame kusini.',
      economicImpact2027:
        'Kukatika kwa minyororo ya ugavi, kuharibika kwa barabara Afrika Mashariki na kuongezeka kwa nakisi ya biashara.',
    },
    {
      zone: 'Afrika ya Kati',
      countries: 'Bonde la Kongo, Kameruni, DRC',
      weather2027: 'Mvua zisizotabirika, ongezeko la joto na kupungua kwa maji ya mito.',
      economicImpact2027: 'Vikwazo vya usafiri wa mito, kupungua kwa muhogo/kakao na gharama kubwa za usafirishaji.',
    },
    {
      zone: 'Afrika Magharibi',
      countries: 'Sahel & Ghuba ya Guinea (Ivory Coast, Ghana)',
      weather2027: 'Joto endelevu, pepo kavu za Harmattan na kuchelewa kwa mvua za masika 2027.',
      economicImpact2027:
        'Kupungua kwa kakao kukidumisha bei za juu duniani; uhaba wa malisho na shinikizo kwa mtama/uwele Sahel.',
    },
    {
      zone: 'Afrika Kaskazini',
      countries: 'Moroko, Algeria, Tunisia',
      weather2027: 'Athari zisizo za moja kwa moja zikileta upungufu wa mvua za majira ya baridi.',
      economicImpact2027:
        'Kupungua kwa mavuno ya ngano na shayiri katika Maghreb na kuongeza gharama za uagizaji chakula.',
    },
  ],
};

export function getLocalizedAfrica2027(lang: LanguageCode): AfricaPrediction2027[] {
  return lang === 'fr' ? AFRICA_2027_PREDICTIONS : AFRICA_2027_TRANSLATIONS[lang];
}

const LSTM_MONTH_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, { month: string; label: string }[]> = {
  en: [
    { month: 'Nov 26', label: 'Pacific peak begins' },
    { month: 'Dec 26', label: 'Niño 3.4 Peak (+3.8 °C)' },
    { month: 'Jan 27', label: 'Peak evapotranspiration' },
    { month: 'Feb 27', label: 'Flowering & rice heat stress' },
    { month: 'Mar 27', label: 'Locusts / Late rains' },
    { month: 'Apr 27', label: 'Neutral shift & harvest shock' },
    { month: 'May 27', label: 'South maize/cassava deficit' },
    { month: 'Jun 27', label: 'Peak food prices & IPC stress' },
    { month: 'Jul 27', label: 'Early Q3 lean season' },
    { month: 'Aug 27', label: 'Persistent food inflation' },
  ],
  sw: [
    { month: 'Nov 26', label: 'Kilele cha Pasifiki chaanza' },
    { month: 'Des 26', label: 'Kilele Niño 3.4 (+3.8 °C)' },
    { month: 'Jan 27', label: 'Uvukizi wa juu zaidi' },
    { month: 'Feb 27', label: 'Msongo wa maua & mpunga' },
    { month: 'Mac 27', label: 'Nzige / Mvua za kuchelewa' },
    { month: 'Apr 27', label: 'Mpito wa kawaida & mavuno' },
    { month: 'Mei 27', label: 'Uhaba mahindi/muhogo Kusini' },
    { month: 'Jun 27', label: 'Kilele cha bei & hatari IPC' },
    { month: 'Jul 27', label: 'Uhaba wa mapema Q3' },
    { month: 'Ago 27', label: 'Mfumuko endelevu wa bei' },
  ],
};

export function getLocalizedLstmSeries(lang: LanguageCode) {
  if (lang === 'fr') return LSTM_LAG_SERIES;
  const tr = LSTM_MONTH_TRANSLATIONS[lang];
  return LSTM_LAG_SERIES.map((pt, i) => ({
    ...pt,
    month: tr[i]?.month ?? pt.month,
    label: tr[i]?.label ?? pt.label,
  }));
}

const ETL_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, EtlSourceRow[]> = {
  en: [
    {
      source: 'NASA POWER',
      accessResolution: 'Free REST API (JSON/CSV), 0.5° × 0.625° grid, Agroclimatology (AG) community.',
      variables: 'PRECTOTCORR (rainfall), T2M_MAX (max temp), ALLSKY_SFC_SW_DWN (solar radiation), RH2M.',
      roleInMl: 'Potential evapotranspiration (ETP) computation and flowering heat stress features.',
    },
    {
      source: 'Copernicus ERA5',
      accessResolution: 'cdsapi API (NetCDF/GRIB), fine 0.25° × 0.25° (~28 km) hourly/monthly reanalysis.',
      variables: 'volumetric_soil_water_layer_1 (0–7 cm soil moisture), runoff, total_evaporation.',
      roleInMl: 'Direct watershed water-balance and district groundwater recharge modeling.',
    },
    {
      source: 'FAOSTAT',
      accessResolution: 'CSV / HDX API download, annual national & subnational crop series (1961–present).',
      variables: 'Area harvested, Yield (hg/ha), Production (tonnes), Producer Prices.',
      roleInMl: 'Historical target labels (Y) for rice, maize, cassava, vanilla, coffee, cloves & lychee.',
    },
    {
      source: 'NOAA CPC & CHIRPS',
      accessResolution: 'NOAA monthly ocean indices and CHIRPS ultra-high-res 0.05° (~5 km) rainfall grid.',
      variables: 'ONI (Niño 3.4) & DMI (Indian Ocean Dipole) + district cumulative rainfall.',
      roleInMl: 'Lagged global teleconnection predictors (t-3 to t-9 months) and local rainfall anomalies.',
    },
  ],
  sw: [
    {
      source: 'NASA POWER',
      accessResolution: 'API ya REST bure (JSON/CSV), gridi 0.5° × 0.625°, jumuiya ya kilimo (AG).',
      variables: 'PRECTOTCORR (mvua), T2M_MAX (joto la juu), ALLSKY_SFC_SW_DWN (mionzi ya jua), RH2M.',
      roleInMl: 'Kukokotoa uvukizi (ETP) na msongo wa joto wakati wa kutoa maua.',
    },
    {
      source: 'Copernicus ERA5',
      accessResolution: 'API ya cdsapi (NetCDF/GRIB), kiwango cha 0.25° × 0.25° (~28 km).',
      variables: 'volumetric_soil_water_layer_1 (unyevu wa udongo 0–7 cm), runoff, uvukizi.',
      roleInMl: 'Utabiri wa moja kwa moja wa uwiano wa maji na chemchemi za wilaya.',
    },
    {
      source: 'FAOSTAT',
      accessResolution: 'CSV / API ya HDX, mfululizo wa takwimu za kilimo za kila mwaka (1961–sasa).',
      variables: 'Eneo lililovunwa, Mavuno (hg/ha), Uzalishaji (tani), Bei za Wakulima.',
      roleInMl: 'Shabaha za kihistoria (Y) kwa mpunga, mahindi, muhogo, vanilla, kahawa na karafuu.',
    },
    {
      source: 'NOAA CPC & CHIRPS',
      accessResolution: 'NOAA (vielelezo vya kila mwezi) na CHIRPS (~5 km) gridi ya mvua.',
      variables: 'Vielelezo ONI (Niño 3.4) & DMI (Bahari ya Hindi) + jumla ya mvua kwa wilaya.',
      roleInMl: 'Vigezo vilivyocheleweshwa (miezi 3 hadi 9) na usahihi wa mvua za eneo.',
    },
  ],
};

export function getLocalizedEtlSources(lang: LanguageCode): EtlSourceRow[] {
  return lang === 'fr' ? ETL_OPEN_SOURCES : ETL_TRANSLATIONS[lang];
}

const FILIERES_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, Partial<Filiere2027vs2028>[]> = {
  en: [
    {
      filiere: 'Rice (Irrigated & Rainfed)',
      prediction2027:
        '-8% to -14% national production decline. Upland rice (tanety) suffers delayed rains while irrigated paddies face low reservoir storage. High price strain until May 2027.',
      prediction2028:
        '+10% to +15% rebound as regular rains return in late 2027, tempered by localized flood and cyclone damage across lowlands (Marovoay, Alaotra).',
    },
    {
      filiere: 'Food Staples (Maize, Cassava, Sweet Potato, Bean)',
      prediction2027:
        'Critical -25% to -40% drop in maize and pulses across the South and Center. Cassava endures better overall but yields smaller tubers.',
      prediction2028:
        'Strong recovery (+20% to +30%) for maize and beans thanks to restored soil moisture, allowing replenishment of household grain stocks.',
    },
    {
      filiere: 'Vanilla (SAVA Export Value Chain)',
      prediction2027:
        'Elevated quality and volume risk: heavy late-2026 rains followed by early-2027 heat spikes trigger flower drop and Fusarium outbreaks.',
      prediction2028:
        'Volume stabilization expected, contingent on avoiding a major cyclone strike along the North-East coast (Antalaha, Sambava, Andapa) in early 2028.',
    },
    {
      filiere: 'Coffee, Cloves & Lychee (East Coast)',
      prediction2027:
        'Water and thermal stress (Atsinanana, Analanjirofo, Fitovinany): -10% to -20% drop in exportable Robusta coffee and lychee (smaller fruit size, early ripening).',
      prediction2028:
        'Strong cyclical rebound (especially cloves and lychee benefiting from vegetative rest and restored humidity).',
    },
  ],
  sw: [
    {
      filiere: 'Mpunga (Umwagiliaji & Mvua)',
      prediction2027:
        'Kupungua kwa -8% hadi -14% kitaifa. Mpunga wa vilimani huathiriwa na kuchelewa kwa mvua na mabonde hukosa maji. Bei hupanda hadi Mei 2027.',
      prediction2028:
        'Ongezeko la +10% hadi +15% mvua zikirudi mwishoni mwa 2027, lakini kuna hatari ya mafuriko na vimbunga (Marovoay, Alaotra).',
    },
    {
      filiere: 'Mazao ya Chakula (Mahindi, Muhogo, Viazi Vitamu, Maharage)',
      prediction2027:
        'Anguko la -25% hadi -40% kwa mahindi na kunde Kusini na Kati. Muhogo hustahimili zaidi lakini hutoa mizizi midogo.',
      prediction2028:
        'Ahueni kubwa (+20% hadi +30%) kwa mahindi na maharage baada ya unyevu wa udongo kurejea.',
    },
    {
      filiere: 'Vanilla (Kilimo cha Biashara SAVA)',
      prediction2027:
        'Hatari kubwa kwa ubora na kiasi: mvua nyingi mwishoni mwa 2026 zikifuatiwa na joto mwanzoni mwa 2027 huleta ugonjwa wa Fusarium.',
      prediction2028:
        'Utulivu wa mavuno unatarajiwa iwapo kimbunga kikubwa hakitapiga Kaskazini-Mashariki (Antalaha, Sambava, Andapa) mapema 2028.',
    },
    {
      filiere: 'Kahawa, Karafuu & Lychee (Pwani ya Mashariki)',
      prediction2027:
        'Msongo wa joto na maji (Atsinanana, Analanjirofo, Fitovinany): upungufu wa -10% hadi -20% wa kahawa ya Robusta na lychee.',
      prediction2028:
        'Mrejesho mkubwa wa mzunguko (hasa karafuu na lychee kufuatia kurejea kwa unyevu).',
    },
  ],
};

export function getLocalizedFilieres(lang: LanguageCode): Filiere2027vs2028[] {
  if (lang === 'fr') return FILIERES_2027_VS_2028;
  const tr = FILIERES_TRANSLATIONS[lang];
  return FILIERES_2027_VS_2028.map((f, i) => ({ ...f, ...(tr[i] ?? {}) }));
}

const HYDRO_PROFILES_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<DistrictHydroProfile['id'], Partial<DistrictHydroProfile>>
> = {
  en: {
    'grand-sud-eau': {
      title: '1. Critical Water Deficit (Grand Sud & South-West)',
      zoneSubtitle: 'Shallow aquifers & Mandrare, Menarandra, Onilahy river basins',
      hydroSignal2027: '-35% to -55% aquifer recharge',
      prediction2027:
        '-35% to -55% decline in shallow groundwater recharge and early drying of rivers (Mandrare, Menarandra, Onilahy) from May 2027. Acute drinking and livestock water stress.',
      prediction2028:
        'Gradual groundwater recharge between January and April 2028, carrying flash-flood hazards over bare, drought-crusted soils.',
    },
    'hydro-centre': {
      title: '2. Hydropower Basins & Large Irrigation Schemes (Center & Mid-West)',
      zoneSubtitle: 'Vohitra, Ikopa, Mania rivers · Andekaleka Dam & Lake Alaotra',
      hydroSignal2027: 'Record low flows Jul–Nov 2027 (RIA)',
      prediction2027:
        'Historically low baseflows in Vohitra, Ikopa, and Mania rivers between July and November 2027, cutting RIA hydropower generation and constraining off-season rice irrigation.',
      prediction2028:
        'Normalization of reservoir storage and Lake Alaotra water levels from Q1 2028.',
    },
    'plaines-nord-ouest': {
      title: '3. North-West Alluvial Rice Plains',
      zoneSubtitle: 'Betsiboka & Sofia river basins · Vary jeby rice',
      hydroSignal2027: 'Betsiboka / Sofia deficit (vary jeby)',
      prediction2027:
        'Early-season Betsiboka and Sofia discharge deficit reducing irrigated vary jeby rice acreage (off-season) between May and October 2027.',
      prediction2028:
        'High overbank flood risk across Marovoay and Sofia lowlands between Jan and Mar 2028 if the La Niña shift reactivates Mozambique Channel cyclogenesis.',
    },
    'cotiers-nord-est': {
      title: '4. Northern & Eastern Coastal Districts',
      zoneSubtitle: 'Indian Ocean seaboard · 2028 depression risk',
      hydroSignal2027: 'North excess (Jan 27) then East dry',
      prediction2027:
        'Pronounced water excess through January 2027 in the Far North (Diana/SAVA), followed by relative mid-2027 drying along the Central-East and South-East coast.',
      prediction2028:
        'Peak exposure to returning Indian Ocean depressions and cyclones (Jan–Apr 2028), driving heavy rainfall surpluses and coastal flooding.',
    },
  },
  sw: {
    'grand-sud-eau': {
      title: '1. Upungufu Mkali wa Maji (Kusini Kuu & Kusini-Magharibi)',
      zoneSubtitle: 'Chemchemi & mito ya Mandrare, Menarandra, Onilahy',
      hydroSignal2027: '-35% hadi -55% kujazwa kwa chemchemi',
      prediction2027:
        'Kupungua kwa -35% hadi -55% kwa maji ya ardhini na kukauka mapema kwa mito (Mandrare, Menarandra, Onilahy) kuanzia Mei 2027. Uhaba wa maji ya kunywa na mifugo.',
      prediction2028:
        'Kujazwa tena kwa maji ya ardhini Jan–Apr 2028 pamoja na hatari ya mafuriko ya ghafla kwenye udongo mkavu.',
    },
    'hydro-centre': {
      title: '2. Mabonde ya Umeme wa Maji & Umwagiliaji (Kati & Magharibi ya Kati)',
      zoneSubtitle: 'Mito ya Vohitra, Ikopa, Mania · Bwawa la Andekaleka & Ziwa Alaotra',
      hydroSignal2027: 'Kina cha chini Jul–Nov 2027 (RIA)',
      prediction2027:
        'Kushuka kwa kina cha mito ya Vohitra, Ikopa na Mania Julai–Novemba 2027, kupunguza umeme wa maji kwenye gridi ya RIA na kilimo cha nje ya msimu.',
      prediction2028:
        'Kurejea katika hali ya kawaida kwa mabwawa na Ziwa Alaotra kuanzia robo ya kwanza ya 2028.',
    },
    'plaines-nord-ouest': {
      title: '3. Tambarare Kubwa za Kaskazini-Magharibi',
      zoneSubtitle: 'Mabonde ya Betsiboka na Sofia · Mpunga vary jeby',
      hydroSignal2027: 'Upungufu Betsiboka / Sofia (vary jeby)',
      prediction2027:
        'Upungufu wa maji katika mito ya Betsiboka na Sofia unapunguza eneo la umwagiliaji wa mpunga vary jeby kati ya Mei na Oktoba 2027.',
      prediction2028:
        'Hatari kubwa ya mafuriko katika mabonde ya Marovoay na Sofia Jan–Mac 2028 iwapo La Niña itachochea vimbunga.',
    },
    'cotiers-nord-est': {
      title: '4. Wilaya za Pwani ya Kaskazini & Mashariki',
      zoneSubtitle: 'Pwani ya Bahari ya Hindi · Hatari ya dhoruba 2028',
      hydroSignal2027: 'Ziada Kaskazini (Jan 27) kisha ukavu Mashariki',
      prediction2027:
        'Mvua za ziada hadi Januari 2027 Kaskazini (Diana/Sava), zikifuatiwa na ukavu wa kiasi pwani ya Mashariki katikati ya 2027.',
      prediction2028:
        'Hatari kubwa ya kurejea kwa dhoruba na vimbunga vya Bahari ya Hindi (Jan–Apr 2028) vikileta mafuriko ya pwani.',
    },
  },
};

export function getLocalizedHydroProfiles(lang: LanguageCode): DistrictHydroProfile[] {
  if (lang === 'fr') return HYDRO_DISTRICT_PROFILES;
  const dict = HYDRO_PROFILES_TRANSLATIONS[lang];
  return HYDRO_DISTRICT_PROFILES.map((p) => ({ ...p, ...(dict[p.id] ?? {}) }));
}

const XGBOOST_GUARD_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, Partial<HyperparamGuard>[]> = {
  en: [
    { value: 'Chronological 80% / 20% split', purpose: 'Prevents future data leakage when cross-validating 10–20 year crop series.' },
    { purpose: 'Caps tree depth and requires multiple samples per leaf so the model never memorizes noise.' },
    { purpose: 'Slow step-wise learning with automatic stop once validation error starts rising.' },
    { purpose: 'Lasso (L1) prunes noisy weather predictors while Ridge (L2) smooths leaf weights.' },
    { purpose: 'Random sub-sampling of years (bagging) and climate features per boosted tree.' },
  ],
  sw: [
    { value: 'Mgawanyo wa muda 80% / 20%', purpose: 'Huzuia uvujaji wa data ya baadaye wakati wa kuthibitisha mfululizo wa miaka 10–20.' },
    { purpose: 'Hupunguza kina cha miti na huhitaji sampuli nyingi kwa jani ili kuzuia kukariri kelele.' },
    { purpose: 'Kujifunza taratibu huku kukiwa na usitishaji otomatiki kosa linapoanza kupanda.' },
    { purpose: 'Adhabu ya Lasso (L1) huondoa vigezo visivyo muhimu na Ridge (L2) hulainisha uzito.' },
    { purpose: 'Kuchagua kwa nasibu miaka (bagging) na vigezo vya hali ya hewa kwa kila mti.' },
  ],
};

export function getLocalizedXgboostGuards(lang: LanguageCode): HyperparamGuard[] {
  if (lang === 'fr') return XGBOOST_ANTI_OVERFIT_PARAMS;
  const tr = XGBOOST_GUARD_TRANSLATIONS[lang];
  return XGBOOST_ANTI_OVERFIT_PARAMS.map((g, i) => ({ ...g, ...(tr[i] ?? {}) }));
}

const HYBRID_AI_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, HybridAiComponent[]> = {
  en: [
    {
      component: '1. Tabular Model (Regularized XGBoost)',
      role: 'Produces quantitative district-by-crop forecasts (tonnes/ha, rainfall mm, rice price).',
      trainingSources: 'NASA POWER, Copernicus ERA5, FAOSTAT, ONI / IOD ocean indices.',
      implementation: 'Exports a structured JSON grid across all 119 districts (2027–2028 horizons).',
    },
    {
      component: '2. Fine-Tuned Domain LLM (QLoRA)',
      role: 'Captures local agronomic terminology (kapoaka, vary aloha, kéré) and Malagasy farming logic.',
      trainingSources: 'Historical FOFIFA bulletins, Malagasy/French farm lexicons, El Niño analogs (1997, 2015, 2023).',
      implementation: 'Low-memory 4-bit QLoRA adapter on Mistral-7B or Llama-3-8B.',
    },
    {
      component: '3. RAG Memory (Dynamic Retrieval)',
      role: 'Injects live ground facts (decrees, road cuts, locust alerts) prior to synthesis.',
      trainingSources: 'Monthly Météo Madagascar bulletins, FEWS NET briefs, BNGRC alerts, OdR market prices.',
      implementation: '800-char PDF chunking, multilingual embeddings, and FAISS / ChromaDB vector index.',
    },
  ],
  sw: [
    {
      component: '1. Muundo wa Takwimu (Regularized XGBoost)',
      role: 'Huzalisha utabiri wa kiidadi kwa kila wilaya na zao (tani/ha, mvua mm, bei).',
      trainingSources: 'NASA POWER, Copernicus ERA5, FAOSTAT, vielelezo vya ONI / IOD.',
      implementation: 'Hutoa faili la JSON kwa wilaya zote 119 (miaka 2027–2028).',
    },
    {
      component: '2. LLM Maalumu Iliyofunzwa (QLoRA)',
      role: 'Hutumia msamiati wa ndani (kapoaka, vary aloha, kéré) na mantiki ya kilimo cha Madagaska.',
      trainingSources: 'Ripoti za FOFIFA, msamiati wa Kifaransa/Kimalagasi, matukio ya El Niño (1997, 2015, 2023).',
      implementation: 'Marekebisho ya QLoRA (4-bit) kwenye Mistral-7B au Llama-3-8B.',
    },
    {
      component: '3. Kumbukumbu ya RAG (Taarifa za Wakati Halisi)',
      role: 'Huingiza taarifa za sasa (matangazo, kukatika kwa barabara, nzige) kabla ya kutoa ushauri.',
      trainingSources: 'Taarifa za Météo Madagascar, FEWS NET, tahadhari za BNGRC na bei za OdR.',
      implementation: 'Kugawanya PDF (herufi 800), embeddings za lugha nyingi na faharasa ya FAISS.',
    },
  ],
};

export function getLocalizedHybridArchitecture(lang: LanguageCode): HybridAiComponent[] {
  return lang === 'fr' ? HYBRID_AI_ARCHITECTURE : HYBRID_AI_TRANSLATIONS[lang];
}

const HYBRID_DEMOS_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<string, Partial<HybridOrchestrationDemo>>
> = {
  en: {
    ambatondrazaka: {
      query: 'What is the risk for rice production and water supply in Ambatondrazaka district in 2027?',
      ragExcerpts: [
        {
          source: 'Météo Madagascar Bulletin (Oct 2026)',
          snippet: 'Delayed and erratic rain onset over the Lake Alaotra basin; cumulative deficit through January 2027.',
        },
        {
          source: 'BNGRC / Rice Observatory Note (Nov 2026)',
          snippet: 'Low dam reserves feeding irrigation perimeters; hoarding watch and ANMCC stock inspections.',
        },
      ],
      synthesizedPlan:
        'With a projected -28% water deficit at Lake Alaotra and -12% rice yield decline, cooperatives should switch to young-seedling SRI transplanting (8–12 day seedlings) once sluice gates open, avoid unbuffered vary aloha sowing, and submit a micro-irrigation grant file to the Alaotra-Mangoro FDA-R desk.',
    },
    ambovombe: {
      query: 'What priority actions should Ambovombe deploy for 2027 against kéré famine risk?',
      ragExcerpts: [
        {
          source: 'FOFIFA / DGM Calendar (Oct 26, 2026)',
          snippet: 'Wait strictly for 20–30 mm cumulative rainfall over 3 days (mid-Dec to Jan); prioritize 90-day sorghum and millet.',
        },
        {
          source: 'FAO / WFP Ambovombe Sub-Office Report',
          snippet: 'Scale-up of Cash+ transfers and resilient seeds to 32,000 farmers; watch steep price jumps in maize and cassava.',
        },
      ],
      synthesizedPlan:
        'Facing a -48% groundwater recharge drop and -38% traditional maize loss, replace rainfed maize with 90-day sorghum/millet in mulched Zaï basins intercropped with pigeon pea (ambatry), while linking cooperatives to Ambovombe DEFIS and WFP programs.',
    },
    marovoay: {
      query: 'How can vary jeby rice be protected and locust risk managed in Marovoay across 2027–2028?',
      ragExcerpts: [
        {
          source: 'CirAE / DRAE Boeny (2026–2027 Campaign)',
          snippet: 'Priority canal desilting across the Marovoay plain, PURPA fertilizer support, and preventive anti-locust sweeps.',
        },
        {
          source: 'ERA5 Hydrological Model (Betsiboka Basin)',
          snippet: 'Contraction in vary jeby acreage May–Oct 2027, followed by severe overbank flood hazard in Q1 2028 as La Niña arrives.',
        },
      ],
      synthesizedPlan:
        'Shift rainfed sowing to December 2026, complete canal desilting ahead of Betsiboka low-flow season to safeguard vary jeby, activate anti-locust monitoring Mar–Jun 2027, and reinforce flood embankments by late 2027.',
    },
  },
  sw: {
    ambatondrazaka: {
      query: 'Ni hatari ipi inakabili mpunga na upatikanaji wa maji katika wilaya ya Ambatondrazaka mwaka 2027?',
      ragExcerpts: [
        {
          source: 'Taarifa ya Météo Madagascar (Okt 2026)',
          snippet: 'Kuchelewa na kuyumba kwa mvua katika bonde la Ziwa Alaotra; upungufu hadi Januari 2027.',
        },
        {
          source: 'Taarifa ya BNGRC / OdR (Nov 2026)',
          snippet: 'Kiwango cha chini cha maji kwenye mabwawa ya umwagiliaji; uangalizi dhidi ya ulanguzi wa mchele.',
        },
      ],
      synthesizedPlan:
        'Kwa upungufu wa maji wa -28% katika Ziwa Alaotra na kushuka kwa mpunga kwa -12%, vyama vya ushirika vitumie upandikizaji wa miche michanga ya SRI (siku 8–12), viepuke mbegu zisizo na hakika ya maji, na viombe msaada katika dirisha la FDA-R Alaotra-Mangoro.',
    },
    ambovombe: {
      query: 'Ni hatua zipi za kipaumbele kwa msimu wa 2027 Ambovombe kuzuia njaa ya kéré?',
      ragExcerpts: [
        {
          source: 'Kalenda ya FOFIFA / DGM (26 Okt 2026)',
          snippet: 'Subiri mvua za mm 20–30 kwa siku 3 mfululizo (Desemba–Januari); tumia mtama na uwele wa siku 90.',
        },
        {
          source: 'Ripoti ya FAO / WFP Ambovombe',
          snippet: 'Upanuzi wa misaada ya Cash+ na mbegu bora kwa wakulima 32,000; tahadhari ya bei ya mahindi na muhogo.',
        },
      ],
      synthesizedPlan:
        'Kutokana na upungufu wa maji chini ya ardhi wa -48% na anguko la mahindi la -38%, badilisha mahindi na mtama/uwele wa siku 90 katika mashimo ya Zaï yenye matandazo na mbaazi (ambatry), ukijiunga na programu za DEFIS na WFP.',
    },
    marovoay: {
      query: 'Jinsi ya kulinda mpunga wa vary jeby na kudhibiti nzige Marovoay mnamo 2027–2028?',
      ragExcerpts: [
        {
          source: 'CirAE / DRAE Boeny (Msimu 2026–2027)',
          snippet: 'Kusafisha mifereji ya umwagiliaji Marovoay, msaada wa mbolea PURPA na ufuatiliaji wa nzige.',
        },
        {
          source: 'Muundo wa Maji ERA5 (Bonde la Betsiboka)',
          snippet: 'Kupungua kwa eneo la vary jeby Mei–Okt 2027, kukifuatiwa na hatari ya mafuriko Q1 2028 chini ya La Niña.',
        },
      ],
      synthesizedPlan:
        'Sogeza upanzi wa mvua hadi Desemba 2026, safisha mifereji kabla ya maji ya Betsiboka kupungua, anzisha doria ya nzige Mac–Jun 2027 na imarisha kingo za mito kabla ya mafuriko ya 2028.',
    },
  },
};

export function getLocalizedHybridDemos(lang: LanguageCode): HybridOrchestrationDemo[] {
  if (lang === 'fr') return HYBRID_ORCHESTRATION_DEMOS;
  const dict = HYBRID_DEMOS_TRANSLATIONS[lang];
  return HYBRID_ORCHESTRATION_DEMOS.map((d) => ({ ...d, ...(dict[d.id] ?? {}) }));
}

const QLORA_HYPERPARAMS_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, { param: string; value?: string; detail: string }[]> = {
  en: [
    { param: 'Quantization', detail: 'Fits on a 16 GB T4 GPU (Colab / local server)' },
    { param: 'LoRA Rank & Alpha', detail: 'Targeted adaptation without overwriting base model weights' },
    { param: 'Target Modules', detail: 'Attention & MLP projection layers (Mistral-7B / Llama-3-8B)' },
    { param: 'Epochs', detail: 'Prevents rote memorization of exact forecast figures' },
  ],
  sw: [
    { param: 'Kiwango cha Kubana (Quantization)', detail: 'Inafanya kazi kwenye GPU ya T4 16 GB' },
    { param: 'LoRA Rank & Alpha', detail: 'Marekebisho lengwa bila kuharibu uzito wa msingi' },
    { param: 'Moduli Lengwa', detail: 'Tabaka za Attention na MLP (Mistral-7B / Llama-3-8B)' },
    { param: 'Mizunguko (Epochs)', detail: 'Huzuia kukariri kwa lazima namba za utabiri' },
  ],
};

export function getLocalizedQloraHyperparams(lang: LanguageCode) {
  if (lang === 'fr') return QLORA_HYPERPARAMS;
  const tr = QLORA_HYPERPARAMS_TRANSLATIONS[lang];
  return QLORA_HYPERPARAMS.map((q, i) => ({
    ...q,
    param: tr[i]?.param ?? q.param,
    detail: tr[i]?.detail ?? q.detail,
  }));
}

const PROFILE_LABEL_MAP: Record<Exclude<LanguageCode, 'fr'>, Record<DistrictPredictionPoint['profile'], string>> = {
  en: {
    'Grand Sud & Sud-Ouest': 'Grand Sud & South-West',
    'Centre & Hydroélectricité': 'Center & Hydropower',
    'Nord-Ouest Alluvial': 'North-West Alluvial',
    'Côtiers Nord & Est': 'North & East Coastal',
  },
  sw: {
    'Grand Sud & Sud-Ouest': 'Kusini Kuu & Kusini-Magharibi',
    'Centre & Hydroélectricité': 'Kati & Umeme wa Maji',
    'Nord-Ouest Alluvial': 'Tambarare Kaskazini-Magharibi',
    'Côtiers Nord & Est': 'Pwani Kaskazini & Mashariki',
  },
};

export function getLocalizedDistrictProfileLabel(
  profile: DistrictPredictionPoint['profile'],
  lang: LanguageCode
): string {
  if (lang === 'fr') return profile;
  return PROFILE_LABEL_MAP[lang][profile] ?? profile;
}

const DISTRICT_RAG_NOTES_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<string, string[]>
> = {
  en: {
    Ambovombe: [
      'FOFIFA/DGM (26 Oct 2026): Shift planting to mid-Dec–Jan after 20–30 mm rain over 3 days; favor 90-day sorghum/millet.',
      'FAO / WFP Ambovombe: Critical food insecurity (IPC Phase 4–5 Q3 2027), Cash+ transfers and resilient seed kits.',
    ],
    Tsihombe: [
      'Early drying of shallow aquifers & Menarandra river from May 2027; flash-flood risk in Q1 2028.',
      'Zaï technique (20 cm compost basins) + pigeon pea & sisal windbreaks against sand drift.',
    ],
    Beloha: [
      '-35% to -55% shallow groundwater drop; livestock watering alert and acute kéré famine hazard.',
      'Substitute maize with 90-day millet/sorghum and spreading cowpea intercropping.',
    ],
    Bekily: [
      'Early Q3 2027 lean season; register cooperatives at CirAE for PURPA input kits and DEFIS support.',
    ],
    'Amboasary-Atsimo': [
      'Maximum Anosy vigilance: water deficit across Mandrare basin, pasture protection & potable water trucking.',
    ],
    Taolagnaro: [
      'Sharp contrast between arid western Anosy and humid Taolagnaro coast; grain reserves & port logistics.',
    ],
    Ampanihy: [
      'Early drying of Menarandra river; heavy mulching and drought-tolerant cassava cuttings.',
    ],
    Betioky: [
      'Critical drawdown on Onilahy river from May 2027; HIMO Cash-for-Work canal rehabilitation.',
    ],
    'Toliara II': [
      'Active WFP Toliara sub-office; protect coastal plots with live sisal and spineless cactus hedges.',
    ],
    Morombe: [
      '-30% to -45% rainfall deficit; drip micro-irrigation and drought-hardy pigeon pea.',
    ],
    Ihosy: [
      'Ihorombe plateau: pasture degradation, staple yield drop and need for pastoral water points.',
    ],
    Morondava: [
      'Coastal Menabe: moderate-to-high rainfall deficit, extreme heat and Dabara irrigation scheme management.',
    ],
    'Belo-sur-Tsiribihina': [
      'Delayed Menabe rains and +2 to +4 °C heatwaves; locust outbreak surveillance Mar–Jun 2027.',
    ],
    Miandrivazo: [
      'Inland Menabe pilot district: severe heat stress on maize and lowland rice; Tsiribihina watershed management.',
    ],
    Ambatondrazaka: [
      'Lake Alaotra basin: low reservoir storage in 2027 followed by +10–15% rebound in 2028 with flood watch.',
      'Adopt young-seedling SRI/SRA (8–12 days) and GCV grain storage ahead of the 3,200 MGA/kg rice price peak.',
    ],
    Amparafaravola: [
      'Greater Lake Alaotra scheme: off-season 2027 water strain; full refill expected by Q1 2028.',
    ],
    Moramanga: [
      'Vohitra basin / Andekaleka Dam: historically low dry-season flow Jul–Nov 2027 weighing on RIA power grid.',
    ],
    'Antananarivo-Atsimondrano': [
      'Ikopa plain: water deficit until Jan 2027 then late Feb–Apr rains; ANMCC price controls & buffer rice.',
    ],
    'Antsirabe II': [
      'Central Highlands: rainfed tanety sowing mid-Nov to mid-Dec (110–120d varieties) under SCV + Brachiaria/Vetiver strips.',
    ],
    Miarinarivo: [
      'Maize–climbing bean or soybean association via direct-seeded SCV mulch (GSDM support).',
    ],
    Tsiroanomandidy: [
      'Mid-West: delayed tanety rainfall and lower Mania river flow; deploy intermediate-cycle varieties.',
    ],
    Ambositra: [
      "Amoron'i Mania: erratic rains disrupting terraced rice transplanting calendars.",
    ],
    Fianarantsoa: [
      'Haute Matsiatra: crop planting delays, water stress and highland pasture monitoring.',
    ],
    Marovoay: [
      'Marovoay plain: Betsiboka deficit on vary jeby rice (May–Oct 2027) & locust watch; Q1 2028 flood hazard.',
    ],
    Mitsinjo: [
      'Shift rainfed rice & groundnut sowing to December; canal desilting and subsidized CirAE/PURPA fertilizer.',
    ],
    'Ambato-Boeny': [
      'Delayed monsoon and extreme heatwaves; preventive locust surveillance Mar–Jun 2027.',
    ],
    Maevatanana: [
      'Betsiboka basin: initial water deficit followed by overbank flood risk in early 2028 under La Niña.',
    ],
    Antsohihy: [
      'Sofia basin: shift sowing into December; strip-intercrop upland rice and groundnut.',
    ],
    'Port-Bergé': [
      'High flooding hazard across Sofia lowlands between January and March 2028.',
    ],
    'Antsiranana II': [
      'Excess rainfall Nov 2026–Jan 2027: plant early in November on well-drained plots.',
    ],
    Ambilobe: [
      'BNGRC food pre-positioning and drain clearing against Nov–Jan localized flash floods.',
    ],
    'Nosy Be': [
      'Coastal watch and heavy Diana rainfall; protect ylang-ylang crops and feeder roads.',
    ],
    Sambava: [
      'SAVA vanilla: heavy late-2026 rains + early-2027 heat peak (flower drop & Fusarium risk); Gliricidia shade.',
    ],
    Antalaha: [
      'Vanilla stabilization projected in 2028 provided no major cyclone makes landfall in early 2028.',
    ],
    'Fénérive-Est': [
      'Analanjirofo: excess rain and lowland flooding on cloves/lychee; maintain field drainage channels.',
    ],
    Maroantsetra: [
      'High 2027 humidity stress on vanilla/cocoa and returning cyclone exposure Jan–Apr 2028.',
    ],
    'Toamasina II': [
      '2027 heat/water strain on lychee and cloves (-10% to -20% export volume) followed by strong 2028 recovery.',
    ],
    Brickaville: [
      'East Coast pilot district (Atsinanana): Rianila/Iaroka river floods threatening roads and export crops.',
    ],
    Mananjary: [
      'Dry onset followed by abrupt heavy rains Feb–Apr 2027 flooding lowland coffee, cloves, and pepper.',
    ],
    Manakara: [
      'WFP Manakara sub-office & DEFIS project: school canteens and HIMO drainage rehabilitation.',
    ],
    Farafangana: [
      'Cumulative water deficit followed by coastal flood hazard on Robusta coffee and pepper.',
    ],
    Vangaindrano: [
      'Southern Atsimo-Atsinanana: alternating dry pockets and erratic downpours straining food crops.',
    ],
  },
  sw: {
    Ambovombe: [
      'FOFIFA/DGM (26 Okt 2026): Sogeza upanzi hadi Des–Jan baada ya mvua ya mm 20–30; panda mtama/uwele wa siku 90.',
      'FAO / WFP Ambovombe: Hatari kubwa ya njaa (IPC 4–5 Q3 2027), misaada ya Cash+ na mbegu bora.',
    ],
    Tsihombe: [
      'Kukauka mapema kwa visima na Mto Menarandra kuanzia Mei 2027; hatari ya mafuriko Q1 2028.',
      'Mashimo ya Zaï (cm 20 yenye mbolea) + mipaka ya mbaazi na mkonge kuzuia mchanga.',
    ],
    Beloha: [
      'Kupungua kwa -35% hadi -55% kwa maji ya ardhini; tahadhari ya maji ya mifugo na njaa ya kéré.',
      'Badilisha mahindi na uwele/mtama wa siku 90 pamoja na kunde.',
    ],
    Bekily: [
      'Uhaba wa mapema Q3 2027; sajili ushirika katika CirAE kupata vifaa vya PURPA na DEFIS.',
    ],
    'Amboasary-Atsimo': [
      'Tahadhari ya juu Anosy: upungufu wa maji bonde la Mandrare, ulinzi wa malisho na maji safi.',
    ],
    Taolagnaro: [
      'Tofauti kati ya magharibi kavu ya Anosy na pwani yenye unyevu ya Taolagnaro; akiba na bandari.',
    ],
    Ampanihy: [
      'Kukauka mapema kwa Menarandra; matandazo mazito na vipandikizi vya muhogo vinavyostahimili ukame.',
    ],
    Betioky: [
      'Kupungua sana kwa Mto Onilahy kuanzia Mei 2027; kazi za HIMO kukarabati mifereji.',
    ],
    'Toliara II': [
      'Ofisi ya WFP Toliara iko hai; linda mashamba ya pwani kwa uzio wa mkonge na cactus.',
    ],
    Morombe: [
      'Upungufu wa mvua -30% hadi -45%; umwagiliaji wa matone na kilimo cha mbaazi.',
    ],
    Ihosy: [
      'Uwanda wa Ihorombe: kuharibika kwa malisho, kupungua kwa mavuno na uhitaji wa visima vya mifugo.',
    ],
    Morondava: [
      'Pwani ya Menabe: upungufu wa mvua na joto kali; usimamizi wa mradi wa umwagiliaji wa Dabara.',
    ],
    'Belo-sur-Tsiribihina': [
      'Kuchelewa kwa mvua Menabe na joto +2 hadi +4 °C; doria ya nzige Mac–Jun 2027.',
    ],
    Miandrivazo: [
      'Wilaya ya majaribio Menabe: msongo wa joto kwa mahindi na mpunga; usimamizi wa bonde la Tsiribihina.',
    ],
    Ambatondrazaka: [
      'Bonde la Ziwa Alaotra: akiba ndogo ya maji 2027 kisha ahueni +10–15% 2028 yenye tahadhari ya mafuriko.',
      'Tumia kilimo cha mpunga SRI (miche ya siku 8–12) na ghala la jamii kabla ya bei ya MGA 3,200/kg.',
    ],
    Amparafaravola: [
      'Bonde la Ziwa Alaotra: shinikizo la maji msimu wa 2027; maji kurejea Q1 2028.',
    ],
    Moramanga: [
      'Bonde la Vohitra / Bwawa la Andekaleka: upungufu wa maji Jul–Nov 2027 ukiathiri umeme wa RIA.',
    ],
    'Antananarivo-Atsimondrano': [
      'Bonde la Ikopa: ukame hadi Jan 2027 kisha mvua za Feb–Apr; udhibiti wa bei wa ANMCC.',
    ],
    'Antsirabe II': [
      'Nyanda za Juu: upanzi wa tanety katikati ya Nov–Des (mbegu siku 110–120) chini ya SCV + nyasi za Vetiver.',
    ],
    Miarinarivo: [
      'Mseto wa mahindi na maharage/soya kwa kilimo hifadhi SCV (msaada wa GSDM).',
    ],
    Tsiroanomandidy: [
      'Magharibi ya Kati: kuchelewa kwa mvua na kupungua kwa Mto Mania; tumia mbegu za muda wa kati.',
    ],
    Ambositra: [
      "Amoron'i Mania: mvua zisizo za kawaida zinazochelewesha upandikizaji wa mpunga.",
    ],
    Fianarantsoa: [
      'Haute Matsiatra: kuchelewa kwa mazao, upungufu wa maji na ufuatiliaji wa malisho.',
    ],
    Marovoay: [
      'Bonde la Marovoay: upungufu wa Betsiboka kwa mpunga vary jeby (Mei–Okt 2027) & nzige; mafuriko Q1 2028.',
    ],
    Mitsinjo: [
      'Sogeza mpunga na karanga hadi Desemba; safisha mifereji na tumia mbolea ya ruzuku PURPA.',
    ],
    'Ambato-Boeny': [
      'Kuchelewa kwa monsuni na joto kali; ufuatiliaji wa nzige Mac–Jun 2027.',
    ],
    Maevatanana: [
      'Bonde la Betsiboka: ukame wa awali ukifuatiwa na hatari ya mafuriko mapema 2028 chini ya La Niña.',
    ],
    Antsohihy: [
      'Bonde la Sofia: sogeza upanzi hadi Desemba; changanya mpunga wa mvua na karanga.',
    ],
    'Port-Bergé': [
      'Hatari kubwa ya mafuriko katika mabonde ya Sofia Januari hadi Machi 2028.',
    ],
    'Antsiranana II': [
      'Mvua nyingi Nov 2026–Jan 2027: panda mapema Novemba kwenye mashamba yenye mitaro ya kutoa maji.',
    ],
    Ambilobe: [
      'Hifadhi ya chakula ya BNGRC na kusafisha mitaro dhidi ya mafuriko ya Nov–Jan.',
    ],
    'Nosy Be': [
      'Uangalizi wa pwani na mvua kubwa Diana; linda kilimo cha ylang-ylang na barabara.',
    ],
    Sambava: [
      'Vanilla SAVA: mvua nyingi mwisho wa 2026 + joto mapema 2027 (hatari ya Fusarium); kivuli cha Gliricidia.',
    ],
    Antalaha: [
      'Utulivu wa vanilla unatarajiwa 2028 iwapo hakutakuwa na kimbunga kikubwa mwanzoni mwa 2028.',
    ],
    'Fénérive-Est': [
      'Analanjirofo: mvua nyingi na mafuriko kwenye karafuu/lychee; safisha mifereji ya shambani.',
    ],
    Maroantsetra: [
      'Unyevu mwingi 2027 ukidhuru vanilla/kakao na hatari ya vimbunga Jan–Apr 2028.',
    ],
    'Toamasina II': [
      'Msongo wa joto 2027 kwenye lychee na karafuu (-10% hadi -20%) kisha ongezeko kubwa 2028.',
    ],
    Brickaville: [
      'Wilaya ya pwani ya Mashariki (Atsinanana): mafuriko ya mito Rianila/Iaroka yakitishia barabara na mazao.',
    ],
    Mananjary: [
      'Mwanzo mkavu ukifuatiwa na mvua za ghafla Feb–Apr 2027 zikifurika kahawa, karafuu na pilipili.',
    ],
    Manakara: [
      'Ofisi ya WFP Manakara & mradi wa DEFIS: chakula shuleni na ukarabati wa mifereji HIMO.',
    ],
    Farafangana: [
      'Upungufu wa maji ukifuatiwa na hatari ya mafuriko pwani kwenye kahawa na pilipili.',
    ],
    Vangaindrano: [
      'Kusini mwa Atsimo-Atsinanana: vipindi vya ukame na mvua zisizotabirika zikidhoofisha mazao.',
    ],
  },
};

export function getLocalizedDistrictChoroplethData(lang: LanguageCode): DistrictPredictionPoint[] {
  if (lang === 'fr') return DISTRICT_CHOROPLETH_DATA;
  const notesMap = DISTRICT_RAG_NOTES_TRANSLATIONS[lang];
  return DISTRICT_CHOROPLETH_DATA.map((d) => ({
    ...d,
    ragNotes: notesMap[d.district] ?? d.ragNotes,
  }));
}

const PROVINCE_CHANNEL_TRANSLATIONS: Record<Exclude<LanguageCode, 'fr'>, Record<string, string>> = {
  en: {
    Toliara: 'Maize & cassava collapse, cattle (zebu) herd liquidation, and potable water deficit',
    Fianarantsoa: 'Water stress on staples, coffee/pepper declines, and South-East erosion/floods',
    Toamasina: 'Lake Alaotra rice bowl strain, RIA hydropower shortfall & export cash crops (lychee/cloves)',
    Mahajanga: 'Betsiboka/Sofia irrigated plains (vary jeby), locust hazard & 2028 flood exposure',
    Antananarivo: 'Urban rice/food price inflation, hydropower drawdown & outdoor heat labor productivity loss',
    Antsiranana: 'SAVA vanilla flower drop & Fusarium rot, landslides and cyclone exposure',
  },
  sw: {
    Toliara: 'Kuporomoka kwa mahindi/muhogo, kuuzwa kwa mifugo (zebu) na uhaba wa maji safi',
    Fianarantsoa: 'Ukame kwenye mazao ya chakula, kahawa/pilipili na mmomonyoko Kusini-Mashariki',
    Toamasina: 'Msongo kwenye bonde la mpunga la Alaotra, upungufu wa umeme RIA na mazao ya biashara (lychee/karafuu)',
    Mahajanga: 'Tambarare za Betsiboka/Sofia (vary jeby), hatari ya nzige na mafuriko ya 2028',
    Antananarivo: 'Mfumuko wa bei za mchele mijini, upungufu wa umeme na kupungua kwa nguvu kazi kutokana na joto',
    Antsiranana: 'Kupukutika kwa maua ya vanilla SAVA & Fusarium, maporomoko na hatari ya vimbunga',
  },
};

export function getLocalizedProvinceBaselines(lang: LanguageCode): ProvinceEconomicMeta[] {
  if (lang === 'fr') return PROVINCE_6_BASELINES;
  const tr = PROVINCE_CHANNEL_TRANSLATIONS[lang];
  return PROVINCE_6_BASELINES.map((p) => ({
    ...p,
    dominantChannel: tr[p.province] ?? p.dominantChannel,
  }));
}

const CONTINENTAL_TRANSLATIONS: Record<
  Exclude<LanguageCode, 'fr'>,
  Record<string, Partial<ContinentalCountryLossProfile>>
> = {
  en: {
    madagascar: {
      countryOrZone: 'Madagascar',
      climateSignal2027: 'Grand Sud drought (-30 to -50%) + North-East excess rain + RIA low hydro flow',
      transmissionChannel: 'Maize/cassava collapse in South, rice peak (3,200 MGA/kg), power & lean season losses',
    },
    comores: {
      countryOrZone: 'Comoros',
      climateSignal2027: 'Indian Ocean SST warming + erratic rains / tropical depression hazard',
      transmissionChannel: 'Higher rice import bill, Grande Comore drinking water stress & artisanal fisheries',
    },
    maurice: {
      countryOrZone: 'Mauritius',
      climateSignal2027: 'Marine heatwaves & localized extreme downpours',
      transmissionChannel: 'Lower sugarcane yields, cooling/water surcharges and higher food import bill',
    },
    seychelles: {
      countryOrZone: 'Seychelles',
      climateSignal2027: 'SST anomaly + positive IOD: tuna stock shift & coral bleaching stress',
      transmissionChannel: 'Drop in tuna catches (blue economy) and higher imported food logistics',
    },
    'reunion-mayotte': {
      countryOrZone: 'Réunion & Mayotte',
      climateSignal2027: 'Severe rainfall deficit (Mayotte) & coastal thermal peaks',
      transmissionChannel: 'Potable water rationing in Mayotte, cane/livestock strain & coastal flood works',
    },
    'afrique-du-sud': {
      countryOrZone: 'South Africa',
      climateSignal2027: 'Maize belt drying (Free State / North West) Jan–Feb 2027',
      transmissionChannel: 'Smaller summer grain harvest, H2 food inflation & reduced regional exports',
    },
    zambie: {
      countryOrZone: 'Zambia',
      climateSignal2027: 'Severe maize flowering drought & Zambezi basin inflow deficit',
      transmissionChannel: '20–40% maize drop + severe Kariba power rationing constraining copper mining',
    },
    zimbabwe: {
      countryOrZone: 'Zimbabwe',
      climateSignal2027: 'Heatwaves and critical Q1 2027 rainfall deficit',
      transmissionChannel: 'Maize/tobacco losses, Kariba power cuts & emergency grain imports',
    },
    malawi: {
      countryOrZone: 'Malawi',
      climateSignal2027: 'Prolonged mid-season dry spells during maize silking',
      transmissionChannel: 'Acute food staple gap, rising maize prices & heavy rural humanitarian burden',
    },
    mozambique: {
      countryOrZone: 'Mozambique',
      climateSignal2027: 'Split pattern: South/Central drought vs North coastal floods & cyclones',
      transmissionChannel: 'Limpopo valley crop losses paired with port/rail logistics corridor damage',
    },
    tanzanie: {
      countryOrZone: 'Tanzania',
      climateSignal2027: 'Excess coastal & Lake Victoria rainfall (floods) + central dry pockets',
      transmissionChannel: 'Rural feeder road washouts & post-harvest losses alongside selective hydro gains',
    },
    'angola-namibie-botswana': {
      countryOrZone: 'Angola, Namibia & Botswana',
      climateSignal2027: 'Semi-arid drought across Cunene / Okavango basins & pastoral strain',
      transmissionChannel: 'Livestock mortality, urban water stress (Windhoek/Gaborone) & cereal imports',
    },
    kenya: {
      countryOrZone: 'Kenya',
      climateSignal2027: 'Heavy rains & flooding (IOD+ / El Niño coupling) Rift corridor & coast',
      transmissionChannel: 'Bridge/road destruction, horticulture/tea losses & North–South supply chain breaks',
    },
    ethiopie: {
      countryOrZone: 'Ethiopia',
      climateSignal2027: 'Sharp contrast: Awash/Rift flooding vs localized northern deficits',
      transmissionChannel: 'Coffee/cereal losses, highway damage & large-scale humanitarian response',
    },
    ouganda: {
      countryOrZone: 'Uganda',
      climateSignal2027: 'Lake Victoria basin excess rains & highland landslides',
      transmissionChannel: 'Waterlogged coffee/matooke, rural road damage & lakeshore flooding',
    },
    'rwanda-burundi': {
      countryOrZone: 'Rwanda & Burundi',
      climateSignal2027: 'Intense hillside storms, soil erosion & valley flash floods',
      transmissionChannel: 'Terraced bean/maize losses & washed-out bridges and waterworks',
    },
    'egypte-soudan': {
      countryOrZone: 'Egypt & Sudan (North COMESA)',
      climateSignal2027: 'Summer Nile heatwaves & irrigation water demand surge',
      transmissionChannel: 'Heavier global wheat/maize import bill & peak cooling power demand',
    },
    'cote-ivoire-ghana': {
      countryOrZone: "Côte d'Ivoire & Ghana (Gulf of Guinea)",
      climateSignal2027: 'Reinforced Harmattan & erratic spring 2027 monsoon onset',
      transmissionChannel: 'Lower cocoa volumes (sustaining record world prices) & hydropower deficit',
    },
    sahel: {
      countryOrZone: 'Sahel Belt (Mali, Niger, Burkina, Chad, Senegal)',
      climateSignal2027: 'Extreme heat spikes & millet/sorghum dry spells',
      transmissionChannel: 'Critical fodder deficit, pastoral tension & food aid expansion',
    },
    'afrique-centrale': {
      countryOrZone: 'Central Africa (DRC, Cameroon, Congo, Gabon)',
      climateSignal2027: 'Erratic Congo Basin rainfall & falling navigable river levels',
      transmissionChannel: 'Barge transport delays on Congo/Oubangui, cassava/cocoa strain & higher freight',
    },
    'afrique-du-nord': {
      countryOrZone: 'North Africa (Morocco, Algeria, Tunisia)',
      climateSignal2027: 'Persistent blocking high pressure & winter moisture deficit',
      transmissionChannel: 'Wheat/barley harvest contraction & heavier state food import subsidies',
    },
  },
  sw: {
    madagascar: {
      countryOrZone: 'Madagaska',
      climateSignal2027: 'Ukame Kusini Kuu (-30 hadi -50%) + mvua Kaskazini-Mashariki + upungufu wa maji RIA',
      transmissionChannel: 'Anguko la mahindi/muhogo Kusini, kilele cha bei ya mchele (MGA 3,200/kg), nishati & uhaba',
    },
    comores: {
      countryOrZone: 'Komoro',
      climateSignal2027: 'Kuongezeka kwa joto la Bahari ya Hindi + mvua zisizo na uhakika',
      transmissionChannel: 'Kupanda kwa gharama ya kuagiza mchele, uhaba wa maji Grande Comore & uvuvi',
    },
    maurice: {
      countryOrZone: 'Morisi (Mauritius)',
      climateSignal2027: 'Joto kali baharini na mvua za ghafla za muda mfupi',
      transmissionChannel: 'Kupungua kwa mavuno ya miwa, gharama za maji/umeme na uagizaji wa chakula',
    },
    seychelles: {
      countryOrZone: 'Shelisheli (Seychelles)',
      climateSignal2027: 'Joto la SST + IOD chanya: kuhama kwa samaki aina ya jodari & uharibifu wa matumbawe',
      transmissionChannel: 'Kupungua kwa samaki wa jodari (uchumi wa bluu) na gharama za chakula kutoka nje',
    },
    'reunion-mayotte': {
      countryOrZone: 'Réunion & Mayotte',
      climateSignal2027: 'Upungufu wa mvua (Mayotte) na joto kali la pwani',
      transmissionChannel: 'Mgao wa maji ya kunywa Mayotte, athari kwa miwa/mifugo na kingo za pwani',
    },
    'afrique-du-sud': {
      countryOrZone: 'Afrika Kusini',
      climateSignal2027: 'Ukavu katika ukanda wa mahindi (Free State / Kaskazini-Magharibi) Jan–Feb 2027',
      transmissionChannel: 'Kupungua kwa mavuno ya majira ya joto, mfumuko wa bei H2 na mauzo nje',
    },
    zambie: {
      countryOrZone: 'Zambia',
      climateSignal2027: 'Ukame mkali mahindi yakichavusha & upungufu wa maji bonde la Zambezi',
      transmissionChannel: 'Kupungua kwa 20–40% mahindi + mgao mkali wa umeme wa Kariba ukipunguza shaba',
    },
    zimbabwe: {
      countryOrZone: 'Zimbabwe',
      climateSignal2027: 'Mawimbi ya joto na upungufu wa mvua robo ya 1 2027',
      transmissionChannel: 'Hasara ya mahindi/tumbaku, kukatika umeme wa Kariba & uagizaji nafaka wa dharura',
    },
    malawi: {
      countryOrZone: 'Malawi',
      climateSignal2027: 'Ukame wa muda mrefu katikati ya msimu wa ukuaji wa mahindi',
      transmissionChannel: 'Uhaba mkubwa wa chakula, kupanda kwa bei za mahindi & mahitaji ya misaada',
    },
    mozambique: {
      countryOrZone: 'Msumbiji',
      climateSignal2027: 'Tofauti kubwa: ukame Kusini/Kati dhidi ya mafuriko & vimbunga Kaskazini',
      transmissionChannel: 'Hasara ya mazao bonde la Limpopo na uharibifu wa bandari na reli',
    },
    tanzanie: {
      countryOrZone: 'Tanzania',
      climateSignal2027: 'Mvua nyingi pwani na Ziwa Victoria (mafuriko) & ukavu wa kiasi Kati',
      transmissionChannel: 'Uharibifu wa barabara za vijijini na uhifadhi wa mazao baada ya kuvuna',
    },
    'angola-namibie-botswana': {
      countryOrZone: 'Angola, Namibia & Botswana',
      climateSignal2027: 'Ukame katika mabonde ya Cunene / Okavango & shinikizo la malisho',
      transmissionChannel: 'Vifo vya mifugo, uhaba wa maji mijini (Windhoek/Gaborone) & uagizaji nafaka',
    },
    kenya: {
      countryOrZone: 'Kenya',
      climateSignal2027: 'Mvua kubwa na mafuriko (IOD+ / El Niño) ukanda wa Bonde la Ufa & pwani',
      transmissionChannel: 'Kuharibika kwa barabara/madaraja, hasara za chai/mboga & kukatika kwa usafirishaji',
    },
    ethiopie: {
      countryOrZone: 'Ethiopia',
      climateSignal2027: 'Mafuriko katika bonde la Awash/Rift na upungufu wa mvua baadhi ya sehemu Kaskazini',
      transmissionChannel: 'Hasara za kahawa/nafaka, uharibifu wa barabara & misaada ya kibinadamu',
    },
    ouganda: {
      countryOrZone: 'Uganda',
      climateSignal2027: 'Mvua za ziada bonde la Ziwa Victoria & maporomoko ya ardhi',
      transmissionChannel: 'Kuathirika kwa kahawa/ndizi, uharibifu wa barabara & mafuriko kandokando ya ziwa',
    },
    'rwanda-burundi': {
      countryOrZone: 'Rwanda & Burundi',
      climateSignal2027: 'Mvua kali za milimani, mmomonyoko wa udongo & mafuriko mabondeni',
      transmissionChannel: 'Hasara ya maharage/mahindi na kuharibika kwa madaraja na mifumo ya maji',
    },
    'egypte-soudan': {
      countryOrZone: 'Misri & Sudan (COMESA Kaskazini)',
      climateSignal2027: 'Mawimbi ya joto Mto Nile & ongezeko la mahitaji ya maji ya umwagiliaji',
      transmissionChannel: 'Ongezeko la gharama za kuagiza ngano/mahindi & matumizi ya umeme kwa ubaridi',
    },
    'cote-ivoire-ghana': {
      countryOrZone: 'Ivory Coast & Ghana (Ghuba ya Guinea)',
      climateSignal2027: 'Upepo mkavu wa Harmattan & kuchelewa kwa monsuni ya 2027',
      transmissionChannel: 'Kupungua kwa kakao (bei za juu duniani) na upungufu wa umeme wa maji',
    },
    sahel: {
      countryOrZone: 'Ukanda wa Sahel (Mali, Niger, Burkina, Chad, Senegal)',
      climateSignal2027: 'Joto kali sana na ukame kwenye uwele na mtama',
      transmissionChannel: 'Upungufu wa malisho ya mifugo, migogoro ya malisho & upanuzi wa misaada ya chakula',
    },
    'afrique-centrale': {
      countryOrZone: 'Afrika ya Kati (DRC, Kameruni, Kongo, Gabon)',
      climateSignal2027: 'Mvua zisizotabirika bonde la Kongo & kushuka kwa maji ya mito',
      transmissionChannel: 'Kukwama kwa usafiri wa majini Kongo/Oubangui, muhogo/kakao & gharama za usafirishaji',
    },
    'afrique-du-nord': {
      countryOrZone: 'Afrika Kaskazini (Moroko, Algeria, Tunisia)',
      climateSignal2027: 'Mifumo ya ukame inayoendelea na upungufu wa mvua za baridi',
      transmissionChannel: 'Kupungua kwa ngano/shayiri & kuongezeka kwa ruzuku ya serikali ya kuagiza chakula',
    },
  },
};

export function getLocalizedContinentalProjections(lang: LanguageCode): ContinentalCountryLossProfile[] {
  if (lang === 'fr') return CONTINENTAL_COUNTRY_PROJECTIONS;
  const tr = CONTINENTAL_TRANSLATIONS[lang];
  return CONTINENTAL_COUNTRY_PROJECTIONS.map((c) => ({ ...c, ...(tr[c.id] ?? {}) }));
}
