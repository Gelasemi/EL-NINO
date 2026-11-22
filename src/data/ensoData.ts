export interface HeroMetric {
  id: string;
  label: string;
  value: string;
  unit: string;
  context: string;
  tone: 'amber' | 'cobalt' | 'crimson' | 'neutral';
}

export interface MechanismStep {
  index: string;
  title: string;
  elNinoDetail: string;
  laNinaDetail: string;
}

export interface EnsoComparisonRow {
  criterion: string;
  elNino: string;
  laNina: string;
}

export interface GlobalRegionEffect {
  region: string;
  effects: string;
  dominantRisk: 'Inondations' | 'Sécheresse' | 'Contraste thermique';
}

export interface MadagascarProvinceZone {
  id: 'toliara' | 'fianarantsoa' | 'centre-est' | 'mahajanga' | 'antsiranana';
  exProvince: string;
  zoneLabel: string;
  regions: string[];
  riskSummary: string;
  severityLevel: 'Critique' | 'Élevé' | 'Vigilance';
  rainfallAnomaly: string;
  tempAnomaly: string;
  measures: string[];
  keyPrograms: string;
}

export interface AfricaBlocImpact {
  id: string;
  category: 'sadc' | 'comesa' | 'sahel' | 'nord-centrale';
  regionOrBloc: string;
  countries: string;
  climateSignal: string;
  economicAndFoodImpact: string;
  emergencyResponse: string;
  severityLabel: string;
}

export interface RicePricePoint {
  month: string;
  priceMGA: number;
  note?: string;
}

export interface CommodityImpact {
  commodity: string;
  region: string;
  mechanism: string;
  marketPressure: string;
}

export interface AgriculturalZoneTechnique {
  id: 'grand-sud' | 'hautes-terres' | 'nord-ouest';
  title: string;
  regions: string;
  sowingWindow: string;
  triggerRule: string;
  priorityCrops: string[];
  cropAssociation: string;
  waterAndSoilPractice: string;
  calendarBars: {
    crop: string;
    cycleDays: string;
    /** 0 = Oct, 1 = Nov, 2 = Déc, 3 = Jan, 4 = Fév, 5 = Mar */
    startMonthIdx: number;
    endMonthIdx: number;
    note: string;
  }[];
}

export interface CooperativeAgency {
  name: string;
  type: 'Guichet national' | 'Agence ONU' | 'Appui technique';
  role: string;
  address: string;
  contact: string;
  eligibilityOrAction: string;
}

export interface ReferenceSource {
  label: string;
  publisher: string;
  url: string;
}

export const HERO_METRICS: HeroMetric[] = [
  {
    id: 'sst-current',
    label: 'Anomalie Pacifique central',
    value: '+3,5',
    unit: '°C (Nov. 2026)',
    context: 'Écart thermique actuel mesuré dans le Pacifique équatorial',
    tone: 'amber',
  },
  {
    id: 'sst-peak',
    label: 'Pic record projeté',
    value: '+4,1',
    unit: '°C (Janv. 2027)',
    context: 'Projection maximale de l’épisode super El Niño selon l’OMM',
    tone: 'crimson',
  },
  {
    id: 'madagascar-food',
    label: 'Insécurité alimentaire (Madagascar)',
    value: '3,72 M',
    unit: 'personnes',
    context: 'Population exposée d’octobre 2026 à février 2027 (FAO), pic critique en Androy',
    tone: 'crimson',
  },
  {
    id: 'rice-peak',
    label: 'Riz local Antananarivo',
    value: '3 200',
    unit: 'MGA / kg',
    context: 'Pic saisonnier estimé en janvier–février 2027 (FEWS NET)',
    tone: 'cobalt',
  },
];

export const MECHANISM_STEPS: MechanismStep[] = [
  {
    index: '01',
    title: 'Dynamique des alizés',
    elNinoDetail:
      'En temps normal, les vents alizés poussent les eaux chaudes de surface vers l’ouest du Pacifique. Lors d’un épisode El Niño, ces vents faiblissent nettement ou s’inversent.',
    laNinaDetail:
      'Lors de La Niña, les alizés d’est vers l’ouest se renforcent puissamment, repoussant et accumulant encore davantage les eaux chaudes vers l’Indonésie et l’Australie.',
  },
  {
    index: '02',
    title: 'Bascule des masses d’eau et upwelling',
    elNinoDetail:
      'Sans poussée des vents, une immense masse d’eau chaude reflue vers les côtes d’Amérique du Sud et bloque la remontée d’eaux froides riches en nutriments au large du Pérou et de l’Équateur.',
    laNinaDetail:
      'Le refoulement vers l’ouest intensifie la remontée d’eaux froides profondes (upwelling) le long des côtes péruviennes et équatoriennes, abaissant la température de surface.',
  },
  {
    index: '03',
    title: 'Déplacement de la convection et des pluies',
    elNinoDetail:
      'L’évaporation intense au-dessus des eaux anormalement chaudes déplace les zones de nuages et d’orages vers le centre et l’est du Pacifique, inversant les régimes pluviométriques mondiaux.',
    laNinaDetail:
      'La convection orageuse se concentre à l’extrême ouest du Pacifique et sur l’Asie du Sud-Est, favorisant de fortes pluies en Afrique australe et à Madagascar tout en asséchant l’Afrique de l’Est.',
  },
];

export const ENSO_COMPARISON: EnsoComparisonRow[] = [
  {
    criterion: 'Température du Pacifique',
    elNino: 'Réchauffement anormal des eaux de surface du centre et de l’est (+3,5 °C à +4,1 °C en 2026–2027).',
    laNina: 'Refroidissement anormal des mêmes eaux de surface équatoriales.',
  },
  {
    criterion: 'Vents alizés',
    elNino: 'Affaiblissement ou inversion des vents d’est vers l’ouest.',
    laNina: 'Renforcement puissant des vents d’est vers l’ouest.',
  },
  {
    criterion: 'Température mondiale',
    elNino: 'Fait grimper temporairement la température moyenne de la planète (100 000+ décès thermiques tropicaux / an).',
    laNina: 'Tend à rafraîchir légèrement la moyenne thermique mondiale.',
  },
  {
    criterion: 'Afrique australe & Madagascar',
    elNino: 'Sécheresse dans le Sud, chaleur extrême (+2 à +4 °C), baisse globale du nombre de cyclones.',
    laNina: 'Pluies abondantes, risques d’inondations, saison cyclonique plus active.',
  },
  {
    criterion: 'Afrique de l’Est',
    elNino: 'Pluies diluviennes et inondations marquées entre octobre et décembre.',
    laNina: 'Sécheresses sévères et retards prolongés des pluies.',
  },
];

export const GLOBAL_REGIONAL_EFFECTS: GlobalRegionEffect[] = [
  {
    region: 'Amérique du Sud (Côte Ouest)',
    effects: 'Fortes pluies, inondations au Pérou et en Équateur, effondrement des prises de pêche suite au blocage de l’upwelling.',
    dominantRisk: 'Inondations',
  },
  {
    region: 'Océanie et Asie du Sud-Est',
    effects: 'Sécheresses sévères, vagues de chaleur, affaiblissement de la mousson et risques accrus d’incendies en Australie et en Indonésie.',
    dominantRisk: 'Sécheresse',
  },
  {
    region: 'Afrique australe et Madagascar',
    effects: 'Baisse marquée des précipitations et risques de sécheresse durant l’été austral (novembre à mars), couplée à un IOD positif.',
    dominantRisk: 'Sécheresse',
  },
  {
    region: 'Corne de l’Afrique',
    effects: 'Précipitations supérieures à la moyenne et risques d’inondations fluviales entre octobre et décembre.',
    dominantRisk: 'Inondations',
  },
  {
    region: 'Amérique du Nord',
    effects: 'Hivers plus doux dans le nord et pluies abondantes dans le sud des États-Unis et en Californie.',
    dominantRisk: 'Contraste thermique',
  },
];

export const MADAGASCAR_PROVINCES: MadagascarProvinceZone[] = [
  {
    id: 'toliara',
    exProvince: 'Ex-Province de Toliara',
    zoneLabel: 'Grand Sud et Sud-Ouest',
    regions: ['Androy', 'Anosy', 'Atsimo-Andrefana', 'Menabe'],
    riskSummary:
      'Sécheresse sévère, soudure précoce et effondrement des rendements de maïs. Situation nutritionnelle critique dans l’Androy.',
    severityLevel: 'Critique',
    rainfallAnomaly: 'Déficit pluviométrique marqué',
    tempAnomaly: '+2 à +4 °C au-dessus de la normale',
    measures: [
      'Distributions alimentaires d’urgence du PAM et transferts monétaires (Cash+)',
      'Distribution de semences de mil et sorgho résilientes à 32 000 producteurs',
      'Déploiement de cliniques mobiles contre la malnutrition infantile aiguë',
    ],
    keyPrograms: 'BNGRC · PAM · FAO · Projet DEFIS',
  },
  {
    id: 'fianarantsoa',
    exProvince: 'Ex-Province de Fianarantsoa',
    zoneLabel: 'Grand Sud-Est et Hautes Terres Sud',
    regions: ['Atsimo-Atsinanana', 'Fitovinany', 'Haute Matsiatra'],
    riskSummary:
      'Déficit hydrique cumulé sur les bassins versants et vulnérabilité nutritionnelle élevée en période de soudure.',
    severityLevel: 'Élevé',
    rainfallAnomaly: 'Déficit hydrique cumulé',
    tempAnomaly: '+1,5 à +3 °C',
    measures: [
      'Programmes « argent contre travail » (HIMO) pour réhabiliter les périmètres irrigués',
      'Maintien et extension des cantines scolaires en zones rurales',
      'Prise en charge nutritionnelle communautaire préventive',
    ],
    keyPrograms: 'PAM · Projet DEFIS · DRAE / FDA-R',
  },
  {
    id: 'centre-est',
    exProvince: 'Antananarivo & Toamasina',
    zoneLabel: 'Centre et Côte Est',
    regions: ['Analamanga', 'Vakinankaratra', 'Alaotra-Mangoro', 'Atsinanana'],
    riskSummary:
      'Pluies irrégulières sur les greniers rizicoles, tension sur les intrants et flambée saisonnière du prix du riz local.',
    severityLevel: 'Élevé',
    rainfallAnomaly: 'Démarrage irrégulier · Baisse risque cyclonique Côte Est',
    tempAnomaly: '+1,5 à +2,5 °C',
    measures: [
      'Importations de riz tampon par l’État pour contenir le pic à 3 200 MGA/kg',
      'Enquêtes de l’ANMCC pour protéger les producteurs locaux',
      'Surveillance des stocks contre la spéculation sur les marchés urbains',
    ],
    keyPrograms: 'MINAE · ANMCC · FDA · GSDM',
  },
  {
    id: 'mahajanga',
    exProvince: 'Ex-Province de Mahajanga',
    zoneLabel: 'Nord-Ouest',
    regions: ['Boeny', 'Sofia', 'Betsiboka', 'Melaky'],
    riskSummary:
      'Retard des pluies et fortes chaleurs sur les grandes plaines rizicoles (Marovoay, Sofia), favorisant le risque acridien.',
    severityLevel: 'Vigilance',
    rainfallAnomaly: 'Retard des premières pluies (décalage décembre)',
    tempAnomaly: '+2 à +3 °C',
    measures: [
      'Curage prioritaire des canaux d’irrigation avant le pic hydrique',
      'Appui en engrais subventionnés via vouchers DRAE / FDA',
      'Surveillance antiacridienne préventive contre la prolifération des criquets',
    ],
    keyPrograms: 'DRAE · CirAE · PURPA · FAO',
  },
  {
    id: 'antsiranana',
    exProvince: 'Ex-Province d’Antsiranana',
    zoneLabel: 'Extrême Nord',
    regions: ['Diana', 'Sava'],
    riskSummary:
      'Contraste inverse du Sud : précipitations excédentaires de novembre à janvier avec risques d’inondations localisées et stress thermique sur la vanille.',
    severityLevel: 'Vigilance',
    rainfallAnomaly: 'Excédent pluviométrique (Nov. – Janv.)',
    tempAnomaly: 'Pics de chaleur diurne',
    measures: [
      'Pré-positionnement de vivres et kits d’abri par le BNGRC',
      'Curage des évacuations d’eau urbaines avant les averses de janvier',
      'Protection et renforcement de l’ombrage des lianes de vanille (Gliricidia)',
    ],
    keyPrograms: 'BNGRC · Météo Madagascar · DRAE',
  },
];

export const AFRICA_BLOCS: AfricaBlocImpact[] = [
  {
    id: 'zambie-zimbabwe',
    category: 'sadc',
    regionOrBloc: 'Zambie & Zimbabwe (Espace SADC)',
    countries: 'Zambie, Zimbabwe, bassin du Zambèze',
    climateSignal: 'Retard sévère des pluies et sécheresse prolongée durant l’été austral.',
    economicAndFoodImpact:
      'Chute de la production de maïs blanc et baisse critique du niveau du barrage de Kariba entraînant un rationnement électrique et le recours coûteux aux centrales thermiques.',
    emergencyResponse:
      'Plans nationaux sécheresse : importations massives de maïs blanc, distribution gratuite de semences résistantes et délestages planifiés.',
    severityLabel: 'Alerte Sécheresse & Énergie',
  },
  {
    id: 'malawi-mozambique',
    category: 'sadc',
    regionOrBloc: 'Malawi, Mozambique & SADC Ouest',
    countries: 'Malawi, Mozambique, Botswana, Namibie',
    climateSignal: 'Déficit pluviométrique généralisé et stress thermique sur les cultures pluviales.',
    economicAndFoodImpact:
      'Fragilisation des réserves alimentaires rurales et pertes sur le maïs de saison principale.',
    emergencyResponse:
      'Transferts monétaires d’urgence via les registres sociaux nationaux et distribution d’intrants subventionnés pour les cultures de contre-saison en bas-fonds humides.',
    severityLabel: 'Réponse Sociale & Contre-saison',
  },
  {
    id: 'afrique-sud',
    category: 'sadc',
    regionOrBloc: 'Afrique du Sud (Ceinture céréalière)',
    countries: 'Afrique du Sud et corridors logistiques SADC',
    climateSignal: 'Vagues de chaleur intenses et assèchement des sols dans la ceinture agricole centrale.',
    economicAndFoodImpact:
      'Baisse de productivité du maïs et des céréales, hausse des coûts d’importation pour soutenir les pays voisins enclavés.',
    emergencyResponse:
      'Mobilisation des réserves céréalières nationales, subventions de fourrage pour les éleveurs et coordination portuaire régionale.',
    severityLabel: 'Pression Céréalière & Logistique',
  },
  {
    id: 'comesa-corne',
    category: 'comesa',
    regionOrBloc: 'Espace COMESA & Corne de l’Afrique',
    countries: 'Kenya, Ouganda, Éthiopie, Somalie (Nord COMESA) vs Zambie/Malawi/Madagascar (Sud)',
    climateSignal: 'Le marché commun COMESA est fracturé : pluies diluviennes au nord (octobre–décembre) et sécheresse au sud.',
    economicAndFoodImpact:
      'Destruction des infrastructures routières et coupure des corridors commerciaux en Afrique de l’Est (fleuves Tana, Shabelle).',
    emergencyResponse:
      'Évacuations préventives le long des fleuves, distribution de kits d’assainissement anti-choléra et campagnes de vaccination du bétail contre les maladies liées à l’humidité.',
    severityLabel: 'Inondations & Rupture de Corridors',
  },
  {
    id: 'sahel-ouest',
    category: 'sahel',
    regionOrBloc: 'Afrique de l’Ouest & Bande sahélienne',
    countries: 'Burkina Faso, Mali, Niger et zone côtière',
    climateSignal: 'Influence indirecte : perturbation de la mousson, vents plus secs et déficit pluviométrique sahélien.',
    economicAndFoodImpact:
      'Fragilisation du mil, du sorgho et des pâturages, combinée aux pertes sur le cacao et le café en zone tropicale humide.',
    emergencyResponse:
      'Plafonnement des prix des céréales locales (riz, mil), contrôles stricts sur les marchés et libération des stocks nationaux à prix modérés.',
    severityLabel: 'Contrôle des Prix & Stocks',
  },
  {
    id: 'nord-centrale',
    category: 'nord-centrale',
    regionOrBloc: 'Afrique du Nord & Afrique Centrale',
    countries: 'Maroc, Maghreb · Bassin du Congo et zones de savane',
    climateSignal:
      'Pluies très irrégulières et hausse des températures en Afrique centrale ; risque de sécheresse hivernale persistante au Maghreb.',
    economicAndFoodImpact:
      'Perturbation des calendriers agricoles centraux et tension sur l’approvisionnement maraîcher au Maroc.',
    emergencyResponse:
      'Suspension de nouvelles autorisations d’exportation de légumes au Maroc et maintien des subventions sur le blé tendre et l’eau d’irrigation.',
    severityLabel: 'Régulation Agricole & Hydrique',
  },
];

export const RICE_PRICE_TRAJECTORY: RicePricePoint[] = [
  { month: 'Juil. 2026', priceMGA: 2550 },
  { month: 'Août 2026', priceMGA: 2620 },
  { month: 'Sept. 2026', priceMGA: 2710 },
  { month: 'Oct. 2026', priceMGA: 2820, note: 'Publication calendriers FOFIFA' },
  { month: 'Nov. 2026', priceMGA: 2940, note: 'Super El Niño actif (+3,5 °C)' },
  { month: 'Déc. 2026', priceMGA: 3080, note: 'Tension soudure & carburant' },
  { month: 'Janv. 2027', priceMGA: 3200, note: 'Pic estimé FEWS NET' },
  { month: 'Fév. 2027', priceMGA: 3200, note: 'Plateau haut avant récoltes' },
];

export const COMMODITY_IMPACTS: CommodityImpact[] = [
  {
    commodity: 'Riz (Asie & Madagascar)',
    region: 'Inde, Asie du Sud-Est, Antananarivo',
    mechanism: 'Affaiblissement de la mousson asiatique réduisant l’offre exportable et hausse locale du carburant.',
    marketPressure: 'Pic estimé à 3 200 MGA/kg à Antananarivo (Janv.–Fév. 2027).',
  },
  {
    commodity: 'Maïs, Manioc & Légumineuses',
    region: 'Afrique australe, Grand Sud malgache',
    mechanism: 'Effondrement de la récolte pluviale de maïs sous déficit hydrique et chaleur (+2 à +4 °C).',
    marketPressure: 'Report de demande accentuant l’inflation sur le manioc, les légumineuses et l’huile végétale.',
  },
  {
    commodity: 'Cacao, Café & Vanille',
    region: 'Afrique de l’Ouest, Amérique du Sud, Sava',
    mechanism: 'Sécheresse thermique en zones tropicales et pics de chaleur diurnes nécessitant l’ombrage des lianes.',
    marketPressure: 'Lourdes pertes de rendement sur le cacao/café ; vigilance thermique sur la vanille malgache.',
  },
  {
    commodity: 'Énergie Hydroélectrique',
    region: 'Barrage de Kariba (Zambie/Zimbabwe), Amérique du Sud',
    mechanism: 'Baisse prolongée des débits fluviaux réduisant la capacité des grands barrages hydroélectriques.',
    marketPressure: 'Recours coûteux aux centrales thermiques, creusement des déficits publics et frein industriel.',
  },
];

export const AGRICULTURAL_ZONES: AgriculturalZoneTechnique[] = [
  {
    id: 'grand-sud',
    title: 'Grand Sud et Sud-Ouest',
    regions: 'Androy, Anosy, Atsimo-Andrefana, Menabe',
    sowingWindow: 'Mi-décembre 2026 à janvier 2027',
    triggerRule: 'Attendre au moins 20 à 30 mm de pluies cumulées sur 3 jours consécutifs avant tout semis.',
    priorityCrops: ['Sorgho (cycle 90 j)', 'Mil (cycle 90 j)', 'Pois d’Angole (Ambatry)', 'Niébé / Dolique', 'Manioc tolérant'],
    cropAssociation:
      'Associer sorgho ou mil avec une légumineuse rampante (niébé ou dolique) qui couvre le sol contre l’évaporation, bordés de haies de pois d’Angole (brise-vent et fixation d’azote) et de sisal/cactus sans épines contre l’ensablement.',
    waterAndSoilPractice:
      'Technique du Zaï : creuser des poquets de 20 cm de profondeur remplis de compost ou fumier avant les pluies, complétés par un paillage (mulching) des interlignes et des diguettes anti-érosives.',
    calendarBars: [
      { crop: 'Sorgho & Mil (cycle 90 j)', cycleDays: '90 jours', startMonthIdx: 2.3, endMonthIdx: 5.2, note: 'Semis mi-déc. à janv. après 20-30 mm' },
      { crop: 'Niébé / Dolique associé', cycleDays: '75–90 jours', startMonthIdx: 2.3, endMonthIdx: 4.8, note: 'Couverture anti-évaporation' },
      { crop: 'Pois d’Angole (Ambatry)', cycleDays: 'Pérenne / Brise-vent', startMonthIdx: 1.5, endMonthIdx: 5.5, note: 'Fixation azote & protection vent' },
      { crop: 'Boutures de Manioc résilient', cycleDays: '6–9 mois', startMonthIdx: 1.8, endMonthIdx: 5.5, note: 'Implantation en poquets Zaï' },
    ],
  },
  {
    id: 'hautes-terres',
    title: 'Hautes Terres Centrales',
    regions: 'Analamanga, Vakinankaratra, Itasy, Haute Matsiatra',
    sowingWindow: 'Mi-novembre à mi-décembre 2026',
    triggerRule: 'Privilégier des variétés intermédiaires (110–120 j) sur tanety et repiquage jeune SRI dès mise en eau.',
    priorityCrops: ['Riz irrigué (SRI / SRA)', 'Riz pluvial (tanety)', 'Maïs (110–120 j)', 'Haricot grimpant / Soja'],
    cropAssociation:
      'Semis direct sur couverture végétale permanente (SCV) en associant maïs et haricot grimpant ou soja. Sur les pentes, implanter des bandes enherbées de Brachiaria ou de vétiver pour retenir le ruissellement et produire du fourrage.',
    waterAndSoilPractice:
      'En riziculture irriguée, appliquer le repiquage jeune (plants de 8 à 12 jours) selon le Système de Riziculture Intensive (SRI/SRA) et réhabiliter les canaux par travaux HIMO.',
    calendarBars: [
      { crop: 'Riz pluvial & Maïs (tanety)', cycleDays: '110–120 jours', startMonthIdx: 1.4, endMonthIdx: 4.9, note: 'Semis mi-nov. à mi-déc. sous SCV' },
      { crop: 'Riz irrigué SRI/SRA', cycleDays: '120–135 jours', startMonthIdx: 1.0, endMonthIdx: 4.8, note: 'Repiquage plants jeunes 8–12 j' },
      { crop: 'Haricot grimpant / Soja', cycleDays: '90–105 jours', startMonthIdx: 1.5, endMonthIdx: 4.5, note: 'Association directe avec maïs' },
      { crop: 'Bandes Brachiaria / Vétiver', cycleDays: 'Permanent', startMonthIdx: 0.8, endMonthIdx: 5.5, note: 'Anti-érosion sur pentes' },
    ],
  },
  {
    id: 'nord-ouest',
    title: 'Nord et Nord-Ouest',
    regions: 'Diana, Sava (Nord) · Boeny, Sofia (Nord-Ouest)',
    sowingWindow: 'Novembre (Diana/Sava drainé) · Décembre (Boeny/Sofia)',
    triggerRule: 'Deux calendriers opposés : semer tôt sur parcelles drainées au Nord (pluies excessives) ; décaler à décembre au Nord-Ouest (retard des pluies).',
    priorityCrops: ['Riz pluvial', 'Arachide', 'Vanille sous ombrage', 'Riz de plaine (Boeny)'],
    cropAssociation:
      'Associer riz pluvial et arachide en bandes alternées. Dans la Sava et Diana, densifier les arbres tuteurs d’ombrage (Gliricidia) pour protéger les lianes de vanille des pics thermiques.',
    waterAndSoilPractice:
      'Curage préventif des canaux de drainage en Diana/Sava pour prévenir l’asphyxie racinaire entre décembre et janvier ; curage d’irrigation et lutte antiacridienne dans le Boeny et la Sofia.',
    calendarBars: [
      { crop: 'Riz pluvial (Diana / Sava)', cycleDays: '110–120 jours', startMonthIdx: 1.0, endMonthIdx: 4.3, note: 'Semis précoce novembre sur sol drainé' },
      { crop: 'Riz & Arachide (Boeny / Sofia)', cycleDays: '105–120 jours', startMonthIdx: 2.0, endMonthIdx: 5.3, note: 'Décalage décembre (retard pluies)' },
      { crop: 'Arachide en bandes alternées', cycleDays: '95–110 jours', startMonthIdx: 1.6, endMonthIdx: 4.9, note: 'Association riz pluvial' },
      { crop: 'Protection Vanille (Gliricidia)', cycleDays: 'Continu', startMonthIdx: 0.5, endMonthIdx: 5.5, note: 'Ombrage anti-chaleur Nov.–Janv.' },
    ],
  },
];

