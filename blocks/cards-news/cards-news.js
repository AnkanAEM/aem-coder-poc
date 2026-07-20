import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Latest News block.
 * Row 1  -> large featured card (image background + category + headline).
 * Rows 2+ -> stacked press-release items (category + headline link + tag).
 */
export default function decorate(block) {
  const rows = [...block.children];

  const featured = document.createElement('a');
  featured.className = 'cards-news-featured';

  const list = document.createElement('div');
  list.className = 'cards-news-list';

  // The final row may be the "Explore all" CTA: a lone link with no category
  // heading (press-release items always have an <h4> category). Detect and peel
  // it off so it renders as a button beneath the news grid, not a press card.
  let ctaAnchor = null;
  if (rows.length > 1) {
    const lastCell = rows[rows.length - 1].querySelector(':scope > div') || rows[rows.length - 1];
    const anchor = lastCell.querySelector('a');
    const isCategoryCard = lastCell.querySelector('h4, h6');
    if (anchor && !isCategoryCard) {
      ctaAnchor = anchor;
      rows.pop();
    }
  }

  rows.forEach((row, index) => {
    const cell = row.querySelector(':scope > div') || row;

    if (index === 0) {
      // Featured: cell contains an <a> with a picture and headline text.
      const anchor = cell.querySelector('a');
      const picture = cell.querySelector('picture');
      if (anchor) featured.href = anchor.getAttribute('href') || '#';

      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          picture.replaceWith(optimized);
          featured.append(optimized);
        } else {
          featured.append(picture);
        }
      }

      // Extract the headline text (may include a leaked "#### Category" prefix).
      let raw = (anchor ? anchor.textContent : cell.textContent).trim();
      raw = raw.replace(/^#+\s*/, '');
      // Category is a leading capitalised word/phrase, headline is the rest.
      const overlay = document.createElement('div');
      overlay.className = 'cards-news-featured-overlay';
      // Split at the first lowercase->uppercase transition (category|headline).
      const catMatch = raw.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*?)([A-Z].*)$/);
      const cat = document.createElement('h4');
      const headline = document.createElement('p');
      if (catMatch) {
        const [, category, title] = catMatch;
        cat.textContent = category;
        headline.textContent = title;
      } else {
        headline.textContent = raw;
      }
      if (cat.textContent) overlay.append(cat);
      overlay.append(headline);
      featured.append(overlay);
    } else {
      // Press-release item: keep category (h4), headline (p>a) and tag (h6).
      const item = document.createElement('div');
      item.className = 'cards-news-item';
      while (cell.firstElementChild) item.append(cell.firstElementChild);
      list.append(item);
    }
  });

  block.textContent = '';
  const grid = document.createElement('div');
  grid.className = 'cards-news-grid';
  grid.append(featured);
  grid.append(list);
  block.append(grid);

  if (ctaAnchor) {
    const cta = document.createElement('div');
    cta.className = 'cards-news-cta';
    ctaAnchor.classList.add('button');
    cta.append(ctaAnchor);
    block.append(cta);
  }
}
