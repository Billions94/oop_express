import { RequestHandler } from 'express';
import { Service } from 'typedi';

@Service()
export class RequireUserAuth {
  init: RequestHandler = (req, res, next) => {
    const user = req.user;

    if (
      req.method === 'GET' ||
      req.path.includes('register') ||
      req.path.includes('login')
    ) {
      return next();
    }

    if (!user) {
      return res.sendStatus(403);
    }

    return next();
  };
}
