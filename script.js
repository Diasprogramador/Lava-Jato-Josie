const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', opening);
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const reviewsWindow = document.querySelector('#reviews-window');
const reviewCards = [...reviewsWindow.querySelectorAll('.review-card')];
const previousReview = document.querySelector('#review-prev');
const nextReview = document.querySelector('#review-next');
const reviewPosition = document.querySelector('#review-position');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function reviewStep() {
  if (reviewCards.length < 2) return reviewsWindow.clientWidth;
  return reviewCards[1].getBoundingClientRect().left - reviewCards[0].getBoundingClientRect().left;
}

function reviewState() {
  const step = reviewStep();
  const last = reviewCards.length - 1;
  const current = Math.min(last, Math.round(reviewsWindow.scrollLeft / step));
  previousReview.disabled = current === 0;
  nextReview.disabled = current >= last;
  reviewPosition.textContent = `${String(current + 1).padStart(2, '0')} / ${String(last + 1).padStart(2, '0')}`;
  return { current, last, step };
}

function moveReview(direction) {
  const { current, last, step } = reviewState();
  const next = Math.max(0, Math.min(last, current + direction));
  reviewsWindow.scrollTo({ left: next * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

previousReview.addEventListener('click', () => moveReview(-1));
nextReview.addEventListener('click', () => moveReview(1));
reviewsWindow.addEventListener('scroll', reviewState, { passive: true });
window.addEventListener('resize', () => {
  closeMenu();
  reviewState();
});
reviewState();
document.querySelector('#year').textContent = new Date().getFullYear();

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('.section-heading, .service-symbol, .reviews-header, .reviews-window, .unit-copy, .contact-details').forEach(element => {
      gsap.from(element, { y: 24, opacity: .55, duration: .65, ease: 'power2.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 95%', once: true } });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const panels = document.querySelectorAll('.service-details');
    panels.forEach(panel => panel.addEventListener('toggle', refresh));
    return () => {
      window.removeEventListener('load', refresh);
      panels.forEach(panel => panel.removeEventListener('toggle', refresh));
    };
  });
}


