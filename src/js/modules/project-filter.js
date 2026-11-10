const SHOW_ALL = 'todos';

export const initProjectFilter = () => {
  const group = document.querySelector('.filters');
  const cards = document.querySelectorAll('.project[data-kind]');

  if (!group || !cards.length) return;

  const buttons = group.querySelectorAll('.filter');

  // um único listener no grupo (delegação de eventos)
  group.addEventListener('click', ({ target }) => {
    const selectedBtn = target.closest('.filter');
    if (!selectedBtn) return;

    const { filter } = selectedBtn.dataset;

    for (const btn of buttons) {
      const isActive = btn === selectedBtn;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    }

    for (const card of cards) {
      card.hidden = filter !== SHOW_ALL && card.dataset.kind !== filter;
    }
  });
};
