class Search {
  constructor(search) {
    this.search = search;

    this.selector = {
      search: ".header__search",
      searchOpener: "#search-opener",
      searchInput: ".header__search-input",
      searchReset: ".header__search-reset"
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

  // set focus to the input field when opening the search popup
  searchOpen(event) {
    const target = event.target;

    if (!target || target !== this.searchOpener) return false;

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
  }

  // autofill search input field
  searchAutoFill() {
    const query = this.url.searchParams.get(this.params.q);

    if (!query) return false;

    this.searchInput.value = query;
  }
}

const initSearch = new Search(document.querySelector('.header__search'));

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initSearch.init();
})

document.addEventListener("preview:ready", () => {
  initSearch.init();
})
