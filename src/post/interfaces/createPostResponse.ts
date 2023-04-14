export interface CreatePostResponse {
  statusCode: number;
  errorMessage: string;
  data: {
    id: number | null;
  };
}