export const COOPERATIVE_AGENCIES: CooperativeAgency[] = [
  {
    name: 'Fonds de Développement Agricole (FDA)',
    type: 'Guichet national',
    role: 'Principal mécanisme financier sous tutelle du MINAE. Finance semences certifiées, engrais (vouchers), petits équipements d’irrigation et transformation.',
    address: 'Guichets régionaux (FDA-R) dans chaque capitale régionale',
    contact: 'MINAE / FDA-R de votre région',
    eligibilityOrAction: 'Coopérative légalement constituée présentant un micro-projet agricole ou d’irrigation.',
  },
  {
    name: 'DRAE & Circonscriptions Agricoles (CirAE)',
    type: 'Guichet national',
    role: 'Enregistrement des producteurs et accès aux kits d’intrants subventionnés (programmes d’urgence comme le PURPA).',
    address: 'Directions Régionales de l’Agriculture et de l’Élevage (chef-lieu de district / région)',
    contact: 'Bureau CirAE du district',
    eligibilityOrAction: 'Inscrire les membres de la coopérative pour obtenir la carte numérique de producteur.',
  },
  {
    name: 'Projet DEFIS (MINAE / FIDA)',
    type: 'Guichet national',
    role: 'Accompagnement ciblé des coopératives du Grand Sud et du Sud-Est pour les semences résilientes et les infrastructures d’eau.',
    address: 'Régions Grand Sud et Sud-Est',
    contact: 'Coordination régionale MINAE / DEFIS',
    eligibilityOrAction: 'Prioritaire pour les organisations paysannes d’Androy, Anosy, Atsimo-Andrefana et Sud-Est.',
  },
  {
    name: 'FAO Madagascar',
    type: 'Agence ONU',
    role: 'Distribution de semences résistantes à la sécheresse, kits de micro-irrigation et Écoles Pratiques d’Agriculture (CEP).',
    address: '159 Route Circulaire, Ankorahotra, BP 3971, Antananarivo 101',
    contact: 'Tél : +261 20 22 288 31 / +261 20 22 621 51 · FAO-MG@fao.org',
    eligibilityOrAction: 'Partenariat via les ministères et coopératives structurées.',
  },
  {
    name: 'PAM Madagascar (WFP)',
    type: 'Agence ONU',
    role: 'Achats locaux de vivres auprès des coopératives et chantiers « Vivres / Argent contre travail » (réhabilitation de canaux).',
    address: 'Lot VB 71 GB, Ambatoroka, BP 4199, Antananarivo 101',
    contact: 'fr.wfp.org/countries/madagascar (Sous-bureaux : Ambovombe, Tolagnaro, Toliara, Manakara)',
    eligibilityOrAction: 'Réponse d’urgence et contrats d’achats locaux pour coopératives structurées.',
  },
  {
    name: 'GSDM (Professionnels de l’Agroécologie)',
    type: 'Appui technique',
    role: 'Formation technique aux systèmes de semis direct sur couverture végétale (SCV), fourniture de semences de couverture et conseil terrain.',
    address: 'Lot VA 26 Y Ambatoroka, Antananarivo 101',
    contact: 'Site : gsdm-mg.org',
    eligibilityOrAction: 'Appui méthodologique aux groupements pratiquant la conservation des sols et l’agroécologie.',
  },
];

export const REFERENCE_SOURCES: ReferenceSource[] = [
  { label: 'Thèmes El Niño / La Niña', publisher: 'Organisation Météorologique Mondiale (OMM)', url: 'https://wmo.int/fr/themes/el-nino-la-nina' },
  { label: 'Dossier El Niño & sécurité alimentaire', publisher: 'FAO', url: 'https://www.fao.org/el-nino/fr' },
  { label: 'Communiqué SWIOCOF-15 (Océan Indien 2026–2027)', publisher: 'Commission de l’Océan Indien (COI)', url: 'https://www.commissionoceanindien.org/communique-swiocof-15-un-el-nino-installe-des-temperatures-exceptionnelles-a-prevoir-et-une-saison-avec-moins-de-cyclones-dans-la-region/' },
  { label: 'Perspectives climatiques 2026–2027 à Madagascar', publisher: 'Météo Madagascar', url: 'https://www.meteomadagascar.mg/izepoons/perspectives_climatiques_2026-2027-1.pdf' },
  { label: 'Prévisions saisonnières', publisher: 'Météo Madagascar (Hiver / Saison)', url: 'https://www.meteomadagascar.mg/prevision/previsions-saisonnieres-hiver-meteo-madagascar/' },
  { label: 'Focus El Niño & projections mondiales', publisher: 'Nations Unies (ONU)', url: 'https://www.un.org/en/focus/el-nino' },
  { label: 'Aggravation de la crise alimentaire dans le Grand Sud', publisher: 'Action Contre la Faim', url: 'https://www.actioncontrelafaim.org/en/news/press/madagascar-el-nino-to-worsen-the-food-crisis-in-the-greater-south/' },
  { label: 'Alerte El Niño 2026–2027 à Madagascar (OCHA)', publisher: 'Moov.mg', url: 'https://www.moov.mg/article/120424-alerte-el-nino-20262027-madagascar-classe-en-situation-de-tres-haute-preoccupation-par-locha' },
  { label: 'Insécurité alimentaire et Grand Sud (3,72 M)', publisher: 'AllAfrica', url: 'https://fr.allafrica.com/stories/202611120277.html' },
  { label: 'Menace sur la prochaine récolte de maïs dans le Sud', publisher: 'Midi Madagasikara', url: 'https://midi-madagasikara.mg/el-nino-dans-le-sud-de-madagascar-le-manque-de-pluie-menace-la-prochaine-recolte-de-mais/' },
  { label: 'Influence sur la saison cyclonique 2026–2027', publisher: 'CycloneOI', url: 'https://www.cycloneoi.com/archives-blog/le-coin-expert/el-nino-et-iod-en-vue-quelle-influence-possible-sur-la-saison-cyclonique-2026-2027.html' },
  { label: 'Menace sur l’agriculture et les denrées', publisher: 'La Croix', url: 'https://www.la-croix.com/planete/el-nino-comment-le-phenomene-climatique-menace-l-agriculture-et-la-securite-alimentaire-20261108' },
  { label: 'Mortalité liée à la chaleur extrême (Nature Medicine)', publisher: 'Science & Vie', url: 'https://www.science-et-vie.com/nature-et-environnement/lors-des-episodes-el-nino-les-plus-puissants-la-chaleur-serait-associee-a-plus-de-100-000-deces-supplementaires-chaque-annee-a-lechelle-mondiale-266055.html' },
  { label: 'Synthèse épisode 2026–2027', publisher: 'Wikipédia', url: 'https://fr.wikipedia.org/wiki/El_Ni%C3%B1o_de_2026-2027' },
];

export interface HistoricalPatternRow {
  indicator: string;
  neutralLaNina: string;
  strongElNino: string;
  measuredImpact: string;
}

export interface RegionalPrediction2027 {
  id: string;
  region: string;
  subRegions: string;
  horizon: string;
  forecast: string;
  criticalMetric: string;
}

export interface AfricaPrediction2027 {
  zone: string;
  countries: string;
  weather2027: string;
  economicImpact2027: string;
}

export const HISTORICAL_PATTERNS_10Y: HistoricalPatternRow[] = [
  {
    indicator: 'Précipitations (Sud & Ouest)',
    neutralLaNina: 'Normales à excédentaires (saison régulière nov.–mars).',
    strongElNino: 'Déficit de -30 % à -50 %, retard des pluies de 3 à 5 semaines.',
    measuredImpact: 'Rupture du cycle du maïs et des légumineuses.',
  },
  {
    indicator: 'Températures maximales',
    neutralLaNina: 'Variations saisonnières standard (+0,2 à +0,5 °C).',
    strongElNino: 'Anomalie thermique de +1,5 °C à +4,0 °C (janvier–mars).',
    measuredImpact: 'Évapotranspiration extrême et assèchement des sols.',
  },
  {
    indicator: 'Activité cyclonique',
    neutralLaNina: '2 à 4 impacts directs sur les côtes Est et Nord-Ouest.',
    strongElNino: 'Baisse statistique (0 à 2 impacts directs), trajectoires déviées à l’Est.',
    measuredImpact: 'Moins de dégâts éoliens, mais moins d’apport d’eau utile.',
  },
  {
    indicator: 'PIB Agricole & Pertes',
    neutralLaNina: 'Croissance agricole stable (+2,5 % à +3,5 %/an).',
    strongElNino: 'Contraction sectorielle de -6 % à -7 % (ex. > 200 M$ de pertes en 2023–24).',
    measuredImpact: 'Chute des revenus ruraux et décapitalisation (vente de bétail).',
  },
  {
    indicator: 'Inflation (Prix à la conso.)',
    neutralLaNina: 'Moyenne comprise entre 5,6 % et 8,2 %.',
    strongElNino: 'Poussée inflationniste à 8,6 % – 9,9 % sur l’année de récolte.',
    measuredImpact: 'Flambée du prix du riz et des denrées de substitution.',
  },
];

export const MADAGASCAR_2027_PREDICTIONS: RegionalPrediction2027[] = [
  {
    id: 'grand-sud-2027',
    region: 'Grand Sud',
    subRegions: 'Androy, Anosy, Atsimo-Andrefana',
    horizon: 'Avril – T3 2027',
    forecast:
      'Aggravation critique de la crise alimentaire : la récolte de maïs et de manioc d’avril–juin 2027 sera fortement déficitaire, déclenchant une soudure précoce dès le troisième trimestre 2027.',
    criticalMetric: 'Poches d’urgence nutritionnelle Phase IPC 4 à 5',
  },
  {
    id: 'hautes-terres-2027',
    region: 'Hautes Terres Centrales',
    subRegions: 'Analamanga, Vakinankaratra, Itasy, Haute Matsiatra',
    horizon: 'Janvier – Avril 2027',
    forecast:
      'Déficit hydrique marqué jusqu’en janvier 2027 suivi de pluies tardives concentrées entre février et avril, maintenant une tension soutenue sur les prix du riz local sur les marchés urbains.',
    criticalMetric: '-10 % à -15 % de production rizicole pluviale',
  },
  {
    id: 'ouest-nord-ouest-2027',
    region: 'Côte Ouest et Nord-Ouest',
    subRegions: 'Menabe, Melaky, Boeny (Marovoay), Sofia',
    horizon: 'Mars – Juin 2027',
    forecast:
      'Retard prolongé de la mousson et vagues de chaleur intenses. Les plaines rizicoles irriguées (Marovoay) souffriront d’un faible niveau des barrages.',
    criticalMetric: 'Forte hausse du risque d’invasions acridiennes (mars–juin)',
  },
  {
    id: 'nord-nord-est-2027',
    region: 'Nord et Nord-Est',
    subRegions: 'Diana, Sava, Analanjirofo, Ambatosoa',
    horizon: 'Nov. 2026 – Campagne 2027',
    forecast:
      'Excédent pluviométrique entre novembre 2026 et janvier 2027 provoquant crues et glissements de terrain. Le stress thermique et l’humidité excessive menacent la floraison.',
    criticalMetric: 'Qualité et floraison de la vanille et du cacao exposées',
  },
  {
    id: 'grand-sud-est-2027',
    region: 'Grand Sud-Est',
    subRegions: 'Vatovavy, Fitovinany, Atsimo-Atsinanana',
    horizon: 'Février – Avril 2027',
    forecast:
      'Après un début de saison sec, le retour brutal des pluies prévu entre février et avril 2027 expose les bas-fonds aux inondations.',
    criticalMetric: 'Menace sur les cultures de rente (café, girofle, poivre)',
  },
];

export const AFRICA_2027_PREDICTIONS: AfricaPrediction2027[] = [
  {
    zone: 'Afrique australe & SADC',
    countries: 'Zambie, Zimbabwe, Malawi, Mozambique',
    weather2027: 'Sécheresse sévère et vagues de chaleur durant la fenêtre critique de floraison (janvier–février 2027).',
    economicImpact2027:
      'Chute de 20 % à 40 % des rendements de maïs. Rationnement électrique sévère (baisse du barrage de Kariba) freinant le secteur minier et industriel.',
  },
  {
    zone: 'Afrique du Sud',
    countries: 'Free State, Nord-Ouest (ceinture du maïs)',
    weather2027: 'Assèchement des sols dans la ceinture du maïs, mais niveaux de barrages initiaux corrects.',
    economicImpact2027:
      'Baisse de la récolte d’été absorbée au 1er trimestre par les stocks de report, suivie d’une accélération de l’inflation alimentaire dès le 2e semestre 2027.',
  },
  {
    zone: 'Espace COMESA (Axe Nord-Sud)',
    countries: 'Kenya, Ouganda, Éthiopie vs Zambie, Malawi, Madagascar',
    weather2027: 'Forte asymétrie : inondations au nord et sécheresse au sud.',
    economicImpact2027:
      'Rupture des chaînes d’approvisionnement régionales, destruction des infrastructures routières à l’Est et explosion des déficits commerciaux liés aux importations d’urgence.',
  },
  {
    zone: 'Afrique centrale',
    countries: 'Bassin du Congo, Cameroun, RDC',
    weather2027: 'Régime pluviométrique erratique, hausse des températures moyennes et baisse du débit des cours d’eau.',
    economicImpact2027:
      'Perturbation du transport fluvial, baisse des rendements de manioc et de cacao, et hausse des coûts logistiques intérieurs.',
  },
  {
    zone: 'Afrique de l’Ouest',
    countries: 'Sahel & Golfe de Guinée (Côte d’Ivoire, Ghana)',
    weather2027: 'Réchauffement persistant, vents secs (Harmattan renforcé) et démarrage irrégulier de la mousson au printemps 2027.',
    economicImpact2027:
      'Baisse de la production de cacao maintenant les cours mondiaux élevés ; déficit fourrager et tension sur le mil/sorgho au Sahel.',
  },
  {
    zone: 'Afrique du Nord',
    countries: 'Maroc, Algérie, Tunisie',
    weather2027: 'Influence indirecte favorisant la persistance de blocages anticycloniques et de déficits hydriques hivernaux.',
    economicImpact2027:
      'Contraction de la production céréalière (blé, orge) au Maghreb, alourdissant la facture des subventions étatiques et des importations alimentaires.',
  },
];

export const LSTM_LAG_SERIES = [
  { month: 'Nov. 26', oniAnomaly: 3.5, harvestShockIdx: 22, label: 'Pic Pacifique amorcé' },
  { month: 'Déc. 26', oniAnomaly: 3.8, harvestShockIdx: 34, label: 'Pic Niño 3.4 (+3,8 °C)' },
  { month: 'Janv. 27', oniAnomaly: 3.7, harvestShockIdx: 48, label: 'Évapotranspiration max' },
  { month: 'Fév. 27', oniAnomaly: 2.9, harvestShockIdx: 62, label: 'Stress floraison / riz' },
  { month: 'Mar. 27', oniAnomaly: 1.8, harvestShockIdx: 74, label: 'Criquets / Pluies tardives' },
  { month: 'Avr. 27', oniAnomaly: 0.7, harvestShockIdx: 88, label: 'Transition neutre & récoltes' },
  { month: 'Mai 27', oniAnomaly: 0.2, harvestShockIdx: 94, label: 'Déficit maïs/manioc Sud' },
  { month: 'Juin 27', oniAnomaly: 0.0, harvestShockIdx: 96, label: 'Pic tension prix & IPC' },
  { month: 'Juil. 27', oniAnomaly: -0.1, harvestShockIdx: 92, label: 'Soudure précoce T3' },
  { month: 'Août 27', oniAnomaly: -0.2, harvestShockIdx: 85, label: 'Inflation persistante' },
];

export const PYTHON_ML_SCRIPT = `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

# 1. Chargement des données historiques (2015-2026) : Pluie, Temp, Indice ONI, Prix Riz, Rendement
df = pd.read_csv("donnees_climat_economie_madagascar.csv")

# 2. Création des variables décalées (Lag features) car El Niño impacte les récoltes avec 4 mois de retard
df["ONI_lag4"] = df["Indice_ONI"].shift(4)
df["Pluie_cumul_3m"] = df["Precipitations_mm"].rolling(window=3).sum()
df = df.dropna()

# 3. Séparation des variables explicatives (X) et cibles (y : Rendement agricole ou Prix du riz)
features = ["ONI_lag4", "Indice_IOD", "Pluie_cumul_3m", "Temp_Max_Anomalie"]
X = df[features]
y_rendement = df["Rendement_Mais_Tonne_Ha"]

# 4. Entraînement du modèle Random Forest
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X, y_rendement)

# 5. Prédiction pour le pic 2027 (Ex: ONI = +3.5, IOD = +0.9, Déficit pluie, Temp = +2.8°C)
scenario_2027 = pd.DataFrame([[3.5, 0.9, 180.0, 2.8]], columns=features)
prediction_2027 = model.predict(scenario_2027)
print(f"Rendement projeté en 2027 : {prediction_2027[0]:.2f} tonnes/ha")`;

export interface EtlSourceRow {
  source: string;
  accessResolution: string;
  variables: string;
  roleInMl: string;
}

export interface Filiere2027vs2028 {
  filiere: string;
  prediction2027: string;
  prediction2028: string;
  delta2027Pct: number;
  delta2028Pct: number;
}

export interface DistrictHydroProfile {
  id: 'grand-sud-eau' | 'hydro-centre' | 'plaines-nord-ouest' | 'cotiers-nord-est';
  title: string;
  zoneSubtitle: string;
  districts: string[];
  prediction2027: string;
  prediction2028: string;
  hydroSignal2027: string;
  sampleCentroids: { district: string; region: string; lat: number; lon: number }[];
}

export const ETL_OPEN_SOURCES: EtlSourceRow[] = [
  {
    source: 'NASA POWER',
    accessResolution: 'API REST gratuite (JSON/CSV), grille 0,5° × 0,625°, communauté Agroclimatology (AG).',
    variables: 'PRECTOTCORR (précipitations), T2M_MAX (temp. max), ALLSKY_SFC_SW_DWN (rayonnement solaire), RH2M (humidité relative).',
    roleInMl: 'Calcul de l’évapotranspiration potentielle (ETP) et du stress thermique sur la floraison.',
  },
  {
    source: 'Copernicus ERA5',
    accessResolution: 'API cdsapi (NetCDF/GRIB), grille fine 0,25° × 0,25° (~28 km), réanalyse horaire/mensuelle.',
    variables: 'volumetric_soil_water_layer_1 (humidité sol 0–7 cm), runoff (ruissellement), total_evaporation.',
    roleInMl: 'Modélisation directe du bilan hydrique des bassins versants et des nappes par district.',
  },
  {
    source: 'FAOSTAT',
    accessResolution: 'Téléchargement CSV / API HDX, séries nationales annuelles (1961–présent).',
    variables: 'Area harvested (superficie), Yield (rendement hg/ha), Production (tonnes), Producer Prices.',
    roleInMl: 'Variables cibles historiques (Y) pour le riz, maïs, manioc, vanille, café, girofle et litchi.',
  },
  {
    source: 'NOAA CPC & CHIRPS',
    accessResolution: 'NOAA (indices mensuels) et CHIRPS (grille pluviométrique ultra-fine 0,05° ~5 km).',
    variables: 'Indices ONI (Niño 3.4) et DMI (Dipôle océan Indien) + cumuls pluviométriques par district.',
    roleInMl: 'Variables explicatives globales décalées (lags de 3 à 9 mois) et précision locale des pluies.',
  },
];

