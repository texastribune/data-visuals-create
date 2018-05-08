import getMatchingAttributes from './get-matching-attributes';
import loadScript from './load-script';
import selectAll from './select-all';
import uniqueId from './unique-id';

class AdLoader {
  constructor({
    adFields = { adUnit: '/5805113/basic', dimensions: [300, 250] },
    globalMappings = {
      banner: [[[768, 130], [[728, 90]]]],
    },
    attributePrefix = 'dv-gpt-',
    gptSrc = 'https://www.googletagservices.com/tag/js/gpt.js',
    idPrefix = 'dv-gpt-',
    selector = '.dv-gpt-ad',
    targetingKey = 'tribpedia',
    targetingValue,
  } = {}) {
    this.adFields = adFields;
    this.globalMappings = globalMappings;
    this.attributePrefix = attributePrefix;
    this.gptSrc = gptSrc;
    this.idPrefix = idPrefix;
    this.selector = selector;
    this.targetingKey = targetingKey;
    this.targetingValue = targetingValue;

    this.initialized = false;
    this.slots = null;

    this.createAds = this.createAds.bind(this);
    this.onIntersection = this.onIntersection.bind(this);
    this.setupService = this.setupService.bind(this);
  }

  init() {
    if (this.initialized) return;

    this.elements = selectAll(this.selector);
    this.count = this.elements.length;

    const config = {
      rootMargin: '500px 0px',
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver(this.onIntersection, config);

    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];

    loadScript(this.gptSrc).then(() => {
      window.googletag.cmd.push(this.setupService, this.createAds);

      this.initialized = true;
    });
  }

  setupService() {
    window.googletag.cmd.push(() => {
      const pubads = window.googletag.pubads();

      if (this.targetingKey && this.targetingValue) {
        pubads.setTargeting(this.targetingKey, this.targetingValue);
      }

      pubads.disableInitialLoad();
      window.googletag.enableServices();
    });
  }

  createAds() {
    const { adUnit, dimensions } = this.adFields;
    const { banner } = this.globalMappings;

    this.elements.forEach(element => {
      const matchingAttributes = getMatchingAttributes(
        element,
        this.attributePrefix
      );

      const options = Object.assign(
        {},
        { adUnit, dimensions },
        matchingAttributes
      );

      const adElementId = uniqueId(this.idPrefix);
      element.setAttribute('id', adElementId);

      const gptAdUnit = window.googletag.defineSlot(
        options.adUnit,
        options.dimensions,
        adElementId
      );

      gptAdUnit.defineSizeMapping(banner);

      if (options.targetingKey && options.targetingValue) {
        gptAdUnit.setTargeting(options.targetingKey, options.targetingValue);
      }

      gptAdUnit.setCollapseEmptyDiv(true);
      gptAdUnit.addService(window.googletag.pubads());

      window.googletag.display(adElementId);
      element.__slot__ = gptAdUnit;

      this.observer.observe(element);
    });
  }

  onIntersection(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      this.count -= 1;
      this.observer.unobserve(element);
      window.googletag.pubads().refresh([element.__slot__]);

      if (this.count > 0) return;

      this.observer.disconnect();
    });
  }
}

export default AdLoader;
