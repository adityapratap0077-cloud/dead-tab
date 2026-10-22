// DEAD TAB shared header and footer. One place for navigation.
// Pages set <body data-base=""> at the root or data-base="../" inside exhibits/.
(function () {
  "use strict";
  var base = document.body.getAttribute("data-base") || "";
  var page = document.body.getAttribute("data-page") || "";
  function link(href, label, key) {
    var cur = key === page ? ' aria-current="page"' : "";
    return '<a href="' + base + href + '"' + cur + ">" + label + "</a>";
  }
  var header = document.querySelector("header.site");
  if (header) {
    header.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<div class="wrap nav">' +
      '<a class="brand" href="' + base + 'index.html"><img src="' + base + 'assets/images/logo.svg" alt="">' +
      "<span>DEAD TAB<span class=\"tag\">SOMEWHERE, A PAGE STILL REMEMBERS</span></span></a>" +
      '<button class="menu-btn" id="menuBtn" aria-label="Toggle navigation" aria-expanded="false">Menu</button>' +
      '<nav id="mainNav" aria-label="Main">' +
      link("archive.html", "Archive", "archive") +
      link("categories.html", "Categories", "categories") +
      link("open-cases.html", "Open Cases", "open-cases") +
      link("submit-memory.html", "Submit a Memory", "submit") +
      link("about.html", "About", "about") +
      "</nav></div>";
    var btn = document.getElementById("menuBtn");
    var nav = document.getElementById("mainNav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  var footer = document.querySelector("footer.site");
  if (footer) {
    footer.innerHTML =
      '<div class="wrap"><div class="cols">' +
      "<div><strong style=\"font-family:var(--font-mono);letter-spacing:.1em\">DEAD TAB</strong>" +
      '<p class="small" style="margin-top:8px">An interactive museum of the forgotten internet: lost websites, vanished communities, and the stories buried beneath the feed. Researched and written by Aditya Pratap and Nandini Raj. Every claim sourced, or labelled uncertain.</p></div>' +
      "<div><strong>Explore</strong>" +
      '<a href="' + base + 'archive.html">The archive</a>' +
      '<a href="' + base + 'categories.html">Categories</a>' +
      '<a href="' + base + 'open-cases.html">Open cases</a>' +
      '<a href="' + base + 'submit-memory.html">Submit a memory</a></div>' +
      "<div><strong>The museum</strong>" +
      '<a href="' + base + 'about.html">About DEAD TAB</a>' +
      '<a href="' + base + 'editorial-policy.html">Editorial policy</a>' +
      '<a href="' + base + 'privacy.html">Privacy</a></div>' +
      "</div>" +
      '<p class="small" style="margin-top:22px">DEAD TAB is a non-commercial archive at launch. Historical material belongs to its creators; our commentary and research are our own. If you hold rights to anything referenced here and want it corrected or removed, see the editorial policy page.</p></div>';
  }
})();
