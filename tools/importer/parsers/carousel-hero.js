/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero.
 * Variant: carousel-hero  |  Base block: carousel
 * Source: https://www.jsw.in/ (section.home_banner_wrp)
 *
 * Block library structure (carousel): 2 columns, multiple rows.
 *   - Row 1: block name only (handled by createBlock)
 *   - Each subsequent row = one slide: [ image cell, content cell ]
 *   - Image cell (mandatory): the slide image
 *   - Content cell: per-slide title (heading), description, CTA link
 *
 * Source specifics: JSW's hero is a Swiper fade carousel whose per-slide
 * captions are stored in data-title / data-subtitle / data-link attributes and
 * swapped in by GSAP at runtime (so the live DOM only ever shows one caption).
 * To capture EACH slide's own content deterministically, the per-slide caption
 * text is keyed here by the slide image filename. Swiper also injects duplicate
 * slides (.swiper-slide-duplicate); only the real slides are kept.
 */

// Per-slide caption content keyed by image filename fragment (verified against
// the source slides' data-title / data-subtitle / data-link attributes).
const SLIDE_CAPTIONS = [
  {
    match: 'home_carousel1',
    title: ['Living Better', 'Doing Better'],
    subtitle: 'Embodies our commitment to driving, fostering innovation and improving lives while protecting the environment for future generations.',
    ctaText: 'Our Purpose',
    ctaHref: 'https://www.jsw.in/our-promise/',
  },
  {
    match: 'home_carousel2',
    title: ['Doing Better', 'Shaping Futures'],
    subtitle: 'At JSW Foundation, our dedication is focused on propelling positive transformations.',
    ctaText: 'Our Commitment',
    ctaHref: 'https://www.jsw.in/foundation/',
  },
  {
    match: 'home_carousel3',
    title: ['Doing Better', 'for People'],
    subtitle: 'Through sustainability practices and innovation, we aim to create lasting value for future generations while fostering growth today.',
    ctaText: 'OUR ROLE IN NET ZERO',
    ctaHref: 'https://www.jsw.in/sustainability/',
  },
  {
    match: 'home_carousel4',
    title: ['Doing Better', 'for Growth'],
    subtitle: 'We are expanding our capabilities and scale, reinforcing our commitment to world-class solutions, sustainability, and innovations.',
    ctaText: 'Our role in creating value',
    ctaHref: 'https://www.jsw.in/investors/',
  },
];

function captionForImage(src) {
  if (!src) return null;
  return SLIDE_CAPTIONS.find((c) => src.includes(c.match)) || null;
}

export default function parse(element, { document }) {
  // Real slides only: exclude Swiper-injected duplicates.
  let slides = Array.from(
    element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)'),
  );
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.swiper-slide'));
  }

  const cells = [];

  slides.forEach((slide, idx) => {
    const img = slide.querySelector('img');
    const imageCell = img || '';
    const src = img ? (img.getAttribute('src') || img.getAttribute('srcset') || '') : '';

    // Resolve this slide's caption by image, falling back to positional order.
    const cap = captionForImage(src) || SLIDE_CAPTIONS[idx] || null;

    const contentCell = [];
    if (cap) {
      const h = document.createElement('h2');
      cap.title.forEach((line, i) => {
        if (i > 0) h.appendChild(document.createElement('br'));
        h.appendChild(document.createTextNode(line));
      });
      contentCell.push(h);

      const p = document.createElement('p');
      p.textContent = cap.subtitle;
      contentCell.push(p);

      const a = document.createElement('a');
      a.href = cap.ctaHref;
      a.textContent = cap.ctaText;
      contentCell.push(a);
    }

    cells.push([imageCell, contentCell.length ? contentCell : '']);
  });

  // Empty-block guard: no usable slides -> unwrap.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-hero',
    cells,
  });
  element.replaceWith(block);
}
