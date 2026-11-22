export type AlertIntensity = 'moderate' | 'strong' | 'super';
export type AlertPhaseStatus = 'historical' | 'active' | 'upcoming';
export type AlertGeoZoneId =
  | 'all'
  | 'madagascar'
  | 'indian-ocean-coi'
  | 'africa-sadc-comesa'
  | 'asia-asean'
  | 'americas'
  | 'europe-mena'
  | 'oceania';

export type TimelineSortOrder = 'asc' | 'desc';

export interface AlertZoneMeta {
  id: AlertGeoZoneId;
  labelFr: string;
  labelEn: string;
  shortLabelFr: string;
  shortLabelEn: string;
}

export interface AlertIntensityMeta {
  id: 'all' | AlertIntensity;
  labelFr: string;
  labelEn: string;
  oniRangeFr: string;
  oniRangeEn: string;
}

export interface ClimateAlertTimelineEvent {
  id: string;
  dateIso: string; // YYYY-MM chronological key
  shortAxisLabel: string;
  periodLabelFr: string;
  periodLabelEn: string;
  phase: AlertPhaseStatus;
  intensity: AlertIntensity;
  oniPeakC: number;
  iodState: string;
  agency: string;
  zones: Exclude<AlertGeoZoneId, 'all'>[];
  zoneTagFr: string;
  zoneTagEn: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  impactMetricsFr: string[];
  impactMetricsEn: string[];
  actionTriggerFr: string;
  actionTriggerEn: string;
}

export const CLIMATE_ALERT_ZONES: AlertZoneMeta[] = [
  {
    id: 'all',
    labelFr: 'Toutes les zones (Monde)',
    labelEn: 'All Zones (Global)',
    shortLabelFr: 'Monde',
    shortLabelEn: 'Global',
  },
  {
    id: 'madagascar',
    labelFr: 'Madagascar (23 Régions)',
    labelEn: 'Madagascar (23 Regions)',
    shortLabelFr: 'Madagascar',
    shortLabelEn: 'Madagascar',
  },
  {
    id: 'indian-ocean-coi',
    labelFr: 'Océan Indien & COI',
    labelEn: 'Indian Ocean & IOC',
    shortLabelFr: 'COI / OI',
    shortLabelEn: 'IOC / IO',
  },
  {
    id: 'africa-sadc-comesa',
    labelFr: 'Afrique (SADC · COMESA)',
    labelEn: 'Africa (SADC · COMESA)',
    shortLabelFr: 'Afrique',
    shortLabelEn: 'Africa',
  },
  {
    id: 'asia-asean',
    labelFr: 'Asie & ASEAN',
    labelEn: 'Asia & ASEAN',
    shortLabelFr: 'Asie / ASEAN',
    shortLabelEn: 'Asia / ASEAN',
  },
  {
    id: 'americas',
    labelFr: 'Amériques (Nord · Latam · Caraïbes)',
    labelEn: 'Americas (North · Latam · Caribbean)',
    shortLabelFr: 'Amériques',
    shortLabelEn: 'Americas',
  },
  {
    id: 'europe-mena',
    labelFr: 'Europe & Moyen-Orient (MENA)',
    labelEn: 'Europe & Middle East (MENA)',
    shortLabelFr: 'Europe / MENA',
    shortLabelEn: 'Europe / MENA',
  },
  {
    id: 'oceania',
    labelFr: 'Océanie & Pacifique',
    labelEn: 'Oceania & Pacific',
    shortLabelFr: 'Océanie',
    shortLabelEn: 'Oceania',
  },
];

export const CLIMATE_ALERT_INTENSITIES: AlertIntensityMeta[] = [
  {
    id: 'all',
    labelFr: 'Toutes intensités',
    labelEn: 'All Intensities',
    oniRangeFr: 'ONI ≥ +1,0 °C',
    oniRangeEn: 'ONI ≥ +1.0 °C',
  },
  {
    id: 'moderate',
    labelFr: 'Modéré',
    labelEn: 'Moderate',
    oniRangeFr: '+1,0 à +1,4 °C',
    oniRangeEn: '+1.0 to +1.4 °C',
  },
  {
    id: 'strong',
    labelFr: 'Fort',
    labelEn: 'Strong',
    oniRangeFr: '+1,5 à +1,9 °C',
    oniRangeEn: '+1.5 to +1.9 °C',
  },
  {
    id: 'super',
    labelFr: 'Super El Niño',
    labelEn: 'Super El Niño',
    oniRangeFr: '≥ +2,0 °C',
    oniRangeEn: '≥ +2.0 °C',
  },
];

