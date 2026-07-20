/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news.
 * Variant: cards-news  |  Base block: cards
 * Source: https://www.jsw.in/ (section.latest_news_wrp .lates_container)
 * Generated: 2026-07-17
 *
 * Block library structure (cards, "no images" variant): 1 column, multiple rows.
 *   - Row 1: block name only (handled by createBlock)
 *   - Each subsequent row = one card, single cell holding the news item.
 *
 * Source specifics: the target (.lates_container) holds a single .latest_card
 * with:
 *   - .lates_lhs : the featured story (a link wrapping a category <h4> and a
 *     summary <p>).
 *   - .lates_rhs : two secondary items (.cvr), each with a category <h4>, a
 *     link wrapping a <p class="desc"> summary, and an <h6> source label.
 * There are no images, so the single-column ("no images") cards layout
 * applies. Each news item (featured + the two secondary) becomes one card row.
 * The section heading ("Latest News") and the "Explore all" CTA are section
 * default content and are intentionally excluded.
 */
export default function parse(element, { document }) {
  const card = element.querySelector('.latest_card') || element;
  const cells = [];

  // Featured story (left-hand side).
  const featured = card.querySelector('.lates_lhs');
  if (featured) {
    cells.push([featured]);
  }

  // Secondary items (right-hand side): one card per .cvr.
  const secondary = Array.from(
    card.querySelectorAll('.lates_rhs .cvr'),
  );
  secondary.forEach((item) => {
    cells.push([item]);
  });

  // "Explore all" CTA: lives inside the card in the source (a.common_cta).
  // Include it as a final card row so the block renders the button.
  const exploreAll = card.querySelector('a.common_cta')
    || element.querySelector('a.common_cta');
  if (exploreAll) {
    cells.push([exploreAll]);
  }

  // Fallback: if the expected structure isn't found, treat any direct anchors
  // with content as cards.
  if (!cells.length) {
    const fallbackItems = Array.from(
      card.querySelectorAll(':scope > a, :scope > div'),
    ).filter((el) => !el.classList.contains('common_cta'));
    fallbackItems.forEach((el) => cells.push([el]));
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-news',
    cells,
  });
  element.replaceWith(block);
}
