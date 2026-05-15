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

  // tools/importer/parsers/carousel-banner.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".mySlides");
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector("a[href]");
      const image = slide.querySelector("img.generic-desktop") || slide.querySelector("img");
      if (image && link) {
        const imgSrc = image.getAttribute("src") || image.getAttribute("srcset") || "";
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = image.getAttribute("alt") || "";
        const anchor = document.createElement("a");
        anchor.href = link.getAttribute("href") || link.href;
        anchor.appendChild(img);
        cells.push([anchor]);
      } else if (image) {
        const imgSrc = image.getAttribute("src") || image.getAttribute("srcset") || "";
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = image.getAttribute("alt") || "";
        cells.push([img]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-channel.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll(".business-card-item");
    const cells = [];
    cardItems.forEach((card) => {
      const posterImg = card.querySelector(".business-card-item-assets .vjs-poster img");
      const assetImg = posterImg || card.querySelector(".business-card-item-assets img");
      const logoImg = card.querySelector(".business-card-item-logo img");
      const heading = card.querySelector(".business-card-item-title h3, .business-card-item-title h2, .business-card-item-title h1");
      const subtitle = card.querySelector("p.business-card-item-subtitle, .business-card-item-desc p");
      const ctaLink = card.querySelector(".business-card-item-desc a, .business-card-item-info a");
      const imageCell = [];
      if (assetImg) {
        imageCell.push(assetImg);
      }
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
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-channel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-highlight.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".highlight__card");
    const cells = [];
    cards.forEach((card) => {
      const titleEl = card.querySelector(".btm-title .h-title, h4.h-title");
      const descEl = card.querySelector(".highlight__bottom__description p");
      const linkEl = card.querySelector("a.bottom-section");
      const cellContent = [];
      if (titleEl) {
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        cellContent.push(strong);
      }
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        cellContent.push(p);
      }
      if (linkEl) {
        const a = document.createElement("a");
        a.href = linkEl.href;
        a.textContent = titleEl ? titleEl.textContent.trim() : "Learn More";
        cellContent.push(a);
      }
      if (cellContent.length > 0) {
        cells.push([cellContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-highlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse4(element, { document }) {
    const heading = element.querySelector(".gallery-header h2, .range-component > .row h2");
    const sliderTitles = Array.from(element.querySelectorAll(".slider-title h3"));
    const carousels = Array.from(element.querySelectorAll(".carousel.slide.splide"));
    const cells = [];
    if (heading) {
      cells.push([heading]);
    }
    sliderTitles.forEach((categoryTitle, index) => {
      cells.push([categoryTitle]);
      const carousel = carousels[index];
      if (!carousel) return;
      const slides = Array.from(
        carousel.querySelectorAll("li.splide__slide:not(.splide__slide--clone)")
      );
      const seenHrefs = /* @__PURE__ */ new Set();
      slides.forEach((slide) => {
        const img = slide.querySelector("img.img-fluid");
        const nameEl = slide.querySelector("h6.img-title");
        const link = slide.querySelector("a.image-area");
        if (link && seenHrefs.has(link.href)) return;
        if (link) seenHrefs.add(link.href);
        if (img && nameEl) {
          const imageCell = document.createElement("div");
          if (link) {
            const anchor = document.createElement("a");
            anchor.href = link.href;
            const imgClone = img.cloneNode(true);
            anchor.appendChild(imgClone);
            imageCell.appendChild(anchor);
          } else {
            imageCell.appendChild(img.cloneNode(true));
          }
          const nameCell = document.createElement("div");
          if (link) {
            const nameAnchor = document.createElement("a");
            nameAnchor.href = link.href;
            nameAnchor.textContent = nameEl.textContent.trim();
            nameCell.appendChild(nameAnchor);
          } else {
            nameCell.textContent = nameEl.textContent.trim();
          }
          cells.push([imageCell, nameCell]);
        }
      });
    });
    if (sliderTitles.length === 0) {
      const allSlides = Array.from(
        element.querySelectorAll("li.splide__slide:not(.splide__slide--clone)")
      );
      allSlides.forEach((slide) => {
        const img = slide.querySelector("img.img-fluid");
        const nameEl = slide.querySelector("h6.img-title");
        const link = slide.querySelector("a.image-area");
        if (img && nameEl) {
          const imageCell = document.createElement("div");
          if (link) {
            const anchor = document.createElement("a");
            anchor.href = link.href;
            anchor.appendChild(img.cloneNode(true));
            imageCell.appendChild(anchor);
          } else {
            imageCell.appendChild(img.cloneNode(true));
          }
          const nameCell = document.createElement("div");
          if (link) {
            const nameAnchor = document.createElement("a");
            nameAnchor.href = link.href;
            nameAnchor.textContent = nameEl.textContent.trim();
            nameCell.appendChild(nameAnchor);
          } else {
            nameCell.textContent = nameEl.textContent.trim();
          }
          cells.push([imageCell, nameCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-values.js
  function parse5(element, { document }) {
    const valueItems = element.querySelectorAll("li.sub-holder");
    const cells = [];
    valueItems.forEach((item) => {
      const img = item.querySelector("img");
      if (img) {
        const valueName = img.getAttribute("alt") || "";
        const nameEl = document.createElement("p");
        nameEl.textContent = valueName.charAt(0).toUpperCase() + valueName.slice(1);
        cells.push([img, nameEl]);
      }
    });
    const ctaLinks = Array.from(element.querySelectorAll(".button-holder a.button, .button-holder a.btns"));
    if (ctaLinks.length > 0) {
      const uniqueLinks = [...new Set(ctaLinks)];
      cells.push(uniqueLinks);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-values", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-counter.js
  function parse6(element, { document }) {
    const counterSpan = element.querySelector(".numscroller span");
    const counterNumber = counterSpan ? counterSpan.textContent.trim() : "";
    const formattedNumber = counterNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const countLabels = element.querySelectorAll(".count-label");
    let labelText = "";
    for (const label of countLabels) {
      const text = label.textContent.trim();
      if (text) {
        labelText = text;
        break;
      }
    }
    const ctaLinks = Array.from(element.querySelectorAll(".button-gutter a.button, .button-gutter a"));
    const container = document.createElement("div");
    if (formattedNumber || labelText) {
      const p = document.createElement("p");
      if (formattedNumber) {
        const strong = document.createElement("strong");
        strong.textContent = formattedNumber;
        p.appendChild(strong);
      }
      if (labelText) {
        const normalizedLabel = labelText.charAt(0).toUpperCase() + labelText.slice(1).toLowerCase();
        p.appendChild(document.createTextNode(" " + normalizedLabel));
      }
      container.appendChild(p);
    }
    ctaLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      container.appendChild(p);
    });
    const cells = [[container]];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-counter", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/marutisuzuki-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".menu__bgoverlay"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.corp-header-wrapper"]);
      WebImporter.DOMUtils.remove(element, ["footer.corp-footer-wrapper"]);
      WebImporter.DOMUtils.remove(element, [
        "#chat-icon-nexa-script",
        "#chat-icon",
        "#webchat-container",
        "#webchat-header-notch",
        "#faq-popup",
        ".blur-background"
      ]);
      WebImporter.DOMUtils.remove(element, ["#copyToClipboard"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "noscript", "link"]);
    }
  }

  // tools/importer/transformers/marutisuzuki-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-banner": parse,
    "cards-channel": parse2,
    "cards-highlight": parse3,
    "carousel-product": parse4,
    "cards-values": parse5,
    "cards-counter": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Maruti Suzuki homepage with hero banner, vehicle showcases, offers, and brand content",
    urls: ["https://www.marutisuzuki.com/"],
    blocks: [
      {
        name: "carousel-banner",
        instances: [".corp-carousel.block"]
      },
      {
        name: "cards-channel",
        instances: [".corporate-business-card.block"]
      },
      {
        name: "cards-highlight",
        instances: [".highlights.block"]
      },
      {
        name: "carousel-product",
        instances: [".corp-slider.block"]
      },
      {
        name: "cards-values",
        instances: [".corp-our-values.block"]
      },
      {
        name: "cards-counter",
        instances: [".corp-counter.block"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".section.corp-carousel-container",
        style: null,
        blocks: ["carousel-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Business Channels",
        selector: ".section.corporate-business-card-container",
        style: null,
        blocks: ["cards-channel"],
        defaultContent: [".corporate-business-card .business-card-title", ".corporate-business-card .business-card-title-hr"]
      },
      {
        id: "section-3",
        name: "Highlights",
        selector: ".section.highlights-container",
        style: null,
        blocks: ["cards-highlight"],
        defaultContent: [".highlights-container .default-content-wrapper h2"]
      },
      {
        id: "section-4",
        name: "Car Catalog",
        selector: ".section.corp-slider-container",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Our Values",
        selector: ".section.corp-our-values-container",
        style: null,
        blocks: ["cards-values"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Customer Counter",
        selector: ".section.corp-counter-container",
        style: null,
        blocks: ["cards-counter"],
        defaultContent: []
      }
    ]
  };
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
