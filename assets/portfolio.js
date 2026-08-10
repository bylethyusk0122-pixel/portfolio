(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const showcase = document.querySelector('.showcase');
  const panels = [...document.querySelectorAll('[data-showcase]')];
  let activePanel = 0;
  let panelTimer;

  const showPanel = (index) => {
    activePanel = index % panels.length;
    panels.forEach((panel, panelIndex) => {
      panel.classList.toggle('is-active', panelIndex === activePanel);
    });
  };

  const stopPanels = () => window.clearInterval(panelTimer);
  const startPanels = () => {
    if (reduceMotion || panels.length < 2) return;
    stopPanels();
    panelTimer = window.setInterval(() => showPanel(activePanel + 1), 2800);
  };

  if (showcase) {
    startPanels();
    showcase.addEventListener('mouseenter', stopPanels);
    showcase.addEventListener('mouseleave', startPanels);
    showcase.addEventListener('focusin', stopPanels);
    showcase.addEventListener('focusout', startPanels);
  }

  const total = document.querySelector('[data-count]');
  if (!total || reduceMotion) return;
  const target = Number(total.dataset.count);
  const formatYen = (value) => `¥${Math.round(value).toLocaleString('ja-JP')}`;

  const countObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    const startedAt = performance.now();
    const duration = 900;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      total.textContent = formatYen(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.disconnect();
  }, { threshold: 0.6 });
  countObserver.observe(total);
})();
