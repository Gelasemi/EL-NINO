export type UnZoneId =
  | 'afrique'
  | 'asie'
  | 'europe'
  | 'amerique-latine-caraibes'
  | 'oceanie'
  | 'amerique-du-nord';

export type Continent7Id =
  | 'Afrique'
  | 'Asie'
  | 'Europe'
  | 'Amérique du Nord'
  | 'Amérique du Sud'
  | 'Océanie';

export type ClimateZoneId =
  | 'afrique-australe-madagascar'
  | 'afrique-est-corne'
  | 'afrique-ouest-sahel'
  | 'afrique-nord-centrale'
  | 'amerique-sud-pacifique'
  | 'amazonie-cone-sud'
  | 'amerique-du-nord'
  | 'caraibes'
  | 'asie-sud-est-oceanie'
  | 'asie-du-sud'
  | 'asie-est-centrale'
  | 'europe-moyen-orient';

export type ForecastYear = 2027 | 2028 | 2029 | 2030 | 2031 | 2032;

export type SpokenLangTag = 'en' | 'fr' | 'ar' | 'es' | 'pt' | 'zh' | 'hi' | 'ru' | 'sw' | 'other';

export interface WorldCountrySeed {
  iso2: string;
  nameFr: string;
  nameEn: string;
  unStatus: 'member' | 'observer';
  unZone: UnZoneId;
  continent7: Continent7Id;
  climateZone: ClimateZoneId;
  langs: SpokenLangTag[];
  langDisplay: string;
  popM: number;
  gdpB: number;
  tier: 'tropical-developing' | 'emerging' | 'advanced';
  ensoSens: number;
  hazard: 'drought' | 'flood' | 'heat' | 'mixed';
}

export interface UnCountVariant {
  count: string;
  labelFr: string;
  labelEn: string;
  detailFr: string;
  detailEn: string;
}

export const UN_COUNT_VARIANTS: UnCountVariant[] = [
  {
    count: '195',
    labelFr: 'Décompte officiel ONU (Référence)',
    labelEn: 'Official UN Reference Count',
    detailFr: '193 États membres de plein droit + 2 États observateurs non membres (Saint-Siège / Vatican et État de Palestine).',
    detailEn: '193 full UN Member States + 2 Non-Member Observer States (Holy See / Vatican and State of Palestine).',
  },
  {
    count: '197',
    labelFr: 'Critère élargi (MAE France / Agences ONU)',
    labelEn: 'Extended Diplomatic Count',
    detailFr: 'Ajoute les Îles Cook et Niue (États du Pacifique en libre association avec la Nouvelle-Zélande, membres UNESCO/OMS).',
    detailEn: 'Adds the Cook Islands and Niue (Pacific states in free association with New Zealand, recognized by UN agencies).',
  },
  {
    count: '206 – 211',
    labelFr: 'Fédérations sportives (CIO 206 · FIFA 211)',
    labelEn: 'Sports Federations (IOC 206 · FIFA 211)',
    detailFr: 'Inclut des territoires autonomes tels que Porto Rico, Hong Kong, Polynésie française, Macao ou Gibraltar.',
    detailEn: 'Includes autonomous territories such as Puerto Rico, Hong Kong, French Polynesia, Macao, or Gibraltar.',
  },
  {
    count: '7+',
    labelFr: 'États à reconnaissance limitée',
    labelEn: 'Limited-Recognition Territories',
    detailFr: 'Taïwan, Kosovo, Sahara occidental, Chypre du Nord, Abkhazie, Ossétie du Sud, Transnistrie (fonctionnement autonome hors ONU).',
    detailEn: 'Taiwan, Kosovo, Western Sahara, Northern Cyprus, Abkhazia, South Ossetia, Transnistria (non-UN autonomous entities).',
  },
];

export interface ContinentModelRow {
  model: '5' | '6' | '7';
  nameFr: string;
  nameEn: string;
  areaMKm2: number;
  popB: number;
  unStates: number;
  noteFr: string;
  noteEn: string;
}

export const CONTINENT_COMPARISON_6: ContinentModelRow[] = [
  {
    model: '6',
    nameFr: 'Asie',
    nameEn: 'Asia',
    areaMKm2: 44.5,
    popB: 4.8,
    unStates: 48,
    noteFr: 'Inclut les États du Moyen-Orient et le Caucase (47 membres + État de Palestine).',
    noteEn: 'Includes West Asia / Middle East and Caucasus (47 members + State of Palestine).',
  },
  {
    model: '6',
    nameFr: 'Amérique (Nord + Latine/Caraïbes)',
    nameEn: 'Americas (North + Latin/Caribbean)',
    areaMKm2: 42.5,
    popB: 1.04,
    unStates: 35,
    noteFr: 'Regroupée en 1 continent dans le modèle ONU/francophone ; scindée en 2 (Nord & Sud) dans le modèle anglophone à 7 continents.',
    noteEn: 'Single continent in UN/French model; split into North America (23 sovereign states) and South America (12) in the 7-continent model.',
  },
  {
    model: '6',
    nameFr: 'Afrique',
    nameEn: 'Africa',
    areaMKm2: 30.3,
    popB: 1.5,
    unStates: 54,
    noteFr: 'Continent comptant le plus d’États membres à l’ONU (54 pays) et la vulnérabilité alimentaire ENSO la plus aiguë.',
    noteEn: 'Continent with the highest UN country count (54 states) and acute ENSO agricultural/hydro vulnerability.',
  },
  {
    model: '6',
    nameFr: 'Antarctique',
    nameEn: 'Antarctica',
    areaMKm2: 14.0,
    popB: 0,
    unStates: 0,
    noteFr: 'Aucune population permanente (exclus du modèle olympique à 5 continents). Rôle clé sur l’albédo et l’océan Austral.',
    noteEn: 'No permanent population (excluded from the 5-continent Olympic model). Crucial driver of Southern Ocean heat uptake.',
  },
  {
    model: '6',
    nameFr: 'Europe',
    nameEn: 'Europe',
    areaMKm2: 10.2,
    popB: 0.74,
    unStates: 44,
    noteFr: '43 États membres + Saint-Siège (Vatican). Masse continentale unie à l’Asie (Eurasie géologique).',
    noteEn: '43 UN members + Holy See (Vatican). Forms geological Eurasia alongside Asia.',
  },
  {
    model: '6',
    nameFr: 'Océanie',
    nameEn: 'Oceania',
    areaMKm2: 8.5,
    popB: 0.045,
    unStates: 14,
    noteFr: '14 membres ONU (+ Îles Cook & Niue = 16). Inclut la plaque partiellement submergée de Zealandia (Nouvelle-Zélande).',
    noteEn: '14 UN members (+ Cook Islands & Niue = 16). Includes the largely submerged Zealandia continental crust.',
  },
];

export interface WorldLanguageStat {
  code: SpokenLangTag;
  nameFr: string;
  nameEn: string;
  nativeName: string;
  officialCountries: string;
  totalSpeakers: string;
  unOfficial: boolean;
  regions: string;
}

export const WORLD_LANGUAGES_STATS: WorldLanguageStat[] = [
  {
    code: 'en',
    nameFr: 'Anglais',
    nameEn: 'English',
    nativeName: 'English',
    officialCountries: '~58 pays',
    totalSpeakers: '~1,5 milliard',
    unOfficial: true,
    regions: 'Amérique du Nord, Océanie, Europe, Afrique australe/Est, Asie',
  },
  {
    code: 'zh',
    nameFr: 'Chinois mandarin',
    nameEn: 'Mandarin Chinese',
    nativeName: '中文 (普通话)',
    officialCountries: '3 territoires (Chine, Taïwan, Singapour)',
    totalSpeakers: '> 1,1 milliard',
    unOfficial: true,
    regions: 'Asie de l’Est et diaspora Asie du Sud-Est',
  },
  {
    code: 'hi',
    nameFr: 'Hindi',
    nameEn: 'Hindi',
    nativeName: 'हिन्दी',
    officialCountries: '2 pays (Inde, Fidji)',
    totalSpeakers: '> 600 millions',
    unOfficial: false,
    regions: 'Asie du Sud (Inde) et Fidji',
  },
  {
    code: 'es',
    nameFr: 'Espagnol',
    nameEn: 'Spanish',
    nativeName: 'Español',
    officialCountries: '20 pays',
    totalSpeakers: '~550 millions',
    unOfficial: true,
    regions: 'Amérique latine, Espagne, Guinée équatoriale',
  },
  {
    code: 'fr',
    nameFr: 'Français',
    nameEn: 'French',
    nativeName: 'Français',
    officialCountries: '29 pays',
    totalSpeakers: '> 300 millions',
    unOfficial: true,
    regions: 'Europe, Afrique francophone & Madagascar/COI, Canada, Caraïbes, Océanie',
  },
  {
    code: 'ar',
    nameFr: 'Arabe',
    nameEn: 'Arabic',
    nativeName: 'العربية',
    officialCountries: '25 à 27 pays',
    totalSpeakers: '~380 millions',
    unOfficial: true,
    regions: 'Moyen-Orient, Afrique du Nord, Corne de l’Afrique & Sahel',
  },
  {
    code: 'pt',
    nameFr: 'Portugais',
    nameEn: 'Portuguese',
    nativeName: 'Português',
    officialCountries: '9 pays',
    totalSpeakers: '~260 millions',
    unOfficial: false,
    regions: 'Brésil, Portugal, Afrique lusophone (Angola, Mozambique...), Timor oriental',
  },
  {
    code: 'ru',
    nameFr: 'Russe',
    nameEn: 'Russian',
    nativeName: 'Русский',
    officialCountries: '4 à 8 pays',
    totalSpeakers: '~255 millions',
    unOfficial: true,
    regions: 'Europe de l’Est, Asie centrale & Caucase',
  },
  {
    code: 'sw',
    nameFr: 'Kiswahili',
    nameEn: 'Kiswahili',
    nativeName: 'Kiswahili',
    officialCountries: '4+ pays (UA / EAC)',
    totalSpeakers: '~200 millions',
    unOfficial: false,
    regions: 'Afrique de l’Est & Grands Lacs (Kenya, Tanzanie, Ouganda, RDC, Comores)',
  },
];

export interface GlobalMacroBenchmark {
  reference: string;
  period: string;
  lossLabel: string;
  scopeFr: string;
  scopeEn: string;
}

export const GLOBAL_MACRO_BENCHMARKS: GlobalMacroBenchmark[] = [
  {
    reference: 'Université Dartmouth (Science)',
    period: '1982–1983',
    lossLabel: '4 100 Md USD',
    scopeFr: 'Pertes mondiales cumulées mesurées sur 5–14 ans post-El Niño.',
    scopeEn: 'Cumulative global income losses measured 5–14 years post-El Niño.',
  },
  {
    reference: 'Université Dartmouth (Science)',
    period: '1997–1998',
    lossLabel: '5 700 Md USD',
    scopeFr: 'Rupture de croissance persistante des pays tropicaux & côtiers.',
    scopeEn: 'Persistent growth drag across tropical and coastal economies.',
  },
  {
    reference: 'Oxford Economics (Scénario Extrême)',
    period: '2026–2031',
    lossLabel: '~4 000 Md USD',
    scopeFr: 'Érosion projetée du PIB mondial d’ici 2031 (>10 % PIB/hab. dans les tropiques vs ~3 % USA).',
    scopeEn: 'Projected global GDP drag by 2031 (>10% GDP/capita drop in tropics vs ~3% US).',
  },
  {
    reference: 'Amplification XXIe siècle (Nature / Dartmouth)',
    period: '2025–2100',
    lossLabel: "Jusqu'à 84 000 Md USD",
    scopeFr: 'Pertes cumulées mondiales en cas de réchauffement non atténué amplifiant les Super El Niño.',
    scopeEn: 'Cumulative 21st-century losses under unmitigated warming amplifying Super El Niño.',
  },
];

