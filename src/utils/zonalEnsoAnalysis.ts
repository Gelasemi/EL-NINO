import {
  DUPLICATED_195_COUNTRIES,
  type DuplicatedWorldCountry,
  type ForecastYear,
} from '../data/worldEnso195Data';
import type { ScenarioKey } from './economicAggregation';

export type RegionalBlocZoneId =
  | 'ocean-indien-coi'
  | 'comesa'
  | 'sadc'
  | 'asean'
  | 'ue'
  | 'afrique'
  | 'oceanie'
  | 'amerique-latine'
  | 'caraibes'
  | 'amerique-du-nord'
  | 'europe-est'
  | 'moyen-orient'
  | 'asie';

export const FORECAST_YEARS_6: ForecastYear[] = [2027, 2028, 2029, 2030, 2031, 2032];

export const SCENARIO_MULTIPLIERS: Record<ScenarioKey, number> = {
  s1: 0.55,
  s2: 1.0,
  s3: 1.45,
};

export interface ZonalDefinition {
  id: RegionalBlocZoneId;
  code: string;
  nameFr: string;
  nameEn: string;
  groupLabelFr: string;
  groupLabelEn: string;
  perimeterNoteFr: string;
  perimeterNoteEn: string;
  memberIso2s: string[];
  teleconnectionFr: string;
  teleconnectionEn: string;
  agricultureEnergyFr: string;
  agricultureEnergyEn: string;
  macroDisplacementFr: string;
  macroDisplacementEn: string;
  recommendationsFr: string[];
  recommendationsEn: string[];
}

const ALL_AFRICA_ISO2 = DUPLICATED_195_COUNTRIES.filter((c) => c.unZone === 'afrique').map((c) => c.iso2);
const ALL_ASIA_ISO2 = DUPLICATED_195_COUNTRIES.filter((c) => c.unZone === 'asie').map((c) => c.iso2);
const ALL_OCEANIA_ISO2 = DUPLICATED_195_COUNTRIES.filter((c) => c.unZone === 'oceanie').map((c) => c.iso2);

