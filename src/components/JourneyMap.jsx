import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const roleLabels = {
  origin: 'Origin',
  transit: 'Transit / stop',
  border: 'Border / crossing',
  work: 'Work',
  arrival: 'Arrival',
  settlement: 'Settlement',
};

const BASEMAPS = {
  streets: {
    label: 'Streets',
    layerId: 'journey-basemap-streets',
  },
  atlas: {
    label: 'Atlas',
    layerId: 'journey-basemap-atlas',
  },
  dark: {
    label: 'Dark',
    layerId: 'journey-basemap-dark',
  },
};

const baseMapStyle = {
  version: 8,
  sources: {
    journeyOsm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
    journeyCartoVoyager: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
    journeyCartoDark: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'journey-basemap-streets',
      type: 'raster',
      source: 'journeyOsm',
      layout: { visibility: 'visible' },
      paint: {
        'raster-opacity': 0.96,
        'raster-saturation': -0.18,
        'raster-contrast': -0.04,
        'raster-brightness-max': 0.96,
      },
    },
    {
      id: 'journey-basemap-atlas',
      type: 'raster',
      source: 'journeyCartoVoyager',
      layout: { visibility: 'none' },
      paint: {
        'raster-opacity': 0.96,
        'raster-saturation': -0.22,
        'raster-contrast': -0.04,
        'raster-brightness-max': 0.96,
      },
    },
    {
      id: 'journey-basemap-dark',
      type: 'raster',
      source: 'journeyCartoDark',
      layout: { visibility: 'none' },
      paint: {
        'raster-opacity': 0.94,
        'raster-saturation': -0.08,
        'raster-contrast': 0.04,
      },
    },
  ],
};

function emptyRouteGeojson() {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

function routeGeojson(story) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          status: story.status,
          id: story.id,
        },
        geometry: {
          type: 'LineString',
          coordinates: story.stops.map((stop) => [stop.longitude, stop.latitude]),
        },
      },
    ],
  };
}

