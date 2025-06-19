
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', navbarMenu.classList.contains('open'));
    });
  }
});

