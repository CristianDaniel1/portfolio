'use strict';
///////////////////////////////////////////////////////////
// Movimento - Elementos aparecendo pelo Scroll
const allSections = document.querySelectorAll('.section');
const animar = document.querySelectorAll('.animar');

const callbackSec = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('esconder');
    observer.unobserve(entry.target);
  });
};

const observer = new IntersectionObserver(callbackSec, {
  root: null,
  threshold: 0.05,
});

allSections.forEach(function (section) {
  observer.observe(section);
  section.classList.add('esconder');
});

// Scrool Smooth
document
  .querySelector('.cabecalho__menu')
  .addEventListener('click', function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('cabecalho__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

// Animação do conteúdo
const callbackConteúdo = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('esconder');

    if (entry.target.classList.contains('animar-direita')) {
      entry.target.classList.add('animação-para-direita');
    } else entry.target.classList.add('animação-para-esquerda');

    observer.unobserve(entry.target);
  });
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
const infoHabilidades = document.querySelectorAll('.habilidades__btn');
const habilidadesContainer = document.querySelector('.habilidades__container');

habilidadesContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.habilidades__btn');
  if (!clicked) return;

  clicked.classList.toggle('habilidades__btn-active');
});

/////////////////// Modo Claro/Escuro ////////////////////
const btnTheme = document.querySelector('.toggle-modo');
const lua = document.querySelector('.lua');
const sol = document.querySelector('.sol');

btnTheme.addEventListener('click', function () {
  document.body.classList.toggle('modo-claro');

  lua.classList.toggle('hidden');
  sol.classList.toggle('hidden');
});
