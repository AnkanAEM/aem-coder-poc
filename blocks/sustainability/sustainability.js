/**
 * Sustainability block.
 * Authored structure (single cell, in order):
 *   - background image (picture)
 *   - eyebrow label (short paragraph, e.g. "Sustainability")
 *   - heading
 *   - description paragraph
 *   - CTA link
 * Decorated into a full-bleed image band with a left gradient scrim and the
 * eyebrow/heading/description/CTA overlaid on the left (matches jsw.in).
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const picture = cell.querySelector('picture');
  const paragraphs = [...cell.querySelectorAll(':scope > p')];
  const heading = cell.querySelector('h1, h2, h3, h4');
  const ctaLink = cell.querySelector('a');

  // background image = first paragraph containing the picture
  const bgPara = paragraphs.find((p) => p.querySelector('picture')) || null;
  // eyebrow = a text-only paragraph before the heading (no picture, no link)
  const eyebrow = paragraphs.find((p) => !p.querySelector('picture') && !p.querySelector('a') && p.textContent.trim());
  // description = the text-only paragraph that is not the eyebrow
  const description = paragraphs.find(
    (p) => p !== eyebrow && !p.querySelector('picture') && !p.querySelector('a') && p.textContent.trim(),
  );

  const media = document.createElement('div');
  media.className = 'sustainability-media';
  if (picture) media.append(picture);
  else if (bgPara) media.append(...bgPara.childNodes);

  const content = document.createElement('div');
  content.className = 'sustainability-content';
  if (eyebrow) {
    eyebrow.classList.add('sustainability-eyebrow');
    content.append(eyebrow);
  }
  if (heading) content.append(heading);
  if (description) content.append(description);
  if (ctaLink) {
    const ctaWrap = document.createElement('p');
    ctaWrap.className = 'sustainability-cta';
    ctaLink.classList.add('button');
    ctaWrap.append(ctaLink);
    content.append(ctaWrap);
  }

  block.textContent = '';
  block.append(media, content);
}
