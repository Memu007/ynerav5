/* Switch text in place. Static ES/EN pages remain usable without JavaScript. */
(() => {
  const data = window.YneraTranslations;
  if (!data) return;
  const valid = lang => lang === 'es' || lang === 'en';
  function links() {
    const nav = document.querySelector('.language-switch');
    if (!nav) return;
    nav.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Language' : 'Idioma');
    nav.replaceChildren(...['es','en'].map(lang => {
      const a = document.createElement('a');
      const url = new URL(lang === 'en' ? 'en.html' : 'index.html', location.href);
      url.search = location.search;
      url.hash = location.hash;
      a.href = url.href;
      a.lang = a.hreflang = lang;
      a.textContent = lang.toUpperCase();
      a.setAttribute('aria-label', lang === 'en' ? 'Read in English' : 'Leer en español');
      if (lang === document.documentElement.lang) a.setAttribute('aria-current', 'page');
      return a;
    }));
  }
  function labels() {
    const en = document.documentElement.lang === 'en';
    document.querySelectorAll('#labels .tag3d').forEach(label => {
      if (['El próximo: el tuyo','Next: yours'].includes(label.textContent))
        label.textContent = en ? 'Next: yours' : 'El próximo: el tuyo';
    });
    document.querySelectorAll('.ci-t').forEach(label => {
      const n = label.querySelector('b');
      label.innerHTML = window.YneraStepLabel(n ? Number(n.textContent) : 1);
    });
  }
  function apply(lang, navigate) {
    if (!valid(lang) || lang === document.documentElement.lang) return;
    const y = scrollY;
    document.querySelectorAll('[data-copy]').forEach(el => {
      const copy = data.bindings[el.dataset.copy]?.[lang];
      if (!copy) return;
      if (copy.text) {
        const nodes = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
        if (nodes.length === copy.text.length) nodes.forEach((node,i) => {node.textContent = copy.text[i];});
      }
      Object.entries(copy.attrs).forEach(([key,value]) => el.setAttribute(key,value));
    });
    document.documentElement.lang = lang;
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema) schema.textContent = JSON.stringify(data.schemas[lang]);
    if (navigate) {
      const url = new URL(lang === 'en' ? 'en.html' : 'index.html', location.href);
      url.search = location.search;
      url.hash = location.hash;
      history.pushState({yneraLanguage:lang}, '', url);
    }
    links();
    labels();
    dispatchEvent(new Event('ynera:language'));
    window.__lenis?.resize();
    window.__motion?.ScrollTrigger.refresh();
    if (window.__lenis) window.__lenis.scrollTo(y, {immediate:true,force:true});
    else scrollTo(0,y);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('.language-switch a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!valid(link.lang)) return;
    event.preventDefault();
    apply(link.lang, true);
  });
  addEventListener('popstate', () => apply(location.pathname.endsWith('/en.html') ? 'en' : 'es', false));
  links();
  labels();
  const layer = document.getElementById('labels');
  if (layer) new MutationObserver(labels).observe(layer, {childList:true});
})();
