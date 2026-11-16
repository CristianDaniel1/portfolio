const MOBILE_QUERY = '(max-width: 1080px)';

export const initMobileMenu = () => {
  const toggleBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById(toggleBtn?.getAttribute('aria-controls'));

  if (!toggleBtn || !menu) return;

  const background = document.querySelectorAll('main, footer');
  let isOpen = false;

  const setMenu = open => {
    isOpen = open;
    menu.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
    background.forEach(el => (el.inert = open));
  };

  toggleBtn.addEventListener('click', () => setMenu(!isOpen));

  // fecha ao escolher um link
  menu.addEventListener('click', ({ target }) => {
    if (isOpen && target.closest('a')) setMenu(false);
  });

  // fecha com Esc e devolve o foco ao botão
  document.addEventListener('keydown', ({ key }) => {
    if (key !== 'Escape' || !isOpen) return;
    setMenu(false);
    toggleBtn.focus();
  });

  // fecha ao voltar para a tela grande
  window.matchMedia(MOBILE_QUERY).addEventListener('change', ({ matches }) => {
    if (!matches && isOpen) setMenu(false);
  });
};
