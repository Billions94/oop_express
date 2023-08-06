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
import { PostResponse } from '../interfaces/postResponse';
import { CreatePostResponse } from '../interfaces/createPostResponse';
import { DeletePostResponse } from '../interfaces/deletePostResponse';

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
  async getPostById(
    @PathParam('id') id: number
  ): Promise<Partial<PostResponse>> {
    return this.postService.getPostById(id);
  }

  @POST
  async createPost(
    @ContextRequest { user }: Request,
    input: PostInput
  ): Promise<Partial<CreatePostResponse>> {
    return this.postService.createPost(input, <User>user);
  }

  @PATCH
  @Path(':id')
  async updatePost(
    @PathParam('id') id: number,
    update: PostInput
  ): Promise<Partial<PostResponse>> {
    return this.postService.updatePost(id, update);
  }

  @DELETE
  @Path(':id')
  async deletePost(
    @PathParam('id') id: number
  ): Promise<Partial<DeletePostResponse>> {
    return this.postService.deletePost(id);
  }
}
