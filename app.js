const story = document.querySelector('.story');
const stage = document.querySelector('.stage');
const worldTrack = document.querySelector('.world-track');
const explorer = document.querySelector('.explorer');
const computer = document.querySelector('.analysis-computer');
const treeRef = document.querySelector('.tree-unhealthy') || document.querySelector('.tree-healthy');
const frames = [...document.querySelectorAll('.explorer-frame')];
const runImgs = frames.filter((el) => el.dataset.kind === 'run');
const actionImgs = frames.filter((el) => el.dataset.kind === 'action');
const beats = [...document.querySelectorAll('.beat')];
const progressBar = document.querySelector('.progress i');
const intro = document.querySelector('.intro');
const trail = document.querySelector('.data-trail');
const question = document.querySelector('.tree-signal');
const answer = document.querySelector('.solution-signal');
const shield = document.querySelector('.shield-ring');
const bloom = document.querySelector('.bloom');
const decay = document.querySelector('.tree-decay');
const healthyTree = document.querySelector('.tree-healthy');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

let target = 0;
let current = 0;
let raf = 0;
let lastTime = 0;
let lastPhase = -1;
let lastKey = '';
let lastRunning = false;
let runIndex = 0;
let runAcc = 0;
let storyStart = 0;
let storyDistance = 1;
let activeFrame = null;
let ready = false;
let baseLeftPx = 0;

// Timeline
const T = {
  introEnd: 0.05,
  diagnoseEnd: 0.11,
  runOutStart: 0.11,
  runOutEnd: 0.28,
  labStart: 0.28,
  labEnd: 0.52,
  runBackStart: 0.52,
  runBackEnd: 0.66,
  protectStart: 0.64,
  protectEnd: 0.74,
  growStart: 0.72,
  growEnd: 0.88,
  celebrateStart: 0.86,
};

const FRAME_MS = 100;
const BOB_MS = 360;
const BOB_PX = 1;
const DAMP_MS = 48;
const WORLD_TRAVEL = 48;

