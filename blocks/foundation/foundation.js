import { loadCSS } from '../../scripts/aem.js';

/**
 * JSW Foundation section: a text intro (left) beside a focus-area carousel
 * (right). The authored block is a single column where row 1 is the intro and
 * each following row is one carousel slide (image + heading + description).
 * The intro is rendered directly; the slides are reshaped into the structure
 * the carousel-focus block expects and handed to that block's decorator so all
 * carousel behaviour and styling is reused.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 -> intro / text column.
  const introRow = rows.shift();
  const introCell = introRow.querySelector(':scope > div') || introRow;
  const intro = document.createElement('div');
  intro.className = 'foundation-intro';
  intro.append(...introCell.childNodes);

  // Group the two stat pairs (h3 + following p) into stat cards with a divider.
  const stats = document.createElement('div');
  stats.className = 'foundation-stats';
  intro.querySelectorAll(':scope > h3').forEach((statHeading) => {
    const card = document.createElement('div');
    card.className = 'foundation-stat';
    const label = statHeading.nextElementSibling;
    card.append(statHeading);
    if (label && label.tagName === 'P') card.append(label);
    stats.append(card);
  });
  if (stats.children.length) {
    // Insert the stats grid where the first stat card used to be (before CTA).
    const cta = intro.querySelector(':scope > p:last-child');
    if (cta) intro.insertBefore(stats, cta);
    else intro.append(stats);
  }

  // Remaining rows -> carousel slides. Reshape each single-cell row
  // ([picture, h2, p]) into the carousel-focus row shape: an image column and
  // a content column.
  const carousel = document.createElement('div');
  carousel.className = 'carousel-focus block';
  carousel.dataset.blockName = 'carousel-focus';

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const picture = cell.querySelector('picture, img');
    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    const description = cell.querySelector('p');

    const slideRow = document.createElement('div');
    const imageCol = document.createElement('div');
    const contentCol = document.createElement('div');
    if (picture) imageCol.append(picture);
    if (heading) contentCol.append(heading);
    if (description) contentCol.append(description);
    slideRow.append(imageCol, contentCol);
    carousel.append(slideRow);
  });

  block.textContent = '';
  block.append(intro, carousel);

  // Load and run the carousel-focus block on the nested element.
  loadCSS(`${window.hlx.codeBasePath}/blocks/carousel-focus/carousel-focus.css`);
  try {
    const mod = await import('../carousel-focus/carousel-focus.js');
    if (mod.default) await mod.default(carousel);
    carousel.dataset.blockStatus = 'loaded';
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('foundation: failed to load carousel-focus', e);
  }
}
