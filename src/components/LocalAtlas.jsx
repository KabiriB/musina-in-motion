import { useState } from 'react';
import AtlasMap from './AtlasMap.jsx';
import BlockPanel from './BlockPanel.jsx';
import SectionHeader from './SectionHeader.jsx';
import { ShieldCheck } from 'lucide-react';

export default function LocalAtlas({ wardsGeojson, blocksGeojson }) {
  const [selectedBlock, setSelectedBlock] = useState(null);

  return (
    <section className="section" id="local-atlas">
      <SectionHeader kicker="Local survey geography" title="Where the survey met Musina">
        Official ward boundaries provide the administrative frame; coloured circles show broad fieldwork block anchors across trade, farm, township and residential contexts. The map locates the sample without pretending that a block point is a household or a neighbourhood boundary.
      </SectionHeader>

      <div className="atlas-privacy-banner">
        <ShieldCheck size={18} />
        <p><strong>Privacy rule:</strong> block points are fieldwork anchors, not people or households. Small blocks are displayed cautiously, and sensitive combinations stay at safer levels of aggregation.</p>
      </div>

      <div className="atlas-shell">
        <AtlasMap wardsGeojson={wardsGeojson} blocksGeojson={blocksGeojson} selectedBlock={selectedBlock} onSelectBlock={setSelectedBlock} />
        <BlockPanel selectedBlock={selectedBlock} />
      </div>
    </section>
  );
}
