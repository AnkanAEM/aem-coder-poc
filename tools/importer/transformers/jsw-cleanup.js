/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: jsw.in site-wide cleanup.
 *
 * Removes non-authorable site chrome and WordPress/swiper runtime cruft so the
 * import contains only page-level authorable content.
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (scraped homepage DOM). None are guessed.
 *
 * Verified in captured DOM:
 *   - <section class="header_full_wrp nav-up" id="header">  (line 3)   -> global header/nav/mega-menu/search
 *   - <section class="footer_wrp" id="footer">              (line 1044) -> global footer
 *   - <div id="careerModal" class="modal fade show">        (line 1111) -> career/disclaimer modal overlay
 *   - <div class="modal-backdrop fade show">                (line 1140) -> modal backdrop overlay
 *   - <div class="swiper-slide ... swiper-slide-duplicate ..."> (lines 211, 247) -> cloned hero slides
 *   - <body class="... modal-open" style="... overflow: hidden; ...">   -> scroll-locked body from open modal
 *
 * NOT removed (load-bearing / authorable):
 *   - <video> + its <source src="...sports.mp4"> in section.jsw_sports_wrp (line 1010) -> video-bg block
 *   - <picture>/<source> inside content sections -> authorable responsive images
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Modal backdrop overlay is pure chrome; remove it. The #careerModal itself
    // is kept here so the disclaimer-modal parser can capture its content; any
    // unparsed remnant is cleaned up in afterTransform below.
    WebImporter.DOMUtils.remove(element, ['.modal-backdrop']);

    // Search overlay panel (the header search drawer with a close icon + the
    // "What are you looking for?" prompt). It is live-DOM chrome injected above
    // the banner and is not authorable page content.
    WebImporter.DOMUtils.remove(element, ['.overlay-search-main']);

    // Remove cloned swiper slides (runtime duplicates) so carousels don't get
    // phantom entries. Only actual clones (.swiper-slide-duplicate), NOT the
    // state-only class .swiper-slide-duplicate-prev on a real slide.
    element.querySelectorAll('.swiper-slide-duplicate').forEach((slide) => {
      if (slide.classList.contains('swiper-slide')) slide.remove();
    });

    // Strip swiper runtime state classes left over from the live-rendered scrape.
    // These are added by swiper's JS at runtime and are not authorable.
    const swiperStateClasses = [
      'swiper-initialized', 'swiper-horizontal', 'swiper-vertical',
      'swiper-pointer-events', 'swiper-backface-hidden', 'swiper-fade',
      'swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next',
      'swiper-slide-visible', 'swiper-slide-duplicate-active',
      'swiper-slide-duplicate-prev', 'swiper-slide-duplicate-next',
      'swiper-pagination-clickable', 'swiper-pagination-bullets',
      'swiper-pagination-horizontal', 'swiper-pagination-bullet-active',
    ];
    element.querySelectorAll('[class*="swiper"]').forEach((el) => {
      swiperStateClasses.forEach((cls) => el.classList.remove(cls));
    });

    // Restore scrolling on the body/root if the open modal locked it.
    const scrollLocked = element.querySelectorAll('[style*="overflow: hidden"], [style*="overflow:hidden"]');
    scrollLocked.forEach((el) => { el.style.overflow = ''; });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome: header (nav, mega menus, search) and footer.
    WebImporter.DOMUtils.remove(element, [
      'section.header_full_wrp#header',
      'section.footer_wrp#footer',
    ]);

    // Remove any #careerModal remnant not consumed by the disclaimer-modal
    // parser (parsers run between the two hooks, replacing it with the block).
    WebImporter.DOMUtils.remove(element, ['#careerModal']);

    // Leftover non-content elements.
    WebImporter.DOMUtils.remove(element, ['noscript', 'iframe', 'link', 'style']);

    // Attribute cleanup on all elements: strip WordPress/tracking/runtime attributes.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('aria-hidden');
      el.removeAttribute('tabindex');
    });
  }
}
