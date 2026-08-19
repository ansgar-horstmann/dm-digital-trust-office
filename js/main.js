/* Demand Management — leadership guide
   Progressive enhancement only: the document is fully readable without JS. */

(function () {
  'use strict';

  /* ---------- Icons ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /* ---------- Highlight the section currently in view ---------- */
  function initSectionTracking() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.subnav__list a[href^="#"]')
    );
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = link;
      sections.push(section);
    });

    function setCurrent(id) {
      links.forEach(function (link) {
        if (byId[id] === link) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        // Prefer the entry closest to the top of the viewport.
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        if (!visible.length) return;
        visible.sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        setCurrent(visible[0].target.id);
      },
      {
        // Offset for the sticky masthead + subnav so the highlight flips
        // when a section reaches the reading area, not the raw viewport edge.
        rootMargin: '-120px 0px -55% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Print: expand every FAQ answer, then restore ---------- */
  function initPrintExpansion() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
    if (!items.length) return;

    var reopened = [];

    function expandAll() {
      reopened = items.filter(function (item) { return !item.open; });
      reopened.forEach(function (item) { item.open = true; });
    }

    function restore() {
      reopened.forEach(function (item) { item.open = false; });
      reopened = [];
    }

    if (window.matchMedia) {
      var mq = window.matchMedia('print');
      var handler = function (e) { (e.matches ? expandAll : restore)(); };
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handler);
      } else if (typeof mq.addListener === 'function') {
        mq.addListener(handler);
      }
    }

    window.addEventListener('beforeprint', expandAll);
    window.addEventListener('afterprint', restore);
  }

  function init() {
    renderIcons();
    initSectionTracking();
    initPrintExpansion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
