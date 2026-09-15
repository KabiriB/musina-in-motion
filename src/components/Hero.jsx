import { ArrowRight, ShieldCheck } from 'lucide-react';
import { siteCopy } from '../content/siteCopy.js';

export default function Hero({ metadata }) {
  const analyzableN = metadata?.base_analyzable_n ?? 629;
  const blockCount = metadata?.block_anchor_n ?? 16;
  const wardCount = metadata?.ward_n ?? 6;
  const copy = siteCopy.survey;

  return (
    <section className="hero" id="opening">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="hero-lede">{copy.lede}</p>
        <div className="hero-actions">
          <a className="button-primary" href="#regional-field">
            {copy.primaryAction} <ArrowRight size={18} />
          </a>
          <a className="button-secondary" href="#methods">
            <ShieldCheck size={18} /> {copy.secondaryAction}
          </a>
        </div>
      </div>

      <aside className="hero-card" aria-label="Project summary card">
        <div className="hero-map-abstract" aria-hidden="true" />
        <div className="hero-card-content">
          <h2>{copy.cardTitle}</h2>
          <p>{copy.cardBody}</p>
        </div>
      </aside>

      <div className="metric-grid" style={{ gridColumn: '1 / -1' }} aria-label="Core data counts">
        <div className="metric-card">
          <p className="metric-label">{copy.metrics.analyzable}</p>
          <p className="metric-value">{analyzableN}</p>
          <p className="metric-note">{copy.metrics.analyzableNote}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">{copy.metrics.blocks}</p>
          <p className="metric-value">{blockCount}</p>
          <p className="metric-note">{copy.metrics.blocksNote}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">{copy.metrics.wards}</p>
          <p className="metric-value">{wardCount}</p>
          <p className="metric-note">{copy.metrics.wardsNote}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">{copy.metrics.privacy}</p>
          <p className="metric-value">{copy.metrics.privacyValue}</p>
          <p className="metric-note">{copy.metrics.privacyNote}</p>
        </div>
      </div>
    </section>
  );
}
