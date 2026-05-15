/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-channel.
 * Base block: cards.
 * Source: https://www.marutisuzuki.com/
 * Generated: 2026-05-14
 *
 * Extracts a grid of business channel cards (NEXA, Arena, True Value, Commercial).
 * Each card has a video poster/background image, brand logo, tagline heading,
 * description, and Explore CTA link.
 *
 * Target structure (from library-example.md):
 * | Cards |
 * |-------|
 * | ![image](url) | **Title** Description [CTA](link) |
 * | ![image](url) | **Title** Description [CTA](link) |
 */
export default function parse(element, { document }) {
  // Find all card items within the block
  const cardItems = element.querySelectorAll('.business-card-item');

  const cells = [];

  cardItems.forEach((card) => {
    // Column 1: Card background image (video poster image)
    const posterImg = card.querySelector('.business-card-item-assets .vjs-poster img');
    // Fallback: try any img inside assets section
    const assetImg = posterImg || card.querySelector('.business-card-item-assets img');

    // Column 2: Text content (logo, title, description, CTA)
    const logoImg = card.querySelector('.business-card-item-logo img');
    const heading = card.querySelector('.business-card-item-title h3, .business-card-item-title h2, .business-card-item-title h1');
    const subtitle = card.querySelector('p.business-card-item-subtitle, .business-card-item-desc p');
    const ctaLink = card.querySelector('.business-card-item-desc a, .business-card-item-info a');

    // Build the image cell (col 1)
    const imageCell = [];
    if (assetImg) {
      imageCell.push(assetImg);
    }

    // Build the content cell (col 2)
    const contentCell = [];
    if (logoImg) {
      contentCell.push(logoImg);
    }
    if (heading) {
      contentCell.push(heading);
    }
    if (subtitle) {
      contentCell.push(subtitle);
    }
    if (ctaLink) {
      contentCell.push(ctaLink);
    }

    // Only add row if we have meaningful content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-channel', cells });
  element.replaceWith(block);
}
