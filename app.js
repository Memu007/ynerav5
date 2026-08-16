const story = document.querySelector('.story');
const stage = document.querySelector('.stage');
const camera = document.querySelector('[data-camera]');
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
let storyStart = 0;
let storyDistance = 1;
let activeFrame = null;
let ready = false;
let baseLeftPx = 0;
let stageLeft = 0;
let explorerW = 1;
let pcBaseX = null; // ancla PC con mundo en 0 (se mide una vez)
let treeBaseX = null; // ancla árbol con mundo en 0
let prevLeft = null;
let runDist = 0;
let runSegment = 0;
let stepAcc = 0;
let faceCur = -1;
let leanCur = 0;
let camX = 0;
let camZ = 1;
let shakeT = 0;
let dustPool = [];
let dustIdx = 0;
let landTimer = 0;
let dashTimer = 0;
let prevP = 0;
let sparkPool = [];
let shockDone = false;
let burstDone = false;

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

const MAX_GAP = 0.28; // catch-up máximo del damping (evita sprints infinitos)
const FLIP_MIN = 0.35; // ancho mínimo visible durante el giro (nunca colapsa a 0)
const CAM_LOOKAHEAD = 90; // px que la cámara adelanta en la dirección de carrera
const CAM_ZOOM = 0.035; // zoom máximo por velocidad
const CAM_MS = 260; // suavidad de la cámara (más lenta que el personaje)
const RUN_STEP_PX = 26; // px recorridos por frame de zancada (piernas pegadas al suelo)
const BOB_PX = 2.4;
const STRIDE_PX = 15; // longitud de onda del bob
const DAMP_MS = 130; // inercia del scroll: sedosa, sin lag molesto
const FACE_MS = 90; // giro suave al cambiar de dirección
const LEAN_MAX = 5; // grados de inclinación al correr
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
  // Medimos TODO una sola vez con el mundo en 0; por frame solo aritmética
  const prevWorld = worldTrack ? worldTrack.style.transform : '';
  if (worldTrack) worldTrack.style.transform = 'none';
  if (explorer && stage) {
    const prevT = explorer.style.transform;
    explorer.style.left = '';
    explorer.style.transform = 'none';
    const er = explorer.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    stageLeft = sr.left;
    baseLeftPx = er.left - sr.left;
    explorerW = explorer.offsetWidth || 1;
    explorer.style.transform = prevT;
  }
  if (computer) {
    const pc = computer.getBoundingClientRect();
    pcBaseX = pc.left + pc.width * 0.22; // teclado/consola
  }
  if (treeRef) {
    const tr = treeRef.getBoundingClientRect();
    treeBaseX = tr.left + tr.width * 0.72; // junto al tronco
  }
  if (worldTrack) worldTrack.style.transform = prevWorld;
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

// Objetivo en px (relativo al stage). Sin lecturas de layout: pura aritmética.
function targetLeftForAnchor(anchorX, artCenter) {
  return anchorX - stageLeft - explorerW * artCenter;
}

function homeLeft() {
  return baseLeftPx;
}

// --- Polvo de pisadas: pool de 10 partículas en coordenadas del mundo ---
function initDust() {
  if (!worldTrack || reduce) return;
  dustPool = [];
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('span');
    d.className = 'dust';
    worldTrack.appendChild(d);
    dustPool.push(d);
  }
}

function spawnDust(feetScreenX, worldXpx, dir) {
  if (!dustPool.length) return;
  const d = dustPool[dustIdx];
  dustIdx = (dustIdx + 1) % dustPool.length;
  // pantalla → coordenada dentro del track (que ya está trasladado)
  const xInTrack = feetScreenX - stageLeft - worldXpx;
  d.style.left = xInTrack + 'px';
  d.style.bottom = '16.5vh';
  // WAAPI: reinicia sin forzar reflow (antes: void offsetWidth por pisada)
  const drift = -dir * (12 + Math.random() * 10);
  d.animate(
    [
      { opacity: 0.8, transform: 'translate3d(0,0,0) scale(.5)' },
      { opacity: 0, transform: 'translate3d(' + drift + 'px,-10px,0) scale(1.6)' },
    ],
    { duration: 500, easing: 'ease-out', fill: 'forwards' }
  );
}

