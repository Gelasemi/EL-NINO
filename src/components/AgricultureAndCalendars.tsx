import { useMemo, useState } from 'react';
import { Calendar, Droplets, PhoneCall, Search, Sprout } from 'lucide-react';
import type { AgriculturalZoneTechnique, ExProvinceName } from '../data/ensoData';
import {
  MADAGASCAR_23_REGION_CALENDARS,
  type CalendarCropType,
} from '../data/madagascarCropCalendars';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';
import { getLocalizedAgriculturalZones } from '../i18n/localizedCoreData';

type CropFilter = 'all' | CalendarCropType;
type ProvinceFilter = 'all' | ExProvinceName;

const EX_PROVINCES: ExProvinceName[] = [
  'Toliara',
  'Fianarantsoa',
  'Toamasina',
  'Mahajanga',
  'Antananarivo',
  'Antsiranana',
];

interface RegionalCalendarCopy {
  blockTitle: string;
  blockSubtitle: string;
  allCropsBtn: string;
  cropLabels: Record<CalendarCropType, string>;
  allProvincesOpt: string;
  searchPlaceholder: string;
  plantingLegend: string;
  harvestLegend: string;
  plantingLabel: string;
  harvestLabel: string;
  elNinoTipPrefix: string;
  regionsShown: string;
  emptyFilterMsg: string;
  months12: string[];
}

