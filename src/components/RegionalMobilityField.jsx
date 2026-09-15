import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Compass, MoveRight, ShieldCheck } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import { formatNumber, formatPercent } from '../utils/formatters.js';
import { africaContext } from '../data/africaContext.js';

const COUNTRY_META = {
  Zimbabwe: { iso: 'ZWE', lng: 29.3217, lat: -19.0037 },
  'South Africa': { iso: 'ZAF', lng: 26.1476, lat: -28.4085 },
  Malawi: { iso: 'MWI', lng: 33.6684, lat: -13.1746 },
  Ethiopia: { iso: 'ETH', lng: 38.7264, lat: 9.3620 },
  Burundi: { iso: 'BDI', lng: 29.9571, lat: -3.4639 },
  'Democratic Republic of Congo': { iso: 'COD', lng: 22.3906, lat: -4.0993 },
};

const MUSINA = { lng: 30.0481, lat: -22.3608 };

function normalizeRows(countrySummary, sourceType) {
  return (countrySummary ?? [])
    .filter((row) => row.source_type === sourceType)
    .filter((row) => row.country_display !== 'Missing / unknown')
    .map((row) => ({
      country: row.country_display,
      n: Number(row.n ?? 0),
      pct: Number(row.pct ?? 0),
      displayRule: row.display_rule,
    }))
    .sort((a, b) => b.n - a.n);
}

function buildComparison(countrySummary) {
  const birthRows = normalizeRows(countrySummary, 'birthplace_country');
  const recentRows = normalizeRows(countrySummary, 'recent_origin_country');
  const countries = Array.from(new Set([...birthRows.map((row) => row.country), ...recentRows.map((row) => row.country)]));
  return countries.map((country) => {
    const birth = birthRows.find((row) => row.country === country);
    const recent = recentRows.find((row) => row.country === country);
    return {
      country,
      birthN: birth?.n ?? 0,
      birthPct: birth?.pct ?? 0,
      recentN: recent?.n ?? 0,
      recentPct: recent?.pct ?? 0,
      displayRule: birth?.displayRule ?? recent?.displayRule,
    };
  }).sort((a, b) => Math.max(b.birthN, b.recentN) - Math.max(a.birthN, a.recentN));
}

function countryShortName(country) {
  if (country === 'Democratic Republic of Congo') return 'DRC';
  if (country === 'Other / small-count countries') return 'Other / grouped';
  return country;
}

function modeValue(row, mode) {
  return mode === 'birthplace' ? row.birthPct : row.recentPct;
}

function geoData(comparison, mode) {
  const byIso = new Map();
  comparison.forEach((row) => {
    const meta = COUNTRY_META[row.country];
    if (meta) byIso.set(meta.iso, { pct: modeValue(row, mode), n: mode === 'birthplace' ? row.birthN : row.recentN, country: row.country });
  });
  return {
    ...africaContext,
    features: africaContext.features.map((feature) => {
      const datum = byIso.get(feature.properties.iso_a3);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          pct: datum?.pct ?? 0,
          n: datum?.n ?? 0,
          data_country: datum?.country ?? null,
        },
      };
    }),
  };
}

const regionalStyle = {
  version: 8,
  sources: {},
  layers: [{ id: 'regional-background', type: 'background', paint: { 'background-color': '#f2eee5' } }],
};

function RegionalGeoMap({ comparison, mode }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: regionalStyle,
      center: [27, -10],
      zoom: 2.35,
      minZoom: 1.6,
      maxZoom: 6,
      attributionControl: false,
    });
    mapRef.current = map;
    map.once('load', () => {
      loadedRef.current = true;
      map.addSource('africa-countries', { type: 'geojson', data: geoData(comparison, mode) });
      map.addLayer({
        id: 'africa-fill', type: 'fill', source: 'africa-countries',
        paint: {
          'fill-color': ['interpolate', ['linear'], ['coalesce', ['get', 'pct'], 0], 0, '#eee9df', 2, '#d3e5dd', 10, '#9bcbbd', 30, '#5ca58e', 60, '#258a72'],
          'fill-opacity': 0.95,
        },
      });
      map.addLayer({
        id: 'africa-line', type: 'line', source: 'africa-countries',
        paint: { 'line-color': '#68716c', 'line-width': 0.9, 'line-opacity': 0.72 },
      });
      map.addSource('musina-point', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [MUSINA.lng, MUSINA.lat] } } });
      map.addLayer({
        id: 'musina-halo', type: 'circle', source: 'musina-point',
        paint: { 'circle-radius': 14, 'circle-color': '#ffc151', 'circle-opacity': 0.22, 'circle-blur': 0.35 },
      });
      map.addLayer({
        id: 'musina-dot', type: 'circle', source: 'musina-point',
        paint: { 'circle-radius': 5.5, 'circle-color': '#ffc151', 'circle-stroke-color': '#111816', 'circle-stroke-width': 1.6 },
      });
      try { map.fitBounds([[10, -35], [48, 15]], { padding: 34, duration: 0 }); } catch {}
    });

    const observer = new ResizeObserver(() => { try { map.resize(); } catch {} });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      try { map.remove(); } catch {}
      mapRef.current = null;
      loadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;
    const update = () => {
      const source = map.getSource('africa-countries');
      source?.setData?.(geoData(comparison, mode));

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      comparison.forEach((row) => {
        const meta = COUNTRY_META[row.country];
        const pct = modeValue(row, mode);
        if (!meta || pct <= 0) return;
        const el = document.createElement('div');
        el.className = `regional-country-marker ${pct >= 20 ? 'is-major' : ''}`;
        el.innerHTML = `<strong>${countryShortName(row.country)}</strong><span>${pct.toFixed(1)}%</span>`;
        const marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([meta.lng, meta.lat]).addTo(map);
        markersRef.current.push(marker);
      });

      const musinaEl = document.createElement('div');
      musinaEl.className = 'regional-musina-label';
      musinaEl.innerHTML = '<strong>Musina</strong><span>study location</span>';
      markersRef.current.push(new maplibregl.Marker({ element: musinaEl, anchor: 'left', offset: [8, 0] }).setLngLat([MUSINA.lng, MUSINA.lat]).addTo(map));
    };

    if (loadedRef.current) update();
    else map.once('load', update);
    return () => { try { map.off('load', update); } catch {} };
  }, [comparison, mode]);

  return <div className="regional-geo-map" ref={containerRef} aria-label={`${mode === 'birthplace' ? 'Birthplace' : 'Recent origin'} geography across Africa`} />;
}

