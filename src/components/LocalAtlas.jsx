import { useState } from 'react';
import AtlasMap from './AtlasMap.jsx';
import BlockPanel from './BlockPanel.jsx';
import SectionHeader from './SectionHeader.jsx';
import { ShieldCheck } from 'lucide-react';

export default function LocalAtlas({ wardsGeojson, blocksGeojson }) {
  const [selectedBlock, setSelectedBlock] = useState(null);

  return (
    <section className="section" id="local-atlas">
      <SectionHeader kicker="Local survey geography" title="Wards, blocks, and fieldwork anchors">
        This map shows where the study met Musina. The ward outlines are official municipal
        boundaries. The coloured circles are fieldwork block anchors, grouped by the kind of place
        they represent: trade, farm, township, and residential areas.
      </SectionHeader>

      <div className="atlas-privacy-banner">
        <ShieldCheck size={18} />
        <p>
          <strong>Privacy rule:</strong> the circles are not people or households. They are broad block
          anchors. Small blocks are shown cautiously, and sensitive indicators stay out of the block map.
        </p>
      </div>

      <div className="atlas-shell">
        <AtlasMap
          wardsGeojson={wardsGeojson}
          blocksGeojson={blocksGeojson}
          selectedBlock={selectedBlock}
          onSelectBlock={setSelectedBlock}
        />
        <BlockPanel selectedBlock={selectedBlock} />
      </div>
    </section>
  );
}
