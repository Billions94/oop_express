import { RequestHandler } from 'express';

const requireUser: RequestHandler = (req, res, next) => {
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

export default requireUser;
