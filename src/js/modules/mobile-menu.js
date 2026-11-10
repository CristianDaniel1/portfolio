const MOBILE_QUERY = '(max-width: 768px)';

export const initMobileMenu = () => {
  const menu = document.querySelector('.navbar-list');
  const toggleBtn = document.querySelector('.btn-menu');
  const iconOpen = toggleBtn?.querySelector('.open-menu');
  const iconClose = toggleBtn?.querySelector('.close-menu');

  if (!menu || !toggleBtn || !iconOpen || !iconClose) return;

  let isOpen = false;

  const setMenu = open => {
    isOpen = open;
    menu.classList.toggle('mobile-open', open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  toggleBtn.addEventListener('click', () => setMenu(!isOpen));

  // fecha ao escolher um link
  menu.addEventListener('click', ({ target }) => {
    if (isOpen && target.closest('.navbar-link')) setMenu(false);
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
