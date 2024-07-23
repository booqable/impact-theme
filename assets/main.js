class Main {
  constructor(body) {
    this.body = body;

    this.selector = {
      image: ".focal-image",
      productDescription: ".product-card__description"
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

    this.elements();
    this.events();
  }

  elements() {
    this.productDescriptions = document.querySelectorAll(this.selector.productDescription);
  }

  events() {
    this.getBodyHeight();
    this.setLoadedClass();
    this.focalImages();
    this.truncateDescription();

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

  // truncate product description
  truncateDescription() {
    if (!this.productDescriptions.length) return false;

    this.productDescriptions.forEach(description => this.truncateText(description, 125))
  }

  truncateText(element, maxLength) {
    const text = element.innerHTML;
    const truncatedText = this.truncateString(text, maxLength);
    element.innerHTML = truncatedText;
  }

  truncateString(str, num) {
    let totalLength = 0,
        result = "";

    for (let i = 0; i < str.length; i++) {
      if (totalLength >= num) {
        result += " ...";
        break;
      }

      const char = str[i];

      if (char === "<") {
        const endTagIndex = str.indexOf(">", i);

        if (endTagIndex !== -1) {
          const tag = str.substring(i, endTagIndex + 1);
          result += tag;
          i = endTagIndex;
        }
      } else {
        result += char;
        totalLength++;
      }
    }

    return result;
  }
}

const main = new Main(document.querySelector('body'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") main.init();
})
