export type QuizRegionTrack = 'all' | 'grand-sud-west' | 'highlands-alaotra' | 'north-east';

export interface CropQuizOption {
  id: string;
  labelFr: string;
  labelEn: string;
}

export interface CropResilienceQuestion {
  id: string;
  track: Exclude<QuizRegionTrack, 'all'>;
  regionLabelFr: string;
  regionLabelEn: string;
  seasonWindowFr: string;
  seasonWindowEn: string;
  promptFr: string;
  promptEn: string;
  options: [CropQuizOption, CropQuizOption, CropQuizOption, CropQuizOption];
  correctIndex: 0 | 1 | 2 | 3;
  explanationFr: string;
  explanationEn: string;
  cooperativeActionFr: string;
  cooperativeActionEn: string;
}

export const QUIZ_TRACK_OPTIONS: Array<{
  id: QuizRegionTrack;
  labelFr: string;
  labelEn: string;
}> = [
  { id: 'all', labelFr: 'Toutes régions (8 questions)', labelEn: 'All Regions (8 Questions)' },
  { id: 'grand-sud-west', labelFr: 'Grand Sud & Ouest (Sécheresse)', labelEn: 'Grand Sud & West (Drought)' },
  { id: 'highlands-alaotra', labelFr: 'Hautes Terres & Alaotra', labelEn: 'Highlands & Alaotra' },
  { id: 'north-east', labelFr: 'Nord & Côte Est (SAVA · Est)', labelEn: 'North & East Coast (SAVA · East)' },
];

