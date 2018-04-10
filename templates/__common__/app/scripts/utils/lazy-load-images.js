import selectAll from './select-all';

const supportsSrcset = 'srcset' in document.createElement('img');

class LazyLoadImages {
  constructor({ margin = 350, selector = 'img.lazyload' } = {}) {
    this.margin = margin;
    this.selector = selector;

    this.onIntersection = this.onIntersection.bind(this);
  }

  init() {
    this.elements = selectAll(this.selector);
    this.count = this.elements.length;

    const config = {
      rootMargin: `${this.margin}px`,
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver(this.onIntersection, config);
    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }

  onIntersection(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      this.count -= 1;
      this.observer.unobserve(entry.target);
      this.loadImage(entry.target);

      if (this.count > 0) return;

      this.observer.disconnect();
    });
  }

  loadImage(element) {
    element.classList.add('lazyload--loaded');

    const src = element.getAttribute('data-src');
    const srcset = element.getAttribute('data-srcset');

    if (srcset && supportsSrcset) {
      element.setAttribute('srcset', srcset);
    } else {
      element.setAttribute('src', src);
    }

    element.onload = () => element.classList.add('loaded');
  }
}

export default LazyLoadImages;
