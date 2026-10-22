// DEAD TAB 3D layer (Three.js, self-hosted module).
// Two scenes, both progressive enhancement:
//  1. Hero: a dead browser tab drifting in the dark among lost pages.
//  2. The Archive Constellation: the museum's exhibits as a star map,
//     wired by their real related-exhibit links. Click a star, go there.
// If WebGL is unavailable, nothing renders and the page is unchanged.
import * as THREE from "./vendor/three.module.min.js";

const reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const EXHIBITS = window.DEADTAB_EXHIBITS || [];
const PALETTE = { accent: 0xa9c7ff, evidence: 0x83d6a3, warn: 0xe5b567, dim: 0x8b94a7, paper: 0xdfe6f2 };

function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  return renderer;
}
function watchVisibility(canvas, onChange) {
  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; onChange(visible && !document.hidden); }, { threshold: 0.02 }).observe(canvas);
  }
  document.addEventListener("visibilitychange", () => onChange(visible && !document.hidden));
  return () => visible && !document.hidden;
}

/* ================= Scene 1: the hero monolith ================= */
(function heroScene() {
  const canvas = document.getElementById("webglHero");
  if (!canvas) return;
  let renderer;
  try { renderer = makeRenderer(canvas); } catch (e) { return; }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08090d, 0.055);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  const world = new THREE.Group();
  scene.add(world);

  // The dead tab: an edged slab with the mark drawn on a canvas face.
  const tab = new THREE.Group();
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 2.3, 0.12),
    new THREE.MeshBasicMaterial({ color: 0x11141b })
  );
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(slab.geometry),
    new THREE.LineBasicMaterial({ color: PALETTE.accent, transparent: true, opacity: 0.95 })
  );
  tab.add(slab, edges);

  const face = document.createElement("canvas");
  face.width = 512; face.height = 346;
  const fx = face.getContext("2d");
  fx.fillStyle = "#0d1017"; fx.fillRect(0, 0, 512, 346);
  fx.strokeStyle = "#303541"; fx.lineWidth = 3; fx.strokeRect(10, 10, 492, 326);
  fx.fillStyle = "#A9C7FF";
  fx.beginPath(); fx.arc(52, 48, 9, 0, 7); fx.fill();
  fx.fillStyle = "#39404e";
  fx.beginPath(); fx.arc(86, 48, 9, 0, 7); fx.fill();
  fx.strokeStyle = "#303541"; fx.beginPath(); fx.moveTo(10, 78); fx.lineTo(502, 78); fx.stroke();
  fx.strokeStyle = "#E5B567"; fx.lineWidth = 13; fx.lineCap = "round";
  fx.beginPath(); fx.moveTo(206, 150); fx.lineTo(306, 250); fx.moveTo(306, 150); fx.lineTo(206, 250); fx.stroke();
  fx.fillStyle = "#A3AAB8"; fx.font = "600 25px monospace"; fx.textAlign = "center";
  fx.fillText("404 · SELF NOT FOUND", 256, 308);
  const faceTex = new THREE.CanvasTexture(face);
  const faceMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.3, 2.2),
    new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, opacity: 0.96 })
  );
  faceMesh.position.z = 0.07;
  tab.add(faceMesh);
  tab.position.set(2.75, 0.55, 0);
  tab.rotation.set(-0.08, -0.42, 0.05);
  world.add(tab);

  // Lost pages: small planes adrift, each on its own slow tumble.
  const pages = new THREE.Group();
  const pageGeo = new THREE.PlaneGeometry(0.52, 0.7);
  const pageMats = [PALETTE.paper, PALETTE.accent, PALETTE.dim].map((c) =>
    new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.34, side: THREE.DoubleSide }));
  const shards = [];
  for (let i = 0; i < 70; i++) {
    const m = new THREE.Mesh(pageGeo, pageMats[i % 3]);
    m.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 7.5, (Math.random() - 0.5) * 6 - 1);
    m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    m.userData = {
      rx: (Math.random() - 0.5) * 0.35, ry: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.05, seed: Math.random() * 10
    };
    shards.push(m); pages.add(m);
  }
  world.add(pages);

  // Dust of the archive.
  const dustGeo = new THREE.BufferGeometry();
  const N = 420, pos = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * (i % 3 === 1 ? 9 : 17);
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: PALETTE.accent, size: 0.045, transparent: true, opacity: 0.55, sizeAttenuation: true
  }));
  world.add(dust);

  let mx = 0, my = 0, tx = 0, ty = 0;
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches && !reduced) {
    window.addEventListener("pointermove", (ev) => {
      tx = (ev.clientX / window.innerWidth - 0.5) * 2;
      ty = (ev.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || 420;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let running = true;
  const isOn = watchVisibility(canvas, (v) => { running = v; });
  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    mx += (tx - mx) * 0.03; my += (ty - my) * 0.03;
    world.rotation.y = mx * 0.16 + (reduced ? 0 : Math.sin(t * 0.05) * 0.03);
    world.rotation.x = -my * 0.1;
    tab.position.y = 0.55 + (reduced ? 0 : Math.sin(t * 0.6) * 0.12);
    tab.rotation.y = -0.42 + (reduced ? 0 : Math.sin(t * 0.22) * 0.07);
    if (!reduced) {
      for (const s of shards) {
        s.rotation.x += s.userData.rx * 0.016;
        s.rotation.y += s.userData.ry * 0.016;
        s.position.y += Math.sin(t * 0.5 + s.userData.seed) * 0.0009 + s.userData.vy * 0.016;
        if (s.position.y > 4.4) s.position.y = -4.4;
        if (s.position.y < -4.4) s.position.y = 4.4;
      }
      dust.rotation.y = t * 0.012;
    }
    renderer.render(scene, camera);
    window.__DT3D = window.__DT3D || {};
    window.__DT3D.hero = true;
    if (reduced) running = false; // one still frame is the whole show
  }
  frame();
})();

/* ================= Scene 2: the Archive Constellation ================= */
(function constellation() {
  const canvas = document.getElementById("webglConstellation");
  if (!canvas || !EXHIBITS.length) return;
  let renderer;
  try { renderer = makeRenderer(canvas); } catch (e) { return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const group = new THREE.Group();
  scene.add(group);

  // Deterministic pseudo-random from the exhibit index: the map never reshuffles.
  function seeded(i, salt) {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  const STATUS_COLOR = { verified: "#83D6A3", documented: "#A9C7FF", partial: "#E5B567", uncertain: "#E58A8A", recollection: "#D8B4E2" };
  const nodes = new Map();
  const sprites = [];
  EXHIBITS.forEach((ex, i) => {
    const theta = seeded(i, 1) * Math.PI * 2;
    const phi = 0.5 + seeded(i, 2) * 2.1;
    const r = 4.6;
    const p = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi) * 0.72,
      r * Math.sin(phi) * Math.sin(theta)
    );
    nodes.set(ex.slug, p);

    const c = document.createElement("canvas");
    c.width = 320; c.height = 160;
    const g = c.getContext("2d");
    const col = STATUS_COLOR[ex.evidenceStatus] || "#A9C7FF";
    const grad = g.createRadialGradient(160, 62, 2, 160, 62, 46);
    grad.addColorStop(0, "#FFFFFF"); grad.addColorStop(0.25, col); grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad; g.beginPath(); g.arc(160, 62, 46, 0, 7); g.fill();
    g.fillStyle = "#F1F2F5"; g.font = "700 34px monospace"; g.textAlign = "center";
    g.fillText(ex.id, 160, 138);
    const tex = new THREE.CanvasTexture(c);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    spr.position.copy(p);
    spr.scale.set(2.5, 1.25, 1);
    spr.userData = { slug: ex.slug, title: ex.title };
    group.add(spr);
    sprites.push(spr);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(col) })
    );
    core.position.copy(p);
    group.add(core);
  });

  // Threads between related exhibits (the museum's real cross-links).
  const linePts = [];
  const drawn = new Set();
  EXHIBITS.forEach((ex) => {
    (ex.relatedExhibits || []).forEach((rel) => {
      const key = [ex.slug, rel].sort().join("|");
      if (drawn.has(key) || !nodes.has(rel)) return;
      drawn.add(key);
      linePts.push(nodes.get(ex.slug), nodes.get(rel));
    });
  });
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: PALETTE.accent, transparent: true, opacity: 0.4
  })));

  // Ambient stars.
  const starGeo = new THREE.BufferGeometry();
  const M = 260, sp = new Float32Array(M * 3);
  for (let i = 0; i < M * 3; i++) sp[i] = (Math.random() - 0.5) * (i % 3 === 1 ? 11 : 20);
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0x6b7690, size: 0.05, transparent: true, opacity: 0.8
  })));

  // Drag to rotate; click (no drag) to travel.
  let dragging = false, moved = 0, px = 0, py = 0, velY = 0.0016, velX = 0;
  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", (ev) => { dragging = true; moved = 0; px = ev.clientX; py = ev.clientY; canvas.setPointerCapture(ev.pointerId); });
  canvas.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const dx = ev.clientX - px, dy = ev.clientY - py;
    moved += Math.abs(dx) + Math.abs(dy);
    group.rotation.y += dx * 0.005;
    group.rotation.x += dy * 0.003;
    group.rotation.x = Math.max(-0.9, Math.min(0.9, group.rotation.x));
    velY = dx * 0.0006; velX = dy * 0.0003;
    px = ev.clientX; py = ev.clientY;
  });
  canvas.addEventListener("pointerup", (ev) => {
    dragging = false;
    if (moved > 6) return;
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.params.Sprite = { threshold: 0.6 };
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(sprites);
    if (hits.length) {
      const slug = hits[0].object.userData.slug;
      window.location.href = "exhibits/" + slug + ".html";
    }
  });

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || 380;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let running = true;
  watchVisibility(canvas, (v) => { running = v; });
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    if (!dragging && !reduced) {
      group.rotation.y += velY + 0.0012;
      group.rotation.x += velX;
      velX *= 0.95;
      group.rotation.x = Math.max(-0.9, Math.min(0.9, group.rotation.x));
    }
    renderer.render(scene, camera);
    window.__DT3D = window.__DT3D || {};
    window.__DT3D.constellation = true;
    if (reduced) running = false;
  }
  frame();
})();
