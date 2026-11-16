const FEEDBACK_DURATION = 2000;

// Copia o e-mail e avisa no próprio botão (o rótulo é uma região aria-live)
export const initCopyEmail = () => {
  const button = document.querySelector('#copy-email');
  const label = button?.querySelector('.copy-label');
  if (!button || !label) return;

  const defaultLabel = label.textContent.trim();
  let resetTimer;

  const showFeedback = message => {
    label.textContent = message;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      label.textContent = defaultLabel;
    }, FEEDBACK_DURATION);
  };

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      showFeedback('E-mail copiado');
    } catch {
      showFeedback('Não foi possível copiar');
    }
  });
};