export const CROP_RESILIENCE_QUESTIONS: CropResilienceQuestion[] = [
  {
    id: 'androy-el-nino-onset',
    track: 'grand-sud-west',
    regionLabelFr: 'Androy (Ambovombe · Beloha · Tsihombe)',
    regionLabelEn: 'Androy (Ambovombe · Beloha · Tsihombe)',
    seasonWindowFr: 'Oct – Déc (T4 · Démarrage des pluies)',
    seasonWindowEn: 'Oct – Dec (Q4 · Rain Onset)',
    promptFr:
      'En alerte El Niño dans l’Androy (−30 % à −50 % de pluie), quelle règle de semis une coopérative doit-elle appliquer en octobre–décembre ?',
    promptEn:
      'During an El Niño warning in Androy (−30% to −50% rainfall), which sowing protocol must cooperative managers enforce in Oct–Dec?',
    options: [
      {
        id: 'a',
        labelFr: 'Semer le maïs hybride 120 j à sec dès octobre pour devancer la chaleur.',
        labelEn: 'Dry-sow 120-day hybrid maize in October to beat peak summer heat.',
      },
      {
        id: 'b',
        labelFr: 'Attendre ≥ 25 mm de pluie sur 3 jours, puis semer du sorgho/mil 90 j en poquets Zaï paillés.',
        labelEn: 'Wait for ≥ 25 mm rainfall over 3 days, then sow 90-day sorghum/millet in mulched Zaï pits.',
      },
      {
        id: 'c',
        labelFr: 'Planter du riz pluvial non irrigué sur sable dunaire sans couverture.',
        labelEn: 'Plant rainfed upland rice directly on bare coastal sand dunes.',
      },
      {
        id: 'd',
        labelFr: 'Labourer profondément en sol sec sans résidus végétaux.',
        labelEn: 'Deep-plow dry soil and remove all crop residues.',
      },
    ],
    correctIndex: 1,
    explanationFr:
      'Semer du maïs à sec entraîne une levée avortée dès le premier épisode sec. Les poquets Zaï compostés et paillés avec du sorgho ou du mil cycle court (90 jours) retiennent l’humidité utile après une pluie déclencheur ≥ 25 mm/3j.',
    explanationEn:
      'Dry-sowing maize leads to germination failure during early El Niño dry spells. Composted, mulched Zaï pits paired with 90-day short-cycle sorghum or millet lock in soil moisture once ≥ 25 mm falls over 3 days.',
    cooperativeActionFr: 'Pré-positionner 35–50 % de semences 90 jours (sorgho, mil, niébé) dans les banques coopératives.',
    cooperativeActionEn: 'Pre-position 35–50% short-cycle 90d seeds (sorghum, millet, cowpea) in cooperative seed banks.',
  },
  {
    id: 'atsimo-andrefana-recession',
    track: 'grand-sud-west',
    regionLabelFr: 'Atsimo-Andrefana & Menabe (Bas-Mangoky · Onilahy)',
    regionLabelEn: 'Atsimo-Andrefana & Menabe (Bas-Mangoky · Onilahy)',
    seasonWindowFr: 'Avr – Juin (T2 · Décrue alluviale)',
    seasonWindowEn: 'Apr – Jun (Q2 · Flood Recession)',
    promptFr:
      'Comment optimiser l’eau après la saison des pluies en Atsimo-Andrefana et Menabe pour les cultures d’exportation résilientes ?',
    promptEn:
      'How should cooperatives optimize residual water after the rainy season in Atsimo-Andrefana and Menabe for resilient export crops?',
    options: [
      {
        id: 'a',
        labelFr: 'Semer du pois du Cap et de la dolique en décrue sur alluvions (baiboho) Onilahy/Tsiribihina.',
        labelEn: 'Sow Cape lima beans and lablab on receding alluvial flats (baiboho) along Onilahy/Tsiribihina.',
      },
      {
        id: 'b',
        labelFr: 'Laisser les berges alluviales en jachère nue jusqu’en octobre.',
        labelEn: 'Leave fertile alluvial riverbanks fallow and bare until October.',
      },
      {
        id: 'c',
        labelFr: 'Pomper en plein midi par aspersion ouverte sur sables secs.',
        labelEn: 'Run open overhead sprinklers at midday on exposed dry sand.',
      },
      {
        id: 'd',
        labelFr: 'Repiquer du riz cycle long (150 j) hors périmètre irrigué en mai.',
        labelEn: 'Transplant 150-day long-cycle rice outside irrigated schemes in May.',
      },
    ],
    correctIndex: 0,
    explanationFr:
      'Les alluvions baiboho conservent une humidité capillaire profonde d’avril à juillet, permettant de produire pois du Cap, dolique et haricot sans pompage coûteux.',
    explanationEn:
      'Deep alluvial baiboho riverbanks retain capillary moisture from April to July, supporting high-value Cape lima bean and pulses with minimal pumping cost.',
    cooperativeActionFr: 'Organiser le semis groupé sur baiboho et le stockage en sacs hermétiques PICS.',
    cooperativeActionEn: 'Coordinate group baiboho sowing and store harvested pulses in hermetic PICS grain bags.',
  },
  {
    id: 'grand-sud-dry-season-eng',
    track: 'grand-sud-west',
    regionLabelFr: 'Grand Sud & Anosy Ouest (Amboasary · Bekily)',
    regionLabelEn: 'Grand Sud & West Anosy (Amboasary · Bekily)',
    seasonWindowFr: 'Juil – Sept (T3 · Étiage & saison sèche)',
    seasonWindowEn: 'Jul – Sep (Q3 · Dry Season Low-Flow)',
    promptFr:
      'Durant la saison sèche (Juil–Sept) dans le Grand Sud, quelle combinaison d’ouvrages maintient la production maraîchère malgré l’évapotranspiration élevée ?',
    promptEn:
      'During the July–September dry season in the Grand Sud, which engineering mix sustains horticulture despite intense evapotranspiration?',
    options: [
      {
        id: 'a',
        labelFr: 'Irrigation gravitaire par canaux en terre non revêtus.',
        labelEn: 'Unlined earthen flood-furrow irrigation canals.',
      },
      {
        id: 'b',
        labelFr: 'Barrages souterrains (sand dams) + goutte-à-goutte solaire sous serres ombrières 50 %.',
        labelEn: 'Subsurface sand dams + solar drip irrigation inside 50% UV shade-net greenhouses.',
      },
      {
        id: 'c',
        labelFr: 'Arrosage manuel au seau deux fois par semaine sur parcelles ouvertes.',
        labelEn: 'Manual bucket watering twice a week on unshaded open plots.',
      },
      {
        id: 'd',
        labelFr: 'Drainage intensif des bas-fonds avant octobre.',
        labelEn: 'Intensive deep drainage of valley bottoms ahead of October.',
      },
    ],
    correctIndex: 1,
    explanationFr:
      'Les micro-barrages souterrains (sand dams) empêchent l’évaporation de l’eau stockée dans le sable des oueds (Mandrare/Manambovo), et le couplage goutte-à-goutte + ombrière 50 % économise jusqu’à 65 % d’eau.',
    explanationEn:
      'Subsurface sand dams store riverbed water underground free from surface evaporation, and solar drip paired with 50% UV shade nets reduces water loss by up to 65%.',
    cooperativeActionFr: 'Mutualiser 1 forage solaire + ombrière 250 m² pour produire semences, tomates et brèdes en T3.',
    cooperativeActionEn: 'Share a community solar borehole + 250 m² shade greenhouse for dry-season horticulture.',
  },
  {
    id: 'alaotra-awd-cycle',
    track: 'highlands-alaotra',
    regionLabelFr: 'Alaotra-Mangoro (Ambatondrazaka · Amparafaravola)',
    regionLabelEn: 'Alaotra-Mangoro (Ambatondrazaka · Amparafaravola)',
    seasonWindowFr: 'Oct – Mar (T4–T1 · Campagne rizicole)',
    seasonWindowEn: 'Oct – Mar (Q4–Q1 · Main Rice Campaign)',
    promptFr:
      'Quand le niveau des retenues du Lac Alaotra (PC15 / Sahamaloto) baisse de −15 % à −25 % sous El Niño, quelle conduite d’irrigation préserve le rendement rizicole ?',
    promptEn:
      'When Lake Alaotra reservoirs (PC15 / Sahamaloto) drop −15% to −25% under El Niño, which irrigation practice preserves rice yields?',
    options: [
      {
        id: 'a',
        labelFr: 'Maintenir 15 cm de lame d’eau permanente sur toutes les rizières.',
        labelEn: 'Maintain a constant 15 cm standing water layer across every paddy.',
      },
      {
        id: 'b',
        labelFr: 'Activer l’irrigation intermittente (AWD) par tours d’eau et variétés 110 jours.',
        labelEn: 'Enforce Alternate Wetting & Drying (AWD) rotation with 110-day rice varieties.',
      },
      {
        id: 'c',
        labelFr: 'Retarder le repiquage à fin février en espérant des cyclones.',
        labelEn: 'Delay transplanting until late February hoping for cyclone rains.',
      },
      {
        id: 'd',
        labelFr: 'Remplacer la totalité des rizières par du manioc en cuvette inondable.',
        labelEn: 'Replace all irrigated paddies with cassava inside floodable basins.',
      },
    ],
    correctIndex: 1,
    explanationFr:
      'L’alternance d’assec et de submersion (AWD — Alternate Wetting & Drying) économise ~30 % d’eau tout en stimulant l’enracinement du riz SRI/SRA cycle moyen (110 jours) sans perte de rendement.',
    explanationEn:
      'Alternate Wetting & Drying (AWD) cuts irrigation water demand by ~30% while strengthening root systems on 110-day rice cultivars without yield penalty.',
    cooperativeActionFr: 'Installer des tubes piézométriques AWD de terrain dans chaque maille hydraulique AUE.',
    cooperativeActionEn: 'Install simple perforated AWD field water tubes across each Water User Association block.',
  },
  {
    id: 'highlands-vakinankaratra-frost-drought',
    track: 'highlands-alaotra',
    regionLabelFr: 'Hautes Terres (Analamanga · Vakinankaratra · Itasy)',
    regionLabelEn: 'Central Highlands (Analamanga · Vakinankaratra · Itasy)',
    seasonWindowFr: 'Avr – Sept (T2–T3 · Contre-saison)',
    seasonWindowEn: 'Apr – Sep (Q2–Q3 · Off-Season)',
    promptFr:
      'Dans le Vakinankaratra et l’Analamanga, quelle rotation de contre-saison valorise l’humidité résiduelle des rizières après la récolte ?',
    promptEn:
      'In Vakinankaratra and Analamanga, which off-season crop rotation best exploits residual paddy moisture after the main harvest?',
    options: [
      {
        id: 'a',
        labelFr: 'Pomme de terre de contre-saison, blé/orge d’altitude ou maraîchage sous serre goutte-à-goutte.',
        labelEn: 'Off-season potato, highland wheat/barley, or drip-irrigated greenhouse vegetables.',
      },
      {
        id: 'b',
        labelFr: 'Coton et sésame pluvial à haute exigence thermique nocturne.',
        labelEn: 'Rainfed cotton and sesame requiring warm tropical nights.',
      },
      {
        id: 'c',
        labelFr: 'Vanille et cacao sans ombrage en altitude > 1 500 m.',
        labelEn: 'Unshaded vanilla and cacao above 1,500 m elevation.',
      },
      {
        id: 'd',
        labelFr: 'Brûlis des chaumes de riz puis jachère nue jusqu’en décembre.',
        labelEn: 'Open burning of rice stubble followed by bare fallow until December.',
      },
    ],
    correctIndex: 0,
    explanationFr:
      'La fraîcheur d’altitude des Hautes Terres et l’humidité résiduelle des bas-fonds favorisent la pomme de terre primeur, les céréales tempérées (blé/orge) et le maraîchage à haute valeur sous serres anti-grêle.',
    explanationEn:
      'Cool highland temperatures and residual valley moisture make Vakinankaratra and Analamanga ideal for off-season seed potato, wheat/barley, and anti-hail greenhouse horticulture.',
    cooperativeActionFr: 'Coupler les retenues collinaires avec des serres ventilées pour sécuriser tomates et semences de pomme de terre.',
    cooperativeActionEn: 'Pair hillside reservoirs with ventilated greenhouses for tomatoes and certified potato seed.',
  },
  {
    id: 'sava-vanilla-shade',
    track: 'north-east',
    regionLabelFr: 'SAVA & Diana (Sambava · Antalaha · Ambanja)',
    regionLabelEn: 'SAVA & Diana (Sambava · Antalaha · Ambanja)',
    seasonWindowFr: 'Oct – Déc (T4 · Floraison & pollinisation)',
    seasonWindowEn: 'Oct – Dec (Q4 · Flowering & Pollination)',
    promptFr:
      'Pour protéger la floraison de la vanille Bourbon et du cacao Sambirano contre les pics thermiques El Niño tout en résistant aux rafales, quel aménagement est prioritaire ?',
    promptEn:
      'To shield Bourbon vanilla blossom and Sambirano cacao from El Niño heat stress while resisting storm gusts, what agro-design is essential?',
    options: [
      {
        id: 'a',
        labelFr: 'Cultiver la vanille en plein soleil sur piquets en bois sec sans arbre d’ombrage.',
        labelEn: 'Grow vanilla in full sun on dead dry wooden stakes with zero canopy shade.',
      },
      {
        id: 'b',
        labelFr: 'Maintenir 50 % d’ombrage agroforestier (Gliricidia/Albizia) + paillage coco épais et serres solaires de séchage.',
        labelEn: 'Maintain 50% Gliricidia/Albizia shade canopy + thick coconut-husk mulch and solar curing greenhouses.',
      },
      {
        id: 'c',
        labelFr: 'Inonder en continu le pied des lianes de vanille pendant 3 mois.',
        labelEn: 'Flood vanilla vine bases continuously for 3 months.',
      },
      {
        id: 'd',
        labelFr: 'Supprimer tous les fossés en courbes de niveau sur les collines.',
        labelEn: 'Remove contour drainage trenches on hillsides.',
      },
    ],
    correctIndex: 1,
    explanationFr:
      'Un couvert d’ombrage à 50 % limite l’échaudage et l’avortement des fleurs, le paillage préserve l’humidité racinaire et les serres-tunnel solaires évitent les moisissures lorsque les pluies précoces SAVA perturbent la récolte.',
    explanationEn:
      'A 50% shade canopy prevents sun-scorch and blossom drop, heavy mulch protects shallow roots, and solar curing greenhouses eliminate mold during humid harvest windows.',
    cooperativeActionFr: 'Planifier le recépage contrôlé des tuteurs Gliricidia avant octobre et mutualiser des serres de séchage coopératives.',
    cooperativeActionEn: 'Prune Gliricidia shade stakes to 50% cover before October and share solar curing greenhouses.',
  },
  {
    id: 'east-southeast-flood-shift',
    track: 'north-east',
    regionLabelFr: 'Côte Est & Sud-Est (Vatovavy · Fitovinany · Analanjirofo)',
    regionLabelEn: 'East & Southeast Coast (Vatovavy · Fitovinany · Analanjirofo)',
    seasonWindowFr: 'Jan – Mar (T1 · Pic pluies IOD+ & cyclones)',
    seasonWindowEn: 'Jan – Mar (Q1 · IOD+ Rain Peak & Cyclones)',
    promptFr:
      'Sous couplage El Niño + IOD+ (pluies intenses Nov–Jan sur le Nord-Est) puis transition La Niña, quelle stratégie réduit les pertes de récolte en plaine côtière ?',
    promptEn:
      'Under coupled El Niño + positive IOD+ (heavy Nov–Jan rains in the Northeast) and La Niña shifts, which strategy minimizes coastal plain crop losses?',
    options: [
      {
        id: 'a',
        labelFr: 'Curage préventif des canaux, variétés de riz tolérantes à la submersion et patate douce sur billons hauts.',
        labelEn: 'Pre-rain canal clearing, submergence-tolerant rice varieties, and raised-bed sweet potato.',
      },
      {
        id: 'b',
        labelFr: 'Semer uniquement des variétés de mil hyper-aride en zone inondable.',
        labelEn: 'Sow exclusively arid pearl millet inside coastal floodplains.',
      },
      {
        id: 'c',
        labelFr: 'Fermer tous les exutoires vers la mer pendant les crues.',
        labelEn: 'Seal all coastal drainage outlets during river surges.',
      },
      {
        id: 'd',
        labelFr: 'Stocker les épices directement sur sol humide sans séchage.',
        labelEn: 'Store harvested spices directly on damp earthen floors without drying.',
      },
    ],
    correctIndex: 0,
    explanationFr:
      'Les crues rapides liées aux pluies convectives IOD+ et aux cyclones exigent des canaux curés dès octobre, des billons drainants et des riz capables de survivre à 10–14 jours de submersion.',
    explanationEn:
      'Convective IOD+ floods and cyclones require pre-cleared drainage canals, raised mounds for tubers, and submergence-tolerant rice able to survive 10–14 days under water.',
    cooperativeActionFr: 'Mobiliser les chantiers coopératifs HIMO pour curer les canaux avant novembre et sécuriser les greniers en hauteur.',
    cooperativeActionEn: 'Organize community canal clearing before November and elevate cooperative spice/grain stores.',
  },
  {
    id: 'post-harvest-pics-storage',
    track: 'all' as never,
    regionLabelFr: 'Toutes coopératives Madagascar (23 Régions)',
    regionLabelEn: 'All Madagascar Cooperatives (23 Regions)',
    seasonWindowFr: 'Avr – Juin (T2 · Récolte & soudure)',
    seasonWindowEn: 'Apr – Jun (Q2 · Harvest & Buffer Storage)',
    promptFr:
      'Quel équipement coopératif simple élimine jusqu’à 98 % des pertes par charançons sans insecticide chimique entre la récolte et la soudure El Niño ?',
    promptEn:
      'Which low-cost cooperative storage technology cuts weevil grain losses by up to 98% without chemical insecticides between harvest and the El Niño lean season?',
    options: [
      {
        id: 'a',
        labelFr: 'Le stockage en tas ouverts à l’air libre sous bâche simple.',
        labelEn: 'Open-air bulk piling under a single plastic tarp.',
      },
      {
        id: 'b',
        labelFr: 'Les sacs hermétiques triple couche PICS dans des greniers surélevés ventilés.',
        labelEn: 'Triple-layer hermetic PICS grain bags inside elevated ventilated granaries.',
      },
      {
        id: 'c',
        labelFr: 'L’ensachage humide juste après récolte sans séchage solaire.',
        labelEn: 'Bagging grain damp immediately after harvest without sun-drying.',
      },
      {
        id: 'd',
        labelFr: 'La vente immédiate de 100 % des réserves le jour de la moisson.',
        labelEn: 'Selling 100% of cooperative reserves on harvest day.',
      },
    ],
    correctIndex: 1,
    explanationFr:
      'Les sacs triple couche PICS privent les ravageurs d’oxygène sans aucun pesticide, permettant aux coopératives de conserver maïs, sorgho, haricot et niébé jusqu’à la période de soudure (T3–T1) à haute valeur.',
    explanationEn:
      'Hermetic triple-layer PICS bags asphyxiate storage pests without pesticides, enabling cooperatives to safely store sorghum, maize, and pulses into peak lean-season demand.',
    cooperativeActionFr: 'Constituer un stock tampon coopératif de 20–30 % en sacs PICS avant la hausse des prix.',
    cooperativeActionEn: 'Build a 20–30% cooperative food buffer in PICS bags prior to seasonal price spikes.',
  },
];

