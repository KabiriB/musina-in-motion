import { AlertTriangle, CheckCircle2, EyeOff, MapPin, ShieldCheck } from 'lucide-react';
import { formatMonths, formatNumber, formatPercent } from '../utils/formatters.js';

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
        <span>Broad non-sensitive block summaries are shown. Sensitive indicators remain ward-level only.</span>
      </div>
    );
  }

  return (
    <div className="privacy-note restricted">
      <EyeOff size={17} />
      <span>Composition is suppressed for this small block. The map keeps only location and count-band information.</span>
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
          <p className="panel-copy">
            Click a block point to view presentation-safe summaries. The map displays block anchors,
            not households, routes, names, or respondent records.
          </p>
        </div>
        <div className="panel-section">
          <span className="status-pill">
            <CheckCircle2 size={16} /> Privacy-first display
          </span>
          <p className="panel-copy">
            Small blocks and sensitive combinations are deliberately limited. Exact respondent-level
            information stays outside the interface.
          </p>
        </div>
      </aside>
    );
  }

  const isMismatch = props.ward_match_status !== 'matched';
  const canShowBroad = props.privacy_class === 'broad_block_summaries_allowed';
  const typology = props.cluster_typology ?? 'Block';

  return (
    <aside className="side-panel">
      <div className="panel-hero selected">
        <div className="selected-topline">
          <span className={`typology-badge ${typologyClass(typology)}`}>{typology}</span>
          <span className="ward-badge">Ward {props.display_ward}</span>
        </div>
        <p className="panel-kicker">Selected block</p>
        <h3 className="panel-title">{props.block_anchor}</h3>
        <p className="panel-copy">
          Displayed as a block-level fieldwork anchor. No household locations are shown.
        </p>
      </div>

      <div className="panel-section count-section">
        <p className="panel-kicker">Presentation-safe count</p>
        <div className="count-band-card">
          <span className="count-band-value">{props.respondent_count_band}</span>
          <span className="count-band-label">respondents in display band</span>
        </div>
        <div className="detail-list compact">
          <DetailRow label="Internal exact count" value={formatNumber(props.respondent_n)} quiet />
          <DetailRow label="Micro-clusters underneath" value={formatNumber(props.micro_cluster_n)} quiet />
        </div>
        <PrivacyMessage props={props} />
      </div>

      <div className="panel-section">
        <p className="panel-kicker">Boundary QA</p>
        <span className={`status-pill ${isMismatch ? 'warning' : ''}`}>
          {isMismatch ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {isMismatch ? 'Fieldwork ward retained' : 'Ward boundary match'}
        </span>
        {isMismatch && (
          <p className="panel-copy small-copy">
            The point falls in a different official polygon, but the block remains assigned according
            to the sampling design and team confirmation.
          </p>
        )}
      </div>

      {canShowBroad ? (
        <>
          <div className="panel-section">
            <p className="panel-kicker">Mobility signals</p>
            <div className="detail-list">
              <DetailRow label="Permanent here" value={formatPercent(props.permanent_yes_pct_valid_safe)} />
              <DetailRow label="Non-permanent" value={formatPercent(props.non_permanent_pct_valid_safe)} />
              <DetailRow label="Median recent move duration" value={formatMonths(props.duration_recent_move_median_months_safe)} />
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
          <p className="panel-kicker">Suppressed block summary</p>
          <h4>Composition hidden</h4>
          <p className="panel-copy">
            This block is too small for safe composition display. Use ward-level summaries for broader
            interpretation.
          </p>
        </div>
      )}

      <div className="panel-section">
        <p className="panel-kicker">Map note</p>
        <p className="panel-copy">
          <MapPin size={15} style={{ verticalAlign: 'text-bottom' }} /> {props.display_summary_note}
        </p>
      </div>
    </aside>
  );
}