// Anclas visuales dentro del sprite (fracción del ancho del box)
const ART_CENTER_RUN = 0.45;
const ART_CENTER_LAB = 0.34; // action-2 está a la izquierda del canvas
const ART_CENTER_TREE = 0.40;

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const range = (n, a, b) => clamp((n - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (n) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};

function cacheMetrics() {
  if (!story) return;
  storyStart = story.getBoundingClientRect().top + window.scrollY;
  storyDistance = Math.max(1, story.offsetHeight - window.innerHeight);
  // left base del CSS (53vw etc.) en px respecto al stage
  if (explorer && stage) {
    const prev = explorer.style.left;
    const prevT = explorer.style.transform;
    explorer.style.left = '';
    explorer.style.transform = 'none';
    const er = explorer.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    baseLeftPx = er.left - sr.left;
    explorer.style.left = prev;
    explorer.style.transform = prevT;
  }
}

function readScroll() {
  target = clamp((window.scrollY - storyStart) / storyDistance);
  if (!raf) {
    lastTime = 0;
    raf = requestAnimationFrame(draw);
  }
}

function actionFor(p) {
  if (p < T.diagnoseEnd) return 0;
  if (p < T.runOutStart) return 1;
  if (p >= T.labStart && p < T.runBackStart) return 2;
  if (p >= T.protectStart && p < T.growStart) return 3;
  if (p >= T.growStart && p < T.celebrateStart) return 4;
  if (p >= T.celebrateStart) return 5;
  return 1;
}

function beatFor(p) {
  if (p < 0.14) return 0;
  if (p < 0.28) return 1;
  if (p < 0.52) return 2;
  if (p < 0.74) return 3;
  return 4;
}

function showFrame(el) {
  if (!el || el === activeFrame) return;
  if (activeFrame) activeFrame.classList.remove('is-on');
  el.classList.add('is-on');
  activeFrame = el;
}

function showRun(i) {
  const el = runImgs[i];
  if (!el) return;
  showFrame(el);
  lastKey = 'r' + i;
}

function showAction(i) {
  const el = actionImgs[i];
  if (!el) return;
  showFrame(el);
  lastKey = 'a' + i;
}

function travelAt(p) {
  const out = smooth(range(p, T.runOutStart, T.runOutEnd));
  const back = smooth(range(p, T.runBackStart, T.runBackEnd));
  if (p < T.runOutStart) return 0;
  if (p < T.runBackStart) return out;
  if (p < T.runBackEnd) return 1 - back;
  return 0;
}

// Objetivo en px (relativo al stage): centro del arte del personaje = punto de anclaje
function targetLeftForAnchor(anchorX, artCenter) {
  if (!explorer || !stage) return baseLeftPx;
  const w = explorer.offsetWidth || 1;
  const sr = stage.getBoundingClientRect();
  // anchorX es viewport X; convertir a left relativo al stage
  return anchorX - sr.left - w * artCenter;
}

function labAnchorX() {
  if (!computer) return null;
  const pc = computer.getBoundingClientRect();
  // Teclado / consola: ~22% desde la izquierda del asset de la PC
  return pc.left + pc.width * 0.22;
}

function treeAnchorX() {
  if (!treeRef) return null;
  const tr = treeRef.getBoundingClientRect();
  // Junto al tronco, lado derecho del árbol
  return tr.left + tr.width * 0.72;
}

function homeLeft() {
  return baseLeftPx;
}

function draw(time) {
  if (!ready) {
    raf = 0;
    return;
  }

  const delta = Math.min(32, lastTime ? time - lastTime : 16.7);
  lastTime = time;

  const damping = 1 - Math.exp(-delta / DAMP_MS);
  current = reduce ? target : lerp(current, target, damping);
  if (Math.abs(target - current) < 0.0004) current = target;

  const p = current;
  const travel = travelAt(p);
  const worldX = -travel * WORLD_TRAVEL;

  const running =
    (p >= T.runOutStart && p < T.runOutEnd) ||
    (p >= T.runBackStart && p < T.runBackEnd);
  const atLab = p >= T.labStart && p < T.runBackStart;
  const atTree = p >= T.runBackEnd;

  let facing = -1;
  if (running) facing = p >= T.runBackStart ? -1 : 1;
  else if (atLab) facing = 1;

  const bob = running ? Math.sin((time / BOB_MS) * Math.PI * 2) * BOB_PX : 0;

  // 1) Mover el mundo PRIMERO (así la PC ya está en su lugar al medir)
  if (worldTrack) worldTrack.style.transform = 'translate3d(' + worldX + 'vw,0,0)';

  // 2) Medir anclas reales en pantalla
  const labX = labAnchorX();
  const treeX = treeAnchorX();
  const home = homeLeft();

  let desiredLeft = home;
  if (p < T.runOutStart) {
    desiredLeft = home;
  } else if (p < T.labStart) {
    const t = smooth(range(p, T.runOutStart, T.runOutEnd));
    const labLeft = labX != null ? targetLeftForAnchor(labX, ART_CENTER_LAB) : home + window.innerWidth * 0.2;
    desiredLeft = lerp(home, labLeft, t);
  } else if (p < T.runBackStart) {
    // QUIETO frente al teclado de la PC
    desiredLeft = labX != null ? targetLeftForAnchor(labX, ART_CENTER_LAB) : home + window.innerWidth * 0.2;
  } else if (p < T.runBackEnd) {
    const t = smooth(range(p, T.runBackStart, T.runBackEnd));
    const labLeft = labX != null ? targetLeftForAnchor(labX, ART_CENTER_LAB) : home + window.innerWidth * 0.2;
    const treeLeft = treeX != null ? targetLeftForAnchor(treeX, ART_CENTER_TREE) : home - window.innerWidth * 0.15;
    desiredLeft = lerp(labLeft, treeLeft, t);
  } else {
    desiredLeft = treeX != null ? targetLeftForAnchor(treeX, ART_CENTER_TREE) : home - window.innerWidth * 0.15;
  }

  if (running) {
    if (!lastRunning) {
      runIndex = 0;
      runAcc = 0;
      lastRunning = true;
      showRun(0);
    }
    runAcc += delta;
    while (runAcc >= FRAME_MS) {
      runAcc -= FRAME_MS;
      runIndex = (runIndex + 1) % Math.max(runImgs.length, 1);
      showRun(runIndex);
    }
  } else {
    lastRunning = false;
    const a = actionFor(p);
    if (lastKey !== 'a' + a) showAction(a);
  }

  if (explorer) {
    explorer.style.left = desiredLeft + 'px';
    explorer.style.transform = 'translate3d(0,' + bob + 'px,0) scaleX(' + facing + ')';
    explorer.classList.toggle('at-lab', atLab);
    explorer.classList.toggle('at-tree', atTree);
  }

  if (progressBar) progressBar.style.transform = 'scaleX(' + p + ')';

  const introFade = range(p, 0.01, T.introEnd);
  if (intro) {
    intro.style.opacity = String(1 - introFade);
    intro.style.transform = 'translateY(' + -introFade * 12 + 'px)';
  }

  const phase = beatFor(p);
  if (phase !== lastPhase) {
    for (let i = 0; i < beats.length; i++) beats[i].classList.toggle('is-active', i === phase);
    lastPhase = phase;
  }

  if (question) question.style.opacity = String(1 - range(p, 0.04, 0.11));
  if (trail) {
    trail.style.opacity = String(
      range(p, 0.11, 0.17) * (1 - range(p, T.runOutEnd - 0.03, T.runOutEnd + 0.01))
    );
    trail.style.transform = 'scaleX(' + range(p, 0.11, T.runOutEnd - 0.02) + ')';
  }

  if (answer) {
    answer.style.opacity = String(
      range(p, T.labStart + 0.02, T.labStart + 0.07) *
        (1 - range(p, T.labEnd - 0.04, T.labEnd))
    );
  }

  const shieldT = range(p, T.protectStart, T.protectEnd);
  if (shield) {
    shield.style.opacity = String(shieldT);
    shield.style.transform = 'scale(' + lerp(0.75, 1, shieldT) + ')';
  }

  if (decay) decay.style.opacity = String(1 - range(p, T.growStart, T.growEnd));
  if (healthyTree) {
    const grow = range(p, T.growStart, T.growEnd);
    healthyTree.style.clipPath = 'inset(' + (100 - grow * 100) + '% 0 0)';
  }

  const bloomT = range(p, T.celebrateStart, 0.97);
  if (bloom) {
    bloom.style.opacity = String(bloomT);
    bloom.style.transform = 'scale(' + lerp(0.6, 1.12, bloomT) + ')';
  }

  if (current !== target || running) {
    raf = requestAnimationFrame(draw);
  } else {
    raf = 0;
    lastTime = 0;
  }
}

function boot() {
  ready = true;
  showAction(0);
  cacheMetrics();
  readScroll();
}

frames.forEach((img) => {
  if (img.decode) img.decode().catch(() => {});
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

const skip = document.querySelector('.skip');
if (skip) {
  skip.addEventListener('click', () => {
    const destination = document.querySelector('#servicios');
    if (!destination) return;
    destination.scrollIntoView();
    destination.focus({ preventScroll: true });
  });
}

window.addEventListener('scroll', readScroll, { passive: true });
window.addEventListener('resize', () => {
  cacheMetrics();
  readScroll();
});

/* --- Premium UX: header + reveals + continuum --- */
(function () {
  const header = document.querySelector('[data-header]');
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 28);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Continuum: highlight steps as the afterworld enters view
  const continuum = document.querySelector('.continuum');
  const steps = [...document.querySelectorAll('.continuum__step')];
  const bar = document.querySelector('.continuum__bar i');
  let stepTimer = 0;
  let stepIndex = 0;

  function setContinuum(i) {
    steps.forEach((el, n) => el.classList.toggle('is-hot', n === i));
    if (bar) bar.style.width = ((i + 1) / Math.max(steps.length, 1)) * 100 + '%';
  }

  function playContinuum() {
    if (!steps.length || reduceMotion) {
      setContinuum(steps.length - 1);
      return;
    }
    clearInterval(stepTimer);
    stepIndex = 0;
    setContinuum(0);
    stepTimer = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setContinuum(stepIndex);
    }, 1400);
  }

  if (continuum && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playContinuum();
          else clearInterval(stepTimer);
        });
      },
      { threshold: 0.4 }
    );
    cio.observe(continuum);
  }

  // Magnetic-ish hover on continuum steps
  steps.forEach((el, i) => {
    el.addEventListener('mouseenter', () => {
      if (reduceMotion) return;
      clearInterval(stepTimer);
      setContinuum(i);
    });
  });
  if (continuum) {
    continuum.addEventListener('mouseleave', () => {
      if (!reduceMotion) playContinuum();
    });
  }

  // Reveals
  const reveals = [...document.querySelectorAll('.reveal')];
  if (!reveals.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  );
  reveals.forEach((el) => io.observe(el));
})();

