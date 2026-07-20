const AUTOPLAY_DELAY = 8000;

function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  const count = slides.length;
  if (!count) return;
  const next = (index + count) % count;
  block.dataset.activeSlide = next;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === next);
    slide.setAttribute('aria-hidden', i !== next);
  });

  block.querySelectorAll('.carousel-hero-slide-indicator button').forEach((btn, i) => {
    if (i === next) btn.setAttribute('disabled', 'true');
    else btn.removeAttribute('disabled');
  });
}

function startAutoplay(block) {
  const advance = () => showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
  let timer = window.setInterval(advance, AUTOPLAY_DELAY);
  return () => {
    window.clearInterval(timer);
    timer = window.setInterval(advance, AUTOPLAY_DELAY);
  };
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-hero-${carouselId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.querySelectorAll(':scope > div')];

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-hero-slides';

  rows.forEach((row, idx) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const imageCol = cols[0];
    const contentCol = cols[1];

    const slide = document.createElement('li');
    slide.className = 'carousel-hero-slide';
    slide.dataset.slideIndex = idx;

    if (imageCol) {
      imageCol.classList.add('carousel-hero-slide-image');
      slide.append(imageCol);
    }

    // Each slide carries its own caption (heading, subtitle, CTA).
    if (contentCol && contentCol.textContent.trim()) {
      contentCol.classList.add('carousel-hero-caption');
      const captionWrap = document.createElement('div');
      captionWrap.className = 'carousel-hero-caption-wrap';
      captionWrap.append(contentCol);
      slide.append(captionWrap);
    }

    slidesWrapper.append(slide);
    row.remove();
  });

  const container = document.createElement('div');
  container.className = 'carousel-hero-slides-container';
  container.append(slidesWrapper);
  block.prepend(container);

  const slides = [...slidesWrapper.children];
  const isSingle = slides.length < 2;

  // Pagination dots.
  if (!isSingle) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Carousel Slide Controls');
    const indicators = document.createElement('ol');
    indicators.className = 'carousel-hero-slide-indicators';
    slides.forEach((_, idx) => {
      const li = document.createElement('li');
      li.className = 'carousel-hero-slide-indicator';
      li.dataset.targetSlide = idx;
      li.innerHTML = `<button type="button" aria-label="Show Slide ${idx + 1} of ${slides.length}"></button>`;
      indicators.append(li);
    });
    nav.append(indicators);
    container.append(nav);
  }

  showSlide(block, 0);

  if (!isSingle) {
    const reset = startAutoplay(block);
    block.querySelectorAll('.carousel-hero-slide-indicator button').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        showSlide(block, i);
        reset();
      });
    });
  }

  // Text entrance animation: fade in + upward movement once the block is ready.
  requestAnimationFrame(() => {
    block.classList.add('carousel-hero-animate-in');
  });
}
