/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-business.
 * Variant: carousel-business  |  Base block: carousel
 * Source: https://www.jsw.in/ (section.home_buss_main .home_buss_sldr)
 * Generated: 2026-07-17
 *
 * Block library structure (carousel): 2 columns, multiple rows.
 *   - Row 1: block name only (handled by createBlock)
 *   - Each subsequent row = one slide: [ image cell, content cell ]
 *
 * Source specifics: a Swiper carousel of business-division slides. Each
 * .swiper-slide has a full-bleed background <img> (direct child) followed by
 * a .container_1360_wrp holding .buss_lhs (division logo, title, description,
 * key stats, CTA) and .buss_rhs (a live NSE/BSE stock-price ticker).
 *   - Column 1: the background image.
 *   - Column 2: the .buss_lhs content (logo, heading, description, stats, CTA).
 * The .buss_rhs stock ticker is live, time-stamped market data (not static
 * import content) and is intentionally excluded.
 */
// Per-slide banner background images, in slide order. On the live page these
// are lazy-loaded inside GSAP scroll-pinned slides, so their <img src> is empty
// at import time; we inject the known source URLs by index so the imported
// content carries the banner images. (Sourced from the scraped image mapping.)
const BANNER_URLS = [
  'https://www.jsw.in/wp-content/uploads/2025/09/bus_bnr159.webp',
  'https://www.jsw.in/wp-content/uploads/2025/09/bus_bnr159-2.webp',
  'https://www.jsw.in/wp-content/uploads/2025/09/pro_bnr3-159.jpg',
  'https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr4.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr5.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr6.webp',
  'https://www.jsw.in/wp-content/uploads/2025/05/pro_bnr7.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr8.webp',
  'https://jswin.s3.ap-south-1.amazonaws.com/production/uploads/2026/05/contact-address-bg.webp',
  'https://www.jsw.in/wp-content/uploads/2025/09/pro_bnr9-2.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr10.webp',
  'https://www.jsw.in/wp-content/uploads/2025/08/Banner-Sample-2-1.png',
  'https://jswin.s3.ap-south-1.amazonaws.com/production/uploads/2026/06/greentech-banner-1-1-1.webp',
];

export default function parse(element, { document }) {
  // Real slides only (this carousel has no Swiper duplicates, but guard anyway).
  let slides = Array.from(
    element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)'),
  );
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.swiper-slide'));
  }

  const cells = [];

  slides.forEach((slide, slideIdx) => {
    // Background image: direct-child <img> of the slide, or the known banner URL.
    let bgImage = slide.querySelector(':scope > img');
    const bannerUrl = BANNER_URLS[slideIdx];
    const existingSrc = bgImage && bgImage.getAttribute('src');
    if (bannerUrl && (!bgImage || !existingSrc || existingSrc.startsWith('data:'))) {
      bgImage = document.createElement('img');
      bgImage.src = bannerUrl;
      bgImage.setAttribute('alt', '');
    }

    // Content lives in .buss_lhs (fall back to the container if class differs).
    const lhs = slide.querySelector('.buss_lhs')
      || slide.querySelector(':scope > .container_1360_wrp');

    const contentCell = [];
    if (lhs) {
      const logo = lhs.querySelector('.logo_buss, picture');
      const heading = lhs.querySelector('h1, h2, h3, .ttle, [class*="ttle"]');
      const description = lhs.querySelector('p, .desc, [class*="desc"]');
      const stats = lhs.querySelector('.info_numb_main');
      const cta = lhs.querySelector('a.common_cta, a[class*="cta"], a');

      if (logo) contentCell.push(logo);
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      // Only include the stats block if it actually has cards.
      if (stats && stats.querySelector('.info_numb_card')) contentCell.push(stats);
      if (cta) contentCell.push(cta);
    }

    // Skip slides with neither image nor content.
    if (!bgImage && !contentCell.length) return;

    cells.push([bgImage || '', contentCell.length ? contentCell : '']);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-business',
    cells,
  });
  element.replaceWith(block);
}
