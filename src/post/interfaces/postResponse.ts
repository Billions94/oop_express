import { Post } from '../entity/post';

export interface PostResponse {
  statusCode: number;
  success: boolean;
  errorMessage: string;
  data: {
    post: Post | null
  }
}