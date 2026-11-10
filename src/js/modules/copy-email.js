const FEEDBACK_DURATION = 2000;

export const initCopyEmail = () => {
  const button = document.querySelector('#copy-email');
  if (!button) return;

  const defaultLabel = button.textContent.trim();
  let resetTimer;

  const showFeedback = message => {
    button.textContent = message;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      button.textContent = defaultLabel;
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
