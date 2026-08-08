// Phase 1: small interactions. Full AI/lead-form functionality comes in the next phase.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      reveal.unobserve(entry.target);
    }
  });
}, {threshold: .12});

document.querySelectorAll('.card,.herb-card,.product-image-card,.product-info').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  reveal.observe(el);
});

const style = document.createElement('style');
style.textContent = '.visible{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);
