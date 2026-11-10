const SCROLL_THRESHOLD = 8;

// Mostra a borda do cabeçalho depois que a página começa a rolar
export const initHeaderScroll = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};
