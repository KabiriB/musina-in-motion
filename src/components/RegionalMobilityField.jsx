import { Compass, Info, MoveRight, ShieldCheck } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import { formatNumber, formatPercent } from '../utils/formatters.js';

const COUNTRY_POSITIONS = {
  // Positions are deliberately hand-tuned for label clarity.
  // They are schematic relationship positions, not geographic coordinates.
  Zimbabwe: { x: 67, y: 43, label: 'right', labelDx: 7.8, labelDy: -5.8, metaDy: 3.2, importance: 'major' },
  'South Africa': { x: 42, y: 80, label: 'right', labelDx: 7.3, labelDy: -1.5, metaDy: 7.6, importance: 'major' },
  Malawi: { x: 76, y: 25, label: 'right', labelDx: 7.4, labelDy: -3.2, metaDy: 5.2, importance: 'minor' },
  Ethiopia: { x: 82, y: 12, label: 'right', labelDx: 7.2, labelDy: -1.6, metaDy: 6.0, importance: 'minor' },
  Burundi: { x: 37, y: 49, label: 'left', labelDx: -7.2, labelDy: -2.2, metaDy: 5.4, importance: 'minor' },
  'Democratic Republic of Congo': { x: 25, y: 32, label: 'right', labelDx: 7.1, labelDy: -2.0, metaDy: 5.8, importance: 'minor' },
  'Other / small-count countries': { x: 20, y: 66, label: 'right', labelDx: 7.2, labelDy: -1.6, metaDy: 6.0, importance: 'grouped' },
  'Missing / unknown': { x: 16, y: 83, label: 'right', labelDx: 7.0, labelDy: -1.6, metaDy: 5.8, importance: 'minor' },
};

const MUSINA = { x: 58, y: 66 };

function normalizeRows(countrySummary, sourceType) {
  return (countrySummary ?? [])
    .filter((row) => row.source_type === sourceType)
    .filter((row) => row.country_display !== 'Missing / unknown')
    .map((row) => ({
      country: row.country_display,
      n: Number(row.n ?? 0),
      pct: Number(row.pct ?? 0),
      displayRule: row.display_rule,
      position: COUNTRY_POSITIONS[row.country_display] ?? COUNTRY_POSITIONS['Other / small-count countries'],
    }))
    .sort((a, b) => b.n - a.n);
}

function buildComparison(countrySummary) {
  const birthRows = normalizeRows(countrySummary, 'birthplace_country');
  const recentRows = normalizeRows(countrySummary, 'recent_origin_country');
  const countries = Array.from(new Set([...birthRows.map((row) => row.country), ...recentRows.map((row) => row.country)]));

  return countries
    .map((country) => {
      const birth = birthRows.find((row) => row.country === country);
      const recent = recentRows.find((row) => row.country === country);
      return {
        country,
        birthN: birth?.n ?? 0,
        birthPct: birth?.pct ?? 0,
        recentN: recent?.n ?? 0,
        recentPct: recent?.pct ?? 0,
        displayRule: birth?.displayRule ?? recent?.displayRule,
        position: COUNTRY_POSITIONS[country] ?? COUNTRY_POSITIONS['Other / small-count countries'],
      };
    })
    .sort((a, b) => Math.max(b.birthN, b.recentN) - Math.max(a.birthN, a.recentN));
}

function curvePath(from, to, lift = -16) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + lift;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

function countryShortName(country) {
  if (country === 'Democratic Republic of Congo') return 'DRC';
  if (country === 'Other / small-count countries') return 'Other / grouped';
  return country;
}