export const CLIMATE_ALERTS_TIMELINE_EVENTS: ClimateAlertTimelineEvent[] = [
  {
    id: 'enso-1982-12',
    dateIso: '1982-12',
    shortAxisLabel: '1982',
    periodLabelFr: 'Déc. 1982 – Mar. 1983',
    periodLabelEn: 'Dec 1982 – Mar 1983',
    phase: 'historical',
    intensity: 'super',
    oniPeakC: 2.2,
    iodState: 'IOD+ (+0.7°C)',
    agency: 'NOAA CPC · OMM / WMO',
    zones: ['madagascar', 'africa-sadc-comesa', 'americas', 'asia-asean', 'oceania'],
    zoneTagFr: 'Pacifique · Afrique australe · Australie · Amérique du Sud',
    zoneTagEn: 'Pacific · Southern Africa · Australia · South America',
    titleFr: 'Super El Niño historique 1982–1983 : bascule océanique majeure et sécheresse australe',
    titleEn: 'Historical 1982–1983 Super El Niño: major Pacific regime shift & southern droughts',
    summaryFr:
      'Premier épisode Super El Niño instrumenté par satellites modernes. Effondrement de l’upwelling péruvien, sécheresse sévère en Australie (Ash Wednesday) et Afrique australe, et déficit pluviométrique précoce dans le sud de Madagascar.',
    summaryEn:
      'First satellite-monitored Super El Niño event. Collapse of Peruvian coastal upwelling triggered extreme droughts in Australia and Southern Africa alongside torrential Andean floods.',
    impactMetricsFr: [
      'Pic ONI +2,2 °C (DJF 1982–83)',
      'Chute de −40 % des captures pélagiques Pérou',
      'Déficit céréalier Afrique australe −28 %',
    ],
    impactMetricsEn: [
      'ONI Peak +2.2 °C (DJF 1982–83)',
      '−40% Peruvian pelagic fishery collapse',
      '−28% Southern Africa grain output shortfall',
    ],
    actionTriggerFr:
      'Référence historique ayant fondé la modélisation moderne des téléconnexions ENSO tropicales.',
    actionTriggerEn:
      'Foundational benchmark establishing global tropical ENSO teleconnection monitoring.',
  },
  {
    id: 'enso-1997-11',
    dateIso: '1997-11',
    shortAxisLabel: '1997',
    periodLabelFr: 'Nov. 1997 – Fév. 1998',
    periodLabelEn: 'Nov 1997 – Feb 1998',
    phase: 'historical',
    intensity: 'super',
    oniPeakC: 2.4,
    iodState: 'IOD+ (+1.3°C)',
    agency: 'OMM · IRI · ASEAN ASMC',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'asia-asean', 'americas'],
    zoneTagFr: 'Océan Indien · Corne de l’Afrique · ASEAN · Amériques',
    zoneTagEn: 'Indian Ocean · Horn of Africa · ASEAN · Americas',
    titleFr: 'Super El Niño 1997–1998 couplé IOD+ : déluges Est-africains et brumes ASEAN',
    titleEn: '1997–1998 Super El Niño + IOD+: East African floods & ASEAN peat haze',
    summaryFr:
      'Couplage extrême entre le Pacifique (+2,4 °C) et un Dipôle de l’Océan Indien positif record (+1,3 °C) : inondations majeures au Kenya/Somalie, blanchissement corallien massif dans l’océan Indien (COI) et sécheresse/feux de tourbières en Indonésie.',
    summaryEn:
      'Extreme Pacific (+2.4 °C) and Indian Ocean Dipole (+1.3 °C) coupling caused catastrophic floods across Kenya/Somalia, widespread IOC coral bleaching, and severe ASEAN forest/peatland haze.',
    impactMetricsFr: [
      'Pic ONI +2,4 °C · IOD+ +1,3 °C',
      '>45 % mortalité corallienne récifale OI',
      '>10 M ha brûlés en Asie du Sud-Est',
    ],
    impactMetricsEn: [
      'ONI Peak +2.4 °C · IOD+ +1.3 °C',
      '>45% coral bleaching across Indian Ocean reefs',
      '>10M ha burned across Southeast Asia',
    ],
    actionTriggerFr:
      'Institutionnalisation du suivi couplé ONI + IOD pour l’alerte cyclonique et récifale COI.',
    actionTriggerEn:
      'Established joint ONI + IOD tracking protocols across Indian Ocean cyclone & reef agencies.',
  },
  {
    id: 'enso-2009-12',
    dateIso: '2009-12',
    shortAxisLabel: '2009',
    periodLabelFr: 'Déc. 2009 – Fév. 2010',
    periodLabelEn: 'Dec 2009 – Feb 2010',
    phase: 'historical',
    intensity: 'strong',
    oniPeakC: 1.6,
    iodState: 'Neutral (+0.2°C)',
    agency: 'OMM · BOM · BMKG',
    zones: ['africa-sadc-comesa', 'asia-asean', 'oceania'],
    zoneTagFr: 'Asie du Sud-Est · Australie · Afrique australe',
    zoneTagEn: 'Southeast Asia · Australia · Southern Africa',
    titleFr: 'El Niño Modoki fort 2009–2010 : mousson asiatique déficitaire et tension rizicole',
    titleEn: '2009–2010 Strong Modoki El Niño: Asian monsoon shortfall & rice pressure',
    summaryFr:
      'Réchauffement centré sur le Pacifique central (+1,6 °C) perturbant la mousson indienne et les semis de riz en Asie du Sud-Est, avec épisodes de sécheresse ponctuels en Zambie, Malawi et Queensland.',
    summaryEn:
      'Central-Pacific focused warming (+1.6 °C) disrupted South & Southeast Asian monsoons alongside dry spells across Queensland, Zambia, and Malawi.',
    impactMetricsFr: [
      'Pic ONI +1,6 °C (Modoki central)',
      '−18 % pluies mousson Asie du Sud/ASEAN',
      'Hausse +22 % cours mondiaux riz & sucre',
    ],
    impactMetricsEn: [
      'ONI Peak +1.6 °C (Central Modoki)',
      '−18% South/SE Asian monsoon rainfall',
      '+22% global rice & sugar export volatility',
    ],
    actionTriggerFr:
      'Calibration des modèles de distinction El Niño canonique vs Modoki pour les prévisions SADC/ASEAN.',
    actionTriggerEn:
      'Calibrated canonical vs. Modoki ENSO indices in seasonal SADC and ASEAN crop models.',
  },
  {
    id: 'enso-2015-11',
    dateIso: '2015-11',
    shortAxisLabel: '2015',
    periodLabelFr: 'Nov. 2015 – Avr. 2016',
    periodLabelEn: 'Nov 2015 – Apr 2016',
    phase: 'historical',
    intensity: 'super',
    oniPeakC: 2.6,
    iodState: 'IOD+ (+0.8°C)',
    agency: 'FAO · SADC CSC · DGM · BNGRC',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'asia-asean', 'americas'],
    zoneTagFr: 'Grand Sud Madagascar · SADC · Mékong (ASEAN) · Caraïbes',
    zoneTagEn: 'Madagascar Grand Sud · SADC · Mekong (ASEAN) · Caribbean',
    titleFr: 'Super El Niño 2015–2016 : crise alimentaire aiguë dans le Grand Sud et la SADC',
    titleEn: '2015–2016 Super El Niño: acute Grand Sud & SADC food emergency',
    summaryFr:
      'Pire sécheresse depuis 35 ans sur la SADC et le Grand Sud malgache (Androy, Anosy, Atsimo-Andrefana : >1,14 M de personnes en urgence alimentaire), accompagnée d’une intrusion saline historique dans le delta du Mékong (Vietnam).',
    summaryEn:
      'Worst drought in 35 years across SADC and southern Madagascar (>1.14M in acute food insecurity in Androy/Anosy), paired with historic saltwater intrusion in Vietnam’s Mekong Delta.',
    impactMetricsFr: [
      'Pic ONI +2,6 °C (record XXIe s. à date)',
      '1,14 M pers. en insécurité sévère Grand Sud',
      '−45 % récolte maïs SADC · Mékong salinisé',
    ],
    impactMetricsEn: [
      'ONI Peak +2.6 °C',
      '1.14M in severe food crisis (Grand Sud)',
      '−45% SADC maize harvest · Mekong salinity shock',
    ],
    actionTriggerFr:
      'Mise en place des protocoles Cash+ FAO/BNGRC et seuils d’alerte précoce basés sur les prévisions saisonnières.',
    actionTriggerEn:
      'Triggered creation of FAO/BNGRC Cash+ shock-responsive protocols across Southern Madagascar.',
  },
  {
    id: 'enso-2019-10',
    dateIso: '2019-10',
    shortAxisLabel: '2019',
    periodLabelFr: 'Oct. – Déc. 2019',
    periodLabelEn: 'Oct – Dec 2019',
    phase: 'historical',
    intensity: 'moderate',
    oniPeakC: 1.0,
    iodState: 'IOD+ (+2.0°C)',
    agency: 'BOM · ICPAC · Copernicus',
    zones: ['indian-ocean-coi', 'africa-sadc-comesa', 'europe-mena', 'oceania'],
    zoneTagFr: 'Océan Indien · Corne de l’Afrique · Australie · MENA',
    zoneTagEn: 'Indian Ocean · Horn of Africa · Australia · MENA',
    titleFr: 'Alerte Modérée ENSO + Dipôle Indien extrême (+2,0 °C) : crues Corne & feux Australie',
    titleEn: 'Moderate ENSO + Extreme IOD (+2.0 °C): Horn floods & Australian bushfires',
    summaryFr:
      'Bien que l’anomalie Pacifique soit restée modérée (+1,0 °C), l’IOD+ record a déclenché des pluies torrentielles en Afrique de l’Est (COMESA), une invasion acridienne et la sécheresse Black Summer en Australie.',
    summaryEn:
      'Despite moderate Pacific warming (+1.0 °C), a record positive IOD drove destructive floods across East Africa/COMESA, desert locust outbreaks, and Australia’s Black Summer drought.',
    impactMetricsFr: [
      'ONI +1,0 °C · IOD+ extrême +2,0 °C',
      '2,8 M déplacés & sinistrés Afrique de l’Est',
      'Stress hydrique accru bassin méditerranéen',
    ],
    impactMetricsEn: [
      'ONI +1.0 °C · Extreme IOD+ +2.0 °C',
      '2.8M flood-affected across East Africa',
      'Severe dry soil moisture anomalies in Oceania',
    ],
    actionTriggerFr:
      'Intégration obligatoire de l’indice IOD dans la matrice de pondération des risques COI/Madagascar.',
    actionTriggerEn:
      'Made IOD coupling mandatory inside Indian Ocean & Madagascar risk-weighting matrices.',
  },
  {
    id: 'enso-2023-11',
    dateIso: '2023-11',
    shortAxisLabel: '2023',
    periodLabelFr: 'Nov. 2023 – Avr. 2024',
    periodLabelEn: 'Nov 2023 – Apr 2024',
    phase: 'historical',
    intensity: 'super',
    oniPeakC: 2.0,
    iodState: 'IOD+ (+1.1°C)',
    agency: 'OMM · FEWS NET · Copernicus C3S',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'asia-asean', 'americas', 'europe-mena'],
    zoneTagFr: 'SADC · Amazonie · Canal de Panama · Asie · Europe',
    zoneTagEn: 'SADC · Amazon · Panama Canal · Asia · Europe',
    titleFr: 'Super El Niño 2023–2024 : urgences nationales SADC, Panama à sec et records thermiques',
    titleEn: '2023–2024 Super El Niño: SADC national emergencies, Panama low water & heat records',
    summaryFr:
      'Déclenchement d’états d’urgence sécheresse en Zambie, Zimbabwe et Malawi ; restrictions de transit du canal de Panama et baisse de niveau du barrage de Kariba avec tension sur les prix du riz à Antananarivo.',
    summaryEn:
      'Triggered national drought emergencies across Zambia, Zimbabwe, and Malawi; forced Panama Canal draft restrictions; and drove historic Amazon low-water transport disruptions.',
    impactMetricsFr: [
      'Pic ONI +2,0 °C · Année record +1,48 °C',
      '−36 % transit quotidien canal de Panama',
      '20 M+ pers. assistées en Afrique australe',
    ],
    impactMetricsEn: [
      'ONI Peak +2.0 °C · Global heat benchmark',
      '−36% Panama Canal daily vessel transits',
      '20M+ needing drought relief across SADC',
    ],
    actionTriggerFr:
      'Déploiement des tableaux de suivi combinés fret maritime, hydroélectricité et prix céréaliers locaux.',
    actionTriggerEn:
      'Accelerated joint freight, hydropower, and local cereal inflation early-warning dashboards.',
  },
  {
    id: 'enso-2026-09',
    dateIso: '2026-09',
    shortAxisLabel: 'Sep 26',
    periodLabelFr: 'Sept. 2026',
    periodLabelEn: 'Sep 2026',
    phase: 'historical',
    intensity: 'moderate',
    oniPeakC: 1.4,
    iodState: 'IOD+ (+0.6°C)',
    agency: 'OMM / WMO · SWIOCOF-15 · DGM',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa'],
    zoneTagFr: 'Madagascar · Bassin COI · Afrique australe',
    zoneTagEn: 'Madagascar · IOC Basin · Southern Africa',
    titleFr: 'Veille Pré-Saisonnière Sept. 2026 : franchissement ONI +1,4 °C et pré-alerte SWIOCOF-15',
    titleEn: 'Sep 2026 Pre-Season Watch: ONI crosses +1.4 °C & SWIOCOF-15 early advisory',
    summaryFr:
      'Les bouées TAO/TRITON confirment l’accélération du réchauffement équatorial (+1,4 °C) et la formation d’un IOD+. Les prévisions saisonnières SWIOCOF-15 enclenchent le pré-positionnement des semences 90 jours.',
    summaryEn:
      'TAO/TRITON equatorial moorings confirm +1.4 °C warming alongside emerging IOD+. SWIOCOF-15 consensus triggers pre-season 90-day drought-tolerant seed prepositioning.',
    impactMetricsFr: [
      'ONI observé +1,4 °C (Modéré ascendant)',
      'Pré-positionnement semences sorgho/mil',
      'Activation veille hydrologique RIA',
    ],
    impactMetricsEn: [
      'Observed ONI +1.4 °C (Rising Moderate)',
      '90-day sorghum/millet seed stockpiles triggered',
      'RIA hydropower reservoir watch activated',
    ],
    actionTriggerFr:
      'Ouverture des fenêtres d’action anticipatoire avant le démarrage des pluies d’octobre–novembre.',
    actionTriggerEn:
      'Opened anticipatory action windows ahead of Oct–Nov Southern Hemisphere planting onset.',
  },
  {
    id: 'enso-2026-10',
    dateIso: '2026-10',
    shortAxisLabel: 'Oct 26',
    periodLabelFr: 'Oct. 2026 (Actif)',
    periodLabelEn: 'Oct 2026 (Active)',
    phase: 'active',
    intensity: 'strong',
    oniPeakC: 1.9,
    iodState: 'IOD+ (+0.9°C)',
    agency: 'DGM · BNGRC · SADC CSC',
    zones: ['madagascar', 'africa-sadc-comesa'],
    zoneTagFr: 'Grand Sud Madagascar · Zambie · Zimbabwe',
    zoneTagEn: 'Madagascar Grand Sud · Zambia · Zimbabwe',
    titleFr: 'Bulletin Actif Oct. 2026 : retard de mousson australe et déficit hydrique précoce',
    titleEn: 'Active Oct 2026 Bulletin: delayed southern rains & early soil-moisture deficit',
    summaryFr:
      'L’anomalie ONI atteint +1,9 °C (seuil Fort). Premiers retards de précipitations de −25 % à −30 % sur Androy, Anosy et la ceinture maïsicole zambienne ; activation des transferts monétaires préventifs.',
    summaryEn:
      'ONI strengthens to +1.9 °C (Strong threshold). Early −25% to −30% rainfall deficits hit Androy, Anosy, and Zambia’s maize belt, activating shock-responsive cash transfers.',
    impactMetricsFr: [
      'ONI +1,9 °C · Déficit pluie −25 % à −30 %',
      'Retard semis riz/maïs sur 14 districts',
      'Déclenchement alerte SMS 3-2-1 BNGRC',
    ],
    impactMetricsEn: [
      'ONI +1.9 °C · −25% to −30% early rain deficit',
      'Rice/maize sowing delayed across 14 districts',
      'BNGRC 3-2-1 farmer SMS triggers active',
    ],
    actionTriggerFr:
      'Conseiller aux coopératives le report des semis pluviaux longs et l’usage des variétés 90 jours.',
    actionTriggerEn:
      'Advise cooperatives to defer long-cycle rainfed sowing toward 90-day resilient cultivars.',
  },
  {
    id: 'enso-2026-11',
    dateIso: '2026-11',
    shortAxisLabel: 'Nov 26',
    periodLabelFr: 'Nov. 2026 (Bulletin Actuel)',
    periodLabelEn: 'Nov 2026 (Current Bulletin)',
    phase: 'active',
    intensity: 'super',
    oniPeakC: 3.5,
    iodState: 'IOD+ (+1.2°C)',
    agency: 'SWIOCOF-15 · DGM · OMM · FEWS NET',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'asia-asean'],
    zoneTagFr: 'Madagascar (Grand Sud & NE) · Mascareignes · COMESA · ASEAN',
    zoneTagEn: 'Madagascar (Grand Sud & NE) · Mascarenes · COMESA · ASEAN',
    titleFr: 'Alerte Rouge Super El Niño Nov. 2026 : ONI +3,5 °C, Grand Sud & décalage cyclonique Est',
    titleEn: 'Nov 2026 Super El Niño Red Alert: ONI +3.5 °C, Grand Sud drought & cyclone shift',
    summaryFr:
      'Bulletin actif majeur : déficit hydrique de −30 % à −50 % dans le Grand Sud (3,72 M de personnes exposées), excès pluvieux précoce SAVA/Analanjirofo, décalage des trajectoires cycloniques vers Rodrigues et hausse tendancielle du riz.',
    summaryEn:
      'Current primary advisory: −30% to −50% rainfall deficit in Grand Sud (3.72M exposed), heavy early rains in NE Madagascar (SAVA), eastward cyclone shift toward Rodrigues, and upward rice price pressure.',
    impactMetricsFr: [
      'ONI actif +3,5 °C · Temp. +2 à +4 °C',
      '3,72 M personnes exposées (FAO Oct.–Fév.)',
      'Crues COMESA (Kenya/Somalie) vs sécheresse SADC',
    ],
    impactMetricsEn: [
      'Active ONI +3.5 °C · Heat +2 to +4 °C',
      '3.72M exposed population (FAO Oct–Feb)',
      'COMESA East Africa floods vs. SADC drought',
    ],
    actionTriggerFr:
      'Activation pleine du plan Cash+, stocks tampons rizicoles Toamasina/Toliara et vigilance crues Nord-Est.',
    actionTriggerEn:
      'Full activation of Cash+ relief, Toamasina/Toliara grain buffers, and NE flood watches.',
  },
  {
    id: 'enso-2027-01',
    dateIso: '2027-01',
    shortAxisLabel: 'Jan 27',
    periodLabelFr: 'Janv. 2027 (Prévision)',
    periodLabelEn: 'Jan 2027 (Forecast)',
    phase: 'upcoming',
    intensity: 'super',
    oniPeakC: 4.1,
    iodState: 'IOD+ (+1.4°C)',
    agency: 'OMM / WMO · NOAA CPC · CycloneOI',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'asia-asean', 'americas', 'oceania'],
    zoneTagFr: 'Indo-Pacifique · Madagascar · SADC · ASEAN · Amériques · Océanie',
    zoneTagEn: 'Indo-Pacific · Madagascar · SADC · ASEAN · Americas · Oceania',
    titleFr: 'Pic record projeté Janv. 2027 : ONI +4,1 °C, asymétrie pluviale & risque cyclonique intense',
    titleEn: 'Projected Jan 2027 Super Peak: ONI +4.1 °C, extreme rainfall divergence & cyclone risk',
    summaryFr:
      'Maximum thermique modélisé de l’épisode 2026–2027 (+4,1 °C). Contraste maximal entre pluies convectives extrêmes sur le Nord-Est malgache/Mascareignes, sécheresse sévère en Australie/SADC et stress thermique sur les cultures ASEAN.',
    summaryEn:
      'Projected thermal peak of the 2026–2027 episode (+4.1 °C). Maximum contrast between intense NE Madagascar/Mascarene convective rains and severe drought across Grand Sud, SADC, and Eastern Australia.',
    impactMetricsFr: [
      'Pic ONI projeté +4,1 °C (historique)',
      'Choc PIB mondial modélisé T1 2027 maximal',
      'Risque crues côtières & glissements SAVA/Diana',
    ],
    impactMetricsEn: [
      'Projected ONI Peak +4.1 °C (historic)',
      'Peak Q1 2027 global agricultural & GDP shock',
      'Heightened SAVA/Diana flood & landslide hazard',
    ],
    actionTriggerFr:
      'Déclenchement automatique des polices d’assurance paramétriques ARC / CCRIF et abris cycloniques.',
    actionTriggerEn:
      'Automated parametric ARC/CCRIF insurance payout verification & cyclone shelter readiness.',
  },
  {
    id: 'enso-2027-02',
    dateIso: '2027-02',
    shortAxisLabel: 'Fév 27',
    periodLabelFr: 'Fév. 2027 (Prévision)',
    periodLabelEn: 'Feb 2027 (Forecast)',
    phase: 'upcoming',
    intensity: 'super',
    oniPeakC: 3.8,
    iodState: 'IOD+ (+1.0°C)',
    agency: 'FEWS NET · OdR · ANMCC',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa'],
    zoneTagFr: 'Antananarivo · Lac Alaotra · RIA · Corridors SADC',
    zoneTagEn: 'Antananarivo · Lake Alaotra · RIA Grid · SADC Corridors',
    titleFr: 'Tension Soudure & Énergie Fév. 2027 : riz projeté à 3 200 MGA/kg (+25,5 %) & étiage RIA',
    titleEn: 'Feb 2027 Lean-Season & Grid Alert: rice projected at 3,200 MGA/kg (+25.5%) & RIA drawdown',
    summaryFr:
      'Pic saisonnier de soudure avant la grande récolte : le riz local Antananarivo atteint 3 200 MGA/kg sous l’effet du déficit Alaotra/Hautes Terres et du fret maritime. Tension hydroélectrique simultanée à Andekaleka et Kariba.',
    summaryEn:
      'Peak pre-harvest lean season: Antananarivo local rice hits 3,200 MGA/kg (+25.5%) amid Alaotra shortfalls and import freight costs, coinciding with Andekaleka & Kariba hydropower drawdowns.',
    impactMetricsFr: [
      'Riz local 3 200 MGA/kg (+25,5 % vs base)',
      'Inflation alimentaire +6 à +9 pts CPI',
      'Vigilance capacité hydroélectrique RIA / Kariba',
    ],
    impactMetricsEn: [
      'Local rice 3,200 MGA/kg (+25.5% vs baseline)',
      '+6 to +9 pp food CPI inflation pressure',
      'RIA & Kariba hydropower reserve drawdown watch',
    ],
    actionTriggerFr:
      'Libération ciblée des stocks régulateurs OdR/ONN et délestage thermal/solaire d’appoint sur le RIA.',
    actionTriggerEn:
      'Targeted release of buffer grain stocks and solar/thermal backup dispatch on the RIA grid.',
  },
  {
    id: 'enso-2027-04',
    dateIso: '2027-04',
    shortAxisLabel: 'Avr 27',
    periodLabelFr: 'Avr. – Mai 2027 (Prévision)',
    periodLabelEn: 'Apr – May 2027 (Forecast)',
    phase: 'upcoming',
    intensity: 'strong',
    oniPeakC: 1.8,
    iodState: 'Neutral (+0.3°C)',
    agency: 'MAEP · FAO · ASEAN AFSIS',
    zones: ['madagascar', 'indian-ocean-coi', 'asia-asean'],
    zoneTagFr: '23 Régions Madagascar · Îles COI · Asie du Sud-Est',
    zoneTagEn: '23 Madagascar Regions · IOC Islands · Southeast Asia',
    titleFr: 'Bilan Grande Récolte Avr. 2027 : audit des rendements riz/manioc et stocks ASEAN',
    titleEn: 'Apr 2027 Main Harvest Audit: Madagascar rice/cassava deficits & ASEAN export tightens',
    summaryFr:
      'Reflux de l’ONI vers +1,8 °C mais cumul complet des pertes de récolte *Vary Vakiambiaty* et de maïs. Sur les marchés ASEAN, les restrictions ponctuelles à l’exportation renchérissent les importations rizicoles de l’océan Indien.',
    summaryEn:
      'ONI recedes toward +1.8 °C while main Madagascar rice/maize harvest shortfalls materialize. ASEAN supply tightening elevates benchmark import prices for Indian Ocean island states.',
    impactMetricsFr: [
      'ONI en reflux +1,8 °C (phase post-pic)',
      'Déficit rizicole régional −14 % à −28 %',
      'Audit consolidé pertes 119 districts',
    ],
    impactMetricsEn: [
      'Post-peak ONI +1.8 °C (Strong decay)',
      '−14% to −28% regional rice yield shortfall',
      'Consolidated 119-district damage audit',
    ],
    actionTriggerFr:
      'Lancement de la campagne de contre-saison irriguée (*Vary Jeby*) et sécurisation des contrats d’importation COI.',
    actionTriggerEn:
      'Launch dry-season irrigated rice (*Vary Jeby*) and lock in pooled IOC grain import contracts.',
  },
  {
    id: 'enso-2027-10',
    dateIso: '2027-10',
    shortAxisLabel: 'Oct 27',
    periodLabelFr: 'Oct. 2027 (Prévision)',
    periodLabelEn: 'Oct 2027 (Forecast)',
    phase: 'upcoming',
    intensity: 'moderate',
    oniPeakC: 1.3,
    iodState: 'Neutral (-0.1°C)',
    agency: 'NOAA CPC · Copernicus C3S · CIIFEN',
    zones: ['africa-sadc-comesa', 'americas', 'europe-mena'],
    zoneTagFr: 'Europe & MENA · Amériques · Afrique',
    zoneTagEn: 'Europe & MENA · Americas · Africa',
    titleFr: 'Transition Automne 2027 : refroidissement progressif et rééquilibrage hydro-agricole',
    titleEn: 'Oct 2027 Autumn Transition: gradual Pacific cooling & hydro-agricultural rebalance',
    summaryFr:
      'Atténuation de l’anomalie pacifique (+1,3 °C) vers la neutralité. En Europe méridionale et MENA, suivi des recharges de nappes après le stress estival ; préparation du basculement potentiel vers La Niña en 2028.',
    summaryEn:
      'Pacific anomaly eases toward +1.3 °C. Southern Europe and MENA monitor autumn aquifer recharge while global agencies prepare warning protocols for a possible 2028 La Niña swing.',
    impactMetricsFr: [
      'ONI +1,3 °C · Transition neutre amorcée',
      'Vigilance recharge nappes Méditerranée/MENA',
      'Réouverture fenêtres semis précoces 2027–28',
    ],
    impactMetricsEn: [
      'ONI +1.3 °C · Transition toward neutral phase',
      'Mediterranean/MENA autumn groundwater audit',
      '2027–28 early sowing restoration window',
    ],
    actionTriggerFr:
      'Révision des portefeuilles de semences pour prévenir un basculement humide soudain l’année suivante.',
    actionTriggerEn:
      'Rebalance seed portfolios ahead of potential wet-phase reversal in the following season.',
  },
  {
    id: 'enso-2028-06',
    dateIso: '2028-06',
    shortAxisLabel: 'Jun 28',
    periodLabelFr: 'Juin – Nov. 2028 (Projection)',
    periodLabelEn: 'Jun – Nov 2028 (Projection)',
    phase: 'upcoming',
    intensity: 'moderate',
    oniPeakC: 1.1,
    iodState: 'IOD− (-0.7°C)',
    agency: 'OMM / WMO · SADC CSC · BOM',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'oceania'],
    zoneTagFr: 'Madagascar · COI · SADC · Australie / Pacifique',
    zoneTagEn: 'Madagascar · IOC · SADC · Australia / Pacific',
    titleFr: 'Inversion Rapide 2028 (Whiplash ENSO) : risque de crues éclair sur sols durcis SADC & COI',
    titleEn: 'Mid-2028 ENSO Whiplash Alert: flash-flood hazard on drought-hardened SADC & IOC soils',
    summaryFr:
      'La sortie d’un Super El Niño entraîne fréquemment un basculement brutal vers La Niña (amplitude équivalente +1,1 °C de choc inverse). Pluies intenses sur sols compactés par la sécheresse en SADC/Madagascar et assèchement COMESA.',
    summaryEn:
      'Post-Super El Niño transitions frequently trigger rapid La Niña whiplash: intense rains over crusted Southern African and Madagascar soils paired with East African/COMESA dry spells.',
    impactMetricsFr: [
      'Amplitude choc inverse ~1,1 °C · IOD−',
      'Risque crues éclair & érosion bassins versants',
      'Inversion asymétrie SADC (+) / COMESA (−)',
    ],
    impactMetricsEn: [
      'Phase-flip shock magnitude ~1.1 °C · IOD−',
      'Flash-flood & watershed erosion spike',
      'Flipped SADC (wet) vs. COMESA (dry) dipole',
    ],
    actionTriggerFr:
      'Curage des canaux d’irrigation, diguettes anti-érosives et passage aux variétés tolérantes à l’ennoyage.',
    actionTriggerEn:
      'Clear drainage canals, reinforce anti-erosion bunds, and switch to flood-tolerant cultivars.',
  },
  {
    id: 'enso-2030-02',
    dateIso: '2030-02',
    shortAxisLabel: '2030',
    periodLabelFr: 'Fév. 2030 (Horizon 2030)',
    periodLabelEn: 'Feb 2030 (2030 Horizon)',
    phase: 'upcoming',
    intensity: 'strong',
    oniPeakC: 1.8,
    iodState: 'IOD+ (+0.7°C)',
    agency: 'GIEC / IPCC AR6 · Copernicus · ASMC',
    zones: ['asia-asean', 'americas', 'europe-mena', 'oceania'],
    zoneTagFr: 'ASEAN · Amériques · Europe & MENA · Océanie',
    zoneTagEn: 'ASEAN · Americas · Europe & MENA · Oceania',
    titleFr: 'Cycle Récurrent 2030 : stress thermique composé (+1,8 °C ONI sur réchauffement tendanciel)',
    titleEn: '2030 Recurrent Cycle: compounded thermal stress (+1.8 °C ONI on warming baseline)',
    summaryFr:
      'Modélisation décennale 2028–2032 : un événement El Niño fort (+1,8 °C) superposé au réchauffement climatique de fond amplifie les pics de demande électrique, les canicules européennes/MENA et la volatilité logistique ASEAN-Amériques.',
    summaryEn:
      '2028–2032 decadal outlook: a Strong (+1.8 °C) El Niño superimposed on baseline warming magnifies ASEAN cooling power demand, European/MENA summer heatwaves, and maritime trade bottlenecks.',
    impactMetricsFr: [
      'ONI modélisé +1,8 °C (cycle 3–4 ans)',
      'Amplification canicules Europe/MENA +22 %',
      'Stress pêcheries thonières Pacifique Ouest',
    ],
    impactMetricsEn: [
      'Modeled ONI +1.8 °C (3–4 yr recurrence)',
      '+22% compounded Europe/MENA heatwave risk',
      'Western Pacific tuna migration disruption',
    ],
    actionTriggerFr:
      'Alignement des chaînes d’approvisionnement portuaire et diversification des sources hydro-solaires.',
    actionTriggerEn:
      'Re-route critical port supply chains and expand hybrid hydro-solar grid buffers.',
  },
  {
    id: 'enso-2032-03',
    dateIso: '2032-03',
    shortAxisLabel: '2032',
    periodLabelFr: 'Mar. 2032 (Bilan Décennal)',
    periodLabelEn: 'Mar 2032 (Decadal Horizon)',
    phase: 'upcoming',
    intensity: 'moderate',
    oniPeakC: 1.2,
    iodState: 'Neutral (+0.2°C)',
    agency: 'Observatoire M&G · UNDRR · OMM',
    zones: ['madagascar', 'indian-ocean-coi', 'africa-sadc-comesa', 'europe-mena'],
    zoneTagFr: 'Madagascar · COI · Afrique · Europe / MENA',
    zoneTagEn: 'Madagascar · IOC · Africa · Europe / MENA',
    titleFr: 'Jalon Résilience 2032 : évaluation post-adaptation des réserves et systèmes d’alerte',
    titleEn: '2032 Resilience Milestone: post-adaptation audit of grain buffers & early warnings',
    summaryFr:
      'Horizon de clôture de la trajectoire 2027–2032 : mesure de la réduction des pertes PIB évitées grâce aux réserves régionales COI/SADC, à l’irrigation solaire du Grand Sud et à la couverture d’alerte précoce multi-risques.',
    summaryEn:
      'Closing horizon of the 2027–2032 model: evaluates avoided GDP losses achieved through IOC/SADC grain reserves, Grand Sud solar micro-irrigation, and universal multi-hazard early warnings.',
    impactMetricsFr: [
      'ONI modéré +1,2 °C · Trajectoire clôture',
      '−32 % à −45 % pertes évitées si plan actif',
      'Couverture alerte précoce 195 pays ONU',
    ],
    impactMetricsEn: [
      'Moderate ONI +1.2 °C · Horizon closure',
      '32%–45% avoided loss under active resilience',
      'Full 195-country UN early-warning tracking',
    ],
    actionTriggerFr:
      'Consolidation budgétaire nationale et pérennisation des mécanismes d’assurance climatique souveraine.',
    actionTriggerEn:
      'Lock in sovereign climate risk-financing budgets and permanent multi-zone food reserves.',
  },
];

