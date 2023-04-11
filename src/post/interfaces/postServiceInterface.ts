import { PostInput } from './postInput';
import { CreatePostResponse } from './createPostResponse';
import { Post } from '../entity/post';
import { PostResponse } from './postResponse';
import { DeleteResult } from 'typeorm';
import { User } from '../../user/entity/user';

export interface PostServiceInterface {
  createPost(postInput: PostInput, user: User): Promise<Partial<CreatePostResponse>>;

  getAllPosts(): Promise<Post[]>;

  getPostById(id: number): Promise<Post>;

  updatePost(id: number, update: PostInput): Promise<Partial<PostResponse>>;

  deletePost(id: number): Promise<DeleteResult>;
}