function squash(cls) {
  if (!explorer || reduce) return;
  explorer.classList.add(cls);
  const t = cls === 'is-land' ? landTimer : dashTimer;
  clearTimeout(t);
  const id = setTimeout(() => explorer.classList.remove(cls), 400);
  if (cls === 'is-land') landTimer = id;
  else dashTimer = id;
}

// --- Vida ambiente: motas de luz en el mundo ---
function initAmbient() {
  const world = document.querySelector('.world');
  if (!world || reduce) return;
  for (let i = 0; i < 14; i++) {
    const m = document.createElement('span');
    m.className = 'mote' + (Math.random() > 0.6 ? ' mote--teal' : '');
    const size = 3 + Math.random() * 5;
    m.style.width = size + 'px';
    m.style.height = size + 'px';
    m.style.left = Math.random() * 100 + '%';
    m.style.top = 18 + Math.random() * 60 + '%';
    m.style.setProperty('--mdur', 7 + Math.random() * 8 + 's');
    m.style.setProperty('--mdel', -Math.random() * 12 + 's');
    m.style.setProperty('--mx', (Math.random() - 0.5) * 40 + 'px');
    m.style.setProperty('--my', -(14 + Math.random() * 26) + 'px');
    m.style.setProperty('--mop', (0.3 + Math.random() * 0.4).toFixed(2));
    world.appendChild(m);
  }
}

// --- Chispas doradas del festejo (pool one-shot) ---
function initSparks() {
  if (!worldTrack || reduce) return;
  sparkPool = [];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    worldTrack.appendChild(s);
    sparkPool.push(s);
  }
}

function celebrationBurst() {
  if (!sparkPool.length || treeBaseX == null) return;
  const xInTrack = treeBaseX - stageLeft;
  sparkPool.forEach((s, i) => {
    const ang = (i / sparkPool.length) * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    s.style.left = xInTrack + (Math.random() - 0.5) * 30 + 'px';
    s.style.bottom = 42 + Math.random() * 8 + 'vh';
    s.style.setProperty('--sx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--sy', -Math.abs(Math.sin(ang)) * dist - 40 + 'px');
    s.classList.remove('is-live');
    void s.offsetWidth;
    setTimeout(() => s.classList.add('is-live'), i * 28);
  });
}

