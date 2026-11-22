import {
  EUR_PER_USD,
  MGA_PER_USD,
  type CurrencyCode,
  type EconomicAggregatedModel,
  type HorizonYear,
  type ScenarioKey,
  type ScopeMode,
} from './economicAggregation';

export interface EconomicCsvBuildParams {
  model: EconomicAggregatedModel;
  currency: CurrencyCode;
  horizonYear: HorizonYear;
  scenario: ScenarioKey;
  scope: ScopeMode;
  hasLiveScrape?: boolean;
  madagascarLiveFactor?: number;
  africaLiveFactor?: number;
}

export function getCurrencyUnitLabel(currency: CurrencyCode): string {
  if (currency === 'EUR') return 'M EUR';
  if (currency === 'MGA') return 'Md MGA';
  return 'M USD';
}

export function convertMUsdToCurrencyValue(mUsd: number, currency: CurrencyCode): number {
  if (currency === 'EUR') return Number((mUsd * EUR_PER_USD).toFixed(2));
  if (currency === 'MGA') return Number((mUsd * (MGA_PER_USD / 1000)).toFixed(2));
  return Number(mUsd.toFixed(2));
}

export function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value.toString() : '0';
  }
  const str = String(value);
  // Mitigate spreadsheet formula injection for string fields
  const safeStr = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  if (/[",\r\n]/.test(safeStr)) {
    return `"${safeStr.replace(/"/g, '""')}"`;
  }
  return safeStr;
}

function fmtNum(val: number, digits = 2): string {
  if (!Number.isFinite(val)) return '0.00';
  return val.toFixed(digits);
}

