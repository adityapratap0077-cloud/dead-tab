# New Exhibit — Starter Template

## 1. Metadata (add to `data/exhibits.json`)

```json
{
  "id": "DT-00X",
  "slug": "url-friendly-slug",
  "title": "Exhibit Title",
  "subtitle": "One-line subtitle",
  "category": "lost-websites | digital-identities | meme-archaeology | open-cases | indian-internet | digital-artifacts",
  "period": "e.g. 2004–2014",
  "location": "Country or 'Global'",
  "evidenceStatus": "verified | documented | partial | uncertain | recollection",
  "statusLabel": "Matching label, e.g. Documented",
  "description": "Two sentences for cards and search results.",
  "keywords": ["search", "terms"],
  "coverImage": "assets/images/placeholders/exhibit-cover.svg",
  "coverAlt": "Descriptive alt text",
  "imageCredits": "What the cover is and who made it.",
  "readingTime": 8,
  "publishedAt": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD",
  "featured": false,
  "relatedExhibits": ["slug-of-a-related-exhibit"],
  "sources": [
    { "title": "Source title", "publisher": "Publisher", "url": "https://…", "accessedAt": "YYYY-MM-DD" }
  ]
}
```

## 2. Page (create `exhibits/<slug>.html`)

Copy the structure of an existing exhibit page and replace:

- Title, subtitle, meta description, Open Graph tags, canonical URL
- The metadata grid (ID, period, location, evidence status, reading time, dates)
- An introduction that says why this belongs in a museum
- Chapters or, for an open case: Established facts / Claims made by others / Available evidence / Disputed information / Alternative explanations / What remains unknown / Editorial conclusion
- An "Evidence and uncertainties" box
- Sources with access dates; image credits line
- Related exhibits (the shared script at the bottom of each exhibit page renders them from the JSON — set `mine` to your slug)
- A contribution/correction prompt

## 3. Registers and indexes

- Add any used image to `docs/image-rights-register.md` before publishing.
- Add the exhibit URL to `sitemap.xml` and a new item to `feed.xml`.
- Run `python3 scripts/build_data_js.py` and `python3 scripts/validate-content.py`.
