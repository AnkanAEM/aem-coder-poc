/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product
 * Base block: carousel
 * Source: https://www.marutisuzuki.com/
 * Generated: 2026-05-14
 *
 * Product thumbnail carousel with car images organized by category (ARENA, NEXA).
 * Each car shows as image + name label. The heading and category titles are part of the block.
 * Extracts only non-clone slides to avoid duplicate entries.
 */
export default function parse(element, { document }) {
  // Extract main heading (e.g. "Discover Maruti Suzuki Cars")
  const heading = element.querySelector('.gallery-header h2, .range-component > .row h2');

  // Extract category sections - each has a .slider-title followed by a carousel
  const sliderTitles = Array.from(element.querySelectorAll('.slider-title h3'));
  const carousels = Array.from(element.querySelectorAll('.carousel.slide.splide'));

  const cells = [];

  // Add heading row if present
  if (heading) {
    cells.push([heading]);
  }

  // Process each category and its products
  sliderTitles.forEach((categoryTitle, index) => {
    // Add category title row
    cells.push([categoryTitle]);

    // Get corresponding carousel (same index)
    const carousel = carousels[index];
    if (!carousel) return;

    // Get only non-clone slides to avoid duplicates from splide cloning
    const slides = Array.from(
      carousel.querySelectorAll('li.splide__slide:not(.splide__slide--clone)')
    );

    // Deduplicate slides by href to handle splide loop duplicates
    const seenHrefs = new Set();

    // Extract each product slide as image + name row
    slides.forEach((slide) => {
      const img = slide.querySelector('img.img-fluid');
      const nameEl = slide.querySelector('h6.img-title');
      const link = slide.querySelector('a.image-area');

      // Skip duplicates based on href
      if (link && seenHrefs.has(link.href)) return;
      if (link) seenHrefs.add(link.href);

      if (img && nameEl) {
        // Create a linked image if link exists
        const imageCell = document.createElement('div');
        if (link) {
          const anchor = document.createElement('a');
          anchor.href = link.href;
          const imgClone = img.cloneNode(true);
          anchor.appendChild(imgClone);
          imageCell.appendChild(anchor);
        } else {
          imageCell.appendChild(img.cloneNode(true));
        }

        // Create name cell with link if available
        const nameCell = document.createElement('div');
        if (link) {
          const nameAnchor = document.createElement('a');
          nameAnchor.href = link.href;
          nameAnchor.textContent = nameEl.textContent.trim();
          nameCell.appendChild(nameAnchor);
        } else {
          nameCell.textContent = nameEl.textContent.trim();
        }

        cells.push([imageCell, nameCell]);
      }
    });
  });

  // Fallback: if no slider-titles found, try to extract all non-clone slides directly
  if (sliderTitles.length === 0) {
    const allSlides = Array.from(
      element.querySelectorAll('li.splide__slide:not(.splide__slide--clone)')
    );
    allSlides.forEach((slide) => {
      const img = slide.querySelector('img.img-fluid');
      const nameEl = slide.querySelector('h6.img-title');
      const link = slide.querySelector('a.image-area');

      if (img && nameEl) {
        const imageCell = document.createElement('div');
        if (link) {
          const anchor = document.createElement('a');
          anchor.href = link.href;
          anchor.appendChild(img.cloneNode(true));
          imageCell.appendChild(anchor);
        } else {
          imageCell.appendChild(img.cloneNode(true));
        }

        const nameCell = document.createElement('div');
        if (link) {
          const nameAnchor = document.createElement('a');
          nameAnchor.href = link.href;
          nameAnchor.textContent = nameEl.textContent.trim();
          nameCell.appendChild(nameAnchor);
        } else {
          nameCell.textContent = nameEl.textContent.trim();
        }

        cells.push([imageCell, nameCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
