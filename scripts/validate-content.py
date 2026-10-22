#!/usr/bin/env python3
"""Validate DEAD TAB content before publishing.

Checks data/exhibits.json and data/categories.json for:
  - unique exhibit ids and slugs
  - required fields present and non-empty
  - valid categories and evidence statuses
  - relatedExhibits references that resolve
  - source URLs that look like URLs
  - an exhibit HTML page for every published slug
  - cover image files that exist locally
Exit code 0 = valid. Run: python3 scripts/validate-content.py
"""
import json, os, sys
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REQUIRED = ["id", "slug", "title", "subtitle", "category", "period", "location",
            "evidenceStatus", "description", "publishedAt", "readingTime",
            "relatedExhibits", "sources", "coverImage", "imageCredits"]
STATUSES = {"verified", "documented", "partial", "uncertain", "recollection"}

errors, warnings = [], []

def load(name):
    with open(os.path.join(ROOT, "data", name), encoding="utf-8") as f:
        return json.load(f)

try:
    exhibits = load("exhibits.json")
    categories = load("categories.json")
except Exception as e:
    print(f"FATAL: cannot parse data files: {e}")
    sys.exit(1)

cat_slugs = {c["slug"] for c in categories}
slugs = set()
ids = set()
for ex in exhibits:
    tag = ex.get("id", ex.get("slug", "?"))
    for field in REQUIRED:
        if not ex.get(field):
            errors.append(f"{tag}: missing or empty required field '{field}'")
    if ex.get("id") in ids:
        errors.append(f"{tag}: duplicate exhibit id")
    ids.add(ex.get("id"))
    if ex.get("slug") in slugs:
        errors.append(f"{tag}: duplicate slug")
    slugs.add(ex.get("slug"))
    if ex.get("category") not in cat_slugs:
        errors.append(f"{tag}: category '{ex.get('category')}' is not in categories.json")
    if ex.get("evidenceStatus") not in STATUSES:
        errors.append(f"{tag}: evidenceStatus '{ex.get('evidenceStatus')}' is not a defined status")
    for src in ex.get("sources", []):
        u = urlparse(src.get("url", ""))
        if u.scheme not in ("http", "https") or not u.netloc:
            errors.append(f"{tag}: source URL looks invalid: {src.get('url')}")
    page = os.path.join(ROOT, "exhibits", f"{ex.get('slug')}.html")
    if not os.path.exists(page):
        errors.append(f"{tag}: exhibit page missing: exhibits/{ex.get('slug')}.html")
    cover = ex.get("coverImage", "")
    if cover and not cover.startswith("http") and not os.path.exists(os.path.join(ROOT, cover)):
        errors.append(f"{tag}: cover image file not found: {cover}")

for ex in exhibits:
    for rel in ex.get("relatedExhibits", []):
        if rel not in slugs:
            errors.append(f"{ex.get('id')}: relatedExhibits points at unknown slug '{rel}'")

for w in warnings:
    print("WARN:", w)
if errors:
    print(f"\n{len(errors)} error(s):")
    for e in errors:
        print("ERROR:", e)
    sys.exit(1)
print(f"Content valid: {len(exhibits)} exhibits, {len(categories)} categories, all references resolve.")
