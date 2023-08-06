import { PostInput } from './postInput';
import { CreatePostResponse } from './createPostResponse';
import { Post } from '../entity/post';
import { PostResponse } from './postResponse';
import { User } from '../../user/entity/user';
import { DeletePostResponse } from './deletePostResponse';

export interface PostServiceInterface {
  createPost(
    postInput: PostInput,
    user: User
  ): Promise<Partial<CreatePostResponse>>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Partial<PostResponse>>;
  updatePost(id: number, update: PostInput): Promise<Partial<PostResponse>>;
  deletePost(id: number): Promise<Partial<DeletePostResponse>>;
}
