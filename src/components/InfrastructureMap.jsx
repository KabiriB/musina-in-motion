import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { getFeatureBounds, wardColorExpression } from '../utils/geo.js';
import { MAP_STYLES, firstLabelLayerId } from '../config/mapStyle.js';

const infraColorExpression = [
  'match',
  ['get', 'type'],
  'health', '#e54752',
  'school', '#ffc151',
  'police', '#258a72',
  'transport_node', '#3d6e54',
  'border_crossing', '#db537b',
  '#6c746e',
];

function isMapUsable(map) {
  try { return Boolean(map && !map._removed && map.getStyle?.() && map.addLayer && map.addSource); }
  catch { return false; }
}
function hasLayer(map, id) { try { return Boolean(isMapUsable(map) && map.getLayer(id)); } catch { return false; } }
function hasSource(map, id) { try { return Boolean(isMapUsable(map) && map.getSource(id)); } catch { return false; } }
function safeAddSource(map, id, source) {
  if (!isMapUsable(map) || hasSource(map, id)) return;
  try { map.addSource(id, source); } catch (error) { console.warn(`Could not add source ${id}`, error); }
}
function safeAddLayer(map, layer, beforeId) {
  if (!isMapUsable(map) || hasLayer(map, layer.id)) return;
  try {
    if (beforeId && hasLayer(map, beforeId)) map.addLayer(layer, beforeId);
    else map.addLayer(layer);
  } catch (error) { console.warn(`Could not add layer ${layer.id}`, error); }
}
function setSourceData(map, id, data) {
  try { const source = map.getSource(id); if (source?.setData) source.setData(data); } catch {}
}
function combinedBounds(...geojsons) {
  const parts = geojsons.map(getFeatureBounds).filter(Boolean);
  if (!parts.length) return null;
  return parts.reduce((acc, b) => ({
    minLng: Math.min(acc.minLng, b.minLng), minLat: Math.min(acc.minLat, b.minLat),
    maxLng: Math.max(acc.maxLng, b.maxLng), maxLat: Math.max(acc.maxLat, b.maxLat),
  }));
}
function setSelectedFacilityFilter(map, facilityId) {
  if (!isMapUsable(map) || !hasLayer(map, 'infra-selected-ring')) return;
  try { map.setFilter('infra-selected-ring', facilityId ? ['==', ['get', 'infra_id'], facilityId] : ['==', ['get', 'infra_id'], '']); } catch {}
}

function addOrUpdateLayers(map, wardsGeojson, blocksGeojson, infrastructureGeojson, selectedFacilityId) {
  if (!isMapUsable(map)) return false;
  const labelLayer = firstLabelLayerId(map);

  safeAddSource(map, 'infra-wards', { type: 'geojson', data: wardsGeojson });
  setSourceData(map, 'infra-wards', wardsGeojson);
  safeAddLayer(map, {
    id: 'infra-wards-fill', type: 'fill', source: 'infra-wards',
    paint: { 'fill-color': wardColorExpression(), 'fill-opacity': 0.055 },
  }, labelLayer);
  safeAddLayer(map, {
    id: 'infra-wards-line', type: 'line', source: 'infra-wards',
    paint: { 'line-color': wardColorExpression(), 'line-width': 1.7, 'line-opacity': 0.7 },
  }, labelLayer);

  safeAddSource(map, 'infra-blocks', { type: 'geojson', data: blocksGeojson });
  setSourceData(map, 'infra-blocks', blocksGeojson);
  safeAddLayer(map, {
    id: 'infra-blocks-context', type: 'circle', source: 'infra-blocks',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 3.8, 60, 7.4],
      'circle-color': '#222622', 'circle-opacity': 0.3,
      'circle-stroke-color': '#fffaf1', 'circle-stroke-width': 1,
    },
  });

  safeAddSource(map, 'infrastructure', { type: 'geojson', data: infrastructureGeojson });
  setSourceData(map, 'infrastructure', infrastructureGeojson);
  safeAddLayer(map, {
    id: 'infra-glow', type: 'circle', source: 'infrastructure',
    paint: { 'circle-radius': 18, 'circle-color': infraColorExpression, 'circle-opacity': 0.16, 'circle-blur': 0.62 },
  });
  safeAddLayer(map, {
    id: 'infra-points', type: 'circle', source: 'infrastructure',
    paint: {
      'circle-radius': ['case', ['==', ['get', 'type'], 'health'], 8.7, ['==', ['get', 'type'], 'border_crossing'], 8.2, 7],
      'circle-color': infraColorExpression,
      'circle-stroke-color': '#111816', 'circle-stroke-width': 1.7, 'circle-opacity': 0.97,
    },
  });
  safeAddLayer(map, {
    id: 'infra-selected-ring', type: 'circle', source: 'infrastructure', filter: ['==', ['get', 'infra_id'], ''],
    paint: { 'circle-radius': 15, 'circle-color': 'rgba(255,255,255,0)', 'circle-stroke-color': '#fffaf1', 'circle-stroke-width': 3.2 },
  });
  setSelectedFacilityFilter(map, selectedFacilityId);
  return true;
}

