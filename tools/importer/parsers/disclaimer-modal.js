/* eslint-disable */
/* global WebImporter */
/**
 * Parser for disclaimer-modal.
 * Source: https://www.jsw.in/ (#careerModal) - the first-load fraud disclaimer.
 *
 * Produces a single-cell block containing the JSW logo, the disclaimer heading,
 * and the body paragraphs. The block JS moves this content into a dialog shown
 * once per session. The modal is normally excluded from page content by the
 * cleanup transformer; this parser is invoked explicitly against #careerModal.
 */
export default function parse(element, { document }) {
  const scroll = element.querySelector('.scroll-content');
  const heading = element.querySelector('h1, h2, h3, h4');
  const logo = element.querySelector('img');

  const cell = [];
  if (logo) {
    const p = document.createElement('p');
    p.append(logo);
    cell.push(p);
  }
  if (heading) cell.push(heading);
  if (scroll) {
    scroll.querySelectorAll('p').forEach((p) => cell.push(p));
  }

  if (!cell.length) {
    element.remove();
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'disclaimer-modal',
    cells: [[cell]],
  });
  element.replaceWith(block);
}
