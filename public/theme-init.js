{
  let theme = null;

  try {
    theme = localStorage.getItem('theme');
  } catch {
    // sem armazenamento disponível
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.documentElement.dataset.theme = theme;
}
