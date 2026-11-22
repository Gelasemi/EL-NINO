import type { UnZoneId } from './worldEnso195Data';

export interface GeoCoord {
  lat: number;
  lng: number;
}

/**
 * Exact capital / geographic centroid coordinates for all 195 UN countries
 * matching every `iso2` entry in `WORLD_195_COUNTRIES`.
 */
export const WORLD_COORDS_BY_ISO2: Record<string, GeoCoord> = {
  // ================= AFRIQUE (54) =================
  ZA: { lat: -25.75, lng: 28.19 }, // Afrique du Sud (Pretoria)
  DZ: { lat: 36.75, lng: 3.06 }, // Algérie (Alger)
  AO: { lat: -8.84, lng: 13.23 }, // Angola (Luanda)
  BJ: { lat: 6.49, lng: 2.63 }, // Bénin (Porto-Novo)
  BW: { lat: -24.65, lng: 25.91 }, // Botswana (Gaborone)
  BF: { lat: 12.37, lng: -1.52 }, // Burkina Faso (Ouagadougou)
  BI: { lat: -3.43, lng: 29.93 }, // Burundi (Gitega)
  CV: { lat: 14.93, lng: -23.51 }, // Cabo Verde (Praia)
  CM: { lat: 3.85, lng: 11.50 }, // Cameroun (Yaoundé)
  KM: { lat: -11.70, lng: 43.26 }, // Comores (Moroni)
  CG: { lat: -4.27, lng: 15.28 }, // Congo (Brazzaville)
  CI: { lat: 6.83, lng: -5.29 }, // Côte d'Ivoire (Yamoussoukro)
  DJ: { lat: 11.59, lng: 43.15 }, // Djibouti
  EG: { lat: 30.04, lng: 31.24 }, // Égypte (Le Caire)
  ER: { lat: 15.32, lng: 38.93 }, // Érythrée (Asmara)
  SZ: { lat: -26.31, lng: 31.13 }, // Eswatini (Mbabane)
  ET: { lat: 9.03, lng: 38.74 }, // Éthiopie (Addis-Abeba)
  GA: { lat: 0.42, lng: 9.47 }, // Gabon (Libreville)
  GM: { lat: 13.45, lng: -16.58 }, // Gambie (Banjul)
  GH: { lat: 5.56, lng: -0.19 }, // Ghana (Accra)
  GN: { lat: 9.64, lng: -13.58 }, // Guinée (Conakry)
  GW: { lat: 11.86, lng: -15.60 }, // Guinée-Bissau (Bissau)
  GQ: { lat: 3.75, lng: 8.78 }, // Guinée équatoriale (Malabo)
  KE: { lat: -1.29, lng: 36.82 }, // Kenya (Nairobi)
  LS: { lat: -29.31, lng: 27.48 }, // Lesotho (Maseru)
  LR: { lat: 6.31, lng: -10.80 }, // Liberia (Monrovia)
  LY: { lat: 32.89, lng: 13.19 }, // Libye (Tripoli)
  MG: { lat: -18.88, lng: 47.51 }, // Madagascar (Antananarivo)
  MW: { lat: -13.98, lng: 33.79 }, // Malawi (Lilongwe)
  ML: { lat: 12.64, lng: -8.00 }, // Mali (Bamako)
  MA: { lat: 34.02, lng: -6.84 }, // Maroc (Rabat)
  MU: { lat: -20.16, lng: 57.50 }, // Maurice (Port-Louis)
  MR: { lat: 18.07, lng: -15.96 }, // Mauritanie (Nouakchott)
  MZ: { lat: -25.97, lng: 32.57 }, // Mozambique (Maputo)
  NA: { lat: -22.56, lng: 17.08 }, // Namibie (Windhoek)
  NE: { lat: 13.51, lng: 2.13 }, // Niger (Niamey)
  NG: { lat: 9.06, lng: 7.50 }, // Nigeria (Abuja)
  UG: { lat: 0.35, lng: 32.58 }, // Ouganda (Kampala)
  CF: { lat: 4.39, lng: 18.56 }, // République centrafricaine (Bangui)
  CD: { lat: -4.44, lng: 15.27 }, // RDC (Kinshasa)
  RW: { lat: -1.94, lng: 30.06 }, // Rwanda (Kigali)
  ST: { lat: 0.34, lng: 6.73 }, // Sao Tomé-et-Principe
  SN: { lat: 14.72, lng: -17.47 }, // Sénégal (Dakar)
  SC: { lat: -4.62, lng: 55.45 }, // Seychelles (Victoria)
  SL: { lat: 8.48, lng: -13.23 }, // Sierra Leone (Freetown)
  SO: { lat: 2.05, lng: 45.32 }, // Somalie (Mogadiscio)
  SD: { lat: 15.50, lng: 32.56 }, // Soudan (Khartoum)
  SS: { lat: 4.86, lng: 31.57 }, // Soudan du Sud (Juba)
  TZ: { lat: -6.16, lng: 35.75 }, // Tanzanie (Dodoma)
  TD: { lat: 12.13, lng: 15.06 }, // Tchad (N'Djamena)
  TG: { lat: 6.13, lng: 1.22 }, // Togo (Lomé)
  TN: { lat: 36.81, lng: 10.18 }, // Tunisie (Tunis)
  ZM: { lat: -15.39, lng: 28.32 }, // Zambie (Lusaka)
  ZW: { lat: -17.83, lng: 31.05 }, // Zimbabwe (Harare)

  // ================= ASIE (48) =================
  AF: { lat: 34.53, lng: 69.17 }, // Afghanistan (Kaboul)
  SA: { lat: 24.71, lng: 46.68 }, // Arabie saoudite (Riyad)
  AM: { lat: 40.18, lng: 44.51 }, // Arménie (Erevan)
  AZ: { lat: 40.41, lng: 49.87 }, // Azerbaïdjan (Bakou)
  BH: { lat: 26.23, lng: 50.59 }, // Bahreïn (Manama)
  BD: { lat: 23.81, lng: 90.41 }, // Bangladesh (Dacca)
  BT: { lat: 27.47, lng: 89.64 }, // Bhoutan (Thimphou)
  MM: { lat: 19.76, lng: 96.08 }, // Myanmar (Naypyidaw)
  BN: { lat: 4.90, lng: 114.94 }, // Brunei (Bandar Seri Begawan)
  KH: { lat: 11.56, lng: 104.93 }, // Cambodge (Phnom Penh)
  CN: { lat: 39.90, lng: 116.41 }, // Chine (Pékin)
  CY: { lat: 35.19, lng: 33.38 }, // Chypre (Nicosie)
  KP: { lat: 39.04, lng: 125.76 }, // Corée du Nord (Pyongyang)
  KR: { lat: 37.57, lng: 126.98 }, // Corée du Sud (Séoul)
  AE: { lat: 24.45, lng: 54.38 }, // Émirats arabes unis (Abou Dabi)
  PS: { lat: 31.90, lng: 35.20 }, // État de Palestine (Ramallah)
  GE: { lat: 41.72, lng: 44.83 }, // Géorgie (Tbilissi)
  IN: { lat: 28.61, lng: 77.21 }, // Inde (New Delhi)
  ID: { lat: -6.21, lng: 106.85 }, // Indonésie (Jakarta)
  IQ: { lat: 33.32, lng: 44.37 }, // Irak (Bagdad)
  IR: { lat: 35.69, lng: 51.39 }, // Iran (Téhéran)
  IL: { lat: 31.77, lng: 35.21 }, // Israël
  JP: { lat: 35.68, lng: 139.65 }, // Japon (Tokyo)
  JO: { lat: 31.95, lng: 35.91 }, // Jordanie (Amman)
  KZ: { lat: 51.16, lng: 71.47 }, // Kazakhstan (Astana)
  KG: { lat: 42.87, lng: 74.57 }, // Kirghizistan (Bichkek)
  KW: { lat: 29.38, lng: 47.98 }, // Koweït
  LA: { lat: 17.97, lng: 102.63 }, // Laos (Vientiane)
  LB: { lat: 33.89, lng: 35.50 }, // Liban (Beyrouth)
  MY: { lat: 3.14, lng: 101.69 }, // Malaisie (Kuala Lumpur)
  MV: { lat: 4.18, lng: 73.51 }, // Maldives (Malé)
  MN: { lat: 47.89, lng: 106.91 }, // Mongolie (Oulan-Bator)
  NP: { lat: 27.72, lng: 85.32 }, // Népal (Katmandou)
  OM: { lat: 23.59, lng: 58.38 }, // Oman (Mascate)
  UZ: { lat: 41.30, lng: 69.24 }, // Ouzbékistan (Tachkent)
  PK: { lat: 33.68, lng: 73.05 }, // Pakistan (Islamabad)
  PH: { lat: 14.60, lng: 120.98 }, // Philippines (Manille)
  QA: { lat: 25.29, lng: 51.53 }, // Qatar (Doha)
  SG: { lat: 1.35, lng: 103.82 }, // Singapour
  LK: { lat: 6.93, lng: 79.86 }, // Sri Lanka (Colombo)
  SY: { lat: 33.51, lng: 36.28 }, // Syrie (Damas)
  TJ: { lat: 38.56, lng: 68.79 }, // Tadjikistan (Douchanbé)
  TH: { lat: 13.76, lng: 100.50 }, // Thaïlande (Bangkok)
  TL: { lat: -8.56, lng: 125.57 }, // Timor oriental (Dili)
  TM: { lat: 37.96, lng: 58.33 }, // Turkménistan (Achgabat)
  TR: { lat: 39.93, lng: 32.86 }, // Turquie (Ankara)
  VN: { lat: 21.03, lng: 105.83 }, // Viêt Nam (Hanoï)
  YE: { lat: 15.37, lng: 44.19 }, // Yémen (Sanaa)

  // ================= EUROPE (44) =================
  AL: { lat: 41.33, lng: 19.82 }, // Albanie (Tirana)
  DE: { lat: 52.52, lng: 13.40 }, // Allemagne (Berlin)
  AD: { lat: 42.51, lng: 1.52 }, // Andorre
  AT: { lat: 48.21, lng: 16.37 }, // Autriche (Vienne)
  BE: { lat: 50.85, lng: 4.35 }, // Belgique (Bruxelles)
  BY: { lat: 53.90, lng: 27.56 }, // Biélorussie (Minsk)
  BA: { lat: 43.86, lng: 18.41 }, // Bosnie-Herzégovine (Sarajevo)
  BG: { lat: 42.70, lng: 23.32 }, // Bulgarie (Sofia)
  HR: { lat: 45.81, lng: 15.98 }, // Croatie (Zagreb)
  DK: { lat: 55.68, lng: 12.57 }, // Danemark (Copenhague)
  ES: { lat: 40.42, lng: -3.70 }, // Espagne (Madrid)
  EE: { lat: 59.44, lng: 24.75 }, // Estonie (Tallinn)
  FI: { lat: 60.17, lng: 24.94 }, // Finlande (Helsinki)
  FR: { lat: 48.86, lng: 2.35 }, // France (Paris)
  GR: { lat: 37.98, lng: 23.73 }, // Grèce (Athènes)
  HU: { lat: 47.50, lng: 19.04 }, // Hongrie (Budapest)
  IE: { lat: 53.35, lng: -6.26 }, // Irlande (Dublin)
  IS: { lat: 64.15, lng: -21.94 }, // Islande (Reykjavik)
  IT: { lat: 41.90, lng: 12.50 }, // Italie (Rome)
  LV: { lat: 56.95, lng: 24.11 }, // Lettonie (Riga)
  LI: { lat: 47.14, lng: 9.52 }, // Liechtenstein (Vaduz)
  LT: { lat: 54.69, lng: 25.28 }, // Lituanie (Vilnius)
  LU: { lat: 49.61, lng: 6.13 }, // Luxembourg
  MK: { lat: 42.00, lng: 21.43 }, // Macédoine du Nord (Skopje)
  MT: { lat: 35.90, lng: 14.51 }, // Malte (La Valette)
  MD: { lat: 47.01, lng: 28.86 }, // Moldavie (Chisinau)
  MC: { lat: 43.73, lng: 7.42 }, // Monaco
  ME: { lat: 42.44, lng: 19.26 }, // Monténégro (Podgorica)
  NO: { lat: 59.91, lng: 10.75 }, // Norvège (Oslo)
  NL: { lat: 52.37, lng: 4.90 }, // Pays-Bas (Amsterdam)
  PL: { lat: 52.23, lng: 21.01 }, // Pologne (Varsovie)
  PT: { lat: 38.72, lng: -9.14 }, // Portugal (Lisbonne)
  CZ: { lat: 50.08, lng: 14.44 }, // Tchéquie (Prague)
  RO: { lat: 44.43, lng: 26.10 }, // Roumanie (Bucarest)
  GB: { lat: 51.51, lng: -0.13 }, // Royaume-Uni (Londres)
  RU: { lat: 55.76, lng: 37.62 }, // Russie (Moscou)
  SM: { lat: 43.94, lng: 12.46 }, // Saint-Marin
  VA: { lat: 41.90, lng: 12.45 }, // Saint-Siège (Vatican)
  RS: { lat: 44.79, lng: 20.45 }, // Serbie (Belgrade)
  SK: { lat: 48.15, lng: 17.11 }, // Slovaquie (Bratislava)
  SI: { lat: 46.06, lng: 14.51 }, // Slovénie (Ljubljana)
  SE: { lat: 59.33, lng: 18.07 }, // Suède (Stockholm)
  CH: { lat: 46.95, lng: 7.45 }, // Suisse (Berne)
  UA: { lat: 50.45, lng: 30.52 }, // Ukraine (Kiev)

  // ================= AMÉRIQUE LATINE ET CARAÏBES (33) =================
  AG: { lat: 17.12, lng: -61.85 }, // Antigua-et-Barbuda
  AR: { lat: -34.60, lng: -58.38 }, // Argentine (Buenos Aires)
  BS: { lat: 25.04, lng: -77.35 }, // Bahamas (Nassau)
  BB: { lat: 13.10, lng: -59.61 }, // Barbade (Bridgetown)
  BZ: { lat: 17.25, lng: -88.77 }, // Belize (Belmopan)
  BO: { lat: -16.50, lng: -68.15 }, // Bolivie (La Paz)
  BR: { lat: -15.79, lng: -47.88 }, // Brésil (Brasilia)
  CL: { lat: -33.45, lng: -70.67 }, // Chili (Santiago)
  CO: { lat: 4.71, lng: -74.07 }, // Colombie (Bogota)
  CR: { lat: 9.93, lng: -84.09 }, // Costa Rica (San José)
  CU: { lat: 23.11, lng: -82.37 }, // Cuba (La Havane)
  DM: { lat: 15.30, lng: -61.39 }, // Dominique (Roseau)
  EC: { lat: -0.18, lng: -78.47 }, // Équateur (Quito)
  GD: { lat: 12.05, lng: -61.75 }, // Grenade (Saint-Georges)
  GT: { lat: 14.63, lng: -90.51 }, // Guatemala
  GY: { lat: 6.80, lng: -58.16 }, // Guyana (Georgetown)
  HT: { lat: 18.59, lng: -72.31 }, // Haïti (Port-au-Prince)
  HN: { lat: 14.07, lng: -87.19 }, // Honduras (Tegucigalpa)
  JM: { lat: 18.02, lng: -76.81 }, // Jamaïque (Kingston)
  MX: { lat: 19.43, lng: -99.13 }, // Mexique (Mexico)
  NI: { lat: 12.11, lng: -86.24 }, // Nicaragua (Managua)
  PA: { lat: 8.98, lng: -79.52 }, // Panama
  PY: { lat: -25.26, lng: -57.58 }, // Paraguay (Asunción)
  PE: { lat: -12.05, lng: -77.04 }, // Pérou (Lima)
  DO: { lat: 18.49, lng: -69.93 }, // République dominicaine (Saint-Domingue)
  KN: { lat: 17.30, lng: -62.72 }, // Saint-Christophe-et-Niévès
  LC: { lat: 14.01, lng: -60.99 }, // Sainte-Lucie (Castries)
  VC: { lat: 13.16, lng: -61.22 }, // Saint-Vincent-et-les-Grenadines
  SV: { lat: 13.69, lng: -89.22 }, // Salvador (San Salvador)
  SR: { lat: 5.85, lng: -55.20 }, // Suriname (Paramaribo)
  TT: { lat: 10.65, lng: -61.50 }, // Trinité-et-Tobago (Port-d'Espagne)
  UY: { lat: -34.90, lng: -56.16 }, // Uruguay (Montevideo)
  VE: { lat: 10.48, lng: -66.90 }, // Venezuela (Caracas)

  // ================= OCÉANIE (14) =================
  AU: { lat: -35.28, lng: 149.13 }, // Australie (Canberra)
  FJ: { lat: -18.14, lng: 178.44 }, // Fidji (Suva)
  MH: { lat: 7.11, lng: 171.18 }, // Îles Marshall (Majuro)
  SB: { lat: -9.43, lng: 159.97 }, // Îles Salomon (Honiara)
  KI: { lat: 1.34, lng: 172.98 }, // Kiribati (Tarawa)
  FM: { lat: 6.92, lng: 158.16 }, // Micronésie (Palikir)
  NR: { lat: -0.55, lng: 166.92 }, // Nauru
  NZ: { lat: -41.29, lng: 174.78 }, // Nouvelle-Zélande (Wellington)
  PW: { lat: 7.50, lng: 134.62 }, // Palaos (Ngerulmud)
  PG: { lat: -9.44, lng: 147.18 }, // Papouasie-Nouvelle-Guinée (Port Moresby)
  WS: { lat: -13.83, lng: -171.76 }, // Samoa (Apia)
  TO: { lat: -21.14, lng: -175.20 }, // Tonga (Nuku'alofa)
  TV: { lat: -8.52, lng: 179.20 }, // Tuvalu (Funafuti)
  VU: { lat: -17.73, lng: 168.32 }, // Vanuatu (Port-Vila)

  // ================= AMÉRIQUE DU NORD (2) =================
  CA: { lat: 45.42, lng: -75.70 }, // Canada (Ottawa)
  US: { lat: 38.91, lng: -77.04 }, // États-Unis (Washington D.C.)
};

