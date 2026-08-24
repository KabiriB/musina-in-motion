import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero({ metadata }) {
  const analyzableN = metadata?.base_analyzable_n ?? 629;
  const blockCount = metadata?.block_anchor_n ?? 16;
  const wardCount = metadata?.ward_n ?? 6;

  return (
    <section className="hero" id="opening">
      <div>
        <p className="eyebrow">GEMMS · spatial interface rebuild</p>
        <h1>Musina in Motion</h1>
        <p className="hero-lede">
          A spatial story of movement, work, settlement, and everyday access in a South African
          border town. The interface follows Musina across three scales: regional connections,
          local survey blocks, and the resources people use to navigate daily life.
        </p>
        <div className="hero-actions">
          <a className="button-primary" href="#regional-field">
            Open regional field <ArrowRight size={18} />
          </a>
          <a className="button-secondary" href="#methods">
            <ShieldCheck size={18} /> View data honesty note
          </a>
        </div>
      </div>

      <aside className="hero-card" aria-label="Project summary card">
        <div className="hero-map-abstract" aria-hidden="true" />
        <div className="hero-card-content">
          <h2>A field atlas for reading place carefully.</h2>
          <p>
            The app shows patterns by ward, block, and resource landscape. It never maps
            household locations or individual respondent traces.
          </p>
        </div>
      </aside>

      <div className="metric-grid" style={{ gridColumn: '1 / -1' }} aria-label="Core data counts">
        <div className="metric-card">
          <p className="metric-label">Base analyzable observations</p>
          <p className="metric-value">{analyzableN}</p>
          <p className="metric-note">Cleaned and QA-checked survey base.</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Survey block anchors</p>
          <p className="metric-value">{blockCount}</p>
          <p className="metric-note">Mapped as broad fieldwork anchors.</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Selected wards</p>
          <p className="metric-value">{wardCount}</p>
          <p className="metric-note">The study's selected Musina wards.</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Household-level mapping</p>
          <p className="metric-value">No</p>
          <p className="metric-note">People remain off the map.</p>
        </div>
      </div>
    </section>
  );
}
