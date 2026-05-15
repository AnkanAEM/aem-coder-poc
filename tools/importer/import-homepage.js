/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselBannerParser from './parsers/carousel-banner.js';
import cardsChannelParser from './parsers/cards-channel.js';
import cardsHighlightParser from './parsers/cards-highlight.js';
import carouselProductParser from './parsers/carousel-product.js';
import cardsValuesParser from './parsers/cards-values.js';
import cardsCounterParser from './parsers/cards-counter.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/marutisuzuki-cleanup.js';
import sectionsTransformer from './transformers/marutisuzuki-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-banner': carouselBannerParser,
  'cards-channel': cardsChannelParser,
  'cards-highlight': cardsHighlightParser,
  'carousel-product': carouselProductParser,
  'cards-values': cardsValuesParser,
  'cards-counter': cardsCounterParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Maruti Suzuki homepage with hero banner, vehicle showcases, offers, and brand content',
  urls: ['https://www.marutisuzuki.com/'],
  blocks: [
    {
      name: 'carousel-banner',
      instances: ['.corp-carousel.block'],
    },
    {
      name: 'cards-channel',
      instances: ['.corporate-business-card.block'],
    },
    {
      name: 'cards-highlight',
      instances: ['.highlights.block'],
    },
    {
      name: 'carousel-product',
      instances: ['.corp-slider.block'],
    },
    {
      name: 'cards-values',
      instances: ['.corp-our-values.block'],
    },
    {
      name: 'cards-counter',
      instances: ['.corp-counter.block'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.section.corp-carousel-container',
      style: null,
      blocks: ['carousel-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Business Channels',
      selector: '.section.corporate-business-card-container',
      style: null,
      blocks: ['cards-channel'],
      defaultContent: ['.corporate-business-card .business-card-title', '.corporate-business-card .business-card-title-hr'],
    },
    {
      id: 'section-3',
      name: 'Highlights',
      selector: '.section.highlights-container',
      style: null,
      blocks: ['cards-highlight'],
      defaultContent: ['.highlights-container .default-content-wrapper h2'],
    },
    {
      id: 'section-4',
      name: 'Car Catalog',
      selector: '.section.corp-slider-container',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Our Values',
      selector: '.section.corp-our-values-container',
      style: null,
      blocks: ['cards-values'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Customer Counter',
      selector: '.section.corp-counter-container',
      style: null,
      blocks: ['cards-counter'],
      defaultContent: [],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
