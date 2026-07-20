const SESSION_KEY = 'jsw-disclaimer-seen';

/**
 * Disclaimer modal.
 * Authored as a normal block (logo + heading + body copy). On load it is moved
 * into a full-screen dialog overlay and shown once per browser session, gated
 * by a sessionStorage flag (matches jsw.in's first-load disclaimer behaviour).
 */
export default function decorate(block) {
  // Already shown this session -> remove the block entirely.
  let seen = false;
  try {
    seen = sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {
    seen = false;
  }
  if (seen) {
    block.closest('.section')?.remove();
    return;
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'disclaimer-modal-dialog';

  const inner = document.createElement('div');
  inner.className = 'disclaimer-modal-inner';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'disclaimer-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';

  // move authored content into the dialog
  while (block.firstElementChild) inner.append(block.firstElementChild);

  dialog.append(closeBtn, inner);
  block.append(dialog);

  const close = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch (e) {
      // ignore storage errors
    }
    if (dialog.open) dialog.close();
  };

  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    // click on the backdrop (the dialog element itself) closes it
    if (e.target === dialog) close();
  });
  dialog.addEventListener('close', close);

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}