export interface TimelineFilterParams {
  events?: ClimateAlertTimelineEvent[];
  intensity: 'all' | AlertIntensity;
  zone: AlertGeoZoneId;
  phase: 'all' | AlertPhaseStatus;
  sortOrder?: TimelineSortOrder;
}

export function filterClimateAlertEvents({
  events = CLIMATE_ALERTS_TIMELINE_EVENTS,
  intensity,
  zone,
  phase,
  sortOrder = 'asc',
}: TimelineFilterParams): ClimateAlertTimelineEvent[] {
  const filtered = events.filter((ev) => {
    if (intensity !== 'all' && ev.intensity !== intensity) return false;
    if (zone !== 'all' && !ev.zones.includes(zone)) return false;
    if (phase !== 'all' && ev.phase !== phase) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    const cmp = a.dateIso.localeCompare(b.dateIso);
    return sortOrder === 'asc' ? cmp : -cmp;
  });
}

export interface TimelineSummaryStats {
  total: number;
  historicalCount: number;
  activeCount: number;
  upcomingCount: number;
  superCount: number;
  strongCount: number;
  moderateCount: number;
  maxOniC: number;
}

export function summarizeFilteredTimeline(
  events: ClimateAlertTimelineEvent[],
): TimelineSummaryStats {
  let historicalCount = 0;
  let activeCount = 0;
  let upcomingCount = 0;
  let superCount = 0;
  let strongCount = 0;
  let moderateCount = 0;
  let maxOniC = 0;

  for (const ev of events) {
    if (ev.phase === 'historical') historicalCount += 1;
    else if (ev.phase === 'active') activeCount += 1;
    else upcomingCount += 1;

    if (ev.intensity === 'super') superCount += 1;
    else if (ev.intensity === 'strong') strongCount += 1;
    else moderateCount += 1;

    if (ev.oniPeakC > maxOniC) maxOniC = ev.oniPeakC;
  }

  return {
    total: events.length,
    historicalCount,
    activeCount,
    upcomingCount,
    superCount,
    strongCount,
    moderateCount,
    maxOniC,
  };
}
