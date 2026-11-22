import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MADAGASCAR_23_REGION_SPECIALIZATIONS } from '../data/adamSmithAgroData';
import { WORLD_195_COUNTRIES } from '../data/worldEnso195Data';
import { computeEconomicAggregation, type ScenarioKey } from './economicAggregation';
import { emitPdfDownloadSuccess } from './pdfToastEvents';
import { LICENSE_ATTRIBUTION } from './scientificReportGenerator';
import { buildComparativeVisualReportData } from './zonalImpactComparison';

export interface PitchHighlightMetric {
  labelFr: string;
  labelEn: string;
  value: string;
  contextFr: string;
  contextEn: string;
}

export interface PitchSlideSpec {
  id: string;
  slideNumber: string;
  kickerFr: string;
  kickerEn: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  bulletsFr: string[];
  bulletsEn: string[];
  metrics: PitchHighlightMetric[];
  speakerNoteFr: string;
  speakerNoteEn: string;
  audienceTagsFr: string;
  audienceTagsEn: string;
  visualKind: 'mandate' | 'dataops' | 'mlops-provinces' | 'zonal-blocs' | 'adam-smith' | 'last-mile' | 'roadmap';
}

export interface PitchChartDatum {
  name: string;
  primary: number;
  secondary: number;
}

export interface ExecutivePitchDeckData {
  slides: PitchSlideSpec[];
  provinceLossChart: PitchChartDatum[];
  blocComparisonChart: Array<{
    code: string;
    intensity: number;
    agriRisk: number;
    resilience: number;
  }>;
  oniObservedC: number;
  madagascarS2MUsd: number;
  madagascarS3MUsd: number;
}

