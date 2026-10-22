# Contributing to DEAD TAB

DEAD TAB is maintained by its two founders, Aditya Pratap (technical) and Nandini Raj (research and editorial). This document is the working process both follow for every exhibit. Outside contributions arrive as memories and corrections through the Submit a Memory page and are folded in by the founders.

## The editorial pipeline

1. **Research.** Start from credible sources: primary material and archived pages first, then academic and institutional sources, then reputable journalism. Community accounts are welcome and are labelled as recollection.
2. **Record sources.** Every claim that matters goes into the exhibit's source list with title, publisher, URL, and access date. If a claim has no source, it gets labelled uncertain or it gets cut. There is no third option.
3. **Draft.** Write the exhibit page from `docs/new-exhibit-template.md`. Keep facts, claims by others, and unknowns in their own labelled places, especially in open cases.
4. **Fact-check.** The founder who did not draft it checks every date, name, and number against the sources. Disagreements are resolved in favour of the weaker claim.
5. **Check copyright.** Any image needs an entry in `docs/image-rights-register.md` with verified licence or permission before it is used. Unclear rights means a placeholder and a link, never a copy.
6. **Add structured content.** Add the exhibit to `data/exhibits.json` following the schema in the template doc. Run `python3 scripts/build_data_js.py`, then `python3 scripts/validate-content.py`. Both must pass.
7. **Preview locally.** `python3 -m http.server 8000` and read the page on a phone-sized window and a desktop window.
8. **Publish.** Commit and push to `main`. GitHub Pages republishes automatically.
9. **Recheck live.** Open the production URL, the exhibit URL, and the archive. Click the related-exhibit links. Only then is it published.

## Editorial checklist (both founders, every exhibit)

- [ ] Every dated fact checked against a named source
- [ ] No invented quotations, statistics, or citations anywhere
- [ ] Evidence status set honestly (when in doubt, one level weaker)
- [ ] Personal memories labelled Recollection, in the teller's voice
- [ ] Open-case sections kept separate: facts / claims / evidence / disputed / alternatives / unknowns
- [ ] No private individuals identified, contacted, or speculated about
- [ ] Every image in the rights register, or replaced by a placeholder
- [ ] Sources listed with access dates
- [ ] Alt text on every image; heading order sensible; links descriptive
- [ ] Validator passes; data.js regenerated; sitemap and feed updated
- [ ] Live page rechecked after publishing

## Corrections

A correction is a contribution, not an embarrassment. Fix the exhibit, note the change and its date in `docs/correction-log.md`, and credit the contributor if they wish. If an error changes an exhibit's conclusion, say so in the exhibit itself.

## Style

Plain, warm, precise. The museum's mystery comes from real stories told well, never from dressing up guesses as discoveries. Write like the archive will be read in twenty years, because that is the hope.
