import SectionHeader from './SectionHeader.jsx';
import { formatNumber, formatPercent } from '../utils/formatters.js';

function WardCard({ ward }) {
  const wardNumber = ward.display_ward ?? ward.WardNo ?? ward.ward_num;
  return (
    <article className="ward-card">
      <h3>Ward {wardNumber}</h3>
      <p>{ward.cluster_typologies} fieldwork context · {formatNumber(ward.block_anchor_n)} block anchors in the surveyed geography.</p>
      <div className="ward-card-stats">
        <div className="small-stat"><span>Survey sample</span><strong>{formatNumber(ward.respondent_n)}</strong></div>
        <div className="small-stat"><span>Non-permanent</span><strong>{formatPercent(ward.non_permanent_pct_valid)}</strong></div>
        <div className="small-stat"><span>Born in Zimbabwe</span><strong>{formatPercent(ward.birth_zimbabwe_pct)}</strong></div>
        <div className="small-stat"><span>Cross-border at least yearly</span><strong>{formatPercent(ward.cross_border_at_least_yearly_pct_valid)}</strong></div>
      </div>
    </article>
  );
}

export default function WardEcology({ wardSummary }) {
  const wards = [...(wardSummary ?? [])].sort((a, b) => Number(a.display_ward ?? a.WardNo ?? a.ward_num) - Number(b.display_ward ?? b.WardNo ?? b.ward_num));
  return (
    <section className="section" id="ward-ecology">
      <SectionHeader kicker="Local mobility configurations" title="One town, different combinations of settlement and circulation">
        Ward-level summaries show how permanence and cross-border circulation vary across the selected study geography. These are configurations among surveyed participants, not fixed social types or labels for every resident of a ward.
      </SectionHeader>
      <div className="ward-grid">
        {wards.map((ward, index) => {
          const wardKey = ward.display_ward ?? ward.WardNo ?? ward.ward_num ?? index;
          return <WardCard key={`ward-${wardKey}-${index}`} ward={ward} />;
        })}
      </div>
    </section>
  );
}
