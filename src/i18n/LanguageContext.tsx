import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { UI_TRANSLATIONS, type UiTranslations } from './uiTranslations';

export type LanguageCode = 'fr' | 'en' | 'sw';
export type WorldLanguageCode = 'fr' | 'en' | 'sw' | 'es' | 'ar' | 'zh' | 'pt' | 'hi' | 'ru';

export interface WorldLanguageOption {
  code: WorldLanguageCode;
  shortLabel: string;
  nativeName: string;
  speakersInfo: string;
}

export const WORLD_LANGUAGE_OPTIONS: WorldLanguageOption[] = [
  { code: 'fr', shortLabel: 'FR', nativeName: 'Français', speakersInfo: '29 pays · >300M (ONU)' },
  { code: 'en', shortLabel: 'EN', nativeName: 'English', speakersInfo: '~58 pays · ~1,5Md (ONU)' },
  { code: 'es', shortLabel: 'ES', nativeName: 'Español', speakersInfo: '20 pays · ~550M (ONU)' },
  { code: 'ar', shortLabel: 'AR', nativeName: 'العربية', speakersInfo: '25–27 pays · ~380M (ONU)' },
  { code: 'zh', shortLabel: 'ZH', nativeName: '中文', speakersInfo: 'Chine/SG · >1,1Md (ONU)' },
  { code: 'hi', shortLabel: 'HI', nativeName: 'हिन्दी', speakersInfo: 'Inde/Fidji · >600M' },
  { code: 'pt', shortLabel: 'PT', nativeName: 'Português', speakersInfo: '9 pays · ~260M' },
  { code: 'ru', shortLabel: 'RU', nativeName: 'Русский', speakersInfo: 'Eurasie · ~255M (ONU)' },
  { code: 'sw', shortLabel: 'SW', nativeName: 'Kiswahili', speakersInfo: 'Afrique Est · ~200M' },
];

export function toCoreLanguage(code: WorldLanguageCode): LanguageCode {
  if (code === 'fr' || code === 'sw') return code;
  return 'en';
}

export interface TranslationsBundle {
  brandName: string;
  brandSubtitle: string;
  nav: {
    mechanism: string;
    indianOcean: string;
    africa: string;
    worldObservatory: string;
    mlModel: string;
    atlas: string;
    nationalPlan: string;
    economicLoss: string;
    geminiHub: string;
    cooperatives: string;
    ctaAdvisor: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    aiCta: string;
    tones: {
      amber: string;
      crimson: string;
      cobalt: string;
      neutral: string;
    };
  };
  sections: {
    s01Eyebrow: string;
    s01Title: string;
    s01Lead: string;
    s02Eyebrow: string;
    s02Title: string;
    s02Lead: string;
    s03Eyebrow: string;
    s03Title: string;
    s03Lead: string;
    s04Eyebrow: string;
    s04Title: string;
    s04Lead: string;
    s05Eyebrow: string;
    s05Title: string;
    s05Lead: string;
    s06Eyebrow: string;
    s06Title: string;
    s06Lead: string;
    s07Eyebrow: string;
    s07Title: string;
    s07Lead: string;
    s08Eyebrow: string;
    s08Title: string;
    s08Lead: string;
    s09Eyebrow: string;
    s09Title: string;
    s09Lead: string;
    s10Eyebrow: string;
    s10Title: string;
    s10Lead: string;
    s11Eyebrow: string;
    s11Title: string;
    s11Lead: string;
  };
  economic: {
    disclaimerTitle: string;
    horizonLabel: string;
    year2027Btn: string;
    year2028Btn: string;
    scenarioLabel: string;
    scopeLabel: string;
    scope119: string;
    scope42: string;
    currencyLabel: string;
    exportCsv: string;
    kpiMadagascarTotal: string;
    kpiDirectVsIndirect: string;
    kpiCoi: string;
    kpiAfrica: string;
    tabProvinces: string;
    tabRegions: string;
    tabDistricts: string;
    tabContinental: string;
  };
  assistant: {
    tabChat: string;
    tabSearch: string;
    tabMaps: string;
    tabLive: string;
    openIndriVoiceBtn: string;
    roleLabel: string;
    roles: {
      agronome: { label: string; desc: string };
      economiste: { label: string; desc: string };
      humanitaire: { label: string; desc: string };
    };
    groundingModeLabel: string;
    groundingModes: {
      none: string;
      googleSearch: string;
      googleMaps: string;
    };
    speedLabel: string;
    speedStandard: string;
    speedFast: string;
    anchorLocationLabel: string;
    useMyGps: string;
    gpsActive: string;
    gpsError: string;
    resetChat: string;
    inputPlaceholderChat: string;
    inputPlaceholderSearch: string;
    inputPlaceholderMaps: string;
    sendBtn: string;
    searchingBtn: string;
    loadingText: string;
    webSourcesTitle: string;
    mapPlacesTitle: string;
    mapReviewsTitle: string;
    openInMaps: string;
    floatingLabel: string;
    drawerTitle: string;
    drawerSubtitle: string;
    chatStarters: string[];
    searchPresets: string[];
    mapsPresets: string[];
  };
  footer: {
    sourcesTitle: string;
    sourcesSubtitle: string;
    copyright: string;
  };
}

