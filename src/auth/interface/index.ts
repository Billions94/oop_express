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