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
      const count = steps.querySelectorAll('.step').length;
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
})();
