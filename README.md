# DEAD TAB

**Somewhere, a page still remembers.**

DEAD TAB is an interactive museum of the forgotten internet: lost websites, vanished communities, invented identities, travelling memes, digital artifacts, and the mysteries the evidence never finished. It begins with India and connects outward to the global story.

**Live site:** https://adityapratap0077-cloud.github.io/dead-tab/

## Mission

Preserve the forgotten stories of the internet and turn discovering them into an immersive, educational, emotionally engaging experience, without inventing a single fact to do it.

## Features

- A searchable, filterable archive (text search, category filter, evidence-status filter, sorting, clear-all, honest empty states).
- One real page per exhibit, so every URL works when opened directly.
- Six category wings, an Open Cases section that separates facts from claims, and a featured-investigation homepage.
- Evidence labels on every exhibit: Verified, Documented, Partially documented, Uncertain, Recollection (defined on the Editorial Policy page).
- A contribution route (Submit a Memory) that is honest about being manual and reviewed.
- No accounts, no analytics, no paid services anywhere in the stack.

## Technology stack

HTML5, CSS3, vanilla JavaScript. Content in JSON (`data/`). Hosted on GitHub Pages. Total running cost: **₹0**. No build step, no framework, no database; the one generated file (`assets/js/data.js`) is produced by a small Python script from the JSON source of truth.

## File structure

```
dead-tab/
├── index.html, archive.html, categories.html, open-cases.html,
│   submit-memory.html, about.html, editorial-policy.html,
│   privacy.html, 404.html
├── exhibits/            one HTML page per exhibit
├── data/                exhibits.json + categories.json (source of truth)
├── assets/
│   ├── css/styles.css
│   ├── js/              navigation.js, app.js, data.js (generated)
│   └── images/          logo.svg, placeholders/
├── scripts/             build_data_js.py, validate-content.py
├── docs/                architecture, research notes, registers, maintenance
├── sitemap.xml, robots.txt, manifest.webmanifest, feed.xml
├── submission-template.txt
├── README.md, CONTRIBUTING.md, LICENSE, .gitignore
```

## Prerequisites

A text editor and a browser. Python 3 for the two helper scripts. Git and a GitHub account for publishing. Nothing else, and nothing paid.

## Run it locally

```
cd dead-tab
python3 -m http.server 8000
```

Open `http://localhost:8000`. (Opening files directly also works; the local server behaves closest to production.)

## Editing content

Exhibit listings come from `data/exhibits.json`; categories from `data/categories.json`. After any edit:

```
python3 scripts/build_data_js.py     # regenerate assets/js/data.js
python3 scripts/validate-content.py  # check the content is valid
```

## Adding an exhibit

Follow `CONTRIBUTING.md` and the new-exhibit starter in `docs/new-exhibit-template.md`. In short: research, record sources, draft the page in `exhibits/`, add the metadata to `data/exhibits.json`, update `sitemap.xml` and `feed.xml`, run the two scripts, preview, then publish.

## Testing

Run the content validator, then walk the checklist in `docs/testing-report.md` (written for each release with what was actually tested). Never mark a test passed that was not run.

## Git and GitHub

```
git init
git add .
git commit -m "Build initial DEAD TAB museum"
git branch -M main
git remote add origin https://github.com/adityapratap0077-cloud/dead-tab.git
git push -u origin main
```

Replace the remote URL with your own repository if you fork this project. Never commit passwords or tokens.

## Deployment

GitHub Pages: repository **Settings → Pages → Deploy from a branch → `main`, `/ (root)`**. No build command. Pushes to `main` republish automatically. The site works entirely on the free `github.io` subdomain; a custom domain is optional, costs money, and is not required (see `docs/maintenance.md` for how HTTPS and domains work here).

## Troubleshooting

- **Archive is empty on your machine:** `assets/js/data.js` is stale or missing. Run `python3 scripts/build_data_js.py`.
- **A page looks unstyled:** check the relative path to `assets/css/styles.css` (exhibit pages need `../assets/...`).
- **404 page not showing your design locally:** GitHub Pages serves `404.html` in production; a local static server may show its own. That is expected.
- **An exhibit is missing from listings:** it is not in `data/exhibits.json`, or validation failed. Run the validator.

## Copyright and image licensing

The MIT licence in `LICENSE` covers this site's code only. Historical material belongs to its creators. We reproduce images only with verified rights, recorded in `docs/image-rights-register.md`; otherwise we use original placeholders and link out.

## Privacy

The site sets no cookies, runs no analytics, and collects nothing. The host (GitHub) processes connection data under its own privacy statement. Full details: `privacy.html` on the site.

## Cost breakdown

Hosting ₹0 (GitHub Pages free tier) · Domain ₹0 (free subdomain) · APIs ₹0 (none) · Images ₹0 (original placeholders) · Analytics ₹0 (none) · Email/forms ₹0 (manual LinkedIn-based submissions). **Total: ₹0.** The real cost is founder time, roughly 2–3 hours a day each.

## Maintenance

See `docs/maintenance.md` for the monthly checklist and step-by-step guides (add/edit an exhibit, correct a claim, remove an image, roll back a bad publish).