/* --- JUNGLA v100: follaje con masa, parallax y esporas --- */
(function () {
  const wrap = document.querySelector('[data-vines]');
  const sporesWrap = document.querySelector('[data-spores]');
  const afterworld = document.querySelector('.afterworld');
  const closing = document.querySelector('.closing');
  if (!wrap || !afterworld) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const svgNS = 'http://www.w3.org/2000/svg';

  function rng(seed) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  // ---------- Racimo de hojas (masa visual) ----------
  function makeCluster(r, x, y, dir, scale, bright, index) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'vine__cluster' + (bright ? ' vine__cluster--bright' : ''));
    g.style.setProperty('--ox', x + 'px');
    g.style.setProperty('--oy', y + 'px');
    g.style.setProperty('--ci', index);

    const leaves = 5 + Math.floor(r() * 4); // 5-8 hojas
    const baseAng = dir === 1 ? -20 : 200;
    for (let i = 0; i < leaves; i++) {
      const ang = baseAng + (i - leaves / 2) * (34 + r() * 10) * (dir === 1 ? 1 : -1);
      const dist = (10 + r() * 8) * scale;
      const rad = (ang * Math.PI) / 180;
      const lx = x + Math.cos(rad) * dist * dir;
      const ly = y + Math.sin(rad) * dist;
      const leaf = document.createElementNS(svgNS, 'ellipse');
      leaf.setAttribute('cx', lx);
      leaf.setAttribute('cy', ly);
      leaf.setAttribute('rx', (16 + r() * 12) * scale);
      leaf.setAttribute('ry', (6 + r() * 3.5) * scale);
      leaf.setAttribute('transform', `rotate(${ang} ${lx} ${ly})`);
      const tone = r();
      if (tone > 0.66) leaf.setAttribute('class', 'leaf-hi');
      else if (tone < 0.3) leaf.setAttribute('class', 'leaf-deep');
      g.appendChild(leaf);
    }
    return g;
  }

  // ---------- Zarcillo en espiral ----------
  function makeTendril(x, y, dir, scale) {
    const p = document.createElementNS(svgNS, 'path');
    const s = 14 * scale;
    const d = `M${x},${y} q${dir * s},${s * 0.5} ${dir * s * 0.6},${s * 1.2} q${-dir * s * 0.7},${s * 0.5} ${-dir * s * 0.3},${s * 1.1} q${dir * s * 0.5},${s * 0.3} ${dir * s * 0.2},${s * 0.7}`;
    p.setAttribute('d', d);
    p.setAttribute('class', 'vine__tendril');
    return p;
  }

  const sides = [
    { front: wrap.querySelector('.vine--left'), back: wrap.querySelector('.vine-back--left'), dir: 1, grad: 'vineGradL' },
    { front: wrap.querySelector('.vine--right'), back: wrap.querySelector('.vine-back--right'), dir: -1, grad: 'vineGradR' },
  ];
  const layers = [];
  const vines = [];

  function buildBack(svg, dir, H, seed) {
    if (!svg) return;
    svg.innerHTML = '';
    const W = 340;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const r = rng(seed);
    const edge = dir === 1 ? -40 : W + 40;
    // blobs de follaje grandes, espaciados
    for (let y = 120; y < H - 100; y += 320 + r() * 260) {
      const blob = document.createElementNS(svgNS, 'g');
      const n = 4 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) {
        const e = document.createElementNS(svgNS, 'ellipse');
        const bx = edge + dir * (30 + r() * 130);
        const by = y + (r() - 0.5) * 130;
        e.setAttribute('cx', bx);
        e.setAttribute('cy', by);
        e.setAttribute('rx', 46 + r() * 50);
        e.setAttribute('ry', 18 + r() * 14);
        e.setAttribute('transform', `rotate(${(r() - 0.5) * 60} ${bx} ${by})`);
        e.setAttribute('fill', r() > 0.5 ? '#4f8a5c' : '#3d7350');
        blob.appendChild(e);
      }
      svg.appendChild(blob);
    }
  }

  function build() {
    const H = afterworld.scrollHeight;
    layers.length = 0;
    vines.length = 0;

    sides.forEach((side, si) => {
      buildBack(side.back, side.dir, H, 91 + si * 13);
      if (side.back) layers.push({ el: side.back, f: 0.06 });

      const svg = side.front;
      if (!svg) return;
      svg.innerHTML = '';
      const W = 260;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      layers.push({ el: svg, f: 0.12 });

      const defs = document.createElementNS(svgNS, 'defs');
      const grad = document.createElementNS(svgNS, 'linearGradient');
      grad.setAttribute('id', side.grad);
      grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
      grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
      [['0%', '#4f8a5c'], ['42%', '#0a6f69'], ['72%', '#7fe8df'], ['100%', '#9fd8ac']].forEach(([o, c]) => {
        const stop = document.createElementNS(svgNS, 'stop');
        stop.setAttribute('offset', o);
        stop.setAttribute('stop-color', c);
        grad.appendChild(stop);
      });
      defs.appendChild(grad);
      svg.appendChild(defs);

      const r = rng(42 + si * 7);
      const edge = side.dir === 1 ? 26 : W - 26;
      const amp = 52;
      const seg = 250;
      let d = `M${edge},0`;
      const pts = [[edge, 0]];
      for (let y = seg; y <= H + seg; y += seg) {
        const sway = Math.sin(y / 430 + si) * amp * (0.6 + r() * 0.5);
        const x = edge + side.dir * (14 + Math.abs(sway));
        const prev = pts[pts.length - 1];
        d += ` C${prev[0] + side.dir * 10},${y - seg * 0.62} ${x - side.dir * 8},${y - seg * 0.3} ${x},${y}`;
        pts.push([x, y]);
      }

      // halo, tallo principal y secundario
      const glow = document.createElementNS(svgNS, 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('class', 'vine__glow');
      svg.appendChild(glow);

      const stem = document.createElementNS(svgNS, 'path');
      stem.setAttribute('d', d);
      stem.setAttribute('class', 'vine__stem');
      svg.appendChild(stem);

      const stem2 = document.createElementNS(svgNS, 'path');
      stem2.setAttribute('d', d);
      stem2.setAttribute('class', 'vine__stem vine__stem--thin');
      stem2.setAttribute('transform', `translate(${side.dir * 14},60)`);
      svg.appendChild(stem2);

      const len = stem.getTotalLength();
      [ [glow, len], [stem, len], [stem2, stem2.getTotalLength()] ].forEach(([el, l]) => {
        el.style.strokeDasharray = String(l);
        el.style.strokeDashoffset = String(l);
      });

      // decoración: racimos, zarcillos, nodos
      const deco = [];
      const every = 190;
      let ci = 0;
      for (let t = every; t < len - 90; t += every) {
        const p = stem.getPointAtLength(t);
        const frac = t / len;
        const bright = frac > 0.3 && frac < 0.62;
        const kind = Math.floor(t / every) % 4;

        if (kind === 3) {
          const node = document.createElementNS(svgNS, 'circle');
          node.setAttribute('cx', p.x); node.setAttribute('cy', p.y);
          node.setAttribute('r', 4.5);
          node.setAttribute('class', 'vine__node' + (bright ? ' vine__node--bright' : ''));
          svg.appendChild(node);
          deco.push({ el: node, at: frac });
          const ring = document.createElementNS(svgNS, 'circle');
          ring.setAttribute('cx', p.x); ring.setAttribute('cy', p.y);
          ring.setAttribute('r', 9);
          ring.setAttribute('class', 'vine__node-ring');
          ring.style.transformOrigin = `${p.x}px ${p.y}px`;
          svg.appendChild(ring);
          deco.push({ el: ring, at: frac });
        } else if (kind === 2) {
          const tn = makeTendril(p.x + side.dir * 6, p.y, side.dir, 0.9 + r() * 0.5);
          svg.appendChild(tn);
          deco.push({ el: tn, at: frac });
        } else {
          const scale = 0.85 + r() * 0.6;
          const cl = makeCluster(r, p.x + side.dir * 8, p.y, side.dir, scale, bright, ci++);
          svg.appendChild(cl);
          deco.push({ el: cl, at: frac });
        }
      }

      vines.push({ glow, stem, stem2, len, len2: stem2.getTotalLength(), deco });
    });
  }

  // ---------- Esporas ----------
  function buildSpores() {
    if (!sporesWrap || reduceMotion) return;
    sporesWrap.innerHTML = '';
    const r = rng(777);
    const N = 26;
    for (let i = 0; i < N; i++) {
      const s = document.createElement('span');
      const kind = r();
      s.className = 'spore ' + (kind > 0.72 ? 'spore--data' : kind > 0.6 ? 'spore--gold' : 'spore--leaf');
      const size = 3 + r() * 6;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = (r() * 100) + '%';
      s.style.top = (8 + r() * 88) + '%';
      s.style.setProperty('--dur', (11 + r() * 14) + 's');
      s.style.setProperty('--delay', (-r() * 20) + 's');
      s.style.setProperty('--driftX', ((r() - 0.5) * 90) + 'px');
      s.style.setProperty('--op', (0.35 + r() * 0.45).toFixed(2));
      sporesWrap.appendChild(s);
    }
  }

  // ---------- Scroll: crecimiento + parallax ----------
  let ticking = false;

  function progress() {
    const rect = afterworld.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh * 0.2;
    const done = Math.min(Math.max(vh * 0.85 - rect.top, 0), total);
    return total > 0 ? done / total : 0;
  }

  function drawFrame() {
    ticking = false;
    const p = reduceMotion ? 1 : progress();

    vines.forEach((v) => {
      v.glow.style.strokeDashoffset = String(v.len * (1 - p));
      v.stem.style.strokeDashoffset = String(v.len * (1 - p));
      v.stem2.style.strokeDashoffset = String(v.len2 * (1 - Math.max(0, p - 0.04)));
      v.deco.forEach((d) => d.el.classList.toggle('is-on', p >= d.at));
    });

    // parallax por capa
    if (!reduceMotion) {
      const rect = afterworld.getBoundingClientRect();
      layers.forEach((l) => {
        const py = rect.top * l.f * -1;
        l.el.style.transform = `translate3d(0,${py}px,0)`;
      });
    }

    if (closing) {
      const cr = closing.getBoundingClientRect();
      if (cr.top < window.innerHeight * 0.72) closing.classList.add('is-flora');
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(drawFrame);
    }
  }

  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      drawFrame();
    }, 200);
  }

  build();
  buildSpores();
  drawFrame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
})();
