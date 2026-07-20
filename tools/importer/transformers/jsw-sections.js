/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: jsw.in section breaks + section metadata.
 *
 * Runs in beforeTransform. Reads section definitions from
 * payload.template.sections (page-templates.json) and, for the homepage
 * template (8 sections):
 *   - inserts an <hr> before every section except the first (7 breaks)
 *   - inserts a "Section Metadata" block after each section that has a style
 *     (light / sustainability-bg -> 5 blocks)
 *
 * IMPORTANT: this must run in beforeTransform (before the block parsers run).
 * Some block parsers (e.g. video-bg) replace their entire source section
 * element with the generated block; if section breaks were inserted afterwards,
 * querySelector(section.selector) would no longer match and the break would be
 * lost, merging that section into the previous one. Running here - while the
 * original section elements are still in the DOM - guarantees every break lands.
 * The inserted <hr>/metadata become stable siblings that survive later parsing.
 *
 * Section selectors verified against migration-work/cleaned.html:
 *   section.home_banner_wrp, section.home_overview, section.home_buss_main,
 *   section.home_sustainability_wrp, section.latest_news_wrp,
 *   section.home_foundation_wrp, section.jsw_sports_wrp, section.home_career_wrp
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length <= 1) return;

    const doc = element.ownerDocument;

    // Process in reverse so inserted nodes don't shift the positions of
    // sections we haven't handled yet.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block after the section, when a style is defined.
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metadataBlock);
      }

      // Section break before every section except the first.
      if (i > 0) {
        sectionEl.before(doc.createElement('hr'));
      }
    }
  }
}