export const FILIERES_2027_VS_2028: Filiere2027vs2028[] = [
  {
    filiere: 'Riz (Irrigué et Pluvial)',
    prediction2027:
      'Baisse de -8 % à -14 % de la production nationale. Le riz pluvial (tanety) souffre du retard des pluies et le riz irrigué du faible remplissage des barrages. Tension forte sur les prix jusqu’en mai 2027.',
    prediction2028:
      'Rebond de +10 % à +15 % grâce au retour des pluies régulières fin 2027, mais risque localisé de pertes par inondation et cyclones dans les plaines basses (Marovoay, Alaotra).',
    delta2027Pct: -11,
    delta2028Pct: 12.5,
  },
  {
    filiere: 'Produits vivriers (Maïs, Manioc, Patate douce, Haricot)',
    prediction2027:
      'Chute critique de -25 % à -40 % sur le maïs et les légumineuses dans le Sud et le Centre. Le manioc résiste mieux mais affiche des tubercules de plus petit calibre.',
    prediction2028:
      'Forte reprise (+20 % à +30 %) sur le maïs et le haricot grâce à une humidité des sols restaurée, permettant de reconstituer les réserves paysannes.',
    delta2027Pct: -32.5,
    delta2028Pct: 25,
  },
  {
    filiere: 'Vanille (Filière d’exportation SAVA)',
    prediction2027:
      'Risque élevé sur la qualité et les volumes : les fortes pluies de fin 2026 suivies d’un pic thermique début 2027 favorisent la coulure des fleurs et le Fusarium.',
    prediction2028:
      'Stabilisation des volumes, sous réserve d’absence de cyclone majeur en début d’année 2028 sur la côte Nord-Est (Antalaha, Sambava, Andapa).',
    delta2027Pct: -15,
    delta2028Pct: 6,
  },
  {
    filiere: 'Café, Girofle et Litchi (Côte Est)',
    prediction2027:
      'Stress hydrique et thermique (Atsinanana, Analanjirofo, Fitovinany) : baisse estimée de -10 % à -20 % des volumes exportables de café Robusta et de litchi (fruits plus petits, maturité précoce).',
    prediction2028:
      'Reprise cyclique forte (notamment pour le girofle et le litchi qui bénéficient du repos végétatif et du retour de l’humidité).',
    delta2027Pct: -15,
    delta2028Pct: 18,
  },
];

export const HYDRO_DISTRICT_PROFILES: DistrictHydroProfile[] = [
  {
    id: 'grand-sud-eau',
    title: '1. Déficit hydrique critique (Grand Sud & Sud-Ouest)',
    zoneSubtitle: 'Recharge nappes & fleuves Mandrare, Menarandra, Onilahy',
    districts: [
      'Ambovombe',
      'Tsihombe',
      'Beloha',
      'Bekily',
      'Ampanihy',
      'Betioky',
      'Toliara II',
      'Morombe',
      'Belo-sur-Tsiribihina',
    ],
    hydroSignal2027: '-35 % à -55 % recharge nappes',
    prediction2027:
      'Baisse de -35 % à -55 % de la recharge des nappes superficielles et assèchement précoce des fleuves (Mandrare, Menarandra, Onilahy) dès mai 2027. Stress hydrique sévère pour l’eau potable et l’abreuvage du bétail.',
    prediction2028:
      'Recharge progressive des nappes phréatiques entre janvier et avril 2028, avec un risque de crues éclair (flash floods) sur des sols dénudés et durcis par la sécheresse de 2027.',
    sampleCentroids: [
      { district: 'Ambovombe', region: 'Androy', lat: -25.18, lon: 46.09 },
      { district: 'Tsihombe', region: 'Androy', lat: -25.30, lon: 45.48 },
      { district: 'Beloha', region: 'Androy', lat: -25.17, lon: 45.06 },
      { district: 'Bekily', region: 'Androy', lat: -24.22, lon: 45.32 },
      { district: 'Ampanihy', region: 'Atsimo-Andrefana', lat: -24.69, lon: 44.75 },
      { district: 'Betioky', region: 'Atsimo-Andrefana', lat: -23.72, lon: 44.38 },
      { district: 'Toliara II', region: 'Atsimo-Andrefana', lat: -23.35, lon: 43.67 },
      { district: 'Morombe', region: 'Atsimo-Andrefana', lat: -21.74, lon: 43.36 },
      { district: 'Belo-sur-Tsiribihina', region: 'Menabe', lat: -19.70, lon: 44.54 },
    ],
  },
  {
    id: 'hydro-centre',
    title: '2. Bassins hydroélectriques & grands périmètres (Centre & Moyen-Ouest)',
    zoneSubtitle: 'Rivières Vohitra, Ikopa, Mania · Barrage d’Andekaleka & Lac Alaotra',
    districts: [
      'Moramanga (Andekaleka)',
      'Ambatondrazaka',
      'Amparafaravola (Lac Alaotra)',
      'Antananarivo-Atsimondrano',
      'Antsirabe II',
      'Miarinarivo',
      'Tsiroanomandidy',
    ],
    hydroSignal2027: 'Étiage bas juil.–nov. 2027 (RIA)',
    prediction2027:
      'Débit d’étiage historiquement bas des rivières (Vohitra, Ikopa, Mania) entre juillet et novembre 2027, accentuant les déficits de production hydroélectrique sur le Réseau Interconnecté d’Antananarivo (RIA) et limitant la riziculture de contre-saison.',
    prediction2028:
      'Retour à la normale du remplissage des retenues d’eau et du lac Alaotra dès le premier trimestre 2028.',
    sampleCentroids: [
      { district: 'Moramanga', region: 'Alaotra-Mangoro', lat: -18.95, lon: 48.23 },
      { district: 'Ambatondrazaka', region: 'Alaotra-Mangoro', lat: -17.83, lon: 48.42 },
      { district: 'Amparafaravola', region: 'Alaotra-Mangoro', lat: -17.58, lon: 48.22 },
      { district: 'Antananarivo-Atsimondrano', region: 'Analamanga', lat: -18.96, lon: 47.49 },
      { district: 'Antsirabe II', region: 'Vakinankaratra', lat: -19.86, lon: 47.03 },
      { district: 'Miarinarivo', region: 'Itasy', lat: -18.96, lon: 46.90 },
      { district: 'Tsiroanomandidy', region: 'Bongolava', lat: -18.77, lon: 46.05 },
    ],
  },
  {
    id: 'plaines-nord-ouest',
    title: '3. Grandes plaines alluviales du Nord-Ouest',
    zoneSubtitle: 'Bassins de la Betsiboka et de la Sofia · Riz vary jeby',
    districts: [
      'Marovoay',
      'Mitsinjo',
      'Ambato-Boeny',
      'Maevatanana',
      'Antsohihy',
      'Port-Bergé',
    ],
    hydroSignal2027: 'Déficit Betsiboka / Sofia (vary jeby)',
    prediction2027:
      'Déficit d’apport hydrique de la Betsiboka et de la Sofia en début de campagne, réduisant les superficies irriguées de riz vary jeby (contre-saison) entre mai et octobre 2027.',
    prediction2028:
      'Risque élevé de débordements et d’inondations dans les bas-fonds de Marovoay et de la Sofia entre janvier et mars 2028 si la transition La Niña réactive la cyclogenèse dans le canal du Mozambique.',
    sampleCentroids: [
      { district: 'Marovoay', region: 'Boeny', lat: -16.11, lon: 46.64 },
      { district: 'Mitsinjo', region: 'Boeny', lat: -16.00, lon: 45.87 },
      { district: 'Ambato-Boeny', region: 'Boeny', lat: -16.47, lon: 46.71 },
      { district: 'Maevatanana', region: 'Betsiboka', lat: -16.95, lon: 46.83 },
      { district: 'Antsohihy', region: 'Sofia', lat: -14.88, lon: 47.99 },
      { district: 'Port-Bergé', region: 'Sofia', lat: -15.57, lon: 47.62 },
    ],
  },
  {
    id: 'cotiers-nord-est',
    title: '4. Districts côtiers du Nord et de l’Est',
    zoneSubtitle: 'Façade océan Indien · Risque dépressionnaire 2028',
    districts: [
      'Antsiranana II',
      'Ambilobe',
      'Sambava',
      'Antalaha',
      'Maroantsetra',
      'Toamasina II',
      'Mananjary',
      'Manakara',
      'Farafangana',
    ],
    hydroSignal2027: 'Excédent Nord (janv. 27) puis sec Est',
    prediction2027:
      'Excédent hydrique marqué jusqu’en janvier 2027 dans l’extrême Nord (Diana/Sava), suivi d’un assèchement relatif sur la côte Centre-Est et Sud-Est au milieu de l’année 2027.',
    prediction2028:
      'Exposition maximale au retour des systèmes dépressionnaires et cyclones de l’océan Indien (janvier–avril 2028), générant des excès d’eau et des risques d’inondation côtière.',
    sampleCentroids: [
      { district: 'Antsiranana II', region: 'Diana', lat: -12.35, lon: 49.29 },
      { district: 'Ambilobe', region: 'Diana', lat: -13.20, lon: 49.05 },
      { district: 'Sambava', region: 'Sava', lat: -14.27, lon: 50.17 },
      { district: 'Antalaha', region: 'Sava', lat: -14.90, lon: 50.28 },
      { district: 'Maroantsetra', region: 'Ambatosoa', lat: -15.43, lon: 49.74 },
      { district: 'Toamasina II', region: 'Atsinanana', lat: -18.14, lon: 49.35 },
      { district: 'Mananjary', region: 'Vatovavy', lat: -21.23, lon: 48.34 },
      { district: 'Manakara', region: 'Fitovinany', lat: -22.14, lon: 48.01 },
      { district: 'Farafangana', region: 'Atsimo-Atsinanana', lat: -22.82, lon: 47.83 },
    ],
  },
];

export const PYTHON_XGBOOST_SCRIPT = `import requests
import pandas as pd
from xgboost import XGBRegressor

# 1. Extraction directe des données NASA POWER pour un district (ex: Ambatondrazaka : lat -17.83, lon 48.42)
url = (
    "https://power.larc.nasa.gov/api/temporal/monthly/point"
    "?parameters=PRECTOTCORR,T2M_MAX,ALLSKY_SFC_SW_DWN"
    "&community=AG&longitude=48.42&latitude=-17.83"
    "&start=2010&end=2026&format=JSON"
)
response = requests.get(url).json()
data_nasa = response["properties"]["parameter"]

# Conversion en DataFrame exploitable
df_climat = pd.DataFrame(data_nasa)
df_climat.index.name = "YYYYMM"
df_climat = df_climat.reset_index()

# 2. Structure d'entraînement multi-cibles (Filières FAOSTAT + Eau ERA5)
# features = ['ONI_lag6', 'IOD_lag4', 'Pluie_Saison_mm', 'Temp_Max_Moy', 'Humidite_Sol_ERA5']
# targets = ['Rendement_Riz', 'Rendement_Vanille', 'Rendement_Mais', 'Debit_Eau_District']

def entrainer_et_predire_filiere(df_complet, features, target_col):
    X = df_complet[features]
    y = df_complet[target_col]

    # Modèle XGBoost adapté aux relations non-linéaires climat-agriculture
    modele = XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=4, random_state=42)
    modele.fit(X, y)

    # Scénarios d'entrée : 2027 (Post-Super El Niño) vs 2028 (Transition La Niña)
    scenarios = pd.DataFrame([
        {"ONI_lag6": 3.2, "IOD_lag4": 0.8, "Pluie_Saison_mm": 750, "Temp_Max_Moy": 31.5, "Humidite_Sol_ERA5": 0.21},  # 2027
        {"ONI_lag6": -0.9, "IOD_lag4": -0.3, "Pluie_Saison_mm": 1250, "Temp_Max_Moy": 28.8, "Humidite_Sol_ERA5": 0.36}  # 2028
    ], index=["Prediction_2027", "Prediction_2028"])

    predictions = modele.predict(scenarios)
    return dict(zip(scenarios.index, predictions))

print("Données NASA POWER extraites avec succès :", df_climat.tail(3))`;

export interface HybridAiComponent {
  component: string;
  role: string;
  trainingSources: string;
  implementation: string;
}

export interface HyperparamGuard {
  param: string;
  value: string;
  purpose: string;
}

export interface HybridOrchestrationDemo {
  id: string;
  district: string;
  region: string;
  query: string;
  xgboostJson: string;
  ragExcerpts: { source: string; snippet: string }[];
  synthesizedPlan: string;
}

export const XGBOOST_ANTI_OVERFIT_PARAMS: HyperparamGuard[] = [
  {
    param: 'TimeSeriesSplit(n_splits=4)',
    value: 'Split 80% / 20% chronologique',
    purpose: 'Empêche toute fuite du futur (data leakage) lors de la validation croisée sur séries de 10 à 20 ans.',
  },
  {
    param: 'max_depth & min_child_weight',
    value: 'max_depth: [2, 3] · min_child_weight: [3, 5, 8]',
    purpose: 'Limite la profondeur des arbres et impose plusieurs observations par feuille pour ne pas mémoriser le bruit.',
  },
  {
    param: 'learning_rate & n_estimators',
    value: 'lr: [0.01, 0.03] · n_estimators: [100, 150, 200] · early_stopping=15',
    purpose: 'Apprentissage progressif avec arrêt automatique dès que l’erreur de validation remonte.',
  },
  {
    param: 'reg_alpha (L1) & reg_lambda (L2)',
    value: 'reg_alpha: [0.5, 1.0, 2.0] · reg_lambda: [2.0, 5.0, 10.0]',
    purpose: 'Pénalité Lasso (L1) éliminant les variables météo bruitées et Ridge (L2) lissant les poids.',
  },
  {
    param: 'subsample & colsample_bytree',
    value: '[0.7, 0.8]',
    purpose: 'Échantillonnage aléatoire des années (bagging) et des variables climatiques à chaque arbre.',
  },
];

export const HYBRID_AI_ARCHITECTURE: HybridAiComponent[] = [
  {
    component: '1. Modèle Tabulaire (XGBoost régularisé)',
    role: 'Génère les prédictions quantitatives par district et par filière (tonnes/ha, mm de pluie, prix).',
    trainingSources: 'NASA POWER, Copernicus ERA5, FAOSTAT, indices ONI / IOD.',
    implementation: 'Exporte un fichier JSON structuré pour les 119 districts (horizons 2027–2028).',
  },
  {
    component: '2. Fine-Tuning (LLM spécialisé)',
    role: 'Adapte le vocabulaire, les unités locales (kapoaka, vary aloha, kéré) et le raisonnement agronomique malgache.',
    trainingSources: 'Rapports historiques FOFIFA, lexiques agricoles malgaches/français, cas El Niño (1997, 2015, 2023).',
    implementation: 'Adaptation basse consommation (QLoRA / LoRA) sur Mistral-7B ou Llama-3-8B.',
  },
  {
    component: '3. Architecture RAG (Mémoire dynamique)',
    role: 'Injecte les faits en temps réel (arrêtés, coupures de routes, criquets) avant la rédaction de la synthèse.',
    trainingSources: 'Bulletins mensuels Météo Madagascar, rapports FEWS NET, alertes BNGRC, mercuriales OdR.',
    implementation: 'Découpage PDF en chunks (800 car.), embeddings multilingues et indexation FAISS / ChromaDB.',
  },
];

export const HYBRID_ORCHESTRATION_DEMOS: HybridOrchestrationDemo[] = [
  {
    id: 'ambatondrazaka',
    district: 'Ambatondrazaka',
    region: 'Alaotra-Mangoro',
    query: 'Quel est le risque pour la filière riz et l’approvisionnement en eau dans le district d’Ambatondrazaka en 2027 ?',
    xgboostJson: `{
  "district": "Ambatondrazaka",
  "lat": -17.83, "lon": 48.42,
  "oni_lag6": 3.2, "iod_lag4": 0.8,
  "prediction_2027": {
    "rendement_riz_delta": "-12.0 %",
    "deficit_hydrique_lac_alaotra": "-28.0 %",
    "prix_riz_local_pic_mga": 3200
  }
}`,
    ragExcerpts: [
      {
        source: 'Bulletin Météo Madagascar (Oct. 2026)',
        snippet: 'Démarrage tardif et irrégulier des pluies sur la cuvette du lac Alaotra ; déficit pluviométrique cumulé jusqu’en janvier 2027.',
      },
      {
        source: 'Note BNGRC / Observatoire du Riz (Nov. 2026)',
        snippet: 'Niveau bas des retenues alimentant les périmètres irrigués ; vigilance sur la spéculation et suivi des stocks par l’ANMCC.',
      },
    ],
    synthesizedPlan:
      'Avec un déficit hydrique projeté de -28 % sur le lac Alaotra et une baisse estimée de -12 % du rendement rizicole, la coopérative doit basculer vers le repiquage jeune SRI (plants de 8 à 12 jours) dès l’ouverture des vannes, éviter le semis précoce en vary aloha non sécurisé et déposer un dossier de micro-équipement au guichet FDA-R d’Alaotra-Mangoro.',
  },
  {
    id: 'ambovombe',
    district: 'Ambovombe',
    region: 'Androy',
    query: 'Quelles actions prioritaires pour la campagne 2027 à Ambovombe face au risque kéré ?',
    xgboostJson: `{
  "district": "Ambovombe",
  "lat": -25.18, "lon": 46.09,
  "oni_lag6": 3.5, "iod_lag4": 0.9,
  "prediction_2027": {
    "recharge_nappes_delta": "-48.0 %",
    "rendement_mais_delta": "-38.0 %",
    "phase_ipc_risque": "Phase 4 à 5 (T3 2027)"
  }
}`,
    ragExcerpts: [
      {
        source: 'Calendrier FOFIFA / DGM (26 Oct. 2026)',
        snippet: 'Attendre impérativement 20 à 30 mm de pluies cumulées sur 3 jours consécutifs (mi-décembre à janvier) ; privilégier sorgho et mil 90 jours.',
      },
      {
        source: 'Rapport FAO / PAM Sous-bureau Ambovombe',
        snippet: 'Extension des transferts Cash+ et distribution de semences résilientes à 32 000 producteurs ; alerte sur les prix du maïs et du manioc (kapoaka en hausse).',
      },
    ],
    synthesizedPlan:
      'Face à un déficit hydrique projeté de -48 % sur la recharge des nappes et une chute de -38 % du maïs traditionnel, abandonner le maïs pluvial au profit du sorgho/mil à cycle court (90 j) en poquets Zaï paillés avec pois d’Angole (ambatry), tout en raccordant la coopérative aux programmes DEFIS et PAM d’Ambovombe.',
  },
  {
    id: 'marovoay',
    district: 'Marovoay',
    region: 'Boeny',
    query: 'Comment sécuriser le riz vary jeby et anticiper le risque acridien à Marovoay en 2027–2028 ?',
    xgboostJson: `{
  "district": "Marovoay",
  "lat": -16.11, "lon": 46.64,
  "oni_lag6": 3.2, "iod_lag4": 0.8,
  "prediction_2027_2028": {
    "apport_betsiboka_2027": "-24.0 %",
    "risque_acridien_mars_juin_2027": "Élevé",
    "risque_inondation_la_nina_2028": "Critique (Janv.–Mars 2028)"
  }
}`,
    ragExcerpts: [
      {
        source: 'CirAE / DRAE Boeny (Campagne 2026–2027)',
        snippet: 'Curage prioritaire des canaux d’irrigation sur la plaine de Marovoay, appui engrais PURPA et veille antiacridienne préventive.',
      },
      {
        source: 'Modèle hydrologique ERA5 (Bassin Betsiboka)',
        snippet: 'Baisse des superficies de vary jeby entre mai et octobre 2027, suivie d’un risque de débordement brutal au T1 2028 lors de la transition La Niña.',
      },
    ],
    synthesizedPlan:
      'Décaler le semis pluvial vers décembre 2026, réaliser le curage des canaux avant l’étiage de la Betsiboka pour préserver le vary jeby, activer la surveillance antiacridienne entre mars et juin 2027 et préparer dès fin 2027 les digues de protection contre les crues attendues début 2028.',
  },
];

export const PYTHON_GEOBOUNDARIES_XGBOOST_SCRIPT = `import time
import requests
import pandas as pd
import geopandas as gpd
from xgboost import XGBRegressor
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV

# --- ÉTAPE 1 : TÉLÉCHARGEMENT AUTOMATIQUE DES 119 DISTRICTS (ADM2) ---
def recuperer_centroides_madagascar():
    # API officielle geoBoundaries pour Madagascar niveau ADM2 (Districts)
    api_gb = "https://www.geoboundaries.org/api/current/gbOpen/MDG/ADM2/"
    meta = requests.get(api_gb, timeout=30).json()
    geojson_url = meta["gjDownloadURL"]

    # Chargement spatial et calcul des centroïdes (Longitude / Latitude)
    gdf = gpd.read_file(geojson_url)
    gdf["lon"] = gdf.geometry.centroid.x.round(4)
    gdf["lat"] = gdf.geometry.centroid.y.round(4)

    df_districts = gdf[["shapeName", "shapeID", "lat", "lon"]].rename(columns={"shapeName": "District"})
    df_districts.to_csv("madagascar_119_districts.csv", index=False)
    return df_districts

# --- ÉTAPE 2 : BOUCLE D'EXTRACTION NASA POWER PAR DISTRICT ---
def collecter_climat_national(df_districts):
    toutes_donnees = []
    for _, row in df_districts.iterrows():
        url = (
            "https://power.larc.nasa.gov/api/temporal/monthly/point"
            f"?parameters=PRECTOTCORR,T2M_MAX,ALLSKY_SFC_SW_DWN"
            f"&community=AG&longitude={row['lon']}&latitude={row['lat']}"
            "&start=2010&end=2026&format=JSON"
        )
        res = requests.get(url, timeout=30).json()
        df_temp = pd.DataFrame(res["properties"]["parameter"])
        df_temp["District"] = row["District"]
        toutes_donnees.append(df_temp)
        time.sleep(0.5)  # Respect des limites de requêtes API
    return pd.concat(toutes_donnees)

# --- ÉTAPE 3 : HYPERPARAMÈTRES ANTI-SURAPPRENTISSAGE (SÉRIES COURTES) ---
def entrainer_modele_robuste(X, y):
    # Validation croisée temporelle stricte (jamais de mélange aléatoire sur des dates)
    tscv = TimeSeriesSplit(n_splits=4)

    modele_base = XGBRegressor(
        objective="reg:squarederror",
        random_state=42,
        early_stopping_rounds=15  # Arrêt automatique si l'erreur de validation remonte
    )

    # Grille d'hyperparamètres fortement régularisée
    grille_params = {
        "max_depth": [2, 3],               # Arbres très peu profonds (évite la mémorisation)
        "min_child_weight": [3, 5, 8],     # Exige plusieurs observations par feuille
        "learning_rate": [0.01, 0.03],     # Apprentissage lent et progressif
        "n_estimators": [100, 150, 200],   # Nombre limité d'arbres
        "subsample": [0.7, 0.8],           # Échantillonnage aléatoire des années (bagging)
        "colsample_bytree": [0.7, 0.8],    # Échantillonnage des variables météo
        "reg_alpha": [0.5, 1.0, 2.0],      # Régularisation L1 (Lasso : élimine le bruit)
        "reg_lambda": [2.0, 5.0, 10.0]     # Régularisation L2 (Ridge : lisse les poids)
    }

    recherche = RandomizedSearchCV(
        estimator=modele_base,
        param_distributions=grille_params,
        n_iter=20,
        cv=tscv,
        scoring="neg_root_mean_squared_error",
        n_jobs=-1,
        random_state=42
    )

    # Séparation chronologique pour l'early stopping (80% passé, 20% récent)
    split_idx = int(len(X) * 0.8)
    recherche.fit(
        X.iloc[:split_idx], y.iloc[:split_idx],
        eval_set=[(X.iloc[split_idx:], y.iloc[split_idx:])],
        verbose=False
    )
    return recherche.best_estimator_`;