function addRouteLayers(map) {
  if (map.getSource('journey-route')) return;

  map.addSource('journey-route', {
    type: 'geojson',
    data: emptyRouteGeojson(),
  });

  map.addLayer({
    id: 'journey-route-shadow',
    type: 'line',
    source: 'journey-route',
    paint: {
      'line-color': '#111816',
      'line-width': 8,
      'line-opacity': 0.34,
      'line-blur': 1.2,
    },
  });

  map.addLayer({
    id: 'journey-route-solid',
    type: 'line',
    source: 'journey-route',
    filter: ['==', ['get', 'status'], 'full narrative'],
    paint: {
      'line-color': '#ffc151',
      'line-width': 4.5,
      'line-opacity': 0.96,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  });

  map.addLayer({
    id: 'journey-route-sketch',
    type: 'line',
    source: 'journey-route',
    filter: ['==', ['get', 'status'], 'route sketch'],
    paint: {
      'line-color': '#ffc151',
      'line-width': 4.5,
      'line-opacity': 0.94,
      'line-dasharray': [2.1, 1.8],
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  });
}

function popupNode(stop) {
  const wrap = document.createElement('div');
  wrap.className = 'journey-popup-card';

  const title = document.createElement('strong');
  title.textContent = `${stop.order}. ${stop.name}`;

  const role = document.createElement('span');
  role.textContent = roleLabels[stop.type] ?? stop.type;

  const copy = document.createElement('p');
  copy.textContent = stop.narrative;

  wrap.append(title, role, copy);
  return wrap;
}

function markerNode(stop) {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = `journey-marker journey-marker--${stop.type}`;
  element.textContent = String(stop.order);
  element.setAttribute('aria-label', `${stop.order}. ${stop.name}`);
  return element;
}

export default function JourneyMap({ story, activeStopOrder, onStopSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const storyRef = useRef(story);
  const onStopSelectRef = useRef(onStopSelect);
  const loadedRef = useRef(false);
  const [activeBasemap, setActiveBasemap] = useState('streets');
  const [mapIssue, setMapIssue] = useState(false);

  const statusClass = useMemo(
    () => `journey-status--${story.status.replaceAll(' ', '-')}`,
    [story.status],
  );

  useEffect(() => {
    storyRef.current = story;
  }, [story]);

  useEffect(() => {
    onStopSelectRef.current = onStopSelect;
  }, [onStopSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: baseMapStyle,
      center: [29.8, -21.8],
      zoom: 4.2,
      minZoom: 2.5,
      maxZoom: 17,
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;

    try {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    } catch {
      // Controls are useful, but map rendering should never depend on them.
    }

    map.on('error', (event) => {
      const message = String(event?.error?.message ?? '');
      if (/tile|image|network|fetch/i.test(message)) setMapIssue(true);
    });

    map.once('load', () => {
      loadedRef.current = true;
      addRouteLayers(map);
      setMapIssue(false);
    });

    let resizeFrame = 0;
    const resizeMap = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        try {
          map.resize();
        } catch {
          // no-op during teardown
        }
      });
    };

    const resizeObserver = new ResizeObserver(resizeMap);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', resizeMap);

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeMap);
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      loadedRef.current = false;

      try {
        map.remove();
      } catch {
        // Safe no-op during development refreshes.
      }

      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const renderStory = () => {
      if (!map.getSource('journey-route')) addRouteLayers(map);

      const source = map.getSource('journey-route');
      source?.setData?.(routeGeojson(story));

      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];

      story.stops.forEach((stop) => {
        const element = markerNode(stop);
        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: true,
          offset: 22,
          className: 'journey-map-popup',
          maxWidth: '360px',
        }).setDOMContent(popupNode(stop));

        element.addEventListener('click', () => {
          onStopSelectRef.current?.(stop.order);
        });

        const marker = new maplibregl.Marker({
          element,
          anchor: 'center',
        })
          .setLngLat([stop.longitude, stop.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push({ order: stop.order, marker, element, popup });
      });

      const bounds = new maplibregl.LngLatBounds();
      story.stops.forEach((stop) => bounds.extend([stop.longitude, stop.latitude]));

      if (!bounds.isEmpty()) {
        try {
          map.resize();
          map.fitBounds(bounds, {
            padding: { top: 105, right: 84, bottom: 76, left: 84 },
            maxZoom: 9.2,
            duration: 650,
          });
        } catch {
          // Keep the current map view if fitBounds cannot run during a hot reload.
        }
      }
    };

    if (loadedRef.current && map.isStyleLoaded()) {
      renderStory();
      return undefined;
    }

    map.once('load', renderStory);
    return () => {
      try {
        map.off('load', renderStory);
      } catch {
        // no-op
      }
    };
  }, [story]);

  useEffect(() => {
    markersRef.current.forEach(({ order, marker, element }) => {
      const isActive = order === activeStopOrder;
      element.classList.toggle('is-active', isActive);

      if (isActive && !marker.getPopup()?.isOpen()) {
        marker.togglePopup();
      }

      if (!isActive && marker.getPopup()?.isOpen()) {
        marker.togglePopup();
      }
    });
  }, [activeStopOrder]);

  const switchBasemap = (key) => {
    const map = mapRef.current;
    if (!map || !BASEMAPS[key]) return;

    Object.entries(BASEMAPS).forEach(([candidateKey, item]) => {
      if (!map.getLayer(item.layerId)) return;
      map.setLayoutProperty(item.layerId, 'visibility', candidateKey === key ? 'visible' : 'none');
    });

    setActiveBasemap(key);
    setMapIssue(false);
  };

  return (
    <div className="journey-map-shell">
      <div ref={containerRef} className="journey-map" aria-label={`Map of ${story.title}`} />

      <div className="journey-map-overlay">
        <div>
          <strong>{story.title}</strong>
          <span>{story.routeLabel}</span>
        </div>
        <span className={`journey-status ${statusClass}`}>
          {story.status}
        </span>
      </div>

      <div className="journey-basemap-switch" aria-label="Basemap options">
        {Object.entries(BASEMAPS).map(([key, item]) => (
          <button
            key={key}
            type="button"
            className={activeBasemap === key ? 'is-active' : ''}
            onClick={() => switchBasemap(key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="journey-map-note">
        <strong>Detailed basemap.</strong> Route lines connect named interview-map stops; they are not GPS traces.
      </div>

      {mapIssue && (
        <div className="journey-map-warning" role="status">
          A basemap request failed. Try Atlas or Dark; the route and stop data remain unchanged.
        </div>
      )}
    </div>
  );
}
