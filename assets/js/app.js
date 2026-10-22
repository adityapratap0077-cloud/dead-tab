// DEAD TAB app helpers: exhibit cards, archive search/filter, listings.
// Data comes from assets/js/data.js (generated from data/*.json).
(function () {
  "use strict";
  var EXHIBITS = window.DEADTAB_EXHIBITS || [];
  var CATEGORIES = window.DEADTAB_CATEGORIES || [];
  var STATUS_LABELS = {
    verified: "Verified", documented: "Documented", partial: "Partially documented",
    uncertain: "Uncertain", recollection: "Recollection"
  };
  function catName(slug) {
    var c = CATEGORIES.find(function (x) { return x.slug === slug; });
    return c ? c.name : slug;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function base() { return document.body.getAttribute("data-base") || ""; }
  function card(ex) {
    return '<article class="card">' +
      '<figure class="artifact"><img src="' + base() + esc(ex.coverImage) + '" alt="' + esc(ex.coverAlt || "") + '" loading="lazy">' +
      "<figcaption>" + esc(ex.id) + " · cover is an original placeholder illustration</figcaption></figure>" +
      '<span class="exhibit-id">' + esc(ex.id) + " · " + esc(ex.period) + "</span>" +
      '<a class="title" href="' + base() + "exhibits/" + esc(ex.slug) + '.html">' + esc(ex.title) + "</a>" +
      '<p class="desc">' + esc(ex.description) + "</p>" +
      '<p style="margin:12px 0 0"><span class="status ' + esc(ex.evidenceStatus) + '">' + esc(STATUS_LABELS[ex.evidenceStatus] || ex.evidenceStatus) + "</span> " +
      '<span class="small">' + esc(catName(ex.category)) + " · " + esc(ex.readingTime) + " min read</span></p></article>";
  }
  window.DEADTAB = { card: card, catName: catName, exhibits: EXHIBITS, categories: CATEGORIES, statusLabels: STATUS_LABELS };

  // ---------- Homepage ----------
  var featured = document.getElementById("featuredExhibit");
  if (featured) {
    var f = EXHIBITS.find(function (x) { return x.featured; }) || EXHIBITS[0];
    if (f) featured.innerHTML = card(f);
  }
  var latest = document.getElementById("latestExhibits");
  if (latest) {
    var sorted = EXHIBITS.slice().sort(function (a, b) { return a.publishedAt < b.publishedAt ? 1 : -1; });
    latest.innerHTML = sorted.slice(0, 3).map(card).join("");
  }
  var homeCats = document.getElementById("homeCategories");
  if (homeCats) {
    homeCats.innerHTML = CATEGORIES.map(function (c) {
      var n = EXHIBITS.filter(function (x) { return x.category === c.slug; }).length;
      return '<div class="card"><h3 style="margin-top:0"><a href="' + base() + "archive.html?category=" + c.slug + '" style="color:var(--text);text-decoration:none">' + esc(c.name) + "</a></h3>" +
        '<p class="desc">' + esc(c.description) + "</p>" +
        '<p class="small" style="margin:10px 0 0">' + n + (n === 1 ? " exhibit" : " exhibits") + "</p></div>";
    }).join("");
  }
  var homeCases = document.getElementById("homeOpenCases");
  if (homeCases) {
    var cases = EXHIBITS.filter(function (x) { return x.category === "open-cases"; });
    homeCases.innerHTML = cases.length ? cases.map(card).join("") :
      '<div class="empty">The first open case is being prepared. Cases are published only when the known facts can be separated cleanly from the claims.</div>';
  }

  // ---------- Categories page ----------
  var catList = document.getElementById("categoryList");
  if (catList) {
    catList.innerHTML = CATEGORIES.map(function (c) {
      var items = EXHIBITS.filter(function (x) { return x.category === c.slug; });
      return '<div class="card"><h3 style="margin-top:0">' + esc(c.name) + "</h3>" +
        '<p class="desc">' + esc(c.description) + "</p>" +
        (items.length
          ? '<p style="margin:10px 0 0"><a href="' + base() + "archive.html?category=" + c.slug + '">Browse ' + items.length + (items.length === 1 ? " exhibit" : " exhibits") + "</a></p>"
          : '<p class="small" style="margin:10px 0 0">No exhibits yet. This wing of the museum is still being built.</p>') +
        "</div>";
    }).join("");
  }

  // ---------- Open cases page ----------
  var caseList = document.getElementById("openCaseList");
  if (caseList) {
    var oc = EXHIBITS.filter(function (x) { return x.category === "open-cases"; });
    caseList.innerHTML = oc.length ? oc.map(card).join("") :
      '<div class="empty">No open cases published yet.</div>';
  }

  // ---------- Archive page ----------
  var archiveGrid = document.getElementById("archiveGrid");
  if (archiveGrid) {
    var searchEl = document.getElementById("archiveSearch");
    var catEl = document.getElementById("filterCategory");
    var statusEl = document.getElementById("filterStatus");
    var sortEl = document.getElementById("filterSort");
    var emptyEl = document.getElementById("archiveEmpty");
    var countEl = document.getElementById("archiveCount");

    catEl.innerHTML = '<option value="">All categories</option>' + CATEGORIES.map(function (c) {
      return '<option value="' + c.slug + '">' + esc(c.name) + "</option>";
    }).join("");
    var params = new URLSearchParams(window.location.search);
    if (params.get("category")) catEl.value = params.get("category");
    if (params.get("q")) searchEl.value = params.get("q");

    function render() {
      var q = searchEl.value.trim().toLowerCase();
      var cat = catEl.value, st = statusEl.value;
      var rows = EXHIBITS.filter(function (ex) {
        if (cat && ex.category !== cat) return false;
        if (st && ex.evidenceStatus !== st) return false;
        if (q) {
          var hay = (ex.title + " " + ex.subtitle + " " + ex.description + " " + catName(ex.category) + " " + ex.period + " " + (ex.keywords || []).join(" ")).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
      if (sortEl.value === "oldest") rows.sort(function (a, b) { return a.publishedAt < b.publishedAt ? -1 : 1; });
      else if (sortEl.value === "title") rows.sort(function (a, b) { return a.title.localeCompare(b.title); });
      else rows.sort(function (a, b) { return a.publishedAt < b.publishedAt ? 1 : -1; });
      archiveGrid.innerHTML = rows.map(card).join("");
      emptyEl.style.display = rows.length ? "none" : "block";
      countEl.textContent = rows.length + (rows.length === 1 ? " exhibit" : " exhibits") + " in the archive";
    }
    [searchEl, catEl, statusEl, sortEl].forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });
    document.getElementById("clearFilters").addEventListener("click", function () {
      searchEl.value = ""; catEl.value = ""; statusEl.value = ""; sortEl.value = "newest"; render(); searchEl.focus();
    });
    render();
  }
})();
