import { useMemo, useState } from 'react';
import { HandHeart, ListChecks, MapPin, ShieldCheck } from 'lucide-react';
import ResourcesMap from './ResourcesMap.jsx';
import SectionHeader from './SectionHeader.jsx';
import { publicationGroupLabel, publicationResourceLabel } from '../utils/publicationLabels.js';

const CATEGORY_LABELS = {
  health_care: 'Health and care',
  state_legal_support: 'State/legal support',
  mobility_transport: 'Mobility and transport',
  education_youth: 'Education and youth',
  social_faith_support: 'Faith and social support',
  work_livelihoods: 'Work and livelihoods',
  water_basic_services: 'Water/basic services',
  community_place: 'Community places',
  other_resource: 'Other resources',
};

function ResourcePanel({ selectedResource }) {
  if (!selectedResource) {
    return (
      <aside className="resources-panel empty-state-card">
        <HandHeart size={24} />
        <h3>Select a named resource</h3>
        <p>Choose a mapped point to see how it appears in the participatory resource material. These points represent local knowledge, not a complete official service register.</p>
      </aside>
    );
  }

  const p = selectedResource.properties;
  return (
    <aside className="resources-panel">
      <div className="resource-panel-header">
        <span className={`resource-type-pill ${p.resource_category}`}>{p.resource_category_label}</span>
        <span className="source-pill">Participatory evidence</span>
      </div>
      <h3>{publicationResourceLabel(p.resource_name)}</h3>
      <p className="resources-panel-copy">This place was named in workshop mapping as a locally meaningful resource. Its presence on the map records that local knowledge; it does not convert the point into a verified service record.</p>
      <div className="detail-list compact">
        <div className="detail-row quiet"><span className="detail-label">Workshop mentions</span><span className="detail-value">{p.mention_count}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Named by</span><span className="detail-value">{publicationGroupLabel(p.mentioned_by_groups)}</span></div>
      </div>
    </aside>
  );
}

function topResources(resources, limit = 10) {
  return [...(resources ?? [])]
    .sort((a, b) => Number(b.mention_count ?? 0) - Number(a.mention_count ?? 0))
    .slice(0, limit);
}

function beyondCoreMap(resources, limit = 24) {
  return [...(resources ?? [])]
    .filter((resource) => !resource.include_in_map)
    .sort((a, b) => Number(b.mention_count ?? 0) - Number(a.mention_count ?? 0))
    .slice(0, limit);
}

function hasCoordinates(resource) {
  return resource?.has_coordinates === true || String(resource?.has_coordinates ?? '').toLowerCase() === 'true';
}

export default function ParticipatoryResources({ wardsGeojson, blocksGeojson, resourcesGeojson, resources, categorySummary }) {
  const [selectedResource, setSelectedResource] = useState(null);
  const mappedCount = resourcesGeojson?.features?.length ?? 0;
  const namedCount = resources?.length ?? 0;
  const coordinateCount = useMemo(() => (resources ?? []).filter(hasCoordinates).length, [resources]);
  const topNamedResources = useMemo(() => topResources(resources), [resources]);
  const beyondMapResources = useMemo(() => beyondCoreMap(resources), [resources]);

  return (
    <section className="section resources-section" id="participatory-resources">
      <SectionHeader kicker="Participatory resource ecology" title="A map of resources is not the resource system">
        Workshop mapping named a much wider field of support than the final point map can hold. The difference is analytically useful: some resources are stable, addressable places; others are relational, temporary, mobile or simply not reducible to a reliable coordinate.
      </SectionHeader>

      <div className="atlas-privacy-banner resources-banner">
        <ShieldCheck size={18} />
        <p><strong>Read the silence carefully:</strong> a resource that is not mapped is not necessarily absent. The map shows the part of the resource ecology that could be stabilised as points in the core map extent.</p>
      </div>

      <div className="resource-summary-grid resource-summary-grid--mappability">
        <div className="resource-count-card"><ListChecks size={18} /><strong>{namedCount}</strong><span>named resources</span></div>
        <div className="resource-count-card"><MapPin size={18} /><strong>{coordinateCount}</strong><span>with coordinates</span></div>
        <div className="resource-count-card"><HandHeart size={18} /><strong>{mappedCount}</strong><span>in the core mapped layer</span></div>
      </div>

      <div className="resources-shell">
        <ResourcesMap wardsGeojson={wardsGeojson} blocksGeojson={blocksGeojson} resourcesGeojson={resourcesGeojson} selectedResource={selectedResource} onSelectResource={setSelectedResource} />
        <ResourcePanel selectedResource={selectedResource} />
      </div>

      <article className="mappability-card">
        <div className="mappability-heading">
          <div>
            <p className="map-kicker">Mappability by resource category</p>
            <h3>Some kinds of support are easier for GIS to see.</h3>
          </div>
          <p>Bars show the share of named resources in each category that entered the core mapped layer. Lower visibility should not be interpreted as lower importance.</p>
        </div>
        <div className="mappability-list">
          {(categorySummary ?? []).map((category) => {
            const total = Number(category.resource_count ?? 0);
            const mapped = Number(category.mapped_count ?? 0);
            const pct = total ? (mapped / total) * 100 : 0;
            return (
              <div className="mappability-row" key={category.resource_category}>
                <span>{CATEGORY_LABELS[category.resource_category] ?? category.resource_category_label}</span>
                <div className="mappability-track"><i style={{ width: `${pct}%` }} /></div>
                <strong>{pct.toFixed(1)}%</strong>
              </div>
            );
          })}
        </div>
      </article>

      <div className="resource-lists-grid">
        <article className="resource-list-card">
          <p className="map-kicker">Repeatedly named</p>
          <h3>Some resources recur across workshop groups</h3>
          <div className="resource-chip-list">
            {topNamedResources.map((resource) => (
              <span key={resource.resource_id}>{publicationResourceLabel(resource.resource_name)} <strong>{resource.mention_count}</strong></span>
            ))}
          </div>
        </article>

        <article className="resource-list-card">
          <p className="map-kicker">Beyond the core point map</p>
          <h3>Named resources can remain important without a mapped point</h3>
          <div className="resource-chip-list subdued">
            {beyondMapResources.map((resource) => <span key={resource.resource_id}>{publicationResourceLabel(resource.resource_name)}</span>)}
          </div>
        </article>
      </div>
    </section>
  );
}
