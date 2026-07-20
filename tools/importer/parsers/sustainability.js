/* eslint-disable */
/* global WebImporter */
/**
 * Parser for sustainability.
 * Source: https://www.jsw.in/ (section.home_sustainability_wrp)
 *
 * Produces a single-cell block containing, in order:
 *   - the background image (picture)
 *   - the eyebrow label ("Sustainability")
 *   - the heading
 *   - the description paragraph
 *   - the EXPLORE CTA link
 * The block JS lays these out as a full-bleed image band with overlay text.
 */
export default function parse(element, { document }) {
  const cell = [];

  // Background image: the section's full-bleed picture/img.
  const picture = element.querySelector('picture');
  const img = element.querySelector('img');
  if (picture) {
    const p = document.createElement('p');
    p.append(picture);
    cell.push(p);
  } else if (img) {
    const p = document.createElement('p');
    p.append(img);
    cell.push(p);
  }

  // Eyebrow label (small text above the heading).
  const container = element.querySelector('.container_1360_wrp') || element;
  const eyebrow = container.querySelector('.small_ttle, .sub_ttle, [class*="sub"], .eyebrow');
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    cell.push(p);
  }

  // Heading (real heading element, not the eyebrow span which also matches *ttle*).
  const heading = container.querySelector('h1, h2, h3, h4');
  if (heading) cell.push(heading);

  // Description paragraph.
  const desc = container.querySelector('p');
  if (desc) cell.push(desc);

  // CTA link.
  const cta = container.querySelector('a.common_cta, a[class*="cta"], a');
  if (cta) cell.push(cta);

  if (!cell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'sustainability',
    cells: [[cell]],
  });
  element.replaceWith(block);
}
