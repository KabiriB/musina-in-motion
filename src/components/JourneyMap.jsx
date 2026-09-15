import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { MAP_STYLES } from '../config/mapStyle.js';

const roleLabels = {
  origin: 'Origin',
  transit: 'Transit / stop',
  border: 'Border crossing',
  work: 'Work / preparation',
  arrival: 'First arrival',
  return: 'Return',
  settlement: 'Settlement',
};

const emptyCollection = () => ({ type: 'FeatureCollection', features: [] });

function lineFeature(coordinates, properties = {}) {
  if (!coordinates || coordinates.length < 2) return null;
  return {
    type: 'Feature',
    properties,
    geometry: { type: 'LineString', coordinates },
  };
}

function storyCoordinates(story) {
  return story?.stops?.map((stop) => [stop.longitude, stop.latitude]) ?? [];
}

function selectedRouteData(story) {
  const feature = lineFeature(storyCoordinates(story), { name: story?.name ?? '' });
  return { type: 'FeatureCollection', features: feature ? [feature] : [] };
}

function completedRouteData(story, activeStopOrder) {
  if (!story || !activeStopOrder) return emptyCollection();
  const completed = story.stops
    .filter((stop) => stop.order <= activeStopOrder)
    .map((stop) => [stop.longitude, stop.latitude]);
  const feature = lineFeature(completed, { name: story.name });
  return { type: 'FeatureCollection', features: feature ? [feature] : [] };
}

function activeLegRouteData(story, activeStopOrder) {
  if (!story || !activeStopOrder || activeStopOrder <= 1) return emptyCollection();
  const activeIndex = story.stops.findIndex((stop) => stop.order === activeStopOrder);
  if (activeIndex <= 0) return emptyCollection();
  const previous = story.stops[activeIndex - 1];
  const current = story.stops[activeIndex];
  const feature = lineFeature(
    [[previous.longitude, previous.latitude], [current.longitude, current.latitude]],
    { name: story.name, leg: activeStopOrder },
  );
  return { type: 'FeatureCollection', features: feature ? [feature] : [] };
}

function intendedRouteData(story, activeStopOrder) {
  const intended = story?.intendedDestination;
  if (!intended || !activeStopOrder || activeStopOrder < intended.fromStopOrder) return emptyCollection();
  const from = story.stops.find((stop) => stop.order === intended.fromStopOrder);
  if (!from) return emptyCollection();
  const feature = lineFeature(
    [[from.longitude, from.latitude], [intended.longitude, intended.latitude]],
    { name: intended.name, kind: 'intended' },
  );
  return { type: 'FeatureCollection', features: feature ? [feature] : [] };
}

function overviewRouteData(stories) {
  return {
    type: 'FeatureCollection',
    features: stories
      .map((story) => lineFeature(storyCoordinates(story), { name: story.name, sourceId: story.sourceId }))
      .filter(Boolean),
  };
}

function setSourceData(map, sourceId, data) {
  try {
    map.getSource(sourceId)?.setData?.(data);
  } catch {
    // Rendering will retry on the next state update.
  }
}

function addJourneyLayers(map) {
  if (map.getSource('journey-overview')) return;

  map.addSource('journey-overview', { type: 'geojson', data: emptyCollection() });
  map.addLayer({
    id: 'journey-overview-shadow',
    type: 'line',
    source: 'journey-overview',
    paint: {
      'line-color': '#0d1815',
      'line-width': 4.5,
      'line-opacity': 0.16,
      'line-blur': 1.2,
    },
  });
  map.addLayer({
    id: 'journey-overview-lines',
    type: 'line',
    source: 'journey-overview',
    paint: {
      'line-color': '#b98234',
      'line-width': 2.1,
      'line-opacity': 0.34,
    },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  });

  map.addSource('journey-selected', { type: 'geojson', data: emptyCollection() });
  map.addLayer({
    id: 'journey-selected-shadow',
    type: 'line',
    source: 'journey-selected',
    paint: {
      'line-color': '#0f1714',
      'line-width': 10,
      'line-opacity': 0.24,
      'line-blur': 1.4,
    },
  });
  map.addLayer({
    id: 'journey-selected-line',
    type: 'line',
    source: 'journey-selected',
    paint: {
      'line-color': '#6f6657',
      'line-width': 4.2,
      'line-opacity': 0.64,
    },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  });

  map.addSource('journey-completed', { type: 'geojson', data: emptyCollection() });
  map.addLayer({
    id: 'journey-completed-line',
    type: 'line',
    source: 'journey-completed',
    paint: {
      'line-color': '#258a72',
      'line-width': 4.6,
      'line-opacity': 0.82,
    },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  });

  map.addSource('journey-active-leg', { type: 'geojson', data: emptyCollection() });
  map.addLayer({
    id: 'journey-active-leg-glow',
    type: 'line',
    source: 'journey-active-leg',
    paint: {
      'line-color': '#ffc151',
      'line-width': 11,
      'line-opacity': 0.18,
      'line-blur': 2.4,
    },
  });
  map.addLayer({
    id: 'journey-active-leg-line',
    type: 'line',
    source: 'journey-active-leg',
    paint: {
      'line-color': '#d9972e',
      'line-width': 5.6,
      'line-opacity': 0.98,
    },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  });

  map.addSource('journey-intended', { type: 'geojson', data: emptyCollection() });
  map.addLayer({
    id: 'journey-intended-line',
    type: 'line',
    source: 'journey-intended',
    paint: {
      'line-color': '#258a72',
      'line-width': 3.2,
      'line-opacity': 0.8,
      'line-dasharray': [2, 2.1],
    },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  });
}

