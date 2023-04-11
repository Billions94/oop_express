import { Post } from '../entity/post';

export interface PostResponse {
  status: string;
  errorMessage: string;
  data: {
    post: Post | null
  }
}