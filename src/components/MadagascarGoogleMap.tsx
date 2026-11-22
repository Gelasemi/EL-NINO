import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import type { DistrictPredictionPoint } from '../data/ensoData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedDistrictProfileLabel } from '../i18n/localizedMlEconomicData';

export interface DistrictMapMetric {
  yieldDelta: number;
  waterDelta: number;
  oniIndex: number;
}

interface MadagascarGoogleMapProps {
  districts: DistrictPredictionPoint[];
  selectedDistrict: DistrictPredictionPoint;
  year: 2027 | 2028;
  cropLabel: string;
  colorMode: 'yield' | 'risk';
  getDistrictMetrics: (d: DistrictPredictionPoint) => DistrictMapMetric;
  getYieldColor: (pct: number) => { fill: string; stroke: string; label: string };
  getRiskTierStyle: (tier: DistrictPredictionPoint['riskTier']) => {
    fill: string;
    stroke: string;
    label: string;
  };
  onSelectDistrict: (districtName: string) => void;
  onTriggerDiagnostic?: () => void;
}

const MADAGASCAR_CENTER = { lat: -18.85, lng: 46.85 };
const MADAGASCAR_DEFAULT_ZOOM = 5.5;
const Z_INDEX_SELECTED = 1000;
const Z_INDEX_HOVER = 999;

type MarkerElement = ReturnType<typeof useAdvancedMarkerRef>[1];

interface DistrictPinMarkerProps {
  district: DistrictPredictionPoint;
  metrics: DistrictMapMetric;
  colorStyle: { fill: string; stroke: string; label: string };
  isSelected: boolean;
  isHovered: boolean;
  baseZIndex: number;
  onHoverChange: (districtName: string | null) => void;
  onMarkerClick: (districtName: string, marker: MarkerElement) => void;
  onActiveAnchorReady: (marker: MarkerElement) => void;
}

function DistrictPinMarker({
  district,
  metrics,
  colorStyle,
  isSelected,
  isHovered,
  baseZIndex,
  onHoverChange,
  onMarkerClick,
  onActiveAnchorReady,
}: DistrictPinMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const zIndex = isSelected
    ? Z_INDEX_SELECTED
    : isHovered
      ? Z_INDEX_HOVER
      : baseZIndex;

  useEffect(() => {
    if (isSelected && marker) {
      onActiveAnchorReady(marker);
    }
  }, [isSelected, marker, onActiveAnchorReady]);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: district.lat, lng: district.lon }}
      zIndex={zIndex}
      title={`${district.district} (${district.region}) : ${metrics.yieldDelta >= 0 ? '+' : ''}${metrics.yieldDelta} %`}
      onClick={() => onMarkerClick(district.district, marker)}
      onMouseEnter={() => onHoverChange(district.district)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <Pin
        background={colorStyle.fill}
        borderColor={isSelected ? '#18181B' : colorStyle.stroke}
        glyphColor="#FFFFFF"
        scale={isSelected ? 1.25 : isHovered ? 1.12 : 0.92}
      />
    </AdvancedMarker>
  );
}

function MapCameraController({
  resetNonce,
  selectedDistrict,
}: {
  resetNonce: number;
  selectedDistrict: DistrictPredictionPoint;
}) {
  const map = useMap();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!map || resetNonce === 0) return;
    map.panTo(MADAGASCAR_CENTER);
    map.setZoom(MADAGASCAR_DEFAULT_ZOOM);
  }, [map, resetNonce]);

  useEffect(() => {
    if (!map) return;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    map.panTo({ lat: selectedDistrict.lat, lng: selectedDistrict.lon });
  }, [map, selectedDistrict.lat, selectedDistrict.lon]);

  return null;
}

