class Search {
  constructor(search) {
    this.search = search;

    this.selector = {
      headerInner: ".header__inner",
      menuOpener: "#mobile-menu-opener",
      menuOpenerLabel: ".menu__opener",
      search: ".header__search",
      searchOpener: "#search-opener",
      searchInput: ".header__search-input",
      searchReset: ".header__search-reset"
    }

    this.classes = {
      background: "header__inner--background",
      backgroundDynamic: "header__inner--background-dynamic"
    }

    this.params = {
      q: "q"
    }

    this.url = new URL(window.location.href);
  }

  init() {
    if (!this.search) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.headerInner = document.querySelector(this.selector.headerInner);
    this.menuOpener = document.querySelector(this.selector.menuOpener);
    this.searchOpener = this.search.querySelector(this.selector.searchOpener);
    this.searchInput = this.search.querySelector(this.selector.searchInput);
    this.searchReset = this.search.querySelector(this.selector.searchReset);
  }

  events() {
    this.searchAutoFill();

    document.addEventListener("click", this.searchOpen.bind(this));
    document.addEventListener("click", this.searchClear.bind(this));
    document.addEventListener("click", this.searchClose.bind(this));
  }

  searchOpen(event) {
    const target = event.target;

    if (!target || target !== this.searchOpener) return false;

    this.searchOpener && this.searchOpener.checked ? this.searchFocus() : this.clearBackground()
  }

  // set focus to the input field when opening the search popup
  searchFocus() {
    this.addBackground()

    setTimeout(() => this.searchInput.focus(), 30);
  }

  // clear input field
  searchClear(event) {
    const target = event.target;

    if (target !== this.searchReset) return false;

    this.searchInput.value = "";
    this.searchInput.focus();
  }

  // closing search popup on click outside
  searchClose(event) {
    const target = event.target,
          outside = target.closest(this.selector.search);

    if (outside !== null) return false

    this.searchOpener.checked = false;

    if (target === this.menuOpener || target === this.menuOpenerLabel) {
      if (target.checked) this.addBackground()
    } else {
      if (!this.menuOpener.checked) this.clearBackground()
    }
  }

  // autofill search input field
  searchAutoFill() {
    const query = this.url.searchParams.get(this.params.q);

    if (!query) return false;

    this.searchInput.value = query;
  }

  addBackground() {
    if (!this.headerInner.classList.contains(this.classes.background)) {
      this.headerInner.classList.add(this.classes.backgroundDynamic)
    }
  }

  clearBackground() {
    if (!this.headerInner.classList.contains(this.classes.background)) {
      this.headerInner.classList.remove(this.classes.backgroundDynamic)
    }
  }
}

const initSearch = new Search(document.querySelector('.header__search'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initSearch.init();
})