export function buildExecutivePitchDeckData(params: {
  oniObservedC: number;
  liveFeedsCount?: number;
}): ExecutivePitchDeckData {
  const { oniObservedC, liveFeedsCount = 2 } = params;

  const s1 = computeEconomicAggregation({
    horizonYear: 2027,
    scenario: 's1' as ScenarioKey,
    scope: 'consolidated119',
    lang: 'fr',
  });
  const s2 = computeEconomicAggregation({
    horizonYear: 2027,
    scenario: 's2' as ScenarioKey,
    scope: 'consolidated119',
    lang: 'fr',
  });
  const s3 = computeEconomicAggregation({
    horizonYear: 2027,
    scenario: 's3' as ScenarioKey,
    scope: 'consolidated119',
    lang: 'fr',
  });

  const provinceLossChart: PitchChartDatum[] = s2.provinceRows.map((p, idx) => ({
    name: p.province,
    primary: Number(p.totalLossMUsd.toFixed(1)),
    secondary: Number((s3.provinceRows[idx]?.totalLossMUsd ?? p.totalLossMUsd * 1.45).toFixed(1)),
  }));

  const zonalBench = buildComparativeVisualReportData({
    zoneIds: ['ocean-indien-coi', 'sadc', 'comesa', 'afrique', 'asean', 'ue'],
    year: 2027,
    scenario: 's2',
  });

  const blocComparisonChart = zonalBench.items.map((item) => ({
    code: item.code,
    intensity: item.ensoIntensityIndex,
    agriRisk: item.agriRiskScore,
    resilience: item.economicResilienceScore,
  }));

  const slides: PitchSlideSpec[] = [
    {
      id: 'mandate',
      slideNumber: '01',
      kickerFr: 'MANDAT EXÉCUTIF · M&G CONSULTING · DG PRINCE MANANTENASOA',
      kickerEn: 'EXECUTIVE MANDATE · M&G CONSULTING · CEO PRINCE MANANTENASOA',
      titleFr: 'Observatoire ENSO 2026–2032 : De la donnée climatique à la décision souveraine',
      titleEn: 'ENSO Observatory 2026–2032: Turning Climate Telemetry into Sovereign Decisions',
      subtitleFr:
        'Un système décisionnel opérationnel reliant l’océanographie Pacifique/Indien aux 119 districts de Madagascar, aux 54 États africains et aux 195 pays de l’ONU.',
      subtitleEn:
        'An operational decision-support platform connecting Pacific/Indian Ocean dynamics to 119 Madagascar districts, 54 African nations, and 195 UN countries.',
      bulletsFr: [
        'Comble le fossé critique entre bulletins météo généraux et chiffrage économique exploitable par les ministères et bailleurs.',
        'Modélisation unifiée multi-horizons (2027–2032) couvrant chocs El Niño, transitions La Niña et inflation alimentaire.',
        'Développé à Madagascar par M&G Consulting sous architecture souveraine DataOps, MLOps, DevOps et IA Générative.',
      ],
      bulletsEn: [
        'Bridges the operational gap between general weather advisories and actionable economic loss quantification for ministries and donors.',
        'Unified multi-horizon modeling (2027–2032) spanning El Niño shocks, La Niña transitions, and food inflation.',
        'Engineered in Madagascar by M&G Consulting combining sovereign DataOps, MLOps, DevOps, and Generative AI.',
      ],
      metrics: [
        {
          labelFr: 'Couverture Mondiale ONU',
          labelEn: 'UN Global Coverage',
          value: `${WORLD_195_COUNTRIES.length}`,
          contextFr: '193 États membres + 2 observateurs · 13 blocs',
          contextEn: '193 member states + 2 observers · 13 blocs',
        },
        {
          labelFr: 'Granularité Madagascar',
          labelEn: 'Madagascar Granularity',
          value: '119 ADM2',
          contextFr: '6 ex-provinces · 23 régions · 42 bassins prioritaires',
          contextEn: '6 provinces · 23 regions · 42 priority basins',
        },
        {
          labelFr: 'Population Grand Sud Exposée',
          labelEn: 'Grand Sud Exposed Pop.',
          value: '3,72 M',
          contextFr: 'Déficit pluviométrique −30 % à −50 % modélisé',
          contextEn: 'Modeled −30% to −50% rainfall deficit',
        },
      ],
      speakerNoteFr:
        'Ouvrir la réunion en rappelant que cette plateforme existe déjà en production : chaque ministère (MINAE, MEDD), agence ONU (FAO) ou secrétariat régional (UA, COI, SADC, COMESA) peut interroger en direct son périmètre.',
      speakerNoteEn:
        'Open the briefing by emphasizing that this system is live today: ministries, FAO Madagascar, AU, IOC, SADC, and COMESA can inspect their exact territorial parameters immediately.',
      audienceTagsFr: 'FAO · Union Africaine · COI · SADC · COMESA · OIF · MINAE · MEDD',
      audienceTagsEn: 'FAO · African Union · IOC · SADC · COMESA · OIF · MINAE · MEDD',
      visualKind: 'mandate',
    },
    {
      id: 'dataops-telemetry',
      slideNumber: '02',
      kickerFr: '02 · ARCHITECTURE DATAOPS & VEILLE MÉTÉO TEMPS RÉEL (SSE / RSS)',
      kickerEn: '02 · DATAOPS ARCHITECTURE & REAL-TIME RSS METEO STREAM (SSE)',
      titleFr: `Super El Niño actif (ONI +${oniObservedC.toFixed(1)} °C) & Dipôle IOD+ : Écoute continue des agences`,
      titleEn: `Active Super El Niño (ONI +${oniObservedC.toFixed(1)} °C) & Positive IOD+: Continuous Agency Listener`,
      subtitleFr:
        'Synchronisation automatique de l’OMM/WMO, NOAA CPC, GDACS ONU, DGM/SWIOCOF-15 et de 15 stations mondiales Open-Meteo avec recalibration à minuit et chaque quinzaine.',
      subtitleEn:
        'Automated synchronization with WMO, NOAA CPC, UN GDACS, DGM/SWIOCOF-15, and 15 global Open-Meteo hubs with midnight and 15-day recalibration.',
      bulletsFr: [
        'Asymétrie continentale surveillée : sécheresse sévère SADC / Grand Sud Madagascar vs crues torrentielles Afrique de l’Est (COMESA) & SAVA.',
        'Écouteur RSS/Atom temps réel par Server-Sent Events (SSE) classant chaque bulletin par niveau de gravité (CRITICAL / HIGH / WATCH).',
        'Historique et veille prospective 1982–2032 permettant de comparer 1982/1997/2015 avec la trajectoire 2026–2027 (pic +4,1 °C).',
      ],
      bulletsEn: [
        'Tracks continental asymmetry: severe SADC & Grand Sud drought vs. East African (COMESA) & NE Madagascar flash flooding.',
        'Real-time SSE RSS/Atom stream classifying global bulletins by severity (CRITICAL / HIGH / WATCH).',
        '1982–2032 chronological alert archive benchmarking 1982/1997/2015 super events against the 2026–2027 trajectory (+4.1 °C peak).',
      ],
      metrics: [
        {
          labelFr: 'Indice ONI Observé',
          labelEn: 'Observed ONI Anomaly',
          value: `+${oniObservedC.toFixed(1)} °C`,
          contextFr: 'Pic projeté +4,1 °C en janv. 2027 (IOD+ couplé)',
          contextEn: 'Projected Jan 2027 peak +4.1 °C (coupled IOD+)',
        },
        {
          labelFr: 'Flux RSS Météo Actifs',
          labelEn: 'Active RSS Meteo Feeds',
          value: `${liveFeedsCount}/4 Live`,
          contextFr: 'WMO · NOAA CPC · UN GDACS · DGM/SWIOCOF',
          contextEn: 'WMO · NOAA CPC · UN GDACS · DGM/SWIOCOF',
        },
        {
          labelFr: 'Cadence de Recalibration',
          labelEn: 'Recalibration Cadence',
          value: '00:00 + 15j',
          contextFr: 'Cron DataOps quotidien & trajectoire quinzaine',
          contextEn: 'Midnight DataOps cron & 15-day trajectory sync',
        },
      ],
      speakerNoteFr:
        'Insister sur la robustesse DataOps : les flux RSS officiels et les relevés Open-Meteo recalibrent les facteurs hydriques sans intervention manuelle, avec cache de repli garanti hors ligne.',
      speakerNoteEn:
        'Highlight DataOps reliability: official RSS XML feeds and Open-Meteo station telemetry automatically recalibrate regional water factors with deterministic offline fallback.',
      audienceTagsFr: 'OMM / WMO · DGM Madagascar · BNGRC · MEDD · SWIOCOF-15',
      audienceTagsEn: 'WMO · Meteo Madagascar · BNGRC · MEDD · SWIOCOF-15',
      visualKind: 'dataops',
    },
    {
      id: 'mlops-economics',
      slideNumber: '03',
      kickerFr: '03 · MODÉLISATION MLOPS (XGBOOST–LSTM) & CHIFFRAGE MACROÉCONOMIQUE',
      kickerEn: '03 · MLOPS FORECASTING (XGBOOST–LSTM) & MACROECONOMIC QUANTIFICATION',
      titleFr: 'Quantification des pertes par province et scénario (S1 · S2 · S3)',
      titleEn: 'Provincial Economic Loss & Food Inflation Quantification (S1 · S2 · S3)',
      subtitleFr:
        'Traduction économétrique des chocs hydriques en pertes de PIB agricole, tension sur les prix du riz et besoins financiers en USD, EUR et Ariary (MGA).',
      subtitleEn:
        'Econometric translation of hydro-climatic anomalies into agricultural GDP losses, rice price inflation, and financing needs in USD, EUR, and MGA.',
      bulletsFr: [
        `Invariance comptable stricte : S1 (${s1.madagascar.totalLossMUsd.toFixed(0)} M$) < S2 (${s2.madagascar.totalLossMUsd.toFixed(0)} M$) < S3 (${s3.madagascar.totalLossMUsd.toFixed(0)} M$) sur les 6 ex-provinces et 23 régions.`,
        'Modélisation prix du riz local Antananarivo (projection jusqu’à 3 200 MGA/kg, +25,5 %) et alerte étiage hydroélectrique (RIA / Andekaleka).',
        'Évaluateur et simulateur temps réel avec export CSV direct pour les équipes économistes (ministères des Finances, FAO, Banque mondiale).',
      ],
      bulletsEn: [
        `Strict accounting invariance: S1 ($${s1.madagascar.totalLossMUsd.toFixed(0)}M) < S2 ($${s2.madagascar.totalLossMUsd.toFixed(0)}M) < S3 ($${s3.madagascar.totalLossMUsd.toFixed(0)}M) across 6 provinces & 23 regions.`,
        'Models Antananarivo local rice price spike (up to 3,200 MGA/kg, +25.5%) alongside Andekaleka hydropower drawdown pressure.',
        'Interactive scenario simulator & loss evaluator with 1-click spreadsheet CSV export for ministry economists & donor analysts.',
      ],
      metrics: [
        {
          labelFr: 'Perte Madagascar S2 (Base ML)',
          labelEn: 'Madagascar Loss S2 (Baseline)',
          value: `${s2.madagascar.totalLossMUsd.toFixed(0)} M$`,
          contextFr: 'Horizon 2027 consolidé 119 districts ADM2',
          contextEn: '2027 horizon consolidated across 119 districts',
        },
        {
          labelFr: 'Perte Madagascar S3 (Extrême)',
          labelEn: 'Madagascar Loss S3 (Extreme)',
          value: `${s3.madagascar.totalLossMUsd.toFixed(0)} M$`,
          contextFr: 'Stress test sévère (+45 % choc sectoriel)',
          contextEn: 'Severe stress test (+45% sectoral shock)',
        },
        {
          labelFr: 'Horizon Mondial 2027–2031',
          labelEn: 'Global 2027–2031 Exposure',
          value: '~4 000 Md$',
          contextFr: 'Calibré sur Dartmouth & Oxford Economics',
          contextEn: 'Calibrated on Dartmouth & Oxford Economics',
        },
      ],
      speakerNoteFr:
        'Montrer le graphique comparatif des 6 ex-provinces : Toliara et Toamasina concentrent des profils de risque opposés mais complémentaires (sécheresse du Grand Sud vs risque cyclonique/Alaotra).',
      speakerNoteEn:
        'Point to the 6-province comparative bar chart: Toliara and Toamasina exhibit distinct but complementary exposure profiles (Grand Sud drought vs. Alaotra/East cyclone shocks).',
      audienceTagsFr: 'FAO Économie · MINAE · Ministère des Finances · Banque Africaine de Développement',
      audienceTagsEn: 'FAO Economics · MINAE · Ministry of Finance · AfDB',
      visualKind: 'mlops-provinces',
    },
    {
      id: 'zonal-blocs',
      slideNumber: '04',
      kickerFr: '04 · CONSOLIDATION GÉOPOLITIQUE : COI · COMESA · SADC · UA · ASEAN · UE',
      kickerEn: '04 · GEOPOLITICAL BENCHMARKING: IOC · COMESA · SADC · AU · ASEAN · EU',
      titleFr: 'Zonal Impact Dashboard : Arbitrage comparatif entre 13 blocs régionaux',
      titleEn: 'Zonal Impact Dashboard: Side-by-Side Benchmarking Across 13 Blocs',
      subtitleFr:
        'Outil conçu pour les sommets ministériels UA, COI, SADC et COMESA afin d’aligner les stocks alimentaires régionaux et les déclencheurs d’assurance paramétrique (ARC).',
      subtitleEn:
        'Built for AU, IOC, SADC, and COMESA ministerial summits to coordinate regional grain reserves and sovereign parametric insurance triggers (ARC).',
      bulletsFr: [
        'Compare en temps réel l’indice d’intensité ENSO, le risque agricole (0–100) et l’indice de résilience macroéconomique.',
        'Met en évidence la vulnérabilité alimentaire accrue de la SADC/COMESA face à l’Europe (UE-27) pour justifier les mécanismes de solidarité climatique.',
        'Génère en un clic un cahier PDF A4 multi-pages imprimable pour les réunions ministérielles et les coopératives régionales.',
      ],
      bulletsEn: [
        'Benchmarks ENSO intensity index, agricultural risk (0–100), and macroeconomic resilience across selected blocs simultaneously.',
        'Quantifies the resilience gap between SADC/COMESA food corridors and EU-27 to substantiate climate loss-and-damage financing.',
        'Exports 1-click printable multi-page A4 PDF briefs tailored for ministerial councils and agricultural cooperatives.',
      ],
      metrics: [
        {
          labelFr: 'Afrique (Union Africaine)',
          labelEn: 'Africa (African Union)',
          value: '54 États',
          contextFr: 'COI (13) · SADC (16) · COMESA (21) intégrés',
          contextEn: 'IOC (13) · SADC (16) · COMESA (21) integrated',
        },
        {
          labelFr: 'Blocs Mondiaux Couverts',
          labelEn: 'Global Blocs Covered',
          value: '13 Zones',
          contextFr: 'ASEAN · UE · Amérique Latine · Caraïbes · MENA · Asie',
          contextEn: 'ASEAN · EU · Latin America · Caribbean · MENA · Asia',
        },
        {
          labelFr: 'Trajectoire Reprise',
          labelEn: 'Recovery Window',
          value: '2027 → 2032',
          contextFr: 'Suivi reprise post-El Niño & transition La Niña',
          contextEn: 'Post-El Niño recovery & La Niña transition curve',
        },
      ],
      speakerNoteFr:
        'Ce graphique est votre levier diplomatique pour la COI, le COMESA, la SADC et l’Union Africaine : il prouve l’asymétrie de choc entre blocs et justifie des achats groupés et réserves d’urgence.',
      speakerNoteEn:
        'This comparative benchmark is built for IOC, COMESA, SADC, and AU diplomacy: it demonstrates shock asymmetry across blocs to justify regional grain pools and ARC payouts.',
      audienceTagsFr: 'Union Africaine (UA / ARC) · COI · SADC · COMESA · ASEAN',
      audienceTagsEn: 'African Union (AU / ARC) · IOC · SADC · COMESA · ASEAN',
      visualKind: 'zonal-blocs',
    },
    {
      id: 'adam-smith-agro',
      slideNumber: '05',
      kickerFr: '05 · THÉORIE ÉCONOMIQUE D’ADAM SMITH APPLIQUÉE À L’ADAPTATION CLIMATIQUE',
      kickerEn: '05 · ADAM SMITH COMPARATIVE ADVANTAGE APPLIED TO CLIMATE ADAPTATION',
      titleFr: 'Que cultiver & quels ouvrages construire toute l’année (MàJ auto 15 jours)',
      titleEn: 'Year-Round Crop Specialization & Hydro-Engineering Prescriptions (15d Sync)',
      subtitleFr:
        'Chaque province, région et nation spécialise ses cultures sur 4 trimestres (T1–T4) tout en arbitrant serres, goutte-à-goutte, barrages/sand dams et digues anti-crues.',
      subtitleEn:
        'Each province, region, and nation aligns 4-quarter crop calendars with weighted infrastructure: drip irrigation, climate greenhouses, dams/sand dams, or levees.',
      bulletsFr: [
        `Couverture complète : 6 ex-provinces, ${MADAGASCAR_23_REGION_SPECIALIZATIONS.length} régions malgaches, 54 pays d’Afrique et 195 pays ONU.`,
        'Recommandations précises : sorgho/mil 90 j en poquets Zaï au Grand Sud (déclencheur ≥ 25 mm/3j), irrigation AWD au Lac Alaotra (−30 % eau), ombrage Gliricidia en SAVA.',
        'Recalibration automatique tous les 15 jours basculant les prescriptions entre mode El Niño et mode La Niña selon l’ONI observé.',
      ],
      bulletsEn: [
        `Complete coverage: 6 provinces, ${MADAGASCAR_23_REGION_SPECIALIZATIONS.length} Madagascar regions, 54 African countries, and 195 UN states.`,
        'Targeted protocols: 90d sorghum/millet in Zaï pits (≥ 25 mm/3d rule), Alaotra AWD water rotation (−30% water), Gliricidia vanilla shading in SAVA.',
        'Automated 15-day trajectory engine dynamically shifting advisories between El Niño and La Niña regimes.',
      ],
      metrics: [
        {
          labelFr: 'Régions Spécialisées',
          labelEn: 'Specialized Regions',
          value: '23 / 23',
          contextFr: '100 % des régions malgaches + 54 pays UA',
          contextEn: '100% Madagascar regions + 54 AU countries',
        },
        {
          labelFr: 'Piliers d’Ingénierie',
          labelEn: 'Engineering Pillars',
          value: '5 Scores',
          contextFr: 'Goutte-à-goutte · Serres · Barrages · Digues · Zaï/SCV',
          contextEn: 'Drip · Greenhouses · Dams · Levees · Zaï/SCV',
        },
        {
          labelFr: 'Économie d’eau AWD/Drip',
          labelEn: 'AWD / Drip Water Saved',
          value: '30–65 %',
          contextFr: 'AWD rizières (30 %) & goutte-à-goutte sous ombrière (65 %)',
          contextEn: 'Paddy AWD (30%) & shade-net drip (65%)',
        },
      ],
      speakerNoteFr:
        'Montrer au MINAE et à la FAO comment l’économie d’Adam Smith évite le gaspillage des subventions : on investit dans les sand dams/goutte-à-goutte au Sud, les barrages régulateurs à Alaotra et les serres sur les Hautes Terres.',
      speakerNoteEn:
        'Show MINAE and FAO how Adam Smith specialization prevents misallocated subsidies: sand dams & drip in the South, regulating dams in Alaotra, and ventilated greenhouses in the Highlands.',
      audienceTagsFr: 'MINAE · FOFIFA · FAO Madagascar · GSDM · FDA-R / DEFIS',
      audienceTagsEn: 'MINAE · FOFIFA · FAO Madagascar · GSDM · FDA-R / DEFIS',
      visualKind: 'adam-smith',
    },
    {
      id: 'last-mile-genai',
      slideNumber: '06',
      kickerFr: '06 · IA GÉNÉRATIVE RAG, RÉSILIENCE HORS LIGNE (PWA) & FRANCOPHONIE',
      kickerEn: '06 · GENAI RAG, OFFLINE PWA RESILIENCE & MULTILINGUAL LAST-MILE',
      titleFr: 'Conçue pour les zones rurales sans connexion & l’espace francophone/africain',
      titleEn: 'Built for Offline Rural Operations, Cooperatives & Multilingual Diplomacy',
      subtitleFr:
        'IA multimodale (voix « Babakoto » & diagnostics FOFIFA), cache Service Worker hors ligne, exports PDF/Word/CSV instantanés et Crop Resilience Quiz de formation.',
      subtitleEn:
        'Multimodal GenAI (“Babakoto” live voice & FOFIFA diagnostics), offline Service Worker caching, 1-click PDF/Word/CSV exports, and interactive cooperative quiz.',
      bulletsFr: [
        'Interface native en 9 langues (Français, Anglais, Swahili, Espagnol, Arabe RTL, Chinois, Portugais, Hindi, Russe) avec bascule FR/EN immédiate.',
        'Mode Hors Ligne PWA + Cahiers PDF coopératives imprimables avec check-list terrain (semences 90 j, sacs hermétiques PICS −98 % pertes post-récolte).',
        'Quiz interactif « Crop Resilience Quiz » pour certifier les réflexes des gérants de coopératives agricoles par zone climatique.',
      ],
      bulletsEn: [
        'Native 9-language support (French, English, Swahili, Spanish, Arabic RTL, Chinese, Portuguese, Hindi, Russian) with instant FR/EN toggle.',
        'Offline PWA caching + printable A4 cooperative PDF field briefs with PICS hermetic bag (−98% weevil loss) & seed readiness checklists.',
        'Interactive “Crop Resilience Quiz” enabling cooperative managers to test and verify regional drought-cycle protocols.',
      ],
      metrics: [
        {
          labelFr: 'Langues Mondiales',
          labelEn: 'Supported Languages',
          value: '9 Langues',
          contextFr: 'FR · EN · SW · ES · AR · ZH · PT · HI · RU',
          contextEn: 'FR · EN · SW · ES · AR · ZH · PT · HI · RU',
        },
        {
          labelFr: 'Livrables Coopératives',
          labelEn: 'Cooperative Exports',
          value: 'PDF · DOCX · CSV',
          contextFr: 'Rapports hors ligne, notes ministérielles & tables',
          contextEn: 'Offline field briefs, policy briefs & spreadsheets',
        },
        {
          labelFr: 'Pertes Charançons PICS',
          labelEn: 'PICS Post-Harvest Cut',
          value: '−98 %',
          contextFr: 'Stockage tampon sans insecticide avant soudure',
          contextEn: 'Chemical-free buffer storage ahead of lean season',
        },
      ],
      speakerNoteFr:
        'Point fort pour l’OIF / Francophonie et les agences de terrain : la technologie IA de pointe ne reste pas enfermée à la capitale ; elle est traduite en cahiers PDF hors ligne et en quiz pratique pour les coopératives.',
      speakerNoteEn:
        'Key selling point for OIF/Francophonie and field NGOs: advanced AI never stays locked in capital cities; it ships as offline PWA caches, printable cooperative PDFs, and interactive training quizzes.',
      audienceTagsFr: 'OIF / Francophonie · AUF · Coopératives Agricoles · PAM / BNGRC',
      audienceTagsEn: 'OIF / Francophonie · AUF · Agricultural Cooperatives · WFP / BNGRC',
      visualKind: 'last-mile',
    },
    {
      id: 'roadmap-governance',
      slideNumber: '07',
      kickerFr: '07 · FEUILLE DE ROUTE DE DÉPLOIEMENT & GOUVERNANCE PARTENARIALE',
      kickerEn: '07 · DEPLOYMENT ROADMAP & INSTITUTIONAL GOVERNANCE',
      titleFr: 'Plan de passage à l’échelle en 3 phases (Madagascar → Blocs → Continent)',
      titleEn: '3-Phase Institutional Rollout Plan (Madagascar → Regional Blocs → Continent)',
      subtitleFr:
        'Une intégration progressive, auditable et co-gouvernée avec M&G Consulting dès les 30 premiers jours.',
      subtitleEn:
        'A phased, auditable, co-governed integration partnership ready for immediate launch within 30 days.',
      bulletsFr: [
        'Phase 1 (30–60 j · Madagascar) : Pilote FAO / MINAE / MEDD — seuils DGM/BNGRC, formation DRAE/CirAE & déploiement cahiers coopératives.',
        'Phase 2 (3–6 mois · COI / SADC / COMESA) : Connexion API aux mercuriales nationales et séries historiques pour recalibration XGBoost–LSTM régionale.',
        'Phase 3 (6–12 mois · Union Africaine & OIF) : Couverture souveraine des 54 pays UA, couplage assurance paramétrique ARC & observatoire francophone.',
      ],
      bulletsEn: [
        'Phase 1 (30–60d · Madagascar): FAO / MINAE / MEDD pilot — national DGM/BNGRC thresholds, DRAE training & cooperative PDF brief rollout.',
        'Phase 2 (3–6m · IOC / SADC / COMESA): API integration with national crop market price feeds and historical district calibration.',
        'Phase 3 (6–12m · African Union & OIF): 54-country AU sovereign deployment, ARC parametric insurance triggers & Francophone hub.',
      ],
      metrics: [
        {
          labelFr: 'Phase 1 · Pilote National',
          labelEn: 'Phase 1 · National Pilot',
          value: '30–60 j',
          contextFr: 'FAO Madagascar · MINAE · MEDD · 23 régions',
          contextEn: 'FAO Madagascar · MINAE · MEDD · 23 regions',
        },
        {
          labelFr: 'Phase 2 · Blocs Régionaux',
          labelEn: 'Phase 2 · Regional Blocs',
          value: '3–6 mois',
          contextFr: 'COI · SADC · COMESA · APIs nationales',
          contextEn: 'IOC · SADC · COMESA · National data APIs',
        },
        {
          labelFr: 'Phase 3 · Continent & OIF',
          labelEn: 'Phase 3 · AU & OIF Scale',
          value: '6–12 mois',
          contextFr: '54 États UA · ARC · Réseau Francophonie',
          contextEn: '54 AU states · ARC insurance · OIF network',
        },
      ],
      speakerNoteFr:
        'Conclure en invitant les partenaires à tester immédiatement l’observatoire en direct ou à télécharger le dossier PDF exécutif à l’issue de la présentation.',
      speakerNoteEn:
        'Close by inviting institutional leaders to inspect any district or member state live on the platform and download the executive briefing PDF.',
      audienceTagsFr: 'M&G Consulting · FAO · Union Africaine · COI · SADC · COMESA · OIF',
      audienceTagsEn: 'M&G Consulting · FAO · African Union · IOC · SADC · COMESA · OIF',
      visualKind: 'roadmap',
    },
  ];

  return {
    slides,
    provinceLossChart,
    blocComparisonChart,
    oniObservedC,
    madagascarS2MUsd: Number(s2.madagascar.totalLossMUsd.toFixed(1)),
    madagascarS3MUsd: Number(s3.madagascar.totalLossMUsd.toFixed(1)),
  };
}

