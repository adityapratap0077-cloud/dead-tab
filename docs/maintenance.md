# DEAD TAB — Maintenance Guide

## The routine operations

**Add a new exhibit:** follow `CONTRIBUTING.md` and `docs/new-exhibit-template.md`. Research, sources, draft, fact-check, rights check, JSON entry, `build_data_js.py`, `validate-content.py`, preview, push, live recheck.

**Edit existing content:** edit the exhibit HTML and/or its JSON entry, rerun the two scripts, push, recheck the live page. Update the exhibit's `updatedAt`.

**Add a licensed image:** verify the licence, save the file under `assets/images/`, add a row to `docs/image-rights-register.md` (creator, source, licence, attribution, date checked), reference it with proper alt text and caption credit, push.

**Update sources:** add the new source to the exhibit page and its JSON entry with the access date. Never silently swap a source for a claim; if the claim changes, that is a correction.

**Correct a historical claim:** fix the text, add a dated entry to `docs/correction-log.md`, and if the change alters a conclusion, say so inside the exhibit.

**Remove an incorrect image:** delete the file reference, replace with the placeholder, note it in the correction log, push, and verify the live page no longer serves it.

**Preview locally:** `python3 -m http.server 8000` in the project folder.

**Validate content:** `python3 scripts/validate-content.py` (and regenerate data with `build_data_js.py` after JSON edits).

**Commit and push updates:**
```
git add .
git commit -m "Describe the change plainly"
git push
```

**Trigger a new deployment:** pushing to `main` is the trigger; GitHub Pages republishes within a few minutes. **Check deployment status:** repository Actions tab, or simply reload the live URL.

**Restore a previous version:** `git log --oneline` to find the good commit, then `git revert <commit>` for a safe, recorded undo (preferred), and push.

**Change the production URL:** if hosting ever moves, update canonical URLs, Open Graph URLs, `sitemap.xml`, `robots.txt`, and `feed.xml` to the new base, and note the move in the README.

## Domains and HTTPS, in plain words

The site lives on a free `github.io` subdomain. GitHub provides HTTPS for it automatically at no cost. A custom domain (like deadtab.in) is a yearly paid rental from a registrar; it is not needed for launch, adds cost without adding visitors, and can be connected later in the repo's Pages settings if the founders ever choose to buy one. Do not let a domain block publishing.

## Monthly maintenance checklist

- [ ] Click through every page and a sample of exhibit-to-exhibit links
- [ ] Check a sample of external source links; replace dead ones with archived copies where legitimate
- [ ] Re-verify one older exhibit's key claims against its sources
- [ ] Review the image-rights register; confirm nothing expired or was misattributed
- [ ] Confirm the privacy page still matches the implementation (no new services crept in)
- [ ] Review correction and contributor requests; action or reply to each
- [ ] Keep a backup: the Git repository is the backup; also keep source research notes in `docs/`
- [ ] Confirm GitHub Pages is still serving (open the live URL)
