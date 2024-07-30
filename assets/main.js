class Main {
  constructor(body) {
    this.body = body;

    this.selector = {
      image: ".focal-image"
    }

    this.modifier = {
      loaded: "loaded"
    }

    this.data = {
      focalX: "data-focal-x",
      focalY: "data-focal-y"
    }

    this.cssVar = {
      bodyHeight: '--body-height'
    }

    this.focalImageTimeout;
  }

  init() {
    if (!this.body) return false;

    this.events();
  }

  events() {
    this.getBodyHeight();
    this.setLoadedClass();
    this.focalImages();

    window.addEventListener("resize", this.getBodyHeight.bind(this));
  }

  getBodyHeight() {
    const height = this.body.getBoundingClientRect().height

    this.setCssVar(this.cssVar.bodyHeight, height);
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
