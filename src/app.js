'use strict';

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
