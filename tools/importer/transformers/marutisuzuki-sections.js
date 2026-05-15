/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Maruti Suzuki section breaks.
 * Inserts <hr> elements between sections based on template section selectors.
 * All selectors from page-templates.json, verified in migration-work/cleaned.html:
 *   - .section.corp-carousel-container (line 894)
 *   - .section.corporate-business-card-container (line 924)
 *   - .section.highlights-container (line 2288)
 *   - .section.corp-slider-container (line 2454)
 *   - .section.corp-our-values-container (line 3245)
 *   - .section.corp-counter-container (line 3300)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process sections in reverse order to avoid index shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) continue;

      // Insert Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
