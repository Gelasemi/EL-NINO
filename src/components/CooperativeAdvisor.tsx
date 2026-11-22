import { useMemo, useState } from 'react';
import { Check, ClipboardCopy, Building2, CheckSquare, Square } from 'lucide-react';
import { useLanguage, type LanguageCode } from '../i18n/LanguageContext';
import { getLocalizedCooperativeAgencies } from '../i18n/localizedCoreData';

type ZoneKey = 'grand-sud' | 'hautes-terres' | 'nord-sava' | 'nord-ouest-boeny' | 'sud-est';
type CropKey = 'riz' | 'cereales-seches' | 'legumineuses-manioc' | 'vanille-rente';

const ZONES_BY_LANG: Record<LanguageCode, { id: ZoneKey; label: string; regions: string }[]> = {
  fr: [
    { id: 'grand-sud', label: 'Grand Sud & Sud-Ouest', regions: 'Androy, Anosy, Atsimo-Andrefana, Menabe' },
    { id: 'hautes-terres', label: 'Hautes Terres Centrales', regions: 'Analamanga, Vakinankaratra, Itasy, Haute Matsiatra' },
    { id: 'nord-sava', label: 'Extrême Nord', regions: 'Diana, Sava' },
    { id: 'nord-ouest-boeny', label: 'Nord-Ouest', regions: 'Boeny, Sofia, Betsiboka, Melaky' },
    { id: 'sud-est', label: 'Grand Sud-Est & Côte Est', regions: 'Atsimo-Atsinanana, Fitovinany, Alaotra-Mangoro, Atsinanana' },
  ],
  en: [
    { id: 'grand-sud', label: 'Grand Sud & South-West', regions: 'Androy, Anosy, Atsimo-Andrefana, Menabe' },
    { id: 'hautes-terres', label: 'Central Highlands', regions: 'Analamanga, Vakinankaratra, Itasy, Haute Matsiatra' },
    { id: 'nord-sava', label: 'Far North', regions: 'Diana, Sava' },
    { id: 'nord-ouest-boeny', label: 'North-West', regions: 'Boeny, Sofia, Betsiboka, Melaky' },
    { id: 'sud-est', label: 'Grand South-East & East Coast', regions: 'Atsimo-Atsinanana, Fitovinany, Alaotra-Mangoro, Atsinanana' },
  ],
  sw: [
    { id: 'grand-sud', label: 'Kusini Kuu & Kusini-Magharibi', regions: 'Androy, Anosy, Atsimo-Andrefana, Menabe' },
    { id: 'hautes-terres', label: 'Nyanda za Juu za Kati', regions: 'Analamanga, Vakinankaratra, Itasy, Haute Matsiatra' },
    { id: 'nord-sava', label: 'Kaskazini ya Mbali', regions: 'Diana, Sava' },
    { id: 'nord-ouest-boeny', label: 'Kaskazini-Magharibi', regions: 'Boeny, Sofia, Betsiboka, Melaky' },
    { id: 'sud-est', label: 'Kusini-Mashariki & Pwani ya Mashariki', regions: 'Atsimo-Atsinanana, Fitovinany, Alaotra-Mangoro, Atsinanana' },
  ],
};

const CROPS_BY_LANG: Record<LanguageCode, { id: CropKey; label: string }[]> = {
  fr: [
    { id: 'riz', label: 'Riz (irrigué / pluvial)' },
    { id: 'cereales-seches', label: 'Sorgho, Mil ou Maïs' },
    { id: 'legumineuses-manioc', label: 'Haricot, Niébé, Arachide ou Manioc' },
    { id: 'vanille-rente', label: 'Vanille & Cultures de rente' },
  ],
  en: [
    { id: 'riz', label: 'Rice (Irrigated / Rainfed)' },
    { id: 'cereales-seches', label: 'Sorghum, Pearl Millet or Maize' },
    { id: 'legumineuses-manioc', label: 'Bean, Cowpea, Groundnut or Cassava' },
    { id: 'vanille-rente', label: 'Vanilla & Export Cash Crops' },
  ],
  sw: [
    { id: 'riz', label: 'Mpunga (Umwagiliaji / Mvua)' },
    { id: 'cereales-seches', label: 'Mtama, Uwele au Mahindi' },
    { id: 'legumineuses-manioc', label: 'Maharage, Kunde, Karanga au Muhogo' },
    { id: 'vanille-rente', label: 'Vanilla & Mazao ya Biashara' },
  ],
};

