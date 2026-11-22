import type { LanguageCode } from './LanguageContext';

export interface UiTranslations {
  common: {
    close: string;
    reset: string;
    exportCsv: string;
    copy: string;
    copied: string;
    searchPlaceholder: string;
    all: string;
    regions: string;
    district: string;
    region: string;
    horizon: string;
    year2027: string;
    year2028: string;
  };
  header: {
    navAria: string;
    langSwitcherAria: string;
    mobileMenuAria: string;
  };
  hero: {
    fig1Alt: string;
    fig1Caption: string;
  };
  mechanism: {
    phaseSelectorAria: string;
    elNinoTab: string;
    laNinaTab: string;
    elNinoStatusLabel: string;
    laNinaStatusLabel: string;
    svgTitle: string;
    svgSubtitleElNino: string;
    svgSubtitleLaNina: string;
    svgAriaElNino: string;
    svgAriaLaNina: string;
    westAsiaLabel: string;
    eastPeruLabel: string;
    elNinoConvection: string;
    elNinoTradeWinds: string;
    elNinoWarmWater: string;
    elNinoUpwelling: string;
    laNinaConvection: string;
    laNinaTradeWinds: string;
    laNinaColdWater: string;
    laNinaUpwelling: string;
    lonWest: string;
    lonCenter: string;
    lonEast: string;
    summaryTradeWinds: string;
    summarySurfaceWater: string;
    summaryRainStorms: string;
    natureMedTag: string;
    natureMedText: string;
    tableTitle: string;
    tabCompare: string;
    tabGlobal: string;
    criterionCol: string;
    elNinoCol: string;
    laNinaCol: string;
    regionCol: string;
    effectsCol: string;
    dominantRiskCol: string;
    riskLabels: {
      flood: string;
      drought: string;
      thermal: string;
    };
  };
  madagascar: {
    severityLabels: {
      Critique: string;
      'Élevé': string;
      Vigilance: string;
    };
    mapHeading: string;
    mapSubtitle: string;
    mapAria: string;
    zoneNames: {
      nord: string;
      nordOuest: string;
      centreEst: string;
      sudEst: string;
      grandSud: string;
    };
    eastShiftNote: string;
    legendCritical: string;
    legendHigh: string;
    legendWatch: string;
    legendCyclone: string;
    zoneHint: string;
    regionsConcerned: string;
    rainfallSignal: string;
    thermalAnomaly: string;
    majorRisk: string;
    emergencyMeasures: string;
    cycloneTag: string;
    cycloneText: string;
    fig2Alt: string;
    fig2Caption: string;
    fig3Alt: string;
    fig3Caption: string;
  };
  africa: {
    filters: {
      all: string;
      sadc: string;
      comesa: string;
      sahel: string;
      'nord-centrale': string;
    };
    perimeterLabel: string;
    climateSignalLabel: string;
    agriEnergyLabel: string;
    emergencyMeasuresLabel: string;
    riceTitle: string;
    riceSubtitle: string;
    riceChartAria: string;
    riceBaselineNote: string;
    commoditiesTitle: string;
    commodityCol: string;
    regionsCol: string;
    mechanismCol: string;
    pressureCol: string;
  };
  ml: {
    chartTitle: string;
    chartSubtitle: string;
    lagBadge: string;
    chartAria: string;
    legendOni: string;
    legendShock: string;
    noteLabel: string;
    clusteringTitle: string;
    clusteringText: string;
    xgboostTitle: string;
    xgboostText: string;
    simTitle: string;
    simSubtitle: string;
    presets: {
      sud: string;
      hautesTerres: string;
      laNina: string;
    };
    oniLabel: string;
    iodLabel: string;
    rainLabel: string;
    regimeClassified: string;
    regimeLaNina: string;
    regimeSuperElNino: string;
    regimeModerate: string;
    regimeNormal: string;
    projectedMaize: string;
    estimatedAgriGdp: string;
    inflationLabel: string;
    waterRestored: string;
    waterDeficit: string;
    tabs: {
      filieres: string;
      hydroDistricts: string;
      madagascar2027: string;
      africa2027: string;
      patterns: string;
      hybridRag: string;
      python: string;
    };
    filieresBanner: string;
    scenario2027Label: string;
    scenario2028Label: string;
    districtsIncludedLabel: string;
    impact2027Label: string;
    impact2028Label: string;
    centroidsLabel: string;
    madagascarCardPrefix: string;
    horizonCol: string;
    criticalSignalCol: string;
    africaWeatherLabel: string;
    africaEcoLabel: string;
    patternsCols: {
      indicator: string;
      neutral: string;
      elNino: string;
      impact: string;
    };
    etlTitle: string;
    etlCols: {
      source: string;
      access: string;
      variables: string;
      role: string;
    };
    antiOverfitTitle: string;
    antiOverfitSubtitle: string;
    antiOverfitCols: {
      param: string;
      val: string;
      role: string;
    };
    hybridStackTitle: string;
    hybridCols: {
      layer: string;
      role: string;
      sources: string;
      impl: string;
    };
    orchestrationTitle: string;
    orchestrationQuestionLabel: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    codeIntro: string;
    scriptTabs: {
      geoXgboost: string;
      qloraJsonl: string;
      folium: string;
      normalizer: string;
      rag: string;
      power: string;
      rf: string;
    };
    scriptTitles: Record<string, string>;
    copyCode: string;
    copiedCode: string;
  };
  districtStudio: {
    cropLabels: {
      rice: string;
      maize: string;
      exportCrop: string;
    };
    yieldBadges: {
      collapse: string;
      severeDrop: string;
      decline: string;
      recovery: string;
    };
    riskTiers: {
      drought: string;
      mixed: string;
      flood: string;
    };
    eyebrow: string;
    title: string;
    subtitle: string;
    year2027Btn: string;
    year2028Btn: string;
    qloraBtn: string;
    downloadJsonlBtn: string;
    qloraTitle: string;
    qloraSubtitle: string;
    qloraHyperTitle: string;
    qloraColParam: string;
    qloraColVal: string;
    qloraColDetail: string;
    qloraPreviewLabel: string;
    mapCardTitle: string;
    mapCardSubtitle: string;
    googleMapsBtn: string;
    svgSchemaBtn: string;
    layerModeLabel: string;
    layerYieldBtn: string;
    layerRiskBtn: string;
    legendSevere: string;
    legendMod: string;
    legendRebound: string;
    legendDrought: string;
    legendMixed: string;
    legendFlood: string;
    geoNormTitle: string;
    geoNormText: string;
    regionPrefix: string;
    yieldColPrefix: string;
    waterAnomalyLabel: string;
    oniIndexLabel: string;
    oniValue2027: string;
    oniValue2028: string;
    ragNotesTitle: string;
    geminiDiagnosticTitle: string;
    geminiDiagnosticSubtitle: string;
    customQuestionLabel: string;
    customQuestionPlaceholder: string;
    askGeminiBtn: string;
    askGeminiLoading: string;
    copyDiagnostic: string;
    emptyDiagnosticText: string;
    loadingDiagnosticText: string;
    errorDiagnosticPrefix: string;
    indriStarting: string;
    indriDone: string;
    systemPromptJsonl: string;
  };
  maps: {
    missingKeyTitle: string;
    waitingKeyTitle: string;
    waitingKeyDesc: string;
    terrainBtn: string;
    roadmapBtn: string;
    satelliteBtn: string;
    recenterTitle: string;
    selectedWaterLabel: string;
    selectedRiskLabel: string;
    geminiDiagBtn: string;
  };
  calendars: {
    months: string[];
    smsTitle: string;
    smsBody: string;
    regionsPrefix: string;
    triggerTitle: string;
    cyclePrefix: string;
    priorityCropsTitle: string;
    associationsTitle: string;
    waterSoilTitle: string;
    transversalTitle: string;
    transversalText: string;
  };
  atlas: {
    groupFilters: {
      all: string;
      'grand-sud': string;
      'sud-est-est': string;
      'nord-nord-ouest': string;
      'hautes-terres': string;
    };
    riskVisualLabels: {
      drought: string;
      mixed: string;
      flood: string;
    };
    pillar1Eyebrow: string;
    pillar1Title: string;
    pillar1Body: string;
    pillar2Eyebrow: string;
    pillar2Title: string;
    pillar2Body: string;
    pillar3Eyebrow: string;
    pillar3Title: string;
    pillar3Body: string;
    tabs: {
      regions: string;
      temporal: string;
      sectors: string;
      preparedness: string;
    };
    searchPlaceholder: string;
    exportCsvBtn: string;
    csvHeaders: string[];
    tableHeaders: {
      num: string;
      regionGroup: string;
      dominantRisk: string;
      effects: string;
      priorityDistricts: string;
    };
    vigilancePrefix: string;
    temporal2027Header: string;
    temporal2028Header: string;
    sectorsTitle: string;
    sectorsColSector: string;
    sectorsColEffects: string;
    sectorsColZones: string;
    domainsTitle: string;
    checklistTitle: string;
    checklistCounter: string;
    leadPrefix: string;
    indicatorsTitle: string;
    indicatorsColInd: string;
    indicatorsColRole: string;
    indicatorsColCadence: string;
    indicatorsColSource: string;
    sourcesTitle: string;
    deliverablesTitle: string;
  };
  plan: {
    riskLevels: {
      low: string;
      moderate: string;
      important: string;
      high: string;
      veryHigh: string;
    };
    meteoBulletinTitle: string;
    meteoBulletinBody: string;
    questionsTitle: string;
    tabs: {
      scoring: string;
      agriculture: string;
      budget: string;
      governance: string;
      roadmap: string;
    };
    pilotSelectLabel: string;
    pilotGroupPrefix: string;
    resetScoresBtn: string;
    dims5Label: string;
    scoreWeightedLabel: string;
    riskClassPrefix: string;
    popRefLabel: string;
    popExposedLabel: string;
    popExposedFormula: string;
    assistNeededLabel: string;
    assistFormula: string;
    classes5Title: string;
    abcdTitle: string;
    schemaTitle: string;
    schemaFieldCol: string;
    schemaContentCol: string;
    chainsTitle: string;
    lossCalcTitle: string;
    lossCalcSubtitle: string;
    areaLabel: string;
    baseYieldLabel: string;
    scenarioShockLabel: string;
    priceMgaLabel: string;
    tonnageLossLabel: string;
    estLossLabel: string;
    seedBudgetLabel: string;
    threeScenTitle: string;
    scenParamCol: string;
    scen1Col: string;
    scen2Col: string;
    scen3Col: string;
    ficheTitle: string;
    ficheDomainCol: string;
    ficheIndCol: string;
    ficheStatusCol: string;
    budgetTitle: string;
    budgetSubtitle: string;
    fxRateLabel: string;
    fxEurLabel: string;
    resetBudgetBtn: string;
    totalUrgencyLabel: string;
    totalResilienceLabel: string;
    totalPlanLabel: string;
    budgetLineCol: string;
    budgetHorizonCol: string;
    budgetQtyCol: string;
    budgetUnitCostCol: string;
    budgetTotalCol: string;
    budget8Title: string;
    fin7Title: string;
    donorsTitle: string;
    govPyramidTitle: string;
    gov13Title: string;
    govActorCol: string;
    govRoleCol: string;
    ngoRegistryTitle: string;
    ngoRegistrySubtitle: string;
    ngoSearchPlaceholder: string;
    ngoExportBtn: string;
    ngoFormTitle: string;
    ngoAddBtn: string;
    ngoPlaceholders: {
      org: string;
      region: string;
      district: string;
      commune: string;
      sector: string;
      beneficiaries: string;
      committedUsd: string;
      unmet: string;
    };
    ngoCols: {
      org: string;
      zone: string;
      sector: string;
      beneficiaries: string;
      committed: string;
      unmet: string;
    };
    phasesTitle: string;
    kpi10Title: string;
    stackTitle: string;
    gapsTitle: string;
    deliverablesTitle: string;
    sequenceTitle: string;
    components8Title: string;
    objectives8Title: string;
  };
  economic: {
    disclaimerBody: string;
    scenarioMeta: Record<string, { label: string; factorLabel: string }>;
    currencyShort: {
      USD: { bn: string; m: string };
      EUR: { bn: string; m: string };
      MGA: { bn: string };
    };
    kpiMadagascarSub: string;
    kpiDirectSub: string;
    kpiCoiSub2027: string;
    kpiCoiSub2028: string;
    kpiAfricaSub2027: string;
    kpiAfricaSub2028: string;
    provincesChartTitle: string;
    provincesChartSubtitle: string;
    legendDirect: string;
    legendIndirect: string;
    provincesTableHeaders: {
      province: string;
      direct: string;
      indirect: string;
      total: string;
      gdpShare: string;
      rice: string;
      maize: string;
      exportCrop: string;
      channel: string;
    };
    balance2028Prefix: string;
    regionsFilterAll: string;
    regionsSortTotal: string;
    regionsSortGdp: string;
    regionsSortName: string;
    regionsHeaders: {
      regionProvince: string;
      districts: string;
      total: string;
      gdpPct: string;
      rice: string;
      maize: string;
      exportCrop: string;
      indirect: string;
    };
    districtsTotalNote: string;
    districtsSearchPlaceholder: string;
    districtsAllProfiles: string;
    districtsAllRegions: string;
    districtsHeaders: {
      district: string;
      regionProv: string;
      profile: string;
      water: string;
      total: string;
      rice: string;
      maize: string;
      exportCrop: string;
      mapAction: string;
    };
    viewOnMapBtn: string;
    continentalStripDirect: string;
    continentalStripIndirect: string;
    continentalStripTotal: string;
    continentalStripGdp: string;
    continentalFilters: {
      all: string;
      COI: string;
      SADC: string;
      COMESA: string;
      Afrique: string;
    };
    continentalChartTitle: string;
    continentalTableHeaders: {
      country: string;
      blocs: string;
      gdp: string;
      direct: string;
      indirect: string;
      total2027: string;
      gdpShare: string;
      bal2028: string;
      signal: string;
    };
  };
  cooperatives: {
    zones: Array<{ id: 'grand-sud' | 'hautes-terres' | 'nord-ouest'; label: string }>;
    crops: Array<{ id: 'mais-sorgho' | 'riz-irrigue' | 'riz-pluvial' | 'vanille-rente'; label: string }>;
    checklistItems: Array<{ id: string; label: string }>;
    selectZoneLabel: string;
    selectCropLabel: string;
    readinessTitle: string;
    tailoredTitle: string;
    windowLabel: string;
    recommendedCropsLabel: string;
    practiceLabel: string;
    deskLabel: string;
    copySummaryBtn: string;
    copiedSummaryBtn: string;
    summaryTemplateTitle: string;
    directoryTitle: string;
    agencyFilters: {
      Tous: string;
      'Guichet national': string;
      'Agence ONU': string;
      'Appui technique': string;
    };
    tableHeaders: {
      org: string;
      role: string;
      action: string;
      contact: string;
    };
  };
  assistantExtra: {
    anchors: Array<{ label: string; lat: number; lon: number }>;
    networkError: string;
    searchError: string;
    mapsError: string;
    responseError: string;
    closeAria: string;
    msgUnit: string;
    modelBadgePrefix: string;
    toolBadgePrefix: string;
    indriChatStarting: string;
    indriChatDone: string;
    indriSearchStarting: string;
    indriSearchDone: string;
    indriMapsStarting: string;
    indriMapsDone: string;
  };
  indriVoice: {
    galleryLabels: Record<string, string>;
    voiceLabels: Record<string, string>;
    stageBadgeSpeaking: string;
    stageBadgeComputing: string;
    stageBadgeListening: string;
    stageAriaLabel: string;
    liveCalcStatus: string;
    scenarioOptions: Record<'S1' | 'S2' | 'S3', string>;
    shortcutPrompts: {
      currentSituation: string;
      ambovombe2027: string;
      compareAmbovombeAlaotra: string;
      africaSadcComesa: string;
    };
    indriActivityIntro: string;
    indriActivityZone: string;
    indriActivityCompare: string;
    indriActivityLiveStart: string;
    indriActivityLiveConnecting: string;
    indriActivityLiveConnected: string;
    indriActivityLiveCalculating: string;
    indriActivityLiveAnswering: string;
  };
}