function popupHtml(feature) {
  const p = feature.properties;
  const typeLabel = p.type === 'health' ? 'Health service' : p.type === 'border_crossing' ? 'Border anchor' : p.type?.replaceAll('_', ' ');
  return `<div class="block-popup-card"><p class="block-popup-kicker">${typeLabel}</p><strong>${p.name}</strong><span>${p.subtype?.replaceAll('_', ' ') ?? ''}</span></div>`;
}

export default function InfrastructureMap({ wardsGeojson, blocksGeojson, infrastructureGeojson, selectedFacility, onSelectFacility }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const onSelectRef = useRef(onSelectFacility);
  const interactionBoundRef = useRef(false);
  const hasFitBoundsRef = useRef(false);
  const selectedFacilityId = selectedFacility?.properties?.infra_id ?? null;

  useEffect(() => { onSelectRef.current = onSelectFacility; }, [onSelectFacility]);
  useEffect(() => { if (mapRef.current) setSelectedFacilityFilter(mapRef.current, selectedFacilityId); }, [selectedFacilityId]);

  useEffect(() => {
    if (!containerRef.current || !wardsGeojson || !blocksGeojson || !infrastructureGeojson) return undefined;

    const bindInteraction = (map) => {
      if (!isMapUsable(map) || interactionBoundRef.current || !hasLayer(map, 'infra-points')) return;
      map.on('click', 'infra-points', (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        onSelectRef.current?.(feature);
        setSelectedFacilityFilter(map, feature.properties.infra_id);
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: true, offset: 16, className: 'custom-block-popup' })
          .setLngLat(event.lngLat).setHTML(popupHtml(feature)).addTo(map);
      });
      const pointerOn = () => { try { map.getCanvas().style.cursor = 'pointer'; } catch {} };
      const pointerOff = () => { try { map.getCanvas().style.cursor = ''; } catch {} };
      map.on('mouseenter', 'infra-points', pointerOn);
      map.on('mouseleave', 'infra-points', pointerOff);
      interactionBoundRef.current = true;
    };

    const fitMap = (map) => {
      if (hasFitBoundsRef.current || !isMapUsable(map)) return;
      const bounds = combinedBounds(wardsGeojson, infrastructureGeojson);
      if (!bounds) return;
      try {
        map.fitBounds([[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]], { padding: 78, duration: 900 });
        hasFitBoundsRef.current = true;
      } catch {}
    };

    const renderData = (map) => {
      if (!isMapUsable(map)) return;
      if (!addOrUpdateLayers(map, wardsGeojson, blocksGeojson, infrastructureGeojson, selectedFacilityId)) return;
      bindInteraction(map);
      fitMap(map);
    };

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: containerRef.current, style: MAP_STYLES.local,
        center: [30.02, -22.31], zoom: 9.6, minZoom: 7, maxZoom: 17, attributionControl: false,
      });
      mapRef.current = map;
      try {
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
      } catch {}
      map.once('load', () => renderData(map));
    } else {
      const map = mapRef.current;
      if (isMapUsable(map) && map.isStyleLoaded()) renderData(map);
      else if (map && !map._removed) map.once('load', () => renderData(map));
    }
    return undefined;
  }, [wardsGeojson, blocksGeojson, infrastructureGeojson, selectedFacilityId]);

  useEffect(() => () => {
    popupRef.current?.remove(); popupRef.current = null;
    interactionBoundRef.current = false; hasFitBoundsRef.current = false;
    try { mapRef.current?.remove(); } catch {}
    mapRef.current = null;
  }, []);

  return (
    <div className="map-frame infrastructure-map-frame survey-map-frame">
      <div className="map-container" ref={containerRef} />
      <div className="map-overlay-title">
        <p className="map-kicker">Service context</p>
        <h3>Institutional anchors around the survey geography</h3>
        <p>Selected service points shown for spatial context alongside official ward boundaries and survey block anchors.</p>
      </div>
      <div className="map-legend infrastructure-legend" aria-label="Infrastructure legend">
        <p className="legend-heading">Service anchors</p>
        <div className="legend-grid single">
          <div className="legend-row"><span className="legend-dot health" /> Health</div>
          <div className="legend-row"><span className="legend-dot school" /> School</div>
          <div className="legend-row"><span className="legend-dot police" /> Police</div>
          <div className="legend-row"><span className="legend-dot transport" /> Transport</div>
          <div className="legend-row"><span className="legend-dot border" /> Border</div>
          <div className="legend-row"><span className="legend-dot block-context" /> Survey block</div>
        </div>
      </div>
    </div>
  );
}
