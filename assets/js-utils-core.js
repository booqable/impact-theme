/**
 * Optimized Core Utilities (critical subset)
 */
window.Utils = window.Utils || {}
window.$ = window.Utils

// Core type checking - critical for safe operation
Utils.is = (value, type) => {
  switch (type) {
    case 'function': return typeof value === 'function'
    case 'undefined': return typeof value === 'undefined'
    case 'string': return typeof value === 'string'
    case 'number': return typeof value === 'number' && !isNaN(value)
    case 'boolean': return typeof value === 'boolean'
    case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value)
    case 'array': return Array.isArray(value)
    case 'null': return value === null
    default: return false
  }
}

// Connection speed detection - important for adaptive loading
Utils.slowConnection = () => {
  if (!navigator.connection) return false
  const connectionType = navigator.connection.effectiveType
  return connectionType === '2g' || connectionType === 'slow-2g'
}

// Viewport detection - critical for responsive behavior
Utils.inViewport = (element) => {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Viewport dimensions - widely used for responsive components
Utils.viewportSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
})

// Animation frame utilities - critical for performance
Utils.nextFrame = (callback) => window.requestAnimationFrame(callback)

// Cleanup function with the global theme cleanup system
Utils.cleanup = (cleanupName, handler) => {
  if (!cleanupName || !$.is(handler, 'function')) return

  window[cleanupName] = handler()

  // Ensure cleanup is idempotent
  const originalCleanup = window[cleanupName]
  window[cleanupName] = () => {
    if (!$.is(originalCleanup, 'function')) return
    originalCleanup()
    window[cleanupName] = () => {} // Replace with no-op after cleanup
  }

  if (window.themeCleanup) {
    const originalThemeCleanup = window.themeCleanup
    window.themeCleanup = () => {
      if (window[cleanupName]) window[cleanupName]()
      originalThemeCleanup()
    }
  }
}

// Observer utilities - critical for modern performance patterns
Utils.intersectionObserver = (callback, customOptions = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.01
  }
  return new IntersectionObserver(callback, { ...defaultOptions, ...customOptions })
}

// Performance utilities
Utils.requestIdle = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options)
  }
  const timeout = options.timeout || 50,
    startTime = Date.now()
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - startTime))
    })
  }, timeout)
}

Utils.debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      clearTimeout(timeout)
      func(...args)
    }, wait)
  }
}

// DOM utilities - for efficient class toggling
Utils.toggleClass = (element, className, force) => {
  if (!element) return
  $.is(force, 'boolean') ?
    element.classList.toggle(className, force) :
    element.classList.toggle(className)
}

// Feature detection for modern image loading
Utils.isFetchPriority = () => 'fetchPriority' in HTMLImageElement.prototype

// Batches DOM operations to prevent layout thrashing
Utils.batchDOM = (callback) => {
  return $.nextFrame(() => callback())
}

// Separates DOM reads and writes to optimize performance
Utils.frameSequence = (readCallback, writeCallback) => {
  return $.nextFrame(() => {
    const result = readCallback()
    $.nextFrame(() => {
      writeCallback(result)
    })
  })
}

// Event management - most widely used utility
Utils.eventListener = (method, nodes, event, handler, options) => {
  if (!nodes) return

  // Handle single object case
  if (nodes === window ||
    nodes === document ||
    nodes instanceof HTMLElement ||
    (typeof nodes === 'object' &&
      ($.is(nodes.addEventListener, 'function')))) {
    if (method === 'add') nodes.addEventListener(event, handler, options)
    if (method === 'remove') nodes.removeEventListener(event, handler, options)
    return
  }

  if (!nodes.length) return

  Array.from(nodes).forEach((node) => {
    if (!node || $.is(node.addEventListener, 'function')) return
    if (method === 'add') node.addEventListener(event, handler, options)
    if (method === 'remove') node.removeEventListener(event, handler, options)
  })
}

// Element dimension calculations with transform support
Utils.getDimensions = (element) => {
  if (!element) return { width: 0, height: 0 }
  const rect = element.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height
  }
}
