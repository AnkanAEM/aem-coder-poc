/* eslint-disable */
/* global WebImporter */
/**
 * Parser for foundation.
 * Source: https://www.jsw.in/ (section.home_foundation_wrp)
 *
 * Produces a single parent "foundation" block (1 column, N rows):
 *   - Row 1: the intro/text column - logo, heading, description, two stat
 *     pairs (stat number as h3 + label p), and the EXPLORE CTA.
 *   - Rows 2..N: one focus-area carousel slide each - the background image
 *     followed by the slide heading and description, stacked in one cell.
 * The block JS renders the intro on the left and builds a nested carousel
 * (reusing the carousel-focus block) on the right. Keeping every row a single
 * cell keeps the block table stable through the markdown round-trip.
 */

// Per-slide focus-area background images, in slide order. On the live page each
// slide's photo is a CSS background (no <img> in the DOM), so inject the known
// source URLs by index so the imported content carries them.
const FOCUS_BG_URLS = [
  'https://www.jsw.in/wp-content/uploads/2025/05/found9.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found1.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found2.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found3.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found4.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found5.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found6.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found7.webp',
  'https://www.jsw.in/wp-content/uploads/2025/03/found8.webp',
];

export default function parse(element, { document }) {
  const cells = [];

  // --- Row 1: intro / text column ---
  const lhs = element.querySelector('.foundation_lhs') || element;
  const intro = [];

  const logo = lhs.querySelector('picture, img');
  if (logo) {
    const p = document.createElement('p');
    p.append(logo);
    intro.push(p);
  }

  const heading = lhs.querySelector('h2.common_ttle, h1, h2');
  if (heading) intro.push(heading);

  const desc = lhs.querySelector('p.desc, p');
  if (desc) intro.push(desc);

  // Stats: each .found_card has an h2 (e.g. "8 Lakh") + a p (label).
  lhs.querySelectorAll('.found_card').forEach((card) => {
    const statHeading = card.querySelector('h2');
    const statLabel = card.querySelector('p');
    if (statHeading) {
      const h = document.createElement('h3');
      h.textContent = statHeading.textContent.trim().replace(/\s+/g, ' ');
      intro.push(h);
    }
    if (statLabel) {
      const p = document.createElement('p');
      p.textContent = statLabel.textContent.trim();
      intro.push(p);
    }
  });

  const cta = lhs.querySelector('a.common_cta, a[class*="cta"], a');
  if (cta) {
    const p = document.createElement('p');
    p.append(cta);
    intro.push(p);
  }

  cells.push([intro]);

  // --- Rows 2..N: carousel slides (single cell: image + heading + desc) ---
  let slides = Array.from(
    element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)'),
  );
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.swiper-slide'));
  }

  slides.forEach((slide, slideIdx) => {
    let bgImage = slide.querySelector(':scope > img');
    const bgUrl = FOCUS_BG_URLS[slideIdx];
    const existingSrc = bgImage && bgImage.getAttribute('src');
    if (bgUrl && (!bgImage || !existingSrc || existingSrc.startsWith('data:'))) {
      bgImage = document.createElement('img');
      bgImage.src = bgUrl;
      bgImage.setAttribute('alt', '');
    }

    const pop = slide.querySelector('.foundation_pop');
    const slideCell = [];
    if (bgImage) {
      const p = document.createElement('p');
      p.append(bgImage);
      slideCell.push(p);
    }
    if (pop) {
      const slideHeading = pop.querySelector('h1, h2, h3, h4');
      const slideDesc = pop.querySelector('p');
      if (slideHeading) slideCell.push(slideHeading);
      if (slideDesc) slideCell.push(slideDesc);
    }

    if (!slideCell.length) return;
    cells.push([slideCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'foundation',
    cells,
  });
  element.replaceWith(block);
}
