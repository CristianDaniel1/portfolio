// Marca no menu o link da seção que está no meio da tela
export const initActiveLink = () => {
  const links = [...document.querySelectorAll('.navbar-link')];
  const sections = document.querySelectorAll('main section[id]');

  if (!links.length || !sections.length) return;

  const setActive = id => {
    for (const link of links) {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    entries => {
      for (const { isIntersecting, target } of entries) {
        if (isIntersecting) setActive(target.id);
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );

  sections.forEach(section => observer.observe(section));
};
