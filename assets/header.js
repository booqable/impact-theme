class Header {
  constructor(header) {
    this.header = header;

    this.selector = {
      body: "body",
      bar: ".top-bar",
      barBlock: ".top-bar__text",
      view: ".preview-bar__container",
      inner: ".header__inner",
      link: "a"
    }

    this.classes = {
      sticky: "header--sticky",
      background: "header__inner--background"
    }

    this.modifier = {
      scroll: "scrolled-down",
      scrolled: "page-scrolled",
      transparent: "header--transparent"
    }

    this.cssVar = {
      height: '--header-height',
      barHeight: '--top-bar-height',
      viewHeight: '--preview-height',
      transform: '--header-transform'
    }

    this.props = {
      fixed: 'fixed',
      absolute: "absolute"
    }

    this.attr = {
      href: "href"
    }

    this.minHeight = 180;
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
    this.barBlocks = this.header.querySelectorAll(this.selector.barBlock);
    this.inner = this.header.querySelector(this.selector.inner);
    this.isSticky = this.header.classList.contains(this.classes.sticky);
    this.isColored = this.inner.classList.contains(this.classes.background);
  }

  events() {
    this.headerHeight();
    this.headerFixed();
    this.setEmailPhone();

    window.addEventListener("scroll", this.scrollProps.bind(this));
    window.addEventListener("resize", this.headerHeight.bind(this));
  }

  headerFixed() {
    if (!this.isColored) {
      this.header.classList.add(this.modifier.transparent)
      this.inner.style.position = this.props.absolute
    }

    if (this.isSticky) this.header.style.position = this.props.fixed
  }

  // getting height of header and set css variables
  headerHeight() {
    let height = this.header.getBoundingClientRect().height,
        barHeight = 0,
        viewHeight = 0;

    if (this.bar) {
      barHeight = this.bar.getBoundingClientRect().height;
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

    let isScroll = this.body.classList.contains(this.modifier.scroll),
        current = window.scrollY,
        height = this.bar.getBoundingClientRect().height;

    if (current <= this.minHeight) {
      this.body.classList.remove(this.modifier.scroll);
      this.setCssVar(this.cssVar.transform, 0);

      return;
    }

    if (current > this.last && !isScroll) { // down
      this.body.classList.add(this.modifier.scroll);
      this.setCssVar(this.cssVar.transform, -height);

    } else if (current < this.last - 10 && isScroll) { // up
      this.body.classList.remove(this.modifier.scroll);
      this.setCssVar(this.cssVar.transform, 0);
    }

    this.last = current;
  }

  // convert links to allow users to send emails and call phone numbers
  setEmailPhone() {
    if (!this.barBlocks.length) return false;

    const keepOnly = /[^a-zA-Z0-9,\-.?!@+]/g,
          specChars = /[\()\-\s]/g,
          phoneRegex = /(?:[-+() ]*\d){10,13}/gm,
          emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

    this.barBlocks.forEach(block => {
      const links = block.querySelectorAll(this.selector.link);

      if (!links.length) return false;

      links.forEach(link => {
        let href = link.getAttribute(this.attr.href);
        const match = href.match(phoneRegex) || href.match(emailRegex);

        if (match?.length) {
          href = match[0].replace(keepOnly, '');

          if (href.match(phoneRegex)) href = `tel:${href.replaceAll(specChars, '')}`;
          if (href.match(emailRegex)) href = `mailto:${href}`;

          link.setAttribute(this.attr.href, href);
        }
      })
    })
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
