export interface CreatePostResponse {
  status: string;
  data: {
    id: number | null;
  };
  errorMessage: string;
}