export const PYTHON_RAG_FAISS_SCRIPT = `from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# 1. Chargement et découpage des bulletins officiels (Météo Madagascar, FAO, FEWS NET)
loader = PyPDFDirectoryLoader("./bulletins_madagascar_2026/")
documents = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
chunks = splitter.split_documents(documents)

# 2. Vectorisation multilingue (supporte le français et le malgache)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)
vector_db = FAISS.from_documents(chunks, embeddings)

# 3. Fonction de croisement : Prédiction XGBoost + Contexte RAG
def generer_diagnostic_district(district, prediction_xgboost):
    requete = f"Risque sécheresse agriculture eau {district} 2027"
    contextes = vector_db.similarity_search(requete, k=3)
    texte_rag = "\\n".join([doc.page_content for doc in contextes])

    prompt_final = f"""
    [DONNÉES PRÉDICTIVES XGBOOST - {district.upper()} 2027]
    {prediction_xgboost}

    [BULLETINS OFFICIELS RÉCENTS (RAG)]
    {texte_rag}

    Tâche : Rédige une recommandation agronomique et économique opérationnelle pour ce district.
    """
    return prompt_final  # À transmettre ensuite à votre modèle Fine-Tuné (API locale Ollama/vLLM)`;

export interface DistrictPredictionPoint {
  district: string;
  geoBoundariesName: string;
  region: string;
  profile: 'Grand Sud & Sud-Ouest' | 'Centre & Hydroélectricité' | 'Nord-Ouest Alluvial' | 'Côtiers Nord & Est';
  lat: number;
  lon: number;
  water2027: number;
  water2028: number;
  rice2027: number;
  rice2028: number;
  maize2027: number;
  maize2028: number;
  exportCrop2027: number;
  exportCrop2028: number;
  riskTier: 'drought' | 'mixed' | 'flood';
  ragNotes: string[];
}

export const DISTRICT_CHOROPLETH_DATA: DistrictPredictionPoint[] = [
  {
    district: 'Ambovombe',
    geoBoundariesName: 'Ambovombe-Androy',
    region: 'Androy',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -25.18,
    lon: 46.09,
    water2027: -48,
    water2028: 18,
    rice2027: -24,
    rice2028: 14,
    maize2027: -38,
    maize2028: 28,
    exportCrop2027: -16,
    exportCrop2028: 15,
    riskTier: 'drought',
    ragNotes: [
      'FOFIFA/DGM (26 Oct 2026) : Reporter les semis à mi-décembre–janvier après 20–30 mm sur 3 jours ; privilégier sorgho/mil 90 j.',
      'FAO / PAM Ambovombe : Insécurité alimentaire critique (IPC Phase 4–5 T3 2027), transferts Cash+ et semences résilientes.',
    ],
  },
  {
    district: 'Tsihombe',
    geoBoundariesName: 'Tsihombe',
    region: 'Androy',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -25.30,
    lon: 45.48,
    water2027: -52,
    water2028: 16,
    rice2027: -25,
    rice2028: 12,
    maize2027: -40,
    maize2028: 26,
    exportCrop2027: -18,
    exportCrop2028: 14,
    riskTier: 'drought',
    ragNotes: [
      'Assèchement précoce des nappes et fleuve Menarandra dès mai 2027 ; risque de crues éclair au T1 2028.',
      'Technique Zaï (poquets 20 cm avec compost) + haies de pois d’Angole et sisal contre l’ensablement.',
    ],
  },
  {
    district: 'Beloha',
    geoBoundariesName: 'Beloha',
    region: 'Androy',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -25.17,
    lon: 45.06,
    water2027: -50,
    water2028: 15,
    rice2027: -22,
    rice2028: 11,
    maize2027: -39,
    maize2028: 25,
    exportCrop2027: -17,
    exportCrop2028: 14,
    riskTier: 'drought',
    ragNotes: [
      'Déficit de -35 % à -55 % sur les nappes superficielles ; alerte abreuvement bétail et risque kéré.',
      'Substitution maïs par mil/sorgho 90 j et niébé rampant en association.',
    ],
  },
  {
    district: 'Bekily',
    geoBoundariesName: 'Bekily',
    region: 'Androy',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -24.22,
    lon: 45.32,
    water2027: -42,
    water2028: 20,
    rice2027: -19,
    rice2028: 15,
    maize2027: -34,
    maize2028: 27,
    exportCrop2027: -14,
    exportCrop2028: 16,
    riskTier: 'drought',
    ragNotes: [
      'Soudure précoce T3 2027 ; enregistrement coopératives auprès de la CirAE pour kits PURPA et appui DEFIS.',
    ],
  },
  {
    district: 'Amboasary-Atsimo',
    geoBoundariesName: 'Amboasary Atsimo',
    region: 'Anosy',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -25.04,
    lon: 46.39,
    water2027: -45,
    water2028: 18,
    rice2027: -22,
    rice2028: 13,
    maize2027: -36,
    maize2028: 26,
    exportCrop2027: -15,
    exportCrop2028: 14,
    riskTier: 'drought',
    ragNotes: [
      'Vigilance maximale Anosy : déficit hydrique sur le bassin du Mandrare, protection des pâturages et accès eau potable.',
    ],
  },
  {
    district: 'Taolagnaro',
    geoBoundariesName: 'Taolagnaro',
    region: 'Anosy',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -25.03,
    lon: 46.99,
    water2027: -24,
    water2028: 20,
    rice2027: -14,
    rice2028: 13,
    maize2027: -22,
    maize2028: 21,
    exportCrop2027: -11,
    exportCrop2028: 15,
    riskTier: 'mixed',
    ragNotes: [
      'Contraste marqué entre l’Ouest aride d’Anosy et le littoral humide de Taolagnaro ; gestion des stocks et logistique portuaire.',
    ],
  },
  {
    district: 'Ampanihy',
    geoBoundariesName: 'Ampanihy Ouest',
    region: 'Atsimo-Andrefana',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -24.69,
    lon: 44.75,
    water2027: -46,
    water2028: 19,
    rice2027: -21,
    rice2028: 13,
    maize2027: -37,
    maize2028: 26,
    exportCrop2027: -15,
    exportCrop2028: 15,
    riskTier: 'drought',
    ragNotes: [
      'Assèchement précoce Menarandra ; paillage intensif et boutures de manioc tolérantes au stress hydrique.',
    ],
  },
  {
    district: 'Betioky',
    geoBoundariesName: 'Betioky Atsimo',
    region: 'Atsimo-Andrefana',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -23.72,
    lon: 44.38,
    water2027: -40,
    water2028: 21,
    rice2027: -17,
    rice2028: 14,
    maize2027: -33,
    maize2028: 27,
    exportCrop2027: -13,
    exportCrop2028: 16,
    riskTier: 'drought',
    ragNotes: [
      'Baisse critique du fleuve Onilahy à partir de mai 2027 ; chantiers HIMO de réhabilitation hydraulique.',
    ],
  },
  {
    district: 'Toliara II',
    geoBoundariesName: 'Toliara-II',
    region: 'Atsimo-Andrefana',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -23.35,
    lon: 43.67,
    water2027: -38,
    water2028: 22,
    rice2027: -16,
    rice2028: 15,
    maize2027: -31,
    maize2028: 25,
    exportCrop2027: -12,
    exportCrop2028: 15,
    riskTier: 'drought',
    ragNotes: [
      'Sous-bureau PAM Toliara actif ; protection des parcelles côtières par haies vives de sisal et cactus sans épines.',
    ],
  },
  {
    district: 'Morombe',
    geoBoundariesName: 'Morombe',
    region: 'Atsimo-Andrefana',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -21.74,
    lon: 43.36,
    water2027: -36,
    water2028: 20,
    rice2027: -15,
    rice2028: 14,
    maize2027: -29,
    maize2028: 24,
    exportCrop2027: -11,
    exportCrop2028: 14,
    riskTier: 'drought',
    ragNotes: [
      'Déficit pluviométrique -30 % à -45 % ; micro-irrigation goutte-à-goutte et pois d’Angole.',
    ],
  },
  {
    district: 'Ihosy',
    geoBoundariesName: 'Ihosy',
    region: 'Ihorombe',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -22.40,
    lon: 46.13,
    water2027: -33,
    water2028: 19,
    rice2027: -15,
    rice2028: 14,
    maize2027: -28,
    maize2028: 23,
    exportCrop2027: -11,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Plateau de l’Ihorombe : dégradation des pâturages, baisse des rendements vivriers et besoin de points d’eau pastoraux.',
    ],
  },
  {
    district: 'Morondava',
    geoBoundariesName: 'Morondava',
    region: 'Menabe',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -20.29,
    lon: 44.28,
    water2027: -30,
    water2028: 22,
    rice2027: -13,
    rice2028: 15,
    maize2027: -25,
    maize2028: 24,
    exportCrop2027: -10,
    exportCrop2028: 15,
    riskTier: 'mixed',
    ragNotes: [
      'Menabe littoral : déficit pluviométrique modéré à élevé, fortes chaleurs et gestion des périmètres irrigués de Dabara.',
    ],
  },
  {
    district: 'Belo-sur-Tsiribihina',
    geoBoundariesName: 'Belo sur Tsiribihina',
    region: 'Menabe',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -19.70,
    lon: 44.54,
    water2027: -32,
    water2028: 24,
    rice2027: -13,
    rice2028: 15,
    maize2027: -26,
    maize2028: 24,
    exportCrop2027: -10,
    exportCrop2028: 15,
    riskTier: 'mixed',
    ragNotes: [
      'Retard des pluies sur le Menabe et vagues de chaleur +2 à +4 °C ; surveillance acridienne mars–juin 2027.',
    ],
  },
  {
    district: 'Miandrivazo',
    geoBoundariesName: 'Miandrivazo',
    region: 'Menabe',
    profile: 'Grand Sud & Sud-Ouest',
    lat: -19.52,
    lon: 45.46,
    water2027: -31,
    water2028: 21,
    rice2027: -14,
    rice2028: 14,
    maize2027: -26,
    maize2028: 23,
    exportCrop2027: -11,
    exportCrop2028: 15,
    riskTier: 'mixed',
    ragNotes: [
      'District pilote Menabe intérieur : stress thermique élevé sur maïs et riz de plaine ; gestion des bassins de la Tsiribihina.',
    ],
  },
  {
    district: 'Ambatondrazaka',
    geoBoundariesName: 'Ambatondrazaka',
    region: 'Alaotra-Mangoro',
    profile: 'Centre & Hydroélectricité',
    lat: -17.83,
    lon: 48.42,
    water2027: -28,
    water2028: 19,
    rice2027: -12,
    rice2028: 14,
    maize2027: -18,
    maize2028: 22,
    exportCrop2027: -10,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Cuvette du lac Alaotra : remplissage bas en 2027 puis rebond +10 à +15 % en 2028 avec vigilance inondations.',
      'Privilégier SRI/SRA (repiquage 8–12 j) et stockage coopératif face au pic du riz à 3 200 MGA/kg.',
    ],
  },
  {
    district: 'Amparafaravola',
    geoBoundariesName: 'Amparafaravola',
    region: 'Alaotra-Mangoro',
    profile: 'Centre & Hydroélectricité',
    lat: -17.58,
    lon: 48.22,
    water2027: -26,
    water2028: 21,
    rice2027: -11,
    rice2028: 15,
    maize2027: -17,
    maize2028: 21,
    exportCrop2027: -9,
    exportCrop2028: 13,
    riskTier: 'mixed',
    ragNotes: [
      'Grand périmètre du lac Alaotra : tension hydrique de contre-saison 2027 ; retour au plein remplissage T1 2028.',
    ],
  },
  {
    district: 'Moramanga',
    geoBoundariesName: 'Moramanga',
    region: 'Alaotra-Mangoro',
    profile: 'Centre & Hydroélectricité',
    lat: -18.95,
    lon: 48.23,
    water2027: -29,
    water2028: 18,
    rice2027: -10,
    rice2028: 12,
    maize2027: -16,
    maize2028: 20,
    exportCrop2027: -11,
    exportCrop2028: 15,
    riskTier: 'mixed',
    ragNotes: [
      'Bassin Vohitra / barrage d’Andekaleka : étiage historiquement bas juil.–nov. 2027 pesant sur le RIA.',
    ],
  },
  {
    district: 'Antananarivo-Atsimondrano',
    geoBoundariesName: 'Antananarivo Atsimondrano',
    region: 'Analamanga',
    profile: 'Centre & Hydroélectricité',
    lat: -18.96,
    lon: 47.49,
    water2027: -22,
    water2028: 16,
    rice2027: -11,
    rice2028: 13,
    maize2027: -15,
    maize2028: 20,
    exportCrop2027: -8,
    exportCrop2028: 12,
    riskTier: 'mixed',
    ragNotes: [
      'Plaine de l’Ikopa : déficit hydrique jusqu’en janv. 2027 puis pluies tardives fév.–avr. ; contrôle prix ANMCC et riz tampon.',
    ],
  },
  {
    district: 'Antsirabe II',
    geoBoundariesName: 'Antsirabe II',
    region: 'Vakinankaratra',
    profile: 'Centre & Hydroélectricité',
    lat: -19.86,
    lon: 47.03,
    water2027: -20,
    water2028: 17,
    rice2027: -13,
    rice2028: 14,
    maize2027: -19,
    maize2028: 23,
    exportCrop2027: -9,
    exportCrop2028: 13,
    riskTier: 'mixed',
    ragNotes: [
      'Hautes Terres : semis pluvial tanety mi-nov. à mi-déc. (variétés 110–120 j) sous SCV + bandes Brachiaria/Vétiver.',
    ],
  },
  {
    district: 'Miarinarivo',
    geoBoundariesName: 'Miarinarivo',
    region: 'Itasy',
    profile: 'Centre & Hydroélectricité',
    lat: -18.96,
    lon: 46.90,
    water2027: -23,
    water2028: 18,
    rice2027: -12,
    rice2028: 13,
    maize2027: -18,
    maize2028: 22,
    exportCrop2027: -9,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Association maïs–haricot grimpant ou soja en semis direct SCV (appui GSDM).',
    ],
  },
  {
    district: 'Tsiroanomandidy',
    geoBoundariesName: 'Tsiroanomandidy',
    region: 'Bongolava',
    profile: 'Centre & Hydroélectricité',
    lat: -18.77,
    lon: 46.05,
    water2027: -25,
    water2028: 20,
    rice2027: -14,
    rice2028: 14,
    maize2027: -21,
    maize2028: 24,
    exportCrop2027: -10,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Moyen-Ouest : retard des pluies sur tanety et baisse du débit de la Mania ; variétés cycle intermédiaire.',
    ],
  },
  {
    district: 'Ambositra',
    geoBoundariesName: 'Ambositra',
    region: "Amoron'i Mania",
    profile: 'Centre & Hydroélectricité',
    lat: -20.53,
    lon: 47.24,
    water2027: -21,
    water2028: 17,
    rice2027: -12,
    rice2028: 13,
    maize2027: -18,
    maize2028: 21,
    exportCrop2027: -8,
    exportCrop2028: 13,
    riskTier: 'mixed',
    ragNotes: [
      'Amoron’i Mania : irrégularité pluviométrique et perturbation des semis rizicoles de terrasse.',
    ],
  },
  {
    district: 'Fianarantsoa',
    geoBoundariesName: 'Fianarantsoa I',
    region: 'Haute Matsiatra',
    profile: 'Centre & Hydroélectricité',
    lat: -21.45,
    lon: 47.09,
    water2027: -24,
    water2028: 19,
    rice2027: -13,
    rice2028: 14,
    maize2027: -20,
    maize2028: 22,
    exportCrop2027: -9,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Haute Matsiatra : retard des cultures, stress hydrique et surveillance des pâturages d’altitude.',
    ],
  },
  {
    district: 'Marovoay',
    geoBoundariesName: 'Marovoay',
    region: 'Boeny',
    profile: 'Nord-Ouest Alluvial',
    lat: -16.11,
    lon: 46.64,
    water2027: -24,
    water2028: 26,
    rice2027: -10,
    rice2028: 15,
    maize2027: -19,
    maize2028: 21,
    exportCrop2027: -9,
    exportCrop2028: 13,
    riskTier: 'mixed',
    ragNotes: [
      'Plaine de Marovoay : déficit Betsiboka sur vary jeby (mai–oct 2027) et veille acridienne ; risque inondation T1 2028.',
    ],
  },
  {
    district: 'Mitsinjo',
    geoBoundariesName: 'Mitsinjo',
    region: 'Boeny',
    profile: 'Nord-Ouest Alluvial',
    lat: -16.00,
    lon: 45.87,
    water2027: -22,
    water2028: 25,
    rice2027: -9,
    rice2028: 14,
    maize2027: -17,
    maize2028: 20,
    exportCrop2027: -8,
    exportCrop2028: 12,
    riskTier: 'mixed',
    ragNotes: [
      'Décaler semis riz pluvial et arachide en décembre ; curage canaux et engrais subventionnés CirAE/PURPA.',
    ],
  },
  {
    district: 'Ambato-Boeny',
    geoBoundariesName: 'Ambato Boeny',
    region: 'Boeny',
    profile: 'Nord-Ouest Alluvial',
    lat: -16.47,
    lon: 46.71,
    water2027: -25,
    water2028: 24,
    rice2027: -11,
    rice2028: 14,
    maize2027: -20,
    maize2028: 22,
    exportCrop2027: -10,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Retard de mousson et vagues de chaleur ; surveillance criquets mars–juin 2027.',
    ],
  },
  {
    district: 'Maevatanana',
    geoBoundariesName: 'Maevatanana',
    region: 'Betsiboka',
    profile: 'Nord-Ouest Alluvial',
    lat: -16.95,
    lon: 46.83,
    water2027: -27,
    water2028: 22,
    rice2027: -12,
    rice2028: 13,
    maize2027: -22,
    maize2028: 22,
    exportCrop2027: -11,
    exportCrop2028: 14,
    riskTier: 'mixed',
    ragNotes: [
      'Bassin Betsiboka : déficit hydrique initial puis débordements possibles début 2028 sous La Niña.',
    ],
  },
  {
    district: 'Antsohihy',
    geoBoundariesName: 'Antsohihy',
    region: 'Sofia',
    profile: 'Nord-Ouest Alluvial',
    lat: -14.88,
    lon: 47.99,
    water2027: -18,
    water2028: 23,
    rice2027: -9,
    rice2028: 14,
    maize2027: -16,
    maize2028: 20,
    exportCrop2027: -8,
    exportCrop2028: 14,
    riskTier: 'flood',
    ragNotes: [
      'Bassin de la Sofia : décalage des semis vers décembre ; riz pluvial et arachide en bandes alternées.',
    ],
  },
  {
    district: 'Port-Bergé',
    geoBoundariesName: 'Boriziny (Port-Bergé)',
    region: 'Sofia',
    profile: 'Nord-Ouest Alluvial',
    lat: -15.57,
    lon: 47.62,
    water2027: -20,
    water2028: 24,
    rice2027: -10,
    rice2028: 15,
    maize2027: -18,
    maize2028: 21,
    exportCrop2027: -9,
    exportCrop2028: 14,
    riskTier: 'flood',
    ragNotes: [
      'Risque élevé d’inondation bas-fonds Sofia entre janvier et mars 2028.',
    ],
  },
  {
    district: 'Antsiranana II',
    geoBoundariesName: 'Antsiranana II',
    region: 'Diana',
    profile: 'Côtiers Nord & Est',
    lat: -12.35,
    lon: 49.29,
    water2027: 22,
    water2028: 18,
    rice2027: -4,
    rice2028: 11,
    maize2027: -6,
    maize2028: 15,
    exportCrop2027: -12,
    exportCrop2028: 9,
    riskTier: 'flood',
    ragNotes: [
      'Excédent pluviométrique nov. 2026–janv. 2027 : semer tôt en novembre sur parcelles drainées.',
    ],
  },
  {
    district: 'Ambilobe',
    geoBoundariesName: 'Ambilobe',
    region: 'Diana',
    profile: 'Côtiers Nord & Est',
    lat: -13.20,
    lon: 49.05,
    water2027: 24,
    water2028: 20,
    rice2027: -5,
    rice2028: 12,
    maize2027: -7,
    maize2028: 16,
    exportCrop2027: -13,
    exportCrop2028: 10,
    riskTier: 'flood',
    ragNotes: [
      'Pré-positionnement vivres BNGRC et curage évacuations contre crues localisées nov.–janv.',
    ],
  },
  {
    district: 'Nosy Be',
    geoBoundariesName: 'Nosy-Be',
    region: 'Diana',
    profile: 'Côtiers Nord & Est',
    lat: -13.33,
    lon: 48.27,
    water2027: 21,
    water2028: 19,
    rice2027: -4,
    rice2028: 10,
    maize2027: -5,
    maize2028: 13,
    exportCrop2027: -11,
    exportCrop2028: 10,
    riskTier: 'flood',
    ragNotes: [
      'Vigilance côtière et pluies intenses sur Diana ; protection des cultures d’ylang-ylang et voirie.',
    ],
  },
  {
    district: 'Sambava',
    geoBoundariesName: 'Sambava',
    region: 'Sava',
    profile: 'Côtiers Nord & Est',
    lat: -14.27,
    lon: 50.17,
    water2027: 26,
    water2028: 19,
    rice2027: -6,
    rice2028: 11,
    maize2027: -8,
    maize2028: 14,
    exportCrop2027: -16,
    exportCrop2028: 7,
    riskTier: 'flood',
    ragNotes: [
      'Vanille SAVA : fortes pluies fin 2026 + pic thermique début 2027 (risque coulure et Fusarium) ; ombrage Gliricidia.',
    ],
  },
  {
    district: 'Antalaha',
    geoBoundariesName: 'Antalaha',
    region: 'Sava',
    profile: 'Côtiers Nord & Est',
    lat: -14.90,
    lon: 50.28,
    water2027: 25,
    water2028: 21,
    rice2027: -6,
    rice2028: 10,
    maize2027: -8,
    maize2028: 14,
    exportCrop2027: -15,
    exportCrop2028: 6,
    riskTier: 'flood',
    ragNotes: [
      'Stabilisation vanille attendue en 2028 sous réserve d’absence de cyclone majeur début 2028.',
    ],
  },
  {
    district: 'Fénérive-Est',
    geoBoundariesName: 'Fenoarivo Atsinanana',
    region: 'Analanjirofo',
    profile: 'Côtiers Nord & Est',
    lat: -17.38,
    lon: 49.41,
    water2027: 20,
    water2028: 24,
    rice2027: -8,
    rice2028: 12,
    maize2027: -11,
    maize2028: 16,
    exportCrop2027: -14,
    exportCrop2028: 16,
    riskTier: 'flood',
    ragNotes: [
      'Analanjirofo : excès de pluie et inondations sur girofle/litchi ; entretien des drains de bas-fonds.',
    ],
  },
  {
    district: 'Maroantsetra',
    geoBoundariesName: 'Maroantsetra',
    region: 'Ambatosoa',
    profile: 'Côtiers Nord & Est',
    lat: -15.43,
    lon: 49.74,
    water2027: 18,
    water2028: 24,
    rice2027: -7,
    rice2028: 11,
    maize2027: -10,
    maize2028: 16,
    exportCrop2027: -14,
    exportCrop2028: 16,
    riskTier: 'flood',
    ragNotes: [
      'Exposition humidité excessive 2027 sur vanille/cacao et retour cyclonique potentiel janv.–avr. 2028.',
    ],
  },
  {
    district: 'Toamasina II',
    geoBoundariesName: 'Toamasina II',
    region: 'Atsinanana',
    profile: 'Côtiers Nord & Est',
    lat: -18.14,
    lon: 49.35,
    water2027: -12,
    water2028: 22,
    rice2027: -9,
    rice2028: 13,
    maize2027: -14,
    maize2028: 19,
    exportCrop2027: -16,
    exportCrop2028: 19,
    riskTier: 'flood',
    ragNotes: [
      'Stress hydrique/thermique 2027 sur litchi et girofle (-10 à -20 % export) puis forte reprise cyclique en 2028.',
    ],
  },
  {
    district: 'Brickaville',
    geoBoundariesName: 'Vohibinany (Brickaville)',
    region: 'Atsinanana',
    profile: 'Côtiers Nord & Est',
    lat: -18.82,
    lon: 49.07,
    water2027: 16,
    water2028: 26,
    rice2027: -9,
    rice2028: 12,
    maize2027: -13,
    maize2028: 18,
    exportCrop2027: -15,
    exportCrop2028: 17,
    riskTier: 'flood',
    ragNotes: [
      'District pilote côte Est (Atsinanana) : crues de la Rianila/Iaroka et protection des ouvrages routiers et cultures de rente.',
    ],
  },
  {
    district: 'Mananjary',
    geoBoundariesName: 'Mananjary',
    region: 'Vatovavy',
    profile: 'Côtiers Nord & Est',
    lat: -21.23,
    lon: 48.34,
    water2027: -15,
    water2028: 25,
    rice2027: -11,
    rice2028: 14,
    maize2027: -17,
    maize2028: 20,
    exportCrop2027: -15,
    exportCrop2028: 18,
    riskTier: 'flood',
    ragNotes: [
      'Début sec puis retour brutal des pluies fév.–avr. 2027 exposant les bas-fonds (café, girofle, poivre).',
    ],
  },
  {
    district: 'Manakara',
    geoBoundariesName: 'Manakara Atsimo',
    region: 'Fitovinany',
    profile: 'Côtiers Nord & Est',
    lat: -22.14,
    lon: 48.01,
    water2027: -16,
    water2028: 24,
    rice2027: -12,
    rice2028: 14,
    maize2027: -18,
    maize2028: 21,
    exportCrop2027: -15,
    exportCrop2028: 18,
    riskTier: 'flood',
    ragNotes: [
      'Sous-bureau PAM Manakara & Projet DEFIS : cantines scolaires et HIMO de drainage/réhabilitation.',
    ],
  },
  {
    district: 'Farafangana',
    geoBoundariesName: 'Farafangana',
    region: 'Atsimo-Atsinanana',
    profile: 'Côtiers Nord & Est',
    lat: -22.82,
    lon: 47.83,
    water2027: -18,
    water2028: 23,
    rice2027: -13,
    rice2028: 13,
    maize2027: -20,
    maize2028: 22,
    exportCrop2027: -14,
    exportCrop2028: 17,
    riskTier: 'mixed',
    ragNotes: [
      'Déficit hydrique cumulé puis risque d’inondation côtière sur cultures de rente (café Robusta, poivre).',
    ],
  },
  {
    district: 'Vangaindrano',
    geoBoundariesName: 'Vangaindrano',
    region: 'Atsimo-Atsinanana',
    profile: 'Côtiers Nord & Est',
    lat: -23.35,
    lon: 47.60,
    water2027: -22,
    water2028: 21,
    rice2027: -14,
    rice2028: 14,
    maize2027: -23,
    maize2028: 23,
    exportCrop2027: -14,
    exportCrop2028: 16,
    riskTier: 'drought',
    ragNotes: [
      'Atsimo-Atsinanana Sud : alternance de poches de déficit et de pluies irrégulières fragilisant les cultures vivrières.',
    ],
  },
];

