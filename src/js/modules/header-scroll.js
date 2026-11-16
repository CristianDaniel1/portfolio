const SCROLL_THRESHOLD = 8;

export const initHeaderScroll = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};