function ComparisonRow({ row }) {
  const maxPct = Math.max(row.birthPct, row.recentPct, 1);
  return (
    <article className="country-comparison-row">
      <div><h4>{countryShortName(row.country)}</h4><p>Born: {formatNumber(row.birthN)} · Recent origin: {formatNumber(row.recentN)}</p></div>
      <div className="comparison-bars" aria-label={`${row.country} birthplace and recent-origin comparison`}>
        <div className="mini-bar-line"><span>Born</span><div className="mini-bar-track"><i className="birth" style={{ width: `${(row.birthPct / maxPct) * 100}%` }} /></div><strong>{formatPercent(row.birthPct)}</strong></div>
        <div className="mini-bar-line"><span>Recent</span><div className="mini-bar-track"><i className="recent" style={{ width: `${(row.recentPct / maxPct) * 100}%` }} /></div><strong>{formatPercent(row.recentPct)}</strong></div>
      </div>
    </article>
  );
}

export default function RegionalMobilityField({ countrySummary }) {
  const [mode, setMode] = useState('birthplace');
  const comparison = useMemo(() => buildComparison(countrySummary), [countrySummary]);
  const zimbabwe = comparison.find((row) => row.country === 'Zimbabwe');
  const southAfrica = comparison.find((row) => row.country === 'South Africa');
  const displayRows = comparison.slice(0, 7);

  return (
    <section className="section regional-section" id="regional-field">
      <SectionHeader kicker="Regional mobility geography" title="Changing what we mean by origin changes the map">
        Birthplace records where a person was born. Recent origin records where a person most recently moved from before Musina. Keeping those temporal geographies separate reveals a different regional pattern without pretending that either one is an individual route.
      </SectionHeader>

      <div className="regional-geo-layout">
        <div className="regional-geography-card">
          <div className="regional-card-header regional-card-header--geo">
            <div><p className="map-kicker">Actual country geography</p><h3>{mode === 'birthplace' ? 'Birthplace' : 'Recent origin'}</h3></div>
            <div className="regional-mode-toggle" aria-label="Switch regional geography">
              <button type="button" className={mode === 'birthplace' ? 'is-active' : ''} onClick={() => setMode('birthplace')}>Birthplace</button>
              <button type="button" className={mode === 'recent' ? 'is-active' : ''} onClick={() => setMode('recent')}>Recent origin</button>
            </div>
          </div>
          <RegionalGeoMap comparison={comparison} mode={mode} />
          <div className="regional-scale-legend"><span>lower share</span><i /><span>higher share</span></div>
          <div className="map-note regional-note"><ShieldCheck size={16} /><span>Country fills show aggregated shares. Country labels are analytical anchors within real country geometries; they are not respondent locations or travel routes. Country boundaries: Natural Earth.</span></div>
        </div>

        <aside className="regional-briefing-card regional-briefing-card--geo">
          <p className="panel-kicker">Where does somebody come from — when?</p>
          <h3>The temporal definition changes the geography.</h3>
          <p>Zimbabwe remains the strongest country-level connection in both views. South Africa becomes more prominent when the question changes from birthplace to recent origin, signalling movement through places inside South Africa before Musina.</p>
          <div className="regional-logic-strip">
            <span><Compass size={15} /> Birthplace = where a person was born</span>
            <span><MoveRight size={15} /> Recent origin = last migration link before Musina</span>
          </div>
          <div className="regional-insight-grid">
            <div className="regional-insight-card"><Compass size={18} /><span>Zimbabwe-born</span><strong>{formatPercent(zimbabwe?.birthPct)}</strong></div>
            <div className="regional-insight-card"><MoveRight size={18} /><span>Recent origin Zimbabwe</span><strong>{formatPercent(zimbabwe?.recentPct)}</strong></div>
            <div className="regional-insight-card"><Compass size={18} /><span>South Africa-born</span><strong>{formatPercent(southAfrica?.birthPct)}</strong></div>
            <div className="regional-insight-card"><MoveRight size={18} /><span>Recent origin South Africa</span><strong>{formatPercent(southAfrica?.recentPct)}</strong></div>
          </div>
        </aside>
      </div>

      <div className="country-comparison-card">
        <div className="comparison-card-heading">
          <div><p className="map-kicker">Birthplace versus recent origin</p><h3>Two temporal geographies, two meanings</h3></div>
          <p>The same participants produce different country-level patterns depending on whether “origin” refers to birthplace or the most recent place of migration before Musina.</p>
        </div>
        <div className="country-comparison-list">{displayRows.map((row) => <ComparisonRow key={`comparison-${row.country}`} row={row} />)}</div>
      </div>
    </section>
  );
}
