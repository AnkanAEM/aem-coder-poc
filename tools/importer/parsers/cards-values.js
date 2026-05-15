/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-values.
 * Base block: cards
 * Source: https://www.marutisuzuki.com/
 * Selector: .corp-our-values.block
 * Generated: 2026-05-14
 *
 * Extracts company value icons and their names from a grid layout.
 * Each value becomes a row with [icon, value name].
 * Source has 5 value items (Responsible, Dynamic, Open, Reliable, Efficient)
 * with CTA buttons below - buttons are included as a final row.
 */
export default function parse(element, { document }) {
  // Extract value items from the icon grid
  // Source structure: ul > li.sub-holder > div.img-space > img
  const valueItems = element.querySelectorAll('li.sub-holder');

  const cells = [];

  // Each value item becomes a row: [icon image, value name from alt text]
  valueItems.forEach((item) => {
    const img = item.querySelector('img');
    if (img) {
      // Value name comes from the alt attribute, capitalized
      const valueName = img.getAttribute('alt') || '';
      const nameEl = document.createElement('p');
      nameEl.textContent = valueName.charAt(0).toUpperCase() + valueName.slice(1);
      cells.push([img, nameEl]);
    }
  });

  // Extract CTA buttons from .button-holder
  const ctaLinks = Array.from(element.querySelectorAll('.button-holder a.button, .button-holder a.btns'));
  if (ctaLinks.length > 0) {
    // Deduplicate - buttons may match both selectors
    const uniqueLinks = [...new Set(ctaLinks)];
    cells.push(uniqueLinks);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-values', cells });
  element.replaceWith(block);
}
