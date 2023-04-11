export interface CreateUserResponse {
  statusCode: number;
  errorMessage: string;
  data: {
    id: number | null;
    accessToken: string | null;
    refreshToken: string | null;
  }
}