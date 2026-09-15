# Musina in Motion — final publication QA report

**QA phase:** final publication polish  
**Date:** 3 September 2026  
**Branch:** `final-polish-v2`

## 1. Editorial consistency

- British English adopted for authored publication copy.
- Technical field names such as `base_analyzable_n` are intentionally unchanged.
- Public navigation standardised to **Survey Atlas** and **Narrated Journeys**.
- Internal production wording removed from public-facing journey copy.
- Narrated-journey prose reviewed for grammar, punctuation and clarity while retaining substantive meaning.
- Mixed-evidence note shortened to: “Differences between survey responses and interview accounts are treated as differences between instruments.”
- Birthplace wording clarified from the metaphorical “where a life began” to the literal “where a person was born”.

## 2. Data-value checks

Verified against the public application data:

### Regional country summaries

- Zimbabwe-born: 475 / 75.5%
- South Africa-born: 109 / 17.3%
- Recent origin Zimbabwe: 451 / 71.7%
- Recent origin South Africa: 150 / 23.8%

The birthplace universe totals 629. The recent-origin file also totals 629 when the three missing/unknown records are included.

### Ward summaries

The six displayed ward sample counts sum to 629. The interface values shown for non-permanence, Zimbabwe birthplace and annual-or-more cross-border movement match the public ward-summary JSON.

### Participatory resource ecology

The locked resource inventory supports:

- 128 unique named resources
- 39 with coordinates
- 37 in the core mapped layer

The interface continues to show mapped and unmapped evidence together and does not equate “unmapped” with “absent”.

## 3. Journey checks

Ten public pseudonyms are present:

Michaela, Wayne, Munyadziwa, Tatenda, Rhoda, Rudo, Morgan, Shingi, Benjamin and Arnold.

Canonical stop sequences include:

- Munyadziwa: Kakhu → Masea → Makonde → Musina
- Rhoda: Gokwe → Bulawayo → Musina (first arrival) → Tzaneen → Musina (return)
- Rhoda's Cape Town path is explicitly an intended destination not reached.
- Morgan is included.

The public reader does not expose MAP IDs as participant names. Source IDs remain only for provenance and maintenance. Unused provisional simple/complex classifications and theme metadata have been removed from the public journey data.

## 4. Resource-name publication layer

Raw workshop wording is preserved in the data. A display-only formatting utility now cleans publication labels without rewriting the evidence source.

Examples:

- `Mussina hospital` → **Musina Hospital**
- `roman catholic womens shelter` → **Roman Catholic Women's Shelter**
- `red cross` → **Red Cross**
- `boys shelter` → **Boys' Shelter**
- `girls shelter` → **Girls' Shelter**
- `mens shelter` → **Men's Shelter**
- `iom` → **IOM**
- `NGO forums map 1` → **NGO Forums Map 1**

Uncertain proper-name spellings are not silently rewritten without verification.

## 5. Privacy and interpretation

Publication wording preserves the following distinctions:

- survey block anchors ≠ household locations;
- country-level mobility maps ≠ individual routes;
- proximity ≠ effective access;
- selected infrastructure anchors ≠ complete service register;
- participatory resources ≠ verified official infrastructure;
- narrated journey lines ≠ exact roads or GPS traces;
- survey patterns ≠ statistically representative claims about every resident of Musina.

## 6. External map dependency audit

The authored source currently contains two online basemap style endpoints, both centralised in `src/config/mapStyle.js`:

- OpenFreeMap Positron
- OpenFreeMap Liberty

No project API key is embedded in the application for these styles.

The regional country map uses locally bundled Natural Earth geometry and does not require an online basemap.

Future basemap maintenance should begin in `src/config/mapStyle.js`; do not edit each map separately.

## 7. Manual browser checks already completed

Desktop visual review has covered:

- regional birthplace/recent-origin toggle;
- local block selection;
- infrastructure selection;
- participatory-resource map and mappability panel;
- all ten narrated journeys;
- scrollytelling progression;
- Rhoda intended-destination treatment;
- long place-name containment.

## 8. Final manual checks before merge

After applying this QA patch:

1. Run `npm run build`.
2. Run `npm run preview`.
3. Spot-check all three pages at desktop width.
4. Check at approximately 768 px and 390 px widths.
5. Confirm map controls and attribution remain visible.
6. Confirm no `API KEY REQUIRED` or other provider warning appears.
7. Test one resource popup after the publication-label formatter is applied.
8. Test Wayne and Rhoda scrollytelling once more.
9. Confirm all navigation links work.
10. Only then refresh `docs/` and merge to `main`.

## Release recommendation

**Layout and analytical design are frozen.** Any change after this point should be classified as:

- a copy/label maintenance edit;
- a verified data correction; or
- a new analytical release requiring renewed QA.