// Normalize the cross-cutting 8th question onto 'highlands-alaotra' or keep track filter matching 'all' safely
export function filterQuizQuestions(track: QuizRegionTrack): CropResilienceQuestion[] {
  if (track === 'all') {
    return CROP_RESILIENCE_QUESTIONS;
  }
  return CROP_RESILIENCE_QUESTIONS.filter(
    (q) => q.track === track || q.id === 'post-harvest-pics-storage',
  );
}

export interface QuizOutcomeSummary {
  correctCount: number;
  answeredCount: number;
  totalCount: number;
  scorePct: number;
  tier: 'master' | 'practitioner' | 'apprentice';
}

export function computeQuizOutcome(
  questions: CropResilienceQuestion[],
  answers: Record<string, number>,
): QuizOutcomeSummary {
  const totalCount = questions.length;
  let answeredCount = 0;
  let correctCount = 0;

  for (const q of questions) {
    const picked = answers[q.id];
    if (typeof picked === 'number') {
      answeredCount += 1;
      if (picked === q.correctIndex) {
        correctCount += 1;
      }
    }
  }

  const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const tier: QuizOutcomeSummary['tier'] =
    scorePct >= 80 ? 'master' : scorePct >= 50 ? 'practitioner' : 'apprentice';

  return {
    correctCount,
    answeredCount,
    totalCount,
    scorePct,
    tier,
  };
}
