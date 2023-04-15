import { PostService } from '../service/postService';
import { Request, Router } from 'express';
import { Service } from 'typedi';
import { Inject } from 'typescript-ioc';
import {
  ContextRequest,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
} from 'typescript-rest';
import { Post } from '../entity/post';
import { PostInput } from '../interfaces/postInput';
import { User } from '../../user/entity/user';

@Service()
@Path('/api/posts')
export class PostController {
  @Inject
  private readonly postService: PostService;

  @GET
  async getPosts(): Promise<Post[]> {
    return await this.postService.getAllPosts();
  }

  @GET
  @Path(':id')
  async getPostById(@PathParam('id') id: number) {
    return await this.postService.getPostById(id);
  }

  @POST
  async createPost(@ContextRequest { user }: Request, input: PostInput) {
    return await this.postService.createPost(input, <User>user);
  }

  @PATCH
  @Path(':id')
  async updatePost(@PathParam('id') id: number, update: PostInput) {
    return await this.postService.updatePost(id, update);
  }

  @DELETE
  @Path(':id')
  async deletePost(@PathParam('id') id: number) {
    return await this.postService.deletePost(id);
  }

  init() {
    return Router()
  }
}
