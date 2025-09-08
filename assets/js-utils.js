/**
 * Utilities (optional, load as needed)
 * Depends on js-utils-core.js being loaded first
 */

// Ensure Utils exists even if core wasn't loaded (defensive coding)
window.Utils = window.Utils || {}
window.$ = window.Utils

// CSS variable management
Utils.setCssVar = (args) => {
  const { key, value, element = document.documentElement, unit = '' } = args
  element.style.setProperty(key, `${value}${unit}`)
}

Utils.resizeObserver = (callback, customOptions = {}) => {
  const defaultOptions = {
    debounceTime: 150,
    element: null,
    trackWidth: true
  }
  const options = { ...defaultOptions, ...customOptions }
  let lastWindowWidth = $.viewportSize().width,
    debounceTimer = null,
    observer = null

  const wrappedCallback = (entries) => {
    if (options.trackWidth) {
      const currentWidth = $.viewportSize().width
      if (currentWidth === lastWindowWidth) return
      lastWindowWidth = currentWidth
    }

    const debounceTimeHandler = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        $.nextFrame(() => callback(entries))
      }, options.debounceTime)
    }

    options.debounceTime > 0 ?
      debounceTimeHandler() :
      $.nextFrame(() => callback(entries))
  }

  observer = new ResizeObserver(wrappedCallback)
  if (options.element) observer.observe(options.element)

  return {
    observer,
    cleanup: () => {
      observer.disconnect()
      observer = null
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
    }
  }
}
