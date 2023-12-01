class GlobalMenu {
  constructor(menu) {
    this.menu = menu;

    this.selector = {
      header: ".header",
      menuOpener: "#mobile-menu-opener",
      checkbox: "input[type=checkbox]"
    }

    this.classes = {
      sticky: "header--sticky",
      opened: "header--menu-opened"
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
    document.addEventListener("click", this.menuOverflow.bind(this));
  }

  // adding overflow:hidden when menu opened while header is not sticky
  menuOverflow(e) {
    const target = e?.target.previousElementSibling;

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
    this.doc.removeAttribute(this.attr.class);

    if (this.isSticky) return false;

    this.header.classList.remove(this.classes.opened);
    this.header.removeAttribute(this.attr.style);
  }

  // closing all dropdowns when mobile menu closed
  closeMenuDrops() {
    if (!this.checkboxes?.length) return false;

    this.checkboxes.forEach(checkbox => checkbox.checked = false);
  }
}

const menu = new GlobalMenu(document.querySelector('.menu'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") menu.init();
})