function buildAdvice(zone: ZoneKey, crop: CropKey, lang: LanguageCode) {
  if (lang === 'en') {
    if (zone === 'grand-sud') {
      return {
        sowingDate: 'Mid-December 2026 to January 2027 (wait for 20–30 mm rainfall over 3 days)',
        primaryDesks: 'DEFIS Project (MINAE/IFAD) · WFP (Ambovombe / Tolagnaro / Toliara) · FAO · FDA-R',
        technicalAdvice:
          crop === 'cereales-seches'
            ? 'Replace rainfed maize with 90-day sorghum or pearl millet in composted Zaï pits (20 cm) with thick inter-row mulching.'
            : crop === 'legumineuses-manioc'
              ? 'Intercrop spreading cowpea/lablab as moisture cover alongside pigeon pea (ambatry) windbreaks and drought-hardy cassava cuttings.'
              : crop === 'riz'
                ? 'Restrict rice to secured irrigation perimeters; mobilize HIMO/WFP canal desilting and early-maturing varieties.'
                : 'Shield coastal plots with live sisal and spineless cactus windbreaks against dry winds and sand drift.',
      };
    }
    if (zone === 'hautes-terres') {
      return {
        sowingDate: 'Mid-November to Mid-December 2026',
        primaryDesks: 'FDA-R · DRAE / CirAE (PURPA) · GSDM (Antananarivo)',
        technicalAdvice:
          crop === 'riz'
            ? 'Irrigated paddy: young-seedling SRI/SRA transplanting (8–12 days) once sluice gates open. Upland tanety rice: 110–120d cultivars under SCV cover.'
            : crop === 'cereales-seches'
              ? 'Rainfed maize (110–120d cycle) via direct seeding under permanent mulch (SCV), framed by Brachiaria or vetiver grass slope strips.'
              : 'Intercrop climbing beans or soybeans directly within maize rows under SCV (technical coaching and cover seeds via GSDM).',
      };
    }
    if (zone === 'nord-sava') {
      return {
        sowingDate: 'Early to Mid-November 2026 on well-drained plots',
        primaryDesks: 'FDA-R · DRAE / CirAE · BNGRC (flood prevention)',
        technicalAdvice:
          crop === 'vanille-rente'
            ? 'Urgently reinforce shade canopy over vanilla vines using Gliricidia support trees to curb daytime thermal stress.'
            : crop === 'riz'
              ? 'Plant early in November on drained plots and clear drainage ditches against root waterlogging during Dec–Jan downpours.'
              : 'Alternate upland rice and groundnut strips across well-drained land equipped with storm runoff furrows.',
      };
    }
    if (zone === 'nord-ouest-boeny') {
      return {
        sowingDate: 'December 2026 (shifted for delayed monsoon onset)',
        primaryDesks: 'DRAE / CirAE (fertilizer vouchers) · FDA-R · FAO (locust watch)',
        technicalAdvice:
          crop === 'riz'
            ? 'Desilt main irrigation canals ahead of water release, tap DRAE subsidized fertilizer vouchers, and activate plain locust sweeps.'
            : 'Shift upland groundnut and cereal planting into December upon steady rains, paired with soil-conserving mulch.',
      };
    }
    return {
      sowingDate: 'Mid-November to December 2026 (contingent on lowland moisture)',
      primaryDesks: 'DEFIS Project (South-East) · WFP (Manakara) · FDA-R · ANMCC / MINAE',
      technicalAdvice:
        'Rehabilitate irrigated lowlands through HIMO works, prioritize SRI transplanting, and organize cooperative GCV grain banks against 3,200 MGA/kg rice spikes.',
    };
  }

  if (lang === 'sw') {
    if (zone === 'grand-sud') {
      return {
        sowingDate: 'Katikati ya Desemba 2026 hadi Januari 2027 (baada ya mvua mm 20–30 kwa siku 3)',
        primaryDesks: 'Mradi wa DEFIS (MINAE/IFAD) · WFP (Ambovombe / Tolagnaro / Toliara) · FAO · FDA-R',
        technicalAdvice:
          crop === 'cereales-seches'
            ? 'Badilisha mahindi na mtama au uwele wa muda mfupi (siku 90) katika mashimo ya Zaï (cm 20 yenye mbolea) na matandazo.'
            : crop === 'legumineuses-manioc'
              ? 'Panda kunde kufunika udongo dhidi ya mvuke pamoja na mbaazi (ambatry) na vipandikizi vya muhogo vinavyostahimili ukame.'
              : crop === 'riz'
                ? 'Panda mpunga katika mabonde yenye umwagiliaji wa uhakika pekee; safisha mifereji kupitia HIMO/WFP.'
                : 'Linda mashamba ya pwani kwa mistari ya mkonge na dungusi kuzuia upepo mkavu na mchanga.',
      };
    }
    if (zone === 'hautes-terres') {
      return {
        sowingDate: 'Katikati ya Novemba hadi Katikati ya Desemba 2026',
        primaryDesks: 'FDA-R · DRAE / CirAE (PURPA) · GSDM (Antananarivo)',
        technicalAdvice:
          crop === 'riz'
            ? 'Mpunga wa umwagiliaji: pandikiza miche michanga ya siku 8–12 (SRI/SRA). Vilimani (tanety): tumia mbegu za siku 110–120 chini ya SCV.'
            : crop === 'cereales-seches'
              ? 'Mahindi ya tanety (siku 110–120) katika kilimo hifadhi (SCV) pamoja na mistari ya nyasi za Brachiaria au vetiver.'
              : 'Changanya maharage au soya ndani ya mistari ya mahindi chini ya mfumo wa SCV (ushauri na mbegu kupitia GSDM).',
      };
    }
    if (zone === 'nord-sava') {
      return {
        sowingDate: 'Mwanzo hadi Katikati ya Novemba 2026 penye mifereji',
        primaryDesks: 'FDA-R · DRAE / CirAE · BNGRC (ulinzi dhidi ya mafuriko)',
        technicalAdvice:
          crop === 'vanille-rente'
            ? 'Ongeza kwa haraka kivuli cha miti ya Gliricidia juu ya mimea ya vanilla ili kupunguza msongo wa joto.'
            : crop === 'riz'
              ? 'Panda mapema Novemba kwenye mashamba yenye mifereji na safisha njia za maji kuzuia mafuriko ya Des–Jan.'
              : 'Panda mpunga wa mvua na karanga kwa mistari mbadala na mifereji ya kuondoa maji ya ziada.',
      };
    }
    if (zone === 'nord-ouest-boeny') {
      return {
        sowingDate: 'Desemba 2026 (kusogeza kufuatia kuchelewa kwa mvua)',
        primaryDesks: 'DRAE / CirAE (vocha za mbolea) · FDA-R · FAO (doria ya nzige)',
        technicalAdvice:
          crop === 'riz'
            ? 'Safisha mifereji ya umwagiliaji mapema, tumia ruzuku ya mbolea ya DRAE na anza doria dhidi ya nzige.'
            : 'Sogeza upanzi wa karanga na nafaka hadi Desemba mvua zitakapoimarika, ukitumia matandazo.',
      };
    }
    return {
      sowingDate: 'Katikati ya Novemba hadi Desemba 2026 (kulingana na unyevu wa mabonde)',
      primaryDesks: 'Mradi wa DEFIS (Kusini-Mashariki) · WFP (Manakara) · FDA-R · ANMCC / MINAE',
      technicalAdvice:
        'Karabati mifumo ya umwagiliaji kupitia HIMO, tumia upandikizaji wa SRI na imarisha akiba ya ushirika dhidi ya mfumuko wa bei (MGA 3,200/kg).',
    };
  }

  // Default FR
  if (zone === 'grand-sud') {
    return {
      sowingDate: 'Mi-décembre 2026 à janvier 2027 (après 20–30 mm de pluie cumulés sur 3 jours)',
      primaryDesks: 'Projet DEFIS (MINAE/FIDA) · PAM (Ambovombe / Tolagnaro / Toliara) · FAO · FDA-R',
      technicalAdvice:
        crop === 'cereales-seches'
          ? 'Remplacer le maïs traditionnel par du sorgho ou du mil à cycle court (90 j) en poquets Zaï (20 cm avec compost) et paillage des interlignes.'
          : crop === 'legumineuses-manioc'
            ? 'Associer niébé/dolique en couverture anti-évaporation avec rangées de pois d’Angole (ambatry) et boutures de manioc tolérantes au stress hydrique.'
            : crop === 'riz'
              ? 'Limiter le riz aux périmètres irrigués sécurisés ; privilégier le curage des canaux (HIMO/PAM) et les variétés à cycle court.'
              : 'Sécuriser les parcelles côtières par des haies vives (sisal, cactus sans épines) contre les vents secs et l’ensablement.',
    };
  }
  if (zone === 'hautes-terres') {
    return {
      sowingDate: 'Mi-novembre à mi-décembre 2026',
      primaryDesks: 'FDA-R · DRAE / CirAE (PURPA) · GSDM (Antananarivo)',
      technicalAdvice:
        crop === 'riz'
          ? 'Riz irrigué : repiquage jeune (plants de 8 à 12 jours) en SRI/SRA dès mise en eau. Riz pluvial sur tanety : variétés 110–120 j sous couverture SCV.'
          : crop === 'cereales-seches'
            ? 'Maïs sur tanety (cycle 110–120 j) en semis direct sur couverture végétale permanente (SCV), avec bandes enherbées de Brachiaria ou vétiver sur les pentes.'
            : 'Associer haricot grimpant ou soja directement dans les rangs de maïs sous système SCV (appui technique et semences de couverture via GSDM).',
    };
  }
  if (zone === 'nord-sava') {
    return {
      sowingDate: 'Début à mi-novembre 2026 sur parcelles drainées',
      primaryDesks: 'FDA-R · DRAE / CirAE · BNGRC (prévention crues)',
      technicalAdvice:
        crop === 'vanille-rente'
          ? 'Renforcer d’urgence l’ombrage des lianes de vanille avec des arbres tuteurs (Gliricidia) pour limiter le stress thermique diurne.'
          : crop === 'riz'
            ? 'Semer tôt en novembre sur parcelles bien drainées et curer les évacuations d’eau pour éviter l’asphyxie racinaire lors des fortes pluies de décembre–janvier.'
            : 'Associer riz pluvial et arachide en bandes alternées sur terrains ressuyés avec rigoles de drainage.',
    };
  }
  if (zone === 'nord-ouest-boeny') {
    return {
      sowingDate: 'Décembre 2026 (décalage lié au retard des pluies)',
      primaryDesks: 'DRAE / CirAE (vouchers engrais) · FDA-R · FAO (veille acridienne)',
      technicalAdvice:
        crop === 'riz'
          ? 'Curer les canaux d’irrigation avant les lâchers d’eau, mobiliser les engrais subventionnés DRAE et activer la veille antiacridienne sur les plaines.'
          : 'Décaler le semis d’arachide et des céréales pluviales vers décembre dès installation effective des pluies, avec paillage protecteur.',
    };
  }
  return {
    sowingDate: 'Mi-novembre à décembre 2026 (selon disponibilité hydrique des bas-fonds)',
    primaryDesks: 'Projet DEFIS (Sud-Est) · PAM (Manakara) · FDA-R · ANMCC / MINAE',
    technicalAdvice:
      'Réhabiliter les périmètres irrigués via les chantiers HIMO, privilégier le repiquage SRI et sécuriser le stockage coopératif face aux tensions de prix (pic riz à 3 200 MGA/kg).',
  };
}

