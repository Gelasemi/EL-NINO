import {
  DUPLICATED_195_COUNTRIES,
  type ClimateZoneId,
  type DuplicatedWorldCountry,
  type UnZoneId,
} from '../data/worldEnso195Data';
import type {
  EngineeringSuitability,
  EnsoTrajectoryPhase,
  SeasonalCropDirective,
  SeasonalQuarterId,
} from '../data/adamSmithAgroData';

export const FORTNIGHT_INTERVAL_DAYS = 15;
export const FORTNIGHT_INTERVAL_MS = FORTNIGHT_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

export interface BiweeklyAgroSyncState {
  enabled: boolean;
  intervalDays: number;
  cycleNumber: number;
  lastUpdatedAtIso: string;
  nextUpdateAtIso: string;
  activePhase: EnsoTrajectoryPhase;
  oniObservedC: number;
  rainAnomPct: number;
  trajectoryNoteFr: string;
  trajectoryNoteEn: string;
  source: 'server-15d-cron' | 'manual-trajectory-sync' | 'client-baseline';
}

export function formatBiweeklyCountdown(targetIso: string): string {
  const diffMs = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hrs = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${days}j ${String(hrs).padStart(2, '0')}h:${String(mins).padStart(2, '0')}m:${String(secs).padStart(2, '0')}s`;
}

export function inferEnsoPhaseFromOni(oniC: number): EnsoTrajectoryPhase {
  if (oniC >= 0.5) return 'el-nino';
  if (oniC <= -0.5) return 'la-nina';
  return 'neutral';
}

export interface CountryAgroOverride {
  nicheFr: string;
  nicheEn: string;
  infraFr: string;
  infraEn: string;
  elNinoCropsFr: string;
  elNinoCropsEn: string;
  laNinaCropsFr: string;
  laNinaCropsEn: string;
  engineeringBonus?: Partial<EngineeringSuitability>;
}

const COUNTRY_OVERRIDES: Record<string, CountryAgroOverride> = {
  MG: {
    nicheFr: 'Riz irrigué (Alaotra/Marovoay), vanille Bourbon (SAVA), girofle, cacao Sambirano, sorgho Grand Sud',
    nicheEn: 'Irrigated rice (Alaotra/Marovoay), Bourbon vanilla (SAVA), clove, Sambirano cacao, Grand Sud sorghum',
    infraFr: 'Irrigation contrôlée + barrages Alaotra/Mangoky + serres maraîchères/séchage + Zaï Grand Sud',
    infraEn: 'Controlled drip/canal irrigation + Alaotra/Mangoky dams + drying greenhouses + Grand Sud Zaï pits',
    elNinoCropsFr: 'Sorgho/mil 90 j (Sud), riz SRI cycle court, manioc, vanille sous ombrage 50 %',
    elNinoCropsEn: '90d sorghum/millet (South), short-cycle SRI rice, cassava, 50% shaded vanilla',
    laNinaCropsFr: 'Riz pluvial & submergible, maïs, pois du Cap, cacao, girofle avec drainage',
    laNinaCropsEn: 'Upland & flood-safe rice, maize, Cape lima bean, cacao & clove with drainage',
  },
  KE: {
    nicheFr: 'Thé d’altitude, horticulture sous serre (Naivasha), café arabica, maïs Rift Valley',
    nicheEn: 'Highland tea, greenhouse horticulture (Naivasha), Arabica coffee, Rift Valley maize',
    infraFr: 'Serres hydroponiques Naivasha + bassins de rétention anti-crues Tana + irrigation goutte-à-goutte',
    infraEn: 'Naivasha greenhouses + Tana flood-retention dams + arid-zone drip irrigation',
    elNinoCropsFr: 'Riz bas-fonds drainés, sorgho & légumes sous serre ventilée hors crues',
    elNinoCropsEn: 'Drained lowland rice, sorghum & elevated flood-safe greenhouse vegetables',
    laNinaCropsFr: 'Sorgho, mil perlé, dolique & cultures irriguées par goutte-à-goutte face à la sécheresse Est-africaine',
    laNinaCropsEn: 'Sorghum, pearl millet, lablab & drip-irrigated horticulture during La Niña drought',
    engineeringBonus: { greenhouses: 94, floodDrainage: 92, controlledIrrigation: 88 },
  },
  ET: {
    nicheFr: 'Café arabica, teff résilient, blé irrigué de plaine, légumineuses & horticulture Rift',
    nicheEn: 'Arabica coffee, resilient teff, irrigated lowland wheat, pulses & Rift horticulture',
    infraFr: 'Barrages multi-usages & micro-retenues collinaires + serres floricoles/maraîchères',
    infraEn: 'Multi-purpose dams & hillside micro-reservoirs + Rift flower/vegetable greenhouses',
    elNinoCropsFr: 'Teff précoce, blé irrigué, pois chiche & café sous ombrage agroforestier',
    elNinoCropsEn: 'Early teff, irrigated wheat, chickpea & shaded agroforestry coffee',
    laNinaCropsFr: 'Sorgho résilient sécheresse, niébé, irrigation d’appoint dans le Sud/Est pastoral',
    laNinaCropsEn: 'Drought-hardy sorghum, cowpea & supplemental drip in pastoral East/South',
    engineeringBonus: { damsAndReservoirs: 95, controlledIrrigation: 90 },
  },
  ZA: {
    nicheFr: 'Maïs mécanisé, agrumes & fruits d’exportation irrigués, viticulture Cap, soja',
    nicheEn: 'Commercial maize, irrigated export citrus, Western Cape wine/fruit & soybean',
    infraFr: 'Irrigation goutte-à-goutte vergers + serres haute technologie + grands barrages (Vaal/Gariep)',
    infraEn: 'Precision orchard drip + high-tech greenhouses + Vaal/Gariep reservoir management',
    elNinoCropsFr: 'Sorgho, tournesol, soja résilient & agrumes sous goutte-à-goutte strict',
    elNinoCropsEn: 'Sorghum, sunflower, drought-hardy soy & precision drip-irrigated citrus',
    laNinaCropsFr: 'Maïs blanc/jaune plein rendement, blé, fruits tempérés avec protection anti-grêle',
    laNinaCropsEn: 'Full-season white/yellow maize, wheat & hail-netted temperate fruits',
    engineeringBonus: { controlledIrrigation: 95, greenhouses: 90, damsAndReservoirs: 92 },
  },
  ZM: {
    nicheFr: 'Maïs, soja, blé d’hiver irrigué, sucre & aquaculture bassin Zambèze',
    nicheEn: 'Maize, soybean, irrigated winter wheat, sugarcane & Zambezi aquaculture',
    infraFr: 'Barrages hydro-agricoles (Kafue/Kariba), pivots/goutte-à-goutte solaire & agriculture de conservation',
    infraEn: 'Hydro-agricultural reservoirs, solar drip/pivots & conservation farming basins',
    elNinoCropsFr: 'Manioc, sorgho, soja cycle court, blé irrigué d’hiver',
    elNinoCropsEn: 'Cassava, sorghum, short-cycle soybean & irrigated winter wheat',
    laNinaCropsFr: 'Maïs grain intensif, arachide, riz de plaine Kafue',
    laNinaCropsEn: 'Intensive grain maize, groundnut & Kafue floodplain rice',
    engineeringBonus: { controlledIrrigation: 96, damsAndReservoirs: 94 },
  },
  MA: {
    nicheFr: 'Agrumes, tomate/fruits rouges sous serre (Souss-Massa), olivier, blé dur & dattes',
    nicheEn: 'Citrus, greenhouse berries/tomatoes (Souss-Massa), olive, durum wheat & dates',
    infraFr: 'Dessalement agricole + serres canariennes/goutte-à-goutte + barrages de bassin',
    infraEn: 'Desalination-fed drip greenhouses (Souss) + watershed retention dams',
    elNinoCropsFr: 'Tomate/myrtille sous serre goutte-à-goutte, olivier, orge tolérante',
    elNinoCropsEn: 'Drip greenhouse tomato/berries, olive groves & drought-hardy barley',
    laNinaCropsFr: 'Blé tendre/dur, légumineuses d’hiver, agrumes et fourrages',
    laNinaCropsEn: 'Soft/durum wheat, winter pulses, citrus & irrigated forage',
    engineeringBonus: { greenhouses: 96, controlledIrrigation: 97, damsAndReservoirs: 93 },
  },
  EG: {
    nicheFr: 'Cultures irriguées du delta du Nil (coton, riz, agrumes, blé, maraîchage serre)',
    nicheEn: 'Nile Delta irrigated crops (cotton, rice, citrus, wheat, greenhouse vegetables)',
    infraFr: 'Modernisation canaux goutte-à-goutte + serres climatiques désertiques (100 000 feddans)',
    infraEn: 'Canal-to-drip conversion + desert climate greenhouses + Nile flow storage (Aswan)',
    elNinoCropsFr: 'Tomate/poivron sous serre refroidie, coton économe en eau, blé d’hiver',
    elNinoCropsEn: 'Cooled greenhouse tomato/pepper, water-saving cotton & winter wheat',
    laNinaCropsFr: 'Riz du Delta, maïs irrigué, agrumes & canne à sucre Haute-Égypte',
    laNinaCropsEn: 'Delta paddy rice, irrigated maize, citrus & Upper Egypt sugarcane',
    engineeringBonus: { greenhouses: 95, controlledIrrigation: 98, damsAndReservoirs: 90 },
  },
  NG: {
    nicheFr: 'Manioc (1er producteur mondial), igname, cacao, sorgho/mil Nord, riz irrigué',
    nicheEn: 'Cassava (#1 global producer), yam, cacao, Northern sorghum/millet & irrigated rice',
    infraFr: 'Barrages bassins Niger/Bénoué + drainage delta + goutte-à-goutte ceinture sahélienne',
    infraEn: 'Niger/Benue irrigation dams + Delta flood drainage + northern Sahelian drip',
    elNinoCropsFr: 'Sorgho, mil & niébé au Nord ; manioc & cacao sous ombrage au Sud',
    elNinoCropsEn: 'Northern sorghum, millet & cowpea; shaded cacao & cassava in the South',
    laNinaCropsFr: 'Riz irrigué & de crue, maïs, igname sur buttes drainées',
    laNinaCropsEn: 'Irrigated & floodplain rice, maize & mounded yam',
    engineeringBonus: { damsAndReservoirs: 88, controlledIrrigation: 86, floodDrainage: 86 },
  },
  SN: {
    nicheFr: 'Arachide, maraîchage export (Niayes), riz vallée du fleuve Sénégal, mil/sorgho',
    nicheEn: 'Groundnut, Niayes export horticulture, Senegal River valley rice & millet/sorghum',
    infraFr: 'Barrages Diama/Manantali + goutte-à-goutte Niayes + ombrières maraîchères & Zaï',
    infraEn: 'Diama/Manantali river irrigation + Niayes solar drip + shade greenhouses & Zaï',
    elNinoCropsFr: 'Mil souna 85 j, niébé, mangue/tomate cerise goutte-à-goutte dans les Niayes',
    elNinoCropsEn: '85d millet, cowpea, Niayes drip mango & cherry tomato',
    laNinaCropsFr: 'Riz vallée du Fleuve, arachide, maïs & sésame',
    laNinaCropsEn: 'Senegal River valley rice, groundnut, maize & sesame',
    engineeringBonus: { controlledIrrigation: 94, greenhouses: 84, damsAndReservoirs: 90 },
  },
  CI: {
    nicheFr: 'Cacao (1er mondial), anacarde, hévéa, café, palmier & riz de bas-fonds',
    nicheEn: 'Cacao (#1 global producer), cashew, rubber, coffee, oil palm & valley rice',
    infraFr: 'Agroforesterie d’ombrage cacao + micro-barrages Nord anacarde/riz + serres séchage solaire',
    infraEn: 'Cacao shade agroforestry + northern cashew/rice micro-dams + solar drying greenhouses',
    elNinoCropsFr: 'Cacao sous ombrage dense (Gliricidia), anacarde Nord, manioc & banane plantain',
    elNinoCropsEn: 'Dense-shade cacao, northern cashew, cassava & plantain',
    laNinaCropsFr: 'Cacao, riz de bas-fonds, igname & maïs sur parcelles drainées',
    laNinaCropsEn: 'Cacao, lowland valley rice, yam & drained maize',
    engineeringBonus: { agroforestrySoil: 96, greenhouses: 76, controlledIrrigation: 78 },
  },
  BR: {
    nicheFr: 'Soja, maïs safrinha, canne à sucre, café arabica/conilon, agrumes & élevage',
    nicheEn: 'Soybean, safrinha maize, sugarcane, Arabica/Conilon coffee, citrus & cattle',
    infraFr: 'Irrigation par pivots Cerrado + ombrage café + drainage/retenues Nord-Est semi-aride',
    infraEn: 'Cerrado pivot irrigation + shaded coffee + Northeast reservoir dams & drainage',
    elNinoCropsFr: 'Soja & maïs cycle court au Nord/Nord-Est ; blé/soja irrigués Sud avec drainage',
    elNinoCropsEn: 'Short-cycle soy/maize in NE; flood-drained soy & winter wheat in South Brazil',
    laNinaCropsFr: 'Maïs & soja irrigués au Sud (Rio Grande do Sul) + canne/café plein potentiel',
    laNinaCropsEn: 'Irrigated soy/maize in drought-prone South Brazil + peak Center-West coffee',
    engineeringBonus: { controlledIrrigation: 88, damsAndReservoirs: 86, floodDrainage: 84 },
  },
  PE: {
    nicheFr: 'Cultures côtières haute valeur (myrtille, avocat, asperge), pomme de terre andine & quinoa',
    nicheEn: 'High-value coastal exports (blueberry, avocado, asparagus), Andean potato & quinoa',
    infraFr: 'Grands canaux transfert Ande–Côte + goutte-à-goutte désertique + digues anti-El Niño côtier',
    infraEn: 'Andes-to-Coast water tunnels + desert drip irrigation + coastal flood levees',
    elNinoCropsFr: 'Quinoa/pomme de terre résiliente sur hauts plateaux + protection crues côtières Piura',
    elNinoCropsEn: 'Altiplano quinoa/hardy potato + coastal Piura flood defense',
    laNinaCropsFr: 'Myrtille, avocat, raisin & mangue sous goutte-à-goutte côtier intensif',
    laNinaCropsEn: 'Intensive coastal drip blueberry, avocado, table grape & mango',
    engineeringBonus: { controlledIrrigation: 95, floodDrainage: 94, damsAndReservoirs: 92 },
  },
  IN: {
    nicheFr: 'Riz basmati, blé du Pendjab, millets résilients, coton, épices & horticulture sous abri',
    nicheEn: 'Basmati rice, Punjab wheat, climate-resilient millets, cotton, spices & polyhouse veggies',
    infraFr: 'Micro-irrigation goutte-à-goutte (PMKSY), barrages bassins & polyhouses/serres maraîchères',
    infraEn: 'PMKSY micro-irrigation drip, watershed check dams & horticultural polyhouses',
    elNinoCropsFr: 'Millets (bajra/ragi), pois d’Angole, coton résilient & blé d’hiver irrigué',
    elNinoCropsEn: 'Climate-smart millets, pigeonpea, resilient cotton & irrigated Rabi wheat',
    laNinaCropsFr: 'Riz Kharif plein potentiel, canne à sucre, légumineuses avec drainage deltaïque',
    laNinaCropsEn: 'Peak Kharif rice, sugarcane & pulses with eastern delta flood drainage',
    engineeringBonus: { controlledIrrigation: 94, damsAndReservoirs: 94, greenhouses: 84 },
  },
  ID: {
    nicheFr: 'Huile de palme, riz en terrasses, cacao, café, caoutchouc & épices des Moluques',
    nicheEn: 'Palm oil, terraced rice, cacao, coffee, natural rubber & Maluku spices',
    infraFr: 'Réservoirs rizicoles Java + ombrage agroforestier cacao + drainage anti-feux tourbières',
    infraEn: 'Java rice reservoirs + cacao shade agroforestry + peatland water-table locks',
    elNinoCropsFr: 'Riz irrigué cycle court (Gogo/variétés sèches), manioc, maïs & maintien eau tourbières',
    elNinoCropsEn: 'Short-cycle/upland Gogo rice, cassava, maize & peatland fire-prevention locks',
    laNinaCropsFr: 'Riz 2–3 cycles/an, palmier, cacao & piment sous serres parapluie',
    laNinaCropsEn: '2–3x rice cropping, oil palm, cacao & rain-shelter greenhouse chili',
    engineeringBonus: { damsAndReservoirs: 90, floodDrainage: 88, agroforestrySoil: 94 },
  },
  VN: {
    nicheFr: 'Riz du delta du Mékong, café robusta (Hauts Plateaux), poivre, noix de cajou & aquaculture',
    nicheEn: 'Mekong Delta rice, Central Highlands robusta coffee, black pepper, cashew & shrimp-rice',
    infraFr: 'Écluses anti-intrusion saline Mékong + goutte-à-goutte café Hauts Plateaux + serres Da Lat',
    infraEn: 'Mekong anti-salinity sluices + Highlands coffee drip + Da Lat flower/veg greenhouses',
    elNinoCropsFr: 'Modèle crevette–riz tolérant sel dans le Mékong + café irrigué au goutte-à-goutte',
    elNinoCropsEn: 'Salt-tolerant rice-shrimp systems in Mekong + drip-irrigated Highlands coffee',
    laNinaCropsFr: 'Triple récolte rizicole, fruits tropicaux & horticulture Da Lat sous serre',
    laNinaCropsEn: 'Triple paddy harvests, tropical fruit & Da Lat greenhouse horticulture',
    engineeringBonus: { floodDrainage: 92, controlledIrrigation: 90, greenhouses: 88 },
  },
  AU: {
    nicheFr: 'Blé, orge, coton/riz irrigué bassin Murray–Darling, élevage bovin/ovin & viticulture',
    nicheEn: 'Wheat, barley, Murray-Darling irrigated cotton/rice, grazing & viticulture',
    infraFr: 'Réservoirs Murray–Darling, agriculture de précision sans labour, goutte-à-goutte & serres',
    infraEn: 'Murray-Darling water banking, zero-till moisture retention, drip orchards & greenhouses',
    elNinoCropsFr: 'Orge & pois chiche résistants, cultures sous serre (tomates/concombres), déstockage tactique',
    elNinoCropsEn: 'Drought-hardy barley & chickpea, glasshouse produce & tactical herd management',
    laNinaCropsFr: 'Blé, canola, coton & riz irrigué plein volume avec protection contre crues Est',
    laNinaCropsEn: 'Peak wheat, canola, cotton & irrigated rice with East Coast flood drainage',
    engineeringBonus: { controlledIrrigation: 95, damsAndReservoirs: 92, greenhouses: 90 },
  },
  US: {
    nicheFr: 'Maïs/soja Midwest, blé Plaines, horticulture sous serre & Californie irriguée',
    nicheEn: 'Midwest corn/soy, Plains wheat, greenhouse produce & California irrigated specialty crops',
    infraFr: 'Irrigation de précision Californie/Plaines + serres hydroponiques + barrages Bassin Colorado',
    infraEn: 'Precision drip/pivots (CA/Plains) + hydroponic greenhouses + Colorado Basin reservoirs',
    elNinoCropsFr: 'Cultures d’hiver Sud/Californie (amande, agrumes, légumes), sorgho Plaines si sec',
    elNinoCropsEn: 'California/Sunbelt winter crops (citrus, almonds, veggies) & Midwest corn/soy',
    laNinaCropsFr: 'Blé résistant Sud-Ouest sous irrigation goutte-à-goutte + cultures intensives Nord/Midwest',
    laNinaCropsEn: 'Drip-supported Southwest winter crops + strong Northern Plains/Midwest yields',
    engineeringBonus: { controlledIrrigation: 92, greenhouses: 90, damsAndReservoirs: 90 },
  },
  FR: {
    nicheFr: 'Céréales (blé, maïs), viticulture AOC, horticulture sous serre bioclimatique & élevage',
    nicheEn: 'Cereals (wheat, maize), AOC viticulture, bioclimatic greenhouses & dairy/livestock',
    infraFr: 'Retenues collinaires/méga-bassines raisonnées + serres photovoltaïques + goutte-à-goutte vergers',
    infraEn: 'Managed retention basins + agrivoltaic/heated greenhouses + orchard drip irrigation',
    elNinoCropsFr: 'Sorgho & tournesol au Sud (économie eau), blé d’hiver, maraîchage sous serre',
    elNinoCropsEn: 'Water-saving southern sorghum & sunflower, winter wheat & greenhouse produce',
    laNinaCropsFr: 'Maïs grain, betterave, pomme de terre avec drainage hivernal des parcelles',
    laNinaCropsEn: 'Grain maize, sugar beet & potato with winter field drainage management',
    engineeringBonus: { greenhouses: 92, controlledIrrigation: 86, damsAndReservoirs: 82 },
  },
  CN: {
    nicheFr: 'Riz hybride Sud, blé/maïs plaine du Nord, serres solaires maraîchères (1er parc mondial)',
    nicheEn: 'Southern hybrid rice, North China wheat/maize & world-leading solar vegetable greenhouses',
    infraFr: 'Transferts hydrauliques Sud–Nord, grands barrages + millions d’hectares de serres solaires',
    infraEn: 'South-North water transfers, basin dams + massive solar greenhouse horticulture belts',
    elNinoCropsFr: 'Blé/maïs tolérant sécheresse au Nord ; riz résilient & drainage crues au Sud (Yangtsé)',
    elNinoCropsEn: 'Drought-hardy Northern wheat/maize; Yangtze flood-drained rice & solar greenhouse veggies',
    laNinaCropsFr: 'Riz double campagne Sud, soja/maïs Nord-Est & cultures protégées contre vagues froides',
    laNinaCropsEn: 'Double-crop southern rice, NE soy/maize & cold-wave-shielded greenhouses',
    engineeringBonus: { greenhouses: 96, damsAndReservoirs: 95, controlledIrrigation: 90 },
  },
};

interface ZoneTemplate {
  nicheFr: string;
  nicheEn: string;
  infraFr: string;
  infraEn: string;
  elNinoQ4Fr: string;
  elNinoQ4En: string;
  elNinoQ1Fr: string;
  elNinoQ1En: string;
  elNinoQ2Fr: string;
  elNinoQ2En: string;
  elNinoQ3Fr: string;
  elNinoQ3En: string;
  laNinaBaseFr: string;
  laNinaBaseEn: string;
  engineering: EngineeringSuitability;
}

const CLIMATE_ZONE_TEMPLATES: Record<ClimateZoneId, ZoneTemplate> = {
  'afrique-australe-madagascar': {
    nicheFr: 'Sorgho/mil résistants, maïs de conservation (SCV), manioc, légumineuses & périmètres irrigués',
    nicheEn: 'Resilient sorghum/millet, conservation maize (SCV), cassava, pulses & irrigated schemes',
    infraFr: 'Irrigation goutte-à-goutte solaire + barrages de bassin + poquets Zaï & ombrières maraîchères',
    infraEn: 'Solar drip irrigation + basin retention dams + Zaï pits & shade-net greenhouses',
    elNinoQ4Fr: 'Sorgho/mil 90 j, manioc, niébé & riz irrigué précoce après pluie utile',
    elNinoQ4En: '90d sorghum/millet, cassava, cowpea & early irrigated rice',
    elNinoQ1Fr: 'Cultures fourragères sèches, maraîchage sous serre ombrière goutte-à-goutte',
    elNinoQ1En: 'Dry-tolerant fodder, shade-netted drip vegetables & drought rescue crops',
    elNinoQ2Fr: 'Récolte grains résistants, légumineuses sur humidité résiduelle & stockage hermétique',
    elNinoQ2En: 'Resistant grain harvest, residual-moisture pulses & hermetic grain storage',
    elNinoQ3Fr: 'Horticulture irriguée de saison sèche (oignon, tomate) sur retenues & forages solaires',
    elNinoQ3En: 'Dry-season solar-pumped onion/tomato horticulture & reservoir rationing',
    laNinaBaseFr: 'Maïs grain pluvial, arachide, riz de plaine & surveillance crues/drainage',
    laNinaBaseEn: 'Full rainfed maize, groundnut, valley rice & flood drainage protection',
    engineering: { controlledIrrigation: 94, greenhouses: 82, damsAndReservoirs: 93, floodDrainage: 72, agroforestrySoil: 90 },
  },
  'afrique-est-corne': {
    nicheFr: 'Café/thé d’altitude, horticulture export sous serre, teff/sorgho & élevage pastoral',
    nicheEn: 'Highland coffee/tea, export greenhouse horticulture, teff/sorghum & pastoralism',
    infraFr: 'Barrages anti-crues & rétention + serres horticoles ventilées + drainage bassins Est',
    infraEn: 'Flood-control retention dams + highland greenhouses + valley flood drainage',
    elNinoQ4Fr: 'Riz bas-fonds drainés, café/thé sous ombrage, protection contre pluies torrentielles Oct–Déc',
    elNinoQ4En: 'Drained valley rice, shaded coffee/tea & flood-safe upland planting (Oct–Dec rains)',
    elNinoQ1Fr: 'Cultures de décrue (sorgho, niébé, haricot) profitant des nappes rechargées',
    elNinoQ1En: 'Flood-recession sorghum, cowpea & bean leveraging recharged moisture',
    elNinoQ2Fr: 'Maïs/teff d’altitude, horticulture sous serre goutte-à-goutte & fourrages',
    elNinoQ2En: 'Highland maize/teff, drip greenhouse horticulture & livestock fodder',
    elNinoQ3Fr: 'Entretien vergers/caféières, stockage céréalier & préparation canaux drainage',
    elNinoQ3En: 'Coffee/tea orchard care, cereal banking & drainage canal upkeep',
    laNinaBaseFr: 'Sorgho/mil cycle court, goutte-à-goutte pastoral & réserves d’eau anti-sécheresse',
    laNinaBaseEn: 'Short-cycle sorghum/millet, pastoral solar drip & drought water banking',
    engineering: { controlledIrrigation: 86, greenhouses: 85, damsAndReservoirs: 90, floodDrainage: 92, agroforestrySoil: 88 },
  },
  'afrique-ouest-sahel': {
    nicheFr: 'Mil, sorgho, niébé, arachide, cacao/anacarde (zone côtière) & riz de vallée irrigué',
    nicheEn: 'Pearl millet, sorghum, cowpea, groundnut, coastal cacao/cashew & irrigated valley rice',
    infraFr: 'Goutte-à-goutte solaire + cordons pierreux / Zaï + barrages fluviaux & agroforesterie cacao',
    infraEn: 'Solar drip irrigation + stone bunds / Zaï pits + river dams & cacao shade agroforestry',
    elNinoQ4Fr: 'Récolte mil/sorgho/arachide + maraîchage irrigué de contre-saison (oignon, tomate)',
    elNinoQ4En: 'Millet/sorghum/groundnut harvest + off-season drip onion & tomato',
    elNinoQ1Fr: 'Riz irrigué de saison sèche froide (vallées Niger/Sénégal), patate douce, ombrières',
    elNinoQ1En: 'Cool dry-season irrigated valley rice, sweet potato & shade-net vegetables',
    elNinoQ2Fr: 'Préparation parcelles Zaï/demi-lunes, semis précoces cacao/anacarde & maïs Sud',
    elNinoQ2En: 'Prepare Zaï/half-moon catchments; plant southern maize, cacao & cashew',
    elNinoQ3Fr: 'Mil, sorgho, niébé résistants au Nord ; manioc & igname drainés au Sud',
    elNinoQ3En: 'Hardy northern millet/sorghum/cowpea; southern cassava & yam',
    laNinaBaseFr: 'Riz pluvial & irrigué plein rendement, maïs, coton & protection contre crues sahéliennes',
    laNinaBaseEn: 'Full-yield rainfed/irrigated rice, maize, cotton & Sahelian flood protection',
    engineering: { controlledIrrigation: 93, greenhouses: 78, damsAndReservoirs: 89, floodDrainage: 78, agroforestrySoil: 94 },
  },
  'afrique-nord-centrale': {
    nicheFr: 'Olivier, agrumes, blé dur, dattes (oasis), maraîchage sous serre & manioc/banane (Afrique centrale)',
    nicheEn: 'Olive, citrus, durum wheat, oasis dates, greenhouse veggies & Central African cassava/plantain',
    infraFr: 'Serres climatiques + goutte-à-goutte dessalement/forages + barrages de retenue',
    infraEn: 'Climate greenhouses + precision drip (oasis/coastal) + basin dams',
    elNinoQ4Fr: 'Blé dur/orge tolérants, olivier, agrumes sous goutte-à-goutte & cacao/manioc Centre',
    elNinoQ4En: 'Hardy durum wheat/barley, drip olive & citrus; cacao/cassava in Central basin',
    elNinoQ1Fr: 'Maraîchage sous serre haute efficacité (tomate, fraise, poivron), palmier dattier',
    elNinoQ1En: 'High-efficiency greenhouse tomato/pepper/strawberry & date palm irrigation',
    elNinoQ2Fr: 'Récolte céréales d’hiver, légumineuses (pois chiche/lentille) & arboriculture sèche',
    elNinoQ2En: 'Winter cereal harvest, dry pulses (chickpea/lentil) & dryland orchards',
    elNinoQ3Fr: 'Cultures fourragères irriguées, taille oliviers/palmiers & entretien bassins',
    elNinoQ3En: 'Irrigated summer fodder, olive/date orchard care & reservoir maintenance',
    laNinaBaseFr: 'Blé/orge plein potentiel, légumineuses d’hiver & reboisement anti-érosion',
    laNinaBaseEn: 'Full-season wheat/barley, winter pulses & watershed erosion control',
    engineering: { controlledIrrigation: 95, greenhouses: 92, damsAndReservoirs: 88, floodDrainage: 72, agroforestrySoil: 82 },
  },
  'amerique-sud-pacifique': {
    nicheFr: 'Cultures andines (quinoa, pomme de terre), café d’altitude, banane & exportations côtières irriguées',
    nicheEn: 'Andean crops (quinoa, potato), highland coffee, banana & coastal irrigated exports',
    infraFr: 'Digues côtières anti-crues El Niño + barrages transfert andin + goutte-à-goutte & terrasses',
    infraEn: 'Coastal El Niño flood levees + Andean transfer dams + drip lines & terraces',
    elNinoQ4Fr: 'Quinoa & pomme de terre andine résistante ; curage canaux côtiers avant pluies El Niño',
    elNinoQ4En: 'Hardy Andean quinoa/potato; clear coastal drains ahead of warm El Niño rains',
    elNinoQ1Fr: 'Protection vergers côtiers (mangue/banane) contre crues + cultures andines sous ombrage/serre',
    elNinoQ1En: 'Protect coastal orchards from floods + highland greenhouse vegetables',
    elNinoQ2Fr: 'Récolte café/quinoa/cacao & semis de décrue sur plaines côtières humidifiées',
    elNinoQ2En: 'Coffee/quinoa/cacao harvest & flood-recession planting on moist coastal plains',
    elNinoQ3Fr: 'Asperge, myrtille & avocat sous goutte-à-goutte contrôlé en saison sèche',
    elNinoQ3En: 'Controlled drip-irrigated asparagus, blueberry & avocado in dry months',
    laNinaBaseFr: 'Agro-exportations côtières intensives sous goutte-à-goutte + alerte gel andin',
    laNinaBaseEn: 'Intensive drip coastal exports + Andean frost-protection greenhouses',
    engineering: { controlledIrrigation: 92, greenhouses: 84, damsAndReservoirs: 90, floodDrainage: 92, agroforestrySoil: 86 },
  },
  'amazonie-cone-sud': {
    nicheFr: 'Soja, maïs safrinha, blé/tournesol Cône Sud, café, cacao & élevage durable',
    nicheEn: 'Soybean, safrinha maize, Southern Cone wheat/sunflower, coffee, cacao & pasture',
    infraFr: 'Semis direct SCV + pivots irrigation complémentaire + drainage pampa Sud',
    infraEn: 'No-till SCV conservation farming + supplemental pivot irrigation + Pampa drainage',
    elNinoQ4Fr: 'Soja & maïs Sud avec drainage ; sorgho & cacao agroforestier au Nord/Amazonie',
    elNinoQ4En: 'Flood-drained southern soy/maize; drought-hardy northern sorghum & cacao',
    elNinoQ1Fr: 'Maïs safrinha résilient, canne à sucre, protection anti-sécheresse bassin amazonien',
    elNinoQ1En: 'Resilient safrinha maize, sugarcane & Amazon basin drought water retention',
    elNinoQ2Fr: 'Récolte soja/maïs + semis blé/orge d’hiver dans le Cône Sud',
    elNinoQ2En: 'Soy/maize harvest + Southern Cone winter wheat & barley sowing',
    elNinoQ3Fr: 'Blé, avoine fourragère, taille café/agrumes & maintenance systèmes d’irrigation',
    elNinoQ3En: 'Winter wheat, forage oats, coffee/citrus pruning & irrigation upkeep',
    laNinaBaseFr: 'Irrigation complémentaire au Cône Sud (sécheresse La Niña) & pleine récolte Nord',
    laNinaBaseEn: 'Supplemental irrigation in La Niña-dry Southern Cone & peak northern harvests',
    engineering: { controlledIrrigation: 86, greenhouses: 74, damsAndReservoirs: 84, floodDrainage: 82, agroforestrySoil: 89 },
  },
  'amerique-du-nord': {
    nicheFr: 'Maïs/soja/blé haute technicité, fruits/légumes irrigués & serres hydroponiques',
    nicheEn: 'High-tech corn/soy/wheat, irrigated specialty fruits/vegetables & hydroponic greenhouses',
    infraFr: 'Irrigation de précision + serres climatiques fermées + grands barrages & couverture sols',
    infraEn: 'Precision variable-rate drip/pivots + closed climate greenhouses + basin reservoirs',
    elNinoQ4Fr: 'Cultures d’hiver Sud/Californie (légumes feuilles, agrumes), couverture végétale Midwest',
    elNinoQ4En: 'Sunbelt winter specialty crops & Midwest cover-cropping for soil moisture',
    elNinoQ1Fr: 'Maraîchage sous serre Nord/Canada + gestion crues côtières Pacifique/Golfe',
    elNinoQ1En: 'Northern greenhouse produce & Pacific/Gulf storm-drainage management',
    elNinoQ2Fr: 'Semis maïs/soja/canola de printemps en fenêtres précoces avec drainage contrôlé',
    elNinoQ2En: 'Early spring corn/soy/canola planting with precision tile drainage',
    elNinoQ3Fr: 'Récolte blé, irrigation déficit contrôlé vergers Ouest & stockage silos',
    elNinoQ3En: 'Wheat harvest, regulated-deficit western orchard drip & grain storage',
    laNinaBaseFr: 'Irrigation renforcée Sud-Ouest/Plaines + semis intensifs Midwest/Canada',
    laNinaBaseEn: 'Enhanced Southwest/Plains irrigation + full Northern Plains/Midwest cropping',
    engineering: { controlledIrrigation: 90, greenhouses: 92, damsAndReservoirs: 88, floodDrainage: 80, agroforestrySoil: 82 },
  },
  caraibes: {
    nicheFr: 'Cultures maraîchères sous serre anticyclonique, banane/plantain, canne, cacao fin & tubercules',
    nicheEn: 'Cyclone-resilient greenhouse produce, plantain/banana, cane, fine cacao & root crops',
    infraFr: 'Serres anti-cycloniques démontables + citernes/micro-barrages + goutte-à-goutte insulaire',
    infraEn: 'Wind-rated retractable greenhouses + water cisterns/micro-dams + island drip irrigation',
    elNinoQ4Fr: 'Igname, patate douce, manioc & maraîchage sous serre goutte-à-goutte',
    elNinoQ4En: 'Yam, sweet potato, cassava & drip-irrigated shade-greenhouse vegetables',
    elNinoQ1Fr: 'Cultures cycle court économes en eau (haricot, gombo, tomate sous ombrière)',
    elNinoQ1En: 'Water-saving short-cycle bean, okra & shade-greenhouse tomato',
    elNinoQ2Fr: 'Récolte tubercules/canne, plantation haies brise-vent & remplissage citernes',
    elNinoQ2En: 'Root/cane harvest, windbreak planting & rainwater cistern recharge',
    elNinoQ3Fr: 'Préparation anti-ouragan, cultures racinaires protégées & serres rabattables',
    elNinoQ3En: 'Hurricane season wind-proofing, protected root mounds & retractable greenhouses',
    laNinaBaseFr: 'Bananier/cacao plein rendement, riz/tubercules avec drainage anti-ouragan renforcé',
    laNinaBaseEn: 'Full banana/cacao/root harvests paired with reinforced hurricane flood drainage',
    engineering: { controlledIrrigation: 88, greenhouses: 90, damsAndReservoirs: 82, floodDrainage: 92, agroforestrySoil: 88 },
  },
  'asie-sud-est-oceanie': {
    nicheFr: 'Riz irrigué, café/cacao/épices, huile de palme, aquaculture & céréales/horticulture Océanie',
    nicheEn: 'Irrigated rice, coffee/cacao/spices, palm oil, aquaculture & Oceania grains/horticulture',
    infraFr: 'Barrages rizicoles & écluses anti-sel + goutte-à-goutte vergers/café + serres climatiques',
    infraEn: 'Rice reservoirs & salinity barriers + coffee/orchard drip + climate greenhouses',
    elNinoQ4Fr: 'Riz cycle court économe en eau, sorgho/maïs résilient & maintien humidité tourbières',
    elNinoQ4En: 'Water-saving short-cycle rice, hardy sorghum/maize & peat moisture locks',
    elNinoQ1Fr: 'Cultures tolérantes sel/sécheresse, maraîchage sous serre ombrière & orge sèche',
    elNinoQ1En: 'Salt/drought-tolerant crops, shade-greenhouse produce & dryland barley',
    elNinoQ2Fr: 'Récolte grains secs, taille agroforestière & régulation barrages d’irrigation',
    elNinoQ2En: 'Dryland grain harvest, agroforestry care & dam water banking',
    elNinoQ3Fr: 'Riz irrigué sur périmètres alimentés, cultures maraîchères goutte-à-goutte',
    elNinoQ3En: 'Reservoir-fed irrigated rice & precision drip horticulture',
    laNinaBaseFr: 'Double/triple récolte rizicole, plein blé/coton Australie & drainage anti-crues',
    laNinaBaseEn: 'Double/triple rice crops, full Australian wheat/cotton & typhoon flood drainage',
    engineering: { controlledIrrigation: 90, greenhouses: 84, damsAndReservoirs: 92, floodDrainage: 88, agroforestrySoil: 88 },
  },
  'asie-du-sud': {
    nicheFr: 'Riz, blé d’hiver irrigué, millets climat-intelligents, thé/épices, mangue & coton',
    nicheEn: 'Rice, irrigated winter wheat, climate-smart millets, tea/spices, mango & cotton',
    infraFr: 'Micro-irrigation goutte-à-goutte + barrages & recharge nappes + polyhouses maraîchers',
    infraEn: 'Drip micro-irrigation + watershed check dams/aquifer recharge + horticultural polyhouses',
    elNinoQ4Fr: 'Blé d’hiver (Rabi) & pois chiche sous irrigation contrôlée, colza/moutarde',
    elNinoQ4En: 'Controlled-irrigation Rabi winter wheat, chickpea & mustard/oilseeds',
    elNinoQ1Fr: 'Légumineuses & légumes sous serres/polyhouses économes en eau',
    elNinoQ1En: 'Water-saving pulses & polyhouse/greenhouse vegetables',
    elNinoQ2Fr: 'Récolte Rabi + préparation bassins de captage mousson & semis millets',
    elNinoQ2En: 'Rabi harvest + monsoon water-harvesting tank prep & millet nursery',
    elNinoQ3Fr: 'Millets (sorgho/bajra), riz SRI économe, coton résilient & thé sous ombrage',
    elNinoQ3En: 'Climate-smart millets, AWD water-saving SRI rice, hardy cotton & shaded tea',
    laNinaBaseFr: 'Riz Kharif plein potentiel, canne à sucre & drainage deltaïque contre moussons extrêmes',
    laNinaBaseEn: 'Peak Kharif monsoon rice, sugarcane & eastern flood-delta drainage',
    engineering: { controlledIrrigation: 94, greenhouses: 82, damsAndReservoirs: 95, floodDrainage: 88, agroforestrySoil: 85 },
  },
  'asie-est-centrale': {
    nicheFr: 'Céréales irriguées (blé, riz, maïs), coton d’Asie centrale & horticulture sous serre solaire',
    nicheEn: 'Irrigated cereals (wheat, rice, maize), Central Asian cotton & solar greenhouse horticulture',
    infraFr: 'Serres solaires passives + goutte-à-goutte bassins fermés + barrages hydro-agricoles',
    infraEn: 'Passive solar greenhouses + closed-basin drip irrigation + reservoir dams',
    elNinoQ4Fr: 'Blé d’hiver, cultures sous serres solaires chauffées & maintenance canaux',
    elNinoQ4En: 'Winter wheat, passive solar greenhouse vegetables & canal lining',
    elNinoQ1Fr: 'Production maraîchère continue sous serre (tomate, concombre, feuilles) hors gel',
    elNinoQ1En: 'Continuous frost-shielded solar greenhouse tomato/cucumber production',
    elNinoQ2Fr: 'Blé de printemps, riz irrigué, coton sous goutte-à-goutte & soja',
    elNinoQ2En: 'Spring wheat, irrigated rice, drip cotton & soybean',
    elNinoQ3Fr: 'Récolte blé/riz, maïs résilient & drainage des plaines exposées aux typhons',
    elNinoQ3En: 'Wheat/rice harvest, drought-tolerant maize & coastal typhoon drainage',
    laNinaBaseFr: 'Plein potentiel riz/soja + protection serres contre vagues de froid hivernales',
    laNinaBaseEn: 'Full rice/soybean output + cold-snap greenhouse thermal shielding',
    engineering: { controlledIrrigation: 90, greenhouses: 95, damsAndReservoirs: 92, floodDrainage: 80, agroforestrySoil: 80 },
  },
  'europe-moyen-orient': {
    nicheFr: 'Blé/orge, olivier/vigne, dattes & maraîchage haute technologie sous serre (Europe/MENA)',
    nicheEn: 'Wheat/barley, olive/vineyards, dates & high-tech greenhouse horticulture (Europe/MENA)',
    infraFr: 'Serres bioclimatiques/hydroponiques + goutte-à-goutte dessalement/retenues + agrivoltaïsme',
    infraEn: 'Bioclimatic/hydroponic greenhouses + desalination/basin drip + agrivoltaics',
    elNinoQ4Fr: 'Blé tendre/dur, orge, olivier & cultures sous serre ventilée (MENA/Méditerranée)',
    elNinoQ4En: 'Winter wheat/barley, olive & climate-controlled MENA/Mediterranean greenhouses',
    elNinoQ1Fr: 'Agrumes, tomate/fraise sous serre goutte-à-goutte & légumineuses d’hiver',
    elNinoQ1En: 'Citrus, drip greenhouse tomato/strawberry & winter food legumes',
    elNinoQ2Fr: 'Sorgho/tournesol résilients en Europe du Sud, blé/colza Nord & économie d’eau',
    elNinoQ2En: 'Water-saving southern sorghum/sunflower, northern wheat/rapeseed',
    elNinoQ3Fr: 'Vendanges/récoltes précoces, ombrières agrivoltaïques & stockage eau hivernale',
    elNinoQ3En: 'Early harvests, agrivoltaic crop shading & dry-summer water rationing',
    laNinaBaseFr: 'Céréales/betterave/maïs plein rendement avec drainage hivernal & serres chauffées',
    laNinaBaseEn: 'Full cereals/beet/maize harvests with winter drainage & climate greenhouses',
    engineering: { controlledIrrigation: 91, greenhouses: 94, damsAndReservoirs: 84, floodDrainage: 78, agroforestrySoil: 80 },
  },
};

export interface CountryAgroSpecialization {
  country: DuplicatedWorldCountry;
  adamSmithAdvantageFr: string;
  adamSmithAdvantageEn: string;
  primaryInfraFr: string;
  primaryInfraEn: string;
  engineering: EngineeringSuitability;
  quarters: Record<SeasonalQuarterId, SeasonalCropDirective>;
}

function clamp100(v: number): number {
  return Math.max(20, Math.min(99, Math.round(v)));
}

export function buildCountryAgroSpecialization(
  country: DuplicatedWorldCountry,
  rainAnomModPct = 0,
): CountryAgroSpecialization {
  const tpl = CLIMATE_ZONE_TEMPLATES[country.climateZone];
  const ov = COUNTRY_OVERRIDES[country.iso2];

  // Modulate engineering scores from country hazard + live 15-day rainfall anomaly telemetry
  const dryBoost = country.hazard === 'drought' ? 6 : 0;
  const floodBoost = country.hazard === 'flood' ? 10 : 0;
  const heatBoost = country.hazard === 'heat' ? 6 : 0;
  const telemetryDryAdj = rainAnomModPct < -12 ? 3 : 0;
  const telemetryFloodAdj = rainAnomModPct > 15 ? 4 : 0;

  const baseEng = tpl.engineering;
  const eng: EngineeringSuitability = {
    controlledIrrigation: clamp100(
      (ov?.engineeringBonus?.controlledIrrigation ?? baseEng.controlledIrrigation) +
        dryBoost +
        telemetryDryAdj,
    ),
    greenhouses: clamp100(
      (ov?.engineeringBonus?.greenhouses ?? baseEng.greenhouses) + heatBoost,
    ),
    damsAndReservoirs: clamp100(
      (ov?.engineeringBonus?.damsAndReservoirs ?? baseEng.damsAndReservoirs) +
        Math.round(dryBoost * 0.7),
    ),
    floodDrainage: clamp100(
      (ov?.engineeringBonus?.floodDrainage ?? baseEng.floodDrainage) +
        floodBoost +
        telemetryFloodAdj,
    ),
    agroforestrySoil: clamp100(
      ov?.engineeringBonus?.agroforestrySoil ?? baseEng.agroforestrySoil,
    ),
  };

  const quarters: Record<SeasonalQuarterId, SeasonalCropDirective> = {
    'q4-oct-dec': {
      elNinoCropsFr: ov ? ov.elNinoCropsFr : tpl.elNinoQ4Fr,
      elNinoCropsEn: ov ? ov.elNinoCropsEn : tpl.elNinoQ4En,
      laNinaCropsFr: ov ? ov.laNinaCropsFr : tpl.laNinaBaseFr,
      laNinaCropsEn: ov ? ov.laNinaCropsEn : tpl.laNinaBaseEn,
      practiceFr: tpl.infraFr,
      practiceEn: tpl.infraEn,
    },
    'q1-jan-mar': {
      elNinoCropsFr: ov ? ov.elNinoCropsFr : tpl.elNinoQ1Fr,
      elNinoCropsEn: ov ? ov.elNinoCropsEn : tpl.elNinoQ1En,
      laNinaCropsFr: ov ? ov.laNinaCropsFr : tpl.laNinaBaseFr,
      laNinaCropsEn: ov ? ov.laNinaCropsEn : tpl.laNinaBaseEn,
      practiceFr: tpl.infraFr,
      practiceEn: tpl.infraEn,
    },
    'q2-apr-jun': {
      elNinoCropsFr: ov ? ov.elNinoCropsFr : tpl.elNinoQ2Fr,
      elNinoCropsEn: ov ? ov.elNinoCropsEn : tpl.elNinoQ2En,
      laNinaCropsFr: ov ? ov.laNinaCropsFr : tpl.laNinaBaseFr,
      laNinaCropsEn: ov ? ov.laNinaCropsEn : tpl.laNinaBaseEn,
      practiceFr: tpl.infraFr,
      practiceEn: tpl.infraEn,
    },
    'q3-jul-sep': {
      elNinoCropsFr: ov ? ov.elNinoCropsFr : tpl.elNinoQ3Fr,
      elNinoCropsEn: ov ? ov.elNinoCropsEn : tpl.elNinoQ3En,
      laNinaCropsFr: ov ? ov.laNinaCropsFr : tpl.laNinaBaseFr,
      laNinaCropsEn: ov ? ov.laNinaCropsEn : tpl.laNinaBaseEn,
      practiceFr: tpl.infraFr,
      practiceEn: tpl.infraEn,
    },
  };

  return {
    country,
    adamSmithAdvantageFr: ov?.nicheFr ?? tpl.nicheFr,
    adamSmithAdvantageEn: ov?.nicheEn ?? tpl.nicheEn,
    primaryInfraFr: ov?.infraFr ?? tpl.infraFr,
    primaryInfraEn: ov?.infraEn ?? tpl.infraEn,
    engineering: eng,
    quarters,
  };
}

export function buildAll195CountryAgroSpecializations(
  zoneRainMods?: Partial<Record<UnZoneId, number>>,
): CountryAgroSpecialization[] {
  return DUPLICATED_195_COUNTRIES.map((country) =>
    buildCountryAgroSpecialization(country, zoneRainMods?.[country.unZone] ?? 0),
  );
}

export function getTopEngineeringPillar(
  eng: EngineeringSuitability,
  lang: 'fr' | 'en',
): { key: keyof EngineeringSuitability; label: string; score: number } {
  const entries: { key: keyof EngineeringSuitability; fr: string; en: string; score: number }[] = [
    { key: 'controlledIrrigation', fr: 'Irrigation contrôlée', en: 'Controlled Irrigation', score: eng.controlledIrrigation },
    { key: 'greenhouses', fr: 'Serres climatiques', en: 'Climate Greenhouses', score: eng.greenhouses },
    { key: 'damsAndReservoirs', fr: 'Barrages & retenues', en: 'Dams & Reservoirs', score: eng.damsAndReservoirs },
    { key: 'floodDrainage', fr: 'Drainage & digues', en: 'Drainage & Levees', score: eng.floodDrainage },
    { key: 'agroforestrySoil', fr: 'Agroforesterie & Zaï', en: 'Agroforestry & Zaï', score: eng.agroforestrySoil },
  ];
  entries.sort((a, b) => b.score - a.score);
  const top = entries[0];
  return {
    key: top.key,
    label: lang === 'fr' ? top.fr : top.en,
    score: top.score,
  };
}
