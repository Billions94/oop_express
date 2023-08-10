import { RequestHandler } from 'express';
export const restCache = require('express-api-cache');

export class Cache {
  private readonly duration: string | number;

  constructor(duration: string | number) {
    this.duration = duration;
  }

  cache: RequestHandler = (req, res, next) => {
    if (req.method === 'GET') {
      restCache.cache(this.duration);
      next();
    } else next();
  };
}