export const QLORA_HYPERPARAMS = [
  { param: 'Quantification', value: 'load_in_4bit = True (format nf4)', detail: 'Compatible GPU T4 16 Go (Colab / serveur local)' },
  { param: 'Rang & Alpha LoRA', value: 'r = 16, lora_alpha = 32, lora_dropout = 0.05', detail: 'Adaptation ciblée sans altérer les poids de base' },
  { param: 'Modules cibles', value: 'q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj', detail: 'Couches d’attention et MLP (Mistral-7B / Llama-3-8B)' },
  { param: 'Époques', value: 'num_train_epochs = 3', detail: 'Évite la mémorisation par cœur des chiffres de prédiction' },
];

export const PYTHON_QLORA_JSONL_SCRIPT = `import json
import pandas as pd

def generer_dataset_qlora(fichier_predictions_csv, fichier_sortie_jsonl="madagascar_elnino_qlora.jsonl"):
    # Colonnes attendues : District, Region, Filiere, Annee, Variation_Rendement_Pct, Deficit_Eau_Pct, Indice_ONI
    df = pd.read_csv(fichier_predictions_csv)

    system_prompt = (
        "Tu es un ingénieur agronome et économiste expert de Madagascar, spécialisé dans "
        "l'adaptation au phénomène El Niño. Tu analyses les prédictions climatiques par district "
        "et proposes des recommandations techniques précises basées sur les référentiels du FOFIFA et du MINAE."
    )

    exemples_jsonl = []

    for _, row in df.iterrows():
        district = row["District"]
        region = row["Region"]
        filiere = row["Filiere"]
        annee = row["Annee"]
        rendement = row["Variation_Rendement_Pct"]
        eau = row["Deficit_Eau_Pct"]
        oni = row["Indice_ONI"]

        if rendement < -15:
            niveau_alerte = "CRITIQUE (Risque élevé de pertes et de flambée des prix)"
            action_technique = (
                f"Décaler les semis pluviaux de 3 semaines, basculer vers des variétés à cycle court "
                f"résistantes au stress hydrique (sorgho, mil, niébé) et appliquer le paillage (SCV) "
                f"pour compenser le déficit hydrique estimé à {abs(eau)}%."
            )
        elif rendement < 0:
            niveau_alerte = "MODÉRÉ À ÉLEVÉ (Tension sur les rendements et les stocks)"
            action_technique = (
                "Optimiser l'irrigation via le repiquage jeune (méthode SRI/SRA), curer les canaux "
                "en amont et constituer des greniers communautaires villageois (GCV)."
            )
        else:
            niveau_alerte = "FAVORABLE (Rebond productif attendu - transition neutre/La Niña)"
            action_technique = (
                "Sécuriser les semences certifiées pour maximiser les emblavures, tout en renforçant "
                "le drainage des bas-fonds contre les risques d'excès pluviométriques."
            )

        user_msg = (
            f"Analyse l'impact prévu pour la filière {filiere} dans le district de {district} "
            f"(région {region}) en {annee}. Les données du modèle indiquent un indice ONI de {oni:+.1f}, "
            f"une variation de rendement de {rendement:+.1f}% et une anomalie hydrique de {eau:+.1f}%."
        )

        assistant_msg = (
            f"### Diagnostic Agronomique et Économique : {district} ({annee})\\n"
            f"- **Niveau de risque :** {niveau_alerte}.\\n"
            f"- **Impact filière ({filiere}) :** Variation projetée de {rendement:+.1f}% par rapport à la moyenne décennale.\\n"
            f"- **Recommandation opérationnelle :** {action_technique}"
        )

        enregistrement = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg},
                {"role": "assistant", "content": assistant_msg}
            ]
        }
        exemples_jsonl.append(enregistrement)

    with open(fichier_sortie_jsonl, "w", encoding="utf-8") as f:
        for item in exemples_jsonl:
            f.write(json.dumps(item, ensure_ascii=False) + "\\n")

    print(f"Dataset généré avec succès : {len(exemples_jsonl)} exemples dans {fichier_sortie_jsonl}")`;

export const PYTHON_FOLIUM_MAP_SCRIPT = `import requests
import pandas as pd
import geopandas as gpd
import folium

def generer_carte_interactive_madagascar(fichier_predictions_csv, annee_cible=2027, filiere_cible="Riz"):
    # 1. Récupération des polygones des 119 districts (ADM2) via geoBoundaries
    api_gb = "https://www.geoboundaries.org/api/current/gbOpen/MDG/ADM2/"
    geojson_url = requests.get(api_gb, timeout=30).json()["gjDownloadURL"]
    gdf_districts = gpd.read_file(geojson_url)

    # 2. Chargement, normalisation et filtrage des prédictions XGBoost
    df_pred = pd.read_csv(fichier_predictions_csv)
    df_filtre = df_pred[(df_pred["Annee"] == annee_cible) & (df_pred["Filiere"] == filiere_cible)]

    gdf_carte = gdf_districts.merge(df_filtre, left_on="shapeName_norm", right_on="District_norm", how="left")

    # 3. Initialisation de la carte centrée sur Madagascar
    carte = folium.Map(location=[-19.0, 46.8], zoom_start=6, tiles="CartoDB positron")

    # 4. Couche choroplèthe (Rouge = Chute sévère, Jaune = Stable, Vert = Rebond)
    folium.Choropleth(
        geo_data=gdf_carte.to_json(),
        name=f"Impact {filiere_cible} {annee_cible}",
        data=gdf_carte,
        columns=["shapeName", "Variation_Rendement_Pct"],
        key_on="feature.properties.shapeName",
        fill_color="RdYlGn",
        fill_opacity=0.75,
        line_opacity=0.4,
        nan_fill_color="lightgray",
        legend_name=f"Variation prévue du rendement ({filiere_cible} - {annee_cible}) en %"
    ).add_to(carte)

    # 5. Infobulles interactives (Tooltip + Popup)
    style_fn = lambda x: {"fillColor": "#ffffff", "color": "#000000", "fillOpacity": 0.0, "weight": 0.5}
    highlight_fn = lambda x: {"fillColor": "#000000", "color": "#000000", "fillOpacity": 0.2, "weight": 2}

    couche_info = folium.GeoJson(
        gdf_carte,
        style_function=style_fn,
        highlight_function=highlight_fn,
        tooltip=folium.GeoJsonTooltip(
            fields=["shapeName", "Region", "Variation_Rendement_Pct", "Deficit_Eau_Pct"],
            aliases=["District :", "Région :", "Rendement (%) :", "Anomalie Eau (%) :"],
            localize=True
        ),
        popup=folium.GeoJsonPopup(
            fields=["shapeName", "Filiere", "Annee", "Variation_Rendement_Pct", "Recommandation_RAG"],
            aliases=["District", "Filière", "Année", "Impact (%)", "Action recommandée"],
            localize=True
        )
    )
    carte.add_child(couche_info)
    folium.LayerControl().add_to(carte)

    nom_fichier = f"carte_elnino_madagascar_{filiere_cible}_{annee_cible}.html"
    carte.save(nom_fichier)
    return carte`;

export const PYTHON_DISTRICT_NORMALIZER_SCRIPT = `import re
import unicodedata
from difflib import get_close_matches

# Dictionnaire des variantes fréquentes entre geoBoundaries (ADM2) et Météo Madagascar / FAOSTAT
ALIAS_DISTRICTS_MDG = {
    "toliary i": "toliara i",
    "toliary ii": "toliara ii",
    "toliara 2": "toliara ii",
    "ambovombe androy": "ambovombe",
    "ambovombe-androy": "ambovombe",
    "port berge": "boriziny",
    "port-berge": "boriziny",
    "belo sur tsiribihina": "belo-sur-tsiribihina",
    "antananarivo atsimondrano": "antananarivo-atsimondrano",
    "antananarivo avaradrano": "antananarivo-avaradrano",
    "ambato boeny": "ambato-boeny",
    "ampanihy ouest": "ampanihy",
    "betioky atsimo": "betioky",
    "manakara atsimo": "manakara",
}

def normaliser_nom_district(nom: str) -> str:
    # 1. Suppression des accents et mise en minuscules
    texte = unicodedata.normalize("NFKD", str(nom)).encode("ascii", "ignore").decode("ascii")
    texte = re.sub(r"[-_]+", " ", texte.lower()).strip()
    texte = re.sub(r"\\s+", " ", texte)
    # 2. Application des alias officiels
    return ALIAS_DISTRICTS_MDG.get(texte, texte)

def apparier_100_pct(df_csv, gdf_geoboundaries):
    df_csv["District_norm"] = df_csv["District"].apply(normaliser_nom_district)
    gdf_geoboundaries["shapeName_norm"] = gdf_geoboundaries["shapeName"].apply(normaliser_nom_district)

    cibles = gdf_geoboundaries["shapeName_norm"].tolist()
    # Correction floue de repli pour les 119 districts
    df_csv["District_norm"] = df_csv["District_norm"].apply(
        lambda x: x if x in cibles else (get_close_matches(x, cibles, n=1, cutoff=0.78) or [x])[0]
    )
    return gdf_geoboundaries.merge(df_csv, left_on="shapeName_norm", right_on="District_norm", how="left")`;

// --- ATLAS NATIONAL EL NIÑO MADAGASCAR 2027–2028 (23 RÉGIONS & 119 DISTRICTS) ---

export type AtlasGroupId = 'grand-sud' | 'sud-est-est' | 'nord-nord-ouest' | 'hautes-terres';

export interface AtlasRegionEntry {
  number: number;
  region: string;
  group: AtlasGroupId;
  groupLabel: string;
  priorityRank: string;
  dominantRisk: string;
  vigilanceLevel: 'Très élevé' | 'Élevé' | 'Modéré à élevé' | 'Modéré';
  possibleEffects: string;
  priorityDistricts: string[];
  riskCategory: 'drought' | 'mixed' | 'flood';
}

export const ATLAS_7_DOMAINS: { domain: string; consequences: string }[] = [
  { domain: 'Pluviométrie', consequences: 'Déficit ou irrégularité des pluies selon les régions' },
  { domain: 'Agriculture', consequences: 'Retard des semis, baisse des rendements, pertes de récoltes' },
  { domain: 'Eau', consequences: "Diminution des réserves et assèchement des cours d'eau" },
  { domain: 'Élevage', consequences: "Réduction des pâturages et manque d'eau pour les animaux" },
  { domain: 'Santé', consequences: "Risques de malnutrition, maladies liées à l'eau et à la chaleur" },
  { domain: 'Économie', consequences: 'Hausse des prix alimentaires, baisse des revenus agricoles' },
  { domain: 'Infrastructures', consequences: "Risques d'inondation, érosion et dommages aux routes" },
];

export const ATLAS_23_REGIONS: AtlasRegionEntry[] = [
  // A. Grand Sud — Priorité 1 (6 régions)
  {
    number: 1,
    region: 'Androy',
    group: 'grand-sud',
    groupLabel: 'Grand Sud',
    priorityRank: 'Priorité 1',
    dominantRisk: 'Très élevé – sécheresse',
    vigilanceLevel: 'Très élevé',
    possibleEffects: "Pénurie d'eau, pertes agricoles, dégradation des pâturages",
    priorityDistricts: ['Ambovombe', 'Bekily', 'Beloha', 'Tsihombe'],
    riskCategory: 'drought',
  },
  {
    number: 2,
    region: 'Anosy',
    group: 'grand-sud',
    groupLabel: 'Grand Sud',
    priorityRank: 'Priorité 1',
    dominantRisk: "Très élevé au Sud et à l'Ouest",
    vigilanceLevel: 'Très élevé',
    possibleEffects: 'Sécheresse agricole, baisse des récoltes, stress hydrique',
    priorityDistricts: ['Amboasary-Atsimo', 'Betroka', 'Taolagnaro'],
    riskCategory: 'drought',
  },
  {
    number: 3,
    region: 'Atsimo-Andrefana',
    group: 'grand-sud',
    groupLabel: 'Grand Sud',
    priorityRank: 'Priorité 1',
    dominantRisk: 'Très élevé',
    vigilanceLevel: 'Très élevé',
    possibleEffects: "Déficit de pluie, baisse des productions agricoles, difficultés d'accès à l'eau",
    priorityDistricts: ['Ampanihy', 'Betioky', 'Toliara II', 'Sakaraha', 'Morombe'],
    riskCategory: 'drought',
  },
  {
    number: 4,
    region: 'Atsimo-Atsinanana',
    group: 'grand-sud',
    groupLabel: 'Grand Sud',
    priorityRank: 'Priorité 1',
    dominantRisk: 'Élevé au Sud',
    vigilanceLevel: 'Élevé',
    possibleEffects: "Perturbation des cultures, alternance de déficit et d'excès de pluie",
    priorityDistricts: ['Vangaindrano', 'Farafangana', 'Midongy-Atsimo', 'Befotaka', 'Vondrozo'],
    riskCategory: 'mixed',
  },
  {
    number: 5,
    region: 'Ihorombe',
    group: 'grand-sud',
    groupLabel: 'Grand Sud',
    priorityRank: 'Priorité 1',
    dominantRisk: 'Élevé',
    vigilanceLevel: 'Élevé',
    possibleEffects: 'Dégradation des pâturages, stress hydrique, baisse des rendements',
    priorityDistricts: ['Ihosy', 'Iakora', 'Ivohibe'],
    riskCategory: 'mixed',
  },
  {
    number: 6,
    region: 'Menabe',
    group: 'grand-sud',
    groupLabel: 'Grand Sud',
    priorityRank: 'Priorité 1',
    dominantRisk: 'Élevé à modéré',
    vigilanceLevel: 'Élevé',
    possibleEffects: "Sécheresse agricole, diminution de l'eau disponible, risques de fortes chaleurs",
    priorityDistricts: ['Miandrivazo', 'Mahabo', 'Manja', 'Morondava', 'Belo-sur-Tsiribihina'],
    riskCategory: 'mixed',
  },
  // B. Sud-Est et Est — Priorité 2 (5 régions)
  {
    number: 7,
    region: 'Fitovinany',
    group: 'sud-est-est',
    groupLabel: 'Sud-Est et Est',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Élevé – pluies extrêmes localisées',
    vigilanceLevel: 'Élevé',
    possibleEffects: 'Inondations, glissements de terrain, perturbation du riz',
    priorityDistricts: ['Manakara', 'Ikongo', 'Vohipeno'],
    riskCategory: 'flood',
  },
  {
    number: 8,
    region: 'Vatovavy',
    group: 'sud-est-est',
    groupLabel: 'Sud-Est et Est',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Élevé',
    vigilanceLevel: 'Élevé',
    possibleEffects: 'Pluies excessives, crues, érosion des sols',
    priorityDistricts: ['Mananjary', 'Nosy Varika', 'Ifanadiana'],
    riskCategory: 'flood',
  },
  {
    number: 9,
    region: 'Atsinanana',
    group: 'sud-est-est',
    groupLabel: 'Sud-Est et Est',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Élevé',
    vigilanceLevel: 'Élevé',
    possibleEffects: 'Inondations, dommages aux infrastructures et cultures',
    priorityDistricts: ['Toamasina II', 'Brickaville', 'Vatomandry', 'Mahanoro'],
    riskCategory: 'flood',
  },
  {
    number: 10,
    region: 'Analanjirofo',
    group: 'sud-est-est',
    groupLabel: 'Sud-Est et Est',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Élevé',
    vigilanceLevel: 'Élevé',
    possibleEffects: 'Excès de pluie, perturbation des cultures de rente, inondations',
    priorityDistricts: ['Fénérive-Est', 'Soanierana-Ivongo', 'Vavatenina', 'Maroantsetra'],
    riskCategory: 'flood',
  },
  {
    number: 11,
    region: 'Alaotra-Mangoro',
    group: 'sud-est-est',
    groupLabel: 'Sud-Est et Est',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Alternance de périodes sèches et de fortes pluies, risques pour la riziculture',
    priorityDistricts: ['Ambatondrazaka', 'Amparafaravola', 'Moramanga'],
    riskCategory: 'mixed',
  },
  // C. Nord et Nord-Ouest — Priorité 2 (6 régions)
  {
    number: 12,
    region: 'Diana',
    group: 'nord-nord-ouest',
    groupLabel: 'Nord et Nord-Ouest',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Fortes pluies localisées, inondations, chaleur',
    priorityDistricts: ['Antsiranana II', 'Ambilobe', 'Nosy Be'],
    riskCategory: 'flood',
  },
  {
    number: 13,
    region: 'SAVA',
    group: 'nord-nord-ouest',
    groupLabel: 'Nord et Nord-Ouest',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Perturbation des cultures de vanille, café et riz',
    priorityDistricts: ['Sambava', 'Antalaha', 'Andapa', 'Vohemar'],
    riskCategory: 'flood',
  },
  {
    number: 14,
    region: 'Sofia',
    group: 'nord-nord-ouest',
    groupLabel: 'Nord et Nord-Ouest',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Variabilité pluviométrique, crues et risques agricoles',
    priorityDistricts: ['Mandritsara', 'Befandriana-Nord', 'Antsohihy', 'Port-Bergé'],
    riskCategory: 'flood',
  },
  {
    number: 15,
    region: 'Boeny',
    group: 'nord-nord-ouest',
    groupLabel: 'Nord et Nord-Ouest',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Chaleur, sécheresse localisée et inondations',
    priorityDistricts: ['Marovoay', 'Mitsinjo', 'Ambato-Boeny'],
    riskCategory: 'mixed',
  },
  {
    number: 16,
    region: 'Betsiboka',
    group: 'nord-nord-ouest',
    groupLabel: 'Nord et Nord-Ouest',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Crues, érosion et perturbation des cultures',
    priorityDistricts: ['Maevatanana', 'Kandreho', 'Tsaratanana'],
    riskCategory: 'mixed',
  },
  {
    number: 17,
    region: 'Melaky',
    group: 'nord-nord-ouest',
    groupLabel: 'Nord et Nord-Ouest',
    priorityRank: 'Priorité 2',
    dominantRisk: 'Élevé',
    vigilanceLevel: 'Élevé',
    possibleEffects: 'Déficit pluviométrique possible, stress hydrique et fortes chaleurs',
    priorityDistricts: ['Maintirano', 'Antsalova', 'Besalampy', 'Morafenobe'],
    riskCategory: 'drought',
  },
  // D. Hautes Terres centrales — Priorité 3 (6 régions)
  {
    number: 18,
    region: 'Analamanga',
    group: 'hautes-terres',
    groupLabel: 'Hautes Terres centrales',
    priorityRank: 'Priorité 3',
    dominantRisk: 'Modéré',
    vigilanceLevel: 'Modéré',
    possibleEffects: 'Irrégularité des pluies, ruissellement et inondations urbaines',
    priorityDistricts: ['Antananarivo-Atsimondrano', 'Antananarivo-Avaradrano', 'Ankazobe', 'Anjozorobe'],
    riskCategory: 'mixed',
  },
  {
    number: 19,
    region: 'Vakinankaratra',
    group: 'hautes-terres',
    groupLabel: 'Hautes Terres centrales',
    priorityRank: 'Priorité 3',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Perturbation des semis, stress hydrique et érosion',
    priorityDistricts: ['Antsirabe I', 'Antsirabe II', 'Betafo', 'Faratsiho'],
    riskCategory: 'mixed',
  },
  {
    number: 20,
    region: 'Itasy',
    group: 'hautes-terres',
    groupLabel: 'Hautes Terres centrales',
    priorityRank: 'Priorité 3',
    dominantRisk: 'Modéré',
    vigilanceLevel: 'Modéré',
    possibleEffects: 'Variabilité des pluies, baisse possible des rendements',
    priorityDistricts: ['Miarinarivo', 'Arivonimamo', 'Soavinandriana'],
    riskCategory: 'mixed',
  },
  {
    number: 21,
    region: 'Bongolava',
    group: 'hautes-terres',
    groupLabel: 'Hautes Terres centrales',
    priorityRank: 'Priorité 3',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Sécheresse agricole localisée, érosion et pluies intenses',
    priorityDistricts: ['Tsiroanomandidy', 'Fenoarivobe'],
    riskCategory: 'mixed',
  },
  {
    number: 22,
    region: "Amoron'i Mania",
    group: 'hautes-terres',
    groupLabel: 'Hautes Terres centrales',
    priorityRank: 'Priorité 3',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Irrégularité des précipitations et perturbation des cultures',
    priorityDistricts: ['Ambositra', 'Fandriana', 'Manandriana', 'Ambatofinandrahana'],
    riskCategory: 'mixed',
  },
  {
    number: 23,
    region: 'Haute Matsiatra',
    group: 'hautes-terres',
    groupLabel: 'Hautes Terres centrales',
    priorityRank: 'Priorité 3',
    dominantRisk: 'Modéré à élevé',
    vigilanceLevel: 'Modéré à élevé',
    possibleEffects: 'Retard des semis, stress hydrique et dégradation des pâturages',
    priorityDistricts: ['Fianarantsoa', 'Ambohimahasoa', 'Ikalamavony', 'Isandra'],
    riskCategory: 'mixed',
  },
];