const DICTIONARIES: Record<WorldLanguageCode, TranslationsBundle> = {
  fr: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'Observatoire Climatique, Économique & Résilience Agricole',
    nav: {
      mechanism: 'Mécanisme',
      indianOcean: 'Océan Indien',
      africa: 'Afrique',
      worldObservatory: 'Monde (195)',
      mlModel: 'Modèle ML',
      atlas: 'Atlas 23',
      nationalPlan: 'Plan National',
      economicLoss: 'Pertes Éco',
      geminiHub: 'Gemini AI',
      cooperatives: 'Coopératives',
      ctaAdvisor: 'Guide Coopérative',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · Dossier climatique & agricole · Novembre 2026 · OMM / FAO / SWIOCOF-15',
      title: 'Super El Niño 2026–2027 : impact océanique, crise alimentaire et adaptation agricole',
      lead: 'Fin 2026, un épisode El Niño d’une puissance historique s’installe dans le Pacifique équatorial et se couple à un dipôle positif de l’océan Indien (IOD+). Entre sécheresse aiguë dans le Grand Sud malgache et en Afrique australe, pluies diluviennes en Afrique de l’Est et flambée des céréales, l’Observatoire rassemble prévisions ML, évaluation économique et intelligence Gemini connectée au Web et à Google Maps.',
      primaryCta: 'Calendriers FOFIFA 2026–2027',
      secondaryCta: 'Simuler mon district',
      aiCta: 'Ouvrir Gemini AI',
      tones: {
        amber: 'Alerte thermique',
        crimson: 'Seuil critique',
        cobalt: 'Tension marché',
        neutral: 'Observation',
      },
    },
    sections: {
      s01Eyebrow: '01 · Cycle ENSO & Dynamique Océan-Atmosphère',
      s01Title: 'Mécanisme physique du super El Niño 2026–2027',
      s01Lead: 'Affaiblissement des alizés, bascule des eaux chaudes vers l’Est et couplage IOD+ sur le bassin indo-pacifique.',
      s02Eyebrow: '02 · Madagascar & Sud-Ouest de l’océan Indien (SWIOCOF-15)',
      s02Title: 'Asymétrie pluviométrique à Madagascar et vulnérabilité insulaire',
      s02Lead: 'Déficit hydrique sévère dans le Grand Sud contre excès pluvieux et risques cycloniques sur la côte Nord-Est.',
      s03Eyebrow: '03 · Afrique, Blocs Économiques & Marchés Mondiaux',
      s03Title: 'Répercussions sur l’Afrique, la SADC, le COMESA et les prix agricoles',
      s03Lead: 'Contraste entre sécheresse australe, crues en Afrique de l’Est et tensions sur les cours mondiaux.',
      s04Eyebrow: '04 · Machine Learning (Random Forest, LSTM & XGBoost) · Trajectoires 2027–2028',
      s04Title: 'Modélisation spatiale par district, carte Google Maps et diagnostic QLoRA / RAG',
      s04Lead: 'Désagrégation sur les districts malgaches, validation croisée temporelle et synthèse agronomique assistée par Gemini.',
      s05Eyebrow: '05 · Adaptation Agricole & Calendriers FOFIFA / DGM (26 octobre 2026)',
      s05Title: 'Calendriers culturaux résilients et techniques agroécologiques',
      s05Lead: 'Fenêtres de semis adaptées par zone agro-écologique, variétés à cycle court, Zaï, SCV et SRI.',
      s06Eyebrow: '06 · Atlas National El Niño Madagascar 2027–2028 (23 Régions officielles & 119 Districts)',
      s06Title: 'Atlas territorial complet par région et district',
      s06Lead: 'Couverture nationale des risques climatiques, filières exposées et mesures prioritaires.',
      s07Eyebrow: '07 · Document de Cadrage Stratégique (v1.0 · 14 nov. 2026) · Madagascar Climate Resilience Plan',
      s07Title: 'Plan National de Préparation et de Résilience Climatique 2027–2028',
      s07Lead: 'Architecture opérationnelle nationale : scoring 5D, budgétisation MGA/USD/EUR, gouvernance 13 acteurs et coordination ONG.',
      s08Eyebrow: '08 · Évaluation Économique Multi-Échelles · District → Région → Ex-Province → Afrique',
      s08Title: 'Évaluation des pertes économiques : Madagascar, Océan Indien, COMESA, SADC et Afrique',
      s08Lead: 'Agrégation ascendante des chocs ML par district vers les 23 régions, 6 ex-provinces et les blocs africains.',
      s09Eyebrow: '09 · Intelligence Gemini Connectée · Chatbot, Search, Maps & Voix Live Indri indri',
      s09Title: 'Centre d’intelligence Gemini : chat, recherche Web, Maps & voix live Indri indri',
      s09Lead: 'Interrogez l’Observatoire en français, anglais ou kiswahili par écrit, avec Google Search et Google Maps, ou parlez en direct avec l’avatar graphique animé Indri indri (Babakoto) propulsé par Gemini 3.8 Live.',
      s10Eyebrow: '10 · Guichets Coopératives & Préparation Dossier FDA',
      s10Title: 'Simulateur de fiche coopérative et annuaire d’appui à Madagascar',
      s10Lead: 'Sélectionnez votre zone et votre filière pour obtenir la fenêtre FOFIFA, les pratiques adaptées et les guichets FDA/DEFIS/FAO.',
      s11Eyebrow: '11 · Duplication Mondiale · 195 Pays ONU, Continents, Zones, Langues & Horizon 2028–2032',
      s11Title: 'Observatoire Mondial El Niño : 195 pays, continents, langues et projections 2028–2032',
      s11Lead: 'Duplication complète par pays (195 États ONU), continent (modèles à 5, 6 et 7 continents), zone climatique, langues mondiales les plus parlées et anticipations multi-annuelles 2028, 2029, 2030, 2031 et 2032.',
    },
    economic: {
      disclaimerTitle: 'Séparation stricte Observé vs Modélisé :',
      horizonLabel: 'Horizon d’analyse',
      year2027Btn: '2027 · Choc El Niño',
      year2028Btn: '2028 · Soudure / Crues',
      scenarioLabel: 'Scénario climatique & hydrologique',
      scopeLabel: 'Périmètre Madagascar',
      scope119: 'Consolidé 119 dist.',
      scope42: '42 districts pilotes',
      currencyLabel: 'Devise',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'Pertes totales Madagascar',
      kpiDirectVsIndirect: 'Direct agricole vs Indirect (Madagascar)',
      kpiCoi: 'Océan Indien (COI · 5 territoires)',
      kpiAfrica: 'Projection Afrique (SADC, COMESA & blocs)',
      tabProvinces: '1. 6 Ex-Provinces (Madagascar)',
      tabRegions: '2. 23 Régions officielles',
      tabDistricts: '3. 42 Districts modélisés (sur 119)',
      tabContinental: '4. Océan Indien, COMESA, SADC & Afrique',
    },
    assistant: {
      tabChat: 'Chatbot Multi-Tours (Gemini)',
      tabSearch: 'Veille Web Live (Google Search)',
      tabMaps: 'Lieux & Logistique (Google Maps)',
      tabLive: 'Voix Live · Indri indri',
      openIndriVoiceBtn: 'Parler à Indri indri (Voix Live)',
      roleLabel: 'Rôle expert (System Instruction)',
      roles: {
        agronome: {
          label: 'Agronome FOFIFA & Coopératives',
          desc: 'Semis, Zaï, SCV, SRI, filières riz/vanille/maïs, dossiers FDA-R.',
        },
        economiste: {
          label: 'Économiste ENSO & Macro-Afrique',
          desc: 'Pertes district/région/province, COI, SADC, COMESA, prix et RIA.',
        },
        humanitaire: {
          label: 'Coordinateur BNGRC / PAM / FEWS NET',
          desc: 'Alertes précoces, kéré, soudure, ciblage Cash+, HIMO et cyclones.',
        },
      },
      groundingModeLabel: 'Ancrage de données (Grounding)',
      groundingModes: {
        none: 'Direct (Base Observatoire)',
        googleSearch: 'Google Search (Web)',
        googleMaps: 'Google Maps (Lieux)',
      },
      speedLabel: 'Modèle Gemini',
      speedStandard: 'gemini-4-hydrogen (Complet & Outils)',
      speedFast: 'gemini-3.1-flash-lite (Rapide)',
      anchorLocationLabel: 'Zone géographique d’ancrage (Google Maps)',
      useMyGps: 'Ma position GPS',
      gpsActive: 'Position GPS active',
      gpsError: 'Géolocalisation indisponible — ancrage sur le district sélectionné.',
      resetChat: 'Nouvelle conversation',
      inputPlaceholderChat: 'Posez une question de suivi sur un district, une culture, la SADC ou le budget...',
      inputPlaceholderSearch: 'Rechercher une actualité climatique, bulletin OMM, prix FAO ou alerte FEWS NET...',
      inputPlaceholderMaps: 'Ex. : marchés agricoles, greniers, bureaux DRAE, barrages ou dépôts PAM à proximité...',
      sendBtn: 'Envoyer',
      searchingBtn: 'Analyser',
      loadingText: 'Interrogation de Gemini en cours...',
      webSourcesTitle: 'Sources Web vérifiées (Google Search Grounding)',
      mapPlacesTitle: 'Lieux & liens Google Maps vérifiés',
      mapReviewsTitle: 'Extraits et avis terrain',
      openInMaps: 'Ouvrir dans Google Maps',
      floatingLabel: 'Gemini AI · Chat',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'Chatbot multi-tours · Search & Maps Grounding',
      chatStarters: [
        'Quelles mesures d’urgence appliquer à Ambovombe (Androy) avant la soudure 2027 ?',
        'Compare l’impact économique 2027 entre Madagascar, la Zambie (SADC) et le Kenya (COMESA).',
        'Comment monter un dossier FDA-R pour une coopérative rizicole à Ambatondrazaka ?',
      ],
      searchPresets: [
        'Derniers bulletins NOAA / OMM sur l’indice ONI El Niño 2026–2027 et l’océan Indien',
        'Situation sécurité alimentaire Grand Sud Madagascar FEWS NET PAM FAO 2026 2027',
        'Impact sécheresse El Niño sur le maïs et l’hydroélectricité en SADC (Zambie, Zimbabwe, Malawi)',
        'Cours mondiaux du riz, maïs, cacao et vanille de Madagascar fin 2026',
      ],
      mapsPresets: [
        'Marchés agricoles principaux, coopératives et points de stockage céréalier',
        'Directions régionales de l’agriculture (DRAE / MINAE), instituts FOFIFA et centres d’appui',
        'Infrastructures hydrauliques, barrages hydroélectriques et périmètres irrigués',
        'Ports, gares logistiques et centres opérationnels BNGRC / PAM pour acheminement vivrier',
      ],
    },
    footer: {
      sourcesTitle: 'Sources scientifiques et institutionnelles',
      sourcesSubtitle: 'Synthèse établie d’après les bulletins et publications 2026–2027 des agences météorologiques, onusiennes et de recherche agronomique.',
      copyright: 'Madagascar El Niño Observatory · Dossier climatique, économique & résilience agricole 2026–2028',
    },
  },

  en: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'Climate, Economic & Agricultural Resilience Observatory',
    nav: {
      mechanism: 'Mechanism',
      indianOcean: 'Indian Ocean',
      africa: 'Africa',
      worldObservatory: 'World (195)',
      mlModel: 'ML Model',
      atlas: 'Atlas 23',
      nationalPlan: 'National Plan',
      economicLoss: 'Econ. Loss',
      geminiHub: 'Gemini AI',
      cooperatives: 'Cooperatives',
      ctaAdvisor: 'Co-op Guide',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · Climate & Agriculture Dossier · November 2026 · WMO / FAO / SWIOCOF-15',
      title: 'Super El Niño 2026–2027: ocean anomalies, food crisis & agricultural adaptation',
      lead: 'In late 2026, a major El Niño event develops across the equatorial Pacific alongside a positive Indian Ocean Dipole (IOD+). Facing severe drought in southern Madagascar and Southern Africa, flooding across East Africa, and cereal price spikes, the Observatory unites ML district forecasts, multi-scale loss modeling, and live Gemini intelligence grounded in Google Search and Google Maps.',
      primaryCta: 'FOFIFA Calendars 2026–2027',
      secondaryCta: 'Simulate my district',
      aiCta: 'Launch Gemini AI',
      tones: {
        amber: 'Thermal alert',
        crimson: 'Critical threshold',
        cobalt: 'Market stress',
        neutral: 'Observed',
      },
    },
    sections: {
      s01Eyebrow: '01 · ENSO Cycle & Ocean-Atmosphere Dynamics',
      s01Title: 'Physical mechanics of the 2026–2027 Super El Niño',
      s01Lead: 'Trade-wind weakening, eastward warm-water displacement, and Indo-Pacific IOD+ teleconnections.',
      s02Eyebrow: '02 · Madagascar & Southwest Indian Ocean (SWIOCOF-15)',
      s02Title: 'Rainfall asymmetry in Madagascar and island vulnerability',
      s02Lead: 'Acute water deficit across the Grand Sud versus heavy rains and cyclone exposure in the North-East.',
      s03Eyebrow: '03 · Africa, Regional Blocs & Global Markets',
      s03Title: 'Spillovers across Africa, SADC, COMESA and agricultural commodities',
      s03Lead: 'Divergence between Southern African drought, East African floods, and global staple inflation.',
      s04Eyebrow: '04 · Machine Learning (Random Forest, LSTM & XGBoost) · 2027–2028 Trajectories',
      s04Title: 'District-level spatial modeling, Google Maps & QLoRA / RAG diagnostics',
      s04Lead: 'District disaggregation across Madagascar, temporal cross-validation, and Gemini agronomic briefings.',
      s05Eyebrow: '05 · Agricultural Adaptation & FOFIFA / DGM Calendars (Oct 26, 2026)',
      s05Title: 'Resilient planting windows and agroecological practices',
      s05Lead: 'Zone-specific sowing dates, short-cycle sorghum/millet, Zaï pits, conservation agriculture (SCV) and SRI.',
      s06Eyebrow: '06 · Madagascar National El Niño Atlas 2027–2028 (23 Regions & 119 Districts)',
      s06Title: 'Full territorial atlas by region and district',
      s06Lead: 'Nationwide risk profiles, exposed value chains, and priority resilience interventions.',
      s07Eyebrow: '07 · Strategic Framework (v1.0 · Nov 14, 2026) · Madagascar Climate Resilience Plan',
      s07Title: 'National Climate Preparedness & Resilience Plan 2027–2028',
      s07Lead: 'Operational architecture: 5D district risk scoring, MGA/USD/EUR budgeting, 13-actor governance, and NGO registry.',
      s08Eyebrow: '08 · Multi-Scale Economic Loss Evaluation · District → Region → Province → Africa',
      s08Title: 'Economic loss assessment: Madagascar, Indian Ocean, COMESA, SADC & Africa',
      s08Lead: 'Bottom-up aggregation from district ML crop shocks to 23 regions, 6 ex-provinces, and continental blocs.',
      s09Eyebrow: '09 · Grounded Gemini Intelligence · Chat, Search, Maps & Indri indri Live Voice',
      s09Title: 'Gemini Intelligence Hub: chat, Web Search, Maps & Indri indri live voice',
      s09Lead: 'Query the Observatory in English, French, or Kiswahili via multi-turn text, Google Search and Google Maps grounding, or speak in real time with the animated Madagascar Indri indri (Babakoto) avatar powered by Gemini 3.8 Live.',
      s10Eyebrow: '10 · Cooperative Funding Desks & FDA Preparation',
      s10Title: 'Cooperative brief simulator and Madagascar support directory',
      s10Lead: 'Select your agro-ecological zone and crop to get FOFIFA sowing windows and FDA/DEFIS/FAO financing desks.',
      s11Eyebrow: '11 · Global Duplication · 195 UN Countries, Continents, Zones, Languages & 2028–2032 Outlook',
      s11Title: 'Global El Niño Observatory: 195 Countries, Continents, Languages & 2028–2032 Forecasts',
      s11Lead: 'Full duplication across 195 UN countries, 5/6/7-continent models, 12 global climate zones, most spoken world languages, and multi-year 2028, 2029, 2030, 2031, and 2032 forecasts.',
    },
    economic: {
      disclaimerTitle: 'Strict separation Observed vs Modeled:',
      horizonLabel: 'Analysis horizon',
      year2027Btn: '2027 · El Niño Shock',
      year2028Btn: '2028 · Lean Season / Floods',
      scenarioLabel: 'Climate & hydrological scenario',
      scopeLabel: 'Madagascar scope',
      scope119: '119 Districts (Full)',
      scope42: '42 Pilot Districts',
      currencyLabel: 'Currency',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'Madagascar Total Losses',
      kpiDirectVsIndirect: 'Direct Agri vs Indirect (Madagascar)',
      kpiCoi: 'Indian Ocean (IOC · 5 territories)',
      kpiAfrica: 'Africa Projection (SADC, COMESA & blocs)',
      tabProvinces: '1. 6 Ex-Provinces (Madagascar)',
      tabRegions: '2. 23 Official Regions',
      tabDistricts: '3. 42 Modeled Districts (of 119)',
      tabContinental: '4. Indian Ocean, COMESA, SADC & Africa',
    },
    assistant: {
      tabChat: 'Multi-Turn Chatbot (Gemini)',
      tabSearch: 'Live Web Watch (Google Search)',
      tabMaps: 'Places & Logistics (Google Maps)',
      tabLive: 'Live Voice · Indri indri',
      openIndriVoiceBtn: 'Talk to Indri indri (Live Voice)',
      roleLabel: 'Expert Persona (System Instruction)',
      roles: {
        agronome: {
          label: 'FOFIFA Agronomist & Cooperatives',
          desc: 'Sowing calendars, Zaï, SCV, SRI, rice/vanilla/maize, FDA-R grants.',
        },
        economiste: {
          label: 'ENSO & Africa Macroeconomist',
          desc: 'District/regional losses, IOC, SADC, COMESA, rice prices & hydropower.',
        },
        humanitaire: {
          label: 'BNGRC / WFP / FEWS NET Coordinator',
          desc: 'Early warning, kéré famine risk, Cash+ targeting, HIMO & cyclones.',
        },
      },
      groundingModeLabel: 'Grounding Tool Mode',
      groundingModes: {
        none: 'Direct (Observatory Context)',
        googleSearch: 'Google Search (Live Web)',
        googleMaps: 'Google Maps (Geospatial)',
      },
      speedLabel: 'Gemini Model',
      speedStandard: 'gemini-4-hydrogen (Full & Tools)',
      speedFast: 'gemini-3.1-flash-lite (Fast)',
      anchorLocationLabel: 'Google Maps Anchor Location',
      useMyGps: 'Use my GPS',
      gpsActive: 'GPS coordinates active',
      gpsError: 'Geolocation unavailable — anchored to selected district.',
      resetChat: 'New conversation',
      inputPlaceholderChat: 'Ask a follow-up question on a district, crop, SADC/COMESA loss or adaptation plan...',
      inputPlaceholderSearch: 'Search live WMO/NOAA ONI bulletins, FEWS NET alerts, or FAO food prices...',
      inputPlaceholderMaps: 'E.g.: agricultural markets, grain silos, DRAE offices, dams or WFP depots nearby...',
      sendBtn: 'Send',
      searchingBtn: 'Analyze',
      loadingText: 'Querying Gemini...',
      webSourcesTitle: 'Verified Web Sources (Google Search Grounding)',
      mapPlacesTitle: 'Verified Google Maps Places & Links',
      mapReviewsTitle: 'Field Snippets & Reviews',
      openInMaps: 'Open in Google Maps',
      floatingLabel: 'Gemini AI · Chat',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'Multi-turn Chatbot · Search & Maps Grounding',
      chatStarters: [
        'What emergency agronomic actions are needed in Ambovombe (Androy) before the 2027 lean season?',
        'Compare 2027 economic losses across Madagascar, Zambia (SADC), and Kenya (COMESA).',
        'How can a rice cooperative in Ambatondrazaka prepare a resilience grant dossier?',
      ],
      searchPresets: [
        'Latest WMO / NOAA ONI El Niño 2026–2027 forecast and Indian Ocean Dipole IOD status',
        'Madagascar Grand Sud food security situation FEWS NET WFP FAO 2026 2027',
        'El Niño drought impact on maize and Kariba hydropower in SADC (Zambia, Zimbabwe, Malawi)',
        'Global rice, maize, cocoa and Madagascar vanilla market prices late 2026',
      ],
      mapsPresets: [
        'Major agricultural markets, rural cooperatives, and grain storage silos',
        'Regional agricultural offices (DRAE / MINAE), FOFIFA stations and extension hubs',
        'Water reservoirs, hydroelectric dams, and main irrigation perimeters',
        'Ports, logistics corridors, and BNGRC / WFP humanitarian supply depots',
      ],
    },
    footer: {
      sourcesTitle: 'Scientific and Institutional Sources',
      sourcesSubtitle: 'Compiled from 2026–2027 bulletins and publications by meteorological agencies, UN bodies, and agricultural research institutes.',
      copyright: 'Madagascar El Niño Observatory · Climate, Economic & Agricultural Resilience Dossier 2026–2028',
    },
  },

  sw: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'Kituo cha Uchunguzi wa Tabianchi, Uchumi na Ustahimilivu wa Kilimo',
    nav: {
      mechanism: 'Mbinu',
      indianOcean: 'Bahari ya Hindi',
      africa: 'Afrika',
      worldObservatory: 'Dunia (195)',
      mlModel: 'Muundo wa ML',
      atlas: 'Atlasi 23',
      nationalPlan: 'Mpango wa Taifa',
      economicLoss: 'Hasara Kiuchumi',
      geminiHub: 'Gemini AI',
      cooperatives: 'Ushirika',
      ctaAdvisor: 'Mwongozo Ushirika',
      openMenu: 'Fungua menyu',
      closeMenu: 'Funga menyu',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · Ripoti ya Tabianchi na Kilimo · Novemba 2026 · WMO / FAO / SWIOCOF-15',
      title: 'El Niño Kuu 2026–2027: athari za bahari, uhaba wa chakula na mabadiliko ya kilimo',
      lead: 'Mwishoni mwa 2026, tukio kubwa la El Niño linatokea katika Bahari ya Pasifiki likiambatana na hali chanya ya Bahari ya Hindi (IOD+). Kati ya ukame mkali Kusini mwa Madagaska na Kusini mwa Afrika, mafuriko Afrika Mashariki, na kupanda kwa bei za nafaka, jukwaa hili linaunganisha utabiri wa ML, tathmini ya hasara za kiuchumi na akili ya Gemini iliyounganishwa na Google Search na Google Maps.',
      primaryCta: 'Kalenda za FOFIFA 2026–2027',
      secondaryCta: 'Chunguza wilaya yangu',
      aiCta: 'Fungua Gemini AI',
      tones: {
        amber: 'Tahadhari ya joto',
        crimson: 'Kiwango hatari',
        cobalt: 'Shinikizo la soko',
        neutral: 'Uchunguzi',
      },
    },
    sections: {
      s01Eyebrow: '01 · Mzunguko wa ENSO na Nguvu za Bahari na Anga',
      s01Title: 'Mfumo wa kifizikia wa El Niño Kuu 2026–2027',
      s01Lead: 'Kudhoofika kwa pepo za biashara, kuhama kwa maji ya joto mashariki na uhusiano na IOD+ katika Bahari ya Hindi.',
      s02Eyebrow: '02 · Madagaska na Kusini-Magharibi mwa Bahari ya Hindi (SWIOCOF-15)',
      s02Title: 'Tofauti kubwa ya mvua nchini Madagaska na mazingira ya visiwa',
      s02Lead: 'Ukame mkali katika Kusini Kuu dhidi ya mvua nyingi na hatari ya vimbunga katika pwani ya Kaskazini-Mashariki.',
      s03Eyebrow: '03 · Afrika, Jumuiya za Kikanda na Masoko ya Dunia',
      s03Title: 'Athari kwa Afrika, SADC, COMESA na bei za mazao ya kilimo',
      s03Lead: 'Tofauti kati ya ukame wa Kusini mwa Afrika, mafuriko Afrika Mashariki na mfumuko wa bei za chakula.',
      s04Eyebrow: '04 · Akili Bandia ya ML (Random Forest, LSTM & XGBoost) · Mwelekeo 2027–2028',
      s04Title: 'Utabiri wa kila wilaya, ramani ya Google Maps na uchambuzi wa QLoRA / RAG',
      s04Lead: 'Uchambuzi wa wilaya 42 za Madagaska, uthibitishaji wa kihistoria na ushauri wa kilimo kupitia Gemini.',
      s05Eyebrow: '05 · Mabadiliko ya Kilimo na Kalenda za FOFIFA / DGM (26 Oktoba 2026)',
      s05Title: 'Kalenda za upanzi zinazostahimili ukame na mbinu za ikolojia',
      s05Lead: 'Nyakati za kupanda kwa kila ukanda, mtama/uwele wa muda mfupi, mashimo ya Zaï, SCV na kilimo cha mpunga SRI.',
      s06Eyebrow: '06 · Atlasi ya Taifa ya El Niño Madagaska 2027–2028 (Mikoa 23 na Wilaya 119)',
      s06Title: 'Atlasi kamili ya mikoa na wilaya za Madagaska',
      s06Lead: 'Ramani ya kitaifa ya hatari za tabianchi, mazao yaliyo hatarini na hatua za kipaumbele.',
      s07Eyebrow: '07 · Mpango Mkakati wa Taifa (v1.0 · 14 Nov 2026) · Ustahimilivu wa Tabianchi',
      s07Title: 'Mpango wa Taifa wa Maandalizi na Ustahimilivu wa Tabianchi 2027–2028',
      s07Lead: 'Mfumo wa utekelezaji: alama za hatari 5D, bajeti ya MGA/USD/EUR, uratibu wa taasisi 13 na sajili ya mashirika.',
      s08Eyebrow: '08 · Tathmini ya Hasara za Kiuchumi · Wilaya → Mkoa → Jimbo → Afrika',
      s08Title: 'Tathmini ya hasara za kiuchumi: Madagaska, Bahari ya Hindi, COMESA, SADC na Afrika',
      s08Lead: 'Ujumlishaji kutoka athari za kilimo za wilaya hadi mikoa 23, majimbo 6 ya kihistoria na jumuiya za Afrika.',
      s09Eyebrow: '09 · Akili ya Gemini · Mazungumzo, Search, Maps & Sauti Live ya Indri indri',
      s09Title: 'Kituo cha Akili cha Gemini: mazungumzo, Google Search, Maps na sauti live ya Indri indri',
      s09Lead: 'Uliza maswali kwa Kiswahili, Kifaransa au Kiingereza kupitia maandishi, Google Search na Google Maps, au zungumza moja kwa moja kwa sauti na kikaragosi cha Indri indri (Babakoto) wa Madagaska kupitia Gemini 3.8 Live.',
      s10Eyebrow: '10 · Madirisha ya Vyama vya Ushirika na Maandalizi ya Miradi ya FDA',
      s10Title: 'Kiigaji cha maelezo ya ushirika na orodha ya taasisi za msaada Madagaska',
      s10Lead: 'Chagua ukanda na zao lako kupata tarehe za kupanda za FOFIFA, mbinu bora na wafadhili (FDA, DEFIS, FAO, WFP).',
      s11Eyebrow: '11 · Uchambuzi wa Dunia · Nchi 195 za UN, Mabara, Kanda, Lugha & Mwelekeo 2028–2032',
      s11Title: 'Uchunguzi wa Dunia wa El Niño: Nchi 195, Mabara, Lugha na Utabiri wa 2028–2032',
      s11Lead: 'Nakala kamili kwa kila nchi (nchi 195 za UN), bara (mifumo 5/6/7), kanda ya tabianchi, lugha kuu duniani na makadirio ya 2028, 2029, 2030, 2031 na 2032.',
    },
    economic: {
      disclaimerTitle: 'Tofauti kati ya Takwimu Halisi na Makadirio:',
      horizonLabel: 'Mwaka wa uchambuzi',
      year2027Btn: '2027 · Mshtuko El Niño',
      year2028Btn: '2028 · Kipindi cha Mpito',
      scenarioLabel: 'Hali ya tabianchi na maji',
      scopeLabel: 'Upeo wa Madagaska',
      scope119: 'Wilaya 119 (Zote)',
      scope42: 'Wilaya 42 za Majaribio',
      currencyLabel: 'Sarafu',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'Jumla ya Hasara Madagaska',
      kpiDirectVsIndirect: 'Kilimo Moja kwa Moja vs Zisizo za Moja kwa Moja',
      kpiCoi: 'Bahari ya Hindi (COI · Maeneo 5)',
      kpiAfrica: 'Makadirio Afrika (SADC, COMESA & kanda)',
      tabProvinces: '1. Majimbo 6 (Madagaska)',
      tabRegions: '2. Mikoa 23 Rasmi',
      tabDistricts: '3. Wilaya 42 (kati ya 119)',
      tabContinental: '4. Bahari ya Hindi, COMESA, SADC & Afrika',
    },
    assistant: {
      tabChat: 'Mazungumzo ya Moja kwa Moja (Gemini)',
      tabSearch: 'Habari Mtandaoni (Google Search)',
      tabMaps: 'Maeneo na Usafirishaji (Google Maps)',
      tabLive: 'Sauti Live · Indri indri',
      openIndriVoiceBtn: 'Zungumza na Indri indri (Sauti Live)',
      roleLabel: 'Jukumu la Mtaalamu (System Instruction)',
      roles: {
        agronome: {
          label: 'Mtaalamu wa Kilimo FOFIFA & Ushirika',
          desc: 'Kalenda za upanzi, Zaï, SCV, SRI, mpunga/vanilla/mahindi na ruzuku ya FDA-R.',
        },
        economiste: {
          label: 'Mchumi wa ENSO na Afrika',
          desc: 'Hasara za wilaya/mikoa, COI, SADC, COMESA, bei za chakula na umeme wa maji.',
        },
        humanitaire: {
          label: 'Mratibu wa Maafa BNGRC / WFP / FEWS NET',
          desc: 'Tahadhari za mapema, uhaba wa chakula, misaada ya Cash+, HIMO na vimbunga.',
        },
      },
      groundingModeLabel: 'Chanzo cha Data (Grounding)',
      groundingModes: {
        none: 'Moja kwa moja (Data ya Kituo)',
        googleSearch: 'Google Search (Mtandao)',
        googleMaps: 'Google Maps (Ramani)',
      },
      speedLabel: 'Muundo wa Gemini',
      speedStandard: 'gemini-4-hydrogen (Kamili & Zana)',
      speedFast: 'gemini-3.1-flash-lite (Haraka)',
      anchorLocationLabel: 'Eneo la Rejea (Google Maps)',
      useMyGps: 'Tumia GPS yangu',
      gpsActive: 'GPS imewashwa',
      gpsError: 'GPS haipatikani — imeelekezwa kwenye wilaya iliyochaguliwa.',
      resetChat: 'Anza mazungumzo mapya',
      inputPlaceholderChat: 'Uliza swali kuhusu wilaya, zao, hasara za SADC/COMESA au mpango wa ustahimilivu...',
      inputPlaceholderSearch: 'Tafuta taarifa za hivi karibuni za WMO/NOAA, FEWS NET au bei za FAO...',
      inputPlaceholderMaps: 'Mfano: masoko ya kilimo, maghala ya nafaka, ofisi za kilimo, mabwawa au vituo vya WFP karibu...',
      sendBtn: 'Tuma',
      searchingBtn: 'Chambua',
      loadingText: 'Inauliza Gemini...',
      webSourcesTitle: 'Vyanzo vya Mtandao Vilivyothibitishwa (Google Search)',
      mapPlacesTitle: 'Maeneo na Viungo vya Google Maps',
      mapReviewsTitle: 'Maelezo na Maoni ya Eneo',
      openInMaps: 'Fungua katika Google Maps',
      floatingLabel: 'Gemini AI · Mazungumzo',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'Mazungumzo · Google Search & Maps Grounding',
      chatStarters: [
        'Ni hatua zipi za dharura zinahitajika Ambovombe (Androy) kabla ya kipindi cha uhaba 2027?',
        'Linganisha hasara za kiuchumi 2027 kati ya Madagaska, Zambia (SADC) na Kenya (COMESA).',
        'Chama cha wakulima wa mpunga Ambatondrazaka kinaweza kuandaaje mradi wa ufadhili wa FDA-R?',
      ],
      searchPresets: [
        'Taarifa za hivi karibuni za WMO / NOAA ONI kuhusu El Niño 2026–2027 na Bahari ya Hindi',
        'Hali ya usalama wa chakula Kusini mwa Madagaska FEWS NET WFP FAO 2026 2027',
        'Athari za ukame wa El Niño kwa mahindi na umeme wa Kariba katika SADC (Zambia, Zimbabwe, Malawi)',
        'Bei za soko la dunia za mchele, mahindi, kakao na vanilla ya Madagaska mwishoni mwa 2026',
      ],
      mapsPresets: [
        'Masoko makubwa ya kilimo, vyama vya ushirika na maghala ya nafaka',
        'Ofisi za kilimo za mikoa (DRAE / MINAE) na vituo vya utafiti wa FOFIFA',
        'Mabwawa ya umeme wa maji na mifumo ya umwagiliaji mashambani',
        'Bandari, barabara kuu za usafirishaji na vituo vya misaada vya BNGRC / WFP',
      ],
    },
    footer: {
      sourcesTitle: 'Vyanzo vya Kisayansi na Kitaasisi',
      sourcesSubtitle: 'Muhtasari uliokusanywa kutoka taarifa za 2026–2027 za mashirika ya hali ya hewa, Umoja wa Mataifa na taasisi za utafiti wa kilimo.',
      copyright: 'Madagascar El Niño Observatory · Ripoti ya Tabianchi, Uchumi na Kilimo 2026–2028',
    },
  },

  es: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'Observatorio Climático, Económico y de Resiliencia Agrícola',
    nav: {
      mechanism: 'Mecanismo',
      indianOcean: 'Océano Índico',
      africa: 'África',
      worldObservatory: 'Mundo (195)',
      mlModel: 'Modelo ML',
      atlas: 'Atlas 23',
      nationalPlan: 'Plan Nacional',
      economicLoss: 'Pérdidas Eco.',
      geminiHub: 'Gemini AI',
      cooperatives: 'Cooperativas',
      ctaAdvisor: 'Guía Cooperativa',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · Dossier Climático Global · OMM / FAO / SWIOCOF-15',
      title: 'Súper El Niño 2026–2027 y perspectivas 2028–2032: impacto mundial, crisis alimentaria y adaptación',
      lead: 'Desde la sequía aguda en el Gran Sur de Madagascar y África austral hasta las lluvias torrenciales en África Oriental y el Pacífico suramericano, el Observatorio integra modelos ML, pérdidas económicas en 195 países de la ONU y asistencia Gemini en tiempo real.',
      primaryCta: 'Calendarios FOFIFA 2026–2027',
      secondaryCta: 'Simular territorio',
      aiCta: 'Abrir Gemini AI',
      tones: { amber: 'Alerta térmica', crimson: 'Umbral crítico', cobalt: 'Tensión de mercado', neutral: 'Observado' },
    },
    sections: {
      s01Eyebrow: '01 · Ciclo ENSO y Dinámica Océano-Atmósfera',
      s01Title: 'Mecanismo físico del Súper El Niño 2026–2027',
      s01Lead: 'Debilitamiento de los alisios, desplazamiento de aguas cálidas al Pacífico oriental y acoplamiento IOD+.',
      s02Eyebrow: '02 · Madagascar y Suroeste del Océano Índico (SWIOCOF-15)',
      s02Title: 'Asimetría pluviométrica en Madagascar y vulnerabilidad insular',
      s02Lead: 'Déficit hídrico severo en el Gran Sur frente a lluvias excesivas y ciclones en el Noreste.',
      s03Eyebrow: '03 · África, Bloques Económicos y Mercados Globales',
      s03Title: 'Repercusiones en África, SADC, COMESA y precios agrícolas',
      s03Lead: 'Contraste entre sequía austral, crecidas en África Oriental e inflación alimentaria mundial.',
      s04Eyebrow: '04 · Machine Learning (Random Forest, LSTM y XGBoost) · 2027–2028',
      s04Title: 'Modelización espacial por distrito, Google Maps y diagnóstico QLoRA / RAG',
      s04Lead: 'Desagregación territorial, validación temporal y síntesis agronómica asistida por Gemini.',
      s05Eyebrow: '05 · Adaptación Agrícola y Calendarios FOFIFA / DGM',
      s05Title: 'Calendarios de siembra resilientes y prácticas agroecológicas',
      s05Lead: 'Fechas óptimas por zona, sorgo/mijo de ciclo corto, Zaï, SCV y arroz SRI.',
      s06Eyebrow: '06 · Atlas Nacional El Niño Madagascar (23 Regiones y 119 Distritos)',
      s06Title: 'Atlas territorial completo por región y distrito',
      s06Lead: 'Cobertura nacional de riesgos climáticos, cadenas productivas y medidas prioritarias.',
      s07Eyebrow: '07 · Plan Nacional de Preparación y Resiliencia Climática 2027–2028',
      s07Title: 'Plan Nacional de Preparación y Resiliencia 2027–2028',
      s07Lead: 'Puntuación 5D, presupuesto MGA/USD/EUR, gobernanza de 13 actores y registro ONG.',
      s08Eyebrow: '08 · Evaluación Económica Multiescala · Distrito → Región → Provincia → África',
      s08Title: 'Evaluación de pérdidas económicas: Madagascar, Océano Índico y África',
      s08Lead: 'Agregación ascendente de choques agrícolas directos e indirectos.',
      s09Eyebrow: '09 · Inteligencia Gemini Conectada · Chat, Search, Maps y Voz Indri indri',
      s09Title: 'Centro Gemini AI: chat, Google Search, Maps y voz en vivo Indri indri',
      s09Lead: 'Consulte en español, francés, inglés o cualquiera de los 9 idiomas mundiales por texto o voz en vivo.',
      s10Eyebrow: '10 · Ventanillas de Cooperativas y Financiamiento FDA',
      s10Title: 'Simulador de ficha cooperativa y directorio de apoyo',
      s10Lead: 'Obtenga ventanas de siembra y mecanismos de apoyo técnico y financiero.',
      s11Eyebrow: '11 · Duplicación Mundial · 195 Países ONU, Continentes, Zonas, Idiomas y 2028–2032',
      s11Title: 'Observatorio Mundial El Niño: 195 países, continentes, idiomas y proyecciones 2028–2032',
      s11Lead: 'Duplicación completa por país (195 Estados de la ONU), continente (modelos 5/6/7), zona climática, idiomas más hablados y pronósticos 2028–2032.',
    },
    economic: {
      disclaimerTitle: 'Separación estricta Observado vs Modelado:',
      horizonLabel: 'Horizonte',
      year2027Btn: '2027 · Choque El Niño',
      year2028Btn: '2028 · Transición / Crecidas',
      scenarioLabel: 'Escenario climático',
      scopeLabel: 'Alcance Madagascar',
      scope119: '119 distritos (Total)',
      scope42: '42 distritos piloto',
      currencyLabel: 'Moneda',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'Pérdidas totales Madagascar',
      kpiDirectVsIndirect: 'Directo agrícola vs Indirecto',
      kpiCoi: 'Océano Índico (COI)',
      kpiAfrica: 'Proyección África (SADC / COMESA)',
      tabProvinces: '1. 6 Ex-Provincias',
      tabRegions: '2. 23 Regiones oficiales',
      tabDistricts: '3. 42 Distritos modelados',
      tabContinental: '4. Océano Índico y África',
    },
    assistant: {
      tabChat: 'Chatbot Multiturno (Gemini)',
      tabSearch: 'Vigilancia Web (Google Search)',
      tabMaps: 'Lugares y Logística (Google Maps)',
      tabLive: 'Voz en Vivo · Indri indri',
      openIndriVoiceBtn: 'Hablar con Indri indri (Voz Live)',
      roleLabel: 'Rol experto',
      roles: {
        agronome: { label: 'Agrónomo FOFIFA', desc: 'Siembras, Zaï, SCV, SRI y cadenas de valor.' },
        economiste: { label: 'Economista ENSO Global', desc: 'Pérdidas PIB, inflación alimentaria y bloques regionales.' },
        humanitaire: { label: 'Coordinador Humanitario', desc: 'Alertas tempranas, hambre, desplazamientos y salud.' },
      },
      groundingModeLabel: 'Anclaje de datos',
      groundingModes: { none: 'Directo (Observatorio)', googleSearch: 'Google Search (Web)', googleMaps: 'Google Maps (Lugares)' },
      speedLabel: 'Modelo Gemini',
      speedStandard: 'gemini-4-hydrogen (Completo)',
      speedFast: 'gemini-3.1-flash-lite (Rápido)',
      anchorLocationLabel: 'Zona de anclaje GPS',
      useMyGps: 'Mi GPS',
      gpsActive: 'GPS activo',
      gpsError: 'GPS no disponible.',
      resetChat: 'Nueva conversación',
      inputPlaceholderChat: 'Pregunte sobre cualquier país, continente, Madagascar o previsiones 2028–2032...',
      inputPlaceholderSearch: 'Buscar boletines OMM, NOAA, FAO o FEWS NET...',
      inputPlaceholderMaps: 'Buscar mercados agrícolas, silos, presas o centros logísticos...',
      sendBtn: 'Enviar',
      searchingBtn: 'Analizar',
      loadingText: 'Consultando Gemini...',
      webSourcesTitle: 'Fuentes Web verificadas',
      mapPlacesTitle: 'Lugares verificados en Google Maps',
      mapReviewsTitle: 'Reseñas y notas de campo',
      openInMaps: 'Abrir en Google Maps',
      floatingLabel: 'Gemini AI · Chat',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'Chatbot multiturno · Search & Maps',
      chatStarters: [
        'Compara las pérdidas 2027–2031 en Madagascar, Perú y la India.',
        '¿Qué impacto tendrá La Niña 2028 tras el Súper El Niño 2026–2027?',
        'Resume las proyecciones económicas de Oxford Economics hasta 2032.',
      ],
      searchPresets: [
        'Boletín actual OMM / NOAA ONI El Niño 2026–2027',
        'Seguridad alimentaria África austral y Madagascar FEWS NET 2026 2027',
        'Precios mundiales de arroz, maíz y cacao FAO',
        'Impacto El Niño en Perú y el Corredor Seco Centroamericano',
      ],
      mapsPresets: [
        'Mercados agrícolas y depósitos de granos',
        'Estaciones meteorológicas e institutos agrícolas',
        'Embalses y centrales hidroeléctricas',
        'Puertos y centros logísticos humanitarios',
      ],
    },
    footer: {
      sourcesTitle: 'Fuentes científicas e institucionales',
      sourcesSubtitle: 'Basado en datos OMM, NOAA, ONU, Dartmouth, Oxford Economics, FAO y Météo Madagascar.',
      copyright: 'Madagascar El Niño Observatory · Observatorio Global 2026–2032',
    },
  },

  ar: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'مرصد المناخ والاقتصاد والمرونة الزراعية',
    nav: {
      mechanism: 'الآلية',
      indianOcean: 'المحيط الهندي',
      africa: 'أفريقيا',
      worldObservatory: 'العالم (195)',
      mlModel: 'التعلم الآلي',
      atlas: 'الأطلس 23',
      nationalPlan: 'الخطة الوطنية',
      economicLoss: 'الخسائر',
      geminiHub: 'Gemini AI',
      cooperatives: 'التعاونيات',
      ctaAdvisor: 'دليل التعاونيات',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · ملف المناخ والزراعة العالمي · المنظمة العالمية للأرصاد / الفاو',
      title: 'ظاهرة النينيو الكبرى 2026–2027 وآفاق 2028–2032: التأثير العالمي وأزمة الغذاء والتكيف',
      lead: 'من الجفاف الشديد في جنوب مدغشقر والجنوب الأفريقي إلى الفيضانات في شرق أفريقيا وتقلبات الأسواق العالمية، يجمع المرصد توقعات التعلم الآلي وتحليل 195 دولة في الأمم المتحدة وذكاء Gemini المتصل بالبحث والخرائط.',
      primaryCta: 'تقويمات FOFIFA 2026–2027',
      secondaryCta: 'محاكاة المنطقة',
      aiCta: 'فتح Gemini AI',
      tones: { amber: 'تنبيه حراري', crimson: 'حد حرج', cobalt: 'توتر الأسواق', neutral: 'مراقبة' },
    },
    sections: {
      s01Eyebrow: '01 · دورة ENSO وديناميكية المحيط والغلاف الجوي',
      s01Title: 'الآلية الفيزيائية لظاهرة النينيو الكبرى 2026–2027',
      s01Lead: 'ضعف الرياح التجارية وانتقال المياه الدافئة شرقاً واقتران IOD+.',
      s02Eyebrow: '02 · مدغشقر وجنوب غرب المحيط الهندي',
      s02Title: 'عدم توازن الأمطار في مدغشقر وهشاشة الجزر',
      s02Lead: 'عجز مائي حاد في الجنوب مقابل أمطار غزيرة وأعاصير في الشمال الشرقي.',
      s03Eyebrow: '03 · أفريقيا والتكتلات الإقليمية والأسواق العالمية',
      s03Title: 'التداعيات على أفريقيا وSADC وCOMESA والأسعار الزراعية',
      s03Lead: 'تباين الجفاف في الجنوب الأفريقي والفيضانات في الشرق وتضخم أسعار الحبوب.',
      s04Eyebrow: '04 · التعلم الآلي (Random Forest و LSTM و XGBoost) · 2027–2028',
      s04Title: 'النمذجة المكانية وخرائط Google وتشخيص QLoRA / RAG',
      s04Lead: 'تحليل المقاطعات والتحقق الزمني والتوصيات الزراعية عبر Gemini.',
      s05Eyebrow: '05 · التكيف الزراعي وتقويمات FOFIFA',
      s05Title: 'مواعيد الزراعة المرنة والتقنيات الإيكولوجية',
      s05Lead: 'بذور قصيرة الدورة وتقنيات Zaï و SCV وزراعة الأرز SRI.',
      s06Eyebrow: '06 · الأطلس الوطني لمدغشقر (23 إقليماً و119 مقاطعة)',
      s06Title: 'الأطلس الإقليمي الشامل حسب المنطقة والمقاطعة',
      s06Lead: 'تغطية وطنية للمخاطر المناخية والسلاسل الزراعية والتدخلات ذات الأولوية.',
      s07Eyebrow: '07 · الخطة الوطنية للاستعداد والمرونة المناخية 2027–2028',
      s07Title: 'الخطة الوطنية للاستعداد والمرونة 2027–2028',
      s07Lead: 'تصنيف المخاطر والميزانية وسجل المنظمات غير الحكومية والحوكمة.',
      s08Eyebrow: '08 · التقييم الاقتصادي متعدد المستويات',
      s08Title: 'تقييم الخسائر الاقتصادية: مدغشقر والمحيط الهندي وأفريقيا',
      s08Lead: 'تجميع تصاعدي للخسائر الزراعية المباشرة وغير المباشرة.',
      s09Eyebrow: '09 · ذكاء Gemini · الدردشة والبحث والخرائط وصوت Indri indri المباشر',
      s09Title: 'مركز Gemini AI: محادثة وبحث وخرائط وصوت حي',
      s09Lead: 'اسأل المرصد بالعربية أو الفرنسية أو الإنجليزية أو بأي من اللغات التسع نصياً أو صوتياً.',
      s10Eyebrow: '10 · دعم التعاونيات والتمويل الزراعي',
      s10Title: 'محاكي ملف التعاونيات ودليل الدعم في مدغشقر',
      s10Lead: 'اختر المنطقة والمحصول للحصول على الإرشادات ومنافذ التمويل.',
      s11Eyebrow: '11 · التكرار العالمي · 195 دولة في الأمم المتحدة والقارات واللغات وتوقعات 2028–2032',
      s11Title: 'المرصد العالمي لظاهرة النينيو: 195 دولة والقارات واللغات وتوقعات 2028–2032',
      s11Lead: 'تغطية شاملة لـ 195 دولة بالأمم المتحدة ونماذج القارات (5/6/7) والمناطق المناخية وأكثر اللغات تحدثاً وتوقعات 2028 إلى 2032.',
    },
    economic: {
      disclaimerTitle: 'فصل صارم بين المرصود والمنمذج:',
      horizonLabel: 'أفق التحليل',
      year2027Btn: '2027 · صدمة النينيو',
      year2028Btn: '2028 · المرحلة الانتقالية',
      scenarioLabel: 'السيناريو المناخي',
      scopeLabel: 'النطاق',
      scope119: '119 مقاطعة (كامل)',
      scope42: '42 مقاطعة نموذجية',
      currencyLabel: 'العملة',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'إجمالي خسائر مدغشقر',
      kpiDirectVsIndirect: 'مباشر زراعي مقابل غير مباشر',
      kpiCoi: 'المحيط الهندي (COI)',
      kpiAfrica: 'توقعات أفريقيا (SADC / COMESA)',
      tabProvinces: '1. 6 أقاليم تاريخية',
      tabRegions: '2. 23 منطقة رسمية',
      tabDistricts: '3. 42 مقاطعة منمذجة',
      tabContinental: '4. المحيط الهندي وأفريقيا',
    },
    assistant: {
      tabChat: 'محادثة متعددة (Gemini)',
      tabSearch: 'مراقبة الويب (Google Search)',
      tabMaps: 'المواقع واللوجستيات (Google Maps)',
      tabLive: 'صوت حي · Indri indri',
      openIndriVoiceBtn: 'تحدث مع Indri indri',
      roleLabel: 'الدور الخبير',
      roles: {
        agronome: { label: 'خبير زراعي FOFIFA', desc: 'تقويم البذر وتقنيات الري والتكيف.' },
        economiste: { label: 'خبير اقتصادي ENSO', desc: 'توقعات الناتج المحلي والتضخم الغذائي في 195 دولة.' },
        humanitaire: { label: 'منسق إنساني', desc: 'الإنذار المبكر والأمن الغذائي والنزوح المناخي.' },
      },
      groundingModeLabel: 'مصدر البيانات',
      groundingModes: { none: 'مباشر (المرصد)', googleSearch: 'بحث Google', googleMaps: 'خرائط Google' },
      speedLabel: 'نموذج Gemini',
      speedStandard: 'gemini-4-hydrogen (كامل)',
      speedFast: 'gemini-3.1-flash-lite (سريع)',
      anchorLocationLabel: 'نقطة الارتكاز الجغرافي',
      useMyGps: 'استخدام GPS',
      gpsActive: 'GPS مفعل',
      gpsError: 'GPS غير متاح.',
      resetChat: 'محادثة جديدة',
      inputPlaceholderChat: 'اسأل عن أي دولة أو قارة أو توقعات 2028–2032...',
      inputPlaceholderSearch: 'ابحث عن نشرات الأرصاد والفاو...',
      inputPlaceholderMaps: 'ابحث عن الأسواق الزراعية والمخازن والسدود...',
      sendBtn: 'إرسال',
      searchingBtn: 'تحليل',
      loadingText: 'جاري استشارة Gemini...',
      webSourcesTitle: 'مصادر ويب موثقة',
      mapPlacesTitle: 'أماكن موثقة على خرائط Google',
      mapReviewsTitle: 'ملاحظات ميدانية',
      openInMaps: 'فتح في خرائط Google',
      floatingLabel: 'Gemini AI · دردشة',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'دردشة · بحث وخرائط',
      chatStarters: [
        'قارن خسائر 2027–2031 في مصر والمغرب ومدغشقر.',
        'ما هي توقعات النينيو والنينيا العالمية للفترة 2028–2032؟',
        'كيف يؤثر التضخم الغذائي على الدول المستوردة للقمح والأرز؟',
      ],
      searchPresets: [
        'أحدث نشرة للأرصاد العالمية حول النينيو 2026–2027',
        'الأمن الغذائي في القرن الأفريقي والشرق الأوسط',
        'أسعار القمح والأرز العالمية الفاو 2026',
        'توقعات Oxford Economics لخسائر النينيو حتى 2031',
      ],
      mapsPresets: [
        'أسواق الحبوب ومخازن الغذاء',
        'السدود ومحطات الأرصاد الجوية',
        'الموانئ ومراكز الإمداد',
        'مناطق الري الرئيسية',
      ],
    },
    footer: {
      sourcesTitle: 'المصادر العلمية والمؤسسية',
      sourcesSubtitle: 'بيانات المنظمة العالمية للأرصاد والفاو والأمم المتحدة ودارتموث وأكسفورد إيكونوميكس.',
      copyright: 'Madagascar El Niño Observatory · المرصد العالمي 2026–2032',
    },
  },

  zh: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: '气候、经济与农业韧性全球观测平台',
    nav: {
      mechanism: '物理机制',
      indianOcean: '印度洋',
      africa: '非洲',
      worldObservatory: '全球 (195国)',
      mlModel: '机器学习',
      atlas: '区域图谱',
      nationalPlan: '国家计划',
      economicLoss: '经济损失',
      geminiHub: 'Gemini AI',
      cooperatives: '合作社',
      ctaAdvisor: '合作社指南',
      openMenu: '打开菜单',
      closeMenu: '关闭菜单',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · 全球气候与农业韧性报告 · WMO / FAO / SWIOCOF-15',
      title: '2026–2027超级厄尔尼诺及2028–2032全球展望：海洋异常、粮食危机与适应对策',
      lead: '从马达加斯加南部和南部非洲的严重干旱，到东非和南美太平洋沿岸的暴雨洪涝，本平台整合机器学习模型、联合国195国经济损失评估与连接Google搜索和地图的Gemini实时智能。',
      primaryCta: 'FOFIFA种植历 2026–2027',
      secondaryCta: '模拟区域影响',
      aiCta: '启动 Gemini AI',
      tones: { amber: '高温预警', crimson: '严重阈值', cobalt: '市场压力', neutral: '观测数据' },
    },
    sections: {
      s01Eyebrow: '01 · ENSO循环与海气动力学',
      s01Title: '2026–2027超级厄尔尼诺物理机制',
      s01Lead: '信风减弱、暖水东移与印度洋偶极子正位相（IOD+）耦合效应。',
      s02Eyebrow: '02 · 马达加斯加与西南印度洋 (SWIOCOF-15)',
      s02Title: '马达加斯加降水不对称性与海岛脆弱性',
      s02Lead: '南部严重缺水与东北部强降雨及气旋风险并存。',
      s03Eyebrow: '03 · 非洲、区域经济体与全球市场',
      s03Title: '对非洲、SADC、COMESA及农产品价格的连锁冲击',
      s03Lead: '南部干旱、东非洪涝与全球主粮通胀传导机制。',
      s04Eyebrow: '04 · 机器学习 (Random Forest, LSTM & XGBoost) · 2027–2028',
      s04Title: '区域空间建模、Google地图与QLoRA/RAG智能诊断',
      s04Lead: '高分辨率产量预测、时间交叉验证与Gemini农艺决策简报。',
      s05Eyebrow: '05 · 农业适应与FOFIFA/DGM种植历',
      s05Title: '抗逆播种窗口与生态农业技术',
      s05Lead: '短生育期高粱/小米、Zaï蓄水坑、免耕覆盖（SCV）与水稻强化栽培（SRI）。',
      s06Eyebrow: '06 · 马达加斯加国家图谱（23大区与119县）',
      s06Title: '分大区与县级气候风险全图谱',
      s06Lead: '全国气候风险分布、脆弱产业链与优先干预措施。',
      s07Eyebrow: '07 · 国家气候准备与韧性计划 2027–2028',
      s07Title: '国家气候准备与韧性建设方案',
      s07Lead: '5维风险评分、MGA/USD/EUR预算模型、13方治理架构与NGO协调登记。',
      s08Eyebrow: '08 · 多尺度经济损失评估',
      s08Title: '经济损失评估：马达加斯加、印度洋与非洲',
      s08Lead: '农业直接损失与水电、交通、畜牧等间接冲击汇总。',
      s09Eyebrow: '09 · Gemini智能中心 · 对话、搜索、地图与Indri indri实时语音',
      s09Title: 'Gemini智能中心：多轮对话、网络搜索、地图与实时语音',
      s09Lead: '支持中文及9种世界主要语言文字查询，或与3D/动态Indri indri形象进行实时语音交互。',
      s10Eyebrow: '10 · 农业合作社支持与融资窗口',
      s10Title: '合作社适应方案模拟器与支持机构名录',
      s10Lead: '根据所在区域和作物获取播种指南与FDA/FAO资助渠道。',
      s11Eyebrow: '11 · 全球多尺度覆盖 · 联合国195国、各大洲、气候带、主要语言与2028–2032预测',
      s11Title: '全球厄尔尼诺观测站：195个国家、大洲模型、主要语言与2028–2032跨年展望',
      s11Lead: '全面覆盖联合国195国、5/6/7大洲分类模型、12个全球气候带、世界主要语言及2028、2029、2030、2031、2032逐年经济与灾害预测。',
    },
    economic: {
      disclaimerTitle: '实测数据与模型预测严格区分：',
      horizonLabel: '分析年份',
      year2027Btn: '2027 · 厄尔尼诺冲击',
      year2028Btn: '2028 · 拉尼娜过渡/洪涝',
      scenarioLabel: '气候情景',
      scopeLabel: '统计范围',
      scope119: '119县（全国）',
      scope42: '42重点试点县',
      currencyLabel: '货币',
      exportCsv: 'CSV',
      kpiMadagascarTotal: '马达加斯加总损失',
      kpiDirectVsIndirect: '直接农业损失 vs 间接损失',
      kpiCoi: '印度洋委员会 (COI)',
      kpiAfrica: '非洲预测 (SADC / COMESA)',
      tabProvinces: '1. 6历史省',
      tabRegions: '2. 23官方大区',
      tabDistricts: '3. 42建模试点县',
      tabContinental: '4. 印度洋与非洲国家',
    },
    assistant: {
      tabChat: '多轮智能对话 (Gemini)',
      tabSearch: '实时网络监测 (Google Search)',
      tabMaps: '地理与物流 (Google Maps)',
      tabLive: '实时语音 · Indri indri',
      openIndriVoiceBtn: '与 Indri indri 语音对话',
      roleLabel: '专家角色',
      roles: {
        agronome: { label: 'FOFIFA 农艺专家', desc: '播种窗口、水土保持与粮食作物韧性。' },
        economiste: { label: '全球ENSO经济学家', desc: '195国GDP滞后效应、通胀与水电能源风险。' },
        humanitaire: { label: '人道与预警协调员', desc: '早期预警、饥荒防范与气候移民评估。' },
      },
      groundingModeLabel: '数据锚定',
      groundingModes: { none: '观测库直连', googleSearch: 'Google 实时搜索', googleMaps: 'Google 地图' },
      speedLabel: 'Gemini 模型',
      speedStandard: 'gemini-4-hydrogen (全功能)',
      speedFast: 'gemini-3.1-flash-lite (快速)',
      anchorLocationLabel: '地图锚定区域',
      useMyGps: '使用当前GPS',
      gpsActive: 'GPS已激活',
      gpsError: 'GPS不可用。',
      resetChat: '新建对话',
      inputPlaceholderChat: '询问全球195国、各大洲、马达加斯加或2028–2032年预测...',
      inputPlaceholderSearch: '搜索WMO、NOAA、FAO或FEWS NET最新公报...',
      inputPlaceholderMaps: '搜索农产品市场、粮仓、水电站或救灾中心...',
      sendBtn: '发送',
      searchingBtn: '分析',
      loadingText: '正在调用 Gemini...',
      webSourcesTitle: '已验证网页来源',
      mapPlacesTitle: 'Google Maps 地点与链接',
      mapReviewsTitle: '实地摘要与评价',
      openInMaps: '在 Google Maps 中打开',
      floatingLabel: 'Gemini AI · 对话',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: '多轮对话 · 搜索与地图增强',
      chatStarters: [
        '对比2027–2031年中国、印度与马达加斯加的厄尔尼诺经济影响。',
        'Oxford Economics 对2031年全球GDP累计损失约4万亿美元的预测机制是什么？',
        '2028–2032年拉尼娜过渡与再暖化将如何影响全球大米与粮食价格？',
      ],
      searchPresets: [
        'WMO / NOAA 最新2026–2027厄尔尼诺指数ONI公报',
        '全球大米、小麦、玉米与棕榈油价格及印度出口限制动态',
        '南部非洲与马达加斯加粮食安全预警 FEWS NET',
        '秘鲁渔业与亚马逊干旱最新气候监测',
      ],
      mapsPresets: [
        '主要粮食市场与储备库',
        '水电大坝与灌区基础设施',
        '农业科研与气象监测站',
        '港口与应急物流枢纽',
      ],
    },
    footer: {
      sourcesTitle: '科学与机构参考来源',
      sourcesSubtitle: '综合WMO、NOAA、联合国、达特茅斯大学、牛津经济研究院与FAO数据。',
      copyright: 'Madagascar El Niño Observatory · 全球观测站 2026–2032',
    },
  },

  pt: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'Observatório Climático, Económico e de Resiliência Agrícola',
    nav: {
      mechanism: 'Mecanismo',
      indianOcean: 'Oceano Índico',
      africa: 'África',
      worldObservatory: 'Mundo (195)',
      mlModel: 'Modelo ML',
      atlas: 'Atlas 23',
      nationalPlan: 'Plano Nacional',
      economicLoss: 'Perdas Econ.',
      geminiHub: 'Gemini AI',
      cooperatives: 'Cooperativas',
      ctaAdvisor: 'Guia Coop.',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · Dossiê Climático Global · OMM / FAO / SWIOCOF-15',
      title: 'Super El Niño 2026–2027 e horizonte 2028–2032: impacto global, crise alimentar e adaptação',
      lead: 'Da seca extrema no Sul de Madagáscar, Moçambique e Angola às secas amazónicas e cheias na África Oriental, o Observatório reúne previsões ML, 195 países da ONU e inteligência Gemini ligada à Web e Google Maps.',
      primaryCta: 'Calendários FOFIFA 2026–2027',
      secondaryCta: 'Simular território',
      aiCta: 'Abrir Gemini AI',
      tones: { amber: 'Alerta térmico', crimson: 'Limiar crítico', cobalt: 'Tensão mercado', neutral: 'Observado' },
    },
    sections: {
      s01Eyebrow: '01 · Ciclo ENSO e Dinâmica Oceano-Atmosfera',
      s01Title: 'Mecanismo físico do Super El Niño 2026–2027',
      s01Lead: 'Enfraquecimento dos alísios, deslocamento de águas quentes e acoplamento IOD+.',
      s02Eyebrow: '02 · Madagáscar e Sudoeste do Oceano Índico (SWIOCOF-15)',
      s02Title: 'Assimetria pluviométrica em Madagáscar e vulnerabilidade insular',
      s02Lead: 'Défice hídrico severo no Sul contra chuvas intensas e ciclones no Nordeste.',
      s03Eyebrow: '03 · África, Blocos Regionais e Mercados Globais',
      s03Title: 'Repercussões em África, SADC, COMESA e preços agrícolas',
      s03Lead: 'Contraste entre seca austral, cheias orientais e inflação alimentar global.',
      s04Eyebrow: '04 · Machine Learning (Random Forest, LSTM & XGBoost) · 2027–2028',
      s04Title: 'Modelagem espacial por distrito, Google Maps e diagnóstico QLoRA / RAG',
      s04Lead: 'Desagregação territorial, validação temporal e síntese agronómica Gemini.',
      s05Eyebrow: '05 · Adaptação Agrícola e Calendários FOFIFA',
      s05Title: 'Calendários de plantio resilientes e agroecologia',
      s05Lead: 'Variedades de ciclo curto, Zaï, plantio direto (SCV) e arroz SRI.',
      s06Eyebrow: '06 · Atlas Nacional de Madagáscar (23 Regiões e 119 Distritos)',
      s06Title: 'Atlas territorial completo por região e distrito',
      s06Lead: 'Mapeamento nacional de riscos climáticos e prioridades locais.',
      s07Eyebrow: '07 · Plano Nacional de Preparação e Resiliência Climática 2027–2028',
      s07Title: 'Plano Nacional de Preparação e Resiliência 2027–2028',
      s07Lead: 'Pontuação 5D, orçamento MGA/USD/EUR, governação de 13 atores e registo ONG.',
      s08Eyebrow: '08 · Avaliação Económica Multiescala',
      s08Title: 'Avaliação de perdas económicas: Madagáscar, Índico e África',
      s08Lead: 'Agregação de perdas diretas agrícolas e impactos indiretos.',
      s09Eyebrow: '09 · Inteligência Gemini · Chat, Search, Maps e Voz Indri indri',
      s09Title: 'Centro Gemini AI: chat, Google Search, Maps e voz ao vivo',
      s09Lead: 'Consulte em português, francês, inglês ou qualquer um dos 9 idiomas por texto ou voz ao vivo.',
      s10Eyebrow: '10 · Balcões de Cooperativas e Financiamento',
      s10Title: 'Simulador de ficha cooperativa e diretório de apoio',
      s10Lead: 'Janelas de plantio recomendadas e acesso a fundos climáticos.',
      s11Eyebrow: '11 · Duplicação Mundial · 195 Países ONU, Continentes, Zonas, Idiomas e 2028–2032',
      s11Title: 'Observatório Mundial El Niño: 195 países, continentes, idiomas e previsões 2028–2032',
      s11Lead: 'Cobertura dos 195 Estados da ONU, modelos de 5/6/7 continentes, 12 zonas climáticas, idiomas mais falados e antecipações anuais de 2028 a 2032.',
    },
    economic: {
      disclaimerTitle: 'Separação estrita Observado vs Modelado:',
      horizonLabel: 'Horizonte',
      year2027Btn: '2027 · Choque El Niño',
      year2028Btn: '2028 · Transição / Cheias',
      scenarioLabel: 'Cenário climático',
      scopeLabel: 'Escopo',
      scope119: '119 distritos (Total)',
      scope42: '42 distritos piloto',
      currencyLabel: 'Moeda',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'Perdas totais Madagáscar',
      kpiDirectVsIndirect: 'Direto agrícola vs Indireto',
      kpiCoi: 'Oceano Índico (COI)',
      kpiAfrica: 'Projeção África (SADC / COMESA)',
      tabProvinces: '1. 6 Ex-Províncias',
      tabRegions: '2. 23 Regiões oficiais',
      tabDistricts: '3. 42 Distritos modelados',
      tabContinental: '4. Índico e África',
    },
    assistant: {
      tabChat: 'Chatbot Multiturno (Gemini)',
      tabSearch: 'Vigilância Web (Google Search)',
      tabMaps: 'Locais e Logística (Google Maps)',
      tabLive: 'Voz ao Vivo · Indri indri',
      openIndriVoiceBtn: 'Falar com Indri indri (Voz Live)',
      roleLabel: 'Perfil especialista',
      roles: {
        agronome: { label: 'Agrónomo FOFIFA', desc: 'Janelas de plantio, Zaï, SCV e cadeias agrícolas.' },
        economiste: { label: 'Economista ENSO Global', desc: 'Perdas PIB em 195 países, inflação e energia.' },
        humanitaire: { label: 'Coordenador Humanitário', desc: 'Alerta precoce, segurança alimentar e migração climática.' },
      },
      groundingModeLabel: 'Ancoragem de dados',
      groundingModes: { none: 'Direto (Observatório)', googleSearch: 'Google Search', googleMaps: 'Google Maps' },
      speedLabel: 'Modelo Gemini',
      speedStandard: 'gemini-4-hydrogen (Completo)',
      speedFast: 'gemini-3.1-flash-lite (Rápido)',
      anchorLocationLabel: 'Localização de referência',
      useMyGps: 'Meu GPS',
      gpsActive: 'GPS ativo',
      gpsError: 'GPS indisponível.',
      resetChat: 'Nova conversa',
      inputPlaceholderChat: 'Pergunte sobre Brasil, Angola, Moçambique, Madagáscar ou previsões 2028–2032...',
      inputPlaceholderSearch: 'Pesquisar boletins OMM, NOAA, FAO ou FEWS NET...',
      inputPlaceholderMaps: 'Mercados agrícolas, silos, barragens ou centros logísticos...',
      sendBtn: 'Enviar',
      searchingBtn: 'Analisar',
      loadingText: 'Consultando Gemini...',
      webSourcesTitle: 'Fontes Web verificadas',
      mapPlacesTitle: 'Locais verificados no Google Maps',
      mapReviewsTitle: 'Notas de campo',
      openInMaps: 'Abrir no Google Maps',
      floatingLabel: 'Gemini AI · Chat',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'Chatbot · Search & Maps',
      chatStarters: [
        'Compara os impactos 2027–2031 no Brasil (Amazônia), Moçambique, Angola e Madagáscar.',
        'Como a transição La Niña em 2028 altera o risco de cheias e secas?',
        'Resume os efeitos mundiais do El Niño na inflação de café, arroz e açúcar.',
      ],
      searchPresets: [
        'Boletim OMM / NOAA El Niño 2026–2027',
        'Seca na Amazônia e hidreletricidade no Brasil',
        'Segurança alimentar Moçambique e Madagáscar FEWS NET',
        'Preços globais de arroz, café e soja FAO',
      ],
      mapsPresets: [
        'Mercados agrícolas e armazéns de grãos',
        'Barragens hidrelétricas e irrigação',
        'Centros de pesquisa agrícola',
        'Portos e bases humanitárias',
      ],
    },
    footer: {
      sourcesTitle: 'Fontes científicas e institucionais',
      sourcesSubtitle: 'Compilado a partir de OMM, NOAA, ONU, Dartmouth, Oxford Economics e FAO.',
      copyright: 'Madagascar El Niño Observatory · Observatório Global 2026–2032',
    },
  },

  hi: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'जलवायु, आर्थिक एवं कृषि लचीलापन वेधशाला',
    nav: {
      mechanism: 'तंत्र',
      indianOcean: 'हिंद महासागर',
      africa: 'अफ्रीका',
      worldObservatory: 'विश्व (195)',
      mlModel: 'ML मॉडल',
      atlas: 'एटलस 23',
      nationalPlan: 'राष्ट्रीय योजना',
      economicLoss: 'आर्थिक हानि',
      geminiHub: 'Gemini AI',
      cooperatives: 'सहकारी समितियाँ',
      ctaAdvisor: 'सहकारी गाइड',
      openMenu: 'मेनू खोलें',
      closeMenu: 'मेनू बंद करें',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · वैश्विक जलवायु व कृषि डोजियर · WMO / FAO / SWIOCOF-15',
      title: 'सुपर अल नीनो 2026–2027 और 2028–2032 पूर्वानुमान: वैश्विक प्रभाव, खाद्य संकट व अनुकूलन',
      lead: 'दक्षिणी मेडागास्कर और दक्षिणी अफ्रीका में गंभीर सूखे से लेकर दक्षिण एशिया के मानसून दबाव और पूर्वी अफ्रीका की बाढ़ तक, यह मंच 195 UN देशों के आर्थिक मॉडल और Gemini AI को जोड़ता है।',
      primaryCta: 'FOFIFA कैलेंडर 2026–2027',
      secondaryCta: 'क्षेत्र का अनुकरण करें',
      aiCta: 'Gemini AI खोलें',
      tones: { amber: 'ताप चेतावनी', crimson: 'गंभीर स्तर', cobalt: 'बाज़ार दबाव', neutral: 'अवलोकन' },
    },
    sections: {
      s01Eyebrow: '01 · ENSO चक्र एवं महासागर-वायुमंडल गतिशीलता',
      s01Title: '2026–2027 सुपर अल नीनो की भौतिक प्रक्रिया',
      s01Lead: 'व्यापारिक पवनों का कमजोर होना, गर्म पानी का पूर्व की ओर खिसकना और IOD+ युग्मन।',
      s02Eyebrow: '02 · मेडागास्कर और दक्षिण-पश्चिम हिंद महासागर',
      s02Title: 'मेडागास्कर में वर्षा विषमता और द्वीपीय संवेदनशीलता',
      s02Lead: 'दक्षिण में सूखा बनाम उत्तर-पूर्व में भारी वर्षा और चक्रवात जोखिम।',
      s03Eyebrow: '03 · अफ्रीका, क्षेत्रीय गुट एवं वैश्विक बाज़ार',
      s03Title: 'अफ्रीका, SADC, COMESA और कृषि कीमतों पर प्रभाव',
      s03Lead: 'दक्षिणी सूखा, पूर्वी बाढ़ और वैश्विक अनाज मुद्रास्फीति।',
      s04Eyebrow: '04 · मशीन लर्निंग (RF, LSTM, XGBoost) · 2027–2028',
      s04Title: 'जिला स्तरीय स्थानिक मॉडलिंग, Google Maps और QLoRA / RAG निदान',
      s04Lead: 'जिला स्तर पर उपज पूर्वानुमान और Gemini कृषि विश्लेषण।',
      s05Eyebrow: '05 · कृषि अनुकूलन और FOFIFA कैलेंडर',
      s05Title: 'लचीले बुवाई कैलेंडर और कृषि-पारिस्थितिक तकनीकें',
      s05Lead: 'अल्पकालिक फसलें, Zaï गड्ढे, SCV और SRI चावल विधि।',
      s06Eyebrow: '06 · मेडागास्कर राष्ट्रीय एटलस (23 क्षेत्र व 119 जिले)',
      s06Title: 'क्षेत्र और जिले के अनुसार संपूर्ण एटलस',
      s06Lead: 'जलवायु जोखिम मानचित्रण और प्राथमिकता हस्तक्षेप।',
      s07Eyebrow: '07 · राष्ट्रीय जलवायु तैयारी एवं लचीलापन योजना 2027–2028',
      s07Title: 'राष्ट्रीय तैयारी व लचीलापन योजना 2027–2028',
      s07Lead: '5D जोखिम स्कोरिंग, MGA/USD/EUR बजट, 13-संस्था शासन और NGO रजिस्ट्री।',
      s08Eyebrow: '08 · बहु-स्तरीय आर्थिक हानि मूल्यांकन',
      s08Title: 'आर्थिक नुकसान का आकलन: मेडागास्कर, हिंद महासागर और अफ्रीका',
      s08Lead: 'प्रत्यक्ष कृषि हानि और ऊर्जा/बुनियादी ढांचे पर अप्रत्यक्ष प्रभाव।',
      s09Eyebrow: '09 · Gemini AI हब · चैट, सर्च, मैप्स और लाइव आवाज़ Indri indri',
      s09Title: 'Gemini इंटेलिजेंस हब: चैट, वेब सर्च, मैप्स और लाइव आवाज़',
      s09Lead: 'हिंदी, अंग्रेजी, फ्रेंच सहित 9 प्रमुख विश्व भाषाओं में प्रश्न पूछें या लाइव आवाज़ में बात करें।',
      s10Eyebrow: '10 · सहकारी सहायता डेस्क और वित्तपोषण',
      s10Title: 'सहकारी सलाहकार सिम्युलेटर और सहायता निर्देशिका',
      s10Lead: 'अपने क्षेत्र और फसल के लिए बुवाई समय और वित्तपोषण डेस्क देखें।',
      s11Eyebrow: '11 · वैश्विक मानचित्रण · 195 UN देश, महाद्वीप, क्षेत्र, भाषाएँ और 2028–2032 पूर्वानुमान',
      s11Title: 'वैश्विक अल नीनो वेधशाला: 195 देश, महाद्वीप, भाषाएँ और 2028–2032 पूर्वानुमान',
      s11Lead: 'संयुक्त राष्ट्र के सभी 195 देशों, 5/6/7 महाद्वीप मॉडल, 12 जलवायु क्षेत्रों, सर्वाधिक बोली जाने वाली भाषाओं और 2028–2032 के आर्थिक व मौसम पूर्वानुमानों का पूर्ण विवरण।',
    },
    economic: {
      disclaimerTitle: 'अवलोकित बनाम मॉडल डेटा का स्पष्ट विभाजन:',
      horizonLabel: 'विश्लेषण वर्ष',
      year2027Btn: '2027 · अल नीनो झटका',
      year2028Btn: '2028 · ला नीना संक्रमण',
      scenarioLabel: 'जलवायु परिदृश्य',
      scopeLabel: 'दायरा',
      scope119: '119 जिले (पूर्ण)',
      scope42: '42 पायलट जिले',
      currencyLabel: 'मुद्रा',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'मेडागास्कर कुल हानि',
      kpiDirectVsIndirect: 'प्रत्यक्ष कृषि बनाम अप्रत्यक्ष',
      kpiCoi: 'हिंद महासागर (COI)',
      kpiAfrica: 'अफ्रीका अनुमान (SADC / COMESA)',
      tabProvinces: '1. 6 पूर्व प्रांत',
      tabRegions: '2. 23 आधिकारिक क्षेत्र',
      tabDistricts: '3. 42 मॉडल जिले',
      tabContinental: '4. हिंद महासागर और अफ्रीका',
    },
    assistant: {
      tabChat: 'मल्टी-टर्न चैटबॉट (Gemini)',
      tabSearch: 'लाइव वेब निगरानी (Google Search)',
      tabMaps: 'स्थान और लॉजिस्टिक्स (Google Maps)',
      tabLive: 'लाइव आवाज़ · Indri indri',
      openIndriVoiceBtn: 'Indri indri से बात करें (Live)',
      roleLabel: 'विशेषज्ञ भूमिका',
      roles: {
        agronome: { label: 'FOFIFA कृषि वैज्ञानिक', desc: 'बुवाई कैलेंडर, Zaï, SCV, SRI व फसल लचीलापन।' },
        economiste: { label: 'वैश्विक ENSO अर्थशास्त्री', desc: '195 देशों में GDP हानि, खाद्य मुद्रास्फीति व ऊर्जा दबाव।' },
        humanitaire: { label: 'मानवीय समन्वयक', desc: 'पूर्व चेतावनी, खाद्य संकट और जलवायु विस्थापन।' },
      },
      groundingModeLabel: 'डेटा स्रोत',
      groundingModes: { none: 'प्रत्यक्ष (वेधशाला)', googleSearch: 'Google Search', googleMaps: 'Google Maps' },
      speedLabel: 'Gemini मॉडल',
      speedStandard: 'gemini-4-hydrogen (पूर्ण)',
      speedFast: 'gemini-3.1-flash-lite (तेज़)',
      anchorLocationLabel: 'भौगोलिक संदर्भ',
      useMyGps: 'मेरा GPS',
      gpsActive: 'GPS सक्रिय',
      gpsError: 'GPS उपलब्ध नहीं।',
      resetChat: 'नई बातचीत',
      inputPlaceholderChat: 'भारत, मेडागास्कर, 195 देशों या 2028–2032 के पूर्वानुमान पूछें...',
      inputPlaceholderSearch: 'WMO, NOAA, FAO या मानसून अपडेट खोजें...',
      inputPlaceholderMaps: 'कृषि बाज़ार, अनाज गोदाम या बांध खोजें...',
      sendBtn: 'भेजें',
      searchingBtn: 'विश्लेषण',
      loadingText: 'Gemini से उत्तर प्राप्त हो रहा है...',
      webSourcesTitle: 'सत्यापित वेब स्रोत',
      mapPlacesTitle: 'Google Maps स्थान',
      mapReviewsTitle: 'फ़ील्ड नोट्स',
      openInMaps: 'Google Maps में खोलें',
      floatingLabel: 'Gemini AI · चैट',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'चैट · Search & Maps',
      chatStarters: [
        '2027–2031 के दौरान भारत के मानसून/चावल निर्यात और मेडागास्कर पर प्रभाव की तुलना करें।',
        '2028–2032 के लिए वैश्विक जलवायु और आर्थिक पूर्वानुमान क्या हैं?',
        'Oxford Economics के $4 ट्रिलियन GDP हानि अनुमान का विश्लेषण करें।',
      ],
      searchPresets: [
        'WMO / NOAA अल नीनो 2026–2027 और भारतीय मानसून बुलेटिन',
        'वैश्विक चावल व गेहूं की कीमतें FAO 2026',
        'दक्षिणी अफ्रीका व मेडागास्कर खाद्य सुरक्षा',
        'हीटवेव और चक्रवात 2027–2028 अपडेट',
      ],
      mapsPresets: [
        'प्रमुख कृषि मंडियाँ और भंडारण गोदाम',
        'जलविद्युत बांध और सिंचाई परियोजनाएँ',
        'मौसम केंद्र और कृषि अनुसंधान संस्थान',
        'बंदरगाह और राहत आपूर्ति केंद्र',
      ],
    },
    footer: {
      sourcesTitle: 'वैज्ञानिक और संस्थागत स्रोत',
      sourcesSubtitle: 'WMO, NOAA, UN, Dartmouth, Oxford Economics और FAO के डेटा पर आधारित।',
      copyright: 'Madagascar El Niño Observatory · वैश्विक वेधशाला 2026–2032',
    },
  },

  ru: {
    brandName: 'Madagascar El Niño Observatory',
    brandSubtitle: 'Обсерватория климата, экономики и продовольственной устойчивости',
    nav: {
      mechanism: 'Механизм',
      indianOcean: 'Инд. океан',
      africa: 'Африка',
      worldObservatory: 'Мир (195)',
      mlModel: 'ML-модель',
      atlas: 'Атлас 23',
      nationalPlan: 'Нац. план',
      economicLoss: 'Потери',
      geminiHub: 'Gemini AI',
      cooperatives: 'Кооперативы',
      ctaAdvisor: 'Гид кооп.',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
    },
    hero: {
      eyebrow: 'Madagascar El Niño Observatory · Глобальное досье · ВМО / ФАО / SWIOCOF-15',
      title: 'Супер Эль-Ниньо 2026–2027 и прогноз 2028–2032: климат, экономика и продовольствие',
      lead: 'От засухи на юге Мадагаскара и в Южной Африке до ливней в Восточной Африке и сбоев в Южной Америке: платформа объединяет ML-модели, 195 стран ООН и Gemini AI с поиском и картами Google.',
      primaryCta: 'Календари FOFIFA 2026–2027',
      secondaryCta: 'Симуляция района',
      aiCta: 'Открыть Gemini AI',
      tones: { amber: 'Тепловая тревога', crimson: 'Критич. порог', cobalt: 'Давление рынка', neutral: 'Наблюдение' },
    },
    sections: {
      s01Eyebrow: '01 · Цикл ЭНЮК (ENSO) и океан-атмосфера',
      s01Title: 'Физический механизм Супер Эль-Ниньо 2026–2027',
      s01Lead: 'Ослабление пассатов, смещение тёплых вод на восток и положительный диполь ИОД+.',
      s02Eyebrow: '02 · Мадагаскар и юго-запад Индийского океана',
      s02Title: 'Асимметрия осадков на Мадагаскаре и уязвимость островов',
      s02Lead: 'Острый водный дефицит на юге против ливней и циклонов на северо-востоке.',
      s03Eyebrow: '03 · Африка, региональные блоки и мировые рынки',
      s03Title: 'Последствия для Африки, SADC, COMESA и цен на зерно',
      s03Lead: 'Контраст засухи на юге, паводков на востоке и мировой продовольственной инфляции.',
      s04Eyebrow: '04 · Машинное обучение (RF, LSTM, XGBoost) · 2027–2028',
      s04Title: 'Пространственное моделирование, Google Maps и QLoRA / RAG',
      s04Lead: 'Детализация по районам, кросс-валидация и агрономический синтез Gemini.',
      s05Eyebrow: '05 · Адаптация сельского хозяйства и календари FOFIFA',
      s05Title: 'Устойчивые сроки сева и агроэкологические практики',
      s05Lead: 'Короткоцикловые культуры, ямы Zaï, SCV и система интенсивного риса SRI.',
      s06Eyebrow: '06 · Национальный атлас Мадагаскара (23 региона, 119 районов)',
      s06Title: 'Полный территориальный атлас рисков',
      s06Lead: 'Национальный профиль угроз и приоритетные меры защиты.',
      s07Eyebrow: '07 · Национальный план готовности и устойчивости 2027–2028',
      s07Title: 'Национальный план климатической устойчивости 2027–2028',
      s07Lead: '5D-оценка риска, бюджет MGA/USD/EUR, управление 13 структур и реестр НПО.',
      s08Eyebrow: '08 · Многоуровневая оценка экономических потерь',
      s08Title: 'Оценка ущерба: Мадагаскар, Индийский океан и Африка',
      s08Lead: 'Прямые потери урожая и косвенные эффекты в энергетике и инфраструктуре.',
      s09Eyebrow: '09 · Центр Gemini AI · Чат, Поиск, Карты и Голос Indri indri',
      s09Title: 'Интеллект-центр Gemini: чат, Google Search, Maps и живой голос',
      s09Lead: 'Задавайте вопросы на русском или любом из 9 мировых языков текстом или голосом.',
      s10Eyebrow: '10 · Поддержка кооперативов и гранты',
      s10Title: 'Симулятор кооператива и справочник фондов',
      s10Lead: 'Рекомендуемые окна сева и доступ к финансированию.',
      s11Eyebrow: '11 · Глобальная модель · 195 стран ООН, континенты, зоны, языки и прогноз 2028–2032',
      s11Title: 'Мировая обсерватория Эль-Ниньо: 195 стран, континенты, языки и прогноз 2028–2032',
      s11Lead: 'Полная детализация по 195 государствам ООН, моделям 5/6/7 континентов, 12 климатическим зонам, основным языкам мира и многолетнему прогнозу 2028–2032 гг.',
    },
    economic: {
      disclaimerTitle: 'Чёткое разделение факта и модели:',
      horizonLabel: 'Горизонт',
      year2027Btn: '2027 · Шок Эль-Ниньо',
      year2028Btn: '2028 · Переход Ла-Нинья',
      scenarioLabel: 'Климатический сценарий',
      scopeLabel: 'Охват',
      scope119: '119 районов (все)',
      scope42: '42 пилотных района',
      currencyLabel: 'Валюта',
      exportCsv: 'CSV',
      kpiMadagascarTotal: 'Совокупные потери Мадагаскара',
      kpiDirectVsIndirect: 'Прямые с/х vs Косвенные',
      kpiCoi: 'Индийский океан (COI)',
      kpiAfrica: 'Прогноз по Африке (SADC / COMESA)',
      tabProvinces: '1. 6 провинций',
      tabRegions: '2. 23 региона',
      tabDistricts: '3. 42 района модели',
      tabContinental: '4. Инд. океан и Африка',
    },
    assistant: {
      tabChat: 'Мульти-чат (Gemini)',
      tabSearch: 'Веб-мониторинг (Google Search)',
      tabMaps: 'Локации (Google Maps)',
      tabLive: 'Живой голос · Indri indri',
      openIndriVoiceBtn: 'Говорить с Indri indri',
      roleLabel: 'Роль эксперта',
      roles: {
        agronome: { label: 'Агроном FOFIFA', desc: 'Сроки сева, Zaï, SCV, SRI и устойчивые культуры.' },
        economiste: { label: 'Глобальный макроэкономист', desc: 'Потери ВВП 195 стран, инфляция продовольствия и гидроэнергия.' },
        humanitaire: { label: 'Гуманитарный координатор', desc: 'Раннее предупреждение, продовольственная безопасность и миграция.' },
      },
      groundingModeLabel: 'Источник данных',
      groundingModes: { none: 'База обсерватории', googleSearch: 'Google Search', googleMaps: 'Google Maps' },
      speedLabel: 'Модель Gemini',
      speedStandard: 'gemini-4-hydrogen (Полная)',
      speedFast: 'gemini-3.1-flash-lite (Быстрая)',
      anchorLocationLabel: 'Опорная локация',
      useMyGps: 'Мой GPS',
      gpsActive: 'GPS активен',
      gpsError: 'GPS недоступен.',
      resetChat: 'Новый чат',
      inputPlaceholderChat: 'Спросите о любой из 195 стран, континенте, Мадагаскаре или прогнозе 2028–2032...',
      inputPlaceholderSearch: 'Поиск бюллетеней ВМО, NOAA, ФАО...',
      inputPlaceholderMaps: 'Поиск агрорынков, зернохранилищ, ГЭС...',
      sendBtn: 'Отправить',
      searchingBtn: 'Анализ',
      loadingText: 'Запрос к Gemini...',
      webSourcesTitle: 'Проверенные веб-источники',
      mapPlacesTitle: 'Объекты Google Maps',
      mapReviewsTitle: 'Полевые заметки',
      openInMaps: 'Открыть в Google Maps',
      floatingLabel: 'Gemini AI · Чат',
      drawerTitle: 'Madagascar El Niño Observatory AI',
      drawerSubtitle: 'Чат · Search & Maps',
      chatStarters: [
        'Сравни экономический эффект Эль-Ниньо 2027–2031 для Евразии, Африки и Латинской Америки.',
        'Каков прогноз Oxford Economics на 2031 год (~$4 трлн потерь мирового ВВП)?',
        'Что ожидается в 2028–2032 годах при переходе к Ла-Нинья и новом потеплении?',
      ],
      searchPresets: [
        'Последний бюллетень ВМО / NOAA по Эль-Ниньо 2026–2027',
        'Мировые цены на зерно и рис ФАО 2026',
        'Продовольственный кризис в Африке FEWS NET',
        'Климатические риски Евразии и Центральной Азии 2027–2030',
      ],
      mapsPresets: [
        'Крупные агрорынки и зернохранилища',
        'ГЭС и ирригационные плотины',
        'Метеостанции и научные центры',
        'Порты и логистические узлы',
      ],
    },
    footer: {
      sourcesTitle: 'Научные и институциональные источники',
      sourcesSubtitle: 'По материалам ВМО, NOAA, ООН, Дартмута, Oxford Economics и ФАО.',
      copyright: 'Madagascar El Niño Observatory · Мировая обсерватория 2026–2032',
    },
  },
};