export interface ClimateZoneProfile {
  id: ClimateZoneId;
  nameFr: string;
  nameEn: string;
  weather2027Fr: string;
  weather2027En: string;
  agriEnergyFr: string;
  agriEnergyEn: string;
  healthDisplacementFr: string;
  healthDisplacementEn: string;
  /** Per-year impact multipliers anchored to 2027 shock (positive GDP shock = loss %) */
  yearlySignal: Record<ForecastYear, {
    regimeFr: string;
    regimeEn: string;
    gdpDragMultiplier: number;
    inflationAddPct: number;
    droughtIndex: number; // 0..100
    floodIndex: number; // 0..100
    displacementScore: number; // 0..100
  }>;
}

export const WORLD_CLIMATE_ZONES: ClimateZoneProfile[] = [
  {
    id: 'afrique-australe-madagascar',
    nameFr: 'Afrique australe & Madagascar',
    nameEn: 'Southern Africa & Madagascar',
    weather2027Fr: 'Blocage des pluies d’été australes, sécheresse sévère (Grand Sud, Zimbabwe, Zambie, Malawi) et vagues de chaleur.',
    weather2027En: 'Blocked austral summer rains, severe drought (Grand Sud Madagascar, Zimbabwe, Zambia, Malawi) & heatwaves.',
    agriEnergyFr: 'Chute >40–50 % du maïs pluvial, crise hydroélectrique (Kariba / RIA), flambée du maïs et du riz importé.',
    agriEnergyEn: '>40–50% rainfed maize decline, Kariba/RIA hydropower deficit, acute staple price inflation.',
    healthDisplacementFr: 'Famine locale (Kéré), 61 M+ exposés en SADC, migration rurale vers villes et épidémies hydriques.',
    healthDisplacementEn: 'Acute food insecurity, 61M+ exposed in SADC, rural-to-urban climate displacement.',
    yearlySignal: {
      2027: { regimeFr: 'Super El Niño + IOD+ · Sécheresse aiguë', regimeEn: 'Super El Niño + IOD+ · Acute drought', gdpDragMultiplier: 1.0, inflationAddPct: 8.4, droughtIndex: 92, floodIndex: 28, displacementScore: 88 },
      2028: { regimeFr: 'Transition La Niña · Soudure & cyclones côte Est', regimeEn: 'La Niña transition · Lean season & East cyclones', gdpDragMultiplier: 0.72, inflationAddPct: 5.8, droughtIndex: 56, floodIndex: 76, displacementScore: 79 },
      2029: { regimeFr: 'Neutre · Reconstitution lente cheptels & barrages', regimeEn: 'Neutral · Slow herd & reservoir recovery', gdpDragMultiplier: 0.45, inflationAddPct: 3.1, droughtIndex: 42, floodIndex: 40, displacementScore: 54 },
      2030: { regimeFr: 'Stress thermique +1,5 °C · Réamorçage sec Sud', regimeEn: '+1.5°C baseline heat · Southern dry re-emergence', gdpDragMultiplier: 0.68, inflationAddPct: 4.5, droughtIndex: 70, floodIndex: 35, displacementScore: 66 },
      2031: { regimeFr: 'Pic cumulatif PIB (Lag Oxford) · Pression dette/eau', regimeEn: 'Cumulative GDP lag peak · Debt & water stress', gdpDragMultiplier: 0.85, inflationAddPct: 5.2, droughtIndex: 78, floodIndex: 44, displacementScore: 74 },
      2032: { regimeFr: 'Bifurcation adaptation (PNA/SCV vs BAU)', regimeEn: 'Adaptation bifurcation (NAP/SCV vs BAU)', gdpDragMultiplier: 0.58, inflationAddPct: 3.4, droughtIndex: 62, floodIndex: 48, displacementScore: 60 },
    },
  },
  {
    id: 'afrique-est-corne',
    nameFr: 'Corne de l’Afrique & Afrique de l’Est',
    nameEn: 'Horn & East Africa',
    weather2027Fr: 'Réchauffement IOD+ générant pluies diluviennes (oct.–déc.) au Kenya, Somalie, Éthiopie, Tanzanie et Ouganda.',
    weather2027En: 'Positive IOD triggering torrential Oct–Dec rains across Kenya, Somalia, Ethiopia, Tanzania & Uganda.',
    agriEnergyFr: 'Crues détruisant routes, ponts et périmètres ; pertes bétail par submersion mais hausse hydroélectricité.',
    agriEnergyEn: 'Flash floods damaging bridges and roads; livestock losses alongside higher hydropower inflows.',
    healthDisplacementFr: 'Inondation des camps de déplacés, flambée de choléra, paludisme et bilans humanitaires élevés.',
    healthDisplacementEn: 'Flooded displacement camps, cholera/malaria spikes, major humanitarian displacement.',
    yearlySignal: {
      2027: { regimeFr: 'IOD+ extrême · Crues diluviennes & choléra', regimeEn: 'Extreme IOD+ · Torrential floods & cholera', gdpDragMultiplier: 0.92, inflationAddPct: 7.2, droughtIndex: 25, floodIndex: 94, displacementScore: 86 },
      2028: { regimeFr: 'Rebond La Niña · Risque retour sécheresse Corne', regimeEn: 'La Niña shift · Returning Horn drought risk', gdpDragMultiplier: 0.84, inflationAddPct: 6.4, droughtIndex: 82, floodIndex: 32, displacementScore: 81 },
      2029: { regimeFr: 'ENSO Neutre · Reconstruction ponts & digues', regimeEn: 'ENSO Neutral · Bridge & embankment rebuild', gdpDragMultiplier: 0.50, inflationAddPct: 3.6, droughtIndex: 48, floodIndex: 42, displacementScore: 58 },
      2030: { regimeFr: 'Réchauffement océan Indien · Épisodes convectifs', regimeEn: 'Warm Indian Ocean · Intense convective storms', gdpDragMultiplier: 0.65, inflationAddPct: 4.8, droughtIndex: 45, floodIndex: 72, displacementScore: 67 },
      2031: { regimeFr: 'Érosion cumulée infrastructures & santé hydrique', regimeEn: 'Cumulative infra erosion & waterborne burden', gdpDragMultiplier: 0.78, inflationAddPct: 5.1, droughtIndex: 55, floodIndex: 76, displacementScore: 72 },
      2032: { regimeFr: 'Stabilisation conditionnelle (réseaux alerte précoce)', regimeEn: 'Conditional stabilization (early warning grids)', gdpDragMultiplier: 0.56, inflationAddPct: 3.5, droughtIndex: 46, floodIndex: 58, displacementScore: 59 },
    },
  },
  {
    id: 'afrique-ouest-sahel',
    nameFr: 'Sahel & Afrique de l’Ouest',
    nameEn: 'Sahel & West Africa',
    weather2027Fr: 'Mousson irrégulière, vagues de chaleur extrêmes (>45 °C) et décalage de la ceinture pluviométrique.',
    weather2027En: 'Erratic West African monsoon, extreme heatwaves (>45°C), and northward rain belt instability.',
    agriEnergyFr: 'Tension sur mil, sorgho, maïs et cacao (Côte d’Ivoire/Ghana), pression importations de riz.',
    agriEnergyEn: 'Stress on millet, sorghum, maize & cocoa (Côte d’Ivoire/Ghana); high rice import bill.',
    healthDisplacementFr: 'Tensions éleveurs-agriculteurs, stress thermique travailleurs et migration vers les littoraux.',
    healthDisplacementEn: 'Herder-farmer resource friction, heat stress, and coastal urban migration.',
    yearlySignal: {
      2027: { regimeFr: 'Stress thermique & mousson irrégulière (Cacao/Riz)', regimeEn: 'Heat stress & erratic monsoon (Cocoa/Rice)', gdpDragMultiplier: 0.78, inflationAddPct: 6.9, droughtIndex: 76, floodIndex: 44, displacementScore: 73 },
      2028: { regimeFr: 'Crues fluviales La Niña (Niger/Sénégal) + repli prix', regimeEn: 'La Niña river floods (Niger/Senegal) + partial cooling', gdpDragMultiplier: 0.62, inflationAddPct: 4.9, droughtIndex: 40, floodIndex: 78, displacementScore: 68 },
      2029: { regimeFr: 'Phase Neutre · Reconstitution stocks céréaliers', regimeEn: 'Neutral phase · Cereal buffer rebuild', gdpDragMultiplier: 0.42, inflationAddPct: 3.0, droughtIndex: 46, floodIndex: 45, displacementScore: 52 },
      2030: { regimeFr: 'Chaleur sahélienne amplifiée · Pression pastorale', regimeEn: 'Amplified Sahel heat · Pastoral pressure', gdpDragMultiplier: 0.64, inflationAddPct: 4.4, droughtIndex: 72, floodIndex: 42, displacementScore: 66 },
      2031: { regimeFr: 'Traînée macroéconomique (dette & urbanisation)', regimeEn: 'Macroeconomic drag (debt & rapid urbanization)', gdpDragMultiplier: 0.74, inflationAddPct: 4.8, droughtIndex: 74, floodIndex: 50, displacementScore: 71 },
      2032: { regimeFr: 'Adaptation agro-climatique (Zaï/régénération)', regimeEn: 'Agro-climatic adaptation (Zaï/regeneration)', gdpDragMultiplier: 0.54, inflationAddPct: 3.2, droughtIndex: 60, floodIndex: 46, displacementScore: 57 },
    },
  },
  {
    id: 'afrique-nord-centrale',
    nameFr: 'Afrique du Nord & Centrale',
    nameEn: 'North & Central Africa',
    weather2027Fr: 'Sécheresse structurelle & chaleur au Maghreb/Nil ; pluies intenses sur le bassin du Congo.',
    weather2027En: 'Structural drought & heat in Maghreb/Nile; intense convective rains in the Congo Basin.',
    agriEnergyFr: 'Dépendance accrue aux importations de blé (Égypte, Maroc, Algérie) et pertes oléicoles/céréales.',
    agriEnergyEn: 'Higher wheat import bills (Egypt, Morocco, Algeria) and olive/cereal yield drops.',
    healthDisplacementFr: 'Stress hydrique urbain, pression budgétaire subventions alimentaires et crues fluviales en RDC.',
    healthDisplacementEn: 'Urban water stress, food subsidy fiscal strain, and Congo River flooding.',
    yearlySignal: {
      2027: { regimeFr: 'Stress blé/eau Maghreb · Crues bassin du Congo', regimeEn: 'Maghreb wheat/water stress · Congo basin floods', gdpDragMultiplier: 0.66, inflationAddPct: 5.5, droughtIndex: 74, floodIndex: 56, displacementScore: 62 },
      2028: { regimeFr: 'Allègement partiel pluies d’hiver · Inertie prix blé', regimeEn: 'Partial winter rain relief · Wheat price inertia', gdpDragMultiplier: 0.50, inflationAddPct: 4.0, droughtIndex: 58, floodIndex: 52, displacementScore: 55 },
      2029: { regimeFr: 'Neutre · Dessalement & stockage hydrique', regimeEn: 'Neutral · Desalination & water storage push', gdpDragMultiplier: 0.36, inflationAddPct: 2.5, droughtIndex: 52, floodIndex: 40, displacementScore: 44 },
      2030: { regimeFr: 'Canicules estivales Méditerranée + stress Nil', regimeEn: 'Mediterranean summer heatwaves + Nile stress', gdpDragMultiplier: 0.56, inflationAddPct: 3.8, droughtIndex: 70, floodIndex: 45, displacementScore: 56 },
      2031: { regimeFr: 'Impact cumulatif énergétique & déficit hydrique', regimeEn: 'Cumulative energy & water deficit drag', gdpDragMultiplier: 0.64, inflationAddPct: 4.2, droughtIndex: 75, floodIndex: 48, displacementScore: 61 },
      2032: { regimeFr: 'Transition solaire/irrigation efficiente', regimeEn: 'Solar & precision-irrigation transition', gdpDragMultiplier: 0.46, inflationAddPct: 2.9, droughtIndex: 63, floodIndex: 42, displacementScore: 49 },
    },
  },
  {
    id: 'amerique-sud-pacifique',
    nameFr: 'Amérique du Sud — Côte Pacifique (Pérou / Équateur / Colombie)',
    nameEn: 'South America — Pacific Coast',
    weather2027Fr: 'Eaux chaudes (+3,5 à +4,1 °C) bloquant l’upwelling froid : pluies diluviennes, huaicos et crues côtières.',
    weather2027En: 'Warm coastal SSTs (+3.5 to +4.1°C) shutting down cold upwelling: extreme rains, mudslides & floods.',
    agriEnergyFr: 'Effondrement de la pêche à l’anchois (farine de poisson), destruction routes/ports et cultures côtières.',
    agriEnergyEn: 'Collapse of anchovy fisheries (fishmeal), road/port damage, and coastal agricultural losses.',
    healthDisplacementFr: 'Épidémies de dengue et leptospirose, déplacements d’urgence des zones côtières inondées.',
    healthDisplacementEn: 'Dengue & leptospirosis outbreaks, emergency displacement across flooded coastal cities.',
    yearlySignal: {
      2027: { regimeFr: 'Choc El Niño costal · Déluges & effondrement pêche', regimeEn: 'Coastal El Niño shock · Deluges & fishery collapse', gdpDragMultiplier: 1.05, inflationAddPct: 7.8, droughtIndex: 18, floodIndex: 96, displacementScore: 84 },
      2028: { regimeFr: 'Retour upwelling froid (La Niña) · Reconstruction', regimeEn: 'Cold upwelling return (La Niña) · Infrastructure rebuild', gdpDragMultiplier: 0.60, inflationAddPct: 4.2, droughtIndex: 44, floodIndex: 46, displacementScore: 58 },
      2029: { regimeFr: 'Phase Neutre · Reprise halieutique progressive', regimeEn: 'Neutral phase · Gradual anchovy biomass recovery', gdpDragMultiplier: 0.35, inflationAddPct: 2.3, droughtIndex: 35, floodIndex: 38, displacementScore: 40 },
      2030: { regimeFr: 'Réchauffement Pacifique Est · Vigilance côtière', regimeEn: 'East Pacific warming · Renewed coastal watch', gdpDragMultiplier: 0.62, inflationAddPct: 3.9, droughtIndex: 28, floodIndex: 72, displacementScore: 59 },
      2031: { regimeFr: 'Pic cumulatif Oxford Economics (ports & pêche)', regimeEn: 'Cumulative Oxford Economics lag (ports & fisheries)', gdpDragMultiplier: 0.80, inflationAddPct: 4.6, droughtIndex: 32, floodIndex: 82, displacementScore: 68 },
      2032: { regimeFr: 'Résilience hydraulique & quotas adaptatifs', regimeEn: 'Drainage resilience & adaptive fishery quotas', gdpDragMultiplier: 0.52, inflationAddPct: 3.0, droughtIndex: 34, floodIndex: 60, displacementScore: 50 },
    },
  },
  {
    id: 'amazonie-cone-sud',
    nameFr: 'Amazonie, Amérique centrale & Cône Sud',
    nameEn: 'Amazon Basin, Central America & Southern Cone',
    weather2027Fr: 'Sécheresse sévère en Amazonie et au Corridor sec (Honduras, Guatemala, Nicaragua) ; crues en Argentine/Uruguay.',
    weather2027En: 'Severe Amazon & Central America Dry Corridor drought; excess rains across Argentina/Uruguay.',
    agriEnergyFr: 'Tension hydroélectrique (Brésil/Colombie), flambée café/sucre/soja, mégafeux amazoniens.',
    agriEnergyEn: 'Hydropower strain (Brazil/Colombia), coffee/sugar/soy price volatility, Amazon wildfires.',
    healthDisplacementFr: 'Fumées toxiques, perte récoltes maïs/haricots du Corridor sec alimentant la migration vers le Nord.',
    healthDisplacementEn: 'Wildfire haze & Dry Corridor maize/bean crop failure driving northward migration.',
    yearlySignal: {
      2027: { regimeFr: 'Sécheresse Amazonie & Corridor sec · Chocs café/soja', regimeEn: 'Amazon & Dry Corridor drought · Coffee/soy shock', gdpDragMultiplier: 0.82, inflationAddPct: 6.4, droughtIndex: 86, floodIndex: 52, displacementScore: 76 },
      2028: { regimeFr: 'Transition La Niña · Sécheresse Cône Sud / pluies Nord', regimeEn: 'La Niña shift · Southern Cone dryness / northern rains', gdpDragMultiplier: 0.64, inflationAddPct: 4.5, droughtIndex: 62, floodIndex: 64, displacementScore: 66 },
      2029: { regimeFr: 'Neutre · Récupération hydrique des bassins', regimeEn: 'Neutral · Basin hydrological recovery', gdpDragMultiplier: 0.40, inflationAddPct: 2.7, droughtIndex: 44, floodIndex: 42, displacementScore: 48 },
      2030: { regimeFr: 'Stress thermique forêts tropicales & Corridor sec', regimeEn: 'Tropical forest heat stress & Dry Corridor risk', gdpDragMultiplier: 0.66, inflationAddPct: 4.3, droughtIndex: 74, floodIndex: 48, displacementScore: 65 },
      2031: { regimeFr: 'Traînée cumulée PIB & pression migratoire', regimeEn: 'Cumulative GDP drag & migration pressure', gdpDragMultiplier: 0.78, inflationAddPct: 4.9, droughtIndex: 78, floodIndex: 54, displacementScore: 71 },
      2032: { regimeFr: 'Mix énergétique diversifié & corridor résilient', regimeEn: 'Diversified energy mix & corridor adaptation', gdpDragMultiplier: 0.50, inflationAddPct: 3.1, droughtIndex: 58, floodIndex: 48, displacementScore: 54 },
    },
  },
  {
    id: 'amerique-du-nord',
    nameFr: 'Amérique du Nord (Canada & États-Unis)',
    nameEn: 'North America (Canada & USA)',
    weather2027Fr: 'Hivers plus doux et secs au Nord (Canada, nord USA) ; tempêtes hivernales et pluies au Sud (Californie, Texas, Floride).',
    weather2027En: 'Milder/drier winters in North (Canada, northern US); heavy winter storms in South (California, Texas, Florida).',
    agriEnergyFr: 'Déficit d’enneigement printanier au Nord, pertes assurantielles tempêtes au Sud (~3 % choc PIB/hab. relatif).',
    agriEnergyEn: 'Reduced spring snowpack in the North; storm & flood insurance losses in the South (~3% relative GDP/cap drag).',
    healthDisplacementFr: 'Saison prolongée de feux de forêt au Canada/Ouest américain, pollution par fumées et surcoûts climatisation.',
    healthDisplacementEn: 'Extended wildfire seasons in Canada/US West, smoke air-quality events & power grid peaks.',
    yearlySignal: {
      2027: { regimeFr: 'Dipôle Nord doux-sec / Sud tempétueux', regimeEn: 'Warm-dry North / Stormy South dipole', gdpDragMultiplier: 0.46, inflationAddPct: 2.6, droughtIndex: 58, floodIndex: 66, displacementScore: 42 },
      2028: { regimeFr: 'La Niña · Ouragans Atlantique & sécheresse Sud-Ouest', regimeEn: 'La Niña · Active Atlantic hurricanes & SW drought', gdpDragMultiplier: 0.52, inflationAddPct: 2.8, droughtIndex: 64, floodIndex: 72, displacementScore: 48 },
      2029: { regimeFr: 'Neutre · Ajustement primes d’assurance & réseaux', regimeEn: 'Neutral · Insurance & grid resilience repricing', gdpDragMultiplier: 0.30, inflationAddPct: 1.6, droughtIndex: 45, floodIndex: 45, displacementScore: 34 },
      2030: { regimeFr: 'Vagues de chaleur d’été & fonte nivale précoce', regimeEn: 'Summer heat domes & early snowmelt', gdpDragMultiplier: 0.42, inflationAddPct: 2.2, droughtIndex: 60, floodIndex: 50, displacementScore: 40 },
      2031: { regimeFr: 'Érosion cumulée (~3 % PIB/hab. vs >10 % tropiques)', regimeEn: 'Cumulative drag (~3% GDP/capita vs >10% tropics)', gdpDragMultiplier: 0.48, inflationAddPct: 2.4, droughtIndex: 62, floodIndex: 58, displacementScore: 45 },
      2032: { regimeFr: 'Normalisation technologique & stockage réseau', regimeEn: 'Grid storage & weather-tech adaptation', gdpDragMultiplier: 0.34, inflationAddPct: 1.7, droughtIndex: 50, floodIndex: 48, displacementScore: 36 },
    },
  },
  {
    id: 'caraibes',
    nameFr: 'Caraïbes & Amérique insulaire',
    nameEn: 'Caribbean Basin',
    weather2027Fr: 'Chaleur marine record, stress hydrique estival puis bascule cyclonique intense dès la transition 2028.',
    weather2027En: 'Record sea-surface heat, summer water stress, shifting to intense hurricane exposure in 2028.',
    agriEnergyFr: 'Renchérissement des denrées importées, fragilité des réseaux électriques côtiers et tourisme.',
    agriEnergyEn: 'Higher food import prices, fragile coastal power grids, and coral/tourism disruption.',
    healthDisplacementFr: 'Prolifération dengue/chikungunya et évacuations côtières lors des épisodes cycloniques.',
    healthDisplacementEn: 'Dengue/vector proliferation and coastal hurricane evacuations.',
    yearlySignal: {
      2027: { regimeFr: 'Chaleur océanique & stress hydrique insulaire', regimeEn: 'Ocean heat & island water stress', gdpDragMultiplier: 0.74, inflationAddPct: 6.1, droughtIndex: 70, floodIndex: 54, displacementScore: 66 },
      2028: { regimeFr: 'Pic ouragans La Niña · Dégâts côtiers', regimeEn: 'La Niña hurricane peak · Coastal damage', gdpDragMultiplier: 0.96, inflationAddPct: 6.8, droughtIndex: 30, floodIndex: 92, displacementScore: 84 },
      2029: { regimeFr: 'Neutre · Reconstruction hôtelière & réseaux', regimeEn: 'Neutral · Tourism & grid rebuild', gdpDragMultiplier: 0.48, inflationAddPct: 3.1, droughtIndex: 40, floodIndex: 48, displacementScore: 52 },
      2030: { regimeFr: 'Chaleur corallienne & coûts assurantiels', regimeEn: 'Coral bleaching heat & high insurance cost', gdpDragMultiplier: 0.62, inflationAddPct: 4.0, droughtIndex: 55, floodIndex: 65, displacementScore: 62 },
      2031: { regimeFr: 'Vulnérabilité dette climatique cumulée', regimeEn: 'Cumulative climate debt vulnerability', gdpDragMultiplier: 0.76, inflationAddPct: 4.5, droughtIndex: 58, floodIndex: 74, displacementScore: 69 },
      2032: { regimeFr: 'Micro-réseaux résilients & fonds paramétriques', regimeEn: 'Resilient microgrids & parametric insurance', gdpDragMultiplier: 0.54, inflationAddPct: 3.2, droughtIndex: 48, floodIndex: 60, displacementScore: 55 },
    },
  },
  {
    id: 'asie-sud-est-oceanie',
    nameFr: 'Asie du Sud-Est & Océanie',
    nameEn: 'Southeast Asia & Oceania',
    weather2027Fr: 'Sécheresse marquée (Indonésie, Australie Est/Nord, Papouasie, Philippines), mégafeux et assèchement des tourbières.',
    weather2027En: 'Intense drought (Indonesia, E/N Australia, PNG, Philippines), peatland fires & bushfires.',
    agriEnergyFr: 'Tension mondiale sur riz, huile de palme, sucre et café ; élévation thermique des récifs.',
    agriEnergyEn: 'Global pressure on rice, palm oil, sugar & coffee; severe Great Barrier Reef heat.',
    healthDisplacementFr: 'Nuages de fumées toxiques transfrontaliers, évacuations feux de brousse et salinisation des atolls.',
    healthDisplacementEn: 'Transboundary haze health crises, bushfire evacuations, and atoll freshwater salinization.',
    yearlySignal: {
      2027: { regimeFr: 'Sécheresse & feux tourbières/brousse (Riz/Palme)', regimeEn: 'Drought & peat/bushfires (Rice/Palm oil)', gdpDragMultiplier: 0.88, inflationAddPct: 7.4, droughtIndex: 90, floodIndex: 32, displacementScore: 78 },
      2028: { regimeFr: 'Inversion La Niña · Crues moussons & cyclones', regimeEn: 'La Niña reversal · Monsoon floods & cyclones', gdpDragMultiplier: 0.72, inflationAddPct: 5.0, droughtIndex: 28, floodIndex: 88, displacementScore: 74 },
      2029: { regimeFr: 'Neutre · Reprise rendements riz & huile de palme', regimeEn: 'Neutral · Rice & palm oil yield recovery', gdpDragMultiplier: 0.38, inflationAddPct: 2.5, droughtIndex: 38, floodIndex: 46, displacementScore: 46 },
      2030: { regimeFr: 'Stress thermique maritime & îles Pacifique', regimeEn: 'Marine heat stress & Pacific atoll sea level', gdpDragMultiplier: 0.62, inflationAddPct: 4.1, droughtIndex: 68, floodIndex: 52, displacementScore: 63 },
      2031: { regimeFr: 'Effet cumulé Oxford Economics (exports/infra)', regimeEn: 'Cumulative Oxford Economics lag (exports/infra)', gdpDragMultiplier: 0.76, inflationAddPct: 4.6, droughtIndex: 72, floodIndex: 62, displacementScore: 69 },
      2032: { regimeFr: 'Protection tourbières & variétés riz tolérantes', regimeEn: 'Peatland protection & drought/flood rice', gdpDragMultiplier: 0.50, inflationAddPct: 2.9, droughtIndex: 54, floodIndex: 54, displacementScore: 54 },
    },
  },
  {
    id: 'asie-du-sud',
    nameFr: 'Asie du Sud (Inde, Pakistan, Bangladesh, Sri Lanka)',
    nameEn: 'South Asia',
    weather2027Fr: 'Mousson d’été affaiblie, déficits hydriques précoces et vagues de chaleur humide extrêmes (>47 °C).',
    weather2027En: 'Weakened summer monsoon, early water deficits, and lethal wet-bulb heatwaves (>47°C).',
    agriEnergyFr: 'Risque de restrictions d’exportation de riz indien affectant l’Afrique et Madagascar ; pics demande électrique.',
    agriEnergyEn: 'Risk of Indian rice export curbs impacting Africa/Madagascar; cooling power spikes.',
    healthDisplacementFr: 'Mortalité thermique élevée, baisse de productivité extérieure et migrations saisonnières.',
    healthDisplacementEn: 'High heat-related morbidity, outdoor labor productivity drops & seasonal displacement.',
    yearlySignal: {
      2027: { regimeFr: 'Mousson affaiblie · Risque curbs export riz', regimeEn: 'Weak monsoon · Rice export curb risk', gdpDragMultiplier: 0.86, inflationAddPct: 7.5, droughtIndex: 84, floodIndex: 48, displacementScore: 80 },
      2028: { regimeFr: 'Mousson La Niña hyper-active · Crues Indus/Gange', regimeEn: 'Hyper-active La Niña monsoon · Basin floods', gdpDragMultiplier: 0.74, inflationAddPct: 5.2, droughtIndex: 25, floodIndex: 90, displacementScore: 79 },
      2029: { regimeFr: 'Neutre · Reconstitution stocks publics céréaliers', regimeEn: 'Neutral · Public grain buffer replenishment', gdpDragMultiplier: 0.40, inflationAddPct: 2.8, droughtIndex: 42, floodIndex: 50, displacementScore: 50 },
      2030: { regimeFr: 'Canicules pré-mousson +1,5 °C · Stress blé', regimeEn: '+1.5°C pre-monsoon heatwaves · Wheat stress', gdpDragMultiplier: 0.68, inflationAddPct: 4.5, droughtIndex: 74, floodIndex: 54, displacementScore: 68 },
      2031: { regimeFr: 'Pertes productivité travail & eau souterraine', regimeEn: 'Labor productivity & groundwater depletion lag', gdpDragMultiplier: 0.80, inflationAddPct: 5.0, droughtIndex: 76, floodIndex: 62, displacementScore: 74 },
      2032: { regimeFr: 'Plans d’action chaleur & assurance agricole', regimeEn: 'Heat action plans & parametric crop cover', gdpDragMultiplier: 0.56, inflationAddPct: 3.3, droughtIndex: 60, floodIndex: 55, displacementScore: 58 },
    },
  },
  {
    id: 'asie-est-centrale',
    nameFr: 'Asie de l’Est & Asie centrale',
    nameEn: 'East & Central Asia',
    weather2027Fr: 'Contrastes Chine Sud inondée / Chine Nord & Asie centrale sèches ; records thermiques estivaux.',
    weather2027En: 'South China heavy rains vs North China & Central Asia dryness; summer temperature records.',
    agriEnergyFr: 'Tension sur le blé/maïs asiatique, fonte accélérée des glaciers du Pamir/Tian Shan affectant l’irrigation.',
    agriEnergyEn: 'Asian wheat/maize sensitivity; Pamir/Tian Shan glacier melt shifting river irrigation.',
    healthDisplacementFr: 'Inondations bassins du Yangtsé, tempêtes côtières et adaptation des chaînes logistiques.',
    healthDisplacementEn: 'Yangtze basin flood management, coastal typhoons, and supply-chain adaptation.',
    yearlySignal: {
      2027: { regimeFr: 'Contraste pluviométrique & chaleur estivale', regimeEn: 'North-South rain dipole & summer heat', gdpDragMultiplier: 0.54, inflationAddPct: 3.4, droughtIndex: 58, floodIndex: 72, displacementScore: 52 },
      2028: { regimeFr: 'Typhons La Niña · Pression littoraux industriels', regimeEn: 'La Niña typhoons · Coastal industrial exposure', gdpDragMultiplier: 0.58, inflationAddPct: 3.6, droughtIndex: 42, floodIndex: 80, displacementScore: 58 },
      2029: { regimeFr: 'Neutre · Renforcement digues & réseaux électriques', regimeEn: 'Neutral · Floodwall & grid reinforcement', gdpDragMultiplier: 0.34, inflationAddPct: 1.9, droughtIndex: 44, floodIndex: 48, displacementScore: 38 },
      2030: { regimeFr: 'Stress hydrique Asie centrale & chaleur Est', regimeEn: 'Central Asia water stress & East heatwaves', gdpDragMultiplier: 0.48, inflationAddPct: 2.8, droughtIndex: 62, floodIndex: 54, displacementScore: 49 },
      2031: { regimeFr: 'Érosion cumulée chaînes valeur & agriculture', regimeEn: 'Cumulative supply-chain & farm drag', gdpDragMultiplier: 0.56, inflationAddPct: 3.2, droughtIndex: 64, floodIndex: 60, displacementScore: 54 },
      2032: { regimeFr: 'Atténuation via IA climatique & barrages régulés', regimeEn: 'Climate-AI dispatch & regulated reservoirs', gdpDragMultiplier: 0.39, inflationAddPct: 2.1, droughtIndex: 52, floodIndex: 50, displacementScore: 42 },
    },
  },
  {
    id: 'europe-moyen-orient',
    nameFr: 'Europe & Moyen-Orient',
    nameEn: 'Europe & Middle East',
    weather2027Fr: 'Hivers plus froids/secs en Scandinavie, humides en péninsule Ibérique ; canicules estivales records & stress Moyen-Orient.',
    weather2027En: 'Colder/drier Northern Europe winters, wetter Iberia; record summer heat & acute Middle East water stress.',
    agriEnergyFr: 'Impact modéré direct en Europe, mais flambée des prix d’importation (cacao, café, riz) et stress céréales Golfe/Levant.',
    agriEnergyEn: 'Moderate direct Europe shock, high imported food inflation (cocoa/coffee/rice) & Levant/Gulf water stress.',
    healthDisplacementFr: 'Surmortalité caniculaire estivale (>50 °C au Golfe), basses eaux fluviales (Rhin/Danube) et stress hydrique.',
    healthDisplacementEn: 'Summer heat mortality (>50°C Gulf), low river navigation (Rhine/Danube), and water scarcity.',
    yearlySignal: {
      2027: { regimeFr: 'Téléconnexion indirecte · Canicules & prix import', regimeEn: 'Indirect teleconnection · Heatwaves & import inflation', gdpDragMultiplier: 0.42, inflationAddPct: 2.9, droughtIndex: 60, floodIndex: 52, displacementScore: 38 },
      2028: { regimeFr: 'Pluies atlantiques & réajustement chaînes mondiales', regimeEn: 'Atlantic rains & global trade rebalancing', gdpDragMultiplier: 0.36, inflationAddPct: 2.2, droughtIndex: 48, floodIndex: 58, displacementScore: 35 },
      2029: { regimeFr: 'Neutre · Adaptation réseaux ferrés & refroidissement', regimeEn: 'Neutral · Rail & urban cooling adaptation', gdpDragMultiplier: 0.26, inflationAddPct: 1.4, droughtIndex: 44, floodIndex: 42, displacementScore: 28 },
      2030: { regimeFr: 'Réchauffement méditerranéen & Golfe (+1,5 °C)', regimeEn: 'Mediterranean & Gulf warming (+1.5°C)', gdpDragMultiplier: 0.44, inflationAddPct: 2.6, droughtIndex: 68, floodIndex: 46, displacementScore: 42 },
      2031: { regimeFr: 'Effet cumulatif commerce mondial & chaleur', regimeEn: 'Cumulative global trade & heat drag', gdpDragMultiplier: 0.50, inflationAddPct: 2.8, droughtIndex: 70, floodIndex: 50, displacementScore: 46 },
      2032: { regimeFr: 'Neutralité hydrique & résilience agricole UE', regimeEn: 'Water efficiency & EU farm resilience', gdpDragMultiplier: 0.34, inflationAddPct: 1.8, droughtIndex: 56, floodIndex: 44, displacementScore: 34 },
    },
  },
];