export const ZONAL_DEFINITIONS: ZonalDefinition[] = [
  {
    id: 'ocean-indien-coi',
    code: 'COI / IO',
    nameFr: 'Océan Indien & COI',
    nameEn: 'Indian Ocean & IOC',
    groupLabelFr: 'Bassin Océan Indien & États insulaires',
    groupLabelEn: 'Indian Ocean Basin & Island States',
    perimeterNoteFr:
      '4 États souverains de la COI (Madagascar, Comores, Maurice, Seychelles) + îles et façade Ouest/Nord océan Indien (Sri Lanka, Maldives, Mozambique, Tanzanie, Kenya, Somalie, Djibouti, Oman, Yémen ; La Réunion & Mayotte intégrées au périmètre COI).',
    perimeterNoteEn:
      '4 sovereign IOC states (Madagascar, Comoros, Mauritius, Seychelles) + Indian Ocean islands & western/northern rim (Sri Lanka, Maldives, Mozambique, Tanzania, Kenya, Somalia, Djibouti, Oman, Yemen; Réunion & Mayotte operational IOC hub).',
    memberIso2s: ['MG', 'KM', 'MU', 'SC', 'LK', 'MV', 'MZ', 'TZ', 'KE', 'SO', 'DJ', 'OM', 'YE'],
    teleconnectionFr:
      'Couplage critique entre le Super El Niño Pacifique (ONI ≥ +2,0 à +3,5 °C) et le Dipôle de l’Océan Indien positif (IOD+). L’anomalie chaude de l’ouest de l’océan Indien alimente des pluies diluviennes sur la Corne/Afrique de l’Est (oct.–déc.) tout en asséchant l’axe Grand Sud malgache – Mozambique et en modifiant les trajectoires cycloniques du canal du Mozambique.',
    teleconnectionEn:
      'Critical Pacific Super El Niño (ONI ≥ +2.0 to +3.5°C) coupled with a positive Indian Ocean Dipole (IOD+). Warm western Indian Ocean SSTs trigger torrential Oct–Dec rains along East Africa while drying southern Madagascar and Mozambique and shifting Mozambique Channel cyclone tracks.',
    agricultureEnergyFr:
      'Rupture rizicole et maïsicole dans le Sud-Ouest océan Indien (Madagascar, Mozambique), stress récifal et halieutique (thon, vanille, girofle), perte d’étiage hydroélectrique sur les barrages insulaires et surcoût logistique maritime inter-îles.',
    agricultureEnergyEn:
      'Rice and maize shocks in Madagascar and Mozambique, coral/pelagic tuna and spice export disruption (vanilla, cloves), island hydropower drawdowns, and elevated maritime food-import freight costs.',
    macroDisplacementFr:
      'Forte sensibilité des balances courantes insulaires aux importations alimentaires d’urgence (riz, blé, huiles), dérapage inflationniste (+6 à +9 pts CPI dans les îles vulnérables) et déplacements internes côtiers et ruraux (Grand Sud malgache, Sofala, plaines somaliennes).',
    macroDisplacementEn:
      'High current-account exposure to emergency rice and wheat imports, +6 to +9 pp food CPI spikes across small islands, and coastal/rural climate displacement (Madagascar Grand Sud, Mozambique, Somalia).',
    recommendationsFr: [
      'Mutualiser une réserve stratégique régionale COI de riz et semences à cycle court (90 jours) pré-positionnée à Toamasina, Port-Louis et Moroni.',
      'Déployer le couplage SWIOCOF / DGM d’alerte précoce maritime et agricole (SMS 3-2-1) à seuil ONI ≥ +1,5 °C et IOD+ ≥ +0,8 °C.',
      'Activer les mécanismes d’assurance paramétrique cyclonique et sécheresse (ARC / CCRIF océan Indien) dès T4 avant la soudure.',
      'Renforcer la conservation hydrique (SCV, diguettes, forages solaires) sur les bassins rizicoles et périmètres maraîchers insulaires.',
    ],
    recommendationsEn: [
      'Pool an IOC regional emergency rice and 90-day short-cycle seed reserve pre-positioned in Toamasina, Port Louis, and Moroni.',
      'Operationalize SWIOCOF/DGM early-warning triggers (ONI ≥ +1.5°C & IOD+ ≥ +0.8°C) linked to SMS advisory dissemination.',
      'Activate parametric cyclone and drought insurance payouts (ARC / Indian Ocean risk pool) ahead of Q1 lean-season deficits.',
      'Scale up conservation agriculture, check dams, and solar micro-irrigation across island watersheds.',
    ],
  },
  {
    id: 'comesa',
    code: 'COMESA',
    nameFr: 'COMESA (21 États)',
    nameEn: 'COMESA (21 States)',
    groupLabelFr: 'Marché commun Afrique orientale & australe',
    groupLabelEn: 'Common Market for Eastern & Southern Africa',
    perimeterNoteFr:
      'Les 21 États membres officiels du COMESA, du Nil/Méditerranée (Égypte, Tunisie, Libye) à la Corne (Éthiopie, Kenya, Ouganda, Rwanda, Burundi, Érythrée, Djibouti, Somalie, Soudan) jusqu’à l’Afrique australe & îles COI (Zambie, Zimbabwe, Malawi, Madagascar, Maurice, Comores, Seychelles, Eswatini, RDC).',
    perimeterNoteEn:
      'All 21 official COMESA member states spanning North Africa/Nile (Egypt, Tunisia, Libya), East Africa/Horn (Ethiopia, Kenya, Uganda, Rwanda, Burundi, Eritrea, Djibouti, Somalia, Sudan), and Southern Africa/IOC (Zambia, Zimbabwe, Malawi, Madagascar, Mauritius, Comoros, Seychelles, Eswatini, DR Congo).',
    memberIso2s: [
      'BI', 'KM', 'CD', 'DJ', 'EG', 'ER', 'SZ', 'ET', 'KE', 'LY', 'MG', 'MW', 'MU', 'RW', 'SC', 'SO', 'SD', 'TN', 'UG', 'ZM', 'ZW',
    ],
    teleconnectionFr:
      'Asymétrie dipolaire nord-sud spectaculaire : sous El Niño + IOD+, le nord du corridor COMESA (Kenya, Éthiopie, Ouganda, Somalie, Burundi) subit des crues destructrices d’octobre à décembre, tandis que le sud COMESA (Zambie, Zimbabwe, Malawi, Madagascar, Eswatini) affronte un déficit pluviométrique sévère puis une inversion La Niña en 2028.',
    teleconnectionEn:
      'Sharp north-south dipolar asymmetry: under El Niño + IOD+, northern COMESA (Kenya, Ethiopia, Uganda, Somalia, Burundi) suffers severe Oct–Dec floods while southern COMESA (Zambia, Zimbabwe, Malawi, Madagascar, Eswatini) faces acute drought before La Niña flips risks in 2028.',
    agricultureEnergyFr:
      'Double choc sur le corridor alimentaire COMESA : effondrement simultané du maïs zambien/zimbabwéen/malawite et rupture routière des corridors d’approvisionnement est-africains par les crues, doublé d’une crise hydroélectrique majeure (Kariba, Kafue, Tana, bassins malgaches).',
    agricultureEnergyEn:
      'Dual shock across the COMESA food corridor: simultaneous southern maize failure and East African road/bridge flood disruptions, compounded by acute Kariba/Kafue hydropower deficits.',
    macroDisplacementFr:
      'Plus de 75 millions de personnes en insécurité alimentaire projetée sur l’ensemble COMESA lors des pics ENSO, dépréciation des devises importatrices de céréales (Égypte, Madagascar, Zambie, Malawi) et pression sur les filets sociaux et camps de déplacés.',
    macroDisplacementEn:
      'Over 75M people exposed to food stress across COMESA during ENSO peaks, FX pressure on net grain importers (Egypt, Madagascar, Zambia, Malawi), and strained humanitarian corridors.',
    recommendationsFr: [
      'Créer un couloir douanier COMESA « Zéro droit & voie verte » pour le transit d’urgence des céréales entre zones excédentaires et zones déficitaires.',
      'Interconnecter les réseaux électriques SAPP–EAPP afin de compenser les déficits hydroélectriques du Zambèze et du Nil.',
      'Harmoniser les bulletins saisonniers ICPAC (Nairobi) et CSC-SADC (Gaborone) dans une matrice mensuelle de risque COMESA.',
      'Déployer des achats groupés de blé, riz et engrais au niveau du secrétariat de Lusaka pour réduire la facture d’importation.',
    ],
    recommendationsEn: [
      'Establish a zero-tariff COMESA green transit corridor for emergency grain movements between surplus and deficit basins.',
      'Accelerate SAPP–EAPP grid interconnectors to offset Zambezi and Nile hydropower generation drops.',
      'Synchronize ICPAC (Nairobi) and SADC Climate Services Centre (Gaborone) seasonal outlooks into one COMESA alert matrix.',
      'Execute pooled sovereign procurement of wheat, rice, and fertilizers to curb import price spikes.',
    ],
  },
  {
    id: 'sadc',
    code: 'SADC',
    nameFr: 'SADC (16 États)',
    nameEn: 'SADC (16 States)',
    groupLabelFr: 'Communauté de développement d’Afrique australe',
    groupLabelEn: 'Southern African Development Community',
    perimeterNoteFr:
      'Les 16 États membres officiels de la SADC : Afrique du Sud, Angola, Botswana, Comores, Eswatini, Lesotho, Madagascar, Malawi, Maurice, Mozambique, Namibie, RDC, Seychelles, Tanzanie, Zambie et Zimbabwe.',
    perimeterNoteEn:
      'All 16 official SADC member states: Angola, Botswana, Comoros, DR Congo, Eswatini, Lesotho, Madagascar, Malawi, Mauritius, Mozambique, Namibia, Seychelles, South Africa, Tanzania, Zambia, and Zimbabwe.',
    memberIso2s: [
      'AO', 'BW', 'KM', 'CD', 'SZ', 'LS', 'MG', 'MW', 'MU', 'MZ', 'NA', 'SC', 'ZA', 'TZ', 'ZM', 'ZW',
    ],
    teleconnectionFr:
      'L’Afrique australe constitue l’un des foyers mondiaux les plus prévisibles et sévères d’El Niño : la subsidence atmosphérique bloque l’entrée des pluies d’été austral (déc.–fév.) sur la ceinture du maïs, prolongeant la sécheresse météorologique en sécheresse agricole et hydrologique (délai de 3 à 6 mois), suivie de cyclones/crues côtières au Mozambique et à Madagascar.',
    teleconnectionEn:
      'Southern Africa is one of the strongest global El Niño drought teleconnections: upper-level subsidence blocks Dec–Feb austral rains across the maize belt, cascading into a 3–6 month agricultural and hydrological deficit, followed by coastal flood/cyclone exposure.',
    agricultureEnergyFr:
      'Chute de 35 à 55 % des récoltes pluviales de maïs blanc (aliment de base régional), assèchement du réservoir de Kariba (Zambie/Zimbabwe) limitant le minier et l’industrie, perte de cheptel en Namibie/Botswana et tensions sur les corridors portuaires Beira, Maputo, Dar es-Salaam et Toamasina.',
    agricultureEnergyEn:
      '35–55% white maize yield drop, critical drawdown at Lake Kariba restricting mining and industrial power, cattle losses across Botswana/Namibia, and congestion at Beira/Maputo/Toamasina corridors.',
    macroDisplacementFr:
      'Déficit alimentaire touchant >61 millions de personnes (niveau SADC 2024 amplifié en 2027), flambée des prix du maïs (+45 à +80 %), crise de liquidité budgétaire dans les États les plus fragiles (Malawi, Zambie, Zimbabwe, Madagascar) et exode rural transfrontalier.',
    macroDisplacementEn:
      'Food emergency affecting >61M people across SADC, +45% to +80% maize price inflation, fiscal strain in fragile economies (Malawi, Zambia, Zimbabwe, Madagascar), and rural-urban migration.',
    recommendationsFr: [
      'Maintenir les réserves stratégiques SADC de maïs blanc, sorgho et manioc avant le pic de novembre et lever toute restriction d’exportation intra-SADC.',
      'Basculer 25 % des emblavures de la ceinture sèche vers le sorgho, le mil, le niébé et le manioc tolérants à la sécheresse.',
      'Sécuriser un fonds d’urgence SADC–ARC pour le délestage électrique et les systèmes de pompage solaire ruraux.',
      'Synchroniser les plans de riposte humanitaire de Gaborone dès que le seuil SADC-CSC passe en alerte El Niño modéré/fort.',
    ],
    recommendationsEn: [
      'Pre-position SADC strategic white-maize, sorghum, and cassava reserves before November and keep intra-SADC grain borders open.',
      'Shift 25% of dry-belt acreage toward drought-tolerant sorghum, millet, cowpea, and cassava.',
      'Ring-fence SADC–ARC contingency financing for grid load-shedding mitigation and solar rural water pumping.',
      'Trigger coordinated humanitarian cash transfers as soon as SADC-CSC issues moderate/strong El Niño warnings.',
    ],
  },
  {
    id: 'asean',
    code: 'ASEAN',
    nameFr: 'ASEAN (+ Timor-Leste)',
    nameEn: 'ASEAN (+ Timor-Leste)',
    groupLabelFr: 'Association des nations de l’Asie du Sud-Est',
    groupLabelEn: 'Association of Southeast Asian Nations',
    perimeterNoteFr:
      'Les 10 États membres de l’ASEAN (Indonésie, Thaïlande, Viêt Nam, Philippines, Malaisie, Singapour, Myanmar, Cambodge, Laos, Brunéi) + Timor-Leste.',
    perimeterNoteEn:
      'All 10 ASEAN Member States (Indonesia, Thailand, Viet Nam, Philippines, Malaysia, Singapore, Myanmar, Cambodia, Lao PDR, Brunei) plus Timor-Leste.',
    memberIso2s: ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN', 'TL'],
    teleconnectionFr:
      'Le basculement vers l’est de la cellule de Walker refroidit l’archipel maritime indonésien-philippin et réduit la mousson sur le bassin du Mékong : déficits pluviométriques de 25 à 45 %, sécheresse sévère à Kalimantan/Sumatra/Luçon et baisse des débits du Mékong favorisant la salinisation du delta vietnamien.',
    teleconnectionEn:
      'Eastward shift of the Walker circulation cools Maritime Continent seas and weakens Mekong monsoons: 25–45% rainfall deficits, acute peatland drying in Indonesia/Philippines, and saltwater intrusion in Viet Nam’s Mekong Delta.',
    agricultureEnergyFr:
      'Tensions critiques sur les exportations mondiales de riz (Thaïlande, Viêt Nam — 2e et 3e exportateurs mondiaux, impactant directement Madagascar et l’Afrique), baisse de l’huile de palme (Indonésie/Malaisie), café Robusta et sucre ; perte de production hydroélectrique au Laos et au Viêt Nam.',
    agricultureEnergyEn:
      'Global export pressure on Thai and Vietnamese rice (directly raising import costs for Madagascar & Africa), lower Indonesian/Malaysian palm oil & Robusta output, and Mekong hydropower declines.',
    macroDisplacementFr:
      'Mégafeux de tourbières générant des épisodes de brume transfrontalière toxique (Indonésie, Malaisie, Singapour), pertes sanitaires et productivité extérieure réduite, et pression forte sur les prix alimentaires en Indonésie et aux Philippines.',
    macroDisplacementEn:
      'Peatland megafires generating severe transboundary haze across Indonesia, Malaysia, and Singapore, outdoor labor productivity drops, and sharp rice inflation in Indonesia and the Philippines.',
    recommendationsFr: [
      'Éviter les embargos unilatéraux sur le riz ASEAN et activer la réserve d’urgence APTERR (ASEAN+3) pour stabiliser les prix mondiaux.',
      'Intensifier la réhumidification et la surveillance satellitaire des tourbières à Sumatra, Bornéo et Mindanao avant août.',
      'Protéger le delta du Mékong contre l’intrusion saline par écluses préventives et variétés de riz tolérantes au sel.',
      'Sécuriser la filière café/caoutchouc/huile de palme via des contrats à terme et l’agroforesterie ombragée.',
    ],
    recommendationsEn: [
      'Avoid unilateral ASEAN rice export bans and deploy the APTERR emergency grain reserve to anchor global prices.',
      'Scale up peatland rewetting and satellite fire monitoring across Sumatra, Borneo, and Mindanao ahead of August.',
      'Defend the Mekong Delta against saline intrusion using sluice gates and salt-tolerant rice cultivars.',
      'Buffer coffee, rubber, and palm oil smallholders via shade agroforestry and weather-indexed credit.',
    ],
  },
  {
    id: 'ue',
    code: 'UE / EU-27',
    nameFr: 'Union Européenne (UE-27)',
    nameEn: 'European Union (EU-27)',
    groupLabelFr: '27 États membres de l’Union européenne',
    groupLabelEn: '27 Member States of the European Union',
    perimeterNoteFr:
      'Ensemble des 27 États membres de l’Union européenne (de l’Europe occidentale à la Méditerranée, pays nordiques, baltes et Europe centrale/orientale UE).',
    perimeterNoteEn:
      'All 27 European Union Member States spanning Western, Mediterranean, Nordic, Baltic, and Central/Eastern EU economies.',
    memberIso2s: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    ],
    teleconnectionFr:
      'Téléconnexion extratropicale retardée via la modulation du courant-jet Atlantique Nord (NAO négative en hiver post-El Niño) : hivers plus froids et secs en Europe du Nord/Baltique, pluies accrues sur la péninsule Ibérique et la Méditerranée occidentale, suivis de dômes de chaleur estivaux records en Europe du Sud et centrale.',
    teleconnectionEn:
      'Delayed extratropical teleconnection via North Atlantic jet modulation (negative winter NAO): colder/drier Northern Europe winters, wetter Iberia/western Mediterranean, followed by intense summer heat domes across Southern and Central Europe.',
    agricultureEnergyFr:
      'Choc modéré sur le PIB direct (<1 %), mais exposition marquée à l’inflation importée (cacao, café, sucre, riz, huile d’olive espagnole/italienne), étiage du Rhin et du Danube perturbant la logistique industrielle et refroidissement nucléaire/thermique estival.',
    agricultureEnergyEn:
      'Moderate direct GDP impact (<1%), high exposure to imported commodity inflation (cocoa, coffee, rice, olive oil), Rhine/Danube low-water freight bottlenecks, and summer thermal/nuclear cooling constraints.',
    macroDisplacementFr:
      'Tensions sur les régimes d’assurance agricole et catastrophes naturelles (inondations fluviales et mégafeux méditerranéens), surmortalité estivale urbaine et réorientation des flux d’aide humanitaire européenne (ECHO) vers les zones tropicales les plus touchées (Afrique, COI, Caraïbes).',
    macroDisplacementEn:
      'Rising agricultural and catastrophe insurance payouts from Mediterranean wildfires and river floods, urban heat morbidity, and higher EU humanitarian budget demand (DG ECHO).',
    recommendationsFr: [
      'Couvrir les filières agroalimentaires européennes contre la volatilité ENSO des matières premières tropicales (cacao, café, soja, riz).',
      'Adapter les étiages navigables du Rhin et du Danube par barges à faible tirant d’eau et report modal ferroviaire.',
      'Mobiliser les fonds de solidarité de la PAC et de la FEI pour l’irrigation de précision en Espagne, Italie, Grèce et France méridionale.',
      'Renforcer le financement climatique pré-déclenché UE → COI/SADC/COMESA avant l’installation du pic ONI.',
    ],
    recommendationsEn: [
      'Hedge EU food processors against ENSO-driven tropical import volatility (cocoa, coffee, soy, rice).',
      'Upgrade Rhine and Danube freight resilience using shallow-draft vessels and rail modal buffers.',
      'Target CAP crisis reserves toward precision irrigation and heat-resilient orchards in Southern Europe.',
      'Scale pre-arranged EU climate-contingency financing (Global Gateway / ECHO) for IOC, SADC, and COMESA.',
    ],
  },
  {
    id: 'afrique',
    code: 'AFR-54',
    nameFr: 'Afrique (54 États ONU)',
    nameEn: 'Africa (54 UN States)',
    groupLabelFr: 'Ensemble du continent africain',
    groupLabelEn: 'Entire African Continent',
    perimeterNoteFr:
      'Les 54 États membres souverains d’Afrique à l’ONU, regroupant Afrique australe, de l’Est, de l’Ouest/Sahel, Centrale et du Nord.',
    perimeterNoteEn:
      'All 54 UN Member States across Southern, Eastern, West/Sahel, Central, and Northern Africa.',
    memberIso2s: ALL_AFRICA_ISO2,
    teleconnectionFr:
      'Le continent subit quatre régimes ENSO/IOD simultanés : sécheresse aiguë en Afrique australe et Madagascar Sud ; déluges d’IOD+ en Afrique de l’Est/Corne ; mousson sahélienne irrégulière et chaleurs >45 °C en Afrique de l’Ouest ; déficit hydrique structurel au Maghreb/bassin du Nil.',
    teleconnectionEn:
      'Africa experiences four simultaneous ENSO/IOD regimes: acute drought in Southern Africa & Madagascar South; IOD+ deluges in East Africa/Horn; erratic Sahel monsoons & >45°C West African heat; and structural Maghreb/Nile water stress.',
    agricultureEnergyFr:
      'Pertes agricoles cumulées dépassant 15 à 25 % sur les bassins les plus exposés (maïs austral, mil/sorgho sahélien, cacao ouest-africain, riz malgache), déficits hydroélectriques simultanés et tension sur les réserves de change pour les importations alimentaires.',
    agricultureEnergyEn:
      '15–25%+ regional crop shocks across Southern maize, Sahel millet/sorghum, West African cocoa, and Malagasy rice, compounded by hydropower shortages and sovereign import strain.',
    macroDisplacementFr:
      'Plus forte vulnérabilité mondiale par habitant aux effets persistants d’El Niño (trajectoire Dartmouth/Oxford >10 % de perte cumulée dans les pays tropicaux à faible revenu), migrations rurales-urbaines accélérées et pression sanitaire (choléra, paludisme, malnutrition aiguë).',
    macroDisplacementEn:
      'Highest per-capita persistent El Niño income drag globally (>10% cumulative tropical trajectory per Dartmouth/Oxford benchmarks), accelerating internal displacement and waterborne disease bursts.',
    recommendationsFr: [
      'Opérationnaliser un fonds africain d’anticipation climatique (Union Africaine / BAD / ARC) débloqué sur seuils météorologiques objectifs.',
      'Accélérer l’irrigation solaire, le stockage post-récolte hermétique et les variétés résilientes dans les 5 zones sous-régionales.',
      'Protéger les corridors logistiques et ports céréaliers (Durban, Mombasa, Djibouti, Toamasina, Abidjan) contre les surcharges de demande.',
      'Intégrer systématiquement les prévisions ONI/IOD dans les lois de finances agricoles et réserves de change.',
    ],
    recommendationsEn: [
      'Operationalize an AU/AfDB/ARC continental anticipatory action fund triggered on objective ONI/IOD forecasts.',
      'Expand solar micro-irrigation, hermetic grain storage, and stress-tolerant seeds across all five African sub-regions.',
      'Keep key grain corridors and ports (Durban, Mombasa, Djibouti, Toamasina, Abidjan) resilient to import surges.',
      'Embed ONI/IOD sensitivity testing into national agricultural budgets and sovereign reserve planning.',
    ],
  },
  {
    id: 'oceanie',
    code: 'OCE-14',
    nameFr: 'Océanie (14 États ONU)',
    nameEn: 'Oceania (14 UN States)',
    groupLabelFr: 'Australie, Nouvelle-Zélande & Îles du Pacifique',
    groupLabelEn: 'Australia, New Zealand & Pacific Islands',
    perimeterNoteFr:
      'Les 14 États souverains d’Océanie membres de l’ONU (Australie, Nouvelle-Zélande, Papouasie-Nouvelle-Guinée, Fidji, Îles Salomon, Vanuatu, Samoa, Tonga, Kiribati, Micronésie, Îles Marshall, Nauru, Palaos, Tuvalu).',
    perimeterNoteEn:
      'All 14 UN sovereign states of Oceania (Australia, New Zealand, Papua New Guinea, Fiji, Solomon Islands, Vanuatu, Samoa, Tonga, Kiribati, Micronesia, Marshall Islands, Nauru, Palau, Tuvalu).',
    memberIso2s: ALL_OCEANIA_ISO2,
    teleconnectionFr:
      'Épicentre direct de l’Oscillation australe : le refroidissement de la mer de Corail et l’anomalie de pression sur Darwin provoquent une sécheresse sévère dans l’Est/Nord australien, la Nouvelle-Zélande (Nord-Est), la Papouasie-Nouvelle-Guinée et les archipels mélanésiens, puis une reprise cyclonique intense en transition La Niña 2028.',
    teleconnectionEn:
      'Direct epicenter of the Southern Oscillation: Coral Sea cooling and positive Darwin pressure anomalies drive severe drought across E/N Australia, eastern New Zealand, PNG highlands, and Melanesia, followed by severe La Niña cyclones in 2028.',
    agricultureEnergyFr:
      'Baisse des récoltes australiennes de blé, d’orge et de canne à sucre, pertes pastorales bovines/ovines, mégafeux de brousse dans le Queensland/NSW, blanchissement massif de la Grande Barrière de corail et gel/sécheresse des jardins vivriers en PNG (taro, patate douce).',
    agricultureEnergyEn:
      'Drops in Australian wheat, barley, and sugar exports, livestock destocking, Queensland/NSW bushfires, Great Barrier Reef bleaching, and PNG highland staple frost/drought.',
    macroDisplacementFr:
      'Salinisation des lentilles d’eau douce sur les atolls (Kiribati, Tuvalu, Îles Marshall), dépendance accrue aux livraisons d’eau potable par navires et vulnérabilité de la dette climatique des petits États insulaires du Pacifique (PEID).',
    macroDisplacementEn:
      'Freshwater lens salinization across low-lying atolls (Kiribati, Tuvalu, Marshall Islands), emergency desalination/water shipping needs, and rising SIDS climate debt.',
    recommendationsFr: [
      'Déployer des unités modulaires de dessalement solaire et citernes de récupération pluviale sur l’ensemble des atolls micronésiens et polynésiens.',
      'Sécuriser les stocks alimentaires de secours en PNG, Fidji et Vanuatu avant le pic sec de septembre–novembre.',
      'Activer les plans de prévention des mégafeux australiens (brûlages dirigés hivernaux et réserves hydriques rurales).',
      'Coupler la gestion des quotas thoniers du Pacifique Ouest/Central au déplacement vers l’est des bancs de listao.',
    ],
    recommendationsEn: [
      'Deploy modular solar desalination and rainwater harvesting tanks across low-lying Micronesian and Polynesian atolls.',
      'Pre-position emergency food reserves across PNG, Fiji, and Vanuatu prior to the Sept–Nov dry peak.',
      'Trigger early Australian bushfire preparedness, controlled burns, and rural water reserve protection.',
      'Adjust Western & Central Pacific tuna vessel-day schemes as skipjack stocks shift eastward.',
    ],
  },
  {
    id: 'amerique-latine',
    code: 'LATAM-20',
    nameFr: 'Amérique latine (20 États)',
    nameEn: 'Latin America (20 States)',
    groupLabelFr: 'Amérique centrale, Mexique & Amérique du Sud',
    groupLabelEn: 'Mexico, Central & South America',
    perimeterNoteFr:
      'Les 20 États continentaux d’Amérique latine (Mexique, 7 pays d’Amérique centrale dont Corridor sec, et 12 États d’Amérique du Sud dont côte Pacifique Pérou/Équateur et bassin Amazonie–Cône Sud).',
    perimeterNoteEn:
      'All 20 mainland Latin American states spanning Mexico, Central America (Dry Corridor), Andean Pacific Coast (Peru, Ecuador, Colombia), Amazonia, and the Southern Cone.',
    memberIso2s: [
      'AR', 'BZ', 'BO', 'BR', 'CL', 'CO', 'CR', 'EC', 'SV', 'GT', 'GY', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'SR', 'UY', 'VE',
    ],
    teleconnectionFr:
      'Foyer océanique historique d’El Niño : réchauffement côtier de +3,5 à +4,1 °C au Pérou/Équateur stoppant l’upwelling froid (déluges et huaicos), sécheresse aiguë sur le bassin amazonien, le nord-est brésilien, la Colombie et le Corridor sec centraméricain, et pluies excédentaires en Argentine/Uruguay/Paraguay.',
    teleconnectionEn:
      'Classic El Niño epicenter: +3.5 to +4.1°C coastal warming off Peru/Ecuador shutting down cold upwelling (extreme mudslides & floods), simultaneous drought across Amazonia, Colombia, and the Central American Dry Corridor, and wet excesses in Argentina/Uruguay.',
    agricultureEnergyFr:
      'Effondrement de la pêche à l’anchois (farine de poisson mondiale), pertes sur café Arabica (Brésil/Colombie), maïs/haricots du Corridor sec, niveau critique du canal de Panama réduisant le trafic maritime mondial, et tension hydroélectrique en Colombie, Équateur et Brésil.',
    agricultureEnergyEn:
      'Collapse of Peruvian anchovy fishmeal, Arabica coffee & sugar shocks (Brazil/Colombia), Dry Corridor maize/bean failure, Panama Canal low-water transit restrictions, and Andean/Brazilian hydropower strain.',
    macroDisplacementFr:
      'L’insécurité alimentaire dans le Corridor sec (Guatemala, Honduras, Nicaragua, Salvador) amplifie les migrations vers le nord, tandis que les crues côtières au Pérou et en Équateur déclenchent des épidémies de dengue et des destructions routières majeures.',
    macroDisplacementEn:
      'Dry Corridor crop failures amplify northward migration pressures, while Peru/Ecuador coastal floods drive infrastructure losses and severe dengue outbreaks.',
    recommendationsFr: [
      'Protéger les bassins versants du canal de Panama et pré-positionner des groupes thermiques de secours en Colombie/Équateur.',
      'Instaurer des moratoires halieutiques adaptatifs immédiats sur l’anchois péruvien dès franchissement de Niño 1+2 ≥ +2,0 °C.',
      'Déployer des filets de transfert monétaire agricole et des semences tolérantes dans le Corridor sec centraméricain.',
      'Renforcer les brigades anti-incendies et la protection hydrologique du bassin amazonien.',
    ],
    recommendationsEn: [
      'Protect Panama Canal watershed inflows and maintain thermal backup generation in Colombia and Ecuador.',
      'Enforce immediate adaptive moratoriums on Peruvian anchovy fishing once Niño 1+2 reaches +2.0°C.',
      'Expand targeted cash transfers and drought-tolerant bean/maize varieties in the Central American Dry Corridor.',
      'Scale up rapid-response wildfire suppression and river navigation contingency across the Amazon Basin.',
    ],
  },
  {
    id: 'caraibes',
    code: 'CAR-13',
    nameFr: 'Caraïbes (13 États ONU)',
    nameEn: 'Caribbean (13 UN States)',
    groupLabelFr: 'Bassin insulaire caribéen',
    groupLabelEn: 'Caribbean Island States',
    perimeterNoteFr:
      'Les 13 États souverains des Caraïbes membres de l’ONU (Cuba, République dominicaine, Haïti, Jamaïque, Bahamas, Barbade, Trinité-et-Tobago, Antigua-et-Barbuda, Dominique, Grenade, Saint-Christophe-et-Niévès, Sainte-Lucie, Saint-Vincent-et-les-Grenadines).',
    perimeterNoteEn:
      'All 13 sovereign Caribbean UN Member States (Antigua & Barbuda, Bahamas, Barbados, Cuba, Dominica, Dominican Republic, Grenada, Haiti, Jamaica, St. Kitts & Nevis, St. Lucia, St. Vincent & Grenadines, Trinidad & Tobago).',
    memberIso2s: ['AG', 'BS', 'BB', 'CU', 'DM', 'DO', 'GD', 'HT', 'JM', 'KN', 'LC', 'VC', 'TT'],
    teleconnectionFr:
      'Cycle en deux temps à haut risque : durant la phase El Niño 2027, le cisaillement vertical modère temporairement les ouragans mais piège une chaleur océanique record avec sécheresse estivale ; dès la bascule La Niña 2028, cette chaleur libère des saisons cycloniques hyper-actives de catégorie 4–5.',
    teleconnectionEn:
      'Two-stage threat: during El Niño 2027, vertical wind shear dampens storms slightly while trapping record marine heat and summer island drought; upon La Niña shift in 2028, stored heat fuels hyper-active Category 4–5 hurricane seasons.',
    agricultureEnergyFr:
      'Stress hydrique sur la canne à sucre, les bananes, le maraîchage et les réseaux électriques côtiers, blanchissement corallien affectant le tourisme balnéaire et la pêche côtière, et coût élevé des denrées alimentaires importées (Haïti, Jamaïque, Petites Antilles).',
    agricultureEnergyEn:
      'Water deficits hurting sugar, banana, and vegetable yields, severe coral bleaching threatening reef fisheries and tourism, and acute food-import inflation (especially Haiti & Eastern Caribbean).',
    macroDisplacementFr:
      'Risque humanitaire critique en Haïti (sécheresse + vulnérabilité structurelle), pression sur l’endettement souverain après chaque impact cyclonique de transition 2028 et évacuations côtières rapides.',
    macroDisplacementEn:
      'Severe humanitarian fragility in Haiti, post-storm sovereign debt strain during the 2028 hurricane transition, and vulnerable coastal settlements.',
    recommendationsFr: [
      'Renforcer les couvertures paramétriques CCRIF-SPC et clauses de suspension de dette climatique pour l’ensemble des États insulaires.',
      'Enterrer ou micro-mailler les réseaux électriques côtiers critiques et les stations de pompage d’eau potable.',
      'Sécuriser 3 mois de stocks alimentaires portuaires résilients aux ouragans avant la saison atlantique 2028.',
      'Intensifier la surveillance vectorielle (dengue, chikungunya) lors de l’alternance sécheresse–pluies intenses.',
    ],
    recommendationsEn: [
      'Expand CCRIF-SPC parametric insurance and climate-debt pause clauses across all Caribbean SIDS.',
      'Underground and micro-grid critical coastal power lines, hospitals, and potable water pumping stations.',
      'Pre-position 90-day hurricane-hardened food reserves ahead of the 2028 La Niña Atlantic season.',
      'Escalate vector-borne disease control (dengue/chikungunya) across drought-to-flood transitions.',
    ],
  },
  {
    id: 'amerique-du-nord',
    code: 'NAM-2',
    nameFr: 'Amérique du Nord',
    nameEn: 'North America',
    groupLabelFr: 'Canada & États-Unis (Périmètre ONU)',
    groupLabelEn: 'Canada & United States (UN Region)',
    perimeterNoteFr:
      'Canada et États-Unis (définition ONU de l’Amérique du Nord ; les interactions commerciales USMCA avec le Mexique sont traitées en lien avec la zone Amérique latine).',
    perimeterNoteEn:
      'Canada and the United States (UN North America classification; USMCA agrifood linkages with Mexico are cross-referenced under Latin America).',
    memberIso2s: ['CA', 'US'],
    teleconnectionFr:
      'Amplification et déviation du courant-jet du Pacifique : hivers nettement plus doux et secs sur le Canada et le Nord des États-Unis (déficit d’enneigement dans les Rocheuses), opposés à un rail dépressionnaire humide et tempétueux sur la Californie, le Texas, le Golfe et la Floride.',
    teleconnectionEn:
      'Strengthened subtropical Pacific jet stream: milder, drier winters across Canada and northern US states (low mountain snowpack) paired with stormier, wetter winters across California, Texas, and the Gulf/Florida corridor.',
    agricultureEnergyFr:
      'Impact macroéconomique relatif plus contenu (~2 à 3 % de traînée PIB/habitant cumulée sur 5 ans selon Oxford Economics), mais pertes absolues élevées : sécheresse estivale précoce des prairies canadiennes/blé, rivières atmosphériques californiennes et pertes assurantielles tempêtes.',
    agricultureEnergyEn:
      'Smaller relative macro drag (~2–3% cumulative GDP/capita over 5 years per Oxford Economics) yet large absolute dollar losses: Canadian prairie snowpack/grain stress, California atmospheric rivers, and storm insurance claims.',
    macroDisplacementFr:
      'Allongement des saisons de mégafeux au Canada et dans l’Ouest américain (panaches de fumée affectant la santé respiratoire sur la côte Est), pics de climatisation estivale sur les réseaux ERCOT/WECC et volatilité des assurances habitation côtières.',
    macroDisplacementEn:
      'Extended Canadian and Western US wildfire seasons (transcontinental smoke episodes), summer power-grid peaks (ERCOT/WECC), and coastal property insurance repricing.',
    recommendationsFr: [
      'Gérer préventivement les bassins nivaux des Rocheuses et du fleuve Colorado face au déficit d’enneigement hivernal canadien et nord-américain.',
      'Durcir les réseaux électriques face aux tempêtes hivernales du Sud et aux pointes thermiques d’été.',
      'Synchroniser les moyens aériens transfrontaliers de lutte contre les mégafeux entre Canada et États-Unis dès le printemps.',
      'Stabiliser la réassurance paramétrique des régions côtières du Golfe en préparation du rebond cyclonique La Niña 2028.',
    ],
    recommendationsEn: [
      'Adjust Colorado Basin and Rocky Mountain reservoir allocations ahead of reduced northern winter snowpack.',
      'Harden southern and western power grids against Gulf winter storms and summer heat peaks.',
      'Pre-coordinate US–Canada aerial wildfire suppression fleets ahead of early dry springs.',
      'Reinforce Gulf and Atlantic parametric reinsurance capacity prior to the 2028 La Niña hurricane shift.',
    ],
  },
  {
    id: 'europe-est',
    code: 'EEU-17',
    nameFr: 'Europe de l’Est & Balkans',
    nameEn: 'Eastern Europe & Balkans',
    groupLabelFr: 'Europe orientale, Mer Noire & Balkans (17 États)',
    groupLabelEn: 'Eastern Europe, Black Sea & Balkans (17 States)',
    perimeterNoteFr:
      '17 États d’Europe orientale et balkanique (Russie, Ukraine, Pologne, Roumanie, Biélorussie, Bulgarie, Tchéquie, Hongrie, Slovaquie, Moldavie, Serbie, Croatie, Slovénie, Bosnie-Herzégovine, Albanie, Macédoine du Nord, Monténégro ; les membres UE sont également consolidés dans UE-27).',
    perimeterNoteEn:
      '17 Eastern European and Balkan states (Russian Federation, Ukraine, Poland, Romania, Belarus, Bulgaria, Czechia, Hungary, Slovakia, Moldova, Serbia, Croatia, Slovenia, Bosnia & Herzegovina, Albania, North Macedonia, Montenegro; EU members also aggregated in EU-27).',
    memberIso2s: [
      'BY', 'BG', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SK', 'UA', 'RS', 'BA', 'AL', 'MK', 'ME', 'HR', 'SI',
    ],
    teleconnectionFr:
      'Réponse extratropicale via ondes planétaires de Rossby : hivers plus continentaux ou contrastés en Russie européenne/Biélorussie, suivis d’épisodes de blocage anticyclonique estival asséchant le bassin du Danube, les plaines ukrainiennes/moldaves/roumaines et la steppe céréalière de la mer Noire.',
    teleconnectionEn:
      'Extratropical Rossby-wave teleconnection: contrasted Eurasian winters followed by summer anticyclonic blocking across the Danube basin, Hungary, Romania, Moldova, Ukraine, and Black Sea grain belts.',
    agricultureEnergyFr:
      'Sensibilité élevée du blé d’hiver, du maïs danubien et du tournesol aux vagues de chaleur de juin–août ; tout fléchissement des exportations céréalières de la mer Noire se répercute immédiatement sur les prix du pain et du blé en Afrique du Nord, au Moyen-Orient et dans l’océan Indien.',
    agricultureEnergyEn:
      'High sensitivity of winter wheat, Danube maize, and sunflower yields to June–August heat domes; any Black Sea export shortfall immediately tightens wheat prices for North Africa, the Middle East, and the Indian Ocean.',
    macroDisplacementFr:
      'Basses eaux du bas-Danube perturbant le fret fluvial céréalier et énergétique, risques d’incendies de forêts boréales en Sibérie et Balkans, et tension sur les coûts de refroidissement industriel et urbain.',
    macroDisplacementEn:
      'Low Lower-Danube river levels slowing grain/barge logistics, boreal and Balkan wildfire exposure, and higher urban cooling and grid strain.',
    recommendationsFr: [
      'Sécuriser la capacité de stockage frigorifique et l’irrigation d’appoint dans la plaine du Danube (Roumanie, Hongrie, Serbie, Bulgarie).',
      'Diversifier les voies ferrées d’exportation céréalière de la mer Noire en complément du transport fluvial danubien.',
      'Déployer des variétés précoces de blé et de tournesol évitant l’échaudage thermique de fin de printemps.',
      'Surveiller les réserves hydriques hydroélectriques balkaniques avant l’étiage de juillet–septembre.',
    ],
    recommendationsEn: [
      'Expand grain storage conditioning and supplemental irrigation across Danube farmland (Romania, Hungary, Serbia, Bulgaria).',
      'Maintain rail export redundancy alongside Danube barge routes during summer low-water phases.',
      'Adopt early-maturing winter wheat and sunflower varieties to escape late-spring heat stress.',
      'Monitor Balkan reservoir levels ahead of July–September peak summer power demand.',
    ],
  },
  {
    id: 'moyen-orient',
    code: 'MENA-ME',
    nameFr: 'Moyen-Orient (16 États)',
    nameEn: 'Middle East (16 States)',
    groupLabelFr: 'Asie occidentale, Golfe, Levant & Égypte',
    groupLabelEn: 'West Asia, Gulf, Levant & Egypt',
    perimeterNoteFr:
      '16 États du Moyen-Orient élargi : Conseil de coopération du Golfe (Arabie saoudite, ÉAU, Qatar, Koweït, Oman, Bahreïn), Levant & Croissant fertile (Irak, Iran, Jordanie, Liban, Syrie, Israël, Palestine), Turquie, Yémen et Égypte (pont Sinaï/Suez/Nil).',
    perimeterNoteEn:
      '16 wider Middle East states: GCC (Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain), Levant & Mesopotamia (Iraq, Iran, Jordan, Lebanon, Syria, Israel, Palestine), Türkiye, Yemen, and Egypt (Suez/Nile corridor).',
    memberIso2s: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE', 'IQ', 'IR', 'IL', 'PS', 'JO', 'LB', 'SY', 'TR', 'EG'],
    teleconnectionFr:
      'L’amplification thermique de base couplée au réchauffement IOD+ de l’océan Indien entraîne des extrêmes de chaleur humide (>48–52 °C autour du Golfe Persique et mer Rouge), des tempêtes convectives soudaines sur Oman/ÉAU/Yémen, et un déficit critique des bassins Tigre–Euphrate, Jourdain et Nil.',
    teleconnectionEn:
      'Coupled Pacific warming and positive Indian Ocean Dipole anomalies drive lethal Gulf/Red Sea wet-bulb heat (>48–52°C), sudden convective flash floods across Oman/UAE/Yemen, and acute Tigris–Euphrates, Jordan, and Nile water stress.',
    agricultureEnergyFr:
      'Forte dépendance structurelle aux importations mondiales de blé, riz et maïs (exposée simultanément aux chocs ASEAN, mer Noire et Amériques), chute des rendements irrigués en Irak/Syrie/Iran/Égypte, et explosion de la demande électrique de dessalement et de climatisation.',
    agricultureEnergyEn:
      'Acute reliance on global wheat, rice, and maize imports (simultaneously exposed to ASEAN, Black Sea & Americas shocks), falling Iraq/Syria/Iran irrigated yields, and peaking power demand for desalination and cooling.',
    macroDisplacementFr:
      'Vulnérabilité humanitaire extrême au Yémen, en Syrie, en Irak et en Palestine ; salinisation agricole du delta du Nil et du Chatt-el-Arab ; et risque de perturbation des corridors maritimes Mer Rouge / Suez / Ormuz sous épisodes extrêmes.',
    macroDisplacementEn:
      'Acute humanitarian food strain across Yemen, Syria, Iraq, and Palestine; Nile Delta and Shatt al-Arab soil salinization; and weather stress along Red Sea/Suez/Hormuz maritime logistics.',
    recommendationsFr: [
      'Porter les réserves stratégiques de blé, riz et orge à 6–9 mois de consommation via des accords multi-fournisseurs sécurisés.',
      'Coupler les usines de dessalement et réseaux de climatisation urbains à des capacités solaires dédiées pour absorber les pics >50 °C.',
      'Protéger la santé des travailleurs extérieurs par arrêt horaire thermique obligatoire et centres de refroidissement communautaires.',
      'Financer la réhabilitation des réseaux d’irrigation et des systèmes d’alerte crues éclairs (Oman, Yémen, Golfe).',
    ],
    recommendationsEn: [
      'Extend strategic wheat, rice, and barley reserves to 6–9 months of demand through diversified supplier contracts.',
      'Pair coastal desalination plants and district cooling with utility-scale solar to absorb >50°C demand peaks.',
      'Enforce mandatory midday heat-work pauses and urban cooling shelters across high wet-bulb zones.',
      'Upgrade drip-irrigation efficiency and urban flash-flood drainage across Oman, Yemen, and Gulf cities.',
    ],
  },
  {
    id: 'asie',
    code: 'ASI-48',
    nameFr: 'Asie (48 États ONU)',
    nameEn: 'Asia (48 UN States)',
    groupLabelFr: 'Asie du Sud, Sud-Est, Est, Centrale & Ouest',
    groupLabelEn: 'South, Southeast, East, Central & West Asia',
    perimeterNoteFr:
      'Les 48 États d’Asie reconnus à l’ONU (47 États membres + État de Palestine), couvrant le plus grand foyer démographique (~4,8 Md hab.) et les principaux greniers mondiaux de riz et de blé.',
    perimeterNoteEn:
      'All 48 UN-classified Asian states (47 Member States + State of Palestine), representing ~4.8B people and the world’s primary rice and wheat production hubs.',
    memberIso2s: ALL_ASIA_ISO2,
    teleconnectionFr:
      'Basculé par la cellule de Walker et l’IOD+ : affaiblissement de la mousson indienne d’été, déficit pluviométrique sur l’ASEAN et l’Australie voisine, contraste Chine du Sud inondée / Chine du Nord sèche, et fonte accélérée des glaciers du Pamir/Himalaya affectant l’irrigation en Asie centrale et du Sud.',
    teleconnectionEn:
      'Shifted by the Walker cell and IOD+: weakened South Asian summer monsoon, Southeast Asian maritime drought, wet South China vs. dry North China dipole, and accelerated Pamir/Himalayan melt affecting Central & South Asian river irrigation.',
    agricultureEnergyFr:
      'Rôle directeur sur la sécurité alimentaire mondiale : toute restriction d’exportation de riz (Inde, Thaïlande, Viêt Nam) provoque une onde inflationniste globale vers Madagascar, l’Afrique et le Moyen-Orient ; perte majeure d’huile de palme, thé, sucre et productivité agricole sous chaleur humide.',
    agricultureEnergyEn:
      'Global food-price anchor: any rice export curbs (India, Thailand, Viet Nam) trigger immediate price shocks across Madagascar, Africa, and the Middle East alongside palm oil, tea, sugar, and wet-bulb labor losses.',
    macroDisplacementFr:
      'Exposition démographique record (>1,2 milliard de travailleurs agricoles et urbains sous canicules humides et moussons irrégulières), suivi d’inondations fluviales de l’Indus, du Gange, du Mékong et du Yangtsé lors de l’inversion La Niña 2028.',
    macroDisplacementEn:
      'Unprecedented demographic exposure (>1.2B outdoor/farm workers facing wet-bulb heat and monsoon variability), shifting to severe Indus/Ganges/Mekong/Yangtze floods during 2028 La Niña.',
    recommendationsFr: [
      'Maintenir des mécanismes transparents OMC/ASEAN/SAARC évitant les embargos céréaliers soudains en période de pic ONI.',
      'Généraliser les plans nationaux d’alerte chaleur extrême (Inde, Pakistan, Bangladesh, Golfe, Asie du Sud-Est).',
      'Déployer massivement le riz tolérant à la sécheresse et à la submersion (variétés Scuba-Rice / IRRI) à travers les deltas asiatiques.',
      'Moderniser les barrages multi-usages (irrigation + laminage de crues) en préparation de la transition rapide vers La Niña.',
    ],
    recommendationsEn: [
      'Maintain transparent WTO/ASEAN/SAARC grain-trade guardrails to prevent cascading rice export bans.',
      'Scale municipal Heat Action Plans and early wet-bulb alerts across South, West, and Southeast Asia.',
      'Accelerate adoption of IRRI drought- and submergence-tolerant rice cultivars across major Asian deltas.',
      'Optimize multipurpose reservoir drawdown rules ahead of rapid 2028 La Niña monsoon reversals.',
    ],
  },
];

