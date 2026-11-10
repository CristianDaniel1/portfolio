import { readStorage, writeStorage } from '../utils/storage.js';

const STORAGE_KEY = 'theme';
const THEMES = ['light', 'dark'];

export const initTheme = () => {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;

  const root = document.documentElement;
  const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const getCurrentTheme = () => (root.dataset.theme === 'dark' ? 'dark' : 'light');
  const hasSavedChoice = () => THEMES.includes(readStorage(STORAGE_KEY));

  const applyTheme = theme => {
    root.dataset.theme = theme;
    button.setAttribute('aria-pressed', String(theme === 'dark'));

    // a cor da barra do navegador acompanha o fundo da página
    const { backgroundColor } = getComputedStyle(document.body);
    themeMetas.forEach(meta => meta.setAttribute('content', backgroundColor));
  };

  applyTheme(getCurrentTheme());

  button.addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    writeStorage(STORAGE_KEY, next);
  });

  systemDark.addEventListener('change', ({ matches }) => {
    if (hasSavedChoice()) return;
    applyTheme(matches ? 'dark' : 'light');
  });
};