export function exportExecutivePitchDeckPdf(params: {
  data: ExecutivePitchDeckData;
  lang: 'fr' | 'en';
}): string {
  const { data, lang } = params;
  const isFr = lang === 'fr';
  const lic = LICENSE_ATTRIBUTION[lang] ?? LICENSE_ATTRIBUTION.fr;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;

  data.slides.forEach((slide, idx) => {
    if (idx > 0) doc.addPage('a4', 'landscape');

    // Deep Lapis Institutional Slide Top Band
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageW, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(isFr ? slide.kickerFr : slide.kickerEn, margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      `${lic.platformName} · ${lic.licenseHolder} (DG ${lic.directorName})`,
      margin,
      18,
    );
    doc.text(
      `${slide.slideNumber} / 0${data.slides.length}`,
      pageW - margin,
      14,
      { align: 'right' },
    );

    // Slide Title & Subtitle
    let y = 35;
    doc.setTextColor(24, 24, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    const titleLines = doc.splitTextToSize(isFr ? slide.titleFr : slide.titleEn, contentW);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 7 + 2;

    doc.setTextColor(82, 82, 91);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    const subLines = doc.splitTextToSize(isFr ? slide.subtitleFr : slide.subtitleEn, contentW);
    doc.text(subLines, margin, y);
    y += subLines.length * 5.2 + 6;

    // 3 Key Metric Cards
    const gap = 4;
    const cardW = (contentW - gap * 2) / 3;
    slide.metrics.forEach((m, mIdx) => {
      const cx = margin + mIdx * (cardW + gap);
      doc.setFillColor(249, 248, 244);
      doc.setDrawColor(212, 212, 216);
      doc.roundedRect(cx, y, cardW, 26, 1.8, 1.8, 'FD');

      doc.setTextColor(113, 113, 122);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text((isFr ? m.labelFr : m.labelEn).toUpperCase(), cx + 4, y + 6.5);

      doc.setTextColor(30, 58, 138);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(m.value, cx + 4, y + 15.5);

      doc.setTextColor(63, 63, 70);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text((isFr ? m.contextFr : m.contextEn).slice(0, 48), cx + 4, y + 22);
    });

    y += 33;

    // Strategic Bullets
    const bullets = isFr ? slide.bulletsFr : slide.bulletsEn;
    doc.setTextColor(24, 24, 27);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    bullets.forEach((b) => {
      const wrapped = doc.splitTextToSize(`•  ${b}`, contentW - 4);
      doc.text(wrapped, margin + 2, y);
      y += wrapped.length * 5.2 + 2.5;
    });

    // Optional compact data table on Slide 3 or Slide 4 for executive backing
    if (slide.visualKind === 'mlops-provinces' && y < pageH - 42) {
      autoTable(doc, {
        startY: y + 1,
        margin: { left: margin, right: margin },
        styles: { fontSize: 7.5, cellPadding: 1.5 },
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        head: [[isFr ? 'Province' : 'Province', 'S2 Base (M USD)', 'S3 Extreme (M USD)']],
        body: data.provinceLossChart.map((r) => [r.name, `${r.primary} M$`, `${r.secondary} M$`]),
      });
    } else if (slide.visualKind === 'zonal-blocs' && y < pageH - 42) {
      autoTable(doc, {
        startY: y + 1,
        margin: { left: margin, right: margin },
        styles: { fontSize: 7.5, cellPadding: 1.5 },
        headStyles: { fillColor: [20, 83, 45], textColor: 255 },
        head: [[isFr ? 'Bloc' : 'Bloc', 'ENSO Intensity', 'Agri Risk', 'Eco Resilience']],
        body: data.blocComparisonChart.map((r) => [
          r.code,
          `${r.intensity}/100`,
          `${r.agriRisk}/100`,
          `${r.resilience}/100`,
        ]),
      });
    }

    // Footer Audience + Speaker Note indicator
    doc.setDrawColor(228, 228, 231);
    doc.line(margin, pageH - 14, pageW - margin, pageH - 14);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text(
      `${isFr ? 'Audience cible' : 'Target audience'}: ${isFr ? slide.audienceTagsFr : slide.audienceTagsEn}`,
      margin,
      pageH - 8,
    );
    doc.text(
      `${lic.licenseHolder} · DG ${lic.directorName}`,
      pageW - margin,
      pageH - 8,
      { align: 'right' },
    );
  });

  const filename = `Ministerial_Pitch_Observatoire_ENSO_${lang}.pdf`;
  doc.save(filename);
  emitPdfDownloadSuccess({
    filename,
    kind: 'scientific',
    pagesCount: data.slides.length,
    horizonYear: 2027,
    scenario: 's2',
  });
  return filename;
}
