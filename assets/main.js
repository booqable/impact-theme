class Main {
  constructor(body) {
    this.body = body;

    this.selector = {
      image: ".focal-image",
      excerpt: ".product-card__description"
    }

    this.modifier = {
      loaded: "loaded",
      truncated: "truncated"
    }

    this.data = {
      focalX: "data-focal-x",
      focalY: "data-focal-y"
    }

    this.cssVar = {
      bodyHeight: '--body-height'
    }

    this.cssProp = {
      maxHeight: 'max-height',
      paddingTop: 'padding-top',
      paddingBottom: 'padding-bottom'
    }

    this.focalImageTimeout;
  }

  init() {
    if (!this.body) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.excerpts = document.querySelectorAll(this.selector.excerpt);
  }

  events() {
    this.getBodyHeight();
    this.setLoadedClass();
    this.focalImages();
    this.setTruncationClass();

    window.addEventListener("resize", this.getBodyHeight.bind(this));
    window.addEventListener("resize", this.setTruncationClass.bind(this));
  }

  getBodyHeight() {
    const height = this.body.getBoundingClientRect().height

    this.setCssVar(this.cssVar.bodyHeight, height);
  }

  // set class for truncation product card description
  setTruncationClass() {
    if (!this.excerpts.length) return false;

    const styles = window.getComputedStyle(this.excerpts[0]),
          paddingTop = parseInt(styles.getPropertyValue(this.cssProp.paddingTop)),
          paddingBottom = parseInt(styles.getPropertyValue(this.cssProp.paddingBottom)),
          maxHeight = parseInt(styles.getPropertyValue(this.cssProp.maxHeight)),
          minHeight = maxHeight / 2 + paddingBottom + paddingTop;

    this.excerpts.forEach(excerpt => {
      const height = excerpt.getBoundingClientRect().height

      height > minHeight
        ? excerpt.classList.add(this.modifier.truncated)
        : excerpt.classList.remove(this.modifier.truncated)
    })
  }

  setCssVar(key, val) {
    document.documentElement.style.setProperty(
      `${key}`,
      `${val}px`
    )
  }

  // adding class after loading content
  setLoadedClass() {
    this.body.classList.add(this.modifier.loaded);
  }

  // change focus positioning of image
  focalImages() {
    if (!window.imageFocus) {
      if (this.focalImageTimeout) clearTimeout(this.focalImageTimeout);

      this.focalImageTimeout = setTimeout(() => initFocalImages(), 10);

      return;
    }

    clearTimeout(this.focalImageTimeout);

    const images = document.querySelectorAll(this.selector.image);

    images.forEach(image => {
      const x = image.getAttribute(this.data.focalX),
            y = image.getAttribute(this.data.focalY);

      new window.imageFocus(image, {
        focus: {
          x: parseFloat(x) || 0,
          y: parseFloat(y) || 0,
        }
      });

      image.style.opacity = 1;
    })
  }
}

const main = new Main(document.querySelector('body'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") main.init();
})
