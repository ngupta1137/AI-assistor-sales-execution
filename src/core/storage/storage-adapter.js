// Storage adapter abstraction for session persistence and offline caching.
// Provides pluggable persistence: memory (ephemeral demo) and local storage (client PoC).

const STORAGE_PREFIX = 'ai_assistor_';

/**
 * In-memory storage adapter for zero-side-effect demo execution and testing.
 */
export class MemoryStorageAdapter {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

/**
 * Local storage adapter with error handling and prefix isolation.
 * Enables persistent PoC sessions across browser reloads.
 */
export class LocalStorageAdapter {
  constructor(prefix = STORAGE_PREFIX) {
    this.prefix = prefix;
    this.available = this.checkAvailability();
    this.fallback = new MemoryStorageAdapter();
  }

  checkAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = `${this.prefix}test`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key) {
    if (!this.available) return this.fallback.getItem(key);
    try {
      return window.localStorage.getItem(`${this.prefix}${key}`);
    } catch {
      return this.fallback.getItem(key);
    }
  }

  setItem(key, value) {
    if (!this.available) {
      this.fallback.setItem(key, value);
      return;
    }
    try {
      window.localStorage.setItem(`${this.prefix}${key}`, String(value));
    } catch {
      this.fallback.setItem(key, value);
    }
  }

  removeItem(key) {
    if (!this.available) {
      this.fallback.removeItem(key);
      return;
    }
    try {
      window.localStorage.removeItem(`${this.prefix}${key}`);
    } catch {
      this.fallback.removeItem(key);
    }
  }

  clear() {
    if (!this.available) {
      this.fallback.clear();
      return;
    }
    try {
      const toRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(this.prefix)) toRemove.push(k);
      }
      for (const k of toRemove) window.localStorage.removeItem(k);
    } catch {
      this.fallback.clear();
    }
  }
}

let activeStorage = null;

export function getAppStorage(forceMemory = false) {
  if (forceMemory) return new MemoryStorageAdapter();
  if (!activeStorage) {
    activeStorage = new LocalStorageAdapter();
  }
  return activeStorage;
}

export function setAppStorage(adapter) {
  activeStorage = adapter;
}
