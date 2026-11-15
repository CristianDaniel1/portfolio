const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

export const initHeroShowcase = () => {
  const show = document.querySelector('[data-showcase]');
  const tabsBox = show?.querySelector('[data-showcase-tabs]');
  const slides = [...(show?.querySelectorAll('.hs-slide') ?? [])];
  if (!show || !tabsBox || !slides.length) return;

  const site = show.querySelector('[data-showcase-site]');
  const url = show.querySelector('[data-showcase-url]');
  const code = show.querySelector('[data-showcase-code]');
  const status = show.querySelector('[data-showcase-status]');
  const pause = show.querySelector('[data-showcase-pause]');

  let current = Math.max(
    0,
    slides.findIndex(slide => slide.classList.contains('is-active')),
  );

  const tabs = slides.map((slide, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'hs-tab';
    tab.setAttribute('aria-pressed', String(i === current));
    const name = document.createElement('span');
    name.textContent = slide.dataset.name;
    tab.append(name);
    if (slide.dataset.kind === 'Front-End') {
      const kind = document.createElement('small');
      kind.className = 'hs-tab-kind';
      kind.textContent = 'Front-End';
      tab.append(kind);
    }
    tabsBox.append(tab);
    return tab;
  });

  // barra de endereço: site (ou repositório, quando não há site) + botão de código
  const syncLinks = () => {
    const { name, url: label, site: siteHref, code: codeHref } = slides[current].dataset;
    if (site) {
      site.href = siteHref || codeHref;
      site.setAttribute('aria-label', `${siteHref ? 'Abrir o site' : 'Ver o código'} do ${name} (abre em nova aba)`);
    }
    if (url) url.textContent = label ?? '';
    if (code) {
      code.hidden = !siteHref || !codeHref;
      if (codeHref) code.href = codeHref;
      code.setAttribute('aria-label', `Ver o código do ${name} no GitHub (abre em nova aba)`);
    }
  };

  const go = (index, announce = false) => {
    if (index === current) return;
    slides[current].classList.remove('is-active');
    tabs[current].setAttribute('aria-pressed', 'false');
    current = index;
    show.classList.add('is-switched'); // depois da 1ª troca, as notas entram sem o atraso da abertura
    slides[current].classList.add('is-active');
    tabs[current].setAttribute('aria-pressed', 'true');
    syncLinks();
    if (announce && status) status.textContent = `Projeto ${current + 1} de ${slides.length}: ${slides[current].dataset.name}`;
  };

  const setAuto = on => {
    show.classList.toggle('is-auto', on);
    if (!pause) return;
    pause.dataset.state = on ? 'playing' : 'paused';
    pause.setAttribute('aria-label', on ? 'Pausar a troca de projetos' : 'Retomar a troca de projetos');
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      setAuto(false);
      go(i, true);
    });
    tab.addEventListener('animationend', event => {
      if (event.animationName !== 'hs-progress' || !show.classList.contains('is-auto')) return;
      go((current + 1) % slides.length);
    });
  });

  pause?.addEventListener('click', () => setAuto(!show.classList.contains('is-auto')));

  // no celular a pausa vai para a barra de endereço, para sobrar espaço aos nomes nas abas
  const address = show.querySelector('.hs-address');
  const bar = pause?.parentElement;
  const small = window.matchMedia('(max-width: 600px)');
  const placePause = () => {
    if (pause && address && bar) (small.matches ? address : bar).append(pause);
  };
  small.addEventListener('change', placePause);
  placePause();

  syncLinks();

  if (slides.length > 1 && !REDUCED.matches) {
    if (pause) pause.hidden = false;
    setAuto(true);
    new IntersectionObserver(([entry]) => show.classList.toggle('is-offscreen', !entry.isIntersecting)).observe(show);
  }
};
