# DEAD TAB — Architecture Decision Record

*Phase A findings: environment has Git 2.43, Python 3.12, Node 24, file creation and GitHub API access. No paid services are available or needed.*

## Stack

Plain HTML5, CSS3, vanilla JavaScript. No framework, no build step, no backend, no database. Content lives in local data files. Hosting: GitHub Pages (free, account already exists, HTTPS included, custom 404 supported). Total cost: ₹0.

Why not a framework: two part-time founders must maintain this for years. A static site with no dependencies cannot break when a package is abandoned, needs no build pipeline, and every file can be edited in any text editor.

## Content model

- `data/exhibits.json` is the single source of truth for exhibit metadata (id, slug, title, category, period, evidence status, description, reading time, dates, related exhibits, sources).
- `scripts/build_data_js.py` wraps that JSON into `assets/js/data.js` (`window.DEADTAB_EXHIBITS = [...]`) so pages can load data with a plain script tag. This works identically on GitHub Pages, on a local server, and from the filesystem, with no fetch or CORS problems. Founders edit the JSON, run one command, and commit both files.
- `scripts/validate-content.py` checks the JSON before publishing: unique ids and slugs, required fields, valid categories and evidence statuses, valid related-exhibit references, source URL syntax, and that every exhibit page file exists.

## Routing

Option A from the specification: one real HTML page per exhibit in `exhibits/<slug>.html`. Every public URL works when opened directly or refreshed; nothing depends on client-side routing. Listing pages (archive, categories, open cases) read the shared data file and link to those real pages. Category views are `archive.html?category=<slug>` plus a categories index page, so a category URL also opens directly.

## Search and filtering

Client-side over the local data file: title, subtitle, description, category, period, and keywords. No paid search service, no server. Filters for category and evidence status, a clear-all control, sorting by publication date, and an honest empty state.

## Pages

`index.html` (home), `archive.html`, `categories.html`, `open-cases.html`, `submit-memory.html`, `about.html`, `editorial-policy.html`, `privacy.html`, `404.html`, plus `exhibits/` pages. Shared header/footer are injected by `assets/js/navigation.js` so navigation exists in exactly one place. SEO files: `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, per-page titles/descriptions/Open Graph tags with the real production URL once deployed.

## Images and rights

No historical screenshots are reproduced without verified rights. Each exhibit uses an original SVG illustration or a clearly labelled placeholder, recorded in `docs/image-rights-register.md` with source, creator, licence status, and date checked. External artifacts are linked, not copied.

## Contributions

No backend exists, so the Submit a Memory page does not pretend to save submissions. It provides a downloadable submission template and clear instructions, and review-before-publication is stated. A form service will only be wired if a genuinely free one is configured by the founders later; the page is written so that day is a small edit.

## Analytics

None at launch. GitHub Pages provides no visitor analytics to site owners; the privacy page says exactly that, plus what GitHub itself may log as host. Nothing is fabricated.

## Deployment

Contents of the repo root are the site (GitHub Pages serves from `main`, root). No build command. Deploy = push. Verified after publish by opening the production URL and its nested exhibit pages, archive search, and a deliberately wrong URL for the 404.
