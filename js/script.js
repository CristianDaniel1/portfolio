'use strict';
///////////////////////////////////////////////////////////
// Movimento - Sections aparecendo pelo Scroll
const allSections = document.querySelectorAll('.section');

const callbackSections = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('hide-section');
    observer.unobserve(entry.target);
  });
};

const observer = new IntersectionObserver(callbackSections, {
  root: null,
  threshold: 0.05,
});

allSections.forEach(function (section) {
  observer.observe(section);
  section.classList.add('hide-section');
});

////////////////// Animação dos Projetos ////////////////////
const projects = document.querySelectorAll('.project-container');

const callbackProjectsObserver = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const elementClasses = entry.target.classList;

    elementClasses.remove('opacity-hidden');

    elementClasses.contains('slide')
      ? elementClasses.add('slide-right')
      : elementClasses.add('slide-left');

    observer.unobserve(entry.target);
  });
};

const projectsObserver = new IntersectionObserver(callbackProjectsObserver, {
  root: null,
  threshold: 0.3,
});

projects.forEach(animation => {
  projectsObserver.observe(animation);
  animation.classList.add('opacity-hidden');
});

/////////////////// Navbar Mobile //////////////////////
const navbar = document.querySelector('.navbar-list');
const btnOpenMobileMenu = document.querySelector('.btn-menu');
const svgOpen = document.querySelector('.open-menu');
const svgClose = document.querySelector('.close-menu');

let isOpen = false;

// Toggle (add/remove) class 'hidden'
const toggleHideMarkup = hideMarkup => hideMarkup.classList.toggle('hidden');

const handleMobileMenu = () => {
  navbar.classList.toggle('mobile-open');

  isOpen = !isOpen;
  toggleHideMarkup(svgOpen);
  toggleHideMarkup(svgClose);
};

const handleNavClick = e => {
  const clicked = e.target.closest('.navbar-link');
  if (!clicked) return;

  if (isOpen) handleMobileMenu();
};

btnOpenMobileMenu.addEventListener('click', handleMobileMenu);
navbar.addEventListener('click', handleNavClick);

///////////////////// Header Fixed //////////////////////
const heroSection = document.getElementById('hero');
const header = document.querySelector('.header');

const headerHeight = header.getBoundingClientRect().height;
const bodyClass = document.body.classList;

const fixedNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) bodyClass.add('fixed');
  else bodyClass.remove('fixed');
};

const heroObserver = new IntersectionObserver(fixedNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});

heroObserver.observe(heroSection);
