const FOLD_RATIO = 0.92;

export const initReveal = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  document.querySelectorAll('[data-stagger]').forEach(group => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });

  const observer = new IntersectionObserver(
    entries => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.classList.remove('is-pending');
        observer.unobserve(target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );

  const fold = window.innerHeight * FOLD_RATIO;
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (el.getBoundingClientRect().top <= fold) return;
    el.classList.add('is-pending');
    observer.observe(el);
  });
};
