// DEAD TAB experience layer. All features are progressive enhancement:
// content reads fine without this file, and reduced-motion skips the show.
(function () {
  "use strict";
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var base = document.body.getAttribute("data-base") || "";
  var EXHIBITS = window.DEADTAB_EXHIBITS || [];
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* ---------- Entry overlay (homepage, once per session) ---------- */
  var overlay = document.getElementById("entryOverlay");
  if (overlay) {
    var entered = false;
    try { entered = !!sessionStorage.getItem("dt_entered"); } catch (e) {}
    function dismiss() {
      try { sessionStorage.setItem("dt_entered", "1"); } catch (e) {}
      overlay.style.transition = "opacity .45s ease";
      overlay.style.opacity = "0";
      setTimeout(function () { overlay.remove(); }, 480);
    }
    if (entered || reduced) { overlay.remove(); }
    else {
      document.getElementById("entrySkip").addEventListener("click", dismiss);
      var lines = ["ESTABLISHING CONNECTION TO THE ARCHIVE…", "4 EXHIBITS RECOVERED · 1 CASE STILL OPEN", "WELCOME, TRAVELLER."];
      var lineEl = document.getElementById("entryLine");
      (async function () {
        for (var i = 0; i < lines.length; i++) {
          if (!document.body.contains(overlay)) return;
          lineEl.textContent = lines[i];
          await sleep(i === lines.length - 1 ? 650 : 780);
        }
        if (document.body.contains(overlay)) dismiss();
      })();
    }
  }

  /* ---------- Hero terminal: types the archive's real state ---------- */
  var term = document.getElementById("termBody");
  if (term && EXHIBITS.length) {
    var openCases = EXHIBITS.filter(function (x) { return x.category === "open-cases"; }).length;
    var years = EXHIBITS.map(function (x) { return x.period; });
    var script = [
      { t: "> dial archive://dead-tab", c: "dim" },
      { t: "handshake ok · 4 exhibits on the shelf", c: "" },
      { t: "oldest recovery: BEFORE THE FEED (" + (EXHIBITS[0] ? EXHIBITS[0].period : "") + ")", c: "" },
      { t: "newest recovery: " + EXHIBITS[EXHIBITS.length - 1].title.toUpperCase(), c: "" },
      { t: "open cases: " + openCases + " · status: UNSOLVED", c: "amber" },
      { t: "no trackers loaded. no accounts required.", c: "ok" },
      { t: "the archive is open. pick a corridor below.", c: "" }
    ];
    if (reduced) {
      term.innerHTML = script.map(function (l) { return '<div class="' + l.c + '">' + l.t + "</div>"; }).join("");
    } else {
      (async function () {
        for (var i = 0; i < script.length; i++) {
          var div = document.createElement("div");
          if (script[i].c) div.className = script[i].c;
          term.appendChild(div);
          var txt = script[i].t;
          for (var j = 0; j <= txt.length; j += 2) {
            div.textContent = txt.slice(0, j);
            await sleep(13);
          }
          await sleep(120);
        }
        var cur = document.createElement("span");
        cur.className = "cursor";
        term.appendChild(cur);
      })();
    }
  }

  /* ---------- Internet-time scrubber ---------- */
  var scrub = document.getElementById("eraRange");
  if (scrub) {
    var ERAS = [
      { y: "1986", f: "ERNET quietly connects India's universities. The internet exists here, but the public has never heard its name.", m: "SOURCE: EXHIBIT DT-001", link: "exhibits/before-the-feed.html" },
      { y: "1995", f: "On 15 August, VSNL opens the internet to the Indian public: 9.6 kbit/s, ₹5,200 for 250 hours. Almost everyone will meet it in a cybercafé.", m: "SOURCE: EXHIBIT DT-001", link: "exhibits/before-the-feed.html" },
      { y: "1996", f: "India's first cybercafé opens at Mumbai's Leela Hotel. Going online becomes a place, a counter, a register, a ticking balance.", m: "SOURCE: EXHIBIT DT-001", link: "exhibits/before-the-feed.html" },
      { y: "1999", f: "Yahoo buys GeoCities for about $3.6 billion. The web's folk city of homemade pages is now a portal's suburb.", m: "SOURCE: EXHIBIT DT-003", link: "exhibits/geocities-the-city-that-vanished.html" },
      { y: "2004", f: "Orkut launches at Google. Within a few years, for millions of young Indians and Brazilians, it simply is the internet.", m: "SOURCE: EXHIBIT DT-002", link: "exhibits/orkut-indias-first-social-network.html" },
      { y: "2009", f: "GeoCities is shut down with at least 38 million pages inside. Volunteers spend six months rescuing a city from a burning building.", m: "SOURCE: EXHIBIT DT-003", link: "exhibits/geocities-the-city-that-vanished.html" },
      { y: "2012", f: "An image appears on 4chan: 'We are looking for highly intelligent individuals.' Cicada 3301 begins. Nobody has claimed it since.", m: "SOURCE: OPEN CASE DT-004", link: "exhibits/cicada-3301-open-case.html" },
      { y: "2014", f: "Orkut is switched off on 30 September. A decade of testimonials survives on a two-year export window and one archived ruin.", m: "SOURCE: EXHIBIT DT-002", link: "exhibits/orkut-indias-first-social-network.html" },
      { y: "2016", f: "Jio launches in September and mobile data collapses in price. The café era becomes history within a few years. You are reading this on its far side.", m: "SOURCE: EXHIBIT DT-001", link: "exhibits/before-the-feed.html" }
    ];
    var yEl = document.getElementById("eraYear"), fEl = document.getElementById("eraFact"),
        mEl = document.getElementById("eraMeta"), lEl = document.getElementById("eraLink");
    function showEra(i) {
      var e = ERAS[i];
      yEl.textContent = e.y; fEl.textContent = e.f; mEl.textContent = e.m; lEl.href = e.link;
    }
    scrub.max = String(ERAS.length - 1);
    scrub.value = "1";
    showEra(1);
    scrub.addEventListener("input", function () { showEra(Number(scrub.value)); });
  }

  /* ---------- Rabbit hole: random thread ---------- */
  document.querySelectorAll("[data-random-thread]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!EXHIBITS.length) return;
      var pick = EXHIBITS[Math.floor(Math.random() * EXHIBITS.length)];
      window.location.href = base + "exhibits/" + pick.slug + ".html";
    });
  });

  /* ---------- Scroll reveal (JS adds the class, so no-JS keeps content) ---------- */
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".card, .chapter, .evidence-box").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* ---------- Card tilt + glare (desktop, fine pointer) ---------- */
  if (!reduced && window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.classList.add("tilt");
      card.addEventListener("pointermove", function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 3.4).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 3.4).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Reading progress on exhibit pages ---------- */
  if (window.location.pathname.indexOf("/exhibits/") !== -1) {
    var bar = document.createElement("div");
    bar.id = "progressBar";
    document.body.appendChild(bar);
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }, { passive: true });
  }

  /* ---------- Page transition veil ---------- */
  if (!reduced) {
    var veil = document.createElement("div");
    veil.id = "veil";
    veil.innerHTML = '<span class="v-text">Retrieving from archive</span>';
    document.body.appendChild(veil);
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest ? ev.target.closest("a") : null;
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || a.target === "_blank") return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      if (/^https?:\/\//.test(href) && href.indexOf(window.location.host) === -1) return;
      ev.preventDefault();
      veil.classList.add("on");
      setTimeout(function () { window.location.href = href; }, 300);
    });
  }

  /* ---------- Archive console (press ` or the hint button) ---------- */
  var consoleEl = document.getElementById("consoleOverlay");
  if (consoleEl) {
    var out = document.getElementById("consoleOut");
    var input = document.getElementById("consoleInput");
    function print(t) { out.textContent += (out.textContent ? "\n" : "") + t; out.scrollTop = out.scrollHeight; }
    function openConsole() {
      consoleEl.classList.add("open");
      if (!out.textContent) {
        print("DEAD TAB ARCHIVE CONSOLE");
        print("type 'help' for commands. the archive answers only what it knows.");
      }
      setTimeout(function () { input.focus(); }, 30);
    }
    function closeConsole() { consoleEl.classList.remove("open"); }
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "`" && !consoleEl.classList.contains("open")) { ev.preventDefault(); openConsole(); }
      else if (ev.key === "Escape") closeConsole();
    });
    var hint = document.getElementById("consoleHint");
    if (hint) hint.addEventListener("click", openConsole);
    document.getElementById("consoleClose").addEventListener("click", closeConsole);
    consoleEl.addEventListener("click", function (ev) { if (ev.target === consoleEl) closeConsole(); });
    function run(raw) {
      var cmd = raw.trim().toLowerCase();
      print("> " + raw);
      if (!cmd) return;
      if (cmd === "help") {
        print("list ............ every exhibit on the shelf");
        print("open DT-001 ..... open an exhibit by archive id (or 'open orkut')");
        print("random .......... pull a random thread");
        print("cases ........... the open cases");
        print("about ........... what this place is");
        print("exit ............ close the console");
      } else if (cmd === "list") {
        EXHIBITS.forEach(function (x) { print(x.id + " · " + x.title + " (" + x.period + ")"); });
      } else if (cmd === "cases") {
        var cs = EXHIBITS.filter(function (x) { return x.category === "open-cases"; });
        if (!cs.length) print("no open cases published yet.");
        cs.forEach(function (x) { print(x.id + " · " + x.title + " — status: OPEN"); });
      } else if (cmd === "random") {
        var pick = EXHIBITS[Math.floor(Math.random() * EXHIBITS.length)];
        print("pulling a thread: " + pick.id + "…");
        setTimeout(function () { window.location.href = base + "exhibits/" + pick.slug + ".html"; }, 450);
      } else if (cmd === "about") {
        print("DEAD TAB is a museum of the forgotten internet, kept by two founders for ₹0. every claim sourced, or labelled uncertain. somewhere, a page still remembers.");
      } else if (cmd === "exit" || cmd === "close" || cmd === "quit") {
        closeConsole();
      } else if (cmd.indexOf("open ") === 0) {
        var q = cmd.slice(5).trim();
        var hit = EXHIBITS.find(function (x) {
          return x.id.toLowerCase() === q || x.slug.indexOf(q.replace(/\s+/g, "-")) !== -1 || x.title.toLowerCase().indexOf(q) !== -1;
        });
        if (hit) { print("opening " + hit.id + "…"); setTimeout(function () { window.location.href = base + "exhibits/" + hit.slug + ".html"; }, 400); }
        else print("not in the archive. try 'list'.");
      } else if (cmd === "clear") {
        out.textContent = "";
      } else {
        print("unknown command. the archive is silent on that. try 'help'.");
      }
    }
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { run(input.value); input.value = ""; }
    });
  }

  /* ---------- Dial-up simulator (Exhibit DT-001) ---------- */
  var dialBtn = document.getElementById("dialBtn");
  if (dialBtn) {
    var screen = document.getElementById("dialScreen");
    var barFill = document.getElementById("dialFill");
    var rate = document.getElementById("dialRate");
    var audioCtx = null, master = null, soundOn = true;
    var soundToggle = document.getElementById("dialSound");
    if (soundToggle) soundToggle.addEventListener("click", function () {
      soundOn = !soundOn;
      soundToggle.textContent = soundOn ? "Sound: on" : "Sound: off";
    });
    function ac() {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
        master = audioCtx.createGain();
        master.gain.value = 0.055;
        master.connect(audioCtx.destination);
      }
      return audioCtx;
    }
    function tone(freq, delay, dur, type, vol, wobble) {
      if (!soundOn || !ac()) return;
      var t = audioCtx.currentTime + delay;
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      if (wobble) {
        var lfo = audioCtx.createOscillator(), lg = audioCtx.createGain();
        lfo.frequency.value = 15; lg.gain.value = freq * 0.03;
        lfo.connect(lg); lg.connect(o.frequency);
        lfo.start(t); lfo.stop(t + dur);
      }
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol || 1, t + 0.02);
      g.gain.setValueAtTime(vol || 1, t + dur - 0.03);
      g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.05);
    }
    function hiss(delay, dur) {
      if (!soundOn || !ac()) return;
      var t = audioCtx.currentTime + delay;
      var len = Math.floor(audioCtx.sampleRate * dur);
      var buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = audioCtx.createBufferSource(); src.buffer = buf;
      var bp = audioCtx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 0.8;
      bp.frequency.setValueAtTime(1200, t);
      bp.frequency.exponentialRampToValueAtTime(2400, t + dur * 0.5);
      bp.frequency.exponentialRampToValueAtTime(900, t + dur);
      var g = audioCtx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.5, t + 0.15);
      g.gain.linearRampToValueAtTime(0, t + dur);
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start(t); src.stop(t + dur + 0.05);
    }
    var running = false;
    dialBtn.addEventListener("click", async function () {
      if (running) return;
      running = true;
      dialBtn.disabled = true;
      dialBtn.textContent = "CONNECTING…";
      screen.textContent = "";
      var lines = [];
      function say(t) { lines.push(t); screen.textContent = lines.join("\n"); }
      async function stage(pct, rateTxt, wait) {
        barFill.style.width = pct + "%";
        if (rateTxt) rate.textContent = rateTxt;
        await sleep(wait);
      }
      say("ATDT 022-…-1995   (the number is a reconstruction; the ritual is not)");
      tone(425, 0, 0.9);                       // dial tone
      await stage(8, "DIAL TONE", 950);
      var dtmf = [[941, 1209], [697, 1209], [697, 1336], [770, 1336], [852, 1209]];
      dtmf.forEach(function (pair, i) { tone(pair[0], i * 0.16, 0.11, "sine", 0.7); tone(pair[1], i * 0.16, 0.11, "sine", 0.7); });
      say("dialling…");
      await stage(22, "DIALLING", 900);
      say("remote modem answers — the handshake begins");
      tone(2100, 0, 1.25, "sine", 0.8, true);   // answer tone with warble
      await stage(42, "ANSWER TONE 2100 Hz", 1300);
      tone(2250, 0, 0.28); tone(1200, 0.32, 0.28); tone(2250, 0.64, 0.28);
      say("negotiating: two machines agreeing on a language");
      await stage(63, "NEGOTIATING V.34", 1000);
      hiss(0, 1.5);                             // the famous screech, as filtered noise
      say("training… (this noise was the sound of a door opening)");
      await stage(84, "TRAINING", 1550);
      tone(1180, 0, 0.12, "sine", 0.6); tone(1180, 0.18, 0.2, "sine", 0.6);
      say("CONNECT 9600");
      await stage(100, "CONNECTED · 9.6 kbit/s", 350);
      say("Welcome to 1995. A single photograph would take about a minute from here.");
      say("Chapter 1 is below. It starts in a room full of machines like this one.");
      dialBtn.textContent = "CONNECTED — READ CHAPTER 1 ↓";
      dialBtn.disabled = false;
      running = false;
      var ch1 = document.getElementById("chapter-1");
      dialBtn.onclick = function () { if (ch1) ch1.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); };
    });
  }
})();
