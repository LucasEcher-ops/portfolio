(() => {
  const root = document.documentElement;
  const revealItems = document.querySelectorAll('.reveal');
  const year = document.querySelector('#current-year');
  const stage = document.querySelector('.hero-stage');
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = String(new Date().getFullYear());

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty('--scroll-progress', Math.min(Math.max(progress, 0), 1).toFixed(4));
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  if ('IntersectionObserver' in window && motionAllowed) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (stage && motionAllowed && window.matchMedia('(pointer: fine)').matches) {
    const depthItems = stage.querySelectorAll('[data-depth]');

    stage.addEventListener('pointermove', (event) => {
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      depthItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 1);
        const rotate = item.classList.contains('float-card-product') ? 2.5
          : item.classList.contains('float-card-scale') ? 4
          : item.classList.contains('float-card-data') ? -3
          : -2;
        const baseX = item.classList.contains('portrait-card') ? '-50%' : '0px';
        item.style.transform = `translateX(${baseX}) translate(${x * 18 * depth}px, ${y * 14 * depth}px) rotate(${rotate + x * depth}deg)`;
      });
    });

    stage.addEventListener('pointerleave', () => {
      depthItems.forEach((item) => item.style.removeProperty('transform'));
    });
  }
})();
