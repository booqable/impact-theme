class Header {
  constructor(header) {
    this.header = header;

    this.selector = {
      body: "body",
      bar: ".top-bar",
      view: ".preview-bar__container",
      inner: ".header__inner"
    }

    this.classes = {
      sticky: "header-sticky"
    }

    this.modifier = {
      scrollDown: "scrolled-down",
      scrolled: "page-scrolled"
    }

    this.cssVar = {
      height: '--header-height',
      barHeight: '--top-bar-height',
      viewHeight: '--preview-height',
      transform: '--header-transform'
    }

    this.minHeight = 120;
    this.last = 0;
  }

  init() {
    if (!this.header) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
    this.body = document.querySelector(this.selector.body);
    this.preview = document.querySelector(this.selector.view);
    this.bar = this.header.querySelector(this.selector.bar);
    this.inner = this.header.querySelector(this.selector.inner);
    this.isSticky = this.header.classList.contains(this.classes.sticky);
  }

  events() {
    this.headerHeight();

    window.addEventListener("scroll", this.scrollProps.bind(this));
    window.addEventListener("resize", this.headerHeight.bind(this));
  }

  // getting height of header and set css variables
  headerHeight() {
    let height = this.inner.children[0].getBoundingClientRect().height,
        barHeight = 0,
        viewHeight = 0;

    if (this.bar) {
      barHeight = this.bar.getBoundingClientRect().height;

      height += barHeight;

      this.setCssVar(this.cssVar.barHeight, Math.floor(barHeight));
    }

    if (this.preview) {
      viewHeight = this.preview.getBoundingClientRect().height;

      if (this.isSticky) height += viewHeight;

      this.setCssVar(this.cssVar.viewHeight, Math.floor(viewHeight));
    }

    this.setCssVar(this.cssVar.height, Math.floor(height));
  }

  // setting properties when scroll page
  scrollProps() {
    window.scrollY > this.minHeight
      ? this.body.classList.add(this.modifier.scrolled)
      : this.body.classList.remove(this.modifier.scrolled)

    if (!this.bar) return false;

    let isScroll = this.body.classList.contains(this.modifier.scrollDown),
        current = window.scrollY,
        height = this.bar.getBoundingClientRect().height;

    if (current <= this.minHeight) {
      this.body.classList.remove(this.modifier.scrollDown);
      this.setCssVar(this.cssVar.transform, 0);

      return;
    }

    if (current > this.last && !isScroll) { // down
      this.body.classList.add(this.modifier.scrollDown);
      this.setCssVar(this.cssVar.transform, -height);

    } else if (current < this.last - 10 && isScroll) { // up
      this.body.classList.remove(this.modifier.scrollDown);
      this.setCssVar(this.cssVar.transform, 0);
    }

    this.last = current;
  }

  setCssVar(key, val) {
    this.doc.style.setProperty(
      `${key}`,
      `${val}px`
    )
  }
}

const initHeader = new Header(document.querySelector('.header'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initHeader.init();
})
