import { useMemo, useState } from 'react';
import { HandHeart, ListChecks, MapPin, ShieldCheck } from 'lucide-react';
import ResourcesMap from './ResourcesMap.jsx';
import SectionHeader from './SectionHeader.jsx';

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
        <p>
          Click a point to see which resource was named in the workshop maps. These points show
          participant and workshop knowledge, not a final official infrastructure register.
        </p>
      </aside>
    );
  }

  const p = selectedResource.properties;

  return (
    <aside className="resources-panel">
      <div className="resource-panel-header">
        <span className={`resource-type-pill ${p.resource_category}`}>
          {p.resource_category_label}
        </span>
        <span className="source-pill">workshop mapped</span>
      </div>
      <h3>{p.resource_name}</h3>
      <p className="resources-panel-copy">
        This place was named in participatory mapping material. It should be read as a locally
        meaningful resource point, not as a fully verified official facility record.
      </p>
      <div className="detail-list compact">
        <div className="detail-row quiet"><span className="detail-label">Mention count</span><span className="detail-value">{p.mention_count}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Source</span><span className="detail-value">{p.source_sheet}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Coordinates</span><span className="detail-value">{p.coordinate_review_flag}</span></div>
        <div className="detail-row quiet"><span className="detail-label">Verification</span><span className="detail-value">needs review</span></div>
      </div>
      <p className="panel-note">
        Named by: {p.mentioned_by_groups || 'workshop group not specified'}.
      </p>
    </aside>
  );
}

function topResources(resources, limit = 10) {
  return [...(resources ?? [])]
    .sort((a, b) => Number(b.mention_count ?? 0) - Number(a.mention_count ?? 0))
    .slice(0, limit);
}

function unmappedResources(resources, limit = 24) {
  return [...(resources ?? [])]
    .filter((resource) => !resource.include_in_map)
    .sort((a, b) => Number(b.mention_count ?? 0) - Number(a.mention_count ?? 0))
    .slice(0, limit);
}

export default function ParticipatoryResources({ wardsGeojson, blocksGeojson, resourcesGeojson, resources, categorySummary }) {
  const [selectedResource, setSelectedResource] = useState(null);
  const mappedCount = resourcesGeojson?.features?.length ?? 0;
  const namedCount = resources?.length ?? 0;
  const totalMentions = useMemo(() => (resources ?? []).reduce((sum, r) => sum + Number(r.mention_count ?? 0), 0), [resources]);
  const topNamedResources = useMemo(() => topResources(resources), [resources]);
  const unmappedNamedResources = useMemo(() => unmappedResources(resources), [resources]);

  return (
    <section className="section resources-section" id="participatory-resources">
      <SectionHeader kicker="Participatory resource landscape" title="Places people named as useful, important, or familiar">
        Formal infrastructure tells only part of the access story. Workshop maps point to the places
        people recognise in practice: clinics, schools, churches, offices, shelters, truck stops,
        taxi spaces, shops, water points, and other everyday resources.
      </SectionHeader>

      <div className="atlas-privacy-banner resources-banner">
        <ShieldCheck size={18} />
        <p>
          <strong>How to read this layer:</strong> these are workshop-identified resources. They help
          us see Musina through local knowledge, but they still need checking before being treated as
          final facility data. The map shows places, not people.
        </p>
      </div>

      <div className="resource-summary-grid">
        <div className="resource-count-card"><MapPin size={18} /><strong>{mappedCount}</strong><span>mapped resource points</span></div>
        <div className="resource-count-card"><ListChecks size={18} /><strong>{namedCount}</strong><span>named resources</span></div>
        <div className="resource-count-card"><HandHeart size={18} /><strong>{totalMentions}</strong><span>workshop mentions</span></div>
      </div>

      <div className="resources-shell">
        <ResourcesMap
          wardsGeojson={wardsGeojson}
          blocksGeojson={blocksGeojson}
          resourcesGeojson={resourcesGeojson}
          selectedResource={selectedResource}
          onSelectResource={setSelectedResource}
        />
        <ResourcePanel selectedResource={selectedResource} />
      </div>

      <div className="resource-lists-grid">
        <article className="resource-list-card">
          <p className="map-kicker">Most frequently named</p>
          <h3>Repeated mentions point to everyday importance</h3>
          <div className="resource-chip-list">
            {topNamedResources.map((resource) => (
              <span key={resource.resource_id}>
                {resource.resource_name} <strong>{resource.mention_count}</strong>
              </span>
            ))}
          </div>
        </article>

        <article className="resource-list-card">
          <p className="map-kicker">Named but not mapped yet</p>
          <h3>Some resources still need coordinates</h3>
          <div className="resource-chip-list subdued">
            {unmappedNamedResources.map((resource) => (
              <span key={resource.resource_id}>{resource.resource_name}</span>
            ))}
          </div>
        </article>
      </div>

      <div className="category-strip">
        {(categorySummary ?? []).map((category) => (
          <div className="category-strip-card" key={category.resource_category}>
            <span>{CATEGORY_LABELS[category.resource_category] ?? category.resource_category_label}</span>
            <strong>{category.resource_count}</strong>
            <small>{category.mapped_count} mapped · {category.total_mentions} mentions</small>
          </div>
        ))}
      </div>
    </section>
  );
}
