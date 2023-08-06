import { get } from 'lodash';
import { RequestHandler } from 'express';
import { JwtAuthService } from '../auth/jwtAuth.service';
import { Container, Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import { UserRepository } from '../user/repository/userRepository';
import { User as ExpressUser } from '../user/entity/user';
import Logger from '../utils/log/Logger';

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      user?: ExpressUser;
    }
  }
}

@Service()
export class AuthGuard {
  @Inject
  private readonly jwtAuthService: JwtAuthService;
  @Inject
  private readonly userRepository: UserRepository;

  init: RequestHandler = async (req, res, next) => {
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
      const refreshToken = String(get(req, 'headers.x-refresh'));

      if (!accessToken) {
        return next();
      }

      const { decodedToken, expired } =
        await this.jwtAuthService.verifyJwtAccessToken(accessToken);

      if (decodedToken) {
        const user = await this.userRepository.findById(
          parseInt(String(decodedToken?.id))
        );

        if (user) {
          req.user = user;
          return next();
        }
      } else if (expired && refreshToken) {
        if (refreshToken) {
          const { accessToken, user, errorMessage } =
            await this.jwtAuthService.refreshTokens(refreshToken);

          if (errorMessage) {
            Logger.warn('Jwt token expired');
            return next();
          }
          if (accessToken) {
            res.setHeader('x-access-token', accessToken);
          }

          req.user = user;
          return next();
        }
      }
    }
  };
}
