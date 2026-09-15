import { useMemo, useState } from 'react';
import { Building2, Cross, GraduationCap, Landmark, MapPin, Route, ShieldCheck, TrainFront } from 'lucide-react';
import InfrastructureMap from './InfrastructureMap.jsx';
import SectionHeader from './SectionHeader.jsx';

const TYPE_LABELS = {
  school: 'Schools',
  health: 'Health services',
  police: 'Police',
  transport_node: 'Transport nodes',
  border_crossing: 'Border anchors',
};

const TYPE_ORDER = ['health', 'school', 'police', 'transport_node', 'border_crossing'];

const TYPE_ICONS = {
  school: GraduationCap,
  health: Cross,
  police: ShieldCheck,
  transport_node: TrainFront,
  border_crossing: Landmark,
};

function TypeIcon({ type, size = 17 }) {
  const Icon = TYPE_ICONS[type] ?? MapPin;
  return <Icon size={size} />;
}

function publicInfrastructure(geojson) {
  if (!geojson?.features) return geojson;
  return {
    ...geojson,
    features: geojson.features.filter((feature) => feature.properties?.subtype !== 'dental_clinic'),
  };
}

function getInfraCounts(infrastructureGeojson) {
  const counts = {};
  infrastructureGeojson?.features?.forEach((feature) => {
    const type = feature.properties?.type ?? 'other';
    counts[type] = (counts[type] ?? 0) + 1;
  });
  return counts;
}

function evidenceLabel(value) {
  if (value === 'A') return 'Official source';
  if (value === 'B') return 'Official record, geocoded';
  if (value === 'C') return 'Contextual geographic source';
  return 'Contextual source';
}

function facilityNote(p) {
  if (p.type === 'health') {
    return 'Shown as a health-service anchor for orientation. This point is not used here as a complete public-PHC register or as an access score.';
  }
  if (p.source_confidence === 'C') {
    return 'Shown as a contextual geographic anchor. Use the point for orientation rather than as evidence of service quality, availability or use.';
  }
  return 'Shown as a contextual service anchor. Presence on the map does not establish use, quality, affordability or effective access.';
}

function FacilityPanel({ selectedFacility }) {
  if (!selectedFacility) {
    return (
      <aside className="infrastructure-panel empty-state-card">
        <Building2 size={22} />
        <h3>Select a service anchor</h3>
        <p>Choose a mapped point to see what kind of service or mobility anchor it represents and the source class behind the location.</p>
      </aside>
    );
  }

  const p = selectedFacility.properties;
  return (
    <aside className="infrastructure-panel">
      <div className="infra-panel-header">
        <span className={`infra-type-pill ${p.type}`}><TypeIcon type={p.type} size={15} />{TYPE_LABELS[p.type] ?? p.type}</span>
        <span className="source-pill">{evidenceLabel(p.source_confidence)}</span>
      </div>
      <h3>{p.name}</h3>
      <div className="detail-list compact">
        <div className="detail-row quiet"><span className="detail-label">Type</span><span className="detail-value">{String(p.subtype ?? '').replaceAll('_', ' ')}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Area</span><span className="detail-value">{p.address}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Source</span><span className="detail-value">{p.source_name}</span></div>
      </div>
      <p className="panel-note">{facilityNote(p)}</p>
    </aside>
  );
}

export default function InfrastructureLandscape({ wardsGeojson, blocksGeojson, infrastructureGeojson }) {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const visibleInfrastructure = useMemo(() => publicInfrastructure(infrastructureGeojson), [infrastructureGeojson]);
  const counts = useMemo(() => getInfraCounts(visibleInfrastructure), [visibleInfrastructure]);

  return (
    <section className="section" id="infrastructure">
      <SectionHeader kicker="Service context" title="Institutional and mobility anchors sit within the same geography people move through">
        This layer places selected institutional anchors beside the survey geography. It provides spatial context; it is not a complete service inventory and it should not be read as a measure of effective access.
      </SectionHeader>

      <div className="infrastructure-summary-grid infrastructure-summary-grid--final">
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
          infrastructureGeojson={visibleInfrastructure}
          selectedFacility={selectedFacility}
          onSelectFacility={setSelectedFacility}
        />
        <FacilityPanel selectedFacility={selectedFacility} />
      </div>

      <div className="access-principle-card">
        <div>
          <p className="map-kicker">Method discipline</p>
          <h3>Near is not the same as accessible.</h3>
          <p>GIS can measure one honest mechanism: spatial separation from an eligible facility class. Effective access also depends on whether people need, seek, reach, enter and continue care.</p>
        </div>
        <div className="access-chain" aria-label="Access chain">
          {['need', 'seek', 'reach', 'enter', 'continue'].map((step, index) => (
            <span key={step}>{step}{index < 4 && <i>→</i>}</span>
          ))}
        </div>
      </div>

      <div className="method-callout health-proximity-note">
        <Route size={18} />
        <p>
          Health proximity should be calculated against <strong>fixed public PHC clinics</strong> as a distinct facility class. Hospital and mobile-service geographies are analytically separate. This service-context map therefore does not convert these points into a generic “nearest health facility” access measure.
        </p>
      </div>
    </section>
  );
}