export interface TemporalWindowEntry {
  year: 2027 | 2028;
  period: string;
  phaseLabel: string;
  summary: string;
}

export const TEMPORAL_OUTLOOK_2027_2028: TemporalWindowEntry[] = [
  {
    year: 2027,
    period: 'Janvier – mars 2027',
    phaseLabel: 'Choc initial & températures élevées',
    summary:
      "Risque de déficit hydrique dans le Sud, températures élevées et perturbations agricoles. Risques d'inondations localisées ailleurs.",
  },
  {
    year: 2027,
    period: 'Avril – juin 2027',
    phaseLabel: 'Bilan des récoltes & tension stocks',
    summary:
      'Évaluation des récoltes, diminution possible des stocks alimentaires et difficultés de reconstitution des revenus agricoles.',
  },
  {
    year: 2027,
    period: 'Juillet – septembre 2027',
    phaseLabel: 'Soudure précoce Grand Sud',
    summary:
      'Période de soudure potentiellement difficile dans le Grand Sud, avec pression sur les ressources alimentaires et hydriques.',
  },
  {
    year: 2027,
    period: 'Octobre – décembre 2027',
    phaseLabel: 'Démarrage nouvelle campagne',
    summary:
      'Nouvelle saison agricole : son démarrage et sa qualité dépendront des conditions océaniques et météorologiques de 2027.',
  },
  {
    year: 2028,
    period: 'Janvier – mars 2028',
    phaseLabel: 'Soudure 2027–2028 (pic différé FEWS NET)',
    summary:
      'Si les pluies de 2027–2028 sont insuffisantes, les difficultés agricoles et alimentaires peuvent persister et atteindre un pic critique.',
  },
  {
    year: 2028,
    period: 'Avril – juin 2028',
    phaseLabel: 'Fenêtre de récupération',
    summary:
      "Possibilité de récupération si les récoltes sont bonnes et si les ressources en eau se reconstituent.",
  },
  {
    year: 2028,
    period: 'Juillet – décembre 2028',
    phaseLabel: 'Consolidation & veille marchés',
    summary:
      'Surveillance de la nouvelle saison agricole, des ressources en eau, des prix alimentaires et des conditions climatiques.',
  },
];

export interface AtlasSectorImpact {
  sector: string;
  consequences: string;
  priorityZones: string;
}

export const ATLAS_9_SECTORS: AtlasSectorImpact[] = [
  {
    sector: 'Agriculture',
    consequences: 'Baisse de production, retard de semis, pertes de récoltes',
    priorityZones: 'Grand Sud, Hautes Terres',
  },
  {
    sector: 'Élevage',
    consequences: "Dégradation des pâturages, manque d'eau, diminution des ressources fourragères",
    priorityZones: 'Androy, Anosy, Ihorombe, Atsimo-Andrefana',
  },
  {
    sector: 'Riziculture',
    consequences: "Perturbation des calendriers agricoles, excès ou insuffisance d'eau",
    priorityZones: 'Alaotra-Mangoro, Sofia, Est',
  },
  {
    sector: 'Eau potable',
    consequences: "Diminution des réserves, difficultés d'approvisionnement",
    priorityZones: 'Androy, Anosy, Atsimo-Andrefana',
  },
  {
    sector: 'Santé',
    consequences: 'Risques de malnutrition, maladies hydriques et stress thermique',
    priorityZones: 'Grand Sud et zones inondées',
  },
  {
    sector: 'Transport',
    consequences: "Routes coupées, ponts endommagés, difficultés d'accès",
    priorityZones: 'Est, Sud-Est, Nord',
  },
  {
    sector: 'Énergie',
    consequences: "Pression sur les ressources hydroélectriques et les infrastructures",
    priorityZones: "Hautes Terres et zones dépendantes de l'hydrologie",
  },
  {
    sector: 'Commerce',
    consequences: 'Hausse possible des prix alimentaires et perturbations logistiques',
    priorityZones: 'Ensemble du pays',
  },
  {
    sector: 'Pêche',
    consequences: 'Perturbations possibles des écosystèmes et des ressources marines',
    priorityZones: 'Littoral Sud, Ouest et Est',
  },
];

export interface PreparednessAxis {
  id: string;
  axisNumber: string;
  title: string;
  leadAgencies: string;
  actions: string[];
}

export const PREPAREDNESS_5_AXES: PreparednessAxis[] = [
  {
    id: 'securite-alimentaire',
    axisNumber: 'Axe 1',
    title: 'Sécurité alimentaire',
    leadAgencies: 'MINAE, BNGRC, PAM, FAO, FDA',
    actions: [
      'Constitution de stocks alimentaires stratégiques',
      'Soutien aux producteurs de semences résistantes à la sécheresse',
      'Diversification des cultures',
      'Surveillance des prix du riz, du maïs et du manioc',
    ],
  },
  {
    id: 'gestion-eau',
    axisNumber: 'Axe 2',
    title: "Gestion de l'eau",
    leadAgencies: 'MEAH, DRAE, DEFIS, UNICEF',
    actions: [
      'Réhabilitation des infrastructures hydrauliques',
      'Protection des sources et bassins versants',
      "Développement de systèmes de stockage d'eau",
      'Surveillance des nappes et des réserves hydriques',
    ],
  },
  {
    id: 'protection-elevage',
    axisNumber: 'Axe 3',
    title: "Protection de l'élevage",
    leadAgencies: 'MINAE / Elevage, FAO, GSDM',
    actions: [
      "Suivi de l'état des pâturages",
      'Gestion durable des ressources fourragères',
      "Sécurisation de l'accès à l'eau pour les animaux",
    ],
  },
  {
    id: 'protection-sociale',
    axisNumber: 'Axe 4',
    title: 'Protection sociale et santé',
    leadAgencies: 'MSANP, ONN, FID, PAM',
    actions: [
      'Surveillance nutritionnelle des populations vulnérables',
      'Renforcement des services de santé',
      "Préparation des dispositifs d'assistance alimentaire et hydrique",
    ],
  },
  {
    id: 'alerte-precoce',
    axisNumber: 'Axe 5',
    title: "Système d'alerte précoce",
    leadAgencies: 'Météo Madagascar, BNGRC, FEWS NET, OMM',
    actions: [
      'Suivi mensuel des précipitations',
      'Analyse satellitaire de la végétation',
      "Surveillance de l'humidité des sols",
      'Identification des districts en situation de risque',
    ],
  },
];

export interface MonthlyIndicatorEntry {
  indicator: string;
  utility: string;
  cadence: string;
  sourceRef: string;
}

export const MONTHLY_INDICATORS_9: MonthlyIndicatorEntry[] = [
  {
    indicator: 'Précipitations (mm)',
    utility: 'Identifier les déficits et excès de pluie',
    cadence: 'Décadaire / Mensuel',
    sourceRef: 'Météo Madagascar / CHIRPS',
  },
  {
    indicator: 'Température moyenne',
    utility: 'Détecter les périodes de chaleur anormale',
    cadence: 'Mensuel',
    sourceRef: 'Météo Madagascar / ERA5',
  },
  {
    indicator: 'SPI-1, SPI-3, SPI-6',
    utility: 'Mesurer les déficits pluviométriques normalisés',
    cadence: 'Mensuel',
    sourceRef: 'OMM / NASA POWER',
  },
  {
    indicator: 'NDVI',
    utility: "Suivre l'état de la végétation et des pâturages",
    cadence: 'Bi-mensuel (16 j)',
    sourceRef: 'Satellite MODIS / Sentinel-2',
  },
  {
    indicator: 'Humidité des sols',
    utility: 'Détecter le stress hydrique agricole racinaire',
    cadence: 'Hebdomadaire / Mensuel',
    sourceRef: 'Copernicus ERA5 (0–7 cm)',
  },
  {
    indicator: "Niveau des cours d'eau",
    utility: 'Suivre les risques hydriques (étiages & crues)',
    cadence: 'Hebdomadaire',
    sourceRef: 'APIPA / BNGRC',
  },
  {
    indicator: 'Production agricole',
    utility: 'Mesurer les pertes de rendement par filière',
    cadence: 'Saisonnier',
    sourceRef: 'MINAE / FAOSTAT / CFSAM',
  },
  {
    indicator: 'Prix alimentaires',
    utility: 'Détecter les tensions sur les marchés (riz, maïs, manioc)',
    cadence: 'Mensuel',
    sourceRef: 'FEWS NET / OdR / ANMCC',
  },
  {
    indicator: 'Population en IPC 3+',
    utility: "Suivre l'insécurité alimentaire aiguë par district",
    cadence: 'Trimestriel',
    sourceRef: 'IPC / FEWS NET / PAM',
  },
];

export const ATLAS_DELIVERABLES = [
  { step: '01', title: 'Base de données des 119 districts', detail: 'Centroïdes ADM2 geoBoundaries, données historiques climatiques et filières.' },
  { step: '02', title: 'Matrice de risques pour chaque district', detail: 'Scoring sécheresse, crues, stress thermique et vulnérabilité structurelle.' },
  { step: '03', title: 'Cartographie des sécheresses, inondations et risques agricoles', detail: 'Couches Google Maps interactives et export GeoJSON / Folium.' },
  { step: '04', title: 'Projection des scénarios 2027 et 2028', detail: 'Contraste onde de choc El Niño 2027 et soudure / rebond 2028.' },
  { step: '05', title: 'Estimation des populations et activités économiques exposées', detail: 'Ciblage IPC 3+ et bassins de production riz, maïs, manioc et rente.' },
  { step: '06', title: 'Tableau de bord décisionnel (Web / Python)', detail: '9 indicateurs mensuels (SPI, NDVI, prix, débits) et générateur QLoRA.' },
  { step: '07', title: "Plan d'intervention et budget prévisionnel par région", detail: 'Coordination État, ONG et bailleurs (FDA, DEFIS, PAM, FAO, Banque mondiale).' },
];

export const ATLAS_EXTERNAL_SOURCES = [
  { name: 'Météo Madagascar', desc: 'Prévisions et bulletins météorologiques', url: 'https://www.meteomadagascar.mg/' },
  { name: 'FEWS NET', desc: 'Suivi de la sécurité alimentaire & soudure 2027–2028', url: 'https://fews.net/' },
  { name: 'FAO', desc: 'Agriculture et sécurité alimentaire', url: 'https://www.fao.org/' },
  { name: 'World Meteorological Organization (OMM)', desc: 'Prévisions SWIOCOF & surveillance climatique', url: 'https://wmo.int/' },
  { name: 'World Bank Climate Portal', desc: 'Données climatiques historiques et projections de Madagascar', url: 'https://climateknowledgeportal.worldbank.org/country/madagascar' },
];

// --- PLAN NATIONAL DE PRÉPARATION ET DE RÉSILIENCE CLIMATIQUE DE MADAGASCAR 2027–2028 (V1.0 · 14 NOV. 2026) ---

export const NATIONAL_BASELINE_INDICATORS = [
  { value: '25,67 M', label: 'Habitants recensés (2018)', source: 'INSTAT – RGPH-3 · 6,08 M ménages' },
  { value: '119', label: 'Districts administratifs', source: '23 régions officielles (Torolalana)' },
  { value: '80,7 %', label: 'Population rurale', source: 'RGPH-3 · > 75 % dépendance agricole' },
  { value: '3,01 %', label: 'Croissance annuelle moyenne', source: '1993–2018 · À décliner par district' },
  { value: '40 %', label: 'Insécurité alimentaire nationale', source: 'Évaluation juin 2026 (70 % Grand Sud)' },
];

export const STRATEGIC_SIX_QUESTIONS = [
  'Quels territoires risquent d’être affectés ?',
  'Combien de personnes pourraient être exposées ?',
  'Quelles productions agricoles et activités économiques sont menacées ?',
  'Quelles infrastructures et ressources en eau doivent être protégées ?',
  'Combien faudra-t-il mobiliser financièrement ?',
  'Qui doit intervenir, où, quand et avec quels moyens ?',
];

export const PROGRAM_8_COMPONENTS = [
  { id: 'C1', title: 'Composante 1 – Atlas territorial des risques', desc: 'Analyse des 23 régions et 119 districts : sécheresse, inondation, chaleur, cyclones et vulnérabilité.' },
  { id: 'C2', title: 'Composante 2 – Populations et vulnérabilité sociale', desc: 'Population exposée, ménages agricoles, enfants, personnes âgées, accès à l’eau et sécurité alimentaire.' },
  { id: 'C3', title: 'Composante 3 – Agriculture et élevage', desc: 'Riz, maïs, manioc, patate douce, cultures de rente, élevage et pêche.' },
  { id: 'C4', title: 'Composante 4 – Impacts économiques', desc: 'Pertes agricoles, revenus, prix alimentaires, infrastructures et activité économique.' },
  { id: 'C5', title: 'Composante 5 – Financement', desc: 'Chiffrage des interventions, financement public, fonds climatiques et partenaires internationaux.' },
  { id: 'C6', title: 'Composante 6 – Coordination nationale', desc: 'État, régions, districts, communes, ONG, agences des Nations Unies et bailleurs.' },
  { id: 'C7', title: 'Composante 7 – Alerte précoce', desc: 'Données météorologiques, satellites, suivi des cultures, prix et indicateurs de vulnérabilité.' },
  { id: 'C8', title: 'Composante 8 – Résilience 2028–2030', desc: 'Gestion durable de l’eau, infrastructures agricoles, adaptation et réduction des risques.' },
];

export const PROGRAM_8_OBJECTIVES = [
  { objective: 'Diagnostic territorial', result: 'Profil climatique des 119 districts' },
  { objective: 'Évaluation humaine', result: 'Estimation des populations exposées' },
  { objective: 'Évaluation agricole', result: 'Estimation des superficies et productions à risque' },
  { objective: 'Analyse économique', result: 'Estimation des pertes potentielles' },
  { objective: 'Planification financière', result: 'Budget national et budgets territoriaux' },
  { objective: 'Coordination', result: 'Répartition des responsabilités des acteurs' },
  { objective: 'Anticipation', result: 'Système d’alerte précoce et tableau de bord' },
  { objective: 'Résilience', result: 'Investissements de moyen et long terme' },
];

export const DISTRICT_DB_SCHEMA_20 = [
  { field: 'DISTRICT_ID', content: 'Identifiant administratif unique (Torolalana)' },
  { field: 'REGION', content: 'Nom officiel de la région (23 régions)' },
  { field: 'DISTRICT', content: 'Nom officiel du district (119 districts)' },
  { field: 'POP_2018', content: 'Population recensée RGPH-3 (2018)' },
  { field: 'POP_2027', content: 'Population projetée selon taux local' },
  { field: 'POP_2028', content: 'Population projetée 2028' },
  { field: 'MENAGES', content: 'Nombre de ménages du district' },
  { field: 'POP_RURALE', content: 'Population rurale estimée' },
  { field: 'AGRI_MENAGES', content: 'Nombre de ménages agricoles' },
  { field: 'RISK_DROUGHT', content: 'Score d’exposition à la sécheresse (0–100)' },
  { field: 'RISK_FLOOD', content: 'Score d’exposition aux inondations (0–100)' },
  { field: 'RISK_HEAT', content: 'Score d’exposition aux fortes chaleurs (0–100)' },
  { field: 'RISK_CYCLONE', content: 'Score d’exposition cyclonique (0–100)' },
  { field: 'POP_EXPOSED', content: 'Population potentiellement exposée' },
  { field: 'AGRI_AREA', content: 'Superficie agricole cultivée (ha)' },
  { field: 'CROP_LOSS', content: 'Pertes agricoles estimées (t & MGA)' },
  { field: 'WATER_GAP', content: 'Déficit hydrique estimé (%)' },
  { field: 'FINANCING_NEED', content: 'Besoin financier consolidé (MGA / USD)' },
  { field: 'INTERVENTION', content: 'Action prioritaire retenue' },
  { field: 'PARTNERS', content: 'Acteurs intervenants (État, ONU, ONG)' },
];

export const RISK_SCORING_DIMENSIONS = [
  { id: 'climate', label: 'Exposition climatique', weight: 30, desc: 'Aléas combinés (sécheresse, crues, chaleur, cyclones) issus des séries Météo Madagascar / CHIRPS.' },
  { id: 'pop', label: 'Vulnérabilité de la population', weight: 25, desc: 'Insécurité alimentaire de base, pauvreté, proportion d’enfants et personnes âgées.' },
  { id: 'agri', label: 'Dépendance agricole et économique', weight: 20, desc: 'Part des ménages dépendants des cultures pluviales sensibles et du bétail.' },
  { id: 'water', label: 'Fragilité des ressources en eau', weight: 15, desc: 'Stress des nappes superficielles, tarissement des fleuves et couverture en points d’eau.' },
  { id: 'capacity', label: 'Capacité locale de réponse (déficit)', weight: 10, desc: 'Enclavement logistique, présence de structures sanitaires, stocks et relais communautaires.' },
];

export const RISK_ANALYTICAL_CLASSES = [
  { range: '0–19', label: 'Faible', color: '#15803D' },
  { range: '20–39', label: 'Modéré', color: '#2563EB' },
  { range: '40–59', label: 'Important', color: '#D97706' },
  { range: '60–79', label: 'Élevé', color: '#EA580C' },
  { range: '80–100', label: 'Très élevé', color: '#DC2626' },
];

export const TERRITORIAL_GROUPS_ABCD = [
  {
    code: 'Groupe A',
    title: 'Sécheresse et sécurité alimentaire',
    regions: 'Androy, Anosy, Atsimo-Andrefana, Menabe, Ihorombe et parties occidentales des Hautes Terres',
    interventions: 'Eau, semences adaptées, sécurité alimentaire, élevage et protection sociale.',
  },
  {
    code: 'Groupe B',
    title: 'Pluies intenses et inondations',
    regions: 'Atsinanana, Analanjirofo, Vatovavy, Fitovinany, SAVA et certains districts de Sofia',
    interventions: 'Drainage, protection des cultures, alerte, accès routier et abris.',
  },
  {
    code: 'Groupe C',
    title: 'Agriculture et variabilité pluviométrique',
    regions: "Alaotra-Mangoro, Vakinankaratra, Haute Matsiatra, Itasy, Bongolava et Amoron'i Mania",
    interventions: 'Gestion de l’eau agricole, semences, suivi des rendements et conservation des sols.',
  },
  {
    code: 'Groupe D',
    title: 'Risques mixtes et infrastructures',
    regions: 'Analamanga, Boeny, Betsiboka, Melaky et Diana',
    interventions: 'Protection des infrastructures, drainage, continuité des services et prévention des risques multiples.',
  },
];

export interface PilotDistrictPreset {
  district: string;
  mapDistrictKey: string;
  region: string;
  groupCode: string;
  profileTag: string;
  defaultScores: { climate: number; pop: number; agri: number; water: number; capacity: number };
  popRef: number;
  exposureRate: number;
  vulnRate: number;
  assistRate: number;
}

