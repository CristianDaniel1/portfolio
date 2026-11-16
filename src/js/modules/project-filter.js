const SHOW_ALL = 'todos';

export const initProjectFilter = () => {
  const group = document.querySelector('.filters');
  const items = document.querySelectorAll('#projetos [data-kind]');

  if (!group || !items.length) return;

  const buttons = group.querySelectorAll('.filter');

  // um único listener no grupo (delegação de eventos)
  group.addEventListener('click', ({ target }) => {
    const selectedBtn = target.closest('.filter');
    if (!selectedBtn) return;

    const { filter } = selectedBtn.dataset;

    for (const btn of buttons) {
      btn.setAttribute('aria-pressed', String(btn === selectedBtn));
    }

    for (const item of items) {
      item.hidden = filter !== SHOW_ALL && !item.dataset.kind.split(' ').includes(filter);
    }
  });
};
