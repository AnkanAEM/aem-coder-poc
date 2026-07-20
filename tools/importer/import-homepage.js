/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsStatsParser from './parsers/cards-stats.js';
import carouselBusinessParser from './parsers/carousel-business.js';
import cardsNewsParser from './parsers/cards-news.js';
import foundationParser from './parsers/foundation.js';
import videoBgParser from './parsers/video-bg.js';
import sustainabilityParser from './parsers/sustainability.js';
import disclaimerModalParser from './parsers/disclaimer-modal.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/jsw-cleanup.js';
import sectionsTransformer from './transformers/jsw-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'JSW Group corporate homepage with hero banner carousel, group overview with stats, business divisions carousel, sustainability, latest news, foundation, sports, and careers sections',
  urls: [
    'https://www.jsw.in/',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['section.home_banner_wrp .home_bnr_sldr', 'section.home_banner_wrp'],
    },
    {
      name: 'cards-stats',
      instances: ['section.home_overview .overview_numb_wrp'],
    },
    {
      name: 'carousel-business',
      instances: ['section.home_buss_main .home_buss_sldr', 'section.home_buss_main'],
    },
    {
      name: 'cards-news',
      instances: ['section.latest_news_wrp .lates_container'],
    },
    {
      name: 'foundation',
      instances: ['section.home_foundation_wrp'],
    },
    {
      name: 'video-bg',
      instances: ['section.jsw_sports_wrp'],
    },
    {
      name: 'sustainability',
      instances: ['section.home_sustainability_wrp'],
    },
    {
      name: 'disclaimer-modal',
      instances: ['#careerModal'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Hero banner carousel', selector: 'section.home_banner_wrp', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'section-2', name: 'Group overview', selector: 'section.home_overview', style: 'light', blocks: ['cards-stats'], defaultContent: ['section.home_overview .cntr_text', 'section.home_overview > .container_1360_wrp > a.common_cta'] },
    { id: 'section-3', name: 'Business divisions carousel', selector: 'section.home_buss_main', style: null, blocks: ['carousel-business'], defaultContent: [] },
    { id: 'section-4', name: 'Sustainability', selector: 'section.home_sustainability_wrp', style: null, blocks: ['sustainability'], defaultContent: [] },
    { id: 'section-5', name: 'Latest News', selector: 'section.latest_news_wrp', style: 'light', blocks: ['cards-news'], defaultContent: ['section.latest_news_wrp h2.common_ttle', 'section.latest_news_wrp a.common_cta'] },
    { id: 'section-6', name: 'Foundation', selector: 'section.home_foundation_wrp', style: 'light', blocks: ['foundation'], defaultContent: [] },
    { id: 'section-7', name: 'Sports', selector: 'section.jsw_sports_wrp', style: null, blocks: ['video-bg'], defaultContent: [] },
    { id: 'section-8', name: 'Careers', selector: 'section.home_career_wrp', style: 'careers-teaser', blocks: [], defaultContent: ['section.home_career_wrp .container_1360_wrp'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-stats': cardsStatsParser,
  'carousel-business': carouselBusinessParser,
  'cards-news': cardsNewsParser,
  foundation: foundationParser,
  'video-bg': videoBgParser,
  sustainability: sustainabilityParser,
  'disclaimer-modal': disclaimerModalParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    // Try each selector in order; use the first that matches to avoid double-mapping the same block
    let matched = false;
    blockDef.instances.forEach((selector) => {
      if (matched) return;
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) return;
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
      matched = true;
    });
    if (!matched) {
      console.warn(`Block "${blockDef.name}" not found for any selector: ${blockDef.instances.join(', ')}`);
    }
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
