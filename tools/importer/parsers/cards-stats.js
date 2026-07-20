/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats.
 * Variant: cards-stats  |  Base block: cards
 * Source: https://www.jsw.in/ (section.home_overview .overview_numb_wrp)
 * Generated: 2026-07-17
 *
 * Block library structure (cards, "no images" variant): 1 column, multiple rows.
 *   - Row 1: block name only (handled by createBlock)
 *   - Each subsequent row = one card, single cell holding heading + description.
 *
 * Source specifics: the target element (.overview_numb_wrp) holds a set of
 * .infonumb_card items. Each card has an <h2> (the stat number, e.g. "$23
 * Billion") and a <p> (the label, e.g. "Revenue"). There are no images, so
 * the single-column ("no images") cards layout applies. The surrounding
 * intro text and CTA are section default content and are intentionally
 * excluded (they are handled by the page transformer, not this block).
 */
export default function parse(element, { document }) {
  // Each stat card. Fallback to direct children if class differs across pages.
  let cards = Array.from(element.querySelectorAll(':scope > .infonumb_card'));
  if (!cards.length) {
    cards = Array.from(element.querySelectorAll(':scope > div'));
  }

  const cells = [];

  cards.forEach((card) => {
    const heading = card.querySelector('h1, h2, h3, h4');
    const description = card.querySelector('p');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);

    // Skip empty cards.
    if (!contentCell.length) return;

    // 1-column row: one cell holding all of the card's content.
    cells.push([contentCell]);
  });

  // Empty-block guard: nothing usable -> unwrap.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-stats',
    cells,
  });
  element.replaceWith(block);
}
