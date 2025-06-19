// Animate elements on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Count Up Animation
document.querySelectorAll('.counter-number').forEach(counter => {
  let started = false;

  const updateCount = () => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    const increment = target / 100;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target;
    }
  };

  const onScroll = () => {
    const rect = counter.getBoundingClientRect();
    if (!started && rect.top < window.innerHeight) {
      started = true;
      updateCount();
      window.removeEventListener('scroll', onScroll);
    }
  };

  window.addEventListener('scroll', onScroll);
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// Newsletter form submission (example)
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you for subscribing!');
  e.target.reset();
});

// FAQ dropdown toggle
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const expanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', !expanded);
    if (!expanded) {
      answer.hidden = false;
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
      setTimeout(() => answer.hidden = true, 300);
    }
  });
});

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
