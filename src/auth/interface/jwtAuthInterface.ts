import { User } from '../../user/entity/user';

export interface JwtPayload {
  id: string;
  session?: string;
}

export interface VerifyRefreshTokenResponse {
  valid: boolean;
  expired: boolean;
  decodedToken: JwtPayload | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  errorMessage?: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}