function MapsInnerContent({
  districts,
  selectedDistrict,
  year,
  cropLabel,
  colorMode,
  getDistrictMetrics,
  getYieldColor,
  getRiskTierStyle,
  onSelectDistrict,
  onTriggerDiagnostic,
}: MadagascarGoogleMapProps) {
  const { lang, ui } = useLanguage();
  const loadingStatus = useApiLoadingStatus();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [activeAnchor, setActiveAnchor] = useState<MarkerElement>(null);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'terrain' | 'hybrid'>('terrain');
  const [resetNonce, setResetNonce] = useState<number>(0);

  const sortedDistricts = useMemo(
    () => [...districts].sort((a, b) => b.lat - a.lat),
    [districts],
  );

  const handleMarkerClick = useCallback(
    (districtName: string, marker: MarkerElement) => {
      if (districtName !== selectedDistrict.district) {
        onSelectDistrict(districtName);
      }
      if (marker) {
        setActiveAnchor(marker);
        setInfoOpen(true);
      }
    },
    [onSelectDistrict, selectedDistrict.district],
  );

  const selectedMetrics = getDistrictMetrics(selectedDistrict);
  const selectedYieldColor = getYieldColor(selectedMetrics.yieldDelta);
  const selectedRiskStyle = getRiskTierStyle(selectedDistrict.riskTier);

  if (loadingStatus === APILoadingStatus.AUTH_FAILURE || loadingStatus === APILoadingStatus.FAILED) {
    return (
      <div className="flex h-[440px] flex-col items-center justify-center rounded-md border border-amber-200 bg-amber-50/70 p-6 text-center">
        <AlertTriangle className="h-6 w-6 text-amber-700" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold text-zinc-900">
          {ui.maps.missingKeyTitle}
        </p>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-zinc-600">
          {ui.maps.waitingKeyDesc} ({districts.length})
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-md border border-zinc-200 bg-[#EEF2F6]">
      {/* Top-Left Compact Map Controls (Layer + Recenter) */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap items-center gap-1.5">
        <div className="inline-flex rounded border border-zinc-200 bg-white/95 p-0.5 shadow-xs backdrop-blur-xs">
          {(
            [
              { id: 'terrain', label: ui.maps.terrainBtn },
              { id: 'roadmap', label: ui.maps.roadmapBtn },
              { id: 'hybrid', label: ui.maps.satelliteBtn },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setMapTypeId(mode.id)}
              className={`rounded px-2 py-1 text-[11px] font-semibold transition-colors ${
                mapTypeId === mode.id
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setResetNonce((n) => n + 1)}
          className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50"
          title={ui.maps.recenterTitle}
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Madagascar
        </button>
      </div>

      {/* Required attribution ID: gmp_mcp_codeassist_v1_aistudio + mapId="DEMO_MAP_ID" for AdvancedMarker */}
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={MADAGASCAR_CENTER}
        defaultZoom={MADAGASCAR_DEFAULT_ZOOM}
        mapTypeId={mapTypeId}
        gestureHandling="cooperative"
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={true}
        zoomControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <MapCameraController resetNonce={resetNonce} selectedDistrict={selectedDistrict} />

        {sortedDistricts.map((pt, idx) => {
          const metrics = getDistrictMetrics(pt);
          const colorStyle =
            colorMode === 'risk'
              ? getRiskTierStyle(pt.riskTier)
              : getYieldColor(metrics.yieldDelta);
          return (
            <DistrictPinMarker
              key={pt.district}
              district={pt}
              metrics={metrics}
              colorStyle={colorStyle}
              isSelected={pt.district === selectedDistrict.district}
              isHovered={pt.district === hoveredDistrict}
              baseZIndex={idx + 1}
              onHoverChange={setHoveredDistrict}
              onMarkerClick={handleMarkerClick}
              onActiveAnchorReady={setActiveAnchor}
            />
          );
        })}

        {infoOpen && activeAnchor && (
          <InfoWindow
            anchor={activeAnchor}
            maxWidth={270}
            pixelOffset={[0, -4]}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="space-y-2 p-0.5 font-sans text-zinc-900">
              <div className="border-b border-zinc-200 pb-1.5">
                <p className="text-[11px] font-medium text-zinc-500">
                  {selectedDistrict.region} · {getLocalizedDistrictProfileLabel(selectedDistrict.profile, lang)}
                </p>
                <h4 className="font-serif text-sm font-semibold text-zinc-900">
                  {selectedDistrict.district} ({year})
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-zinc-500">{cropLabel}</span>
                  <span
                    className={`font-mono font-semibold tabular-nums ${
                      selectedMetrics.yieldDelta < 0 ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    {selectedMetrics.yieldDelta >= 0 ? '+' : ''}
                    {selectedMetrics.yieldDelta} %
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500">{ui.maps.selectedWaterLabel}</span>
                  <span
                    className={`font-mono font-semibold tabular-nums ${
                      selectedMetrics.waterDelta < 0 ? 'text-amber-800' : 'text-[#1E3A8A]'
                    }`}
                  >
                    {selectedMetrics.waterDelta >= 0 ? '+' : ''}
                    {selectedMetrics.waterDelta} %
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-1.5 text-[11px]">
                <span className="block font-medium text-zinc-700">
                  {ui.maps.selectedRiskLabel}{' '}
                  <strong style={{ color: selectedRiskStyle.fill }}>{selectedRiskStyle.label}</strong>
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-zinc-500">{selectedYieldColor.label}</span>
                  {onTriggerDiagnostic && (
                    <button
                      type="button"
                      onClick={onTriggerDiagnostic}
                      className="font-semibold text-[#1E3A8A] underline hover:text-[#172554]"
                    >
                      {ui.maps.geminiDiagBtn}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export function MadagascarGoogleMap(props: MadagascarGoogleMapProps) {
  const { lang, ui } = useLanguage();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (!apiKey || apiKey === 'MY_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="flex h-[440px] flex-col items-center justify-center rounded-md border border-zinc-200 bg-[#F4F7FA] p-6 text-center">
        <AlertTriangle className="h-6 w-6 text-amber-700" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold text-zinc-900">
          {ui.maps.waitingKeyTitle}
        </p>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-zinc-600">
          {ui.maps.waitingKeyDesc}
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']} language={lang} region="MG">
      <MapsInnerContent {...props} />
    </APIProvider>
  );
}
