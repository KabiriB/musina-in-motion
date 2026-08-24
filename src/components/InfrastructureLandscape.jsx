import { useMemo, useState } from 'react';
import { Building2, Cross, Fuel, GraduationCap, Landmark, MapPin, Route, ShieldCheck, TrainFront } from 'lucide-react';
import InfrastructureMap from './InfrastructureMap.jsx';
import SectionHeader from './SectionHeader.jsx';

const TYPE_LABELS = {
  school: 'Schools',
  health: 'Health facilities',
  police: 'Police',
  transport_node: 'Transport nodes',
  border_crossing: 'Border crossing',
  petrol_station: 'Candidate petrol / fuel nodes',
};

const TYPE_ORDER = ['health', 'school', 'police', 'transport_node', 'border_crossing', 'petrol_station'];

const TYPE_ICONS = {
  school: GraduationCap,
  health: Cross,
  police: ShieldCheck,
  transport_node: TrainFront,
  border_crossing: Landmark,
  petrol_station: Fuel,
};

function TypeIcon({ type, size = 17 }) {
  const Icon = TYPE_ICONS[type] ?? MapPin;
  return <Icon size={size} />;
}

function formatDistance(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(2)} km`;
}

function getInfraCounts(infrastructureGeojson, petrolCandidatesGeojson) {
  const counts = {};
  infrastructureGeojson?.features?.forEach((feature) => {
    const type = feature.properties?.type ?? 'other';
    counts[type] = (counts[type] ?? 0) + 1;
  });
  petrolCandidatesGeojson?.features?.forEach((feature) => {
    const type = feature.properties?.type ?? 'petrol_station';
    counts[type] = (counts[type] ?? 0) + 1;
  });
  return counts;
}

function nearestSummaryRows(nearestInfrastructure) {
  if (!nearestInfrastructure?.length) return [];

  const distanceFields = [
    ['nearest_health', 'Health facility'],
    ['nearest_school', 'School'],
    ['nearest_police', 'Police station'],
    ['nearest_transport_or_border', 'Transport / border node'],
  ];

  return distanceFields.map(([prefix, label]) => {
    const distances = nearestInfrastructure
      .map((row) => Number(row[`${prefix}_distance_km`]))
      .filter((value) => Number.isFinite(value));

    if (!distances.length) {
      return { label, min: null, median: null, max: null };
    }

    const sorted = [...distances].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    return {
      label,
      min: sorted[0],
      median,
      max: sorted[sorted.length - 1],
    };
  });
}

function sourceConfidenceLabel(value) {
  if (value === 'A') return 'A · official coordinate source';
  if (value === 'B') return 'B · official name/address, geocoded';
  if (value === 'C') return 'C · open/contextual source';
  if (value === 'D') return 'D · temporary candidate';
  return value ?? 'Unclassified source';
}

function FacilityPanel({ selectedFacility }) {
  if (!selectedFacility) {
    return (
      <aside className="infrastructure-panel empty-state-card">
        <Building2 size={22} />
        <h3>Select an infrastructure point</h3>
        <p>
          Click a school, health facility, police station, transport node, or border anchor to see
          what kind of point it is and how confident we are about the source.
        </p>
      </aside>
    );
  }

  const p = selectedFacility.properties;

  return (
    <aside className="infrastructure-panel">
      <div className="infra-panel-header">
        <span className={`infra-type-pill ${p.type}`}>
          <TypeIcon type={p.type} size={15} />
          {TYPE_LABELS[p.type] ?? p.type}
        </span>
        <span className="source-pill">{sourceConfidenceLabel(p.source_confidence)}</span>
        {p.candidate_status && <span className="candidate-warning-pill">Not final</span>}
      </div>
      <h3>{p.name}</h3>
      <div className="detail-list compact">
        <div className="detail-row quiet"><span className="detail-label">Subtype</span><span className="detail-value">{p.subtype}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Address / area</span><span className="detail-value">{p.address}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Source</span><span className="detail-value">{p.source_name}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Verification</span><span className="detail-value">{p.verification_status}</span></div>
        {p.coordinate_status && <div className="detail-row quiet"><span className="detail-label">Coordinate status</span><span className="detail-value">{p.coordinate_status}</span></div>}
        {p.mobility_role && <div className="detail-row quiet"><span className="detail-label">Possible mobility role</span><span className="detail-value">{p.mobility_role}</span></div>}
      </div>
      <p className={`panel-note ${p.candidate_status ? 'candidate-note' : ''}`}>{p.notes}</p>
    </aside>
  );
}

export default function InfrastructureLandscape({ wardsGeojson, blocksGeojson, infrastructureGeojson, nearestInfrastructure, petrolCandidatesGeojson, petrolCandidates }) {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const counts = useMemo(() => getInfraCounts(infrastructureGeojson, petrolCandidatesGeojson), [infrastructureGeojson, petrolCandidatesGeojson]);
  const distanceRows = useMemo(() => nearestSummaryRows(nearestInfrastructure), [nearestInfrastructure]);

  return (
    <section className="section" id="infrastructure">
      <SectionHeader kicker="Access landscape" title="Infrastructure, mobility nodes, and everyday access">
        This section asks what surrounds the surveyed blocks. It places schools, clinics,
        police, transport anchors, and border infrastructure beside the survey geography so the team
        can begin reading everyday access as part of Musina's mobility landscape.
      </SectionHeader>

      <div className="atlas-privacy-banner infrastructure-banner">
        <Fuel size={18} />
        <p>
          <strong>Petrol-station note:</strong> fuel points are shown as temporary candidates because
          fieldwork suggests that petrol stations may also work as transport and waiting nodes. They
          still need team confirmation before we treat them as final mobility infrastructure.
        </p>
      </div>

      <div className="infrastructure-summary-grid">
        {TYPE_ORDER.map((type) => (
          <div className="infra-count-card" key={type}>
            <span className={`infra-count-icon ${type}`}><TypeIcon type={type} size={18} /></span>
            <strong>{counts[type] ?? 0}</strong>
            <span>{TYPE_LABELS[type]}</span>
          </div>
        ))}
      </div>

      <div className="infrastructure-shell">
        <InfrastructureMap
          wardsGeojson={wardsGeojson}
          blocksGeojson={blocksGeojson}
          infrastructureGeojson={infrastructureGeojson}
          petrolCandidatesGeojson={petrolCandidatesGeojson}
          selectedFacility={selectedFacility}
          onSelectFacility={setSelectedFacility}
        />
        <FacilityPanel selectedFacility={selectedFacility} />
      </div>


      <div className="candidate-review-card">
        <div>
          <p className="map-kicker">Verification queue</p>
          <h3>Petrol and fuel points are temporary candidates</h3>
          <p>
            These points are included for review. The team can confirm whether they are active,
            correctly located, and meaningful as transport or waiting points.
          </p>
        </div>
        <div className="candidate-list">
          {(petrolCandidates ?? []).map((candidate) => (
            <span key={candidate.infra_id}>{candidate.name}</span>
          ))}
        </div>
      </div>

      <div className="distance-card-grid">
        {distanceRows.map((row) => (
          <article className="distance-card" key={row.label}>
            <p className="distance-label">Nearest {row.label}</p>
            <div className="distance-values">
              <span><strong>{formatDistance(row.min)}</strong><small>closest block</small></span>
              <span><strong>{formatDistance(row.median)}</strong><small>median block</small></span>
              <span><strong>{formatDistance(row.max)}</strong><small>furthest block</small></span>
            </div>
          </article>
        ))}
      </div>

      <div className="method-callout">
        <Route size={18} />
        <p>
          Distances are straight-line distances from block anchors to the nearest verified/contextual point in each
          infrastructure category. They help us start asking access questions. They are not walking time,
          travel cost, route safety, service quality, or proof that people actually use a facility.
        </p>
      </div>
    </section>
  );
}