function FlowLine({ row, type }) {
  const isRecent = type === 'recent';
  const value = isRecent ? row.recentPct : row.birthPct;
  if (!value) return null;

  const strokeWidth = Math.max(0.9, Math.min(7.2, value / 9.5));
  const path = curvePath(row.position, MUSINA, isRecent ? -7 : 10);
  const opacityClass = value < 2 ? 'soft' : value > 40 ? 'dominant' : '';

  return (
    <path
      className={`flow-path ${isRecent ? 'recent' : 'birth'} ${opacityClass}`}
      d={path}
      strokeWidth={strokeWidth}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function CountryNode({ row }) {
  const maxPct = Math.max(row.birthPct, row.recentPct);
  const radius = Math.max(3.6, Math.min(8.2, 3 + maxPct / 14));
  const labelOnLeft = row.position.label === 'left';
  const textX = row.position.labelDx ?? (labelOnLeft ? -(radius + 5) : radius + 5);
  const labelY = row.position.labelDy ?? -1;
  const metaY = row.position.metaDy ?? 7.5;
  const textAnchor = labelOnLeft ? 'end' : 'start';

  return (
    <g className={`country-node ${row.position.importance ?? 'minor'}`} transform={`translate(${row.position.x} ${row.position.y})`}>
      <circle className="country-node-halo" r={radius + 4.6} />
      <circle className="country-node-dot" r={radius} />
      <text className="country-node-label" x={textX} y={labelY} textAnchor={textAnchor}>
        {countryShortName(row.country)}
      </text>
      <text className="country-node-meta" x={textX} y={metaY} textAnchor={textAnchor}>
        born {row.birthPct.toFixed(1)}% · recent {row.recentPct.toFixed(1)}%
      </text>
    </g>
  );
}

function ComparisonRow({ row }) {
  const maxPct = Math.max(row.birthPct, row.recentPct, 1);
  return (
    <article className="country-comparison-row">
      <div>
        <h4>{countryShortName(row.country)}</h4>
        <p>
          Born: {formatNumber(row.birthN)} · Recent origin: {formatNumber(row.recentN)}
        </p>
      </div>
      <div className="comparison-bars" aria-label={`${row.country} birthplace and recent-origin comparison`}>
        <div className="mini-bar-line">
          <span>Born</span>
          <div className="mini-bar-track"><i className="birth" style={{ width: `${(row.birthPct / maxPct) * 100}%` }} /></div>
          <strong>{formatPercent(row.birthPct)}</strong>
        </div>
        <div className="mini-bar-line">
          <span>Recent</span>
          <div className="mini-bar-track"><i className="recent" style={{ width: `${(row.recentPct / maxPct) * 100}%` }} /></div>
          <strong>{formatPercent(row.recentPct)}</strong>
        </div>
      </div>
    </article>
  );
}

export default function RegionalMobilityField({ countrySummary }) {
  const comparison = buildComparison(countrySummary);
  const zimbabwe = comparison.find((row) => row.country === 'Zimbabwe');
  const southAfrica = comparison.find((row) => row.country === 'South Africa');
  const displayRows = comparison.slice(0, 7);

  return (
    <section className="section regional-section" id="regional-field">
      <SectionHeader kicker="Regional mobility field" title="Birthplace, recent origin, and Musina as hinge">
        This section keeps two ideas separate: where respondents were born and where they most
        recently migrated from. The difference matters because Musina is not only a point of arrival;
        it is connected to regional movement, internal circulation, and repeated settlement routines.
      </SectionHeader>

      <div className="regional-shell">
        <div className="regional-map-card">
          <div className="regional-card-header">
            <div>
              <p className="map-kicker">Analytical connection field</p>
              <h3>Regional connections to Musina</h3>
            </div>
            <div className="flow-legend" aria-label="Regional flow legend">
              <span><i className="birth" /> Birthplace</span>
              <span><i className="recent" /> Recent origin</span>
            </div>
          </div>

          <div className="read-this-card">
            <Info size={16} />
            <p>
              Read this as a relationship field, not a route map. Larger nodes and thicker lines
              indicate stronger country-level signals in the cleaned data.
            </p>
          </div>

          <svg className="regional-flow-svg" viewBox="0 0 100 100" role="img" aria-label="Regional mobility connection field showing birthplace and recent-origin links to Musina">
            <defs>
              <radialGradient id="musinaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffc151" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffc151" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100" height="100" rx="3" className="regional-svg-bg" />
            <path className="region-guide-line" d="M 15 72 C 33 58, 43 48, 58 66 S 73 40, 86 14" />
            <path className="region-guide-line soft" d="M 34 86 C 47 74, 54 69, 58 66 S 61 54, 67 43" />

            {displayRows.map((row) => <FlowLine key={`${row.country}-birth`} row={row} type="birth" />)}
            {displayRows.map((row) => <FlowLine key={`${row.country}-recent`} row={row} type="recent" />)}
            {displayRows.map((row) => <CountryNode key={row.country} row={row} />)}

            <g className="musina-node" transform={`translate(${MUSINA.x} ${MUSINA.y})`}>
              <circle r="13" fill="url(#musinaGlow)" />
              <circle r="5.8" />
              <text x="8" y="0">Musina</text>
              <text x="8" y="8">survey anchor</text>
            </g>
          </svg>

          <div className="map-note regional-note">
            <ShieldCheck size={16} />
            <span>Lines are analytical connections, not literal travel routes. Small-count countries are grouped.</span>
          </div>
        </div>

        <aside className="regional-briefing-card">
          <p className="panel-kicker">What the regional field says</p>
          <h3>Musina is not a simple destination point.</h3>
          <p>
            The cleaned data show a strong Zimbabwe connection in both birthplace and recent-origin
            fields, but South Africa becomes more visible as a recent origin than as a birthplace.
            That is a small but important signal of circulation through places inside South Africa,
            not only direct movement from outside the country.
          </p>
          <div className="regional-logic-strip" aria-label="How to read birthplace versus recent origin">
            <span><Compass size={15} /> Birthplace = origin in life history</span>
            <span><MoveRight size={15} /> Recent origin = last migration link</span>
          </div>
          <div className="regional-insight-grid">
            <div className="regional-insight-card">
              <Compass size={18} />
              <span>Zimbabwe-born</span>
              <strong>{formatPercent(zimbabwe?.birthPct)}</strong>
            </div>
            <div className="regional-insight-card">
              <MoveRight size={18} />
              <span>Recent origin Zimbabwe</span>
              <strong>{formatPercent(zimbabwe?.recentPct)}</strong>
            </div>
            <div className="regional-insight-card">
              <Compass size={18} />
              <span>SA-born</span>
              <strong>{formatPercent(southAfrica?.birthPct)}</strong>
            </div>
            <div className="regional-insight-card">
              <MoveRight size={18} />
              <span>Recent origin South Africa</span>
              <strong>{formatPercent(southAfrica?.recentPct)}</strong>
            </div>
          </div>
        </aside>
      </div>

      <div className="country-comparison-card">
        <div className="comparison-card-heading">
          <div>
            <p className="map-kicker">Birthplace versus recent origin</p>
            <h3>Two geographies, two meanings</h3>
          </div>
          <p>
            Birthplace tells us where people are originally from. Recent origin tells us the last
            place from which they moved to Musina. The interface keeps them separate by design.
          </p>
        </div>
        <div className="country-comparison-list">
          {displayRows.map((row) => <ComparisonRow key={`comparison-${row.country}`} row={row} />)}
        </div>
      </div>
    </section>
  );
}