const REGIONAL_CALENDAR_COPY: Record<WorldLanguageCode, RegionalCalendarCopy> = {
  fr: {
    blockTitle: 'Calendrier agricole interactif des 23 régions de Madagascar (Riz · Maïs · Manioc)',
    blockSubtitle:
      'Filtrez par type de culture ou ex-province pour visualiser les fenêtres de semis (implantation) et de récolte sur l’année culturale (Octobre → Septembre), avec ajustement FOFIFA/DGM sous El Niño.',
    allCropsBtn: 'Toutes les cultures (3)',
    cropLabels: { rice: 'Riz', maize: 'Maïs', cassava: 'Manioc' },
    allProvincesOpt: 'Toutes les 6 ex-provinces (23 régions)',
    searchPlaceholder: 'Rechercher une région (ex. Androy, Alaotra, SAVA)…',
    plantingLegend: 'Fenêtre de semis / plantation',
    harvestLegend: 'Fenêtre de récolte',
    plantingLabel: 'Semis',
    harvestLabel: 'Récolte',
    elNinoTipPrefix: 'Ajustement El Niño',
    regionsShown: 'régions affichées',
    emptyFilterMsg: 'Aucune région ne correspond à ce filtre.',
    months12: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep'],
  },
  en: {
    blockTitle: 'Interactive Agricultural Calendar Across All 23 Madagascar Regions (Rice · Maize · Cassava)',
    blockSubtitle:
      'Filter by specific crop or ex-province to inspect exact planting and harvest windows across the October–September crop campaign, including FOFIFA/DGM El Niño adjustments.',
    allCropsBtn: 'All Crops (3)',
    cropLabels: { rice: 'Rice', maize: 'Maize', cassava: 'Cassava' },
    allProvincesOpt: 'All 6 Ex-Provinces (23 Regions)',
    searchPlaceholder: 'Search a region (e.g. Androy, Alaotra, SAVA)…',
    plantingLegend: 'Planting / Sowing Window',
    harvestLegend: 'Harvest Window',
    plantingLabel: 'Planting',
    harvestLabel: 'Harvest',
    elNinoTipPrefix: 'El Niño Advisory',
    regionsShown: 'regions shown',
    emptyFilterMsg: 'No Madagascar region matches the current filter.',
    months12: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
  sw: {
    blockTitle: 'Kalenda Hai ya Kilimo kwa Mikoa 23 ya Madagaska (Mpunga · Mahindi · Muhogo)',
    blockSubtitle:
      'Chuja kwa zao au jimbo kuona vipindi vya kupanda na kuvuna kati ya Oktoba hadi Septemba pamoja na marekebisho ya El Niño.',
    allCropsBtn: 'Mazao Yote (3)',
    cropLabels: { rice: 'Mpunga', maize: 'Mahindi', cassava: 'Muhogo' },
    allProvincesOpt: 'Majimbo Yote 6 (Mikoa 23)',
    searchPlaceholder: 'Tafuta mkoa (mfano Androy, Alaotra)…',
    plantingLegend: 'Muda wa Kupanda',
    harvestLegend: 'Muda wa Kuvuna',
    plantingLabel: 'Kupanda',
    harvestLabel: 'Kuvuna',
    elNinoTipPrefix: 'Marekebisho ya El Niño',
    regionsShown: 'mikoa imeonyeshwa',
    emptyFilterMsg: 'Hakuna mkoa unaolingana na kichujio.',
    months12: ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep'],
  },
  es: {
    blockTitle: 'Calendario agrícola interactivo de las 23 regiones de Madagascar (Arroz · Maíz · Yuca)',
    blockSubtitle:
      'Filtra por cultivo o ex-provincia para consultar las ventanas de siembra y cosecha en la campaña agrícola (Octubre → Septiembre) con ajustes frente a El Niño.',
    allCropsBtn: 'Todos los cultivos (3)',
    cropLabels: { rice: 'Arroz', maize: 'Maíz', cassava: 'Yuca' },
    allProvincesOpt: 'Las 6 ex-provincias (23 regiones)',
    searchPlaceholder: 'Buscar región (ej. Androy, Alaotra, SAVA)…',
    plantingLegend: 'Ventana de siembra',
    harvestLegend: 'Ventana de cosecha',
    plantingLabel: 'Siembra',
    harvestLabel: 'Cosecha',
    elNinoTipPrefix: 'Ajuste El Niño',
    regionsShown: 'regiones mostradas',
    emptyFilterMsg: 'Ninguna región coincide con el filtro actual.',
    months12: ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
  },
  ar: {
    blockTitle: 'التقويم الزراعي التفاعلي لمناطق مدغشقر الـ 23 (الأرز · الذرة · الكسافا)',
    blockSubtitle:
      'صفّ حسب نوع المحصول أو الإقليم لعرض فترات الزراعة والحصاد على مدار الموسم الزراعي (أكتوبر ← سبتمبر) مع تعديلات النينيو.',
    allCropsBtn: 'جميع المحاصيل (3)',
    cropLabels: { rice: 'الأرز', maize: 'الذرة', cassava: 'الكسافا' },
    allProvincesOpt: 'الأقاليم الستة كافة (23 منطقة)',
    searchPlaceholder: 'ابحث عن منطقة (مثل Androy, Alaotra)…',
    plantingLegend: 'فترة الزراعة / البذر',
    harvestLegend: 'فترة الحصاد',
    plantingLabel: 'الزراعة',
    harvestLabel: 'الحصاد',
    elNinoTipPrefix: 'تعديل النينيو',
    regionsShown: 'مناطق معروضة',
    emptyFilterMsg: 'لا توجد منطقة مطابقة لهذا الفلتر.',
    months12: ['أكت', 'نوف', 'ديس', 'ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت'],
  },
  zh: {
    blockTitle: '马达加斯加 23 个大区交互式农业日历（水稻 · 玉米 · 木薯）',
    blockSubtitle:
      '按作物类型或前省筛选，查看各区域在 10 月至次年 9 月农季中的播种窗口与收获窗口，含厄尔尼诺适应性调整。',
    allCropsBtn: '全部作物 (3)',
    cropLabels: { rice: '水稻', maize: '玉米', cassava: '木薯' },
    allProvincesOpt: '全部 6 个前省（23 个大区）',
    searchPlaceholder: '搜索区域（如 Androy, Alaotra, SAVA）…',
    plantingLegend: '播种 / 种植窗口',
    harvestLegend: '收获窗口',
    plantingLabel: '播种',
    harvestLabel: '收获',
    elNinoTipPrefix: '厄尔尼诺农艺调整',
    regionsShown: '个显示区域',
    emptyFilterMsg: '没有匹配当前筛选条件的大区。',
    months12: ['10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
  },
  pt: {
    blockTitle: 'Calendário agrícola interativo das 23 regiões de Madagáscar (Arroz · Milho · Mandioca)',
    blockSubtitle:
      'Filtre por cultura ou ex-província para consultar as janelas de plantio e colheita na safra (Outubro → Setembro) com ajustes El Niño.',
    allCropsBtn: 'Todas as culturas (3)',
    cropLabels: { rice: 'Arroz', maize: 'Milho', cassava: 'Mandioca' },
    allProvincesOpt: 'Todas as 6 ex-províncias (23 regiões)',
    searchPlaceholder: 'Pesquisar região (ex. Androy, Alaotra)…',
    plantingLegend: 'Janela de plantio',
    harvestLegend: 'Janela de colheita',
    plantingLabel: 'Plantio',
    harvestLabel: 'Colheita',
    elNinoTipPrefix: 'Ajuste El Niño',
    regionsShown: 'regiões exibidas',
    emptyFilterMsg: 'Nenhuma região corresponde ao filtro selecionado.',
    months12: ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
  },
  hi: {
    blockTitle: 'मेडागास्कर के सभी 23 क्षेत्रों का इंटरैक्टिव कृषि कैलेंडर (चावल · मक्का · कसावा)',
    blockSubtitle:
      'अक्टूबर–सितंबर फसल सत्र में प्रत्येक क्षेत्र की बुवाई और कटाई की अवधि देखने के लिए फसल या प्रांत के अनुसार फ़िल्टर करें।',
    allCropsBtn: 'सभी फसलें (3)',
    cropLabels: { rice: 'चावल', maize: 'मक्का', cassava: 'कसावा' },
    allProvincesOpt: 'सभी 6 प्रांत (23 क्षेत्र)',
    searchPlaceholder: 'क्षेत्र खोजें (जैसे Androy, Alaotra)…',
    plantingLegend: 'बुवाई / रोपाई अवधि',
    harvestLegend: 'कटाई अवधि',
    plantingLabel: 'बुवाई',
    harvestLabel: 'कटाई',
    elNinoTipPrefix: 'अल नीनो सलाह',
    regionsShown: 'क्षेत्र प्रदर्शित',
    emptyFilterMsg: 'वर्तमान फ़िल्टर से कोई क्षेत्र मेल नहीं खाता।',
    months12: ['अक्टू', 'नवं', 'दिसं', 'जन', 'फर', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुला', 'अग', 'सितं'],
  },
  ru: {
    blockTitle: 'Интерактивный агрокалендарь 23 регионов Мадагаскара (Рис · Кукуруза · Маниок)',
    blockSubtitle:
      'Фильтруйте по культуре или экс-провинции, чтобы увидеть окна посева и сбора урожая на аграрный год (октябрь → сентябрь) с поправкой на Эль-Ниньо.',
    allCropsBtn: 'Все культуры (3)',
    cropLabels: { rice: 'Рис', maize: 'Кукуруза', cassava: 'Маниок' },
    allProvincesOpt: 'Все 6 экс-провинций (23 региона)',
    searchPlaceholder: 'Поиск региона (напр., Androy, Alaotra)…',
    plantingLegend: 'Окно посева / посадки',
    harvestLegend: 'Окно сбора урожая',
    plantingLabel: 'Посев',
    harvestLabel: 'Уборка',
    elNinoTipPrefix: 'Поправка Эль-Ниньо',
    regionsShown: 'регионов показано',
    emptyFilterMsg: 'Нет регионов, соответствующих текущему фильтру.',
    months12: ['Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
  },
};

export function AgricultureAndCalendars() {
  const { lang, worldLang, t, ui } = useLanguage();
  const [selectedZoneId, setSelectedZoneId] = useState<AgriculturalZoneTechnique['id']>('grand-sud');

  // Interactive 23-region crop calendar filter state
  const [cropFilter, setCropFilter] = useState<CropFilter>('all');
  const [provinceFilter, setProvinceFilter] = useState<ProvinceFilter>('all');
  const [regionQuery, setRegionQuery] = useState('');
  const [expandedRegion, setExpandedRegion] = useState<string>('Androy');

  const zones = getLocalizedAgriculturalZones(lang);
  const activeZone = zones.find((z) => z.id === selectedZoneId) ?? zones[0];
  const rCopy = REGIONAL_CALENDAR_COPY[worldLang];
  const isFrUi = worldLang === 'fr';

  const visibleCrops: CalendarCropType[] = useMemo(
    () => (cropFilter === 'all' ? ['rice', 'maize', 'cassava'] : [cropFilter]),
    [cropFilter],
  );

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    return MADAGASCAR_23_REGION_CALENDARS.filter((reg) => {
      if (provinceFilter !== 'all' && reg.province !== provinceFilter) return false;
      if (q) {
        const hay = `${reg.region} ${reg.province} ${reg.climateBandFr} ${reg.climateBandEn}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [provinceFilter, regionQuery]);

  return (
    <section id="calendriers" className="border-b border-zinc-200 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-wider text-zinc-500">
              {t.sections.s05Eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {t.sections.s05Title}
            </h2>
            <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-zinc-600">
              {t.sections.s05Lead}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shrink-0 max-w-md">
            <PhoneCall className="h-4 w-4 text-[#1E3A8A] shrink-0" aria-hidden="true" />
            <div className="text-xs">
              <span className="block font-semibold text-zinc-900">
                {ui.calendars.smsTitle}
              </span>
              <span className="text-zinc-500 line-clamp-2">{ui.calendars.smsBody}</span>
            </div>
          </div>
        </div>

        {/* Zone Segmented Tabs */}
        <div className="mt-8 flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 bg-white p-1.5">
          {zones.map((zone) => {
            const isActive = zone.id === selectedZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {zone.title}
              </button>
            );
          })}
        </div>

        {/* Zone Detail & Sowing Timeline Matrix */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Sowing Window Gantt Timeline */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-100 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-zinc-900">
                  {activeZone.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {ui.calendars.regionsPrefix} {activeZone.regions}
                </p>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1E3A8A]">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {activeZone.sowingWindow}
              </div>
            </div>

            <div className="mt-4 rounded-md border border-zinc-200 bg-[#F9F8F4] p-4">
              <p className="text-xs font-semibold text-zinc-900">
                {ui.calendars.triggerTitle}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-700">
                {activeZone.triggerRule}
              </p>
            </div>

            {/* Monthly Visual Calendar Matrix */}
            <div className="mt-6">
              <div className="grid grid-cols-6 border-b border-zinc-200 pb-2 text-center font-mono text-[11px] font-medium text-zinc-500">
                {ui.calendars.months.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>

              <div className="divide-y divide-zinc-100">
                {activeZone.calendarBars.map((bar) => {
                  const leftPct = (bar.startMonthIdx / 6) * 100;
                  const widthPct = ((bar.endMonthIdx - bar.startMonthIdx) / 6) * 100;

                  return (
                    <div key={bar.crop} className="py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{bar.crop}</span>
                        <span className="font-mono text-xs text-zinc-500 tabular-nums">
                          {ui.calendars.cyclePrefix} {bar.cycleDays}
                        </span>
                      </div>

                      <div className="relative mt-2.5 h-6 w-full rounded bg-zinc-100">
                        {[1, 2, 3, 4, 5].map((idx) => (
                          <div
                            key={idx}
                            aria-hidden="true"
                            style={{ left: `${(idx / 6) * 100}%` }}
                            className="absolute top-0 bottom-0 w-px bg-zinc-200/80"
                          />
                        ))}
                        <div
                          style={{
                            left: `${Math.max(0, leftPct)}%`,
                            width: `${Math.min(100 - leftPct, widthPct)}%`,
                          }}
                          className="absolute top-1 bottom-1 rounded bg-[#1E3A8A]/85"
                        />
                      </div>

                      <p className="mt-1.5 text-xs text-zinc-600">{bar.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Agronomic Practices & Soil Water Conservation */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-zinc-900">
                  {ui.calendars.associationsTitle}
                </h4>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-700">
                {activeZone.cropAssociation}
              </p>

              <div className="mt-4 border-t border-zinc-100 pt-4">
                <p className="text-xs font-medium text-zinc-500">{ui.calendars.priorityCropsTitle}</p>
                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {activeZone.priorityCrops.join(' · ')}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-zinc-900">
                  {ui.calendars.waterSoilTitle}
                </h4>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-700">
                {activeZone.waterAndSoilPractice}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h4 className="text-sm font-semibold text-zinc-900">
                {ui.calendars.transversalTitle}
              </h4>
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-600">
                {ui.calendars.transversalText}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive 23-Region Madagascar Crop Calendar (Rice, Maize, Cassava Planting & Harvest Windows) */}
        <div className="mt-12 rounded-lg border border-zinc-200 bg-[#F9F8F4] p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h3 className="font-serif text-xl font-semibold text-zinc-900 sm:text-2xl">
                {rCopy.blockTitle}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                {rCopy.blockSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-700 shrink-0">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-5 rounded-xs bg-[#1E3A8A]" aria-hidden="true" />
                <span>{rCopy.plantingLegend}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-5 rounded-xs bg-emerald-700" aria-hidden="true" />
                <span>{rCopy.harvestLegend}</span>
              </span>
            </div>
          </div>

          {/* Crop Type & Region Controls */}
          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter by crop type"
              className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1"
            >
              {(
                [
                  { id: 'all', label: rCopy.allCropsBtn },
                  { id: 'rice', label: rCopy.cropLabels.rice },
                  { id: 'maize', label: rCopy.cropLabels.maize },
                  { id: 'cassava', label: rCopy.cropLabels.cassava },
                ] as const
              ).map((opt) => {
                const active = cropFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCropFilter(opt.id)}
                    className={`min-h-9 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                aria-label={rCopy.allProvincesOpt}
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value as ProvinceFilter)}
                className="min-h-10 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="all">{rCopy.allProvincesOpt}</option>
                {EX_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>

              <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={regionQuery}
                  onChange={(e) => setRegionQuery(e.target.value)}
                  placeholder={rCopy.searchPlaceholder}
                  aria-label={rCopy.searchPlaceholder}
                  className="min-h-10 w-full rounded-md border border-zinc-300 bg-white pr-3 pl-8 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-[#1E3A8A] focus:outline-none"
                />
              </div>

              <span className="font-mono text-xs text-zinc-500 tabular-nums">
                {filteredRegions.length} {rCopy.regionsShown}
              </span>
            </div>
          </div>

          {/* 12-Month Calendar Header */}
          <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-12 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-600">
                <div className="col-span-4">Madagascar · Ex-Province</div>
                <div className="col-span-8 grid grid-cols-12 text-center font-mono text-[11px] font-medium text-zinc-500">
                  {rCopy.months12.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {filteredRegions.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-zinc-500">
                  {rCopy.emptyFilterMsg}
                </p>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {filteredRegions.map((reg) => {
                    const isOpen = expandedRegion === reg.region;
                    return (
                      <div key={reg.region} className="px-4 py-3.5 transition-colors hover:bg-zinc-50/70">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedRegion(isOpen ? '' : reg.region)}
                            className="text-left focus-visible:outline-2 focus-visible:outline-[#1E3A8A]"
                          >
                            <span className="text-sm font-semibold text-zinc-900 hover:text-[#1E3A8A]">
                              {reg.region}
                            </span>
                            <span className="ml-2 text-xs text-zinc-500">
                              · {reg.province} · {isFrUi ? reg.climateBandFr : reg.climateBandEn}
                            </span>
                          </button>
                        </div>

                        <div className="mt-2.5 space-y-2">
                          {visibleCrops.map((cropKey) => {
                            const entry = reg.crops[cropKey];
                            const pLeft = (entry.plantingStartIdx / 12) * 100;
                            const pWidth = ((entry.plantingEndIdx - entry.plantingStartIdx) / 12) * 100;
                            const hLeft = (entry.harvestStartIdx / 12) * 100;
                            const hWidth = ((entry.harvestEndIdx - entry.harvestStartIdx) / 12) * 100;

                            return (
                              <div key={cropKey} className="grid grid-cols-12 items-center gap-2">
                                <div className="col-span-4 flex flex-wrap items-baseline justify-between gap-1 pr-2 text-xs">
                                  <span className="font-medium text-zinc-800">
                                    {rCopy.cropLabels[cropKey]}
                                  </span>
                                  <span className="font-mono text-[10.5px] text-zinc-500 tabular-nums">
                                    {rCopy.plantingLabel}:{' '}
                                    {isFrUi ? entry.plantingLabelFr : entry.plantingLabelEn} ·{' '}
                                    {rCopy.harvestLabel}:{' '}
                                    {isFrUi ? entry.harvestLabelFr : entry.harvestLabelEn}
                                  </span>
                                </div>

                                <div className="col-span-8 relative h-6 rounded bg-zinc-100">
                                  {Array.from({ length: 11 }, (_, idx) => (
                                    <div
                                      key={idx}
                                      aria-hidden="true"
                                      style={{ left: `${((idx + 1) / 12) * 100}%` }}
                                      className="absolute top-0 bottom-0 w-px bg-zinc-200/80"
                                    />
                                  ))}

                                  {/* Planting window bar */}
                                  <div
                                    title={`${rCopy.plantingLabel}: ${
                                      isFrUi ? entry.plantingLabelFr : entry.plantingLabelEn
                                    }`}
                                    style={{
                                      left: `${Math.max(0, pLeft)}%`,
                                      width: `${Math.max(6, Math.min(100 - pLeft, pWidth))}%`,
                                    }}
                                    className="absolute top-1 bottom-1 rounded-xs bg-[#1E3A8A]/90"
                                  />

                                  {/* Harvest window bar */}
                                  <div
                                    title={`${rCopy.harvestLabel}: ${
                                      isFrUi ? entry.harvestLabelFr : entry.harvestLabelEn
                                    }`}
                                    style={{
                                      left: `${Math.max(0, hLeft)}%`,
                                      width: `${Math.max(6, Math.min(100 - hLeft, hWidth))}%`,
                                    }}
                                    className="absolute top-1 bottom-1 rounded-xs bg-emerald-700/90"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {isOpen && (
                          <div className="mt-3 rounded-md border border-zinc-200 bg-[#F9F8F4] p-3 text-xs text-zinc-700">
                            <div className="space-y-1.5">
                              {visibleCrops.map((cropKey) => {
                                const entry = reg.crops[cropKey];
                                return (
                                  <p key={cropKey} className="leading-relaxed">
                                    <strong className="text-zinc-900">
                                      {rCopy.cropLabels[cropKey]}
                                    </strong>{' '}
                                    ({isFrUi ? entry.varietyNoteFr : entry.varietyNoteEn}) —{' '}
                                    <span className="text-zinc-600">
                                      {rCopy.elNinoTipPrefix}:{' '}
                                      {isFrUi
                                        ? entry.elNinoAdjustmentFr
                                        : entry.elNinoAdjustmentEn}
                                    </span>
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
