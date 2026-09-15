# Musina in Motion

**Musina in Motion** is the public-facing spatial atlas for the GEMMS Musina study. It combines two analytically distinct views of mobility:

- **Survey Atlas** — regional mobility geography, local survey geography, service context, participatory resources and ward-level mobility configurations.
- **Narrated Journeys** — ten selected in-depth interview accounts read as geographically anchored, interpretive journey sequences.

The atlas is designed to make spatial structure visible without turning a research sample into a census map, a mapped service into an access claim, or an interview journey into a GPS trace.

## Public pages

- `index.html` — landing page
- `survey.html` — Survey Atlas
- `journeys.html` — Narrated Journeys

## Core production principle

**Survey patterns show distribution. Narrated journeys show sequence. Neither should be made to claim what the other cannot establish.**

The public architecture follows the project rule:

**RAW → CLEAN → SAFE → PUBLIC**

Household locations and individual survey records are not exposed in the interface. Survey block points are broad fieldwork anchors. Small counts and sensitive combinations are suppressed or presented only at safer levels of aggregation.

## Narrated Journeys

The public reader contains ten pseudonymised journeys:

- Michaela — Buhera → Chivhu → Beitbridge → Musina
- Wayne — Blantyre → Nyamapanda → Beitbridge → Johannesburg → Musina
- Munyadziwa — Kakhu → Masea → Makonde → Musina
- Tatenda — Village near Masvingo → Masvingo → Beitbridge → Musina
- Rhoda — Gokwe → Bulawayo → Musina → Tzaneen → Musina, with Cape Town shown separately as an intended destination not reached
- Rudo — Chivi → Beitbridge → Musina
- Morgan — Kivu → Pretoria West → Durban → Musina
- Shingi — Mberengwa → Beitbridge → Musina
- Benjamin — Rumonge → Kigoma → Zambia → Musina
- Arnold — Masvingo → Beitbridge → Musina

Public-facing names use approved pseudonyms. Internal source identifiers remain in `src/data/journeyStories.js` for provenance and maintenance only.

Journey lines connect named places to make narrative sequence legible. They are not exact roads, GPS tracks or complete records of every movement between stops.

## Where to edit content

Routine wording changes should not require map-code changes.

- Shared publication copy: `src/content/siteCopy.js`
- Journey narratives and stop metadata: `src/data/journeyStories.js`
- Publication formatting for workshop resource labels: `src/utils/publicationLabels.js`
- Main survey sections: `src/components/`

Keep technical field names and source-data identifiers stable unless a data rebuild requires changing them.

## Data

Public-safe survey and spatial assets live in:

`public/data/`

Do not casually edit privacy-screened data assets. Text, label and narrative maintenance should normally happen in the source files above rather than in the public data files.

The participatory resource layer deliberately preserves the distinction between the raw workshop wording and the cleaned publication label shown in the interface. Raw workshop names remain in the data; display corrections happen in `src/utils/publicationLabels.js`.

## Mapping stack and external dependency

The interface uses:

- React 18
- Vite 5
- MapLibre GL 4.7
- OpenFreeMap vector styles
- locally stored GeoJSON/JSON for the project evidence layers

The current basemap styles are centralised in one file:

`src/config/mapStyle.js`

At publication, the application uses these style endpoints:

- `https://tiles.openfreemap.org/styles/positron`
- `https://tiles.openfreemap.org/styles/liberty`

No application API key is stored in the project for these basemaps. If a basemap provider changes its endpoint or access policy in future, update `src/config/mapStyle.js` rather than editing each map component separately.

The regional birthplace/recent-origin map uses project-bundled Natural Earth country geometry and does not depend on an online basemap.

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

Test all three pages:

- `/`
- `/survey.html`
- `/journeys.html`

## GitHub Pages deployment

The current repository keeps a prebuilt GitHub Pages copy in `docs/`.

After source changes have been reviewed:

```bat
publish_docs.bat
```

The script builds the Vite application and refreshes the published files in `docs/`. Review `git status` before committing.

Recommended release sequence:

1. Work on a feature/maintenance branch.
2. Run `npm run build` and `npm run preview`.
3. Check desktop and mobile layouts.
4. Run `publish_docs.bat`.
5. Review `git diff` / `git status`.
6. Commit and push the branch.
7. Merge to `main` only after approval.

## Team handoff

See:

- `project-docs/TEAM_HANDOFF_AND_EMBED.md`
- `project-docs/FINAL_QA_REPORT.md`
- `project-docs/PRESENTATION_SCRIPT_8_MIN.md`
- `project-docs/PRESENTATION_CUE_CARD.md`

The GitHub repository should remain the source of truth. The GEMMS website can embed or link to the deployed GitHub Pages atlas rather than maintaining a second copy of the application.
