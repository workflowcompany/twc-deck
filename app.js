(function () {
  'use strict';

  const TOTAL_SLIDES = 10;
  const PAINS_SLIDE = 3;
  const CAL_URL = 'https://cal.com/the-workflow-company/30min';
  const MOBILE_BREAKPOINT = 768;

  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsContainer = document.querySelector('.progress-dots');
  const prevBtn = document.querySelector('.nav-btn--prev');
  const nextBtn = document.querySelector('.nav-btn--next');
  const stickyCta = document.querySelector('.sticky-cta');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentSlide = 1;
  let currentPain = 0;
  let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  let isTransitioning = false;

  function init() {
    buildProgressDots();
    bindNavigation();
    bindPainsHub();
    bindTimeline();
    bindCtaButtons();
    bindHeroReveal();
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 150));

    if (isMobile) {
      enableMobileMode();
    } else {
      goToSlide(1, { instant: true });
    }
  }

  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (wasMobile !== isMobile) {
      if (isMobile) {
        enableMobileMode();
      } else {
        disableMobileMode();
        goToSlide(currentSlide, { instant: true });
      }
    }
  }

  function enableMobileMode() {
    document.body.classList.add('is-mobile');
    slides.forEach((slide) => {
      slide.classList.add('is-active');
      slide.classList.remove('is-exiting');
    });
    setupMobileSlideObserver();
    updateStickyCtaVisibility(getVisibleSlideIndex());
  }

  function disableMobileMode() {
    document.body.classList.remove('is-mobile');
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentSlide - 1);
      slide.classList.remove('is-exiting');
    });
    teardownMobileObservers();
  }

  function buildProgressDots() {
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'progress-dot';
      btn.setAttribute('aria-label', `Ir al slide ${i}`);
      btn.dataset.slide = i;
      if (i === 1) btn.classList.add('is-active');
      btn.addEventListener('click', () => goToSlide(i));
      li.appendChild(btn);
      dotsContainer.appendChild(li);
    }
  }

  function updateDots(index) {
    document.querySelectorAll('.progress-dot').forEach((dot) => {
      dot.classList.toggle('is-active', Number(dot.dataset.slide) === index);
    });
  }

  function bindNavigation() {
    prevBtn.addEventListener('click', () => advance(-1));
    nextBtn.addEventListener('click', () => advance(1));

    document.addEventListener('keydown', (e) => {
      if (isMobile) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        advance(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        advance(1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(TOTAL_SLIDES);
      }
    });
  }

  function advance(direction) {
    if (currentSlide === PAINS_SLIDE && direction === 1 && currentPain < 4) {
      selectPain(currentPain + 1);
      return;
    }
    if (currentSlide === PAINS_SLIDE && direction === -1 && currentPain > 0) {
      selectPain(currentPain - 1);
      return;
    }
    goToSlide(currentSlide + direction);
  }

  function goToSlide(index, options = {}) {
    if (isMobile) {
      const targetEl = slides[index - 1];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        currentSlide = index;
        updateDots(index);
        updateStickyCtaVisibility(index);
      }
      return;
    }

    const target = Math.max(1, Math.min(TOTAL_SLIDES, index));
    if (target === currentSlide && !options.instant) return;
    if (isTransitioning && !options.instant) return;

    const isJump = Math.abs(target - currentSlide) > 1;

    if (options.instant || isJump || reducedMotion) {
      slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === target - 1);
        s.classList.remove('is-exiting');
      });
    } else {
      isTransitioning = true;
      const prev = slides[currentSlide - 1];
      const next = slides[target - 1];
      prev.classList.remove('is-active');
      prev.classList.add('is-exiting');
      next.classList.add('is-active');

      const duration = 320;
      setTimeout(() => {
        slides.forEach((s, i) => {
          s.classList.toggle('is-active', i === target - 1);
          s.classList.remove('is-exiting');
        });
        isTransitioning = false;
      }, duration);
    }

    currentSlide = target;
    updateDots(target);
    updateStickyCtaVisibility(target);

    if (target === 1) {
      triggerHeroReveal();
    }
  }

  function updateStickyCtaVisibility(slideIndex) {
    stickyCta.hidden = !(slideIndex >= 2 && slideIndex < TOTAL_SLIDES);
    if (!stickyCta.hidden) stickyCta.classList.add('is-visible');
  }

  function bindHeroReveal() {
    triggerHeroReveal();
  }

  function triggerHeroReveal() {
    const accent = document.querySelector('.hero-accent');
    if (!accent) return;

    accent.classList.remove('is-visible');
    if (reducedMotion) {
      accent.classList.add('is-visible');
      return;
    }
    setTimeout(() => accent.classList.add('is-visible'), 300);
  }

  /* --------------------------------------------------------------------------
     Pains hub — tab navigation
     -------------------------------------------------------------------------- */

  function bindPainsHub() {
    const tabs = document.querySelectorAll('.pains-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        selectPain(Number(tab.dataset.pain));
      });
    });
  }

  function selectPain(index) {
    const tabs = document.querySelectorAll('.pains-tab');
    const panels = document.querySelectorAll('.pain-detail');

    currentPain = index;

    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });
  }

  /* --------------------------------------------------------------------------
     Mobile slide observer
     -------------------------------------------------------------------------- */

  let mobileObservers = [];

  function setupMobileSlideObserver() {
    teardownMobileObservers();

    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.slide);
            currentSlide = index;
            updateStickyCtaVisibility(index);
          }
        });
      },
      { threshold: 0.55 }
    );

    slides.forEach((slide) => slideObserver.observe(slide));
    mobileObservers.push(slideObserver);
  }

  function teardownMobileObservers() {
    mobileObservers.forEach((obs) => obs.disconnect());
    mobileObservers = [];
  }

  function getVisibleSlideIndex() {
    const scrollY = window.scrollY + window.innerHeight / 2;
    for (const slide of slides) {
      const rect = slide.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      if (scrollY >= top && scrollY <= bottom) {
        return Number(slide.dataset.slide);
      }
    }
    return currentSlide;
  }

  /* --------------------------------------------------------------------------
     Timeline
     -------------------------------------------------------------------------- */

  function bindTimeline() {
    const nodes = document.querySelectorAll('[data-timeline-node]');
    nodes.forEach((node) => {
      const btn = node.querySelector('.timeline-node__btn');
      btn.addEventListener('click', () => activateTimelineNode(node, nodes));
    });
  }

  function activateTimelineNode(activeNode, allNodes) {
    allNodes.forEach((node) => {
      const isActive = node === activeNode;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-selected', isActive ? 'true' : 'false');
      node.tabIndex = isActive ? 0 : -1;
      const detail = node.querySelector('.timeline-node__detail');
      if (detail) detail.hidden = !isActive;
    });
  }

  function bindCtaButtons() {
    document.querySelectorAll('[data-go-to]').forEach((btn) => {
      btn.addEventListener('click', () => goToSlide(Number(btn.dataset.goTo)));
    });

    stickyCta.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      window.open(CAL_URL, '_blank', 'noopener,noreferrer');
    });
  }

  function debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