export const PILOT_DISTRICTS_12: PilotDistrictPreset[] = [
  { district: 'Ambovombe-Androy', mapDistrictKey: 'Ambovombe', region: 'Androy', groupCode: 'Groupe A', profileTag: 'Sécheresse critique', defaultScores: { climate: 4.8, pop: 4.7, agri: 4.6, water: 4.9, capacity: 4.2 }, popRef: 349000, exposureRate: 0.78, vulnRate: 0.72, assistRate: 0.65 },
  { district: 'Bekily', mapDistrictKey: 'Bekily', region: 'Androy', groupCode: 'Groupe A', profileTag: 'Sécheresse critique', defaultScores: { climate: 4.4, pop: 4.4, agri: 4.5, water: 4.5, capacity: 4.0 }, popRef: 237000, exposureRate: 0.70, vulnRate: 0.68, assistRate: 0.60 },
  { district: 'Tsihombe', mapDistrictKey: 'Tsihombe', region: 'Androy', groupCode: 'Groupe A', profileTag: 'Sécheresse critique', defaultScores: { climate: 4.9, pop: 4.6, agri: 4.7, water: 4.9, capacity: 4.3 }, popRef: 149000, exposureRate: 0.80, vulnRate: 0.74, assistRate: 0.68 },
  { district: 'Amboasary-Sud', mapDistrictKey: 'Amboasary-Atsimo', region: 'Anosy', groupCode: 'Groupe A', profileTag: 'Sécheresse critique', defaultScores: { climate: 4.6, pop: 4.5, agri: 4.4, water: 4.7, capacity: 3.9 }, popRef: 256000, exposureRate: 0.72, vulnRate: 0.69, assistRate: 0.62 },
  { district: 'Ampanihy-Ouest', mapDistrictKey: 'Ampanihy', region: 'Atsimo-Andrefana', groupCode: 'Groupe A', profileTag: 'Sécheresse critique', defaultScores: { climate: 4.7, pop: 4.5, agri: 4.6, water: 4.8, capacity: 4.1 }, popRef: 398000, exposureRate: 0.75, vulnRate: 0.70, assistRate: 0.62 },
  { district: 'Ihosy', mapDistrictKey: 'Ihosy', region: 'Ihorombe', groupCode: 'Groupe A / C', profileTag: 'Pâturages & vivriers', defaultScores: { climate: 3.8, pop: 3.7, agri: 4.1, water: 3.9, capacity: 3.5 }, popRef: 292000, exposureRate: 0.56, vulnRate: 0.55, assistRate: 0.45 },
  { district: 'Miandrivazo', mapDistrictKey: 'Miandrivazo', region: 'Menabe', groupCode: 'Groupe A', profileTag: 'Chaleur & déficit pluies', defaultScores: { climate: 3.7, pop: 3.5, agri: 4.0, water: 3.6, capacity: 3.4 }, popRef: 171000, exposureRate: 0.54, vulnRate: 0.52, assistRate: 0.42 },
  { district: 'Ambatondrazaka', mapDistrictKey: 'Ambatondrazaka', region: 'Alaotra-Mangoro', groupCode: 'Groupe C', profileTag: 'Grenier rizicole & étiage', defaultScores: { climate: 3.2, pop: 2.9, agri: 4.4, water: 3.4, capacity: 2.6 }, popRef: 358000, exposureRate: 0.48, vulnRate: 0.42, assistRate: 0.30 },
  { district: 'Mananjary', mapDistrictKey: 'Mananjary', region: 'Vatovavy', groupCode: 'Groupe B', profileTag: 'Crues & cultures de rente', defaultScores: { climate: 3.9, pop: 3.6, agri: 3.9, water: 3.1, capacity: 3.6 }, popRef: 278000, exposureRate: 0.62, vulnRate: 0.58, assistRate: 0.46 },
  { district: 'Brickaville', mapDistrictKey: 'Brickaville', region: 'Atsinanana', groupCode: 'Groupe B', profileTag: 'Inondations & voirie', defaultScores: { climate: 3.8, pop: 3.3, agri: 3.6, water: 2.8, capacity: 3.2 }, popRef: 221000, exposureRate: 0.58, vulnRate: 0.50, assistRate: 0.40 },
  { district: 'Maroantsetra', mapDistrictKey: 'Maroantsetra', region: 'Ambatosoa', groupCode: 'Groupe B', profileTag: 'Pluies intenses & cyclones', defaultScores: { climate: 4.0, pop: 3.4, agri: 3.8, water: 2.6, capacity: 3.7 }, popRef: 251000, exposureRate: 0.60, vulnRate: 0.52, assistRate: 0.42 },
  { district: 'Sambava', mapDistrictKey: 'Sambava', region: 'SAVA', groupCode: 'Groupe B', profileTag: 'Vanille & excès hydriques', defaultScores: { climate: 3.7, pop: 3.1, agri: 4.0, water: 2.5, capacity: 3.0 }, popRef: 365000, exposureRate: 0.52, vulnRate: 0.44, assistRate: 0.32 },
];

export const EIGHT_VALUE_CHAINS = [
  { name: 'Riz', focus: 'Rendement, superficies, calendrier cultural et irrigation (impact national souvent modéré selon FAO mais critique localement).' },
  { name: 'Maïs', focus: 'Sécheresse, rendement et sécurité alimentaire (exposition majeure dans le Sud).' },
  { name: 'Manioc', focus: 'Résilience alimentaire et disponibilité des tubercules de soudure.' },
  { name: 'Patate douce', focus: 'Disponibilité des semences/boutures et production vivrière.' },
  { name: 'Vanille', focus: 'Production, qualité des gousses et revenus des producteurs (SAVA / Ambatosoa).' },
  { name: 'Café et girofle', focus: 'Stress hydrique, floraison, rendement et qualité export (Côte Est).' },
  { name: 'Élevage', focus: 'Pâturages, points d’eau, alimentation fourragère et santé animale.' },
  { name: 'Pêche', focus: 'Conditions marines, ressources halieutiques et moyens de subsistance côtiers.' },
];

export const THREE_SCENARIOS = [
  {
    parameter: 'Climat',
    s1: 'Déficit limité',
    s2: 'Déficit prolongé',
    s3: 'Choc climatique sévère',
  },
  {
    parameter: 'Pluviométrie',
    s1: 'Retour vers la normale',
    s2: 'Irrégularité persistante',
    s3: 'Déficit marqué dans les zones vulnérables',
  },
  {
    parameter: 'Agriculture',
    s1: 'Récupération partielle',
    s2: 'Baisse de rendement',
    s3: 'Pertes agricoles importantes',
  },
  {
    parameter: 'Eau',
    s1: 'Ressources sous pression',
    s2: 'Réserves faibles',
    s3: 'Pénuries localisées',
  },
  {
    parameter: 'Sécurité alimentaire',
    s1: 'Tension saisonnière',
    s2: 'Dégradation localisée',
    s3: 'Besoins humanitaires accrus',
  },
];

export const AMBOVOMBE_FICHE_TEMPLATE = [
  { indicator: 'Population de référence', status: 'À extraire RGPH-3 (INSTAT)', domain: 'Démographie' },
  { indicator: 'Nombre de ménages agricoles', status: 'À consolider (MINAE / INSTAT)', domain: 'Démographie' },
  { indicator: 'Superficie cultivée', status: 'À collecter par culture', domain: 'Agriculture' },
  { indicator: 'Production de maïs', status: 'À collecter (série 2020–2026)', domain: 'Agriculture' },
  { indicator: 'Production de manioc', status: 'À collecter (série 2020–2026)', domain: 'Agriculture' },
  { indicator: 'Production de patate douce', status: 'À collecter (série 2020–2026)', domain: 'Agriculture' },
  { indicator: 'Rendement de référence', status: 'À calculer (Q_référence)', domain: 'Modélisation' },
  { indicator: 'Rendement sous scénario', status: 'À modéliser (S1 / S2 / S3)', domain: 'Modélisation' },
  { indicator: 'Pertes agricoles MGA', status: 'À calculer (Pertes × Prix)', domain: 'Économie' },
  { indicator: 'Besoin en semences', status: 'À calculer (Agriculteur × kit)', domain: 'Planification' },
  { indicator: 'Besoin hydrique', status: 'À calculer (m³ / forages)', domain: 'Eau' },
  { indicator: 'Budget d’intervention', status: 'À chiffrer après coûts unitaires', domain: 'Finances' },
];

export const BUDGET_8_COMPONENTS = [
  { component: 'Sécurité alimentaire', items: 'Transferts monétaires, soutien alimentaire, nutrition d’urgence' },
  { component: 'Agriculture', items: 'Semences résistantes, intrants, petite irrigation, équipements' },
  { component: 'Eau', items: 'Forages, réservoirs de stockage, réhabilitation des réseaux' },
  { component: 'Élevage', items: 'Aliments du bétail, points d’eau pastoraux, santé animale' },
  { component: 'Santé', items: 'Surveillance nutritionnelle, santé communautaire, lutte vectorielle' },
  { component: 'Infrastructures', items: 'Routes rurales, pistes de desserte, drainage, digues de protection' },
  { component: 'Alerte précoce', items: 'Stations météo automatiques, imagerie satellite, télécommunications' },
  { component: 'Coordination', items: 'Équipes territoriales, suivi-évaluation, audits, contrôle' },
];

export interface BudgetUnitLine {
  id: string;
  label: string;
  unitLabel: string;
  defaultQty: number;
  defaultUnitCostMga: number;
  horizon: 'Urgence 2026–2028' | 'Résilience 2028–2030';
}

export const BUDGET_UNIT_LINES: BudgetUnitLine[] = [
  { id: 'food-assist', label: 'Assistance alimentaire', unitLabel: 'Bénéficiaire × mois', defaultQty: 45000, defaultUnitCostMga: 85000, horizon: 'Urgence 2026–2028' },
  { id: 'cash-transfer', label: 'Transfert monétaire', unitLabel: 'Ménage × cycle', defaultQty: 12000, defaultUnitCostMga: 180000, horizon: 'Urgence 2026–2028' },
  { id: 'seed-kits', label: 'Semences agricoles', unitLabel: 'Agriculteur × kit', defaultQty: 18000, defaultUnitCostMga: 110000, horizon: 'Urgence 2026–2028' },
  { id: 'borehole-rehab', label: 'Réhabilitation de forage', unitLabel: 'Ouvrage × coût', defaultQty: 25, defaultUnitCostMga: 28000000, horizon: 'Résilience 2028–2030' },
  { id: 'water-tank', label: 'Réservoir d’eau', unitLabel: 'Infrastructure × capacité', defaultQty: 12, defaultUnitCostMga: 95000000, horizon: 'Résilience 2028–2030' },
  { id: 'farmer-training', label: 'Formation agricole (SCV/SRI)', unitLabel: 'Producteur × session', defaultQty: 6000, defaultUnitCostMga: 45000, horizon: 'Urgence 2026–2028' },
  { id: 'weather-station', label: 'Station météorologique', unitLabel: 'Station × installation', defaultQty: 4, defaultUnitCostMga: 65000000, horizon: 'Résilience 2028–2030' },
  { id: 'rural-road', label: 'Réhabilitation de piste', unitLabel: 'Kilomètre × coût technique', defaultQty: 35, defaultUnitCostMga: 120000000, horizon: 'Résilience 2028–2030' },
];

export const FINANCIAL_INDICATORS_7 = [
  'Coût par personne assistée',
  'Coût par ménage protégé',
  'Coût par hectare agricole sécurisé',
  'Coût par infrastructure réhabilitée',
  'Taux de financement mobilisé (%)',
  'Déficit de financement (MGA / USD / EUR)',
  'Taux d’exécution budgétaire (%)',
];

export const DONOR_PARTNERS_5 = [
  { name: 'Banque mondiale', focus: 'Infrastructures résilientes, agriculture, eau, protection sociale et systèmes de données.', url: 'https://www.worldbank.org/en/country/madagascar' },
  { name: 'Banque africaine de développement (BAD)', focus: 'Développement rural, infrastructures hydro-agricoles et résilience économique.', url: 'https://www.afdb.org/' },
  { name: 'Green Climate Fund (GCF)', focus: 'Projets d’adaptation et de résilience climatique à grande échelle (sous réserve d’éligibilité).', url: 'https://www.greenclimate.fund/' },
  { name: 'Union européenne', focus: 'Développement territorial, sécurité alimentaire et adaptation au changement climatique.', url: 'https://international-partnerships.ec.europa.eu/' },
  { name: 'Adaptation Fund', focus: 'Projets concrets d’adaptation communautaire et gestion locale des ressources.', url: 'https://www.adaptation-fund.org/' },
];

export const GOVERNANCE_PYRAMID = [
  { level: 'Gouvernement de Madagascar', role: 'Orientation stratégique et arbitrage interministériel' },
  { level: 'Comité National de Pilotage', role: 'Coordination politique, budgétaire et partenariale' },
  { level: 'BNGRC & Météo Madagascar', role: 'Gestion opérationnelle des risques, prévisions et alertes précoces' },
  { level: 'Cellule Technique & Cellule Financière', role: 'Données, modélisation 119 districts, budget et mobilisation de fonds' },
  { level: 'Coordination Régionale (23 Régions)', role: 'Services déconcentrés, gouverneurs et planification régionale' },
  { level: 'Coordination Territoriale (119 Districts)', role: 'Communes, fokontany, ONG, coopératives et communautés' },
];

export const GOVERNANCE_13_ACTORS = [
  { actor: 'Primature', role: 'Orientation et arbitrage interministériel' },
  { actor: 'Ministère chargé de l’Environnement', role: 'Politique climatique et adaptation (PNA)' },
  { actor: 'Ministère chargé de l’Agriculture (MINAE)', role: 'Protection des cultures, semences et production' },
  { actor: 'Ministère chargé de l’Eau (MEAH)', role: 'Ressources hydriques, forages et barrages' },
  { actor: 'BNGRC', role: 'Gestion et coordination des catastrophes' },
  { actor: 'Météo Madagascar', role: 'Prévisions saisonnières et alertes précoces' },
  { actor: 'INSTAT', role: 'Données démographiques (RGPH-3) et tables 114/119' },
  { actor: 'Ministère chargé de la Santé (MSANP)', role: 'Nutrition, santé publique et épidémiologie' },
  { actor: 'Ministère chargé des Finances (MEF)', role: 'Consolidation budgétaire (MGA/USD/EUR) et financement' },
  { actor: 'Régions et districts (23 / 119)', role: 'Planification territoriale et suivi de proximité' },
  { actor: 'ONG nationales & internationales', role: 'Exécution de terrain et assistance communautaire' },
  { actor: 'PAM, FAO, UNICEF, PNUD, OMS, OIM', role: 'Appui technique, opérationnel et humanitaire' },
  { actor: 'Bailleurs internationaux', role: 'Financement et assistance technique' },
];

export const IMPLEMENTATION_PHASES_6 = [
  {
    phase: '1 · Novembre – décembre 2026',
    title: 'Diagnostic et préparation',
    tasks: [
      'Constitution de la base des 119 districts (nomenclature Torolalana / INSTAT)',
      'Collecte des données INSTAT, Météo Madagascar et agriculture',
      'Identification des populations vulnérables et cartographie initiale',
      'Préparation des budgets territoriaux',
    ],
  },
  {
    phase: '2 · Janvier – mars 2027',
    title: 'Anticipation et interventions',
    tasks: [
      'Surveillance climatique mensuelle (Météo Madagascar / CHIRPS)',
      'Soutien aux productions agricoles et distribution de kits',
      'Préparation des stocks alimentaires et protection des ressources en eau',
      'Coordination opérationnelle des partenaires',
    ],
  },
  {
    phase: '3 · Avril – juin 2027',
    title: 'Évaluation des impacts',
    tasks: [
      'Évaluation des récoltes (CFSAM / MINAE) et mesure des pertes agricoles',
      'Actualisation de l’analyse IPC par district',
      'Identification des déficits de financement à combler',
    ],
  },
  {
    phase: '4 · Juillet – septembre 2027',
    title: 'Préparation de la soudure',
    tasks: [
      'Assistance ciblée aux ménages vulnérables et moyens de subsistance',
      'Prépositionnement des ressources avant la soudure',
      'Préparation de la campagne agricole 2027–2028',
    ],
  },
  {
    phase: '5 · Octobre – décembre 2027',
    title: 'Deuxième cycle de préparation',
    tasks: [
      'Mise à jour des prévisions saisonnières et révision des scénarios 2028',
      'Ajustement des budgets et renforcement des infrastructures hydrauliques',
    ],
  },
  {
    phase: '6 · Janvier – décembre 2028',
    title: 'Consolidation et résilience',
    tasks: [
      'Évaluation des interventions et réhabilitation des infrastructures',
      'Développement des systèmes agricoles résilients et bilan financier',
      'Préparation du programme structurel 2029–2030',
    ],
  },
];

export const NATIONAL_KPI_10 = [
  { domain: 'Couverture territoriale', kpi: '% des 119 districts évalués et mis à jour mensuellement' },
  { domain: 'Population', kpi: 'Nombre de personnes exposées et nécessitant une assistance' },
  { domain: 'Agriculture', kpi: 'Hectares agricoles à risque par filière' },
  { domain: 'Agriculture', kpi: 'Pertes de production estimées (tonnes et MGA)' },
  { domain: 'Eau', kpi: 'Nombre de localités en stress hydrique sévère' },
  { domain: 'Humanitaire', kpi: 'Personnes ayant effectivement reçu une assistance' },
  { domain: 'Finances', kpi: 'Montant mobilisé / besoin total (déficit de financement)' },
  { domain: 'Exécution', kpi: 'Taux d’exécution budgétaire (engagé vs décaissé)' },
  { domain: 'Coordination', kpi: 'Nombre de projets géolocalisés sans chevauchement' },
  { domain: 'Prévention', kpi: 'Délai moyen entre alerte climatique et déploiement terrain' },
];

export const DASHBOARD_TECH_STACK = [
  'Python (modélisation climatique, démographique et scénarios)',
  'PostgreSQL / PostGIS (base spatiale officielle 119 districts)',
  'QGIS (cartographie thématique des aléas et points d’eau)',
  'Power BI (reporting institutionnel et consolidation financière)',
  'Sentinel-2 & données satellitaires (suivi NDVI des cultures)',
  'Météo Madagascar & API partenaires (actualisation mensuelle)',
];

export const INSTITUTIONAL_DATA_GAPS_12 = [
  'Population détaillée par district et commune (correspondance 114 / 119)',
  'Projections démographiques territorialisées par district',
  'Ménages agricoles recensés par district',
  'Superficies cultivées détaillées par culture',
  'Rendements agricoles historiques (2020–2026)',
  'Données pluviométriques historiques par station/district',
  'Cartographie géolocalisée des points d’eau',
  'Cartographie des zones inondables à fine échelle',
  'Prix agricoles sur les marchés locaux (MGA)',
  'Historique des pertes agricoles déclarées',
  'Projets ONG et bailleurs déjà financés (géolocalisés)',
  'Coûts unitaires validés des interventions par zone',
];

export const FINAL_DELIVERABLES_6 = [
  { code: 'Livrable 01', title: 'Rapport stratégique national', desc: 'Contexte, diagnostic, méthodologie, scénarios, objectifs et recommandations institutionnelles.' },
  { code: 'Livrable 02', title: 'Atlas des 119 districts', desc: 'Fiches territoriales complètes, cartes de risques, populations, agriculture et priorités.' },
  { code: 'Livrable 03', title: 'Modèle financier prévisionnel', desc: 'Budget national, régional et district en MGA/USD/EUR, pertes agricoles et déficit de financement.' },
  { code: 'Livrable 04', title: 'Plan de coordination des partenaires', desc: 'Matrice des responsabilités, cartographie des ONG, projets, bailleurs et financements.' },
  { code: 'Livrable 05', title: 'Tableau de bord numérique', desc: 'Cartographie interactive, données climatiques mensuelles, populations exposées et finances.' },
  { code: 'Livrable 06', title: 'Cadre de résultats et suivi-évaluation', desc: 'Indicateurs KPI, objectifs chiffrés, responsables, échéances et audits.' },
];

export const BUILD_SEQUENCE_8 = [
  { step: 1, work: 'Référentiel des 119 districts', output: 'Base administrative validée (table 114 / 119)' },
  { step: 2, work: 'Base démographique', output: 'Population et ménages par district (RGPH-3)' },
  { step: 3, work: 'Diagnostic climatique', output: 'Scores pondérés et aléas par district' },
  { step: 4, work: 'Analyse agricole', output: 'Pertes et productions sur 8 filières' },
  { step: 5, work: 'Analyse sociale', output: 'Populations exposées et besoin d’assistance' },
  { step: 6, work: 'Chiffrage financier', output: 'Besoins consolidés en MGA, USD et EUR' },
  { step: 7, work: 'Coordination', output: 'Matrice ONG, agences ONU et bailleurs' },
  { step: 8, work: 'Consolidation', output: 'Rapport national et tableau de bord mensuel' },
];

export interface NgoInterventionEntry {
  id: string;
  organization: string;
  region: string;
  district: string;
  commune: string;
  sector: string;
  targetPopulation: string;
  beneficiaries: number;
  budgetCommittedUsd: number;
  disbursedUsd: number;
  duration: string;
  unmetNeeds: string;
}

export const INITIAL_NGO_REGISTRY_SAMPLE: NgoInterventionEntry[] = [
  {
    id: 'pam-sud-2026',
    organization: 'PAM (Programme Alimentaire Mondial)',
    region: 'Androy',
    district: 'Ambovombe',
    commune: 'Ambovombe & 12 communes périphériques',
    sector: 'Sécurité alimentaire & résilience',
    targetPopulation: 'Ménages en Phase IPC 3–4 et cantines scolaires',
    beneficiaries: 185000,
    budgetCommittedUsd: 14200000,
    disbursedUsd: 6800000,
    duration: 'Août 2026 – Janv. 2027 (appel 44,1 M USD national)',
    unmetNeeds: 'Extension soudure 2027–2028 et forages profonds',
  },
  {
    id: 'fao-cashplus-anosy',
    organization: 'FAO Madagascar',
    region: 'Anosy',
    district: 'Amboasary-Atsimo',
    commune: 'Behara, Tranomaro, Sampona',
    sector: 'Agriculture & semences résistantes',
    targetPopulation: 'Petits exploitants agricoles et agro-pasteurs',
    beneficiaries: 42000,
    budgetCommittedUsd: 3100000,
    disbursedUsd: 1450000,
    duration: 'Oct. 2026 – Sept. 2027',
    unmetNeeds: 'Couverture complémentaire en sorgho 90 j et kits goutte-à-goutte',
  },
  {
    id: 'defis-vatovavy',
    organization: 'MINAE / Projet DEFIS (FIDA)',
    region: 'Fitovinany',
    district: 'Manakara',
    commune: 'Périmètres bas-fonds Fitovinany',
    sector: 'Riziculture, drainage & infrastructures',
    targetPopulation: 'Coopératives rizicoles et producteurs de rente',
    beneficiaries: 28500,
    budgetCommittedUsd: 2400000,
    disbursedUsd: 980000,
    duration: 'Nov. 2026 – Déc. 2027',
    unmetNeeds: 'Réhabilitation des digues côtières avant cyclones',
  },
];