export const UI_TRANSLATIONS: Record<LanguageCode, UiTranslations> = {
  fr: {
    common: {
      close: 'Fermer',
      reset: 'Réinitialiser',
      exportCsv: 'Exporter CSV',
      copy: 'Copier',
      copied: 'Copié',
      searchPlaceholder: 'Rechercher...',
      all: 'Tous',
      regions: 'Régions',
      district: 'District',
      region: 'Région',
      horizon: 'Horizon',
      year2027: '2027',
      year2028: '2028',
    },
    header: {
      navAria: 'Navigation principale',
      langSwitcherAria: 'Sélecteur de langue',
      mobileMenuAria: 'Menu mobile',
    },
    hero: {
      fig1Alt: 'Graphique comparatif des anomalies thermiques historiques d’El Niño',
      fig1Caption:
        'Fig. 1 — Épisode 2026–2027 (+3,5 à +4,1 °C projeté) comparé aux records historiques du Pacifique équatorial.',
    },
    mechanism: {
      phaseSelectorAria: 'Sélection de la phase ENSO',
      elNinoTab: 'El Niño (2026–2027)',
      laNinaTab: 'La Niña (Phase froide)',
      elNinoStatusLabel: 'Phase chaude active (+3,5 °C à +4,1 °C)',
      laNinaStatusLabel: 'Phase froide inverse (ref. historique)',
      svgTitle: 'Coupe équatoriale de l’océan Pacifique',
      svgSubtitleElNino: 'Alizés affaiblis → les eaux chaudes migrent vers le Pérou, bloquant la remontée froide.',
      svgSubtitleLaNina: 'Alizés renforcés → accumulation des eaux chaudes vers l’Indonésie et upwelling intense.',
      svgAriaElNino: 'Schéma océan-atmosphère El Niño montrant le déplacement des eaux chaudes vers l’Est',
      svgAriaLaNina: 'Schéma océan-atmosphère La Niña montrant le refoulement des eaux chaudes vers l’Ouest',
      westAsiaLabel: 'Ouest / Indonésie',
      eastPeruLabel: 'Est / Pérou',
      elNinoConvection: 'Zone de convection & orages déplacée au centre',
      elNinoTradeWinds: '← Alizés affaiblis ou inversés →',
      elNinoWarmWater: 'Eaux chaudes (+3,5 à +4,1 °C)',
      elNinoUpwelling: 'Upwelling froid bloqué',
      laNinaConvection: 'Convection intense sur l’Ouest & Asie SE',
      laNinaTradeWinds: '←← Alizés puissants d’Est en Ouest ←←',
      laNinaColdWater: 'Langue d’eau froide équatoriale',
      laNinaUpwelling: 'Forte remontée d’eau froide',
      lonWest: '120°E (Asie / Océanie)',
      lonCenter: '180° (Pacifique Central)',
      lonEast: '80°W (Amérique du Sud)',
      summaryTradeWinds: 'Alizés',
      summarySurfaceWater: 'Eaux de surface',
      summaryRainStorms: 'Pluies & orages',
      natureMedTag: 'Santé & Chaleur (Nature Medicine)',
      natureMedText:
        'Un épisode El Niño majeur accroît la température mondiale moyenne et serait associé à plus de 100 000 décès supplémentaires liés à la chaleur extrême chaque année dans les zones tropicales et subtropicales.',
      tableTitle: 'Synthèse scientifique & effets planétaires',
      tabCompare: 'El Niño / La Niña',
      tabGlobal: 'Impacts mondiaux (FAO)',
      criterionCol: 'Critère physique',
      elNinoCol: 'El Niño (Phase chaude)',
      laNinaCol: 'La Niña (Phase froide)',
      regionCol: 'Région',
      effectsCol: 'Effets climatiques et agricoles',
      dominantRiskCol: 'Risque dominant',
      riskLabels: {
        flood: 'Inondations',
        drought: 'Sécheresse',
        thermal: 'Contraste thermique',
      },
    },
    madagascar: {
      severityLabels: {
        Critique: 'Critique',
        Élevé: 'Élevé',
        Vigilance: 'Vigilance',
      },
      mapHeading: 'Cartographie des contrastes régionaux',
      mapSubtitle: 'Sélectionnez une zone pour afficher le diagnostic et les mesures.',
      mapAria: 'Carte schématique des zones de risques climatiques de Madagascar en 2026–2027',
      zoneNames: {
        nord: 'Nord',
        nordOuest: 'Nord-Ouest',
        centreEst: 'Centre & Est',
        sudEst: 'Sud-Est',
        grandSud: 'Grand Sud',
      },
      eastShiftNote: 'Trajectoires cycloniques : décalage est → Rodrigues',
      legendCritical: 'Critique (Sécheresse)',
      legendHigh: 'Élevé (Déficit/Prix)',
      legendWatch: 'Vigilance (Pluies N / Retard NO)',
      legendCyclone: 'Trajectoire cyclonique déviée',
      zoneHint: 'Cliquez sur une zone de la carte pour inspecter les régions concernées.',
      regionsConcerned: 'Régions concernées',
      rainfallSignal: 'Signal pluviométrique',
      thermalAnomaly: 'Anomalie thermique',
      majorRisk: 'Risque majeur (2026–2027)',
      emergencyMeasures: 'Mesures d’urgence déployées',
      cycloneTag: 'Bulletin Cyclonique COI / CycloneOI',
      cycloneText:
        'En lien avec le fort El Niño et le dipôle positif (IOD+), SWIOCOF-15 prévoit une saison 2026–2027 avec globalement moins de cyclones dans le bassin, les trajectoires étant déviées plus à l’est vers Rodrigues.',
      fig2Alt: 'Impact de la sécheresse sur les cultures vivrières dans le Sud malgache',
      fig2Caption: 'Fig. 2 — Sécheresse aiguë et vulnérabilité vivrière (Androy / Anosy).',
      fig3Alt: 'Contraste des excès pluvieux et risques côtiers',
      fig3Caption: 'Fig. 3 — Excès de pluies localisés dans l’Extrême Nord et gestion de l’eau.',
    },
    africa: {
      filters: {
        all: 'Tous les blocs',
        sadc: 'SADC (Afrique australe)',
        comesa: 'COMESA & Corne',
        sahel: 'Sahel & Ouest',
        'nord-centrale': 'Maghreb & Centrale',
      },
      perimeterLabel: 'Périmètre :',
      climateSignalLabel: 'Signal climatique :',
      agriEnergyLabel: 'Impact agricole & énergie :',
      emergencyMeasuresLabel: 'Mesures d’urgence :',
      riceTitle: 'Trajectoire estimée du riz local à Antananarivo (MGA / kg)',
      riceSubtitle: 'Pressions conjointes de l’offre asiatique, du fret, du carburant et des pluies irrégulières.',
      riceChartAria: 'Courbe du prix estimé du riz à Antananarivo jusqu’à 3 200 MGA par kg',
      riceBaselineNote: 'Base juillet 2026 : 2 550 MGA/kg → Pic FEWS NET janv.–fév. 2027 : 3 200 MGA/kg (+25,5 %)',
      commoditiesTitle: 'Impact sur les matières premières et l’hydroélectricité',
      commodityCol: 'Filière / Ressource',
      regionsCol: 'Zones clés',
      mechanismCol: 'Mécanisme',
      pressureCol: 'Pression de marché',
    },
    ml: {
      chartTitle: 'Séries temporelles & décalage (Lag 4–6 mois)',
      chartSubtitle: 'L’indice océanique ONI culmine fin 2026, tandis que le choc agricole LSTM atteint son maximum d’avril à août 2027.',
      lagBadge: 'LSTM · Lag +4 à +6 mois',
      chartAria: 'Graphique comparant l’anomalie El Niño ONI et l’indice de choc agricole retardé sur 2026–2027',
      legendOni: 'Anomalie ONI (°C)',
      legendShock: 'Indice choc récoltes (/100)',
      noteLabel: 'Note :',
      clusteringTitle: 'Clustering Spatial (K-Means)',
      clusteringText:
        'Découpage des 119 districts selon pluviométrie et historique de sécheresse (Grand Sud vs Hautes Terres vs Nord-Est humide).',
      xgboostTitle: 'XGBoost & Random Forest',
      xgboostText:
        'Modèles d’arbres non-linéaires croisant ONI (t-4 mois), dipôle IOD, humidité des sols et température pour estimer rendements et prix.',
      simTitle: 'Simulateur ML 2027 vs 2028',
      simSubtitle: 'Testez l’impact du couple (ONI, IOD) sur le maïs, le PIB agricole et le bilan hydrique.',
      presets: {
        sud: '2027 Choc Sud (+3,5 °C)',
        hautesTerres: '2027 Hautes Terres (+3,2 °C)',
        laNina: '2028 Rebond La Niña (-0,9 °C)',
      },
      oniLabel: 'Indice ONI (t-4 à t-6 mois)',
      iodLabel: 'Dipôle océan Indien (IOD)',
      rainLabel: 'Pluies saisonnières cumulées',
      regimeClassified: 'Régime classifié :',
      regimeLaNina: 'Transition neutre / La Niña (2028)',
      regimeSuperElNino: 'Super El Niño couplé IOD+ (2027)',
      regimeModerate: 'El Niño modéré',
      regimeNormal: 'Conditions neutres / normales',
      projectedMaize: 'Rendement maïs projeté',
      estimatedAgriGdp: 'PIB agricole estimé',
      inflationLabel: 'Inflation (prix à la conso.)',
      waterRestored: 'Cumul hydrique restauré',
      waterDeficit: 'Déficit hydrique saisonnier',
      tabs: {
        filieres: 'Filières 2027 vs 2028',
        hydroDistricts: 'Eau & Districts (4 zones)',
        madagascar2027: 'Madagascar 2027',
        africa2027: 'Afrique & Blocs',
        patterns: 'Patterns 10 ans & ETL',
        hybridRag: 'IA Hybride (XGBoost + QLoRA + RAG)',
        python: 'Code Python & APIs',
      },
      filieresBanner:
        'Distinction critique : El Niño 2026–2027 provoque un choc de stress hydrique et thermique (baisse des rendements en 2027), tandis que la transition neutre/La Niña en 2028 entraîne un rebond productif fort (+10 % à +30 %) accompagné toutefois d’un risque élevé d’inondations localisées et de cyclones.',
      scenario2027Label: '2027 (Post-El Niño)',
      scenario2028Label: '2028 (Transition La Niña)',
      districtsIncludedLabel: 'Districts intégrés :',
      impact2027Label: 'Impact 2027 :',
      impact2028Label: 'Impact 2028 :',
      centroidsLabel: 'Centroïdes GPS (geoBoundaries ADM2 / NASA POWER) :',
      madagascarCardPrefix: 'Horizon :',
      horizonCol: 'Horizon',
      criticalSignalCol: 'Signal critique :',
      africaWeatherLabel: 'Météo 2027 :',
      africaEcoLabel: 'Impact économique :',
      patternsCols: {
        indicator: 'Indicateur climatique / macro',
        neutral: 'Années Neutres / La Niña',
        elNino: 'Forts El Niño (2015–16, 2023–24, 2026–27)',
        impact: 'Impact statistique mesuré',
      },
      etlTitle: 'Pipeline ETL : Sources ouvertes gratuites (API NASA POWER, ERA5, FAOSTAT, NOAA/CHIRPS)',
      etlCols: {
        source: 'Source de données',
        access: 'Accès & Résolution',
        variables: 'Variables clés',
        role: 'Rôle dans le modèle ML',
      },
      antiOverfitTitle: 'Paramètres XGBoost anti-surapprentissage (Séries historiques courtes)',
      antiOverfitSubtitle:
        'Sur des séries agricoles de 10 à 20 ans, TimeSeriesSplit et une régularisation stricte évitent que le modèle ne mémorise le bruit.',
      antiOverfitCols: {
        param: 'Paramètre',
        val: 'Valeur / Configuration',
        role: 'Rôle technique',
      },
      hybridStackTitle: 'Architecture Hybride en 3 couches (Zéro hallucination chiffrée)',
      hybridCols: {
        layer: 'Couche Architecture',
        role: 'Rôle dans l’Observatoire',
        sources: 'Sources d’entraînement',
        impl: 'Implémentation',
      },
      orchestrationTitle: 'Démonstration d’orchestration par district (XGBoost → RAG → LLM Fine-Tuné)',
      orchestrationQuestionLabel: 'Requête terrain :',
      step1Title: '1. Sortie XGBoost (Chiffres exacts)',
      step2Title: '2. Extraits RAG (FAISS / Bulletins)',
      step3Title: '3. Synthèse LLM Fine-Tuné (Plan d’action)',
      codeIntro:
        'Scripts Python opérationnels reproductibles pour l’extraction NASA POWER / geoBoundaries, l’entraînement XGBoost régularisé, la génération du dataset JSONL QLoRA, le mapping Folium et le pipeline RAG FAISS.',
      scriptTabs: {
        geoXgboost: 'geoBoundaries + XGBoost',
        qloraJsonl: 'Dataset QLoRA (JSONL)',
        folium: 'Carte Folium (RdYlGn)',
        normalizer: 'Normalisation 119 Districts',
        rag: 'RAG FAISS + LangChain',
        power: 'API NASA POWER Basique',
        rf: 'Random Forest (Lag-4)',
      },
      scriptTitles: {
        'geo-xgboost': 'Extraction ADM2 geoBoundaries + NASA POWER + RandomizedSearchCV (TimeSeriesSplit)',
        'qlora-jsonl': 'Générateur automatique du dataset JSONL pour Fine-Tuning QLoRA (Mistral-7B / Llama-3)',
        folium: 'Carte choroplèthe interactive Folium des 119 districts (RdYlGn)',
        normalizer: 'Table de correspondance et appariement flou (geoBoundaries ADM2 vs Météo/FAOSTAT)',
        rag: 'Pipeline RAG FAISS + Embeddings multilingues (français / malgache)',
        power: 'Requête directe API NASA POWER + XGBoost multi-cibles',
        rf: 'Baseline Random Forest avec variables décalées (Lag-4 mois)',
      },
      copyCode: 'Copier le script',
      copiedCode: 'Script copié',
    },
    districtStudio: {
      cropLabels: {
        rice: 'Riz (Irrigué / Pluvial)',
        maize: 'Maïs & Vivriers',
        exportCrop: 'Cultures de rente (Vanille / Café / Litchi)',
      },
      yieldBadges: {
        collapse: 'Chute critique',
        severeDrop: 'Baisse marquée',
        decline: 'Baisse modérée',
        recovery: 'Rebond positif',
      },
      riskTiers: {
        drought: 'Vigilance Rouge (Sécheresse)',
        mixed: 'Vigilance Orange (Mixte / Stress)',
        flood: 'Vigilance Bleue (Excès / Crues)',
      },
      eyebrow: 'Studio Spatial & IA Opérationnelle · 42 Districts Pilotes (Norme geoBoundaries ADM2)',
      title: 'Carte interactive des 42 districts, couche choroplèthe & diagnostic Gemini RAG + QLoRA',
      subtitle:
        'Explorez chaque district sur Google Maps ou schéma SVG, basculez entre 2027 (Choc El Niño) et 2028 (Rebond/Crues La Niña), et générez un plan d’action agronomique via Gemini.',
      year2027Btn: '2027 (Choc El Niño)',
      year2028Btn: '2028 (Rebond La Niña)',
      qloraBtn: 'Aperçu QLoRA JSONL',
      downloadJsonlBtn: 'Télécharger .jsonl (42×2)',
      qloraTitle: 'Dataset Fine-Tuning QLoRA généré depuis les prédictions XGBoost',
      qloraSubtitle: 'Format ChatML JSONL prêt pour Mistral-7B / Llama-3-8B (4-bit nf4, LoRA r=16).',
      qloraHyperTitle: 'Hyperparamètres QLoRA recommandés',
      qloraColParam: 'Paramètre',
      qloraColVal: 'Configuration',
      qloraColDetail: 'Justification',
      qloraPreviewLabel: 'Exemple JSONL formaté pour le district sélectionné :',
      mapCardTitle: 'Carte spatiale des districts (42 pilotes)',
      mapCardSubtitle: 'Cliquez sur un marqueur pour charger ses indicateurs et son diagnostic.',
      googleMapsBtn: 'Google Maps',
      svgSchemaBtn: 'Schéma SVG',
      layerModeLabel: 'Couche thématique :',
      layerYieldBtn: 'Rendement ML (RdYlGn)',
      layerRiskBtn: 'Vigilance territoriale (Rouge/Orange/Bleu)',
      legendSevere: 'Chute sévère (≤ -20 %)',
      legendMod: 'Baisse (-1 à -19 %)',
      legendRebound: 'Rebond (+%)',
      legendDrought: 'Sécheresse',
      legendMixed: 'Mixte',
      legendFlood: 'Crues / Excès',
      geoNormTitle: 'Normalisation geoBoundaries',
      geoNormText:
        'Appariement des toponymes officiels ADM2 (ex. Boriziny = Port-Bergé, Vohibinany = Brickaville, Ambovombe-Androy).',
      regionPrefix: 'Région',
      yieldColPrefix: 'Rendement',
      waterAnomalyLabel: 'Anomalie Eau',
      oniIndexLabel: 'Indice ONI',
      oniValue2027: '+3,5 °C (El Niño)',
      oniValue2028: '-0,9 °C (La Niña)',
      ragNotesTitle: 'Extraits RAG locaux (Bulletins DGM / FOFIFA / FAO / BNGRC)',
      geminiDiagnosticTitle: 'Diagnostic synthétique Gemini (XGBoost + RAG)',
      geminiDiagnosticSubtitle: 'Croisement en temps réel des données chiffrées et des directives FOFIFA / FDA.',
      customQuestionLabel: 'Question complémentaire ciblée (optionnelle) :',
      customQuestionPlaceholder: 'Ex. : Quel calendrier de semis pour le sorgho et comment monter un dossier FDA-R ?',
      askGeminiBtn: 'Générer le plan Gemini',
      askGeminiLoading: 'Synthèse...',
      copyDiagnostic: 'Copier le plan',
      emptyDiagnosticText:
        'Cliquez sur « Générer le plan Gemini » ou sélectionnez un district sur la carte pour obtenir un diagnostic opérationnel (XGBoost + RAG) adapté au district.',
      loadingDiagnosticText: 'Interrogation de Gemini en cours (injection XGBoost + extraits RAG du district)...',
      errorDiagnosticPrefix: 'Erreur lors de la synthèse :',
      indriStarting: 'Lancement diagnostic Gemini (XGBoost + RAG)',
      indriDone: 'Diagnostic Gemini prêt',
      systemPromptJsonl:
        "Tu es un ingénieur agronome et économiste expert de Madagascar, spécialisé dans l'adaptation au phénomène El Niño.",
    },
    maps: {
      missingKeyTitle: 'Impossible de charger Google Maps Platform',
      waitingKeyTitle: 'Clé Google Maps en attente de chargement',
      waitingKeyDesc:
        'Configurez VITE_GOOGLE_MAPS_API_KEY ou utilisez la vue « Schéma SVG » pour inspecter les 42 districts.',
      terrainBtn: 'Relief',
      roadmapBtn: 'Carte',
      satelliteBtn: 'Satellite',
      recenterTitle: 'Recentrer sur Madagascar',
      selectedWaterLabel: 'Anomalie Eau',
      selectedRiskLabel: 'Vigilance :',
      geminiDiagBtn: 'Diagnostic Gemini →',
    },
    calendars: {
      months: ['Oct. 26', 'Nov. 26', 'Déc. 26', 'Janv. 27', 'Fév. 27', 'Mar. 27'],
      smsTitle: 'Service vocal gratuit 3-2-1 (Airtel · Yas · Orange)',
      smsBody:
        'Les agriculteurs sans connexion internet peuvent écouter chaque semaine les avis agrométéorologiques et alertes de semis en langue malgache via le numéro court 3-2-1.',
      regionsPrefix: 'Régions :',
      triggerTitle: 'Règle de déclenchement des semis',
      cyclePrefix: 'Cycle :',
      priorityCropsTitle: 'Cultures prioritaires',
      associationsTitle: 'Associations de cultures & haies protectrices',
      waterSoilTitle: 'Gestion de l’eau, des sols et du microclimat',
      transversalTitle: 'Principes transversaux FAO / FOFIFA (2026–2027)',
      transversalText:
        'Abandonner le semis à calendrier fixe au profit du déclenchement pluviométrique (20–30 mm cumulés) dans le Sud ; fractionner l’urée uniquement lorsque l’humidité du sol est suffisante ; constituer des greniers communautaires villageois (GCV) avant la soudure d’avril–septembre 2027.',
    },
    atlas: {
      groupFilters: {
        all: 'Toutes (23 régions)',
        'grand-sud': 'A · Grand Sud (6)',
        'sud-est-est': 'B · Sud-Est & Est (5)',
        'nord-nord-ouest': 'C · Nord & NO (6)',
        'hautes-terres': 'D · Hautes Terres (6)',
      },
      riskVisualLabels: {
        drought: 'Sécheresse',
        mixed: 'Mixte',
        flood: 'Excès / Crues',
      },
      pillar1Eyebrow: 'Périodes de crise',
      pillar1Title: '2027 vs 2028',
      pillar1Body: 'Choc initial (2027) suivi d’une soudure prolongée et d’une transition La Niña au T1 2028.',
      pillar2Eyebrow: 'Maille territoriale',
      pillar2Title: '23 Régions · 119 Districts',
      pillar2Body: 'Priorité 1 sur le Grand Sud (Androy, Anosy, Atsimo-Andrefana), Priorité 2 côtes & greniers.',
      pillar3Eyebrow: 'Cadre de veille',
      pillar3Title: '9 indicateurs mensuels',
      pillar3Body: 'Pluie CHIRPS, SPI-1/3/6, NDVI, humidité ERA5, débits, prix OdR et IPC 3+.',
      tabs: {
        regions: 'Atlas des 23 Régions',
        temporal: 'Fenêtres 2027–2028',
        sectors: '9 Secteurs & 7 Domaines',
        preparedness: '5 Axes & 9 Indicateurs',
      },
      searchPlaceholder: 'Filtrer par région, district ou risque (ex. Androy, vanille, Marovoay)...',
      exportCsvBtn: 'Exporter CSV (23 régions)',
      csvHeaders: ['Numero', 'Region', 'Groupe', 'Priorite', 'Risque Dominant', 'Vigilance', 'Effets', 'Districts Prioritaires'],
      tableHeaders: {
        num: '#',
        regionGroup: 'Région & Groupe',
        dominantRisk: 'Risque dominant',
        effects: 'Effets attendus',
        priorityDistricts: 'Districts prioritaires',
      },
      vigilancePrefix: 'Vigilance :',
      temporal2027Header: '2027 · Installation du choc El Niño',
      temporal2028Header: '2028 · Soudure prolongée ou récupération',
      sectorsTitle: 'Impacts multisectoriels (9 secteurs clés)',
      sectorsColSector: 'Secteur',
      sectorsColEffects: 'Conséquences anticipées',
      sectorsColZones: 'Zones prioritaires',
      domainsTitle: '7 domaines de surveillance de l’Atlas',
      checklistTitle: 'Plan de préparation en 5 axes stratégiques',
      checklistCounter: 'actions validées',
      leadPrefix: 'Pilotage :',
      indicatorsTitle: '9 indicateurs de suivi mensuel recommandé',
      indicatorsColInd: 'Indicateur',
      indicatorsColRole: 'Utilité opérationnelle',
      indicatorsColCadence: 'Cadence',
      indicatorsColSource: 'Source de référence',
      sourcesTitle: 'Sources officielles et portails climatiques',
      deliverablesTitle: 'Les 7 livrables de l’Observatoire Atlas',
    },
    plan: {
      riskLevels: {
        low: 'Faible',
        moderate: 'Modéré',
        important: 'Important',
        high: 'Élevé',
        veryHigh: 'Très élevé',
      },
      meteoBulletinTitle: 'Bulletin Météo Madagascar (Nov. 2026 – Janv. 2027)',
      meteoBulletinBody:
        'Contraste marqué entre le déficit hydrique dans le Sud/Sud-Ouest et les pluies précoces ou excédentaires au Nord/Nord-Est, justifiant une architecture différenciée sur les 119 districts.',
      questionsTitle: 'Les 6 questions stratégiques du Plan National',
      tabs: {
        scoring: '1. Scoring 5D & 12 Pilotes',
        agriculture: '2. Pertes & Fiche Ambovombe',
        budget: '3. Modèle Financier (MGA/USD/EUR)',
        governance: '4. Gouvernance & Registre ONG',
        roadmap: '5. Feuille de route & KPI',
      },
      pilotSelectLabel: 'District pilote de référence (12 pilotes) :',
      pilotGroupPrefix: 'Groupe',
      resetScoresBtn: 'Réinitialiser scores pilote',
      dims5Label: 'Pondération des 5 dimensions de risque (/5)',
      scoreWeightedLabel: 'Score pondéré (0–100)',
      riskClassPrefix: 'Classe :',
      popRefLabel: 'Population de référence',
      popExposedLabel: 'Population exposée estimée',
      popExposedFormula: 'P_ref × taux d’exposition',
      assistNeededLabel: 'Besoins d’assistance',
      assistFormula: 'P_exposée × vulnérabilité × taux d’aide',
      classes5Title: 'Échelle analytique des 5 classes de risque',
      abcdTitle: 'Typologie territoriale (Groupes A, B, C, D)',
      schemaTitle: 'Schéma normalisé de la base des 119 districts (20 champs)',
      schemaFieldCol: 'Champ DB',
      schemaContentCol: 'Contenu normé',
      chainsTitle: 'Suivi des 8 filières nationales prioritaires',
      lossCalcTitle: 'Calculateur rapide de pertes agricoles (Pertes = (Q_ref - Q_scénario) × Prix)',
      lossCalcSubtitle: 'Estimez l’impact financier local en MGA et USD selon la sévérité du scénario.',
      areaLabel: 'Superficie cultivée (ha)',
      baseYieldLabel: 'Rendement de référence (t/ha)',
      scenarioShockLabel: 'Baisse de rendement scénario (%)',
      priceMgaLabel: 'Prix local marché (MGA / kg)',
      tonnageLossLabel: 'Pertes physiques estimées',
      estLossLabel: 'Pertes financières (MGA / USD)',
      seedBudgetLabel: 'Coût indicatif kits semences (~80 000 MGA/ha)',
      threeScenTitle: 'Comparaison des 3 scénarios climatiques nationaux (S1 / S2 / S3)',
      scenParamCol: 'Paramètre',
      scen1Col: 'S1 · Scénario favorable',
      scen2Col: 'S2 · Scénario intermédiaire',
      scen3Col: 'S3 · Scénario défavorable',
      ficheTitle: 'Modèle standard de fiche district (Exemple Ambovombe-Androy)',
      ficheDomainCol: 'Domaine',
      ficheIndCol: 'Indicateur requis',
      ficheStatusCol: 'Statut / Source',
      budgetTitle: 'Budget ascendant (Bottom-Up) par coûts unitaires',
      budgetSubtitle: 'Ajustez les quantités et coûts unitaires (MGA) pour consolider en USD et EUR.',
      fxRateLabel: 'Taux USD (1 USD = MGA)',
      fxEurLabel: 'Taux EUR (1 EUR = MGA)',
      resetBudgetBtn: 'Réinitialiser coûts',
      totalUrgencyLabel: 'Urgence 2026–2028',
      totalResilienceLabel: 'Résilience 2028–2030',
      totalPlanLabel: 'Total consolidé du Plan',
      budgetLineCol: 'Poste d’intervention',
      budgetHorizonCol: 'Horizon',
      budgetQtyCol: 'Quantité',
      budgetUnitCostCol: 'Coût unitaire (MGA)',
      budgetTotalCol: 'Sous-total (MGA / USD)',
      budget8Title: '8 composantes budgétaires du Plan',
      fin7Title: '7 indicateurs financiers de pilotage',
      donorsTitle: '5 bailleurs climatiques et partenaires ciblés',
      govPyramidTitle: 'Pyramide institutionnelle à 6 niveaux',
      gov13Title: 'Cartographie des 13 acteurs nationaux et internationaux',
      govActorCol: 'Institution / Acteur',
      govRoleCol: 'Mandat opérationnel',
      ngoRegistryTitle: 'Registre opérationnel des projets ONG / ONU (Zéro doublon)',
      ngoRegistrySubtitle: 'Géolocalisez les interventions par district et identifiez les besoins non couverts.',
      ngoSearchPlaceholder: 'Filtrer par organisation, district, secteur...',
      ngoExportBtn: 'Exporter Registre CSV',
      ngoFormTitle: 'Ajouter une intervention au registre',
      ngoAddBtn: 'Enregistrer dans le tableau',
      ngoPlaceholders: {
        org: 'Organisation (ex. CARE, Croix-Rouge)',
        region: 'Région (ex. Androy)',
        district: 'District (ex. Bekily)',
        commune: 'Commune(s)',
        sector: 'Secteur (Eau, Cash+, Semences...)',
        beneficiaries: 'Bénéficiaires (nb)',
        committedUsd: 'Budget engagé (USD)',
        unmet: 'Besoins restants non couverts',
      },
      ngoCols: {
        org: 'Organisation',
        zone: 'Zone (Région / District / Commune)',
        sector: 'Secteur',
        beneficiaries: 'Bénéficiaires',
        committed: 'Budget engagé',
        unmet: 'Besoins non couverts',
      },
      phasesTitle: 'Calendrier de déploiement en 6 phases (Nov. 2026 – Déc. 2028)',
      kpi10Title: '10 indicateurs nationaux de suivi-évaluation (KPI)',
      stackTitle: 'Architecture technique SIG & Data recommandée',
      gapsTitle: '12 données institutionnelles manquantes à collecter',
      deliverablesTitle: '6 livrables structurants du Plan National',
      sequenceTitle: 'Séquence logique de construction (8 étapes)',
      components8Title: 'Les 8 composantes du Programme National',
      objectives8Title: 'Alignement Objectifs / Résultats attendus',
    },
    economic: {
      disclaimerBody:
        'Les séries de référence (PIB régional/national FAOSTAT/BM) sont ancrées sur les dernières données connues, tandis que les pertes 2027–2028 sont des projections du modèle économétrique couplé XGBoost (rendements par district) + élasticités indirectes (eau, élevage, hydroélectricité RIA, voirie).',
      scenarioMeta: {
        S1: { label: 'S1 · Choc modéré / Pluies tardives', factorLabel: '×0,65' },
        S2: { label: 'S2 · Base ML (Super El Niño +3,5 °C / IOD+)', factorLabel: '×1,00' },
        S3: { label: 'S3 · Sévère (Soudure étendue / Cyclones 2028)', factorLabel: '×1,38' },
      },
      currencyShort: {
        USD: { bn: 'Md $', m: 'M $' },
        EUR: { bn: 'Md €', m: 'M €' },
        MGA: { bn: 'Md Ar' },
      },
      kpiMadagascarSub: 'du PIB national',
      kpiDirectSub: 'Choc PIB agricole :',
      kpiCoiSub2027: 'Part de Madagascar :',
      kpiCoiSub2028: 'Pertes COI 2028 (soudure & crues)',
      kpiAfricaSub2027: 'Dont Madagascar :',
      kpiAfricaSub2028: 'Solde résiduel 2028 (SADC/COMESA)',
      provincesChartTitle: 'Poids économique par Ex-Province (Madagascar)',
      provincesChartSubtitle: 'Comparaison entre pertes directes agricoles et pertes indirectes (eau, énergie RIA, bétail, infrastructures).',
      legendDirect: 'Direct agricole',
      legendIndirect: 'Indirect (Eau, Énergie, Voirie)',
      provincesTableHeaders: {
        province: 'Ex-Province',
        direct: 'Direct agri.',
        indirect: 'Indirect',
        total: 'Total',
        gdpShare: '% PIB prov.',
        rice: 'Riz',
        maize: 'Maïs & Vivriers',
        exportCrop: 'Rente',
        channel: 'Canal de transmission dominant',
      },
      balance2028Prefix: 'Solde net 2028 projeté :',
      regionsFilterAll: 'Toutes les ex-provinces (23 régions)',
      regionsSortTotal: 'Trier : Perte totale',
      regionsSortGdp: 'Trier : % PIB régional',
      regionsSortName: 'Trier : Nom A–Z',
      regionsHeaders: {
        regionProvince: 'Région (Ex-Province)',
        districts: 'Districts',
        total: 'Perte totale',
        gdpPct: '% PIB rég.',
        rice: 'Riz',
        maize: 'Maïs & Vivriers',
        exportCrop: 'Rente',
        indirect: 'Indirect',
      },
      districtsTotalNote: '42 districts modélisés en haute résolution sur les 119 districts officiels (extrapolation statistique activée en mode 119 dist.).',
      districtsSearchPlaceholder: 'Filtrer un district ou une région...',
      districtsAllProfiles: 'Tous les profils climatiques',
      districtsAllRegions: 'Toutes les régions',
      districtsHeaders: {
        district: 'District',
        regionProv: 'Région · Province',
        profile: 'Profil',
        water: 'Eau',
        total: 'Perte estimée',
        rice: 'Riz',
        maize: 'Maïs',
        exportCrop: 'Rente',
        mapAction: 'Carte',
      },
      viewOnMapBtn: 'Voir carte',
      continentalStripDirect: 'Pertes directes agricoles (Sélection)',
      continentalStripIndirect: 'Pertes indirectes (Énergie / Routes / Eau)',
      continentalStripTotal: 'Total choc économique 2027',
      continentalStripGdp: 'Impact pondéré sur le PIB du bloc',
      continentalFilters: {
        all: 'Tous (21)',
        COI: 'Océan Indien (COI)',
        SADC: 'SADC (Afrique australe)',
        COMESA: 'COMESA (Axe N-S)',
        Afrique: 'Afrique complète',
      },
      continentalChartTitle: 'Projection des pertes économiques 2027 par pays / sous-région (Direct vs Indirect)',
      continentalTableHeaders: {
        country: 'Pays / Sous-région',
        blocs: 'Appartenance',
        gdp: 'PIB réf.',
        direct: 'Direct agri.',
        indirect: 'Indirect / Énergie',
        total2027: 'Total 2027',
        gdpShare: '% PIB',
        bal2028: 'Solde 2028',
        signal: 'Signal & canal de transmission',
      },
    },
    cooperatives: {
      zones: [
        { id: 'grand-sud', label: 'Grand Sud & Sud-Ouest (Androy, Anosy, Atsimo-Andrefana, Menabe)' },
        { id: 'hautes-terres', label: 'Hautes Terres Centrales & Alaotra (Analamanga, Vakinankaratra, Itasy, Alaotra)' },
        { id: 'nord-ouest', label: 'Nord & Nord-Ouest (Diana, Sava, Boeny, Sofia)' },
      ],
      crops: [
        { id: 'mais-sorgho', label: 'Maïs / Sorgho / Mil & Légumineuses' },
        { id: 'riz-irrigue', label: 'Riz irrigué (Bas-fonds / SRI / SRA)' },
        { id: 'riz-pluvial', label: 'Riz pluvial (Tanety)' },
        { id: 'vanille-rente', label: 'Vanille / Cultures de rente' },
      ],
      checklistItems: [
        { id: 'legal', label: 'Statuts légaux de la coopérative à jour (récépissé officiel)' },
        { id: 'cirae', label: 'Membres inscrits auprès de la CirAE / DRAE (carte de producteur)' },
        { id: 'water', label: 'Besoin chiffré (kits de semences, pompe, curage canal ou micro-irrigation)' },
        { id: 'gcv', label: 'Plan de stockage communautaire (GCV) ou contrat acheteur identifié' },
        { id: 'fews', label: 'Calendrier de semis calé sur les avis FOFIFA / Météo Madagascar (3-2-1)' },
      ],
      selectZoneLabel: '1. Zone agro-écologique de la coopérative',
      selectCropLabel: '2. Filière principale visée',
      readinessTitle: '3. Pré-requis dossier FDA / DEFIS',
      tailoredTitle: 'Recommandation technique & financière générée',
      windowLabel: 'Fenêtre & Règle de semis :',
      recommendedCropsLabel: 'Cultures & Variétés recommandées :',
      practiceLabel: 'Pratique eau / sol prioritaire :',
      deskLabel: 'Guichet de financement cible :',
      copySummaryBtn: 'Copier la fiche mémo coopérative',
      copiedSummaryBtn: 'Fiche mémo copiée !',
      summaryTemplateTitle: 'FICHE MÉMO COOPÉRATIVE — EL NIÑO 2026–2027',
      directoryTitle: 'Annuaire officiel des organismes d’appui à Madagascar',
      agencyFilters: {
        Tous: 'Toutes les structures',
        'Guichet national': 'Guichet national',
        'Agence ONU': 'Agence ONU',
        'Appui technique': 'Appui technique',
      },
      tableHeaders: {
        org: 'Organisme',
        role: 'Mission principale',
        action: 'Condition / Action coopérative',
        contact: 'Adresse & Contact',
      },
    },
    assistantExtra: {
      anchors: [
        { label: 'Ambovombe (Androy · Grand Sud)', lat: -25.18, lon: 46.09 },
        { label: 'Ambatondrazaka (Lac Alaotra)', lat: -17.83, lon: 48.42 },
        { label: 'Marovoay (Plaines Boeny)', lat: -16.11, lon: 46.64 },
        { label: 'Antananarivo (Centre / ANMCC)', lat: -18.88, lon: 47.51 },
        { label: 'Sambava (Vanille SAVA)', lat: -14.27, lon: 50.17 },
        { label: 'Manakara (Fitovinany)', lat: -22.14, lon: 48.01 },
      ],
      networkError: 'Erreur réseau lors de la communication avec le serveur.',
      searchError: 'Erreur lors de la recherche Web.',
      mapsError: 'Erreur lors de la requête Google Maps.',
      responseError: 'Erreur lors du traitement Gemini.',
      closeAria: 'Fermer le tiroir assistant',
      msgUnit: 'msg',
      modelBadgePrefix: 'Modèle :',
      toolBadgePrefix: 'Outil :',
      indriChatStarting: 'Réflexion Gemini Chat en cours',
      indriChatDone: 'Réponse Gemini Chat affichée',
      indriSearchStarting: 'Veille Web Google Search en cours',
      indriSearchDone: 'Sources Web analysées',
      indriMapsStarting: 'Analyse logistique Google Maps en cours',
      indriMapsDone: 'Lieux Google Maps vérifiés',
    },
    indriVoice: {
      galleryLabels: {
        studio: 'Assis (Studio)',
        attentive: 'Attentif',
        singing: 'Chant / Réponse',
        alert: 'Vigilance Haute',
        mother: 'Protection',
        branch: 'Canopée',
        portrait: 'Portrait',
        curious: 'Calcul / Curieux',
      },
      voiceLabels: {
        Puck: 'Puck (Dynamique)',
        Zephyr: 'Zephyr (Clair)',
        Aoede: 'Aoede (Posé)',
        Fenrir: 'Fenrir (Grave)',
      },
      stageBadgeSpeaking: 'Expression vocale active',
      stageBadgeComputing: 'Calcul ML & Zone...',
      stageBadgeListening: 'Écoute active',
      stageAriaLabel: 'Avatar interactif Indri indri de Madagascar (Babakoto)',
      liveCalcStatus: 'Live Calculs',
      scenarioOptions: {
        S1: 'S1 Modéré (×0,55)',
        S2: 'S2 Base ML (×1,0)',
        S3: 'S3 Sévère (×1,45)',
      },
      shortcutPrompts: {
        currentSituation:
          'Donne-moi la situation actuelle complète (ONI, insécurité alimentaire, prix du riz et pertes totales) à Madagascar.',
        ambovombe2027:
          'Calcule les prévisions, le risque, les pertes économiques et les recommandations FOFIFA pour Ambovombe en 2027.',
        compareAmbovombeAlaotra:
          'Compare en détail Ambovombe (Androy) et Ambatondrazaka (Lac Alaotra) en 2027.',
        africaSadcComesa:
          'Analyse les pertes économiques projetées en Océan Indien (COI), COMESA, SADC et Afrique en 2027.',
      },
      indriActivityIntro: 'Babakoto interroge l’Observatoire...',
      indriActivityZone: 'Babakoto calcule les données de zone',
      indriActivityCompare: 'Babakoto compare deux zones',
      indriActivityLiveStart: 'Démarrage session vocale Live Indri indri',
      indriActivityLiveConnecting: 'Connexion à Gemini 3.8 Live...',
      indriActivityLiveConnected: 'Voix Live active · Parlez à Indri indri',
      indriActivityLiveCalculating: 'Babakoto exécute un calcul en direct...',
      indriActivityLiveAnswering: 'Indri indri vous répond à haute voix',
    },
  },

  en: {
    common: {
      close: 'Close',
      reset: 'Reset',
      exportCsv: 'Export CSV',
      copy: 'Copy',
      copied: 'Copied',
      searchPlaceholder: 'Search...',
      all: 'All',
      regions: 'Regions',
      district: 'District',
      region: 'Region',
      horizon: 'Horizon',
      year2027: '2027',
      year2028: '2028',
    },
    header: {
      navAria: 'Main navigation',
      langSwitcherAria: 'Language switcher',
      mobileMenuAria: 'Mobile menu',
    },
    hero: {
      fig1Alt: 'Comparative chart of historical El Niño thermal anomalies',
      fig1Caption:
        'Fig. 1 — 2026–2027 event (+3.5 to +4.1 °C projected) compared against historical equatorial Pacific peaks.',
    },
    mechanism: {
      phaseSelectorAria: 'ENSO phase selector',
      elNinoTab: 'El Niño (2026–2027)',
      laNinaTab: 'La Niña (Cool phase)',
      elNinoStatusLabel: 'Active warm phase (+3.5 °C to +4.1 °C)',
      laNinaStatusLabel: 'Opposite cool phase (historical ref.)',
      svgTitle: 'Equatorial Pacific Ocean cross-section',
      svgSubtitleElNino: 'Weakened trade winds → warm waters shift east toward Peru, blocking cold upwelling.',
      svgSubtitleLaNina: 'Strong trade winds → warm water piles up toward Indonesia with intense cold upwelling.',
      svgAriaElNino: 'Ocean-atmosphere diagram of El Niño showing warm water shifting eastward',
      svgAriaLaNina: 'Ocean-atmosphere diagram of La Niña showing warm water pushed westward',
      westAsiaLabel: 'West / Indonesia',
      eastPeruLabel: 'East / Peru',
      elNinoConvection: 'Convection & storm zone shifted toward Central Pacific',
      elNinoTradeWinds: '← Weakened or reversed trade winds →',
      elNinoWarmWater: 'Warm waters (+3.5 to +4.1 °C)',
      elNinoUpwelling: 'Cold upwelling suppressed',
      laNinaConvection: 'Intense convection over West Pacific & SE Asia',
      laNinaTradeWinds: '←← Strong east-to-west trade winds ←←',
      laNinaColdWater: 'Equatorial cold tongue',
      laNinaUpwelling: 'Strong cold-water upwelling',
      lonWest: '120°E (Asia / Oceania)',
      lonCenter: '180° (Central Pacific)',
      lonEast: '80°W (South America)',
      summaryTradeWinds: 'Trade winds',
      summarySurfaceWater: 'Surface waters',
      summaryRainStorms: 'Rains & storms',
      natureMedTag: 'Health & Heat Stress (Nature Medicine)',
      natureMedText:
        'A major El Niño temporarily raises global average temperatures and is associated with over 100,000 additional heat-related deaths each year across tropical and subtropical regions.',
      tableTitle: 'Scientific Synthesis & Global Impacts',
      tabCompare: 'El Niño / La Niña',
      tabGlobal: 'Global Impacts (FAO)',
      criterionCol: 'Physical Criterion',
      elNinoCol: 'El Niño (Warm phase)',
      laNinaCol: 'La Niña (Cool phase)',
      regionCol: 'Region',
      effectsCol: 'Climatic & Agricultural Effects',
      dominantRiskCol: 'Dominant Risk',
      riskLabels: {
        flood: 'Floods',
        drought: 'Drought',
        thermal: 'Thermal contrast',
      },
    },
    madagascar: {
      severityLabels: {
        Critique: 'Critical',
        Élevé: 'High',
        Vigilance: 'Watch',
      },
      mapHeading: 'Regional Climate Contrast Map',
      mapSubtitle: 'Select a zone to inspect diagnostics and response measures.',
      mapAria: 'Schematic map of Madagascar climate risk zones in 2026–2027',
      zoneNames: {
        nord: 'North',
        nordOuest: 'North-West',
        centreEst: 'Center & East',
        sudEst: 'South-East',
        grandSud: 'Grand Sud',
      },
      eastShiftNote: 'Cyclone tracks shifted eastward → Rodrigues',
      legendCritical: 'Critical (Drought)',
      legendHigh: 'High (Deficit / Prices)',
      legendWatch: 'Watch (North Rain / NW Delay)',
      legendCyclone: 'Deflected cyclone track',
      zoneHint: 'Click any zone on the map to inspect covered regions.',
      regionsConcerned: 'Regions Covered',
      rainfallSignal: 'Rainfall Signal',
      thermalAnomaly: 'Thermal Anomaly',
      majorRisk: 'Major Risk (2026–2027)',
      emergencyMeasures: 'Emergency Measures Deployed',
      cycloneTag: 'IOC Cyclone Bulletin / CycloneOI',
      cycloneText:
        'Driven by the strong El Niño and positive IOD (IOD+), SWIOCOF-15 anticipates fewer cyclones overall in the 2026–2027 basin season, with tracks deflected farther east toward Rodrigues.',
      fig2Alt: 'Drought impact on food crops in southern Madagascar',
      fig2Caption: 'Fig. 2 — Acute drought and food crop vulnerability (Androy / Anosy).',
      fig3Alt: 'Contrast of excess rainfall and coastal risks',
      fig3Caption: 'Fig. 3 — Localized excess rainfall in the Far North and water management.',
    },
    africa: {
      filters: {
        all: 'All Blocs',
        sadc: 'SADC (Southern Africa)',
        comesa: 'COMESA & Horn',
        sahel: 'Sahel & West Africa',
        'nord-centrale': 'North & Central Africa',
      },
      perimeterLabel: 'Scope:',
      climateSignalLabel: 'Climate signal:',
      agriEnergyLabel: 'Agriculture & energy impact:',
      emergencyMeasuresLabel: 'Emergency measures:',
      riceTitle: 'Projected Local Rice Price Trajectory in Antananarivo (MGA / kg)',
      riceSubtitle: 'Joint pressure from Asian export supply, freight, fuel costs, and irregular rains.',
      riceChartAria: 'Chart showing projected Antananarivo local rice price reaching 3,200 MGA per kg',
      riceBaselineNote: 'July 2026 baseline: 2,550 MGA/kg → FEWS NET Jan–Feb 2027 peak: 3,200 MGA/kg (+25.5%)',
      commoditiesTitle: 'Impact on Commodities and Hydropower',
      commodityCol: 'Commodity / Resource',
      regionsCol: 'Key Zones',
      mechanismCol: 'Mechanism',
      pressureCol: 'Market Pressure',
    },
    ml: {
      chartTitle: 'Time Series & Lag Structure (4–6 Months)',
      chartSubtitle: 'The oceanic ONI index peaks in late 2026, while the LSTM agricultural shock reaches its maximum from April to August 2027.',
      lagBadge: 'LSTM · +4 to +6 mo Lag',
      chartAria: 'Chart comparing oceanic ONI El Niño anomaly and lagged harvest shock index over 2026–2027',
      legendOni: 'ONI Anomaly (°C)',
      legendShock: 'Harvest Shock Index (/100)',
      noteLabel: 'Note:',
      clusteringTitle: 'Spatial Clustering (K-Means)',
      clusteringText:
        'Segmentation of the 119 districts by rainfall and drought history (Grand Sud vs Central Highlands vs humid North-East).',
      xgboostTitle: 'XGBoost & Random Forest',
      xgboostText:
        'Non-linear tree ensembles combining lagged ONI (t-4 mo), IOD, soil moisture, and temperature to forecast yields and prices.',
      simTitle: '2027 vs 2028 ML Simulator',
      simSubtitle: 'Test how (ONI, IOD, Rainfall) affects maize yield, agricultural GDP, and water balance.',
      presets: {
        sud: '2027 South Shock (+3.5 °C)',
        hautesTerres: '2027 Highlands (+3.2 °C)',
        laNina: '2028 La Niña Rebound (-0.9 °C)',
      },
      oniLabel: 'ONI Index (t-4 to t-6 mo)',
      iodLabel: 'Indian Ocean Dipole (IOD)',
      rainLabel: 'Seasonal cumulative rainfall',
      regimeClassified: 'Classified regime:',
      regimeLaNina: 'Neutral / La Niña transition (2028)',
      regimeSuperElNino: 'Super El Niño coupled with IOD+ (2027)',
      regimeModerate: 'Moderate El Niño',
      regimeNormal: 'Neutral / normal conditions',
      projectedMaize: 'Projected maize yield',
      estimatedAgriGdp: 'Estimated agri GDP',
      inflationLabel: 'CPI food inflation',
      waterRestored: 'Restored water balance',
      waterDeficit: 'Seasonal water deficit',
      tabs: {
        filieres: 'Crops 2027 vs 2028',
        hydroDistricts: 'Water & Districts (4 zones)',
        madagascar2027: 'Madagascar 2027',
        africa2027: 'Africa & Blocs',
        patterns: '10-Yr Patterns & ETL',
        hybridRag: 'Hybrid AI (XGBoost + QLoRA + RAG)',
        python: 'Python Code & APIs',
      },
      filieresBanner:
        'Critical distinction: El Niño 2026–2027 triggers a drought and heat shock (yield drops in 2027), whereas the Neutral/La Niña transition in 2028 drives a strong rebound (+10% to +30%) paired with high flood and cyclone risks.',
      scenario2027Label: '2027 (Post-El Niño)',
      scenario2028Label: '2028 (La Niña Transition)',
      districtsIncludedLabel: 'Included districts:',
      impact2027Label: '2027 Impact:',
      impact2028Label: '2028 Impact:',
      centroidsLabel: 'GPS Centroids (geoBoundaries ADM2 / NASA POWER):',
      madagascarCardPrefix: 'Horizon:',
      horizonCol: 'Horizon',
      criticalSignalCol: 'Critical Signal:',
      africaWeatherLabel: '2027 Weather:',
      africaEcoLabel: 'Economic Impact:',
      patternsCols: {
        indicator: 'Climate / Macro Indicator',
        neutral: 'Neutral / La Niña Years',
        elNino: 'Strong El Niño (2015–16, 2023–24, 2026–27)',
        impact: 'Measured Statistical Impact',
      },
      etlTitle: 'ETL Pipeline: Open Free Sources (NASA POWER API, ERA5, FAOSTAT, NOAA/CHIRPS)',
      etlCols: {
        source: 'Data Source',
        access: 'Access & Resolution',
        variables: 'Key Variables',
        role: 'Role in ML Pipeline',
      },
      antiOverfitTitle: 'XGBoost Anti-Overfitting Guards (Short Historical Series)',
      antiOverfitSubtitle:
        'On 10–20 year agricultural series, TimeSeriesSplit and strict regularization prevent the model from memorizing noise.',
      antiOverfitCols: {
        param: 'Parameter',
        val: 'Value / Setting',
        role: 'Technical Role',
      },
      hybridStackTitle: '3-Layer Hybrid Architecture (Zero Quantitative Hallucination)',
      hybridCols: {
        layer: 'Architecture Layer',
        role: 'Role in Observatory',
        sources: 'Training Sources',
        impl: 'Implementation',
      },
      orchestrationTitle: 'District Orchestration Walkthrough (XGBoost → RAG → Fine-Tuned LLM)',
      orchestrationQuestionLabel: 'Field Query:',
      step1Title: '1. XGBoost Output (Exact Figures)',
      step2Title: '2. RAG Excerpts (FAISS / Bulletins)',
      step3Title: '3. Fine-Tuned LLM Synthesis (Action Plan)',
      codeIntro:
        'Reproducible Python scripts for NASA POWER / geoBoundaries extraction, regularized XGBoost training, JSONL QLoRA dataset generation, Folium mapping, and FAISS RAG retrieval.',
      scriptTabs: {
        geoXgboost: 'geoBoundaries + XGBoost',
        qloraJsonl: 'QLoRA Dataset (JSONL)',
        folium: 'Folium Map (RdYlGn)',
        normalizer: '119 District Normalizer',
        rag: 'FAISS RAG + LangChain',
        power: 'Basic NASA POWER API',
        rf: 'Random Forest (Lag-4)',
      },
      scriptTitles: {
        'geo-xgboost': 'geoBoundaries ADM2 + NASA POWER extraction + RandomizedSearchCV (TimeSeriesSplit)',
        'qlora-jsonl': 'Automated JSONL dataset generator for QLoRA fine-tuning (Mistral-7B / Llama-3)',
        folium: 'Interactive Folium choropleth map of Madagascar 119 districts (RdYlGn)',
        normalizer: 'Name mapping table & fuzzy matcher (geoBoundaries ADM2 vs Météo/FAOSTAT)',
        rag: 'FAISS RAG pipeline + multilingual embeddings (French / Malagasy)',
        power: 'Direct NASA POWER API request + multi-target XGBoost',
        rf: 'Random Forest baseline with 4-month lagged ONI feature',
      },
      copyCode: 'Copy script',
      copiedCode: 'Script copied',
    },
    districtStudio: {
      cropLabels: {
        rice: 'Rice (Irrigated & Rainfed)',
        maize: 'Maize & Staples',
        exportCrop: 'Export Crops (Vanilla / Coffee / Lychee)',
      },
      yieldBadges: {
        collapse: 'Critical collapse',
        severeDrop: 'Sharp decline',
        decline: 'Moderate decline',
        recovery: 'Positive rebound',
      },
      riskTiers: {
        drought: 'Red Alert (Drought)',
        mixed: 'Orange Alert (Mixed / Stress)',
        flood: 'Blue Alert (Excess / Floods)',
      },
      eyebrow: 'Spatial Studio & Operational AI · 42 Pilot Districts (geoBoundaries ADM2)',
      title: 'Interactive 42-District Map, Choropleth Layer & Gemini RAG + QLoRA Diagnostics',
      subtitle:
        'Explore every district on Google Maps or SVG view, toggle 2027 (El Niño Shock) vs 2028 (La Niña Rebound/Floods), and generate a tailored Gemini agronomic action plan.',
      year2027Btn: '2027 (El Niño Shock)',
      year2028Btn: '2028 (La Niña Rebound)',
      qloraBtn: 'Preview QLoRA JSONL',
      downloadJsonlBtn: 'Download .jsonl (42×2)',
      qloraTitle: 'QLoRA Fine-Tuning Dataset Generated from XGBoost Forecasts',
      qloraSubtitle: 'ChatML JSONL format ready for Mistral-7B / Llama-3-8B (4-bit nf4, LoRA r=16).',
      qloraHyperTitle: 'Recommended QLoRA Hyperparameters',
      qloraColParam: 'Parameter',
      qloraColVal: 'Configuration',
      qloraColDetail: 'Rationale',
      qloraPreviewLabel: 'Formatted JSONL sample for the selected district:',
      mapCardTitle: 'District Spatial Map (42 pilots)',
      mapCardSubtitle: 'Click a marker to load district indicators and Gemini briefing.',
      googleMapsBtn: 'Google Maps',
      svgSchemaBtn: 'SVG View',
      layerModeLabel: 'Thematic layer:',
      layerYieldBtn: 'ML Yield (RdYlGn)',
      layerRiskBtn: 'Risk Tier (Red/Orange/Blue)',
      legendSevere: 'Severe drop (≤ -20%)',
      legendMod: 'Decline (-1% to -19%)',
      legendRebound: 'Rebound (+%)',
      legendDrought: 'Drought',
      legendMixed: 'Mixed',
      legendFlood: 'Floods / Excess',
      geoNormTitle: 'geoBoundaries Normalization',
      geoNormText:
        'Normalized ADM2 toponym matching (e.g., Boriziny = Port-Bergé, Vohibinany = Brickaville, Ambovombe-Androy).',
      regionPrefix: 'Region',
      yieldColPrefix: 'Yield',
      waterAnomalyLabel: 'Water Anomaly',
      oniIndexLabel: 'ONI Index',
      oniValue2027: '+3.5 °C (El Niño)',
      oniValue2028: '-0.9 °C (La Niña)',
      ragNotesTitle: 'Local RAG Excerpts (DGM / FOFIFA / FAO / BNGRC Bulletins)',
      geminiDiagnosticTitle: 'Gemini Synthesized Diagnostic (XGBoost + RAG)',
      geminiDiagnosticSubtitle: 'Real-time synthesis of quantitative ML figures and FOFIFA / FDA directives.',
      customQuestionLabel: 'Targeted follow-up question (optional):',
      customQuestionPlaceholder: 'E.g.: What sorghum sowing date and how to prepare an FDA-R grant application?',
      askGeminiBtn: 'Generate Gemini Plan',
      askGeminiLoading: 'Synthesizing...',
      copyDiagnostic: 'Copy plan',
      emptyDiagnosticText:
        'Click "Generate Gemini Plan" or select any district marker to produce a district-specific operational plan (XGBoost + RAG).',
      loadingDiagnosticText: 'Querying Gemini (injecting XGBoost outputs + district RAG excerpts)...',
      errorDiagnosticPrefix: 'Synthesis error:',
      indriStarting: 'Running Gemini diagnostic (XGBoost + RAG)',
      indriDone: 'Gemini diagnostic ready',
      systemPromptJsonl:
        'You are an agronomist and climate economist specializing in Madagascar and El Niño adaptation.',
    },
    maps: {
      missingKeyTitle: 'Unable to load Google Maps Platform',
      waitingKeyTitle: 'Google Maps API key loading',
      waitingKeyDesc: 'Set VITE_GOOGLE_MAPS_API_KEY or switch to "SVG View" to inspect all 42 districts.',
      terrainBtn: 'Terrain',
      roadmapBtn: 'Map',
      satelliteBtn: 'Satellite',
      recenterTitle: 'Recenter on Madagascar',
      selectedWaterLabel: 'Water Anomaly',
      selectedRiskLabel: 'Alert:',
      geminiDiagBtn: 'Gemini Diagnostic →',
    },
    calendars: {
      months: ['Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27'],
      smsTitle: 'Free 3-2-1 Voice Advisory Service (Airtel · Yas · Orange)',
      smsBody:
        'Farmers without internet access can dial short code 3-2-1 weekly to hear localized agrometeorological bulletins and sowing alerts in Malagasy.',
      regionsPrefix: 'Regions:',
      triggerTitle: 'Sowing Trigger Rule',
      cyclePrefix: 'Cycle:',
      priorityCropsTitle: 'Priority Crops',
      associationsTitle: 'Intercropping & Windbreak Hedges',
      waterSoilTitle: 'Water, Soil & Microclimate Management',
      transversalTitle: 'Cross-Cutting FAO / FOFIFA Principles (2026–2027)',
      transversalText:
        'Replace fixed calendar sowing with rainfall triggers (20–30 mm cumulative over 3 days) in the South; split urea applications only with adequate soil moisture; build village grain banks (GCV) ahead of the April–September 2027 lean season.',
    },
    atlas: {
      groupFilters: {
        all: 'All (23 regions)',
        'grand-sud': 'A · Grand Sud (6)',
        'sud-est-est': 'B · South-East & East (5)',
        'nord-nord-ouest': 'C · North & NW (6)',
        'hautes-terres': 'D · Highlands (6)',
      },
      riskVisualLabels: {
        drought: 'Drought',
        mixed: 'Mixed',
        flood: 'Excess / Floods',
      },
      pillar1Eyebrow: 'Crisis Horizons',
      pillar1Title: '2027 vs 2028',
      pillar1Body: 'Initial El Niño shock (2027) followed by extended lean season and La Niña transition in Q1 2028.',
      pillar2Eyebrow: 'Territorial Granularity',
      pillar2Title: '23 Regions · 119 Districts',
      pillar2Body: 'Priority 1 in Grand Sud (Androy, Anosy, Atsimo-Andrefana), Priority 2 coastal & rice basins.',
      pillar3Eyebrow: 'Monitoring Framework',
      pillar3Title: '9 Monthly Indicators',
      pillar3Body: 'CHIRPS rainfall, SPI-1/3/6, NDVI, ERA5 soil moisture, river levels, OdR prices & IPC 3+.',
      tabs: {
        regions: '23-Region Atlas',
        temporal: '2027–2028 Windows',
        sectors: '9 Sectors & 7 Domains',
        preparedness: '5 Axes & 9 Indicators',
      },
      searchPlaceholder: 'Filter by region, district, or hazard (e.g. Androy, vanilla, Marovoay)...',
      exportCsvBtn: 'Export CSV (23 regions)',
      csvHeaders: ['Number', 'Region', 'Group', 'Priority', 'Dominant Risk', 'Vigilance', 'Effects', 'Priority Districts'],
      tableHeaders: {
        num: '#',
        regionGroup: 'Region & Group',
        dominantRisk: 'Dominant Risk',
        effects: 'Expected Impacts',
        priorityDistricts: 'Priority Districts',
      },
      vigilancePrefix: 'Alert:',
      temporal2027Header: '2027 · El Niño Shock Onset',
      temporal2028Header: '2028 · Extended Lean Season or Recovery',
      sectorsTitle: 'Multi-Sector Impacts (9 Key Sectors)',
      sectorsColSector: 'Sector',
      sectorsColEffects: 'Anticipated Consequences',
      sectorsColZones: 'Priority Zones',
      domainsTitle: '7 Atlas Monitoring Domains',
      checklistTitle: 'Preparedness Plan Across 5 Strategic Axes',
      checklistCounter: 'actions checked',
      leadPrefix: 'Lead:',
      indicatorsTitle: '9 Recommended Monthly Monitoring Indicators',
      indicatorsColInd: 'Indicator',
      indicatorsColRole: 'Operational Utility',
      indicatorsColCadence: 'Cadence',
      indicatorsColSource: 'Reference Source',
      sourcesTitle: 'Official Climate Portals & Sources',
      deliverablesTitle: 'The 7 Atlas Observatory Deliverables',
    },
    plan: {
      riskLevels: {
        low: 'Low',
        moderate: 'Moderate',
        important: 'Significant',
        high: 'High',
        veryHigh: 'Very high',
      },
      meteoBulletinTitle: 'Météo Madagascar Bulletin (Nov 2026 – Jan 2027)',
      meteoBulletinBody:
        'Sharp contrast between water deficit in the South/South-West and early or excess rains in the North/North-East, requiring differentiated intervention packages across all 119 districts.',
      questionsTitle: 'The 6 Strategic Questions of the National Plan',
      tabs: {
        scoring: '1. 5D Scoring & 12 Pilots',
        agriculture: '2. Crop Losses & Ambovombe Brief',
        budget: '3. Financial Model (MGA/USD/EUR)',
        governance: '4. Governance & NGO Registry',
        roadmap: '5. Roadmap & KPIs',
      },
      pilotSelectLabel: 'Reference Pilot District (12 pilots):',
      pilotGroupPrefix: 'Group',
      resetScoresBtn: 'Reset pilot scores',
      dims5Label: '5 Risk Dimension Weights (/5)',
      scoreWeightedLabel: 'Weighted Score (0–100)',
      riskClassPrefix: 'Class:',
      popRefLabel: 'Reference Population',
      popExposedLabel: 'Estimated Exposed Population',
      popExposedFormula: 'P_ref × exposure rate',
      assistNeededLabel: 'Population Needing Assistance',
      assistFormula: 'P_exposed × vuln. × aid rate',
      classes5Title: 'Analytical Scale of the 5 Risk Classes',
      abcdTitle: 'Territorial Typology (Groups A, B, C, D)',
      schemaTitle: 'Standardized 119-District Database Schema (20 Fields)',
      schemaFieldCol: 'DB Field',
      schemaContentCol: 'Normalized Content',
      chainsTitle: 'Monitoring of 8 Priority National Value Chains',
      lossCalcTitle: 'Quick Crop Loss Calculator (Loss = (Q_ref - Q_scenario) × Price)',
      lossCalcSubtitle: 'Estimate local financial losses in MGA and USD by scenario severity.',
      areaLabel: 'Cultivated Area (ha)',
      baseYieldLabel: 'Baseline Yield (t/ha)',
      scenarioShockLabel: 'Scenario Yield Drop (%)',
      priceMgaLabel: 'Local Market Price (MGA / kg)',
      tonnageLossLabel: 'Estimated Physical Loss',
      estLossLabel: 'Financial Loss (MGA / USD)',
      seedBudgetLabel: 'Indicative Seed Kit Cost (~80,000 MGA/ha)',
      threeScenTitle: 'Comparison of 3 National Climate Scenarios (S1 / S2 / S3)',
      scenParamCol: 'Parameter',
      scen1Col: 'S1 · Mild Scenario',
      scen2Col: 'S2 · Intermediate Scenario',
      scen3Col: 'S3 · Severe Scenario',
      ficheTitle: 'Standard District Data Sheet Template (Ambovombe-Androy Example)',
      ficheDomainCol: 'Domain',
      ficheIndCol: 'Required Indicator',
      ficheStatusCol: 'Status / Source',
      budgetTitle: 'Bottom-Up Budget Modeler by Unit Cost',
      budgetSubtitle: 'Adjust quantities and MGA unit costs to consolidate totals in USD and EUR.',
      fxRateLabel: 'USD Rate (1 USD = MGA)',
      fxEurLabel: 'EUR Rate (1 EUR = MGA)',
      resetBudgetBtn: 'Reset unit costs',
      totalUrgencyLabel: 'Emergency 2026–2028',
      totalResilienceLabel: 'Resilience 2028–2030',
      totalPlanLabel: 'Total Plan Budget',
      budgetLineCol: 'Intervention Line',
      budgetHorizonCol: 'Horizon',
      budgetQtyCol: 'Quantity',
      budgetUnitCostCol: 'Unit Cost (MGA)',
      budgetTotalCol: 'Subtotal (MGA / USD)',
      budget8Title: '8 Budget Components of the Plan',
      fin7Title: '7 Financial Steering Indicators',
      donorsTitle: '5 Target Climate Funds & Donors',
      govPyramidTitle: '6-Level Institutional Governance Pyramid',
      gov13Title: 'Mapping of 13 National & International Actors',
      govActorCol: 'Institution / Actor',
      govRoleCol: 'Operational Mandate',
      ngoRegistryTitle: 'Operational NGO / UN Project Registry (Zero Overlap)',
      ngoRegistrySubtitle: 'Geolocate active projects by district and surface remaining funding gaps.',
      ngoSearchPlaceholder: 'Filter by organization, district, sector...',
      ngoExportBtn: 'Export Registry CSV',
      ngoFormTitle: 'Add an Intervention to the Registry',
      ngoAddBtn: 'Add to Registry Table',
      ngoPlaceholders: {
        org: 'Organization (e.g. CARE, Red Cross)',
        region: 'Region (e.g. Androy)',
        district: 'District (e.g. Bekily)',
        commune: 'Commune(s)',
        sector: 'Sector (WASH, Cash+, Seeds...)',
        beneficiaries: 'Beneficiaries (count)',
        committedUsd: 'Committed Budget (USD)',
        unmet: 'Remaining Unmet Needs',
      },
      ngoCols: {
        org: 'Organization',
        zone: 'Zone (Region / District / Commune)',
        sector: 'Sector',
        beneficiaries: 'Beneficiaries',
        committed: 'Committed Budget',
        unmet: 'Unmet Needs',
      },
      phasesTitle: '6-Phase Implementation Timeline (Nov 2026 – Dec 2028)',
      kpi10Title: '10 National Monitoring & Evaluation KPIs',
      stackTitle: 'Recommended GIS & Data Tech Stack',
      gapsTitle: '12 Institutional Data Gaps to Collect',
      deliverablesTitle: '6 Core Deliverables of the National Plan',
      sequenceTitle: '8-Step Logical Build Sequence',
      components8Title: '8 Components of the National Program',
      objectives8Title: 'Objectives & Expected Outputs Matrix',
    },
    economic: {
      disclaimerBody:
        'Baseline GDP and agricultural value added use latest FAOSTAT/World Bank series, while 2027–2028 figures are econometric model projections coupling district XGBoost crop shocks with indirect elasticities (water, livestock, RIA hydropower, rural roads).',
      scenarioMeta: {
        S1: { label: 'S1 · Moderate Shock / Late Rains', factorLabel: '×0.65' },
        S2: { label: 'S2 · ML Baseline (Super El Niño +3.5 °C / IOD+)', factorLabel: '×1.00' },
        S3: { label: 'S3 · Severe (Extended Lean / 2028 Cyclones)', factorLabel: '×1.38' },
      },
      currencyShort: {
        USD: { bn: 'B $', m: 'M $' },
        EUR: { bn: 'B €', m: 'M €' },
        MGA: { bn: 'B Ar' },
      },
      kpiMadagascarSub: 'of national GDP',
      kpiDirectSub: 'Agri GDP shock:',
      kpiCoiSub2027: 'Madagascar share:',
      kpiCoiSub2028: '2028 IOC losses (lean & floods)',
      kpiAfricaSub2027: 'Madagascar share:',
      kpiAfricaSub2028: '2028 residual balance (SADC/COMESA)',
      provincesChartTitle: 'Economic Burden by Ex-Province (Madagascar)',
      provincesChartSubtitle: 'Breakdown between direct agricultural crop losses and indirect shocks (water, RIA power, livestock, roads).',
      legendDirect: 'Direct Agriculture',
      legendIndirect: 'Indirect (Water, Energy, Roads)',
      provincesTableHeaders: {
        province: 'Ex-Province',
        direct: 'Direct Agri',
        indirect: 'Indirect',
        total: 'Total',
        gdpShare: '% Prov. GDP',
        rice: 'Rice',
        maize: 'Maize & Staples',
        exportCrop: 'Export',
        channel: 'Dominant Transmission Channel',
      },
      balance2028Prefix: 'Projected 2028 net balance:',
      regionsFilterAll: 'All Ex-Provinces (23 regions)',
      regionsSortTotal: 'Sort: Total Loss',
      regionsSortGdp: 'Sort: % Regional GDP',
      regionsSortName: 'Sort: Name A–Z',
      regionsHeaders: {
        regionProvince: 'Region (Ex-Province)',
        districts: 'Districts',
        total: 'Total Loss',
        gdpPct: '% Reg. GDP',
        rice: 'Rice',
        maize: 'Maize & Staples',
        exportCrop: 'Export',
        indirect: 'Indirect',
      },
      districtsTotalNote: '42 high-resolution modeled districts out of 119 official districts (national statistical scaling active in 119-district mode).',
      districtsSearchPlaceholder: 'Filter by district or region...',
      districtsAllProfiles: 'All climate profiles',
      districtsAllRegions: 'All regions',
      districtsHeaders: {
        district: 'District',
        regionProv: 'Region · Province',
        profile: 'Profile',
        water: 'Water',
        total: 'Estimated Loss',
        rice: 'Rice',
        maize: 'Maize',
        exportCrop: 'Export',
        mapAction: 'Map',
      },
      viewOnMapBtn: 'View map',
      continentalStripDirect: 'Direct Agri Losses (Selection)',
      continentalStripIndirect: 'Indirect Losses (Power / Roads / Water)',
      continentalStripTotal: 'Total 2027 Economic Shock',
      continentalStripGdp: 'Weighted Bloc GDP Impact',
      continentalFilters: {
        all: 'All (21)',
        COI: 'Indian Ocean (IOC)',
        SADC: 'SADC (Southern Africa)',
        COMESA: 'COMESA (N-S Corridor)',
        Afrique: 'All Africa',
      },
      continentalChartTitle: '2027 Economic Loss Projections by Country / Sub-Region (Direct vs Indirect)',
      continentalTableHeaders: {
        country: 'Country / Sub-Region',
        blocs: 'Blocs',
        gdp: 'Ref. GDP',
        direct: 'Direct Agri',
        indirect: 'Indirect / Power',
        total2027: 'Total 2027',
        gdpShare: '% GDP',
        bal2028: '2028 Bal.',
        signal: 'Climate Signal & Transmission Channel',
      },
    },
    cooperatives: {
      zones: [
        { id: 'grand-sud', label: 'Grand Sud & South-West (Androy, Anosy, Atsimo-Andrefana, Menabe)' },
        { id: 'hautes-terres', label: 'Central Highlands & Alaotra (Analamanga, Vakinankaratra, Itasy, Alaotra)' },
        { id: 'nord-ouest', label: 'North & North-West (Diana, Sava, Boeny, Sofia)' },
      ],
      crops: [
        { id: 'mais-sorgho', label: 'Maize / Sorghum / Millet & Pulses' },
        { id: 'riz-irrigue', label: 'Irrigated Rice (Lowlands / SRI / SRA)' },
        { id: 'riz-pluvial', label: 'Upland Rainfed Rice (Tanety)' },
        { id: 'vanille-rente', label: 'Vanilla / Export Cash Crops' },
      ],
      checklistItems: [
        { id: 'legal', label: 'Up-to-date cooperative legal registration & bylaws' },
        { id: 'cirae', label: 'Members registered with CirAE / DRAE (digital producer card)' },
        { id: 'water', label: 'Costed equipment need (seed kits, pump, canal desilting, micro-irrigation)' },
        { id: 'gcv', label: 'Community granary (GCV) storage plan or buyer off-take agreement' },
        { id: 'fews', label: 'Sowing calendar aligned with FOFIFA / Météo Madagascar 3-2-1 bulletins' },
      ],
      selectZoneLabel: '1. Cooperative Agro-Ecological Zone',
      selectCropLabel: '2. Primary Target Value Chain',
      readinessTitle: '3. FDA / DEFIS Dossier Readiness',
      tailoredTitle: 'Tailored Technical & Financial Recommendation',
      windowLabel: 'Sowing Window & Trigger:',
      recommendedCropsLabel: 'Recommended Crops & Varieties:',
      practiceLabel: 'Priority Water / Soil Practice:',
      deskLabel: 'Target Financing Desk:',
      copySummaryBtn: 'Copy Cooperative Action Brief',
      copiedSummaryBtn: 'Brief copied!',
      summaryTemplateTitle: 'COOPERATIVE ACTION BRIEF — EL NIÑO 2026–2027',
      directoryTitle: 'Official Support Directory in Madagascar',
      agencyFilters: {
        Tous: 'All Agencies',
        'Guichet national': 'National Desk',
        'Agence ONU': 'UN Agency',
        'Appui technique': 'Technical Support',
      },
      tableHeaders: {
        org: 'Agency',
        role: 'Core Mandate',
        action: 'Eligibility / Action',
        contact: 'Address & Contact',
      },
    },
    assistantExtra: {
      anchors: [
        { label: 'Ambovombe (Androy · Grand Sud)', lat: -25.18, lon: 46.09 },
        { label: 'Ambatondrazaka (Lake Alaotra)', lat: -17.83, lon: 48.42 },
        { label: 'Marovoay (Boeny Plains)', lat: -16.11, lon: 46.64 },
        { label: 'Antananarivo (Center / ANMCC)', lat: -18.88, lon: 47.51 },
        { label: 'Sambava (SAVA Vanilla)', lat: -14.27, lon: 50.17 },
        { label: 'Manakara (Fitovinany)', lat: -22.14, lon: 48.01 },
      ],
      networkError: 'Network error while reaching the server.',
      searchError: 'Web search failed.',
      mapsError: 'Google Maps lookup failed.',
      responseError: 'Gemini processing error.',
      closeAria: 'Close assistant drawer',
      msgUnit: 'msgs',
      modelBadgePrefix: 'Model:',
      toolBadgePrefix: 'Tool:',
      indriChatStarting: 'Gemini Chat thinking...',
      indriChatDone: 'Gemini Chat response ready',
      indriSearchStarting: 'Running Google Search live briefing',
      indriSearchDone: 'Web sources verified',
      indriMapsStarting: 'Querying Google Maps logistics',
      indriMapsDone: 'Google Maps places verified',
    },
    indriVoice: {
      galleryLabels: {
        studio: 'Seated (Studio)',
        attentive: 'Attentive',
        singing: 'Call / Reply',
        alert: 'High Alert',
        mother: 'Protection',
        branch: 'Canopy',
        portrait: 'Portrait',
        curious: 'Computing',
      },
      voiceLabels: {
        Puck: 'Puck (Energetic)',
        Zephyr: 'Zephyr (Clear)',
        Aoede: 'Aoede (Warm)',
        Fenrir: 'Fenrir (Deep)',
      },
      stageBadgeSpeaking: 'Voice response active',
      stageBadgeComputing: 'Computing ML & Zone...',
      stageBadgeListening: 'Listening actively',
      stageAriaLabel: 'Interactive Madagascar Indri indri (Babakoto) avatar',
      liveCalcStatus: 'Live Tools',
      scenarioOptions: {
        S1: 'S1 Mild (×0.55)',
        S2: 'S2 ML Base (×1.0)',
        S3: 'S3 Severe (×1.45)',
      },
      shortcutPrompts: {
        currentSituation:
          'Give me the complete current situation (ONI anomaly, food insecurity, rice price peak, and total losses) in Madagascar.',
        ambovombe2027:
          'Calculate the 2027 forecasts, risk tier, economic losses, and FOFIFA recommendations for Ambovombe.',
        compareAmbovombeAlaotra:
          'Compare Ambovombe (Androy) and Ambatondrazaka (Lake Alaotra) in detail for 2027.',
        africaSadcComesa:
          'Analyze projected 2027 economic losses across the Indian Ocean (IOC), COMESA, SADC, and Africa.',
      },
      indriActivityIntro: 'Babakoto is querying the Observatory...',
      indriActivityZone: 'Babakoto is computing zone data',
      indriActivityCompare: 'Babakoto is comparing two zones',
      indriActivityLiveStart: 'Starting Indri indri Live Voice session',
      indriActivityLiveConnecting: 'Connecting to Gemini 3.8 Live...',
      indriActivityLiveConnected: 'Live Voice active · Speak with Indri indri',
      indriActivityLiveCalculating: 'Babakoto is executing a live calculation...',
      indriActivityLiveAnswering: 'Indri indri is answering out loud',
    },
  },

  sw: {
    common: {
      close: 'Funga',
      reset: 'Weka upya',
      exportCsv: 'Pakua CSV',
      copy: 'Nakili',
      copied: 'Imenakiliwa',
      searchPlaceholder: 'Tafuta...',
      all: 'Zote',
      regions: 'Mikoa',
      district: 'Wilaya',
      region: 'Mkoa',
      horizon: 'Mwaka',
      year2027: '2027',
      year2028: '2028',
    },
    header: {
      navAria: 'Urambazaji mkuu',
      langSwitcherAria: 'Kibadilishaji lugha',
      mobileMenuAria: 'Menyu ya simu',
    },
    hero: {
      fig1Alt: 'Mchoro wa kulinganisha viwango vya joto vya El Niño kihistoria',
      fig1Caption:
        'Mchoro 1 — Tukio la 2026–2027 (makadirio +3.5 hadi +4.1 °C) ikilinganishwa na rekodi za kihistoria za Bahari ya Pasifiki.',
    },
    mechanism: {
      phaseSelectorAria: 'Uchaguzi wa awamu ya ENSO',
      elNinoTab: 'El Niño (2026–2027)',
      laNinaTab: 'La Niña (Awamu ya Baridi)',
      elNinoStatusLabel: 'Awamu ya joto inaendelea (+3.5 °C hadi +4.1 °C)',
      laNinaStatusLabel: 'Awamu ya baridi kinyume (rejea ya kihistoria)',
      svgTitle: 'Mchoro wa mkato wa Bahari ya Pasifiki ya Ikweta',
      svgSubtitleElNino: 'Pepo za biashara dhaifu → maji ya joto huhamia mashariki kwenda Peru na kuzuia maji baridi kupanda.',
      svgSubtitleLaNina: 'Pepo kali za biashara → maji ya joto hukusanyika Indonesia na maji baridi hupanda sana mashariki.',
      svgAriaElNino: 'Mchoro wa bahari na anga wa El Niño ukionyesha maji ya joto yakihamia mashariki',
      svgAriaLaNina: 'Mchoro wa bahari na anga wa La Niña ukionyesha maji ya joto yakisukumwa magharibi',
      westAsiaLabel: 'Magharibi / Indonesia',
      eastPeruLabel: 'Mashariki / Peru',
      elNinoConvection: 'Ukanda wa mawingu na mvua wahamia katikati mwa Pasifiki',
      elNinoTradeWinds: '← Pepo za biashara zimedhoofika →',
      elNinoWarmWater: 'Maji ya joto (+3.5 hadi +4.1 °C)',
      elNinoUpwelling: 'Kupanda kwa maji baridi kumezuiwa',
      laNinaConvection: 'Mvua nyingi Magharibi mwa Pasifiki na Asia Kusini-Mashariki',
      laNinaTradeWinds: '←← Pepo kali kutoka Mashariki kwenda Magharibi ←←',
      laNinaColdWater: 'Ukanda wa maji baridi ya ikweta',
      laNinaUpwelling: 'Kupanda kwa wingi kwa maji baridi',
      lonWest: '120°E (Asia / Oceania)',
      lonCenter: '180° (Pasifiki ya Kati)',
      lonEast: '80°W (Amerika Kusini)',
      summaryTradeWinds: 'Pepo za biashara',
      summarySurfaceWater: 'Maji ya juu baharini',
      summaryRainStorms: 'Mvua na dhoruba',
      natureMedTag: 'Afya na Joto Kali (Nature Medicine)',
      natureMedText:
        'Tukio kubwa la El Niño huongeza wastani wa joto duniani na huhusishwa na zaidi ya vifo 100,000 vya ziada kutokana na joto kali kila mwaka katika maeneo ya tropiki.',
      tableTitle: 'Muhtasari wa Kisayansi na Athari za Dunia',
      tabCompare: 'El Niño / La Niña',
      tabGlobal: 'Athari Duniani (FAO)',
      criterionCol: 'Kigezo cha Kifizikia',
      elNinoCol: 'El Niño (Awamu ya Joto)',
      laNinaCol: 'La Niña (Awamu ya Baridi)',
      regionCol: 'Kanda',
      effectsCol: 'Athari za Tabianchi na Kilimo',
      dominantRiskCol: 'Hatari Kuu',
      riskLabels: {
        flood: 'Mafuriko',
        drought: 'Ukame',
        thermal: 'Tofauti ya Joto',
      },
    },
    madagascar: {
      severityLabels: {
        Critique: 'Hatari Kuu',
        Élevé: 'Juu',
        Vigilance: 'Uangalizi',
      },
      mapHeading: 'Ramani ya Tofauti za Kikanda',
      mapSubtitle: 'Chagua ukanda kuona uchambuzi na hatua za dharura.',
      mapAria: 'Ramani ya kielelezo ya kanda za hatari ya tabianchi Madagaska 2026–2027',
      zoneNames: {
        nord: 'Kaskazini',
        nordOuest: 'Kaskazini-Magharibi',
        centreEst: 'Kati na Mashariki',
        sudEst: 'Kusini-Mashariki',
        grandSud: 'Kusini Kuu',
      },
      eastShiftNote: 'Njia za vimbunga zimegeuzwa mashariki → Rodrigues',
      legendCritical: 'Hatari Kuu (Ukame)',
      legendHigh: 'Juu (Upungufu / Bei)',
      legendWatch: 'Uangalizi (Mvua Kaskazini / Kuchelewa KM)',
      legendCyclone: 'Njia iliyogeuzwa ya kimbunga',
      zoneHint: 'Bofya ukanda kwenye ramani kuchunguza mikoa husika.',
      regionsConcerned: 'Mikoa Husika',
      rainfallSignal: 'Hali ya Mvua',
      thermalAnomaly: 'Ongezeko la Joto',
      majorRisk: 'Hatari Kuu (2026–2027)',
      emergencyMeasures: 'Hatua za Dharura Zinazotekelezwa',
      cycloneTag: 'Taarifa ya Vimbunga COI / CycloneOI',
      cycloneText:
        'Kutokana na El Niño kali na hali chanya ya Bahari ya Hindi (IOD+), SWIOCOF-15 inatabiri msimu wa 2026–2027 wenye vimbunga vichache kwa ujumla, huku njia zikisukumwa mashariki kuelekea Rodrigues.',
      fig2Alt: 'Athari za ukame kwa mazao ya chakula Kusini mwa Madagaska',
      fig2Caption: 'Mchoro 2 — Ukame mkali na hatari ya uhaba wa chakula (Androy / Anosy).',
      fig3Alt: 'Tofauti ya mvua nyingi na hatari za pwani',
      fig3Caption: 'Mchoro 3 — Mvua nyingi za muda Kaskazini mwa Madagaska na usimamizi wa maji.',
    },
    africa: {
      filters: {
        all: 'Jumuiya Zote',
        sadc: 'SADC (Kusini mwa Afrika)',
        comesa: 'COMESA na Pembe ya Afrika',
        sahel: 'Sahel na Afrika Magharibi',
        'nord-centrale': 'Kaskazini na Afrika ya Kati',
      },
      perimeterLabel: 'Upeo:',
      climateSignalLabel: 'Ishara ya tabianchi:',
      agriEnergyLabel: 'Athari za kilimo na nishati:',
      emergencyMeasuresLabel: 'Hatua za dharura:',
      riceTitle: 'Mwelekeo wa Bei ya Mchele Antananarivo (MGA / kg)',
      riceSubtitle: 'Shinikizo la pamoja kutokana na usambazaji wa Asia, usafirishaji, mafuta na mvua zisizo za kawaida.',
      riceChartAria: 'Mchoro wa makadirio ya bei ya mchele Antananarivo ikipanda hadi MGA 3,200 kwa kilo',
      riceBaselineNote: 'Msingi Julai 2026: MGA 2,550/kg → Kilele FEWS NET Jan–Feb 2027: MGA 3,200/kg (+25.5%)',
      commoditiesTitle: 'Athari kwa Mazao ya Biashara na Umeme wa Maji',
      commodityCol: 'Zao / Rasilimali',
      regionsCol: 'Maeneo Muhimu',
      mechanismCol: 'Utaratibu',
      pressureCol: 'Shinikizo la Soko',
    },
    ml: {
      chartTitle: 'Mfululizo wa Muda na Uchelewesho (Miezi 4–6)',
      chartSubtitle: 'Kielelezo cha bahari ONI hufikia kilele mwishoni mwa 2026, huku athari ya mavuno ya LSTM ikifika kilele kati ya Aprili na Agosti 2027.',
      lagBadge: 'LSTM · Uchelewesho Miezi +4 hadi +6',
      chartAria: 'Mchoro unaolinganisha kielelezo cha ONI na athari ya mavuno katika 2026–2027',
      legendOni: 'Kielelezo ONI (°C)',
      legendShock: 'Kielelezo cha Mshtuko wa Mavuno (/100)',
      noteLabel: 'Maelezo:',
      clusteringTitle: 'Ugawaji wa Kimaeneo (K-Means)',
      clusteringText:
        'Mgawanyo wa wilaya 119 kulingana na mvua na historia ya ukame (Kusini Kuu dhidi ya Nyanda za Juu na Kaskazini-Mashariki).',
      xgboostTitle: 'XGBoost & Random Forest',
      xgboostText:
        'Miundo ya akili bandia inayounganisha ONI (t-4), IOD, unyevu wa udongo na joto kutabiri mavuno na bei.',
      simTitle: 'Kiigaji cha ML 2027 dhidi ya 2028',
      simSubtitle: 'Jaribu athari za (ONI, IOD, Mvua) kwenye mavuno ya mahindi, Pato la Kilimo na akiba ya maji.',
      presets: {
        sud: '2027 Mshtuko Kusini (+3.5 °C)',
        hautesTerres: '2027 Nyanda za Juu (+3.2 °C)',
        laNina: '2028 Mrejesho La Niña (-0.9 °C)',
      },
      oniLabel: 'Kielelezo ONI (miezi t-4 hadi t-6)',
      iodLabel: 'Dipole ya Bahari ya Hindi (IOD)',
      rainLabel: 'Jumla ya mvua za msimu',
      regimeClassified: 'Hali iliyotambuliwa:',
      regimeLaNina: 'Mpito wa kawaida / La Niña (2028)',
      regimeSuperElNino: 'El Niño Kuu pamoja na IOD+ (2027)',
      regimeModerate: 'El Niño ya wastani',
      regimeNormal: 'Hali ya kawaida',
      projectedMaize: 'Makadirio ya mavuno ya mahindi',
      estimatedAgriGdp: 'Makadirio ya Pato la Kilimo',
      inflationLabel: 'Mfumuko wa bei (CPI)',
      waterRestored: 'Maji yaliyorejeshwa msimu',
      waterDeficit: 'Upungufu wa maji msimu',
      tabs: {
        filieres: 'Mazao 2027 vs 2028',
        hydroDistricts: 'Maji na Wilaya (Kanda 4)',
        madagascar2027: 'Madagaska 2027',
        africa2027: 'Afrika na Jumuiya',
        patterns: 'Mienendo 10 & ETL',
        hybridRag: 'AI Mchanganyiko (XGBoost + QLoRA + RAG)',
        python: 'Msimbo wa Python & APIs',
      },
      filieresBanner:
        'Tofauti muhimu: El Niño 2026–2027 husababisha ukame na joto kali (kupungua kwa mavuno 2027), ilhali mpito wa La Niña mnamo 2028 huleta ongezeko la mavuno (+10% hadi +30%) pamoja na hatari kubwa ya mafuriko na vimbunga.',
      scenario2027Label: '2027 (Baada ya El Niño)',
      scenario2028Label: '2028 (Mpito wa La Niña)',
      districtsIncludedLabel: 'Wilaya zilizojumuishwa:',
      impact2027Label: 'Athari 2027:',
      impact2028Label: 'Athari 2028:',
      centroidsLabel: 'Kuratibu za GPS (geoBoundaries ADM2 / NASA POWER):',
      madagascarCardPrefix: 'Muda:',
      horizonCol: 'Muda',
      criticalSignalCol: 'Ishara Hatari:',
      africaWeatherLabel: 'Hali ya hewa 2027:',
      africaEcoLabel: 'Athari ya Kiuchumi:',
      patternsCols: {
        indicator: 'Kielelezo cha Tabianchi / Uchumi',
        neutral: 'Miaka ya Kawaida / La Niña',
        elNino: 'El Niño Kali (2015–16, 2023–24, 2026–27)',
        impact: 'Athari Iliyopimwa Kihistoria',
      },
      etlTitle: 'Mfumo wa ETL: Vyanzo Huria vya Bure (NASA POWER, ERA5, FAOSTAT, NOAA/CHIRPS)',
      etlCols: {
        source: 'Chanzo cha Data',
        access: 'Upatikanaji na Kiwango',
        variables: 'Vigezo Muhimu',
        role: 'Jukumu katika Muundo wa ML',
      },
      antiOverfitTitle: 'Mbinu za XGBoost Kuzuia Kukariri Data Fupi',
      antiOverfitSubtitle:
        'Kwa data ya kilimo ya miaka 10–20, TimeSeriesSplit na udhibiti mkali huzuia muundo kukariri kelele za takwimu.',
      antiOverfitCols: {
        param: 'Kigezo',
        val: 'Thamani / Mpangilio',
        role: 'Jukumu la Kiufundi',
      },
      hybridStackTitle: 'Muundo wa Tabaka 3 za AI (Bila Makosa ya Takwimu)',
      hybridCols: {
        layer: 'Tabaka la Muundo',
        role: 'Jukumu katika Kituo',
        sources: 'Vyanzo vya Mafunzo',
        impl: 'Utekelezaji',
      },
      orchestrationTitle: 'Mfano wa Uchambuzi wa Wilaya (XGBoost → RAG → Fine-Tuned LLM)',
      orchestrationQuestionLabel: 'Swali la Uwanda:',
      step1Title: '1. Matokeo ya XGBoost (Takwimu Halisi)',
      step2Title: '2. Dondoo za RAG (FAISS / Taarifa)',
      step3Title: '3. Uchambuzi wa LLM (Mpango wa Utekelezaji)',
      codeIntro:
        'Misimbo ya Python iliyo tayari kutumika kwa kupakua data za NASA POWER / geoBoundaries, kufunza XGBoost, kuunda faili la QLoRA JSONL, ramani ya Folium na utafutaji wa RAG FAISS.',
      scriptTabs: {
        geoXgboost: 'geoBoundaries + XGBoost',
        qloraJsonl: 'Data ya QLoRA (JSONL)',
        folium: 'Ramani Folium (RdYlGn)',
        normalizer: 'Usawazishaji Wilaya 119',
        rag: 'RAG FAISS + LangChain',
        power: 'API ya NASA POWER',
        rf: 'Random Forest (Lag-4)',
      },
      scriptTitles: {
        'geo-xgboost': 'Upakuaji geoBoundaries ADM2 + NASA POWER + RandomizedSearchCV (TimeSeriesSplit)',
        'qlora-jsonl': 'Muundaji otomatiki wa data ya JSONL kwa mafunzo ya QLoRA (Mistral-7B / Llama-3)',
        folium: 'Ramani shirikishi ya Folium kwa wilaya 119 za Madagaska (RdYlGn)',
        normalizer: 'Jedwali la majina na ulinganishaji (geoBoundaries ADM2 vs Météo/FAOSTAT)',
        rag: 'Mfumo wa RAG FAISS na embeddings za lugha nyingi',
        power: 'Ombi la moja kwa moja NASA POWER API + XGBoost',
        rf: 'Muundo wa msingi wa Random Forest ukiwa na ONI Lag-4',
      },
      copyCode: 'Nakili msimbo',
      copiedCode: 'Msimbo umenakiliwa',
    },
    districtStudio: {
      cropLabels: {
        rice: 'Mpunga (Umwagiliaji & Mvua)',
        maize: 'Mahindi na Mazao ya Chakula',
        exportCrop: 'Mazao ya Biashara (Vanilla / Kahawa / Lychee)',
      },
      yieldBadges: {
        collapse: 'Anguko kubwa',
        severeDrop: 'Kupungua sana',
        decline: 'Kupungua wastani',
        recovery: 'Ongezeko chanya',
      },
      riskTiers: {
        drought: 'Tahadhari Nyekundu (Ukame)',
        mixed: 'Tahadhari ya Machungwa (Mseto)',
        flood: 'Tahadhari ya Bluu (Mafuriko / Ziada)',
      },
      eyebrow: 'Studio ya Ramani na AI · Wilaya 42 za Majaribio (geoBoundaries ADM2)',
      title: 'Ramani Shirikishi ya Wilaya 42, Tabaka la Rangi na Uchambuzi wa Gemini RAG + QLoRA',
      subtitle:
        'Chunguza kila wilaya kupitia Google Maps au SVG, badilisha kati ya 2027 (Mshtuko wa El Niño) na 2028 (Mafuriko/La Niña), na upate mpango wa kilimo wa Gemini.',
      year2027Btn: '2027 (Mshtuko El Niño)',
      year2028Btn: '2028 (Mrejesho La Niña)',
      qloraBtn: 'Onyesha QLoRA JSONL',
      downloadJsonlBtn: 'Pakua .jsonl (42×2)',
      qloraTitle: 'Data ya Mafunzo ya QLoRA Kutoka Utabiri wa XGBoost',
      qloraSubtitle: 'Muundo wa ChatML JSONL tayari kwa Mistral-7B / Llama-3-8B (4-bit nf4, LoRA r=16).',
      qloraHyperTitle: 'Vigezo Vilivyopendekezwa vya QLoRA',
      qloraColParam: 'Kigezo',
      qloraColVal: 'Mpangilio',
      qloraColDetail: 'Sababu',
      qloraPreviewLabel: 'Mfano wa JSONL kwa wilaya iliyochaguliwa:',
      mapCardTitle: 'Ramani ya Wilaya (42 za majaribio)',
      mapCardSubtitle: 'Bofya alama kwenye ramani kupakia takwimu na ushauri.',
      googleMapsBtn: 'Google Maps',
      svgSchemaBtn: 'Mwonekano wa SVG',
      layerModeLabel: 'Tabaka la ramani:',
      layerYieldBtn: 'Mavuno ya ML (RdYlGn)',
      layerRiskBtn: 'Kiwango cha Hatari (Nyekundu/Machungwa/Bluu)',
      legendSevere: 'Anguko kubwa (≤ -20%)',
      legendMod: 'Kupungua (-1% hadi -19%)',
      legendRebound: 'Ongezeko (+%)',
      legendDrought: 'Ukame',
      legendMixed: 'Mseto',
      legendFlood: 'Mafuriko / Mvua nyingi',
      geoNormTitle: 'Usawazishaji geoBoundaries',
      geoNormText:
        'Ulinganishaji wa majina rasmi ya ADM2 (mf. Boriziny = Port-Bergé, Vohibinany = Brickaville, Ambovombe-Androy).',
      regionPrefix: 'Mkoa',
      yieldColPrefix: 'Mavuno',
      waterAnomalyLabel: 'Hali ya Maji',
      oniIndexLabel: 'Kielelezo ONI',
      oniValue2027: '+3.5 °C (El Niño)',
      oniValue2028: '-0.9 °C (La Niña)',
      ragNotesTitle: 'Taarifa za RAG za Eneo (DGM / FOFIFA / FAO / BNGRC)',
      geminiDiagnosticTitle: 'Uchambuzi wa Gemini (XGBoost + RAG)',
      geminiDiagnosticSubtitle: 'Muunganiko wa takwimu za ML na miongozo ya FOFIFA / FDA kwa wakati halisi.',
      customQuestionLabel: 'Swali la ziada mahsusi (hiari):',
      customQuestionPlaceholder: 'Mfano: Tarehe bora ya kupanda mtama na jinsi ya kuomba ruzuku ya FDA-R?',
      askGeminiBtn: 'Andaa Mpango wa Gemini',
      askGeminiLoading: 'Inachakata...',
      copyDiagnostic: 'Nakili mpango',
      emptyDiagnosticText:
        'Bofya "Andaa Mpango wa Gemini" au chagua wilaya kwenye ramani ili kupata uchambuzi mahsusi wa kiutendaji (XGBoost + RAG).',
      loadingDiagnosticText: 'Inauliza Gemini (ikichanganya takwimu za XGBoost na dondoo za RAG za wilaya)...',
      errorDiagnosticPrefix: 'Hitilafu ya uchambuzi:',
      indriStarting: 'Inaanzisha uchambuzi wa Gemini (XGBoost + RAG)',
      indriDone: 'Uchambuzi wa Gemini uko tayari',
      systemPromptJsonl:
        'Wewe ni mtaalamu wa kilimo na mchumi wa Madagaska aliyebobea katika kukabiliana na El Niño.',
    },
    maps: {
      missingKeyTitle: 'Imeshindwa kupakia Google Maps Platform',
      waitingKeyTitle: 'Ufunguo wa Google Maps unasubiri',
      waitingKeyDesc: 'Weka VITE_GOOGLE_MAPS_API_KEY au tumia "Mwonekano wa SVG" kuchunguza wilaya zote 42.',
      terrainBtn: 'Mwinuko',
      roadmapBtn: 'Ramani',
      satelliteBtn: 'Satelaiti',
      recenterTitle: 'Rudisha katikati mwa Madagaska',
      selectedWaterLabel: 'Hali ya Maji',
      selectedRiskLabel: 'Tahadhari:',
      geminiDiagBtn: 'Uchambuzi wa Gemini →',
    },
    calendars: {
      months: ['Okt 26', 'Nov 26', 'Des 26', 'Jan 27', 'Feb 27', 'Mac 27'],
      smsTitle: 'Huduma ya Sauti Bila Malipo 3-2-1 (Airtel · Yas · Orange)',
      smsBody:
        'Wakulima wasio na intaneti wanaweza kupiga namba fupi 3-2-1 kila wiki kusikiliza ushauri wa hali ya hewa na tarehe za kupanda kwa lugha ya Kimalagasi.',
      regionsPrefix: 'Mikoa:',
      triggerTitle: 'Sharti la Kuanza Kupanda',
      cyclePrefix: 'Muda:',
      priorityCropsTitle: 'Mazao ya Kipaumbele',
      associationsTitle: 'Kilimo Mseto na Miti ya Kuzuia Upepo',
      waterSoilTitle: 'Usimamizi wa Maji, Udongo na Hali ya Hewa Ndogo',
      transversalTitle: 'Misingi ya Jumla ya FAO / FOFIFA (2026–2027)',
      transversalText:
        'Acha kupanda kwa kutegemea kalenda ya kudumu; subiri mvua za kwanza za mm 20–30 ndani ya siku 3 Kusini; weka mbolea ya urea tu panapokuwa na unyevu; jenga maghala ya jamii (GCV) kabla ya kipindi cha uhaba Aprili–Septemba 2027.',
    },
    atlas: {
      groupFilters: {
        all: 'Zote (Mikoa 23)',
        'grand-sud': 'A · Kusini Kuu (6)',
        'sud-est-est': 'B · Kusini-Mashariki & Mash. (5)',
        'nord-nord-ouest': 'C · Kaskazini & KM (6)',
        'hautes-terres': 'D · Nyanda za Juu (6)',
      },
      riskVisualLabels: {
        drought: 'Ukame',
        mixed: 'Mseto',
        flood: 'Ziada / Mafuriko',
      },
      pillar1Eyebrow: 'Vipindi vya Mgogoro',
      pillar1Title: '2027 dhidi ya 2028',
      pillar1Body: 'Mshtuko wa awali wa El Niño (2027) ukifuatiwa na uhaba mrefu na mpito wa La Niña mapema 2028.',
      pillar2Eyebrow: 'Kiwango cha Eneo',
      pillar2Title: 'Mikoa 23 · Wilaya 119',
      pillar2Body: 'Kipaumbele 1 katika Kusini Kuu (Androy, Anosy, Atsimo-Andrefana), Kipaumbele 2 pwani na mabonde ya mpunga.',
      pillar3Eyebrow: 'Mfumo wa Ufuatiliaji',
      pillar3Title: 'Viashiria 9 vya Kila Mwezi',
      pillar3Body: 'Mvua za CHIRPS, SPI-1/3/6, NDVI, unyevu ERA5, maji ya mito, bei za OdR na IPC 3+.',
      tabs: {
        regions: 'Atlasi ya Mikoa 23',
        temporal: 'Vipindi 2027–2028',
        sectors: 'Sekta 9 & Nyanja 7',
        preparedness: 'Mihimili 5 & Viashiria 9',
      },
      searchPlaceholder: 'Chuja kwa mkoa, wilaya au hatari (mf. Androy, vanilla, Marovoay)...',
      exportCsvBtn: 'Pakua CSV (Mikoa 23)',
      csvHeaders: ['Namba', 'Mkoa', 'Kundi', 'Kipaumbele', 'Hatari Kuu', 'Tahadhari', 'Athari', 'Wilaya za Kipaumbele'],
      tableHeaders: {
        num: '#',
        regionGroup: 'Mkoa na Kundi',
        dominantRisk: 'Hatari Kuu',
        effects: 'Athari Zinazotarajiwa',
        priorityDistricts: 'Wilaya za Kipaumbele',
      },
      vigilancePrefix: 'Tahadhari:',
      temporal2027Header: '2027 · Mwanzo wa Mshtuko wa El Niño',
      temporal2028Header: '2028 · Kipindi Kirefu cha Uhaba au Ahueni',
      sectorsTitle: 'Athari za Kisekta (Sekta 9 Muhimu)',
      sectorsColSector: 'Sekta',
      sectorsColEffects: 'Matokeo Yanayotarajiwa',
      sectorsColZones: 'Kanda za Kipaumbele',
      domainsTitle: 'Nyanja 7 za Ufuatiliaji wa Atlasi',
      checklistTitle: 'Mpango wa Maandalizi katika Mihimili 5 ya Kimkakati',
      checklistCounter: 'hatua zimethibitishwa',
      leadPrefix: 'Uongozi:',
      indicatorsTitle: 'Viashiria 9 vya Ufuatiliaji wa Kila Mwezi',
      indicatorsColInd: 'Kiashiria',
      indicatorsColRole: 'Matumizi Kiutendaji',
      indicatorsColCadence: 'Muda',
      indicatorsColSource: 'Chanzo cha Rejea',
      sourcesTitle: 'Vyanzo Rasmi na Tovuti za Tabianchi',
      deliverablesTitle: 'Matokeo 7 Makuu ya Kituo cha Atlasi',
    },
    plan: {
      riskLevels: {
        low: 'Chini',
        moderate: 'Wastani',
        important: 'Muhimu',
        high: 'Juu',
        veryHigh: 'Juu Sana',
      },
      meteoBulletinTitle: 'Taarifa ya Météo Madagascar (Nov 2026 – Jan 2027)',
      meteoBulletinBody:
        'Tofauti kubwa kati ya upungufu wa mvua Kusini/Kusini-Magharibi na mvua nyingi za mapema Kaskazini/Kaskazini-Mashariki inahitaji mikakati tofauti kwa wilaya zote 119.',
      questionsTitle: 'Maswali 6 ya Kimkakati ya Mpango wa Taifa',
      tabs: {
        scoring: '1. Alama 5D & Wilaya 12',
        agriculture: '2. Hasara Mazao & Ambovombe',
        budget: '3. Mfumo wa Bajeti (MGA/USD/EUR)',
        governance: '4. Utawala & Sajili ya NGO',
        roadmap: '5. Ratiba & Viashiria KPI',
      },
      pilotSelectLabel: 'Wilaya ya Majaribio (12 za kipaumbele):',
      pilotGroupPrefix: 'Kundi',
      resetScoresBtn: 'Weka upya alama',
      dims5Label: 'Uzito wa Vipimo 5 vya Hatari (/5)',
      scoreWeightedLabel: 'Alama ya Jumla (0–100)',
      riskClassPrefix: 'Daraja:',
      popRefLabel: 'Idadi ya Watu (Rejea)',
      popExposedLabel: 'Watu Wanaoweza Kuathirika',
      popExposedFormula: 'P_ref × kiwango cha athari',
      assistNeededLabel: 'Wanaohitaji Msaada',
      assistFormula: 'Walioathirika × udhaifu × msaada',
      classes5Title: 'Viwango 5 vya Uchambuzi wa Hatari',
      abcdTitle: 'Mgawanyo wa Maeneo (Makundi A, B, C, D)',
      schemaTitle: 'Muundo wa Hifadhidata ya Wilaya 119 (Sehemu 20)',
      schemaFieldCol: 'Sehemu ya DB',
      schemaContentCol: 'Maudhui Sanifu',
      chainsTitle: 'Ufuatiliaji wa Minyororo 8 ya Thamani ya Kitaifa',
      lossCalcTitle: 'Kikokotoo cha Hasara za Kilimo (Hasara = (Q_msingi - Q_hali) × Bei)',
      lossCalcSubtitle: 'Kadiria hasara ya kifedha katika MGA na USD kulingana na ukali wa ukame.',
      areaLabel: 'Eneo Linalolimwa (ha)',
      baseYieldLabel: 'Mavuno ya Msingi (t/ha)',
      scenarioShockLabel: 'Kupungua kwa Mavuno (%)',
      priceMgaLabel: 'Bei ya Soko la Ndani (MGA / kg)',
      tonnageLossLabel: 'Hasara ya Mazao (Tani)',
      estLossLabel: 'Hasara ya Fedha (MGA / USD)',
      seedBudgetLabel: 'Gharama ya Mbegu (~80,000 MGA/ha)',
      threeScenTitle: 'Ulinganisho wa Hali 3 za Tabianchi Kitaifa (S1 / S2 / S3)',
      scenParamCol: 'Kigezo',
      scen1Col: 'S1 · Hali Nafuu',
      scen2Col: 'S2 · Hali ya Kati',
      scen3Col: 'S3 · Hali Mbaya Zaidi',
      ficheTitle: 'Kiolezo cha Kadi ya Wilaya (Mfano Ambovombe-Androy)',
      ficheDomainCol: 'Nyanja',
      ficheIndCol: 'Kiashiria Kinachohitajika',
      ficheStatusCol: 'Hali / Chanzo',
      budgetTitle: 'Mfumo wa Bajeti Kutoka Chini Kwenda Juu (Bottom-Up)',
      budgetSubtitle: 'Badilisha idadi na gharama kwa kila kitengo (MGA) kuona jumla katika USD na EUR.',
      fxRateLabel: 'Kiwango USD (1 USD = MGA)',
      fxEurLabel: 'Kiwango EUR (1 EUR = MGA)',
      resetBudgetBtn: 'Weka upya gharama',
      totalUrgencyLabel: 'Dharura 2026–2028',
      totalResilienceLabel: 'Ustahimilivu 2028–2030',
      totalPlanLabel: 'Jumla Kuu ya Mpango',
      budgetLineCol: 'Kipengele cha Utekelezaji',
      budgetHorizonCol: 'Kipindi',
      budgetQtyCol: 'Idadi',
      budgetUnitCostCol: 'Gharama ya Kitengo (MGA)',
      budgetTotalCol: 'Jumla Ndogo (MGA / USD)',
      budget8Title: 'Vipengele 8 vya Bajeti ya Mpango',
      fin7Title: 'Viashiria 7 vya Usimamizi wa Fedha',
      donorsTitle: 'Mifuko 5 ya Tabianchi na Wafadhili Wanaolengwa',
      govPyramidTitle: 'Piramidi ya Utawala wa Ngazi 6',
      gov13Title: 'Ramani ya Taasisi 13 za Kitaifa na Kimataifa',
      govActorCol: 'Taasisi / Mshirika',
      govRoleCol: 'Jukumu la Kiutendaji',
      ngoRegistryTitle: 'Sajili ya Miradi ya NGO / UN (Kuzuia Kurudia Kazi)',
      ngoRegistrySubtitle: 'Tambua miradi iliyopo katika kila wilaya na mahitaji ambayo hayajafikiwa.',
      ngoSearchPlaceholder: 'Chuja kwa shirika, wilaya, sekta...',
      ngoExportBtn: 'Pakua Sajili CSV',
      ngoFormTitle: 'Ongeza Mradi Kwenye Sajili',
      ngoAddBtn: 'Hifadhi Kwenye Jedwali',
      ngoPlaceholders: {
        org: 'Shirika (mf. CARE, Msalaba Mwekundu)',
        region: 'Mkoa (mf. Androy)',
        district: 'Wilaya (mf. Bekily)',
        commune: 'Kata / Tarafa',
        sector: 'Sekta (Maji, Fedha, Mbegu...)',
        beneficiaries: 'Wanufaika (idadi)',
        committedUsd: 'Bajeti Iliyotolewa (USD)',
        unmet: 'Mahitaji Yaliyosalia',
      },
      ngoCols: {
        org: 'Shirika',
        zone: 'Eneo (Mkoa / Wilaya / Kata)',
        sector: 'Sekta',
        beneficiaries: 'Wanufaika',
        committed: 'Bajeti Iliyopo',
        unmet: 'Mahitaji Yaliyosalia',
      },
      phasesTitle: 'Ratiba ya Utekelezaji wa Awamu 6 (Nov 2026 – Des 2028)',
      kpi10Title: 'Viashiria 10 vya Kitaifa vya Ufuatiliaji (KPI)',
      stackTitle: 'Teknolojia ya GIS na Data Iliyopendekezwa',
      gapsTitle: 'Takwimu 12 za Kitaasisi Zinazohitaji Kukusanywa',
      deliverablesTitle: 'Matokeo 6 Makuu ya Mpango wa Taifa',
      sequenceTitle: 'Hatua 8 za Ujenzi wa Mfumo',
      components8Title: 'Vipengele 8 vya Mpango wa Taifa',
      objectives8Title: 'Malengo na Matokeo Yanayotarajiwa',
    },
    economic: {
      disclaimerBody:
        'Takwimu za msingi za Pato la Taifa (FAOSTAT/Benki ya Dunia) zinatokana na vipimo halisi vilivyopita, ilhali makadirio ya 2027–2028 yanatokana na muundo wa uchumi wa XGBoost (mavuno ya wilaya) ukijumuisha athari zisizo za moja kwa moja (maji, mifugo, umeme wa RIA, barabara).',
      scenarioMeta: {
        S1: { label: 'S1 · Mshtuko Mdogo / Mvua za Kuchelewa', factorLabel: '×0.65' },
        S2: { label: 'S2 · Msingi wa ML (El Niño Kuu +3.5 °C / IOD+)', factorLabel: '×1.00' },
        S3: { label: 'S3 · Kali Sana (Uhaba Mrefu / Vimbunga 2028)', factorLabel: '×1.38' },
      },
      currencyShort: {
        USD: { bn: 'Bil $', m: 'Mil $' },
        EUR: { bn: 'Bil €', m: 'Mil €' },
        MGA: { bn: 'Bil Ar' },
      },
      kpiMadagascarSub: 'ya Pato la Taifa',
      kpiDirectSub: 'Mshtuko wa Kilimo:',
      kpiCoiSub2027: 'Sehemu ya Madagaska:',
      kpiCoiSub2028: 'Hasara za COI 2028 (uhaba na mafuriko)',
      kpiAfricaSub2027: 'Sehemu ya Madagaska:',
      kpiAfricaSub2028: 'Salio la 2028 (SADC/COMESA)',
      provincesChartTitle: 'Mzigo wa Kiuchumi kwa Jimbo (Madagaska)',
      provincesChartSubtitle: 'Mgawanyo kati ya hasara za moja kwa moja za kilimo na athari zisizo za moja kwa moja (maji, umeme wa RIA, mifugo, miundombinu).',
      legendDirect: 'Kilimo Moja kwa Moja',
      legendIndirect: 'Zisizo za Moja kwa Moja (Maji, Nishati, Barabara)',
      provincesTableHeaders: {
        province: 'Jimbo la Kihistoria',
        direct: 'Kilimo',
        indirect: 'Zisizo za Moja',
        total: 'Jumla',
        gdpShare: '% Pato Jimbo',
        rice: 'Mpunga',
        maize: 'Mahindi/Chakula',
        exportCrop: 'Biashara',
        channel: 'Njia Kuu ya Athari',
      },
      balance2028Prefix: 'Makadirio ya salio la 2028:',
      regionsFilterAll: 'Majimbo yote (Mikoa 23)',
      regionsSortTotal: 'Panga: Jumla ya Hasara',
      regionsSortGdp: 'Panga: % ya Pato la Mkoa',
      regionsSortName: 'Panga: Jina A–Z',
      regionsHeaders: {
        regionProvince: 'Mkoa (Jimbo)',
        districts: 'Wilaya',
        total: 'Jumla ya Hasara',
        gdpPct: '% Pato Mkoa',
        rice: 'Mpunga',
        maize: 'Mahindi/Chakula',
        exportCrop: 'Biashara',
        indirect: 'Zisizo za Moja',
      },
      districtsTotalNote: 'Wilaya 42 zilizochambuliwa kwa kina kati ya wilaya 119 rasmi (ukadiriaji wa kitaifa unawashwa kwa modi ya wilaya 119).',
      districtsSearchPlaceholder: 'Tafuta wilaya au mkoa...',
      districtsAllProfiles: 'Hali zote za tabianchi',
      districtsAllRegions: 'Mikoa yote',
      districtsHeaders: {
        district: 'Wilaya',
        regionProv: 'Mkoa · Jimbo',
        profile: 'Wasifu',
        water: 'Maji',
        total: 'Hasara Inayokadiriwa',
        rice: 'Mpunga',
        maize: 'Mahindi',
        exportCrop: 'Biashara',
        mapAction: 'Ramani',
      },
      viewOnMapBtn: 'Ona ramani',
      continentalStripDirect: 'Hasara za Kilimo Moja kwa Moja',
      continentalStripIndirect: 'Hasara Zisizo za Moja kwa Moja (Nishati / Barabara / Maji)',
      continentalStripTotal: 'Jumla ya Mshtuko wa Uchumi 2027',
      continentalStripGdp: 'Athari kwa Pato la Jumuiya',
      continentalFilters: {
        all: 'Zote (21)',
        COI: 'Bahari ya Hindi (COI)',
        SADC: 'SADC (Kusini mwa Afrika)',
        COMESA: 'COMESA (Ukanda wa K-K)',
        Afrique: 'Afrika Nzima',
      },
      continentalChartTitle: 'Makadirio ya Hasara za Kiuchumi 2027 kwa Nchi / Kanda (Moja kwa moja vs Zisizo za moja kwa moja)',
      continentalTableHeaders: {
        country: 'Nchi / Kanda',
        blocs: 'Jumuiya',
        gdp: 'Pato Rejea',
        direct: 'Kilimo',
        indirect: 'Zisizo / Nishati',
        total2027: 'Jumla 2027',
        gdpShare: '% Pato',
        bal2028: 'Salio 2028',
        signal: 'Ishara ya Tabianchi na Njia ya Athari',
      },
    },
    cooperatives: {
      zones: [
        { id: 'grand-sud', label: 'Kusini Kuu & Kusini-Magharibi (Androy, Anosy, Atsimo-Andrefana, Menabe)' },
        { id: 'hautes-terres', label: 'Nyanda za Juu za Kati & Alaotra (Analamanga, Vakinankaratra, Itasy, Alaotra)' },
        { id: 'nord-ouest', label: 'Kaskazini & Kaskazini-Magharibi (Diana, Sava, Boeny, Sofia)' },
      ],
      crops: [
        { id: 'mais-sorgho', label: 'Mahindi / Mtama / Uwele & Jamii ya Kunde' },
        { id: 'riz-irrigue', label: 'Mpunga wa Umwagiliaji (SRI / SRA)' },
        { id: 'riz-pluvial', label: 'Mpunga wa Mvua (Tanety)' },
        { id: 'vanille-rente', label: 'Vanilla / Mazao ya Biashara' },
      ],
      checklistItems: [
        { id: 'legal', label: 'Usajili rasmi na katiba ya chama cha ushirika iko hai' },
        { id: 'cirae', label: 'Wanachama wamesajiliwa CirAE / DRAE (kadi ya mkulima)' },
        { id: 'water', label: 'Mahitaji ya vifaa yamekaguliwa (mbegu, pampu, mifereji ya maji)' },
        { id: 'gcv', label: 'Mpango wa ghala la jamii (GCV) au mkataba wa mnunuzi upo' },
        { id: 'fews', label: 'Tarehe ya kupanda inafuata taarifa za FOFIFA / 3-2-1' },
      ],
      selectZoneLabel: '1. Ukanda wa Kilimo wa Ushirika',
      selectCropLabel: '2. Zao Kuu Linalolengwa',
      readinessTitle: '3. Orodha ya Utayari wa Mradi (FDA / DEFIS)',
      tailoredTitle: 'Ushauri wa Kiufundi na Kifedha Uliotolewa',
      windowLabel: 'Muda na Sharti la Kupanda:',
      recommendedCropsLabel: 'Mazao na Mbegu Zinazopendekezwa:',
      practiceLabel: 'Mbinu Kuu ya Maji na Udongo:',
      deskLabel: 'Dirisha la Ufadhili Linalolengwa:',
      copySummaryBtn: 'Nakili Muhtasari wa Ushirika',
      copiedSummaryBtn: 'Muhtasari umenakiliwa!',
      summaryTemplateTitle: 'MUHTASARI WA USHIRIKA — EL NIÑO 2026–2027',
      directoryTitle: 'Orodha Rasmi ya Mashirika ya Msaada Madagaska',
      agencyFilters: {
        Tous: 'Mashirika Yote',
        'Guichet national': 'Dirisha la Taifa',
        'Agence ONU': 'Shirika la UN',
        'Appui technique': 'Msaada wa Kiufundi',
      },
      tableHeaders: {
        org: 'Taasisi',
        role: 'Jukumu Kuu',
        action: 'Masharti / Hatua za Ushirika',
        contact: 'Anuani na Mawasiliano',
      },
    },
    assistantExtra: {
      anchors: [
        { label: 'Ambovombe (Androy · Kusini Kuu)', lat: -25.18, lon: 46.09 },
        { label: 'Ambatondrazaka (Ziwa Alaotra)', lat: -17.83, lon: 48.42 },
        { label: 'Marovoay (Tambarare za Boeny)', lat: -16.11, lon: 46.64 },
        { label: 'Antananarivo (Kati / ANMCC)', lat: -18.88, lon: 47.51 },
        { label: 'Sambava (Vanilla SAVA)', lat: -14.27, lon: 50.17 },
        { label: 'Manakara (Fitovinany)', lat: -22.14, lon: 48.01 },
      ],
      networkError: 'Hitilafu ya mtandao wakati wa kuwasiliana na seva.',
      searchError: 'Utafutaji wa mtandaoni umeshindikana.',
      mapsError: 'Ombi la Google Maps limeshindikana.',
      responseError: 'Hitilafu ya uchakataji wa Gemini.',
      closeAria: 'Funga dirisha la msaidizi',
      msgUnit: 'ujumbe',
      modelBadgePrefix: 'Muundo:',
      toolBadgePrefix: 'Zana:',
      indriChatStarting: 'Gemini Chat inafikiri...',
      indriChatDone: 'Jibu la Gemini Chat liko tayari',
      indriSearchStarting: 'Inatafuta habari mpya kwenye Google Search',
      indriSearchDone: 'Vyanzo vya mtandao vimethibitishwa',
      indriMapsStarting: 'Inachambua maeneo kwenye Google Maps',
      indriMapsDone: 'Maeneo ya Google Maps yamethibitishwa',
    },
    indriVoice: {
      galleryLabels: {
        studio: 'Ameketi (Studio)',
        attentive: 'Mwangalifu',
        singing: 'Wito / Jibu',
        alert: 'Tahadhari Kuu',
        mother: 'Ulinzi',
        branch: 'Msituni',
        portrait: 'Picha Rasmi',
        curious: 'Anakokotoa',
      },
      voiceLabels: {
        Puck: 'Puck (Mchangamfu)',
        Zephyr: 'Zephyr (Safi)',
        Aoede: 'Aoede (Taratibu)',
        Fenrir: 'Fenrir (Nzito)',
      },
      stageBadgeSpeaking: 'Anazungumza sasa',
      stageBadgeComputing: 'Anakokotoa ML & Eneo...',
      stageBadgeListening: 'Anasikiliza',
      stageAriaLabel: 'Kikaragosi shirikishi cha Indri indri (Babakoto) wa Madagaska',
      liveCalcStatus: 'Hesabu Live',
      scenarioOptions: {
        S1: 'S1 Wastani (×0.55)',
        S2: 'S2 Msingi ML (×1.0)',
        S3: 'S3 Kali Sana (×1.45)',
      },
      shortcutPrompts: {
        currentSituation:
          'Nipe hali kamili ya sasa (kielelezo ONI, uhaba wa chakula, bei ya mchele na jumla ya hasara) nchini Madagaska.',
        ambovombe2027:
          'Kokotoa utabiri wa 2027, kiwango cha hatari, hasara za kiuchumi na ushauri wa FOFIFA kwa Ambovombe.',
        compareAmbovombeAlaotra:
          'Linganisha kwa undani Ambovombe (Androy) na Ambatondrazaka (Ziwa Alaotra) katika mwaka 2027.',
        africaSadcComesa:
          'Chambua makadirio ya hasara za kiuchumi 2027 kwa Bahari ya Hindi (COI), COMESA, SADC na Afrika.',
      },
      indriActivityIntro: 'Babakoto anauliza Kituo cha Uchunguzi...',
      indriActivityZone: 'Babakoto anakokotoa takwimu za eneo',
      indriActivityCompare: 'Babakoto analinganisha kanda mbili',
      indriActivityLiveStart: 'Kuanzisha mazungumzo ya sauti Live na Indri indri',
      indriActivityLiveConnecting: 'Inaunganisha na Gemini 3.8 Live...',
      indriActivityLiveConnected: 'Sauti Live iko wazi · Zungumza na Indri indri',
      indriActivityLiveCalculating: 'Babakoto anafanya hesabu ya moja kwa moja...',
      indriActivityLiveAnswering: 'Indri indri anajibu kwa sauti',
    },
  },
};
