
const cache = new Map();

export function storeCache(key, data) {
  cache.set(key, data);
}

export function getCache(key) {
  return cache.get(key);
}

export function clearCache(key) {
  cache.delete(key);
}

export function clearAllCache() {
  cache.clear();
}
