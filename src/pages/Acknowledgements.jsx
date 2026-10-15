import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Header from '../components/Header.jsx';

export default function Acknowledgements() {
  return (
    <div className="app-shell">
      <Header mode="acknowledgements" />
      <main className="main-content ack-main" id="main-content">
        <section className="ack-intro" aria-labelledby="ack-title">
          <p className="section-kicker">Musina in Motion · Research and support</p>
          <h1 id="ack-title">Acknowledgements<span className="ack-period">.</span></h1>
          <p className="ack-lede">The research programme, institutions and funding behind this spatial atlas.</p>
        </section>

        <section className="ack-project" aria-labelledby="ack-programme-heading">
          <div className="ack-logo-panel">
            <img
              className="ack-main-logo"
              src="./brand/gemms-horizontal.png"
              alt="GEMMS — Gendered violence and poor mental health among migrants in precarious situations"
            />
          </div>
          <div className="ack-programme-copy">
            <p className="ack-index">01 / Research programme</p>
            <h2 id="ack-programme-heading">The work behind the maps.</h2>
            <p>The analysis presented in <em>Musina in Motion</em> was supported by the <strong>Gendered Violence and Poor Mental Health among Migrants in Precarious Situations Global Health Research Group (GEMMS)</strong>.</p>
          </div>
        </section>

        <section className="ack-funding" aria-labelledby="ack-funding-heading">
          <div className="ack-funding-label">
            <p className="ack-index">02 / Funding and leadership</p>
            <h2 id="ack-funding-heading">Research support</h2>
            <span className="ack-grant">NIHR134629</span>
          </div>
          <div className="ack-funding-body">
            <p>GEMMS is funded by the <strong>National Institute for Health and Care Research (NIHR Global Health Research; grant NIHR134629)</strong>, using UK aid from the UK Government to support global health research.</p>
            <p>The funding was awarded to the <strong>University of Essex, UK</strong> (lead organisation; Principal Investigator: <strong>Prof Anuj Kapilashrami</strong>; Co-Director: <strong>Prof Jo Vearey, University of the Witwatersrand</strong>).</p>
            <div className="ack-disclaimer">
              <p className="ack-index">Funding disclaimer</p>
              <p>The views expressed in this publication are those of the author(s) and not necessarily those of the NIHR or the UK Government.</p>
            </div>
          </div>
        </section>

        <nav className="ack-outro" aria-label="Continue exploring Musina in Motion">
          <span>Explore the evidence again</span>
          <div>
            <a href="./"><ArrowLeft size={16} aria-hidden="true" /> Back to the atlas</a>
            <a href="./survey.html">Survey Atlas <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </nav>
      </main>
      <footer className="footer">Musina in Motion · GEMMS spatial research atlas · Grant NIHR134629</footer>
    </div>
  );
}
