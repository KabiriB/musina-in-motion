import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { getFeatureBounds, wardColorExpression } from '../utils/geo.js';
import { MAP_STYLES, firstLabelLayerId } from '../config/mapStyle.js';

const typologyColorExpression = [
  'match',
  ['get', 'cluster_typology'],
  'Trade', '#ffc151',
  'Farm', '#258a72',
  'Township', '#db537b',
  'Suburban residential', '#b87022',
  '#ffc151',
];

const privacyStrokeExpression = [
  'case',
  ['==', ['get', 'privacy_class'], 'broad_block_summaries_allowed'], '#111816',
  ['==', ['get', 'privacy_class'], 'location_and_count_band_only'], '#e54752',
  '#ee7367',
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

function safeAddLayer(map, layer, beforeId) {
  if (!isMapUsable(map) || hasLayer(map, layer.id)) return;
  try {
    if (beforeId && hasLayer(map, beforeId)) map.addLayer(layer, beforeId);
    else map.addLayer(layer);
  } catch (error) {
    console.warn(`Could not add layer ${layer.id}`, error);
  }
}

function setSourceData(map, id, data) {
  try {
    const source = map.getSource(id);
    if (source?.setData) source.setData(data);
  } catch {}
}

function setSelectedBlockFilter(map, selectedBlockId) {
  if (!isMapUsable(map) || !hasLayer(map, 'blocks-selected-ring')) return;
  try {
    map.setFilter('blocks-selected-ring', selectedBlockId ? ['==', ['get', 'block_anchor'], selectedBlockId] : ['==', ['get', 'block_anchor'], '']);
  } catch {}
}

function addOrUpdateLayers(map, wardsGeojson, blocksGeojson, selectedBlockId) {
  if (!isMapUsable(map)) return false;
  const labelLayer = firstLabelLayerId(map);

  safeAddSource(map, 'wards', { type: 'geojson', data: wardsGeojson });
  setSourceData(map, 'wards', wardsGeojson);
  safeAddLayer(map, {
    id: 'wards-fill', type: 'fill', source: 'wards',
    paint: { 'fill-color': wardColorExpression(), 'fill-opacity': 0.11 },
  }, labelLayer);
  safeAddLayer(map, {
    id: 'wards-line-shadow', type: 'line', source: 'wards',
    paint: { 'line-color': '#111816', 'line-width': 4.2, 'line-opacity': 0.18 },
  }, labelLayer);
  safeAddLayer(map, {
    id: 'wards-line', type: 'line', source: 'wards',
    paint: { 'line-color': wardColorExpression(), 'line-width': 2.25, 'line-opacity': 0.9 },
  }, labelLayer);

  safeAddSource(map, 'blocks', { type: 'geojson', data: blocksGeojson });
  setSourceData(map, 'blocks', blocksGeojson);
  safeAddLayer(map, {
    id: 'blocks-glow', type: 'circle', source: 'blocks',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 15, 60, 32],
      'circle-color': typologyColorExpression,
      'circle-opacity': 0.18,
      'circle-blur': 0.62,
    },
  });
  safeAddLayer(map, {
    id: 'blocks-circle', type: 'circle', source: 'blocks',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 6.3, 60, 12.8],
      'circle-color': typologyColorExpression,
      'circle-stroke-color': privacyStrokeExpression,
      'circle-stroke-width': ['case', ['==', ['get', 'privacy_class'], 'broad_block_summaries_allowed'], 1.9, 2.7],
      'circle-opacity': 0.98,
    },
  });
  safeAddLayer(map, {
    id: 'blocks-selected-ring', type: 'circle', source: 'blocks', filter: ['==', ['get', 'block_anchor'], ''],
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'respondent_n']], 3, 12, 60, 20],
      'circle-color': 'rgba(255,255,255,0)',
      'circle-stroke-color': '#fffaf1',
      'circle-stroke-width': 3.2,
      'circle-opacity': 0.95,
    },
  });
  setSelectedBlockFilter(map, selectedBlockId);
  return true;
}

