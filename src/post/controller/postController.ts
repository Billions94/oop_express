import { PostService } from '../service/postService';
import { Request } from 'express';
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

@Path('api/posts')
export class PostController {
  @Inject
  private readonly postService: PostService;

  @GET
  async getPosts(): Promise<Post[]> {
    return this.postService.getAllPosts();
  }

  @GET
  @Path(':id')
  async getPostById(@PathParam('id') id: number) {
    return this.postService.getPostById(id);
  }

  @POST
  async createPost(@ContextRequest { user }: Request, input: PostInput) {
    return this.postService.createPost(input, <User>user);
  }

  @PATCH
  @Path(':id')
  async updatePost(@PathParam('id') id: number, update: PostInput) {
    return this.postService.updatePost(id, update);
  }

  @DELETE
  @Path(':id')
  async deletePost(@PathParam('id') id: number) {
    return this.postService.deletePost(id);
  }
}
