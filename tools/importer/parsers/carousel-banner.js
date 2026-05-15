/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-banner
 * Base block: carousel
 * Source: https://www.marutisuzuki.com/
 * Selector: .corp-carousel.block
 * Generated: 2026-05-14
 *
 * Extracts rotating banner slides from the source carousel.
 * Each slide contains a linked image (desktop variant preferred).
 * Each slide becomes one row in the Carousel block table.
 *
 * Note: Live page uses srcset instead of src on images.
 */
export default function parse(element, { document }) {
  // Extract all slide containers
  const slides = element.querySelectorAll('.mySlides');

  const cells = [];

  slides.forEach((slide) => {
    // Each slide has an <a> wrapping images (mobile + desktop)
    const link = slide.querySelector('a[href]');
    // Prefer desktop image, fall back to any image in the slide
    const image = slide.querySelector('img.generic-desktop') || slide.querySelector('img');

    if (image && link) {
      // Get image URL from src or srcset (live page uses srcset)
      const imgSrc = image.getAttribute('src') || image.getAttribute('srcset') || '';

      // Create a proper image element with src attribute
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = image.getAttribute('alt') || '';

      // Create anchor wrapping the image to preserve link destination
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('href') || link.href;
      anchor.appendChild(img);

      cells.push([anchor]);
    } else if (image) {
      const imgSrc = image.getAttribute('src') || image.getAttribute('srcset') || '';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = image.getAttribute('alt') || '';
      cells.push([img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-banner', cells });
  element.replaceWith(block);
}