export function buildEconomicSimulationCsv(params: EconomicCsvBuildParams): {
  content: string;
  filename: string;
  rowCount: number;
} {
  const {
    model,
    currency,
    horizonYear,
    scenario,
    scope,
    hasLiveScrape = false,
    madagascarLiveFactor = 1,
    africaLiveFactor = 1,
  } = params;

  const currencyUnit = getCurrencyUnitLabel(currency);
  const calibrationMode = hasLiveScrape
    ? `live_sync(MDG:${madagascarLiveFactor.toFixed(3)}|AFR:${africaLiveFactor.toFixed(3)})`
    : 'baseline_ml';

  const header = [
    'level',
    'entity',
    'parent_or_bloc',
    'horizon_year',
    'scenario',
    'scope',
    'calibration_mode',
    'rice_loss_musd',
    'maize_loss_musd',
    'export_crop_loss_musd',
    'direct_loss_musd',
    'indirect_loss_musd',
    'total_loss_musd',
    'selected_currency',
    'selected_currency_unit',
    'total_loss_selected_currency',
    'gdp_impact_pct',
    'agri_impact_pct',
    'gross_rebound_2028_musd',
    'net_balance_2028_musd',
    'notes',
  ];

  const rows: string[][] = [];

  const pushRow = (r: {
    level: string;
    entity: string;
    parentOrBloc: string;
    rowScope?: string;
    riceLossMUsd?: number;
    maizeLossMUsd?: number;
    exportLossMUsd?: number;
    directLossMUsd: number;
    indirectLossMUsd: number;
    totalLossMUsd: number;
    gdpImpactPct?: number;
    agriImpactPct?: number;
    grossRebound2028MUsd?: number;
    netBalance2028MUsd?: number;
    notes?: string;
  }) => {
    const convertedTotal = convertMUsdToCurrencyValue(r.totalLossMUsd, currency);
    rows.push([
      r.level,
      r.entity,
      r.parentOrBloc,
      String(horizonYear),
      scenario.toUpperCase(),
      r.rowScope ?? scope,
      calibrationMode,
      r.riceLossMUsd !== undefined ? fmtNum(r.riceLossMUsd) : '',
      r.maizeLossMUsd !== undefined ? fmtNum(r.maizeLossMUsd) : '',
      r.exportLossMUsd !== undefined ? fmtNum(r.exportLossMUsd) : '',
      fmtNum(r.directLossMUsd),
      fmtNum(r.indirectLossMUsd),
      fmtNum(r.totalLossMUsd),
      currency,
      currencyUnit,
      fmtNum(convertedTotal),
      r.gdpImpactPct !== undefined ? fmtNum(r.gdpImpactPct) : '',
      r.agriImpactPct !== undefined ? fmtNum(r.agriImpactPct) : '',
      r.grossRebound2028MUsd !== undefined ? fmtNum(r.grossRebound2028MUsd) : '',
      r.netBalance2028MUsd !== undefined ? fmtNum(r.netBalance2028MUsd) : '',
      r.notes ?? '',
    ]);
  };

  // 1. National Madagascar summary
  const sumRice = model.provinceRows.reduce((acc, p) => acc + p.riceLossMUsd, 0);
  const sumMaize = model.provinceRows.reduce((acc, p) => acc + p.maizeLossMUsd, 0);
  const sumExport = model.provinceRows.reduce((acc, p) => acc + p.exportLossMUsd, 0);
  pushRow({
    level: 'National_Summary',
    entity: 'Madagascar (National Total)',
    parentOrBloc: 'COI;SADC;COMESA',
    riceLossMUsd: sumRice,
    maizeLossMUsd: sumMaize,
    exportLossMUsd: sumExport,
    directLossMUsd: model.madagascar.directMUsd,
    indirectLossMUsd: model.madagascar.indirectMUsd,
    totalLossMUsd: model.madagascar.totalLossMUsd,
    gdpImpactPct: model.madagascar.gdpPct,
    agriImpactPct: model.madagascar.agriPct,
    grossRebound2028MUsd: model.madagascar.rebound2028MUsd,
    netBalance2028MUsd: model.madagascar.net2028MUsd,
    notes: `GDP baseline ${model.madagascar.gdpMUsd} M USD | Agri baseline ${model.madagascar.agriBaseMUsd} M USD`,
  });

  // 2. Regional & Continental Bloc Summaries
  pushRow({
    level: 'Regional_Bloc',
    entity: 'IOC / COI (Indian Ocean Commission)',
    parentOrBloc: 'Indian Ocean',
    directLossMUsd: model.blocs.coiTotalMUsd * 0.56,
    indirectLossMUsd: model.blocs.coiTotalMUsd * 0.44,
    totalLossMUsd: model.blocs.coiTotalMUsd,
    notes: 'Madagascar, Comoros, Mauritius, Seychelles, Reunion & Mayotte',
  });
  pushRow({
    level: 'Regional_Bloc',
    entity: 'SADC (Southern Africa + IOC)',
    parentOrBloc: 'Africa',
    directLossMUsd: model.blocs.sadcTotalMUsd * 0.54,
    indirectLossMUsd: model.blocs.sadcTotalMUsd * 0.46,
    totalLossMUsd: model.blocs.sadcTotalMUsd,
    notes: 'Southern African maize belt + Indian Ocean islands',
  });
  pushRow({
    level: 'Regional_Bloc',
    entity: 'COMESA (North-South Corridor & Islands)',
    parentOrBloc: 'Africa',
    directLossMUsd: model.blocs.comesaTotalMUsd * 0.53,
    indirectLossMUsd: model.blocs.comesaTotalMUsd * 0.47,
    totalLossMUsd: model.blocs.comesaTotalMUsd,
    notes: 'East Africa flood corridor + Southern Africa & Nile heat/drought',
  });
  pushRow({
    level: 'Regional_Bloc',
    entity: 'Africa Total (21 Modeled Zones)',
    parentOrBloc: 'Continent',
    directLossMUsd: model.blocs.africaTotalMUsd * 0.54,
    indirectLossMUsd: model.blocs.africaTotalMUsd * 0.46,
    totalLossMUsd: model.blocs.africaTotalMUsd,
    gdpImpactPct: model.blocs.africaGdpPct,
    notes: 'Continental modeled aggregation',
  });

  // 3. 6 Ex-Provinces (sorted descending by total loss)
  [...model.provinceRows]
    .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
    .forEach((p) => {
      pushRow({
        level: 'Ex_Province',
        entity: p.province,
        parentOrBloc: 'Madagascar',
        riceLossMUsd: p.riceLossMUsd,
        maizeLossMUsd: p.maizeLossMUsd,
        exportLossMUsd: p.exportLossMUsd,
        directLossMUsd: p.directAgriLossMUsd,
        indirectLossMUsd: p.indirectLossMUsd,
        totalLossMUsd: p.totalLossMUsd,
        gdpImpactPct: p.gdpImpactPct,
        agriImpactPct: p.agriImpactPct,
        grossRebound2028MUsd: p.grossRebound2028MUsd,
        netBalance2028MUsd: p.netBalance2028MUsd,
        notes: `${p.pilotDistrictCount}/${p.districtCount119} ADM2 | ${p.dominantChannel}`,
      });
    });

  // 4. 23 Official Regions
  [...model.regionRows]
    .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
    .forEach((r) => {
      pushRow({
        level: 'Region_23',
        entity: r.meta.region,
        parentOrBloc: r.meta.province,
        riceLossMUsd: r.riceLossMUsd,
        maizeLossMUsd: r.maizeLossMUsd,
        exportLossMUsd: r.exportLossMUsd,
        directLossMUsd: r.directAgriLossMUsd,
        indirectLossMUsd: r.indirectLossMUsd,
        totalLossMUsd: r.totalLossMUsd,
        gdpImpactPct: r.gdpImpactPct,
        agriImpactPct: r.agriImpactPct,
        grossRebound2028MUsd: r.grossRebound2028MUsd,
        netBalance2028MUsd: r.netBalance2028MUsd,
        notes: `${r.pilotDistrictCount}/${r.meta.districtsTotal} ADM2${r.coveredByPilot ? '' : ' (provincial proxy)'}`,
      });
    });

  // 5. 42 Modeled Pilot Districts
  [...model.districtRows]
    .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
    .forEach((d) => {
      pushRow({
        level: 'District_Pilot_42',
        entity: d.point.district,
        parentOrBloc: `${d.displayRegion} / ${d.province}`,
        rowScope: 'pilot_unit',
        riceLossMUsd: d.riceLossMUsd,
        maizeLossMUsd: d.maizeLossMUsd,
        exportLossMUsd: d.exportLossMUsd,
        directLossMUsd: d.directAgriLossMUsd,
        indirectLossMUsd: d.indirectLossMUsd,
        totalLossMUsd: d.totalLossMUsd,
        agriImpactPct: d.agriShockPct,
        grossRebound2028MUsd: d.grossRebound2028MUsd,
        netBalance2028MUsd: d.netBalance2028MUsd,
        notes: `${d.point.profile} (${d.point.riskTier})`,
      });
    });

  // 6. 21 Modeled African Countries & Regional Zones
  [...model.countryRows]
    .sort((a, b) => b.totalLossMUsd - a.totalLossMUsd)
    .forEach((c) => {
      pushRow({
        level: 'Africa_Country_Zone',
        entity: c.countryOrZone,
        parentOrBloc: c.blocs.join(';'),
        directLossMUsd: c.directLossMUsd,
        indirectLossMUsd: c.indirectLossMUsd,
        totalLossMUsd: c.totalLossMUsd,
        gdpImpactPct: c.gdpImpactPct,
        netBalance2028MUsd: c.netBalanceAdj2028MUsd,
        notes: `${c.climateSignal2027} — ${c.transmissionChannel}`,
      });
    });

  const csvLines = [
    header.map(escapeCsvCell).join(','),
    ...rows.map((r) => r.map(escapeCsvCell).join(',')),
  ];

  const filename = `madagascar_enso_economic_simulation_${horizonYear}_${scenario}_${scope}_${currency}.csv`;

  return {
    content: `\uFEFF${csvLines.join('\r\n')}`,
    filename,
    rowCount: rows.length,
  };
}

export function downloadEconomicSimulationCsv(params: EconomicCsvBuildParams): {
  filename: string;
  rowCount: number;
} {
  const { content, filename, rowCount } = buildEconomicSimulationCsv(params);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return { filename, rowCount };
}
