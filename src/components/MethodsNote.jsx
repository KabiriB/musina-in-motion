import SectionHeader from './SectionHeader.jsx';

export default function MethodsNote({ metadata }) {
  return (
    <section className="section" id="methods">
      <SectionHeader kicker="Evidence and privacy" title="How to read the atlas">
        The atlas is designed to make spatial patterns legible without turning a research sample into a census map, a service point into an access claim, or a narrated journey into a GPS trace.
      </SectionHeader>
      <div className="methods-card">
        <div>
          <h3>Evidence base</h3>
          <p>
            The spatial summaries use <strong>{metadata?.base_analyzable_n ?? 629}</strong> analysable survey observations across{' '}
            <strong>{metadata?.block_anchor_n ?? 16}</strong> survey block anchors in <strong>{metadata?.ward_n ?? 6}</strong> selected wards.
          </p>
        </div>
        <div>
          <ul>
            <li>Regional birthplace and recent-origin maps use actual country geometries and aggregated country-level shares. They are not individual route maps.</li>
            <li>Ward outlines provide the administrative geography used for the Musina study area; block points are broad fieldwork anchors, not household locations.</li>
            <li>Small counts and sensitive combinations are suppressed or shown only at safer levels of aggregation.</li>
            <li>Infrastructure points provide service context. Proximity to a mapped facility does not establish service use, travel time, affordability, safety, quality or effective access.</li>
            <li>Health proximity should be defined against an eligible facility class. Fixed public PHC, hospital and mobile-service geographies should not be collapsed into one generic “nearest health facility” measure.</li>
            <li>The participatory resource layer records places named through workshop mapping. The difference between named and mapped resources is itself evidence about what GIS can and cannot stabilise as points.</li>
            <li>The atlas describes patterns among participants in the selected study geography. It does not claim to map every migrant, journey, service or resource in Musina.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
