export default function Header({ mode = 'survey' }) {
  const surveyLinks = [
    ['Opening', '#opening'],
    ['Regional field', '#regional-field'],
    ['Local atlas', '#local-atlas'],
    ['Infrastructure', '#infrastructure'],
    ['Resources', '#participatory-resources'],
    ['Ward ecology', '#ward-ecology'],
    ['Methods', '#methods'],
  ];

  return (
    <header className="site-header">
      <div className="header-inner header-inner--primary">
        <a className="brand-lockup brand-lockup--link" href="./" aria-label="Musina in Motion home">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <p className="brand-title">Musina in Motion</p>
            <p className="brand-subtitle">Survey atlas + narrated journeys</p>
          </div>
        </a>
        <nav className="nav-links" aria-label="Project pages">
          <a className="nav-link" href="./">Home</a>
          <a className={`nav-link ${mode === 'survey' ? 'nav-link--active' : ''}`} href="./survey.html">Survey interface</a>
          <a className={`nav-link ${mode === 'journeys' ? 'nav-link--active' : ''}`} href="./journeys.html">Narrated journeys</a>
        </nav>
      </div>
      {mode === 'survey' && (
        <div className="header-subnav-wrap">
          <nav className="header-subnav" aria-label="Survey interface sections">
            {surveyLinks.map(([label, href]) => (
              <a key={href} className="subnav-link" href={href}>{label}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
