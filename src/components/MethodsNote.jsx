import SectionHeader from './SectionHeader.jsx';

export default function MethodsNote({ metadata }) {
  return (
    <section className="section" id="methods">
      <SectionHeader kicker="Data honesty" title="What this interface can and cannot claim">
        This page keeps the story honest. The interface is designed to help the team read
        patterns, not to expose people, overclaim certainty, or turn fieldwork data into a census map.
      </SectionHeader>
      <div className="methods-card">
        <div>
          <h3>How this build should be read</h3>
          <p>
            Base analyzable sample: <strong>{metadata?.base_analyzable_n ?? 629}</strong>. Raw rows in
            the cleaned file: <strong>{metadata?.raw_rows_in_cleaned_file ?? 630}</strong>. Block
            anchors: <strong>{metadata?.block_anchor_n ?? 16}</strong>. Selected wards:{' '}
            <strong>{metadata?.ward_n ?? 6}</strong>.
          </p>
        </div>
        <div>
          <ul>
            <li>
              Ward outlines come from the official municipal ward layer. The active ward file is the
              QA-patched v3 layer checked against the raw survey summaries.
            </li>
            <li>
              Survey records are linked to fieldwork blocks using the cleaned cluster variable and the
              corrected block-coordinate file.
            </li>
            <li>
              Block points are fieldwork anchors. They are not household locations.
            </li>
            <li>
              Ward 3 TS block anchors are retained as Ward 3 according to the sampling design, even
              though their coordinate anchors are flagged internally against the GIS ward join.
            </li>
            <li>
              Small counts are suppressed or shown as broad count bands. Sensitive indicators stay at
              safer levels of aggregation.
            </li>
            <li>
              The participatory resources layer shows places named in workshop mapping. It is local
              knowledge data, not an independently verified infrastructure register.
            </li>
            <li>
              The interface shows patterns among surveyed participants in selected wards and blocks.
              It does not claim to map every migrant, every route, or every resource in Musina.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
