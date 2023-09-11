'use strict';

///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// Movimento - Elementos aparecendo pelo Scroll
const allSections = document.querySelectorAll('.section');
const animar = document.querySelectorAll('.animar');

const callbackSec = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('esconder');
  entry.target.classList.add('section-aparição');

  observer.unobserve(entry.target);
};

const observer = new IntersectionObserver(callbackSec, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(function (section) {
  observer.observe(section);
  section.classList.add('esconder');
});

// Animação do conteúdo
const callbackConteúdo = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('esconder');

  if (entry.target.classList.contains('animar-direita')) {
    entry.target.classList.add('animação-para-direita');
  } else entry.target.classList.add('animação-para-esquerda');

  observer.unobserve(entry.target);
};

const observadorConteúdo = new IntersectionObserver(callbackConteúdo, {
  root: null,
  threshold: 0.3,
});

animar.forEach(function (animação) {
  observadorConteúdo.observe(animação);
  animação.classList.add('esconder');
});

//////////////////////////////////////////////////////////
// Click - Habilidades
const infoHabilidades = document.querySelectorAll('.texto-habilidades');
const habilidadesContainer = document.querySelector('.container-habilidades');

habilidadesContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.informações-habilidades');
  if (!clicked) return;

  // infoHabilidades.forEach(txt => txt.classList.add('txt-escondido'));
  clicked.lastElementChild.classList.toggle('txt-escondido');
});