export interface ZonalYearMetric {
  year: ForecastYear;
  lossBUsd: number;
  gdpLossPct: number;
  avgInflationAddPct: number;
  avgDroughtIdx: number;
  avgFloodIdx: number;
  avgDisplacementIdx: number;
}

export interface ZonalMemberCountryMetric {
  country: DuplicatedWorldCountry;
  gdpDeltaPct: number;
  lossBUsd: number;
  cumulative2027_2031BUsd: number;
  inflationAddPct: number;
  droughtIdx: number;
  floodIdx: number;
  displacementIdx: number;
  famineRisk: 'Critique' | 'Élevé' | 'Modéré' | 'Faible';
}

export interface ZonalAnalysisReport {
  definition: ZonalDefinition;
  selectedYear: ForecastYear;
  scenario: ScenarioKey;
  countryCount: number;
  totalPopM: number;
  totalGdpB: number;
  activeLossBUsd: number;
  activeGdpLossPct: number;
  cumulative2027_2031BUsd: number;
  avgInflationAddPct: number;
  avgDroughtIdx: number;
  avgFloodIdx: number;
  avgDisplacementIdx: number;
  criticalHighPopM: number;
  dominantRegimeFr: string;
  dominantRegimeEn: string;
  trajectory2027_2032: ZonalYearMetric[];
  members: ZonalMemberCountryMetric[];
}

