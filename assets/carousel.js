class Carousel {
  constructor(block) {
    this.block = block;

    this.selector = {
      navi: ".carousel__navigation",
      pagination: ".carousel__pagination",
      btn: ".carousel__btn",
      prev: ".carousel__btn.prev",
      next: ".carousel__btn.next",
      dot: ".carousel__dot",
      wrapper: ".carousel__wrapper",
      item: ".carousel__item",
      timer: ".carousel__timer"
    }

    this.classes = {
      pause: "carousel__pause",
      dot: "carousel__dot",
      prev: "prev",
      next: "next",
      init: "initialized"
    }

    this.modifiers = {
      active: "active",
      controls: "controls",
      hidden: "hidden"
    }

    this.data = {
      index: "data-index"
    }

    this.event = {
      click: "click",
      prev: "prev",
      next: "next",
      start: "touchstart",
      end: "touchend",
      enter: "mouseenter",
      leave: "mouseleave"
    }

    this.interval;
    this.touchstart = null;
    this.touchend = null;
    this.wheelTimeout;
    this.isWheeling = false;
    this.infinite = true;
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.wrap = this.block.querySelector(this.selector.wrapper);
    this.navi = this.block.querySelector(this.selector.navi);
    this.pagi = this.block.querySelector(this.selector.pagination);
    this.item = this.block.querySelector(this.selector.item);
    this.items = this.block.querySelectorAll(this.selector.item);
    this.btns = this.block.querySelectorAll(this.selector.btn);
    this.dots = this.block.querySelectorAll(this.selector.dot);
    this.timers = this.block.querySelectorAll(this.selector.timer);
  }

  events() {
    this.carouselInit();
    this.startTimer();
    this.pauseAutoRotate();
    this.hideControls();
    this.hidePaginationDots();

    this.listener(this.dots, 'click', this.pagination);
    this.listener(this.dots, 'click', this.navigation);
    this.listener(this.btns, 'click', this.navigation);
    document.addEventListener('wheel', this.touchpadPoints.bind(this));
    document.addEventListener('touchstart', this.touchscreenPoints.bind(this));
    document.addEventListener('touchend', this.touchscreenPoints.bind(this));
    window.addEventListener('resize', this.hideControls.bind(this));
    window.addEventListener('resize', this.hidePaginationDots.bind(this));
  }

  carouselInit() {
    if (this.items.length < 2) return false;

    this.block.classList.add(this.classes.init);
  }

  startTimer() {
    this.timers.forEach(timer => this.autoRotate(timer.value * 1000));
  }

  // autorotate slides of carousel
  autoRotate(time) {
    if (!time) return false;

    this.interval = setInterval(() => this.navigation(undefined, time), time);

    return () => clearInterval(this.interval);
  }

  // pause autorotate slides on hover and touch devices
  pauseAutoRotate() {
    const isPause = this.block.classList.contains(this.classes.pause);

    if (!isPause) return false;
    if (!this.items.length) return false;

    const func = event => {
      if (event.type === this.event.enter || event.type === this.event.start) clearInterval(this.interval);
      if (event.type === this.event.leave || event.type === this.event.end) this.startTimer();
    }

    this.block.addEventListener(this.event.enter, func);
    this.block.addEventListener(this.event.leave, func);
    this.block.addEventListener(this.event.start, func);
    this.block.addEventListener(this.event.end, func);
  }

  // slide the carousel left/right or top/bottom and change the index of the active dot of the pagination
  navigation(event, time) {
    const target = event?.target,
          isPrev = target?.classList.contains(this.classes.prev),
          isNext = target?.classList.contains(this.classes.next),
          isDot = target?.classList.contains(this.classes.dot);

    if (!isPrev && !isNext && !isDot && !time) return false;

    const width = this.item.getBoundingClientRect().width,
          index = parseInt(target?.getAttribute(this.data.index)),
          prev = this.event.prev,
          next = this.event.next;

    let element, left, scrollX, clientX, children, valueLeft = 0;

    element = isDot || isPrev || isNext
      ? this.getSiblingElement(target?.parentElement, this.selector.wrapper, this.event.prev)
      : this.wrap

    left = element.scrollLeft;
    scrollX = element.scrollWidth;
    clientX = element.clientWidth;
    children = [...element.children];

    if (isPrev) {
      const options = {
        currentScroll: left,
        clientVal: clientX,
        scrollVal: scrollX,
        scrollToVal: valueLeft,
        size: width,
        trigger: prev
      }

      valueLeft = this.slideEfect(event, options);
    }

    if (isNext || time) {
      const options = {
        currentScroll: left,
        clientVal: clientX,
        scrollVal: scrollX,
        scrollToVal: valueLeft,
        size: width,
        trigger: next
      }

      valueLeft = this.slideEfect(event, options);
    }

    if (isDot) valueLeft = width * (index - 1);

    const options = {
      element: element,
      left: valueLeft,
      top: 0
    }

    this.scrollTo(options);
  }

  // logic of Carousel's Prev and Next buttons (including vertical carousel)
  slideEfect(event, options) {
    const { currentScroll, scrollVal, clientVal, size, trigger } = options;
    let i, condition, lastIndex, nextIndex, scrollToLast, scrollToNext, scrollToVal;

    switch (trigger) {
      case this.event.prev:
        condition = currentScroll === 0;
        lastIndex = Math.ceil((scrollVal - clientVal) / size + 1);
        nextIndex = Math.ceil(currentScroll / size);
        scrollToLast = scrollVal;
        scrollToNext = currentScroll - size;

        break;

      case this.event.next:
        condition = currentScroll >= scrollVal - clientVal - 16;
        lastIndex = 1;
        nextIndex = parseInt(currentScroll / size + 2);
        scrollToLast = 0;
        scrollToNext = currentScroll + size;

        break;
    }

    i = condition && this.infinite ? lastIndex : nextIndex;
    scrollToVal = condition && this.infinite ? scrollToLast : scrollToNext;

    this.pagination(event, i);

    return scrollToVal;
  }

  // change active dot of the pagination
  pagination(event, index) {
    const target = event?.target,
          isDot = target?.classList.contains(this.classes.dot);

    if (!isDot && typeof index === 'undefined') return false;

    this.dots.forEach(dot => {
      const activeIndex = parseInt(dot.getAttribute(this.data.index));

      dot.classList.remove(this.modifiers.active);

      if (isDot) target.classList.add(this.modifiers.active);
      if (activeIndex === index) dot.classList.add(this.modifiers.active);
      if (typeof index === 'undefined') index = parseInt(target.getAttribute(this.data.index));
    })
  }

  // hide not used dots of the pagination
  hidePaginationDots() {
    if (!this.dots) return false;

    const client = this.wrap.clientWidth,
          scroll = this.wrap.scrollWidth,
          width = this.item.getBoundingClientRect().width;

    if (scroll - client > 0) {
      const numberDots = Math.ceil((scroll - client) / width);

      this.dots.forEach(dot => {
        dot.classList.add(this.modifiers.hidden);

        const index = parseInt(dot.getAttribute(this.data.index));

        if (index <= numberDots + 1) dot.classList.remove(this.modifiers.hidden);
      })
    }
  }

  // hide all controls if viewport is bigger than the width of all slides
  hideControls() {
    if (!this.navi && !this.pagi) return false;

    const clientX = this.wrap.clientWidth,
          scrollX = this.wrap.scrollWidth;

    if (clientX === scrollX) {
      this.navi?.classList.add(this.modifiers.hidden)
      this.pagi?.classList.add(this.modifiers.hidden)
      this.navi?.parentElement.classList.remove(this.modifiers.controls)
      this.pagi?.parentElement.classList.remove(this.modifiers.controls)
    } else {
      this.navi?.classList.remove(this.modifiers.hidden)
      this.pagi?.classList.remove(this.modifiers.hidden)
      this.navi?.parentElement.classList.add(this.modifiers.controls)
      this.pagi?.parentElement.classList.add(this.modifiers.controls)
    }
  }

  // touchpoints detection on touch screens
  touchscreenPoints(event) {
    const wrap = event?.target.closest(this.selector.wrapper),
          dots = this.getCurrentDot().dots;

    if (!dots.length && !wrap) return false;

    if (event.type === this.event.start) this.touchstart = event.changedTouches[0].screenX;

    if (event.type === this.event.end) {
      this.touchend = event.changedTouches[0].screenX;
      this.touchscreenDirection(wrap);
    }
  }

  touchscreenDirection(wrap) {
    const left = wrap?.scrollLeft,
          scroll = wrap?.scrollWidth,
          client = wrap?.clientWidth,
          next = wrap?.parentElement.querySelector(this.selector.next),
          prev = wrap?.parentElement.querySelector(this.selector.prev),
          leftSwipe = this.touchstart > this.touchend,
          rightSwipe = this.touchend > this.touchstart;

    if (left >= 0 && left <= scroll - client) {
      this.infinite = false;

      if (leftSwipe) this.trigger(next, this.event.click);
      if (rightSwipe) this.trigger(prev, this.event.click);

      this.infinite = true;
    }
  }

  // touchpad touchpoints detection
  touchpadPoints(event) {
    const wrap = event?.target.closest(this.selector.wrapper),
          dots = this.getCurrentDot().dots;

    if (!dots.length && !wrap) return false;

    let index = this.getCurrentDot().index;
    const delta = event.deltaX; // Get the scroll direction (+1 for scroll right, -1 for scroll left)

    if (!this.isWheeling) {
      this.isWheeling = true;

      if (delta === -1 && index > 1) index = index - 1;
      if (delta === 1 && index < dots.length) index = index + 1;

      this.pagination(undefined, index);
    }

    clearTimeout(this.wheelTimeout);

    this.wheelTimeout = setTimeout(() => this.isWheeling = false, 100);
  }

  // get the active dot index
  getCurrentDot() {
    let index = 1,
        dots = [...this.dots];

    dots = dots.filter(dot => !dot.classList.contains(this.modifiers.hidden));

    dots.forEach(dot => {
      if (dot.classList.contains(this.modifiers.active))
        index = parseInt(dot.getAttribute(this.data.index));
    })

    return { index, dots };
  }

  setCssVar(key, val) {
    this.block.parentElement.style.setProperty(
      `${key}`,
      `${val}`
    )
  }

  scrollTo(options) {
    const { element, left, top } = options;

    element.scrollTo({
      left: left,
      top: top,
      behavior: "smooth",
    })
  }

  trigger(element, eventType) {
    if (!element) return false;

    if (typeof eventType === 'string' && typeof element[eventType] === 'function') {
      element[eventType]();
    } else {
      const event =
        typeof eventType === 'string'
          ? new Event(eventType, {bubbles: true})
          : eventType
      element.dispatchEvent(event);
    }
  }

  getSiblingElement(element, selector, direction) {
    if (!element) return false;

    let sibling;

    switch (direction) {
      case this.event.prev:
        sibling = element.previousElementSibling;

        while (sibling) {
          if (sibling.matches(selector)) return sibling;
          sibling = sibling.previousElementSibling;
        }

        break;

      case this.event.next:
        sibling = element.nextElementSibling;

        while (sibling) {
          if (sibling.matches(selector)) return sibling;
          sibling = sibling.nextElementSibling;
        }

        break;
    }
  }

  listener(nodes, event, func) {
    nodes.forEach(node => {
      node.addEventListener(`${event}`, func.bind(this));
    })
  }
}

const initCarousel = (el = ".carousel") => {
  const nodes = document.querySelectorAll(el);

  if (!nodes.length) return false;

  nodes.forEach(node => {
    const carousel = new Carousel(node);
    carousel.init();
  })
}

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initCarousel();
})
