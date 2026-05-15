/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-highlight variant.
 * Base block: cards
 * Source: https://www.marutisuzuki.com/
 * Selector: .highlights.block
 *
 * Compact highlight cards with title, description, and link.
 * Each card becomes one row with title (strong), description, and CTA link.
 */
export default function parse(element, { document }) {
  // Each card is a .highlight__card within the block
  const cards = element.querySelectorAll('.highlight__card');

  const cells = [];

  cards.forEach((card) => {
    // Extract title from h4.h-title inside the bottom section
    const titleEl = card.querySelector('.btm-title .h-title, h4.h-title');
    // Extract description from .highlight__bottom__description p
    const descEl = card.querySelector('.highlight__bottom__description p');
    // Extract link - the anchor wrapping bottom content
    const linkEl = card.querySelector('a.bottom-section');

    const cellContent = [];

    // Title as strong/bold element
    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      cellContent.push(strong);
    }

    // Description text
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      cellContent.push(p);
    }

    // Link/CTA
    if (linkEl) {
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = titleEl ? titleEl.textContent.trim() : 'Learn More';
      cellContent.push(a);
    }

    if (cellContent.length > 0) {
      // Single cell per row - wrap in array to form one column
      cells.push([cellContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-highlight', cells });
  element.replaceWith(block);
}
