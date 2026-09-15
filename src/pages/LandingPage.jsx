import { ArrowRight, BookOpenText, MapPinned, ShieldCheck } from 'lucide-react';
import Header from '../components/Header.jsx';
import { siteCopy } from '../content/siteCopy.js';

export default function LandingPage() {
  const copy = siteCopy.landing;

  return (
    <div className="app-shell">
      <Header mode="home" />
      <main className="main-content landing-main">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="landing-lede">{copy.lede}</p>
          </div>
          <aside className="landing-principle-card">
            <ShieldCheck size={22} />
            <p>{copy.principle}</p>
          </aside>
        </section>

        <section className="landing-choice-grid" aria-label="Choose an interface">
          <a className="landing-choice-card landing-choice-card--survey" href="./survey.html">
            <div className="landing-choice-icon"><MapPinned size={30} /></div>
            <div>
              <p className="choice-kicker">{copy.surveyKicker}</p>
              <h2>{copy.surveyTitle}</h2>
              <p>{copy.surveyDescription}</p>
            </div>
            <span className="choice-action">Open survey atlas <ArrowRight size={18} /></span>
          </a>

          <a className="landing-choice-card landing-choice-card--journeys" href="./journeys.html">
            <div className="landing-choice-icon"><BookOpenText size={30} /></div>
            <div>
              <p className="choice-kicker">{copy.journeysKicker}</p>
              <h2>{copy.journeysTitle}</h2>
              <p>{copy.journeysDescription}</p>
            </div>
            <span className="choice-action">Open journey atlas <ArrowRight size={18} /></span>
          </a>
        </section>

        <section className="landing-context-grid">
          <article>
            <p className="section-kicker">Why two views?</p>
            <h2>{copy.contextTitle}</h2>
          </article>
          <article><p>{copy.contextBody}</p></article>
        </section>
      </main>
      <footer className="footer">{copy.footer}</footer>
    </div>
  );
}
