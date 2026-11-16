// Na fileira deslizante do hero (tablet e celular), focar uma obra pelo teclado
// traz o quadro inteiro para a vista, e não só o nome.
export const initGalleryRow = () => {
  const row = document.querySelector('.hero-row');
  if (!row) return;

  row.addEventListener('focusin', ({ target }) => {
    const item = target.closest('.hero-item');
    const styles = getComputedStyle(row);
    if (!item || styles.display !== 'flex') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offset = item.getBoundingClientRect().left - row.getBoundingClientRect().left;

    row.scrollTo({
      left: row.scrollLeft + offset - (parseFloat(styles.scrollPaddingLeft) || 0),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  });
};
