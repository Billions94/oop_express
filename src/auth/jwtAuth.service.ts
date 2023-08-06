import { config } from 'dotenv';
import * as process from 'process';
import jwtService from 'jsonwebtoken';
import bcryptService from 'bcrypt';
import { User } from '../user/entity/user';
import { UserRepository } from '../user/repository/userRepository';
import { Service } from 'typedi';
import {
  TokenResponse,
  JwtPayload,
  VerifyRefreshTokenResponse,
  RefreshTokenResponse,
} from './interface/jwtAuthInterface';
import { Inject } from 'typescript-ioc';
import Logger from '../utils/log/Logger';

config({ path: '.env' });
@Service()
export class JwtAuthService {
  private readonly JWT_ACCESS_TOKEN_SECRET_KEY = <string>(
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY
  );
  private readonly JWT_REFRESH_TOKEN_SECRET_KEY = <string>(
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY
  );
  private readonly ACCESS_TOKEN_EXPIRATION = <string>(
    process.env.ACCESS_TOKEN_EXPIRATION_TIME
  );
  private readonly REFRESH_TOKEN_EXPIRATION = <string>(
    process.env.REFRESH_TOKEN_EXPIRATION_TIME
  );
  private readonly SALT_FACTOR = parseInt(<string>process.env.SALT_FACTOR);

  constructor(@Inject private readonly userRepository: UserRepository) {}

  async tokenGenerator(user: User): Promise<TokenResponse> {
    const accessToken = await this.generateAccessToken({
      id: String(user.id),
    });
    const refreshToken = await this.generateRefreshToken({
      id: String(user.id),
    });

    const hashedRefresh = await bcryptService.hash(
      refreshToken,
      this.SALT_FACTOR
    );

    await this.userRepository
      .createQueryBuilder('user')
      .update(user)
      .set({ refreshToken: hashedRefresh })
      .execute();

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: JwtPayload) {
    return new Promise<string>((resolve, reject) => {
      jwtService.sign(
        payload,
        this.JWT_ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: this.ACCESS_TOKEN_EXPIRATION,
          algorithm: 'HS512',
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(<string>token);
        }
      );
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return new Promise<string>((resolve, reject) => {
      jwtService.sign(
        payload,
        this.JWT_REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn: this.REFRESH_TOKEN_EXPIRATION,
          algorithm: 'HS512',
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(<string>token);
        }
      );
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
      jwtService.verify(
        token,
        this.JWT_ACCESS_TOKEN_SECRET_KEY,
        (err, decodedToken) => {
          if (err) reject(err);
          else resolve(<JwtPayload>decodedToken);
        }
      );
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwtService.verify(
        token,
        this.JWT_REFRESH_TOKEN_SECRET_KEY,
        (err, decodedToken) => {
          if (err) reject(err);
          else resolve(<JwtPayload>decodedToken);
        }
      );
    });
  }

  async verifyJwtAccessToken(
    token: string
  ): Promise<VerifyRefreshTokenResponse> {
    try {
      const decodedToken = await this.verifyAccessToken(token);
      return {
        valid: true,
        expired: false,
        decodedToken,
      };
    } catch (error: any) {
      return {
        valid: false,
        expired: error.message === 'jwt expired',
        decodedToken: null,
      };
    }
  }

  async refreshTokens(
    currentRefreshToken: string
  ): Promise<Partial<RefreshTokenResponse>> {
    try {
      const decodedToken = await this.verifyRefreshToken(currentRefreshToken);
      const user = await this.userRepository.findById(
        parseInt(decodedToken.id)
      );

      if (
        await bcryptService.compare(
          currentRefreshToken,
          String(user.refreshToken)
        )
      ) {
        const { accessToken, refreshToken } = await this.tokenGenerator(user);
        return { accessToken, refreshToken, user };
      } else {
        return { errorMessage: 'Refresh token is invalid' };
      }
    } catch (err) {
      return { errorMessage: err.message };
    }
  }

  async revokeAccessToken(currentRefreshToken: string): Promise<boolean> {
    const decodedToken = await this.verifyRefreshToken(currentRefreshToken);
    const user = await this.userRepository.findById(parseInt(decodedToken.id));

    if (!user) throw new Error('User not found');

    user.refreshToken = null;
    await this.userRepository.save(user);
    return true;
  }
}
