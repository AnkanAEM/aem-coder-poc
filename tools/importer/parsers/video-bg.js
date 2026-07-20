/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-bg.
 * Variant: video-bg  |  Base block: video
 * Source: https://www.jsw.in/ (section.jsw_sports_wrp)
 * Generated: 2026-07-17
 *
 * Block library structure (video): 1 column, 2 rows.
 *   - Row 1: block name only (handled by createBlock)
 *   - Row 2 (single cell): the video source as a link to the video file/URL,
 *     plus an optional poster image.
 *
 * Source specifics: the section holds a native <video><source src="...mp4">
 * background video and a .caption_wrp overlay (logo picture, title, desc,
 * CTA). The video-bg block JS (blocks/video-bg/video-bg.js) reads the video
 * URL from an <a> href and uses a <picture> as the poster placeholder, so the
 * parser must convert the <video><source> into an anchor and provide the
 * overlay logo picture as the poster image. The overlay heading/description/
 * CTA are kept in the cell so their content is not lost on import.
 */
export default function parse(element, { document }) {
  // Video source URL: prefer <source src>, fall back to <video src> or an <a>.
  const source = element.querySelector('video source[src], video[src], a[href]');
  let videoUrl = '';
  if (source) {
    videoUrl = source.getAttribute('src') || source.getAttribute('href') || '';
  }

  // Poster / overlay logo image.
  const poster = element.querySelector('.caption_wrp picture, picture');

  // Overlay caption content.
  const caption = element.querySelector('.caption_wrp');
  const heading = caption
    ? caption.querySelector('h1, h2, h3, .common_ttle, [class*="ttle"]')
    : null;
  const description = caption
    ? caption.querySelector('p, .desc, [class*="desc"]')
    : null;
  const cta = caption
    ? caption.querySelector('a.common_cta, a[class*="cta"], a')
    : null;

  // Empty-block guard: no video URL and no caption -> unwrap.
  if (!videoUrl && !heading && !description) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build the single content cell (video is 1-column).
  const contentCell = [];

  // Video source as an anchor link (block JS reads this href).
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentCell.push(link);
  }

  // Optional poster image.
  if (poster) contentCell.push(poster);

  // Overlay caption content (preserved so it isn't lost on import).
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'video-bg',
    cells,
  });
  element.replaceWith(block);
}
