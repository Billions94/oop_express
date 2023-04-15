import { get } from 'lodash';
import { RequestHandler } from 'express';
import { JwtAuthService } from '../auth/jwtAuth.service';
import { Container } from 'typedi';
import { UserRepository } from '../user/repository/userRepository';
import { User as ExpressUser } from '../user/entity/user';

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      user?: ExpressUser;
    }
  }
}

const authGuard: RequestHandler = async (req, res, next) => {
  const jwtAuthService: JwtAuthService = Container.get(JwtAuthService);
  const userRepository: UserRepository = Container.get(UserRepository);

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

    if (!accessToken) {
      return next();
    }

    const { decodedToken, expired } = await jwtAuthService.verifyJwtAccessToken(
      accessToken
    );

    if (decodedToken !== null) {
      const user = await userRepository.findById(
        parseInt(<string>decodedToken?.id)
      );
      if (user) {
        req.user = user;
        return next();
      }
    } else if (expired && refreshToken) {
      const { accessToken, user, errorMessage } =
        await jwtAuthService.refreshTokens(String(refreshToken));

      if (!accessToken && !user && errorMessage) {
        res.status(403).send(errorMessage);
      }

      if (accessToken) {
        res.setHeader('x-access-token', accessToken);
        res.setHeader('Authorization', 'Bearer ' + accessToken);
      }

      req.user = user;
      return next();
    }
  }

  return next();
};

export default authGuard;
