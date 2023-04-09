export interface CreateUserResponse {
  status: string | number;
  message: string;
  data: {
    id: number | null;
    accessToken: string | null;
    refreshToken: string | null;
  }
}