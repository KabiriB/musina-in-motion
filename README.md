# Musina in Motion

A single GitHub Pages-ready Vite/React repository containing two connected research interfaces:

- **Survey Interface** — quantitative/spatial patterns across Musina.
- **Narrated Journeys** — selected qualitative interview routes read stop by stop.

The repository opens on a landing page that keeps the two analytical modes connected but distinct.

## v1.2 map-rendering hardening

The Narrated Journeys map now uses the same **MapLibre GL** rendering engine already used by the main Musina survey interface. This replaces the earlier Leaflet implementation after local QA showed persistent mixed/blocky raster-tile rendering in Chrome on Windows. The route reader still uses detailed online street/atlas basemaps, but story changes now update only the route and markers; they do not repeatedly invalidate/refit the map during tile loading.

The stop-by-stop panel also expands naturally with the page rather than creating a second nested scrollbar.

## Pages

- `index.html` — project landing page
- `survey.html` — main Musina survey/spatial interface
- `journeys.html` — Narrated Journeys qualitative route reader

## Research and governance note

The survey interface presents aggregate patterns from the QA-checked Musina data spine. It does not show household locations or individual respondent traces.

The Narrated Journeys are interpretive journey maps based on selected in-depth interviews. They are not representative statistical claims and they are not individual respondent traces. Place names are used to show broad route geographies; no household-level locations are shown.

Route lines connect named stops to make journey sequence legible. They should not be read as exact roads, GPS tracks, or precise movement paths.

## Narrated Journeys status

The published reader currently contains nine routes:

- MAP159 — route sketch
- MAP267 — full narrative
- MAP308 — route sketch
- MAP434 — route sketch
- MAP446 — route sketch
- MAP451 — route sketch
- MAP514 — route sketch
- MAP612 — route sketch
- MAP617 — route sketch

`MAP267` is the only supplied source map that currently contains substantial stop-level interview narration. The other eight published routes preserve route sequences and clearly state that fuller narration still needs to be added.

`MAP460` is also present in Bella's uploaded source-map bundle. It was not part of the previously agreed nine-story reader, so it is flagged in `docs/SOURCE_MAP_AUDIT.md` for team confirmation rather than silently published.

## Editing journey text

Most future qualitative edits should happen in one file:

```text
src/data/journeyStories.js
```

Each story contains:

```text
id
title
subtitle
status
routeLabel
routeType
themes
interpretationNote
needsNarration
sourceFile
stops[]
  order
  name
  type
  latitude
  longitude
  narrative
```

### To update a route sketch

1. Open `src/data/journeyStories.js`.
2. Find the story by ID, for example `MAP159`.
3. Replace the placeholder `narrative` text for each stop with interview-derived narration.
4. Review `themes` and `interpretationNote` against the interview.
5. When the story is genuinely complete, change:

```js
status: "route sketch"
```

to:

```js
status: "full narrative"
```

and change:

```js
needsNarration: true
```

to:

```js
needsNarration: false
```

Do not invent missing interview detail simply to make a route feel complete.

## Editing survey/interface text

Survey page copy is mainly in:

```text
src/components/
src/pages/MainInterface.jsx
```

The existing QA-checked survey data files remain in:

```text
public/data/
```

Do not change the privacy-screened data assets casually. Text changes and narrative changes should normally not require edits to those files.

## Basemap behaviour

Narrated Journeys uses **MapLibre GL 4.7.1**, the same map engine already used by the main survey interface. Detailed online raster basemaps remain available through three in-map choices: Streets, Atlas and Dark.

The hardened implementation includes:

- explicit map height and minimum height
- one stable map instance for the life of the page
- `ResizeObserver` calling MapLibre's `resize()` only when the container changes
- route and marker data updated independently of the basemap
- a single `fitBounds()` pass when the selected story changes
- no repeated tile-load invalidation/refit loop
- basemap request feedback and an immediate alternative-basemap switcher

This specifically addresses the mixed/blocky raster-tile rendering observed in the earlier Leaflet preview on Windows/Chrome.

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite will open the site locally. Test all three pages:

```text
/
/survey.html
/journeys.html
```

For a production build:

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

A deployment workflow is already included at:

```text
.github/workflows/deploy.yml
```

After pushing the repository to GitHub:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `main`, or run the workflow manually from the **Actions** tab.
5. GitHub will build the Vite app and publish the `dist/` folder.

The Vite build uses relative asset paths so the interface can live under a normal GitHub Pages repository URL without hard-coded repository naming.

## Source map audit

A source-map audit is included at `docs/SOURCE_MAP_AUDIT.md`. The raw R/Leaflet exports are intentionally not copied into the deployment repository because they are research-source files and may contain more interview detail than should be published by default. Keep the originals in controlled project storage.

## Current production principle

**Survey patterns show distribution. Narrated journeys show sequence. Neither should be made to claim what the other cannot establish.**
