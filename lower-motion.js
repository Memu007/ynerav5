/* A restrained camera pose: text is frontal and fully opaque at each stop. */
window.YneraCameraPose = delta => {
  const d = Math.max(-1.2, Math.min(1.2, delta));
  return {y: d * 28, z: -340 * Math.min(1, d * d), turn: -15 * d,
    opacity: 1 - .7 * Math.pow(Math.min(1, Math.abs(d)), 1.4)};
};
/* Controls and quiet depth for the lower half; the main tree is untouched. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const process = document.getElementById('proceso');
  const steps = document.getElementById('steps');
  const buttons = document.querySelectorAll('.car-arrow');
  buttons.forEach(button => button.addEventListener('click', () => {
    const direction = Number(button.dataset.direction);
    if (root.classList.contains('carousel')) {
      const top = process.getBoundingClientRect().top + scrollY;
      const distance = parseFloat(getComputedStyle(process).getPropertyValue('--cdist'));
      if (!distance) return;
      const count = steps.querySelectorAll('.step').length - 1;
      const current = Math.round(Math.max(0, Math.min(1, (scrollY - top) / distance)) * count);
      const target = top + Math.max(0, Math.min(count, current + direction)) / count * distance;
      if (window.__lenis) window.__lenis.scrollTo(target, {duration: .85});
      else scrollTo({top: target, behavior: reduced ? 'auto' : 'smooth'});
    } else {
      const cards = steps.querySelectorAll('.step');
      if (cards.length < 2) return;
      steps.scrollBy({left: direction * (cards[1].offsetLeft - cards[0].offsetLeft), behavior: reduced ? 'auto' : 'smooth'});
    }
  }));
  if (reduced || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('volume-in');
      observer.unobserve(entry.target);
    });
  }, {threshold: .08});
  document.querySelectorAll('#dupla .person, #faq .faq-side, #faq details, #contacto .close-hd').forEach((el, i) => {
    el.classList.add('volume-reveal');
    el.style.setProperty('--reveal-delay', (i % 3) * 55 + 'ms');
    observer.observe(el);
  });

  /* Cinematic pass for the process: each stage arrives as a take. A light
     rides the line, numerals and background drift at their own depth. */
  const cards = [...steps.querySelectorAll('.step')];
  const grow = steps.querySelector('.grow');
  if (cards.length < 2 || !('requestAnimationFrame' in window)) return;
  const light = document.createElement('li');
  light.className = 'car-light';
  light.setAttribute('aria-hidden', 'true');
  steps.appendChild(light);
  process.classList.add('cine');
  let queued = false, last = '';
  const frame = () => {
    queued = false;
    const box = process.getBoundingClientRect();
    if (box.bottom < -200 || box.top > innerHeight + 200) return;
    const count = cards.length - 1;
    let p, x;
    if (root.classList.contains('carousel')) {
      const distance = parseFloat(getComputedStyle(process).getPropertyValue('--cdist')) || 1;
      p = Math.max(0, Math.min(1, -box.top / distance));
      const scale = /scaleX\(([\d.]+)\)/.exec(grow ? grow.style.transform : '');
      x = (scale ? Number(scale[1]) : p) * steps.offsetWidth;
    } else {
      const span = cards[count].offsetLeft - cards[0].offsetLeft;
      p = span > 4 ? Math.max(0, Math.min(1, steps.scrollLeft / span)) : 0;
      x = cards[0].offsetLeft + p * span + 6;
    }
    const seen = box.top < innerHeight * .78;
    const active = seen ? Math.round(Math.max(0, p) * count) : -1;
    const key = p.toFixed(3) + '|' + x.toFixed(0) + '|' + active;
    if (key === last) return;
    last = key;
    process.style.setProperty('--p', Math.max(0, p).toFixed(3));
    light.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    light.classList.toggle('lit', seen);
    cards.forEach((card, i) => {
      card.classList.toggle('take', i <= active);
      card.classList.toggle('now', i === active);
    });
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', queue, {passive: true});
  addEventListener('resize', queue);
  steps.addEventListener('scroll', queue, {passive: true});
  queue();
})();
