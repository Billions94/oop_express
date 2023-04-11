export interface CreateUserResponse {
  status: string | number;
  errorMessage: string;
  data: {
    id: number | null;
    accessToken: string | null;
    refreshToken: string | null;
  }
}