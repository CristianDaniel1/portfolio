export const initFooterYear = () => {
  const year = document.querySelector('#ano');
  if (year) year.textContent = new Date().getFullYear();
};