export interface WorldActionLabels {
  chartsNav: string;
  proj2832Nav: string;
  riskMapNav: string;
  simNav: string;
  reportShort: string;
  workspaceShort: string;
  reportFullCta: string;
  charts2627: string;
  saveSnapshot: string;
  savedOk: string;
  liveStationsLabel: string;
  refreshBtn: string;
  pdfSummaryBtn: string;
  midnightAutoOn: string;
  midnightAutoOff: string;
  scrapeNowBtn: string;
  scrapingNow: string;
  syncedCountriesLabel: string;
}

export const WORLD_ACTION_LABELS: Record<WorldLanguageCode, WorldActionLabels> = {
  fr: {
    chartsNav: 'Graphes',
    proj2832Nav: '2028–32',
    riskMapNav: 'Carte Risques',
    simNav: 'Simulateur',
    reportShort: 'Rapport',
    workspaceShort: 'Espace / Compte',
    reportFullCta: 'Exporter Rapport (PDF · Word · Excel)',
    charts2627: 'Graphes 2026–2027',
    saveSnapshot: 'Sauvegarder en base',
    savedOk: 'Enregistré Firestore',
    liveStationsLabel: 'Stations Météo Live (Open-Meteo)',
    refreshBtn: 'Actualiser',
    pdfSummaryBtn: 'Résumé Climat & Prévisions (PDF)',
    midnightAutoOn: 'MÀJ Auto Minuit (00:00) : ACTIVÉE',
    midnightAutoOff: 'MÀJ Auto Minuit (00:00) : DÉSACTIVÉE',
    scrapeNowBtn: 'Web-Scraper & Recalibrer (195 pays)',
    scrapingNow: 'Scraping mondial en cours…',
    syncedCountriesLabel: '195 pays · 23 régions · 6 provinces · 6 continents recalibrés',
  },
  en: {
    chartsNav: 'Charts',
    proj2832Nav: '2028–32',
    riskMapNav: 'Risk Map',
    simNav: 'Simulator',
    reportShort: 'Report',
    workspaceShort: 'Workspace',
    reportFullCta: 'Export Report (PDF · Word · Excel)',
    charts2627: '2026–2027 Charts',
    saveSnapshot: 'Save to Database',
    savedOk: 'Saved to Firestore',
    liveStationsLabel: 'Live Weather Stations (Open-Meteo)',
    refreshBtn: 'Refresh',
    pdfSummaryBtn: 'Climate & Forecast Summary (PDF)',
    midnightAutoOn: 'Midnight Auto-Update (00:00): ON',
    midnightAutoOff: 'Midnight Auto-Update (00:00): OFF',
    scrapeNowBtn: 'Web-Scrape & Recalibrate (195)',
    scrapingNow: 'Scraping global feeds…',
    syncedCountriesLabel: '195 countries · 23 regions · 6 provinces · 6 continents synced',
  },
  sw: {
    chartsNav: 'Chati',
    proj2832Nav: '2028–32',
    riskMapNav: 'Ramani',
    simNav: 'Kiigaji',
    reportShort: 'Ripoti',
    workspaceShort: 'Akaunti / Hifadhi',
    reportFullCta: 'Pakua Ripoti (PDF · Word · Excel)',
    charts2627: 'Chati 2026–2027',
    saveSnapshot: 'Hifadhi Hifadhidata',
    savedOk: 'Imehifadhiwa Firestore',
    liveStationsLabel: 'Vituo vya Hali ya Hewa Hai',
    refreshBtn: 'Sasisha',
    pdfSummaryBtn: 'Muhtasari wa Tabianchi & Utabiri (PDF)',
    midnightAutoOn: 'Sasisho la Usiku (00:00): LIMEWASHWA',
    midnightAutoOff: 'Sasisho la Usiku (00:00): LIMEZIMWA',
    scrapeNowBtn: 'Chota Mtandaoni & Sawazisha (195)',
    scrapingNow: 'Inachota data za dunia…',
    syncedCountriesLabel: 'Nchi 195 · Mikoa 23 · Mabara 6 yamesawazishwa',
  },
  es: {
    chartsNav: 'Gráficos',
    proj2832Nav: '2028–32',
    riskMapNav: 'Mapa Riesgos',
    simNav: 'Simulador',
    reportShort: 'Informe',
    workspaceShort: 'Espacio / Cuenta',
    reportFullCta: 'Exportar Informe (PDF · Word · Excel)',
    charts2627: 'Gráficos 2026–2027',
    saveSnapshot: 'Guardar en BD',
    savedOk: 'Guardado en Firestore',
    liveStationsLabel: 'Estaciones en Vivo (Open-Meteo)',
    refreshBtn: 'Actualizar',
    pdfSummaryBtn: 'Resumen Clima y Previsiones (PDF)',
    midnightAutoOn: 'Auto-Act. Medianoche (00:00): ACTIVA',
    midnightAutoOff: 'Auto-Act. Medianoche (00:00): INACTIVA',
    scrapeNowBtn: 'Scraping Web y Recalibrar (195)',
    scrapingNow: 'Extrayendo datos globales…',
    syncedCountriesLabel: '195 países · 23 regiones · 6 continentes recalibrados',
  },
  ar: {
    chartsNav: 'الرسوم',
    proj2832Nav: '2028–32',
    riskMapNav: 'خريطة المخاطر',
    simNav: 'المحاكي',
    reportShort: 'التقرير',
    workspaceShort: 'الحساب والبيانات',
    reportFullCta: 'تصدير التقرير (PDF · Word · Excel)',
    charts2627: 'رسوم 2026–2027',
    saveSnapshot: 'حفظ في قاعدة البيانات',
    savedOk: 'تم الحفظ في Firestore',
    liveStationsLabel: 'محطات الطقس المباشرة',
    refreshBtn: 'تحديث',
    pdfSummaryBtn: 'ملخص المناخ والتوقعات (PDF)',
    midnightAutoOn: 'التحديث التلقائي منتصف الليل: مفعّل',
    midnightAutoOff: 'التحديث التلقائي منتصف الليل: معطّل',
    scrapeNowBtn: 'جمع البيانات وإعادة المعايرة (195)',
    scrapingNow: 'جارٍ سحب البيانات العالمية…',
    syncedCountriesLabel: 'تمت معايرة 195 دولة و23 إقليماً و6 قارات',
  },
  zh: {
    chartsNav: '图表',
    proj2832Nav: '2028–32',
    riskMapNav: '风险地图',
    simNav: '情景模拟',
    reportShort: '科学报告',
    workspaceShort: '工作区/账户',
    reportFullCta: '导出报告 (PDF · Word · Excel)',
    charts2627: '2026–2027 图表',
    saveSnapshot: '保存到数据库',
    savedOk: '已存至 Firestore',
    liveStationsLabel: '实时气象站监测 (Open-Meteo)',
    refreshBtn: '刷新',
    pdfSummaryBtn: '气候实况与预测摘要 (PDF)',
    midnightAutoOn: '每日零点自动更新 (00:00): 开启',
    midnightAutoOff: '每日零点自动更新 (00:00): 关闭',
    scrapeNowBtn: '全球抓取与参数重校准 (195国)',
    scrapingNow: '正在抓取全球数据…',
    syncedCountriesLabel: '已完成 195国 · 23大区 · 6大洲参数重校准',
  },
  pt: {
    chartsNav: 'Gráficos',
    proj2832Nav: '2028–32',
    riskMapNav: 'Mapa Riscos',
    simNav: 'Simulador',
    reportShort: 'Relatório',
    workspaceShort: 'Espaço / Conta',
    reportFullCta: 'Exportar Relatório (PDF · Word · Excel)',
    charts2627: 'Gráficos 2026–2027',
    saveSnapshot: 'Salvar na Base',
    savedOk: 'Salvo no Firestore',
    liveStationsLabel: 'Estações ao Vivo (Open-Meteo)',
    refreshBtn: 'Atualizar',
    pdfSummaryBtn: 'Resumo Climático e Previsões (PDF)',
    midnightAutoOn: 'Atualização à Meia-Noite (00:00): ATIVA',
    midnightAutoOff: 'Atualização à Meia-Noite (00:00): INATIVA',
    scrapeNowBtn: 'Web-Scraping & Recalibrar (195)',
    scrapingNow: 'Extraindo dados globais…',
    syncedCountriesLabel: '195 países · 23 regiões · 6 continentes recalibrados',
  },
  hi: {
    chartsNav: 'चार्ट',
    proj2832Nav: '2028–32',
    riskMapNav: 'जोखिम मानचित्र',
    simNav: 'सिम्युलेटर',
    reportShort: 'रिपोर्ट',
    workspaceShort: 'कार्यक्षेत्र / खाता',
    reportFullCta: 'रिपोर्ट निर्यात (PDF · Word · Excel)',
    charts2627: '2026–2027 चार्ट',
    saveSnapshot: 'डेटाबेस में सहेजें',
    savedOk: 'Firestore में सहेजा गया',
    liveStationsLabel: 'लाइव मौसम स्टेशन (Open-Meteo)',
    refreshBtn: 'ताज़ा करें',
    pdfSummaryBtn: 'जलवायु एवं पूर्वानुमान सारांश (PDF)',
    midnightAutoOn: 'मध्यरात्रि ऑटो-अपडेट (00:00): चालू',
    midnightAutoOff: 'मध्यरात्रि ऑटो-अपडेट (00:00): बंद',
    scrapeNowBtn: 'वेब-स्क्रैप एवं पुनर्गणना (195 देश)',
    scrapingNow: 'वैश्विक डेटा एकत्र हो रहा है…',
    syncedCountriesLabel: '195 देश · 23 क्षेत्र · 6 महाद्वीप अद्यतन',
  },
  ru: {
    chartsNav: 'Графики',
    proj2832Nav: '2028–32',
    riskMapNav: 'Карта рисков',
    simNav: 'Симулятор',
    reportShort: 'Отчёт',
    workspaceShort: 'Кабинет / БД',
    reportFullCta: 'Экспорт отчёта (PDF · Word · Excel)',
    charts2627: 'Графики 2026–2027',
    saveSnapshot: 'Сохранить в БД',
    savedOk: 'Сохранено в Firestore',
    liveStationsLabel: 'Метеостанции онлайн (Open-Meteo)',
    refreshBtn: 'Обновить',
    pdfSummaryBtn: 'Сводка климата и прогнозов (PDF)',
    midnightAutoOn: 'Автообновление в 00:00: ВКЛ',
    midnightAutoOff: 'Автообновление в 00:00: ВЫКЛ',
    scrapeNowBtn: 'Веб-скрапинг и пересчёт (195)',
    scrapingNow: 'Сбор мировых данных…',
    syncedCountriesLabel: '195 стран · 23 региона · 6 континентов пересчитаны',
  },
};

