import { Post } from '../entity/post';

export interface PostResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errorMessage: string;
  data: {
    post: Post | null
  }
}