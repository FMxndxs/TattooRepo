import '@testing-library/jest-dom'

// Mock IntersectionObserver (not available in JSDOM — needed by Motion's useInView)
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
}

// Mock ResizeObserver (needed by some Motion internals)
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
