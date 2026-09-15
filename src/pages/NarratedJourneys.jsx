import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpenText,
  Compass,
  MapPinned,
  Route,
  ShieldCheck,
} from 'lucide-react';
import Header from '../components/Header.jsx';
import JourneyMap from '../components/JourneyMap.jsx';
import { journeyStories } from '../data/journeyStories.js';
import { siteCopy } from '../content/siteCopy.js';

const roleLabels = {
  origin: 'Origin',
  transit: 'Transit / stop',
  border: 'Border crossing',
  work: 'Work / preparation',
  arrival: 'First arrival',
  return: 'Return',
  settlement: 'Settlement',
};

function countryCount(stories) {
  const countryByStory = {
    MAP159: 'Zimbabwe',
    MAP267: 'Malawi',
    MAP308: 'South Africa',
    MAP434: 'Zimbabwe',
    MAP446: 'Zimbabwe',
    MAP451: 'Zimbabwe',
    MAP460: 'DRC',
    MAP514: 'Zimbabwe',
    MAP612: 'Burundi',
    MAP617: 'Zimbabwe',
  };
  return new Set(stories.map((story) => countryByStory[story.sourceId]).filter(Boolean)).size;
}

function routeSummary(story) {
  const first = story.stops[0]?.name ?? '';
  const last = story.stops.at(-1)?.name ?? '';
  const intermediate = story.stops.slice(1, -1);
  if (!intermediate.length) return `${first} → ${last}`;
  const via = intermediate.length === 1 ? intermediate[0].name : intermediate.at(-1).name;
  return `${first} → ${last} · via ${via}`;
}

