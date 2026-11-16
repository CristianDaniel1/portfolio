const SCROLL_THRESHOLD = 8;
const HEADER_OFFSET = '-72px 0px 0px 0px';

export const initHeaderScroll = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  const progress = header.querySelector('.progress');
  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    ticking = false;
    const max = root.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress?.style.setProperty('--progress', ratio.toFixed(4));
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();

  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('show-name', !entry.isIntersecting),
    { rootMargin: HEADER_OFFSET },
  );
  observer.observe(heroTitle);
};