function popupHtml(feature) {
  const { block_anchor, cluster_typology, display_ward, respondent_count_band, privacy_class } = feature.properties;
  const privacyLabel = privacy_class === 'broad_block_summaries_allowed' ? 'Broad summaries available' : 'Limited display';
  return `<div class="block-popup-card"><p class="block-popup-kicker">${cluster_typology} · Ward ${display_ward}</p><strong>${block_anchor}</strong><span>${respondent_count_band} respondents · ${privacyLabel}</span></div>`;
}

export default function AtlasMap({ wardsGeojson, blocksGeojson, selectedBlock, onSelectBlock }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const onSelectBlockRef = useRef(onSelectBlock);
  const interactionBoundRef = useRef(false);
  const hasFitBoundsRef = useRef(false);
  const selectedBlockId = selectedBlock?.properties?.block_anchor ?? null;

  useEffect(() => { onSelectBlockRef.current = onSelectBlock; }, [onSelectBlock]);
  useEffect(() => { if (mapRef.current) setSelectedBlockFilter(mapRef.current, selectedBlockId); }, [selectedBlockId]);

  useEffect(() => {
    if (!mapContainerRef.current || !wardsGeojson || !blocksGeojson) return undefined;

    const bindInteraction = (map) => {
      if (!isMapUsable(map) || interactionBoundRef.current || !hasLayer(map, 'blocks-circle')) return;
      map.on('click', 'blocks-circle', (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        onSelectBlockRef.current?.(feature);
        setSelectedBlockFilter(map, feature.properties.block_anchor);
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: true, offset: 16, className: 'custom-block-popup' })
          .setLngLat(event.lngLat).setHTML(popupHtml(feature)).addTo(map);
      });
      map.on('mouseenter', 'blocks-circle', () => { try { map.getCanvas().style.cursor = 'pointer'; } catch {} });
      map.on('mouseleave', 'blocks-circle', () => { try { map.getCanvas().style.cursor = ''; } catch {} });
      interactionBoundRef.current = true;
    };

    const fitToWards = (map) => {
      if (hasFitBoundsRef.current || !isMapUsable(map)) return;
      const bounds = getFeatureBounds(wardsGeojson);
      if (!bounds) return;
      try {
        map.fitBounds([[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]], { padding: 82, duration: 900 });
        hasFitBoundsRef.current = true;
      } catch {}
    };

    const renderData = (map) => {
      if (!isMapUsable(map)) return;
      if (!addOrUpdateLayers(map, wardsGeojson, blocksGeojson, selectedBlockId)) return;
      bindInteraction(map);
      fitToWards(map);
    };

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLES.local,
        center: [30.045, -22.35],
        zoom: 10.4,
        minZoom: 8,
        maxZoom: 17,
        attributionControl: false,
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
  }, [wardsGeojson, blocksGeojson, selectedBlockId]);

  useEffect(() => () => {
    popupRef.current?.remove();
    popupRef.current = null;
    interactionBoundRef.current = false;
    hasFitBoundsRef.current = false;
    try { mapRef.current?.remove(); } catch {}
    mapRef.current = null;
  }, []);

  return (
    <div className="map-frame survey-map-frame">
      <div className="map-container" ref={mapContainerRef} />
      <div className="map-overlay-title">
        <p className="map-kicker">Local atlas</p>
        <h3>Wards and survey blocks</h3>
        <p>Official ward boundaries with one point per survey block anchor. Point size reflects respondent count band; colour marks broad fieldwork typology.</p>
      </div>
      <div className="map-legend" aria-label="Map legend">
        <p className="legend-heading">Block typology</p>
        <div className="legend-grid">
          <div className="legend-row"><span className="legend-dot trade" /> Trade</div>
          <div className="legend-row"><span className="legend-dot farm" /> Farm</div>
          <div className="legend-row"><span className="legend-dot township" /> Township</div>
          <div className="legend-row"><span className="legend-dot residential" /> Residential</div>
        </div>
        <div className="legend-separator" />
        <div className="legend-row"><span className="legend-line" /> Official ward boundary</div>
        <div className="legend-row"><span className="legend-ring" /> Limited small-block display</div>
      </div>
    </div>
  );
}