export function getWorldLangDisplayName(code: WorldLanguageCode): string {
  return WORLD_LANGUAGE_OPTIONS.find((o) => o.code === code)?.nativeName ?? 'Français';
}

interface LanguageContextValue {
  lang: LanguageCode;
  worldLang: WorldLanguageCode;
  isRtl: boolean;
  setLang: (lang: LanguageCode | WorldLanguageCode) => void;
  t: TranslationsBundle;
  ui: UiTranslations;
  actions: WorldActionLabels;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_LANG_KEY = 'observatory-world-lang';

function readInitialWorldLang(): WorldLanguageCode {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_LANG_KEY);
      if (saved && WORLD_LANGUAGE_OPTIONS.some((o) => o.code === saved)) {
        return saved as WorldLanguageCode;
      }
    }
  } catch {
    // Ignore storage read errors in restricted iframe/private contexts
  }
  return 'fr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [worldLang, setWorldLang] = useState<WorldLanguageCode>(readInitialWorldLang);
  const coreLang = toCoreLanguage(worldLang);
  const isRtl = worldLang === 'ar';

  useEffect(() => {
    document.documentElement.lang = worldLang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    try {
      window.localStorage?.setItem(STORAGE_LANG_KEY, worldLang);
    } catch {
      // Ignore storage write errors
    }
  }, [worldLang, isRtl]);

  return (
    <LanguageContext.Provider
      value={{
        lang: coreLang,
        worldLang,
        isRtl,
        setLang: (next) => setWorldLang(next),
        t: DICTIONARIES[worldLang],
        ui: UI_TRANSLATIONS[coreLang],
        actions: WORLD_ACTION_LABELS[worldLang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return ctx;
}