function draw(time) {
  if (!ready) {
    raf = 0;
    return;
  }

  const delta = Math.min(32, lastTime ? time - lastTime : 16.7);
  lastTime = time;

  const damping = 1 - Math.exp(-delta / DAMP_MS);
  // Catch-up acotado: si el scroll saltó lejos, acercamos el punto de partida
  if (!reduce) {
    const gap = target - current;
    if (Math.abs(gap) > MAX_GAP) current = target - Math.sign(gap) * MAX_GAP;
  }
  current = reduce ? target : lerp(current, target, damping);
  if (Math.abs(target - current) < 0.0004) current = target;

  const p = current;
  const travel = travelAt(p);
  const worldX = -travel * WORLD_TRAVEL;
  const worldXpx = (worldX / 100) * window.innerWidth;

  const running =
    (p >= T.runOutStart && p < T.runOutEnd) ||
    (p >= T.runBackStart && p < T.runBackEnd);
  const atLab = p >= T.labStart && p < T.runBackStart;
  const atTree = p >= T.runBackEnd;

  let facing = -1;
  if (running) facing = p >= T.runBackStart ? -1 : 1;
  else if (atLab) facing = 1;

  if (worldTrack) worldTrack.style.transform = 'translate3d(' + worldX + 'vw,0,0)';

  // Anclas por aritmética (cero reflow): base medida una vez + desplazamiento del mundo
  const labX = pcBaseX != null ? pcBaseX + worldXpx : null;
  const treeX = treeBaseX != null ? treeBaseX + worldXpx : null;
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

  // Velocidad real del personaje (px/ms): piernas y cuerpo responden a ella
  const dLeft = prevLeft == null ? 0 : desiredLeft - prevLeft;
  prevLeft = desiredLeft;
  const vel = dLeft / Math.max(delta, 1);
  const speedNorm = clamp(Math.abs(vel) / 0.5);

  const feetScreenX = stageLeft + desiredLeft + explorerW * 0.45;

  if (running) {
    if (!lastRunning) {
      lastRunning = true;
      stepAcc = 0;
      runSegment = 0;
      showRun(runIndex);
      if (speedNorm < 0.9) squash('is-dash'); // sin spam en catch-up violento
    }
    // Zancada ligada a distancia: salto directo de N frames en un solo toggle
    stepAcc += Math.abs(dLeft);
    const steps = Math.floor(stepAcc / RUN_STEP_PX);
    if (steps > 0) {
      stepAcc -= steps * RUN_STEP_PX;
      runIndex = (runIndex + steps) % Math.max(runImgs.length, 1);
      showRun(runIndex);
      // máximo 1 nube por frame (antes: una por pisada → 20 reflows en fast scroll)
      if (speedNorm > 0.25) spawnDust(feetScreenX, worldXpx, facing);
    }
    runDist += Math.abs(dLeft);
    runSegment += Math.abs(dLeft);
  } else {
    if (lastRunning && runSegment > 60) {
      // llegó a destino tras una corrida real: squash + golpe de cámara
      squash('is-land');
      shakeT = Math.max(shakeT, 0.8);
    }
    lastRunning = false;
    const a = actionFor(p);
    if (lastKey !== 'a' + a) showAction(a);
  }

  // Bob por distancia (no por tiempo) + lean según velocidad, ambos suaves
  const bob = Math.sin(runDist / STRIDE_PX) * BOB_PX * (running ? speedNorm : 0);
  const leanTarget = running ? clamp(vel * 10, -LEAN_MAX, LEAN_MAX) : 0;
  leanCur = lerp(leanCur, leanTarget, damping);
  const faceDamp = 1 - Math.exp(-delta / FACE_MS);
  faceCur = lerp(faceCur, facing, reduce ? 1 : faceDamp);
  // El giro nunca colapsa el sprite: ancho mínimo garantizado durante el flip
  const faceVis = (faceCur < 0 ? -1 : 1) * Math.max(Math.abs(faceCur), FLIP_MIN);

  if (explorer) {
    const dx = desiredLeft - baseLeftPx;
    explorer.style.transform =
      'translate3d(' + dx + 'px,' + bob + 'px,0) rotate(' + leanCur + 'deg) scaleX(' + faceVis + ')';
    explorer.classList.toggle('at-lab', atLab);
    explorer.classList.toggle('at-tree', atTree);
  }

  // --- Cámara: lookahead + zoom por velocidad + shake de impacto ---
  if (camera && !reduce) {
    const camDamp = 1 - Math.exp(-delta / CAM_MS);
    const lookTarget = running ? -facing * CAM_LOOKAHEAD * speedNorm : 0;
    camX = lerp(camX, lookTarget, camDamp);
    camZ = lerp(camZ, 1 + CAM_ZOOM * speedNorm, camDamp);
    let shakeX = 0;
    let shakeY = 0;
    if (shakeT > 0.01) {
      shakeT *= Math.exp(-delta / 90);
      shakeX = Math.sin(time / 14) * 5 * shakeT;
      shakeY = Math.cos(time / 11) * 3 * shakeT;
    } else {
      shakeT = 0;
    }
    camera.style.transform =
      'translate3d(' + (camX + shakeX) + 'px,' + shakeY + 'px,0) scale(' + camZ + ')';
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
    // Onda expansiva única al activarse el escudo
    if (!shockDone && prevP < T.protectStart && p >= T.protectStart) {
      shockDone = true;
      shield.classList.add('is-shock');
      setTimeout(() => shield.classList.remove('is-shock'), 800);
      shakeT = Math.max(shakeT, 0.5);
    }
    if (p < T.protectStart - 0.05) shockDone = false;
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

  // Explosión dorada al entrar al festejo (una vez por pasada)
  if (!burstDone && prevP < T.celebrateStart && p >= T.celebrateStart && !reduce) {
    burstDone = true;
    celebrationBurst();
    shakeT = Math.max(shakeT, 0.7);
  }
  if (p < T.celebrateStart - 0.06) burstDone = false;

  prevP = p;

  const settling =
    Math.abs(target - current) > 0.00005 ||
    Math.abs(vel) > 0.02 ||
    Math.abs(faceCur - facing) > 0.02 ||
    Math.abs(leanCur) > 0.1 ||
    Math.abs(camX) > 0.5 ||
    Math.abs(camZ - 1) > 0.002 ||
    shakeT > 0;
  if (settling) {
    raf = requestAnimationFrame(draw);
  } else {
    faceCur = facing;
    leanCur = 0;
    raf = 0;
    lastTime = 0;
  }
}

function boot() {
  ready = true;
  showAction(0);
  cacheMetrics();
  initDust();
  initAmbient();
  initSparks();
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

  let continuumPlayed = false;
  function playContinuum() {
    if (!steps.length || reduceMotion) {
      setContinuum(steps.length - 1);
      return;
    }
    if (continuumPlayed) return; // una sola pasada: motion con proposito
    continuumPlayed = true;
    clearInterval(stepTimer);
    stepIndex = 0;
    setContinuum(0);
    stepTimer = setInterval(() => {
      stepIndex += 1;
      setContinuum(Math.min(stepIndex, steps.length - 1));
      if (stepIndex >= steps.length - 1) clearInterval(stepTimer);
    }, 900);
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
      if (!reduceMotion) setContinuum(steps.length - 1);
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

/* --- NEURAL v150: columna de datos con acentos orgánicos --- */
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

  // ---------- Neurona: nodo central + satélites conectados ----------
  function makeNeural(r, x, y, dir, bright) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'vine__neural' + (bright ? ' vine__neural--bright' : ''));
    const sats = 3 + Math.floor(r() * 2);
    const center = document.createElementNS(svgNS, 'circle');
    center.setAttribute('cx', x); center.setAttribute('cy', y);
    center.setAttribute('r', 4);
    center.setAttribute('class', 'vine__neuron');
    const satPts = [];
    for (let i = 0; i < sats; i++) {
      const ang = (dir === 1 ? -60 : 120) + i * (140 / sats) + r() * 24;
      const rad = (ang * Math.PI) / 180;
      const dist = 18 + r() * 26;
      const sx = x + Math.cos(rad) * dist;
      const sy = y + Math.sin(rad) * dist;
      satPts.push([sx, sy]);
      const syn = document.createElementNS(svgNS, 'line');
      syn.setAttribute('x1', x); syn.setAttribute('y1', y);
      syn.setAttribute('x2', sx); syn.setAttribute('y2', sy);
      syn.setAttribute('class', 'vine__syn');
      g.appendChild(syn);
      const sat = document.createElementNS(svgNS, 'circle');
      sat.setAttribute('cx', sx); sat.setAttribute('cy', sy);
      sat.setAttribute('r', 1.8 + r() * 1.2);
      sat.setAttribute('class', 'vine__sat');
      g.appendChild(sat);
    }
    // conexión lateral entre dos satélites (red, no árbol)
    if (satPts.length > 2 && r() > 0.4) {
      const [a, b] = [satPts[0], satPts[satPts.length - 1]];
      const link = document.createElementNS(svgNS, 'line');
      link.setAttribute('x1', a[0]); link.setAttribute('y1', a[1]);
      link.setAttribute('x2', b[0]); link.setAttribute('y2', b[1]);
      link.setAttribute('class', 'vine__syn vine__syn--far');
      g.appendChild(link);
    }
    g.appendChild(center);
    return g;
  }

  // ---------- Traza PCB ----------
  function makeCircuit(r, x, y, dir) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'vine__circuit');
    const len1 = 18 + r() * 22;
    const len2 = 12 + r() * 16;
    const up = r() > 0.5 ? -1 : 1;
    const midX = x + dir * len1;
    const endY = y + up * len2;
    const trace = document.createElementNS(svgNS, 'path');
    trace.setAttribute('d', `M${x},${y} H${midX} V${endY}`);
    trace.setAttribute('class', 'vine__trace');
    g.appendChild(trace);
    const pad = document.createElementNS(svgNS, 'circle');
    pad.setAttribute('cx', midX); pad.setAttribute('cy', endY);
    pad.setAttribute('r', 3);
    pad.setAttribute('class', 'vine__pad');
    g.appendChild(pad);
    return g;
  }

  // ---------- Chip con pines ----------
  function makeChip(r, x, y, dir) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'vine__chipblock');
    const w = 16, hh = 20;
    const cx = x + dir * 16;
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', cx - w / 2); rect.setAttribute('y', y - hh / 2);
    rect.setAttribute('width', w); rect.setAttribute('height', hh);
    rect.setAttribute('rx', 2);
    rect.setAttribute('class', 'vine__chip');
    // conector al tallo
    const lead = document.createElementNS(svgNS, 'line');
    lead.setAttribute('x1', x); lead.setAttribute('y1', y);
    lead.setAttribute('x2', cx - dir * w / 2); lead.setAttribute('y2', y);
    lead.setAttribute('class', 'vine__trace');
    g.appendChild(lead);
    g.appendChild(rect);
    for (let i = 0; i < 3; i++) {
      const py = y - hh / 2 + 5 + i * 5;
      const pin = document.createElementNS(svgNS, 'line');
      pin.setAttribute('x1', cx + w / 2); pin.setAttribute('y1', py);
      pin.setAttribute('x2', cx + w / 2 + 5); pin.setAttribute('y2', py);
      pin.setAttribute('class', 'vine__trace');
      g.appendChild(pin);
    }
    return g;
  }

  // ---------- Brote verde: el acento orgánico (escaso) ----------
  function makeSprig(r, x, y, dir) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'vine__cluster');
    g.style.setProperty('--ox', x + 'px');
    g.style.setProperty('--oy', y + 'px');
    for (let i = 0; i < 3; i++) {
      const ang = (dir === 1 ? -46 : 210) + i * 34;
      const rad = (ang * Math.PI) / 180;
      const lx = x + Math.cos(rad) * 10 * dir;
      const ly = y + Math.sin(rad) * 10;
      const leaf = document.createElementNS(svgNS, 'ellipse');
      leaf.setAttribute('cx', lx); leaf.setAttribute('cy', ly);
      leaf.setAttribute('rx', 11 + r() * 5);
      leaf.setAttribute('ry', 4 + r() * 2);
      leaf.setAttribute('transform', `rotate(${ang} ${lx} ${ly})`);
      if (i === 1) leaf.setAttribute('class', 'leaf-hi');
      g.appendChild(leaf);
    }
    return g;
  }

  const sides = [
    { front: wrap.querySelector('.vine--left'), back: wrap.querySelector('.vine-back--left'), dir: 1, grad: 'vineGradL' },
    { front: wrap.querySelector('.vine--right'), back: wrap.querySelector('.vine-back--right'), dir: -1, grad: 'vineGradR' },
  ];
  const layers = [];
  const vines = [];

  // Capa trasera: malla hexagonal + anillos tenues (nada de follaje)
  function buildBack(svg, dir, H, seed) {
    if (!svg) return;
    svg.innerHTML = '';
    const W = 340;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const r = rng(seed);
    const edge = dir === 1 ? 60 : W - 60;
    function hexPts(cx, cy, rad) {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        pts.push((cx + rad * Math.cos(a)).toFixed(1) + ',' + (cy + rad * Math.sin(a)).toFixed(1));
      }
      return pts.join(' ');
    }
    for (let y = 160; y < H - 120; y += 300 + r() * 300) {
      const cx = edge + dir * (r() * 90);
      const rad = 26 + r() * 44;
      const hex = document.createElementNS(svgNS, 'polygon');
      hex.setAttribute('points', hexPts(cx, y, rad));
      hex.setAttribute('class', 'back__hex');
      svg.appendChild(hex);
      if (r() > 0.5) {
        const hex2 = document.createElementNS(svgNS, 'polygon');
        hex2.setAttribute('points', hexPts(cx + dir * (rad * 1.9), y + rad * 1.1, rad * 0.6));
        hex2.setAttribute('class', 'back__hex back__hex--dim');
        svg.appendChild(hex2);
        const link = document.createElementNS(svgNS, 'line');
        link.setAttribute('x1', cx + dir * rad * 0.87); link.setAttribute('y1', y + rad * 0.5);
        link.setAttribute('x2', cx + dir * (rad * 1.9 - rad * 0.52)); link.setAttribute('y2', y + rad * 1.1 - rad * 0.3);
        link.setAttribute('class', 'back__link');
        svg.appendChild(link);
      }
      if (r() > 0.62) {
        const ring = document.createElementNS(svgNS, 'circle');
        ring.setAttribute('cx', cx - dir * 40); ring.setAttribute('cy', y + 130);
        ring.setAttribute('r', 14 + r() * 20);
        ring.setAttribute('class', 'back__ring');
        svg.appendChild(ring);
      }
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
      [['0%', '#0a6f69'], ['40%', '#12a39a'], ['75%', '#7fe8df'], ['100%', '#0a6f69']].forEach(([o, c]) => {
        const stop = document.createElementNS(svgNS, 'stop');
        stop.setAttribute('offset', o);
        stop.setAttribute('stop-color', c);
        grad.appendChild(stop);
      });
      defs.appendChild(grad);
      svg.appendChild(defs);

      // Columna de datos: tramos rectos con quiebres a 45° (circuito, no planta)
      const r = rng(42 + si * 7);
      let x = side.dir === 1 ? 34 : W - 34;
      let y = 0;
      let d = `M${x},0`;
      while (y < H) {
        const run = 170 + r() * 230;
        y += run;
        d += ` L${x},${Math.min(y, H)}`;
        if (y < H - 220 && r() > 0.35) {
          const shift = (14 + r() * 30) * (r() > 0.5 ? 1 : -1);
          const nx = Math.max(16, Math.min(W - 16, x + shift));
          const dy = Math.abs(nx - x); // 45°
          y += dy;
          d += ` L${nx},${Math.min(y, H)}`;
          x = nx;
        }
      }

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
      stem2.setAttribute('transform', `translate(${side.dir * 10},34)`);
      svg.appendChild(stem2);

      const len = stem.getTotalLength();
      [[glow, len], [stem, len], [stem2, stem2.getTotalLength()]].forEach(([el, l]) => {
        el.style.strokeDasharray = String(l);
        el.style.strokeDashoffset = String(l);
      });

      // Pulsos de datos recorriendo la columna
      for (let k = 0; k < 3; k++) {
        const pulse = document.createElementNS(svgNS, 'circle');
        pulse.setAttribute('r', 3.2);
        pulse.setAttribute('class', 'vine__pulse');
        pulse.style.offsetPath = `path('${d}')`;
        pulse.style.animationDuration = (7 + k * 2.6) + 's';
        pulse.style.animationDelay = (-k * 3.2) + 's';
        svg.appendChild(pulse);
      }

      // Decoración: 5 tech / 1 orgánico
      const deco = [];
      const every = 175;
      for (let t = every; t < len - 90; t += every) {
        const pt = stem.getPointAtLength(t);
        const frac = t / len;
        const bright = frac > 0.28 && frac < 0.64;
        const kind = Math.floor(t / every) % 6;
        let el;
        if (kind === 0 || kind === 3) el = makeNeural(r, pt.x, pt.y, side.dir, bright);
        else if (kind === 1) el = makeCircuit(r, pt.x, pt.y, side.dir);
        else if (kind === 2) el = makeChip(r, pt.x, pt.y, side.dir);
        else if (kind === 4) {
          el = document.createElementNS(svgNS, 'g');
          el.setAttribute('class', 'vine__circuit');
          const ring = document.createElementNS(svgNS, 'circle');
          ring.setAttribute('cx', pt.x); ring.setAttribute('cy', pt.y);
          ring.setAttribute('r', 7);
          ring.setAttribute('class', 'vine__pad');
          const core = document.createElementNS(svgNS, 'circle');
          core.setAttribute('cx', pt.x); core.setAttribute('cy', pt.y);
          core.setAttribute('r', 2.6);
          core.setAttribute('class', 'vine__neuron');
          el.appendChild(ring); el.appendChild(core);
        } else el = makeSprig(r, pt.x, pt.y, side.dir); // 1 de 6: verde
        svg.appendChild(el);
        deco.push({ el, at: frac });
      }

      vines.push({ glow, stem, stem2, len, len2: stem2.getTotalLength(), deco });
    });
  }

  function buildSpores() {
    if (!sporesWrap || reduceMotion) return;
    sporesWrap.innerHTML = '';
    const r = rng(777);
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      const kind = r();
      s.className = 'spore ' + (kind > 0.55 ? 'spore--bit' : kind > 0.42 ? 'spore--data' : kind > 0.3 ? 'spore--gold' : 'spore--leaf');
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
    if (!reduceMotion) {
      const rect = afterworld.getBoundingClientRect();
      layers.forEach((l) => {
        l.el.style.transform = `translate3d(0,${rect.top * l.f * -1}px,0)`;
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
