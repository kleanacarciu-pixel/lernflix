/* =========================================================================
   "Lerne mit Anna" – Politur-Skript
   - Schatten am Header erst beim Scrollen
   - Sanftes Einblenden der Sektionen (IntersectionObserver)
   - Selbst zeichnende Annotationen (Unterstreichung / Kreis)
   - Smooth-Scroll fuer Anker-Links
   Respektiert prefers-reduced-motion und funktioniert ohne JS (Fallback im CSS).
   ========================================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(cb) {
    if (document.readyState !== 'loading') {
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  }

  // 1. Sticky-Header: Schatten erst beim Scrollen ------------------------
  function initHeaderShadow() {
    var header = document.querySelector('.header');
    if (!header) return;

    function update() {
      header.classList.toggle('header--scrolled', window.scrollY > 8);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // 2. Reveal beim Scrollen + Annotationen zeichnen ----------------------
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    var drawEls = document.querySelectorAll('.annotate__underline, .annotate-circle');

    // Ohne Observer oder bei reduzierter Bewegung: alles sofort anzeigen
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      drawEls.forEach(function (el) { el.classList.add('is-drawn'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Annotationen innerhalb der sichtbaren Sektion zeichnen
          entry.target.querySelectorAll('.annotate__underline, .annotate-circle')
            .forEach(function (a) { a.classList.add('is-drawn'); });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });

    // Hero-Unterstreichung gleich beim Laden zeichnen
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.querySelectorAll('.annotate__underline, .annotate-circle')
        .forEach(function (a) { a.classList.add('is-drawn'); });
    }
  }

  // 3. Smooth-Scroll fuer interne Anker ----------------------------------
  function initSmoothScroll() {
    if (reduceMotion) return;
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  onReady(function () {
    initHeaderShadow();
    initReveal();
    initSmoothScroll();
  });
})();