export interface ContinentCenterNode {
  id: string;
  unZones: UnZoneId[];
  nameFr: string;
  nameEn: string;
  nameSw: string;
  lat: number;
  lng: number;
  unStates: number;
  areaMKm2: number;
  popB: number;
  summaryFr: string;
  summaryEn: string;
}

export const CONTINENT_MAP_CENTERS: ContinentCenterNode[] = [
  {
    id: 'africa',
    unZones: ['afrique'],
    nameFr: 'Afrique (54 États)',
    nameEn: 'Africa (54 States)',
    nameSw: 'Afrika (Nchi 54)',
    lat: 3.5,
    lng: 21.0,
    unStates: 54,
    areaMKm2: 30.3,
    popB: 1.5,
    summaryFr: 'Dipôle critique : sécheresse australe/Madagascar vs crues IOD+ en Afrique de l’Est.',
    summaryEn: 'Critical dipole: Southern Africa & Madagascar drought vs East Africa IOD+ floods.',
  },
  {
    id: 'asia',
    unZones: ['asie'],
    nameFr: 'Asie (48 États)',
    nameEn: 'Asia (48 States)',
    nameSw: 'Asia (Nchi 48)',
    lat: 32.0,
    lng: 96.0,
    unStates: 48,
    areaMKm2: 44.5,
    popB: 4.8,
    summaryFr: 'Mousson sud-asiatique affaiblie, risques exportations de riz et sécheresse Indonésie.',
    summaryEn: 'Weakened South Asian monsoon, rice export curb exposure, and Indonesian drought.',
  },
  {
    id: 'europe',
    unZones: ['europe'],
    nameFr: 'Europe (44 États)',
    nameEn: 'Europe (44 States)',
    nameSw: 'Ulaya (Nchi 44)',
    lat: 50.0,
    lng: 14.0,
    unStates: 44,
    areaMKm2: 10.2,
    popB: 0.74,
    summaryFr: 'Téléconnexion indirecte, canicules estivales et inflation importée (café/cacao/riz).',
    summaryEn: 'Indirect teleconnection, summer heatwaves, and imported food price inflation.',
  },
  {
    id: 'americas',
    unZones: ['amerique-latine-caraibes', 'amerique-du-nord'],
    nameFr: 'Amériques (35 États · Nord & Latine)',
    nameEn: 'Americas (35 States · North & Latin)',
    nameSw: 'Amerika (Nchi 35)',
    lat: 12.0,
    lng: -78.0,
    unStates: 35,
    areaMKm2: 42.5,
    popB: 1.04,
    summaryFr: 'Déluges Pacifique (Pérou/Équateur), sécheresse Amazonie & Corridor sec vs dipôle US.',
    summaryEn: 'Pacific coast deluges (Peru/Ecuador), Amazon drought vs North American winter dipole.',
  },
  {
    id: 'oceania',
    unZones: ['oceanie'],
    nameFr: 'Océanie (14 États)',
    nameEn: 'Oceania (14 States)',
    nameSw: 'Oceania (Nchi 14)',
    lat: -20.0,
    lng: 146.0,
    unStates: 14,
    areaMKm2: 8.5,
    popB: 0.045,
    summaryFr: 'Sécheresse & feux en Australie/PNG, stress hydrique et salinisation des atolls.',
    summaryEn: 'Drought & bushfires in Australia/PNG, plus Pacific atoll freshwater stress.',
  },
  {
    id: 'antarctica',
    unZones: [],
    nameFr: 'Antarctique & Océan Austral',
    nameEn: 'Antarctica & Southern Ocean',
    nameSw: 'Antaktiki',
    lat: -75.0,
    lng: 25.0,
    unStates: 0,
    areaMKm2: 14.0,
    popB: 0,
    summaryFr: 'Régulateur thermique mondial (albédo & circulation océanique australe SWIO).',
    summaryEn: 'Global thermal sink regulating albedo and Southern/Indian Ocean circulation.',
  },
];

