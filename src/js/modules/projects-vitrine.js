// Vitrine de projetos: a lista troca o projeto do palco, as imagens de cada projeto
// passam sozinhas enquanto a seção está na tela e clicar na imagem abre o lightbox.
import { openLightbox } from './lightbox.js';

const AUTOPLAY_MS = 5000;
// tempo máximo esperando a imagem do próximo projeto antes de trocar mesmo assim
const MAX_IMAGE_WAIT_MS = 400;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export const initProjectsVitrine = () => {
  const vitrine = document.querySelector('[data-vitrine]');
  if (!vitrine) return;

  const tabs = [...vitrine.querySelectorAll('.vitrine-tab')];
  const panels = [...vitrine.querySelectorAll('.vitrine-panel')];
  const stage = vitrine.querySelector('.vitrine-stage');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let activePanel = panels.find(panel => panel.classList.contains('is-active')) ?? panels[0];
  let timer;
  let inView = false;
  let paused = false;
  let lightboxOpen = false;
  let switchId = 0;

  const shotsOf = panel => [...panel.querySelectorAll('.vitrine-shot')];
  const thumbsOf = panel => [...panel.querySelectorAll('.vitrine-thumb')];
  const currentIndex = panel => shotsOf(panel).findIndex(shot => shot.classList.contains('is-active'));
  // a capa é um <span> com a imagem dentro; as outras imagens são o próprio <img>
  const imageOf = shot => (shot.tagName === 'IMG' ? shot : shot.querySelector('img'));

  const canPlay = () => inView && !paused && !lightboxOpen && !reduceMotion.matches;

  const restartProgress = () => {
    const bar = activePanel.querySelector('.vitrine-progress');
    if (!bar) return;
    bar.classList.remove('is-playing');
    void bar.offsetWidth; // reinicia a animação da barra
    if (canPlay()) bar.classList.add('is-playing');
  };

  const schedule = () => {
    clearTimeout(timer);
    restartProgress();
    if (!canPlay()) return;

    timer = setTimeout(() => {
      const shots = shotsOf(activePanel);
      showShot((currentIndex(activePanel) + 1) % shots.length);
      schedule();
    }, AUTOPLAY_MS);
  };

  const showShot = index => {
    shotsOf(activePanel).forEach((shot, i) => shot.classList.toggle('is-active', i === index));
    thumbsOf(activePanel).forEach((thumb, i) => thumb.classList.toggle('is-active', i === index));
  };

  // As imagens usam loading="lazy"; as de projetos escondidos só carregariam ao aparecer,
  // e o painel surgiria vazio. Isto pede o carregamento delas em segundo plano.
  const preload = panel => {
    for (const img of panel.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager';
  };

  // espera a primeira imagem do painel estar decodificada (com limite de tempo)
  const whenReady = panel => {
    preload(panel);
    const first = imageOf(shotsOf(panel)[0]);
    return Promise.race([first.decode().catch(() => {}), wait(MAX_IMAGE_WAIT_MS)]);
  };

  const activate = async tab => {
    const target = panels.find(panel => panel.id === tab.dataset.target);
    if (!target) return;

    for (const t of tabs) t.setAttribute('aria-pressed', String(t === tab));

    // se a pessoa clicar em outro projeto enquanto este carrega, vale só o último clique
    const id = ++switchId;
    await whenReady(target);
    if (id !== switchId) return;

    // transição cruzada: a imagem que estava na tela vira o fundo do novo palco
    // enquanto a nova aparece por cima (sem passar por um palco vazio)
    const previous = imageOf(shotsOf(activePanel)[currentIndex(activePanel)] ?? shotsOf(activePanel)[0]);
    const nextShots = target.querySelector('.vitrine-shots');
    if (previous && target !== activePanel) {
      nextShots.style.backgroundImage = `url("${previous.currentSrc || previous.src}")`;
      nextShots.addEventListener('animationend', () => nextShots.style.removeProperty('background-image'), {
        once: true,
      });
    }

    activePanel = target;
    for (const panel of panels) panel.classList.toggle('is-active', panel === activePanel);

    showShot(0);
    schedule();
  };

  // quando a seção se aproxima da tela, as imagens de todos os projetos começam a carregar
  new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      panels.forEach(preload);
      observer.disconnect();
    },
    { rootMargin: '0px 0px 600px 0px' },
  ).observe(vitrine);

  vitrine.querySelector('.vitrine-list').addEventListener('click', ({ target }) => {
    const tab = target.closest('.vitrine-tab');
    if (tab) activate(tab);
  });

  const openZoom = async () => {
    lightboxOpen = true;
    schedule();

    await openLightbox({
      title: activePanel.querySelector('.vitrine-title')?.textContent.trim() ?? '',
      images: shotsOf(activePanel).map(shot => {
        const img = imageOf(shot);
        return {
          src: img.currentSrc || img.src,
          alt: img.alt,
          // tamanho original (atributo), não o tamanho exibido na vitrine
          width: Number(img.getAttribute('width')),
          height: Number(img.getAttribute('height')),
        };
      }),
      index: currentIndex(activePanel),
      linksHTML: activePanel.querySelector('.project-links')?.innerHTML ?? '',
    });

    lightboxOpen = false;
    schedule();
  };

  stage.addEventListener('click', ({ target }) => {
    if (target.closest('.vitrine-shots')) {
      openZoom();
      return;
    }

    const thumb = target.closest('.vitrine-thumb');
    if (!thumb) return;
    showShot(thumbsOf(activePanel).indexOf(thumb));
    schedule();
  });

  // pausa enquanto a pessoa está olhando de perto (mouse ou foco no palco)
  const pause = value => {
    paused = value;
    schedule();
  };
  stage.addEventListener('pointerenter', () => pause(true));
  stage.addEventListener('pointerleave', () => pause(false));
  stage.addEventListener('focusin', () => pause(true));
  stage.addEventListener('focusout', () => pause(false));

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    },
    { threshold: 0.35 },
  ).observe(stage);

  // se o filtro esconder o projeto escolhido, mostra o primeiro que continua visível
  document.addEventListener('projects:filter', () => {
    const activeTab = tabs.find(tab => tab.getAttribute('aria-pressed') === 'true');
    if (!activeTab?.closest('[hidden]')) return;
    const firstVisible = tabs.find(tab => !tab.closest('[hidden]'));
    if (firstVisible) activate(firstVisible);
  });

  reduceMotion.addEventListener('change', schedule);

  vitrine.style.setProperty('--duration', `${AUTOPLAY_MS}ms`);
};