export function CooperativeAdvisor() {
  const { lang, t, ui } = useLanguage();
  const [zone, setZone] = useState<ZoneKey>('grand-sud');
  const [crop, setCrop] = useState<CropKey>('cereales-seches');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({
    legal: true,
    cirae: false,
    fofifa: false,
    dossier: false,
  });
  const [copied, setCopied] = useState(false);
  const [agencyFilter, setAgencyFilter] = useState<'all' | 'Guichet national' | 'Agence ONU' | 'Appui technique'>('all');

  const zonesList = ZONES_BY_LANG[lang];
  const cropsList = CROPS_BY_LANG[lang];
  const agencies = getLocalizedCooperativeAgencies(lang);
  const checklist = ui.cooperatives.checklistItems;

  const recommendation = useMemo(() => {
    const zoneMeta = zonesList.find((z) => z.id === zone) ?? zonesList[0];
    const advice = buildAdvice(zone, crop, lang);
    return {
      zoneLabel: zoneMeta.label,
      regions: zoneMeta.regions,
      ...advice,
    };
  }, [zone, crop, lang, zonesList]);

  const toggleCheck = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;

  const handleCopySummary = async () => {
    const summary = [
      `${ui.cooperatives.summaryTemplateTitle} — ${recommendation.zoneLabel} (${recommendation.regions})`,
      `${ui.cooperatives.selectCropLabel} : ${cropsList.find((c) => c.id === crop)?.label}`,
      `${ui.cooperatives.windowLabel} : ${recommendation.sowingDate}`,
      `${ui.cooperatives.practiceLabel} : ${recommendation.technicalAdvice}`,
      `${ui.cooperatives.deskLabel} : ${recommendation.primaryDesks}`,
      `3-2-1 (Airtel, Yas/Telma, Orange)`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const filteredAgencies =
    agencyFilter === 'all' ? agencies : agencies.filter((a) => a.type === agencyFilter);

  const filterButtons: Array<{ key: 'all' | 'Guichet national' | 'Agence ONU' | 'Appui technique'; label: string }> = [
    { key: 'all', label: ui.cooperatives.agencyFilters.Tous },
    { key: 'Guichet national', label: ui.cooperatives.agencyFilters['Guichet national'] },
    { key: 'Agence ONU', label: ui.cooperatives.agencyFilters['Agence ONU'] },
    { key: 'Appui technique', label: ui.cooperatives.agencyFilters['Appui technique'] },
  ];

  return (
    <section id="cooperatives" className="border-b border-zinc-200 bg-[#F9F8F4] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium tracking-wider text-zinc-500">
            {t.sections.s10Eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {t.sections.s10Title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-zinc-600">
            {t.sections.s10Lead}
          </p>
        </div>

        {/* Interactive District & Crop Advisor */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Configuration & Checklist */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-5">
            <h3 className="font-serif text-xl font-semibold text-zinc-900">
              {ui.cooperatives.tailoredTitle}
            </h3>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="coop-zone" className="block text-xs font-semibold text-zinc-700">
                  {ui.cooperatives.selectZoneLabel}
                </label>
                <select
                  id="coop-zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value as ZoneKey)}
                  className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  {zonesList.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label} ({z.regions})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="coop-crop" className="block text-xs font-semibold text-zinc-700">
                  {ui.cooperatives.selectCropLabel}
                </label>
                <select
                  id="coop-crop"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropKey)}
                  className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 focus:border-[#1E3A8A] focus:outline-none"
                >
                  {cropsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Readiness Checklist */}
            <div className="mt-7 border-t border-zinc-200 pt-5">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-xs font-semibold text-zinc-900">
                  {ui.cooperatives.readinessTitle}
                </h4>
                <span className="font-mono text-xs font-medium text-[#1E3A8A] tabular-nums">
                  {completedCount}/{checklist.length}
                </span>
              </div>

              <ul className="mt-3 space-y-2.5">
                {checklist.map((item) => {
                  const checked = !!checkedSteps[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => toggleCheck(item.id)}
                        className="flex w-full items-start gap-2.5 rounded-md border border-zinc-200 bg-white p-3 text-left transition-colors hover:border-zinc-300"
                      >
                        {checked ? (
                          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                        ) : (
                          <Square className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                        )}
                        <span
                          className={`block text-xs font-medium leading-snug ${
                            checked ? 'text-zinc-500 line-through' : 'text-zinc-900'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right: Tailored Recommendation Output */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <p className="text-xs font-medium text-zinc-500">
                  {ui.cooperatives.tailoredTitle}
                  <span aria-hidden="true" className="mx-2 text-zinc-300">·</span>
                  {recommendation.regions}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-zinc-900">
                  {recommendation.zoneLabel}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-[#F9F8F4] px-3.5 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                    {ui.cooperatives.copiedSummaryBtn}
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                    {ui.cooperatives.copySummaryBtn}
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
                <p className="text-xs font-semibold text-zinc-500">
                  {ui.cooperatives.windowLabel}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#1E3A8A]">
                  {recommendation.sowingDate}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-500">
                  {ui.cooperatives.practiceLabel}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">
                  {recommendation.technicalAdvice}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="text-xs font-semibold text-zinc-500">
                  {ui.cooperatives.deskLabel}
                </h4>
                <p className="mt-1.5 text-sm font-semibold text-zinc-900">
                  {recommendation.primaryDesks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Directory Table */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              <h3 className="font-serif text-xl font-semibold text-zinc-900">
                {ui.cooperatives.directoryTitle}
              </h3>
            </div>

            <div
              role="group"
              aria-label={ui.cooperatives.directoryTitle}
              className="flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-1"
            >
              {filterButtons.map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setAgencyFilter(btn.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    agencyFilter === btn.key
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="border-b border-zinc-200 bg-[#F9F8F4] text-xs font-semibold text-zinc-700">
                <tr>
                  <th className="w-1/4 px-5 py-3.5">{ui.cooperatives.tableHeaders.org}</th>
                  <th className="w-1/3 px-5 py-3.5">{ui.cooperatives.tableHeaders.role}</th>
                  <th className="w-1/5 px-5 py-3.5">{ui.cooperatives.tableHeaders.action}</th>
                  <th className="px-5 py-3.5">{ui.cooperatives.tableHeaders.contact}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {filteredAgencies.map((agency) => (
                  <tr key={agency.name} className="align-top hover:bg-zinc-50/70">
                    <td className="px-5 py-4">
                      <span className="block font-semibold text-zinc-900">{agency.name}</span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {ui.cooperatives.agencyFilters[agency.type]}
                      </span>
                    </td>
                    <td className="px-5 py-4 leading-relaxed text-zinc-700">{agency.role}</td>
                    <td className="px-5 py-4 text-xs leading-relaxed text-zinc-600">
                      {agency.address}
                    </td>
                    <td className="px-5 py-4 text-xs leading-relaxed text-zinc-700">
                      <span className="block font-mono font-medium text-zinc-900">
                        {agency.contact}
                      </span>
                      <span className="mt-1 block text-zinc-500">{agency.eligibilityOrAction}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