export interface IndianOceanBasinNode {
  id: string;
  nameFr: string;
  nameEn: string;
  territoryLabel: string;
  lat: number;
  lng: number;
  droughtIdx: number;
  floodIdx: number;
  heatIdx: number;
  displacementIdx: number;
  gdpDeltaPct: number;
  hazardNoteFr: string;
  hazardNoteEn: string;
}

export const INDIAN_OCEAN_NODES: IndianOceanBasinNode[] = [
  {
    id: 'io-mg-center',
    nameFr: 'Madagascar — Hautes Terres & Centre (Antananarivo)',
    nameEn: 'Madagascar — Central Highlands (Antananarivo)',
    territoryLabel: 'COI · État membre',
    lat: -18.88,
    lng: 47.51,
    droughtIdx: 68,
    floodIdx: 62,
    heatIdx: 72,
    displacementIdx: 70,
    gdpDeltaPct: -4.2,
    hazardNoteFr: 'Tension hydroélectrique RIA/Andekaleka, hausse riz 3 200 MGA/kg et saison cyclonique.',
    hazardNoteEn: 'Hydropower reservoir tension, rice inflation, and cyclone transition tail risk.',
  },
  {
    id: 'io-mg-south',
    nameFr: 'Madagascar — Grand Sud (Ambovombe / Androy)',
    nameEn: 'Madagascar — Deep South (Ambovombe / Androy)',
    territoryLabel: 'COI · Zone critique Kéré',
    lat: -25.18,
    lng: 46.09,
    droughtIdx: 95,
    floodIdx: 24,
    heatIdx: 88,
    displacementIdx: 92,
    gdpDeltaPct: -7.1,
    hazardNoteFr: 'Déficit pluviométrique -35 à -55 %, insécurité alimentaire aiguë IPC 4–5.',
    hazardNoteEn: 'Rainfall deficit -35% to -55%, severe food insecurity (IPC Phase 4–5).',
  },
  {
    id: 'io-mg-sava',
    nameFr: 'Madagascar — SAVA & Côte Nord-Est (Sambava)',
    nameEn: 'Madagascar — SAVA & NE Coast (Sambava)',
    territoryLabel: 'COI · Bassin Vanille & Cyclones',
    lat: -14.27,
    lng: 50.17,
    droughtIdx: 34,
    floodIdx: 89,
    heatIdx: 76,
    displacementIdx: 68,
    gdpDeltaPct: -3.6,
    hazardNoteFr: 'Exposition cyclonique SWIO +25–40 % dès La Niña 2028, stress thermique vanille.',
    hazardNoteEn: 'Elevated SWIO cyclone landfall probability and vanilla thermal stress.',
  },
  {
    id: 'io-km',
    nameFr: 'Union des Comores (Moroni)',
    nameEn: 'Union of the Comoros (Moroni)',
    territoryLabel: 'COI · État membre',
    lat: -11.70,
    lng: 43.26,
    droughtIdx: 48,
    floodIdx: 78,
    heatIdx: 80,
    displacementIdx: 66,
    gdpDeltaPct: -3.9,
    hazardNoteFr: 'Pluies IOD+ intenses sur Ngazidja/Anjouan, érosion côtière et flambée riz importé.',
    hazardNoteEn: 'Intense IOD+ rainfall, coastal erosion, and imported staple rice sensitivity.',
  },
  {
    id: 'io-mu',
    nameFr: 'République de Maurice (Port-Louis)',
    nameEn: 'Republic of Mauritius (Port-Louis)',
    territoryLabel: 'COI · État membre',
    lat: -20.16,
    lng: 57.50,
    droughtIdx: 54,
    floodIdx: 72,
    heatIdx: 75,
    displacementIdx: 46,
    gdpDeltaPct: -2.1,
    hazardNoteFr: 'Crues éclair urbaines, stress hydrique des réservoirs et surcoût fret maritime COI.',
    hazardNoteEn: 'Flash urban floods, reservoir stress, and regional maritime freight inflation.',
  },
  {
    id: 'io-sc',
    nameFr: 'République des Seychelles (Victoria)',
    nameEn: 'Republic of Seychelles (Victoria)',
    territoryLabel: 'COI · État membre',
    lat: -4.62,
    lng: 55.45,
    droughtIdx: 30,
    floodIdx: 74,
    heatIdx: 84,
    displacementIdx: 44,
    gdpDeltaPct: -2.2,
    hazardNoteFr: 'Blanchissement corallien (>+1,8 °C SST), migration thonière et submersion côtière.',
    hazardNoteEn: 'Coral bleaching SST anomalies, tuna stock migration, and coastal surge.',
  },
  {
    id: 'io-re',
    nameFr: 'La Réunion (Saint-Denis · RSMC Cyclones)',
    nameEn: 'Réunion Island (Saint-Denis · RSMC Cyclones)',
    territoryLabel: 'COI · France / CMRS SWIO',
    lat: -20.88,
    lng: 55.45,
    droughtIdx: 40,
    floodIdx: 82,
    heatIdx: 74,
    displacementIdx: 38,
    gdpDeltaPct: -1.4,
    hazardNoteFr: 'Centre météorologique régional SWIOCOF/CMRS : pluies orographiques extrêmes & houle australe.',
    hazardNoteEn: 'Regional SWIO Cyclone Warning Center: extreme orographic rain and storm surge.',
  },
  {
    id: 'io-yt',
    nameFr: 'Mayotte (Mamoudzou)',
    nameEn: 'Mayotte (Mamoudzou)',
    territoryLabel: 'Archipel des Comores · SWIO',
    lat: -12.78,
    lng: 45.23,
    droughtIdx: 64,
    floodIdx: 74,
    heatIdx: 81,
    displacementIdx: 62,
    gdpDeltaPct: -2.9,
    hazardNoteFr: 'Vulnérabilité hydrique des retenues collinaires et forte exposition cyclonique.',
    hazardNoteEn: 'Water reservoir vulnerability and high tropical cyclone track exposure.',
  },
  {
    id: 'io-mz-channel',
    nameFr: 'Corridor Canal du Mozambique (Beira – Mahajanga)',
    nameEn: 'Mozambique Channel Corridor (Beira – Mahajanga)',
    territoryLabel: 'Bassin Maritime SWIO',
    lat: -17.90,
    lng: 41.20,
    droughtIdx: 62,
    floodIdx: 88,
    heatIdx: 85,
    displacementIdx: 82,
    gdpDeltaPct: -5.4,
    hazardNoteFr: 'Zone de cyclogenèse rapide alimentée par anomalies chaudes du Canal du Mozambique.',
    hazardNoteEn: 'Rapid cyclogenesis corridor driven by warm Mozambique Channel sea temperatures.',
  },
];
