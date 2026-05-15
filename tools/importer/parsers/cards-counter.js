/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-counter variant.
 * Base block: cards
 * Source: https://www.marutisuzuki.com/
 * Selector: .corp-counter.block
 * Description: Counter/statistics block with large animated number, label text, and CTA buttons.
 * Generated: 2026-05-14
 */
export default function parse(element, { document }) {
  // Extract the counter number from .numscroller span
  const counterSpan = element.querySelector('.numscroller span');
  const counterNumber = counterSpan ? counterSpan.textContent.trim() : '';

  // Format the number with commas (e.g., 29777748 -> 29,777,748)
  const formattedNumber = counterNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Extract the label text from the first .count-label (the one with content)
  const countLabels = element.querySelectorAll('.count-label');
  let labelText = '';
  for (const label of countLabels) {
    const text = label.textContent.trim();
    if (text) {
      labelText = text;
      break;
    }
  }

  // Extract CTA buttons from .button-gutter
  const ctaLinks = Array.from(element.querySelectorAll('.button-gutter a.button, .button-gutter a'));

  // Build the content cell matching library example:
  // **number** label text [CTA1](link) [CTA2](link) — all in one cell
  const container = document.createElement('div');

  // Create bold number + label as a paragraph
  if (formattedNumber || labelText) {
    const p = document.createElement('p');
    if (formattedNumber) {
      const strong = document.createElement('strong');
      strong.textContent = formattedNumber;
      p.appendChild(strong);
    }
    if (labelText) {
      // Normalize to title case for cleaner output
      const normalizedLabel = labelText.charAt(0).toUpperCase() + labelText.slice(1).toLowerCase();
      p.appendChild(document.createTextNode(' ' + normalizedLabel));
    }
    container.appendChild(p);
  }

  // Add CTA links as separate paragraphs for proper markdown rendering
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    container.appendChild(p);
  });

  // Build cells array: single row with all content in one cell
  const cells = [[container]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-counter', cells });
  element.replaceWith(block);
}
