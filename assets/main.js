class Main {
  constructor(body) {
    this.body = body;

    this.modifier = {
      loaded: "loaded"
    }

    this.cssVar = {
      bodyHeight: '--body-height'
    }
  }

  init() {
    if (!this.body) return false;

    this.events();
  }

  events() {
    this.getBodyHeight();
    this.setLoadedClass();

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
}

const main = new Main(document.querySelector('body'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") main.init();
})