// --- ÉVALUATION ÉCONOMIQUE MULTI-ÉCHELLES (DISTRICT -> RÉGION -> EX-PROVINCE -> MADAGASCAR -> COI / COMESA / SADC / AFRIQUE) ---

export type ExProvinceName =
  | 'Toliara'
  | 'Fianarantsoa'
  | 'Toamasina'
  | 'Mahajanga'
  | 'Antananarivo'
  | 'Antsiranana';

export interface ProvinceEconomicMeta {
  province: ExProvinceName;
  districtCount119: number;
  gdpMUsd: number;
  agriBaselineMUsd: number;
  indirectElasticity: number; // Eau, élevage, hydroélectricité, voirie/pistes par rapport au choc direct
  dominantChannel: string;
}

export const PROVINCE_6_BASELINES: ProvinceEconomicMeta[] = [
  {
    province: 'Toliara',
    districtCount119: 21,
    gdpMUsd: 2150,
    agriBaselineMUsd: 780,
    indirectElasticity: 0.42,
    dominantChannel: 'Pertes maïs/manioc, décapitalisation bétail (zébus) et déficit eau potable',
  },
  {
    province: 'Fianarantsoa',
    districtCount119: 23,
    gdpMUsd: 2680,
    agriBaselineMUsd: 920,
    indirectElasticity: 0.36,
    dominantChannel: 'Stress hydrique cultures vivrières, café/poivre et érosion/crues Sud-Est',
  },
  {
    province: 'Toamasina',
    districtCount119: 18,
    gdpMUsd: 2940,
    agriBaselineMUsd: 890,
    indirectElasticity: 0.38,
    dominantChannel: 'Grenier rizicole Alaotra, déficit hydroélectrique RIA & cultures de rente (litchi/girofle)',
  },
  {
    province: 'Mahajanga',
    districtCount119: 21,
    gdpMUsd: 2290,
    agriBaselineMUsd: 790,
    indirectElasticity: 0.35,
    dominantChannel: 'Plaines irriguées Betsiboka/Sofia (vary jeby), risque acridien & crues 2028',
  },
  {
    province: 'Antananarivo',
    districtCount119: 19,
    gdpMUsd: 4920,
    agriBaselineMUsd: 760,
    indirectElasticity: 0.48,
    dominantChannel: 'Inflation riz/denrées urbaines, étiage hydroélectrique et perte productivité travail (chaleur)',
  },
  {
    province: 'Antsiranana',
    districtCount119: 17,
    gdpMUsd: 1520,
    agriBaselineMUsd: 460,
    indirectElasticity: 0.34,
    dominantChannel: 'Coulure & Fusarium vanille SAVA, glissements de terrain et risques cycloniques',
  },
];

export interface RegionEconomicMeta {
  region: string;
  province: ExProvinceName;
  districtsTotal: number;
  gdpMUsd: number;
  agriBaseMUsd: number;
  riceShare: number;
  maizeFoodShare: number;
  exportShare: number;
}

export const REGION_23_ECONOMIC_BASELINES: RegionEconomicMeta[] = [
  { region: 'Androy', province: 'Toliara', districtsTotal: 4, gdpMUsd: 380, agriBaseMUsd: 165, riceShare: 0.12, maizeFoodShare: 0.78, exportShare: 0.10 },
  { region: 'Anosy', province: 'Toliara', districtsTotal: 3, gdpMUsd: 490, agriBaseMUsd: 155, riceShare: 0.28, maizeFoodShare: 0.57, exportShare: 0.15 },
  { region: 'Atsimo-Andrefana', province: 'Toliara', districtsTotal: 9, gdpMUsd: 820, agriBaseMUsd: 280, riceShare: 0.25, maizeFoodShare: 0.62, exportShare: 0.13 },
  { region: 'Menabe', province: 'Toliara', districtsTotal: 5, gdpMUsd: 460, agriBaseMUsd: 180, riceShare: 0.42, maizeFoodShare: 0.46, exportShare: 0.12 },
  { region: 'Atsimo-Atsinanana', province: 'Fianarantsoa', districtsTotal: 5, gdpMUsd: 420, agriBaseMUsd: 165, riceShare: 0.44, maizeFoodShare: 0.31, exportShare: 0.25 },
  { region: 'Ihorombe', province: 'Fianarantsoa', districtsTotal: 3, gdpMUsd: 310, agriBaseMUsd: 120, riceShare: 0.35, maizeFoodShare: 0.55, exportShare: 0.10 },
  { region: 'Fitovinany', province: 'Fianarantsoa', districtsTotal: 3, gdpMUsd: 370, agriBaseMUsd: 140, riceShare: 0.42, maizeFoodShare: 0.25, exportShare: 0.33 },
  { region: 'Vatovavy', province: 'Fianarantsoa', districtsTotal: 3, gdpMUsd: 380, agriBaseMUsd: 145, riceShare: 0.40, maizeFoodShare: 0.24, exportShare: 0.36 },
  { region: "Amoron'i Mania", province: 'Fianarantsoa', districtsTotal: 4, gdpMUsd: 520, agriBaseMUsd: 165, riceShare: 0.52, maizeFoodShare: 0.38, exportShare: 0.10 },
  { region: 'Haute Matsiatra', province: 'Fianarantsoa', districtsTotal: 5, gdpMUsd: 680, agriBaseMUsd: 185, riceShare: 0.50, maizeFoodShare: 0.36, exportShare: 0.14 },
  { region: 'Atsinanana', province: 'Toamasina', districtsTotal: 7, gdpMUsd: 1410, agriBaseMUsd: 280, riceShare: 0.35, maizeFoodShare: 0.20, exportShare: 0.45 },
  { region: 'Analanjirofo', province: 'Toamasina', districtsTotal: 6, gdpMUsd: 740, agriBaseMUsd: 290, riceShare: 0.30, maizeFoodShare: 0.16, exportShare: 0.54 },
  { region: 'Alaotra-Mangoro', province: 'Toamasina', districtsTotal: 5, gdpMUsd: 790, agriBaseMUsd: 320, riceShare: 0.72, maizeFoodShare: 0.20, exportShare: 0.08 },
  { region: 'Sofia', province: 'Mahajanga', districtsTotal: 7, gdpMUsd: 680, agriBaseMUsd: 270, riceShare: 0.60, maizeFoodShare: 0.25, exportShare: 0.15 },
  { region: 'Boeny', province: 'Mahajanga', districtsTotal: 6, gdpMUsd: 920, agriBaseMUsd: 255, riceShare: 0.64, maizeFoodShare: 0.24, exportShare: 0.12 },
  { region: 'Betsiboka', province: 'Mahajanga', districtsTotal: 3, gdpMUsd: 340, agriBaseMUsd: 135, riceShare: 0.55, maizeFoodShare: 0.35, exportShare: 0.10 },
  { region: 'Melaky', province: 'Mahajanga', districtsTotal: 5, gdpMUsd: 350, agriBaseMUsd: 130, riceShare: 0.42, maizeFoodShare: 0.48, exportShare: 0.10 },
  { region: 'Analamanga', province: 'Antananarivo', districtsTotal: 8, gdpMUsd: 3280, agriBaseMUsd: 245, riceShare: 0.58, maizeFoodShare: 0.30, exportShare: 0.12 },
  { region: 'Vakinankaratra', province: 'Antananarivo', districtsTotal: 7, gdpMUsd: 980, agriBaseMUsd: 280, riceShare: 0.48, maizeFoodShare: 0.42, exportShare: 0.10 },
  { region: 'Itasy', province: 'Antananarivo', districtsTotal: 2, gdpMUsd: 350, agriBaseMUsd: 120, riceShare: 0.50, maizeFoodShare: 0.38, exportShare: 0.12 },
  { region: 'Bongolava', province: 'Antananarivo', districtsTotal: 2, gdpMUsd: 310, agriBaseMUsd: 115, riceShare: 0.46, maizeFoodShare: 0.44, exportShare: 0.10 },
  { region: 'Diana', province: 'Antsiranana', districtsTotal: 5, gdpMUsd: 710, agriBaseMUsd: 175, riceShare: 0.34, maizeFoodShare: 0.22, exportShare: 0.44 },
  { region: 'SAVA', province: 'Antsiranana', districtsTotal: 4, gdpMUsd: 810, agriBaseMUsd: 285, riceShare: 0.24, maizeFoodShare: 0.14, exportShare: 0.62 },
];

export type RegionalBlocTag = 'COI' | 'SADC' | 'COMESA' | 'Afrique';

export interface ContinentalCountryLossProfile {
  id: string;
  countryOrZone: string;
  blocs: RegionalBlocTag[];
  primaryGroup: 'Océan Indien (COI)' | 'SADC (Afrique australe)' | 'COMESA (Axe Nord-Sud)' | 'Autres blocs Afrique';
  gdpBnUsd: number;
  agriSharePct: number;
  directAgriLoss2027MUsd: number;
  indirectInfraEnergyLoss2027MUsd: number;
  /** En 2028, valeur négative = perte résiduelle/crues La Niña ; valeur positive = gain de rebond partiel */
  netBalance2028MUsd: number;
  climateSignal2027: string;
  transmissionChannel: string;
  isMadagascarDynamic?: boolean;
}

export const CONTINENTAL_COUNTRY_PROJECTIONS: ContinentalCountryLossProfile[] = [
  // Océan Indien (COI)
  {
    id: 'madagascar',
    countryOrZone: 'Madagascar',
    blocs: ['COI', 'SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'Océan Indien (COI)',
    gdpBnUsd: 16.5,
    agriSharePct: 28,
    directAgriLoss2027MUsd: 265,
    indirectInfraEnergyLoss2027MUsd: 108,
    netBalance2028MUsd: -95,
    climateSignal2027: 'Sécheresse Grand Sud (-30 à -50 %) + excès Nord-Est + étiage RIA',
    transmissionChannel: 'Chute maïs/manioc Sud, tension riz (3 200 MGA/kg), pertes énergie & soudure 2027–2028',
    isMadagascarDynamic: true,
  },
  {
    id: 'comores',
    countryOrZone: 'Comores',
    blocs: ['COI', 'SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'Océan Indien (COI)',
    gdpBnUsd: 1.4,
    agriSharePct: 33,
    directAgriLoss2027MUsd: 18,
    indirectInfraEnergyLoss2027MUsd: 14,
    netBalance2028MUsd: -9,
    climateSignal2027: 'Réchauffement océan Indien + pluies erratiques / risque dépressionnaire',
    transmissionChannel: 'Hausses importations de riz, stress eau potable (Grande Comore) et pêche artisanale',
  },
  {
    id: 'maurice',
    countryOrZone: 'Maurice',
    blocs: ['COI', 'SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'Océan Indien (COI)',
    gdpBnUsd: 14.8,
    agriSharePct: 3.5,
    directAgriLoss2027MUsd: 24,
    indirectInfraEnergyLoss2027MUsd: 68,
    netBalance2028MUsd: -25,
    climateSignal2027: 'Vagues de chaleur océaniques & épisodes pluvieux intenses localisés',
    transmissionChannel: 'Baisse rendement canne à sucre, surcoûts climatisation/eau et facture importations alimentaires',
  },
  {
    id: 'seychelles',
    countryOrZone: 'Seychelles',
    blocs: ['COI', 'SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'Océan Indien (COI)',
    gdpBnUsd: 2.2,
    agriSharePct: 2.6,
    directAgriLoss2027MUsd: 19,
    indirectInfraEnergyLoss2027MUsd: 23,
    netBalance2028MUsd: -11,
    climateSignal2027: 'Anomalie SST + IOD positif : déplacement bancs de thons & stress corallien',
    transmissionChannel: 'Baisse captures pêche thonière (économie bleue) et renchérissement importations',
  },
  {
    id: 'reunion-mayotte',
    countryOrZone: 'La Réunion & Mayotte',
    blocs: ['COI', 'Afrique'],
    primaryGroup: 'Océan Indien (COI)',
    gdpBnUsd: 25.5,
    agriSharePct: 2.4,
    directAgriLoss2027MUsd: 36,
    indirectInfraEnergyLoss2027MUsd: 82,
    netBalance2028MUsd: -30,
    climateSignal2027: 'Déficit pluviométrique hydrique (Mayotte) & pics thermiques côtiers',
    transmissionChannel: 'Restrictions d’eau potable à Mayotte, stress canne/élevage et gestion crues littorales',
  },

  // SADC (Afrique australe)
  {
    id: 'afrique-du-sud',
    countryOrZone: 'Afrique du Sud',
    blocs: ['SADC', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 380.0,
    agriSharePct: 2.8,
    directAgriLoss2027MUsd: 1180,
    indirectInfraEnergyLoss2027MUsd: 1450,
    netBalance2028MUsd: 320,
    climateSignal2027: 'Assèchement ceinture du maïs (Free State / Nord-Ouest) janv.–fév. 2027',
    transmissionChannel: 'Contraction récolte d’été, accélération inflation alimentaire S2 et baisse exportations régionales',
  },
  {
    id: 'zambie',
    countryOrZone: 'Zambie',
    blocs: ['SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 29.8,
    agriSharePct: 6.5,
    directAgriLoss2027MUsd: 410,
    indirectInfraEnergyLoss2027MUsd: 540,
    netBalance2028MUsd: -120,
    climateSignal2027: 'Sécheresse sévère floraison maïs & déficit bassin du Zambèze',
    transmissionChannel: 'Chute 20–40 % maïs + rationnement électrique sévère (barrage Kariba) freinant mines de cuivre',
  },
  {
    id: 'zimbabwe',
    countryOrZone: 'Zimbabwe',
    blocs: ['SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 32.4,
    agriSharePct: 8.8,
    directAgriLoss2027MUsd: 465,
    indirectInfraEnergyLoss2027MUsd: 490,
    netBalance2028MUsd: -145,
    climateSignal2027: 'Vagues de chaleur et déficit pluviométrique critique T1 2027',
    transmissionChannel: 'Chute maïs/tabac, délestages Kariba et importations céréalières d’urgence',
  },
  {
    id: 'malawi',
    countryOrZone: 'Malawi',
    blocs: ['SADC', 'COMESA', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 14.1,
    agriSharePct: 23,
    directAgriLoss2027MUsd: 295,
    indirectInfraEnergyLoss2027MUsd: 135,
    netBalance2028MUsd: -85,
    climateSignal2027: 'Pauses pluviométriques prolongées en pleine floraison du maïs',
    transmissionChannel: 'Déficit vivrier aigu, hausse prix maïs et pression sur aide humanitaire rurale',
  },
  {
    id: 'mozambique',
    countryOrZone: 'Mozambique',
    blocs: ['SADC', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 21.6,
    agriSharePct: 26,
    directAgriLoss2027MUsd: 340,
    indirectInfraEnergyLoss2027MUsd: 270,
    netBalance2028MUsd: -110,
    climateSignal2027: 'Asymétrie : sécheresse au Sud/Centre vs crues côtières & cyclones Nord',
    transmissionChannel: 'Pertes agricoles vallée du Limpopo et dommages corridors logistiques port/rail',
  },
  {
    id: 'tanzanie',
    countryOrZone: 'Tanzanie',
    blocs: ['SADC', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 82.0,
    agriSharePct: 24,
    directAgriLoss2027MUsd: 310,
    indirectInfraEnergyLoss2027MUsd: 280,
    netBalance2028MUsd: 90,
    climateSignal2027: 'Excès pluviométriques côte/Victoria (crues) et irrégularités Centre',
    transmissionChannel: 'Endommagement pistes rurales et stockage post-récolte malgré certains gains hydriques',
  },
  {
    id: 'angola-namibie-botswana',
    countryOrZone: 'Angola, Namibie & Botswana',
    blocs: ['SADC', 'Afrique'],
    primaryGroup: 'SADC (Afrique australe)',
    gdpBnUsd: 138.0,
    agriSharePct: 9.2,
    directAgriLoss2027MUsd: 490,
    indirectInfraEnergyLoss2027MUsd: 380,
    netBalance2028MUsd: -70,
    climateSignal2027: 'Sécheresse semi-aride bassin Cunene / Okavango et stress pastoral',
    transmissionChannel: 'Mortalité bétail, tension eau urbaine (Windhoek/Gaborone) et importations vivrières',
  },

  // COMESA (Axe Nord-Sud & Corne de l'Afrique)
  {
    id: 'kenya',
    countryOrZone: 'Kenya',
    blocs: ['COMESA', 'Afrique'],
    primaryGroup: 'COMESA (Axe Nord-Sud)',
    gdpBnUsd: 112.0,
    agriSharePct: 21,
    directAgriLoss2027MUsd: 520,
    indirectInfraEnergyLoss2027MUsd: 690,
    netBalance2028MUsd: -160,
    climateSignal2027: 'Fortes pluies et inondations (couplage IOD+ / El Niño) axe Rift & côte',
    transmissionChannel: 'Destruction routes/ponts, pertes horticoles/thé et rupture chaînes logistiques Nord-Sud',
  },
  {
    id: 'ethiopie',
    countryOrZone: 'Éthiopie',
    blocs: ['COMESA', 'Afrique'],
    primaryGroup: 'COMESA (Axe Nord-Sud)',
    gdpBnUsd: 164.0,
    agriSharePct: 36,
    directAgriLoss2027MUsd: 890,
    indirectInfraEnergyLoss2027MUsd: 610,
    netBalance2028MUsd: -210,
    climateSignal2027: 'Contraste aigu : crues bassin Awash/Rift et déficits localisés Nord',
    transmissionChannel: 'Pertes café/céréales, dommages routes et mobilisation humanitaire lourde',
  },
  {
    id: 'ouganda',
    countryOrZone: 'Ouganda',
    blocs: ['COMESA', 'Afrique'],
    primaryGroup: 'COMESA (Axe Nord-Sud)',
    gdpBnUsd: 52.0,
    agriSharePct: 24,
    directAgriLoss2027MUsd: 260,
    indirectInfraEnergyLoss2027MUsd: 245,
    netBalance2028MUsd: -65,
    climateSignal2027: 'Excès pluviométriques bassin du lac Victoria et glissements de terrain',
    transmissionChannel: 'Engorgement café/banane plantain, dommages voirie rurale et inondations riveraines',
  },
  {
    id: 'rwanda-burundi',
    countryOrZone: 'Rwanda & Burundi',
    blocs: ['COMESA', 'Afrique'],
    primaryGroup: 'COMESA (Axe Nord-Sud)',
    gdpBnUsd: 18.2,
    agriSharePct: 28,
    directAgriLoss2027MUsd: 145,
    indirectInfraEnergyLoss2027MUsd: 170,
    netBalance2028MUsd: -55,
    climateSignal2027: 'Pluies intenses de collines, érosion des sols et crues de vallées',
    transmissionChannel: 'Pertes haricot/maïs en terrasse et destruction ponts/infrastructures hydrauliques',
  },
  {
    id: 'egypte-soudan',
    countryOrZone: 'Égypte & Soudan (COMESA Nord)',
    blocs: ['COMESA', 'Afrique'],
    primaryGroup: 'COMESA (Axe Nord-Sud)',
    gdpBnUsd: 425.0,
    agriSharePct: 12,
    directAgriLoss2027MUsd: 980,
    indirectInfraEnergyLoss2027MUsd: 1320,
    netBalance2028MUsd: -290,
    climateSignal2027: 'Vagues de chaleur estivales sur le Nil et stress hydrique d’irrigation',
    transmissionChannel: 'Surcoût massif facture d’importation blé/maïs mondiale et besoin électrique climatisation',
  },

  // Autres blocs Afrique (Ouest, Sahel, Centrale, Nord)
  {
    id: 'cote-ivoire-ghana',
    countryOrZone: 'Côte d’Ivoire & Ghana (Golfe de Guinée)',
    blocs: ['Afrique'],
    primaryGroup: 'Autres blocs Afrique',
    gdpBnUsd: 158.0,
    agriSharePct: 19,
    directAgriLoss2027MUsd: 960,
    indirectInfraEnergyLoss2027MUsd: 480,
    netBalance2028MUsd: 180,
    climateSignal2027: 'Harmattan renforcé et démarrage irrégulier mousson printemps 2027',
    transmissionChannel: 'Chute volumes cacao (maintien prix mondiaux records) et déficit hydrique hydroélectrique',
  },
  {
    id: 'sahel',
    countryOrZone: 'Espace Sahel (Mali, Niger, Burkina, Tchad, Sénégal)',
    blocs: ['Afrique'],
    primaryGroup: 'Autres blocs Afrique',
    gdpBnUsd: 108.0,
    agriSharePct: 31,
    directAgriLoss2027MUsd: 780,
    indirectInfraEnergyLoss2027MUsd: 410,
    netBalance2028MUsd: -140,
    climateSignal2027: 'Pics thermiques extrêmes et pauses sèches mil/sorgho',
    transmissionChannel: 'Déficit fourrager critique, tension pastorale et besoins aide alimentaire',
  },
  {
    id: 'afrique-centrale',
    countryOrZone: 'Afrique centrale (RDC, Cameroun, Congo, Gabon)',
    blocs: ['Afrique'],
    primaryGroup: 'Autres blocs Afrique',
    gdpBnUsd: 146.0,
    agriSharePct: 18,
    directAgriLoss2027MUsd: 540,
    indirectInfraEnergyLoss2027MUsd: 590,
    netBalance2028MUsd: -90,
    climateSignal2027: 'Pluies erratiques bassin du Congo & baisse des étiages fluviaux',
    transmissionChannel: 'Perturbation transport fluvial sur le Congo/Oubangui, manioc/cacao et surcoûts logistiques',
  },
  {
    id: 'afrique-du-nord',
    countryOrZone: 'Afrique du Nord (Maroc, Algérie, Tunisie)',
    blocs: ['Afrique'],
    primaryGroup: 'Autres blocs Afrique',
    gdpBnUsd: 448.0,
    agriSharePct: 9.5,
    directAgriLoss2027MUsd: 1340,
    indirectInfraEnergyLoss2027MUsd: 920,
    netBalance2028MUsd: -180,
    climateSignal2027: 'Persistance blocages anticycloniques et déficit hydrique hivernal',
    transmissionChannel: 'Contraction céréales (blé, orge) et alourdissement subventions/importations étatiques',
  },
];

