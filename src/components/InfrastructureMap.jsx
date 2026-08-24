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
        'raster-contrast': -0.1,
      },
    },
  ],
};

const infraColorExpression = [
  'match',
  ['get', 'type'],
  'health', '#e54752',
  'school', '#ffc151',
  'police', '#258a72',
  'transport_node', '#3d6e54',
  'border_crossing', '#db537b',
  'petrol_station', '#b87022',
  '#b87022',
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

function setSelectedFacilityFilter(map, facilityId) {
  if (!isMapUsable(map)) return;
  try {
    if (hasLayer(map, 'infra-selected-ring')) {
      map.setFilter('infra-selected-ring', facilityId ? ['==', ['get', 'infra_id'], facilityId] : ['==', ['get', 'infra_id'], '']);
    }
    if (hasLayer(map, 'candidate-selected-ring')) {
      map.setFilter('candidate-selected-ring', facilityId ? ['==', ['get', 'infra_id'], facilityId] : ['==', ['get', 'infra_id'], '']);
    }
  } catch {
    // decorative only
  }
}

function addOrUpdateLayers(map, wardsGeojson, blocksGeojson, infrastructureGeojson, petrolCandidatesGeojson, selectedFacilityId) {
  if (!isMapUsable(map)) return false;

  safeAddSource(map, 'infra-wards', { type: 'geojson', data: wardsGeojson });
  setSourceData(map, 'infra-wards', wardsGeojson);
  safeAddLayer(map, {
    id: 'infra-wards-fill', type: 'fill', source: 'infra-wards',
    paint: { 'fill-color': wardColorExpression(), 'fill-opacity': 0.08 },
  });
  safeAddLayer(map, {
    id: 'infra-wards-line', type: 'line', source: 'infra-wards',
    paint: { 'line-color': wardColorExpression(), 'line-width': 1.9, 'line-opacity': 0.85 },
  });

  safeAddSource(map, 'infra-blocks', { type: 'geojson', data: blocksGeojson });
  setSourceData(map, 'infra-blocks', blocksGeojson);
  safeAddLayer(map, {
    id: 'infra-blocks-context', type: 'circle', source: 'infra-blocks',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 4.5, 60, 8.5],
      'circle-color': '#222622',
      'circle-opacity': 0.5,
      'circle-stroke-color': '#fffaf1',
      'circle-stroke-width': 1.2,
    },
  });

  safeAddSource(map, 'infrastructure', { type: 'geojson', data: infrastructureGeojson });
  setSourceData(map, 'infrastructure', infrastructureGeojson);
  safeAddLayer(map, {
    id: 'infra-glow', type: 'circle', source: 'infrastructure',
    paint: { 'circle-radius': 18, 'circle-color': infraColorExpression, 'circle-opacity': 0.18, 'circle-blur': 0.55 },
  });
  safeAddLayer(map, {
    id: 'infra-points', type: 'circle', source: 'infrastructure',
    paint: {
      'circle-radius': ['case', ['==', ['get', 'type'], 'border_crossing'], 8.8, ['==', ['get', 'type'], 'health'], 8, 7],
      'circle-color': infraColorExpression,
      'circle-stroke-color': '#111816',
      'circle-stroke-width': 1.8,
      'circle-opacity': 0.96,
    },
  });
  safeAddLayer(map, {
    id: 'infra-selected-ring', type: 'circle', source: 'infrastructure', filter: ['==', ['get', 'infra_id'], ''],
    paint: { 'circle-radius': 15, 'circle-color': 'rgba(255,255,255,0)', 'circle-stroke-color': '#fffaf1', 'circle-stroke-width': 3.2 },
  });

  safeAddSource(map, 'petrol-candidates', { type: 'geojson', data: petrolCandidatesGeojson ?? { type: 'FeatureCollection', features: [] } });
  if (petrolCandidatesGeojson) setSourceData(map, 'petrol-candidates', petrolCandidatesGeojson);
  safeAddLayer(map, {
    id: 'candidate-petrol-glow', type: 'circle', source: 'petrol-candidates',
    paint: { 'circle-radius': 20, 'circle-color': '#b87022', 'circle-opacity': 0.13, 'circle-blur': 0.75 },
  });
  safeAddLayer(map, {
    id: 'candidate-petrol-points', type: 'circle', source: 'petrol-candidates',
    paint: {
      'circle-radius': 8.5,
      'circle-color': '#b87022',
      'circle-stroke-color': '#fffaf1',
      'circle-stroke-width': 2.1,
      'circle-opacity': 0.82,
      'circle-stroke-opacity': 0.96,
    },
  });
  safeAddLayer(map, {
    id: 'candidate-selected-ring', type: 'circle', source: 'petrol-candidates', filter: ['==', ['get', 'infra_id'], ''],
    paint: { 'circle-radius': 16, 'circle-color': 'rgba(255,255,255,0)', 'circle-stroke-color': '#ffc151', 'circle-stroke-width': 3.4 },
  });

  setSelectedFacilityFilter(map, selectedFacilityId);
  return true;
}

