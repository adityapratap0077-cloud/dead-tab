#!/usr/bin/env python3
"""Create (if needed) the dead-tab repo and upload the project via the
GitHub Contents API, then enable GitHub Pages on main/root.

Uploads everything except qa/ (dev-only test tooling with node_modules).
Run: python3 push-to-github.py
"""
import base64, json, os, sys, time, urllib.request, urllib.error

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request

ROOT = os.path.dirname(os.path.abspath(__file__))
OWNER, REPO = "adityapratap0077-cloud", "dead-tab"
API = "https://api.github.com"
SKIP_DIRS = {"qa", ".git", "node_modules", "__pycache__"}

def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(API + path, data=data, method=method,
                                 headers={"Accept": "application/vnd.github+json",
                                          "Content-Type": "application/json"})
    add_surrogate_to_request(req, "custom.github", entry_name="access_token",
                             allowed_hosts=["api.github.com"])
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            body = r.read().decode()
            return r.status, (json.loads(body) if body else {})
    except urllib.error.HTTPError as e:
        return e.code, {}

status, _ = call("GET", f"/repos/{OWNER}/{REPO}")
if status == 404:
    status, resp = call("POST", "/user/repos", {
        "name": REPO,
        "description": "DEAD TAB — an interactive museum of the forgotten internet. Forgotten websites, lost cultures, stories buried beneath the feed.",
        "private": False, "auto_init": False})
    print("repo create:", status)

files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        full = os.path.join(dirpath, fn)
        rel = os.path.relpath(full, ROOT)
        files.append((rel, full))
files.sort()

ok = fail = 0
for rel, full in files:
    with open(full, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    s, meta = call("GET", f"/repos/{OWNER}/{REPO}/contents/{rel}")
    payload = {"message": f"Add {rel}", "content": content, "branch": "main"}
    if s == 200 and "sha" in meta:
        payload["sha"] = meta["sha"]
        payload["message"] = f"Update {rel}"
    s, _ = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{rel}", payload)
    print(("ok  " if s in (200, 201) else "FAIL"), rel)
    if s in (200, 201):
        ok += 1
    else:
        fail += 1
    time.sleep(0.25)
print(f"uploaded {ok}, failed {fail}")

s, resp = call("POST", f"/repos/{OWNER}/{REPO}/pages", {"source": {"branch": "main", "path": "/"}})
print("pages enable:", s, json.dumps(resp)[:160])
s, resp = call("GET", f"/repos/{OWNER}/{REPO}/pages")
print("pages status:", s, resp.get("html_url"))