// Compact country builder helper
function c(
  iso2: string,
  nameFr: string,
  nameEn: string,
  unZone: UnZoneId,
  continent7: Continent7Id,
  climateZone: ClimateZoneId,
  langs: SpokenLangTag[],
  langDisplay: string,
  popM: number,
  gdpB: number,
  tier: WorldCountrySeed['tier'],
  ensoSens: number,
  hazard: WorldCountrySeed['hazard'],
  unStatus: 'member' | 'observer' = 'member',
): WorldCountrySeed {
  return {
    iso2,
    nameFr,
    nameEn,
    unStatus,
    unZone,
    continent7,
    climateZone,
    langs,
    langDisplay,
    popM,
    gdpB,
    tier,
    ensoSens,
    hazard,
  };
}

/**
 * COMPLETE OFFICIAL UN 195 COUNTRIES LIST
 * Africa (54) + Asia (48) + Europe (44) + Latin America & Caribbean (33) + Oceania (14) + North America (2) = 195
 */
export const WORLD_195_COUNTRIES: WorldCountrySeed[] = [
  // ================= AFRIQUE (54) =================
  c('ZA', 'Afrique du Sud', 'South Africa', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais, Zoulou, Xhosa, Afrikaans', 64.0, 405, 'emerging', 1.15, 'drought'),
  c('DZ', 'Algérie', 'Algeria', 'afrique', 'Afrique', 'afrique-nord-centrale', ['ar', 'fr'], 'Arabe, Amazigh, Français', 46.8, 267, 'emerging', 0.85, 'drought'),
  c('AO', 'Angola', 'Angola', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['pt'], 'Portugais', 37.9, 92, 'tropical-developing', 1.25, 'drought'),
  c('BJ', 'Bénin', 'Benin', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français', 14.5, 21, 'tropical-developing', 0.95, 'mixed'),
  c('BW', 'Botswana', 'Botswana', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais, Setswana', 2.5, 21, 'emerging', 1.35, 'drought'),
  c('BF', 'Burkina Faso', 'Burkina Faso', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français, Mooré, Dioula', 23.5, 22, 'tropical-developing', 1.20, 'heat'),
  c('BI', 'Burundi', 'Burundi', 'afrique', 'Afrique', 'afrique-est-corne', ['fr', 'sw', 'en'], 'Kirundi, Français, Kiswahili, Anglais', 14.0, 4.2, 'tropical-developing', 1.25, 'flood'),
  c('CV', 'Cabo Verde', 'Cabo Verde', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['pt'], 'Portugais, Créole cap-verdien', 0.52, 2.7, 'tropical-developing', 1.05, 'drought'),
  c('CM', 'Cameroun', 'Cameroon', 'afrique', 'Afrique', 'afrique-nord-centrale', ['fr', 'en'], 'Français, Anglais', 29.1, 53, 'tropical-developing', 0.95, 'mixed'),
  c('KM', 'Comores', 'Comoros', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['fr', 'ar', 'sw'], 'Comorien, Français, Arabe', 0.87, 1.5, 'tropical-developing', 1.30, 'mixed'),
  c('CG', 'Congo (République du)', 'Republic of the Congo', 'afrique', 'Afrique', 'afrique-nord-centrale', ['fr'], 'Français', 6.3, 15.5, 'tropical-developing', 0.88, 'flood'),
  c('CI', 'Côte d’Ivoire', "Côte d'Ivoire", 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français', 31.9, 87, 'tropical-developing', 1.15, 'heat'),
  c('DJ', 'Djibouti', 'Djibouti', 'afrique', 'Afrique', 'afrique-est-corne', ['fr', 'ar'], 'Français, Arabe, Somali', 1.17, 4.3, 'tropical-developing', 1.30, 'mixed'),
  c('EG', 'Égypte', 'Egypt', 'afrique', 'Afrique', 'afrique-nord-centrale', ['ar'], 'Arabe', 116.5, 380, 'emerging', 0.95, 'heat'),
  c('ER', 'Érythrée', 'Eritrea', 'afrique', 'Afrique', 'afrique-est-corne', ['ar', 'en'], 'Tigrinya, Arabe, Anglais', 3.5, 2.6, 'tropical-developing', 1.22, 'mixed'),
  c('SZ', 'Eswatini', 'Eswatini', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais, Siswati', 1.24, 5.1, 'tropical-developing', 1.28, 'drought'),
  c('ET', 'Éthiopie', 'Ethiopia', 'afrique', 'Afrique', 'afrique-est-corne', ['en', 'ar'], 'Amharique, Oromo, Anglais', 132.0, 145, 'tropical-developing', 1.38, 'mixed'),
  c('GA', 'Gabon', 'Gabon', 'afrique', 'Afrique', 'afrique-nord-centrale', ['fr'], 'Français', 2.5, 21, 'emerging', 0.80, 'flood'),
  c('GM', 'Gambie', 'Gambia', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['en'], 'Anglais', 2.8, 2.6, 'tropical-developing', 1.05, 'mixed'),
  c('GH', 'Ghana', 'Ghana', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['en'], 'Anglais', 34.4, 76, 'tropical-developing', 1.18, 'heat'),
  c('GN', 'Guinée', 'Guinea', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français', 14.8, 25, 'tropical-developing', 1.02, 'mixed'),
  c('GW', 'Guinée-Bissau', 'Guinea-Bissau', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['pt'], 'Portugais', 2.2, 2.1, 'tropical-developing', 1.12, 'mixed'),
  c('GQ', 'Guinée équatoriale', 'Equatorial Guinea', 'afrique', 'Afrique', 'afrique-nord-centrale', ['es', 'fr', 'pt'], 'Espagnol, Français, Portugais', 1.9, 12.8, 'emerging', 0.82, 'flood'),
  c('KE', 'Kenya', 'Kenya', 'afrique', 'Afrique', 'afrique-est-corne', ['en', 'sw'], 'Kiswahili, Anglais', 56.4, 116, 'tropical-developing', 1.35, 'flood'),
  c('LS', 'Lesotho', 'Lesotho', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Sesotho, Anglais', 2.3, 2.3, 'tropical-developing', 1.32, 'drought'),
  c('LR', 'Liberia', 'Liberia', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['en'], 'Anglais', 5.6, 4.7, 'tropical-developing', 0.98, 'flood'),
  c('LY', 'Libye', 'Libya', 'afrique', 'Afrique', 'afrique-nord-centrale', ['ar'], 'Arabe', 7.4, 44, 'emerging', 0.85, 'heat'),
  c('MG', 'Madagascar', 'Madagascar', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['fr', 'en'], 'Malgache, Français', 31.9, 17.4, 'tropical-developing', 1.62, 'drought'),
  c('MW', 'Malawi', 'Malawi', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais, Chichewa', 21.6, 11.2, 'tropical-developing', 1.50, 'drought'),
  c('ML', 'Mali', 'Mali', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Bambara, Français', 24.5, 22, 'tropical-developing', 1.24, 'heat'),
  c('MA', 'Maroc', 'Morocco', 'afrique', 'Afrique', 'afrique-nord-centrale', ['ar', 'fr'], 'Arabe, Amazigh, Français', 38.1, 154, 'emerging', 0.92, 'drought'),
  c('MU', 'Maurice', 'Mauritius', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en', 'fr'], 'Anglais, Français, Créole', 1.27, 16.3, 'emerging', 1.05, 'mixed'),
  c('MR', 'Mauritanie', 'Mauritania', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['ar', 'fr'], 'Arabe, Français', 5.2, 10.7, 'tropical-developing', 1.18, 'heat'),
  c('MZ', 'Mozambique', 'Mozambique', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['pt'], 'Portugais', 34.6, 22.7, 'tropical-developing', 1.48, 'drought'),
  c('NA', 'Namibie', 'Namibia', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais', 3.0, 13.4, 'emerging', 1.38, 'drought'),
  c('NE', 'Niger', 'Niger', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français, Haoussa', 27.0, 19.5, 'tropical-developing', 1.28, 'heat'),
  c('NG', 'Nigeria', 'Nigeria', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['en'], 'Anglais, Haoussa, Yoruba, Igbo', 232.7, 252, 'tropical-developing', 1.12, 'mixed'),
  c('UG', 'Ouganda', 'Uganda', 'afrique', 'Afrique', 'afrique-est-corne', ['en', 'sw'], 'Anglais, Kiswahili', 50.0, 56, 'tropical-developing', 1.24, 'flood'),
  c('CF', 'République centrafricaine', 'Central African Republic', 'afrique', 'Afrique', 'afrique-nord-centrale', ['fr'], 'Français, Sango', 5.3, 2.8, 'tropical-developing', 1.05, 'mixed'),
  c('CD', 'République démocratique du Congo', 'DR Congo', 'afrique', 'Afrique', 'afrique-nord-centrale', ['fr', 'sw'], 'Français, Lingala, Kiswahili', 109.3, 73, 'tropical-developing', 1.08, 'flood'),
  c('RW', 'Rwanda', 'Rwanda', 'afrique', 'Afrique', 'afrique-est-corne', ['en', 'fr', 'sw'], 'Kinyarwanda, Anglais, Français, Kiswahili', 14.3, 14.5, 'tropical-developing', 1.18, 'flood'),
  c('ST', 'Sao Tomé-et-Principe', 'Sao Tome and Principe', 'afrique', 'Afrique', 'afrique-nord-centrale', ['pt'], 'Portugais', 0.24, 0.75, 'tropical-developing', 1.02, 'mixed'),
  c('SN', 'Sénégal', 'Senegal', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français, Wolof', 18.5, 34, 'tropical-developing', 1.08, 'heat'),
  c('SC', 'Seychelles', 'Seychelles', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en', 'fr'], 'Anglais, Français, Créole', 0.13, 2.2, 'emerging', 1.06, 'mixed'),
  c('SL', 'Sierra Leone', 'Sierra Leone', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['en'], 'Anglais, Krio', 8.6, 4.6, 'tropical-developing', 1.04, 'flood'),
  c('SO', 'Somalie', 'Somalia', 'afrique', 'Afrique', 'afrique-est-corne', ['ar'], 'Somali, Arabe', 19.0, 12.8, 'tropical-developing', 1.54, 'flood'),
  c('SD', 'Soudan', 'Sudan', 'afrique', 'Afrique', 'afrique-est-corne', ['ar', 'en'], 'Arabe, Anglais', 50.4, 29, 'tropical-developing', 1.32, 'mixed'),
  c('SS', 'Soudan du Sud', 'South Sudan', 'afrique', 'Afrique', 'afrique-est-corne', ['en', 'ar'], 'Anglais, Arabe', 11.9, 6.5, 'tropical-developing', 1.40, 'flood'),
  c('TZ', 'Tanzanie', 'Tanzania', 'afrique', 'Afrique', 'afrique-est-corne', ['sw', 'en'], 'Kiswahili, Anglais', 68.6, 84, 'tropical-developing', 1.30, 'flood'),
  c('TD', 'Tchad', 'Chad', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr', 'ar'], 'Français, Arabe', 20.3, 18.7, 'tropical-developing', 1.26, 'heat'),
  c('TG', 'Togo', 'Togo', 'afrique', 'Afrique', 'afrique-ouest-sahel', ['fr'], 'Français', 9.5, 9.8, 'tropical-developing', 0.96, 'mixed'),
  c('TN', 'Tunisie', 'Tunisia', 'afrique', 'Afrique', 'afrique-nord-centrale', ['ar', 'fr'], 'Arabe, Français', 12.3, 52, 'emerging', 0.88, 'drought'),
  c('ZM', 'Zambie', 'Zambia', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais', 21.3, 29.8, 'tropical-developing', 1.56, 'drought'),
  c('ZW', 'Zimbabwe', 'Zimbabwe', 'afrique', 'Afrique', 'afrique-australe-madagascar', ['en'], 'Anglais, Shona, Ndébélé', 16.6, 35.2, 'tropical-developing', 1.54, 'drought'),

  // ================= ASIE (48 : 47 membres + État de Palestine) =================
  c('AF', 'Afghanistan', 'Afghanistan', 'asie', 'Asie', 'asie-du-sud', ['other'], 'Pachto, Dari', 42.6, 17, 'tropical-developing', 1.15, 'drought'),
  c('SA', 'Arabie saoudite', 'Saudi Arabia', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 34.0, 1110, 'advanced', 0.65, 'heat'),
  c('AM', 'Arménie', 'Armenia', 'asie', 'Asie', 'europe-moyen-orient', ['ru'], 'Arménien, Russe', 2.97, 25.4, 'emerging', 0.62, 'heat'),
  c('AZ', 'Azerbaïdjan', 'Azerbaijan', 'asie', 'Asie', 'europe-moyen-orient', ['ru'], 'Azéri, Russe', 10.3, 76, 'emerging', 0.64, 'heat'),
  c('BH', 'Bahreïn', 'Bahrain', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 1.6, 47, 'advanced', 0.62, 'heat'),
  c('BD', 'Bangladesh', 'Bangladesh', 'asie', 'Asie', 'asie-du-sud', ['en'], 'Bengali, Anglais', 173.6, 455, 'tropical-developing', 1.32, 'mixed'),
  c('BT', 'Bhoutan', 'Bhutan', 'asie', 'Asie', 'asie-du-sud', ['en'], 'Dzongkha, Anglais', 0.79, 3.1, 'tropical-developing', 0.94, 'mixed'),
  c('MM', 'Birmanie (Myanmar)', 'Myanmar', 'asie', 'Asie', 'asie-sud-est-oceanie', ['other'], 'Birman', 54.5, 65, 'tropical-developing', 1.24, 'drought'),
  c('BN', 'Brunei', 'Brunei Darussalam', 'asie', 'Asie', 'asie-sud-est-oceanie', ['en'], 'Malais, Anglais', 0.46, 15.5, 'advanced', 0.76, 'drought'),
  c('KH', 'Cambodge', 'Cambodia', 'asie', 'Asie', 'asie-sud-est-oceanie', ['fr'], 'Khmer', 17.6, 46, 'tropical-developing', 1.26, 'drought'),
  c('CN', 'Chine', 'China', 'asie', 'Asie', 'asie-est-centrale', ['zh'], 'Chinois mandarin', 1419.0, 18530, 'emerging', 0.78, 'mixed'),
  c('CY', 'Chypre', 'Cyprus', 'asie', 'Asie', 'europe-moyen-orient', ['en'], 'Grec, Turc, Anglais', 1.35, 34.7, 'advanced', 0.56, 'heat'),
  c('KP', 'Corée du Nord', 'North Korea', 'asie', 'Asie', 'asie-est-centrale', ['other'], 'Coréen', 26.5, 28, 'tropical-developing', 1.02, 'mixed'),
  c('KR', 'Corée du Sud', 'South Korea', 'asie', 'Asie', 'asie-est-centrale', ['other'], 'Coréen', 51.7, 1870, 'advanced', 0.52, 'mixed'),
  c('AE', 'Émirats arabes unis', 'United Arab Emirates', 'asie', 'Asie', 'europe-moyen-orient', ['ar', 'en'], 'Arabe, Anglais', 11.0, 537, 'advanced', 0.58, 'heat'),
  c('PS', 'État de Palestine', 'State of Palestine', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 5.5, 17, 'tropical-developing', 0.92, 'heat', 'observer'),
  c('GE', 'Géorgie', 'Georgia', 'asie', 'Asie', 'europe-moyen-orient', ['ru'], 'Géorgien', 3.8, 33, 'emerging', 0.60, 'mixed'),
  c('IN', 'Inde', 'India', 'asie', 'Asie', 'asie-du-sud', ['hi', 'en'], 'Hindi, Anglais, 22 langues', 1450.9, 3937, 'emerging', 1.22, 'drought'),
  c('ID', 'Indonésie', 'Indonesia', 'asie', 'Asie', 'asie-sud-est-oceanie', ['other'], 'Indonésien (Bahasa)', 283.5, 1475, 'emerging', 1.38, 'drought'),
  c('IQ', 'Irak', 'Iraq', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe, Kurde', 46.0, 264, 'emerging', 0.95, 'heat'),
  c('IR', 'Iran', 'Iran', 'asie', 'Asie', 'europe-moyen-orient', ['other'], 'Persan', 91.6, 434, 'emerging', 0.88, 'drought'),
  c('IL', 'Israël', 'Israel', 'asie', 'Asie', 'europe-moyen-orient', ['ar', 'en'], 'Hébreu, Arabe', 9.4, 550, 'advanced', 0.55, 'heat'),
  c('JP', 'Japon', 'Japan', 'asie', 'Asie', 'asie-est-centrale', ['other'], 'Japonais', 123.7, 4110, 'advanced', 0.54, 'heat'),
  c('JO', 'Jordanie', 'Jordan', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 11.5, 53, 'emerging', 0.82, 'drought'),
  c('KZ', 'Kazakhstan', 'Kazakhstan', 'asie', 'Asie', 'asie-est-centrale', ['ru'], 'Kazakh, Russe', 20.6, 296, 'emerging', 0.72, 'drought'),
  c('KG', 'Kirghizistan', 'Kyrgyzstan', 'asie', 'Asie', 'asie-est-centrale', ['ru'], 'Kirghiz, Russe', 7.2, 15.8, 'tropical-developing', 0.85, 'drought'),
  c('KW', 'Koweït', 'Kuwait', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 4.9, 161, 'advanced', 0.64, 'heat'),
  c('LA', 'Laos', 'Lao PDR', 'asie', 'Asie', 'asie-sud-est-oceanie', ['fr'], 'Lao', 7.8, 15.1, 'tropical-developing', 1.20, 'drought'),
  c('LB', 'Liban', 'Lebanon', 'asie', 'Asie', 'europe-moyen-orient', ['ar', 'fr'], 'Arabe, Français', 5.8, 21, 'emerging', 0.84, 'heat'),
  c('MY', 'Malaisie', 'Malaysia', 'asie', 'Asie', 'asie-sud-est-oceanie', ['en'], 'Malais, Anglais, Mandarin', 35.6, 445, 'emerging', 1.18, 'drought'),
  c('MV', 'Maldives', 'Maldives', 'asie', 'Asie', 'asie-du-sud', ['en'], 'Dhivehi, Anglais', 0.53, 7.1, 'emerging', 1.14, 'heat'),
  c('MN', 'Mongolie', 'Mongolia', 'asie', 'Asie', 'asie-est-centrale', ['other'], 'Mongol', 3.5, 22, 'emerging', 0.88, 'drought'),
  c('NP', 'Népal', 'Nepal', 'asie', 'Asie', 'asie-du-sud', ['other'], 'Népalais', 29.6, 44, 'tropical-developing', 1.18, 'drought'),
  c('OM', 'Oman', 'Oman', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 5.3, 114, 'advanced', 0.68, 'heat'),
  c('UZ', 'Ouzbékistan', 'Uzbekistan', 'asie', 'Asie', 'asie-est-centrale', ['ru'], 'Ouzbek, Russe', 36.4, 112, 'tropical-developing', 0.86, 'drought'),
  c('PK', 'Pakistan', 'Pakistan', 'asie', 'Asie', 'asie-du-sud', ['en'], 'Ourdou, Anglais', 251.3, 374, 'tropical-developing', 1.34, 'mixed'),
  c('PH', 'Philippines', 'Philippines', 'asie', 'Asie', 'asie-sud-est-oceanie', ['en'], 'Filipino, Anglais', 115.8, 471, 'emerging', 1.36, 'drought'),
  c('QA', 'Qatar', 'Qatar', 'asie', 'Asie', 'europe-moyen-orient', ['ar', 'en'], 'Arabe, Anglais', 3.0, 221, 'advanced', 0.60, 'heat'),
  c('SG', 'Singapour', 'Singapore', 'asie', 'Asie', 'asie-sud-est-oceanie', ['en', 'zh'], 'Anglais, Mandarin, Malais, Tamoul', 5.8, 530, 'advanced', 0.64, 'heat'),
  c('LK', 'Sri Lanka', 'Sri Lanka', 'asie', 'Asie', 'asie-du-sud', ['en'], 'Cingalais, Tamoul, Anglais', 22.0, 84, 'emerging', 1.20, 'mixed'),
  c('SY', 'Syrie', 'Syria', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 24.7, 20, 'tropical-developing', 0.98, 'drought'),
  c('TJ', 'Tadjikistan', 'Tajikistan', 'asie', 'Asie', 'asie-est-centrale', ['ru'], 'Tadjik, Russe', 10.6, 13, 'tropical-developing', 0.88, 'drought'),
  c('TH', 'Thaïlande', 'Thailand', 'asie', 'Asie', 'asie-sud-est-oceanie', ['other'], 'Thaï', 71.7, 528, 'emerging', 1.28, 'drought'),
  c('TL', 'Timor oriental', 'Timor-Leste', 'asie', 'Asie', 'asie-sud-est-oceanie', ['pt'], 'Tétoum, Portugais', 1.4, 2.0, 'tropical-developing', 1.32, 'drought'),
  c('TM', 'Turkménistan', 'Turkmenistan', 'asie', 'Asie', 'asie-est-centrale', ['ru'], 'Turkmène, Russe', 7.5, 81, 'emerging', 0.78, 'drought'),
  c('TR', 'Turquie', 'Türkiye', 'asie', 'Asie', 'europe-moyen-orient', ['other'], 'Turc', 87.5, 1340, 'emerging', 0.72, 'heat'),
  c('VN', 'Viêt Nam', 'Viet Nam', 'asie', 'Asie', 'asie-sud-est-oceanie', ['other'], 'Vietnamien', 100.9, 468, 'emerging', 1.26, 'drought'),
  c('YE', 'Yémen', 'Yemen', 'asie', 'Asie', 'europe-moyen-orient', ['ar'], 'Arabe', 40.6, 18, 'tropical-developing', 1.24, 'mixed'),

  // ================= EUROPE (44 : 43 membres + Saint-Siège / Vatican) =================
  c('AL', 'Albanie', 'Albania', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Albanais', 2.8, 25, 'emerging', 0.56, 'heat'),
  c('DE', 'Allemagne', 'Germany', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Allemand', 84.5, 4590, 'advanced', 0.44, 'mixed'),
  c('AD', 'Andorre', 'Andorra', 'europe', 'Europe', 'europe-moyen-orient', ['fr', 'es'], 'Catalan, Espagnol, Français', 0.08, 3.9, 'advanced', 0.42, 'heat'),
  c('AT', 'Autriche', 'Austria', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Allemand', 9.1, 535, 'advanced', 0.44, 'heat'),
  c('BE', 'Belgique', 'Belgium', 'europe', 'Europe', 'europe-moyen-orient', ['fr'], 'Néerlandais, Français, Allemand', 11.7, 655, 'advanced', 0.45, 'mixed'),
  c('BY', 'Biélorussie', 'Belarus', 'europe', 'Europe', 'europe-moyen-orient', ['ru'], 'Biélorusse, Russe', 9.1, 73, 'emerging', 0.52, 'mixed'),
  c('BA', 'Bosnie-Herzégovine', 'Bosnia and Herzegovina', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Bosnien, Croate, Serbe', 3.16, 28, 'emerging', 0.56, 'heat'),
  c('BG', 'Bulgarie', 'Bulgaria', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Bulgare', 6.76, 107, 'emerging', 0.58, 'heat'),
  c('HR', 'Croatie', 'Croatia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Croate', 3.87, 89, 'advanced', 0.52, 'heat'),
  c('DK', 'Danemark', 'Denmark', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Danois', 5.98, 412, 'advanced', 0.40, 'mixed'),
  c('ES', 'Espagne', 'Spain', 'europe', 'Europe', 'europe-moyen-orient', ['es'], 'Espagnol', 47.9, 1730, 'advanced', 0.64, 'mixed'),
  c('EE', 'Estonie', 'Estonia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Estonien', 1.36, 43, 'advanced', 0.42, 'mixed'),
  c('FI', 'Finlande', 'Finland', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Finnois, Suédois', 5.62, 306, 'advanced', 0.40, 'mixed'),
  c('FR', 'France', 'France', 'europe', 'Europe', 'europe-moyen-orient', ['fr'], 'Français', 66.5, 3170, 'advanced', 0.48, 'heat'),
  c('GR', 'Grèce', 'Greece', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Grec', 10.0, 252, 'advanced', 0.62, 'heat'),
  c('HU', 'Hongrie', 'Hungary', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Hongrois', 9.6, 228, 'advanced', 0.54, 'drought'),
  c('IE', 'Irlande', 'Ireland', 'europe', 'Europe', 'europe-moyen-orient', ['en'], 'Anglais, Irlandais', 5.25, 560, 'advanced', 0.38, 'flood'),
  c('IS', 'Islande', 'Iceland', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Islandais', 0.39, 33, 'advanced', 0.36, 'mixed'),
  c('IT', 'Italie', 'Italy', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Italien', 59.3, 2370, 'advanced', 0.58, 'heat'),
  c('LV', 'Lettonie', 'Latvia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Letton', 1.87, 45, 'advanced', 0.44, 'mixed'),
  c('LI', 'Liechtenstein', 'Liechtenstein', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Allemand', 0.04, 8.2, 'advanced', 0.38, 'heat'),
  c('LT', 'Lituanie', 'Lithuania', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Lituanien', 2.86, 82, 'advanced', 0.44, 'mixed'),
  c('LU', 'Luxembourg', 'Luxembourg', 'europe', 'Europe', 'europe-moyen-orient', ['fr'], 'Luxembourgeois, Français, Allemand', 0.67, 91, 'advanced', 0.40, 'mixed'),
  c('MK', 'Macédoine du Nord', 'North Macedonia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Macédonien', 1.82, 16, 'emerging', 0.56, 'heat'),
  c('MT', 'Malte', 'Malta', 'europe', 'Europe', 'europe-moyen-orient', ['en'], 'Maltais, Anglais', 0.54, 24, 'advanced', 0.52, 'heat'),
  c('MD', 'Moldavie', 'Moldova', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Roumain', 3.03, 18, 'emerging', 0.60, 'drought'),
  c('MC', 'Monaco', 'Monaco', 'europe', 'Europe', 'europe-moyen-orient', ['fr'], 'Français', 0.04, 10, 'advanced', 0.42, 'heat'),
  c('ME', 'Monténégro', 'Montenegro', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Monténégrin', 0.64, 8, 'emerging', 0.54, 'heat'),
  c('NO', 'Norvège', 'Norway', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Norvégien', 5.57, 503, 'advanced', 0.38, 'mixed'),
  c('NL', 'Pays-Bas', 'Netherlands', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Néerlandais', 18.2, 1210, 'advanced', 0.44, 'flood'),
  c('PL', 'Pologne', 'Poland', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Polonais', 38.5, 860, 'advanced', 0.48, 'mixed'),
  c('PT', 'Portugal', 'Portugal', 'europe', 'Europe', 'europe-moyen-orient', ['pt'], 'Portugais', 10.4, 303, 'advanced', 0.62, 'mixed'),
  c('CZ', 'Tchéquie', 'Czechia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Tchèque', 10.7, 342, 'advanced', 0.46, 'heat'),
  c('RO', 'Roumanie', 'Romania', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Roumain', 19.0, 380, 'emerging', 0.56, 'drought'),
  c('GB', 'Royaume-Uni', 'United Kingdom', 'europe', 'Europe', 'europe-moyen-orient', ['en'], 'Anglais', 69.1, 3580, 'advanced', 0.42, 'flood'),
  c('RU', 'Russie', 'Russian Federation', 'europe', 'Europe', 'europe-moyen-orient', ['ru'], 'Russe', 144.8, 2180, 'emerging', 0.52, 'heat'),
  c('SM', 'Saint-Marin', 'San Marino', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Italien', 0.03, 2.0, 'advanced', 0.45, 'heat'),
  c('VA', 'Saint-Siège (Vatican)', 'Holy See (Vatican)', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Italien, Latin', 0.001, 0.1, 'advanced', 0.35, 'heat', 'observer'),
  c('RS', 'Serbie', 'Serbia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Serbe', 6.7, 82, 'emerging', 0.56, 'heat'),
  c('SK', 'Slovaquie', 'Slovakia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Slovaque', 5.5, 142, 'advanced', 0.46, 'heat'),
  c('SI', 'Slovénie', 'Slovenia', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Slovène', 2.1, 73, 'advanced', 0.46, 'mixed'),
  c('SE', 'Suède', 'Sweden', 'europe', 'Europe', 'europe-moyen-orient', ['other'], 'Suédois', 10.6, 610, 'advanced', 0.40, 'mixed'),
  c('CH', 'Suisse', 'Switzerland', 'europe', 'Europe', 'europe-moyen-orient', ['fr'], 'Allemand, Français, Italien', 8.9, 942, 'advanced', 0.40, 'heat'),
  c('UA', 'Ukraine', 'Ukraine', 'europe', 'Europe', 'europe-moyen-orient', ['ru'], 'Ukrainien', 37.9, 190, 'emerging', 0.60, 'drought'),

  // ================= AMÉRIQUE LATINE ET CARAÏBES (33) =================
  c('AG', 'Antigua-et-Barbuda', 'Antigua and Barbuda', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.09, 2.1, 'emerging', 1.10, 'mixed'),
  c('AR', 'Argentine', 'Argentina', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol', 45.7, 604, 'emerging', 0.96, 'flood'),
  c('BS', 'Bahamas', 'Bahamas', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.40, 14.8, 'advanced', 0.95, 'mixed'),
  c('BB', 'Barbade', 'Barbados', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.28, 6.8, 'emerging', 1.05, 'drought'),
  c('BZ', 'Belize', 'Belize', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['en', 'es'], 'Anglais, Espagnol', 0.42, 3.4, 'tropical-developing', 1.15, 'drought'),
  c('BO', 'Bolivie', 'Bolivia', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol, Quechua, Aymara', 12.4, 48, 'tropical-developing', 1.24, 'drought'),
  c('BR', 'Brésil', 'Brazil', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['pt'], 'Portugais', 212.0, 2188, 'emerging', 1.04, 'drought'),
  c('CL', 'Chili', 'Chile', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol', 19.8, 330, 'emerging', 0.92, 'mixed'),
  c('CO', 'Colombie', 'Colombia', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol', 52.9, 417, 'emerging', 1.18, 'drought'),
  c('CR', 'Costa Rica', 'Costa Rica', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 5.1, 95, 'emerging', 1.12, 'drought'),
  c('CU', 'Cuba', 'Cuba', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['es'], 'Espagnol', 11.0, 107, 'emerging', 1.14, 'mixed'),
  c('DM', 'Dominique', 'Dominica', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en', 'fr'], 'Anglais, Créole français', 0.07, 0.7, 'tropical-developing', 1.16, 'mixed'),
  c('EC', 'Équateur', 'Ecuador', 'amerique-latine-caraibes', 'Amérique du Sud', 'amerique-sud-pacifique', ['es'], 'Espagnol', 18.1, 121, 'emerging', 1.54, 'flood'),
  c('GD', 'Grenade', 'Grenada', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.12, 1.4, 'emerging', 1.14, 'mixed'),
  c('GT', 'Guatemala', 'Guatemala', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 18.4, 112, 'tropical-developing', 1.38, 'drought'),
  c('GY', 'Guyana', 'Guyana', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['en'], 'Anglais', 0.83, 21, 'emerging', 1.05, 'drought'),
  c('HT', 'Haïti', 'Haiti', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['fr'], 'Créole haïtien, Français', 11.8, 24, 'tropical-developing', 1.42, 'drought'),
  c('HN', 'Honduras', 'Honduras', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 10.8, 36, 'tropical-developing', 1.44, 'drought'),
  c('JM', 'Jamaïque', 'Jamaica', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 2.84, 20, 'emerging', 1.18, 'drought'),
  c('MX', 'Mexique', 'Mexico', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 130.9, 1848, 'emerging', 0.96, 'drought'),
  c('NI', 'Nicaragua', 'Nicaragua', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 6.9, 18.8, 'tropical-developing', 1.42, 'drought'),
  c('PA', 'Panama', 'Panama', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 4.5, 87, 'emerging', 1.30, 'drought'),
  c('PY', 'Paraguay', 'Paraguay', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol, Guarani', 6.9, 44, 'tropical-developing', 1.12, 'flood'),
  c('PE', 'Pérou', 'Peru', 'amerique-latine-caraibes', 'Amérique du Sud', 'amerique-sud-pacifique', ['es'], 'Espagnol, Quechua', 34.2, 283, 'emerging', 1.58, 'flood'),
  c('DO', 'République dominicaine', 'Dominican Republic', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['es'], 'Espagnol', 11.4, 126, 'emerging', 1.18, 'drought'),
  c('KN', 'Saint-Christophe-et-Niévès', 'Saint Kitts and Nevis', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.05, 1.1, 'emerging', 1.08, 'mixed'),
  c('LC', 'Sainte-Lucie', 'Saint Lucia', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.18, 2.5, 'emerging', 1.12, 'mixed'),
  c('VC', 'Saint-Vincent-et-les-Grenadines', 'Saint Vincent & Grenadines', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 0.10, 1.1, 'emerging', 1.12, 'mixed'),
  c('SV', 'Salvador', 'El Salvador', 'amerique-latine-caraibes', 'Amérique du Nord', 'amazonie-cone-sud', ['es'], 'Espagnol', 6.3, 35, 'tropical-developing', 1.34, 'drought'),
  c('SR', 'Suriname', 'Suriname', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['other'], 'Néerlandais', 0.63, 4.3, 'emerging', 1.08, 'drought'),
  c('TT', 'Trinité-et-Tobago', 'Trinidad and Tobago', 'amerique-latine-caraibes', 'Amérique du Nord', 'caraibes', ['en'], 'Anglais', 1.51, 28, 'emerging', 0.94, 'heat'),
  c('UY', 'Uruguay', 'Uruguay', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol', 3.4, 82, 'advanced', 0.78, 'flood'),
  c('VE', 'Venezuela', 'Venezuela', 'amerique-latine-caraibes', 'Amérique du Sud', 'amazonie-cone-sud', ['es'], 'Espagnol', 28.4, 102, 'emerging', 1.14, 'drought'),

  // ================= OCÉANIE (14) =================
  c('AU', 'Australie', 'Australia', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Anglais', 26.7, 1790, 'advanced', 0.88, 'drought'),
  c('FJ', 'Fidji', 'Fiji', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en', 'hi'], 'Anglais, Fidjien, Hindi', 0.93, 5.8, 'emerging', 1.26, 'drought'),
  c('MH', 'Îles Marshall', 'Marshall Islands', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Marshallais, Anglais', 0.04, 0.3, 'tropical-developing', 1.30, 'drought'),
  c('SB', 'Îles Salomon', 'Solomon Islands', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Anglais, Pijin', 0.82, 1.7, 'tropical-developing', 1.32, 'drought'),
  c('KI', 'Kiribati', 'Kiribati', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Gilbertin, Anglais', 0.13, 0.3, 'tropical-developing', 1.38, 'mixed'),
  c('FM', 'Micronésie', 'Micronesia', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Anglais', 0.11, 0.48, 'tropical-developing', 1.28, 'drought'),
  c('NR', 'Nauru', 'Nauru', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Nauruan, Anglais', 0.01, 0.16, 'tropical-developing', 1.24, 'drought'),
  c('NZ', 'Nouvelle-Zélande', 'New Zealand', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Anglais, Maori', 5.2, 252, 'advanced', 0.62, 'drought'),
  c('PW', 'Palaos', 'Palau', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Palauan, Anglais', 0.02, 0.31, 'emerging', 1.18, 'drought'),
  c('PG', 'Papouasie-Nouvelle-Guinée', 'Papua New Guinea', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Anglais, Tok Pisin', 10.6, 32, 'tropical-developing', 1.44, 'drought'),
  c('WS', 'Samoa', 'Samoa', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Samoan, Anglais', 0.22, 1.0, 'tropical-developing', 1.22, 'drought'),
  c('TO', 'Tonga', 'Tonga', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Tonguien, Anglais', 0.10, 0.57, 'tropical-developing', 1.28, 'drought'),
  c('TV', 'Tuvalu', 'Tuvalu', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en'], 'Tuvaluan, Anglais', 0.01, 0.07, 'tropical-developing', 1.36, 'mixed'),
  c('VU', 'Vanuatu', 'Vanuatu', 'oceanie', 'Océanie', 'asie-sud-est-oceanie', ['en', 'fr'], 'Bichlamar, Anglais, Français', 0.33, 1.2, 'tropical-developing', 1.36, 'drought'),

  // ================= AMÉRIQUE DU NORD (2) =================
  c('CA', 'Canada', 'Canada', 'amerique-du-nord', 'Amérique du Nord', 'amerique-du-nord', ['en', 'fr'], 'Anglais, Français', 39.7, 2240, 'advanced', 0.56, 'heat'),
  c('US', 'États-Unis', 'United States', 'amerique-du-nord', 'Amérique du Nord', 'amerique-du-nord', ['en', 'es'], 'Anglais (et Espagnol)', 345.4, 29160, 'advanced', 0.60, 'mixed'),
];

export interface CountryYearProjection {
  year: ForecastYear;
  regimeFr: string;
  regimeEn: string;
  gdpDeltaPct: number; // negative means GDP contraction/drag
  lossBUsd: number;
  inflationAddPct: number;
  droughtIdx: number;
  floodIdx: number;
  displacementIdx: number;
  famineRisk: 'Critique' | 'Élevé' | 'Modéré' | 'Faible';
}

export interface DuplicatedWorldCountry extends WorldCountrySeed {
  climateZoneMeta: ClimateZoneProfile;
  projections: Record<ForecastYear, CountryYearProjection>;
  cumulativeLoss2027_2031BUsd: number;
}

const ZONE_MAP = new Map<ClimateZoneId, ClimateZoneProfile>(
  WORLD_CLIMATE_ZONES.map((z) => [z.id, z]),
);

const TIER_BASE_PCT: Record<WorldCountrySeed['tier'], number> = {
  'tropical-developing': -3.85,
  emerging: -2.05,
  advanced: -0.95,
};

function computeYearProjection(country: WorldCountrySeed, year: ForecastYear): CountryYearProjection {
  const zone = ZONE_MAP.get(country.climateZone)!;
  const sig = zone.yearlySignal[year];
  const basePct = TIER_BASE_PCT[country.tier];
  // Calibrated to Dartmouth/Oxford Economics (~10%+ cumulative GDP/capita drag in tropics vs ~3% in US/advanced over 5 yrs)
  const gdpDeltaPct = Number((basePct * country.ensoSens * sig.gdpDragMultiplier).toFixed(2));
  const lossBUsd = Number((country.gdpB * (Math.abs(gdpDeltaPct) / 100)).toFixed(3));
  const inflationAddPct = Number((sig.inflationAddPct * Math.min(1.35, 0.55 + country.ensoSens * 0.45)).toFixed(1));
  const droughtIdx = Math.min(99, Math.round(sig.droughtIndex * (0.72 + country.ensoSens * 0.24)));
  const floodIdx = Math.min(99, Math.round(sig.floodIndex * (0.72 + country.ensoSens * 0.24)));
  const displacementIdx = Math.min(
    99,
    Math.round(
      sig.displacementScore *
        (country.tier === 'tropical-developing' ? 1.05 : country.tier === 'emerging' ? 0.82 : 0.45),
    ),
  );
  const riskScore = (Math.abs(gdpDeltaPct) * 14) + (displacementIdx * 0.4) + (inflationAddPct * 2);
  const famineRisk: CountryYearProjection['famineRisk'] =
    country.tier === 'advanced'
      ? riskScore > 55
        ? 'Modéré'
        : 'Faible'
      : riskScore >= 82
        ? 'Critique'
        : riskScore >= 60
          ? 'Élevé'
          : riskScore >= 38
            ? 'Modéré'
            : 'Faible';

  return {
    year,
    regimeFr: sig.regimeFr,
    regimeEn: sig.regimeEn,
    gdpDeltaPct,
    lossBUsd,
    inflationAddPct,
    droughtIdx,
    floodIdx,
    displacementIdx,
    famineRisk,
  };
}

export const DUPLICATED_195_COUNTRIES: DuplicatedWorldCountry[] = WORLD_195_COUNTRIES.map((country) => {
  const climateZoneMeta = ZONE_MAP.get(country.climateZone)!;
  const projections: Record<ForecastYear, CountryYearProjection> = {
    2027: computeYearProjection(country, 2027),
    2028: computeYearProjection(country, 2028),
    2029: computeYearProjection(country, 2029),
    2030: computeYearProjection(country, 2030),
    2031: computeYearProjection(country, 2031),
    2032: computeYearProjection(country, 2032),
  };
  const cumulativeLoss2027_2031BUsd = Number(
    (
      projections[2027].lossBUsd +
      projections[2028].lossBUsd +
      projections[2029].lossBUsd +
      projections[2030].lossBUsd +
      projections[2031].lossBUsd
    ).toFixed(2),
  );
  return {
    ...country,
    climateZoneMeta,
    projections,
    cumulativeLoss2027_2031BUsd,
  };
});

export interface UnZoneSummary {
  id: UnZoneId;
  nameFr: string;
  nameEn: string;
  countryCount: number;
  popM: number;
  gdpB: number;
  yearlyLossBUsd: Record<ForecastYear, number>;
  avgInflationAdd: Record<ForecastYear, number>;
  cumulative2027_2031BUsd: number;
}

export const UN_ZONE_META: Record<UnZoneId, { nameFr: string; nameEn: string }> = {
  afrique: { nameFr: 'Afrique', nameEn: 'Africa' },
  asie: { nameFr: 'Asie', nameEn: 'Asia' },
  europe: { nameFr: 'Europe', nameEn: 'Europe' },
  'amerique-latine-caraibes': { nameFr: 'Amérique latine et Caraïbes', nameEn: 'Latin America & Caribbean' },
  oceanie: { nameFr: 'Océanie', nameEn: 'Oceania' },
  'amerique-du-nord': { nameFr: 'Amérique du Nord', nameEn: 'North America' },
};

const YEARS: ForecastYear[] = [2027, 2028, 2029, 2030, 2031, 2032];

export const UN_ZONE_SUMMARIES: UnZoneSummary[] = (Object.keys(UN_ZONE_META) as UnZoneId[]).map((zoneId) => {
  const rows = DUPLICATED_195_COUNTRIES.filter((r) => r.unZone === zoneId);
  const yearlyLossBUsd = {} as Record<ForecastYear, number>;
  const avgInflationAdd = {} as Record<ForecastYear, number>;

  YEARS.forEach((y) => {
    yearlyLossBUsd[y] = Number(rows.reduce((s, r) => s + r.projections[y].lossBUsd, 0).toFixed(1));
    avgInflationAdd[y] = Number(
      (rows.reduce((s, r) => s + r.projections[y].inflationAddPct, 0) / Math.max(1, rows.length)).toFixed(1),
    );
  });

  return {
    id: zoneId,
    nameFr: UN_ZONE_META[zoneId].nameFr,
    nameEn: UN_ZONE_META[zoneId].nameEn,
    countryCount: rows.length,
    popM: Number(rows.reduce((s, r) => s + r.popM, 0).toFixed(1)),
    gdpB: Number(rows.reduce((s, r) => s + r.gdpB, 0).toFixed(0)),
    yearlyLossBUsd,
    avgInflationAdd,
    cumulative2027_2031BUsd: Number(
      rows.reduce((s, r) => s + r.cumulativeLoss2027_2031BUsd, 0).toFixed(1),
    ),
  };
});

export function getClimateZoneSummaries() {
  return WORLD_CLIMATE_ZONES.map((z) => {
    const rows = DUPLICATED_195_COUNTRIES.filter((r) => r.climateZone === z.id);
    const yearlyLossBUsd = {} as Record<ForecastYear, number>;
    YEARS.forEach((y) => {
      yearlyLossBUsd[y] = Number(rows.reduce((s, r) => s + r.projections[y].lossBUsd, 0).toFixed(1));
    });
    return {
      zone: z,
      countryCount: rows.length,
      popM: Number(rows.reduce((s, r) => s + r.popM, 0).toFixed(1)),
      gdpB: Number(rows.reduce((s, r) => s + r.gdpB, 0).toFixed(0)),
      yearlyLossBUsd,
      cumulative2027_2031BUsd: Number(
        rows.reduce((s, r) => s + r.cumulativeLoss2027_2031BUsd, 0).toFixed(1),
      ),
    };
  });
}

export function getGlobalTimelineSeries() {
  return YEARS.map((y) => {
    const row: Record<string, string | number> = {
      year: String(y),
    };
    let globalTotal = 0;
    UN_ZONE_SUMMARIES.forEach((z) => {
      row[z.id] = z.yearlyLossBUsd[y];
      globalTotal += z.yearlyLossBUsd[y];
    });
    row.globalTotal = Number(globalTotal.toFixed(1));
    return row;
  });
}
