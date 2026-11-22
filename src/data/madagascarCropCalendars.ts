import type { ExProvinceName } from './ensoData';

export type CalendarCropType = 'rice' | 'maize' | 'cassava';

export interface CropWindowEntry {
  crop: CalendarCropType;
  /** Agricultural campaign month indices: 0=Oct, 1=Nov, 2=Dec, 3=Jan, 4=Feb, 5=Mar, 6=Apr, 7=May, 8=Jun, 9=Jul, 10=Aug, 11=Sep */
  plantingStartIdx: number;
  plantingEndIdx: number;
  harvestStartIdx: number;
  harvestEndIdx: number;
  plantingLabelFr: string;
  plantingLabelEn: string;
  harvestLabelFr: string;
  harvestLabelEn: string;
  varietyNoteFr: string;
  varietyNoteEn: string;
  elNinoAdjustmentFr: string;
  elNinoAdjustmentEn: string;
}

export interface MadagascarRegionCropCalendar {
  region: string;
  province: ExProvinceName;
  climateBandFr: string;
  climateBandEn: string;
  crops: Record<CalendarCropType, CropWindowEntry>;
}

function entry(
  crop: CalendarCropType,
  pStart: number,
  pEnd: number,
  hStart: number,
  hEnd: number,
  pFr: string,
  pEn: string,
  hFr: string,
  hEn: string,
  vFr: string,
  vEn: string,
  adjFr: string,
  adjEn: string,
): CropWindowEntry {
  return {
    crop,
    plantingStartIdx: pStart,
    plantingEndIdx: pEnd,
    harvestStartIdx: hStart,
    harvestEndIdx: hEnd,
    plantingLabelFr: pFr,
    plantingLabelEn: pEn,
    harvestLabelFr: hFr,
    harvestLabelEn: hEn,
    varietyNoteFr: vFr,
    varietyNoteEn: vEn,
    elNinoAdjustmentFr: adjFr,
    elNinoAdjustmentEn: adjEn,
  };
}