function popupHtml(feature) {
  const p = feature.properties;
  const status = p.candidate_status ? 'temporary candidate' : `source ${p.source_confidence}`;
  return `<div class="block-popup-card"><p class="block-popup-kicker">${p.type} · ${status}</p><strong>${p.name}</strong><span>${p.subtype}</span></div>`;
}

export default function InfrastructureMap({ wardsGeojson, blocksGeojson, infrastructureGeojson, petrolCandidatesGeojson, selectedFacility, onSelectFacility }) {
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
      const handleClick = (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        onSelectRef.current?.(feature);
        setSelectedFacilityFilter(map, feature.properties.infra_id);
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: true, offset: 16, className: 'custom-block-popup' })
          .setLngLat(event.lngLat)
          .setHTML(popupHtml(feature))
          .addTo(map);
      };
      map.on('click', 'infra-points', handleClick);
      if (hasLayer(map, 'candidate-petrol-points')) map.on('click', 'candidate-petrol-points', handleClick);
      const pointerOn = () => { try { map.getCanvas().style.cursor = 'pointer'; } catch {} };
      const pointerOff = () => { try { map.getCanvas().style.cursor = ''; } catch {} };
      map.on('mouseenter', 'infra-points', pointerOn);
      map.on('mouseleave', 'infra-points', pointerOff);
      if (hasLayer(map, 'candidate-petrol-points')) {
        map.on('mouseenter', 'candidate-petrol-points', pointerOn);
        map.on('mouseleave', 'candidate-petrol-points', pointerOff);
      }
      interactionBoundRef.current = true;
    };

    const fitMap = (map) => {
      if (hasFitBoundsRef.current || !isMapUsable(map)) return;
      const bounds = combinedBounds(wardsGeojson, infrastructureGeojson, petrolCandidatesGeojson);
      if (!bounds) return;
      try {
        map.fitBounds([[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]], { padding: 78, duration: 900 });
        hasFitBoundsRef.current = true;
      } catch {}
    };

    const renderData = (map) => {
      if (!isMapUsable(map)) return;
      const added = addOrUpdateLayers(map, wardsGeojson, blocksGeojson, infrastructureGeojson, petrolCandidatesGeojson, selectedFacilityId);
      if (!added) return;
      bindInteraction(map);
      fitMap(map);
    };

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: baseMapStyle,
        center: [30.02, -22.31],
        zoom: 9.6,
        minZoom: 7,
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
  }, [wardsGeojson, blocksGeojson, infrastructureGeojson, petrolCandidatesGeojson, selectedFacilityId]);

  useEffect(() => () => {
    popupRef.current?.remove();
    popupRef.current = null;
    interactionBoundRef.current = false;
    hasFitBoundsRef.current = false;
    try { mapRef.current?.remove(); } catch {}
    mapRef.current = null;
  }, []);

  return (
    <div className="map-frame infrastructure-map-frame">
      <div className="map-container" ref={containerRef} />
      <div className="map-overlay-title">
        <p className="map-kicker">Access landscape</p>
        <h3>Survey blocks and everyday infrastructure</h3>
        <p>Contextual infrastructure points layered against official ward boundaries and block anchors.</p>
      </div>
      <div className="map-legend infrastructure-legend" aria-label="Infrastructure legend">
        <p className="legend-heading">Infrastructure</p>
        <div className="legend-grid single">
          <div className="legend-row"><span className="legend-dot health" /> Health</div>
          <div className="legend-row"><span className="legend-dot school" /> School</div>
          <div className="legend-row"><span className="legend-dot police" /> Police</div>
          <div className="legend-row"><span className="legend-dot transport" /> Transport</div>
          <div className="legend-row"><span className="legend-dot border" /> Border</div>
          <div className="legend-row"><span className="legend-dot petrol" /> Petrol candidate</div>
          <div className="legend-row"><span className="legend-dot block-context" /> Survey block</div>
        </div>
      </div>
    </div>
  );
}
