// Imagens ampliadas: abre o <dialog class="lightbox"> do index.html com as imagens de um
// projeto. Navega com as setas (botões ou teclado) e arrastando no celular.
//
// Desempenho:
// - os slides de cada projeto são criados uma vez e reaproveitados (cache por título);
// - a janela só abre depois que a imagem escolhida está decodificada, para a animação
//   de entrada não disputar com a decodificação;
// - o deslize usa só transform (feito pela GPU, sem recalcular o layout).
const SWIPE_DISTANCE = 50;

const dialog = document.querySelector('.lightbox');
const track = dialog?.querySelector('.lightbox-track');
const title = dialog?.querySelector('.lightbox-title');
const count = dialog?.querySelector('.lightbox-count');
const caption = dialog?.querySelector('.lightbox-caption');
const links = dialog?.querySelector('.lightbox-links');
const prevBtn = dialog?.querySelector('.lightbox-prev');
const nextBtn = dialog?.querySelector('.lightbox-next');

const slidesCache = new Map();

let images = [];
let current = 0;
let isReady = false;

const toCaption = alt => {
  // o texto alternativo vem como "Projeto: descrição"; a legenda mostra só a descrição
  const description = alt.split(': ').slice(1).join(': ') || alt;
  return description.charAt(0).toUpperCase() + description.slice(1);
};

const show = index => {
  current = Math.max(0, Math.min(index, images.length - 1));
  track.style.transform = `translate3d(${-current * 100}%, 0, 0)`;
  count.textContent = `${current + 1} de ${images.length}`;
  caption.textContent = toCaption(images[current].alt);
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === images.length - 1;
};

const createSlides = list =>
  list.map(({ src, alt, width, height }) => {
    const slide = document.createElement('div');
    slide.className = 'lightbox-slide';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.decoding = 'async';
    img.draggable = false;
    if (width && height) {
      img.width = width;
      img.height = height;
    }

    slide.append(img);
    return slide;
  });

const setup = () => {
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));

  dialog.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowLeft') show(current - 1);
    if (key === 'ArrowRight') show(current + 1);
  });

  // clicar fora da imagem (no fundo escuro) fecha
  dialog.addEventListener('click', ({ target }) => {
    if (target === dialog || target.classList.contains('lightbox-slide')) dialog.close();
  });

  // arrastar para os lados no celular
  let startX = null;
  track.addEventListener('pointerdown', ({ clientX }) => {
    startX = clientX;
  });
  track.addEventListener('pointercancel', () => {
    startX = null;
  });
  track.addEventListener('pointerup', ({ clientX }) => {
    if (startX === null) return;
    const distance = clientX - startX;
    startX = null;
    if (Math.abs(distance) >= SWIPE_DISTANCE) show(current + (distance < 0 ? 1 : -1));
  });

  dialog.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
};

/**
 * Abre o lightbox.
 * @param {{
 *   title: string,
 *   images: { src: string, alt: string, width?: number, height?: number }[],
 *   index?: number,
 *   linksHTML?: string,
 * }} options
 * @returns {Promise<void>} resolve quando o lightbox fecha
 */
export const openLightbox = async ({ title: projectTitle, images: list, index = 0, linksHTML = '' }) => {
  if (!dialog) return;

  // os eventos são ligados só na primeira abertura
  if (!isReady) {
    setup();
    isReady = true;
  }

  images = list;
  title.textContent = projectTitle;
  links.innerHTML = linksHTML;

  if (!slidesCache.has(projectTitle)) slidesCache.set(projectTitle, createSlides(list));
  const slides = slidesCache.get(projectTitle);
  track.replaceChildren(...slides);

  // posiciona direto na imagem escolhida, sem a animação de deslizar
  track.style.transition = 'none';
  show(index);

  // espera a imagem visível estar pronta antes de abrir (as outras decodificam em paralelo)
  await slides[current].querySelector('img').decode().catch(() => {});

  track.style.transition = '';
  document.body.classList.add('lightbox-open');
  dialog.showModal();

  await new Promise(resolve => dialog.addEventListener('close', resolve, { once: true }));
};
