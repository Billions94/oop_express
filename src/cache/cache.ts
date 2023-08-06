import { RequestHandler } from 'express';
export const cacheService = require('express-api-cache');

export const restCache: RequestHandler = (req, res, next) => {
  if (req.method === 'GET') {
    cacheService.cache('30 seconds');
    next();
  }
};

export function setCache(duration: string) {
  return cacheService.cache(duration);
}
