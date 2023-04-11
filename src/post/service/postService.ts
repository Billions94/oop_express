import { PostInput } from '../interfaces/postInput';
import { CreatePostResponse } from '../interfaces/createPostResponse';
import { Post } from '../entity/post';
import { PostRepository } from '../repository/postRepository';
import { User } from '../../user/entity/user';
import { PostResponse } from '../interfaces/postResponse';
import { PostServiceInterface } from '../interfaces/postServiceInterface';
import { DeleteResult } from 'typeorm';
import { Container, Service } from 'typedi';

@Service()
export class PostService implements PostServiceInterface {
  constructor(private readonly postRepository: PostRepository) {}
  async createPost(
    postInput: PostInput,
    user: User
  ): Promise<Partial<CreatePostResponse>> {
    try {
      const post: Post = new Post();
      post.user = user;
      post.content = postInput.content;
      post.media = <string>postInput.media;
      post.createdAt = new Date();

      await this.postRepository.save(post);
      return { status: '200: success', data: { id: post.id } };
    } catch (e) {
      return {
        status: '400: Bad request',
        errorMessage: e.message,
        data: {
          id: null,
        },
      };
    }
  }

  async getAllPosts(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.find();

    if (posts.length > 0) {
      return posts.map((p) => p.toJSONObject()) as Post[];
    }
    return [];
  }

  async getPostById(id: number): Promise<Post> {
    return <Post>await this.postRepository.findById(id);
  }

  async updatePost(
    id: number,
    update: PostInput
  ): Promise<Partial<PostResponse>> {
    try {
      await this.postRepository.update({ id: id }, update);
      const post = <Post>await this.postRepository.findById(id);
      post.updatedAt = new Date();
      await this.postRepository.save(post);
      return {
        status: '203:OK, success',
        data: { post: <Post>post.toJSONObject() },
      };
    } catch (e) {
      return {
        status: '404: bad request',
        errorMessage: e.message,
        data: { post: null },
      };
    }
  }

  async deletePost(id: number): Promise<DeleteResult> {
    return await this.postRepository.delete({ id });
  }
}
