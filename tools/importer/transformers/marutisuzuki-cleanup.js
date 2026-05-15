/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Maruti Suzuki site-wide cleanup.
 * Removes non-authorable content (header, footer, chatbot, overlays).
 * All selectors verified from captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove menu overlay that could interfere with block parsing
    // Found in captured HTML: <div class="menu__bgoverlay">
    WebImporter.DOMUtils.remove(element, ['.menu__bgoverlay']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header (navigation, logo, search)
    // Found in captured HTML: <header class="corp-header-wrapper ...">
    WebImporter.DOMUtils.remove(element, ['header.corp-header-wrapper']);

    // Remove site footer
    // Found in captured HTML: <footer class="corp-footer-wrapper">
    WebImporter.DOMUtils.remove(element, ['footer.corp-footer-wrapper']);

    // Remove chatbot widget elements (outside main content)
    // Found in captured HTML: <div id="chat-icon-nexa-script">, <div id="chat-icon">,
    // <div id="webchat-container">, <div id="webchat-header-notch">, <div id="faq-popup">
    WebImporter.DOMUtils.remove(element, [
      '#chat-icon-nexa-script',
      '#chat-icon',
      '#webchat-container',
      '#webchat-header-notch',
      '#faq-popup',
      '.blur-background',
    ]);

    // Remove utility elements
    // Found in captured HTML: <button id="copyToClipboard">Copy</button>
    WebImporter.DOMUtils.remove(element, ['#copyToClipboard']);

    // Remove empty iframes and noscript elements
    // Found in captured HTML: <iframe></iframe> after footer
    WebImporter.DOMUtils.remove(element, ['iframe', 'noscript', 'link']);
  }
}
