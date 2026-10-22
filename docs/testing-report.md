# DEAD TAB — Testing Report (v1 launch, 2026-10-22)

*Only tests actually run are reported. Method: an automated harness (jsdom) loaded every page with its real scripts and operated the archive like a visitor; the content validator checked the data; the live site was then fetched page by page after deployment.*

## Automated results: 58 checks, 58 passed

**Every page (home, archive, categories, open cases, submit, about, editorial policy, privacy, 404)**
- Shared header renders with the DEAD TAB brand; footer renders with both founders credited; navigation contains all five links.

**Homepage**
- Hero headline present; featured exhibit card renders; latest-exhibits grid shows the newest exhibits; all six category cards render with correct counts; open-cases section matches the data (one published case).

**Archive**
- All 4 exhibits render as cards; category select offers All + 6 categories.
- A no-match search shows the empty state and a "0 exhibits" count; Clear filters restores everything.
- Keyword search ("cybercafe") finds Exhibit 001; evidence-status filtering returns exactly the matching subset.
- A direct category URL (`archive.html?category=indian-internet`) opens pre-filtered and survives as a standalone page.

**Categories and Open Cases pages**
- Six wing cards render; the open-case list matches the published case count.

**Exhibit pages (all four)**
- Each page's H1 matches its exhibit; a Sources section and an Evidence box are present; related-exhibit cards render in the exact number the data specifies, proving cross-linking works both ways.

**Content validation (`scripts/validate-content.py`)**
- Passed: unique IDs and slugs, all required fields, valid categories and evidence statuses, all related-exhibit references resolve, all source URLs well-formed, every exhibit page and cover file exists.

## Bug found and fixed during testing

- An early build of `assets/js/app.js` had a parenthesis error in the categories renderer. Because the file failed to parse, every dynamic section on the site (featured, latest, archive, categories) silently rendered nothing while static pages looked fine. The QA harness caught it before deployment. Lesson recorded: always run the harness after touching shared scripts.

## Checked by inspection, not automated

- **Mobile layout:** breakpoints stack grids to one column under 860px and the nav collapses to a menu button under 820px; verified in the CSS and in the harness DOM, not on a physical phone.
- **Reduced motion:** a `prefers-reduced-motion` block disables transitions and smooth scrolling; present in the stylesheet.
- **404 behaviour:** GitHub Pages serves the custom `404.html` for unknown paths on the deployed domain; verified live after deployment (see the deployment section of the README/handover).
- **External source links:** all exhibit sources were opened during research on 2026-10-22. Link rot after that date is covered by the monthly maintenance checklist.

## Known limitations (by design, stated on the site)

- Submissions are manual (LinkedIn + downloadable template); there is no form backend at ₹0, and the page says so rather than pretending to save input.
- No analytics exist; no visitor numbers are claimed anywhere.
- Historical images are placeholders by rights policy, not by oversight; each is captioned as such.

## Experience layer (added later on 2026-10-22, retested)

An experience pass added: a first-visit entry sequence (once per session, skippable), a hero terminal that types the archive's real shelf report from the live data, a 1986–2016 time scrubber with sourced micro-facts, a random-thread rabbit-hole button, a synthesized dial-up simulator on Exhibit DT-001 (WebAudio, user-triggered, no audio files), scroll reveal, desktop card tilt, reading progress, page-transition veils, and an archive console (press `) with working commands (help, list, open, random, cases, about). The automated suite grew to **74 checks, all passing**, including scrubber state changes, terminal output content, console open/list/unknown-command behaviour, and the simulator's presence. The run caught one portability bug (an unguarded `matchMedia` call that would crash the whole layer in environments without it); fixed with guards and re-verified. Sound synthesis itself cannot be heard in a headless harness; it is verified by code path and user gesture requirements, and labelled here as such.