function StoryCard({ story, active, onSelect }) {
  return (
    <button
      type="button"
      className={`journey-story-card ${active ? 'is-active' : ''}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="journey-person-name">{story.name}</span>
      <strong>{routeSummary(story)}</strong>
      <small>{story.stops.length} narrated stops</small>
    </button>
  );
}

function StopScene({ story, stop, registerRef, onActivate }) {
  const intended = story.intendedDestination?.fromStopOrder === stop.order
    ? story.intendedDestination
    : null;

  return (
    <section
      ref={registerRef(stop.order)}
      className="journey-scroll-scene"
      data-stop-order={stop.order}
      tabIndex={-1}
      onFocus={() => onActivate(stop.order)}
    >
      <article className={`journey-stop-card ${(() => {
        const longestWord = Math.max(...stop.name.split(/\s+/).map((word) => word.length));
        if (stop.name.length >= 18 || longestWord >= 12) return 'is-very-long-title';
        if (stop.name.length >= 10 || longestWord >= 9) return 'is-long-title';
        return '';
      })()}`}>
        <div className="journey-stop-card-topline">
          <span>{String(stop.order).padStart(2, '0')}</span>
          <span>{String(story.stops.length).padStart(2, '0')}</span>
        </div>
        <p className="journey-stop-role">{stop.label ?? roleLabels[stop.role] ?? stop.role}</p>
        <h2>{stop.name}</h2>
        <p className="journey-stop-narrative">{stop.narrative}</p>

        {intended && (
          <div className="journey-intended-inline">
            <span className="journey-intended-line-sample" aria-hidden="true" />
            <div>
              <p>{intended.label}</p>
              <strong>{intended.name}</strong>
              <span>{intended.narrative}</span>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

export default function NarratedJourneys() {
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [activeStopOrder, setActiveStopOrder] = useState(null);
  const copy = siteCopy.journeys;
  const chapterRefs = useRef(new Map());
  const scrollyRef = useRef(null);

  const selectedStory = useMemo(
    () => journeyStories.find((story) => story.sourceId === selectedStoryId) ?? null,
    [selectedStoryId],
  );

  const registerRef = useCallback((order) => (node) => {
    if (node) chapterRefs.current.set(order, node);
    else chapterRefs.current.delete(order);
  }, []);

  const jumpToStop = useCallback((order, behaviour = 'smooth') => {
    setActiveStopOrder(order);
    chapterRefs.current.get(order)?.scrollIntoView({
      behaviour,
      behavior: behaviour,
      block: 'center',
    });
  }, []);

  const selectStory = useCallback((storyId) => {
    const story = journeyStories.find((item) => item.sourceId === storyId);
    chapterRefs.current.clear();
    setSelectedStoryId(storyId);
    setActiveStopOrder(story?.stops?.[0]?.order ?? null);
    requestAnimationFrame(() => {
      scrollyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const showOverview = useCallback(() => {
    chapterRefs.current.clear();
    setSelectedStoryId(null);
    setActiveStopOrder(null);
    requestAnimationFrame(() => {
      scrollyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  useEffect(() => {
    if (!selectedStory) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!candidates.length) return;
        const order = Number(candidates[0].target.dataset.stopOrder);
        if (Number.isFinite(order)) setActiveStopOrder(order);
      },
      {
        root: null,
        rootMargin: '-28% 0px -48% 0px',
        threshold: [0.05, 0.2, 0.4, 0.65],
      },
    );

    chapterRefs.current.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [selectedStory?.sourceId]);

  return (
    <div className="app-shell journeys-page">
      <Header mode="journeys" />
      <main className="main-content journeys-main">
        <section className="journeys-hero">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="journeys-lede">{copy.lede}</p>
          </div>
          <aside className="journeys-ethics-card">
            <ShieldCheck size={22} />
            <h2>How to read these maps</h2>
            <p>{copy.governance}</p>
          </aside>
        </section>

        <section className="journey-metrics" aria-label="Journey atlas summary">
          <article><MapPinned size={20} /><strong>{journeyStories.length}</strong><span>selected journeys</span></article>
          <article><Compass size={20} /><strong>{countryCount(journeyStories)}</strong><span>countries of origin</span></article>
          <article><BookOpenText size={20} /><strong>{journeyStories.reduce((sum, story) => sum + story.stops.length, 0)}</strong><span>narrated stops</span></article>
          <article><Route size={20} /><strong>Musina</strong><span>shared point of convergence</span></article>
        </section>

        <section className="journey-editorial-bridge">
          <p className="section-kicker">Pattern → sequence</p>
          <h2>{copy.bridge}</h2>
          <p>{copy.bridgeBody}</p>
        </section>

        <section className="journey-workspace" ref={scrollyRef}>
          <aside className="journey-story-browser" aria-label="Journey stories">
            <div className="journey-panel-heading">
              <p className="section-kicker">Journey index</p>
              <div className="journey-index-title-row">
                <h2>{selectedStory ? 'Choose another journey' : 'Choose a journey'}</h2>
                {selectedStory && (
                  <button type="button" className="journey-overview-button" onClick={showOverview}>Overview</button>
                )}
              </div>
            </div>
            <div className="journey-story-list">
              {journeyStories.map((story) => (
                <StoryCard
                  key={story.sourceId}
                  story={story}
                  active={story.sourceId === selectedStory?.sourceId}
                  onSelect={() => selectStory(story.sourceId)}
                />
              ))}
            </div>
          </aside>

          <div className="journey-stage">
            {!selectedStory ? (
              <>
                <JourneyMap
                  stories={journeyStories}
                  story={null}
                  activeStopOrder={null}
                  onStopSelect={() => {}}
                />
                <section className="journey-overview-copy">
                  <div>
                    <p className="section-kicker">Ten accounts · one border town</p>
                    <h2>Select a name to enter the journey.</h2>
                  </div>
                  <p>{copy.overviewBody}</p>
                </section>
              </>
            ) : (
              <div className="journey-scrolly-layout">
                <div className="journey-map-sticky">
                  <JourneyMap
                    stories={journeyStories}
                    story={selectedStory}
                    activeStopOrder={activeStopOrder ?? selectedStory.stops[0].order}
                    onStopSelect={(order) => jumpToStop(order)}
                  />
                </div>

                <div className="journey-scroll-rail" aria-label={`${selectedStory.name}'s narrated journey`}>
                  <section className="journey-story-intro-scene">
                    <article className="journey-story-intro-card">
                      <p className="journey-person-kicker">{selectedStory.name}</p>
                      <h2>{selectedStory.title}</h2>
                      <p>{selectedStory.subtitle}</p>
                      <div className="journey-route-label">{selectedStory.routeLabel}</div>
                      <div className="journey-story-meta-line">
                        <span>{selectedStory.stops.length} stops</span>
                        <span>Scroll to follow the journey ↓</span>
                      </div>
                    </article>
                  </section>

                  {selectedStory.stops.map((stop) => (
                    <StopScene
                      key={`${selectedStory.sourceId}-${stop.order}`}
                      story={selectedStory}
                      stop={stop}
                      registerRef={registerRef}
                      onActivate={setActiveStopOrder}
                    />
                  ))}

                  <section className="journey-story-end-scene">
                    <article className="journey-story-end-card">
                      <p className="section-kicker">Journey complete</p>
                      <h2>{selectedStory.name} in sequence.</h2>
                      <p>
                        You have reached the end of this narrated sequence. Return to the first stop,
                        or choose another journey to compare how movement unfolds through different
                        places and stages.
                      </p>
                      <button type="button" onClick={() => jumpToStop(selectedStory.stops[0].order)}>
                        Return to first stop
                      </button>
                    </article>
                  </section>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="journey-method-grid" id="method">
          <article className="journey-method-card">
            <p className="section-kicker">Method note</p>
            <h2>Geographically anchored, interpretive routes.</h2>
            <p>
              Named stops use mapped place coordinates from the interview materials. Lines connect
              narrated places to make the sequence legible; they do not represent exact roads, GPS
              tracks or a complete record of every movement between stops.
            </p>
          </article>
          <article className="journey-method-card">
            <p className="section-kicker">Mixed evidence</p>
            <h2>Sequence and pattern remain analytically distinct.</h2>
            <p>
              The survey atlas describes broader spatial patterns among participants. These selected interview accounts show how movement is narrated through time and place. Differences between survey responses and interview accounts are treated as differences between instruments.
            </p>
          </article>
        </section>
      </main>
      <footer className="footer">{copy.footer}</footer>
    </div>
  );
}
