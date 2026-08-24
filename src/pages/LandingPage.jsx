import { ArrowRight, BookOpenText, MapPinned, ShieldCheck } from 'lucide-react';
import Header from '../components/Header.jsx';

export default function LandingPage() {
  return (
    <div className="app-shell">
      <Header mode="home" />
      <main className="main-content landing-main">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="eyebrow">GEMMS · Musina field atlas</p>
            <h1>One town. Two ways of reading movement.</h1>
            <p className="landing-lede">
              The survey interface shows patterns across Musina. Narrated Journeys follows selected
              interview routes as lived sequences of origin, stop points, border crossing, delay,
              work, risk, waiting, settlement, and adaptation.
            </p>
          </div>
          <aside className="landing-principle-card">
            <ShieldCheck size={22} />
            <p>
              The two views are intentionally distinct. Aggregate survey patterns are not used to
              claim individual experience, and interview journeys are not presented as statistically
              representative.
            </p>
          </aside>
        </section>

        <section className="landing-choice-grid" aria-label="Choose an interface">
          <a className="landing-choice-card landing-choice-card--survey" href="./survey.html">
            <div className="landing-choice-icon"><MapPinned size={30} /></div>
            <div>
              <p className="choice-kicker">Quantitative spatial view</p>
              <h2>Explore Survey Interface</h2>
              <p>
                Read regional mobility connections, ward and block patterns, infrastructure,
                participatory resources, and ward ecology from the QA-checked survey data spine.
              </p>
            </div>
            <span className="choice-action">Open survey atlas <ArrowRight size={18} /></span>
          </a>

          <a className="landing-choice-card landing-choice-card--journeys" href="./journeys.html">
            <div className="landing-choice-icon"><BookOpenText size={30} /></div>
            <div>
              <p className="choice-kicker">Qualitative route reader</p>
              <h2>Read Narrated Journeys</h2>
              <p>
                Move through selected interview routes stop by stop. One journey currently contains
                a fuller narrative; the remaining published routes are clearly marked as sketches.
              </p>
            </div>
            <span className="choice-action">Open journey reader <ArrowRight size={18} /></span>
          </a>
        </section>

        <section className="landing-context-grid">
          <article>
            <p className="section-kicker">Why two views?</p>
            <h2>Pattern and sequence answer different questions.</h2>
          </article>
          <article>
            <p>
              The survey can show where patterns cluster and how conditions vary across the study
              geography. The interviews can show how movement unfolds through time and place. Keeping
              them connected but analytically distinct makes the interface more honest and more useful.
            </p>
          </article>
        </section>
      </main>
      <footer className="footer">Musina in Motion · research interface · team review build.</footer>
    </div>
  );
}
