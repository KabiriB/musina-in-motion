# Musina in Motion — team handoff and embed note

## Recommended ownership model

Keep the canonical application in the `KabiriB/musina-in-motion` GitHub repository and use the deployed GitHub Pages site as the version embedded or linked from the GEMMS website.

This avoids maintaining two independent copies of the interface. Future wording, label or narrative corrections can be made once in the repository and then republished.

For continuity, give at least one trusted project colleague repository access or maintain a project-owned backup of the repository.

## Public deployment

Standard GitHub Pages URL for this repository:

`https://kabirib.github.io/musina-in-motion/`

Before sharing the embed code, confirm that this is the active Pages URL in GitHub **Settings → Pages**.

## Recommended website treatment

For a complex atlas with scrollytelling, provide both:

1. an embedded view on the GEMMS page; and
2. a prominent **Open full atlas** link.

The full-page version will give the best experience on smaller screens and during presentations.

### Responsive iframe embed

```html
<div style="position:relative;width:100%;height:0;padding-bottom:62.5%;min-height:620px;">
  <iframe
    src="https://kabirib.github.io/musina-in-motion/"
    title="Musina in Motion interactive atlas"
    loading="lazy"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;"
    allowfullscreen>
  </iframe>
</div>
```

If the GEMMS content-management system strips inline styles, the web team can recreate the same responsive iframe treatment in the site stylesheet.

### Full atlas link

```html
<a href="https://kabirib.github.io/musina-in-motion/" target="_blank" rel="noopener">
  Open the full Musina in Motion atlas
</a>
```

## Small future maintenance requests

Most future edits should fall into one of four categories:

### Wording
Edit `src/content/siteCopy.js` or the relevant component, then build and preview.

### Journey narration
Edit `src/data/journeyStories.js`. Keep public pseudonyms stable and preserve internal source IDs for provenance.

### Participatory resource presentation labels
Edit `src/utils/publicationLabels.js`. Do not overwrite the raw workshop wording simply to improve capitalisation or punctuation in the interface.

### Basemap provider change
Edit `src/config/mapStyle.js`. The style URLs are centralised there specifically so a future provider change does not require rewriting every map.

## What should trigger a deeper review

Do not treat these as tiny maintenance edits:

- changing denominators or survey universes;
- adding new respondent-level geography;
- changing suppression/privacy rules;
- replacing ward or block geometry;
- recalculating service proximity;
- adding a new infrastructure universe;
- changing the interpretation of a narrated journey.

Those changes should go back through analytical and privacy QA before publication.
