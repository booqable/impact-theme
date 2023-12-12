class MegaMenu {
  constructor(menu) {
    this.menu = menu;

    this.selector = {
      header: ".header",
      menuOpener: "#mobile-menu-opener",
      searchOpener: ".header__search-opener",
      cartOpener: "bq-minicart-button",
      checkbox: "input[type=checkbox]"
    }

    this.classes = {
      opened: "header-menu-opened",
      sticky: "header-sticky"
    }

    this.modifier = {
      overflow: "overflow-hidden"
    }

    this.props = {
      fixed: 'fixed'
    }

    this.attr = {
      class: "class",
      style: "style"
    }
  }

  init() {
    if (!this.menu) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
    this.header = this.menu.closest(this.selector.header);
    this.menuOpener = this.menu.parentElement.querySelector(this.selector.menuOpener);
    this.checkboxes = this.menu.querySelectorAll(this.selector.checkbox);
    this.isSticky = this.header.classList.contains(this.classes.sticky);
  }

  events() {
    document.addEventListener("click", this.openMenu.bind(this));
    document.addEventListener("click", this.closeMenuOutside.bind(this));
  }

  // adding overflow:hidden when menu opened while header is not sticky
  openMenu(event) {
    const target = event.target.previousElementSibling;

    if (!target || target !== this.menuOpener) return false;

    this.menuOpener && this.menuOpener.checked ? this.closeMenu() : this.addOverflow()
  }

  closeMenu() {
    this.removeOverflow();
    this.closeMenuDrops();
  }

  addOverflow() {
    this.doc.classList.add(this.modifier.overflow);

    if (this.isSticky) return false;

    this.header.classList.add(this.classes.opened);
    this.header.style.position = this.props.fixed;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  removeOverflow() {
    const classes = this.doc.classList;

    classes.length > 1
      ? this.doc.classList.remove(this.modifier.overflow)
      : this.doc.removeAttribute(this.attr.class)

    if (this.isSticky) return false;

    this.header.classList.remove(this.classes.opened);
    this.header.removeAttribute(this.attr.style);
  }

  // closing all dropdowns when menu closed
  closeMenuDrops() {
    if (!this.checkboxes?.length) return false;

    this.checkboxes.forEach(checkbox => checkbox.checked = false);
  }

  // closing menu on click search and cart icons
  closeMenuOutside(event) {
    const target = event.target,
          menuOpened = this.menuOpener.checked,
          cartOpener = this.header.querySelector(this.selector.cartOpener),
          searchOpener = this.header.parentElement.querySelector(this.selector.searchOpener);

    if (target === searchOpener && menuOpened || target === cartOpener && menuOpened) {
      this.menuOpener.checked = false
      this.removeOverflow()
      this.closeMenuDrops()
    }
  }
}

const initMenu = new MegaMenu(document.querySelector('.menu'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initMenu.init();
})
