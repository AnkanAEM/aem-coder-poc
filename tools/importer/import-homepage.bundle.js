/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  var SLIDE_CAPTIONS = [
    {
      match: "home_carousel1",
      title: ["Living Better", "Doing Better"],
      subtitle: "Embodies our commitment to driving, fostering innovation and improving lives while protecting the environment for future generations.",
      ctaText: "Our Purpose",
      ctaHref: "https://www.jsw.in/our-promise/"
    },
    {
      match: "home_carousel2",
      title: ["Doing Better", "Shaping Futures"],
      subtitle: "At JSW Foundation, our dedication is focused on propelling positive transformations.",
      ctaText: "Our Commitment",
      ctaHref: "https://www.jsw.in/foundation/"
    },
    {
      match: "home_carousel3",
      title: ["Doing Better", "for People"],
      subtitle: "Through sustainability practices and innovation, we aim to create lasting value for future generations while fostering growth today.",
      ctaText: "OUR ROLE IN NET ZERO",
      ctaHref: "https://www.jsw.in/sustainability/"
    },
    {
      match: "home_carousel4",
      title: ["Doing Better", "for Growth"],
      subtitle: "We are expanding our capabilities and scale, reinforcing our commitment to world-class solutions, sustainability, and innovations.",
      ctaText: "Our role in creating value",
      ctaHref: "https://www.jsw.in/investors/"
    }
  ];
  function captionForImage(src) {
    if (!src) return null;
    return SLIDE_CAPTIONS.find((c) => src.includes(c.match)) || null;
  }
  function parse(element, { document }) {
    let slides = Array.from(
      element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".swiper-slide"));
    }
    const cells = [];
    slides.forEach((slide, idx) => {
      const img = slide.querySelector("img");
      const imageCell = img || "";
      const src = img ? img.getAttribute("src") || img.getAttribute("srcset") || "" : "";
      const cap = captionForImage(src) || SLIDE_CAPTIONS[idx] || null;
      const contentCell = [];
      if (cap) {
        const h = document.createElement("h2");
        cap.title.forEach((line, i) => {
          if (i > 0) h.appendChild(document.createElement("br"));
          h.appendChild(document.createTextNode(line));
        });
        contentCell.push(h);
        const p = document.createElement("p");
        p.textContent = cap.subtitle;
        contentCell.push(p);
        const a = document.createElement("a");
        a.href = cap.ctaHref;
        a.textContent = cap.ctaText;
        contentCell.push(a);
      }
      cells.push([imageCell, contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse2(element, { document }) {
    let cards = Array.from(element.querySelectorAll(":scope > .infonumb_card"));
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(":scope > div"));
    }
    const cells = [];
    cards.forEach((card) => {
      const heading = card.querySelector("h1, h2, h3, h4");
      const description = card.querySelector("p");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (!contentCell.length) return;
      cells.push([contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-stats",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-business.js
  var BANNER_URLS = [
    "https://www.jsw.in/wp-content/uploads/2025/09/bus_bnr159.webp",
    "https://www.jsw.in/wp-content/uploads/2025/09/bus_bnr159-2.webp",
    "https://www.jsw.in/wp-content/uploads/2025/09/pro_bnr3-159.jpg",
    "https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr4.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr5.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr6.webp",
    "https://www.jsw.in/wp-content/uploads/2025/05/pro_bnr7.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr8.webp",
    "https://jswin.s3.ap-south-1.amazonaws.com/production/uploads/2026/05/contact-address-bg.webp",
    "https://www.jsw.in/wp-content/uploads/2025/09/pro_bnr9-2.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/pro_bnr10.webp",
    "https://www.jsw.in/wp-content/uploads/2025/08/Banner-Sample-2-1.png",
    "https://jswin.s3.ap-south-1.amazonaws.com/production/uploads/2026/06/greentech-banner-1-1-1.webp"
  ];
  function parse3(element, { document }) {
    let slides = Array.from(
      element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".swiper-slide"));
    }
    const cells = [];
    slides.forEach((slide, slideIdx) => {
      let bgImage = slide.querySelector(":scope > img");
      const bannerUrl = BANNER_URLS[slideIdx];
      const existingSrc = bgImage && bgImage.getAttribute("src");
      if (bannerUrl && (!bgImage || !existingSrc || existingSrc.startsWith("data:"))) {
        bgImage = document.createElement("img");
        bgImage.src = bannerUrl;
        bgImage.setAttribute("alt", "");
      }
      const lhs = slide.querySelector(".buss_lhs") || slide.querySelector(":scope > .container_1360_wrp");
      const contentCell = [];
      if (lhs) {
        const logo = lhs.querySelector(".logo_buss, picture");
        const heading = lhs.querySelector('h1, h2, h3, .ttle, [class*="ttle"]');
        const description = lhs.querySelector('p, .desc, [class*="desc"]');
        const stats = lhs.querySelector(".info_numb_main");
        const cta = lhs.querySelector('a.common_cta, a[class*="cta"], a');
        if (logo) contentCell.push(logo);
        if (heading) contentCell.push(heading);
        if (description) contentCell.push(description);
        if (stats && stats.querySelector(".info_numb_card")) contentCell.push(stats);
        if (cta) contentCell.push(cta);
      }
      if (!bgImage && !contentCell.length) return;
      cells.push([bgImage || "", contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-business",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const card = element.querySelector(".latest_card") || element;
    const cells = [];
    const featured = card.querySelector(".lates_lhs");
    if (featured) {
      cells.push([featured]);
    }
    const secondary = Array.from(
      card.querySelectorAll(".lates_rhs .cvr")
    );
    secondary.forEach((item) => {
      cells.push([item]);
    });
    const exploreAll = card.querySelector("a.common_cta") || element.querySelector("a.common_cta");
    if (exploreAll) {
      cells.push([exploreAll]);
    }
    if (!cells.length) {
      const fallbackItems = Array.from(
        card.querySelectorAll(":scope > a, :scope > div")
      ).filter((el) => !el.classList.contains("common_cta"));
      fallbackItems.forEach((el) => cells.push([el]));
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-news",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/foundation.js
  var FOCUS_BG_URLS = [
    "https://www.jsw.in/wp-content/uploads/2025/05/found9.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found1.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found2.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found3.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found4.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found5.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found6.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found7.webp",
    "https://www.jsw.in/wp-content/uploads/2025/03/found8.webp"
  ];
  function parse5(element, { document }) {
    const cells = [];
    const lhs = element.querySelector(".foundation_lhs") || element;
    const intro = [];
    const logo = lhs.querySelector("picture, img");
    if (logo) {
      const p = document.createElement("p");
      p.append(logo);
      intro.push(p);
    }
    const heading = lhs.querySelector("h2.common_ttle, h1, h2");
    if (heading) intro.push(heading);
    const desc = lhs.querySelector("p.desc, p");
    if (desc) intro.push(desc);
    lhs.querySelectorAll(".found_card").forEach((card) => {
      const statHeading = card.querySelector("h2");
      const statLabel = card.querySelector("p");
      if (statHeading) {
        const h = document.createElement("h3");
        h.textContent = statHeading.textContent.trim().replace(/\s+/g, " ");
        intro.push(h);
      }
      if (statLabel) {
        const p = document.createElement("p");
        p.textContent = statLabel.textContent.trim();
        intro.push(p);
      }
    });
    const cta = lhs.querySelector('a.common_cta, a[class*="cta"], a');
    if (cta) {
      const p = document.createElement("p");
      p.append(cta);
      intro.push(p);
    }
    cells.push([intro]);
    let slides = Array.from(
      element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".swiper-slide"));
    }
    slides.forEach((slide, slideIdx) => {
      let bgImage = slide.querySelector(":scope > img");
      const bgUrl = FOCUS_BG_URLS[slideIdx];
      const existingSrc = bgImage && bgImage.getAttribute("src");
      if (bgUrl && (!bgImage || !existingSrc || existingSrc.startsWith("data:"))) {
        bgImage = document.createElement("img");
        bgImage.src = bgUrl;
        bgImage.setAttribute("alt", "");
      }
      const pop = slide.querySelector(".foundation_pop");
      const slideCell = [];
      if (bgImage) {
        const p = document.createElement("p");
        p.append(bgImage);
        slideCell.push(p);
      }
      if (pop) {
        const slideHeading = pop.querySelector("h1, h2, h3, h4");
        const slideDesc = pop.querySelector("p");
        if (slideHeading) slideCell.push(slideHeading);
        if (slideDesc) slideCell.push(slideDesc);
      }
      if (!slideCell.length) return;
      cells.push([slideCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "foundation",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-bg.js
  function parse6(element, { document }) {
    const source = element.querySelector("video source[src], video[src], a[href]");
    let videoUrl = "";
    if (source) {
      videoUrl = source.getAttribute("src") || source.getAttribute("href") || "";
    }
    const poster = element.querySelector(".caption_wrp picture, picture");
    const caption = element.querySelector(".caption_wrp");
    const heading = caption ? caption.querySelector('h1, h2, h3, .common_ttle, [class*="ttle"]') : null;
    const description = caption ? caption.querySelector('p, .desc, [class*="desc"]') : null;
    const cta = caption ? caption.querySelector('a.common_cta, a[class*="cta"], a') : null;
    if (!videoUrl && !heading && !description) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.textContent = videoUrl;
      contentCell.push(link);
    }
    if (poster) contentCell.push(poster);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "video-bg",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/sustainability.js
  function parse7(element, { document }) {
    const cell = [];
    const picture = element.querySelector("picture");
    const img = element.querySelector("img");
    if (picture) {
      const p = document.createElement("p");
      p.append(picture);
      cell.push(p);
    } else if (img) {
      const p = document.createElement("p");
      p.append(img);
      cell.push(p);
    }
    const container = element.querySelector(".container_1360_wrp") || element;
    const eyebrow = container.querySelector('.small_ttle, .sub_ttle, [class*="sub"], .eyebrow');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      cell.push(p);
    }
    const heading = container.querySelector("h1, h2, h3, h4");
    if (heading) cell.push(heading);
    const desc = container.querySelector("p");
    if (desc) cell.push(desc);
    const cta = container.querySelector('a.common_cta, a[class*="cta"], a');
    if (cta) cell.push(cta);
    if (!cell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "sustainability",
      cells: [[cell]]
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/disclaimer-modal.js
  function parse8(element, { document }) {
    const scroll = element.querySelector(".scroll-content");
    const heading = element.querySelector("h1, h2, h3, h4");
    const logo = element.querySelector("img");
    const cell = [];
    if (logo) {
      const p = document.createElement("p");
      p.append(logo);
      cell.push(p);
    }
    if (heading) cell.push(heading);
    if (scroll) {
      scroll.querySelectorAll("p").forEach((p) => cell.push(p));
    }
    if (!cell.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "disclaimer-modal",
      cells: [[cell]]
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/jsw-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".modal-backdrop"]);
      WebImporter.DOMUtils.remove(element, [".overlay-search-main"]);
      element.querySelectorAll(".swiper-slide-duplicate").forEach((slide) => {
        if (slide.classList.contains("swiper-slide")) slide.remove();
      });
      const swiperStateClasses = [
        "swiper-initialized",
        "swiper-horizontal",
        "swiper-vertical",
        "swiper-pointer-events",
        "swiper-backface-hidden",
        "swiper-fade",
        "swiper-slide-active",
        "swiper-slide-prev",
        "swiper-slide-next",
        "swiper-slide-visible",
        "swiper-slide-duplicate-active",
        "swiper-slide-duplicate-prev",
        "swiper-slide-duplicate-next",
        "swiper-pagination-clickable",
        "swiper-pagination-bullets",
        "swiper-pagination-horizontal",
        "swiper-pagination-bullet-active"
      ];
      element.querySelectorAll('[class*="swiper"]').forEach((el) => {
        swiperStateClasses.forEach((cls) => el.classList.remove(cls));
      });
      const scrollLocked = element.querySelectorAll('[style*="overflow: hidden"], [style*="overflow:hidden"]');
      scrollLocked.forEach((el) => {
        el.style.overflow = "";
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "section.header_full_wrp#header",
        "section.footer_wrp#footer"
      ]);
      WebImporter.DOMUtils.remove(element, ["#careerModal"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "iframe", "link", "style"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("aria-hidden");
        el.removeAttribute("tabindex");
      });
    }
  }

  // tools/importer/transformers/jsw-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length <= 1) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metadataBlock);
        }
        if (i > 0) {
          sectionEl.before(doc.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "JSW Group corporate homepage with hero banner carousel, group overview with stats, business divisions carousel, sustainability, latest news, foundation, sports, and careers sections",
    urls: [
      "https://www.jsw.in/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: ["section.home_banner_wrp .home_bnr_sldr", "section.home_banner_wrp"]
      },
      {
        name: "cards-stats",
        instances: ["section.home_overview .overview_numb_wrp"]
      },
      {
        name: "carousel-business",
        instances: ["section.home_buss_main .home_buss_sldr", "section.home_buss_main"]
      },
      {
        name: "cards-news",
        instances: ["section.latest_news_wrp .lates_container"]
      },
      {
        name: "foundation",
        instances: ["section.home_foundation_wrp"]
      },
      {
        name: "video-bg",
        instances: ["section.jsw_sports_wrp"]
      },
      {
        name: "sustainability",
        instances: ["section.home_sustainability_wrp"]
      },
      {
        name: "disclaimer-modal",
        instances: ["#careerModal"]
      }
    ],
    sections: [
      { id: "section-1", name: "Hero banner carousel", selector: "section.home_banner_wrp", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "section-2", name: "Group overview", selector: "section.home_overview", style: "light", blocks: ["cards-stats"], defaultContent: ["section.home_overview .cntr_text", "section.home_overview > .container_1360_wrp > a.common_cta"] },
      { id: "section-3", name: "Business divisions carousel", selector: "section.home_buss_main", style: null, blocks: ["carousel-business"], defaultContent: [] },
      { id: "section-4", name: "Sustainability", selector: "section.home_sustainability_wrp", style: null, blocks: ["sustainability"], defaultContent: [] },
      { id: "section-5", name: "Latest News", selector: "section.latest_news_wrp", style: "light", blocks: ["cards-news"], defaultContent: ["section.latest_news_wrp h2.common_ttle", "section.latest_news_wrp a.common_cta"] },
      { id: "section-6", name: "Foundation", selector: "section.home_foundation_wrp", style: "light", blocks: ["foundation"], defaultContent: [] },
      { id: "section-7", name: "Sports", selector: "section.jsw_sports_wrp", style: null, blocks: ["video-bg"], defaultContent: [] },
      { id: "section-8", name: "Careers", selector: "section.home_career_wrp", style: "careers-teaser", blocks: [], defaultContent: ["section.home_career_wrp .container_1360_wrp"] }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-stats": parse2,
    "carousel-business": parse3,
    "cards-news": parse4,
    foundation: parse5,
    "video-bg": parse6,
    sustainability: parse7,
    "disclaimer-modal": parse8
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
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
            section: blockDef.section || null
          });
        });
        matched = true;
      });
      if (!matched) {
        console.warn(`Block "${blockDef.name}" not found for any selector: ${blockDef.instances.join(", ")}`);
      }
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
