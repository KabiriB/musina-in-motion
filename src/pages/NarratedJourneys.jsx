import { useCallback, useMemo, useState } from 'react';
import { BookOpenText, Compass, MapPinned, Route, ShieldCheck } from 'lucide-react';
import Header from '../components/Header.jsx';
import JourneyMap from '../components/JourneyMap.jsx';
import { journeyStories, journeyStoryMeta } from '../data/journeyStories.js';

const stopTypeLabels = {
  origin: 'Origin',
  transit: 'Transit / stop',
  border: 'Border / crossing',
  work: 'Work',
  arrival: 'Arrival',
  settlement: 'Settlement',
};

function StatusBadge({ status }) {
  return (
    <span className={`journey-status journey-status--${status.replaceAll(' ', '-')}`}>
      {status}
    </span>
  );
}

export default function NarratedJourneys() {
  const [selectedStoryId, setSelectedStoryId] = useState('MAP267');
  const [activeStopOrder, setActiveStopOrder] = useState(null);

  const selectedStory = useMemo(
    () => journeyStories.find((story) => story.id === selectedStoryId) ?? journeyStories[0],
    [selectedStoryId],
  );

  const fullCount = journeyStories.filter((story) => story.status === 'full narrative').length;
  const sketchCount = journeyStories.length - fullCount;

  const selectStory = useCallback((storyId) => {
    setSelectedStoryId(storyId);
    setActiveStopOrder(null);
  }, []);

  const selectStop = useCallback((order) => {
    setActiveStopOrder(order);
  }, []);

  return (
    <div className="app-shell journeys-page">
      <Header mode="journeys" />
      <main className="main-content journeys-main">
        <section className="journeys-hero">
          <div>
            <p className="eyebrow">Selected in-depth interviews · qualitative route reader</p>
            <h1>Narrated Journeys</h1>
            <p className="journeys-lede">{journeyStoryMeta.readingNote}</p>
          </div>
          <aside className="journeys-ethics-card">
            <ShieldCheck size={22} />
            <h2>How to read these maps</h2>
            <p>{journeyStoryMeta.governanceNote}</p>
          </aside>
        </section>

        <section className="journey-metrics" aria-label="Journey reader status">
          <article><MapPinned size={20} /><strong>{journeyStories.length}</strong><span>published journey maps</span></article>
          <article><BookOpenText size={20} /><strong>{fullCount}</strong><span>full narrative</span></article>
          <article><Route size={20} /><strong>{sketchCount}</strong><span>route sketches</span></article>
          <article><Compass size={20} /><strong>Stop-by-stop</strong><span>reading structure</span></article>
        </section>

        <section className="journey-workspace">
          <aside className="journey-story-browser" aria-label="Journey stories">
            <div className="journey-panel-heading">
              <p className="section-kicker">Journey index</p>
              <h2>Select a route</h2>
            </div>
            <div className="journey-story-list">
              {journeyStories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  className={`journey-story-card ${story.id === selectedStory.id ? 'is-active' : ''}`}
                  onClick={() => selectStory(story.id)}
                >
                  <div className="journey-story-card-top">
                    <span>{story.id}</span>
                    <StatusBadge status={story.status} />
                  </div>
                  <h3>{story.title}</h3>
                  <p>{story.routeLabel}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="journey-stage">
            <JourneyMap
              story={selectedStory}
              activeStopOrder={activeStopOrder}
              onStopSelect={selectStop}
            />

            <div className="journey-reading-grid">
              <article className="journey-story-summary">
                <div className="journey-summary-topline">
                  <span className="journey-id">{selectedStory.id}</span>
                  <StatusBadge status={selectedStory.status} />
                </div>
                <h2>{selectedStory.title}</h2>
                <p className="journey-subtitle">{selectedStory.subtitle}</p>
                <div className="journey-route-label">{selectedStory.routeLabel}</div>
                <div className="journey-theme-chips">
                  {selectedStory.themes.map((theme) => <span key={theme}>{theme}</span>)}
                </div>
                <div className="journey-interpretation">
                  <p className="section-kicker">Interpretive note</p>
                  <p>{selectedStory.interpretationNote}</p>
                </div>
                <div className={`journey-completion-note ${selectedStory.needsNarration ? 'needs-work' : 'is-full'}`}>
                  {selectedStory.needsNarration
                    ? 'This story currently preserves the route sequence but still needs fuller interview narration before final publication.'
                    : 'This story contains richer stop-by-stop interview narration and serves as the current model for completing the remaining routes.'}
                </div>
              </article>

              <aside className="journey-timeline-panel">
                <div className="journey-panel-heading">
                  <p className="section-kicker">Stop-by-stop reading</p>
                  <h2>{selectedStory.stops.length} named stops</h2>
                </div>
                <div className="journey-timeline">
                  {selectedStory.stops.map((stop) => (
                    <button
                      type="button"
                      key={`${selectedStory.id}-${stop.order}`}
                      className={`journey-stop ${activeStopOrder === stop.order ? 'is-active' : ''}`}
                      onClick={() => selectStop(stop.order)}
                    >
                      <span className="journey-stop-number">{stop.order}</span>
                      <span className="journey-stop-copy">
                        <strong>{stop.name}</strong>
                        <small>{stopTypeLabels[stop.type] ?? stop.type}</small>
                        <p>{stop.narrative}</p>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="journey-method-grid" id="method">
          <article className="journey-method-card">
            <p className="section-kicker">Method note</p>
            <h2>Interpretive route geographies, not traces.</h2>
            <p>
              Each route is reconstructed from the supplied interview story-map export. Named places
              are connected to make the sequence legible. The line between stops is a visual reading
              device: it does not claim the participant travelled along that exact path, road, or GPS trace.
            </p>
            <p>
              Story content is stored separately in <code>src/data/journeyStories.js</code> so the team
              can revise narrative text without editing map rendering logic.
            </p>
          </article>

          <article className="journey-method-card journey-method-card--unfinished">
            <p className="section-kicker">What still needs narration</p>
            <h2>Eight routes remain deliberately incomplete.</h2>
            <ul>
              <li>Add fuller interview-derived narration to the eight route-sketch stories.</li>
              <li>Verify all place names and coordinates before the qualitative section is treated as final.</li>
              <li>Confirm whether participant pseudonyms should ever appear; IDs remain the safer default.</li>
              <li>Review theme chips and interpretation notes against the completed transcripts.</li>
              <li>Confirm whether MAP460 should join the published reader; it is retained as a source file but not currently displayed.</li>
            </ul>
          </article>
        </section>
      </main>
      <footer className="footer">Musina in Motion · Narrated Journeys · selected interview route maps.</footer>
    </div>
  );
}