const COUNTRY_BY_ISO2 = new Map<string, DuplicatedWorldCountry>(
  DUPLICATED_195_COUNTRIES.map((c) => [c.iso2, c]),
);

export function getZonalDefinition(zoneId: RegionalBlocZoneId): ZonalDefinition {
  return ZONAL_DEFINITIONS.find((z) => z.id === zoneId) ?? ZONAL_DEFINITIONS[0];
}

export function computeZoneConsolidatedAnalysis(params: {
  zoneId: RegionalBlocZoneId;
  year: ForecastYear;
  scenario: ScenarioKey;
  liveFactor?: number;
}): ZonalAnalysisReport {
  const { zoneId, year, scenario, liveFactor = 1 } = params;
  const definition = getZonalDefinition(zoneId);
  const mult = SCENARIO_MULTIPLIERS[scenario] * Math.max(0.5, Math.min(2.0, liveFactor));

  const seedCountries = definition.memberIso2s
    .map((iso2) => COUNTRY_BY_ISO2.get(iso2))
    .filter((c): c is DuplicatedWorldCountry => Boolean(c));

  const totalPopM = Number(seedCountries.reduce((s, c) => s + c.popM, 0).toFixed(1));
  const totalGdpB = Number(seedCountries.reduce((s, c) => s + c.gdpB, 0).toFixed(1));

  const trajectory2027_2032: ZonalYearMetric[] = FORECAST_YEARS_6.map((yr) => {
    let lossSum = 0;
    let infSum = 0;
    let droughtSum = 0;
    let floodSum = 0;
    let dispSum = 0;

    seedCountries.forEach((country) => {
      const proj = country.projections[yr];
      lossSum += proj.lossBUsd * mult;
      infSum += proj.inflationAddPct * Math.min(1.45, Math.pow(mult, 0.72));
      droughtSum += Math.min(99, Math.round(proj.droughtIdx * Math.min(1.22, Math.pow(mult, 0.25))));
      floodSum += Math.min(99, Math.round(proj.floodIdx * Math.min(1.22, Math.pow(mult, 0.25))));
      dispSum += Math.min(99, Math.round(proj.displacementIdx * Math.min(1.25, Math.pow(mult, 0.28))));
    });

    const n = Math.max(1, seedCountries.length);
    const gdpLossPct = totalGdpB > 0 ? Number(((lossSum / totalGdpB) * 100).toFixed(2)) : 0;
    return {
      year: yr,
      lossBUsd: Number(lossSum.toFixed(2)),
      gdpLossPct,
      avgInflationAddPct: Number((infSum / n).toFixed(1)),
      avgDroughtIdx: Math.round(droughtSum / n),
      avgFloodIdx: Math.round(floodSum / n),
      avgDisplacementIdx: Math.round(dispSum / n),
    };
  });

  const members: ZonalMemberCountryMetric[] = seedCountries
    .map((country) => {
      const proj = country.projections[year];
      const scaledLoss = Number((proj.lossBUsd * mult).toFixed(3));
      const scaledDelta = Number((proj.gdpDeltaPct * mult).toFixed(2));
      const scaledCum = Number((country.cumulativeLoss2027_2031BUsd * mult).toFixed(2));
      const scaledInf = Number((proj.inflationAddPct * Math.min(1.45, Math.pow(mult, 0.72))).toFixed(1));
      const scaledDrought = Math.min(99, Math.round(proj.droughtIdx * Math.min(1.22, Math.pow(mult, 0.25))));
      const scaledFlood = Math.min(99, Math.round(proj.floodIdx * Math.min(1.22, Math.pow(mult, 0.25))));
      const scaledDisp = Math.min(99, Math.round(proj.displacementIdx * Math.min(1.25, Math.pow(mult, 0.28))));

      const riskScore = Math.abs(scaledDelta) * 14 + scaledDisp * 0.4 + scaledInf * 2;
      const famineRisk: ZonalMemberCountryMetric['famineRisk'] =
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
        country,
        gdpDeltaPct: scaledDelta,
        lossBUsd: scaledLoss,
        cumulative2027_2031BUsd: scaledCum,
        inflationAddPct: scaledInf,
        droughtIdx: scaledDrought,
        floodIdx: scaledFlood,
        displacementIdx: scaledDisp,
        famineRisk,
      };
    })
    .sort((a, b) => b.lossBUsd - a.lossBUsd);

  const activeMetric =
    trajectory2027_2032.find((t) => t.year === year) ?? trajectory2027_2032[0];

  const cumulative2027_2031BUsd = Number(
    trajectory2027_2032
      .filter((t) => t.year <= 2031)
      .reduce((s, t) => s + t.lossBUsd, 0)
      .toFixed(1),
  );

  const criticalHighPopM = Number(
    members
      .filter((m) => m.famineRisk === 'Critique' || m.famineRisk === 'Élevé')
      .reduce((s, m) => s + m.country.popM, 0)
      .toFixed(1),
  );

  // Representative climatic regime from highest-impact member in selected year
  const leadMember = members[0]?.country ?? seedCountries[0];
  const dominantRegimeFr = leadMember?.projections[year]?.regimeFr ?? 'El Niño · Stress multi-risques';
  const dominantRegimeEn = leadMember?.projections[year]?.regimeEn ?? 'El Niño · Multi-hazard stress';

  return {
    definition,
    selectedYear: year,
    scenario,
    countryCount: seedCountries.length,
    totalPopM,
    totalGdpB,
    activeLossBUsd: activeMetric.lossBUsd,
    activeGdpLossPct: activeMetric.gdpLossPct,
    cumulative2027_2031BUsd,
    avgInflationAddPct: activeMetric.avgInflationAddPct,
    avgDroughtIdx: activeMetric.avgDroughtIdx,
    avgFloodIdx: activeMetric.avgFloodIdx,
    avgDisplacementIdx: activeMetric.avgDisplacementIdx,
    criticalHighPopM,
    dominantRegimeFr,
    dominantRegimeEn,
    trajectory2027_2032,
    members,
  };
}

export function computeAll13ZonesConsolidated(params: {
  year: ForecastYear;
  scenario: ScenarioKey;
  liveFactor?: number;
}): ZonalAnalysisReport[] {
  return ZONAL_DEFINITIONS.map((def) =>
    computeZoneConsolidatedAnalysis({
      zoneId: def.id,
      year: params.year,
      scenario: params.scenario,
      liveFactor: params.liveFactor,
    }),
  );
}
