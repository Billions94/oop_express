import { Post } from '../entity/post';
import { PostRepository } from '../repository/postRepository';
import { User } from '../../user/entity/user';
import { Validator } from '../../utils/validators/validators';
import { PostInput } from '../interfaces/postInput';
import { CreatePostResponse } from '../interfaces/createPostResponse';
import { PostResponse } from '../interfaces/postResponse';
import { PostServiceInterface } from '../interfaces/postServiceInterface';
import { Service } from 'typedi';
import { postResponseMapper } from '../mapper/response/postResponseMapper';
import { DeletePostResponse } from '../interfaces/deletePostResponse';
import { postRequestMapper } from '../mapper/request/postRequestMapper';
import Logger from '../../utils/log/Logger';
import { Inject } from 'typescript-ioc';

@Service()
export class PostService implements PostServiceInterface {
  @Inject
  private readonly  postRepository: PostRepository

  async createPost(
    postInput: PostInput,
    user: User
  ): Promise<Partial<CreatePostResponse>> {
    try {
      Validator.validatePostInput(postInput);
      const post: Post = postRequestMapper(postInput, user);
      await this.postRepository.save(post);

      return { statusCode: 200, data: { id: post.id } };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: { id: null },
      };
    }
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      return await this.postRepository
        .find()
        .then((post) => post.map(postResponseMapper));
    } catch (e) {
      Logger.info(e.message);
      return [];
    }
  }

  async getPostById(id: number): Promise<Partial<PostResponse>> {
    try {
      await Validator.throwErrorIfNotExist(id, 'post');
      const post = await this.postRepository
        .findById(id)
        .then(postResponseMapper);
      return { statusCode: 200, success: true, data: { post } };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        success: false,
        errorMessage: e.message,
        data: { post: null },
      };
    }
  }

  async updatePost(
    id: number,
    update: PostInput
  ): Promise<Partial<PostResponse>> {
    try {
      await Validator.throwErrorIfNotExist(id, 'post');
      await this.postRepository.update({ id: id }, update);
      const post = await this.postRepository
        .findById(id)
        .then(postResponseMapper);

      await this.postRepository.save(post);
      return {
        statusCode: 203,
        success: true,
        data: { post: post },
      };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: { post: null },
      };
    }
  }

  async deletePost(id: number): Promise<Partial<DeletePostResponse>> {
    try {
      await Validator.throwErrorIfNotExist(id, 'post');
      await this.postRepository.deleteById(id);
      return { statusCode: 200, success: true };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        success: false,
        errorMessage: e.message,
      };
    }
  }
}