export const MADAGASCAR_23_REGION_CALENDARS: MadagascarRegionCropCalendar[] = [
  // Toliara (Grand Sud & Sud-Ouest)
  {
    region: 'Androy',
    province: 'Toliara',
    climateBandFr: 'Semi-aride (Grand Sud)',
    climateBandEn: 'Semi-arid (Grand Sud)',
    crops: {
      rice: entry('rice', 2.2, 3.8, 6.0, 7.6, 'Déc – Jan', 'Dec – Jan', 'Avr – Mai', 'Apr – May', 'Bas-fonds & périmètres irrigués', 'Lowland basins & irrigated plots', 'Limiter au bas-fonds après 25 mm de pluie ; préférer sorgho sur tanety.', 'Restrict to lowlands after 25 mm rain; swap upland plots to sorghum.'),
      maize: entry('maize', 2.0, 3.6, 4.8, 6.2, 'Déc – Jan', 'Dec – Jan', 'Fév – Avr', 'Feb – Apr', 'Maïs cycle court 90 j en poquets Zaï', 'Short-cycle 90d maize in Zaï pits', 'Attendre 20–30 mm sur 3 jours et pailler les interlignes.', 'Wait for 20–30 mm over 3 days and apply inter-row mulching.'),
      cassava: entry('cassava', 1.5, 3.5, 8.0, 11.5, 'Nov – Jan', 'Nov – Jan', 'Juin – Sep', 'Jun – Sep', 'Boutures résilientes en poquets Zaï', 'Drought-tolerant cuttings in Zaï pits', 'Culture tampon anti-kéré ; buttage et compostage recommandés.', 'Core famine-buffer root crop; ridge soil and enrich with compost.'),
    },
  },
  {
    region: 'Anosy',
    province: 'Toliara',
    climateBandFr: 'Transition Sud-Est / Aride',
    climateBandEn: 'South-East / Arid Transition',
    crops: {
      rice: entry('rice', 2.0, 3.6, 5.8, 7.4, 'Déc – Jan', 'Dec – Jan', 'Mar – Mai', 'Mar – May', 'Riz de plaine (vallée Mandrare / Efaho)', 'Valley rice (Mandrare / Efaho)', 'Curage des canaux prioritaire et repiquage jeune SRI.', 'Clear irrigation canals early and use young SRI seedlings.'),
      maize: entry('maize', 1.8, 3.4, 4.5, 6.0, 'Nov – Jan', 'Nov – Jan', 'Fév – Avr', 'Feb – Apr', 'Maïs associé niébé / pois d’Angole', 'Maize intercropped with cowpea', 'Décaler semis en Ouest Amboasary après pluie utile.', 'Delay sowing in western Amboasary until effective rain onset.'),
      cassava: entry('cassava', 1.4, 3.4, 7.8, 11.2, 'Nov – Jan', 'Nov – Jan', 'Mai – Sep', 'May – Sep', 'Manioc tolérant sur sols sableux', 'Tolerant cassava on sandy soils', 'Protéger avec haies brise-vent contre l’ensablement.', 'Protect plots with pigeonpea windbreaks against sand drift.'),
    },
  },
  {
    region: 'Atsimo-Andrefana',
    province: 'Toliara',
    climateBandFr: 'Sub-aride (Bas-Mangoky / Onilahy)',
    climateBandEn: 'Sub-arid (Bas-Mangoky / Onilahy)',
    crops: {
      rice: entry('rice', 2.0, 3.8, 5.9, 7.5, 'Déc – Jan', 'Dec – Jan', 'Avr – Mai', 'Apr – May', 'Périmètre Bas-Mangoky & plaines', 'Bas-Mangoky irrigation scheme', 'Gérer les tours d’eau face à la baisse des débits fluviaux.', 'Enforce rotational water allocation under reduced river flow.'),
      maize: entry('maize', 2.0, 3.6, 4.7, 6.1, 'Déc – Jan', 'Dec – Jan', 'Fév – Avr', 'Feb – Apr', 'Maïs pluvial + haricot pois du Cap', 'Rainfed maize + Cape lima bean', 'Éviter semis à sec ; privilégier variétés 90–100 jours.', 'Avoid dry sowing; adopt 90–100 day drought varieties.'),
      cassava: entry('cassava', 1.5, 3.5, 8.0, 11.4, 'Nov – Jan', 'Nov – Jan', 'Juin – Sep', 'Jun – Sep', 'Manioc pluvial en billons retenue d’eau', 'Cassava on water-retaining ridges', 'Paillage intensif sur plateaux Mahafaly & Mikoboka.', 'Heavy mulching across Mahafaly & Mikoboka plateaus.'),
    },
  },
  {
    region: 'Menabe',
    province: 'Toliara',
    climateBandFr: 'Tropical sec Ouest (Morondava)',
    climateBandEn: 'Western Dry Tropical (Morondava)',
    crops: {
      rice: entry('rice', 1.9, 3.6, 5.8, 7.3, 'Déc – Jan', 'Dec – Jan', 'Mar – Mai', 'Mar – May', 'Riz irrigué Dabara & plaines alluviales', 'Dabara irrigated & alluvial rice', 'Réhabiliter les prises d’eau avant déc. et économiser l’eau.', 'Rehabilitate water intakes before Dec and apply intermittent irrigation.'),
      maize: entry('maize', 1.8, 3.4, 4.6, 5.9, 'Nov – Jan', 'Nov – Jan', 'Fév – Mar', 'Feb – Mar', 'Maïs sur baiboho & tanety', 'Maize on alluvial baiboho & uplands', 'Surveiller la sécheresse de janvier à Miandrivazo et Belo.', 'Monitor January dry spells around Miandrivazo and Belo.'),
      cassava: entry('cassava', 1.3, 3.2, 7.5, 11.0, 'Nov – Jan', 'Nov – Jan', 'Mai – Août', 'May – Aug', 'Manioc sur sols sablo-limoneux', 'Cassava on sandy-loam uplands', 'Implanter dès la 1ère pluie pour enracinement profond.', 'Plant on first steady rains to anchor deep root systems.'),
    },
  },

  // Fianarantsoa
  {
    region: "Amoron'i Mania",
    province: 'Fianarantsoa',
    climateBandFr: 'Hautes Terres Sud',
    climateBandEn: 'Southern Highlands',
    crops: {
      rice: entry('rice', 1.2, 2.8, 5.8, 7.4, 'Nov – Déc', 'Nov – Dec', 'Mar – Mai', 'Mar – May', 'Riz irrigué SRI & riz pluvial tanety', 'Irrigated SRI & upland rice', 'Repiquage jeune 8–12 j pour sécuriser la floraison avant froid.', 'Transplant 8–12 day seedlings to beat highland cool spell.'),
      maize: entry('maize', 0.8, 2.4, 3.9, 5.4, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs associé haricot grimpant', 'Maize intercropped with climbing bean', 'Couverture SCV permanente recommandée sur les pentes.', 'Use permanent mulch cover cropping on sloped fields.'),
      cassava: entry('cassava', 0.8, 2.6, 7.6, 10.8, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc d’altitude (cycle 8–9 mois)', 'Highland cassava (8–9 month cycle)', 'Valoriser le compost de ferme au bouturage.', 'Apply farm compost at planting for stronger tuber fill.'),
    },
  },
  {
    region: 'Haute Matsiatra',
    province: 'Fianarantsoa',
    climateBandFr: 'Hautes Terres Sud & Bassin Matsiatra',
    climateBandEn: 'Southern Highlands & Matsiatra Basin',
    crops: {
      rice: entry('rice', 1.2, 2.9, 5.9, 7.5, 'Nov – Déc', 'Nov – Dec', 'Avr – Mai', 'Apr – May', 'Riz SRI & tanety (variétés 115–120 j)', 'SRI irrigated & 115–120d upland rice', 'Économie d’eau par assec alterné en cas d’étiage Matsiatra.', 'Use alternate wetting & drying if river levels dip.'),
      maize: entry('maize', 1.0, 2.6, 4.1, 5.6, 'Oct – Déc', 'Oct – Dec', 'Fév – Mar', 'Feb – Mar', 'Maïs jaune & blanc associé soja', 'Maize intercropped with soybean', 'Semis précoce dès fin octobre après 15–20 mm.', 'Sow early from late October once 15–20 mm accumulates.'),
      cassava: entry('cassava', 0.9, 2.8, 7.8, 11.0, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc de colline anti-soudure', 'Hillside cassava lean-season buffer', 'Maintenir bandes enherbées de vétiver contre l’érosion.', 'Keep vetiver grass strips against intense rain runoff.'),
    },
  },
  {
    region: 'Ihorombe',
    province: 'Fianarantsoa',
    climateBandFr: 'Plateau intermédiaire Horombe',
    climateBandEn: 'Horombe Intermediate Plateau',
    crops: {
      rice: entry('rice', 1.8, 3.4, 5.9, 7.4, 'Nov – Jan', 'Nov – Jan', 'Avr – Mai', 'Apr – May', 'Riz de plaine d’Ihosy & bas-fonds', 'Ihosy plain & valley-bottom rice', 'Décalage possible vers décembre selon l’arrivée du flux.', 'Shift toward December if early monsoon onset lags.'),
      maize: entry('maize', 1.6, 3.2, 4.4, 5.9, 'Nov – Jan', 'Nov – Jan', 'Fév – Mar', 'Feb – Mar', 'Maïs rustique cycle 100 j', 'Hardy 100-day maize', 'Associer légumineuses pour limiter la perte d’humidité.', 'Intercrop legumes to reduce plateau moisture evaporation.'),
      cassava: entry('cassava', 1.4, 3.2, 8.0, 11.3, 'Nov – Jan', 'Nov – Jan', 'Juin – Sep', 'Jun – Sep', 'Manioc plateau résistant sécheresse', 'Drought-tolerant plateau cassava', 'Stocker les boutures saines en pépinière ombragée.', 'Maintain healthy stem cuttings in shaded nurseries.'),
    },
  },
  {
    region: 'Vatovavy',
    province: 'Fianarantsoa',
    climateBandFr: 'Côte Sud-Est humide',
    climateBandEn: 'Humid South-East Coast',
    crops: {
      rice: entry('rice', 1.2, 3.2, 5.8, 7.8, 'Nov – Jan', 'Nov – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz vakiambiaty & rizières côtières', 'Coastal vakiambiaty rice', 'Assurer le drainage contre les pluies intenses déc.–fév.', 'Ensure field drainage against heavy Dec–Feb storms.'),
      maize: entry('maize', 0.9, 2.7, 3.8, 5.4, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs pluvial sur tanety drainés', 'Rainfed maize on well-drained slopes', 'Semis sur billons pour éviter l’asphyxie racinaire.', 'Plant on raised ridges to prevent root waterlogging.'),
      cassava: entry('cassava', 0.8, 3.0, 7.6, 10.9, 'Oct – Jan', 'Oct – Jan', 'Mai – Août', 'May – Aug', 'Manioc doux & amer sur collines', 'Sweet & bitter cassava on hills', 'Excellente résilience cyclonique comparée aux céréales.', 'High wind/cyclone resilience compared to tall cereals.'),
    },
  },
  {
    region: 'Fitovinany',
    province: 'Fianarantsoa',
    climateBandFr: 'Côte Sud-Est (Manakara / Vohipeno)',
    climateBandEn: 'South-East Coast (Manakara / Vohipeno)',
    crops: {
      rice: entry('rice', 1.2, 3.2, 5.9, 7.9, 'Nov – Jan', 'Nov – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz de plaine & cycle intermédiaire', 'Lowland & intermediate-season rice', 'Réhabiliter les digues et prévenir la submersion prolongée.', 'Reinforce dikes and prepare flood-tolerant varieties.'),
      maize: entry('maize', 0.9, 2.7, 3.9, 5.5, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs de pente associé cultures de rente', 'Slope maize with agroforestry crops', 'Récolte précoce avant le pic cyclonique de février-mars.', 'Harvest early ahead of the Feb–Mar cyclone window.'),
      cassava: entry('cassava', 0.9, 3.0, 7.6, 11.0, 'Oct – Jan', 'Oct – Jan', 'Mai – Août', 'May – Aug', 'Manioc d’appoint en billons drainants', 'Cassava on drained mounds', 'Récolte échelonnée d’hiver austral pour sécurité vivrière.', 'Staggered winter harvest ensures lean-season food security.'),
    },
  },
  {
    region: 'Atsimo-Atsinanana',
    province: 'Fianarantsoa',
    climateBandFr: 'Extrême Sud-Est (Vangaindrano / Farafangana)',
    climateBandEn: 'Far South-East (Vangaindrano / Farafangana)',
    crops: {
      rice: entry('rice', 1.4, 3.3, 6.0, 8.0, 'Nov – Jan', 'Nov – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz de bas-fonds & riz hosy', 'Valley-bottom & hosy rice', 'Contrôler le drainage en déc. tout en surveillant les poches sèches.', 'Balance Dec drainage with dry-pocket vigilance inland.'),
      maize: entry('maize', 1.1, 2.9, 4.0, 5.6, 'Oct – Déc', 'Oct – Dec', 'Fév – Mar', 'Feb – Mar', 'Maïs cycle court 95–105 j', '95–105 day maize', 'Sécuriser les semences après épisode dépressionnaire.', 'Keep emergency seed reserves after tropical storms.'),
      cassava: entry('cassava', 1.0, 3.1, 7.8, 11.1, 'Oct – Jan', 'Oct – Jan', 'Mai – Août', 'May – Aug', 'Manioc associé giroflier / caféier', 'Cassava intercropped in agroforestry', 'Culture stratégique après passage cyclonique.', 'Primary post-cyclone food recovery crop.'),
    },
  },

  // Toamasina
  {
    region: 'Alaotra-Mangoro',
    province: 'Toamasina',
    climateBandFr: 'Cuvette centrale (Premier grenier à riz)',
    climateBandEn: 'Central Basin (Madagascar Rice Basket)',
    crops: {
      rice: entry('rice', 1.2, 3.2, 6.0, 8.1, 'Nov – Jan', 'Nov – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz irrigué PC15/23 & riz pluvial tanety', 'PC15/23 irrigated & upland rice', 'Curage HIMO des canaux vitaux face au recul pluvial El Niño.', 'Prioritize HIMO canal clearing against El Niño basin rainfall dip.'),
      maize: entry('maize', 0.9, 2.5, 3.9, 5.4, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs SCV sur tanety & baiboho', 'No-till SCV maize on uplands', 'Semis direct sous couvert pour limiter le stress thermique.', 'Direct-seed under crop mulch to buffer heat spikes.'),
      cassava: entry('cassava', 0.9, 2.8, 7.5, 10.7, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc sur collines périphériques', 'Cassava on basin perimeter hills', 'Diversification en cas de retard de remplissage du lac Alaotra.', 'Key diversification buffer if Lake Alaotra levels drop.'),
    },
  },
  {
    region: 'Atsinanana',
    province: 'Toamasina',
    climateBandFr: 'Littoral Est humide (Toamasina / Vatomandry)',
    climateBandEn: 'Humid East Coast (Toamasina / Vatomandry)',
    crops: {
      rice: entry('rice', 1.1, 3.1, 5.8, 7.9, 'Nov – Jan', 'Nov – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz pluvial tavy amélioré & plaine', 'Improved upland & coastal plain rice', 'Drainage des bas-fonds et variétés à tige forte anti-verse.', 'Drain lowlands and use sturdy-stem flood-resilient rice.'),
      maize: entry('maize', 0.8, 2.6, 3.6, 5.2, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs sur terres exondées', 'Maize on raised coastal soils', 'Récolte rapide pour limiter les pertes post-récolte humides.', 'Harvest promptly and dry kernels above humidity.'),
      cassava: entry('cassava', 0.8, 3.0, 7.4, 10.8, 'Oct – Jan', 'Oct – Jan', 'Mai – Août', 'May – Aug', 'Manioc sur buttes anti-saturation', 'Cassava on anti-waterlogging mounds', 'Éviter stagnation d’eau au collet durant déc.–fév.', 'Avoid standing water around tubers in Dec–Feb.'),
    },
  },
  {
    region: 'Analanjirofo',
    province: 'Toamasina',
    climateBandFr: 'Côte Nord-Est humide (Fenoarivo / Maroantsetra)',
    climateBandEn: 'Humid North-East Coast (Fenoarivo / Maroantsetra)',
    crops: {
      rice: entry('rice', 0.9, 2.8, 5.5, 7.6, 'Oct – Déc', 'Oct – Dec', 'Mar – Mai', 'Mar – May', 'Riz précoce sur parcelles drainées', 'Early rice on drained plots', 'Semis avancé face à l’excès de pluies SWIOCOF-15 (nov.–janv.).', 'Advance planting due to SWIOCOF-15 early heavy rain signal.'),
      maize: entry('maize', 0.7, 2.4, 3.4, 4.9, 'Oct – Déc', 'Oct – Dec', 'Jan – Fév', 'Jan – Feb', 'Maïs associé légumineuses sur buttes', 'Mound-grown maize with legumes', 'Privilégier pentes drainées pour éviter la pourriture.', 'Use sloped well-drained terraces to avoid root rot.'),
      cassava: entry('cassava', 0.7, 2.8, 7.2, 10.5, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc doux & agroforesterie girofle', 'Cassava under clove/vanilla agroforestry', 'Assurance vivrière majeure contre les crues littorales.', 'Major food safety net against coastal flood surges.'),
    },
  },

  // Mahajanga
  {
    region: 'Boeny',
    province: 'Mahajanga',
    climateBandFr: 'Nord-Ouest (Plaines de Marovoay)',
    climateBandEn: 'North-West (Marovoay Plains)',
    crops: {
      rice: entry('rice', 1.8, 3.6, 6.2, 8.2, 'Déc – Jan', 'Dec – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz asara & contre-saison vary jeby', 'Asara & dry-season vary jeby rice', 'Décaler le semis pluvial à décembre (retard flux Nord-Ouest).', 'Shift rainfed sowing to December per NW delayed-onset signal.'),
      maize: entry('maize', 1.8, 3.3, 4.5, 5.9, 'Déc – Jan', 'Dec – Jan', 'Fév – Mar', 'Feb – Mar', 'Maïs sur baiboho de la Betsiboka', 'Maize on Betsiboka baiboho banks', 'Associer arachide en bandes alternées anti-stress.', 'Alternate with groundnut strips to protect soil moisture.'),
      cassava: entry('cassava', 1.4, 3.3, 7.8, 11.1, 'Nov – Jan', 'Nov – Jan', 'Mai – Août', 'May – Aug', 'Manioc sur tanety sableux', 'Cassava on sandy upland ridges', 'Vigilance criquets ; paillage autour des boutures.', 'Monitor locust activity; apply mulch around cuttings.'),
    },
  },
  {
    region: 'Sofia',
    province: 'Mahajanga',
    climateBandFr: 'Nord-Ouest intérieur (Antsohihy / Bealanana)',
    climateBandEn: 'Inland North-West (Antsohihy / Bealanana)',
    crops: {
      rice: entry('rice', 1.7, 3.5, 6.0, 8.0, 'Déc – Jan', 'Dec – Jan', 'Avr – Juin', 'Apr – Jun', 'Riz de cuvette (Bealanana) & plaines', 'Bealanana basin & plain rice', 'Démarrer dès la stabilisation des pluies en décembre.', 'Begin sowing once December rains stabilize.'),
      maize: entry('maize', 1.6, 3.2, 4.3, 5.8, 'Déc – Jan', 'Dec – Jan', 'Fév – Mar', 'Feb – Mar', 'Maïs pluvial 105–115 j', '105–115d rainfed maize', 'Compléter avec sorgho/arachide sur les zones sèches ouest.', 'Supplement western dry pockets with sorghum/groundnut.'),
      cassava: entry('cassava', 1.3, 3.2, 7.7, 11.0, 'Nov – Jan', 'Nov – Jan', 'Mai – Août', 'May – Aug', 'Manioc de colline (cycle 7–8 mois)', 'Hillside cassava (7–8 month cycle)', 'Plantation rapide post-1ère pluie utile.', 'Plant promptly after first effective soaking rainfall.'),
    },
  },
  {
    region: 'Betsiboka',
    province: 'Mahajanga',
    climateBandFr: 'Axe Centre-Nord-Ouest (Maevatanana)',
    climateBandEn: 'Central North-West Axis (Maevatanana)',
    crops: {
      rice: entry('rice', 1.8, 3.5, 5.9, 7.6, 'Déc – Jan', 'Dec – Jan', 'Avr – Mai', 'Apr – May', 'Riz de plaine alluviale Betsiboka', 'Betsiboka alluvial plain rice', 'Sécuriser les prises gravitaires et curer les canaux secondaires.', 'Secure gravity intakes and clear secondary irrigation canals.'),
      maize: entry('maize', 1.7, 3.3, 4.4, 5.8, 'Déc – Jan', 'Dec – Jan', 'Fév – Mar', 'Feb – Mar', 'Maïs pluvial sur tanety', 'Upland rainfed maize', 'Variétés tolérantes à la chaleur (+2,5 °C projetés).', 'Use heat-tolerant hybrids/varieties (+2.5 °C forecast).'),
      cassava: entry('cassava', 1.4, 3.3, 7.8, 11.1, 'Nov – Jan', 'Nov – Jan', 'Mai – Août', 'May – Aug', 'Manioc résilient sur plateaux secs', 'Resilient cassava on dry plateaus', 'Couverture végétale contre le ruissellement brutal.', 'Maintain vegetative cover against intense storm runoff.'),
    },
  },
  {
    region: 'Melaky',
    province: 'Mahajanga',
    climateBandFr: 'Centre-Ouest (Maintirano)',
    climateBandEn: 'Mid-West Coast (Maintirano)',
    crops: {
      rice: entry('rice', 1.9, 3.6, 5.9, 7.6, 'Déc – Jan', 'Dec – Jan', 'Avr – Mai', 'Apr – May', 'Riz de plaine & marais côtiers', 'Plain & coastal marshland rice', 'Attendre cumul 25 mm avant semis pluvial en déc.', 'Wait for 25 mm cumulative rain before Dec upland sowing.'),
      maize: entry('maize', 1.8, 3.5, 4.5, 6.0, 'Déc – Jan', 'Dec – Jan', 'Fév – Avr', 'Feb – Apr', 'Maïs 95–105 j en plaine', '95–105d lowland maize', 'Associer pois du Cap / arachide pour sécuriser le revenu.', 'Intercrop with Cape bean/groundnut to stabilize income.'),
      cassava: entry('cassava', 1.4, 3.4, 7.9, 11.2, 'Nov – Jan', 'Nov – Jan', 'Juin – Sep', 'Jun – Sep', 'Manioc tolérant sécheresse côtière', 'Coastal drought-tolerant cassava', 'Boutures en poquets profonds sur sols légers.', 'Plant cuttings in deep basins on sandy coastal soils.'),
    },
  },

  // Antananarivo
  {
    region: 'Analamanga',
    province: 'Antananarivo',
    climateBandFr: 'Hautes Terres Centrales',
    climateBandEn: 'Central Highlands',
    crops: {
      rice: entry('rice', 1.1, 2.7, 5.7, 7.3, 'Nov – Déc', 'Nov – Dec', 'Mar – Mai', 'Mar – May', 'Riz irrigué SRI/SRA (Betsimitatatra)', 'Irrigated SRI/SRA rice (Betsimitatatra)', 'Repiquage jeune 8–12 j dès mise en eau pour éviter soudure.', 'Transplant 8–12d seedlings promptly to stabilize urban supply.'),
      maize: entry('maize', 0.8, 2.4, 3.8, 5.3, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs SCV sur tanety péri-urbains', 'Peri-urban SCV upland maize', 'Association haricot/soja avec paillage anti-évaporation.', 'Intercrop bean/soybean under moisture-saving mulch.'),
      cassava: entry('cassava', 0.8, 2.6, 7.5, 10.7, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc d’altitude sur tanety', 'Highland upland cassava', 'Rotation maïs–manioc pour reconstituer la fertilité.', 'Rotate maize and cassava to preserve soil organic matter.'),
    },
  },
  {
    region: 'Vakinankaratra',
    province: 'Antananarivo',
    climateBandFr: 'Hautes Terres volcaniques (Antsirabe)',
    climateBandEn: 'Volcanic Highlands (Antsirabe)',
    crops: {
      rice: entry('rice', 1.1, 2.7, 5.8, 7.4, 'Nov – Déc', 'Nov – Dec', 'Avr – Mai', 'Apr – May', 'Riz d’altitude tolérant au froid', 'Cold-tolerant highland rice', 'Respecter calendrier nov. avant baisse thermique d’avril.', 'Keep November transplanting window ahead of April cool spell.'),
      maize: entry('maize', 0.7, 2.3, 3.8, 5.3, 'Oct – Nov', 'Oct – Nov', 'Jan – Mar', 'Jan – Mar', 'Maïs fourrager & grain associé pomme de terre', 'Grain/fodder maize with potato', 'Semis précoce oct.–nov. sur sols volcaniques riches.', 'Plant early Oct–Nov on moisture-retentive volcanic soils.'),
      cassava: entry('cassava', 0.8, 2.5, 7.6, 10.8, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc en zones abritées Ouest', 'Cassava in sheltered western valleys', 'Privilégier versants chauds de Betafo et Mandoto.', 'Focus on warmer slopes around Betafo and Mandoto.'),
    },
  },
  {
    region: 'Itasy',
    province: 'Antananarivo',
    climateBandFr: 'Moyen-Ouest volcanique (Miarinarivo)',
    climateBandEn: 'Volcanic Mid-West (Miarinarivo)',
    crops: {
      rice: entry('rice', 1.2, 2.9, 5.8, 7.4, 'Nov – Déc', 'Nov – Dec', 'Mar – Mai', 'Mar – May', 'Riz SRI & tanety (variétés 115 j)', 'SRI & 115d upland rice', 'Système de Riziculture Intensive avec gestion fine des barrages.', 'Run SRI water-saving cycles across local micro-dams.'),
      maize: entry('maize', 0.9, 2.5, 3.9, 5.4, 'Oct – Déc', 'Oct – Dec', 'Jan – Mar', 'Jan – Mar', 'Maïs associé arachide / haricot', 'Maize intercropped with peanut / bean', 'Bandes enherbées Brachiaria sur tanety volcaniques.', 'Protect volcanic hillsides with Brachiaria contour strips.'),
      cassava: entry('cassava', 0.9, 2.7, 7.5, 10.7, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc de colline haute productivité', 'High-yield hillside cassava', 'Complément alimentaire et revenu clé vers Antananarivo.', 'Key food & cash supply corridor for Antananarivo.'),
    },
  },
  {
    region: 'Bongolava',
    province: 'Antananarivo',
    climateBandFr: 'Moyen-Ouest sec (Tsiroanomandidy)',
    climateBandEn: 'Mid-West Savanna (Tsiroanomandidy)',
    crops: {
      rice: entry('rice', 1.5, 3.2, 5.9, 7.5, 'Nov – Jan', 'Nov – Jan', 'Avr – Mai', 'Apr – May', 'Riz pluvial tanety & bas-fonds', 'Upland & valley-bottom rice', 'Utiliser riz pluvial cycle 105–115 j sous SCV.', 'Adopt 105–115d upland rice under SCV cover.'),
      maize: entry('maize', 1.2, 2.9, 4.1, 5.6, 'Nov – Déc', 'Nov – Dec', 'Fév – Mar', 'Feb – Mar', 'Grand bassin maïsicole du Moyen-Ouest', 'Major Mid-West maize belt', 'Paillage anti-évaporation face aux pauses pluviométriques.', 'Apply mulch cover against mid-season dry spells.'),
      cassava: entry('cassava', 1.0, 2.9, 7.6, 10.9, 'Nov – Jan', 'Nov – Jan', 'Mai – Août', 'May – Aug', 'Manioc extensif de savane', 'Savanna upland cassava', 'Culture de sécurité contre les aléas céréaliers.', 'Critical backup if upland cereals face drought.'),
    },
  },

  // Antsiranana
  {
    region: 'Diana',
    province: 'Antsiranana',
    climateBandFr: 'Extrême Nord (Ambilobe / Nosy Be)',
    climateBandEn: 'Far North (Ambilobe / Nosy Be)',
    crops: {
      rice: entry('rice', 0.9, 2.4, 5.1, 6.9, 'Oct – Nov', 'Oct – Nov', 'Mar – Avr', 'Mar – Apr', 'Riz précoce & plaine de la Mahavavy', 'Early rice & Mahavavy plains', 'Semis précoce novembre sur parcelles drainées (excès pluies NW/N).', 'Plant early in November on drained plots to avoid Dec flood peak.'),
      maize: entry('maize', 0.8, 2.3, 3.4, 4.9, 'Oct – Nov', 'Oct – Nov', 'Jan – Fév', 'Jan – Feb', 'Maïs associé arachide / niébé', 'Maize with groundnut / cowpea', 'Drainage actif des interlignes avant les averses de janvier.', 'Keep inter-row drainage open before January downpours.'),
      cassava: entry('cassava', 0.7, 2.6, 7.2, 10.4, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc sur billons exondés', 'Cassava on elevated ridges', 'Prévenir le pourrissement racinaire sur sols lourds.', 'Prevent tuber rot by planting on elevated mounds.'),
    },
  },
  {
    region: 'SAVA',
    province: 'Antsiranana',
    climateBandFr: 'Nord-Est humide (Sambava / Antalaha)',
    climateBandEn: 'Humid North-East (Sambava / Antalaha)',
    crops: {
      rice: entry('rice', 0.8, 2.3, 4.9, 6.8, 'Oct – Nov', 'Oct – Nov', 'Fév – Avr', 'Feb – Apr', 'Riz précoce drainé + cycle 2 mai–sept.', 'Early drained rice + off-season', 'Curage préventif des drains avant les pluies intenses nov.–janv.', 'Clear drainage channels ahead of intense Nov–Jan rainfall.'),
      maize: entry('maize', 0.7, 2.2, 3.2, 4.7, 'Oct – Nov', 'Oct – Nov', 'Jan – Fév', 'Jan – Feb', 'Maïs intercalaire sur terres drainées', 'Intercropped maize on drained land', 'Récolte précoce pour séchage avant le pic d’humidité.', 'Harvest early to dry grain before peak humidity.'),
      cassava: entry('cassava', 0.7, 2.6, 7.2, 10.5, 'Oct – Déc', 'Oct – Dec', 'Mai – Août', 'May – Aug', 'Manioc vivrier sous agroforesterie', 'Cassava within vanilla/clove plots', 'Culture d’appoint résiliente aux excès pluvieux sur buttes.', 'Reliable food supplement on raised mounds during heavy rains.'),
    },
  },
];