function duplicateMarkerOffset(story, stop) {
  const key = `${stop.longitude.toFixed(5)}:${stop.latitude.toFixed(5)}`;
  const duplicates = story.stops.filter(
    (candidate) => `${candidate.longitude.toFixed(5)}:${candidate.latitude.toFixed(5)}` === key,
  );
  if (duplicates.length < 2) return [0, 0];
  const index = duplicates.findIndex((candidate) => candidate.order === stop.order);
  const offsets = [[-13, -9], [13, 9], [-13, 11], [13, -11]];
  return offsets[index] ?? [0, 0];
}

function markerNode(stop, active) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `journey-marker journey-marker--${stop.role}${active ? ' is-active' : ''}`;
  el.textContent = String(stop.order);
  el.setAttribute('aria-label', `${stop.order}. ${stop.name}: ${stop.label ?? roleLabels[stop.role] ?? stop.role}`);
  return el;
}

function popupNode(stop) {
  const wrap = document.createElement('div');
  wrap.className = 'journey-popup-card';

  const kicker = document.createElement('span');
  kicker.textContent = stop.label ?? roleLabels[stop.role] ?? stop.role;

  const title = document.createElement('strong');
  title.textContent = `${stop.order}. ${stop.name}`;

  const cue = document.createElement('p');
  cue.textContent = 'Scroll the narrative to follow this stop in sequence.';

  wrap.append(kicker, title, cue);
  return wrap;
}

function boundsForStories(stories, includeIntended = true) {
  const bounds = new maplibregl.LngLatBounds();
  stories.forEach((story) => {
    story.stops.forEach((stop) => bounds.extend([stop.longitude, stop.latitude]));
    if (includeIntended && story.intendedDestination) {
      bounds.extend([story.intendedDestination.longitude, story.intendedDestination.latitude]);
    }
  });
  return bounds;
}

