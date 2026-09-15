import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { getFeatureBounds, wardColorExpression } from '../utils/geo.js';
import { MAP_STYLES, firstLabelLayerId } from '../config/mapStyle.js';
import { escapeHtml, publicationResourceLabel } from '../utils/publicationLabels.js';

const resourceColorExpression = [
  'match',
  ['get', 'resource_category'],
  'health_care', '#e54752',
  'state_legal_support', '#258a72',
  'mobility_transport', '#ffc151',
  'education_youth', '#db537b',
  'social_faith_support', '#ee7367',
  'work_livelihoods', '#b87022',
  'water_basic_services', '#6ec9b0',
  'community_place', '#3d6e54',
  '#8a8a7a',
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
function setSelectedResourceFilter(map, resourceId) {
  if (!isMapUsable(map) || !hasLayer(map, 'resources-selected-ring')) return;
  try { map.setFilter('resources-selected-ring', resourceId ? ['==', ['get', 'resource_id'], resourceId] : ['==', ['get', 'resource_id'], '']); } catch {}
}

function popupHtml(feature) {
  const p = feature.properties;
  return `<div class="block-popup-card"><p class="block-popup-kicker">${escapeHtml(p.resource_category_label)}</p><strong>${escapeHtml(publicationResourceLabel(p.resource_name))}</strong><span>${escapeHtml(p.mention_count)} workshop mention${Number(p.mention_count) === 1 ? '' : 's'} · participatory evidence</span></div>`;
}

function addOrUpdateLayers(map, wardsGeojson, blocksGeojson, resourcesGeojson, selectedResourceId) {
  if (!isMapUsable(map)) return false;
  const labelLayer = firstLabelLayerId(map);

  safeAddSource(map, 'resources-wards', { type: 'geojson', data: wardsGeojson });
  setSourceData(map, 'resources-wards', wardsGeojson);
  safeAddLayer(map, {
    id: 'resources-wards-fill', type: 'fill', source: 'resources-wards',
    paint: { 'fill-color': wardColorExpression(), 'fill-opacity': 0.045 },
  }, labelLayer);
  safeAddLayer(map, {
    id: 'resources-wards-line', type: 'line', source: 'resources-wards',
    paint: { 'line-color': wardColorExpression(), 'line-width': 1.45, 'line-opacity': 0.6 },
  }, labelLayer);

  safeAddSource(map, 'resources-blocks', { type: 'geojson', data: blocksGeojson });
  setSourceData(map, 'resources-blocks', blocksGeojson);
  safeAddLayer(map, {
    id: 'resources-blocks-context', type: 'circle', source: 'resources-blocks',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 3.6, 60, 6.8],
      'circle-color': '#222622', 'circle-opacity': 0.28,
      'circle-stroke-color': '#fffaf1', 'circle-stroke-width': 0.9,
    },
  });

  safeAddSource(map, 'resources', { type: 'geojson', data: resourcesGeojson });
  setSourceData(map, 'resources', resourcesGeojson);
  safeAddLayer(map, {
    id: 'resources-glow', type: 'circle', source: 'resources',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'mention_count']], 1, 11, 8, 22],
      'circle-color': resourceColorExpression, 'circle-opacity': 0.14, 'circle-blur': 0.65,
    },
  });
  safeAddLayer(map, {
    id: 'resources-points', type: 'circle', source: 'resources',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'mention_count']], 1, 5.3, 8, 9.6],
      'circle-color': resourceColorExpression,
      'circle-stroke-color': '#111816', 'circle-stroke-width': 1.45, 'circle-opacity': 0.95,
    },
  });
  safeAddLayer(map, {
    id: 'resources-selected-ring', type: 'circle', source: 'resources', filter: ['==', ['get', 'resource_id'], ''],
    paint: { 'circle-radius': 15, 'circle-color': 'rgba(255,255,255,0)', 'circle-stroke-color': '#fffaf1', 'circle-stroke-width': 3.2 },
  });
  setSelectedResourceFilter(map, selectedResourceId);
  return true;
}

