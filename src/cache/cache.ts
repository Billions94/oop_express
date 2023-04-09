const cacheService = require('express-api-cache');

export function setCache(duration: string) {
  return cacheService.cache(duration);
}