export default function JourneyMap({ stories, story, activeStopOrder, onStopSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const loadedRef = useRef(false);
  const onStopSelectRef = useRef(onStopSelect);

  const overview = !story;
  const mapTitle = overview ? 'Ten journeys into and around Musina' : story.title;
  const mapSubtitle = overview ? 'Select a name to enter one journey.' : story.routeLabel;
  const mapTitleClass = mapTitle.length >= 32 ? ' is-long-title' : '';

  const activeStop = useMemo(
    () => story?.stops.find((stop) => stop.order === activeStopOrder) ?? null,
    [story, activeStopOrder],
  );

  useEffect(() => {
    onStopSelectRef.current = onStopSelect;
  }, [onStopSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES.journey,
      center: [27.8, -20.3],
      zoom: 3.5,
      minZoom: 2.2,
      maxZoom: 14,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });

    mapRef.current = map;

    try {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    } catch {
      // Controls are optional; map rendering is not.
    }

    map.once('load', () => {
      loadedRef.current = true;
      addJourneyLayers(map);
    });

    const observer = new ResizeObserver(() => {
      try { map.resize(); } catch { /* no-op during teardown */ }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      loadedRef.current = false;
      try { map.remove(); } catch { /* safe during hot reload */ }
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const render = () => {
      if (!map.getSource('journey-overview')) addJourneyLayers(map);

      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];

      if (overview) {
        setSourceData(map, 'journey-overview', overviewRouteData(stories));
        setSourceData(map, 'journey-selected', emptyCollection());
        setSourceData(map, 'journey-completed', emptyCollection());
        setSourceData(map, 'journey-active-leg', emptyCollection());
        setSourceData(map, 'journey-intended', emptyCollection());

        const bounds = boundsForStories(stories);
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: { top: 90, right: 70, bottom: 70, left: 70 },
            maxZoom: 4.4,
            duration: 900,
          });
        }
        return;
      }

      setSourceData(map, 'journey-overview', emptyCollection());
      setSourceData(map, 'journey-selected', selectedRouteData(story));
      setSourceData(map, 'journey-completed', completedRouteData(story, activeStopOrder));
      setSourceData(map, 'journey-active-leg', activeLegRouteData(story, activeStopOrder));
      setSourceData(map, 'journey-intended', intendedRouteData(story, activeStopOrder));

      story.stops.forEach((stop) => {
        const element = markerNode(stop, stop.order === activeStopOrder);
        element.addEventListener('click', () => onStopSelectRef.current?.(stop.order));

        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: true,
          offset: 22,
          className: 'journey-map-popup',
          maxWidth: '280px',
        }).setDOMContent(popupNode(stop));

        const marker = new maplibregl.Marker({
          element,
          anchor: 'center',
          offset: duplicateMarkerOffset(story, stop),
        })
          .setLngLat([stop.longitude, stop.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push({ order: stop.order, marker, element });
      });

      if (story.intendedDestination) {
        const intended = story.intendedDestination;
        const element = document.createElement('div');
        element.className = 'journey-intended-marker';
        element.setAttribute('aria-label', intended.label);
        const popup = new maplibregl.Popup({ closeButton: false, offset: 18, className: 'journey-map-popup' })
          .setHTML(`<div class="journey-popup-card"><span>${intended.label}</span><strong>${intended.name}</strong><p>${intended.narrative}</p></div>`);
        const marker = new maplibregl.Marker({ element, anchor: 'center' })
          .setLngLat([intended.longitude, intended.latitude])
          .setPopup(popup)
          .addTo(map);
        markersRef.current.push({ order: 'intended', marker, element });
      }

      const bounds = boundsForStories([story], false);
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: { top: 110, right: 86, bottom: 84, left: 86 },
          maxZoom: 7.2,
          duration: 800,
        });
      }
    };

    if (loadedRef.current && map.isStyleLoaded()) render();
    else map.once('load', render);

    return () => {
      try { map.off('load', render); } catch { /* no-op */ }
    };
  }, [stories, story, overview]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !story) return;

    setSourceData(map, 'journey-completed', completedRouteData(story, activeStopOrder));
    setSourceData(map, 'journey-active-leg', activeLegRouteData(story, activeStopOrder));
    setSourceData(map, 'journey-intended', intendedRouteData(story, activeStopOrder));

    markersRef.current.forEach(({ order, marker, element }) => {
      if (order === 'intended') {
        element.classList.toggle(
          'is-visible',
          Boolean(story.intendedDestination && activeStopOrder >= story.intendedDestination.fromStopOrder),
        );
        return;
      }
      const isActive = order === activeStopOrder;
      const isComplete = typeof order === 'number' && order < activeStopOrder;
      element.classList.toggle('is-active', isActive);
      element.classList.toggle('is-complete', isComplete);
      if (!isActive && marker.getPopup()?.isOpen()) marker.togglePopup();
    });

    if (activeStop) {
      try {
        map.easeTo({
          center: [activeStop.longitude, activeStop.latitude],
          zoom: 6.55,
          offset: [typeof window !== 'undefined' && window.innerWidth > 900 ? -150 : 0, 0],
          duration: 950,
          essential: true,
        });
      } catch {
        // Keep the route view if animation is unavailable.
      }
    }
  }, [story, activeStopOrder, activeStop]);

  const activeIndex = story
    ? Math.max(0, story.stops.findIndex((stop) => stop.order === activeStopOrder))
    : -1;

  return (
    <div className="journey-map-shell">
      <div ref={containerRef} className="journey-map" aria-label={mapTitle} />

      <div className={`journey-map-overlay${mapTitleClass}`}>
        <p className="journey-map-kicker">{overview ? 'Journey field' : story.name}</p>
        <strong>{mapTitle}</strong>
        <span>{mapSubtitle}</span>
      </div>

      {!overview && (
        <div className="journey-map-progress" aria-label={`Stop ${activeIndex + 1} of ${story.stops.length}`}>
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <i><b style={{ width: `${((activeIndex + 1) / story.stops.length) * 100}%` }} /></i>
          <span>{String(story.stops.length).padStart(2, '0')}</span>
        </div>
      )}

      <div className="journey-map-note">
        <strong>Interpretive geography.</strong> Named stops use mapped place coordinates from the interview materials. Lines connect narrated places to show sequence; they do not represent an exact road or GPS trace.
      </div>

      {!overview && activeIndex === 0 && <div className="journey-scroll-cue">Scroll to continue ↓</div>}
    </div>
  );
}
