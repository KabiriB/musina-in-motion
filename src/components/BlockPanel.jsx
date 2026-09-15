import { CheckCircle2, EyeOff, MapPin, ShieldCheck } from 'lucide-react';
import { formatMonths, formatPercent } from '../utils/formatters.js';

function DetailRow({ label, value, quiet = false }) {
  return (
    <div className={`detail-row ${quiet ? 'quiet' : ''}`}>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

function typologyClass(typology) {
  const value = String(typology ?? '').toLowerCase();
  if (value.includes('farm')) return 'farm';
  if (value.includes('township')) return 'township';
  if (value.includes('residential')) return 'residential';
  return 'trade';
}

function PrivacyMessage({ props }) {
  const canShowBroad = props.privacy_class === 'broad_block_summaries_allowed';
  if (canShowBroad) {
    return (
      <div className="privacy-note safe">
        <ShieldCheck size={17} />
        <span>Broad non-sensitive block summaries are shown. Sensitive indicators remain at safer levels of aggregation.</span>
      </div>
    );
  }
  return (
    <div className="privacy-note restricted">
      <EyeOff size={17} />
      <span>Composition is suppressed for this small block. The map retains only location and a broad count band.</span>
    </div>
  );
}

export default function BlockPanel({ selectedBlock }) {
  const props = selectedBlock?.properties;

  if (!props) {
    return (
      <aside className="side-panel empty-state-panel">
        <div className="panel-hero">
          <p className="panel-kicker">Local survey geography</p>
          <h3 className="panel-title">Select a block anchor</h3>
          <p className="panel-copy">Choose a block point to read the spatial summaries available at that level. Block anchors are fieldwork locations, not households or respondent records.</p>
        </div>
        <div className="panel-section">
          <span className="status-pill"><CheckCircle2 size={16} /> Privacy-aware display</span>
          <p className="panel-copy">Small blocks and sensitive combinations are deliberately limited. Respondent-level location and composition remain outside the public atlas.</p>
        </div>
      </aside>
    );
  }

  const canShowBroad = props.privacy_class === 'broad_block_summaries_allowed';
  const typology = props.cluster_typology ?? 'Block';

  return (
    <aside className="side-panel">
      <div className="panel-hero selected">
        <div className="selected-topline">
          <span className={`typology-badge ${typologyClass(typology)}`}>{typology}</span>
          <span className="ward-badge">Ward {props.display_ward}</span>
        </div>
        <p className="panel-kicker">Selected survey block</p>
        <h3 className="panel-title">{props.block_anchor}</h3>
        <p className="panel-copy">A broad fieldwork anchor used to organise local survey summaries. No household locations are shown.</p>
      </div>

      <div className="panel-section count-section">
        <p className="panel-kicker">Displayed sample size</p>
        <div className="count-band-card">
          <span className="count-band-value">{props.respondent_count_band}</span>
          <span className="count-band-label">respondents in broad count band</span>
        </div>
        <PrivacyMessage props={props} />
      </div>

      {canShowBroad ? (
        <>
          <div className="panel-section">
            <p className="panel-kicker">Mobility signals</p>
            <div className="detail-list">
              <DetailRow label="Permanent here" value={formatPercent(props.permanent_yes_pct_valid_safe)} />
              <DetailRow label="Non-permanent" value={formatPercent(props.non_permanent_pct_valid_safe)} />
              <DetailRow label="Median time since recent move" value={formatMonths(props.duration_recent_move_median_months_safe)} />
              <DetailRow label="Crosses border at least yearly" value={formatPercent(props.cross_border_at_least_yearly_pct_valid_safe)} />
              <DetailRow label="Crosses border at least monthly" value={formatPercent(props.cross_border_at_least_monthly_pct_valid_safe)} />
            </div>
          </div>

          <div className="panel-section">
            <p className="panel-kicker">Birthplace and recent origin</p>
            <div className="detail-list">
              <DetailRow label="Born in South Africa" value={formatPercent(props.birth_sa_pct_safe)} />
              <DetailRow label="Born in Zimbabwe" value={formatPercent(props.birth_zimbabwe_pct_safe)} />
              <DetailRow label="Recent origin South Africa" value={formatPercent(props.recent_origin_sa_pct_safe)} />
              <DetailRow label="Recent origin Zimbabwe" value={formatPercent(props.recent_origin_zimbabwe_pct_safe)} />
            </div>
          </div>
        </>
      ) : (
        <div className="panel-section suppression-card">
          <p className="panel-kicker">Limited display</p>
          <h4>Composition hidden</h4>
          <p className="panel-copy">This block is too small for a public composition summary. Use the ward-level patterns for broader interpretation.</p>
        </div>
      )}

      {props.display_summary_note && (
        <div className="panel-section">
          <p className="panel-kicker">Map note</p>
          <p className="panel-copy"><MapPin size={15} style={{ verticalAlign: 'text-bottom' }} /> {props.display_summary_note}</p>
        </div>
      )}
    </aside>
  );
}