export default function ResourcesMap({ wardsGeojson, blocksGeojson, resourcesGeojson, selectedResource, onSelectResource }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const onSelectRef = useRef(onSelectResource);
  const interactionBoundRef = useRef(false);
  const hasFitBoundsRef = useRef(false);
  const selectedResourceId = selectedResource?.properties?.resource_id ?? null;

  useEffect(() => { onSelectRef.current = onSelectResource; }, [onSelectResource]);
  useEffect(() => { if (mapRef.current) setSelectedResourceFilter(mapRef.current, selectedResourceId); }, [selectedResourceId]);

  useEffect(() => {
    if (!containerRef.current || !wardsGeojson || !blocksGeojson || !resourcesGeojson) return undefined;

    const bindInteraction = (map) => {
      if (!isMapUsable(map) || interactionBoundRef.current || !hasLayer(map, 'resources-points')) return;
      map.on('click', 'resources-points', (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        onSelectRef.current?.(feature);
        setSelectedResourceFilter(map, feature.properties.resource_id);
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: true, offset: 16, className: 'custom-block-popup' })
          .setLngLat(event.lngLat).setHTML(popupHtml(feature)).addTo(map);
      });
      const pointerOn = () => { try { map.getCanvas().style.cursor = 'pointer'; } catch {} };
      const pointerOff = () => { try { map.getCanvas().style.cursor = ''; } catch {} };
      map.on('mouseenter', 'resources-points', pointerOn);
      map.on('mouseleave', 'resources-points', pointerOff);
      interactionBoundRef.current = true;
    };

    const fitMap = (map) => {
      if (hasFitBoundsRef.current || !isMapUsable(map)) return;
      const bounds = combinedBounds(wardsGeojson, resourcesGeojson);
      if (!bounds) return;
      try {
        map.fitBounds([[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]], { padding: 80, duration: 900 });
        hasFitBoundsRef.current = true;
      } catch {}
    };

    const renderData = (map) => {
      if (!isMapUsable(map)) return;
      if (!addOrUpdateLayers(map, wardsGeojson, blocksGeojson, resourcesGeojson, selectedResourceId)) return;
      bindInteraction(map);
      fitMap(map);
    };

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: containerRef.current, style: MAP_STYLES.local,
        center: [30.035, -22.34], zoom: 11.2, minZoom: 8, maxZoom: 17, attributionControl: false,
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
  }, [wardsGeojson, blocksGeojson, resourcesGeojson, selectedResourceId]);

  useEffect(() => () => {
    popupRef.current?.remove(); popupRef.current = null;
    interactionBoundRef.current = false; hasFitBoundsRef.current = false;
    try { mapRef.current?.remove(); } catch {}
    mapRef.current = null;
  }, []);

  return (
    <div className="map-frame resources-map-frame survey-map-frame">
      <div className="map-container" ref={containerRef} />
      <div className="map-overlay-title">
        <p className="map-kicker">Participatory resources</p>
        <h3>The mappable part of a wider resource ecology</h3>
        <p>Places named in workshop mapping, layered with survey blocks and official ward outlines.</p>
      </div>
      <div className="map-legend resources-legend" aria-label="Participatory resource legend">
        <p className="legend-heading">Resource categories</p>
        <div className="legend-grid single">
          <div className="legend-row"><span className="legend-dot resource-health" /> Health and care</div>
          <div className="legend-row"><span className="legend-dot resource-state" /> State/legal support</div>
          <div className="legend-row"><span className="legend-dot resource-mobility" /> Mobility/transport</div>
          <div className="legend-row"><span className="legend-dot resource-education" /> Education/youth</div>
          <div className="legend-row"><span className="legend-dot resource-faith" /> Faith/social support</div>
          <div className="legend-row"><span className="legend-dot resource-work" /> Work/livelihoods</div>
          <div className="legend-row"><span className="legend-dot block-context" /> Survey block</div>
        </div>
      </div>
    </div>
  );
}
