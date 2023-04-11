import { get } from 'lodash';
import { RequestHandler } from 'express';
import { JwtAuthService } from '../auth/jwtAuth.service';
import { UserService } from '../user/service/userService';
import Logger from '../utils/log/Logger';

const authGuard: RequestHandler = async (req, res, next) => {
  const jwtAuthService: JwtAuthService = new JwtAuthService();
  const userService: UserService = new UserService();

  if (!req.headers.authorization) {
    if (
      req.method === 'GET' ||
      req.path.includes('register') ||
      req.path.includes('login')
    ) {
      return next();
    } else {
      next(new Error('Please provide token in Authorization header!'));
    }
  } else {
    const accessToken = req?.headers?.authorization?.replace('Bearer ', '');
    const refreshToken = get(req, 'headers.x-refresh');

    if (!accessToken) return next();

    const { decodedToken, expired } = await jwtAuthService.verifyJwtAccessToken(
      accessToken
    );

    const user = await userService.getUserById(
      parseInt(<string>decodedToken?.id)
    );

    if (user) {
      req.user = user;
      return next();
    }

    if (expired && refreshToken) {
      const { accessToken, user } = await jwtAuthService.refreshTokens(
        String(refreshToken)
      );

      if (accessToken) {
        res.setHeader('x-access-token', accessToken);
      }

      req.user = user;
      return next();
    }
  }

  return next();
};

export default authGuard;
