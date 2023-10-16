class Header {
  constructor(block) {
    this.block = block;

    this.selector = {
      body: "body",
      link: "a",
      bar: ".top-bar",
      barBlock: ".top-bar__text",
      view: ".preview-bar__container",
      headerNav: ".header__nav-wrapper",
      menu: ".menu",
      menuItem: ".menu__item",
      menuDrop: ".has-dropdown",
      menuBottom: ".header-menu-bottom",
      menuOpener: "#mobile-menu-opener",
      search: ".header__search",
      searchOpener: "#search-opener",
      searchInput: ".header__search-input",
      searchReset: ".header__search-reset",
      checkbox: "input[type=checkbox]"
    }

    this.classes = {
      sticky: "header--sticky",
      notSticky: "header--not-sticky",
      opened: "header--menu-opened",
      filled: "filled"
    }

    this.modifier = {
      scroll: "scrolled-down",
      overflow: "overflow-hidden",
      active: "active"
    }

    this.cssVar = {
      height: '--header-height',
      barHeight: '--top-bar-height',
      viewHeight: '--preview-height',
      linkHeight: '--menu-position',
      transform: '--header-transform'
    }

    this.props = {
      fixed: 'fixed'
    }

    this.event = {
      mouseenter: 'mouseenter',
      mouseleave: 'mouseleave'
    }

    this.attr = {
      href: "href",
      class: "class",
      style: "style"
    }

    this.params = {
      q: "q"
    }

    this.minHeight = 180;
    this.mediaQuery = 1100;
    this.last = 0;
    this.url = new URL(window.location.href);
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
    this.body = document.querySelector(this.selector.body);
    this.preview = document.querySelector(this.selector.view);
    this.bar = this.block.querySelector(this.selector.bar);
    this.barBlocks = this.block.querySelectorAll(this.selector.barBlock);
    this.menu = this.block.querySelector(this.selector.menu);
    this.menuBottom = this.block.querySelector(this.selector.menuBottom);
    this.menuItem = this.block.querySelector(this.selector.menuItem);
    this.menuDrops = this.block.querySelectorAll(this.selector.menuDrop);
    this.menuOpener = this.block.querySelector(this.selector.menuOpener);
    this.searchOpener = this.block.querySelector(this.selector.searchOpener);
    this.searchInput = this.block.querySelector(this.selector.searchInput);
    this.searchReset = this.block.querySelector(this.selector.searchReset);
    this.checkboxes = this.menu?.querySelectorAll(this.selector.checkbox);
    this.sticky = this.block.classList.contains(this.classes.sticky);
    this.notSticky = this.block.classList.contains(this.classes.notSticky);
  }

  events() {
    this.headerFixed();
    this.headerHeight();
    this.menuPosition();
    this.hoverClose();
    this.setEmailPhone();
    this.searchAutoFill();

    document.addEventListener("click", this.menuOverflow.bind(this));
    document.addEventListener("click", this.closeModals.bind(this));
    document.addEventListener("click", this.searchFocus.bind(this));
    document.addEventListener("click", this.searchClear.bind(this));
    document.addEventListener("keyup", this.showClearButton.bind(this));
    window.addEventListener("scroll", this.scrollProps.bind(this));
    window.addEventListener("resize", this.headerHeight.bind(this));
    window.addEventListener("resize", this.menuPosition.bind(this));
    window.addEventListener("resize", this.closeMenuResize.bind(this));
  }

  headerFixed() {
    if (!this.sticky) return false;

    this.block.style.position = this.props.fixed;
  }

  // getting height of header and set css variables
  headerHeight() {
    let height = this.block.getBoundingClientRect().height,
        barHeight = 0,
        viewHeight = 0;

    if (this.bar) {
      barHeight = this.bar.getBoundingClientRect().height;
      this.setCssVar(this.cssVar.barHeight, Math.floor(barHeight));
    }

    if (this.preview) {
      viewHeight = this.preview.getBoundingClientRect().height;

      if (this.sticky) height += viewHeight;

      this.setCssVar(this.cssVar.viewHeight, Math.floor(viewHeight));
    }

    this.setCssVar(this.cssVar.height, Math.floor(height));
  }

  // setting properties when scroll page
  scrollProps() {
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

  // add css variable when desktop menu is in bottom mode for menu positioning
  menuPosition() {
    if (!this.menuBottom) return false;

    const height = this.menuItem.getBoundingClientRect().height;

    this.setCssVar(this.cssVar.linkHeight, height);
  }

  // adding overflow:hidden when menu opened while header is not sticky on mobile
  menuOverflow(e) {
    const target = e?.target.previousElementSibling;

    if (target !== this.menuOpener) return false;

    this.menuOpener && this.menuOpener.checked ? this.closeMenu() : this.addOverflow()
  }

  closeMenu() {
    this.removeOverflow();
    this.closeMobileDrop();
  }

  closeMenuResize() {
    if (window.innerWidth >= this.mediaQuery) {
      this.closeMenu();

      if (this.menuOpener) this.menuOpener.checked = false;
    }
  }

  // closing all dropdowns when mobile menu closed
  closeMobileDrop() {
    if (!this.checkboxes?.length) return false;

    this.checkboxes.forEach(checkbox => checkbox.checked = false);
  }

  // closing modals of search and mobile menu on click on header icons
  closeModals(e) {
    this.killModal(e, this.searchOpener, this.selector.search);

    const target = e.target,
          searchOpener = this.searchOpener;

    let isChecked = false;

    if (this.menuOpener) isChecked = this.menuOpener.checked;

    if (target === searchOpener && isChecked) {
      const block = this.selector.headerNav;
      this.closeMobileDrop();
      this.removeOverflow();
      this.killModal(e, this.menuOpener, block);
    }
  }

  // closing modal window on click outside it
  killModal(e, elem, parent) {
    if (!elem) return false;

    const target = e.target,
          outside = target.closest(parent);

    if (outside !== null) return false;

    elem.checked = false;
  }

  // closing modal windows of header on hover and add class on menu items on desktop
  hoverClose() {
    if (!this.menuDrops.length) return false;

    const event = e => {
      const target = e.target,
            type = e.type,
            time = 500;

      switch (type) {
        case this.event.mouseenter:
          this.closeModals(e);
          target.classList.add(this.modifier.active);

          break;

        case this.event.mouseleave:
          setTimeout(() => {
            target.classList.remove(this.modifier.active);
          }, time);

          break;
      }
    };

    this.menuDrops.forEach((item) => {
      item.addEventListener(this.event.mouseenter, event);
      item.addEventListener(this.event.mouseleave, event);
    });
  }

  addOverflow() {
    this.doc.classList.add(this.modifier.overflow);

    if (!this.notSticky) return false;

    this.block.classList.add(this.classes.opened);
    this.block.style.position = this.props.fixed;
  }

  removeOverflow() {
    this.doc.classList.remove(this.modifier.overflow);

    if (!this.notSticky) return false;

    this.block.classList.remove(this.classes.opened);
    window.scrollTo(0, 0);
    this.block.removeAttribute(this.attr.style);
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

  // set focus to the input field when opening the search popup
  searchFocus(event) {
    const target = event?.target;

    if (target !== this.searchOpener) return false;

    setTimeout(() => {
      this.searchInput.focus();

      this.showClearButton();
    }, 30);
  }

  // clear input field
  searchClear(event) {
    const target = event?.target;

    if (target !== this.searchReset) return false;

    this.searchInput.value = "";
    this.searchInput.parentElement.classList.remove(this.classes.filled);
    this.searchInput.focus();
  }

  // add/remove class to parent of search input field
  showClearButton() {
    if (!this.searchInput) return false;

    this.searchInput.value.length !== 0
      ? this.searchInput.parentElement.classList.add(this.classes.filled)
      : this.searchInput.parentElement.classList.remove(this.classes.filled)
  }

  // autofill search input field
  searchAutoFill() {
    if (!this.searchInput) return false;

    const query = this.url.searchParams.get(this.params.q);

    if (!query) return false;

    this.searchInput.value = query;
  }

  setCssVar(key, val) {
    this.doc.style.setProperty(
      `${key}`,
      `${val}px`
    )
  }
}

const stickyHeader = new Header(document.querySelector('.header'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") stickyHeader.init();
})
