import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { getFeatureBounds, wardColorExpression } from '../utils/geo.js';

const baseMapStyle = {
  version: 8,
  sources: {
    cartoLight: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto-light-layer',
      type: 'raster',
      source: 'cartoLight',
      paint: {
        'raster-opacity': 0.82,
        'raster-saturation': -0.55,
        'raster-contrast': -0.08,
      },
    },
  ],
};

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
  try {
    return Boolean(map && !map._removed && map.getStyle?.() && map.addLayer && map.addSource);
  } catch {
    return false;
  }
}

function hasLayer(map, id) {
  try { return Boolean(isMapUsable(map) && map.getLayer(id)); } catch { return false; }
}

function hasSource(map, id) {
  try { return Boolean(isMapUsable(map) && map.getSource(id)); } catch { return false; }
}

function safeAddSource(map, id, source) {
  if (!isMapUsable(map) || hasSource(map, id)) return;
  try { map.addSource(id, source); } catch (error) { console.warn(`Could not add source ${id}`, error); }
}

function safeAddLayer(map, layer) {
  if (!isMapUsable(map) || hasLayer(map, layer.id)) return;
  try { map.addLayer(layer); } catch (error) { console.warn(`Could not add layer ${layer.id}`, error); }
}

function setSourceData(map, id, data) {
  try {
    const source = map.getSource(id);
    if (source?.setData) source.setData(data);
  } catch {
    // no-op
  }
}

function combinedBounds(...geojsons) {
  const parts = geojsons.map(getFeatureBounds).filter(Boolean);
  if (!parts.length) return null;
  return parts.reduce((acc, b) => ({
    minLng: Math.min(acc.minLng, b.minLng),
    minLat: Math.min(acc.minLat, b.minLat),
    maxLng: Math.max(acc.maxLng, b.maxLng),
    maxLat: Math.max(acc.maxLat, b.maxLat),
  }));
}

function setSelectedResourceFilter(map, resourceId) {
  if (!isMapUsable(map)) return;
  try {
    if (hasLayer(map, 'resources-selected-ring')) {
      map.setFilter('resources-selected-ring', resourceId ? ['==', ['get', 'resource_id'], resourceId] : ['==', ['get', 'resource_id'], '']);
    }
  } catch {
    // decorative only
  }
}

function popupHtml(feature) {
  const p = feature.properties;
  return `<div class="block-popup-card"><p class="block-popup-kicker">${p.resource_category_label}</p><strong>${p.resource_name}</strong><span>${p.mention_count} workshop mention${Number(p.mention_count) === 1 ? '' : 's'} · not independently verified</span></div>`;
}

function addOrUpdateLayers(map, wardsGeojson, blocksGeojson, resourcesGeojson, selectedResourceId) {
  if (!isMapUsable(map)) return false;

  safeAddSource(map, 'resources-wards', { type: 'geojson', data: wardsGeojson });
  setSourceData(map, 'resources-wards', wardsGeojson);
  safeAddLayer(map, {
    id: 'resources-wards-fill', type: 'fill', source: 'resources-wards',
    paint: { 'fill-color': wardColorExpression(), 'fill-opacity': 0.055 },
  });
  safeAddLayer(map, {
    id: 'resources-wards-line', type: 'line', source: 'resources-wards',
    paint: { 'line-color': wardColorExpression(), 'line-width': 1.6, 'line-opacity': 0.72 },
  });

  safeAddSource(map, 'resources-blocks', { type: 'geojson', data: blocksGeojson });
  setSourceData(map, 'resources-blocks', blocksGeojson);
  safeAddLayer(map, {
    id: 'resources-blocks-context', type: 'circle', source: 'resources-blocks',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 3.8, 60, 7.2],
      'circle-color': '#222622',
      'circle-opacity': 0.34,
      'circle-stroke-color': '#fffaf1',
      'circle-stroke-width': 1,
    },
  });

  safeAddSource(map, 'resources', { type: 'geojson', data: resourcesGeojson });
  setSourceData(map, 'resources', resourcesGeojson);
  safeAddLayer(map, {
    id: 'resources-glow', type: 'circle', source: 'resources',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'mention_count']], 1, 11, 8, 22],
      'circle-color': resourceColorExpression,
      'circle-opacity': 0.17,
      'circle-blur': 0.6,
    },
  });
  safeAddLayer(map, {
    id: 'resources-points', type: 'circle', source: 'resources',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'mention_count']], 1, 5.5, 8, 10],
      'circle-color': resourceColorExpression,
      'circle-stroke-color': '#111816',
      'circle-stroke-width': 1.6,
      'circle-opacity': 0.96,
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
      const handleClick = (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        onSelectRef.current?.(feature);
        setSelectedResourceFilter(map, feature.properties.resource_id);
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: true, offset: 16, className: 'custom-block-popup' })
          .setLngLat(event.lngLat)
          .setHTML(popupHtml(feature))
          .addTo(map);
      };
      map.on('click', 'resources-points', handleClick);
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
      const added = addOrUpdateLayers(map, wardsGeojson, blocksGeojson, resourcesGeojson, selectedResourceId);
      if (!added) return;
      bindInteraction(map);
      fitMap(map);
    };

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: baseMapStyle,
        center: [30.035, -22.34],
        zoom: 11.2,
        minZoom: 8,
        maxZoom: 17,
        attributionControl: false,
      });
      mapRef.current = map;
      try {
        map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
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
    popupRef.current?.remove();
    popupRef.current = null;
    interactionBoundRef.current = false;
    hasFitBoundsRef.current = false;
    try { mapRef.current?.remove(); } catch {}
    mapRef.current = null;
  }, []);

  return (
    <div className="map-frame resources-map-frame">
      <div className="map-container" ref={containerRef} />
      <div className="map-overlay-title">
        <p className="map-kicker">Participatory resources</p>
        <h3>Places named in workshop maps</h3>
        <p>Workshop-identified resources layered with survey blocks and official ward outlines.</p>
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
