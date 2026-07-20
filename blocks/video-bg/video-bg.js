/*
 * Video Background Block
 * Full-bleed background video (mp4) with an overlay caption.
 *
 * Authored structure (single cell):
 *   <p><a href="...mp4">...mp4</a></p>   -> background video source
 *   <p><picture>logo</picture></p>       -> caption logo
 *   <h2>heading</h2>
 *   <p>description</p>
 *   <p><a>CTA</a></p>                     -> button
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function isVideoLink(href) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(href);
}

function buildBackgroundVideo(src) {
  const video = document.createElement('video');
  video.className = 'video-bg-media';
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.muted = true;
  video.setAttribute('preload', 'auto');

  const source = document.createElement('source');
  source.setAttribute('src', src);
  source.setAttribute('type', `video/${src.split('.').pop().split('?')[0]}`);
  video.append(source);
  return video;
}

export default async function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;

  // Locate the video link (first anchor pointing at a video file).
  const anchors = [...cell.querySelectorAll('a')];
  const videoAnchor = anchors.find((a) => isVideoLink(a.getAttribute('href') || a.href));
  const videoSrc = videoAnchor ? (videoAnchor.getAttribute('href') || videoAnchor.href) : null;

  // Remove the paragraph that only holds the raw video link.
  if (videoAnchor) {
    const p = videoAnchor.closest('p') || videoAnchor;
    p.remove();
  }

  // Wrap the remaining authored content as the overlay caption.
  const caption = document.createElement('div');
  caption.className = 'video-bg-caption';
  while (cell.firstChild) {
    caption.append(cell.firstChild);
  }

  // The picture in the caption is the brand logo, not a video poster.
  const logo = caption.querySelector('picture');
  if (logo) {
    const logoWrap = logo.closest('p') || logo;
    logoWrap.classList.add('video-bg-logo');
  }

  // Style the remaining CTA link as a button (source renders it as a pill).
  const ctaLinks = [...caption.querySelectorAll('a')];
  const cta = ctaLinks[ctaLinks.length - 1];
  if (cta && !cta.classList.contains('button')) {
    cta.classList.add('button');
    const ctaWrap = cta.closest('p');
    if (ctaWrap) ctaWrap.classList.add('button-container');
  }

  cell.append(caption);

  // Build and lazily load the background video.
  if (videoSrc) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const video = buildBackgroundVideo(videoSrc);
        block.prepend(video);
        video.addEventListener('canplay', () => {
          video.muted = true;
          if (!prefersReducedMotion.matches) {
            const playPromise = video.play();
            if (playPromise) playPromise.catch(() => {});
          }
        });
      }
    });
    observer.observe(block);
  }
}
