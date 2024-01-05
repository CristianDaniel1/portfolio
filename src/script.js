'use strict';
///////////////////////////////////////////////////////////
// Movimento - Sections aparecendo pelo Scroll
const allSections = document.querySelectorAll('.section');

const callbackSections = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('esconder');
    observer.unobserve(entry.target);
  });
};

const observer = new IntersectionObserver(callbackSections, {
  root: null,
  threshold: 0.05,
});

allSections.forEach(function (section) {
  observer.observe(section);
  section.classList.add('esconder');
});

////////////////////// Scroll Smooth ///////////////////////
const handleScrollSmooth = event => {
  event.preventDefault();

  if (event.target.classList.contains('cabecalho__link')) {
    const id = event.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
};

document
  .querySelector('.cabecalho__menu')
  .addEventListener('click', handleScrollSmooth);

////////////////// Animação dos Projetos ////////////////////
const projects = document.querySelectorAll('.projeto__container');

const callbackProjectsObserver = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const elementClasses = entry.target.classList;

    elementClasses.remove('esconder');

    elementClasses.contains('slide-direita')
      ? elementClasses.add('animar-direita')
      : elementClasses.add('animar-esquerda');

    observer.unobserve(entry.target);
  });
};

const projectsObserver = new IntersectionObserver(callbackProjectsObserver, {
  root: null,
  threshold: 0.3,
});

projects.forEach(animation => {
  projectsObserver.observe(animation);
  animation.classList.add('esconder');
});

// Toggle (add/remove) class 'hidden'
const toggleHideMarkup = function (hideMarkup) {
  const markup = hideMarkup;

  markup.classList.toggle('hidden');
};

/////////////////// Modo Claro/Escuro ////////////////////
const btnTheme = document.querySelector('.toggle-modo');
const lua = document.querySelector('.lua');
const sol = document.querySelector('.sol');

const theme = localStorage.getItem('theme');
const bodyThemeClass = document.body.classList;

const toggleLuaSol = () => {
  toggleHideMarkup(lua);
  toggleHideMarkup(sol);
};

if (theme) {
  bodyThemeClass.add(theme);
  toggleLuaSol();
}

const handleThemeToggle = () => {
  bodyThemeClass.toggle('modo-claro');

  toggleLuaSol();

  if (bodyThemeClass.contains('modo-claro'))
    localStorage.setItem('theme', 'modo-claro');
  else {
    localStorage.removeItem('theme');
    document.body.removeAttribute('class');
  }
};

btnTheme.addEventListener('click', handleThemeToggle);

///////////////////// Navbar Mobile //////////////////////
const mobileNav = document.querySelector('.cabecalho__menu');
const btnOpenMobileMenu = document.querySelector('.cabecalho__menu-mobile');
const svgOpen = document.querySelector('.abrir-menu');
const svgClose = document.querySelector('.fechar-menu');

const handleMobileMenu = () => {
  mobileNav.classList.toggle('mobile-abrir');

  toggleHideMarkup(svgOpen);
  toggleHideMarkup(svgClose);
};

btnOpenMobileMenu.addEventListener('click', handleMobileMenu);

///////////////////// Navbar Mobile //////////////////////
const heroSection = document.getElementById('inicio');
const header = document.querySelector('.cabecalho');
const headerHeight = header.getBoundingClientRect().height;

const fixedNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) bodyThemeClass.add('fixed');
  else bodyThemeClass.remove('fixed');
};

const heroObserver = new IntersectionObserver(fixedNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});

heroObserver.observe(heroSection);
